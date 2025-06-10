
-- Limpar dados existentes da tabela users
DELETE FROM users;

-- Inserir administradores
INSERT INTO users (nome, email, cpf, cargo, tipo, senha) VALUES
('Monique', 'monique@publievo.com', '000.000.000-01', 'Administradora', 'admin', '251090'),
('Leandro', 'leandro@publievo.com', '000.000.000-02', 'Administrador', 'admin', '061282');

-- Inserir colaboradores
INSERT INTO users (nome, email, cpf, cargo, tipo, senha) VALUES
('Thiago', 'thiago@publievo.com', '000.000.000-03', 'Estagiário', 'colaborador', '121212'),
('Hannah', 'hannah@publievo.com', '000.000.000-04', 'Estagiária', 'colaborador', '010101'),
('Thaíssa', 'thaissa@publievo.com', '000.000.000-05', 'Estagiária', 'colaborador', '151515'),
('Julia', 'julia@publievo.com', '000.000.000-06', 'Estagiária', 'colaborador', '252525');
