import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const seedProjects = [
  {
    slug: "parcelfly-delivery-platform",
    title: "ParcelFly — Delivery Management Platform",
    summary:
      "A delivery ecosystem of Flutter apps for customers, merchants, and couriers, running on a Laravel REST API with live shipment tracking.",
    description:
      "ParcelFly connects three sides of last-mile delivery through dedicated mobile apps sharing one Dart codebase foundation. Customers place and track deliveries, merchants manage pickups and pricing, and couriers work a task-focused queue. A Laravel RESTful API handles orders, assignment, and status transitions, while Firebase Cloud Messaging keeps every role updated in real time.",
    category: "Logistics",
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
    featured: true,
  },
  {
    slug: "jobnect-recruitment-suite",
    title: "JobNect — Recruitment Suite",
    summary:
      "Paired job-listing apps for employers and applicants, backed by a Laravel API handling listings, applications, and matching.",
    description:
      "JobNect splits recruitment into two focused Flutter experiences: employers post openings and screen applicants, while candidates browse, filter, and apply. Both apps talk to the same Laravel RESTful backend, which owns listing lifecycles, application states, and notifications — keeping business rules out of the clients entirely.",
    category: "HR Tech",
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
    featured: true,
  },
  {
    slug: "sellino-ecommerce",
    title: "Sellino — E-commerce Platform",
    summary:
      "An e-commerce build pairing a web storefront with Flutter customer apps on top of a Laravel commerce API.",
    description:
      "Sellino covers catalogs, carts, checkout, and order tracking across web and mobile. The Laravel backend exposes a versioned RESTful commerce API consumed by both the storefront and the Flutter app, so inventory and promotions stay consistent no matter where customers shop.",
    category: "E-commerce",
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
    featured: true,
  },
  {
    slug: "subsify-subscriptions",
    title: "Subsify — Subscription Manager",
    summary:
      "A Flutter app for tracking recurring subscriptions, with reminders and spend insights synced through a Laravel backend.",
    description:
      "Subsify helps users see every recurring charge in one place. The Flutter client handles local-first entry with background sync to a Laravel API, schedules renewal reminders through Firebase, and surfaces simple monthly spend breakdowns without drowning users in settings.",
    category: "Personal Finance",
    tags: ["Flutter", "Firebase", "Subscriptions"],
    stack: ["Flutter", "Dart", "Laravel", "Firebase", "Riverpod"],
    highlights: [
      "Local-first data model with background Laravel sync",
      "Renewal reminders driven by scheduled Firebase functions",
      "Spend summaries computed on-device for instant response",
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
    tags: ["Flutter", "Design System", "Open Source Soon"],
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
  {
    slug: "lan-party",
    title: "Lan Party — Open Source",
    summary:
      "Arman Abir's public open-source repository on GitHub — the studio's home for experiments and released tooling.",
    description:
      "This is the studio's public GitHub repository. It's where experiments, utilities, and tooling get released when they're ready for others to use. Browse the source directly on GitHub to see current work in the open.",
    category: "Open Source",
    tags: ["Open Source", "GitHub"],
    stack: ["Dart", "Flutter"],
    highlights: [
      "Public source available under github.com/ArmanAbir2000/lan-party",
      "Release surface for studio experiments and utilities",
    ],
    liveUrl: undefined,
    repoUrl: "https://github.com/ArmanAbir2000/lan-party",
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
