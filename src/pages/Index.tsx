
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { Dashboard } from '../components/Dashboard';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </div>
  );
};

export default Index;
