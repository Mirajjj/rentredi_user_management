# CLAUDE.md

Guidance for working in this repo with Claude Code. Read this first, every session.

## What this repo is

A take-home assessment for the **Agentic AI Native Software Engineer** role at RentRedi. The reviewer's brief (API key redacted) is the source of truth — see [`MASTER_REQUIREMENTS.md`](./MASTER_REQUIREMENTS.md). For the current, living description of how the code is structured (updated each phase), see [`ARCHITECTURE.md`](./ARCHITECTURE.md). Paraphrased:

> Build CRUD endpoints for a User entity. Each user has `id`, `name`, `zipCode`, `latitude`, `longitude`, `timezone`. The client supplies `name` and `zipCode`; the server derives lat/lon/timezone from an external geocoding API. Updates that change the zip must re-derive the geo fields. Wire it up to a React frontend. NoSQL is a bonus. Feel free to add something creative.

The work was originally scaffolded in CodeSandbox; this repo is the git-backed version. Local edits push to CodeSandbox via the `origin` remote, which is where the reviewer will run it.

**The reviewer sees**: the CodeSandbox preview URLs (server on 8080, client on 3000), the README, and the source tree. Code quality, architectural taste, and the README matter as much as functional correctness.

**The end goal is a working project running on [codesandbox.io](https://codesandbox.io)** — both the server and client tasks must boot and the app must function end-to-end in the CodeSandbox preview, because that is where the reviewer verifies it. Code that only runs locally is not done; every change must hold up in CodeSandbox.

**CodeSandbox project**: https://codesandbox.io/p/github/Mirajjj/rentredi_user_management/main (tracks the `main` branch of the GitHub repo).

## Architecture

```
┌──────────────────────────┐         ┌──────────────────────────┐
│  CLIENT (CodeSandbox)    │  HTTPS  │  SERVER (CodeSandbox)    │
│  React + Vite + Chakra   ├────────►│  Node + Express          │
│  Port 3000               │         │  Port 8080               │
└──────────────────────────┘         └────────────┬─────────────┘
                                                  │ Admin SDK
                                                  ▼
                                     ┌──────────────────────────┐
                                     │  Firebase RTDB (real GCP)│
                                     │  Test project on Spark   │
                                     │  Service account auth    │
                                     └──────────────────────────┘
```

- **Server and client both run inside CodeSandbox**, as two separate processes/tasks in the same Devbox.
- **Firebase Realtime Database is real GCP infrastructure**, not a mock or emulator. A free-tier test project. Service account credentials live in CodeSandbox env vars and local `.env`, never in the repo.
- **The client never talks to Firebase directly.** All data access flows through the server's REST API. This means the client doesn't need Firebase config, and credentials stay scoped to the backend.

## Tech stack (pinned — do not substitute)

### Server

- **Node.js 20+** (ESM, `"type": "module"`)
- **Express 4.x** for HTTP routing
- **firebase-admin** (latest 12.x) for RTDB access via service account
- **Zod** for input validation and shared schema definitions
- **node-fetch** (or built-in `fetch` in Node 20+) for the geocoding API call
- **cors** for cross-origin between the two CodeSandbox subdomains
- **nodemon** (devDep) for hot reload

### Client

- **React 18** via **Vite** (not CRA, not Next)
- **JSDoc for type annotations** (not TypeScript — the project is staying JS-only with JSDoc-driven types). Treat JSDoc `@typedef` and `@param` annotations as first-class; the IDE picks them up via `// @ts-check` directives at file top.
- **Chakra UI v3** — note: v3 has a different API from v2 (Provider setup, component prop names, theming). Confirm v3 syntax before generating component code; do not assume v2 patterns.
- **Axios** for the API client (single configured instance with `baseURL` from `VITE_API_URL`).
- **TanStack Query (React Query) v5** for server-state: data fetching, caching, and mutations. Queries for reads, mutations with cache invalidation for writes.

### Infrastructure

- **CodeSandbox Devbox** for running both processes
- **Firebase Realtime Database** (one test project, locked-down rules, Admin SDK only)
- Local dev mirrors this via `.env` file (gitignored)

## Repo layout

```
/
├── server/
│   ├── src/
│   │   ├── index.js              # Express app entry point
│   │   ├── firebase.js           # Admin SDK init, exports rtdb (raw RTDB handle)
│   │   ├── routes/
│   │   │   └── users.js          # CRUD route handlers
│   │   ├── services/
│   │   │   └── geo.js            # Zip → lat/lon/timezone enrichment
│   │   ├── db/                   # Data layer — db.users.create(…) etc.
│   │   │   ├── index.js          # barrel: export const db = { users }
│   │   │   └── users.js          # RTDB data layer (CRUD against /users)
│   │   ├── schemas/              # Zod schemas (*-schema.js), split by boundary:
│   │   │   ├── geo-schema.js     #   shared geo shape + OpenWeather response
│   │   │   ├── db/user-schema.js #   persisted User record (+ field primitives)
│   │   │   └── routes/user-schema.js #  request inputs + userResponseSchema (output)
│   │   └── middleware/
│   │       ├── errors.js         # Centralized error handler
│   │       ├── logging.js        # Structured request logger
│   │       └── rate-limit.js     # Per-IP rate limit on create/update (geo cost)
│   ├── .env.example              # server env template
│   ├── .nvmrc                    # Node 20
│   ├── .prettierrc               # formatting
│   └── package.json
├── client/                      # structure follows client/CONVENTIONS.md
│   ├── src/
│   │   ├── main.jsx              # Mount: ChakraProvider(system) + QueryClientProvider
│   │   ├── App.jsx               # Page shell → <UsersPage/>
│   │   ├── theme/                # Chakra v3 system (tokens.js + index.js/createSystem)
│   │   ├── lib/api/             # index.js (ClientAPI() + api), client.js (createHttp), routes.js, endpoints/, types.js
│   │   │   └── queries/          #   keys.js + use-api-{users,create,update,delete}-user.js
│   │   ├── pages/                # page (container) components — UsersPage.jsx
│   │   └── modules/
│   │       ├── base/             # reusable primitives: Field, EmptyState, ConfirmButton
│   │       └── users/            # feature module — components graduate to folders per CONVENTIONS.md
│   │           ├── index.jsx     # barrel: UserList (main) + re-exports provider/modal/drawer
│   │           ├── utils.js      # shared formatters (cityState, tzChip/tzFull, localTime)
│   │           ├── constants.js  # ZIP_FORMAT (shared by modal + drawer)
│   │           ├── ListEmpty.jsx # empty / no-results states
│   │           ├── context/      # index.jsx (provider + hook) · types.js · utils.js (filterUsers)
│   │           ├── modals/       # AddUserModal.jsx
│   │           ├── UserDrawer/   # index.jsx + DataRow.jsx
│   │           ├── UsersHeader/  # index.jsx + constants.js (LAYOUT_OPTIONS)
│   │           ├── UserTable/    # index.jsx + constants.js (HEAD)
│   │           └── UserCards/    # index.jsx + UserCard/ (index.jsx + Stat.jsx)
│   ├── jsconfig.json             # path aliases (mirrored in vite.config.js)
│   ├── CONVENTIONS.md            # frontend conventions — read before adding files
│   ├── index.html
│   ├── vite.config.js            # port 3000, host, resolve.alias
│   ├── .env.example              # client env template
│   ├── .nvmrc                    # Node 20
│   ├── .prettierrc               # formatting
│   └── package.json
├── .codesandbox/
│   └── tasks.json                # Defines server + client tasks for CodeSandbox
├── .vscode/
│   └── settings.json
├── .gitignore
├── server/.env                   # GITIGNORED — server secrets (template: server/.env.example)
├── client/.env                   # GITIGNORED — client config (template: client/.env.example)
├── CLAUDE.md                     # this file
└── README.md                     # the deliverable doc — the reviewer reads this
```

## Environment variables

Never commit secrets. Env vars are **split per project** — server vars live in
`server/.env`, the client var in `client/.env`. Locally these are real files
(gitignored; each project has a tracked `.env.example` template); in CodeSandbox
they're set as platform env vars. The server loads its file via `--env-file=.env`;
Vite reads `client/.env` by default.

| Var                        | Project / file | Purpose                                                 | Notes                                                             |
| -------------------------- | -------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT` | `server/.env`  | JSON string of the service account credentials          | Single line, escape as needed                                     |
| `FIREBASE_DATABASE_URL`    | `server/.env`  | RTDB URL like `https://xxx-default-rtdb.firebaseio.com` | From Firebase Console                                             |
| `ZIP_API_KEY`              | `server/.env`  | The geocoding API key from the assignment               | Provided with the brief; lives only in env vars                   |
| `PORT`                     | `server/.env`  | Server port                                             | Defaults to 8080                                                  |
| `VITE_API_URL`             | `client/.env`  | Server URL the client hits                              | Local: `http://localhost:8080`. CodeSandbox: the 8080 preview URL |

## API surface

Endpoints under `/users`:

| Method | Path         | Body                  | Response          | Notes                          |
| ------ | ------------ | --------------------- | ----------------- | ------------------------------ |
| POST   | `/users`     | `{ name, zipCode }`   | `201 User`        | Derives geo via `services/geo` |
| GET    | `/users`     | —                     | `200 User[]`      | Sorted by `createdAt` desc     |
| GET    | `/users/:id` | —                     | `200 User \| 404` |                                |
| PUT    | `/users/:id` | `{ name?, zipCode? }` | `200 User \| 404` | Re-derives geo if zip changed  |
| DELETE | `/users/:id` | —                     | `204 \| 404`      |                                |

`User` shape:

```ts
{
  id: string;
  name: string;
  zipCode: string; // 5 digits, US
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in seconds, as returned by OpenWeather
  createdAt: number; // unix ms
  updatedAt: number; // unix ms
}
```

Validation errors return `400` with `{ error: "Validation failed", details: [...] }`.
Not-found returns `404` with `{ error: "Not found" }`.
Server errors return `500` with `{ error: <message> }` and log the full stack.

## Firebase data model

> **Working guide:** see [`DB.md`](./DB.md) for the full database reference —
> data model, rules, indexing, credential flow (base64 service account), how to
> read/write via the Admin SDK, how to inspect data, and common pitfalls. Read it
> before touching anything Firebase-related.

One path in RTDB:

- `/users/{id}` — canonical user record (`id` is the RTDB push key; the only path needed for this assignment)

`.indexOn` rule on `createdAt` to support `orderByChild('createdAt')` queries efficiently. Security rules: `.read: false`, `.write: false` at the root. Admin SDK bypasses rules; nothing else can touch the DB. This is the intentional posture — document it in the README. Credentials are injected as env vars (`FIREBASE_SERVICE_ACCOUNT_B64`, `FIREBASE_DATABASE_URL`); the service account is base64-encoded so its `private_key` newlines survive every env transport.

## Guidelines for Claude when working in this repo

### Scope discipline

This is a take-home, not a production system. Prefer **clean and complete over impressive and sprawling**. A working app with strong fundamentals beats a half-finished app with fancy features. If a feature would push completion beyond the working baseline, leave it for the "creative touch" lane and document the choice in the README.

### What "good" looks like for the reviewer

The first reviewer will look for:

- **Code clarity over cleverness.** Readable, well-named, idiomatic Node and React.
- **Real engineering hygiene.** Input validation, error handling, separation of concerns, no commented-out code, no dead branches.
- **Stack alignment.** Real Firebase RTDB integration with Admin SDK and proper rules. The bonus matters because it shows RentRedi-stack fluency.
- **A README that explains decisions.** Why this structure, why these libraries, what would be different at production scale.
- **One thoughtful creative touch**, not five half-baked ones.

### What to avoid

- Over-engineering: no Redux, no monorepo tooling, no Docker, no CI config.
- Generated boilerplate that doesn't earn its place. Every file should be intentional.
- AI buzzwords or marketing language anywhere in the code or README.
- Premature abstraction: factory patterns, base classes, dependency injection containers. Just functions and modules.
- Commented-out code, TODOs, console.logs left in committed code.

### Default to these patterns

- **Server**: thin route handlers, business logic in `services/` or `db/`. No business logic in `routes/`.
- **Client**: components are dumb where possible; data fetching lives in TanStack Query hooks (e.g. `useUsers`, `useCreateUser`) that wrap the Axios client, not in components.
- **Validation**: Zod at every input boundary (server endpoint inputs, geo API response shape). Catch and re-throw as `400` for client errors.
- **Errors**: throw with meaningful messages, catch at the middleware layer, never `try/catch` and silently continue.
- **Async**: `async/await` only, no `.then` chains. `Promise.all` for parallel work where applicable.
- **JSDoc on the client**: every exported function and component gets a JSDoc block with `@param` and `@returns`. Use `@typedef` in `types.js` for shared shapes.

### Specific things to handle carefully

- **Chakra UI v3 syntax.** It's not v2. The `Provider` setup uses `ChakraProvider value={system}` with a `createSystem` call. `Box`, `Flex`, `Stack`, `Button` exist but some props (e.g., color tokens) work differently. Check the v3 docs at `https://www.chakra-ui.com/` before writing component code. If unsure of a v3 API, ask before generating.
- **Firebase server timestamps.** Use `admin.database.ServerValue.TIMESTAMP` for `createdAt` / `updatedAt`. Re-read after write to resolve the sentinel into a real number for the response.
- **Multi-path updates**: not strictly needed in this assignment since there's only one path (`/users/{id}`), but if any denormalized index gets added, use `db.ref().update({ path1: x, path2: y })` for atomicity.
- **CORS**: enable on the server. Production-ready would lock down origins; for the assignment, document this in the README and use `cors()` with defaults.
- **The geocoding API**: resolved — it's **OpenWeather** (docs: https://openweathermap.org/current), with the API key provided alongside the assignment (stored as `ZIP_API_KEY`, never committed). To turn a zip into geo, use the zip-based lookup (e.g. `api.openweathermap.org/geo/1.0/zip?zip={zip},US&appid={key}` for lat/lon, or the current-weather-by-zip endpoint which also returns coordinates). Note: OpenWeather returns `timezone` as a **UTC offset in seconds** (a number), not an IANA string. Per `MASTER_REQUIREMENTS.md` we store exactly what the API returns, so `User.timezone` is a `number` (seconds offset) — no IANA mapping.
- **Rate limiting**: not strictly required, but documenting it in the README ("In production I'd add Redis-backed sliding window on the create endpoint because the geocoding API costs money per call") is a senior signal.

### Testing

Light testing is fine for a take-home. If time permits:

- One or two **unit tests** on `services/geo.js` (mock the fetch) and on the Zod schemas (valid/invalid inputs)
- A **smoke test** on the route handlers using `supertest` if it doesn't blow the time budget

Skip integration tests against real Firebase — too much setup for the value. Mention in the README that they'd live behind the Firebase emulator suite.

### The creative touch

One on-brand stretch goal. The strongest options given the role:

1. **AI-generated welcome message** — when a user is created, call Anthropic or OpenAI to generate a short personalized tip based on their timezone ("It's nearly midnight where you are — want notifications quieted by default?"). On-brand for "Agentic AI Native." 20-30 min if scoped tight.
2. **Optimistic UI** with proper rollback on failure — small but tasteful UX signal.
3. **Per-user activity log** in a denormalized subpath — shows Firebase modeling fluency (multi-path writes, denormalization).
4. **Server-Sent Events** for live updates — if user A creates a user, user B's list updates in real time. Shows real-time fluency, which is the whole point of RTDB.

**Pick exactly one.** Document the choice and trade-off in the README.

### README structure

The README is the most-read artifact. Aim for this structure:

```
# RentRedi Take-Home

## What this is
1-2 sentences

## Architecture
The diagram from this CLAUDE.md, simplified

## Tech choices and why
Why Firebase RTDB, why JSDoc instead of TS, why Chakra v3, why no Redux

## How to run
Local + CodeSandbox instructions

## API
The endpoint table

## What I'd do at production scale
The 4-5 bullet list of things skipped: rate limiting, auth, observability,
proper CORS allowlist, integration tests against the Firebase emulator

## The creative touch
What it is and why I picked it

## What I'd ask the team before scaling further
2-3 thoughtful questions that show you're thinking ahead
```

### Working session etiquette

- Before generating large code, sketch the plan in chat. Confirm approach before coding.
- After each meaningful change, run the relevant server/client locally and confirm it works. Don't pile up untested changes.
- **Git: never touch branches or remotes on your own.** Always work in the
  **current branch** — do not create, switch, merge, or rename branches, and do
  **not push** (no `git push`, ever). Branching, merging, and pushing are the
  user's actions; the user decides when work is promoted to the branch CodeSandbox
  tracks. You may stage and commit _in the current branch_ when asked, but pushing
  and branch management are off-limits unless the user explicitly does them.
- Keep commits small and conventionally-named: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, `refactor: ...`.
- When stuck on Firebase or Chakra v3 specifics, prefer reading the official docs over guessing.

## Quick command reference

```bash
# Both projects use Yarn (classic). Install with `yarn install` in each.

# Server
cd server && yarn dev             # nodemon with --env-file=.env (reads server/.env)

# Client
cd client && yarn dev --host

# Branching, merging, and pushing are done by the user — Claude works in the
# current branch only and never runs `git push`, `git checkout -b`, or `git merge`.
```

## Out of scope (do not do)

- Authentication (no Firebase Auth, no JWT, no sessions). The reviewer wouldn't expect it for a CRUD take-home.
- Pagination on the user list (assignment doesn't require it; mention as future work).
- TypeScript migration (sticking with JS + JSDoc).
- Docker, Kubernetes, CI/CD pipelines.
- Production observability (logs, metrics, traces) beyond `console.log` — mention in README.
- Migrating to Firestore.
