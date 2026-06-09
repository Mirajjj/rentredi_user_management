import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const src = (p) => fileURLToPath(new URL(p, import.meta.url));

// Vite reads `client/.env` by default. Only VITE_-prefixed vars reach the browser.
export default defineConfig({
  plugins: [react()],
  // Root-relative aliases — mirrors `jsconfig.json` paths. Edit both together.
  resolve: {
    alias: {
      "@": src("./src"),
      "@theme": src("./src/theme"),
      "@lib": src("./src/lib"),
      "@pages": src("./src/pages"),
      "@base": src("./src/modules/base"),
      "@modules": src("./src/modules"),
    },
  },
  server: {
    port: 3000,
    host: true,
    // CodeSandbox serves the preview from a random *.csb.app subdomain; Vite's
    // host check blocks unknown hosts, so allow the whole domain.
    allowedHosts: [".csb.app"],
  },
});
