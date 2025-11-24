import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabse";
import { RealtimeChannel } from "@supabase/supabase-js";

interface QueueUser {
  id: string;
  name: string;
  avatar: string | null;
  joined_at: string;
  last_seen: string;
}

interface UseQueueReturn {
  users: QueueUser[];
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
}

export function useQueue(): UseQueueReturn {
  const [users, setUsers] = useState<QueueUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("queue")
        .select("*")
        .order("joined_at", { ascending: true });

      if (supabaseError) {
        console.error("Erro ao carregar usuários:", supabaseError);
        setError("Erro ao carregar lista de usuários");
        return;
      }

      setUsers(data || []);
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUsers = async () => {
    await loadUsers();
  };

  useEffect(() => {
    loadUsers();

    
    const channel: RealtimeChannel = supabase
      .channel(`queue-changes-${Date.now()}`) // ← Nome único
      .on(
        'postgres_changes' as any,
        { 
          event: '*', 
          schema: 'public', 
          table: 'queue' 
        },
        (payload: any) => {
          console.log('Real-time event received:', payload); 

          const eventType = payload.eventType;
          
          if (eventType === 'INSERT') {
            const newUser = payload.new as QueueUser;
            console.log('New user added:', newUser); 
            setUsers((prev) => {
              // ✅ Evita duplicatas
              const exists = prev.find(u => u.id === newUser.id);
              if (exists) return prev;
              return [...prev, newUser];
            });
          }

          if (eventType === 'DELETE') {
            const deletedUser = payload.old as QueueUser;
            console.log('User removed:', deletedUser); 
            setUsers((prev) =>
              prev.filter((u) => u.id !== deletedUser.id)
            );
          }

          if (eventType === 'UPDATE') {
            const updatedUser = payload.new as QueueUser;
            console.log('User updated:', updatedUser); 
            setUsers((prev) =>
              prev.map((u) =>
                u.id === updatedUser.id ? updatedUser : u
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time conectado com sucesso!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro na conexão real-time');
        }
      });

    return () => {
      console.log('Limpando canal real-time...'); 
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    users,
    isLoading,
    error,
    refreshUsers,
  };
}

export default useQueue;
