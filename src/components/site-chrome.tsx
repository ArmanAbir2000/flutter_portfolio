import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  Facebook,
  Github,
  Mail,
} from "lucide-react";
import { Link, NavLink } from "react-router";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CONTENT_KEYS, asSocials, defaultSocials } from "@/lib/content";
import { EASE } from "@/lib/motion";

const links = [
  { to: "/projects", label: "Work" },
  { to: "/book", label: "Book" },
  { to: "/contact", label: "Contact" },
];

const socialIcons = [
  { key: "github", label: "GitHub", build: (url: string) => url, Icon: Github },
  {
    key: "facebook",
    label: "Facebook",
    build: (url: string) => url,
    Icon: Facebook,
  },
  {
    key: "email",
    label: "Email",
    build: (url: string) =>
      url.startsWith("mailto:") ? url : "mailto:" + url,
    Icon: Mail,
  },
] as const;

/** Thin reading-progress bar that tracks page scroll. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-foreground/60"
    />
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={
        "sticky top-0 z-50 border-b transition-colors duration-300 " +
        (scrolled
          ? "border-border/60 bg-background/80 backdrop-blur-md"
          : "border-transparent bg-background")
      }
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-foreground/50" />
            <span className="relative inline-flex size-2 rounded-full bg-foreground transition-transform duration-300 group-hover:scale-125" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Shiki Code Studio
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <div className="hidden items-center sm:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  "relative cursor-pointer rounded-md px-3 py-2 text-sm transition-colors " +
                  (isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 350, damping: 32 }}
                        className="absolute inset-0 rounded-md bg-muted"
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <Button asChild size="sm" className="ml-2 cursor-pointer transition-transform active:scale-[0.97]">
            <Link to="/book">
              Book a call
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </nav>
      </div>
      <ScrollProgress />
    </motion.header>
  );
}

export function SiteFooter() {
  const rows = useQuery(api.siteContent.list, {});
  const socials = useMemo(() => {
    const stored = rows?.find((r) => r.key === CONTENT_KEYS.socials)?.data;
    return asSocials(stored) ?? defaultSocials;
  }, [rows]);

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex h-auto w-full max-w-6xl flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="link-sweep cursor-pointer text-xs text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex items-center gap-3">
            {socialIcons.map(({ key, label, build, Icon }) => {
              const raw = socials[key];
              if (!raw) return null; // blank field in the dashboard hides the icon
              const href = build(raw);
              return (
                <a
                  key={key}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:") ? undefined : "noreferrer noopener"
                  }
                  aria-label={label}
                  title={label}
                  className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Shiki Code Studio · Arman Abir · Built
            with React, TypeScript, and Convex
          </p>
        </div>
      </div>
    </footer>
  );
}
