# Potatopedia Country Page Template — Design Spec

**Date:** 2026-04-27
**Status:** Spec finalized; India prototype shipped as proof of concept.

---

## 1 · Design philosophy

**Pattern: "Country Intelligence Dossier."** A hybrid of:
- **CIA World Factbook** structured-section discipline (every country answers the same set of questions in the same order — predictable for power users)
- **Bloomberg Terminal** data density (large numbers prominent, comparisons explicit, sparkline-style horizontal bars for share visuals)
- **Premium agricultural-research magazine** typography (Poppins for prose; tabular numerals for stats; restrained brand-red accents)
- **Potatopedia AI differentiator** — kept as one prominent, well-placed widget rather than the whole page

Knowledge articles answer "**explain X to me in 2,500 words.**" Country pages answer "**give me the numbers, structure, and players for this country in scannable, exportable form.**" The two layouts must look and feel different on first impression.

---

## 2 · User intent

A country page visitor is one of:
- **Trader** — sourcing decisions; wants production volumes, export partners, prices, processing capacity, contact-able companies.
- **Researcher / journalist** — facts and citations; wants stat tables, source attributions, comparable peers.
- **Policy / investment** — sectoral analysis; wants production breakdown by state, growth trajectory, processing-vs-fresh share.
- **Farmer / agronomist** — variety adoption, growing seasons, regional zones.

**None of these users want to read a 2,500-word essay.** They want to **scan**, **compare**, and **export**. That mandate determines every design decision below.

---

## 3 · Section-by-section spec (in render order)

### S1 · Executive Summary Banner
- **Replaces** the knowledge-article breadcrumb + tag + H1 pattern.
- Flag (large, 80px), country name (large H1), headline tagline ("World's #2 potato producer · 60.14 M tonnes · Uttar Pradesh leads at 33.5% of national output").
- **Top-right of banner:** primary "Download PDF Report" button + breadcrumb link back to /countries.
- **No definitive-answer prose box** (knowledge articles have one; country pages are data-first).
- **SEO target:** "[country] potato industry", "potato production in [country]"
- **Word count:** ~30 words (just the tagline)

### S2 · Vital Statistics Dashboard
- **8-cell grid** (not 4-cell strip like knowledge articles): Production, Harvested Area, Yield, Per-Capita Consumption, Global Rank, % of Global Production, Year-over-Year Change, vs World Average.
- Each cell: large monospace number + small uppercase label + (where relevant) a **±delta chip** showing change vs previous year or peer.
- Background: subtle dark slate (`#0F1115` or near-black) with white text — visually distinct from knowledge-article stat strip which is also dark but has only 4 cells in a single row.
- Has a dedicated `data-summary="true"` block above it for AI crawler extraction.
- **SEO:** numerical Q&A queries ("how many potatoes does India produce")
- **AI crawler value:** the data-summary block is the canonical 60-word stat block; AI chatbots can cite this directly.

### S3 · Quick Facts Strip
- 4–6 bulleted "did-you-know" stats, each phrased as a single comparison sentence:
  - "Uttar Pradesh alone produces more potatoes than Germany"
  - "85% of India's crop is grown during the rabi (winter) season"
  - "India's frozen French fry exports grew 30.9% in 2024"
- Visually: pill-style cards on light gray background.
- **SEO:** captures long-tail comparison queries.

### S4 · Production Geography
- **Top states table** with: state, production (M tonnes), % of national, growing season.
- **Horizontal share bars** next to each row (a thin red bar showing the % share visually, like a Bloomberg "% of total" bar).
- **AI inline CTA:** "Want details on a specific state's potato production? → Ask AI"
- **SEO:** "potato production by state in India", "biggest potato state India"

### S5 · Variety Portfolio
- **Variety table:** name (linked to knowledge article where possible), year released, type (table/processing), key states, yield, dry matter %.
- Top 3 rows highlighted with subtle red tint (matching knowledge-article convention so the brand is consistent).
- Cross-link to `/knowledge/kufri-potato-varieties-india` and other variety articles.
- **SEO:** "kufri varieties India", "best potato varieties for [country]"

### S6 · Trade Profile
- **Two-column data layout:** exports left, imports right. Top trade partners + product categories.
- Trajectory callout: "Frozen French fry exports: 2015 → 5,000 t · 2024 → 268,342 t (54× growth)".
- **SEO:** "[country] potato exports", "frozen french fry exports India"

### S7 · Industry & Processing
- Company table: company, brand(s), product category, key facility location.
- Processing-share narrative ("7% of India's crop is processed, vs 60%+ in the US — major growth headroom").
- **SEO:** "potato chip companies India", "[country] potato processors"

### S8 · Growing Calendar & Agro-Climatic Zones
- Compact table: zone/season, planting window, harvest window, dominant states.
- **SEO:** "when is potato planted in India", "rabi vs kharif potato"

### S9 · AI Explorer Block (Primary AI CTA)
- Distinct full-width module: dark gradient background, large heading "Ask Anything About India's Potato Industry", input box, 4 suggested-question chips ("What's the yield gap vs China?", "Top processors in Gujarat", "Which Kufri variety should I plant in Punjab?", "India's seed certification system").
- Positioned **between Section S8 and Section S10** — i.e. after the user has read all the static facts, the AI prompt is positioned as the natural "go deeper" tool.
- **Mobile:** sticky bottom bar with "Ask AI" button at all times for thumb access.
- **AI integration:** posts to `/ask` with country pre-filter, opens streaming response inline.

### S10 · Comparable Countries
- 4-card grid: regional/economic peers (for India: China, Bangladesh, Pakistan, Indonesia).
- Each card: flag, name, production, yield, "→ View Profile" link.
- Less prominent than knowledge-article "Continue Reading" block — this is for cross-country navigation, not topical reading.

### S11 · Related Knowledge & Sources
- Compact 2-column grid: "Related Articles" (2-4 knowledge articles) + "Sources" (citation list).
- More restrained than knowledge-article "Continue Reading" component.

### S12 · Print/PDF mode (hidden in normal view, shown when printing)
- A `@media print` stylesheet that:
  - Hides navigation, footer, AI explorer block, "Download PDF" button itself
  - Repaints the layout to A4 with proper margins
  - Adds page-number footer via CSS `@page` rules
  - Adds "Generated from potatopedia.com · [date]" header
  - Forces all collapsible sections to expanded state

---

## 4 · Hero design — how it differs from knowledge articles

| Element | Knowledge articles | Country pages |
|---|---|---|
| Top of page | Breadcrumb + Tag badge + meta (read time, date) | Flag + country name + global rank pill + "Download PDF" button |
| H1 | Long question-based ("Why Were Potatoes Illegal in France?") | Country name only ("India") |
| Sub-hero | DefinitiveAnswer prose box (60 words) | Headline tagline (one sentence with key stat) |
| Stat strip | 4 stats, one row, dark | 8 stats, 4×2 grid, dark slate, with delta chips |
| Visual identity | Gridded paper background | Subtle topographic / gradient with country accent |
| Content type | Narrative essay | Scannable dossier |

---

## 5 · Data presentation philosophy

- **Numbers in monospace tabular figures** (`font-variant-numeric: tabular-nums`) so they line up cleanly in tables and stat cells.
- **Horizontal share bars** instead of pie charts — a thin colored bar showing % of total, sitting in the right column of a table row. Works perfectly in HTML, prints cleanly to PDF, and is a Bloomberg/OEC convention that signals "data product."
- **Delta chips** (`▲ +1.85%` in green, `▼ −2.3%` in red) on stats where year-over-year matters.
- **No charts that need JS to render.** Keep everything as `<table>` + CSS bars. Crawlable, printable, AI-extractable.

---

## 6 · AI CTA placement strategy

Three placements with deliberate role separation:
1. **Primary (S9):** dedicated AI Explorer block, full-width, with 4 suggested questions. The destination CTA, after the user has consumed the static dossier.
2. **Inline (within S4 / S5 / S7):** soft single-line "Ask AI →" link, contextual ("More on a specific state? Ask AI").
3. **Mobile sticky:** bottom bar always visible with "Ask AI" button — always one tap away regardless of scroll position.

The hero does NOT include an AI CTA. We want users to first get the data, then engage AI for follow-up questions. AI is the "after-data" experience, not the primary content.

---

## 7 · Content tiers (page depth varies by country importance)

| Tier | Countries | Required sections | Rationale |
|---|---|---|---|
| **Tier 1 — Major Players** | India, China, USA, Belgium, Netherlands | All 11 sections (S1–S11), full data + 4–6 quick facts + 5+ varieties + 3+ companies | These pages must rank against established competitors |
| **Tier 2 — Strategic** | Germany, France, UK, Peru, Russia, Bangladesh, Japan, Canada | S1–S11 with reduced depth (3–4 quick facts, 3–4 varieties) | Substantial pages but less data-rich |
| **Tier 3 — Long-Tail** | Algeria, Colombia, Iran, Kenya, Mexico, Australia, Nepal, Indonesia, etc. | S1, S2, S5 (varieties only if data exists), S9, S10, S11 | Minimal viable depth; rely more on AI Q&A |

This is a **template-flexible** approach: same component, different depth driven by data availability per country. The same React component renders all 30 — a `country.tier` field in `lib/data.js` controls which sections appear.

---

## 8 · PDF download feature

### Approach selected: **`window.print()` with a comprehensive `@media print` stylesheet** plus optional html2pdf.js fallback.

**Why `window.print()` rather than html2pdf.js or react-pdf:**
- Native, zero-bundle-cost (no library load on every page view)
- PDF text remains **selectable** (html2pdf.js produces image-based PDFs)
- Browsers' print engine produces professional A4/Letter output across Chrome, Safari, Firefox, Edge
- Works on mobile (iOS Safari and Chrome Android both have "Save as PDF" in print dialog)
- CSS `@page` rules give us page numbers, margins, headers, footers
- Future-proof; works with any future content

### Button placement
- **Primary:** in the Executive Summary Banner (top right, beside breadcrumb) — visible immediately on every visit.
- **Secondary:** in the footer area below S11 (after the user has scrolled the full report) — a wider button labeled "Download Full Report (PDF)".
- **Mobile:** the secondary button only (the primary is hidden on screens <768 px to keep the banner clean).

### Print stylesheet specifics

```css
@media print {
  /* Hide non-printable */
  nav, footer, .pp-ai-explorer, .pp-ai-inline-cta,
  .pp-pdf-button, .pp-mobile-sticky-ai, .pp-related-countries { display: none !important; }

  /* A4 page setup */
  @page { size: A4; margin: 2cm 2cm 2.5cm 2cm; }
  @page { @bottom-center { content: "Page " counter(page) " of " counter(pages); ... } }

  /* Header on every printed page */
  .pp-print-header { display: block !important; position: running(page-header); ... }

  /* Force-show collapsibles */
  details { display: block !important; }
  details > summary { display: block; font-weight: 700; margin-bottom: 8px; }

  /* Text-color and table sanity */
  body { color: #000; background: #fff; font-size: 11pt; }
  table { page-break-inside: avoid; }
  h2 { page-break-after: avoid; }
}
```

### PDF content
- ✅ Executive Summary, Vital Stats, Quick Facts, all data tables, sources block
- ✅ Branded header per page: "Potatopedia · [Country] Potato Industry Profile · Generated [Date]"
- ✅ Page numbers via `@page` counter
- ❌ No nav, no site footer, no AI Explorer, no AI inline CTAs, no Comparable Countries cards (these would be decorative in a print report)

---

## 9 · Internal linking strategy

| From → To | Why |
|---|---|
| Country → variety knowledge articles | "Want more on Kufri Pukhraj? Read the full Kufri varieties guide →" |
| Country → answer pages | Country-specific Q&A ("Which state grows the most potatoes in India?") |
| Country → other countries | Trade-partner cards, regional peer cards |
| Country → top-level knowledge | Production rankings, trade, processing — broad context |
| Country sources | Outbound to authoritative external (FAOSTAT, ICAR-CPRI, PIB, APEDA) |

Every variety name in the Variety Portfolio table is linked. Every state name in the Production Geography table is left as plain text (no state-level pages exist) but is keyword-rich so search engines see the entity.

---

## 10 · JSON-LD schema

Same approach as knowledge articles, plus a country-specific addition:

- `@type: Article` (the country profile is the article)
- `@type: BreadcrumbList`
- `@type: Country` (linked via `about`) — gives Google rich-result eligibility for country queries
- **NEW:** `@type: Dataset` for the production-statistics table (positions us in Google's Dataset Search)
- `@type: FAQPage` — optional; only if we add a FAQ section in Tier 1 pages

---

## 11 · Visual differentiation from knowledge articles (cheat sheet)

| Aspect | Knowledge | Country |
|---|---|---|
| Stat strip | 4 cells, one row | 8 cells, 4×2 grid, slate-dark, delta chips |
| Hero | Breadcrumb→Tag→H1→DefinitiveAnswer | Flag→Name→Tagline→PDF button |
| Visual rhythm | Section→prose→stat-callout→prose | Stat → table → bar chart → small prose |
| Component density | Low (article reading) | High (dashboard scanning) |
| Page width | 820 px max-width centered | Full-width data sections (1080 px max), centered prose for narrative blocks |
| Background tints | Single light gray FAQ background | Slate-dark stat dashboard, light gray quick-facts strip, white tables |
| Print/PDF mode | Not designed for printing | First-class print stylesheet, "Download PDF" button |
| Internal AI | None (static article) | AI Explorer block + inline contextual CTAs + mobile sticky |

---

## 12 · Mobile behavior

- **Stat dashboard 8-cell grid:** collapses to 4×2 on tablet, 2×4 on mobile. Each cell stays full-width readable, no shrinking-to-illegible font sizes.
- **Tables:** wrap inside `overflow-x: auto` containers — horizontal scroll on mobile rather than text-shrinking.
- **AI Explorer:** stays full-width; sticky button at screen bottom is always reachable.
- **PDF button:** hidden in banner on <768 px, shown in footer-area only — the in-banner version would crowd the title on mobile.
- **Breakpoints:** 1024 px (tablet), 768 px (mobile transition), 400 px (small mobile fallback).

---

## 13 · What this template means for the remaining 29 countries

- **Tier 1 (4 remaining: USA, China, Belgium, Netherlands)** — same depth as India prototype. Each ~3–4 hours to author given the variety/industry data we already have ingested.
- **Tier 2 (8 countries)** — same component, fewer rows in tables. Each ~2 hours.
- **Tier 3 (17–18 countries)** — minimal viable: stat dashboard + brief production paragraph + variety table + AI Explorer. Each ~1 hour.

The same React component renders all three tiers driven by data availability in `lib/data.js`. **One template, one render path, content-tiered output.**

---

## 14 · Component inventory

**New components needed (built into the country page):**
- `<ExecutiveBanner>` — flag + name + tagline + PDF button
- `<VitalStatsDashboard>` — 8-cell slate-dark grid with delta chips
- `<QuickFactsStrip>` — pill-style bullet card grid
- `<DataTable>` — table primitive with optional inline horizontal share bars
- `<TradeProfile>` — two-column export/import comparison
- `<AIExplorerBlock>` — dark gradient AI CTA with suggested-question chips
- `<ComparableCountries>` — 4-card peer grid
- `<PrintHeader>` (CSS-only, only renders in print)

**Existing components retained:**
- `<CountryAI>` — backed by streaming `/ask` API; powers the AI Explorer block input + response area. Refactored so it accepts placement props and works inside both the section and the mobile sticky bar.

---

## 15 · Summary

The country page template is a **"Country Intelligence Dossier"** with 8-cell dashboard, scannable data tables with horizontal share bars, a dedicated AI Explorer section positioned after the data, and a first-class PDF export. It is visually and functionally different from knowledge articles — knowledge articles read like long-form essays; country pages read like Bloomberg country snapshots.

India is the prototype. After deploy + measurement, USA / China / Belgium / Netherlands follow as Tier 1 Wave 1.
