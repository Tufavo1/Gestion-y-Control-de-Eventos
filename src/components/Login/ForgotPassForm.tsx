"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
    title?: string;
    subtitle?: string;
    onSubmitMock?: (email: string) => void;
};

export default function ForgotPasswordForm({
    title = "Recuperar contraseña",
    subtitle = "Te enviaremos un enlace para restablecerla",
    onSubmitMock,
}: Props) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const canSubmit = emailValid && status !== "sending";

    const resetForm = () => {
        setEmail("");
        setStatus("idle");
        setErrorMsg("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setStatus("sending");
        setErrorMsg("");

        // mockup de envio
        setTimeout(() => {
            try {
                onSubmitMock?.(email);
                setStatus("ok");
            } catch (err) {
                setStatus("error");
                setErrorMsg("No pudimos enviar el correo en este momento. Intenta nuevamente.");
            }
        }, 800);
    };

    return (
        <div className="flex min-h-150 items-center py-1">
            <div className="w-full px-25 max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                {/* Encabezado */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                </div>

                {status !== "ok" ? (
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <input id="email" type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => {
                                setEmail(e.target.value);
                                setStatus("idle");
                                setErrorMsg("");
                            }} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${email.length === 0 || emailValid
                                ? "border-gray-300 focus:ring-orange-500"
                                : "border-red-300 focus:ring-red-500"
                                }`} autoComplete="email" required />
                            {email.length > 0 && !emailValid && (
                                <p className="mt-1 text-xs text-red-500">Ingresa un correo válido.</p>
                            )}
                        </div>

                        {/* Estados */}
                        {status === "error" && (
                            <p className="text-sm text-red-500">{errorMsg || "Ocurrió un error inesperado."}</p>
                        )}

                        {/* Acciones */}
                        <div className="flex items-center justify-between gap-3">
                            <button type="button" onClick={resetForm} disabled={status === "sending" && true} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60">
                                Limpiar
                            </button>

                            <button type="submit" disabled={!canSubmit} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-60">
                                {status === "sending" ? "Enviando…" : "Enviar enlace"}
                            </button>
                        </div>

                        {/* Enlaces secundarios */}
                        <div className="pt-2 text-center text-sm text-gray-500">
                            ¿La recordaste?{" "}
                            <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-700">
                                Inicia sesión
                            </Link>
                        </div>
                    </form>
                ) : (
                    // Vista de exito mockup
                    <div className="text-center">
                        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                            ✓
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Revisa tu bandeja</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Si <span className="font-medium">{email}</span> está registrado, te enviamos un enlace para
                            restablecer tu contraseña. El enlace vence en 30 minutos.
                        </p>

                        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <button onClick={resetForm} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300">
                                Enviar a otro correo
                            </button>
                            <Link href="/login" className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                Volver a iniciar sesión
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
