
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Plus } from 'lucide-react';

interface AdminPontoFormProps {
  colaboradores: any[];
  onSuccess: () => void;
}

export function AdminPontoForm({ colaboradores, onSuccess }: AdminPontoFormProps) {
  const [colaboradorId, setColaboradorId] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        data: data
      };

      if (entrada) {
        pontoData.entrada = new Date(`${data}T${entrada}`).toISOString();
      }

      if (saida) {
        pontoData.saida = new Date(`${data}T${saida}`).toISOString();
      }

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
      setData(new Date().toISOString().split('T')[0]);
      setEntrada('');
      setSaida('');
      
      // Chamar callback para atualizar dados
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

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Clock className="w-5 h-5 text-publievo-orange-500" />
          <span>Lançamento Manual de Ponto</span>
        </CardTitle>
        <CardDescription>
          Registre entrada e saída manualmente para colaboradores
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
                  {colaboradores.map((colaborador) => (
                    <SelectItem key={colaborador.id} value={colaborador.id}>
                      {colaborador.nome} - {colaborador.cargo}
                    </SelectItem>
                  ))}
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
            disabled={loading}
            className="w-full bg-gradient-publievo hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {loading ? 'Lançando...' : 'Lançar Ponto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
