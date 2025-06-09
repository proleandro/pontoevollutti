
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Clock } from 'lucide-react';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const result = await login();
      if (result.success) {
        toast({
          title: "Acesso liberado!",
          description: "Bem-vindo ao Sistema de Ponto Publievo",
        });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao acessar",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao acessar o sistema",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-publievo-orange-50 via-white to-publievo-purple-50 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo e Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-publievo rounded-2xl flex items-center justify-center animate-pulse-glow">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-publievo bg-clip-text text-transparent">
              Sistema de Ponto
            </h1>
            <p className="text-xl font-semibold text-publievo-purple-700">Publievo</p>
            <p className="text-gray-600 mt-2">Controle de presença para estágios</p>
          </div>
        </div>

        {/* Formulário de Acesso Simplificado */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">
              Acessar Sistema
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Clique no botão abaixo para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-publievo hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Carregando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Entrar</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Publievo. Sistema de Ponto Eletrônico.</p>
        </div>
      </div>
    </div>
  );
}
