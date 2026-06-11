# Phase 1 — File structure

> Part of [`MASTER_PLAN.md`](../MASTER_PLAN.md). Tackled in a fresh session.

## Goal

Scaffold the repository so both the server and client can boot (even if empty),
and CodeSandbox can run both tasks. No business logic yet — just the skeleton and
the configs that make everything else possible.

## Scope / checklist

### Repo skeleton
- [x] **Migrate the existing root scaffold into `server/`.** Today the root holds the
      original take-home `src/index.js` (CommonJS, `app.listen(8080)`) and a root
      `package.json`/`yarn.lock`. Move/replace these into `server/` and delete the
      root copies so there's a single source of truth. Keep the requirements comment
      block from the original `src/index.js` only if it adds value — otherwise drop it.
- [x] `server/` and `client/` directories with their own `package.json`.
- [x] Server `package.json`: ESM (`"type": "module"`), `dev` script using
      `nodemon --env-file=../.env`, deps placeholders for express/cors/zod/firebase-admin.
- [x] Client `package.json`: Vite + React 18, `dev` script, deps for
      chakra-ui v3, axios, @tanstack/react-query.
- [x] Minimal runnable entry points: server `src/index.js` (Express listening on
      `PORT`/8080 with a `/health` route), client `src/main.jsx` + `App.jsx`
      rendering a placeholder inside the Chakra Provider.
- [x] Folder placeholders matching the target layout (routes/, services/, store/,
      schemas/, middleware/ on the server; components/, hooks/, etc. on the client).

### Configs
- [x] **Fix the root `.gitignore`.** It currently contains `*.md` and `plans`, which
      would silently make `README.md` and `ARCHITECTURE.md` (the reviewer-facing docs)
      un-committable. Rewrite it to ignore only `node_modules`, `*.env`/`.env`, and
      build output (`dist/`, `.vite/`) — **not** markdown. Keep `plans/` ignored
      (internal working docs), but ensure `README.md` and `ARCHITECTURE.md` are tracked.
- [x] `.nvmrc` (Node 20).
- [x] `.prettierrc`.
- [x] `client/vite.config.js` + `client/index.html`.
- [x] `.codesandbox/tasks.json` defining the **server (8080)** and **client (3000)**
      tasks so the preview boots both.
- [x] `.env.example` documenting required vars (never commit real `.env`).

### Verify
- [x] `cd server && yarn install && yarn dev` → `/health` responds 200.
- [x] `cd client && yarn install && yarn dev` → placeholder page renders.
- [x] Confirm it boots in the CodeSandbox preview, not just locally.

## Documentation (end of phase)
- [x] **Create `ARCHITECTURE.md`** describing the directory layout, the
      two-process model, and the client→server→(future)Firebase data flow.
- [x] **Reference `ARCHITECTURE.md` in `CLAUDE.md`** (add a pointer near the top
      / in the repo-layout section).

## Done when
The repo scaffold is committed, both tasks boot in CodeSandbox, `ARCHITECTURE.md`
exists and is linked from `CLAUDE.md`. Update the Phase 1 checkbox in `MASTER_PLAN.md`.

## Decisions (resolved)
- **Chakra v3 provider:** use `createSystem(defaultConfig)` and wrap the app in
  `<ChakraProvider value={system}>` in `main.jsx`. Do **not** use the v2 `extendTheme`
  / `<ChakraProvider theme={...}>` API. Any theme overrides go through `createSystem`.
- **Geocoding API:** resolved as **OpenWeather** (see `CLAUDE.md`). It is only *called*
  in Phase 2, so Phase 1 writes no geo code — but Phase 1 **does** document the
  `ZIP_API_KEY` var in `.env.example` so the contract is in place.
- **Server module system:** ESM (`"type": "module"`). The original CommonJS
  `src/index.js` is replaced, not extended.
- **Package manager:** **Yarn (classic, v1)** in each project. `server/` and
  `client/` each get their own `yarn.lock`; no root lockfile, no `package-lock.json`.
  Install/run/build all go through `yarn` (`yarn install`, `yarn dev`, `yarn start`,
  `yarn build`), and the CodeSandbox tasks use `yarn` too.
