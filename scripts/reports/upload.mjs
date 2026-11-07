#!/usr/bin/env node
// Upload generated country reports to the PRIVATE Vercel Blob store (potatopedia-reports):
//   node scripts/reports/upload.mjs [slug ...]      (no slug = every report in lib/reports-manifest.json)
// Reads reports-out/<slug>-<edition>.pdf and writes blob pathname reports/<slug>-<edition>.pdf (private, overwrite).
// Token: BLOB_READ_WRITE_TOKEN from the environment or .env.local (`vercel env pull` puts it there).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put, head } from "@vercel/blob";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
for (const p of [path.join(ROOT, ".env.local"), path.join(ROOT, "../potatopedia-next/.env.local")]) {
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error("BLOB_READ_WRITE_TOKEN not set (run `vercel env pull`)"); process.exit(1); }

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "lib/reports-manifest.json"), "utf8"));
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(manifest);
for (const slug of slugs) {
  const m = manifest[slug];
  if (!m) { console.error(`${slug}: not in lib/reports-manifest.json (build it first)`); process.exitCode = 1; continue; }
  const local = path.join(ROOT, "reports-out", path.basename(m.file));
  if (!fs.existsSync(local)) { console.error(`${slug}: missing ${local}`); process.exitCode = 1; continue; }
  const res = await put(m.file, fs.readFileSync(local), {
    access: "private", contentType: "application/pdf", addRandomSuffix: false, allowOverwrite: true,
  });
  const h = await head(m.file);
  console.log(`${slug}: ${res.pathname}  ${h.size} bytes  (private)`);
}
