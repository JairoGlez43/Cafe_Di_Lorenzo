# 0006. Rationale: judge Lighthouse on the median of 5 runs

## Context

Every slice closes with `pnpm lighthouse <N>`: Lighthouse mobile with a simulated slow network and
CPU slowdown, judged against Rendimiento >= 90, Accesibilidad >= 90 and LCP <= 3 s (`AGENTS.md`).
The check is a gate: it decides whether a slice is done.

Lighthouse simulates the slow network and CPU on top of the real machine, so the real machine's load
leaks into the score. On this laptop, single runs of the same build ranged from 67 to 98 on
Rendimiento. With one run, the verdict depends on what else the laptop was doing at that moment.

The forces: the gate must be trustworthy (a fail means the page is slow), cheap enough to run on every
slice, and simple enough for the engineer to explain and rebuild. It runs locally, by one person, on
one machine; there is no CI here to average runs across machines.

## Options considered

### Option 1: the Lighthouse median run over 5 runs

Run 5 times and judge the single run `computeMedianRun` returns: the run closest to the median FCP and
median TTI, the earliest and latest moments of the load.

**Pros**:
- The judged numbers belong to one real run, with its own report to open.
- It is the method the Lighthouse team ships for exactly this problem; its code avoids the median of
  the score itself because the score has outliers at the start and end of the load.

**Cons**:
- Imports an internal path of the package.
- The judged Rendimiento is not always the middle score of the 5.

### Option 2: the median of each number on its own

Run 5 times and take the middle Rendimiento, the middle Accesibilidad and the middle LCP separately.

**Pros**:
- The easiest rule to state and to code without any import.

**Cons**:
- The three numbers can come from three different runs, so no report backs the verdict.

### Option 3: every run must pass

Run several times and fail if any run misses a limit.

**Pros**:
- The strictest gate; no slow run is ever ignored.

**Cons**:
- Brings back the problem: one run slowed by the laptop fails the slice.

### Option 4: keep one run (fix in place)

Leave one run and close the laptop's other apps before checking.

**Pros**:
- No code change, the fastest check.

**Cons**:
- Depends on a habit, not on the script; the 67 to 98 swing stays possible.

## Rationale

The gate has to mean "the page is slow", and only a repeated measurement removes the laptop's load
from the verdict, which rules out Option 4. Option 3 keeps the noise in the gate. Between the two
median options, Option 1 wins because a gate's verdict must be traceable: you open the one report
that failed and read why. Option 2 would give a verdict no single report can explain.

The smaller choices, with their runner up:
- **5 runs, fixed.** Odd, so there is a real middle run, and one outlier cannot become it; an
  estimated 2 to 3 minutes per check. Runner up: 5 by default with an env var to change it, rejected so every slice
  closes with the same number of runs.
- **Import `computeMedianRun` as it is.** About 30 lines we do not have to maintain, and a moved path
  fails the typecheck at once. Runner up: copy the logic into the script, which removes the internal
  import but adds code to own.
- **A broken run stops the check with exit 1.** A run with no result or no FCP usually means the page
  did not paint, which is a real problem to see. Runner up: drop the broken run and judge the rest
  (Lighthouse's `filterToValidRuns`), rejected because it could pass a slice on 2 runs without notice.
- **Not Lighthouse CI.** `@lhci/cli` offers several runs with the same median run function, but it
  adds a dependency and a config file to replace a script that already serves `out/` its own way.
- **One Chrome, runs in sequence, `LIGHTHOUSE_*` env vars.** Decided as implementation detail: storage
  is reset between runs anyway, parallel runs add CPU noise, and the env vars copy the `PESO_*` pattern.

## Evidence: runs measured on 2026-10-31

| Batch | Rendimiento per run | Median run (Rendimiento) |
|---|---|---|
| Before, single runs | 67 to 98 across separate runs | (not applicable) |
| 1 | 94, 99, 93, 92, 94 | run 3 (93) |
| 2, with `LIGHTHOUSE_LCP_MS=100` | 94, 96, 96, 94, 96 | run 5 (96), exit 1 as expected |

Accesibilidad was 100 in every run of both batches. LCP was 1673 to 2387 ms in batch 1 and
2263 to 2436 ms in batch 2. In batch 1 the median run scored 93 while the middle score was 94,
the tradeoff noted in Consequences.
