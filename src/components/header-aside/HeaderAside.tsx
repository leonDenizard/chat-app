import { Search, X } from "lucide-react";
import { Input } from "../ui/input";

interface HeaderAsideProps {
  setIsAsideOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HeaderAside({setIsAsideOpen}: HeaderAsideProps){
    return(
        
        <header className="px-4 bordeg-zinc-200 dark:bordeg-zinc-700 border-b-2 h-20 flex items-center justify-center">
          {/* Search bar estilizada */}
          <div className="relative w-full flex justify-between items-center gap-1.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-900 dark:text-zinc-200" />
            <Input
              placeholder="Search chats..."
              className="cursor-not-allowed pl-10 bg-violet-200 dark:bg-zinc-700 border-none h-10 text-zinc-900 dark:text-white dark:placeholder:text-zinc-400"
            />
            <X className="md:hidden relative cursor-pointer text-zinc-700 dark:text-zinc-200 hover:dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300 h-10 w-12 p-2"
              onClick={() => setIsAsideOpen(false)}
            />
          </div>
        </header>
        
    )
}