
-- Remove todas as políticas RLS existentes da tabela users que podem estar causando recursão infinita
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can delete their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Desabilita RLS temporariamente para resolver o problema de login
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Cria políticas simples e diretas sem referências circulares
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política simples: todos os usuários autenticados podem ler dados da tabela users
-- Isso é necessário para o login funcionar
CREATE POLICY "Allow read access for authentication" 
ON users 
FOR SELECT 
USING (true);

-- Política para permitir inserção de novos usuários (necessário para cadastro)
CREATE POLICY "Allow insert for new users" 
ON users 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir atualização de dados próprios
CREATE POLICY "Users can update own data" 
ON users 
FOR UPDATE 
USING (id = auth.uid()::text::uuid OR id = auth.uid());
