-- Liberar leitura de dados para recuperar informações
-- USERS: leitura pública
DROP POLICY IF EXISTS "Admins e gestores podem gerenciar todos os dados" ON public.users;
DROP POLICY IF EXISTS "Colaboradores podem ver próprios dados via email" ON public.users;

CREATE POLICY "Public pode ver users" 
ON public.users 
FOR SELECT 
USING (true);

-- PONTO_REGISTROS: leitura e escrita públicas (temporário para recuperar dados)
DROP POLICY IF EXISTS "Admins podem gerenciar todos os pontos" ON public.ponto_registros;
DROP POLICY IF EXISTS "Colaboradores podem gerenciar seus próprios pontos" ON public.ponto_registros;

CREATE POLICY "Public pode ver pontos" 
ON public.ponto_registros 
FOR SELECT 
USING (true);

CREATE POLICY "Public pode inserir pontos" 
ON public.ponto_registros 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public pode atualizar pontos" 
ON public.ponto_registros 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- ESCALAS: leitura e escrita públicas
DROP POLICY IF EXISTS "Admins podem gerenciar todas as escalas" ON public.escalas;
DROP POLICY IF EXISTS "Colaboradores podem ver suas próprias escalas" ON public.escalas;

CREATE POLICY "Public pode ver escalas" 
ON public.escalas 
FOR SELECT 
USING (true);

CREATE POLICY "Public pode inserir escalas" 
ON public.escalas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public pode atualizar escalas" 
ON public.escalas 
FOR UPDATE 
USING (true)
WITH CHECK (true);