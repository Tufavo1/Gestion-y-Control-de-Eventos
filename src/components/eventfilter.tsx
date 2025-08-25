// src/components/EventFilter.tsx

"use client";

import { useEffect, useState } from "react";

// Esto lo usaremos para obtener la informacion del Geotipo
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

// Este se encargara de limpiar y normalizar los strings
function normalize(str: string) {
    return String(str)
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

// Defino una funcion para aplicar a los filtros
type EventFilterProps = {
    onFilter: (filters: {
        query: string;
        region: string;
        comuna: string;
        priceRange: number;
    }) => void;
};

export function EventFilter({ onFilter }: EventFilterProps) {
    // Cada constante es el estado de los inputs
    const [query, setQuery] = useState("");
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [priceRange, setPriceRange] = useState(1000000);

    const [regiones, setRegiones] = useState<string[]>([]);
    const [comunas, setComunas] = useState<string[]>([]);

    // cargamos toda la información de GeoJSON
    useEffect(() => {
        let mounted = true;

        fetch("/data/Comunas_de_Chile.geojson")
            .then((r) => r.json())
            .then((geojson: ChileComunasGeoJSON) => {
                if (!mounted) return;
                const features = geojson.features;
                const regionesUnicas = Array.from(
                    new Set(features.map((f) => f.properties.NOM_REGION)),
                ).sort((a, b) => a.localeCompare(b));
                setRegiones(regionesUnicas);
            })
            .catch(console.error);

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!region) {
            setComunas([]);
            setComuna("");
            return;
        }
        let mounted = true;
        fetch("/data/Comunas_de_Chile.geojson")
            .then((r) => r.json())
            .then((geojson: ChileComunasGeoJSON) => {
                if (!mounted) return;
                const features = geojson.features;
                const comunasRegion = Array.from(
                    new Set(
                        features
                            .filter((f) => f.properties.NOM_REGION === region)
                            .map((f) => f.properties.NOM_COMUNA),
                    ),
                ).sort((a, b) => a.localeCompare(b));

                setComunas(comunasRegion);
                if (comuna && !comunasRegion.includes(comuna)) {
                    setComuna("");
                }
            })
            .catch(console.error);
        return () => {
            mounted = false;
        };
    }, [region, comuna]);

    // Esta se encargara de aplicar los filtros y se lo enviara al componente padre
    const handleApplyFilters = () => {
        onFilter({ query, region, comuna, priceRange });
    };

    // Esta constante se encargara de resetear los filtros
    const resetFilters = () => {
        setQuery("");
        setRegion("");
        setComuna("");
        setPriceRange(1000000);
        // Esta llama a la función onFilter para enviar los filtros reseteados al padre
        onFilter({ query: "", region: "", comuna: "", priceRange: 1000000 });
    };

    return (
        <div className="mt-8 rounded-2xl bg-gray-100 p-6 shadow-xl ring-1 ring-gray-900/5">
            <div className="flex flex-col gap-6 md:flex-row md:items-end">
                {/* Este e el campo de busqueda */}
                <div className="relative flex-1">
                    <label htmlFor="search" className="sr-only">
                        Buscar evento
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <input
                        id="search"
                        type="text"
                        placeholder="Qué evento o lugar buscas hoy..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-800 outline-none transition duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                </div>

                <button className="flex items-center justify-center rounded-full border border-gray-300 py-2.5 px-6 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-100 md:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-4.586L3.293 6.707A1 1 0 013 6V3z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Más filtros
                </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Filtro de Region */}
                <div>
                    <label
                        htmlFor="region"
                        className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-orange-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Región
                    </label>
                    <select
                        id="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    >
                        <option value="">Todas</option>
                        {regiones.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro de Comuna */}
                <div>
                    <label
                        htmlFor="comuna"
                        className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-orange-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        Comuna
                    </label>
                    <select
                        id="comuna"
                        value={comuna}
                        onChange={(e) => setComuna(e.target.value)}
                        disabled={!region}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        <option value="">Todas</option>
                        {comunas.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro de range slider */}
                <div>
                    <label
                        htmlFor="priceRange"
                        className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-orange-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h2a2 2 0 110 4H4v2h2a2 2 0 110 4H4v2h2a2 2 0 110 4h10a2 2 0 002-2V6a2 2 0 00-2-2H4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Rango de Precio
                    </label>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>
                                {new Intl.NumberFormat("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                    maximumFractionDigits: 0,
                                }).format(priceRange)}
                            </span>
                            <span>
                                {new Intl.NumberFormat("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                    maximumFractionDigits: 0,
                                }).format(1000000)}
                            </span>
                        </div>
                        <input
                            id="priceRange"
                            type="range"
                            min="0"
                            max="1000000"
                            step="1000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                            className="h-2 w-full appearance-none cursor-pointer rounded-lg bg-gray-200"
                            style={{
                                background: `linear-gradient(to right, #f97316 0%, #f97316 ${(priceRange / 1000000) * 100
                                    }%, #e5e7eb ${(priceRange / 1000000) * 100
                                    }%, #e5e7eb 100%)`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Botones para aplicar los filtros o limpiar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                    onClick={resetFilters}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-100"
                >
                    Limpiar filtros
                </button>
                <button
                    onClick={handleApplyFilters}
                    className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-bold text-white transition duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                    Aplicar Filtros
                </button>
            </div>
        </div>
    );
}