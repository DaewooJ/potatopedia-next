// Contextual links from older, well-indexed templates to the reference sections (diseases, prices, machines, market,
// reports, companies, events). Every href is built from real data (lib/reference, lib/market, reports manifest) or
// from the published directory, so each one resolves with a 200. Neutral ordering: topical, never by country priority.
import REPORTS from "./reports-manifest.json";
import { PROBLEMS } from "./market";
import { DISEASES } from "./reference/diseases";
import { landingPages, countrySlug, DIRECTORY_PUBLIC, listCompanies } from "./directory";

const dLink = (slug) => {
  const d = DISEASES.find((x) => x.slug === slug);
  return d && { href: `/diseases/${slug}`, k: "Disease guide", t: d.name, s: "Cause, symptoms and control." };
};

const PRICE_PAGES = { india: "India potato prices", europe: "Europe potato prices", usa: "USA potato prices", futures: "Potato futures" };
const EUROPE = new Set(["netherlands", "germany", "france", "belgium", "poland", "denmark", "spain", "united-kingdom"]);

const EMPTY = { countries: new Set(), kinds: new Set(), segments: new Set() };
let _dir; // build-time cache of what the published directory contains (never throws)
export async function directoryFacts() {
  if (!_dir) {
    _dir = (async () => {
      if (!DIRECTORY_PUBLIC) return EMPTY;
      const rows = await listCompanies();
      const lp = landingPages(rows);
      return { countries: new Set(lp.countries.map(countrySlug)), kinds: new Set(rows.map((r) => r.kind)), segments: new Set(lp.segments) };
    })().catch(() => EMPTY);
  }
  return _dir;
}

const uniq = (items) => { const seen = new Set(); return items.filter((i) => i && !seen.has(i.href) && seen.add(i.href)); };

export function diseaseLinksFor(text) {
  const t = String(text || "").toLowerCase();
  const out = [];
  if (/blight|phytophthora|infestans/.test(t)) out.push(dLink("late-blight"));
  if (/blackleg|soft rot|erwinia|pectobacter|dickeya/.test(t)) out.push(dLink("blackleg-soft-rot"));
  if (/bacterial wilt|brown rot|ralstonia/.test(t)) out.push(dLink("bacterial-wilt-brown-rot"));
  if (/nematode|\bpcn\b|cyst|globodera/.test(t)) out.push(dLink("potato-cyst-nematode"));
  if (/scab/.test(t)) out.push(dLink("common-scab"));
  if (/\bpvy\b|virus|plrv|leafroll/.test(t)) out.push(dLink("pvy-viruses"));
  return out.filter(Boolean);
}

const DIS_HUB = { href: "/diseases", k: "Reference", t: "Potato diseases and pests", s: "Six major diseases: symptoms, control and resistant varieties." };
const REPORTS_HUB = { href: "/reports", k: "Reports", t: "Country potato market reports", s: "Production, trade and prices by country." };

export async function relatedForVariety(v, traits) {
  const res = traits?.resistances;
  const text = typeof res === "string" ? res : res ? JSON.stringify(res) : "";
  const items = [...uniq(diseaseLinksFor(text)).slice(0, 3), DIS_HUB];
  const f = await directoryFacts();
  if (f.kinds.has("seed")) items.push({ href: "/companies/seed", k: "Directory", t: "Seed potato breeders and growers", s: "Published company profiles with sources." });
  items.push(REPORTS_HUB);
  return { title: `More on ${v.name}`, items: uniq(items) };
}

export async function relatedForCountry(slug, name) {
  const items = [];
  if (REPORTS[slug]) items.push({ href: `/reports/${slug}`, k: "Market report", t: `${name} potato market report`, s: "Production, trade and prices, every figure sourced." });
  const region = slug === "india" ? "india" : slug === "united-states" ? "usa" : EUROPE.has(slug) ? "europe" : null;
  if (region) items.push({ href: `/prices/${region}`, k: "Prices", t: PRICE_PAGES[region], s: "How the price is formed, with reference points by year." });
  const f = await directoryFacts();
  if (f.countries.has(slug)) items.push({ href: `/companies/country/${slug}`, k: "Directory", t: `Potato companies in ${name}`, s: "Processors, seed companies and machinery makers." });
  items.push({ href: "/market", k: "Market", t: "Machinery problem market", s: "Six costly problems in potato production and the machines that fix them." });
  items.push(DIS_HUB);
  if (!REPORTS[slug]) items.push(REPORTS_HUB);
  return { title: `${name}: related sections`, items: uniq(items) };
}

// Topic keywords on the page's slug / title / question text.
export async function relatedForText(text, { max = 5 } = {}) {
  const t = String(text || "").toLowerCase().replace(/-/g, " ");
  const has = (re) => re.test(t);
  const items = [];
  const f = await directoryFacts();

  if (has(/disease|pest|blight|blackleg|nematode|virus|scab|wilt|\brot\b|famine|pvy/)) {
    items.push(...diseaseLinksFor(t), DIS_HUB);
  }

  if (has(/price|futures|worth|market size|\bmarket\b/)) {
    items.push({ href: "/prices", k: "Prices", t: "Potato prices", s: "India, Europe, USA and futures explained." });
    if (has(/india/)) items.push({ href: "/prices/india", k: "Prices", t: PRICE_PAGES.india });
    if (has(/europe|netherlands|belgium|germany/)) items.push({ href: "/prices/europe", k: "Prices", t: PRICE_PAGES.europe });
    if (has(/\bus\b|usa|united states|american/)) items.push({ href: "/prices/usa", k: "Prices", t: PRICE_PAGES.usa });
    if (has(/futures/)) items.push({ href: "/prices/futures", k: "Prices", t: PRICE_PAGES.futures });
  }

  const mach = [
    [/sort(er|ing)?\b|defect/, "optical-sorting-defects"],
    [/grad(e|er|ing)\b/, "potato-grading"],
    [/harvest/, "potato-harvesters"],
    [/plant(er|ing)\b|spacing/, "potato-planters"],
    [/storage|store\b|stored|cold chain|sprout|ventilat|shelf life/, "potato-storage-sprouting"],
    [/process|fries|french fr|chips|crisps|frozen|starch|flakes/, "potato-processing-lines"],
  ];
  const probs = mach.filter(([re]) => has(re)).map(([, s]) => PROBLEMS.find((p) => p.slug === s)).filter(Boolean);
  for (const p of probs.slice(0, 2)) {
    items.push({ href: `/machines/${p.machineSlug}`, k: "Machines", t: `${p.machine[0].toUpperCase()}${p.machine.slice(1)}: makers and buying guide` });
    items.push({ href: `/market/${p.slug}`, k: "Market", t: `${p.problem}: the problem and its fix` });
  }
  if (probs.length && has(/process|fries|french fr|chips|frozen|starch/) && f.kinds.has("processing")) {
    items.push({ href: "/companies/processors", k: "Directory", t: "Potato processors directory" });
  }

  if (has(/trade|export|import|production|produc|consum|statistic|industry|china|india|netherlands|united states|\bus\b/)) {
    items.push(REPORTS_HUB);
    for (const [slug, re] of [["china", /china|chinese/], ["india", /india/], ["netherlands", /netherlands|dutch/], ["united-states", /united states|\bus\b|usa|american|idaho/]]) {
      if (REPORTS[slug] && has(re)) items.push({ href: `/reports/${slug}`, k: "Market report", t: `${REPORTS[slug].name} potato market report` });
    }
  }

  if (has(/expo|congress|event|trade show|conference/)) items.push({ href: "/events", k: "Events", t: "Potato industry events calendar" });

  if (!items.length) items.push(REPORTS_HUB, { href: "/prices", k: "Prices", t: "Potato prices" }, DIS_HUB);
  return { title: "Related reference sections", items: uniq(items).slice(0, max) };
}
