import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const principles = [
  {
    n: "01",
    title: "One summary, written down",
    body: "Your project's purpose lives in a single, editable brief — not in your head or a forgotten doc.",
  },
  {
    n: "02",
    title: "Scope, made explicit",
    body: "Version 1 states what it does first and what it deliberately leaves out. Check items off as they ship.",
  },
  {
    n: "03",
    title: "Private by default",
    body: "Built for an audience of one. Sign in and it's yours — no teams, no sharing, no noise.",
  },
];

const stack = [
  "React 19",
  "TypeScript",
  "Convex",
  "Tailwind",
  "shadcn/ui",
  "Framer Motion",
];

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground"
    >
      {/* Navbar */}
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-foreground" />
            <span className="text-sm font-semibold tracking-tight">
              Brief
            </span>
          </Link>
          <Button asChild variant="outline" size="sm" className="cursor-pointer">
            <Link to={isLoading ? "/auth" : isAuthenticated ? "/dashboard" : "/auth"}>
              {isAuthenticated ? "Dashboard" : "Sign in"}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-28 pb-24 sm:pt-40 sm:pb-32">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          A private project brief
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
        >
          Know exactly what your project is about.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-6 max-w-xl text-base leading-7 text-muted-foreground"
        >
          Brief holds one living summary of your project — its purpose, stack,
          scope, and audience — in a quiet space built for a single reader:
          you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg" className="cursor-pointer">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              {isAuthenticated ? "Open your brief" : "Start your brief"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Version 1 · Just for you
          </p>
        </motion.div>
      </section>

      {/* Principles */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
          <motion.p {...fadeUp} className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What version 1 does
          </motion.p>
          <div className="mt-10">
            {principles.map((p, i) => (
              <motion.div key={p.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
                <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 py-10 sm:grid-cols-[4rem_16rem_1fr] sm:items-baseline">
                  <span className="text-sm font-medium text-muted-foreground tabular-nums">
                    {p.n}
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {p.title}
                  </h2>
                  <p className="col-span-2 max-w-lg text-sm leading-6 text-muted-foreground sm:col-span-1">
                    {p.body}
                  </p>
                </div>
                {i < principles.length - 1 && <Separator />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <motion.div {...fadeUp} className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Built with
            </span>
            {stack.map((s) => (
              <span key={s} className="text-sm text-muted-foreground">
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
          <motion.h2 {...fadeUp} className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Write it down once. Always know the answer.
          </motion.h2>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <Button asChild size="lg" variant="outline" className="cursor-pointer">
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                {isAuthenticated ? "Go to dashboard" : "Get started"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <span className="text-xs text-muted-foreground">
            Brief — version 1
          </span>
          <span className="text-xs text-muted-foreground">For an audience of one</span>
        </div>
      </footer>
    </motion.div>
  );
}
