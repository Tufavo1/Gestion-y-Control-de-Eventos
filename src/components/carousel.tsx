"use client";
import Image from "next/image";
import { useCarousel } from "@/hooks/useCarousel";

type Slide = { src: string; title: string; text: string; };

export function Carousel({ slides, autoMs = 5000 }: { slides: Slide[]; autoMs?: number }) {
    const { index, goPrev, goNext, goTo, pause, resume } = useCarousel(slides.length, autoMs);

    return (
        <section className="mx-auto max-w-7xl px-2" onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}>
            <div
                className="relative overflow-hidden rounded-xl ring-1 ring-blue-200"
                role="region" aria-roledescription="Carrusel" aria-label="Destacados"
                tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowLeft") goPrev(); if (e.key === "ArrowRight") goNext(); }}
            >
                <div className="relative block aspect-[16/6] w-full md:aspect-[16/5]">
                    {slides.map((s, i) => (
                        <div key={i} className={`absolute inset-0 transition-opacity duration-300 ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
                            <Image src={s.src} alt={s.title} fill sizes="(min-width: 768px) 1024px, 100vw" className="object-cover" priority={i === 0} />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-black/0 p-6 text-white">
                                <h5 className="text-lg font-semibold">{s.title}</h5>
                                <p className="text-sm opacity-90">{s.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button type="button" onClick={goPrev} aria-label="Anterior" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 ring-1 ring-gray-300 hover:bg-white">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.293 15.707 6.586 10l5.707-5.707L14 6l-4 4 4 4-1.707 1.707z" /></svg>
                </button>
                <button type="button" onClick={goNext} aria-label="Siguiente" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 ring-1 ring-gray-300 hover:bg-white">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="m7.707 4.293 5.707 5.707-5.707 5.707L6 14l4-4-4-4 1.707-1.707z" /></svg>
                </button>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                    {slides.map((_, i) => (
                        <button key={i} type="button" aria-label={`Ir al slide ${i + 1}`} aria-current={i === index} onClick={() => goTo(i)} className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`} />
                    ))}
                </div>
            </div>
        </section>
    );
}
