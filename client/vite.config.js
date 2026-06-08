import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// envDir points at the repo root so the client and server share a single .env
// (VITE_-prefixed vars are the only ones Vite exposes to the browser).
export default defineConfig({
  plugins: [react()],
  envDir: "..",
  server: {
    port: 3000,
    host: true,
  },
});
