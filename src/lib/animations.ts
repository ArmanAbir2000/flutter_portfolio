/**
 * Award-winning animation style presets.
 *
 * Each style defines:
 *  - CSS variable overrides (timing, easing, distance)
 *  - A CSS class name for visual effects (glitch, mask, parallax, etc.)
 *  - A unique entrance behavior for motion primitives
 */

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** CSS class applied to <html> for visual effects. */
  cssClass: string;
  /** Easing curve for Framer Motion. */
  ease: [number, number, number, number];
  /** Base duration in seconds. */
  duration: number;
  /** Y travel distance in px. */
  distance: number;
  /** Stagger delay between children (seconds). */
  stagger: number;
  /** Spring stiffness (when using spring physics). */
  springStiffness?: number;
  /** Spring damping. */
  springDamping?: number;
}

export const animationPresets: AnimationPreset[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Dramatic scale + fade, movie-like reveals",
    icon: "🎬",
    cssClass: "anim-cinematic",
    ease: [0.16, 1, 0.3, 1],
    duration: 0.9,
    distance: 20,
    stagger: 0.08,
  },
  {
    id: "kinetic",
    name: "Kinetic",
    description: "Bold rotation + scale entrance, high energy",
    icon: "⚡",
    cssClass: "anim-kinetic",
    ease: [0.19, 1, 0.22, 1],
    duration: 0.65,
    distance: 30,
    stagger: 0.06,
  },
  {
    id: "liquid",
    name: "Liquid",
    description: "Smooth spring physics, morph-like flow",
    icon: "💧",
    cssClass: "anim-liquid",
    ease: [0.22, 1, 0.36, 1],
    duration: 0.75,
    distance: 18,
    stagger: 0.07,
    springStiffness: 120,
    springDamping: 14,
  },
  {
    id: "glitch",
    name: "Glitch",
    description: "Digital distortion, chromatic aberration",
    icon: "📡",
    cssClass: "anim-glitch",
    ease: [0.36, 0, 0.66, -0.56],
    duration: 0.4,
    distance: 12,
    stagger: 0.03,
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Clean mask reveals, letter-by-letter text",
    icon: "📰",
    cssClass: "anim-editorial",
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.8,
    distance: 0,
    stagger: 0.04,
  },
  {
    id: "playful",
    name: "Playful",
    description: "Bouncy springs, elastic overshoot, wobble",
    icon: "🎈",
    cssClass: "anim-playful",
    ease: [0.34, 1.56, 0.64, 1],
    duration: 0.6,
    distance: 22,
    stagger: 0.05,
    springStiffness: 200,
    springDamping: 10,
  },
];

export function getAnimationPreset(id: string): AnimationPreset {
  return animationPresets.find((a) => a.id === id) ?? animationPresets[0];
}
