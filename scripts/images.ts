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

async function generar(nombre: Variante, origen: string, circular = false) {
  const { anchos, proporcion } = variantes[nombre];
  for (const ancho of anchos) {
    const alto = Math.round(ancho * proporcion);
    let imagen = sharp(origen).resize(ancho, alto, { fit: "cover", position: "top" });
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
await generar("logo", cafe.logo.origen, true);
await generar("portada", portada.foto.origen);
