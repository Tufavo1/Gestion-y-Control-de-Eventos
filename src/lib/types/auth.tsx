export type RegisterPayload = {
    fullName: string;
    rut: string;
    birthDate: string | null;
    phoneNumber: string;
    userName: string;
    email: string;
    password: string;
    plan?: import("./ids").PlanId;
    role?: import("./ids").RoleId;
};

export type ApiLoginResponse = {
    token: string;
    fullName: string;
    role: string;
    plan: string;
};
