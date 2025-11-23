// src/pages/Chat.tsx
import FooterAside from "@/components/footer-aside/FooterAside";
import HeaderAside from "@/components/header-aside/HeaderAside";
import UserChat from "@/components/UserChat/UserChat";
import UserQueueList from "@/components/UserQueueList/UserQueueList";
import { useTheme } from "@/context/ThemeProvider";
import { useUser } from "@/context/UserProvider";
import useQueue from "@/hooks/useQueue";
import { useUserSupabase } from "@/hooks/useUserSupabase";
import {
  Settings,
  Users,
  Moon,
  Sun,
} from "lucide-react";
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
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useUser();
  const { users } = useQueue()
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
    <div className="h-screen flex bg-zinc-50 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside className="w-80 bg-zinc-100 dark:bg-zinc-800 border-r-2 dark:bordeg-zinc-700 flex flex-col">
        {/* Header da sidebar */}
        <HeaderAside/>

        {/* Seções */}
        <div className="flex-1 overflow-hidden">
          {/* Seção de chats ativos */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-[500] text-zinc-900 dark:text-white">
                All Chats
              </h3>
              <span className="text-sm h-7 w-7 flex items-center justify-center font-semibold bg-violet-300 dark:bg-zinc-700 text-violet-500 dark:text-violet-500 rounded-full">
                {users.length}
              </span>
            </div>
          </div>

          {/* Lista dos usuários */}
          <div className="flex-1 overflow-y-auto">
            <UserQueueList onSelectUser={setSelectedUser} />
          </div>

          
        </div>
        {/* Footer da sidebar */}
          <FooterAside/>
      </aside>

      {/* Área principal do chat */}
      <main className="flex-1 flex flex-col bg-zinc-100 dark:bg-zinc-800">
        <header className="h-20 border-b-2 dark:bordeg-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center px-4">
          <div
            className={`w-full flex items-center justify-between ${
              selectedUser ? "" : "justify-end"
            }`}
          >
            {selectedUser && (
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser?.avatar || "/default-avatar.png"}
                  alt={selectedUser?.name}
                  className="w-10 h-10 rounded-full"
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
          <div className="flex-1">
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
