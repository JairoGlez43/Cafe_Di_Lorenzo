// Lighthouse mobile (default config: simulated slow network, CPU x4) over out/.
// Runs 5 times, saves every JSON report in .verify/slice-N/ and judges the median run (spec 0006)
// against the CLAUDE.md limits: Performance and Accessibility >= 90, LCP <= 3 s.
// Limits can be changed through env vars (LIGHTHOUSE_RENDIMIENTO, LIGHTHOUSE_ACCESIBILIDAD,
// LIGHTHOUSE_LCP_MS) to prove the script fails. Usage: pnpm lighthouse <N> (after `pnpm build`).
import { mkdir, writeFile } from "node:fs/promises";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { computeMedianRun } from "lighthouse/core/lib/median-run.js";
import { chromium } from "playwright";
import { servir } from "./servidor.ts";

const PASADAS = 5;
const limites = {
  rendimiento: Number(process.env.LIGHTHOUSE_RENDIMIENTO ?? 90),
  accesibilidad: Number(process.env.LIGHTHOUSE_ACCESIBILIDAD ?? 90),
  lcp: Number(process.env.LIGHTHOUSE_LCP_MS ?? 3000),
};

const slice = process.argv[2];
if (!slice) {
  console.error("Uso: pnpm lighthouse <N>");
  process.exit(1);
}
const carpeta = `.verify/slice-${slice}`;

type Resultado = ReturnType<typeof computeMedianRun>;
const valores = ({ categories, audits }: Resultado) => ({
  rendimiento: Math.round((categories.performance.score ?? 0) * 100),
  accesibilidad: Math.round((categories.accessibility.score ?? 0) * 100),
  lcp: Math.round(audits["largest-contentful-paint"].numericValue ?? Infinity),
});

await mkdir(carpeta, { recursive: true });
const { url, cerrar } = await servir();
// Playwright's full Chromium, so no system Chrome is needed.
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new"] });
try {
  // One run after another: parallel runs would fight for the CPU and add the noise we want to remove.
  const pasadas: Resultado[] = [];
  for (let i = 1; i <= PASADAS; i++) {
    const resultado = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      onlyCategories: ["performance", "accessibility"],
      logLevel: "error",
    });
    if (!resultado) throw new Error(`Lighthouse no devolvió resultado en la pasada ${i}`);
    await writeFile(`${carpeta}/lighthouse-${i}.json`, resultado.report as string);
    pasadas.push(resultado.lhr);
    const v = valores(resultado.lhr);
    console.log(`Pasada ${i}: Rendimiento ${v.rendimiento} · Accesibilidad ${v.accesibilidad} · LCP ${v.lcp} ms`);
  }

  // The run closest to the median FCP and TTI, so all three numbers come from one real run.
  const mediana = computeMedianRun(pasadas);
  const numero = pasadas.indexOf(mediana) + 1;
  const v = valores(mediana);
  console.log(`\nMediana: pasada ${numero}`);
  const filas = [
    ["Rendimiento", v.rendimiento, `>= ${limites.rendimiento}`, v.rendimiento >= limites.rendimiento],
    ["Accesibilidad", v.accesibilidad, `>= ${limites.accesibilidad}`, v.accesibilidad >= limites.accesibilidad],
    ["LCP (ms)", v.lcp, `<= ${limites.lcp}`, v.lcp <= limites.lcp],
  ] as const;

  let falla = false;
  for (const [nombre, valor, limite, ok] of filas) {
    falla ||= !ok;
    console.log(`${nombre.padEnd(14)} ${String(valor).padStart(6)}  ${limite.padEnd(8)} ${ok ? "OK" : "FALLA"}`);
  }
  const { audits } = mediana;
  console.log(`TBT ${Math.round(audits["total-blocking-time"].numericValue ?? 0)} ms · CLS ${audits["cumulative-layout-shift"].displayValue}`);
  console.log(`Informe: ${carpeta}/lighthouse-${numero}.json`);
  process.exitCode = falla ? 1 : 0;
} finally {
  chrome.kill();
  await cerrar();
}
