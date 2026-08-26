import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, fadeUp, maskLine, staggerParent, fadeUpFrom, staggerParentFrom, maskLineFrom } from "@/lib/motion";
import { useThemeSettings } from "@/hooks/use-theme-settings";
import { getAnimationPreset } from "@/lib/animations";

/**
 * Small set of reusable motion primitives so every page animates with the
 * same timing and easing. See src/lib/motion.ts for the shared tokens.
 * When ThemeSettingsProvider is available, they use the active animation preset.
 */

/** Hook to get the current motion values from context. */
function useMotionValues() {
  try {
    const { animationId } = useThemeSettings();
    const preset = getAnimationPreset(animationId);
    return {
      fadeUp: fadeUpFrom(preset),
      staggerParent: staggerParentFrom(preset),
      maskLine: maskLineFrom(preset),
      preset,
    };
  } catch {
    return { fadeUp, staggerParent, maskLine, preset: null };
  }
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
  const { fadeUp: fu } = useMotionValues();
  return (
    <Comp
      {...fu}
      transition={{ ...fu.transition, delay }}
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
  /** Element to render the container as. */
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const Tag = motion[as];
  const words = text.split(" ");
  const { staggerParent: sp, maskLine: ml } = useMotionValues();
  return (
    <Tag
      variants={sp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
      className={cn("inline-block", className)}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span variants={ml} className="inline-block">
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
    const controls = animate(0, target, {
      duration,
      ease: EASE,
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
