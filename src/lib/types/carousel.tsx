// lib/types/carousel.ts
export type CarouselItem = {
    id: number;
    order: number;
    src: string;
    title: string;
    text: string;
    isPublished: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type UpsertCarouselItemPayload = {
    src: string;
    title: string;
    text: string;
    isPublished?: boolean;
    order?: number | null;
};
