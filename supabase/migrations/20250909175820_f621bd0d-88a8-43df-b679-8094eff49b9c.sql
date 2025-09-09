-- Primeiro, remover as políticas problemáticas que estão causando recursão infinita
DROP POLICY IF EXISTS "Colaboradores podem ver próprios dados" ON public.users;
DROP POLICY IF EXISTS "Gestores podem ver dados de colaboradores" ON public.users;

-- Criar uma função de segurança que evita recursão
CREATE OR REPLACE FUNCTION public.get_user_email_from_auth()
RETURNS TEXT AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Criar função para verificar se usuário é admin/gestor baseado no email
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
  user_role TEXT;
BEGIN
  -- Pegar email do usuário autenticado
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar o tipo do usuário baseado no email
  SELECT tipo INTO user_role FROM public.users WHERE email = user_email LIMIT 1;
  
  RETURN user_role IN ('admin', 'gestor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Criar novas políticas sem recursão
CREATE POLICY "Admins e gestores podem ver todos os dados" 
ON public.users 
FOR SELECT 
USING (is_admin_or_manager());

CREATE POLICY "Colaboradores podem ver próprios dados via email" 
ON public.users 
FOR SELECT 
USING (email = get_user_email_from_auth());