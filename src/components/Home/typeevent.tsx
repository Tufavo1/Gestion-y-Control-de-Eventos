"use client";

type TipoEvento = "deporte" | "fiesta" | "concierto" | "teatro" | "feria" | "otro";

export default function TipoEvento({ tipo }: { tipo?: string }) {
    // normaliza y valida contra las 5 opciones en caso que no coincide = "otro"
    const t = (tipo?.toLowerCase() as TipoEvento) as TipoEvento;
    const valid: Record<TipoEvento, { label: string; cls: string }> = {
        deporte: { label: "Deporte", cls: "bg-emerald-600 text-white" },
        fiesta: { label: "Fiesta", cls: "bg-pink-600 text-white" },
        concierto: { label: "Concierto", cls: "bg-purple-600 text-white" },
        teatro: { label: "Teatro", cls: "bg-blue-600 text-white" },
        feria: { label: "Feria", cls: "bg-amber-600 text-white" },
        otro: { label: "Evento", cls: "bg-gray-300 text-gray-900" },
    };

    const finalKey: TipoEvento = (t && t in valid ? t : "otro");
    const cfg = valid[finalKey];

    return (
        <span className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
}
