import rateLimit from "express-rate-limit";
import { HttpError } from "./errors.js";

/**
 * Throttle the write endpoints that derive geo data via the OpenWeather API
 * (create and update). Those calls cost money per request and have their own
 * upstream rate limit, so the cap protects the dependency, not just this server.
 * GET/DELETE don't hit OpenWeather and stay unlimited.
 *
 * Keyed by client IP (the default) — there's no auth to key on yet, so this is
 * coarse (shared NAT shares a bucket) but adequate. The default in-memory store
 * is per-process; a horizontally-scaled deploy would swap in a shared store
 * (e.g. Redis) so the limit holds across instances.
 *
 * A 429 is forwarded through the central error handler so it returns the app's
 * standard `{ error }` shape rather than the library's plaintext default.
 */
export const writeLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  limit: 20, // creates/updates per IP per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new HttpError(429, "Too many requests, please try again shortly"));
  },
});
