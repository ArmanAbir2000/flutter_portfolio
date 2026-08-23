import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const seedProjects = [
  {
    slug: "orimono-app",
    title: "Orimono",
    summary:
      "A personal Flutter application designed and built end to end, with Riverpod state management and a Firebase backend.",
    description:
      "Orimono is one of my own products — a full Flutter build covering everything from first wireframe to store release. The codebase follows a clean, feature-first structure with Riverpod for state management, Firebase handling authentication, data storage, and push messaging, and a reusable theming layer shared across screens.",
    category: "Personal Project",
    tags: ["Flutter", "Firebase", "Riverpod"],
    stack: ["Flutter", "Dart", "Riverpod", "Firebase", "FCM"],
    highlights: [
      "Single Dart codebase shipping to both Android and iOS",
      "Feature-first architecture with Riverpod providers per domain",
      "Firebase auth, Firestore data layer, and FCM notifications",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2025,
    featured: true,
  },
  {
    slug: "watch-store-app",
    title: "Watch Store",
    summary:
      "An e-commerce Flutter app for browsing and buying watches, with catalog search, cart, wishlist, and order tracking.",
    description:
      "Watch Store is a complete mobile shopping experience built in Flutter. Product listings load through a RESTful API into a BLoC-managed catalog with search and category filters, while the cart, wishlist, and checkout flows run through dedicated blocs. Order status updates arrive as push notifications so customers never wonder where their purchase is.",
    category: "E-commerce",
    tags: ["Flutter", "E-commerce", "BLoC"],
    stack: ["Flutter", "Dart", "BLoC", "REST API", "Firebase"],
    highlights: [
      "Catalog with search, filters, and product detail flows",
      "Cart, wishlist, and checkout orchestrated with BLoC",
      "Order tracking delivered through push notifications",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2025,
    featured: true,
  },
  {
    slug: "freeshop-app",
    title: "FreeShop",
    summary:
      "A lightweight marketplace-style shopping app in Flutter — listing feeds, categories, and saved items with snappy GetX state management.",
    description:
      "FreeShop focuses on speed and simplicity: an instantly scannable listing feed, clear category navigation, and saved-item functionality, all wired together with small, focused GetX controllers. The app talks to a RESTful backend and keeps local caching light so browsing feels immediate even on slow connections.",
    category: "Marketplace",
    tags: ["Flutter", "GetX", "Marketplace"],
    stack: ["Flutter", "Dart", "GetX", "REST API", "Firebase"],
    highlights: [
      "Listing feed and categories powered by focused GetX controllers",
      "Saved items and lightweight local caching for instant browsing",
      "Clean separation between UI, controllers, and API services",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2024,
    featured: true,
  },
  {
    slug: "job-app",
    title: "Job App",
    summary:
      "A Flutter client for finding and applying to jobs — filtered search, application tracking, and profile management.",
    description:
      "Job App puts a whole job hunt in one place. Candidates search listings with filters, apply directly from their phone, and follow every application's status from a simple tracker. Authentication and profile data are handled through Firebase, with listings served from a RESTful API and screen state managed cleanly in BLoC.",
    category: "HR Tech",
    tags: ["Flutter", "REST API", "BLoC"],
    stack: ["Flutter", "Dart", "BLoC", "REST API", "Firebase Auth"],
    highlights: [
      "Filtered job search with detailed listing views",
      "Application tracker showing status for every submission",
      "Profile and resume management backed by Firebase Auth",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2024,
    featured: true,
  },
  {
    slug: "shiki-ui-flutter-kit",
    title: "Shiki UI — Flutter Component Kit",
    summary:
      "The studio's in-house Flutter widget library: themed, form-ready components reused across every Shiki Code Studio project.",
    description:
      "Every studio project used to re-solve the same problems: themed inputs, list skeletons, empty states, API-bound dropdowns. Shiki UI packages those answers into one internal Flutter package with a shared design-token system, so new projects start consistent and stay maintainable as it evolves.",
    category: "In-house Tooling",
    tags: ["Flutter", "Design System"],
    stack: ["Flutter", "Dart", "Riverpod"],
    highlights: [
      "Shared design tokens keeping studio apps visually consistent",
      "Form and list components battle-tested across shipped apps",
      "Planned public extraction once APIs stabilize",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2025,
    featured: false,
  },
];

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("portfolioProjects").collect();
    return [...projects].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.year - a.year;
    });
  },
});

export const getProject = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("portfolioProjects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return project ?? null;
  },
});

export const ensureSeeded = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("portfolioProjects").collect();
    const bySlug = new Map(existing.map((p) => [p.slug, p]));
    const slugs = new Set(seedProjects.map((s) => s.slug));

    // Remove entries no longer part of the showcase.
    for (const project of existing) {
      if (!slugs.has(project.slug)) await ctx.db.delete(project._id);
    }

    // Insert missing entries and refresh ones whose content changed.
    for (const seed of seedProjects) {
      const current = bySlug.get(seed.slug);
      if (!current) {
        await ctx.db.insert("portfolioProjects", seed);
      } else if (
        current.title !== seed.title ||
        current.summary !== seed.summary ||
        current.description !== seed.description
      ) {
        await ctx.db.replace(current._id, seed);
      }
    }
  },
});
