import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CalendarClock, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { MaskText } from "@/components/motion-primitives";
import { EASE, fadeUp } from "@/lib/motion";

function NotFound() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-6 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Project not found
        </h1>
        <Button asChild variant="outline" className="mt-8 cursor-pointer">
          <Link to="/projects">
            <ArrowLeft className="size-4" />
            Back to all work
          </Link>
        </Button>
      </div>
    </main>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = useQuery(api.portfolio.getProject, slug ? { slug } : "skip");

  if (slug && project === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      {!project ? (
        <NotFound />
      ) : (
        <main className="flex-1">
          {/* Header */}
          <section className="mx-auto w-full max-w-6xl px-6 pt-16 sm:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Link
                to="/projects"
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                All work
              </Link>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {project.year}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    Featured
                  </span>
                )}
              </div>
              <MaskText
                as="h1"
                text={project.title}
                delay={0.1}
                className="mt-4 block max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
              />
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground"
              >
                {project.summary}
              </motion.p>

              {(project.liveUrl || project.repoUrl) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <Button asChild size="sm" className="cursor-pointer">
                      <a href={project.liveUrl} target="_blank" rel="noreferrer">
                        View live
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <a href={project.repoUrl} target="_blank" rel="noreferrer">
                        Source code
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </section>

          {/* App UI showcase — cover hero + phone-height screenshot strip */}
          {(project.cover || (project.shots?.length ?? 0) > 0) && (
            <section className="mx-auto w-full max-w-6xl px-6 pt-14">
              {project.cover && (
                <motion.img
                  src={project.cover}
                  alt={project.title + " — app UI cover"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="max-h-[480px] w-full rounded-xl border border-border/60 object-cover"
                  loading="lazy"
                />
              )}
              {(project.shots?.length ?? 0) > 0 && (
                <>
                  <h2 className="mt-14 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Screenshots
                  </h2>
                  <div className="-mx-6 mt-5 flex snap-x gap-4 overflow-x-auto px-6 pb-4">
                    {project.shots!.map((url, i) => (
                      <motion.img
                        key={url}
                        src={url}
                        alt={project.title + " screenshot " + (i + 1)}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: Math.min(i * 0.06, 0.3),
                          ease: EASE,
                        }}
                        className="h-[420px] w-auto shrink-0 snap-start rounded-xl border border-border/60 object-cover transition-transform duration-300 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* Body */}
          <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24">
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="grid gap-14 lg:grid-cols-[1fr_20rem] lg:gap-20"
            >
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Overview
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-7">
                  {project.description}
                </p>

                <Separator className="my-10" />

                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Key contributions &amp; outcomes
                </h2>
                <ul className="mt-4">
                  {project.highlights.map((h, i) => (
                    <li key={i}>
                      <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: Math.min(i * 0.06, 0.3) }}
                        className="flex gap-4 py-4"
                      >
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-sm leading-6">{h}</p>
                      </motion.div>
                      {i < project.highlights.length - 1 && <Separator />}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sidebar */}
              <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Stack
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Tags
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                    {project.tags.map((t) => (
                      <Link
                        key={t}
                        to={"/projects?tag=" + encodeURIComponent(t)}
                        className="cursor-pointer font-mono text-xs text-muted-foreground hover:text-foreground"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border/60 p-6">
                  <h2 className="text-sm font-semibold tracking-tight">
                    Want something like this?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Book an appointment and we can talk through your project in
                    the context of this build.
                  </p>
                  <Button asChild size="sm" className="mt-4 w-full cursor-pointer">
                    <Link to={"/book?project=" + encodeURIComponent(project.slug)}>
                      <CalendarClock className="size-3.5" />
                      Book an appointment
                    </Link>
                  </Button>
                </div>
              </aside>
            </motion.div>
          </section>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}
