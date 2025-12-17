import { supabase } from "@/lib/supabse";
import { useEffect, useRef, useState } from "react";

interface TypingPayload {
  from: string;
  to: string;
}

export function useTypingIndicator(
  currentUserId: string | null,
  activeUserId: string | null
) {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase.channel("typing-indicator");

    channel.on("broadcast", { event: "typing" }, ({ payload }: { payload: TypingPayload }) => {
      if (payload.to === currentUserId && payload.from === activeUserId) {
        setIsTyping(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 1200);
      }
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, activeUserId]);

  const notifyTyping = () => {
    if (!currentUserId || !activeUserId) return;

    supabase.channel("typing-indicator").send({
      type: "broadcast",
      event: "typing",
      payload: {
        from: currentUserId,
        to: activeUserId,
      },
    });
  };

  return {
    isTyping,
    notifyTyping,
  };
}