# 0003. Single theme, no light or dark switch

**Date**: 2026-10-29
**Status**: Accepted

## Summary

The landing has one designed theme: sections alternate between tono crema and tono verde botella,
with a gold accent, and there is no light or dark switch. A café landing is visited for a minute and
lives on its identity, so one theme built from the brand beats a user setting. Colors live in CSS
variables, so a dark mode could still be added later.

## Context

Light and dark mode pays off mostly in tools used for long stretches. A café landing is visited for
a minute and lives on its identity. The brand already has two registers, garden by day and candles
by night, with the logo in bottle green and gold.

## Requirements

_Migrated from ADR 0003. The criteria restate the Decision below; nothing was added._

**Acceptance criteria**:
- **AC-1**: The page has a single theme: sections in tono crema and tono verde botella, alternating,
  with a gold accent.
- **AC-2**: There is no theme switch.
- **AC-3**: Colors are defined in CSS variables (`@theme` in `src/app/globals.css`).

## Decision

One single theme, with its own art direction: sections in tono crema and tono verde botella,
alternating, with a gold accent. There is no theme switch. Colors are defined in CSS variables.

## Rationale

A landing visited for a minute lives on its identity, not on a user setting. The brand already has
its two registers, garden by day and candles by night, in green and gold; one designed theme that
alternates crema and verde expresses both without a switch.

## Consequences

**Positive**:
- Every photo, stroke and animation is tuned to one design only: half the visual review.

**Negative / tradeoffs**:
- It does not follow the visitor's system dark mode preference.

**Neutral**:
- Adding a dark mode later only needs the variables redefined.
