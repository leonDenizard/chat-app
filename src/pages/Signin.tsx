import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LightRays from "@/components/ui/LightRays";
import TextType from "@/components/ui/TextType";
import { useUser } from "@/context/UserProvider";
import { useUserSupabase } from "@/hooks/useUserSupabase";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
}

export default function Signin() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const { createUser } = useUserSupabase();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    const { user, error } = await createUser({ name: data.name });

    if (error) {
      setError("root", { message: error });
      return;
    }

    if (user) {
      setUser(user);
      navigate(`/chat/${user.id}`);
    }
  };

  return (
    <div className="relative h-dvh flex items-center justify-center">
      <div className="fixed inset-0 w-full h-full z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0}
          className="custom-rays"
          fadeDistance={1}
          saturation={0.5}
        />
      </div>

      

      <div className="z-10 w-full max-w-md mx-auto px-6">
        <div className="flex flex-col items-center space-y-6">
          <TextType
            text={[
              "Welcome to",
              "Your Next Chat",
              "Experience",
              "Powerd by React.js",
            ]}
            typingSpeed={150}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="_"
            className="relative lg:-top-4 2xl:-top-16 text-5xl font-bold text-center text-shadow-lg
            font-sans-conde lg:w-7xl lg:text-7xl 2xl:text-8xl text-zinc-300 h-24 lg:h-auto"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="space-y-2">
              <Input
                className="w-full p-6 border-3 border-white/15"
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

              <div className="min-h-[1.25rem]">
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
                {errors.root && (
                  <p className="text-sm text-red-500">{errors.root.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zinc-600 hover:bg-zinc-700 transition-all cursor-pointer p-6"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
