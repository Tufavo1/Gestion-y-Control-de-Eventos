import Image from "next/image";

export type EventCardProps = {
    region: string; title: string; start: string; end: string; price: string; img: string; org: string;
};

export function EventCard({ region, title, start, end, price, img, org }: EventCardProps) {
    return (
        <article className="group overflow-hidden rounded-xl border border-gray-200 transition hover:shadow-md">
            <div className="relative aspect-[4/3] w-full">
                <Image src={img} alt={`Imagen del evento ${title}`} fill sizes="(min-width:1280px)25vw,(min-width:1024px)33vw,(min-width:640px)50vw,100vw" className="object-cover transition group-hover:scale-[1.02]" />
            </div>
            <div className="space-y-2 p-4">
                <h4 className="text-xs font-medium text-gray-500">{region}</h4>
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="flex items-center gap-2 text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5zM2.545 3h10.91c.3 0 .545.224.545.5v1c0 .276-.244.5-.545.5H2.545z" />
                    </svg>
                    <span><time>{start}</time> <strong className="mx-1">hasta</strong> <time>{end}</time></span>
                </span>
                <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-gray-600">Precio:</span>
                    <strong className="text-base font-semibold">${price}</strong>
                </div>
            </div>
            <div className="border-t border-gray-100 p-4">
                <div className="mb-1 text-sm font-semibold">{org}</div>
                <p className="text-sm text-gray-600">Texto breve del evento u organizador.</p>
            </div>
        </article>
    );
}
