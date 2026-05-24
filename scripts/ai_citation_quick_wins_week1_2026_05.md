---
title: AI citation quick wins V2 — Week 1 actions (May 9–16, 2026) — analytics-grounded
date: 2026-05-09
status: ACTIONABLE V2 — Tier 1 partially approved (#1 Wikidata YES, #2 Otterly SKIPPED, #3 Schema YES); Tier 2 pending review
purpose: Phase 4 deliverable — what to ship this week to compound the existing 558/week Bing citation flywheel
---

# Week 1 quick wins V2

**Strategic context:** Bing Webmaster Tools shows we are already at 558 AI citations / week across 130 pages — not starting from zero. Tier 1 Week 1 work compounds the existing flywheel via entity-graph + schema density. Tier 2 broadens the cited-page base via analytics, technical hygiene, and CSV/research preparation.

The 12-month plan won't compound without Week 1 momentum. Items below are organized as Tier 1 (must ship this week) and Tier 2 (next week, pending review).

Each item:
- **What** — one-sentence description
- **Why** — the citation-mechanism it exploits
- **Effort** — S (≤2 hr) / M (2–6 hr) / L (>6 hr)
- **Owner** — Devendra (manual) / Claude Code (automated) / Both
- **Impact** — High / Medium / Low expected
- **Cost** — $ if any
- **Dependency** — what blocks it

---

## Tier 1 — Must ship this week

### #1. Create Wikidata entity for Potatopedia
- **What:** Submit a new Wikidata entity for Potatopedia following the property mapping in the 12-month plan §1.1.
- **Why:** Brands with verified Wikidata items are 3.2× more likely to display a Knowledge Panel and 2.7× more likely to appear in AI Overview citations (ReputationX 2024). This is the single highest-leverage move identified in Phase 2 audit. One-time creation, free, unlocks the entire entity-graph downstream.
- **Effort:** M (2–4 hrs initial creation; community review window ~30 days)
- **Owner:** **Devendra** (must be human-attached — Wikidata bots are prohibited and account scrutiny is real)
- **Impact:** **Highest** — single most important item on this list
- **Cost:** $0
- **Dependency:** None
- **Notes:** Use the property mapping in `ai_dominance_12_month_plan_2026_05.md §1.1`. Reference the official site, Devendra's LinkedIn, and (if applicable) any Crunchbase / press coverage as Wikidata "stated in" properties. Notability risk is real; if the community deletes, retry with stronger external citations after the first research report (Phase 2) generates them.

### #2. Otterly.AI subscription — **SKIPPED** (V2 decision)
**Decision:** Skip for first 90 days. Bing Webmaster Tools provides citation event-count data; Plausible.io provides AI engine referral-click data; manual quarterly cross-engine spot-checks fill the ChatGPT/Perplexity/Claude gap. Saves $87 + management overhead. Reassess August 2026 if cross-engine measurement parity becomes a measurable bottleneck.
**Replacement coverage:** Tier 1 #1B (Plausible API integration) + Tier 2 #6 (Bing citation engine identification) + Tier 2 #8 (manual cross-engine spot-checks).

### #3. Audit + expand Organization + Person schema across the site
- **What:** Audit current Organization schema (currently minimal on /about); expand to full @graph with founder, foundingDate, sameAs to LinkedIn / Twitter / GitHub / Crunchbase. Wire Person schema into existing `articleAuthorBlock` so every Article references a verified Person.
- **Why:** AI engines weight @id-linked entity graphs heavily for E-E-A-T signaling. Per Wellows 2026: pages with 15+ recognized entities show 4.8× higher AI Overview selection probability. Our country pages already have Wikidata sameAs for Country/Place entities; we need the Organization side complete to close the loop.
- **Effort:** M (2–4 hrs to audit + edit `lib/authors.js` + extend `app/about/page.jsx`)
- **Owner:** **Claude Code**
- **Impact:** **High** — compounds every existing schema-rendering surface
- **Cost:** $0
- **Dependency:** Item #1 should be filed first so the Wikidata Q-id can be referenced in the Organization sameAs list (even before community approval, the wikidata.org URL stub works as a sameAs target)
- **Tasks:**
  1. Read `lib/authors.js`, `app/about/page.jsx`, and the homepage Organization @graph
  2. Build out POTATOPEDIA_PUBLISHER with founder, foundingDate, foundingLocation, knowsAbout, sameAs (LinkedIn, Twitter/X, GitHub, Wikidata)
  3. Create POTATOPEDIA_DEVENDRA Person object with sameAs to LinkedIn / academic profile / GitHub
  4. Update articleAuthorBlock to reference POTATOPEDIA_DEVENDRA + POTATOPEDIA_EDITORIAL
  5. Add Organization @graph to /about/page.jsx (currently sparse)
  6. Verify via Google Rich Results Test on /about + homepage + a country profile

---

## Tier 1 additions in V2

### #1A. /ask?q= URL noindex fix (technical hygiene)
- **What:** Add `<meta name="robots" content="noindex">` (or HTTP header equivalent) to `/ask` route when query string is present. Prevents indexable parameterized URLs from diluting citation signal.
- **Why:** AI Q&A interface generates indexable URLs that shouldn't be indexed. Each parameterized URL is a low-value variant competing with the canonical `/ask` page for citation signal. Cheap defensive fix.
- **Effort:** S (30–45 min)
- **Owner:** **Claude Code**
- **Impact:** **Medium** (defensive — prevents future indexing penalties)
- **Cost:** $0

### #1B. www canonical + non-www sitemap unsubmission
- **What:** Pick `www.potatopedia.com` as canonical (already the live domain). Verify all internal links use `www`. In Bing Webmaster Tools, unsubmit the non-www sitemap so signal consolidates.
- **Why:** Bing has both `potatopedia.com` and `www.potatopedia.com` submitted. Citation signal currently splits across both. Consolidating prevents future authority dilution.
- **Effort:** S (30 min — Devendra in Bing dashboard)
- **Owner:** **Devendra** (Bing dashboard) + Claude Code (verify internal links)
- **Impact:** **Medium** (defensive)
- **Cost:** $0

### #1C. Plausible API integration setup (Task B Phase 1)
- **What:** Confirm Plausible tracking script installed; document API key generation runbook; structure env vars; set up data fetcher.
- **Why:** Plausible is the only source we have for AI engine *referral click* data (chatgpt.com, perplexity.ai, claude.ai, copilot.microsoft.com referrers). Bridges the gap between Bing citation events (citations) and Plausible engine clicks (downstream traffic).
- **Effort:** M (4 hrs total — runbook + env structure + fetcher script)
- **Owner:** **Both** — Devendra generates API key, Claude Code builds fetcher
- **Impact:** **High** — fills the cross-engine click data gap that would otherwise need Otterly $29/mo to fill
- **Cost:** $0 (assuming Plausible free / growth tier — no extra)
- **Dependency:** Devendra generates API key first per `scripts/PLAUSIBLE_SETUP.md`

---

## Tier 2 — Strong upside next week (pending review)

### #4. Create downloadable CSV exports at /data
- **What:** Auto-generate `/data/production-timeseries.csv`, `/data/varieties-database.csv`, `/data/country-profiles-summary.csv` from existing JS modules. Add Dataset schema. Add `/data` index page with citation guidance.
- **Why:** Researchers cite the source they downloaded from. Free CSV exports compound citations slowly but durably. Low marginal effort because the data already exists in `lib/faostat-timeseries.js` and `lib/varieties-data.js`.
- **Effort:** M (3–4 hrs)
- **Owner:** **Claude Code**
- **Impact:** **Medium-High** (compounds over 6–12 months)
- **Cost:** $0
- **Dependency:** None
- **Tasks:**
  1. Create `app/data/[filename]/route.js` returning CSV (Content-Type: text/csv, Content-Disposition: attachment)
  2. Generate from existing JS data modules at build time
  3. Add Dataset JSON-LD with `temporalCoverage`, `license` (CC-BY-SA 4.0), `creator` (Organization @id), `distribution.contentUrl`
  4. Create `app/data/page.jsx` index with citation guidance: "Suggested citation: Potatopedia (2026). Global Potato Production Time Series 2018–2024. Retrieved from https://www.potatopedia.com/data/"
  5. Add `/data` to sitemap.xml

### #5. Identify our 10 most-trafficked pages + verify citation-friendly schema
- **What:** Pull GSC top-10 pages by impressions; audit each for: complete @graph, dateModified, Speakable, FAQPage, Person attribution, Wikidata sameAs where applicable.
- **Why:** Our highest-trafficked pages are also our highest citation-potential pages. Per Ahrefs: 76% of AI Overview citations come from top-10 organic results. Auditing where we have search visibility ensures every existing high-traffic page has the schema density to convert visibility into citation.
- **Effort:** M (3 hrs)
- **Owner:** **Both** — Devendra pulls GSC data, Claude Code audits + fixes
- **Impact:** **Medium-High**
- **Cost:** $0
- **Dependency:** Devendra needs to share top-10 pages from GSC
- **Tasks:**
  1. Devendra: export top-10 pages from Google Search Console (last 90 days)
  2. Claude: for each, run schema validator + identify gaps
  3. Claude: ship fixes for any missing FAQPage / Article / Speakable / sameAs

### #6. Outreach list build — 30 .edu / .gov / .org agriculture programs
- **What:** Build a contact list of 30 agriculture-research programs at .edu / .gov / .org domains relevant to potato research.
- **Why:** Foundation for sustained Phase 1.4 partnership outreach. EDU/GOV inbound links carry 5–10× the AI-trust weight of equivalent commercial backlinks.
- **Effort:** M (3 hrs)
- **Owner:** **Devendra**
- **Impact:** **Medium** (compounds when outreach actually happens in Phase 1)
- **Cost:** $0
- **Targets** (suggested seed list, expand from there):
  - CIP (cipotato.org) – International Potato Center
  - FAO (fao.org) – FAOSTAT team + knowledge management
  - USDA NASS (nass.usda.gov) – statistician contacts
  - USDA ARS – potato research stations (Aberdeen ID, Beltsville MD)
  - University of Idaho (uidaho.edu) – Aberdeen R&E Center
  - Washington State University (wsu.edu) – potato extension
  - Cornell University (cornell.edu) – School of Integrative Plant Science
  - North Dakota State University (ndsu.edu) – potato breeding program
  - University of Minnesota (umn.edu) – potato research
  - Wageningen University (wur.nl) – agricultural economics + breeding
  - Teagasc (teagasc.ie) – Irish agricultural research
  - INRAE France (inrae.fr) – plant breeding
  - JKI Germany (julius-kuehn.de) – potato research
  - ICAR-CPRI Shimla (cpri.icar.gov.in) – India national institute
  - Tamil Nadu Agricultural University (tnau.ac.in)
  - GB Pant University (gbpuat.ac.in) – India
  - KALRO Kenya (kalro.org) – Kenya agricultural research
  - KEPHIS (kephis.go.ke) – Kenya plant inspection
  - Egerton University (egerton.ac.ke) – Kenya
  - University of Cape Town (uct.ac.za) – South Africa
  - Potatoes South Africa (potatoes.co.za)
  - AGROSAVIA Colombia (agrosavia.co)
  - INRAA Algeria (inraa.dz)
  - ITDAS Algeria (itdas.dz)
  - Iranian Seed and Plant Improvement Institute (spii.ir)
  - Türkiye Potato Research Institute (TIGAEM)
  - Bangladesh Agricultural Research Institute (bari.gov.bd)
  - Pakistan Agricultural Research Council (parc.gov.pk)
  - China Academy of Agricultural Sciences (caas.cn)
  - Centre for Agriculture and Bioscience International (cabi.org)

### #7. Audit + expand Wikidata sameAs density on existing pages
- **What:** Most premium country pages already have Wikidata Q-ids for Country/Place. Extend coverage to: knowledge articles (link to subject Q-ids), variety pages (link to species/variety Q-ids), blog posts (link to topic Q-ids).
- **Why:** Pages with 15+ recognized entities show 4.8× higher AI Overview selection probability (Wellows 2026). Wikidata Q-id sameAs is the most efficient way to surface entity density to AI engines.
- **Effort:** M (3–4 hrs to audit + ship)
- **Owner:** **Claude Code**
- **Impact:** **Medium**
- **Cost:** $0
- **Tasks:**
  1. Audit which Wikidata Q-ids appear in each page type
  2. Build a slug → Q-id mapping for: 100+ varieties (where Wikipedia has them), 50+ knowledge subjects, 50+ blog topics
  3. Add `sameAs` to existing Article / Thing JSON-LD
  4. Verify via Rich Results Test

### #8. Press-release draft for "M2 sprint" deployment
- **What:** Draft a press release announcing the Multi-Year FAOSTAT Time Series module + 5 new country profiles + corrected Iran narrative + Colombia dual-statistic. This is news-worthy industry content.
- **Why:** Even pre-distribution, having a press release ready means we can move fast in Month 3 when budget allows for PR Newswire distribution. Establishes the publication-cadence muscle.
- **Effort:** M (3 hrs)
- **Owner:** **Claude Code** (draft) + **Devendra** (approval)
- **Impact:** **Medium** (foundation for Phase 2 distribution)
- **Cost:** $0 to draft; ~$400 if distributed
- **Dependency:** Decision on whether to distribute now or hold for Month 3 with the full "State of Global Potato Trade 2026" report
- **Tasks:**
  1. Draft 400-word release titled "Potatopedia Releases Multi-Year FAOSTAT Time Series for 99 Countries — Corrects Iran Production Narrative and Adds Colombia Dual-Statistic Methodology"
  2. Include direct quote from Devendra
  3. Include 3 link-back targets: /knowledge/top-potato-producing-countries, /country/iran, /country/colombia
  4. Save at `scripts/press_release_m2_2026_05.md` for distribution decision

### #9. Schema validator in CI
- **What:** Wire Schema.org validator + Google Rich Results Test API into deploy pipeline. Block deploys with schema regressions.
- **Why:** Prevents the silent erosion of schema quality as we ship features. Keeps Phase 4 technical foundation work honest. Per Wellows 2026: technical accessibility scores 9.5/10 in citation factors — a single broken schema can knock entire pages out of citation eligibility.
- **Effort:** M (3–4 hrs)
- **Owner:** **Claude Code**
- **Impact:** **Medium** (defensive — prevents regression rather than driving forward)
- **Cost:** $0
- **Dependency:** None
- **Tasks:**
  1. Add a validation script `scripts/validate-schema.sh` that runs the public schema validator against representative URLs after deploy
  2. If failures, log + alert (don't break deploy initially; add hard-block after a week of clean runs)
  3. Add to CLAUDE.md as part of the standard deploy ritual

---

## Tier 2 V2 additions

### #10. Bing citation engine identification + deploy-correlation analysis
- **What:** Devendra exports last-90-days Bing Webmaster Tools "AI engine traffic" CSV (broken down by engine if Bing exposes that — Copilot vs Edge AI vs Microsoft Search). Claude Code cross-references cited-page list with Tier 2 / Tier 3 / M2 sprint deploy timelines to identify which content investments correlate with citation lift.
- **Why:** Tells us which page classes get cited most heavily. Informs Phase 2 research-report scope and Phase 4 programmatic-SEO emphasis.
- **Effort:** M (4 hrs)
- **Owner:** **Both** — Devendra exports CSV, Claude Code analyzes
- **Impact:** **High** — quantifies which content investments paid off
- **Cost:** $0
- **Output:** `scripts/bing_citation_correlation_2026_05.md`

### #11. Manual cross-engine citation spot-check (30-query universe × 5 engines)
- **What:** Devendra runs the 30-query universe manually against ChatGPT (logged-in fresh session), Perplexity (logged-in fresh session), Claude with web search, Google AI Overviews (incognito), Gemini.
- **Why:** Bing data only covers Bing. Plausible shows referral clicks but not citation events. This is the only way to measure ChatGPT / Perplexity / Claude / Google AI Overviews citation rates without paid tooling. Establishes baseline for cross-engine progress measurement.
- **Effort:** M (2 hrs initial)
- **Owner:** **Devendra**
- **Impact:** **High** — establishes the cross-engine baseline
- **Cost:** $0
- **Output:** `scripts/manual_citation_spotcheck_2026_05_09.md`

## Suggested execution order (V2)

**Day 1 (Friday):** Item #1 (Wikidata runbook handoff to Devendra) + Items #1A/#1B (technical hygiene) + #1C kickoff (Plausible API key generation by Devendra)
**Day 2 (Saturday):** Item #3 (Organization/Person schema audit + expansion) — Claude Code
**Day 3 (Sunday):** Item #1C completion (Plausible fetcher script) — Claude Code
**Day 4 (Monday):** Tier 2 review checkpoint with Devendra; approve items 4–11
**Day 5 (Tuesday):** Items #4 (CSV exports) + #5 (top-10 audit) — Claude Code with GSC data
**Day 6 (Wednesday):** Items #7 (Wikidata sameAs density) + #10 (Bing correlation) — Claude Code
**Day 7 (Thursday):** Items #8 (press release draft) + #9 (schema validator CI) + #11 (manual cross-engine spot-check by Devendra)

## What we're explicitly NOT doing this week

- **No Wikipedia article creation attempts.** Notability bar requires significant external coverage we don't yet have. Defer to Phase 2 after first research report is published.
- **No paid backlinks / link-building.** Banned per CLAUDE.md ethics + lasting penalty risk.
- **No mass cold-email campaigns.** Focus on quality outreach to a curated list (Item #6 builds the list; outreach happens in Phase 1.4 of the 12-month plan).
- **No content creation sprint beyond press release.** Distinctive editorial value is already there; the bottleneck is distribution, not production.
- **No deploying the Trade Flow Visualizer.** Held for Phase 2 (Month 4) when more research-report context is in place to drive launch attention.

## Summary table V2

| # | Item | Tier | Effort | Owner | Impact | Cost | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Wikidata entity creation | 1 | M | Devendra | **Highest** | $0 | ✅ Approved |
| 1A | /ask?q= URL noindex | 1 | S | Claude Code | Medium | $0 | Pending |
| 1B | www canonical + sitemap split | 1 | S | Both | Medium | $0 | Pending |
| 1C | Plausible API integration | 1 | M | Both | High | $0 | Pending Devendra API key |
| 2 | ~~Otterly.AI subscription~~ | — | — | — | — | — | ❌ **SKIPPED V2** |
| 3 | Organization + Person schema | 1 | M | Claude Code | High | $0 | ✅ Approved |
| 4 | CSV exports at /data | 2 | M | Claude Code | Medium-High | $0 | Pending review |
| 5 | Top-10 page schema audit + fixes | 2 | M | Both | Medium-High | $0 | Pending review |
| 6 | Outreach list (30 contacts) | 2 | M | Devendra | Medium | $0 | Pending review |
| 7 | Wikidata sameAs density expansion | 2 | M | Claude Code | Medium | $0 | Pending review |
| 8 | Press release draft for M2 sprint | 2 | M | Claude Code | Medium | $0 | Pending review |
| 9 | Schema validator in CI | 2 | M | Claude Code | Medium | $0 | Pending review |
| 10 | Bing citation engine ID + deploy correlation | 2 | M | Both | **High** | $0 | Pending review |
| 11 | Manual cross-engine spot-check (30-query × 5 engines) | 2 | M | Devendra | **High** | $0 | Pending review |

**Total Week 1 V2 effort:** ~30–40 hrs across both owners; **$0 recurring** (Otterly skipped).

## Important: Approval gate before execution

Per the brief: "DO NOT execute anything yet. Build and show me all 4 deliverable documents first."

This document is a proposal. None of the items above have been executed. After review, please approve which items (and in what order) to execute. Recommended minimum approval: items #1, #2, #3 (Tier 1) for foundational impact.

## Sources

- [Wikidata for SEO (ReputationX 2024 study)](https://www.reputationx.com/blog/wikidata)
- [Google AI Overviews Ranking Factors 2026 (Wellows)](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [76% of AI Overview citations from top 10 (Ahrefs)](https://ahrefs.com/blog/search-rankings-ai-citations/)
- [ALLMO 2026 LLMs.txt analysis](https://www.allmo.ai/articles/llms-txt)
- [Otterly.AI / AthenaHQ / Profound comparison](https://athenahq.ai/articles/profound-vs-athenahq-comparison)
