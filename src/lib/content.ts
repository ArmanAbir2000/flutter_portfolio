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
export type SocialsContent = {
  github: string;
  facebook: string;
  email: string;
  /** Direct link to a résumé PDF; empty hides the download button. */
  resume: string;
};
export type ExperienceItem = {
  period: string; // e.g. "2023 — Now"
  title: string;
  org: string;
  summary: string;
  current?: boolean;
};
export type AboutContent = {
  heading: string;
  /** Paragraphs separated by blank lines. */
  body: string;
  /** Optional portrait; empty renders the section text-only. */
  photoUrl?: string;
};
export type PricingPlan = {
  name: string;
  price: string;
  blurb: string;
  features: string[];
  cta?: string;
};
export type PricingContent = {
  plans: PricingPlan[];
  note?: string;
};
export type Testimonial = {
  quote: string;
  /** Optional person name; attribution falls back to role + company. */
  name?: string;
  role?: string;
  company: string;
  /** Optional project slug → links the quote to its case study. */
  slug?: string;
};

export const CONTENT_KEYS = {
  hero: "hero",
  /** Site-wide UI theme id (see src/lib/themes.ts). */
  theme: "theme",
  skills: "skills",
  capabilities: "capabilities",
  inProgress: "inProgress",
  socials: "socials",
  testimonials: "testimonials",
  experience: "experience",
  about: "about",
  pricing: "pricing",
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

export const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "Three customer-facing apps, one shared codebase, one Laravel API — delivered on schedule and still easy to iterate on. Arman owns problems end to end, from architecture to store release.",
    role: "Operations lead",
    company: "ParcelFly",
    slug: "parcelfly-delivery-platform",
  },
  {
    quote:
      "He turned a messy recruitment workflow into two apps that just make sense. Employers and candidates both got faster, cleaner flows — and business rules stayed out of the clients entirely.",
    role: "Co-founder",
    company: "JobNect",
    slug: "jobnect-recruitment-suite",
  },
  {
    quote:
      "Our storefront and mobile app finally behave like one store. Carts, inventory, and order updates stay in sync because the commerce API was designed properly from day one.",
    role: "E-commerce lead",
    company: "Sellino",
    slug: "sellino-ecommerce",
  },
];

export const defaultExperience: ExperienceItem[] = [
  {
    period: "2023 — Now",
    title: "Founder & Flutter Developer",
    org: "Shiki Code Studio",
    summary:
      "Running the studio end to end: architecture, estimates, client communication, and Flutter + Laravel delivery through to store release.",
    current: true,
  },
  {
    period: "2024 — Now",
    title: "Mobile engineer on client platforms",
    org: "ParcelFly · JobNect · Sellino",
    summary:
      "Long-term engagements building and iterating the production apps behind three client ecosystems — role-based courier apps, paired recruitment clients, and an omnichannel commerce build.",
    current: true,
  },
  {
    period: "2024",
    title: "Independent app releases",
    org: "Orimono · Watch Store · FreeShop",
    summary:
      "Designed, built, and shipped personal Flutter products through review to release — checkout flows, marketplace feeds, and Firebase-backed data layers.",
  },
];

export const defaultAbout: AboutContent = {
  heading: "The developer behind the studio.",
  body:
    "I'm Arman Abir — a Flutter developer and the founder of Shiki Code Studio. For the past few years I've been building mobile products the whole way through: architecture, APIs, pixel-level UI, store release, and the iterations that follow real users.\n\nI work best as an embedded partner rather than a ticket queue — you talk to the person writing the code, estimates are honest, and everything I hand over is documented well enough for your own team to own.\n\nWhen I'm not shipping client platforms, I'm polishing my own apps — Orimono, Watch Store, FreeShop — which double as the proving ground for patterns I later bring into client work.",
  photoUrl: "",
};

export const defaultPricing: PricingContent = {
  plans: [
    {
      name: "MVP sprint",
      price: "$4,900+",
      blurb:
        "A shippable Flutter app — design to store release — scoped and delivered in weeks, not quarters.",
      features: [
        "Flutter app for Android and iOS",
        "Laravel API or Firebase backend",
        "Store submission included",
        "Handover documentation",
      ],
      cta: "Scope your MVP",
    },
    {
      name: "Monthly retainer",
      price: "$2,400/mo",
      blurb:
        "Ongoing development for teams that ship continuously — features, fixes, and releases every month.",
      features: [
        "Dedicated capacity each month",
        "Feature work + maintenance",
        "Direct line to the developer",
        "Pause or cancel anytime",
      ],
      cta: "Check availability",
    },
    {
      name: "Audit & rescue",
      price: "$600",
      blurb:
        "A focused review of an existing Flutter/Laravel codebase — architecture, performance, and a prioritized fix plan.",
      features: [
        "Full codebase review",
        "Written findings report",
        "Prioritized remediation plan",
        "Follow-up call included",
      ],
      cta: "Book an audit",
    },
  ],
  note:
    "Every engagement starts with a free scoping call. Figures above are typical starting points — you'll always get a fixed quote before any work begins.",
};

export const defaultSocials: SocialsContent = {
  github: "https://github.com/ArmanAbir2000",
  facebook: "https://www.facebook.com/armanabir0124",
  email: "armanabir0124@gmail.com",
  resume: "",
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

const urlOrEmpty = (v: unknown): string =>
  typeof v === "string" ? v.trim() : "";

export function asSocials(d: unknown): SocialsContent | null {
  if (!d || typeof d !== "object") return null;
  const o = d as Record<string, unknown>;
  // Empty strings are allowed — an empty field simply hides the icon.
  return {
    github: urlOrEmpty(o.github),
    facebook: urlOrEmpty(o.facebook),
    email: urlOrEmpty(o.email),
    resume: urlOrEmpty(o.resume),
  };
}

export function asAbout(d: unknown): AboutContent | null {
  if (!d || typeof d !== "object") return null;
  const o = d as Record<string, unknown>;
  if (typeof o.body !== "string" || !o.body.trim()) return null;
  return {
    heading:
      typeof o.heading === "string" && o.heading.trim()
        ? o.heading.trim()
        : defaultAbout.heading,
    body: o.body,
    photoUrl: typeof o.photoUrl === "string" ? o.photoUrl.trim() : "",
  };
}

export function asPricing(d: unknown): PricingContent | null {
  if (!d || typeof d !== "object") return null;
  const o = d as Record<string, unknown>;
  if (!Array.isArray(o.plans)) return null;
  const plans = o.plans
    .filter(
      (x): x is PricingPlan =>
        !!x &&
        typeof x === "object" &&
        typeof x.name === "string" &&
        typeof x.price === "string" &&
        Array.isArray(x.features),
    )
    .map((p) => ({
      name: p.name.trim(),
      price: p.price.trim(),
      blurb: typeof p.blurb === "string" ? p.blurb.trim() : "",
      features: p.features
        .filter((f): f is string => typeof f === "string" && f.trim().length > 0)
        .map((f) => f.trim()),
      cta: typeof p.cta === "string" ? p.cta.trim() : "",
    }));
  if (plans.length === 0) return null;
  return {
    plans,
    note: typeof o.note === "string" ? o.note.trim() : "",
  };
}

export function asExperience(d: unknown): ExperienceItem[] | null {
  if (!Array.isArray(d)) return null;
  const items = d
    .filter(
      (x): x is ExperienceItem =>
        !!x &&
        typeof x === "object" &&
        typeof (x as ExperienceItem).period === "string" &&
        typeof (x as ExperienceItem).title === "string" &&
        typeof (x as ExperienceItem).org === "string" &&
        typeof (x as ExperienceItem).summary === "string",
    )
    .map((e) => ({
      period: e.period.trim(),
      title: e.title.trim(),
      org: e.org.trim(),
      summary: e.summary.trim(),
      current: e.current === true,
    }));
  return items.length > 0 ? items : null;
}

export function asTestimonials(d: unknown): Testimonial[] | null {
  if (!Array.isArray(d)) return null;
  const items = d
    .filter(
      (x): x is Testimonial =>
        !!x &&
        typeof x === "object" &&
        typeof (x as Testimonial).quote === "string" &&
        (x as Testimonial).quote.trim().length > 0 &&
        typeof (x as Testimonial).company === "string",
    )
    .map((t) => ({
      quote: t.quote,
      name: typeof t.name === "string" ? t.name.trim() : "",
      role: typeof t.role === "string" ? t.role.trim() : "",
      company: t.company.trim(),
      slug:
        typeof t.slug === "string" && t.slug.trim()
          ? t.slug.trim()
          : undefined,
    }));
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
