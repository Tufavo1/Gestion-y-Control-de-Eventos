"use client";

import { useState } from "react";
import Link from "next/link";
import AuthSocialButtons from "./AuthSocialButtons";

type Props = {
    title?: string;
    subtitle?: string;
    onSubmitMock?: (data: { email: string; password: string; remember: boolean }) => void;
};

export default function LoginForm({
    title = "Iniciar sesión",
    subtitle = "Bienvenido de vuelta",
    onSubmitMock,
}: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"idle" | "enviado" | "correcto" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const validate = () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ingresa un correo válido.";
        if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
        return null;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const v = validate();
        if (v) {
            setErrorMsg(v);
            setStatus("error");
            return;
        }
        setStatus("enviado");
        setTimeout(() => {
            try {
                onSubmitMock?.({ email, password, remember });
                setStatus("correcto");
            } catch {
                setStatus("error");
                setErrorMsg("No se pudo completar el inicio de sesión (mock).");
            }
        }, 800);
    };

    return (
        <div className="w-full max-w-lg">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            </div>

            <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" aria-busy={status === "enviado"}>
                {/* Email */}
                <label className="mb-1 block text-sm font-medium text-gray-700">Correo</label>
                <input type="email" value={email} onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus("idle");
                    setErrorMsg("");
                }}
                    placeholder="tucorreo@gmail.com" className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" autoComplete="email" required />

                {/* Password */}
                <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                </div>
                <div className="relative">
                    <input type={show ? "text" : "password"} value={password} onChange={(e) => {
                        setPassword(e.target.value);
                        setStatus("idle");
                        setErrorMsg("");
                    }}
                        placeholder="••••••••" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-orange-500" autoComplete="current-password" required />
                    <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 text-xs font-semibold text-gray-600 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500" aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}>
                        {show ? "Ocultar" : "Mostrar"}
                    </button>
                </div>

                {/* Recordatorio */}
                <label className="mt-4 inline-flex select-none items-center gap-2">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                    <span className="text-sm text-gray-700">Recordarme en este dispositivo</span>

                </label>
                <label className="mt-4 flex select-none items-center gap-2 mx-auto">
                    <Link href="/ForgotPass" className="text-sm font-semibold text-orange-500 hover:text-black">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </label>

                {/* Estados */}
                {status === "error" && (
                    <p className="mt-3 text-sm text-red-600">{errorMsg || "Error al iniciar sesión."}</p>
                )}
                {status === "correcto" && (
                    <p className="mt-3 text-sm text-green-600">¡Sesión iniciada (mock)!</p>
                )}

                {/* Submit */}
                <button type="submit" disabled={status === "enviado"} className="mt-5 w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-60">
                    {status === "enviado" ? "Entrando…" : "Entrar"}
                </button>

                {/* Division */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-500">O</span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="flex items-center justify-center">
                    <AuthSocialButtons />

                </div>

                {/* Division vacia */}
                <div className="my-6 flex items-center gap-4">
                </div>

                <div className="my-6 mx-auto gap-4">
                    {/* Links secundarios */}
                    <p className="text-center text-base text-gray-600">
                        ¿No tienes cuenta?{" "}
                        <Link href="/Register" className="font-semibold text-orange-500 hover:text-black">
                            Unete o Registrate aqui
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
