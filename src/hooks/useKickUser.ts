import { useUser } from "@/context/UserProvider";
import { supabase } from "@/lib/supabse";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type kickOption = {
    pollMs?: number;
    onKicked?: (reason: "expired" | "missing") => void
    replaceHistory?: boolean
}

export function useKickUser(opts?: kickOption) {

    const { user, setUser } = useUser()
    const navigate = useNavigate()
    const kickRef = useRef(false)
    const pollMs = opts?.pollMs ?? 10000

    useEffect(() => {
        if (!user?.id) return

        kickRef.current = false

        const kick = (reason: "expired" | "missing") => {
            if (kickRef.current) return

            setUser(null)
            opts?.onKicked?.(reason)
            navigate("/", { replace: opts?.replaceHistory ?? true, state: { reason } })
        }

        const channel: RealtimeChannel = supabase
            .channel(`kick:${user.id}`)
            .on(
                "postgres_changes" as any,
                { event: "DELETE", schema: "public", table: "queue", filter: `id=eq.${user.id}` },
                () => kick("expired")
            )
            .subscribe();

        //Fallback: polling
        const interval = setInterval(async () => {
            const { data } = await supabase
                .from("queue")
                .select("id")
                .eq("id", user.id)
                .maybeSingle();

            if (!data) kick("missing");
        }, pollMs);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, [user?.id])
}