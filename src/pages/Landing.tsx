import { useEffect, useRef, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ContributionMap } from "@/components/contribution-map";
import { CountUp, Marquee, MaskText, Reveal } from "@/components/motion-primitives";
import { EASE, fadeUp } from "@/lib/motion";
import {
  CONTENT_KEYS,
  asCapabilities,
  asHero,
  asInProgress,
  asSkills,
  defaultCapabilities,
  defaultHero,
  defaultInProgress,
  defaultSkills,
  type ActiveItem,
} from "@/lib/content";

type ContentRow = { key: string; data: unknown };

function pick<T>(
  rows: ContentRow[] | undefined,
  key: string,
  fallback: T,
  guard: (d: unknown) => T | null,
): T {
  const raw = rows?.find((r) => r.key === key)?.data;
  return (raw !== undefined ? guard(raw) : null) ?? fallback;
}

function ActiveProjectRow({ project }: { project: ActiveItem }) {
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium tracking-tight">{project.name}</p>
        <ArrowUpRight
          className={
            "size-3.5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 " +
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
  const contentRows = useQuery(api.siteContent.list, {}) as
    | ContentRow[]
    | undefined;
  const githubCache = useQuery(api.githubStore.getCache, {});
  const refreshGithub = useAction(api.github.refresh);
  const refreshingGithub = useRef(false);
  const [githubFailed, setGithubFailed] = useState(false);

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
      .catch((err) => {
        console.error(err);
        // Stop showing a spinner forever when the token/action is unavailable;
        // the map below already falls back to demo data.
        setGithubFailed(true);
      })
      .finally(() => {
        refreshingGithub.current = false;
      });
  }, [githubCache, refreshGithub]);

  const featured = (projects ?? []).filter((p) => p.featured).slice(0, 4);

  // CMS-backed sections with graceful fallback to defaults.
  const hero = pick(contentRows, CONTENT_KEYS.hero, defaultHero, asHero);
  const skills = pick(
    contentRows,
    CONTENT_KEYS.skills,
    defaultSkills,
    asSkills,
  );
  const capabilities = pick(
    contentRows,
    CONTENT_KEYS.capabilities,
    defaultCapabilities,
    asCapabilities,
  );
  const inProgress = pick(
    contentRows,
    CONTENT_KEYS.inProgress,
    defaultInProgress,
    asInProgress,
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16 sm:pt-40 sm:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
          className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="relative flex size-2 shrink-0">
            <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-emerald-500/60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Shiki Code Studio · Flutter development · Available for projects
        </motion.p>
        <MaskText
          as="h1"
          text={hero.title}
          delay={0.15}
          className="mt-6 block max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="mt-6 max-w-xl text-base leading-7 text-muted-foreground"
        >
          {hero.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="group cursor-pointer transition-transform active:scale-[0.97]"
          >
            <Link to="/projects">
              View selected work
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="cursor-pointer transition-transform active:scale-[0.97]"
          >
            <Link to="/book">
              Book an appointment
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Stack marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="mt-16 border-y border-border/60 py-4 sm:mt-24"
        >
          <Marquee
            duration={36}
            items={skills.map((s) => (
              <span
                key={s}
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                {s}
              </span>
            ))}
          />
        </motion.div>
      </section>

      {/* Featured work */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Reveal className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Selected work
            </h2>
            <Link
              to="/projects"
              className="link-sweep cursor-pointer text-sm text-muted-foreground hover:text-foreground"
            >
              All projects →
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-2">
            {projects === undefined
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-background p-8">
                    <div className="h-3 w-10 animate-pulse rounded bg-muted" />
                    <div className="mt-6 h-5 w-40 animate-pulse rounded bg-muted" />
                    <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                ))
              : featured.map((p, i) => (
              <motion.div key={p._id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
                <Link
                  to={"/projects/" + p.slug}
                  className="group flex h-full cursor-pointer flex-col bg-background p-8 transition-all duration-300 hover:bg-muted/50"
                >
                  {p.cover && (
                    <img
                      src={p.cover}
                      alt=""
                      loading="lazy"
                      className="mb-6 aspect-video w-full rounded-lg border border-border/50 object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {p.year}
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
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
          <Reveal as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What I do
          </Reveal>
          <div className="mt-10">
            {capabilities.map((c, i) => (
              <motion.div key={c.title + i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
                <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 py-10 sm:grid-cols-[4rem_16rem_1fr] sm:items-baseline">
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
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
          <Reveal as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            In progress right now
          </Reveal>
          <div className="mt-10 grid gap-x-20 gap-y-12 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
                Client &amp; contract work
              </h2>
              <Separator className="mt-4" />
              {inProgress.client.map((p) => (
                <ActiveProjectRow key={p.name} project={p} />
              ))}
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}>
              <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
                Personal &amp; open source
              </h2>
              <Separator className="mt-4" />
              {inProgress.personal.map((p) => (
                <ActiveProjectRow key={p.name} project={p} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contributions */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <Reveal className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Contribution activity
            </h2>
            <span className="font-mono text-xs text-muted-foreground">last 52 weeks</span>
          </Reveal>
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
                    className="link-sweep cursor-pointer font-mono text-xs text-muted-foreground hover:text-foreground"
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
                <CountUp
                  value={s.value}
                  className="block font-mono text-3xl font-bold tabular-nums tracking-tight"
                />
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
            {!githubCache && !githubFailed && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
          <MaskText
            as="h2"
            text="Have a project in mind? Let's talk it through."
            className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl"
          />
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="max-w-xl text-sm leading-6 text-muted-foreground">
            Pick a slot on my calendar or send a short brief. I reply within one
            business day.
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }} className="pt-2">
            <Button
              asChild
              size="lg"
              className="group cursor-pointer transition-transform active:scale-[0.97]"
            >
              <Link to="/book">
                Book an appointment
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
