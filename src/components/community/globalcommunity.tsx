"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const MAX_PHOTOS = 5;
const MAX_TESTIMONIALS = 5;

export type PhotoItem = {
    id: string | number;
    src: string;
    alt?: string;
    caption?: string;
    user?: string; // 👈 nombre del usuario que subió la foto
};
export type Testimonial = {
    id: string | number;
    name: string;
    avatar?: string;
    rating?: number;
    location?: string;
    text: string;
};

export type EventLite = { id: number | string; title: string; cover?: string };

export type EventMedia = {
    photos?: PhotoItem[];
    testimonials?: Testimonial[];
};

type Props = {
    eventos: EventLite[];
    mediaByEvent: Record<string | number, EventMedia>;
    initialEventId?: string | number;
    rotateSeconds?: number;
    className?: string;
};

function StarRow({ rating = 5 }: { rating?: number }) {
    const r = Math.round(rating);
    return (
        <div className="flex items-center gap-0.5" aria-label={`Valoración ${r} de 5`}>
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`h-4 w-4 ${i < r ? "text-orange-500" : "text-gray-300"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 0 0 .95-.69l1.07-3.292Z" />
                </svg>
            ))}
        </div>
    );
}

export default function RotatingCommunity({
    eventos,
    mediaByEvent,
    initialEventId,
    rotateSeconds = 15,
    className = "",
}: Props) {
    type TabKey = "fotos" | "opiniones";
    const [tab, setTab] = useState<TabKey>("fotos");
    // ref tipado correctamente para evitar any
    const sectionRef = useRef<HTMLDivElement | null>(null);

    // ===== Eventos con contenido =====
    const playableEvents = useMemo(() => {
        return eventos.filter((e) => {
            const m = mediaByEvent[e.id] || {};
            const has = (m.photos?.length || 0) + (m.testimonials?.length || 0);
            return has > 0;
        });
    }, [eventos, mediaByEvent]);

    // Índice actual
    const initialIndex = Math.max(
        0,
        playableEvents.findIndex((e) => String(e.id) === String(initialEventId ?? eventos[0]?.id))
    );
    const [idx, setIdx] = useState<number>(initialIndex);

    useEffect(() => {
        if (idx >= playableEvents.length) setIdx(0);
    }, [idx, playableEvents.length]);

    const current = playableEvents[idx];

    // Media del evento actual (con límites)
    const currentMedia = useMemo(() => {
        const raw = current ? mediaByEvent[current.id] ?? {} : {};
        const photos = (raw.photos ?? []).slice(0, MAX_PHOTOS);
        const testimonials = (raw.testimonials ?? []).slice(0, MAX_TESTIMONIALS);
        return { photos, testimonials };
    }, [current, mediaByEvent]);

    // ===== Rotación automática =====
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const next = useCallback(() => {
        setIdx((i) => (i + 1) % Math.max(1, playableEvents.length));
    }, [playableEvents.length]);

    const prev = useCallback(() => {
        setIdx((i) => (i - 1 + Math.max(1, playableEvents.length)) % Math.max(1, playableEvents.length));
    }, [playableEvents.length]);

    useEffect(() => {
        if (!playableEvents.length) return;
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(next, rotateSeconds * 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [next, rotateSeconds, playableEvents.length]);

    // Contadores por pestaña
    const counters = useMemo(
        () => ({
            fotos: currentMedia.photos?.length ?? 0,
            opiniones: currentMedia.testimonials?.length ?? 0,
        }),
        [currentMedia.photos, currentMedia.testimonials]
    );

    const TabButton = ({ k, label, iconPath }: { k: TabKey; label: string; iconPath: string }) => (
        <button
            onClick={() => setTab(k)}
            className={[
                "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                "ring-1 ring-inset",
                tab === k
                    ? "bg-orange-600 text-white ring-orange-600 shadow-sm"
                    : "bg-white/60 backdrop-blur ring-gray-300 text-gray-700 hover:bg-white",
            ].join(" ")}
            aria-pressed={tab === k}
            aria-controls={`panel-${k}`}
        >
            <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d={iconPath} />
            </svg>
            <span>{label}</span>
            <span
                className={[
                    "inline-flex min-w-6 justify-center rounded-full px-2 text-xs",
                    tab === k ? "bg-white/20" : "bg-gray-100 text-gray-700",
                ].join(" ")}
            >
                {counters[k]}
            </span>
        </button>
    );

    const ProgressBar = () => (
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-black/10">
            <div
                key={idx + "-" + tab}
                className="h-full origin-left bg-orange-600"
                style={{
                    animation: `fill ${rotateSeconds}s linear forwards`,
                }}
            />
            <style>{`
        @keyframes fill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
      `}</style>
        </div>
    );

    if (!playableEvents.length) {
        return (
            <section className={`py-16 ${className}`}>
                <div className="relative">
                    <DecorativeBg />
                    <div className="relative mx-auto max-w-7xl px-4">
                        <EmptyState />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            tabIndex={0}
            aria-label="Comunidad del evento"
            className={`py-16 outline-none ${className}`}
        >
            <div className="relative">
                <DecorativeBg />

                <div className="relative mx-auto max-w-7xl px-4">
                    {/* Header */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                            <h3 className="text-center sm:text-left text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                                Comunidad del evento:{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                                    {current.title}
                                </span>
                            </h3>
                            <p className="mt-2 text-center sm:text-left text-gray-600">
                                Fotos y opiniones reales relacionadas a este evento.
                            </p>
                        </div>

                        {/* Navegación */}
                        <div className="flex items-center justify-center sm:justify-end gap-2">
                            <button
                                onClick={prev}
                                className="rounded-full border border-gray-200 bg-white/80 backdrop-blur px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:border-gray-300 hover:shadow transition"
                            >
                                ← Anterior
                            </button>
                            <button
                                onClick={next}
                                className="rounded-full bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition"
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
                        <TabButton
                            k="fotos"
                            label="Fotos"
                            iconPath="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm4 2 2 3 2-3 3 4 1-1 2 3H6l2-6z"
                        />
                        <TabButton
                            k="opiniones"
                            label="Opiniones"
                            iconPath="M4 5h16v10H7l-3 3V5zm4 3h8v2H8V8zm0 4h6v2H8v-2z"
                        />
                    </div>

                    {/* Progress auto-rotación */}
                    <div className="mb-6">
                        <ProgressBar />
                    </div>

                    {/* Contenido */}
                    {tab === "fotos" ? (
                        <div
                            id="panel-fotos"
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {(currentMedia.photos ?? []).map((p) => (
                                <article
                                    key={p.id}
                                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm transition hover:shadow-lg hover:-translate-y-[2px]"
                                >
                                    <div className="relative">
                                        <Image
                                            src={p.src}
                                            alt={p.alt ?? "Foto de evento"}
                                            width={800}
                                            height={450}
                                            className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition" />
                                    </div>
                                    <div className="px-3 py-2">
                                        {p.caption && (
                                            <p className="text-sm font-medium text-gray-800" title={p.caption}>
                                                {p.caption}
                                            </p>
                                        )}
                                        {p.user && (
                                            <p className="text-xs text-gray-500">Subido por: {p.user}</p>
                                        )}
                                    </div>
                                </article>
                            ))}

                            {(currentMedia.photos?.length ?? 0) === 0 && <NoItems msg="Este evento aún no tiene fotos." />}
                        </div>
                    ) : (
                        <div
                            id="panel-opiniones"
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {(currentMedia.testimonials ?? []).map((t) => (
                                <article
                                    key={t.id}
                                    className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm transition hover:shadow-md hover:-translate-y-[2px]"
                                >
                                    <div className="mb-4 flex items-center gap-3">
                                        <Image
                                            src={t.avatar ?? "/img/icono.png"}
                                            alt={t.name}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                        />
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                                            {t.location && <div className="text-xs text-gray-500">{t.location}</div>}
                                        </div>
                                    </div>
                                    <StarRow rating={t.rating ?? 5} />
                                    <p className="mt-3 text-sm text-gray-700">{t.text}</p>
                                </article>
                            ))}

                            {(currentMedia.testimonials?.length ?? 0) === 0 && (
                                <NoItems msg="Este evento aún no tiene opiniones." />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function DecorativeBg() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)]"
            style={{
                background:
                    "radial-gradient(1200px 400px at 50% -10%, rgba(253,186,116,.25), transparent), linear-gradient(180deg, #fff 0%, #fff8f0 60%, #ffffff 100%)",
            }}
        />
    );
}

function EmptyState() {
    return (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 backdrop-blur p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Sin contenido aún</h3>
            <p className="mt-2 text-gray-600">
                Cuando haya fotos u opiniones relacionadas a eventos, aparecerán aquí.
            </p>
        </div>
    );
}

function NoItems({ msg }: { msg: string }) {
    return (
        <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white/70 backdrop-blur p-10 text-center">
            <p className="text-gray-600">{msg}</p>
        </div>
    );
}


