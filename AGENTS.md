# Café Di Lorenzo: landing (demo)

Landing de una sola página para Café Di Lorenzo (La Habana). Es una **demo-propuesta**:
se hace por adelantado para ofrecérsela al café. Todavía no es un encargo.

## Stack
- TypeScript estricto, Node 24, pnpm 10. Next.js 16.4 (App Router, `output: "export"`), React 19.3,
  Tailwind 4 cargado por Turbopack (sin PostCSS). Vitest para tests; Playwright, Lighthouse y sharp
  para las comprobaciones y las imágenes. Alias `@/` → `src/`.

## Para quién y objetivo
- Primero la ven los dueños del café (pitch); después, sus clientes, sobre todo desde
  el móvil con datos 3G en Cuba.
- Un solo objetivo: que el visitante vaya al café. Acción principal: "Cómo llegar".
  Secundarias: WhatsApp e Instagram.

## Restricciones duras
- Primera vista ≤ 300 KB transferidos; página completa ≤ 1,2 MB; JS ≤ 180 KB gzip (ver spec 0005 en `docs/specs/`).
- LCP ≤ 3 s en Lighthouse móvil con red lenta; Rendimiento y Accesibilidad ≥ 90.
- Next.js con exportación estática: sin servidor, sin base de datos, sin formularios propios.
- Imágenes convertidas a AVIF/WebP en el build; nunca servir los originales de `references/`.
- Animaciones con SVG + CSS. Nada de vídeo, Lottie ni librerías 3D.
- Con `prefers-reduced-motion`, todo queda en estado estático.
- Demo privada con `noindex` hasta que el café acepte.
- El `noindex` vive en dos sitios: la meta `robots` de `src/app/layout.tsx` y la cabecera
  `X-Robots-Tag` de `public/_headers` (Cloudflare Pages). Para publicar hay que quitar los dos.

## Idioma
Toda la interfaz en español.

## Alcance de la v1
Secciones: Portada, El lugar, Menú (Café · Brunch · Dulces · Batidos), Galería, Visítanos, Pie.
Fuera: precios, pedidos, reservas, blog, otros idiomas, selector claro/oscuro.

## Diseño
- Un solo tema: secciones en tono crema y en tono verde botella, alternadas, con acento
  dorado. Los colores se definen en variables CSS.
- Una única animación protagonista ligada al scroll, que lleva hacia "Cómo llegar"; lo demás
  son microinteracciones. Claude decide el diseño de movimiento y lo presenta en cada slice.

## Contenido
- Todo el contenido editable vive en un único módulo de contenido; los componentes solo leen de él.
- Los nombres de productos y los datos de contacto son provisionales hasta que el café los confirme.

## Cuándo un slice está terminado
Pasa el script de peso tras el build, pasa Lighthouse, tiene capturas de Playwright a 375 y
1440 px (también con reduced-motion) y se ha probado en un móvil real.

## Comandos
- `pnpm dev`: desarrollo.
- `pnpm build`: convierte las imágenes de `references/` a AVIF/WebP (sharp, `pnpm images`) y exporta a `out/`.
- `pnpm test`: tests (Vitest).
- `pnpm weight`: script de peso sobre `out/` (primera vista a 375×812, página completa, JS gzip); sale con 1 si se pasa un límite.
- `pnpm shots <N>`: capturas de Playwright a 375 y 1440 px, normal y reduced-motion, en `.verify/slice-N/`.
- `pnpm lighthouse <N>`: Lighthouse móvil (red lenta simulada, CPU ×4) sobre `out/`, 5 pasadas seguidas;
  guarda cada JSON (`lighthouse-1.json` … `-5.json`) en `.verify/slice-N/` y juzga la pasada mediana
  (`computeMedianRun`, spec 0006): sale con 1 si Rendimiento o Accesibilidad < 90, LCP > 3 s o una pasada se rompe.
- `pnpm dev` también ejecuta `pnpm images` antes, igual que `build`.
- `pnpm lint`: ESLint con la config de Next (core-web-vitals + TypeScript).
- Los scripts de `scripts/` corren con `node` directo sobre TypeScript (Node 24 quita los tipos):
  importan con extensión `.ts` y usan `await` de nivel superior. Todos sirven `out/` con gzip en un
  puerto libre a través de `scripts/servidor.ts`.
- `pnpm weight` admite `PESO_PRIMERA_VISTA_KB`, `PESO_PAGINA_KB` y `PESO_JS_KB` para bajar los
  límites y comprobar que el script falla.
- `pnpm lighthouse` admite `LIGHTHOUSE_RENDIMIENTO`, `LIGHTHOUSE_ACCESIBILIDAD` y `LIGHTHOUSE_LCP_MS` para lo
  mismo (p. ej. `LIGHTHOUSE_LCP_MS=100` tiene que fallar).
- `pnpm deploy:pages`: sube `out/` a Cloudflare Pages con wrangler (dependencia de desarrollo); antes,
  `pnpm build`. La primera vez pide `pnpm exec wrangler login`. No se llama `deploy` porque
  `pnpm deploy` es un comando propio de pnpm.

## Convenciones de código
- Identificadores en español con los términos de `CONTEXT.md` (`portada`, `variantes`, `servir`);
  comentarios, commits y docs técnicos en inglés.
- Colores: `@theme` en `src/app/globals.css` define `--color-verde`, `--color-dorado`,
  `--color-crema` y `--color-tinta`; se usan como utilidades (`bg-verde`, `text-dorado`). No hay
  colores sueltos fuera de ahí.
- Cada imagen tiene su origen en `src/content.ts`, su variante (anchos y proporción) en
  `src/lib/imagenes.ts` y una llamada `generar` en `scripts/images.ts`. Los componentes usan
  `<picture>` con `<source>` AVIF e `<img>` WebP; nunca `next/image`.
- Componentes como Server Components; `'use client'` solo donde hay interacción (spec 0005).
- Tests con Vitest, sin archivo de config, junto al módulo que prueban (`src/lib/links.test.ts`).
- Generados y fuera de git: `public/img/`, `out/` y `.verify/`. No se commitean.
- `references/` también está fuera de git (fotos de IG sin permiso, spec 0004; el repo es público).
  Quien clone el repo tiene que copiar ahí los originales que cita `src/content.ts` para que
  `pnpm build` funcione.

## Referencias
- Fotos de IG y logo: `references/img-1_files/`. Inspiración: `references/landing_references/`.
- Términos del dominio: `CONTEXT.md`. Decisiones: `docs/specs/` (las 0001 a 0005 vienen de las antiguas ADR).
- Plan, orden de slices y decisiones pendientes: `docs/scope/scope.md`.

## Agent skills
- Declined: wrangler (`cloudflare/skills`). Para dudas de Cloudflare Pages o wrangler, consultar la
  doc oficial con el subagente `researcher` en vez de instalar la skill.
- MCP servers: ninguno; lo externo (deploy, cabeceras, docs) se hace con CLI, `curl` y búsqueda web.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
