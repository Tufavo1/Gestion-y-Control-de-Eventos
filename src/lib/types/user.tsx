import type { RoleId, PlanId } from "./ids";

export type UserProfile = {
    email: string;
    fullName: string;
    userName: string;
    phone: string;
    rut: string;
    birthDate: string | null;
    role: string;
    plan: string;
};

export type AdminUser = {
    id: number;
    email: string;
    fullName: string;
    userName: string;
    phoneNumber: string;
    rut: string;
    birthDate: string | null;
    role: RoleId;
    plan: PlanId;
    createdAt: string;
};
