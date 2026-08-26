import type { Transition, Variants } from "framer-motion";
import type { AnimationPreset } from "@/lib/animations";

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

/** Parent that staggers its `staggerChild` children into view. */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/** Child of a `staggerParent`. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Masked line reveal — pair with an overflow-hidden wrapper (see MaskText). */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
};
