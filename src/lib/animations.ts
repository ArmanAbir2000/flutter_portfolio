/**
 * Animation style presets.
 *
 * Each preset defines motion parameters (easing, duration, distance, stagger)
 * consumed by motion primitives and CSS utility classes.
 */

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Easing curve [cp1x, cp1y, cp2x, cp2y] */
  ease: [number, number, number, number];
  /** Base duration in seconds */
  duration: number;
  /** Y travel distance in px */
  distance: number;
  /** Stagger delay between children (seconds) */
  stagger: number;
  /** Scale for hover micro-interactions */
  hoverScale: number;
  /** Spring stiffness (for spring-based presets) */
  springStiffness?: number;
  /** Spring damping */
  springDamping?: number;
}

export const animationPresets: AnimationPreset[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Slow, dramatic reveals with depth",
    icon: "🎬",
    ease: [0.16, 1, 0.3, 1],
    duration: 0.85,
    distance: 24,
    stagger: 0.1,
    hoverScale: 1.02,
  },
  {
    id: "snappy",
    name: "Snappy",
    description: "Fast, tight, energetic",
    icon: "⚡",
    ease: [0.36, 0, 0.66, -0.56],
    duration: 0.35,
    distance: 12,
    stagger: 0.04,
    hoverScale: 1.03,
  },
  {
    id: "liquid",
    name: "Liquid",
    description: "Smooth springs, flowing motion",
    icon: "💧",
    ease: [0.22, 1, 0.36, 1],
    duration: 0.7,
    distance: 20,
    stagger: 0.08,
    hoverScale: 1.025,
    springStiffness: 120,
    springDamping: 14,
  },
  {
    id: "kinetic",
    name: "Kinetic",
    description: "Bold typography, high energy",
    icon: "🔤",
    ease: [0.19, 1, 0.22, 1],
    duration: 0.8,
    distance: 30,
    stagger: 0.06,
    hoverScale: 1.04,
  },
  {
    id: "gentle",
    name: "Gentle",
    description: "Minimal movement, calm and serene",
    icon: "🕊️",
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.5,
    distance: 8,
    stagger: 0.05,
    hoverScale: 1.01,
  },
  {
    id: "playful",
    name: "Playful",
    description: "Bouncy springs, rubber-band feel",
    icon: "🎈",
    ease: [0.34, 1.56, 0.64, 1],
    duration: 0.6,
    distance: 18,
    stagger: 0.07,
    hoverScale: 1.05,
    springStiffness: 200,
    springDamping: 12,
  },
];

export function getAnimationPreset(id: string): AnimationPreset {
  return animationPresets.find((a) => a.id === id) ?? animationPresets[0];
}

/** Convert preset to Framer Motion transition object. */
export function presetToTransition(
  preset: AnimationPreset,
  overrides?: { duration?: number; delay?: number },
) {
  if (preset.springStiffness) {
    return {
      type: "spring" as const,
      stiffness: preset.springStiffness,
      damping: preset.springDamping ?? 20,
      delay: overrides?.delay,
    };
  }
  return {
    duration: overrides?.duration ?? preset.duration,
    ease: preset.ease,
    delay: overrides?.delay,
  };
}

/** Convert preset to CSS transition properties. */
export function presetToCSS(preset: AnimationPreset): string {
  return `cubic-bezier(${preset.ease.join(",")}) ${preset.duration}s`;
}
