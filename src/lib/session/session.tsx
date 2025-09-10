export type StoredSession = {
    token: string;
    fullName: string;
    role: string;
    plan?: string;
    email?: string;
};

const KEY = "cuponme_auth";

function read(from: Storage): StoredSession | null {
    const raw = from.getItem(KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as StoredSession; } catch { return null; }
}

export function getStoredSession(): StoredSession | null {
    if (typeof window === "undefined") return null;
    return read(sessionStorage) ?? read(localStorage);
}

/** Persistir sesión con opción "remember".
 *  - remember=true => localStorage (entre cierres del navegador)
 *  - remember=false => solo sessionStorage (hasta cerrar pestaña/ventana)
 */
export function persistSession(s: StoredSession, remember = true) {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify(s);

    if (remember) {
        localStorage.setItem(KEY, payload);
        sessionStorage.removeItem(KEY);
    } else {
        sessionStorage.setItem(KEY, payload);
        localStorage.removeItem(KEY);
    }

    const opts = "path=/; SameSite=Lax";
    if (s.email) document.cookie = `email=${encodeURIComponent(s.email)}; ${opts}`;
    if (s.role) document.cookie = `role=${encodeURIComponent(s.role)}; ${opts}`;
}

export function clearSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
}

export function authHeaders(): Record<string, string> {
    const s = getStoredSession();
    const h: Record<string, string> = {};
    if (s?.token) h.Authorization = `Bearer ${s.token}`;
    if (s?.email) h["X-Email"] = s.email;
    return h;
}