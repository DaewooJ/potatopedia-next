# scripts/data — analytics data dumps + manual exports

This directory holds analytics data feeds. The `bing/`, `gsc/`, and `reports/` sub-trees are gitignored — only this README is tracked.

## Sub-directories

### `bing/` (gitignored)
Devendra drops manually-exported Bing Webmaster Tools CSVs here. Naming convention:
- `ai_citations_YYYY_MM_DD.csv` — last-N-days AI citation data (use Devendra's natural export filename if convenient; the unified report fetches the most-recent file by mtime)
- `search_performance_YYYY_MM_DD.csv` — Bing search clicks/impressions if separately exported
- `crawled_urls_YYYY_MM_DD.csv` — crawl health / indexed URL data

### `gsc/` (gitignored)
Devendra drops manually-exported Google Search Console CSVs here:
- `search_console_YYYY_MM_DD.csv` — Performance report (queries, pages, clicks, impressions, CTR, position)
- `top_pages_YYYY_MM_DD.csv` — Pages tab export
- `top_queries_YYYY_MM_DD.csv` — Queries tab export

### `reports/weekly/` (gitignored)
Auto-generated weekly unified analytics reports from `scripts/unified_analytics_report.py`. Files named `YYYY_MM_DD_weekly_analytics.md` (timestamped). Regenerated each week; no point versioning.

## Why this directory is gitignored

- Bing/GSC exports are subject to per-platform terms of service that restrict redistribution
- Weekly reports rebuild from primary data; no need for git history
- Keeps repo lean

## How to use

Traffic and referral data (incl. AI-engine referrers and UTM campaigns) come from GA4 (G-0CXVFJDBF7).

1. Drop new Bing / GSC CSVs into `bing/` and `gsc/` as exported
2. Run `python3 scripts/unified_analytics_report.py` — generates the weekly unified report combining all sources
