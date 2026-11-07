#!/usr/bin/env node
// Directory proof of value for sales (8 Nov 2026): per company, outbound website clicks (pp_company_clicks, no IPs)
// and enquiries / claims (leads of type company_claim with details.company_slug), over the last N days (default 30).
//   node scripts/directory-stats.mjs [--days 30] [--csv]
import { neon } from "@neondatabase/serverless";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
if (!process.env.DATABASE_URL && existsSync(join(ROOT, ".env.local"))) {
  const m = readFileSync(join(ROOT, ".env.local"), "utf8").match(/^DATABASE_URL=["']?([^"'\n]+)/m);
  if (m) process.env.DATABASE_URL = m[1];
}
const args = process.argv.slice(2);
const DAYS = Number(args.includes("--days") ? args[args.indexOf("--days") + 1] : 30);
const sql = neon(process.env.DATABASE_URL);

const rows = await sql`
  with c as (select slug, count(*)::int clicks, count(distinct country)::int countries, max(ts) last_click
             from pp_company_clicks where ts > now() - make_interval(days => ${DAYS}) group by slug),
       l as (select details->>'company_slug' slug, count(*)::int claims
             from leads where type = 'company_claim' and details->>'company_slug' is not null
               and created_at > now() - make_interval(days => ${DAYS}) group by 1)
  select p.slug, coalesce(p.profile->>'common_name', p.name) as name, p.kind, p.country, p.featured, p.verified,
         coalesce(c.clicks, 0) clicks, coalesce(c.countries, 0) countries, c.last_click, coalesce(l.claims, 0) claims
  from pp_companies p left join c on c.slug = p.slug left join l on l.slug = p.slug
  where p.published = true and (c.clicks > 0 or l.claims > 0)
  order by clicks desc, claims desc, name`;
const [tot] = await sql`select count(*)::int n, count(distinct slug)::int cos from pp_company_clicks where ts > now() - make_interval(days => ${DAYS})`;

if (args.includes("--csv")) {
  console.log("slug,name,kind,country,clicks,countries,claims,featured,verified");
  for (const r of rows) console.log([r.slug, `"${r.name.replace(/"/g, '""')}"`, r.kind, r.country, r.clicks, r.countries, r.claims, r.featured, r.verified].join(","));
} else {
  console.log(`Company directory, last ${DAYS} days: ${tot.n} website clicks to ${tot.cos} companies.\n`);
  console.log("clicks  ctry  claims  company");
  for (const r of rows) console.log(`${String(r.clicks).padStart(6)}  ${String(r.countries).padStart(4)}  ${String(r.claims).padStart(6)}  ${r.name} (${r.kind}, ${r.country})${r.featured ? " · featured" : ""}${r.verified ? " · verified" : ""}`);
  if (!rows.length) console.log("  (no clicks or claims yet)");
}
