// src/components/profile/admin/ProfilePanel.tsx
"use client";

import { useEffect, useState } from "react";
import RequireRole from "../../guards/RequireRole";

// Tabs
import DashboardTab from "./tabs/DashboardTab";
import EventsTab from "./tabs/EventsTab";
import CarouselTab from "./tabs/CarouselTab";
import UsersTab from "./tabs/UsersTab";
import ReportsTab from "./tabs/ReportsTab";
import BillingTab from "./tabs/BillingTab";
import { CurrentUser } from "./DesignSystem";
import { SideNav } from "./Sidenav";
import SettingsTab from "./tabs/SettingsTab";

export type NavKey =
    | "dashboard"
    | "events"
    | "carousel"
    | "users"
    | "reports"
    | "billing"
    | "settings";

export default function ProfilePanel({
    currentUser,
    defaultTab = "dashboard",
    onNavigate,
}: {
    currentUser: CurrentUser;
    defaultTab?: NavKey;
    onNavigate?: (tab: NavKey) => void;
}) {
    const [tab, setTab] = useState<NavKey>(defaultTab);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const go = (to: NavKey) => {
        setTab(to);
        onNavigate?.(to);
    };

    return (
        <div className="grid min-h-[70vh] grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
            <aside className="rounded-2xl border bg-white/5 p-3 ring-1 ring-black/5">
                <SideNav currentUser={currentUser} active={tab} onNavigate={go} />
            </aside>

            <main className="rounded-2xl border bg-white/5 p-4 ring-1 ring-black/5">
                {!mounted ? (
                    <div className="text-sm text-neutral-500">Cargando…</div>
                ) : (
                    <>
                        {tab === "dashboard" && <DashboardTab user={currentUser} />}
                        {tab === "events" && <EventsTab user={currentUser} />}
                        {tab === "carousel" && <CarouselTab user={currentUser} />}
                        {tab === "users" && (
                            <RequireRole currentUser={currentUser} minRole="admin">
                                <UsersTab user={currentUser} />
                            </RequireRole>
                        )}
                        {tab === "reports" && <ReportsTab user={currentUser} />}
                        {tab === "billing" && <BillingTab user={currentUser} />}
                        {tab === "settings" && <SettingsTab user={currentUser} />}
                    </>
                )}
            </main>
        </div>
    );
}
