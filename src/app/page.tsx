// src/app/page.tsx

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Carousel } from "@/components/carousel";
import { EventosSection, Card } from "@/components/eventsection";

// pagina principal
export default function Page() {
  const slides = [
    {
      src: "/img/carousel/1.jpg",
      title: "Título 1",
      text: "Contenido de ejemplo del primer slide.",
    },
    {
      src: "/img/carousel/2.jpg",
      title: "Título 2",
      text: "Contenido de ejemplo del segundo slide.",
    },
    {
      src: "/img/carousel/3.jpg",
      title: "Título 3",
      text: "Contenido de ejemplo del tercer slide.",
    },
  ];

  // Estas seran las tarjetas que pasaran a eventsection
  const baseCards: Card[] = [
    {
      id: 1,
      title: "Hard Techno",
      org: "ElectroCL",
      region: "Región Metropolitana de Santiago",
      comuna: "Providencia",
      start: "2025-11-15",
      end: "2025-11-15",
      price: 7000,
      img: "/img/cards/1.jpg",
    },
    {
      id: 2,
      title: "Trekking San Ramon",
      org: "Sabores Verdes",
      region: "Región Metropolitana de Santiago",
      comuna: "La Reina",
      start: "2025-10-03",
      end: "2025-10-05",
      price: "Entrada liberada",
      img: "/img/cards/2.jpg",
    },
    {
      id: 3,
      title: "House",
      org: "IndieWave",
      region: "Región de Valparaíso",
      comuna: "San Felipe",
      start: "2025-09-20",
      end: "2025-09-20",
      price: 15000,
      img: "/img/cards/3.jpg",
    },
    {
      id: 4,
      title: "Colo-Colo VS U. De Chile",
      org: "Conmebol",
      region: "Región de Los Lagos",
      comuna: "Mariquina",
      start: "2025-11-01",
      end: "2025-11-07",
      price: 5000,
      img: "/img/cards/4.jpg",
    },
    {
      id: 5,
      title: "Casamiento Nain & Soledad",
      org: "Impulsa Pyme",
      region: "Región del Maule",
      comuna: "Vichuquen",
      start: "2025-08-30",
      end: "2025-09-01",
      price: "Solo Invitados",
      img: "/img/cards/5.jpg",
    },
    {
      id: 6,
      title: "Natacion",
      org: "Aquamans",
      region: "Región del Biobío",
      comuna: "Arauco",
      start: "2025-10-19",
      end: "2025-10-19",
      price: 10000,
      img: "/img/cards/6.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <Carousel slides={slides} />

      {/* llamamos a los componentes */}
      <EventosSection baseCards={baseCards} />

      <footer id="contacto" className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-black-600">
            &copy; {new Date().getFullYear()} Dinovance. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}