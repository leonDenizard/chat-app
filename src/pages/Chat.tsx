import { Input } from "@/components/ui/input";
import UserQueue from "@/components/UserQueue/UserQueue";
import { useUser } from "@/context/UserProvider";
import { supabase } from "@/lib/supabse";
import { Search } from "lucide-react";
import { useEffect } from "react";

export default function Chat() {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.name) return;

    const addToQueue = async () => {
      await supabase.from("queue").insert({
        name: user.name,
      });
    };

    addToQueue();

    return () => {
      // remover da fila quando sair da página / fechar aba
      supabase.from("queue").delete().eq("name", user.name);
    };
  }, [user]);

  return (
    <div className="border h-screen flex">
      {/* sidebar  */}
      <aside className="border w-64">
        <header className=" border-b-2 h-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white" />
            <Input placeholder="Search" className="px-12" />
          </div>
        </header>

        {/* section users chat */}
        <UserQueue />
      </aside>

      {/* Principal Chat */}
      <main className="flex-1 border border-red-300"></main>
    </div>
  );
}
