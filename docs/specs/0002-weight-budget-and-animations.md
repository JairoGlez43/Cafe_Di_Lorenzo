# 0002. Weight budget and animations with SVG and CSS only

**Date**: 2026-10-29
**Status**: Superseded by 0005

## Summary

The first weight budget for the demo: a light primera vista, a capped full page, at most 90 KB of
gzipped JS, and a fast LCP on a slow phone network. Animations use SVG and CSS only, with one
animación protagonista and small microinteractions. Spec 0005 later raised the JS limit to 180 KB
and kept everything else, so this spec is history.

## Context

The client asks for a "fancy" landing, with animations, but it has to work well over 3G in Cuba.
Some Instagram photos weigh up to 3 MB, so a single unoptimized one already breaks the experience.

## Requirements

_Migrated from ADR 0002. Superseded: the current criteria live in spec 0005. The original limits
stay in the Decision below as history._

## Decision

Primera vista ≤ 300 KB, full page ≤ 1.2 MB, JS ≤ 90 KB gzip and LCP ≤ 3 s in Lighthouse mobile with
a slow network. Animations are built with SVG + CSS (scroll linked animations included); no video,
Lottie or 3D. GSAP only if a specific animation justifies it and it fits the budget. There is one
single animación protagonista; the rest are microinteractions. With `prefers-reduced-motion`,
everything stays static.

## Rationale

On 3G a single unoptimized photo already breaks the experience, so the "fancy" feel the client asks
for has to come from motion that weighs almost nothing (SVG and CSS), inside numeric limits that can
be measured.

## Consequences

**Positive**:
- The weight script fails the slice if any limit is exceeded.

**Negative / tradeoffs**:
- Ideas that depend on video or heavy illustration are ruled out.

**Neutral**:
- Claude decides the motion design, and it is reviewed in each slice.
