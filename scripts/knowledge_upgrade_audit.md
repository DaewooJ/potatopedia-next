# Knowledge Article Upgrade Audit
Date: 2026-04-24

## Summary

- **Articles audited:** 11 (plus the premium reference `top-potato-producing-countries`)
- **PREMIUM:** 4 — already meet or exceed the reference standard
- **NEAR-PREMIUM:** 2 — authored static pages with minor gaps
- **BASIC (AI-shell, full rebuild needed):** 5 — all 5 render as client-side streaming shells with ~70 visible words at crawl time

### Headline finding

**The 12-article knowledge hub has a binary structure, not a spectrum.** 7 articles (including the reference) are authored server-rendered React with tables, citations, and triple JSON-LD — 6 of these are ≥1,500 words with all template elements. The other 5 are identical `KnowledgeAI`-powered client-side shells that show "Searching knowledge base…" to crawlers and rely on a live backend stream to populate content for human visitors. This isn't a "quality gradient" problem — it's a "half the hub is invisible to Google/Bing/Claude" problem.

### Recommended first upgrade

**`potato-storage-cold-chain`** (full rebuild from AI-shell to authored static). Three PAA questions directly map to this page ("Can potatoes be stored in cold storage?", "How long will potatoes last in a cold garage?", "How to make a cold storage for potatoes?" — from scripts/seo_report.json). Zero existing server-rendered content to compete with it. Highest PAA-coverage payoff per unit of upgrade effort among the 5 AI-shells. See roadmap below.

A secondary quick-win worth pairing: **polishing `potato-nutrition-facts`** — already PREMIUM-tier structure but has only 16 internal links vs the reference's 60, despite being the article that maps to **7 PAA questions** (the highest PAA count of any knowledge article).

---

## Per-Article Scorecard

Reference row included for anchoring. Word counts are *visible body text* (stripped of `<script>`/`<style>`/HTML).

| Slug | Word Count | Internal Links (C/K/B/A) | H2 | Tables | Citations | Template Bucket | Priority Score | Est. Effort |
|------|-----------:|:-------------------------|---:|-------:|----------:|-----------------|---------------:|:------------|
| **top-potato-producing-countries (REF)** | 1932 | 54/5/0/1 = **60** | 10 | 1 | 30 | PREMIUM | — | — |
| potato-consumption-per-capita | 1677 | 63/6/0/1 = **70** | 9 | 1 | 12 | **PREMIUM** | Low (maintenance only) | Low |
| complete-potato-growing-guide | 2053 | 10/7/0/10 = **27** | 12 | 2 | 28 | **PREMIUM** | Low | Low |
| potato-varieties-guide | 1958 | 15/4/0/3 = **22** | 10 | 0 | 10 | **PREMIUM** | Low-Medium (add 1 table) | Low |
| global-potato-trade | 1619 | 36/5/0/2 = **43** | 10 | 2 | 18 | **PREMIUM** | Low | Low |
| potato-nutrition-facts | 1767 | 9/5/0/2 = **16** | 10 | 2 | 12 | **NEAR-PREMIUM** | **HIGH** (7 PAAs, low effort) | Low-Medium |
| how-potatoes-are-processed | 1592 | 17/7/0/0 = **24** | 10 | 1 | 10 | **NEAR-PREMIUM** | Medium | Low-Medium |
| potato-storage-cold-chain | **72** | 0/0/0/0 = **0** | 0 | 0 | 0 | **BASIC (shell)** | **HIGHEST** (3 PAAs) | High |
| potato-diseases-pests | 71 | 0/0/0/0 = **0** | 0 | 0 | 0 | **BASIC (shell)** | Medium | High |
| seed-potato-systems | 72 | 0/0/0/0 = **0** | 0 | 0 | 0 | **BASIC (shell)** | Medium-High (B2B strategic) | High |
| climate-change-potatoes | 72 | 0/0/0/0 = **0** | 0 | 0 | 0 | **BASIC (shell)** | Medium (AI-citation leverage) | High |
| potato-processing-industry | 73 | 0/0/0/0 = **0** | 0 | 0 | 0 | **BASIC (shell)** | **ANTI-REC** (redundant) | — |

**JSON-LD coverage:** All 6 static articles ship the full triple (Article + BreadcrumbList + FAQPage). All 5 AI-shells ship Article + BreadcrumbList only — no FAQPage, because there's no authored FAQ content. (Schema is clean on both halves thanks to earlier today's cleanup; that's not the upgrade bottleneck.)

**Sources section:** No page — including the reference — renders a dedicated "Sources" H2 section. Citations are inline parenthetical markers like `(FAOSTAT 2023)`, `(USDA NASS)`, etc. The premium template spec's "Consolidated Sources section" is **not actually implemented** on the reference page; treat it as aspirational rather than a gap to close.

---

## Detailed Findings (per article)

### 1. potato-consumption-per-capita — **PREMIUM**
**Current state:** 1,677 words, **70 internal links** (highest in the hub, beats reference by 10), 9 H2 sections, 1 data table, 12 citations. Has: Definitive Answer, TOC, FAQ, Related Articles grid, Related Countries strip. Triple JSON-LD present.
**Missing template elements:** None of material consequence. Word count slightly under reference (1677 vs 1932) but this is within normal variance.
**Recommended upgrades:** None urgent. At a later refresh, consider adding a second data table (historical per-capita trend by region) to hit the reference's table count.
**Estimated effort:** Low (cosmetic).

### 2. complete-potato-growing-guide — **PREMIUM**
**Current state:** 2,053 words (longest static article), 27 internal links (10 country / 7 knowledge / 10 answers), 12 H2 sections, 2 tables, **28 inline citations** (most citations of any article including reference). Triple JSON-LD present. Notable: heaviest answer-page linker (10 links to /answers/*, supporting the gardener audience).
**Missing template elements:** Related Countries strip absent (this topic is less country-specific, so arguably OK).
**Recommended upgrades:** None urgent. Could add a "Related Countries" strip featuring top growing-zone countries (Netherlands, Idaho/US, China) but low-yield edit.
**Estimated effort:** Low (cosmetic).

### 3. potato-varieties-guide — **PREMIUM**
**Current state:** 1,958 words, 22 internal links, 10 H2, **0 tables**, 10 citations. Has Definitive Answer, TOC, FAQ, Related Articles, Related Countries. Triple JSON-LD.
**Missing template elements:** No data tables. For a "50+ Types Explained" page, a variety-comparison table is a structural gap compared to what users expect.
**Recommended upgrades:** Add 1–2 tables: varieties-by-use (starchy/waxy/all-purpose) and varieties-by-region. Keeps it a premium page with richer cite-ability for LLMs.
**Estimated effort:** Low (data exists; just format).

### 4. global-potato-trade — **PREMIUM**
**Current state:** 1,619 words, 43 internal links (36 country — second-highest), 10 H2, 2 tables, 18 citations.
**Missing template elements:** No Related Countries strip. Word count is at the low end of premium (1619 vs reference 1932).
**Recommended upgrades:** Add Related Countries strip featuring top traders (Belgium, Netherlands, France, Germany). Lightweight.
**Estimated effort:** Low.

### 5. potato-nutrition-facts — **NEAR-PREMIUM**
**Current state:** 1,767 words, **only 16 internal links** (9 country / 5 knowledge / 2 answers), 10 H2, 2 tables, 12 citations. Has all structural template elements. Triple JSON-LD.
**Missing template elements:** No Related Countries strip; internal link density is about 1/3 of reference. Body reads self-contained rather than hub-connected.
**Recommended upgrades:**
- Add 15–20 internal links to country pages (Belarus, Ukraine, Russia for consumption patterns; US for processed-heavy diet; Netherlands/Germany for European comparison).
- Add 5+ links to relevant answer pages (`/answers/can-diabetics-eat-potatoes`, `/answers/are-potatoes-good-for-heart`, `/answers/potatoes-and-serotonin`, `/answers/potato-vs-rice-nutrition`).
- Add Related Countries strip.
- **Critical:** this page maps to **7 PAA questions** (highest in the hub). A link density polish here converts an already-premium structure into a top AI-citation target for health queries.
**Estimated effort:** Low-Medium (no new writing, just add links + a Related-Countries component).

### 6. how-potatoes-are-processed — **NEAR-PREMIUM**
**Current state:** 1,592 words (lowest of the static 6), 24 internal links, 10 H2, 1 table, 10 citations. 7 knowledge links (second-highest — healthy hub interconnection). Triple JSON-LD. Zero `/answers/*` outbound links.
**Missing template elements:** No Related Countries; zero outbound links to relevant answer pages despite answer-page coverage existing for processing topics (`/answers/how-are-french-fries-made`, `/answers/potato-starch-uses`, `/answers/potato-processing-market-size`, `/answers/potato-processing-companies`, `/answers/potato-processing-plant-cost`).
**Recommended upgrades:** Add 4–6 `/answers/*` links (the processing-specific ones listed above), extend word count to ~1,800 with a section on emerging applications (bioplastics, protein isolate — material already mentioned in the FAQ), and add a Related Countries strip for processing hubs (Belgium, Canada, Netherlands, US).
**Estimated effort:** Low-Medium.

### 7. potato-storage-cold-chain — **BASIC (shell) — HIGHEST PRIORITY REBUILD**
**Current state:** 72 visible words ("Searching knowledge base… From 165+ verified sources"). Client-side `KnowledgeAI` shell. Zero internal links. No tables, no citations, no FAQ content visible server-side. JSON-LD: Article + BreadcrumbList only (no FAQPage because there's no authored FAQ).
**PAA relevance:** **3 direct PAA hits** in seo_report.json (highest of the 5 AI-shells):
- "Can potatoes be stored in cold storage?"
- "How long will potatoes last in a cold garage?"
- "How to make a cold storage for potatoes?"
Plus 4 `/answers/*` slugs already target adjacent intents (`potato-cold-storage-temperature`, `how-long-potatoes-cold-storage`, `how-to-build-potato-cold-storage`, `how-to-store-potatoes-at-home` shipped earlier today).
**Missing template elements:** All of them. Full rebuild required.
**Recommended upgrades:** Full rebuild following the `CompleteGrowingGuide` pattern (closest template analog). Target: 2,000–2,500 words, 7–8 H2 sections (optimal temps, humidity, CIPC alternatives, reconditioning, post-harvest losses, cold-chain logistics, home storage), 2 tables (temp-by-use-case matrix; shelf life by condition), 20+ internal links (link to the 4 existing storage answer pages + country pages for Netherlands/UK/US cold-chain infrastructure), authored FAQ with 6 Q&As covering the 3 PAAs above plus 3 adjacent storage questions, triple JSON-LD.
**Estimated effort:** High (full authored article — roughly the same effort as a new premium page from scratch, ~1–2 working days).

### 8. potato-diseases-pests — **BASIC (shell)**
**Current state:** 71 words, same shell pattern.
**PAA relevance:** Zero direct PAAs in seo_report.json. However, this is a high-volume farmer-audience search cluster (late blight, Colorado potato beetle, etc.) not captured by the 15 tracked SERP keywords.
**Missing template elements:** All.
**Recommended upgrades:** Full rebuild. Strong content angle exists: the data in `AI_KNOWLEDGE_PAGES` already specifies a premium outline (late blight economic impact $6B+/yr, Irish Potato Famine tie-in, CIP resistant varieties). Target 2,000–2,200 words. Strategic value: farmer-audience traffic and B2B authority.
**Estimated effort:** High.

### 9. seed-potato-systems — **BASIC (shell)**
**Current state:** 72 words, shell.
**PAA relevance:** 0 direct PAAs, but 2 indirect ("How many seed potatoes per 25 gallon grow bag?", "How many potatoes will 10 lbs of seed potatoes produce?" — both more consumer-facing than this B2B topic). Real strategic value is B2B / international-development audience (Netherlands 75% of global certified seed, TPS technology).
**Missing template elements:** All.
**Recommended upgrades:** Full rebuild. Premium outline: certification tiers, Netherlands dominance, Scottish seed, TPS breakthrough, developing-country seed system gaps. Target 2,000 words, 6–7 H2s, 1–2 tables (certification tier matrix; top seed exporters with market share), 15+ internal links. Pairs well with existing `/blog/seed-potato-systems-guide`.
**Estimated effort:** High.

### 10. climate-change-potatoes — **BASIC (shell)**
**Current state:** 72 words, shell.
**PAA relevance:** 0 direct PAAs. However, climate × agriculture is one of the highest-leverage LLM-citation clusters: policy researchers, journalists, and climate NGOs routinely query LLMs for "impact of climate change on [staple crop]." No current Potatopedia content is visible to those queries.
**Missing template elements:** All.
**Recommended upgrades:** Full rebuild. Premium outline: temperature sensitivity (optimal 15–20°C), yield impacts by region, water scarcity, shifting growing zones, CIP heat-tolerant varieties, 2050 projections. Heavy citation opportunity (IPCC, CGIAR, CIP, FAO). Target 2,200 words, 7 H2s, 2 tables (yield-impact-by-region; heat-tolerant variety matrix), 20+ internal links into country pages of climate-vulnerable producers (India, Bangladesh, Egypt, Peru).
**Estimated effort:** High, but highest AI-citation strategic leverage of the 5 shells.

### 11. potato-processing-industry — **BASIC (shell) — ANTI-RECOMMENDATION**
**Current state:** 73 words, shell.
**PAA relevance:** 1 PAA ("How big is the potato processing market?") — but that's already covered by `/answers/potato-processing-market-size` *and* the near-premium `/knowledge/how-potatoes-are-processed`.
**The problem:** This article is **structurally redundant** with `how-potatoes-are-processed`. Both map to the same topic cluster. Two knowledge pages competing for the same queries will cannibalize rankings and fragment link equity. See "Anti-recommendations" section.
**Estimated effort:** N/A — recommend not rebuilding.

---

## Prioritized Upgrade Roadmap

Scoring logic: **PAA coverage × strategic leverage ÷ effort**. I'm weighting PAA hits heavily because they map to demonstrated search demand, and demoting pages where the topic is already covered elsewhere in the hub.

### 1. `potato-storage-cold-chain` — FULL REBUILD (ship first)

**Why first:** 3 direct PAA hits (most of any shell). No server-rendered content on this topic exists anywhere else in the hub. The 4 recently-shipped storage answer pages (`how-to-store-potatoes-at-home` shipped today, `how-long-potatoes-cold-storage`, `how-to-build-potato-cold-storage`, `potato-cold-storage-temperature`) are orphaned without a parent knowledge article tying them together. A single premium page here unlocks hub structure for the entire storage cluster and converts an invisible shell into a PAA-covering entity. Effort: ~1–2 days.

### 2. `potato-nutrition-facts` — LIGHT POLISH (ship second, low-hanging fruit)

**Why second:** This article already has the hardest part — 1,767 words of authored content, triple JSON-LD, all template components. It just lacks internal-link density (16 vs reference 60). The nutrition topic maps to **7 PAAs** (the highest count in the hub), spanning cardiac, diabetes, serotonin, heartburn queries. An afternoon of link-density work converts a near-premium page into a top AI-citation target for health queries. Effort: ~2–4 hours.

### 3. `climate-change-potatoes` — FULL REBUILD (ship third)

**Why third:** Zero direct PAAs — so why above `diseases-pests` and `seed-potato-systems`? Because climate × agriculture is disproportionately queried by LLM users (researchers, journalists, policy analysts) vs captured by Google SERP PAAs. Shipping a cited, authoritative page here is the single highest AI-citation leverage opportunity on the site. No current content competes internally or externally from a data-neutrality standpoint. Effort: high but the content angle is differentiated (most sites cover climate impacts on wheat/rice/maize, few treat potatoes seriously).

### 4. `seed-potato-systems` — FULL REBUILD (ship fourth)

**Why fourth:** 0 direct PAAs but strong B2B/international-development audience demand. Potatopedia has a data advantage here (Netherlands seed export data, NAK references). Pairs with existing `/blog/seed-potato-systems-guide`, `/answers/seed-potato-certification`, `/answers/certified-seed-potatoes`, `/answers/true-potato-seeds`. Authoritative vertical where few competitors write serious content. Effort: high, but relatively focused scope.

### 5. `potato-diseases-pests` — FULL REBUILD (ship fifth)

**Why fifth:** 0 direct PAAs in seo_report.json. Farmer-audience topic with real demand but not captured by the 15 tracked SERPs — so strategic value is moderate-uncertain. Premium outline is already specified in `AI_KNOWLEDGE_PAGES`. Ship after the three above; this is the lowest-urgency of the 4 remaining rebuilds. Effort: high.

### 6. `how-potatoes-are-processed` — POLISH (ship sixth, bundled with #7)

**Why sixth:** Already near-premium. Polish work: add 4–6 answer-page links, add Related Countries strip, extend word count by ~200. Light. Bundle with #7 below. Effort: ~2–3 hours.

### 7. `potato-varieties-guide` — ADD TABLES (bundled)

**Why seventh:** Already premium except for zero tables, which is genuinely a gap for a "50+ Types Explained" page. Bundle with #6 as a single polish afternoon. Effort: ~1–2 hours (data exists, just format).

### 8. `global-potato-trade` — ADD RELATED COUNTRIES STRIP (maintenance)

**Why last:** Already premium. Only gap is Related Countries strip. Cosmetic. Effort: <1 hour. Slot as maintenance during any future deploy.

---

## Anti-recommendations

### Do NOT rebuild `potato-processing-industry` as a separate knowledge article.

**Reasoning:** It targets the same topic cluster as the existing near-premium `/knowledge/how-potatoes-are-processed` (1,592 words, 24 links, 10 H2s, full triple JSON-LD). Building a second processing-industry article at `/knowledge/potato-processing-industry` would create internal keyword cannibalization — Google will split ranking signal between two Potatopedia pages competing for the same queries, and neither ends up ranking as well as one consolidated authority page would.

**Recommended action:** Pick one of two paths during the polish pass:
- **(a) Consolidation:** Redirect `/knowledge/potato-processing-industry` → `/knowledge/how-potatoes-are-processed` (308 permanent, same mechanism as the three consolidations done earlier today in `next.config.mjs`). Remove the slug from `ALL_SLUGS` and `KNOWLEDGE_TITLES`.
- **(b) Re-scope:** If the intent is to have a second page, re-scope `potato-processing-industry` to a narrower focus that doesn't compete — e.g., "Major Potato Processing Companies" (McCain, Lamb Weston, Simplot, Agristo profile page) or "Potato Processing Plant Economics" (costs, capacity, ROI). That reframes it from redundant-topic-page to complementary-angle-page.

My recommendation is **(a)**: the existing how-processed article is the natural canonical, and the content plan's "Related Searches" has an unaddressed `largest-potato-companies` slot that could house a dedicated company-profile page instead.

### Do NOT attempt to "upgrade" the 4 already-PREMIUM articles before the 5 shells are fixed.

**Reasoning:** Marginal word-count or table additions to premium articles produce marginal rank improvements. A full shell rebuild converts an **invisible** page into a ranking asset. The opportunity cost of polishing the already-premium tier first is that 5 topic clusters stay unindexed.

### Do NOT rebuild the shells by swapping `KnowledgeAI` for a smarter server-side AI call.

**Reasoning:** The visible failure mode today is that `KnowledgeAI` renders a 72-word "Searching knowledge base…" shell to crawlers. "Fixing" that by calling the backend server-side during SSG would produce content that varies per build and isn't auditable — defeating the citation-trust use case. The 6 static articles demonstrate the right pattern: hand-authored JSX with cited tables, stable across deploys. Rebuilds should follow that pattern, not try to make `KnowledgeAI` crawl-friendly.

---

## Appendix — Methodology Notes

- All 11 URLs + reference fetched 2026-04-24 with `User-Agent: Mozilla/5.0 KnowledgeAudit/1.0` via `curl -sL`.
- Word counts obtained by stripping `<script>`, `<style>`, HTML tags, HTML entities, then counting whitespace-split tokens.
- Internal link counts measured against `href="/country/*"`, `/knowledge/*`, `/blog/*`, `/answers/*` patterns.
- Template-element detection uses string markers: `data-summary="true"` for Definitive Answer, `Frequently Asked|FAQ` regex for FAQ section, `In this article|Table of Contents` for TOC, `Related Articles|Related Reading|Continue Reading` for related grid, `Related Countries|Country Profiles|Explore Countries` for related-country strip.
- Citation density measured as parenthetical markers matching `(FAOSTAT|USDA|CIP|FAO|UN Comtrade|Eurostat|CPRI|DEFRA|NPC|Statista|NAK)`.
- PAA-relevance scoring uses the 41 questions in `scripts/seo_report.json` dated 2026-04-16.
- No source files modified. No build or deploy performed.
