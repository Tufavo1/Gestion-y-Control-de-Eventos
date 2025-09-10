"use client";

import { CurrentUser, SectionCard } from "../DesignSystem";
import RequireFeature from "../../../guards/RequireFeature";


export default function ReportsTab({ user }: { user: CurrentUser }) {
    return (
        <RequireFeature currentUser={user} feature="reports.view">
            <SectionCard title="Reportes" description="KPIs y analítica (demo)">
                <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {["Ventas", "Asistencia", "Conversión", "Ingresos"].map((k) => (
                        <div key={k} className="rounded-xl border p-4">
                            <div className="text-sm text-neutral-500">{k}</div>
                            <div className="mt-1 text-2xl font-semibold">—</div>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </RequireFeature>
    );
}
