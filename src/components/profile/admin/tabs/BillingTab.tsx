"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCLP } from "@/components/profile/admin/utils/money";
import { CurrentUser, SectionCard } from "../DesignSystem";
import RequireFeature from "../../../guards/RequireFeature";
import { PlanDefinition, UpsertPlanPayload } from "@/lib/types/plans";
import { adminDeletePlan, adminListPlans, adminUpsertPlan } from "@/lib/plans/plans.api";

/** ===== Helpers UI ===== */
function clsx(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}
const PERIODS = ["mes", "año", "semana", "7 días"] as const;
type Period = typeof PERIODS[number];

function linesToArray(s: string): string[] {
    return s
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
}
function arrayToLines(a: string[] | undefined): string {
    return (a ?? []).join("\n");
}
function intFromInput(v: string): number | null {
    if (v.toLowerCase() === "ilimitado") return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}
function displayLimit(n: number | null): string {
    return n == null ? "Ilimitados" : `${n}/mes`;
}

/** ===== Modal de edición ===== */
type PlanEditing = Omit<PlanDefinition, "updatedAt">;

function PlanEditorModal({
    plan,
    onClose,
    onSave,
    onDelete,
    isNew,
}: {
    plan: PlanEditing;
    onClose: () => void;
    onSave: (p: UpsertPlanPayload) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    isNew: boolean;
}) {
    const [draft, setDraft] = useState<PlanEditing>(plan);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const benefitsText = useMemo(() => arrayToLines(draft.benefits), [draft.benefits]);
    const limitationsText = useMemo(() => arrayToLines(draft.limitations), [draft.limitations]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setSaving(true);
        try {
            const payload: UpsertPlanPayload = {
                ...draft,
                id: (draft.id || draft.name || "").toLowerCase() as PlanEditing["id"],
                name: draft.name?.trim() ?? "",
                description: draft.description?.trim() ?? "",
                period: (draft.period as Period) ?? "/mes",
                priceCents: Number.isFinite(draft.priceCents) ? Number(draft.priceCents) : 0, // CLP enteros
                canCreateEvents: draft.canCreateEvents,
                canManageEvents: draft.canManageEvents,
                badge: draft.badge ?? null,
                benefits: draft.benefits ?? [],
                limitations: draft.limitations ?? [],
                highlight: !!draft.highlight,
            };
            await onSave(payload);
            onClose();
        } catch (e) {
            setErr(e instanceof Error ? e.message : "No se pudo guardar el plan.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
            role="dialog"
            aria-modal="true"
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl translate-y-0 rounded-2xl bg-white p-6 shadow-2xl sm:mx-auto">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        {isNew ? "Nuevo plan" : `Editar plan: ${plan.name}`}
                    </h3>
                    {!isNew && (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-neutral-600">
                            id: <b>{plan.id}</b>
                        </span>
                    )}
                </div>

                <form onSubmit={handleSave} className="grid gap-3 sm:grid-cols-2">
                    {/* ID (editable solo si es nuevo) */}
                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">ID (slug)</div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder="free | basic | premium | gold"
                            value={draft.id}
                            disabled={!isNew}
                            onChange={(e) =>
                                setDraft((d) => ({ ...d, id: e.target.value as PlanEditing["id"] }))
                            }
                        />
                    </label>

                    {/* Nombre */}
                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Título del plan</div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder="Ej: Premium"
                            value={draft.name}
                            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                        />
                    </label>

                    {/* Badge */}
                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Badge (opcional)</div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder='Ej: "Más popular"'
                            value={draft.badge ?? ""}
                            onChange={(e) => setDraft((d) => ({ ...d, badge: e.target.value || null }))}
                        />
                    </label>

                    {/* Highlight */}
                    <label className="sm:col-span-1 text-sm flex items-center gap-2 mt-6">
                        <input
                            type="checkbox"
                            checked={!!draft.highlight}
                            onChange={(e) => setDraft((d) => ({ ...d, highlight: e.target.checked }))}
                        />
                        <span>Marcar como “Más popular”</span>
                    </label>

                    {/* Descripción corta */}
                    <label className="sm:col-span-2 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Descripción corta</div>
                        <textarea
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder="Descripción que aparece en la card."
                            rows={3}
                            value={draft.description}
                            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                        />
                    </label>

                    {/* Precio + Periodo */}
                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Precio (CLP enteros)</div>
                        <input
                            type="number"
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder="149900"
                            value={draft.priceCents}
                            onChange={(e) =>
                                setDraft((d) => ({ ...d, priceCents: Math.max(0, Number(e.target.value || 0)) }))
                            }
                        />
                        <div className="mt-1 text-xs text-neutral-500">
                            Se mostrará como {formatCLP(draft.priceCents, { assumeCents: false })}
                        </div>
                    </label>

                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Periodo</div>
                        <select
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={(draft.period as Period) ?? "/mes"}
                            onChange={(e) => setDraft((d) => ({ ...d, period: e.target.value as Period }))}
                        >
                            {PERIODS.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Límites */}
                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">
                            Crear eventos / mes (0, 5, “ilimitado”)
                        </div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder="0 | 5 | ilimitado"
                            value={draft.canCreateEvents == null ? "ilimitado" : String(draft.canCreateEvents)}
                            onChange={(e) =>
                                setDraft((d) => ({ ...d, canCreateEvents: intFromInput(e.target.value) }))
                            }
                        />
                    </label>

                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">
                            Gestionar eventos / mes (0, 5, “ilimitado”)
                        </div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder="0 | 5 | ilimitado"
                            value={draft.canManageEvents == null ? "ilimitado" : String(draft.canManageEvents)}
                            onChange={(e) =>
                                setDraft((d) => ({ ...d, canManageEvents: intFromInput(e.target.value) }))
                            }
                        />
                    </label>

                    {/* Saber más: beneficios / limitaciones */}
                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Beneficios (“Saber más”)</div>
                        <textarea
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder="Una línea por beneficio"
                            rows={4}
                            defaultValue={benefitsText}
                            onChange={(e) => setDraft((d) => ({ ...d, benefits: linesToArray(e.target.value) }))}
                        />
                    </label>

                    <label className="sm:col-span-1 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Limitaciones (opcional)</div>
                        <textarea
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            placeholder="Una línea por limitación"
                            rows={4}
                            defaultValue={limitationsText}
                            onChange={(e) =>
                                setDraft((d) => ({ ...d, limitations: linesToArray(e.target.value) }))
                            }
                        />
                    </label>

                    {/* Acciones */}
                    {err && (
                        <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                            {err}
                        </div>
                    )}

                    <div className="sm:col-span-2 mt-2 flex flex-wrap justify-between gap-2">
                        {!isNew ? (
                            <button
                                type="button"
                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                                onClick={() => onDelete(draft.id)}
                                disabled={saving}
                            >
                                Eliminar plan
                            </button>
                        ) : (
                            <span />
                        )}

                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="rounded-xl border px-3 py-1.5 text-sm"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={clsx(
                                    "rounded-xl px-3 py-1.5 text-sm text-white",
                                    "bg-orange-600 hover:bg-orange-700"
                                )}
                                disabled={saving}
                            >
                                {saving ? "Guardando…" : "Guardar cambios"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

/** ===== Tab principal ===== */
export default function BillingTab({ user }: { user: CurrentUser }) {
    const isSuper = user.role === "superadmin";

    const [plans, setPlans] = useState<PlanDefinition[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [editing, setEditing] = useState<PlanEditing | null>(null);

    async function load() {
        try {
            setLoading(true);
            setErr(null);
            const data = await adminListPlans();
            setPlans(data);
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Error cargando planes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Solo mostramos CRUD a superadmin; si quieres permitir lectura a admin, puedes alternar a listPlans()
        load();
    }, []);

    async function savePlan(p: UpsertPlanPayload) {
        await adminUpsertPlan(p);
        setEditing(null);
        await load();
    }

    async function removePlan(id: string) {
        if (!confirm("¿Eliminar este plan?")) return;
        await adminDeletePlan(id);
        await load();
    }

    return (
        <RequireFeature currentUser={user} feature="billing.access">
            <SectionCard title="Facturación y planes" description="Administra tus planes. Click en un plan para editar.">
                {loading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-sm">
                                <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-neutral-200" />
                                <div className="mt-4 h-8 w-28 animate-pulse rounded bg-neutral-200" />
                                <div className="mt-4 space-y-2">
                                    <div className="h-3 w-44 animate-pulse rounded bg-neutral-200" />
                                    <div className="h-3 w-36 animate-pulse rounded bg-neutral-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {err && <p className="text-sm text-red-600">{err}</p>}

                {!loading && !err && (
                    <>
                        <div className="mb-4">
                            {isSuper && (
                                <button
                                    className="rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
                                    onClick={() =>
                                        setEditing({
                                            id: "" as PlanEditing["id"],
                                            name: "",
                                            priceCents: 0,
                                            period: "mes",
                                            highlight: false,
                                            badge: null,
                                            description: "",
                                            canCreateEvents: 0,
                                            canManageEvents: 0,
                                            benefits: [],
                                            limitations: [],
                                        })
                                    }
                                >
                                    + Nuevo plan
                                </button>
                            )}
                        </div>

                        {plans.length === 0 ? (
                            <div className="rounded-xl border border-neutral-200/70 bg-white p-6 text-sm text-neutral-600">
                                No hay planes disponibles.
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {plans.map((p) => {
                                    const highlighted = !!p.highlight || !!p.badge;
                                    return (
                                        <article
                                            key={p.id}
                                            className={clsx(
                                                "group relative cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md",
                                                "border-neutral-200/70",
                                                highlighted && "ring-1 ring-orange-200/60"
                                            )}
                                            onClick={() =>
                                                isSuper &&
                                                setEditing({
                                                    ...p,
                                                    badge: p.badge ?? null,
                                                    benefits: p.benefits ?? [],
                                                    limitations: p.limitations ?? [],
                                                    canCreateEvents: p.canCreateEvents ?? 0,
                                                    canManageEvents: p.canManageEvents ?? 0,
                                                })
                                            }
                                        >
                                            {(p.badge || p.highlight) && (
                                                <div className="absolute -top-3 left-4 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                                                    {p.badge ?? "Más popular"}
                                                </div>
                                            )}

                                            <header className="pr-24">
                                                <h3 className="text-lg font-semibold text-neutral-900">{p.name}</h3>
                                                <p className="mt-1 text-sm text-neutral-600">{p.description}</p>
                                            </header>

                                            <div className="mt-4">
                                                <div className="text-3xl font-extrabold tracking-tight text-orange-600">
                                                    {new Intl.NumberFormat("es-CL", {
                                                        style: "currency",
                                                        currency: "CLP",
                                                        maximumFractionDigits: 0,
                                                    }).format(p.priceCents)}
                                                    <span className="ml-1 align-middle text-xs text-neutral-500">
                                                        {p.period}
                                                    </span>
                                                </div>
                                            </div>

                                            <ul className="mt-4 space-y-1.5 text-sm text-neutral-800">
                                                <li>Crear: {displayLimit(p.canCreateEvents)}</li>
                                                <li>Gestionar: {displayLimit(p.canManageEvents)}</li>
                                            </ul>

                                            {isSuper && (
                                                <div className="mt-5 flex flex-wrap gap-2">
                                                    <button
                                                        className="rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditing({
                                                                ...p,
                                                                badge: p.badge ?? null,
                                                                benefits: p.benefits ?? [],
                                                                limitations: p.limitations ?? [],
                                                                canCreateEvents: p.canCreateEvents ?? 0,
                                                                canManageEvents: p.canManageEvents ?? 0,
                                                            });
                                                        }}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removePlan(p.id);
                                                        }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </SectionCard>

            {/* Modal */}
            {isSuper && editing && (
                <PlanEditorModal
                    plan={editing}
                    onClose={() => setEditing(null)}
                    onSave={savePlan}
                    onDelete={removePlan}
                    isNew={!editing.id}
                />
            )}
        </RequireFeature>
    );
}
