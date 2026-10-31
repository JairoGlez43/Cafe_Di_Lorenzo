# Verify: Lighthouse estable · spec 0006 · updated 2026-10-31
_Steps derived from spec 0006 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## Commands
- [ ] `pnpm build && pnpm lighthouse 1` → prints 5 runs, names the median run, exit 0        → AC-1, AC-2
- [ ] `LIGHTHOUSE_LCP_MS=100 pnpm lighthouse 1` → the LCP row reads FALLA, exit 1        → AC-3
- [ ] List `.verify/slice-1/` after a run → `lighthouse-1.json` to `lighthouse-5.json` are there        → AC-4

## Acceptance-criteria coverage
- AC-1 and AC-2 covered by step 1 · AC-3 by step 2 · AC-4 by step 3
