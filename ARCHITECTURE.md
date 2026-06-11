# Architecture

Living description of how this project is structured and why. Updated at the end
of each build phase. Current state: **Phase 4 — Firebase RTDB integration
complete (mock store replaced by real Realtime Database).**

## Two-process model

The app is two independent processes that run side by side (locally and in the
CodeSandbox Devbox):

```
┌──────────────────────────┐         ┌──────────────────────────┐
│  CLIENT                  │  HTTP   │  SERVER                  │
│  React + Vite + Chakra   ├────────►│  Node + Express          │
│  Port 3000               │  (REST) │  Port 8080               │
└──────────────────────────┘         └────────────┬─────────────┘
                                                  │ Admin SDK (service account)
                                                  ▼
                                     ┌──────────────────────────┐
                                     │  Firebase RTDB (real GCP)│
                                     └──────────────────────────┘
```

See [`DB.md`](./DB.md) for the working guide to the database: data model, rules,
indexing, credential flow, and common pitfalls.

- The **client never talks to Firebase directly.** All data flows through the
  server's REST API, so credentials stay scoped to the backend and the client
  needs no Firebase config.
- The server owns geo enrichment (zip → lat/lon/timezone via OpenWeather) and
  persistence. The client is a thin CRUD UI over the API.

## Directory layout

```
/
├── server/                  # Node + Express API (ESM)
│   ├── src/
│   │   ├── index.js         # App entry: CORS, JSON, logging, /health, /users, error handler
│   │   ├── routes/users.js  # Thin CRUD handlers (logic delegated to db/services)
│   │   ├── services/geo.js  # zip → {latitude, longitude, timezone} via OpenWeather
│   │   ├── firebase.js      # Admin SDK init (base64 service account), exports rtdb
│   │   ├── db/              # Data layer (db.users.create(…)): index.js barrel + users.js
│   │   │   ├── index.js     #   barrel: export const db = { users }
│   │   │   └── users.js     #   Firebase RTDB (/users/{id}) via Admin SDK
│   │   ├── schemas/        # Zod schemas (*-schema.js), split by boundary:
│   │   │   ├── geo-schema.js  # shared geo building blocks + OpenWeather response
│   │   │   ├── db/user-schema.js     # persisted User record (+ field primitives)
│   │   │   └── routes/user-schema.js # request inputs + userResponseSchema (output)
│   │   └── middleware/      # errors.js (handler + HttpError), logging.js (request
│   │                        #   log), rate-limit.js (per-IP cap on create/update)
│   ├── .env.example         # server env template (Firebase, ZIP_API_KEY, PORT)
│   ├── .nvmrc / .prettierrc  # Node 20, formatting
│   └── package.json
├── client/                  # React 18 + Vite + Chakra UI v3
│   ├── src/
│   │   ├── main.jsx         # Mount: ChakraProvider(system) + QueryClientProvider
│   │   ├── App.jsx          # Page shell → renders <UsersPage/>
│   │   ├── theme/           # Chakra v3 system: tokens.js + index.js (createSystem)
│   │   ├── lib/api/         # API client + route builders + types + useAPI* query hooks
│   │   │   ├── index.js     #   ClientAPI() factory + `api` singleton (api.createUser(…), …)
│   │   │   ├── client.js    #   createHttp(): configured axios instance (+ error unwrap)
│   │   │   ├── routes.js    #   path builders ({ users: { list, byId, … } })
│   │   │   ├── endpoints/   #   per-resource method groups: users.js → usersEndpoints(http)
│   │   │   ├── types.js     #   @typedef User / UserInput (the API contract)
│   │   │   └── queries/     #   keys.js + use-api-{users,create,update,delete}-user.js
│   │   ├── pages/           # Page (container) components — UsersPage.jsx
│   │   └── modules/         # Feature modules (barrel-only public surface)
│   │       ├── base/        #   reusable primitives: Field, EmptyState, ConfirmButton, Avatar, GeoMap, …
│   │       └── users/       #   feature module — components graduate to folders per CONVENTIONS.md
│   │           ├── index.jsx     # barrel: UserList (main) + re-exports provider/modal/drawer
│   │           ├── utils.js      # shared formatters (cityState, tzChip/tzFull, localTime)
│   │           ├── constants.js  # ZIP_FORMAT (shared by modal + drawer)
│   │           ├── ListEmpty.jsx # empty / no-results states
│   │           ├── context/      # index.jsx (provider + hook) · types.js · utils.js (filterUsers)
│   │           ├── modals/       # AddUserModal.jsx (create dialog)
│   │           ├── UserDrawer/   # index.jsx (UserDrawer) · DataRow.jsx
│   │           ├── UsersHeader/  # index.jsx · constants.js (LAYOUT_OPTIONS)
│   │           ├── UserTable/    # index.jsx · constants.js (HEAD)
│   │           └── UserCards/    # index.jsx (grid) · UserCard/ (index.jsx · Stat.jsx)
│   ├── jsconfig.json        # Path aliases for the editor (mirrors vite resolve.alias)
│   ├── CONVENTIONS.md       # Frontend conventions — read before adding files
│   ├── index.html
│   ├── vite.config.js       # port 3000, host, resolve.alias
│   ├── .env.example         # client env template (VITE_API_URL)
│   ├── .nvmrc / .prettierrc  # Node 20, formatting
│   └── package.json
├── .codesandbox/tasks.json  # Defines the server (8080) + client (3000) tasks
└── ARCHITECTURE.md          # this file

# (.nvmrc, .prettierrc, and .env.example live inside server/ and client/ — each
#  package is self-contained.)
```

## Conventions established in Phase 1

- **Package manager: Yarn (classic).** Each project (`server/`, `client/`) is
  installed and run with `yarn` and has its own `yarn.lock`. The CodeSandbox tasks
  use `yarn install` / `yarn start` / `yarn dev`.
- **Server is ESM** (`"type": "module"`). Two run scripts: `yarn dev` (nodemon +
  `--env-file=.env` for local hot reload) and `yarn start` (plain `node`, used by
  CodeSandbox where env vars come from the platform, not a file).
- **Per-project `.env` files.** `server/.env` (loaded via `--env-file=.env`) holds
  the backend secrets; `client/.env` holds only `VITE_API_URL` (Vite reads it by
  default). Each project owns its own env so client and server secrets never share
  a file. Both are gitignored; `.env.example` in each project documents the vars.
- **Chakra UI v3** provider setup: `createSystem(defaultConfig)` passed to
  `<ChakraProvider value={system}>`. Not the v2 `theme={...}` API.
- **Secrets are gitignored; docs are tracked.** `.env` files never enter the
  repo — the API key and Firebase credentials live only in env vars. The
  project docs (`README.md`, `ARCHITECTURE.md`, the planning files) are
  tracked; only the `design/` prototype reference stays out.

## Backend (Phase 2)

The server is a thin Express app. Each request flows through one direction so
responsibilities stay separated:

```
index.js (cors → json → requestLogger → routes → errorHandler)
   └─ routes/users.js      validate input (Zod) → orchestrate → shape response
        ├─ services/geo.js   zip → {latitude, longitude, timezone} (OpenWeather)
        └─ db/users.js       persist / read records (via db.users.*)
```

- **Routes** (`routes/users.js`) are deliberately thin: parse the body with a
  Zod schema, call the geo service and/or the db layer, send the result. No business
  logic, no data access. An `asyncHandler` wrapper forwards rejected promises to
  the error middleware (Express 4 doesn't do this automatically).
- **Rate limiting** (`middleware/rate-limit.js`) caps create and update per IP
  (20/min) — these are the routes that call the paid OpenWeather API, so the
  limit protects the upstream dependency. It's applied as route-level middleware
  (so a throttled request never reaches the geo call) and forwards its `429`
  through the central error handler for a consistent `{ error }` body. The app
  sets `trust proxy: 1` so `req.ip` is the real client behind the CodeSandbox
  proxy. The store is in-memory (one process); a scaled deploy would use Redis.
- **Geo service** (`services/geo.js`) calls the OpenWeather *current-weather*
  endpoint (`/data/2.5/weather?zip={zip},US`) — chosen over the geo/zip lookup
  because it returns `coord` **and** `timezone` in one call. `timezone` is a UTC
  offset in seconds, stored verbatim per the brief. The response is validated
  with Zod before use. A zip OpenWeather can't place (its 404) becomes a `400`.
- **Schemas** (`schemas/`) are the single source of truth for every boundary,
  organised by which boundary they guard: `db/user-schema.js` is the persisted
  record (the field primitives `name`/`zipCode` live here and are reused by
  inputs); `routes/user-schema.js` holds the client create/update inputs and
  `userResponseSchema` (the API output, which the route handlers `.parse()` so the
  response shape is a guaranteed contract, not whatever the store happens to
  return); `geo-schema.js` holds the shared geo shape and the external OpenWeather
  response. The dependency
  direction is `routes → db → geo`, no cycles. Validation failures throw
  `ZodError`, caught centrally.

### Data-layer contract (storage-agnostic)

`db/users.js` exposes an async, storage-agnostic interface, surfaced to callers as
`db.users.*` through the `db/index.js` barrel. Phase 4 swapped the Phase 2 in-memory
`Map` for Firebase RTDB **behind this exact contract** — routes and services didn't
change a line, which was the whole point of the seam.

| Function | Returns | Notes |
|---|---|---|
| `create(fields)` | `User` | Assigns `id` (RTDB push key) + `createdAt`/`updatedAt` (unix ms) |
| `list()` | `User[]` | Sorted by `createdAt` desc |
| `get(id)` | `User \| null` | |
| `update(id, fields)` | `User \| null` | Merges fields, bumps `updatedAt`; `null` if absent |
| `remove(id)` | `boolean` | `true` if a record was deleted |

### Error & validation flow

All errors converge on `middleware/errors.js`:

- **`ZodError`** → `400 { error: "Validation failed", details: [...] }`.
- **`HttpError`** (thrown with an explicit status — e.g. `404 Not found`, a bad
  zip as `400`, an upstream failure as `502`) → that status + `{ error }`.
- **Anything else** → `500 { error: "Internal server error" }`, full stack logged.

Routes never `try/catch` to swallow errors — they throw, and the handler maps
the error to a response. The geo re-derivation rule lives in the PUT handler:
geo fields are re-fetched **only** when the incoming `zipCode` differs from the
stored one; a name-only or same-zip update leaves lat/lon/timezone untouched.

## Persistence (Phase 4 — Firebase RTDB)

`db/users.js` is now backed by Firebase Realtime Database via the Admin SDK.
The full working guide lives in [`DB.md`](./DB.md); the architecture-level points:

- **`firebase.js`** initializes the Admin SDK once and exports `rtdb` (the raw
  Realtime Database handle). The `db/` data layer wraps it, so call sites use
  `db.users.*` and only `db/users.js` ever touches the raw `rtdb`. Credentials
  come from env: `FIREBASE_SERVICE_ACCOUNT_B64` (the service-account JSON,
  base64-encoded) and `FIREBASE_DATABASE_URL`. Base64 because the raw JSON's
  `private_key` newlines get mangled differently by shells, dotenv,
  `node --env-file`, and the CodeSandbox env UI; one opaque token survives them all.
- **Data model:** records live under `/users/{id}`, where `id` is the RTDB push
  key (time-ordered, collision-free). The key is *not* duplicated inside the
  record — it's attached when reading.
- **Timestamps:** `createdAt`/`updatedAt` are written with
  `admin.database.ServerValue.TIMESTAMP` (a sentinel resolved server-side), then
  re-read so the API response carries resolved numbers, not the placeholder.
- **Ordering & indexing:** `list()` uses `orderByChild("createdAt")`, backed by an
  `.indexOn` rule on `users` so the sort is server-side, not a client-side scan.
- **Security posture:** root rules are `.read: false` / `.write: false`. The
  Admin SDK bypasses rules entirely, so the server has full access while *nothing
  else* can touch the DB — the client only ever reaches data through the REST API.

## Frontend (Phase 3)

The client is a thin CRUD UI built on **Chakra UI v3 standard components**. It is
organised by a conventions-driven module structure (see
[`client/CONVENTIONS.md`](./client/CONVENTIONS.md)) rather than a flat
`components/` folder. Code flows in one direction:

```
pages/UsersPage (container) → modules/users (components) → lib/api/queries (useAPI* hooks) → api client (ClientAPI) → axios (createHttp) → server
       ▲ UI state (useState)                                    ▲ server state (TanStack Query cache)
```

- **Layering.** A `pages/` component is the container: it owns UI state, wires
  the mutation hooks, and composes module components. Components never call Axios
  directly; they consume `useAPI*` hooks, which call the **`api` client** —
  exposing one method per endpoint (`api.getUsers()`, `api.createUser(input)`,
  …). Each method wraps `lib/api/routes` (the single source of URL truth) and
  returns the response body, so a hook is just
  `mutationFn: (input) => api.createUser(input)`. `lib/api/types.js` holds the
  `User`/`UserInput` JSDoc typedefs — the API contract the rest of the client
  imports.
- **API client shape (factory + composition).** `api` is built by `ClientAPI()`
  in `lib/api/index.js` — a plain factory (no class, no `this`) that spreads
  per-resource endpoint groups over one HTTP instance:
  `ClientAPI = (http = createHttp()) => ({ ...usersEndpoints(http) })`. Each
  group (`endpoints/users.js`) is a factory `usersEndpoints(http) => ({ … })`
  closing over the injected Axios instance — so adding a resource is a new
  `endpoints/<name>.js` plus one spread line, with no call-site changes, and any
  group can move to its own file freely. `createHttp()` (`client.js`) is kept
  separate from the endpoints so the same methods can bind to a different
  instance (e.g. a mock in a test). This mirrors the reference's
  `requests(client)` / `XEndpoints(client)` split.
- **State split.** *Server state* lives only in the TanStack Query cache — reads
  via `useAPIUsers`, writes via the create/update/delete mutation hooks, which
  invalidate the `['users']` key on success so the list refreshes. *UI state*
  (which user is being edited) is local `useState` in `pages/UsersPage`. Server
  data is never copied into local state.
- **Pages vs modules.** `pages/` holds container components only (one per file).
  `modules/base` is a small reusable primitive set (`Field`, `EmptyState`,
  `ConfirmButton`); `modules/users` is the one feature module. A module exposes
  its public surface through a barrel — `index.jsx` when the barrel *defines* the
  module's main component (here `UserList`), `index.js` for a pure re-export
  barrel (`base`). Outside code imports the barrel, never a file inside. Inside
  `users`, any component that outgrew a flat file is a folder whose `index.jsx`
  *is* that component (`UserDrawer/`, `UserTable/`, `UsersHeader/`, and
  `UserCards/` → nested `UserCard/`), with sibling files for its `constants.js`
  or sub-components; shared `utils.js` (formatters) + `constants.js` (`ZIP_FORMAT`)
  and a `context/` (provider · `types.js` · `utils.js`) sit at the module root.
- **Aliases.** No `./`/`../` under `src/` — imports resolve through root-relative
  aliases (`@/ @theme/ @lib/ @pages/ @base/ @modules/`) declared in
  `jsconfig.json` and mirrored in `vite.config.js`. The two files are edited
  together.
- **Errors.** `createHttp()` (`lib/api/client.js`) installs a response
  interceptor that unwraps the server's `{ error, details }` body into a thrown
  `Error` (with `.details`), so React Query and the form surface a real message,
  not "Request failed with 400". `AddUserModal` (create) and `UserDrawer` (edit)
  also validate `name`/`zipCode` client-side, mirroring the server's Zod rules
  for instant feedback.
- **Theme.** `theme/index.js` layers a small brand config (`theme/tokens.js`) over
  Chakra's `defaultConfig` via `createSystem` — the v3 API, passed to
  `<ChakraProvider value={system}>`.

## Data flow

1. `AddUserModal` submits `{ name, zipCode }` via `useAPICreateUser` → `POST /users`.
2. Server validates (Zod), derives `{ latitude, longitude, timezone }` from
   OpenWeather, and persists the record to Firebase RTDB (`/users/{id}`).
3. Server returns the full `User`; the mutation invalidates the `['users']` query
   and the TanStack Query cache refetches, so `UserList` updates.
4. Edits that change the zip re-derive the geo fields server-side; name-only or
   same-zip edits leave lat/lon/timezone untouched.
