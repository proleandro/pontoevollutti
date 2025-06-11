
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Clock, CheckCircle, AlertTriangle, LogIn, LogOut, Coffee } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { WeeklyProgressUpdater } from './WeeklyProgressUpdater';

export function WeeklyProgress() {
  const { user } = useAuth();
  const [horasEstagio, setHorasEstagio] = useState(0);
  const [pontosSemanais, setPontosSemanais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const metaSemanal = 30;
  const progresso = (horasEstagio / metaSemanal) * 100;

  const diasSemana = [
    { dia: 'Segunda', index: 1 },
    { dia: 'Terça', index: 2 },
    { dia: 'Quarta', index: 3 },
    { dia: 'Quinta', index: 4 },
    { dia: 'Sexta', index: 5 },
    { dia: 'Sábado', index: 6 },
    { dia: 'Domingo', index: 0 },
  ];

  const calcularHorasEstagio = (entrada: string, saida: string) => {
    if (!entrada || !saida) return 0;
    
    const entradaDate = new Date(entrada);
    const saidaDate = new Date(saida);
    
    // Calcular diferença em horas
    const diferencaHoras = (saidaDate.getTime() - entradaDate.getTime()) / (1000 * 60 * 60);
    
    // Subtrair 1 hora de almoço (12:00 às 13:00)
    const horasLiquidas = Math.max(0, diferencaHoras - 1);
    
    return Number(horasLiquidas.toFixed(1));
  };

  const carregarDadosSemanais = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Calcular início e fim da semana atual (domingo a sábado)
      const hoje = new Date();
      const domingo = new Date(hoje);
      domingo.setDate(hoje.getDate() - hoje.getDay());
      domingo.setHours(0, 0, 0, 0);
      
      const sabado = new Date(domingo);
      sabado.setDate(domingo.getDate() + 6);
      sabado.setHours(23, 59, 59, 999);

      console.log('Carregando dados semanais para:', user.id);
      console.log('Período:', domingo.toISOString(), 'até', sabado.toISOString());

      const { data: pontos, error } = await supabase
        .from('ponto_registros')
        .select('*')
        .eq('colaborador_id', user.id)
        .gte('data', domingo.toISOString().split('T')[0])
        .lte('data', sabado.toISOString().split('T')[0])
        .order('data', { ascending: true });

      if (error) {
        console.error('Erro ao carregar dados semanais:', error);
        return;
      }

      console.log('Pontos encontrados:', pontos);
      setPontosSemanais(pontos || []);
      
      // Calcular total de horas de estágio da semana
      const totalHoras = pontos?.reduce((total, ponto) => {
        // Se temos horas_liquidas calculadas no banco, usar elas
        if (ponto.horas_liquidas && ponto.horas_liquidas > 0) {
          console.log(`Ponto ${ponto.data}: ${ponto.horas_liquidas}h (do banco)`);
          return total + ponto.horas_liquidas;
        }
        
        // Senão, calcular baseado em entrada e saída
        if (ponto.entrada && ponto.saida) {
          const horasCalculadas = calcularHorasEstagio(ponto.entrada, ponto.saida);
          console.log(`Ponto ${ponto.data}: ${horasCalculadas}h (calculado)`);
          return total + horasCalculadas;
        }
        
        return total;
      }, 0) || 0;
      
      console.log('Total de horas da semana:', totalHoras);
      setHorasEstagio(totalHoras);
    } catch (error) {
      console.error('Erro ao carregar dados semanais:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosSemanais();
  }, [user?.id]);

  const getDiaInfo = (diaIndex: number) => {
    // Encontrar ponto do dia
    const pontoDoDia = pontosSemanais.find(ponto => {
      const dataPonto = new Date(ponto.data + 'T00:00:00');
      return dataPonto.getDay() === diaIndex;
    });

    if (pontoDoDia) {
      // Calcular horas para o dia
      let horas = 0;
      if (pontoDoDia.horas_liquidas && pontoDoDia.horas_liquidas > 0) {
        horas = pontoDoDia.horas_liquidas;
      } else if (pontoDoDia.entrada && pontoDoDia.saida) {
        horas = calcularHorasEstagio(pontoDoDia.entrada, pontoDoDia.saida);
      }

      return {
        status: pontoDoDia.entrada && pontoDoDia.saida ? 'concluido' : 'pendente',
        entrada: pontoDoDia.entrada ? new Date(pontoDoDia.entrada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null,
        saida: pontoDoDia.saida ? new Date(pontoDoDia.saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null,
        horas: horas
      };
    }

    // Domingo é sempre folga
    if (diaIndex === 0) {
      return { status: 'folga', entrada: null, saida: null, horas: 0 };
    }

    // Dias futuros ou sem registro
    return { status: 'pendente', entrada: null, saida: null, horas: 0 };
  };

  const horasRestantes = Math.max(0, metaSemanal - horasEstagio);

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-publievo-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando progresso semanal...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <WeeklyProgressUpdater 
        onUpdate={carregarDadosSemanais} 
        userId={user?.id}
        listenToAllChanges={user?.tipo === 'admin' || user?.tipo === 'gestor'}
      />
      
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-publievo-orange-400 to-publievo-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Horas de Estágio</p>
                <p className="text-3xl font-bold">{horasEstagio.toFixed(1)}h</p>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-publievo-purple-400 to-publievo-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Meta Semanal</p>
                <p className="text-3xl font-bold">{metaSemanal}h</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Horas Restantes</p>
                <p className="text-3xl font-bold">{horasRestantes.toFixed(1)}h</p>
              </div>
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Progresso */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <TrendingUp className="w-5 h-5 text-publievo-orange-500" />
            <span>Progresso Semanal</span>
          </CardTitle>
          <CardDescription>
            Acompanhe o progresso da sua jornada semanal de 30 horas de estágio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-semibold text-publievo-purple-700">{progresso.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(progresso, 100)} 
              className="h-3 bg-gray-200"
            />
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-publievo-orange-600">{horasEstagio.toFixed(1)}h</p>
              <p className="text-sm text-gray-600">De Estágio</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-publievo-purple-600">{metaSemanal}h</p>
              <p className="text-sm text-gray-600">Meta</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento por Dia */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Calendar className="w-5 h-5 text-publievo-purple-500" />
            <span>Detalhamento Semanal</span>
          </CardTitle>
          <CardDescription>
            Registro de entrada, saída e total de horas por dia da semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {diasSemana.map((dia, index) => {
              const diaInfo = getDiaInfo(dia.index);
              return (
                <div
                  key={index}
                  className="border rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {diaInfo.status === 'concluido' && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {diaInfo.status === 'pendente' && <Clock className="w-6 h-6 text-yellow-500" />}
                      {diaInfo.status === 'folga' && <Coffee className="w-6 h-6 text-gray-400" />}
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{dia.dia}</h3>
                        <p className="text-sm text-gray-500">
                          {diaInfo.status === 'folga' ? 'Dia de folga' : 
                           diaInfo.status === 'pendente' ? 'Aguardando registro' : 
                           'Ponto registrado'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid com informações detalhadas */}
                  {diaInfo.status !== 'folga' && (
                    <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Dia</p>
                        <p className="text-sm font-semibold text-gray-800">{dia.dia}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-green-100">
                          <LogIn className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Entrada</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {diaInfo.entrada || '--:--'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-red-100">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Saída</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {diaInfo.saida || '--:--'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-publievo-orange-100">
                          <Clock className="w-4 h-4 text-publievo-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
                          <p className="text-sm font-semibold text-publievo-orange-600">
                            {diaInfo.horas > 0 ? `${diaInfo.horas.toFixed(1)}h` : '--'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lembretes */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-publievo-purple-50 to-publievo-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <AlertTriangle className="w-5 h-5 text-publievo-purple-500" />
            <span>Lembretes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Jornada semanal de 30 horas de estágio</p>
            <p>• Horário de almoço: 12:00 às 13:00 (descontado automaticamente)</p>
            <p>• Marcação automática pela hora do sistema</p>
            <p>• Todos os horários de estágio foram definidos previamente pelo estudante</p>
            <p>• Consulte seu resumo semanal regularmente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
