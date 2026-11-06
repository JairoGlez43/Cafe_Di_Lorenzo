import type { Metadata } from "next";
import { Playfair_Display, Rethink_Sans } from "next/font/google";
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

// Text font (spec 0007). No weight, so it loads the variable file (400 to 800).
const fuenteTexto = Rethink_Sans({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  variable: "--font-rethink",
});

export const metadata: Metadata = {
  title: sitio.titulo,
  description: sitio.descripcion,
  // Private demo until the café accepts (spec 0004).
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fuenteTitulo.variable} ${fuenteTexto.variable}`}>
      <body className="text-crema">
        {/* Day to night background layer (spec 0008); <body> paints no background. */}
        <div className="cielo" aria-hidden />
        {children}
      </body>
    </html>
  );
}
