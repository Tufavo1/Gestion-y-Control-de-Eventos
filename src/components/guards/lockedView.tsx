"use client";

import Link from "next/link";
import React from "react";

type LockedViewProps = {
    title?: string;
    message?: string;
    actionLabel?: string;
    actionHref?: string;
    children?: React.ReactNode;
};

export default function LockedView({
    title = "Acceso restringido",
    message = "No tienes permisos para ver este contenido.",
    actionLabel,
    actionHref,
    children,
}: LockedViewProps) {
    return (
        <section className="mx-auto max-w-3xl px-4 py-10">
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 ring-2 ring-orange-200">
                    {/* Candado */}
                    <svg viewBox="0 0 24 24" className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 10V7a5 5 0 1 1 10 0v3" />
                        <rect x="4" y="10" width="16" height="10" rx="2" />
                        <path d="M12 14v3" />
                    </svg>
                </div>

                <h1 className="text-xl font-bold tracking-tight text-gray-900">{title}</h1>
                <p className="mt-2 text-sm text-gray-600">{message}</p>

                {children && <div className="mt-4">{children}</div>}

                {actionHref && actionLabel && (
                    <div className="mt-6">
                        <Link
                            href={actionHref}
                            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            {actionLabel}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
