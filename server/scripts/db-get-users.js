/**
 * Diagnostic script: print the latest users from Firebase RTDB.
 *
 * Usage (from server/, with .env loaded):
 *   node --env-file=.env scripts/db-get-users.js [limit]
 *
 * Or via the server/ Makefile:
 *   make db-get-users            # newest 10
 *   make db-get-users LIMIT=5    # newest 5
 *
 * The limit is applied at the query (`limitToLast`), not after fetching, so it
 * only pulls the rows it needs. Defaults to 10.
 */

import { db } from "../src/firebase.js";

const DEFAULT_LIMIT = 10;

const raw = process.argv[2] ?? process.env.LIMIT;
const limit = raw === undefined || raw === "" ? DEFAULT_LIMIT : Number(raw);

if (!Number.isInteger(limit) || limit <= 0) {
  console.error(`Invalid limit: "${raw}". Provide a positive integer.`);
  process.exit(1);
}

try {
  const snap = await db
    .ref("users")
    .orderByChild("createdAt")
    .limitToLast(limit)
    .get();

  /** @type {import("../src/schemas/user.js").User[]} */
  const users = [];
  snap.forEach((child) => {
    users.push({ id: child.key, ...child.val() });
  });
  users.reverse(); // newest first

  if (users.length === 0) {
    console.log("No users found.");
    process.exit(0);
  }

  console.log(`Latest ${users.length} user(s) (limit ${limit}, newest first):\n`);
  for (const u of users) {
    console.log(
      `• ${u.name} — zip ${u.zipCode} | lat ${u.latitude}, lon ${u.longitude}, tz ${u.timezone}s`,
    );
    console.log(`  id=${u.id}  created=${new Date(u.createdAt).toISOString()}`);
  }
  process.exit(0);
} catch (err) {
  console.error("Failed to read users:", err.message);
  process.exit(1);
}
