
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Save, Plus, Trash2, AlertTriangle, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Colaborador {
  id: string;
  nome: string;
  cargo: string;
}

interface EscalaSemanal {
  colaborador_id: string;
  semana: string;
  segunda_entrada?: string;
  segunda_saida?: string;
  terca_entrada?: string;
  terca_saida?: string;
  quarta_entrada?: string;
  quarta_saida?: string;
  quinta_entrada?: string;
  quinta_saida?: string;
  sexta_entrada?: string;
  sexta_saida?: string;
}

export function EscalasRecuperacao() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [escalas, setEscalas] = useState<EscalaSemanal[]>([]);
  const [semanaAtual, setSemanaAtual] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const diasSemana = [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca', label: 'Terça' },
    { key: 'quarta', label: 'Quarta' },
    { key: 'quinta', label: 'Quinta' },
    { key: 'sexta', label: 'Sexta' }
  ];

  useEffect(() => {
    carregarDados();
  }, [semanaAtual]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar colaboradores
      const { data: colaboradoresData, error: colaboradoresError } = await supabase
        .from('users')
        .select('id, nome, cargo')
        .eq('tipo', 'colaborador')
        .order('nome');

      if (colaboradoresError) throw colaboradoresError;

      setColaboradores(colaboradoresData || []);

      // Carregar escalas da semana atual
      const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 0 });
      const semanaString = format(inicioSemana, 'yyyy-MM-dd');

      const { data: escalasData, error: escalasError } = await supabase
        .from('escalas')
        .select('*')
        .eq('semana', semanaString);

      if (escalasError) throw escalasError;

      // Criar estrutura de escalas para todos os colaboradores
      const escalasCompletas = colaboradoresData?.map(colaborador => {
        const escalaExistente = escalasData?.find(e => e.colaborador_id === colaborador.id);
        return escalaExistente || {
          colaborador_id: colaborador.id,
          semana: semanaString,
          segunda_entrada: '',
          segunda_saida: '',
          terca_entrada: '',
          terca_saida: '',
          quarta_entrada: '',
          quarta_saida: '',
          quinta_entrada: '',
          quinta_saida: '',
          sexta_entrada: '',
          sexta_saida: ''
        };
      }) || [];

      setEscalas(escalasCompletas);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados das escalas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularHorasDia = (entrada: string, saida: string): number => {
    if (!entrada || !saida) return 0;
    
    const [horaEntrada, minutoEntrada] = entrada.split(':').map(Number);
    const [horaSaida, minutoSaida] = saida.split(':').map(Number);
    
    const minutosEntrada = horaEntrada * 60 + minutoEntrada;
    const minutosSaida = horaSaida * 60 + minutoSaida;
    
    let totalMinutos = minutosSaida - minutosEntrada;
    
    // Descontar 1 hora de almoço se trabalhar mais de 6 horas
    if (totalMinutos > 360) { // 6 horas = 360 minutos
      totalMinutos -= 60; // Desconta 1 hora de almoço
    }
    
    return Math.max(0, totalMinutos);
  };

  const calcularTotalHoras = (escala: EscalaSemanal): string => {
    let totalMinutos = 0;

    diasSemana.forEach(dia => {
      const entrada = escala[`${dia.key}_entrada` as keyof EscalaSemanal] as string;
      const saida = escala[`${dia.key}_saida` as keyof EscalaSemanal] as string;
      totalMinutos += calcularHorasDia(entrada || '', saida || '');
    });

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  };

  const atualizarHorario = (colaboradorId: string, campo: string, horario: string) => {
    setEscalas(escalas.map(escala => 
      escala.colaborador_id === colaboradorId 
        ? { ...escala, [campo]: horario }
        : escala
    ));
  };

  const salvarEscalas = async () => {
    try {
      setSaving(true);
      
      for (const escala of escalas) {
        const { error } = await supabase
          .from('escalas')
          .upsert({
            colaborador_id: escala.colaborador_id,
            semana: escala.semana,
            segunda_entrada: escala.segunda_entrada || null,
            segunda_saida: escala.segunda_saida || null,
            terca_entrada: escala.terca_entrada || null,
            terca_saida: escala.terca_saida || null,
            quarta_entrada: escala.quarta_entrada || null,
            quarta_saida: escala.quarta_saida || null,
            quinta_entrada: escala.quinta_entrada || null,
            quinta_saida: escala.quinta_saida || null,
            sexta_entrada: escala.sexta_entrada || null,
            sexta_saida: escala.sexta_saida || null,
            sabado_entrada: null,
            sabado_saida: null,
            domingo_entrada: null,
            domingo_saida: null
          }, {
            onConflict: 'colaborador_id,semana'
          });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Escalas salvas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar escalas:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar escalas",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const exportarPDF = async () => {
    try {
      setExporting(true);
      
      const doc = new jsPDF();
      const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 0 });
      const fimSemana = addDays(inicioSemana, 4);
      
      // Título
      doc.setFontSize(20);
      doc.text('Previsão de Escalas Semanais', 20, 20);
      
      // Período
      doc.setFontSize(12);
      doc.text(
        `Período: ${format(inicioSemana, 'dd/MM/yyyy', { locale: ptBR })} a ${format(fimSemana, 'dd/MM/yyyy', { locale: ptBR })}`,
        20,
        30
      );
      
      // Data de geração
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 20, 40);
      
      // Preparar dados para a tabela
      const tableData = escalas.map(escala => {
        const colaborador = colaboradores.find(c => c.id === escala.colaborador_id);
        const row = [
          colaborador?.nome || '',
          colaborador?.cargo || ''
        ];
        
        // Adicionar horários para cada dia
        diasSemana.forEach(dia => {
          const entrada = escala[`${dia.key}_entrada` as keyof EscalaSemanal] as string;
          const saida = escala[`${dia.key}_saida` as keyof EscalaSemanal] as string;
          
          if (entrada && saida) {
            row.push(`${entrada} - ${saida}`);
          } else {
            row.push('Folga');
          }
        });
        
        // Total de horas
        row.push(calcularTotalHoras(escala));
        
        return row;
      });
      
      // Cabeçalhos da tabela
      const headers = [
        'Colaborador',
        'Cargo',
        ...diasSemana.map(dia => dia.label),
        'Total'
      ];
      
      // Configurar tabela
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 50,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [99, 102, 241],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Colaborador
          1: { cellWidth: 20 }, // Cargo
          2: { cellWidth: 20 }, // Segunda
          3: { cellWidth: 20 }, // Terça
          4: { cellWidth: 20 }, // Quarta
          5: { cellWidth: 20 }, // Quinta
          6: { cellWidth: 20 }, // Sexta
          7: { cellWidth: 15 }  // Total
        }
      });
      
      // Salvar PDF
      const filename = `escalas_${format(inicioSemana, 'yyyy-MM-dd', { locale: ptBR })}.pdf`;
      doc.save(filename);
      
      toast({
        title: "Sucesso",
        description: "PDF exportado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao exportar PDF",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const excluirSemanaAnterior = async () => {
    try {
      setDeleting(true);
      
      const semanaAnterior = addDays(semanaAtual, -7);
      const inicioSemanaAnterior = startOfWeek(semanaAnterior, { weekStartsOn: 0 });
      const semanaAnteriorString = format(inicioSemanaAnterior, 'yyyy-MM-dd');

      const { error } = await supabase
        .from('escalas')
        .delete()
        .eq('semana', semanaAnteriorString);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dados da semana anterior excluídos com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir semana anterior:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir dados da semana anterior",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const proximaSemana = () => {
    setSemanaAtual(addDays(semanaAtual, 7));
  };

  const semanaAnterior = () => {
    setSemanaAtual(addDays(semanaAtual, -7));
  };

  const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 0 });
  const fimSemana = addDays(inicioSemana, 4); // Sexta-feira

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-publievo-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando escalas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Calendar className="w-6 h-6 text-publievo-purple-500" />
          <span>Previsão de Escalas Semanais</span>
        </CardTitle>
        <CardDescription>
          Defina os horários de entrada e saída previstos para cada colaborador durante a semana (segunda a sexta)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Navegação de semanas */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <Button onClick={semanaAnterior} variant="outline" size="sm">
            ← Semana Anterior
          </Button>
          <div className="text-center">
            <h3 className="font-semibold text-lg">
              {format(inicioSemana, 'dd/MM', { locale: ptBR })} a {format(fimSemana, 'dd/MM/yyyy', { locale: ptBR })}
            </h3>
            <p className="text-sm text-gray-600">
              Semana de {format(inicioSemana, 'EEEE', { locale: ptBR })} a {format(fimSemana, 'EEEE', { locale: ptBR })}
            </p>
          </div>
          <Button onClick={proximaSemana} variant="outline" size="sm">
            Próxima Semana →
          </Button>
        </div>

        {/* Tabela de escalas */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Colaborador</TableHead>
                {diasSemana.map((dia, index) => (
                  <TableHead key={dia.key} className="text-center min-w-40">
                    {dia.label}
                    <br />
                    <span className="text-xs text-gray-500">
                      {format(addDays(inicioSemana, index + 1), 'dd/MM', { locale: ptBR })}
                    </span>
                    <br />
                    <span className="text-xs text-gray-400">Entrada / Saída</span>
                  </TableHead>
                ))}
                <TableHead className="text-center min-w-24">
                  Total Previsto
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colaboradores.map(colaborador => {
                const escalaColaborador = escalas.find(e => e.colaborador_id === colaborador.id);
                
                return (
                  <TableRow key={colaborador.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{colaborador.nome}</p>
                        <p className="text-sm text-gray-600">{colaborador.cargo}</p>
                      </div>
                    </TableCell>
                    {diasSemana.map(dia => (
                      <TableCell key={dia.key} className="text-center">
                        <div className="space-y-1">
                          <Input
                            type="time"
                            value={escalaColaborador?.[`${dia.key}_entrada` as keyof EscalaSemanal] as string || ''}
                            onChange={(e) => atualizarHorario(colaborador.id, `${dia.key}_entrada`, e.target.value)}
                            className="w-full text-center text-xs"
                            placeholder="Entrada"
                          />
                          <Input
                            type="time"
                            value={escalaColaborador?.[`${dia.key}_saida` as keyof EscalaSemanal] as string || ''}
                            onChange={(e) => atualizarHorario(colaborador.id, `${dia.key}_saida`, e.target.value)}
                            className="w-full text-center text-xs"
                            placeholder="Saída"
                          />
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold text-publievo-purple-600">
                      {escalaColaborador ? calcularTotalHoras(escalaColaborador) : '00:00'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={deleting}
                  className="flex items-center space-x-2"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Excluindo...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir Semana Anterior</span>
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Confirmar Exclusão</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir todos os dados de escala da semana anterior? 
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={excluirSemanaAnterior} className="bg-red-500 hover:bg-red-600">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button 
              onClick={exportarPDF} 
              disabled={exporting}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </>
              )}
            </Button>
          </div>

          <Button 
            onClick={salvarEscalas} 
            disabled={saving}
            className="bg-publievo-orange-500 hover:bg-publievo-orange-600"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Escalas
              </>
            )}
          </Button>
        </div>

        {/* Instruções */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Instruções
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Defina os horários de entrada e saída para cada colaborador em cada dia útil da semana</li>
            <li>• Use o formato 24h (ex: 08:00, 17:00)</li>
            <li>• Deixe em branco os dias em que o colaborador não trabalha</li>
            <li>• O sistema desconta automaticamente 1h de almoço para jornadas acima de 6h</li>
            <li>• O total previsto é calculado automaticamente</li>
            <li>• Use as setas para navegar entre diferentes semanas</li>
            <li>• Clique em "Salvar Escalas" para confirmar as mudanças no banco de dados</li>
            <li>• Use "Exportar PDF" para gerar relatório da semana atual</li>
            <li>• Use "Excluir Semana Anterior" para remover dados antigos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
