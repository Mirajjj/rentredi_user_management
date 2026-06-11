# Phase 5 — Polish & testing

> Part of [`MASTER_PLAN.md`](../MASTER_PLAN.md). Tackled in a fresh session.
> Scope was finalized once Phases 1–4 landed.

## Goal

Take the working end-to-end app and bring it to deliverable quality: visual
polish, the one creative touch, light testing, and the reviewer-facing README.

## Scope

### Visual polishing
- [x] Tidy layout/spacing with Chakra standard components; loading/empty/error
      states feel intentional.
- [x] Basic responsiveness; sensible defaults.

### The creative touch (pick exactly one — see `CLAUDE.md`)
- [x] AI-generated welcome message / optimistic UI / activity log / SSE live updates.
      *Picked none of the listed candidates — went with **geography you can see**
      instead: a real Albers-USA `GeoMap` with per-user pins, plus DST-correct
      local-time display derived client-side from longitude → IANA zone.*
- [x] Document the choice and trade-off in the README.

### Testing
- [ ] Unit tests: `services/geo.js` (mocked fetch) and Zod schemas.
- [ ] Optional `supertest` smoke test on the routes (mock/seed the store).
- [ ] Note in README that Firebase integration tests would live behind the emulator.

> *Testing descoped — deliberate time allocation for a take-home. First tests
> I'd write: `geo.js` unit tests (mocked fetch: happy path, 404→400, 5xx→502),
> schema valid/invalid tables, then supertest smoke tests on the routes with
> the db layer swapped for the in-memory implementation.*

### README (the deliverable)
- [x] Write `README.md` per the structure in `CLAUDE.md` → *README structure*:
      what it is, architecture, tech choices + why, how to run (local +
      CodeSandbox), API table, production-scale list, creative touch, open questions.
      *Shipped slimmer than the planned outline — what-it-is, diagram, endpoints,
      env vars, how-to-run.*

### Final pass
- [x] No dead code, TODOs, or console.logs. Secrets only in env vars.
- [x] Final end-to-end verification in CodeSandbox.

## Done when
App is polished, one creative touch shipped + documented, README complete, final
CodeSandbox verification passes. Update the Phase 5 checkbox in `MASTER_PLAN.md`.
