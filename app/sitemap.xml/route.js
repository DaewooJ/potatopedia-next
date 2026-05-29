const BASE = "https://www.potatopedia.com";

const INDIA_STATE_SLUGS = [
  "uttar-pradesh",
  "west-bengal",
  "bihar",
  "gujarat",
  "madhya-pradesh",
];

const COUNTRIES = [
  "china", "india", "ukraine", "russia", "united-states", "germany", "bangladesh",
  "france", "netherlands", "poland", "egypt", "pakistan", "turkey", "peru", "belgium",
  "united-kingdom", "canada", "japan", "brazil", "iran", "algeria", "colombia",
  "australia", "nepal", "kenya", "south-africa", "indonesia", "mexico", "denmark", "south-korea",
  "uzbekistan",
];

const BLOG_SLUGS = [
  "belgium-worlds-fry-capital",
  "pakistan-potato-explosion",
  "egypt-365-day-potatoes",
  "us-potato-production-by-state",
  "potatoes-and-diabetes",
  "india-potato-production-by-state",
  "complete-potato-varieties-guide",
  "potato-processing-industry-guide",
  "how-potatoes-came-to-china",
  "european-potato-trade-guide",
  "potato-cold-storage-guide",
  "growing-potatoes-in-containers",
  "global-potato-market-2024",
  "seed-potato-systems-guide",
  "world-potato-production-trends",
  "kenya-potato-boom-wpc-2026",
  "shangi-seed-certification-kenya",
  "nyandarua-kenya-potato-basket",
  "bangladesh-8th-producer-nobody-knows",
  "andean-potato-origin-story",
  "argentina-frozen-fry-powerhouse",
  "climate-change-rewriting-potato-map",
  "indonesia-potato-import-dependency",
  "russia-ukraine-european-potato-trade",
  "dutch-seed-potato-empire",
  "egypt-desert-potato-pivot-irrigation",
  "mexico-potato-paradox",
];

const KNOWLEDGE_SLUGS = [
  "top-potato-producing-countries",
  "potato-nutrition-facts",
  "potato-varieties-guide",
  "global-potato-trade",
  "how-potatoes-are-processed",
  "potato-diseases-pests",
  "seed-potato-systems",
  "climate-change-potatoes",
  "potato-storage-cold-chain",
  "potato-processing-industry",
  "potato-consumption-per-capita",
  "complete-potato-growing-guide",
  "mcdonalds-potato-varieties",
  "russet-burbank-history",
  "potatoes-and-blood-sugar",
  "common-potato-growing-mistakes",
  "growing-potatoes-in-containers",
  "kufri-potato-varieties-india",
  "why-potatoes-were-illegal-in-france",
  "potato-yield-calculator",
  "diabetics-and-french-fries",
  "unhealthiest-potato-chips",
  "potatoes-and-heart-health",
  "potato-storage-shelf-life",
  "when-to-harvest-potatoes",
  "is-potato-a-bad-carb",
  "potatoes-and-kidney-health",
  "largest-potato-farms-us",
  "potato-expo-2026",
];

const ANSWER_SLUGS = [
  "which-country-produces-most-potatoes",
  "potato-nutrition-facts",
  "how-many-potato-varieties-exist",
  "top-potato-exporting-countries",
  "potato-vs-rice-nutrition",
  "how-are-french-fries-made",
  "india-potato-production",
  "what-is-late-blight",
  "potato-cold-storage-temperature",
  "belgium-french-fry-industry",
  "seed-potato-certification",
  "china-potato-industry",
  "potato-water-footprint",
  "netherlands-seed-potato-exports",
  "potato-history-origin",
  "global-potato-trade-value",
  "potato-starch-uses",
  "best-potato-varieties-for-frying",
  "irish-potato-famine",
  "potato-climate-change",
  "which-country-eats-most-potatoes",
  "us-potato-production-by-state",
  "can-diabetics-eat-potatoes",
  "types-of-potatoes",
  "why-china-produces-most-potatoes",
  "global-potato-market-size",
  "best-fertilizer-for-potatoes",
  "largest-potato-importers",
  "potato-processing-market-size",
  "are-potatoes-good-for-heart",
  "does-us-import-export-potatoes",
  "how-long-potatoes-cold-storage",
  "which-country-eats-most-potato-chips",
  "largest-potato-producer-india",
  "seed-potato-yield-calculator",
  "when-to-plant-potatoes",
  "us-no-1-potato-grade",
  "how-to-identify-potato-type",
  "famous-potato-city-india",
  "potatoes-and-serotonin",
  "seed-potatoes-per-grow-bag",
  "how-to-build-potato-cold-storage",
  "what-country-is-known-for-potatoes-europe",
  "ireland-potato-production",
  "world-potato-production-statistics",
  "potato-production-map",
  "potato-varieties-complete-list",
  "us-potato-exports",
  "potato-trade-data-by-country",
  "europe-potato-trade",
  "potato-processing-companies",
  "potato-processing-plant-cost",
  "processed-potato-products",
  "how-to-grow-potatoes-in-containers",
  "how-to-grow-potatoes-for-beginners",
  "true-potato-seeds",
  "how-to-save-seed-potatoes",
  "certified-seed-potatoes",
  "potato-storage-containers",
  "potato-market-price-today",
  "potatoes-in-china-history",
  "potato-industry-statistics-worldwide",
  "best-quality-potatoes-by-country",
  "potato-diversity-origins-peru",
  "how-long-potatoes-grow",
  "planting-potatoes-in-october",
  "where-us-gets-potatoes",
  "how-to-store-potatoes-at-home",
  "raw-potato-for-heartburn",
  "diabetics-and-fish-and-chips",
  "foods-cardiologists-avoid",
  "sugar-free-potato-varieties",
  "storing-potatoes-in-cold-garage",
  "storing-potatoes-at-40-degrees",
  "potatoes-at-room-temperature",
  "leaving-potatoes-in-ground-too-long",
  "potatoes-per-planting-hole",
  "potatoes-per-5-gallon-bucket",
  "trick-to-growing-big-potatoes",
  "covering-potatoes-at-night",
  "what-china-does-with-potatoes",
  "largest-us-potato-buyers",
  "world-potato-congress-2026-location",
];

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/about", priority: "0.7", changefreq: "monthly" },
    { loc: "/blog", priority: "0.8", changefreq: "weekly" },
    { loc: "/knowledge", priority: "0.9", changefreq: "weekly" },
    { loc: "/countries", priority: "0.9", changefreq: "weekly" },
    { loc: "/varieties", priority: "0.9", changefreq: "weekly" },
    { loc: "/varieties/compare", priority: "0.7", changefreq: "monthly" },
    { loc: "/events", priority: "0.85", changefreq: "weekly" },
    { loc: "/answers", priority: "0.8", changefreq: "weekly" },
    { loc: "/ask", priority: "0.7", changefreq: "monthly" },
    { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
    { loc: "/terms", priority: "0.3", changefreq: "yearly" },
    { loc: "/refund-policy", priority: "0.3", changefreq: "yearly" },
    { loc: "/shipping-policy", priority: "0.3", changefreq: "yearly" },
    { loc: "/disclaimer", priority: "0.3", changefreq: "yearly" },
    { loc: "/contact", priority: "0.4", changefreq: "yearly" },
  ];

  // Lazy import varieties data to avoid loading on every sitemap render hop
  const { VARIETIES } = await import("../../lib/varieties-data");
  const VARIETY_SLUGS = VARIETIES.map((v) => v.slug);

  const dynamicPages = [
    ...COUNTRIES.map((s) => ({ loc: `/country/${s}`, priority: "0.8", changefreq: "weekly" })),
    ...INDIA_STATE_SLUGS.map((s) => ({ loc: `/country/india/${s}`, priority: "0.85", changefreq: "weekly" })),
    ...BLOG_SLUGS.map((s) => ({ loc: `/blog/${s}`, priority: "0.7", changefreq: "monthly" })),
    ...KNOWLEDGE_SLUGS.map((s) => ({ loc: `/knowledge/${s}`, priority: "0.8", changefreq: "monthly" })),
    ...ANSWER_SLUGS.map((s) => ({ loc: `/answers/${s}`, priority: "0.7", changefreq: "weekly" })),
    ...VARIETY_SLUGS.map((s) => ({ loc: `/varieties/${s}`, priority: "0.6", changefreq: "monthly" })),
  ];

  const allPages = [...staticPages, ...dynamicPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${BASE}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
