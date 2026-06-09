import { z } from "zod";
import { name, zipCode, userSchema } from "../db/user-schema.js";

/**
 * Request/response schemas for the `/users` routes — the HTTP boundary. Inputs
 * reuse the field rules from the db model; the response shape currently mirrors
 * the persisted record but lives here so the API contract can diverge from
 * storage without touching the db layer.
 */

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

/** The User shape the API returns. Mirrors the persisted record today. */
export const userResponseSchema = userSchema;
