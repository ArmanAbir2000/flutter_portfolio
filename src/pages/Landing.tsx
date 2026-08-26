import { useEffect, useRef, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ContributionMap } from "@/components/contribution-map";
import { CountUp, Marquee, MaskText, Reveal } from "@/components/motion-primitives";
import { EASE, fadeUp } from "@/lib/motion";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  useDocumentMeta,
} from "@/lib/seo";
import {
  CONTENT_KEYS,
  asAbout,
  asCapabilities,
  asExperience,
  asHero,
  asInProgress,
  asPricing,
  asSkills,
  asSocials,
  asTestimonials,
  defaultAbout,
  defaultCapabilities,
  defaultExperience,
  defaultHero,
  defaultInProgress,
  defaultPricing,
  defaultSkills,
  defaultSocials,
  defaultTestimonials,
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
  useDocumentMeta({ title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION });

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
  const socials =
    asSocials(
      contentRows?.find((r) => r.key === CONTENT_KEYS.socials)?.data,
    ) ?? defaultSocials;
  const about = pick(contentRows, CONTENT_KEYS.about, defaultAbout, asAbout);
  const pricing = pick(
    contentRows,
    CONTENT_KEYS.pricing,
    defaultPricing,
    asPricing,
  );
  const posts = useQuery(api.siteContent.listPosts, {});
  const experience = pick(
    contentRows,
    CONTENT_KEYS.experience,
    defaultExperience,
    asExperience,
  );
  const testimonials = pick(
    contentRows,
    CONTENT_KEYS.testimonials,
    defaultTestimonials,
    asTestimonials,
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
          {socials.resume && (
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="cursor-pointer text-muted-foreground transition-transform hover:text-foreground active:scale-[0.97]"
            >
              <a href={socials.resume} target="_blank" rel="noreferrer noopener">
                <Download className="size-4" />
                Résumé
              </a>
            </Button>
          )}
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

      {/* About */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Reveal as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            About
          </Reveal>
          <div
            className={
              "mt-10 " +
              (about.photoUrl ? "grid gap-12 lg:grid-cols-[1fr_20rem]" : "max-w-2xl")
            }
          >
            <motion.div {...fadeUp}>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {about.heading}
              </h2>
              {about.body.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="mt-4 text-sm leading-7 text-muted-foreground">
                  {para.trim()}
                </p>
              ))}
            </motion.div>
            {about.photoUrl && (
              <motion.img
                src={about.photoUrl}
                alt="Arman Abir"
                loading="lazy"
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="aspect-[4/5] w-full max-w-xs justify-self-start rounded-xl border border-border/60 object-cover lg:justify-self-end"
              />
            )}
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

      {/* Experience */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Reveal as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Experience
          </Reveal>
          <div className="mt-10">
            {experience.map((e, i) => (
              <motion.div
                key={(e.org || "role") + i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: Math.min(i * 0.06, 0.18) }}
                className="grid gap-2 border-t border-border/60 py-7 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-10"
              >
                <span className="pt-1 font-mono text-xs tabular-nums text-muted-foreground">
                  {e.period}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="text-base font-semibold tracking-tight">
                      {e.title}
                    </h3>
                    {e.current && (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{e.org}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {e.summary}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flutter Insights */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Reveal as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Flutter Insights
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* Card 1: Why Flutter */}
            <motion.div
              {...fadeUp}
              className="group rounded-lg border border-border/60 p-7"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                01
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                Why Flutter?
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  Flutter doesn't just share code across platforms — it shares the <em>rendering engine</em>. Every pixel is drawn by Skia/Impeller, not delegated to native widgets. That means a button looks identical on a Pixel 9, an iPhone 16, and a Chrome tab.
                </p>
                <p>
                  In 2025, <strong className="text-foreground">68.8% of developers chose Flutter</strong> as their preferred cross-platform SDK (Stack Overflow Developer Survey). Google, BMW, Toyota, Nubank (90M+ users), and Alibaba ship production Flutter apps — not prototypes, not side projects.
                </p>
                <p>
                  The real unlock is <strong className="text-foreground">Impeller</strong> — Flutter's new rendering backend. It eliminates shader-compilation jank entirely. First-frame times dropped 50%+ on iOS, and the memory footprint shrank. Scroll animations that used to stutter on mid-range Androids now hit a locked 60fps.
                </p>
                <p>
                  And with <strong className="text-foreground">Dart 3.12</strong> bringing pattern matching, records, and sealed classes, the language itself has caught up with modern expectations. Null-safety was the floor; exhaustive switch expressions are the ceiling.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {"Impeller · Dart 3 · Single Codebase · 68.8% Developer Preference".split(" · ").map((t) => (
                  <span key={t} className="rounded-md border border-border/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Card 2: Mobile to Web to Desktop */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
              className="group rounded-lg border border-border/60 p-7"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                02
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                One codebase, every screen
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  Flutter started as a mobile framework. In 2026 it's a <strong className="text-foreground">full-stack UI toolkit</strong>. The same Dart codebase compiles to iOS, Android, web (via WASM), Windows, macOS, and Linux — with native binary output, not a webview wrapper.
                </p>
                <p>
                  Flutter Web now compiles Dart directly to <strong className="text-foreground">WebAssembly</strong>. Near-native execution speeds in Chrome and Edge. The WASM renderer delivers 60fps animations on complex dashboards — a leap from the CanvasKit days.
                </p>
                <p>
                  Desktop support has matured too. Windows apps use Win32 and UWP APIs natively. macOS apps get Apple Silicon optimization and menu-bar integration. Linux support includes GTK compatibility. The <strong className="text-foreground">widget tree adapts automatically</strong> — a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LayoutBuilder</code> that returns a phone UI on a 6" screen returns a sidebar layout on a 27" monitor.
                </p>
                <p>
                  This isn't "responsive web" bolted on. It's a rendering engine that targets each platform's compositor directly, with platform channels for native API access when you need it.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {"WASM · Native Binaries · Platform Channels · Adaptive Layouts".split(" · ").map((t) => (
                  <span key={t} className="rounded-md border border-border/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Card 3: Flutter vs React Native — a practitioner's take */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.16 }}
              className="group rounded-lg border border-border/60 p-7"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                03
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                Flutter vs React Native — the honest take
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  React Native is great if your team already knows React and you need to hit existing native modules fast. But the comparison isn't apples-to-apples.
                </p>
                <p>
                  RN bridges JavaScript to native widgets through a serialization layer. Every UI update crosses the bridge. Flutter paints pixels directly — <strong className="text-foreground">no bridge, no serialization tax</strong>. On benchmark suites, Flutter consistently outperforms RN in frame consistency and memory usage.
                </p>
                <p>
                  The <strong className="text-foreground">widget-based architecture</strong> also plays better with AI-assisted development. Tools can "see" the UI as a structured tree of composable widgets. Fullestop's 2026 benchmarks show Flutter's widget model enables AI UI generation with 40% fewer iteration cycles compared to RN's component model.
                </p>
                <p>
                  Where RN wins: the JavaScript ecosystem is massive, and Expo's tooling is excellent. But Flutter's ecosystem has caught up — <strong className="text-foreground">46% of cross-platform developers use Flutter</strong> (2023 developer survey, confirmed trending upward), and packages like Riverpod, GoRouter, and Flame cover the full stack.
                </p>
                <p>
                  The bottom line: choose Flutter when design consistency, animation fidelity, and multi-platform reach matter more than JavaScript ecosystem breadth.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {"Zero-Bridge · Pixel-Perfect · AI-Friendly · 46% Market Share".split(" · ").map((t) => (
                  <span key={t} className="rounded-md border border-border/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Reveal className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Ways to work together
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricing.plans.map((plan, i) => (
              <motion.div
                key={(plan.name || "plan") + i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: Math.min(i * 0.08, 0.24) }}
                className="flex flex-col rounded-lg border border-border/60 p-7"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">{plan.name}</h3>
                  <span className="font-mono text-sm tabular-nums">{plan.price}</span>
                </div>
                {plan.blurb && (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {plan.blurb}
                  </p>
                )}
                {plan.features.length > 0 && (
                  <ul className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                        <span aria-hidden className="mt-[11px] size-1 shrink-0 rounded-full bg-foreground/50" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-6 w-fit cursor-pointer transition-transform active:scale-[0.97]"
                >
                  <Link to="/book">
                    {plan.cta || "Get in touch"}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
          {pricing.note && (
            <Reveal as="p" delay={0.15} className="mt-8 max-w-2xl text-xs leading-5 text-muted-foreground">
              {pricing.note}
            </Reveal>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Reveal as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What clients say
          </Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={(t.company || "quote") + i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: Math.min(i * 0.08, 0.24) }}
                className="border-t border-border pt-8"
              >
                <blockquote className="text-[15px] leading-7 tracking-tight">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5">
                  {t.name && (
                    <p className="text-sm font-medium tracking-tight">{t.name}</p>
                  )}
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </p>
                  {t.slug && (
                    <Link
                      to={"/projects/" + t.slug}
                      className="group mt-3 inline-flex cursor-pointer items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      View case study
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Writing */}
      {posts !== undefined && posts.length > 0 && (
        <section className="border-t border-border/60">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
            <Reveal as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Writing
            </Reveal>
            <div className="mt-10 max-w-3xl">
              {posts.slice(0, 3).map((post, i) => (
                <motion.div
                  key={post._id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: Math.min(i * 0.06, 0.18) }}
                  className="border-t border-border/60 py-5 first:border-t-0 first:pt-0"
                >
                  <Link
                    to={"/blog/" + post.slug}
                    className="group flex cursor-pointer flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="flex min-w-0 items-baseline gap-4">
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {post.publishedAt}
                      </span>
                      <span className="truncate text-sm font-medium tracking-tight group-hover:text-muted-foreground">
                        {post.title}
                      </span>
                    </span>
                    <ArrowUpRight className="hidden size-3.5 shrink-0 self-center text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground sm:block" />
                  </Link>
                </motion.div>
              ))}
              <Link
                to="/blog"
                className="link-sweep mt-6 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                All writing
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

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
