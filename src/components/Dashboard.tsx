
import { useAuth } from '../hooks/useAuth';
import { PontoCard } from './PontoCard';
import { WeeklyProgress } from './WeeklyProgress';
import { AdminPanel } from './AdminPanel';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-publievo-light">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sistema de Ponto Publievo
          </h1>
          <p className="text-lg text-gray-600">
            Bem-vindo, {user.nome}!
          </p>
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
