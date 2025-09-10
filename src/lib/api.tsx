// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL!;
if (!BASE) console.warn("WARN: NEXT_PUBLIC_API_URL no está definido.");

/* =========================
   Sesión
========================= */
export type StoredSession = {
    token: string;
    fullName: string;
    role: string;   // jerárquico
    plan?: string;  // comercial
    email?: string;
};

const SESSION_KEY = "cuponme_auth";

function readSession(from: Storage): StoredSession | null {
    const raw = from.getItem(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as StoredSession; } catch { return null; }
}

export function getStoredSession(): StoredSession | null {
    if (typeof window === "undefined") return null;
    return readSession(sessionStorage) ?? readSession(localStorage);
}

export function persistSession(s: StoredSession) {
    if (typeof window === "undefined") return;
    const json = JSON.stringify(s);
    try { sessionStorage.setItem(SESSION_KEY, json); } catch { localStorage.setItem(SESSION_KEY, json); }

    // espejo simple vía cookies (dev)
    const opts = "path=/; SameSite=Lax";
    if (s.email) document.cookie = `email=${encodeURIComponent(s.email)}; ${opts}`;
    if (s.role) document.cookie = `role=${encodeURIComponent(s.role)}; ${opts}`;
}

export function clearSession() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
}

function authHeaders(): Record<string, string> {
    const s = getStoredSession();
    const h: Record<string, string> = {};
    if (s?.token) h.Authorization = `Bearer ${s.token}`;
    if (s?.email) h["X-Email"] = s.email; // requerido por varios endpoints
    return h;
}

/* =========================
   Utils
========================= */
type UnknownRecord = Record<string, unknown>;

function isObject(x: unknown): x is UnknownRecord {
    return typeof x === "object" && x !== null;
}
function asString(v: unknown, fallback = ""): string {
    return typeof v === "string" ? v : v == null ? fallback : String(v);
}
function asNumber(v: unknown, fallback = 0): number {
    if (typeof v === "number") return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}
function asId(v: unknown): string | number {
    if (typeof v === "string" || typeof v === "number") return v;
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto.randomUUID() as string)
        : Math.random().toString(36).slice(2);
}
const normalizeRut = (rut: string) => rut.replace(/[^0-9kK]/g, "").toUpperCase();

async function safeJson<T = unknown>(res: Response): Promise<T | null> {
    try { return (await res.json()) as T; } catch { return null; }
}

type ApiErrorShape = { title?: string; message?: string };
function extractErr(msg: ApiErrorShape | null, status: number, fallback: string) {
    return new Error(msg?.message ?? msg?.title ?? `${fallback} (${status})`);
}

/* =========================
   Tipos compartidos
========================= */
export type PlanId = "free" | "basic" | "premium" | "gold";
export type RoleId = "user" | "member" | "admin" | "superadmin";

export type RegisterPayload = {
    fullName: string;
    rut: string;
    birthDate: string | null;
    phoneNumber: string;
    userName: string;
    email: string;
    password: string;
    plan?: PlanId; // comercial (se guarda en /auth/register)
    role?: RoleId; // jerárquico (opcional)
};

export type ApiLoginResponse = {
    token: string;
    fullName: string;
    role: string;
    plan: string;
};

type ApiOk = Record<string, unknown> | null;

/* =========================
   Auth
========================= */
function isLoginLike(obj: unknown): obj is Partial<ApiLoginResponse> & Record<string, unknown> {
    return typeof obj === "object" && obj !== null;
}

function ensureLoginResponse(x: unknown, email: string): ApiLoginResponse {
    if (!isLoginLike(x)) throw new Error("Respuesta inválida del servidor (formato).");
    const token = (x.token ?? "").toString();
    if (!token) throw new Error("Respuesta inválida del servidor (token).");
    const fullName = (x.fullName ?? email.split("@")[0] ?? "").toString();
    const role = (x.role ?? "user").toString();
    const plan = (x.plan ?? "free").toString();
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

    const res = await fetch(`${BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo registrar");
    return (await safeJson<ApiOk>(res)) ?? { ok: true };
}

export async function login(email: string, password: string): Promise<ApiLoginResponse> {
    const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "Credenciales inválidas");

    const parsed = ensureLoginResponse(await safeJson(res), email);
    try {
        persistSession({
            token: parsed.token,
            fullName: parsed.fullName,
            role: parsed.role,
            plan: parsed.plan,
            email,
        });
    } catch { /* no-op */ }
    return parsed;
}

export async function selectPlan(planId: PlanId) {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/billing/select-plan`, {
        method: "POST",
        headers,
        body: JSON.stringify({ planId }),
    });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo seleccionar el plan");
    return { ok: true };
}

export async function createCheckout(planId: Exclude<PlanId, "free">) {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/billing/create-checkout`, {
        method: "POST",
        headers,
        body: JSON.stringify({ planId }),
    });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo iniciar el checkout");
    return (await safeJson<{ checkoutUrl: string }>(res))!;
}

/* =========================
   Perfil
========================= */
export type UserProfile = {
    email: string;
    fullName: string;
    userName: string;
    phone: string;
    rut: string;
    birthDate: string | null;
    role: string; // jerárquico
    plan: string; // comercial
};

export async function getUserByEmail(email: string) {
    const res = await fetch(`${BASE}/api/users/by-email?email=${encodeURIComponent(email)}`, {
        headers: { "Content-Type": "application/json" },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`No se pudo obtener el perfil (${res.status})`);

    const raw = await safeJson(res);
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
}

export async function getMyProfile(): Promise<UserProfile> {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/users/me`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudo obtener el perfil (${res.status})`);

    const raw = await safeJson(res);
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
}

export async function updateProfile(payload: {
    email: string;
    fullName: string;
    userName: string;
    phone: string;
    rut: string;
    birthDate: string | null;
}): Promise<UserProfile> {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/users/me`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo actualizar el perfil");
    return await getMyProfile();
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/users/me/password`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo cambiar la contraseña");
    return { ok: true };
}

export async function deleteAccount() {
    const headers: HeadersInit = { ...authHeaders() };
    const res = await fetch(`${BASE}/api/users/me`, { method: "DELETE", headers });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo eliminar la cuenta");
    return { ok: true };
}

/* =========================
   Compras & eventos (stubs)
========================= */
export type Purchase = {
    id: string | number;
    eventTitle: string;
    purchasedAt: string;
    amount: number;
    quantity: number;
};

export type AttendedEvent = {
    id: string | number;
    title: string;
    date: string;
    venue: string;
};

export async function getPurchaseHistory(): Promise<Purchase[]> {
    const headers: HeadersInit = { ...authHeaders() };
    const res = await fetch(`${BASE}/api/users/me/purchases`, { headers, cache: "no-store" });
    if (!res.ok) return [];

    const raw = await safeJson(res);
    if (!Array.isArray(raw)) return [];

    const items: Purchase[] = [];
    for (const elem of raw) {
        if (!isObject(elem)) continue;
        items.push({
            id: asId(elem["id"]),
            eventTitle: asString(elem["eventTitle"], "Evento"),
            purchasedAt: asString(elem["purchasedAt"], new Date().toISOString()),
            amount: asNumber(elem["amount"], 0),
            quantity: asNumber(elem["quantity"], 1),
        });
    }
    return items;
}

export async function getLastAttendedEvents(): Promise<AttendedEvent[]> {
    const headers: HeadersInit = { ...authHeaders() };
    const res = await fetch(`${BASE}/api/users/me/attended`, { headers, cache: "no-store" });
    if (!res.ok) return [];

    const raw = await safeJson(res);
    if (!Array.isArray(raw)) return [];

    const items: AttendedEvent[] = [];
    for (const elem of raw) {
        if (!isObject(elem)) continue;
        items.push({
            id: asId(elem["id"]),
            title: asString(elem["title"], "Evento"),
            date: asString(elem["date"], new Date().toISOString()),
            venue: asString(elem["venue"], "—"),
        });
    }
    return items;
}

export async function registerToEvent(eventId: number) {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/events/${eventId}/register`, { method: "POST", headers });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "Error al registrarse en evento");
    return (await safeJson<ApiOk>(res)) ?? { ok: true };
}

export async function createEvent(payload: {
    title: string;
    startsAt: string;
    endsAt: string;
    capacity: number;
    venueId: number;
}) {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/events`, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "Error creando evento");
    return (await safeJson<ApiOk>(res)) ?? { ok: true };
}

/* =========================
   Admin: usuarios
========================= */
export type AdminUser = {
    id: number;
    email: string;
    fullName: string;
    userName: string;
    phoneNumber: string;
    rut: string;
    birthDate: string | null;
    role: RoleId;
    plan: PlanId;
    createdAt: string;
};

export async function adminListUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${BASE}/api/admin/users`, { headers: { ...authHeaders() } });
    if (res.status === 403) throw new Error("Solo el admin o superadmin puede ver usuarios.");
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo listar usuarios");
    return (await safeJson<AdminUser[]>(res)) ?? [];
}

export async function adminSetUserRole(id: number, role: RoleId) {
    const res = await fetch(`${BASE}/api/admin/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ role }),
    });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo cambiar el rol");
    return await safeJson(res);
}

export async function adminSetUserPlan(id: number, plan: PlanId) {
    const res = await fetch(`${BASE}/api/admin/users/${id}/plan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ plan }),
    });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo cambiar el plan");
    return await safeJson(res);
}

export async function adminDeleteUser(id: number) {
    const res = await fetch(`${BASE}/api/admin/users/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo eliminar el usuario");
    return await safeJson(res);
}

/* =========================
   Admin: planes
========================= */
export type PlanDefinition = {
    id: "free" | "basic" | "premium" | "gold" | (string & {});
    name: string;
    priceCents: number;           // mapeado desde PriceCl (CLP enteros)
    period: string;               // "/mes" | "/siempre"
    highlight: boolean;
    badge?: string | null;
    description: string;
    canCreateEvents: number | null; // null = ilimitado
    canManageEvents: number | null; // null = ilimitado
    benefits: string[];
    limitations: string[];
    updatedAt?: string;
};

// DTO de backend para /api/admin/plans
type ApiPlan = {
    id: string;
    name: string;
    priceCl: number;
    period: string;
    highlight: boolean;
    badge?: string | null;
    description: string;
    canCreateEvents?: number | null;
    canManageEvents?: number | null;
    benefitsJson?: string;
    limitationsJson?: string;
    updatedAt?: string;
};

// Público (marketing)
export async function listPlans(): Promise<PlanDefinition[]> {
    const res = await fetch(`${BASE}/api/plans`, { cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudieron cargar los planes (${res.status})`);
    const body = await safeJson<unknown>(res);
    if (!Array.isArray(body)) return [];

    return body.map((o) => {
        const r = o as UnknownRecord;
        return {
            id: asString(r.id),
            name: asString(r.name),
            priceCents: asNumber(r.price, 0), // la API pública devuelve "price"
            period: asString(r.period, "/mes"),
            highlight: Boolean(r.highlight),
            badge: r.badge == null ? null : String(r.badge),
            description: asString(r.description),
            canCreateEvents: r.canCreateEvents == null ? null : Number(r.canCreateEvents),
            canManageEvents: r.canManageEvents == null ? null : Number(r.canManageEvents),
            benefits: Array.isArray(r.benefits) ? (r.benefits as unknown[]).map(String) : [],
            limitations: Array.isArray(r.limitations) ? (r.limitations as unknown[]).map(String) : [],
            updatedAt: r.updatedAt ? String(r.updatedAt) : undefined,
        } as PlanDefinition;
    });
}

// Admin (CRUD)
export async function adminListPlans(): Promise<PlanDefinition[]> {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/admin/plans`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudieron cargar los planes (${res.status})`);
    const raw = await safeJson<ApiPlan[]>(res);
    if (!raw || !Array.isArray(raw)) return [];

    return raw.map((p) => {
        let benefits: string[] = [];
        let limitations: string[] = [];
        try { benefits = JSON.parse(p.benefitsJson ?? "[]"); } catch { /* no-op */ }
        try { limitations = JSON.parse(p.limitationsJson ?? "[]"); } catch { /* no-op */ }

        return {
            id: p.id,
            name: p.name,
            priceCents: p.priceCl,
            period: p.period,
            highlight: p.highlight,
            badge: p.badge ?? null,
            description: p.description,
            canCreateEvents: p.canCreateEvents ?? null,
            canManageEvents: p.canManageEvents ?? null,
            benefits,
            limitations,
            updatedAt: p.updatedAt,
        } as PlanDefinition;
    });
}

export type UpsertPlanPayload = Omit<PlanDefinition, "updatedAt">;

export async function adminUpsertPlan(plan: UpsertPlanPayload) {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const id = (plan.id || "").trim().toLowerCase();

    // saber si existe
    const existing = await adminListPlans();
    const exists = existing.some((p) => p.id === id);

    // payload para backend
    const bodyForApi = {
        id,
        name: plan.name,
        priceCl: Number(plan.priceCents ?? 0),
        period: plan.period ?? "/mes",
        highlight: !!plan.highlight,
        badge: plan.badge ?? null,
        description: plan.description ?? "",
        canCreateEvents: plan.canCreateEvents == null ? null : Number(plan.canCreateEvents),
        canManageEvents: plan.canManageEvents == null ? null : Number(plan.canManageEvents),
        benefitsJson: JSON.stringify(plan.benefits ?? []),
        limitationsJson: JSON.stringify(plan.limitations ?? []),
    };

    const url = exists
        ? `${BASE}/api/admin/plans/${encodeURIComponent(id)}`
        : `${BASE}/api/admin/plans`;
    const method = exists ? "PUT" : "POST";

    const res = await fetch(url, { method, headers, body: JSON.stringify(bodyForApi) });
    if (!res.ok) {
        const msg = exists ? "No se pudo actualizar el plan" : "No se pudo crear el plan";
        throw extractErr(await safeJson<ApiErrorShape>(res), res.status, msg);
    }
    return { ok: true };
}

export async function adminDeletePlan(id: string) {
    const headers: HeadersInit = { "Content-Type": "application/json", ...authHeaders() };
    const res = await fetch(`${BASE}/api/admin/plans/${encodeURIComponent(id)}`, { method: "DELETE", headers });
    if (!res.ok) throw extractErr(await safeJson<ApiErrorShape>(res), res.status, "No se pudo eliminar el plan");
    return { ok: true };
}
