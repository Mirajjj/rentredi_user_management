import { Router } from "express";
import {
  createUserSchema,
  updateUserSchema,
  userResponseSchema,
} from "../schemas/routes/user-schema.js";
import { geocodeZip } from "../services/geo.js";
import { HttpError } from "../middleware/errors.js";
import { writeLimiter } from "../middleware/rate-limit.js";
import { db } from "../db/index.js";

/**
 * Wrap an async route handler so rejected promises reach the error middleware.
 * Express 4 doesn't forward async errors automatically.
 *
 * @param {import("express").RequestHandler} handler
 * @returns {import("express").RequestHandler}
 */
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const router = Router();

// POST /users — derive geo from the zip, then persist.
router.post(
  "/",
  writeLimiter,
  asyncHandler(async (req, res) => {
    const { name, zipCode } = createUserSchema.parse(req.body);
    const geo = await geocodeZip(zipCode);
    const user = await db.users.create({ name, zipCode, ...geo });
    res.status(201).json(userResponseSchema.parse(user));
  }),
);

// GET /users — full list, newest first.
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(userResponseSchema.array().parse(await db.users.list()));
  }),
);

// GET /users/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await db.users.get(req.params.id);
    if (!user) throw new HttpError(404, "Not found");
    res.json(userResponseSchema.parse(user));
  }),
);

// PUT /users/:id — re-derive geo only when the zip actually changes.
router.put(
  "/:id",
  writeLimiter,
  asyncHandler(async (req, res) => {
    const changes = updateUserSchema.parse(req.body);

    const existing = await db.users.get(req.params.id);
    if (!existing) throw new HttpError(404, "Not found");

    const fields = { ...changes };
    if (changes.zipCode && changes.zipCode !== existing.zipCode) {
      Object.assign(fields, await geocodeZip(changes.zipCode));
    }

    const user = await db.users.update(req.params.id, fields);
    res.json(userResponseSchema.parse(user));
  }),
);

// DELETE /users/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await db.users.remove(req.params.id);
    if (!deleted) throw new HttpError(404, "Not found");
    res.status(204).end();
  }),
);

export default router;
