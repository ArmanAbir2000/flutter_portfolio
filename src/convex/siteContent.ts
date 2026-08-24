import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwner } from "./owner";

/** Public read of every stored landing-page section. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("siteContent").collect();
  },
});

/** Owner-only write of one section's payload. */
export const update = mutation({
  args: {
    key: v.string(),
    data: v.any(),
  },
  handler: async (ctx, { key, data }) => {
    await requireOwner(ctx);

    const existing = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { data });
    } else {
      await ctx.db.insert("siteContent", { key, data });
    }
  },
});
