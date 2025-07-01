
-- Atualizar a tabela escalas para incluir campos de entrada e saída para cada dia
ALTER TABLE public.escalas 
DROP COLUMN IF EXISTS segunda,
DROP COLUMN IF EXISTS terca,
DROP COLUMN IF EXISTS quarta,
DROP COLUMN IF EXISTS quinta,
DROP COLUMN IF EXISTS sexta,
DROP COLUMN IF EXISTS sabado,
DROP COLUMN IF EXISTS domingo;

-- Adicionar colunas de entrada e saída para cada dia da semana
ALTER TABLE public.escalas 
ADD COLUMN segunda_entrada TIME,
ADD COLUMN segunda_saida TIME,
ADD COLUMN terca_entrada TIME,
ADD COLUMN terca_saida TIME,
ADD COLUMN quarta_entrada TIME,
ADD COLUMN quarta_saida TIME,
ADD COLUMN quinta_entrada TIME,
ADD COLUMN quinta_saida TIME,
ADD COLUMN sexta_entrada TIME,
ADD COLUMN sexta_saida TIME,
ADD COLUMN sabado_entrada TIME,
ADD COLUMN sabado_saida TIME,
ADD COLUMN domingo_entrada TIME,
ADD COLUMN domingo_saida TIME;

-- Criar índice para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_escalas_colaborador_semana ON public.escalas(colaborador_id, semana);

-- Adicionar constraint para garantir que colaborador_id + semana seja único
ALTER TABLE public.escalas 
ADD CONSTRAINT unique_colaborador_semana UNIQUE (colaborador_id, semana);
