
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function PontoCard() {
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');
  const [registrado, setRegistrado] = useState(false);
  const { toast } = useToast();

  const calcularHoras = (entrada: string, saida: string) => {
    if (!entrada || !saida) return 0;
    
    const [entradaH, entradaM] = entrada.split(':').map(Number);
    const [saidaH, saidaM] = saida.split(':').map(Number);
    
    const entradaMinutos = entradaH * 60 + entradaM;
    const saidaMinutos = saidaH * 60 + saidaM;
    const almocoMinutos = 60; // 1 hora de almoço
    
    const totalMinutos = saidaMinutos - entradaMinutos - almocoMinutos;
    return Math.max(0, totalMinutos / 60);
  };

  const horasLiquidas = calcularHoras(entrada, saida);

  const handleRegistrarPonto = () => {
    if (!entrada || !saida) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha os horários de entrada e saída",
        variant: "destructive"
      });
      return;
    }

    setRegistrado(true);
    toast({
      title: "Ponto registrado com sucesso!",
      description: `${horasLiquidas.toFixed(2)} horas líquidas trabalhadas hoje`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulário de Ponto */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Clock className="w-5 h-5 text-publievo-orange-500" />
            <span>Registrar Ponto Hoje</span>
          </CardTitle>
          <CardDescription>
            Registre seus horários de trabalho do dia atual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entrada" className="text-gray-700">Entrada</Label>
              <Input
                id="entrada"
                type="time"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                className="border-gray-200 focus:border-publievo-orange-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saida" className="text-gray-700">Saída</Label>
              <Input
                id="saida"
                type="time"
                value={saida}
                onChange={(e) => setSaida(e.target.value)}
                className="border-gray-200 focus:border-publievo-orange-400"
              />
            </div>
          </div>

          {/* Horários Fixos */}
          <div className="bg-gradient-publievo-soft p-4 rounded-xl">
            <h4 className="font-semibold text-gray-700 mb-2">Horários Fixos</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Saída Almoço:</span>
                <span className="font-semibold text-publievo-purple-700 ml-2">12:00</span>
              </div>
              <div>
                <span className="text-gray-600">Retorno Almoço:</span>
                <span className="font-semibold text-publievo-purple-700 ml-2">13:00</span>
              </div>
            </div>
          </div>

          {/* Cálculo de Horas */}
          {entrada && saida && (
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Resumo do Dia</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Horas Líquidas:</span>
                <span className="text-2xl font-bold text-publievo-orange-600">
                  {horasLiquidas.toFixed(2)}h
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleRegistrarPonto}
            disabled={registrado}
            className="w-full bg-gradient-publievo hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            {registrado ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Ponto Registrado</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Registrar Ponto</span>
              </div>
            )}
          </Button>
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
              <div className={`w-3 h-3 rounded-full ${registrado ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
              <span className="font-medium">
                {registrado ? 'Ponto registrado para hoje' : 'Aguardando registro do ponto'}
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
              <p>• Jornada semanal de 30 horas</p>
              <p>• Horário de almoço: 12:00 às 13:00 (fixo)</p>
              <p>• Registre seu ponto diariamente</p>
              <p>• Consulte seu resumo semanal regularmente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
