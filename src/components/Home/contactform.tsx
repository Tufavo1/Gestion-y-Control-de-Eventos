"use client";

import { useState } from "react";

type Formcontacto = {
    eventId?: string | number;
    eventTitle?: string;
    defaultSubject?: string;

    onSubmitMock?: (data: {
        name: string;
        email: string;
        subject: string;
        message: string;
        eventId?: string | number;
        eventTitle?: string;
    }) => void;
    // esto es para las métricas
    stats?: { label: string; value: string; helper?: string }[];
    satisfaction?: { score: string; stars?: number; nps?: string };
    badges?: { label: string }[];
};

export default function ContactForm({
    eventId,
    eventTitle,
    defaultSubject = "",
    onSubmitMock,
    stats = [
        { label: "Clientes que confían", value: "500", helper: "empresas & equipos" },
        { label: "Eventos gestionados", value: "500+" },
        { label: "Tickets procesados", value: "1000+" },
    ],
    satisfaction = { score: "5/5", stars: 5, nps: "+72 Score" },
    badges = [{ label: "Soporte 24/7" }, { label: "Implementación rápida" }, { label: "Seguridad de datos" }, { label: "otro" }],
}: Formcontacto) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: defaultSubject,
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setStatus("idle");
        setErrorMsg("");
    };

    const validate = () => {
        if (!form.name.trim()) return "Ingresa tu nombre.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Correo inválido.";
        if (!form.message.trim() || form.message.trim().length < 10)
            return "El mensaje debe tener al menos 10 caracteres.";
        return null;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const v = validate();
        if (v) {
            setErrorMsg(v);
            setStatus("error");
            return;
        }
        // aqui se tiene que cambiar a backend mas adelante
        setStatus("sending");
        setTimeout(() => {
            try {
                onSubmitMock?.({
                    ...form,
                    eventId,
                    eventTitle,
                });
                setStatus("ok");
                // Para limpiar el formulario
                setForm({ name: "", email: "", subject: defaultSubject, message: "" });
            } catch {
                setStatus("error");
                setErrorMsg("No se pudo simular el envio.");
            }
        }, 800);
    };

    return (
        <section className="bg-gray-100 py-12">
            <div className="mx-auto max-w-7xl px-4">
                {/* titulo*/}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-black">¿Quieres más información?</h2>
                    <p className="mt-2 text-gray-600">
                        Completa el formulario y nos pondremos en contacto contigo.
                    </p>
                </div>

                {/* GRID 2 */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Columna izquierda efecto espejo */}
                    <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" aria-busy={status === "sending"}>
                        {/* titulo del formulario */}
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Contacto</h3>
                            {eventTitle && (
                                <p className="mt-1 text-sm text-gray-600">
                                    Sobre el evento:{" "}
                                    <span className="font-medium text-gray-900">{eventTitle}</span>
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input name="name" value={form.name} onChange={onChange} placeholder="Tu nombre" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" required />
                            </div>

                            <div className="sm:col-span-1">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Correo
                                </label>
                                <input name="email" type="email" value={form.email} onChange={onChange} placeholder="tucorreo@ejemplo.com" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" required />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Asunto
                                </label>
                                <select name="subject" value={form.subject} onChange={onChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="">Selecciona un asunto</option>
                                    <option value="Consulta general">Consulta general</option>
                                    <option value="Entradas y precios">Entradas y precios</option>
                                    <option value="Accesibilidad y ubicación">Accesibilidad y ubicación</option>
                                    <option value="Patrocinios">Patrocinios</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Mensaje
                                </label>
                                <textarea name="message" value={form.message} onChange={onChange} placeholder="Cuéntanos en qué podemos ayudarte…" rows={5} className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" required />
                            </div>
                        </div>

                        {/* Estados */}
                        {status === "error" && (
                            <p className="mt-3 text-sm text-red-600">
                                {errorMsg || "Error en el formulario."}
                            </p>
                        )}
                        {status === "ok" && (
                            <p className="mt-3 text-sm text-green-600">
                                ¡Funciona bien, pasemos al backend.
                            </p>
                        )}

                        <div className="mt-5 flex items-center gap-3">
                            <button type="submit" disabled={status === "sending"} className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-60">
                                {status === "sending" ? "Enviando…" : "Enviar"}
                            </button>
                            <p className="text-xs text-gray-500">
                                Este es un mockup. No se envía a ningún servidor.
                            </p>
                        </div>
                    </form>

                    {/* Columna derecha */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        {/* formulario derecho efecto espejo */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Reconocimiento & Confianza
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Elige una plataforma usada por miles de personas cada mes.
                            </p>
                        </div>

                        {/* Metricas de satisfaccion */}
                        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="flex items-center">
                                {[...Array(satisfaction.stars ?? 5)].map((_, i) => (
                                    <svg key={i} className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 0 0 .95-.69l1.07-3.292Z" />
                                    </svg>
                                ))}
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {satisfaction.score}
                                </div>
                                <div className="text-xs text-gray-600">Satisfacción promedio</div>
                            </div>
                            <div className="ml-auto">
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    {satisfaction.nps}
                                </span>
                            </div>
                        </div>

                        {/* metricas */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm"
                                >
                                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                                    <div className="text-xs font-medium text-gray-600">{s.label}</div>
                                    {s.helper && (
                                        <div className="mt-1 text-[11px] text-gray-500">{s.helper}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Barra progreso de objetivos */}
                        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900">
                                    Objetivo mensual de eventos
                                </span>
                                <span className="text-sm text-gray-600">82% completado</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div className="h-2 w-[82%] rounded-full bg-orange-500 transition-all" />
                            </div>
                            <p className="mt-2 text-xs text-gray-600">
                                Seguimos creciendo gracias a la comunidad. ¡Gracias por confiar!
                            </p>
                        </div>

                        {/* Badges */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {badges.map((b) => (
                                <span key={b.label} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
                                    {b.label}
                                </span>
                            ))}
                        </div>

                        {/* CTA efecto espejo */}
                        <div className="mt-6">
                            <button type="button" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:border-gray-300" onClick={() => {
                                // Esto desplaza el formulario lo centra
                                const formEl = document.querySelector<HTMLFormElement>("form[aria-busy]");
                                formEl?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}>
                                Ir al formulario
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
