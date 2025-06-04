
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function WeeklyProgress() {
  // Mock data para demonstração
  const horasTrabalhadas = 22.5;
  const metaSemanal = 30;
  const progresso = (horasTrabalhadas / metaSemanal) * 100;
  
  const diasSemana = [
    { dia: 'Segunda', horas: 6, status: 'concluido' },
    { dia: 'Terça', horas: 5.5, status: 'concluido' },
    { dia: 'Quarta', horas: 6, status: 'concluido' },
    { dia: 'Quinta', horas: 5, status: 'concluido' },
    { dia: 'Sexta', horas: 0, status: 'pendente' },
    { dia: 'Sábado', horas: 0, status: 'pendente' },
    { dia: 'Domingo', horas: 0, status: 'folga' },
  ];

  const horasRestantes = Math.max(0, metaSemanal - horasTrabalhadas);

  return (
    <div className="space-y-8">
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-publievo-orange-400 to-publievo-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Horas Trabalhadas</p>
                <p className="text-3xl font-bold">{horasTrabalhadas}h</p>
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
                <p className="text-3xl font-bold">{horasRestantes}h</p>
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
            Acompanhe o progresso da sua jornada semanal de 30 horas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-semibold text-publievo-purple-700">{progresso.toFixed(1)}%</span>
            </div>
            <Progress 
              value={progresso} 
              className="h-3 bg-gray-200"
            />
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-publievo-orange-600">{horasTrabalhadas}h</p>
              <p className="text-sm text-gray-600">Trabalhadas</p>
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
            Horas trabalhadas por dia da semana atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {diasSemana.map((dia, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-publievo-soft hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  {dia.status === 'concluido' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {dia.status === 'pendente' && <Clock className="w-5 h-5 text-yellow-500" />}
                  {dia.status === 'folga' && <Calendar className="w-5 h-5 text-gray-400" />}
                  <div>
                    <p className="font-medium text-gray-800">{dia.dia}</p>
                    <p className="text-sm text-gray-600">
                      {dia.status === 'folga' ? 'Dia de folga' : 
                       dia.status === 'pendente' ? 'Aguardando registro' : 
                       'Registrado'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-publievo-orange-600">
                    {dia.horas > 0 ? `${dia.horas}h` : '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Recomendações */}
      {horasRestantes > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-l-yellow-400">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Atenção!</h4>
                <p className="text-gray-700">
                  Você ainda precisa trabalhar <strong>{horasRestantes}h</strong> para atingir sua meta semanal de 30 horas.
                  {horasRestantes <= 8 && (
                    <span className="block mt-1 text-green-700">
                      ✨ Quase lá! Apenas {horasRestantes}h restantes.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {progresso >= 100 && (
        <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-400">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Parabéns! 🎉</h4>
                <p className="text-gray-700">
                  Você atingiu sua meta semanal de 30 horas! Continue assim!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
