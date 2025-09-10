export type Purchase = {
    id: string | number;
    eventTitle: string;
    purchasedAt: string;
    amount: number;
    quantity: number;
};

export type AttendedEvent = {
    id: string | number;
    title: string;
    date: string;
    venue: string;
};
