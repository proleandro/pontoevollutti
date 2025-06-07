
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { PontoCard } from './PontoCard';
import { WeeklyProgress } from './WeeklyProgress';
import { AdminPanel } from './AdminPanel';
import { User, Clock, Calendar, Settings, X } from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('ponto');

  const menuItems = [
    { id: 'ponto', label: 'Ponto Diário', icon: Clock },
    { id: 'resumo', label: 'Resumo Semanal', icon: Calendar },
    ...(user?.tipo === 'gestor' || user?.tipo === 'admin' ? [{ id: 'admin', label: 'Painel Admin', icon: Settings }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-publievo-orange-50 via-white to-publievo-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-publievo rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-publievo bg-clip-text text-transparent">
                  Sistema de Ponto
                </h1>
                <p className="text-sm text-gray-600">Publievo - Controle de Estágio</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nome}</p>
                <p className="text-xs text-gray-500">{user?.cargo}</p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-publievo-purple-200 text-publievo-purple-700 hover:bg-publievo-purple-50"
              >
                <X className="w-4 h-4 mr-1" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-publievo text-white overflow-hidden">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                <User className="w-6 h-6" />
                <span>Bem-vindo, {user?.nome}!</span>
              </CardTitle>
              <CardDescription className="text-white/90 text-lg">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-publievo text-white shadow-lg transform -translate-y-1'
                    : 'bg-white text-gray-600 hover:bg-publievo-orange-50 hover:text-publievo-orange-700'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'ponto' && <PontoCard />}
          {activeTab === 'resumo' && <WeeklyProgress />}
          {activeTab === 'admin' && (user?.tipo === 'gestor' || user?.tipo === 'admin') && <AdminPanel />}
        </div>
      </div>
    </div>
  );
}
