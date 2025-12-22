import useMessageRealTime from "@/hooks/useMessageRealTime";
import { useMessageSupabase } from "@/hooks/useMessageSupabase";
import { Languages, Mic, Paperclip, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import "../../custom_style/loader.css";
import Loader from "../ui/Loader";
import { LANGUAGES, type LanguageOption } from "@/utils/flagsUtils";
import { useChatTranslation } from "@/hooks/useChatTranslation";

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
  translated?: string;
  created_at: string;
  updated_at: string;
  read_at?: string | null;
}

interface UserChatProps {
  user: UserData | null;
  selectedUser: UserData | null;
  setSelectedUser: (user: UserData | null) => void;
}

export default function UserChat({ user, selectedUser }: UserChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string | "">("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  useState<LanguageOption | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { loadMessages, sendMessage } = useMessageSupabase();
  const { createMessageChannel } = useMessageRealTime();

  const {
    selectedLanguage,
    isTranslateEnabled,
    enableTranslation,
    getTranslation,
    getCachedTranslation,
    isTranslating,
  } = useChatTranslation();

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

    const cleanup = createMessageChannel(user, selectedUser, setMessages);
    return cleanup;
  }, [user, selectedUser]);

  const handleSendMessage = async (text: string) => {
    if (isSending || !text.trim() || !user || !selectedUser) return;

    setIsSending(true);

    try {
      const { message, error } = await sendMessage({
        text: text.trim(),
        fromUserId: user.id,
        toUserId: selectedUser.id,
      });

      if (error || !message) {
        console.error(error);
        return;
      }

      setInputValue("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } catch (e) {
      console.error("Error send message", e);
    } finally {
      setIsSending(false);
    }
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
    notifyTyping();
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!isTranslateEnabled || !selectedLanguage) return;

    messages.forEach((msg) => {
      const cached = getCachedTranslation(msg.id);

      if (!cached) {
        getTranslation(msg.id, msg.content);
      }
    });
  }, [isTranslateEnabled, selectedLanguage, messages]);

  const { isTyping, notifyTyping } = useTypingIndicator(
    user?.id ?? null,
    selectedUser?.id ?? null
  );
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

          const cached = getCachedTranslation(msg.id);

          return (
            <ChatBubble
              key={msg.id}
              message={msg.content}
              translated={cached}
              isTranslateEnabled={isTranslateEnabled}
              isTranslating={isTranslating(msg.id)}
              isMe={isMe}
              showAvatar={showAvatar}
              avatar={isMe ? user?.avatar : selectedUser?.avatar}
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

      {isTyping && <Loader />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="flex gap-2 mt-2 items-center shrink-0 mb-1 md: px-4"
      >
        <Paperclip className="shrink-0 h-12 w-12 px-3 rounded-full dark:bg-zinc-900/50 bg-gray-200 dark:text-gray-100 text-zinc-700 cursor-not-allowed" />

        <div className="relative">
          {selectedLanguage ? (
            <img onClick={() => setIsLanguageMenuOpen((prev) => !prev)} 
            className="w-12 cursor-pointer select-none" src={selectedLanguage.flag} alt="" />
          ) : (
            <Languages
              onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
              className={`shrink-0 h-12 w-12 px-3 rounded-full cursor-pointer
              ${
                selectedLanguage
                  ? "bg-violet-500 text-white"
                  : "bg-gray-200 text-zinc-700 dark:text-gray-100 dark:bg-zinc-900/50"
              }`}
            />
          )}

          {isLanguageMenuOpen && (
            <div
              className="absolute dark:border-zinc-700 bottom-14 left-0
              bg-gray-200 dark:bg-zinc-900
              shadow-lg rounded-xl
              flex flex-col gap-2 z-50"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    enableTranslation(lang);
                    setIsLanguageMenuOpen(false);
                  }}
                  className={`rounded-lg transition w-12 p-2`}
                >
                  <img src={lang.flag} alt={lang.label} className="w-20" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full">
          <input
            ref={inputRef}
            name="message"
            placeholder={isSending ? "Sending message..." : "Type a message..."}
            value={inputValue}
            onChange={handleInputText}
            className={`
              relative w-full h-12 flex-1 pl-4 pr-12
              bg-gray-200 text-zinc-800
              dark:text-white dark:bg-zinc-900/50
              rounded-xl focus:outline-none focus:ring-0
              ${isSending ? "opacity-60" : ""}
            `}
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
