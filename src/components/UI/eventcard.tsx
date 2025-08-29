import Image from "next/image";
import TipoEvento from "@/components/Home/typeevent"

export type EventCardProps = {
    region: string;
    comuna: string;
    title: string;
    start: string;
    end?: string;
    price?: string | number;
    img?: string;
    org?: string;
    tipo?: "deporte" | "fiesta" | "concierto" | "teatro" | "feria" | "otro";
    desc?: string;
};

function formatDateRange(start: string, end?: string) {
    const fmt = new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", year: "numeric" });
    const s = fmt.format(new Date(start));
    const e = end ? fmt.format(new Date(end)) : s;
    return s === e ? s : `${s} — ${e}`;
}

function formatPrice(price?: string | number): string {
    if (typeof price === "number") return price > 0 ? `$ ${price.toLocaleString("es-CL")} CLP` : "Gratis";
    if (typeof price === "string") {
        const n = price.toLowerCase().trim();
        if (n === "gratis" || n === "entrada liberada" || n === "0") return "Gratis";
        if (n === "invitados" || n === "solo invitados") return "Solo invitados";
        const asNum = Number(n);
        return !isNaN(asNum) ? (asNum > 0 ? `$ ${asNum.toLocaleString("es-CL")} CLP` : "Gratis") : price;
    }
    return "Gratis";
}

export function EventCard({ region, title, start, end, price, img, org, tipo, desc, comuna }: EventCardProps) {
    const dateText = formatDateRange(start, end);
    const priceText = formatPrice(price);
    const placeText = comuna ? `${comuna}, ${region}` : region;

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <TipoEvento tipo={tipo} />

            {/* img con overlay */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                    src={img ?? "/img/placeholder.jpg"}
                    alt={`Imagen del evento ${title}`}
                    fill
                    sizes="(min-width:1280px)25vw,(min-width:1024px)33vw,(min-width:640px)50vw,100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>

            {/* Contenido principal */}
            <div className="space-y-3 p-4">
                {/* Región / lugar */}
                <div className="flex items-center gap-2 text-xs text-gray-600 border-bottom-orange">
                    <svg
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                    </svg>
                    <span className="truncate">{placeText}</span>
                </div>

                {/* titulo */}
                <h2 className="line-clamp-2 text-2xl font-bold text-gray-900">
                    {title}
                </h2>

                {/* Fecha + precio */}
                <div className="display-flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
                    <div className="inline-flex items-center gap-1 text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                        </svg>

                        <span>{dateText}</span>
                    </div>

                    <br />

                    <div className="inline-flex items-center gap-3 text-xl font-bold text-black text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                        </svg>

                        <span>{priceText}</span>
                    </div>
                </div>
            </div>

            {/* organizacion y descripcion */}
            <div className="border-t border-gray-100 bg-gray-50/60 p-4">
                <div className="mb-2 flex items-center gap-3">
                    <div className="min-w-0 mx-auto">
                        <div className="truncate text-sm font-semibold text-black">
                            {org ?? "Organizador por definir"}
                        </div>
                    </div>
                </div>
                {desc && (
                    <p className="text-sm leading-6 text-gray-600 line-clamp-3">
                        {desc}
                    </p>
                )}
            </div>
        </article>
    );
}