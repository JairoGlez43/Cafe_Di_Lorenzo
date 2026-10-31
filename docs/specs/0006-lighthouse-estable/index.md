# 0006. Judge Lighthouse on the median of 5 runs

**Date**: 2026-10-31
**Status**: Accepted
**Ratified**: 2026-10-31 by /architect. It was first built on an assumption during /develop, and the assumption held.

## Summary

`pnpm lighthouse <N>` now runs Lighthouse 5 times in a row and judges one run: the median run that
Lighthouse's own `computeMedianRun` picks. One run on this laptop swung from 67 to 98 on Rendimiento
for the same build, so a slice could fail because of CPU load rather than the page. The limits stay
the same; only the way of measuring changes, and the check takes a few minutes instead of one
(an estimate, not timed).

## Requirements

**User stories**:
- As the engineer closing a slice, I want the Lighthouse check to fail only when the page is slow,
  so that a busy laptop does not block a slice that is fine.

**Acceptance criteria**:
- **AC-1**: `pnpm lighthouse <N>` runs Lighthouse several times and prints every run.
- **AC-2**: it judges the median against the same limits as before.
- **AC-3**: it still exits 1 when the median fails, checked with a lowered limit.
- **AC-4**: every run's report is kept in `.verify/slice-N/`.

## Decision

**Chosen option**: Option 1: the Lighthouse median run over 5 runs.

The script runs Lighthouse 5 times, one after another, and judges the run `computeMedianRun`
returns (imported from `lighthouse/core/lib/median-run.js`) against Rendimiento >= 90,
Accesibilidad >= 90 and LCP <= 3000 ms; any broken run stops the check with exit 1.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).

## Feature design

No data model, API or permissions: this is a local Node script that reads `out/` and writes reports.

**Run loop**:
- Lighthouse config: its default config (mobile, simulated slow network, CPU x4), with
  `onlyCategories: ["performance", "accessibility"]`, unchanged from the single run version.
- 5 runs, fixed. Not configurable, so every slice is closed with the same number of runs.
- Runs go one after another, never in parallel (parallel runs fight for the CPU, the noise this removes).
- One Chrome (Playwright's Chromium) and one local gzip server (`scripts/servidor.ts`) for all 5 runs.
  Lighthouse resets the page's storage and cache before each run (its `disableStorageReset` stays off),
  but the Chrome process itself stays warm between runs; no run is discarded as a warm up.

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Each run | Rendimiento | `lhr.categories.performance.score`, times 100, rounded |
| Each run | Accesibilidad | `lhr.categories.accessibility.score`, times 100, rounded |
| Each run | LCP (ms) | `lhr.audits["largest-contentful-paint"].numericValue`, rounded |
| Judge | The judged run | `computeMedianRun(all 5 results)`: the run closest to the median FCP (first content on screen) and median TTI (page ready to respond) |
| Judge | Run number printed as the median | `indexOf` of the returned object in the list (it is the same object, not a copy), plus 1 |
| Judge | Limits | env `LIGHTHOUSE_RENDIMIENTO`, `LIGHTHOUSE_ACCESIBILIDAD`, `LIGHTHOUSE_LCP_MS`; defaults 90, 90, 3000 from `AGENTS.md` |
| Judge | Pass or FALLA per row | the rounded values above, the same ones printed: Rendimiento and Accesibilidad `>=` their limit, LCP `<=` its limit |
| Save | Report path | `.verify/slice-<N>/lighthouse-<i>.json`, `<N>` from the first CLI argument; the folder is created if missing |
| Exit | Exit code | 1 when `<N>` is missing, when a run returns no result, when `computeMedianRun` throws because a run lacks the `first-contentful-paint` or `interactive` audit value, or when any judged row fails; else 0 |

**Key invariants**:
- The three judged numbers always come from the same real run, and that run's report is on disk.
- A broken run is never skipped: the check fails loudly instead of judging fewer runs.
- Chrome and the server close in a `finally`, whether the check passes, fails or throws.

**Configuration required**:
- `LIGHTHOUSE_RENDIMIENTO`, `LIGHTHOUSE_ACCESIBILIDAD`, `LIGHTHOUSE_LCP_MS`: optional; change a limit to
  prove the script fails. Same pattern as `PESO_*_KB` in `pnpm weight`.

**Critical test scenarios**:
- Happy path: `pnpm build && pnpm lighthouse 1` prints 5 runs and the median run, exit 0, verifies **AC-1**, **AC-2**
- Failure case: `LIGHTHOUSE_LCP_MS=100 pnpm lighthouse 1` marks LCP as FALLA, exit 1, verifies **AC-3**
- Evidence: after a run, `.verify/slice-1/` holds `lighthouse-1.json` to `lighthouse-5.json`, verifies **AC-4**

## Build plan

Already built in `scripts/lighthouse.ts` during /develop, against the same choices this spec ratifies.

1. Read the limits from the `LIGHTHOUSE_*` env vars with the `AGENTS.md` defaults, satisfies **AC-2**, **AC-3**
2. Run Lighthouse 5 times in sequence, saving `lighthouse-<i>.json` and printing each run, satisfies **AC-1**, **AC-4**
3. Pick the median run with `computeMedianRun`, print its number, judge it against the limits and set the exit code, satisfies **AC-2**, **AC-3**

## Consequences

**Positive**:
- A slice fails because of the page, not the laptop: one bad run (like the 67) cannot become the median.
- Each verdict points to one report you can open and read whole.

**Negative / tradeoffs**:
- The check takes about 5 times longer (estimated 2 to 3 minutes on this laptop).
- `computeMedianRun` is an internal path, not a public export. A Lighthouse upgrade may move it;
  `pnpm exec tsc --noEmit` then fails with a missing module, so it breaks loudly, not silently.
- The median run is chosen by load timing, not by score, so its Rendimiento can sit slightly below
  the middle score of the 5 runs, and the same holds for its LCP, the number the gate cares about
  most. That is accepted: the timing is what both come from.
- One broken run fails the whole check, even if the other 4 were fine. Runs before it are printed
  and saved; later report files from an older batch stay on disk, so after an exit 1 the folder
  can mix two batches. The exit 1 is the signal that this batch does not count.
- An env var set to an empty string becomes 0 (`??` only catches a missing var), so
  `LIGHTHOUSE_RENDIMIENTO=""` makes that limit always pass. `pnpm weight` has the same gap with `PESO_*`.

**Neutral**:
- Report names change from `lighthouse.json` to `lighthouse-1.json` … `lighthouse-5.json`; nothing else reads them.

## Follow-up

- [ ] The `pnpm lighthouse` line in `AGENTS.md` still describes one run; it should mention the 5 runs,
      the median run and the `LIGHTHOUSE_*` env vars (a `/sync` job).
- [ ] When upgrading `lighthouse`, run `pnpm exec tsc --noEmit` to confirm `median-run.js` is still there.
- [ ] Make `scripts/lighthouse.ts` and `scripts/weight.ts` fail when a limit env var is not a number
      (empty string included), instead of reading it as 0.
