import { cityState, tzChip } from "@/modules/users/utils";

/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * Case-insensitive substring filter over the fields a user would search by.
 * @param {User[]} users
 * @param {string} query
 * @returns {User[]}
 */
export function filterUsers(users, query) {
  const q = query.trim().toLowerCase();
  if (!q) return users;
  return users.filter((u) =>
    [u.name, u.city, u.state, u.zipCode, cityState(u), tzChip(u)]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q))
  );
}
