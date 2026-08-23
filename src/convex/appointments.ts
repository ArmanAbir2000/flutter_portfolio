import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createAppointment = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    topic: v.string(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.name.trim() || !args.email.includes("@")) {
      throw new Error("Please provide a valid name and email address.");
    }
    await ctx.db.insert("appointments", {
      name: args.name.trim(),
      email: args.email.trim(),
      topic: args.topic.trim(),
      date: args.date,
      time: args.time,
      status: "pending",
    });
  },
});

export const listAppointments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return ctx.db.query("appointments").order("desc").collect();
  },
});

export const setAppointmentStatus = mutation({
  args: {
    id: v.id("appointments"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("done"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, { status: args.status });
  },
});
