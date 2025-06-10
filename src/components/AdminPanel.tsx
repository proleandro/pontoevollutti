import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { NovoColaboradorForm } from './NovoColaboradorForm';
import { AdminPontoForm } from './AdminPontoForm';
import { AdminWeeklyOverview } from './AdminWeeklyOverview';
import { WeeklyProgressUpdater } from './WeeklyProgressUpdater';
import { Users, Calendar, FileText, Download, UserPlus, Settings, Edit, Clock, Plus, Trash2, TrendingUp, UserX } from 'lucide-react';

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState('colaboradores');
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [pontos, setPontos] = useState<any[]>([]);
  const [editandoPonto, setEditandoPonto] = useState<any>(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [mostrandoLancamento, setMostrandoLancamento] = useState(false);
  const [mostrandoConfirmacao, setMostrandoConfirmacao] = useState<any>(null);
  const [mostrandoConfirmacaoColaborador, setMostrandoConfirmacaoColaborador] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const sections = [
    { id: 'colaboradores', label: 'Estagiários', icon: Users },
    { id: 'progresso', label: 'Progresso Semanal', icon: TrendingUp },
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

  const excluirPonto = async (pontoId: string) => {
    try {
      const { error } = await supabase
        .from('ponto_registros')
        .delete()
        .eq('id', pontoId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir ponto: " + error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ponto excluído com sucesso!",
      });

      setMostrandoConfirmacao(null);
      carregarPontos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir ponto",
        variant: "destructive"
      });
    }
  };

  const excluirColaborador = async (colaboradorId: string) => {
    try {
      // Primeiro, excluir todos os pontos do colaborador
      const { error: pontosError } = await supabase
        .from('ponto_registros')
        .delete()
        .eq('colaborador_id', colaboradorId);

      if (pontosError) {
        toast({
          title: "Erro",
          description: "Erro ao excluir registros de ponto: " + pontosError.message,
          variant: "destructive"
        });
        return;
      }

      // Depois, excluir o colaborador
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', colaboradorId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir colaborador: " + error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Colaborador excluído com sucesso!",
      });

      setMostrandoConfirmacaoColaborador(null);
      carregarColaboradores();
      carregarPontos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir colaborador",
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

  const handleNovoColaboradorSuccess = () => {
    setMostrandoFormulario(false);
    carregarColaboradores();
  };

  const handleLancamentoSuccess = () => {
    setMostrandoLancamento(false);
    carregarPontos();
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
      {/* Componente de Atualização Automática para Pontos */}
      <WeeklyProgressUpdater onUpdate={carregarPontos} />

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

      {/* Colaboradores */}
      {activeSection === 'colaboradores' && (
        <div className="space-y-6">
          {mostrandoFormulario ? (
            <NovoColaboradorForm 
              onSuccess={handleNovoColaboradorSuccess}
              onCancel={() => setMostrandoFormulario(false)}
            />
          ) : (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-gray-800">
                      <Users className="w-5 h-5 text-publievo-purple-500" />
                      <span>Lista de Estagiários</span>
                    </CardTitle>
                    <CardDescription>
                      Gerencie os estagiários do sistema
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setMostrandoFormulario(true)}
                    className="bg-gradient-publievo hover:opacity-90 text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Estagiário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {colaboradores.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum estagiário cadastrado</p>
                      <p className="text-sm">Clique em "Novo Estagiário" para adicionar</p>
                    </div>
                  ) : (
                    colaboradores.map((colaborador) => (
                      <div
                        key={colaborador.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-publievo-soft hover:shadow-md transition-shadow"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-800">{colaborador.nome}</h4>
                          <p className="text-sm text-gray-600">{colaborador.cargo} • {colaborador.email}</p>
                          <p className="text-xs text-gray-500">CPF: {colaborador.cpf}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            colaborador.tipo === 'gestor' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {colaborador.tipo}
                          </span>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setMostrandoConfirmacaoColaborador(colaborador)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modal de Confirmação de Exclusão de Colaborador */}
          {mostrandoConfirmacaoColaborador && (
            <Dialog open={!!mostrandoConfirmacaoColaborador} onOpenChange={() => setMostrandoConfirmacaoColaborador(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <UserX className="w-5 h-5 text-red-500" />
                    <span>Confirmar Exclusão de Colaborador</span>
                  </DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir o colaborador <strong>{mostrandoConfirmacaoColaborador.nome}</strong>?
                    <br />
                    <span className="text-red-600 font-medium">Esta ação irá excluir também todos os registros de ponto deste colaborador e não pode ser desfeita.</span>
                  </DialogDescription>
                </DialogHeader>
                
                <DialogFooter className="flex space-x-2">
                  <Button variant="outline" onClick={() => setMostrandoConfirmacaoColaborador(null)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => excluirColaborador(mostrandoConfirmacaoColaborador.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Excluir Colaborador
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      {/* Progresso Semanal */}
      {activeSection === 'progresso' && (
        <AdminWeeklyOverview />
      )}

      {/* Gestão de Pontos */}
      {activeSection === 'pontos' && (
        <div className="space-y-6">
          {/* Lançamento Manual */}
          {mostrandoLancamento ? (
            <AdminPontoForm 
              colaboradores={colaboradores}
              onSuccess={handleLancamentoSuccess}
            />
          ) : null}

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <Clock className="w-5 h-5 text-publievo-orange-500" />
                    <span>Gestão de Pontos dos Estagiários</span>
                  </CardTitle>
                  <CardDescription>
                    Visualize, edite e gerencie os registros de ponto dos estagiários (atualização automática)
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setMostrandoLancamento(!mostrandoLancamento)}
                    className="bg-gradient-publievo hover:opacity-90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {mostrandoLancamento ? 'Cancelar' : 'Lançar Ponto'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pontos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum registro de ponto encontrado</p>
                    <p className="text-sm">Os registros aparecerão aqui conforme forem lançados</p>
                  </div>
                ) : (
                  pontos.map((ponto) => (
                    <div
                      key={ponto.id}
                      className="p-6 rounded-xl bg-gradient-publievo-soft hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-800 text-lg">
                              {ponto.users?.nome} - {ponto.users?.cargo}
                            </h4>
                            <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                              {formatarData(ponto.data)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white p-4 rounded-lg border">
                              <span className="text-sm text-gray-500 block mb-1">Entrada</span>
                              <span className="font-semibold text-gray-800">
                                {formatarDataHora(ponto.entrada)}
                              </span>
                            </div>
                            <div className="bg-white p-4 rounded-lg border">
                              <span className="text-sm text-gray-500 block mb-1">Saída</span>
                              <span className="font-semibold text-gray-800">
                                {formatarDataHora(ponto.saida)}
                              </span>
                            </div>
                          </div>
                          
                          {ponto.horas_liquidas > 0 && (
                            <div className="bg-gradient-to-r from-publievo-orange-50 to-publievo-purple-50 p-4 rounded-lg border">
                              <span className="text-sm text-gray-600 block mb-1">Horas de Estágio</span>
                              <span className="text-xl font-bold text-publievo-orange-600">
                                {ponto.horas_liquidas}h
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditandoPonto(ponto)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMostrandoConfirmacao(ponto)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Modal de Edição Modernizado */}
          {editandoPonto && (
            <Dialog open={!!editandoPonto} onOpenChange={() => setEditandoPonto(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Edit className="w-5 h-5 text-publievo-orange-500" />
                    <span>Editar Ponto</span>
                  </DialogTitle>
                  <DialogDescription>
                    {editandoPonto.users?.nome} - {formatarData(editandoPonto.data)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="entrada" className="text-sm font-medium">Entrada</Label>
                    <Input
                      id="entrada"
                      type="datetime-local"
                      value={editandoPonto.entrada ? new Date(editandoPonto.entrada).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditandoPonto({
                        ...editandoPonto,
                        entrada: e.target.value ? new Date(e.target.value).toISOString() : null
                      })}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="saida" className="text-sm font-medium">Saída</Label>
                    <Input
                      id="saida"
                      type="datetime-local"
                      value={editandoPonto.saida ? new Date(editandoPonto.saida).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditandoPonto({
                        ...editandoPonto,
                        saida: e.target.value ? new Date(e.target.value).toISOString() : null
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <DialogFooter className="flex space-x-2">
                  <Button variant="outline" onClick={() => setEditandoPonto(null)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={salvarEdicaoPonto} 
                    className="bg-gradient-publievo hover:opacity-90 text-white"
                  >
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Modal de Confirmação de Exclusão */}
          {mostrandoConfirmacao && (
            <Dialog open={!!mostrandoConfirmacao} onOpenChange={() => setMostrandoConfirmacao(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <span>Confirmar Exclusão</span>
                  </DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir o ponto de {mostrandoConfirmacao.users?.nome} do dia {formatarData(mostrandoConfirmacao.data)}?
                    <br />
                    <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
                  </DialogDescription>
                </DialogHeader>
                
                <DialogFooter className="flex space-x-2">
                  <Button variant="outline" onClick={() => setMostrandoConfirmacao(null)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => excluirPonto(mostrandoConfirmacao.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Ponto
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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
