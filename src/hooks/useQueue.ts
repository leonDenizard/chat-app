import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabse";


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

interface SupabaseResponse<T> {
  data: T | null;
  error: any | null;
}

export function useQueue(): UseQueueReturn {
  
  const [users, setUsers] = useState<QueueUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError }: SupabaseResponse<QueueUser[]> = 
        await supabase
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

    const channel = supabase
      .channel("queue-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setUsers((prev) => [...prev, payload.new as QueueUser]);
          }

          if (payload.eventType === "DELETE") {
            setUsers((prev) =>
              prev.filter((u) => u.id !== (payload.old as QueueUser).id)
            );
          }

          if (payload.eventType === "UPDATE") {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === (payload.new as QueueUser).id
                  ? (payload.new as QueueUser)
                  : u
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
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
