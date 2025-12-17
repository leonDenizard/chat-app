import { useEffect, useState } from "react";

interface LastMessage {
    content: string;
    created_at: string;
}

type LastMessagesMap = Record<string, LastMessage>;

export function useLastMessages() {
    const [last, setLast] = useState<LastMessagesMap>({});

    useEffect(() => {
        console.log("lastMessages", last);
    }, [last]);

    const update = (
        userId: string,
        content: string,
        created_at: string
    ) => {
        setLast(prev => ({
            ...prev,
            [userId]: { content, created_at }
        }));
    };

    const clear = (userId: string) => {
        setLast(prev => {
            const copy = { ...prev };
            delete copy[userId];
            return copy;
        });
    };

    return { last, update, clear };
}