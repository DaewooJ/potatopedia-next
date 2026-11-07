// AI citations (Bing Webmaster Tools "AI performance" export) → lib/ai-citations.json, used by /advertise, the media kit
// and the analytics report. Run after dropping a fresh export into scripts/data/bing/:
//   node scripts/analytics/ai-citations.mjs [path/to/potatopedia.com_AIPerformanceOverviewStats_*.csv]
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dir = join(ROOT, "scripts/data/bing");
const file = process.argv[2] || readdirSync(dir).filter((f) => /AIPerformanceOverviewStats/.test(f))
  .map((f) => join(dir, f)).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
if (!file) throw new Error("no AIPerformanceOverviewStats export in scripts/data/bing/");
const rows = readFileSync(file, "utf8").replace(/^﻿/, "").trim().split(/\r?\n/).slice(1).map((l) => {
  const [d, c, p] = l.split(",").map((x) => x.replace(/"/g, ""));
  const [m, day, y] = d.split(" ")[0].split("/").map(Number);
  return { date: new Date(Date.UTC(y, m - 1, day)).toISOString().slice(0, 10), citations: +c, pages: +p };
}).sort((a, b) => a.date.localeCompare(b.date));
const last30 = rows.slice(-30), first30 = rows.slice(0, 30);
const avg = (a, k) => Math.round(a.reduce((s, r) => s + r[k], 0) / a.length);
const out = {
  source: "Bing Webmaster Tools, AI performance (Microsoft Copilot and Bing AI answers)",
  period_end: rows.at(-1).date, period_start: rows[0].date,
  citations_per_day_30d: avg(last30, "citations"), cited_pages_per_day_30d: avg(last30, "pages"),
  citations_per_day_first30d: avg(first30, "citations"), citations_total: rows.reduce((s, r) => s + r.citations, 0), days: rows.length,
  monthly: Object.values(rows.reduce((m, r) => { const k = r.date.slice(0, 7); (m[k] ||= { month: k, citations: 0, days: 0 }); m[k].citations += r.citations; m[k].days++; return m; }, {}))
    .map((x) => ({ month: x.month, citations_per_day: Math.round(x.citations / x.days), days: x.days })),
};
writeFileSync(join(ROOT, "lib/ai-citations.json"), JSON.stringify(out, null, 1) + "\n");
console.log(JSON.stringify({ per_day_30d: out.citations_per_day_30d, first30: out.citations_per_day_first30d, total: out.citations_total, end: out.period_end }));
