import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // add other tables here

    portfolioProjects: defineTable({
      slug: v.string(),
      title: v.string(),
      summary: v.string(),
      description: v.string(),
      category: v.string(),
      tags: v.array(v.string()),
      stack: v.array(v.string()),
      highlights: v.array(v.string()),
      liveUrl: v.optional(v.string()),
      repoUrl: v.optional(v.string()),
      year: v.number(),
      featured: v.boolean(),
      // App UI showcase. Stored as public file URLs from Convex storage.
      cover: v.optional(v.string()),
      shots: v.optional(v.array(v.string())),
    }).index("by_slug", ["slug"]),

    appointments: defineTable({
      name: v.string(),
      email: v.string(),
      topic: v.string(),
      date: v.string(), // YYYY-MM-DD
      time: v.string(), // HH:mm
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("done"),
      ),
    }),

    messages: defineTable({
      name: v.string(),
      email: v.string(),
      subject: v.string(),
      body: v.string(),
      handled: v.boolean(),
    }),

    // Editable landing-page sections (CMS). One row per section key:
    // "hero" | "skills" | "capabilities" | "inProgress" | "__seeded"
    siteContent: defineTable({
      key: v.string(),
      data: v.any(),
    }).index("by_key", ["key"]),

    // Cached GitHub data safe for public display (public repos only).
    githubCache: defineTable({
      username: v.string(),
      totalContributions: v.number(),
      days: v.array(v.object({ date: v.string(), count: v.number() })),
      contributedTo: v.array(v.string()),
      contributedToTotal: v.number(),
      topRepos: v.array(v.string()),
      publicRepos: v.number(),
      memberSince: v.string(),
      fetchedAt: v.number(),
    }),

    // tableName: defineTable({
    //   ...
    //   // table fields
    // }).index("by_field", ["field"])
  },
  {
    schemaValidation: false,
  },
);

export default schema;
