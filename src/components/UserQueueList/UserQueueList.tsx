import { useUser } from "@/context/UserProvider";
import { useQueue } from "@/hooks/useQueue";
import { getRandomAvatar } from "@/utils/avatarUtils";
import { RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import UnreadBadge from "./UnreadBadge";
import { useMemo } from "react";

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
  lastMessages: Record<string, { content: string; created_at: string }>;
}
export default function UserQueueList({
  onSelectUser,
  selectedUserId,
  setIsAsideOpen,
  unread,
  lastMessages,
}: UserQueueListProps) {
  const { user } = useUser();

  const { users, isLoading, error, refreshUsers } = useQueue();

  const lastActiveUserId = useMemo(() => {
    if (!lastMessages) return null;

    return Object.entries(lastMessages).sort(
      ([, a], [, b]) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]?.[0];
  }, [lastMessages]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {

      if (a.id === user?.id) return -1;
      if (b.id === user?.id) return 1;


      if (a.id === lastActiveUserId) return -1;
      if (b.id === lastActiveUserId) return 1;

      const aTime = new Date(lastMessages?.[a.id]?.created_at ?? 0).getTime();
      const bTime = new Date(lastMessages?.[b.id]?.created_at ?? 0).getTime();

      return bTime - aTime;
    });
  }, [users, user?.id, lastMessages, lastActiveUserId]);

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
      {sortedUsers.map((u) => {
        const isSelected = u.id === selectedUserId;
        const unreadCount = unread[u.id] ?? 0;
        const lastMsg = lastMessages[u.id]?.content;
        return (
          <motion.div
            layout
            key={u.id}
            className={`
              relative flex items-center gap-3 p-4 cursor-pointer dark:text-white
              hover:bg-zinc-200 hover:dark:bg-zinc-200/5 transition-colors duration-300 group
              ${isSelected ? "bg-violet-100 dark:bg-zinc-900/30" : ""}
            `}
            onClick={() => onSelectUser(u)}
          >
            {isSelected && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute right-0 top-0 h-full w-1 bg-violet-500 shadow-2xl shadow-2xl-violet-500"
              />
            )}

            {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
            <img
              src={u.avatar || getRandomAvatar()}
              alt={`${u.name} profile picture`}
              className="w-12 h-12 rounded-lg"
            />

            <motion.div
              layout={"position"}
              transition={{ duration: 0.25, ease: "easeIn" }}
              className="flex flex-col"
            >
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                {u.name}
              </p>
              {u.id === user?.id && (
                <p className="text-sm text-gray-500 dark:text-zinc-400">You</p>
              )}
              <div className="relative max-w-48 overflow-hidden">
                <motion.p
                  key={lastMsg}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="text-sm text-zinc-500 dark:text-zinc-500 truncate"
                >
                  {lastMsg}
                </motion.p>

                <div
                  className="
                    pointer-events-none
                    absolute top-0 right-0 h-full w-10

                    bg-gradient-to-l
                    from-zinc-100 dark:from-zinc-800
                    to-transparent

                    group-hover:from-zinc-200
                    dark:group-hover:from-zinc-200/0

                    transition-colors duration-200
                  "
                />
              </div>
            </motion.div>
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
