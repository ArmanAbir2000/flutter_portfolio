/**
 * Editable profile data — update these lists as your work changes.
 * They render in the "In progress right now" section of the landing page.
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
    name: "ParcelFly — Courier & Merchant Apps",
    context:
      "Hardening live-tracking flows and courier assignment on Flutter + Laravel.",
    slug: "parcelfly-delivery-platform",
  },
  {
    name: "JobNect — Employer & Applicant Apps",
    context:
      "Expanding matching and application workflows across both Flutter clients.",
    slug: "jobnect-recruitment-suite",
  },
  {
    name: "Sellino — Storefront Iteration",
    context:
      "Checkout and catalog improvements across the web storefront and mobile app.",
    slug: "sellino-ecommerce",
  },
];

/** Personal and studio projects currently active. */
export const personalProjects: ActiveProject[] = [
  {
    name: "Shiki UI — Flutter Component Kit",
    context:
      "Growing the in-house widget library that backs every studio project.",
    slug: "shiki-ui-flutter-kit",
  },
  {
    name: "Lan Party — Open Source",
    context: "Public experiments and released tooling on GitHub.",
    slug: "lan-party",
  },
  {
    name: "Subsify — Polish Pass",
    context: "Refining subscription insights, reminders, and background sync.",
    slug: "subsify-subscriptions",
  },
];
