
import { useAuth } from '../hooks/useAuth';
import { PontoCard } from './PontoCard';
import { WeeklyProgress } from './WeeklyProgress';
import { AdminPanel } from './AdminPanel';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-publievo-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão de sair */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Sistema de Ponto Publievo
            </h1>
            
            {/* Frase motivacional apenas para colaboradores */}
            {user.tipo === 'colaborador' && (
              <div className="mt-4 mb-4">
                <p className="text-lg font-medium text-publievo-purple-700 mb-2">
                  Comece o dia lembrando: seu trabalho transforma empresas e vidas.
                </p>
                <p className="text-xl text-publievo-orange-600 font-semibold">
                  Bom dia, {user.nome}!
                </p>
              </div>
            )}
            
            {/* Saudação para outros tipos de usuário */}
            {user.tipo !== 'colaborador' && (
              <p className="text-lg text-gray-600">
                Bem-vindo, {user.nome}!
              </p>
            )}
          </div>
          
          {/* Botão Sair */}
          <Button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="space-y-8">
          {user.tipo === 'admin' ? (
            <AdminPanel />
          ) : user.tipo === 'gestor' ? (
            <>
              <PontoCard />
              <WeeklyProgress />
              <AdminPanel />
            </>
          ) : (
            <>
              <PontoCard />
              <WeeklyProgress />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
