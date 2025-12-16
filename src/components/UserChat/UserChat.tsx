import useMessageRealTime from "@/hooks/useMessageRealTime";
import { useMessageSupabase } from "@/hooks/useMessageSupabase";
import { Mic, Paperclip, SendHorizontal, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";

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
  const [inputValue, setInputValue] = useState<string | "">("");

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
    return cleanup;
  }, [user, selectedUser]);

  // Auto-open de conversa quando alguém envia para mim
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
    setInputValue("");
  };

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="relative flex flex-col justify-between h-full w-full">
      <div
        className="pointer-events-none
        absolute top-0 left-0 right-0
        h-6
        bg-gradient-to-b
        dark:from-zinc-800
        to-transparent z-10"
      ></div>
      <div
        className="relative flex-1 p-4 overflow-y-auto scrollbar"
        ref={chatRef}
      >
        {messages.map((msg, index) => {
          const isMe = msg.from_id === user?.id;
          const prevMsg = messages[index - 1];
          const showAvatar = !prevMsg || prevMsg.from_id !== msg.from_id;

          const avatar = isMe ? user?.avatar : selectedUser?.avatar;

          return (
            <ChatBubble
              key={msg.id}
              message={msg.content}
              isMe={isMe}
              showAvatar={showAvatar}
              avatar={avatar}
            />
          );
        })}
      </div>
      <div
        className="pointer-events-none
        absolute bottom-14 left-0 right-0
        h-6
        bg-gradient-to-t
        dark:from-zinc-800
        to-transparent z-10"
      ></div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const text = formData.get("message") as string;
          handleSendMessage(text);
          e.currentTarget.reset();
        }}
        className="flex gap-2 mt-2 items-center shrink-0 mb-1 md: px-4"
      >
        <Paperclip className="shrink-0 h-12 w-12 px-3 rounded-full dark:bg-zinc-900/50 bg-gray-200 dark:text-gray-100 text-zinc-700 cursor-not-allowed" />
        <Smile className="shrink-0 h-12 w-12 px-3 rounded-full dark:bg-zinc-900/50 bg-gray-200 dark:text-gray-100 text-zinc-700 cursor-not-allowed" />
        <div className="relative w-full">
          <input
            name="message"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputText}
            className="relative w-full h-12 flex-1 pl-4 pr-12 bg-gray-200 text-zinc-800
             dark:text-white placeholder:text-zinc-600 dark:bg-zinc-900/50 rounded-full focus:dark:outline-none"
          />
          <Mic className=" absolute right-1 top-0 h-12 w-12 px-3 rounded-full text-zinc-700 dark:text-gray-100 cursor-not-allowed" />
        </div>

        <button
          className={`shrink-0 cursor-pointer rounded-full h-12 w-12 flex items-center justify-center transition-colors duration-300 ${
            inputValue === ""
              ? "dark:bg-zinc-900/50 dark:text-gray-100 bg-gray-200 text-zinc-950 opacity-80 cursor-not-allowed"
              : "bg-violet-500 cursor-pointer"
          }`}
        >
          <SendHorizontal />
        </button>
      </form>
    </div>
  );
}
