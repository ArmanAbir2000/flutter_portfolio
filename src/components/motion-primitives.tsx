import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Reusable motion primitives that read animation parameters from CSS custom
 * properties (--anim-ease, --anim-duration, --anim-distance, --anim-stagger)
 * set by the active animation preset class on <html>. This makes them
 * reactive to preset changes without requiring component remounts.
 */

/** Read a CSS custom property from <html> and parse it. */
function readCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Parse a CSS cubic-bezier() string into a tuple, or return default. */
function parseEasing(raw: string): [number, number, number, number] {
  const m = raw.match(/cubic-bezier\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
    if (parts.length === 4 && parts.every((n) => !Number.isNaN(n))) {
      return parts as [number, number, number, number];
    }
  }
  return [0.22, 1, 0.36, 1];
}

/** Parse a CSS time/length value to a number, or return default. */
function parseDuration(raw: string, fallback: number): number {
  const n = parseFloat(raw);
  return Number.isNaN(n) ? fallback : n;
}

function parseDistance(raw: string, fallback: number): number {
  const n = parseFloat(raw);
  return Number.isNaN(n) ? fallback : n;
}

/** Read the current animation parameters from CSS variables. */
function readAnimParams() {
  const ease = parseEasing(readCSSVar("--anim-ease"));
  const duration = parseDuration(readCSSVar("--anim-duration"), 0.85);
  const distance = parseDistance(readCSSVar("--anim-distance"), 24);
  const stagger = parseDuration(readCSSVar("--anim-stagger"), 0.1);
  return { ease, duration, distance, stagger };
}

/** Scroll-triggered rise + fade wrapper for any block. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "span" | "li" | "h2" | "h3" | "section";
}) {
  const Comp = motion[as];
  const ref = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState(readAnimParams);

  // Re-read CSS vars when animation preset class changes on <html>.
  useEffect(() => {
    const obs = new MutationObserver(() => setParams(readAnimParams()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <Comp
      initial={{ opacity: 0, y: params.distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: params.duration, ease: params.ease, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/**
 * Kinetic typography: splits a heading into words and reveals each through an
 * overflow mask, staggered left to right. The signature editorial reveal.
 */
export function MaskText({
  text,
  className,
  delay = 0,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const Tag = motion[as];
  const words = text.split(" ");
  const [params, setParams] = useState(readAnimParams);

  useEffect(() => {
    const obs = new MutationObserver(() => setParams(readAnimParams()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={cn("inline-block", className)}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{
              duration: params.duration * 0.9,
              ease: params.ease,
              delay: delay + i * params.stagger,
            }}
            className="inline-block"
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Animated count-up for stat numbers like "500+", "4 yrs", "12". */
export function CountUp({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const match = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2].replace(/,/g, ""), 10) : NaN;
  const suffix = match?.[3] ?? "";
  const [display, setDisplay] = useState(() =>
    Number.isNaN(target) ? value : prefix + "0" + suffix,
  );

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;
    const ease = parseEasing(readCSSVar("--anim-ease"));
    const controls = animate(0, target, {
      duration,
      ease,
      onUpdate: (v) =>
        setDisplay(prefix + Math.round(v).toLocaleString() + suffix),
    });
    return () => controls.stop();
  }, [inView, target, duration, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/**
 * Infinite horizontal marquee. Content is duplicated once; the CSS animation
 * translates exactly -50% so the loop is seamless. Pauses on hover.
 */
export function Marquee({
  items,
  className,
  duration = 32,
}: {
  items: ReactNode[];
  className?: string;
  /** Seconds per full loop. */
  duration?: number;
}) {
  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={i} className="flex items-center">
          {item}
          <span aria-hidden className="mx-6 size-1 rounded-full bg-border sm:mx-8" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee group overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
