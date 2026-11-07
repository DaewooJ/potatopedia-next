# Gated country report (PDF)

Country pages stay free to read. The "Download PDF Report" button is the gate.

**Before:** the button called `window.print()`; the "PDF" is the browser's save-as-PDF of the page using `lib/printStyles.js`. No PDF file exists.

**Now (when on):** the button opens a form (name, email, company, role, country, optional partner-contact consent, required privacy agreement) -> `POST /api/lead` type `report_download` -> lead stored in Neon, a signed 7-day link is emailed via SES -> `/api/report/<token>` verifies, sets `leads.confirmed_at`, then streams the designed PDF from the private Blob store as `Potatopedia-<Country>-Potato-Report-<edition>.pdf`. Countries without a PDF (not in `lib/reports-manifest.json`, or the blob read fails) fall back to `/country/<slug>?print=1`, which opens the print dialog. Details JSON: `{report, role, company, consent_partners, email_type}` (`email_type` = free | work).

Limit: since pages are free, Ctrl+P still works for anyone who knows it. The gate captures leads from people who use the button.

## Designed PDF reports (country market report, free sample)
10-page A4 reports (cover, contents + summary, key figures, production/area/yield, trade, regions & varieties, industry, outlook, sources, back cover). Brand system: `scripts/reports/brand.css` (one token file, every report identical). Editorial text and national figures: `scripts/reports/content.mjs` (copied from the country pages with their named sources; `unsourced: true` prints a † note). FAOSTAT series, ranks and trade are read live from `lib/faostat-timeseries.js`; the India headline from `lib/facts.js`; directory listings from Neon `pp_companies` (published only).

Built so far: china, india, united-states, netherlands (edition 2026-11). To add a country, add its block to `content.mjs` first.

**PDFs are never committed** (the repo is public). They are written to `reports-out/` (gitignored) and stored in the PRIVATE Vercel Blob store `potatopedia-reports` (store_oJV1HBKQosxkrt2v, iad1), connected to potatopedia-next, so `BLOB_READ_WRITE_TOKEN` is set in Production, Preview and Development. Blob pathnames: `reports/<slug>-<edition>.pdf`. Anonymous URL fetches return 403; only the route reads them with the token.

(Re)generate and upload:
1. `vercel env pull` (puts `BLOB_READ_WRITE_TOKEN` and `DATABASE_URL` in `.env.local`).
2. `node scripts/reports/build-country-report.mjs india china united-states netherlands` (needs Google Chrome; uses `~/.claude/scripts/pdf.sh`; prints `LAYOUT ...` if a page overflows; updates `lib/reports-manifest.json` with page counts). `--html-only` skips the PDF; `--no-db` skips the directory query.
3. Check pages: `pdftoppm -r 70 -png reports-out/india-2026-11.pdf reports-out/png/india`.
4. `node scripts/reports/upload.mjs` (all in the manifest) or `node scripts/reports/upload.mjs india`.
5. Commit `lib/reports-manifest.json` (and any content changes) and deploy: the manifest drives the button text ("Download the India report (PDF, 10 pages)") and which countries stream a PDF.
New edition: change `EDITION` in `content.mjs`, rebuild, upload, commit the manifest.

## Switch on (after SES production access is approved)
1. DB: `ALTER TABLE leads DROP CONSTRAINT leads_type_check; ALTER TABLE leads ADD CONSTRAINT leads_type_check CHECK (type IN (<existing types>,'report_download'));` (check the live constraint first; see db/schema.sql).
2. Vercel env (Production): `REPORT_LINK_SECRET` = long random string (`openssl rand -hex 32`), `REPORT_GATE_LIVE=true`.
3. Check `BLOB_READ_WRITE_TOKEN` is set in Production (done 7 Nov 2026 when the store was connected) and the PDFs are uploaded (`node scripts/reports/upload.mjs`).
4. Redeploy (country pages are static, the flag is read at build).
Off (default): behaviour is exactly as before; `/api/lead` rejects `report_download` with 503.
