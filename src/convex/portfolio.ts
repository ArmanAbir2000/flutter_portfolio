import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const seedProjects = [
  {
    slug: "realtime-analytics-dashboard",
    title: "Realtime Analytics Dashboard",
    summary:
      "A streaming analytics platform that ingests millions of events per day and renders live dashboards with sub-second latency.",
    description:
      "Built for a B2B SaaS client that had outgrown nightly batch reporting. The system consumes product events over a websocket pipeline, aggregates them into rolling windows, and pushes deltas straight to a React dashboard. I designed the ingestion layer, the windowed aggregation model, and the charting frontend, then led the migration from the legacy batch reports with zero downtime.",
    category: "Web Platform",
    tags: ["Realtime", "Data Viz", "B2B"],
    stack: ["TypeScript", "React", "Node.js", "WebSockets", "ClickHouse", "Redis"],
    highlights: [
      "Ingests 30M+ events daily with p99 ingest latency under 80 ms",
      "Cut customer-facing report lag from 24 hours to under one second",
      "Migrated 40+ enterprise tenants off the legacy batch pipeline",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2025,
    featured: true,
  },
  {
    slug: "payments-integration-platform",
    title: "Payments Integration Platform",
    summary:
      "A unified payments layer that lets merchants accept cards, wallets, and bank transfers through a single typed API.",
    description:
      "Merchants were integrating each payment provider separately and duplicating reconciliation logic every time. This platform abstracts providers behind one interface with idempotent checkout sessions, webhook normalization, and automatic retries. I owned the API design, the provider adapter architecture, and the reconciliation tooling used by the finance team.",
    category: "Fintech",
    tags: ["Payments", "APIs", "Infrastructure"],
    stack: ["TypeScript", "Node.js", "PostgreSQL", "Stripe", "Adyen", "Docker"],
    highlights: [
      "Reduced new-provider integration time from six weeks to five days",
      "Processes eight figures in annual volume with zero double-charges",
      "Normalized webhooks from four providers into one event schema",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2024,
    featured: true,
  },
  {
    slug: "headless-commerce-storefront",
    title: "Headless Commerce Storefront",
    summary:
      "A content-driven storefront that pairs a headless commerce backend with a fully custom Next.js front end.",
    description:
      "A design-led retail brand needed a storefront their in-house designers could control without filing engineering tickets. I built the storefront on a headless commerce API with edge-cached pages, optimistic cart updates, and a CMS-driven page builder so merchandising can compose landing pages themselves.",
    category: "E-commerce",
    tags: ["Storefront", "Performance", "CMS"],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GraphQL"],
    highlights: [
      "Lighthouse performance scores of 95+ across key templates",
      "Checkout conversion improved 18% after the relaunch",
      "Merchandisers ship campaign pages without engineering support",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2024,
    featured: true,
  },
  {
    slug: "devops-cli-toolkit",
    title: "DevOps CLI Toolkit",
    summary:
      "An open-source command-line toolkit that wraps environment management, deployments, and secrets rotation into one workflow.",
    description:
      "Internal teams kept writing one-off shell scripts for the same operational chores, so I consolidated them into a single, testable CLI. It manages environment promotion, rotates cloud secrets, and runs pre-deploy checks. The project is open source and is now used by several teams outside the original company.",
    category: "Developer Tools",
    tags: ["Open Source", "CLI", "Automation"],
    stack: ["Go", "GitHub Actions", "AWS", "Terraform"],
    highlights: [
      "1.2k+ GitHub stars and adopted by three external teams",
      "Replaced an estimated 200+ ad-hoc deployment scripts",
      "Fully tested core with cross-platform release automation",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2023,
    featured: true,
  },
  {
    slug: "ai-support-assistant",
    title: "AI Support Assistant",
    summary:
      "A retrieval-based support assistant that answers customer questions from product documentation and hands off gracefully to humans.",
    description:
      "The support team was drowning in repetitive questions. I built an assistant that embeds the documentation corpus, answers with citations, and escalates to a human agent whenever confidence drops below threshold. Every conversation is logged with feedback signals so the team can audit and improve answers over time.",
    category: "AI / ML",
    tags: ["AI", "Support", "RAG"],
    stack: ["Python", "FastAPI", "pgvector", "React", "OpenAI"],
    highlights: [
      "Deflected 46% of inbound support tickets within two months",
      "Every answer includes source citations for easy verification",
      "Confidence-based escalation keeps satisfaction ratings stable",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2025,
    featured: false,
  },
  {
    slug: "open-source-ui-library",
    title: "Open-Source UI Library",
    summary:
      "A headless, accessible React component library focused on keyboard navigation and theming without style lock-in.",
    description:
      "Most component libraries force a visual identity on teams that already have one. This library ships unstyled, behavior-complete primitives — comboboxes, dialogs, date pickers — with full ARIA coverage and a token-based theming contract. It powers production apps at several companies and accepts external contributions through a documented RFC process.",
    category: "Developer Tools",
    tags: ["Open Source", "Accessibility", "React"],
    stack: ["TypeScript", "React", "Vitest", "Storybook"],
    highlights: [
      "WCAG 2.1 AA compliant across all components",
      "Weekly downloads in the tens of thousands",
      "Maintained with an open RFC contribution process",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    year: 2022,
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
    const existing = await ctx.db.query("portfolioProjects").first();
    if (existing) return;

    for (const project of seedProjects) {
      await ctx.db.insert("portfolioProjects", project);
    }
  },
});
