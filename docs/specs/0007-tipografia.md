# 0007. Playfair Display for titles and Rethink Sans for text, loaded at build time

**Date**: 2026-10-31 (updated 2026-11-04: Rethink Sans replaces the system sans; updated
2026-11-05: the Performance gate judged on reasoning)
**Status**: In Progress

## Summary

The page uses two fonts of its own. Titles keep Playfair Display at weight 600 (built on
2026-11-02). Everything else (body text, the "Cómo llegar" button, the WhatsApp and Instagram links)
moves from the phone's own sans to Rethink Sans, one variable file (a single font file that holds
every weight from 400 to 800). Next.js downloads both fonts while it builds and serves them from our
own domain, and the visitor's phone never asks Google for them. The fonts now add about 58 KB to the
primera vista instead of 23 KB, and text still shows at once in the device's own fonts while the
real ones arrive. On 2026-11-05 the Lighthouse Performance score fell just under 90 on a laptop
running much slower than in earlier slices; the design stays as it is, and that part of the gate is
accepted on the recorded evidence.

## Context

> ⚠️ Premise note: this update reverses the 2026-10-31 call that body text never waits on a
> download. The gain is look only (the engineer wants more personality next to Playfair); the 3G
> visitor gets nothing they can use, and pays about 0.7 s more of download at 400 kbps. `swap`
> keeps that cost off the first paint, but the button and links now change letter shapes once the
> file arrives. Accepted as a pitch decision; the real phone check (AC-9) is where it is judged.

Before this spec the page had no font of its own: the Portada frase rendered in whatever sans the
device ships (Segoe UI on Windows, Roboto on Android). The logo uses a geometric sans in wide spaced
capitals, but it is an image, so nothing in the live text carries the brand. The first audience is
the owners during the pitch, who judge the look; the second is their customers on a phone over 3G
in Cuba, who need the text readable at once.

Forces, measured on 2026-10-31:
- **Weight.** The primera vista is 178.6 of 300 KB (`pnpm weight`), so about 121 KB are left for
  the font, El lugar, the animación protagonista and the Menú. A font is not JS, so the JS budget
  (170.5 of 180 KB, spec 0005) is untouched.
- **Layout shift.** A web font arrives after the first paint. If the stand in font has different
  widths, lines rewrap and the "Cómo llegar" button and the photo jump. The scope asks for "no
  layout shift"; the Lighthouse script prints CLS but does not judge it. Baseline: CLS is 0 in all
  five saved runs of slice 1. Lighthouse loads the page from a local server and only simulates the
  slow network, so it barely sees a font swap; only a real phone on mobile data does.
- **No third party requests at runtime**, no server (spec 0001): the font must ship inside `out/`.
- **Spanish text**: á, é, í, ó, ú, ñ, ü, ¿ and ¡ must render in the brand font, not in a mixed
  fallback glyph.
- **Android.** Phones in Cuba are mostly Android, which has no Times New Roman and no Georgia;
  its serif is Noto Serif.

Forces for the text font, measured on 2026-11-04 with Playfair already shipped:
- **Weight.** The primera vista is 202.2 of 300 KB, Playfair 22.8 KB of it. Rethink Sans Latin
  from Google Fonts: 400 alone 15.5 KB, 600 alone 16.0 KB; asking for 400 and 600, or for 400..800,
  returns one variable file of 34.8 KB.
- **Weights in use.** Body text and links are 400; the "Cómo llegar" button is `font-semibold` (600).
- **Lighthouse margin.** In the five saved runs of `slice-tipografia`, LCP (when the largest element
  appears) is 2.5 to 2.97 s (median about 2.65 s) and Performance is 76 to 91 (89 or 90 in the
  middle runs). Another preloaded file competes with the Portada photo for the same 3G bandwidth.
- **No size matched stand in.** Turbopack emits no adjusted fallback face (found 2026-11-02), so
  while Rethink loads the text shows in the device's sans with different letter widths.

Forces measured on 2026-11-05, after the first run of build step 10:
- **The gate result.** Median Performance 87 with Rethink preloaded (LCP 2.86 s) and 88 with
  `preload: false` on Rethink (LCP 2.69 s); CLS 0 and Accessibility 100 in all ten runs; the fonts
  sum 57.7 KB and the primera vista 237.4 KB.
- **The machine.** Lighthouse rates the CPU before each run (`benchmarkIndex`, higher is faster)
  and then applies the same ×4 slowdown on any machine. Slice 1 ran at 1940 to 2190, the Playfair
  slice at 1540 to 1870, these runs at 1060 to 1360. The JS is the same 170.5 KB in all three, yet
  TBT (the time JS blocks the main thread) went from 160 to 237 ms in slice 1 to 190 to 540 ms now.
- **The LCP element** is the Portada photo, so a font can delay it only by taking bandwidth.
- One run with Rethink and no preload scored 94.

## Requirements

**User stories**:
- As one of the café owners seeing the pitch, I want the titles to look like a brand, not like a
  default web page, so that the demo feels made for my café.
- As one of the café owners, I want the button, links and body text to share one designed sans, so
  that the page has its own personality next to the titles instead of each phone's default.
- As a customer on 3G, I want to read the frase and the "Cómo llegar" button the moment the page
  paints, so that I never stare at blank or jumping text.
- As the developer of the next slices, I want one rule for title type and one for text type, so
  that El lugar, Menú, Galería and Visítanos look the same without new decisions.

**Acceptance criteria**:
- **AC-1**: The Portada frase (the `<p>` under the logo; the `<h1>` stays the logo image) renders in
  Playfair Display at weight 600 through the `font-titulo` utility. Body text, the "Cómo llegar"
  button and the WhatsApp and Instagram links render in Rethink Sans through Tailwind's `--font-sans`
  (no font class on `<body>` or on the components).
- **AC-2**: Both fonts are served from the export itself: their `.woff2` files live under
  `out/_next/static/media/`, and `grep -rE "fonts\.(googleapis|gstatic)\.com" out/` finds nothing.
- **AC-3**: The `.woff2` lines in the "Primera vista, por recurso" list of `pnpm weight` add up to
  60 KB or less (KB of 1024 B, as the script prints), and the primera vista stays within 300 KB.
- **AC-4**: CLS of the worst of the five Lighthouse runs is 0.02 or less; a missing CLS value counts
  as a failure; `pnpm lighthouse` exits 1 when either happens (proven with `LIGHTHOUSE_CLS=-1`).
- **AC-5**: Text is never invisible while the fonts load (`font-display: swap`): the frase paints at
  once in the generic `serif`, and the button and links in the device's sans (`system-ui`, then
  `sans-serif`). No metric adjusted fallback face is required (Turbopack does not emit one). With
  every `.woff2` request blocked in Playwright, a 375 px capture shows the frase in a serif on 2
  lines, the "Cómo llegar" label on 1 line, nothing overflowing, and the button at the same height
  as with the fonts loaded.
- **AC-6**: With both fonts preloaded, the shared bar still holds: LCP 3 s or less, Performance and
  Accessibility 90 or more in the median run, JS within spec 0005. The Performance part was accepted
  on reasoning on 2026-11-05 (see Decision); LCP, Accessibility and JS stay hard.
- **AC-7**: The fonts really load: after `networkidle`, `document.fonts` holds a Playfair face and a
  Rethink Sans face, both with status `loaded`; every accented character in the frase ("De día,
  jardín.") shows in Playfair Display and the "ó" of "Cómo llegar" in Rethink Sans, in the
  screenshots at 375 and 1440 px, normal and reduced motion.
- **AC-8**: Title sizes come only from the `@theme` tokens `--text-frase` and `--text-titulo`. The
  title font is used only at weight 600 and never below 1.25rem (20 px). Text in Rethink Sans uses
  only weights 400 to 800 (`font-normal` to `font-extrabold`). Checked by searching `src/`: every
  `font-titulo` use carries a size token and `font-semibold` and no other size class, and no
  `font-thin`, `font-extralight`, `font-light` or `font-black` appears.
- **AC-9**: On a real Android phone, a first visit over mobile data shows the frase switching to
  Playfair Display while keeping the same number of lines, and the button and links switching to
  Rethink Sans with "Cómo llegar" on 1 line, with no visible move of the button. If it fails, the
  build stops and returns to `/architect` instead of improvising a fix.
- **AC-10**: The frase keeps exactly 2 lines, one sentence per line, at 375 and 1440 px; only the
  `ch` value of its `max-w-[16ch]` may change to get there.
- **AC-11**: With the fonts loaded, `getComputedStyle(document.body).fontFamily` starts with the
  Rethink Sans family that `next/font` names, and the frase's starts with the Playfair Display one.

## Options considered

### Option 1: System fonts only, better tuned

Keep the device fonts and give the titles a stronger size, weight and spacing.

**Pros**:
- 0 KB, nothing to load, no shift possible.

**Cons**:
- Each phone shows a different face, and the frase reads as a generic page in front of the owners.

### Option 2: One brand serif for titles only, through `next/font/google`

A single display serif at one weight for the frase, section titles and Menú product names; body
text stays on the system sans. `next/font/google` fetches it at build time, keeps the Latin subset,
self hosts it and generates a size matched fallback.

**Pros**:
- One file of about 23 KB; the brand shows where the eye lands first.
- Body text never swaps, so only title lines can move.
- No metrics or preload tags written by hand.

**Cons**:
- The build needs internet: `next build` stops with "Failed to fetch ... from Google Fonts" when
  the download fails (in `dev` it only logs and falls back).
- Under Turbopack (this project's bundler) `next/font` 16.4.3 does not emit the adjusted fallback
  face at all; only a webpack build does (found during `/check verify`, 2026-11-02).
- Button, links and body still differ on every phone.

### Option 3: Two families, a serif for titles plus a designed sans for text

Option 2 for titles, plus a sans for everything else, both through `next/font/google`. For the
sans (2026-11-04): Rethink Sans variable 400..800 (34.8 KB), or Rethink Sans 400 only (15.5 KB,
which keeps the old 40 KB font cap but drops the button to weight 400).

**Pros**:
- The strongest and most uniform brand voice; the same text face on every phone.
- Same loader, same self hosting, no new tool.

**Cons**:
- 34.8 KB more on 3G (15.5 KB for 400 only), and a second preload next to the LCP photo.
- Every line of text swaps once the file arrives, so more of the page can shift.

### Option 4: Same fonts, files committed and loaded by hand

The `.woff2` and its license in the repo, loaded with `next/font/local` or a plain `@font-face`.

**Pros**:
- The build works offline and always produces the same file.

**Cons**:
- The subset is cut by hand, and the fallback metrics are either limited to Arial or Times New
  Roman (`next/font/local`) or written and kept up to date by hand (`@font-face`).

## Decision

**Chosen option**: Option 3: Two families, a serif for titles plus a designed sans for text
(Option 2 shipped first on 2026-11-02; the text font was added on 2026-11-04).

- **Titles**: Playfair Display, weight 600, Latin subset, `display: 'swap'`, preloaded, exposed as
  the Tailwind utility `font-titulo` and used for the Portada frase, section titles (`h2`) and Menú
  product names.
- **Text**: Rethink Sans variable (weights 400 to 800 in one file), Latin subset, `display: 'swap'`,
  preloaded, `fallback: ['system-ui', 'sans-serif']`, exposed by pointing Tailwind's `--font-sans`
  at it in `@theme inline`, so every text without `font-titulo` uses it with no class anywhere.

**Fallback under Turbopack (updated 2026-11-02)**: the build ships without a metric adjusted
fallback face for either font; while they load, titles show in the generic `serif` and text in the
device's sans. Accepted as is: no hand written `@font-face` with copied metrics, and no switch to
webpack. Runner up: a hand written fallback face in `globals.css` with the values webpack computes,
rejected because it only helps devices with Times New Roman or Arial (laptops, iPhone), not the
Android majority, and leaves metrics to keep in sync by hand.

**Performance gate (updated 2026-11-05)**: Rethink Sans stays the variable file and stays
preloaded, as decided above. A median Performance under 90 in build step 10 is accepted on the
2026-11-05 evidence (machine at `benchmarkIndex` 1060 to 1360, the same JS as slice 1, one run at
94) instead of changing the fonts. LCP 3 s or less, Accessibility 90 or more, CLS 0.02 or less and
the weight caps still stop the build when they fail. Runner up: `preload: false` on Rethink only
(the recommendation), which measured 160 ms less LCP in the median.

## Rationale

The pitch needs a recognisable voice and the 3G visitor needs text at once. Titles in Playfair give
the brand where the eye lands; `swap` keeps every line readable at first paint, so neither font
blocks the 3G visitor. One title weight keeps Playfair at 22.8 KB.

`swap` plus preload favours the owners' first impression over the strictest 3G purity: `optional`
would give CLS 0 but could show the pitch without the brand on a first visit over slow data. What
keeps the swap small is the line height: `--text-frase--line-height` fixes each title line, and
Tailwind's `text-lg` fixes the button's, so a swap cannot move the button while the frase stays on
2 lines and the label on 1; only a change in line count can. The CLS gate is honest about its
reach: Lighthouse barely sees the swap, so it mainly protects later slices from other jumps
(photos, the animation), and the font swap itself is judged on the real phone (AC-9). It reads the
worst run, not the median one, because `computeMedianRun` picks by FCP and TTI and could skip a run
with a jump.

Fraunces 600 was the title recommendation (17.7 KB, sturdier at small sizes). The engineer chose
Playfair Display for its classic café character; its thin strokes fade on cheap screens, so the
20 px minimum (AC-8) is the guard. `next/font/google` beats committing the files because it cuts
the Latin subset, self hosts it and writes the preload tag with no hand work; the cost, a build
that needs internet, is acceptable since the build already runs on the developer's machine before
`pnpm deploy:pages`.

On 2026-11-04 the engineer chose Rethink Sans for the text to give the page more personality than
the system sans. The variable file over 400 only: Google serves the same 34.8 KB for 400 plus 600,
so the variable file costs nothing extra and keeps the button at a real 600 with no faked bold.
The fonts then sum 57.6 KB, so the cap moves from 40 to 60 KB and the primera vista lands near
237 of 300 KB, leaving about 63 KB for what later slices put in the first view. The engineer chose
to preload Rethink too, knowing the median LCP sits near 2.65 s: the button text arrives sooner and
swaps less visibly, and the gate decides. If it fails, Rethink alone drops its preload and is
measured once more before returning here. Pointing `--font-sans` at Rethink over a `font-cuerpo`
class on `<body>`: Tailwind 4.3.3 already gives `<html>` `--default-font-family` from `--font-sans`,
so no component changes and `font-sans` keeps meaning the real text font; runner up is the class,
which leaves `font-sans` pointing at a stack the page no longer uses. `system-ui` first in the
fallback keeps the stand in as today's look (Roboto on Android), runner up plain `sans-serif`.

On 2026-11-05 the gate failed on Performance only (87 preloaded, 88 without the Rethink preload).
The evidence points at the machine more than the fonts: the same JS that blocked the main thread
for about 200 ms in slice 1 blocked it for 190 to 540 ms on a CPU rated about 40 % slower, and TBT
weighs more in the score than LCP. Rethink at 400 only would save 19 KB but leave the button at 400
or in a faked bold, for a gain the noise hides; dropping Rethink returns to a state that also
scored 89 on this machine; cutting JS is a spec 0005 decision with no cheap lever, and it does not
fix a gate that moves with the laptop. The recommendation was to keep Rethink without preload and
close AC-6 with one run on a plugged in laptop in its highest power mode. The engineer chose to keep
the preload and accept the Performance part on reasoning, as on 2026-11-02 for Playfair. That
works, with two costs they accept: the preload keeps competing with the photo (about 160 ms more
LCP in the median, still under 3 s), and the gate no longer proves Performance for this feature;
the hard weight caps and the real phone check (AC-9) remain the guard.

## Feature design

**Data model sketch**: none. No data is stored; the frase and texts keep coming from the módulo
de contenido (`src/content.ts`).

**API surface**: none. The interface is a set of CSS tokens and two loader calls:

| Surface | Where | Shape |
|---|---|---|
| Title font loader | `src/app/layout.tsx` | `Playfair_Display({ weight: '600', subsets: ['latin'], display: 'swap', fallback: ['serif'], variable: '--font-playfair' })` |
| Text font loader | `src/app/layout.tsx` | `Rethink_Sans({ subsets: ['latin'], display: 'swap', fallback: ['system-ui', 'sans-serif'], variable: '--font-rethink' })`; no `weight`, so it loads the variable file |
| Font classes | `<html>` in `src/app/layout.tsx` | both `.variable` classes |
| Family tokens | `src/app/globals.css`, `@theme inline` | `--font-titulo: var(--font-playfair);` and `--font-sans: var(--font-rethink);` |
| Size tokens | `src/app/globals.css`, existing `@theme` | `--text-frase: clamp(2.25rem, 1.5rem + 3.2vw, 3.25rem)` with `--text-frase--line-height: 1.15`; `--text-titulo: clamp(1.75rem, 1.25rem + 2vw, 2.5rem)` with `--text-titulo--line-height: 1.2` |
| CLS gate | `scripts/lighthouse.ts` | `limites.cls = Number(process.env.LIGHTHOUSE_CLS ?? 0.02)`; a fourth row `CLS <= 0.02` judged on the worst of the five runs; a missing `numericValue` counts as `Infinity` (fails) |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Load title font | Family `Playfair Display`, weight `600` | This spec (engineer's pick) |
| Load text font | Family `Rethink Sans`, weights 400 to 800 | This spec (engineer's pick); variable is the loader default when `weight` is omitted |
| Load fonts | Subset `latin` (covers á é í ó ú ñ ü ¿ ¡) | This spec; Google Fonts Latin block U+0000 to U+00FF |
| Load fonts | `.woff2` files | Downloaded from Google Fonts by `next build`, emitted to `/_next/static/media/` |
| Load fonts | Fallback metrics | None in this build: Turbopack emits no adjusted face; accepted, see Decision |
| Load fonts | Generic fallbacks | `serif` for titles (Noto Serif on Android); `system-ui, sans-serif` for text (Roboto on Android), both in this spec |
| Load fonts | Preload tags | `next/font` default (`preload: true`) for both, kept by this spec |
| Render frase | Text | `portada.frase` in `src/content.ts` (unchanged) |
| Render frase | Family, size, weight | `font-titulo`, `--text-frase` tokens, `font-semibold` |
| Render body, button, links | Family | `--font-sans` → `--font-rethink`, through Tailwind's `--default-font-family` on `<html>` |
| Render button | Weight, size and line height | `font-semibold` and `text-lg` in `src/components/Portada.tsx` (unchanged) |
| Render section title | Size and line height | `--text-titulo` tokens (first used by El lugar) |
| Render Menú product name | Size | `--text-producto`, defined by the Menú spec, 1.25rem or more |
| Judge CLS | Measured value and limit | Highest `audits["cumulative-layout-shift"].numericValue` of the five runs; `LIGHTHOUSE_CLS`, default `0.02` |
| Judge font weight | Font KB in the primera vista | Sum of the `.woff2` lines in the per resource list of `pnpm weight` (KB of 1024 B); cap 60 |
| Judge fonts loaded | Face status | `document.fonts` read with Playwright after `networkidle`, during `/check verify` |
| Judge families applied | Computed family | `getComputedStyle` on `<body>` and on the frase, during `/check verify` |
| Judge lines | Lines of the frase and the button label | Screenshots at 375 and 1440 px; 2 and 1 expected |

**Key invariants**:
- `font-titulo` text always uses `font-semibold` (600) and a size token of 1.25rem or more; no
  other weight and no `<strong>` or `<b>` inside it, so the browser never fakes a bold.
- Body text, buttons and links never use `font-titulo`; they get Rethink Sans only through
  `--font-sans`, never through a `font-[...]` class or an inline `font-family`.
- Rethink Sans text stays within weights 400 to 800, the range the variable file holds.
- Font sizes for title text come from `--text-frase`, `--text-titulo` or `--text-producto`, not
  from `text-4xl` style classes or breakpoint overrides.
- No runtime request leaves the café's domain for a font.
- Line height comes from the size token or Tailwind's text size, never from the font, so a font
  swap can only move the page by changing the number of lines.

**Security model**: public static page; no data, no credentials. Playfair Display and Rethink Sans
both ship under the SIL Open Font License 1.1, which allows self hosting and bundling. The
`noindex` rules of spec 0004 are untouched.

**Configuration required**:
- `LIGHTHOUSE_CLS`: overrides the CLS limit of `pnpm lighthouse` (default `0.02`); set it to `-1`
  to prove the gate fails.
- The build needs internet access to `fonts.googleapis.com` and `fonts.gstatic.com` (build time
  only).

**Critical test scenarios**:
- Happy path: `pnpm build`, then `document.fonts` holds both faces loaded, the computed families are
  right, the screenshots show the frase in Playfair on 2 lines and the button in Rethink on 1, and
  `pnpm weight` lists two `.woff2` summing about 58 KB, verifies **AC-1**, **AC-3**, **AC-7**,
  **AC-10**, **AC-11**
- Isolation: the `grep` over `out/` for Google font hosts finds nothing, verifies **AC-2**
- Gate: `pnpm lighthouse tipografia-texto` passes with the worst CLS at 0.02 or less and the median
  LCP at 3 s or less; with `LIGHTHOUSE_CLS=-1` it exits 1, verifies **AC-4**, **AC-6**
- Failure case: with every `.woff2` request blocked, the 375 px capture shows the frase in a serif on
  2 lines and the button label in the device's sans on 1 line, at the same height as with the fonts
  loaded, verifies **AC-5**
- Rule check: the `font-titulo` and weight class search over `src/`, verifies **AC-8**
- Real device: a first visit on an Android phone over mobile data keeps the lines and the button in
  place through both swaps, verifies **AC-9**

## Build plan

Tracer Bullet: one thin thread from the loader to a verified page on a real phone, through every
layer the later sections reuse. Section titles and product names adopt the tokens in their own
slices.

**Built and verified on 2026-11-02 (Playfair Display, steps 1 to 7):**
1. Load Playfair Display in `src/app/layout.tsx`, `.variable` class on `<html>`, satisfies **AC-2**,
   **AC-5**
2. `@theme inline` family token and the `--text-frase` and `--text-titulo` size tokens in
   `src/app/globals.css`, satisfies **AC-1**, **AC-8**
3. Portada frase on `font-titulo text-frase font-semibold` in 2 lines, satisfies **AC-1**, **AC-7**,
   **AC-8**, **AC-10**
4. CLS row and `LIGHTHOUSE_CLS` in `scripts/lighthouse.ts`, proven with `LIGHTHOUSE_CLS=-1`,
   satisfies **AC-4**
5. Checks into `.verify/slice-tipografia/`, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-6**,
   **AC-7**, **AC-10**
6. `/check verify` (fonts, blocked capture, rule search), satisfies **AC-5**, **AC-7**, **AC-8**
7. Deployed and checked on a real Android phone, satisfies **AC-9**

**To build (Rethink Sans for text, 2026-11-04):**
8. [x] Load Rethink Sans in `src/app/layout.tsx` with the text loader call above and add its `.variable`
   class to `<html>` next to Playfair's. If the download fails during `pnpm build`, stop and report;
   never fall back to committing a file, satisfies **AC-2**, **AC-5**
9. [x] Add `--font-sans: var(--font-rethink);` to the `@theme inline` block of `src/app/globals.css` and
   update its comment. Build, open the page and read the computed family of `<body>`; if it is not
   Rethink Sans, stop and report (the runner up is a `font-cuerpo` class on `<body>`), satisfies
   **AC-1**, **AC-11**
10. [x] Remove the `preload: false` (and its comment) that the first run of this step left on Rethink
    Sans in `src/app/layout.tsx`, so both fonts are preloaded again. Build and run the checks into
    `.verify/slice-tipografia-texto/`: the `grep` over `out/`, `pnpm weight`, `pnpm lighthouse
    tipografia-texto` once, `pnpm shots tipografia-texto`. A median Performance under 90 is accepted
    (Decision, Performance gate): note it and the median run's `benchmarkIndex` in the report and
    go on. LCP over 3 s, Accessibility under 90, CLS over 0.02 or a weight cap failing stop the
    build and return to `/architect`, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-6**, **AC-7**,
    **AC-10**. (First run on 2026-11-05: `grep` empty, fonts 57.7 KB, primera vista 237.4 KB,
    Performance 87 preloaded and 88 with `preload: false`, LCP 2.86 and 2.69 s, CLS 0.)
11. In `/check verify`: read `document.fonts` and the computed families with Playwright, take the
    375 px capture with `.woff2` blocked, and run the class search over `src/`, satisfies **AC-5**,
    **AC-7**, **AC-8**, **AC-11**
12. [x] Deploy with `pnpm deploy:pages`, open it on a real Android phone over mobile data and check the
    frase lines, the button label and the button position; on failure stop and return to
    `/architect`, satisfies **AC-9**

## Consequences

**Positive**:
- The frase reads as the brand and the text looks the same on every phone, with no request outside
  the café's domain.
- Later slices get type for free: `font-titulo` plus a size token for titles, nothing at all for text.
- The CLS gate protects every later slice (photos without dimensions, the animation) from layout
  jumps.

**Negative / tradeoffs**:
- About 58 KB of fonts on 3G (roughly 1.2 s at 400 kbps, 0.7 s of it Rethink), and two preloads
  compete with the Portada photo, the likely LCP element, when the median LCP already sits near
  2.65 s.
- The primera vista margin drops to about 63 KB for everything later slices add to the first view.
- Body text, the button and the links now swap once Rethink arrives (before, only titles did), with
  no size matched stand in on any device; a wide fallback could rewrap a line on a narrow screen.
  Lighthouse cannot see it; only the manual real phone check can.
- `pnpm build` and `pnpm dev` need internet for the first font download; offline, the build fails.
- If Google updates either file, a later build ships the new one without notice; `pnpm weight`
  catches a size change, not a look change.
- One title weight only: a title that needs a different weight or an italic means updating this
  spec.
- `max-w-[16ch]` on the frase is measured in the font's own `0` width, so line breaks change with
  Playfair and must be checked in the screenshots.
- The Performance part of AC-6 is accepted on reasoning, not measured as passing. On this laptop the
  score moves with the CPU (`benchmarkIndex`) as much as with the page, so it cannot tell a 2 point
  font cost from machine noise. Until the gate accounts for the machine, later slices may hit the
  same wall.

**Neutral**:
- Playfair Display is a common choice for cafés; the brand difference comes from the colours and
  the photos, not the fonts alone.
- `font-sans` in Tailwind now means Rethink Sans, not the system stack.

## Follow-up

- [ ] `/sync`: in `AGENTS.md`, the typography convention says body, buttons and links stay on the
      system sans, and the build line names only Playfair as the downloaded font; both change to
      Rethink Sans through `--font-sans`.
- [ ] Menú spec: define `--text-producto` at 1.25rem or more for product names in `font-titulo`.
- [ ] On each Next upgrade, search the CSS in `out/` for `Playfair Display Fallback` and
      `Rethink Sans Fallback`; if Turbopack now emits them, note it here (no code change needed).
- [ ] `/architect lighthouse estable` (spec 0006): make the Performance gate account for the
      machine, for example by recording `benchmarkIndex` and adjusting the CPU slowdown, or by
      measuring in a fixed environment. The Performance part of AC-6 was accepted on reasoning
      twice (2026-11-02 and 2026-11-05).

## References

**Project sources**:
- `AGENTS.md` (weight and Lighthouse limits, colours in `@theme`, Server Components)
- Specs 0001 (static export), 0004 (`noindex`), 0005 (JS budget), 0006 (median Lighthouse run)
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` (installed Next 16.4.3
  docs for `next/font`)
- `next/dist/compiled/@next/font/dist/google/loader.js` (build fails offline, dev falls back) and
  `next/dist/shared/lib/constants.js` (`DEFAULT_SERIF_FONT` is Times New Roman)
- `next/dist/compiled/@next/font/dist/google/index.d.ts` (`Rethink_Sans`: weights 400 to 800 or
  `variable`, `weight` optional, subsets `latin` and `latin-ext`)
- `node_modules/tailwindcss/theme.css` (`--text-*--line-height` token syntax; line 494,
  `--default-font-family: --theme(--font-sans, initial)` in Tailwind 4.3.3)
- `.verify/slice-1/lighthouse-1.json` to `-5.json` (CLS baseline 0 in every run) and
  `scripts/shots.ts` (screenshots wait for `networkidle`)
- `.verify/slice-tipografia/lighthouse-1.json` to `-5.json` (LCP 2.5 to 2.97 s, CLS 0, read on
  2026-11-04)
- `.verify/slice-tipografia-texto/lighthouse-1.json` to `-5.json` (2026-11-05, the run with
  `preload: false`) and `environment.benchmarkIndex` in the saved runs of `slice-1`,
  `slice-tipografia` and `slice-tipografia-texto` (CPU speed per slice)
- Measurement on 2026-10-31: Latin `.woff2` from Google Fonts at one weight: Fraunces 600 17.7 KB,
  Playfair Display 600 22.7 KB, Cormorant Garamond 600 22.8 KB, DM Serif Display 400 24.2 KB
- Measurement on 2026-11-04: Rethink Sans Latin `.woff2` from Google Fonts: 400 15.5 KB, 600
  16.0 KB, 400 plus 600 and 400..800 both one file of 34.8 KB; `pnpm weight` primera vista 202.2 KB
- Check on 2026-11-02: `next build --webpack` emits `@font-face{font-family:Playfair Display
  Fallback; src:local("Times New Roman"); size-adjust:111.26%; …}` and the variable
  `"Playfair Display","Playfair Display Fallback",serif`; the Turbopack build (`pnpm build`) emits
  only `"Playfair Display", serif`
- `/check verify` on 2026-11-02: with `.woff2` blocked, Chrome draws the frase in Times New Roman on
  Windows, on 2 lines, with the button at the same height as with Playfair loaded

**Practices & standards**:
- `font-display: swap` with a metric adjusted fallback to keep text visible and limit layout shift
- Self hosting fonts instead of a third party CDN at runtime

**Links** (web verified on 2026-10-31, the Rethink Sans license on 2026-11-04):
- Next.js, Font Module reference: https://nextjs.org/docs/app/api-reference/components/font
- Next.js, Font Optimization guide: https://nextjs.org/docs/app/getting-started/fonts
- MDN, `font-display`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- MDN, `size-adjust` (fallback metric override example): https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
- Tailwind CSS v4, theme variables and `@theme inline`: https://tailwindcss.com/docs/theme
- web.dev, Cumulative Layout Shift (0.1 or less is good): https://web.dev/articles/cls
- Playfair Display license, SIL Open Font License 1.1: https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/OFL.txt
- Rethink Sans license, SIL Open Font License 1.1: https://raw.githubusercontent.com/google/fonts/main/ofl/rethinksans/OFL.txt
