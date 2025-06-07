
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (emailOrName: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (emailOrName: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Primeiro tentar buscar por email
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailOrName)
        .eq('senha', senha)
        .single();

      // Se não encontrou por email, tentar por nome
      if (error || !data) {
        const { data: dataByName, error: errorByName } = await supabase
          .from('users')
          .select('*')
          .eq('nome', emailOrName)
          .eq('senha', senha)
          .single();

        if (errorByName || !dataByName) {
          console.error('Login error:', error || errorByName);
          return { 
            success: false, 
            error: 'Email/nome ou senha incorretos. Verifique suas credenciais.' 
          };
        }
        
        data = dataByName;
      }

      // Remover senha do objeto user e garantir o tipo correto
      const { senha: _, ...userWithoutPassword } = data;
      const typedUser: User = {
        ...userWithoutPassword,
        tipo: data.tipo as 'colaborador' | 'gestor' | 'admin'
      };
      
      setUser(typedUser);
      localStorage.setItem('currentUser', JSON.stringify(typedUser));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
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
