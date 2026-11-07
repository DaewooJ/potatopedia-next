# Gated country report (PDF)

Country pages stay free to read. The "Download PDF Report" button is the gate.

**Before:** the button called `window.print()`; the "PDF" is the browser's save-as-PDF of the page using `lib/printStyles.js`. No PDF file exists.

**Now (when on):** the button opens a form (name, email, company, role, country, optional partner-contact consent, required privacy agreement) -> `POST /api/lead` type `report_download` -> lead stored in Neon, a signed 7-day link is emailed via SES -> `/api/report/<token>` verifies, sets `leads.confirmed_at`, redirects to `/country/<slug>?print=1`, which opens the print dialog. Details JSON: `{report, role, company, consent_partners, email_type}` (`email_type` = free | work).

Limit: since pages are free, Ctrl+P still works for anyone who knows it. The gate captures leads from people who use the button.

## Switch on (after SES production access is approved)
1. DB: `ALTER TABLE leads DROP CONSTRAINT leads_type_check; ALTER TABLE leads ADD CONSTRAINT leads_type_check CHECK (type IN (<existing types>,'report_download'));` (check the live constraint first; see db/schema.sql).
2. Vercel env (Production): `REPORT_LINK_SECRET` = long random string (`openssl rand -hex 32`), `REPORT_GATE_LIVE=true`.
3. Redeploy (country pages are static, the flag is read at build).
Off (default): behaviour is exactly as before; `/api/lead` rejects `report_download` with 503.
