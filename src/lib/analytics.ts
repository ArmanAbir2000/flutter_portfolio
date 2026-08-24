/**
 * Plausible Analytics — privacy-friendly, cookie-free page tracking.
 *
 * Dormant until a build-time domain is provided:
 *   VITE_PLAUSIBLE_DOMAIN=yourdomain.com
 *
 * Set it for production via Settings → Environment (freebuff-deploy env)
 * or your GitHub Pages workflow secrets. Without it, nothing loads.
 */

const domain = (import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined)?.trim();

export const analyticsEnabled = !!domain;

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { u?: string; props?: Record<string, unknown> },
    ) => void;
  }
}

/** Inject the Plausible script once (idempotent). */
export function initAnalytics() {
  if (!domain) return;
  if (document.querySelector("script[data-analytics]")) return;
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = domain;
  s.dataset.analytics = "";
  s.src = "https://plausible.io/js/script.js";
  document.head.appendChild(s);
}

/** SPA route change — Plausible's script only fires on full page loads. */
export function trackPageview() {
  if (!domain || typeof window.plausible !== "function") return;
  window.plausible("pageview", { u: window.location.href });
}
