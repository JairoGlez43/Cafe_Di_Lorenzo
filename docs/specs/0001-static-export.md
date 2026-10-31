# 0001. Static export and content in a single module

**Date**: 2026-10-29
**Status**: Accepted

## Summary

The landing is a static export: only HTML, CSS, JS and images, with no server and no database.
All editable content lives in one typed content module, and components only read from it. That
keeps hosting free and portable, lets the demo be shown offline, and means a content change is an
edit to that module plus a rebuild.

## Context

The demo will be seen mostly on phones in Cuba, over 3G data. It has to be hostable anywhere
(including a Cuban host if the café asks for one) and showable even without a connection. Even so,
the content (products, opening hours) has to be changeable later.

## Requirements

_Migrated from ADR 0001. The criteria restate the Decision below; nothing was added._

**Acceptance criteria**:
- **AC-1**: `pnpm build` exports the site to `out/`, and serving `out/` needs only a static file
  host: no server code runs and no database is queried.
- **AC-2**: All editable content lives in one typed content module (`src/content.ts`); components
  only read from it and hold no copy of their own.
- **AC-3**: Changing content means editing that module and rebuilding, with no component change.

## Decision

Next.js with `output: 'export'`: only HTML, CSS, JS and images, with no server and no database.
All editable content lives in a single typed content module, and components only read from it. To
change content, you edit that module and rebuild.

## Rationale

The demo must be hostable anywhere, including a Cuban host, and showable offline; a folder of
static files meets both. The content still has to change later, so it is kept in one module that a
rebuild picks up, instead of being spread across components.

## Consequences

**Positive**:
- Zero server time; hosting is free and portable.

**Negative / tradeoffs**:
- The `next/image` optimizer does not work: images are converted at build time (sharp).

**Neutral**:
- If the café accepts, how content gets edited (a CMS on top of git, a Google Sheet read at build
  time, or a server with ISR) is decided then, without touching the components. Orders or
  reservations would force leaving the static export.
