// Playwright screenshots of out/ at 375 and 1440 px, with and without reduced motion,
// saved as evidence in .verify/slice-N/. Usage: pnpm shots <N> (after `pnpm build`).
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { servir } from "./servidor.ts";

const slice = process.argv[2];
if (!slice) {
  console.error("Uso: pnpm shots <N>");
  process.exit(1);
}
const carpeta = `.verify/slice-${slice}`;
const pantallas = [
  { ancho: 375, alto: 812, movil: true },
  { ancho: 1440, alto: 900, movil: false },
];
const movimientos = ["no-preference", "reduce"] as const;

await mkdir(carpeta, { recursive: true });
const { url, cerrar } = await servir();
const navegador = await chromium.launch();
try {
  for (const { ancho, alto, movil } of pantallas) {
    for (const reducedMotion of movimientos) {
      const contexto = await navegador.newContext({
        viewport: { width: ancho, height: alto },
        deviceScaleFactor: movil ? 2 : 1,
        isMobile: movil,
        hasTouch: movil,
        reducedMotion,
      });
      const pagina = await contexto.newPage();
      await pagina.goto(url, { waitUntil: "networkidle" });
      const ruta = `${carpeta}/${ancho}${reducedMotion === "reduce" ? "-reduced-motion" : ""}.png`;
      await pagina.screenshot({ path: ruta, fullPage: true });
      console.log(ruta);
      await contexto.close();
    }
  }
} finally {
  await navegador.close();
  await cerrar();
}
