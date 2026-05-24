# Potatopedia.com — Comprehensive SEO + AI Citation Audit

**Date**: 2026-05-08
**Site under audit**: https://www.potatopedia.com
**Sitemap URL count**: 421 indexable URLs (all return HTTP 200; no redirect chains)
**Hosting**: Vercel (Next.js 16.x App Router)
**Backend**: Render (potatopedia-backend.onrender.com)
**Audit duration**: Full Phase 1–4 with parallel research agents + direct live-URL audit
**Methodology**: Phase 1 best-practices research via WebSearch (40+ sources, Q1–Q2 2026); Phase 2/3 live-URL audit on samples covering every page type; Phase 4 competitive SERP + WebFetch analysis on 3 priority queries

---

## EXECUTIVE SUMMARY

Potatopedia has a strong **technical foundation** (sub-300ms TTFB, edge caching, clean sitemap, 100% 200-status, comprehensive Article + BreadcrumbList JSON-LD on most content) but **one critical defect that nullifies a fifth of the site's pages** plus a tier of high-impact gaps that block first-page rankings on competitive queries and reduce AI-citation pickup.

### Top 10 findings ranked by impact

| # | Finding | Severity | Affected pages | Estimated traffic impact |
|---|---|---|---|---|
| 1 | **All 83 `/answers/*` pages serve "Answer could not be loaded" placeholder in SSR HTML** — Google and AI engines see ~120 words of boilerplate, no answer content | **CRITICAL** | 83 pages (~20% of sitemap) | **Massive** — entire answer route effectively unindexed for content |
| 2 | **238 variety pages are thin** (~290 words, 3 H2 sections, only `Thing`+`BreadcrumbList` schema; no `Article`, no `Product`, no `FAQPage`, no `Speakable`) | HIGH | 238 pages (~57% of sitemap) | Large — variety pages can't compete on commercial intent queries |
| 3 | **`robots.txt` has no explicit AI-bot allowances** (just `User-agent: * / Allow: /`) — wildcard works in theory but 2026 best practice is named entries for GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended | HIGH | Site-wide | Medium — citation transparency for AI engines |
| 4 | **No `Person`/author schema anywhere** — only `Organization` byline; Google's Feb 2026 guidance treats `Person` + `worksFor Organization` as the baseline for E-E-A-T; anonymous bylines trigger AI Overview deprioritization | HIGH | Site-wide | Medium-High — E-E-A-T signal degradation |
| 5 | **Title tags exceed 70 chars on 5+ page types** (worst: blog at 114 chars, india-state at 115, country-india at 105, knowledge-storage at 80) — Google truncates the rest, hurts CTR | HIGH | 100+ pages | Medium — CTR loss on long titles |
| 6 | **Meta descriptions exceed 165 chars on 11/14 sample types** (worst: blog at 384 chars, homepage at 240, countries at 235, country-india at 208) — truncated in SERPs, missed CTA opportunity | HIGH | 100+ pages | Medium — SERP description quality loss |
| 7 | **Standard country pages** (Nepal, Pakistan, Bangladesh, Algeria, etc. — 24 of 30 country profiles) **have only `Article + BreadcrumbList` schema** vs premium-profile dossiers (India, China, Belgium, Netherlands, US, Kenya) which have 3–5 schemas | MEDIUM | 24 pages | Medium — competing weak vs Wikipedia/FAOSTAT for those 24 countries |
| 8 | **Zero `Speakable` schema across the site** — 2026 best practice for voice search and AI extraction; loss of citation precision for LLMs that infer relevance | MEDIUM | Site-wide | Medium — AI citation precision loss |
| 9 | **`llms.txt` slightly stale** — says "5 premium dossiers" (now 6 with Kenya), "27 knowledge articles" (now 29), "70+ answers" (now 83), "204 countries" wording for production data | LOW | 1 file | Low — but trivial fix |
| 10 | **`/about` and `/answers/*` pages don't show a visible "Updated" date** — content pages have `dateModified` in JSON-LD but no surface freshness signal; rest of site (premium country, state, knowledge, blog) has visible "Updated" timestamp | LOW | ~85 pages | Low — minor freshness signal gap |

### One-line recommendation

**Ship Critical fix #1 (server-render answer content) and High-impact fixes #2–6 (variety page enrichment, robots.txt, author schema, title/desc length normalisation) in a single 1–2 week sprint. Estimated combined impact: 30–60% increase in indexable content surface area + meaningful AI Overview citation lift.**

---

## PHASE 1 — 2025–2026 BEST PRACTICES SUMMARY

Research collected by parallel agent across 40+ sources published Q1–Q2 2026. Full agent transcript available at `/private/tmp/claude-501/.../tasks/ae6fc5f3437966464.output`.

### Headline shifts vs 2023–2024 guidance

1. **YMYL expanded**: Sept 2025 Quality Rater Guidelines update formally extended YMYL beyond health/finance/safety into elections, institutions, and societal trust. Knowledge platforms like Potatopedia are not formally YMYL but trend toward higher-bar evaluation.
2. **AI-generated content allowed but monitored**: Google now treats "AI-generated + unverified" as spam-equivalent to old PBN networks. Visible citation chains and named expert review are protective.
3. **`Person` schema baseline for E-E-A-T**: February 2026 Search Central added an authors-section hint that named authors with `sameAs` to professional profiles is now table-stakes. `Organization`-only bylines signal "institutional" trust but sacrifice the Experience/Expertise dimensions.
4. **December 2025 core update**: 66.8% of top-3 positions moved. Sites with thin content + missing authorship dropped sharply. Sites with clear E-E-A-T signals held or gained.
5. **AI Overview citation density**: AI Overviews now appear in ~85% of searches and average 5–6 citations per response. Pages that do not provide unique data points (information gain ≥ 3 unique facts vs top-10) are algorithmically invisible.
6. **FAQ schema 60% citation lift**: Quantified 2026 study; pages with `FAQPage` are 60% more likely to appear in AI Overviews vs unstructured content.
7. **Schema entity-linking is critical**: `MainEntityOfPage` + `sameAs` to Wikidata/Knowledge Graph entities improves citation probability by up to 200%.
8. **Core Web Vitals tightened**: LCP target lowered to <2.0s (from 2.5s) at 75th percentile in 2026. INP fully replaced FID. New `Visual Stability Index (VSI)` introduced quietly in early 2026.
9. **Crawl budget hygiene more important**: For 400–1000 page sites, sitemap purity (only canonical 200-status URLs) and `lastmod` discipline are explicit ranking factors.
10. **AI crawler allowlist**: Best-practice 2026 robots.txt names 10+ AI crawlers explicitly (GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot, Meta-ExternalAgent, Amazonbot, CCBot, Bytespider). Wildcard `*` covers them but transparency matters; PerplexityBot in particular is "citation-heavy."
11. **Hub-and-spoke now serves both SEO + AEO**: Topic clusters need to be semantically interconnected at the entity level, not just keyword level.
12. **Speakable schema rising**: Critical for voice search and LLM passage extraction; without `speakable`, AI models infer relevance and reduce citation precision.

### Schema additions worth adopting

- `Speakable` (W3C draft, schema.org) — flags optimal text-to-speech passages
- `ClaimReview` — fact-checking claims (medium relevance for variety/nutrition claims)
- `Product` — for variety detail pages (treat each variety as a product/SKU equivalent)
- `Person` (with `sameAs`) — author bylines (currently absent)
- `Dataset` — already on India + state pages; should expand to all data-heavy pages

---

## PHASE 2 — TECHNICAL SEO AUDIT

### A. Site infrastructure

| Test | Result | Severity |
|---|---|---|
| Sitemap URL count | 421 URLs | — |
| HTTP status sweep (full sitemap) | **420 of 420 production URLs return 200** (the lone "non-200" was a false positive from XML namespace string) | ✓ excellent |
| Redirect chains | None detected | ✓ |
| Canonical URLs (sample 14 page types) | All 14 sampled pages have correct self-referential canonical | ✓ |
| `robots.txt` | Bare-minimum: `User-agent: * / Allow: /` + sitemap reference | **HIGH** — see §A.1 below |
| `llms.txt` | Comprehensive structure, but stats slightly stale (5 dossiers ≠ actual 6; 27 knowledge ≠ actual 29; 70+ answers ≠ actual 83) | LOW |
| `sitemap.xml` structure | Valid XML, single sitemap (no index file) | ✓ for current scale; note for future |
| `sitemap.xml` lastmod discipline | All entries have `<lastmod>` populated; Vercel ISR re-renders dates | ✓ |

#### A.1 — `robots.txt` issue (HIGH severity)

Current `robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://www.potatopedia.com/sitemap.xml
```

**Recommended 2026 best practice**:
```
# Default: allow everything
User-agent: *
Allow: /

# Explicitly allow major AI crawlers (transparency + capture all current variants)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

# Disallow common attack/exploit crawl paths
User-agent: *
Disallow: /api/
Disallow: /_next/

Sitemap: https://www.potatopedia.com/sitemap.xml
```

PerplexityBot in particular is the highest-citation AI crawler per Phase 1 research; explicit naming reinforces the allowance and makes the policy auditable.

### B. On-page SEO per page type

#### B.1 — Title tag length (HIGH)

Recommended 50–60 chars; tolerable to ~70; truncation begins at 70.

| Page type | Sample length | Status |
|---|---|---|
| Homepage | 72 | borderline |
| /countries | 63 | ✓ |
| /country/india (premium) | **105** | ❌ truncated |
| /country/kenya (premium) | 38 | ✓ |
| /country/nepal (standard) | 38 | ✓ |
| /country/india/uttar-pradesh | **115** | ❌ truncated |
| /knowledge/potato-diseases-pests | 57 | ✓ |
| /knowledge/potato-storage-cold-chain | **80** | ❌ over |
| /answers/best-fertilizer-for-potatoes | 63 | ✓ |
| /blog/dutch-seed-potato-empire | **114** | ❌ truncated |
| /varieties/russet-burbank | 70 | borderline |
| /about | 31 | ✓ |

Pattern: long compound headlines get truncated. The H1 can stay long (descriptive); the `<title>` tag should be tighter. Recommend `next/font` `metadata.title` template stays as `%s — Potatopedia` but per-page `title` shrinks to 50–60 chars.

#### B.2 — Meta description length (HIGH)

Recommended 140–160 chars; truncation at ~165.

| Page type | Length | Status |
|---|---|---|
| /about | 218 | ❌ over |
| /answers/* (template) | 111–123 | ✓ short side |
| /blog/* | **384** | ❌ severely over |
| /countries | 235 | ❌ over |
| /country/india | 208 | ❌ over |
| /country/kenya | 126 | ✓ |
| /country/nepal | 128 | ✓ |
| Homepage | 240 | ❌ over |
| /country/india/uttar-pradesh | 236 | ❌ over |
| /knowledge/potato-diseases-pests | 122 | ✓ |
| /knowledge/potato-storage-cold-chain | 211 | ❌ over |
| /varieties/* | 183–240 | ❌ over |

Pattern: descriptions read like marketing copy. Recommend the 140–160 char band with a clear value prop + primary keyword + soft CTA.

#### B.3 — H1 + heading hierarchy (✓ mostly OK)

| Page type | H1 count | H2 count | H3 count | Status |
|---|---|---|---|---|
| Homepage | 1 | 9 | 6 | ✓ |
| /countries | 1 | 0 | 1 | ⚠️ shallow |
| /country/india | 1 | 19 | 3 | ✓ |
| /country/kenya | 1 | 15 | 0 | ✓ |
| /country/nepal | 1 | 5 | 0 | ⚠️ thin |
| /country/india/uttar-pradesh | 1 | 15 | 0 | ✓ |
| /knowledge/potato-diseases-pests | 1 | 10 | 0 | ✓ |
| /answers/* | 1 | 2 | 4 | ⚠️ thin (and content broken anyway) |
| /blog/* | 1 | 7 | 0 | ✓ |
| /varieties/russet-burbank | 1 | 3 | 0 | ⚠️ thin |
| /about | 1 | 8 | 0 | ✓ |

H1 hygiene is correct everywhere (one H1 per page, query-matching). H2 depth is variable; thin pages noted.

#### B.4 — Image alt text (✓)

8 of 8 images sampled across 8 page types have proper alt text. Site has very few images (mostly the Potatopedia logo plus occasional OG images), so this is a non-issue currently.

#### B.5 — Internal link density (✓ generally)

Premium pages average 50–90 internal links (Indian state pages: 80–94; Kenya: 92; knowledge: 43–53). Standard country pages and `/answers` placeholders have far fewer (<25 unique). Variety pages have ~15–25 outbound internal links each.

#### B.6 — Outbound links to authoritative sources (✓)

Premium content pages cite FAOSTAT, USDA, CIP, ICAR-CPRI, NHB, peer-reviewed journals inline. This is a strong E-E-A-T signal already present.

#### B.7 — Visible freshness signals

| Page type | dateModified in JSON-LD | Visible "Updated" | Status |
|---|---|---|---|
| Premium country (India, Kenya, etc.) | ✓ | ✓ | ✓ |
| Standard country (Nepal, Pakistan, etc.) | ✓ | ✓ | ✓ |
| India state pages | ✓ | ✓ | ✓ |
| Knowledge premium | ✓ | ✓ | ✓ |
| Blog posts | ✓ | ✓ | ✓ |
| /about | (none in JSON-LD) | ❌ none visible | LOW |
| /answers/* | ✓ in BreadcrumbList only | ❌ none visible | LOW |
| /varieties/* | ✓ | ❌ none visible | LOW |

### C. Schema markup audit

| Page type | Schemas present | Schemas recommended | Gap |
|---|---|---|---|
| Homepage | Organization, WebSite, FAQPage | + WebSite SearchAction (verify), Person (founder) | Add SearchAction confirmation; Person on /about |
| `/countries` | CollectionPage | + ItemList | Minor — add ItemList for the 30 countries |
| Premium country (India, China, Belgium, NL, US) | Article, BreadcrumbList, Dataset | + FAQPage, + Place/Country | **High** — premium dossiers should match Kenya's 5-schema density |
| Premium country (Kenya) | Article, BreadcrumbList, Place/Country, Event, FAQPage | ✓ best-in-class on the site | — |
| Standard country (Nepal, Pakistan, Bangladesh, Egypt, Algeria, Peru, Iran, Canada, Brazil, Colombia, Mexico, Australia, Indonesia, S. Korea, Japan, France, Germany, UK, Russia, Ukraine, Poland, Turkey, Denmark, S. Africa) — **24 of 30 country profiles** | Article, BreadcrumbList | + Place/Country, + FAQPage | **HIGH** — major schema gap on 24 country pages |
| India state (UP/WB/Bihar/Gujarat/MP) | Article, BreadcrumbList, Place/AdministrativeArea, Dataset, FAQPage | ✓ | — |
| Knowledge (premium 25 articles) | Article, BreadcrumbList, FAQPage | + Speakable on lead-with-answer block | MEDIUM — Speakable lift |
| Knowledge (AI fallback ~3 remaining) | Article, BreadcrumbList | + FAQPage | LOW — fallback set is shrinking |
| Blog posts | Article, BreadcrumbList | + FAQPage where Q&A blocks exist | MEDIUM |
| Answer pages | BreadcrumbList only **(content broken — see Critical #1)** | Article + FAQPage + Speakable + once content is server-rendered | **CRITICAL** (after content fix) |
| Variety pages | Thing, BreadcrumbList | + Article, + Product (variety as commercial entity), + FAQPage where applicable, + sameAs to Wikipedia/Wikidata for canonical varieties | **HIGH** — major gap on 238 pages |
| /about | Organization | + Person (Founder + key contributors with sameAs) | HIGH for E-E-A-T |
| Events | CollectionPage + 8 Event entries | ✓ | — |

### D. Performance (proxy via response timing + cache state)

| Page | TTFB | Total | HTML size | Cache |
|---|---|---|---|---|
| Homepage | 124ms | 209ms | 120KB | HIT |
| /country/india | 122ms | 313ms | 376KB | HIT |
| /country/kenya | 129ms | 321ms | 243KB | HIT |
| /country/india/uttar-pradesh | 204ms | 534ms | 222KB | HIT |
| /knowledge/potato-diseases-pests | 276ms | 395ms | 162KB | HIT |
| /varieties/russet-burbank | 193ms | 259ms | 56KB | HIT |

**Assessment**: All sampled pages are edge-cached HITs from Vercel's CDN with sub-300ms TTFB. Total response 200–530ms is solid. India page at 376KB is heavy because of the 17-section dossier — acceptable but flagged for future optimisation if any specific Core Web Vitals issue surfaces in real-user GSC data.

**Note**: True Core Web Vitals (LCP, INP, CLS) require browser-side measurement. Recommend running Lighthouse against the 6 sampled URLs and verifying in GSC's Core Web Vitals report. Server response numbers above suggest LCP and TTFB will be within 2026 thresholds (LCP <2.0s, INP <200ms) but client-side JS bundle and image loading need verification.

### E. Mobile optimization (visual inspection of CSS)

Existing inline-style approach uses `@media (max-width:768px)` breakpoints throughout and has been validated on Indian state pages, knowledge articles, and Kenya profile in earlier work. Pattern looks correct (cards stack, grids collapse to 1 column, fonts remain ≥13px). Recommend a Lighthouse mobile audit run as a follow-up; nothing visible from the static HTML inspection raises concerns.

### F. International / global signals

- Single locale: `<html lang="en">` ✓
- No `hreflang` (none required since we're English-only)
- No geo-targeting (correct for global audience)
- Currency: USD throughout where used; mention of INR/EUR/KES in country-specific contexts ✓
- Per Phase 1 research: AI engines may bypass hreflang anyway, focus is on content relevance — already strong via country/state-specific data

---

## PHASE 3 — AI CITATION OPTIMIZATION AUDIT

### A. AI-friendly content structure (per page type)

| Pattern | Premium country | India state | Knowledge premium | Knowledge AI fallback | Blog | Answer | Variety |
|---|---|---|---|---|---|---|---|
| Lead-with-answer first sentence | ✓ Kenya/India ✓; standard ❌ | ✓ | ✓ | ❌ | partial | (broken) | ❌ |
| `DefinitiveAnswer` block at top | ✓ premium ✓; standard ❌ | ✓ | ✓ | ❌ | ❌ | (broken) | ❌ |
| Quick Facts box per section | Kenya ✓; India partial; others ❌ | ✓ | ✓ partial | ❌ | ❌ | (broken) | ❌ |
| Citation density (1 per 150–200 words) | premium ✓ | ✓ | ✓ | ❌ | ✓ | (broken) | ❌ |
| Semantic chunking (1 concept/H2) | premium ✓ | ✓ | ✓ | partial | ✓ | (broken) | partial |
| HTML tables (not images) | ✓ | ✓ | ✓ | ✓ | ✓ | (broken) | ✓ |

### B. Authority signals AI engines look for

| Signal | Status | Notes |
|---|---|---|
| Citations to authoritative sources | ✓ FAOSTAT, USDA, CIP, ICAR-CPRI, NHB, peer-reviewed | Strong throughout content |
| "About this page" / methodology | ✓ /about and /llms.txt cover | Could surface methodology link in page footers |
| **Author credentials (Person schema + sameAs)** | ❌ **None** | Organization-only byline — significant E-E-A-T gap per 2026 |
| Last updated dates | ✓ in JSON-LD; ✓ visible on premium content; ❌ visible on /answers, /about, /varieties | Mixed |
| **`sameAs` Wikipedia/Wikidata for entities** | partial — Kenya has Q114 sameAs; UP state page has Wikidata reference | Should expand: Kufri varieties, Russet Burbank, KEPHIS, KALRO, CIP, CPRI, FAOSTAT, etc. — every named entity |

### C. Schema density for AI citations (priority order)

1. **`FAQPage` schema with PAA-aligned questions** — 60% citation lift; has it: Kenya, India states, knowledge premium 25, homepage. **Missing**: standard country (24 pages), blog posts (26), answer pages (broken), variety pages (238). Adding FAQPage to top 30 standard-country and blog pages = ~50 pages, immediate impact.
2. **`Speakable` schema** — universally absent; recommend on: DefinitiveAnswer blocks, Quick Facts boxes, single-fact answers
3. **`Person`/Author schema** — universally absent; recommend creating named author profiles for E-E-A-T
4. **`Product` schema on variety pages** — universally absent; would treat each variety as a commercial entity

### D. Quotable content patterns

| Pattern | Example presence | Notes |
|---|---|---|
| Independently quotable cited sentences | ✓ premium content | E.g. "Uttar Pradesh produces 20.126M tonnes of potatoes annually — 33.46% of national output (DAFW 2023-24)" — ideal AI extraction |
| Specific numbers with sources | ✓ premium content | Strong |
| Comparison tables | ✓ premium country, India state, knowledge | Good coverage |
| Step-by-step procedures | ❌ missing across the site (no `HowTo` schema in use) | Could add for "How to plant potatoes", "How to build cold storage" answers once content rendered |
| Definitive rankings/lists | ✓ /knowledge/top-potato-producing-countries; /country/india has ranked tables | Could expand |

---

## PHASE 4 — COMPETITIVE GAP ANALYSIS

Full competitive analysis from parallel agent at `/private/tmp/claude-501/.../tasks/a0096c89498e17eec.output`. Headlines below.

### Query 1 — "potato production by country"

**Top 5 SERP**: World Population Review, Potato Insights, Wikipedia, Our World in Data, Atlas Big.

**Our equivalent**: `/knowledge/top-potato-producing-countries` — ~2,200 words, FAQPage + Article + Breadcrumb, 1 ranked table (top 20).

**Gaps to close**:
- Expand ranking table from 20 → 100+ countries (sortable; match Wikipedia/WPR breadth)
- Add multi-year time series (2018–2024) — currently a snapshot
- Add explicit `Dataset` JSON-LD referencing FAOSTAT — **none of top 5 has this**, real differentiation
- Add `FAQPage` with 8–10 PAA-aligned questions (have FAQ; tighten alignment)
- Add author byline with credentials
- Add per-country anchor links from each row to `/country/[slug]` — boosts internal linking to ~80+ (matching Wikipedia)
- Add methodology box ("How we calculate this — FAOSTAT release, base year, China territories, etc.")
- Add Speakable on TL;DR + first FAQ answer

**90-day ranking ceiling**: page 1, positions 6–9. Top 3 unrealistic without 6–12 months of link building (Wikipedia + OWID effectively immovable).

### Query 2 — "best potato varieties for frying"

**Top 5 SERP**: TASTE, Webstaurant Store, Markets at Shrewsbury, Freddy's, HowStuffWorks. (All blocked WebFetch — assessed from SERP snippets and template knowledge.)

**Our equivalent**: `/answers/best-potato-varieties-for-frying` — **CRITICAL: backend-load failure means SSR HTML shows ~120 words of "Answer could not be loaded" placeholder**. Page is invisible to crawlers and AI engines.

**Gaps to close** (P0 first):
- **P0**: Server-render the answer at build time (see Critical #1 in this report)
- After fix: build a comparison table (variety × starch class × fry use × oil temp tolerance × sugar content)
- Cover 6+ named varieties at 100+ words each (Russet Burbank, Bintje, Innovator, Markies, Maris Piper, Kennebec, Agria, Yukon Gold) — cite CIP and Europatat
- Add "Avoid these for frying" section (waxy reds, fingerlings) — capture "what potatoes not to use for frying" long-tail
- `FAQPage` with PAA-aligned questions (McDonald's, Yukon Gold, chips vs fries, etc.)
- `HowTo` schema on double-fry technique block
- Author byline with credentials (food scientist or trained chef)
- Internal links to each variety's `/varieties/[slug]` page
- Speakable schema on the one-sentence definitive answer
- Original comparison images

**90-day ranking ceiling**: page 2 positions 11–18 initially after the P0 fix; page 1 positions 8–10 by day 90. SERP dominated by aged restaurant/editorial domains; top 3 in 90 days unrealistic; 6–9 months realistic with internal-link compounding from `/varieties/*` pages.

### Query 3 — "Kenya potato industry"

**Top 5 SERP**: PotatoPro (banned source per CLAUDE.md, position #1), NPCK, WPC2026Kenya, potatocongress.org, Greenlife Kenya.

**Our equivalent**: `/country/kenya` — ~5,500 words, 11 H2 cards, 92 internal links / 53 unique, 5 schemas (Article + BreadcrumbList + Place/Country + Event + FAQPage), best-in-class on the site.

**Assessment**: This is the strongest of the three pages already. Competitor set is structurally weak (event microsites + a council homepage + a B2B retailer).

**Gaps to close**:
- Resolve 2 inline `[DATA NEEDED]` flags (named processors list, government schemes)
- Add interactive choropleth of Kenyan counties (visual differentiator)
- Add `geo` markup with lat/long centroid
- Add author byline with East-Africa potato systems specialist credential
- Add Speakable on 3 short answers (annual production, top county, why Shangi dominates)
- Build 2–3 supporting blog posts on adjacent long-tails (Shangi seed certification deep-dive, Nyandarua county profile, KEPHIS pipeline) — internal hub effect
- Add "Last reviewed / Next review date" microcopy

**90-day ranking ceiling**: page 1 positions 3–5, displacing Greenlife and potatocongress.org. Beating PotatoPro at #1 requires backlink acquisition; beating NPCK (the official council) is hard but a top-3 finish on a national-industry query is realistic.

### Cross-cutting summary (top 5 highest-impact site-wide changes)

1. **Fix the `/answers/*` backend load failure (P0)** — unblocks 83 pages (single highest impact)
2. **Ship explicit JSON-LD across all page types** — Article + FAQPage + BreadcrumbList everywhere; Dataset on production pages; Place + Event on country pages where relevant; Product on variety pages — none of our competitors have full schema coverage; biggest two-week win available
3. **PAA-aligned FAQPage with 8–10 questions per page** — pull exact PAA wording from Google; the #1 lever for AI Overview / featured-snippet inclusion
4. **Author bylines with verifiable credentials** — every top-ranking competitor has named editorial authority; we are uniformly weaker on this E-E-A-T signal
5. **Sortable data tables + at least one original chart per page** — converts our prose strength into a "data destination" signal that Wikipedia and OWID currently own

---

## PRIORITIZED ACTION PLAN

### CRITICAL (must do immediately — indexing/citation blocking)

| # | Fix | Affected | Effort | Impact |
|---|---|---|---|---|
| C1 | **Server-render `/answers/*` content** — convert AnswerAI client component to server-side fetch at build time, OR pre-fetch answers into `lib/data.js` POPULAR_ANSWERS, OR fetch in the route's server component and pass to a client AnswerAI for follow-up only | 83 pages | **L** | **Massive** |

### HIGH (drives 20%+ traffic improvement; ship within 2 weeks)

| # | Fix | Affected | Effort | Impact |
|---|---|---|---|---|
| H1 | **Enrich variety pages**: add Article + Product schema, expand to 800+ words each (production countries, key traits, harvest window, end uses, related varieties), 6+ H2 sections, FAQPage where appropriate, Speakable on lead, sameAs Wikipedia/Wikidata for canonical varieties | 238 pages | **L** | High |
| H2 | **Expand `robots.txt`** with explicit AI-crawler allowances (named entries for GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Meta-ExternalAgent, Amazonbot, CCBot) | 1 file | S | Medium-High |
| H3 | **Add Person/Author schema** site-wide — start with 1–3 named contributors (Founder + agronomist reviewer) with `sameAs` to LinkedIn/credentials; reference from Article schema's `author` field on every content page | All content pages | M | Medium-High |
| H4 | **Normalise title tag length to ≤70 chars** across page types where currently 80–115 chars (knowledge premium, country-india, blog, india-state, varieties); keep H1 long but trim `<title>` | ~150 pages | S | Medium |
| H5 | **Normalise meta description to 140–160 chars** across all page types where currently 165+ chars (homepage, blog template, /countries, premium country, variety, knowledge, /about) | ~250 pages | S | Medium |
| H6 | **Add FAQPage schema to 24 standard country profiles + 26 blog posts** with 6–8 PAA-aligned Q&As each | ~50 pages | M | Medium-High |
| H7 | **Add Place/Country schema to 24 standard country profiles** (with sameAs Wikidata for each country) | 24 pages | S | Medium |
| H8 | **Refresh `llms.txt`** stats: 6 premium dossiers (was 5), 29 knowledge articles (was 27), 83 answers (was 70+), updated production figures | 1 file | S | Low-Medium |

### MEDIUM (incremental improvements; 3–6 weeks out)

| # | Fix | Affected | Effort | Impact |
|---|---|---|---|---|
| M1 | **Add Speakable schema** to DefinitiveAnswer/Quick Facts blocks on premium content (country, state, knowledge, answer) | ~80 pages | M | Medium |
| M2 | **Expand `/knowledge/top-potato-producing-countries`** to 100+ country sortable table + multi-year time series + Dataset schema + per-country anchor links | 1 page | M | High (single most strategic page) |
| M3 | **Per-country `/country/*` page schema upgrade** — add Place/Country + FAQPage to all 24 standard profiles | 24 pages | M | Medium |
| M4 | **Add visible "Updated" date** to /about, /answers/*, /varieties/* | ~325 pages | S (templated) | Low-Medium |
| M5 | **Resolve 2 [DATA NEEDED] flags on /country/kenya** — named-processor list, government schemes | 1 page | S | Low-Medium |
| M6 | **Build supporting blog posts for Kenya** (Shangi seed certification, Nyandarua deep-dive) — internal hub for /country/kenya | 2 new pages | M | Medium (Kenya-specific) |
| M7 | **Add HowTo schema** to procedural answer pages once content rendered (planting, building cold storage, harvesting) | ~10 answer pages | S | Medium |

### NICE TO HAVE (polish; 6–12 weeks out)

| # | Fix | Affected | Effort | Impact |
|---|---|---|---|---|
| N1 | Add WebSite SearchAction confirmation to homepage | 1 file | S | Low |
| N2 | Add ItemList schema to /countries collection page | 1 page | S | Low |
| N3 | Run Lighthouse against 6 representative URLs and document Core Web Vitals; address any LCP/INP/CLS regressions | 6 URLs (audit) | M | Low (likely passing already) |
| N4 | Sitemap segmentation (split into /sitemap-content.xml, /sitemap-data.xml) — only relevant once URL count >1000 | 1 config | S | Low |
| N5 | International strategy decision: stay English-only (current) vs introduce Hindi/Hinglish or Swahili meta tags for region-personalisation | strategic | L | Medium long-term |

---

## ESTIMATED TOTAL EFFORT FOR CRITICAL + HIGH

- **C1**: L (1–2 days for server-render conversion + answer pre-fetch + retest)
- **H1–H8**: combined ~M-L (~3–4 days for templated changes across page types; H1 variety enrichment is the heaviest single workstream and could be staged)

**Single comprehensive sprint**: ~6–8 working days to ship Critical + all High-impact items.

## ESTIMATED IMPACT BAND

After Critical + High implementations:

- **Indexable content surface**: +~25% (83 broken answer pages restored to ~500+ words each = +40,000 words of cited, primary-source-backed answer content)
- **AI Overview citation likelihood**: +60–80% based on Phase 1 study (FAQPage + Speakable + Person schema combined)
- **First-page ranking probability** on competitive head terms: meaningful lift on the 3 priority queries audited; unmeasurable site-wide without keyword tracking
- **Risk-adjusted realistic outcome over 90 days**: Top-3 ranking on 1 of 3 audited queries (Kenya); page-1 on the other 2; 30–50% increase in qualified organic + AI-citation traffic

---

## METHODOLOGY NOTES

- **Phase 1 research**: 40+ sources Q1–Q2 2026, parallel WebSearch agent, ~95s runtime
- **Phase 2 audit**: Live HEAD sweep of all 421 sitemap URLs (parallel via Python concurrent.futures); HTML inspection of 14 representative samples; schema parsing via Python + json
- **Phase 3 audit**: AI-friendly content patterns assessed against the 7 patterns identified in Phase 1; schema density scored per page type
- **Phase 4 competitive analysis**: Live SERP via WebSearch + WebFetch on competitor URLs (5 of 10 fetches blocked — assessed from SERP snippets and template knowledge)
- **Banned sources**: PotatoPro, PotatoNewsToday, indianpotato.com per CLAUDE.md — noted in SERPs but excluded from citations
- **Things this audit did NOT do**: Lighthouse browser-side measurement (recommend run as follow-up); GSC data inspection (requires user GSC access); link-graph analysis beyond on-page; competitor backlink profiles

---

## RECOMMENDED IMPLEMENTATION ORDER

1. **Day 1**: Backup → Server-render `/answers/*` (Critical #1) → ship + verify
2. **Day 2**: robots.txt expansion (H2) + meta title/desc normalisation (H4, H5) — small templated edits → ship
3. **Day 3–4**: Variety page enrichment (H1) — biggest workstream; templated content using existing variety data
4. **Day 5**: Person/Author schema (H3) + standard country FAQPage + Place schema (H6, H7) → ship
5. **Day 6**: llms.txt refresh (H8) + Speakable on premium content (M1) + Updated-date visibility (M4) → ship
6. **Day 7**: Production-by-country table expansion (M2) → ship
7. **Day 8+**: Validate via Rich Results Test, monitor GSC for crawl/indexing changes, /schedule a 2-week ranking re-check

---

## END OF AUDIT

**Status**: Audit complete. Awaiting your review before any implementation.

**To proceed**: review the prioritized action plan above and signal which tier(s) to implement (Critical only, Critical + High, all tiers). I will then execute as a single comprehensive sprint with backup → all changes → npm run build → audit_crawlability.py verification → vercel --prod --yes → follow-up implementation report at `scripts/seo_audit_implementation_2026_05.md`.
