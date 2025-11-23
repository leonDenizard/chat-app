import { supabase } from "@/lib/supabse";

interface CreateUserData {
    name: string
}

interface UserFromSupabase {
    id: string
    name: string
    avatar?: string | null
    joined_at: string
    last_seen: string
}

interface CreateUserResult {
    user: UserFromSupabase | null
    error: string | null
}

export function useUserSupabase() {

    const getUser = async (id, setUser) => {
        const data = await supabase
            .from("queue")
            .select("*")
            .eq("id", id)
            .single()

        setUser(data)
    }

    const removeUser = async (id, user) => {
        await supabase.from("queue").delete().eq("id", user?.id);
    }

    const createUser = async (userData: CreateUserData): Promise<CreateUserResult> => {

        try {
            const { data: insertedUser, error } = await supabase
                .from("queue")
                .insert({ name: userData.name })
                .select()
                .single()

            if (error) {
                console.log("Supabase error:", error)
                return {
                    user: null,
                    error: "Erro ao entrar no chat. Tente novamente"
                }
            }

            if (!insertedUser) {
                return {
                    user: null,
                    error: "Erro inesperado. Tente novamente"
                }
            }

            return {
                user: insertedUser as UserFromSupabase,
                error: null
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            return {
                user: null,
                error: "Erro de conexão. Verifique sua internet."
            };
        }
    }


    return { getUser, removeUser, createUser }
}