/**
 * Landing-page content model + defaults.
 *
 * The dashboard writes overrides to the Convex `siteContent` table; the
 * landing page renders the stored version when present and falls back to
 * these defaults otherwise (fresh deploys, missing sections, bad data).
 */

export type HeroContent = { title: string; subtitle: string };
export type Capability = { title: string; body: string };
export type ActiveItem = { name: string; context: string; slug?: string };
export type InProgressContent = {
  client: ActiveItem[];
  personal: ActiveItem[];
};

export const CONTENT_KEYS = {
  hero: "hero",
  skills: "skills",
  capabilities: "capabilities",
  inProgress: "inProgress",
} as const;

export const defaultHero: HeroContent = {
  title: "Flutter apps with serious backbones.",
  subtitle:
    "I'm Arman Abir, founder of Shiki Code Studio. I build cross-platform apps in Flutter, backed by Laravel RESTful APIs and Firebase — with state management done right using GetX, BLoC, or Riverpod. Browse the work below, then book time directly on my calendar.",
};

export const defaultSkills: string[] = [
  "Clean architecture",
  "Flutter",
  "Dart",
  "Laravel",
  "Firebase",
  "GetX",
  "BLoC",
];

export const defaultCapabilities: Capability[] = [
  {
    title: "Cross-platform apps",
    body: "Production Flutter apps for Android and iOS from a single Dart codebase — state managed with GetX, BLoC, or Riverpod as the project demands, never one-size-fits-all.",
  },
  {
    title: "Backends & APIs",
    body: "RESTful APIs built on Laravel with clean resource architecture, plus Firebase for authentication, Cloud Messaging, and realtime features that keep clients in sync.",
  },
  {
    title: "Studio-grade delivery",
    body: "Shiki Code Studio takes products from design to store release: clean architecture, honest estimates, and handover documentation your own team can own.",
  },
];

export const defaultInProgress: InProgressContent = {
  client: [
    {
      name: "ParcelFly — Delivery Ecosystem",
      context:
        "Ongoing Flutter and Laravel work across the courier, merchant, and customer apps.",
    },
    {
      name: "JobNect — Recruitment Suite",
      context:
        "Continued development of the employer and applicant Flutter clients.",
    },
    {
      name: "Sellino — E-commerce Platform",
      context:
        "Storefront and mobile app iteration on the Laravel commerce API.",
    },
  ],
  personal: [
    {
      name: "Orimono",
      context: "Personal Flutter app — current release polish and new features.",
    },
    {
      name: "Watch Store",
      context: "E-commerce Flutter app — checkout flow refinements.",
    },
    {
      name: "FreeShop",
      context: "Marketplace-style shopping app — feed performance improvements.",
    },
    {
      name: "Job App",
      context: "Job-listing client — application tracker enhancements.",
    },
  ],
};

/* ---- Runtime guards (stored data is user-edited; never trust shape) ---- */

const strArray = (d: unknown): string[] | null =>
  Array.isArray(d) && d.every((x) => typeof x === "string")
    ? (d.filter((s) => s.trim().length > 0) as string[])
    : null;

export function asHero(d: unknown): HeroContent | null {
  if (!d || typeof d !== "object") return null;
  const o = d as Record<string, unknown>;
  return typeof o.title === "string" &&
    typeof o.subtitle === "string" &&
    o.title.trim() &&
    o.subtitle.trim()
    ? { title: o.title, subtitle: o.subtitle }
    : null;
}

export const asSkills = strArray;

export function asCapabilities(d: unknown): Capability[] | null {
  if (!Array.isArray(d)) return null;
  const items = d.filter(
    (x): x is Capability =>
      !!x &&
      typeof x === "object" &&
      typeof (x as Capability).title === "string" &&
      typeof (x as Capability).body === "string",
  );
  return items.length > 0 ? items : null;
}

export function asInProgress(d: unknown): InProgressContent | null {
  if (!d || typeof d !== "object") return null;
  const o = d as Record<string, unknown>;
  const items = (v: unknown): ActiveItem[] | null =>
    Array.isArray(v)
      ? v.filter(
          (x): x is ActiveItem =>
            !!x &&
            typeof x === "object" &&
            typeof (x as ActiveItem).name === "string" &&
            typeof (x as ActiveItem).context === "string",
        )
      : null;
  const client = items(o.client);
  const personal = items(o.personal);
  return client && personal ? { client, personal } : null;
}
