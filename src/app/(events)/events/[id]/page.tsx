import { notFound } from "next/navigation";

type Props = {
    params: { id: string };
};

type Evento = {
    title: string;
    desc: string;
};

const mockData: Record<string, Evento> = {
    "1": { title: "Fiesta Electrónica Centro", desc: "Detalles de la fiesta..." },
    "2": { title: "Feria Gastronómica Veggie", desc: "Comida saludable y más..." },
};

export default function EventoDetalle({ params }: Props) {
    const { id } = params;

    const evento = mockData[id];
    if (!evento) return notFound();

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold">{evento.title}</h1>
            <p className="mt-4 text-gray-700">{evento.desc}</p>
        </main>
    );
}
