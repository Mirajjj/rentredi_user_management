# Phase 3 — Frontend

> Part of [`MASTER_PLAN.md`](../MASTER_PLAN.md). Tackled in a fresh session.
> Depends on Phase 2 (talks to the running backend).

## Goal

A clean React UI for the full user CRUD flow on **Chakra UI v3 standard
components**. Data access goes through a small Axios + TanStack Query layer.
The code is organised into a **conventions-driven module structure** (see
[`client/CONVENTIONS.md`](../client/CONVENTIONS.md)) rather than a flat
`components/` + `api.js` layout — alias imports, a `theme/`, a reusable
`modules/base/` primitive set, and an `lib/api/` query layer.

## Target client layout

```
client/
├── jsconfig.json                 # NEW — path aliases for the editor (mirrors vite)
├── vite.config.js                # add resolve.alias (kept in sync with jsconfig)
├── CONVENTIONS.md                # DONE — curated FE conventions
└── src/
    ├── main.jsx                  # mount: ChakraProvider(system) + QueryClientProvider
    ├── App.jsx                   # composes the page → renders <UsersPage/>
    ├── theme/
    │   ├── index.js              # `system` = createSystem(defaultConfig, customConfig)
    │   └── tokens.js             # defineConfig() token overrides (brand color, fonts)
    ├── lib/
    │   └── api/
    │       ├── client.js         # axios instance, baseURL = import.meta.env.VITE_API_URL
    │       ├── routes.js         # { users: { list, byId, create, update, remove } }
    │       ├── types.js          # @typedef User, UserInput (the API contract)
    │       └── queries/
    │           ├── keys.js               # query-key factory (userKeys)
    │           ├── use-api-users.js       # useAPIUsers()       → GET  /users
    │           ├── use-api-create-user.js # useAPICreateUser()  → POST /users
    │           ├── use-api-update-user.js # useAPIUpdateUser()  → PUT  /users/:id
    │           └── use-api-delete-user.js # useAPIDeleteUser()  → DEL  /users/:id
    └── modules/
        ├── base/                 # the reusable primitive set (mini component library)
        │   ├── index.js          # barrel
        │   ├── Field.jsx         # label + control + error text wrapper
        │   ├── EmptyState.jsx    # loading / empty / error message block
        │   └── ConfirmButton.jsx # button + confirm dialog (used by delete)
        └── users/                # the one feature module
            ├── index.js          # barrel → UsersPage (named)
            ├── UsersPage.jsx     # composes form + list, owns local UI state
            ├── UserList.jsx      # loading/empty/error states + maps UserCard
            ├── UserCard.jsx      # one user + edit/delete actions
            └── UserForm.jsx      # create/edit form (name, zipCode)
```

> `modules/base` is intentionally tiny — build a primitive only when a second
> caller appears. Don't scaffold the whole folder up front.

## Scope / checklist

### 0. Conventions & aliases (foundation)
- [x] `client/CONVENTIONS.md` — curated from the reference conventions, adapted
      to JS/JSDoc, scoped to this project (dropped `@mocks`, the dead `@lib`
      placeholder, and the "three styling systems" framing).
- [x] `client/jsconfig.json` — `compilerOptions.paths` for `@/ @theme/ @lib/
      @base/ @modules/`, plus `"checkJs": true` for `// @ts-check`.
- [x] `client/vite.config.js` — add `resolve.alias` mirroring jsconfig (same
      five aliases). Edit both files in the same change.

### 1. Theme (`src/theme/`)
- [x] `tokens.js` — `defineConfig({ theme: { tokens: { colors, fonts } } })`
      with a small brand override (one accent color). Keep minimal.
- [x] `index.js` — `export const system = createSystem(defaultConfig, customConfig)`.
- [x] `main.jsx` imports `system` from `@theme` (replaces the inline
      `createSystem(defaultConfig)`), and wraps the tree in
      `QueryClientProvider` (a module-scoped `QueryClient`) **inside**
      `ChakraProvider`.

### 2. API layer (`src/lib/api/`)
- [x] `client.js` — single configured Axios instance:
      `axios.create({ baseURL: import.meta.env.VITE_API_URL })`. Optionally a
      response interceptor that unwraps `error.response.data` so callers see the
      server's `{ error, details }` shape.
- [x] `routes.js` — a plain object of path builders, the single source of URL
      truth:
      ```js
      export const routes = {
        users: {
          list:   () => "/users",
          byId:   (id) => `/users/${id}`,
          create: () => "/users",
          update: (id) => `/users/${id}`,
          remove: (id) => `/users/${id}`,
        },
      };
      ```
- [x] `types.js` — `@typedef User` (matches the server `User` shape) and
      `@typedef UserInput` (`{ name, zipCode }`). This is the API contract; the
      users module imports these via `@lib/api/types`.
- [x] `queries/keys.js` — query-key factory: `userKeys = { all: ['users'],
      detail: (id) => ['users', id] }`. Mutations invalidate `userKeys.all`.
- [x] `queries/use-api-users.js` — `useAPIUsers()`: `useQuery` over
      `routes.users.list()`.
- [x] `queries/use-api-create-user.js` — `useAPICreateUser()`: `useMutation`,
      invalidates `userKeys.all` on success.
- [x] `queries/use-api-update-user.js` — `useAPIUpdateUser()`: `useMutation`
      `(id, fields)`, invalidates on success.
- [x] `queries/use-api-delete-user.js` — `useAPIDeleteUser()`: `useMutation`,
      invalidates on success.

> Every query hook is prefixed `useAPI` per the naming request — the prefix
> marks "this hook hits the server" and keeps them grouped in autocomplete.

### 3. Base primitives (`src/modules/base/`)
- [x] `Field.jsx` — wraps a label, a Chakra control (passed as children), and
      conditional error text. Used by `UserForm`.
- [x] `EmptyState.jsx` — renders a centered message + optional spinner; drives
      the list's loading / empty / error branches.
- [x] `ConfirmButton.jsx` — a destructive button that opens a Chakra v3 confirm
      dialog before firing `onConfirm`. Used by delete.
- [x] `index.js` — barrel re-exporting the three.

### 4. Users feature (`src/modules/users/`)
- [x] `UserForm.jsx` — controlled `name` + `zipCode`; client-side required +
      5-digit zip check; surfaces server `400 details` on submit failure.
      Reused for create and edit (edit pre-fills, calls update).
- [x] `UserCard.jsx` — one user: name, zip, lat/lon, timezone (UTC-offset
      seconds, rendered human-readably e.g. `UTC-05:00`), edit + delete actions.
- [x] `UserList.jsx` — consumes `useAPIUsers()`; renders `<EmptyState>` for
      loading/empty/error, otherwise maps `UserCard`.
- [x] `UsersPage.jsx` — composes `UserForm` + `UserList`; owns the "currently
      editing user" local UI state. Calls the `useAPI*` mutation hooks.
- [x] `index.js` — barrel → `UsersPage`.
- [x] `App.jsx` — renders `<UsersPage/>` inside a page container.

### Behavior
- [x] Create → list refreshes (cache invalidation). Edit → updates in place.
      Delete → removes (with confirm).
- [x] Surface server validation errors (`400 { error, details }`) inline in the
      form, not just a toast.
- [x] JSDoc on every exported component/hook/function.

### Verify
- [x] Full CRUD against the running backend, locally and in CodeSandbox.
- [x] Aliases resolve in both Vite (runtime) and the editor (jsconfig).
- [x] Client points at the correct `VITE_API_URL` for the CodeSandbox 8080 preview.

## Constraints
- Use Chakra v3 APIs (`createSystem`, `defineConfig`, v3 prop names, v3 Dialog) —
  confirm against the docs before generating. Not v2.
- Standard components only; the one creative touch is saved for Phase 5.
- No `./` / `../` imports anywhere under `src/` — alias only.
- Keep `modules/base` minimal; no speculative primitives.

## Documentation (end of phase)
- [x] **Update `ARCHITECTURE.md`**: the new client structure (theme / lib·api /
      modules·base / modules·users), the alias system, api → queries → components
      layering, and how server-state (React Query) vs UI-state (local) is split.
- [x] **Update `CLAUDE.md`** repo-layout section to match the module structure
      (the old flat `components/` + `api.js` sketch is now superseded), and note
      `CONVENTIONS.md` as a read-first client doc.

## Done when
The UI does full CRUD through the server in CodeSandbox, follows
`CONVENTIONS.md`, and the docs reflect the structure. Update the Phase 3
checkbox in `MASTER_PLAN.md`.
