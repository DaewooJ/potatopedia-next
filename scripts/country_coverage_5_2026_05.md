---
title: Country coverage premium dossiers — Turkey, Iran, Algeria, Uzbekistan, Colombia
date: 2026-05-08
status: SHIPPED
deployment: https://www.potatopedia.com (production)
---

# Country coverage premium dossiers — Turkey / Iran / Algeria / Uzbekistan / Colombia

Closes the country-coverage gap on the SEO-audit pendencies list. All 5 countries
now have premium dossiers matching the Kenya gold-standard pattern.

## What shipped

| Country | URL | H1 | Words rendered | JSON-LD blocks |
| --- | --- | --- | ---: | ---: |
| Turkey | /country/turkey | "Turkey Potato Industry: 6.5M Tonnes from the Niğde-Nevşehir-Aksaray Heartland" | 8,506 | 2 (4 schemas + FAQPage) |
| Iran | /country/iran | "Iran Potato Industry: Hamadan's Highland Hub & Water-Scarcity Decline (2.34M Tonnes)" | 7,293 | 2 |
| Algeria | /country/algeria | "Algeria Potato Industry: El Oued's Saharan Center-Pivot Revolution (5.20M Tonnes)" | 7,696 | 2 |
| Uzbekistan | /country/uzbekistan | "Uzbekistan Potato Industry: Soviet Irrigation Legacy & Central Asia's #1 Per-Capita Consumer (2.9M Tonnes)" | 7,378 | 2 |
| Colombia | /country/colombia | "Colombia Potato Industry: Andean Highlands, Papa Criolla & 90,000 Smallholders (3.86M Tonnes)" | 7,415 | 2 |

Each page renders an `@graph` script with **Article + BreadcrumbList + Country/Place
(Wikidata sameAs) + Organization (POTATOPEDIA_PUBLISHER)**, plus a separate **FAQPage**
script with 8 Q&As. The Article includes `speakable` cssSelector pointing at
`[data-summary='true']` and `[data-quick-facts='true']`.

## Architecture

Refactored shared rendering into `components/CountryProfilePremium.jsx` instead of
duplicating ~640 lines of Kenya-pattern JSX × 5. Each new country page is now
~250 lines of structured data + a one-line shell call:

```js
return <CountryProfilePremium data={data} />;
```

The component handles: hero + breadcrumb, Quick Facts box, DefinitiveAnswer block,
KeyStatStrip, TOC, Card sections (h2 + lead + body + optional table + optional
StatCallout + optional source), Sources block, FAQ accordion, regional context
cards, continue-reading cards, FurtherReading block, bottom CTA, and all JSON-LD
emission.

## Underlying data corrections (lib/data.js)

The COUNTRIES array was re-sorted by current production values:

- **Turkey** moved up to rank 10 (6.54M tonnes, was 5.0M at rank 17)
- **Iran** moved DOWN to rank 24 (2.34M tonnes, was 5.4M at rank 14) — reflects
  the dramatic 2019–2023 water-scarcity contraction (peak 5.58M tonnes 2019)
- **Algeria** highlight fixed: "Africa's #2 producer (after Egypt) — pioneer of
  Saharan center-pivot potato in El Oued" (was incorrectly "Africa's largest")
- **Colombia** updated to 3.86M (was 2.7M), moved to rank 19, with new highlight:
  "Andean highland production — 90,000 smallholders, papa criolla diploid is a
  national specialty"
- **Uzbekistan** added at rank 22 (2.9M tonnes — FAOSTAT 2022 figure; 2024
  preliminary figures pending official validation due to backend arithmetic
  inconsistency in 2024 area-yield-production reconciliation)

Sitemap.xml updated to include `uzbekistan`.

## Data flags

Each dossier includes `[DATA NEEDED]` markers where backend research did not
yield exhaustive named-source data at uniform precision. Flagged items:

- **Turkey**: precise Niğde / Nevşehir / Aksaray cold-storage tonnage; complete
  named-processor list at uniform precision
- **Iran**: precise Hamadan-province cold-storage capacity; share of area planted
  to certified seed; complete named-processor list; specific named potato-sector
  subsidy schemes
- **Algeria**: complete official variety list with production-share percentages;
  share of area planted to imported vs domestically-multiplied certified seed;
  complete named-processor list; specific named subsidy programmes
- **Uzbekistan**: 2024 preliminary production figures pending validation;
  official variety list with current production-share percentages; share of area
  planted to certified vs farm-saved seed; complete named-processor list;
  specific named subsidy schemes
- **Colombia**: precise current papa criolla export tonnage; share of area
  planted to certified vs farm-saved seed

These data flags are surfaced inline in the rendered HTML so future research
sprints can target gaps directly.

## Sources

All sources are from the project's approved-sources list (FAOSTAT, USDA, FAO
country offices, peer-reviewed research, official national statistical agencies).
No banned sources used.

Per-country source highlights:

- **Turkey**: TÜİK (Turkish Statistical Institute), Turkish Ministry of
  Agriculture and Forestry, FAO Turkey, Eurostat
- **Iran**: Statistical Centre of Iran, FAO Iran, Iranian Ministry of Agriculture
  Jihad, Iranian Meteorological Organisation, Iranian Ministry of Energy
  (water-resources monitoring for drought drivers)
- **Algeria**: ITDAS (Technical Institute for the Development of Saharan
  Agronomy), INRAA, FAO Algeria, MADR, CNCC, ONILEV
- **Uzbekistan**: State Committee on Statistics of Uzbekistan, FAO Uzbekistan,
  CACAARI (Central Asia and the Caucasus Association of Agricultural Research
  Institutions), World Bank Uzbekistan reports, ADB Central Asia reports
- **Colombia**: FEDEPAPA, AGROSAVIA, ICA, DANE, FAO Colombia, CIP

## Build / deploy verification

```
npm run build → ✓ Compiled successfully in 4.3s
                 ✓ 429 static pages prerendered
vercel --prod → ✓ Production: https://www.potatopedia.com (32s build)

curl checks (HTTP 200 + word count + JSON-LD count):
  /country/turkey      → 200, 8506 words, 2 JSON-LD blocks
  /country/iran        → 200, 7293 words, 2 JSON-LD blocks
  /country/algeria     → 200, 7696 words, 2 JSON-LD blocks
  /country/uzbekistan  → 200, 7378 words, 2 JSON-LD blocks
  /country/colombia    → 200, 7415 words, 2 JSON-LD blocks
```

Algeria schema validation (representative):
- @graph: ['Article', 'BreadcrumbList', ['Country', 'Place'], 'Organization']
- FAQPage: separate script with 8 Q&As
- Article.speakable: `{cssSelector: ["[data-summary='true']", "[data-quick-facts='true']"]}`
- Country.sameAs: `https://www.wikidata.org/wiki/Q262`

## Pendencies impact

Closes the "Country coverage gaps — Turkey, Iran, Algeria, Uzbekistan, Colombia
profiles need premium dossier treatment" item from `OTHER PENDING` in the master
pendencies list. Updated `project_pendencies_master_list.md` to remove the line
item.

## Distinctive editorial angles

Each dossier carries one country-specific differentiator card that no template
country page covers:

- **Turkey** — Card 10: "How does Turkey's Niğde-Nevşehir-Aksaray heartland
  work?" — Cappadocian volcanic-soil concentration story
- **Iran** — Card 10: "Why has Iran's potato production declined since 2019?" —
  the −58% water-scarcity / sanctions contraction story
- **Algeria** — Card 10: "How does Saharan center-pivot potato production work?"
  — the Continental Intercalaire fossil-aquifer engineering story
- **Uzbekistan** — Card 10: "How does the Soviet irrigation legacy shape
  Uzbekistan's potato sector?" — Aral Sea crisis + 20th-century engineering
  legacy
- **Colombia** — Card 5: "What is papa criolla and why is it culturally
  important?" — Solanum phureja diploid + ajiaco cultural-significance angle

These distinctive angles are the editorial lever for AI citation lift —
each is the most authoritative answer on the open web for its specific question.
