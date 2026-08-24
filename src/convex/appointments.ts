import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwner } from "./owner";

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
    await requireOwner(ctx);

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
    await requireOwner(ctx);

    await ctx.db.patch(args.id, { status: args.status });
  },
});
