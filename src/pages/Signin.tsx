import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserProvider";
import { useUserSupabase } from "@/hooks/useUserSupabase";
import { supabase } from "@/lib/supabse";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
}

interface UserFromSupabase {
  id: string;
  name: string;
  avatar?: string;
  joined_at: string;
  last_seen: string;
}

export default function Signin() {

  const navigate = useNavigate();
  const { setUser } = useUser()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const { createUser } = useUserSupabase()
  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    
    
    const {user, error} = await createUser({name: data.name})

    if(error){
      setError("root", {message: error})
    }
      
    if(user){
      setUser(user)
      navigate(`/chat/${user.id}`);
    }

    
    
  };

  return (
    <div>
      <h1>Signin</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            id="name"
            {...register("name", {
              required: "Informe seu nome ou username",
              minLength: {
                value: 3,
                message: "Mínimo 3 caracteres",
              },
            })}
            type="text"
            placeholder="Digite seu nome ou username"
          />
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
          {errors.root && <p className="text-red-400">{errors.root.message}</p>}
          
          <Button type="submit" disabled={isSubmitting} name="TESTE">
            {isSubmitting ? "Entrando" : "Entrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
