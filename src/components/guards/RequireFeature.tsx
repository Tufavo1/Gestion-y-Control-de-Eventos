"use client";

import React from "react";
import { CurrentUser, Plan } from "./RequireRole";
import LockedView from "./lockedView";


export type FeatureKey =
    | "users.manage"
    | "events.manage"
    | "carousel.manage"
    | "reports.view"
    | "billing.access";

// Mapa base (opcional). Ajusta según tu negocio.
const DEFAULT_PLAN_FEATURES: Record<Plan, Partial<Record<FeatureKey, boolean>>> = {
    free: { "events.manage": true }, // ejemplo: free puede organizar eventos simples
    basic: { "events.manage": true, "reports.view": true },
    premium: { "events.manage": true, "reports.view": true, "carousel.manage": true },
    gold: { "events.manage": true, "reports.view": true, "carousel.manage": true, "users.manage": true, "billing.access": true },
};

const defaultFeatureCheck = (plan: Plan, feature: FeatureKey) =>
    !!DEFAULT_PLAN_FEATURES[plan]?.[feature];

export default function RequireFeature({
    currentUser,
    feature,
    children,
    fallback,
    featureCheck = defaultFeatureCheck,
}: {
    currentUser: CurrentUser | null | undefined;
    feature: FeatureKey;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    /** Permite inyectar tu propia lógica de features (ej. desde tu DesignSystem) */
    featureCheck?: (plan: Plan, feature: FeatureKey) => boolean;
}) {
    if (!currentUser) {
        return (
            fallback ?? (
                <LockedView
                    title="Debes iniciar sesión"
                    message="Inicia sesión para acceder a esta función."
                    actionLabel="Ir a Iniciar Sesión"
                    actionHref="/login"
                />
            )
        );
    }

    // Superadmin pasa siempre
    if (currentUser.role === "superadmin") {
        return <>{children}</>;
    }

    if (!featureCheck(currentUser.plan, feature)) {
        return (
            fallback ?? (
                <LockedView
                    title="Función bloqueada"
                    message={`Tu plan (${currentUser.plan}) no incluye esta característica.`}
                    actionLabel="Ver planes"
                    actionHref="/pricing"
                />
            )
        );
    }

    return <>{children}</>;
}
