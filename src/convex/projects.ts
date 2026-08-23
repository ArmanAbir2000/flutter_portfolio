import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const defaultScope = [
  { text: "Summarize what the project is about", done: true },
  { text: "Define who it is for (just me)", done: true },
  { text: "Keep everything else out of version 1", done: true },
  { text: "Minimalism theme: clean, spacious, legible", done: true },
];

const seedMutation = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const existing = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return existing._id;

    return ctx.db.insert("projects", {
      userId,
      name: "Project Brief",
      summary:
        "A private workspace that answers one question: what is this project about? It holds a single living summary — the purpose, the tech stack, the scope of version 1, and who it is for — so the answer is always written down instead of kept in your head.",
      audience: "Just me. No teams, no sharing, no roles in version 1.",
      scope: defaultScope,
    });
  },
});

export const getMyProject = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const ensureMyProject = seedMutation;

export const updateMyProject = mutation({
  args: {
    name: v.string(),
    summary: v.string(),
    audience: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const project = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!project) throw new Error("Project not found");

    await ctx.db.patch(project._id, {
      name: args.name.trim() || "Project Brief",
      summary: args.summary.trim(),
      audience: args.audience.trim(),
    });
  },
});

export const toggleScopeItem = mutation({
  args: {
    index: v.number(),
    done: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const project = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!project || args.index < 0 || args.index >= project.scope.length) {
      throw new Error("Scope item not found");
    }

    const scope = project.scope.map((item, i) =>
      i === args.index ? { ...item, done: args.done } : item,
    );
    await ctx.db.patch(project._id, { scope });
  },
});
