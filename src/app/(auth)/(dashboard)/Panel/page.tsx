// src/app/(auth)/(dashboard)/Profile/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getStoredSession } from "@/lib/api";
import AdminPanel from "@/components/profile/admin/adminPanel";
import { Navbar } from "@/components/Layout/navbar";
import Footer from "@/components/Layout/footer";

// Tipos locales (coinciden con los que usa tu panel)
type Role = "user" | "member" | "admin" | "superadmin";
type Plan = "free" | "basic" | "premium" | "gold";

const asRole = (v?: string): Role => {
    const x = (v ?? "").toLowerCase();
    return (["member", "admin", "superadmin"].includes(x) ? x : "user") as Role;
};
const asPlan = (v?: string): Plan => {
    const x = (v ?? "").toLowerCase();
    return (["free", "basic", "premium", "gold"].includes(x) ? x : "free") as Plan;
};

export default function ProfilePage() {
    const router = useRouter();
    const s = getStoredSession();

    const role = asRole(s?.role);
    const plan = asPlan(s?.plan ?? s?.role);

    // Guard de cliente (ajusta: solo superadmin o admin+superadmin)
    useEffect(() => {
        if (!s || (role !== "admin" && role !== "superadmin")) {
            router.replace("/403");
        }
    }, [s, role, router]);

    // ⬇️ armamos el objeto requerido por AdminPanel
    const currentUser = useMemo(
        () => ({
            id: "me",
            fullName: s?.fullName ?? "Usuario",
            email: s?.email ?? "user@example.com",
            role,
            plan,
        }),
        [s, role, plan]
    );

    if (!s || (role !== "admin" && role !== "superadmin")) return null;

    return (
        <main className="flex min-h-screen flex-col bg-white text-gray-900">
            <Navbar />
            <div className="mx-auto w-full max-w-6xl flex-1 p-4">
                {/* ✅ ahora sí: pasamos currentUser */}
                <AdminPanel currentUser={currentUser} />
            </div>
            <Footer />
        </main>
    );
}
