---
title: 5-lever AI citation audit — current state of off-platform signals (V2 with analytics context)
date: 2026-05-09
status: AUDIT V2 — revised with Bing Webmaster Tools + GSC analytics context (V1 was based on WebSearch only)
purpose: Phase 2 input to the 12-month AI dominance plan
---

# 5-lever audit V2 — where we have signal vs where we're flat

**Headline (V2 revision):** On-page foundation is in the top quartile for our category (Tier 1+2+3 SEO sprints shipped). Bing Copilot is **already citing us heavily on a narrow base** (558 citations / 130 pages last 7 days; cite-per-page 4.3). The mission has shifted from "start the off-platform flywheel" to "**broaden the cited-page base** and bring ChatGPT / Perplexity / Claude / Google AI Overviews up to Bing's level." Three biggest gaps are unchanged: no Wikidata entity, no original research publications, no earned-media distribution. But the framing is now offensive (compound the wins) rather than defensive (start from zero).

## Lever 1 — External authority signals

Status: **Mid-low quartile (revised up from "bottom quartile" given Bing citation evidence).**

### What we know (V2 — with analytics)

- **Bing Copilot is generating citation flow** despite limited off-platform authority signals. 558 citations / 130 pages in the last 7 days. The cite-per-page ratio of 4.3 means a small set of pages is recurringly cited — likely the country profile premiums, the production rankings page, and the answer pages.
- **Backlinks from .edu / .gov / .org domains:** Unknown without Ahrefs/SEMrush. The fact that Bing is citing us suggests *some* authority signal is present — it might be content-quality + schema-density rather than backlink-driven. This needs verification.
- **Citations in academic papers:** None visible in Google Scholar / ResearchGate. (Confirmation requires manual scholar.google.com search by Devendra.)
- **Wikipedia mentions:** Zero verified. Wikidata search confirmed no entity exists. **This is now the highest-leverage lever to compound the existing Bing citation flow into ChatGPT / Claude / Perplexity / Google AI Overviews.**
- **Trade-press editorial:** No mentions found in FreshPlaza, Potatoworld, The Grocer, Just-Food, Food Dive. Banned PotatoPro / PotatoNewsToday / indianpotato.com dominate.
- **Social authority:** LinkedIn footprint exists (referenced in footer); no measurable thought-leadership cadence visible.
- **Press release distribution:** Zero releases on PR Newswire / Business Wire / GlobeNewswire.

### Why this matters most

Per Ahrefs research: 76% of Google AI Overview citations come from sources ranking in the top 10 organic results. Per ALLMO 2026 cited-URL analysis: backlink authority (especially from PR Newswire and Medium) is the single highest correlate with AI citation in 2026. **We have built the on-page asset; we have not built the distribution and authority graph that lets it compound.**

### Quantified targets (12-month)

- Wikipedia mentions: 0 → 5+ (genuinely additive, not stuffed)
- Wikidata entry: None → Live with sameAs graph
- .edu / .gov inbound: Probably <5 → 15+
- Trade-press editorial mentions: 0 → 6+ (FreshPlaza, Potatoworld, The Grocer, etc.)
- Press releases distributed: 0 → 4 (one per quarter, tied to original research releases)
- LinkedIn cadence: ~0 → 1–2 posts/week

## Lever 2 — Entity recognition

Status: **Bottom quartile.**

### Audit findings

| Asset | Current | Target |
| --- | --- | --- |
| Wikidata Q-id | **None** (verified via search) | Live, populated |
| Wikipedia article for "Potatopedia" | **None** | Either dedicated page (high bar — depends on notability) **or** mentions in 5+ existing articles |
| Knowledge Graph entity (Google) | **No Knowledge Panel** | Knowledge Panel via Wikidata pull |
| Organization schema on /about | Minimal block (no @graph, no founder, no foundingDate, no comprehensive sameAs) | Full @graph with founder + foundingDate + sameAs to all profiles |
| Person schema for editorial | `POTATOPEDIA_EDITORIAL` placeholder defined in `lib/authors.js`; rendered on premium pages | Per-author Person pages (Devendra) with sameAs to LinkedIn |
| sameAs graph density | Premium country pages have Wikidata sameAs for Country entities (Q-ids) | Same applied universally on variety pages, knowledge articles, blog posts where applicable |
| Schema.org Organization sameAs targets | Limited (LinkedIn referenced in text, not in JSON-LD) | LinkedIn, Twitter/X, GitHub, YouTube (when established), Crunchbase, Google Business Profile |

### What we already do well

- Premium country pages emit @graph with Article + BreadcrumbList + Place/Country (Wikidata sameAs) + Organization + FAQPage + Speakable. This is best-in-class for the category.
- 30 country profiles all have Place + Country + Wikidata Q-id schema (Tier 2 sprint shipped).
- 24 canonical varieties have Wikidata sameAs to Wikipedia variety entries.
- Speakable schema present site-wide on premium content.

### Why entity recognition is the single highest-leverage move

Per ReputationX 2024 study cited in 2026 SEO research: brands with verified Wikidata items are 3.2× more likely to display a Knowledge Panel and 2.7× more likely to appear in AI Overview citations. Among the levers in this audit, **Wikidata entity creation has the highest impact-per-unit-effort ratio.** It's a one-time creation, free, and unlocks the rest of the entity graph.

The Wikipedia-article path is harder (requires notability per WP:NCORP — generally needs significant independent coverage). We should not push for a dedicated Wikipedia article in Year 1; instead, focus on Wikipedia *mentions* in articles where we are genuinely additive (e.g., add Potatopedia profile reference to "Potato production by country" external links section if our coverage is the most comprehensive).

## Lever 3 — Freshness + update cadence

Status: **Mid quartile — solid technical baseline, weak strategic freshness.**

### What we have

- `dateModified` ISO timestamps render on every page (deploy-time refresh).
- `UPDATED_LONG` / `UPDATED_SHORT` constants display in headers across knowledge / answers / variety / country pages.
- M2 sprint just refreshed the foundational data layer (FAOSTAT 2018–2024 timeseries module + 6 country data corrections).

### What's weak

- **No automated freshness signals.** When we deploy a non-data change (e.g., copy edit), `dateModified` updates on every page even though content didn't change. Search engines may discount this signal once they detect the pattern.
- **No public changelog.** We don't tell readers (or AI engines) what changed when.
- **No "Last reviewed by" microcopy** beyond the `UPDATED_LONG` line. Per Google E-E-A-T guidance, "Reviewed by [Person]" with a verified credential lifts trust signal materially.
- **No time-sensitive content stream** (news, event coverage, market commentary). All our content is evergreen-positioned, which lets fresher news content outrank us on time-sensitive queries.
- **Datasets without `dateModified` per row.** Our `lib/faostat-timeseries.js` module has a header comment about source year, but no per-row update tracking. For Dataset JSON-LD freshness signaling, this matters.

### Targets

- Per-page `dateModified` driven by actual content-hash diff, not deploy timestamp.
- Public changelog at `/changelog` showing data refreshes by date.
- "Reviewed by [Person]" microcopy on premium pages (per author).
- Quarterly market commentary as time-sensitive content stream — feeds Google News + earned-media distribution.
- Dataset JSON-LD `dateModified` per dataset, automatically updated on regeneration.

## Lever 4 — Unique data / information gain

Status: **Top quartile within our category — but the asset is not yet packaged for citation.**

### What we have that competitors don't

This is the strongest dimension in the audit. Our M2 sprint just put us materially ahead of any single open-web competitor on:

| Asset | Competitive position |
| --- | --- |
| 5,024 indexed chunks across 224 sources | Largest unified potato knowledge base on open web |
| 30 country profiles + 11 premium dossiers (5–10× depth of standard country pages) | No commercial peer at this depth |
| 237 variety profiles (vs Wikipedia's ~50) | Largest open-web variety encyclopedia |
| FAOSTAT 2018–2024 time-series module covering 99 countries × 7 years × 4 trade dimensions | Open-web competitors don't structure this for re-use |
| Iran 2015 peak / 2023 trough / 2024 recovery FAOSTAT-correct narrative | Nobody else has this synthesis |
| Colombia DANE/FEDEPAPA 3.86M ↔ FAOSTAT 2.49M dual-statistic with papa criolla footnote | Nobody else explains the dual-statistic |
| El Oued Saharan center-pivot Continental Intercalaire framing | Best consumer-grade explanation |
| Niğde-Nevşehir-Aksaray Cappadocian volcanic-soil heartland | Best consumer-grade explanation |
| Uzbekistan Aral Sea + Soviet irrigation legacy framing | Best consumer-grade explanation |
| 28 blog posts + 29 knowledge articles + 83 cited answers | Significant volume of indexed long-form |

### What's missing — the citation-conversion gap

Having unique data is not enough. The data must be **packaged** in formats AI engines and journalists can cite by name:

| Format | Status | Citation potential |
| --- | --- | --- |
| Original research reports (PDF + landing page) | **None published** | Highest — these get cited by name with a stable URL |
| Annual ranking publications (e.g., "Top Potato Producing Countries 2026") | **Implicit (knowledge article)** but not branded as an annual research release | High |
| Free downloadable CSV exports of timeseries | **None** — data lives only in JS modules | Medium-high (researchers cite the source they downloaded from) |
| Interactive data tools (e.g., Trade Flow Visualizer) | **Deferred** — backend has the data now via `lib/faostat-timeseries.js` | Medium-high |
| Original photography / imagery program | **Nearly zero** — public/og-image.png exists, no per-page imagery | Medium |
| Original video content | **None** | Medium (YouTube cited in "video carousel") |
| Charts / data visualizations as standalone shareable assets | **Inline only** — no exportable chart program | Medium |
| Methodology / data dictionary documents | **Implicit only** | Medium-high |

### The single highest-value publication candidate

"State of Global Potato Trade 2026" — a 30-page PDF research report drawing on:
- Our FAOSTAT 2018–2024 time-series module (already built)
- UN Comtrade frozen-fry trade data
- Eurostat intra-EU flows
- Country-level deep dives (we already wrote the deep dives)

Released with a press release on PR Newswire ($800–$1,200 typical distribution cost), pitched to FreshPlaza / Potatoworld / The Grocer for editorial pickup, and used as a citation magnet for the next 12 months.

Cost: ~$2,500 all-in (design, distribution, outreach). Expected impact: 5–15 inbound citations per release (PR Newswire average is 8 citations per release for industry-research content).

## Lever 5 — Answer-first content structure

Status: **Top quartile — already shipped via Tier 2/3.**

We are not the bottleneck on this lever. Per the ALLMO 2026 study: 53% of cited pages are <1,000 words; structure beats length. Our content already has:

- Lead-with-answer DefinitiveAnswer blocks (Tier 2 sprint)
- Structured H2 sections aligned to PAA queries
- Inline citations with `(FAOSTAT 2024)` style attribution
- Speakable schema with `cssSelector: ["[data-summary='true']", "[data-quick-facts='true']"]`
- Quick Facts boxes
- StatCallout components for headline numbers

### Minor remaining gaps

- Some answer pages still have a thin "What" without a clear "Why" + "How". Editorial sweep could lift from 4/5 to 5/5.
- A few knowledge articles are >2,500 words without a clear TL;DR — the long form may be discounted by AI engines that prefer extractable claims.
- No "Key takeaways" bullet block on most knowledge articles (a citation-friendly pattern; AI engines often quote bullet items verbatim).

These are cosmetic. The structure is in place.

## Synthesis — where to invest

Ranking the 5 levers by current state and impact-per-effort:

| Lever | Current state | Effort to fix | Impact | Priority |
| --- | --- | --- | --- | --- |
| **2 — Entity recognition** | Bottom quartile | Low (Wikidata creation = 1–2 hrs) | Very high (3.2× Knowledge Panel, 2.7× AI Overview citation) | **#1** |
| **1 — External authority signals** | Bottom quartile | High (sustained 12-month effort) | Very high (94% of citations are non-paid earned media) | **#2** |
| **4 — Unique data packaging** | Top quartile (data) / Bottom quartile (packaging) | Medium (one report per quarter) | High | **#3** |
| **3 — Freshness signals** | Mid quartile | Low-medium | Medium | **#4** |
| **5 — Answer-first structure** | Top quartile | Low (cosmetic) | Low marginal | **#5** |

The 12-month plan (separate document) sequences these accordingly: months 1–2 attack lever 2 (entity); months 3–4 attack lever 4 (research releases); months 5–6 attack lever 1 (distribution); months 7–9 sharpen lever 3 + technical; months 10–12 compound lever 1 + 4.

## Sources

- [ALLMO 2026 LLMs.txt + AI citation analysis](https://www.allmo.ai/articles/llms-txt)
- [Wikidata for SEO (ReputationX, citing 2024 study)](https://www.reputationx.com/blog/wikidata)
- [Why Original Research Gets More AI Citations](https://ziptie.dev/blog/how-original-research-wins-ai-citations/)
- [Brand Mentions vs. Backlinks 2026 (NeuronWriter)](https://neuronwriter.com/brand-mentions-vs-backlinks-ai-citations-2026/)
- [Muck Rack December 2025: 94% of AI citations are non-paid earned media](https://jaxonparrott.com/blog/which-publications-get-cited-most-ai-search-engines-2026)
- [Otterly.AI / AthenaHQ / Profound comparison](https://athenahq.ai/articles/profound-vs-athenahq-comparison)
