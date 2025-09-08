
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Edit, Trash2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ColaboradoresListaProps {
  colaboradores: any[];
  onUpdate: () => void;
}

interface EditingColaborador {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  email: string;
  tipo: 'colaborador' | 'gestor';
}

export function ColaboradoresLista({ colaboradores, onUpdate }: ColaboradoresListaProps) {
  const [editingColaborador, setEditingColaborador] = useState<EditingColaborador | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filtrar colaboradores válidos
  const colaboradoresValidos = colaboradores.filter(colaborador => 
    colaborador && colaborador.id && colaborador.nome && colaborador.id.toString().trim() !== ''
  );

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleEdit = (colaborador: any) => {
    setEditingColaborador({
      id: colaborador.id,
      nome: colaborador.nome,
      cpf: colaborador.cpf,
      cargo: colaborador.cargo,
      email: colaborador.email,
      tipo: colaborador.tipo
    });
    setDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingColaborador) return;

    try {
      // Verificar se email já existe (exceto para o próprio colaborador)
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', editingColaborador.email)
        .neq('id', editingColaborador.id)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Erro",
          description: "Este email já está sendo usado por outro colaborador",
          variant: "destructive"
        });
        return;
      }

      // Verificar se CPF já existe (exceto para o próprio colaborador)
      const { data: existingCPF } = await supabase
        .from('users')
        .select('cpf')
        .eq('cpf', editingColaborador.cpf)
        .neq('id', editingColaborador.id)
        .maybeSingle();

      if (existingCPF) {
        toast({
          title: "Erro",
          description: "Este CPF já está sendo usado por outro colaborador",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          nome: editingColaborador.nome,
          cpf: editingColaborador.cpf,
          cargo: editingColaborador.cargo,
          email: editingColaborador.email,
          tipo: editingColaborador.tipo
        })
        .eq('id', editingColaborador.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso!",
      });

      setDialogOpen(false);
      setEditingColaborador(null);
      onUpdate();
    } catch (error: any) {
      console.error('Erro ao atualizar colaborador:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar colaborador: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (colaboradorId: string, nomeColaborador: string) => {
    if (!confirm(`Tem certeza que deseja excluir o colaborador ${nomeColaborador}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      // Primeiro, excluir todos os registros de ponto do colaborador
      const { error: pontoError } = await supabase
        .from('ponto_registros')
        .delete()
        .eq('colaborador_id', colaboradorId);

      if (pontoError) throw pontoError;

      // Depois, excluir todas as escalas do colaborador
      const { error: escalasError } = await supabase
        .from('escalas')
        .delete()
        .eq('colaborador_id', colaboradorId);

      if (escalasError) throw escalasError;

      // Por fim, excluir o colaborador
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', colaboradorId);

      if (userError) throw userError;

      toast({
        title: "Sucesso",
        description: `Colaborador ${nomeColaborador} excluído com sucesso!`,
      });

      onUpdate();
    } catch (error: any) {
      console.error('Erro ao excluir colaborador:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir colaborador: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof EditingColaborador, value: string) => {
    if (!editingColaborador) return;
    
    setEditingColaborador(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: field === 'cpf' ? formatCPF(value) : value
      };
    });
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Users className="w-5 h-5 text-publievo-orange-500" />
          <span>Colaboradores Cadastrados</span>
        </CardTitle>
        <CardDescription>
          Gerencie todos os colaboradores do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colaboradoresValidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum colaborador cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                colaboradoresValidos.map((colaborador) => (
                  <TableRow key={colaborador.id}>
                    <TableCell className="font-medium">{colaborador.nome}</TableCell>
                    <TableCell>{colaborador.email}</TableCell>
                    <TableCell>{colaborador.cpf}</TableCell>
                    <TableCell>{colaborador.cargo}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        colaborador.tipo === 'admin' ? 'bg-red-100 text-red-800' :
                        colaborador.tipo === 'gestor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {colaborador.tipo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(colaborador)}
                          disabled={colaborador.tipo === 'admin'}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(colaborador.id, colaborador.nome)}
                          className="text-red-600 hover:text-red-700"
                          disabled={colaborador.tipo === 'admin'}
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

      {/* Dialog de Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Colaborador</DialogTitle>
            <DialogDescription>
              Atualize as informações do colaborador
            </DialogDescription>
          </DialogHeader>
          {editingColaborador && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input
                  value={editingColaborador.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Nome do colaborador"
                />
              </div>
              
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input
                  value={editingColaborador.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={editingColaborador.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  placeholder="Ex: Estagiário de TI"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingColaborador.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="colaborador@publievo.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Usuário</Label>
                <Select 
                  value={editingColaborador.tipo} 
                  onValueChange={(value: 'colaborador' | 'gestor') => handleInputChange('tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleSaveEdit}
                  className="bg-gradient-publievo hover:opacity-90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
