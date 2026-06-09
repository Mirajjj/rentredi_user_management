import zipcodes from "zipcodes";
import { openWeatherResponseSchema } from "../schemas/geo-schema.js";
import { HttpError } from "../middleware/errors.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Derive geo fields from a US zip code. `latitude`/`longitude`/`timezone` come
 * from the OpenWeather current-weather endpoint (used rather than the geo/zip
 * lookup because it returns `coord` *and* `timezone` in a single call;
 * `timezone` is a UTC offset in seconds, stored verbatim as returned).
 * `city`/`state` come from the offline `zipcodes` table — no extra network call
 * and canonical for the zip — with OpenWeather's `name` as a fallback city.
 *
 * @param {string} zipCode - 5-digit US zip (already validated upstream).
 * @returns {Promise<import("../schemas/geo-schema.js").Geo>} `{ latitude, longitude, timezone, city, state }`
 */
export async function geocodeZip(zipCode) {
  const apiKey = process.env.ZIP_API_KEY;
  if (!apiKey) {
    throw new HttpError(500, "Geocoding API key is not configured");
  }

  const url = `${BASE_URL}?zip=${encodeURIComponent(zipCode)},US&appid=${apiKey}`;

  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new HttpError(502, "Geocoding service is unreachable");
  }

  // OpenWeather returns 404 for a zip it can't place — that's a bad input from
  // the client's perspective, so surface it as a 400.
  if (res.status === 404) {
    throw new HttpError(400, `No location found for zip code ${zipCode}`);
  }
  if (!res.ok) {
    throw new HttpError(502, "Geocoding service returned an error");
  }

  const data = await res.json();
  const { coord, timezone, name } = openWeatherResponseSchema.parse(data);

  const table = zipcodes.lookup(zipCode);

  return {
    latitude: coord.lat,
    longitude: coord.lon,
    timezone,
    city: table?.city ?? name,
    state: table?.state ?? "",
  };
}
