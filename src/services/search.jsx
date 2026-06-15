// src/services/search.js
import Fuse from "fuse.js";

/**
 * Load all pages from /src/pages
 * (Vite compile-time glob)
 */
const pages = import.meta.glob("/src/pages/**/*.{jsx,tsx}", {
  eager: true,
});

/**
 * Safely normalize any value to array
 */
const toArray = (val) => (Array.isArray(val) ? val : []);

/**
 * Safely normalize string
 */
const toString = (val) => (typeof val === "string" ? val : "");

/**
 * Build flat search index (pages + sections)
 */
const rawIndex = Object.entries(pages).flatMap(([path, module]) => {
  const meta = module?.meta ?? {};
  const sections = toArray(module?.searchSections);

  const pageUrl = toString(
    meta.url ||
      path
        .replace("/src/pages", "")
        .replace(/\.(jsx|tsx)$/, "")
        .replace(/\/index$/, "")
  );

  // PAGE ENTRY
  const pageEntry = {
    id: `page-${pageUrl}`,
    type: "page",
    title: toString(meta.title || pageUrl),
    description: toString(meta.description),
    keywords: toArray(meta.keywords).map((k) => toString(k)),
    url: pageUrl,
  };

  // SECTION ENTRIES
  const sectionEntries = sections.map((s, i) => {
    const anchor = toString(s.anchor);

    return {
      id: `section-${pageUrl}-${i}`,
      type: "section",
      title: toString(s.title),
      description: toString(s.description),
      keywords: toArray(s.keywords).map((k) => toString(k)),
      url: anchor ? `${pageUrl}#${anchor}` : pageUrl,
      pageUrl,
      anchor,
    };
  });

  return [pageEntry, ...sectionEntries];
});

/**
 * Fuse.js configuration (safe + balanced)
 */
const fuse = new Fuse(rawIndex, {
  includeScore: true,
  includeMatches: true,
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: "title", weight: 0.6 },
    { name: "keywords", weight: 0.25 },
    { name: "description", weight: 0.15 },
  ],
});

/**
 * Main search function
 */
export function searchSite(query, limit = 8) {
  const clean = toString(query).toLowerCase().trim();
  if (!clean) return [];

  const results = fuse.search(clean);

  return results.slice(0, limit).map(({ item, score }) => ({
    ...item,
    score: Math.round((1 - (score ?? 0)) * 100),
  }));
}

/**
 * Navigation resolver (page + anchor safe scroll)
 */
export function resolveSearchNavigation(item, navigate, location) {
  if (!item?.url) return;

  const [path, hash] = item.url.split("#");

  const scrollToElement = (id, attempt = 0) => {
    if (!id) return;

    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      el.classList.add("highlight-setting");

      setTimeout(() => {
        el.classList.remove("highlight-setting");
      }, 2000);
    } else if (attempt < 10) {
      setTimeout(() => scrollToElement(id, attempt + 1), 100);
    }
  };

  if (location?.pathname === path) {
    scrollToElement(hash);
  } else {
    navigate(path);

    setTimeout(() => {
      scrollToElement(hash);
    }, 150);
  }
}

/**
 * Raw index export (for debugging or external use)
 */
export { rawIndex };

export default searchSite;