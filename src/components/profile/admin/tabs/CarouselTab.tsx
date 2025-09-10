"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Badge, CurrentUser, PLAN_LIMITS, SectionCard } from "../DesignSystem";
import { adminCreateCarouselItem, adminDeleteCarouselItem, adminListCarousel, adminReorderCarousel, adminUpdateCarouselItem, CarouselItem } from "@/lib/events/carousel.api";


export default function CarouselTab({ user }: { user: CurrentUser }) {
    const can = user.role === "admin" || user.role === "superadmin";
    const max = PLAN_LIMITS[user.plan].maxImagesCarousel ?? Infinity;

    const [items, setItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ src: "", title: "", text: "" });
    const [error, setError] = useState<string | null>(null);
    const [savingOrder, setSavingOrder] = useState(false);

    const limitReached = useMemo(
        () => Number.isFinite(max as number) && (max as number) <= items.length,
        [items.length, max]
    );

    useEffect(() => {
        (async () => {
            if (!can) return;
            setLoading(true);
            setError(null);
            try {
                const list = await adminListCarousel();
                list.sort((a, b) => a.order - b.order);
                setItems(list);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "No se pudieron cargar los slides");
            } finally {
                setLoading(false);
            }
        })();
    }, [can]);

    async function createItem() {
        if (!form.src.trim()) return;
        setCreating(true);
        setError(null);
        try {
            const newItem = await adminCreateCarouselItem({
                src: form.src.trim(),
                title: form.title.trim(),
                text: form.text.trim(),
                isPublished: false,
            });
            setItems((prev) => [...prev, newItem].sort((a, b) => a.order - b.order));
            setForm({ src: "", title: "", text: "" });
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo crear el slide");
        } finally {
            setCreating(false);
        }
    }

    async function removeItem(id: number) {
        setError(null);
        try {
            await adminDeleteCarouselItem(id);
            setItems((prev) => prev.filter((x) => x.id !== id));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo eliminar el slide");
        }
    }

    async function togglePublish(it: CarouselItem) {
        setError(null);
        try {
            await adminUpdateCarouselItem(it.id, { isPublished: !it.isPublished });
            setItems((prev) =>
                prev.map((x) => (x.id === it.id ? { ...x, isPublished: !x.isPublished } : x))
            );
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo actualizar publicación");
        }
    }

    // ===== Drag & Drop =====
    const dragIndexRef = useRef<number | null>(null);
    function onDragStart(idx: number) {
        dragIndexRef.current = idx;
    }
    function onDragOver(e: React.DragEvent) {
        e.preventDefault();
    }
    function onDrop(idx: number) {
        const from = dragIndexRef.current;
        dragIndexRef.current = null;
        if (from == null || from === idx) return;
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(idx, 0, moved);
        const renumbered = next.map((x, i) => ({ ...x, order: i + 1 }));
        setItems(renumbered);
    }

    async function persistOrder() {
        setSavingOrder(true);
        setError(null);
        try {
            await adminReorderCarousel(items.map((x) => x.id));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo guardar el nuevo orden");
        } finally {
            setSavingOrder(false);
        }
    }

    return (
        <div className="space-y-4">
            <SectionCard
                title="Carousel de imágenes"
                description="Administra slides."
                locked={!can}
                lockMessage="Solo administradores pueden gestionar el carrusel."
            >
                {!can ? null : (
                    <>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge>Máx imágenes: {Number.isFinite(max) ? max : "Ilimitado"}</Badge>
                            {limitReached && (
                                <span className="text-xs text-orange-600">
                                    Has alcanzado el límite de tu plan.
                                </span>
                            )}
                            {error && <span className="text-xs text-red-600">{error}</span>}
                        </div>

                        {/* Crear nuevo */}
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <input
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="URL de la imagen (src)"
                                value={form.src}
                                onChange={(e) => setForm((f) => ({ ...f, src: e.target.value }))}
                                disabled={limitReached}
                            />
                            <input
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Título"
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                disabled={limitReached}
                            />
                            <div className="flex gap-2">
                                <input
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="Texto"
                                    value={form.text}
                                    onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                                    disabled={limitReached}
                                />
                                <button
                                    type="button"
                                    onClick={createItem}
                                    disabled={creating || limitReached || !form.src.trim()}
                                    className="shrink-0 rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-60"
                                >
                                    {creating ? "Creando..." : "+ Agregar"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </SectionCard>

            <SectionCard title="Slides" locked={!can}>
                {!can ? null : (
                    <>
                        {loading ? (
                            <div className="p-4 text-sm text-gray-500">Cargando…</div>
                        ) : items.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                                Aún no hay slides. Crea el primero arriba.
                            </div>
                        ) : (
                            <>
                                <ul className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {items.map((s, idx) => (
                                        <li
                                            key={s.id}
                                            className="group relative rounded-xl border border-gray-200"
                                            draggable
                                            onDragStart={() => onDragStart(idx)}
                                            onDragOver={onDragOver}
                                            onDrop={() => onDrop(idx)}
                                            title="Arrastra para reordenar"
                                        >
                                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-50">
                                                <Image src={s.src} alt={s.title} fill className="object-cover" />
                                                <div className="absolute left-2 top-2 rounded-md border bg-white/80 px-2 py-1 text-xs text-gray-700">
                                                    #{s.order}
                                                </div>
                                                <button
                                                    className="absolute right-2 top-2 hidden rounded-md border border-gray-300 bg-white/90 px-2 py-1 text-xs text-gray-700 group-hover:block"
                                                    onClick={() => togglePublish(s)}
                                                >
                                                    {s.isPublished ? "Ocultar" : "Publicar"}
                                                </button>
                                            </div>
                                            <div className="p-3">
                                                <p className="truncate text-sm font-medium">{s.title || "Sin título"}</p>
                                                <p className="truncate text-xs text-gray-500">{s.text || "—"}</p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs ${s.isPublished
                                                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                                            : "bg-gray-50 text-gray-700 ring-1 ring-gray-200"
                                                            }`}
                                                    >
                                                        {s.isPublished ? "Publicado" : "Borrador"}
                                                    </span>
                                                    <button
                                                        onClick={() => removeItem(s.id)}
                                                        className="rounded-md border border-red-600 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 flex items-center justify-end gap-3">
                                    <button
                                        onClick={persistOrder}
                                        disabled={savingOrder}
                                        className="rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
                                    >
                                        {savingOrder ? "Guardando orden…" : "Guardar orden"}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </SectionCard>
        </div>
    );
}
