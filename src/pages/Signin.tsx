import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserProvider";
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

  const onSubmit = (data) => {
    
    setUser({
      name: data.name
    })

    navigate("/chat");
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
