
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, LogOut, Coffee, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import { ThankYouButton } from './ThankYouButton';

const TIMEZONE = 'America/Sao_Paulo';

export function PontoCard() {
  const { user } = useAuth();
  const [pontoHoje, setPontoHoje] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const { toast } = useToast();

  // Função para obter a data de hoje no fuso horário de São Paulo
  const getHojeLocal = () => {
    const agoraLocal = toZonedTime(new Date(), TIMEZONE);
    return formatInTimeZone(agoraLocal, TIMEZONE, 'yyyy-MM-dd');
  };

  const carregarPontoHoje = async () => {
    if (!user?.id) return;

    try {
      const hoje = getHojeLocal();
      console.log('Carregando ponto para a data (SP):', hoje);
      
      const { data, error } = await supabase
        .from('ponto_registros')
        .select('*')
        .eq('colaborador_id', user.id)
        .eq('data', hoje)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar ponto:', error);
        return;
      }

      console.log('Ponto encontrado:', data);
      setPontoHoje(data);
    } catch (error) {
      console.error('Erro ao carregar ponto do dia:', error);
    }
  };

  useEffect(() => {
    carregarPontoHoje();
  }, [user?.id]);

  const marcarPonto = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const agoraLocal = toZonedTime(new Date(), TIMEZONE);
      const hoje = getHojeLocal();
      
      // Criar timestamp no fuso horário de São Paulo
      const timestamp = formatInTimeZone(agoraLocal, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
      
      console.log('Marcando ponto (SP):', {
        data: hoje,
        timestamp: timestamp,
        temEntrada: !!pontoHoje?.entrada,
        temSaida: !!pontoHoje?.saida
      });

      if (!pontoHoje) {
        // Primeiro ponto do dia - entrada
        const { data, error } = await supabase
          .from('ponto_registros')
          .insert({
            colaborador_id: user.id,
            data: hoje,
            entrada: timestamp
          })
          .select()
          .single();

        if (error) throw error;

        setPontoHoje(data);
        toast({
          title: "Entrada registrada",
          description: `Entrada marcada às ${formatInTimeZone(agoraLocal, TIMEZONE, 'HH:mm')}`,
        });
      } else if (pontoHoje.entrada && !pontoHoje.saida) {
        // Segundo ponto do dia - saída
        const { data, error } = await supabase
          .from('ponto_registros')
          .update({ saida: timestamp })
          .eq('id', pontoHoje.id)
          .select()
          .single();

        if (error) throw error;

        setPontoHoje(data);
        toast({
          title: "Saída registrada",
          description: `Saída marcada às ${formatInTimeZone(agoraLocal, TIMEZONE, 'HH:mm')}`,
        });

        // Mostrar botão de agradecimento
        setShowThankYou(true);
      } else {
        // Já tem entrada e saída - não pode marcar mais
        toast({
          title: "Ponto já completo",
          description: "Você já registrou entrada e saída hoje",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erro ao marcar ponto:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar ponto: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularHorasTrabalhadas = () => {
    if (!pontoHoje?.entrada || !pontoHoje?.saida) return 0;
    
    const entrada = new Date(pontoHoje.entrada);
    const saida = new Date(pontoHoje.saida);
    
    // Calcular diferença em horas
    const diferencaHoras = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
    
    // Definir horário de almoço: 11:59 às 12:59
    const horaEntrada = entrada.getHours() + entrada.getMinutes() / 60;
    const horaSaida = saida.getHours() + saida.getMinutes() / 60;
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
    
    return horasLiquidas;
  };

  const horasTrabalhadas = calcularHorasTrabalhadas();

  return (
    <>
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Clock className="w-5 h-5 text-publievo-orange-500" />
            <span>Ponto Eletrônico</span>
          </CardTitle>
          <CardDescription className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>Hoje, {formatInTimeZone(new Date(), TIMEZONE, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status atual */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <LogIn className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-green-700 font-medium mb-1">ENTRADA</p>
              <p className="text-sm font-bold text-green-800">
                {pontoHoje?.entrada ? 
                  formatInTimeZone(new Date(pontoHoje.entrada), TIMEZONE, 'HH:mm') : 
                  '--:--'
                }
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <Coffee className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-xs text-orange-700 font-medium mb-1">ALMOÇO</p>
              <p className="text-sm font-bold text-orange-800">11:59-12:59</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
              <LogOut className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-xs text-red-700 font-medium mb-1">SAÍDA</p>
              <p className="text-sm font-bold text-red-800">
                {pontoHoje?.saida ? 
                  formatInTimeZone(new Date(pontoHoje.saida), TIMEZONE, 'HH:mm') : 
                  '--:--'
                }
              </p>
            </div>
          </div>

          {/* Horas trabalhadas */}
          {pontoHoje?.entrada && pontoHoje?.saida && (
            <div className="text-center p-4 bg-gradient-to-r from-publievo-purple-50 to-publievo-orange-50 rounded-lg border">
              <p className="text-sm text-gray-600 mb-1">Total de Horas de Estágio</p>
              <p className="text-3xl font-bold text-publievo-orange-600">
                {horasTrabalhadas.toFixed(1)}h
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Desconto automático apenas se trabalhar durante o almoço: 11:59-12:59)
              </p>
            </div>
          )}

          {/* Botão de marcar ponto */}
          <div className="space-y-3">
            <Button 
              onClick={marcarPonto}
              disabled={loading || (pontoHoje?.entrada && pontoHoje?.saida)}
              className="w-full bg-gradient-publievo hover:opacity-90 text-white font-semibold py-3 text-lg"
            >
              <Clock className="w-5 h-5 mr-2" />
              {loading ? 
                'Marcando...' : 
                !pontoHoje ? 
                  'Marcar Entrada' : 
                  !pontoHoje.saida ? 
                    'Marcar Saída' : 
                    'Ponto Completo'
              }
            </Button>
            
            {pontoHoje?.entrada && pontoHoje?.saida && (
              <p className="text-center text-sm text-gray-600">
                ✅ Você já registrou entrada e saída hoje
              </p>
            )}
          </div>

          {/* Informações importantes */}
          <div className="text-xs text-gray-500 space-y-1 border-t pt-3">
            <p>• Horário registrado automaticamente pelo sistema (São Paulo)</p>
            <p>• Intervalo de almoço: 11:59 às 12:59 (descontado apenas se trabalhar neste período)</p>
            <p>• Registre entrada ao chegar e saída ao final do expediente</p>
          </div>
        </CardContent>
      </Card>

      {/* Botão de agradecimento */}
      {showThankYou && (
        <ThankYouButton onClose={() => setShowThankYou(false)} />
      )}
    </>
  );
}
