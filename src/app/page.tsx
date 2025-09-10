import { Navbar } from "@/components/Layout/navbar";
import { Hero } from "@/components/Home/hero";
import { Carousel } from "@/components/UI/carousel";
import { Card } from "@/components/Home/eventsection";
import ContactForm from "@/components/Home/contactform";
import Footer from "@/components/Layout/footer";
import EventosCards from "@/components/Home/eventcard";
import PlanesSection from "@/components/princing/plansections";
import RotatingCommunity, { EventLite, EventMedia } from "@/components/community/globalcommunity";

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
      end: "2025-12-15",
      price: 7000,
      img: "/img/cards/1.jpg",
      tipo: "fiesta",
      desc: "Ven y disfruta de este Hard Techno",
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
      tipo: "deporte",
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
      tipo: "concierto",
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
      tipo: "deporte",
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
      tipo: "otro",
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
      tipo: "deporte",
    },
    {
      id: 7,
      title: "Feria Costumbrista",
      org: "Municipalidad de Nunoa",
      region: "Región Metropolitana de Santiago",
      comuna: "Nunoa",
      start: "2025-10-19",
      end: "2025-10-19",
      price: 10000,
      img: "/img/cards/7.jpg",
      tipo: "feria",
    },
    {
      id: 8,
      title: "Frozen Live Action",
      org: "Disney",
      region: "Región Metropolitana de Santiago",
      comuna: "Vitacura",
      start: "2025-10-19",
      end: "2025-10-19",
      price: 15000,
      img: "/img/cards/8.jpg",
      tipo: "teatro",
    },
  ];

  // Eventos
  const eventos: EventLite[] = [
    { id: 1, title: "Hard Techno" },
    { id: 2, title: "Trekking San Ramon" },
  ];

  // contenido por eventId
  const mediaByEvent: Record<string | number, EventMedia> = {
    1: {
      photos: [
        { id: "1-a", src: "/img/eventos/1.jpg", caption: "Hard Techno - Apertura" },
        { id: "1-b", src: "/img/eventos/2.jpg", caption: "Main stage" },
      ],
      testimonials: [
        { id: "1-t1", name: "Vale P.", rating: 5, location: "Providencia, CL", text: "La vibra estuvo increíble 🔥" },
        { id: "1-t2", name: "JP A.", rating: 4, location: "Ñuñoa, CL", text: "Buen sonido y organización." },
      ],
    },
    2: {
      photos: [
        { id: "2-a", src: "/img/eventos/3.jpg", caption: "Trekking San Ramon" },
        { id: "2-b", src: "/img/eventos/4.webp", caption: "Caminata" },
      ],
      testimonials: [
        { id: "2-t1", name: "Vale P.", rating: 5, location: "Providencia, CL", text: "La vibra estuvo increíble 🔥" },
        { id: "2-t2", name: "JP A.", rating: 4, location: "Ñuñoa, CL", text: "Buen sonido y organización." },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* llamo a los componentes */}
      <Navbar />
      <Hero />
      <Carousel slides={slides} />
      <EventosCards cards={baseCards} />
      <PlanesSection />
      <ContactForm />
      <RotatingCommunity eventos={eventos} mediaByEvent={mediaByEvent} initialEventId={1} rotateSeconds={15} />
      <Footer />
    </main>
  );
}