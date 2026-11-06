// Image variants that scripts/images.ts generates into public/img at build time
// (spec 0001: no next/image optimizer in a static export). Shared by the script and
// the components so both agree on names and widths.

export const formatos = ["avif", "webp"] as const;
export type Formato = (typeof formatos)[number];

export const variantes = {
  // The source logo is 150 px, so 144 px (72 px at 2x) is the largest sharp size.
  logo: { anchos: [72, 144], proporcion: 1 },
  // Portrait crop for the arch; proporcion = height / width.
  portada: { anchos: [320, 480, 640, 840], proporcion: 5 / 4 },
  // Full bleed Portada (spec 0008): portrait for the top 52svh below 900 px,
  // landscape for the whole Portada from 900 px.
  portadaMovil: { anchos: [480, 640, 828, 1080], proporcion: 4 / 3 },
  portadaAncha: { anchos: [1280, 1600, 1920], proporcion: 5 / 8 },
} as const;

export type Variante = keyof typeof variantes;

export function ruta(nombre: Variante, ancho: number, formato: Formato): string {
  return `/img/${nombre}-${ancho}.${formato}`;
}

export function srcSet(nombre: Variante, formato: Formato): string {
  return variantes[nombre].anchos.map((a) => `${ruta(nombre, a, formato)} ${a}w`).join(", ");
}
