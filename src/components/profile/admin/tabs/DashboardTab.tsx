"use client";

import { Badge, CurrentUser, PLAN_LIMITS, SectionCard } from "../DesignSystem";

export default function DashboardTab({ user }: { user: CurrentUser }) {
    const limits = PLAN_LIMITS[user.plan];
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="Resumen de cuenta">
                <div className="mt-2 space-y-2 text-sm">
                    <div><span className="font-medium">Usuario:</span> {user.fullName}</div>
                    <div className="flex gap-2">
                        <Badge>Rol: {user.role}</Badge>
                        <Badge>Plan: {user.plan}</Badge>
                    </div>
                </div>
            </SectionCard>
            <SectionCard title="Límites por plan" description="El hard-limit se aplica en backend">
                <ul className="mt-2 list-disc pl-5 text-sm">
                    <li>Eventos/mes: {limits.eventsPerMonth ?? "Ilimitado"}</li>
                    <li>Imágenes carousel: {Number.isFinite(limits.maxImagesCarousel as number) ? limits.maxImagesCarousel : "Ilimitado"}</li>
                </ul>
            </SectionCard>
        </div>
    );
}
