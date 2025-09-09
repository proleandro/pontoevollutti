-- Afrouxar temporariamente RLS para restaurar visibilidade e operação no app sem auth
-- USERS: leitura pública
DROP POLICY IF EXISTS "Admins e gestores podem gerenciar todos os dados" ON public.users;
DROP POLICY IF EXISTS "Colaboradores podem ver próprios dados via email" ON public.users;

CREATE POLICY "Public pode ver users" 
ON public.users 
FOR SELECT 
USING (true);

-- PONTO_REGISTROS: leitura e escrita públicas (temporário)
CREATE POLICY IF NOT EXISTS "Public pode ver pontos" 
ON public.ponto_registros 
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Public pode inserir pontos" 
ON public.ponto_registros 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Public pode atualizar pontos" 
ON public.ponto_registros 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- ESCALAS: leitura pública
CREATE POLICY IF NOT EXISTS "Public pode ver escalas" 
ON public.escalas 
FOR SELECT 
USING (true);