// Minimal static server for out/, with gzip like a real host, so the checks
// (weight, screenshots, Lighthouse) measure compressed transfers.
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { gzipSync } from "node:zlib";

const tipos: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
const comprimibles = new Set([".html", ".js", ".css", ".txt", ".json", ".svg"]);

export function servir(raiz = "out"): Promise<{ url: string; cerrar: () => Promise<void> }> {
  const servidor = createServer(async (peticion, respuesta) => {
    const camino = decodeURIComponent(new URL(peticion.url ?? "/", "http://x").pathname);
    const relativo = normalize(camino.endsWith("/") ? `${camino}index.html` : camino);
    const extension = extname(relativo) || ".html";
    try {
      let cuerpo = await readFile(join(raiz, extname(relativo) ? relativo : `${relativo}.html`));
      const cabeceras: Record<string, string> = { "Content-Type": tipos[extension] ?? "application/octet-stream" };
      if (comprimibles.has(extension) && /\bgzip\b/.test(String(peticion.headers["accept-encoding"]))) {
        cuerpo = gzipSync(cuerpo);
        cabeceras["Content-Encoding"] = "gzip";
      }
      respuesta.writeHead(200, cabeceras).end(cuerpo);
    } catch {
      respuesta.writeHead(404).end();
    }
  });
  return new Promise((resolver) => {
    servidor.listen(0, "127.0.0.1", () => {
      const { port } = servidor.address() as AddressInfo;
      resolver({
        url: `http://127.0.0.1:${port}/`,
        cerrar: () => new Promise((fin) => servidor.close(() => fin())),
      });
    });
  });
}
