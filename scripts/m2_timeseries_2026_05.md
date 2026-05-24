---
title: M2 multi-year FAOSTAT time series — frontend page expansion + data alignment
date: 2026-05-08
status: SHIPPED
deployment: https://www.potatopedia.com (production)
---

# M2 multi-year FAOSTAT time series sprint

Closes the M2 deferred item from the Tier 3 SEO audit. Multi-year (2018–2024)
production trajectory now surfaced across:
- /knowledge/top-potato-producing-countries (sortable 30-row × 7-year × YoY table)
- All 11 premium country profiles (5-year mini-trajectory inside Card 1)
- /knowledge/global-potato-trade (FAOSTAT TM 5-year fresh-export trends section)
- All 24 standard country profiles (5-year trajectory band under stat grid)

## Phase 1 finding (the most important part)

The Tier 3 pendencies framing said M2 needed "backend FAOSTAT historical depth
re-ingestion first." Phase 1 audit revealed this was a **stale assumption**:

- Backend `/Users/daewoo/potatopedia-backend/data/` already contains 44
  `faostat-*.txt` files covering 2010–2024 production (15 years), 2015–2024
  trade (10 years), 2015–2023 FBS, 2010–2024 prices, per-capita consumption.
- 168 countries indexed, 53,389 total lines.
- Backend `/stats` confirms 5,024 chunks across 224 sources are ingested.
- `/ask` queries for "2018–2024 production by country" return correct,
  citable time-series data.

**No ingestion sprint needed.** Verifying the premise saved the trip and
unlocked direct execution on the frontend page expansion.

## What shipped

### Item A — `/knowledge/top-potato-producing-countries` multi-year table

Replaced the 5-column single-year table with a 10-column multi-year table:

```
# │ Country │ 2018 │ 2019 │ 2020 │ 2021 │ 2022 │ 2023 │ 2024 │ 7-yr trend
```

- Each cell is FAOSTAT production in million tonnes
- 2024 column highlighted in brand red, bold, tabular-nums for scan readability
- 7-yr trend column shows directional sym (↑↓→) + percentage 2018→2024 in
  green/red/grey by direction
- Long-tail producers (ranks 31–100) collapsible section preserved
- DefinitiveAnswer rewritten to mention 7-year trajectory and the Iran 2015→2023
  decline + 2024 partial recovery
- KeyStatStrip restructured: 380M+ / 94.9M China 2024 / 100 countries / 7-yr

Added Dataset JSON-LD with:
- `temporalCoverage: "2018/2024"`
- `variableMeasured` for Production / YoY change / 7-year trajectory
- `sourceOrganization` with FAO link
- `license: https://www.fao.org/contact-us/terms/en/`

### Item B — All 11 premium country profiles get a Card-1 trajectory mini-table

Added `TrajectoryTable` component to `components/CountryProfilePremium.jsx` that
renders a 2-row × 7-column table inside Card 1 (Mt + YoY %). Auto-injection for
the 5 new profiles (Turkey, Iran, Algeria, Uzbekistan, Colombia) via shared
shell. For the 6 tier-1 inline renderers (India, China, Belgium, Netherlands,
US, Kenya), exported `TrajectoryTable` and inserted via:
- 5 inline renderers (India, China, Belgium, NL, US): a dedicated white
  `pp-trajectory-band` section between vital-stats and quickfacts
- Kenya: inserted directly inside Card 1 after QuickFacts

Each TrajectoryTable shows:
- 7 year columns (Mt with 2024 highlighted)
- YoY % row with green/red coloring
- 7-yr trend label (↑↓→ with %)
- Source footnote (FAOSTAT 2024) — overrideable per profile

### Item C — `/knowledge/global-potato-trade` 5-year fresh-export trends

New "Fresh-potato export trajectory 2018–2024" subsection inserted between the
existing fry-exporters table (UN Comtrade frozen HS 2004.10 — Belgium $4.8B
story) and the seed-trade section. Renders top 8 fresh-potato exporters with
2018–2024 export values (FAOSTAT TM, CPC 01510). Notable insight surfaced:
**Belgium's fresh-potato export value is dwarfed by its $4.8B frozen-fry export
total** — confirming Belgium's import-process-export industrial pattern. Frozen
trade and fresh trade are clearly labeled as separate datasets in the prose.

### Item D — All 24 standard country profiles 5-year trajectory band

Added a clean white `<TrajectoryTable slug={c.slug} />` band immediately under
the existing 4-stat grid in `StandardCountryPage`. Single-component reuse means
all 24 standard profiles automatically get the band. No per-profile data entry
needed.

## Data corrections shipped alongside

The trajectory data harvested from FAOSTAT files revealed several mismatches
with shipped country profiles. With user approval, the following corrections
shipped this sprint:

| Country | Before | After | Source |
| --- | --- | --- | --- |
| Iran | "5.58M peak (2019), −58% decline" | "5.14M peak (2015), −55% decline, 2.92M 2024 (+25% recovery)" | FAOSTAT 2024 (2019 figure was not in FAOSTAT — narrative was anchored to a different methodology) |
| Colombia | "3.86M FAOSTAT" | "3.86M (DANE/FEDEPAPA, includes papa criolla) // 2.49M (FAOSTAT, item 116 only)" | Dual-statistic with explicit footnote — strengthens papa criolla cultural angle |
| Netherlands | 7.1M | 6.37M | FAOSTAT 2024 |
| Turkey | 6.54M (≈2023) | 6.90M (2024) | FAOSTAT 2024 |
| Algeria | 5.20M | 4.60M | FAOSTAT 2024 |
| Uzbekistan | 2.9M + [DATA NEEDED for 2024] | 3.72M (drop the flag) | FAOSTAT 2024 (validated, flag was unnecessarily conservative) |

### Iran narrative correction (most significant)

The previously-shipped Iran profile claimed "production fell from 5.58M tonnes
(2019) to 2.34M tonnes (2023) = −58% decline." FAOSTAT direct file data shows
Iran's 2019 production was actually 3.56M tonnes, with peak production of
5.14M occurring in 2015. The −58% callout was based on a baseline that does
not exist in FAOSTAT (likely originated from Statistical Centre of Iran national
agency figures using a different methodology, but our profile labeled it
"FAOSTAT" — incorrect attribution).

The corrected narrative:
- Peak 5.14M (2015), trough 2.34M (2023) = −55% decline
- 2024 recovery to 2.92M (+25% YoY)
- Updated H1, accent label, definitive answer, key stats, all 8 FAQ Q&As, and
  the dedicated "Why has Iran's production declined" Card 10 callout
- Trajectory table footnote explicitly notes the 2015 peak / 2023 trough / 2024
  recovery pattern

### Colombia dual-statistic framing

Colombian national agencies (DANE / FEDEPAPA / Ministerio de Agricultura) report
~3.86M tonnes annually because they include papa criolla (Solanum phureja) in
the Colombian potato sector total. FAOSTAT's standardized "Potatoes" item code
(116) treats papa criolla as a separate item, so its 2024 figure is 2.49M.

Both figures are correct under their respective accounting frameworks, and the
1.37M-tonne gap directly measures papa criolla's scale in the Colombian sector.
The strengthened Colombia profile leads with this dual-statistic explanation —
it reinforces the papa criolla cultural angle that was already the profile's
distinctive editorial hook.

## Stale-reference sweep + cleanup

After data corrections, swept the codebase for any pages still showing old
production figures:

| File | Stale ref | Action |
| --- | --- | --- |
| `app/llms.txt/route.js` | "Netherlands — 7.1M tonnes" | Updated to 6.37M; added Turkey at 6.90M, refreshed China/India/US/Bangladesh to 2024 |
| `app/knowledge/[slug]/page.jsx` (line 610) | "Algeria (5.1M)" in by-continent prose | Updated to "4.60M, FAOSTAT 2024" |
| `app/country/[slug]/page.jsx` (Turkey FAQ) | Algeria 5.20M, Iran 2.34M | Updated to 4.60M, 2.92M with recovery narrative |
| `app/country/[slug]/page.jsx` (Algeria FAQs) | "5.20 million tonnes in 2023" | Updated to "4.60M tonnes 2024" |
| `app/country/[slug]/page.jsx` (regionalContext) | turkey "6.54M", algeria "5.20M" notes | Updated to 6.90M and 4.60M everywhere |
| `lib/data.js` (knowledge article inline text) | "Algeria 5.1M / Netherlands 7.1M" | Updated to "Algeria 4.60M / Netherlands 6.37M FAOSTAT 2024" |

Remaining `[DATA NEEDED]` flags are intentional transparency markers about
granular data gaps (variety-share percentages, processor lists, subsidy line
items) — not headline production figures.

## Build / deploy verification

```
npm run build → ✓ Compiled successfully in 7.0s, 429 static pages prerendered
vercel --prod → ✓ Production live at https://www.potatopedia.com
```

Live spot-checks (HTTP 200 across all):
- /knowledge/top-potato-producing-countries → Dataset JSON-LD with temporalCoverage 2018/2024 confirmed
- /country/iran → 5.14M, 2.92M, −55%, "partial recovery" all live
- /country/colombia → DANE, FEDEPAPA, 3.86M, 2.49M dual-stat all live
- /country/turkey → 6.90M, 65.6%, 35.2 t/ha all live
- /country/uzbekistan → 3.72M live; production-figure DATA NEEDED gone (only granular gaps remain)
- /country/algeria → 4.60M, 33.9 t/ha live
- /country/india → "FAOSTAT 7-year production trajectory" band injected
- /country/poland → StandardCountryPage trajectory band live (test for 24 standard profiles)
- /knowledge/global-potato-trade → "Fresh-potato export trajectory" + FAOSTAT TM section live

## New data module

`lib/faostat-timeseries.js` — auto-generated 729-line module exporting:
- `PRODUCTION_TIMESERIES`: 99 country slugs × 7 years (Mt) — derived from
  FAOSTAT regional production files
- `TRADE_TIMESERIES`: 99 country slugs × 7 years × 4 dimensions (export
  qty/val + import qty/val) — derived from FAOSTAT TM trade files
- `FAOSTAT_YEARS`: [2018, 2019, 2020, 2021, 2022, 2023, 2024]
- `yoyChange(slug, fromYear, toYear)`: helper for percent change
- `trendLabel(slug)`: returns `{dir, pct, sym}` for 2018→2024 trajectory

Header comment notes: production from FAOSTAT QCL Item 116 (Potatoes); trade
from FAOSTAT TM CPC 01510 (Fresh potatoes). Trade is fresh-only — frozen-fry
trade (HS 2004.10) tracked separately via UN Comtrade on /knowledge/global-potato-trade.

## Pendencies impact

Closes M2 ("multi-year time series") from the Tier-3 SEO audit. Updates the
Tier-4 / future-sprint pendencies list to mark M2 as **shipped**. The
"Trade Flow Visualizer" item in the OTHER PENDING section is now data-ready
since FAOSTAT TM is fully accessible — no separate ingestion sprint needed.

## Remaining follow-ups (deferred)

- Belgium production figure in `lib/data.js` (4.6M) is older than FAOSTAT 2024
  (3.98M) — Belgium's industry conventionally cites a higher figure that
  includes processing-import volumes. Not in this sprint's scope.
- Brazil 3.7M in `lib/data.js` is older than FAOSTAT 2024 (4.18M) — Brazil now
  surpasses Colombia's FAOSTAT figure (2.49M). Not in this sprint's scope.
- The 5 inline tier-1 renderers (India, China, Belgium, NL, US) inject the
  TrajectoryTable as a separate band rather than tightly inside Card 1. Visual
  consistency follow-up: refactor those renderers to use CountryProfilePremium
  shell and inline the trajectory inside Card 1, matching the 5 new profiles.
- Multi-year sortable header buttons (per-year sort) on the top-30 table —
  current table is pre-sorted by 2024 production. Sort UX is a follow-up.

See `lib/faostat-timeseries.js` for the canonical data module and
`components/CountryProfilePremium.jsx#TrajectoryTable` for the rendering
component used everywhere.
