"use client";

import { useEffect, useMemo, useState } from "react";
import {
    adminListUsers,
    adminSetUserRole,
    adminSetUserPlan,
    adminDeleteUser,
    registerUser,
    type AdminUser,
    type PlanId,
    type RoleId,
} from "@/lib/api";
import RequireRole from "../../../guards/RequireRole";
import { SectionCard, type CurrentUser } from "../DesignSystem";

/* =========================
   Helpers UI
========================= */
function clsx(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function initials(name?: string) {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (a + b).toUpperCase();
}
const ROLES: RoleId[] = ["user", "member", "admin", "superadmin"];
const PLANS: PlanId[] = ["free", "basic", "premium", "gold"];

/* =========================
   Modal Crear / Editar
========================= */
type CreateDraft = {
    fullName: string;
    email: string;
    userName: string;
    phoneNumber: string;
    rut: string;
    birthDate: string; // yyyy-mm-dd
    plan: PlanId;
    role: RoleId;
    password: string;
};

function emptyDraft(): CreateDraft {
    return {
        fullName: "",
        email: "",
        userName: "",
        phoneNumber: "",
        rut: "",
        birthDate: "",
        plan: "free",
        role: "user",
        password: "",
    };
}

function EditUserModal({
    open,
    onClose,
    user,
    onChangeRolePlan,
}: {
    open: boolean;
    onClose: () => void;
    user: AdminUser | null;
    onChangeRolePlan: (id: number, role: RoleId, plan: PlanId) => Promise<void>;
}) {
    const [role, setRole] = useState<RoleId>(user?.role ?? "user");
    const [plan, setPlan] = useState<PlanId>(user?.plan ?? "free");
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        setRole((user?.role as RoleId) ?? "user");
        setPlan((user?.plan as PlanId) ?? "free");
    }, [user]);

    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-orange/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:mx-auto">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                        {initials(user.fullName)}
                    </div>
                    <div>
                        <div className="text-base font-semibold">{user.fullName}</div>
                        <div className="text-xs text-neutral-500">ID {user.id}</div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Email</div>
                        <input className="w-full rounded-xl border bg-neutral-50 p-2 text-neutral-500" value={user.email} disabled />
                        <p className="mt-1 text-[11px] text-neutral-500">
                            Para editar email u otros datos personales, agrega un endpoint admin de actualización.
                        </p>
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Usuario</div>
                        <input className="w-full rounded-xl border bg-neutral-50 p-2 text-neutral-500" value={user.userName} disabled />
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">RUT</div>
                        <input className="w-full rounded-xl border bg-neutral-50 p-2 text-neutral-500" value={user.rut} disabled />
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                        <label className="text-sm">
                            <div className="mb-1 text-xs font-semibold text-neutral-600">Rol</div>
                            <select
                                className="w-full rounded-xl border bg-white p-2 outline-none"
                                value={role}
                                onChange={(e) => setRole(e.target.value as RoleId)}
                            >
                                {ROLES.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-sm">
                            <div className="mb-1 text-xs font-semibold text-neutral-600">Plan</div>
                            <select
                                className="w-full rounded-xl border bg-white p-2 outline-none"
                                value={plan}
                                onChange={(e) => setPlan(e.target.value as PlanId)}
                            >
                                {PLANS.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button className="rounded-xl border px-3 py-1.5 text-sm" onClick={onClose} disabled={saving}>
                        Cancelar
                    </button>
                    <button
                        className="rounded-xl bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
                        onClick={async () => {
                            setSaving(true);
                            try {
                                await onChangeRolePlan(user.id, role, plan);
                                onClose();
                            } finally {
                                setSaving(false);
                            }
                        }}
                        disabled={saving}
                    >
                        {saving ? "Guardando…" : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreateUserModal({
    open,
    onClose,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}) {
    const [draft, setDraft] = useState<CreateDraft>(emptyDraft());
    const [saving, setSaving] = useState(false);
    const canSave =
        draft.fullName && draft.email && draft.userName && draft.rut && draft.password;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:mx-auto">
                <h3 className="mb-3 text-lg font-semibold">Nuevo usuario</h3>

                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Nombre completo</div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.fullName}
                            onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                            placeholder="Nombre Apellido"
                        />
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Email</div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.email}
                            onChange={(e) => setDraft({ ...draft, email: e.target.value.trim().toLowerCase() })}
                            placeholder="correo@dominio.com"
                        />
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Usuario</div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.userName}
                            onChange={(e) => setDraft({ ...draft, userName: e.target.value })}
                            placeholder="usuario123"
                        />
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Teléfono</div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.phoneNumber}
                            onChange={(e) => setDraft({ ...draft, phoneNumber: e.target.value })}
                            placeholder="+56 9 1234 5678"
                        />
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">RUT</div>
                        <input
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.rut}
                            onChange={(e) => setDraft({ ...draft, rut: e.target.value })}
                            placeholder="12.345.678-9"
                        />
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Fecha de nacimiento</div>
                        <input
                            type="date"
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.birthDate}
                            onChange={(e) => setDraft({ ...draft, birthDate: e.target.value })}
                        />
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Rol</div>
                        <select
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.role}
                            onChange={(e) => setDraft({ ...draft, role: e.target.value as RoleId })}
                        >
                            {ROLES.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Plan</div>
                        <select
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.plan}
                            onChange={(e) => setDraft({ ...draft, plan: e.target.value as PlanId })}
                        >
                            {PLANS.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="sm:col-span-2 text-sm">
                        <div className="mb-1 text-xs font-semibold text-neutral-600">Contraseña</div>
                        <input
                            type="password"
                            className="w-full rounded-xl border bg-white p-2 outline-none"
                            value={draft.password}
                            onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                            placeholder="Mínimo 8 caracteres"
                        />
                    </label>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button className="rounded-xl border px-3 py-1.5 text-sm" onClick={onClose} disabled={saving}>
                        Cancelar
                    </button>
                    <button
                        className="rounded-xl bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
                        disabled={!canSave || saving}
                        onClick={async () => {
                            try {
                                setSaving(true);
                                await registerUser({
                                    fullName: draft.fullName,
                                    rut: draft.rut,
                                    birthDate: draft.birthDate || null,
                                    phoneNumber: draft.phoneNumber,
                                    userName: draft.userName,
                                    email: draft.email,
                                    password: draft.password,
                                    plan: draft.plan,
                                    role: draft.role,
                                });
                                onCreated();
                                onClose();
                            } catch (e) {
                                alert(e instanceof Error ? e.message : "No se pudo crear el usuario.");
                            } finally {
                                setSaving(false);
                            }
                        }}
                    >
                        {saving ? "Creando…" : "Crear usuario"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =========================
   Tab principal
========================= */
export default function UsersTab({ user }: { user: CurrentUser }) {
    const canManage = user.role === "admin" || user.role === "superadmin";

    const [rows, setRows] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [q, setQ] = useState("");

    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<AdminUser | null>(null);

    async function load() {
        try {
            setLoading(true);
            setErr(null);
            const list = await adminListUsers();
            setRows(list);
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Error cargando usuarios");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onChangeRolePlan(id: number, role: RoleId, plan: PlanId) {
        // Guarda en paralelo; si falla uno, mostramos alerta.
        try {
            await Promise.all([adminSetUserRole(id, role), adminSetUserPlan(id, plan)]);
            setRows((r) => r.map((x) => (x.id === id ? { ...x, role, plan } : x)));
        } catch (e) {
            alert(e instanceof Error ? e.message : "No se pudieron guardar los cambios.");
        }
    }

    async function onDelete(id: number) {
        if (!canManage) return;
        if (!confirm("¿Eliminar este usuario? Esta acción es permanente.")) return;
        try {
            await adminDeleteUser(id);
            setRows((r) => r.filter((x) => x.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : "No se pudo eliminar");
        }
    }

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return rows;
        return rows.filter(
            (u) =>
                u.fullName.toLowerCase().includes(s) ||
                u.email.toLowerCase().includes(s) ||
                (u.userName || "").toLowerCase().includes(s) ||
                (u.rut || "").toLowerCase().includes(s)
        );
    }, [rows, q]);

    return (
        <RequireRole currentUser={user} minRole="admin">
            <SectionCard title="Usuarios" description="Crear, editar, asignar roles/planes y eliminar.">
                {/* Toolbar */}
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <input
                            className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none"
                            placeholder="Buscar por nombre, email, usuario o RUT"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">⌕</span>
                    </div>

                    {canManage && (
                        <button
                            className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
                            onClick={() => setShowCreate(true)}
                        >
                            + Nuevo usuario
                        </button>
                    )}
                </div>

                {/* Tabla */}
                {loading && <p className="text-sm text-neutral-600">Cargando…</p>}
                {err && <p className="text-sm text-red-600">{err}</p>}

                {!loading && !err && (
                    <div className="overflow-auto rounded-2xl border">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 bg-white">
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left">Usuario</th>
                                    <th className="px-3 py-2 text-left">Email</th>
                                    <th className="px-3 py-2 text-left">RUT</th>
                                    <th className="px-3 py-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => (
                                    <tr key={u.id} className="border-b hover:bg-neutral-50/70">
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
                                                    {initials(u.fullName)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{u.fullName}</div>
                                                    <div className="text-[11px] text-neutral-500">@{u.userName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">{u.email}</td>
                                        <td className="px-3 py-2">{u.rut}</td>
                                        <td className="px-3 py-2 text-xs text-neutral-500">
                                            {new Date(u.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="rounded-lg border px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-50"
                                                    onClick={() => setEditing(u)}
                                                    disabled={!canManage}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 disabled:opacity-50"
                                                    onClick={() => onDelete(u.id)}
                                                    disabled={!canManage}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td className="px-3 py-6 text-center text-neutral-500" colSpan={7}>
                                            {q ? "Sin resultados para tu búsqueda." : "Sin usuarios"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>

            {/* Modales */}
            {canManage && (
                <>
                    <CreateUserModal
                        open={showCreate}
                        onClose={() => setShowCreate(false)}
                        onCreated={load}
                    />
                    <EditUserModal
                        open={!!editing}
                        user={editing}
                        onClose={() => setEditing(null)}
                        onChangeRolePlan={onChangeRolePlan}
                    />
                </>
            )}
        </RequireRole>
    );
}
