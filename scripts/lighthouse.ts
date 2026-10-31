// Lighthouse mobile (default config: simulated slow network, CPU x4) over out/.
// Saves the JSON report in .verify/slice-N/ and exits 1 if a CLAUDE.md limit fails:
// Performance and Accessibility >= 90, LCP <= 3 s. Usage: pnpm lighthouse <N> (after `pnpm build`).
import { mkdir, writeFile } from "node:fs/promises";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { chromium } from "playwright";
import { servir } from "./servidor.ts";

const slice = process.argv[2];
if (!slice) {
  console.error("Uso: pnpm lighthouse <N>");
  process.exit(1);
}
const carpeta = `.verify/slice-${slice}`;

await mkdir(carpeta, { recursive: true });
const { url, cerrar } = await servir();
// Playwright's full Chromium, so no system Chrome is needed.
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new"] });
try {
  const resultado = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    onlyCategories: ["performance", "accessibility"],
    logLevel: "error",
  });
  if (!resultado) throw new Error("Lighthouse no devolvió resultado");
  await writeFile(`${carpeta}/lighthouse.json`, resultado.report as string);

  const { categories, audits } = resultado.lhr;
  const lcp = audits["largest-contentful-paint"].numericValue ?? Infinity;
  const filas = [
    ["Rendimiento", Math.round((categories.performance.score ?? 0) * 100), ">= 90", (v: number) => v >= 90],
    ["Accesibilidad", Math.round((categories.accessibility.score ?? 0) * 100), ">= 90", (v: number) => v >= 90],
    ["LCP (ms)", Math.round(lcp), "<= 3000", (v: number) => v <= 3000],
  ] as const;

  let falla = false;
  for (const [nombre, valor, limite, cumple] of filas) {
    const ok = cumple(valor);
    falla ||= !ok;
    console.log(`${nombre.padEnd(14)} ${String(valor).padStart(6)}  ${limite.padEnd(8)} ${ok ? "OK" : "FALLA"}`);
  }
  console.log(`TBT ${Math.round(audits["total-blocking-time"].numericValue ?? 0)} ms · CLS ${audits["cumulative-layout-shift"].displayValue}`);
  console.log(`Informe: ${carpeta}/lighthouse.json`);
  process.exitCode = falla ? 1 : 0;
} finally {
  chrome.kill();
  await cerrar();
}
