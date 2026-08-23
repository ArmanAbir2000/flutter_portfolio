import { useEffect, useRef } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ContributionMap } from "@/components/contribution-map";
import {
  currentClientWork,
  personalProjects,
  type ActiveProject,
} from "@/lib/profile";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const capabilities = [
  {
    n: "01",
    title: "Cross-platform apps",
    body: "Production Flutter apps for Android and iOS from a single Dart codebase — state managed with GetX, BLoC, or Riverpod as the project demands, never one-size-fits-all.",
  },
  {
    n: "02",
    title: "Backends & APIs",
    body: "RESTful APIs built on Laravel with clean resource architecture, plus Firebase for authentication, Cloud Messaging, and realtime features that keep clients in sync.",
  },
  {
    n: "03",
    title: "Studio-grade delivery",
    body: "Shiki Code Studio takes products from design to store release: clean architecture, honest estimates, and handover documentation your own team can own.",
  },
];

function ActiveProjectRow({ project }: { project: ActiveProject }) {
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium tracking-tight">{project.name}</p>
        <ArrowUpRight
          className={
            "size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 " +
            (project.slug ? "group-hover:text-foreground" : "opacity-0")
          }
        />
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {project.context}
      </p>
    </>
  );
  return project.slug ? (
    <Link
      to={"/projects/" + project.slug}
      className="group block cursor-pointer py-4"
    >
      {body}
    </Link>
  ) : (
    <div className="py-4">{body}</div>
  );
}

// Stats are computed from live GitHub data when the cache has loaded.
function buildStats(
  gh:
    | {
        totalContributions: number;
        contributedToTotal: number;
        memberSince: string;
      }
    | null
    | undefined,
) {
  if (
    !gh ||
    typeof gh.totalContributions !== "number" ||
    typeof gh.contributedToTotal !== "number" ||
    typeof gh.memberSince !== "string"
  ) {
    return [];
  }
  const sinceYear = new Date(gh.memberSince).getFullYear();
  return [
    {
      value:
        Math.round(gh.totalContributions / 100) * 100 + "+",
      label: "Contributions · last 12 months",
    },
    {
      value:
        gh.contributedToTotal > 0 ? gh.contributedToTotal + "+" : "—",
      label: "Client & team repositories",
    },
    {
      value:
        Math.max(1, new Date().getFullYear() - sinceYear) + " yr" +
        (Math.max(1, new Date().getFullYear() - sinceYear) === 1 ? "" : "s"),
      label: "Shipping on GitHub since " + sinceYear,
    },
  ];
}

export default function Landing() {
  const projects = useQuery(api.portfolio.listProjects, {});
  const ensureSeeded = useMutation(api.portfolio.ensureSeeded);
  const githubCache = useQuery(api.githubStore.getCache, {});
  const refreshGithub = useAction(api.github.refresh);
  const refreshingGithub = useRef(false);

  useEffect(() => {
    void ensureSeeded().catch((err) => console.error(err));
  }, [ensureSeeded]);

  // Fetch real GitHub data when missing or older than six hours.
  useEffect(() => {
    if (githubCache === undefined) return; // still loading
    const stale =
      !githubCache || Date.now() - githubCache.fetchedAt > 6 * 60 * 60 * 1000;
    if (!stale || refreshingGithub.current) return;
    refreshingGithub.current = true;
    refreshGithub({})
      .catch((err) => console.error(err))
      .finally(() => {
        refreshingGithub.current = false;
      });
  }, [githubCache, refreshGithub]);

  const featured = (projects ?? []).filter((p) => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 pb-24 sm:pt-40 sm:pb-32">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          Shiki Code Studio · Flutter development · Available for projects
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl"
        >
          Flutter apps with serious backbones.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-6 max-w-xl text-base leading-7 text-muted-foreground"
        >
          I&apos;m Arman Abir, founder of Shiki Code Studio. I build
          cross-platform apps in Flutter, backed by Laravel RESTful APIs and
          Firebase — with state management done right using GetX, BLoC, or
          Riverpod. Browse the work below, then book time directly on my
          calendar.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg" className="cursor-pointer">
            <Link to="/projects">
              View selected work
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="cursor-pointer">
            <Link to="/book">
              Book an appointment
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Featured work */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <motion.div {...fadeUp} className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Selected work
            </h2>
            <Link
              to="/projects"
              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
            >
              All projects →
            </Link>
          </motion.div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-2">
            {featured.map((p, i) => (
              <motion.div key={p._id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
                <Link
                  to={"/projects/" + p.slug}
                  className="group flex h-full cursor-pointer flex-col bg-background p-8 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {p.year}
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {p.summary}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-6">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="font-mono text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <motion.p {...fadeUp} className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What I do
          </motion.p>
          <div className="mt-10">
            {capabilities.map((c, i) => (
              <motion.div key={c.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
                <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 py-10 sm:grid-cols-[4rem_16rem_1fr] sm:items-baseline">
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">
                    {c.n}
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight">{c.title}</h2>
                  <p className="col-span-2 max-w-xl text-sm leading-6 text-muted-foreground sm:col-span-1">
                    {c.body}
                  </p>
                </div>
                {i < capabilities.length - 1 && <Separator />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Currently building */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <motion.p {...fadeUp} className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            In progress right now
          </motion.p>
          <div className="mt-10 grid gap-x-20 gap-y-12 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
                Client &amp; contract work
              </h2>
              <Separator className="mt-4" />
              {currentClientWork.map((p) => (
                <ActiveProjectRow key={p.name} project={p} />
              ))}
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}>
              <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
                Personal &amp; open source
              </h2>
              <Separator className="mt-4" />
              {personalProjects.map((p) => (
                <ActiveProjectRow key={p.name} project={p} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contributions */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <motion.div {...fadeUp} className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Contribution activity
            </h2>
            <span className="font-mono text-xs text-muted-foreground">last 52 weeks</span>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="mt-8 rounded-lg border border-border/60 p-4 sm:p-6">
            <ContributionMap
              data={
                githubCache
                  ? {
                      total: githubCache.totalContributions,
                      days: githubCache.days,
                    }
                  : undefined
              }
            />
          </motion.div>
          {githubCache && githubCache.contributedTo.length > 0 && (
            <motion.div {...fadeUp} className="mt-10">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Public repositories recently contributed to
              </h3>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {githubCache.contributedTo.map((repo) => (
                  <a
                    key={repo}
                    href={"https://github.com/" + repo}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer font-mono text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    {repo}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
          <motion.div {...fadeUp} className="mt-14 grid gap-10 sm:grid-cols-3">
            {buildStats(githubCache).map((s) => (
              <div key={s.label}>
                <p className="font-mono text-3xl font-bold tabular-nums tracking-tight">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
            {!githubCache && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
          <motion.h2 {...fadeUp} className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Have a project in mind? Let's talk it through.
          </motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="max-w-xl text-sm leading-6 text-muted-foreground">
            Pick a slot on my calendar or send a short brief. I reply within one
            business day.
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <Button asChild size="lg" className="cursor-pointer">
              <Link to="/book">
                Book an appointment
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
