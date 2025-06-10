
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  login: (loginName: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (loginName: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      console.log('Tentando fazer login com:', { loginName, senha });
      
      // Buscar usuário no Supabase pela coluna 'nome' (que funciona como login)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('nome', loginName)
        .single();

      if (userError) {
        console.error('Erro ao buscar usuário:', userError);
        return { 
          success: false, 
          error: 'Usuário não encontrado' 
        };
      }

      if (!userData) {
        return { 
          success: false, 
          error: 'Usuário não encontrado' 
        };
      }

      // Verificar senha
      if (userData.senha !== senha) {
        console.log('Senha incorreta para usuário:', loginName);
        return { 
          success: false, 
          error: 'Senha incorreta' 
        };
      }

      // Login bem-sucedido
      const loggedUser: User = {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        cpf: userData.cpf,
        cargo: userData.cargo,
        tipo: userData.tipo
      };
      
      console.log('Login bem-sucedido:', loggedUser);
      
      setUser(loggedUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      return { success: true };
      
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: 'Erro interno. Tente novamente em alguns instantes.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
