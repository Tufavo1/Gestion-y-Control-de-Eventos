// lib/events/carousel.api.tsx
import { apiFetch } from "../http/fetcher";
import { authHeaders } from "../session/session";

// ===== Tipos =====
export type CarouselItem = {
    id: number;               // ID DB
    order: number;            // orden ascendente
    src: string;              // URL pública
    title: string;
    text: string;
    isPublished: boolean;     // visible en home
    createdAt?: string;
    updatedAt?: string;
};

export type UpsertCarouselItemPayload = {
    src: string;              // puede venir de un upload previo
    title: string;
    text: string;
    isPublished?: boolean;
    order?: number | null;
};

// ===== Endpoints =====
// GET /api/admin/carousel
export async function adminListCarousel(): Promise<CarouselItem[]> {
    return apiFetch<CarouselItem[]>("/api/admin/carousel", {
        authHeaders: authHeaders(),
        fallbackError: "No se pudo cargar el carrusel",
    });
}

// POST /api/admin/carousel
export async function adminCreateCarouselItem(payload: UpsertCarouselItemPayload) {
    return apiFetch<CarouselItem>("/api/admin/carousel", {
        method: "POST",
        authHeaders: authHeaders(),
        body: payload,
        fallbackError: "No se pudo crear el slide",
    });
}

// PUT /api/admin/carousel/:id
export async function adminUpdateCarouselItem(id: number, payload: Partial<UpsertCarouselItemPayload>) {
    return apiFetch(`/api/admin/carousel/${id}`, {
        method: "PUT",
        authHeaders: authHeaders(),
        body: payload,
        fallbackError: "No se pudo actualizar el slide",
    });
}

// DELETE /api/admin/carousel/:id
export async function adminDeleteCarouselItem(id: number) {
    return apiFetch(`/api/admin/carousel/${id}`, {
        method: "DELETE",
        authHeaders: authHeaders(),
        fallbackError: "No se pudo eliminar el slide",
    });
}

// PUT /api/admin/carousel/reorder
// body: { idsInOrder: number[] }
export async function adminReorderCarousel(idsInOrder: number[]) {
    return apiFetch("/api/admin/carousel/reorder", {
        method: "PUT",
        authHeaders: authHeaders(),
        body: { idsInOrder },
        fallbackError: "No se pudo reordenar el carrusel",
    });
}

// Público: GET /api/carousel (solo publicados y ordenados)
export type PublicSlide = { src: string; title: string; text: string };
export async function listPublicCarousel(): Promise<PublicSlide[]> {
    // Nota: este no requiere auth
    return apiFetch<PublicSlide[]>("/api/carousel", {
        fallbackError: "No se pudo cargar el carrusel público",
    });
}
