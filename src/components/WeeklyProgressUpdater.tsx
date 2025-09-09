
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyProgressUpdaterProps {
  onUpdate: () => void;
  userId?: string;
  listenToAllChanges?: boolean;
  channelPrefix?: string; // Nova prop para criar canais únicos
}

export function WeeklyProgressUpdater({ 
  onUpdate, 
  userId, 
  listenToAllChanges = false,
  channelPrefix = 'default'
}: WeeklyProgressUpdaterProps) {
  useEffect(() => {
    // Criar nomes únicos para os canais baseados no prefixo
    const pontoChannelName = `${channelPrefix}-ponto-changes`;
    const escalasChannelName = `${channelPrefix}-escalas-changes`;

    // Configurar listener para mudanças na tabela ponto_registros
    const pontoChannel = supabase
      .channel(pontoChannelName)
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta INSERT, UPDATE e DELETE
          schema: 'public',
          table: 'ponto_registros',
          // Se listenToAllChanges for true ou não houver userId, escuta todas as mudanças
          ...((!listenToAllChanges && userId) && { filter: `colaborador_id=eq.${userId}` })
        },
        (payload) => {
          console.log(`[${pontoChannelName}] Ponto atualizado:`, payload);
          onUpdate();
        }
      )
      .subscribe();

    // Configurar listener para mudanças na tabela escalas
    const escalasChannel = supabase
      .channel(escalasChannelName)
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta INSERT, UPDATE e DELETE
          schema: 'public',
          table: 'escalas',
          // Se listenToAllChanges for true ou não houver userId, escuta todas as mudanças
          ...((!listenToAllChanges && userId) && { filter: `colaborador_id=eq.${userId}` })
        },
        (payload) => {
          console.log(`[${escalasChannelName}] Escala atualizada:`, payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pontoChannel);
      supabase.removeChannel(escalasChannel);
    };
  }, [onUpdate, userId, listenToAllChanges, channelPrefix]);

  return null; // Este componente não renderiza nada
}
