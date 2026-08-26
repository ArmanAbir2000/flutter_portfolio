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

const PALETTE_MAP: Record<string, PaletteVars> = {
  "golden-hour": {
    "--background": "oklch(0.14 0.01 50)",
    "--foreground": "oklch(0.92 0.01 70)",
    "--card": "oklch(0.18 0.012 50)",
    "--card-foreground": "oklch(0.92 0.01 70)",
    "--popover": "oklch(0.18 0.012 50)",
    "--popover-foreground": "oklch(0.92 0.01 70)",
    "--primary": "oklch(0.72 0.14 55)",
    "--primary-foreground": "oklch(0.12 0.02 50)",
    "--secondary": "oklch(0.24 0.018 50)",
    "--secondary-foreground": "oklch(0.92 0.01 70)",
    "--muted": "oklch(0.22 0.015 50)",
    "--muted-foreground": "oklch(0.55 0.02 60)",
    "--accent": "oklch(0.75 0.16 65)",
    "--accent-foreground": "oklch(0.12 0.02 50)",
    "--destructive": "oklch(0.6 0.2 25)",
    "--border": "oklch(0.28 0.018 50 / 60%)",
    "--input": "oklch(0.28 0.018 50 / 70%)",
    "--ring": "oklch(0.72 0.14 55)",
  },
  "deep-ocean": {
    "--background": "oklch(0.12 0.02 230)",
    "--foreground": "oklch(0.9 0.01 230)",
    "--card": "oklch(0.16 0.025 230)",
    "--card-foreground": "oklch(0.9 0.01 230)",
    "--popover": "oklch(0.16 0.025 230)",
    "--popover-foreground": "oklch(0.9 0.01 230)",
    "--primary": "oklch(0.65 0.12 220)",
    "--primary-foreground": "oklch(0.1 0.02 230)",
    "--secondary": "oklch(0.22 0.025 230)",
    "--secondary-foreground": "oklch(0.9 0.01 230)",
    "--muted": "oklch(0.2 0.02 230)",
    "--muted-foreground": "oklch(0.5 0.03 230)",
    "--accent": "oklch(0.78 0.14 175)",
    "--accent-foreground": "oklch(0.1 0.02 230)",
    "--destructive": "oklch(0.6 0.2 25)",
    "--border": "oklch(0.26 0.03 230 / 50%)",
    "--input": "oklch(0.26 0.03 230 / 60%)",
    "--ring": "oklch(0.65 0.12 220)",
  },
  "berry-crush": {
    "--background": "oklch(0.14 0.02 330)",
    "--foreground": "oklch(0.9 0.015 330)",
    "--card": "oklch(0.18 0.025 330)",
    "--card-foreground": "oklch(0.9 0.015 330)",
    "--popover": "oklch(0.18 0.025 330)",
    "--popover-foreground": "oklch(0.9 0.015 330)",
    "--primary": "oklch(0.72 0.22 320)",
    "--primary-foreground": "oklch(0.1 0.02 330)",
    "--secondary": "oklch(0.22 0.025 330)",
    "--secondary-foreground": "oklch(0.9 0.015 330)",
    "--muted": "oklch(0.2 0.02 330)",
    "--muted-foreground": "oklch(0.5 0.03 330)",
    "--accent": "oklch(0.78 0.24 340)",
    "--accent-foreground": "oklch(0.1 0.02 330)",
    "--destructive": "oklch(0.6 0.2 25)",
    "--border": "oklch(0.26 0.03 330 / 50%)",
    "--input": "oklch(0.26 0.03 330 / 60%)",
    "--ring": "oklch(0.72 0.22 320)",
  },
  "forest-floor": {
    "--background": "oklch(0.13 0.015 145)",
    "--foreground": "oklch(0.88 0.015 145)",
    "--card": "oklch(0.17 0.02 145)",
    "--card-foreground": "oklch(0.88 0.015 145)",
    "--popover": "oklch(0.17 0.02 145)",
    "--popover-foreground": "oklch(0.88 0.015 145)",
    "--primary": "oklch(0.68 0.12 150)",
    "--primary-foreground": "oklch(0.1 0.02 145)",
    "--secondary": "oklch(0.22 0.02 145)",
    "--secondary-foreground": "oklch(0.88 0.015 145)",
    "--muted": "oklch(0.2 0.018 145)",
    "--muted-foreground": "oklch(0.5 0.025 145)",
    "--accent": "oklch(0.78 0.16 130)",
    "--accent-foreground": "oklch(0.1 0.02 145)",
    "--destructive": "oklch(0.6 0.2 25)",
    "--border": "oklch(0.25 0.02 145 / 50%)",
    "--input": "oklch(0.25 0.02 145 / 60%)",
    "--ring": "oklch(0.68 0.12 150)",
  },
  "electric-dreams": {
    "--background": "oklch(0.08 0.015 250)",
    "--foreground": "oklch(0.88 0.01 250)",
    "--card": "oklch(0.12 0.02 250)",
    "--card-foreground": "oklch(0.88 0.01 250)",
    "--popover": "oklch(0.12 0.02 250)",
    "--popover-foreground": "oklch(0.88 0.01 250)",
    "--primary": "oklch(0.78 0.2 210)",
    "--primary-foreground": "oklch(0.06 0.01 250)",
    "--secondary": "oklch(0.18 0.02 250)",
    "--secondary-foreground": "oklch(0.88 0.01 250)",
    "--muted": "oklch(0.16 0.018 250)",
    "--muted-foreground": "oklch(0.48 0.02 250)",
    "--accent": "oklch(0.82 0.2 250)",
    "--accent-foreground": "oklch(0.06 0.01 250)",
    "--destructive": "oklch(0.6 0.2 25)",
    "--border": "oklch(0.22 0.025 250 / 50%)",
    "--input": "oklch(0.22 0.025 250 / 60%)",
    "--ring": "oklch(0.78 0.2 210)",
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
export function applyPaletteVars(paletteId: string) {
  const el = document.documentElement;
  const vars = paletteId === "default" ? null : PALETTE_MAP[paletteId];

  // Remove all palette CSS variables from inline style
  for (const key of Object.keys(el.style)) {
    if (key.startsWith("--")) {
      el.style.removeProperty(key);
    }
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
  el.style.setProperty("--anim-hover-scale", String(preset.hoverScale));
}
