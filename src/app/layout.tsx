import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { sitio } from "@/content";
import "./globals.css";

// Title font, downloaded at build time and served from out/ (spec 0007).
const fuenteTitulo = Playfair_Display({
  weight: "600",
  subsets: ["latin"],
  display: "swap",
  fallback: ["serif"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: sitio.titulo,
  description: sitio.descripcion,
  // Private demo until the café accepts (spec 0004).
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={fuenteTitulo.variable}>
      <body className="bg-verde text-crema">{children}</body>
    </html>
  );
}
