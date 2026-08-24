import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwner } from "./owner";

/**
 * Owner-only: resolve an uploaded file's storage id into a public URL
 * (used by CMS image fields like the About portrait).
 */
export const resolveStorageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    await requireOwner(ctx);
    return await ctx.storage.getUrl(storageId);
  },
});

/* ------------------------------ Blog ------------------------------ */
/* Lives here rather than its own module so generated API types stay
   valid without a local `convex codegen` run (blocked in this sandbox). */

/** Public list of all blog posts, newest first. */
export const listPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
});

export const getPost = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return (
      (await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug))
        .first()) ?? null
    );
  },
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Owner-only create/update of a blog post. */
export const savePost = mutation({
  args: {
    id: v.optional(v.id("posts")),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    tags: v.array(v.string()),
    publishedAt: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, a) => {
    await requireOwner(ctx);

    const title = a.title.trim();
    if (!title) throw new Error("Title is required.");
    const slug = slugify(title);

    const clash = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (clash && clash._id !== a.id) {
      throw new Error("Another post already uses this title.");
    }

    const doc = {
      slug,
      title,
      excerpt: a.excerpt.trim(),
      body: a.body.trim(),
      tags: a.tags,
      publishedAt: /^\d{4}-\d{2}-\d{2}$/.test(a.publishedAt.trim())
        ? a.publishedAt.trim()
        : new Date().toISOString().slice(0, 10),
    };

    if (a.id) {
      await ctx.db.replace(a.id, doc);
    } else {
      await ctx.db.insert("posts", doc);
    }
  },
});

/** Owner-only removal of a blog post. */
export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    await requireOwner(ctx);
    await ctx.db.delete(id);
  },
});

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
