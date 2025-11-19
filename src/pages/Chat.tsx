import { Input } from "@/components/ui/input";
import UserChat from "@/components/UserChat/UserChat";
import UserQueueList from "@/components/UserQueueList/UserQueueList";
import { useUser } from "@/context/UserProvider";
import { supabase } from "@/lib/supabse";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const { user, setUser } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    if (!id || user) return;
    
    console.log("User conectado:", user);

    supabase
    .from("queue")
    .select("*")
    .eq("id", id)
    .single()
    .then(({ data }) => setUser(data));

    return () => {
      supabase.from("queue").delete().eq("id", user?.id);
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
        <UserQueueList onSelectUser={setSelectedUser}/>
      </aside>

      {/* Principal Chat */}
      <main className="flex-1 border border-red-300">
        <UserChat user={user} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      </main>
    </div>
  );
}
