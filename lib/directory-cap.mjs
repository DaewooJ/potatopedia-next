// Per-country balance cap for the company directory (Devendra, 7 Nov 2026: "a per-country cap so the Dutch don't
// dominate"). Potatopedia is neutral and global: no country gets priority. Plain ESM with no imports, so both the
// site (lib/directory.js) and scripts/directory-import.mjs use the same rule.
//
// Rule: at most COUNTRY_CAP_PER_KIND published companies per country per kind (processing / seed / machinery).
// Rows over the cap are NOT deleted: published = false, and a line "held: country cap (<country>, <kind>)" is appended
// to pp_companies.log (profile kept). A held row is published again automatically when the cap allows (constant raised
// or another row in that country leaves), logged as "released: country cap (...)".
// Which rows are kept is neutral and documented, by verification quality first (Devendra, 7 Nov 2026: hand-checked
// profiles must not lose to machine drafts on an alphabetical tie-break):
//   1. checked by the company itself (verified, valid verified_until)
//   2. checked by hand by the editors (log line "reviewed: by hand")
//   3. machine-drafted from official sources
// then higher completeness score (sourced profile fields + number of sources), then the oldest found_at, then slug.
// Never by company size or fame.
// DROPPED 7 Nov 2026 (Devendra: "lets drop the idea of 12 companies per country"): no cap; every row that passes the
// gate is published. The machinery stays so held rows are released by the next --cap-only --apply run.
export const COUNTRY_CAP_PER_KIND = Infinity;

export const HELD_MARK = "held: country cap";
export const RELEASED_MARK = "released: country cap";
export const HAND_MARK = "reviewed: by hand";

// 2 = company-verified, 1 = hand-reviewed by the editors, 0 = machine draft.
export function quality(r) {
  if (r.verified && (!r.verified_until || new Date(r.verified_until) >= new Date())) return 2;
  return String(r.log || "").includes(HAND_MARK) ? 1 : 0;
}

export function isHeld(log) {
  const s = String(log || "");
  return s.lastIndexOf(HELD_MARK) > s.lastIndexOf(RELEASED_MARK);
}

const has = (v) => (Array.isArray(v) ? v.length > 0 : v && typeof v === "object" ? Object.keys(v).length > 0 : !!v);

// Number of sourced profile fields present + number of sources.
export function completeness(profile) {
  const p = profile || {};
  const c = p.contact || {};
  const fields = [p.summary, p.hq?.city, p.founded, p.ownership, p.products, p.machines, p.varieties, p.brands, p.plants,
    p.markets, p.certifications, p.facts, c.website, c.public_email, c.phone, c.address].filter(has).length;
  return fields + (Array.isArray(p.sources) ? p.sources.length : 0);
}

// rows: { slug, country, kind, profile, found_at, published, log, verified, verified_until } (eligible rows only: published, or held by the cap).
// Returns { keep: Set(slug), hold: [{row, score}] , groups } using the neutral order.
export function decideCap(rows, cap = COUNTRY_CAP_PER_KIND) {
  const groups = new Map();
  for (const r of rows) {
    if (!r.country) continue;
    const k = `${r.country}\u0000${r.kind}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push({ row: r, q: quality(r), score: completeness(r.profile) });
  }
  const keep = new Set();
  const hold = [];
  for (const list of groups.values()) {
    list.sort((a, b) => b.q - a.q || b.score - a.score || new Date(a.row.found_at) - new Date(b.row.found_at) || a.row.slug.localeCompare(b.row.slug));
    list.forEach((x, i) => (i < cap ? keep.add(x.row.slug) : hold.push(x)));
  }
  return { keep, hold, groups };
}

// Interleave countries round-robin (alphabetical country order as tie-break) within each kind; kinds are interleaved
// round by round too, so the default list reads global. Within a country: A–Z by common name (input order).
export function interleave(items, kindOrder = ["processing", "seed", "machinery"]) {
  const seen = new Map();
  const ranked = items.map((c, i) => {
    const k = `${c.country}\u0000${c.kind}`;
    const rank = seen.get(k) || 0;
    seen.set(k, rank + 1);
    return { c, rank, i };
  });
  const ki = (k) => { const n = kindOrder.indexOf(k); return n < 0 ? 99 : n; };
  return ranked
    .sort((a, b) => a.rank - b.rank || ki(a.c.kind) - ki(b.c.kind) || String(a.c.country).localeCompare(String(b.c.country)) || a.i - b.i)
    .map((x) => x.c);
}
