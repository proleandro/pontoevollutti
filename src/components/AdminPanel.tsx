
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Users, Calendar, FileText, Download, UserPlus, Settings } from 'lucide-react';

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState('colaboradores');
  const { toast } = useToast();

  const sections = [
    { id: 'colaboradores', label: 'Colaboradores', icon: Users },
    { id: 'escalas', label: 'Escalas', icon: Calendar },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  // Mock data
  const colaboradores = [
    { id: '1', nome: 'João Silva', cargo: 'Desenvolvedor', email: 'joao@publievo.com', status: 'ativo' },
    { id: '2', nome: 'Maria Santos', cargo: 'Designer', email: 'maria@publievo.com', status: 'ativo' },
    { id: '3', nome: 'Pedro Costa', cargo: 'Analista', email: 'pedro@publievo.com', status: 'inativo' },
  ];

  const handleExportReport = (tipo: string) => {
    toast({
      title: "Relatório exportado",
      description: `Relatório ${tipo} foi gerado com sucesso`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex space-x-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-gradient-publievo text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-publievo-orange-50'
            }`}
          >
            <section.icon className="w-4 h-4" />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Colaboradores */}
      {activeSection === 'colaboradores' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <UserPlus className="w-5 h-5 text-publievo-orange-500" />
                <span>Adicionar Colaborador</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Nome do colaborador" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" placeholder="Cargo do colaborador" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@publievo.com" />
                </div>
              </div>
              <Button className="bg-gradient-publievo hover:opacity-90 text-white">
                Adicionar Colaborador
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <Users className="w-5 h-5 text-publievo-purple-500" />
                <span>Lista de Colaboradores</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colaboradores.map((colaborador) => (
                  <div
                    key={colaborador.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-publievo-soft hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">{colaborador.nome}</h4>
                      <p className="text-sm text-gray-600">{colaborador.cargo} • {colaborador.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        colaborador.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {colaborador.status}
                      </span>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Escalas */}
      {activeSection === 'escalas' && (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <Calendar className="w-5 h-5 text-publievo-orange-500" />
              <span>Gestão de Escalas</span>
            </CardTitle>
            <CardDescription>
              Defina as escalas semanais dos colaboradores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Colaborador</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradores.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semana</Label>
                <Input type="week" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia) => (
                <div key={dia} className="space-y-2">
                  <Label className="text-sm">{dia}</Label>
                  <Input type="time" placeholder="Horário" />
                </div>
              ))}
            </div>

            <Button className="bg-gradient-publievo hover:opacity-90 text-white">
              Salvar Escala
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Relatórios */}
      {activeSection === 'relatorios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <FileText className="w-5 h-5 text-publievo-orange-500" />
                <span>Relatório de Frequência</span>
              </CardTitle>
              <CardDescription>
                Exportar relatório detalhado de presença dos colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Período</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" />
                  <Input type="date" />
                </div>
              </div>
              <Button 
                onClick={() => handleExportReport('frequência')}
                className="w-full bg-gradient-publievo hover:opacity-90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <Calendar className="w-5 h-5 text-publievo-purple-500" />
                <span>Relatório de Escalas</span>
              </CardTitle>
              <CardDescription>
                Comparativo entre escalas previstas e ponto real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Colaborador</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os colaboradores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {colaboradores.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleExportReport('escalas')}
                className="w-full bg-gradient-publievo hover:opacity-90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
