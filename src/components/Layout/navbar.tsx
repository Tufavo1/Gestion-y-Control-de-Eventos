// components/Layout/navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";

function initialsFromName(name?: string) {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (a + b).toUpperCase();
}

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();

    // === Lógica de visibilidad ===
    const role = (user?.role ?? "user") as "user" | "member" | "admin" | "superadmin";
    const plan = (user?.plan ?? "free") as "free" | "basic" | "premium" | "gold";

    const isAdminPanel = role === "admin" || role === "superadmin";
    const isOrganizerPanel = role === "member" || plan === "free"; // ajusta si cambias la regla

    return (
        <header className="border-b border-gray-200">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link
                    href="/"
                    className="group flex items-center font-sans text-2xl font-bold text-gray-900 transition-colors duration-300"
                >
                    <Image
                        src="/img/icono.png"
                        alt="Logo de CuponME"
                        width={50}
                        height={50}
                        className="mr-0 h-15 w-15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    />
                    <span className="font-extrabold text-gray-800 group-hover:text-orange-500">CUPON</span>
                    <span className="ml-1 text-2xl font-light tracking-wide text-orange-500 group-hover:text-gray-800">ME</span>
                </Link>

                {/* Hamburguesa (mobile) */}
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls="primary-menu"
                    onClick={() => setOpen(!open)}
                    className="rounded-md p-2 ring-1 ring-black-400 md:hidden"
                >
                    <span className="sr-only">Abrir menú</span>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>

                {/* Menú desktop */}
                <ul id="primary-menu" className="hidden items-center gap-6 md:flex">
                    {["/", "/events", "#organiza", "#nosotros", "#contacto"].map((href, i) => (
                        <li key={href}>
                            <Link className="text-sm font-bold hover:text-orange-500" href={href}>
                                {["Home", "Eventos", "Organiza tu Evento", "Sobre Nosotros", "Contacto"][i]}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Derecha: auth-aware (desktop) */}
                <div className="hidden items-center gap-3 md:flex relative">
                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className="rounded-md px-4 py-2 text-sm font-bold ring-1 ring-black-400 hover:bg-orange-500 hover:ring-0"
                            >
                                Iniciar
                            </Link>
                            <Link
                                href="/Register"
                                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-black ring-black-400 hover:bg-white hover:ring-1"
                            >
                                Registrarse
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen((s) => !s)}
                                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-400 hover:text-white"
                                aria-expanded={profileOpen}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                                    {initialsFromName(user.fullName)}
                                </div>
                                <span className="text-sm font-semibold max-w-[160px] truncate">
                                    {user.fullName}
                                </span>
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-md z-50">
                                    <div className="px-4 py-3">
                                        <p className="text-sm font-semibold truncate">{user.fullName}</p>
                                        {user.email && (
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        )}
                                    </div>
                                    <div className="border-t">
                                        <Link href="/Profile" className="block px-4 py-2 text-sm hover:bg-gray-50">
                                            Mi perfil
                                        </Link>

                                        {isAdminPanel && (
                                            <Link href="/Panel" className="block px-4 py-2 text-sm hover:bg-gray-50">
                                                Panel
                                            </Link>
                                        )}

                                        {!isAdminPanel && isOrganizerPanel && (
                                            <Link
                                                href="/Organizador"
                                                className="block px-4 py-2 text-sm hover:bg-gray-50"
                                            >
                                                Organizador
                                            </Link>
                                        )}

                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Menú móvil */}
            {open && (
                <div className="border-t border-gray-200 md:hidden">
                    <div className="mx-auto max-w-8xl space-y-2 px-4 py-3">
                        {["/", "/events", "#organiza", "#nosotros", "#contacto"].map((href, i) => (
                            <Link
                                key={href}
                                onClick={() => setOpen(false)}
                                className="block rounded-md px-3 py-2 text-sm hover:bg-black-50"
                                href={href}
                            >
                                {["Home", "Eventos", "Organiza tu Evento", "Sobre Nosotros", "Contacto"][i]}
                            </Link>
                        ))}

                        {!user ? (
                            <div className="flex items-center gap-3 pt-1">
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 rounded-md px-4 py-2 text-center font-bold ring-1 ring-black-400"
                                >
                                    Iniciar
                                </Link>
                                <Link
                                    href="/Register"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 rounded-md bg-orange-500 px-4 py-2 text-center font-semibold text-black"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-2 rounded-md border p-3">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                                        {initialsFromName(user.fullName)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate">{user.fullName}</p>
                                        {user.email && (
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    href="/Profile"
                                    onClick={() => setOpen(false)}
                                    className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    Mi perfil
                                </Link>

                                {isAdminPanel && (
                                    <Link
                                        href="/Panel"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                                    >
                                        Panel
                                    </Link>
                                )}

                                {!isAdminPanel && isOrganizerPanel && (
                                    <Link
                                        href="/Organizador"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                                    >
                                        Organizador
                                    </Link>
                                )}

                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        logout();
                                    }}
                                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
