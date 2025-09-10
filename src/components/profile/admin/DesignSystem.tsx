// components/profile/admin/designsystem.tsx
"use client";

import React from "react";

/** ===== Tipos base ===== */
export type Role = "user" | "member" | "admin" | "superadmin";
export type Plan = "free" | "basic" | "premium" | "gold";
export type FeatureKey =
    | "users.manage"
    | "events.manage"
    | "carousel.manage"
    | "reports.view"
    | "billing.access";

export type CurrentUser = {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    plan: Plan;
};

export const ROLE_ORDER: Role[] = ["user", "member", "admin", "superadmin"];
export const hasRole = (role: Role, min: Role) =>
    ROLE_ORDER.indexOf(role) >= ROLE_ORDER.indexOf(min);

export const PLAN_FEATURES: Record<Plan, Partial<Record<FeatureKey, boolean>>> = {
    free: { "events.manage": true, "reports.view": false, "users.manage": false, "carousel.manage": false, "billing.access": true },
    basic: { "events.manage": true, "reports.view": true, "users.manage": false, "carousel.manage": false, "billing.access": true },
    premium: { "events.manage": true, "reports.view": true, "users.manage": false, "carousel.manage": true, "billing.access": true },
    gold: { "events.manage": true, "reports.view": true, "users.manage": true, "carousel.manage": true, "billing.access": true },
};

export const PLAN_LIMITS: Record<Plan, { eventsPerMonth?: number; maxImagesCarousel?: number }> = {
    free: { eventsPerMonth: 0, maxImagesCarousel: 0 },
    basic: { eventsPerMonth: 5, maxImagesCarousel: 0 },
    premium: { eventsPerMonth: undefined, maxImagesCarousel: 10 },
    gold: { eventsPerMonth: undefined, maxImagesCarousel: 50 },
};

export const hasFeature = (plan: Plan, feature: FeatureKey) =>
    !!PLAN_FEATURES[plan]?.[feature];

/** ===== UI atómica ===== */
export function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
            {children}
        </span>
    );
}

export function SectionCard(props: {
    title: string;
    description?: string;
    children?: React.ReactNode;
    locked?: boolean;
    lockMessage?: string;
}) {
    const { title, description, children, locked, lockMessage } = props;
    return (
        <div className={`relative rounded-2xl border bg-white/5 p-4 shadow-sm ring-1 ring-black/5 ${locked ? "opacity-60" : ""}`}>
            <div className="mb-2 flex items-center gap-2">
                <h3 className="text-base font-semibold">{title}</h3>
                {locked && <span className="text-sm">🔒</span>}
            </div>
            {description ? <p className="text-sm text-neutral-500">{description}</p> : null}
            <div className={locked ? "blur-[1px] select-none pointer-events-none" : ""}>
                {children}
            </div>
            {locked && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="pointer-events-auto rounded-xl border bg-black/70 px-3 py-2 text-center text-sm text-white">
                        <div className="mb-1 font-semibold">Función bloqueada</div>
                        <div>{lockMessage ?? "Disponible al mejorar tu plan o con rol superior."}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function LockedView({ message }: { message: string }) {
    return (
        <div className="grid place-items-center rounded-2xl border bg-white/5 p-10 text-center ring-1 ring-black/5">
            <div className="text-3xl">🔒</div>
            <div className="mt-2 font-semibold">Acceso restringido</div>
            <p className="mt-1 text-sm text-neutral-500">{message}</p>
            <div className="mt-3 flex gap-2">
                <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/10">Saber más</button>
                <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/10">Mejorar plan</button>
            </div>
        </div>
    );
}
