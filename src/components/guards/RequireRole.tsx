"use client";

import React from "react";
import LockedView from "./lockedView";

export type Role = "user" | "member" | "admin" | "superadmin";
export type Plan = "free" | "basic" | "premium" | "gold";

export type CurrentUser = {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    plan: Plan;
};

const ROLE_ORDER: Role[] = ["user", "member", "admin", "superadmin"];
const hasRole = (role: Role, min: Role) =>
    ROLE_ORDER.indexOf(role) >= ROLE_ORDER.indexOf(min);

export default function RequireRole({
    currentUser,
    minRole,
    children,
    fallback,
}: {
    currentUser: CurrentUser | null | undefined;
    minRole: Role;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    if (!currentUser) {
        return (
            fallback ?? (
                <LockedView
                    title="Debes iniciar sesión"
                    message="Inicia sesión para continuar."
                    actionLabel="Ir a Iniciar Sesión"
                    actionHref="/login"
                />
            )
        );
    }

    if (!hasRole(currentUser.role, minRole)) {
        return (
            fallback ?? (
                <LockedView
                    title="Sin privilegios suficientes"
                    message={`Esta sección requiere rol ${minRole} o superior.`}
                    actionLabel="Volver al inicio"
                    actionHref="/"
                />
            )
        );
    }

    return <>{children}</>;
}
