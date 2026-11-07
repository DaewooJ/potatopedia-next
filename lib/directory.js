import { neon } from "@neondatabase/serverless";

// Company directory (/companies). Rows live in Neon pp_companies; only published = true rows are shown.
// Profiles (profile jsonb) are compiled from each company's own official website only, every fact with a source URL.
// Featured = a paid, labelled placement: it adds the company to the Featured row and a badge on its profile,
// and never changes the facts or the order of the neutral list (always A–Z).

// The one go-public switch lives in lib/directory-flag.js (robots noindex, sitemap entries, nav link).
export { DIRECTORY_PUBLIC } from "./directory-flag";

export const SITE = "https://www.potatopedia.com";

import { SEGMENTS } from "./directory-labels";
export { KINDS, KIND_ORDER, SEGMENTS, MACHINE_SEGMENTS, flag } from "./directory-labels";

export function isFeatured(row, today = new Date()) {
  if (!row?.featured) return false;
  if (!row.featured_until) return true;
  return new Date(row.featured_until).getTime() >= new Date(today.toISOString().slice(0, 10)).getTime();
}

export function websiteHost(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function db() {
  return process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
}

async function retry(fn, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 600 * i));
    }
  }
}

// Card data for the index (no full profile, so the client island stays small).
// Throws after retries instead of returning an empty list: a failed build or a kept stale ISR page is better than
// an empty directory going out.
export async function listCompanies() {
  const sql = db();
  if (!sql) throw new Error("DATABASE_URL is not set");
  const rows = await retry(() => sql`select slug, kind, name, country, segments, featured, featured_until, home_url,
      profile->>'summary' as summary, profile->'hq'->>'city' as city,
      coalesce(jsonb_array_length(profile->'sources'), 0)::int as n_sources
      from pp_companies where published = true order by lower(name)`);
  return rows.map((r) => ({
    slug: r.slug,
    kind: r.kind,
    name: r.name,
    country: r.country || "",
    city: r.city || "",
    segments: (r.segments || []).filter((s) => SEGMENTS[s] && s !== "other"),
    summary: firstSentence(r.summary || ""),
    featured: isFeatured(r),
    sources: r.n_sources || 0,
  }));
}

export async function getCompany(slug) {
  const sql = db();
  if (!sql) throw new Error("DATABASE_URL is not set");
  // Errors propagate (no false 404 while the database is unreachable).
  const rows = await retry(() => sql`select slug, kind, name, domain, home_url, country, segments, featured, featured_until, profile, reviewed_at, updated_at
      from pp_companies where published = true and slug = ${slug} limit 1`);
  return rows[0] || null;
}

export function firstSentence(s) {
  const t = String(s).trim();
  const m = t.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1] : t;
}

export function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(typeof d === "string" && d.length === 10 ? d + "T00:00:00Z" : d);
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
