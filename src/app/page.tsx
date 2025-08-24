import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Carousel } from "@/components/carousel";
import { EventCard } from "@/components/eventcard";

export default function Page() {
  const slides = [
    { src: "/img/images.jpg", title: "Título 1", text: "Contenido de ejemplo del primer slide." },
    { src: "/img/images.jpg", title: "Título 2", text: "Contenido de ejemplo del segundo slide." },
    { src: "/img/images.jpg", title: "Título 3", text: "Contenido de ejemplo del tercer slide." },
  ];

  const cards = new Array(8).fill(0).map((_, i) => ({
    id: i + 1,
    region: "Región Metropolitana",
    title: "Fiesta Electrónica",
    start: "15 nov",
    end: "24 nov",
    price: "5.000",
    img: "/img/images.jpg",
    org: "Fest",
  }));

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <Carousel slides={slides} />

      <section id="eventos" className="mx-auto max-w-7xl px-4 py-10">
        {/* Aqui ira el buscador y el filtrado*/}

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((c) => (
            <li key={c.id}><EventCard {...c} /></li>
          ))}
        </ul>
      </section>

      <footer id="contacto" className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          {/* … tu footer … */}
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Dinovance. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
