import Fuse from "fuse.js";

let fuseInstance = null;
let indexBuilt = false;
let rawIndex = [];

/**
 * Build index ONCE safely (singleton)
 */
function buildIndex() {
  if (indexBuilt) return;

  const pages = import.meta.glob("/src/pages/**/*.{jsx,tsx}", {
    eager: true,
  });

  const toArray = (v) => (Array.isArray(v) ? v : []);
  const toString = (v) => (typeof v === "string" ? v : "");

  rawIndex = Object.entries(pages).flatMap(([path, module]) => {
    const meta = module?.meta || {};
    const sections = toArray(module?.searchSections);

    const pageUrl =
      meta.url ||
      path
        .replace("/src/pages", "")
        .replace(/\.(jsx|tsx)$/, "")
        .replace(/\/index$/, "");

    const pageEntry = {
      id: `page-${pageUrl}`,
      type: "page",
      title: toString(meta.title || pageUrl),
      description: toString(meta.description),
      keywords: toArray(meta.keywords).map(toString),
      url: pageUrl,
    };

    const sectionEntries = sections.map((s, i) => ({
      id: `section-${pageUrl}-${i}`,
      type: "section",
      title: toString(s.title),
      description: toString(s.description),
      keywords: toArray(s.keywords).map(toString),
      url: s.anchor ? `${pageUrl}#${s.anchor}` : pageUrl,
      pageUrl,
      anchor: toString(s.anchor),
    }));

    return [pageEntry, ...sectionEntries];
  });

  fuseInstance = new Fuse(rawIndex, {
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: "title", weight: 0.6 },
      { name: "keywords", weight: 0.25 },
      { name: "description", weight: 0.15 },
    ],
  });

  indexBuilt = true;
}

/**
 * MAIN SEARCH
 */
export function searchSite(query, limit = 8) {
  buildIndex(); // 🔥 safe lazy init

  const q = typeof query === "string" ? query.trim().toLowerCase() : "";
  if (!q) return [];

  const results = fuseInstance.search(q);

  return results.slice(0, limit).map(({ item, score }) => ({
    ...item,
    score: Math.round((1 - (score || 0)) * 100),
  }));
}

/**
 * NAVIGATION HELPER
 */
export function resolveSearchNavigation(item, navigate, location) {
  if (!item?.url) return;

  const [path, hash] = item.url.split("#");

  const scrollTo = (id, attempt = 0) => {
    if (!id) return;

    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("highlight-setting");
      setTimeout(() => el.classList.remove("highlight-setting"), 2000);
    } else if (attempt < 10) {
      setTimeout(() => scrollTo(id, attempt + 1), 100);
    }
  };

  if (location.pathname === path) {
    scrollTo(hash);
  } else {
    navigate(path);
    setTimeout(() => scrollTo(hash), 150);
  }
}

/**
 * Optional debug hook
 */
export function getSearchIndex() {
  buildIndex();
  return rawIndex;
}

export default searchSite;