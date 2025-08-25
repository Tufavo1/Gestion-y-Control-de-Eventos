"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function LoginPage() {
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/panel";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Prefill del email si estaba guardado
    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem("remember-email");
        if (saved) setEmail(saved);
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg("");

        if (!email || !password) {
            setErrorMsg("Por favor ingresa tu email y contraseña.");
            return;
        }

        setLoading(true);

        // MOCK: login válido si clave = 123456
        await new Promise((r) => setTimeout(r, 600));
        if (password === "123456") {
            if (remember) localStorage.setItem("remember-email", email);
            else localStorage.removeItem("remember-email");

            router.push(callbackUrl);
            return;
        }

        setErrorMsg("Credenciales inválidas (tip: usa 123456 en este mock).");
        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <div className="mx-auto grid min-h-[60vh] max-w-md place-content-center px-4">
                <form
                    onSubmit={onSubmit}
                    className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-md"
                >
                    <h1 className="mb-1 text-2xl font-semibold">Iniciar sesión</h1>
                    <p className="mb-6 text-sm text-gray-600">
                        (Demo) Luego conectaremos este formulario con tu backend.
                    </p>

                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        placeholder="tucorreo@dominio.com"
                        className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <label className="mb-1 block text-sm font-medium">Contraseña</label>
                    <div className="mb-3 flex rounded-md border border-gray-300 focus-within:border-gray-400">
                        <input
                            type={showPwd ? "text" : "password"}
                            placeholder="•••••••"
                            className="w-full rounded-l-md px-3 py-2 text-sm outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd((v) => !v)}
                            className="rounded-r-md px-3 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            {showPwd ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-gray-900"
                            />
                            Recordarme
                        </label>
                        <a href="#" className="text-sm text-gray-700 underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {errorMsg && (
                        <p className="mb-4 text-sm text-red-600">{errorMsg}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                        {loading ? "Ingresando…" : "Entrar"}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="text-gray-900 underline">
                            Crear cuenta
                        </Link>
                    </p>
                </form>
            </div>

            <footer
                id="contacto"
                className="border-t border-gray-200 bg-gray-50"
            >
                <div className="mx-100 max-w-7xl px-4 py-10">
                    <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} Dinovance. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </main>
    );
}
