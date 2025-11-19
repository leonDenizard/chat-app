import { supabase } from "@/lib/supabse";
import { useEffect, useState } from "react";

export default function UserChat({ user, selectedUser, setSelectedUser }) {
  const [messages, setMessages] = useState([]);

  // 1️⃣ Carregar mensagens da conversa atual
  useEffect(() => {
    if (!user || !selectedUser) return;

    supabase
      .from("messages")
      .select("*")
      .or(
        `and(from_id.eq.${user.id},to_id.eq.${selectedUser.id}),and(from_id.eq.${selectedUser.id},to_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));
  }, [user, selectedUser]);


  // 2️⃣ Realtime da conversa atual (aparece sem reload)
  useEffect(() => {
    if (!user || !selectedUser) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;

          const isBetweenUsers =
            (msg.from_id === user.id && msg.to_id === selectedUser.id) ||
            (msg.from_id === selectedUser.id && msg.to_id === user.id);

          if (isBetweenUsers) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedUser]);


  // 3️⃣ Auto-open de conversa quando alguém envia para mim
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("auto-open-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const msg = payload.new;

          // mensagem enviada PARA mim
          if (msg.to_id === user.id) {
            // se eu não estou com ele aberto, abre
            if (!selectedUser || selectedUser.id !== msg.from_id) {
              const { data } = await supabase
                .from("queue")
                .select("*")
                .eq("id", msg.from_id)
                .single();

              setSelectedUser(data);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

