-- Habilitar RLS nas tabelas críticas do sistema
ALTER TABLE public.escalas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ponto_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela escalas
CREATE POLICY "Admins podem gerenciar todas as escalas" 
ON public.escalas 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Colaboradores podem ver suas próprias escalas" 
ON public.escalas 
FOR SELECT 
USING (
  colaborador_id IN (
    SELECT u.id FROM public.users u 
    JOIN auth.users au ON u.email = au.email 
    WHERE au.id = auth.uid()
  )
);

-- Políticas para tabela ponto_registros
CREATE POLICY "Admins podem gerenciar todos os pontos" 
ON public.ponto_registros 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Colaboradores podem gerenciar seus próprios pontos" 
ON public.ponto_registros 
FOR ALL 
USING (
  colaborador_id IN (
    SELECT u.id FROM public.users u 
    JOIN auth.users au ON u.email = au.email 
    WHERE au.id = auth.uid()
  )
)
WITH CHECK (
  colaborador_id IN (
    SELECT u.id FROM public.users u 
    JOIN auth.users au ON u.email = au.email 
    WHERE au.id = auth.uid()
  )
);

-- Políticas básicas para outras tabelas (apenas admins por enquanto)
CREATE POLICY "Apenas admins podem acessar assinaturas" 
ON public.assinaturas 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Apenas admins podem acessar pagamentos" 
ON public.pagamentos 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Todos podem ver planos ativos" 
ON public.planos 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Apenas admins podem gerenciar planos" 
ON public.planos 
FOR INSERT, UPDATE, DELETE 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Apenas admins podem gerenciar clientes" 
ON public.clientes 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));