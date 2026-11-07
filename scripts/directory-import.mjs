#!/usr/bin/env node
// Publish profiled companies into the /companies directory, behind a quality gate (8 Nov 2026).
//
// Reads every pp_companies row with status 'ingested' and a data file (data/company-<slug>.txt, written nightly by the
// backend job from the company's own website), turns the file into the profile jsonb used by the site, checks it, and
// (with --apply) sets profile, published = true and reviewed_at = now() for the rows that pass. Nothing is deleted or
// unpublished; rows that fail stay unpublished and are listed with the reason. See docs/directory.md.
//
//   node scripts/directory-import.mjs --fetch            # copy new data files from the Netcup server first (rsync)
//   node scripts/directory-import.mjs                    # dry run: extract drafts, run the gate, print the report
//   node scripts/directory-import.mjs --apply            # write the passing profiles and publish them
//   options: --slug <slug> (one company) · --refresh (also re-check already published rows; never unpublishes)
//            --re-extract (rebuild drafts) · --no-extract (only use drafts already on disk) · --jobs 4
//
// Extraction: the long data file is condensed into the profile fields by `claude -p` (Opus) with the prompt in
// scripts/directory-import.prompt.md, using only facts in the file. Drafts are kept in data/directory/drafts/<slug>.json
// (committed, so every published profile can be reviewed). Everything the gate trusts is checked in code: sources come
// straight from the file's Source line, the contact values must appear verbatim in the file, praise words are removed.

import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const CACHE = join(ROOT, "data/directory/cache"); // gitignored copy of the backend data files
const DRAFTS = join(ROOT, "data/directory/drafts");
const BACKEND_DATA = resolve(ROOT, "../potatopedia-backend/data");
const REMOTE = process.env.PP_DATA_REMOTE || "dk@159.195.114.16:~/Projects/potatopedia-backend/data/";

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const APPLY = flag("--apply");
const ONE = opt("--slug", null);
const JOBS = Number(opt("--jobs", 4));

function loadEnv() {
  if (process.env.DATABASE_URL) return;
  for (const f of [join(ROOT, ".env.local"), resolve(ROOT, "../potatopedia-next/.env.local")]) {
    if (!existsSync(f)) continue;
    const m = readFileSync(f, "utf8").match(/^DATABASE_URL=["']?([^"'\n]+)/m);
    if (m) { process.env.DATABASE_URL = m[1]; return; }
  }
  throw new Error("DATABASE_URL not found");
}

// ── rules ────────────────────────────────────────────────────────────────────────────────────────────────────────
export const PRAISE = [
  "world-class", "world class", "market leader", "market-leading", "industry-leading", "leading", "best", "innovative",
  "premier", "state-of-the-art", "renowned", "unique", "unrivalled", "unparalleled", "cutting-edge", "top-quality",
];
const PRAISE_RE = new RegExp(`\\b(${PRAISE.map((w) => w.replace(/[-\s]/g, "[-\\s]")).join("|")})\\b`, "i");
export const BANNED = ["potatopro", "potato news today", "potatonewstoday", "freshplaza", "timesca", "indianpotato.com", "potatosorting.com", "opticalsorting.ai"];

const host = (u) => { try { return new URL(u).host.toLowerCase().replace(/^www\./, ""); } catch { return ""; } };
const onDomain = (u, domain) => { const h = host(u); const d = String(domain || "").toLowerCase().replace(/^www\./, ""); return !!h && !!d && (h === d || h.endsWith("." + d)); };
const norm = (s) => String(s || "").normalize("NFC").replace(/\s+/g, " ").trim();

// Sentence split that keeps abbreviations (B.V., Ltd., St., e.g.) and decimals inside their sentence.
const ABBR = /\b(B\.V|N\.V|U\.A|Inc|Ltd|Co|St|Dr|Mr|Mrs|No|nr|e\.g|i\.e|approx|incl|ca)\.|(\d)\.(\d)|\b([A-Z])\.(?=[A-Z]\.|\s[A-Z][a-z])/g;
export function sentences(text) {
  const masked = norm(text).replace(ABBR, (m) => m.replace(/\./g, "\u0000"));
  return (masked.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || []).map((x) => x.replace(/\u0000/g, ".").trim()).filter(Boolean);
}
// Remove praise words: sentences in the summary that lean on them are dropped; in list items the word is cut.
function scrubSentence(text) {
  return sentences(text).filter((s) => !PRAISE_RE.test(s)).join(" ");
}
function scrubItem(t) {
  let s = norm(t);
  for (let i = 0; i < 4 && PRAISE_RE.test(s); i++) s = s.replace(PRAISE_RE, "").replace(/\s{2,}/g, " ").replace(/\s+([,.;:)])/g, "$1").replace(/\(\s+/g, "(").trim();
  return s.replace(/^[,;:\s-]+/, "");
}

// Sources straight from the file's Source line, own domain only.
function parseSources(text, domain, common) {
  const line = (text.match(/^Source:(.*)$/m) || [])[1] || "";
  const accessed = (line.match(/accessed\s+(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
  const urls = [...new Set((line.match(/https?:\/\/[^\s,()<>]+/g) || []).map((u) => u.replace(/[.;:]+$/, "")))];
  const own = urls.filter((u) => onDomain(u, domain) && !/\.(xml|pdf)(\?|$)/i.test(u));
  return {
    accessed,
    all: urls,
    sources: own.slice(0, 12).map((url) => ({ url, title: pageTitle(url, common), ...(accessed ? { accessed } : {}) })),
  };
}
function pageTitle(url, common) {
  let p;
  try { p = new URL(url).pathname.replace(/\/(index\.html?)?$/, ""); } catch { return url; }
  const seg = p.split("/").filter(Boolean).filter((s) => !/^[a-z]{2}(-[a-z]{2})?$/i.test(s));
  if (!seg.length) return `${common} home page`;
  const last = decodeURIComponent(seg[seg.length - 1]).replace(/\.html?$/, "").replace(/[-_]+/g, " ").trim();
  return last.charAt(0).toUpperCase() + last.slice(1);
}

// "Contact exactly as published": every value must occur verbatim in the file (spacing aside), else it is dropped.
function checkContact(c = {}, text, domain) {
  const flat = norm(text).toLowerCase();
  const out = {};
  const dropped = [];
  for (const k of ["address", "phone", "public_email", "website"]) {
    let v = norm(c[k]);
    if (!v) continue;
    if (k === "website" && !/^https?:\/\//i.test(v) && /^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(v)) {
      if (!flat.includes(v.toLowerCase())) { dropped.push(k); continue; }
      out[k] = `https://${v}`;
      continue;
    }
    const probe = k === "website" ? v.replace(/\/$/, "").toLowerCase() : v.toLowerCase();
    const ok = flat.includes(probe) || (k === "address" && v.split(/,\s*/).every((part) => flat.includes(part.toLowerCase())));
    if (ok) out[k] = v; else dropped.push(k);
  }
  if (out.public_email && /@/.test(out.public_email) === false) delete out.public_email;
  return { contact: out, dropped };
}

const arr = (a, n, max = 160) => (Array.isArray(a) ? a.map((x) => scrubItem(x)).filter((x) => x && x.length <= max).slice(0, n) : []);

export function buildProfile(draft, text, row) {
  const common = norm(draft.common_name) || row.name;
  const { sources, accessed, all } = parseSources(text, row.domain, common);
  const { contact, dropped } = checkContact(draft.contact, text, row.domain);
  if (!contact.website && row.home_url && onDomain(row.home_url, row.domain)) contact.website = row.home_url;
  const p = {
    common_name: common,
    summary: scrubSentence(draft.summary || ""),
    hq: draft.hq && (draft.hq.city || draft.hq.country) ? { ...(draft.hq.city ? { city: norm(draft.hq.city) } : {}), country: norm(draft.hq.country) || row.country } : { country: row.country },
    ...(draft.founded ? { founded: norm(draft.founded) } : {}),
    ...(draft.ownership ? { ownership: scrubItem(draft.ownership) } : {}),
    products: arr(draft.products, 8, 120),
    machines: row.kind === "machinery" ? arr(draft.machines, 10, 140) : [],
    varieties: row.kind === "seed" ? arr(draft.varieties, 30, 40).map((v) => v.replace(/\s*\(.*?\)\s*/g, " ").trim()) : [],
    brands: arr(draft.brands, 8, 60),
    plants: (Array.isArray(draft.plants) ? draft.plants : []).filter((x) => x && x.town).slice(0, 10).map((x) => ({
      town: norm(x.town), country: norm(x.country) || row.country, ...(x.capacity_as_stated ? { capacity_as_stated: norm(x.capacity_as_stated) } : {}),
    })),
    markets: arr(draft.markets, 6, 160),
    certifications: arr(draft.certifications, 10, 60),
    facts: arr(draft.facts, 5, 140),
    contact,
    limitations: arr(draft.limitations, 3, 240),
    sources,
    last_checked: accessed || new Date().toISOString().slice(0, 10),
  };
  for (const k of Object.keys(p)) if (Array.isArray(p[k]) && !p[k].length) delete p[k];
  return { profile: p, dropped, allUrls: all };
}

export function gate(p, row, allUrls) {
  const why = [];
  if (!p.sources?.length) why.push("no official source URL on the company's own domain");
  const n = sentences(p.summary || "").length;
  if (!p.summary || n < 2) why.push("summary missing or shorter than 2 sentences after praise removal");
  if (n > 4) why.push("summary longer than 4 sentences");
  const scan = [p.summary, ...(p.products || []), ...(p.machines || [])].join(" \n ");
  if (PRAISE_RE.test(scan)) why.push(`praise word left: "${scan.match(PRAISE_RE)[0]}"`);
  const blob = JSON.stringify(p).toLowerCase();
  const banned = BANNED.find((b) => blob.includes(b));
  if (banned) why.push(`banned name in profile: ${banned}`);
  if (!p.contact?.website) why.push("no contact website");
  else if (!onDomain(p.contact.website, row.domain)) why.push(`contact website ${host(p.contact.website)} is not on ${row.domain}`);
  const foreign = allUrls.filter((u) => BANNED.some((b) => u.toLowerCase().includes(b.replace(/\s/g, ""))));
  if (foreign.length) why.push(`banned source URL: ${foreign[0]}`);
  return why;
}

// ── data files and drafts ───────────────────────────────────────────────────────────────────────────────────────
function readData(file) {
  for (const d of [CACHE, BACKEND_DATA]) {
    const f = join(d, file);
    if (existsSync(f)) return { text: readFileSync(f, "utf8"), path: f };
  }
  return null;
}

const PROMPT = readFileSync(join(HERE, "directory-import.prompt.md"), "utf8");

function extract(row, text) {
  const prompt = PROMPT.replaceAll("{{NAME}}", row.name).replaceAll("{{KIND}}", row.kind).replaceAll("{{COUNTRY}}", row.country || "")
    .replaceAll("{{DOMAIN}}", row.domain || "").replace("{{TEXT}}", text.slice(0, 60000));
  return new Promise((ok, fail) => {
    const ch = spawn("claude", ["-p", "--model", "opus", "--output-format", "text", "--tools", ""], { stdio: ["pipe", "pipe", "pipe"] });
    let out = "", err = "";
    const t = setTimeout(() => { ch.kill("SIGKILL"); fail(new Error("timeout")); }, 420_000);
    ch.stdout.on("data", (d) => (out += d));
    ch.stderr.on("data", (d) => (err += d));
    ch.on("close", (code) => {
      clearTimeout(t);
      const m = out.match(/\{[\s\S]*\}/);
      if (code !== 0 || !m) return fail(new Error(`claude exit ${code}: ${(err || out).slice(0, 200)}`));
      try { ok(JSON.parse(m[0])); } catch (e) { fail(new Error("bad JSON: " + e.message)); }
    });
    ch.stdin.end(prompt);
  });
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

// ── main ────────────────────────────────────────────────────────────────────────────────────────────────────────
async function main() {
  loadEnv();
  mkdirSync(CACHE, { recursive: true });
  mkdirSync(DRAFTS, { recursive: true });
  if (flag("--fetch")) {
    const r = spawnSync("rsync", ["-az", "--include=company-*.txt", "--exclude=*", REMOTE, CACHE + "/"], { stdio: "inherit" });
    if (r.status !== 0) console.error("rsync failed; using the files already on disk");
  }
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`select id, slug, name, kind, domain, home_url, country, segments, file, published, profile
    from pp_companies where status = 'ingested' and file is not null
    ${flag("--refresh") ? sql`` : sql`and published = false`} ${ONE ? sql`and slug = ${ONE}` : sql``} order by kind, slug`;
  console.log(`${rows.length} ingested row(s) to check${APPLY ? "" : " (dry run)"}`);

  const results = await pool(rows, JOBS, async (row) => {
    const data = readData(row.file);
    if (!data) return { row, fail: ["no data file (run with --fetch)"] };
    const dpath = join(DRAFTS, `${row.slug}.json`);
    let draft = null;
    const stale = existsSync(dpath) && statSync(dpath).mtimeMs < statSync(data.path).mtimeMs;
    if (existsSync(dpath) && !flag("--re-extract") && !stale) draft = JSON.parse(readFileSync(dpath, "utf8"));
    else if (!flag("--no-extract")) {
      for (let a = 1; a <= 2 && !draft; a++) {
        try { draft = await extract(row, data.text); } catch (e) { if (a === 2) return { row, fail: [`extraction failed: ${e.message}`] }; }
      }
      writeFileSync(dpath, JSON.stringify(draft, null, 1) + "\n");
      console.log(`  drafted ${row.slug}`);
    }
    if (!draft) return { row, fail: ["no draft (run without --no-extract)"] };
    const { profile, dropped, allUrls } = buildProfile(draft, data.text, row);
    const fail = gate(profile, row, allUrls);
    return { row, profile, fail, dropped };
  });

  const pass = results.filter((r) => !r.fail.length);
  const failed = results.filter((r) => r.fail.length);
  console.log(`\nPASS ${pass.length}`);
  for (const r of pass) console.log(`  ✓ ${r.row.kind.padEnd(10)} ${r.row.slug}${r.dropped?.length ? `  (contact dropped, not verbatim: ${r.dropped.join(", ")})` : ""}`);
  console.log(`FAIL ${failed.length}`);
  for (const r of failed) console.log(`  ✗ ${r.row.slug}: ${r.fail.join("; ")}`);
  writeFileSync(join(ROOT, "data/directory/import-report.json"), JSON.stringify({
    at: new Date().toISOString(), applied: APPLY,
    passed: pass.map((r) => ({ slug: r.row.slug, dropped_contact: r.dropped })),
    failed: failed.map((r) => ({ slug: r.row.slug, reasons: r.fail })),
  }, null, 1) + "\n");

  if (!APPLY) { console.log("\nDry run: nothing written. Re-run with --apply to publish the passing rows."); return; }
  for (const r of pass) {
    await sql`update pp_companies set profile = ${JSON.stringify(r.profile)}::jsonb, published = true, reviewed_at = now(), updated_at = now()
      where id = ${r.row.id} and status = 'ingested'`;
  }
  console.log(`\nPublished ${pass.length} profile(s).`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
