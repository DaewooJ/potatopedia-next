// Directory: add the listing columns to pp_companies and load the reviewed first-ten profiles.
// Run: node scripts/directory-seed.mjs   (reads DATABASE_URL from .env.local). Idempotent.
import { neon } from "@neondatabase/serverless";
import fs from "fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; }),
);
const sql = neon(process.env.DATABASE_URL || env.DATABASE_URL);

await sql`alter table pp_companies add column if not exists published boolean not null default false`;
await sql`alter table pp_companies add column if not exists featured boolean not null default false`;
await sql`alter table pp_companies add column if not exists featured_until date`;
await sql`alter table pp_companies add column if not exists profile jsonb`;
await sql`alter table pp_companies add column if not exists logo_url text`;
await sql`alter table pp_companies add column if not exists reviewed_at timestamptz`;
await sql`create index if not exists pp_companies_published_idx on pp_companies (published) where published`;

const rows = JSON.parse(fs.readFileSync("data/directory/first-ten.json", "utf8"));
for (const r of rows) {
  const profile = { ...r.profile, last_checked: r.profile.last_checked || "2026-11-07" };
  if (r.match_id) {
    await sql`update pp_companies set kind = ${r.kind}, slug = ${r.slug}, name = ${r.name}, home_url = ${r.home_url},
      country = ${r.country}, region = coalesce(${r.region}, region), segments = ${r.segments}, profile = ${JSON.stringify(profile)}::jsonb,
      published = true, featured = false, featured_until = null, reviewed_at = now(), updated_at = now()
      where id = ${r.match_id}`;
  } else {
    await sql`insert into pp_companies (kind, slug, name, domain, home_url, country, region, segments, status, profile, published, featured, reviewed_at, found_at, updated_at)
      values (${r.kind}, ${r.slug}, ${r.name}, ${r.domain}, ${r.home_url}, ${r.country}, ${r.region}, ${r.segments}, 'found',
      ${JSON.stringify(profile)}::jsonb, true, false, now(), now(), now())
      on conflict (domain) do update set kind = excluded.kind, slug = excluded.slug, name = excluded.name, home_url = excluded.home_url,
      country = excluded.country, segments = excluded.segments, profile = excluded.profile, published = true, featured = false,
      featured_until = null, reviewed_at = now(), updated_at = now()`;
  }
  console.log("ok", r.slug);
}
const n = await sql`select kind, count(*)::int n from pp_companies where published group by kind order by kind`;
console.log(n);
