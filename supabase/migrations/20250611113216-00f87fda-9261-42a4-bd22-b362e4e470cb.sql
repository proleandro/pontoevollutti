
-- Habilitar REPLICA IDENTITY FULL para capturar todas as mudanças nas tabelas
ALTER TABLE public.ponto_registros REPLICA IDENTITY FULL;
ALTER TABLE public.escalas REPLICA IDENTITY FULL;

-- Adicionar as tabelas à publicação supabase_realtime para habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ponto_registros;
ALTER PUBLICATION supabase_realtime ADD TABLE public.escalas;
