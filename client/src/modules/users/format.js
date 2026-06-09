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
