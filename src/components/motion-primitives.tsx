import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAnimationPreset, type AnimationPreset } from "@/lib/animations";

/**
 * Motion primitives with truly distinct behaviors per animation style.
 * Each style has a unique entrance: scale, rotation, spring, glitch, wipe, bounce.
 */

/** Read the active animation preset from the <html> class. */
const PRESET_IDS = ["cinematic", "kinetic", "liquid", "glitch", "editorial", "playful"] as const;

function readActivePreset(): AnimationPreset {
  const cls = document.documentElement.className;
  for (const id of PRESET_IDS) {
    if (cls.includes(`anim-${id}`)) return getAnimationPreset(id);
  }
  return getAnimationPreset("cinematic");
}

/** Compute distinct entrance props per animation style. */
function entranceFor(preset: AnimationPreset) {
  switch (preset.id) {
    case "cinematic":
      return {
        initial: { opacity: 0, scale: 0.85, y: 16 },
        whileInView: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: preset.duration, ease: preset.ease as [number, number, number, number] },
      };
    case "kinetic":
      return {
        initial: { opacity: 0, scale: 0.9, rotate: -6, y: 20 },
        whileInView: { opacity: 1, scale: 1, rotate: 0, y: 0 },
        transition: { duration: preset.duration, ease: preset.ease as [number, number, number, number] },
      };
    case "liquid":
      return {
        initial: { opacity: 0, y: preset.distance },
        whileInView: { opacity: 1, y: 0 },
        transition: preset.springStiffness
          ? { type: "spring" as const, stiffness: preset.springStiffness, damping: preset.springDamping ?? 20 }
          : { duration: preset.duration, ease: preset.ease as [number, number, number, number] },
      };
    case "glitch":
      return {
        initial: { opacity: 0, x: -8, skewX: -3 },
        whileInView: { opacity: 1, x: 0, skewX: 0 },
        transition: { duration: preset.duration, ease: preset.ease as [number, number, number, number] },
      };
    case "editorial":
      return {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: preset.duration, ease: preset.ease as [number, number, number, number] },
      };
    case "playful":
      return {
        initial: { opacity: 0, scale: 0.3, y: 20 },
        whileInView: { opacity: 1, scale: 1, y: 0 },
        transition: preset.springStiffness
          ? { type: "spring" as const, stiffness: preset.springStiffness, damping: preset.springDamping ?? 10 }
          : { duration: preset.duration, ease: preset.ease as [number, number, number, number] },
      };
    default:
      return {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };
  }
}

/** Compute distinct mask-line entrance per animation style. */
function maskEntranceFor(preset: AnimationPreset) {
  switch (preset.id) {
    case "cinematic":
      return {
        initial: { y: "110%", opacity: 0 },
        whileInView: { y: "0%", opacity: 1 },
        transition: { duration: preset.duration * 0.9, ease: preset.ease },
      };
    case "kinetic":
      return {
        initial: { y: "100%", rotateX: -80 },
        whileInView: { y: "0%", rotateX: 0 },
        transition: { duration: preset.duration, ease: preset.ease },
      };
    case "liquid":
      return {
        initial: { y: "110%" },
        whileInView: { y: "0%" },
        transition: preset.springStiffness
          ? { type: "spring" as const, stiffness: preset.springStiffness, damping: preset.springDamping ?? 20 }
          : { duration: preset.duration * 0.9, ease: preset.ease },
      };
    case "glitch":
      return {
        initial: { y: "100%", opacity: 0 },
        whileInView: { y: "0%", opacity: 1 },
        transition: { duration: preset.duration * 0.5, ease: preset.ease },
      };
    case "editorial":
      return {
        initial: { clipPath: "inset(0 100% 0 0)" },
        whileInView: { clipPath: "inset(0 0% 0 0)" },
        transition: { duration: preset.duration, ease: preset.ease },
      };
    case "playful":
      return {
        initial: { y: "100%", scale: 0.8 },
        whileInView: { y: "0%", scale: 1 },
        transition: preset.springStiffness
          ? { type: "spring" as const, stiffness: preset.springStiffness, damping: preset.springDamping ?? 10 }
          : { duration: preset.duration, ease: preset.ease },
      };
    default:
      return {
        initial: { y: "110%" },
        whileInView: { y: "0%" },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      };
  }
}

/** Hook: get current entrance props, reactive to style changes. */
function useEntrance() {
  const [preset, setPreset] = useState(readActivePreset);

  useEffect(() => {
    const obs = new MutationObserver(() => setPreset(readActivePreset()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return {
    reveal: entranceFor(preset),
    mask: maskEntranceFor(preset),
    preset,
  };
}

/* ── Reveal ─────────────────────────────────────────────────────────── */

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
  const { reveal } = useEntrance();

  return (
    <Comp
      {...reveal}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...reveal.transition, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/* ── MaskText ───────────────────────────────────────────────────────── */

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
  const { mask, preset } = useEntrance();

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
            {...mask}
            transition={{
          ...(mask.transition as Record<string, unknown>),
          delay: delay + i * preset.stagger,
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

/* ── CountUp ────────────────────────────────────────────────────────── */

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
    const preset = readActivePreset();
    const controls = animate(0, target, {
      duration,
      ease: preset.ease,
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

/* ── Marquee ────────────────────────────────────────────────────────── */

export function Marquee({
  items,
  className,
  duration = 32,
}: {
  items: ReactNode[];
  className?: string;
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
