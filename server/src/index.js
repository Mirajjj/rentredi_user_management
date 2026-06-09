import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import { requestLogger } from "./middleware/logging.js";
import { errorHandler } from "./middleware/errors.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "rentredi-user-management" });
});

app.use("/users", usersRouter);

// Error handler must be registered last, after all routes.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
