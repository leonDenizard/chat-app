import { useCallback, useState } from "react"

type UnreadMap = Record<string, number>

export function useUnreadMessages() {

    const [unread, setUnread] = useState<UnreadMap>({})

    const increment = useCallback((fromId: string) => {
        setUnread(prev => ({
            ...prev,
            [fromId]: (prev[fromId] || 0) + 1
        }))
    }, [])

    const clear = useCallback((userId: string) => {
        setUnread(prev => {
            const next = { ...prev }
            delete next[userId]
            return next
        })
    }, [])

    const getCount = useCallback(
        (userId: string) => unread[userId] ?? 0,
        [unread]
    );

    return {
        unread,
        increment,
        clear,
        getCount
    };
}