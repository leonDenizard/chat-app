import { supabase } from "@/lib/supabse";

export function useMessageSupabase() {

    const loadMessage = async (user, selectedUser, setMessages) => {

        const {data, error} = await supabase
            .from("messages")
            .select("*")
            .or(
                `and(from_id.eq.${user.id},to_id.eq.${selectedUser.id}),and(from_id.eq.${selectedUser.id},to_id.eq.${user.id})`
            )
            .order("created_at", { ascending: true })

        if (error as any) {
            console.error("Erro carregando mensagens:", error);
            setMessages([]);
            return;
        }
        setMessages(data || [])
    }

    

    return { loadMessage }
}