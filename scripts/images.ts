// Converts the originals in references/ into AVIF/WebP variants in public/img.
// Runs before `next dev` and `next build`; the originals never reach out/.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { cafe, portada } from "../src/content.ts";
import { formatos, ruta, variantes, type Variante } from "../src/lib/imagenes.ts";

const calidad = { avif: { quality: 50 }, webp: { quality: 70 } };

// The logo JPG is a green disc on white: keep the disc, make the corners transparent.
function recorteCircular(ancho: number) {
  const r = ancho / 2;
  return Buffer.from(
    `<svg width="${ancho}" height="${ancho}"><circle cx="${r}" cy="${r}" r="${r - 0.5}"/></svg>`,
  );
}

// posicion: which part of the original the cover crop keeps. The arch keeps the top;
// the full bleed Portada keeps the centre (spec 0008).
type Opciones = { circular?: boolean; posicion?: "top" | "centre" };

async function generar(
  nombre: Variante,
  origen: string,
  { circular = false, posicion = "top" }: Opciones = {},
) {
  const { anchos, proporcion } = variantes[nombre];
  for (const ancho of anchos) {
    const alto = Math.round(ancho * proporcion);
    let imagen = sharp(origen).resize(ancho, alto, { fit: "cover", position: posicion });
    if (circular) {
      imagen = sharp(await imagen.png().toBuffer()).composite([
        { input: recorteCircular(ancho), blend: "dest-in" },
      ]);
    }
    for (const formato of formatos) {
      const destino = `public${ruta(nombre, ancho, formato)}`;
      const { size } = await imagen.clone()[formato](calidad[formato]).toFile(destino);
      console.log(`${destino}  ${(size / 1024).toFixed(1)} KB`);
    }
  }
}

await mkdir("public/img", { recursive: true });
await generar("logo", cafe.logo.origen, { circular: true });
await generar("portada", portada.foto.origen);
await generar("portadaMovil", portada.foto.origen, { posicion: "centre" });
await generar("portadaAncha", portada.foto.origen, { posicion: "centre" });
