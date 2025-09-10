"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthSocialButtons from "./AuthSocialButtons";
import { registerUser, login } from "@/lib/api";
import PlanesSection from "@/components/princing/plansections";

// ===== utilidades especiales =====
const SPECIAL_RE = /[^A-Za-z0-9]/;
const UPPER_RE = /[A-Z]/;

/* =========================
   RUT helpers (auto DV + formato)
========================= */
function normalizeRut(raw: string) {
    // solo dígitos y K/k; mayúscula
    return raw.replace(/[^0-9kK]/g, "").toUpperCase();
}

function computeRutDV(bodyDigits: string) {
    let sum = 0, mul = 2;
    for (let i = bodyDigits.length - 1; i >= 0; i--) {
        sum += parseInt(bodyDigits[i], 10) * mul;
        mul = mul === 7 ? 2 : mul + 1;
    }
    const rest = 11 - (sum % 11);
    if (rest === 11) return "0";
    if (rest === 10) return "K";
    return String(rest);
}

/** Acepta:
 *  - "12345678-9"
 *  - "123456789"
 *  - "12345678"  (auto-DV)
 */
function parseRutFlexible(input: string) {
    const clean = normalizeRut(input);
    const m = clean.match(/^(\d{1,8})(?:-?([0-9K]))?$/i);
    if (!m) return null;
    const body = m[1];
    const dv = (m[2] ?? computeRutDV(body)).toUpperCase();
    return { body, dv };
}

function isValidRut(input: string) {
    const p = parseRutFlexible(input);
    if (!p) return false;
    return p.dv === computeRutDV(p.body);
}

function formatRutPretty(input: string) {
    const p = parseRutFlexible(input);
    if (!p) return input;
    const withDots = p.body
        .split("").reverse().join("")
        .replace(/(\d{3})(?=\d)/g, "$1.")
        .split("").reverse().join("");
    return `${withDots}-${p.dv}`;
}

/** Para enviar al backend: ########DV (sin puntos ni guion) */
function rutForApi(input: string) {
    const p = parseRutFlexible(input);
    if (!p) return "";
    return `${p.body}${p.dv}`.toUpperCase();
}

/* =========================
   Otras validaciones
========================= */
function isAdult(dateStr: string) {
    if (!dateStr) return false;
    const dob = new Date(dateStr + "T00:00:00");
    if (Number.isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 18;
}

function emailValid(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function phoneValid(p: string) {
    const digits = p.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 12;
}

type PlanId = "free" | "basic" | "premium" | "gold";

export default function RegisterForm() {
    // ===== Paso (1: form, 2: planes, 3: confirmación free) =====
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

    // ===== estado del formulario =====
    const [fullName, setFullName] = useState("");
    const [rut, setRut] = useState("");
    const [birth, setBirth] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [email2, setEmail2] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [consent, setConsent] = useState(false);

    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    const passwordHas8 = password.length >= 8;
    const passwordHasUpper = UPPER_RE.test(password);
    const passwordHasSpecial = SPECIAL_RE.test(password);

    const passwordMatch = password.length > 0 && password2.length > 0 && password === password2;
    const emailsMatch = email.length > 0 && email2.length > 0 && email === email2;

    const validRut = useMemo(() => isValidRut(rut), [rut]);
    const adult = useMemo(() => isAdult(birth), [birth]);
    const validEmail = useMemo(() => emailValid(email), [email]);
    const validEmail2 = useMemo(() => emailValid(email2), [email2]);
    const validPhone = useMemo(() => phoneValid(phone), [phone]);

    const formValid =
        fullName.trim().length >= 3 &&
        validRut &&
        adult &&
        validPhone &&
        username.trim().length >= 3 &&
        validEmail &&
        validEmail2 &&
        emailsMatch &&
        passwordHas8 &&
        passwordHasUpper &&
        passwordHasSpecial &&
        passwordMatch &&
        consent;

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const router = useRouter();

    const resetForm = () => {
        setFullName("");
        setRut("");
        setBirth("");
        setPhone("");
        setUsername("");
        setEmail("");
        setEmail2("");
        setPassword("");
        setPassword2("");
        setConsent(false);
        setShowPass(false);
        setShowPass2(false);
        setSelectedPlan(null);
        setStep(1);
    };

    // ===== Paso 1: avanzar a planes =====
    function handleFormNext(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (formValid && !loading) setStep(2);
    }

    // ===== Registro final para plan FREE =====
    async function finalizeRegistration(plan: PlanId) {
        try {
            setLoading(true);
            setMsg(null);

            // 1) crear cuenta (enviamos el plan comercial y RUT normalizado)
            await registerUser({
                fullName,
                rut: rutForApi(rut),         // ✅ normalizado con DV
                birthDate: birth || null,
                phoneNumber: phone,
                userName: username,
                email,
                password,
                plan,                        // ✅ importante: enviar plan, NO role
            });

            // 2) login
            await login(email, password);

            setMsg("Cuenta creada. ¡Bienvenido!");
            router.push("/Profile");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setMsg(message);
            setStep(1);
        } finally {
            setLoading(false);
        }
    }

    // ===== Elegir plan en Paso 2 (pagados crean checkout) =====
    async function handlePlanSelect(plan: PlanId) {
        setSelectedPlan(plan);

        if (plan === "free") {
            setStep(3);
            return;
        }

        // Plan pagado: registra + login + select-plan + checkout
        try {
            setLoading(true);
            setMsg(null);

            // 1) crear cuenta (plan + RUT normalizado)
            await registerUser({
                fullName,
                rut: rutForApi(rut),         // ✅
                birthDate: birth || null,
                phoneNumber: phone,
                userName: username,
                email,
                password,
                plan,                        // ✅
            });

            // 2) login
            await login(email, password);

            // 3) selecciona plan y crea checkout (tu API interna de Next)
            await fetch("/api/billing/select-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: plan }),
            });

            const resp = await fetch("/api/billing/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: plan }),
            });
            if (!resp.ok) throw new Error("No se pudo iniciar el checkout");

            const { checkoutUrl } = (await resp.json()) as { checkoutUrl: string };
            router.push(checkoutUrl);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setMsg(message);
            setStep(1);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center py-1">
            <div className="w-full max-w-5xl rounded-2xl border px-30 border-gray-200 bg-white p-8 shadow-lg">
                {/* progreso */}
                <div className="mb-6 flex items-center justify-center gap-3 text-sm font-semibold">
                    <span className={step === 1 ? "text-orange-600" : "text-gray-400"}>1: Formulario</span>
                    <span>•</span>
                    <span className={step === 2 ? "text-orange-600" : "text-gray-400"}>2: Elige tu plan</span>
                    {step === 3 && (
                        <>
                            <span>•</span>
                            <span className="text-orange-600">3: Confirmación</span>
                        </>
                    )}
                </div>

                {/* mensajes */}
                {msg && <p className="mb-4 text-center text-sm text-gray-700">{msg}</p>}

                {/* ===== Paso 1: Formulario ===== */}
                {step === 1 && (
                    <>
                        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">Crear cuenta</h2>
                        <form onSubmit={handleFormNext} className="grid gap-5 sm:grid-cols-2">
                            {/* Nombre completo */}
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre completo</label>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Ej: Juan Pérez Soto"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            {/* RUT */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    RUT chileno <span className="text-gray-400 text-xs">(20.995.186-K)</span>
                                </label>
                                <input
                                    value={formatRutPretty(rut)}                // 👈 siempre pretty
                                    onChange={(e) => setRut(e.target.value)}    // 👈 guardas lo escrito
                                    placeholder="20.995.186-K"
                                    maxLength={12}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${isValidRut(rut) === false
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-orange-500"
                                        }`}
                                    inputMode="text"
                                />
                                {isValidRut(rut) === false && rut.trim() !== "" && (
                                    <p className="mt-1 text-xs text-red-600">RUT inválido. Revisa dígito verificador.</p>
                                )}
                            </div>

                            {/* Fecha de nacimiento */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                                <input
                                    type="date"
                                    value={birth}
                                    onChange={(e) => setBirth(e.target.value)}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${adult || birth === "" ? "border-gray-300 focus:ring-orange-500" : "border-red-300 focus:ring-red-500"
                                        }`}
                                    required
                                />
                                {birth && !adult && (
                                    <p className="mt-1 text-xs text-red-500">No puedes registrarte porque eres menor de 18 años.</p>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Número de teléfono</label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+56 9 1234 5678"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${validPhone || phone === "" ? "border-gray-300 focus:ring-orange-500" : "border-red-300 focus:ring-red-500"
                                        }`}
                                    inputMode="tel"
                                    required
                                />
                                {phone && !validPhone && (
                                    <p className="mt-1 text-xs text-red-600">Ingresa un teléfono válido (9 a 12 dígitos).</p>
                                )}
                            </div>

                            {/* Usuario */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre de usuario</label>
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="tu_usuario"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Correo</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tucorreo@ejemplo.com"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${(validEmail && (emailsMatch || email2 === "")) || email === ""
                                            ? "border-gray-300 focus:ring-orange-500"
                                            : "border-red-300 focus:ring-red-500"
                                        }`}
                                    required
                                />
                            </div>

                            {/* Confirmar Email */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Confirmar correo</label>
                                <input
                                    type="email"
                                    value={email2}
                                    onChange={(e) => setEmail2(e.target.value)}
                                    placeholder="tucorreo@ejemplo.com"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${(validEmail2 && (emailsMatch || email === "")) || email2 === ""
                                            ? "border-gray-300 focus:ring-orange-500"
                                            : "border-red-300 focus:ring-red-500"
                                        }`}
                                    required
                                />
                                {email && email2 && !emailsMatch && (
                                    <p className="mt-1 text-xs text-red-600">Los correos no coinciden.</p>
                                )}
                                {email && email2 && emailsMatch && (
                                    <p className="mt-1 text-xs text-green-600">Los correos coinciden correctamente.</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 text-sm shadow-sm focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((s) => !s)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 text-xs font-semibold text-gray-600 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                                    >
                                        {showPass ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>

                                <ul className="mt-2 grid gap-1 text-xs">
                                    <li className={`font-medium ${passwordHas8 ? "text-green-600" : "text-red-600"}`}>
                                        {passwordHas8 ? "✔" : "✖"} Al menos 8 caracteres
                                    </li>
                                    <li className={`font-medium ${passwordHasUpper ? "text-green-600" : "text-red-600"}`}>
                                        {passwordHasUpper ? "✔" : "✖"} Una mayúscula
                                    </li>
                                    <li className={`font-medium ${passwordHasSpecial ? "text-green-600" : "text-red-600"}`}>
                                        {passwordHasSpecial ? "✔" : "✖"} Un carácter especial
                                    </li>
                                </ul>
                            </div>

                            {/* Confirmar Password */}
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPass2 ? "text" : "password"}
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        placeholder="Repite tu contraseña"
                                        className={`w-full rounded-lg border px-3 py-2 pr-16 text-sm shadow-sm focus:ring-2 ${(password2 === "" && password === "") || passwordMatch
                                                ? "border-gray-300 focus:ring-orange-500"
                                                : "border-red-300 focus:ring-red-500"
                                            }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass2((s) => !s)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 text-xs font-semibold text-gray-600 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                                    >
                                        {showPass2 ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                                {password && password2 && !passwordMatch && (
                                    <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden.</p>
                                )}
                                {password && password2 && passwordMatch && (
                                    <p className="mt-1 text-xs text-green-600">Las contraseñas coinciden correctamente.</p>
                                )}
                            </div>

                            {/* Consentimiento */}
                            <div className="sm:col-span-2">
                                <label className="inline-flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        checked={consent}
                                        onChange={(e) => setConsent(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Acepto los{" "}
                                        <a href="/legal/terminos" className="font-semibold text-orange-500 hover:text-orange-400">
                                            Términos y Condiciones
                                        </a>{" "}
                                        y la{" "}
                                        <a href="/legal/privacidad" className="font-semibold text-orange-500 hover:text-orange-400">
                                            Política de Privacidad
                                        </a>
                                        .
                                    </span>
                                </label>
                            </div>

                            {/* Acciones */}
                            <div className="sm:col-span-2 flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                                    disabled={loading}
                                >
                                    Limpiar
                                </button>

                                <button
                                    type="submit"
                                    disabled={!formValid || loading}
                                    className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "..." : "Siguiente"}
                                </button>
                            </div>

                            {/* división */}
                            <div className="col-span-full my-1 flex w-full items-center">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="px-4 text-xs font-medium text-gray-500">O</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {/* Botones sociales bottom */}
                            <div className="col-span-full flex w-full justify-center">
                                <AuthSocialButtons />
                            </div>
                        </form>
                    </>
                )}

                {/* ===== Paso 2: Planes ===== */}
                {step === 2 && (
                    <div>
                        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">Elige tu plan</h2>
                        <p className="mb-4 text-center text-sm text-gray-600">
                            Selecciona un plan para finalizar tu registro.
                        </p>

                        <PlanesSection
                            mode="onboarding"
                            onSelect={(planId) => {
                                if (!loading) void handlePlanSelect(planId);
                            }}
                        />

                        <div className="mt-4 flex justify-center">
                            <button
                                className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                ← Volver al formulario
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== Paso 3: Confirmación Free ===== */}
                {step === 3 && selectedPlan === "free" && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">¡Has elegido el plan Free!</h2>
                        <p className="text-center text-gray-600 mb-6">
                            Revisa tus datos y confirma para crear tu cuenta.
                        </p>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-gray-500">Nombre completo</dt>
                                    <dd className="font-medium text-gray-900">{fullName}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">Usuario</dt>
                                    <dd className="font-medium text-gray-900">{username}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">Correo</dt>
                                    <dd className="font-medium text-gray-900">{email}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">Teléfono</dt>
                                    <dd className="font-medium text-gray-900">{phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">RUT</dt>
                                    <dd className="font-medium text-gray-900">{formatRutPretty(rut)}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">Fecha de nacimiento</dt>
                                    <dd className="font-medium text-gray-900">{birth}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">Plan seleccionado</dt>
                                    <dd className="font-medium text-gray-900">Free</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">Rol</dt>
                                    <dd className="font-medium text-gray-900">user (por defecto)</dd>
                                </div>
                            </dl>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition disabled:opacity-60"
                                    onClick={() => finalizeRegistration("free")}
                                    disabled={loading}
                                >
                                    {loading ? "Creando..." : "Registrarse"}
                                </button>

                                <button
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                    onClick={() => setStep(2)}
                                    disabled={loading}
                                >
                                    Cambiar plan
                                </button>

                                <button
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                >
                                    Editar datos
                                </button>
                            </div>

                            <p className="mt-3 text-xs text-gray-500">
                                * En el plan Free no se solicitará tarjeta. Podrás cambiarte a un
                                plan de pago cuando quieras desde Configuración → Suscripción.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
