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

/** Ongoing client / contract engagements (kept private by request). */
export const currentClientWork: ActiveProject[] = [
  {
    name: "ParcelFly — Delivery Ecosystem",
    context:
      "Ongoing Flutter and Laravel work across the courier, merchant, and customer apps.",
  },
  {
    name: "JobNect — Recruitment Suite",
    context:
      "Continued development of the employer and applicant Flutter clients.",
  },
  {
    name: "Sellino — E-commerce Platform",
    context: "Storefront and mobile app iteration on the Laravel commerce API.",
  },
];

/** Personal projects currently active. */
export const personalProjects: ActiveProject[] = [
  {
    name: "Orimono",
    context: "Personal Flutter app — current release polish and new features.",
    slug: "orimono-app",
  },
  {
    name: "Watch Store",
    context: "E-commerce Flutter app — checkout flow refinements.",
    slug: "watch-store-app",
  },
  {
    name: "FreeShop",
    context: "Marketplace-style shopping app — feed performance improvements.",
    slug: "freeshop-app",
  },
  {
    name: "Job App",
    context: "Job-listing client — application tracker enhancements.",
    slug: "job-app",
  },
];
