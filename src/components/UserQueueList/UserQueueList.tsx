import { useUser } from "@/context/UserProvider";
import { useQueue } from "@/hooks/useQueue";
import { getRandomAvatar } from "@/utils/avatarUtils";
import { RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import UnreadBadge from "./UnreadBadge";

interface QueueUser {
  id: string;
  name: string;
  avatar: string | null;
  joined_at: string;
  last_seen: string;
}

interface UserQueueListProps {
  onSelectUser: (user: QueueUser) => void;
  selectedUserId?: string;
  setIsAsideOpen: React.Dispatch<React.SetStateAction<boolean>>;
  unread: Record<string, number>;
}
export default function UserQueueList({
  onSelectUser,
  selectedUserId,
  setIsAsideOpen,
  unread,
}: UserQueueListProps) {
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
          <RefreshCcw className="w-4" />
        </button>
      </section>
    );
  }

  return (
    <section onClick={() => setIsAsideOpen(false)}>
      {users.map((u) => {
        const isSelected = u.id === selectedUserId;
        const unreadCount = unread[u.id] ?? 0;
        return (
          <motion.div
            layout
            key={u.id}
            className={`
              relative flex items-center gap-3 p-4 cursor-pointer dark:text-white
              hover:bg-zinc-200 hover:dark:bg-zinc-200/5 transition-colors duration-300
              ${isSelected ? "bg-violet-100 dark:bg-zinc-900/30" : ""}
            `}
            onClick={() => onSelectUser(u)}
          >
            {isSelected && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute right-0 top-0 h-full w-1 bg-violet-500 rounded-full"
              />
            )}
            
            {unreadCount > 0 && (
              <UnreadBadge count={unreadCount} />
            )}
            <img
              src={u.avatar || getRandomAvatar()}
              alt={`${u.name} profile picture`}
              className="w-12 h-12 rounded-lg"
            />

            <div>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                {u.name}
              </p>
              {u.id === user?.id && (
                <p className="text-sm text-gray-500 dark:text-zinc-400">You</p>
              )}
            </div>
          </motion.div>
        );
      })}

      {users.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <p>No users online</p>
        </div>
      )}
    </section>
  );
}
