
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';

interface EscalaSemanal {
  colaborador_id: string;
  semana: string;
  segunda_entrada?: string;
  segunda_saida?: string;
  terca_entrada?: string;
  terca_saida?: string;
  quarta_entrada?: string;
  quarta_saida?: string;
  quinta_entrada?: string;
  quinta_saida?: string;
  sexta_entrada?: string;
  sexta_saida?: string;
}

export function EscalasVisualizacao() {
  const { user } = useAuth();
  const [escala, setEscala] = useState<EscalaSemanal | null>(null);
  const [semanaAtual, setSemanaAtual] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const diasSemana = [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca', label: 'Terça' },
    { key: 'quarta', label: 'Quarta' },
    { key: 'quinta', label: 'Quinta' },
    { key: 'sexta', label: 'Sexta' }
  ];

  useEffect(() => {
    if (user) {
      carregarEscala();
    }
  }, [semanaAtual, user]);

  const carregarEscala = async () => {
    try {
      setLoading(true);
      
      const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 0 });
      const semanaString = format(inicioSemana, 'yyyy-MM-dd');

      const { data: escalaData, error } = await supabase
        .from('escalas')
        .select('*')
        .eq('colaborador_id', user!.id)
        .eq('semana', semanaString)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      setEscala(escalaData || {
        colaborador_id: user!.id,
        semana: semanaString,
        segunda_entrada: '',
        segunda_saida: '',
        terca_entrada: '',
        terca_saida: '',
        quarta_entrada: '',
        quarta_saida: '',
        quinta_entrada: '',
        quinta_saida: '',
        sexta_entrada: '',
        sexta_saida: ''
      });
    } catch (error) {
      console.error('Erro ao carregar escala:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da escala",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularHorasDia = (entrada: string, saida: string): number => {
    if (!entrada || !saida) return 0;
    
    const [horaEntrada, minutoEntrada] = entrada.split(':').map(Number);
    const [horaSaida, minutoSaida] = saida.split(':').map(Number);
    
    const minutosEntrada = horaEntrada * 60 + minutoEntrada;
    const minutosSaida = horaSaida * 60 + minutoSaida;
    
    let totalMinutos = minutosSaida - minutosEntrada;
    
    // Descontar 1 hora de almoço se trabalhar mais de 6 horas
    if (totalMinutos > 360) { // 6 horas = 360 minutos
      totalMinutos -= 60; // Desconta 1 hora de almoço
    }
    
    return Math.max(0, totalMinutos);
  };

  const calcularTotalHoras = (): string => {
    if (!escala) return '00:00';
    
    let totalMinutos = 0;

    diasSemana.forEach(dia => {
      const entrada = escala[`${dia.key}_entrada` as keyof EscalaSemanal] as string;
      const saida = escala[`${dia.key}_saida` as keyof EscalaSemanal] as string;
      totalMinutos += calcularHorasDia(entrada || '', saida || '');
    });

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  };

  const proximaSemana = () => {
    setSemanaAtual(addDays(semanaAtual, 7));
  };

  const semanaAnterior = () => {
    setSemanaAtual(addDays(semanaAtual, -7));
  };

  const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 0 });
  const fimSemana = addDays(inicioSemana, 4); // Sexta-feira

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-publievo-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando sua escala...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Calendar className="w-6 h-6 text-publievo-purple-500" />
          <span>Minha Escala Semanal</span>
        </CardTitle>
        <CardDescription>
          Visualize seus horários previstos para a semana (segunda a sexta)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Navegação de semanas */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <Button onClick={semanaAnterior} variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Semana Anterior
          </Button>
          <div className="text-center">
            <h3 className="font-semibold text-lg">
              {format(inicioSemana, 'dd/MM', { locale: ptBR })} a {format(fimSemana, 'dd/MM/yyyy', { locale: ptBR })}
            </h3>
            <p className="text-sm text-gray-600">
              Semana de {format(inicioSemana, 'EEEE', { locale: ptBR })} a {format(fimSemana, 'EEEE', { locale: ptBR })}
            </p>
          </div>
          <Button onClick={proximaSemana} variant="outline" size="sm">
            Próxima Semana
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Tabela de escala */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {diasSemana.map((dia, index) => (
                  <TableHead key={dia.key} className="text-center min-w-32">
                    <div className="space-y-1">
                      <div className="font-semibold">{dia.label}</div>
                      <div className="text-xs text-gray-500">
                        {format(addDays(inicioSemana, index + 1), 'dd/MM', { locale: ptBR })}
                      </div>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center min-w-24 font-semibold">
                  Total Previsto
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {diasSemana.map(dia => {
                  const entrada = escala?.[`${dia.key}_entrada` as keyof EscalaSemanal] as string;
                  const saida = escala?.[`${dia.key}_saida` as keyof EscalaSemanal] as string;
                  
                  return (
                    <TableCell key={dia.key} className="text-center">
                      <div className="space-y-2">
                        {entrada && saida ? (
                          <>
                            <div className="text-sm font-medium text-green-700">
                              {entrada}
                            </div>
                            <div className="text-xs text-gray-500">até</div>
                            <div className="text-sm font-medium text-red-700">
                              {saida}
                            </div>
                            <div className="text-xs text-gray-600 border-t pt-1">
                              {Math.floor(calcularHorasDia(entrada, saida) / 60)}h{String(calcularHorasDia(entrada, saida) % 60).padStart(2, '0')}min
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-400 py-4">
                            Folga
                          </div>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
                <TableCell className="text-center">
                  <div className="text-lg font-bold text-publievo-purple-600">
                    {calcularTotalHoras()}
                  </div>
                  <div className="text-xs text-gray-500">
                    horas
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Informações
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Esta é sua escala prevista definida pela gestão</li>
            <li>• Os horários mostrados são uma previsão - podem haver ajustes</li>
            <li>• O sistema desconta automaticamente 1h de almoço para jornadas acima de 6h</li>
            <li>• Use as setas para consultar outras semanas</li>
            <li>• Para alterações na escala, entre em contato com a gestão</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
