// components/profile/admin/utils/money.tsx
export function formatCLP(value: number, { assumeCents = true }: { assumeCents?: boolean } = {}) {
    const n = Number.isFinite(value) ? value : 0;
    const amount = assumeCents ? Math.round(n / 100) : Math.round(n);
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(amount);
}

export const fromCents = (cents: number) =>
    Math.round((Number.isFinite(cents) ? cents : 0) / 100);

export const toCents = (pesos: number) =>
    Math.max(0, Math.round(Number.isFinite(pesos) ? pesos : 0) * 100);
