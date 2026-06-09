/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * Render an OpenWeather timezone (UTC offset in seconds) as `UTC±HH:MM`.
 * @param {number} offsetSeconds
 * @returns {string}
 */
export function formatTimezone(offsetSeconds) {
  const sign = offsetSeconds < 0 ? "-" : "+";
  const total = Math.abs(offsetSeconds);
  const hours = String(Math.floor(total / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

/**
 * Compact timezone chip label, e.g. `UTC−7` (dropping `:00` minutes).
 * Uses a true minus sign for typographic parity with the design.
 * @param {number} offsetSeconds
 * @returns {string}
 */
export function tzChip(offsetSeconds) {
  const sign = offsetSeconds < 0 ? "−" : "+";
  const total = Math.abs(offsetSeconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const suffix = minutes ? `:${String(minutes).padStart(2, "0")}` : "";
  return `UTC${sign}${hours}${suffix}`;
}

/**
 * Full timezone label for the detail row, e.g. `UTC−07:00`.
 * @param {number} offsetSeconds
 * @returns {string}
 */
export function tzFull(offsetSeconds) {
  return formatTimezone(offsetSeconds).replace("-", "−");
}

/**
 * Wall-clock time at a UTC offset, e.g. `8:39 PM`. We only have the offset
 * (not an IANA zone), so we shift "now" by it and format as UTC.
 * @param {number} offsetSeconds
 * @returns {string}
 */
export function localTime(offsetSeconds) {
  const shifted = new Date(Date.now() + offsetSeconds * 1000);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(shifted);
}

/**
 * `"Denver, CO"`, or just `"Denver"` when the state is empty.
 * @param {Pick<User, 'city' | 'state'>} user
 * @returns {string}
 */
export function cityState({ city, state }) {
  return state ? `${city}, ${state}` : city;
}
