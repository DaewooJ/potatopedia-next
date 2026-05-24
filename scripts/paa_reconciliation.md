# PAA Reconciliation Report
Date: 2026-04-24

## Summary

- **Total PAA questions in plan:** **38** (the plan header at `scripts/content_plan.md` line 4 claims "42 People Also Ask questions" but the bulleted enumeration across its 8 thematic groups totals only 38 — flagged as a plan self-inconsistency; working from the enumerated list since it's the authoritative source of actual questions).
- **Shipped:** **36 of 38** (94.7%)
  - via dedicated answer pages: 29 (confirmed in `POPULAR_ANSWERS`, lib/data.js:55–125)
  - via blog posts: 2 (`us-potato-production-by-state`, `potatoes-and-diabetes`)
  - via knowledge articles: 2 (`potato-consumption-per-capita`, `complete-potato-growing-guide`)
  - via pre-existing pages that already covered the intent: ~10 of the 29 answer-page matches (e.g. `which-country-produces-most-potatoes` absorbs four paraphrase variants in Group 1)
- **Remaining:** **2 clearly unshipped + 2 ambiguous** (see "Ambiguous" section)
- **By priority:**
  - **HIGH remaining:** 0 clearly unshipped. The 2 ambiguous "Where does the US get most of its potatoes?" variants plausibly count here if you treat them as needing a dedicated page.
  - **MEDIUM remaining:** 0
  - **LOW remaining:** 2 (price-trend and cold-garage storage)
- **Plan vs. reality — wave counts:** Waves 1–3 (18 named items, plan lines 209–234) all confirmed shipped. Wave 4 (6 items, shipped 2026-04-17 per user's notes) cannot be perfectly identified from `lib/data.js` alone since the file doesn't track ship dates, but `POPULAR_ANSWERS` items at lines 92–124 correspond to the remaining PAA-closers (`us-no-1-potato-grade`, `how-to-identify-potato-type`, `potatoes-and-serotonin`, `seed-potatoes-per-grow-bag`, `how-to-build-potato-cold-storage`, `planting-potatoes-in-october` — 6 items) that exactly match the remaining originally-listed PAAs not addressed in Waves 1–3. That matches the 6-item Wave 4 claim.

### Net finding

**The April 7 PAA roadmap is essentially complete.** There is no meaningful unshipped backlog from the original plan — just 2 genuinely low-priority long-tail queries and 2 paraphrase-duplicates of one ambiguous US-sourcing question. Going forward, the content gap worth filling is not leftover PAAs but the **Related Searches cluster** (plan lines 237–247) which was never broken into slugs and remains uncovered.

---

## Shipped (verified live in `lib/data.js`)

Grouped by PAA theme (plan sections 1–8). "Wave" column uses plan's wave labels (1–3 = lines 209–234) and user's stated Wave 4 on 2026-04-17 for items that match remaining PAAs.

### Group 1 — Production & Rankings

| PAA Question | Slug | Type | Wave |
|---|---|---|---|
| Which country has the largest production of potatoes? | `which-country-produces-most-potatoes` | answer | pre-existing |
| Which country is no. 1 in potato production? | `which-country-produces-most-potatoes` (paraphrase) | answer | pre-existing |
| Which country is the biggest producer of potatoes? | `which-country-produces-most-potatoes` (paraphrase) | answer | pre-existing |
| Which country is the largest producer of potatoes in the world? | `which-country-produces-most-potatoes` (paraphrase) | answer | pre-existing |
| Who is the largest producer of potatoes in India? | `largest-potato-producer-india` | answer | Wave 3 |
| Which state is no. 1 in potato production? | `us-potato-production-by-state` | answer + blog | Wave 1 + Wave 2 |
| Why does China produce so many potatoes? | `why-china-produces-most-potatoes` | answer | Wave 2 |

### Group 2 — Consumption & Market

| PAA Question | Slug | Type | Wave |
|---|---|---|---|
| What country consumes the most amount of potatoes? | `which-country-eats-most-potatoes` | answer | Wave 1 |
| Which country consumes a lot of potatoes? | `which-country-eats-most-potatoes` (paraphrase) | answer | Wave 1 |
| What country eats the most chips? | `which-country-eats-most-potato-chips` | answer | Wave 3 |
| Who is the largest consumer of potatoes in the world? | `which-country-eats-most-potatoes` (semantic) | answer | Wave 1 |
| Who is the largest buyer of potatoes? | `largest-potato-importers` | answer | Wave 2 |
| How big is the potato market in the world? | `global-potato-market-size` | answer | Wave 2 |
| — cluster-level | `potato-consumption-per-capita` | knowledge | Wave 1 |

### Group 3 — Trade & Exports

| PAA Question | Slug | Type | Wave |
|---|---|---|---|
| Does the U.S. import or export potatoes? | `does-us-import-export-potatoes` | answer | Wave 3 |
| Who is the largest importer of potatoes? | `largest-potato-importers` | answer | Wave 2 |
| Which country is the biggest exporter of potatoes? | `largest-potato-exporters` (+ pre-existing `top-potato-exporting-countries`) | answer | post-Wave-3 / pre-existing |
| Where can I find import data? | `potato-trade-data-by-country` | answer | post-Wave-3 |

### Group 4 — Nutrition & Health

| PAA Question | Slug | Type | Wave |
|---|---|---|---|
| Are potatoes good for a cardiac diet? | `are-potatoes-good-for-heart` | answer | post-Wave-3 |
| Can diabetics eat potatoes? | `can-diabetics-eat-potatoes` | answer | Wave 1 |
| What potato is best for diabetics? | `potatoes-and-diabetes` | blog + knowledge-FAQ coverage | Wave 2 |
| Do potatoes help with serotonin? | `potatoes-and-serotonin` | answer | Wave 4 |

### Group 5 — Varieties & Identification

| PAA Question | Slug | Type | Wave |
|---|---|---|---|
| What are the 7 types of potatoes in order? | `types-of-potatoes` | answer | Wave 1 |
| What are US No. 1 potatoes? | `us-no-1-potato-grade` | answer | Wave 4 |
| How do I tell what type of potato I have? | `how-to-identify-potato-type` | answer | Wave 4 |
| What country has the best quality potatoes? | `best-potatoes-in-the-world` + `best-quality-potatoes-by-country` | answer (2 variants) | post-Wave-3 |

### Group 6 — Farming & Cultivation

| PAA Question | Slug | Type | Wave |
|---|---|---|---|
| What fertilizer increases potato size? | `fertilizer-for-potato-size` + `best-fertilizer-for-potatoes` | answer (2 variants) | Wave 2 / post-Wave-3 |
| How many potatoes will 5 pounds of seed potatoes produce? | `seed-potato-yield-calculator` | answer | Wave 3 |
| Can I plant potatoes in October? | `planting-potatoes-in-october` | answer | Wave 4 |
| How many seed potatoes per 25 gallon grow bag? | `seed-potatoes-per-grow-bag` | answer | Wave 4 |
| What month is too late to plant potatoes? | `when-to-plant-potatoes` | answer | Wave 3 |
| — cluster-level | `complete-potato-growing-guide` | knowledge | Wave 1 |

### Group 7 — Storage & Cold Chain

| PAA Question | Slug | Type | Wave |
|---|---|---|---|
| Can potatoes be stored in cold storage? | `potato-cold-storage-temperature` (pre-existing) + `/knowledge/potato-storage-cold-chain` | answer + knowledge | pre-existing |
| How to make a cold storage for potatoes? | `how-to-build-potato-cold-storage` + `/blog/potato-cold-storage-guide` | answer + blog | Wave 4 / post-Wave-3 |
| How long can potatoes stay in cold storage? | `how-long-potatoes-cold-storage` | answer | Wave 3 |

### Group 8 — Processing & Industry

| PAA Question | Slug | Type | Wave |
|---|---|---|---|
| How big is the potato processing market? | `potato-processing-market-size` (+ pre-existing `/knowledge/potato-processing-industry`) | answer + knowledge | post-Wave-3 / pre-existing |

---

## Remaining (not yet shipped)

| PAA Question | Recommended Type | Priority | Notes |
|---|---|---|---|
| Are potato prices dropping? | answer page | **LOW** | Group 2. Volatile / transient content — the answer is different every quarter. `potato-market-price-today` exists in `POPULAR_ANSWERS` (line 116) but targets "current price" intent, not "are prices falling as a trend." Shipping this as a static page creates a maintenance liability (rot within 6 months). Recommend **defer or reframe as a blog post tied to a specific year** rather than a standing answer page. |
| Can potatoes be stored in a cold garage? | answer page | **LOW** | Group 7. Very narrow home-gardener long-tail. No `store-at-home` / `cold-garage` slug in `POPULAR_ANSWERS`. Existing pages cover industrial cold storage and design (`how-to-build-potato-cold-storage`, `potato-cold-storage-temperature`) but none is pitched at the consumer "is my unheated garage OK?" angle. Easy to ship (~300 words, pairs with existing data) but low traffic ceiling. |

---

## Ambiguous / uncertain matches

| PAA Question | Ambiguity | Verdict |
|---|---|---|
| **Where does the US get most of its potatoes?** (Group 1) | Intent is ambiguous between (a) *which US states supply most domestic production* — already answered by `us-potato-production-by-state` + state-by-state blog; and (b) *does the US import potatoes from other countries* — already answered by `does-us-import-export-potatoes`. The plan (content_plan.md line 32) proposed a dedicated `where-us-gets-potatoes` slug, implying the authors felt it deserved its own page. That slug does **not** exist in `POPULAR_ANSWERS`. | **Functionally covered** by two existing pages, but no single page is optimized for this exact query. Flag for human review: ship a thin dedicated page, or add anchor/FAQ entries cross-linking to the two existing pages. |
| **Where does America get most of its potatoes from?** (Group 1) | Paraphrase of above. | Same — ship one page that closes both variants, or leave covered-by-proxy. |
| **Which country is the biggest exporter of potatoes?** (Group 3) | Has two shipped matches: pre-existing `top-potato-exporting-countries` and newer `largest-potato-exporters`. Both target the same intent. | **Shipped**, but note a minor duplication worth consolidating at some later refactor pass. |
| **What fertilizer increases potato size?** (Group 6) | Two shipped matches: `fertilizer-for-potato-size` (line 122) and `best-fertilizer-for-potatoes` (line 82, Wave 2). Near-identical intent. | **Shipped**, same duplication flag. |
| **What country has the best quality potatoes?** (Group 5) | Two shipped matches: `best-potatoes-in-the-world` (line 92) and `best-quality-potatoes-by-country` (line 120). | **Shipped**, duplication flag. |

**Side finding — internal duplication:** Groups 3, 5, and 6 each ship two answer-page slugs targeting the same PAA. Not a quality issue per se (Google may serve either), but dilutes link equity and creates inconsistent canonical signals. Candidate for a consolidation pass later; out of scope for this reconciliation.

---

## Recommendation — best 5 to ship next

Given the original 38-question roadmap is effectively complete, the highest-value new content is **not** from the PAA backlog but from the `content_plan.md` "Related Searches" section (lines 237–247), which was never slugged. I'm therefore blending (a) the 2 uncovered PAAs worth a quick win, with (b) 3 Related-Searches items with stronger strategic upside.

### 1. `where-us-gets-potatoes` (answer page) — **HIGH strategic, LOW effort**

Closes 2 paraphrased PAAs in Group 1 at once. Leverages existing US state-level and import/export data already on `/country/united-states`, `/answers/us-potato-production-by-state`, and `/answers/does-us-import-export-potatoes`. A short consolidated answer (≈250 words) that answers both the state-supply and import-origin angles, with anchor links back to the two existing pages. Zero new research needed.

### 2. `largest-potato-companies` (answer page) — **HIGH strategic, MEDIUM effort**

From Related Searches (plan line 246): *"largest potato producer company — new answer page opportunity about McCain, Lamb Weston, etc."* High commercial intent. We already have McCain (~CAD 12B revenue), Lamb Weston, Simplot, Agristo data in the processing knowledge article (`/knowledge/potato-processing-industry`) and several blog posts. Answer page would condense that into an investor/trade-reader-friendly ranking. Pairs well with the existing processing-market-size answer.

### 3. `how-to-store-potatoes-at-home` (answer page) — **MEDIUM strategic, LOW effort**

Absorbs the "Can potatoes be stored in a cold garage?" PAA plus the broader consumer home-storage audience (currently served only by industrial storage pages). Easy ~300-word answer. Moves Potatopedia from "B2B/agronomist" to "also consumer" in at least one surface — incremental reach for almost no work.

### 4. Historical production trends — expansion of `/knowledge/top-potato-producing-countries` or new `world-potato-production-by-year` answer — **MEDIUM strategic, MEDIUM effort**

From Related Searches (line 242): *"world potato production statistics [by year/2022/2020] — add historical trend data."* Current page is snapshot-only (2023). A multi-year table (2019–2024) would support citations and rank for many `"[year] potato production"` long-tail queries. An alternative: ship as a focused answer page, `world-potato-production-statistics` slug exists in `POPULAR_ANSWERS` (line 101) — expand that page's answer with 5-year data rather than create a new slug.

### 5. Per-country export data in country profiles — **HIGH strategic, HIGH effort**

From Related Searches (line 245): *"potato export data [country name] — add per-country export data to country profiles."* Not a single new page — a structural enhancement to all 30 `/country/[slug]` pages. Highest LLM-citation payoff of anything on this list (country-specific trade data is exactly what agent systems query for). Biggest effort: needs UN Comtrade pulls for 30 countries. Possibly a standalone project rather than squeezing into a content-plan follow-up.

### Honorable mentions / deferred

- `potato-price-trends` (PAA Group 2) — reframe as a year-tagged blog post if done at all. Not recommended as a standing answer page.
- Consolidate the duplicate slug pairs noted in the "Side finding" above (exporters, fertilizer, quality) — technical-debt cleanup, not new content.

---

## Shipped inventory — raw counts (for reference)

- `POPULAR_ANSWERS`: **69 slugs** (lib/data.js:55–125). First-pass seed content had 20 entries pre-Wave-1.
- `BLOG_POSTS`: **15 slugs** (lib/data.js:199–654). Wave 2 added `us-potato-production-by-state` (line 299) and `potatoes-and-diabetes` (line 337). Other blog posts predate the PAA plan or post-date Wave 3.
- Knowledge articles: **12 slugs** in `KNOWLEDGE_TITLES` (lib/data.js:656–669). Wave 1 added `potato-consumption-per-capita` (line 667) and `complete-potato-growing-guide` (line 668). The other 10 predate the PAA plan.
