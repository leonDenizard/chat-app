import { useUser } from "@/context/UserProvider";
import { useQueue } from "@/hooks/useQueue";
import { getRandomAvatar } from "@/utils/avatarUtils";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";

interface QueueUser {
  id: string;
  name: string;
  avatar: string | null;
  joined_at: string;
  last_seen: string;
}

interface UserQueueListProps {
  onSelectUser: (user: QueueUser) => void;
}

export default function UserQueueList({ onSelectUser }: UserQueueListProps) {
  const { user } = useUser();
  

  const { users, isLoading, error, refreshUsers } = useQueue();


  if (isLoading) {
    return (
      <section className="p-4">
        <p>Loading users...</p>
      </section>
    );
  }
  

  

  if (error) {
    return (
      <section className="p-4">
        <p className="text-red-500 mb-2">{error}</p>
        <button 
          onClick={refreshUsers}
          className="flex gap-2 text-sm font-semibold text-blue-500 underline cursor-pointer hover:bg-blue-500/15 rounded py-2"
        >
          Try again
          <RefreshCcw className="w-4"/>
        </button>
      </section>
    );
  }

  return (
    <section>
      {users.map((u) => (
        <div
          key={u.id}
          className={`flex items-center gap-3 p-4 cursor-pointer dark:text-white hover:bg-violet-100 hover:dark:bg-zinc-200/5 transition-colors duration-300 ${

            u.id === user?.id ? "bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-900/30 hover:dark:bg-zinc-900/80 transition-colors duration-300" : ""
          }`}
          onClick={() => onSelectUser(u)}
        >
          <img
            src={u.avatar || getRandomAvatar()}
            alt={`${u.name} profile picture`}
            className="w-12 h-12 rounded-lg"
          />

          <div>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{u.name}</p>
            {u.id === user?.id && (
              <p className="text-sm text-gray-500 dark:text-zinc-400">You</p>
            )}
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <p>No users online</p>
        </div>
      )}
    </section>
  );
}
