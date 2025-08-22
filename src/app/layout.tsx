import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Bootstrap CSS primero; luego tus estilos para poder sobreescribir
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import BootstrapClient from "./boostrap-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eventos % Reservas",
  description: "Plataforma de Gestion",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Carga el JS de Bootstrap (bundle con Popper) en cliente */}
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}
