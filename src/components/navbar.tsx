"use client";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header className="border-b border-gray-200">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link href="/" className="text-xl font-semibold tracking-tight">Futuro logo o Palabra</Link>
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls="primary-menu"
                    onClick={() => setOpen(!open)}
                    className="rounded-md p-2 ring-1 ring-gray-300 md:hidden"
                >
                    <span className="sr-only">Abrir menú</span>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" /></svg>
                </button>

                <ul id="primary-menu" className="hidden items-center gap-6 md:flex">
                    {["Home", "#eventos", "#organiza", "#nosotros", "#contacto"].map((href, i) => (
                        <li key={href}>
                            <Link className="text-sm font-medium hover:text-blue-600" href={href}>
                                {["Home", "Eventos", "Organiza tu Evento", "Sobre Nosotros", "Contacto"][i]}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-3 md:flex">
                    <button className="rounded-md px-4 py-2 text-sm font-medium ring-1 ring-gray-300 hover:bg-gray-50">Iniciar</button>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Registrarse</button>
                </div>
            </nav>

            {open && (
                <div className="border-t border-gray-200 md:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
                        {["/", "#eventos", "#organiza", "#nosotros", "#contacto"].map((href, i) => (
                            <Link key={href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50" href={href}>
                                {["Home", "Eventos", "Organiza tu Evento", "Sobre Nosotros", "Contacto"][i]}
                            </Link>
                        ))}
                        <div className="flex items-center gap-3 pt-1">
                            <button className="flex-1 rounded-md px-4 py-2 text-sm font-medium ring-1 ring-gray-300 hover:bg-gray-50">Iniciar</button>
                            <button className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Registrarse</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
