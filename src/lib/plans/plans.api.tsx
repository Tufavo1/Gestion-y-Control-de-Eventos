import { apiFetch } from "../http/fetcher";
import type { ApiPlan, PlanDefinition, UpsertPlanPayload } from "../types/plans";
import { authHeaders } from "../session/session";

/** Estructura esperada desde la API pública (valores como unknown para evitar any) */
type PublicPlan = {
    id?: unknown;
    name?: unknown;
    price?: unknown;             // NOTA: API pública usa "price"
    period?: unknown;
    highlight?: unknown;
    badge?: unknown;
    description?: unknown;
    canCreateEvents?: unknown;
    canManageEvents?: unknown;
    benefits?: unknown;
    limitations?: unknown;
    updatedAt?: unknown;
};

export async function listPlans(): Promise<PlanDefinition[]> {
    const body = await apiFetch<unknown[]>("/api/plans", {
        cache: "no-store",
        fallbackError: "No se pudieron cargar los planes",
    });

    if (!Array.isArray(body)) return [];

    return body.map((r) => {
        const p = r as PublicPlan;
        return {
            id: String(p.id ?? ""),
            name: String(p.name ?? ""),
            priceCents: Number(p.price ?? 0),
            period: String(p.period ?? "/mes"),
            highlight: Boolean(p.highlight),
            badge: p.badge == null ? null : String(p.badge),
            description: String(p.description ?? ""),
            canCreateEvents: p.canCreateEvents == null ? null : Number(p.canCreateEvents),
            canManageEvents: p.canManageEvents == null ? null : Number(p.canManageEvents),
            benefits: Array.isArray(p.benefits) ? (p.benefits as unknown[]).map(String) : [],
            limitations: Array.isArray(p.limitations) ? (p.limitations as unknown[]).map(String) : [],
            updatedAt: p.updatedAt == null ? undefined : String(p.updatedAt),
        } as PlanDefinition;
    });
}

export async function adminListPlans(): Promise<PlanDefinition[]> {
    const raw = await apiFetch<ApiPlan[]>("/api/admin/plans", {
        authHeaders: authHeaders(),
        cache: "no-store",
        fallbackError: "No se pudieron cargar los planes",
    });

    if (!raw || !Array.isArray(raw)) return [];

    return raw.map((p) => {
        let benefits: string[] = [];
        let limitations: string[] = [];
        try { benefits = JSON.parse(p.benefitsJson ?? "[]") as string[]; } catch { /* noop */ }
        try { limitations = JSON.parse(p.limitationsJson ?? "[]") as string[]; } catch { /* noop */ }

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


export async function adminUpsertPlan(plan: UpsertPlanPayload) {
    const id = (plan.id || "").trim().toLowerCase();
    // podrías optimizar consultando una ruta HEAD/exists si la hubiera; por ahora reusamos listado
    const existing = await adminListPlans();
    const exists = existing.some((p) => p.id === id);

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

    const path = exists ? `/api/admin/plans/${encodeURIComponent(id)}` : "/api/admin/plans";
    await apiFetch(path, {
        method: exists ? "PUT" : "POST",
        authHeaders: authHeaders(),
        body: bodyForApi,
        fallbackError: exists ? "No se pudo actualizar el plan" : "No se pudo crear el plan",
    });
    return { ok: true };
}

export async function adminDeletePlan(id: string) {
    await apiFetch(`/api/admin/plans/${encodeURIComponent(id)}`, {
        method: "DELETE",
        authHeaders: authHeaders(),
        fallbackError: "No se pudo eliminar el plan",
    });
    return { ok: true };
}
