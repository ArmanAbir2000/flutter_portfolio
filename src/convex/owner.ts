import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx } from "./_generated/server";

/**
 * Gate for the owner-only inbox (appointment requests + customer messages).
 *
 * Rules:
 *  1. Must be signed in at all.
 *  2. Anonymous/"Continue as Guest" sessions are always rejected.
 *  3. If OWNER_EMAIL is set on the deployment, only that exact email passes.
 *
 * Set OWNER_EMAIL (your sign-in email) in Settings -> Environment to fully
 * lock the inbox to you alone.
 */
export async function requireOwner(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");

  const user = await ctx.db.get(userId);
  if (!user || user.isAnonymous) {
    throw new Error("Owner access required.");
  }

  const ownerEmail = process.env.OWNER_EMAIL;
  if (ownerEmail && user.email?.toLowerCase() !== ownerEmail.toLowerCase()) {
    throw new Error("Owner access required.");
  }

  return user;
}
