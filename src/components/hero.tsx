"use client";
import { useTypewriter } from "@/hooks/useTypewriter";

export function Hero() {
    const typed = useTypewriter(["Eventos", "Viajes", "Reuniones", "Fiestas"]);
    return (
        <section className="mx-auto max-w-7xl px-4 py-12 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl" aria-live="polite" role="status">
                Tu experiencia empieza aquí, con{" "}
                <span className="text-orange-500">{typed || "\u00A0"}</span>
                <span className="ml-1 inline-block w-[1ch] animate-pulse" aria-hidden="true">|</span>
            </h1>
        </section>
    );
}
