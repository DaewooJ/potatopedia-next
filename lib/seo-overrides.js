// Search titles + meta descriptions for the 20 most-shown pages (rewritten 7 Nov 2026 to lift click-through).
// Keyed by site-relative path. Titles exclude the " — Potatopedia" suffix the root layout adds (body <= 45 chars,
// so the full title stays <= 60). Descriptions are 140-158 chars and use only figures that appear on the page.
// H1s, URLs, canonicals and page content are untouched. Log: docs/seo/2026-11-07-title-rewrite.md
export const SEO_OVERRIDES = {
  "/knowledge/potato-consumption-per-capita": {
    title: "Potato Consumption per Capita by Country (kg)",
    description: "Belarus eats 166.9 kg of potatoes per person a year, Ukraine 136 kg, Russia 111 kg (FAOSTAT). Compare per capita consumption by country and the global average.",
  },
  "/blog/us-potato-production-by-state": {
    title: "US Potato Production by State, 2025 Data",
    description: "Idaho grew 140 million cwt of US potatoes in 2025, 33.5% of output (USDA NASS). See the top 10 states, why five make 74% and the $4.2B crop value.",
  },
  "/knowledge/top-potato-producing-countries": {
    title: "Potato Production by Country: Top 20, 2024",
    description: "China grew 94.9 Mt of potatoes in 2024 (FAOSTAT), India 58.1 Mt (2024-25, 3rd Advance Estimate). Top 20 producers ranked, with yields and regional trends.",
  },
  "/blog/how-much-sugar-in-a-potato": {
    title: "Sugar in a Potato: 0.82 g per 100 g (USDA)",
    description: "A raw potato has 0.82 g of sugar per 100 g (USDA), a fifteenth of a banana's. Why its glycemic index can still be high, and what cold storage does to sugar.",
  },
  "/varieties": {
    title: "Potato Varieties Database: 244 Cultivars",
    description: "Search 244 potato varieties across 9 regions, from Russet Burbank and Maris Piper to Kufri Pukhraj, Shangi and Yungay. Origin, traits and best uses for each.",
  },
  "/knowledge/largest-potato-farms-us": {
    title: "Largest Potato Farms in the US (by Acres)",
    description: "R.D. Offutt farms 55,000+ acres across 6 states, the largest US potato operation. See Wada, Sterman Masser, CSS, Black Gold and the ~430-acre average farm.",
  },
  "/knowledge/kufri-potato-varieties-india": {
    title: "Kufri Potato Varieties of India: 75+ Types",
    description: "Kufri varieties are bred by ICAR-CPRI Shimla, from Kufri Jyoti (1968) to Tejas (2025). 75+ table, processing and specialty types, with Chandramukhi, Pukhraj.",
  },
  "/blog/how-potatoes-came-to-china": {
    title: "Potatoes in China: History and Production",
    description: "Potatoes reached China about 400 years ago. China became the top producer in the 1990s and now grows 25% of world output (FAOSTAT). How the tuber took hold.",
  },
  "/country/india/uttar-pradesh": {
    title: "Uttar Pradesh Potato Production, 2023-24",
    description: "Uttar Pradesh grew 20.13 Mt of potatoes in 2023-24 (DAFW), 33.46% of India's crop. Agra leads at 2.8 Mt. District data, varieties, cold storage, mandi prices.",
  },
  "/knowledge/global-potato-trade": {
    title: "Global Potato Trade: Top Exporters, 2024",
    description: "Potato trade is worth about $22.8B a year (UN Comtrade). Belgium leads frozen fries at $4.6B, 26.8% of exports. Top exporters, importers, seed trade, growth.",
  },
  "/knowledge/why-potatoes-were-illegal-in-france": {
    title: "Why Were Potatoes Illegal in France? (1748)",
    description: "In 1748 the Paris Faculty of Medicine declared potatoes caused leprosy. Parmentier reversed the verdict in 1772 with reverse psychology. The story in dates.",
  },
  "/knowledge/potato-yield-calculator": {
    title: "Potato Yield Per Acre: Calculator, Averages",
    description: "US potatoes average 471 cwt per acre (51.4 t/ha), the world's highest. Estimate your yield from seed rate, spacing and tuber count, with yields by country.",
  },
  "/knowledge/growing-potatoes-in-containers": {
    title: "Growing Potatoes in a 5-Gallon Bucket: Yield",
    description: "A 5-gallon bucket yields 3-5 lbs (1.5-2.5 kg) of potatoes from 2-3 seed pieces. Best container sizes and varieties, soil mix, watering, step-by-step planting.",
  },
  "/blog/chip-vs-crisp-naming-history": {
    title: "Chip vs Crisp: Origin of the Potato Chip",
    description: "The first known potato chip recipe is English: Kitchiner's 1817 Cook's Oracle, 36 years before the George Crum story. Why chip and crisp differ by country.",
  },
  "/answers/which-country-eats-most-potato-chips": {
    title: "Which Country Eats the Most Crisps and Chips?",
    description: "No source ranks chip consumption by country. The UK is Europe's largest chip market by value (Walkers about 40%); Frito-Lay leads worldwide. Sources inside.",
  },
  "/blog/carisma-low-gi-potato-where-to-buy": {
    title: "Carisma Potatoes: Low GI and Where to Buy",
    description: "Carisma launched in Australia in 2010 as the first certified low-GI potato (GI 53 in a peer-reviewed test). It is now grown in Ontario and three US states: where to buy it.",
  },
  "/blog/india-potato-production-by-state": {
    title: "Potato Production in India by State, 2024-25",
    description: "India grew 58.1 Mt of potatoes in 2024-25 (3rd Advance Estimate); Uttar Pradesh, the potato capital, grew about 20.1 Mt in 2023-24. Top 10 states ranked.",
  },
  "/blog/andean-potato-origin-story": {
    title: "Andean Potato Origins: 8,000 Years of History",
    description: "Potatoes were domesticated 8,000+ years ago near Lake Titicaca (Spooner et al., PNAS 2005). The Inca grew 3,000+ varieties; CIP's Lima genebank holds 4,000+.",
  },
  "/knowledge/potato-varieties-guide": {
    title: "Potato Varieties: 50+ Types and Their Uses",
    description: "Over 4,000 potato varieties exist worldwide, about 50 major commercial types. From Russet Burbank to Purple Majesty: traits, uses, growing needs and origins.",
  },
  "/knowledge/russet-burbank-history": {
    title: "Russet Burbank Potato: History and Traits",
    description: "Luther Burbank selected the Russet Burbank in 1876. It still covers 25-40% of US potato acreage. Origin, traits, disease resistance, growing tips, and why.",
  },
};

// Swaps the rewritten title/description into a metadata object (and its OG/Twitter copies) for `path`.
export function applySeoOverride(meta, path) {
  const o = SEO_OVERRIDES[path];
  if (!o) return meta;
  return {
    ...meta,
    title: o.title,
    description: o.description,
    openGraph: meta.openGraph ? { ...meta.openGraph, title: o.title, description: o.description } : meta.openGraph,
    twitter: meta.twitter ? { ...meta.twitter, title: o.title, description: o.description } : meta.twitter,
  };
}
