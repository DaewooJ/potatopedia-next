// One place for the site's headline numbers (About, Advertise, homepage, llms.txt).
// Data points and sources come from the live backend /stats (refreshed hourly); everything else
// is counted from the data files at build time. Server-only (uses fetch with Next revalidate).
import ANSWERS from "./answers-baked.json";
import { COUNTRIES } from "./data";
import { BLOG_POSTS } from "./blog-posts";
import { VARIETIES } from "./varieties-data";

export const STATS_FALLBACK = { dataPoints: 11407, sources: 592 };

export async function getSiteStats() {
  let dataPoints = STATS_FALLBACK.dataPoints;
  let sources = STATS_FALLBACK.sources;
  try {
    const r = await fetch("https://api.potatopedia.com/stats", {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) {
      const s = await r.json();
      if (s.total_chunks) dataPoints = s.total_chunks;
      if (s.unique_sources) sources = s.unique_sources;
    }
  } catch {}
  return {
    dataPoints,
    sources,
    blogPosts: BLOG_POSTS.length,
    answers: Object.keys(ANSWERS).length,
    countries: COUNTRIES.length,
    varieties: VARIETIES.length,
  };
}

export const fmt = (n) => Number(n).toLocaleString("en-US");
