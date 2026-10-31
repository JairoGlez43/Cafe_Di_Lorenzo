// Weight script: checks the presupuesto de peso of CLAUDE.md against out/ (run after `pnpm build`).
// - Primera vista: compressed bytes a real browser downloads at 375x812 without scrolling (CONTEXT.md).
// - Página completa: the same after scrolling to the bottom.
// - JS: gzip sum of every <script src> in the exported index.html (spec 0005).
// Limits can be lowered through env vars (PESO_PRIMERA_VISTA_KB, PESO_PAGINA_KB, PESO_JS_KB) to prove the script fails.
import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { chromium, type Browser } from "playwright";
import { servir } from "./servidor.ts";

const KB = 1024;
const limites = {
  primeraVista: Number(process.env.PESO_PRIMERA_VISTA_KB ?? 300),
  paginaCompleta: Number(process.env.PESO_PAGINA_KB ?? 1.2 * 1024),
  js: Number(process.env.PESO_JS_KB ?? 180),
};

async function pesoJs(): Promise<number> {
  const html = await readFile("out/index.html", "utf8");
  const scripts = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  let total = 0;
  for (const src of scripts) total += gzipSync(await readFile(`out${src}`), { level: 9 }).length;
  return total;
}

// Fresh context per measurement, so nothing comes from cache.
async function transferido(navegador: Browser, url: string, conScroll: boolean) {
  const contexto = await navegador.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const pagina = await contexto.newPage();
  const medidas: Promise<{ url: string; bytes: number }>[] = [];
  pagina.on("requestfinished", (peticion) =>
    medidas.push(
      peticion.sizes().then((s) => ({ url: peticion.url(), bytes: s.responseBodySize + s.responseHeadersSize })),
    ),
  );
  await pagina.goto(url, { waitUntil: "networkidle" });
  if (conScroll) {
    await pagina.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 200));
      }
    });
    await pagina.waitForTimeout(1500); // let lazy resources finish
  }
  const recursos = await Promise.all(medidas);
  await contexto.close();
  return { total: recursos.reduce((suma, r) => suma + r.bytes, 0), recursos };
}

const { url, cerrar } = await servir();
const navegador = await chromium.launch();
try {
  const primeraVista = await transferido(navegador, url, false);
  const paginaCompleta = await transferido(navegador, url, true);
  const js = await pesoJs();

  const filas = [
    ["Primera vista (375x812, DPR 2)", primeraVista.total, limites.primeraVista],
    ["Página completa", paginaCompleta.total, limites.paginaCompleta],
    ["JS gzip", js, limites.js],
  ] as const;

  console.log("Primera vista, por recurso:");
  for (const r of primeraVista.recursos.sort((a, b) => b.bytes - a.bytes)) {
    console.log(`  ${(r.bytes / KB).toFixed(1).padStart(7)} KB  ${new URL(r.url).pathname}`);
  }
  console.log("\nPeso (KB = 1024 B)                 medido    límite");
  let falla = false;
  for (const [nombre, bytes, limite] of filas) {
    const ok = bytes / KB <= limite;
    falla ||= !ok;
    console.log(
      `${nombre.padEnd(32)} ${(bytes / KB).toFixed(1).padStart(8)}  ${limite.toFixed(1).padStart(8)}  ${ok ? "OK" : "FALLA"}`,
    );
  }
  process.exitCode = falla ? 1 : 0;
} finally {
  await navegador.close();
  await cerrar();
}
