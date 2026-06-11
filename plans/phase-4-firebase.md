# Phase 4 — Firebase integration

> Part of [`MASTER_PLAN.md`](../MASTER_PLAN.md). Tackled in a fresh session.
> Depends on Phase 2 (replaces the mock store) and Phase 3 (verifies E2E).

## Goal

Stand up the Firebase Realtime Database test instance and replace the in-memory
mock store with a real RTDB data layer via the Admin SDK — behind the **same store
interface** from Phase 2, so routes/services don't change.

## Scope / checklist

### Firebase setup (real GCP, Spark/free tier)
- [x] Create a test Firebase project + RTDB instance.
- [x] Generate a service account; put creds in local `.env` and CodeSandbox env
      vars (`FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_DATABASE_URL`). **Never commit.**
- [x] Security rules: `.read: false`, `.write: false` at root (Admin SDK bypasses).
- [x] `.indexOn` `createdAt` for `orderByChild('createdAt')`.

### Server integration
- [x] `server/src/firebase.js` — Admin SDK init from `FIREBASE_SERVICE_ACCOUNT`,
      export `db`.
- [x] Reimplement `server/src/store/users.js` against `/users/{id}` keeping the
      `create/list/get/update/remove` interface identical.
- [x] Use `admin.database.ServerValue.TIMESTAMP` for `createdAt`/`updatedAt`,
      re-read after write to resolve the sentinel into a real number.

### Verify
- [x] All five endpoints work against real RTDB.
- [x] Full client CRUD works in CodeSandbox with Firebase backing.
- [x] Confirm data appears under `/users/{id}` in the Firebase console.

## Documentation (end of phase)
- [x] **Update `ARCHITECTURE.md`**: data layer now RTDB; note the swapped store
      interface and credential flow.
- [x] **Create `DB.md`** — a working guide for *yourself* in future sessions:
      data model (`/users/{id}`), rules, indexing, how to read/write via Admin SDK,
      how to inspect data in the console, env var setup, common pitfalls
      (timestamp sentinels, rules blocking non-admin access).
- [x] **Reference `DB.md` in `CLAUDE.md`** (in the Firebase data model section).

## Done when
The app runs end-to-end on real Firebase in CodeSandbox; `DB.md` exists and is
linked from `CLAUDE.md`. Update the Phase 4 checkbox in `MASTER_PLAN.md`.
