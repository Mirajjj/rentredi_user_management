# MASTER_PLAN

The build plan for the RentRedi User Management take-home. This is the top-level
checklist; each phase has its own detailed plan file under [`plans/`](./plans/).

**Source of truth for requirements:** [`MASTER_REQUIREMENTS.md`](./MASTER_REQUIREMENTS.md)
— the reviewer's brief (API key redacted). This plan implements those requirements; if the
two ever disagree, the requirements win.

**End goal:** a working project running on
[codesandbox.io](https://codesandbox.io/p/github/Mirajjj/rentredi_user_management/main)
— both server (8080) and client (3000) boot and the app functions end-to-end in
the CodeSandbox preview, where the reviewer verifies it.

## How this plan is organized

- Each phase is a self-contained unit of work with its own plan file.
- Phases are tackled **one per fresh session** — finish a phase, commit, then
  start a new session on the next.
- Every phase ends by updating the living architecture doc
  ([`ARCHITECTURE.md`](./ARCHITECTURE.md)) so the next session has accurate context.
- Keep scope tight (see `CLAUDE.md` → *Scope discipline*). Clean and complete
  over impressive and sprawling.

## Phases

- [x] **Phase 1 — File structure** → [`plans/phase-1-file-structure.md`](./plans/phase-1-file-structure.md)
  - Scaffold the repo layout (server + client skeletons, configs, CodeSandbox tasks).
  - **Doc:** create `ARCHITECTURE.md`, reference it in `CLAUDE.md`.

- [x] **Phase 2 — Backend with mocked storage** → [`plans/phase-2-backend-mock.md`](./plans/phase-2-backend-mock.md)
  - CRUD `/users` endpoints, Zod validation, geo enrichment, centralized errors.
  - Data layer is a **single-file in-memory mock** (no Firebase yet).
  - **Doc:** update `ARCHITECTURE.md`.

- [x] **Phase 3 — Frontend** → [`plans/phase-3-frontend.md`](./plans/phase-3-frontend.md)
  - React + Vite + **Chakra UI v3 standard components** (no over-design).
  - Axios client + TanStack Query hooks for the CRUD flows.
  - **Doc:** update `ARCHITECTURE.md`, add `client/CONVENTIONS.md`, refresh
    `CLAUDE.md` layout.

- [x] **Phase 4 — Firebase integration** → [`plans/phase-4-firebase.md`](./plans/phase-4-firebase.md)
  - Create the Firebase test instance; swap the mock store for RTDB via Admin SDK.
  - **Doc:** update `ARCHITECTURE.md`, create `DB.md` (how to work with the DB),
    reference `DB.md` in `CLAUDE.md`.

- [x] **Phase 5 — Polish & testing** → [`plans/phase-5-polish-testing.md`](./plans/phase-5-polish-testing.md)
  - Visual polishing, the one creative touch (GeoMap + local time), README.
  - Tests deliberately descoped — time allocation for a take-home.

## Documentation map

| Doc | Created in | Purpose |
|---|---|---|
| `MASTER_REQUIREMENTS.md` | exists | The reviewer's brief (API key redacted) — source of truth. |
| `CLAUDE.md` | exists | Standing guidance, read every session. |
| `ARCHITECTURE.md` | Phase 1 (updated each phase) | Living description of structure and decisions. |
| `DB.md` | Phase 4 | How to work with the Firebase database. |
| `README.md` | Phase 5 | The reviewer-facing deliverable. |
| `MASTER_PLAN.md` + `plans/*` | now | This plan and its phase breakdowns. |

## Definition of done (whole project)

- All five `/users` endpoints work end-to-end against real Firebase RTDB.
- Client performs full CRUD through the server API via Axios + React Query.
- App boots and functions in the CodeSandbox preview (server + client tasks).
- README explains decisions; one creative touch is documented.
- No dead code, no leftover TODOs/console.logs, secrets only in env vars.
