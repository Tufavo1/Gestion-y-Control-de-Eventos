"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { EventCard } from "@/components/eventcard";
import { EventFilter } from "@/components/eventfilter";

// Los tipos y fucniones
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
    if (typeof price === "number") {
        return price;
    }
    if (typeof price === "string") {
        const sanitizedPrice = price.replace(/[$. ]/g, "");
        if (sanitizedPrice.toLowerCase() === "entrada liberada") {
            return 0;
        }
        return parseFloat(sanitizedPrice) || 0;
    }
    return 0;
}

export function EventosSection({ baseCards }: { baseCards: Card[] }) {
    const [cards, setCards] = useState<Card[]>(baseCards);

    // Esto sera el estado para los filtros
    const [appliedFilters, setAppliedFilters] = useState({
        query: "",
        region: "",
        comuna: "",
        priceRange: 1000000,
    });

    // Cada tarjeta sera enriquecida solo una vez al inicio
    useEffect(() => {
        let mounted = true;
        fetch("/data/Comunas_de_Chile.geojson")
            .then((r) => r.json())
            .then((geojson: ChileComunasGeoJSON) => {
                if (!mounted) return;
                const features = geojson.features;
                const comunaToRegion = new Map<string, string>();
                for (const f of features) {
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

    // Aplico la logica del filtrado
    const result = useMemo(() => {
        const q = normalize(appliedFilters.query);

        return cards.filter((c) => {
            const hitTexto = q.length
                ? (() => {
                    const pool = [
                        c.title,
                        c.org ?? "",
                        c.region,
                        c.comuna,
                        ...(c.tags ?? []),
                    ]
                        .map((s) => normalize(s))
                        .join(" ");
                    return pool.includes(q);
                })()
                : true;

            const hitRegion = appliedFilters.region ? c.region === appliedFilters.region : true;
            const hitComuna = appliedFilters.comuna ? c.comuna === appliedFilters.comuna : true;
            const hitPrice = parsePrice(c.price) <= appliedFilters.priceRange;

            return hitTexto && hitRegion && hitComuna && hitPrice;
        });
    }, [cards, appliedFilters]);

    return (
        <section id="eventos" className="mx-auto max-w-7xl px-4 py-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-black-900 md:text-3xl">
                Encuentra tu próximo evento
            </h2>
            <p className="mt-2 text-gray-600">
                Tu ciudad está llena de vida. Encuentra lo que te mueve.
            </p>

            {/* Aqui llamo al evento */}
            <EventFilter onFilter={setAppliedFilters} />

            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{result.length}</span>{" "}
                    resultado{result.length === 1 ? "" : "s"}
                </p>
            </div>

            {result.length === 0 ? (
                <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
                    <p>No se encontraron eventos con los criterios de búsqueda.</p>
                </div>
            ) : (
                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {result.map((c) => (
                        <li key={c.id}>
                            <Link href={`/event/${c.id}`} className="block">
                                <EventCard {...c} />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}