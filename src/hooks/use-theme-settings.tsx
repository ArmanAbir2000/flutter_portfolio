import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAnimationPreset } from "@/lib/animations";
import { getPaletteById, paletteCSSClass } from "@/lib/palettes";

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
  /** All computed class names to apply on <html>. */
  htmlClasses: string;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextValue | null>(
  null,
);

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
  } catch {
    // ignore
  }
  return { animationId: "cinematic", paletteId: "default" };
}

function saveSettings(s: MotionPaletteSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function ThemeSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<MotionPaletteSettings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const setAnimationId = useCallback(
    (id: string) => setSettings((s) => ({ ...s, animationId: id })),
    [],
  );
  const setPaletteId = useCallback(
    (id: string) => setSettings((s) => ({ ...s, paletteId: id })),
    [],
  );

  // Compute the CSS class list for <html>.
  const htmlClasses = useMemo(() => {
    const parts: string[] = [];
    const pc = paletteCSSClass(settings.paletteId);
    if (pc) parts.push(pc);
    parts.push(`anim-${settings.animationId}`);
    return parts.join(" ");
  }, [settings]);

  const value = useMemo<ThemeSettingsContextValue>(
    () => ({
      animationId: settings.animationId,
      paletteId: settings.paletteId,
      setAnimationId,
      setPaletteId,
      htmlClasses,
    }),
    [settings, setAnimationId, setPaletteId, htmlClasses],
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

/** Convenience: get the active animation preset object. */
export function useActiveAnimation() {
  const { animationId } = useThemeSettings();
  return getAnimationPreset(animationId);
}

/** Convenience: get the active palette. */
export function useActivePalette() {
  const { paletteId } = useThemeSettings();
  return getPaletteById(paletteId);
}
