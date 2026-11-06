# Scope: Café Di Lorenzo landing

A one page landing for Café Di Lorenzo (La Habana), built ahead of any order as a private demo to pitch to the owners. Its one job is to send the visitor to the café: the acción principal is "Cómo llegar", with WhatsApp and Instagram as acciones secundarias. First the owners see it (pitch), then their customers, mostly on a phone over 3G in Cuba.

**Build approach:** Tracer Bullet (each slice runs through every layer, from the módulo de contenido to a verified section on a real phone, before the next one starts).
**Workflow:** Alpha (after `/develop`, `/check verify` on the real export: weight script, Lighthouse, screenshots, real phone). The project default level of rigor. `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. `· Beta`) to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

Every feature below shares the same bar from `AGENTS.md`: weight script passes after the build, Lighthouse mobile on a slow network scores 90 or more on Performance and Accessibility with LCP at 3 s or less, Playwright screenshots at 375 and 1440 px (normal and reduced motion), and a check on a real phone. Each `Done when:` line adds only what is specific to that feature.

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| A | Stack, theme and static export | Foundation | existing |
| B | Content module and image pipeline | Foundation | existing |
| C | Verification scripts | Foundation | existing |
| 1 | Portada deployed | Slice 1 | done |
| 2 | Tipografía | Foundation | in-progress |
| 11 | Lighthouse estable | Foundation | done |
| 12 | Portada de día | Foundation | in-progress |
| 3 | El lugar | Slice 2 | planned |
| 4 | Visítanos | Slice 2 | planned |
| 5 | Animación protagonista | Slice 3 | planned |
| 6 | Menú | Slice 4 | planned |
| 7 | Galería | Slice 5 | planned |
| 8 | Pie | Slice 6 | planned |
| 9 | Vista previa al compartir | Slice 6 | planned |
| 10 | Demo lista para el pitch | Slice 6 | planned |

## Foundations (already there)

Built before this workflow, enrolled for context. `/develop` and `/sync` leave them alone.

### A. Stack, theme and static export · existing
Next.js App Router with `output: "export"`, Tailwind 4 through Turbopack, the single theme as CSS variables (`verde`, `dorado`, `crema`, `tinta`), `lang="es"` and `noindex` on the root layout (specs 0001, 0003, 0004, 0005). code in `src/app/`, `next.config.ts`

### B. Content module and image pipeline · existing
All editable content in one typed module; link builders for Maps, WhatsApp and Instagram with a Vitest test; image variants declared once and converted from `references/` to AVIF and WebP by sharp before each build, never served as originals. code in `src/content.ts`, `src/lib/`, `scripts/images.ts`

### C. Verification scripts · existing
The checks that close every slice: weight of the primera vista and the full page over a local gzip server, Playwright screenshots at 375 and 1440 px (normal and reduced motion), and Lighthouse mobile with a slow network. code in `scripts/weight.ts`, `scripts/shots.ts`, `scripts/lighthouse.ts`, `scripts/servidor.ts`

## Slice 1: Portada deployed

### 1. Portada deployed · done
The thinnest real thread: logo, frase and the three acciones on tono verde, one photo in AVIF and WebP, all text from the módulo de contenido, exported and served from a private URL. Everything later thickens this thread.
**Done when:** the static export passes every check in the shared bar; the deployed URL answers with `noindex` (meta and `X-Robots-Tag` header); the Portada opens on a real phone.
- [x] Decide the thread (plan): hosting, link data, Portada phrase, how to measure the primera vista (the old `docs/plan.md` is merged into this scope)
- [x] Build it: `/develop portada`
   - [x] Static skeleton: export, layout, theme, `.gitignore`
   - [x] Content module, link builders with test, Portada component
   - [x] Image pipeline and `<picture>` in the Portada
   - [x] Weight, screenshots and Lighthouse scripts, evidence in `.verify/slice-1/`
   - [x] Deploy to the chosen host with the `noindex` header (needs your login on the host)
   - [x] Open the deployed URL on a real phone
- [x] Verify it: `/check verify portada`
code in `src/components/Portada.tsx`, `src/app/page.tsx`, `public/_headers`

## Foundation for slice 2

### 2. Tipografía · in-progress
Self hosted fonts with a Latin subset (Playfair Display for titles, Rethink Sans for text since spec 0007 was updated on 2026-11-04), chosen so the page reads as the brand without leaving the primera vista budget. Cross cutting: every later section uses them, so they land before El lugar.
**Done when:** the font loads from the export (no third party request); the primera vista stays within budget with it; Lighthouse reports no layout shift; the fallback stack keeps the text readable while it loads.
spec [0007](../specs/0007-tipografia.md) · code in `src/app/layout.tsx`, `src/app/globals.css`, `src/components/Portada.tsx`, `scripts/lighthouse.ts`
- [x] Design it (spec): `/architect tipografía`
- [x] Build it: `/develop tipografía`
   - [x] Playfair Display loaded and the type tokens in `@theme` (AC-1, AC-2, AC-5, AC-8)
   - [x] Portada frase on `font-titulo` and `--text-frase`, still on 2 lines (AC-1, AC-7, AC-8, AC-10)
   - [x] CLS gate in `pnpm lighthouse`, worst of five runs (AC-4)
   - [x] Checks into `.verify/slice-tipografia/` and the real Android phone (AC-2, AC-3, AC-6, AC-7, AC-9)
- [x] Verify it: `/check verify tipografía`
- [x] Build it (Rethink Sans for text): `/develop tipografía`
   - [x] Rethink Sans loaded and wired through `--font-sans`, body family checked (AC-1, AC-2, AC-5, AC-11)
   - [x] Checks into `.verify/slice-tipografia-texto/` with both fonts preloaded, Performance under 90 accepted on reasoning (AC-2, AC-3, AC-4, AC-6, AC-7, AC-10)
   - [x] Deploy and the real Android phone (AC-9)
- [ ] Verify it: `/check verify tipografía`

### 11. Lighthouse estable · done
Surfaced while verifying the Portada: the Lighthouse check judges a single run, and on this machine one run of the same build swings from 67 to 98 on Rendimiento because of CPU load. It should run several times and judge the median, so a slice fails because of the page, not the laptop.
**Done when:** `pnpm lighthouse <N>` runs several times, prints every run and judges the median against the same limits; it still exits 1 when the median fails (checked with a lowered limit); every run's report is kept in `.verify/slice-N/`.
spec [0006](../specs/0006-lighthouse-estable/index.md)
- [x] Design it (spec): `/architect lighthouse estable` (ratified after the build)
- [x] Build it: `/develop lighthouse estable`
code in `scripts/lighthouse.ts`

### 12. Portada de día · in-progress
The visual direction lands here: the page becomes a journey from day green to night green, and the Portada is rebuilt on it (a full bleed garden photo, crema text, the gold frond, the pin button, a fixed bar). Every later section follows the standard in its spec, so it comes before El lugar.
**Done when:** the Portada matches the spec at 375 × 812, 375 × 667 and 1440 px, normal and reduced motion; the built CSS keeps the scroll animation properties; the primera vista stays near 208 KB with no new JS. The darkening and its smoothness on the real phone are checked in El lugar, the first slice with a page longer than one screen.
spec [0008](../specs/0008-direccion-visual/index.md)
- [x] Design it (spec): `/architect dirección visual`
- [ ] Build it: `/develop portada de día`
   - [ ] Content, image variants and the shared CSS: tokens, sky layer, fallback, utilities, motion (AC-1, AC-3, AC-4, AC-10, AC-11)
   - [ ] Fronda, ComoLlegar and Barra components (AC-7, AC-8, AC-9)
   - [ ] Portada rewritten on the new system (AC-5, AC-6, AC-9)
   - [ ] Checks into `.verify/slice-portada-dia/` and a first look on the phone (AC-12, AC-13, AC-14)
- [ ] Verify it: `/check verify portada de día`

## Slice 2: El lugar and Visítanos

### 3. El lugar
The first tono crema section after the Portada: what the place is (jardín de día, velas de noche), one or two photos, short copy from the módulo de contenido. Shows the crema and verde alternation for the first time.
**Done when:** the section reads from the módulo de contenido only; its photos go through the image pipeline with responsive sizes and lazy loading; the full page stays within budget.
- [ ] Build it: `/develop el lugar`

### 4. Visítanos · needs a decision
Tono verde section with the address, opening hours and the acción principal again, so the visitor who scrolled this far can go. The decision is how to show the location without an iframe: link only, a static image, or nothing but the address.
**Done when:** address and hours come from the módulo de contenido (hours stay provisional until the café confirms); "Cómo llegar" opens the same Maps destination as the Portada; the chosen map treatment adds no third party request and fits the budget.
- [ ] Design it (spec): `/architect visítanos`

## Slice 3: Animación protagonista

### 5. Animación protagonista · needs a decision
The single scroll linked animation of the page, in SVG and CSS, leading the eye from the Portada toward "Cómo llegar". The decisions are the motif and the fallback for browsers without CSS scroll driven animations (static, or a little JS within the JS budget).
**Done when:** the animation follows the scroll between the Portada and "Cómo llegar"; with `prefers-reduced-motion` everything is static; JS stays within the budget of spec 0005; screenshots at three scroll positions; smooth on a real Android phone (and iOS Safari if one is at hand).
- [ ] Design it (spec): `/architect animación protagonista`

## Slice 4: Menú

### 6. Menú · needs a decision
The Menú section with four categorías (Café, Brunch, Dulces, Batidos); switching a categoría animates its icono de categoría in gold line. Productos read from the módulo de contenido. The decisions are productos with or without photo, and how the categoría switch works as the page's only interactive island.
**Done when:** categorías can be switched with mouse, keyboard and screen reader (Accessibility 90 or more); the active icono animates on switch and stays static with reduced motion; productos and categorías live in the módulo de contenido (names provisional until the café confirms); JS stays within budget.
- [ ] Design it (spec): `/architect menú`

## Slice 5: Galería

### 7. Galería · needs a decision
A gallery of Instagram photos with lazy loading and responsive sizes. The decisions are which photos, how many, and whether watermarked ones are included (spec 0004).
**Done when:** every photo goes through the image pipeline; no original from `references/` is inside the export; the full page stays at 1,2 MB or less with the gallery in.
- [ ] Design it (spec): `/architect galería`

## Slice 6: Pie and pitch ready demo

### 8. Pie
The closing section: name, address, hours, the acciones secundarias and a short credit line, all from the módulo de contenido.
**Done when:** the Pie reads from the módulo de contenido only; links match the Portada builders; the page still passes the shared bar.
- [ ] Build it: `/develop pie`

### 9. Vista previa al compartir · needs a decision
When the URL is shared on WhatsApp, the preview shows the café's name, the frase and an image. The decision is which image and how it is composed, kept small and generated at build time.
**Done when:** the export carries title, description and a preview image in its metadata; a WhatsApp share shows them; the image is not an original from `references/`.
- [ ] Design it (spec): `/architect vista previa al compartir`

### 10. Demo lista para el pitch
Soft entrances for sections as they scroll into view (the fallback pattern from the animación protagonista spec), a full page pass of every check, and a way to show the demo offline: the exported `out/` folder served locally from a laptop or phone, documented in the repo.
**Done when:** every section enters softly and stays static with reduced motion; the whole page passes the shared bar; the URL opens from a Cuban connection; the offline showing works from `out/` with the steps written down.
- [ ] Build it: `/develop demo lista para el pitch`

## Deferred
Out of scope for the demo, kept so the plan stays honest. Most unlock only when the café accepts.
- **Contenido confirmado por el café**: replace provisional content (product names, hours, phone, photos with permission) with what the café confirms.
- **SEO público tras aceptar**: drop `noindex`, add a sitemap, local business structured data and a domain of its own · needs a decision
- **Analítica ligera sin cookies**: anonymous visit and click counts for "Cómo llegar" and WhatsApp, no consent banner · needs a decision
- **Lighthouse según la máquina**: the Performance score moves with the laptop's CPU (`benchmarkIndex` 2100 in slice 1, 1060 to 1360 on 2026-11-05, same JS); make the gate account for it (adjusted CPU slowdown or a fixed environment) so a slice fails because of the page · needs a decision · from spec 0007
- **Límites por env var validados**: `pnpm lighthouse` and `pnpm weight` fail when a limit env var is not a number, instead of reading an empty string as 0 · from spec 0006
- **Precios y pedidos**: prices, orders and reservations, left out of v1 by `AGENTS.md`; a possible v2 · needs a decision

## Legend

**The decision box.** Every feature carries exactly one, the sub task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | `/architect` at spec capture | `Design it` ticked; spec linked; `Build it: /develop <feature>` + 2 to 5 milestones; the tier's closing boxes (`Verify it` at Alpha and above, `Test it` at Beta and above, `Review it` + `Document it` at GA); any surfaced follow up enrolled |
| `in-progress` (building) | `/develop` | milestone sub boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` + milestones ticked; `Verify it` ticked |
| `done` | you, when you decide it is (any skill sets it when you say so); `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; the tier's last stage (`Prototype` after `/develop`; `Alpha` after `/check verify`; `Beta` and `GA` after `/test`) is the suggested point to call it done |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop`. The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (built before the workflow) and `dropped` (out of scope, kept for history).
- **Approach tag** beside a heading (e.g. `· Facade`) overrides the project default for that feature; no tag = inherits it.
- **Workflow tier tag** beside a heading (e.g. `· Beta`, `· Prototype`) sets that one feature's rigor above or below the project default; no tag inherits the default.
- **Workflow** (header line) is the project default, what runs after `/develop`: **Prototype** = nothing; **Alpha** = `/check verify`; **Beta** = `/check verify` then `/test`; **GA** = adds a fresh model `/check review` then `/document`. A feature built on an unratified decision (an `Assumed` spec) stays flagged, but that never blocks `done`.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
