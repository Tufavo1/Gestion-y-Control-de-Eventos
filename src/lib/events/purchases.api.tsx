import { apiFetch } from "../http/fetcher";
import { authHeaders } from "../session/session";
import type { Purchase, AttendedEvent } from "../types/events";
import { isObject, asId, asString, asNumber } from "../utils/parsing";

export async function getPurchaseHistory(): Promise<Purchase[]> {
    const raw = await apiFetch<unknown[]>("/api/users/me/purchases", {
        authHeaders: authHeaders(), cache: "no-store"
    }).catch(() => []);

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
    const raw = await apiFetch<unknown[]>("/api/users/me/attended", {
        authHeaders: authHeaders(), cache: "no-store"
    }).catch(() => []);
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
