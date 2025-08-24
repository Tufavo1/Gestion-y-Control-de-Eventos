import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Eventos",
  description: "Capstone: Sistema de gestión y registro de eventos con Next.js + .NET + SQL Server",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
