import { supabase } from "@/lib/supabse";

interface SendMessageData {
  text: string;
  fromUserId: string;
  toUserId: string;
  translated?: string
}

interface LoadMessagesData {
  fromUserId: string;
  toUserId: string;
}


interface Message {
  id: string;
  content: string;
  from_id: string;
  to_id: string;
  translated?: string;
  created_at: string;
  updated_at: string;
  read_at?: string | null;
}


interface SendMessageResult {
  message: Message | null;
  error: string | null;
}

interface LoadMessagesResult {
  messages: Message[];
  error: string | null;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: any | null;
}

export function useMessageSupabase() {
  
  const sendMessage = async (data: SendMessageData): Promise<SendMessageResult> => {
    if (!data.text.trim()) {
      return { 
        message: null, 
        error: "Mensagem não pode estar vazia" 
      };
    }

    if (!data.fromUserId || !data.toUserId) {
      return { 
        message: null, 
        error: "Usuários inválidos" 
      };
    }

    try {
      const { data: insertedMessage, error }: SupabaseResponse<Message> = 
        await supabase
          .from("messages")
          .insert({
            from_id: data.fromUserId,
            to_id: data.toUserId,
            content: data.text.trim(),
            translated: data.translated,
          })
          .select()
          .single();

      if (error) {
        console.error("Supabase error:", error);
        return {
          message: null,
          error: "Erro ao enviar mensagem. Tente novamente."
        };
      }

      if (!insertedMessage) {
        return {
          message: null,
          error: "Erro inesperado ao enviar mensagem."
        };
      }

      return {
        message: insertedMessage,
        error: null
      };

    } catch (err) {
      console.error("Unexpected error:", err);
      return {
        message: null,
        error: "Erro de conexão. Verifique sua internet."
      };
    }
  };

  const loadMessages = async (data: LoadMessagesData): Promise<LoadMessagesResult> => {
    if (!data.fromUserId || !data.toUserId) {
      return {
        messages: [],
        error: "Usuários inválidos"
      };
    }

    try {
      const { data: messagesData, error }: SupabaseResponse<Message[]> = 
        await supabase
          .from("messages")
          .select("*")
          .or(
            `and(from_id.eq.${data.fromUserId},to_id.eq.${data.toUserId}),and(from_id.eq.${data.toUserId},to_id.eq.${data.fromUserId})`
          )
          .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro carregando mensagens:", error);
        return {
          messages: [],
          error: "Erro ao carregar mensagens"
        };
      }

      return {
        messages: messagesData || [],
        error: null
      };

    } catch (err) {
      console.error("Erro inesperado:", err);
      return {
        messages: [],
        error: "Erro de conexão. Verifique sua internet."
      };
    }
  };

  const markAsRead = async (messageId: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("id", messageId);

      if (error) {
        console.error("Erro ao marcar como lida:", error);
        return { success: false, error: "Erro ao marcar mensagem como lida" };
      }

      return { success: true, error: null };

    } catch (err) {
      console.error("Erro inesperado:", err);
      return { success: false, error: "Erro de conexão" };
    }
  };

  return { 
    sendMessage, 
    loadMessages, 
    markAsRead 
  };
}
