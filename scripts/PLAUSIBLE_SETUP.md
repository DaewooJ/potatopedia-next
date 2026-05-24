---
title: Plausible.io API integration setup runbook
date: 2026-05-09
status: AWAITING DEVENDRA — generate API key + add env vars before Claude Code can build the fetcher
why: Plausible provides AI engine *referral click* data that bridges Bing citation events → downstream traffic — the data Otterly $29/mo would otherwise provide
expected outcome: Plausible API integrated; weekly + on-demand analytics fetching automated
---

# Plausible.io API integration runbook

## Why we're building this

Plausible.io was activated on Potatopedia 2 days ago (per Devendra). It is the only data source we have for **AI engine referral clicks** — meaning when someone reads a ChatGPT / Perplexity / Claude / Copilot answer and then clicks through to potatopedia.com, the source URL hits our Plausible analytics with that engine as the referrer.

This is the **downstream** signal that complements Bing Webmaster Tools' **upstream** citation event data:

```
Bing Copilot citation event (upstream)  →  user clicks through  →  Plausible referrer click (downstream)
                ↑                                                            ↑
       Bing Webmaster Tools                                              Plausible.io
       (citation count: 558/wk)                                          (click count: ?/wk)
```

The ratio of Plausible AI clicks to Bing citations gives us the citation-to-click conversion rate per engine, which is a key business metric.

## Prerequisites — what you (Devendra) need to do first

### Step 1: Verify Plausible plan tier

Plausible has three plans that affect API rate limits:

- **Growth ($9/mo or $90/yr)**: 10,000 monthly pageviews, **API access included**
- **Business ($19/mo or $190/yr)**: 10,000 pageviews, API access, advanced features
- **Enterprise**: custom

API access is **free** on all paid plans. Confirm which tier you signed up for at https://plausible.io/sites/settings/general (after login).

If you're on the **free trial** (30 days from signup), you have full API access during the trial. After trial expiry you'll need to be on Growth or Business — confirm before generating the key so we don't waste effort on a key that becomes invalid in 28 days.

### Step 2: Generate the API key

1. Log in to https://plausible.io
2. Navigate to **Settings → Account → API Keys** (top-right user menu → Account Settings → API tab)
3. Click **"+ New API Key"**
4. Name it: `potatopedia-claude-code-readonly`
5. Permissions: select **Read-only** (we never need to write data; read is sufficient for the fetcher)
6. Click **Create**
7. **Copy the key immediately** — Plausible only shows it once. If you lose it, generate a new one.

The key format looks like: `pl-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (~40 character alphanumeric).

### Step 3: Save the key in 1Password / your password manager

**Do not commit this key to git, ever.** If accidentally committed, rotate immediately.

### Step 4: Add to local development env

Create or edit `/Users/daewoo/potatopedia-next/.env.local` (this file should already be in `.gitignore`):

```bash
# Plausible Analytics API
PLAUSIBLE_API_KEY=pl-your-actual-key-here
PLAUSIBLE_SITE_ID=potatopedia.com
```

Verify `.env.local` is in `.gitignore`:
```bash
cd /Users/daewoo/potatopedia-next
grep -E "^\.env|^\.env\.local" .gitignore
```

Should output `.env.local` (or `.env*`). If not, add it.

### Step 5: Add to Vercel production env (only if we add server-side analytics use)

Currently the fetcher runs locally (Devendra's machine). If we later wire the fetcher to a Vercel cron / serverless function, we'll need the env vars in Vercel as well:

1. Go to https://vercel.com/djkha/potatopedia-next/settings/environment-variables
2. Add `PLAUSIBLE_API_KEY` (Production + Preview + Development checkboxes; Sensitive: yes)
3. Add `PLAUSIBLE_SITE_ID` (same checkboxes; Sensitive: no)

**For Week 1, skip Vercel env setup.** The fetcher will run locally only. We'll add Vercel env vars in Phase 4 if we automate the weekly report via Vercel cron.

### Step 6: Verify Plausible script is correctly installed on the live site

This is a Claude Code task — but you can spot-check by viewing the page source on https://www.potatopedia.com/ and grepping for `plausible.io/js/script.js`. If found, with `data-domain="potatopedia.com"`, the install is correct.

## Step 7: Confirm the API key works (Devendra one-time test)

Once you've added the key to `.env.local`, run this from terminal to confirm:

```bash
cd /Users/daewoo/potatopedia-next
source .env.local 2>/dev/null || export $(grep -v '^#' .env.local | xargs)
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" \
  "https://plausible.io/api/v2/query" \
  -H "Content-Type: application/json" \
  -d '{"site_id":"potatopedia.com","metrics":["visitors","pageviews"],"date_range":"7d"}' \
  | python3 -m json.tool
```

Expected output (with 2 days of real data):
```json
{
  "results": [...],
  "query": {...}
}
```

If you get `{"error": "..."}` — the API key is wrong or insufficient permissions.

## What Claude Code will build (after API key is ready)

### `scripts/fetch_plausible_analytics.py`

Python script that:
1. Reads `PLAUSIBLE_API_KEY` and `PLAUSIBLE_SITE_ID` from environment
2. Fetches:
   - Daily aggregate stats (visitors, pageviews, bounce rate, visit duration)
   - Top 25 pages by pageviews
   - Top 25 referrer sources by visitors
   - Top 20 countries
   - Device type breakdown
   - Custom event data (if any configured)
3. Filters referrer data for known AI engine domains:
   - `chatgpt.com`, `chat.openai.com`, `openai.com`
   - `claude.ai`, `anthropic.com`
   - `perplexity.ai`
   - `copilot.microsoft.com`, `bing.com` (with copilot in path)
   - `gemini.google.com`, `bard.google.com`
   - `meta.ai`
   - `you.com`, `phind.com`
4. Outputs:
   - JSON dump to `scripts/data/plausible_YYYY_MM_DD.json` (timestamped, gitignored)
   - Markdown summary to `scripts/plausible_report_YYYY_MM_DD.md`
5. Computes week-over-week deltas per metric
6. Handles errors gracefully (rate limit, missing key, empty data)

### `scripts/unified_analytics_report.py`

Combines:
1. Plausible data (real-time, all traffic, AI engine referrals)
2. Bing Webmaster Tools data (manually exported CSVs in `scripts/data/bing/`)
3. GSC data (manually exported CSVs in `scripts/data/gsc/`)
4. Existing SEO tracker data (from `scripts/seo_report.json` if available)

Output: `scripts/unified_analytics_YYYY_MM_DD.md` with executive summary, AI citation funnel (citations → clicks → engaged sessions), Google Search funnel, per-page performance cross-reference, conversion rates, anomalies (high-citation-low-traffic and vice versa), 30-day trend trajectory.

### `scripts/data/` directory structure

```
scripts/data/
├── plausible/           # gitignored — daily/weekly Plausible JSON dumps
│   └── plausible_YYYY_MM_DD.json
├── bing/                # gitignored — Devendra drops Bing Webmaster Tools CSVs here
│   └── ai_citations_YYYY_MM_DD.csv
├── gsc/                 # gitignored — Devendra drops GSC CSVs here
│   └── search_console_YYYY_MM_DD.csv
└── README.md            # tracked — explains directory purpose + what to drop where
```

### `scripts/reports/weekly/`

Auto-generated weekly reports (gitignored — will be regenerated each week, no point versioning).

## Privacy + cost considerations

- **Plausible is GDPR-compliant by design** (no cookies, no PII). Safe to use without user consent banners.
- **API rate limits**: Growth tier is 600 requests/hour per API key. Our weekly fetcher uses ~10–20 requests, well within limits.
- **Cost**: $9–19/mo Plausible plan (already paid). $0 incremental for the integration.
- **Data retention**: Plausible retains data indefinitely for paid plans. Our local dumps + git-ignored cache provide an additional historical record.

## Anti-patterns to avoid

- **Do not store the API key in `lib/`, `app/`, `components/`, or any git-tracked file.** Always env vars.
- **Do not include the API key in any user-facing or client-side code.** This is a server-only / scripts-only key.
- **Do not log the API key in console output or commit messages.** If accidentally logged, rotate the key.
- **Do not query Plausible at high frequency for trivial reasons.** Even within rate limits, polite usage = weekly aggregate fetch + on-demand single queries.

## What I (Claude Code) will need from you to proceed

1. ✅ API key generated and added to `.env.local`
2. ✅ Confirmation that the curl test in Step 7 returns valid JSON
3. ✅ Plan tier confirmed (Growth or Business)

Once these three are done, signal me and I'll build:
- `scripts/fetch_plausible_analytics.py`
- `scripts/unified_analytics_report.py`
- `scripts/data/README.md`
- First run of unified analytics with current data

## Status tracker (update as you progress)

- [ ] Plausible plan tier confirmed: ___ (Growth / Business / Trial)
- [ ] API key generated, name `potatopedia-claude-code-readonly`, permissions Read-only
- [ ] Key saved in 1Password
- [ ] `.env.local` updated with `PLAUSIBLE_API_KEY` and `PLAUSIBLE_SITE_ID`
- [ ] `.env.local` confirmed in `.gitignore`
- [ ] Step 7 curl test returns valid JSON
- [ ] Vercel env vars added (defer to Phase 4 — skip for Week 1)
- [ ] Plausible tracking script verified live on potatopedia.com (Claude Code will check)
