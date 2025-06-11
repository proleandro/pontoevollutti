
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Save, X } from 'lucide-react';

interface NovoColaboradorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NovoColaboradorForm({ onSuccess, onCancel }: NovoColaboradorFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cargo: '',
    email: '',
    tipo: 'colaborador' as 'colaborador' | 'gestor',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf') {
      setFormData(prev => ({ ...prev, [field]: formatCPF(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Erro de validação",
        description: "Email válido é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      toast({
        title: "Erro de validação",
        description: "CPF deve ter 11 dígitos",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.senha || formData.senha.length < 4) {
      toast({
        title: "Erro de validação",
        description: "Senha deve ter pelo menos 4 caracteres",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Verificar se email já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Erro",
          description: "Este email já está cadastrado",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Verificar se CPF já existe
      const { data: existingCPF } = await supabase
        .from('users')
        .select('cpf')
        .eq('cpf', formData.cpf)
        .maybeSingle();

      if (existingCPF) {
        toast({
          title: "Erro",
          description: "Este CPF já está cadastrado",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Inserir novo colaborador
      const { error } = await supabase
        .from('users')
        .insert([formData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: `Colaborador ${formData.nome} cadastrado com sucesso`,
      });

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao cadastrar colaborador:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar colaborador",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <UserPlus className="w-5 h-5 text-publievo-orange-500" />
          <span>Cadastrar Novo Colaborador</span>
        </CardTitle>
        <CardDescription>
          Preencha os dados do novo estagiário
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                placeholder="Nome do colaborador"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                maxLength={14}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                placeholder="Ex: Estagiário de TI"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="colaborador@publievo.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Usuário</Label>
              <Select value={formData.tipo} onValueChange={(value: 'colaborador' | 'gestor') => handleInputChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colaborador">Colaborador</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha *</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Senha de acesso"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-publievo hover:opacity-90 text-white"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Salvar Colaborador</span>
                </div>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
