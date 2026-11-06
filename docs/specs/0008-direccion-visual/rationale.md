# 0008. Visual direction: rationale

Decision record for [index.md](index.md). `/develop` does not need this file.

## Context

The Portada shipped in slice 1 works and passes every check, but the engineer does not like it: on
a desktop the lower half is empty green, it reads as a template (logo, phrase, button, photo), nothing
moves, and the arch photo sits beside the text with no relation to it. El lugar was paused on
2026-11-03 because every later section's layout depends on how this is resolved.

Forces:
- **Audience.** First the owners judge the look in a pitch; then their customers open it on a phone
  over 3G in Cuba. It has to impress and stay light.
- **Budget** (spec 0005, measured 2026-10-31 and 2026-11-04). The primera vista is about 201 of
  300 KB at 375 × 812, DPR 2; JS is 170.5 of 180 KB, so nothing visual can lean on new JavaScript.
- **Motion rules** (AGENTS.md). SVG and CSS only, one animación protagonista tied to the scroll,
  everything static with reduced motion.
- **Brand material.** A bottle green and gold round logo with a palm frond, a phrase about day and
  night, and 37 Instagram photos: strong still lifes (food on gold plates, brass bowls), the garden,
  candles, and many posed portraits of people. Only some have the resolution for a full bleed
  photo.
- **Spec 0003** fixes one theme with crema and verde sections alternating. Spec 0007 fixes Playfair
  Display 600 for titles.

## Options considered

The four concepts shown to the engineer, each drawn from the reference set in
`references/landing_references/`.

### Option 1: De día a de noche

The page travels from day to night as you scroll and ends at Visítanos in night tones. Seen in Fern
(a bar that runs "from dawn till dusk") and Estelle (botanical, with a day and night switch).

**Pros**:
- Uses the café's own phrase and its two registers; the darkening points toward the acción principal.
- Gives the animación protagonista a natural home.

**Cons**:
- The continuous version needs scroll driven animations, new in Safari (iOS 26); older phones get a
  static fallback.

### Option 2: Noche y dorado

Everything near black green and gold, tropical leaves crossing section edges (Wilma, Zaya, F&B).

**Pros**:
- The most luxurious look, and the closest to the logo's colours.

**Cons**:
- Day photos look out of place; leaf cutouts need PNGs with transparency (weight).

### Option 3: Editorial crema

Crema dominant, generous space, serif titles with italic words, thin gold line drawings (La
Consentida).

**Pros**:
- The most minimalist and calm.

**Cons**:
- The least "fancy"; contrast and identity both soften, and italic costs about 23 KB more.

### Option 4: Rótulo a sangre

The name huge over a full screen photo (Cafe Matin), the rest conventional.

**Pros**:
- The strongest first impression.

**Cons**:
- Text over a photo needs darkening; the impact is only above the fold.

## Rationale

Option 1 was the recommendation and the engineer's pick, because it is the only concept that turns
the brand's own phrase into structure: the day photo opens, the night closes on Visítanos, and that
order leads to "Cómo llegar" without a heavier call to action.

The engineer then changed three of the recommendations, and the spec follows them:
- **Continuous darkening instead of fixed tones per section.** The recommendation was fixed tones for
  safe contrast. The engineer's variant removes the risk instead: if the day is today's verde and
  the night is that verde darkened, crema text holds at every point (9.79 at the lightest, 15.90 at
  the darkest). The cost accepted is that browsers without `animation-timeline` see the fixed tones
  only. It is built with an opacity layer, not by animating `background-color`, so the phone's
  compositor (the part of the browser that moves layers without repainting) does the work.
- **A full bleed photo instead of a photo collage.** It costs one image, not three: photo #12 at
  828 px is 41.8 KB in AVIF against 35.0 KB for today's photo, so about 7 KB more. A fade through a
  mask (not a gradient to a colour) keeps the edge invisible while the tone behind it changes.
- **"Cómo llegar" out of the bar, as a gold pill with a pin.** Three copies on one screen diluted
  it; without it the bar stays one row high on a 375 px phone. An underlined link with an arrow was
  tried and rejected by the engineer; of four drawn options (gold outline, an arch shaped button,
  the pill with a pin, a round seal) the engineer picked the pill with a pin, the clearest call to
  action. The arch was the recommendation for being the page's own shape; the pill is the safer read
  on a phone and the choice stands.
- **The fixed layer kept after the cross check.** The cross check proposed replacing it with a
  static gradient on the page (simpler, every browser, no fixed layer). A second mockup showed both
  look almost the same on a phone; the engineer kept the layer, where the whole screen shares one
  tone that changes. The gradient became the fallback instead of fixed tones per section, which had
  visible seams and could not be tested apart from reduced motion.
- **Text below the photo on mobile.** Measured worst case (a white photo pixel under the text):
  gold on the photo at 15 % visibility is 3.03, at 26 % it is 2.19, both under 4.5; crema holds to
  20 % (5.37). Overlapping text and photo was dropped: the photo is 52svh and the text starts where
  it has fully faded. On desktop the mask is transparent across the whole text column. Even on a
  375 × 667 phone the button stays in the first screen (checked in the mockup).

Smaller calls made here (recommendation, then runner up):
- Night colour `#0b1810`: the logo green pushed toward black, keeping its hue. Runner up: a near
  black without hue, which breaks the "same green, darker" idea.
- Grain as an inline SVG noise (about 0.4 KB) instead of a PNG tile (16.6 KB measured).
- The frase as the `<h1>`, the logo in the bar. Runner up: keep the logo as the `<h1>` inside the
  Portada, which would show the logo twice.
- Arches as the signature photo shape: they echo Havana's colonial arcades and were already in use.
- Etiquetas in the system sans with wide letter spacing, like the logo's lettering, at 0 KB, instead
  of an italic face.
- Hover only under `(hover: hover)`, so a tap on a phone never leaves a link stuck in its hover state.
- Reading of the AGENTS.md rule "una única animación protagonista ligada al scroll": the darkening
  is the stage of the animación protagonista (scope 5), and parallax and reveals are
  microinteractions. Runner up: count the darkening as the protagonist itself, which would leave
  scope 5 with nothing to design.

## Evidence

**Reference set** (`references/landing_references/`, 12 images, 2 duplicates): Joe's Coffee, Bodrin
(cutout products, discarded: heavy and not from the café's photos), F&B Restaurant, Bekit Coffee
House, La Consentida, Crust Pizza, Laurent menu, Coffee Connection, Wilma, Zaya rum, a generic
"Café" template, Cafe Matin.

**Photo measurements** (2026-11-04, sharp, AVIF quality 50 as in `scripts/images.ts`):

| Photo | Original | 828 × 1400 | 1440 × 900 |
|---|---|---|---|
| #12 drinks in the garden | 2674 × 4752 | 43 KB | 59 KB |
| #27 croissant on marble | 1200 × 1500 | 46 KB | 50 KB |
| #3 lemons and a hand | 1440 × 1920 | 26 KB | 26 KB |
| #1 candles (today) | 1442 × 2560 | 49 KB | 59 KB |
| #22 garden tables | 1440 × 1920 | 152 KB | 104 KB |
| #23 garden path | 640 × 1136 | 111 KB | 65 KB |

Photo #12 at the chosen crops: 828 × 1104 is 41.8 KB AVIF (58.2 KB WebP); 1080 × 1440 is 57.6 KB;
1920 × 1200 is 87.7 KB. Photos #23, #31 and #32 are under 1080 px wide and too small for full bleed.

**Mockup** (throwaway, outside the repo): Playwright screenshots at 375 and 1440 px at four scroll
positions confirmed the darkening from verde to noche, the one row bar at 375 px, the active anchor
highlight, and that a linear mask fade leaves a faint band on desktop that an eased, multi stop mask
removes.

**Cross check** (a second model, read only, 2026-11-04): found 16 gaps and 9 soundness points.
Applied: exact mask stops and Portada sizes, bar sizes and safe area, four `<picture>` sources so a
browser without AVIF gets the right crop, CSS (not `width`/`height`) reserving the photo box, the
LCP element read from the Lighthouse JSON, a check that the built CSS keeps the new properties, a
build order that never leaves the build red, the 375 × 667 capture, the darkening checks moved to
El lugar (the page is one screen tall until then), crema grain, and the `:hover` check fixed
(Tailwind 4 already guards `hover:` classes). Not applied: a skip link (the bar holds one link) and
14 px etiquetas (gold on night is already 7.72).

**Browser support** (researcher, 2026-11-04): `animation-timeline` with `scroll()` and `view()` ships
in Chrome 115 (Android too), Safari 26 and Firefox 159; Baseline since October 2026. Chromium does not
count an element for LCP while its opacity is 0, so a fade in on the LCP image delays LCP. Support for
`timeline-scope` was not checked; the active anchor degrades to no highlight.

## References

**Project sources**:
- `AGENTS.md` (budgets, SVG and CSS motion, reduced motion, colours in `@theme`)
- Specs 0003 (single theme), 0004 (Instagram photos, `noindex`), 0005 (JS budget), 0007 (title type)
- `scripts/weight.ts` (primera vista at 375 × 812, DPR 2), `scripts/images.ts` (AVIF 50, WebP 70)
- `references/landing_references/`, `references/img-1_files/`
- Tailwind 4.3.3 installed (`@utility` present in `node_modules/tailwindcss/dist/lib.js`)

**Practices & standards**:
- Animate only compositor friendly properties (`transform`, `opacity`)
- Never hide the LCP element behind an entrance animation
- WCAG 2.2 contrast minimum 4.5:1 for text; touch targets at least 44 px
- Progressive enhancement: the static tones are the baseline, the scroll motion an extra

**Links** (web verified on 2026-11-04):
- MDN, `animation-timeline`: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- MDN browser compat data for `animation-timeline`: https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/animation-timeline.json
- web.dev, Largest Contentful Paint: https://web.dev/articles/lcp
- Shopify, don't hide the LCP image behind animations: https://shopify.dev/docs/storefronts/themes/best-practices/performance/dont-hide-lcp-image-behind-animations
- Awwwards, Haven Coffee + Kitchen: https://www.awwwards.com/inspiration/about-we-are-the-super-team-haven-coffee-kitchen
- Fern, From Dawn 'till Dusk and Estelle Scottsdale: cited by name, links not verified
