import { ppCSS } from "../../lib/styles";
import KnowledgeFilter from "../../components/KnowledgeFilter";
import ContentRequestCTA from "../../components/ContentRequestCTA";

export const metadata = {
  title: "Potato Knowledge Hub | Potatopedia",
  description: "29 in-depth reference articles on potato production, nutrition, varieties, trade, processing, cultivation, storage, and diseases. Sourced from FAOSTAT, USDA, CIP, ICAR-CPRI, and 277 authoritative agencies.",
  alternates: { canonical: "https://www.potatopedia.com/knowledge" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/knowledge",
    title: "Potato Knowledge Hub | Potatopedia",
    description: "29 reference articles across production, nutrition, varieties, trade, processing, cultivation, storage, and diseases.",
    images: ["/og-image.png"],
  },
};

const CARDS = [
  { slug: "top-potato-producing-countries", title: "Top Potato Producing Countries 2024", desc: "Complete rankings of the world's largest potato producers with FAOSTAT data, yield comparisons, and regional analysis.", tag: "Production", icon: "\u{1F30D}" },
  { slug: "potato-nutrition-facts", title: "Potato Nutrition Facts & Health Benefits", desc: "Comprehensive nutritional breakdown: calories, vitamins, minerals, glycemic index, and how potatoes compare to rice and bread.", tag: "Nutrition", icon: "\u{1F37D}\uFE0F" },
  { slug: "potato-varieties-guide", title: "Potato Varieties Guide: 50+ Types Explained", desc: "From Russet Burbank to Purple Majesty \u2014 characteristics, best uses, growing conditions, and origins of major varieties.", tag: "Varieties", icon: "\u{1F954}" },
  { slug: "global-potato-trade", title: "Global Potato Trade Statistics 2024", desc: "Who exports the most? Import/export flows, frozen fry trade, seed potato markets, and $50B+ global trade analysis.", tag: "Trade", icon: "\u{1F4B9}" },
  { slug: "how-potatoes-are-processed", title: "How Potatoes Are Processed: From Farm to Fry", desc: "French fries, chips, starch, flour, vodka \u2014 the $80B processing industry explained with data on major companies.", tag: "Processing", icon: "\u{1F3ED}" },
  { slug: "potato-processing-industry", title: "Global Potato Processing Industry: $80B Market & Leading Companies", desc: "The $80B+ global potato processing industry \u2014 frozen fries ($40.97B), chips ($35B), starch, and dehydrated. Leading processors, market structure, and growth outlook.", tag: "Industry", icon: "\u{1F3ED}" },
  { slug: "potato-diseases-pests", title: "Potato Diseases & Pests", desc: "Late blight, early blight, viruses, nematodes \u2014 major threats and integrated pest management strategies.", tag: "Diseases", icon: "\u{1F52C}" },
  { slug: "seed-potato-systems", title: "Seed Potato Systems", desc: "Certification, multiplication, international trade \u2014 how the Netherlands became the world's #1 seed exporter.", tag: "Agronomy", icon: "\u{1F331}" },
  { slug: "climate-change-potatoes", title: "Climate Change & Potatoes", desc: "Rising temperatures, heat-tolerant varieties, shifting growing zones, and adaptation strategies.", tag: "Climate", icon: "\u{1F321}\uFE0F" },
  { slug: "potato-storage-cold-chain", title: "Potato Storage & Cold Chain", desc: "Optimal temperatures, sprout control, CIPC alternatives, and reducing post-harvest losses.", tag: "Storage", icon: "\u2744\uFE0F" },
  { slug: "potato-consumption-per-capita", title: "Potato Consumption Per Capita by Country", desc: "Which countries eat the most potatoes? Per capita rankings, regional patterns, and consumption trends from FAOSTAT.", tag: "Consumption", icon: "\u{1F37D}\uFE0F" },
  { slug: "complete-potato-growing-guide", title: "Complete Potato Growing Guide", desc: "Soil prep, seed selection, planting schedules, watering, fertilizer, pest management, harvesting, and storage.", tag: "Cultivation", icon: "\u{1F331}" },
  { slug: "mcdonalds-potato-varieties", title: "What Potatoes Does McDonald's Use?", desc: "The Russet Burbank story: why McDonald's uses specific varieties and how J.R. Simplot built the frozen fry empire.", tag: "Processing", icon: "\u{1F35F}" },
  { slug: "russet-burbank-history", title: "Russet Burbank: History & Characteristics", desc: "The $150 potato that built a $4.6 billion industry. Origin, growing guide, and why it still dominates after 140 years.", tag: "Varieties", icon: "\u{1F954}" },
  { slug: "potatoes-and-blood-sugar", title: "Do Potatoes Cause Blood Sugar Spikes?", desc: "GI ranges from 56 to 111 by variety and cooking method. Cooling cooked potatoes cuts glycemic response by 25–35% — the science of resistant starch.", tag: "Nutrition", icon: "\u{1FA78}" },
  { slug: "common-potato-growing-mistakes", title: "15 Common Potato Growing Mistakes", desc: "Cold-soil planting, grocery-store seed, under-hilling — the errors that cost 30–50% of yield, and the FAO/extension fixes that prevent them.", tag: "Cultivation", icon: "⚠️" },
  { slug: "growing-potatoes-in-containers", title: "How Many Potatoes in a 5-Gallon Bucket?", desc: "3–5 lbs from a bucket; 5–10 lbs from 10 gallons. Best varieties, soil mix, watering, and the step-by-step bucket method.", tag: "Cultivation", icon: "\u{1FAA3}" },
  { slug: "kufri-potato-varieties-india", title: "Kufri Potato Varieties: India's CPRI Guide", desc: "75+ Kufri varieties from CPRI Shimla — Jyoti, Pukhraj, Chipsona, Frysona, Tejas, and 2025 releases that yield 37–40 t/ha.", tag: "Varieties", icon: "\u{1F1EE}\u{1F1F3}" },
  { slug: "why-potatoes-were-illegal-in-france", title: "Why Were Potatoes Illegal in France?", desc: "The 1748 Paris Faculty of Medicine declared potatoes caused leprosy. Parmentier reversed it in 1772 with reverse psychology — guarded fields and a royal dinner.", tag: "History", icon: "\u{1F1EB}\u{1F1F7}" },
  { slug: "potato-yield-calculator", title: "Potato Yield Per Acre: Calculator & Global Averages", desc: "USA averages 51.4 t/ha — the world's highest. Calculate expected yield from seed rate and spacing; see global yield by country, variety, and the 4–6× yield gap.", tag: "Cultivation", icon: "\u{1F4CA}" },
  { slug: "diabetics-and-french-fries", title: "Can Diabetics Eat French Fries?", desc: "Fries have GI 63–75 — lower than a baked potato (85–111) because fat slows digestion. Portion control, cooking methods, acrylamide, and healthier alternatives.", tag: "Nutrition", icon: "\u{1F35F}" },
  { slug: "unhealthiest-potato-chips", title: "What Is the Unhealthiest Potato Chip?", desc: "Chips have 6× the calories of a boiled potato. The thick-cut kettle and heavily-flavored varieties are the worst — plus the acrylamide and serving-size deception.", tag: "Nutrition", icon: "\u{1F37F}" },
  { slug: "potatoes-and-heart-health", title: "Are Potatoes Good for Your Heart?", desc: "620 mg potassium per medium potato — more than a banana. Meta-analyses, the DASH diet, and what cardiologists actually warn against.", tag: "Nutrition", icon: "\u{2764}️" },
  { slug: "potato-storage-shelf-life", title: "How Long Do Potatoes Last?", desc: "3–5 weeks pantry, 4–8 months cold storage. Why 40°F causes cold sweetening, the 20 mg/100g solanine threshold, and why never to refrigerate frying potatoes.", tag: "Storage", icon: "\u{1F321}️" },
  { slug: "when-to-harvest-potatoes", title: "When Are Potatoes Ready to Harvest?", desc: "Foliage yellow + skin-set thumb test. Days-to-maturity by variety class, what happens if you wait too long, and the 10–14 day curing protocol.", tag: "Cultivation", icon: "\u{1F33E}" },
  { slug: "is-potato-a-bad-carb", title: "Is Potato a Bad Carb?", desc: "Boiled waxy GI 56–69; baked Russet 85–111. Cooled potato drops 25% via resistant starch. 5× more potassium than rice. The 'bad carb' label is wrong.", tag: "Nutrition", icon: "\u{1F35E}" },
  { slug: "potatoes-and-kidney-health", title: "Potatoes and Kidney Health (Renal Diet)", desc: "Raw potato has 421 mg potassium per 100g. The NKF leaching method reduces it 50–75%. CKD stage-by-stage guidance and the double-boiling protocol.", tag: "Nutrition", icon: "\u{1FA80}" },
  { slug: "largest-potato-farms-us", title: "Largest Potato Farms in the US", desc: "R.D. Offutt operates 55,000+ acres across 6 states. Wada, Sterman Masser, CSS, Black Gold, Walther. Average US farm 430 acres; top 5% grow 60% of the crop.", tag: "Industry", icon: "\u{1F69C}" },
  { slug: "potato-expo-2026", title: "2026 Potato Expo & World Potato Congress", desc: "NPC's annual mid-January US trade show — 2,000+ attendees. Plus WPC 13 in Naivasha, Kenya, 26–30 October 2026 — first World Potato Congress in Africa.", tag: "Events", icon: "\u{1F39F}️" },
];

export default function KnowledgeHubPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.potatopedia.com/knowledge#collection",
    name: "Potatopedia Knowledge Hub",
    description: "29 in-depth reference articles on the global potato industry — production, nutrition, varieties, trade, processing, cultivation, storage, diseases.",
    url: "https://www.potatopedia.com/knowledge",
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "Potatopedia", url: "https://www.potatopedia.com", logo: "https://www.potatopedia.com/logo.png" },
    hasPart: CARDS.map((c) => ({
      "@type": "Article",
      headline: c.title,
      description: c.desc,
      articleSection: c.tag,
      url: `https://www.potatopedia.com/knowledge/${c.slug}`,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <style dangerouslySetInnerHTML={{ __html: ppCSS }} />
      <div style={{ minHeight: "calc(100vh - 68px)", padding: "60px 24px 0" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 20 }}>
            Knowledge Hub
          </span>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.2, marginBottom: 16 }}>
            Potato Intelligence,{" "}
            <span style={{ background: "linear-gradient(135deg,#C62828,#E53935)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Backed by Data
            </span>
          </h1>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            In-depth guides on every aspect of the global potato industry &mdash; production data, nutrition science, trade flows, and processing technology.
          </p>
        </div>

        {/* Filter + Grid (client island) */}
        <KnowledgeFilter cards={CARDS} />

        {/* Content Request CTA */}
        <section style={{ padding: "60px 24px 80px", background: "transparent" }}>
          <ContentRequestCTA pageContext="Knowledge Hub index" />
        </section>
      </div>
    </>
  );
}
