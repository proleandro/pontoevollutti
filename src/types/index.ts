
export interface User {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  email: string;
  tipo: 'colaborador' | 'gestor' | 'admin';
  senha?: string;
  created_at?: string;
}

export interface PontoRegistro {
  id: string;
  colaborador_id: string;
  data: string;
  entrada?: string;
  saida_almoco: string; // Fixo 12:00
  retorno_almoco: string; // Fixo 13:00
  saida?: string;
  horas_liquidas: number;
  created_at?: string;
  updated_at?: string;
}

export interface Escala {
  id: string;
  colaborador_id: string;
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
  horasEstagio: number;
  metaSemanal: number;
  diasTrabalhados: number;
  divergencias: string[];
}
