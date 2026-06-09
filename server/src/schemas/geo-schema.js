import { z } from "zod";

/**
 * Geo-related schemas. These belong to neither a single request/response nor the
 * persisted record alone — they're shared building blocks. `geoSchema` is the
 * derived geo shape (composed into the user record and returned by the geo
 * service); `openWeatherResponseSchema` is the slice of the external OpenWeather
 * payload we depend on.
 */

/**
 * The geo fields derived from a zip code. `latitude`/`longitude`/`timezone` come
 * from OpenWeather; `city`/`state` come from the offline zip table.
 */
export const geoSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.number(), // UTC offset in seconds, as OpenWeather returns it
  city: z.string(),
  state: z.string(), // US state abbreviation, or "" when unknown for the zip
});

/**
 * Shape of the OpenWeather current-weather response we depend on. We only pick
 * the fields we use; `.passthrough()` ignores the rest of the (large) payload.
 */
export const openWeatherResponseSchema = z
  .object({
    coord: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    timezone: z.number(),
    name: z.string(), // city name; fallback for `city` when the zip table misses
  })
  .passthrough();

/** @typedef {z.infer<typeof geoSchema>} Geo */
