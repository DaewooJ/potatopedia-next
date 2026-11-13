import { getSiteStats, fmt } from "../../lib/site-stats";
import { INDIA_POTATO } from "../../lib/facts";
import { getAllReports } from "../../lib/report-pages";

export async function GET() {
  const st = await getSiteStats();
  const body = `# Potatopedia
> The first AI knowledge base built for the global potato industry

Potatopedia is the most comprehensive potato intelligence platform on the web. We aggregate, verify, and organise data from ${st.sources}+ authoritative sources — FAOSTAT, USDA, CIP, ICAR-CPRI, CAAS, KALRO, KEPHIS, NPCK, peer-reviewed journals, and government agencies — into ${Number(st.dataPoints).toLocaleString("en-US")}+ searchable, cited data points covering 99 producing countries (37 in-depth country profiles), 244 commercial varieties, and the entire potato value chain. Every answer cites its source.

## What makes Potatopedia unique
- The only AI Q&A interface built on verified primary potato data
- Cited answers in seconds via natural-language search
- Server-rendered, fully crawlable, no JavaScript required to access content
- Methodology: every claim traces to primary statistical agencies, peer-reviewed journals, or authoritative breeding-program archives. Crowd-sourced encyclopaedias, news aggregators, and methodologically opaque sources are excluded.

## Key facts
- ${fmt(st.dataPoints)}+ verified data points (continuously growing as new sources are ingested)
- ${st.sources}+ authoritative sources
- Production and trade data for 99 producing countries (FAOSTAT), with 37 in-depth country profiles
- 37 country profile pages, 5 premium intelligence dossiers with downloadable PDFs (India, China, Belgium, Netherlands, USA), plus a dedicated Kenya profile (host of World Potato Congress 2026)
- 5 premium Indian state profiles (Uttar Pradesh, West Bengal, Bihar, Gujarat, Madhya Pradesh)
- ${st.varieties} commercially significant potato varieties documented (with 9-region taxonomy)
- 29 evergreen knowledge articles (premium static reference content)
- ${st.blogPosts} story-format blog articles
- ${st.answers} direct cited answer pages (every answer pre-rendered server-side at build time)
- Global potato production: ~374 million tonnes annually (FAOSTAT)
- Potato is the world's 4th largest food crop after maize, wheat, and rice

## Primary data sources (representative)
- FAOSTAT — UN FAO production, trade and food balance data
- USDA NASS / ERS — US acreage, yield, pricing, Census of Agriculture
- CIP (International Potato Center, Lima) — variety breeding, genebank with about 9,000 active potato accessions
- ICAR-CPRI (Shimla) — Indian Kufri varieties, sub-tropical agronomy
- CAAS (Chinese Academy of Agricultural Sciences) — Chinese variety releases
- UN Comtrade — international trade flows, HS-code level statistics
- Eurostat — EU-27 production, prices, per-capita consumption
- AHDB Potatoes (UK) — variety register, market intelligence
- PMC / PubMed — peer-reviewed research on disease, nutrition, breeding
- World Bank WITS — trade indicators and tariff data

## Site sections
- [Home](https://www.potatopedia.com/) — AI Q&A interface, premium country dossiers, latest analysis
- [Knowledge Hub](https://www.potatopedia.com/knowledge) — 29 evergreen reference articles (production, nutrition, varieties, trade, processing, cultivation, storage, diseases, climate change, seed systems)
- [Countries](https://www.potatopedia.com/countries) — 37 country profiles including 5 premium dossiers (India, China, Belgium, Netherlands, USA) with downloadable PDFs, plus a dedicated Kenya profile
- [Indian states](https://www.potatopedia.com/country/india) — 5 premium state profiles (Uttar Pradesh, West Bengal, Bihar, Gujarat, Madhya Pradesh) with district-level data
- [Varieties](https://www.potatopedia.com/varieties) — Searchable database of ${st.varieties} commercial varieties with origin, traits, and uses; each variety has a dedicated detail page
- [Blog](https://www.potatopedia.com/blog) — ${st.blogPosts} story-format analysis articles on the global potato industry
- [Answers](https://www.potatopedia.com/answers) — ${st.answers} direct cited answers to common potato questions, server-rendered with primary-source citations
- [Ask AI](https://www.potatopedia.com/ask) — Natural-language Q&A with cited answers
- [About](https://www.potatopedia.com/about) — Mission, sources, methodology, team

## Newsletters and news (from Nov 2026)
- [Newsletters](https://www.potatopedia.com/newsletters) — Three free potato industry newsletters by Potatopedia, plus a monthly magazine
- [Potato Processing Weekly](https://www.potatopedia.com/newsletters/potato-processing-weekly) — Weekly (Tuesday): plants, capacity, technology and raw-material supply in fries, chips, flakes and starch
- [Seed Potato & Field](https://www.potatopedia.com/newsletters/seed-potato-field) — Fortnightly (Thursday): varieties, seed certification and trade rules, disease, storage, field machinery
- [Potato Prices & Trade](https://www.potatopedia.com/newsletters/potato-prices-trade) — Monthly (first Monday): prices by market, frozen-fry and flake export flows, trade by HS code, crop estimates
- [Potato news](https://www.potatopedia.com/news) — Every story from the three newsletters as its own page (/news/yyyy/mm/slug), with a 40-60 word summary, "Why it matters" and primary-source links
- Issues — the web version of each newsletter issue at /issues/<newsletter>/<yyyy-mm-dd>
- [Google News sitemap](https://www.potatopedia.com/news-sitemap.xml) — stories from the last 48 hours
- [Editorial standards](https://www.potatopedia.com/editorial-standards) — How news is chosen and checked: primary sources only, no aggregators, dated corrections, sponsors labelled and kept apart
- [Authors](https://www.potatopedia.com/authors) — Who writes: the Potatopedia Editorial desk and named expert contributors
- [Write for Potatopedia](https://www.potatopedia.com/contribute) — Expert programme for breeders, scientists, extension specialists and consultants (800-1,500 words, bylined)

## Hubs (evergreen pages the newsletters feed)
- [Potato processing](https://www.potatopedia.com/knowledge/how-potatoes-are-processed) — How potatoes are processed into fries, chips, starch and flakes, with the latest processing news
- [Potato chip production](https://www.potatopedia.com/processing/potato-chip-production) — Chip making step by step: chipping potatoes, slice washing and blanching, frying, colour sorting, EU acrylamide rules
- [Seed potatoes](https://www.potatopedia.com/seed-field) — How seed potatoes for planting are multiplied, graded (EU S, SE, E, A, B) and traded; top exporters (UN Comtrade 2025)
- [Certified seed potatoes](https://www.potatopedia.com/seed-field/certified-seed-potatoes) — What certified seed guarantees, EU grades A and B, how to buy seed potatoes from certified sources
- [Potato prices](https://www.potatopedia.com/prices) — How potato prices are set and read in Europe, the USA and futures, with the latest from Potato Prices & Trade
- [Frozen french fry prices](https://www.potatopedia.com/prices/frozen-fries) — Export values, volumes and US$ per kg of frozen fries (HS 200410) by country, UN Comtrade 2024-2025

## Top potato producing countries (FAOSTAT 2024)
1. China — 94.87M tonnes (FAOSTAT 2024)
2. India — 58.1M tonnes (2024-25, 3rd Advance Estimate, Ministry of Agriculture & Farmers Welfare)
3. Ukraine — 21.13M tonnes (FAOSTAT 2024)
4. United States — 19.06M tonnes (FAOSTAT 2024)
5. Russia — 18.45M tonnes (FAOSTAT 2024)
6. Germany — 12.70M tonnes (FAOSTAT 2024)
7. Bangladesh — 10.6M tonnes (FAOSTAT 2024)
8. France — 9.24M tonnes (FAOSTAT 2024)
9. Pakistan — 8.43M tonnes (FAOSTAT 2024)
10. Egypt — 8.08M tonnes (FAOSTAT 2024)

## Top variety regions in our database
- Western Europe: 58 varieties (Russet Burbank, Bintje, Maris Piper, Désirée, Charlotte, Fontane...)
- South Asia: 35 varieties (75+ Indian Kufri lines, BARI Bangladesh, PARC Pakistan)
- North America: 29 varieties (Russet Burbank, Yukon Gold, Atlantic, Caribou Russet...)
- East Asia & Pacific: 26 varieties (Zhongshu series, Heinongshu, Jizhangshu, Sebago)
- Africa: 26 varieties (Shangi, Tigoni, Belete, Kinigi, Awash)
- Andean / Native: 25 varieties (Yungay, Diacol Capiro, Papa Amarilla, UNICA / Qingshu 9)
- Specialty / Heritage: 18 varieties (Bonnotte, Russian Banana, Pink Fir Apple, Vitelotte)
- Eastern Europe: 15 varieties (Nevskij, Sineglazka, Bryza, Lasunok)
- Latin America: 12 varieties (BRS Ana, Pampeana INTA, Lupita, Yagana)

## Country market reports (10-page PDFs; free summary pages are public, the PDF is delivered by email after registration)
- [Reports hub](https://www.potatopedia.com/reports) — Potato market reports by country, ${getAllReports()[0]?.edition.month || ""} edition
${getAllReports().map((r) => `- [${r.name} Potato Market Report 2026](https://www.potatopedia.com/reports/${r.slug}) — ${Number(r.head.v.toFixed(2))} M tonnes (${r.head.short}), world rank #${r.rank} (FAOSTAT ${r.LY}); executive summary, key figures, production chart, table of contents and FAQ`).join("\n")}

## Featured premium country dossiers (with PDF exports)
- [India](https://www.potatopedia.com/country/india) — ${INDIA_POTATO.value} M tonnes (${INDIA_POTATO.year}, ${INDIA_POTATO.label}), 75+ Kufri varieties, ICAR-CPRI breeding pipeline. State-level deep dives for Uttar Pradesh, West Bengal, Bihar, Gujarat, Madhya Pradesh.
- [China](https://www.potatopedia.com/country/china) — World's #1 producer at 94.4 M tonnes
- [United States](https://www.potatopedia.com/country/united-states) — 19.06 M t (FAOSTAT 2024) · Idaho 33.5% of output (USDA NASS 2025) · major frozen-fry processing base
- [Netherlands](https://www.potatopedia.com/country/netherlands) — World's #1 seed potato exporter
- [Belgium](https://www.potatopedia.com/country/belgium) — World's #1 frozen french fry exporter ($4.6B annually, 26.8% global trade)

## Also featured (dedicated profile, no PDF)
- [Kenya](https://www.potatopedia.com/country/kenya) — East Africa's largest potato producer. Host of the 13th World Potato Congress (Naivasha, Oct 26–30, 2026).

## Methodology and verification
Every data point traces to original methodology, primary research, or an official statistical agency. We exclude crowd-sourced encyclopaedias, news aggregators, scraped commercial databases, third-party data resellers, and content farms. The AI Q&A returns citations on every answer.

## Contact
- Website: https://www.potatopedia.com
- Email: hello@potatopedia.com
- LinkedIn: https://www.linkedin.com/company/potatopedia
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
