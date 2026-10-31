# 0005. Next.js App Router with a 180 KB JS budget

**Date**: 2026-10-29
**Status**: Accepted

## Summary

A minimal Next.js App Router build already ships about 170 KB of gzipped JS, so the 90 KB limit of
spec 0002 cannot hold with any Next variant. The decision keeps Next.js with the App Router, raises
the JS limit to 180 KB gzip and keeps every other limit of spec 0002. Your own JS has about 10 KB
left, so components stay on the server unless they need interaction, and Astro is the measured way
out if the budget breaks.

## Context

Spec 0001 picks Next.js and spec 0002 caps JS at 90 KB gzip. A minimal build with
`output: 'export'` (Next 16.4.3, React 19.3, App Router, one page with an `<h1>` and a link) already
loads 170 KB gzip of JS (168 KB with webpack). With the Pages Router it is 111 KB, and with Astro,
0 KB: no Next variant fits in 90 KB. Lighthouse 12 mobile (simulated slow network, CPU ×4) on that
minimal build gives Performance 97 to 99, LCP 2.0 to 2.1 s and TBT 90 to 180 ms.

## Requirements

_Migrated from ADR 0005. The criteria restate the Decision below; nothing was added._

**Acceptance criteria**:
- **AC-1**: The gzip sum of every script the exported `index.html` loads is ≤ 180 KB.
- **AC-2**: The primera vista is ≤ 300 KB and the full page is ≤ 1.2 MB.
- **AC-3**: LCP is ≤ 3 s in Lighthouse mobile with a slow network.
- **AC-4**: Animations use only SVG + CSS (scroll linked ones included); no video, Lottie or 3D.
- **AC-5**: There is one single animación protagonista; everything else is microinteractions.
- **AC-6**: With `prefers-reduced-motion`, everything stays static.

## Decision

Next.js with the App Router stays, and the JS limit rises to 180 KB gzip, measured as the gzip sum
of every script the exported `index.html` loads. The rest of spec 0002 stays the same: primera vista
≤ 300 KB, full page ≤ 1.2 MB and LCP ≤ 3 s in Lighthouse mobile with a slow network; animations only
with SVG + CSS (scroll linked ones included), no video, Lottie or 3D; one single animación
protagonista and the rest microinteractions; with `prefers-reduced-motion`, everything stays static.

## Rationale

No Next.js variant fits in 90 KB, yet the same minimal App Router build still scores Performance 97
to 99 with LCP around 2 s on a simulated slow phone. The limit that could not hold is the JS one, so
only that one moves; the limits that protect the visitor stay. Astro, at 0 KB, is measured and kept
as the alternative.

## Consequences

**Negative / tradeoffs**:
- The framework takes about 170 of the 300 KB of the primera vista: about 130 KB are left for HTML,
  CSS, font, logo and the Portada photo.
- Your own JS has about 10 KB gzip left. Components are Server Components, and only those that need
  interaction carry `'use client'` (Menú, the animation fallback). GSAP does not fit (27.7 KB gzip
  the core, plus 17.6 KB ScrollTrigger).

**Neutral**:
- Upgrading Next can grow the runtime; the weight script detects it and fails the slice.
- If the budget does not hold, the alternative already measured is Astro (0 KB base), with a spec
  that supersedes spec 0001.
