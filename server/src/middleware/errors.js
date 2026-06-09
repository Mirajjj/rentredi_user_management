import { ZodError } from "zod";

/**
 * An error with an associated HTTP status code. Throw this from services/routes
 * when you know the right status to return (e.g. a bad zip is a 400). Anything
 * else that reaches the handler is treated as an unexpected 500.
 */
export class HttpError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   */
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

/**
 * Centralized Express error handler. Maps known error types to consistent
 * response shapes; logs the full stack for unexpected errors so they're
 * debuggable without leaking internals to the client.
 *
 * @type {import("express").ErrorRequestHandler}
 */
export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err.stack || err);
  return res.status(500).json({ error: "Internal server error" });
}
