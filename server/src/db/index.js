import * as users from "./users.js";

/**
 * Data access layer, grouped by resource. Each resource module exposes the
 * storage-agnostic CRUD contract (create/list/get/update/remove) over Firebase
 * RTDB, so routes/services depend on this seam rather than the backing store.
 *
 * Usage: `db.users.create(fields)`, `db.users.list()`, …
 */
export const db = { users };
