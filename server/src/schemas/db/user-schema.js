import { z } from "zod";
import { geoSchema } from "../geo-schema.js";

/**
 * Persistence schema for the User entity — the canonical record as stored in and
 * read back from the database. The field primitives (`name`, `zipCode`) live here
 * with the model and are reused by the route-input schemas, so the rules a client
 * must satisfy match the rules the record enforces.
 */

/** US 5-digit zip code. */
export const zipCode = z
  .string()
  .trim()
  .regex(/^\d{5}$/, "zipCode must be a 5-digit US zip code");

export const name = z.string().trim().min(1, "name is required").max(100);

/** The persisted User record. `id` is the RTDB push key, attached on read. */
export const userSchema = z
  .object({
    id: z.string(),
    name,
    zipCode,
    createdAt: z.number(), // unix ms
    updatedAt: z.number(), // unix ms
  })
  .merge(geoSchema);

/** @typedef {z.infer<typeof userSchema>} User */
