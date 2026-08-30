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
  "swiss",
  "aurora",
  "cyberpunk",
  "clay",
  "popart",
  "y2k",
  "retro",
  "bohemian",
  "handwritten",
  "pixel",
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
    name: "Minimalism",
    tagline: "Less, but better",
    description:
      "Near-black canvas, hairline borders, one quiet accent — the work speaks first.",
    mode: "dark",
    fontLabel: "Inter · neutral sans",
    metaColor: "#0a0a0a",
    swatch: {
      bg: "#0a0a0a",
      surface: "#141414",
      border: "#262626",
      text: "#fafafa",
      mutedText: "#a3a3a3",
      accent: "#3b82f6",
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
    name: "Glassmorphism",
    tagline: "Frosted depth",
    description:
      "Drifting aurora gradients behind frosted translucent surfaces with specular edges.",
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
  {
    id: "swiss",
    name: "Swiss Design",
    tagline: "Grid & signal red",
    description:
      "White ground, black rules, squared corners and a single signal-red accent — pure International Style order.",
    mode: "light",
    fontLabel: "Inter Tight · grotesk display",
    metaColor: "#ffffff",
    swatch: {
      bg: "#ffffff",
      surface: "#f4f4f4",
      border: "#111111",
      text: "#111111",
      mutedText: "#6b6b6b",
      accent: "#e30613",
    },
  },
  {
    id: "aurora",
    name: "Aurora Gradient",
    tagline: "Gradient light show",
    description:
      "Near-black canvas lit by drifting indigo, fuchsia and cyan meshes with glowing gradient buttons.",
    mode: "dark",
    fontLabel: "Space Grotesk · gradient display",
    metaColor: "#05060f",
    swatch: {
      bg: "#05060f",
      surface: "#0d1224",
      border: "#1e263f",
      text: "#e7eaff",
      mutedText: "#8b93b8",
      accent: "#6366f1",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    tagline: "Neon dystopia",
    description:
      "Deep-space dark with cyan glow, magenta accents, scanlines and an all-mono blueprint grid.",
    mode: "dark",
    fontLabel: "Chakra Petch + JetBrains Mono",
    metaColor: "#0a0a12",
    swatch: {
      bg: "#0a0a12",
      surface: "#12121f",
      border: "#2a2a45",
      text: "#e8f6ff",
      mutedText: "#7f8bb0",
      accent: "#22d3ee",
    },
  },
  {
    id: "clay",
    name: "Claymorphism",
    tagline: "Soft inflated 3D",
    description:
      "Pale lilac day, puffy white tiles with inflating inner shadows and rounded pastel blobs.",
    mode: "light",
    fontLabel: "Nunito · rounded sans",
    metaColor: "#f3efff",
    swatch: {
      bg: "#f3efff",
      surface: "#ffffff",
      border: "#e3dcf7",
      text: "#2a2440",
      mutedText: "#6d6789",
      accent: "#8b5cf6",
    },
  },
  {
    id: "popart",
    name: "Pop Art",
    tagline: "Comic maximalism",
    description:
      "Paper canvas under Ben-Day dots, thick comic ink strokes, hard offset shadows and candy primaries.",
    mode: "light",
    fontLabel: "Bungee · comic display",
    metaColor: "#fff9e6",
    swatch: {
      bg: "#fff9e6",
      surface: "#ffffff",
      border: "#111111",
      text: "#111111",
      mutedText: "#5c584a",
      accent: "#e63946",
    },
  },
  {
    id: "y2k",
    name: "Y2K",
    tagline: "Millennium chrome",
    description:
      "Ice-lilac ground with iridescent lavender-aqua-pink light, chrome-edged bubbles and pill shapes.",
    mode: "light",
    fontLabel: "Michroma · wide techno",
    metaColor: "#e9e6ff",
    swatch: {
      bg: "#e9e6ff",
      surface: "#ffffff",
      border: "#d4ccf5",
      text: "#1b1740",
      mutedText: "#6f6a99",
      accent: "#a78bfa",
    },
  },
  {
    id: "retro",
    name: "Retro Print",
    tagline: "70s warmth",
    description:
      "Cream paper, burnt orange and mustard, serif display and sun-bleached grain.",
    mode: "light",
    fontLabel: "DM Serif Display · Inter body",
    metaColor: "#f6ead2",
    swatch: {
      bg: "#f6ead2",
      surface: "#fdf6e9",
      border: "#dcc9a4",
      text: "#4a2f1d",
      mutedText: "#8a6d55",
      accent: "#d95f2b",
    },
  },
  {
    id: "bohemian",
    name: "Bohemian",
    tagline: "Artisan calm",
    description:
      "Sandy linen textures, terracotta and sage, airy serif headlines and soft rounded cards.",
    mode: "light",
    fontLabel: "Cormorant Garamond · Inter body",
    metaColor: "#f5efe3",
    swatch: {
      bg: "#f5efe3",
      surface: "#fdfaf3",
      border: "#e5dbc8",
      text: "#3f3529",
      mutedText: "#8a7d6a",
      accent: "#c4704f",
    },
  },
  {
    id: "handwritten",
    name: "Handwritten",
    tagline: "Sketchbook notes",
    description:
      "Ruled notebook lines, marker-yellow highlights, tilted ink-stroke buttons — with a readable sans body.",
    mode: "light",
    fontLabel: "Caveat · Inter body",
    metaColor: "#fdfbf4",
    swatch: {
      bg: "#fdfbf4",
      surface: "#ffffff",
      border: "#e5e0d1",
      text: "#2b2b2b",
      mutedText: "#6f6a5e",
      accent: "#ffe14d",
    },
  },
  {
    id: "pixel",
    name: "Pixel Art",
    tagline: "8-bit precision",
    description:
      "Navy-black canvas, hard black borders, stepped shadows, CRT vignette and snapped 8px rhythm.",
    mode: "dark",
    fontLabel: "Press Start 2P + VT323",
    metaColor: "#0f0f1b",
    swatch: {
      bg: "#0f0f1b",
      surface: "#1a1a2e",
      border: "#000000",
      text: "#e8e8e8",
      mutedText: "#8a8aa0",
      accent: "#3ddc84",
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
