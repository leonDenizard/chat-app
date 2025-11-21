import { Input } from "@/components/ui/input";
import UserChat from "@/components/UserChat/UserChat";
import UserQueueList from "@/components/UserQueueList/UserQueueList";
import { useUser } from "@/context/UserProvider";
import { useUserSupabase } from "@/hooks/useUserSupabase";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {
  const { user, setUser } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  
  const { id } = useParams()

  const { getUser, removeUser } = useUserSupabase()

  useEffect(() => {
    
    if (!id || user) return;
    
    getUser(id, setUser)

    return () => {
      if(user?.id) removeUser(id, user)
    }

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
