// context/AuthContext.tsx
"use client";

import { clearSession, getStoredSession, persistSession, StoredSession } from "@/lib/session/session";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";


type AuthState = {
    user: StoredSession | null;
    setUser: (u: StoredSession | null, remember?: boolean) => void;
    logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<StoredSession | null>(null);

    useEffect(() => {
        // al montar, intenta cargar la sesión del storage
        setUserState(getStoredSession());
    }, []);

    const setUser = (u: StoredSession | null, remember = true) => {
        if (u) {
            persistSession(u, remember);
            setUserState(u);
        } else {
            clearSession();
            setUserState(null);
        }
    };

    const logout = () => {
        clearSession();
        setUserState(null);
        // opcional: redirigir a home
        window.location.href = "/";
    };

    return (
        <AuthCtx.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
