import { defineConfig } from "@chakra-ui/react";

// Minimal brand layer over Chakra's default config: one accent color scale and
// the system font stack. Kept small on purpose — this is a CRUD take-home, not
// a design system.
export const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f2ff" },
          100: { value: "#bdf" },
          200: { value: "#90caf9" },
          300: { value: "#64b5f6" },
          400: { value: "#42a5f5" },
          500: { value: "#1f7ae0" },
          600: { value: "#1565c0" },
          700: { value: "#0d47a1" },
          800: { value: "#0a367a" },
          900: { value: "#062654" },
        },
      },
      fonts: {
        heading: {
          value:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        },
        body: {
          value:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          emphasized: { value: "{colors.brand.600}" },
        },
      },
    },
  },
});
