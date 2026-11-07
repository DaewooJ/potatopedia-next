#!/usr/bin/env node
// Build a branded A4 PDF country report: node scripts/reports/build-country-report.mjs <slug> [<slug> ...] [--html-only] [--no-db]
//   Data: FAOSTAT series from lib/faostat-timeseries.js, India headline from lib/facts.js, variety counts from
//   lib/varieties-data.js, company listings from Neon pp_companies (published only; needs DATABASE_URL),
//   editorial text + nationally sourced figures from scripts/reports/content.mjs (copied from the country pages).
//   Output: reports-out/<slug>-<edition>.html and .pdf (reports-out/ is gitignored: the repo is public, PDFs are private).
//   PDF engine: ~/.claude/scripts/pdf.sh (headless Chrome). Then lib/reports-manifest.json is updated with page counts.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import "./resolve-hook.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "reports-out");
const args = process.argv.slice(2);
const slugs = args.filter((a) => !a.startsWith("--"));
const HTML_ONLY = args.includes("--html-only");
const NO_DB = args.includes("--no-db");
if (!slugs.length) { console.log("usage: build-country-report.mjs <slug> [...] [--html-only] [--no-db]"); process.exit(1); }

const { PRODUCTION_TIMESERIES, TRADE_TIMESERIES, FAOSTAT_YEARS } = await import(pathToFileURL(path.join(ROOT, "lib/faostat-timeseries.js")).href);
const { INDIA_POTATO } = await import(pathToFileURL(path.join(ROOT, "lib/facts.js")).href);
const { COUNTRIES } = await import(pathToFileURL(path.join(ROOT, "lib/data.js")).href);
const { getVarietiesByCountrySlug } = await import(pathToFileURL(path.join(ROOT, "lib/varieties-data.js")).href);
const { CONTENT, EDITION } = await import("./content.mjs");

const LY = FAOSTAT_YEARS[FAOSTAT_YEARS.length - 1];
const FY = FAOSTAT_YEARS[0];
const FAO = "FAOSTAT (QCL, Item 116 Potatoes)";
const FAO_TM = "FAOSTAT (TM, fresh potatoes)";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const nameOf = (slug) => COUNTRIES.find((c) => c.slug === slug)?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
const f1 = (v, d = 1) => Number(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

// ── Env (DATABASE_URL) from .env.local of this checkout or the main checkout ──
function loadEnv() {
  for (const p of [path.join(ROOT, ".env.local"), path.join(ROOT, "../potatopedia-next/.env.local")]) {
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const COUNTRY_DB_NAMES = { "united-states": ["United States", "USA", "United States of America"], netherlands: ["Netherlands", "The Netherlands"] };
async function directoryFor(slug) {
  if (NO_DB || !process.env.DATABASE_URL) return { ok: false, rows: [] };
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);
  const names = COUNTRY_DB_NAMES[slug] || [nameOf(slug)];
  const rows = await sql`select slug, kind, name, featured, featured_until from pp_companies
    where published = true and country = any(${names}) order by lower(name)`;
  return { ok: true, rows };
}

// ── Data assembly ──
function ranked(year) {
  return Object.entries(PRODUCTION_TIMESERIES).filter(([, s]) => typeof s[year] === "number")
    .sort((a, b) => b[1][year] - a[1][year]).map(([slug, s]) => ({ slug, v: s[year] }));
}
function assemble(slug) {
  const c = CONTENT[slug];
  if (!c) throw new Error(`no editorial content for ${slug} in scripts/reports/content.mjs`);
  const series = FAOSTAT_YEARS.map((y) => ({ y, v: PRODUCTION_TIMESERIES[slug]?.[y] })).filter((p) => typeof p.v === "number");
  const rank = ranked(LY);
  const r = rank.findIndex((x) => x.slug === slug) + 1;
  const tr = TRADE_TIMESERIES[slug];
  const t = (k, y = LY) => tr?.[k]?.[y] ?? null;
  const head = c.headline?.useNational
    ? { v: INDIA_POTATO.value, unit: "million tonnes", what: `Potato production, ${INDIA_POTATO.year}`, src: `${INDIA_POTATO.label}, ${INDIA_POTATO.publisher}`, short: `${INDIA_POTATO.publisher}, ${INDIA_POTATO.year} (${INDIA_POTATO.label})` }
    : { v: PRODUCTION_TIMESERIES[slug][LY], unit: "million tonnes", what: `Potato production, ${LY}`, src: FAO, short: `${FAO}, ${LY}` };
  const first = series[0], last = series[series.length - 1];
  const chg = ((last.v - first.v) / first.v) * 100;
  const peak = series.reduce((a, b) => (b.v > a.v ? b : a));
  const low = series.reduce((a, b) => (b.v < a.v ? b : a));
  return { slug, c, name: c.name, series, rank, r, nRanked: rank.length, t, head, first, last, chg, peak, low,
    varieties: getVarietiesByCountrySlug(slug) };
}

// ── Charts (inline SVG; gold = this country, greys = comparators, direct labels, B&W-safe via weight/dash) ──
function niceMax(v) { const p = 10 ** Math.floor(Math.log10(v)); for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p; return 10 * p; }
function niceMin(lo, hi) { const span = hi - lo; const p = 10 ** Math.floor(Math.log10(span || 1)); return Math.max(0, Math.floor(lo / p) * p); }

function productionChart(d) {
  const W = 680, H = 236, L = 34, R = 668, T = 26, B = 206;
  const vals = d.series.map((p) => p.v);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.35 || hi * 0.1;
  const raw = (hi - lo + 2 * pad) / 4, p10 = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p10).find((m) => m >= raw);
  lo = Math.max(0, Math.floor((lo - pad) / step) * step); hi = Math.ceil((hi + pad) / step) * step;
  const x = (i) => L + 18 + (i * (R - L - 36)) / (d.series.length - 1);
  const y = (v) => B - ((v - lo) / (hi - lo)) * (B - T);
  const ticks = []; for (let t = lo; t <= hi + 1e-9; t += step) ticks.push(t);
  const dec = step < 1 ? (step < 0.5 ? 2 : 1) : 0;
  const line = d.series.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(d.series.length - 1).toFixed(1)},${B} L${x(0).toFixed(1)},${B} Z`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(d.name)} potato production ${FY}–${LY}, million tonnes, FAOSTAT">
  <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A7238" stop-opacity=".16"/><stop offset="1" stop-color="#9A7238" stop-opacity="0"/></linearGradient></defs>
  <g class="grid">${ticks.map((t) => `<line x1="${L}" x2="${R}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>`).join("")}</g>
  ${ticks.map((t) => `<text class="ax" x="${L - 6}" y="${(y(t) + 3).toFixed(1)}" text-anchor="end">${f1(t, dec)}</text>`).join("")}
  <line class="base" x1="${L}" x2="${R}" y1="${B}" y2="${B}"/>
  <path d="${area}" fill="url(#ga)"/>
  <path d="${line}" fill="none" stroke="#9A7238" stroke-width="2.2" stroke-linejoin="round"/>
  ${d.series.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="${p.y === d.peak.y || i === d.series.length - 1 ? 4 : 2.8}" fill="${i === d.series.length - 1 ? "#9A7238" : "#FBF8F2"}" stroke="#9A7238" stroke-width="1.6"/>
  <text class="${i === d.series.length - 1 || p.y === d.peak.y ? "dl-g" : "dl"}" x="${x(i).toFixed(1)}" y="${(y(p.v) - 10).toFixed(1)}" text-anchor="middle">${f1(p.v, p.v < 10 ? 2 : 1)}</text>
  <text class="ax" x="${x(i).toFixed(1)}" y="${B + 15}" text-anchor="middle">${p.y}</text>`).join("")}
  <text class="ax" x="${L - 6}" y="${T - 12}" text-anchor="end" style="letter-spacing:.08em">M t</text>
</svg>`;
}

function indexChart(d) {
  const W = 330, H = 220, L = 30, R = 248, T = 14, B = 192;
  const others = d.rank.filter((x) => x.slug !== d.slug).slice(0, 4).map((x) => x.slug);
  const set = [...others, d.slug].map((slug) => {
    const s = PRODUCTION_TIMESERIES[slug];
    return { slug, me: slug === d.slug, pts: FAOSTAT_YEARS.map((yy) => ({ y: yy, v: (s[yy] / s[FY]) * 100 })) };
  });
  const all = set.flatMap((s) => s.pts.map((p) => p.v));
  let lo = Math.floor(Math.min(...all) / 5) * 5 - 5, hi = Math.ceil(Math.max(...all) / 5) * 5 + 5;
  const x = (i) => L + (i * (R - L)) / (FAOSTAT_YEARS.length - 1);
  const y = (v) => B - ((v - lo) / (hi - lo)) * (B - T);
  const step = hi - lo > 40 ? 20 : 10;
  const ticks = []; for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(t);
  // end labels with simple collision avoidance
  const ends = set.map((s) => ({ s, yy: y(s.pts[s.pts.length - 1].v) })).sort((a, b) => a.yy - b.yy);
  for (let i = 1; i < ends.length; i++) if (ends[i].yy - ends[i - 1].yy < 12) ends[i].yy = ends[i - 1].yy + 12;
  const path = (s) => s.pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Production index ${FY}=100: ${esc(d.name)} and the largest producers">
  <g class="grid">${ticks.map((t) => `<line x1="${L}" x2="${R}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>`).join("")}</g>
  ${ticks.map((t) => `<text class="ax" x="${L - 5}" y="${(y(t) + 3).toFixed(1)}" text-anchor="end">${t}</text>`).join("")}
  <line x1="${L}" x2="${R}" y1="${y(100).toFixed(1)}" y2="${y(100).toFixed(1)}" stroke="#16140F" stroke-width=".7" stroke-dasharray="2 2"/>
  ${set.filter((s) => !s.me).map((s) => `<path d="${path(s)}" fill="none" stroke="#A39C90" stroke-width="1" stroke-dasharray="3 2"/>`).join("")}
  ${set.filter((s) => s.me).map((s) => `<path d="${path(s)}" fill="none" stroke="#9A7238" stroke-width="2.4"/><circle cx="${x(s.pts.length - 1)}" cy="${y(s.pts[s.pts.length - 1].v).toFixed(1)}" r="3" fill="#9A7238"/>`).join("")}
  ${ends.map((e) => `<text class="${e.s.me ? "nm-g" : "nm"}" x="${R + 6}" y="${(e.yy + 3).toFixed(1)}">${esc(nameOf(e.s.slug))} ${Math.round(e.s.pts[e.s.pts.length - 1].v)}</text>`).join("")}
  <text class="ax" x="${x(0)}" y="${B + 14}" text-anchor="start">${FY}</text><text class="ax" x="${R}" y="${B + 14}" text-anchor="end">${LY}</text>
</svg>`;
}

function hbars(items, { W = 330, labelW = 92, unit = "", dec = 1, rowH = 19, sub = false } = {}) {
  const max = Math.max(...items.map((i) => i.v));
  const H = items.length * rowH + 6;
  const x1 = W - 44;
  const sc = (v) => ((x1 - labelW) * v) / max;
  return `<svg viewBox="0 0 ${W} ${H}" role="img">
  ${items.map((it, i) => { const yy = i * rowH + 3; return `
  <text class="${it.me ? "nm-g" : "nm"}" x="${labelW - 7}" y="${yy + (sub ? 8 : 10)}" text-anchor="end">${esc(it.label)}</text>
  ${sub && it.sub ? `<text class="ax" x="${labelW - 7}" y="${yy + 17}" text-anchor="end" style="font-size:7px">${esc(it.sub)}</text>` : ""}
  <rect x="${labelW}" y="${yy + 2}" width="${sc(it.v).toFixed(1)}" height="${rowH - (sub ? 9 : 8)}" fill="${it.me ? "#9A7238" : "#D9D2C5"}"/>
  <text class="${it.me ? "dl-g" : "dl"}" x="${(labelW + sc(it.v) + 4).toFixed(1)}" y="${yy + (sub ? 10 : 10)}">${f1(it.v, dec)}${unit}</text>`; }).join("")}
  <line class="base" x1="${labelW}" x2="${labelW}" y1="0" y2="${H - 2}"/>
</svg>`;
}

function tradeChart(d) {
  const tr = TRADE_TIMESERIES[d.slug];
  if (!tr) return "";
  const W = 680, H = 210, L = 40, R = 600, T = 18, B = 176;
  const ex = FAOSTAT_YEARS.map((y) => tr.export_qty?.[y] ?? null), im = FAOSTAT_YEARS.map((y) => tr.import_qty?.[y] ?? null);
  const hi = niceMax(Math.max(...ex.filter((v) => v != null), ...im.filter((v) => v != null), 1) * 1.12);
  const gw = (R - L) / FAOSTAT_YEARS.length, bw = gw * 0.3;
  const y = (v) => B - (v / hi) * (B - T);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => hi * k);
  const fmt = (v) => (v >= 100 ? Math.round(v).toLocaleString("en-US") : f1(v, 1));
  const bars = FAOSTAT_YEARS.map((yr, i) => {
    const cx = L + gw * i + gw / 2;
    const e = ex[i], m = im[i];
    return `${e != null ? `<rect x="${(cx - bw - 1).toFixed(1)}" y="${y(e).toFixed(1)}" width="${bw.toFixed(1)}" height="${(B - y(e)).toFixed(1)}" fill="#9A7238"/><text class="dl" x="${(cx - bw / 2 - 1).toFixed(1)}" y="${(y(e) - 4).toFixed(1)}" text-anchor="middle" style="font-size:8px">${fmt(e)}</text>` : ""}
    ${m != null ? `<rect x="${(cx + 1).toFixed(1)}" y="${y(m).toFixed(1)}" width="${bw.toFixed(1)}" height="${(B - y(m)).toFixed(1)}" fill="url(#hatch)" stroke="#8C8476" stroke-width=".6"/><text class="ax" x="${(cx + bw / 2 + 1).toFixed(1)}" y="${(y(m) - 4).toFixed(1)}" text-anchor="middle" style="font-size:8px">${fmt(m)}</text>` : ""}
    <text class="ax" x="${cx.toFixed(1)}" y="${B + 14}" text-anchor="middle">${yr}</text>`;
  }).join("");
  const lastI = FAOSTAT_YEARS.length - 1;
  const lx = L + gw * lastI + gw / 2 + bw + 12;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(d.name)} fresh potato exports and imports, thousand tonnes, FAOSTAT">
  <defs><pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#EFE9DE"/><line x1="0" y1="0" x2="0" y2="4" stroke="#A39C90" stroke-width="1.4"/></pattern></defs>
  <g class="grid">${ticks.map((t) => `<line x1="${L}" x2="${R}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>`).join("")}</g>
  ${ticks.map((t) => `<text class="ax" x="${L - 6}" y="${(y(t) + 3).toFixed(1)}" text-anchor="end">${fmt(t)}</text>`).join("")}
  <line class="base" x1="${L}" x2="${R}" y1="${B}" y2="${B}"/>
  ${bars}
  <rect x="${lx}" y="${T + 6}" width="9" height="9" fill="#9A7238"/><text class="nm-g" x="${lx + 13}" y="${T + 14}">Exports</text>
  <rect x="${lx}" y="${T + 24}" width="9" height="9" fill="url(#hatch)" stroke="#8C8476" stroke-width=".6"/><text class="nm" x="${lx + 13}" y="${T + 32}">Imports</text>
  <text class="ax" x="${L - 6}" y="${T - 6}" text-anchor="end" style="letter-spacing:.08em">'000 t</text>
</svg>`;
}

// ── Motif (cover): line-art tuber + ploughed-field furrows, gold hairlines ──
function coverMotif() {
  const eyes = [[120, 92], [176, 70], [212, 128], [150, 160], [92, 140], [248, 92]];
  return `<svg class="motif" viewBox="0 0 360 260" aria-hidden="true">
    <g fill="none" stroke="#E2C08D" stroke-linecap="round">
      <path d="M58 132 C46 76 104 38 170 40 C236 42 300 66 304 124 C308 184 252 222 182 222 C112 222 70 190 58 132 Z" stroke-width="1.1" opacity=".85"/>
      <path d="M74 132 C66 88 112 56 170 57 C228 58 284 80 287 126 C290 174 244 206 182 206 C120 206 82 178 74 132 Z" stroke-width=".5" opacity=".45"/>
      ${eyes.map(([x, y]) => `<path d="M${x - 7} ${y} q7 -5 14 0" stroke-width=".9" opacity=".8"/>`).join("")}
      <path d="M300 112 C322 96 336 74 334 46" stroke-width=".7" opacity=".5"/>
      <path d="M334 46 c-10 2 -16 -6 -14 -14 c8 0 16 6 14 14 Z" stroke-width=".7" opacity=".55"/>
    </g></svg>`;
}
function coverField() {
  const lines = [];
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    const y0 = 40 + t * t * 300;
    lines.push(`<path d="M-20 ${(y0 + 30).toFixed(1)} Q 300 ${(y0 - 26 + t * 18).toFixed(1)} 620 ${(y0 + 6).toFixed(1)}" stroke-width="${(0.35 + t * 0.6).toFixed(2)}" opacity="${(0.18 + t * 0.32).toFixed(2)}"/>`);
  }
  return `<svg class="field" viewBox="0 0 600 340" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#E2C08D">${lines.join("")}</g></svg>`;
}

// ── Page helpers ──
const SRC_PAGE = 9;
function pageWrap(n, d, inner, cls = "") {
  return `<section class="page ${cls}">
  <div class="rh"><span class="wm">Potatopedia</span><span class="rt"><b>${esc(d.name)}</b> &nbsp;·&nbsp; Potato Market Report &nbsp;·&nbsp; ${EDITION.month}</span></div>
  <div class="body">${inner}</div>
  <div class="rf"><span>potatopedia.com &nbsp;·&nbsp; Sources on p. ${SRC_PAGE}</span><span class="pn"><i>Page</i>${String(n).padStart(2, "0")}</span></div>
</section>`;
}
const secHead = (no, kicker, title) => `<div class="sec-head"><div class="sec-no">${String(no).padStart(2, "0")}</div><div><div class="kicker">${esc(kicker)}</div><h2>${esc(title)}</h2></div></div>`;
function table(cols, rows, hlFirst = null) {
  return `<table><thead><tr>${cols.map(([h, a]) => `<th class="${a}">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr${hlFirst && r[0] === hlFirst ? ' class="hl"' : ""}>${r.map((v, i) => `<td class="${i === 0 ? "first " : ""}${cols[i]?.[1] || ""}">${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}
const srcLine = (s, note = false) => `<div class="src${note ? " note" : ""}">${esc(s)}</div>`;
const kfSrc = (k) => `${k.src}${k.year ? `, ${k.year}` : ""}${k.unsourced ? " †" : ""}`;

// ── Pages ──
function cover(d) {
  const h = d.head;
  return `<section class="page dark cover">${coverField()}${coverMotif()}<div class="in">
  <div class="top"><span class="wmk">Potatopedia</span><span class="series">Country Market Report</span></div>
  <div class="title"><div class="eyebrow">Market intelligence &nbsp;·&nbsp; Production, trade &amp; industry</div>
    <h1 class="${d.name.length > 10 ? "long" : ""}">${esc(d.name)}</h1><div class="sub">Potato Market Report</div>
    <div class="ed"><b>${EDITION.month} edition</b> &nbsp;·&nbsp; Data as of ${EDITION.asOf}</div></div>
  <div class="stat"><div class="big">${f1(h.v, h.v >= 10 ? 1 : 2)}<small>M t</small></div>
    <div class="what"><span class="label">Headline</span>${esc(h.what)}${d.r ? ` &nbsp;·&nbsp; world rank #${d.r} (${FAO}, ${LY})` : ""}<div class="s2">Source: ${esc(h.src)}</div></div></div>
</div></section>`;
}

function contents(d) {
  const toc = [
    ["Key figures", "Production, area, yield, rank, consumption, trade balance", 3],
    ["Production, area & yield", `FAOSTAT ${FY}–${LY} series and peer comparison`, 4],
    ["Trade", "Fresh-potato flows and processed-product exports", 5],
    ["Regions & varieties", "Where the crop is grown and what is planted", 6],
    ["Industry", "Processors, seed houses and machinery makers", 7],
    ["Outlook & key issues", "Constraints and what to watch", 8],
    ["Sources & method", "Every figure's publisher and year", 9],
  ];
  return pageWrap(2, d, `
  <div class="g12" style="flex:1">
    <div class="c5">
      <div class="kicker">Contents</div><h2 style="margin-bottom:6mm">In this report</h2>
      <ol class="toc">${toc.map(([t, s, p], i) => `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="t">${esc(t)}<small>${esc(s)}</small></span><span class="p">p. ${p}</span></li>`).join("")}</ol>
      <div class="mt8" style="border-top:.9pt solid var(--ink);padding-top:3.5mm"><div class="label" style="margin-bottom:2mm">About this edition</div>
      <p class="small">A free sample of the Potatopedia country market report. Every number carries its publisher and year; the international series is FAOSTAT ${FY}–${LY}, national figures come from the statistical offices and institutes named on page ${SRC_PAGE}.</p>
      <p class="small">Prepared by the Potatopedia editorial desk, ${EDITION.month}.</p></div>
    </div>
    <div class="c7" style="padding-left:4mm;display:flex;flex-direction:column">
      <div class="kicker">Executive summary</div><h2 style="margin-bottom:6mm">At a glance</h2>
      <ul class="glance">
        <li><div>${esc(d.name)} produced <b>${f1(d.head.v, 1)} million tonnes</b> of potatoes ${d.c.headline?.useNational ? `in ${esc(INDIA_POTATO.year)} (${esc(INDIA_POTATO.label)})` : `in ${LY}`}, ranking <b>#${d.r} of ${d.nRanked}</b> producing countries in FAOSTAT ${LY}. On the FAOSTAT series, output ${d.chg >= 0 ? "rose" : "fell"} ${f1(Math.abs(d.chg))}% between ${FY} and ${LY}.<div class="src">${d.c.headline?.useNational ? `${esc(d.head.short)}; ` : ""}${FAO}, ${FY}–${LY}</div></div></li>
        ${d.c.summary.map((s) => `<li><div>${esc(s.t)}<div class="src">${esc(s.s)}</div></div></li>`).join("")}
      </ul>
      <div class="spacer"></div><div class="insight mt6"><div class="label">Key insight</div><blockquote>${esc(d.c.insight.q)}</blockquote>${srcLine(d.c.insight.s)}</div>
    </div>
  </div>`);
}

function keyFigures(d) {
  const k = d.c.kf;
  const ev = d.t("export_val"), iv = d.t("import_val"), eq = d.t("export_qty"), iq = d.t("import_qty");
  const bal = ev != null && iv != null ? ev - iv : null;
  const tiles = [
    { l: "Production", v: f1(d.head.v, 1), u: "million tonnes", ctx: d.head.what, s: d.head.short },
    { l: "Harvested area", v: k.area.v, u: k.area.unit, ctx: "Area harvested", s: kfSrc(k.area) },
    { l: "Average yield", v: k.yield.v, u: k.yield.unit, ctx: "National average", s: kfSrc(k.yield) },
    { l: "World rank", v: `#${d.r}`, u: `of ${d.nRanked} producing countries`, ctx: `By production, ${LY}`, s: `${FAO}, ${LY}` },
    { l: "Per-capita consumption", v: k.consumption.v, u: k.consumption.unit, ctx: "Apparent consumption", s: kfSrc(k.consumption) },
    { l: "Fresh trade balance", v: bal == null ? "n/a" : `${bal >= 0 ? "+" : "−"}$${f1(Math.abs(bal), Math.abs(bal) >= 100 ? 0 : 1)}`, u: "million US$, fresh potatoes",
      ctx: bal == null ? "" : `Exports $${f1(ev)} M (${f1(eq)}k t) · imports $${f1(iv)} M (${f1(iq)}k t)`, s: `${FAO_TM}, ${LY}` },
  ];
  const top = d.rank.slice(0, 10);
  const items = top.map((x) => ({ label: nameOf(x.slug), v: x.v, me: x.slug === d.slug }));
  if (!top.some((x) => x.slug === d.slug)) items.push({ label: d.name, v: PRODUCTION_TIMESERIES[d.slug][LY], me: true });
  const daggers = Object.values(k).some((x) => x.unsourced);
  return pageWrap(3, d, `
  ${secHead(1, "Dashboard", "Key figures")}
  <div class="tiles">${tiles.map((t) => `<div class="tile"><div class="label">${esc(t.l)}</div><div class="v">${esc(t.v)}</div><div class="u">${esc(t.u)}</div><div class="ctx">${esc(t.ctx)}</div><div class="s">${esc(t.s)}</div></div>`).join("")}</div>
  <div class="g12 mt8">
    <div class="c7 chart"><div class="ct">The world's largest potato producers</div><div class="cs">Production ${LY}, million tonnes; ${esc(d.name)} highlighted</div>${hbars(items, { W: 380, labelW: 100, rowH: 22 })}${srcLine(`${FAO}, ${LY}. Ranks computed over ${d.nRanked} countries in the Potatopedia FAOSTAT extract.`)}</div>
    <div class="c5"><div class="label" style="margin-bottom:2.4mm">Reading the figures</div>
      <p class="small">Production, rank and trade use one internationally comparable series (FAOSTAT) so that countries can be compared. Area, yield and consumption come from the national sources named under each figure.${d.c.headline?.useNational ? ` For India the headline uses the most advanced national estimate (${esc(INDIA_POTATO.label)}, ${esc(INDIA_POTATO.year)}), which supersedes earlier estimates; FAOSTAT ${LY} shows ${f1(PRODUCTION_TIMESERIES[d.slug][LY], 2)} M t.` : ""}</p>
      <p class="small">Trade balance covers fresh potatoes only (FAOSTAT TM). Frozen fries, flakes, starch and seed are covered in section 03.</p>
      ${daggers ? `<p class="small"><span class="dagger">†</span> Figure as stated on the Potatopedia country profile; the primary publisher and year are not named there and are being confirmed.</p>` : ""}
    </div>
  </div>`);
}

function production(d) {
  const peers = ["india", "china", "united-states", "netherlands"].filter((s) => CONTENT[s]);
  const yItems = peers.map((s) => ({ label: CONTENT[s].name, v: CONTENT[s].yieldNum, me: s === d.slug, sub: kfSrc(CONTENT[s].kf.yield) })).sort((a, b) => b.v - a.v);
  const cagr = (Math.pow(d.last.v / d.first.v, 1 / (d.last.y - d.first.y)) - 1) * 100;
  const exp = d.t("export_qty");
  return pageWrap(4, d, `
  ${secHead(2, "Supply", "Production, area & yield")}
  <div class="chart"><div class="ct">${esc(d.c.possessive)} potato production, ${FY}–${LY}</div><div class="cs">Million tonnes, calendar-year FAOSTAT series; gold markers show the peak and the latest year</div>${productionChart(d)}${srcLine(`${FAO}, ${FY}–${LY} (validated range as of May 2026).`)}</div>
  <div class="g12 mt4" style="border-top:.4pt solid var(--rule);padding-top:3.5mm">
    <div class="c4"><div class="label">Trend</div><p class="small mt2" style="color:var(--ink2);font-size:8.4pt">Output ${d.chg >= 0 ? "rose" : "fell"} <b>${f1(Math.abs(d.chg))}%</b>, from ${f1(d.first.v, 2)} M t in ${FY} to ${f1(d.last.v, 2)} M t in ${LY}: a compound ${cagr >= 0 ? "growth" : "decline"} of ${f1(Math.abs(cagr))}% a year. Peak ${f1(d.peak.v, 2)} M t (${d.peak.y}); low ${f1(d.low.v, 2)} M t (${d.low.y}).</p></div>
    <div class="c4"><div class="label">${d.c.headline?.useNational ? "National estimate" : "Area"}</div><p class="small mt2" style="color:var(--ink2);font-size:8.4pt">${d.c.headline?.useNational ? `${esc(INDIA_POTATO.year)}: <b>${INDIA_POTATO.value} M t</b> (${esc(INDIA_POTATO.label)}, ${esc(INDIA_POTATO.publisher)}). Indian crop years run July–June and are not plotted on the calendar-year series.` : `Harvested area <b>${esc(d.c.kf.area.v)} ${esc(d.c.kf.area.unit)}</b> (${esc(kfSrc(d.c.kf.area))}); national average yield <b>${esc(d.c.kf.yield.v)} ${esc(d.c.kf.yield.unit)}</b> (${esc(kfSrc(d.c.kf.yield))}).`}</p></div>
    <div class="c4"><div class="label">Exported fresh</div><p class="small mt2" style="color:var(--ink2);font-size:8.4pt">${exp != null ? `<b>${f1((exp / 1000 / d.last.v) * 100)}%.</b> Fresh exports of ${f1(exp)} thousand t equalled this share of ${LY} output (includes re-exports; ${FAO_TM}, Potatopedia calculation).` : "No FAOSTAT fresh-export figure for the latest year."}</p></div>
  </div>
  <div class="g12 mt6">
    <div class="c6 chart"><div class="ct">Growth against the largest producers</div><div class="cs">Production index, ${FY} = 100</div>${indexChart(d)}${srcLine(`${FAO}, ${FY}–${LY}; Potatopedia calculation.`)}</div>
    <div class="c6 chart"><div class="ct">Yield across the four report markets</div><div class="cs">Average yield, tonnes per hectare, latest national figure</div>${hbars(yItems, { W: 330, labelW: 128, unit: "", dec: 1, rowH: 30, sub: true })}${srcLine("National statistics as named under each bar; years differ by country, so compare levels, not exact gaps.")}</div>
  </div>`);
}

function trade(d) {
  const tr = TRADE_TIMESERIES[d.slug];
  const rows = tr ? [
    ["Exports", ...[FY, LY - 1, LY].map((y) => (tr.export_qty?.[y] != null ? f1(tr.export_qty[y]) : "—")), tr.export_val?.[LY] != null ? f1(tr.export_val[LY]) : "—"],
    ["Imports", ...[FY, LY - 1, LY].map((y) => (tr.import_qty?.[y] != null ? f1(tr.import_qty[y]) : "—")), tr.import_val?.[LY] != null ? f1(tr.import_val[LY]) : "—"],
    ["Net", ...[FY, LY - 1, LY].map((y) => (tr.export_qty?.[y] != null && tr.import_qty?.[y] != null ? f1(tr.export_qty[y] - tr.import_qty[y]) : "—")),
      tr.export_val?.[LY] != null && tr.import_val?.[LY] != null ? f1(tr.export_val[LY] - tr.import_val[LY]) : "—"],
  ] : [];
  return pageWrap(5, d, `
  ${secHead(3, "Flows", "Trade")}
  <p class="lede mb4">${esc(d.c.trade.lede)}</p>
  <div class="chart"><div class="ct">Fresh-potato trade, ${FY}–${LY}</div><div class="cs">Thousand tonnes per year; exports solid, imports hatched</div>${tradeChart(d)}${srcLine(`${FAO_TM}, ${FY}–${LY}. Fresh potatoes only; processed products are in the table below.`)}</div>
  <div class="g12 mt6">
    <div class="c5"><h3>Fresh potatoes, FAOSTAT</h3><div class="small" style="margin:-1mm 0 2mm">Thousand tonnes; last column US$ million</div>${table([["Flow", "l"], [`${FY}`, "r"], [`${LY - 1}`, "r"], [`${LY}`, "r"], [`${LY} $M`, "r"]], rows, "Net")}${srcLine(`${FAO_TM}.`)}</div>
    <div class="c7"><h3>Processed products and seed</h3>${table(d.c.trade.cols, d.c.trade.rows)}${srcLine(d.c.trade.src)}</div>
  </div>`);
}

function regions(d) {
  const r = d.c.regions, v = d.c.varieties;
  const seg = r.seg ? `<div class="mt4">${table(r.seg.cols, r.seg.rows)}${srcLine(r.seg.src)}</div>` : "";
  return pageWrap(6, d, `
  ${secHead(4, "Geography & genetics", "Regions & varieties")}
  <div class="g12"><div class="c12"><h3>${esc(r.title)}</h3><p class="small mb4" style="font-size:8.6pt;color:var(--ink2)">${esc(r.lede)}</p>${table(r.cols, r.rows)}${srcLine(r.src)}${seg}</div></div>
  <div class="g12 mt6"><div class="c12"><h3>Varieties grown</h3><p class="small mb4" style="font-size:8.6pt;color:var(--ink2)">${esc(v.lede)} The Potatopedia variety database lists <b>${d.varieties.length}</b> varieties of ${esc(d.c.the || d.name)} origin.</p>${table(v.cols, v.rows)}${srcLine(v.src)}</div></div>`);
}

function industry(d, dir) {
  const p = d.c.players;
  const KIND = { processing: "Processors", seed: "Seed companies", machinery: "Machinery makers" };
  const byKind = Object.keys(KIND).map((k) => ({ k, rows: dir.rows.filter((r) => r.kind === k) })).filter((g) => g.rows.length);
  const max = 30;
  let shown = 0;
  const dirHtml = dir.rows.length
    ? `<div class="dir">${byKind.map((g) => `<div class="k"><span class="label">${KIND[g.k]} (${g.rows.length})</span>${g.rows.filter(() => shown++ < max).map((r) => `<span>${esc(r.name)}${r.featured ? " ★" : ""}</span>`).join("")}</div>`).join("")}</div>
       ${dir.rows.length > max ? `<p class="small mt2">${dir.rows.length - max} more listed at potatopedia.com/companies.</p>` : ""}`
    : `<div class="empty"><b>No ${esc(d.name)} companies are published in the directory yet.</b> Listings are hand-checked against official company websites before they go live. Processors, seed companies and machinery makers active in ${esc(d.c.the || d.name)} can write to hi@potatopedia.com to be considered.</div>`;
  return pageWrap(7, d, `
  ${secHead(5, "Value chain", "Industry")}
  <p class="lede mb4">${esc(p.lede)}</p>
  <div class="tiles mini mb4">${(d.c.ind || []).map(([v, l, src]) => `<div class="tile"><div class="v">${esc(v)}</div><div class="ctx">${esc(l)}</div><div class="s">${esc(src)}</div></div>`).join("")}</div>
  <h3 class="mt2">Major players</h3>${table(p.cols, p.rows)}${srcLine(p.src)}
  <div class="mt6"><h3>In the Potatopedia company directory</h3>
    <p class="small mb4">${dir.ok && !dir.rows.length ? "" : dir.ok ? `${dir.rows.length} published ${esc(d.name)} listing${dir.rows.length === 1 ? "" : "s"} as of ${EDITION.asOf}: processors, seed houses and machinery makers checked against their official websites.` : "Directory listings could not be read when this edition was built."}</p>
    ${dirHtml}</div>
  <div class="spacer"></div>
  <div class="panel mt4"><div><h4>Featured listing available</h4><p>Put your company in front of buyers, traders and analysts reading the ${esc(d.name)} report and country page. Featured slots are labelled as such.</p></div><span class="cta">potatopedia.com/advertise</span></div>`);
}

function outlook(d) {
  const o = d.c.outlook, i = d.c.issues;
  return pageWrap(8, d, `
  ${secHead(6, "Forward view", "Outlook & key issues")}
  <div class="outlook">${o.items.map(([h, t], k) => `<div class="ocard"><div class="n">${k + 1}</div><h4>${esc(h)}</h4><p>${esc(t)}</p></div>`).join("")}</div>
  ${srcLine(o.src)}
  <div class="mt8"><h3>Key issues</h3>${table(i.cols, i.rows)}${srcLine(i.src)}</div>
  <div class="spacer"></div>
  <div class="insight"><div class="label">What to watch</div><blockquote>${esc(d.c.watch.q)}</blockquote>${srcLine(d.c.watch.s)}</div>`);
}

function sources(d) {
  const c = d.c;
  const groups = [
    ["Production, rank & fresh trade", [`${FAO}: production ${FY}–${LY}, million tonnes`, `${FAO_TM}: exports and imports ${FY}–${LY}, quantity ('000 t) and value (US$ M)`, `World rank: Potatopedia calculation over ${d.nRanked} countries, FAOSTAT ${LY}`]],
    ["Key figures", [d.c.headline?.useNational ? `Production: ${INDIA_POTATO.publisher}, ${INDIA_POTATO.year}, ${INDIA_POTATO.label}` : `Production: ${FAO}, ${LY}`,
      `Area: ${kfSrc(c.kf.area)}`, `Yield: ${kfSrc(c.kf.yield)}`, `Consumption: ${kfSrc(c.kf.consumption)}`]],
    ["Executive summary", [...c.summary.map((s) => s.s), c.insight.s]],
    ["Trade (processed products)", [c.trade.src]],
    ["Regions", [c.regions.src, ...(c.regions.seg ? [c.regions.seg.src] : [])]],
    ["Varieties", [c.varieties.src, "Variety count: Potatopedia variety database (lib/varieties-data), by country of origin"]],
    ["Industry", [c.players.src, `Company directory: Potatopedia, published listings as of ${EDITION.asOf}`]],
    ["Outlook & issues", [c.outlook.src, c.issues.src]],
    ...(c.extraSources?.length ? [["Other", c.extraSources]] : []),
  ];
  const daggers = Object.entries(c.kf).filter(([, x]) => x.unsourced);
  return pageWrap(9, d, `
  ${secHead(7, "Provenance", "Sources & method")}
  <div class="srcs">${groups.map(([g, list]) => `<div class="grp"><span class="label">${esc(g)}</span>${[...new Set(list)].map((s) => `<div>${esc(s)}</div>`).join("")}</div>`).join("")}</div>
  <div class="spacer"></div>
  <div class="g12 mt6"><div class="c12"><div class="label" style="margin-bottom:2mm">Method</div><ul class="method">
    <li>Units: tonnes (t), million tonnes (M t), hectares (ha). US hundredweight converted at 1 cwt = 45.36 kg.</li>
    <li>FAOSTAT values are calendar-year, as published (validated range ${FY}–${LY}, May 2026). Trade covers fresh potatoes (HS 0701); frozen fries (HS 2004.10) are reported from national sources.</li>
    <li>Where a figure has several estimates for one year, the most advanced official estimate is used and named (Final &gt; 3rd Advance &gt; 2nd &gt; 1st).</li>
    <li>National figures are reproduced as published by the source named; years can differ between countries, so cross-country comparisons are indicative.</li>
    ${daggers.length ? `<li><span class="dagger">†</span> ${daggers.map(([k]) => k).join(", ")}: as stated on the Potatopedia ${esc(d.name)} profile; the primary publisher and year are not named there and are being confirmed for the next edition.</li>` : ""}
  </ul></div></div>`);
}

function backCover(d) {
  const url = `potatopedia.com/country/${d.slug}`;
  return `<section class="page dark back cover">${coverField()}<div class="in">
  <div class="wmk">Potatopedia</div><div class="tag">The global potato knowledge hub</div>
  <div class="cols">
    <div><span class="label">How to cite</span><p class="cite">Potatopedia (2026). <i>${esc(d.name)} Potato Market Report</i>, ${EDITION.month} edition. ${url}</p>
      <span class="label" style="margin-top:7mm">Data as of</span><p>${EDITION.asOf}. FAOSTAT series ${FY}–${LY}; national figures as dated in the report.</p>
      <span class="label" style="margin-top:7mm">Contact</span><p>hi@potatopedia.com<br/>www.potatopedia.com</p></div>
    <div><span class="label">Disclaimer</span><p>This report is compiled from the public statistical and institutional sources named on page ${SRC_PAGE}. Potatopedia checks figures against those sources but does not guarantee their accuracy and accepts no liability for decisions made on the basis of this report. Company names are listed for information; a listing is not an endorsement, and featured listings are labelled. This free edition may be shared in full with attribution.</p></div>
  </div>
  <div class="paid"><div><h4>The full ${esc(d.name)} country market report</h4><p>A sourced report on one country or segment: production, trade partners, processors, storage and prices. US$ 500 per report.</p></div><span class="url">potatopedia.com/advertise</span></div>
  <div class="foot"><span>© 2026 Potatopedia</span><span>${esc(d.name)} Potato Market Report · ${EDITION.month}</span></div>
</div></section>`;
}

function html(d, dir) {
  const css = fs.readFileSync(path.join(HERE, "brand.css"), "utf8");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(d.name)} Potato Market Report · ${EDITION.month} · Potatopedia</title>
<meta name="author" content="Potatopedia"><meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=block" rel="stylesheet">
<style>${css}</style></head><body>
${cover(d)}${contents(d)}${keyFigures(d)}${production(d)}${trade(d)}${regions(d)}${industry(d, dir)}${outlook(d)}${sources(d)}${backCover(d)}
</body></html>`;
}

// ── Overflow check (fixed pages must not clip content) ──
async function checkOverflow(file) {
  const pw = path.join(os.homedir(), ".claude/scripts/render/node_modules/playwright-core/index.mjs");
  const { chromium } = await import(pathToFileURL(pw).href);
  const exe = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
  const b = await chromium.launch({ executablePath: exe });
  const pg = await b.newPage();
  await pg.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.emulateMedia({ media: "print" });
  const bad = await pg.evaluate(() => [...document.querySelectorAll(".page")].map((p, i) => {
    const body = p.querySelector(".body"); if (!body) return null;
    const over = body.scrollHeight - body.clientHeight;
    const foot = p.querySelector(".rf")?.getBoundingClientRect().top;
    const last = [...body.querySelectorAll("*")].reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
    return over > 1 || (foot && last > foot) ? `page ${i + 1}: overflows by ${Math.max(over, Math.round(last - foot))}px` : null;
  }).filter(Boolean));
  await b.close();
  return bad;
}

fs.mkdirSync(OUT, { recursive: true });
const manifestPath = path.join(ROOT, "lib/reports-manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
for (const slug of slugs) {
  const d = assemble(slug);
  let dir = { ok: false, rows: [] };
  for (let i = 1; i <= 3 && !dir.ok; i++) {
    try { dir = await directoryFor(slug); if (!dir.ok) break; } catch (e) { console.warn(`directory read failed for ${slug} (try ${i}): ${e.message}`); await new Promise((r) => setTimeout(r, 800 * i)); }
  }
  const base = path.join(OUT, `${slug}-${EDITION.code}`);
  fs.writeFileSync(`${base}.html`, html(d, dir));
  const bad = await checkOverflow(`${base}.html`);
  if (bad.length) console.warn(`LAYOUT ${slug}: ${bad.join("; ")}`);
  if (HTML_ONLY) { console.log(`${base}.html`); continue; }
  execFileSync(path.join(os.homedir(), ".claude/scripts/pdf.sh"), [`${base}.html`, `${base}.pdf`, "--format", "A4", "--margin", "0mm"], { stdio: "inherit" });
  const pages = Number(execFileSync("pdfinfo", [`${base}.pdf`]).toString().match(/Pages:\s+(\d+)/)?.[1] || 0);
  manifest[slug] = { edition: EDITION.code, pages, file: `reports/${slug}-${EDITION.code}.pdf`, name: d.name };
  console.log(`${base}.pdf  ${pages} pages  (directory: ${dir.ok ? dir.rows.length + " listings" : "not read"})`);
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
