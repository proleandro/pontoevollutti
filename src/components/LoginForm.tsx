
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Clock, Info } from 'lucide-react';

export function LoginForm() {
  const [emailOrName, setEmailOrName] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(emailOrName, senha);
      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Sistema de Ponto Publievo",
        });
      } else {
        toast({
          title: "Erro no login",
          description: result.error || "Dados incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login",
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

        {/* Formulário de Login */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">
              Fazer Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrName" className="text-gray-700">Email ou Nome</Label>
                <Input
                  id="emailOrName"
                  type="text"
                  placeholder="seu@email.com ou Seu Nome"
                  value={emailOrName}
                  onChange={(e) => setEmailOrName(e.target.value)}
                  required
                  className="border-gray-200 focus:border-publievo-orange-400 focus:ring-publievo-orange-400"
                />
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Info className="w-4 h-4" />
                  <span>Você pode usar seu email ou nome para fazer login</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-gray-700">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="border-gray-200 focus:border-publievo-orange-400 focus:ring-publievo-orange-400"
                />
              </div>
              <Button
                type="submit"
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
            </form>
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
