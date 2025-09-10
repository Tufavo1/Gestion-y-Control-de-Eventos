export type UnknownRecord = Record<string, unknown>;

export function isObject(x: unknown): x is UnknownRecord {
    return typeof x === "object" && x !== null;
}
export function asString(v: unknown, fallback = ""): string {
    return typeof v === "string" ? v : v == null ? fallback : String(v);
}
export function asNumber(v: unknown, fallback = 0): number {
    if (typeof v === "number") return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}
export function asId(v: unknown): string | number {
    if (typeof v === "string" || typeof v === "number") return v;
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto.randomUUID() as string)
        : Math.random().toString(36).slice(2);
}
export const normalizeRut = (rut: string) => rut.replace(/[^0-9kK]/g, "").toUpperCase();
