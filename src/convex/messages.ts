import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwner } from "./owner";

export const sendMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.name.trim() || !args.email.includes("@") || !args.body.trim()) {
      throw new Error("Please fill in your name, a valid email, and a message.");
    }
    await ctx.db.insert("messages", {
      name: args.name.trim(),
      email: args.email.trim(),
      subject: args.subject.trim() || "(no subject)",
      body: args.body.trim(),
      handled: false,
    });
  },
});

export const listMessages = query({
  args: {},
  handler: async (ctx) => {
    await requireOwner(ctx);

    return ctx.db.query("messages").order("desc").collect();
  },
});

export const setHandled = mutation({
  args: {
    id: v.id("messages"),
    handled: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireOwner(ctx);

    await ctx.db.patch(args.id, { handled: args.handled });
  },
});
