import { supabase } from "@/lib/supabse";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction } from "react";

export interface UserData {
  id: string;
  name: string;
  avatar?: string | null;
  joined_at: string;
  last_seen: string;
}

export interface Message {
  id: string;
  content: string;
  from_id: string;
  to_id: string;
  created_at: string;
  updated_at: string;
  read_at?: string | null;
  translated?: string
}

type MessageSetter = Dispatch<SetStateAction<Message[]>>;
type ChannelCleanup = () => void;

interface SupabasePayload {
  new: Message;
  old?: Message;
  eventType: "INSERT" | "UPDATE" | "DELETE";
}

interface UseMessageRealtimeReturn {
  createMessageChannel: (
    currentUser: UserData,
    selectedUser: UserData,
    setMessages: MessageSetter
  ) => ChannelCleanup;

  subscribeUnread: (
    currentUser: UserData,
    activeUserId: string | null,
    handlers: {
      onUnread: (fromId: string) => void;
      onLastMessage: (
        fromId: string,
        content: string,
        createdAt: string
      ) => void;
    }
  ) => ChannelCleanup;
}


export default function useMessageRealtime(): UseMessageRealtimeReturn {
  const createMessageChannel = (
    currentUser: UserData,
    selectedUser: UserData,
    setMessages: MessageSetter
  ): ChannelCleanup => {
    const channel: RealtimeChannel = supabase
      .channel("messages-chat-active")
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: SupabasePayload) => {
          const msg = payload.new;

          const isBetweenUsers =
            (msg.from_id === currentUser.id && msg.to_id === selectedUser.id) ||
            (msg.from_id === selectedUser.id && msg.to_id === currentUser.id);

          if (!isBetweenUsers) return;

          setMessages((prev) => [...prev, msg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeUnread = (
  currentUser: UserData,
  activeUserId: string | null,
  handlers: {
    onUnread: (fromId: string) => void;
    onLastMessage: (
      fromId: string,
      content: string,
      createdAt: string
    ) => void;
  }
): ChannelCleanup => {
  const { onUnread, onLastMessage } = handlers;

  const channel = supabase
    .channel("messages-unread")
    .on(
      "postgres_changes" as any,
      { event: "INSERT", schema: "public", table: "messages" },
      (payload: SupabasePayload) => {
        const msg = payload.new;

        if (msg.to_id !== currentUser.id) return;

        
        if (msg.from_id !== activeUserId) {
          onUnread(msg.from_id);
          onLastMessage(msg.from_id, msg.content, msg.created_at);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

  return {
    createMessageChannel,
    subscribeUnread
  };
}
