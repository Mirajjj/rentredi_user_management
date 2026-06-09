import { randomUUID } from "node:crypto";

/**
 * In-memory user store (Phase 2). Backed by a `Map`, with an async interface
 * and unix-ms timestamps so that swapping in Firebase RTDB (Phase 4) is a
 * drop-in replacement — routes depend on this contract, not on the Map.
 *
 * Contract:
 *   create(fields) -> User          // assigns id + timestamps
 *   list()         -> User[]        // sorted by createdAt desc
 *   get(id)        -> User | null
 *   update(id, fs) -> User | null   // merges fields, bumps updatedAt
 *   remove(id)     -> boolean       // true if a record was deleted
 */

/** @type {Map<string, import("../schemas/user.js").User>} */
const users = new Map();

/**
 * @param {{ name: string, zipCode: string, latitude: number, longitude: number, timezone: number }} fields
 * @returns {Promise<import("../schemas/user.js").User>}
 */
export async function create(fields) {
  const now = Date.now();
  const user = {
    id: randomUUID(),
    ...fields,
    createdAt: now,
    updatedAt: now,
  };
  users.set(user.id, user);
  return user;
}

/** @returns {Promise<import("../schemas/user.js").User[]>} */
export async function list() {
  return [...users.values()].sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * @param {string} id
 * @returns {Promise<import("../schemas/user.js").User | null>}
 */
export async function get(id) {
  return users.get(id) ?? null;
}

/**
 * @param {string} id
 * @param {Partial<{ name: string, zipCode: string, latitude: number, longitude: number, timezone: number }>} fields
 * @returns {Promise<import("../schemas/user.js").User | null>}
 */
export async function update(id, fields) {
  const existing = users.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...fields, updatedAt: Date.now() };
  users.set(id, updated);
  return updated;
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function remove(id) {
  return users.delete(id);
}
