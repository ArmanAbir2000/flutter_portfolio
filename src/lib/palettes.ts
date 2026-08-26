/**
 * Color palettes — independent color overlays that can be applied on top of any theme.
 *
 * Each palette defines a small set of accent-ish colors (5 swatches).
 * They affect `--primary`, `--accent`, and chart colors while keeping the
 * theme's structural contrast (background, foreground, borders) intact.
 */

export interface Palette {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** The 5 swatch colors shown in the picker UI (hex). */
  swatches: string[];
  /** CSS custom property overrides applied as a class. */
  lightVars: Record<string, string>;
  darkVars: Record<string, string>;
}

export const palettes: Palette[] = [
  {
    id: "default",
    name: "Default",
    description: "Follows the active theme",
    icon: "◻️",
    swatches: ["#222", "#666", "#e5e5e5", "#ef4444", "#737373"],
    lightVars: {},
    darkVars: {},
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Warm cream, deep brown, amber",
    icon: "✨",
    swatches: ["#FFF8F0", "#5C3D2E", "#F5A623", "#D4915E", "#8B5E3C"],
    lightVars: {
      primary: "oklch(0.45 0.12 55)",
      "primary-foreground": "oklch(0.98 0.01 70)",
      accent: "oklch(0.7 0.15 65)",
      "accent-foreground": "oklch(0.2 0.03 55)",
      ring: "oklch(0.65 0.14 55)",
    },
    darkVars: {
      primary: "oklch(0.72 0.14 55)",
      "primary-foreground": "oklch(0.15 0.02 50)",
      accent: "oklch(0.75 0.16 65)",
      "accent-foreground": "oklch(0.15 0.02 50)",
      ring: "oklch(0.72 0.14 55)",
    },
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    description: "Navy, slate, teal",
    icon: "🌊",
    swatches: ["#0A1628", "#2D3748", "#1A535C", "#4ECDC4", "#0D2137"],
    lightVars: {
      primary: "oklch(0.4 0.1 220)",
      "primary-foreground": "oklch(0.98 0.01 220)",
      accent: "oklch(0.7 0.12 175)",
      "accent-foreground": "oklch(0.15 0.03 220)",
      ring: "oklch(0.55 0.12 220)",
    },
    darkVars: {
      primary: "oklch(0.65 0.12 220)",
      "primary-foreground": "oklch(0.12 0.02 220)",
      accent: "oklch(0.78 0.14 175)",
      "accent-foreground": "oklch(0.12 0.02 220)",
      ring: "oklch(0.65 0.12 220)",
    },
  },
  {
    id: "berry-crush",
    name: "Berry Crush",
    description: "Deep plum, soft mauve, fuchsia",
    icon: "🫐",
    swatches: ["#2D1B4E", "#9B72AA", "#E040A0", "#C77DFF", "#1A1025"],
    lightVars: {
      primary: "oklch(0.48 0.2 320)",
      "primary-foreground": "oklch(0.98 0.01 320)",
      accent: "oklch(0.65 0.22 340)",
      "accent-foreground": "oklch(0.15 0.03 320)",
      ring: "oklch(0.55 0.2 320)",
    },
    darkVars: {
      primary: "oklch(0.72 0.22 320)",
      "primary-foreground": "oklch(0.12 0.02 320)",
      accent: "oklch(0.78 0.24 340)",
      "accent-foreground": "oklch(0.12 0.02 320)",
      ring: "oklch(0.72 0.22 320)",
    },
  },
  {
    id: "forest-floor",
    name: "Forest Floor",
    description: "Dark olive, sage, lime",
    icon: "🌿",
    swatches: ["#2C3E2D", "#7C9A6E", "#A8C686", "#4A6741", "#1B2E1C"],
    lightVars: {
      primary: "oklch(0.45 0.1 150)",
      "primary-foreground": "oklch(0.98 0.01 150)",
      accent: "oklch(0.7 0.14 130)",
      "accent-foreground": "oklch(0.15 0.03 150)",
      ring: "oklch(0.55 0.1 150)",
    },
    darkVars: {
      primary: "oklch(0.68 0.12 150)",
      "primary-foreground": "oklch(0.12 0.02 150)",
      accent: "oklch(0.78 0.16 130)",
      "accent-foreground": "oklch(0.12 0.02 150)",
      ring: "oklch(0.68 0.12 150)",
    },
  },
  {
    id: "electric-dreams",
    name: "Electric Dreams",
    description: "Near-black, charcoal, electric blue",
    icon: "💎",
    swatches: ["#0A0A0F", "#1A1A2E", "#00D4FF", "#0066FF", "#16213E"],
    lightVars: {
      primary: "oklch(0.5 0.18 250)",
      "primary-foreground": "oklch(0.98 0.01 250)",
      accent: "oklch(0.75 0.2 210)",
      "accent-foreground": "oklch(0.15 0.03 250)",
      ring: "oklch(0.6 0.18 250)",
    },
    darkVars: {
      primary: "oklch(0.78 0.2 210)",
      "primary-foreground": "oklch(0.08 0.01 250)",
      accent: "oklch(0.82 0.2 250)",
      "accent-foreground": "oklch(0.08 0.01 250)",
      ring: "oklch(0.78 0.2 210)",
    },
  },
];

export function getPaletteById(id: string): Palette {
  return palettes.find((p) => p.id === id) ?? palettes[0];
}

/** CSS class name for a palette (empty string for default). */
export function paletteCSSClass(id: string): string {
  return id === "default" ? "" : `palette-${id}`;
}
