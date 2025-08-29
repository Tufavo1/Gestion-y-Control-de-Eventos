// src/components/Home/eventoscards.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { EventCard } from "@/components/UI/eventcard";
import TipoEvento from "@/components/Home/typeevent";
import type { Card } from "@/components/Home/eventsection";

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

export function EventosCards({ cards }: { cards: Card[] }) {
    if (!cards?.length) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-10 text-center">
                <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-200 p-10 text-center shadow-md">
                    <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-orange-500 transition-transform duration-500 hover:scale-105">
                        <Image src="/img/icono.png" alt="Logo de CuponME" width={70} height={70} className="h-20 w-20 object-contain transition-transform duration-500 hover:rotate-6 hover:scale-110" />
                    </div>
                    <h3 className="text-xl font-bold text-black tracking-tight">No hay eventos disponibles</h3>
                    <p className="mt-2 text-lg text-gray-700">Pronto agregaremos eventos unicos.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-10">
            {/* Titulo */}
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-pink-500 to-black bg-clip-text text-transparent">
                    Mira los próximos eventos
                </h2>
                <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
                    Descubre experiencias únicas cerca de ti y vive momentos inolvidables.
                </p>
                <div className="mt-5 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-black"></div>
            </div>

            {/* Grid de Cards */}
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cards.map((c) => (
                    <li key={c.id} className="group relative">
                        <Link href={`/event/${c.id}`} className={[
                            "relative block rounded-3xl border bg-white shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 overflow-hidden",
                            borderClass(c.tipo),
                        ].join(" ")}
                        >
                            {/* Aura por tipo */}
                            <div className={[
                                "pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30",
                                "bg-gradient-to-tr",
                                auraClass(c.tipo),
                            ].join(" ")}
                            />
                            <div className="relative z-10">
                                <EventCard {...c} />
                            </div>
                            <div className="relative z-10 flex items-center justify-between border-t border-gray-100 bg-gradient-to-r from-gray-50/70 to-gray-100/70 px-4 py-3 backdrop-blur-sm">
                                <span className="text-xs font-medium text-gray-500">Ver detalles</span>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-black-800 transition-colors duration-300 group-hover:text-orange-500">
                                    Explorar
                                    <svg width="15" height="15" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:translate-x-1">
                                        <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12h12m0 0l-4-4m4 4l-4 4" />
                                    </svg>
                                </span>
                            </div>
                            <TipoEvento tipo={c.tipo} />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default EventosCards;
