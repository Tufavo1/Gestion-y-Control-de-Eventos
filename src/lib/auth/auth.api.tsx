import { apiFetch } from "../http/fetcher";
import { persistSession } from "../session/session";
import type { RegisterPayload, ApiLoginResponse } from "../types/auth";
import type { PlanId } from "../types/ids";
import { normalizeRut } from "../utils/parsing";

function ensureLoginResponse(x: unknown, email: string): ApiLoginResponse {
    if (typeof x !== "object" || x === null) {
        throw new Error("Respuesta inválida del servidor (formato).");
    }
    const obj = x as Record<string, unknown>;

    const token = String(obj.token ?? "");
    if (!token) throw new Error("Respuesta inválida del servidor (token).");

    const fullName = String(obj.fullName ?? email.split("@")[0] ?? "");
    const role = String(obj.role ?? "user");
    const plan = String(obj.plan ?? "free");

    return { token, fullName, role, plan };
}


export async function registerUser(data: RegisterPayload) {
    const body = {
        Email: data.email.trim().toLowerCase(),
        Password: data.password,
        FullName: data.fullName.trim(),
        UserName: data.userName.trim(),
        Phone: data.phoneNumber.trim(),
        Rut: normalizeRut(data.rut),
        BirthDate: data.birthDate,
        Plan: data.plan ?? null,
        Role: data.role ?? null,
    };
    await apiFetch("/api/auth/register", {
        method: "POST",
        body,
        fallbackError: "No se pudo registrar",
    });
    return { ok: true };
}

export async function login(email: string, password: string, remember = true): Promise<ApiLoginResponse> {
    const raw = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email: email.trim().toLowerCase(), password },
        fallbackError: "Credenciales inválidas",
    });
    const parsed = ensureLoginResponse(raw, email);
    try {
        persistSession(
            { token: parsed.token, fullName: parsed.fullName, role: parsed.role, plan: parsed.plan, email },
            remember
        );
    } catch { }
    return parsed;
}


export async function selectPlan(planId: PlanId) {
    const { authHeaders } = await import("../session/session");
    await apiFetch("/api/billing/select-plan", {
        method: "POST",
        authHeaders: authHeaders(),
        body: { planId },
        fallbackError: "No se pudo seleccionar el plan",
    });
    return { ok: true };
}

export async function createCheckout(planId: Exclude<PlanId, "free">) {
    const { authHeaders } = await import("../session/session");
    return apiFetch<{ checkoutUrl: string }>("/api/billing/create-checkout", {
        method: "POST",
        authHeaders: authHeaders(),
        body: { planId },
        fallbackError: "No se pudo iniciar el checkout",
    });
}
