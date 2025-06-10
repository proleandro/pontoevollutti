
-- Remove todas as políticas RLS existentes da tabela users para evitar recursão
DROP POLICY IF EXISTS "Allow read access for authentication" ON users;
DROP POLICY IF EXISTS "Allow insert for new users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admin pode gerenciar usuários" ON users;

-- Desabilita RLS temporariamente para limpeza
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS com políticas simples e funcionais
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política simples para permitir leitura (necessário para login e operações básicas)
CREATE POLICY "Enable read access for all users" 
ON users 
FOR SELECT 
USING (true);

-- Política para permitir inserção de novos usuários
CREATE POLICY "Enable insert for all users" 
ON users 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir atualização
CREATE POLICY "Enable update for all users" 
ON users 
FOR UPDATE 
USING (true);

-- Política para permitir exclusão
CREATE POLICY "Enable delete for all users" 
ON users 
FOR DELETE 
USING (true);

-- Configurar políticas RLS para ponto_registros se não existirem
ALTER TABLE ponto_registros ENABLE ROW LEVEL SECURITY;

-- Limpar políticas existentes de ponto_registros
DROP POLICY IF EXISTS "Enable all access for ponto_registros" ON ponto_registros;

-- Criar política simples para ponto_registros
CREATE POLICY "Enable all access for ponto_registros" 
ON ponto_registros 
FOR ALL 
USING (true);

-- Configurar políticas RLS para escalas se não existirem
ALTER TABLE escalas ENABLE ROW LEVEL SECURITY;

-- Limpar políticas existentes de escalas
DROP POLICY IF EXISTS "Enable all access for escalas" ON escalas;

-- Criar política simples para escalas
CREATE POLICY "Enable all access for escalas" 
ON escalas 
FOR ALL 
USING (true);
