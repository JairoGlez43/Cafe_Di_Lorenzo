# 0007. Playfair Display for titles, loaded at build time

**Date**: 2026-10-31
**Status**: In Progress

## Summary

Titles get one brand font, Playfair Display at weight 600, while body text, buttons and links keep
the phone's own sans font. Next.js downloads the font while it builds the page and serves it from
our own domain, so the visitor's phone never asks Google for it. It adds about 23 KB to the primera
vista and shows text at once in the device's own serif while the real one arrives (the size matched
stand in that `next/font` promises is not generated under Turbopack, and the project accepts that).
The fixed line height of the title tokens keeps the swap from moving the page, and a new Lighthouse
gate (CLS, the score for how much the page jumps while loading) guards later slices.

## Context

Today the page has no font of its own: the Portada frase renders in whatever sans the device ships
(Segoe UI on Windows, Roboto on Android). The logo uses a geometric sans in wide spaced capitals,
but it is an image, so nothing in the live text carries the brand. The first audience is the owners
during the pitch, who judge the look; the second is their customers on a phone over 3G in Cuba,
who need the text readable at once.

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

## Requirements

**User stories**:
- As one of the café owners seeing the pitch, I want the titles to look like a brand, not like a
  default web page, so that the demo feels made for my café.
- As a customer on 3G, I want to read the frase the moment the page paints, so that I never stare
  at blank or jumping text.
- As the developer of the next slices, I want one rule for title type, so that El lugar, Menú,
  Galería and Visítanos look the same without new decisions.

**Acceptance criteria**:
- **AC-1**: The Portada frase (the `<p>` under the logo; the `<h1>` stays the logo image) renders in
  Playfair Display at weight 600 through the `font-titulo` utility. Body text, the "Cómo llegar"
  button and the WhatsApp and Instagram links keep Tailwind's default sans stack (nothing is set on
  `<body>` for it).
- **AC-2**: The font is served from the export itself: the `.woff2` lives under
  `out/_next/static/media/`, and `grep -rE "fonts\.(googleapis|gstatic)\.com" out/` finds nothing
  (it finds nothing today either).
- **AC-3**: The `.woff2` lines in the "Primera vista, por recurso" list of `pnpm weight` add up to
  40 KB or less (KB of 1024 B, as the script prints), and the primera vista stays within 300 KB.
- **AC-4**: CLS of the worst of the five Lighthouse runs is 0.02 or less; a missing CLS value counts
  as a failure; `pnpm lighthouse` exits 1 when either happens (proven with `LIGHTHOUSE_CLS=-1`).
- **AC-5**: Text is never invisible while the font loads: the frase paints at once in the generic
  `serif` fallback (`font-display: swap`). No metric adjusted fallback face is required (Turbopack
  does not emit one, see Decision). With every `.woff2` request blocked in Playwright, a 375 px
  capture shows the frase in a serif fallback, on 2 lines, with nothing overflowing, and the
  "Cómo llegar" button at the same height as with the font loaded.
- **AC-6**: With the font preloaded, the shared bar still holds: LCP 3 s or less, Performance and
  Accessibility 90 or more in the median run, JS within spec 0005.
- **AC-7**: The font really loads: after `networkidle`, `document.fonts` holds a Playfair face with
  status `loaded`, and every accented character in the frase ("De día, jardín.") shows in Playfair
  Display in the screenshots at 375 and 1440 px, normal and reduced motion.
- **AC-8**: Title sizes come only from the `@theme` tokens `--text-frase` and `--text-titulo`. The
  brand font is used only at weight 600 and never below 1.25rem (20 px). Checked by searching
  `font-titulo` in `src/`: every use carries a size token and `font-semibold`, and no other size
  class.
- **AC-9**: On a real Android phone, a first visit over mobile data shows the frase switching to
  Playfair Display while keeping the same number of lines, with no visible move of the "Cómo
  llegar" button. If it fails, the build stops and returns to `/architect` instead of improvising a
  fix.
- **AC-10**: The frase keeps exactly 2 lines, one sentence per line, at 375 and 1440 px; only the
  `ch` value of its `max-w-[16ch]` may change to get there.

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
- Body text never swaps, so only title lines can move, and the adjusted fallback keeps that small.
- No metrics or preload tags written by hand.

**Cons**:
- The build needs internet: `next build` stops with "Failed to fetch ... from Google Fonts" when
  the download fails (in `dev` it only logs and falls back).
- The adjusted fallback is built on Times New Roman, which Android lacks.
- Under Turbopack (this project's bundler) `next/font` 16.4.3 does not emit the adjusted fallback
  face at all; only a webpack build does (found during `/check verify`, 2026-11-02).

### Option 3: One family for all text, or two families

A single variable font for titles and body, or a serif for titles plus a sans for body.

**Pros**:
- The strongest and most uniform brand voice.

**Cons**:
- 35 to 90 KB on 3G, a third to three quarters of the margin left.
- Every line of text waits for or swaps to the font, so more of the page can shift.

### Option 4: Same font, files committed and loaded by hand

The `.woff2` and its license in the repo, loaded with `next/font/local` or a plain `@font-face`.

**Pros**:
- The build works offline and always produces the same file.

**Cons**:
- The subset is cut by hand, and the fallback metrics are either limited to Arial or Times New
  Roman (`next/font/local`) or written and kept up to date by hand (`@font-face`).

## Decision

**Chosen option**: Option 2: One brand serif for titles only, through `next/font/google`

Playfair Display, weight 600, Latin subset, `display: 'swap'`, preloaded, exposed as the Tailwind
utility `font-titulo` and used for the Portada frase, section titles (`h2`) and Menú product names;
everything else keeps `font-sans`.

**Fallback under Turbopack (updated 2026-11-02)**: the build ships without a metric adjusted
fallback face; while Playfair loads, titles show in the generic `serif`. Accepted as is: no hand
written `@font-face` with copied metrics, and no switch to webpack. Runner up: a hand written
`Playfair Display Fallback` face in `globals.css` with the four values webpack computes, rejected
because it only helps devices with Times New Roman (laptops, iPhone), not the Android majority, and
leaves metrics to keep in sync by hand.

## Rationale

The pitch needs a recognisable voice and the 3G visitor needs text at once; titles only is the one
split that gives both, because the brand shows where the eye lands while body text never waits on
a download. One weight keeps the file at 22.7 KB, well inside the 40 KB cap and the 121 KB margin.

`swap` plus preload favours the owners' first impression over the strictest 3G purity: `optional`
would give CLS 0 but could show the pitch without the brand on a first visit over slow data. What
keeps the swap small is the line height: `--text-frase--line-height` fixes each line's height, so the
swap cannot move the button while the frase stays on 2 lines; only a change in line count can (the
adjusted fallback would also have narrowed width differences, but Turbopack does not emit it, and on
Android it would not apply anyway). The CLS gate is honest about its reach: Lighthouse barely
sees the swap, so the gate mainly protects every later slice from other jumps (photos, the
animation), and the font swap itself is judged on the real phone (AC-9). It reads the worst run,
not the median one, because `computeMedianRun` picks by FCP and TTI and could skip a run with a jump.

Fraunces 600 was the recommendation (17.7 KB, sturdier at small sizes). The engineer chose
Playfair Display for its classic café character; it costs 5 KB more and its thin strokes fade on
cheap screens, so the 20 px minimum (AC-8) is the guard, and it matters most for the Menú product
names. `next/font/google` beats committing the file because it cuts the Latin subset, self hosts it
and writes the preload tag with no hand work (its computed fallback metrics were a further reason,
lost under Turbopack); the cost, a build that needs internet, is acceptable since the build already
runs on the developer's machine before `pnpm deploy:pages`.

## Feature design

**Data model sketch**: none. No data is stored; the frase and titles keep coming from the módulo
de contenido (`src/content.ts`).

**API surface**: none. The interface is a set of CSS tokens and one loader call:

| Surface | Where | Shape |
|---|---|---|
| Font loader | `src/app/layout.tsx` | `Playfair_Display({ weight: '600', subsets: ['latin'], display: 'swap', fallback: ['serif'], variable: '--font-playfair' })`; `.variable` class on `<html>` |
| Family token | `src/app/globals.css` | `@theme inline { --font-titulo: var(--font-playfair); }` gives the `font-titulo` utility |
| Size tokens | `src/app/globals.css`, existing `@theme` | `--text-frase: clamp(2.25rem, 1.5rem + 3.2vw, 3.25rem)` with `--text-frase--line-height: 1.15`; `--text-titulo: clamp(1.75rem, 1.25rem + 2vw, 2.5rem)` with `--text-titulo--line-height: 1.2` |
| CLS gate | `scripts/lighthouse.ts` | `limites.cls = Number(process.env.LIGHTHOUSE_CLS ?? 0.02)`; a fourth row `CLS <= 0.02` judged on the worst of the five runs; a missing `numericValue` counts as `Infinity` (fails), as LCP already does |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Load font | Family `Playfair Display`, weight `600` | This spec (engineer's pick) |
| Load font | Subset `latin` (covers á é í ó ú ñ ü ¿ ¡) | This spec; Google Fonts Latin block U+0000 to U+00FF |
| Load font | `.woff2` file | Downloaded from Google Fonts by `next build`, emitted to `/_next/static/media/` |
| Load font | Fallback metrics (`size-adjust`, ascent, descent) | None in this build: Turbopack does not emit the `Playfair Display Fallback` face (webpack would, `size-adjust: 111.26%` on Times New Roman); accepted, see Decision |
| Load font | Generic fallback after the adjusted one | `fallback: ['serif']` in this spec (Noto Serif on Android) |
| Load font | Preload tag | `next/font` default (`preload: true`), kept by this spec |
| Render frase | Text | `portada.frase` in `src/content.ts` (unchanged) |
| Render frase | Family | `font-titulo` utility from `--font-titulo` |
| Render frase | Size and line height | `--text-frase` tokens |
| Render frase | Weight | `font-semibold` (600), the only loaded weight |
| Render section title | Size and line height | `--text-titulo` tokens (first used by El lugar) |
| Render Menú product name | Size | `--text-producto`, defined by the Menú spec, 1.25rem or more |
| Judge CLS | Measured value | Highest `audits["cumulative-layout-shift"].numericValue` across the five runs |
| Judge CLS | Limit | `LIGHTHOUSE_CLS`, default `0.02` (baseline today: 0) |
| Judge font weight | Font KB in the primera vista | Sum of the `.woff2` lines in the per resource list printed by `pnpm weight` (KB of 1024 B) |
| Judge font loaded | Playfair face status | `document.fonts` read with Playwright after `networkidle`, during `/check verify` |
| Judge frase lines | Number of lines | Screenshots at 375 and 1440 px; 2 expected |

**Key invariants**:
- `font-titulo` text always uses `font-semibold` (600) and a size token of 1.25rem or more; no
  other weight and no `<strong>` or `<b>` inside it, so the browser never fakes a bold.
- Body text, buttons and links never use `font-titulo`.
- Font sizes for title text come from `--text-frase`, `--text-titulo` or `--text-producto`, not
  from `text-4xl` style classes or breakpoint overrides.
- No runtime request leaves the café's domain for a font.
- Title line height comes from the size token, never from the font, so a font swap can only move
  the page by changing the number of lines.

**Security model**: public static page; no data, no credentials. Playfair Display ships under the
SIL Open Font License 1.1, which allows self hosting and bundling. The `noindex` rules of spec 0004
are untouched.

**Configuration required**:
- `LIGHTHOUSE_CLS`: overrides the CLS limit of `pnpm lighthouse` (default `0.02`); set it to `-1`
  to prove the gate fails.
- The build needs internet access to `fonts.googleapis.com` and `fonts.gstatic.com` (build time
  only).

**Critical test scenarios**:
- Happy path: `pnpm build`, then `document.fonts` holds a loaded Playfair face, the screenshots
  show the frase in Playfair Display with its accents on 2 lines, and `pnpm weight` lists one
  `.woff2` of about 23 KB, verifies **AC-1**, **AC-3**, **AC-7**, **AC-10**
- Isolation: the `grep` over `out/` for Google font hosts finds nothing, verifies **AC-2**
- Gate: `pnpm lighthouse tipografia` passes with the worst CLS at 0.02 or less; with
  `LIGHTHOUSE_CLS=-1` it exits 1, verifies **AC-4**, **AC-6**
- Failure case: with every `.woff2` request blocked in Playwright, the 375 px capture shows the frase
  in a serif fallback on 2 lines with nothing overflowing and the button where it is with the font
  loaded, verifies **AC-5**
- Rule check: every `font-titulo` use in `src/` carries a size token and `font-semibold`, verifies
  **AC-8**
- Real device: a first visit on an Android phone over mobile data keeps the frase on the same lines
  and the button in place, verifies **AC-9**

## Build plan

Tracer Bullet: one thin thread from the loader to a verified frase on a real phone, through every
layer the later sections will reuse. Section titles and product names adopt the tokens in their own
slices.

1. Load Playfair Display in `src/app/layout.tsx` with the loader call above and put its `.variable`
   class on `<html>`. If the font download fails during `pnpm build`, stop and report; never fall
   back to committing a file, satisfies **AC-2**, **AC-5**
2. Add the `@theme inline` family token and the `--text-frase` and `--text-titulo` size tokens to
   `src/app/globals.css`, satisfies **AC-1**, **AC-8**
3. Switch the Portada frase (the `<p>`) in `src/components/Portada.tsx` to `font-titulo text-frase
   font-semibold`, dropping `text-4xl`, `sm:text-5xl` and `leading-tight`; adjust only the `ch`
   value of `max-w-[16ch]` if the frase stops fitting in 2 lines, satisfies **AC-1**, **AC-7**,
   **AC-8**, **AC-10**
4. Add the CLS row and `LIGHTHOUSE_CLS` to `scripts/lighthouse.ts` (worst of the five runs, missing
   value fails, header comment included), and prove it fails with `LIGHTHOUSE_CLS=-1`, satisfies
   **AC-4**
5. Build and run the checks into `.verify/slice-tipografia/`: the `grep` over `out/`, `pnpm weight`,
   `pnpm lighthouse tipografia`, `pnpm shots tipografia`. If the median LCP goes over 3 s, set
   `preload: false`, measure again, and if it still fails return to `/architect`, satisfies
   **AC-2**, **AC-3**, **AC-4**, **AC-6**, **AC-7**, **AC-10**
6. In `/check verify`: read `document.fonts` with Playwright, take the 375 px capture with `.woff2`
   blocked, and search `font-titulo` in `src/`, satisfies **AC-5**, **AC-7**, **AC-8**
7. Deploy with `pnpm deploy:pages`, open it on a real Android phone over mobile data and check the
   frase lines and the button; on failure stop and return to `/architect`, satisfies **AC-9**

## Consequences

**Positive**:
- The frase reads as the brand on every device, with no request outside the café's domain.
- Later slices get title type for free: `font-titulo` plus a size token.
- The CLS gate protects every later slice (photos without dimensions, the animation) from layout
  jumps.

**Negative / tradeoffs**:
- About 23 KB more on 3G (roughly half a second at 400 kbps), and the preload competes a little
  with the Portada photo, the likely LCP element.
- `pnpm build` and `pnpm dev` need internet for the first font download; offline, the build fails.
- The fallback is not size matched on any device (Turbopack emits no adjusted face), so the swap
  changes letter widths and, on a narrow screen with a wide fallback, could rewrap a title line;
  Lighthouse cannot see it, only the real phone check can, and that check is manual.
- The spec's earlier promise of a size matched stand in depends on the bundler: a later Next or
  Turbopack release may start emitting it with no code change, which would only improve the swap.
- If Google updates the Playfair file, a later build ships the new one without notice; `pnpm weight`
  catches a size change, not a look change.
- One weight only: a title that needs a different weight or an italic means updating this spec.
- `max-w-[16ch]` on the frase is measured in the font's own `0` width, so line breaks change with
  Playfair and must be checked in the screenshots.

**Neutral**:
- Playfair Display is a common choice for cafés; the brand difference comes from the colours and
  the photos, not the font alone.

## Follow-up

- [ ] `/sync`: add `LIGHTHOUSE_CLS` and the CLS gate to the `pnpm lighthouse` lines in `AGENTS.md`,
      and a convention line for title type (`font-titulo`, size tokens, weight 600, 20 px minimum).
- [ ] Menú spec: define `--text-producto` at 1.25rem or more for product names in `font-titulo`.
- [ ] On each Next upgrade, search the CSS in `out/` for `Playfair Display Fallback`; if Turbopack
      now emits it, note it here (no code change needed).

## References

**Project sources**:
- `AGENTS.md` (weight and Lighthouse limits, colours in `@theme`, Server Components)
- Specs 0001 (static export), 0004 (`noindex`), 0005 (JS budget), 0006 (median Lighthouse run)
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` (installed Next 16.4.3
  docs for `next/font`)
- `next/dist/compiled/@next/font/dist/google/loader.js` (build fails offline, dev falls back) and
  `next/dist/shared/lib/constants.js` (`DEFAULT_SERIF_FONT` is Times New Roman)
- `node_modules/tailwindcss/theme.css` (`--text-*--line-height` token syntax)
- `.verify/slice-1/lighthouse-1.json` to `-5.json` (CLS baseline 0 in every run) and
  `scripts/shots.ts` (screenshots wait for `networkidle`)
- Measurement on 2026-10-31: Latin `.woff2` from Google Fonts at one weight: Fraunces 600 17.7 KB,
  Playfair Display 600 22.7 KB, Cormorant Garamond 600 22.8 KB, DM Serif Display 400 24.2 KB
- Check on 2026-11-02: `next build --webpack` emits `@font-face{font-family:Playfair Display
  Fallback; src:local("Times New Roman"); size-adjust:111.26%; …}` and the variable
  `"Playfair Display","Playfair Display Fallback",serif`; the Turbopack build (`pnpm build`) emits
  only `"Playfair Display", serif`. Playfair metrics are present in
  `next/dist/server/capsize-font-metrics.json`; the loader computes them
  (`next/dist/compiled/@next/font/dist/google/loader.js`, `adjustFontFallback`)
- `/check verify` on 2026-11-02: with `.woff2` blocked, Chrome draws the frase in Times New Roman on
  Windows, on 2 lines, with the button at the same height as with Playfair loaded

**Practices & standards**:
- `font-display: swap` with a metric adjusted fallback to keep text visible and limit layout shift
- Self hosting fonts instead of a third party CDN at runtime

**Links** (web verified on 2026-10-31):
- Next.js, Font Module reference: https://nextjs.org/docs/app/api-reference/components/font
- Next.js, Font Optimization guide: https://nextjs.org/docs/app/getting-started/fonts
- MDN, `font-display`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- MDN, `size-adjust` (fallback metric override example): https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
- Tailwind CSS v4, theme variables and `@theme inline`: https://tailwindcss.com/docs/theme
- web.dev, Cumulative Layout Shift (0.1 or less is good): https://web.dev/articles/cls
- Playfair Display license, SIL Open Font License 1.1: https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/OFL.txt
