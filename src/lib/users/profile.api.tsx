import { apiFetch } from "../http/fetcher";
import type { UserProfile } from "../types/user";
import { asString, UnknownRecord } from "../utils/parsing";

export async function getUserByEmail(email: string) {
    try {
        const raw = await apiFetch<unknown>(`/api/users/by-email?email=${encodeURIComponent(email)}`, {
            fallbackError: "No se pudo obtener el perfil"
        });
        if (!raw || typeof raw !== "object") throw new Error("Perfil inválido");
        const o = raw as UnknownRecord;
        return {
            email: asString(o.email),
            fullName: asString(o.fullName),
            userName: asString(o.userName),
            phone: asString(o.phone),
            rut: asString(o.rut),
            birthDate: o.birthDate ? String(o.birthDate) : null,
            role: asString(o.role, "user"),
            plan: asString(o.plan, "free"),
        };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        // si tu apiFetch lanza con el texto "(404)" lo puedes detectar:
        if (msg.includes("(404)")) return null;
        throw e;
    }
}


export async function getMyProfile(): Promise<UserProfile> {
    const { authHeaders } = await import("../session/session");
    const raw = await apiFetch<unknown>("/api/users/me", {
        authHeaders: authHeaders(), cache: "no-store", fallbackError: "No se pudo obtener el perfil"
    });
    const o = raw as UnknownRecord;
    return {
        email: asString(o.email),
        fullName: asString(o.fullName),
        userName: asString(o.userName),
        phone: asString(o.phone),
        rut: asString(o.rut),
        birthDate: o.birthDate ? String(o.birthDate) : null,
        role: asString(o.role, "user"),
        plan: asString(o.plan, "free"),
    };
}

export async function updateProfile(payload: {
    email: string; fullName: string; userName: string; phone: string; rut: string; birthDate: string | null;
}): Promise<UserProfile> {
    const { authHeaders } = await import("../session/session");
    await apiFetch("/api/users/me", {
        method: "PUT",
        authHeaders: authHeaders(),
        body: payload,
        fallbackError: "No se pudo actualizar el perfil",
    });
    return getMyProfile();
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
    const { authHeaders } = await import("../session/session");
    await apiFetch("/api/users/me/password", {
        method: "PUT", authHeaders: authHeaders(), body: payload, fallbackError: "No se pudo cambiar la contraseña"
    });
    return { ok: true };
}

export async function deleteAccount() {
    const { authHeaders } = await import("../session/session");
    await apiFetch("/api/users/me", {
        method: "DELETE", authHeaders: authHeaders(), fallbackError: "No se pudo eliminar la cuenta"
    });
    return { ok: true };
}
