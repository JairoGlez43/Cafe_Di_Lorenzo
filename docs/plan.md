# Plan
## Slices
- [ ] 1. Tracer bullet: Portada deployed. Demo: private URL with the Portada (logo, phrase, "Cómo llegar", WhatsApp, IG) on tono verde, one photo converted to AVIF/WebP, all text read from the módulo de contenido. Done when: `pnpm build` produces a static export with no server; weight script passes every limit in CLAUDE.md (primera vista, full page, JS); Lighthouse mobile slow network ≥ 90 Performance and Accessibility, LCP ≤ 3 s; Playwright screenshots at 375/1440 + reduced-motion; deployed URL serves `noindex`; opened on a real phone. Decide first: hosting, link data, Portada phrase, how to measure primera vista.
- [ ] 2. El lugar + Visítanos with typography. Demo: Portada → El lugar (tono crema) → Visítanos (tono verde) with address, hours and "Cómo llegar"; self-hosted subset font. Done when: CLAUDE.md checks; the font keeps primera vista within budget; no CLS in Lighthouse. Decide first: typography, map in Visítanos.
- [ ] 3. Animación protagonista. Demo: on scroll, an SVG + CSS animation leads from the Portada to "Cómo llegar"; static with reduced-motion. Done when: CLAUDE.md checks; screenshots at 3 scroll positions; JS still within the CLAUDE.md budget; smooth on a real phone (Android Chrome, and iOS Safari if one is available). Decide first: animation motif, fallback without scroll-timeline.
- [ ] 4. Menú. Demo: Menú section with Café · Brunch · Dulces · Batidos; switching categoría animates its gold-line icono de categoría. Done when: CLAUDE.md checks; categorías usable with keyboard and screen reader (Accessibility ≥ 90); productos read from the módulo de contenido. Decide first: product names, productos with or without photo.
- [ ] 5. Galería. Demo: gallery of IG photos with lazy loading and responsive sizes. Done when: CLAUDE.md checks; full page ≤ 1.2 MB; no original from `references/` inside the export. Decide first: which photos and how many.
- [ ] 6. Pie, microinteracciones and pitch-ready demo. Demo: Pie, soft section entrances, link preview when shared on WhatsApp, polished full page. Done when: CLAUDE.md checks on the whole page; URL opens from a Cuban connection; demo can be shown offline. Decide first: offline showing, preview image.

## Open questions
- Typography (family, weights, subset). Decides: Claude proposes. (before slice 2)
- Opening hours (address already provisional from IG, in the módulo de contenido). Decides: client. (before slice 2)
- Map in Visítanos: link only, static image, or none (no iframe). Decides: Claude proposes. (before slice 2)
- Motif of the animación protagonista. Decides: Claude proposes. (before slice 3)
- Fallback for browsers without CSS scroll-driven animations: static or a little JS. Decides: Claude proposes. (before slice 3)
- Product names per categoría. Decides: client. (before slice 4)
- Productos with photo or text only. Decides: Claude proposes. (before slice 4)
- Which photos go in the Galería, how many, and whether watermarked ones are included. Decides: Claude proposes. (before slice 5)
- How to show the demo offline (local `out/` folder or PWA). Decides: me. (before slice 6)
- Preview image for sharing on WhatsApp. Decides: Claude proposes. (before slice 6)
