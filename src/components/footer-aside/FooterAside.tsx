import { Archive, LogOut } from "lucide-react";

export default function FooterAside() {
  return (
    <div className="p-4 border-t-2 bordeg-zinc-200 dark:bordeg-zinc-700">
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 p-2 text-sm text-zinc-700 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300">
          <Archive className="w-4 h-4" />
          Archive
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 p-2 text-sm text-zinc-700 hover:text-red-400 cursor-pointer hover:dark:text-red-400 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700  rounded-lg transition-colors duration-300">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
