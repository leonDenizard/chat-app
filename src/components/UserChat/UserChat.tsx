import useMessageRealTime from "@/hooks/useMessageRealTime";
import { useMessageSupabase } from "@/hooks/useMessageSupabase";
import { Mic, Paperclip, SendHorizontal, Smile } from "lucide-react";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string;
  avatar?: string | null;
  joined_at: string;
  last_seen: string;
}

interface Message {
  id: string;
  content: string;
  from_id: string;
  to_id: string;
  created_at: string;
  updated_at: string;
  read_at?: string | null;
}

interface UserChatProps {
  user: UserData | null;
  selectedUser: UserData | null;
  setSelectedUser: (user: UserData | null) => void;
}

export default function UserChat({
  user,
  selectedUser,
  setSelectedUser,
}: UserChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const { loadMessages, sendMessage } = useMessageSupabase();
  const { creatChannel, autoOpen } = useMessageRealTime();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !selectedUser) return;

      const { messages, error } = await loadMessages({
        fromUserId: user.id,
        toUserId: selectedUser.id,
      });

      if (error) {
        console.log(error);
        return;
      }

      setMessages(messages);
    };

    fetchMessages();
  }, [user?.id, selectedUser?.id]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    const cleanup = creatChannel(user, selectedUser, setMessages);
    return cleanup
    
  }, [user, selectedUser]);

  // 3️⃣ Auto-open de conversa quando alguém envia para mim
  useEffect(() => {
    if (!user) return;

    autoOpen(user, selectedUser, setSelectedUser);
  }, [user, selectedUser]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !user || !selectedUser) return;

    const result = await sendMessage({
      text: text.trim(),
      fromUserId: user.id,
      toUserId: selectedUser.id,
    });

    if (result.error) {
      console.log("Erro ao enviar", result.error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 my-2 rounded-lg max-w-[40%] text-wrap ${
              msg.from_id === user?.id
                ? "bg-violet-500 text-white self-end ml-auto"
                : "bg-zinc-700 text-white self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const text = formData.get("message") as string;
          handleSendMessage(text);
          e.currentTarget.reset();
        }}
        className="flex gap-2 mt-2 items-center"
      >
        
          <Paperclip className="shrink-0 h-12 w-12 px-3 rounded-full dark:bg-zinc-900/50 bg-gray-200 dark:text-gray-100 text-zinc-700 cursor-not-allowed"/>
          <Smile className="shrink-0 h-12 w-12 px-3 rounded-full dark:bg-zinc-900/50 bg-gray-200 dark:text-gray-100 text-zinc-700 cursor-not-allowed" />
          <div className="relative w-full">
            <input
            name="message"
            placeholder="Type a message..."
            className="relative w-full h-12 flex-1 p-2 px-6 bg-gray-200 text-zinc-800
             dark:text-white placeholder:text-zinc-600 dark:bg-zinc-900/50 rounded-full focus:dark:outline-none"
             
          />
          <Mic className=" absolute right-1 top-0 h-12 w-12 px-3 rounded-full text-zinc-700 dark:text-gray-100 cursor-not-allowed" />
          </div>

     
        <button className="shrink-0 cursor-pointer bg-violet-500 rounded-full h-12 w-12 flex items-center justify-center">
          <SendHorizontal />
        </button>
      </form>
    </div>
  );
}
