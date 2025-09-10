// src/lib/http/fetcher.ts
const BASE = process.env.NEXT_PUBLIC_API_URL!;
if (!BASE) console.warn("WARN: NEXT_PUBLIC_API_URL no está definido.");

export type ApiErrorShape = { title?: string; message?: string };

async function safeJson<T = unknown>(res: Response): Promise<T | null> {
    try { return (await res.json()) as T; } catch { return null; }
}

function extractErr(msg: ApiErrorShape | null, status: number, fallback: string) {
    return new Error(msg?.message ?? msg?.title ?? `${fallback} (${status})`);
}

export type RequestOpts = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: HeadersInit;
    body?: unknown;
    authHeaders?: Record<string, string>; // inyectado desde session
    fallbackError?: string;              // mensaje amigable
    cache?: RequestCache;
};

export async function apiFetch<T = unknown>(
    path: string,
    { method = "GET", headers, body, authHeaders, fallbackError = "Error de solicitud", cache = "no-store" }: RequestOpts = {}
): Promise<T> {
    const h: HeadersInit = { "Content-Type": "application/json", ...(headers ?? {}), ...(authHeaders ?? {}) };
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: h,
        body: body == null ? undefined : JSON.stringify(body),
        cache
    });

    if (!res.ok) {
        throw extractErr(await safeJson<ApiErrorShape>(res), res.status, fallbackError);
    }
    const data = await safeJson<T>(res);
    // Si no hay cuerpo, devuelve {} as any para evitar null checks
    return (data ?? ({} as T));
}
