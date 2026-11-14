#!/usr/bin/env node
// Put an issue's magazine edition (made in DigiMagz; never laid out here) on its issue page:
//   node scripts/newsletters/magazine-upload.mjs --issue <id> --pdf <file.pdf> [--pages <dir of p1.jpg…pN.jpg>] [--dry]
// 1. Page images: without --pages each page is rendered from the PDF itself (pdftoppm, long edge 1600 px: sharper text
//    than DigiMagz's 909 px proofs); with --pages those JPEGs are fitted (macOS `sips`). Either way JPEG ≤250 KB
//    (quality steps down until it fits). Stored in Neon table media as
//    issue-<id>-mag-pNN-<sha8> → served at /media/<key>.jpg (immutable).
// 2. The PDF goes to the PRIVATE Vercel Blob store as magazines/<newsletter>-<date>.pdf (never public, never committed).
// 3. issues.magazine = {pages, pdf, made_by, made_at}; the issue page is revalidated (needs NEWSLETTER_API_SECRET).
// Env: DATABASE_URL, BLOB_READ_WRITE_TOKEN (from .env.local via `vercel env pull`), NEWSLETTER_API_SECRET for revalidate.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import { put, head } from "@vercel/blob";
import { putMedia, MAX_MEDIA_BYTES } from "../../lib/media.js";
import { dayStr, SITE } from "../../lib/newsletters.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
for (const p of [path.join(ROOT, ".env.local")]) {
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : null; };
const id = Number(arg("issue"));
const dir = arg("pages");
const pdf = arg("pdf");
const dry = process.argv.includes("--dry");
if (!id || !pdf) { console.error("usage: --issue <id> --pdf <file> [--pages <dir>] [--dry]"); process.exit(1); }
for (const k of ["DATABASE_URL", "BLOB_READ_WRITE_TOKEN"]) if (!process.env[k]) { console.error(`${k} not set (vercel env pull)`); process.exit(1); }

const sql = neon(process.env.DATABASE_URL);
const [issue] = await sql.query(`select id, newsletter, issue_no, issue_date, dry_run from issues where id=$1`, [id]);
if (!issue) { console.error(`issue ${id} not found`); process.exit(1); }
const date = dayStr(issue.issue_date);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mag-"));
const size = (f) => { const o = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", f]).toString(); return [Number(/pixelWidth: (\d+)/.exec(o)[1]), Number(/pixelHeight: (\d+)/.exec(o)[1])]; };
const pdfPages = Number(/Pages:\s+(\d+)/.exec(execFileSync("pdfinfo", [pdf]).toString())?.[1] || 0);
const files = dir
  ? fs.readdirSync(dir).filter((f) => /^p\d+\.jpe?g$/i.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
  : Array.from({ length: pdfPages }, (_, i) => `page ${i + 1}`);
if (!files.length) { console.error(dir ? `no p1.jpg… in ${dir}` : "PDF has no pages"); process.exit(1); }

const pages = [];
for (const [i, f] of files.entries()) {
  const out = path.join(tmp, `p${i + 1}.jpg`);
  let q = 76;
  for (;;) {
    if (dir) {
      const src = path.join(dir, f);
      const [w0, h0] = size(src);
      const args = ["-s", "format", "jpeg", "-s", "formatOptions", String(q)];
      if (Math.max(w0, h0) > 1600) args.push("-Z", "1600");
      execFileSync("sips", [...args, src, "--out", out], { stdio: "ignore" });
    } else {
      const stem = path.join(tmp, `r${i + 1}`);
      execFileSync("pdftoppm", ["-f", String(i + 1), "-l", String(i + 1), "-singlefile", "-jpeg", "-jpegopt", `quality=${q},progressive=y,optimize=y`, "-scale-to", "1600", pdf, stem]);
      fs.renameSync(`${stem}.jpg`, out);
    }
    if (fs.statSync(out).size <= 250 * 1024 || q <= 46) break;
    q -= 6;
  }
  let w, h;
  [w, h] = size(out);
  const bytes = fs.readFileSync(out);
  if (bytes.length > MAX_MEDIA_BYTES) { console.error(`${f}: ${bytes.length} bytes after q${q}, over the media limit`); process.exit(1); }
  const key = `issue-${id}-mag-p${String(i + 1).padStart(2, "0")}-${createHash("sha256").update(bytes).digest("hex").slice(0, 8)}`;
  if (!dry) await putMedia(sql, { key, bytes, width: w, height: h, credit: "DigiMagz", licence: "own" });
  pages.push({ src: `/media/${key}.jpg`, w, h });
  console.log(`p${i + 1}: ${w}x${h} q${q} ${(bytes.length / 1024).toFixed(0)} KB → ${key}`);
}

const pdfBytes = fs.readFileSync(pdf);
const file = `magazines/${issue.newsletter}-${date}.pdf`;
if (!dry) {
  await put(file, pdfBytes, { access: "private", contentType: "application/pdf", addRandomSuffix: false, allowOverwrite: true });
  const h = await head(file);
  console.log(`pdf: ${file} ${h.size} bytes (private)`);
}
const magazine = {
  pages,
  pdf: { file, bytes: pdfBytes.length, pages: pdfPages, name: path.basename(pdf) },
  made_by: "DigiMagz",
  made_at: new Date().toISOString(),
};
if (dry) { console.log(JSON.stringify(magazine, null, 1)); process.exit(0); }
await sql.query(`update issues set magazine=$2::jsonb where id=$1`, [id, JSON.stringify(magazine)]);
console.log(`issues.magazine set for #${id} (${issue.newsletter} ${date}, ${pages.length} pages)`);

const secret = process.env.NEWSLETTER_API_SECRET;
const base = process.env.REVALIDATE_BASE || SITE;
if (secret) {
  const r = await fetch(`${base}/api/revalidate`, {
    method: "POST", headers: { "content-type": "application/json", "x-newsletter-secret": secret },
    body: JSON.stringify({ paths: [`/issues/${issue.newsletter}/${date}`] }),
  });
  console.log(`revalidate ${base}: ${r.status}`);
} else console.log("NEWSLETTER_API_SECRET not set: issue page refreshes within the hour (ISR)");
