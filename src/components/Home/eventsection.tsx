"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { EventCard } from "@/components/UI/eventcard";
import { EventFilter } from "@/components/Home/eventfilter";
import TipoEvento from "@/components/Home/typeevent";
import Image from "next/image";

// Los tipos y funciones
export type Card = {
    id: number | string;
    title: string;
    region: string;
    comuna: string;
    start: string;
    end?: string;
    price?: string | number;
    img?: string;
    org?: string;
    tags?: string[];
    tipo?: "deporte" | "fiesta" | "concierto" | "teatro" | "feria" | "otro";
    desc?: string;
};

type GeoFeature = {
    type: "Feature";
    properties: {
        NOM_REGION: string;
        NOM_COMUNA: string;
    };
};

type ChileComunasGeoJSON = {
    type: "FeatureCollection";
    features: GeoFeature[];
};

function normalize(str: string) {
    return String(str)
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

function parsePrice(price: string | number | undefined): number {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
        const sanitized = price.replace(/[$. ]/g, "");
        if (sanitized.toLowerCase().includes("entrada liberada") || sanitized.toLowerCase().includes("gratis")) {
            return 0;
        }
        if (sanitized.toLowerCase().includes("invit")) return -1;
        return parseFloat(sanitized) || 0;
    }
    return 0;
}

// UI: chips y colores por tipo
const tipoChips: Array<{
    key: NonNullable<Card["tipo"]>;
    label: string;
    chipClass: string;
    ring: string;
}> = [
        { key: "fiesta", label: "Fiesta", chipClass: "bg-pink-50 text-pink-700 hover:bg-pink-100", ring: "focus:ring-pink-500" },
        { key: "deporte", label: "Deporte", chipClass: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", ring: "focus:ring-emerald-500" },
        { key: "concierto", label: "Concierto", chipClass: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100", ring: "focus:ring-indigo-500" },
        { key: "teatro", label: "Teatro", chipClass: "bg-amber-50 text-amber-700 hover:bg-amber-100", ring: "focus:ring-amber-500" },
        { key: "feria", label: "Feria", chipClass: "bg-sky-50 text-sky-700 hover:bg-sky-100", ring: "focus:ring-sky-500" },
        { key: "otro", label: "Otro", chipClass: "bg-gray-100 text-gray-700 hover:bg-gray-200", ring: "focus:ring-gray-500" },
    ];

function auraClass(tipo?: Card["tipo"]) {
    switch (tipo) {
        case "fiesta":
            return "from-pink-400/30 via-white to-pink-400/30";
        case "deporte":
            return "from-emerald-400/30 via-white to-emerald-400/30";
        case "concierto":
            return "from-indigo-400/30 via-white to-indigo-400/30";
        case "teatro":
            return "from-amber-400/30 via-white to-amber-400/30";
        case "feria":
            return "from-sky-400/30 via-white to-sky-400/30";
        default:
            return "from-gray-400/30 via-white to-gray-400/30";
    }
}

function borderClass(tipo?: Card["tipo"]) {
    switch (tipo) {
        case "fiesta":
            return "border-pink-100";
        case "deporte":
            return "border-emerald-100";
        case "concierto":
            return "border-indigo-100";
        case "teatro":
            return "border-amber-100";
        case "feria":
            return "border-sky-100";
        default:
            return "border-gray-100";
    }
}

export function EventosSection({ baseCards }: { baseCards: Card[] }) {
    const [cards, setCards] = useState<Card[]>(baseCards);

    // Aplicar los filtros que existen
    const [appliedFilters, setAppliedFilters] = useState({
        query: "",
        region: "",
        comuna: "",
        priceRange: 1000000,
    });

    // Este filtro es por el tipo
    const [selectedTipo, setSelectedTipo] = useState<Card["tipo"] | "todos">("todos");

    const PAGE_SIZE = 12;
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [appliedFilters, selectedTipo]);

    // Esto es para normalizar y enriquecer la region y comuna
    useEffect(() => {
        let mounted = true;
        fetch("/data/Comunas_de_Chile.geojson")
            .then((r) => r.json())
            .then((geojson: ChileComunasGeoJSON) => {
                if (!mounted) return;
                const comunaToRegion = new Map<string, string>();
                for (const f of geojson.features) {
                    const cNorm = normalize(f.properties.NOM_COMUNA);
                    if (!comunaToRegion.has(cNorm)) {
                        comunaToRegion.set(cNorm, f.properties.NOM_REGION);
                    }
                }
                const enriched = baseCards.map((c) => {
                    const regFromGeo = comunaToRegion.get(normalize(c.comuna));
                    return { ...c, region: regFromGeo ?? c.region };
                });
                setCards(enriched);
            })
            .catch(console.error);
        return () => {
            mounted = false;
        };
    }, [baseCards]);

    // Este filtro es para el combinado completo 
    const result = useMemo(() => {
        const q = normalize(appliedFilters.query);

        return cards.filter((c) => {
            const hitTexto = q.length
                ? (() => {
                    const pool = [c.title, c.org ?? "", c.region, c.comuna, ...(c.tags ?? [])]
                        .map((s) => normalize(s))
                        .join(" ");
                    return pool.includes(q);
                })()
                : true;

            const hitRegion = appliedFilters.region ? c.region === appliedFilters.region : true;
            const hitComuna = appliedFilters.comuna ? c.comuna === appliedFilters.comuna : true;
            const hitPrice = parsePrice(c.price) <= appliedFilters.priceRange;

            const hitTipo = selectedTipo === "todos" ? true : (c.tipo ?? "otro") === selectedTipo;

            return hitTexto && hitRegion && hitComuna && hitPrice && hitTipo;
        });
    }, [cards, appliedFilters, selectedTipo]);

    const totalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
    const paginated = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function goto(p: number) {
        const next = Math.min(Math.max(1, p), totalPages);
        setPage(next);
        const el = document.getElementById("eventos");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function buildPageList(current: number, total: number) {
        const pages: (number | string)[] = [];
        const window = 1;
        const add = (x: number | string) => pages.push(x);
        const showLeftEllipsis = current - window > 2;
        const showRightEllipsis = current + window < total - 1;

        add(1);
        if (showLeftEllipsis) add("…");
        for (
            let p = Math.max(2, current - window);
            p <= Math.min(total - 1, current + window);
            p++
        )
            add(p);
        if (showRightEllipsis) add("…");
        if (total > 1) add(total);

        return pages;
    }

    // Const para mostrar el banner
    const filtersActive = useMemo(() => {
        return (
            appliedFilters.query !== "" ||
            appliedFilters.region !== "" ||
            appliedFilters.comuna !== "" ||
            appliedFilters.priceRange < 1000000 ||
            selectedTipo !== "todos"
        );
    }, [appliedFilters, selectedTipo]);

    const [bannerOpen, setBannerOpen] = useState(false);

    useEffect(() => {
        if (!filtersActive) return;
        setBannerOpen(true);
        const t = setTimeout(() => setBannerOpen(false), 10000);
        return () => clearTimeout(t);
    }, [filtersActive]);



    return (
        <section id="eventos" className="mx-auto max-w-7xl px-4 py-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-black-900 md:text-3xl">
                Encuentra tu próximo evento
            </h2>
            <p className="mt-2 text-gray-600">
                Tu ciudad está llena de vida. Encuentra lo que te mueve.
            </p>

            {/* Filtros existentes */}
            <EventFilter onFilter={setAppliedFilters} />

            {/* Tipos de filtros*/}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button type="button" onClick={() => setSelectedTipo("todos")} className={`rounded-full px-3 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 ${selectedTipo === "todos"
                    ? "bg-orange-500 text-white focus:ring-orange-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400"
                    }`}
                >
                    Todos
                </button>
                {tipoChips.map(({ key, label, chipClass, ring }) => (
                    <button key={key} type="button" onClick={() => setSelectedTipo(key)} className={[
                        "rounded-full px-3 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2",
                        chipClass,
                        ring,
                        selectedTipo === key ? "ring-2 ring-offset-0" : "",
                    ].join(" ")}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Banner para mostrar resultados del filtro de busqueda*/}
            <div className={[
                "fixed left-1/2 top-0 z-[60] -translate-x-1/2",
                "transition-all duration-500 ease-out",
                bannerOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
            ].join(" ")} role="status" aria-live="polite">
                <div className="mx-auto mt-3 inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-orange-500 px-2 text-sm font-bold text-white" aria-label="Cantidad de resultados">
                        {result.length}
                    </span>
                    <p className="text-sm font-medium text-gray-800">
                        resultado{result.length === 1 ? "" : "s"} con tu filtro
                    </p>
                </div>
            </div>


            {/* Empty state */}
            {result.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-200 p-10 text-center shadow-md">
                    <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-orange-500 transition-transform duration-500 hover:scale-105">
                        <Image src="/img/icono.png" alt="Logo de CuponME" width={70} height={70} className="h-20 w-20 object-contain transition-transform duration-500 hover:rotate-6 hover:scale-110" />
                    </div>
                    <h3 className="text-xl font-bold text-black tracking-tight">
                        Sin resultados
                    </h3>
                    <p className="mt-2 text-lg text-gray-700">
                        Ajusta filtros o prueba con otras palabras clave.
                    </p>
                </div>
            ) : (
                <>
                    {/* Grid de tarjetas */}
                    <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {paginated.map((c) => (
                            <li key={c.id} className="group relative">
                                <Link href={`/event/${c.id}`} className={[
                                    "relative block rounded-3xl border bg-white shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 overflow-hidden",
                                    borderClass(c.tipo),
                                ].join(" ")}
                                >
                                    {/* pequennia aura para el tipo */}
                                    <div className={[
                                        "pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30",
                                        "bg-gradient-to-tr",
                                        auraClass(c.tipo),
                                    ].join(" ")}
                                    />

                                    {/* Contenido real */}
                                    <div className="relative z-10">
                                        <EventCard {...c} />
                                    </div>

                                    {/* Footer card */}
                                    <div className="relative z-10 flex items-center justify-between border-t border-gray-100 bg-gradient-to-r from-gray-50/70 to-gray-100/70 px-4 py-3 backdrop-blur-sm">
                                        <span className="text-xs font-medium text-gray-500">
                                            Ver detalles
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-black-800 transition-colors duration-300 group-hover:text-orange-500">
                                            Explorar
                                            <svg width="15" height="15" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:translate-x-1">
                                                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12h12m0 0l-4-4m4 4l-4 4" />
                                            </svg>
                                        </span>
                                    </div>

                                    {/* Badge por tipo */}
                                    <TipoEvento tipo={c.tipo} />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Controles de paginación */}
                    {result.length > PAGE_SIZE && (
                        <div className="mt-10 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button onClick={() => goto(page - 1)} disabled={page === 1} className={`rounded-full px-4 py-2 text-sm font-medium border transition ${page === 1
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-gray-100"
                                    }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                    </svg>
                                </button>

                                <nav className="flex items-center gap-1" aria-label="Paginación">
                                    {buildPageList(page, totalPages).map((p, idx) =>
                                        typeof p === "number" ? (
                                            <button key={idx} onClick={() => goto(p)} aria-current={p === page ? "page" : undefined} className={[
                                                "min-w-10 rounded-full px-3 py-2 text-sm font-semibold border transition",
                                                p === page
                                                    ? "bg-orange-500 text-white border-black"
                                                    : "bg-white hover:bg-gray-100",
                                            ].join(" ")}
                                            >
                                                {p}
                                            </button>
                                        ) : (
                                            <span key={idx} className="px-2 text-gray-400 select-none">
                                                …
                                            </span>
                                        )
                                    )}
                                </nav>

                                <button
                                    onClick={() => goto(page + 1)}
                                    disabled={page === totalPages}
                                    className={`rounded-full px-4 py-2 text-sm font-medium border transition ${page === totalPages
                                        ? "cursor-not-allowed opacity-50"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </button>
                            </div>

                            <p className="text-sm text-gray-500">
                                Mostrando{" "}
                                <span className="font-semibold">
                                    {(page - 1) * PAGE_SIZE + 1}
                                </span>
                                –
                                <span className="font-semibold">
                                    {Math.min(page * PAGE_SIZE, result.length)}
                                </span>{" "}
                                de <span className="font-semibold">{result.length}</span> eventos
                            </p>
                        </div>
                    )}
                </>
            )
            }
        </section >
    );
}
