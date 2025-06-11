
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, Clock, Calendar, Search } from 'lucide-react';

interface EscalaData {
  id: string;
  colaborador_id: string;
  colaborador_nome: string;
  semana: string;
  segunda: string | null;
  terca: string | null;
  quarta: string | null;
  quinta: string | null;
  sexta: string | null;
  sabado: string | null;
  domingo: string | null;
}

export function EscalasRecuperacao() {
  const [escalas, setEscalas] = useState<EscalaData[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarEscalasExistentes = async () => {
    try {
      setLoading(true);
      console.log('Buscando escalas existentes...');

      // Buscar todas as escalas com informações dos colaboradores
      const { data: escalasData, error } = await supabase
        .from('escalas')
        .select(`
          id,
          colaborador_id,
          semana,
          segunda,
          terca,
          quarta,
          quinta,
          sexta,
          sabado,
          domingo,
          users!inner(nome)
        `)
        .order('semana', { ascending: false });

      if (error) {
        console.error('Erro ao buscar escalas:', error);
        return;
      }

      console.log('Dados de escalas encontrados:', escalasData);

      // Mapear os dados para incluir o nome do colaborador
      const escalasFormatadas = escalasData?.map(escala => ({
        id: escala.id,
        colaborador_id: escala.colaborador_id,
        colaborador_nome: (escala.users as any)?.nome || 'Nome não encontrado',
        semana: escala.semana,
        segunda: escala.segunda,
        terca: escala.terca,
        quarta: escala.quarta,
        quinta: escala.quinta,
        sexta: escala.sexta,
        sabado: escala.sabado,
        domingo: escala.domingo
      })) || [];

      setEscalas(escalasFormatadas);
      
      // Filtrar apenas as escalas que têm segunda ou terça preenchidas
      const escalasComSegundaTerca = escalasFormatadas.filter(escala => 
        escala.segunda || escala.terca
      );

      console.log('Escalas com segunda/terça encontradas:', escalasComSegundaTerca);

    } catch (error) {
      console.error('Erro ao recuperar escalas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarEscalasExistentes();
  }, []);

  const formatarHorario = (horario: string | null) => {
    if (!horario) return '--:--';
    return horario;
  };

  const escalasComHorarios = escalas.filter(escala => 
    escala.segunda || escala.terca || escala.quarta || escala.quinta || escala.sexta || escala.sabado || escala.domingo
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-publievo-orange-50 to-publievo-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Search className="w-6 h-6 text-publievo-orange-500" />
            <span>Recuperação de Horários Cadastrados</span>
          </CardTitle>
          <CardDescription>
            Visualize os horários de segunda e terça-feira já cadastrados para os colaboradores
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Botão para Atualizar */}
      <div className="flex justify-center">
        <Button 
          onClick={buscarEscalasExistentes}
          disabled={loading}
          className="bg-publievo-orange-500 hover:bg-publievo-orange-600"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Carregando...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Atualizar Dados</span>
            </div>
          )}
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total de Escalas</p>
                <p className="text-2xl font-bold">{escalas.length}</p>
              </div>
              <Calendar className="w-6 h-6 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-400 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Com Horários</p>
                <p className="text-2xl font-bold">{escalasComHorarios.length}</p>
              </div>
              <Clock className="w-6 h-6 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-publievo-purple-400 to-publievo-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Colaboradores</p>
                <p className="text-2xl font-bold">
                  {new Set(escalas.map(e => e.colaborador_id)).size}
                </p>
              </div>
              <Users className="w-6 h-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Escalas */}
      {loading ? (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-publievo-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando escalas...</p>
          </CardContent>
        </Card>
      ) : escalasComHorarios.length === 0 ? (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
            <p className="text-gray-600">Nenhuma escala com horários encontrada</p>
            <p className="text-sm text-gray-500 mt-2">
              Verifique se os dados foram inseridos corretamente na tabela escalas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {escalasComHorarios.map((escala) => (
            <Card key={escala.id} className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-800">{escala.colaborador_nome}</CardTitle>
                    <CardDescription>
                      Semana: {new Date(escala.semana + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="bg-publievo-orange-100 text-publievo-orange-800 px-2 py-1 rounded-lg text-xs font-medium">
                      ID: {escala.colaborador_id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Horários da Semana */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Segunda-feira</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatarHorario(escala.segunda)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Terça-feira</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatarHorario(escala.terca)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Quarta-feira</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {formatarHorario(escala.quarta)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Quinta-feira</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatarHorario(escala.quinta)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Sexta-feira</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatarHorario(escala.sexta)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Sábado</p>
                    <p className="text-lg font-bold text-purple-600">
                      {formatarHorario(escala.sabado)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
