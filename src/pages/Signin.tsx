import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserProvider";
import { supabase } from "@/lib/supabse";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
}

export default function Signin() {

  const navigate = useNavigate();
  const { setUser } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data) => {
    
    const {data: inserted, error} = await supabase
    .from("queue")
    .insert({name: data.name})
    .select()
    .single()

    if(error){
      console.log(error)
      return
    }
    setUser(inserted)

    navigate(`/chat?id=${inserted.id}`);
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
                message: "Mínimo 3 caractes",
              },
            })}
            type="text"
            placeholder="Digite seu nome ou username"
          />
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
          <Button type="submit" disabled={isSubmitting} name="TESTE">
            Entrar
          </Button>
        </div>
      </form>
    </div>
  );
}
