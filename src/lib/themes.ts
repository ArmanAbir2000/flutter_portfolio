/**
 * Site-wide UI themes.
 *
 * A theme is a complete restyle — palette, typography, radii, borders,
 * shadows, textures and motion personality — defined as CSS under
 * `html[data-theme="<id>"]` in src/index.css. The active theme id lives on
 * <html data-theme>, the `.dark` class follows each theme's mode, and the
 * owner's choice is persisted in Convex (`siteContent` key "theme") so every
 * visitor sees the same style.
 */

export const THEME_IDS = [
  "studio",
  "brutal",
  "glass",
  "terminal",
  "editorial",
  "bento",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];
export type ThemeMode = "dark" | "light";

export type ThemeDef = {
  id: ThemeId;
  name: string;
  tagline: string;
  /** Longer line shown on the dashboard card. */
  description: string;
  mode: ThemeMode;
  /** Signature type pairing shown on the dashboard card. */
  fontLabel: string;
  /** Browser chrome color while the theme is active. */
  metaColor: string;
  /** Fixed colors for the dashboard preview cards (never themed themselves). */
  swatch: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    mutedText: string;
    accent: string;
  };
};

export const THEMES: ThemeDef[] = [
  {
    id: "studio",
    name: "Studio Dark",
    tagline: "Quiet confidence",
    description:
      "The house style — near-black canvas, hairline borders, restrained motion.",
    mode: "dark",
    fontLabel: "Inter · neutral sans",
    metaColor: "#0a0a0a",
    swatch: {
      bg: "#0a0a0a",
      surface: "#171717",
      border: "#2a2a2a",
      text: "#fafafa",
      mutedText: "#a1a1aa",
      accent: "#e4e4e7",
    },
  },
  {
    id: "brutal",
    name: "Neo Brutalist",
    tagline: "Loud & tactile",
    description:
      "Paper background, raw black borders, hard offset shadows and an electric lime accent.",
    mode: "light",
    fontLabel: "Space Grotesk · chunky display",
    metaColor: "#f2ede3",
    swatch: {
      bg: "#f2ede3",
      surface: "#fffdf6",
      border: "#111110",
      text: "#111110",
      mutedText: "#57564c",
      accent: "#c8f04b",
    },
  },
  {
    id: "glass",
    name: "Aurora Glass",
    tagline: "Frosted depth",
    description:
      "Drifting aurora gradients behind frosted translucent surfaces with soft glows.",
    mode: "dark",
    fontLabel: "Space Grotesk · airy display",
    metaColor: "#0b0b1c",
    swatch: {
      bg: "#0b0b1c",
      surface: "#181834",
      border: "#33335e",
      text: "#eceafd",
      mutedText: "#9d9cc9",
      accent: "#8b7cf8",
    },
  },
  {
    id: "terminal",
    name: "Phosphor Terminal",
    tagline: "CRT retro-tech",
    description:
      "Green-on-black phosphor glow, all-mono type, scanlines and a blueprint grid.",
    mode: "dark",
    fontLabel: "JetBrains Mono · everything",
    metaColor: "#050805",
    swatch: {
      bg: "#050805",
      surface: "#0b120b",
      border: "#1d3320",
      text: "#b8f5bd",
      mutedText: "#5f8f66",
      accent: "#4ade80",
    },
  },
  {
    id: "editorial",
    name: "Editorial Serif",
    tagline: "Print magazine",
    description:
      "Warm paper, serif display headlines, hairline rules and generous whitespace.",
    mode: "light",
    fontLabel: "Fraunces serif · Inter body",
    metaColor: "#faf7f0",
    swatch: {
      bg: "#faf7f0",
      surface: "#ffffff",
      border: "#ded7c8",
      text: "#1c1917",
      mutedText: "#78716c",
      accent: "#b45309",
    },
  },
  {
    id: "bento",
    name: "Bento Pop",
    tagline: "Playful grid",
    description:
      "Soft daylight canvas, big rounded tiles, candy chart colors and springy motion.",
    mode: "light",
    fontLabel: "Space Grotesk · rounded sans",
    metaColor: "#f7f6f3",
    swatch: {
      bg: "#f7f6f3",
      surface: "#ffffff",
      border: "#e5e1da",
      text: "#211f1c",
      mutedText: "#79756e",
      accent: "#ff6b4a",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "studio";

const byId = new Map<string, ThemeDef>(THEMES.map((t) => [t.id, t]));

export function getTheme(id: string | null | undefined): ThemeDef | null {
  return (id && byId.get(id)) || null;
}

/** Stored-data guard — never trust remote/local shapes. */
export function asThemeId(d: unknown): ThemeId | null {
  if (typeof d === "string" && byId.has(d)) return d as ThemeId;
  if (
    !!d &&
    typeof d === "object" &&
    typeof (d as Record<string, unknown>).theme === "string" &&
    byId.has((d as Record<string, unknown>).theme as string)
  ) {
    return (d as Record<string, unknown>).theme as ThemeId;
  }
  return null;
}

const STORAGE_KEY = "shiki-site-theme";

export function readStoredTheme(): ThemeId | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw && byId.has(raw) ? (raw as ThemeId) : null;
  } catch {
    return null;
  }
}

/** Apply a theme to the document: data-theme attr, .dark class, chrome color. */
export function applyTheme(id: ThemeId) {
  const def = byId.get(id);
  if (!def) return;
  const root = document.documentElement;
  root.dataset.theme = def.id;
  root.classList.toggle("dark", def.mode === "dark");
  root.style.colorScheme = def.mode;

  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = def.metaColor;

  try {
    localStorage.setItem(STORAGE_KEY, def.id);
  } catch {
    /* private mode — non-fatal */
  }
}
