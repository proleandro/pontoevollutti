
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Clock, CheckCircle, AlertCircle, LogIn, LogOut, Monitor } from 'lucide-react';

export function PontoCard() {
  const [pontoHoje, setPontoHoje] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Detectar se é dispositivo móvel
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || window.innerWidth <= 768;
    };

    setIsMobile(checkIfMobile());

    if (user) {
      carregarPontoHoje();
    }
  }, [user]);

  const carregarPontoHoje = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('ponto_registros')
        .select('*')
        .eq('colaborador_id', user?.id)
        .eq('data', hoje)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar ponto:', error);
        return;
      }

      setPontoHoje(data);
    } catch (error) {
      console.error('Erro ao carregar ponto:', error);
    }
  };

  const registrarEntrada = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const agora = new Date().toISOString();
      const hoje = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('ponto_registros')
        .insert({
          colaborador_id: user.id,
          data: hoje,
          entrada: agora
        });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao registrar entrada: " + error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Entrada registrada!",
        description: `Entrada marcada às ${new Date().toLocaleTimeString('pt-BR')}`,
      });

      carregarPontoHoje();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar entrada",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const registrarSaida = async () => {
    if (!user || !pontoHoje) return;
    
    setLoading(true);
    try {
      const agora = new Date().toISOString();

      const { error } = await supabase
        .from('ponto_registros')
        .update({
          saida: agora
        })
        .eq('id', pontoHoje.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao registrar saída: " + error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Saída registrada!",
        description: `Saída marcada às ${new Date().toLocaleTimeString('pt-BR')}`,
      });

      carregarPontoHoje();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar saída",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatarHora = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Marcação de Ponto */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Clock className="w-5 h-5 text-publievo-orange-500" />
            <span>Marcação de Ponto</span>
          </CardTitle>
          <CardDescription>
            Marque sua entrada e saída automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hora Atual */}
          <div className="text-center p-4 bg-gradient-publievo-soft rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Hora Atual</p>
            <p className="text-3xl font-bold text-publievo-purple-700">
              {new Date().toLocaleTimeString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Registros do Dia */}
          {pontoHoje && (
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">Registros de Hoje</h4>
              <div className="space-y-2 text-sm">
                {pontoHoje.entrada && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entrada:</span>
                    <span className="font-semibold text-green-600">
                      {formatarHora(pontoHoje.entrada)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Saída Almoço:</span>
                  <span className="font-semibold text-publievo-purple-700">12:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retorno Almoço:</span>
                  <span className="font-semibold text-publievo-purple-700">13:00</span>
                </div>
                {pontoHoje.saida && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saída:</span>
                    <span className="font-semibold text-red-600">
                      {formatarHora(pontoHoje.saida)}
                    </span>
                  </div>
                )}
                {pontoHoje.horas_liquidas > 0 && (
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-600">Horas de Estágio:</span>
                    <span className="text-xl font-bold text-publievo-orange-600">
                      {pontoHoje.horas_liquidas}h
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Restrição Mobile */}
          {isMobile && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Monitor className="w-6 h-6 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Acesso via Desktop</h4>
                  <p className="text-sm text-yellow-700">Registre seu ponto pelo PC.</p>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="space-y-3">
            {!pontoHoje?.entrada ? (
              <Button
                onClick={registrarEntrada}
                disabled={loading || isMobile}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>{isMobile ? 'Registre seu ponto pelo PC' : 'Registrar Entrada'}</span>
                </div>
              </Button>
            ) : !pontoHoje?.saida ? (
              <Button
                onClick={registrarSaida}
                disabled={loading || isMobile}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>{isMobile ? 'Registre seu ponto pelo PC' : 'Registrar Saída'}</span>
                </div>
              </Button>
            ) : (
              <div className="w-full bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl text-center">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Ponto Completo</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status e Informações */}
      <div className="space-y-6">
        {/* Status Atual */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Status Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                pontoHoje?.saida ? 'bg-gray-500' : pontoHoje?.entrada ? 'bg-green-500' : 'bg-yellow-500'
              } animate-pulse`}></div>
              <span className="font-medium">
                {pontoHoje?.saida 
                  ? 'Expediente finalizado' 
                  : pontoHoje?.entrada 
                    ? 'Em expediente' 
                    : 'Aguardando entrada'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Lembretes */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-publievo-purple-50 to-publievo-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <AlertCircle className="w-5 h-5 text-publievo-purple-500" />
              <span>Lembretes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Jornada semanal de 30 horas de estágio</p>
              <p>• Horário de almoço: 12:00 às 13:00 (fixo)</p>
              <p>• Marcação automática pela hora do sistema</p>
              <p>• Todos os horários de estágio foram definidos previamente pelo estudante</p>
              <p>• Consulte seu resumo semanal regularmente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
