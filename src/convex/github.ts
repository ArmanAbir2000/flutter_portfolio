"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const GITHUB_API = "https://api.github.com";
const STALE_MS = 6 * 60 * 60 * 1000;

type CalendarDay = { date: string; contributionCount: number };

async function ghRest<T>(token: string, path: string): Promise<T> {
  const res = await fetch(GITHUB_API + path, {
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) {
    throw new Error("GitHub REST request failed (" + res.status + ") for " + path);
  }
  return (await res.json()) as T;
}

export const refresh = action({
  args: { force: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not configured on the deployment.");

    // Skip work when we already have fresh data (unless forced).
    const cached = await ctx.runQuery(api.githubStore.getCache, {});
    if (!args.force && cached && Date.now() - cached.fetchedAt < STALE_MS) return;

    // 1. Identify the account behind the token.
    const me = await ghRest<{ login: string }>(token, "/user");
    const login = me.login;

    // 2. Real contribution calendar + repos contributed to (public only).
    const gqlRes = await fetch(GITHUB_API + "/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($login: String!) {
            user(login: $login) {
              createdAt
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
              repositoriesContributedTo(first: 30, includeUserRepositories: false) {
                totalCount
                nodes {
                  nameWithOwner
                  isPrivate
                }
              }
            }
          }
        `,
        variables: { login },
      }),
    });
    if (!gqlRes.ok) throw new Error("GitHub GraphQL request failed (" + gqlRes.status + ").");
    const gqlJson = (await gqlRes.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions: number;
              weeks: { contributionDays: CalendarDay[] }[];
            };
          };
          createdAt?: string;
          repositoriesContributedTo?: {
            totalCount: number;
            nodes: { nameWithOwner: string; isPrivate: boolean }[] | null;
          };
        };
      };
      errors?: { message: string }[];
    };
    if (gqlJson.errors?.length) {
      throw new Error("GitHub GraphQL error: " + gqlJson.errors[0].message);
    }

    const collection = gqlJson.data?.user?.contributionsCollection;
    if (!collection?.contributionCalendar) {
      throw new Error("GitHub GraphQL returned no contribution calendar.");
    }

    const days: { date: string; count: number }[] = [];
    for (const week of collection.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        days.push({ date: day.date, count: day.contributionCount });
      }
    }

    const user = gqlJson.data?.user;
    const contributed = user?.repositoriesContributedTo;

    const contributedNodes: { nameWithOwner: string; isPrivate: boolean }[] =
      contributed?.nodes ?? [];
    const contributedTo: string[] = Array.from(
      new Set(
        contributedNodes
          .filter((node) => !node.isPrivate) // never expose private repos publicly
          .map((node) => node.nameWithOwner),
      ),
    );

    // 3. Own repositories — public, non-fork only.
    const repos = await ghRest<
      { name: string; private: boolean; fork: boolean }[]
    >(token, "/user/repos?sort=pushed&per_page=100&affiliation=owner");
    const topRepos = repos
      .filter((repo) => !repo.private && !repo.fork)
      .slice(0, 12)
      .map((repo) => repo.name);

    const meFull = await ghRest<{ login: string; public_repos: number }>(
      token,
      "/user",
    );

    await ctx.runMutation(api.githubStore.saveCache, {
      username: login,
      totalContributions: collection.contributionCalendar.totalContributions,
      days,
      contributedTo,
      contributedToTotal: contributed?.totalCount ?? contributedTo.length,
      topRepos,
      publicRepos: meFull.public_repos,
      memberSince: user?.createdAt ?? new Date().toISOString(),
    });
  },
});
