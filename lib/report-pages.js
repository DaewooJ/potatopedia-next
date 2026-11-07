// Data layer for the public report landing pages (/reports, /reports/[slug]).
// Everything is built from the same sources as the gated 10-page PDF: scripts/reports/content.mjs (editorial figures with
// their publishers), lib/faostat-timeseries.js (FAOSTAT series, trade) and lib/facts.js (India headline, latest estimate wins).
// New reports appear automatically when lib/reports-manifest.json gains an entry (and content.mjs has its CONTENT entry).
import MANIFEST from "./reports-manifest.json";
import { CONTENT, EDITION } from "../scripts/reports/content.mjs";
import { PRODUCTION_TIMESERIES, TRADE_TIMESERIES, FAOSTAT_YEARS } from "./faostat-timeseries";
import { INDIA_POTATO } from "./facts";

export const SITE = "https://www.potatopedia.com";
export const REPORT_EDITION = EDITION; // { month: "November 2026", code: "2026-11", asOf: "7 November 2026" }
export const REPORT_DATE = "2026-11-07";
export const FAO = "FAOSTAT (QCL, Item 116 Potatoes)";
export const FAO_TM = "FAOSTAT (TM, fresh potatoes)";
const LY = FAOSTAT_YEARS[FAOSTAT_YEARS.length - 1];
const FY = FAOSTAT_YEARS[0];

export const REPORT_WIKIDATA = {
  china: "https://www.wikidata.org/wiki/Q148",
  india: "https://www.wikidata.org/wiki/Q668",
  "united-states": "https://www.wikidata.org/wiki/Q30",
  netherlands: "https://www.wikidata.org/wiki/Q55",
};

// Next countries in line (links go to the free country profile until their report exists).
export const COMING_SOON = [
  ["ukraine", "Ukraine"], ["russia", "Russia"], ["germany", "Germany"], ["bangladesh", "Bangladesh"],
  ["france", "France"], ["belgium", "Belgium"], ["pakistan", "Pakistan"], ["egypt", "Egypt"],
];

const f = (v, d = 1) => Number(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const kfSrc = (k) => `${k.src}${k.year ? `, ${k.year}` : ""}${k.unsourced ? " (figure as stated on the Potatopedia country profile; primary publisher being confirmed)" : ""}`;

function ranked() {
  return Object.entries(PRODUCTION_TIMESERIES).filter(([, s]) => typeof s[LY] === "number").sort((a, b) => b[1][LY] - a[1][LY]).map(([slug]) => slug);
}

export function listReportSlugs() {
  return Object.keys(MANIFEST).filter((s) => CONTENT[s] && PRODUCTION_TIMESERIES[s]);
}

export function getReport(slug) {
  const m = MANIFEST[slug], c = CONTENT[slug];
  if (!m || !c || !PRODUCTION_TIMESERIES[slug]) return null;
  const name = m.name || c.name;
  const series = FAOSTAT_YEARS.map((y) => ({ y, v: PRODUCTION_TIMESERIES[slug][y] })).filter((p) => typeof p.v === "number");
  const rk = ranked();
  const rank = rk.indexOf(slug) + 1, nRanked = rk.length;
  const first = series[0], last = series[series.length - 1];
  const chg = ((last.v - first.v) / first.v) * 100;
  const peak = series.reduce((a, b) => (b.v > a.v ? b : a));
  const tr = TRADE_TIMESERIES[slug] || {};
  const exportQ = tr.export_qty?.[LY] ?? null, importQ = tr.import_qty?.[LY] ?? null;
  const exportV = tr.export_val?.[LY] ?? null, importV = tr.import_val?.[LY] ?? null;

  const national = !!c.headline?.useNational;
  const head = national
    ? { v: INDIA_POTATO.value, year: INDIA_POTATO.year, src: `${INDIA_POTATO.label}, ${INDIA_POTATO.publisher}`, short: `${INDIA_POTATO.year}, ${INDIA_POTATO.label}` }
    : { v: series[series.length - 1].v, year: String(LY), src: FAO, short: `FAOSTAT ${LY}` };
  const faoLatest = PRODUCTION_TIMESERIES[slug][LY];
  const k = c.kf;

  const sentences = [
    { t: `${name} produced ${f(head.v)} million tonnes of potatoes in ${head.year}, ranking #${rank} of ${nRanked} producing countries in the FAOSTAT ${LY} series.`, s: `${head.src}${national ? `; rank from ${FAO}, ${LY}` : `, ${LY}`}` },
    { t: `On the FAOSTAT series, output ${chg >= 0 ? "rose" : "fell"} ${f(Math.abs(chg))}% between ${FY} and ${LY}, from ${f(first.v, first.v < 10 ? 2 : 1)} to ${f(last.v, last.v < 10 ? 2 : 1)} million tonnes${national ? `; FAOSTAT shows ${f(faoLatest, 2)} Mt for calendar ${LY}, while the national ${INDIA_POTATO.year} ${INDIA_POTATO.label} is the more advanced estimate` : `, with a peak of ${f(peak.v, peak.v < 10 ? 2 : 1)} Mt in ${peak.y}`}.`, s: `${FAO}, ${FY}–${LY}` },
    { t: `The harvested area is ${k.area.v} ${k.area.unit}${k.area.year ? ` (${k.area.year})` : ""} and the national average yield is ${k.yield.v} ${k.yield.unit}.`, s: `${kfSrc(k.area)}; ${kfSrc(k.yield)}` },
    { t: `Apparent consumption is ${k.consumption.v} ${k.consumption.unit}.`, s: kfSrc(k.consumption) },
    ...(exportQ != null && importQ != null
      ? [{ t: `Fresh-potato exports were ${f(exportQ)} thousand tonnes (US$ ${f(exportV)} million) and imports ${f(importQ)} thousand tonnes (US$ ${f(importV)} million) in ${LY}.`, s: `${FAO_TM}, ${LY}` }]
      : []),
    ...c.summary.map((x) => ({ t: x.t, s: x.s })),
  ];

  const toc = [
    ["Key figures", "Production, area, yield, rank, consumption, trade balance", 3],
    ["Production, area & yield", `FAOSTAT ${FY}–${LY} series and peer comparison`, 4],
    ["Trade", "Fresh-potato flows and processed-product exports", 5],
    ["Regions & varieties", "Where the crop is grown and what is planted", 6],
    ["Industry", "Processors, seed houses and machinery makers", 7],
    ["Outlook & key issues", "Constraints and what to watch", 8],
    ["Sources & method", "Every figure's publisher and year", 9],
  ];

  const keyFigures = [
    { l: "Production", v: f(head.v), u: "million tonnes", s: `${head.short}${national ? ` (${INDIA_POTATO.publisher})` : ""}`, vn: head.v },
    { l: "World rank", v: `#${rank}`, u: `of ${nRanked} producing countries`, s: `${FAO}, ${LY}`, vn: rank },
    { l: "Per-capita consumption", v: k.consumption.v, u: k.consumption.unit, s: kfSrc(k.consumption).replace(/ \(figure as stated.*$/, ""), vn: null },
  ];

  const faq = [
    { q: `How much potato does ${name} produce?`, a: `${name} produced ${f(head.v)} million tonnes of potatoes in ${head.year} (${head.src}${national ? "" : `, ${LY}`}).${national ? ` The FAOSTAT calendar-${LY} figure is ${f(faoLatest, 2)} million tonnes.` : ""}` },
    { q: `Where does ${name} rank in world potato production?`, a: `${name} ranks #${rank} of ${nRanked} producing countries in the FAOSTAT ${LY} series (${FAO}). Ranks are computed by Potatopedia from that series.` },
    { q: `How has potato production in ${name} changed since ${FY}?`, a: `On the FAOSTAT series, ${name}'s production ${chg >= 0 ? "rose" : "fell"} ${f(Math.abs(chg))}% between ${FY} and ${LY}, from ${f(first.v, first.v < 10 ? 2 : 1)} to ${f(last.v, last.v < 10 ? 2 : 1)} million tonnes (${FAO}).` },
    { q: `What is the average potato yield in ${name}?`, a: `The national average yield is ${k.yield.v} ${k.yield.unit} on ${k.area.v} ${k.area.unit} of harvested area (${kfSrc(k.yield)}; ${kfSrc(k.area)}).` },
    { q: `How much potato do people in ${name} eat?`, a: `Apparent consumption in ${name} is ${k.consumption.v} ${k.consumption.unit} (${kfSrc(k.consumption)}).` },
  ];

  const title = `${name} Potato Market Report 2026 | Potatopedia`;
  let description = `${name} produced ${f(head.v)} million tonnes of potatoes in ${head.year} (#${rank} worldwide). Read the summary, key figures and chart; get the full 10-page report.`;
  if (description.length < 140) description += " Sources named.";
  if (description.length > 160) description = `${name}: ${f(head.v)} Mt of potatoes in ${head.year}, #${rank} worldwide. Summary, key figures, chart and the 10-page ${REPORT_EDITION.month} report.`;

  return {
    slug, name, edition: REPORT_EDITION, pages: m.pages, series, rank, nRanked, first, last, chg, peak, head, national,
    sentences, toc, keyFigures, faq, title, description, wikidata: REPORT_WIKIDATA[slug] || null,
    FY, LY, kf: k, trade: { exportQ, importQ, exportV, importV }, faoLatest,
  };
}

export function getAllReports() {
  return listReportSlugs().map(getReport).filter(Boolean);
}
