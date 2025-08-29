"use client";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';

export function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header className="border-b border-gray-200">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link href="/" className="group flex items-center font-sans text-2xl font-bold text-gray-900 transition-colors duration-300">
                    <Image src="/img/icono.png" alt="Logo de CuponME" width={50} height={50} className="mr-0 h-15 w-15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    <span className="font-extrabold text-gray-800 transition-colors duration-300 group-hover:text-orange-500">
                        CUPON
                    </span>
                    <span className="ml-1 text-2xl font-light tracking-wide text-orange-500 transition-colors duration-300 group-hover:text-gray-800">
                        ME
                    </span>
                </Link>

                {/* Botones para responsividad movil o tablet */}
                <button type="button" aria-expanded={open} aria-controls="primary-menu" onClick={() => setOpen(!open)} className="rounded-md p-2 ring-1 ring-black-400 md:hidden">
                    <span className="sr-only">Abrir menú</span>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>

                {/* menu para pc o notebook */}
                <ul id="primary-menu" className="hidden items-center gap-6 md:flex">
                    {["/", "/events", "#organiza", "#nosotros", "#contacto"].map(
                        (href, i) => (
                            <li key={href}>
                                <Link className="text-sm font-bold hover:text-orange-500" href={href}>
                                    {["Home", "Eventos", "Organiza tu Evento", "Sobre Nosotros", "Contacto"][i]}
                                </Link>
                            </li>
                        )
                    )}
                </ul>

                {/* Botones desktop */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link href="/login" className="rounded-md px-4 py-2 text-sm font-bold ring-1 ring-black-400 hover:bg-orange-500 hover:ring-0">
                        Iniciar
                    </Link>
                    <Link href="/Register" className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-black ring-black-400 hover:bg-white hover:ring-1">
                        Registrarse
                    </Link>
                </div>
            </nav>

            {/* menu desplegable movil o tablets */}
            {open && (
                <div className="border-t border-gray-200 md:hidden">
                    <div className="mx-auto max-w-8xl px-4 py-3 space-y-2">
                        {["/", "/events", "#organiza", "#nosotros", "#contacto"].map(
                            (href, i) => (
                                <Link key={href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-black-50" href={href}>
                                    {["Home", "Eventos", "Organiza tu Evento", "Sobre Nosotros", "Contacto"][i]}
                                </Link>
                            )
                        )}

                        <div className="flex items-center gap-3 pt-1">
                            <Link href="/login" onClick={() => setOpen(false)} className="flex-1 rounded-md px-4 py-2 text-center font-bold ring-1 ring-black-400">
                                Iniciar
                            </Link>
                            <Link href="/Register" onClick={() => setOpen(false)} className="flex-1 rounded-md bg-orange-500 px-4 py-2 text-center font-semibold text-black">
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
