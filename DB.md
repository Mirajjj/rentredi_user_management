# DB.md — working with the Firebase Realtime Database

An internal working guide (for future sessions) to the database behind this
project. For the higher-level picture see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## What it is

- **Firebase Realtime Database** on a real GCP project — Spark (free) tier, not
  an emulator or mock.
- Project: `rentredi-usermgmt`. DB URL:
  `https://rentredi-usermgmt-default-rtdb.firebaseio.com`.
- Accessed **only** by the server, via the **firebase-admin** SDK with a service
  account. The client never touches Firebase directly — it goes through the REST
  API, so credentials stay scoped to the backend.

## Data model

One path is all this assignment needs:

```
/users
  /{id}                     # id = RTDB push key (time-ordered, collision-free)
    name:      string
    zipCode:   string       # 5-digit US zip
    latitude:  number
    longitude: number
    timezone:  number       # UTC offset in seconds (as OpenWeather returns it)
    createdAt: number       # unix ms (resolved from a server sentinel)
    updatedAt: number       # unix ms
```

- The push key **is** the `id`. It is *not* stored inside the record — the data
  layer attaches it on read (`toUser(child.key, child.val())`). This avoids
  keeping a duplicate id field in sync.
- Records are read newest-first via `orderByChild("createdAt")` then reversed
  (RTDB returns ascending).

## Security rules

Published rules (Realtime Database → Rules tab):

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "users": {
      ".indexOn": ["createdAt"]
    }
  }
}
```

- **`.read: false` / `.write: false`** at the root: no client, authenticated or
  not, can touch the DB. The **Admin SDK bypasses rules entirely**, so the server
  has full access while everything else is locked out. This is the intentional
  posture — the client reaching data only through the REST API is what makes it safe.
- **`.indexOn: ["createdAt"]`** lets `orderByChild("createdAt")` sort server-side.
  Without it, RTDB still returns results but logs a performance warning and sorts
  client-side (fine for a take-home, slow at scale).

## Credentials / env setup

Two env vars, in `server/.env` locally (gitignored) and as platform env vars in
CodeSandbox. Template + rationale live in `server/.env.example`.

| Var | What |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_B64` | The service-account JSON, **base64-encoded** |
| `FIREBASE_DATABASE_URL` | `https://rentredi-usermgmt-default-rtdb.firebaseio.com` |

**Why base64:** the service-account JSON's `private_key` contains embedded
newlines and quotes. Passed as raw JSON, those get mangled differently by shells,
dotenv parsers, `node --env-file`, and the CodeSandbox env-var UI, and `cert()`
then fails. Base64 collapses the blob into one opaque, newline-free token that
survives any of those transports; `firebase.js` decodes it back to JSON.

Generate the value from a freshly downloaded service-account key:

```bash
cat service-account.json | base64 | tr -d '\n'
```

(Get a key from: Firebase Console → ⚙ Project settings → Service accounts →
Generate new private key. Treat it like a password; never commit it.)

## How to read/write via the Admin SDK

`server/src/firebase.js` initializes the SDK once and exports `rtdb` (the raw
Realtime Database handle). The data layer (`server/src/db/users.js`, surfaced to
callers as `db.users.*` via `db/index.js`) is the only place that touches RTDB.
Patterns used:

```js
import { rtdb, admin } from "../firebase.js";
const usersRef = rtdb.ref("users");
const TIMESTAMP = admin.database.ServerValue.TIMESTAMP;

// create: push() mints the id; write sentinel timestamps, then re-read.
const ref = usersRef.push();
await ref.set({ ...fields, createdAt: TIMESTAMP, updatedAt: TIMESTAMP });
const snap = await ref.get();           // resolves the sentinel to a number

// read one
const snap = await usersRef.child(id).get();
snap.exists() ? { id, ...snap.val() } : null;

// list newest-first
const snap = await usersRef.orderByChild("createdAt").get();
const out = []; snap.forEach((c) => out.push({ id: c.key, ...c.val() }));
out.reverse();

// update (merge) / delete
await usersRef.child(id).update({ ...fields, updatedAt: TIMESTAMP });
await usersRef.child(id).remove();
```

## Inspecting data in the console

Firebase Console → **Build → Realtime Database → Data** tab shows the live JSON
tree at `/users`. You can expand records, edit, or delete by hand here.

To read the live data or rules from the CLI with the service account (handy for a
quick state check), mint an access token and hit the REST API:

```bash
# in server/, with .env loaded
node --env-file=.env -e '
  import("./src/firebase.js").then(async ({ admin }) => {
    const t = (await admin.app().options.credential.getAccessToken()).access_token;
    const base = process.env.FIREBASE_DATABASE_URL;
    console.log(await (await fetch(`${base}/users.json?access_token=${t}`)).text());
    console.log(await (await fetch(`${base}/.settings/rules.json?access_token=${t}`)).text());
  });
'
```

## Common pitfalls

- **Timestamp sentinels.** `ServerValue.TIMESTAMP` is a placeholder
  (`{".sv":"timestamp"}`) until the server resolves it. Always **re-read after
  write** so the API returns a real number, not the sentinel.
- **Rules block non-admin access.** A direct REST read without the admin token
  returns `401 Permission denied` — that's the locked rules working as intended,
  not a bug. Only the Admin SDK (or a token minted from the service account) gets
  through.
- **Missing index = silent warning, not error.** Drop the `.indexOn` and
  `orderByChild` still works but logs "Consider adding .indexOn". If you see that
  warning, the rule didn't publish.
- **Mangled `private_key`.** If `cert()` throws about an invalid PEM/key, the
  base64 was truncated or re-encoded with line wraps. Regenerate with
  `base64 | tr -d '\n'` and confirm it round-trips: `... | base64 -d | jq .`.
- **Spark tier limits.** No daily cron-style backups and capped concurrent
  connections — irrelevant for the assignment, worth noting before production use.
