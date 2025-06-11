
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyProgressUpdaterProps {
  onUpdate: () => void;
  userId?: string;
  listenToAllChanges?: boolean; // Nova prop para escutar mudanças globais
}

export function WeeklyProgressUpdater({ onUpdate, userId, listenToAllChanges = false }: WeeklyProgressUpdaterProps) {
  useEffect(() => {
    // Configurar listener para mudanças na tabela ponto_registros
    const pontoChannel = supabase
      .channel('ponto-changes')
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
          console.log('Ponto atualizado:', payload);
          onUpdate();
        }
      )
      .subscribe();

    // Configurar listener para mudanças na tabela escalas
    const escalasChannel = supabase
      .channel('escalas-changes')
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
          console.log('Escala atualizada:', payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pontoChannel);
      supabase.removeChannel(escalasChannel);
    };
  }, [onUpdate, userId, listenToAllChanges]);

  return null; // Este componente não renderiza nada
}
