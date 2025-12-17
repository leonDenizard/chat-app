// src/pages/Chat.tsx
import FooterAside from "@/components/footer-aside/FooterAside";
import HeaderAside from "@/components/header-aside/HeaderAside";
import UserChat from "@/components/UserChat/UserChat";
import UserQueueList from "@/components/UserQueueList/UserQueueList";
import { useTheme } from "@/context/ThemeProvider";
import { useUser } from "@/context/UserProvider";
import { useKickUser } from "@/hooks/useKickUser";
import { useLastMessages } from "@/hooks/useLastMessages";
import useMessageRealTime from "@/hooks/useMessageRealTime";
import useQueue from "@/hooks/useQueue";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useUserSupabase } from "@/hooks/useUserSupabase";
import { Settings, Users, Moon, Sun, TimerReset, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

interface UserData {
  id: string;
  name: string;
  avatar?: string | null;
  joined_at: string;
  last_seen: string;
}

export default function Chat() {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useUser();
  const { users } = useQueue();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  const { id } = useParams<{ id: string }>();

  const { getUser, removeUser } = useUserSupabase();

  const unread = useUnreadMessages();
  const realtime = useMessageRealTime();
  const lastMessages = useLastMessages();
  

  useKickUser({
    pollMs: 10000,
    onKicked: () => {
      toast("Your session has expired.", {
        icon: <TimerReset />,
        style: { borderRadius: 10, background: "#333", color: "#fff" },
      });
    },
    replaceHistory: true,
  });

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

  useEffect(() => {
  if (!user) return;

  const cleanup = realtime.subscribeUnread(
    user,
    selectedUser?.id ?? null,
    {
      onUnread: unread.increment,
      onLastMessage: lastMessages.update
    }
  );

  return cleanup;
}, [user, selectedUser?.id]);

  useEffect(() => {
    if (selectedUser) {
      unread.clear(selectedUser.id);
    }
  }, [selectedUser]);

  return (
    <div className="h-dvh flex bg-zinc-50 dark:bg-zinc-800">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-50 bg-zinc-100 dark:bg-zinc-800 border-r-2 dark:border-zinc-700
        flex flex-col w-80 transform transition-transform duration-200
        ${isAsideOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 
       `}
      >
        {/* Header da sidebar */}
        <HeaderAside setIsAsideOpen={setIsAsideOpen} />

        {/* Seções */}
        <div className="flex-1 overflow-auto scrollbar">
          {/* Seção de chats ativos */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-[500] text-zinc-900 dark:text-white">
                All Chats
              </h3>
              <span className="text-sm">
                <span className="text-violet-500 font-bold">(</span>
                <span className="mx-0.5 font-semibold text-violet-500 tabular-nums">
                  {users.length}
                </span>
                <span className="text-violet-500 font-bold">)</span>
              </span>
            </div>
          </div>

          {/* Lista dos usuários */}
          <div className="flex-1 overflow-y-auto">
            <UserQueueList
              setIsAsideOpen={setIsAsideOpen}
              onSelectUser={(u) => {
                setSelectedUser(u);
                unread.clear(u.id);
                lastMessages.clear(u.id)
              }}
              selectedUserId={selectedUser?.id}
              unread={unread.unread}
              lastMessages={lastMessages.last}
            />
          </div>
        </div>
        {/* Footer da sidebar */}
        <FooterAside />
      </aside>

      {/* Área principal do chat */}
      <main className="flex-1 flex flex-col bg-zinc-100 dark:bg-zinc-800">
        <header className="h-20 border-b-2 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center px-4">
          <Menu
            className="md:hidden mr-2 cursor-pointer h-10 w-12 p-2 text-zinc-700 dark:text-zinc-200 hover:dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300"
            onClick={() => setIsAsideOpen(true)}
          />
          <div
            className={`w-full flex items-center justify-between ${
              selectedUser ? "" : "justify-end"
            }`}
          >
            {selectedUser && (
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser?.avatar || "/av1.png"}
                  alt={selectedUser?.name}
                  className="w-10 h-10 rounded-md"
                />
                <div>
                  <h2 className="font-semibold text-zinc-900 dark:text-white">
                    {selectedUser?.name}
                  </h2>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button className=" cursor-pointer p-2 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300">
                <Users className="w-5 h-5 text-zinc-700 dark:text-zinc-400" />
              </button>
              <button className="cursor-pointer p-2 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300">
                <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-400" />
              </button>

              <button
                onClick={toggleTheme}
                className="cursor-pointer p-2 rounded-lg bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bt-zinc-700 transition-colors"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } theme`}
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-zinc-700 dark:text-zinc-400" />
                ) : (
                  <Sun className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </header>

        {selectedUser ? (
          <div className="flex flex-1 overflow-hidden">
            <UserChat
              user={user}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-violet-300 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                No conversation selected
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Choose a user from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
