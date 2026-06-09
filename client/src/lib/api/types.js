// The API contract — mirrors the server's persisted `User` shape. These typedefs
// are imported across the client via `@lib/api/types`.

/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} name
 * @property {string} zipCode      5-digit US zip
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} timezone     UTC offset in seconds (as OpenWeather returns)
 * @property {number} createdAt    unix ms
 * @property {number} updatedAt    unix ms
 */

/**
 * Client-supplied fields. Create requires both; update accepts a partial.
 * @typedef {object} UserInput
 * @property {string} name
 * @property {string} zipCode
 */

export {};
