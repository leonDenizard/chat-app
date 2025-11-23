import { useUser } from "@/context/UserProvider";
import { useQueue } from "@/hooks/useQueue";
import { getRandomAvatar } from "@/utils/avatarUtils";

interface QueueUser {
  id: string;
  name: string;
  avatar: string | null;
  joined_at: string;
  last_seen: string;
}

interface UserQueueListProps {
  onSelectUser: (user: QueueUser) => void;
}

export default function UserQueueList({ onSelectUser }: UserQueueListProps) {
  const { user } = useUser();
  

  const { users, isLoading, error, refreshUsers } = useQueue();

  if (isLoading) {
    return (
      <section className="p-4">
        <p>Carregando usuários...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-4">
        <p className="text-red-500 mb-2">{error}</p>
        <button 
          onClick={refreshUsers}
          className="text-blue-500 underline"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section>
      {users.map((u) => (
        <div
          key={u.id}
          className={`flex items-center gap-3 p-2 border-b cursor-pointer hover:bg-gray-800/20 ${
            u.id === user?.id ? "bg-gray-800/30" : ""
          }`}
          onClick={() => onSelectUser(u)}
        >
          <img
            src={u.avatar || getRandomAvatar()}
            alt={`${u.name} profile picture`}
            className="w-12 h-12 rounded-3xl"
          />

          <div>
            <p className="font-semibold">{u.name}</p>
            {u.id === user?.id && (
              <p className="text-sm text-gray-500">Você</p>
            )}
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <p>Nenhum usuário online</p>
        </div>
      )}
    </section>
  );
}
