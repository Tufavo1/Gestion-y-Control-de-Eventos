"use client";

import { Badge, CurrentUser, hasFeature, PLAN_LIMITS, SectionCard } from "../DesignSystem";

export default function EventsTab({ user }: { user: CurrentUser }) {
    const can = user.role === "superadmin" || hasFeature(user.plan, "events.manage");
    const max = PLAN_LIMITS[user.plan].eventsPerMonth ?? Infinity;

    return (
        <div className="space-y-4">
            <SectionCard title="Gestión de eventos" description="Crea, edita y publica." locked={!can} lockMessage="Tu plan no permite gestionar eventos.">
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/10">+ Nuevo evento</button>
                    <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/10">Ver todos</button>
                    <Badge>Máx por mes: {Number.isFinite(max) ? max : "Ilimitado"}</Badge>
                </div>
            </SectionCard>
            <SectionCard title="Listado (demo)" locked={!can} lockMessage="Disponible con eventos habilitados.">
                <div className="mt-2 divide-y text-sm">
                    {["Concierto A", "Feria B", "Teatro C"].map((ev) => (
                        <div key={ev} className="flex items-center justify-between py-2">
                            <span>{ev}</span>
                            <div className="flex gap-2">
                                <button className="rounded-lg border px-2 py-1 hover:bg-white/10">Editar</button>
                                <button className="rounded-lg border px-2 py-1 hover:bg-white/10">Publicar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
}
