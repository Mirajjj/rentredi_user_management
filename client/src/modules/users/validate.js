/**
 * Client-side field validation for the user form. Mirrors the server's Zod
 * rules so the user gets instant feedback; the server stays the source of truth.
 * @param {{ name: string, zipCode: string }} values
 * @returns {{ name?: string, zipCode?: string }}
 */
export function validateUser({ name, zipCode }) {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required";
  if (!/^\d{5}$/.test(zipCode.trim()))
    errors.zipCode = "Enter a 5-digit US zip code";
  return errors;
}
