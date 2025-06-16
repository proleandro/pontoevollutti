
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatHorasMinutos } from '../lib/utils';

interface ColaboradorSemanaAnterior {
  id: string;
  nome: string;
  cargo: string;
  horasEstagioSemanaAnterior: number;
}

export function PreviousWeekOverview() {
  const [colaboradores, setColaboradores] = useState<ColaboradorSemanaAnterior[]>([]);
  const [loading, setLoading] = useState(true);

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

  const carregarTotaisSemanaAnterior = async () => {
    try {
      setLoading(true);
      console.log('Carregando totais da semana anterior...');

      // Calcular início e fim da semana anterior (domingo a sábado)
      const hoje = new Date();
      const domingoSemanaAtual = new Date(hoje);
      domingoSemanaAtual.setDate(hoje.getDate() - hoje.getDay());
      
      // Semana anterior começa 7 dias antes do domingo atual
      const domingoSemanaAnterior = new Date(domingoSemanaAtual);
      domingoSemanaAnterior.setDate(domingoSemanaAtual.getDate() - 7);
      domingoSemanaAnterior.setHours(0, 0, 0, 0);
      
      const sabadoSemanaAnterior = new Date(domingoSemanaAnterior);
      sabadoSemanaAnterior.setDate(domingoSemanaAnterior.getDate() + 6);
      sabadoSemanaAnterior.setHours(23, 59, 59, 999);

      console.log('Período da semana anterior:', domingoSemanaAnterior.toISOString(), 'até', sabadoSemanaAnterior.toISOString());

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

      // Buscar pontos da semana anterior para todos os colaboradores
      const { data: pontos, error: pontosError } = await supabase
        .from('ponto_registros')
        .select('colaborador_id, horas_liquidas, data, entrada, saida')
        .gte('data', domingoSemanaAnterior.toISOString().split('T')[0])
        .lte('data', sabadoSemanaAnterior.toISOString().split('T')[0]);

      if (pontosError) {
        console.error('Erro ao carregar pontos:', pontosError);
        return;
      }

      console.log('Pontos da semana anterior encontrados:', pontos?.length || 0);

      // Calcular total para cada estagiário
      const totaisColaboradores = colaboradores?.map(colaborador => {
        const pontosColaborador = pontos?.filter(p => p.colaborador_id === colaborador.id) || [];
        const horasEstagioSemanaAnterior = pontosColaborador.reduce((total, ponto) => {
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

        console.log(`${colaborador.nome}: ${horasEstagioSemanaAnterior}h semana anterior`);

        return {
          id: colaborador.id,
          nome: colaborador.nome,
          cargo: colaborador.cargo,
          horasEstagioSemanaAnterior
        };
      }) || [];

      // Ordenar por total de horas (maior primeiro)
      totaisColaboradores.sort((a, b) => b.horasEstagioSemanaAnterior - a.horasEstagioSemanaAnterior);

      setColaboradores(totaisColaboradores);
    } catch (error) {
      console.error('Erro ao carregar totais da semana anterior:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTotaisSemanaAnterior();
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-publievo-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando totais da semana anterior...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Calendar className="w-6 h-6 text-publievo-purple-500" />
          <span>Totais da Semana Anterior</span>
        </CardTitle>
        <CardDescription>
          Total de horas de estágio de cada colaborador na semana anterior
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {colaboradores.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
            <p className="text-gray-600">Nenhum dado encontrado para a semana anterior</p>
          </div>
        ) : (
          <div className="space-y-3">
            {colaboradores.map((colaborador) => (
              <div
                key={colaborador.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border hover:shadow-md transition-all duration-200"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{colaborador.nome}</h3>
                  <p className="text-sm text-gray-600">{colaborador.cargo}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-publievo-orange-600">
                    {formatHorasMinutos(colaborador.horasEstagioSemanaAnterior)}
                  </p>
                  <p className="text-xs text-gray-500 uppercase font-medium">Horas de Estágio</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
