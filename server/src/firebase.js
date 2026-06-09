import admin from "firebase-admin";

/**
 * Firebase Admin SDK initialization.
 *
 * Credentials come from two env vars (see `server/.env.example`):
 *   - FIREBASE_SERVICE_ACCOUNT_B64 — the service-account JSON, base64-encoded
 *   - FIREBASE_DATABASE_URL        — the RTDB instance URL
 *
 * Why base64 rather than the raw JSON string: the service-account JSON contains
 * a `private_key` with embedded newlines and quotes. Passing that as a raw env
 * var is fragile — shells, dotenv parsers, `node --env-file`, and the CodeSandbox
 * env-var UI each handle newline/quote escaping differently, so the key often
 * arrives mangled and `cert()` fails. Base64 collapses the whole blob into one
 * opaque, newline-free token that survives any of those transports intact; we
 * decode it back to JSON here.
 *
 * The Admin SDK runs with full privileges and bypasses the database security
 * rules, which is why the rules can stay locked (`.read`/`.write` = false):
 * nothing but this server can touch the data.
 */

const { FIREBASE_SERVICE_ACCOUNT_B64, FIREBASE_DATABASE_URL } = process.env;

if (!FIREBASE_SERVICE_ACCOUNT_B64) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is not set");
}
if (!FIREBASE_DATABASE_URL) {
  throw new Error("FIREBASE_DATABASE_URL is not set");
}

/** @type {admin.ServiceAccount} */
let serviceAccount;
try {
  const json = Buffer.from(FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8");
  serviceAccount = JSON.parse(json);
} catch {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is not valid base64-encoded JSON");
}

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIREBASE_DATABASE_URL,
});

export const rtdb = app.database();
export { admin };
