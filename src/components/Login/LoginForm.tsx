"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthSocialButtons from "./AuthSocialButtons";
import { useAuth } from "@/context/authcontext";
import { login as apiLogin } from "@/lib/auth/auth.api";
import { UserProfile } from "@/lib/types/user";
import { getUserByEmail } from "@/lib/users/profile.api";

type Props = {
    title?: string;
    subtitle?: string;
};

export default function LoginForm({
    title = "Iniciar sesión",
    subtitle = "Bienvenido de vuelta",
}: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<"idle" | "enviando" | "ok" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();
    const { setUser } = useAuth();

    const validate = () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ingresa un correo válido.";
        if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres."; // ✅ match backend
        return null;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        const v = validate();
        if (v) {
            setErrorMsg(v);
            setStatus("error");
            return;
        }

        try {
            setStatus("enviando");

            // 1) login (ya persiste la sesión internamente)
            const { token, fullName, role, plan } = await apiLogin(email, password);

            // 2) perfil extra (opcional)
            let p: UserProfile | null = null;
            try { p = await getUserByEmail(email); } catch { p = null; }

            // 3) actualizar tu auth-context
            const session = {
                token,
                fullName: p?.fullName || fullName,
                role: p?.role || role,
                plan: p?.plan || plan,
                email: p?.email || email,
                phone: p?.phone,
                rut: p?.rut,
                username: p?.userName,
                birthDate: p?.birthDate,
            };
            setUser(session);

            setStatus("ok");
            router.push("/events");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "No se pudo iniciar sesión. Intenta nuevamente.";
            setErrorMsg(msg);
            setStatus("error");
        }
    };


    return (
        <div className="w-full max-w-lg">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            </div>

            <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" aria-busy={status === "enviando"}>
                {/* Email */}
                <label className="mb-1 block text-sm font-medium text-gray-700">Correo</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); setErrorMsg(""); }}
                    placeholder="tucorreo@gmail.com"
                    className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    autoComplete="email"
                    required
                />

                {/* Contraseña */}
                <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                </div>
                <div className="relative">
                    <input
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setStatus("idle"); setErrorMsg(""); }}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                        autoComplete="current-password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 text-xs font-semibold text-gray-600 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {show ? "Ocultar" : "Mostrar"}
                    </button>
                </div>

                {/* Recordarme */}
                <label className="mt-4 inline-flex select-none items-center gap-2">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Recordarme en este dispositivo</span>
                </label>

                <div className="mt-2">
                    <Link href="/ForgotPass" className="text-sm font-semibold text-orange-500 hover:text-black">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                {/* Estados */}
                {status === "error" && <p className="mt-3 text-sm text-red-600">{errorMsg || "Error al iniciar sesión."}</p>}
                {status === "ok" && <p className="mt-3 text-sm text-green-500">¡Sesión iniciada!</p>}

                {/* Enviar */}
                <button
                    type="submit"
                    disabled={status === "enviando"}
                    className="mt-5 w-full rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-60"
                >
                    {status === "enviando" ? "Entrando…" : "Entrar"}
                </button>

                {/* separador */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-500">O</span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Social */}
                <div className="flex items-center justify-center">
                    <AuthSocialButtons />
                </div>

                <div className="my-6" />

                {/* Link registro */}
                <p className="text-center text-base text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link href="/Register" className="font-semibold text-orange-500 hover:text-black">
                        Únete o regístrate aquí
                    </Link>
                </p>
            </form>
        </div>
    );
}
