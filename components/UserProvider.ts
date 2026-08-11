'use client'
import { useContext, useState, useEffect, createContext, createElement, ReactNode } from "react";

interface UserInterface {
    firstName?: string;
    lastName?: string;
}

interface UserContextValue {
    user: UserInterface | undefined;
    loading: boolean;
}

const UserContext = createContext<UserContextValue>({ user: undefined, loading: true });

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserInterface>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/user");
                if (!res.ok) return;
                const data = await res.json();
                console.log('data',data)
                setUser(data);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

   return createElement(UserContext.Provider, { value: { user, loading } }, children);
}

export function useUser() {
    return useContext(UserContext);
}