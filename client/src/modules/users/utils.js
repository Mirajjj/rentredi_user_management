/**
 * @typedef {import('@lib/api/types').User} User
 * @typedef {Pick<User, 'longitude' | 'state' | 'timezone'>} TzUser
 */

// Western boundary longitude per US zone, easternmost first. Real zone lines
// zigzag by county; these meridians are close enough for a display label, and
// anything outside the range falls back to a raw UTC offset.
const US_ZONE_BANDS = [
  { minLon: -82.5, zone: "America/New_York" }, // Eastern
  { minLon: -97, zone: "America/Chicago" }, // Central
  { minLon: -114, zone: "America/Denver" }, // Mountain
  { minLon: -127, zone: "America/Los_Angeles" }, // Pacific
  { minLon: -150, zone: "America/Anchorage" }, // Alaska
  { minLon: -180, zone: "Pacific/Honolulu" }, // Hawaii
];

// States whose IANA zone longitude alone can't pin: Arizona sits in the
// Mountain band but doesn't observe DST (always MST), so resolve it by state.
const STATE_ZONE = { AZ: "America/Phoenix" };

/**
 * Resolve a user to a canonical US IANA zone from longitude (with a state
 * override for the no-DST exception), or `null` when it's outside the US.
 * @param {TzUser} user
 * @returns {string | null}
 */
function usZone({ longitude, state }) {
  if (state && STATE_ZONE[state]) return STATE_ZONE[state];
  if (longitude > -66 || longitude < -180) return null;
  const band = US_ZONE_BANDS.find((b) => longitude >= b.minLon);
  return band ? band.zone : null;
}

/**
 * Compact UTC-offset label, e.g. `UTC−7` (dropping `:00` minutes). The fallback
 * for users we can't map to a US zone. Uses a true minus sign.
 * @param {number} offsetSeconds
 * @returns {string}
 */
function offsetShort(offsetSeconds) {
  const sign = offsetSeconds < 0 ? "−" : "+";
  const total = Math.abs(offsetSeconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const suffix = minutes ? `:${String(minutes).padStart(2, "0")}` : "";
  return `UTC${sign}${hours}${suffix}`;
}

/**
 * Full UTC-offset label, e.g. `UTC−07:00`. Uses a true minus sign.
 * @param {number} offsetSeconds
 * @returns {string}
 */
function offsetFull(offsetSeconds) {
  const sign = offsetSeconds < 0 ? "−" : "+";
  const total = Math.abs(offsetSeconds);
  const hours = String(Math.floor(total / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

/**
 * US timezone abbreviation for the current date, e.g. `PDT` / `EST`. Derived
 * from the IANA zone so DST (PST↔PDT) is correct without manual date math.
 * Falls back to the raw UTC offset for non-US users.
 * @param {TzUser} user
 * @returns {string}
 */
function tzAbbr(user) {
  const zone = usZone(user);
  if (!zone) return offsetShort(user.timezone);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "short",
  }).formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value || offsetShort(user.timezone);
}

/**
 * Compact timezone chip label — the US abbreviation (`PDT`), or `UTC−7` when
 * the user can't be mapped to a US zone.
 * @param {TzUser} user
 * @returns {string}
 */
export function tzChip(user) {
  return tzAbbr(user);
}

/**
 * Full timezone label for detail rows: abbreviation plus the raw offset,
 * e.g. `PDT · UTC−07:00`. Just the offset (`UTC−07:00`) for non-US users.
 * @param {TzUser} user
 * @returns {string}
 */
export function tzFull(user) {
  const full = offsetFull(user.timezone);
  return usZone(user) ? `${tzAbbr(user)} · ${full}` : full;
}

/**
 * Wall-clock time where the user is, e.g. `8:39 PM`. Formats against the IANA
 * zone when known; otherwise shifts "now" by the raw offset and prints as UTC.
 * @param {TzUser} user
 * @returns {string}
 */
export function localTime(user) {
  const zone = usZone(user);
  if (zone) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: zone,
    }).format(new Date());
  }
  const shifted = new Date(Date.now() + user.timezone * 1000);
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
