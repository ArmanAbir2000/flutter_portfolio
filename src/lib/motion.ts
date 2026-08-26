import type { Transition, Variants } from "framer-motion";
import type { AnimationPreset } from "@/lib/animations";
import { getAnimationPreset } from "@/lib/animations";

/**
 * Shared motion language for the site.
 *
 * Transform/opacity only, and all entrance animations are disabled
 * automatically for users who prefer reduced motion (see <MotionConfig>
 * in main.tsx).
 */

/** Default ease-out curve (cinematic preset). */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const viewportOnce = { once: true, margin: "-40px" } as const;

/** Generate fadeUp props from an animation preset. */
export function fadeUpFrom(
  preset: AnimationPreset,
  delay = 0,
): {
  initial: { opacity: number; y: number };
  whileInView: { opacity: number; y: number };
  viewport: typeof viewportOnce;
  transition: Transition;
} {
  if (preset.springStiffness) {
    return {
      initial: { opacity: 0, y: preset.distance },
      whileInView: { opacity: 1, y: 0 },
      viewport: viewportOnce,
      transition: {
        type: "spring",
        stiffness: preset.springStiffness,
        damping: preset.springDamping ?? 20,
        delay,
      },
    };
  }
  return {
    initial: { opacity: 0, y: preset.distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: viewportOnce,
    transition: { duration: preset.duration, ease: preset.ease, delay },
  };
}

/** Standard scroll-into-view reveal: rise + fade (cinematic default). */
export const fadeUp: {
  initial: { opacity: number; y: number };
  whileInView: { opacity: number; y: number };
  viewport: typeof viewportOnce;
  transition: Transition;
} = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewportOnce,
  transition: { duration: 0.6, ease: EASE },
};

/** Generate staggerParent variants from an animation preset. */
export function staggerParentFrom(preset: AnimationPreset): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: preset.stagger,
        delayChildren: 0.05,
      },
    },
  };
}

/** Parent that staggers its `staggerChild` children into view. */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/** Generate staggerChild variants from an animation preset. */
export function staggerChildFrom(preset: AnimationPreset): Variants {
  if (preset.springStiffness) {
    return {
      hidden: { opacity: 0, y: preset.distance },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: preset.springStiffness,
          damping: preset.springDamping ?? 20,
        },
      },
    };
  }
  return {
    hidden: { opacity: 0, y: preset.distance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: preset.duration * 0.8, ease: preset.ease },
    },
  };
}

/** Child of a `staggerParent`. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Generate maskLine variants from an animation preset. */
export function maskLineFrom(preset: AnimationPreset): Variants {
  if (preset.springStiffness) {
    return {
      hidden: { y: "110%" },
      show: {
        y: "0%",
        transition: {
          type: "spring",
          stiffness: preset.springStiffness,
          damping: preset.springDamping ?? 20,
        },
      },
    };
  }
  return {
    hidden: { y: "110%" },
    show: {
      y: "0%",
      transition: { duration: preset.duration * 0.9, ease: preset.ease },
    },
  };
}

/** Masked line reveal — pair with an overflow-hidden wrapper (see MaskText). */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
};

/** Convenience: get preset-aware motion values by animation ID. */
export function motionForPreset(id: string) {
  const preset = getAnimationPreset(id);
  return {
    preset,
    fadeUp: fadeUpFrom(preset),
    staggerParent: staggerParentFrom(preset),
    staggerChild: staggerChildFrom(preset),
    maskLine: maskLineFrom(preset),
  };
}
