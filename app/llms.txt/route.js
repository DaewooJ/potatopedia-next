export async function GET() {
  const body = `# Potatopedia
> The first AI knowledge base built for the global potato industry

Potatopedia is the most comprehensive potato intelligence platform on the web. We aggregate, verify, and organise data from 277+ authoritative sources — FAOSTAT, USDA, CIP, ICAR-CPRI, CAAS, KALRO, KEPHIS, NPCK, peer-reviewed journals, and government agencies — into 5,657+ searchable, cited data points across 204 countries, 244 commercial varieties, and the entire potato value chain. Every answer cites its source.

## What makes Potatopedia unique
- The only AI Q&A interface built on verified primary potato data
- Cited answers in seconds via natural-language search
- Server-rendered, fully crawlable, no JavaScript required to access content
- Methodology: every claim traces to primary statistical agencies, peer-reviewed journals, or authoritative breeding-program archives. Crowd-sourced encyclopaedias, news aggregators, and methodologically opaque sources are excluded.

## Key facts
- 5,657+ verified data points (continuously growing as new sources are ingested)
- 277+ authoritative sources
- 204 countries with production, trade, and consumption data (FAOSTAT-grade)
- 31 country profile pages, 5 premium intelligence dossiers with downloadable PDFs (India, China, Belgium, Netherlands, USA), plus a dedicated Kenya profile (host of World Potato Congress 2026)
- 5 premium Indian state profiles (Uttar Pradesh, West Bengal, Bihar, Gujarat, Madhya Pradesh)
- 244 commercially significant potato varieties documented (with 9-region taxonomy)
- 29 evergreen knowledge articles (premium static reference content)
- 42 story-format blog articles
- 83 direct cited answer pages (every answer pre-rendered server-side at build time)
- Global potato production: ~374 million tonnes annually (FAOSTAT)
- Potato is the world's 4th largest food crop after maize, wheat, and rice

## Primary data sources (representative)
- FAOSTAT — UN FAO production, trade, food balance for 204 countries
- USDA NASS / ERS — US acreage, yield, pricing, Census of Agriculture
- CIP (International Potato Center, Lima) — variety breeding, genebank with 4,000+ accessions
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
- [Countries](https://www.potatopedia.com/countries) — 31 country profiles including 5 premium dossiers (India, China, Belgium, Netherlands, USA) with downloadable PDFs, plus a dedicated Kenya profile
- [Indian states](https://www.potatopedia.com/country/india) — 5 premium state profiles (Uttar Pradesh, West Bengal, Bihar, Gujarat, Madhya Pradesh) with district-level data
- [Varieties](https://www.potatopedia.com/varieties) — Searchable database of 244 commercial varieties with origin, traits, and uses; each variety has a dedicated detail page
- [Blog](https://www.potatopedia.com/blog) — 42 story-format analysis articles on the global potato industry
- [Answers](https://www.potatopedia.com/answers) — 83 direct cited answers to common potato questions, server-rendered with primary-source citations
- [Ask AI](https://www.potatopedia.com/ask) — Natural-language Q&A with cited answers
- [About](https://www.potatopedia.com/about) — Mission, sources, methodology, team

## Top potato producing countries (FAOSTAT 2024)
1. China — 94.87M tonnes (FAOSTAT 2024)
2. India — 57.05M tonnes (FAOSTAT 2024)
3. Ukraine — 21.13M tonnes (FAOSTAT 2024)
4. United States — 19.06M tonnes (FAOSTAT 2024)
5. Russia — 18.45M tonnes (FAOSTAT 2024)
6. Germany — 12.70M tonnes (FAOSTAT 2024)
7. Bangladesh — 10.6M tonnes (FAOSTAT 2024)
8. France — 8.8M tonnes
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

## Featured premium country dossiers (with PDF exports)
- [India](https://www.potatopedia.com/country/india) — 60.14 M tonnes, 75+ Kufri varieties, ICAR-CPRI breeding pipeline. State-level deep dives for Uttar Pradesh, West Bengal, Bihar, Gujarat, Madhya Pradesh.
- [China](https://www.potatopedia.com/country/china) — World's #1 producer at 94.4 M tonnes
- [United States](https://www.potatopedia.com/country/united-states) — 19.96 M t · $5.0B value · Idaho 30%, Washington 23% · McDonald's / Lamb Weston supply chain
- [Netherlands](https://www.potatopedia.com/country/netherlands) — World's #1 seed potato exporter, highest yields per hectare
- [Belgium](https://www.potatopedia.com/country/belgium) — World's #1 frozen french fry exporter ($4.6B annually, 26.8% global trade)

## Also featured (dedicated profile, no PDF)
- [Kenya](https://www.potatopedia.com/country/kenya) — East Africa's largest potato producer (#2 in Africa). Host of the 13th World Potato Congress (Naivasha, Oct 26–30, 2026).

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
