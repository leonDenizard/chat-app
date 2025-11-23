import { supabase } from "@/lib/supabse";
import { getRandomAvatar } from "@/utils/avatarUtils";


interface UserData {
  id: string;
  name: string;
  avatar?: string | null;
  joined_at: string;
  last_seen: string;
}

type UserSetter = (user: UserData | null) => void;

interface GetUserResult {
  user: UserData | null;
  error: string | null;
}

interface RemoveUserResult {
  success: boolean;
  error: string | null;
}

interface CreateUserInput {
  name: string;
  avatar?: string | null; // opcional
}

interface UseUserSupabaseReturn {
  getUser: (id: string, setUser: UserSetter) => Promise<GetUserResult>;
  removeUser: (id: string, user: UserData) => Promise<RemoveUserResult>;
  createUser: (userData: CreateUserInput) => Promise<CreateUserResult>;
}


interface CreateUserResult {
  user: UserData | null
  error: string | null
}

export function useUserSupabase(): UseUserSupabaseReturn {

  const getUser = async (
    id: string,
    setUser: UserSetter
  ): Promise<GetUserResult> => {

    if (!id) {
      return { user: null, error: "ID é obrigatório" };
    }

    try {
      const { data, error } = await supabase
        .from("queue")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar usuário:", error);
        return { user: null, error: "Erro ao buscar usuário" };
      }

      const user = data as UserData;
  
      setUser(user);
      return { user, error: null };

    } catch (err) {
      console.error("Erro inesperado:", err);
      return { user: null, error: "Erro inesperado" };
    }
  };

  const removeUser = async (
    id: string,
    user: UserData
  ): Promise<RemoveUserResult> => {

    if (!id || !user) {
      return { success: false, error: "Parâmetros inválidos" };
    }

    try {
      const { error } = await supabase
        .from("queue")
        .delete()
        .eq("id", user.id);

      if (error) {
        console.error("Erro ao remover usuário:", error);
        return { success: false, error: "Erro ao remover usuário" };
      }

      return { success: true, error: null };

    } catch (err) {
      console.error("Erro inesperado:", err);
      return { success: false, error: "Erro inesperado" };
    }
  };

  const createUser = async (userData: CreateUserInput): Promise<CreateUserResult> => {

    if (!userData.name?.trim()) {
      return {
        user: null,
        error: "Nome é obrigatório"
      };
    }
    try {
      const { data: insertedUser, error } = await supabase
        .from("queue")
        .insert({ name: userData.name.trim(), avatar: getRandomAvatar() })
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
        user: insertedUser as UserData,
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

  return { getUser, removeUser, createUser };
}
