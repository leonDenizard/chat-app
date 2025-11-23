import { supabase } from "@/lib/supabse";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction } from "react";


interface UserData {
  id: string;
  name: string;
  avatar?: string | null;
  joined_at: string;
  last_seen: string;
}

interface Message {
  id: string;
  content: string;
  from_id: string;
  to_id: string;
  created_at: string;
  updated_at: string;
  read_at?: string | null;
}


type MessageSetter = Dispatch<SetStateAction<Message[]>>;
type ChannelCleanup = () => void;
type SimpleUserSetter = (user: UserData | null) => void;


interface SupabasePayload {
  new: Message;
  old?: Message;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}


interface UseMessageRealTimeReturn {
  creatChannel: (
    user: UserData, 
    selectedUser: UserData, 
    setMessages: MessageSetter
  ) => ChannelCleanup;
  autoOpen: (
    user: UserData, 
    selectedUser: UserData | null, 
    setSelectedUser: SimpleUserSetter
  ) => ChannelCleanup;
}

export default function useMessageRealTime(): UseMessageRealTimeReturn {

  const creatChannel = (
    user: UserData, 
    selectedUser: UserData, 
    setMessages: MessageSetter
  ): ChannelCleanup => {

    const channel: RealtimeChannel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: SupabasePayload) => {
          const msg = payload.new;

          const isBetweenUsers =
            (msg.from_id === user.id && msg.to_id === selectedUser.id) ||
            (msg.from_id === selectedUser.id && msg.to_id === user.id);

          if (isBetweenUsers) {
            setMessages((prev: Message[]) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return (): void => {
      supabase.removeChannel(channel);
    };
  };

  const autoOpen = (
    user: UserData, 
    selectedUser: UserData | null, 
    setSelectedUser: SimpleUserSetter
  ): ChannelCleanup => {

    const channel: RealtimeChannel = supabase
      .channel("auto-open-chat")
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload: SupabasePayload) => {
          const msg = payload.new;

          // mensagem enviada PARA mim
          if (msg.to_id === user.id) {
            // se eu não estou com ele aberto, abre
            if (!selectedUser || selectedUser.id !== msg.from_id) {
              const { data } = await supabase
                .from("queue")
                .select("*")
                .eq("id", msg.from_id)
                .single();

              if (data) {
                setSelectedUser(data as UserData);
              }
            }
          }
        }
      )
      .subscribe();

    return (): void => {
      supabase.removeChannel(channel);
    };
  };

  return { creatChannel, autoOpen };
}
