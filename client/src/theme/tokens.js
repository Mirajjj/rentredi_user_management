import { defineConfig } from "@chakra-ui/react";

// Stripe-inspired brand layer over Chakra's default config: a blurple accent
// scale, warm dashboard neutrals, status colors, low radii, and subtle shadows.
// Inter drives the UI; JetBrains Mono renders data values (zip, coords, ids, tz).
export const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#efeefe" },
          100: { value: "#e0defd" },
          200: { value: "#c4c0fb" },
          300: { value: "#a39df9" },
          400: { value: "#827bf7" },
          500: { value: "#635BFF" },
          600: { value: "#524deb" },
          700: { value: "#4a45d6" },
          800: { value: "#3a35a8" },
          900: { value: "#2b277c" },
        },
        green: {
          solid: { value: "#1f8a5b" },
          subtle: { value: "#e7f6ee" },
          fg: { value: "#15663f" },
        },
        red: {
          solid: { value: "#df1b41" },
          subtle: { value: "#fce8ec" },
          border: { value: "#f1c4cf" },
        },
        ink: {
          900: { value: "#1a1f36" },
          600: { value: "#5b6478" },
          400: { value: "#8792a2" },
        },
        line: {
          subtle: { value: "#e6e8ee" },
          strong: { value: "#d5d9e2" },
        },
        surface: {
          canvas: { value: "#f6f7f9" },
          panel: { value: "#ffffff" },
          subtle: { value: "#fafbfc" },
        },
      },
      radii: {
        sm: { value: "6px" },
        md: { value: "8px" },
        lg: { value: "12px" },
        xl: { value: "16px" },
      },
      shadows: {
        xs: {
          value:
            "0 1px 1px rgba(16, 24, 64, 0.04), 0 0 0 1px rgba(16, 24, 64, 0.04)",
        },
        sm: {
          value:
            "0 1px 2px rgba(16, 24, 64, 0.06), 0 2px 6px rgba(16, 24, 64, 0.05)",
        },
        md: {
          value:
            "0 2px 5px rgba(16, 24, 64, 0.06), 0 10px 24px rgba(16, 24, 64, 0.07)",
        },
        lg: {
          value:
            "0 12px 32px rgba(16, 24, 64, 0.12), 0 4px 10px rgba(16, 24, 64, 0.06)",
        },
        pane: { value: "-16px 0 40px rgba(16, 24, 64, 0.10)" },
      },
      fonts: {
        heading: {
          value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        body: {
          value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        mono: {
          value: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: "{colors.surface.canvas}" },
          panel: { value: "{colors.surface.panel}" },
          subtle: { value: "{colors.surface.subtle}" },
        },
        border: {
          subtle: { value: "{colors.line.subtle}" },
          strong: { value: "{colors.line.strong}" },
        },
        fg: {
          DEFAULT: { value: "{colors.ink.900}" },
          muted: { value: "{colors.ink.600}" },
          subtle: { value: "{colors.ink.400}" },
        },
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          emphasized: { value: "{colors.brand.600}" },
          subtle: { value: "{colors.brand.50}" },
        },
        success: {
          solid: { value: "{colors.green.solid}" },
          subtle: { value: "{colors.green.subtle}" },
          fg: { value: "{colors.green.fg}" },
        },
        error: {
          solid: { value: "{colors.red.solid}" },
          subtle: { value: "{colors.red.subtle}" },
        },
      },
    },
  },
  globalCss: {
    "html, body, #root": { height: "100%" },
    body: {
      bg: "bg.canvas",
      color: "fg",
      fontFeatureSettings: '"cv05" 1, "cv08" 1, "ss01" 1',
      WebkitFontSmoothing: "antialiased",
    },
  },
});
