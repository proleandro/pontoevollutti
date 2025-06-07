import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, FileText, Download, UserPlus, Settings, Edit, Clock } from 'lucide-react';

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState('colaboradores');
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [pontos, setPontos] = useState<any[]>([]);
  const [editandoPonto, setEditandoPonto] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const sections = [
    { id: 'colaboradores', label: 'Colaboradores', icon: Users },
    { id: 'pontos', label: 'Gestão de Pontos', icon: Clock },
    { id: 'escalas', label: 'Escalas', icon: Calendar },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  useEffect(() => {
    if (user?.tipo === 'admin') {
      carregarColaboradores();
      carregarPontos();
    }
  }, [user]);

  const carregarColaboradores = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('tipo', 'admin')
        .order('nome');

      if (error) {
        console.error('Erro ao carregar colaboradores:', error);
        return;
      }

      setColaboradores(data || []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
    }
  };

  const carregarPontos = async () => {
    try {
      const { data, error } = await supabase
        .from('ponto_registros')
        .select(`
          *,
          users!colaborador_id(nome, cargo)
        `)
        .order('data', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao carregar pontos:', error);
        return;
      }

      setPontos(data || []);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
    }
  };

  const salvarEdicaoPonto = async () => {
    if (!editandoPonto) return;

    try {
      const { error } = await supabase
        .from('ponto_registros')
        .update({
          entrada: editandoPonto.entrada,
          saida: editandoPonto.saida
        })
        .eq('id', editandoPonto.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao salvar alterações: " + error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ponto atualizado com sucesso!",
      });

      setEditandoPonto(null);
      carregarPontos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar alterações",
        variant: "destructive"
      });
    }
  };

  const handleExportReport = (tipo: string) => {
    toast({
      title: "Em desenvolvimento",
      description: `Exportação de relatório de ${tipo} será implementada em breve.`,
    });
  };

  const formatarDataHora = (timestamp: string) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const formatarData = (date: string) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  if (user?.tipo !== 'admin') {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Acesso restrito para administradores.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex space-x-2 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-gradient-publievo text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-publievo-orange-50'
            }`}
          >
            <section.icon className="w-4 h-4" />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Gestão de Pontos */}
      {activeSection === 'pontos' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <Clock className="w-5 h-5 text-publievo-orange-500" />
                <span>Gestão de Pontos dos Estagiários</span>
              </CardTitle>
              <CardDescription>
                Visualize e edite os registros de ponto dos colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pontos.map((ponto) => (
                  <div
                    key={ponto.id}
                    className="p-4 rounded-xl bg-gradient-publievo-soft hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {ponto.users?.nome} - {ponto.users?.cargo}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Data: {formatarData(ponto.data)}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Entrada: </span>
                            <span className="font-medium">
                              {formatarDataHora(ponto.entrada)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Saída: </span>
                            <span className="font-medium">
                              {formatarDataHora(ponto.saida)}
                            </span>
                          </div>
                        </div>
                        {ponto.horas_liquidas > 0 && (
                          <div className="mt-2">
                            <span className="text-gray-600">Horas de Estágio: </span>
                            <span className="font-bold text-publievo-orange-600">
                              {ponto.horas_liquidas}h
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditandoPonto(ponto)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Modal de Edição */}
          {editandoPonto && (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Editar Ponto - {editandoPonto.users?.nome}</CardTitle>
                <CardDescription>
                  Data: {formatarData(editandoPonto.data)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Entrada</Label>
                    <Input
                      type="datetime-local"
                      value={editandoPonto.entrada ? new Date(editandoPonto.entrada).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditandoPonto({
                        ...editandoPonto,
                        entrada: e.target.value ? new Date(e.target.value).toISOString() : null
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Saída</Label>
                    <Input
                      type="datetime-local"
                      value={editandoPonto.saida ? new Date(editandoPonto.saida).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditandoPonto({
                        ...editandoPonto,
                        saida: e.target.value ? new Date(e.target.value).toISOString() : null
                      })}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={salvarEdicaoPonto} className="bg-gradient-publievo hover:opacity-90">
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setEditandoPonto(null)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Colaboradores */}
      {activeSection === 'colaboradores' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <Users className="w-5 h-5 text-publievo-purple-500" />
                <span>Lista de Estagiários</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colaboradores.map((colaborador) => (
                  <div
                    key={colaborador.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-publievo-soft hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">{colaborador.nome}</h4>
                      <p className="text-sm text-gray-600">{colaborador.cargo} • {colaborador.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                        {colaborador.tipo}
                      </span>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Escalas */}
      {activeSection === 'escalas' && (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <Calendar className="w-5 h-5 text-publievo-orange-500" />
              <span>Gestão de Escalas</span>
            </CardTitle>
            <CardDescription>
              Defina as escalas semanais dos estagiários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estagiário</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estagiário" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradores.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semana</Label>
                <Input type="week" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia) => (
                <div key={dia} className="space-y-2">
                  <Label className="text-sm">{dia}</Label>
                  <Input type="time" placeholder="Horário" />
                </div>
              ))}
            </div>

            <Button className="bg-gradient-publievo hover:opacity-90 text-white">
              Salvar Escala
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Relatórios */}
      {activeSection === 'relatorios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <FileText className="w-5 h-5 text-publievo-orange-500" />
                <span>Relatório de Frequência</span>
              </CardTitle>
              <CardDescription>
                Exportar relatório detalhado de presença dos estagiários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Período</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" />
                  <Input type="date" />
                </div>
              </div>
              <Button 
                onClick={() => handleExportReport('frequência')}
                className="w-full bg-gradient-publievo hover:opacity-90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <Calendar className="w-5 h-5 text-publievo-purple-500" />
                <span>Relatório de Escalas</span>
              </CardTitle>
              <CardDescription>
                Comparativo entre escalas previstas e ponto real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estagiário</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os estagiários" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {colaboradores.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleExportReport('escalas')}
                className="w-full bg-gradient-publievo hover:opacity-90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
