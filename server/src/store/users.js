import { db, admin } from "../firebase.js";

/**
 * User data layer backed by Firebase Realtime Database (`/users/{id}`).
 *
 * Same async contract as the original Phase 2 store, so routes/services are
 * unchanged:
 *   create(fields) -> User          // assigns id + timestamps
 *   list()         -> User[]        // sorted by createdAt desc
 *   get(id)        -> User | null
 *   update(id, fs) -> User | null   // merges fields, bumps updatedAt
 *   remove(id)     -> boolean       // true if a record was deleted
 *
 * The RTDB push key is the user `id`; it is not duplicated inside the record but
 * attached when reading. `createdAt`/`updatedAt` are written with the server
 * timestamp sentinel and re-read so the response carries resolved numbers, not
 * the unresolved `{".sv":"timestamp"}` placeholder.
 */

const usersRef = db.ref("users");
const TIMESTAMP = admin.database.ServerValue.TIMESTAMP;

/**
 * @param {string} id
 * @param {Record<string, unknown>} value
 * @returns {import("../schemas/user.js").User}
 */
const toUser = (id, value) => ({ id, ...value });

/**
 * @param {{ name: string, zipCode: string, latitude: number, longitude: number, timezone: number }} fields
 * @returns {Promise<import("../schemas/user.js").User>}
 */
export async function create(fields) {
  const ref = usersRef.push();
  await ref.set({ ...fields, createdAt: TIMESTAMP, updatedAt: TIMESTAMP });
  const snap = await ref.get();
  return toUser(ref.key, snap.val());
}

/** @returns {Promise<import("../schemas/user.js").User[]>} */
export async function list() {
  const snap = await usersRef.orderByChild("createdAt").get();
  /** @type {import("../schemas/user.js").User[]} */
  const users = [];
  snap.forEach((child) => {
    users.push(toUser(child.key, child.val()));
  });
  // orderByChild returns ascending; the API contract is newest first.
  return users.reverse();
}

/**
 * @param {string} id
 * @returns {Promise<import("../schemas/user.js").User | null>}
 */
export async function get(id) {
  const snap = await usersRef.child(id).get();
  return snap.exists() ? toUser(id, snap.val()) : null;
}

/**
 * @param {string} id
 * @param {Partial<{ name: string, zipCode: string, latitude: number, longitude: number, timezone: number }>} fields
 * @returns {Promise<import("../schemas/user.js").User | null>}
 */
export async function update(id, fields) {
  const ref = usersRef.child(id);
  if (!(await ref.get()).exists()) return null;

  await ref.update({ ...fields, updatedAt: TIMESTAMP });
  const snap = await ref.get();
  return toUser(id, snap.val());
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function remove(id) {
  const ref = usersRef.child(id);
  if (!(await ref.get()).exists()) return false;

  await ref.remove();
  return true;
}
