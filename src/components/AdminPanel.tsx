import { useState } from 'react';
import { AdminWeeklyOverview } from './AdminWeeklyOverview';
import { AdminPontoForm } from './AdminPontoForm';
import { NovoColaboradorForm } from './NovoColaboradorForm';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from '@/types';
import { EscalasRecuperacao } from './EscalasRecuperacao';

export function AdminPanel() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNovoColaboradorSuccess = () => {
    // Mudando para a aba de overview após criar um novo colaborador
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-publievo-orange-100 via-white to-publievo-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="text-2xl font-extrabold text-publievo-orange-500">
              Publievo
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Admin Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2">
                <DropdownMenuLabel>Olá, {(user as User).nome}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-publievo-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-publievo-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Progresso Semanal
          </button>
          <button
            onClick={() => setActiveTab('ponto')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'ponto'
                ? 'bg-publievo-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Registrar Ponto
          </button>
          <button
            onClick={() => setActiveTab('novo')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'novo'
                ? 'bg-publievo-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Novo Colaborador
          </button>
          <button
            onClick={() => setActiveTab('escalas')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'escalas'
                ? 'bg-publievo-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Recuperar Horários
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
            <p className="text-gray-600">Bem-vindo ao painel administrativo!</p>
          </div>
        )}

        {activeTab === 'overview' && <AdminWeeklyOverview />}

        {activeTab === 'ponto' && <AdminPontoForm />}

        {activeTab === 'novo' && <NovoColaboradorForm onSuccess={handleNovoColaboradorSuccess} />}

        {activeTab === 'escalas' && <EscalasRecuperacao />}
      </div>
    </div>
  );
}
