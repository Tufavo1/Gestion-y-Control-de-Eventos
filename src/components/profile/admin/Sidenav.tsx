// components/profile/admin/sidenav.tsx
"use client";

import React, { useMemo } from "react";
import { CurrentUser, FeatureKey, hasFeature, hasRole, Role } from "./DesignSystem";

export type NavKey =
    | "dashboard"
    | "events"
    | "carousel"
    | "users"
    | "reports"
    | "billing"
    | "settings";

export type NavItem = {
    key: NavKey;
    label: string;
    icon: React.ReactNode;
    minRole?: Role;
    requiredFeature?: FeatureKey;
};

export const NAV_ITEMS: NavItem[] = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "events", label: "Eventos", icon: "🎫", requiredFeature: "events.manage" },
    { key: "carousel", label: "Carousel", icon: "🖼️", requiredFeature: "carousel.manage" },
    { key: "users", label: "Usuarios", icon: "👤", minRole: "admin" },
    { key: "reports", label: "Reportes", icon: "📊", requiredFeature: "reports.view" },
    { key: "billing", label: "Facturación", icon: "💳", requiredFeature: "billing.access" },
    { key: "settings", label: "Ajustes", icon: "⚙️", minRole: "member" },
];

function canAccess(item: NavItem, user: CurrentUser) {
    const roleOK = item.minRole ? hasRole(user.role, item.minRole) : true;
    const featureOK = item.requiredFeature ? hasFeature(user.plan, item.requiredFeature) : true;
    if (user.role === "superadmin") return roleOK;
    return roleOK && featureOK;
}

export function SideNav({
    currentUser,
    active,
    onNavigate,
    items = NAV_ITEMS,
}: {
    currentUser: CurrentUser;
    active: NavKey;
    onNavigate: (k: NavKey) => void;
    items?: NavItem[];
}) {
    const list = useMemo(() => items, [items]);
    return (
        <aside className="rounded-2xl border bg-gray-100 p-3 ring-1 ring-black px-5">
            <div className="mb-4 rounded-xl border p-3">
                <div className="text-lg font-bold text-black text-center"><strong>Panel De Control</strong></div>
                <div className="text-sm text-orange-500 text-center">
                    {currentUser.role} · Plan {currentUser.plan}
                </div>
            </div>
            <nav className="flex flex-col gap-1">
                {list.map((item) => {
                    const ok = canAccess(item, currentUser);
                    return (
                        <button
                            key={item.key}
                            onClick={() => onNavigate(item.key)}
                            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-orange-500 ${active === item.key ? "bg-gray-200 ring-1 ring-black/5" : ""
                                } ${ok ? "" : "opacity-70"}`}
                            title={ok ? item.label : `${item.label} (🔒)`}
                        >
                            <span className="shrink-0">{ok ? item.icon : "🔒"}</span>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
