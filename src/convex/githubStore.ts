import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCache = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("githubCache").first();
  },
});

export const saveCache = mutation({
  args: {
    username: v.string(),
    totalContributions: v.number(),
    days: v.array(v.object({ date: v.string(), count: v.number() })),
    contributedTo: v.array(v.string()),
    topRepos: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("githubCache").first();
    const payload = { ...args, fetchedAt: Date.now() };
    if (existing) {
      await ctx.db.replace(existing._id, payload);
    } else {
      await ctx.db.insert("githubCache", payload);
    }
  },
});
