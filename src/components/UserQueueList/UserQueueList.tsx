import { useUser } from "@/context/UserProvider";
import useQueue from "@/hooks/useQueue";
import { supabase } from "@/lib/supabse";
import { useEffect, useState } from "react";

interface QueueUser {
  id: string;
  name: string;
  avatar: string | null;
  joined_at: string;
  last_seen: string;
}

export default function UserQueueList({ onSelectUser }) {
  const [list, setList] = useState<QueueUser[]>([]);
  const { user } = useUser();
  const

  useEffect(() => {
    //carrega a lista inicial

    async function loadQueue() {
      const { data } = await supabase
        .from("queue")
        .select("*")
        .order("joined_at", { ascending: true });

      setList(data || []);
    }

    loadQueue();

    //WS escuta o insert e delete
    const channel = supabase
      .channel("queue-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setList((prev) => [...prev, payload.new as QueueUser]);
          }

          if (payload.eventType === "DELETE") {
            setList((prev) =>
              prev.filter((u) => u.id !== (payload.old as QueueUser).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  useEffect(() => {
    const handleClose = () => {
      if (!user?.id) return;
      supabase.from("queue").delete().eq("id", user.id);
    };

    window.addEventListener("beforeunload", handleClose);
    window.addEventListener("unload", handleClose);

    return () => {
      window.removeEventListener("beforeunload", handleClose);
      window.removeEventListener("unload", handleClose);
    };
  }, [user]);

  return (
    <section>
      {list.map((u) => (
        <div
          key={u.id}
          className={`flex items-center gap-3 p-2 border-b ${
            u.id === user?.id ? "bg-gray-800/30" : ""
          }`}
          onClick={() => onSelectUser(u)}
        >
          <img
            src={u.avatar || "https://placehold.co/48x48"}
            alt="profile picture"
            className="w-12 h-12 rounded-3xl"
          />

          <div>
            <p className="font-semibold">{u.name}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
