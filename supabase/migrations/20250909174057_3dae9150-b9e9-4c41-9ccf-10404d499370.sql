-- Verificar as políticas atuais da tabela users
-- As políticas estão muito restritivas, impedindo o acesso aos dados pelos próprios colaboradores

-- Adicionar política para permitir que colaboradores vejam seus próprios dados
CREATE POLICY "Colaboradores podem ver próprios dados" 
ON public.users 
FOR SELECT 
USING (
  -- Permite que admins vejam tudo
  is_admin(auth.uid()) 
  OR 
  -- Permite que usuários autenticados vejam seus próprios dados
  id IN (
    SELECT u.id 
    FROM auth.users au 
    JOIN public.users u ON u.email = au.email 
    WHERE au.id = auth.uid()
  )
);

-- Permitir que gestores vejam dados de colaboradores para o painel administrativo
CREATE POLICY "Gestores podem ver dados de colaboradores" 
ON public.users 
FOR SELECT 
USING (
  tipo = 'colaborador' 
  AND EXISTS (
    SELECT 1 FROM public.users manager 
    WHERE manager.email IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) 
    AND manager.tipo IN ('admin', 'gestor')
  )
);