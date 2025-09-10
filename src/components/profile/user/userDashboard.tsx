// src/components/profile/user/Profile.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/authcontext";
import { UserProfile } from "@/lib/types/user";
import { AttendedEvent, Purchase } from "@/lib/types/events";
import { changePassword, deleteAccount, getMyProfile, updateProfile } from "@/lib/users/profile.api";
import { getLastAttendedEvents, getPurchaseHistory } from "@/lib/events/purchases.api";


function hasRole(x: unknown): x is { role?: string } {
    return typeof x === "object" && x !== null && "role" in x;
}


// Util para CLP (sin decimales)
const formatCLP = (v: number) =>
    new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(Math.round(Number.isFinite(v) ? v : 0));

// Iniciales del nombre
function initialsFromName(name?: string) {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (a + b).toUpperCase();
}

export default function Profile() {
    const { user, logout } = useAuth();

    // Perfil
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    // Form perfil
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [rut, setRut] = useState("");
    const [birthDate, setBirthDate] = useState<string>(""); // yyyy-MM-dd

    // Password
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdMsg, setPwdMsg] = useState("");
    const [pwdCurrent, setPwdCurrent] = useState("");
    const [pwdNew, setPwdNew] = useState("");
    const [pwdNew2, setPwdNew2] = useState("");

    // Pago
    const [cardLoading, setCardLoading] = useState(false);
    const [cardMsg, setCardMsg] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExp, setCardExp] = useState(""); // MM/AA
    const [cardCvc, setCardCvc] = useState("");

    // Historial & eventos
    const [orders, setOrders] = useState<Purchase[]>([]);
    const [events, setEvents] = useState<AttendedEvent[]>([]);
    const [loadingLists, setLoadingLists] = useState(true);

    // Cargar perfil
    useEffect(() => {
        (async () => {
            try {
                setLoadingProfile(true);
                const p = await getMyProfile().catch(() => null);
                setProfile(p);
                if (p) {
                    setEmail(p.email ?? user?.email ?? "");
                    setUserName(p.userName ?? "");
                    setFullName(p.fullName ?? user?.fullName ?? "");
                    setPhone(p.phone ?? "");
                    setRut(p.rut ?? "");
                    setBirthDate(p.birthDate ? p.birthDate.slice(0, 10) : "");
                } else {
                    setEmail(user?.email ?? "");
                    setFullName(user?.fullName ?? "");
                }
            } finally {
                setLoadingProfile(false);
            }
        })();
    }, [user]);

    // Cargar listas
    useEffect(() => {
        (async () => {
            try {
                setLoadingLists(true);
                const [h, e] = await Promise.all([
                    getPurchaseHistory().catch(() => [] as Purchase[]),
                    getLastAttendedEvents().catch(() => [] as AttendedEvent[]),
                ]);
                setOrders(h);
                setEvents(e);
            } finally {
                setLoadingLists(false);
            }
        })();
    }, []);

    const avatar = useMemo(
        () => initialsFromName(fullName || profile?.fullName || user?.fullName),
        [fullName, profile, user]
    );

    // Guardar perfil
    async function onSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaveMsg("");
        setSavingProfile(true);
        try {
            const updated = await updateProfile({
                email: email.trim(),
                userName: userName.trim(),
                fullName: fullName.trim(),
                phone: phone.trim(),
                rut: rut.trim(),
                birthDate: birthDate || null,
            });
            setProfile(updated);
            setSaveMsg("Perfil actualizado correctamente.");
        } catch (err) {
            setSaveMsg(
                err instanceof Error ? err.message : "No se pudo actualizar el perfil."
            );
        } finally {
            setSavingProfile(false);
        }
    }

    // Cambiar contraseña
    async function onChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setPwdMsg("");
        if (pwdNew.length < 8) {
            setPwdMsg("La nueva contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (pwdNew !== pwdNew2) {
            setPwdMsg("Las contraseñas no coinciden.");
            return;
        }
        setPwdLoading(true);
        try {
            await changePassword({ currentPassword: pwdCurrent, newPassword: pwdNew });
            setPwdMsg("Contraseña actualizada ✅");
            setPwdCurrent("");
            setPwdNew("");
            setPwdNew2("");
        } catch (err) {
            setPwdMsg(
                err instanceof Error ? err.message : "No se pudo cambiar la contraseña."
            );
        } finally {
            setPwdLoading(false);
        }
    }

    // Guardar método de pago
    async function onSaveCard(e: React.FormEvent) {
        e.preventDefault();
        setCardMsg("");
        setCardLoading(true);
        try {
            await savePaymentMethod({
                holder: cardHolder.trim(),
                numbercard: cardNumber.replace(/\s/g, ""),
                expMonth: cardExp.trim(), // MM/AA
                numberCvc: cardCvc.trim(),
            });
            setCardMsg("Tarjeta guardada ✅");
            setCardHolder("");
            setCardNumber("");
            setCardExp("");
            setCardCvc("");
        } catch (err) {
            setCardMsg(
                err instanceof Error ? err.message : "No se pudo guardar la tarjeta."
            );
        } finally {
            setCardLoading(false);
        }
    }

    // Eliminar cuenta
    async function onDeleteAccount() {
        const yes = confirm(
            "¿Seguro que deseas eliminar tu cuenta? Esta acción es irreversible."
        );
        if (!yes) return;
        try {
            await deleteAccount();
            logout();
        } catch (err) {
            alert(
                err instanceof Error ? err.message : "No se pudo eliminar la cuenta."
            );
        }
    }

    return (
        <div className="relative mx-auto max-w-7xl px-4 py-10">
            {/* Fondo decorativo */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -left-24 h-[360px] w-[360px] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-orange-400 via-amber-300 to-yellow-200" />
                <div className="absolute -bottom-16 -right-16 h-[320px] w-[320px] rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-gray-900 via-gray-700 to-gray-500" />
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        Bienvenido a tu
                    </p>
                    <h1 className="mt-1 text-2xl font-black text-gray-900">
                        Perfil
                        <span className="ml-2 inline-block align-middle text-xs font-semibold text-orange-600">
                            :)
                        </span>
                    </h1>
                </div>
                <div className="inline-flex items-center gap-2">
                    <span className="rounded-full bg-gray-400 px-3 py-1 text-xs font-medium text-white ring-1 ring-gray-200">
                        Disfruta, nosotros nos encargamos de tu seguridad
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Columna 1 */}
                <section className="md:col-span-1 space-y-6">
                    {/* Card principal */}
                    <div className="group rounded-2xl border border-white/60 bg-white/60 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] backdrop-blur-md ring-1 ring-black/5">
                        <div className="mb-5 flex items-center gap-4">
                            <div className="relative">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-2xl font-bold text-white shadow-lg ring-2 ring-white">
                                    {avatar}
                                </div>
                                <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-200 shadow">
                                    ✓
                                </span>
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-extrabold text-gray-900">
                                    {loadingProfile
                                        ? "Cargando..."
                                        : fullName || user?.fullName || "Usuario"}
                                </h2>
                                <p className="truncate text-sm text-gray-600">
                                    {email || user?.email || "—"}
                                </p>
                            </div>
                        </div>

                        <div className="mb-3 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a5 5 0 00-5 5v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 7V7a3 3 0 016 0v2H9z" />
                                </svg>
                                {profile?.role ?? (hasRole(user) ? user.role : undefined) ?? "Free"}
                            </span>
                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 ring-1 ring-orange-100">
                                Cuenta Activa
                            </span>
                        </div>

                        <div className="relative my-4 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                        <dl className="grid grid-cols-1 gap-2 text-[13px]">
                            <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 ring-1 ring-gray-200">
                                <dt className="text-gray-500">Nombre Usuario</dt>
                                <dd className="max-w-[60%] truncate font-semibold text-gray-900">
                                    {userName || "—"}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 ring-1 ring-gray-200">
                                <dt className="text-gray-500">RUT</dt>
                                <dd className="max-w-[60%] truncate font-semibold text-gray-900">
                                    {rut || "—"}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 ring-1 ring-gray-200">
                                <dt className="text-gray-500">Teléfono</dt>
                                <dd className="max-w-[60%] truncate font-semibold text-gray-900">
                                    {phone || "—"}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 ring-1 ring-gray-200">
                                <dt className="text-gray-500">Fecha de Nacimiento</dt>
                                <dd className="max-w-[60%] truncate font-semibold text-gray-900">
                                    {birthDate || "—"}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Membresía */}
                    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md ring-1 ring-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            <h3 className="text-sm font-bold tracking-tight text-gray-900">
                                Membresía
                            </h3>
                        </div>
                        <p className="text-sm text-gray-700">
                            Actualmente disfrutas de{" "}
                            <span className="font-semibold">
                                {profile?.role ?? (hasRole(user) ? user.role : undefined) ?? "Free"}
                            </span>{" "}
                            en CuponME.
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            El rol define permisos como organizar eventos, acceder al panel y
                            comprar entradas.
                        </p>
                    </div>

                    {/* Método de pago */}
                    <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-md ring-1 ring-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <h3 className="text-sm font-bold tracking-tight text-gray-900">
                                Método de pago
                            </h3>
                        </div>

                        <form onSubmit={onSaveCard} className="space-y-3">
                            <div className="group rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-500">
                                <input
                                    value={cardHolder}
                                    onChange={(e) => setCardHolder(e.target.value)}
                                    className="w-full rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400"
                                    placeholder="Titular (como aparece en la tarjeta)"
                                />
                            </div>
                            <div className="group rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-500">
                                <input
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400"
                                    placeholder="Número de tarjeta"
                                    inputMode="numeric"
                                    maxLength={19}
                                />
                            </div>
                            <div className="group rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-500">
                                <input
                                    value={cardExp}
                                    onChange={(e) => setCardExp(e.target.value)}
                                    className="w-full rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400"
                                    placeholder="MM/AA"
                                    maxLength={5}
                                />
                            </div>
                            <div className="group rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-500">
                                <input
                                    value={cardCvc}
                                    onChange={(e) => setCardCvc(e.target.value)}
                                    className="w-full rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400"
                                    placeholder="CVC"
                                    maxLength={3}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={cardLoading}
                                className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
                            >
                                {cardLoading ? "Guardando…" : "Guardar tarjeta"}
                            </button>
                            {cardMsg && <p className="text-xs text-gray-600">{cardMsg}</p>}
                        </form>
                    </div>

                    {/* Eliminar cuenta */}
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 ring-1 ring-red-100">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-600" />
                            <h3 className="text-sm font-bold tracking-tight text-red-700">
                                Eliminar cuenta
                            </h3>
                        </div>
                        <p className="mb-3 text-sm text-red-700">
                            Esta acción elimina tu cuenta y datos asociados. No se puede
                            deshacer.
                        </p>
                        <button
                            onClick={onDeleteAccount}
                            className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-500"
                        >
                            Eliminar mi cuenta
                        </button>
                    </div>
                </section>

                {/* Columna 2–3 */}
                <section className="md:col-span-2 space-y-6">
                    {/* Editar perfil */}
                    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md ring-1 ring-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                            <h3 className="text-sm font-bold tracking-tight text-gray-900">
                                Editar información
                            </h3>
                        </div>

                        <form onSubmit={onSaveProfile} className="grid gap-4 md:grid-cols-2">
                            <label className="group block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Nombre completo
                                </span>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="Nombre Apellido"
                                />
                            </label>

                            <label className="group block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Usuario
                                </span>
                                <input
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="usuario123"
                                />
                            </label>

                            <label className="group block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Email
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="correo@dominio.com"
                                />
                            </label>

                            <label className="group block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Teléfono
                                </span>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="+56 9 1234 5678"
                                />
                            </label>

                            <label className="group block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    RUT
                                </span>
                                <input
                                    value={rut}
                                    onChange={(e) => setRut(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="12.345.678-9"
                                />
                            </label>

                            <label className="group block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Fecha de nacimiento
                                </span>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                />
                            </label>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-gray-800 disabled:opacity-60"
                                >
                                    {savingProfile ? "Guardando…" : "Guardar cambios"}
                                </button>
                                {saveMsg && <p className="mt-2 text-sm text-gray-700">{saveMsg}</p>}
                            </div>
                        </form>
                    </div>

                    {/* Cambiar contraseña */}
                    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md ring-1 ring-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
                            <h3 className="text-sm font-bold tracking-tight text-gray-900">
                                Cambiar contraseña
                            </h3>
                        </div>

                        <form onSubmit={onChangePassword} className="grid gap-4 md:grid-cols-3">
                            <label className="block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Contraseña actual
                                </span>
                                <input
                                    type="password"
                                    value={pwdCurrent}
                                    onChange={(e) => setPwdCurrent(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Nueva contraseña
                                </span>
                                <input
                                    type="password"
                                    value={pwdNew}
                                    onChange={(e) => setPwdNew(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Repetir nueva contraseña
                                </span>
                                <input
                                    type="password"
                                    value={pwdNew2}
                                    onChange={(e) => setPwdNew2(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50"
                                />
                            </label>

                            <div className="md:col-span-3">
                                <button
                                    type="submit"
                                    disabled={pwdLoading}
                                    className="w-full rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
                                >
                                    {pwdLoading ? "Actualizando…" : "Actualizar contraseña"}
                                </button>
                                {pwdMsg && <p className="mt-2 text-sm text-gray-700">{pwdMsg}</p>}
                            </div>
                        </form>
                    </div>

                    {/* Historial de compras */}
                    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md ring-1 ring-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-sky-500" />
                                <h3 className="text-sm font-bold tracking-tight text-gray-900">
                                    Historial de compras
                                </h3>
                            </div>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 ring-1 ring-gray-200">
                                {loadingLists ? "—" : `${orders.length} ítems`}{/* ✅ template literal */}
                            </span>
                        </div>

                        {loadingLists ? (
                            <p className="text-sm text-gray-600">Cargando…</p>
                        ) : orders.length === 0 ? (
                            <p className="text-sm text-gray-600">Aún no tienes compras.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200/70">
                                {orders.map((o) => (
                                    <li key={o.id} className="py-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {o.eventTitle}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(o.purchasedAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">
                                                    {formatCLP(o.amount)}
                                                </p>
                                                <p className="text-xs text-gray-500">x{o.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Últimos eventos asistidos */}
                    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md ring-1 ring-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-violet-500" />
                            <h3 className="text-sm font-bold tracking-tight text-gray-900">
                                Últimos eventos asistidos
                            </h3>
                        </div>

                        {loadingLists ? (
                            <p className="text-sm text-gray-600">Cargando…</p>
                        ) : events.length === 0 ? (
                            <p className="text-sm text-gray-600">
                                Aún no has asistido a eventos.
                            </p>
                        ) : (
                            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {events.map((ev) => (
                                    <li
                                        key={ev.id}
                                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                                    >
                                        <p className="line-clamp-1 font-semibold text-gray-900">
                                            {ev.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(ev.date).toLocaleString()}
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                                            {ev.venue}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
function savePaymentMethod(arg0: {
    holder: string; numbercard: string; expMonth: string; // MM/AA
    numberCvc: string;
}) {
    throw new Error("Function not implemented.");
}

