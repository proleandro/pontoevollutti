
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Clock, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const [formData, setFormData] = useState({
    login: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.login.trim() || !formData.senha.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha usuário e senha",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.login, formData.senha);
      if (result.success) {
        toast({
          title: "Acesso liberado!",
          description: "Bem-vindo ao Sistema de Ponto Publievo",
        });
      } else {
        toast({
          title: "Erro de acesso",
          description: result.error || "Usuário ou senha incorretos",
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

        {/* Formulário de Login */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Digite seu usuário e senha para acessar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Usuário</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={formData.login}
                  onChange={(e) => handleInputChange('login', e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-publievo hover:opacity-90 text-white font-semibold py-3 h-12 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entrando...</span>
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
