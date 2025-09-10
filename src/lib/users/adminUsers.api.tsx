import { apiFetch } from "../http/fetcher";
import type { AdminUser } from "../types/user";
import type { RoleId, PlanId } from "../types/ids";
import { authHeaders } from "../session/session";

export async function adminListUsers(): Promise<AdminUser[]> {
    return apiFetch<AdminUser[]>("/api/admin/users", {
        authHeaders: authHeaders(),
        fallbackError: "No se pudo listar usuarios"
    });
}

export async function adminSetUserRole(id: number, role: RoleId) {
    return apiFetch(`/api/admin/users/${id}/role`, {
        method: "PUT",
        authHeaders: authHeaders(),
        body: { role },
        fallbackError: "No se pudo cambiar el rol"
    });
}

export async function adminSetUserPlan(id: number, plan: PlanId) {
    return apiFetch(`/api/admin/users/${id}/plan`, {
        method: "PUT",
        authHeaders: authHeaders(),
        body: { plan },
        fallbackError: "No se pudo cambiar el plan"
    });
}

export async function adminDeleteUser(id: number) {
    return apiFetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        authHeaders: authHeaders(),
        fallbackError: "No se pudo eliminar el usuario"
    });
}
