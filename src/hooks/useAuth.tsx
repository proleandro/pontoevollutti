
import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { senha: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users para demonstração
const mockUsers: (User & { senha: string })[] = [
  {
    id: '1',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    cargo: 'Desenvolvedor',
    email: 'joao@publievo.com',
    tipo: 'colaborador',
    senha: '123456'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    cargo: 'Gerente',
    email: 'maria@publievo.com',
    tipo: 'gestor',
    senha: 'admin123'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, senha: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.senha === senha);
    if (foundUser) {
      const { senha: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id'> & { senha: string }): Promise<boolean> => {
    // Simula registro de novo usuário
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    delete (userData as any).senha;
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user
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
