# Company directory — how listings get published

Pages: `/companies` (A–Z + filters), `/companies/<slug>` (profile), `/companies/processors|seed|machinery`,
`/companies/machinery/<segment>` (segments with ≥ 2 makers), `/companies/country/<country>` (countries with ≥ 2
companies). Landing pages and sitemap entries come from the live data, so new countries/segments appear on their own.

## Data
Neon `pp_companies` (only `published = true` rows show). The backend nightly job (Netcup, `scout/companies/run.sh`)
finds companies, writes `data/company-<slug>.txt` from the company's own website and sets `status = 'ingested'`.
It does **not** publish. Publishing is this repo's step:

## Publishing new profiles (re-run after any nightly run)
```
node scripts/directory-import.mjs --fetch      # rsync new data files from Netcup into data/directory/cache (gitignored)
                                               # then extract drafts + run the quality gate (dry run)
node scripts/directory-import.mjs --apply      # publish the rows that pass (profile, published = true, reviewed_at = now())
```
- Picks every `status = 'ingested'` row with a `file` that is not yet published (`--slug x` for one, `--refresh` to
  re-check published ones; nothing is ever unpublished or deleted).
- Data files are read from `data/directory/cache/`, then `../potatopedia-backend/data/` (after a `git pull` there).
- Extraction: `claude -p --model opus` condenses the file into the profile fields using only facts in the file
  (prompt: `scripts/directory-import.prompt.md`). Drafts are saved in `data/directory/drafts/<slug>.json` and reused;
  `--re-extract` rebuilds them. Commit the drafts so every published profile can be reviewed.
- Quality gate (all must pass): ≥ 1 source URL on the company's own domain (taken from the file's `Source:` line, not
  the model); summary present (2–4 sentences); no praise words left in summary/products/machines ("leading",
  "world-class", "market leader", "best", "innovative", "premier" …: summary sentences with them are dropped, list
  items have the word cut); no banned names (PotatoPro, Potato News Today, FreshPlaza, TimesCA, indianpotato.com,
  potatosorting.com, opticalsorting.ai); contact website on the company's own domain. Contact values must appear
  verbatim in the file, otherwise they are dropped.
- Report: printed, and written to `data/directory/import-report.json`.

## Profile shape (profile jsonb)
`common_name, summary, hq{city,country}, founded, ownership, products[], machines[], varieties[], brands[],
plants[{town,country,capacity_as_stated}], markets[], certifications[], facts[], contact{website,public_email,phone,address},
limitations[], sources[{url,title,accessed}], last_checked`. `common_name` drives titles ("Agrico — Seed Potato Breeder &
Exporter (Netherlands)") and cards; the H1 keeps the legal name.

## Paid and proof-of-value columns
- `featured`, `featured_until`: Featured listing ($1,500/yr per company type, $600/yr one country). Badge + Featured row only.
- `verified`, `verified_until` (date): Verified company profile ($300/yr). Badge "Verified by the company" while the
  date is in the future; otherwise the profile shows "Compiled from the company's public website · Is this your company?
  Verify it →" (links `/for-companies?company=…&website=…&listing=<slug>#claim`).
- Outbound clicks: website links on cards and profiles go through `/api/out?c=<slug>` → `pp_company_clicks`
  (slug, ts, referrer, country; no IP), then 302 to that company's own website only. Bots are not logged.
- Claims/enquiries: `leads` with `type = 'company_claim'` and `details.company_slug`.
- Sales summary: `node scripts/directory-stats.mjs [--days 30] [--csv]`.

Schema changes (additive): `docs/sql/2026-11-08-directory-verified-clicks.sql`.

## Per-country cap (7 Nov 2026)
Potatopedia is neutral and global, so `COUNTRY_CAP_PER_KIND = 12` (`lib/directory-cap.mjs`) limits published companies per
country per kind (processing / seed / machinery). `scripts/directory-import.mjs` enforces it on every `--apply` run
(`--cap-only [--apply]` runs just the cap). Rows over the cap are not deleted: `published = false`, log line
`held: country cap (Country, kind)` [CAP DROPPED 7 Nov 2026: COUNTRY_CAP_PER_KIND = Infinity, all held rows released; listing still interleaves countries], profile kept. They are re-published automatically (log `released: country cap`)
when the cap allows. Kept first by verification quality: company-verified, then hand-reviewed by the editors (log line
`reviewed: by hand`; the 10 original profiles of 7 Nov), then machine drafts; then higher completeness score (sourced
profile fields + sources count), then oldest `found_at`, then slug; never by size or fame. A held `/companies/<slug>` 308-redirects to its country page (or
`/companies`), and drops out of the sitemap, counts and ItemList because those read published rows only.
Listing order: countries interleaved round-robin within each kind (alphabetical tie-break); category pages list
country sections alphabetically.
