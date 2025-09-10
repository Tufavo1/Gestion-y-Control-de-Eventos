import Footer from "@/components/Layout/footer";
import { Navbar } from "@/components/Layout/navbar";
import Image from "next/image";

export default function Forbidden() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar />
            <section className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4 py-10">
                <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 p-10 text-center shadow-lg">
                    {/* Icono */}
                    <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-red-400">
                        <Image
                            src="/img/icono.png"
                            alt="Logo de CuponME"
                            width={70}
                            height={70}
                            className="h-20 w-20 object-contain transition-transform duration-500 hover:rotate-6 hover:scale-110"
                        />
                    </div>

                    {/* Código */}
                    <h1 className="text-5xl font-extrabold text-gray-900">403</h1>
                    <p className="mt-2 text-lg font-medium text-gray-700">
                        Acceso restringido
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        No tienes los privilegios necesarios para ingresar a esta sección.
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
