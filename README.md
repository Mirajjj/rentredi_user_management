# RentRedi User Management

CRUD app for users. You give a name and a US zip; the server fills in latitude,
longitude, and timezone from the zip and stores the record. React frontend,
Express API, Firebase Realtime Database.

```
React + Vite (3000)  →  Express API (8080)  →  Firebase RTDB
```

## What's in it

- **Server** — Express (Node 20). Five REST endpoints for users (create, list,
  get, update, delete). Input is validated with Zod. Creating a user looks up the
  zip on OpenWeather to get lat/lon/timezone; updating re-looks-up only when the
  zip actually changes. The two geo-deriving routes (create, update) are
  rate-limited per IP, since each lookup costs an upstream API call. One central
  error handler turns everything into clean JSON responses.
- **Client** — React + Chakra UI. List of users as a table or cards, an add
  dialog, and a detail drawer. Data fetching/caching is TanStack Query. As a
  creative touch each user is plotted on a US map and the drawer shows their
  current local time.
- **Database** — Firebase Realtime Database (a real free-tier project). Only the
  server touches it, through the Admin SDK with a service account. DB rules are
  locked down, so nothing reaches the data except the API.

## Endpoints

| Method | Path | Body |
|---|---|---|
| POST | `/users` | `{ name, zipCode }` |
| GET | `/users` | — |
| GET | `/users/:id` | — |
| PUT | `/users/:id` | `{ name?, zipCode? }` |
| DELETE | `/users/:id` | — |

## Env vars

Server only (`server/.env`, gitignored — template in `server/.env.example`). The
client needs none locally; it calls `/api`, which Vite proxies to the server.

| Var | What it's for |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_B64` | Service-account JSON, base64-encoded |
| `FIREBASE_DATABASE_URL` | The Realtime Database URL |
| `ZIP_API_KEY` | OpenWeather API key (zip → geo) |
| `PORT` | Server port (defaults to 8080) |

## Running it

```bash
cd server && yarn install && yarn dev      # API on :8080
cd client && yarn install && yarn dev      # client on :3000
```

On CodeSandbox both start automatically and the env vars are set in the platform
instead of a file.

