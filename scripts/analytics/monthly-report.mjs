// Monthly search + AI report (7 Nov 2026). Google (Search Console API, read-only key ~/.config/gcp/gsc-reader.json),
// Bing clicks and AI citations (latest exports dropped into scripts/data/bing/). Writes scripts/data/reports/<YYYY-MM>.md
// (gitignored) and prints it.  Usage: node scripts/analytics/monthly-report.mjs
import crypto from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const BING = join(ROOT, "scripts/data/bing");
const fmt = (n) => Number(n).toLocaleString("en-US");
const day = (d) => d.toISOString().slice(0, 10);
const lines = [];
const P = (s = "") => lines.push(s);

// ---- Google (Search Console) ----
async function gsc() {
  const keyFile = join(homedir(), ".config/gcp/gsc-reader.json");
  if (!existsSync(keyFile)) return P("Google: no Search Console key on this machine.");
  const sa = JSON.parse(readFileSync(keyFile, "utf8"));
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const un = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = crypto.sign("RSA-SHA256", Buffer.from(un), sa.private_key).toString("base64url");
  const tk = (await (await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${un}.${sig}` }) })).json()).access_token;
  const q = async (body) => (await (await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent("sc-domain:potatopedia.com")}/searchAnalytics/query`, { method: "POST", headers: { authorization: `Bearer ${tk}`, "content-type": "application/json" }, body: JSON.stringify(body) })).json());
  const end = new Date(Date.now() - 2 * 864e5), start = new Date(end - 27 * 864e5), pend = new Date(start - 864e5), pstart = new Date(pend - 27 * 864e5);
  const [cur, prev] = [await q({ startDate: day(start), endDate: day(end) }), await q({ startDate: day(pstart), endDate: day(pend) })];
  const c = cur.rows?.[0] || {}, p = prev.rows?.[0] || {};
  const ch = (a, b) => (b ? `${a >= b ? "+" : ""}${Math.round((100 * (a - b)) / b)}%` : "n/a");
  P(`## Google (28 days to ${day(end)})`);
  P(`- Clicks ${fmt(c.clicks || 0)} (${ch(c.clicks, p.clicks)} vs previous 28 days) · impressions ${fmt(c.impressions || 0)} (${ch(c.impressions, p.impressions)}) · CTR ${((c.ctr || 0) * 100).toFixed(2)}% · avg position ${(c.position || 0).toFixed(1)}`);
  const pages = await q({ startDate: day(start), endDate: day(end), dimensions: ["page"], rowLimit: 10 });
  P("- Top pages: " + (pages.rows || []).map((r) => `${r.keys[0].replace(/^https?:\/\/(www\.)?potatopedia\.com/, "") || "/"} (${r.clicks})`).join(", "));
  const qs = await q({ startDate: day(start), endDate: day(end), dimensions: ["query"], rowLimit: 10 });
  P("- Top queries: " + (qs.rows || []).map((r) => `${r.keys[0]} (${r.clicks})`).join(", "));
}

// ---- Bing exports ----
const latest = (re) => existsSync(BING) && readdirSync(BING).filter((f) => re.test(f)).map((f) => join(BING, f)).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
const csv = (f) => readFileSync(f, "utf8").replace(/^﻿/, "").trim().split(/\r?\n/).slice(1).map((l) => l.split(",").map((x) => x.replace(/"/g, "")));
function bing() {
  const f = latest(/SearchPerformanceOverview/);
  if (!f) return P("## Bing\n- No search performance export in scripts/data/bing/.");
  const r = csv(f), last = r.slice(-30);
  const clicks = last.reduce((s, x) => s + +x[1], 0), impr = last.reduce((s, x) => s + +x[2], 0);
  P(`## Bing (last 30 days in export, to ${last.at(-1)[0].split(" ")[0]})`);
  P(`- Clicks ${fmt(clicks)} (${(clicks / last.length).toFixed(1)}/day) · impressions ${fmt(impr)} · CTR ${((100 * clicks) / impr).toFixed(2)}%`);
}
function ai() {
  const j = join(ROOT, "lib/ai-citations.json");
  if (!existsSync(j)) return P("## AI citations\n- Run scripts/analytics/ai-citations.mjs after adding a Bing AI export.");
  const a = JSON.parse(readFileSync(j, "utf8"));
  P(`## AI citations (Microsoft Copilot + Bing AI answers, to ${a.period_end})`);
  P(`- ${fmt(a.citations_per_day_30d)} citations/day (30-day average; first 30 days of export: ${fmt(a.citations_per_day_first30d)}/day) · ${fmt(a.citations_total)} in ${a.days} days · ${a.cited_pages_per_day_30d} pages cited per day`);
  P("- By month: " + a.monthly.map((m) => `${m.month} ${fmt(m.citations_per_day)}/day`).join(" · "));
}

const month = new Date().toISOString().slice(0, 7);
P(`# Potatopedia search & AI report — ${month}`);
P(`Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`);
P();
try { await gsc(); } catch (e) { P(`Google: error ${e.message}`); }
P(); bing(); P(); ai();
const out = join(ROOT, "scripts/data/reports");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, `${month}.md`), lines.join("\n") + "\n");
console.log(lines.join("\n"));
