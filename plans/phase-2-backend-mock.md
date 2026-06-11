# Phase 2 — Backend with mocked storage

> Part of [`MASTER_PLAN.md`](../MASTER_PLAN.md). Tackled in a fresh session.
> Depends on Phase 1.

## Goal

A fully working CRUD backend for `/users` with geo enrichment and validation —
but persistence is a **single-file in-memory mock** so the API can be built and
tested without Firebase. Phase 4 swaps the storage implementation behind the same
interface.

## Scope / checklist

### Data layer (mock)
- [x] `server/src/store/users.js` — a single-file in-memory store exposing a clean
      async interface: `create`, `list`, `get`, `update`, `remove`.
      Use a `Map`, async signatures, and unix-ms timestamps so the Firebase swap
      in Phase 4 is drop-in.

### Schemas
- [x] `server/src/schemas/user.js` — Zod schemas: client input (`{ name, zipCode }`),
      update input (`{ name?, zipCode? }`), persisted `User` shape, and the geo API
      response shape.

### Geo enrichment
- [x] `server/src/services/geo.js` — `zipCode` → `{ latitude, longitude, timezone }`.
      Validate the external response with Zod. **Resolve the geocoding API URL/key
      first** (see `CLAUDE.md` → geocoding note) — don't guess.

### Routes + middleware
- [x] `server/src/routes/users.js` — thin handlers, all logic in store/services.
- [x] `server/src/middleware/errors.js` — centralized error handler
      (400 validation, 404 not found, 500 with stack logged).
- [x] `server/src/middleware/logging.js` — structured request logger.
- [x] Wire `cors()` and routes in `src/index.js`.

### Behavior
- [x] POST derives geo; PUT re-derives geo **only if zip changed**.
- [x] GET list sorted by `createdAt` desc.
- [x] Error shapes match `CLAUDE.md` → *API surface*.

### Verify
- [x] Manual curl/Thunder of all five endpoints.
- [ ] (Optional, if cheap) unit tests on `geo.js` (mock fetch) and the Zod schemas.
      *Skipped — deliberate time allocation for a take-home.*
- [x] Boots in CodeSandbox.

## Documentation (end of phase)
- [x] **Update `ARCHITECTURE.md`**: backend module breakdown, the store interface
      contract (so the Phase 4 swap is obvious), error/validation flow.

## Done when
All five endpoints work against the mock store, validation + error handling match
the spec, geo enrichment works. Update the Phase 2 checkbox in `MASTER_PLAN.md`.
