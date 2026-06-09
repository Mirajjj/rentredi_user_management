import { z } from "zod";

/**
 * Zod schemas for the User entity. These define every input/output boundary:
 * what the client may send, what we persist, and the shape we trust from the
 * external geocoding API. Validation lives here so routes stay thin.
 */

/** US 5-digit zip code. */
const zipCode = z
  .string()
  .trim()
  .regex(/^\d{5}$/, "zipCode must be a 5-digit US zip code");

const name = z.string().trim().min(1, "name is required").max(100);

/** Client payload for `POST /users`. */
export const createUserSchema = z.object({
  name,
  zipCode,
});

/**
 * Client payload for `PUT /users/:id`. Both fields optional, but at least one
 * must be present — an empty update is a client error, not a no-op.
 */
export const updateUserSchema = z
  .object({
    name: name.optional(),
    zipCode: zipCode.optional(),
  })
  .refine((body) => body.name !== undefined || body.zipCode !== undefined, {
    message: "Provide at least one of: name, zipCode",
  });

/** The geo fields derived from the zip code. */
export const geoSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.number(), // UTC offset in seconds, as OpenWeather returns it
});

/** The persisted User record — the canonical shape stored and returned. */
export const userSchema = z
  .object({
    id: z.string(),
    name,
    zipCode,
    createdAt: z.number(), // unix ms
    updatedAt: z.number(), // unix ms
  })
  .merge(geoSchema);

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
  })
  .passthrough();

/**
 * @typedef {z.infer<typeof userSchema>} User
 * @typedef {z.infer<typeof geoSchema>} Geo
 */
