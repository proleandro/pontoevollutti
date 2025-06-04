
export interface User {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  email: string;
  tipo: 'colaborador' | 'gestor';
}

export interface PontoRegistro {
  id: string;
  colaboradorId: string;
  data: string;
  entrada?: string;
  saidaAlmoco: string; // Fixo 12:00
  retornoAlmoco: string; // Fixo 13:00
  saida?: string;
  horasLiquidas: number;
}

export interface Escala {
  id: string;
  colaboradorId: string;
  semana: string; // YYYY-MM-DD (segunda-feira)
  segunda?: string;
  terca?: string;
  quarta?: string;
  quinta?: string;
  sexta?: string;
  sabado?: string;
  domingo?: string;
}

export interface WeeklyReport {
  horasTrabalhadas: number;
  metaSemanal: number;
  diasTrabalhados: number;
  divergencias: string[];
}
