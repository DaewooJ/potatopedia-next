-- Potatopedia Neon schema (potatopedia-db). Apply: psql "$DATABASE_URL_UNPOOLED" -f db/schema.sql
CREATE TABLE IF NOT EXISTS leads (
  id           BIGSERIAL PRIMARY KEY,
  ref          TEXT UNIQUE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  type         TEXT NOT NULL CHECK (type IN ('sponsor','machine_quote','trade','report','listing','publish','ai_visibility','advertise_call','newsletter','company_claim','report_download','data_correction','datasheet_submission')),
  page_url     TEXT,
  name         TEXT,
  company      TEXT,
  email        TEXT NOT NULL,
  country      TEXT,
  message      TEXT,
  details      JSONB NOT NULL DEFAULT '{}'::jsonb,   -- product, capacity_tph, volume, destination, timeline, problem…
  utm_source   TEXT, utm_medium TEXT, utm_campaign TEXT, utm_term TEXT, utm_content TEXT,
  ip_hash      TEXT,
  status       TEXT NOT NULL DEFAULT 'new',          -- new | contacted | won | lost | spam
  confirmed_at TIMESTAMPTZ,                          -- newsletter double opt-in
  confirm_token TEXT,
  mail_message_id TEXT,                              -- SES message id of the notification
  sent_to_makers TEXT[] NOT NULL DEFAULT '{}'        -- machine_quote routing log
);
CREATE INDEX IF NOT EXISTS leads_type_created ON leads (type, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email ON leads (lower(email));

-- Source scout queue (Netcup server finds; Devendra approves; ingest job consumes).
CREATE TABLE IF NOT EXISTS source_candidates (
  id           BIGSERIAL PRIMARY KEY,
  batch        TEXT NOT NULL,                        -- e.g. 2026-11-09
  n            INT NOT NULL,                         -- number in that batch's WhatsApp list
  found_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  url          TEXT NOT NULL,
  title        TEXT NOT NULL,
  publisher    TEXT NOT NULL,
  published    TEXT,
  approved_source TEXT NOT NULL,                     -- FAOSTAT | USDA | CIP | UN Comtrade | CPRI | Europatat | journal
  whats_new    TEXT NOT NULL,
  fills_gap    TEXT NOT NULL,                        -- corpus file or query-log gap it fills
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','ingested','failed')),
  decided_at   TIMESTAMPTZ,
  decided_via  TEXT,                                 -- whatsapp | page
  ingest_file  TEXT,
  ingest_log   TEXT,
  UNIQUE (url),
  UNIQUE (batch, n)
);
CREATE INDEX IF NOT EXISTS source_candidates_status ON source_candidates (status, batch);
