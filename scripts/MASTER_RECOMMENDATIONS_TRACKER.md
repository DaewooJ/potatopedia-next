---
title: Master recommendations tracker — every recommendation across SEO + AI citation strategy
date: 2026-05-09
last_updated: 2026-05-09
purpose: single canonical inventory of every recommendation — completed, in-progress, pending, deferred, skipped — across the comprehensive SEO audit, all sprint reports, and the 12-month AI dominance plan
---

# Master recommendations tracker

**Last updated:** 2026-05-09

## Headline counts

| Status | Count |
| --- | ---: |
| ✅ Completed | 25 |
| 🟡 In progress | 3 |
| ❌ Pending (C.1–C.6) | 33 |
| ⏸️ Deferred | 3 |
| ⛔ Skipped | 2 |
| 📅 Scheduled checks | 6 |
| 🔍 Data gaps (full enumeration in Section G) | 22 |
| **Total tracked** | **73** |

## Recent wins (last 30 days, 2026-04-09 → 2026-05-09)

| Date | Sprint | Items | Impact |
| --- | --- | --- | --- |
| 2026-05-09 | AI Citation Week 1 Tier 1 | `/ask?q=` noindex; www canonical verified; Schema expansion (full @graph site-wide); 4 strategic docs + 2 runbooks; analytics dirs scaffolded | Foundation for 12-month off-platform sprint |
| 2026-05-09 | M2 Multi-year time series | FAOSTAT 2018-2024 site-wide; Iran narrative correction; Colombia DANE/FAOSTAT dual-stat; 4 production-figure refreshes; `lib/faostat-timeseries.js` (99 countries × 7 years) | M2 deferred item closed |
| 2026-05-08 | Country coverage 5 | Premium dossiers for Turkey, Iran, Algeria, Uzbekistan, Colombia (7,300–8,500 words each); shared component | Country-coverage gap closed |
| 2026-05-08 | Tier 3 SEO | M1–M7 + D1–D3 — Speakable site-wide, M2 v1, Place/Country verification, Updated microcopy, Kenya M5 partial, 2 Kenya blog posts, HowTo on 17 answers, D2 Blog FAQPage, D3 Person schema universal | Medium-priority audit batch closed |
| 2026-05-08 | Tier 2 SEO | C1, H1 schema, H2 robots.txt, H3 Person, H4 titles, H5 meta, H6 country FAQs, H7 Place/Country, H8 llms.txt | Critical + High batch closed |

---

## SECTION A — COMPLETED ✅ (25 items)

| ID | Description | Date | Owner |
| --- | --- | --- | --- |
| C1 | Server-render `/answers/*` content (83 pages) — `lib/answers-baked.json` + BakedAnswerBlock SSR; Article + FAQPage + BreadcrumbList | 2026-05-08 | Claude Code |
| **H1 partial** | Variety pages — schema upgrade 100% (Article + Product + FAQPage + Thing + BreadcrumbList + Wikidata sameAs); word-count expansion 62/238 (12 hand-crafted: Russet Burbank, Yukon Gold, Maris Piper, Bintje, Atlantic, Désirée, Charlotte, Innovator, Kufri Jyoti, Kufri Pukhraj, Shangi, Spunta + 50 templated) | 2026-05-08 | Claude Code |
| H2 | robots.txt expanded to 26 user-agent entries (full AI-crawler allowlist) | 2026-05-08 | Claude Code |
| H3 | Person/Author schema with sameAs to LinkedIn — `lib/authors.js` POTATOPEDIA_PUBLISHER + POTATOPEDIA_EDITORIAL site-wide | 2026-05-08 | Claude Code |
| H4 | Title tags normalized to ≤70 chars (all sample URLs in 48–72 range) | 2026-05-08 | Claude Code |
| H5 | Meta descriptions normalized to 140–160 chars (worst case 384 → 120) | 2026-05-08 | Claude Code |
| H6 (country) | FAQPage schema on 24 standard country profiles (4 PAA-aligned templated questions) | 2026-05-08 | Claude Code |
| H6 (blog) | FAQPage schema on 28 blog posts (programmatic 6-Q&A) — = D2 from Tier 3 | 2026-05-08 | Claude Code |
| H7 | Place/Country schema with Wikidata sameAs on 30 country profiles via COUNTRY_WIKIDATA map | 2026-05-08 | Claude Code |
| H8 | llms.txt refreshed (6 dossiers / 29 knowledge / 83 answers + Kenya + WPC 2026 + Indian states; banned indianpotato.com removed) | 2026-05-08 | Claude Code |
| M1 | Speakable schema across all premium content (5 dossiers + India state + knowledge premium + blog + answer + variety) | 2026-05-08 | Claude Code |
| M2 | Multi-year FAOSTAT 2018–2024 time series surfaced site-wide (top-30 multi-year + Card 1 trajectory in 11 premium + 5-year band in 24 standard + global-trade FAOSTAT TM section + Dataset JSON-LD) | 2026-05-09 | Claude Code |
| M3 | Place/Country + FAQPage rollout completion (all 30 standard + premium dossiers verified) | 2026-05-08 | Claude Code |
| M4 | Visible "Updated" / "Last reviewed" microcopy on /about, /answers/*, /varieties/* | 2026-05-08 | Claude Code |
| **M5 partial** | Kenya named processors + government schemes resolved (Deepa Industries / Tropical Heat / Proctor & Allan + National Potato Strategy / KEPHIS / Syngenta Seeds2B); 3 systemic gaps remain (see C.3 M5 remainder + Section G) | 2026-05-08 | Claude Code |
| M6 | 2 Kenya supporting blog posts (Shangi seed certification + Nyandarua basket; ~1,400 words each) | 2026-05-08 | Claude Code |
| M7 | HowTo schema on 17 procedural answer slugs (conservative ≥3-step extractor) | 2026-05-08 | Claude Code |
| N1 | WebSite SearchAction confirmation on homepage — **side-effect win** of AI Tier 1 #3 (POTATOPEDIA_WEBSITE has potentialAction SearchAction targeting /ask?q={search_term_string}) | 2026-05-09 | Claude Code |
| D2 | Blog post FAQPage authoring (28 posts × programmatic 6 Q&As via H2-extraction in generateMetadata) | 2026-05-08 | Claude Code |
| D3 | Person schema universal coverage (premium dossiers + India state + knowledge premium + blog + answer pages all reference POTATOPEDIA_EDITORIAL) | 2026-05-08 | Claude Code |
| Country 5 | Premium dossiers for Turkey, Iran, Algeria, Uzbekistan, Colombia (7,300–8,500 words each; shared `CountryProfilePremium.jsx`; lib/data.js + sitemap updates) | 2026-05-08 | Claude Code |
| AI #1A | `/ask?q=` URL noindex via generateMetadata (refactored to server wrapper + AskClient.jsx) | 2026-05-09 | Claude Code |
| AI #1B (code) | www canonical verified (Vercel 307/308 redirects; metadataBase global; internal links audited) | 2026-05-09 | Claude Code |
| AI #3 | Organization + Person + WebSite schema expansion (full @graph on /about; banned indianpotato.com removed; homepage @id consistency fixed) | 2026-05-09 | Claude Code |
| Strategy package | 4 V2 docs (baseline / 5-lever audit / 12-month plan / Week 1 quick wins) + 2 runbooks (Wikidata + Plausible) | 2026-05-09 | Claude Code |

---

## SECTION B — IN PROGRESS 🟡 (3 items, all Devendra-side)

| ID | Description | Owner | Notes |
| --- | --- | --- | --- |
| AI #1 | Wikidata entity creation for Potatopedia | Devendra | Working through `scripts/WIKIDATA_RUNBOOK.md` (Option C: operator string-literal "Devendra K Jha", defer P112 founder claim until press release exists). Q-id assigned within 30 days expected. |
| AI #1B (Bing) | Unsubmit non-www sitemap from Bing Webmaster Tools dashboard | Devendra | Manual dashboard task |
| AI #1C | Plausible API key generation: plan tier check → API key → .env.local → curl verification | Devendra | Per `scripts/PLAUSIBLE_SETUP.md`. **Step 1: Devendra verifies plan tier (free vs paid). API access requires Growth $9/mo or Business $19/mo plan; free tier excludes API.** Upgrade if currently on free trial. Step 2: Generate Read-only API key. Step 3: Add `PLAUSIBLE_API_KEY` + `PLAUSIBLE_SITE_ID=potatopedia.com` to `.env.local`. Step 4: Run curl test from runbook Step 7 to confirm. |

---

## SECTION C — PENDING ❌ (33 items)

### C.1 Critical — this week (1 item)

| ID | Description | Owner | Effort | Impact | Dependency |
| --- | --- | --- | --- | --- | --- |
| AI #1C-build | Build `scripts/fetch_plausible_analytics.py` + `scripts/unified_analytics_report.py` + first weekly unified report | Claude Code | M | High | **GATED** on Devendra Plausible API key in `.env.local` |

### C.2 High Impact — within 2 weeks / Tier 2 next week (4 items)

| ID | Description | Owner | Effort | Impact | Notes |
| --- | --- | --- | --- | --- | --- |
| Tier 2 #4 | CSV exports at /data (production-timeseries / varieties-database / country-profiles-summary) with Dataset schema + citation guidance landing | Claude Code | M | Medium-High | **No dependency — can ship anytime** |
| Tier 2 #6 | Build outreach list of 30 .edu/.gov/.org agriculture contacts, segmented by category | Claude Code | M | Medium | **Build only — no execution.** Soft-hold on outreach until Wikidata Q-id + State of Trade report ready |
| Tier 2 #8 | Press release draft for M2 sprint (FAOSTAT timeseries + Iran correction + Colombia dual-stat) | Claude Code | M | Medium | **Internal review only.** Distribution decision deferred until Wikidata Q-id live |
| Tier 2 #9 | Schema validator in CI (post-deploy validation, alert on regression) | Claude Code | M | Medium | **No dependency — can ship anytime** |

### C.3 Medium Impact — within 6 weeks (12 items, fully enumerated)

| ID | Description | Owner | Effort | Impact | Notes |
| --- | --- | --- | --- | --- | --- |
| H1 remainder | Long-tail variety enrichment for 176 pages (programmatic content sprint) | Claude Code | L | Medium | Currently on schema-only baseline |
| **M5 remainder** | Resolve 3 systemic Kenya data gaps — live Wakulima Market price feed integration, per-county tonnage breakdown beyond Nyandarua's 35%, Big 4 Agenda potato-component allocations + county-level subsidy amounts | Both | L | Medium | Likely requires data partnerships (Wakulima Market for live prices, county governments for tonnage). May not be fully resolvable from open sources. |
| Carry-over 1 | Re-run `python3 scripts/seo_tracker.py` baseline 2 weeks post-Tier-2-sprint | Claude Code | S | Low | |
| Carry-over 2 | Submit refreshed sitemap via IndexNow (`scripts/indexnow_submit.py`) | Claude Code | S | Low | |
| Carry-over 3 | Verify schema via Google's Rich Results Test on 6 representative URLs | Both | S | Medium | |
| OP-1 | Cross-linking pass on 15 existing blog posts (improve internal-link density) | Claude Code | M | Medium | From OTHER PENDING list |
| OP-2 | Category-weighted related links on answer pages (M8 from earlier audit) | Claude Code | M | Medium | From OTHER PENDING list |
| OP-3 | SEO tracker expand to 50 keywords (current scope narrower) | Claude Code | S | Medium | From OTHER PENDING list |
| Phase 1.5 | Google News Publisher Center alignment (algorithmic — Article schema, news-sitemap.xml, bylines, organization-info block) | Claude Code | M | Medium | |
| Phase 2.1 | "State of Global Potato Trade 2026" research report — **PULLED EARLIER to Month 2** | Both | L | Highest in Phase 2 | Budget approved $2,500. Drafting Claude Code; design + distribution Devendra. |
| Phase 2.4 | Trade Flow Visualizer deployment at /tools/trade-flow-visualizer (Sankey/chord on FAOSTAT TM data 2018–2024) | Claude Code | L | Medium-High | Month 4. Previously deferred pre-FAOSTAT, **now unblocked by `lib/faostat-timeseries.js`**. |
| Phase 2.5 | Original photography/imagery program (30–50 photos with ImageObject schema, CC-BY-SA license) | Both | L | Medium | $0–$500. Optional. |

### C.4 Nice to have — within 12 weeks (10 items, with Phase 4 + Phase 5 rollups)

| ID | Description | Owner | Notes |
| --- | --- | --- | --- |
| N2 | ItemList schema on /countries collection page | Claude Code | S effort, low-medium impact |
| OP-4 | LinkedIn auto-poster activation (check Community Management API approval) | Devendra | S effort |
| OP-5 | Blog audit + premium upgrade (comparable to knowledge premium) | Claude Code | L effort |
| Phase 3.1 | Quarterly press release cadence (Months 5/8/11) — $400/release × 3 | Both | M each |
| Phase 3.2 | LinkedIn thought-leadership cadence (1–2 posts/week from Month 5) | Devendra | Continuous |
| Phase 3.3 | Trade-press media list build + maintenance | Devendra | M effort |
| Phase 3.4 | Academic + research outreach (USDA / CIP / ICAR-CPRI / KALRO / Wageningen) | Devendra | Continuous |
| Phase 3.6 | Podcast outreach (Real Agriculture, Mkulima Talk, etc.) | Devendra | Continuous |
| **Phase 4 rollup** | 8 items Months 7–9: 4.1 sitemap segmentation, 4.2 news sitemap, 4.3 Lighthouse 100/100 + INP <100ms, 4.4 Hindi multi-language (also gated — see C.6), 4.5 programmatic SEO at scale, 4.6 voice search audit, 4.7 Apple Spotlight + Siri | Claude Code | Detailed in `scripts/ai_dominance_12_month_plan_2026_05.md` |
| **Phase 5 rollup** | 5 items Months 10–12: 5.1 annual research-report repeats, 5.2 citation tracking dashboard, 5.3 schema A/B tests, 5.4 backlink portfolio measurement, 5.5 outreach refresh + relationship cultivation | Both | Detailed in `scripts/ai_dominance_12_month_plan_2026_05.md` |

### C.5 Manual tasks — Devendra owns regardless of dependencies (2 items)

| ID | Description | Trigger / dependency |
| --- | --- | --- |
| Tier 2 #11 / Phase 1.7 | Manual cross-engine spot-check (30-query × ChatGPT/Perplexity/Claude/Google AI Overviews/Gemini) | Anytime; baselines cross-engine citation visibility |
| Phase 1.4 | CIP / FAO / WPC / CPRI / KALRO partnership outreach emails | After Wikidata Q-id assigned + first research report ready (asset prerequisite per Devendra decision) |

### C.6 Gated — waiting on dependencies (4 items)

| ID | Description | Blocker |
| --- | --- | --- |
| Tier 2 #5 | Top-10 GSC schema audit | Devendra exports GSC top-10 to `scripts/data/gsc/` |
| Tier 2 #7 | Wikidata sameAs density expansion across knowledge / variety / blog pages | Wikidata Q-id assignment (Section B) |
| Tier 2 #10 / Phase 1.6 | Bing citation engine identification + deploy correlation analysis | Devendra exports 90-day Bing CSV to `scripts/data/bing/` |
| Phase 4.4 | Hindi multi-language strategy decision (also referenced in Phase 4 rollup in C.4) | June 22 ranking check + Bing/Plausible Hindi-language pattern analysis |

---

## SECTION D — DEFERRED ⏸️ (3 items)

| ID | Description | Deferred until | Rationale |
| --- | --- | --- | --- |
| Phase 3.5 | YouTube channel launch | December 2026 | Bandwidth-heavy; not the highest leverage given current Bing citation trajectory. Reactivate if Phases 2+3 are sustainable + editorial bandwidth allows 2 videos/month |
| Future phase | Wikipedia article creation for Potatopedia | After first research report generates independent media coverage (Phase 2/3) | Notability bar (WP:NCORP) requires significant external coverage we don't yet have. Wikidata is Year 1; Wikipedia is Year 2 |
| OP-Haiku | Haiku router for backend cost optimization | When API spend exceeds ~$50/month | Low priority |

---

## SECTION E — SKIPPED ⛔ (2 items)

| ID | Description | Decided | Rationale |
| --- | --- | --- | --- |
| AI #2 | Otterly.AI subscription ($29/mo) for cross-engine citation tracking | 2026-05-09 | Bing Webmaster Tools provides citation event-count data; Plausible provides AI engine referral-click data; manual quarterly cross-engine spot-checks fill the ChatGPT/Perplexity/Claude gap. Saves $87/quarter + management overhead. **Reassess August 2026.** |
| OP-IndianState | Indian state profile prominence redesign on /country/india | 2026-05-09 | User marked as not needed; current placement on /country/india is acceptable. Option C "State Gateway" hero strip (shipped 2026-05-03) sufficient. |

---

## SECTION F — SCHEDULED CHECKS 📅 (7 items)

| Date | Check | Trigger phrase | Memory file |
| --- | --- | --- | --- |
| 2026-05-17 | 2-week PAA ranking check (15 Wave 5 answer pages) | "run the 2-week ranking check" | `project_paa_15_ranking_check.md` |
| 2026-05-31 | 4-week knowledge article ranking check (4 converted articles) | "run the 4-week knowledge ranking check" | `project_knowledge_4_ranking_check.md` |
| 2026-06-05 | 4-week ranking check on 5 new country profiles | "run the country 5 ranking check" | `project_country_5_4_week_ranking_check.md` |
| 2026-06-19 | 6-week Kenya country profile ranking check | "run the kenya ranking check" | `project_kenya_6_week_ranking_check.md` |
| 2026-06-22 | Post-Tier-2 SEO sprint ranking check (mid-plan checkpoint) | "run the post-tier-2 ranking check" | `project_post_tier2_ranking_check.md` |
| 2026-06-28 | 8-week India state ranking check (5 state profiles) | "run the india state ranking check" | `project_india_state_8_week_ranking_check.md` |
| 2026-09-27 | Quarterly check: review https://docs.claude.com/en/docs/about-claude/model-deprecations and confirm current backend model (currently claude-sonnet-4-6) is still active. Next check: 2026-09-27. | "run the model deprecation check" | — |

---

## SECTION G — DATA GAPS 🔍 (22 inline `[DATA NEEDED]` flags)

Resolution effort tracked separately as research workstream — not blocking on-platform shipping. Likely sources: trade publications, government statistical bureaus, industry-association directories, academic literature.

| Country / page | Gap | Effort to resolve |
| --- | --- | --- |
| Iran | Hamadan-province cold-storage capacity (tonnes) | M (industry research) |
| Iran | Share of area planted to certified seed | M |
| Iran | Complete named-processor list | M |
| Iran | Specific named potato-sector subsidy schemes | M |
| Turkey | Precise share of area planted to certified seed | M |
| Turkey | Live wholesale price feed for hal markets | L (data partnership) |
| Turkey | Specific named potato-sector farmer-subsidy programmes | M |
| Algeria | Complete official variety list with production-share percentages | M |
| Algeria | Share of area planted to imported vs domestic certified seed | M |
| Algeria | Complete named-processor list | M |
| Algeria | Specific named subsidy programmes + potato-component allocations | M |
| Uzbekistan | Official variety list with production-share percentages | M |
| Uzbekistan | Share of area planted to certified vs farm-saved seed | M |
| Uzbekistan | Complete named-processor list | M |
| Uzbekistan | Specific named potato-sector subsidy programmes | M |
| Colombia | Precise current papa criolla export tonnage | M |
| Colombia | Share of area planted to certified vs farm-saved seed | M |
| Kenya | Per-county tonnage breakdown beyond Nyandarua's 35% share | L (county-government partnership) |
| Kenya | Live Wakulima Market price feed integration | L (data partnership) |
| Kenya | Big 4 Agenda potato-component allocations + county-level subsidy amounts | L |
| Global trade page | Top 10 importing countries by value (UN Comtrade) | M |
| How-potatoes-are-processed | Clarebout / Agristo revenue figures | S (industry filings) |

---

## How this tracker is maintained

- **When user asks "pendencies" / "what's pending" / "todo list" / "what needs to be done" / "where are we" / "what's left":** the memory pendencies file (`project_pendencies_master_list.md`) surfaces a one-line status summary + top 10 pending priorities, with pointer back to this tracker for full detail.
- **When an item ships:** strike-through or move from C/B → A; update date completed.
- **When an item is gated:** verify dependency status; if unblocked, move from C.6 → C.1/C.2/C.3 by impact tier.
- **When user adds a new recommendation:** add row to appropriate section with ID, owner, effort, impact, notes; update headline counts.

## Source documents

- `scripts/comprehensive_seo_audit_2026_05.md` — initial audit (1 Critical, 8 High, 7 Medium, 5 Nice-to-have)
- `scripts/seo_audit_implementation_2026_05.md` — Tier 2 sprint report (C1, H1–H8 outcomes)
- `scripts/seo_audit_implementation_tier3_2026_05.md` — Tier 3 sprint report (M1–M7 + D1–D3 outcomes)
- `scripts/m2_timeseries_2026_05.md` — M2 multi-year FAOSTAT time series sprint
- `scripts/country_coverage_5_2026_05.md` — 5-country premium-dossier sprint
- `scripts/ai_citation_baseline_2026_05.md` — Phase 1 baseline V2 (analytics-grounded)
- `scripts/ai_citation_audit_phase2_2026_05.md` — 5-lever audit V2
- `scripts/ai_dominance_12_month_plan_2026_05.md` — 12-month roadmap V2
- `scripts/ai_citation_quick_wins_week1_2026_05.md` — Week 1 quick wins V2
- `scripts/WIKIDATA_RUNBOOK.md` — Wikidata entity creation guide
- `scripts/PLAUSIBLE_SETUP.md` — Plausible API key + env var setup
- `/Users/daewoo/.claude/projects/-Users-daewoo-potatopedia-next/memory/project_pendencies_master_list.md` — memory pendencies (synthesis + trigger-phrase mapping)
