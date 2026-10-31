import type { Metadata } from "next";
import { sitio } from "@/content";
import "./globals.css";

export const metadata: Metadata = {
  title: sitio.titulo,
  description: sitio.descripcion,
  // Private demo until the café accepts (ADR 0004).
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="bg-verde text-crema">{children}</body>
    </html>
  );
}
