-- Newsletters + news desk (13 Nov 2026). Apply: node --env-file=.env.local scripts/db-apply.mjs db/newsletters.sql
-- Titles are fixed in code (lib/newsletters.js): potato-processing-weekly | seed-potato-field | potato-prices-trade.

-- 1. Collector output (backend newsdesk/collect.py, every 6 h). summary_raw is for the drafter only, never published.
CREATE TABLE IF NOT EXISTS news_candidates (
  id           BIGSERIAL PRIMARY KEY,
  fetched_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  source       TEXT NOT NULL,                        -- name from config/news_sources.yaml
  source_type  TEXT NOT NULL CHECK (source_type IN ('primary','trade_press','company')),
  url          TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  title_norm   TEXT NOT NULL,                        -- lower, no punctuation; near-duplicate check
  published_at TIMESTAMPTZ,
  region       TEXT,                                 -- europe | north-america | latin-america | africa | asia | oceania | middle-east | global
  title_guess  TEXT[] NOT NULL DEFAULT '{}',         -- newsletter slugs the source feeds
  summary_raw  TEXT,
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','scored','drafted','dropped','used')),
  score        NUMERIC,
  drop_reason  TEXT                                  -- e.g. 'no primary source', 'banned source', 'duplicate'
);
CREATE INDEX IF NOT EXISTS news_candidates_status ON news_candidates (status, fetched_at DESC);
CREATE INDEX IF NOT EXISTS news_candidates_title_norm ON news_candidates (title_norm);

-- 2. Drafted items (backend drafter). Each published item = one page /news/<pub_year>/<mm>/<slug>.
CREATE TABLE IF NOT EXISTS news_items (
  id             BIGSERIAL PRIMARY KEY,
  candidate_id   BIGINT REFERENCES news_candidates(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  newsletter     TEXT NOT NULL CHECK (newsletter IN ('potato-processing-weekly','seed-potato-field','potato-prices-trade')),
  slug           TEXT NOT NULL,
  pub_year       INT,                                -- set on publish
  pub_month      INT,
  headline       TEXT NOT NULL,
  summary        TEXT NOT NULL,                      -- 40-60 words, our own words
  why_it_matters TEXT NOT NULL,                      -- 2-3 lines, our analysis
  body_md        TEXT NOT NULL,                      -- the facts with numbers and dates (markdown, ## question-style H2s)
  key_numbers    JSONB NOT NULL DEFAULT '[]',        -- [{label, value, unit, date, source_url}]
  sources        JSONB NOT NULL DEFAULT '[]',        -- [{publisher, title, url, type: primary|company}] — never banned/aggregator
  quote          JSONB,                              -- {text (<=30 words), who, role, source_url} or null
  tags           TEXT[] NOT NULL DEFAULT '{}',
  region         TEXT,
  countries      TEXT[] NOT NULL DEFAULT '{}',       -- country slugs as on /country/<slug>
  varieties      TEXT[] NOT NULL DEFAULT '{}',       -- variety slugs as on /varieties/<slug>
  hub            TEXT CHECK (hub IN ('processing','seed-field','prices')),
  related        JSONB NOT NULL DEFAULT '[]',        -- [{href, label}] internal Potatopedia links only
  author_slug    TEXT NOT NULL DEFAULT 'potatopedia-editorial',
  image          JSONB,                              -- {src, alt, credit, licence} real photos only, or null
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','published','held','dropped')),
  hold_reason    TEXT,
  published_at   TIMESTAMPTZ,
  corrections    JSONB NOT NULL DEFAULT '[]',        -- [{date, text}] shown at the foot of the page
  UNIQUE (pub_year, pub_month, slug)
);
CREATE INDEX IF NOT EXISTS news_items_pub ON news_items (status, published_at DESC);
CREATE INDEX IF NOT EXISTS news_items_hub ON news_items (hub, published_at DESC);

-- 3. Issues (backend issue builder; approved by WhatsApp YES NL; published + sent by netweb).
CREATE TABLE IF NOT EXISTS issues (
  id             BIGSERIAL PRIMARY KEY,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  newsletter     TEXT NOT NULL CHECK (newsletter IN ('potato-processing-weekly','seed-potato-field','potato-prices-trade')),
  issue_no       INT NOT NULL,                       -- shown as "Issue 01"
  issue_date     DATE NOT NULL,                      -- send date; web URL /issues/<newsletter>/<issue_date>
  dry_run        BOOLEAN NOT NULL DEFAULT false,     -- dry runs are never published or sent
  subject        TEXT NOT NULL,
  preheader      TEXT,
  intro          TEXT,                               -- 2-3 line editor's note
  lead_item_id   BIGINT REFERENCES news_items(id),
  item_ids       BIGINT[] NOT NULL DEFAULT '{}',     -- 6-10 items, in order, lead excluded
  number_of_week JSONB,                              -- {value, unit, label, date, source_url, chart: {type:'bar', labels:[], values:[]}}
  data_box       JSONB,                              -- {title, rows:[{label, value}], source_url, date}
  spotlight      JSONB,                              -- {kind:'expert'|'company', name, role, org, text, href} (never paid)
  sponsor_slots  JSONB NOT NULL DEFAULT '[]',        -- [{slot:'presenting'|'classified', label:'Sponsored'|'Launch partner', sponsor, text, url, logo}]
  events         JSONB NOT NULL DEFAULT '[]',        -- [{name, dates, city, country, url}]
  journal        JSONB,                              -- {title, href} same-day pp-daily blog post, if any
  cover          JSONB,                              -- {og:'/covers/..-og.jpg', sq:'..-sq.jpg', credit}
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','preview','approved','sending','sent','held','dropped')),
  preview_token  TEXT,
  approved_at    TIMESTAMPTZ,
  published_at   TIMESTAMPTZ,
  sent_at        TIMESTAMPTZ,
  send_stats     JSONB NOT NULL DEFAULT '{}',        -- {recipients, sent, failed}
  linkedin       JSONB NOT NULL DEFAULT '{}',        -- {page_post_urn, edition:'handed'|'published', edition_url}
  UNIQUE (newsletter, issue_date)
);
CREATE UNIQUE INDEX IF NOT EXISTS issues_no ON issues (newsletter, issue_no) WHERE NOT dry_run;

-- 4. Subscriptions: one row per email per title. Profile (name, company, role, country) lives on the leads row.
CREATE TABLE IF NOT EXISTS subscriptions (
  id              BIGSERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  email           TEXT NOT NULL,
  newsletter      TEXT NOT NULL CHECK (newsletter IN ('potato-processing-weekly','seed-potato-field','potato-prices-trade','magazine')),
  lead_id         BIGINT REFERENCES leads(id),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','unsubscribed','bounced','complained')),
  confirm_token   TEXT,
  unsub_token     TEXT NOT NULL UNIQUE,
  confirmed_at    TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  source_page     TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_email_title ON subscriptions (lower(email), newsletter);
CREATE INDEX IF NOT EXISTS subscriptions_title_status ON subscriptions (newsletter, status);

-- 5. Sends + SES events (opens, clicks, bounces, complaints) via configuration set potatopedia-newsletters → SNS → /api/newsletters/ses-events.
CREATE TABLE IF NOT EXISTS email_sends (
  id              BIGSERIAL PRIMARY KEY,
  issue_id        BIGINT NOT NULL REFERENCES issues(id),
  subscription_id BIGINT NOT NULL REFERENCES subscriptions(id),
  message_id      TEXT UNIQUE,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  status          TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','failed')),
  error           TEXT,
  UNIQUE (issue_id, subscription_id)
);
CREATE TABLE IF NOT EXISTS email_events (
  id          BIGSERIAL PRIMARY KEY,
  at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  message_id  TEXT NOT NULL,
  issue_id    BIGINT,
  event       TEXT NOT NULL,                          -- delivery | open | click | bounce | complaint | unsubscribe
  url         TEXT,
  raw         JSONB
);
CREATE INDEX IF NOT EXISTS email_events_issue ON email_events (issue_id, event);

-- 6. New lead types.
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_type_check;
ALTER TABLE leads ADD CONSTRAINT leads_type_check CHECK (type IN ('sponsor','machine_quote','trade','report','listing','publish','ai_visibility','advertise_call','newsletter','company_claim','report_download','data_correction','datasheet_submission','contribute','seed','advertise_newsletter'));
