# 0004. Instagram photos and logo only in a private demo

**Date**: 2026-10-29
**Status**: Accepted

## Summary

The demo uses the café's logo and photos from its Instagram so it already looks like theirs. Nobody
has given permission yet, and some photos belong to a photographer (they carry a watermark), so they
are only shown in a private demo: hidden from search engines and shared only with the café. Before
any real launch, permission or original photos are needed.

## Context

The demo uses the logo and photos from the café's Instagram so it already looks personalized. The
café has not given permission yet, and several photos carry the watermark "©Bnal_photographer",
meaning the rights belong to the photographer.

## Requirements

_Migrated from ADR 0004. The criteria restate the Decision below; nothing was added._

**Acceptance criteria**:
- **AC-1**: The deployed demo is marked `noindex`.
- **AC-2**: The demo URL is not published anywhere; it is shared only with the café.

## Decision

Those assets are used only in a private demo: `noindex`, a URL that is not published and is shared
only with the café.

## Rationale

Without permission from the café or the photographer, the photos can only be shown to the café
itself. A private, unindexed demo keeps them within that audience while the demo still looks
personalized.

## Consequences

**Negative / tradeoffs**:
- Before publishing for real, you need permission from the café and the photographer, or the
  original photos without a watermark.

**Neutral**:
- The demo's hosting has to open from a Cuban connection; check it before the pitch.
