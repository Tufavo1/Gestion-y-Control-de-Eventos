"use client";

import { useState } from "react";

type PlanId = "free" | "basic" | "premium" | "gold";

type Plan = {
    id: PlanId;
    name: string;
    price: string;
    period?: string;
    highlight?: boolean;
    badge?: string;
    description: string;
    canCreateEvents: number | "ilimitado";
    canManageEvents: number | "ilimitado";
    benefits: string[];
    limitations?: string[];
};

const plans: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "/siempre",
        description:
            "Ideal para comenzar: descubre y sigue eventos sin costo.",
        canCreateEvents: 0,
        canManageEvents: 0,
        benefits: [
            "Mirar todos los eventos",
            "Recibir descuentos",
            "Seguir organizadores favoritos",
        ],
        limitations: [
            "No puedes crear eventos",
            "Sin herramientas de gestión",
            "Sin soporte prioritario",
        ],
    },
    {
        id: "basic",
        name: "Básico",
        price: "$4.990",
        period: "/mes",
        description:
            "Para usuarios que quieren empezar a organizar.",
        canCreateEvents: 5,
        canManageEvents: 5,
        benefits: [
            "Mirar todos los eventos",
            "Recibir descuentos",
            "Crear hasta 5 eventos/mes",
            "Gestionar 5 eventos/mes (asistencia, cambios básicos)",
        ],
        limitations: [
            "Sin beneficios premium",
            "Sin acceso anticipado",
            "Soporte estándar",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        price: "$14.990",
        period: "/mes",
        highlight: true,
        badge: "Más popular",
        description:
            "La mejor experiencia con extras para impulsar tus eventos.",
        canCreateEvents: "ilimitado",
        canManageEvents: "ilimitado",
        benefits: [
            "Eventos ilimitados",
            "Gestión avanzada (cupos, códigos, reportes)",
            "Acceso anticipado a features",
            "Descuentos exclusivos",
            "Soporte prioritario",
        ],
    },
    {
        id: "gold",
        name: "Gold",
        price: "$24.990",
        period: "/mes",
        description:
            "Nivel profesional con todo incluido y asesoría.",
        canCreateEvents: "ilimitado",
        canManageEvents: "ilimitado",
        benefits: [
            "Todo lo de Premium",
            "Asesoría dedicada",
            "Verificación de organizador",
            "Mejor posición en listados",
            "Integraciones (API/ERP/CRM)",
        ],
    },
];

export default function PlanesSection({
    onSelect,
    mode = "marketing", // "marketing" | "onboarding"
}: {
    onSelect?: (id: PlanId) => void;
    mode?: "marketing" | "onboarding";
}) {
    const [openPlan, setOpenPlan] = useState<Plan | null>(null);

    return (
        <>
            <section className="bg-orange-500 py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-10 text-center text-white">
                        <h3 className="text-3xl font-extrabold tracking-tight">
                            Planes de Suscripción
                        </h3>
                        <p className="mt-2 text-orange-100">
                            Elige el plan que más se adapte a tus necesidades.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {plans.map((p) => (
                            <div
                                key={p.id}
                                className={[
                                    "relative rounded-2xl bg-white p-6 text-center shadow-lg transition",
                                    "hover:shadow-2xl hover:-translate-y-1",
                                    p.highlight ? "border-2 border-orange-600 shadow-xl" : "border border-gray-200",
                                ].join(" ")}
                            >
                                {p.badge && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow">
                                        {p.badge}
                                    </span>
                                )}

                                <h4 className="mt-2 text-lg font-bold text-gray-900">{p.name}</h4>
                                <p className="mt-2 text-sm text-gray-600">{p.description}</p>

                                <div className="mt-4">
                                    <div className="text-3xl font-extrabold text-orange-600">{p.price}</div>
                                    {p.period && <div className="text-xs text-gray-500">{p.period}</div>}
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <div className="font-semibold text-gray-800">Crear</div>
                                        <div className="text-gray-600">
                                            {p.canCreateEvents === "ilimitado" ? "Ilimitados" : `${p.canCreateEvents}/mes`}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <div className="font-semibold text-gray-800">Gestionar</div>
                                        <div className="text-gray-600">
                                            {p.canManageEvents === "ilimitado" ? "Ilimitados" : `${p.canManageEvents}/mes`}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <button
                                        onClick={() => setOpenPlan(p)}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-gray-300"
                                    >
                                        Saber más
                                    </button>
                                    <button
                                        className={[
                                            "w-full rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
                                            p.highlight ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600",
                                        ].join(" ")}
                                        onClick={() => {
                                            if (onSelect) onSelect(p.id); else setOpenPlan(p);
                                        }}
                                    >
                                        {mode === "onboarding" ? `Elegir ${p.name}` : `Elegir ${p.name}`}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* modal igual que lo tienes, pero el CTA llama onSelect si existe */}
            <div
                aria-hidden={openPlan ? "false" : "true"}
                className={[
                    "fixed inset-0 z-[70] items-end justify-center sm:items-center",
                    openPlan ? "pointer-events-auto flex" : "pointer-events-none hidden",
                ].join(" ")}
                onKeyDown={(e) => e.key === "Escape" && setOpenPlan(null)}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpenPlan(null)} />
                <div className="relative z-10 w-full max-w-lg translate-y-0 rounded-2xl bg-white p-6 shadow-2xl sm:mx-auto sm:rounded-3xl">
                    {openPlan && (
                        <>
                            {/* ...contenido igual... */}
                            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                                <button
                                    className="w-full rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition"
                                    onClick={() => {
                                        if (onSelect) onSelect(openPlan.id);
                                        setOpenPlan(null);
                                    }}
                                >
                                    Elegir {openPlan.name}
                                </button>
                                <button
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:border-gray-300 transition"
                                    onClick={() => setOpenPlan(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
