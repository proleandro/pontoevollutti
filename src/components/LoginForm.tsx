
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Clock } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, senha);
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Sistema de Ponto Publievo",
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
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
            <p className="text-gray-600 mt-2">Controle de presença moderno e intuitivo</p>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">
              {isLogin ? 'Fazer Login' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isLogin 
                ? 'Entre com suas credenciais para acessar o sistema' 
                : 'Crie sua conta para começar a usar o sistema'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-200 focus:border-publievo-orange-400 focus:ring-publievo-orange-400"
                />
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
                    <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-publievo-soft rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-2">Credenciais de Demonstração:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Colaborador:</strong> joao@publievo.com | 123456</p>
                <p><strong>Gestor:</strong> maria@publievo.com | admin123</p>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-publievo-purple-600 hover:text-publievo-purple-800 font-medium transition-colors"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
              </button>
            </div>
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
