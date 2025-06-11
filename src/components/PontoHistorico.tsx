
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { History, Edit, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PontoHistoricoProps {
  colaboradores: any[];
  onUpdate: () => void;
}

interface PontoRegistro {
  id: string;
  colaborador_id: string;
  data: string;
  entrada: string | null;
  saida: string | null;
  horas_liquidas: number;
  colaborador: { nome: string; cargo: string };
}

export function PontoHistorico({ colaboradores, onUpdate }: PontoHistoricoProps) {
  const [pontos, setPontos] = useState<PontoRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroColaborador, setFiltroColaborador] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [editingPonto, setEditingPonto] = useState<PontoRegistro | null>(null);
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarPontos();
  }, []);

  const carregarPontos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ponto_registros')
        .select(`
          *,
          colaborador:users!colaborador_id(nome, cargo)
        `)
        .order('data', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPontos(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar histórico de pontos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ponto: PontoRegistro) => {
    setEditingPonto(ponto);
    setEntrada(ponto.entrada ? new Date(ponto.entrada).toTimeString().slice(0, 5) : '');
    setSaida(ponto.saida ? new Date(ponto.saida).toTimeString().slice(0, 5) : '');
    setDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPonto) return;

    try {
      const pontoData: any = {};

      if (entrada) {
        pontoData.entrada = new Date(`${editingPonto.data}T${entrada}`).toISOString();
      } else {
        pontoData.entrada = null;
      }

      if (saida) {
        pontoData.saida = new Date(`${editingPonto.data}T${saida}`).toISOString();
      } else {
        pontoData.saida = null;
      }

      const { error } = await supabase
        .from('ponto_registros')
        .update(pontoData)
        .eq('id', editingPonto.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ponto atualizado com sucesso!",
      });

      setDialogOpen(false);
      setEditingPonto(null);
      carregarPontos();
      onUpdate();
    } catch (error: any) {
      console.error('Erro ao atualizar ponto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ponto: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (pontoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro de ponto?')) return;

    try {
      const { error } = await supabase
        .from('ponto_registros')
        .delete()
        .eq('id', pontoId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Registro de ponto excluído com sucesso!",
      });

      carregarPontos();
      onUpdate();
    } catch (error: any) {
      console.error('Erro ao excluir ponto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir ponto: " + error.message,
        variant: "destructive"
      });
    }
  };

  const pontosFiltrados = pontos.filter(ponto => {
    const matchColaborador = !filtroColaborador || ponto.colaborador_id === filtroColaborador;
    const matchData = !filtroData || ponto.data === filtroData;
    return matchColaborador && matchData;
  });

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-publievo-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando histórico...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <History className="w-5 h-5 text-publievo-orange-500" />
            <span>Histórico de Pontos</span>
          </CardTitle>
          <CardDescription>
            Histórico de todos os registros de ponto manuais e automáticos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Filtrar por Colaborador</Label>
              <Select value={filtroColaborador} onValueChange={setFiltroColaborador}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os colaboradores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os colaboradores</SelectItem>
                  {colaboradores.map((colaborador) => (
                    <SelectItem key={colaborador.id} value={colaborador.id}>
                      {colaborador.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filtrar por Data</Label>
              <Input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                placeholder="Todas as datas"
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                onClick={() => {
                  setFiltroColaborador('');
                  setFiltroData('');
                }}
                variant="outline"
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Tabela */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Saída</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pontosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  pontosFiltrados.map((ponto) => (
                    <TableRow key={ponto.id}>
                      <TableCell>
                        {new Date(ponto.data).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ponto.colaborador.nome}</p>
                          <p className="text-sm text-gray-500">{ponto.colaborador.cargo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {ponto.entrada ? 
                          new Date(ponto.entrada).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>
                        {ponto.saida ? 
                          new Date(ponto.saida).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-publievo-orange-600">
                          {ponto.horas_liquidas?.toFixed(1) || '0.0'}h
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(ponto)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(ponto.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro de Ponto</DialogTitle>
            <DialogDescription>
              Edite os horários de entrada e saída do colaborador
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Entrada</Label>
              <Input
                type="time"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Saída</Label>
              <Input
                type="time"
                value={saida}
                onChange={(e) => setSaida(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveEdit} className="bg-gradient-publievo hover:opacity-90 text-white">
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
