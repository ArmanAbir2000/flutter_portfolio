import { useEffect } from "react";

/**
 * Canonical site origin + base path. MUST stay in sync with the static
 * tags in index.html — crawlers read those, this constant keeps
 * browser-side updates consistent. The repo deploys as a GitHub Pages
 * PROJECT site, so the /Shiki_Code_Studio/ subpath is part of every URL.
 */
export const SITE_URL = "https://armanabir2000.github.io/Shiki_Code_Studio";

export const DEFAULT_OG_IMAGE = "/og/og-default.png";
export const DEFAULT_TITLE =
  "Shiki Code Studio — Flutter Development by Arman Abir";
export const DEFAULT_DESCRIPTION =
  "Shiki Code Studio — Flutter apps by Arman Abir. Cross-platform mobile development backed by Laravel REST APIs, Firebase, and clean state management.";

const absolute = (pathOrUrl: string) =>
  pathOrUrl.startsWith("http") ? pathOrUrl : SITE_URL + pathOrUrl;

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export type DocumentMeta = {
  title: string;
  description?: string;
  /** Absolute URL or site-root-relative path (e.g. a project cover). */
  image?: string;
};

/**
 * Per-route <head> updates for browsers and JS-aware previewers.
 * Link crawlers that don't run JS (WhatsApp, LinkedIn, iMessage…) read
 * the static tags in index.html instead — keep those authoritative.
 */
export function useDocumentMeta({ title, description, image }: DocumentMeta) {
  useEffect(() => {
    const desc = description?.trim() || DEFAULT_DESCRIPTION;
    const img = absolute(image || DEFAULT_OG_IMAGE);

    document.title = title;

    upsertMeta("name", "description", desc);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:image", img);
    // pathname already includes the base path at runtime — no join needed.
    upsertMeta(
      "property",
      "og:url",
      window.location.origin + window.location.pathname,
    );
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);
  }, [title, description, image]);
}
