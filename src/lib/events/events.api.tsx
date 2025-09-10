import { apiFetch } from "../http/fetcher";
import { authHeaders } from "../session/session";

export async function registerToEvent(eventId: number) {
    await apiFetch(`/api/events/${eventId}/register`, {
        method: "POST",
        authHeaders: authHeaders(),
        fallbackError: "Error al registrarse en evento",
    });
    return { ok: true };
}

export async function createEvent(payload: {
    title: string;
    startsAt: string;
    endsAt: string;
    capacity: number;
    venueId: number;
}) {
    await apiFetch("/api/events", {
        method: "POST",
        authHeaders: authHeaders(),
        body: payload,
        fallbackError: "Error creando evento",
    });
    return { ok: true };
}
