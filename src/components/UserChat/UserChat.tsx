import useMessageRealTime from "@/hooks/useMessageRealTime";
import { useMessageSupabase } from "@/hooks/useMessageSupabase";
import { supabase } from "@/lib/supabse";
import { useEffect, useState } from "react";

export default function UserChat({ user, selectedUser, setSelectedUser }) {
  const [messages, setMessages] = useState([]);

  const { loadMessage } = useMessageSupabase()
  const { creatChannel, autoOpen } = useMessageRealTime()

  useEffect(() => {
    if (!user || !selectedUser) return;

    loadMessage(user, selectedUser, setMessages)

  }, [user, selectedUser]);


  useEffect(() => {
    if (!user || !selectedUser) return;

    creatChannel(user, selectedUser, setMessages)

  }, [user, selectedUser]);


  // 3️⃣ Auto-open de conversa quando alguém envia para mim
  useEffect(() => {
    if (!user) return;

    autoOpen(user, selectedUser, setSelectedUser);

  }, [user, selectedUser]);


  // 4️⃣ Enviar mensagem
  async function sendMessage(text) {
    if (!text.trim()) return;

    await supabase.from("messages").insert({
      from_id: user.id,
      to_id: selectedUser.id,
      content: text,
    });
  }


  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 my-2 rounded-lg max-w-[60%] ${
              msg.from_id === user.id
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
          const text = e.target.message.value;
          sendMessage(text);
          e.target.reset();
        }}
        className="flex gap-2 mt-2"
      >
        <input name="message" className="flex-1 p-2 bg-gray-800" />
        <button className="bg-blue-600 px-4 rounded">Enviar</button>
      </form>
    </div>
  );
}

