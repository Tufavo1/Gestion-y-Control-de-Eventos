"use client";
import { useEffect, useRef, useState } from "react";

export function useCarousel(length: number, autoMs = 5000) {
    const [index, setIndex] = useState(0);
    const timer = useRef<number | null>(null);
    const paused = useRef(false);

    const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
    const tick = () => {
        clear();
        if (!paused.current) {
            timer.current = window.setTimeout(() => setIndex((i) => (i + 1) % length), autoMs);
        }
    };

    useEffect(() => {
        const onVis = () => { paused.current = document.visibilityState === "hidden"; tick(); };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    useEffect(() => { tick(); return clear; }, [index, length, autoMs]);

    return {
        index,
        goPrev: () => setIndex((i) => (i - 1 + length) % length),
        goNext: () => setIndex((i) => (i + 1) % length),
        goTo: (i: number) => setIndex(((i % length) + length) % length),
        pause: () => { paused.current = true; clear(); },
        resume: () => { paused.current = false; tick(); },
    };
}
