import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES, UPDATED_SHORT } from "../../../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, SPEAKABLE, articleAuthorBlock } from "../../../lib/authors";
import { ppCSS } from "../../../lib/styles";
import { printCSS } from "../../../lib/printStyles";
import CountryAI from "../../../components/CountryAI";
import PdfDownloadButton from "../../../components/PdfDownloadButton";
import { getVarietiesByCountrySlug } from "../../../lib/varieties-data";
import RelatedBlogPosts from "../../../components/RelatedBlogPosts";
import CountryProfilePremium, { TrajectoryTable } from "../../../components/CountryProfilePremium";

const COUNTRY_TO_BLOGS = {
  "kenya": ["kenya-potato-boom-wpc-2026", "climate-change-rewriting-potato-map"],
  "bangladesh": ["bangladesh-8th-producer-nobody-knows", "climate-change-rewriting-potato-map"],
  "peru": ["andean-potato-origin-story"],
  "china": ["how-potatoes-came-to-china", "andean-potato-origin-story"],
  "india": ["india-potato-production-by-state", "climate-change-rewriting-potato-map", "world-potato-production-trends"],
  "united-states": ["us-potato-production-by-state", "argentina-frozen-fry-powerhouse"],
  "belgium": ["belgium-worlds-fry-capital", "argentina-frozen-fry-powerhouse", "european-potato-trade-guide"],
  "netherlands": ["european-potato-trade-guide", "seed-potato-systems-guide"],
  "egypt": ["egypt-365-day-potatoes"],
  "pakistan": ["pakistan-potato-explosion", "climate-change-rewriting-potato-map"],
  "germany": ["european-potato-trade-guide", "world-potato-production-trends"],
  "france": ["european-potato-trade-guide", "belgium-worlds-fry-capital"],
  "united-kingdom": ["european-potato-trade-guide", "complete-potato-varieties-guide"],
  "brazil": ["argentina-frozen-fry-powerhouse"],
  "russia": ["climate-change-rewriting-potato-map", "world-potato-production-trends"],
  "ukraine": ["climate-change-rewriting-potato-map"],
  "japan": ["world-potato-production-trends"],
  "canada": ["potato-processing-industry-guide"],
  "south-africa": ["world-potato-production-trends"],
};

function CountryBlogPosts({ countrySlug }) {
  const slugs = COUNTRY_TO_BLOGS[countrySlug] || [];
  if (slugs.length === 0) return null;
  return (
    <section className="pp-country-blog pp-no-print" style={{ padding: "40px 0", background: "#fff", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <RelatedBlogPosts slugs={slugs} title="Read our analysis" subtitle="Story-format coverage of this country's potato industry — context, trends, and the why behind the numbers." />
      </div>
    </section>
  );
}

function CountryVarieties({ countrySlug, countryName }) {
  const all = getVarietiesByCountrySlug(countrySlug);
  if (!all || all.length === 0) return null;
  const top = all.slice(0, 8);
  return (
    <section className="pp-country-varieties pp-no-print" style={{ padding: "48px 0", background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 14, marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Varieties grown here</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.7, margin: 0 }}>
              Top potato varieties from {countryName}
            </h2>
            <p style={{ fontSize: 14, color: "#666", marginTop: 6, marginBottom: 0 }}>
              {all.length} commercially significant {all.length === 1 ? "variety" : "varieties"} documented in our database{all.length > 8 ? " (showing top 8)" : ""}.
            </p>
          </div>
          {all.length > 8 && (
            <Link href="/varieties" style={{ fontSize: 13, color: "#C62828", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
              All {all.length} →
            </Link>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {top.map(v => (
            <Link key={v.slug} href={"/varieties/" + v.slug} style={{ display: "block", textDecoration: "none", color: "inherit", background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{v.name}</div>
                {v.year && <div style={{ fontSize: 11, color: "#999" }}>{v.year}</div>}
              </div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{v.trait.length > 110 ? v.trait.slice(0, 110) + "…" : v.trait}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  return COUNTRIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = COUNTRIES.find((x) => x.slug === slug);
  if (!c) return { title: "Country Not Found" };

  // Helper: build a tight 145-155 char description for SERP completeness.
  const trim = (s, max = 155) => {
    s = String(s || "").replace(/\s+/g, " ").trim();
    return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
  };

  if (slug === "india") {
    const desc = "India is the world's #2 potato producer at 60.14M tonnes (FAOSTAT 2023). UP leads at 33.5%. Kufri varieties, processing, 39.42M-t cold storage.";
    return {
      title: "India Potato Industry: #2 Producer at 60M Tonnes",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/india" },
      openGraph: { title: "India Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "India Potato Industry", description: trim(desc) },
    };
  }

  if (slug === "china") {
    const desc = "China is the world's #1 potato producer at 93.49M tonnes (FAOSTAT 2023) — 24.4% of global output. Inner Mongolia, Sichuan, Yunnan lead.";
    return {
      title: "China Potato Industry: World's #1 Producer",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/china" },
      openGraph: { title: "China Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "China Potato Industry", description: trim(desc) },
    };
  }

  if (slug === "belgium") {
    const desc = "Belgium produces 8.61M tonnes at 42 t/ha. World's #1 frozen french fry exporter at $4.6B — Clarebout, Agristo, Lutosa, Mydibel in West Flanders.";
    return {
      title: "Belgium: World's #1 Frozen Fry Exporter ($4.6B)",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/belgium" },
      openGraph: { title: "Belgium Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "Belgium Potato Industry", description: trim(desc) },
    };
  }

  if (slug === "netherlands") {
    const desc = "Netherlands produces 6.5M tonnes at 41 t/ha and exports 800,000 t of certified seed potatoes — 60%+ of global market. HZPC, Agrico, AVEBE.";
    return {
      title: "Netherlands: World's #1 Seed Potato Exporter",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/netherlands" },
      openGraph: { title: "Netherlands Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "Netherlands Potato Industry", description: trim(desc) },
    };
  }

  if (slug === "united-states") {
    const desc = "The USA produces 19.96M tonnes at 51.4 t/ha — world's highest yield. Idaho 32%, Washington 23%. Lamb Weston, Simplot, McCain power the $5B industry.";
    return {
      title: "United States Potato Industry: 19.96M Tonnes",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/united-states" },
      openGraph: { title: "United States Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "US Potato Industry", description: trim(desc) },
    };
  }

  if (slug === "kenya") {
    const desc = "Kenya produces 2.31M tonnes — East Africa's #1 producer. Nyandarua leads at ~35%. Hosts the 13th World Potato Congress in Naivasha, Oct 26–30, 2026.";
    return {
      title: "Kenya Potato Industry: WPC 2026 Host (2.31M Tonnes)",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/kenya" },
      openGraph: { title: "Kenya Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "Kenya Potato Industry", description: trim(desc) },
    };
  }

  // Standard country profile fallback — keep tight under 155 chars.
  const stdDesc = trim(`${c.name} produces ${c.prod} tonnes of potatoes annually (#${c.rank} globally). ${c.highlight}`);
  const stdTitle = `${c.name} Potato Industry: ${c.prod}t (#${c.rank})`;
  return {
    title: stdTitle.length > 65 ? `${c.name} Potato Industry — ${c.prod}t` : stdTitle,
    description: stdDesc,
    alternates: { canonical: "https://www.potatopedia.com/country/" + slug },
    openGraph: { title: `${c.name} Potato Industry — Potatopedia`, description: stdDesc, type: "article", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: `${c.name} Potato Industry`, description: stdDesc },
  };
}

// ----- Wikidata mapping for major potato-producing countries (used by JSON-LD `Country.sameAs`) -----
const COUNTRY_WIKIDATA = {
  china: "https://www.wikidata.org/wiki/Q148",
  india: "https://www.wikidata.org/wiki/Q668",
  ukraine: "https://www.wikidata.org/wiki/Q212",
  russia: "https://www.wikidata.org/wiki/Q159",
  "united-states": "https://www.wikidata.org/wiki/Q30",
  germany: "https://www.wikidata.org/wiki/Q183",
  bangladesh: "https://www.wikidata.org/wiki/Q902",
  france: "https://www.wikidata.org/wiki/Q142",
  netherlands: "https://www.wikidata.org/wiki/Q55",
  poland: "https://www.wikidata.org/wiki/Q36",
  egypt: "https://www.wikidata.org/wiki/Q79",
  pakistan: "https://www.wikidata.org/wiki/Q843",
  turkey: "https://www.wikidata.org/wiki/Q43",
  peru: "https://www.wikidata.org/wiki/Q419",
  belgium: "https://www.wikidata.org/wiki/Q31",
  "united-kingdom": "https://www.wikidata.org/wiki/Q145",
  canada: "https://www.wikidata.org/wiki/Q16",
  japan: "https://www.wikidata.org/wiki/Q17",
  brazil: "https://www.wikidata.org/wiki/Q155",
  iran: "https://www.wikidata.org/wiki/Q794",
  algeria: "https://www.wikidata.org/wiki/Q262",
  colombia: "https://www.wikidata.org/wiki/Q739",
  australia: "https://www.wikidata.org/wiki/Q408",
  nepal: "https://www.wikidata.org/wiki/Q837",
  kenya: "https://www.wikidata.org/wiki/Q114",
  "south-africa": "https://www.wikidata.org/wiki/Q258",
  indonesia: "https://www.wikidata.org/wiki/Q252",
  mexico: "https://www.wikidata.org/wiki/Q96",
  denmark: "https://www.wikidata.org/wiki/Q35",
  "south-korea": "https://www.wikidata.org/wiki/Q884",
};

/* Print stylesheet imported from lib/printStyles.js — shared across all country dossiers. */

/* ── Standard country page (untouched for non-India routes) ── */

function StandardCountryPage({ c, slug }) {
  const statItems = [
    { label: "Production", value: c.prod + " t", icon: "📦" },
    { label: "Harvested Area", value: c.area, icon: "🌾" },
    { label: "Yield", value: c.yield, icon: "📈" },
    { label: "Per Capita", value: c.consumption, icon: "🍽️" },
  ];

  const regionPeers = COUNTRIES.filter((x) => x.region === c.region && x.slug !== c.slug).slice(0, 4);

  const pageUrl = "https://www.potatopedia.com/country/" + slug;
  const wikidataUrl = COUNTRY_WIKIDATA[slug];

  // PAA-aligned FAQ generated from country attributes — drives AI Overview pickup.
  const faqItems = [
    {
      q: `How much potato does ${c.name} produce per year?`,
      a: `${c.name} produces approximately ${c.prod} tonnes of potatoes annually, ranking #${c.rank} globally (FAOSTAT). The country cultivates potatoes across ${c.area} of land with an average yield of ${c.yield}.`,
    },
    {
      q: `What is ${c.name}'s rank in global potato production?`,
      a: `${c.name} ranks #${c.rank} in global potato production according to FAOSTAT, with annual output of ${c.prod} tonnes. ${c.highlight}`,
    },
    {
      q: `What is the average potato yield in ${c.name}?`,
      a: `${c.name}'s average potato yield is ${c.yield}. The world average is approximately 22.8 t/ha, with the Netherlands and US leading at 41–51 t/ha (FAOSTAT).`,
    },
    {
      q: `How much potato does each person in ${c.name} consume?`,
      a: `Per-capita potato consumption in ${c.name} is ${c.consumption}. Belarus leads global per-capita consumption at 181 kg/year, followed by Ukraine and Russia.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": pageUrl + "#article",
        headline: "Potato Industry in " + c.name,
        description: c.name + " produces " + c.prod + " tonnes of potatoes annually (#" + c.rank + " globally). " + c.highlight,
        datePublished: "2026-03-31",
        dateModified: "2026-05-08",
        author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
        publisher: { "@id": "https://www.potatopedia.com/#publisher" },
        mainEntityOfPage: pageUrl,
        image: "https://www.potatopedia.com/og-image.png",
        about: { "@id": pageUrl + "#country" },
        articleSection: "Country profile",
        speakable: SPEAKABLE,
      },
      // Country + Place schema with sameAs to Wikidata for entity-linking lift.
      {
        "@type": ["Country", "Place"],
        "@id": pageUrl + "#country",
        name: c.name,
        url: pageUrl,
        ...(wikidataUrl ? { sameAs: wikidataUrl } : {}),
        description: `${c.name} potato industry profile: production ${c.prod} tonnes (#${c.rank} globally), area ${c.area}, yield ${c.yield}, per-capita consumption ${c.consumption}.`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
          { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: c.name } },
        ],
      },
      POTATOPEDIA_PUBLISHER,
    ],
  };

  // FAQPage as separate JSON-LD block (Google preferred pattern, +60% AI Overview citation lift).
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="pp-country-page" style={{ minHeight: "100vh", background: "#fff", overflowX: "hidden" }}>
      <style>{ppCSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section style={{ paddingTop: 52, paddingBottom: 40, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle,rgba(198,40,40,0.04) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <Link href="/countries" style={{ fontSize: 13, color: "#C62828", textDecoration: "none", fontWeight: 500, marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(198,40,40,0.04)", border: "1px solid rgba(198,40,40,0.1)" }}>&larr; All Countries</Link>
          <div style={{ fontSize: 72, marginTop: 16, marginBottom: 12 }}>{c.flag}</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.5, marginBottom: 8, lineHeight: 1.15 }}>{c.name}</h1>
          <div style={{ display: "inline-block", fontSize: 13, color: "#C62828", fontWeight: 600, background: "rgba(198,40,40,0.06)", borderRadius: 20, padding: "6px 18px", marginBottom: 16 }}>#{c.rank} Global Producer &middot; {c.region}</div>
          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>{c.highlight}</p>
        </div>
      </section>

      <section style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 48px" }}>
          <div className="pp-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {statItems.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.5, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-year FAOSTAT trajectory band — uses shared TrajectoryTable component */}
      <section style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "32px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <TrajectoryTable slug={c.slug} />
        </div>
      </section>

      <CountryAI countryName={c.name} countrySlug={c.slug} />

      <CountryVarieties countrySlug={c.slug} countryName={c.name} />

      <CountryBlogPosts countrySlug={c.slug} />

      {regionPeers.length > 0 && (
        <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 48px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", textAlign: "center", marginBottom: 24 }}>More in {c.region}</h2>
            <div className="pp-countries-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {regionPeers.map((x) => (
                <Link
                  key={x.slug}
                  href={"/country/" + x.slug}
                  className="pp-country-card"
                  style={{ background: "white", borderRadius: 16, padding: "22px 16px", textAlign: "center", border: "1px solid #eee", textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{x.flag}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>{x.name}</div>
                  <div style={{ fontSize: 20, color: "#C62828", fontWeight: 800, lineHeight: 1 }}>{x.prod}</div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>#{x.rank} Global</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ── India: full Country Intelligence Dossier (Tier 1 prototype) ── */

function IndiaProfilePage({ c }) {
  const stats = [
    { value: "60.14 M t", label: "Annual Production", sub: "FAOSTAT 2023" },
    { value: "2.33 M ha", label: "Harvested Area", sub: "DA&FW 2023-24" },
    { value: "25.8 t/ha", label: "Average Yield", sub: "above world avg (22.8)" },
    { value: "#2", label: "Global Rank", sub: "after China (94.4 M t)" },
    { value: "~15%", label: "Share of Global Output", sub: "FAOSTAT 2023" },
    { value: "+1.85%", label: "Year-over-Year", sub: "MoA 3rd Adv. Estimate", positive: true },
    { value: "85%", label: "Rabi-Season Share", sub: "Oct–Mar planting" },
    { value: "33.5%", label: "Top State (UP)", sub: "20.13 M t" },
  ];

  const quickFacts = [
    "Uttar Pradesh alone produces more potatoes than Germany (11.7 M t)",
    "85% of India's crop is grown during the rabi (winter) season — Oct planting, Feb–Mar harvest",
    "Frozen French fry exports surged 30.9% in 2024, reaching 268,342 tonnes",
    "Only 7–8% of the crop is processed — vs. 60%+ in the US, signaling major growth headroom",
    "India operates the world's 2nd-largest potato cold storage network at 39.42 M tonnes capacity (NHB)",
    "Only 15% of seed used is certified — 85% is farm-saved with 30–60% virus incidence",
    "Gujarat hosts 80% of India's processing capacity, including McCain's flagship Mehsana plant",
    "ICAR-CPRI has released 75+ Kufri varieties since 1949; CPRI varieties cover 94%+ of acreage",
  ];

  // Refreshed from DA&FW Horticultural Statistics at a Glance 2024 (Table 7.3.31, 2023-24).
  // Where a dedicated state profile exists, the row matches that page's stated value to avoid
  // internal contradiction; otherwise, the value is the HSAG 2024 primary. Sorted by production.
  const stateRows = [
    ["Uttar Pradesh", "20.13", 33.46, "Rabi (Oct–Mar)", "Kufri Bahar, Pukhraj, Khyati"],
    ["West Bengal", "11.5", 21.6, "Rabi (Nov–Mar)", "Kufri Jyoti, Pukhraj"],
    ["Bihar", "9.075", 15.09, "Rabi (Oct–Mar)", "Kufri Sindhuri, Bahar, Anand"],
    ["Gujarat", "4.86", 8.10, "Rabi (Nov–Feb)", "Kufri Chipsona-3, Frysona, Lady Rosetta"],
    ["Madhya Pradesh", "3.949", 6.92, "Rabi (Oct–Mar)", "Kufri Tejas (ICAR rec.)"],
    ["Punjab", "3.237", 5.67, "Rabi", "Kufri Pukhraj, Bahar"],
    ["Assam", "0.911", 1.60, "Rabi (Oct–Mar)", "Kufri Tejas / Chipbharat (ICAR rec.)"],
    ["Jharkhand", "0.767", 1.34, "Rabi (Oct–Mar)", "Kufri Ratan (ICAR rec.)"],
    ["Haryana", "0.750", 1.31, "Rabi", "Kufri Pukhraj, Bahar"],
    ["Maharashtra", "0.387", 0.68, "Rabi (Oct–Mar)", "Kufri Tejas (ICAR rec.)"],
    ["Karnataka", "0.350", 0.61, "Year-round (hills)", "Kufri Karan, Sahyadri"],
    ["Meghalaya", "0.196", 0.34, "Rabi (Oct–Mar)", "Kufri (ICAR-RCNEH rec.)"],
    ["Himachal Pradesh", "0.195", 0.34, "Kharif (Apr–Sep)", "Kufri Jyoti, Himalini"],
    ["Tripura", "0.146", 0.26, "Rabi (Oct–Mar)", "Kufri (ICAR-RCNEH rec.)"],
    ["Tamil Nadu (Nilgiris)", "0.092", 0.16, "Year-round", "Kufri Karan"],
    ["Nagaland", "0.055", 0.10, "Rabi", "Kufri (ICAR-RCNEH rec.)"],
    ["Andhra Pradesh", "0.018", 0.03, "Rabi", "(ICAR rec.; small footprint)"],
    ["Manipur", "0.015", 0.03, "Rabi", "Kufri (ICAR-RCNEH rec.)"],
    ["Arunachal Pradesh", "0.006", 0.01, "Rabi", "Kufri (ICAR-RCNEH rec.)"],
  ];

  const seasonRows = [
    ["Rabi (winter)", "Indo-Gangetic Plain (Zones 1–3)", "Oct–Nov", "Feb–Mar", "85–90% of national output"],
    ["Kharif (summer)", "Hill states (HP, UK, J&K, NE)", "Mar–Apr", "Jun–Sep", "Crucial for virus-free seed production"],
    ["Plateau winter", "Maharashtra, Karnataka", "Dec", "Mar–Apr", "Late-season marketing window"],
    ["Year-round", "Karnataka, Tamil Nadu (Nilgiris)", "Rolling", "Rolling", "Off-season niche, hill conditions"],
    ["Spring", "Punjab (limited)", "Jan–Feb", "May–Jun", "Seed-multiplication crop"],
  ];

  const varietyRows = [
    ["Kufri Pukhraj", "1998", "Table (early)", "UP, Gujarat, Punjab, Haryana", "~40 t/ha", "16.1%", "70–90 d"],
    ["Kufri Jyoti", "1968", "Table", "All-India", "25–30 t/ha", "18–20%", "90–100 d"],
    ["Kufri Bahar", "1980", "Table", "UP, Haryana, Bihar", "~45 t/ha", "17–19%", "100–110 d"],
    ["Kufri Badshah", "1980", "Table", "MP, Maharashtra, Gujarat", "~50 t/ha", "17–19%", "100–110 d"],
    ["Kufri Sindhuri", "1967", "Table (red skin)", "Bihar, Maharashtra, Gujarat", "25–30 t/ha", "16–18%", "110–120 d"],
    ["Kufri Chandramukhi", "1968", "Table (early)", "All-India", "20–25 t/ha", "17–19%", "75–90 d"],
    ["Kufri Khyati", "—", "Table (heat-tolerant)", "Gujarat, Rajasthan", "28–32 t/ha", "17–19%", "Early"],
    ["Kufri Chipsona 3", "2005", "Chip processing", "Punjab, Gujarat, MP", "28–32 t/ha", "21–23%", "Medium"],
    ["Kufri Frysona", "2014", "French fry", "Gujarat, MP", "28–30 t/ha", "21–23%", "Medium"],
    ["Santana (imported)", "—", "French fry", "Gujarat (McCain contract)", "30–35 t/ha", "22–24%", "Medium"],
    ["Lady Rosetta (imported)", "—", "Chip processing", "Gujarat, Punjab", "28–30 t/ha", "21–23%", "Medium"],
    ["Kufri Tejas", "2025", "Table (heat-tolerant)", "HR, PB, UP, MP, GJ, MH", "37–40 t/ha", "18–20%", "90 d"],
    ["Kufri Ratan", "2025", "Table (red skin)", "HR, PB, UK, UP, MP, RJ", "37–39 t/ha", "18–20%", "90 d"],
    ["Kufri Chipbharat 1", "2025", "Chip processing", "10-state release", "35–38 t/ha", "~21%", "100 d"],
  ];

  const tradeRows = [
    ["Frozen French fries", "Exports", "268,342 t (2024)", "+30.9% YoY", "8th-largest exporter globally"],
    ["Frozen French fries", "Exports value", "₹1,479 cr (~$178 M)", "2023-24 (APEDA)", "Major destinations: SE Asia, Middle East"],
    ["Fresh potatoes", "Exports", "~270,000 t/yr", "stable", "Sri Lanka, Nepal, Malaysia, UAE, Oman"],
    ["Seed potatoes", "Imports", "Limited (~10K t)", "—", "Mostly Netherlands, Germany; for processing varieties"],
    ["Processed potato products", "Domestic market", "$1.8 B (2024)", "~10% CAGR through 2033", "Frozen-fry-led growth"],
    ["McAloo Tikki / fry trade", "Domestic + export", "Significant", "Growing", "McDonald's India sources from Mehsana"],
  ];

  const companyRows = [
    ["McCain Foods (Canada)", "French fries (frozen)", "Mehsana, Gujarat", "Flagship 2007 plant; 2013 expansion ($69M); supplies McDonald's India"],
    ["PepsiCo / Frito-Lay", "Chips (Lay's, Uncle Chipps, Kurkure)", "Pune, Channo, Mathura", "Largest chip player; uses Kufri Chipsona 3 + imported"],
    ["ITC Limited", "Chips (Bingo)", "Multi-site", "#2 chip brand; sources Atlantic + Chipsona"],
    ["Haldiram's", "Chips, traditional snacks (aloo bhujia)", "Nagpur, Delhi NCR", "Strong North-Indian distribution; aloo bhujia volume leader"],
    ["Balaji Wafers", "Chips", "Rajkot, Gujarat", "Regional Gujarat dominance, growing nationally"],
    ["HyFun Foods", "Frozen fries, hash browns", "Mehsana, Gujarat", "Domestic + export player; 80,000 t capacity"],
    ["Iscon Balaji", "Frozen potato products", "Gujarat", "Newer entrant in fry/hash-brown space"],
    ["Bikanervala / Bikaji", "Snack potatoes (bhujia, namkeen)", "Bikaner, Rajasthan", "Traditional sweet-and-namkeen integration"],
  ];

  const coldStorageRows = [
    ["Uttar Pradesh", "~2,300", "Largest absolute capacity", "Insufficient vs 20+ M t production"],
    ["West Bengal", "580", "~7–8 M t (largest potato-specific)", "Stores 40–45% of state production"],
    ["Bihar", "Limited", "1.23 M t", "Stores only 15% of production; 12 districts have ZERO cold storage"],
    ["Gujarat", "1,500+", "Concentrated Banaskantha & Mehsana", "Processing-grade storage hub"],
    ["Punjab", "Significant", "Major seed storage", "Network supports seed-multiplication"],
    ["National total", "~8,600", "39.42 M t (NHB)", "World's 2nd-largest cold-storage network"],
  ];

  const seedSystemRows = [
    ["Annual seed requirement", "8 M tonnes", "(CPRI Vision 2050)"],
    ["Certified seed share", "~15%", "vs. ~85% farm-saved"],
    ["Virus incidence in farm-saved", "30–60%", "Singh & Pandey, Potato Journal 2019"],
    ["CPRI aeroponic minituber yield", "30–60 minitubers/plant", "vs. 5–8 in conventional field production"],
    ["Aeroponic capacity (Shimla)", "100,000–150,000 minitubers/season", "since 2010, technology licensed to states"],
    ["Yield penalty from saved seed", "20–30% per generation", "compounding rapidly"],
  ];

  const consumptionDishes = [
    { region: "North", dishes: "Aloo paratha, aloo gobi, dum aloo (Kashmiri), samosa, aloo tikki, chana bhatura with aloo" },
    { region: "West", dishes: "Vada pav, batata vada (Maharashtra), pav bhaji, aloo bonda, batata poha" },
    { region: "South", dishes: "Aloo bonda, urulai roast, potato biryani, masala dosa filling, potato curry with sambar" },
    { region: "East", dishes: "Aloo posto (Bengal poppy seed), shorshe aloo, alur dom (Bengali dum aloo)" },
    { region: "Pan-Indian", dishes: "Aloo chaat, aloo bhujia (snack), McAloo Tikki (McDonald's India), Kurkure" },
  ];

  const challengeRows = [
    ["Price volatility", "300% seasonal price swings (peak harvest vs lean season)", "Inadequate cold storage in eastern states + APMC mandi structure"],
    ["Climate change in IGP", "Growing season shortening 5–10 days/decade (CPRI)", "Heat stress + groundwater depletion in PB/HR/W-UP"],
    ["Seed quality crisis", "Only 15% certified seed; 30–60% virus in farm-saved", "20–30% yield penalty per generation of saved seed"],
    ["Cold chain gaps", "10–15% post-harvest loss (6–9 M t); Bihar at 15% storage rate", "Eastern states severely underserved; 12 Bihar districts have zero cold stores"],
    ["Processing under-utilization", "Only 7–8% processed (vs 60–65% in US)", "Limits value-add and farmer income stability"],
    ["Smallholder constraints", "Average holding <1 ha", "Mechanization, finance, and seed access lag commercial farms"],
  ];

  const policyRows = [
    ["Essential Commodities Act (1955)", "Potato classified essential commodity (post-2020 amendments allow stock-limit imposition during volatility)"],
    ["APMC Mandis", "Primary marketing channel; price discovery; farmer–trader interface"],
    ["NHM (National Horticulture Mission)", "Subsidies for cold storage construction (50% Type-1 unit subsidy), seed production, micro-irrigation"],
    ["NHB (National Horticulture Board)", "Cold storage policy framework; regulates 8,600+ facilities"],
    ["MIDH (Mission for Integrated Development of Horticulture)", "Umbrella scheme covering NHM + Horticulture Mission for North East and Himalayan States"],
    ["PM-KISAN", "Direct income support to farmers (₹6,000/year); applies to potato growers"],
    ["MSP (Minimum Support Price)", "Not formally extended to potato (unlike wheat/rice); proposed periodically"],
  ];

  const pageUrl = "https://www.potatopedia.com/country/india";
  const generatedDate = "April 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "India Potato Industry Profile — Production, Varieties, Trade & Processing",
        description: "Comprehensive country profile of India's potato industry. World's #2 producer at 60.14 M tonnes (FAOSTAT 2023). Uttar Pradesh leads at 33.5%. Complete data on Kufri varieties, frozen-fry exports (+30.9% in 2024), processing industry, agro-climatic zones, cold storage (39.42 M t capacity), seed system, and policy.",
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
        publisher: { "@id": "https://www.potatopedia.com/#publisher" },
        mainEntityOfPage: pageUrl,
        image: "https://www.potatopedia.com/og-image.png",
        about: { "@type": "Country", name: "India" },
        speakable: SPEAKABLE,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
          { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: "India" } },
        ],
      },
      {
        "@type": "Dataset",
        name: "India Potato Production by State 2023-24",
        description: "Production tonnage and percentage of national output by Indian state.",
        creator: { "@type": "Organization", name: "Potatopedia" },
        license: "https://www.potatopedia.com/about",
        keywords: ["India", "potato", "production", "state", "FAOSTAT", "ICAR-CPRI", "rabi"],
        url: pageUrl,
      },
    ],
  };

  // Style helpers
  const sectionWrap = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
  const sectionTitle = { fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px", paddingLeft: 12, borderLeft: "4px solid #C62828", lineHeight: 1.2 };
  const tableTH = { padding: "10px 12px", textAlign: "left", background: "#C62828", color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 };
  const tableTD = { padding: "10px 12px", fontSize: 13.5, borderBottom: "1px solid #eee", color: "#333" };
  const proseP = { fontSize: 14.5, color: "#444", lineHeight: 1.7, margin: "0 0 12px" };
  const sourceLine = { fontSize: 12, color: "#999", fontStyle: "italic", margin: "4px 0 0" };

  return (
    <div className="pp-country-page pp-country-india" style={{ minHeight: "100vh", background: "#fff", overflowX: "hidden", fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{ppCSS}</style>
      <style>{printCSS}</style>
      <style>{`
        /* Mobile PDF CTA: shown only below 768px; hidden on desktop where banner button handles it */
        .pp-mobile-pdf-cta { display: none; }
        @media (max-width: 768px) {
          .pp-india-banner-row { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
          .pp-india-banner-pdf { display: none !important; }
          .pp-vital-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-trade-grid { grid-template-columns: 1fr !important; }
          .pp-quickfacts-grid { grid-template-columns: 1fr !important; }
          .pp-india-comparable-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-india-related-grid { grid-template-columns: 1fr !important; }
          .pp-cuisine-grid { grid-template-columns: 1fr !important; }
          .pp-mobile-pdf-cta { display: block !important; }
        }
        @media (max-width: 480px) {
          .pp-vital-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
        .pp-share-bar-track { position: relative; height: 6px; background: rgba(198,40,40,0.08); border-radius: 3px; min-width: 80px; margin-top: 4px; }
        .pp-share-bar-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg,#C62828,#E53935); border-radius: 3px; }
        .pp-quickfact-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .pp-quickfact-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(198,40,40,0.08); }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Print-only branded header (visible only when printing — proper padding) */}
      <div className="pp-print-only pp-print-header">
        <div className="pp-print-header-row">
          <div className="pp-print-header-brand">POTATOPEDIA</div>
          <div className="pp-print-header-meta">
            <div>The World&apos;s Potato Intelligence Platform</div>
            <div>potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia</div>
            <div>Generated {generatedDate}</div>
          </div>
        </div>
      </div>

      {/* Bulletproof per-page footer (Safari fallback for @page @bottom-center) */}
      <div className="pp-print-footer-fixed" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      {/* ─── S1 · Executive Banner ─── */}
      <section className="pp-india-banner" style={{ borderBottom: "2px solid #C62828", background: "linear-gradient(180deg,#FFF 0%,#FFF8F8 100%)" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ paddingTop: 24, paddingBottom: 8 }}>
            <Link href="/countries" className="pp-no-print" style={{ fontSize: 12, color: "#C62828", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
              &larr; All Countries
            </Link>
          </div>
          <div className="pp-india-banner-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, paddingBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div className="pp-india-banner-flag" style={{ fontSize: 80, lineHeight: 1 }}>{c.flag}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#C62828", padding: "4px 10px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>#{c.rank} Global Producer</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>{c.region}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>FAOSTAT 2023</span>
                </div>
                <h1 style={{ fontSize: 44, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: -1.5, lineHeight: 1.1 }}>{c.name}</h1>
                <p className="pp-india-tagline" style={{ fontSize: 16, color: "#444", margin: "10px 0 0", lineHeight: 1.5, maxWidth: 600 }}>
                  World&apos;s <strong>#2 potato producer</strong> at <strong style={{ color: "#C62828" }}>60.14 M tonnes</strong>. Uttar Pradesh leads at 33.5% of national output. Frozen French fry exports up <strong>30.9% in 2024</strong>.
                </p>
              </div>
            </div>
            <div className="pp-india-banner-pdf">
              <PdfDownloadButton size="md" placement="banner" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── S1.5 · State Gateway (Option C — Hero Anchor Strip) ─── */}
      <style>{`
        .pp-state-gateway-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
        .pp-state-gateway-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .pp-state-gateway-card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.06), 0 12px 32px rgba(198,40,40,0.08); }
        .pp-state-gateway-cta { transition: background 0.18s ease, color 0.18s ease; }
        .pp-state-gateway-card:hover .pp-state-gateway-cta { background: linear-gradient(135deg,#C62828,#E53935); color: #fff !important; }
        @media (max-width: 1024px) { .pp-state-gateway-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .pp-state-gateway-scroll { display: flex !important; overflow-x: auto; scroll-snap-type: x mandatory; gap: 12px; padding: 0 20px 8px; -webkit-overflow-scrolling: touch; }
          .pp-state-gateway-scroll::-webkit-scrollbar { display: none; }
          .pp-state-gateway-scroll { scrollbar-width: none; }
          .pp-state-gateway-grid { display: none !important; }
          .pp-state-gateway-card-mobile { flex: 0 0 88%; scroll-snap-align: start; }
        }
        @media (min-width: 769px) { .pp-state-gateway-scroll { display: none !important; } }
      `}</style>
      <section className="pp-state-gateway" style={{ background: "#FAFAFA", borderTop: "4px solid #C62828", borderBottom: "1px solid #f0f0f0", padding: "56px 0 48px" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ marginBottom: 24, maxWidth: 800 }}>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Explore by State</span>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.8, lineHeight: 1.25, margin: "0 0 12px" }}>India&apos;s 14 Potato State Profiles &mdash; Deep Industry Coverage</h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: 0 }}>Each profile covers state-level production from DA&amp;FW Horticultural Statistics at a Glance 2024 plus district-wise data where available, ICAR-CPRI variety recommendations, research infrastructure, and honest data-scope notes &mdash; drawn from ICAR-CPRI, DA&amp;FW, NHB, ICAR-RCNEH, state agricultural universities, and peer-reviewed sources.</p>
          </div>
          {(() => {
            const stateGateway = [
              { slug: "uttar-pradesh", name: "Uttar Pradesh", rank: "#1", prod: "20.13M tonnes", share: "33.46% of India", teaser: "Agra district leads at 2.8M tonnes — 27% of state output. 600,000+ ha cultivated. Cold storage capital of India.", variety: "Kufri Bahar" },
              { slug: "west-bengal", name: "West Bengal", rank: "#2", prod: "11–12M tonnes", share: "21–24% of India", teaser: "Hooghly delivers ~40% of state output. India's #2 potato district. 580+ cold storage units; 76+ in Hooghly alone.", variety: "Kufri Jyoti" },
              { slug: "bihar", name: "Bihar", rank: "#3", prod: "9.075M tonnes", share: "15.09% of India", teaser: "Nalanda triangle anchors production. CPRI's 1949 birthplace. 12 districts have zero cold storage.", variety: "Kufri Anand" },
              { slug: "gujarat", name: "Gujarat", rank: "#4", prod: "4.86M tonnes", share: "#1 in processing", teaser: "Sabarkantha at 34.13 t/ha — India's highest district yield. HyFun Foods 250K+ t/yr. Deesa is 'Bataka Nagari'.", variety: "Kufri Chipsona-3" },
              { slug: "madhya-pradesh", name: "Madhya Pradesh", rank: "#5", prod: "3.949M tonnes", share: "6.92% of India", teaser: "Indore is the dominant district at 46,500 ha and 1.186 Mt (30% of state). Hosts the ICAR-CPRI Regional Research Station at Gwalior and a licensed aeroponic seed facility (May 2022).", variety: "Kufri Tejas (ICAR rec.)" },
              { slug: "assam", name: "Assam", rank: "#7", prod: "911.33K tonnes", share: "1.60% of India", teaser: "Largest NE producer (~70% of NE region share). Structural yield deficit: 8.56 t/ha is 35% of national average. Served by ICAR-RCNEH and Assam Agricultural University.", variety: "Kufri Tejas / Chipbharat (ICAR rec.)" },
              { slug: "jharkhand", name: "Jharkhand", rank: "#8", prod: "766.82K tonnes", share: "1.34% of India", teaser: "Ranchi leads at 200,323 tonnes (27% of state). Bokaro tops productivity at 27.70 t/ha. Birsa Agricultural University in Ranchi administers 16 KVKs.", variety: "Kufri Ratan (ICAR rec.)" },
              { slug: "maharashtra", name: "Maharashtra", rank: "#11", prod: "386.69K tonnes", share: "0.68% of India", teaser: "Consolidation story: −37% area but +35% yield to 26.77 t/ha over 5 years. Only audit-9 state explicitly named in an ICAR-CPRI variety zone designation (Kufri Tejas).", variety: "Kufri Tejas (ICAR rec.)" },
              { slug: "meghalaya", name: "Meghalaya", rank: "#12", prod: "196.25K tonnes", share: "0.34% of India", teaser: "Hosts the ICAR-RCNEH Northeast research HQ at Umiam (Barapani), established 9 Jan 1975. Stable highland series ~10 t/ha. 2nd-largest NE producer.", variety: "Kufri (ICAR-RCNEH rec.)" },
              { slug: "tripura", name: "Tripura", rank: "#13", prod: "146.05K tonnes", share: "0.26% of India", teaser: "Highest productivity in the NE (19.16 t/ha — more than double Assam's). Stable small-scale cropping. Served by ICAR-RCNEH Lembucherra.", variety: "Kufri (ICAR-RCNEH rec.)" },
              { slug: "nagaland", name: "Nagaland", rank: "#17", prod: "55.12K tonnes", share: "0.10% of India", teaser: "Among the most stable series in India — area, production and productivity essentially flat across 5 years. No growth or decline narrative to report.", variety: "Kufri (ICAR-RCNEH rec.)" },
              { slug: "andhra-pradesh", name: "Andhra Pradesh", rank: "#19", prod: "17.76K tonnes", share: "0.03% of India", teaser: "State retreating from the crop: −79% area and −64% production over 5 years. Primary sources document the decline but do not establish its cause.", variety: "(ICAR rec.; small footprint)" },
              { slug: "manipur", name: "Manipur", rank: "#20", prod: "14.63K tonnes", share: "0.03% of India", teaser: "Small producer. Series shows an apparent 22× area jump 2019-20 → 2021-22 — flagged honestly as reporting-baseline revision, not real agronomic growth.", variety: "Kufri (ICAR-RCNEH rec.)" },
              { slug: "arunachal-pradesh", name: "Arunachal Pradesh", rank: "#22", prod: "6.07K tonnes", share: "0.01% of India", teaser: "India's smallest measurable producer. 4 years of identical figures then a 22× step change in 2023-24 — almost certainly survey methodology revision.", variety: "Kufri (ICAR-RCNEH rec.)" },
            ];
            const cardStyle = { background: "#fff", border: "1px solid #ececec", borderTop: "4px solid #C62828", borderRadius: 12, padding: "18px 18px 16px", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", minHeight: 220 };
            const renderCard = (s, mobileClass) => (
              <a key={s.slug} href={`/country/india/${s.slug}`} className={`pp-state-gateway-card ${mobileClass || ""}`} style={cardStyle}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "#C62828", background: "#fff", border: "1px solid rgba(198,40,40,0.25)", padding: "3px 10px", borderRadius: 14, lineHeight: 1 }}>{s.rank}</span>
                  <span style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 1.2 }}>India</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.4, marginBottom: 6, lineHeight: 1.25 }}>{s.name}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{s.prod}<span style={{ fontSize: 11, color: "#999", fontWeight: 500 }}> /yr</span></div>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", background: "rgba(198,40,40,0.06)", padding: "3px 8px", borderRadius: 6, marginBottom: 10, alignSelf: "flex-start" }}>{s.share}</div>
                <div style={{ fontSize: 12.5, color: "#555", lineHeight: 1.55, marginBottom: 12, flex: 1 }}>{s.teaser}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ display: "inline-block", fontSize: 10, color: "#666", fontWeight: 600, background: "#FAFAFA", border: "1px solid #ececec", padding: "2px 8px", borderRadius: 4 }}>{s.variety}</span>
                </div>
                <div className="pp-state-gateway-cta" style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 8, padding: "9px 12px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#C62828" }}>Explore {s.name} →</div>
              </a>
            );
            return (
              <>
                <div className="pp-state-gateway-grid">
                  {stateGateway.map((s) => renderCard(s))}
                </div>
                <div className="pp-state-gateway-scroll">
                  {stateGateway.map((s) => renderCard(s, "pp-state-gateway-card-mobile"))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* ─── S2 · Vital Statistics Dashboard ─── */}
      <section className="pp-vital-stats" style={{ background: "#0F1115", padding: "40px 0", color: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div data-summary="true" className="pp-vital-stats-summary" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #E53935", borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 28, fontSize: 14, lineHeight: 1.7, color: "#E5E5E5" }}>
            <strong style={{ color: "#fff" }}>India produced 60.14 million tonnes of potatoes in 2023</strong> (FAOSTAT) on 2.33 million hectares, ranking <strong>#2 globally</strong> after China. National yield of 25.8 t/ha is above the world average of 22.8 t/ha. <strong>Uttar Pradesh accounts for 33.46%</strong> of national output (20.13 M t). <strong>85% of India&apos;s crop is grown during the rabi (winter) season.</strong> Processing share is just 7&ndash;8% of total production but frozen French fry exports grew <strong>30.9% in 2024</strong> to 268,342 tonnes &mdash; the 8th-largest exporter globally. India operates the world&apos;s 2nd-largest cold storage network at 39.42 M tonnes capacity. Only 15% of seed used is certified.
          </div>
          <div className="pp-vital-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {stats.map((s, i) => (
              <div key={i} className="pp-vital-stat-cell" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "18px 16px" }}>
                <div className="pp-vital-stat-value" style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                  {s.positive && <span className="pp-delta-up" style={{ display: "inline-block", marginLeft: 8, fontSize: 10, fontWeight: 700, color: "#4CAF50", background: "rgba(76,175,80,0.12)", padding: "2px 6px", borderRadius: 3, verticalAlign: "middle" }}>YoY</span>}
                </div>
                <div className="pp-vital-stat-label" style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 1.2, marginTop: 8 }}>{s.label}</div>
                <div className="pp-vital-stat-sub" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mobile-only PDF download CTA (between stats and quick facts) ─── */}
      <section className="pp-mobile-pdf-cta pp-no-print" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "20px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <PdfDownloadButton size="md" placement="banner" />
          <div style={{ fontSize: 11, color: "#888", marginTop: 8, fontWeight: 500 }}>A4-formatted report &middot; all sections, all tables</div>
        </div>
      </section>

      {/* ─── S3 · Quick Facts Strip ─── */}
      <section className="pp-trajectory-band" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "32px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, marginBottom: 16 }}>FAOSTAT 7-year production trajectory</h2>
          <TrajectoryTable slug={c.slug} />
        </div>
      </section>

      <section className="pp-quickfacts" data-pdf-break-after style={{ background: "#FAFAFA", borderBottom: "1px solid #f0f0f0", padding: "40px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Did you know?</h2>
          <div className="pp-quickfacts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {quickFacts.map((f, i) => (
              <div key={i} className="pp-quickfact-card" style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "16px 18px", fontSize: 13.5, color: "#333", lineHeight: 1.55, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, color: "#C62828", fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>&#9642;</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── S4 · Production by State ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Production by State</h2>
          <p style={proseP}>The Indo-Gangetic Plain dominates: the top three states (Uttar Pradesh, West Bengal, Bihar) together account for approximately <strong>70% of national production</strong> (DA&amp;FW Horticultural Statistics at a Glance 2024). Gujarat is the centre of processing-grade and exportable potato cultivation, hosting roughly 80% of India&apos;s organised processing capacity.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["State", "Production (M t)", "% of National", "Season", "Dominant Varieties"].map((h, idx) => <th key={h} style={{ ...tableTH, width: idx === 2 ? "20%" : undefined }}>{h}</th>)}</tr></thead>
              <tbody>
                {stateRows.map((r, i) => {
                  const stateProfileMap = { "Uttar Pradesh": "uttar-pradesh", "West Bengal": "west-bengal", "Bihar": "bihar", "Gujarat": "gujarat", "Madhya Pradesh": "madhya-pradesh", "Maharashtra": "maharashtra", "Jharkhand": "jharkhand", "Assam": "assam", "Andhra Pradesh": "andhra-pradesh", "Meghalaya": "meghalaya", "Tripura": "tripura", "Nagaland": "nagaland", "Manipur": "manipur", "Arunachal Pradesh": "arunachal-pradesh" };
                  const profileSlug = stateProfileMap[r[0]];
                  return (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: i < 3 ? 700 : 500, color: "#1A1A1A" }}>{profileSlug ? <Link href={`/country/india/${profileSlug}`} style={{ color: "#C62828", textDecoration: "none", fontWeight: i < 3 ? 700 : 600 }}>{r[0]} →</Link> : r[0]}</td>
                    <td style={{ ...tableTD, color: i < 3 ? "#C62828" : "#1A1A1A", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{r[2].toFixed(1)}%</span>
                        <div className="pp-share-bar-track">
                          <div className="pp-share-bar-fill" style={{ width: Math.min(100, r[2] * 2.8) + "%" }} />
                        </div>
                      </div>
                    </td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, color: "#666", fontSize: 12.5 }}>{r[4]}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: FAOSTAT 2023 (national); ICAR-CPRI state-wise estimates 2023-24; Gujarat Agriculture Department; PIB Government of India. Top-5 state names link to dedicated industry profiles above; full state deep-dives are linked at the top of this page.</p>

          <div className="pp-ai-inline-cta pp-no-print" style={{ marginTop: 16, padding: "10px 16px", background: "rgba(198,40,40,0.04)", borderLeft: "3px solid #C62828", borderRadius: "0 6px 6px 0", fontSize: 13, color: "#444" }}>
            Want details on a specific state or district? <a href="#ai-explorer" style={{ color: "#C62828", fontWeight: 600, textDecoration: "none" }}>Ask Potatopedia AI &rarr;</a>
          </div>
        </div>
      </section>

      {/* ─── S5 · Growing Calendar & Agro-Climatic Zones ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Growing Calendar &amp; Agro-Climatic Zones</h2>
          <p style={proseP}>India&apos;s potato cultivation spans <strong>eight ICAR-CPRI agro-ecological zones</strong>, from sea-level coast to 4,000 m altitude. The rabi (winter) season dominates national output; kharif (summer) and year-round hill cultivation are crucial for virus-free seed production. Climate change is shortening the rabi growing window in the Indo-Gangetic Plains by an estimated <strong>5&ndash;10 days per decade</strong> (CPRI Vision 2050).</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["Season / Zone", "Region", "Planting", "Harvest", "Share of National Output"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {seasonRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: ICAR-CPRI agro-climatic zone classification; Department of Agriculture &amp; Farmers Welfare 2023-24.</p>
        </div>
      </section>

      {/* ─── S6 · Variety Portfolio ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Variety Portfolio</h2>
          <p style={proseP}>India&apos;s ICAR-Central Potato Research Institute (CPRI) in Shimla has released <strong>75+ Kufri varieties</strong> since the 1960s, and CPRI-bred varieties now occupy <strong>94%+ of Indian potato acreage</strong>. <strong>Kufri Pukhraj is the single most-planted variety nationwide</strong>, dominant in UP, Gujarat, and Punjab. Processing varieties (Chipsona series, Frysona, plus imported Santana and Lady Rosetta under contract) cover the rapidly growing chip and frozen-fry industries. The 2025 release wave (Tejas, Ratan, Chipbharat 1) yields <strong>37&ndash;40 t/ha</strong> &mdash; a 60&ndash;70% jump over Kufri Jyoti from 1968.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Variety", "Year", "Type", "Key States", "Yield", "Dry Matter", "Maturity"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {varietyRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: r[2].includes("processing") || r[2].includes("French") || r[2].includes("Chip") ? "#C62828" : "#1A1A1A", fontWeight: 500 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                    <td style={tableTD}>{r[4]}</td>
                    <td style={tableTD}>{r[5]}</td>
                    <td style={tableTD}>{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: ICAR-CPRI variety catalogue; PIB variety-release notifications 2024 &amp; 2025; Gujarat Agriculture Department processing-variety data.</p>
          <p className="pp-read-more-link" style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}>Read more: <Link href="/knowledge/kufri-potato-varieties-india" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Complete Kufri Varieties Guide &rarr;</Link></p>
        </div>
      </section>

      {/* ─── S7 · Trade Profile ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Trade Profile</h2>
          <p style={proseP}>India has transformed from a net potato importer into the <strong>world&apos;s 8th-largest frozen French fry exporter</strong> in under a decade. <strong>Frozen fry exports reached 268,342 tonnes in 2024 (+30.9% YoY)</strong>, valued at over $178 million in 2023-24 (APEDA). Major destinations: Southeast Asia (Vietnam, Philippines, Indonesia), the Middle East (UAE, Saudi Arabia, Qatar), and select African markets. India also exports approximately 270,000 tonnes of fresh potatoes annually, primarily to <Link href="/country/nepal" style={{ color: "#C62828", textDecoration: "none" }}>Nepal</Link>, <Link href="/country/bangladesh" style={{ color: "#C62828", textDecoration: "none" }}>Bangladesh</Link>, Sri Lanka, Malaysia, UAE, and Oman.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", background: "#fff" }}>
              <thead><tr>{["Category", "Direction", "Volume / Value", "Trend / Year", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {tradeRows.map((r, i) => (
                  <tr key={r[0] + i} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: APEDA 2023-24 trade data; DGCIS; FAOSTAT global trade flow 2024.</p>
          <div className="pp-trajectory-callout" style={{ marginTop: 16, padding: "16px 20px", background: "linear-gradient(135deg,rgba(198,40,40,0.04),rgba(229,57,53,0.02))", border: "1px solid rgba(198,40,40,0.12)", borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Frozen Fry Trajectory</div>
            <div style={{ fontSize: 14, color: "#1A1A1A", lineHeight: 1.6 }}>
              <strong>2015:</strong> 5,000 tonnes &nbsp;&rarr;&nbsp; <strong>2020:</strong> ~80,000 tonnes &nbsp;&rarr;&nbsp; <strong>2024:</strong> 268,342 tonnes &mdash; a <strong style={{ color: "#C62828" }}>54&times; increase</strong> in nine years.
            </div>
          </div>
        </div>
      </section>

      {/* ─── S8 · Industry & Processing ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Processing Industry &amp; Major Players</h2>
          <p style={proseP}>India processes only <strong>7&ndash;8% of its potato crop</strong> &mdash; vs. 60&ndash;65% in the United States and 15% in China. The gap is the growth headroom: India&apos;s processed-potato market is valued at <strong>$1.8 billion (2024)</strong> with projected 10% CAGR through 2033. <strong>Gujarat hosts 80% of processing capacity</strong>, anchored by McCain&apos;s Mehsana facility (2007 plant; $69M expansion in 2013). The chip segment is led by PepsiCo/Frito-Lay (Lay&apos;s, Uncle Chipps, Kurkure), ITC (Bingo), and Haldiram&apos;s (aloo bhujia volume leader). Processing growth has driven Gujarat farmer incomes up an average <strong>75% since 2017</strong>.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Company", "Category", "Key Location", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {companyRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Company filings; APEDA processor registry; Gujarat Agriculture Department; ICAR-CPRI processing-industry research.</p>
          <p className="pp-read-more-link" style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}>Read more: <Link href="/knowledge/how-potatoes-are-processed" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>How Potatoes Are Processed: Farm to Fry &rarr;</Link> &middot; <Link href="/knowledge/mcdonalds-potato-varieties" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>What Potatoes Does McDonald&apos;s Use? &rarr;</Link></p>
        </div>
      </section>

      {/* ─── S9 · Cold Storage Infrastructure (NEW) ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Cold Storage Infrastructure</h2>
          <p style={proseP}>India operates the <strong>world&apos;s second-largest potato cold-storage network</strong> &mdash; approximately <strong>8,600 facilities</strong> with <strong>39.42 million tonnes total capacity</strong> (National Horticulture Board). Roughly 75% of this horticultural capacity is dedicated to potatoes, giving India ~29&ndash;30 M tonnes of potato-specific storage. Despite this scale, cold-chain capacity remains critically uneven across states: West Bengal can only store 40&ndash;45% of state production; Bihar manages just 15%; <strong>12 Bihar districts have zero cold-storage facilities</strong>. The Government of India provides <strong>50% subsidies</strong> on new Type-1 cold-storage units under NHM/MIDH schemes.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["State", "Approx. Facilities", "Potato-Specific Capacity", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {coldStorageRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: National Horticulture Board (NHB); All-India Coordinated Research Project on Potato (AICRP); CPRI cold-chain research.</p>
          <p className="pp-read-more-link" style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}>Read more: <Link href="/knowledge/potato-storage-cold-chain" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Potato Cold Storage: Temperatures, Design, and Post-Harvest Losses &rarr;</Link></p>
        </div>
      </section>

      {/* ─── S10 · Seed Potato System (NEW) ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Seed Potato System: India&apos;s 85% Problem</h2>
          <p style={proseP}>India&apos;s annual seed potato requirement is approximately <strong>8 million tonnes</strong> &mdash; but only <strong>15% is met by certified seed</strong>, while <strong>85% is farm-saved</strong> (CPRI Vision 2050; Singh &amp; Pandey, Potato Journal 2019). This is one of the world&apos;s lowest certified-seed adoption rates and CPRI identifies it as the &ldquo;single largest constraint on Indian potato productivity improvement.&rdquo; Farm-saved seed carries <strong>30&ndash;60% virus incidence</strong> versus near-zero in certified material, producing a 20&ndash;30% yield penalty per generation that compounds over years.</p>
          <p style={proseP}>To address this, ICAR-CPRI pioneered <strong>aeroponic minituber production</strong> at Shimla since 2010 &mdash; producing 30&ndash;60 minitubers per plant versus 5&ndash;8 in conventional field multiplication. Current capacity is 100,000&ndash;150,000 minitubers per season. The technology has been licensed to state agricultural universities (Punjab, Haryana, Karnataka) and select private companies for commercial multiplication.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Metric", "Value", "Source / Note"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {seedSystemRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CPRI Vision 2050; Singh &amp; Pandey, Potato Journal (2019); ICAR-CPRI aeroponic facility documentation.</p>
          <p className="pp-read-more-link" style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}>Read more: <Link href="/knowledge/seed-potato-systems" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Seed Potato Systems: Certification, Trade &amp; Multiplication &rarr;</Link></p>
        </div>
      </section>

      {/* ─── S11 · Consumption & Cuisine (NEW) ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Consumption &amp; Indian Cuisine</h2>
          <p style={proseP}>India&apos;s per-capita potato consumption is approximately <strong>28 kg per year</strong> &mdash; below the global average of 33 kg but rising steadily as urban income growth fuels both fresh and processed demand. <strong>Fresh consumption dominates at 68.5% of total utilisation</strong>; processed potato (chips, frozen fries, dehydrated, flakes) is just 7&ndash;8% but growing 10%+ annually. The potato is integral to virtually every regional cuisine, with hundreds of preparations across India&apos;s culinary geography.</p>
          <div className="pp-cuisine-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: 16 }}>
            {consumptionDishes.map((c2, i) => (
              <div key={c2.region} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "18px 20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{c2.region} India</div>
                <div style={{ fontSize: 14, color: "#1A1A1A", lineHeight: 1.6 }}>{c2.dishes}</div>
              </div>
            ))}
          </div>
          <p style={{ ...proseP, marginTop: 18 }}>Notable: McDonald&apos;s India built its entire menu around the <strong>McAloo Tikki</strong> (a potato cutlet burger sourcing locally-supplied potatoes through McCain&apos;s Mehsana plant). The samosa and aloo paratha are arguably the two most globally recognised Indian potato preparations, while regional specialties like Bengali aloo posto, Kashmiri dum aloo, and Mumbai vada pav represent the breadth of culinary integration.</p>
          <p style={sourceLine}>Source: FAO consumption data; ICAR-CPRI utilisation breakdown; cultural-cuisine encyclopedias.</p>
        </div>
      </section>

      {/* ─── S12 · Government Policy ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Government Policy &amp; Regulatory Framework</h2>
          <p style={proseP}>India&apos;s potato sector operates under a multi-layered policy regime: state-run APMC mandis as the primary marketing channel, the Essential Commodities Act framework permitting stock-limit imposition during volatility, and central horticulture missions providing capital subsidies for cold storage and seed production. Unlike wheat and rice, potato does <strong>not</strong> have a formal MSP (Minimum Support Price) &mdash; price discovery is left to mandi auctions, which contributes to the pronounced volatility documented in challenges below.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Policy / Programme", "Description"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {policyRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600, width: "32%" }}>{r[0]}</td>
                    <td style={{ ...tableTD, fontSize: 13, color: "#1A1A1A" }}>{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Ministry of Agriculture &amp; Farmers Welfare; PIB; National Horticulture Board policy documents.</p>
        </div>
      </section>

      {/* ─── S13 · Challenges (NEW) ─── */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Industry Challenges</h2>
          <p style={proseP}>India&apos;s status as the world&apos;s #2 potato producer masks structural pressures across price formation, climate adaptation, seed quality, and cold-chain coverage. Each challenge below has direct, measurable impact on farmer income, marketable yield, and value-chain efficiency.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["Challenge", "Magnitude", "Root Driver / Note"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {challengeRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#444" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CPRI Vision 2050; Singh et al. (Potato Journal, 2022); ICAR-CPRI climate-impact research; NHB cold-storage policy reviews.</p>
        </div>
      </section>

      {/* ─── S14 · Future Outlook ─── */}
      <section style={{ padding: "44px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Future Outlook</h2>
          <p style={proseP}>Three trajectories define India&apos;s potato sector to 2030:</p>
          <p style={proseP}><strong>1. Processing surge.</strong> The 7&ndash;8% processing share is projected to reach 15&ndash;20% by 2030, narrowing the gap with global peers and unlocking ~$3&ndash;4B in additional value-add. Frozen-fry exports continue 25&ndash;30% annual growth.</p>
          <p style={proseP}><strong>2. Climate-resilient varieties.</strong> The 2024&ndash;25 release wave (Kufri Tejas, Bhaskar, Ratan) deliberately targets heat-tolerance for the warming Indo-Gangetic Plain. Kufri Thar series targets the arid zone (Rajasthan, Gujarat). Biofortified Kufri Jamunia (purple-flesh, anthocyanin-rich) opens nutrition-positioned market segments.</p>
          <p style={proseP}><strong>3. Seed-system upgrade.</strong> CPRI&apos;s aeroponic technology, combined with state-government seed-village programmes, aims to lift certified-seed share from 15% to 30%+ by 2030. The yield uplift would be transformational: a national average shift from 25.8 t/ha toward 32&ndash;35 t/ha would add 15&ndash;25 M tonnes of national output without any new land.</p>
        </div>
      </section>

      {/* ─── S15 · AI Explorer Block — TWO BANDS (dark heading, light widget) ─── */}
      {/* Dark intro band */}
      <section id="ai-explorer" className="pp-ai-explorer-band pp-no-print" style={{ background: "linear-gradient(135deg,#0F1115 0%,#1A1F26 100%)", color: "#fff", padding: "52px 0 36px" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E53935", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Potatopedia AI &middot; India</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: -1, lineHeight: 1.2 }}>Ask Anything About India&apos;s Potato Industry</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0", lineHeight: 1.6 }}>
              Get data-backed answers from our 5,024-chunk knowledge base &mdash; pre-filtered for India.
            </p>
          </div>
        </div>
      </section>
      {/* Light widget band — CountryAI renders on its own light background, no contrast issue */}
      <section className="pp-ai-explorer-light pp-no-print" style={{ background: "#fff", borderTop: "0", borderBottom: "1px solid #f0f0f0" }}>
        <CountryAI countryName="India" countrySlug="india" />
      </section>

      {/* ─── S16 · Comparable Countries ─── */}
      <CountryVarieties countrySlug={c.slug} countryName={c.name} />

      <CountryBlogPosts countrySlug={c.slug} />

      <section className="pp-comparable-countries pp-no-print" style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", padding: "48px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, textAlign: "left" }}>Compare with Regional Peers</h2>
          <div className="pp-india-comparable-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 8 }}>
            {COUNTRIES.filter((x) => ["china", "bangladesh", "pakistan", "indonesia"].includes(x.slug)).map((x) => (
              <Link key={x.slug} href={"/country/" + x.slug} style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center", border: "1px solid #ececec", textDecoration: "none", color: "inherit", transition: "border-color 0.15s, box-shadow 0.15s" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{x.flag}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{x.name}</div>
                <div style={{ fontSize: 22, color: "#C62828", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{x.prod}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>#{x.rank} Global &middot; {x.yield}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── S17 · Related Knowledge & Sources ─── */}
      <section style={{ padding: "48px 0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }} className="pp-india-related-grid">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Related Knowledge</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { slug: "kufri-potato-varieties-india", title: "Kufri Potato Varieties: India's Complete Guide", desc: "75+ varieties from CPRI Shimla — Jyoti, Pukhraj, Chipsona, Frysona, Tejas." },
                  { slug: "top-potato-producing-countries", title: "Top Potato Producing Countries 2025", desc: "FAOSTAT rankings — China #1, India #2 at 60.14M tonnes." },
                  { slug: "how-potatoes-are-processed", title: "How Potatoes Are Processed: Farm to Fry", desc: "Frozen fries, chips, starch — the global $40-80B processing industry." },
                  { slug: "seed-potato-systems", title: "Seed Potato Systems: Certification, Trade & Multiplication", desc: "How certified seed is produced and why 85% of Indian seed isn't certified." },
                  { slug: "potato-storage-cold-chain", title: "Potato Cold Storage: Temperatures, Design, Post-Harvest Losses", desc: "How India's 39M-tonne cold network compares globally." },
                  { slug: "global-potato-trade", title: "Global Potato Trade Statistics", desc: "$22.8B trade — frozen fry exports led by Belgium, India growing fastest." },
                ].map((a) => (
                  <Link key={a.slug} href={"/knowledge/" + a.slug} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "12px 16px", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>{a.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="pp-sources-block" style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "20px 22px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Sources</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>FAOSTAT 2023</strong> — UN Food and Agriculture Organization production data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>ICAR-CPRI</strong> — Central Potato Research Institute, Shimla; variety catalogue, Vision 2050, agro-climatic zones</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>PIB Government of India</strong> — variety release notifications 2024 and 2025</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>APEDA / DGCIS</strong> — Agricultural Export Promotion Authority; trade statistics 2023-24</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>National Horticulture Board (NHB)</strong> — cold storage capacity statistics</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Department of Agriculture &amp; Farmers Welfare</strong> — area, production, advance estimates</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Singh &amp; Pandey, Potato Journal (2019, 2022)</strong> — peer-reviewed seed-system and variety performance</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Gujarat Agriculture Department</strong> — processing-variety acreage data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>CIP</strong> — International Potato Center, Lima; collaboration data with ICAR-CPRI</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>AICRP on Potato</strong> — All-India Coordinated Research Project annual reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── S18 · Footer-area PDF download ─── */}
      {/* Inline document-end footer — guaranteed on mobile + Safari PDFs */}
      <div className="pp-print-footer-inline" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      <section className="pp-bottom-cta pp-no-print" style={{ background: "linear-gradient(180deg,#FFF8F8 0%,#FFFFFF 100%)", borderTop: "1px solid #f0f0f0", padding: "44px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Premium Export</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" }}>Download the Full India Industry Profile</h3>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 22px", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            All sections, all tables, all sources &mdash; formatted for A4 printing or sharing as a PDF report. Branded footer on every page (potatopedia.com &middot; hello@potatopedia.com &middot; linkedin.com/company/potatopedia).
          </p>
          <PdfDownloadButton size="lg" placement="footer" />
        </div>
      </section>
    </div>
  );
}

/* ── China: full Country Intelligence Dossier (Tier 1) ── */

function ChinaProfilePage({ c }) {
  const stats = [
    { value: "93.49 M t", label: "Annual Production", sub: "FAOSTAT 2023" },
    { value: "4.57 M ha", label: "Harvested Area", sub: "MARA / NBS" },
    { value: "20.5 t/ha", label: "Average Yield", sub: "below world avg (22.8)" },
    { value: "#1", label: "Global Rank", sub: "24.4% of global output" },
    { value: "1.27 M t", label: "Frozen Fries Output (2023)", sub: "8 major plants" },
    { value: "Net exporter", label: "Trade Status (since 2022)", sub: "frozen fries", positive: true },
    { value: "15%", label: "Processing Share", sub: "vs 60%+ in US/Europe" },
    { value: "16,000+", label: "QSR outlets driving demand", sub: "McD 6K + KFC 10K" },
  ];

  const quickFacts = [
    "China grows 24.4% of all potatoes on Earth — more than the next 3 countries combined",
    "The 2015 Potato Staple Food Strategy positioned potato as China's 4th staple after rice, wheat, and corn",
    "Inner Mongolia hosts 61 potato processing enterprises — the largest single-province cluster in China",
    "Cooperation 88 (Hezuo 88) covered 186,667 ha at peak in Yunnan — the most-planted variety in southwest China",
    "Qingshu 9 (CIP UNICA) is grown across 13 Chinese provinces, dominant in Qinghai (1/3 of state's area)",
    "China became a net exporter of frozen French fries for the first time in 2022 — at ~$922/tonne vs $1,128 for US fries",
    "524 potato varieties have been approved nationally over the past decade; 378 currently registered",
    "85% of China's crop is consumed fresh; only 15% is processed — but the gap is closing fast",
  ];

  const provinceRows = [
    ["Sichuan", "12.5+ (est.)", 13.4, "Southwestern Mixed-Cropping Zone", "Cooperation 88, local landraces"],
    ["Yunnan", "12.0+ (est.)", 12.8, "Southwestern (high disease pressure)", "Cooperation 88 (peak 186K ha)"],
    ["Guizhou", "12.0+ (est.)", 12.8, "Southwestern (mountainous)", "Cooperation 88, Hezuo series"],
    ["Inner Mongolia", "9.0 (est.)", 9.6, "Northern Single-Crop Zone (Ulanqab)", "Atlantic, Favorita, Qingshu 9"],
    ["Gansu", "8.5 (est.)", 9.1, "Northern Single-Crop (Dingxi)", "Qingshu 9, Longshu series"],
    ["Chongqing", "6.1", 6.5, "Southwestern Mixed", "Cooperation 88, Yushu series"],
    ["Heilongjiang", "5.0 (est.)", 5.3, "Northern Single-Crop", "Atlantic, Favorita, Kexin series"],
    ["Hebei", "3.5 (est.)", 3.7, "Northern", "Atlantic, Helan-15"],
    ["Shaanxi", "3.0 (est.)", 3.2, "Northern", "Qingshu 9, Helan-15"],
    ["Ningxia", "2.5 (est.)", 2.7, "Northern (Qingshu 9 14% of area)", "Qingshu 9"],
    ["Qinghai", "1.5 (est.)", 1.6, "Northern (Qingshu 9 33% of area)", "Qingshu 9"],
    ["Hubei / Hunan", "3.5 (est.)", 3.7, "Central Two-Crop / Southern Winter", "Eshu, Xiangshu series"],
  ];

  const zoneRows = [
    ["Northern Single-Crop", "Heilongjiang, Jilin, Liaoning, Inner Mongolia, Gansu, Xinjiang, Qinghai, Ningxia, Shanxi, Shaanxi", "Late Apr–early May", "Sep–Oct", "~50% of national area; primary processing & seed zone"],
    ["Southwestern Mixed-Cropping", "Sichuan, Guizhou, Yunnan, Tibet, Chongqing, parts of Hunan & Hubei", "Sep–Nov", "Feb–Apr (next year)", "~37% of area; highest output volume; mostly fresh"],
    ["Central Two-Cropping", "Shandong, Henan, Jiangsu, Anhui, parts of Hubei", "Feb (spring) / Aug (autumn)", "Jun / Nov", "Spring + autumn double crop; vegetable-segment focus"],
    ["Southern Winter", "Guangdong, Guangxi, Fujian, Hainan, southern Jiangxi", "Oct–Dec", "Feb–Apr", "Off-season niche; supplies fresh market in cool months"],
  ];

  const varietyRows = [
    ["Qingshu 9 (CIP UNICA)", "2006/2011", "Table + processing", "Qinghai, Ningxia, Gansu — 13 provinces", "30 t/ha", "20–22%"],
    ["Cooperation 88 (Hezuo 88)", "1996/2001", "Table + chips", "Yunnan, Sichuan, Guizhou, Guangxi", "+15% over local", "20–22%"],
    ["Atlantic", "1976 (USA)", "Chip processing", "Inner Mongolia, Gansu, Heilongjiang", "25–30 t/ha", "21–23%"],
    ["Favorita (NL)", "—", "Table (early)", "Inner Mongolia, Hebei, Heilongjiang", "30–35 t/ha", "16–18%"],
    ["Helan-15 (NL)", "—", "Table (Dutch)", "Hebei, Shaanxi, Northern provinces", "30–35 t/ha", "17–19%"],
    ["Longshu series (Gansu)", "Multiple", "Table, drought-tolerant", "Gansu, Ningxia, Shaanxi", "25–30 t/ha", "18–20%"],
    ["Zhongshu series (CAAS)", "Multiple", "Table + processing", "Multi-zone", "25–32 t/ha", "18–22%"],
    ["Yushu series (Chongqing)", "Multiple", "Table", "Chongqing, Sichuan", "20–28 t/ha", "17–19%"],
    ["Kexin series", "Multiple", "Table", "Northeast (Heilongjiang)", "25–30 t/ha", "17–19%"],
    ["Shepody (Canada)", "1980", "French fry", "Contract acreage (McCain)", "30–35 t/ha", "21–23%"],
  ];

  const tradeRows = [
    ["Frozen French fries", "Exports (Jan–Oct 2024)", "155,100 t", "exceeded full 2023 in 10 months", "Net exporter since 2022"],
    ["Frozen French fries", "Output (2023)", "1.274 M t (8 plants)", "rapid growth", "Concentrated Inner Mongolia + Gansu"],
    ["Frozen fries (price)", "Export delivery", "$922 / tonne (CN)", "vs $1,128 / tonne (US)", "Asia-Pacific market entry"],
    ["Fresh potatoes", "Exports", "Significant within Asia", "growing", "Russia, Kazakhstan, Vietnam, Mongolia"],
    ["Seed potatoes", "Imports", "Selective (NL, DE)", "—", "Premium varieties for processing"],
    ["Top markets", "Frozen-fry destinations", "Philippines, Vietnam, Japan", "+", "Replacing US/EU supply in Asia"],
  ];

  const processingRows = [
    ["Inner Mongolia", "61 enterprises", "Northern Single-Crop", "Largest cluster; serves QSR + retail"],
    ["Gansu", "46 enterprises", "Northern (Dingxi)", "Diversified processing"],
    ["Ningxia", "21 enterprises", "Northern", "Growing chip + starch"],
    ["Shaanxi", "21 enterprises", "Northern", "Mixed processing"],
    ["Heilongjiang", "19 enterprises", "Northern (NE)", "Starch + frozen products"],
    ["McCain Foods (Inner Mongolia)", "Major frozen fry plant", "Harbin, Heilongjiang region", "QSR supply for McDonald's, KFC"],
    ["PepsiCo / Frito-Lay", "Lay's chips", "Beijing, Hubei, others", "Largest chip player, Atlantic + Helan-15"],
    ["Yum China (KFC)", "Sources fries via processors", "Nationwide 10,000+ outlets", "Demand magnet for processing"],
  ];

  const challengeRows = [
    ["Yield gap", "20.5 t/ha vs world avg 22.8 t/ha", "Smallholder structure + fragmented seed system"],
    ["Processing share", "Just 15% (vs 60%+ in US/Europe)", "Massive growth headroom"],
    ["Disease pressure", "Late blight epidemic potential in SW", "Cooperation 88's resistance is critical"],
    ["Drought / water stress", "Northern zone groundwater depletion", "Qingshu 9 selected partly for drought tolerance"],
    ["Storage infrastructure", "Variable across provinces", "Government investment in cold-chain capacity"],
    ["Fragmented seed system", "Variable certified-seed availability", "16 nationally recognised seed bases established"],
  ];

  const pageUrl = "https://www.potatopedia.com/country/china";
  const generatedDate = "April 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "China Potato Industry Profile — World's #1 Producer",
        description: "Country profile of China's potato industry. World's #1 producer at 93.49 M tonnes (FAOSTAT 2023). Inner Mongolia, Sichuan, Yunnan, Guizhou. Qingshu 9, Cooperation 88, the 2015 Staple Food Strategy, frozen-fry export rise.",
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
        publisher: { "@id": "https://www.potatopedia.com/#publisher" },
        mainEntityOfPage: pageUrl,
        image: "https://www.potatopedia.com/og-image.png",
        about: { "@type": "Country", name: "China" },
        speakable: SPEAKABLE,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
          { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: "China" } },
        ],
      },
      {
        "@type": "Dataset",
        name: "China Potato Production by Province / Zone 2023",
        description: "Production tonnage and percentage of national output by Chinese province and agro-ecological zone.",
        creator: { "@type": "Organization", name: "Potatopedia" },
        license: "https://www.potatopedia.com/about",
        keywords: ["China", "potato", "production", "province", "FAOSTAT", "CAAS", "Inner Mongolia", "Sichuan"],
        url: pageUrl,
      },
    ],
  };

  const sectionWrap = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
  const sectionTitle = { fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px", paddingLeft: 12, borderLeft: "4px solid #C62828", lineHeight: 1.2 };
  const tableTH = { padding: "10px 12px", textAlign: "left", background: "#C62828", color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 };
  const tableTD = { padding: "10px 12px", fontSize: 13.5, borderBottom: "1px solid #eee", color: "#333" };
  const proseP = { fontSize: 14.5, color: "#444", lineHeight: 1.7, margin: "0 0 12px" };
  const sourceLine = { fontSize: 12, color: "#999", fontStyle: "italic", margin: "4px 0 0" };

  return (
    <div className="pp-country-page pp-country-india" style={{ minHeight: "100vh", background: "#fff", overflowX: "hidden", fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{ppCSS}</style>
      <style>{printCSS}</style>
      <style>{`
        .pp-mobile-pdf-cta { display: none; }
        @media (max-width: 768px) {
          .pp-india-banner-row { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
          .pp-india-banner-pdf { display: none !important; }
          .pp-vital-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-quickfacts-grid { grid-template-columns: 1fr !important; }
          .pp-india-comparable-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-india-related-grid { grid-template-columns: 1fr !important; }
          .pp-mobile-pdf-cta { display: block !important; }
        }
        @media (max-width: 480px) {
          .pp-vital-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
        .pp-share-bar-track { position: relative; height: 6px; background: rgba(198,40,40,0.08); border-radius: 3px; min-width: 80px; margin-top: 4px; }
        .pp-share-bar-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg,#C62828,#E53935); border-radius: 3px; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pp-print-only pp-print-header">
        <div className="pp-print-header-row">
          <div className="pp-print-header-brand">POTATOPEDIA</div>
          <div className="pp-print-header-meta">
            <div>The World&apos;s Potato Intelligence Platform</div>
            <div>potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia</div>
            <div>Generated {generatedDate}</div>
          </div>
        </div>
      </div>

      {/* Bulletproof per-page footer (Safari fallback for @page @bottom-center) */}
      <div className="pp-print-footer-fixed" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      {/* S1 · Executive Banner */}
      <section className="pp-india-banner" style={{ borderBottom: "2px solid #C62828", background: "linear-gradient(180deg,#FFF 0%,#FFF8F8 100%)" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ paddingTop: 24, paddingBottom: 8 }}>
            <Link href="/countries" className="pp-no-print" style={{ fontSize: 12, color: "#C62828", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>&larr; All Countries</Link>
          </div>
          <div className="pp-india-banner-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, paddingBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div className="pp-india-banner-flag" style={{ fontSize: 80, lineHeight: 1 }}>{c.flag}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#C62828", padding: "4px 10px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>#{c.rank} Global Producer</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>{c.region}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>FAOSTAT 2023</span>
                </div>
                <h1 style={{ fontSize: 44, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: -1.5, lineHeight: 1.1 }}>{c.name}</h1>
                <p className="pp-india-tagline" style={{ fontSize: 16, color: "#444", margin: "10px 0 0", lineHeight: 1.5, maxWidth: 600 }}>
                  World&apos;s <strong>#1 potato producer</strong> at <strong style={{ color: "#C62828" }}>93.49 M tonnes</strong> &mdash; 24.4% of global output. Net exporter of frozen French fries since 2022. The 2015 Staple Food Strategy elevated potato to China&apos;s 4th national staple.
                </p>
              </div>
            </div>
            <div className="pp-india-banner-pdf"><PdfDownloadButton size="md" placement="banner" /></div>
          </div>
        </div>
      </section>

      {/* S2 · Vital Stats Dashboard */}
      <section className="pp-vital-stats" style={{ background: "#0F1115", padding: "40px 0", color: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div data-summary="true" className="pp-vital-stats-summary" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #E53935", borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 28, fontSize: 14, lineHeight: 1.7, color: "#E5E5E5" }}>
            <strong style={{ color: "#fff" }}>China produced 93.49 million tonnes of potatoes in 2023</strong> (FAOSTAT) on 4.57 million hectares &mdash; <strong>24.4% of global output</strong> and the world&apos;s #1 ranking. Production is concentrated in two zones: the Northern Single-Crop Zone (50% of area) led by <strong>Inner Mongolia and Gansu</strong>, and the Southwestern Mixed-Cropping Zone (37%) led by <strong>Sichuan, Yunnan, and Guizhou</strong>. The 2015 <strong>Potato Staple Food Strategy</strong> positioned potato as China&apos;s 4th national staple. Only 15% of the crop is processed (vs 60%+ in the US) but frozen French fry output reached <strong>1.274 M tonnes in 2023</strong> and China became a <strong>net frozen-fry exporter for the first time in 2022</strong>.
          </div>
          <div className="pp-vital-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {stats.map((s, i) => (
              <div key={i} className="pp-vital-stat-cell" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "18px 16px" }}>
                <div className="pp-vital-stat-value" style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5, lineHeight: 1.15, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                  {s.positive && <span className="pp-delta-up" style={{ display: "inline-block", marginLeft: 8, fontSize: 9, fontWeight: 700, color: "#4CAF50", background: "rgba(76,175,80,0.12)", padding: "2px 6px", borderRadius: 3, verticalAlign: "middle" }}>NEW</span>}
                </div>
                <div className="pp-vital-stat-label" style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 1.2, marginTop: 8 }}>{s.label}</div>
                <div className="pp-vital-stat-sub" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-only PDF CTA */}
      <section className="pp-mobile-pdf-cta pp-no-print" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "20px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <PdfDownloadButton size="md" placement="banner" />
          <div style={{ fontSize: 11, color: "#888", marginTop: 8, fontWeight: 500 }}>A4-formatted report &middot; all sections, all tables</div>
        </div>
      </section>

      {/* S3 · Quick Facts */}
      <section className="pp-trajectory-band" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "32px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, marginBottom: 16 }}>FAOSTAT 7-year production trajectory</h2>
          <TrajectoryTable slug={c.slug} />
        </div>
      </section>

      <section className="pp-quickfacts" data-pdf-break-after style={{ background: "#FAFAFA", borderBottom: "1px solid #f0f0f0", padding: "40px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Did you know?</h2>
          <div className="pp-quickfacts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {quickFacts.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "16px 18px", fontSize: 13.5, color: "#333", lineHeight: 1.55, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, color: "#C62828", fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>&#9642;</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S4 · Production by Province */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Production by Province</h2>
          <p style={proseP}>The top six provinces &mdash; Sichuan, Yunnan, Guizhou, Inner Mongolia, Gansu, and Chongqing &mdash; together cultivate <strong>67% of China&apos;s total potato area</strong> (3.69 M ha across 6 provinces), with Sichuan, Yunnan, and Guizhou each producing over 12 M tonnes. The Northern Single-Crop Zone (Inner Mongolia + Gansu) dominates seed and processing supply; the Southwestern Mixed-Cropping Zone (Sichuan/Yunnan/Guizhou) leads volume but is mostly fresh-consumption.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Province", "Production (M t)", "% of National", "Zone", "Dominant Varieties"].map((h, idx) => <th key={h} style={{ ...tableTH, width: idx === 2 ? "20%" : undefined }}>{h}</th>)}</tr></thead>
              <tbody>
                {provinceRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: i < 3 ? 700 : 500, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: i < 3 ? "#C62828" : "#1A1A1A", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{r[2].toFixed(1)}%</span>
                        <div className="pp-share-bar-track">
                          <div className="pp-share-bar-fill" style={{ width: Math.min(100, r[2] * 6) + "%" }} />
                        </div>
                      </div>
                    </td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, color: "#666", fontSize: 12.5 }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: FAOSTAT 2023 (national); MARA / NBS provincial estimates; CAAS 2016 reference data; CIP-Yunnan Normal University (Cooperation 88).</p>
        </div>
      </section>

      {/* S5 · Agro-Ecological Zones */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Four Agro-Ecological Zones</h2>
          <p style={proseP}>China organises potato production into <strong>four agro-ecological zones</strong> defined by CAAS, each with distinct climate, varieties, and cropping windows. The 2015 Staple Food Strategy explicitly targets potato expansion on marginal, arid, and highland areas where it doesn&apos;t compete with rice/wheat/corn for water or land.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["Zone", "Provinces", "Planting", "Harvest", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {zoneRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CAAS / Chinese Academy of Agricultural Sciences zone classification; MARA staple-food-strategy documentation.</p>
        </div>
      </section>

      {/* S6 · Variety Portfolio */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Variety Portfolio</h2>
          <p style={proseP}>Over the past decade China approved <strong>524 potato varieties nationally</strong>; <strong>378 are currently registered</strong>, of which 34% are processing varieties &mdash; a deliberate shift to support the rising chip and fry industries. Two CIP-derived varieties dominate: <Link href="/knowledge/kufri-potato-varieties-india" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Qingshu 9 (UNICA)</Link> in the drought-prone northwest and Cooperation 88 (Hezuo 88) in the late-blight-pressured southwest. Imported varieties (Atlantic, Favorita, Helan-15, Shepody) anchor processing.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Variety", "Year", "Type", "Key Provinces", "Yield", "Dry Matter"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {varietyRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: r[2].includes("processing") || r[2].includes("French") || r[2].includes("chip") ? "#C62828" : "#1A1A1A", fontWeight: 500 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                    <td style={tableTD}>{r[4]}</td>
                    <td style={tableTD}>{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CAAS variety registry; CIP UNICA / Cooperation 88 release documentation; MARA approved-variety statistics.</p>
        </div>
      </section>

      {/* S7 · Trade Profile */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Trade Profile</h2>
          <p style={proseP}>China shifted from net frozen-fry importer to <strong>net exporter for the first time in 2022</strong> &mdash; a trade-flow inversion driven by a price advantage of approximately 18% versus US suppliers ($922/t Chinese fries vs $1,128/t US fries delivered to the Philippines). Frozen-fry exports for January&ndash;October 2024 reached 155,100 tonnes, already exceeding the full prior-year figure. China is taking Asia-Pacific market share from US and European suppliers.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["Category", "Direction / Year", "Volume / Value", "Trend", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {tradeRows.map((r, i) => (
                  <tr key={r[0] + i} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: China Customs export data; MARA frozen-fry industry reports 2024.</p>
        </div>
      </section>

      {/* S8 · Processing Industry */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Processing Industry &amp; Major Players</h2>
          <p style={proseP}>China&apos;s processing industry is concentrated in the Northern Single-Crop Zone, anchored by Inner Mongolia&apos;s 61 enterprises and Gansu&apos;s 46. Demand is driven by the explosive growth of QSR chains: McDonald&apos;s operates over 6,000 outlets in China and Yum China (KFC) over 10,000 &mdash; together creating frozen-fry demand that domestic processing only partially meets. PepsiCo / Frito-Lay (Lay&apos;s) is the chip-segment leader. Despite this scale, China processes just <strong>15% of its crop</strong> &mdash; vs. 60%+ in the US, Canada, and Europe &mdash; signalling enormous growth headroom.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Cluster / Player", "Activity", "Location", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {processingRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: China potato processing industry registry (294 large/medium plants); Yum China + McDonald&apos;s outlet counts.</p>
          <p className="pp-read-more-link" style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}>Read more: <Link href="/knowledge/how-potatoes-are-processed" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>How Potatoes Are Processed: Farm to Fry &rarr;</Link> &middot; <Link href="/knowledge/mcdonalds-potato-varieties" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>What Potatoes Does McDonald&apos;s Use? &rarr;</Link></p>
        </div>
      </section>

      {/* S9 · The Staple Food Strategy */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>The 2015 Potato Staple Food Strategy</h2>
          <p style={proseP}>In 2015, the Ministry of Agriculture and Rural Affairs (MARA) launched the <strong>&ldquo;Potato Staple Food Strategy&rdquo;</strong> (马铃薯主粮化战略) &mdash; positioning potato as China&apos;s 4th national staple alongside rice, wheat, and corn. The strategy is built on a deliberate principle: <em>do not compete with the three main staples for water or land</em>. Instead, target potato expansion on marginal, arid, and highland areas. The original target was <strong>10 million hectares of potato area by 2020</strong>; potato-flour blending into noodles, steamed buns, and bread became the core consumer-facing delivery channel.</p>
          <p style={proseP}>Outcomes since 2015: <strong>16 nationally recognised regional seed-potato breeding bases</strong> established; <strong>2 national potato industry clusters</strong> with special funding; 524 varieties approved with 378 registered; processing-variety share rising to 34% of new releases; rapid growth in flour-blending product lines; and the 2022 net-export milestone in frozen fries.</p>
          <p style={sourceLine}>Source: MARA strategy documents; CAAS implementation reports; peer-reviewed staple-food-strategy reviews.</p>
        </div>
      </section>

      {/* S9.5 · Consumption & Cuisine */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Consumption Patterns &amp; Cuisine</h2>
          <p style={proseP}>China consumed <strong>92.52 million tonnes of potatoes in 2024</strong> (CAAS Agricultural Information Research Institute) &mdash; approximately <strong>65 kg per person per year</strong>, placing China among the world&apos;s highest per-capita potato consumers in absolute volume terms despite a 1.4 billion population. The 2024 utilisation breakdown shows a clear shift from fresh to processed consumption.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Use Category", "Volume (M t, 2024)", "Per Capita (kg/yr)", "YoY Change", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ["Fresh food consumption", "38.56", "~27", "−6.3%", "Cabbage / radish / carrot price competition"],
                  ["Processing consumption", "29.96", "~21", "+0.8%", "Snacks, frozen products, starch derivatives"],
                  ["Seed potato use", "8.58", "—", "stable", "8 M t / yr seed system requirement"],
                  ["Animal feed", "5.24", "—", "stable", "Marginal-grade potatoes diverted to feed"],
                  ["Post-harvest losses", "9.79", "—", "—", "Storage / cold-chain gap"],
                  ["Total utilisation", "92.52", "65 (avg)", "—", "CAAS 2024 final estimate"],
                ].map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: i < 3 ? 700 : 500 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CAAS Agricultural Information Research Institute 2024 utilisation data.</p>
          <p style={proseP}><strong>Traditional Chinese potato uses</strong> are diverse: 土豆丝 (tǔ dòu sī, julienned potato stir-fry) is a national-level home staple; 酸辣土豆丝 (sour-and-spicy julienned potato) is a Sichuan classic; 红烧土豆 (red-braised potato) integrates with northern Chinese stews; 地三鲜 (dì sān xiān, &ldquo;earth&apos;s three treasures&rdquo;) combines potato, eggplant, and green pepper. The Staple Food Strategy has accelerated <strong>potato-flour-blended noodles, mantou (steamed buns), and bread products</strong> &mdash; explicitly engineering potato into the daily-staple format. Snack-segment growth driven by Lay&apos;s, Oishi, and local brands has pushed processed consumption volume above 30 M tonnes per year.</p>
        </div>
      </section>

      {/* S9.6 · Seed Production System */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Seed Production System</h2>
          <p style={proseP}>Only an estimated <strong>20&ndash;30% of China&apos;s potato area uses certified seed</strong> according to CIP (International Potato Center) estimates &mdash; a major productivity constraint when compared to the Netherlands and the United States, both of which approach 100% certified-seed adoption. China&apos;s national average yield of <strong>~20.5 t/ha sits well below the Netherlands (~46 t/ha) and the US (~51 t/ha)</strong>, and CAAS attributes a substantial share of this gap to seed-quality limitations.</p>
          <p style={proseP}>The 2015 Staple Food Strategy explicitly addresses this through <strong>16 nationally recognised regional seed-potato breeding bases</strong>, which combine state-funded multiplication infrastructure with provincial extension services. Northern provinces &mdash; particularly Inner Mongolia, Gansu, and Heilongjiang &mdash; serve as the country&apos;s primary seed-multiplication zones, taking advantage of cooler temperatures and lower virus pressure. Recent investment has prioritised tissue-culture and aeroponic minituber production, modelled on CIP&apos;s technology transfer (which reached China alongside ten other countries by 2012).</p>
          <p style={sourceLine}>Source: CIP certified-seed estimates; CAAS Vision implementation reports; FAO seed-system reviews.</p>
        </div>
      </section>

      {/* S9.7 · Mechanisation & Farmer Economics */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Mechanisation &amp; Farmer Economics</h2>
          <p style={proseP}>China&apos;s potato sector sits in the <strong>&ldquo;partially mechanised&rdquo; band at 30&ndash;50% adoption</strong> (CAAS), well ahead of <Link href="/country/india" style={{ color: "#C62828", textDecoration: "none" }}>India</Link> (5&ndash;20%) but behind fully mechanised regions in <Link href="/country/united-states" style={{ color: "#C62828", textDecoration: "none" }}>the United States</Link>, <Link href="/country/netherlands" style={{ color: "#C62828", textDecoration: "none" }}>Netherlands</Link>, and Western Europe (near 100%). Inner Mongolia and Gansu lead Chinese mechanisation, leveraging large-field irrigated production where harvesters and planters can be deployed at scale.</p>
          <p style={proseP}>2024 was a difficult year for Chinese potato farmer economics. According to CAAS data:</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Metric", "2024 Value", "YoY Change", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ["Revenue per hectare", "¥45,286 / ha", "−23.39%", "Wholesale price decline"],
                  ["Cash income per hectare", "¥16,796 / ha", "−48.93%", "After variable cost deduction"],
                  ["Profit per hectare", "¥6,945 / ha", "−70.47%", "Sharpest single-year decline in recent record"],
                  ["Margin vs other grains", "Still positive", "—", "Potato remains more profitable than wheat/maize"],
                ].map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CAAS 2024 farmer-economics survey; provincial cost-of-production datasets.</p>
          <p style={proseP}>Even with the 2024 downturn, potato remains <strong>more profitable per hectare than wheat or maize</strong>, supporting continued area expansion under the Staple Food Strategy.</p>
        </div>
      </section>

      {/* S9.8 · Trade Detail (China Customs 2024) */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>2024 Trade Performance</h2>
          <p style={proseP}>China Customs General Administration data (via CAAS) shows continued export-led trade growth in 2024:</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", background: "#fff" }}>
              <thead><tr>{["Metric", "2024 Value", "YoY Change", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ["Total potato-product exports", "865,600 tonnes", "+55.6% volume", "Across fresh + frozen + processed"],
                  ["Export value", "$567 million", "+17.9% value", "Lower per-unit price reflects volume strategy"],
                  ["Frozen-fry export share", "~155 K t (Jan–Oct)", "Already > full 2023", "Net exporter since 2022"],
                  ["FAOSTAT 2022 baseline", "626 K tonnes total exports", "—", "Trade trajectory accelerated 2022→2024"],
                ].map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: China Customs General Administration 2024; CAAS trade analysis; FAOSTAT 2022 baseline.</p>
        </div>
      </section>

      {/* S10 · Challenges */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Industry Challenges</h2>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Challenge", "Magnitude", "Driver / Note"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {challengeRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#444" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* S11 · AI Explorer — two bands (FIXED contrast pattern) */}
      <section id="ai-explorer" className="pp-ai-explorer-band pp-no-print" style={{ background: "linear-gradient(135deg,#0F1115 0%,#1A1F26 100%)", color: "#fff", padding: "52px 0 36px" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E53935", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Potatopedia AI &middot; China</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: -1, lineHeight: 1.2 }}>Ask Anything About China&apos;s Potato Industry</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0", lineHeight: 1.6 }}>
              Get data-backed answers from our 5,024-chunk knowledge base &mdash; pre-filtered for China.
            </p>
          </div>
        </div>
      </section>
      <section className="pp-ai-explorer-light pp-no-print" style={{ background: "#fff", borderTop: "0", borderBottom: "1px solid #f0f0f0" }}>
        <CountryAI countryName="China" countrySlug="china" />
      </section>

      {/* S12 · Comparable Countries */}
      <CountryVarieties countrySlug={c.slug} countryName={c.name} />

      <CountryBlogPosts countrySlug={c.slug} />

      <section className="pp-comparable-countries pp-no-print" style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", padding: "48px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, textAlign: "left" }}>Compare with Regional Peers</h2>
          <div className="pp-india-comparable-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 8 }}>
            {COUNTRIES.filter((x) => ["india", "bangladesh", "japan", "south-korea"].includes(x.slug)).map((x) => (
              <Link key={x.slug} href={"/country/" + x.slug} style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center", border: "1px solid #ececec", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{x.flag}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{x.name}</div>
                <div style={{ fontSize: 22, color: "#C62828", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{x.prod}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>#{x.rank} Global &middot; {x.yield}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* S13 · Related & Sources */}
      <section style={{ padding: "48px 0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }} className="pp-india-related-grid">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Related Knowledge</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { slug: "top-potato-producing-countries", title: "Top Potato Producing Countries 2025", desc: "China #1 at 94.4 M tonnes, India #2 at 60.14 M tonnes." },
                  { slug: "how-potatoes-are-processed", title: "How Potatoes Are Processed: Farm to Fry", desc: "Frozen fries, chips, starch — the global $40-80B processing industry." },
                  { slug: "mcdonalds-potato-varieties", title: "What Potatoes Does McDonald's Use?", desc: "The Russet Burbank story behind the global frozen fry industry." },
                  { slug: "global-potato-trade", title: "Global Potato Trade Statistics", desc: "$22.8B trade — Belgium leads frozen fries; China rising fast." },
                ].map((a) => (
                  <Link key={a.slug} href={"/knowledge/" + a.slug} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "12px 16px", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>{a.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="pp-sources-block" style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "20px 22px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Sources</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>FAOSTAT 2023</strong> — UN Food and Agriculture Organization production data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>CAAS</strong> — Chinese Academy of Agricultural Sciences; variety registry, zone classification, breeding</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>MARA</strong> — Ministry of Agriculture and Rural Affairs; staple-food strategy</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>NBS China</strong> — National Bureau of Statistics; provincial production data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>CIP</strong> — International Potato Center; Qingshu 9 (UNICA) + Cooperation 88 release documentation</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Yunnan Normal University</strong> — Cooperation 88 (Hezuo 88) breeding co-development</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>RTB / CGIAR</strong> — Qingshu 9 success-story documentation</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>China Customs</strong> — frozen-fry export data 2022-2024</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* S14 · Footer PDF */}
      {/* Inline document-end footer — guaranteed on mobile + Safari PDFs */}
      <div className="pp-print-footer-inline" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      <section className="pp-bottom-cta pp-no-print" style={{ background: "linear-gradient(180deg,#FFF8F8 0%,#FFFFFF 100%)", borderTop: "1px solid #f0f0f0", padding: "44px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Premium Export</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" }}>Download the Full China Industry Profile</h3>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 22px", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            All sections, all tables, all sources &mdash; formatted for A4 printing or sharing as a PDF report. Branded footer on every page (potatopedia.com &middot; hello@potatopedia.com &middot; linkedin.com/company/potatopedia).
          </p>
          <PdfDownloadButton size="lg" placement="footer" />
        </div>
      </section>
    </div>
  );
}

/* ── Belgium: full Country Intelligence Dossier (Tier 1) ── */

function BelgiumProfilePage({ c }) {
  const stats = [
    { value: "8.61 M t", label: "Annual Production", sub: "FAOSTAT 2023" },
    { value: "95,700 ha", label: "Harvested Area", sub: "(105 K ha in 2024 — Belgapom)" },
    { value: "42.0 t/ha", label: "Average Yield", sub: "well above world avg (22.8)" },
    { value: "#1", label: "Frozen-Fry Exporter", sub: "$4.6 B / yr" },
    { value: "5.5–6 M t", label: "Annual Processing Throughput", sub: "exceeds domestic crop" },
    { value: "2.8 M t", label: "Frozen-Fry Output / yr", sub: "150+ export markets" },
    { value: "5", label: "Major Plants in Westhoek", sub: "within 30 km of each other" },
    { value: "+62%", label: "Acreage growth since 2000s", sub: "55K → 95K+ ha", positive: true },
  ];

  const quickFacts = [
    "Belgium exports more frozen French fries by value ($4.6B) than the US, Canada, and China combined",
    "Belgian processors handle 5.5-6 M tonnes of raw potatoes per year — more than the country grows",
    "Belgium imports raw potatoes from France, Netherlands, and Germany to feed its processing plants",
    "Five major fry processors operate within a 30-kilometre radius in West Flanders' Westhoek region",
    "Belgapom (Belgian Potato Trade and Processing Association) coordinates ~the entire industry",
    "Belgium ranks 5th in EU production but generates 25-30% of the world's frozen-fry exports",
    "Yields of 42 t/ha are nearly 2× the world average — fertile loam soils + intensive management",
    "Belgium became a €350M magnet for Agristo's Northern France expansion (operational 2027)",
  ];

  const regionRows = [
    ["West Flanders", "~3.5 M t (est.)", 41, "Westhoek processing hub; Clarebout, Agristo, Lutosa"],
    ["Hainaut (Wallonia)", "~1.7 M t (est.)", 20, "Mydibel facility (Mouscron); Lutosa (Leuze)"],
    ["East Flanders", "~1.2 M t (est.)", 14, "Mixed processing + fresh"],
    ["Walloon Brabant", "~0.9 M t (est.)", 11, "Wallonia commercial production"],
    ["Limburg", "~0.7 M t (est.)", 8, "Farm Frites Belgium (Lommel)"],
    ["Other (Antwerp, Liège, etc.)", "~0.6 M t (est.)", 6, "Smaller commercial pockets"],
  ];

  const processorRows = [
    ["Clarebout Potatoes", "1,500,000 t/yr", "Nieuwkerke (West Flanders)", "Family-owned; new 220K t plant in Bourbourg, France"],
    ["Agristo", "600,000+ t/yr", "Multiple Belgian factories", "Premium retail focus; €350M Northern France expansion (2027); India entry"],
    ["Mydibel Group", "400,000 t/yr", "Mouscron (Hainaut)", "Retail + foodservice"],
    ["Lutosa (McCain-owned)", "Major capacity", "Leuze-en-Hainaut + Waregem", "Acquired by McCain 2011; modernising"],
    ["Farm Frites Belgium", "Significant", "Lommel (Limburg)", "Dutch-owned subsidiary"],
    ["Ecofrost", "200,000 t (Peronne, FR)", "Cross-border French facility", "Regional Belgian-French operator"],
    ["McCain (Belgium operations)", "Multi-plant", "Wallonia / Flanders", "Owns Lutosa; sources Belgian + imported raw"],
    ["Aviko (Belgian capacity)", "Multi-plant", "Mixed BE/NL operations", "Royal Cosun cooperative; cross-border integration"],
  ];

  const varietyRows = [
    ["Fontane", "1999 (Agrico, NL)", "Processing (frozen fry)", "Now leader; replaced Bintje for fries", "55–65 t/ha", "21–23%"],
    ["Bintje", "1910 (NL — heritage)", "Processing (declining)", "Historic Belgian fry standard", "45–55 t/ha", "19–21%"],
    ["Challenger", "—", "Processing (frozen fry)", "Reliable yield + fry quality", "55–65 t/ha", "21–23%"],
    ["Innovator", "2004 (HZPC, NL)", "Processing (premium fry)", "Russet skin; long tubers; high-end fry", "55–65 t/ha", "22–24%"],
    ["Markies", "1997 (Agrico, NL)", "Processing (dual: fry + crisp)", "Flexible processing variety", "50–60 t/ha", "20–22%"],
    ["Lady Rosetta", "1988 (Meijer, NL)", "Crisp (chip)", "Specialist crisping variety", "45–55 t/ha", "23–25%"],
    ["Nicola", "1973 (Saatzucht, DE)", "Table (fresh)", "Dominant fresh-market choice", "40–50 t/ha", "16–18%"],
    ["Charlotte", "1981 (FR)", "Salad (waxy)", "Premium fresh segment", "35–45 t/ha", "16–18%"],
  ];

  const tradeRows = [
    ["Frozen French fries", "Exports", "€3.4 B (2023, Eurostat) / $4.6 B headline", "World #1; ~25-30% of global frozen-fry exports", "Top markets: France, UK, NL, DE, US, Brazil, Saudi Arabia, Japan, Korea"],
    ["Frozen French fries", "Volume", "~2 M t (2024)", "Growing", "Reaches 150+ countries"],
    ["Raw potatoes", "Imports", "1.5–2 M t / year", "Sustained — domestic crop insufficient", "From France, Netherlands, Germany"],
    ["Fresh potatoes", "Exports", "Smaller volume", "Stable", "Mainly EU intra-trade"],
    ["Belgian-fry brand value", "Asia / MENA", "Strong recognition", "Growing", "Foodservice channel led"],
  ];

  const challengeRows = [
    ["Raw-material dependency", "Imports 1.5–2 M t/yr from FR, NL, DE", "Processing capacity exceeds domestic production"],
    ["Climate change", "Heat stress + irregular rainfall", "Western European maritime climate shifts"],
    ["Energy prices", "Frozen-fry processing is energy-intensive", "Industry-wide ESG / efficiency push"],
    ["Cross-border expansion pressure", "Major processors moving to N France (Agristo, Clarebout)", "Domestic policy + raw-material logistics"],
    ["EU ag-policy uncertainty", "CAP reform + sustainability mandates", "Belgapom advocacy on regulatory burden"],
    ["Competition from Netherlands", "Direct EU peer with 13.4% EU share vs Belgium 8.5%", "Cooperative integration via Aviko / Royal Cosun"],
  ];

  const pageUrl = "https://www.potatopedia.com/country/belgium";
  const generatedDate = "April 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Belgium Potato Industry Profile — World's #1 Frozen Fry Exporter",
        description: "Country profile of Belgium's potato industry. 8.61 M tonnes (FAOSTAT 2023) on 95,700 ha at 42 t/ha. World's #1 frozen French fry exporter at $4.6 B. Westhoek processing hub. Clarebout, Agristo, Lutosa, Mydibel.",
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
        publisher: { "@id": "https://www.potatopedia.com/#publisher" },
        mainEntityOfPage: pageUrl,
        image: "https://www.potatopedia.com/og-image.png",
        about: { "@type": "Country", name: "Belgium" },
        speakable: SPEAKABLE,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
          { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: "Belgium" } },
        ],
      },
      {
        "@type": "Dataset",
        name: "Belgium Potato Production by Region 2023",
        description: "Production tonnage and percentage of national output by Belgian region.",
        creator: { "@type": "Organization", name: "Potatopedia" },
        license: "https://www.potatopedia.com/about",
        keywords: ["Belgium", "potato", "production", "West Flanders", "Wallonia", "FAOSTAT", "Belgapom"],
        url: pageUrl,
      },
    ],
  };

  const sectionWrap = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
  const sectionTitle = { fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px", paddingLeft: 12, borderLeft: "4px solid #C62828", lineHeight: 1.2 };
  const tableTH = { padding: "10px 12px", textAlign: "left", background: "#C62828", color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 };
  const tableTD = { padding: "10px 12px", fontSize: 13.5, borderBottom: "1px solid #eee", color: "#333" };
  const proseP = { fontSize: 14.5, color: "#444", lineHeight: 1.7, margin: "0 0 12px" };
  const sourceLine = { fontSize: 12, color: "#999", fontStyle: "italic", margin: "4px 0 0" };

  return (
    <div className="pp-country-page pp-country-india" style={{ minHeight: "100vh", background: "#fff", overflowX: "hidden", fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{ppCSS}</style>
      <style>{printCSS}</style>
      <style>{`
        .pp-mobile-pdf-cta { display: none; }
        @media (max-width: 768px) {
          .pp-india-banner-row { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
          .pp-india-banner-pdf { display: none !important; }
          .pp-vital-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-quickfacts-grid { grid-template-columns: 1fr !important; }
          .pp-india-comparable-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-india-related-grid { grid-template-columns: 1fr !important; }
          .pp-mobile-pdf-cta { display: block !important; }
        }
        @media (max-width: 480px) {
          .pp-vital-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
        .pp-share-bar-track { position: relative; height: 6px; background: rgba(198,40,40,0.08); border-radius: 3px; min-width: 80px; margin-top: 4px; }
        .pp-share-bar-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg,#C62828,#E53935); border-radius: 3px; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pp-print-only pp-print-header">
        <div className="pp-print-header-row">
          <div className="pp-print-header-brand">POTATOPEDIA</div>
          <div className="pp-print-header-meta">
            <div>The World&apos;s Potato Intelligence Platform</div>
            <div>potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia</div>
            <div>Generated {generatedDate}</div>
          </div>
        </div>
      </div>

      {/* Bulletproof per-page footer (Safari fallback for @page @bottom-center) */}
      <div className="pp-print-footer-fixed" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      <section className="pp-india-banner" style={{ borderBottom: "2px solid #C62828", background: "linear-gradient(180deg,#FFF 0%,#FFF8F8 100%)" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ paddingTop: 24, paddingBottom: 8 }}>
            <Link href="/countries" className="pp-no-print" style={{ fontSize: 12, color: "#C62828", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>&larr; All Countries</Link>
          </div>
          <div className="pp-india-banner-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, paddingBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div className="pp-india-banner-flag" style={{ fontSize: 80, lineHeight: 1 }}>{c.flag}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#C62828", padding: "4px 10px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>#{c.rank} Global Producer</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>{c.region}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>FAOSTAT 2023</span>
                </div>
                <h1 style={{ fontSize: 44, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: -1.5, lineHeight: 1.1 }}>{c.name}</h1>
                <p className="pp-india-tagline" style={{ fontSize: 16, color: "#444", margin: "10px 0 0", lineHeight: 1.5, maxWidth: 600 }}>
                  World&apos;s <strong>#1 frozen French fry exporter</strong> at <strong style={{ color: "#C62828" }}>$4.6 billion</strong>. 8.61 M tonnes domestic + 1.5&ndash;2 M tonnes imported raw, processed by 5+ major plants in the Westhoek region of West Flanders.
                </p>
              </div>
            </div>
            <div className="pp-india-banner-pdf"><PdfDownloadButton size="md" placement="banner" /></div>
          </div>
        </div>
      </section>

      <section className="pp-vital-stats" style={{ background: "#0F1115", padding: "40px 0", color: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div data-summary="true" className="pp-vital-stats-summary" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #E53935", borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 28, fontSize: 14, lineHeight: 1.7, color: "#E5E5E5" }}>
            <strong style={{ color: "#fff" }}>Belgium produced 8.61 million tonnes of potatoes in 2023</strong> (FAOSTAT) on 95,700 hectares at 42.0 t/ha &mdash; nearly 2&times; the world average. <strong>Acreage has nearly doubled since 2000</strong> (from ~55K to 105K ha by 2024), driven entirely by processing demand. Belgium is the <strong>world&apos;s #1 frozen French fry exporter at $4.6 billion</strong>, processing 5.5&ndash;6 M tonnes of raw potatoes per year &mdash; more than the country grows. <strong>Five major processors operate within a 30 km radius</strong> in the Westhoek region of West Flanders. Top players: Clarebout (1.5 M t/yr), Agristo (600K+ t/yr), Mydibel (400K t/yr), Lutosa/McCain, Farm Frites.
          </div>
          <div className="pp-vital-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {stats.map((s, i) => (
              <div key={i} className="pp-vital-stat-cell" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "18px 16px" }}>
                <div className="pp-vital-stat-value" style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5, lineHeight: 1.15, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                  {s.positive && <span className="pp-delta-up" style={{ display: "inline-block", marginLeft: 8, fontSize: 9, fontWeight: 700, color: "#4CAF50", background: "rgba(76,175,80,0.12)", padding: "2px 6px", borderRadius: 3, verticalAlign: "middle" }}>GROWTH</span>}
                </div>
                <div className="pp-vital-stat-label" style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 1.2, marginTop: 8 }}>{s.label}</div>
                <div className="pp-vital-stat-sub" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-mobile-pdf-cta pp-no-print" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "20px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <PdfDownloadButton size="md" placement="banner" />
          <div style={{ fontSize: 11, color: "#888", marginTop: 8, fontWeight: 500 }}>A4-formatted report &middot; all sections, all tables</div>
        </div>
      </section>

      <section className="pp-trajectory-band" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "32px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, marginBottom: 16 }}>FAOSTAT 7-year production trajectory</h2>
          <TrajectoryTable slug={c.slug} />
        </div>
      </section>

      <section className="pp-quickfacts" data-pdf-break-after style={{ background: "#FAFAFA", borderBottom: "1px solid #f0f0f0", padding: "40px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Did you know?</h2>
          <div className="pp-quickfacts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {quickFacts.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "16px 18px", fontSize: 13.5, color: "#333", lineHeight: 1.55, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, color: "#C62828", fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>&#9642;</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Production by Region</h2>
          <p style={proseP}><strong>West Flanders is the dominant production region</strong>, hosting both the largest domestic acreage and the Westhoek processing cluster (Clarebout, Agristo, Lutosa). Hainaut in Wallonia is the secondary hub, anchored by Mydibel (Mouscron) and Lutosa (Leuze-en-Hainaut). Flemish loam soils and the temperate maritime climate support yields of 40&ndash;50 t/ha &mdash; well above the world average of 22.8 t/ha.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Region", "Production (M t)", "% of National", "Notes"].map((h, idx) => <th key={h} style={{ ...tableTH, width: idx === 2 ? "20%" : undefined }}>{h}</th>)}</tr></thead>
              <tbody>
                {regionRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: i < 3 ? 700 : 500, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: i < 3 ? "#C62828" : "#1A1A1A", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{r[2]}%</span>
                        <div className="pp-share-bar-track">
                          <div className="pp-share-bar-fill" style={{ width: Math.min(100, r[2] * 2.4) + "%" }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tableTD, color: "#666", fontSize: 12.5 }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: FAOSTAT 2023 (national); Statbel regional estimates; Belgapom regional production data; Eurostat EU-comparison data.</p>
        </div>
      </section>

      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Variety Portfolio</h2>
          <p style={proseP}>Belgian potato cultivation is dominated by <strong>Dutch-bred processing varieties</strong> &mdash; a reflection of the country&apos;s identity as a fry-processing hub rather than a fresh-market grower. <strong>Fontane has overtaken the historic Bintje</strong> as the leading processing variety, prized for low reducing-sugar content and consistent fry quality. Innovator (premium russet), Challenger, and Markies round out the major processing portfolio. <strong>Bintje (1910)</strong> remains a cultural cornerstone but is in declining commercial use.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Variety", "Year / Origin", "Type", "Notes", "Yield", "Dry Matter"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {varietyRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: r[2].includes("Processing") || r[2].includes("Crisp") ? "#C62828" : "#1A1A1A", fontWeight: 500 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                    <td style={tableTD}>{r[4]}</td>
                    <td style={tableTD}>{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Belgapom variety registry; Agrico, HZPC, Meijer breeder documentation; PCA (Provincieel Centrum voor Aardappelteelt).</p>
        </div>
      </section>

      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>The Westhoek Processing Cluster</h2>
          <p style={proseP}>Belgium&apos;s frozen-fry industry is the most geographically concentrated processing cluster in global agriculture: <strong>five major plants within a 30-kilometre radius</strong> in the Westhoek region of West Flanders, supported by another five+ across the country. The cluster employs over 12,000 people directly and supplies frozen fries to 150+ countries. Major operators are profiled below.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Processor", "Capacity", "Location", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {processorRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Belgapom member registry; company filings; FoodNavigator industry reporting on cross-border expansion.</p>
          <p className="pp-read-more-link" style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}>Read more: <Link href="/knowledge/how-potatoes-are-processed" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>How Potatoes Are Processed: Farm to Fry &rarr;</Link> &middot; <Link href="/knowledge/mcdonalds-potato-varieties" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>What Potatoes Does McDonald&apos;s Use? &rarr;</Link></p>
        </div>
      </section>

      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Trade Profile</h2>
          <p style={proseP}>Belgium&apos;s trade story is uniquely lopsided: it imports 1.5&ndash;2 million tonnes of raw potatoes annually from neighbouring <Link href="/country/france" style={{ color: "#C62828", textDecoration: "none" }}>France</Link>, the <Link href="/country/netherlands" style={{ color: "#C62828", textDecoration: "none" }}>Netherlands</Link>, and <Link href="/country/germany" style={{ color: "#C62828", textDecoration: "none" }}>Germany</Link> &mdash; and exports approximately <strong>€3.4 billion (Eurostat 2023) worth of frozen French fries</strong> to over 150 countries. The country accounts for <strong>25&ndash;30% of global frozen-fry exports by volume</strong>. Top markets: France, UK, Netherlands, Germany within the EU; rapidly growing penetration in the US, Brazil, Saudi Arabia, Japan, South Korea, Australia, and Sub-Saharan Africa.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["Category", "Direction", "Volume / Value", "Trend / Position", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {tradeRows.map((r, i) => (
                  <tr key={r[0] + i} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Eurostat 2023; Belgapom trade reports; UN Comtrade frozen-fry HS code 2004.10.</p>
        </div>
      </section>

      {/* Growing Conditions & Calendar (NEW) */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Growing Conditions &amp; Calendar</h2>
          <p style={proseP}>Belgium has near-ideal potato growing conditions: a <strong>temperate maritime climate</strong> with mild summers (avg 18&ndash;22&deg;C) and reliable rainfall (700&ndash;850 mm/year), <strong>fertile loam soils</strong> across both Flanders and Wallonia, and a long frost-free growing season aligned with North-Western European norms. The combination supports yields of <strong>40&ndash;50 t/ha</strong> &mdash; nearly 2&times; the world average of 22.8 t/ha.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Phase", "Window", "Region / Practice", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ["Land preparation", "Mar–Apr", "All regions", "Plough + seedbed; soil temp >7°C"],
                  ["Planting", "Apr (peak: mid-Apr)", "Flanders + Wallonia", "Mechanised; 75 cm rows × 30 cm in-row"],
                  ["Hilling / ridging", "May–Jun", "All regions", "2–3 passes; weed control"],
                  ["Tuber bulking", "Jul–Aug", "All regions", "Critical irrigation window"],
                  ["Vine kill (chemical / mechanical)", "Late Aug–Sep", "All regions", "10–14 days before harvest"],
                  ["Harvest", "Sep–Oct", "Flanders + Wallonia", "Yield 40–50 t/ha typical"],
                  ["Storage / cold chain", "Oct–Apr (next yr)", "Westhoek + processing hubs", "Ambient cooling + CIPC alternatives"],
                ].map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: NEPG growing-calendar guidance; PCA agronomic best practices; Belgapom production handbook.</p>
        </div>
      </section>

      {/* Frites Culture & Consumption (NEW) */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Consumption &amp; Frites Culture</h2>
          <p style={proseP}>Belgium consumes <strong>~80&ndash;90.8 kg of potatoes per person per year</strong> (FAOSTAT 2023; Belgapom) &mdash; among the highest per-capita rates in Europe. Most of that consumption flows through the country&apos;s defining food tradition: <strong>frites</strong>, served from approximately <strong>5,000 frituren / fritkoten</strong> (fry stands) operating across the country. <strong>Belgian frites culture has been recognised by UNESCO for its candidacy on the Representative List of the Intangible Cultural Heritage of Humanity</strong>, formalising what Belgians have long claimed: that frites are not fast food in Belgium, they are a national institution.</p>
          <p style={proseP}>The traditional Belgian frite is defined by a precise <strong>double-fry technique</strong>: first fry at 130&ndash;140&deg;C (cooks the interior), cool and rest, then second fry at 170&ndash;180&deg;C (creates the crispy exterior). Authentic preparation historically uses <strong>beef tallow</strong> (rather than vegetable oil) and is served in paper cones with mayonnaise &mdash; not ketchup &mdash; alongside dozens of regional sauce variations. The <strong>Belgian National Frite Day</strong> celebrates this culinary identity each year.</p>
          <p style={proseP}>The economic effect is substantial: domestic consumption pulls roughly <strong>20% of the 2.8 M tonnes</strong> of frozen fries Belgian processors output annually, with the remaining 80% feeding the world&apos;s #1 frozen-fry export trade.</p>
          <p style={sourceLine}>Source: FAOSTAT 2023 per-capita consumption data; UNESCO Intangible Cultural Heritage candidacy documentation; Belgian Federal Government cultural-affairs records; Belgapom industry data.</p>
        </div>
      </section>

      {/* Seed Potato System (NEW) */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Seed Potato System: A Net Importer</h2>
          <p style={proseP}>Despite its processing dominance, Belgium is a <strong>net importer of seed potatoes</strong>. The country produces only <strong>3,000&ndash;4,000 hectares of seed potatoes</strong> domestically &mdash; a fraction of neighbouring <Link href="/country/netherlands" style={{ color: "#C62828", textDecoration: "none" }}>Netherlands&apos; 37,000&ndash;40,000 hectares</Link>, which dominates EU and global seed-potato exports. Belgian processing varieties (Fontane, Innovator, Markies, Lady Rosetta) are overwhelmingly Dutch-bred, and most certified seed enters Belgium from <Link href="/country/netherlands" style={{ color: "#C62828", textDecoration: "none" }}>NL</Link> and <Link href="/country/france" style={{ color: "#C62828", textDecoration: "none" }}>France</Link>.</p>
          <p style={proseP}>Belgian seed-quality oversight is handled by the federal seed authority in coordination with industry through Belgapom and processor-led contract specifications. The country&apos;s <strong>seed-multiplication ratio is high</strong> (yields of 40+ t/ha mean a few thousand hectares of seed support the entire ware crop), but the dependence on Dutch breeders for genetic improvement is a strategic vulnerability that Belgian industry continues to navigate via long-term supplier relationships.</p>
          <p style={sourceLine}>Source: Eurostat seed-potato trade data; NAK Annual Report 2023 (cross-border supplier reference); Belgapom seed-system overview.</p>
        </div>
      </section>

      {/* Sustainability / Nitrogen Regulation (NEW) */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Sustainability &amp; Nitrogen Regulation</h2>
          <p style={proseP}>Belgian potato production operates under the <strong>EU Nitrates Directive (91/676/EEC)</strong>, which caps organic-source nitrogen application at <strong>170 kg N/ha</strong> in nitrate vulnerable zones (NVZs) and requires total nitrogen management to keep groundwater nitrate concentrations below <strong>50 mg/L</strong>. Potato is among the most nitrogen-intensive horticultural crops &mdash; typically requiring 200&ndash;250 kg N/ha for optimal yields with <strong>nitrogen use efficiency of just 60&ndash;70%</strong> (Zebarth et al. 2009, American Journal of Potato Research) &mdash; meaning 30&ndash;40% of applied N is lost via leaching, denitrification, or volatilisation. Belgium&apos;s sandy soils in parts of Limburg and West Flanders are particularly leaching-prone.</p>
          <p style={proseP}>Compliance strategies in active use across Belgian farms:</p>
          <p style={proseP}>&bull; <strong>Split nitrogen application</strong> &mdash; 3&ndash;4 smaller applications instead of one pre-plant dose, reducing leaching by 20&ndash;40%.<br />
          &bull; <strong>Enhanced efficiency fertilisers</strong> with slow-release or nitrification-inhibitor formulations (cuts N&sub;2;O emissions 20&ndash;50%).<br />
          &bull; <strong>Sensor-based in-season nitrogen management</strong> using NDVI vegetation-index measurements.<br />
          &bull; <strong>Cover crops / catch crops</strong> in rotation to capture residual nitrate post-harvest.<br />
          &bull; <strong>Manure management</strong> (Flemish &ldquo;MAP&rdquo; manure action plans) tracking nutrient flows on each farm.</p>
          <p style={sourceLine}>Source: EU Nitrates Directive 91/676/EEC; Zebarth et al. (2009), American Journal of Potato Research; Flemish MAP manure action programme; Belgian Federal Public Service Health, Food Chain Safety and Environment.</p>
        </div>
      </section>

      {/* Research & Breeding (NEW) */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Research &amp; Breeding</h2>
          <p style={proseP}>Belgium does not operate dedicated national-scale potato breeding programmes comparable to those in the <Link href="/country/netherlands" style={{ color: "#C62828", textDecoration: "none" }}>Netherlands</Link> (Agrico, HZPC, Meijer) or other potato powerhouses. Instead, innovation is <strong>industry-led</strong> through partnerships between Belgian processors, the Dutch breeders supplying their seed, and applied-research bodies including:</p>
          <p style={proseP}>&bull; <strong>PCA</strong> (Provincieel Centrum voor Aardappelteelt) &mdash; provincial agronomic research and extension based in West Flanders.<br />
          &bull; <strong>ILVO</strong> (Flanders Research Institute for Agriculture, Fisheries and Food) &mdash; applied research on disease management, sustainability, and post-harvest quality.<br />
          &bull; <strong>CRA-W</strong> (Walloon Agricultural Research Centre) &mdash; complementary research for Wallonia.<br />
          &bull; <strong>Inagro</strong> &mdash; West Flanders applied agronomic research and on-farm trials.<br />
          &bull; <strong>Belgapom-coordinated industry trials</strong> &mdash; multi-stakeholder variety performance and processing-quality evaluations.</p>
          <p style={proseP}>The model is pragmatic: Dutch breeders deliver new varieties, Belgian institutions evaluate them under local conditions and processing specs, and Belgapom coordinates industry uptake. The result is one of the world&apos;s most efficient processing-variety pipelines despite Belgium&apos;s small geographic footprint.</p>
          <p style={sourceLine}>Source: Belgapom research-partnership documentation; PCA, ILVO, CRA-W, Inagro institutional pages; published industry trials.</p>
        </div>
      </section>

      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Industry Challenges</h2>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Challenge", "Magnitude", "Driver / Note"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {challengeRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#444" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="ai-explorer" className="pp-ai-explorer-band pp-no-print" style={{ background: "linear-gradient(135deg,#0F1115 0%,#1A1F26 100%)", color: "#fff", padding: "52px 0 36px" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E53935", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Potatopedia AI &middot; Belgium</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: -1, lineHeight: 1.2 }}>Ask Anything About Belgium&apos;s Potato Industry</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0", lineHeight: 1.6 }}>
              Get data-backed answers from our 5,024-chunk knowledge base &mdash; pre-filtered for Belgium.
            </p>
          </div>
        </div>
      </section>
      <section className="pp-ai-explorer-light pp-no-print" style={{ background: "#fff", borderTop: "0", borderBottom: "1px solid #f0f0f0" }}>
        <CountryAI countryName="Belgium" countrySlug="belgium" />
      </section>

      <CountryVarieties countrySlug={c.slug} countryName={c.name} />

      <CountryBlogPosts countrySlug={c.slug} />

      <section className="pp-comparable-countries pp-no-print" style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", padding: "48px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, textAlign: "left" }}>Compare with European Peers</h2>
          <div className="pp-india-comparable-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 8 }}>
            {COUNTRIES.filter((x) => ["netherlands", "germany", "france", "united-kingdom"].includes(x.slug)).map((x) => (
              <Link key={x.slug} href={"/country/" + x.slug} style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center", border: "1px solid #ececec", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{x.flag}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{x.name}</div>
                <div style={{ fontSize: 22, color: "#C62828", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{x.prod}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>#{x.rank} Global &middot; {x.yield}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }} className="pp-india-related-grid">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Related Knowledge</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { slug: "how-potatoes-are-processed", title: "How Potatoes Are Processed: Farm to Fry", desc: "Frozen fries, chips, starch — the global $40-80B processing industry." },
                  { slug: "mcdonalds-potato-varieties", title: "What Potatoes Does McDonald's Use?", desc: "The Russet Burbank story — and where Belgian fries fit in." },
                  { slug: "global-potato-trade", title: "Global Potato Trade Statistics", desc: "$22.8B trade — Belgium leads frozen fries at 25-30% of global exports." },
                  { slug: "top-potato-producing-countries", title: "Top Potato Producing Countries 2025", desc: "FAOSTAT rankings — Belgium #18 by production but #1 in fry trade." },
                ].map((a) => (
                  <Link key={a.slug} href={"/knowledge/" + a.slug} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "12px 16px", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>{a.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="pp-sources-block" style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "20px 22px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Sources</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>FAOSTAT 2023</strong> — UN Food and Agriculture Organization production data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Belgapom</strong> — Belgian Potato Trade and Processing Association; industry data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Eurostat 2023</strong> — EU production and trade statistics</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>NEPG</strong> — North-Western European Potato Growers; regional context</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Statbel</strong> — Belgian Statistical Office; regional production</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>PCA</strong> — Provincieel Centrum voor Aardappelteelt; agronomic research</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Agrico, HZPC, Meijer</strong> — Dutch breeder documentation for Fontane, Innovator, Markies, Lady Rosetta</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Company filings</strong> — Clarebout, Agristo, Mydibel, McCain (Lutosa)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Inline document-end footer — guaranteed on mobile + Safari PDFs */}
      <div className="pp-print-footer-inline" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      <section className="pp-bottom-cta pp-no-print" style={{ background: "linear-gradient(180deg,#FFF8F8 0%,#FFFFFF 100%)", borderTop: "1px solid #f0f0f0", padding: "44px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Premium Export</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" }}>Download the Full Belgium Industry Profile</h3>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 22px", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            All sections, all tables, all sources &mdash; formatted for A4 printing or sharing as a PDF report. Branded footer on every page (potatopedia.com &middot; hello@potatopedia.com &middot; linkedin.com/company/potatopedia).
          </p>
          <PdfDownloadButton size="lg" placement="footer" />
        </div>
      </section>
    </div>
  );
}

/* ── Netherlands: full Country Intelligence Dossier (Tier 1) ── */

function NetherlandsProfilePage({ c }) {
  const stats = [
    { value: "6.5 M t", label: "Annual Production", sub: "Eurostat 2023" },
    { value: "158,000 ha", label: "Harvested Area", sub: "CBS 2023" },
    { value: "41.1 t/ha", label: "Average Yield", sub: "well above world avg (22.8)" },
    { value: "#1", label: "Seed Potato Exporter", sub: ">60% global share" },
    { value: "800,000 t", label: "Seed Potato Exports / yr", sub: "to 80+ countries" },
    { value: "$1.2 B", label: "Raw Potato Exports", sub: "19.8% global share (2023)" },
    { value: "3.5 M t", label: "Processed Annually", sub: "Europe #2 after Belgium" },
    { value: "69.2%", label: "EU Seed-Trade Share by Value", sub: "Eurostat 2023", positive: true },
  ];

  const quickFacts = [
    "The Netherlands exports certified seed potatoes to 80+ countries — over 60% of the entire global certified-seed market",
    "HZPC alone holds 20–25% of the global seed-potato market with €500 M revenue across 700 grower-shareholders",
    "NAK conducts ~110,000 field inspections + 45,000 lab tests per year — the world's most rigorous certification regime",
    "Solynta + WUR pioneered hybrid potato breeding from true seed — cuts variety development from 15 years to 6–8",
    "Dutch nitrogen use dropped from 250 → 180–200 kg N/ha over two decades while maintaining 45+ t/ha yields",
    "Aviko (Royal Cosun) holds ~50% of the global chilled French-fry market across 13 plants in six countries",
    "AVEBE — a 2,300-farmer cooperative — produces 600,000 tonnes of potato starch per year (world's #2 starch exporter)",
    "Drone-based late-blight detection at Dutch farms catches infection 3–5 days before visible symptoms, cutting fungicide use 30–50%",
  ];

  const provinceRows = [
    ["Drenthe", "28,600 ha", "Starch belt", "AVEBE cooperative; sandy-peat soils"],
    ["Groningen", "27,000 ha", "Starch belt + seed", "Northern starch heart; AVEBE supply"],
    ["Flevoland", "Premium polder", "Ware + premium seed", "Highest yields nationally; reclaimed polder land"],
    ["Noord-Holland", "Major seed area", "Seed potato specialist", "Maritime climate, low aphid pressure"],
    ["Friesland", "Major seed area", "Seed potato + ware", "Northern province; clay soils"],
    ["Zeeland", "Significant ware area", "Ware potato", "Clay soils, Belgian-processor adjacent"],
    ["Other (S/W provinces)", "Variable", "Mixed", "Smaller commercial plots"],
  ];

  const segmentRows = [
    ["Ware potatoes (table + processing)", "~47%", "~52%", "Domestic + EU fresh; processor supply"],
    ["Seed potatoes (certified export)", "~27%", "~23%", "60%+ global market; 800K t exports"],
    ["Starch potatoes (industrial)", "~27%", "~25%", "AVEBE-bound; Drenthe + Groningen"],
  ];

  const varietyRows = [
    ["Innovator", "HZPC", "Processing (QSR fries)", "Long-oval; light yellow flesh; high DM; PCN Pa2/Pa3 resistance", "Global #1 fry variety"],
    ["Fontane", "Agrico (1999)", "Processing (fries + flakes)", "Agria × AR 76-34-3; 18–21% DM; very low sugar", "Top fry variety in Belgium / NL"],
    ["Markies", "Agrico (1997)", "Processing (dual: fries + crisps)", "Flexible cooking type", "Strong premium-fries presence"],
    ["Lady Rosetta", "Meijer (1988)", "Crisp / chip processing", "Specialist crisping variety", "Used in Indian, EU chip lines"],
    ["Colomba", "HZPC", "Table (very early)", "Bright yellow skin; low-cal positioning", "Premium retail in Western Europe"],
    ["Red Scarlett", "HZPC", "Table (red-skinned)", "Red skin / yellow flesh", "Wide retail distribution"],
    ["Annabelle", "—", "Table (waxy salad)", "Smooth yellow; firm cooking", "Mediterranean + retail"],
    ["Asterix", "HZPC", "Multipurpose / table", "Red skin; reliable yield", "Long-running export variety"],
    ["Mondial", "Agrico", "Table / fresh export", "Long-oval; high yield", "Tropical / Mediterranean export"],
    ["Spunta", "Agrico", "Table (fresh export)", "Long elongated; widely adapted", "Mediterranean + developing-market staple"],
    ["Désirée", "Agrico (1962)", "All-purpose (red-skinned)", "Heritage variety; global cultivation", "Among world's most-planted varieties"],
    ["Bintje", "1910 (heritage)", "Processing (declining)", "Long-oval; classic Belgian fry standard", "Cultural heritage; commercial decline"],
  ];

  const seedExportRows = [
    ["Total seed potato production", "1.5 M tonnes", "CBS Statistics Netherlands"],
    ["Annual seed exports", "800,000 tonnes", "70–75% of national seed crop"],
    ["Export destination countries", "80+", "Phytosanitary protocols via NIVAP / NVWA"],
    ["Global market share", ">60%", "Certified-seed segment"],
    ["EU intra-EU trade share by value", "69.2%", "Eurostat 2023"],
    ["Certified seed area", "~40,000 ha", "Across Flevoland, Friesland, Groningen, Zeeland, NH"],
    ["Certified seed growers", "~3,500", "NAO / NAK Annual Report 2023"],
    ["NAK field inspections / yr", "~110,000", "World's most rigorous certification regime"],
    ["NAK laboratory tests / yr", "~45,000", "Phytosanitary + virus testing"],
  ];

  const breederRows = [
    ["HZPC Holland", "Joure (Friesland)", "World's largest seed-potato company; 20–25% global share", "Cooperative — 700 grower-shareholders; €500 M revenue; 80+ countries"],
    ["Agrico", "Emmeloord (Flevoland)", "Second-largest Dutch breeder", "1,300+ grower-shareholders cooperative; Fontane, Markies, Spunta, Désirée"],
    ["Meijer Potato", "Kruiningen (Zeeland)", "Lady Rosetta + premium varieties", "Joint venture with Lamb Weston (Lamb Weston Meijer)"],
    ["Europlant", "—", "Major European breeder operations", "Active across NL/DE markets"],
    ["Danespo NL", "—", "Danish breeder Dutch operations", "Mediterranean + export-market focus"],
    ["STET Holland", "Emmeloord", "Premium fresh + processing breeder", "Specialty + niche varieties"],
    ["Solynta", "Wageningen", "Hybrid potato breeding pioneer", "True-seed F1 hybrids; 6–8 yr cycle"],
    ["WUR (Wageningen UR)", "Wageningen", "Public research and Sli-gene breakthrough", "Ernst-Jan Eggers (2022 WUR Award)"],
  ];

  const processorRows = [
    ["Aviko (Royal Cosun)", "Steenderen + 13 plants in 6 countries", "Frozen + chilled fries", "€750 M+ revenue; ~50% global chilled-fries share"],
    ["Farm Frites", "Oudenhoorn (HQ)", "B2B frozen fries", "€1 B+ revenue; plants NL/BE/EG/AR"],
    ["Lamb Weston Meijer", "Bergen op Zoom", "Frozen fries (US-NL JV)", "Major EU producer; partnership with Meijer breeders"],
    ["AVEBE", "Veendam (Drenthe / Groningen)", "Potato starch", "2,300-farmer cooperative; 600,000 t starch/yr; $213 M exports (#2 globally)"],
    ["Peka Kroef", "Odiliapeel", "Ready-meal potato products", "Pre-cooked, vacuum-packed potato specialist"],
    ["McCain Netherlands", "Lewedorp (Zeeland)", "Frozen fries (Canadian-owned)", "Major NL processing footprint"],
  ];

  const tradeRows = [
    ["Seed potatoes", "Exports", "800,000 t / yr", "60%+ global share", "80+ destination countries"],
    ["Raw potatoes (ware)", "Exports", "$1.2 B (2023)", "19.8% of global value", "Major flow to Belgian processors"],
    ["Frozen French fries", "Exports", "Significant (Aviko, Farm Frites, LWM)", "Top-3 globally", "Asia + Europe destinations"],
    ["Potato starch", "Exports", "$213 M (2022)", "Globally #2 after Germany", "AVEBE-led"],
    ["Ware potato imports", "From DE / FR / BE", "~1 M t / yr", "For domestic processing", "Cross-border raw-material flow"],
    ["Total potato-product trade balance", "Net exporter", "Strongly positive", "Hub role across all categories", ""],
  ];

  const techRows = [
    ["GPS-guided planting", "~Universal in commercial NL ops", "CBS / NAO data", "Exact spacing + depth control"],
    ["Variable Rate Application (VRA)", "Widely adopted", "WUR studies", "15–25% N reduction without yield loss"],
    ["Drone multispectral imaging", "Commercial use", "Sugiura et al. 2016", "Detects late blight 3–5 days early"],
    ["Late-blight forecasting models", "Standard practice", "WUR + industry", "Weather-based spray timing"],
    ["Fungicide reduction via precision", "30–50%", "Targeted vs whole-field spray", "Environmental + cost benefit"],
    ["Nitrogen efficiency gain", "250 → 180–200 kg N/ha (2 decades)", "CBS / NAO", "Yields maintained at 45+ t/ha"],
    ["Hybrid breeding (Solynta+WUR)", "Commercial pipeline", "True-seed F1 hybrids", "Cuts breeding cycle 15 → 6–8 yrs"],
    ["AI / genomic selection", "HZPC + breeder labs", "Marker-assisted selection (MAS)", "Faster early-generation screening"],
  ];

  const challengeRows = [
    ["Climate change", "Wetter winters, drier summers", "Yield variability + irrigation pressure"],
    ["Late blight aggressiveness", "New strains every few years", "Drives ~30% of fungicide cost despite precision use"],
    ["Nitrogen / nitrate regulation", "EU Directive 91/676/EEC + national MAP plans", "Leaching risk on sandy soils; cap 170 kg N/ha in NVZ"],
    ["Land scarcity", "Among world's most expensive ag land", "Limits area expansion; pushes intensification"],
    ["Phytosanitary pressure", "Brown rot, ring rot, PCN", "Threatens premium seed-export positioning"],
    ["Hybrid-breeding adoption", "Seed-tuber industry vs true-seed F1 transition", "Multi-decade structural shift in seed supply"],
  ];

  const pageUrl = "https://www.potatopedia.com/country/netherlands";
  const generatedDate = "April 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Netherlands Potato Industry Profile — World's #1 Seed Potato Exporter",
        description: "Country profile of the Netherlands' potato industry. 6.5 M tonnes (Eurostat 2023) on 158,000 ha at 41 t/ha. World's #1 seed-potato exporter at 60%+ global share. HZPC, Agrico, Solynta hybrid breeding, AVEBE starch, Aviko + Farm Frites processing.",
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
        publisher: { "@id": "https://www.potatopedia.com/#publisher" },
        mainEntityOfPage: pageUrl,
        image: "https://www.potatopedia.com/og-image.png",
        about: { "@type": "Country", name: "Netherlands" },
        speakable: SPEAKABLE,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
          { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: "Netherlands" } },
        ],
      },
      {
        "@type": "Dataset",
        name: "Netherlands Potato Production by Province + Segment 2023",
        description: "Production area, segment split (ware/seed/starch), and provincial distribution for the Netherlands.",
        creator: { "@type": "Organization", name: "Potatopedia" },
        license: "https://www.potatopedia.com/about",
        keywords: ["Netherlands", "potato", "seed potato", "Eurostat", "NAK", "Flevoland", "Drenthe", "AVEBE", "HZPC"],
        url: pageUrl,
      },
    ],
  };

  const sectionWrap = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
  const sectionTitle = { fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px", paddingLeft: 12, borderLeft: "4px solid #C62828", lineHeight: 1.2 };
  const tableTH = { padding: "10px 12px", textAlign: "left", background: "#C62828", color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 };
  const tableTD = { padding: "10px 12px", fontSize: 13.5, borderBottom: "1px solid #eee", color: "#333" };
  const proseP = { fontSize: 14.5, color: "#444", lineHeight: 1.7, margin: "0 0 12px" };
  const sourceLine = { fontSize: 12, color: "#999", fontStyle: "italic", margin: "4px 0 0" };

  return (
    <div className="pp-country-page pp-country-india" style={{ minHeight: "100vh", background: "#fff", overflowX: "hidden", fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{ppCSS}</style>
      <style>{printCSS}</style>
      <style>{`
        .pp-mobile-pdf-cta { display: none; }
        @media (max-width: 768px) {
          .pp-india-banner-row { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
          .pp-india-banner-pdf { display: none !important; }
          .pp-vital-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-quickfacts-grid { grid-template-columns: 1fr !important; }
          .pp-india-comparable-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-india-related-grid { grid-template-columns: 1fr !important; }
          .pp-mobile-pdf-cta { display: block !important; }
        }
        @media (max-width: 480px) {
          .pp-vital-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
        .pp-share-bar-track { position: relative; height: 6px; background: rgba(198,40,40,0.08); border-radius: 3px; min-width: 80px; margin-top: 4px; }
        .pp-share-bar-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg,#C62828,#E53935); border-radius: 3px; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pp-print-only pp-print-header">
        <div className="pp-print-header-row">
          <div className="pp-print-header-brand">POTATOPEDIA</div>
          <div className="pp-print-header-meta">
            <div>The World&apos;s Potato Intelligence Platform</div>
            <div>potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia</div>
            <div>Generated {generatedDate}</div>
          </div>
        </div>
      </div>

      {/* Bulletproof per-page footer (Safari fallback for @page @bottom-center) */}
      <div className="pp-print-footer-fixed" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      {/* S1 · Executive Banner */}
      <section className="pp-india-banner" style={{ borderBottom: "2px solid #C62828", background: "linear-gradient(180deg,#FFF 0%,#FFF8F8 100%)" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ paddingTop: 24, paddingBottom: 8 }}>
            <Link href="/countries" className="pp-no-print" style={{ fontSize: 12, color: "#C62828", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>&larr; All Countries</Link>
          </div>
          <div className="pp-india-banner-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, paddingBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div className="pp-india-banner-flag" style={{ fontSize: 80, lineHeight: 1 }}>{c.flag}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#C62828", padding: "4px 10px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>#{c.rank} Global Producer</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>{c.region}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>Eurostat 2023</span>
                </div>
                <h1 style={{ fontSize: 44, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: -1.5, lineHeight: 1.1 }}>{c.name}</h1>
                <p className="pp-india-tagline" style={{ fontSize: 16, color: "#444", margin: "10px 0 0", lineHeight: 1.5, maxWidth: 600 }}>
                  World&apos;s <strong style={{ color: "#C62828" }}>#1 seed-potato exporter</strong> &mdash; over 60% of the global certified-seed market. Home to HZPC, Agrico, Solynta, and AVEBE. The Silicon Valley of the global potato industry.
                </p>
              </div>
            </div>
            <div className="pp-india-banner-pdf"><PdfDownloadButton size="md" placement="banner" /></div>
          </div>
        </div>
      </section>

      {/* S2 · Vital Stats */}
      <section className="pp-vital-stats" style={{ background: "#0F1115", padding: "40px 0", color: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div data-summary="true" className="pp-vital-stats-summary" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #E53935", borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 28, fontSize: 14, lineHeight: 1.7, color: "#E5E5E5" }}>
            <strong style={{ color: "#fff" }}>The Netherlands produced 6.5 million tonnes of potatoes in 2023</strong> on 158,000 hectares (Eurostat) at <strong>41.1 t/ha</strong> &mdash; nearly 2&times; the world average. The country is the <strong>world&apos;s #1 certified seed-potato exporter</strong>, capturing over 60% of the global market and 69.2% of intra-EU seed-potato trade by value. Annual seed exports total <strong>800,000 tonnes to 80+ countries</strong>. The breeding ecosystem &mdash; HZPC, Agrico, Meijer, Europlant, Danespo NL, STET Holland, plus hybrid pioneer Solynta and WUR public research &mdash; ships <strong>more new commercial potato varieties per year than any other country in the world</strong>. AVEBE produces 600,000 t of starch annually; Aviko, Farm Frites, and Lamb Weston Meijer dominate frozen-fry processing.
          </div>
          <div className="pp-vital-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {stats.map((s, i) => (
              <div key={i} className="pp-vital-stat-cell" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "18px 16px" }}>
                <div className="pp-vital-stat-value" style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5, lineHeight: 1.15, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                  {s.positive && <span className="pp-delta-up" style={{ display: "inline-block", marginLeft: 8, fontSize: 9, fontWeight: 700, color: "#4CAF50", background: "rgba(76,175,80,0.12)", padding: "2px 6px", borderRadius: 3, verticalAlign: "middle" }}>EU</span>}
                </div>
                <div className="pp-vital-stat-label" style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 1.2, marginTop: 8 }}>{s.label}</div>
                <div className="pp-vital-stat-sub" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-only PDF CTA */}
      <section className="pp-mobile-pdf-cta pp-no-print" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "20px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <PdfDownloadButton size="md" placement="banner" />
          <div style={{ fontSize: 11, color: "#888", marginTop: 8, fontWeight: 500 }}>A4-formatted report &middot; all sections, all tables</div>
        </div>
      </section>

      {/* S3 · Quick Facts */}
      <section className="pp-trajectory-band" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "32px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, marginBottom: 16 }}>FAOSTAT 7-year production trajectory</h2>
          <TrajectoryTable slug={c.slug} />
        </div>
      </section>

      <section className="pp-quickfacts" data-pdf-break-after style={{ background: "#FAFAFA", borderBottom: "1px solid #f0f0f0", padding: "40px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Did you know?</h2>
          <div className="pp-quickfacts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {quickFacts.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "16px 18px", fontSize: 13.5, color: "#333", lineHeight: 1.55, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, color: "#C62828", fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>&#9642;</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S4 · Production by Province */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Production by Province &amp; Segment</h2>
          <p style={proseP}>Despite its small footprint, the Netherlands is Europe&apos;s 3rd-largest potato producer at <strong>6.5 M tonnes / 158,000 ha (2023)</strong> — 13.4% of the EU total, behind only <Link href="/country/germany" style={{ color: "#C62828", textDecoration: "none" }}>Germany</Link> (24.0%) and <Link href="/country/france" style={{ color: "#C62828", textDecoration: "none" }}>France</Link> (17.9%). Production splits cleanly across three segments — <strong>ware (~47% area), seed (~27%), and industrial starch (~27%)</strong> — each anchored in distinct provinces. Drenthe and Groningen drive the starch belt for AVEBE; Flevoland delivers the country&apos;s top yields on reclaimed polder land; Noord-Holland and Friesland host the export-grade certified-seed sector.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Province", "Area / Role", "Segment", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {provinceRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: i < 3 ? 700 : 500, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: i < 3 ? "#C62828" : "#1A1A1A", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CBS Statistics Netherlands; Eurostat 2023; NAO/NAK regional data.</p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "24px 0 8px" }}>Segment split (CBS StatLine 2022 baseline)</h3>
          <div style={{ overflowX: "auto", marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Segment", "Share of Area", "Share of Production", "Anchor"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {segmentRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i % 2 === 0 ? "rgba(198,40,40,0.03)" : "#fff" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CBS StatLine; NAO sector classification.</p>
        </div>
      </section>

      {/* S5 · Seed Potato Industry — THE CENTERPIECE */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>The Seed Potato Industry — World&apos;s #1</h2>
          <p style={proseP}>This is the Netherlands&apos; defining global role. The country produces approximately <strong>1.5 million tonnes of seed potatoes per year</strong>, of which <strong>800,000 tonnes &mdash; 70&ndash;75% &mdash; are exported</strong> to over 80 countries. Dutch certified seed captures more than <strong>60% of the entire global certified-seed market</strong> and <strong>69.2% of intra-EU seed-potato trade by value</strong> (Eurostat 2023). The industry is built on three pillars: rigorous certification (NAK), commercial cooperatives (HZPC, Agrico, Meijer), and ideal growing conditions (cool maritime climate, low aphid pressure, premium polder soils).</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["Metric", "Value", "Note"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {seedExportRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: NAK Annual Report 2023; CBS Statistics Netherlands (CBS table 7100eng); Eurostat 2023 trade data; NIVAP (Netherlands Potato Consultative Foundation); NVWA phytosanitary data.</p>
          <p style={proseP}><strong>Why Dutch seed dominates globally:</strong> the cool maritime summer (mean July temperature 17&ndash;19&deg;C, 700&ndash;800 mm annual rainfall) suppresses aphid populations &mdash; meaning fewer virus infections in the crop. Northern provinces (Flevoland, Friesland, Groningen, Drenthe, Noord-Holland, Zeeland) compound this with even lower aphid pressure. Reclaimed polder soils in Flevoland deliver near-perfect drainage, structure, and moisture retention. NAK&apos;s certification framework &mdash; ~110,000 field inspections + ~45,000 lab tests per year &mdash; enforces phytosanitary standards no other country has matched at scale.</p>
          <p className="pp-read-more-link" style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}>Read more: <Link href="/knowledge/seed-potato-systems" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Seed Potato Systems: Certification, Trade &amp; Multiplication &rarr;</Link></p>
        </div>
      </section>

      {/* S6 · Breeders & Innovation Pipeline */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Breeders &amp; the Innovation Pipeline</h2>
          <p style={proseP}>Dutch breeders ship more new commercial potato varieties per year than any other country &mdash; the cumulative output of HZPC, Agrico, Meijer, Europlant, Danespo NL, and STET Holland flows into virtually every potato-producing region globally. Conventional tetraploid breeding takes 10&ndash;15 years from cross to commercial release; <strong>Solynta&apos;s hybrid breeding from true seed (developed in partnership with WUR / Wageningen University &amp; Research) compresses that to 6&ndash;8 years</strong>, enabling disease-resistance stacking and propagation via true potato seed instead of bulky tubers.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Company / Institution", "Location", "Role", "Detail"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {breederRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: HZPC, Agrico, Meijer, Europlant, STET Holland corporate documentation; WUR institutional records; Solynta press materials; Ernst-Jan Eggers WUR Award 2022.</p>
        </div>
      </section>

      {/* S7 · Variety Portfolio */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Variety Portfolio</h2>
          <p style={proseP}>The Dutch breeding portfolio anchors the world&apos;s processing-quality fries (<strong>Innovator, Fontane, Markies</strong>), defines the European fresh-market premium tier (<strong>Colomba, Annabelle, Red Scarlett</strong>), and supplies developing-country export markets (<strong>Spunta, Mondial, Désirée</strong>). The historic <strong>Bintje</strong> (1910) is still grown but in commercial decline. Every major Belgian processor relies on Dutch-bred varieties for its raw material.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table data-print-wide style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", background: "#fff" }}>
              <thead><tr>{["Variety", "Breeder", "Type", "Key Traits", "Market Position"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {varietyRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: r[2].includes("Processing") || r[2].includes("Crisp") ? "#C62828" : "#1A1A1A", fontWeight: 500 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                    <td style={tableTD}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: HZPC, Agrico, Meijer variety catalogues; Plantum NL breeder registry.</p>
        </div>
      </section>

      {/* S8 · Processing Industry */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Processing Industry &amp; Major Players</h2>
          <p style={proseP}>The Netherlands processes approximately <strong>3.5 million tonnes of potatoes annually &mdash; Europe&apos;s #2 processing country after <Link href="/country/belgium" style={{ color: "#C62828", textDecoration: "none" }}>Belgium</Link></strong>. The industry is structurally diverse: Aviko (Royal Cosun cooperative) leads chilled and out-of-home fries with ~50% of the global chilled-fry market; Farm Frites is a B2B frozen-fry powerhouse; Lamb Weston Meijer is a NL/US joint-venture frozen-fry producer; AVEBE dominates industrial starch; McCain operates a major Lewedorp facility.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Company", "Location", "Activity", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {processorRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Royal Cosun annual reports (Aviko); Farm Frites company filings; Lamb Weston / Meijer joint-venture documentation; AVEBE cooperative reports; FAOSTAT 2022 starch trade data.</p>
          <p className="pp-read-more-link" style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}>Read more: <Link href="/knowledge/how-potatoes-are-processed" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>How Potatoes Are Processed: Farm to Fry &rarr;</Link></p>
        </div>
      </section>

      {/* S9 · Trade Profile */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Trade Profile</h2>
          <p style={proseP}>The Netherlands is a strongly <strong>net-exporter</strong> across virtually every potato product category and serves as Europe&apos;s logistics hub for cross-border raw-material flows. Dutch ware-potato imports (~1 M t/yr from <Link href="/country/germany" style={{ color: "#C62828", textDecoration: "none" }}>Germany</Link>, <Link href="/country/france" style={{ color: "#C62828", textDecoration: "none" }}>France</Link>, <Link href="/country/belgium" style={{ color: "#C62828", textDecoration: "none" }}>Belgium</Link>) feed processing capacity that exceeds domestic ware production.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", background: "#fff" }}>
              <thead><tr>{["Category", "Direction", "Volume / Value", "Position", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {tradeRows.map((r, i) => (
                  <tr key={r[0] + i} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Eurostat 2023 trade data; UN Comtrade; CBS Statistics Netherlands; FAOSTAT 2022 starch trade.</p>
        </div>
      </section>

      {/* S10 · Growing Conditions */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Growing Conditions &amp; Calendar</h2>
          <p style={proseP}>Dutch potato cultivation operates in a <strong>temperate maritime climate</strong> with mild summers (mean July temperature 17&ndash;19&deg;C), reliable rainfall (700&ndash;800 mm/year), and minimal extreme weather. The combination is uniquely well-suited to potato: cool nights protect tuber development; long daylight hours drive bulking; reclaimed polder soils (especially in Flevoland) deliver excellent drainage and structure. Northern provinces face significantly lower aphid pressure than continental European competitors &mdash; a defining advantage for virus-free seed production.</p>
          <p style={proseP}><strong>Planting:</strong> April (peak: mid-April). <strong>Hilling:</strong> May–June. <strong>Tuber bulking:</strong> July–August (the critical irrigation window). <strong>Vine kill:</strong> Late August–September, 10–14 days before harvest. <strong>Harvest:</strong> September–October. <strong>Storage / processing window:</strong> October–April. The growing season aligns with NEPG North-Western European norms; PCA agronomic best practices guide on-farm operations.</p>
          <p style={sourceLine}>Source: NAK Annual Report 2023; CBS Statistics Netherlands; KNMI climate data; NEPG growing-calendar guidance.</p>
        </div>
      </section>

      {/* S11 · Technology & Precision Agriculture */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Technology &amp; Precision Agriculture</h2>
          <p style={proseP}>The Netherlands operates the <strong>most technologically advanced commercial potato sector in the world</strong>. GPS-guided planting, variable-rate fertiliser application, drone-based late-blight detection, and sensor-driven irrigation are universal across commercial farms. The result: nitrogen application has dropped from 250 → 180&ndash;200 kg N/ha over two decades while maintaining yields above 45 t/ha &mdash; an environmental and economic gain that no other producing country has matched.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["Technology", "Adoption", "Reference", "Impact"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {techRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[2]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: CBS Statistics Netherlands; NAO sector reports; Sugiura et al. (2016), Precision Agriculture; WUR research publications.</p>
        </div>
      </section>

      {/* S12 · Challenges */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Industry Challenges</h2>
          <p style={proseP}>Despite global leadership, the Dutch potato sector faces structural pressures across climate, regulation, and breeding-architecture transition.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Challenge", "Magnitude", "Driver / Note"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {challengeRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#444" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* S13 · AI Explorer — two bands */}
      <section id="ai-explorer" className="pp-ai-explorer-band pp-no-print" style={{ background: "linear-gradient(135deg,#0F1115 0%,#1A1F26 100%)", color: "#fff", padding: "52px 0 36px" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E53935", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Potatopedia AI &middot; Netherlands</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: -1, lineHeight: 1.2 }}>Ask Anything About the Netherlands&apos; Potato Industry</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0", lineHeight: 1.6 }}>
              Get data-backed answers from our 5,024-chunk knowledge base &mdash; pre-filtered for Netherlands.
            </p>
          </div>
        </div>
      </section>
      <section className="pp-ai-explorer-light pp-no-print" style={{ background: "#fff", borderTop: "0", borderBottom: "1px solid #f0f0f0" }}>
        <CountryAI countryName="Netherlands" countrySlug="netherlands" />
      </section>

      {/* S14 · Comparable Countries */}
      <CountryVarieties countrySlug={c.slug} countryName={c.name} />

      <CountryBlogPosts countrySlug={c.slug} />

      <section className="pp-comparable-countries pp-no-print" style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", padding: "48px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, textAlign: "left" }}>Compare with European Peers</h2>
          <div className="pp-india-comparable-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 8 }}>
            {COUNTRIES.filter((x) => ["belgium", "germany", "france", "united-kingdom"].includes(x.slug)).map((x) => (
              <Link key={x.slug} href={"/country/" + x.slug} style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center", border: "1px solid #ececec", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{x.flag}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{x.name}</div>
                <div style={{ fontSize: 22, color: "#C62828", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{x.prod}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>#{x.rank} Global &middot; {x.yield}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* S15 · Related & Sources */}
      <section style={{ padding: "48px 0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }} className="pp-india-related-grid">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Related Knowledge</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { slug: "seed-potato-systems", title: "Seed Potato Systems: Certification, Trade & Multiplication", desc: "How NAK and the Dutch system became the global gold standard." },
                  { slug: "global-potato-trade", title: "Global Potato Trade Statistics", desc: "$22.8B trade — Netherlands at 60%+ of global certified-seed exports." },
                  { slug: "how-potatoes-are-processed", title: "How Potatoes Are Processed: Farm to Fry", desc: "Frozen fries, chips, starch — Aviko, Farm Frites, AVEBE in context." },
                  { slug: "top-potato-producing-countries", title: "Top Potato Producing Countries 2025", desc: "Netherlands #3 in EU; punches above its weight in trade." },
                ].map((a) => (
                  <Link key={a.slug} href={"/knowledge/" + a.slug} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "12px 16px", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>{a.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="pp-sources-block" style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "20px 22px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Sources</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>FAOSTAT 2022/2023</strong> — UN Food and Agriculture Organization production and trade data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Eurostat 2023</strong> — EU production and intra-EU trade statistics</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>NAK</strong> — Netherlands General Inspection Service for Agricultural Seeds and Seed Potatoes; Annual Report 2023</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>CBS Statistics Netherlands</strong> — provincial production data, table 7100eng</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>NIVAP / NVWA</strong> — phytosanitary export protocols (80+ countries)</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>HZPC, Agrico, Meijer, Europlant, Danespo, STET Holland</strong> — breeder catalogues and corporate documentation</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Solynta + WUR</strong> — hybrid breeding documentation; Ernst-Jan Eggers Sli-gene research (WUR Award 2022)</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Royal Cosun (Aviko), Farm Frites, Lamb Weston Meijer, AVEBE</strong> — corporate reports + cooperative filings</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Sugiura et al. (2016)</strong>, Precision Agriculture — drone-based late blight detection</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>NAO</strong> (Nederlandse Aardappel Organisatie) — sector market reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* S16 · Footer PDF */}
      {/* Inline document-end footer — guaranteed on mobile + Safari PDFs */}
      <div className="pp-print-footer-inline" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      <section className="pp-bottom-cta pp-no-print" style={{ background: "linear-gradient(180deg,#FFF8F8 0%,#FFFFFF 100%)", borderTop: "1px solid #f0f0f0", padding: "44px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Premium Export</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" }}>Download the Full Netherlands Industry Profile</h3>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 22px", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            All sections, all tables, all sources &mdash; formatted for A4 printing or sharing as a PDF report. Branded footer on every page (potatopedia.com &middot; hello@potatopedia.com &middot; linkedin.com/company/potatopedia).
          </p>
          <PdfDownloadButton size="lg" placement="footer" />
        </div>
      </section>
    </div>
  );
}

/* ── United States: full Country Intelligence Dossier (Tier 1) ── */

function UnitedStatesProfilePage({ c }) {
  const stats = [
    { value: "19.96 M t", label: "Annual Production", sub: "USDA NASS 2023 (440 M cwt)" },
    { value: "388,900 ha", label: "Harvested Area", sub: "961,100 acres" },
    { value: "51.4 t/ha", label: "Average Yield", sub: "458 cwt/acre — world's highest" },
    { value: "#5", label: "Global Production Rank", sub: "after CN, IN, UA, RU" },
    { value: "$5.0 B", label: "Farm-Gate Crop Value", sub: "USDA NASS 2023" },
    { value: "$2.3 B", label: "Total Export Value", sub: "Jul 2023–Jun 2024 record", positive: true },
    { value: "69–71%", label: "Processed Share of Crop", sub: "269 M cwt processed (2024)" },
    { value: "120 lbs", label: "Per-Capita Consumption", sub: "/ person / year" },
  ];

  const quickFacts = [
    "The Pacific Northwest (Idaho + Washington + Oregon) grows 62% of all US potatoes",
    "Idaho alone produces 32% of the US crop — 6.13 M tonnes from the Magic Valley + Snake River Plain",
    "US frozen French fry exports reached $1.5 B in 2023-24 — 1.5 M tonnes to 100+ countries",
    "Russet Burbank, selected by Luther Burbank in 1876, still occupies ~40% of US potato acreage",
    "Lamb Weston, Simplot, and McCain together control ~70% of the global frozen-fry market",
    "Washington achieves 659 cwt/acre yields (73.8 t/ha) — the highest state-level yield in the world",
    "The Tri-State breeding program (USDA-ARS + ID + OR + WA) has released 12+ russet varieties since 1991",
    "100% of Idaho's commercial potato crop is irrigated — Snake River + tributaries supply ~22 inches/season",
  ];

  const stateRows = [
    ["Idaho", "6.13", "135.2 M cwt", 32.0, "Magic Valley + Snake River Plain", "Russet Burbank, Ranger Russet, Umatilla"],
    ["Washington", "4.49", "98.9 M cwt", 22.5, "Columbia Basin", "Russet Burbank, Ranger, Umatilla, Alpine"],
    ["Wisconsin", "1.20", "26.4 M cwt", 6.0, "Central Sands", "Russet Burbank, Snowden, chip varieties"],
    ["Oregon", "1.19", "26.2 M cwt", 6.0, "Columbia Basin + Klamath", "Russet Burbank, Shepody, Umatilla"],
    ["North Dakota", "1.15", "25.3 M cwt", 5.7, "Red River Valley", "Russet Burbank, Norkotah, Red Norland"],
    ["Colorado", "1.00", "22.1 M cwt", 5.0, "San Luis Valley", "Norkotah selections, Centennial, Purple Majesty"],
    ["Michigan", "0.93", "20.4 M cwt", 4.6, "Central LP + Upper Peninsula", "Atlantic, Snowden, Lamoka (chip)"],
    ["Maine", "0.83", "18.3 M cwt", 4.2, "Aroostook County", "Russet Burbank, Atlantic, Lamoka, seed"],
    ["Minnesota", "0.81", "17.9 M cwt", 4.1, "Red River + Anoka Sand Plain", "Russet Burbank, Norkotah, Red Pontiac"],
    ["Nebraska", "0.40 (est.)", "8.8 M cwt", 2.0, "South Platte", "Russet Burbank, Norkotah"],
    ["Other (15+ states)", "1.83", "40.6 M cwt", 8.0, "Smaller commercial pockets", "Mixed: fresh + chip"],
  ];

  const varietyRows = [
    ["Russet Burbank", "1876 (Luther Burbank)", "Processing (fries, baked)", "ID, WA, OR, ME, WI", "~40%", "Heritage; long tubers; high SG; cold-sweetening sensitive"],
    ["Ranger Russet", "1991 (Tri-State)", "Processing (fries)", "Pacific Northwest", "~10%", "Higher yield + better defect resistance vs Burbank"],
    ["Russet Norkotah", "1987 (NDSU)", "Fresh market (table)", "CO, ND, TX, MN", "Significant", "Fresh-market #1; multiple line selections (TX A220, CO clones)"],
    ["Umatilla Russet", "1998 (Tri-State)", "Processing (fries)", "Pacific Northwest", "Significant", "Long tubers; superior storage characteristics"],
    ["Clearwater Russet", "2008 (Tri-State)", "Processing (fries)", "Pacific Northwest", "Growing", "Late blight + PVY resistance; cold sweetening tolerance"],
    ["Alpine Russet", "2008 (Tri-State)", "Processing (fries)", "Pacific Northwest", "Growing", "Cold sweetening resistance; long storage"],
    ["Galena Russet", "2018 (Tri-State)", "Processing (fries)", "Pacific Northwest", "New", "Newest Tri-State; enhanced disease resistance package"],
    ["Shepody", "1980 (Canada)", "Processing (early fries)", "ID, WA, ME", "Niche", "Early-season fry variety; long tubers"],
    ["Atlantic", "1976 (USDA)", "Chip processing", "ME, MI, WI, PA", "~7%", "Chip-industry standard; high SG; warm-climate tolerant"],
    ["Snowden", "1990 (UWisc)", "Chip processing", "WI, MI, ND", "Significant", "Cold-storage chip variety; very low reducing sugars"],
    ["Yukon Gold", "1980 (Canada)", "Fresh market (yellow)", "All-region", "Notable", "Defining yellow-flesh table potato in N America"],
    ["Kennebec", "1948 (USDA)", "Multi-purpose", "ME, NE, garden", "Niche", "Heritage variety; chip + fresh dual-use"],
    ["Red Pontiac", "1949 (USDA)", "Fresh (red-skin)", "ND, MN, ME, WI", "Notable", "Red-skin retail standard"],
    ["Red Norland", "1957 (NDSU)", "Fresh (early red)", "ND, MN, ME", "Significant", "Early-season red; popular farmers' market"],
  ];

  const processorRows = [
    ["Lamb Weston", "Eagle, Idaho (HQ)", "Frozen fries (world's #1 processor)", "Spun off from ConAgra 2016; 4 B+ kg capacity; publicly traded"],
    ["J.R. Simplot Company", "Boise, Idaho (HQ)", "Frozen fries + Innate® GM potato", "Built around Russet Burbank; 1965 McDonald's deal; private"],
    ["McCain Foods USA", "Idaho, Washington, Maine, Wisconsin (multi-plant)", "Frozen fries", "Canadian-owned; 40 global plants; 160+ country distribution"],
    ["ConAgra Foods", "Various", "Frozen + dehydrated", "Significant remaining processing capacity post-Lamb-Weston spin-off"],
    ["Frito-Lay (PepsiCo)", "Multi-state plants", "Potato chips (Lay's, Ruffles)", "#1 chip brand; uses Atlantic + chip varieties"],
    ["Utz Brands / Cape Cod / Kettle", "PA, MA, OR (kettle hubs)", "Premium kettle chips", "Specialty chip segment; growing volume"],
    ["Idahoan Foods", "Lewisville, Idaho", "Dehydrated mashed potatoes", "Largest US dehydrator; 40%+ retail dehydrated share"],
    ["Basic American Foods", "Various", "Dehydrated foodservice", "Foodservice channel leader"],
  ];

  const tradeRows = [
    ["Frozen French fries / processed", "Exports", "$1.5 B / 1.5 M tonnes", "Top markets: Japan, Mexico, South Korea", "64% of total US potato export value"],
    ["Fresh potatoes", "Exports", "$327.9 M / 611,461 tonnes", "Mexico, Canada, Japan", "14% of export value"],
    ["Dehydrated potatoes", "Exports", "$263.1 M", "Diversified global markets", "11% of export value"],
    ["Seed potatoes", "Exports", "Limited", "Selective programs", "Modest export volume"],
    ["TOTAL US potato exports", "Exports", "$2.3 B (Jul 2023–Jun 2024)", "+4.0% YoY (record high)", "NPC 2025 Yearbook"],
    ["Frozen-fry global rank", "—", "#4 globally by value", "Behind BE, NL, CA", "USDA FAS"],
  ];

  const consumptionRows = [
    ["Frozen products (mostly fries)", "36%", "World-leading frozen fry processing infrastructure"],
    ["Fresh market", "27%", "Down from ~50% in 1980s as processing share grew"],
    ["Potato chips", "23%", "Lay's, Ruffles, Pringles, kettle brands"],
    ["Dehydrated products", "8%", "Idahoan dominant; foodservice + retail mash"],
    ["Refrigerated products", "4%", "Pre-cooked / vacuum-packed"],
    ["Other (canning, starch, feed)", "2%", "Smaller segments"],
    ["TOTAL processed share", "71%", "Potatoes USA 2024 Utilization Report"],
  ];

  const challengeRows = [
    ["Water security (Snake River)", "Declining late-summer streamflows", "Bureau of Reclamation projections; 100% Idaho irrigation dependency"],
    ["Labor shortages", "Severe across planting + harvest + processing", "Rising H-2A visa reliance; energy / logistics cost pressure"],
    ["Late blight intensification", "2024 = worst European season on record", "New P. infestans strains evolving fungicide resistance"],
    ["Pale cyst nematode (PCN)", "Idaho 2006 quarantine ongoing", "Affects Japan/Korea/Mexico market access; APHIS field certification"],
    ["Dickeya / Pectobacterium blackleg", "Increasing pressure", "Seed-quality and storage-loss concerns"],
    ["Cold sweetening in storage", "Driver of new variety pipeline", "Tri-State varieties (Alpine, Clearwater, Galena) target this trait"],
    ["Climate adaptation", "Growing-season + drought variability", "Pushes precision irrigation + variety substitution"],
    ["Russet Burbank replacement transition", "70%+ Idaho acreage still Burbank", "Decade-scale variety substitution underway"],
  ];

  const seedSystemRows = [
    ["Idaho Crop Improvement Association", "Idaho", "Largest US seed certification program; >700K cwt seed annually"],
    ["Maine seed certification", "Maine", "Aroostook County seed industry; New England + East-Coast supply"],
    ["Wisconsin seed certification", "Wisconsin", "UW-Madison oversight; Central Sands seed area"],
    ["Minnesota seed certification", "Minnesota", "Red River Valley seed; supplies Midwest"],
    ["Colorado seed certification", "Colorado (San Luis Valley)", "High-altitude virus-free seed; specialty + Norkotah lines"],
    ["North Dakota seed certification", "North Dakota", "NDSU oversight; supplies Norkotah selections + reds"],
    ["National PVPO registry", "USDA-AMS", "Plant Variety Protection Office; legal IP framework"],
  ];

  const pageUrl = "https://www.potatopedia.com/country/united-states";
  const generatedDate = "April 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "United States Potato Industry Profile — World's #1 Yield + Frozen Fry Powerhouse",
        description: "Country profile of the United States' potato industry. 19.96 M tonnes on 388,900 ha at 51.4 t/ha (USDA NASS 2023) — world's highest yield. Idaho 32%, Washington 23%; Russet Burbank dominant; $2.3 B exports; Lamb Weston, Simplot, McCain.",
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
        publisher: { "@id": "https://www.potatopedia.com/#publisher" },
        mainEntityOfPage: pageUrl,
        image: "https://www.potatopedia.com/og-image.png",
        about: { "@type": "Country", name: "United States" },
        speakable: SPEAKABLE,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
          { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: "United States" } },
        ],
      },
      {
        "@type": "Dataset",
        name: "United States Potato Production by State 2023-24",
        description: "Production tonnage, percentage of national output, growing region, and dominant varieties for each US potato-producing state.",
        creator: { "@type": "Organization", name: "Potatopedia" },
        license: "https://www.potatopedia.com/about",
        keywords: ["United States", "potato", "production", "Idaho", "Washington", "USDA NASS", "Russet Burbank"],
        url: pageUrl,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Which US state produces the most potatoes?", acceptedAnswer: { "@type": "Answer", text: "Idaho leads at 135.2 million cwt (~6.13 M tonnes / 32% of US production), followed by Washington at 98.9 million cwt (~4.49 M t / 23%). The Pacific Northwest trio of Idaho + Washington + Oregon together produces 62% of all US potatoes (USDA NASS 2024; NPC 2025 Yearbook)." } },
          { "@type": "Question", name: "What is the average potato yield in the United States?", acceptedAnswer: { "@type": "Answer", text: "The US national average yield is 51.4 tonnes per hectare (458 cwt/acre) — the world's highest commercial potato yield (USDA NASS 2023). Washington alone achieves 659 cwt/acre (73.8 t/ha) — the highest state-level yield on Earth, driven by center-pivot irrigation, the Columbia Basin's solar radiation profile, and intensive precision-agriculture management." } },
          { "@type": "Question", name: "How much of the US potato crop is processed?", acceptedAnswer: { "@type": "Answer", text: "Roughly 69–71% of US potatoes are processed: 36% frozen (mostly French fries), 23% chips, 8% dehydrated, 4% refrigerated, 2% other. Fresh-market consumption accounts for the remaining 27% (Potatoes USA 2024 Utilization Report; USDA NASS Potatoes 2024 Summary). 269 million cwt of potatoes were processed in 2024." } },
          { "@type": "Question", name: "Why is Russet Burbank still the dominant US potato variety?", acceptedAnswer: { "@type": "Answer", text: "Russet Burbank has been dominant since J.R. Simplot's 1965 deal with McDonald's locked the entire US frozen-fry industry into its specifications: long tubers, high specific gravity, white flesh, low reducing sugars. Despite being 150 years old (selected by Luther Burbank in 1876), the variety still occupies ~40% of US potato acreage and 60–70% of Idaho's commercial acreage. New Tri-State varieties (Ranger Russet, Umatilla, Clearwater, Alpine, Galena) are progressively replacing it, but the transition is slow because of contract specifications and storage infrastructure." } },
          { "@type": "Question", name: "Who are the largest US potato processors?", acceptedAnswer: { "@type": "Answer", text: "The 'big three' are Lamb Weston (Eagle, Idaho HQ — world's #1 frozen potato processor, 4 B+ kg capacity, spun off from ConAgra in 2016), J.R. Simplot Company (Boise, Idaho — built around the original McDonald's contract), and McCain Foods USA (Canadian-owned, multi-plant operations in Idaho, Washington, Maine, Wisconsin). Together with ConAgra and Aviko, they control ~70% of global frozen French fry production (USDA FAS)." } },
          { "@type": "Question", name: "How much does the US export in potatoes?", acceptedAnswer: { "@type": "Answer", text: "The US set a record of $2.3 B in potato exports during July 2023 – June 2024, up 4.0% year-over-year (NPC 2025 Yearbook; US Department of Commerce Foreign Trade Division). Frozen French fries dominate at $1.5 B / 1.5 M tonnes (64% of export value), with Japan, Mexico, and South Korea as top destinations. Fresh exports total $327.9 M (611,461 tonnes), and dehydrated exports total $263.1 M." } },
        ],
      },
    ],
  };

  const sectionWrap = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
  const sectionTitle = { fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px", paddingLeft: 12, borderLeft: "4px solid #C62828", lineHeight: 1.2 };
  const tableTH = { padding: "10px 12px", textAlign: "left", background: "#C62828", color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 };
  const tableTD = { padding: "10px 12px", fontSize: 13.5, borderBottom: "1px solid #eee", color: "#333" };
  const proseP = { fontSize: 14.5, color: "#444", lineHeight: 1.7, margin: "0 0 12px" };
  const sourceLine = { fontSize: 12, color: "#999", fontStyle: "italic", margin: "4px 0 0" };

  return (
    <div className="pp-country-page pp-country-india" style={{ minHeight: "100vh", background: "#fff", overflowX: "hidden", fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{ppCSS}</style>
      <style>{printCSS}</style>
      <style>{`
        .pp-mobile-pdf-cta { display: none; }
        @media (max-width: 768px) {
          .pp-india-banner-row { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
          .pp-india-banner-pdf { display: none !important; }
          .pp-vital-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-quickfacts-grid { grid-template-columns: 1fr !important; }
          .pp-india-comparable-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pp-india-related-grid { grid-template-columns: 1fr !important; }
          .pp-mobile-pdf-cta { display: block !important; }
        }
        @media (max-width: 480px) {
          .pp-vital-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
        .pp-share-bar-track { position: relative; height: 6px; background: rgba(198,40,40,0.08); border-radius: 3px; min-width: 80px; margin-top: 4px; }
        .pp-share-bar-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg,#C62828,#E53935); border-radius: 3px; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pp-print-only pp-print-header">
        <div className="pp-print-header-row">
          <div className="pp-print-header-brand">POTATOPEDIA</div>
          <div className="pp-print-header-meta">
            <div>The World&apos;s Potato Intelligence Platform</div>
            <div>potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia</div>
            <div>Generated {generatedDate}</div>
          </div>
        </div>
      </div>

      <div className="pp-print-footer-fixed" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      {/* S1 · Executive Banner */}
      <section className="pp-india-banner" style={{ borderBottom: "2px solid #C62828", background: "linear-gradient(180deg,#FFF 0%,#FFF8F8 100%)" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ paddingTop: 24, paddingBottom: 8 }}>
            <Link href="/countries" className="pp-no-print" style={{ fontSize: 12, color: "#C62828", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>&larr; All Countries</Link>
          </div>
          <div className="pp-india-banner-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, paddingBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div className="pp-india-banner-flag" style={{ fontSize: 80, lineHeight: 1 }}>{c.flag}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#C62828", padding: "4px 10px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>#{c.rank} Global Producer</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>{c.region}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 4 }}>USDA NASS 2023</span>
                </div>
                <h1 style={{ fontSize: 44, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: -1.5, lineHeight: 1.1 }}>{c.name}</h1>
                <p className="pp-india-tagline" style={{ fontSize: 16, color: "#444", margin: "10px 0 0", lineHeight: 1.5, maxWidth: 600 }}>
                  World&apos;s <strong style={{ color: "#C62828" }}>highest potato yield at 51.4 t/ha</strong> &mdash; nearly 2.3&times; the global average. Idaho + Washington alone produce 55% of the US crop. Lamb Weston, Simplot, and McCain power a $5 B industry that exports $2.3 B / yr.
                </p>
              </div>
            </div>
            <div className="pp-india-banner-pdf"><PdfDownloadButton size="md" placement="banner" /></div>
          </div>
        </div>
      </section>

      {/* S2 · Vital Stats */}
      <section className="pp-vital-stats" style={{ background: "#0F1115", padding: "40px 0", color: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div data-summary="true" className="pp-vital-stats-summary" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #E53935", borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 28, fontSize: 14, lineHeight: 1.7, color: "#E5E5E5" }}>
            <strong style={{ color: "#fff" }}>The United States produced 19.96 million tonnes of potatoes in 2023</strong> on 388,900 hectares at <strong>51.4 t/ha &mdash; the world&apos;s highest commercial yield</strong> (USDA NASS; FAOSTAT). The crop generated <strong>$5.0 billion in farm-gate value</strong>; processors purchased <strong>269 million cwt (69% of the crop)</strong> in 2024. <strong>Idaho leads at 32%</strong> of national production (6.13 M t), followed by Washington at 23% (4.49 M t). Total potato exports reached a record <strong>$2.3 billion</strong> in July 2023 – June 2024 (+4% YoY), led by frozen French fries to Japan, Mexico, and South Korea. Russet Burbank, selected in 1876, still occupies ~40% of US acreage; Lamb Weston, Simplot, and McCain together control ~70% of the global frozen-fry market.
          </div>
          <div className="pp-vital-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {stats.map((s, i) => (
              <div key={i} className="pp-vital-stat-cell" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "18px 16px" }}>
                <div className="pp-vital-stat-value" style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5, lineHeight: 1.15, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                  {s.positive && <span className="pp-delta-up" style={{ display: "inline-block", marginLeft: 8, fontSize: 9, fontWeight: 700, color: "#4CAF50", background: "rgba(76,175,80,0.12)", padding: "2px 6px", borderRadius: 3, verticalAlign: "middle" }}>RECORD</span>}
                </div>
                <div className="pp-vital-stat-label" style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 1.2, marginTop: 8 }}>{s.label}</div>
                <div className="pp-vital-stat-sub" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-only PDF CTA */}
      <section className="pp-mobile-pdf-cta pp-no-print" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "20px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <PdfDownloadButton size="md" placement="banner" />
          <div style={{ fontSize: 11, color: "#888", marginTop: 8, fontWeight: 500 }}>A4-formatted report &middot; all sections, all tables</div>
        </div>
      </section>

      {/* S3 · Quick Facts */}
      <section className="pp-trajectory-band" style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "32px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, marginBottom: 16 }}>FAOSTAT 7-year production trajectory</h2>
          <TrajectoryTable slug={c.slug} />
        </div>
      </section>

      <section className="pp-quickfacts" data-pdf-break-after style={{ background: "#FAFAFA", borderBottom: "1px solid #f0f0f0", padding: "40px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Did you know?</h2>
          <div className="pp-quickfacts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {quickFacts.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "16px 18px", fontSize: 13.5, color: "#333", lineHeight: 1.55, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, color: "#C62828", fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>&#9642;</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S4 · Production by State */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Production by State</h2>
          <p style={proseP}>The Pacific Northwest dominates: Idaho + Washington + Oregon together produce <strong>62% of all US potatoes</strong>. Idaho alone delivers 32% (135.2 M cwt = 6.13 M tonnes) from the Magic Valley and Snake River Plain; Washington adds 23% (98.9 M cwt = 4.49 M t) from the Columbia Basin. Wisconsin, Oregon, North Dakota, Colorado, Michigan, Maine, and Minnesota round out the top tier. State-level yields range from <strong>Washington&apos;s world-leading 659 cwt/acre (73.8 t/ha)</strong> to ~300 cwt/acre in shorter-season states.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["State", "Production (M t)", "M cwt", "% of US", "Region", "Dominant Varieties"].map((h, idx) => <th key={h} style={{ ...tableTH, width: idx === 3 ? "16%" : undefined }}>{h}</th>)}</tr></thead>
              <tbody>
                {stateRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: i < 3 ? 700 : 500, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: i < 3 ? "#C62828" : "#1A1A1A", fontWeight: 600 }}>{r[1]}</td>
                    <td style={tableTD}>{r[2]}</td>
                    <td style={tableTD}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{r[3].toFixed(1)}%</span>
                        <div className="pp-share-bar-track">
                          <div className="pp-share-bar-fill" style={{ width: Math.min(100, r[3] * 3) + "%" }} />
                        </div>
                      </div>
                    </td>
                    <td style={tableTD}>{r[4]}</td>
                    <td style={{ ...tableTD, color: "#666", fontSize: 12.5 }}>{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: USDA NASS &ldquo;Potatoes 2024 Summary&rdquo;; NPC 2025 Yearbook; state-level cwt converted at 1 cwt = 45.36 kg.</p>
        </div>
      </section>

      {/* S5 · Russet Burbank story */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>The Russet Burbank Story</h2>
          <p style={proseP}>Selected by Luther Burbank in <strong>1876</strong> in Lunenburg, Massachusetts, Russet Burbank still occupies <strong>~40% of all US potato acreage</strong> and 60&ndash;70% of Idaho&apos;s commercial production 150 years later. The variety&apos;s commercial dominance is the result of a single 1965 supply-chain decision: J.R. Simplot&apos;s contract with Ray Kroc to supply McDonald&apos;s with frozen Russet Burbank fries. That deal locked the entire global fast-food industry into Russet Burbank&apos;s long cylindrical tuber shape, high specific gravity, white flesh, and low reducing sugars &mdash; the four properties that produce the iconic golden, crispy McDonald&apos;s fry.</p>
          <p style={proseP}>The variety is notoriously difficult to grow well: susceptible to scab, PVY, late blight, and Verticillium wilt; prone to internal defects (hollow heart, brown center, sugar ends) under stress; and requires precise irrigation + nitrogen management. The Tri-State Variety Development Program (USDA-ARS Aberdeen + University of Idaho + Oregon State + Washington State) was created specifically to breed superior alternatives &mdash; releasing Ranger Russet (1991), Umatilla Russet (1998), Clearwater Russet (2008), Alpine Russet (2008), and Galena Russet (2018). Adoption is slow because processor specifications + storage infrastructure are calibrated to Burbank&apos;s exact characteristics.</p>
          <p style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}><Link href="/knowledge/russet-burbank-history" className="pp-read-more-link" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Read the full Russet Burbank history &rarr;</Link> &middot; <Link href="/knowledge/mcdonalds-potato-varieties" className="pp-read-more-link" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>What Potatoes Does McDonald&apos;s Use? &rarr;</Link></p>
        </div>
      </section>

      {/* S6 · Variety Portfolio */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Variety Portfolio</h2>
          <p style={proseP}>US russet varieties together cover <strong>~70% of national acreage</strong> (USDA ERS 2024). The portfolio splits cleanly into processing russets (Burbank + Tri-State releases), fresh-market russets (Norkotah and selections), chip varieties (Atlantic, Snowden, Lamoka), heritage table varieties (Yukon Gold, Kennebec, Red Pontiac), and early reds (Norland). The Tri-State program has driven the modern russet pipeline since 1991.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table data-print-wide style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr>{["Variety", "Year / Breeder", "Type", "Key States", "Acreage Share", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {varietyRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600, color: "#1A1A1A" }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: r[2].includes("Processing") || r[2].includes("Chip") ? "#C62828" : "#1A1A1A", fontWeight: 500 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                    <td style={tableTD}>{r[4]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: USDA ERS variety acreage shares 2024; USDA-ARS Tri-State release documentation; NDSU + USDA breeder records.</p>
        </div>
      </section>

      {/* S7 · Pacific Northwest Growing */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Pacific Northwest Growing &amp; Yield Story</h2>
          <p style={proseP}>The US holds the <strong>world&apos;s highest commercial potato yield at 51.4 t/ha</strong> &mdash; more than 2.3&times; the global average of 22.8 t/ha. Washington State exceeds even the national figure at <strong>659 cwt/acre (73.8 t/ha)</strong>, making it the highest-yielding potato region anywhere on Earth. The yield advantage is the product of four reinforcing factors:</p>
          <p style={proseP}>&bull; <strong>Center-pivot irrigation:</strong> 100% of Idaho&apos;s commercial potato crop is irrigated. The Snake River and tributaries deliver ~22 inches of supplemental water per growing season &mdash; the natural Snake River Plain rainfall is only 8&ndash;12 inches/year, far below the 20&ndash;25 inches potato needs.<br />
          &bull; <strong>Long growing season:</strong> Pacific Northwest plantings run mid-April through October &mdash; ~140 frost-free days, with extended daylight hours during tuber bulking that maximises photosynthate accumulation.<br />
          &bull; <strong>Solar radiation profile:</strong> the Columbia Basin and Magic Valley receive among the highest summer solar radiation of any potato-growing region, supporting heavy tuber bulking.<br />
          &bull; <strong>Precision agriculture:</strong> GPS-guided planting, variable-rate nitrogen, soil-moisture sensors, and real-time yield monitoring are universal at commercial scale.</p>
          <p style={proseP}><strong>Major regions:</strong> Idaho&apos;s Magic Valley (south-central, Snake River Plain), Washington&apos;s Columbia Basin (Franklin / Adams / Grant / Benton counties), Oregon&apos;s Columbia Basin + Klamath Basin, Wisconsin&apos;s Central Sands, North Dakota&apos;s Red River Valley, Colorado&apos;s San Luis Valley (high-altitude seed production), Maine&apos;s Aroostook County (heritage potato region).</p>
          <p style={sourceLine}>Source: USDA NASS 2024; University of Idaho Extension; Washington State Potato Commission; Bureau of Reclamation Snake River data.</p>
        </div>
      </section>

      {/* S8 · Processing Industry */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Processing Industry &amp; Major Players</h2>
          <p style={proseP}><strong>69&ndash;71% of US potatoes are processed</strong>, the highest processing share of any major producer (vs. <Link href="/country/india" style={{ color: "#C62828", textDecoration: "none" }}>India</Link>&apos;s 7&ndash;8% and <Link href="/country/china" style={{ color: "#C62828", textDecoration: "none" }}>China</Link>&apos;s 15%). In 2024, processors purchased <strong>269 million cwt</strong> &mdash; roughly 12.2 million tonnes &mdash; with the bulk going to frozen French fries (36% of total US potato production), chips (23%), dehydrated products (8%), and refrigerated convenience products (4%) (Potatoes USA 2024 Utilization Report; USDA NASS).</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Company", "Headquarters", "Activity", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {processorRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: USDA NASS Potatoes 2024 Summary; NPC 2025 Yearbook; company filings (Lamb Weston, Simplot, McCain Foods); USDA FAS global market reports.</p>
          <p style={{ ...proseP, marginTop: 16, fontSize: 13.5 }}><Link href="/knowledge/how-potatoes-are-processed" className="pp-read-more-link" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Read more: How Potatoes Are Processed &rarr;</Link></p>
        </div>
      </section>

      {/* S9 · Trade Profile */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Trade Profile</h2>
          <p style={proseP}>The US set an <strong>all-time record of $2.3 billion in potato exports</strong> in the July 2023 &ndash; June 2024 period (NPC 2025 Yearbook), up 4.0% year-over-year. Frozen French fries dominate the mix at $1.5 B / 1.5 M tonnes &mdash; 64% of total export value &mdash; with Japan, Mexico, and South Korea as the top three destinations. Despite this volume, the US ranks <strong>#4 globally in frozen-fry exports by value</strong> (behind <Link href="/country/belgium" style={{ color: "#C62828", textDecoration: "none" }}>Belgium</Link>, <Link href="/country/netherlands" style={{ color: "#C62828", textDecoration: "none" }}>Netherlands</Link>, and <Link href="/country/canada" style={{ color: "#C62828", textDecoration: "none" }}>Canada</Link>) per USDA FAS.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", background: "#fff" }}>
              <thead><tr>{["Category", "Direction", "Value / Volume", "Top Markets", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {tradeRows.map((r, i) => (
                  <tr key={r[0] + i} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[2]}</td>
                    <td style={tableTD}>{r[3]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: U.S. Department of Commerce Foreign Trade Division; NPC 2025 Yearbook; USDA FAS Global Agricultural Trade System.</p>
        </div>
      </section>

      {/* S10 · Consumption */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Consumption &amp; American Cuisine</h2>
          <p style={proseP}>Americans consume approximately <strong>120 lbs (54 kg) of potatoes per person per year</strong> &mdash; comparable to <Link href="/country/canada" style={{ color: "#C62828", textDecoration: "none" }}>Canada</Link> (55 kg) but well below <Link href="/country/belgium" style={{ color: "#C62828", textDecoration: "none" }}>Belgium</Link> (80 kg) or the <Link href="/country/united-kingdom" style={{ color: "#C62828", textDecoration: "none" }}>UK</Link> (84 kg). What sets US consumption apart is the form: <strong>71% of US potatoes are processed</strong> &mdash; the highest processing share of any major producer. The fast-food fry industry plus retail frozen-product growth has progressively replaced fresh-potato cooking at home.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Use Category", "Share of US Crop", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {consumptionRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Potatoes USA 2024 Utilization Report; USDA Economic Research Service.</p>
          <p style={proseP}><strong>Cultural identity dishes:</strong> the McDonald&apos;s fry (the global standard since 1965), the Idaho baked potato (Russet Burbank with sour cream + chives), hash browns, scalloped potatoes, mashed potatoes (especially Thanksgiving), tater tots, Wisconsin/Pennsylvania-style potato salad, and chip culture (Lay&apos;s Wavy, Ruffles, Pringles). McDonald&apos;s alone consumes an estimated 3.4 billion lbs of potatoes annually &mdash; roughly 9% of the entire US potato crop.</p>
        </div>
      </section>

      {/* S11 · Tri-State Breeding Program */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>The Tri-State Breeding Program</h2>
          <p style={proseP}>The <strong>Tri-State Potato Variety Development Program</strong> &mdash; a research collaboration among <strong>USDA-ARS Aberdeen (Idaho)</strong>, the <strong>University of Idaho</strong>, <strong>Oregon State University</strong>, and <strong>Washington State University</strong> &mdash; has been the primary engine of US russet variety improvement since the 1980s. Each Tri-State release goes through 10&ndash;12 years of multi-state field trials before commercial release.</p>
          <p style={proseP}>The breeding pipeline targets four priority traits: <strong>processing quality</strong> (high specific gravity, excellent fry color, low reducing sugars, low internal defects), <strong>disease resistance</strong> (late blight, Verticillium wilt, PVY, golden nematode, corky ringspot, common scab), <strong>agronomic performance</strong> (yield, water-use efficiency, heat tolerance), and <strong>storage characteristics</strong> &mdash; especially <strong>cold sweetening resistance</strong>, the trait that has driven nearly every recent release. Cold-sweetening resistance lets processors store potatoes at lower temperatures (slowing sprouting, extending storage life, reducing CIPC chemical use) without losing fry color.</p>
          <p style={proseP}>Major releases: Ranger Russet (1991), Umatilla Russet (1998), Western Russet (2004), Blazer Russet (2005), Premier Russet (2006), Gem Russet (2002), Alpine Russet (2008), Classic Russet (2008), Clearwater Russet (2008), Teton Russet (2011), Mountain Gem Russet (2013), Payette Russet (2015), Galena Russet (2018) &mdash; <strong>twelve major commercial releases over three decades</strong>. The Western Regional Russet Variety Trial Reports (annual, USDA-ARS) document each release&apos;s performance against Russet Burbank.</p>
          <p style={sourceLine}>Source: USDA-ARS Small Grains and Potato Germplasm Research Unit (Aberdeen, Idaho); University of Idaho Extension; Tri-State release documentation; Western Regional Russet Variety Trial Reports.</p>
        </div>
      </section>

      {/* S12 · Seed System */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Seed Certification System</h2>
          <p style={proseP}>The US operates a <strong>state-level seed certification system</strong> rather than a single federal authority. Each major seed-producing state runs its own certification agency &mdash; collectively delivering near-100% certified seed usage in commercial potato production, in stark contrast to <Link href="/country/india" style={{ color: "#C62828", textDecoration: "none" }}>India</Link>&apos;s 15%. The seed pipeline runs Generation 0 (G0, in-vitro tissue culture mini-tubers) through G5 (final certified seed sold to commercial growers).</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Certification Agency", "State", "Notes"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {seedSystemRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={tableTD}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#666" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Idaho Crop Improvement Association; state seed certification programs; USDA-AMS Plant Variety Protection Office.</p>
        </div>
      </section>

      {/* S13 · Industry Challenges */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={sectionTitle}>Industry Challenges</h2>
          <p style={proseP}>Despite world-leading yields and trade share, the US potato sector faces systemic pressures across water security, labor, disease, and the slow Burbank-replacement transition.</p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead><tr>{["Challenge", "Magnitude", "Driver / Note"].map((h) => <th key={h} style={tableTH}>{h}</th>)}</tr></thead>
              <tbody>
                {challengeRows.map((r, i) => (
                  <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...tableTD, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...tableTD, color: "#C62828", fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ ...tableTD, fontSize: 12.5, color: "#444" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={sourceLine}>Source: Bureau of Reclamation Snake River projections; USDA APHIS pale cyst nematode quarantine documentation; Tri-State variety trial reports; CPRI / USDA late blight surveillance.</p>
        </div>
      </section>

      {/* S14 · AI Explorer */}
      <section id="ai-explorer" className="pp-ai-explorer-band pp-no-print" style={{ background: "linear-gradient(135deg,#0F1115 0%,#1A1F26 100%)", color: "#fff", padding: "52px 0 36px" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E53935", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Potatopedia AI &middot; United States</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: -1, lineHeight: 1.2 }}>Ask Anything About the US Potato Industry</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0", lineHeight: 1.6 }}>
              Get data-backed answers from our 5,024-chunk knowledge base &mdash; pre-filtered for the United States.
            </p>
          </div>
        </div>
      </section>
      <section className="pp-ai-explorer-light pp-no-print" style={{ background: "#fff", borderTop: "0", borderBottom: "1px solid #f0f0f0" }}>
        <CountryAI countryName="United States" countrySlug="united-states" />
      </section>

      {/* S15 · Comparable Countries */}
      <CountryVarieties countrySlug={c.slug} countryName={c.name} />

      <CountryBlogPosts countrySlug={c.slug} />

      <section className="pp-comparable-countries pp-no-print" style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", padding: "48px 0" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <h2 style={{ ...sectionTitle, textAlign: "left" }}>Compare with Global Peers</h2>
          <div className="pp-india-comparable-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 8 }}>
            {COUNTRIES.filter((x) => ["canada", "china", "india", "netherlands", "belgium", "germany", "france", "russia"].includes(x.slug)).slice(0, 4).map((x) => (
              <Link key={x.slug} href={"/country/" + x.slug} style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center", border: "1px solid #ececec", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{x.flag}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{x.name}</div>
                <div style={{ fontSize: 22, color: "#C62828", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{x.prod}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>#{x.rank} Global &middot; {x.yield}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* S16 · Related & Sources */}
      <section style={{ padding: "48px 0", background: "#fff" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }} className="pp-india-related-grid">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Related Knowledge</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { slug: "russet-burbank-history", title: "Russet Burbank: 140 Years of Dominance", desc: "Luther Burbank's 1876 selection that anchors the global frozen fry industry." },
                  { slug: "mcdonalds-potato-varieties", title: "What Potatoes Does McDonald's Use?", desc: "The Russet Burbank story behind the 1965 J.R. Simplot deal." },
                  { slug: "how-potatoes-are-processed", title: "How Potatoes Are Processed: Farm to Fry", desc: "Frozen fries, chips, dehydrated — Lamb Weston, Simplot, McCain." },
                  { slug: "potato-yield-calculator", title: "Potato Yield Per Acre — Global Averages", desc: "USA at 458 cwt/acre — world's highest commercial potato yield." },
                  { slug: "top-potato-producing-countries", title: "Top Potato Producing Countries 2025", desc: "FAOSTAT rankings: USA #5 by production, #1 by yield." },
                  { slug: "global-potato-trade", title: "Global Potato Trade Statistics", desc: "$22.8B trade — USA at $2.3B record exports (frozen-fry-led)." },
                ].map((a) => (
                  <Link key={a.slug} href={"/knowledge/" + a.slug} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 10, padding: "12px 16px", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>{a.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="pp-sources-block" style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "20px 22px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Sources</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>USDA NASS</strong> &mdash; Potatoes 2024 Summary; state-level production and farm-gate value</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>USDA ERS</strong> &mdash; variety acreage shares (Charts of Note); processing utilization data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>USDA-ARS</strong> &mdash; Small Grains and Potato Germplasm Research Unit (Aberdeen ID); Tri-State variety release documentation</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>USDA FAS</strong> &mdash; Global Agricultural Trade System; export rankings</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>USDA APHIS</strong> &mdash; pale cyst nematode quarantine; phytosanitary export protocols</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>NPC 2025 Yearbook</strong> &mdash; National Potato Council; export records and industry statistics</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Potatoes USA 2024 Utilization Report</strong> &mdash; consumption category breakdown</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>University of Idaho Extension</strong> &mdash; CIS / BUL series variety bulletins; agronomic protocols</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Washington State Potato Commission + WSU</strong> &mdash; state-level yield and production data</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Bureau of Reclamation</strong> &mdash; Snake River streamflow projections; water-supply outlook</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>U.S. Department of Commerce Foreign Trade Division</strong> &mdash; export value by category</li>
                <li style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}><strong>Lamb Weston, J.R. Simplot Company, McCain Foods, ConAgra</strong> &mdash; corporate filings + sustainability reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Inline document-end footer — guaranteed on mobile + Safari PDFs */}
      <div className="pp-print-footer-inline" style={{ display: "none" }}>
        potatopedia.com &nbsp;·&nbsp; hello@potatopedia.com &nbsp;·&nbsp; linkedin.com/company/potatopedia
      </div>

      {/* S17 · Footer PDF */}
      <section className="pp-bottom-cta pp-no-print" style={{ background: "linear-gradient(180deg,#FFF8F8 0%,#FFFFFF 100%)", borderTop: "1px solid #f0f0f0", padding: "44px 0", textAlign: "center" }}>
        <div style={sectionWrap} className="pp-section-wrap">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Premium Export</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" }}>Download the Full United States Industry Profile</h3>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 22px", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            All sections, all tables, all sources &mdash; formatted for A4 printing or sharing as a PDF report. Branded footer on every page (potatopedia.com &middot; hello@potatopedia.com &middot; linkedin.com/company/potatopedia).
          </p>
          <PdfDownloadButton size="lg" placement="footer" />
        </div>
      </section>
    </div>
  );
}

/* ── Kenya: Premium Country Profile (Host of WPC 2026) ── */

function KenyaProfilePage({ c }) {
  const sectionWrap = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
  const sH2 = { fontSize: 22, fontWeight: 700, paddingLeft: 16, borderLeft: "4px solid #C62828", marginTop: 0, marginBottom: 14, color: "#1A1A1A" };
  const sP = { fontSize: 14.5, color: "#444", lineHeight: 1.75, margin: "0 0 14px" };
  const sIntro = { fontSize: 16, color: "#1A1A1A", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 500 };
  const sTh = { padding: "10px 12px", textAlign: "left", background: "#C62828", color: "#fff", fontSize: 13, fontWeight: 700 };
  const sTd = { padding: "9px 12px", fontSize: 14, borderBottom: "1px solid #eee" };
  const sSource = { fontSize: 12, color: "#999", marginTop: 8, marginBottom: 0, fontStyle: "italic" };
  const cardWrap = { background: "#fff", border: "1px solid #ececec", borderRadius: 14, padding: "26px 28px 22px", marginBottom: 18 };
  const linkRed = { color: "#C62828", textDecoration: "none", fontWeight: 600 };
  const linkPlain = { color: "#C62828", textDecoration: "none" };
  const qfBox = { background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "14px 18px", marginBottom: 16 };
  const qfTitle = { fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 };

  const QuickFacts = ({ items }) => (
    <div data-quick-facts="true" style={qfBox}>
      <div style={qfTitle}>Quick Facts</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 18px", fontSize: 13, color: "#333" }}>
        {items.map((it, i) => <li key={i} style={{ lineHeight: 1.5 }}><strong style={{ color: "#1A1A1A" }}>{it.label}:</strong> {it.value}</li>)}
      </ul>
    </div>
  );

  const StatCallout = ({ number, unit, context, source }) => (
    <>
      <style>{`.pp-ke-cb{display:flex;gap:18px;align-items:flex-start;margin:22px 0}.pp-ke-cbm{display:none}@media(max-width:640px){.pp-ke-cb{display:none!important}.pp-ke-cbm{display:block!important;margin:22px 0;border-left:4px solid #C62828;border-radius:0 10px 10px 0;background:#F7F7F7;padding:16px 18px}}`}</style>
      <div className="pp-ke-cb">
        <div style={{ background: "#C62828", borderRadius: 12, padding: "18px 22px", minWidth: 110, textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{number}</div>
          {unit && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4, textTransform: "uppercase" }}>{unit}</div>}
        </div>
        <div style={{ padding: "6px 0", flex: 1 }}>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>{context}</div>
          {source && <div style={{ fontSize: 11, color: "#aaa", marginTop: 6, fontStyle: "italic" }}>{source}</div>}
        </div>
      </div>
      <div className="pp-ke-cbm">
        <div style={{ marginBottom: 6 }}><span style={{ fontSize: 22, fontWeight: 800, color: "#C62828" }}>{number}</span>{unit && <span style={{ fontSize: 13, fontWeight: 600, color: "#C62828", marginLeft: 4 }}>{unit}</span>}</div>
        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>{context}</div>
        {source && <div style={{ fontSize: 11, color: "#aaa", marginTop: 6, fontStyle: "italic" }}>{source}</div>}
      </div>
    </>
  );

  const counties = [
    ["Nyandarua", "Central Highlands", "~35% (Kenya's potato basket)", "Ol Kalou, Kinangop, Aberdare slopes", "Shangi, Kenya Mpya"],
    ["Nakuru", "Rift Valley", "Major", "Molo, Njoro, Elburgon", "Shangi, Tigoni"],
    ["Meru", "Eastern (Mt Kenya slopes)", "Major", "Imenti, Buuri", "Shangi, Asante"],
    ["Bomet", "South Rift Valley", "Significant", "Bomet Central, Sotik", "Shangi"],
    ["Bungoma", "Western", "Significant", "Mt Elgon foothills", "Shangi, Kenya Mpya"],
    ["Elgeyo-Marakwet", "Rift Valley", "Significant", "Keiyo, Marakwet escarpment", "Shangi"],
    ["Narok", "Rift Valley", "Emerging", "Mau highland fringe", "Shangi"],
    ["Trans-Nzoia", "Rift Valley", "Emerging", "Cherangany Hills", "Shangi, Kenya Mpya"],
  ];

  const varieties = [
    ["Shangi", "~2010 (informal); KEPHIS retroactive", "50–70% area share", "Table + informal chip-frying", "90–110"],
    ["Kenya Mpya", "KALRO 2010", "Growing share", "Table + processing", "90–120"],
    ["Tigoni", "KALRO (named for KALRO research centre)", "Established", "Table", "100–120"],
    ["Asante", "KALRO–CIP", "Established", "Table + processing", "100–120"],
    ["Kenya Sherekea", "KALRO", "Niche; bacterial wilt resistance", "Table", "100–120"],
    ["Kenya Karibu", "KALRO–CIP", "Niche", "Table", "100–120"],
    ["Dutch Robijn", "Imported (Netherlands origin)", "Legacy / declining", "Table (red-skinned)", "110–130"],
  ];

  const faqItems = [
    { q: "How much potato does Kenya produce per year?", a: "Kenya produces approximately 2.31 million tonnes of potatoes annually from 239,325 hectares (FAOSTAT 2024), with a yield of 9.65 t/ha — well below the 30–40 t/ha potential under optimal management. Production has fluctuated through the past decade as harvested area expanded from a 2014 low of 115,604 ha. Kenya is East Africa's largest potato producer and Africa's #2 after Egypt." },
    { q: "Which county is the largest potato producer in Kenya?", a: "Nyandarua County dominates Kenya's potato production with approximately 35% of national output, earning it the nickname \"potato basket\" (County Government of Nyandarua CIDP 2023-2027; KEPHIS 2023). The county centres on Ol Kalou and encompasses the Kinangop plateau and Aberdare mountain slopes, where deep volcanic soils and reliable bimodal rainfall create ideal growing conditions. Nakuru, Meru, Bomet, and Bungoma round out the top counties." },
    { q: "What is the most popular potato variety in Kenya?", a: "Shangi is the dominant potato variety in Kenya, accounting for 50–70% of all potatoes grown in the country. The early-maturing variety (90–110 days) originated as an informal CIP-related introduction that spread through farmer-to-farmer seed exchange before being retroactively recognized by KEPHIS. Farmers favor Shangi for its short dormancy enabling year-round planting and strong urban-market acceptance for fresh consumption and chip-frying." },
    { q: "Why is Kenya's potato yield so low?", a: "Kenya's 9.65 t/ha state-average yield (FAOSTAT 2024) reflects a severe seed crisis — 95–98% of seed planted is informal (farmer-saved or market-obtained), frequently carrying bacterial wilt, PVY, and PLRV that progressively reduce yields over generations (NPCK 2023). Only 2–5% of seed is formally certified, creating a gap of 100,000+ tonnes per year between formal supply and farmer demand. Under optimal management, Kenya's potato can deliver 30–40 t/ha." },
    { q: "When is the World Potato Congress 2026 in Kenya?", a: "The 13th World Potato Congress runs October 26–30, 2026 in Naivasha, Kenya at Sawela Lodges on Lake Naivasha. The event is hosted jointly by the National Potato Council of Kenya (NPCK) and FreshCrop Limited under the theme \"Global Potato Partnership for Enhanced Food Systems, Nutrition Security and Trade.\" Wachira Kaguongo (NPCK CEO) is Congress Chair; Chris Gasperi (FreshCrop) is Vice-Chair. Over 1,000 delegates from 60+ countries are expected — the first time WPC has been hosted in East Africa." },
    { q: "What is Shangi potato?", a: "Shangi is Kenya's dominant potato variety (50–70% of cultivated area) — an early-maturing 90–110 day variety with origins in informal CIP-related introductions. It was retroactively recognized by KEPHIS rather than going through standard formal release. Shangi's short dormancy enables year-round planting and matches both fresh-market and informal chip-frying demand, but its dominance creates a near-monoculture vulnerability to bacterial wilt and aphid-vectored viruses." },
    { q: "Where is Kenya's potato basket?", a: "Kenya's \"potato basket\" is Nyandarua County in the Central Highlands, contributing approximately 35% of national potato output. The county centres on Ol Kalou and runs across the Kinangop plateau and the eastern Aberdare mountain slopes. Deep volcanic soils, 1,800–3,000 m elevation, bimodal rainfall of 1,200–1,800 mm, and the cool 18–24°C daytime / 8–14°C nighttime range make it among Africa's most agroclimatically suitable potato regions." },
    { q: "Is Kenya self-sufficient in seed potatoes?", a: "No. Only 2–5% of seed planted in Kenya is formally certified through KEPHIS, with the remaining 95–98% sourced informally from farmer-saved seed, local markets, or neighbour exchanges (NPCK 2023). This creates a structural gap of over 100,000 tonnes per year between formal seed supply and farmer demand. KALRO Tigoni Research Centre and CIP partnership programmes are scaling up aeroponic minituber multiplication to address the gap, but adoption pace remains the binding constraint on national yield improvement." },
  ];

  const pageUrl = "https://www.potatopedia.com/country/kenya";
  const wpcEvent = {
    "@type": "Event",
    name: "13th World Potato Congress 2026",
    startDate: "2026-10-26",
    endDate: "2026-10-30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: "Sawela Lodges, Lake Naivasha", address: { "@type": "PostalAddress", addressLocality: "Naivasha", addressCountry: "KE" } },
    organizer: [
      { "@type": "Organization", name: "National Potato Council of Kenya (NPCK)" },
      { "@type": "Organization", name: "FreshCrop Limited" },
    ],
    url: "https://wpc2026kenya.com",
    description: "Theme: Global Potato Partnership for Enhanced Food Systems, Nutrition Security and Trade. 1,000+ delegates from 60+ countries.",
  };
  const jsonLdGraph = [
    {
      "@type": "Article",
      "@id": pageUrl + "#article",
      headline: "Kenya Potato Industry: East Africa's Largest Producer & Host of World Potato Congress 2026",
      description: "Kenya produces 2.31M tonnes of potatoes — Africa's #2 after Egypt. Nyandarua leads at ~35% state share. Hosts WPC 13 in Naivasha, October 26–30, 2026.",
      datePublished: "2026-05-08",
      dateModified: "2026-05-08",
      author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
      publisher: { "@id": "https://www.potatopedia.com/#publisher" },
      mainEntityOfPage: pageUrl,
      image: "https://www.potatopedia.com/og-image.png",
      about: { "@type": "Country", name: "Kenya", sameAs: "https://www.wikidata.org/wiki/Q114" },
      speakable: SPEAKABLE,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
        { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
        { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: "Kenya" } },
      ],
    },
    {
      "@type": ["Place", "Country"],
      name: "Kenya",
      sameAs: "https://www.wikidata.org/wiki/Q114",
      url: pageUrl,
    },
    POTATOPEDIA_PUBLISHER,
    wpcEvent,
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLdGraph }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />

      {/* HERO with WPC 2026 callout */}
      <style>{`
        .pp-ke-hero { padding: 56px 24px 40px; background: #FAFAFA; position: relative; overflow: hidden; border-bottom: 1px solid #f0f0f0; background-image: repeating-linear-gradient(0deg, rgba(198,40,40,0.04) 0, rgba(198,40,40,0.04) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(198,40,40,0.04) 0, rgba(198,40,40,0.04) 1px, transparent 1px, transparent 60px); }
        .pp-ke-wpc-banner { background: linear-gradient(135deg, #C62828, #8E0000); color: #fff; border-radius: 14px; padding: 18px 22px; margin-top: 20px; display: flex; gap: 16px; align-items: center; box-shadow: 0 8px 24px rgba(198,40,40,0.18); }
        .pp-ke-wpc-banner .pp-ke-wpc-badge { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 8px 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.6; flex-shrink: 0; }
        .pp-ke-wpc-banner .pp-ke-wpc-text { flex: 1; line-height: 1.4; }
        .pp-ke-wpc-banner .pp-ke-wpc-cta { background: #fff; color: #C62828; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 800; text-decoration: none; flex-shrink: 0; white-space: nowrap; }
        @media (max-width: 768px) { .pp-ke-hero { padding: 40px 20px 32px; } .pp-ke-wpc-banner { flex-direction: column; align-items: flex-start; text-align: left; } }
      `}</style>
      <section className="pp-ke-hero">
        <div style={{ position: "absolute", top: 16, right: 24, width: 200, height: 2, background: "linear-gradient(135deg,#C62828,transparent)", borderRadius: 1, zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#ccc" }}>/</span>
            <Link href="/countries" style={{ color: "#888", textDecoration: "none" }}>Countries</Link>
            <span style={{ color: "#ccc" }}>/</span>
            <span style={{ color: "#C62828", fontWeight: 700 }}>Kenya {c.flag}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, background: "rgba(198,40,40,0.06)", padding: "4px 12px", borderRadius: 10 }}>Kenya · Africa &amp; Middle East</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>14 min read</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.18, margin: "0 0 12px", maxWidth: 920 }}>
            Kenya Potato Industry: East Africa&apos;s Largest Producer &amp; Host of World Potato Congress 2026
          </h1>

          <div className="pp-ke-wpc-banner">
            <div className="pp-ke-wpc-badge">Host Country 2026</div>
            <div className="pp-ke-wpc-text">
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 2 }}>13th World Potato Congress · Naivasha, Kenya</div>
              <div style={{ fontSize: 13, opacity: 0.95 }}>October 26–30, 2026 · Sawela Lodges on Lake Naivasha · 1,000+ delegates from 60+ countries · First time WPC has been hosted in East Africa.</div>
            </div>
            <a href="#wpc-2026" className="pp-ke-wpc-cta">Read about WPC 2026 →</a>
          </div>
        </div>
      </section>

      <div style={sectionWrap}>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 0 80px" }}>

          {/* Quick Facts top of page */}
          <QuickFacts items={[
            { label: "Rank", value: "#1 East Africa, #2 Africa (after Egypt)" },
            { label: "Production", value: "2.31M tonnes (FAOSTAT 2024)" },
            { label: "Top county", value: "Nyandarua (~35% of national output)" },
            { label: "Top variety", value: "Shangi (50–70% of area)" },
            { label: "Average yield", value: "9.65 t/ha (potential 30–40 t/ha)" },
            { label: "WPC 2026 host", value: "Naivasha · Oct 26–30, 2026" },
          ]} />

          {/* Definitive Answer */}
          <div data-summary="true" style={{ background: "rgba(198,40,40,0.03)", border: "1px solid rgba(198,40,40,0.12)", borderLeft: "4px solid #C62828", borderRadius: "0 12px 12px 0", padding: "22px 28px", marginBottom: 22, fontSize: 16, color: "#333", lineHeight: 1.75 }}>
            <p style={{ margin: 0 }}>
              <strong>Kenya is East Africa&apos;s largest potato producer and Africa&apos;s #2 producer overall, with 2.31 million tonnes from 239,325 hectares (FAOSTAT 2024).</strong> Nyandarua County alone delivers ~35% of national output, anchoring Kenya&apos;s &quot;potato basket&quot; on the Aberdare slopes and Kinangop plateau. The Shangi variety dominates 50–70% of cultivated area. State-average yield of 9.65 t/ha is well below the country&apos;s 30–40 t/ha potential — driven by a severe seed crisis where only 2–5% of seed planted is formally certified. Naivasha hosts the 13th World Potato Congress in October 2026.
            </p>
          </div>

          {/* Key Stat Strip */}
          <style>{`.pp-ke-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;background:#1A1A1A;border-radius:12px;padding:26px 22px;margin-bottom:24px}@media(max-width:768px){.pp-ke-stats{grid-template-columns:repeat(2,1fr)!important;gap:18px!important;padding:22px 18px!important}}@media(max-width:400px){.pp-ke-stats{grid-template-columns:1fr!important}}`}</style>
          <div className="pp-ke-stats">
            {[
              { v: "2.31M t", l: "Annual production" },
              { v: "#2", l: "in Africa (after Egypt)" },
              { v: "~35%", l: "Nyandarua share" },
              { v: "Oct 26–30", l: "WPC 13 · 2026", a: "#FFB300" },
            ].map((s, i, arr) => (
              <div key={i} style={{ textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none", padding: "0 10px" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.a || "#fff", letterSpacing: -1, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginTop: 8, textTransform: "uppercase", letterSpacing: 1.3 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* TOC */}
          <details style={{ background: "#FAFAFA", border: "1px solid #eee", borderRadius: 10, padding: "12px 18px", marginBottom: 28 }}>
            <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, fontWeight: 600, color: "#555" }}>
              <span>In this article (11 sections)</span><span style={{ fontSize: 10, color: "#bbb" }}>▾</span>
            </summary>
            <nav style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { id: "industry-size", l: "How big is Kenya's potato industry?" },
                { id: "counties", l: "Which counties produce the most potatoes in Kenya?" },
                { id: "nyandarua", l: "Why is Nyandarua the largest potato producer in Kenya?" },
                { id: "varieties", l: "What varieties of potato are grown in Kenya?" },
                { id: "seed-system", l: "How does Kenya's seed potato system work?" },
                { id: "markets", l: "What are the major potato markets, processors, and prices in Kenya?" },
                { id: "schemes", l: "What government schemes and partnerships support Kenya's potato farmers?" },
                { id: "climate", l: "What is the climate and soil profile for Kenya potato?" },
                { id: "calendar", l: "When are potatoes planted and harvested in Kenya?" },
                { id: "wpc-2026", l: "Why is Kenya hosting the World Potato Congress 2026?" },
                { id: "challenges", l: "What are the major challenges facing Kenya's potato sector?" },
              ].map((it, i) => <a key={i} href={"#" + it.id} style={{ fontSize: 13, color: "#555", textDecoration: "none", padding: "5px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>{it.l}</a>)}
            </nav>
          </details>

          {/* Card 1 */}
          <section id="industry-size" data-card="overview" style={cardWrap}>
            <h2 style={sH2}>How big is Kenya&apos;s potato industry?</h2>
            <p style={sIntro}>Kenya produces approximately 2.31 million tonnes of potatoes annually from 239,325 hectares — making it East Africa&apos;s largest potato producer and Africa&apos;s #2 producer after Egypt&apos;s 8.08 million tonnes (FAOSTAT 2024). State-average yield of 9.65 t/ha is well below the country&apos;s 30–40 t/ha potential.</p>
            <QuickFacts items={[
              { label: "Production (2024)", value: "2.31M tonnes" },
              { label: "Cultivated area (2024)", value: "225,948 hectares" },
              { label: "Yield (2024)", value: "9.65 t/ha" },
              { label: "Yield potential", value: "30–40 t/ha (CIP/KALRO)" },
            ]} />
            <TrajectoryTable slug="kenya" />
            <p style={sP}>Kenya ranks #1 in East Africa and #2 in Africa overall, behind <Link href="/country/egypt" style={linkRed}>Egypt</Link> (6.3M tonnes) and ahead of <Link href="/country/algeria" style={linkRed}>Algeria</Link> (4.60M tonnes, 2024) and <Link href="/country/south-africa" style={linkRed}>South Africa</Link> (2.6M tonnes). The country supports an estimated 800,000 smallholder potato households, with potato serving as a key food-security and cash crop in the Central Highlands and Rift Valley regions. Per-capita consumption sits at approximately 28 kg/year.</p>
            <p style={sP}>Production has fluctuated significantly across the past decade. Harvested area expanded from a 2014 low of 115,604 hectares to peaks above 230,000 hectares in recent years, driven primarily by expansion onto marginal land rather than yield improvements. Yields have declined from over 20 t/ha in earlier decades to today&apos;s 9.65 t/ha — a structural concern that reflects the seed-quality crisis explored later in this article. For broader African context see our <Link href="/answers/largest-potato-producer-india" style={linkRed}>India producer answer</Link> and the <Link href="/knowledge/top-potato-producing-countries" style={linkRed}>top potato producing countries</Link> reference.</p>
            <p style={sSource}>Source: FAOSTAT 2024; KALRO Tigoni Research Centre; CIP East Africa programmes; National Potato Council of Kenya (NPCK).</p>
          </section>

          {/* Card 2 */}
          <section id="counties" data-card="counties" style={cardWrap}>
            <h2 style={sH2}>Which counties produce the most potatoes in Kenya?</h2>
            <p style={sIntro}>Nyandarua County dominates Kenya&apos;s potato production with approximately 35% of national output — earning it the nickname &quot;potato basket&quot; (County Government of Nyandarua CIDP 2023-2027; KEPHIS 2023). Nakuru, Meru, Bomet, Bungoma, and Elgeyo-Marakwet round out the core potato belt, all in the Central Highlands or Rift Valley regions.</p>
            <div style={{ overflowX: "auto", marginBottom: 6 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["County", "Region", "Share / rank", "Key growing areas", "Top varieties"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {counties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i < 3 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd} data-stat-type="county-share" data-stat-source="KEPHIS">{r[2]}</td>
                      <td style={{ ...sTd, color: "#666" }}>{r[3]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: County Government of Nyandarua CIDP 2023-2027; MoALFC County Agricultural Statistics 2023; KEPHIS; KALRO. <strong>[DATA NEEDED: precise per-county tonnage breakdown beyond Nyandarua&apos;s 35% share]</strong> — county rankings reflect MoALFC and KEPHIS qualitative ordering; absolute tonnage per county is not uniformly published.</p>
            <p style={sP}>Production geographically concentrates in two macro-regions: the <strong>Central Highlands</strong> (Nyandarua, Meru, Nyeri) along the Aberdare and Mt Kenya slopes, and the <strong>Rift Valley</strong> (Nakuru, Bomet, Elgeyo-Marakwet, Narok, Trans-Nzoia). Both share three structural advantages: deep volcanic soils, 1,800–3,000 m elevation that moderates equatorial heat, and bimodal rainfall (long rains March–May, short rains October–December) that supports two cropping cycles per year.</p>
            <StatCallout number="~35%" context="of Kenya's potato production comes from Nyandarua County alone — the country's potato basket, anchored on the Aberdare slopes and Kinangop plateau." source="County Government of Nyandarua CIDP 2023-2027" />
          </section>

          {/* Card 3 */}
          <section id="nyandarua" data-card="nyandarua" style={cardWrap}>
            <h2 style={sH2}>Why is Nyandarua the largest potato producer in Kenya?</h2>
            <p style={sIntro}>Nyandarua County combines four advantages that together produce ~35% of Kenya&apos;s national potato output: deep volcanic soils on the Aberdare slopes and Kinangop plateau, elevation of 1,800–3,000 m that places the county squarely in potato&apos;s 15–20°C optimal tuberization range, bimodal rainfall of 1,200–1,800 mm enabling two cropping cycles per year, and the densest farmer-organisation network in Kenya&apos;s potato sector (KEPHIS; CIP East Africa).</p>
            <p style={sP}>The agronomic profile of Nyandarua is among the best in Africa for potato. Volcanic ash soils with 2–4% organic matter, pH 5.5–6.5, and excellent drainage match potato&apos;s rooting requirements perfectly. The county&apos;s elevation moderates equatorial heat — mean daytime temperatures of 18–22°C and nights 8–14°C sit in the optimal range for tuber initiation, comparable to <Link href="/country/peru" style={linkPlain}>Andean</Link> and <Link href="/country/colombia" style={linkPlain}>Colombian</Link> potato growing zones. Bimodal rainfall enables farmers to plant in March (long rains) and October (short rains), giving the county year-round potato availability that few other African regions can match.</p>
            <p style={sP}>The Kinangop plateau alone hosts an estimated 200,000+ potato smallholder farmers. Ol Kalou serves as the county&apos;s commercial centre, with the Wakulima distribution chain into Nairobi running daily truck shipments throughout the year. Despite this concentration, smallholder yields in Nyandarua remain at 8–15 t/ha — well below the agroclimate&apos;s 30–40 t/ha potential — because of the seed crisis and disease pressure documented in subsequent sections of this profile. <Link href="/blog/kenya-potato-boom-wpc-2026" style={linkRed}>Read the Kenya potato boom analysis</Link> for narrative context.</p>
            <p style={sSource}>Source: County Government of Nyandarua CIDP 2023-2027; KALRO Tigoni Research Centre; CIP East Africa.</p>
          </section>

          {/* Card 4 */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 style={sH2}>What varieties of potato are grown in Kenya?</h2>
            <p style={sIntro}>Shangi is Kenya&apos;s dominant potato variety, accounting for 50–70% of all cultivated area — an early-maturing 90–110 day variety with informal CIP-related origins that was retroactively recognized by KEPHIS rather than going through standard formal release (NPCK; CIP). Other established varieties include Kenya Mpya, Tigoni, Asante, Kenya Sherekea, and Kenya Karibu — all KALRO releases — alongside legacy imported varieties such as Dutch Robijn.</p>
            <div style={{ overflowX: "auto", marginBottom: 6 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Variety", "Origin / Released", "Adoption", "End use", "Maturity (days)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={sTd}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: KEPHIS variety register; KALRO Tigoni; CIP East Africa variety adoption surveys.</p>
            <p style={sP}><strong>Shangi&apos;s dominance</strong> reflects three structural factors: its 90–110 day maturity matches both bimodal rainfall windows; short dormancy lets farmers replant immediately rather than waiting for a sprouting period; and strong urban-market acceptance — Nairobi and Mombasa chip-fryers prefer Shangi for its cooking characteristics. Under optimal management Shangi delivers 30–40 t/ha; under typical smallholder conditions it yields 8–15 t/ha. The variety&apos;s near-monoculture status, however, creates genetic-uniformity risk parallel to that explored in our <Link href="/knowledge/potato-diseases-pests" style={linkRed}>diseases and pests article</Link> and <Link href="/answers/irish-potato-famine" style={linkRed}>Irish Potato Famine answer</Link>.</p>
            <p style={sP}>KALRO Tigoni Research Centre — the historical KARI breeding hub for Kenyan potato — has released the Kenya Mpya, Tigoni, Asante, Kenya Sherekea, and Kenya Karibu varieties to address bacterial wilt resistance, processing-grade quality, and yield improvement. CIP East Africa partners with KALRO on aeroponic minituber multiplication of clean-seed material, with the goal of shifting variety adoption toward more disease-resistant cultivars over time. Cross-link to <Link href="/varieties/kufri-pukhraj" style={linkRed}>Kufri Pukhraj</Link> (similar early-maturity profile to Shangi in <Link href="/country/india" style={linkPlain}>India</Link>).</p>
            <StatCallout number="50–70%" context="of Kenya's cultivated potato area is planted to Shangi — an informal variety retroactively recognized by KEPHIS, creating near-monoculture exposure to bacterial wilt and aphid-vectored viruses." source="NPCK 2023; CIP" />
          </section>

          {/* Card 5 */}
          <section id="seed-system" data-card="seed-system" style={cardWrap}>
            <h2 style={sH2}>How does Kenya&apos;s seed potato system work?</h2>
            <p style={sIntro}>Kenya faces a severe seed potato crisis: 95–98% of seed planted is informal — farmer-saved, market-obtained, or neighbour-exchanged — while only 2–5% is formally certified through KEPHIS (NPCK 2023). This creates a structural gap of over 100,000 tonnes per year between formal seed supply and farmer demand, propagating bacterial wilt, PVY, and PLRV across smallholder networks and progressively reducing yields over generations.</p>
            <QuickFacts items={[
              { label: "Certified seed share", value: "2–5%" },
              { label: "Informal seed share", value: "95–98%" },
              { label: "Annual supply gap", value: "100,000+ tonnes" },
              { label: "Lead institutions", value: "KEPHIS, KALRO, CIP, NPCK" },
            ]} />
            <p style={sP}>The economic logic of the seed crisis is straightforward but hard to break. Certified seed costs 3–5x more per kg than informal seed, and smallholders face cash-flow constraints at planting time. But the productivity gap is dramatic — under controlled trials, certified seed delivers 30–40 t/ha against the 8–15 t/ha typical of informal seed (KALRO; CIP). Closing the seed gap is the single highest-leverage intervention available in Kenya potato; it is also the central focus of NPCK and CIP partnership programmes.</p>
            <p style={sP}><strong>KEPHIS</strong> (Kenya Plant Health Inspectorate Service) is the national authority for seed potato certification — running field inspections, post-harvest tuber inspection, and laboratory virus testing under the OECD-aligned multiplication-tier framework. <strong>KALRO Tigoni Research Centre</strong> (formerly KARI) anchors the public breeding programme that produces pre-basic in vitro plantlets and minitubers. <strong>CIP East Africa</strong> partners with KALRO and KEPHIS on aeroponic multiplication facilities — a 50–100x multiplier on conventional minituber production that is gradually expanding the formal seed pipeline. <strong>NPCK</strong> (National Potato Council of Kenya) coordinates farmer-cooperative-level decentralized seed multiplication, training cooperatives to multiply CIP-supplied G2 minitubers up to G3–G4 levels for sale to neighbouring growers. For broader reference see our <Link href="/knowledge/seed-potato-systems" style={linkRed}>seed potato systems article</Link>, <Link href="/answers/seed-potato-certification" style={linkRed}>seed potato certification answer</Link>, and <Link href="/answers/certified-seed-potatoes" style={linkRed}>certified seed potatoes answer</Link>.</p>
            <StatCallout number="95–98%" context="of seed planted in Kenya is informal — farmer-saved, market-obtained, or neighbour-exchanged — propagating bacterial wilt, PVY, and PLRV across smallholder networks. The single largest constraint on Kenyan yield." source="NPCK 2023" />
            <p style={sSource}>Source: NPCK 2023; KEPHIS; KALRO Tigoni; CIP East Africa partnership reports.</p>
          </section>

          {/* Card 6 (merged: Markets, Processors, Prices) */}
          <section id="markets" data-card="markets" style={cardWrap}>
            <h2 style={sH2}>What are the major potato markets, processors, and prices in Kenya?</h2>
            <p style={sIntro}>Wakulima Market in Nairobi is Kenya&apos;s largest potato wholesale hub, complemented by Karatina Market (Nyeri) and Kongowea Market (Mombasa) as regional aggregators. Mandi-equivalent prices have ranged KES 18,000–55,000 per tonne (USD 120–360) in normal years (Agmarknet-equivalent reporting; KALRO). The processing chain is dominated by an informal chip-frying sector that consumes 30–40% of national crop, with frozen french fries almost entirely imported from <Link href="/country/belgium" style={linkPlain}>Belgium</Link>, the <Link href="/country/netherlands" style={linkPlain}>Netherlands</Link>, <Link href="/country/egypt" style={linkPlain}>Egypt</Link>, and <Link href="/country/south-africa" style={linkPlain}>South Africa</Link> (NPCK; Abong et al. 2010; Kaguongo et al. 2014).</p>
            <p style={sP}><strong>Market structure.</strong> Wakulima Market in central Nairobi serves as the price-discovery anchor for the entire country, aggregating volumes from Nyandarua, Nakuru, Meru, and adjacent counties for distribution into Nairobi&apos;s urban demand and onward to Mombasa, Kisumu, and the broader East African region. Karatina Market in Nyeri supplies central Kenya and feeds into the Wakulima distribution chain. Kongowea Market in Mombasa serves coastal demand. Smallholder farmers typically receive 50–70% of the Wakulima wholesale price after deducting transport, commission, and post-harvest losses.</p>
            <p style={sP}><strong>Processor structure.</strong> Kenya&apos;s processing chain is unusual relative to other major potato economies — informal chip-frying (street vendors, small restaurants, hotel kitchens) consumes the largest single share of national crop at 30–40%, providing significant urban employment for youth and women but operating largely outside the formal regulatory and quality framework documented for processors in <Link href="/country/india/gujarat" style={linkRed}>India&apos;s Gujarat</Link>, <Link href="/country/united-states" style={linkPlain}>United States</Link>, or <Link href="/country/belgium" style={linkPlain}>Belgium</Link>. The named domestic crisp/chip processors include <strong>Deepa Industries</strong> (which operates the <strong>Tropical Heat</strong> brand — described as Kenya&apos;s leading crisp brand) and <strong>Proctor &amp; Allan</strong>, both producing potato crisps for the domestic market (CIP Working Paper 2014-7; Kenya Association of Manufacturers 2023). <strong>Frozen french fries</strong> for Kenya&apos;s growing quick-service restaurant and hotel sectors are almost entirely imported — primarily from Belgium, the Netherlands, Egypt, and South Africa — because attempts to establish domestic frozen-fry processing have been unsuccessful due to inconsistent raw-material supply, unreliable electricity, and the capital intensity of cold-chain infrastructure (USDA FAS GAIN Report KE2023-0011). Read the broader <Link href="/knowledge/potato-processing-industry" style={linkRed}>processing industry article</Link> for the global context.</p>
            <p style={sP}><strong>Pricing.</strong> Normal-year wholesale ranges of KES 18,000–55,000/tonne reflect significant seasonal variability tied to bimodal rainfall — peak harvests (June–August and January–March) push prices toward the lower bound, while lean-season periods (September–November) push prices to the upper bound. <strong>[DATA NEEDED: live Wakulima Market price feed integration]</strong> — current pricing reflects multi-year typical ranges. For broader market-price context see our <Link href="/answers/potato-market-price-today" style={linkRed}>potato market price answer</Link>.</p>
            <p style={sSource}>Source: NPCK; Wakulima Market authority; Karatina &amp; Kongowea Market data; Abong et al. 2010 (informal sector study); Kaguongo et al. 2014 (potato value chain analysis).</p>
          </section>

          {/* Card 7 */}
          <section id="schemes" data-card="schemes" style={cardWrap}>
            <h2 style={sH2}>What government schemes and partnerships support Kenya&apos;s potato farmers?</h2>
            <p style={sIntro}>Kenya&apos;s potato sector is supported by a coordination structure rather than a single farmer-subsidy programme: NPCK (National Potato Council of Kenya) provides industry coordination, KEPHIS handles phytosanitary and certification regulation, KALRO Tigoni anchors public breeding, and CIP East Africa partners across the chain on seed multiplication and variety improvement. County-level agricultural support is delivered through MoALFC (Ministry of Agriculture, Livestock, Fisheries and Cooperatives) extension services.</p>
            <p style={sP}>Unlike <Link href="/country/india" style={linkRed}>India&apos;s</Link> centrally-funded MIDH/NHB capital subsidy structure, Kenya&apos;s smallholder support runs primarily through partnership programmes. The CIP-KALRO aeroponic minituber multiplication initiative is producing seed at facilities in Tigoni and at decentralised hubs supported by NPCK. CGIAR Climate Change, Agriculture and Food Security (CCAFS) programmes target climate-resilient variety adoption in the Central Highlands. World Bank and IFAD smallholder credit programmes provide working-capital access for certified-seed purchase, though uptake remains limited by farmer cash-flow constraints at planting time.</p>
            <p style={sP}>Three concrete government-backed instruments operate today: (1) the <strong>National Potato Strategy 2016–2020</strong> (Republic of Kenya, Ministry of Agriculture; advocated by NPCK) formally established potato as a food-security crop and is the first national-level potato policy framework; (2) <strong>KEPHIS</strong> operates tissue-culture propagation facilities and runs the formal seed certification system, though a 100,000+ tonne annual gap between formal seed supply and farmer demand persists (NPCK 2023; KEPHIS Seed Certification Statistics 2023); (3) <strong>regulatory enforcement of sale-by-weight</strong> — county and national regulations now mandate weight-based potato sale, replacing the informal extended-bag system that historically disadvantaged farmers (NPCK advocacy). County governments partner with the <strong>Syngenta Foundation Seeds2B program</strong> to implement Quality-Declared Seed (QDS) protocols at sub-national scale (Syngenta Foundation Annual Report 2022). <strong>[DATA NEEDED: specific Big 4 Agenda potato-component allocations + county-level subsidy amounts]</strong> — these higher-level frameworks reference potato but specific scheme line-items are not documented in current approved sources.</p>
            <p style={sSource}>Source: NPCK 2023; KEPHIS; KALRO; CIP East Africa; CGIAR CCAFS; World Bank smallholder credit programme reports.</p>
          </section>

          {/* Card 8 */}
          <section id="climate" data-card="climate" style={cardWrap}>
            <h2 style={sH2}>What is the climate and soil profile for Kenya potato?</h2>
            <p style={sIntro}>Kenya&apos;s potato belt sits on volcanic soils along the Aberdare slopes, Mt Kenya foothills, and Rift Valley escarpments at 1,800–3,000 m elevation, under bimodal rainfall (1,200–1,800 mm/year) that delivers two cropping cycles per year — among Africa&apos;s most agroclimatically suitable potato zones (KALRO; CIP).</p>
            <p style={sP}>The agroclimatic profile is unusually favourable. Volcanic ash and andisol soils with 2–4% organic matter, pH 5.5–6.5, and excellent drainage are textbook for potato. Elevation provides daytime temperatures of 18–24°C and nighttime 8–14°C — squarely in the 15–20°C tuberization optimum (FAO; CIP) — moderating equatorial heat that would otherwise rule out commercial potato production at this latitude. Bimodal rainfall (long rains March–May, short rains October–December) supports two annual cropping cycles, a structural advantage few other major potato regions outside Andean South America can match.</p>
            <p style={sP}>Climate change pressure is real but moderate compared to <Link href="/country/india" style={linkPlain}>India&apos;s</Link> Indo-Gangetic plain or <Link href="/country/egypt" style={linkPlain}>Egypt&apos;s</Link> Nile Delta. Hijmans (2003) projects yield decline of 10–20% by 2055 across East Africa under business-as-usual scenarios, with bacterial wilt range expansion as the most acute biotic threat. CIP&apos;s LBHT (Late Blight + Heat Tolerant) breeding pipeline is actively tested in Kenya, with field trials at multiple altitudes targeting climate-adapted variety release. Read more in our <Link href="/knowledge/climate-change-potatoes" style={linkRed}>climate-change-potatoes article</Link>.</p>
            <p style={sSource}>Source: KALRO Tigoni; CIP East Africa; FAO; Hijmans 2003 American Journal of Potato Research.</p>
          </section>

          {/* Card 9 */}
          <section id="calendar" data-card="calendar" style={cardWrap}>
            <h2 style={sH2}>When are potatoes planted and harvested in Kenya?</h2>
            <p style={sIntro}>Kenya&apos;s bimodal rainfall pattern enables two main potato cropping cycles per year. The long-rains crop is planted March–May and harvested June–August. The short-rains crop is planted October–December and harvested January–March. Shangi&apos;s short dormancy enables farmers to replant immediately between cycles, supporting near-year-round potato availability (KALRO; CIP).</p>
            <QuickFacts items={[
              { label: "Long-rains plant", value: "March – May" },
              { label: "Long-rains harvest", value: "June – August" },
              { label: "Short-rains plant", value: "October – December" },
              { label: "Short-rains harvest", value: "January – March" },
            ]} />
            <p style={sP}>The two-cycle calendar gives Kenyan smallholders a productivity advantage over single-cycle production regions. A farmer in Nyandarua, Nakuru, or Meru can plant Shangi in March, harvest in July, immediately replant in October, and harvest again in February — effectively doubling annual output per hectare relative to a single-rabi-cycle farmer in <Link href="/country/india" style={linkPlain}>India</Link> or Bangladesh. This explains the resilience of Kenya&apos;s potato output despite the seed crisis and yield decline noted earlier.</p>
            <p style={sP}>Climate-change-driven rainfall variability is the main risk to this calendar. Late or failed long rains in March–April can compress the first cycle and force smallholders to skip the short-rains cycle entirely. Erratic rainfall patterns documented across the past decade are already reshaping farmer decisions on planting windows, with the most vulnerable smallholders increasingly relying on a single cycle rather than two. For practical sowing-time guidance see our <Link href="/answers/when-to-plant-potatoes" style={linkRed}>when to plant potatoes answer</Link>.</p>
            <p style={sSource}>Source: KALRO Tigoni; CIP East Africa; FAO crop calendars; CGIAR CCAFS climate-resilience studies.</p>
          </section>

          {/* Card 10 — WPC 2026 (also linked from hero) */}
          <section id="wpc-2026" data-card="wpc-2026" style={{ ...cardWrap, background: "linear-gradient(135deg, rgba(198,40,40,0.04), rgba(198,40,40,0.01))", borderTop: "4px solid #C62828" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Host Country 2026</div>
            <h2 style={sH2}>Why is Kenya hosting the World Potato Congress 2026?</h2>
            <p style={sIntro}>Naivasha, Kenya hosts the 13th World Potato Congress at Sawela Lodges on Lake Naivasha, October 26–30, 2026 — the first time WPC has been hosted in East Africa (NPCK; FreshCrop Limited; wpc2026kenya.com). The congress is jointly organised by the National Potato Council of Kenya (NPCK) and FreshCrop Limited under the theme &quot;Global Potato Partnership for Enhanced Food Systems, Nutrition Security and Trade&quot; — a programmatic emphasis on food security, smallholder livelihoods, and South-South cooperation that distinguishes WPC 2026 from prior editions.</p>
            <QuickFacts items={[
              { label: "Dates", value: "October 26–30, 2026" },
              { label: "Venue", value: "Sawela Lodges, Lake Naivasha" },
              { label: "Theme", value: "Global Potato Partnership for Enhanced Food Systems, Nutrition Security and Trade" },
              { label: "Expected delegates", value: "1,000+ from 60+ countries" },
              { label: "Congress Chair", value: "Wachira Kaguongo (NPCK CEO)" },
              { label: "Congress Vice-Chair", value: "Chris Gasperi (FreshCrop)" },
            ]} />
            <p style={sP}>WPC 2026 represents a milestone for African potato — the first time the triennial-to-biennial congress has run on the continent. The choice of Kenya reflects three factors: NPCK&apos;s organisational maturity as a coordinating body for the Kenyan industry; CIP East Africa&apos;s long-running research presence in Kenya; and the symbolic importance of bringing the global potato community to a smallholder-dominated production context that mirrors much of the developing-world potato sector. The agenda is expected to emphasise smallholder seed systems, climate adaptation, women&apos;s and youth participation, and South-South knowledge exchange — themes underrepresented at prior WPC editions held in Lima, Beijing, Cuzco, and Edinburgh.</p>
            <p style={sP}>For Kenya&apos;s potato sector, WPC 2026 is a structural opportunity. The visibility, investor attention, and government coordination that the congress concentrates on the Kenyan industry over a 12–18 month build-up has already begun to accelerate KALRO–CIP aeroponic seed expansion, NPCK farmer-cooperative organisation, and county-government investment in cold-chain and processing infrastructure. The post-congress legacy effect — well documented from prior WPC host economies — typically delivers 3–7 years of accelerated sector formalisation and investment. For broader event context see our <Link href="/knowledge/potato-expo-2026" style={linkRed}>Potato Expo 2026 article</Link>, <Link href="/blog/kenya-potato-boom-wpc-2026" style={linkRed}>Kenya potato boom &amp; WPC 2026 narrative</Link>, and <Link href="/events" style={linkRed}>global potato events calendar</Link>.</p>
            <StatCallout number="1,000+" context="delegates from over 60 countries are expected at the 13th World Potato Congress in Naivasha — the first time WPC has been hosted in East Africa." source="NPCK; wpc2026kenya.com" />
            <p style={sSource}>Source: NPCK; FreshCrop Limited; wpc2026kenya.com; Potatopedia events research.</p>
          </section>

          {/* Card 11 */}
          <section id="challenges" data-card="challenges" style={cardWrap}>
            <h2 style={sH2}>What are the major challenges facing Kenya&apos;s potato sector?</h2>
            <p style={sIntro}>Kenya&apos;s potato sector faces six interlocking constraints, with the seed crisis (95–98% informal) standing out as the most acute. Other constraints include bacterial wilt range expansion, structural yield decline (from 20+ t/ha historically to 9.65 t/ha today), cold-storage and post-harvest infrastructure gaps, frozen-fry import dependence, and climate-change pressure on rainfall reliability (NPCK; KALRO; CIP East Africa).</p>
            <p style={sP}>The seed crisis is the single highest-leverage intervention available. Closing the 100,000+ tonne gap between formal certified seed supply and farmer demand — through KALRO–CIP aeroponic scale-up, NPCK farmer-cooperative decentralised multiplication, and KEPHIS certification regulation — could plausibly double national yield from 9.65 to 18–25 t/ha within a decade. This would reposition Kenya from a 2.31M-tonne producer to potentially a 5M-tonne producer at the same cultivated area, with substantial smallholder income improvement. Bacterial wilt management — through resistant variety adoption (Kenya Sherekea), crop rotation extension, and certified-seed propagation — is a parallel high-leverage intervention.</p>
            <p style={sP}>The bright signals are real. WPC 2026 visibility is concentrating government and donor attention on Kenya&apos;s potato sector. CIP&apos;s aeroponic minituber programme is scaling. NPCK&apos;s organisational role has matured significantly across the past decade. County-level investment in cold-chain and processing capacity is following Wakulima Market price signals. The 5–10 year trajectory for Kenya potato is one of gradual upgrade across the entire value chain, with 2026 marking a probable inflection point. <Link href="/knowledge/potato-diseases-pests" style={linkRed}>Read on potato diseases and pests</Link> and <Link href="/knowledge/seed-potato-systems" style={linkRed}>seed potato systems</Link>.</p>
            <p style={sSource}>Source: NPCK; KALRO Tigoni; CIP East Africa; FAOSTAT 2024.</p>
          </section>

          {/* Source Block */}
          <div style={{ padding: "16px 20px", background: "#FAFAFA", borderRadius: 10, marginTop: 28, marginBottom: 8 }}>
            <div style={qfTitle}>Sources</div>
            {[
              "FAOSTAT 2024 — production, area, yield statistics for Kenya",
              "KALRO (Kenya Agricultural & Livestock Research Organization) — Tigoni Research Centre, variety register",
              "KEPHIS (Kenya Plant Health Inspectorate Service) — seed certification, phytosanitary regulation",
              "National Potato Council of Kenya (NPCK) — industry coordination, smallholder seed-system data, WPC 2026 organising",
              "FreshCrop Limited — WPC 2026 co-organising; Kenya processing-chain commentary",
              "CIP (International Potato Center) East Africa — variety improvement, aeroponic seed multiplication, bacterial wilt resistance breeding",
              "MoALFC (Ministry of Agriculture, Livestock, Fisheries and Cooperatives) — county agricultural statistics 2023",
              "County Government of Nyandarua — County Integrated Development Plan (CIDP) 2023-2027",
              "Abong et al. (2010) — Kenya informal chip-frying sector analysis",
              "Kaguongo et al. (2014) — Kenya potato value-chain study",
              "wpc2026kenya.com — World Potato Congress 2026 official site",
              "Hijmans, R.J. (2003). The effect of climate change on global potato production. American Journal of Potato Research 80: 271–280.",
            ].map((s, i) => <div key={i} style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{s}</div>)}
          </div>

          {/* FAQ */}
          <section style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>Frequently Asked Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {faqItems.map((item, i) => (
                <details key={i} style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid #f0f0f0", background: "#FAFAFA" }}>
                  <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}>{item.q}</span>
                    <span style={{ fontSize: 16, color: "#C62828", flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginTop: 12 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related African Producers */}
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>Other African potato producers</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 12 }}>
              {COUNTRIES.filter(x => ["egypt", "algeria", "south-africa"].includes(x.slug)).concat([{ slug: "ethiopia-placeholder", name: "Ethiopia", flag: "🇪🇹", prod: "1.0M (est.)", region: "Africa & ME" }]).map((s) => (
                <a key={s.slug} href={s.slug === "ethiopia-placeholder" ? "/countries" : `/country/${s.slug}`} style={{ background: "#FAFAFA", border: "1px solid #eee", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.flag}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.prod} tonnes · {s.region}</div>
                </a>
              ))}
            </div>
          </section>

          {/* Continue Reading */}
          <section style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>Continue Reading</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems: Certification, Multiplication, Trade", desc: "Why Kenya's 95–98% informal-seed share is the country's biggest yield constraint." },
                { href: "/knowledge/potato-processing-industry", tag: "Industry", title: "Global Potato Processing Industry: $80B Market", desc: "Where Kenya's import-dependent frozen-fry chain fits in the global processing landscape." },
                { href: "/knowledge/climate-change-potatoes", tag: "Climate", title: "Climate Change & Potatoes: Heat Stress, Water Scarcity", desc: "East African yield-decline projections and CIP's heat-tolerant variety pipeline." },
                { href: "/knowledge/potato-expo-2026", tag: "Events", title: "2026 Potato Expo & World Potato Congress", desc: "How WPC 2026 in Naivasha fits into the global potato events calendar." },
              ].map((a, i) => (
                <Link key={i} href={a.href} style={{ background: "#FAFAFA", border: "1px solid #eee", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "inherit", display: "block" }}>
                  <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, background: "rgba(198,40,40,0.06)", padding: "2px 8px", borderRadius: 6, marginBottom: 8 }}>{a.tag}</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{a.desc}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Further Reading — large cross-link block */}
          <section style={{ marginTop: 40, padding: "22px 24px", background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 14 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" }}>Further reading</h2>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>Deeper Potatopedia references on seed systems, processing, varieties, and global potato production.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16 }}>
              {[
                { title: "Africa & global context", items: [
                  { href: "/country/egypt", label: "Egypt — Africa's #1 producer" },
                  { href: "/country/algeria", label: "Algeria — North Africa" },
                  { href: "/country/south-africa", label: "South Africa" },
                  { href: "/country/india", label: "India — South Asia smallholder model" },
                  { href: "/country/peru", label: "Peru — origin of potato" },
                  { href: "/country/netherlands", label: "Netherlands — seed potato leader" },
                  { href: "/country/belgium", label: "Belgium — frozen french fry capital" },
                ] },
                { title: "Knowledge", items: [
                  { href: "/knowledge/seed-potato-systems", label: "Seed potato systems" },
                  { href: "/knowledge/potato-storage-cold-chain", label: "Potato cold storage" },
                  { href: "/knowledge/potato-diseases-pests", label: "Potato diseases and pests" },
                  { href: "/knowledge/climate-change-potatoes", label: "Climate change and potatoes" },
                  { href: "/knowledge/potato-processing-industry", label: "Global potato processing industry" },
                  { href: "/knowledge/potato-expo-2026", label: "Potato Expo 2026" },
                  { href: "/knowledge/top-potato-producing-countries", label: "Top potato producing countries" },
                  { href: "/knowledge/complete-potato-growing-guide", label: "Complete potato growing guide" },
                  { href: "/knowledge/potato-varieties-guide", label: "Potato varieties guide" },
                  { href: "/knowledge/kufri-potato-varieties-india", label: "Kufri varieties (India parallel)" },
                  { href: "/knowledge/global-potato-trade", label: "Global potato trade" },
                  { href: "/knowledge/potato-storage-shelf-life", label: "Potato storage shelf life" },
                  { href: "/knowledge/common-potato-growing-mistakes", label: "Common potato growing mistakes" },
                ] },
                { title: "Practical answers", items: [
                  { href: "/answers/seed-potato-certification", label: "Seed potato certification" },
                  { href: "/answers/certified-seed-potatoes", label: "Certified seed potatoes" },
                  { href: "/answers/true-potato-seeds", label: "True potato seeds (TPS)" },
                  { href: "/answers/when-to-plant-potatoes", label: "When to plant potatoes" },
                  { href: "/answers/potato-cold-storage-temperature", label: "Cold storage temperature" },
                  { href: "/answers/how-long-potatoes-cold-storage", label: "How long can potatoes be stored?" },
                  { href: "/answers/potato-water-footprint", label: "Potato water footprint" },
                  { href: "/answers/potato-climate-change", label: "Potato and climate change" },
                  { href: "/answers/potato-market-price-today", label: "Potato market price" },
                  { href: "/answers/potato-history-origin", label: "Where did the potato originate?" },
                  { href: "/answers/best-fertilizer-for-potatoes", label: "Best fertilizer for potatoes" },
                  { href: "/answers/how-to-save-seed-potatoes", label: "How to save seed potatoes" },
                  { href: "/answers/seed-potato-yield-calculator", label: "Seed potato yield calculator" },
                  { href: "/answers/how-to-build-potato-cold-storage", label: "How to build potato cold storage" },
                  { href: "/answers/famous-potato-city-india", label: "Famous potato city (India)" },
                  { href: "/answers/largest-potato-producer-india", label: "Largest potato-producing state in India" },
                ] },
                { title: "Variety detail pages (smallholder-relevant)", items: [
                  { href: "/varieties/kufri-pukhraj", label: "Kufri Pukhraj — early maturity (similar to Shangi)" },
                  { href: "/varieties/kufri-jyoti", label: "Kufri Jyoti — long-running smallholder workhorse" },
                  { href: "/varieties/kufri-anand", label: "Kufri Anand" },
                  { href: "/varieties/kufri-sindhuri", label: "Kufri Sindhuri" },
                  { href: "/varieties/russet-burbank", label: "Russet Burbank — global processing reference" },
                ] },
                { title: "India deep dives (smallholder parallels)", items: [
                  { href: "/country/india/uttar-pradesh", label: "Uttar Pradesh" },
                  { href: "/country/india/bihar", label: "Bihar" },
                  { href: "/country/india/west-bengal", label: "West Bengal" },
                  { href: "/country/india/madhya-pradesh", label: "Madhya Pradesh" },
                  { href: "/country/india/gujarat", label: "Gujarat" },
                ] },
                { title: "Story-format analysis", items: [
                  { href: "/blog/kenya-potato-boom-wpc-2026", label: "Kenya potato boom & WPC 2026" },
                  { href: "/blog/climate-change-rewriting-potato-map", label: "Climate change rewriting the potato map" },
                  { href: "/blog/dutch-seed-potato-empire", label: "Dutch seed potato empire" },
                  { href: "/blog/andean-potato-origin-story", label: "Andean potato origin story" },
                ] },
              ].map((g) => (
                <div key={g.title}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 8 }}>{g.title}</div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                    {g.items.map((it) => (
                      <li key={it.href}><Link href={it.href} style={{ fontSize: 13, color: "#444", textDecoration: "none", lineHeight: 1.5 }}>{it.label} →</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div style={{ marginTop: 44, padding: "28px 28px", borderRadius: 16, background: "linear-gradient(135deg, rgba(198,40,40,0.06), rgba(198,40,40,0.02))", border: "1px solid rgba(198,40,40,0.12)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>Have a question about Kenya potato production?</div>
            <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>Ask Potatopedia AI for instant, data-backed answers drawn from FAOSTAT, KALRO, KEPHIS, NPCK, CIP, and other authoritative sources.</div>
            <Link href="/ask" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg,#C62828,#E53935)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Ask Potatopedia AI →</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Turkey: Premium Country Profile ── */

function TurkeyProfilePage({ c }) {
  const data = {
    slug: "turkey",
    name: "Turkey",
    flag: c.flag,
    region: c.region,
    h1: "Turkey Potato Industry: 6.9M Tonnes from the Niğde-Nevşehir-Aksaray Heartland",
    tagLabel: "Turkey · Mediterranean / Middle East",
    readMin: 14,
    accentLabel: "Turkey is the largest potato producer in the Mediterranean and Middle East, with 65% production growth across the past decade and a rapidly expanding chip & frozen-fry processing sector.",
    wikidata: "https://www.wikidata.org/wiki/Q43",
    articlePublishedISO: "2026-05-08",
    articleModifiedISO: "2026-05-08",
    indiaContext: false,

    quickFacts: [
      { label: "Rank", value: "Mediterranean & ME #1; ~global #9" },
      { label: "Production", value: "6.90M tonnes (FAOSTAT 2024)" },
      { label: "Top region", value: "Niğde-Nevşehir-Aksaray (Central Anatolia)" },
      { label: "Top variety", value: "Agria (processing + table)" },
      { label: "2024 area / yield", value: "195,767 ha / 35.2 t/ha" },
      { label: "10-year growth", value: "+65.6% (4.166M → 6.90M tonnes)" },
    ],

    definitiveAnswer: '<strong>Turkey produced 6.90 million tonnes of potatoes in 2024 from 195,767 hectares — the largest potato producer in the Mediterranean and Middle East region (FAOSTAT).</strong> Production has grown 65.6% from 4.166 million tonnes in 2014, anchored by the Central Anatolian plateau. The Niğde-Nevşehir-Aksaray cluster forms the country&apos;s "potato heartland" at 800–1,200m elevation. <strong>Agria</strong> is the dominant variety; the chip and frozen-fry processing sectors are expanding rapidly under PepsiCo (Lay&apos;s) and domestic Cips brand operations.',

    keyStats: [
      { value: "6.90M t", label: "2024 production" },
      { value: "+65.6%", label: "10-year growth", accent: "#4CAF50" },
      { value: "35.2 t/ha", label: "Yield (FAOSTAT 2024)" },
      { value: "Niğde-Nevşehir", label: "potato heartland" },
    ],

    tocItems: [
      { id: "industry-size", l: "How big is Turkey's potato industry?" },
      { id: "regions", l: "Which provinces produce the most potato in Turkey?" },
      { id: "heartland", l: "Why is the Niğde-Nevşehir-Aksaray cluster Turkey's potato heartland?" },
      { id: "varieties", l: "What varieties of potato are grown in Turkey?" },
      { id: "seed-system", l: "How does Turkey's seed potato system work?" },
      { id: "markets", l: "What are the major potato markets, processors, and prices in Turkey?" },
      { id: "schemes", l: "What government support exists for Turkish potato farmers?" },
      { id: "climate", l: "What is the climate and soil profile for potato in Turkey?" },
      { id: "calendar", l: "When are potatoes planted and harvested in Turkey?" },
      { id: "potato-days", l: "What is Potato Days Turkiye and why is Nevşehir the potato capital?" },
      { id: "challenges", l: "What are the major challenges facing Turkish potato farmers?" },
    ],

    cards: [
      {
        id: "industry-size", dataCard: "overview",
        h2: "How big is Turkey's potato industry?",
        lead: "Turkey produced <strong>6.90 million tonnes of potatoes in 2024</strong> from 195,767 hectares — the largest potato producer in the Mediterranean and Middle East and approximately the world&apos;s 9th largest producer (FAOSTAT 2024). Yield of 35.2 t/ha is on par with regional benchmarks.",
        quickFacts: [
          { label: "Production (2024)", value: "6.90M tonnes" },
          { label: "Cultivated area", value: "195,767 hectares" },
          { label: "Yield", value: "35.2 t/ha" },
          { label: "Growth (2014–2024)", value: "+65.6%" },
        ],
        body: [
          'Turkey\'s potato output has expanded dramatically across the past decade. Production rose from 4.166 million tonnes in 2014 to 5.20 million in 2022 and 5.70 million in 2023, before jumping to 6.90 million tonnes in 2024 (FAOSTAT) — a 65.6% increase over ten years. The expansion has been driven by area growth (a 30% area jump in 2024), yield improvement, and the emergence of a robust domestic processing industry.',
          'On a regional basis, Turkey is unambiguously #1 in the Mediterranean and Middle East. <Link href="/country/egypt" style="color:#C62828;text-decoration:none;font-weight:600">Egypt</Link> (6.3M tonnes), <Link href="/country/algeria" style="color:#C62828;text-decoration:none;font-weight:600">Algeria</Link> (4.60M), and <Link href="/country/iran" style="color:#C62828;text-decoration:none;font-weight:600">Iran</Link> (2.92M after a decade-long water-driven decline) are the regional peers. Turkey&apos;s 2024 yield of 35.2 t/ha is approximately 1.6x the African average; the next yield-improvement frontier is closing the gap to leading European producers like <Link href="/country/germany" style="color:#C62828;text-decoration:none">Germany</Link> (45.3 t/ha) and <Link href="/country/netherlands" style="color:#C62828;text-decoration:none">Netherlands</Link> (41.7 t/ha).',
        ],
        source: "Source: FAOSTAT 2024; Turkish Statistical Institute (TÜİK).",
      },
      {
        id: "regions", dataCard: "regions",
        h2: "Which provinces produce the most potato in Turkey?",
        lead: "Central Anatolia dominates Turkish potato production. The <strong>Niğde, Nevşehir, and Aksaray provinces</strong> form Turkey&apos;s potato heartland on the Central Anatolian plateau, joined by Bolu, Afyon, İzmir (early-season export), and Erzurum in eastern Anatolia (FAOSTAT; Turkish Ministry of Agriculture and Forestry).",
        table: {
          headers: ["Province / Region", "Position", "Notes", "Key context"],
          rows: [
            ["Niğde", "Top tier", "Central Anatolia plateau (800–1,200m)", "Cool-season cultivation; processing-grade varieties"],
            ["Nevşehir", "Top tier", "Cappadocia region", "Hosts \"Potato Days Turkiye\" annual industry event"],
            ["Aksaray", "Top tier", "Central Anatolia plateau", "Volcanic-soil belt adjoining Niğde"],
            ["Bolu", "Major", "Western Black Sea / North-western Anatolia", "Cool-summer production; chip stock"],
            ["Afyon", "Major", "Aegean / Central Anatolia transition", "Mid-season production"],
            ["İzmir", "Major", "Aegean coast", "Early-season production for fresh-market export"],
            ["Erzurum", "Significant", "Eastern Anatolia (high elevation)", "Late-season production; cool climate"],
            ["Konya", "Emerging", "Central Anatolia", "Growing potato area; primarily cereal-rotation"],
          ],
        },
        body: [
          'The three top provinces sit on the <strong>Central Anatolian plateau at 800–1,200m elevation</strong> — a cool-summer agroclimate that supports high tuberization efficiency without irrigation overload. The plateau\'s volcanic soil profile (particularly around Cappadocia near Nevşehir) is well-suited to potato; the regional concentration of cold storage facilities and processing-industry buyers (PepsiCo, Cips) further anchors production here.',
        ],
        source: "Source: FAOSTAT 2024; Turkish Statistical Institute (TÜİK); Turkish Ministry of Agriculture and Forestry province-level production data.",
      },
      {
        id: "heartland", dataCard: "heartland",
        h2: "Why is the Niğde-Nevşehir-Aksaray cluster Turkey's potato heartland?",
        lead: "The Niğde-Nevşehir-Aksaray cluster combines four advantages: cool 800–1,200m elevation, volcanic soil from the surrounding Cappadocian geology, established processor-anchored contract farming, and dense cold-storage infrastructure built over the past two decades (Turkish Ministry of Agriculture and Forestry).",
        body: [
          'Elevation matters more for Turkey than for any other major regional producer. While most Mediterranean potato regions struggle with summer heat-stress yield collapse, the Central Anatolian plateau\'s 800–1,200m altitude moderates summer temperatures into a 18–25°C daytime range — within the optimal tuberization window (15–20°C). Combined with cool nights (10–14°C in mid-summer), the region sustains tuberization through August in a way that lowland Mediterranean regions cannot.',
          'Volcanic soils contribute the second structural advantage. The Cappadocian volcanic legacy left the Nevşehir region with deep, well-drained, mineral-rich soils that retain moisture and support high yields. Combined with irrigation infrastructure built since the 1970s, the region delivers consistent 40–50 t/ha yields under commercial management — among the highest in the Middle East.',
          'The third factor is processor anchoring. PepsiCo (Lay\'s chip operation) and domestic Cips brand both operate procurement networks in the heartland. Long-term contract farming with named varieties (Agria, Hermes, Lady Olympia for chip stock) supports premium pricing and disciplined agronomy. Read more on the global processing industry context in our <Link href="/knowledge/potato-processing-industry" style="color:#C62828;text-decoration:none">processing industry article</Link>.',
        ],
        callout: { number: "800–1,200m", unit: "elevation", context: "The Central Anatolian plateau's altitude is the single most important agroclimatic feature of Turkey's potato heartland — moderating summer heat that would otherwise collapse Mediterranean potato yields.", source: "Turkish Ministry of Agriculture and Forestry" },
      },
      {
        id: "varieties", dataCard: "varieties",
        h2: "What varieties of potato are grown in Turkey?",
        lead: "<strong>Agria</strong> is Turkey&apos;s dominant variety — a Dutch-bred yellow-flesh cultivar widely used for both processing and table markets. Granola (fresh market), Marfona (table), and newer chip-stock varieties Melody, Hermes, and Lady Olympia round out the commercial portfolio (Turkish Ministry of Agriculture and Forestry; Europatat).",
        table: {
          headers: ["Variety", "Origin", "Adoption in Turkey", "End use", "Maturity"],
          rows: [
            ["Agria", "Netherlands", "Dominant", "Table + processing", "120–130 days"],
            ["Granola", "Germany", "Wide", "Fresh market (table)", "100–110 days"],
            ["Marfona", "Netherlands", "Wide", "Table (yellow flesh)", "100–110 days"],
            ["Melody", "Netherlands", "Growing chip stock", "Chip processing", "110–120 days"],
            ["Hermes", "Germany", "Established chip stock", "Chip processing", "110–120 days"],
            ["Lady Olympia", "Netherlands", "Growing chip stock", "Chip processing", "110–125 days"],
            ["Marabel", "Germany", "Niche", "Table", "100–110 days"],
            ["Lady Rosetta", "Netherlands", "Niche chip", "Chip processing", "110–120 days"],
          ],
        },
        body: [
          '<Link href="/varieties/agria" style="color:#C62828;text-decoration:none;font-weight:600">Agria</Link>\'s dominance reflects three factors: yellow flesh suits Turkish consumer taste preferences (avoiding the white-flesh "industrial" connotation), the variety\'s 35–50 t/ha yield potential matches Central Anatolian conditions, and Dutch certified-seed supply chains have been reliable since the 1980s. Newer chip-stock varieties (Melody, Hermes, Lady Olympia) are gaining ground as PepsiCo and Cips expand their processing capacity and require lower reducing-sugar varieties.',
          'For broader context on chip-stock varieties globally see <Link href="/varieties/atlantic" style="color:#C62828;text-decoration:none">Atlantic</Link> (the dominant US chip variety) and our <Link href="/knowledge/potato-varieties-guide" style="color:#C62828;text-decoration:none">complete varieties guide</Link>.',
        ],
        source: "Source: Turkish Ministry of Agriculture and Forestry variety register; Europatat; Turkish Statistical Institute.",
      },
      {
        id: "seed-system", dataCard: "seed-system",
        h2: "How does Turkey's seed potato system work?",
        lead: "Turkey relies heavily on <strong>imported certified seed potatoes from the Netherlands and Germany</strong>, supplemented by domestic seed multiplication coordinated through TAGEM (the General Directorate of Agricultural Research and Policy) and TİGEM (the Agricultural Enterprises General Directorate). Regulatory oversight runs through the Ministry of Agriculture and Forestry seed certification framework (TÜRKTOB; Turkish seed-policy regulations).",
        body: [
          'The Netherlands is Turkey\'s primary certified-seed supplier — Dutch breeders HZPC, Agrico, and Meijer ship Agria, Granola, Marfona, Melody, and other variety seed annually to Turkish multipliers. Germany supplies additional volumes including Hermes for the chip-processing chain. Domestic G3–G4 multiplication occurs primarily in Niğde, Nevşehir, and the Bolu cool-season region.',
          'TAGEM operates breeding-program research stations and supports varietal trials. The Turkish chip industry (PepsiCo, Cips) increasingly funds direct grower-supply programmes that include seed access as part of contract terms. <strong>[DATA NEEDED: precise share of Turkish potato area planted to certified seed]</strong> — backend confirms heavy Netherlands/Germany import dependence but doesn\'t quantify domestic certified vs. farm-saved share at uniform precision.',
          'For broader context see our <Link href="/knowledge/seed-potato-systems" style="color:#C62828;text-decoration:none">seed potato systems article</Link> and <Link href="/answers/seed-potato-certification" style="color:#C62828;text-decoration:none">seed certification answer</Link>.',
        ],
        source: "Source: TAGEM (Turkish General Directorate of Agricultural Research); TÜRKTOB (Turkish Seed Industry Association); Ministry of Agriculture and Forestry seed-policy framework; Eurostat extra-EU seed exports.",
      },
      {
        id: "markets", dataCard: "markets",
        h2: "What are the major potato markets, processors, and prices in Turkey?",
        lead: "Istanbul, Ankara, and Izmir wholesale markets anchor Turkish potato distribution. The processing sector is dominated by <strong>PepsiCo (Lay\'s chips)</strong> and the <strong>domestic Cips brand</strong>, with frozen french fry processing expanding alongside Turkey\'s fast-growing QSR market. Per-capita consumption is approximately 49 kg/year (FAOSTAT).",
        body: [
          'PepsiCo operates Turkey\'s largest chip-processing footprint, with Lay\'s production drawing chip-stock contract growers across the Central Anatolian heartland. Cips (the leading domestic chip brand) operates parallel procurement programmes. The frozen french fry sector is more recent but expanding rapidly — driven by McDonald\'s Turkey, Burger King, and the broader Turkish fast-food market growth.',
          'Mandi-equivalent wholesale prices vary substantially by season. Peak harvest (August–October) compresses prices; off-season periods (March–May) produce price recovery. <strong>[DATA NEEDED: live wholesale price feed for Turkish hal markets]</strong> — current pricing reflects multi-year typical ranges. For broader market-price context see our <Link href="/answers/potato-market-price-today" style="color:#C62828;text-decoration:none">potato market price answer</Link>.',
          'Turkey is also a notable potato exporter to neighboring markets including Iraq, Syria, Russia (subject to political conditions), and to Middle Eastern markets including Saudi Arabia and the Gulf states.',
        ],
        source: "Source: Turkish Statistical Institute (TÜİK); PepsiCo Turkey operations; Cips brand company communications; Ministry of Trade export statistics.",
      },
      {
        id: "schemes", dataCard: "schemes",
        h2: "What government support exists for Turkish potato farmers?",
        lead: "Turkish potato farmers receive support through the Ministry of Agriculture and Forestry&apos;s general agricultural-support framework, which includes irrigation-infrastructure subsidies, certified-seed cost support, and crop insurance through TARSİM (the agricultural insurance pool). <strong>[DATA NEEDED: specific named potato-sector farmer-subsidy programmes]</strong> — backend doesn&apos;t document specific potato-line-item allocations beyond the general framework.",
        body: [
          'TARSİM offers premium-subsidised crop insurance covering hail, frost, drought, and disease risks for potato across Turkish provinces. Premium subsidisation covers approximately 50–66% of the gross premium under the standard scheme. Drip irrigation subsidy programmes through the Ministry of Agriculture support adoption in water-stressed regions.',
          'Beyond direct subsidy, the regulatory framework supports the sector through TAGEM research stations, the Turkish Seed Industry Association (TÜRKTOB) certification regime, and county-level extension services. The "Potato Days Turkiye" annual industry event in Nevşehir (covered in card 10 below) functions as a quasi-policy convening point for the sector.',
        ],
        source: "Source: Turkish Ministry of Agriculture and Forestry; TARSİM agricultural insurance pool; TÜRKTOB; TAGEM.",
      },
      {
        id: "climate", dataCard: "climate",
        h2: "What is the climate and soil profile for potato in Turkey?",
        lead: "Turkey&apos;s potato heartland sits on Central Anatolian volcanic soils with sandy-loam to silty-loam profiles, pH 6.5–7.5, and excellent drainage — under a cool-summer continental climate that delivers the 15–20°C tuberization window potato requires (FAO; Turkish Ministry of Agriculture and Forestry).",
        body: [
          'The Central Anatolian plateau\'s 800–1,200m elevation is the structural foundation of Turkish potato productivity. Mean summer daytime temperatures of 22–28°C combine with cool nights (10–14°C in mid-summer) to keep tuberization metabolic rates within the optimum range. Cappadocian volcanic-derived soils provide the second pillar — well-drained, nutrient-rich profiles that match potato\'s rooting requirements.',
          'Climate change pressure is real and growing. Across the past decade, Central Anatolian summer temperatures have shifted upward by approximately 0.8°C (Turkish State Meteorological Service). Drought-year frequency has increased, prompting expansion of drip-irrigation infrastructure and a gradual shift toward shorter-maturity varieties. <Link href="/knowledge/climate-change-potatoes" style="color:#C62828;text-decoration:none">Read on climate change and potatoes</Link>.',
        ],
        source: "Source: FAO; Turkish State Meteorological Service; Turkish Ministry of Agriculture and Forestry; ICAR-CPRI agroclimatic comparison data.",
      },
      {
        id: "calendar", dataCard: "calendar",
        h2: "When are potatoes planted and harvested in Turkey?",
        lead: "Turkey&apos;s main potato crop is planted in <strong>April–May</strong> and harvested <strong>August–October</strong> — a long-summer cool-temperate cycle that distinguishes Turkey from rabi-season Indo-Gangetic producers. Early-season production in coastal İzmir runs February–March planting with May–June harvest for fresh-market export (Turkish Ministry of Agriculture and Forestry; FAO crop calendars).",
        quickFacts: [
          { label: "Main planting", value: "April – May" },
          { label: "Main harvest", value: "August – October" },
          { label: "Early (İzmir)", value: "Plant Feb–Mar, harvest May–Jun" },
          { label: "Storage entry", value: "September – October peak loading" },
        ],
        body: [
          'The April–October cycle in Central Anatolia gives Turkey one of the longest cool-season windows in the broader Mediterranean / Middle East region. The Niğde-Nevşehir-Aksaray cluster typically plants in late April through mid-May once soil temperature reaches 8°C at 10cm depth. Harvest concentrates in late August through early October.',
          'Early-season İzmir production targets the European fresh-market export window (May–June) when northern European supply is in transition between stored crop and new-crop arrivals. This counter-seasonal niche supports premium pricing and explains why Turkey ships fresh potatoes to Russia, Romania, and Mediterranean Europe each spring.',
        ],
        source: "Source: Turkish Ministry of Agriculture and Forestry sowing-time advisories; FAO crop calendars; Turkish Statistical Institute production calendar data.",
      },
      {
        id: "potato-days", dataCard: "potato-days",
        h2: "What is Potato Days Turkiye and why is Nevşehir the potato capital?",
        lead: "<strong>Potato Days Turkiye</strong> is the annual Turkish potato industry conference held in Nevşehir — the country&apos;s commercial-potato capital. The event brings together growers, processors (PepsiCo, Cips), seed companies (HZPC, Agrico, Meijer), and Ministry of Agriculture officials for industry coordination, variety introductions, and policy dialogue (Turkish Ministry of Agriculture and Forestry; industry communications).",
        body: [
          'Nevşehir\'s positioning as Turkey\'s potato capital reflects three converging factors: it sits in the heart of the Niğde-Nevşehir-Aksaray production cluster; the region hosts the densest cold-storage infrastructure in the country; and historical processor decisions (PepsiCo\'s early procurement footprint in Cappadocia) anchored downstream demand here. The annual Potato Days event — usually scheduled in late summer or early autumn — consolidates the sector\'s commercial coordination.',
          'For broader event context see our <Link href="/knowledge/potato-expo-2026" style="color:#C62828;text-decoration:none">global potato events guide</Link> and the <Link href="/events" style="color:#C62828;text-decoration:none">events calendar</Link>. Turkey\'s industry-event maturity is meaningfully higher than other Middle Eastern regional peers.',
        ],
        callout: { number: "Nevşehir", context: "Hosts Potato Days Turkiye annually — the Mediterranean / Middle East's most established potato industry convening, anchoring PepsiCo (Lay's), Cips, and Dutch / German seed companies in coordinated commercial dialogue.", source: "Turkish Ministry of Agriculture and Forestry; industry communications" },
      },
      {
        id: "challenges", dataCard: "challenges",
        h2: "What are the major challenges facing Turkish potato farmers?",
        lead: "Turkish potato farmers face six interlocking constraints: rising water-stress on the Central Anatolian plateau, certified-seed import dependence (Netherlands / Germany), late blight pressure during cool-wet windows, harvest-window price volatility, fragmenting farm-size structure, and emerging climate-driven calendar compression (Turkish Ministry of Agriculture and Forestry; TAGEM).",
        body: [
          'Water stress is the most acute medium-term threat. Central Anatolia depends on tube-well groundwater plus surface irrigation infrastructure built since the 1960s; declining water tables have prompted state-led drip-irrigation subsidy programmes. Certified-seed import dependence on the Netherlands and Germany (50–80% of formal seed plantings depending on region) creates currency-risk and supply-chain exposure that domestic seed multiplication has been slow to offset.',
          'Bright signals exist. The chip-processing sector\'s growth has injected commercial discipline into agronomy and seed access. Drip irrigation adoption is gradually closing the water-efficiency gap. Newer varieties (Melody, Hermes, Lady Olympia) are diversifying away from heavy Agria reliance. Turkey\'s position as the Mediterranean / Middle East\'s largest producer is structurally durable through 2030 absent extreme drought scenarios.',
        ],
        source: "Source: Turkish Ministry of Agriculture and Forestry; TAGEM; Turkish State Meteorological Service drought monitoring.",
      },
    ],

    sourceList: [
      "FAOSTAT 2024 — production, area, yield statistics for Turkey",
      "Turkish Statistical Institute (TÜİK) — province-level production data",
      "Turkish Ministry of Agriculture and Forestry — variety register, seed certification framework, sowing-time advisories",
      "TAGEM (General Directorate of Agricultural Research and Policy) — breeding program data",
      "TÜRKTOB (Turkish Seed Industry Association) — certification regime",
      "TARSİM (agricultural insurance pool) — crop insurance scheme data",
      "Turkish State Meteorological Service — climate trend and drought monitoring",
      "Eurostat — extra-EU certified seed potato exports to Turkey",
      "Europatat — European variety register",
      "PepsiCo Turkey + Cips brand company communications",
    ],

    faqItems: [
      { q: "How much potato does Turkey produce per year?", a: "Turkey produced 6.90 million tonnes of potatoes in 2024 (FAOSTAT), making it the largest producer in the Mediterranean and Middle East region and approximately the world's 9th largest. Production has grown 65.6% from 4.166 million tonnes in 2014, reflecting both area expansion and yield improvement. Yield of 35.2 tonnes per hectare is competitive with regional benchmarks." },
      { q: "Which province produces the most potatoes in Turkey?", a: "The Niğde-Nevşehir-Aksaray cluster on the Central Anatolian plateau dominates Turkish potato production — these three provinces collectively form Turkey's potato heartland (Turkish Ministry of Agriculture and Forestry). Other major production regions include Bolu, Afyon, İzmir (early-season export production), and Erzurum." },
      { q: "What variety of potato is grown in Turkey?", a: "Agria (Dutch-bred, yellow flesh) is Turkey's dominant variety, used for both table and processing. Other major varieties include Granola, Marfona, and newer chip-processing varieties Melody, Hermes, and Lady Olympia. Variety selection is heavily driven by Dutch and German breeder relationships." },
      { q: "When are potatoes planted in Turkey?", a: "Turkey's main potato crop is planted April–May and harvested August–October — a long cool-summer cycle on the Central Anatolian plateau. Early-season production in coastal İzmir runs February–March planting with May–June harvest for European fresh-market export." },
      { q: "Is Turkey the largest potato producer in the Middle East?", a: "Yes — Turkey is the largest potato producer in the broader Mediterranean and Middle East region at 6.90 million tonnes (FAOSTAT 2024), ahead of Egypt (6.3M), Algeria (4.60M), and Iran (2.92M after a 2015–2023 water-driven decline with partial 2024 recovery)." },
      { q: "What does Turkey grow potatoes for?", a: "Both fresh-market table use and processing. Approximately two-thirds of Turkish potato output supplies the domestic fresh market (with regional exports to Iraq, Syria, Russia, Saudi Arabia). The remainder supplies the chip-processing sector dominated by PepsiCo (Lay's brand) and the domestic Cips brand, plus the expanding frozen french fry sector serving McDonald's Turkey, Burger King, and the broader QSR market." },
      { q: "What is Potato Days Turkiye?", a: "Potato Days Turkiye is the annual Turkish potato industry conference held in Nevşehir — the country's commercial-potato capital. The event convenes growers, processors, seed companies (HZPC, Agrico, Meijer), and Ministry of Agriculture officials for industry coordination, variety introductions, and policy dialogue." },
      { q: "Does Turkey import seed potatoes?", a: "Yes — Turkey imports certified seed potatoes primarily from the Netherlands and Germany (Dutch breeders HZPC, Agrico, Meijer; German breeders also active). Domestic G3–G4 multiplication occurs in Niğde, Nevşehir, and Bolu cool-season regions. The seed import dependence is structural and creates currency-risk exposure that ongoing TAGEM research initiatives aim to gradually address." },
    ],

    regionalContext: [
      { slug: "egypt", note: "Africa #1 producer (6.3M)" },
      { slug: "algeria", note: "Africa #2 producer (5.2M)" },
      { slug: "iran", note: "Regional peer; water-driven decline" },
      { slug: "russia", note: "Major export market for Turkish potato" },
      { slug: "netherlands", note: "Primary certified-seed source" },
      { slug: "germany", note: "Secondary certified-seed source" },
    ],

    continueReading: [
      { href: "/knowledge/potato-processing-industry", tag: "Industry", title: "Global Potato Processing Industry: $80B Market", desc: "Where Turkey's chip and frozen-fry processing fits in the global market." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems: Certification, Multiplication, Trade", desc: "Why Turkey relies on Dutch / German imports for certified seed." },
      { href: "/knowledge/climate-change-potatoes", tag: "Climate", title: "Climate Change & Potatoes", desc: "Central Anatolia's water-stress trajectory and adaptation pathway." },
      { href: "/knowledge/top-potato-producing-countries", tag: "Production Data", title: "Top Potato Producing Countries 2025", desc: "Where Turkey ranks globally — the Mediterranean / Middle East's largest producer." },
    ],
  };

  return <CountryProfilePremium data={data} />;
}

/* ── Iran: Premium Country Profile ── */

function IranProfilePage({ c }) {
  const data = {
    slug: "iran", name: "Iran", flag: c.flag, region: c.region,
    h1: "Iran Potato Industry: Hamadan's Highland Hub & Water-Scarcity Decline (2.92M Tonnes, 2024)",
    tagLabel: "Iran · Asia",
    readMin: 13,
    accentLabel: "Iran is the Middle East's third-largest potato producer after Turkey and Egypt — production fell from 5.14M tonnes (2015 peak) to 2.34M tonnes (2023 trough) under multi-year water scarcity, with partial recovery to 2.92M tonnes in 2024 (FAOSTAT).",
    wikidata: "https://www.wikidata.org/wiki/Q794",
    articlePublishedISO: "2026-05-08", articleModifiedISO: "2026-05-08", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "2.92M tonnes (FAOSTAT)" },
      { label: "2015 peak / 2023 trough", value: "5.14M / 2.34M tonnes" },
      { label: "Top province", value: "Hamadan (~30% of national output)" },
      { label: "Top variety", value: "Agria (Dutch-bred)" },
      { label: "Yield (2024)", value: "32.3 t/ha (FAOSTAT)" },
      { label: "Elevation", value: "1,000–2,500m Iranian plateau" },
    ],
    definitiveAnswer: '<strong>Iran produced 2.92 million tonnes of potatoes in 2024 (FAOSTAT) — a partial recovery from the 2.34M tonnes 2023 trough, but still well below the 5.14M tonnes 2015 peak.</strong> Iran experienced one of the steepest contractions among major potato producers in the past decade — −55% from 2015 peak to 2023 trough — driven by multi-year drought, depleting groundwater, surface-water allocation conflicts, and sanctions-era friction in certified-seed and input imports. <strong>Hamadan Province</strong> dominates as Iran&apos;s "potato capital," producing approximately 30% of national output. Production occurs on irrigated land at 1,000–2,500m elevation across the Iranian plateau. Agria is the dominant variety; seed potatoes are imported primarily from the Netherlands and Germany.',
    keyStats: [
      { value: "2.92M t", label: "2024 production" },
      { value: "5.14M t", label: "2015 peak" },
      { value: "−55%", label: "peak-to-trough" },
      { value: "+25%", label: "2023→2024 recovery" },
    ],
    trajectoryFootnote: "Source: FAOSTAT 2024. Iran's potato production peaked at 5.14M tonnes in 2015, fell to 2.34M tonnes by 2023, and partially recovered to 2.92M tonnes in 2024 — among the steepest contractions in any major potato-producing country in the past decade.",
    tocItems: [
      { id: "industry-size", l: "How big is Iran's potato industry?" },
      { id: "regions", l: "Which provinces produce the most potato in Iran?" },
      { id: "hamadan", l: "Why is Hamadan Iran's potato capital?" },
      { id: "varieties", l: "What varieties of potato are grown in Iran?" },
      { id: "seed-system", l: "How does Iran's seed potato system work?" },
      { id: "markets", l: "What are the major potato markets, processors, and prices?" },
      { id: "schemes", l: "What government support exists for Iranian potato farmers?" },
      { id: "climate", l: "What is the climate and soil profile for potato in Iran?" },
      { id: "calendar", l: "When are potatoes planted and harvested in Iran?" },
      { id: "decline", l: "Why has Iran's potato production declined since 2019?" },
      { id: "challenges", l: "What are the major challenges facing Iranian potato farmers?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Iran's potato industry?",
        lead: "Iran produced <strong>2.92 million tonnes of potatoes in 2024</strong> (FAOSTAT) on approximately 91,000 hectares — a partial recovery from the 2.34M tonnes 2023 trough, but still well below the 5.14M tonnes 2015 peak. The decade-long contraction was driven by multi-year drought, groundwater depletion, and surface-water allocation conflicts across the Iranian plateau (FAOSTAT 2024).",
        quickFacts: [
          { label: "Production (2024)", value: "2.92M tonnes" },
          { label: "2015 peak", value: "5.14M tonnes" },
          { label: "2023 trough", value: "2.34M tonnes" },
          { label: "Cultivated area (2024)", value: "~91,000 hectares" },
        ],
        body: [
          'Iran\'s potato sector has traversed a decade-long contraction. After peak production of 5.14M tonnes in 2015 — placing Iran among the world\'s top 15 producers at the time — output fell progressively through the 2018–2023 window to a 2.34M-tonne trough in 2023 as multi-year drought conditions, depleting groundwater, and surface-water allocation conflicts compressed irrigated agricultural area. The 2024 partial recovery to 2.92M tonnes (+25% YoY) reflects modestly improved precipitation and area expansion (FAOSTAT 2024).',
          'On a regional basis, Iran is now the Middle East\'s third-largest potato producer after <Link href="/country/turkey" style="color:#C62828;text-decoration:none;font-weight:600">Turkey</Link> (6.90M tonnes, 2024) and <Link href="/country/egypt" style="color:#C62828;text-decoration:none;font-weight:600">Egypt</Link> (6.3M). Iran\'s 2024 yield of 32.3 t/ha remains competitive with regional benchmarks — the multi-year production decline reflects compressed cultivated area rather than per-hectare productivity collapse.',
        ],
        source: "Source: FAOSTAT 2024; FAO Iran Country Office.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which provinces produce the most potato in Iran?",
        lead: "<strong>Hamadan Province</strong> dominates Iran's potato production with approximately 30% of national output, followed by Isfahan, Ardabil, East Azerbaijan, and Fars provinces. Most production occurs on irrigated highland plateau areas at 1,000–2,500m elevation (FAO Iran; Statistical Centre of Iran).",
        table: {
          headers: ["Province", "Position", "Region", "Notes"],
          rows: [
            ["Hamadan", "#1 (~30%)", "Western Iran (Zagros foothills)", "\"Potato capital\" — irrigated highland production"],
            ["Isfahan", "Major", "Central Iran", "Large irrigated agriculture base; varied climate"],
            ["Ardabil", "Major", "Northwest Iran (near Caspian)", "Cool-season production at higher elevation"],
            ["East Azerbaijan", "Major", "Northwest Iran", "Cool-season cultivation"],
            ["Fars", "Significant", "South-central Iran", "Diverse agriculture portfolio incl. potato"],
            ["Khorasan Razavi", "Significant", "Northeast Iran", "Mashhad region; growing area"],
            ["Zanjan", "Significant", "Northwest Iran", "Cool-season producer"],
            ["Golestan", "Emerging", "North Iran (Caspian)", "Lower-elevation production"],
          ],
        },
        body: [
          'The geographical concentration in Hamadan reflects three converging factors: high-elevation cool-season climate (1,800–2,200m mean elevation across the province), reliable historical groundwater (under increasing stress in recent drought years), and proximity to Tehran and other major consumer markets. Hamadan\'s "potato capital" branding is institutional in Iran, with provincial agricultural authorities and agro-industrial firms anchored there.',
        ],
        source: "Source: FAO Iran Country Office; Statistical Centre of Iran provincial data; Ministry of Agriculture Jihad.",
      },
      { id: "hamadan", dataCard: "hamadan",
        h2: "Why is Hamadan Iran's potato capital?",
        lead: "Hamadan combines high-elevation cool-season climate (1,800–2,200m), historical groundwater access, proximity to Tehran's consumer market, and four decades of provincial agricultural specialisation in potato cultivation. The province produces approximately 30% of Iran's national output (FAO Iran; Statistical Centre of Iran).",
        body: [
          'Hamadan\'s Zagros foothills location places it in a cool-summer climate band — daytime temperatures rarely exceed 28°C in mid-summer and nights drop to 12–15°C — within potato\'s tuberization optimum (15–20°C). The province\'s historical groundwater resources (aquifers in the Hamadan-Sarkan basin) supported irrigated potato cultivation through the 1980s–2010s, though recent drought years have compressed water availability.',
          'The provincial sector includes domestic chip processors and ware-potato cold-storage capacity supporting both fresh-market and processing supply chains. <strong>[DATA NEEDED: precise Hamadan-province cold storage capacity in tonnes]</strong> — qualitative dominance well-documented but specific tonnage figures not in approved sources at uniform precision.',
        ],
        callout: { number: "~30%", context: "of Iran's national potato output comes from Hamadan Province alone — anchored by 1,800–2,200m cool-summer Zagros climate and four decades of provincial agricultural specialisation.", source: "FAO Iran; Statistical Centre of Iran" },
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What varieties of potato are grown in Iran?",
        lead: "<strong>Agria</strong> (Dutch-bred yellow flesh) is Iran's dominant variety, followed by Marfona (table use), Sante (multi-region), Diamant, Boren (processing-specific), and Caesar. Iran depends heavily on imported certified seed from the Netherlands and Germany (FAO Iran; Iranian Seed and Plant Registration Department).",
        table: {
          headers: ["Variety", "Origin", "Adoption in Iran", "End use"],
          rows: [
            ["Agria", "Netherlands", "Dominant", "Table + processing"],
            ["Marfona", "Netherlands", "Wide", "Table"],
            ["Sante", "Netherlands", "Multi-region", "Table + chip"],
            ["Diamant", "Netherlands", "Established", "Table"],
            ["Boren", "Netherlands", "Processing focus", "Chip processing"],
            ["Caesar", "Netherlands", "Established", "Table"],
            ["Banba", "Ireland", "Niche", "Table + processing"],
            ["Granola", "Germany", "Significant", "Fresh market"],
          ],
        },
        body: [
          '<Link href="/varieties/agria" style="color:#C62828;text-decoration:none;font-weight:600">Agria</Link>\'s dominance reflects Dutch certified-seed supply chain depth and the variety\'s adaptability to Iranian highland conditions. The lack of indigenous Iranian potato breeding programmes at scale means most commercial varieties trace to European breeders. Iran does maintain some domestic seed multiplication through TARP (Tehran Agricultural Research Project) and provincial agricultural research stations, but at limited scale.',
        ],
        source: "Source: FAO Iran; Iranian Seed and Plant Registration Department; Eurostat extra-EU seed exports; CIP variety register.",
      },
      { id: "seed-system", dataCard: "seed-system",
        h2: "How does Iran's seed potato system work?",
        lead: "Iran imports certified seed potatoes primarily from the <strong>Netherlands and Germany</strong>, with sanctions-related friction periodically constraining supply. Domestic seed multiplication is limited; the Iranian Seed and Plant Registration Department oversees the regulatory framework but actual certified-seed adoption remains modest (FAO Iran; Eurostat).",
        body: [
          'Dutch breeders HZPC, Agrico, and Meijer plus German breeders supply the bulk of Iran\'s certified seed imports. Seed travels primarily through Persian Gulf ports including Bandar Abbas and Bandar Imam Khomeini, with onward distribution to provincial multipliers. The system has historically functioned despite political tensions but seed-supply continuity is more fragile than for non-sanctioned producers.',
          'Domestic G3–G4 multiplication occurs in Hamadan, Isfahan, Ardabil, and East Azerbaijan provinces but at limited scale relative to total cultivated area. <strong>[DATA NEEDED: precise share of Iranian potato area planted to certified seed]</strong>. For broader context see our <Link href="/knowledge/seed-potato-systems" style="color:#C62828;text-decoration:none">seed potato systems article</Link>.',
        ],
        source: "Source: FAO Iran; Iranian Seed and Plant Registration Department; Eurostat extra-EU seed export data.",
      },
      { id: "markets", dataCard: "markets",
        h2: "What are the major potato markets, processors, and prices in Iran?",
        lead: "Iran's domestic market absorbs most national production, with Tehran, Mashhad, Isfahan, and Tabriz wholesale markets anchoring distribution. The processing sector — predominantly chips — is expanding with both domestic brands and limited international presence. Iran exports notable volumes to Iraq and Afghanistan (FAO Iran; Iranian Customs Administration).",
        body: [
          'Iran\'s chip-processing sector includes domestic brands operating at varying scales. The frozen french fry sector remains limited compared to regional peers like Turkey. Per-capita potato consumption is approximately 40 kg/year. <strong>[DATA NEEDED: complete named-processor list for Iran]</strong> — context confirms domestic chip processors but specific company names not exhaustively in approved sources.',
          'Iran exports potatoes regionally — Iraq (largest market), Afghanistan, and the broader Persian Gulf region serve as buyer countries. Sanctions and currency volatility periodically affect export economics. Read more in our <Link href="/knowledge/global-potato-trade" style="color:#C62828;text-decoration:none">global potato trade reference</Link>.',
        ],
        source: "Source: FAO Iran; Iranian Customs Administration export statistics; Statistical Centre of Iran market data.",
      },
      { id: "schemes", dataCard: "schemes",
        h2: "What government support exists for Iranian potato farmers?",
        lead: "Iranian potato farmers receive support through the Ministry of Agriculture Jihad's general agricultural framework, which includes irrigation infrastructure development, certified-seed import facilitation, and partial drought-relief programmes (Ministry of Agriculture Jihad; FAO Iran).",
        body: [
          'The Iranian government has historically subsidised water and energy for agricultural use; recent reforms have begun gradually increasing water-cost recovery to encourage drip-irrigation adoption. Provincial-level agricultural extension services support variety dissemination and agronomic practice updates. <strong>[DATA NEEDED: specific named potato-sector subsidy schemes]</strong>.',
          'Sanctions context creates additional friction: imported certified seed, agricultural inputs, and processing equipment all face supply-chain constraints that domestic producers in non-sanctioned countries do not encounter. Recent Iran-Russia agricultural cooperation agreements include potato-sector elements.',
        ],
        source: "Source: Ministry of Agriculture Jihad; FAO Iran Country Office; Iranian Seed and Plant Registration Department.",
      },
      { id: "climate", dataCard: "climate",
        h2: "What is the climate and soil profile for potato in Iran?",
        lead: "Iran's potato belt sits on the Iranian plateau at 1,000–2,500m elevation, with cool-summer continental conditions and varied soil profiles ranging from alluvial in river valleys to volcanic on plateau highlands (FAO Iran; Iranian Statistical Centre).",
        body: [
          'Hamadan, Ardabil, and East Azerbaijan provinces benefit from cool-summer microclimates that support tuberization within the 15–20°C optimum despite Iran\'s broadly arid country-level climate. Soil profiles vary — Hamadan\'s alluvial valley floors and the volcanic-derived soils on plateau highlands both support potato — but irrigation is the universal binding constraint.',
          'Climate change pressure is exceptionally acute. Iran has experienced one of the steepest agricultural-water declines among major producers in the 2019–2023 window. Surface-water reservoir levels have fallen sharply, groundwater depletion is widespread, and snowpack accumulation in the Zagros mountain range has been below average for multiple consecutive years. <Link href="/knowledge/climate-change-potatoes" style="color:#C62828;text-decoration:none">Read more on climate change and potatoes</Link>.',
        ],
        source: "Source: FAO Iran; Iranian Meteorological Organisation; Iranian Ministry of Energy water-resources data.",
      },
      { id: "calendar", dataCard: "calendar",
        h2: "When are potatoes planted and harvested in Iran?",
        lead: "Iran's main potato crop is planted <strong>March–May</strong> and harvested <strong>August–October</strong> — a long cool-summer cycle on the Iranian plateau. Lower-elevation regions (Caspian, southern Iran) operate slightly compressed earlier-spring cycles (FAO Iran; Iranian Ministry of Agriculture Jihad).",
        quickFacts: [
          { label: "Main planting", value: "March – May" },
          { label: "Main harvest", value: "August – October" },
          { label: "Lower-elevation early", value: "Plant Feb–Mar, harvest Jun–Jul" },
          { label: "Storage entry", value: "September – October peak loading" },
        ],
        body: [
          'The plateau\'s long cool-summer cycle gives Iran one of the broader cultivation windows in the Middle East. April–May planting at 1,800–2,200m sees emergence in late May, full canopy by late June, tuber-bulking through July–August, and harvest in late August through October. The cycle\'s timing is highly water-dependent, and recent drought years have shifted planting later as soil moisture has become unreliable in early spring.',
        ],
        source: "Source: FAO Iran sowing-time guidance; Iranian Ministry of Agriculture Jihad provincial calendars.",
      },
      { id: "decline", dataCard: "decline",
        h2: "Why has Iran's potato production declined since 2019?",
        lead: "Iran's potato production fell from a 2015 peak of <strong>5.14 million tonnes to 2.34 million tonnes in 2023</strong> — a 55% peak-to-trough decline driven by multi-year drought, depleting groundwater, surface-water allocation conflicts, and sanctions-era friction in certified-seed and input imports. 2024 production recovered to 2.92M tonnes (+25% YoY) on improved precipitation and area expansion (FAOSTAT 2024; Iranian Ministry of Energy; FAO Iran).",
        body: [
          'The 2015–2023 contraction is unusual in scale among major potato producers globally. Multi-year drought reduced surface-water reservoir levels across central and western Iran. Groundwater depletion (already underway since the 1990s in heavily-pumped basins like Hamadan) accelerated. Provincial irrigation allocations were cut. Cumulative effect: cultivated area for potato compressed from approximately 160,000 hectares in 2015 toward approximately 76,000 hectares by 2023, before partial recovery to ~91,000 hectares in 2024.',
          'Sanctions-related friction in certified-seed imports compounded the agronomic stress. Currency depreciation made imported Dutch and German seed substantially more expensive in real terms, prompting some farmers to substitute farm-saved seed and accept progressive yield deterioration.',
          'The 2024 recovery (+25% YoY) is encouraging but the sector remains well below the 2015 peak. Full recovery to 5M+ tonne production levels will require sustained multi-year improvement in surface-water availability plus continued certified-seed import access. Read on broader water-stress context in our <Link href="/answers/potato-water-footprint" style="color:#C62828;text-decoration:none">potato water footprint answer</Link>.',
        ],
        callout: { number: "−55%", context: "Iran's production fell from 5.14M tonnes (2015 peak) to 2.34M tonnes (2023 trough), then partially recovered to 2.92M tonnes in 2024 (+25% YoY) — among the steepest contractions in any major potato-producing country in the past decade. Driver: multi-year drought + groundwater depletion + sanctions-era input friction.", source: "FAOSTAT 2024" },
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What are the major challenges facing Iranian potato farmers?",
        lead: "Iranian potato farmers face five interlocking constraints: water scarcity (the dominant medium-term threat), sanctions-driven friction in certified-seed and input imports, currency volatility affecting input costs, climate-driven calendar compression, and limited domestic seed multiplication capacity (FAO Iran; Ministry of Agriculture Jihad).",
        body: [
          'Water scarcity is the binding constraint that shapes everything else. Until surface-water and groundwater availability recovers, the production base will remain compressed. Sanctions friction is partially structural and partially policy-dependent — bilateral agricultural agreements with Russia, China, and Central Asian neighbours partially offset European import constraints.',
          'Bright signals: Iran\'s yield potential per hectare (30.7 t/ha) remains competitive with regional benchmarks; the agronomic and varietal foundations are intact. If water stress eases, production recovery could be relatively rapid. Drip-irrigation adoption is accelerating in the Hamadan-Isfahan-Ardabil belt, which improves water-use efficiency materially.',
        ],
        source: "Source: Iranian Ministry of Energy water-resources reports; Ministry of Agriculture Jihad; FAO Iran; FAOSTAT.",
      },
    ],
    sourceList: [
      "FAOSTAT 2023 — production, area, yield statistics for Iran",
      "Statistical Centre of Iran — provincial production data",
      "FAO Iran Country Office — sector analysis and variety register",
      "Iranian Ministry of Agriculture Jihad — sowing calendars and policy framework",
      "Iranian Seed and Plant Registration Department — variety regulation",
      "Iranian Ministry of Energy — water-resources monitoring (drought drivers)",
      "Iranian Meteorological Organisation — climate data",
      "Iranian Customs Administration — export statistics (Iraq, Afghanistan)",
      "Eurostat — Netherlands / Germany seed potato exports to Iran",
    ],
    faqItems: [
      { q: "How much potato does Iran produce per year?", a: "Iran produced 2.92 million tonnes of potatoes in 2024 (FAOSTAT) — a partial recovery from the 2023 trough of 2.34M tonnes, but still well below the 5.14M tonne peak in 2015. The decade-long decline reflects multi-year drought and water-availability constraints across the Iranian plateau." },
      { q: "Why has Iranian potato production declined?", a: "Multi-year drought (2015 onwards), depleting groundwater in heavily-pumped basins like Hamadan, surface-water allocation conflicts, and sanctions-era friction in imported certified seed have collectively compressed cultivated area from approximately 160,000 hectares in 2015 to approximately 76,000 hectares in 2023, before partial recovery to ~91,000 hectares in 2024." },
      { q: "Which province produces the most potatoes in Iran?", a: "Hamadan Province dominates with approximately 30% of Iran's national potato output. Other major provinces include Isfahan, Ardabil, East Azerbaijan, Fars, Khorasan Razavi, and Zanjan." },
      { q: "What variety of potato is grown in Iran?", a: "Agria (Dutch-bred yellow-flesh) is Iran's dominant variety. Other widely grown varieties include Marfona, Sante, Diamant, Boren (processing-specific), and Caesar — most originating from Dutch and German breeding programmes." },
      { q: "Where does Iran import seed potatoes from?", a: "Iran imports certified seed potatoes primarily from the Netherlands and Germany. Sanctions periodically constrain supply continuity. Seed travels through Persian Gulf ports (Bandar Abbas, Bandar Imam Khomeini) with onward provincial distribution." },
      { q: "Who does Iran export potatoes to?", a: "Iran exports notable volumes to Iraq (largest market), Afghanistan, and the broader Persian Gulf region. Sanctions and currency volatility periodically affect export economics." },
      { q: "What is the yield in Iran?", a: "Iranian potato yield averages 30.7 tonnes per hectare (Statistical Centre of Iran) — competitive with regional benchmarks. The 2019–2023 production decline reflects compressed cultivated area rather than per-hectare productivity collapse." },
      { q: "Is Iran the largest potato producer in the Middle East?", a: "No — after the 2015–2023 decline, Iran ranks third in the broader Middle East / Mediterranean region. Turkey is #1 at 6.90M tonnes (2024), Egypt is #2 at 6.3M, and Iran is #3 at 2.92M (FAOSTAT 2024)." },
    ],
    regionalContext: [
      { slug: "turkey", note: "Mediterranean & ME #1 (6.90M)" },
      { slug: "egypt", note: "Africa #1 / ME #2 (8.08M)" },
      { slug: "algeria", note: "Africa #2 (4.60M)" },
      { slug: "pakistan", note: "Regional peer (8.43M)" },
      { slug: "uzbekistan", note: "Central Asia neighbour" },
      { slug: "netherlands", note: "Primary seed source" },
    ],
    continueReading: [
      { href: "/knowledge/climate-change-potatoes", tag: "Climate", title: "Climate Change & Potatoes", desc: "Why Iran's water-scarcity collapse is the steepest among major producers." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "Iran's dependence on Dutch / German certified seed under sanctions friction." },
      { href: "/answers/potato-water-footprint", tag: "Sustainability", title: "Potato Water Footprint", desc: "Water-use efficiency context for Iran's drought-driven contraction." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Where Iran fits — major regional exporter to Iraq and Afghanistan." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

function AlgeriaProfilePage({ c }) {
  const data = {
    slug: "algeria", name: "Algeria", flag: c.flag, region: c.region,
    h1: "Algeria Potato Industry: El Oued's Saharan Center-Pivot Revolution (4.60M Tonnes, 2024)",
    tagLabel: "Algeria · Africa",
    readMin: 13,
    accentLabel: "Algeria is Africa's second-largest potato producer after Egypt — the only major Saharan-desert potato producer in the world, anchored by El Oued's center-pivot irrigation aquifer-fed system in the eastern Algerian Sahara.",
    wikidata: "https://www.wikidata.org/wiki/Q262",
    articlePublishedISO: "2026-05-08", articleModifiedISO: "2026-05-08", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "4.60M tonnes (FAOSTAT)" },
      { label: "Africa rank", value: "#2 (after Egypt 6.30M)" },
      { label: "Area (2024)", value: "135,414 hectares" },
      { label: "Yield (2024)", value: "33.9 t/ha" },
      { label: "Top region", value: "El Oued (Saharan); coastal Mascara/Aïn Defla" },
      { label: "Consumption", value: "~60 kg/capita/year" },
    ],
    definitiveAnswer: '<strong>Algeria produced 4.60 million tonnes of potatoes in 2024 (FAOSTAT) — making it Africa\'s second-largest producer after Egypt (6.30M).</strong> Algeria is the only major <strong>Saharan-desert potato producer</strong> in the world, anchored by El Oued province\'s center-pivot irrigation system tapping the Continental Intercalaire fossil aquifer. Coastal Mediterranean production (Mascara, Aïn Defla, Mostaganem) provides early-season supply; the Saharan El Oued system enables off-season winter cropping. Yield averages 33.9 t/ha (FAOSTAT 2024). Algeria is essentially self-sufficient in potatoes and a net regional exporter.',
    keyStats: [
      { value: "4.60M t", label: "2024 production" },
      { value: "Africa #2", label: "After Egypt" },
      { value: "135K ha", label: "Cultivated area" },
      { value: "33.9 t/ha", label: "Yield (FAOSTAT 2024)" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Algeria's potato industry?" },
      { id: "regions", l: "Which regions produce the most potato in Algeria?" },
      { id: "el-oued", l: "Why is El Oued the Sahara's potato capital?" },
      { id: "varieties", l: "What varieties of potato are grown in Algeria?" },
      { id: "seed-system", l: "How does Algeria's seed potato system work?" },
      { id: "markets", l: "What are the major potato markets and prices?" },
      { id: "schemes", l: "What government support exists for Algerian potato farmers?" },
      { id: "climate", l: "What is the climate and soil profile for potato in Algeria?" },
      { id: "calendar", l: "When are potatoes planted and harvested in Algeria?" },
      { id: "saharan-pivot", l: "How does Saharan center-pivot potato production work?" },
      { id: "challenges", l: "What are the major challenges facing Algerian potato farmers?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Algeria's potato industry?",
        lead: "Algeria produced <strong>4.60 million tonnes of potatoes in 2024</strong> (FAOSTAT) on approximately 135,000 hectares — making it Africa's second-largest producer after Egypt and the largest potato producer in the Maghreb region (FAOSTAT 2024; Algerian Ministry of Agriculture and Rural Development; FAO Algeria).",
        quickFacts: [
          { label: "Production (2024)", value: "4.60M tonnes" },
          { label: "Cultivated area", value: "135,414 hectares" },
          { label: "Yield", value: "33.9 t/ha" },
          { label: "Africa rank", value: "#2 of 54 (after Egypt)" },
        ],
        body: [
          'Algeria has emerged as one of Africa\'s most successful potato-sector stories of the past two decades. From less than 1.5 million tonnes in the early 2000s, production has more than tripled, with the dramatic uptick driven by Saharan center-pivot irrigation development in El Oued province alongside continued coastal Mediterranean production. Production peaked at ~5.0M tonnes in 2019 and has held in the 4.3–4.7M range across 2020–2024 (FAOSTAT). Algeria is essentially self-sufficient in potatoes and exports modestly to Tunisia, Mauritania, and the broader Maghreb region (FAOSTAT 2024; Algerian Ministry of Agriculture).',
          'On a regional basis, Algeria is firmly Africa\'s #2 potato producer behind <Link href="/country/egypt" style="color:#C62828;text-decoration:none;font-weight:600">Egypt</Link> (6.30M tonnes). Algeria significantly outproduces all other African nations including <Link href="/country/kenya" style="color:#C62828;text-decoration:none;font-weight:600">Kenya</Link>, South Africa, Morocco, and Malawi.',
        ],
        source: "Source: FAOSTAT 2024; Algerian Ministry of Agriculture and Rural Development (MADR); FAO Algeria Country Office.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which regions produce the most potato in Algeria?",
        lead: "<strong>El Oued Province</strong> in the eastern Algerian Sahara is now Algeria's largest potato-producing area thanks to center-pivot irrigation, complemented by coastal Mediterranean producers Mascara, Aïn Defla, Mostaganem, and Bouira (Algerian Ministry of Agriculture; FAO Algeria).",
        table: {
          headers: ["Region", "Position", "Climate zone", "Notes"],
          rows: [
            ["El Oued (Souf)", "#1 (Saharan)", "Saharan desert", "Center-pivot fossil-aquifer irrigation"],
            ["Mascara", "Major", "Coastal Mediterranean", "Traditional spring-summer production"],
            ["Aïn Defla", "Major", "Coastal Mediterranean", "Mitidja Plain — irrigated cultivation"],
            ["Mostaganem", "Major", "Coastal Mediterranean", "Western coast — sandy soils suit potato"],
            ["Bouira", "Significant", "Inland Tell Atlas", "Higher-elevation cool-season"],
            ["Skikda", "Significant", "Eastern coastal", "Mediterranean production"],
            ["Tipaza", "Significant", "Coastal Mitidja", "Greenhouse + open-field"],
            ["Aïn Témouchent", "Established", "Western coastal", "Seed multiplication zone"],
          ],
        },
        body: [
          'The geography of Algerian potato production reflects two distinct production systems. The traditional Mediterranean coastal belt (Mascara through Tipaza) operates classic spring-summer cycles on irrigated alluvial soils. The Saharan El Oued system is the modern transformation — center-pivot irrigation tapping the Continental Intercalaire fossil aquifer enables off-season winter production (October–February), giving Algeria year-round domestic supply continuity that the Mediterranean coast alone could not deliver.',
        ],
        source: "Source: Algerian Ministry of Agriculture and Rural Development; FAO Algeria; ITDAS (Technical Institute for the Development of Saharan Agronomy).",
      },
      { id: "el-oued", dataCard: "el-oued",
        h2: "Why is El Oued the Sahara's potato capital?",
        lead: "El Oued combines four enabling factors: massive fossil aquifer access (Continental Intercalaire), well-suited sandy desert soils, an off-season cool-winter climate window, and government-supported center-pivot infrastructure deployment from the early 2000s onwards. The region is now globally unique as a desert-based major potato producer (ITDAS; FAO Algeria).",
        body: [
          'El Oued (Wilaya of El Oued, also called the Souf region) sits in the northeast Algerian Sahara at approximately 80m elevation, with sandy desert soils and access to the Continental Intercalaire — one of the world\'s largest non-renewable fossil aquifers. The center-pivot revolution began in the late 1990s and accelerated dramatically through the 2000s and 2010s, transforming El Oued from a date-palm region with marginal subsistence agriculture into a major commercial potato producer.',
          'The system\'s economic logic is twofold: (1) winter cropping (October–February) supplies the domestic market during the Mediterranean off-season at premium prices, and (2) sandy desert soils combined with controlled irrigation produce visually clean, blemish-free tubers preferred by Algerian consumers. <strong>El Oued now reportedly accounts for the largest single regional share of Algerian potato production</strong> — though precise tonnage allocation between Saharan and coastal regions varies year-to-year.',
        ],
        callout: { number: "Saharan", context: "Algeria is the world's only major potato producer with a substantial desert center-pivot production system. El Oued's fossil-aquifer-fed pivots produce off-season winter potatoes (October–February) on sandy desert soils.", source: "ITDAS; FAO Algeria" },
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What varieties of potato are grown in Algeria?",
        lead: "<strong>Spunta</strong> (Dutch-bred) is Algeria's dominant variety, especially in coastal regions. Other significant varieties include Bartina, Désirée, Kondor, Diamant, and Atlas. Algeria depends substantially on imported certified seed from the Netherlands, France, and Denmark (FAO Algeria; Eurostat extra-EU seed exports).",
        table: {
          headers: ["Variety", "Origin", "Adoption in Algeria", "End use"],
          rows: [
            ["Spunta", "Netherlands", "Dominant", "Table — preferred long shape"],
            ["Bartina", "Netherlands", "Wide", "Table"],
            ["Désirée", "Netherlands", "Established", "Table — red skin"],
            ["Kondor", "Netherlands", "Established", "Table"],
            ["Diamant", "Netherlands", "Significant", "Table + early"],
            ["Atlas", "Netherlands", "Established", "Table"],
            ["Sahel", "Algeria/intro", "Saharan focus", "Heat-adapted"],
            ["Granola", "Germany", "Niche", "Fresh market"],
          ],
        },
        body: [
          '<Link href="/varieties/spunta" style="color:#C62828;text-decoration:none;font-weight:600">Spunta</Link>\'s elongated yellow-flesh shape matches Algerian consumer preference and the variety\'s adaptability spans both Mediterranean and Saharan production systems. ITDAS (Technical Institute for the Development of Saharan Agronomy) and INRAA (National Institute of Agronomic Research of Algeria) conduct varietal evaluation work, including heat-tolerance screening for Saharan production conditions. <strong>[DATA NEEDED: complete official Algerian variety list with production-share percentages]</strong>.',
        ],
        source: "Source: FAO Algeria; ITDAS variety register; INRAA varietal trials; Eurostat extra-EU seed potato exports.",
      },
      { id: "seed-system", dataCard: "seed-system",
        h2: "How does Algeria's seed potato system work?",
        lead: "Algeria imports the majority of its certified seed potatoes from the <strong>Netherlands, France, and Denmark</strong>, with domestic multiplication in Aïn Témouchent and select coastal provinces providing partial coverage. CNCC (Centre National de Contrôle et de Certification) regulates certified-seed standards (FAO Algeria; CNCC; Eurostat).",
        body: [
          'Algeria is one of the largest African importers of certified seed potatoes, sourcing primarily from Dutch breeders HZPC, Agrico, and Meijer plus French breeders Germicopa and Bretagne Plants. Seed enters via Algiers, Oran, and Béjaïa ports with onward distribution to provincial multipliers and direct to large-scale producers. Domestic G3–G4 multiplication has grown but does not yet meet domestic demand.',
          'CNCC operates the certification framework with G2–G4 generations defined per EU-aligned standards. Aïn Témouchent and select Tell Atlas valleys host the principal domestic seed-multiplication zones. <strong>[DATA NEEDED: precise share of Algerian potato area planted to imported vs domestically-multiplied certified seed]</strong>. For broader context see our <Link href="/knowledge/seed-potato-systems" style="color:#C62828;text-decoration:none">seed potato systems article</Link>.',
        ],
        source: "Source: FAO Algeria; CNCC (Centre National de Contrôle et de Certification); Eurostat extra-EU seed export data.",
      },
      { id: "markets", dataCard: "markets",
        h2: "What are the major potato markets and prices in Algeria?",
        lead: "Algeria's domestic market absorbs the bulk of national production, with Algiers, Oran, and Constantine wholesale markets anchoring distribution. Per-capita potato consumption is approximately 60 kg/year — among the highest in Africa. Algeria exports modestly to Tunisia, Mauritania, and the wider Maghreb region (FAO Algeria; Algerian Customs).",
        body: [
          'Per-capita consumption of approximately 60 kg/year places Algeria in the upper tier among African nations. Potato is a staple in Algerian cuisine — central to dishes like chorba (soup), tagine variants, and frites. Frozen french fry processing is limited compared to <Link href="/country/egypt" style="color:#C62828;text-decoration:none">Egypt</Link>; the domestic chip sector is growing but not yet at industrial scale.',
          'Government regulation periodically intervenes in potato markets — strategic stock purchases during glut periods to support farm prices, and managed releases during shortage windows to control consumer prices. <strong>[DATA NEEDED: complete named-processor list for Algeria]</strong>. Read more in our <Link href="/knowledge/global-potato-trade" style="color:#C62828;text-decoration:none">global potato trade reference</Link>.',
        ],
        source: "Source: FAO Algeria; Algerian Customs; ONILEV (Office National Interprofessionnel des Légumes et des Viandes) market data.",
      },
      { id: "schemes", dataCard: "schemes",
        h2: "What government support exists for Algerian potato farmers?",
        lead: "Algerian potato farmers receive support through MADR (Ministry of Agriculture and Rural Development) programmes including FNDA (Fonds National de Développement Agricole) subsidies, Saharan agriculture development incentives, and ONILEV regulatory market interventions (MADR; FNDA; ONILEV).",
        body: [
          'The Algerian government has actively prioritised Saharan agriculture development since the early 2000s — the El Oued center-pivot transformation was substantially supported by FNDA subsidised credit lines for irrigation infrastructure, government-facilitated land allocation for desert reclamation, and reduced-tariff diesel for agricultural pumping. The success of the Algerian Saharan potato system is a major government policy achievement that is internationally noted (FAO Algeria; ITDAS).',
          'ONILEV operates strategic potato-market interventions — guaranteed purchase prices during glut periods, managed cold-storage stocks, and import-export licensing oversight — to stabilise both farmer incomes and consumer-price levels. <strong>[DATA NEEDED: specific named subsidy schemes and their potato-component allocations]</strong>.',
        ],
        source: "Source: MADR (Ministry of Agriculture and Rural Development); FNDA; ONILEV; FAO Algeria Country Office.",
      },
      { id: "climate", dataCard: "climate",
        h2: "What is the climate and soil profile for potato in Algeria?",
        lead: "Algeria's potato production spans two distinct climate zones: Mediterranean coastal (mild wet winters, hot dry summers) and Saharan desert (hot dry summers, cool dry winters). Soils range from coastal alluvial to desert sandy under center-pivot irrigation (FAO Algeria; ITDAS).",
        body: [
          'The coastal Mediterranean belt (Mascara, Aïn Defla, Mostaganem) operates classic spring-summer cycles with irrigated production on alluvial soils. Daytime summer temperatures of 28–32°C are at the upper edge of potato tuberization tolerance, requiring careful irrigation management. Winter is the off-season for the coastal belt.',
          'The Saharan El Oued system inverts this calendar. Summer temperatures of 40–45°C make summer cultivation impossible, but cool winter conditions (December–February daytime 18–22°C, nights 5–10°C) are within potato\'s optimum. Center-pivot irrigation from the Continental Intercalaire aquifer eliminates the rainfall constraint. Sandy desert soils are surprisingly well-suited — high drainage, easy mechanical operations, low disease pressure. <Link href="/knowledge/climate-change-potatoes" style="color:#C62828;text-decoration:none">Read more on climate change and potatoes</Link>.',
        ],
        source: "Source: FAO Algeria; ITDAS (Technical Institute for the Development of Saharan Agronomy); Algerian National Meteorological Office.",
      },
      { id: "calendar", dataCard: "calendar",
        h2: "When are potatoes planted and harvested in Algeria?",
        lead: "Algeria has two main planting cycles: <strong>coastal Mediterranean</strong> (plant Jan–Mar, harvest May–Jul) and <strong>Saharan El Oued winter</strong> (plant Sep–Oct, harvest Jan–Feb). The combination delivers near-year-round domestic supply (FAO Algeria; ITDAS).",
        quickFacts: [
          { label: "Coastal main planting", value: "January – March" },
          { label: "Coastal main harvest", value: "May – July" },
          { label: "Saharan winter planting", value: "September – October" },
          { label: "Saharan winter harvest", value: "January – February" },
        ],
        body: [
          'The complementary timing of the two systems is the foundation of Algeria\'s domestic potato self-sufficiency. The Saharan winter harvest (January–February) supplies the market when Mediterranean coastal production is dormant, eliminating the historical winter-spring import dependence that affected Algeria through the 1990s. Late-spring and summer Mediterranean harvests carry supply through October, when the next Saharan winter cycle begins.',
        ],
        source: "Source: FAO Algeria sowing-time guidance; ITDAS Saharan agronomy calendars; MADR provincial agricultural extension data.",
      },
      { id: "saharan-pivot", dataCard: "saharan-pivot",
        h2: "How does Saharan center-pivot potato production work?",
        lead: "Saharan center-pivot potato production combines fossil-aquifer water sourcing, sandy desert soils that drain rapidly, cool-winter cropping (October–February), and large-radius rotating sprinkler systems that irrigate circular field areas typically 50–100 hectares each (ITDAS; FAO Algeria).",
        body: [
          'A center-pivot irrigation system rotates a long sprinkler arm around a fixed pivot point, distributing water uniformly across a circular field. In El Oued, pivots draw water from deep wells (typically 200–500m depth) tapping the Continental Intercalaire aquifer. Pivot diameters typically span 400–600m, irrigating circular areas of 50–100 hectares. The visible distinguishing feature of El Oued from satellite imagery is hundreds of these green circles in otherwise arid desert.',
          'Operational economics: high upfront capital cost (well drilling, pivot equipment, electrical infrastructure) is amortised over multiple seasons; pumping cost is the dominant operating expense, partially offset by Algeria\'s subsidised agricultural diesel and electricity tariffs. Yields under center-pivot Saharan conditions are typically 30–40 t/ha — competitive with global benchmarks.',
          'Sustainability is the central long-term question. The Continental Intercalaire is a non-renewable fossil aquifer; current extraction rates are not sustainable indefinitely. Government policy and ITDAS technical work focuses on water-use efficiency improvements (drip-irrigation conversions, deficit-irrigation strategies) but the fundamental constraint remains. Read on broader water-stress context in our <Link href="/answers/potato-water-footprint" style="color:#C62828;text-decoration:none">potato water footprint answer</Link>.',
        ],
        callout: { number: "100s", context: "of center-pivot irrigation circles in El Oued province alone — visible from satellite as green discs in otherwise arid Saharan desert. Each 50–100 hectare pivot draws from the Continental Intercalaire fossil aquifer.", source: "ITDAS; FAO Algeria" },
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What are the major challenges facing Algerian potato farmers?",
        lead: "Algerian potato farmers face four primary constraints: long-term Saharan aquifer sustainability (the binding constraint for El Oued), continued seed-import dependence, limited domestic processing depth, and climate-change pressure on coastal Mediterranean production (FAO Algeria; ITDAS).",
        body: [
          'The Saharan aquifer-sustainability question is the most strategically significant medium-to-long-term challenge. The Continental Intercalaire is shared with neighbouring Tunisia and Libya; trans-boundary management arrangements are nascent. Water-use efficiency improvements (drip conversions, deficit irrigation) help but do not resolve the underlying non-renewable resource constraint.',
          'Bright signals: continued yield improvement, healthy international seed-import pipeline, growing domestic processing investment, government policy continuity around potato-sector support, and strong consumer demand. Algeria\'s self-sufficiency status is a significant achievement compared to most African and Arab-world peers.',
        ],
        source: "Source: ITDAS Saharan-water research; FAO Algeria; MADR; FAOSTAT trend data.",
      },
    ],
    sourceList: [
      "FAOSTAT 2023 — production, area, yield statistics for Algeria",
      "Algerian Ministry of Agriculture and Rural Development (MADR)",
      "ITDAS — Technical Institute for the Development of Saharan Agronomy",
      "INRAA — National Institute of Agronomic Research of Algeria",
      "FAO Algeria Country Office — sector analysis and variety register",
      "CNCC — Centre National de Contrôle et de Certification (seed regulation)",
      "ONILEV — Office National Interprofessionnel des Légumes et des Viandes (market regulation)",
      "Eurostat extra-EU — Netherlands / France / Denmark seed potato exports to Algeria",
      "Algerian Customs Administration — export statistics",
    ],
    faqItems: [
      { q: "How much potato does Algeria produce per year?", a: "Algeria produced 4.60 million tonnes of potatoes in 2024 (FAOSTAT) on approximately 135,000 hectares — making Algeria Africa's second-largest producer after Egypt and the largest potato producer in the Maghreb region." },
      { q: "Is Algeria the largest potato producer in Africa?", a: "No — Algeria ranks #2 in Africa with 4.60M tonnes (2024), behind Egypt's 6.30M tonnes (FAOSTAT 2024). Algeria significantly outproduces all other African nations including Kenya, South Africa, Morocco, and Malawi." },
      { q: "Where is potato grown in the Sahara desert?", a: "Algeria's El Oued province in the eastern Algerian Sahara hosts the world's most significant Saharan-desert potato production system. Hundreds of center-pivot irrigation circles tap the Continental Intercalaire fossil aquifer for off-season winter cropping (October–February)." },
      { q: "Why does Algeria grow potatoes in the desert?", a: "Saharan winter (December–February) provides cool-temperature conditions within potato's tuberization optimum (15–20°C); fossil-aquifer water from the Continental Intercalaire eliminates the rainfall constraint; sandy desert soils drain well and produce visually clean tubers; the off-season harvest commands premium prices when Mediterranean coastal production is dormant." },
      { q: "What variety of potato is grown in Algeria?", a: "Spunta (Dutch-bred) is Algeria's dominant variety, valued for its elongated yellow-flesh shape that matches consumer preference. Other significant varieties include Bartina, Désirée, Kondor, Diamant, and Atlas — most originating from Dutch and French breeding programmes." },
      { q: "Where does Algeria import seed potatoes from?", a: "Algeria imports certified seed potatoes primarily from the Netherlands, France, and Denmark. Imports enter via Algiers, Oran, and Béjaïa ports. CNCC regulates certified-seed standards. Domestic G3–G4 multiplication in Aïn Témouchent and Tell Atlas valleys provides partial coverage." },
      { q: "How much potato do Algerians eat?", a: "Algerians consume approximately 60 kg of potatoes per person per year — among the highest per-capita potato consumption rates in Africa. Potato is a staple in Algerian cuisine, central to dishes like chorba, tagine variants, and frites." },
      { q: "What is the yield in Algeria?", a: "Algerian potato yield averages 30.9 tonnes per hectare (FAOSTAT 2023) — competitive with global benchmarks. El Oued Saharan center-pivot yields are typically 30–40 t/ha thanks to controlled irrigation, well-drained sandy soils, and low pest/disease pressure under desert conditions." },
    ],
    regionalContext: [
      { slug: "egypt", note: "Africa #1 (6.30M)" },
      { slug: "kenya", note: "East Africa peer" },
      { slug: "south-africa", note: "Southern Africa peer" },
      { slug: "turkey", note: "Mediterranean / ME #1 (6.90M)" },
      { slug: "iran", note: "Middle East peer" },
      { slug: "netherlands", note: "Primary seed source" },
    ],
    continueReading: [
      { href: "/knowledge/climate-change-potatoes", tag: "Climate", title: "Climate Change & Potatoes", desc: "Saharan center-pivot is one of the world's most striking climate-adapted potato systems." },
      { href: "/answers/potato-water-footprint", tag: "Sustainability", title: "Potato Water Footprint", desc: "El Oued's fossil-aquifer dependence in regional water-use context." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "How Algeria sources Dutch and French certified seed for both production systems." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Where Algeria fits — modest exporter to Tunisia, Mauritania, and the wider Maghreb." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

function UzbekistanProfilePage({ c }) {
  const data = {
    slug: "uzbekistan", name: "Uzbekistan", flag: c.flag, region: c.region,
    h1: "Uzbekistan Potato Industry: Soviet Irrigation Legacy & Central Asia's #1 Per-Capita Consumer (3.72M Tonnes, 2024)",
    tagLabel: "Uzbekistan · Asia",
    readMin: 12,
    accentLabel: "Uzbekistan is Central Asia's largest potato per-capita consumer at ~93 kg/year — anchored by Soviet-era irrigation infrastructure on the Amu Darya and Syr Darya river basins, with major production concentrated in Tashkent, Samarkand, and the Fergana Valley.",
    wikidata: "https://www.wikidata.org/wiki/Q265",
    articlePublishedISO: "2026-05-08", articleModifiedISO: "2026-05-08", indiaContext: false,
    quickFacts: [
      { label: "Production (2024, FAOSTAT)", value: "3.72M tonnes" },
      { label: "Top regions", value: "Tashkent, Samarkand, Fergana Valley" },
      { label: "Area (2024)", value: "~120,000 hectares" },
      { label: "Yield (2024)", value: "~30.9 t/ha" },
      { label: "Consumption", value: "~93 kg/capita/year" },
      { label: "Region rank", value: "Central Asia top-3" },
    ],
    definitiveAnswer: '<strong>Uzbekistan produced 3.72 million tonnes of potatoes in 2024 (FAOSTAT) on approximately 120,000 hectares — a steady ~28% increase from 2.91M tonnes in 2018.</strong> Uzbekistan is <strong>Central Asia\'s largest potato per-capita consumer</strong> at approximately 93 kg/person/year. Production is concentrated in Tashkent Province, Samarkand Province, and the densely-populated Fergana Valley — all benefitting from the Soviet-era irrigation infrastructure on the Amu Darya and Syr Darya basins. Uzbekistan imports significant volumes seasonally from Pakistan, Iran, and Russia to meet year-round demand. The Aral Sea crisis legacy continues to constrain water-availability planning across the region.',
    keyStats: [
      { value: "3.72M t", label: "2024 production" },
      { value: "~93 kg", label: "Per capita consumption" },
      { value: "120K ha", label: "Cultivated area" },
      { value: "+28%", label: "2018→2024 growth", accent: "#4CAF50" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Uzbekistan's potato industry?" },
      { id: "regions", l: "Which regions produce the most potato in Uzbekistan?" },
      { id: "fergana", l: "Why is the Fergana Valley a potato heartland?" },
      { id: "varieties", l: "What varieties of potato are grown in Uzbekistan?" },
      { id: "seed-system", l: "How does Uzbekistan's seed potato system work?" },
      { id: "markets", l: "What are the major potato markets and prices?" },
      { id: "schemes", l: "What government support exists for Uzbek potato farmers?" },
      { id: "climate", l: "What is the climate and soil profile for potato in Uzbekistan?" },
      { id: "calendar", l: "When are potatoes planted and harvested in Uzbekistan?" },
      { id: "soviet-legacy", l: "How does the Soviet irrigation legacy shape Uzbekistan's potato sector?" },
      { id: "challenges", l: "What are the major challenges facing Uzbek potato farmers?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Uzbekistan's potato industry?",
        lead: "Uzbekistan produced <strong>3.72 million tonnes of potatoes in 2024</strong> (FAOSTAT) on approximately 120,000 hectares — a steady ~28% increase from 2.91M tonnes in 2018, reflecting Uzbekistan's post-2017 agricultural-cluster reform expansion (FAOSTAT 2024; State Committee on Statistics of Uzbekistan).",
        quickFacts: [
          { label: "Production (2024)", value: "3.72M tonnes" },
          { label: "Cultivated area", value: "~120,000 hectares" },
          { label: "Yield", value: "~30.9 t/ha" },
          { label: "Central Asia rank", value: "Top-3 producer" },
        ],
        body: [
          'Uzbekistan is one of Central Asia\'s most significant potato-producing nations alongside Kazakhstan and Kyrgyzstan. The country\'s potato sector benefits from Soviet-era irrigation infrastructure on the Amu Darya and Syr Darya river basins — engineering investments that built the agricultural foundation across the region during the 20th century. Production has expanded steadily across 2018–2024 from 2.91M tonnes to 3.72M tonnes (FAOSTAT 2024; State Committee on Statistics of Uzbekistan).',
          'Despite robust production, Uzbekistan imports significant volumes seasonally — primarily from Pakistan, Iran, and Russia — to meet year-round demand. Per-capita potato consumption of approximately 93 kg/year is among the highest globally and the highest in Central Asia, reflecting potato\'s deep place in Uzbek cuisine across staple dishes like potato osh and shashlik garnishes.',
        ],
        source: "Source: FAOSTAT 2024; State Committee on Statistics of Uzbekistan; FAO Uzbekistan Country Office; CACAARI (Central Asia and the Caucasus Association of Agricultural Research Institutions).",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which regions produce the most potato in Uzbekistan?",
        lead: "<strong>Tashkent Province</strong>, <strong>Samarkand Province</strong>, and the densely-populated <strong>Fergana Valley</strong> (Andijan, Fergana, Namangan provinces) anchor Uzbekistan's potato production. Surkhandarya and Jizzakh provinces add significant supplementary volumes (FAO Uzbekistan; State Committee on Statistics).",
        table: {
          headers: ["Region", "Position", "Climate / topography", "Notes"],
          rows: [
            ["Tashkent Province", "Major", "Foothills + irrigated lowlands", "Largest urban-adjacent supply base"],
            ["Samarkand Province", "Major", "Zarafshan Valley", "Historic agricultural heartland"],
            ["Fergana Valley (Andijan)", "Major", "Densely populated valley", "Intensive smallholder cultivation"],
            ["Fergana Valley (Fergana)", "Major", "Valley irrigated lands", "Cross-border trade dynamics"],
            ["Fergana Valley (Namangan)", "Major", "Valley north", "Smallholder + medium-scale"],
            ["Surkhandarya", "Significant", "Southern Uzbekistan", "Subtropical lowland production"],
            ["Jizzakh", "Significant", "Steppe transition", "Expanding cultivation"],
            ["Kashkadarya", "Significant", "Southwest", "Mixed agricultural portfolio"],
          ],
        },
        body: [
          'The geography of Uzbek potato production overlaps closely with Soviet-era irrigation infrastructure deployment. The Amu Darya basin (south) and Syr Darya basin (north + Fergana Valley) carry the bulk of cultivated agriculture; potato production sits within this framework. The Fergana Valley\'s population density (the most densely-populated agricultural area in Central Asia) drives intensive smallholder production for local markets.',
        ],
        source: "Source: State Committee on Statistics of Uzbekistan; FAO Uzbekistan; CACAARI regional analysis.",
      },
      { id: "fergana", dataCard: "fergana",
        h2: "Why is the Fergana Valley a potato heartland?",
        lead: "The Fergana Valley combines densely-populated smallholder agriculture, Soviet-era irrigation infrastructure on the Syr Darya tributaries, fertile alluvial soils, and a moderate continental climate suitable for potato cultivation across spring-summer-autumn cycles (FAO Uzbekistan; CACAARI).",
        body: [
          'The Fergana Valley spans portions of Uzbekistan, Kyrgyzstan, and Tajikistan — though the Uzbek share (Andijan, Fergana, Namangan provinces) carries the lion\'s share of population and irrigated agriculture. The valley\'s population density (~500 persons/km² in some districts) drives intensive smallholder cultivation patterns: potato is grown alongside cotton, vegetables, and orchards on small parcels with high labour input.',
          'The Soviet-era irrigation network — Big Fergana Canal, Northern Fergana Canal, Andijan Reservoir — remains the agricultural foundation. Trans-boundary water management with neighbouring Kyrgyzstan and Tajikistan is a continuing diplomatic challenge but the irrigation network functions broadly intact. Variety preference and consumer demand for fresh table-quality potatoes shapes production decisions toward yellow-flesh European varieties.',
        ],
        callout: { number: "Soviet legacy", context: "The Fergana Valley's potato cultivation rides on Soviet-era irrigation engineering — the Big Fergana Canal and tributaries that transformed Central Asian agriculture in the 20th century and remain the foundation of regional production today.", source: "FAO Uzbekistan; CACAARI" },
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What varieties of potato are grown in Uzbekistan?",
        lead: "Uzbek production is dominated by European-bred varieties: <strong>Spunta</strong>, Sante, Roko, Picasso, Vineta, plus Russian-bred varieties Nevsky and Lugovskoy. Domestic seed multiplication is limited; certified seed imports come from Russia, the Netherlands, and Germany (FAO Uzbekistan; CACAARI).",
        table: {
          headers: ["Variety", "Origin", "Adoption in Uzbekistan", "End use"],
          rows: [
            ["Spunta", "Netherlands", "Wide", "Table — preferred shape"],
            ["Sante", "Netherlands", "Wide", "Table + chip"],
            ["Roko", "Netherlands", "Significant", "Table"],
            ["Picasso", "Netherlands", "Established", "Table"],
            ["Vineta", "Germany", "Significant", "Table"],
            ["Nevsky", "Russia (USSR)", "Wide (legacy)", "Table"],
            ["Lugovskoy", "Russia (USSR)", "Significant", "Table"],
            ["Adretta", "Germany (USSR-era)", "Established", "Table"],
          ],
        },
        body: [
          '<Link href="/varieties/spunta" style="color:#C62828;text-decoration:none;font-weight:600">Spunta</Link>\'s elongated yellow-flesh form matches Uzbek consumer preference and the variety\'s adaptability to Central Asian conditions. Soviet-era Russian varieties (Nevsky, Lugovskoy, Adretta) remain widely cultivated and represent the legacy varietal portfolio that pre-dates EU-breeder adoption. <strong>[DATA NEEDED: official Uzbek variety list with current production-share percentages]</strong>.',
        ],
        source: "Source: FAO Uzbekistan; CACAARI variety register; Eurostat extra-EU seed exports; Russian Ministry of Agriculture cross-border seed data.",
      },
      { id: "seed-system", dataCard: "seed-system",
        h2: "How does Uzbekistan's seed potato system work?",
        lead: "Uzbekistan imports the majority of its certified seed potatoes from <strong>Russia, the Netherlands, and Germany</strong>, with limited domestic G3–G4 multiplication. The Ministry of Agriculture oversees seed regulation; CACAARI supports regional seed-system coordination (FAO Uzbekistan; CACAARI; Eurostat).",
        body: [
          'Russian seed (legacy varieties Nevsky, Lugovskoy, Adretta) crosses overland via Kazakhstan; Dutch and German seed enters via Tashkent airport and various land routes. Domestic seed multiplication is modest in scale — Tashkent Province and parts of the Fergana Valley host multiplier farms but volumes meet only a fraction of national demand.',
          'Smallholder seed-saving remains common, especially in the Fergana Valley, with associated yield deterioration over multiple generations. <strong>[DATA NEEDED: precise share of Uzbek potato area planted to certified vs farm-saved seed]</strong>. For broader context see our <Link href="/knowledge/seed-potato-systems" style="color:#C62828;text-decoration:none">seed potato systems article</Link>.',
        ],
        source: "Source: FAO Uzbekistan; Ministry of Agriculture of Uzbekistan; CACAARI; Eurostat extra-EU seed export data.",
      },
      { id: "markets", dataCard: "markets",
        h2: "What are the major potato markets and prices in Uzbekistan?",
        lead: "Uzbekistan's domestic market absorbs the bulk of national production, with Tashkent's Chorsu Bazaar and provincial wholesale markets anchoring distribution. <strong>Per-capita consumption is ~93 kg/year</strong> — Central Asia's highest. Uzbekistan imports seasonally from Pakistan, Iran, and Russia (FAO Uzbekistan; Uzbek Customs).",
        body: [
          'Per-capita potato consumption of approximately 93 kg/year is among the highest globally — driven by potato\'s central role in Uzbek cuisine (potato osh, shashlik garnishes, samsa fillings). Seasonal import dependence is structural: domestic production peaks in autumn but cold-storage capacity does not bridge fully through to the next harvest. Pakistan and Iran supply spring imports; Russia supplements year-round.',
          'Frozen french fry and chip processing remains nascent compared to <Link href="/country/turkey" style="color:#C62828;text-decoration:none">Turkey</Link> or <Link href="/country/egypt" style="color:#C62828;text-decoration:none">Egypt</Link>. <strong>[DATA NEEDED: complete named-processor list for Uzbekistan]</strong>. Read more in our <Link href="/knowledge/global-potato-trade" style="color:#C62828;text-decoration:none">global potato trade reference</Link>.',
        ],
        source: "Source: FAO Uzbekistan; Uzbek Customs Administration trade statistics; State Committee on Statistics market data.",
      },
      { id: "schemes", dataCard: "schemes",
        h2: "What government support exists for Uzbek potato farmers?",
        lead: "Uzbek potato farmers receive support through Ministry of Agriculture programmes including subsidised certified-seed import facilitation, irrigation-system maintenance, and cluster-based agricultural reform initiatives launched since the 2017 economic liberalisation (Ministry of Agriculture; FAO Uzbekistan).",
        body: [
          'Uzbekistan\'s 2017+ economic reform agenda has materially affected agriculture. State-mandated cotton and wheat cultivation has been progressively reduced, freeing land for diversification — including potato. The agricultural cluster initiative consolidates smallholder land into larger commercial blocks for cooperative cultivation, processing, and export.',
          'Specific potato-sector support remains modest compared to Turkey or Egypt frameworks — the sector benefits from general agricultural support but not from dedicated potato-specific subsidy schemes at scale. <strong>[DATA NEEDED: specific named potato-sector subsidy programmes]</strong>.',
        ],
        source: "Source: Ministry of Agriculture of Uzbekistan; FAO Uzbekistan; CACAARI agricultural-policy analysis.",
      },
      { id: "climate", dataCard: "climate",
        h2: "What is the climate and soil profile for potato in Uzbekistan?",
        lead: "Uzbekistan's potato belt occupies continental-climate irrigated lowland and mid-elevation foothill zones across the Amu Darya and Syr Darya basins, with hot dry summers, cold winters, and mostly alluvial / loess soils suited to irrigated cultivation (FAO Uzbekistan; CACAARI).",
        body: [
          'The Tashkent and Samarkand provinces benefit from foothill-influenced microclimates that moderate summer heat and extend the cool-season window. The Fergana Valley\'s irrigated lowlands operate at slightly higher mean temperatures but with reliable irrigation water. Surkhandarya is subtropical and supports earlier-season cultivation.',
          'Climate change pressure is real and water-scarcity-driven. The Aral Sea crisis legacy — decades of upstream irrigation diversion drying the inland sea — is the defining environmental backstory of Uzbek agriculture. Trans-boundary water-management cooperation with Tajikistan, Kyrgyzstan, and Kazakhstan is essential but persistently challenging. <Link href="/knowledge/climate-change-potatoes" style="color:#C62828;text-decoration:none">Read more on climate change and potatoes</Link>.',
        ],
        source: "Source: FAO Uzbekistan; CACAARI climate analysis; Uzbek Hydrometeorological Service.",
      },
      { id: "calendar", dataCard: "calendar",
        h2: "When are potatoes planted and harvested in Uzbekistan?",
        lead: "Uzbekistan's main potato crop is planted <strong>February–April</strong> and harvested <strong>June–August</strong>, with a secondary autumn cycle (plant Jul–Aug, harvest Oct–Nov) in some lower-elevation regions enabling double-cropping (FAO Uzbekistan; CACAARI).",
        quickFacts: [
          { label: "Main planting", value: "February – April" },
          { label: "Main harvest", value: "June – August" },
          { label: "Secondary planting", value: "July – August" },
          { label: "Secondary harvest", value: "October – November" },
        ],
        body: [
          'The double-cropping regime in lower-elevation regions (Fergana Valley, Surkhandarya) extends supply continuity. Higher-elevation foothill production (Tashkent, Samarkand provinces) operates a single longer cycle. Storage entry through August–November supplies fresh-market demand into mid-winter; spring imports from Pakistan and Iran fill the late-winter to early-spring window.',
        ],
        source: "Source: FAO Uzbekistan sowing-time guidance; Ministry of Agriculture provincial agricultural calendars.",
      },
      { id: "soviet-legacy", dataCard: "soviet-legacy",
        h2: "How does the Soviet irrigation legacy shape Uzbekistan's potato sector?",
        lead: "The Amu Darya and Syr Darya river-basin irrigation networks — built and expanded across the 20th-century Soviet period — remain the structural foundation of Uzbek agricultural production, including potato. The Big Fergana Canal, Karakum Canal (in neighbouring Turkmenistan), and Aral Sea diversion legacy all trace to this engineering era (FAO Uzbekistan; CACAARI).",
        body: [
          'The Soviet agricultural transformation in Central Asia prioritised cotton cultivation but expanded irrigated agriculture broadly. Potato cultivation in Uzbekistan grew as a secondary crop within this framework. Independence in 1991 inherited functioning irrigation infrastructure but progressively weakening maintenance budgets through the 1990s; reform efforts since the early 2000s have stabilised the network with continued international (World Bank, ADB, EU) support.',
          'The Aral Sea crisis is the dramatic legacy of Soviet-era over-extraction — the world\'s fourth-largest lake reduced to ~10% of its original area by sustained upstream diversion. Modern Uzbek policy walks the tightrope of maintaining agricultural production while gradually shifting toward water-use efficiency. Drip-irrigation conversion is accelerating in higher-value crops.',
          'Uzbek seed-potato infrastructure remains modest — Soviet-era state seed-farm consolidation was followed by post-1991 fragmentation, and the system has not yet rebuilt centralised certified-seed multiplication at scale. Read on broader water-stress context in our <Link href="/answers/potato-water-footprint" style="color:#C62828;text-decoration:none">potato water footprint answer</Link>.',
        ],
        callout: { number: "20th C", context: "Soviet-era irrigation engineering on the Amu Darya and Syr Darya remains the structural foundation of Uzbek agriculture today. Modern policy walks the tightrope between maintaining production and rebalancing trans-boundary water use post-Aral Sea crisis.", source: "FAO Uzbekistan; CACAARI" },
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What are the major challenges facing Uzbek potato farmers?",
        lead: "Uzbek potato farmers face four primary constraints: water scarcity (Aral Sea crisis legacy + trans-boundary management complexity), continued seed-import dependence, fragmented post-Soviet seed multiplication infrastructure, and limited domestic processing-sector depth (FAO Uzbekistan; CACAARI).",
        body: [
          'Water scarcity is the binding medium-term constraint. Trans-boundary cooperation with Tajikistan, Kyrgyzstan, and Kazakhstan is essential but politically complex. Drip-irrigation adoption is accelerating in high-value crops; potato adoption is following but not yet dominant.',
          'Bright signals: continuing economic-reform progress since 2017 has freed agricultural diversification; per-capita consumption supports robust domestic demand; seed-import pipelines from Russia, the Netherlands, and Germany are stable; agricultural-cluster reforms create scale opportunities. Uzbekistan\'s potato sector has substantial growth potential as cluster reforms mature and water-efficiency improvements compound.',
        ],
        source: "Source: FAO Uzbekistan; CACAARI; World Bank Uzbekistan agricultural-sector analysis; Asian Development Bank.",
      },
    ],
    sourceList: [
      "FAOSTAT 2022 — production, area, yield statistics for Uzbekistan",
      "State Committee on Statistics of Uzbekistan — provincial production data",
      "Ministry of Agriculture of Uzbekistan — sector framework and policy",
      "FAO Uzbekistan Country Office — sector analysis",
      "CACAARI — Central Asia and the Caucasus Association of Agricultural Research Institutions",
      "World Bank Uzbekistan agricultural-sector analyses",
      "Asian Development Bank Central Asia agricultural reports",
      "Eurostat extra-EU — Netherlands / Germany seed potato exports to Uzbekistan",
      "Uzbek Customs Administration — trade statistics",
    ],
    faqItems: [
      { q: "How much potato does Uzbekistan produce per year?", a: "Uzbekistan produced approximately 2.9 million tonnes of potatoes in 2022 (FAOSTAT — most recent fully validated figure) on approximately 115,000 hectares. 2024 preliminary figures pending official validation." },
      { q: "Which region produces the most potatoes in Uzbekistan?", a: "Tashkent Province, Samarkand Province, and the Fergana Valley (Andijan, Fergana, Namangan provinces) are the major production regions. Surkhandarya and Jizzakh provinces add significant supplementary volumes." },
      { q: "How much potato do Uzbeks eat?", a: "Per-capita potato consumption in Uzbekistan is approximately 93 kg/person/year — Central Asia's highest and among the highest globally. Potato is central to Uzbek cuisine across staples like potato osh, shashlik garnishes, and samsa fillings." },
      { q: "What variety of potato is grown in Uzbekistan?", a: "Spunta (Dutch-bred) is widely grown, alongside other European varieties Sante, Roko, Picasso, and Vineta plus Soviet-legacy Russian varieties Nevsky, Lugovskoy, and Adretta. Domestic Uzbek varietal breeding is limited; most commercial varieties are imported or of Soviet origin." },
      { q: "Where does Uzbekistan import seed potatoes from?", a: "Uzbekistan imports certified seed potatoes primarily from Russia (legacy varieties), the Netherlands (Dutch breeders HZPC, Agrico, Meijer), and Germany. Domestic G3–G4 multiplication is limited; smallholder seed-saving remains common, especially in the Fergana Valley." },
      { q: "Does Uzbekistan import potatoes?", a: "Yes — Uzbekistan imports significant volumes seasonally from Pakistan, Iran, and Russia to bridge the spring window when domestic stored production runs down before the next harvest. Despite robust domestic production, cold-storage capacity does not yet bridge fully through to the following autumn harvest." },
      { q: "What is the Aral Sea crisis impact on Uzbek agriculture?", a: "Decades of Soviet-era upstream irrigation diversion (primarily for cotton) reduced the Aral Sea to approximately 10% of its original area. Modern Uzbek agricultural policy walks the tightrope of maintaining production while gradually shifting toward water-use efficiency. Drip-irrigation conversion is accelerating in higher-value crops including potato." },
      { q: "What is the yield in Uzbekistan?", a: "Uzbek potato yield averages approximately 25.2 tonnes per hectare — moderate by global standards. Yield improvement potential is meaningful through certified-seed adoption, drip-irrigation deployment, and improved varietal management." },
    ],
    regionalContext: [
      { slug: "iran", note: "Middle East peer (2.34M)" },
      { slug: "pakistan", note: "Major spring import source" },
      { slug: "russia", note: "Legacy seed + import source" },
      { slug: "turkey", note: "Mediterranean / ME #1 (6.90M)" },
      { slug: "china", note: "Asia #1 (94.3M)" },
      { slug: "india", note: "Asia #2 (60.4M)" },
    ],
    continueReading: [
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "How Uzbekistan sources Russian, Dutch, and German certified seed in a fragmented post-Soviet system." },
      { href: "/answers/potato-water-footprint", tag: "Sustainability", title: "Potato Water Footprint", desc: "Aral Sea crisis legacy and Central Asian trans-boundary water management." },
      { href: "/knowledge/climate-change-potatoes", tag: "Climate", title: "Climate Change & Potatoes", desc: "Central Asian water-scarcity challenges and potato-sector adaptation." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Where Uzbekistan fits — net importer balancing strong domestic production with high consumption." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

function ColombiaProfilePage({ c }) {
  const data = {
    slug: "colombia", name: "Colombia", flag: c.flag, region: c.region,
    h1: "Colombia Potato Industry: Andean Highlands, Papa Criolla & 90,000 Smallholders (3.86M Tonnes)",
    tagLabel: "Colombia · Americas",
    readMin: 13,
    accentLabel: "Colombia is South America's third-largest potato producer after Peru and Brazil — anchored by Boyacá, Cundinamarca, and Nariño Andean highland departments, with approximately 90,000 smallholder farmers and a culturally important diploid specialty: papa criolla.",
    wikidata: "https://www.wikidata.org/wiki/Q739",
    articlePublishedISO: "2026-05-08", articleModifiedISO: "2026-05-08", indiaContext: false,
    trajectoryFootnote: "Source: FAOSTAT 2024 — Item 116 (Potatoes) only. FAOSTAT records 2.49M tonnes (2024) under the standardized Potatoes item code. Colombian national agencies (DANE, FEDEPAPA, Min de Agricultura) report ~3.86M tonnes annually because they include papa criolla (Solanum phureja) in the Colombian potato sector total — papa criolla is treated as a separate item in FAOSTAT methodology. Both figures are correct under their respective accounting frameworks.",
    quickFacts: [
      { label: "Production (national, DANE/FEDEPAPA)", value: "3.86M tonnes (incl. papa criolla)" },
      { label: "Production (FAOSTAT 2024 standard)", value: "2.49M tonnes (excl. papa criolla)" },
      { label: "South America rank", value: "#3 (after Peru, Brazil)" },
      { label: "Top departments", value: "Boyacá, Cundinamarca, Nariño" },
      { label: "Area", value: "~130,000 hectares" },
      { label: "Farmers", value: "~90,000 smallholders" },
    ],
    definitiveAnswer: '<strong>Colombia produces approximately 3.86 million tonnes of potatoes annually per Colombian national agencies (DANE / FEDEPAPA / Ministry of Agriculture) — including papa criolla — making it South America\'s third-largest producer after Peru and Brazil.</strong> FAOSTAT records 2.49M tonnes under its standardized "Potatoes" item code (which excludes papa criolla as a separate item). Production is concentrated in the Andean highland departments of <strong>Boyacá, Cundinamarca, and Nariño</strong>, where approximately 90,000 smallholder farmers work parcels typically below 5 hectares. Colombia is uniquely associated with <strong>papa criolla</strong> (Solanum phureja, sometimes classified as a sub-species of Solanum tuberosum) — a culturally and gastronomically distinctive yellow-flesh diploid potato variety endemic to the Northern Andes.',
    keyStats: [
      { value: "3.86M t", label: "National total (DANE)" },
      { value: "2.49M t", label: "FAOSTAT 2024" },
      { value: "90,000", label: "Smallholder farmers" },
      { value: "S.America #3", label: "After Peru, Brazil" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Colombia's potato industry?" },
      { id: "regions", l: "Which departments produce the most potato in Colombia?" },
      { id: "boyaca", l: "Why is Boyacá Colombia's potato heartland?" },
      { id: "varieties", l: "What varieties of potato are grown in Colombia?" },
      { id: "papa-criolla", l: "What is papa criolla and why is it culturally important?" },
      { id: "seed-system", l: "How does Colombia's seed potato system work?" },
      { id: "markets", l: "What are the major potato markets, processors, and prices?" },
      { id: "schemes", l: "What government support exists for Colombian potato farmers?" },
      { id: "climate", l: "What is the climate and soil profile for potato in Colombia?" },
      { id: "calendar", l: "When are potatoes planted and harvested in Colombia?" },
      { id: "challenges", l: "What are the major challenges facing Colombian potato farmers?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Colombia's potato industry?",
        lead: "Colombia produces approximately <strong>3.86 million tonnes of potatoes annually</strong> per Colombian national agencies (DANE / FEDEPAPA / Ministry of Agriculture) — including papa criolla. FAOSTAT records 2.49M tonnes (2024) under its standardized \"Potatoes\" item code, which treats papa criolla as a separate item. Both figures are correct under their respective accounting frameworks. Colombia is South America's third-largest producer after Peru and Brazil, the largest in northern South America (FAOSTAT 2024; DANE; FEDEPAPA; FAO Colombia).",
        quickFacts: [
          { label: "Total (DANE incl. criolla)", value: "~3.86M tonnes" },
          { label: "FAOSTAT 2024 (item 116)", value: "2.49M tonnes" },
          { label: "Cultivated area", value: "~130,000 hectares" },
          { label: "S.America rank", value: "#3 (after Peru 5.6M, Brazil 4.2M)" },
        ],
        body: [
          'Colombia\'s potato sector is one of South America\'s most dynamic — combining substantial production volume with one of the highest concentrations of smallholder cultivation globally (~90,000 farmers, average parcel below 5 hectares). The sector contributes meaningfully to rural employment and food security in the Andean highland departments of Boyacá, Cundinamarca, and Nariño (FEDEPAPA; FAO Colombia).',
          '<strong>Why two production figures?</strong> Colombian national agencies (DANE, FEDEPAPA, Ministerio de Agricultura) report ~3.86M tonnes annually because they include <Link href="#papa-criolla" style="color:#C62828;text-decoration:none">papa criolla</Link> (Solanum phureja) within the Colombian potato sector total. FAOSTAT methodology treats papa criolla as a separate item code from "Potatoes" (item 116), so its standardized 2024 figure of 2.49M tonnes excludes the criolla contribution. The dual-statistic reflects different but equally valid accounting frameworks — and the gap directly measures papa criolla\'s scale in the Colombian sector.',
          'On a regional basis, Colombia ranks behind <Link href="/country/peru" style="color:#C62828;text-decoration:none;font-weight:600">Peru</Link> (5.6M tonnes — the cradle of potato domestication) and <Link href="/country/brazil" style="color:#C62828;text-decoration:none;font-weight:600">Brazil</Link> (4.2M tonnes, FAOSTAT 2024). Colombia significantly outproduces Argentina, Chile, Ecuador, and Bolivia among South American peers under either accounting methodology.',
        ],
        source: "Source: FAOSTAT 2024 (Item 116, Potatoes); DANE — Departamento Administrativo Nacional de Estadística; FEDEPAPA — Federación Colombiana de Productores de Papa; FAO Colombia Country Office; Ministerio de Agricultura y Desarrollo Rural.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which departments produce the most potato in Colombia?",
        lead: "<strong>Boyacá</strong>, <strong>Cundinamarca</strong>, and <strong>Nariño</strong> are Colombia's three dominant potato-producing departments, together accounting for the bulk of national production. Antioquia and Caldas add significant supplementary volumes (FEDEPAPA; DANE — National Administrative Department of Statistics).",
        table: {
          headers: ["Department", "Position", "Region", "Notes"],
          rows: [
            ["Boyacá", "Major", "Eastern Andean range", "Largest single department; smallholder dominant"],
            ["Cundinamarca", "Major", "Eastern Andean range; Bogotá-adjacent", "Urban-supply focus; commercial scale"],
            ["Nariño", "Major", "Southern Andean", "Cultural papa criolla heartland; Pasto region"],
            ["Antioquia", "Significant", "Western Andean", "Medellín-adjacent; mixed agriculture"],
            ["Caldas", "Significant", "Coffee-axis Andean", "Higher-elevation specialty"],
            ["Tolima", "Significant", "Magdalena Valley + Andean", "Mixed altitudes"],
            ["Cauca", "Established", "Southern Andean", "Smallholder + indigenous cultivation"],
            ["Santander", "Established", "Eastern Andean range north", "Mixed agricultural portfolio"],
          ],
        },
        body: [
          'The geography of Colombian potato production maps closely to the Andean highland zones at 2,000–3,500m elevation across the country\'s three Andean ranges (Cordillera Oriental, Central, Occidental). Boyacá and Cundinamarca dominate volume; Nariño dominates papa criolla cultural heritage. The smallholder-dominant structure reflects centuries of indigenous and campesino farming traditions adapted to highland Andean conditions.',
        ],
        source: "Source: FEDEPAPA; DANE — National Administrative Department of Statistics; FAO Colombia.",
      },
      { id: "boyaca", dataCard: "boyaca",
        h2: "Why is Boyacá Colombia's potato heartland?",
        lead: "Boyacá combines high-elevation Andean climate (2,500–3,500m), volcanic-derived fertile soils, deep smallholder farming traditions, proximity to Bogotá's consumer market, and four centuries of campesino potato cultivation continuity (FEDEPAPA; FAO Colombia).",
        body: [
          'Boyacá Department occupies the eastern Andean range north of Bogotá, with capital Tunja at 2,820m elevation and many cultivation areas above 3,000m. The volcanic-derived soils, cool-season climate, and ~1,500mm annual rainfall combine to support potato as the foundational rural livelihood crop. Smallholder farmer parcels are typically below 5 hectares; many operate at 1–2 hectares with intensive labour input.',
          'Boyacá\'s proximity to Bogotá (Colombia\'s largest urban market with ~11 million metropolitan-area population) provides direct supply-chain access. The department supplies a significant share of Bogotá\'s fresh-market potato through Corabastos (Bogotá\'s wholesale market) and direct distribution networks. Variety adoption blends commercial European-bred varieties (Diacol Capiro, Parda Pastusa, Suprema) with traditional Andean landrace cultivation.',
        ],
        callout: { number: "~5 ha", context: "Average Colombian potato farmer parcel size — below 5 hectares — reflects a deep smallholder tradition with approximately 90,000 farming families across Boyacá, Cundinamarca, Nariño, and other Andean departments.", source: "FEDEPAPA" },
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What varieties of potato are grown in Colombia?",
        lead: "Colombian production combines commercial varieties (<strong>Diacol Capiro</strong> — locally-bred dominant variety, Parda Pastusa, Suprema, Pastusa Suprema, ICA-Única) with the culturally-distinctive <strong>papa criolla</strong> (Solanum phureja) — a yellow-flesh diploid endemic to the Northern Andes (FEDEPAPA; CIP — International Potato Center; AGROSAVIA).",
        table: {
          headers: ["Variety", "Origin / type", "Adoption in Colombia", "End use"],
          rows: [
            ["Diacol Capiro", "Colombia (AGROSAVIA-bred)", "Dominant", "Table + processing — chip industry"],
            ["Pastusa Suprema", "Colombia", "Wide", "Table — Andean preferred"],
            ["Parda Pastusa", "Colombia (traditional)", "Wide", "Table — culturally favoured"],
            ["ICA-Única", "Colombia (AGROSAVIA-bred)", "Established", "Table — improved"],
            ["Suprema", "Colombia", "Significant", "Table"],
            ["Papa criolla (Yema de Huevo)", "S. phureja (endemic)", "Cultural specialty", "Table — distinctive yellow flesh"],
            ["Tuquerreña", "Colombia (traditional)", "Niche", "Table — Nariño specialty"],
            ["R-12 Negra", "Colombia", "Niche", "Table — landrace"],
          ],
        },
        body: [
          'Diacol Capiro is the workhorse commercial variety — bred by AGROSAVIA (Corporación Colombiana de Investigación Agropecuaria, formerly CORPOICA) and dominant in chip processing. Papa criolla\'s cultural and gastronomic significance gives it a distinct market segment with consistent premium pricing despite lower yield potential. AGROSAVIA conducts ongoing breeding programmes for both commercial varieties and improved papa criolla cultivars.',
        ],
        source: "Source: FEDEPAPA; AGROSAVIA — Corporación Colombiana de Investigación Agropecuaria; CIP — International Potato Center; FAO Colombia.",
      },
      { id: "papa-criolla", dataCard: "papa-criolla",
        h2: "What is papa criolla and why is it culturally important?",
        lead: "<strong>Papa criolla</strong> (Solanum phureja, sometimes classified as Solanum tuberosum subsp. andigenum group phureja) is a yellow-flesh diploid potato endemic to the Northern Andes. Its distinctive bright-yellow flesh, small egg-sized tubers (\"yema de huevo\" — egg yolk), short dormancy period, and unique flavour profile make it a cultural and gastronomic icon in Colombia (CIP; AGROSAVIA; FEDEPAPA).",
        body: [
          'Papa criolla differs from standard tetraploid Solanum tuberosum in several agronomically and gastronomically meaningful ways. It is diploid (2n=2x=24 chromosomes) versus the standard tetraploid (2n=4x=48). Tubers are typically small (egg-sized, hence "yema de huevo" in Spanish — egg yolk), bright yellow flesh with high carotenoid content, short dormancy period (allowing rapid replanting cycles), and a distinctive sweet-buttery flavour profile.',
          'Culturally, papa criolla is central to traditional Colombian dishes — most notably ajiaco (Bogotá\'s national soup, which combines three varieties of potato including papa criolla). The variety carries premium pricing in domestic markets due to consumer preference and lower yield potential than commercial varieties.',
          'Gastronomic significance has driven international interest — Colombia exports papa criolla to expatriate communities in the United States, Spain, and the United Kingdom, primarily as flash-frozen pre-cooked product to overcome the variety\'s short dormancy period and short shelf-life. <strong>[DATA NEEDED: precise current papa criolla export tonnage figures]</strong>.',
        ],
        callout: { number: "Diploid", context: "Papa criolla (S. phureja) is one of the world's most culturally significant diploid potato varieties — endemic to the Northern Andes, bright-yellow flesh, central to ajiaco (Bogotá's national soup), and progressively exported to expatriate communities globally.", source: "CIP; AGROSAVIA" },
      },
      { id: "seed-system", dataCard: "seed-system",
        h2: "How does Colombia's seed potato system work?",
        lead: "Colombia operates a hybrid certified-seed system: domestic <strong>AGROSAVIA</strong> conducts breeding and basic-seed multiplication; <strong>ICA</strong> (Instituto Colombiano Agropecuario) regulates certified-seed standards; commercial multipliers and farmer associations handle G3–G4 propagation. Smallholder seed-saving remains widespread alongside formal-system adoption (AGROSAVIA; ICA; FEDEPAPA).",
        body: [
          'AGROSAVIA, the national agricultural research corporation, anchors Colombian potato breeding — including the dominant Diacol Capiro and improved papa criolla cultivars. CIP (International Potato Center) collaborates closely on genetic resources and breeding methodologies, leveraging Colombia\'s natural connection to the Andean origin region.',
          'ICA regulates certified-seed standards through G0–G4 generation hierarchy. Commercial multipliers (e.g., Asociación Colombiana de Productores de Semilla de Papa) handle later-stage propagation; FEDEPAPA-affiliated farmer associations also conduct on-farm multiplication. <strong>[DATA NEEDED: precise share of Colombian potato area planted to certified vs farm-saved seed]</strong>. For broader context see our <Link href="/knowledge/seed-potato-systems" style="color:#C62828;text-decoration:none">seed potato systems article</Link>.',
        ],
        source: "Source: AGROSAVIA — Corporación Colombiana de Investigación Agropecuaria; ICA — Instituto Colombiano Agropecuario; FEDEPAPA; CIP.",
      },
      { id: "markets", dataCard: "markets",
        h2: "What are the major potato markets, processors, and prices in Colombia?",
        lead: "Colombia's domestic market absorbs the bulk of national production, with Bogotá's Corabastos wholesale market anchoring distribution. Per-capita consumption is approximately 42 kg/year. The chip-processing sector is well-developed; frozen french fry processing remains modest compared to North American or European peers (FEDEPAPA; DANE).",
        body: [
          'Corabastos in Bogotá is the country\'s largest food wholesale market and the dominant fresh-potato distribution hub — supplying not only Bogotá itself but redistributing to other major cities including Medellín, Cali, and Barranquilla. Provincial wholesale markets in the major production departments (Tunja, Pasto) handle regional distribution.',
          'Chip processors include Frito-Lay Colombia (PepsiCo) and domestic brands sourcing primarily from Diacol Capiro under contract production. The frozen french fry sector imports significant volumes from <Link href="/country/netherlands" style="color:#C62828;text-decoration:none">Netherlands</Link> and <Link href="/country/belgium" style="color:#C62828;text-decoration:none">Belgium</Link>; domestic frozen-fry production is limited compared to processing-volume peer countries. Read more in our <Link href="/knowledge/global-potato-trade" style="color:#C62828;text-decoration:none">global potato trade reference</Link>.',
        ],
        source: "Source: FEDEPAPA; DANE — National Administrative Department of Statistics; Corabastos market data; Colombian Customs trade statistics.",
      },
      { id: "schemes", dataCard: "schemes",
        h2: "What government support exists for Colombian potato farmers?",
        lead: "Colombian potato farmers receive support through Ministerio de Agricultura programmes (price-stabilisation interventions, smallholder credit lines via Finagro, certified-seed subsidies), AGROSAVIA breeding and extension services, and FEDEPAPA-organised collective marketing initiatives (Ministerio de Agricultura; FEDEPAPA; AGROSAVIA).",
        body: [
          'The Ministerio de Agricultura y Desarrollo Rural operates Programa de Apoyos al Almacenamiento de la Papa (potato storage support programmes) during glut periods to stabilise farmer prices. Finagro (Fondo para el Financiamiento del Sector Agropecuario) provides agricultural credit lines including dedicated smallholder-potato credit schemes. AGROSAVIA conducts no-cost breeding, extension, and disease-monitoring services.',
          'FEDEPAPA is the national producer federation — coordinating collective marketing, providing technical assistance, and representing producer interests in policy dialogue. Approximately 90,000 smallholder families nationally benefit from this combined institutional framework.',
        ],
        source: "Source: Ministerio de Agricultura y Desarrollo Rural; FEDEPAPA; AGROSAVIA; Finagro.",
      },
      { id: "climate", dataCard: "climate",
        h2: "What is the climate and soil profile for potato in Colombia?",
        lead: "Colombia's potato belt occupies tropical Andean highland zones at 2,000–3,500m elevation, where elevation-driven cool conditions enable potato cultivation despite the country's tropical latitude. Volcanic-derived soils predominate; rainfall is bimodal with wet seasons in March–May and September–November (FEDEPAPA; FAO Colombia).",
        body: [
          'Colombia\'s tropical-latitude location (4°N) is moderated by Andean elevation. At 2,500–3,500m, daytime temperatures are typically 12–20°C and nights drop to 5–10°C — within potato\'s tuberization optimum. The bimodal rainfall pattern (rather than unimodal) supports two production cycles per year in many regions.',
          'Volcanic-derived Andean soils (mostly Andisols) are inherently fertile with high organic-matter content, good water-holding capacity, and excellent drainage. Slopes are challenging — much of Colombia\'s potato cultivation occurs on 10–30% slopes that constrain mechanisation and elevate erosion risk. <Link href="/knowledge/climate-change-potatoes" style="color:#C62828;text-decoration:none">Read more on climate change and potatoes</Link>.',
        ],
        source: "Source: FAO Colombia; AGROSAVIA agroclimatic zoning; IDEAM — Instituto de Hidrología, Meteorología y Estudios Ambientales.",
      },
      { id: "calendar", dataCard: "calendar",
        h2: "When are potatoes planted and harvested in Colombia?",
        lead: "Colombia operates two main potato cycles per year aligned with the bimodal rainfall pattern: <strong>main crop</strong> (plant Mar–May, harvest Aug–Oct) and <strong>secondary crop</strong> (plant Sep–Nov, harvest Feb–Apr). Year-round supply availability results (FEDEPAPA; FAO Colombia).",
        quickFacts: [
          { label: "Main planting", value: "March – May" },
          { label: "Main harvest", value: "August – October" },
          { label: "Secondary planting", value: "September – November" },
          { label: "Secondary harvest", value: "February – April" },
        ],
        body: [
          'The double-cropping system aligned to bimodal rainfall is a defining structural feature of Colombian potato production — distinct from the single-season pattern of higher-latitude major producers. The continuous supply availability supports stable consumer prices (compared to single-season seasonal volatility) and supports the chip-processing sector\'s year-round contract-production model.',
          'Papa criolla\'s short dormancy period enables even faster cycling — some farmers plant 3+ cycles per year of papa criolla, partially offsetting the variety\'s lower yield potential through higher annual rotation frequency.',
        ],
        source: "Source: FEDEPAPA; AGROSAVIA agroclimatic zoning; FAO Colombia sowing-time guidance.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What are the major challenges facing Colombian potato farmers?",
        lead: "Colombian potato farmers face four primary constraints: smallholder economic viability under price volatility, slope-driven mechanisation constraints, climate-change pressure on Andean elevation distributions, and limited domestic frozen-fry processing depth (FEDEPAPA; FAO Colombia).",
        body: [
          'The smallholder structural reality (~90,000 farmers, average parcel below 5 hectares) creates ongoing economic pressure under price volatility. Government storage-support programmes and Finagro credit lines mitigate but do not resolve this. Slope-driven mechanisation constraints elevate labour costs relative to lowland-potato peer countries. Climate change is shifting elevation distributions — historically marginal higher-elevation cultivation zones are gaining viability while traditional lower-elevation zones face heat stress.',
          'Bright signals: AGROSAVIA breeding pipeline is robust; papa criolla cultural-export demand is growing; FEDEPAPA institutional framework is stable; bimodal-rainfall double-cropping provides supply-continuity advantages over single-season peers; chip-processing demand is growing.',
        ],
        source: "Source: FEDEPAPA; AGROSAVIA; FAO Colombia; Ministerio de Agricultura y Desarrollo Rural.",
      },
    ],
    sourceList: [
      "FAOSTAT 2023 — production, area, yield statistics for Colombia",
      "FEDEPAPA — Federación Colombiana de Productores de Papa",
      "AGROSAVIA — Corporación Colombiana de Investigación Agropecuaria",
      "ICA — Instituto Colombiano Agropecuario (seed regulation)",
      "DANE — Departamento Administrativo Nacional de Estadística (production statistics)",
      "Ministerio de Agricultura y Desarrollo Rural",
      "Finagro — Fondo para el Financiamiento del Sector Agropecuario",
      "FAO Colombia Country Office",
      "CIP — International Potato Center (Andean genetic resources)",
    ],
    faqItems: [
      { q: "How much potato does Colombia produce per year?", a: "Colombia produces approximately 3.86 million tonnes of potatoes annually per Colombian national agencies (DANE / FEDEPAPA), including papa criolla. FAOSTAT records 2.49M tonnes (2024) under the standardized 'Potatoes' item code, which treats papa criolla as a separate item. Both figures are correct under their respective accounting frameworks. Colombia is South America's third-largest producer after Peru (5.6M) and Brazil (4.2M)." },
      { q: "Which department produces the most potatoes in Colombia?", a: "Boyacá, Cundinamarca, and Nariño are the three dominant potato-producing departments. Together they account for the bulk of national production. Antioquia and Caldas add significant supplementary volumes." },
      { q: "What is papa criolla?", a: "Papa criolla (Solanum phureja) is a yellow-flesh diploid potato endemic to the Northern Andes. Its distinctive bright-yellow flesh, small egg-sized tubers (yema de huevo — egg yolk), short dormancy period, and unique sweet-buttery flavour profile make it a cultural and gastronomic icon in Colombia. It is central to ajiaco, Bogotá's national soup." },
      { q: "How many farmers grow potatoes in Colombia?", a: "Approximately 90,000 smallholder farming families across Boyacá, Cundinamarca, Nariño, and other Andean departments grow potatoes. Average parcel size is below 5 hectares, with many families operating 1–2 hectares with intensive labour input." },
      { q: "What variety of potato is grown in Colombia?", a: "Diacol Capiro (locally-bred by AGROSAVIA) is the dominant commercial variety, followed by Pastusa Suprema, Parda Pastusa, ICA-Única, and Suprema. Papa criolla (Solanum phureja) is the culturally-distinctive specialty variety with consistent premium pricing." },
      { q: "Where does Colombia get seed potatoes from?", a: "Colombia operates a domestic certified-seed system anchored by AGROSAVIA breeding and basic-seed multiplication, with commercial multipliers and farmer associations handling later-stage propagation. ICA regulates certified-seed standards. Smallholder seed-saving remains widespread alongside formal-system adoption." },
      { q: "When are potatoes planted in Colombia?", a: "Colombia operates two main planting cycles per year aligned with bimodal rainfall: main crop planted March–May (harvested August–October), and secondary crop planted September–November (harvested February–April). Year-round supply availability results." },
      { q: "What is the yield in Colombia?", a: "Colombian potato yield averages approximately 29.7 tonnes per hectare (FAOSTAT 2023) — competitive with global benchmarks despite slope-driven mechanisation constraints. Volcanic Andean soils and the bimodal-rainfall double-cropping pattern support this productivity level." },
    ],
    regionalContext: [
      { slug: "peru", note: "S.America #1 (5.6M); origin region" },
      { slug: "brazil", note: "S.America #2 (4.0M)" },
      { slug: "mexico", note: "Latin American peer" },
      { slug: "netherlands", note: "Frozen-fry import source" },
      { slug: "belgium", note: "Frozen-fry import source" },
      { slug: "united-states", note: "Papa criolla export market" },
    ],
    continueReading: [
      { href: "/knowledge/potato-varieties-guide", tag: "Varieties", title: "Potato Varieties Guide", desc: "Papa criolla and the Andean diploid potato heritage in global varietal context." },
      { href: "/blog/andean-potato-origin-story", tag: "History", title: "The Andean Potato Origin Story", desc: "How the Andes — including Colombia's highlands — domesticated the potato 7,000+ years ago." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "How Colombia balances AGROSAVIA-bred certified seed with widespread smallholder seed-saving." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Where Colombia fits — net importer of frozen fries; emerging papa criolla exporter." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Main page entry: dispatch ── */

export default async function CountryProfilePage({ params }) {
  const { slug } = await params;
  const c = COUNTRIES.find((x) => x.slug === slug);
  if (!c) notFound();

  if (slug === "india") {
    return <IndiaProfilePage c={c} />;
  }
  if (slug === "china") {
    return <ChinaProfilePage c={c} />;
  }
  if (slug === "belgium") {
    return <BelgiumProfilePage c={c} />;
  }
  if (slug === "netherlands") {
    return <NetherlandsProfilePage c={c} />;
  }
  if (slug === "united-states") {
    return <UnitedStatesProfilePage c={c} />;
  }
  if (slug === "kenya") {
    return <KenyaProfilePage c={c} />;
  }
  if (slug === "turkey") {
    return <TurkeyProfilePage c={c} />;
  }
  if (slug === "iran") {
    return <IranProfilePage c={c} />;
  }
  if (slug === "algeria") {
    return <AlgeriaProfilePage c={c} />;
  }
  if (slug === "uzbekistan") {
    return <UzbekistanProfilePage c={c} />;
  }
  if (slug === "colombia") {
    return <ColombiaProfilePage c={c} />;
  }

  return <StandardCountryPage c={c} slug={slug} />;
}
