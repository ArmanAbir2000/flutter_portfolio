import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAnimationPreset } from "@/lib/animations";

const STORAGE_KEY = "shiki-motion-palette";

interface MotionPaletteSettings {
  animationId: string;
  paletteId: string;
}

interface ThemeSettingsContextValue {
  animationId: string;
  paletteId: string;
  setAnimationId: (id: string) => void;
  setPaletteId: (id: string) => void;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextValue | null>(
  null,
);

/* ── Palette CSS variable maps ───────────────────────────────────────── */

type PaletteVars = Record<string, string>;

/**
 * Accent-only palette overrides. Background, foreground, card, border,
 * and muted colors are controlled by the site theme — palettes only
 * change the accent color family (primary, accent, ring, charts).
 */
const PALETTE_MAP: Record<string, PaletteVars> = {
  "golden-hour": {
    "--primary": "oklch(0.72 0.14 55)",
    "--primary-foreground": "oklch(0.98 0.01 55)",
    "--accent": "oklch(0.75 0.16 65)",
    "--accent-foreground": "oklch(0.15 0.02 55)",
    "--ring": "oklch(0.72 0.14 55)",
    "--chart-1": "oklch(0.72 0.14 55)",
    "--chart-2": "oklch(0.75 0.16 65)",
    "--chart-3": "oklch(0.6 0.12 45)",
    "--chart-4": "oklch(0.8 0.1 70)",
    "--chart-5": "oklch(0.5 0.1 55)",
  },
  "deep-ocean": {
    "--primary": "oklch(0.65 0.12 220)",
    "--primary-foreground": "oklch(0.98 0.01 220)",
    "--accent": "oklch(0.78 0.14 175)",
    "--accent-foreground": "oklch(0.12 0.02 220)",
    "--ring": "oklch(0.65 0.12 220)",
    "--chart-1": "oklch(0.65 0.12 220)",
    "--chart-2": "oklch(0.78 0.14 175)",
    "--chart-3": "oklch(0.5 0.1 240)",
    "--chart-4": "oklch(0.7 0.1 200)",
    "--chart-5": "oklch(0.55 0.08 210)",
  },
  "berry-crush": {
    "--primary": "oklch(0.72 0.22 320)",
    "--primary-foreground": "oklch(0.98 0.01 320)",
    "--accent": "oklch(0.78 0.24 340)",
    "--accent-foreground": "oklch(0.12 0.02 320)",
    "--ring": "oklch(0.72 0.22 320)",
    "--chart-1": "oklch(0.72 0.22 320)",
    "--chart-2": "oklch(0.78 0.24 340)",
    "--chart-3": "oklch(0.6 0.18 300)",
    "--chart-4": "oklch(0.8 0.2 350)",
    "--chart-5": "oklch(0.55 0.15 330)",
  },
  "forest-floor": {
    "--primary": "oklch(0.68 0.12 150)",
    "--primary-foreground": "oklch(0.98 0.01 150)",
    "--accent": "oklch(0.78 0.16 130)",
    "--accent-foreground": "oklch(0.12 0.02 150)",
    "--ring": "oklch(0.68 0.12 150)",
    "--chart-1": "oklch(0.68 0.12 150)",
    "--chart-2": "oklch(0.78 0.16 130)",
    "--chart-3": "oklch(0.55 0.1 160)",
    "--chart-4": "oklch(0.7 0.1 140)",
    "--chart-5": "oklch(0.6 0.08 155)",
  },
  "electric-dreams": {
    "--primary": "oklch(0.78 0.2 210)",
    "--primary-foreground": "oklch(0.98 0.01 210)",
    "--accent": "oklch(0.82 0.2 250)",
    "--accent-foreground": "oklch(0.12 0.02 250)",
    "--ring": "oklch(0.78 0.2 210)",
    "--chart-1": "oklch(0.78 0.2 210)",
    "--chart-2": "oklch(0.82 0.2 250)",
    "--chart-3": "oklch(0.65 0.18 230)",
    "--chart-4": "oklch(0.85 0.15 200)",
    "--chart-5": "oklch(0.7 0.16 260)",
  },
};

/* ── Palette metadata for the picker UI ──────────────────────────────── */

export const PALETTE_META = [
  { id: "default", name: "Default", icon: "◻️", swatches: ["#222", "#666", "#e5e5e5", "#ef4444", "#737373"] },
  { id: "golden-hour", name: "Golden Hour", icon: "✨", swatches: ["#FFF8F0", "#5C3D2E", "#F5A623", "#D4915E", "#8B5E3C"] },
  { id: "deep-ocean", name: "Deep Ocean", icon: "🌊", swatches: ["#0A1628", "#2D3748", "#1A535C", "#4ECDC4", "#0D2137"] },
  { id: "berry-crush", name: "Berry Crush", icon: "🫐", swatches: ["#2D1B4E", "#9B72AA", "#E040A0", "#C77DFF", "#1A1025"] },
  { id: "forest-floor", name: "Forest Floor", icon: "🌿", swatches: ["#2C3E2D", "#7C9A6E", "#A8C686", "#4A6741", "#1B2E1C"] },
  { id: "electric-dreams", name: "Electric Dreams", icon: "💎", swatches: ["#0A0A0F", "#1A1A2E", "#00D4FF", "#0066FF", "#16213E"] },
] as const;

/* ── Persistence ─────────────────────────────────────────────────────── */

function loadSettings(): MotionPaletteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MotionPaletteSettings>;
      return {
        animationId: parsed.animationId ?? "cinematic",
        paletteId: parsed.paletteId ?? "default",
      };
    }
  } catch { /* ignore */ }
  return { animationId: "cinematic", paletteId: "default" };
}

function saveSettings(s: MotionPaletteSettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* */ }
}

/* ── Provider ────────────────────────────────────────────────────────── */

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<MotionPaletteSettings>(loadSettings);

  useEffect(() => { saveSettings(settings); }, [settings]);

  const setAnimationId = useCallback(
    (id: string) => setSettings((s) => ({ ...s, animationId: id })),
    [],
  );
  const setPaletteId = useCallback(
    (id: string) => setSettings((s) => ({ ...s, paletteId: id })),
    [],
  );

  const value = useMemo<ThemeSettingsContextValue>(
    () => ({
      animationId: settings.animationId,
      paletteId: settings.paletteId,
      setAnimationId,
      setPaletteId,
    }),
    [settings, setAnimationId, setPaletteId],
  );

  return (
    <ThemeSettingsContext.Provider value={value}>
      {children}
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings() {
  const ctx = useContext(ThemeSettingsContext);
  if (!ctx) throw new Error("useThemeSettings must be inside ThemeSettingsProvider");
  return ctx;
}

export function useActiveAnimation() {
  const { animationId } = useThemeSettings();
  return getAnimationPreset(animationId);
}

/** Apply palette variables directly as inline styles on <html>. */
/** Keys that palette overrides — used to clear previous palette vars
 *  without touching animation vars set by applyAnimVars. */
const PALETTE_KEYS = new Set([
  "--primary", "--primary-foreground",
  "--accent", "--accent-foreground",
  "--ring",
  "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5",
]);

export function applyPaletteVars(paletteId: string) {
  const el = document.documentElement;
  const vars = paletteId === "default" ? null : PALETTE_MAP[paletteId];

  // Clear previous palette variables (keep animation vars intact)
  for (const key of PALETTE_KEYS) {
    el.style.removeProperty(key);
  }

  // Apply new palette variables (inline style = highest specificity)
  if (vars) {
    for (const [prop, value] of Object.entries(vars)) {
      el.style.setProperty(prop, value);
    }
  }
}

/** Apply animation CSS variables directly as inline styles on <html>. */
export function applyAnimVars(animationId: string) {
  const el = document.documentElement;
  const preset = getAnimationPreset(animationId);

  el.style.setProperty("--anim-ease", `cubic-bezier(${preset.ease.join(", ")})`);
  el.style.setProperty("--anim-duration", `${preset.duration}s`);
  el.style.setProperty("--anim-distance", `${preset.distance}px`);
  el.style.setProperty("--anim-stagger", `${preset.stagger}s`);
}
