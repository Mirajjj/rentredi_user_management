import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "rentredi-user-management" });
});

// User routes are wired in here in Phase 2.

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
