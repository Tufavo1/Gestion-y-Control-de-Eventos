"use client";

import { useMemo, useState } from "react";
import AuthSocialButtons from "./AuthSocialButtons";

// Utilidades
const SPECIAL_RE = /[^A-Za-z0-9]/;
const UPPER_RE = /[A-Z]/;

function normalizeRut(rut: string) {
    return rut.replace(/[^0-9kK.\-]/g, "").toUpperCase();
}

function formatRut(input: string) {
    // Esto limpiara, separara el DV y re formateara con puntos en cada 3 y guion al final
    const clean = normalizeRut(input).replace(/\./g, "");
    const noDash = clean.replace(/-/g, "");
    if (!noDash) return "";

    const body = noDash.slice(0, -1);
    const dv = noDash.slice(-1);

    // Aqui agregara los puntos al body
    const withDots = body
        .split("")
        .reverse()
        .join("")
        .replace(/(\d{3})(?=\d)/g, "$1.")
        .split("")
        .reverse()
        .join("");

    let formatted = body ? `${withDots}-${dv}` : dv;

    // Esto formateara a un max de 12 caracteres
    if (formatted.length > 12) formatted = formatted.slice(0, 12);
    return formatted;
}


function computeRutDV(bodyDigits: string) {
    let sum = 0;
    let multiplier = 2;
    for (let i = bodyDigits.length - 1; i >= 0; i--) {
        sum += parseInt(bodyDigits[i], 10) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const rest = 11 - (sum % 11);
    if (rest === 11) return "0";
    if (rest === 10) return "K";
    return String(rest);
}

function isValidRut(formattedRut: string) {
    // Esto quita los puntos pero deja el guion
    const clean = normalizeRut(formattedRut).replace(/\./g, "");
    // Aqui se validara si el patron del RUT esta completo
    const m = clean.match(/^(\d{7,8})-([\dK])$/);
    // Si el patron esta incompleto que muestre un error
    if (!m) return null;

    const [, body, dv] = m;
    const expected = computeRutDV(body);

    return expected === dv.toUpperCase();
}

//Esta funcion se encargara de saber si al colocar la fecha de nacimiento es >= 18 
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
    //Esto se encargara que cumpla con los 12 digitos
    const digits = p.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 12;
}

export default function RegisterForm() {
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
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValid) return;
        // Proximo aqui se empezara con el backend
        console.log("Registro mockup:", {
            fullName,
            rut: formatRut(rut),
            birth,
            phone,
            username,
            email,
        });
        alert("Cuenta creada mockup.");
        resetForm();
    };

    return (
        <div className="flex min-h-screen items-center py-1">
            <div className="w-full max-w-5xl rounded-2xl border px-30 border-gray-200 bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Crear cuenta</h2>

                <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
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
                            RUT chileno <span className="text-gray-400 text-xs">(20.995.123-K)</span>
                        </label>
                        <input
                            value={formatRut(rut)}
                            onChange={(e) => {
                                // permitira solo dígitos, K/k y separadores, se formatearan auto y sera de 12 max
                                const allowed = normalizeRut(e.target.value);
                                const formatted = formatRut(allowed);
                                setRut(formatted);
                            }}
                            placeholder="20.995.123-K"
                            maxLength={12}
                            className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${
                                // - null => patron incompleto, no marcamos error aún
                                // - true => válido
                                // - false => inválido se mostrara en rojo
                                isValidRut(rut) === false
                                    ? "border-red-300 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-orange-500"
                                }`}
                            inputMode="text"
                        />
                        {isValidRut(rut) === false && (
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
                            className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${adult || birth === ""
                                ? "border-gray-300 focus:ring-orange-500"
                                : "border-red-300 focus:ring-red-500"
                                }`}
                            required
                        />
                        {birth && !adult && (
                            <p className="mt-1 text-xs text-red-500">
                                No puedes registrarte porque eres menor de 18 años y se infringen nuestras políticas.
                            </p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Número de teléfono</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+56 9 1234 5678"
                            className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 ${validPhone || phone === ""
                                ? "border-gray-300 focus:ring-orange-500"
                                : "border-red-300 focus:ring-red-500"
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

                        {/* Checklist */}
                        <ul className="mt-2 grid gap-1 text-xs">
                            <li className={`font-medium ${passwordHas8 ? "text-green-600" : "text-red-600"}`}>
                                {passwordHas8 ? "✔" : "✖"} Al menos 8 caracteres
                            </li>
                            <li className={`font-medium ${passwordHasUpper ? "text-green-600" : "text-red-600"}`}>
                                {passwordHasUpper ? "✔" : "✖"} Una mayúscula
                            </li>
                            <li
                                className={`font-medium ${passwordHasSpecial ? "text-green-600" : "text-red-600"
                                    }`}
                            >
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
                                <a href="/legal/terminos" className="font-semibold text-orange-600 hover:text-orange-700">
                                    Términos y Condiciones
                                </a>{" "}
                                y la{" "}
                                <a href="/legal/privacidad" className="font-semibold text-orange-600 hover:text-orange-700">
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
                        >
                            Limpiar
                        </button>

                        <button
                            type="submit"
                            disabled={!formValid}
                            className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Crear cuenta
                        </button>
                    </div>
                    {/* Linea de division */}
                    <div className="col-span-full my-1 flex w-full items-center">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="px-4 text-xs font-medium text-gray-500">O</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Botones sociales debajo */}
                    <div className="col-span-full flex w-full justify-center">
                        <AuthSocialButtons />
                    </div>
                </form>
            </div>
        </div>
    );
}
