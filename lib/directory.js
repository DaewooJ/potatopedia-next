import { neon } from "@neondatabase/serverless";

// Company directory (/companies). Rows live in Neon pp_companies; only published = true rows are shown.
// Profiles (profile jsonb) are compiled from each company's own official website only, every fact with a source URL.
// Featured = a paid, labelled placement: it adds the company to the Featured row and a badge on its profile,
// and never changes the facts or the order of the neutral list (always A–Z).

// The one go-public switch lives in lib/directory-flag.js (robots noindex, sitemap entries, nav link).
export { DIRECTORY_PUBLIC } from "./directory-flag";

export const SITE = "https://www.potatopedia.com";

import { SEGMENTS, MACHINE_SEGMENTS } from "./directory-labels";
import { interleave, isHeld } from "./directory-cap.mjs";
export { COUNTRY_CAP_PER_KIND } from "./directory-cap.mjs";
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
  const rows = await retry(() => sql`select slug, kind, name, domain, country, segments, featured, featured_until, home_url, verified, verified_until,
      profile->>'summary' as summary, profile->'hq'->>'city' as city, profile->'hq'->>'country' as hq_country, profile->>'common_name' as common_name,
      profile->'contact'->>'website' as website,
      coalesce(jsonb_array_length(profile->'sources'), 0)::int as n_sources
      from pp_companies where published = true order by lower(coalesce(profile->>'common_name', name))`);
  // Default order: countries interleaved round-robin within each kind (alphabetical tie-break), never one country first.
  return interleave(rows.map((r) => ({
    slug: r.slug,
    kind: r.kind,
    name: r.name,
    common: commonName(r),
    country: r.country || "",
    // The city is shown only when the profile's head office is in the listed country (a Belgian group's Dutch plant
    // must not read "Wielsbeke, Netherlands").
    city: r.city && (!r.hq_country || r.hq_country === r.country) ? r.city : "",
    segments: (r.segments || []).filter((s) => SEGMENTS[s] && s !== "other"),
    summary: firstSentence(r.summary || ""),
    featured: isFeatured(r),
    verified: isVerified(r),
    host: outboundUrl(r) ? websiteHost(outboundUrl(r)) : "",
    sources: r.n_sources || 0,
  })));
}

// A company held back by the per-country cap (published = false, log says "held: country cap"): its URL redirects to
// the country page instead of a 404. Returns { country, kind } or null.
export async function getHeldCompany(slug) {
  const sql = db();
  if (!sql) return null;
  const rows = await retry(() => sql`select country, kind, log from pp_companies where published = false and profile is not null and slug = ${slug} limit 1`);
  return rows[0] && isHeld(rows[0].log) ? { country: rows[0].country, kind: rows[0].kind } : null;
}

// ── naming, descriptors, URLs ──────────────────────────────────────────────────────────────────────────────────
// The short brand name people search for ("Agrico", not "Agrico Coöperatie U.A."). profile.common_name wins.
const LEGAL = /\b(b\.?\s?v\.?|n\.?\s?v\.?|u\.?\s?a\.?|gmbh(\s*&\s*co\.?\s*kg)?|ag|kg|ltd\.?|limited|inc\.?|llc|plc|s\.?a\.?|s\.?r\.?l\.?|sp\.?\s?z\s?o\.?o\.?|co\.?|coöperatie|cooperatie|royal|holding)(?=\s|$|,)/gi;
export function commonName(row) {
  const c = row?.common_name || row?.profile?.common_name;
  if (c) return c;
  const base = String(row?.name || "").replace(/\s*\(.*?\)\s*/g, " ").replace(LEGAL, " ").replace(/[,.]+$/g, "").replace(/\s+/g, " ").trim();
  return base || row?.name || "";
}
export function headline(row) {
  const common = commonName(row);
  return row.name.toLowerCase().includes(common.toLowerCase()) ? row.name : `${common} (${row.name})`;
}

const SEED_DESC = (seg) =>
  seg.includes("breeding") && seg.includes("seed-export") ? "Seed Potato Breeder & Exporter"
  : seg.includes("breeding") && seg.includes("seed-multiplication") ? "Potato Breeder & Seed Grower"
  : seg.includes("breeding") ? "Potato Breeder"
  : seg.includes("seed-export") ? "Seed Potato Grower & Exporter"
  : "Seed Potato Grower";
const PROC_DESC = {
  fries: "Potato Fries Maker", "chips-snacks": "Potato Chips Maker", dehydrated: "Potato Flakes Maker", starch: "Potato Starch Maker",
  protein: "Potato Starch & Protein Maker", "fresh-cut-peeled": "Fresh-Cut Potato Processor", "ready-meals": "Potato Products Maker",
  spirits: "Potato Spirits Distiller",
};
const MACH_DESC = {
  "optical-sorting": "Optical Potato Sorter Maker", "grading-sizing": "Potato Grading Machine Maker", "washing-peeling": "Potato Washing & Peeling Machines",
  cutting: "Potato Cutting Machine Maker", frying: "Potato Fryer Maker", "drying-dehydration": "Potato Drying Equipment Maker", freezing: "Potato Freezing Equipment Maker",
  starch: "Potato Starch Equipment Maker", packing: "Potato Packing Machine Maker", "storage-ventilation": "Potato Storage Systems Maker",
  handling: "Potato Handling Equipment Maker", "turnkey-lines": "Potato Processing Line Maker", "planting-harvesting": "Potato Planter & Harvester Maker",
};
export function descriptor(row) {
  const seg = (row.segments || []).filter((s) => s !== "other");
  if (row.kind === "seed") return SEED_DESC(seg);
  const map = row.kind === "processing" ? PROC_DESC : MACH_DESC;
  const hit = seg.find((s) => map[s]);
  return hit ? map[hit] : row.kind === "processing" ? "Potato Processor" : "Potato Machinery Maker";
}
const SHORT_DESC = { processing: "Potato Processor", seed: "Seed Potato Company", machinery: "Potato Machinery Maker" };

// "<Common name> — <what they are> (<Country>) | Potatopedia", 60 characters or less where it can be.
export function profileTitle(row) {
  const common = commonName(row);
  const cc = row.country ? ` (${row.country})` : "";
    // The descriptor is what people search for, so it is kept before the brand suffix.
  const opts = [`${common} — ${descriptor(row)}${cc} | Potatopedia`, `${common} — ${descriptor(row)}${cc}`, `${common} — ${SHORT_DESC[row.kind] || "Company"}${cc} | Potatopedia`, `${common} — ${SHORT_DESC[row.kind] || "Company"}${cc}`];
  return opts.find((t) => t.length <= 60) || opts[1];
}

export function countrySlug(c) {
  return String(c || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const THE = new Set(["Netherlands", "United States", "United Kingdom", "Czech Republic", "Philippines", "United Arab Emirates"]);
export const inCountry = (c) => (THE.has(c) ? `the ${c}` : c);

// The company's own website, only ever on its own domain (used by /api/out and the cards).
function sameDomain(url, domain) {
  try {
    const h = new URL(url).host.toLowerCase().replace(/^www\./, "");
    const d = String(domain || "").toLowerCase().replace(/^www\./, "");
    return !!d && (h === d || h.endsWith("." + d));
  } catch {
    return false;
  }
}
export function outboundUrl(row) {
  const site = row.website || row.profile?.contact?.website;
  if (site && sameDomain(site, row.domain) && /^https?:\/\//.test(site)) return site;
  if (row.home_url && sameDomain(row.home_url, row.domain) && /^https?:\/\//.test(row.home_url)) return row.home_url;
  return null;
}
export const outHref = (slug) => `/api/out?c=${encodeURIComponent(slug)}`;

export function isVerified(row, today = new Date()) {
  if (!row?.verified || !row.verified_until) return false;
  return new Date(row.verified_until).getTime() >= new Date(today.toISOString().slice(0, 10)).getTime();
}

// Category landing pages (/companies/processors, /seed, /machinery).
export const CATEGORY = {
  processors: { kind: "processing", h1: "Potato processors", lede: "fries, chips, flakes, starch and other potato products" },
  seed: { kind: "seed", h1: "Seed potato companies", lede: "breeders, seed potato growers and exporters" },
  machinery: { kind: "machinery", h1: "Potato machinery makers", lede: "machines for the field, the store and the factory" },
};
export const KIND_PATH = { processing: "processors", seed: "seed", machinery: "machinery" };
export const SEGMENT_H1 = {
  "optical-sorting": "Optical potato sorter makers", "grading-sizing": "Potato grading and sizing machine makers",
  "washing-peeling": "Potato washing and peeling machine makers", cutting: "Potato cutting machine makers", frying: "Potato fryer makers",
  "drying-dehydration": "Potato drying and dehydration equipment makers", freezing: "Potato freezing equipment makers",
  starch: "Potato starch equipment makers", packing: "Potato packing machine makers", "storage-ventilation": "Potato storage and ventilation system makers",
  handling: "Potato handling equipment makers", "turnkey-lines": "Potato processing line makers", "planting-harvesting": "Potato planter and harvester makers",
};
// Buying guides under /machines/<slug> for each machine segment.
export const SEGMENT_GUIDE = {
  "optical-sorting": ["optical-potato-sorter"], "grading-sizing": ["potato-size-grader"], "planting-harvesting": ["potato-planter", "potato-harvester"],
  "storage-ventilation": ["potato-cold-storage-ventilation"], "washing-peeling": ["potato-processing-line"], cutting: ["potato-processing-line"],
  frying: ["potato-processing-line"], "drying-dehydration": ["potato-processing-line"], freezing: ["potato-processing-line"], starch: ["potato-processing-line"],
  "turnkey-lines": ["potato-processing-line"], handling: ["potato-processing-line"], packing: ["potato-size-grader"],
};
const KIND_GUIDES = { processing: ["potato-processing-line", "optical-potato-sorter"], seed: ["potato-planter", "potato-harvester", "potato-cold-storage-ventilation"] };
export function guidesFor(row) {
  const out = row.kind === "machinery" ? (row.segments || []).flatMap((s) => SEGMENT_GUIDE[s] || []) : KIND_GUIDES[row.kind] || [];
  return [...new Set(out)];
}

// Landing pages that exist (machine segments with ≥ 2 makers, countries with ≥ 2 companies), from the live data.
export function landingPages(companies) {
  const segs = MACHINE_SEGMENTS.filter((s) => companies.filter((c) => c.kind === "machinery" && c.segments.includes(s)).length >= 2);
  const byCountry = {};
  for (const c of companies) if (c.country) byCountry[c.country] = (byCountry[c.country] || 0) + 1;
  const countries = Object.keys(byCountry).filter((k) => byCountry[k] >= 2).sort();
  return { segments: segs, countries };
}

export function similarCompanies(c, all, n = 6) {
  const seg = new Set((c.segments || []).filter((s) => s !== "other"));
  const others = all.filter((x) => x.slug !== c.slug);
  const score = (x) => (x.kind === c.kind ? 4 : 0) + (x.country === c.country ? 2 : 0) + (x.segments.some((s) => seg.has(s)) ? 1 : 0)
    + (x.kind === c.kind ? x.segments.filter((s) => seg.has(s)).length * 0.1 : 0);
  return others.map((x) => [score(x), x]).filter(([s]) => s >= 3).sort((a, b) => b[0] - a[0] || a[1].common.localeCompare(b[1].common)).slice(0, n).map(([, x]) => x);
}

// Published seed companies by name, for "Breeder in the directory" on variety pages. Never throws.
let breederCache;
export function breederIndex() {
  if (!breederCache) {
    breederCache = (async () => {
      const sql = db();
      if (!sql) return [];
      const rows = await retry(() => sql`select slug, name, profile->>'common_name' as common_name from pp_companies where published = true and kind = 'seed'`);
      return rows.map((r) => ({ slug: r.slug, name: r.name, common: commonName(r) })).filter((r) => r.common.length >= 3);
    })().catch(() => []);
  }
  return breederCache;
}
export function matchBreeder(index, text) {
  const t = ` ${String(text || "").toLowerCase()} `;
  return index.find((b) => new RegExp(`[^a-z0-9]${b.common.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^a-z0-9]`).test(t)) || null;
}

export async function getCompany(slug) {
  const sql = db();
  if (!sql) throw new Error("DATABASE_URL is not set");
  // Errors propagate (no false 404 while the database is unreachable).
  const rows = await retry(() => sql`select slug, kind, name, domain, home_url, country, segments, featured, featured_until, verified, verified_until, profile, reviewed_at, updated_at
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
