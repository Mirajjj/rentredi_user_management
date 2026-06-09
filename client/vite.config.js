import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite reads `client/.env` by default. Only VITE_-prefixed vars reach the browser.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
});
