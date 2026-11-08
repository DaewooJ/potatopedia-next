// Media kit PDF with live numbers (Devendra, 7 Nov 2026: "will these keep auto updating as we grow").
// Fills docs/media-kit.template.html from the backend /stats and the site's own data files, writes
// docs/media-kit.html, then renders public/potatopedia-media-kit.pdf with the headless-Chrome pdf tool.
// Usage: node --import ./scripts/media-kit/resolve-ext.mjs scripts/media-kit/build.mjs [--pdf-tool ~/.claude/scripts/pdf.sh]
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const PDF_TOOL = arg("--pdf-tool", join(homedir(), ".claude/scripts/pdf.sh"));
const fmt = (n) => Number(n).toLocaleString("en-US");

const stats = await (await fetch("https://api.potatopedia.com/stats", { signal: AbortSignal.timeout(60000) })).json();
const { BLOG_POSTS, COUNTRIES } = await import(join(ROOT, "lib/data.js"));
const { VARIETIES } = await import(join(ROOT, "lib/varieties-data.js"));
const baked = JSON.parse(readFileSync(join(ROOT, "lib/answers-baked.json"), "utf8"));
const answers = Array.isArray(baked) ? baked.length : Object.values(baked).filter((a) => a && typeof a === "object" && a.slug).length;
const traits = Object.keys(JSON.parse(readFileSync(join(ROOT, "lib/variety-traits.json"), "utf8"))).length;

const ai = JSON.parse(readFileSync(join(ROOT, "lib/ai-citations.json"), "utf8"));
const longDate = (iso) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const vals = {
  ai_citations: fmt(ai.citations_per_day_30d), ai_end: longDate(ai.period_end), ai_total: fmt(ai.citations_total), ai_days: String(ai.days),
  data_points: fmt(stats.total_chunks), sources: fmt(stats.unique_sources), varieties: fmt(VARIETIES.length), traits: fmt(traits),
  countries: fmt(COUNTRIES.length), answers: fmt(answers), stories: fmt(BLOG_POSTS.length),
  as_of: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }),
};
let html = readFileSync(join(ROOT, "docs/media-kit.template.html"), "utf8");
for (const [k, v] of Object.entries(vals)) html = html.replaceAll(`{{${k}}}`, v);
if (/\{\{\w+\}\}/.test(html)) throw new Error("unfilled placeholder in media kit template");
writeFileSync(join(ROOT, "docs/media-kit.html"), html);
execFileSync(PDF_TOOL, [join(ROOT, "docs/media-kit.html"), join(ROOT, "public/potatopedia-media-kit.pdf"), "--format", "A4", "--margin", "0mm"], { stdio: "inherit" });
console.log("media kit:", JSON.stringify(vals));
