
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, Clock, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { WeeklyProgressUpdater } from './WeeklyProgressUpdater';
import { PreviousWeekOverview } from './PreviousWeekOverview';
import { formatHorasMinutos } from '../lib/utils';

interface EstagarioProgresso {
  id: string;
  nome: string;
  cargo: string;
  horasEstagio: number;
  progresso: number;
  horasRestantes: number;
}

export function AdminWeeklyOverview() {
  const [estagiarios, setEstagiarios] = useState<EstagarioProgresso[]>([]);
  const [loading, setLoading] = useState(true);
  const metaSemanal = 30;

  const calcularHorasEstagio = (entrada: string, saida: string) => {
    if (!entrada || !saida) return 0;
    
    const entradaDate = new Date(entrada);
    const saidaDate = new Date(saida);
    
    // Calcular diferença em horas
    const diferencaHoras = (saidaDate.getTime() - entradaDate.getTime()) / (1000 * 60 * 60);
    
    // Definir horário de almoço: 11:59 às 12:59
    const horaEntrada = entradaDate.getHours() + entradaDate.getMinutes() / 60;
    const horaSaida = saidaDate.getHours() + saidaDate.getMinutes() / 60;
    const inicioAlmoco = 11 + 59/60; // 11:59
    const fimAlmoco = 12 + 59/60; // 12:59
    
    // Só descontar almoço se trabalhou durante o horário de almoço
    let horasLiquidas = diferencaHoras;
    if (horaEntrada <= inicioAlmoco && horaSaida >= fimAlmoco) {
      // Trabalhou durante todo o horário de almoço, descontar 1 hora
      horasLiquidas = Math.max(0, diferencaHoras - 1);
    } else if (horaEntrada < fimAlmoco && horaSaida > inicioAlmoco) {
      // Trabalhou parcialmente durante o almoço, descontar proporcionalmente
      const inicioSobreposicao = Math.max(horaEntrada, inicioAlmoco);
      const fimSobreposicao = Math.min(horaSaida, fimAlmoco);
      const horasAlmocoTrabalhadas = Math.max(0, fimSobreposicao - inicioSobreposicao);
      horasLiquidas = Math.max(0, diferencaHoras - horasAlmocoTrabalhadas);
    }
    // Se não trabalhou durante o almoço, não desconta nada
    
    return Number(horasLiquidas.toFixed(1));
  };

  const carregarProgressoEstagiarios = async () => {
    try {
      setLoading(true);
      console.log('Carregando progresso de todos os estagiários...');

      // Calcular início e fim da semana atual (domingo a sábado)
      const hoje = new Date();
      const domingo = new Date(hoje);
      domingo.setDate(hoje.getDate() - hoje.getDay());
      domingo.setHours(0, 0, 0, 0);
      
      const sabado = new Date(domingo);
      sabado.setDate(domingo.getDate() + 6);
      sabado.setHours(23, 59, 59, 999);

      console.log('Período da semana:', domingo.toISOString(), 'até', sabado.toISOString());

      // Buscar todos os colaboradores (não admins)
      const { data: colaboradores, error: colaboradoresError } = await supabase
        .from('users')
        .select('id, nome, cargo')
        .eq('tipo', 'colaborador')
        .order('nome');

      if (colaboradoresError) {
        console.error('Erro ao carregar colaboradores:', colaboradoresError);
        return;
      }

      console.log('Colaboradores encontrados:', colaboradores?.length || 0);

      // Buscar pontos da semana para todos os colaboradores
      const { data: pontos, error: pontosError } = await supabase
        .from('ponto_registros')
        .select('colaborador_id, horas_liquidas, data, entrada, saida')
        .gte('data', domingo.toISOString().split('T')[0])
        .lte('data', sabado.toISOString().split('T')[0]);

      if (pontosError) {
        console.error('Erro ao carregar pontos:', pontosError);
        return;
      }

      console.log('Pontos encontrados:', pontos?.length || 0);
      console.log('Dados dos pontos:', pontos);

      // Calcular progresso para cada estagiário
      const progressoEstagiarios = colaboradores?.map(colaborador => {
        const pontosColaborador = pontos?.filter(p => p.colaborador_id === colaborador.id) || [];
        const horasEstagio = pontosColaborador.reduce((total, ponto) => {
          // Se temos horas_liquidas calculadas no banco, usar elas
          if (ponto.horas_liquidas && ponto.horas_liquidas > 0) {
            console.log(`${colaborador.nome} - ${ponto.data}: ${ponto.horas_liquidas}h (do banco)`);
            return total + ponto.horas_liquidas;
          }
          
          // Senão, calcular baseado em entrada e saída
          if (ponto.entrada && ponto.saida) {
            const horasCalculadas = calcularHorasEstagio(ponto.entrada, ponto.saida);
            console.log(`${colaborador.nome} - ${ponto.data}: ${horasCalculadas}h (calculado)`);
            return total + horasCalculadas;
          }
          
          return total;
        }, 0);
        
        const progresso = (horasEstagio / metaSemanal) * 100;
        const horasRestantes = Math.max(0, metaSemanal - horasEstagio);

        console.log(`${colaborador.nome}: ${horasEstagio}h (${progresso.toFixed(1)}%)`);

        return {
          id: colaborador.id,
          nome: colaborador.nome,
          cargo: colaborador.cargo,
          horasEstagio,
          progresso,
          horasRestantes
        };
      }) || [];

      // Ordenar por progresso (maior primeiro)
      progressoEstagiarios.sort((a, b) => b.progresso - a.progresso);

      setEstagiarios(progressoEstagiarios);
    } catch (error) {
      console.error('Erro ao carregar progresso dos estagiários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProgressoEstagiarios();
  }, []);

  const getProgressoColor = (progresso: number) => {
    if (progresso >= 100) return 'text-green-600';
    if (progresso >= 75) return 'text-publievo-orange-600';
    if (progresso >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressoStatus = (progresso: number) => {
    if (progresso >= 100) return 'Meta atingida';
    if (progresso >= 75) return 'Bom progresso';
    if (progresso >= 50) return 'Em andamento';
    return 'Atenção necessária';
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-publievo-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando progresso dos estagiários...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <WeeklyProgressUpdater 
        onUpdate={carregarProgressoEstagiarios} 
        listenToAllChanges={true}
      />
      
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-publievo-orange-50 to-publievo-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Users className="w-6 h-6 text-publievo-orange-500" />
            <span>Progresso Semanal dos Estagiários</span>
          </CardTitle>
          <CardDescription>
            Acompanhe o progresso de todos os estagiários em relação à meta semanal de 30 horas (com desconto de 1h de almoço por dia)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Estagiários</p>
                <p className="text-2xl font-bold">{estagiarios.length}</p>
              </div>
              <Users className="w-6 h-6 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-400 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Meta Atingida</p>
                <p className="text-2xl font-bold">
                  {estagiarios.filter(e => e.progresso >= 100).length}
                </p>
              </div>
              <Target className="w-6 h-6 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-publievo-orange-400 to-publievo-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Horas</p>
                <p className="text-2xl font-bold">
                  {formatHorasMinutos(estagiarios.reduce((total, e) => total + e.horasEstagio, 0))}
                </p>
              </div>
              <Clock className="w-6 h-6 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-publievo-purple-400 to-publievo-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Progresso Médio</p>
                <p className="text-2xl font-bold">
                  {estagiarios.length > 0 ? 
                    (estagiarios.reduce((total, e) => total + e.progresso, 0) / estagiarios.length).toFixed(1) : 
                    '0'
                  }%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção Totais da Semana Anterior */}
      <PreviousWeekOverview />

      {/* Cards dos Estagiários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {estagiarios.length === 0 ? (
          <Card className="col-span-2 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
              <p className="text-gray-600">Nenhum estagiário cadastrado</p>
            </CardContent>
          </Card>
        ) : (
          estagiarios.map((estagiario) => (
            <Card key={estagiario.id} className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-800">{estagiario.nome}</CardTitle>
                    <CardDescription>{estagiario.cargo}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getProgressoColor(estagiario.progresso)}`}>
                      {getProgressoStatus(estagiario.progresso)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gradient-to-br from-publievo-orange-50 to-publievo-orange-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Horas de Estágio</p>
                    <p className="text-lg font-bold text-publievo-orange-600">
                      {formatHorasMinutos(estagiario.horasEstagio)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-publievo-purple-50 to-publievo-purple-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Meta</p>
                    <p className="text-lg font-bold text-publievo-purple-600">30:00</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Restantes</p>
                    <p className="text-lg font-bold text-gray-700">
                      {formatHorasMinutos(estagiario.horasRestantes)}
                    </p>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className={`font-semibold ${getProgressoColor(estagiario.progresso)}`}>
                      {estagiario.progresso.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(estagiario.progresso, 100)} 
                    className="h-3 bg-gray-200"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
