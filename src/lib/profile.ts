/**
 * Editable profile data — update these lists as your work changes.
 * They render in the "Now" section of the landing page.
 */

export type ActiveProject = {
  name: string;
  context: string;
  /** Optional link to a matching entry in the /projects catalog. */
  slug?: string;
};

/** Projects currently in progress (client / contract work). */
export const currentClientWork: ActiveProject[] = [
  {
    name: "Realtime Analytics Dashboard — Phase 2",
    context: "Adding anomaly alerts and saved views for enterprise tenants.",
    slug: "realtime-analytics-dashboard",
  },
  {
    name: "Payments Integration Platform — New Provider",
    context: "Onboarding a regional bank-transfer provider behind the unified API.",
    slug: "payments-integration-platform",
  },
  {
    name: "Headless Commerce Storefront — Replatform",
    context: "Migrating the remaining templates to edge rendering.",
    slug: "headless-commerce-storefront",
  },
];

/** Personal and open-source projects currently maintained. */
export const personalProjects: ActiveProject[] = [
  {
    name: "DevOps CLI Toolkit",
    context: "v2 in development: plugin system and multi-cloud secrets rotation.",
    slug: "devops-cli-toolkit",
  },
  {
    name: "Open-Source UI Library",
    context: "Working toward full WCAG 2.2 coverage and a headless date-range picker.",
    slug: "open-source-ui-library",
  },
  {
    name: "AI Support Assistant",
    context: "Fine-tuning escalation thresholds from live feedback data.",
    slug: "ai-support-assistant",
  },
];
