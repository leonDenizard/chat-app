import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function HeaderAside(){
    return(
        
        <header className="px-4 bordeg-zinc-200 dark:bordeg-zinc-700 border-b-2 h-20 flex items-center justify-center">
          {/* Search bar estilizada */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-900 dark:text-zinc-200" />
            <Input
              placeholder="Search chats..."
              className="pl-10 bg-violet-200 dark:bg-zinc-700 border-none h-10 text-zinc-900 dark:text-white dark:placeholder:text-zinc-200"
            />
          </div>
        </header>
        
    )
}