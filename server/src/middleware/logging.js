/**
 * Structured request logger. Emits one JSON line per completed request with
 * method, path, status, and duration. JSON (rather than a pretty string) keeps
 * the output greppable and ready for a log aggregator without extra tooling.
 *
 * @type {import("express").RequestHandler}
 */
export function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(
      JSON.stringify({
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(durationMs),
      }),
    );
  });

  next();
}
