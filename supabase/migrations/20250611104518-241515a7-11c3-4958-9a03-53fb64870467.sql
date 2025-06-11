
-- Criar tabela de usuários
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  cargo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('colaborador', 'gestor', 'admin')),
  senha TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de registros de ponto
CREATE TABLE public.ponto_registros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  colaborador_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  entrada TIMESTAMP WITH TIME ZONE,
  saida_almoco TIME DEFAULT '12:00:00',
  retorno_almoco TIME DEFAULT '13:00:00',
  saida TIMESTAMP WITH TIME ZONE,
  horas_liquidas DECIMAL(4,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de escalas
CREATE TABLE public.escalas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  colaborador_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  semana DATE NOT NULL, -- Data da segunda-feira da semana
  segunda TIME,
  terca TIME,
  quarta TIME,
  quinta TIME,
  sexta TIME,
  sabado TIME,
  domingo TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir os usuários específicos que você precisa
INSERT INTO public.users (nome, email, cpf, cargo, tipo, senha) VALUES
('Monique', 'monique@publievo.com', '000.000.000-01', 'Administradora', 'admin', '251090'),
('Leandro', 'leandro@publievo.com', '000.000.000-02', 'Administrador', 'admin', '061282'),
('Thiago', 'thiago@publievo.com', '000.000.000-03', 'Estagiário', 'colaborador', '121212'),
('Hannah', 'hannah@publievo.com', '000.000.000-04', 'Estagiária', 'colaborador', '010101'),
('Thaíssa', 'thaissa@publievo.com', '000.000.000-05', 'Estagiária', 'colaborador', '151515'),
('Julia', 'julia@publievo.com', '000.000.000-06', 'Estagiária', 'colaborador', '252525');
