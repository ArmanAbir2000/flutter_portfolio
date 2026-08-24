import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwner } from "./owner";

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
    slug: "parcelfly-delivery-platform",
    title: "ParcelFly — Delivery Management Platform",
    summary:
      "Client work: a delivery ecosystem of Flutter apps for customers, merchants, and couriers, running on a Laravel REST API with live shipment tracking.",
    description:
      "ParcelFly connects three sides of last-mile delivery through dedicated mobile apps sharing one Dart codebase foundation. Customers place and track deliveries, merchants manage pickups and pricing, and couriers work a task-focused queue. A Laravel RESTful API handles orders, assignment, and status transitions, while Firebase Cloud Messaging keeps every role updated in real time.",
    category: "Client Project",
    tags: ["Flutter", "Laravel", "Realtime Tracking"],
    stack: ["Flutter", "Dart", "Laravel", "MySQL", "Firebase", "FCM"],
    highlights: [
      "Three role-based apps delivered from one shared Flutter codebase",
      "Live courier tracking with map-based status updates end to end",
      "Push notification pipelines via Firebase Cloud Messaging",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2025,
    featured: false,
  },
  {
    slug: "jobnect-recruitment-suite",
    title: "JobNect — Recruitment Suite",
    summary:
      "Client work: paired job-listing apps for employers and applicants, backed by a Laravel API handling listings, applications, and matching.",
    description:
      "JobNect splits recruitment into two focused Flutter experiences: employers post openings and screen applicants, while candidates browse, filter, and apply. Both apps talk to the same Laravel RESTful backend, which owns listing lifecycles, application states, and notifications — keeping business rules out of the clients entirely.",
    category: "Client Project",
    tags: ["Flutter", "Laravel", "REST API"],
    stack: ["Flutter", "Dart", "Laravel", "MySQL", "GetX"],
    highlights: [
      "Employer and applicant apps sharing one consistent API contract",
      "Full listing-to-hire workflow mirrored across both clients",
      "State management split deliberately between GetX modules",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2025,
    featured: false,
  },
  {
    slug: "sellino-ecommerce",
    title: "Sellino — E-commerce Platform",
    summary:
      "Client work: an e-commerce build pairing a web storefront with Flutter customer apps on top of a Laravel commerce API.",
    description:
      "Sellino covers catalogs, carts, checkout, and order tracking across web and mobile. The Laravel backend exposes a versioned RESTful commerce API consumed by both the storefront and the Flutter app, so inventory and promotions stay consistent no matter where customers shop.",
    category: "Client Project",
    tags: ["E-commerce", "Flutter", "Laravel"],
    stack: ["Flutter", "Laravel", "MySQL", "REST API", "Firebase"],
    highlights: [
      "One commerce API serving both web storefront and mobile apps",
      "Cart and catalog state kept consistent across platforms",
      "Order tracking pushed to customers through FCM",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2024,
    featured: false,
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

/**
 * One-time bootstrap of the showcase. Guarded by a siteContent flag so
 * dashboard edits and deletions are never overwritten afterwards.
 */
export const ensureSeeded = mutation({
  args: {},
  handler: async (ctx) => {
    const flag = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", "__seeded"))
      .first();
    if (flag) return;

    const existing = await ctx.db.query("portfolioProjects").collect();
    const bySlug = new Map(existing.map((p) => [p.slug, p]));

    for (const seed of seedProjects) {
      if (!bySlug.has(seed.slug)) {
        await ctx.db.insert("portfolioProjects", seed);
      }
    }

    await ctx.db.insert("siteContent", {
      key: "__seeded",
      data: { at: Date.now() },
    });
  },
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Owner-only create/update of a showcase project. */
export const saveProject = mutation({
  args: {
    id: v.optional(v.id("portfolioProjects")),
    title: v.string(),
    summary: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    stack: v.array(v.string()),
    highlights: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    playUrl: v.optional(v.string()),
    appStoreUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    year: v.number(),
    featured: v.boolean(),
  },
  handler: async (ctx, a) => {
    await requireOwner(ctx);

    const title = a.title.trim();
    if (!title) throw new Error("Title is required.");
    const slug = slugify(title);

    const clash = await ctx.db
      .query("portfolioProjects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (clash && clash._id !== a.id) {
      throw new Error("Another project already uses this title.");
    }

    const doc = {
      slug,
      title,
      summary: a.summary.trim(),
      description: a.description.trim(),
      category: a.category.trim() || "Project",
      tags: a.tags,
      stack: a.stack,
      highlights: a.highlights,
      liveUrl: a.liveUrl?.trim() ? a.liveUrl.trim() : undefined,
      repoUrl: a.repoUrl?.trim() ? a.repoUrl.trim() : undefined,
      playUrl: a.playUrl?.trim() ? a.playUrl.trim() : undefined,
      appStoreUrl: a.appStoreUrl?.trim() ? a.appStoreUrl.trim() : undefined,
      videoUrl: a.videoUrl?.trim() ? a.videoUrl.trim() : undefined,
      year: a.year,
      featured: a.featured,
    };

    if (a.id) {
      // Carry over uploaded media — the form doesn't touch cover/shots and
      // replace() would otherwise wipe them on every text edit.
      const existing = await ctx.db.get(a.id);
      await ctx.db.replace(a.id, {
        ...doc,
        ...(existing?.cover ? { cover: existing.cover } : {}),
        ...(existing?.shots?.length ? { shots: existing.shots } : {}),
      });
    } else {
      await ctx.db.insert("portfolioProjects", doc);
    }
  },
});

/** Short-lived upload URL for owner file uploads (cover / screenshots). */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireOwner(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

/** Set (or clear with storageId omitted) a project's cover image. */
export const setCover = mutation({
  args: { id: v.id("portfolioProjects"), storageId: v.optional(v.id("_storage")) },
  handler: async (ctx, { id, storageId }) => {
    await requireOwner(ctx);
    if (!storageId) {
      await ctx.db.patch(id, { cover: undefined });
      return;
    }
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Upload not found.");
    await ctx.db.patch(id, { cover: url });
  },
});

/** Append an uploaded screenshot to a project's gallery. */
export const addShot = mutation({
  args: { id: v.id("portfolioProjects"), storageId: v.id("_storage") },
  handler: async (ctx, { id, storageId }) => {
    await requireOwner(ctx);
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Upload not found.");
    const project = await ctx.db.get(id);
    if (!project) throw new Error("Project not found.");
    const shots = [...(project.shots ?? []), url].slice(-12); // cap gallery size
    await ctx.db.patch(id, { shots });
  },
});

/** Remove one screenshot from a project's gallery. */
export const removeShot = mutation({
  args: { id: v.id("portfolioProjects"), url: v.string() },
  handler: async (ctx, { id, url }) => {
    await requireOwner(ctx);
    const project = await ctx.db.get(id);
    if (!project) return;
    await ctx.db.patch(id, {
      shots: (project.shots ?? []).filter((s) => s !== url),
    });
  },
});

/** Owner-only removal of a showcase project. */
export const deleteProject = mutation({
  args: { id: v.id("portfolioProjects") },
  handler: async (ctx, { id }) => {
    await requireOwner(ctx);
    await ctx.db.delete(id);
  },
});
