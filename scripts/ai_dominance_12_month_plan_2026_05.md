---
title: 12-month AI citation + SEO domination plan V2 (May 2026 → May 2027) — updated with Bing analytics context
date: 2026-05-09
status: STRATEGY V2 — updated with real Bing Webmaster Tools + GSC + Plausible data; pending review for approved phases
purpose: Phase 3 deliverable — month-by-month roadmap to dominant AI citation position for potato queries
---

# 12-month AI dominance plan V2

## V2 revision summary (vs V1 from earlier today)

V1 assumed ~0% AI citation rate based on WebSearch sampling. **Real Bing Webmaster Tools data shows 558 AI citations / 130 pages in the last 7 days** with 242× growth over 4 weeks. We are not starting from zero — we are accelerating from a positive base.

**Material plan changes from V1:**

1. **Otterly.AI subscription SKIPPED for first 90 days.** Bing Webmaster Tools + Plausible.io provide the citation event-count + AI engine referral-click data. Save $87 + management overhead. Reassess Aug 2026.
2. **First original research report PULLED EARLIER from Month 3 → Month 2.** Citation surface area is the binding constraint right now, not on-platform foundation. Get more high-quality cite-able pages live faster.
3. **YouTube channel DEFERRED from Month 6 → December 2026.** Bandwidth-heavy; not the highest leverage given current trajectory.
4. **Hindi multi-language WAITS for June 22 ranking check + Bing AI citation language analysis.** If Hindi-language queries are already finding us, Hindi pages become higher priority sooner.
5. **5 new analytics-aligned items added** (Bing engine identification, deploy-citation correlation, manual cross-engine spot-checks, /ask noindex, www canonical).

## Acknowledgments before the plan begins

A senior strategist would not pretend this is a guaranteed path. Six things to acknowledge upfront:

1. **The single highest-leverage move remains a Wikidata entry + Wikipedia mention strategy.** What changed: it's no longer about *starting* AI citations (Bing has already started for us). It's about *cross-pollinating* Bing's citation flow into ChatGPT / Claude / Perplexity / Google AI Overviews where Wikidata-recognized brands have measurable citation lift (2.7× per ReputationX 2024).

2. **Original research becomes more valuable, not less, in the V2 reality.** Bing is currently citing 130 pages out of 5,024 indexed chunks (2.6%). Each additional cite-able page is now a meaningful surface-area expansion. Where V1 thought "publish to start citations," V2 says "publish to broaden the citation surface."

3. **Distribution venue gap remains the #1 missing earned-media lever.** Per Muck Rack December 2025: 94% of generative AI citations come from non-paid earned media; PR Newswire is the most-cited single source (799 citations / 30 days). We have published zero press releases.

4. **The June 22 ranking check + Bing/Plausible weekly readouts** will tell us how the trajectory is actually evolving. Decide phase intensity based on the data, not hope.

5. **Honest limit on cross-engine attribution:** Bing tells us citation events. Plausible tells us referral clicks (which engines send traffic). We can't yet see the ChatGPT / Perplexity / Claude / Google AI Overviews citation logs directly. Bridging this gap is what manual spot-checks (Tier 2 quick win) and a possible later Otterly subscription are for.

6. **AI training corpora refresh on 6–12 month cycles** for some engines. Bing Copilot is real-time-search-grounded so it sees new pages immediately. ChatGPT / Claude / Perplexity are hybrid (training corpus + live web search), so changes in training corpus appear on a longer lag. The cross-engine citation parity goal is medium-term, not immediate.

## Plan structure

5 phases × 12 months. Each phase has a primary lever, secondary lever, output deliverables, owners, expected costs, and success criteria.

| Phase | Months | Primary lever | Secondary | Budget |
| --- | --- | --- | --- | --- |
| 1. Authority foundation | 1–2 | Entity recognition | Schema completeness | $0–$50 |
| 2. Original research engine | 3–4 | Unique data packaging | Earned media | $2,500–$5,000 |
| 3. Distribution + digital PR | 5–6 | External authority | Brand entity reinforcement | $3,000–$6,000 |
| 4. Schema + technical scale | 7–9 | Freshness signals | Programmatic SEO | $0–$500 |
| 5. Compounding + measurement | 10–12 | All levers | Measurement infrastructure | $1,000–$2,000 |

Total 12-month budget envelope: **$6,500–$13,500** depending on chosen distribution intensity. This excludes Devendra's time. None of the items in this plan require paid black-hat or grey-hat link buying.

---

## Phase 1 — Months 1–2 (May–July 2026): Authority foundation

**Primary outcome:** Potatopedia becomes a recognized brand entity in machine-readable knowledge graphs. This unlocks Knowledge Panel and 2.7× AI Overview citation lift per ReputationX 2024.

### Deliverables

#### 1.1 Wikidata entity creation — Week 1
**Owner:** Devendra (manual; cannot be automated — Wikidata accounts must be human-attached)
**Effort:** 2–3 hrs initial creation + 1 hr/week monitoring for first month
**Cost:** $0
**Steps:**
1. Create a Wikidata account at wikidata.org
2. Verify no entity exists (already confirmed: none does)
3. Create new entity "Potatopedia" with these properties (Q-id will be assigned):
   - **P31 (instance of):** Q3257594 (online encyclopedia) or Q15265344 (web service)
   - **P1476 (title):** "Potatopedia"
   - **P856 (official website):** https://www.potatopedia.com
   - **P571 (inception):** 2024
   - **P127 (operator):** Devendra K Jha
   - **P407 (language of work):** Q1860 (English)
   - **P136 (genre):** Q5292 (encyclopedia), Q1417832 (knowledge base)
   - **P921 (main subject):** Q10998 (potato), Q3119121 (agricultural sector)
   - **P361 (part of):** Q15265344 (online resources for agriculture)
4. Add multiple language labels (en, es, hi, fr) for international visibility
5. Reference each claim with: official site, LinkedIn profile, GitHub if applicable
6. Submit entity for community review

**Success criteria:** Q-id assigned and live within 30 days. Entity discoverable via wikidata.org/wiki/Q-id and via SPARQL queries.

**Risks:** Wikidata community may delete entries that don't meet notability standards. Mitigation: follow [Wikidata:Notability](https://www.wikidata.org/wiki/Wikidata:Notability) — Potatopedia likely qualifies under "is part of a structural need" if we can demonstrate significant external coverage. Alternative: start with sister-property linking via existing subject entities (Q10998 = potato).

#### 1.2 Organization + Person schema expansion — Week 1
**Owner:** Claude Code (automated)
**Effort:** 2 hrs
**Cost:** $0
**Tasks:**
1. Audit current Organization schema (currently minimal on /about, full @graph on homepage)
2. Add Organization JSON-LD to /about with full @graph including:
   - founder (Person with sameAs to Devendra's LinkedIn)
   - foundingDate ("2024-03")
   - foundingLocation (India / city)
   - sameAs array including: LinkedIn, Twitter/X, GitHub, Crunchbase if applicable
   - knowsAbout array of subject Q-ids (potato, agriculture, varieties, FAOSTAT)
3. Create Person profile pages at /about/team/[slug] for editorial team members with sameAs to LinkedIn / academic profiles
4. Wire Person schema into existing `articleAuthorBlock` so every Article schema references a verified Person entity
5. Add `isPartOf` references on knowledge / answer / variety pages back to the WebSite entity

**Success criteria:** Google Rich Results Test passes with Organization, Person, WebSite, and Article entities all linked via @id references.

#### 1.3 Otterly.AI subscription — **SKIPPED in V2**
**Decision:** Skip for the first 90 days. Bing Webmaster Tools + Plausible.io + manual quarterly spot-checks provide sufficient measurement coverage. Reassess August 2026 once cross-engine citation parity becomes a measurable bottleneck.
**Replacement coverage:** see Phase 1.6 (Bing citation engine identification) and Phase 1.7 (manual cross-engine spot-check protocol).

#### 1.4 CIP / FAO / WPC partnership outreach — Weeks 2–4
**Owner:** Devendra (manual outreach; cannot be automated ethically)
**Effort:** 4–6 hrs total
**Cost:** $0
**Tasks:**
1. **CIP (International Potato Center):** Email comms@cipotato.org pitching Potatopedia as a public-facing reference complement to CIP technical resources. Offer to publicize CIP variety releases. Request reciprocal listing in CIP's external resources directory.
2. **FAO knowledge platforms:** Email FAOSTAT team and FAO knowledge management referencing our derived 2018–2024 time-series application of FAOSTAT Item 116. Pitch as a citizen-science user of FAO data. Request listing in FAO partner-resources page.
3. **World Potato Congress 2026 (NPCK + FreshCrop):** Email npck@npck.org with our deep Kenya coverage portfolio and offer pre-event content syndication. Request listing as a media partner.
4. **CPRI (ICAR-CPRI Shimla, India):** Email director@cpri.icar.gov.in with our Indian state coverage and offer reciprocal data sharing.
5. **KALRO (Kenya Agricultural and Livestock Research Org):** Same approach with Kenya-specific coverage.

**Realistic expectation:** 1–2 of these 5 will respond positively. The win is durable when it happens — .org partnership listings carry strong authority signals.

#### 1.5 Google News Publisher Center alignment — Week 2
**Owner:** Claude Code
**Effort:** 2 hrs
**Cost:** $0
**Note:** Per Google policy update April 2024, manual submission is no longer accepted. Discovery is algorithmic.
**Tasks:**
1. Verify all news-eligible content has: Article structured data, clear publication dates, author bylines (Person schema), unique URLs, responsive design
2. Add a Google News–compatible sitemap at /news-sitemap.xml for the 28 blog posts
3. Audit byline visibility on blog posts
4. Add organization-info block (per Google guidance for trustworthy news sources)

**Success criteria:** All blog posts pass Google News policy checks; news sitemap submitted via Search Console; eligibility confirmed in Search Console News tab.

#### 1.6 Bing citation engine identification + deploy-correlation analysis — Week 1–2
**Owner:** Claude Code (analysis) + Devendra (CSV exports)
**Effort:** 4 hrs
**Cost:** $0
**Tasks:**
1. Devendra exports last-90-days Bing Webmaster Tools "AI engine traffic" CSV (broken down by engine if Bing exposes that — Copilot vs Edge AI vs Microsoft Search)
2. Identify which specific Bing-family engine drives the 558 weekly citations
3. Cross-reference cited-page list with deploy timeline (Tier 2 sprint shipped 2026-05-08; M2 sprint shipped 2026-05-08; check whether citation lift correlates with specific page-class deploys: standard country FAQPage, premium dossiers, knowledge premium articles, baked answers, India state pages)
4. Produce a `scripts/bing_citation_correlation_2026_05.md` report mapping deploy → citation lift

**Why:** Tells us which content investments are actually getting cited. Informs Phase 2 research-report scope and Phase 4 programmatic-SEO emphasis.

#### 1.7 Manual cross-engine citation spot-check protocol — Week 2
**Owner:** Devendra
**Effort:** 2 hrs initial + 1 hr/quarter recurring
**Cost:** $0
**Tasks:**
1. Run the 30-query universe (from `ai_citation_baseline_2026_05.md`) manually against:
   - ChatGPT (logged-in, fresh session) — does Potatopedia appear in the citations panel?
   - Perplexity (logged-in, fresh session) — same
   - Claude (with web search enabled, fresh session) — same
   - Google AI Overviews (incognito, varying queries to avoid personalization) — same
   - Gemini — same
2. Log results to `scripts/manual_citation_spotcheck_YYYY_MM_DD.md` per quarter
3. Establish baseline; measure quarterly to track cross-engine progress against Bing citation totals

**Why:** Bing Webmaster Tools shows Bing citations only. Plausible shows AI-engine clicks but not citation events. This is the only way to measure ChatGPT / Perplexity / Claude / Google AI Overviews citation rates without paid tooling.

#### 1.8 Technical hygiene fixes — Week 1
**Owner:** Claude Code
**Effort:** 2 hrs combined
**Cost:** $0
**Tasks:**
1. **`/ask?q=` URL noindex:** the AI Q&A interface generates indexable URLs that shouldn't be indexed (low-value parameterized queries, possible content duplication). Add `<meta name="robots" content="noindex">` to the `/ask` route when a query string is present, or better, return a noindex header for parameterized URLs.
2. **www canonical + sitemap split:** Bing has both `potatopedia.com` and `www.potatopedia.com` submitted; pick `www` as canonical; verify all internal links point to www; remove non-www sitemap submission from Bing Webmaster Tools.

**Why:** Both prevent dilution of citation signal across duplicate URLs and avoid future indexing-quality penalties. Cheap, defensive, ship this week.

### Phase 1 success metrics (end of month 2 — V2 revised)

- ✅ Wikidata Q-id assigned
- ✅ Organization schema fully populated with sameAs + founder + foundingDate + Person reference
- ✅ Bing citation engine identified + deploy-correlation report written
- ✅ Manual cross-engine spot-check baseline run (30 queries × 5 engines)
- ✅ /ask?q= noindex live; www canonical + sitemap split done
- ✅ At least 1 partnership / listing achieved (or rejected with documented learning)
- ✅ Google News eligibility confirmed
- 🎯 Bing citation total: 800–1,000 / week (currently 558)
- 🎯 Cited page count: 200+ unique pages (currently 130)
- 🎯 First measurable citation appearances on ChatGPT or Perplexity (manual spot-check shows ≥3 of 30 queries cite us cross-engine)

---

## Phase 2 — Months 2–4 (June–September 2026): Original research engine [PULLED EARLIER IN V2]

**V2 change:** First research report ("State of Global Potato Trade 2026") moves from Month 3 to Month 2 (June 2026 release). Rationale: Bing citation surface area is the binding constraint right now; getting more high-quality cite-able pages live faster compounds the existing citation flywheel.

**Primary outcome:** Establish a recurring original-research publication cadence that becomes the cited source for specific framings.

### Deliverables

#### 2.1 "State of Global Potato Trade 2026" research report — **Month 2 (V2 pulled earlier)**
**Owner:** Claude Code (drafting) + Devendra (final review + branding)
**Effort:** 12–18 hrs total drafting; 4 hrs design; 2 hrs distribution
**Cost:** ~$2,500 (design $800, PR Newswire distribution $400, outreach time $1,300 if hourly attribution)

**Scope:** 30-page PDF report drawing on:
- FAOSTAT 2018–2024 production timeseries (already in `lib/faostat-timeseries.js`)
- FAOSTAT TM trade timeseries (already in module)
- UN Comtrade frozen-fry HS 2004.10 (we cite but don't own; supplement)
- Eurostat intra-EU flows
- 11 premium country deep-dives consolidated
- Original methodology: e.g., "Concentration index" measuring how export concentration has changed across the seven-year window; "Resilience score" combining yield × area stability × variety diversity

**Distribution:**
- Landing page at `/research/global-potato-trade-2026` with HTML version + PDF download + structured data (Dataset + Report schema)
- PR Newswire distribution (single-region, ~$400) for the press release
- Direct outreach to FreshPlaza, Potatoworld, The Grocer, Just-Food, Food Dive, AgriFoodNetworks, Agri-Pulse, AgFunderNews
- LinkedIn + Twitter/X founder-bylined teasers
- Submit to AgriDataHub, ResearchGate, SSRN

**Citation magnetism:** Press release will be picked up by 5–15 secondary outlets per industry average. Each quote-back to "Potatopedia State of Global Potato Trade 2026" is a citation lift.

**Success criteria:** Released in month 3, picked up by ≥3 trade publications, indexed in Google Scholar within 60 days.

#### 2.2 "Top 50 Potato Varieties Report 2026" — Month 4
**Owner:** Claude Code (drafting from existing 237-variety database) + Devendra (review)
**Effort:** 8–12 hrs (lighter — much of the data is already in `lib/varieties-data.js`)
**Cost:** ~$1,500

**Scope:** 25-page report covering:
- Top 50 varieties by global cultivated area
- Methodology: "Adoption index" combining cultivated-area share + breeding-program endorsements + commercial-availability score
- Regional breakdowns: Western Europe, North America, South Asia, East Asia, Latin America, Sub-Saharan Africa
- Comparison tables (yield, dormancy, disease resistance, end use)

**Distribution:** Same channels as 2.1 plus variety-trial mailing lists.

**Success criteria:** Released in month 4, picked up by ≥2 trade publications, generates 3+ academic citations within 6 months.

#### 2.3 Free CSV data exports — Month 3
**Owner:** Claude Code (automated)
**Effort:** 3 hrs
**Cost:** $0
**Tasks:**
1. Create `/data/production-timeseries.csv` (auto-generated from `lib/faostat-timeseries.js`)
2. Create `/data/varieties-database.csv` (auto-generated from `lib/varieties-data.js`)
3. Create `/data/country-profiles-summary.csv` (auto-generated from `lib/data.js#COUNTRIES`)
4. Add Dataset schema for each CSV with `temporalCoverage`, `license`, `creator`, `distribution`
5. Add a `/data` index page explaining licensing, citation format, and how researchers should attribute Potatopedia
6. Recommend citation: "Potatopedia (2026). Global Potato Production Time Series 2018–2024. https://www.potatopedia.com/data/"

**Why this matters:** Researchers cite the source they downloaded from. Open data exports compound citations slowly but durably.

#### 2.4 Trade Flow Visualizer deployment — Month 4
**Owner:** Claude Code
**Effort:** 16–24 hrs
**Cost:** $0
**Tasks:**
1. Build interactive trade-flow visualization at `/tools/trade-flow-visualizer` using FAOSTAT TM data already in `lib/faostat-timeseries.js`
2. Stack: Next.js client component + a lightweight chart library (Observable Plot or D3)
3. Sankey or chord diagram showing top exporters → top importers per year
4. Year slider 2018–2024
5. CSV export of any selected slice
6. Embed-friendly with iframe support (drives external embeds → backlinks)

**Citation magnetism:** Interactive tools get cited by trade publications and embedded by analysts. Bloomberg-style dataviz tools generate disproportionate inbound traffic + backlinks.

#### 2.5 Original photography / imagery program — Month 4 (low-priority follow-on)
**Owner:** Devendra (on-the-ground in India / Kenya during travel) + Claude Code (alt-text, schema, image-sitemap)
**Effort:** Variable
**Cost:** $0–$500 (if commissioning a freelancer for variety photography)
**Tasks:**
1. Commission or capture 30–50 original photographs covering: varieties, country production landscapes (India, Kenya), processors, cold-storage facilities
2. Each photo gets: structured ImageObject schema, alt text, geo-tag, filename SEO, image sitemap
3. License each as CC-BY-SA 4.0 to encourage reuse with attribution

**Citation magnetism:** Image search citations (Google Images, AI multi-modal) compound long-term and are difficult for competitors to displace.

### Phase 2 success metrics (end of month 4)

- ✅ 2 original research reports published with PDF + landing page + Dataset schema
- ✅ Trade Flow Visualizer live and embeddable
- ✅ Free CSV exports live with citation guidance
- ✅ ≥5 secondary trade publication pickups across both releases
- 🎯 Citation rate target: 10–15% of 30-query universe by end of month 4

---

## Phase 3 — Months 5–6 (September–November 2026): Distribution + digital PR

**Primary outcome:** Establish recurring earned-media presence and thought-leadership cadence. Convert original research from Phase 2 into compounding citation engine.

### Deliverables

#### 3.1 Quarterly press release cadence — Months 5, 8, 11
**Owner:** Devendra (relationship management) + Claude Code (drafting)
**Effort:** 4 hrs/release
**Cost:** ~$400/release × 4 = $1,600/year (PR Newswire single-region) — included in research report budgets above

#### 3.2 LinkedIn thought-leadership cadence — Continuous from Month 5
**Owner:** Devendra (founder voice; cannot be automated authentically)
**Effort:** 30–60 min/week
**Cost:** $0
**Cadence:** 1–2 posts/week minimum
**Content mix:**
- Original-research insights from quarterly reports (each report → 8–12 derivative posts)
- Distinctive-angle commentary (Iran water decline, papa criolla story, El Oued, Cappadocian heartland)
- Industry news commentary linked to our deeper coverage
- Country profile launches and updates
- WPC 2026 ramp-up coverage

**Success criteria:** 500+ followers within 6 months; 5%+ post engagement; recurring inbound from journalists / researchers.

#### 3.3 Trade-press media list — Month 5
**Owner:** Devendra
**Effort:** 4 hrs to build, 2 hrs/month to maintain
**Cost:** $0–$300 (optional Muck Rack / Cision database access)
**Targets:** Build a 50–80-contact media list across:
- FreshPlaza, Potatoworld, Just-Food, Food Dive, FoodNavigator, The Grocer (UK), Agri-Pulse, AgFunderNews, AgriFoodNetworks
- Reuters Agriculture, Bloomberg Agriculture (long-shot but achievable for original research)
- Indian: AgriBusiness India, Hindu BusinessLine Agri, BusinessLine.com
- Kenya: Daily Nation Business, The Standard Business, Capital FM Business

#### 3.4 Academic + research outreach — Month 5–6
**Owner:** Devendra
**Effort:** 6 hrs/month
**Cost:** $0
**Targets:** Build a 30-contact list of:
- USDA NASS / ERS researchers
- CIP scientists (CIP Lima HQ + regional offices)
- ICAR-CPRI faculty (Shimla, India)
- KALRO scientists (Kenya)
- Wageningen University agricultural economics
- Springer / Elsevier potato journal reviewers (Potato Research, American Journal of Potato Research)

Pitch: free data access to our timeseries, willingness to co-author, willingness to provide derivative analysis for their publications. Researchers cite the source they used.

#### 3.5 YouTube channel launch — **DEFERRED to December 2026 (V2 decision)**
**Decision:** Bandwidth-heavy; not the highest leverage given current Bing citation trajectory. Reactivate consideration in December 2026 if (a) Phase 2 research-report cadence is sustainable, (b) Phase 3 LinkedIn cadence is established, and (c) we have the editorial bandwidth for a sustained 2-video/month commitment.

#### 3.6 Podcast outreach — Month 6
**Owner:** Devendra
**Effort:** 4 hrs/month
**Cost:** $0
**Targets:** Pitch founder appearances on:
- Real Agriculture (US)
- The Daily Special with Mike Knepper (food industry)
- AgriTalk Radio
- Market Journal (Nebraska Public Media — agriculture)
- Indian: The Andersons Inbound, Agri Talk India
- Kenya: Mkulima Talk

### Phase 3 success metrics (end of month 6)

- ✅ Press release distributed in month 5 with ≥3 secondary pickups
- ✅ LinkedIn cadence sustained at 1–2 posts/week with 500+ followers
- ✅ ≥3 trade-press editorial mentions secured
- ✅ ≥5 academic / research-program contacts established
- 🎯 Citation rate target: 25–35% of 30-query universe by end of month 6 (mid-plan checkpoint)

---

## Phase 4 — Months 7–9 (November 2026 – February 2027): Schema + technical scale

**Primary outcome:** Sustainable technical foundation as the site scales past 1,000 pages. Programmatic SEO compounds the work from prior phases.

### Deliverables

#### 4.1 Sitemap segmentation — Month 7
**Owner:** Claude Code
**Effort:** 4 hrs
**Cost:** $0
**Tasks:**
1. Split sitemap.xml into segment files: countries-sitemap.xml, varieties-sitemap.xml, knowledge-sitemap.xml, answers-sitemap.xml, blog-sitemap.xml, news-sitemap.xml
2. Create sitemap-index.xml referencing all segments
3. Submit each sitemap separately in Search Console for granular indexing visibility

#### 4.2 News sitemap — Month 7 (already in Phase 1.5, formalize here)
**Owner:** Claude Code
**Effort:** 1 hr
**Cost:** $0

#### 4.3 Lighthouse 100/100 sweep — Month 7
**Owner:** Claude Code + Devendra (validation)
**Effort:** 8–12 hrs
**Cost:** $0
**Tasks:**
1. Run Lighthouse against 6 representative URLs (homepage, country profile premium, country profile standard, variety page, knowledge article, blog post)
2. Identify Core Web Vitals issues (INP, LCP, CLS)
3. Fix top 5 highest-impact issues — likely: image optimization, font loading, render-blocking JS

**Target:** INP < 100ms on mobile (per Phase 4.3 of original brief).

#### 4.4 Hindi multi-language strategy — Month 8 (decision point — V2 expanded criteria)
**Owner:** Claude Code (build) + Devendra (translation review)
**Effort:** 30+ hrs if executed
**Cost:** $1,000–$3,000 (translation services if not Devendra-internal)
**Decision criteria (V2):**
- If June 22 ranking check shows India queries dominant in traffic share **AND**
- Bing AI citation language analysis (from Phase 1.6 data) shows Hindi-language queries already finding us **AND**
- Plausible referrer data shows Indian-language sources driving meaningful clicks
→ Proceed with Hindi versions of top 50 pages
- Otherwise defer to year 2

#### 4.5 Programmatic SEO at scale — Months 8–9
**Owner:** Claude Code
**Effort:** 20–40 hrs
**Cost:** $0
**Scope:** Generate long-tail pages at scale via approved programmatic SEO patterns:
- Variety × Country pages: e.g., `/variety/spunta/algeria` (Spunta cultivation in Algeria) — 237 varieties × 30 countries × adoption signal = 1,000–2,000 net new pages where signal exists
- Year-by-year country snapshots: `/country/india/year/2024` (already implicit; make explicit for time-series queries)
- Comparative pages: `/compare/india-china` (already exists for varieties — replicate for countries)

**Quality gate:** Each page must pass a "minimum information gain" check — does it contain ≥150 words of unique synthesis vs the parent pages? If not, skip.

**Anti-pattern:** Do not generate doorway pages with thin auto-content. Google explicitly penalizes this. Every programmatic page must have a citation-worthy unique synthesis.

#### 4.6 Voice search audit — Month 9
**Owner:** Claude Code
**Effort:** 4 hrs
**Cost:** $0
**Tasks:**
1. Audit Speakable schema coverage (already shipped on premium pages)
2. Test top 30 voice queries against Siri / Google Assistant / Alexa
3. Optimize answer format to match voice-friendly sentence structure (short, declarative, citation-stamped)

#### 4.7 Apple Spotlight + Siri optimization — Month 9
**Owner:** Claude Code
**Effort:** 2 hrs
**Cost:** $0
**Tasks:**
1. Add `apple-touch-icon` variants (already exists)
2. Verify `og:image` and `og:description` for Spotlight ingestion
3. Add `apple-mobile-web-app-capable` and related meta tags
4. Test Spotlight indexing on iOS device

### Phase 4 success metrics (end of month 9)

- ✅ Sitemap segmented; all segments indexed in Search Console
- ✅ Lighthouse 90+ across 6 representative URLs; INP <100ms mobile
- ✅ Programmatic-SEO pages: net 500–1,000 new high-signal pages
- ✅ Hindi decision made and either executed or formally deferred to year 2
- 🎯 Citation rate target: 40–50% of 30-query universe by end of month 9

---

## Phase 5 — Months 10–12 (February–May 2027): Compounding + measurement

**Primary outcome:** Recurring publication cadence is in place. Measurement is automated. The system compounds without ad-hoc effort.

### Deliverables

#### 5.1 Annual research-report repeats — Month 10
**Owner:** Claude Code + Devendra
**Effort:** 8 hrs (less than first edition because methodology + data pipeline already built)
**Cost:** $400 distribution × 1 = $400 (additional reports under existing budget)
**Tasks:** Re-run "State of Global Potato Trade 2026" with 2025 data → "State of Global Potato Trade 2027". Annual cadence becomes the cited source year-over-year.

#### 5.2 Citation tracking dashboard — Month 10
**Owner:** Claude Code (build) + Otterly.AI feed
**Effort:** 6 hrs
**Cost:** $0 (Otterly already paid)
**Tasks:**
1. Pull Otterly.AI weekly data via API
2. Build internal dashboard at `/internal/ai-citation-tracker` (auth-protected)
3. Track per-query citation rate, per-engine breakdown, MoM trend
4. Slack / email alerts when citation rate drops or new citation appears

#### 5.3 A/B test schema variants — Month 11
**Owner:** Claude Code
**Effort:** 4 hrs
**Cost:** $0
**Hypothesis tests:**
- Does adding `Reviewed by [Person]` microcopy + reviewer Person schema lift AI citation rate? Half of premium country pages get it; half don't. Measure via Otterly.
- Does linking Article to Dataset schema (sourceData) lift citation? Same A/B.
- Does Speakable cssSelector targeting lift voice-engine citation? Same A/B.

#### 5.4 Backlink portfolio measurement — Month 11
**Owner:** Devendra
**Effort:** 4 hrs
**Cost:** $0–$99 (Ahrefs Lite free tier or one-time $99 audit)
**Tasks:**
1. Pull Ahrefs / SEMrush / Moz Link Explorer free-tier data
2. Catalog all known backlinks
3. Categorize: .edu / .gov / .org / commercial / blog / forum
4. Identify outliers worth amplifying

#### 5.5 Outreach refresh + relationship cultivation — Month 12
**Owner:** Devendra
**Effort:** 8 hrs across the month
**Cost:** $0
**Tasks:**
1. Re-engage with all Phase 1 partnership contacts (CIP, FAO, WPC, CPRI, KALRO)
2. Pitch year-2 collaborations (joint research, co-authored briefs)
3. Send "year-end review" newsletter to media list with most-shared insights from Year 1

### Phase 5 success metrics (end of month 12)

- ✅ Year-2 research report (annual cadence established)
- ✅ Citation tracking dashboard live with weekly data
- ✅ ≥1 schema A/B test concluded
- ✅ Documented backlink portfolio
- 🎯 Citation rate target: 50–60% of 30-query universe by end of month 12 — meeting the 60%-by-6-months goal restated as 60%-by-12-months given realistic AI training corpus refresh cycles

---

## Cost summary

| Phase | Months | Cost range | Annualized |
| --- | --- | --- | --- |
| 1 | 1–2 | $58–$108 | (Otterly $29/mo × 2) |
| 2 | 3–4 | $2,500–$4,500 | (research reports + design + distribution) |
| 3 | 5–6 | $1,500–$3,000 | (PR Newswire + optional YouTube setup) |
| 4 | 7–9 | $0–$3,000 | (Hindi decision-dependent) |
| 5 | 10–12 | $1,000–$2,000 | (annual report + Ahrefs audit) |
| **Total** | **12 mo** | **$5,058–$12,608** | (Otterly is recurring; rest is one-time) |

This excludes Devendra's time. Estimating ~10–15 hrs/week sustained effort across the 12 months (varying by phase — heavier in Phases 2 + 3).

## Honest expectations on timeline

AI training corpora refresh on roughly 6–12 month cycles. Even with strong off-platform investment beginning month 1, the citation rate trajectory should be:

| Month | Realistic citation rate (30-query universe) |
| --- | --- |
| 0 (today) | ~0% |
| 3 | 5–10% (early signals from Wikidata + first research report) |
| 6 | 25–35% (compounding from Phases 1–2 + first earned media) |
| 9 | 40–50% (programmatic scale + recurring research) |
| 12 | 50–60% (annual cadence established + measurement compounding) |

The original goal of "60%+ by 6 months" is aggressive given training-corpus refresh dynamics. **Target 30–40% by 6 months and 60% by 12 months** is more honest. The first half is foundation-laying; the second half compounds.

## Anti-patterns to avoid

These will damage the program if introduced:

- **Buying backlinks on PBNs / link farms.** Easy short-term lift, devastating long-term penalty. Do not.
- **Wikipedia link-stuffing.** Wikipedia editors actively patrol for self-promotion. Adding our links to articles where we are not genuinely the best source will result in deletions and possible IP/account bans.
- **AI-generated thin content at scale.** Would dilute our distinctive editorial voice. Programmatic SEO must include unique synthesis, not just template-fill.
- **Banned-source citations.** Our policy excludes PotatoPro / PotatoNewsToday / indianpotato.com. If we citizen-link to them, AI engines may downgrade our trust score by association.
- **Over-distribution to low-quality outlets.** PR Newswire pickups by syndication mills don't count as authoritative citations. Quality of placement >> quantity.
- **Promising what we cannot deliver.** A "60% in 6 months" goal sets up disappointment. Better to under-promise and deliver 35% with strong trajectory than to chase a number and burn out the team.

## Pacing checkpoints

- **Month 1 (June 2026):** Wikidata entity submitted; Organization schema expanded; Otterly.AI live. Target: 5%+ citation rate.
- **Month 3 (August 2026):** First research report published; Trade Flow Visualizer live; CSV exports public. Target: 10–15%.
- **Month 6 (November 2026):** Two research reports published; LinkedIn cadence sustained; ≥3 trade-press mentions. Target: 25–35%. **Mid-plan re-evaluation.**
- **Month 9 (February 2027):** Programmatic SEO scale; Lighthouse 90+ across reps; Hindi decision made. Target: 40–50%.
- **Month 12 (May 2027):** Annual cadence established; measurement automated; citation tracking dashboard live. Target: 50–60%.

## Sources

- [Wikidata for SEO (ReputationX 2024 study)](https://www.reputationx.com/blog/wikidata)
- [Brand Mentions vs. Backlinks 2026](https://neuronwriter.com/brand-mentions-vs-backlinks-ai-citations-2026/)
- [Why Original Research Gets More AI Citations](https://ziptie.dev/blog/how-original-research-wins-ai-citations/)
- [Which Publications Get Cited Most by AI 2026 (Muck Rack December 2025)](https://jaxonparrott.com/blog/which-publications-get-cited-most-ai-search-engines-2026)
- [Google AI Overviews Ranking Factors 2026](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [Otterly.AI / AthenaHQ / Profound comparison](https://athenahq.ai/articles/profound-vs-athenahq-comparison)
- [Wikidata Notability guidelines](https://www.wikidata.org/wiki/Wikidata:Notability)
