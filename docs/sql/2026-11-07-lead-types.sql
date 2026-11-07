-- Adds 'data_correction' and 'datasheet_submission' to the LIVE leads.type check (Neon potatopedia-db).
-- NOT yet run. Constraint name is the Postgres default for the inline CHECK in db/schema.sql: leads_type_check.
-- Verify first:  select conname from pg_constraint where conrelid = 'leads'::regclass and contype = 'c';
-- Run with psql "$DATABASE_URL_UNPOOLED" -f docs/sql/2026-11-07-lead-types.sql
BEGIN;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_type_check;
ALTER TABLE leads ADD CONSTRAINT leads_type_check CHECK (type IN (
  'sponsor','machine_quote','trade','report','listing','publish','ai_visibility',
  'advertise_call','newsletter','company_claim','report_download',
  'data_correction','datasheet_submission'
));
COMMIT;
