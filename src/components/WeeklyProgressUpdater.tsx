
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyProgressUpdaterProps {
  onUpdate: () => void;
  userId?: string;
}

export function WeeklyProgressUpdater({ onUpdate, userId }: WeeklyProgressUpdaterProps) {
  useEffect(() => {
    // Configurar listener para mudanças na tabela ponto_registros
    const channel = supabase
      .channel('ponto-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta INSERT, UPDATE e DELETE
          schema: 'public',
          table: 'ponto_registros',
          ...(userId && { filter: `colaborador_id=eq.${userId}` })
        },
        (payload) => {
          console.log('Ponto atualizado:', payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate, userId]);

  return null; // Este componente não renderiza nada
}
