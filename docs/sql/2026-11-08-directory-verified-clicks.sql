-- Company directory: verified tier + outbound click log (8 Nov 2026). Additive only.
ALTER TABLE pp_companies ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false;
ALTER TABLE pp_companies ADD COLUMN IF NOT EXISTS verified_until date;
CREATE TABLE IF NOT EXISTS pp_company_clicks (
  id bigserial PRIMARY KEY,
  slug text NOT NULL,
  ts timestamptz NOT NULL DEFAULT now(),
  referrer text,
  country text
);
CREATE INDEX IF NOT EXISTS pp_company_clicks_slug_ts ON pp_company_clicks (slug, ts);
