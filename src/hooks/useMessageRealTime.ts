import { supabase } from "@/lib/supabse";

export default function useMessageRealTime() {

    const creatChannel = async (user, selectedUser, setMessages) => {

        const channel = supabase
            .channel("messages-realtime")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    const msg = payload.new;

                    const isBetweenUsers =
                        (msg.from_id === user.id && msg.to_id === selectedUser.id) ||
                        (msg.from_id === selectedUser.id && msg.to_id === user.id);

                    if (isBetweenUsers) {
                        setMessages((prev) => [...prev, msg]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }

    const autoOpen = async (user, selectedUser, setSelectedUser) => {

        const channel = supabase
            .channel("auto-open-chat")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                async (payload) => {
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

                            setSelectedUser(data);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }



    return { creatChannel, autoOpen }

}