# 0008. Visual direction: a garden green that turns to night

**Date**: 2026-11-04
**Status**: In Progress

## Summary

The whole page becomes one journey from day to night: it opens on today's bottle green with a full
bleed garden photo (a photo edge to edge, no margins) and the background darkens as you scroll until
Visítanos sits in a night green, with every word in crema. Arches, a gold line frond drawn from the
logo and light CSS motion are the shared language every section reuses. It was chosen because the
current Portada looks empty and generic, and the brand's own phrase ("De día, jardín. De noche,
velas.") gives the page a story without adding weight. The first build rebuilds the Portada on this
system; later sections follow the standard below.

## Requirements

**User stories**:
- As one of the café owners seeing the pitch, I want a Portada that feels made for my café, so that
  the demo stands out from a template.
- As a customer on a phone over 3G, I want the page to load as fast as today and tell me at once
  where and when to go, so that I can get there.
- As the developer of El lugar, Menú, Galería and Visítanos, I want one visual standard, so that
  each section looks like the same page without new decisions.

**Acceptance criteria** (AC-1 to AC-4 are the system; AC-5 to AC-15 are the Portada slice; AC-2 and
AC-15 need a page longer than one screen, so they are checked in the El lugar slice):
- **AC-1**: `@theme` gains one colour, `--color-noche: #0b1810`; no other new colour. Crema is never
  a section background, only text, details and the grain.
- **AC-2** (checked in the El lugar slice): with `animation-timeline` supported and no reduced
  motion, the background darkens continuously from `verde` at scroll 0 to `noche` at the end of the
  page, through the fixed `.cielo` layer whose `::before` opacity follows the root scroll; no
  `background-color` is animated. Checked with Playwright:
  `getComputedStyle(document.querySelector('.cielo'), '::before').opacity` is under 0.05 at the
  top and over 0.95 at the end.
- **AC-3**: with `prefers-reduced-motion: reduce`, or without `animation-timeline`, nothing moves and
  the page shows the fallback: a static gradient on `<html>` from `verde` (until 100svh) to `noche`
  (at the end). Both conditions switch the same declaration, so the reduced motion screenshots
  check the no support path too.
- **AC-4**: all text is crema, except the "Cómo llegar" button (`noche` on `dorado`, 7.72) and the
  etiquetas (`dorado`). No text sits over any part of a photo whose mask is above 0. Lighthouse
  Accessibility is 90 or more with no `color-contrast` failure.
- **AC-5**: the Portada (`id="portada"`, at least 100svh tall) shows photo #12 full bleed, with
  `object-fit: cover` and `object-position: center`. Below 900 px the photo fills the top 52svh and
  fades to transparent through the mobile mask (Standard definition); the text block starts below
  it, with no overlap. From 900 px the photo fills the whole Portada and fades to the left and to
  the bottom through the desktop mask; the text column (from `8vw`, at most 26rem wide) sits
  entirely where that mask is 0.
- **AC-6**: the text block holds, in order: the etiqueta "Miramar · La Habana", the frase as the
  `<h1>` (still 2 lines, spec 0007 AC-10), the frond at 16 × 46 px, the horario, the "Cómo llegar"
  button, then "WhatsApp · Instagram". At 375 × 812 all of it is inside the first screen; at
  375 × 667 the "Cómo llegar" button is fully inside it. Every string comes from `src/content.ts`.
- **AC-7**: "Cómo llegar" is the `ComoLlegar` component: a gold pill (`dorado` background, `noche`
  text, `rounded-full`), a location pin icon before the text, at least 48 px tall, the same Maps
  destination as today (`comoLlegarUrl`). It appears in the Portada and in Visítanos only, never in
  the bar. Checked with Playwright: its bounding box is at least 48 px tall.
- **AC-8**: a fixed bar (`<header>`, `z-index: 10`, 64 px plus `env(safe-area-inset-top)`) holds
  the logo (40 × 40, a link to `#portada`) and one anchor per section that already exists,
  separated by "·" in crema, over an 88 px gradient from `noche` to transparent; it has no button.
  `<html>` gets `scroll-padding-top: 64px`. In this slice no section exists yet, so the bar shows the
  logo only.
- **AC-9**: on load the etiqueta, frase, horario, button and secondary links rise in steps and the
  frond draws itself. The Portada photo is visible from the first paint and never animated on load;
  its parallax starts only on scroll. The `largest-contentful-paint-element` audit of the median
  Lighthouse run names the Portada `<img>`, and the median LCP stays at 3 s or less.
- **AC-10**: every hand written `:hover` rule in `globals.css` sits inside `@media (hover: hover)`
  (Tailwind 4 already does this for `hover:` classes); every link shows the crema focus ring.
- **AC-11**: the grain is an inline SVG noise in crema tones inside the CSS: no image request, and
  its data URI in the built CSS is under 1 KB.
- **AC-12**: the primera vista stays within 300 KB (expected about 208 KB); the 828 px AVIF of the
  Portada photo is 45 KB or less; no client JavaScript is added (JS stays within spec 0005).
- **AC-13**: the CLS of the worst Lighthouse run stays at 0.02 or less.
- **AC-14**: the built CSS in `out/` still contains `animation-timeline`, `view-timeline` or
  `scroll(root)`, `mask-image` and `-webkit-mask-image` (Turbopack and its CSS minifier keep them).
- **AC-15** (checked in the El lugar slice): on the Android phone used in slice 1, scrolling from
  top to bottom shows the darkening, no edge where the Portada photo ends, and no visible stutter.
  If it stutters, remove the grain first, then the parallax, and check again; if it still
  stutters, stop and return to `/architect`.

## Decision

**Chosen option**: Option 1, De día a de noche, in the engineer's variant (a green that darkens,
crema text throughout).

One background journey from `verde` to `noche` carries the page; arches, the logo frond, spaced
etiquetas and light CSS motion are the shared vocabulary, and the Portada is its first build.
Amends spec 0003 AC-1 (crema and verde alternation is replaced by the journey; its AC-2 and AC-3
still hold) and spec 0007 AC-1 (the frase becomes the `<h1>`; the logo moves to the bar). Reads the
AGENTS.md rule "una única animación protagonista ligada al scroll" this way: the darkening is the
stage the animación protagonista (scope 5) is built on; parallax and reveals are microinteractions.

## Rationale

Reasoning, options and evidence: see [rationale.md](rationale.md).

## Standard definition

Every section built after this spec follows these rules. The Portada slice builds the shared pieces.

**Colour and tone**:
- Day to night: `<div className="cielo" aria-hidden>` is the first child of `<body>`: fixed,
  `inset: 0`, `z-index: -1`, no pointer events. Its `::before` is `noche` at opacity 0, animated to
  1 with `animation-timeline: scroll(root)`; its `::after` is the grain at full opacity with no blend
  mode.
- Fallback: `html { background: var(--fondo, var(--color-verde)); }`. Inside
  `@media (prefers-reduced-motion: reduce)` and inside `@supports not (animation-timeline: scroll())`,
  set `--fondo: linear-gradient(to bottom, var(--color-verde) 100svh, var(--color-noche) 100%)`. The
  `.cielo::before` animation sits inside `@supports (animation-timeline: scroll())` and
  `@media (prefers-reduced-motion: no-preference)`, so the two never stack.
- Sections set no background of their own.
- Text crema; `dorado` for etiquetas, the frond, underlines and as the button fill. Measured
  contrast: crema on verde 9.79, crema on noche 15.90, dorado on verde 4.75, dorado on noche 7.72,
  noche on dorado 7.72.
- Images that touch an edge fade with `mask-image` (and `-webkit-mask-image`) to transparent, never
  with a gradient to a fixed colour. The mask goes on the `<picture>`, any transform on the `<img>`,
  so the fade stays put while the photo moves.
- Mobile mask (Portada, below 900 px): `linear-gradient(to bottom, #000 40%, rgb(0 0 0 / .8) 58%,
  rgb(0 0 0 / .45) 73%, rgb(0 0 0 / .15) 88%, transparent 100%)`.
- Desktop mask (Portada, from 900 px): `linear-gradient(to right, transparent calc(8vw + 26rem),
  #000 calc(8vw + 26rem + 22vw))` intersected (`mask-composite: intersect`,
  `-webkit-mask-composite: source-in`) with `linear-gradient(to bottom, #000 45%, rgb(0 0 0 / .8)
  61.5%, rgb(0 0 0 / .45) 75.25%, rgb(0 0 0 / .15) 89%, transparent 100%)`. A plain two stop fade
  leaves a visible band; keep the eased stops.
- Grain: an SVG `feTurbulence` noise (`baseFrequency` .9, two octaves, 160 px tile) whose colour
  matrix outputs crema at alpha about .07, as a data URI.

**Type**: titles follow spec 0007. Each section opens with an etiqueta: the `etiqueta` utility
(system sans, `0.75rem`, uppercase, `letter-spacing: 0.28em`, `dorado`).

**Photos**: arches (`arco` utility: `rounded-t-full`, aspect 4 / 5, `overflow-hidden`) everywhere
except the Portada, the only full bleed photo. Selection rule: hands yes, faces no (still life, the
garden, candles, hands serving or holding). The Galería pattern is decided by `/architect galería`.

**Ornament**: the `Fronda` SVG, a gold line frond drawn from the logo's palm, `stroke-width` 1.6,
always 16 × 46 px. Between sections: a short line, the frond, a short line (`Divisor`).

**Links and buttons**: the acción principal is always `ComoLlegar` (AC-7); hover (under
`(hover: hover)`) lifts it 2 px with a soft gold shadow. Secondary links use `subraya`: a gold
underline that grows from the left on hover. Lists of links are separated by "·".

**Bar**: AC-8. When the first anchor arrives (El lugar), the anchor of the section on screen turns
gold and underlined through CSS view timelines (`view-timeline` on each section, `timeline-scope`
on `<body>`, `animation-range: cover 30% cover 70%`); no JS. Without support, no highlight.

**Motion vocabulary** (tokens in `globals.css`; only `transform`, `opacity`, `clip-path` and
`stroke-dashoffset` are animated):

| Class | What moves | Timing | Trigger |
|---|---|---|---|
| `entra` | rises 18 px and fades in | Portada: 800 ms, `cubic-bezier(.2,.7,.2,1)`, steps of 110 ms after 150 ms (`--i` sets the step). Later sections: `view()`, entry 0 % to entry 60 % | load in the Portada; view later |
| `dibuja` | the frond stroke draws (`pathLength="1"`, dash offset 1 to 0) | load: 1.4 s ease out after 500 ms; view: entry 20 % to cover 45 % | load or view |
| `revela` | an arch photo uncovers from the bottom (`clip-path: inset(100% 0 0 0)` to none) and settles from scale 1.12 | `view()`, entry 0 % to cover 35 % | view |
| `paralaje` | the Portada `<img>` moves down 12 % of its own height and scales to 1.06 | `scroll(root)`, range 0 to 100svh | scroll |

- Time based entrances (`entra` and `dibuja` on load) run in every browser. Scroll and view ones sit
  inside `@supports (animation-timeline: scroll())`. Everything sits inside
  `@media (prefers-reduced-motion: no-preference)`.
- Never animate the LCP element on load (opacity 0 delays LCP until it shows).

**Canonical pattern** (a later section, sketched):
```tsx
<section id="lugar" aria-labelledby="lugar-titulo" className="px-6 py-24">
  <p className="etiqueta entra">{lugar.etiqueta}</p>
  <h2 id="lugar-titulo" className="font-titulo text-titulo font-semibold entra">{lugar.titulo}</h2>
  <figure className="arco">
    <picture className="revela">{/* <source> AVIF + <img> WebP, loading="lazy" */}</picture>
  </figure>
</section>
<Divisor />
```

**Replaces**:
- Crema sections alternating with verde (spec 0003 AC-1).
- The Portada logo as `<h1>`, and a single arch photo beside the text.
- The bare "Cómo llegar" pill: it gains the pin and moves into one component.

**Enforcement**: review against this section plus the screenshots of every slice (375 × 812,
375 × 667 and 1440 px, normal and reduced motion); the existing "no loose colours" rule keeps
colours inside `@theme`. No lint rule is practical for visual rules.

**Rollout**: new code from now on. The Portada is rebuilt in this spec's slice; nothing else exists
yet.

**Exceptions**: none. A section that needs a crema surface (for example a paper card in the Menú)
updates this spec first.

## Feature design (the Portada slice)

**Data model sketch**: none stored. New and changed fields in `src/content.ts`:
- `portada.foto.origen` → `references/img-1_files/583783959_17950113657029391_3103025115156968219_n.jpg`
  (#12); `alt`: "Batidos y limonadas con pajitas doradas sobre una mesa del jardín".
- `portada.etiqueta`: "Miramar · La Habana".
- `cafe.horario`: "Todos los días · 8:00 a 23:00" (provisional; Visítanos reuses it).
- `navegacion`: `{ id: string; etiqueta: string }[]`, empty in this slice.
- `portada.frase` and `portada.acciones` keep their values.

**Interface surface**:
| Surface | Where | Shape |
|---|---|---|
| Colour token | `src/app/globals.css` `@theme` | `--color-noche: #0b1810` |
| Sky layer and fallback | `globals.css`; `<div className="cielo" aria-hidden />` first in `<body>` (`src/app/layout.tsx`) | as in Colour and tone |
| Utilities | `globals.css` `@utility` | `etiqueta`, `subraya`, `arco` |
| Motion | `globals.css` | the four classes in the vocabulary table plus their `@keyframes` |
| Image variants | `src/lib/imagenes.ts` | `portadaMovil: { anchos: [480, 640, 828, 1080], proporcion: 4 / 3 }` and `portadaAncha: { anchos: [1280, 1600, 1920], proporcion: 5 / 8 }` (`proporcion` is height / width, as in the code) |
| Image generation | `scripts/images.ts` | two `generar` calls from `portada.foto.origen`, crop centred; files `portadaMovil-828.avif` and so on via `ruta()` |
| `Fronda` | `src/components/Fronda.tsx` | Server Component, `<svg viewBox="0 0 40 120" aria-hidden>` with one `pathLength="1"` path; `className` adds motion classes |
| `ComoLlegar` | `src/components/ComoLlegar.tsx` | Server Component, an `<a>` to `comoLlegarUrl` of the café name and address (as the Portada builds it today) with an inline pin SVG (`aria-hidden`, 1em) and `portada.acciones.comoLlegar`; `className` prop for motion |
| `Barra` | `src/components/Barra.tsx` | Server Component; `<header>` fixed, logo link to `#portada`, `<nav aria-label="Secciones">` only when `navegacion` is not empty |
| `Portada` | `src/components/Portada.tsx` | rewritten: `<picture>` with four sources in order (AVIF and WebP of `portadaAncha` with `media="(min-width: 900px)"`, then AVIF of `portadaMovil`) and an `<img>` WebP of `portadaMovil`; `sizes="100vw"`; `fetchPriority="high"`; the box size comes from CSS (52svh, or `inset: 0` from 900 px), not from `width`/`height`; text block per AC-6 |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Paint background | Day and night colours | `--color-verde` (existing), `--color-noche` (AC-1) |
| Paint background | Darkness at a scroll position | Root scroll progress (`scroll(root)`) |
| Paint fallback | Gradient | `--fondo` in `globals.css`, from the two tokens |
| Paint grain | Noise and colour | SVG data URI in `globals.css` (Colour and tone) |
| Render Portada | Photo, alt | `portada.foto` in `src/content.ts` |
| Render Portada | Crops and widths | `variantes.portadaMovil` / `portadaAncha` in `src/lib/imagenes.ts` |
| Render Portada | Photo height, switch point, masks, text column | 52svh, 900 px, mask stops, `8vw` + 26rem: this spec |
| Render Portada | Etiqueta, frase, horario | `portada.etiqueta`, `portada.frase`, `cafe.horario` |
| Render Portada | Link texts | `portada.acciones` |
| Render Portada | Maps, WhatsApp, Instagram URLs | `comoLlegarUrl`, `whatsappUrl`, `instagramUrl` in `src/lib/links.ts`, fed by `cafe` |
| Render button | Pin icon | Inline SVG in `ComoLlegar.tsx` (a map pin outline, `stroke-width` 1.8) |
| Render bar | Logo image and alt | `cafe.logo`, variant `logo` (existing) |
| Render bar | Anchors | `navegacion` in `src/content.ts` |
| Render bar | Active anchor | Each section's view timeline (from El lugar on) |
| Animate | Durations, delays, easing, ranges | Motion vocabulary table, this spec |
| Judge AC-2 | Darkness | Computed opacity of `.cielo::before` (Playwright) |
| Judge AC-9 | LCP element | `largest-contentful-paint-element` audit in the median run JSON |

**Key invariants**:
- No client JavaScript; every component is a Server Component.
- No section paints its own background.
- The LCP photo is never hidden on load; only text and ornament use `entra` and `dibuja`.
- Every colour comes from `@theme`.
- No text over a masked photo area that is above 0.

**Security model**: public static page, no data. Spec 0004 still applies: IG photos only in the
private demo with `noindex`; the "hands yes, faces no" rule lowers that exposure.

**Critical test scenarios**:
- Happy path: `pnpm build`, then screenshots at 375 × 812 and 1440 px show the Portada per AC-5 and
  AC-6, verifies **AC-5**, **AC-6**, **AC-8**
- Short phone: a 375 × 667 capture with the whole button visible, verifies **AC-6**
- Button: Playwright reads the bounding box height and the `href`, verifies **AC-7**
- Reduced motion: the reduced motion screenshots show the final state at once over the fallback
  gradient, verifies **AC-3**, **AC-9**
- Gates: `pnpm weight` and `pnpm lighthouse` pass; the LCP element is the photo, verifies **AC-4**,
  **AC-9**, **AC-12**, **AC-13**
- Built CSS: `grep` over `out/_next/static` for the properties in AC-14 and the grain data URI
  length, verifies **AC-11**, **AC-14**
- Rule check: `grep` for `:hover` in `globals.css` and for hex colours outside `@theme`, verifies
  **AC-1**, **AC-10**
- El lugar slice: the opacity reading and the real phone, verifies **AC-2**, **AC-15**

## Build plan

Tracer Bullet: the thinnest thread from the content module through the pipeline, tokens and
components to a verified Portada; the shared pieces land here because the Portada is their first
user. Each step leaves `pnpm build` green.

1. [x] `src/content.ts`: photo #12 with its alt, `portada.etiqueta`, `cafe.horario` (provisional),
   empty `navegacion`, satisfies **AC-6**, **AC-8**
2. `src/lib/imagenes.ts` and `scripts/images.ts`: add `portadaMovil` and `portadaAncha` next to the
   old `portada` (removed in step 6); run `pnpm images` and check the 828 px AVIF is 45 KB or less,
   satisfies **AC-5**, **AC-12**
3. `src/app/globals.css`: `--color-noche`, `.cielo` with grain and `anochecer`, the `--fondo`
   fallback, the utilities and the motion vocabulary; `<div className="cielo">` in
   `src/app/layout.tsx`, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-10**, **AC-11**
4. `src/components/Fronda.tsx` and `src/components/ComoLlegar.tsx`, satisfies **AC-7**, **AC-9**
5. `src/components/Barra.tsx`, rendered in `src/app/page.tsx`, satisfies **AC-8**
6. Rewrite `src/components/Portada.tsx` (full bleed photo with masks, text block, `entra` steps,
   `paralaje`); remove the old `portada` variant and its `generar` call, satisfies **AC-4**, **AC-5**,
   **AC-6**, **AC-7**, **AC-9**
7. Checks into `.verify/slice-portada-dia/`: `pnpm build`, the built CSS `grep`, `pnpm weight`,
   `pnpm lighthouse`, `pnpm shots`, plus the 375 × 667 capture and the button box reading,
   satisfies **AC-3**, **AC-4**, **AC-6**, **AC-7**, **AC-9**, **AC-11**, **AC-12**, **AC-13**, **AC-14**
8. `pnpm deploy:pages` and a first look on the real Android phone (the full AC-15 check waits for
   El lugar), satisfies **AC-5**, **AC-6**

## Consequences

**Positive**:
- The page tells the brand's own story, and the darkening leads the eye toward Visítanos, the
  acción principal at night.
- No new JavaScript and about 7 KB more in the primera vista.
- Later sections inherit tone, type, photo shape, ornament, motion and the button with no new
  decisions.
- Browsers without scroll animations still get a seamless darkening (the static gradient).

**Negative / tradeoffs**:
- The fixed full screen layer with grain is the riskiest piece on cheap Android phones; AC-15 sets
  the order of what to cut, and it is only judged once the page is long (El lugar).
- The darkening and the parallax cannot be verified in this slice: the page is one screen tall
  until El lugar lands.
- The bar has no "Cómo llegar": a visitor deep in the page reaches it only in Visítanos or by going
  back to the top.
- Crema disappears as a surface, so the page is dark from top to bottom; the photos carry the light.
- The full bleed photo makes the Portada depend on one Instagram photo without permission (spec
  0004) until the café confirms it.
- Two ways to paint the background (layer and fallback gradient) to keep in sync.

**Neutral**:
- `--color-tinta` has no use after this slice (it was text on crema).
- The timing values are a starting point; the screenshots and the real phone may tune them.
- `pnpm shots` covers 375 × 812 and 1440 px; the 375 × 667 capture is a one off Playwright step in
  `/check verify`, unless it proves worth adding to the script.

## Follow-up

- [ ] `/sync`: AGENTS.md "Diseño" still says crema and verde alternate; replace with the day to
      night journey, add `--color-noche` to the colour line, and record the reading of "una única
      animación protagonista" from the Decision.
- [ ] `/scope`: El lugar's row says "the first tono crema section" and "the crema and verde
      alternation"; rewrite it for this direction, and move AC-2 and AC-15 of this spec into its
      `Done when`. Feature 10 (soft entrances) becomes a full page pass of the vocabulary already
      applied by each slice.
- [ ] Animación protagonista spec: build its motif on the darkening (a sun that sets toward a
      candle, or the frond).
- [ ] El lugar slice: add its anchor to `navegacion` and the view timeline highlight; check it in
      Chrome and Safari (`timeline-scope` support was not verified).
- [ ] Remove `--color-tinta` if it is still unused after Visítanos.
- [ ] The `Fronda` path is an approximation of the logo; trace it closer from the logo file if the
      owners notice.
