"use client";
import { useEffect, useState } from "react";

export function useTypewriter(
    words: string[],
    opts?: { typingMs?: number; deletingMs?: number; pauseMs?: number }
) {
    const typingMs = opts?.typingMs ?? 90;
    const deletingMs = opts?.deletingMs ?? 55;
    const pauseMs = opts?.pauseMs ?? 1100;

    const [i, setI] = useState(0);
    const [txt, setTxt] = useState("");
    const [del, setDel] = useState(false);

    useEffect(() => {
        const full = words[i];
        const doneTyping = txt === full && !del;
        const doneDeleting = txt === "" && del;
        const delay = doneTyping ? pauseMs : del ? deletingMs : typingMs;

        const t = setTimeout(() => {
            if (doneTyping) setDel(true);
            else if (doneDeleting) { setDel(false); setI((x) => (x + 1) % words.length); }
            else setTxt((prev) => del ? full.slice(0, prev.length - 1) : full.slice(0, prev.length + 1));
        }, delay);

        return () => clearTimeout(t);
    }, [txt, del, i, words, typingMs, deletingMs, pauseMs]);

    useEffect(() => { setTxt(""); }, [i]);

    return txt;
}
