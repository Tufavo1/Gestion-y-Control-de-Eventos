export type PlanDefinition = {
    id: "free" | "basic" | "premium" | "gold" | (string & {});
    name: string;
    priceCents: number;
    period: string;
    highlight: boolean;
    badge?: string | null;
    description: string;
    canCreateEvents: number | null;
    canManageEvents: number | null;
    benefits: string[];
    limitations: string[];
    updatedAt?: string;
};

export type ApiPlan = {
    id: string;
    name: string;
    priceCl: number;
    period: string;
    highlight: boolean;
    badge?: string | null;
    description: string;
    canCreateEvents?: number | null;
    canManageEvents?: number | null;
    benefitsJson?: string;
    limitationsJson?: string;
    updatedAt?: string;
};

export type UpsertPlanPayload = Omit<PlanDefinition, "updatedAt">;
