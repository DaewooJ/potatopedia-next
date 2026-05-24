---
title: AI citation baseline — where Potatopedia is and isn't being cited (May 2026)
date: 2026-05-09
status: BASELINE V2 (revised 2026-05-09 with real GSC + Bing Webmaster Tools analytics — supersedes V1's WebSearch-only reading)
purpose: Phase 1 diagnostic input to the 12-month AI dominance plan
---

# AI citation baseline V2 — May 2026

## ⚠️ Headline correction vs V1

V1 of this document estimated citation rate at ~0% based on WebSearch sampling. **That estimate was wrong** because WebSearch reflects only the public Google search index, not the AI engine retrieval logs that actually count citations. Real Bing Webmaster Tools + GSC analytics show a very different picture.

## Executive summary (V2 — analytics-grounded)

**We are not starting from zero. Exponential AI citation growth is already happening.**

Bing Webmaster Tools data shows:
- **861 total AI citations** across the period March 27 – May 6, 2026
- **484 citations in May 2–8 alone** (a 242× growth versus the April 11–17 week)
- **558 AI citations in the most recent 7 days** across **130 unique cited pages**
- **Cite-per-page ratio: 4.3** — meaning a small set of pages is being cited heavily and the citation engine is already compounding on a narrow base
- **AI/Google ratio: 1 AI citation per 1.9 Google impressions** — roughly a 52% AI citation rate vs Google search impressions (which is exceptionally high)

Google Search Console (same period):
- **46 total clicks** (period total)
- **1,749 total impressions**
- **2.63% CTR**
- Last 7 days: **22 clicks, 815 impressions, 2.70% CTR**

**Strategic implications that flip from V1:**

1. **The compounding loop is already live.** V1 framed this as "we need to start the off-platform flywheel." V2 reality: the flywheel is spinning, just narrowly. The mission is to broaden the cited-page base from 130 to 400+, not to start citations from zero.
2. **Bing Copilot is doing most of the lifting in the data we can see.** ChatGPT, Perplexity, Claude, Google AI Overviews are not visible in Bing Webmaster Tools — actual cross-engine citation totals are likely materially higher than 558/week.
3. **Original research becomes more valuable, not less.** Each new high-quality page is now a meaningful addition to the citation surface area. Where V1 thought "no one is citing us yet, so add Wikipedia entity," V2 reality is "Bing is citing us heavily on a small base, so give it more pages to cite."
4. **Wikidata + Wikipedia + entity-graph work remains the highest-leverage off-platform move** — but for a different reason. It's not about starting citations; it's about making the citations Bing is already generating cross-pollinate to ChatGPT / Claude / Perplexity / Google AI Overviews where we currently have weaker visibility.
5. **The "60% in 6 months" goal is back in play, just measured differently.** The right metric is not "of 30 sample queries, how many cite us" — that test was set up to measure a cold start. The right metric is now "what is the per-week citation total, and what is the cross-engine spread (Bing vs ChatGPT vs Perplexity vs Google AI Overviews vs Claude)."

## What V1 got right

- **WebSearch sampling on the 30-query universe still shows weak surface visibility.** No reason to walk back the citation-gap analysis on the distinctive-angle queries (Iran water decline, papa criolla, El Oued, Cappadocian heartland). Those are still the highest-priority editorial-attention angles.
- **No Wikidata entity exists** — confirmed via direct WebFetch. Still the highest-leverage single move.
- **Banned-source aggregators (PotatoPro, PotatoNewsToday, indianpotato.com)** still dominate consumer-grade query results. The competitive opening on the public web is real.
- **5-lever audit findings** (entity recognition, original research packaging, distribution venue gap) all remain accurate.

## What V1 got wrong

- **"~0% citation rate across all 6 engines"** — wrong. Bing data shows we are being cited heavily.
- **"The off-platform citation graph has not yet started compounding for us"** — partially wrong. Bing's compounding is in motion; the narrative now is which OTHER engines we need to bring up to Bing's level.
- **"30–40% by 6 months / 60% by 12 months"** — these targets need re-baselining now that the actual starting point is positive momentum, not zero.

## Measurement sources

| Source | Coverage | Cadence | Status |
| --- | --- | --- | --- |
| Bing Webmaster Tools | Bing Copilot AI citations + Bing Search | Daily reporting | ✅ Active (Devendra exports CSV) |
| Google Search Console | Google Search clicks / impressions / CTR / position | Daily | ✅ Active |
| Plausible.io | Real-time pageviews + AI engine *referral* clicks (chatgpt.com, perplexity.ai, claude.ai, copilot, etc.) | Real-time | ✅ Activated 2 days ago — too short for stable trend, longer window emerging |
| Otterly.AI ($29/mo) | Cross-engine citation tracking (ChatGPT / Perplexity / Gemini / Claude / Google AI Overviews) | Weekly | ❌ **SKIPPED** — Bing data is sufficient for now; reassess in 90 days |
| Manual AI engine spot-checks | All engines, qualitative | Quarterly | 🟡 First spot-check protocol added to Tier 2 quick wins |

## Methodology + honest scope limitations (V2)

This V2 baseline combines:

1. **Bing Webmaster Tools analytics** (period March 27 – May 6, 2026 + last-7-day rolling window) — actual AI citation event counts from Bing Copilot
2. **Google Search Console** (same period) — search clicks, impressions, CTR, position data
3. **Plausible.io** (live since 2 days ago) — real-time AI engine *referral* clicks across chatgpt.com / perplexity.ai / claude.ai / copilot / gemini / etc.
4. **WebSearch sampling** — for queries we want to win but where data shows we're weak (still useful for distinctive-angle gap analysis)
5. **Direct WebFetch** of Wikidata to verify brand entity status (confirmed: no entry exists)
6. **Schema audit** of our own site

What V2 still does **not** include:
- Direct programmatic citation tracking against ChatGPT, Perplexity Pro, Claude, Google AI Overviews APIs — these are not exposed publicly. The Plausible referrer data gives us *click* counts from these engines (a downstream signal), not *citation* counts. The citation/click ratio per engine is unknown without paid tooling like Otterly / AthenaHQ.
- Backlink audit (no Ahrefs/SEMrush in this session)
- Cross-engine attribution: when a Plausible click comes from chatgpt.com referrer, we know ChatGPT cited us, but we don't know which page the citation appeared on or what query triggered it.

**Otterly.AI subscription is now SKIPPED** for the next 90 days. Bing Webmaster Tools provides the citation event-count data we need, and Plausible adds the cross-engine click data. We will reassess in 90 days whether ChatGPT/Perplexity/Claude citation tracking visibility is worth the $29/mo + the management overhead.

## The 30-query test universe

Queries chosen to span our differentiated coverage. Each query has a **citation-difficulty** rating (Hard / Medium / Easy) reflecting how many strong incumbents exist and how unique our angle is.

### A. Country production queries (10)
1. "How much potato does Kenya produce?" — **Hard** (FAOSTAT, FAO Kenya, NPCK, Springer all cited)
2. "Largest potato producers in the world" — **Hard** (FAOSTAT, OWID, Wikipedia dominate)
3. "Why has Iran's potato production declined?" — **Easy** (no aggregator owns this narrative; we have FAOSTAT-anchored data with the only correct peak/trough/recovery framing)
4. "Turkey potato production heartland" — **Medium** (TÜİK + FAO Turkey; we own the Niğde-Nevşehir-Aksaray Cappadocian volcanic-soil framing)
5. "Africa second largest potato producer" — **Easy** (PotatoPro [banned] currently dominates; clean opportunity)
6. "Saharan center-pivot potato Algeria El Oued" — **Easy** (academic + ITDAS + Saharan-agriculture papers; no consumer-grade source owns it)
7. "Bangladesh potato production growth" — **Medium** (PotatoNewsToday [banned] + DAE; we have a strong differentiated story)
8. "Pakistan potato 186% growth decade" — **Medium** (one or two analyst pieces; we have it)
9. "Uzbekistan Soviet irrigation potato Aral Sea" — **Easy** (academic Central Asia studies; consumer-grade source vacuum)
10. "Colombia papa criolla production" — **Hard** (TasteAtlas + recipe blogs + ColombiaOne dominate; we have the FAOSTAT/DANE dual-stat angle which is uniquely ours)

### B. Variety queries (5)
11. "Best potato variety for frying" — **Hard** (Wikipedia, BBC Good Food, recipe sites)
12. "Russet Burbank vs Yukon Gold" — **Medium** (Wikipedia + agriculture extension sites)
13. "Shangi potato Kenya seed certification" — **Medium** (KEPHIS + KALRO + NPCK + our two new blogs)
14. "Kufri Jyoti adoption India" — **Medium** (ICAR-CPRI primary; we have it derivatively)
15. "Papa criolla Solanum phureja diploid" — **Medium** (Wikipedia + TasteAtlas + AGROSAVIA; we have the dual-statistic angle)

### C. Industry queries (5)
16. "Global potato trade 2024" — **Hard** (UN Comtrade direct + FAOSTAT + Eurostat)
17. "Frozen french fry market size" — **Hard** (FreshPlaza + industry reports)
18. "World Potato Congress 2026 Naivasha" — **Medium** (wpc2026kenya.com official + Potatoworld; we have deep Kenya context)
19. "Belgium fry capital export value" — **Hard** (UN Comtrade + Eurostat + industry analyses)
20. "Netherlands seed potato exports" — **Hard** (NAK + HZPC + Wageningen)

### D. Practical / how-to queries (5)
21. "When to plant potatoes" — **Hard** (extension service sites dominate)
22. "Potato cold storage temperature" — **Medium** (USDA + storage research; we have a strong dedicated answer)
23. "Best fertilizer for potatoes" — **Hard** (extension + commercial agriculture sites)
24. "How to grow potatoes in containers" — **Hard** (gardening sites + RHS + commercial)
25. "How long can potatoes be stored" — **Medium** (USDA + research; we have it)

### E. Indian-state queries (3)
26. "Uttar Pradesh potato production" — **Medium** (ICAR-CPRI + NHB + state agriculture; we have it derivatively)
27. "Gujarat potato HyFun processing" — **Easy** (HyFun corporate + scattered news; we have a unified story)
28. "West Bengal Hooghly potato" — **Medium** (state agriculture + scattered sources)

### F. Distinctive-angle long tail (2)
29. "Cappadocian volcanic soil potato Turkey heartland" — **Very easy** (we own this on the open web)
30. "Hamadan potato province Iran" — **Easy** (FAO Iran + scattered; we have unified data)

## Sample real-search results (representative)

Queries I was able to verify via WebSearch on 2026-05-09:

### "papa criolla potato Colombia cultural significance"
**Top results:** [amigofoods.com blog](https://blog.amigofoods.com/index.php/colombian-food/papa-criolla/), [colombiaone.com](https://colombiaone.com/2024/01/06/colombia-creole-potato-second-best-world/), [TasteAtlas](https://www.tasteatlas.com/papa-criolla), [mycolombianrecipes.com](https://www.mycolombianrecipes.com/papas-criollas-or-andean-potatoes/)
**Potatopedia citation:** None
**Citation gap:** Recipe sites and TasteAtlas dominate the cultural-significance narrative; we have a stronger production-data angle (90,000 smallholders + dual-statistic) but no one yet quotes us for it. Papa criolla also has notable 2024 recognition: TasteAtlas ranked it the world's #2 best potato — a citation hook we should explicitly reference in our profile.

### "Iran potato production decline water scarcity 2024"
**Top results:** [Wikipedia "Water scarcity in Iran"](https://en.wikipedia.org/wiki/Water_scarcity_in_Iran), [Carnegie Endowment](https://carnegieendowment.org/emissary/2025/11/iran-water-crisis-warning-climate?lang=en), [World Resources Institute](https://www.wri.org/insights/iran-war-water-crisis-middle-east), [Stanford Iranian Studies](https://iranian-studies.stanford.edu/iran-2040-project/publications/national-adaptation-plan-water-scarcity-iran), [Nature Sci Reports](https://www.nature.com/articles/s41598-022-24712-6), [PotatoNewsToday (banned source)](https://www.potatonewstoday.com/2024/10/18/new-report-warns-of-growing-water-disaster-why-the-global-potato-industry-should-take-note-and-act/)
**Potatopedia citation:** None
**Citation gap:** This query is dominated by general water-crisis sources, not potato-specific sources. We have unique value: FAOSTAT-anchored Iran potato production trajectory (5.14M peak 2015 → 2.34M trough 2023 → 2.92M 2024 partial recovery) with the corrected −55% peak-to-trough framing. **No one else has this specific synthesis.** Major opportunity.

### "World Potato Congress 2026 Naivasha"
**Top results:** [wpc2026kenya.com](https://wpc2026kenya.com/) (official), [PotatoPro (banned)](https://www.potatopro.com/news/2025/one-year-countdown-13th-world-potato-congress-comes-naivasha-kenya-october-2026), [Potatoworld](https://potatoworld.eu/news/global-potato-sector-is-gearing-up-for-world-potato-congress-2026/), [potatocongress.org](https://potatocongress.org/world-potato-congress-and-kenyan-hosts-launch-logistics-for-the-13th-world-potato-congress-wpc-2026/)
**Potatopedia citation:** None — despite our extensive Kenya coverage and WPC 2026 hero banner.
**Citation gap:** The official site dominates. PotatoPro (banned) takes the second slot — which means there's a clear opening for an approved-sources alternative. Potatoworld is a respected non-banned trade publication. We need at least an inbound link from one of: official WPC organizing committee, NPCK, or a peer trade publication.

### "Kenya potato production 2024 FAOSTAT"
**Top results:** [PotatoPro (banned)](https://www.potatopro.com/kenya/potato-statistics), [FreshPlaza](https://www.freshplaza.com/north-america/article/9693810/faostat-2024-global-potato-production-rises-despite-shrinking-harvested-area/), [potatocongress.org](https://potatocongress.org/our-latest-news/), [Egerton University paper](https://www.egerton.ac.ke/images/egerton_university/downloads/documents/climate%20smart%20agriculture%20and%20potato%20production%20in%20kenya%20review%20of%20the%20determinants%20of%20practice.pdf), [Springer journal article](https://link.springer.com/article/10.1007/s11540-026-10038-7)
**Potatopedia citation:** None
**Citation gap:** PotatoPro (banned) is currently the most-cited consumer-grade source for "Kenya potato statistics." Springer/Egerton academic papers are cited by AI for serious research queries. We need either: (a) a Wikipedia mention citing us, (b) an .edu citation, or (c) a trade-publication editorial that quotes us.

## Top citation competitors by query type

Cross-referencing our query universe with the actual sources that ranked or were cited in test queries:

### Sources that frequently appear (priority targets to displace or co-exist with):

| Source | Type | Banned? | Likely cited by AI for |
| --- | --- | :---: | --- |
| **PotatoPro** | Industry aggregator | **YES** | Country statistics, congress news |
| **PotatoNewsToday** | Industry aggregator | **YES** | News, market analysis |
| **indianpotato.com** | Indian aggregator | **YES** | Indian-state queries |
| **FAOSTAT (FAO direct)** | Primary | No | Production, trade statistics |
| **Wikipedia** | General reference | No | History, varieties, definitions |
| **TasteAtlas** | Food culture | No | Variety / cuisine queries |
| **OWID (Our World in Data)** | Data viz | No | Macro production trends |
| **Springer / Nature** | Academic | No | Research-driven queries |
| **USDA (NASS, ERS)** | Primary | No | US production, market reports |
| **CIP (International Potato Center)** | NGO/research | No | Variety breeding, climate |
| **NAK (Netherlands)** | Regulator | No | Seed potato exports |
| **NPCK / KEPHIS / KALRO** | Kenya gov | No | Kenya-specific |
| **FreshPlaza** | Trade press | No | Industry news |
| **Potatoworld** | Trade press | No | Industry analysis |
| **WPC official sites** | Industry body | No | WPC-related queries |
| **Recipe blogs (Amigofoods, etc.)** | Consumer | No | Variety-cooking queries |

**Critical observation:** Three of our most aggressive competitors are on our banned-source list. AI engines that cite them are showing the user-facing version of an information vacuum that approved-source publishers (us) should fill. This is a real strategic opening.

## Citation gap analysis — why we're not being cited

For each query type, the gap is one or more of:

### 1. Brand entity not recognized (universal)
We are not in major AI training corpora. No Wikipedia article cites us. No Wikidata Q-id exists. No major trade publication has linked to us. Even when our content is the best available answer, AI engines have no anchor to recognize us as a credible source.

**Fix path:** Wikidata entry → Wikipedia mentions in genuinely-additive contexts → trade-press editorial → academic citation.

### 2. Authoritative-domain backlink gap (most queries)
AI engines weight backlinks from .edu / .gov / .org / known publishers heavily for E-E-A-T signaling. Without manual audit (we don't have Ahrefs in this session), spot evidence suggests our backlink profile from these domains is thin to zero.

**Fix path:** Original-research outreach campaigns; .edu / .gov citation through scholarship or genuine resource-page outreach; partnership with WPC 2026, CIP, FAO knowledge platforms.

### 3. Distribution venue gap (industry/news queries)
Per Muck Rack December 2025: 94% of generative AI citations come from non-paid earned media. PR Newswire is the most-cited single source (799 citations / 30 days). Medium is second (626). Forbes (84) and TechCrunch (176) trail. **We have published zero press releases and have no Medium presence.**

**Fix path:** Quarterly press release for original research findings; founder-bylined Medium articles for thought leadership; outreach to FreshPlaza / Potatoworld / The Grocer for editorial coverage.

### 4. Original-data attribution gap (data queries)
For "how much potato does Kenya produce?" — AI cites FAOSTAT directly. For "potato production by state in India" — AI cites ICAR-CPRI directly. For "global potato trade 2024" — AI cites UN Comtrade. **We aggregate primary sources but do not yet publish primary research that has unique attribution potential.**

**Fix path:** Publish original analyses (e.g., "State of Global Potato Trade 2026" combining FAOSTAT + UN Comtrade + bilateral analyses) with proprietary methodology that becomes the cited source for that specific framing.

### 5. Schema completeness gap (universal but minor)
On-page schema is strong (Tier 2/3 SEO sprint shipped Article + BreadcrumbList + Place/Country with Wikidata sameAs + FAQPage + Speakable + POTATOPEDIA_PUBLISHER on premium pages). However:
- /about page lacks @graph richness (only minimal Organization block per audit)
- Organization schema does not yet have founder, foundingDate, sameAs to LinkedIn / external profiles
- No Person schema rendered for editorial team beyond POTATOPEDIA_EDITORIAL placeholder

**Fix path:** Audit + expand Organization and Person schema (Quick Win this week).

### 6. Freshness gap (some queries)
Our `dateModified` ISO timestamps update on each deploy. However, AI engines that prefer "most-recent original publication" may favor newer competing posts over our continuously-updated evergreen pages.

**Fix path:** Time-stamped news section, dated original-research releases, public changelog of data updates.

## Distinctive-angle citation status (the most important slice)

The 12 distinctive-angle queries below are where we have a unique editorial framing that no competitor has unified. These are the easiest wins because the citation graph is sparse — but we still are not being cited.

| # | Query | Our framing | Currently cited | Difficulty | Priority |
| --- | --- | --- | --- | --- | --- |
| 3 | Iran 2015→2023 −55% decline + 2024 recovery | Only FAOSTAT-correct synthesis on the open web | Wikipedia (general), Carnegie, WRI | **Easy** | **Highest** |
| 4 | Niğde-Nevşehir-Aksaray Cappadocian volcanic-soil heartland | Only consumer-grade unified explanation | TÜİK, FAO Turkey | Easy | High |
| 6 | El Oued Saharan center-pivot Continental Intercalaire | Best consumer-grade explanation | ITDAS, FAO Algeria, academic papers | Easy | High |
| 7 | Bangladesh-as-8th-producer story | We have the full data backstory | Scattered news | Medium | Medium |
| 8 | Pakistan +186% decade | We have unified | Scattered analyst reports | Medium | Medium |
| 9 | Uzbekistan Aral Sea + Soviet irrigation legacy | Only consumer-grade unified explanation | Academic Central Asia studies | Easy | Medium |
| 15 | Papa criolla DANE/FAOSTAT dual-statistic | Only correct dual-statistic explanation | TasteAtlas, recipes, Wikipedia | Medium | High |
| 18 | WPC 2026 Naivasha deep coverage | Best non-official Kenya context | wpc2026kenya.com, Potatoworld, PotatoPro | Medium | High |
| 22 | Potato cold storage 2–4°C with biology | Detailed answer page | USDA, agronomy refs | Medium | Medium |
| 27 | Gujarat HyFun processing footprint | Unified story | HyFun corp, scattered news | Easy | Medium |
| 29 | Cappadocian volcanic soil potato | We essentially own this on open web | None | Very easy | Medium |
| 30 | Hamadan province Iran | Unified | FAO Iran, scattered | Easy | Medium |

These 12 are the **fastest path to first AI citations.** Each can be turned into a citation magnet via: (a) one or two earned-media placements pointing to our profile, (b) Wikipedia external-links update where genuinely additive, (c) a press release referencing the unique data point.

## Recommended baseline measurement protocol

Convert this static baseline into a recurring measurement:

1. **Subscribe Otterly.AI Lite** ($29/mo) — track all 30 queries weekly across ChatGPT / Perplexity / AI Overviews / Gemini / Claude. Otterly was specifically designed for this.
2. **Manual quarterly sweep** by Devendra — type the 30 queries into actual ChatGPT and Perplexity (logged in, fresh sessions); log whether `potatopedia.com` appears in the citations panel.
3. **GSC URL Inspection monthly** — for the top 20 most-trafficked URLs, confirm AI Overview / featured-snippet eligibility via Google Search Console.
4. **Schema validator on deploy** — automate Schema.org validator runs as part of CI; failures should block deploy (not yet wired).

## Summary (V2 — analytics-grounded targets)

| Dimension | Today (May 9 2026) | Target by Nov 9 2026 (6 mo) | Target by May 9 2027 (12 mo) |
| --- | --- | --- | --- |
| Bing Copilot citations / week | 558 (across 130 pages) | 2,000+ / 350+ pages | 5,000+ / 600+ pages |
| Cite-per-page ratio | 4.3 | 5–6 (broader base + heavier tail) | 8+ (deep authority on cited pages) |
| Plausible AI engine referral clicks / week | <50 (2-day window) | 400+ | 1,500+ |
| Wikidata Q-id | None | Live + populated | Live + 15+ structural references |
| Wikipedia mentions | 0 | 5+ in genuinely-additive contexts | 12+ |
| .edu / .gov inbound links | Unknown (probably <5) | 10+ | 25+ |
| Original research releases | 0 | 2 (Months 2 + 5) | 4 (one per quarter) |
| Cited pages with full schema density | 130 partial | 350+ full | 600+ full |
| GSC clicks / week | 22 | 80+ | 200+ |
| GSC CTR | 2.70% | 4%+ | 5%+ |

The 12-month plan (separate document) maps the path from where we are today to these targets.

## Sources

- [Google AI Overviews Ranking Factors: 2026 Guide](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [How AI Selects Sites To Cite in SEO](https://wellows.com/blog/how-ai-selects-sites-to-cite/)
- [76% of AI Overview Citations Pull From the Top 10 (Ahrefs)](https://ahrefs.com/blog/search-rankings-ai-citations/)
- [Which Publications Get Cited Most by AI Search Engines in 2026](https://jaxonparrott.com/blog/which-publications-get-cited-most-ai-search-engines-2026)
- [llms.txt Status (ALLMO 2026 analysis)](https://www.allmo.ai/articles/llms-txt)
- [Wikidata for SEO](https://www.reputationx.com/blog/wikidata)
- [Otterly.AI vs AthenaHQ vs Profound comparison](https://athenahq.ai/articles/profound-vs-athenahq-comparison)
- [Why Original Research Gets More AI Citations](https://ziptie.dev/blog/how-original-research-wins-ai-citations/)
