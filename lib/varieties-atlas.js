// Slim data for the /varieties atlas + finder (server only).
// Everything here is derived from lib/varieties-data.js (names, regions, uses, origin, year) and
// lib/variety-traits.json (published datasheet traits). No figure is invented: facts are quoted from the
// traits register with the publisher named; buckets (maturity, skin colour…) are plain groupings of those texts.
import { VARIETIES, ICONIC_VARIETIES } from "./varieties-data";
import TRAITS from "./variety-traits.json";

// ── Publisher and breeder short names ──
const PUBLISHER_SHORT = [
  [/USDA-ARS/i, "USDA-ARS"],
  [/ICAR|CPRI/i, "ICAR-CPRI"],
  [/Germicopa/i, "Germicopa"],
  [/Agrico/i, "Agrico"],
  [/International Potato Center|\bCIP\b/i, "CIP"],
  [/HZPC/i, "HZPC"],
  [/Meijer/i, "C. Meijer"],
  [/STET/i, "STET Holland"],
  [/Sarpo|Sarvari/i, "Sarpo"],
];
function shortPublisher(p) {
  if (!p) return null;
  for (const [re, s] of PUBLISHER_SHORT) if (re.test(p)) return s;
  return p.length > 24 ? p.slice(0, 24).trim() + "…" : p;
}

const BREEDER_SHORT = [
  [/^HZPC|\bHZPC\b/, "HZPC"],
  [/\bZPC\b/, "ZPC (now HZPC)"],
  [/Lantm[aä]nnen/i, "Lantmännen / Agrico"],
  [/Agrico/i, "Agrico"],
  [/Meijer/i, "C. Meijer"],
  [/Germicopa/i, "Germicopa"],
  [/ICAR-CPRI|CPRI/i, "ICAR-CPRI"],
  [/KALRO|KARI/i, "KALRO / CIP"],
  [/International Potato Center|\bCIP\b/i, "CIP"],
  [/Cornell/i, "Cornell University"],
  [/North Dakota State|NDSU/i, "NDSU"],
  [/Colorado State/i, "Colorado State Univ."],
  [/Agriculture and Agri-Food Canada/i, "Agriculture Canada"],
  [/Guelph/i, "University of Guelph"],
  [/Wisconsin/i, "Univ. of Wisconsin"],
  [/USDA-ARS/i, "USDA-ARS"],
  [/Sarvari|Sarpo/i, "Sarvari Trust"],
  [/Luther Burbank/i, "Public (Luther Burbank)"],
  [/Heritage variety/i, "Heritage, public"],
  [/STET/i, "STET Holland"],
];
function shortBreeder(s) {
  if (!s) return null;
  for (const [re, l] of BREEDER_SHORT) if (re.test(s)) return l;
  return null;
}

// origin strings look like "USA (1872)", "France / Germicopa", "India / ICAR-CPRI (1998)".
function parseOrigin(origin) {
  const o = String(origin || "").replace(/\s*\([^)]*\)\s*/g, " ").trim();
  if (o.includes(" / ")) {
    const [country, ...rest] = o.split(" / ");
    return { country: country.trim(), breeder: rest.join(" / ").trim() };
  }
  return { country: o, breeder: null };
}

// ── Text helpers ──
function clip(s, max = 96) {
  let t = String(s || "").split(" — ")[0].trim();
  if (t.length <= max) return t;
  t = t.slice(0, max);
  return t.slice(0, t.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}
function year4(y) {
  const m = String(y || "").match(/\d{4}/);
  return m ? m[0] : "";
}

// ── Buckets ──
export const MATURITY_ORDER = ["Very early", "Early", "Medium-early", "Maincrop", "Medium-late", "Late"];
function maturityBucket(t) {
  const s = String(t || "").toLowerCase();
  if (!s) return null;
  if (/very early/.test(s)) return "Very early";
  if (/very late/.test(s)) return "Late";
  if (/medium[- ]?late|medium to medium-late/.test(s)) return "Medium-late";
  if (/early maincrop|medium[- ]?early|semi-early|early to medium|early\/medium|second-early/.test(s)) return "Medium-early";
  if (/\blate\b/.test(s)) return "Late";
  if (/\bearly\b/.test(s)) return "Early";
  if (/maincrop|main crop|medium/.test(s)) return "Maincrop";
  return null;
}

// First colour word in the text decides the group ("Red with cream eyes" → red).
function firstWord(text, table) {
  const s = String(text || "").toLowerCase();
  let best = null;
  for (const [re, val] of table) {
    const m = s.match(re);
    if (m && (best === null || m.index < best.i)) best = { i: m.index, val };
  }
  return best ? best.val : null;
}
const SKIN_TABLE = [
  [/purple|blue/, ["Purple", "#5E3E72"]],
  [/russet|brown/, ["Russet", "#8F6D49"]],
  [/\bred\b|dark red/, ["Red", "#B04E46"]],
  [/pink/, ["Red / pink", "#C47B78"]],
  [/buff|tan\b/, ["Buff", "#CDB48A"]],
  [/yellow/, ["Yellow", "#D8B86C"]],
  [/white|cream/, ["White / cream", "#E6D9BE"]],
];
const FLESH_TABLE = [
  [/purple|blue|violet/, ["Purple / blue", "#6B3F8A"]],
  [/\bred\b|pink/, ["Red / pink", "#C7525C"]],
  [/deep yellow|dark yellow/, ["Yellow", "#EDCB6B"]],
  [/yellow/, ["Yellow", "#F2DF9E"]],
  [/cream/, ["Cream", "#F4EACB"]],
  [/white/, ["White", "#F8F3E6"]],
];
const SKIN_KEY = { Purple: "Purple", Russet: "Russet", Red: "Red / pink", "Red / pink": "Red / pink", Buff: "Buff", Yellow: "Yellow", "White / cream": "White / cream" };

// ── Resistance ratings: class 2 = rated resistant/high, 1 = moderate, 0 = susceptible/low, null = no usable rating ──
function classify(text) {
  const s = String(text || "").toLowerCase().trim();
  if (!s) return null;
  if (/null resistance/.test(s)) return 0;
  const agrico = s.match(/\/\s*(\d+(?:\.\d+)?)\s*\(agrico score/);
  if (agrico) { const n = parseFloat(agrico[1]); return n >= 7 ? 2 : n >= 6 ? 1 : 0; }
  const bare = s.match(/^(\d+(?:\.\d+)?)(\s*\(hzpc own analysis\))?$/);
  if (bare) { const n = parseFloat(bare[1]); if (n <= 9) return n >= 7 ? 2 : n >= 5 ? 1 : 0; return null; }
  if (/hzpc score/.test(s)) return null; // published on a scale we do not convert
  if (/overcome|lost resistance|reduced effective|subsequently lost/.test(s)) return 1;
  if (/susceptible control|^susceptible|^low|low resistance|fairly low|generally susceptible|^variable/.test(s)) return 0;
  if (/not susceptible|full resistance|high resistance|very high|strong resistance|exceptional|^high|highest tolerance|^resistant|^good|good (field )?resistance|better late blight|fairly high/.test(s)) return 2;
  if (/moderate|medium|partial|tolerance/.test(s)) return 1;
  return null;
}

// Split a free-text summary into clauses and pick the clause about one disease.
function fromSummary(summary, re) {
  if (!summary) return null;
  const clauses = String(summary).split(/(?<=[.;])\s+/);
  for (const c of clauses) {
    if (re.test(c)) return { cls: classify(c), text: clip(c.replace(/[.;]$/, ""), 110) };
  }
  return null;
}

const LB_RE = /late blight|(?<!early )\bblight\b/i;
const PCN_RE = /nematode|\bpcn\b|globodera/i;
const PVY_RE = /\bpvy|virus y|net necrosis/i;

function rating(res, keys, label) {
  for (const k of keys) {
    if (res[k] != null && String(res[k]).trim()) return { cls: classify(res[k]), text: `${label(k)}: ${clip(res[k], 80)}` };
  }
  return null;
}

const PCN_LABEL = { pcn_ro1_4: "PCN Ro1-4", pcn_ro1: "PCN Ro1", pcn_ro2_3: "PCN Ro2/3", pcn_pa2: "PCN Pa2", pcn_pa3: "PCN Pa3", pcn: "PCN" };

function resistances(t) {
  const res = t.resistances || {};
  const lb =
    rating(res, ["late_blight_foliage", "late_blight"], (k) => (k === "late_blight_foliage" ? "Late blight (foliage)" : "Late blight")) ||
    (() => { const r = fromSummary(res.summary, LB_RE); return r ? { cls: r.cls, text: r.text } : null; })();
  const pvy = rating(res, ["pvy"], () => "PVY") || fromSummary(res.summary, PVY_RE);

  // PCN: keep each published pathotype; the best class decides "resists PCN", Ro and Pa kept apart for the rail.
  const pcnParts = Object.keys(PCN_LABEL).filter((k) => res[k] != null).map((k) => ({ k, cls: classify(res[k]), v: clip(res[k], 40) }));
  let pcn = null, ro = null, pa = null;
  if (pcnParts.length) {
    const best = Math.max(...pcnParts.map((p) => (p.cls == null ? -1 : p.cls)));
    pcn = { cls: best < 0 ? null : best, text: pcnParts.map((p) => `${PCN_LABEL[p.k]} ${p.v}`).join("; ") };
    const roP = pcnParts.filter((p) => /ro|^pcn$/.test(p.k)).map((p) => p.cls ?? -1);
    const paP = pcnParts.filter((p) => /pa/.test(p.k)).map((p) => p.cls ?? -1);
    ro = roP.length ? Math.max(...roP) : null;
    pa = paP.length ? Math.max(...paP) : null;
  } else {
    const r = fromSummary(res.summary, PCN_RE);
    if (r) { pcn = r; ro = r.cls; }
  }
  return { lb, pvy, pcn, ro, pa };
}

const HEAT_RE = /heat[- ]toleran|tolerant to heat|good heat|drought[- ]toleran/i;
function heatRating(t, mb, pub) {
  const texts = [...(t.highlights || []), ...(t.use || []), t.resistances?.summary || "", t.storage || ""];
  const hit = texts.find((x) => HEAT_RE.test(x));
  if (hit) {
    const clause = String(hit).split(/(?<=[.;])\s+/).find((c) => HEAT_RE.test(c)) || hit;
    return { cls: 2, text: `${clip(clause.replace(/[.;]$/, ""), 90)} (${pub})` };
  }
  if (!t.maturity) return null;
  const cls = mb === "Very early" || mb === "Early" ? 2 : mb === "Medium-early" ? 1 : mb ? 0 : null;
  return { cls, text: `Maturity: ${clip(t.maturity, 60)} (${pub})` };
}

// ── Uses ──
const USE_SHORT = {
  "Frying / Fries": "Fries", Chips: "Chips", "Boiling / Salad": "Boiling", "Baking / Roasting": "Baking", Mashing: "Mashing",
  "Fresh market": "Fresh market", "Processing / Industrial": "Processing", "All-purpose": "All-purpose", Specialty: "Specialty",
};
const TABLE_USES = ["Boiling / Salad", "Mashing", "Baking / Roasting", "Fresh market", "All-purpose"];
function useGroups(v, t) {
  const uses = v.uses || [];
  const tu = (t?.use || []).join(" ").toLowerCase();
  const g = [];
  if (uses.includes("Frying / Fries") || /fries|french fr|frying/.test(tu)) g.push("fries");
  if (uses.includes("Chips") || /chip|crisp/.test(tu)) g.push("chips");
  if (uses.some((u) => TABLE_USES.includes(u)) || /table|fresh/.test(tu)) g.push("table");
  if (/starch/.test(tu) || /starch variety|industrial starch|starch production/i.test(v.trait || "")) g.push("starch");
  if (v.region === "Andean / Native") g.push("native");
  return g;
}
export const USE_CHIPS = [
  { k: "all", l: "All varieties" },
  { k: "fries", l: "Fries" },
  { k: "chips", l: "Chips" },
  { k: "table", l: "Table" },
  { k: "starch", l: "Starch" },
  { k: "native", l: "Native" },
];

// ── Card fact: dry matter first, then maturity, then a late blight rating; always with the publisher ──
function dmNumber(dm) {
  const m = String(dm || "").match(/^(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?%/);
  if (!m) return null;
  return m[2] ? (parseFloat(m[1]) + parseFloat(m[2])) / 2 : parseFloat(m[1]);
}
function dmText(dm) {
  const s = String(dm || "").trim();
  if (!s || /no figure|^medium$/i.test(s)) return null;
  const pct = s.match(/^\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?%/);
  if (pct) return `Dry matter ${pct[0].replace(/\s+/g, "")}`;
  if (/%/.test(s)) return `Dry matter ${s.charAt(0).toLowerCase() + s.slice(1)}`;
  return null;
}

// ── Build ──
const slimF = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && !v.length)));
let CACHE = null;
export function getAtlasData(seedCompanies = []) {
  if (CACHE && CACHE.n === seedCompanies.length) return CACHE.data;
  const exporters = seedCompanies.filter((c) => (c.segments || []).includes("seed-export"));
  const companyFor = (...names) => {
    for (const n of names) {
      const key = String(n || "").split(/[ /(]/)[0].toUpperCase();
      if (key.length < 3) continue;
      const hit = seedCompanies.find((c) => c.name.toUpperCase().includes(key));
      if (hit) return hit;
    }
    return null;
  };

  const cards = [];
  const finder = {};
  for (const v of VARIETIES) {
    const t = TRAITS[v.slug] || null;
    const o = parseOrigin(v.origin);
    const pub = t ? shortPublisher(t.sources?.[0]?.publisher) : null;
    const SEED_HOUSES = ["HZPC", "Agrico", "Germicopa", "C. Meijer", "STET Holland", "Sarpo"];
    const breeder = (t && (shortBreeder(t.breeder) || shortBreeder(t.country) || (SEED_HOUSES.includes(pub) ? pub : null))) || o.breeder || null;
    const country = t?.country ? String(t.country).split(" / ")[0] : o.country;
    const mb = t ? maturityBucket(t.maturity) : null;
    const skin = t ? firstWord(t.skin, SKIN_TABLE) : null;
    const flesh = t ? firstWord(t.flesh, FLESH_TABLE) : null;
    const r = t ? resistances(t) : null;

    const facts = [];
    if (t) {
      const dm = dmText(t.dry_matter);
      if (dm) facts.push(`${dm} (${pub})`);
      if (t.maturity) facts.push(`Maturity: ${clip(t.maturity, 48)} (${pub})`);
      if (r?.lb) facts.push(`${r.lb.text} (${pub})`);
    }
    const rz = [];
    if (r?.lb?.cls === 2) rz.push("lb");
    if (r?.ro === 2) rz.push("ro");
    if (r?.pa === 2) rz.push("pa");
    if (r?.pvy?.cls === 2) rz.push("pvy");

    const g = useGroups(v, t);
    const co = t ? companyFor(breeder, pub) : companyFor(breeder);
    const exportCo = co && exporters.includes(co) ? co : null;
    if (exportCo || /export/i.test(v.trait || "")) g.push("export");

    cards.push({
      s: v.slug,
      n: v.name,
      y: year4(t?.year || v.year),
      r: v.region,
      b: breeder,
      c: country,
      u: (v.uses || []).map((u) => USE_SHORT[u] || u).slice(0, 3),
      g,
      f: facts.slice(0, 2),
      sk: skin ? skin[1] : null,
      fl: flesh ? flesh[1] : null,
      ks: skin ? SKIN_KEY[skin[0]] : null,
      kf: flesh ? flesh[0] : null,
      m: mb,
      rz,
      dm: t ? dmNumber(t.dry_matter) : null,
      t: t ? 1 : 0,
      i: ICONIC_VARIETIES.has(v.slug) ? 1 : 0,
      co: co ? co.slug : null,
    });

    if (t) {
      const q = [];
      const dm = dmText(t.dry_matter);
      if (t.frying_quality) q.push({ k: "fries", text: `Frying quality: ${clip(t.frying_quality, 40)} (${pub})` });
      if (t.crisping_quality) q.push({ k: "chips", text: `Crisping quality: ${clip(t.crisping_quality, 40)} (${pub})` });
      if (t.specific_gravity) q.push({ k: "chips", text: `Specific gravity ${clip(String(t.specific_gravity).split(" (")[0], 30)} (${pub})` });
      if (t.cooking_type) q.push({ k: "table", text: `Cooking type: ${clip(t.cooking_type, 40)} (${pub})` });
      if (t.starch) q.push({ k: "starch", text: `Starch ${clip(t.starch, 30)} (${pub})` });
      if (dm) q.push({ k: "dm", text: `${dm} (${pub})` });
      finder[v.slug] = slimF({
        lb: r.lb ? [r.lb.cls, `${r.lb.text} (${pub})`] : null,
        pcn: r.pcn ? [r.pcn.cls, `${clip(r.pcn.text, 110)} (${pub})`] : null,
        pvy: r.pvy ? [r.pvy.cls, `${r.pvy.text} (${pub})`] : null,
        heat: (() => { const h = heatRating(t, mb, pub); return h ? [h.cls, h.text] : null; })(),
        q,
        fq: t.frying_quality ? parseFloat((String(t.frying_quality).match(/(\d+(?:\.\d+)?)\s*$/) || [])[1]) || null : null,
        cq: t.crisping_quality ? parseFloat((String(t.crisping_quality).match(/(\d+(?:\.\d+)?)\s*$/) || [])[1]) || null : null,
        ex: exportCo ? exportCo.name : null,
      });
    }
  }

  // Default order: varieties with datasheet facts first, iconic first within, then A–Z.
  cards.sort((a, b) => b.t - a.t || b.i - a.i || a.n.localeCompare(b.n));
  // Only the first fact goes to the client card.
  for (const c of cards) c.f = c.f[0] || null;

  const count = (k) => cards.filter((c) => c.g.includes(k)).length;
  const useCounts = { all: cards.length, fries: count("fries"), chips: count("chips"), table: count("table"), starch: count("starch"), native: count("native"), export: count("export") };

  const tally = (fn) => {
    const m = {};
    for (const c of cards) for (const v of [].concat(fn(c) || [])) if (v) m[v] = (m[v] || 0) + 1;
    return m;
  };
  const regions = tally((c) => c.r);
  const breeders = tally((c) => c.b);
  const facets = [
    { k: "r", title: "Region of origin", options: Object.keys(regions).sort((a, b) => regions[b] - regions[a]).map((v) => ({ v, n: regions[v] })) },
    { k: "m", title: "Maturity", note: "As published", options: MATURITY_ORDER.map((v) => ({ v, n: tally((c) => c.m)[v] || 0 })).filter((o) => o.n) },
    { k: "ks", title: "Skin", options: (() => { const t = tally((c) => c.ks); return Object.keys(t).sort((a, b) => t[b] - t[a]).map((v) => ({ v, n: t[v] })); })() },
    { k: "kf", title: "Flesh", options: (() => { const t = tally((c) => c.kf); return Object.keys(t).sort((a, b) => t[b] - t[a]).map((v) => ({ v, n: t[v] })); })() },
    {
      k: "rz", title: "Disease resistance", note: "Rated resistant by the publisher (7+ of 9, or “resistant”/“high”)",
      options: [["lb", "Late blight"], ["ro", "PCN Ro (G. rostochiensis)"], ["pa", "PCN Pa2/3 (G. pallida)"], ["pvy", "PVY"]]
        .map(([v, l]) => ({ v, l, n: cards.filter((c) => c.rz.includes(v)).length })).filter((o) => o.n),
    },
    { k: "b", title: "Breeder", options: Object.keys(breeders).filter((b) => breeders[b] >= 3).sort((a, b) => breeders[b] - breeders[a]).slice(0, 10).map((v) => ({ v, n: breeders[v] })) },
  ].filter((f) => f.options.length > 1);

  // Slim payload: drop empty fields (the client treats a missing field as empty).
  const slim = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== "" && v !== 0 && !(Array.isArray(v) && !v.length)));
  const data = {
    cards: cards.map(slim),
    finder,
    useCounts,
    facets,
    regionList: Object.keys(regions).sort(),
    stats: { total: cards.length, withTraits: cards.filter((c) => c.t).length, regions: Object.keys(regions).length, breeders: Object.keys(breeders).length },
  };
  CACHE = { n: seedCompanies.length, data };
  return data;
}
