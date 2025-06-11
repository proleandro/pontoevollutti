import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

interface AdminPontoFormProps {
  colaboradores: any[];
  onSuccess: () => void;
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

export function AdminPontoForm({ colaboradores, onSuccess }: AdminPontoFormProps) {
  const [colaboradorId, setColaboradorId] = useState('');
  const [data, setData] = useState(formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd'));
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');
  const [loading, setLoading] = useState(false);
  const [pontos, setPontos] = useState<PontoRegistro[]>([]);
  const [editingPonto, setEditingPonto] = useState<PontoRegistro | null>(null);
  const [editData, setEditData] = useState('');
  const [editEntrada, setEditEntrada] = useState('');
  const [editSaida, setEditSaida] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filtrar colaboradores válidos
  const colaboradoresValidos = colaboradores.filter(colaborador => 
    colaborador && colaborador.id && colaborador.id.toString().trim() !== ''
  );

  useEffect(() => {
    carregarPontos();
  }, []);

  const calcularHoras = (entrada: string, saida: string) => {
    if (!entrada || !saida) return 0;
    
    // Criar Date objects simples com os horários
    const [horaEntrada, minutoEntrada] = entrada.split(':').map(Number);
    const [horaSaida, minutoSaida] = saida.split(':').map(Number);
    
    const entradaMinutos = horaEntrada * 60 + minutoEntrada;
    const saidaMinutos = horaSaida * 60 + minutoSaida;
    
    // Calcular diferença em minutos, depois converter para horas
    const diferencaMinutos = saidaMinutos - entradaMinutos;
    const diferencaHoras = diferencaMinutos / 60;
    
    // Subtrair 1 hora de almoço
    const horasLiquidas = Math.max(0, diferencaHoras - 1);
    
    return Number(horasLiquidas.toFixed(1));
  };

  const carregarPontos = async () => {
    try {
      const { data, error } = await supabase
        .from('ponto_registros')
        .select(`
          *,
          colaborador:users!colaborador_id(nome, cargo)
        `)
        .order('data', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      console.log('Pontos carregados:', data);
      setPontos(data || []);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!colaboradorId) {
      toast({
        title: "Erro",
        description: "Selecione um colaborador",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const pontoData: any = {
        colaborador_id: colaboradorId,
        data: data // Usar a data exatamente como selecionada (YYYY-MM-DD)
      };

      if (entrada) {
        // Criar timestamp combinando a data selecionada com o horário
        pontoData.entrada = `${data}T${entrada}:00-03:00`; // Fuso horário de SP fixo
      }

      if (saida) {
        // Criar timestamp combinando a data selecionada com o horário
        pontoData.saida = `${data}T${saida}:00-03:00`; // Fuso horário de SP fixo
      }

      // Calcular horas líquidas se ambos horários estão presentes
      if (entrada && saida) {
        pontoData.horas_liquidas = calcularHoras(entrada, saida);
      }

      console.log('Dados a serem enviados:', pontoData);

      // Verificar se já existe um registro para este colaborador nesta data
      const { data: existingRecord } = await supabase
        .from('ponto_registros')
        .select('id')
        .eq('colaborador_id', colaboradorId)
        .eq('data', data)
        .maybeSingle();

      if (existingRecord) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('ponto_registros')
          .update(pontoData)
          .eq('id', existingRecord.id);

        if (error) {
          throw error;
        }
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('ponto_registros')
          .insert(pontoData);

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Sucesso",
        description: "Ponto lançado com sucesso!",
      });

      // Limpar formulário
      setColaboradorId('');
      setData(formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd'));
      setEntrada('');
      setSaida('');
      
      // Recarregar pontos e chamar callback
      carregarPontos();
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao lançar ponto:', error);
      toast({
        title: "Erro",
        description: "Erro ao lançar ponto: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ponto: PontoRegistro) => {
    setEditingPonto(ponto);
    setEditData(ponto.data);
    setEditEntrada(ponto.entrada ? formatInTimeZone(new Date(ponto.entrada), TIMEZONE, 'HH:mm') : '');
    setEditSaida(ponto.saida ? formatInTimeZone(new Date(ponto.saida), TIMEZONE, 'HH:mm') : '');
    setDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPonto) return;

    try {
      const pontoData: any = {
        data: editData
      };

      if (editEntrada) {
        pontoData.entrada = `${editData}T${editEntrada}:00-03:00`;
      } else {
        pontoData.entrada = null;
      }

      if (editSaida) {
        pontoData.saida = `${editData}T${editSaida}:00-03:00`;
      } else {
        pontoData.saida = null;
      }

      // Calcular horas líquidas
      if (editEntrada && editSaida) {
        pontoData.horas_liquidas = calcularHoras(editEntrada, editSaida);
      } else {
        pontoData.horas_liquidas = 0;
      }

      console.log('Dados de edição:', pontoData);

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
      onSuccess();
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
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao excluir ponto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir ponto: " + error.message,
        variant: "destructive"
      });
    }
  };

  // Calcular total de horas dos pontos carregados
  const totalHorasLancadas = pontos.reduce((total, ponto) => {
    // Se temos horas_liquidas no registro, usar elas
    if (ponto.horas_liquidas && ponto.horas_liquidas > 0) {
      return total + ponto.horas_liquidas;
    }
    
    // Senão, calcular baseado em entrada e saída se ambos existem
    if (ponto.entrada && ponto.saida) {
      const entrada = new Date(ponto.entrada);
      const saida = new Date(ponto.saida);
      const diferencaHoras = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
      const horasLiquidas = Math.max(0, diferencaHoras - 1); // Subtrair 1 hora de almoço
      return total + horasLiquidas;
    }
    
    return total;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Formulário de Lançamento */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Clock className="w-5 h-5 text-publievo-orange-500" />
            <span>Lançamento Manual de Ponto</span>
          </CardTitle>
          <CardDescription>
            Registre entrada e saída manualmente para colaboradores (desconto automático de 1h de almoço)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Colaborador</Label>
                <Select value={colaboradorId} onValueChange={setColaboradorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradoresValidos.length === 0 ? (
                      <SelectItem value="no-colaboradores" disabled>
                        Nenhum colaborador disponível
                      </SelectItem>
                    ) : (
                      colaboradoresValidos.map((colaborador) => (
                        <SelectItem key={colaborador.id} value={colaborador.id.toString()}>
                          {colaborador.nome} - {colaborador.cargo}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entrada</Label>
                <Input
                  type="time"
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  placeholder="Horário de entrada"
                />
              </div>
              <div className="space-y-2">
                <Label>Saída</Label>
                <Input
                  type="time"
                  value={saida}
                  onChange={(e) => setSaida(e.target.value)}
                  placeholder="Horário de saída"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || colaboradoresValidos.length === 0}
              className="w-full bg-gradient-publievo hover:opacity-90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? 'Lançando...' : 'Lançar Ponto'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Pontos Lançados */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-800">
            <span>Pontos Lançados Recentemente</span>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total de Horas</p>
              <p className="text-2xl font-bold text-publievo-orange-600">
                {totalHorasLancadas.toFixed(1)}h
              </p>
            </div>
          </CardTitle>
          <CardDescription>
            Últimos 50 registros de ponto com opções de editar e excluir (desconto automático de 1h de almoço)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Saída</TableHead>
                  <TableHead>Total Horas</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pontos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  pontos.map((ponto) => {
                    // Calcular horas para exibição
                    let horasParaExibir = 0;
                    if (ponto.horas_liquidas && ponto.horas_liquidas > 0) {
                      horasParaExibir = ponto.horas_liquidas;
                    } else if (ponto.entrada && ponto.saida) {
                      const entrada = new Date(ponto.entrada);
                      const saida = new Date(ponto.saida);
                      const diferencaHoras = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
                      horasParaExibir = Math.max(0, diferencaHoras - 1);
                    }

                    return (
                      <TableRow key={ponto.id}>
                        <TableCell>
                          {/* Mostrar a data exatamente como está no banco */}
                          {new Date(ponto.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ponto.colaborador.nome}</p>
                            <p className="text-sm text-gray-500">{ponto.colaborador.cargo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ponto.entrada ? 
                            formatInTimeZone(new Date(ponto.entrada), TIMEZONE, 'HH:mm') : 
                            '-'
                          }
                        </TableCell>
                        <TableCell>
                          {ponto.saida ? 
                            formatInTimeZone(new Date(ponto.saida), TIMEZONE, 'HH:mm') : 
                            '-'
                          }
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-publievo-orange-600">
                            {horasParaExibir.toFixed(1)}h
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
                    );
                  })
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
              Edite a data e os horários de entrada e saída do colaborador (desconto automático de 1h de almoço)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Entrada</Label>
              <Input
                type="time"
                value={editEntrada}
                onChange={(e) => setEditEntrada(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Saída</Label>
              <Input
                type="time"
                value={editSaida}
                onChange={(e) => setEditSaida(e.target.value)}
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
