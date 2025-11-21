import { supabase } from "@/lib/supabse";


export function useUserSupabase() {

    const getUser = async (id, setUser) => {
        const data = await supabase
            .from("queue")
            .select("*")
            .eq("id", id)
            .single()

        setUser(data)
    }

    const removeUser = async(id, user) => {
        await supabase.from("queue").delete().eq("id", user?.id);
    }


    return {getUser, removeUser}
}