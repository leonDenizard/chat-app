import useMessageRealTime from "@/hooks/useMessageRealTime";
import { useMessageSupabase } from "@/hooks/useMessageSupabase";
import { useEffect, useState } from "react";

interface UserData{
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


export default function UserChat({ user, selectedUser, setSelectedUser }: UserChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const { loadMessages, sendMessage } = useMessageSupabase();
  const { creatChannel, autoOpen } = useMessageRealTime();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !selectedUser) return;

      const {messages, error } = await loadMessages({
        fromUserId: user.id,
        toUserId: selectedUser.id
      });

      if(error){
        console.log(error)
        return
      }

      setMessages(messages)
    };

    fetchMessages()
  }, [user?.id, selectedUser?.id]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    creatChannel(user, selectedUser, setMessages);
  }, [user, selectedUser]);

  // 3️⃣ Auto-open de conversa quando alguém envia para mim
  useEffect(() => {
    if (!user) return;

    autoOpen(user, selectedUser, setSelectedUser);
  }, [user, selectedUser]);

  const handleSendMessage = async(text: string) => {

    if (!text.trim() || !user || !selectedUser) return;

    const result = await sendMessage({
      text: text.trim(),
      fromUserId: user.id,
      toUserId: selectedUser.id
    })

    if(result.error){
      console.log("Erro ao enviar", result.error)
    }
  }
  

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 my-2 rounded-lg max-w-[60%] ${
              msg.from_id === user?.id
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-gray-700 text-white self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget)
          const text = formData.get("message") as string
          handleSendMessage(text)
          e.currentTarget.reset();
        }}
        className="flex gap-2 mt-2"
      >
        <input name="message" className="flex-1 p-2 bg-gray-800" />
        <button className="bg-blue-600 px-4 rounded">Enviar</button>
      </form>
    </div>
  );
}
