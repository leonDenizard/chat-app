import { createContext, useContext, useState } from "react";

interface UserData{
    id: string
    name: string;
    avatar?: string | null;
    joined_at: string;
    last_seen: string;
}

interface UserContextProps{

    user: UserData | null;
    setUser: (data: UserData | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export function UserProvider({ children }){
    const [user, setUser] = useState<UserData | null>(null)

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const ctx = useContext(UserContext)

    if(!ctx) throw new Error("useUser must be used within <UserProvider>")
    return ctx
}