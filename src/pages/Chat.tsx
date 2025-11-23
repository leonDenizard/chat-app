import { Input } from "@/components/ui/input";
import UserChat from "@/components/UserChat/UserChat";
import UserQueueList from "@/components/UserQueueList/UserQueueList";
import { useUser } from "@/context/UserProvider";
import { useUserSupabase } from "@/hooks/useUserSupabase";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface UserData {
  id: string;
  name: string;
  avatar?: string | null;
  joined_at: string;
  last_seen: string;
}

export default function Chat() {
  const { user, setUser } = useUser();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const { id } = useParams<{ id: string }>();

  const { getUser, removeUser } = useUserSupabase();

  useEffect(() => {
    if (!id || user) return;

    getUser(id, setUser);
  }, [id, user, getUser, setUser]);


  useEffect(() => {
    return () => {
      if (user?.id && id) {
        removeUser(id, user);
      }
    };
  }, []);

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
        <UserQueueList onSelectUser={setSelectedUser} />
      </aside>

      {/* Principal Chat */}
      <main className="border flex-1 border-red-300">
        <UserChat
          user={user}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </main>
    </div>
  );
}
