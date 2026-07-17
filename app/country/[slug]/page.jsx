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
import { applyOgOverride } from "../../../lib/og-overrides";

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
    return applyOgOverride({
      title: "India Potato Industry: #2 Producer at 60M Tonnes",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/india" },
      openGraph: { title: "India Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "India Potato Industry", description: trim(desc) },
    }, "/country/india");
  }

  if (slug === "china") {
    const desc = "China is the world's #1 potato producer at 93.49M tonnes (FAOSTAT 2023) — 24.4% of global output. Inner Mongolia, Sichuan, Yunnan lead.";
    return applyOgOverride({
      title: "China Potato Industry: World's #1 Producer",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/china" },
      openGraph: { title: "China Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "China Potato Industry", description: trim(desc) },
    }, "/country/china");
  }

  if (slug === "belgium") {
    const desc = "Belgium produces 8.61M tonnes at 42 t/ha. World's #1 frozen french fry exporter at $4.6B — Clarebout, Agristo, Lutosa, Mydibel in West Flanders.";
    return applyOgOverride({
      title: "Belgium: World's #1 Frozen Fry Exporter ($4.6B)",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/belgium" },
      openGraph: { title: "Belgium Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "Belgium Potato Industry", description: trim(desc) },
    }, "/country/belgium");
  }

  if (slug === "netherlands") {
    const desc = "Netherlands produces 6.5M tonnes at 41 t/ha and exports 800,000 t of certified seed potatoes — 60%+ of global market. HZPC, Agrico, AVEBE.";
    return applyOgOverride({
      title: "Netherlands: World's #1 Seed Potato Exporter",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/netherlands" },
      openGraph: { title: "Netherlands Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "Netherlands Potato Industry", description: trim(desc) },
    }, "/country/netherlands");
  }

  if (slug === "united-states") {
    const desc = "The USA produces 19.96M tonnes at 51.4 t/ha — world's highest yield. Idaho 32%, Washington 23%. Lamb Weston, Simplot, McCain power the $5B industry.";
    return applyOgOverride({
      title: "United States Potato Industry: 19.96M Tonnes",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/united-states" },
      openGraph: { title: "United States Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "US Potato Industry", description: trim(desc) },
    }, "/country/united-states");
  }

  if (slug === "kenya") {
    const desc = "Kenya produces 2.31M tonnes — East Africa's #1 producer. Nyandarua leads at ~35%. Hosts the 13th World Potato Congress in Naivasha, Oct 26–30, 2026.";
    return applyOgOverride({
      title: "Kenya Potato Industry: WPC 2026 Host (2.31M Tonnes)",
      description: trim(desc),
      alternates: { canonical: "https://www.potatopedia.com/country/kenya" },
      openGraph: { title: "Kenya Potato Industry — Potatopedia", description: trim(desc), type: "article", images: ["/og-image.png"] },
      twitter: { card: "summary_large_image", title: "Kenya Potato Industry", description: trim(desc) },
    }, "/country/kenya");
  }

  // Standard country profile fallback — keep tight under 155 chars.
  const stdDesc = trim(`${c.name} produces ${c.prod} tonnes of potatoes annually (#${c.rank} globally). ${c.highlight}`);
  const stdTitle = `${c.name} Potato Industry: ${c.prod}t (#${c.rank})`;
  return applyOgOverride({
    title: stdTitle.length > 65 ? `${c.name} Potato Industry — ${c.prod}t` : stdTitle,
    description: stdDesc,
    alternates: { canonical: "https://www.potatopedia.com/country/" + slug },
    openGraph: { title: `${c.name} Potato Industry — Potatopedia`, description: stdDesc, type: "article", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: `${c.name} Potato Industry`, description: stdDesc },
  }, "/country/" + slug);
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
              Get data-backed answers from our 5,657 data-point knowledge base &mdash; pre-filtered for India.
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
              Get data-backed answers from our 5,657 data-point knowledge base &mdash; pre-filtered for China.
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
              Get data-backed answers from our 5,657 data-point knowledge base &mdash; pre-filtered for Belgium.
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
              Get data-backed answers from our 5,657 data-point knowledge base &mdash; pre-filtered for Netherlands.
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
              Get data-backed answers from our 5,657 data-point knowledge base &mdash; pre-filtered for the United States.
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
            <p style={sP}>For Kenya&apos;s potato sector, WPC 2026 is a structural opportunity. The visibility, investor attention, and government coordination that the congress concentrates on the Kenyan industry over a 12–18 month build-up has already begun to accelerate KALRO–CIP aeroponic seed expansion, NPCK farmer-cooperative organisation, and county-government investment in cold-chain and processing infrastructure. The post-congress legacy effect — well documented from prior WPC host economies — typically delivers 3–7 years of accelerated sector formalisation and investment. For broader event context see our <Link href="/knowledge/potato-expo-2026" style={linkRed}>Potato Expo 2026 article</Link> and <Link href="/blog/kenya-potato-boom-wpc-2026" style={linkRed}>Kenya potato boom &amp; WPC 2026 narrative</Link>.</p>
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
          'For broader event context see our <Link href="/knowledge/potato-expo-2026" style="color:#C62828;text-decoration:none">global potato events guide</Link>. Turkey\'s industry-event maturity is meaningfully higher than other Middle Eastern regional peers.',
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

/* ── Pakistan: full Country Intelligence Dossier (Tier 1, premium template) ── */
function PakistanProfilePage({ c }) {
  const data = {
    slug: "pakistan", name: "Pakistan", flag: c.flag, region: c.region,
    h1: "Pakistan Potato Industry: 186% Growth in a Decade &mdash; the Fastest-Growing Top-20 Producer (9.3&ndash;9.9M Tonnes, FY2024&ndash;25)",
    tagLabel: "Pakistan · Asia",
    readMin: 13,
    accentLabel: "Pakistan's potato production has nearly doubled in five years &mdash; from 4.55M tonnes (2019-20) to 9.3&ndash;9.9M tonnes (2024-25) &mdash; the fastest expansion among the world's top-20 producers. Punjab grows ~96% of it. The binding constraint isn't land or climate: it's that under 5% of planted seed is certified.",
    wikidata: "https://www.wikidata.org/wiki/Q843",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (FY2024-25)", value: "9.3–9.9M tonnes" },
      { label: "5-year growth (2019–25)", value: "~2x (doubled)" },
      { label: "Punjab share of output", value: "95–98%" },
      { label: "Global rank", value: "9th–11th (source-dependent)" },
      { label: "Certified seed use", value: "&lt;5% of planted area" },
      { label: "Exports (FY2024-25)", value: "~790,000 tonnes" },
    ],
    definitiveAnswer: '<strong>Pakistan produced an estimated 9.3–9.9 million tonnes of potatoes in FY2024–25</strong> &mdash; MNFSR’s Federal Committee on Agriculture put the figure at 9.3M tonnes (April 2025 communiqué), while a later official reading cited 9.9M tonnes, 44.7% above the FCA’s own 6.8M-tonne target. Either way, production has <strong>roughly doubled in five years</strong> from 4.55M tonnes in 2019-20 &mdash; the fastest growth rate among the world’s top-20 producers (FAOSTAT). <strong>Punjab Province grows 95–98% of the national crop</strong>, concentrated in Sahiwal, Sialkot, Okara, Lahore, Jhang, and Kasur districts. The growth story has a structural asterisk: <strong>less than 5% of planted seed is certified</strong> &mdash; MNFSR and FAO both identify this as the single biggest constraint on yield, ahead of water, climate, or land availability.',
    keyStats: [
      { value: "9.3–9.9M t", label: "FY2024-25 production" },
      { value: "+83.7%", label: "Area growth, 2019–23", accent: "#4CAF50" },
      { value: "95–98%", label: "Punjab's share of output" },
      { value: "<5%", label: "Certified seed use" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Pakistan's potato industry, and how fast is it growing?" },
      { id: "punjab", l: "Why does Punjab grow almost all of Pakistan's potatoes?" },
      { id: "calendar", l: "When are potatoes planted and harvested in Pakistan?" },
      { id: "varieties", l: "What potato varieties are grown in Pakistan?" },
      { id: "seed-system", l: "Why is seed quality Pakistan's biggest constraint?" },
      { id: "storage", l: "What happens to Pakistan's potatoes after harvest?" },
      { id: "processing", l: "How developed is Pakistan's potato processing industry?" },
      { id: "trade", l: "Where does Pakistan export its potatoes?" },
      { id: "outlook", l: "What does Pakistan's FY2025-26 outlook look like?" },
      { id: "history", l: "How did Pakistan go from a minor producer to a top-11 nation?" },
      { id: "challenges", l: "What are the biggest challenges facing Pakistan's potato sector?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Pakistan's potato industry, and how fast is it growing?",
        lead: "Pakistan's potato area grew <strong>83.7% between FY2019-20 and FY2022-23</strong> (185,379 to 340,577 hectares), with production up <strong>82.7%</strong> over the same window (4.55M to 8.32M tonnes) &mdash; one of the fastest potato-sector expansions recorded anywhere in the world in recent years (MNFSR).",
        quickFacts: [
          { label: "FY2019-20", value: "4.55M tonnes / 185,379 ha" },
          { label: "FY2022-23", value: "8.32M tonnes / 340,577 ha" },
          { label: "FY2024-25 (FCA, Apr 2025)", value: "9.3M tonnes / 370,000 ha" },
          { label: "FY2024-25 (later official reading)", value: "9.9M tonnes / 378,100 ha" },
        ],
        body: [
          "Pakistan has crossed 9 million tonnes of annual potato production, up from 4.5 million just five years earlier &mdash; a doubling in half a decade that MNFSR and FAO both describe as one of the fastest national potato-sector expansions in recent global history. The FY2024-25 figure carries two official readings that don't fully agree: the Federal Committee on Agriculture's own April 2025 communiqué states 9.3 million tonnes on 370,000 hectares, while a separate official tally puts the year at 9.9 million tonnes on 378,100 hectares &mdash; 44.7% above the FCA's own 6.8-million-tonne target for the year. We report both rather than force a false precision the underlying data doesn't support.",
          "Average national yield sits at roughly 24&ndash;26 tonnes per hectare &mdash; respectable, but well short of the Netherlands (~46 t/ha) or the United States (~51 t/ha). Potato is now Pakistan's <strong>4th largest crop by volume</strong>, behind only wheat, rice, and sugarcane.",
        ],
        source: "Source: MNFSR (Ministry of National Food Security & Research), Fruit, Vegetables and Condiments Statistics of Pakistan 2022-23; MNFSR Federal Committee on Agriculture (FCA) Meeting Communiqué, 24 April 2025; TDAP.",
      },
      { id: "punjab", dataCard: "regions",
        h2: "Why does Punjab grow almost all of Pakistan's potatoes?",
        lead: "<strong>Punjab Province accounts for 95.9% of national potato area and 97.8% of production</strong> (2022-23 data) &mdash; a concentration matched by almost no other major producing country. The FY2024-25 reading puts Punjab even higher, at 95% of a larger national total: 9.81 million tonnes on 373,000 hectares.",
        table: {
          headers: ["Province", "Area (2022-23)", "Production (2022-23)", "Share of national output"],
          rows: [
            ["Punjab", "326,980 ha", "8,136,051 t", "97.8%"],
            ["Khyber Pakhtunkhwa (KPK)", "11,529 ha", "163,443 t", "~2.0%"],
            ["Balochistan", "1,713 ha", "17,016 t", "~0.2%"],
            ["Sindh", "355 ha", "3,257 t", "&lt;0.1%"],
          ],
        },
        body: [
          "Punjab's dominance has actually deepened over time: its planted area nearly doubled from 172,389 hectares in 2019-20 to 326,980 hectares in 2022-23, and its yield kept climbing too &mdash; 25,341 kg/ha rising to 26,308 kg/ha by FY2024-25. Within Punjab, cultivation concentrates in a specific district cluster: <strong>Sahiwal, Sialkot, Okara, Lahore, Jhang, Kasur, and Chiniot</strong>.",
          "Khyber Pakhtunkhwa is a distant second and Balochistan grows a smaller, spring-season crop; Sindh's contribution is now negligible &mdash; its planted area actually shrank across 2018-23 while every other province expanded. This extreme geographic concentration is efficient (clustered infrastructure, established buyer relationships, irrigation from the Indus basin) but it's also a systemic risk: a Punjab-wide weather event, water shortage, or disease outbreak has near-national consequences for the crop.",
        ],
        source: "Source: MNFSR, Table Nos. 7-10, Provincial Crop Reporting Service Centres; MNFSR FCA / TDAP FY2024-25 update.",
      },
      { id: "calendar", dataCard: "calendar",
        h2: "When are potatoes planted and harvested in Pakistan?",
        lead: "Pakistan runs <strong>two growing seasons</strong>: an autumn crop (planted September&ndash;October, harvested January&ndash;February) that Punjab dominates, and a spring crop (planted January&ndash;February, harvested April&ndash;May) more common in Balochistan and Khyber Pakhtunkhwa.",
        quickFacts: [
          { label: "Autumn planting", value: "September – October" },
          { label: "Autumn harvest", value: "January – February" },
          { label: "Spring planting", value: "January – February" },
          { label: "Spring harvest", value: "April – May" },
        ],
        body: [
          "The dual-season system gives Pakistan some supply continuity across the year, though the autumn crop &mdash; concentrated in Punjab &mdash; carries the overwhelming majority of national volume. This seasonal split, combined with a persistent cold-storage shortfall (see below), is a major driver of the price volatility between harvests that Pakistani growers describe as one of their biggest planning headaches.",
        ],
        source: "Source: MNFSR provincial crop calendars; FAO Pakistan.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Pakistan?",
        lead: "Variety dominance estimates have shifted between reporting cycles: older MNFSR/FAOSTAT profiles named <strong>Diamant</strong> (Netherlands) or <strong>Desiree</strong> as Pakistan's most widely grown variety, but the most recent TDAP-linked export data corrects that assumption &mdash; naming <strong>Sante</strong> as the most widely grown variety nationally.",
        table: {
          headers: ["Variety", "Origin", "Primary role"],
          rows: [
            ["Sante", "Netherlands", "Most widely grown (2024-25 data)"],
            ["Diamant", "Netherlands", "Widely planted; fresh market"],
            ["Desiree", "Netherlands", "Widely grown; earlier data's top variety"],
            ["Cardinal", "Netherlands", "Popular red-skinned variety"],
            ["Kuroda", "&mdash;", "Popular in Sindh Province"],
            ["Lady Rosetta, Hermes, Asterix", "Netherlands", "Processing (high dry matter, low sugar)"],
            ["Mozika, Ismi, Vogue, Esmee, Rudolph", "&mdash;", "Fresh-market / export varieties"],
            ["FD varieties", "Pakistan (local selections)", "Domestic selections"],
          ],
        },
        body: [
          "This isn't a contradiction so much as a genuine data gap in how Pakistan's variety mix has historically been tracked &mdash; we report both the older and newer readings rather than pick one and discard the other. What's consistent across every source: Pakistan's commercial variety base is almost entirely Dutch-bred (Sante, Diamant, Desiree, Cardinal, Lady Rosetta, Hermes, Asterix), with Kuroda notable in Sindh and a small set of domestically selected FD varieties rounding out the portfolio.",
        ],
        source: "Source: MNFSR; FAOSTAT country profile; TDAP export-variety data (MNFSR FCA / TDAP FY2024-25 update).",
      },
      { id: "seed-system", dataCard: "seed-system",
        h2: "Why is seed quality Pakistan's biggest constraint?",
        lead: "According to the FAO Hand-in-Hand Investment Forum 2024, <strong>certified seed covers less than 5% of Pakistan's potato planting requirement</strong> &mdash; over 95% of farmers plant farm-saved seed of unknown health and varietal purity, at a certified-seed cost of roughly <strong>USD 888 per hectare</strong> that FAO says makes certified seed unviable for most smallholders.",
        callout: { number: "<5%", context: "of Pakistan's potato seed is certified. FAO projects that resolving this single constraint alone could push national production to 12–15 million tonnes — a 30–60% increase without expanding cultivated area at all.", source: "FAO Hand-in-Hand Investment Forum 2024" },
        body: [
          "The mechanics of the problem: certified seed imported from the Netherlands (mainly Diamant and Cardinal) is expensive and covers only a small share of national demand, so the overwhelming majority of growers replant farm-saved tubers season after season. That practice compounds virus buildup and seed degeneration over successive generations, which FAO identifies as a major drag on realized yield relative to each variety's genetic potential. Pakistan has no domestic tissue-culture laboratories operating at meaningful scale &mdash; FAO's explicit recommendation is new tissue-culture facilities in both the public and private sector to start building a domestic clean-seed supply chain.",
        ],
        source: "Source: FAO Hand-in-Hand Investment Forum 2024; MNFSR seed-system assessment.",
      },
      { id: "storage", dataCard: "storage",
        h2: "What happens to Pakistan's potatoes after harvest?",
        lead: "Punjab has <strong>800+ dedicated potato cold-storage facilities with combined capacity exceeding 3.5 million tonnes</strong> &mdash; yet <strong>only about 15% of the harvested crop actually reaches proper cold storage</strong>, and post-harvest losses run 25&ndash;30%.",
        body: [
          "That gap between built capacity and actual utilization points to a distribution and access problem as much as an infrastructure one &mdash; storage exists at meaningful scale in Punjab specifically, but getting the crop from a huge number of smallholder autumn harvests into that storage network within the narrow post-harvest window is the practical bottleneck. The consequence shows up directly in farmer economics: with 85% of the crop bypassing cold storage, Pakistan sees the same immediate post-harvest price collapse and volatility that under-stored producing countries commonly report, since a compressed harvest window forces a large share of supply onto the market at once.",
        ],
        source: "Source: MNFSR FCA / TDAP FY2024-25 update; FAO Pakistan.",
      },
      { id: "processing", dataCard: "processing",
        h2: "How developed is Pakistan's potato processing industry?",
        lead: "Processing accounts for roughly <strong>10% of Pakistan's total potato production</strong> and is growing. <strong>Lays (PepsiCo)</strong> has a significant established presence, and local chip and snack brands are expanding alongside it.",
        body: [
          "A 10% processing share leaves Pakistan with substantial untapped potential relative to countries like the United States (60%+) or Germany (70&ndash;80%) &mdash; especially notable given Pakistan's production scale now rivals mid-sized European producers. The constraint isn't raw material supply; production growth has comfortably outpaced processing-sector investment. It's processing capacity, cold-chain linkage to feed a plant reliably, and contract-farming frameworks that guarantee processors the specific low-sugar, high-dry-matter varieties (Lady Rosetta, Hermes, Asterix) their lines need.",
        ],
        source: "Source: MNFSR; FAOSTAT country profile.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Where does Pakistan export its potatoes?",
        lead: "Pakistan exported approximately <strong>790,000 tonnes of potatoes in FY2024-25</strong>, worth roughly <strong>USD 190 million</strong> (TDAP) &mdash; potato is Pakistan's largest vegetable export by volume. <strong>Afghanistan and the CIS countries together account for roughly half of all exports.</strong>",
        table: {
          headers: ["Market", "Status", "Notes"],
          rows: [
            ["Afghanistan", "Established, largest", "Land-border trade; part of the ~50% CIS+Afghanistan share"],
            ["Sri Lanka, UAE, Malaysia", "Established", "Core Middle East / South Asia demand"],
            ["Saudi Arabia, Oman, Qatar, Kuwait", "Established", "Gulf markets"],
            ["Kazakhstan, Uzbekistan, Tajikistan, Turkmenistan, Russia", "Growing (Central Asia)", "Kazakhstan alone: 50,000t deal worth ~$25M"],
          ],
        },
        body: [
          "Export prices run roughly USD 180&ndash;190 per tonne for fresh potatoes. Central Asia is the clearest growth frontier &mdash; the Kazakhstan deal (50,000 tonnes, ~$25 million) signals Pakistan actively displacing or supplementing other suppliers in that corridor. But the export trend isn't friction-free: exporters report grading inconsistencies in shipments, rising freight costs, and direct competition from China and Egypt in several of the same regional markets. TDAP is among the institutions working to improve export positioning, but the sector remains predominantly oriented toward domestic fresh consumption rather than export or processing.",
        ],
        source: "Source: TDAP (Trade Development Authority of Pakistan); MNFSR FCA / TDAP FY2024-25 update.",
      },
      { id: "outlook", dataCard: "outlook",
        h2: "What does Pakistan's FY2025-26 outlook look like?",
        lead: "The Federal Committee on Agriculture's FY2025-26 target is <strong>8.92 million tonnes across 349,400 hectares</strong> &mdash; notably below the FY2024-25 outturn, reflecting planned normalization after a record year rather than a growth target.",
        table: {
          headers: ["Province", "FY2025-26 target"],
          rows: [
            ["Punjab", "8.84 million tonnes"],
            ["Balochistan", "34,100 tonnes"],
            ["Khyber Pakhtunkhwa", "35,000 tonnes"],
            ["Sindh", "7,500 tonnes"],
          ],
        },
        source: "Source: MNFSR Federal Committee on Agriculture (FCA), FY2025-26 targets.",
      },
      { id: "history", dataCard: "history",
        h2: "How did Pakistan go from a minor producer to a top-11 nation?",
        lead: "At independence in 1947, Pakistan grew potatoes on <strong>under 3,000 hectares, producing under 30,000 tonnes</strong> &mdash; a rounding error by today's standards. Growth accelerated from the 1980s onward through irrigation expansion on the Indus River basin, then sharply again after 2019.",
        body: [
          "The recent trajectory: 5.8 million tonnes (FY2021) &rarr; 7.9 million tonnes (FY2022, a 35% single-year jump) &rarr; 8.32 million tonnes (FY2023) &rarr; 9.3&ndash;9.9 million tonnes (FY2024-25, record). FAO's 2023 ranking places Pakistan 9th globally; other official readings place it 11th depending on the reference year and dataset &mdash; either way, a firmly top-tier global producer today, having overtaken Belgium, Canada, Japan, and the United Kingdom in total tonnage.",
        ],
        source: "Source: MNFSR historical series; FAOSTAT; FAO global rankings.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What are the biggest challenges facing Pakistan's potato sector?",
        lead: "Six constraints recur across every official assessment of Pakistan's potato sector: certified-seed scarcity, cold-storage under-utilization, water/irrigation dependence, inter-season price volatility, export grading inconsistencies, and rising competition from China and Egypt in shared export markets.",
        body: [
          "The productivity gap is the clearest opportunity in the data: with certified seed below 5% and yields at 24&ndash;26 t/ha against a biological potential well above 40 t/ha for well-managed Dutch varieties, Pakistan has more identifiable, addressable upside than almost any comparably sized producer &mdash; FAO's own estimate is that fixing the seed-supply constraint alone could push national output to 12&ndash;15 million tonnes. The broader pattern across production scale, processing depth, cold-chain utilization, and export infrastructure is a structural mismatch: Pakistan now produces at a scale comparable to Germany or France, while its supporting systems remain far less developed &mdash; simultaneously its biggest risk and its most compelling growth case.",
        ],
        source: "Source: MNFSR; FAO Hand-in-Hand Investment Forum 2024; TDAP.",
      },
    ],
    sourceList: [
      "MNFSR (Ministry of National Food Security & Research), Government of Pakistan — Fruit, Vegetables and Condiments Statistics of Pakistan 2022-23",
      "MNFSR — Federal Committee on Agriculture (FCA) Meeting Communiqué, 24 April 2025",
      "FAO — Hand-in-Hand Investment Forum 2024: Pakistan",
      "TDAP (Trade Development Authority of Pakistan) — export volume, value, and market data",
      "FAOSTAT — production, area, yield time series and global rankings",
    ],
    faqItems: [
      { q: "How much potato does Pakistan produce per year?", a: "Pakistan produced an estimated 9.3–9.9 million tonnes of potatoes in FY2024-25, depending on which official reading you use (MNFSR FCA communiqué vs. a later official tally). That's roughly double the 4.55 million tonnes produced just five years earlier, in 2019-20." },
      { q: "Which province produces the most potatoes in Pakistan?", a: "Punjab Province, which grows 95–98% of Pakistan's national potato output, concentrated in Sahiwal, Sialkot, Okara, Lahore, Jhang, Kasur, and Chiniot districts." },
      { q: "What is Pakistan's global rank in potato production?", a: "Pakistan ranks 9th to 11th globally depending on the source and reference year (FAO 2023 data ranks it 9th), making it a firmly top-tier global producer — ahead of Belgium, Canada, Japan, and the United Kingdom." },
      { q: "Why is Pakistan's potato production growing so fast?", a: "Production nearly doubled between 2019-20 and 2024-25, driven primarily by a sharp expansion in Punjab's cultivated area (up 83.7% from 2019-20 to 2022-23) rather than yield gains — average yield has stayed roughly flat at 24–26 t/ha across the growth period." },
      { q: "What is the biggest constraint on Pakistan's potato industry?", a: "Certified seed. Less than 5% of Pakistan's planted potato area uses certified seed (FAO), with over 95% of farmers replanting farm-saved tubers. FAO estimates that fixing this single constraint could push national production to 12–15 million tonnes without expanding cultivated area." },
      { q: "Does Pakistan export potatoes?", a: "Yes — approximately 790,000 tonnes in FY2024-25, worth roughly USD 190 million (TDAP), making potato Pakistan's largest vegetable export by volume. Afghanistan and the CIS countries (Kazakhstan, Uzbekistan, Tajikistan, Turkmenistan, Russia) together account for roughly half of exports, alongside established Gulf and South/Southeast Asian markets." },
      { q: "What potato varieties are grown in Pakistan?", a: "Predominantly Dutch-bred varieties: Sante (most widely grown per the latest 2024-25 data), Diamant, Desiree, Cardinal, and processing varieties Lady Rosetta, Hermes, and Asterix. Kuroda is notable in Sindh Province, alongside a small set of domestically selected FD varieties." },
      { q: "How much of Pakistan's potato crop goes to cold storage?", a: "Only about 15% of the harvested crop reaches proper cold storage, despite Punjab having 800+ dedicated facilities with combined capacity exceeding 3.5 million tonnes — a distribution and access gap, not a lack of built infrastructure. Post-harvest losses run 25–30%." },
    ],
    regionalContext: [
      { slug: "india", note: "South Asia's largest producer (56.2M)" },
      { slug: "bangladesh", note: "South Asia peer, storage-crisis parallel" },
      { slug: "china", note: "Export-market competitor" },
      { slug: "uzbekistan", note: "Seasonal import destination for Pakistani potatoes" },
      { slug: "iran", note: "Regional peer (2.92M)" },
      { slug: "turkey", note: "Mediterranean / ME #1 (6.90M)" },
    ],
    continueReading: [
      { href: "/blog/pakistan-potato-explosion", tag: "Analysis", title: "Why Pakistan's Potato Production Grew 186% in 10 Years", desc: "The story-format deep dive behind the numbers on this page." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "Why certified seed access is the single biggest lever on Pakistan's yield." },
      { href: "/knowledge/potato-storage-cold-chain", tag: "Storage", title: "Potato Cold Storage", desc: "Why built capacity and actual utilization diverge so sharply in Pakistan." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Where Pakistan fits — a fast-growing exporter facing competition from China and Egypt." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Bangladesh: full Country Intelligence Dossier (Tier 1, premium template) ── */
function BangladeshProfilePage({ c }) {
  const data = {
    slug: "bangladesh", name: "Bangladesh", flag: c.flag, region: c.region,
    h1: "Bangladesh Potato Industry: 7th-Largest Producer, Now Fighting a Structural Surplus (11&ndash;13M Tonnes)",
    tagLabel: "Bangladesh · Asia",
    readMin: 12,
    accentLabel: "Bangladesh grows more potatoes than it can profitably sell &mdash; a 3&ndash;4 million tonne annual surplus against a 3&ndash;4 million tonne cold-storage shortfall crashed farmgate prices below production cost in 2024-25. The country exports less than 1% of what it grows.",
    wikidata: "https://www.wikidata.org/wiki/Q902",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (FY2024-25)", value: "11.57M tonnes (DAE)" },
      { label: "Global rank", value: "6th–7th largest producer" },
      { label: "Domestic demand", value: "7–9M tonnes" },
      { label: "Surplus (FY2024-25)", value: "3–4M tonnes" },
      { label: "Cold storage capacity", value: "3–6M tonnes (350–400 facilities)" },
      { label: "Exports", value: "&lt;1% of production" },
    ],
    definitiveAnswer: '<strong>Bangladesh produced 11.57 million tonnes of potatoes in FY2024-25 (DAE)</strong> &mdash; other readings put the 2024 calendar year as high as 13 million tonnes (BCSA estimate) &mdash; making it the world\'s <strong>6th-to-7th largest producer</strong>. But production has outpaced demand: domestic consumption is only 7&ndash;9 million tonnes, leaving a <strong>structural surplus of 3&ndash;4 million tonnes</strong> that collided with a cold-storage shortfall (350&ndash;400 facilities holding just 3&ndash;6 million tonnes) in 2024-25, crashing farmgate prices to Tk 7&ndash;10/kg &mdash; below the estimated Tk 14/kg production cost. <strong>Rangpur Division alone grows roughly a quarter of the national crop</strong>, and Bangladesh exports less than 1% of what it produces, primarily to Malaysia, Nepal, and Sri Lanka.',
    keyStats: [
      { value: "11.57M t", label: "FY2024-25 production (DAE)" },
      { value: "3–4M t", label: "FY2024-25 surplus" },
      { value: "Tk 7–10/kg", label: "2024-25 farmgate price crash" },
      { value: "<1%", label: "Share of crop exported" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Bangladesh's potato industry?" },
      { id: "surplus-crisis", l: "Why did Bangladesh's potato prices crash in 2024-25?" },
      { id: "regions", l: "Which regions produce the most potatoes in Bangladesh?" },
      { id: "calendar", l: "When is Bangladesh's potato season?" },
      { id: "varieties", l: "What potato varieties are grown in Bangladesh?" },
      { id: "seed-system", l: "Where does Bangladesh get its seed potatoes?" },
      { id: "storage", l: "How big is Bangladesh's cold-storage gap?" },
      { id: "trade", l: "Where does Bangladesh export its potatoes?" },
      { id: "institutions", l: "Which institutions run Bangladesh's potato sector?" },
      { id: "challenges", l: "What are Bangladesh's biggest potato-sector challenges?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Bangladesh's potato industry?",
        lead: "Bangladesh produced <strong>11.57 million tonnes in FY2024-25</strong> (DAE), or as much as <strong>13 million tonnes</strong> on a 2024 calendar-year basis (BCSA estimate) &mdash; on a cultivated area of roughly 495,000&ndash;524,000 hectares, up 15% year-on-year. That makes Bangladesh the world's <strong>6th-to-7th largest potato producer</strong>, and potato is the country's single most important Rabi (winter) crop.",
        quickFacts: [
          { label: "FY2014-15 production", value: "9.25M tonnes" },
          { label: "FY2015-16 production", value: "9.47M tonnes" },
          { label: "FY2024-25 production", value: "11.57M tonnes (DAE)" },
          { label: "2024 calendar year", value: "13M tonnes (BCSA est.)" },
        ],
        body: [
          "Yield has climbed steadily &mdash; from 19.6 t/ha in FY2014-15 to nearly 23 t/ha a decade later &mdash; but the defining fact of Bangladesh's potato economy right now isn't production growth, it's the gap between what the country grows and what it can actually sell or store. High-Yielding Varieties (HYV) account for over 91% of national output; local varieties make up the rest.",
        ],
        source: "Source: BBS (Bangladesh Bureau of Statistics) Agriculture Wing; DAE (Department of Agricultural Extension); BCSA (Bangladesh Cold Storage Association).",
      },
      { id: "surplus-crisis", dataCard: "crisis",
        h2: "Why did Bangladesh's potato prices crash in 2024-25?",
        lead: "Domestic demand is only <strong>7&ndash;9 million tonnes</strong> (BARI/BBS) against production of 11&ndash;13 million tonnes &mdash; a structural <strong>3&ndash;4 million tonne annual surplus</strong>. In 2024-25, farmgate prices crashed to <strong>Tk 7&ndash;10/kg, below the estimated Tk 14/kg production cost</strong>.",
        callout: { number: "Tk 7–10", context: "per kg farmgate price in the 2024-25 crash — below the DAE-estimated Tk 14/kg production cost, and also below the USD 0.22/kg cold-storage cost that BCSA proposed as a minimum gate price. Without price support, BCSA warns farmers may cut potato planting in 2026.", source: "DAE; BCSA" },
        body: [
          "The mechanics are straightforward: production has grown faster than either domestic consumption or storage/export capacity can absorb. Around 1.2 million tonnes remained in cold storage with only months to sell, and BCSA estimated 20&ndash;30% of stored stock was at risk of going unsold without price intervention &mdash; with roughly 8 million tonnes overall at risk of spoilage due to inadequate storage across the season.",
        ],
        source: "Source: BCSA (Bangladesh Cold Storage Association); DAE; Ministry of Agriculture Bangladesh.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which regions produce the most potatoes in Bangladesh?",
        lead: "<strong>Rangpur and Rajshahi Divisions together hold 71% of national potato area</strong> and Rangpur alone contributes roughly a quarter of national output. Munshiganj district (under Dhaka Division) is the single highest-yielding district in the country.",
        table: {
          headers: ["Division", "Area (ha)", "Production (t)", "Yield (t/ha)"],
          rows: [
            ["Rangpur", "180,423", "3,407,606", "18.9"],
            ["Rajshahi", "157,879", "3,059,845", "19.4"],
            ["Dhaka", "57,480", "1,584,814", "27.6"],
            ["Chittagong", "36,119", "683,110", "18.9"],
            ["Mymensingh", "14,886", "217,149", "14.6"],
            ["Khulna", "14,444", "289,415", "20.0"],
            ["Barisal", "8,992", "173,008", "19.2"],
            ["Sylhet", "5,265", "59,151", "11.2"],
          ],
        },
        body: [
          "Dhaka Division's high average yield is driven almost entirely by one district: <strong>Munshiganj</strong>, which produced 1.24 million tonnes from 38,205 hectares at 32.5 t/ha &mdash; the highest yield of any district in Bangladesh, and a historic potato-growing area located near the capital. Sylhet, by contrast, has the lowest yield in the country at 11.2 t/ha.",
        ],
        source: "Source: BBS, Estimates of Potato 2015-16, Agriculture Wing.",
      },
      { id: "calendar", dataCard: "calendar",
        h2: "When is Bangladesh's potato season?",
        lead: "Bangladesh runs a <strong>single annual crop</strong> &mdash; the Rabi (winter) season, planted <strong>October&ndash;November</strong> and harvested <strong>February&ndash;March</strong>. Unlike Egypt's four overlapping seasons, there is no second Bangladeshi potato season.",
        quickFacts: [
          { label: "Season", value: "Rabi (winter), single crop" },
          { label: "Planting", value: "October – November" },
          { label: "Harvest", value: "February – March" },
        ],
        body: [
          "Compressing the entire national harvest into a single narrow window is a major structural driver of Bangladesh's storage and pricing problems: the whole year's supply hits the market and storage system within a few months, with nothing to smooth it out until the next October planting.",
        ],
        source: "Source: FAO Bangladesh Country Office; BARI; DAE.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Bangladesh?",
        lead: "<strong>Diamant</strong> (Netherlands) is the single most widely grown variety, imported alongside Cardinal, Granola, and Asterix. BARI (Bangladesh Agricultural Research Institute) has developed <strong>106 varieties in total</strong>, but only <strong>14 are officially recognised as meeting export standards</strong> &mdash; and in practice, just 8&ndash;10 varieties are actually shipped abroad.",
        table: {
          headers: ["Variety", "Origin", "Role"],
          rows: [
            ["Diamant", "Netherlands", "Most widely grown; dominant import"],
            ["Cardinal", "Netherlands", "Red-skinned, popular fresh market"],
            ["Granola", "Netherlands", "Widely consumed fresh; key export variety"],
            ["Asterix", "Netherlands", "Used for processing"],
            ["Courage", "&mdash;", "Newer high-yielding variety; exported"],
            ["Sunshine", "Bangladesh (BARI)", "Bred specifically for export markets"],
            ["BARI Alu varieties", "Bangladesh (BARI)", "Locally bred, part of the 106-variety portfolio"],
          ],
        },
        body: [
          "BADC and private firms have introduced 94 additional non-notified varieties on top of BARI's 106, but only 5 of those are considered exportable &mdash; a regulatory bottleneck that keeps Bangladesh's actual export-variety base narrow even though its total varietal portfolio is large. BARI specifically bred <strong>Sunshine</strong> for overseas markets as part of a deliberate export-development push.",
        ],
        source: "Source: BARI (Bangladesh Agricultural Research Institute); DAE; Ministry of Agriculture Bangladesh.",
      },
      { id: "seed-system", dataCard: "seed-system",
        h2: "Where does Bangladesh get its seed potatoes?",
        lead: "Bangladesh imports seed primarily from the <strong>Netherlands and India</strong>, with Diamant the dominant imported variety. Only about <strong>20% of farmers use certified seed</strong> &mdash; the rest rely on farm-saved seed, affecting yield consistency and disease management.",
        body: [
          "India is Bangladesh's #1 source for imported seed potatoes specifically (as distinct from India also being a destination market for Bangladeshi table potato exports in some years). BARI's breeding program is the main domestic counterweight to import dependence, but certified-seed adoption remains low nationally.",
        ],
        source: "Source: FAO Bangladesh Country Office; BARI.",
      },
      { id: "storage", dataCard: "storage",
        h2: "How big is Bangladesh's cold-storage gap?",
        lead: "Bangladesh has approximately <strong>350&ndash;400 cold-storage facilities with 3&ndash;6 million tonnes of combined capacity</strong> &mdash; against production of 11&ndash;13 million tonnes, a structural gap of roughly 4&ndash;5 million tonnes that almost all falls on the private sector to solve.",
        body: [
          "Almost all cold storage is privately owned, with limited government facilities. FAO Bangladesh identifies limited cold-storage capacity as one of the most critical structural constraints across the entire value chain &mdash; and it's the direct mechanical cause of the 2024-25 price crash: with nowhere to put a 3&ndash;4 million tonne surplus, prices had nowhere to go but down.",
        ],
        source: "Source: BCSA (Bangladesh Cold Storage Association); FAO Bangladesh Country Office.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Where does Bangladesh export its potatoes?",
        lead: "Bangladesh exports less than 1% of its production. <strong>Malaysia takes more than a third of exports</strong> (the largest single market), with Nepal and Sri Lanka each taking roughly a fifth.",
        table: {
          headers: ["Market", "Approx. share", "Notes"],
          rows: [
            ["Malaysia", "&gt;33%", "Largest single export market"],
            ["Nepal", "~20%", "Also a growing frozen-fry destination for India"],
            ["Sri Lanka", "~20%", "Established market"],
            ["Myanmar, Singapore, UAE, Brunei, Qatar, Bahrain, Kuwait, Oman, Jordan, Lebanon", "Remainder", "Smaller, diversified Gulf + Southeast Asia demand"],
          ],
        },
        body: [
          "Officials from the Ministry of Agriculture are actively pursuing Russia, Fiji, and Vietnam as new export markets &mdash; part of a deliberate push to turn some of the structural surplus into export revenue rather than domestic price collapse. FAO's <strong>\"Missing Middle Initiative\"</strong> (funded by the Global Agriculture and Food Security Program) links Rangpur smallholders directly with exporters through the Bangladesh Potato Exporters' Association (BPEA).",
        ],
        source: "Source: FAO Bangladesh Country Office; Ministry of Agriculture Bangladesh.",
      },
      { id: "institutions", dataCard: "institutions",
        h2: "Which institutions run Bangladesh's potato sector?",
        lead: "Five institutions anchor the sector: the <strong>Ministry of Agriculture</strong> (policy), <strong>DAE</strong> (extension services), <strong>BADC</strong> (seed multiplication), <strong>BARI</strong> (variety research), and <strong>BBS Agriculture Wing</strong> (official statistics).",
        body: [
          "Bangladesh has run export-oriented potato production support since 2019 in partnership with FAO, and the sector's structural problems &mdash; storage, phytosanitary standards, market linkages, post-harvest handling &mdash; are consistently named by FAO as the levers that would let more of the current surplus become export revenue instead of a farmgate price collapse.",
        ],
        source: "Source: FAO Bangladesh Country Office; Ministry of Agriculture Bangladesh; BARI.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What are Bangladesh's biggest potato-sector challenges?",
        lead: "Four structural constraints recur across every official assessment: <strong>limited cold-storage capacity</strong>, <strong>absence of standard phytosanitary laboratories</strong> (a barrier to more export markets), <strong>gaps in market linkages</strong> between farmers and exporters, and the need for <strong>improved post-harvest handling</strong>.",
        body: [
          "Unlike most major producers, Bangladesh's core problem isn't growing enough potatoes &mdash; it's that production, storage, and export-market development haven't grown in step with each other. The 2024-25 price crash is the clearest possible illustration: a country that's a top-7 global producer, still exporting under 1% of its crop and watching farmgate prices fall below the cost of production.",
        ],
        source: "Source: FAO Bangladesh Country Office; BCSA; DAE.",
      },
    ],
    sourceList: [
      "BBS (Bangladesh Bureau of Statistics), Agriculture Wing — official production and area statistics",
      "DAE (Department of Agricultural Extension) — FY2024-25 production data and export targeting",
      "BARI (Bangladesh Agricultural Research Institute) — variety development and breeding",
      "BCSA (Bangladesh Cold Storage Association) — storage capacity and 2024-25 price-crisis data",
      "FAO Bangladesh Country Office — structural constraints and export-development programs",
      "Ministry of Agriculture Bangladesh — policy and new export-market development",
    ],
    faqItems: [
      { q: "How much potato does Bangladesh produce per year?", a: "Bangladesh produced 11.57 million tonnes in FY2024-25 (DAE), with a separate 2024 calendar-year estimate as high as 13 million tonnes (BCSA) — making it the world's 6th-to-7th largest potato producer." },
      { q: "Why did potato prices crash in Bangladesh in 2024-25?", a: "Production (11–13 million tonnes) far outpaced both domestic demand (7–9 million tonnes) and cold-storage capacity (3–6 million tonnes across 350–400 facilities), creating a 3–4 million tonne structural surplus. Farmgate prices fell to Tk 7–10/kg, below the estimated Tk 14/kg cost of production." },
      { q: "Which region produces the most potatoes in Bangladesh?", a: "Rangpur Division, which together with Rajshahi Division holds 71% of national potato area. Rangpur alone contributes roughly a quarter of national output. Munshiganj district (Dhaka Division) has the country's highest yield at 32.5 t/ha." },
      { q: "Does Bangladesh export potatoes?", a: "Yes, but a very small share — less than 1% of production. Malaysia is the largest market (over a third of exports), followed by Nepal and Sri Lanka (roughly a fifth each), with smaller volumes to Myanmar, Singapore, and several Gulf states." },
      { q: "What potato variety is most grown in Bangladesh?", a: "Diamant, a Dutch-bred variety, is the single most widely grown potato in Bangladesh, alongside Cardinal, Granola, and Asterix. High-Yielding Varieties overall account for over 91% of national production." },
      { q: "How much cold storage does Bangladesh have for potatoes?", a: "Approximately 350–400 cold-storage facilities with combined capacity of 3–6 million tonnes — almost entirely privately owned — against production of 11–13 million tonnes, leaving a structural storage gap of 4–5 million tonnes." },
    ],
    regionalContext: [
      { slug: "india", note: "Seed-potato import source" },
      { slug: "pakistan", note: "South Asia peer, opposite trade position" },
      { slug: "nepal", note: "Export market for Bangladeshi potatoes" },
      { slug: "china", note: "Asia's #1 producer" },
      { slug: "indonesia", note: "Asia import-dependent peer" },
    ],
    continueReading: [
      { href: "/blog/bangladesh-8th-producer-nobody-knows", tag: "Analysis", title: "Bangladesh: The 8th-Largest Producer Nobody Knows About", desc: "The story-format deep dive on Bangladesh's outsized, under-the-radar potato industry." },
      { href: "/knowledge/potato-storage-cold-chain", tag: "Storage", title: "Potato Cold Storage", desc: "Why Bangladesh's storage gap is the direct cause of its 2024-25 price crash." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Where Bangladesh fits — a huge producer that barely exports." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "Bangladesh's Dutch and Indian seed-import dependence." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Nepal: full Country Intelligence Dossier (Tier 1, premium template) ── */
function NepalProfilePage({ c }) {
  const data = {
    slug: "nepal", name: "Nepal", flag: c.flag, region: c.region,
    h1: "Nepal Potato Industry: A Top-5 Global Consumer That's Still a Net Importer (3.5M Tonnes)",
    tagLabel: "Nepal · Asia",
    readMin: 11,
    accentLabel: "Nepal eats more potatoes per person than almost anywhere on Earth — 90.2 kg/year, 4th highest globally — and grows them from 100m to 4,000m altitude. Yet it still imports roughly 343,000 tonnes a year, mostly from India, because storage and market infrastructure haven't kept pace with demand.",
    wikidata: "https://www.wikidata.org/wiki/Q837",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (FY2022/23)", value: "3.49M tonnes" },
      { label: "Per-capita consumption", value: "90.2 kg/year (4th globally)" },
      { label: "Farmers growing potato", value: "&gt;1.5M (40%+ of all farmers)" },
      { label: "Altitude range", value: "100m – 4,000m" },
      { label: "Annual imports", value: "~343,000 tonnes (mostly India)" },
      { label: "Status", value: "Nepal is India's #1 export destination by value" },
    ],
    definitiveAnswer: '<strong>Nepal produced 3.49 million tonnes of potatoes in FY2022/23</strong> (MOALD), up 4.9% from 3.33 million tonnes two years earlier, grown across an altitude range from below 100m in the Terai plains to 4,000m in the northern mountains &mdash; a geographic spread few countries can match. Potato is Nepal\'s <strong>second most important staple crop after rice</strong>, and Nepal\'s <strong>per-capita consumption of 90.2 kg/year ranks 4th globally</strong>, behind only Belarus, Ukraine, and Bosnia. The paradox: despite growing enough to rank among the world\'s heaviest potato-eating nations, Nepal remains a <strong>net importer</strong>, bringing in roughly 343,000 tonnes annually &mdash; overwhelmingly from India, which counts Nepal as its <strong>#1 potato export destination by value</strong> ($34 million in 2024).',
    keyStats: [
      { value: "3.49M t", label: "FY2022/23 production" },
      { value: "90.2 kg", label: "Per-capita consumption/yr" },
      { value: "100m–4,000m", label: "Growing altitude range" },
      { value: "343K t", label: "Annual imports (mostly India)" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Nepal's potato industry?" },
      { id: "consumption", l: "Why do Nepalis eat so much potato?" },
      { id: "pmamp", l: "What is PMAMP and how has it changed Nepal's potato sector?" },
      { id: "varieties", l: "What potato varieties are grown in Nepal?" },
      { id: "storage", l: "How does storage limit Nepal's potato sector?" },
      { id: "trade", l: "Why does Nepal still import potatoes despite growing so many?" },
      { id: "challenges", l: "What are Nepal's biggest potato-sector challenges?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Nepal's potato industry?",
        lead: "Nepal produced <strong>3.49 million tonnes in FY2022/23</strong> (MOALD) on 203,812 hectares at a yield of 17.12 t/ha &mdash; up from 3.33 million tonnes just two fiscal years earlier. Production has grown from under 300,000 tonnes in 1975 to a record 1.97 million tonnes by 2006, and now sits above 3.3 million tonnes.",
        quickFacts: [
          { label: "FY2020/21", value: "3.33M tonnes / 16.73 t/ha" },
          { label: "FY2021/22", value: "3.41M tonnes / 17.20 t/ha" },
          { label: "FY2022/23", value: "3.49M tonnes / 17.12 t/ha" },
          { label: "Classification", value: "Official \"Cash Crop\" status" },
        ],
        body: [
          "More than 40% of Nepal's 3.81 million farmers &mdash; over 1.5 million farming households &mdash; grow potatoes (MOALD; FAO Nepal Investment Forum 2022), making it one of the most socially significant crops in the country's agricultural economy. Nepal grows more potatoes than any other Himalayan nation, and potato out-produces both rice and maize per hectare in the country's cool highland climate.",
        ],
        source: "Source: MOALD (Ministry of Agriculture, Land & Livestock Development), Statistical Information on Nepalese Agriculture 2022/23; FAO Nepal Country Office.",
      },
      { id: "consumption", dataCard: "consumption",
        h2: "Why do Nepalis eat so much potato?",
        lead: "Nepal's per-capita potato consumption is <strong>90.2 kg/year (2026 estimate)</strong> &mdash; the <strong>4th highest in the world</strong>, behind only Belarus, Ukraine, and Bosnia, and has <strong>nearly doubled since 1990</strong>. An earlier 2022 estimate put the figure at 88.1 kg/year, confirming a consistent, elite global standing.",
        callout: { number: "#4", context: "Nepal's global rank in per-capita potato consumption — behind only Belarus, Ukraine, and Bosnia. Potato outperforms both rice and maize in productivity in Nepal's cool highland climate, which helps explain its central role in food security and farm income.", source: "FAO World Potato Overview" },
        body: [
          "Potato is officially classified as a <strong>cash crop</strong> in Nepal's national agricultural statistics and functions as the country's second most important staple food after rice — deeply embedded in smallholder livelihoods from the Terai plains to high-altitude mountain communities.",
        ],
        source: "Source: FAO Nepal Investment Forum 2022 and 2026; FAO World Potato Overview.",
      },
      { id: "pmamp", dataCard: "pmamp",
        h2: "What is PMAMP and how has it changed Nepal's potato sector?",
        lead: "The <strong>Prime Minister Agriculture Modernization Project (PMAMP)</strong> is Nepal's flagship potato-development program, operating 2 Superzones and 20 Zones across every ecological belt from Terai to Mountain. PMAMP-supported farms yield <strong>35% above the national average</strong>.",
        table: {
          headers: ["Metric", "PMAMP areas", "National average", "Difference"],
          rows: [
            ["Yield", "23.28 t/ha", "17.20 t/ha", "+35%"],
            ["Share of national area", "6.22%", "&mdash;", "&mdash;"],
            ["Share of national production", "8.42%", "&mdash;", "&mdash;"],
          ],
        },
        body: [
          "PMAMP has invested <strong>NPR 1,124 million</strong> (through fiscal year 2080/81) across production support, area expansion, seed production, cold storage, processing, and marketing. The results are visible district by district: Kavre's yield rose from 18.8 to 29 t/ha (plastic mulching pushing some plots to 40 t/ha); Nuwakot/Rasuwa jumped from 17.63 to 36.51 t/ha; Dadeldhura built a 35,000&ndash;40,000-unit seed supply system that now exports 150 tonnes of seed itself.",
        ],
        source: "Source: PMAMP Potato Value Chain Development Booklet 2082, MOALD.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Nepal?",
        lead: "Government-promoted improved varieties include <strong>Khumal Rato, Khumal Seto, Janakdev, Khumal Ujjwal, Khumal Upahar, MS-42, and Khumal Bikas</strong>, alongside imported Dutch varieties Cardinal and Desiree. A distinct set of local/traditional varieties remains widely cultivated.",
        table: {
          headers: ["Category", "Varieties"],
          rows: [
            ["Government-promoted improved", "Khumal Rato, Khumal Seto, Janakdev, Khumal Ujjwal, Khumal Upahar, MS-42, Khumal Bikas"],
            ["Imported", "Cardinal, Desiree"],
            ["Local / traditional", "Aru Alu, Lyanthe, Gajale, Nilo Alu, Chisapani, Chakre"],
          ],
        },
        source: "Source: PMAMP Potato Value Chain Booklet 2082.",
      },
      { id: "storage", dataCard: "storage",
        h2: "How does storage limit Nepal's potato sector?",
        lead: "PMAMP-supported cold-storage infrastructure remains small relative to national production: <strong>3 cold storages (12,500 MT combined), 64 cold rooms (512 MT), and 68 rustic stores (684 MT)</strong>. Post-harvest losses run 15&ndash;25% (CIP data).",
        body: [
          "The <strong>Potato Tuber Moth (PTM)</strong> is identified as a major, largely uncontrolled pest causing significant losses during storage &mdash; compounding the capacity shortfall. Poor transportation connectivity from highland production pockets to urban markets adds another layer of post-harvest loss on top of storage limitations.",
        ],
        source: "Source: PMAMP Potato Value Chain Booklet 2082; CIP (International Potato Center).",
      },
      { id: "trade", dataCard: "trade",
        h2: "Why does Nepal still import potatoes despite growing so many?",
        lead: "Nepal imports approximately <strong>343,000 metric tonnes</strong> of potatoes and by-products annually, with <strong>India as the dominant source</strong> &mdash; India exported <strong>$34 million worth of potatoes to Nepal in 2024</strong>, making Nepal India's <strong>#1 potato export destination by value</strong>.",
        body: [
          "The import dependency has three structural drivers: poor transportation connectivity from highland production pockets to urban markets, post-harvest losses of 15&ndash;25% due to inadequate cold-storage infrastructure, and limited domestic certified-seed supply requiring seed imports from India. Uncontrolled Indian imports also suppress domestic farm-gate prices &mdash; a challenge the FAO Nepal Investment Forum identifies as central to the sector's economics. FAO sees this as an <strong>import-substitution opportunity</strong>: if input access, transport, and post-harvest infrastructure improve, Nepal has the production base to displace a meaningful share of these imports itself.",
        ],
        source: "Source: FAO Nepal Investment Forum 2022; USDA FAS trade data.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What are Nepal's biggest potato-sector challenges?",
        lead: "MOALD and PMAMP identify seven recurring constraints: harvest-season price volatility, uncontrolled Indian imports, inadequate cold storage, rural labor shortages from migration, certified-seed scarcity (especially in high-hill areas), Potato Tuber Moth losses, and virus spread via unauthorized cross-border seed movement from India.",
        body: [
          "Nepal's potato story is a genuine paradox among major producers: it has the production potential, the consumer demand (elite global per-capita consumption), and geographic diversity spanning nearly the full altitude range potato can grow at &mdash; yet remains a net importer because of solvable infrastructure and market-access gaps rather than any production-side limitation.",
        ],
        source: "Source: PMAMP Potato Value Chain Booklet 2082; MOALD Nepal.",
      },
    ],
    sourceList: [
      "MOALD (Ministry of Agriculture, Land & Livestock Development) — Statistical Information on Nepalese Agriculture 2022/23",
      "PMAMP (Prime Minister Agriculture Modernization Project) — Potato Value Chain Development Booklet 2082",
      "FAO Nepal Country Office — Investment Forum 2022 and 2026",
      "FAO World Potato Overview — global per-capita consumption rankings",
      "USDA FAS — India-Nepal trade data",
    ],
    faqItems: [
      { q: "How much potato does Nepal produce per year?", a: "Nepal produced 3.49 million tonnes in FY2022/23 (MOALD), up from 3.33 million tonnes two fiscal years earlier — a 4.9% increase, grown across an altitude range from below 100m to 4,000m." },
      { q: "How much potato do Nepalis eat?", a: "Nepal's per-capita potato consumption is approximately 90.2 kg/year — the 4th highest in the world, behind only Belarus, Ukraine, and Bosnia — and has nearly doubled since 1990." },
      { q: "Does Nepal import potatoes despite growing them?", a: "Yes — Nepal imports roughly 343,000 tonnes annually, overwhelmingly from India, which counts Nepal as its #1 potato export destination by value ($34 million in 2024). This is driven by transport, storage, and certified-seed gaps rather than a lack of domestic production capacity." },
      { q: "What is PMAMP and what has it achieved for Nepal's potato sector?", a: "PMAMP (Prime Minister Agriculture Modernization Project) is Nepal's flagship potato-development program, operating across 2 Superzones and 20 Zones. PMAMP-supported farms yield 35% above the national average (23.28 vs. 17.20 t/ha), with some districts more than doubling their yields through the program." },
      { q: "What potato varieties are grown in Nepal?", a: "Government-promoted improved varieties include Khumal Rato, Khumal Seto, Janakdev, and MS-42, alongside imported Dutch varieties Cardinal and Desiree. Traditional local varieties like Aru Alu and Gajale remain widely cultivated in highland farming systems." },
    ],
    regionalContext: [
      { slug: "india", note: "Dominant import source (#1 Indian export dest.)" },
      { slug: "bangladesh", note: "Export market for Nepali potatoes" },
      { slug: "china", note: "Asia's #1 producer" },
      { slug: "pakistan", note: "South Asia peer, opposite trade dynamic" },
    ],
    continueReading: [
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "Why Nepal's certified-seed gap drives its import dependence." },
      { href: "/knowledge/potato-storage-cold-chain", tag: "Storage", title: "Potato Cold Storage", desc: "How thin PMAMP's storage infrastructure still is relative to national production." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "A top consumer nation that's still a net importer — Nepal's unusual trade position." },
      { href: "/country/india", tag: "Country", title: "India Country Profile", desc: "Nepal's dominant potato trading partner and #1 destination market by value." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Indonesia: full Country Intelligence Dossier (Tier 1, premium template) ── */
function IndonesiaProfilePage({ c }) {
  const data = {
    slug: "indonesia", name: "Indonesia", flag: c.flag, region: c.region,
    h1: "Indonesia Potato Industry: A 280-Million-Person Market Stuck at 1.2M Tonnes of Production",
    tagLabel: "Indonesia · Asia",
    readMin: 12,
    accentLabel: "Indonesia is the world's 4th most populous country, but potatoes can only grow in its scarce highland regions above 1,000m — so production has been stuck near 1.2 million tonnes for a decade while demand for frozen fries and chips explodes. The result: a structural import boom, with China's frozen-fry supply growing 6,000% in two years.",
    wikidata: "https://www.wikidata.org/wiki/Q252",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2023, BPS)", value: "~1.22M tonnes" },
      { label: "Harvested area", value: "~70,000 ha (stable 10+ yrs)" },
      { label: "Yield gap", value: "55% (peer-reviewed)" },
      { label: "Fresh potato imports (2024)", value: "100,000+ tonnes" },
      { label: "Chinese frozen-fry imports growth", value: "+6,000% (2021–23)" },
      { label: "Population", value: "280M+ (world's 4th)" },
    ],
    definitiveAnswer: '<strong>Indonesia produced approximately 1.22 million tonnes of potatoes in 2023</strong> (BPS/Statista) &mdash; a figure that has essentially stagnated for over a decade, with harvested area stuck near 70,000 hectares. The core constraint is geography, not effort: potatoes can only grow in Indonesia\'s highland regions above roughly 1,000&ndash;2,000 metres, which are inherently limited in a country whose landmass is overwhelmingly tropical lowland. Meanwhile the world\'s <strong>4th most populous country</strong> (280M+ people) has a rapidly growing appetite for frozen fries and chips &mdash; so <strong>fresh potato imports have crossed 100,000 tonnes annually</strong>, and <strong>Chinese frozen-fry imports grew roughly 6,000% in two years</strong> ($408,000 in 2021 to $25 million in 2023), with India, Belgium, and the US all competing for the same fast-growing market.',
    keyStats: [
      { value: "1.22M t", label: "2023 production" },
      { value: "55%", label: "Yield gap vs. potential" },
      { value: "100K+ t", label: "2024 fresh imports" },
      { value: "+6,000%", label: "China frozen-fry import growth, 2yr", accent: "#4CAF50" },
    ],
    tocItems: [
      { id: "industry-size", l: "Why has Indonesia's potato production stagnated?" },
      { id: "regions", l: "Where are potatoes grown in Indonesia?" },
      { id: "yield-gap", l: "What is Indonesia's 55% yield gap, and why does it exist?" },
      { id: "imports", l: "Why are Indonesia's potato imports surging?" },
      { id: "qsr", l: "What's driving Indonesia's frozen-fry demand?" },
      { id: "processing", l: "Does Indonesia have its own potato processing industry?" },
      { id: "trade-policy", l: "How does Indonesia's trade policy shape its potato market?" },
      { id: "distinctive", l: "What makes Indonesia's potato market structurally unusual?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "Why has Indonesia's potato production stagnated?",
        lead: "Indonesia produced roughly <strong>1.22 million tonnes in 2023</strong> on approximately <strong>70,000 hectares that have been stable for over a decade</strong> &mdash; no meaningful expansion, because potatoes can only be grown in highland areas above 1,000&ndash;2,000 metres, and those areas are geographically limited across the Indonesian archipelago's overwhelmingly tropical lowland landmass.",
        quickFacts: [
          { label: "2023 production", value: "~1.22M tonnes" },
          { label: "Harvested area", value: "~70,000 ha (a decade stable)" },
          { label: "Average yield", value: "~20 t/ha" },
          { label: "Growing elevation", value: "1,000–2,000m+ only" },
        ],
        body: [
          "Potatoes arrived via the Dutch East India Company around 1795, spreading to Batak farmers in North Sumatra's highlands within 15 years as \"kentang holanda\" (Dutch tuber). Per-capita consumption grew eightfold from 0.5 kg (1968) to 4.0 kg (1995), and continues rising, especially among higher-income urban consumers &mdash; but domestic production simply hasn't followed the same curve, because there's no more highland land to add.",
        ],
        source: "Source: BPS (Statistics Indonesia); FAOSTAT; Springer Nature, Potato Research (peer-reviewed, 2024).",
      },
      { id: "regions", dataCard: "regions",
        h2: "Where are potatoes grown in Indonesia?",
        lead: "Production concentrates in four highland regions: <strong>West Java</strong> (the largest producer), <strong>Central Java</strong>'s Dieng Plateau, <strong>East Java</strong>'s Malang area, and <strong>North Sumatra</strong>'s Karo Plateau.",
        table: {
          headers: ["Region", "Key area", "Notes"],
          rows: [
            ["West Java", "Pangalengan", "Largest producer; major seed-potato hub (5–15 t/day)"],
            ["Central Java", "Dieng Plateau, Wonosobo, Tuwel", "Famous highland area, 2,000m+ elevation"],
            ["East Java", "Malang", "Important production area"],
            ["North Sumatra", "Karo Plateau", "Home to Karunia Agro Karo, a major fresh-potato supplier"],
          ],
        },
        body: [
          "West Java's Pangalengan hub alone is estimated to need 12,000 tonnes of seed potato per year for the province, but most farmers save their own seed rather than buy certified stock &mdash; a practice that degrades quality across successive generations, echoing seed-quality crises seen in Karnataka (India) and Bangladesh.",
        ],
        source: "Source: BPS (Statistics Indonesia); USDA FAS Jakarta.",
      },
      { id: "yield-gap", dataCard: "yield-gap",
        h2: "What is Indonesia's 55% yield gap, and why does it exist?",
        lead: "A peer-reviewed 2024 study (Springer Nature, Potato Research) quantified a <strong>55% yield gap</strong> in West Java between actual farm yields (~20 t/ha) and attainable field-trial yields (~40 t/ha) &mdash; and critically, the gap is <strong>not caused by insufficient inputs</strong>.",
        callout: { number: "55%", context: "yield gap in West Java — comparable to Chile (60%) and China (66%), worse than Peru (43%) and far worse than the Netherlands (20–31%). Most fields studied reported input levels at or beyond agronomic recommendations, meaning the gap comes from timing, disease, and risk-averse farming decisions, not under-investment.", source: "Springer Nature, Potato Research (2024, peer-reviewed)" },
        body: [
          "The study found most fields used <strong>high input levels, often beyond agronomic recommendations</strong> — ruling out the usual explanation for yield gaps in developing-country agriculture. The actual drivers are suboptimal planting dates, pest and disease pressure, and seed quality, compounded by a risk-averse farming culture: farmers optimize to minimize the chance of total crop failure rather than to maximize average yield, even when the crop is potentially quite profitable.",
        ],
        source: "Source: Springer Nature, Potato Research (2024, peer-reviewed).",
      },
      { id: "imports", dataCard: "imports",
        h2: "Why are Indonesia's potato imports surging?",
        lead: "Fresh potato imports crossed <strong>100,000 tonnes in 2024</strong>, up from 38,805 tonnes in 2019-20. On the frozen side, <strong>Chinese frozen-fry imports grew roughly 6,000% in two years</strong> — from $408,000 (2021) to $25 million (2023) — one of the fastest supplier-emergence stories in any global potato trade corridor.",
        table: {
          headers: ["Import category", "Leading suppliers", "Notes"],
          rows: [
            ["Fresh potatoes", "India (37–50%), China, Germany, Egypt", "India benefits from proximity + price"],
            ["Frozen French fries", "Belgium (31%), USA (21%), China (18%), Netherlands (16%)", "China surging from near-zero"],
            ["Indian frozen fries specifically", "10,000+ tonnes imported in 2024", "India entering the frozen segment, not just fresh"],
          ],
        },
        body: [
          "India is simultaneously Indonesia's largest fresh-potato supplier and a fast-rising frozen-fry competitor — Indian frozen-potato exports overall grew from $29 million (2019) to $206 million (2024), and Indonesia imported over 10,000 tonnes of Indian frozen fries in 2024 alone. Indian dehydrated-goods exports to Indonesia specifically grew from $11.4 million (2021-22) to $63.3 million (2024-25).",
        ],
        source: "Source: USDA FAS Jakarta; US Commerce Department (trade.gov); Indian trade data.",
      },
      { id: "qsr", dataCard: "qsr",
        h2: "What's driving Indonesia's frozen-fry demand?",
        lead: "Quick-service restaurant expansion is the primary engine. Indonesia is one of <strong>KFC's largest global markets</strong>, alongside a growing McDonald's and Burger King presence, plus local chains like Richeese Factory serving fries. USDA FAS Jakarta notes fast-food fry introduction is \"growing rapidly, especially in big cities.\"",
        body: [
          "Beyond QSR, Indonesia's \"gorengan\" (fried snack) culture creates a deep-rooted consumer affinity for potato products — potato already sits alongside rice and cassava in Indonesian cuisine, in gorengan and in soto (soup). The urban middle class in Jakarta, Surabaya, Bandung, and Medan is the clearest accelerant: supermarkets increasingly stock frozen French fries as a mainstream product rather than an import specialty.",
        ],
        source: "Source: USDA FAS Jakarta industry data.",
      },
      { id: "processing", dataCard: "processing",
        h2: "Does Indonesia have its own potato processing industry?",
        lead: "Modest and largely untapped. Domestic processing absorbs an estimated <strong>20&ndash;40 tonnes of fresh potato per day</strong> nationally — tiny relative to import volumes. A structural problem compounds this: <strong>domestic varieties are generally not suitable for French fry production</strong>, so even growth in local farming wouldn't directly solve the processing-supply gap.",
        table: {
          headers: ["Company", "Role"],
          rows: [
            ["Indofood (PT Indofood CBP Sukses Makmur Tbk)", "Indonesia's largest food company; USDA FAS Jakarta identifies it as representing major untapped processed-potato potential"],
            ["PT Kirana Food", "Started as a frozen-fry importer; has expanded into broader frozen food distribution"],
            ["Maxi Snacks", "Produces fried snack chips, primarily cassava-based, diversifying toward potato"],
          ],
        },
        source: "Source: USDA FAS Jakarta.",
      },
      { id: "trade-policy", dataCard: "trade-policy",
        h2: "How does Indonesia's trade policy shape its potato market?",
        lead: "Import duties apply to potato products, and the Indonesian government balances domestic farmer protection against processor needs. There is <strong>no US free-trade agreement</strong> covering potatoes (unlike South Korea's KORUS), while regional flows operate under the <strong>ASEAN trade framework</strong>.",
        body: [
          "Indonesia's total agricultural imports reached <strong>$29.6 billion in 2024</strong> (up from $28 billion in 2022), with Brazil (14%) and Australia (13%) leading overall agricultural supply to the country — potatoes represent a growing but still specialized slice of that much larger import bill. Indonesia is structurally import-dependent across many food categories, not just potatoes.",
        ],
        source: "Source: USDA FAS Jakarta; US Commerce Department.",
      },
      { id: "distinctive", dataCard: "distinctive",
        h2: "What makes Indonesia's potato market structurally unusual?",
        lead: "Indonesia isn't a \"developing\" potato market in the usual sense — it's a <strong>structurally import-dependent market undergoing a fast transition from fresh to processed consumption</strong>, constrained by geography and varietal limitations that can't be fixed by farming investment alone.",
        body: [
          "The processing gap is structural, not cyclical: domestic varieties genuinely cannot produce good fries, and fixing that requires variety-replacement programs measured in years, not a season of better fertilizer use. Combine that with a growing urban middle class, deep-rooted fried-food culture, and a QSR boom, and Indonesia becomes one of the highest-priority growth markets globally for potato exporters — which is exactly why Belgium, the US, China, and India are all competing intensely for share of its frozen-fry import market right now.",
        ],
        source: "Source: USDA FAS Jakarta; Springer Nature, Potato Research (2024).",
      },
    ],
    sourceList: [
      "BPS (Statistics Indonesia / Badan Pusat Statistik) — production and area data",
      "USDA FAS Jakarta — trade, QSR demand, and processing-industry analysis",
      "US Department of Commerce (trade.gov) — import statistics",
      "Springer Nature, Potato Research (2024, peer-reviewed) — West Java yield-gap study",
      "FAOSTAT — production time series",
      "6W Research — market analysis",
    ],
    faqItems: [
      { q: "How much potato does Indonesia produce per year?", a: "Indonesia produced approximately 1.22 million tonnes in 2023 (BPS/Statista) on about 70,000 hectares — a harvested area that has been stable for over a decade due to Indonesia's limited highland growing regions." },
      { q: "Why doesn't Indonesia grow more potatoes if demand is rising?", a: "Potatoes can only be cultivated in highland areas above roughly 1,000–2,000 metres elevation, which are geographically limited across Indonesia's mostly tropical lowland archipelago. There's little additional suitable land to expand into, unlike flat-land producers." },
      { q: "Where does Indonesia get its imported potatoes?", a: "Fresh potato imports come primarily from India (37–50% market share), China, Germany, and Egypt. Frozen French fry imports are led by Belgium (31%), the United States (21%), China (18%, surging from near-zero), and the Netherlands (16%)." },
      { q: "Why did Chinese potato imports to Indonesia grow so fast?", a: "Chinese frozen-fry imports to Indonesia grew roughly 6,000% in two years, from $408,000 in 2021 to $25 million in 2023, reflecting China's own rapid emergence as a processing exporter competing for the fast-growing Indonesian QSR market." },
      { q: "What is Indonesia's potato yield gap?", a: "A peer-reviewed 2024 study found a 55% yield gap in West Java — actual farm yields around 20 t/ha versus attainable yields near 40 t/ha — driven mainly by planting timing, disease pressure, and risk-averse farming decisions rather than insufficient fertilizer or input use." },
    ],
    regionalContext: [
      { slug: "china", note: "Fast-rising frozen-fry supplier" },
      { slug: "india", note: "Largest fresh-import source" },
      { slug: "south-korea", note: "Asia-Pacific QSR-driven peer" },
      { slug: "australia", note: "Growing export destination for Australian fresh potatoes" },
    ],
    continueReading: [
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How Belgium, the US, China, and India compete for Indonesia's frozen-fry import market." },
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "Why domestic Indonesian varieties can't meet French-fry processing specs." },
      { href: "/country/india", tag: "Country", title: "India Country Profile", desc: "Indonesia's largest fresh-potato import source and a fast-rising frozen-fry supplier." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "The farm-saved-seed quality problem echoed across West Java, Karnataka, and Bangladesh." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Australia: full Country Intelligence Dossier (Tier 1, premium template) ── */
function AustraliaProfilePage({ c }) {
  const data = {
    slug: "australia", name: "Australia", flag: c.flag, region: c.region,
    h1: "Australia Potato Industry: 100% Self-Sufficient, Zero Fresh Imports, $1.2B AUD Industry",
    tagLabel: "Australia · Oceania",
    readMin: 11,
    accentLabel: "Australia is one of the only major potato-growing nations that imports zero fresh potatoes — complete self-sufficiency backed by strict biosecurity. Production value has grown 50% in five years even as volume stayed flat, and Indonesia has gone from a zero-tonne export market to Australia's third-largest in just two years.",
    wikidata: "https://www.wikidata.org/wiki/Q408",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (FY2024-25)", value: "1.49M tonnes ($1.21B AUD)" },
      { label: "Fresh potato imports", value: "Zero — every year on record" },
      { label: "Processing share", value: "66% of production" },
      { label: "5-year value growth", value: "+50% (2021→2025)" },
      { label: "Top production states", value: "Tasmania, South Australia" },
      { label: "Largest export market", value: "South Korea (41.3%)" },
    ],
    definitiveAnswer: '<strong>Australia produced 1,493,725 tonnes of potatoes in the year ending June 2025</strong>, valued at $1,212.7 million AUD (Hort Innovation / Freshlogic-Kynetec) &mdash; a 10% increase in value despite a 2% dip in volume from the prior year. Australia\'s single most distinctive trade feature: it <strong>imports zero fresh potatoes, every year on record</strong>, while exporting a growing volume &mdash; a rare full-self-sufficiency position among major producers, underpinned by strict biosecurity regulation. <strong>Processing absorbs 66% of production</strong> (frozen fries, chips), and <strong>Tasmania and South Australia together grow roughly 61%</strong> of the national crop. On the export side, <strong>South Korea takes 41.3% of Australian fresh exports</strong>, while <strong>Indonesia has emerged from zero tonnes to Australia\'s third-largest export market in just two years</strong>.',
    keyStats: [
      { value: "1.49M t", label: "FY2024-25 production" },
      { value: "$1.21B", label: "Production value (AUD)" },
      { value: "0", label: "Fresh potato imports (tonnes)" },
      { value: "+50%", label: "5-yr value growth", accent: "#4CAF50" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Australia's potato industry?" },
      { id: "self-sufficiency", l: "Why does Australia import zero fresh potatoes?" },
      { id: "regions", l: "Which Australian states produce the most potatoes?" },
      { id: "usage", l: "How is Australia's potato crop used?" },
      { id: "exports", l: "Where does Australia export its potatoes?" },
      { id: "consumers", l: "How do Australians buy and eat potatoes?" },
      { id: "distinctive", l: "What makes Australia's potato industry distinctive?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Australia's potato industry?",
        lead: "Australia produced <strong>1,493,725 tonnes</strong> in the year ending June 2025, valued at <strong>$1,212.7 million AUD</strong> (Hort Innovation / Freshlogic-Kynetec, Australian Horticulture Statistics Handbook 2024/25) &mdash; a 10% increase in value despite a 2% dip in volume year-on-year.",
        quickFacts: [
          { label: "FY2021", value: "1.459M t / $807.3M AUD" },
          { label: "FY2023", value: "1.463M t / $1,033.5M AUD" },
          { label: "FY2025", value: "1.494M t / $1,212.7M AUD" },
          { label: "5-yr value growth", value: "+50%" },
        ],
        body: [
          "Production volume has stayed remarkably stable across five years — ranging between 1.46 and 1.53 million tonnes annually — while value has grown 50%, from $807.3 million AUD (2021) to $1,212.7 million (2025). That's a pricing-and-quality story, not a volume-growth story: Australia's potato industry is generating substantially more revenue from essentially the same physical crop.",
        ],
        source: "Source: Australian Horticulture Statistics Handbook 2024/25, published by Hort Innovation and Freshlogic (now part of Kynetec).",
      },
      { id: "self-sufficiency", dataCard: "trade",
        h2: "Why does Australia import zero fresh potatoes?",
        lead: "Australia has recorded <strong>zero fresh potato imports across every year in the five-year record</strong> (2021–2025) &mdash; a rare full self-sufficiency position among major producing nations, reflecting both strong domestic production capacity and Australia's notably strict biosecurity regulations protecting against pests and diseases.",
        callout: { number: "0", context: "fresh potatoes imported by Australia in every recorded year. Combined with growing fresh exports (+8% in FY2025 alone), this makes Australia's trade balance in fresh potatoes entirely one-directional — a distinctive position matched by very few major producers globally.", source: "Australian Horticulture Statistics Handbook 2024/25" },
        body: [
          "This complete self-sufficiency is unusual even among developed-world producers — most large economies import at least some specialty or off-season fresh potato volume. Australia's island biosecurity regime, combined with year-round production capability in Tasmania and South Australia specifically, removes the seasonal supply gap that typically drives fresh imports elsewhere.",
        ],
        source: "Source: Australian Horticulture Statistics Handbook 2024/25.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which Australian states produce the most potatoes?",
        lead: "<strong>Tasmania (31.3%)</strong> and <strong>South Australia (29.6%)</strong> together grow roughly 61% of Australia's fresh potato crop, followed by Victoria, New South Wales, Queensland, and Western Australia.",
        table: {
          headers: ["State", "Production (2024-25)", "Share", "Key growing areas"],
          rows: [
            ["Tasmania", "467,913 t", "31.3%", "North-West, Midlands, North & North-East Tasmania"],
            ["South Australia", "442,109 t", "29.6%", "Adelaide Plains"],
            ["Victoria", "269,109 t", "18.0%", "Ballarat, Gippsland"],
            ["New South Wales", "162,231 t", "10.9%", "Murray Region – Riverina"],
            ["Queensland", "82,661 t", "5.5%", "Bundaberg, Lockyer Valley, Atherton"],
            ["Western Australia", "69,701 t", "4.7%", "Perth, Manjimup"],
          ],
        },
        body: [
          "Tasmania and South Australia both produce year-round, giving them an outsized role in Australia's supply continuity. Queensland and New South Wales have seasonal production gaps, Western Australia has a gap around August–October, and Victoria produces in most months. Note: these production rankings differ from Australia's export rankings — South Australia and New South Wales lead on export volume specifically (see the trade section), even though Tasmania is the single largest state by total production.",
        ],
        source: "Source: Australian Horticulture Statistics Handbook 2024/25.",
      },
      { id: "usage", dataCard: "usage",
        h2: "How is Australia's potato crop used?",
        lead: "The industry splits sharply toward processing: <strong>66% (~990,000 tonnes) goes to processing</strong> (frozen fries, chips), <strong>30% (453,867 tonnes) to fresh domestic supply</strong>, and <strong>3% (49,858 tonnes) to fresh export</strong>.",
        table: {
          headers: ["Use", "Volume (FY2024-25)", "Value", "Share"],
          rows: [
            ["Processing", "~990,000 t", "&mdash;", "66%"],
            ["Fresh domestic supply", "453,867 t", "$752.6M AUD", "30%"],
            ["Fresh export", "49,858 t", "$52.2M AUD", "3%"],
            ["Fresh import", "0 t", "$0", "0%"],
          ],
        },
        body: [
          "Within fresh domestic supply, retail dominates at 86% (390,423 tonnes, $647.4 million AUD), with food service taking the remaining 14% (63,444 tonnes, $105.2 million AUD). Household penetration is high at 86% of Australian households, with an average purchase weight of 1.86 kg and per-capita supply of 16.86 kg — down slightly (&gt;-1%) year-on-year, consistent with the industry's shift toward value over volume.",
        ],
        source: "Source: Australian Horticulture Statistics Handbook 2024/25.",
      },
      { id: "exports", dataCard: "exports",
        h2: "Where does Australia export its potatoes?",
        lead: "Fresh exports reached <strong>49,858 tonnes in FY2024-25 (+8% year-on-year)</strong>, worth $52.2 million AUD. <strong>South Korea is the dominant market at 41.3%</strong>, and <strong>Indonesia has grown from zero tonnes to a 11.5% share in just two years</strong> — the clearest new-demand story in Australia's export portfolio.",
        table: {
          headers: ["Market", "2023", "2024", "2025", "2025 share"],
          rows: [
            ["South Korea", "20,223 t", "25,029 t", "20,568 t", "41.3%"],
            ["Philippines", "8,681 t", "7,338 t", "8,894 t", "17.8%"],
            ["Indonesia", "0 t", "1,475 t", "5,752 t", "11.5%"],
            ["Taiwan", "2,837 t", "3,167 t", "4,847 t", "9.7%"],
            ["Singapore", "2,488 t", "2,345 t", "2,333 t", "4.7%"],
          ],
        },
        body: [
          "By state, exports originate mainly from South Australia (47.0% of export volume) and New South Wales (41.1%) — a different ranking from overall state production, since Tasmania's large crop is oriented more toward domestic processing and fresh supply than export.",
        ],
        source: "Source: Australian Horticulture Statistics Handbook 2024/25.",
      },
      { id: "consumers", dataCard: "consumers",
        h2: "How do Australians buy and eat potatoes?",
        lead: "86% of Australian households buy potatoes, with an average purchase weight of 1.86 kg and per-capita supply of 16.86 kg per year — down slightly year-on-year as the industry shifts toward higher-value, processed formats over raw fresh-market volume.",
        body: [
          "Retail wholesale value grew from $445.0 million AUD (2021) to $647.4 million (2025) — a 45% increase — even as retail volume grew only modestly, from 380,185 to 390,423 tonnes. That gap between value growth and volume growth is the same value-over-volume pattern visible across the whole industry.",
        ],
        source: "Source: Australian Horticulture Statistics Handbook 2024/25.",
      },
      { id: "distinctive", dataCard: "distinctive",
        h2: "What makes Australia's potato industry distinctive?",
        lead: "Three factors set Australia apart from most major potato-producing nations: <strong>complete self-sufficiency with zero fresh imports</strong>, <strong>value growth consistently outpacing volume</strong>, and a <strong>rapidly expanding Asian export footprint</strong>, led by Indonesia's emergence as a new buyer.",
        body: [
          "Australia operates a mature, self-sufficient potato industry worth over $1.2 billion AUD, with a processing-dominated production base, rising export revenues, and an increasingly diversified Asian customer base. Indonesia's rise from zero to a top-3 export market inside two years is the standout data point — a signal that Australia is successfully developing new premium markets in its own region even as it remains fully closed to fresh imports.",
        ],
        source: "Source: Australian Horticulture Statistics Handbook 2024/25.",
      },
    ],
    sourceList: [
      "Australian Horticulture Statistics Handbook 2024/25 — Potato section",
      "Hort Innovation — Australian horticulture industry data",
      "Freshlogic / Kynetec — supply-chain and market analysis",
    ],
    faqItems: [
      { q: "How much potato does Australia produce per year?", a: "Australia produced 1,493,725 tonnes in the year ending June 2025, valued at $1,212.7 million AUD — a 10% increase in value despite a 2% volume dip from the prior year." },
      { q: "Does Australia import potatoes?", a: "No — Australia has imported zero fresh potatoes in every year on record (at least the last five years tracked), making it fully self-sufficient in fresh potato supply. This is underpinned by strict biosecurity regulations." },
      { q: "Which Australian state grows the most potatoes?", a: "Tasmania is the largest producer at 31.3% of national volume (467,913 tonnes), followed closely by South Australia at 29.6% (442,109 tonnes). Together they grow roughly 61% of Australia's potato crop." },
      { q: "Where does Australia export its potatoes?", a: "South Korea is Australia's largest fresh-potato export market at 41.3% share, followed by the Philippines (17.8%) and a rapidly growing Indonesia (11.5%, up from zero tonnes just two years ago)." },
      { q: "How much of Australia's potato crop is processed?", a: "66% of production (approximately 990,000 tonnes) goes to processing — frozen fries and chips — making it the dominant end use, ahead of fresh domestic supply (30%) and fresh export (3%)." },
    ],
    regionalContext: [
      { slug: "indonesia", note: "Fast-growing new export market" },
      { slug: "south-korea", note: "Largest export destination" },
      { slug: "japan", note: "Asia-Pacific processing peer" },
      { slug: "united-states", note: "Global processing benchmark" },
    ],
    continueReading: [
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "The frozen-fry and chip processing pipeline that absorbs 66% of Australia's crop." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Australia's rare zero-import, growing-export trade position among major producers." },
      { href: "/country/indonesia", tag: "Country", title: "Indonesia Country Profile", desc: "Australia's fastest-growing new export market — zero to 5,752 tonnes in two years." },
      { href: "/knowledge/potato-varieties-guide", tag: "Varieties", title: "Potato Varieties Guide", desc: "Understanding processing vs. fresh-market variety selection." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── South Africa: full Country Intelligence Dossier (Tier 1, premium template) ── */
function SouthAfricaProfilePage({ c }) {
  const data = {
    slug: "south-africa", name: "South Africa", flag: c.flag, region: c.region,
    h1: "South Africa Potato Industry: Africa's Highest Yields, First-World Infrastructure (2.6M Tonnes)",
    tagLabel: "South Africa · Africa",
    readMin: 12,
    accentLabel: "South Africa delivers developed-world potato yields — 43.3 t/ha, the highest in Africa — inside a water-stressed, electricity-constrained African context. Institutional organization, multinational processors, and a functioning fresh-produce market system make it the continent's benchmark.",
    wikidata: "https://www.wikidata.org/wiki/Q258",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2023, FAOSTAT)", value: "~2.6M tonnes" },
      { label: "Yield", value: "43.3 t/ha (Africa's highest)" },
      { label: "Harvested area", value: "~60,000 ha" },
      { label: "Commercial producers", value: "500–600 (down from 3,000+ in 1990s)" },
      { label: "Exports (2023)", value: "ZAR 2–3B (~USD 110–170M)" },
      { label: "Top province", value: "Limpopo (25–28% of output)" },
    ],
    definitiveAnswer: '<strong>South Africa produced approximately 2.6 million tonnes of potatoes in 2023</strong> (FAOSTAT) on roughly 60,000 hectares, delivering a national average yield of <strong>43.3 tonnes per hectare</strong> &mdash; the <strong>highest yield in Africa</strong> and above the average of many European countries. Kenya, for comparison, produces a similar total tonnage from an area nearly four times larger, at less than a quarter of South Africa\'s yield &mdash; illustrating how commercialized South Africa\'s sector is relative to continental peers. Production concentrates in <strong>Limpopo Province (25&ndash;28% of national output)</strong>, supported by a highly organized industry: <strong>Potatoes South Africa (PSA)</strong>, a statutory body, and multinational processors <strong>McCain and PepsiCo/Simba</strong> anchor a well-developed value chain. South Africa is a <strong>net exporter</strong> to the Southern African region, with exports valued at roughly <strong>ZAR 2&ndash;3 billion (USD 110&ndash;170 million)</strong> in 2023, even as load-shedding and land-reform uncertainty pose real medium-term risks.',
    keyStats: [
      { value: "2.6M t", label: "2023 production" },
      { value: "43.3 t/ha", label: "Yield (Africa's highest)" },
      { value: "500–600", label: "Commercial producers" },
      { value: "ZAR 2–3B", label: "2023 exports" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is South Africa's potato industry?" },
      { id: "regions", l: "Which regions produce the most potatoes in South Africa?" },
      { id: "varieties", l: "What potato varieties are grown in South Africa?" },
      { id: "processing", l: "Who are South Africa's major potato processors?" },
      { id: "infrastructure", l: "How does South Africa's market infrastructure compare to its neighbors?" },
      { id: "trade", l: "Does South Africa export or import potatoes?" },
      { id: "psa", l: "What is Potatoes South Africa (PSA)?" },
      { id: "challenges", l: "What challenges does South Africa's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is South Africa's potato industry?",
        lead: "South Africa is the <strong>most technologically advanced and highest-yielding potato producer on the African continent</strong>. FAOSTAT 2023 data puts production at approximately <strong>2.6 million tonnes</strong> from roughly <strong>60,000 hectares</strong>, for a national average yield of <strong>43.3 tonnes per hectare</strong>.",
        quickFacts: [
          { label: "Production (2023)", value: "~2.6M tonnes" },
          { label: "Area (2023)", value: "~60,000 hectares" },
          { label: "Yield", value: "43.3 t/ha" },
          { label: "Africa ranking", value: "#1 by yield" },
        ],
        body: [
          "That 43.3 t/ha yield is the highest in Africa and exceeds the average of many European countries — reflecting the sector's high level of commercialization, irrigation coverage, and input use. The comparison with Kenya is instructive: Kenya produces a similar total tonnage from an area nearly four times larger, at less than a quarter of South Africa's per-hectare yield.",
          "The Department of Agriculture, Land Reform and Rural Development (DALRRD, formerly DAFF) maintains detailed statistics through its Directorate of Statistics and Economic Analysis, corroborated by FAOSTAT, and the industry's own statutory body publishes granular data down to provincial, regional, and even municipal level — making South Africa one of the best-documented potato industries in the developing world.",
        ],
        source: "Source: FAOSTAT 2023; DALRRD Crop Estimates 2023; Potatoes South Africa Annual Report 2022/2023.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which regions produce the most potatoes in South Africa?",
        lead: "Production spans all nine provinces but concentrates in <strong>Limpopo (25&ndash;28% of national output)</strong>, followed by Free State, then Mpumalanga, Western Cape, Northern Cape, KwaZulu-Natal, and North West.",
        table: {
          headers: ["Province", "Role", "Key areas", "Notes"],
          rows: [
            ["Limpopo", "Largest producer", "Mogalakwena, Mokopane, Polokwane, Springbok Flats", "Warm subtropical climate + irrigation enables year-round production"],
            ["Free State", "2nd largest", "Reitz, Bethlehem, Frankfort, Bloemfontein-Botshabelo", "Mostly rain-fed, supplemented by irrigation"],
            ["Mpumalanga", "3rd largest", "Bethal, Ermelo, Carolina (Highveld)", "Anchors McCain's Delmas processing plant"],
            ["Western Cape", "Significant", "Sandveld (Piketberg), Ceres", "&mdash;"],
            ["Northern Cape", "Significant", "Douglas, Hartswater (Vaal-Harts irrigation)", "&mdash;"],
          ],
        },
        body: [
          "Limpopo's warm subtropical climate and extensive irrigation from boreholes and the Nyl River system give it a distinctive advantage: year-round production capability, particularly valuable for \"early\" and \"out-of-season\" production that commands premium prices in the Johannesburg and Pretoria fresh-produce markets. The total number of commercial potato producers has fallen from over 3,000 in the 1990s to approximately 500&ndash;600 today, reflecting consolidation and mechanization — the average commercial farm now plants 100&ndash;150 hectares annually.",
        ],
        source: "Source: Potatoes South Africa (PSA), 2023; DALRRD 2023; Water Research Commission (WRC) of South Africa.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in South Africa?",
        lead: "<strong>Mondial</strong> (HZPC, Netherlands) is the single most widely planted variety at 20&ndash;25% of total area, followed by <strong>Sifra</strong> (also HZPC). The variety portfolio is dominated by Dutch breeding, though the Agricultural Research Council (ARC) maintains a domestic breeding program.",
        table: {
          headers: ["Variety", "Breeder", "Role"],
          rows: [
            ["Mondial", "HZPC (Netherlands)", "Most planted, 20–25% of area; fresh market"],
            ["Sifra", "HZPC (Netherlands)", "2nd most planted; fresh + informal processing"],
            ["Innovator", "HZPC (Netherlands)", "French-fry processing"],
            ["Markies", "Agrico (Netherlands)", "Processing"],
            ["Lanorma, Electra, Panamera, Valor (ARC)", "Mixed", "Fresh market, ARC-bred options"],
            ["Hertha, Lady Rosetta, FL varieties", "Mixed", "Chip/crisp processing"],
          ],
        },
        body: [
          "The ARC's breeding program at Roodeplaat near Pretoria has released several locally adapted varieties, but Dutch-bred varieties continue to dominate the commercial sector. McCain South Africa specifically contracts growers for Innovator and Markies, while Simba (PepsiCo) sets its own dry-matter, sugar, and fry-color specifications for chip-segment supply.",
        ],
        source: "Source: Potatoes South Africa Variety Guide 2023; ARC Annual Report 2022; HZPC variety specifications.",
      },
      { id: "processing", dataCard: "processing",
        h2: "Who are South Africa's major potato processors?",
        lead: "South Africa has the <strong>most developed potato-processing industry on the African continent</strong>, split into frozen (fries and formed products), crisps/chips, and dehydrated segments. <strong>McCain Foods</strong> and <strong>Simba (PepsiCo)</strong> anchor the two largest segments.",
        table: {
          headers: ["Company", "Segment", "Location", "Scale"],
          rows: [
            ["McCain Foods South Africa", "Frozen fries, wedges, formed products", "Delmas, Mpumalanga", "~250,000–300,000 t raw potato/yr; 60–80 contracted growers"],
            ["Simba (PepsiCo)", "Crisps/chips", "Isando, Gauteng", "40–50% chip-segment market share"],
            ["Willards (PepsiCo)", "Crisps/chips", "&mdash;", "Secondary PepsiCo brand"],
            ["Dehydrated segment", "Flakes, granules", "Various", "Exports to several SADC countries"],
          ],
        },
        body: [
          "McCain South Africa's Delmas plant traces to a 1998 acquisition of a local processor and has been progressively expanded and modernized; it processes 250,000–300,000 tonnes of raw potato annually, contracting 60–80 commercial growers within a 200km radius and specifying Innovator and Markies as its primary varieties. The combined crisp segment (Simba + Willards + smaller regional producers) consumes an estimated 150,000–200,000 tonnes of raw potato annually.",
        ],
        source: "Source: McCain Foods Limited, Global Operations Overview; PepsiCo South Africa; USDA FAS GAIN Report SF2023-0015; Euromonitor International.",
      },
      { id: "infrastructure", dataCard: "infrastructure",
        h2: "How does South Africa's market infrastructure compare to its neighbors?",
        lead: "South Africa runs a <strong>well-functioning fresh-produce market system</strong> with comprehensive cold-chain infrastructure — features that set it apart from virtually every other African potato-producing nation.",
        body: [
          "The <strong>Johannesburg Fresh Produce Market</strong> in City Deep is the largest in Africa, handling approximately 180,000&ndash;200,000 tonnes of potatoes annually and serving as the reference price benchmark for potato pricing throughout Southern Africa. Roughly 50&ndash;55% of fresh potatoes flow through the national municipal-market system (Johannesburg, Tshwane/Pretoria, Cape Town, Durban, Bloemfontein), with the remainder moving through informal markets, direct retail supply, and contract arrangements — a channel that's growing as major retail chains including Shoprite/Checkers, Pick n Pay, Woolworths, and Spar increasingly source directly from preferred growers.",
        ],
        source: "Source: Johannesburg Market Annual Report 2023; DALRRD Directorate of Marketing 2023; BFAP (Bureau for Food and Agricultural Policy) 2023.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Does South Africa export or import potatoes?",
        lead: "South Africa is largely self-sufficient and a <strong>net exporter</strong> to the Southern African region — total exports (fresh and processed combined) were valued at approximately <strong>ZAR 2&ndash;3 billion (USD 110&ndash;170 million)</strong> in 2023, going primarily to Mozambique, Zimbabwe, Zambia, Botswana, and Namibia.",
        table: {
          headers: ["Flow", "Destinations / sources", "Notes"],
          rows: [
            ["Exports", "Mozambique, Zimbabwe, Zambia, Botswana, Namibia (SADC)", "ZAR 2–3B (USD 110–170M), 2023"],
            ["Imports", "Netherlands, Scotland (seed potatoes); niche specialty frozen", "Minimal — domestic industry meets most demand"],
          ],
        },
        body: [
          "South Africa functions as the de facto regional supplier for Southern Africa — the reverse of the import-dependent position most other African potato markets occupy. Imports are limited and niche: specialty frozen products and seed potatoes from the Netherlands and Scotland, since the well-developed domestic industry covers the vast majority of demand across fresh, processed, and seed categories.",
        ],
        source: "Source: DALRRD trade statistics; FAOSTAT Trade 2023.",
      },
      { id: "psa", dataCard: "psa",
        h2: "What is Potatoes South Africa (PSA)?",
        lead: "<strong>Potatoes South Africa (PSA)</strong> is the statutory body established under the Marketing of Agricultural Products Act (Act 47 of 1996) to serve the industry, funded by a levy of <strong>ZAR 42.50 per tonne</strong> approved by the National Agricultural Marketing Council (NAMC).",
        body: [
          "PSA provides market research, industry statistics, quality standards, and advocacy, and its annual research budget supports plant breeding, disease management, and irrigation-efficiency work at the ARC and South African universities. PSA also administers the industry's transformation program under South Africa's Broad-Based Black Economic Empowerment (B-BBEE) legislation, aimed at increasing participation by historically disadvantaged individuals in the potato value chain — though PSA's own reporting notes progress has been slower than anticipated, given how capital-intensive and technically demanding commercial potato production is.",
        ],
        source: "Source: Potatoes South Africa Annual Report 2022/2023; NAMC Statutory Measures 2023; Potatoes SA Transformation Report 2023.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does South Africa's potato industry face?",
        lead: "Three structural pressures recur: <strong>water scarcity</strong> (60% of the crop is irrigated in a country receiving barely half the world's average rainfall), <strong>electricity instability</strong> from load-shedding, and <strong>land-reform policy uncertainty</strong>.",
        body: [
          "South Africa receives an average of only 450mm of rainfall annually against a world average of 860mm, and competition for water between agriculture, mining, industry, and domestic use is intensifying — the 2015-2018 Western Cape drought and ongoing Limpopo water-availability issues both highlighted this vulnerability. Eskom's rolling load-shedding directly disrupts irrigation pumping schedules and forces expensive diesel-generator backup. Land-reform uncertainty, driven by the Expropriation Bill and broader policy debate, hasn't caused direct production disruption yet, but continues to suppress long-term investment in fixed irrigation infrastructure and succession planning.",
        ],
        source: "Source: Water Research Commission (WRC) 2023; Department of Water and Sanitation, National Water Resource Strategy 3; BFAP Agricultural Outlook 2023-2032; AgriSA 2023.",
      },
    ],
    sourceList: [
      "FAOSTAT 2023 — production, area, and yield statistics",
      "DALRRD (Department of Agriculture, Land Reform and Rural Development) — official crop estimates",
      "Potatoes South Africa (PSA) — statutory body annual reports and variety guide",
      "McCain Foods Limited; PepsiCo South Africa — corporate processing data",
      "BFAP (Bureau for Food and Agricultural Policy) — agricultural outlook and challenges analysis",
      "Water Research Commission (WRC) of South Africa — irrigation and water-stress studies",
    ],
    faqItems: [
      { q: "How much potato does South Africa produce per year?", a: "South Africa produced approximately 2.6 million tonnes in 2023 (FAOSTAT) on roughly 60,000 hectares, at a national average yield of 43.3 tonnes per hectare — the highest yield in Africa." },
      { q: "Which province produces the most potatoes in South Africa?", a: "Limpopo Province, contributing approximately 25–28% of national production, thanks to a warm subtropical climate and extensive irrigation enabling year-round production." },
      { q: "Does South Africa export potatoes?", a: "Yes — South Africa is a net exporter, primarily to Southern African Development Community (SADC) countries: Mozambique, Zimbabwe, Zambia, Botswana, and Namibia. Total exports (fresh and processed) were valued at roughly ZAR 2–3 billion (USD 110–170 million) in 2023." },
      { q: "Who are the major potato processing companies in South Africa?", a: "McCain Foods South Africa (frozen fries, based in Delmas, Mpumalanga) and Simba, a PepsiCo subsidiary, which holds 40–50% of the crisp/chip segment. Both companies set their own variety and quality specifications with contracted growers." },
      { q: "What is the biggest challenge facing South African potato farmers?", a: "Water scarcity is the foremost challenge — South Africa receives about half the world's average rainfall and 60% of the crop is irrigated. Electricity instability from load-shedding and land-reform policy uncertainty are the other two recurring structural pressures." },
    ],
    regionalContext: [
      { slug: "kenya", note: "East Africa peer, lower yield (9.7 t/ha)" },
      { slug: "egypt", note: "Africa's most prolific producer overall" },
      { slug: "algeria", note: "North Africa Saharan-irrigation peer" },
      { slug: "netherlands", note: "Dominant seed-variety source (HZPC)" },
    ],
    continueReading: [
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "McCain and Simba's processing operations in South Africa's Delmas and Isando plants." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How South Africa functions as the regional exporter for Southern Africa." },
      { href: "/knowledge/potato-water-footprint", tag: "Sustainability", title: "Potato Water Footprint", desc: "Why water scarcity is South Africa's foremost production constraint." },
      { href: "/country/kenya", tag: "Country", title: "Kenya Country Profile", desc: "The yield contrast that illustrates South Africa's commercialization advantage." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Egypt: full Country Intelligence Dossier (Tier 1, premium template) ── */
function EgyptProfilePage({ c }) {
  const data = {
    slug: "egypt", name: "Egypt", flag: c.flag, region: c.region,
    h1: "Egypt Potato Industry: Four Growing Seasons, a Trade Advantage No Rival Can Match (7&ndash;8.6M Tonnes)",
    tagLabel: "Egypt · Africa & Middle East",
    readMin: 12,
    accentLabel: "Egypt is the only major potato producer that can supply fresh potatoes for over half the year, thanks to four overlapping growing seasons. That trade advantage, plus a 25–34% cost edge over US fries, has tripled Egypt's frozen French fry exports in five years — with Brazil, of all places, now its largest fry buyer.",
    wikidata: "https://www.wikidata.org/wiki/Q79",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "7–8.6M tonnes (source-dependent)" },
      { label: "Growing seasons", value: "4 overlapping seasons" },
      { label: "Frozen fry exports (2024)", value: "219,913 tonnes (+46.5% YoY)" },
      { label: "Fresh exports (2024)", value: "1.17M tonnes" },
      { label: "Cost advantage vs. US fries", value: "25–34% cheaper" },
      { label: "Top fry buyer", value: "Brazil (49,897 tonnes, +236%)" },
    ],
    definitiveAnswer: '<strong>Egypt produced roughly 7&ndash;8.6 million tonnes of potatoes in 2024</strong> &mdash; figures vary by source and reference year (FAOSTAT\'s 2024 reading of 8.573M tonnes vs. a national profile\'s 6.869M tonnes), but every source agrees Egypt is the <strong>biggest potato producer in the Middle East</strong> and one of Africa\'s top producers, up from just 4.6&ndash;4.96 million tonnes a decade earlier. Egypt\'s defining structural advantage is unique globally: <strong>four overlapping growing seasons</strong> &mdash; early spring, summer, autumn, and premium winter crops &mdash; let it supply fresh potatoes for <strong>over half the year</strong>, something no European or North American producer can match. That advantage, combined with production costs that make Egyptian frozen French fries <strong>25&ndash;34% cheaper than US fries</strong>, has driven frozen fry exports to <strong>219,913 tonnes in 2024 (+46.5% year-on-year, tripled in five years)</strong> &mdash; with <strong>Brazil, a South American country, now Egypt\'s single largest fry buyer</strong>.',
    keyStats: [
      { value: "7–8.6M t", label: "2024 production" },
      { value: "4", label: "Growing seasons" },
      { value: "220K t", label: "2024 frozen fry exports" },
      { value: "25–34%", label: "Cost edge vs. US fries", accent: "#4CAF50" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Egypt's potato industry?" },
      { id: "four-seasons", l: "How does Egypt grow potatoes almost year-round?" },
      { id: "regions", l: "Where in Egypt are potatoes grown?" },
      { id: "varieties", l: "What potato varieties are grown in Egypt?" },
      { id: "processing", l: "Who are Egypt's major potato processors?" },
      { id: "trade", l: "Why is Egypt's frozen fry export boom so significant?" },
      { id: "challenges", l: "What challenges does Egypt's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Egypt's potato industry?",
        lead: "Egypt is the <strong>biggest potato producer in the Middle East</strong> and one of Africa's top producers. Different official sources put 2024 production between <strong>6.87 and 8.6 million tonnes</strong> &mdash; either reading confirms sustained, rapid growth: production crossed 4 million tonnes in 2011, 5 million in 2019, and 6 million in 2020.",
        quickFacts: [
          { label: "2011", value: "Crossed 4M tonnes" },
          { label: "2019", value: "Crossed 5M tonnes" },
          { label: "2020", value: "Crossed 6M tonnes" },
          { label: "2024", value: "6.87–8.6M tonnes (source-dependent)" },
        ],
        body: [
          "Growth has been consistent rather than volatile — one FAOSTAT-based reading shows production up 49% from 4.611 million tonnes in 2014 to 6.869 million by 2024; a separate national-data reading shows 2024 production up 1.9% year-on-year and 8.2% above the five-year average. We report the range rather than force a single number the underlying sources don't agree on.",
        ],
        source: "Source: FAOSTAT; DCA Market Intelligence; USDA FAS; FAO.",
      },
      { id: "four-seasons", dataCard: "seasons",
        h2: "How does Egypt grow potatoes almost year-round?",
        lead: "Egypt runs <strong>four overlapping growing seasons</strong> — a structural advantage genuinely unique among major producers, letting it supply fresh potatoes for <strong>over half the year</strong>.",
        table: {
          headers: ["Season", "Planting", "Harvest", "Share of production"],
          rows: [
            ["Early Spring", "November – December", "March – April", "&mdash;"],
            ["Summer", "January – March", "May – June", "30%"],
            ["Autumn", "August – mid-October", "December – mid-February", "40% (largest; mostly exported/processed)"],
            ["Premium Winter", "October – November", "February", "Premium high-value potatoes"],
          ],
        },
        body: [
          "The autumn crop is both the largest single season and the one that feeds most of Egypt's export and processing volume. No European or North American producer can replicate this: most large producers get one, or at most two, growing windows per year. This is the single structural fact underpinning Egypt's entire trade advantage.",
        ],
        source: "Source: Egypt Ministry of Agriculture crop calendars; USDA FAS.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Where in Egypt are potatoes grown?",
        lead: "The <strong>Nile Delta</strong> is the largest producing area, spanning Beheira, Dakahlia, and Gharbia governorates, alongside the traditional <strong>Nile Valley</strong> and a rapidly expanding frontier: desert <strong>New Lands</strong> reclaimed via pivot irrigation.",
        table: {
          headers: ["Region", "Role", "Notes"],
          rows: [
            ["Nile Delta (Beheira, Dakahlia, Gharbia)", "Largest, traditional zone", "Both fresh and processing potatoes; moderate winter temperatures"],
            ["New Lands (desert reclamation)", "Rapidly expanding", "Pivot irrigation converts desert to farmland; modern equipment"],
            ["Nile Valley", "Traditional growing area", "Moderate temperatures favorable for potatoes"],
          ],
        },
        body: [
          "The New Lands expansion is the growth frontier: it isn't limited by the Nile Delta's finite arable land, since pivot-irrigated desert conversion can, in principle, keep adding capacity — a structural advantage most established potato regions elsewhere in the world don't have.",
        ],
        source: "Source: Egypt Ministry of Agriculture; USDA FAS.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Egypt?",
        lead: "<strong>Spunta</strong> (Dutch-bred) is the most widely grown variety in Egypt, well-suited to the warm climate across all four growing seasons.",
        table: {
          headers: ["Variety", "Role"],
          rows: [
            ["Spunta", "Most widely grown; reliable across all four seasons"],
            ["Diamant", "Popular for fresh market"],
            ["Nicola", "Yellow-fleshed; good for export"],
            ["Lady Rosetta", "Processing variety"],
            ["Hermes", "Grown for chips"],
            ["Cara", "Popular table variety"],
          ],
        },
        source: "Source: Egypt Ministry of Agriculture; DCA Market Intelligence.",
      },
      { id: "processing", dataCard: "processing",
        h2: "Who are Egypt's major potato processors?",
        lead: "Five major processors produce approximately <strong>315,000 tonnes of frozen French fries per year</strong>. <strong>Farm Frites (Netherlands) / Americana Group (UAE)</strong> is the largest at 165,000 tonnes, following a three-decade partnership.",
        table: {
          headers: ["Processor", "Scale", "Notes"],
          rows: [
            ["Farm Frites / Americana Group", "165,000 t/yr (largest)", "Nov 2024: agreed to build a new Saudi Arabia factory (~70,000 t/yr projected)"],
            ["Fregys", "Significant", "&mdash;"],
            ["IFCG", "Significant", "&mdash;"],
            ["Al Bader Group (Frozena)", "30,000t (2023) → 150,000t target (2026)", "Growth strategy would make it Egypt's 2nd-largest processor"],
          ],
        },
        body: [
          "The Farm Frites / Americana Group expansion into Saudi Arabia is a notable regional-scale signal — Egyptian processing expertise and cost structure being exported into a neighboring Gulf market rather than just serving it via trade.",
        ],
        source: "Source: DCA Market Intelligence; company announcements.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Why is Egypt's frozen fry export boom so significant?",
        lead: "Egypt's <strong>frozen French fry exports reached 219,913 tonnes in 2024</strong>, up 46.5% year-on-year and roughly <strong>tripled in five years</strong>. Fresh potato exports reached <strong>1.17 million tonnes</strong> in the same year.",
        table: {
          headers: ["Buyer", "2024 volume", "YoY change"],
          rows: [
            ["Brazil", "49,897 t", "+236%"],
            ["Saudi Arabia", "48,576 t", "+224.7%"],
            ["United States", "33,290 t", "−14.5%"],
          ],
        },
        body: [
          "The Brazil figure is the standout: a South American country importing frozen fries from North Africa, up 236% in a single year, is a striking illustration of Egypt's cost competitiveness — Egyptian frozen fries run 25&ndash;34% cheaper than US fries. Egypt's trade advantages compound: unique year-round production capability, a strategic location for exports across Africa, the Middle East, and Asia, competitive production costs, growing processing capacity, and EU phytosanitary compliance that keeps European markets open.",
        ],
        source: "Source: FAOSTAT Trade; USDA FAS; DCA Market Intelligence.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Egypt's potato industry face?",
        lead: "Five constraints recur: <strong>water scarcity</strong> and Nile-allocation politics, the <strong>high cost of imported seed potatoes</strong>, <strong>soil salinity</strong> in delta regions, <strong>EU phytosanitary compliance</strong> requirements, and <strong>climate-change-driven heat stress</strong>.",
        body: [
          "Water is the binding long-term constraint given Egypt's near-total dependence on the Nile and ongoing regional water-allocation tensions. Seed-potato import costs are a persistent input-cost pressure since Egypt, like most non-European producers, imports the bulk of its certified seed from Dutch breeders.",
        ],
        source: "Source: FAOSTAT; DCA Market Intelligence; USDA FAS.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and trade statistics",
      "DCA Market Intelligence — processing industry and export data",
      "USDA FAS (Foreign Agricultural Service) — trade and market analysis",
      "FAO — production data and country context",
      "Egypt Ministry of Agriculture — crop calendars and regional data",
    ],
    faqItems: [
      { q: "How much potato does Egypt produce per year?", a: "Estimates for 2024 range from 6.87 to 8.6 million tonnes depending on the source, but all agree Egypt is the Middle East's largest potato producer and one of Africa's top producers, roughly doubling production since 2014." },
      { q: "How does Egypt grow potatoes year-round?", a: "Egypt runs four overlapping growing seasons — early spring, summer, autumn, and premium winter — letting it supply fresh potatoes for over half the year, a structural advantage no European or North American producer can match." },
      { q: "Why are Egyptian frozen fries so competitive globally?", a: "Egyptian frozen French fries are 25–34% cheaper than US fries, driven by lower production costs and the country's unique multi-season growing advantage. This has driven frozen fry exports to 219,913 tonnes in 2024, tripling in five years." },
      { q: "Who buys Egypt's frozen French fries?", a: "Brazil is now Egypt's largest fry buyer (49,897 tonnes in 2024, up 236%), followed by Saudi Arabia (48,576 tonnes, up 224.7%) and the United States (33,290 tonnes, down 14.5%)." },
      { q: "What potato variety is most grown in Egypt?", a: "Spunta, a Dutch-bred variety, is the most widely grown potato in Egypt, valued for its reliability across all four of the country's growing seasons." },
    ],
    regionalContext: [
      { slug: "algeria", note: "North Africa, Saharan-irrigation peer" },
      { slug: "turkey", note: "Mediterranean / ME #1 by volume" },
      { slug: "south-africa", note: "Africa's highest-yield producer" },
      { slug: "netherlands", note: "Seed-potato source (Spunta, Diamant breeding)" },
    ],
    continueReading: [
      { href: "/blog/egypt-365-day-potatoes", tag: "Analysis", title: "How Egypt Grows Potatoes 365 Days a Year", desc: "The story-format deep dive on Egypt's four-season growing advantage." },
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "Farm Frites, Americana, and Egypt's frozen-fry export machine." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How Egypt undercuts US and European fry prices by 25–34%." },
      { href: "/country/belgium", tag: "Country", title: "Belgium Country Profile", desc: "The world's #1 fry exporter, and the competitor Egypt is chasing." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Peru: full Country Intelligence Dossier (Tier 1, premium template) ── */
function PeruProfilePage({ c }) {
  const data = {
    slug: "peru", name: "Peru", flag: c.flag, region: c.region,
    h1: "Peru Potato Industry: Birthplace of the Crop, Home to Over 3,000 Native Varieties (6.5M Tonnes)",
    tagLabel: "Peru · South America",
    readMin: 11,
    accentLabel: "Every potato eaten anywhere in the world traces back to the Andes, and Peru is where domestication happened — over 8,000 years ago. Today Peru grows more distinct potato varieties than any other country on Earth, and hosts the International Potato Center (CIP), the crop's global genetic archive.",
    wikidata: "https://www.wikidata.org/wiki/Q419",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "6.492M tonnes" },
      { label: "Native varieties", value: "3,000+ (most of any country)" },
      { label: "10-year growth (2014–24)", value: "+38.0%" },
      { label: "Yield", value: "41.8 t/ha" },
      { label: "CIP headquarters", value: "Lima, Peru" },
      { label: "National Potato Day", value: "May 30" },
    ],
    definitiveAnswer: '<strong>Peru produced 6.492 million tonnes of potatoes in 2024</strong> on 337,281 hectares at a yield of 41.8 t/ha (FAOSTAT) &mdash; up 38.0% from 4.705 million tonnes in 2014. But Peru\'s significance to the global potato story isn\'t about tonnage: Peru is the <strong>birthplace of the potato</strong>, domesticated in the Andean highlands over <strong>8,000 years ago</strong>, and today grows <strong>more than 3,000 native varieties</strong> &mdash; more genetic diversity than any other country on Earth. The <strong>International Potato Center (CIP)</strong>, the crop\'s global research and genebank institution, is headquartered in Lima, and Peru celebrates <strong>National Potato Day on May 30th</strong>. Commercial production centers on <strong>Canchan</strong> (the most widely grown variety) alongside thousands of indigenous varieties preserved by highland farming communities around Puno and Lake Titicaca &mdash; the historical epicenter of potato domestication.',
    keyStats: [
      { value: "6.49M t", label: "2024 production" },
      { value: "3,000+", label: "Native varieties grown" },
      { value: "+38.0%", label: "10-yr production growth", accent: "#4CAF50" },
      { value: "8,000+ yrs", label: "Since domestication" },
    ],
    tocItems: [
      { id: "origin", l: "Why is Peru called the birthplace of the potato?" },
      { id: "industry-size", l: "How big is Peru's modern potato industry?" },
      { id: "regions", l: "Where in Peru are potatoes grown?" },
      { id: "varieties", l: "What potato varieties are grown in Peru?" },
      { id: "cip", l: "What is the International Potato Center (CIP)?" },
      { id: "processing", l: "Does Peru process or export potatoes?" },
      { id: "challenges", l: "What challenges does Peru's potato sector face?" },
    ],
    cards: [
      { id: "origin", dataCard: "origin",
        h2: "Why is Peru called the birthplace of the potato?",
        lead: "The potato was <strong>domesticated in the Andean highlands over 8,000 years ago</strong>, and Peru — alongside neighboring Bolivia — is the historical center of that domestication. Potato was already being traded in Northern Peru around 600 AD, long before European contact.",
        callout: { number: "8,000+", context: "years since the potato was first domesticated in the Andean highlands around what is now Peru and Bolivia. Every commercial potato variety grown anywhere in the world today ultimately traces its genetic lineage back to this region.", source: "CIP (International Potato Center); FAO" },
        body: [
          "This isn't a marketing claim — it's the scientific and historical consensus, and it's why Peru's native varietal diversity matters far beyond its own borders: the wild and semi-domesticated genetic material still growing in Andean smallholder plots is a working archive of traits (frost tolerance, disease resistance, nutritional diversity) that modern breeding programs worldwide are only beginning to systematically tap.",
        ],
        source: "Source: CIP (International Potato Center); FAO.",
      },
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Peru's modern potato industry?",
        lead: "Peru produced <strong>6.492 million tonnes in 2024</strong> on 337,281 hectares at a yield of <strong>41.8 t/ha</strong> (FAOSTAT) &mdash; growth of 38.0% from 4.705 million tonnes just a decade earlier in 2014.",
        quickFacts: [
          { label: "2014 production", value: "4.705M tonnes" },
          { label: "2024 production", value: "6.492M tonnes" },
          { label: "Yield", value: "41.8 t/ha" },
          { label: "10-yr growth", value: "+38.0%" },
        ],
        source: "Source: FAOSTAT; UN FAO.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Where in Peru are potatoes grown?",
        lead: "<strong>Puno Region</strong>, around Lake Titicaca — the historical center of potato origin — has the highest production volume, followed by Huancavelica, Junín, Cusco, Cajamarca, Huánuco, and coastal Lima.",
        table: {
          headers: ["Region", "Role", "Notes"],
          rows: [
            ["Puno", "Highest production volume", "Around Lake Titicaca; center of potato origin; traditional highland varieties dominate"],
            ["Cusco", "Important highland producer", "Historic center of Inca potato cultivation"],
            ["Huancavelica, Junín, Cajamarca, Huánuco", "Major highland producers", "Central and northern highland zones"],
            ["Lima coast", "Commercial production", "Serves urban markets, distinct from highland smallholder systems"],
          ],
        },
        body: [
          "Growing season varies sharply by altitude: highland planting runs October–November with an April–June harvest, while coastal planting runs April–June with an August–November harvest — meaning Peru effectively has staggered production across its highland and coastal systems even without a single unified national season.",
        ],
        source: "Source: National agricultural statistics of Peru; USDA FAS.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Peru?",
        lead: "<strong>Canchan</strong> is the most commercially grown variety, but Peru's real distinction is scale of diversity: <strong>over 3,000 native varieties</strong> are still cultivated by indigenous Andean farming communities.",
        table: {
          headers: ["Variety", "Type", "Role"],
          rows: [
            ["Canchan", "Commercial", "Most widely grown commercial variety"],
            ["Yungay", "Commercial / highland", "Popular in highland systems"],
            ["Unica", "Commercial", "Bred specifically for coastal production"],
            ["Capiro", "Commercial", "Processing variety"],
            ["Huayro", "Native", "Traditional highland variety"],
            ["Papa Amarilla (Yellow Potato)", "Native", "Premium native variety, prized culinarily"],
            ["Papa Nativa (thousands of varieties)", "Native", "The core of Peru's 3,000+ varietal diversity"],
          ],
        },
        source: "Source: National agricultural statistics of Peru; CIP.",
      },
      { id: "cip", dataCard: "cip",
        h2: "What is the International Potato Center (CIP)?",
        lead: "The <strong>International Potato Center (CIP)</strong>, headquartered in Lima, is the global research institution and genebank dedicated to the potato and other root/tuber crops — conserving irreplaceable Andean genetic diversity and running breeding programs used worldwide.",
        body: [
          "CIP's Lima genebank holds one of the world's largest collections of potato genetic material, much of it sourced from Peru and Bolivia's native varietal diversity. CIP-derived varieties and breeding lines show up throughout this site's other country profiles — from China's Qingshu 9 (UNICA) to breeding programs across Africa and South Asia — making Peru's genetic heritage a working input into global food security well beyond its own production statistics.",
        ],
        source: "Source: CIP (International Potato Center), Lima.",
      },
      { id: "processing", dataCard: "processing",
        h2: "Does Peru process or export potatoes?",
        lead: "Processing remains small relative to Peru's production scale. Lays (PepsiCo) and local companies operate domestically, and Peru is deliberately pursuing <strong>value-added native-potato products</strong> — purple potato chips, native potato flour — as an export niche distinct from commodity fry/chip processing.",
        body: [
          "Export markets include the USA, Europe, and neighboring South American countries, with growing interest specifically in native-variety products that leverage Peru's unique genetic diversity as a premium/specialty positioning rather than competing head-on with commodity processors in Belgium, the US, or China.",
        ],
        source: "Source: National agricultural statistics of Peru; USDA FAS.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Peru's potato sector face?",
        lead: "Five recurring constraints: <strong>climate change</strong> affecting highland growing conditions, <strong>preserving genetic diversity</strong> of native varieties, <strong>connecting smallholder farmers to markets</strong>, <strong>storage and transport infrastructure</strong> gaps, and <strong>late blight</strong> pressure in humid highland regions.",
        body: [
          "Climate change is a particularly acute concern for Peru specifically, since so much of its varietal diversity is tied to specific highland microclimates that shifting temperature and rainfall patterns can disrupt — making genetic-diversity preservation and climate adaptation two sides of the same challenge rather than separate issues.",
        ],
        source: "Source: National agricultural statistics of Peru; CIP.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and yield statistics",
      "CIP (International Potato Center), Lima — genetic diversity, origin, and breeding data",
      "USDA FAS — trade and market data",
      "National agricultural statistics of Peru",
    ],
    faqItems: [
      { q: "How much potato does Peru produce per year?", a: "Peru produced 6.492 million tonnes in 2024 (FAOSTAT) on 337,281 hectares — up 38.0% from 4.705 million tonnes in 2014." },
      { q: "Why is Peru called the birthplace of the potato?", a: "The potato was domesticated in the Andean highlands of what is now Peru and Bolivia over 8,000 years ago. Peru still grows over 3,000 native varieties, more genetic diversity than any other country." },
      { q: "What is the most grown potato variety in Peru?", a: "Canchan is the most commercially grown variety, though Peru's real distinction is the over 3,000 native varieties cultivated by indigenous Andean farming communities alongside commercial cultivars." },
      { q: "Why is the International Potato Center (CIP) in Peru?", a: "CIP is headquartered in Lima because Peru is the historical center of potato domestication and holds one of the world's largest potato genetic collections — much of it sourced directly from Peruvian and Bolivian native varietal diversity." },
      { q: "Does Peru export potatoes?", a: "Yes, though on a smaller scale than major commodity exporters — Peru exports fresh and processed potatoes to the USA, Europe, and neighboring South American countries, with a growing focus on premium native-variety products like purple potato chips." },
    ],
    regionalContext: [
      { slug: "colombia", note: "Andean neighbor, papa criolla specialty" },
      { slug: "brazil", note: "South America's largest producer" },
      { slug: "mexico", note: "Americas peer, processing-focused" },
      { slug: "united-states", note: "Major export market for Peruvian products" },
    ],
    continueReading: [
      { href: "/blog/andean-potato-origin-story", tag: "History", title: "The Andean Potato Origin Story", desc: "How the Andes — including Peru's highlands — domesticated the potato 8,000+ years ago." },
      { href: "/knowledge/potato-varieties-guide", tag: "Varieties", title: "Potato Varieties Guide", desc: "Peru's 3,000+ native varieties in global varietal context." },
      { href: "/knowledge/potato-history-origin", tag: "History", title: "Where Did the Potato Originate?", desc: "The full domestication story, centered on Peru and Bolivia." },
      { href: "/country/colombia", tag: "Country", title: "Colombia Country Profile", desc: "Peru's Andean neighbor and fellow custodian of native potato diversity." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Canada: full Country Intelligence Dossier (Tier 1, premium template) ── */
function CanadaProfilePage({ c }) {
  const data = {
    slug: "canada", name: "Canada", flag: c.flag, region: c.region,
    h1: "Canada Potato Industry: Home of McCain Foods, $3.7B in Exports, 93% Bound for the US",
    tagLabel: "Canada · Americas",
    readMin: 12,
    accentLabel: "Canada's potato sector generates $2.1 billion in farm cash receipts and $3.7 billion in exports — and it's almost entirely dependent on one customer. 93% of Canada's fresh potato export value goes to the United States, the same market McCain Foods, the world's largest frozen-fry producer, was built to serve from its New Brunswick headquarters.",
    wikidata: "https://www.wikidata.org/wiki/Q16",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "~6.5M tonnes (FAOSTAT)" },
      { label: "Farm cash receipts (2024)", value: "$2.1B CAD" },
      { label: "Export value (2024/25)", value: "$3.7B CAD (+2% YoY)" },
      { label: "Top producing province", value: "Alberta (23.5%)" },
      { label: "Fresh export dependence on US", value: "92.9% of export value" },
      { label: "Processing share", value: "~69% of production" },
    ],
    definitiveAnswer: '<strong>Canada produced approximately 6.5 million tonnes of potatoes in 2024</strong> (FAOSTAT), making potato the country\'s <strong>5th-largest primary agricultural crop</strong> and its single largest vegetable crop. The sector generated <strong>$2.1 billion CAD in farm cash receipts</strong> in 2024 and <strong>$3.7 billion CAD in exports</strong> in 2024/2025, up 2% year-on-year. Production splits roughly <strong>69% to processing, 20% to fresh/table markets, and 11% to seed</strong>. <strong>Alberta (23.5%), Manitoba (21.4%), and Prince Edward Island (20.2%)</strong> lead production by tonnage, though PEI dominates fresh exports specifically. Canada\'s trade is almost entirely one-directional: <strong>92.9% of fresh potato export value goes to the United States</strong> &mdash; the same market that made <strong>McCain Foods</strong>, headquartered in Florenceville, New Brunswick, the world\'s largest frozen French fry producer.',
    keyStats: [
      { value: "6.5M t", label: "2024 production" },
      { value: "$3.7B", label: "2024/25 exports (CAD)" },
      { value: "92.9%", label: "Fresh export value to US" },
      { value: "69%", label: "Share going to processing" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Canada's potato industry?" },
      { id: "regions", l: "Which Canadian provinces produce the most potatoes?" },
      { id: "processing", l: "Why is Canada the home of McCain Foods?" },
      { id: "varieties", l: "What potato varieties are grown in Canada?" },
      { id: "trade", l: "How dependent is Canada on the US potato market?" },
      { id: "challenges", l: "What challenges does Canada's potato sector face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Canada's potato industry?",
        lead: "Canada's potato sector is the country's <strong>5th-largest primary agricultural crop</strong>, generating approximately <strong>$2.1 billion CAD in farm cash receipts</strong> in 2024. Potatoes account for <strong>29% of Canadian vegetable farm cash receipts</strong> and 17% of all horticultural receipts.",
        quickFacts: [
          { label: "2024 production", value: "~6.5M tonnes (FAOSTAT)" },
          { label: "Farm cash receipts", value: "$2.1B CAD" },
          { label: "Share of vegetable receipts", value: "29%" },
          { label: "Total harvested area", value: "156,309 ha" },
        ],
        body: [
          "Regional economic significance varies enormously: potatoes contributed nearly <strong>35% of Prince Edward Island's total farm cash receipts</strong> and 18% of New Brunswick's, but only 5% and 2% of Manitoba's and Alberta's respectively — despite Alberta and Manitoba having higher absolute production tonnage. The crop matters existentially to PEI's economy in a way it simply doesn't for the larger prairie provinces.",
        ],
        source: "Source: Agriculture and Agri-Food Canada (AAFC), Potato Market Information Review 2024-2025.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which Canadian provinces produce the most potatoes?",
        lead: "<strong>Alberta leads production at 23.5%</strong>, followed by Manitoba (21.4%) and Prince Edward Island (20.2%) — though PEI remains Canada's most iconic and export-dominant potato region.",
        table: {
          headers: ["Province", "Production (2024)", "Share"],
          rows: [
            ["Alberta", "1,364,814 t", "23.5%"],
            ["Manitoba", "1,244,930 t", "21.4%"],
            ["Prince Edward Island", "1,176,165 t", "20.2%"],
            ["New Brunswick", "771,379 t", "13.3%"],
            ["Quebec", "675,898 t", "11.6%"],
            ["Ontario", "404,378 t", "7.0%"],
          ],
        },
        body: [
          "PEI's outsized reputation relative to its 20.2% production share comes from export concentration: it accounts for <strong>38.9% of fresh potato export value</strong> and 36.2% of export quantity, more than any other province, despite Alberta and Manitoba out-producing it by tonnage. Alberta and Manitoba's larger crops feed heavily into processing rather than fresh export.",
        ],
        source: "Source: AAFC Potato Market Information Review 2024-2025.",
      },
      { id: "processing", dataCard: "processing",
        h2: "Why is Canada the home of McCain Foods?",
        lead: "<strong>McCain Foods</strong>, the world's largest frozen French fry producer, was founded in and remains headquartered in <strong>Florenceville, New Brunswick</strong>. <strong>Cavendish Farms</strong> is the other major Canadian processor. Roughly <strong>69% of Canadian production</strong> goes to processing.",
        body: [
          "Major processing provinces span Alberta, Manitoba, New Brunswick, Prince Edward Island, and Ontario — meaning processing capacity is distributed close to where the crop is actually grown, rather than concentrated in one region. Canada's processing scale, combined with its proximity to the massive US market, is what makes it a genuine peer to the US in global frozen-fry production, not just a smaller neighbor.",
        ],
        source: "Source: AAFC Potato Market Information Review 2024-2025; McCain Foods corporate information.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Canada?",
        lead: "<strong>Russet Burbank</strong> is the dominant processing variety, alongside Shepody (also processing) and table varieties including <strong>Yukon Gold</strong> — developed in Canada at the University of Guelph.",
        table: {
          headers: ["Variety", "Role"],
          rows: [
            ["Russet Burbank", "Dominant processing variety"],
            ["Shepody", "Important processing variety"],
            ["Ranger Russet", "Growing in popularity"],
            ["Yukon Gold", "Table variety; developed at University of Guelph, Canada"],
            ["Norland", "Red-skinned table variety"],
            ["Atlantic", "Chipping variety"],
            ["Goldrush", "Table variety"],
          ],
        },
        body: [
          "Yukon Gold's Canadian origin is a genuine point of pride: developed at the University of Guelph, its buttery yellow flesh and versatility made it one of the most-recognized specialty varieties in North America, exported far beyond Canada's own commercial acreage.",
        ],
        source: "Source: AAFC; University of Guelph variety-release records.",
      },
      { id: "trade", dataCard: "trade",
        h2: "How dependent is Canada on the US potato market?",
        lead: "Extremely. The <strong>United States takes 92.9% of Canadian fresh potato export value</strong> ($474.7 million CAD of $510.8 million total) and <strong>95.2% of seed potato export value</strong>. Smaller markets include Indonesia, Trinidad and Tobago, the Dominican Republic, and Thailand.",
        table: {
          headers: ["Market", "Fresh export value share (2024/25)"],
          rows: [
            ["United States", "92.9%"],
            ["Trinidad and Tobago", "1.8%"],
            ["Indonesia", "1.7%"],
            ["Dominican Republic", "0.9%"],
            ["Thailand", "0.6%"],
          ],
        },
        body: [
          "This concentration is a structural feature of Canada's potato trade, not a temporary imbalance — geographic proximity and integrated North American supply chains (especially for frozen processed products, which dominate exports beyond fresh) make the US the natural, overwhelming primary market. Canada also exports to Japan and Mexico, primarily in processed/frozen categories.",
        ],
        source: "Source: AAFC Potato Market Information Review 2024-2025.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Canada's potato sector face?",
        lead: "Five recurring constraints: a <strong>short northern growing season</strong>, near-total <strong>trade dependence on the US market</strong>, <strong>potato wart disease</strong> management (particularly in PEI), <strong>rising input costs</strong>, and intensifying <strong>competition in the global frozen-fry market</strong>.",
        body: [
          "Potato wart disease specifically has been a recurring trade-policy flashpoint for PEI, since detections have previously triggered temporary US import restrictions on PEI potatoes — a direct illustration of just how exposed Canada's potato economy is to decisions made by a single trading partner.",
        ],
        source: "Source: AAFC Potato Market Information Review 2024-2025.",
      },
    ],
    sourceList: [
      "Agriculture and Agri-Food Canada (AAFC) — Potato Market Information Review 2024-2025",
      "FAOSTAT — production time series",
      "McCain Foods — corporate and headquarters information",
      "University of Guelph — Yukon Gold variety-release records",
    ],
    faqItems: [
      { q: "How much potato does Canada produce per year?", a: "Canada produced approximately 6.5 million tonnes in 2024 (FAOSTAT), making it the country's 5th-largest primary agricultural crop and generating $2.1 billion CAD in farm cash receipts." },
      { q: "Which Canadian province produces the most potatoes?", a: "Alberta leads by tonnage at 23.5% of national production, followed by Manitoba (21.4%) and Prince Edward Island (20.2%). PEI, however, leads fresh potato exports specifically at 38.9% of export value." },
      { q: "Where is McCain Foods headquartered?", a: "Florenceville, New Brunswick, Canada. McCain Foods is the world's largest frozen French fry producer, and roughly 69% of Canada's total potato production goes to processing." },
      { q: "Does Canada export most of its potatoes to the US?", a: "Yes — the United States takes 92.9% of Canadian fresh potato export value and 95.2% of seed potato export value, making Canada's potato trade almost entirely dependent on its southern neighbor." },
      { q: "What potato variety was developed in Canada?", a: "Yukon Gold, a buttery yellow-fleshed table variety, was developed at the University of Guelph in Ontario and has become one of the most widely recognized specialty potato varieties in North America." },
    ],
    regionalContext: [
      { slug: "united-states", note: "Dominant trade partner (92.9% of exports)" },
      { slug: "mexico", note: "Secondary North American export market" },
      { slug: "japan", note: "Processed-product export market" },
      { slug: "netherlands", note: "Global processing/seed-export peer" },
    ],
    continueReading: [
      { href: "/knowledge/potato-processing-industry", tag: "Processing", title: "The Global Potato Processing Industry", desc: "McCain Foods, Cavendish Farms, and Canada's role in world frozen-fry supply." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Why 93% of Canada's fresh export value flows to a single market." },
      { href: "/country/united-states", tag: "Country", title: "United States Country Profile", desc: "Canada's dominant, near-total trade partner for potato exports." },
      { href: "/knowledge/potato-varieties-guide", tag: "Varieties", title: "Potato Varieties Guide", desc: "Yukon Gold and Canada's contribution to global potato varietal development." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── United Kingdom: full Country Intelligence Dossier (Tier 1, premium template) ── */
function UnitedKingdomProfilePage({ c }) {
  const data = {
    slug: "united-kingdom", name: "United Kingdom", flag: c.flag, region: c.region,
    h1: "UK Potato Industry: Home of Maris Piper and Fish & Chips, But a 2.2M-Tonne Net Importer",
    tagLabel: "United Kingdom · Europe",
    readMin: 12,
    accentLabel: "The UK is one of the world's most potato-obsessed nations — 10,500 fish and chip shops, Maris Piper the default variety — yet domestic production covers only 68% of total supply. Seed potato prices jumped 35% in a single year as 2024's brutal wet spring forced growers into early desiccation just to get a harvest in.",
    wikidata: "https://www.wikidata.org/wiki/Q145",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024, DEFRA)", value: "5.137M tonnes" },
      { label: "Domestic supply coverage", value: "68% of total supply" },
      { label: "Net trade gap (2024)", value: "+2.22M tonnes imported" },
      { label: "Production value (2024)", value: "£1.46B (+28% YoY)" },
      { label: "Seed price (2024)", value: "£440/tonne (+34.9% YoY)" },
      { label: "Fish & chip shops", value: "~10,500 nationwide" },
    ],
    definitiveAnswer: '<strong>The UK produced 5.137 million tonnes of potatoes in 2024</strong> (DEFRA), recovering 9.8% from a weather-hit 4.678 million tonnes in 2023, when persistent wet conditions delayed spring planting by roughly a month and forced many growers into early desiccation despite the yield penalty. Even in a good year, though, <strong>domestic production covers only 68% of total UK supply</strong> &mdash; the UK imported 2.633 million tonnes against exports of just 412,000 tonnes in 2024, a <strong>net import gap of 2.22 million tonnes, the widest in three years</strong>. The value side tells a starker story: total production value hit <strong>&pound;1.46 billion in 2024, up 28% year-on-year</strong>, on only a modest volume recovery &mdash; reflecting sharply higher farm-gate prices, with <strong>seed potato prices surging 34.9% to a record &pound;440/tonne</strong>. <strong>Maris Piper</strong> remains the UK\'s most popular variety, and the country\'s <strong>~10,500 fish and chip shops</strong> anchor one of the world\'s most potato-centric food cultures.',
    keyStats: [
      { value: "5.14M t", label: "2024 production" },
      { value: "68%", label: "Domestic supply share" },
      { value: "£1.46B", label: "2024 production value" },
      { value: "+34.9%", label: "Seed price jump, 2024", accent: "#C62828" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is the UK potato industry?" },
      { id: "trade-gap", l: "Why is the UK a net importer of potatoes?" },
      { id: "prices", l: "Why did UK potato and seed prices spike in 2024?" },
      { id: "regions", l: "Where are potatoes grown in the UK?" },
      { id: "varieties", l: "What potato varieties are grown in the UK?" },
      { id: "processing", l: "How central is potato to UK food culture?" },
      { id: "challenges", l: "What challenges does the UK potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is the UK potato industry?",
        lead: "The UK produced <strong>5.137 million tonnes in 2024</strong> (DEFRA), a 9.8% recovery from 2023's weather-hit 4.678 million tonnes, harvested from 111,000 hectares at a yield of 46 t/ha.",
        quickFacts: [
          { label: "2022 production", value: "5.522M tonnes" },
          { label: "2023 production", value: "4.678M tonnes (weather-hit)" },
          { label: "2024 production", value: "5.137M tonnes (+9.8%)" },
          { label: "2024 uses", value: "4.095M t human consumption; 539K t seed" },
        ],
        body: [
          "2024's recovery came despite a genuinely difficult growing season: persistent wet conditions delayed spring planting by approximately a month, and many growers opted for early desiccation — accepting a yield penalty — simply to ensure the crop could be harvested at all before conditions worsened further.",
        ],
        source: "Source: DEFRA (Department for Environment, Food and Rural Affairs), Agriculture in the United Kingdom 2024, Table 7.10a.",
      },
      { id: "trade-gap", dataCard: "trade",
        h2: "Why is the UK a net importer of potatoes?",
        lead: "UK domestic production covers only <strong>68% of total supply</strong>. In 2024, the UK imported <strong>2.633 million tonnes</strong> against exports of just <strong>412,000 tonnes</strong> — a net trade gap of <strong>2.22 million tonnes, the widest in three years</strong>.",
        table: {
          headers: ["Metric", "2022", "2023", "2024"],
          rows: [
            ["UK production", "4,519K t", "4,092K t", "4,634K t"],
            ["Imports", "2,482K t", "2,439K t", "2,633K t"],
            ["Exports", "466K t", "426K t", "412K t"],
            ["Net trade (imports − exports)", "+2,015K t", "+2,013K t", "+2,220K t"],
            ["Production as % of total supply", "69%", "67%", "68%"],
          ],
        },
        body: [
          "The composition of imports is telling: processed potatoes (raw equivalent) dominate at 2.295 million tonnes in 2024, meaning the UK's import dependence is concentrated in value-added products, not just raw table potatoes. Notably, the Early/Maincrop category flipped from net export to net import (+18,000 tonnes) for the first time in 2024 — while the UK actually remains a net exporter of seed potatoes, where exports exceed imports by 93,000 tonnes.",
        ],
        source: "Source: DEFRA, Agriculture in the United Kingdom 2024, Table 7.10c.",
      },
      { id: "prices", dataCard: "prices",
        h2: "Why did UK potato and seed prices spike in 2024?",
        lead: "Total production value reached <strong>&pound;1.46 billion in 2024, up 28%</strong> from &pound;1.138 billion in 2023 — on only a modest volume recovery. <strong>Seed potato prices hit a record &pound;440/tonne, up 34.9% in a single year</strong>, reflecting acute supply tightness.",
        callout: { number: "£440", context: "per tonne — the record UK seed-potato price in 2024, up 34.9% year-on-year. Maincrop human-consumption prices also rose, but less sharply, up 10.4% to £298/tonne — meaning the seed shortage was disproportionately severe relative to the table-potato market.", source: "DEFRA, Agriculture in the United Kingdom 2024, Table 7.10b" },
        body: [
          "This price surge is the direct market signal of 2024's difficult growing conditions: a weather-damaged 2023 crop plus a delayed, disrupted 2024 planting season squeezed available seed supply hard, and prices moved accordingly. Human-consumption maincrop and early prices rose more modestly, up 10.4% to &pound;298/tonne.",
        ],
        source: "Source: DEFRA, Agriculture in the United Kingdom 2024, Table 7.10b.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Where are potatoes grown in the UK?",
        lead: "<strong>East Anglia</strong> (Norfolk and Suffolk) is the largest producing area, followed by Lincolnshire and Yorkshire. <strong>Scotland</strong> is the primary seed-production region, valued for its cool climate and low aphid pressure — critical for disease-free seed.",
        table: {
          headers: ["Region", "Role"],
          rows: [
            ["East Anglia (Norfolk, Suffolk)", "Largest producing area; irrigated production"],
            ["Lincolnshire", "Major producing county; flat, fertile land"],
            ["Yorkshire", "Significant northern England production"],
            ["Scotland", "Primary seed-production region (cool climate, low aphid pressure)"],
            ["Shropshire", "Western English production area"],
            ["Cornwall & Jersey", "Premium early potatoes, available from May"],
          ],
        },
        body: [
          "UK-wide potato area rose from ~118,000 hectares (2023-24, stable) to 127,000 hectares in 2025 — a 7.2% jump, and one of very few crop categories to see area growth that year while oilseeds and other arable crops declined. In England specifically, potatoes have consistently held 2% of total croppable area from 2021 to 2025 — the only non-cereal arable crop to hold its land share that consistently over five years.",
        ],
        source: "Source: DEFRA, Agricultural Land Use in the United Kingdom / England at 1 June 2025.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in the UK?",
        lead: "<strong>Maris Piper</strong> is the UK's most popular variety at <strong>11.8% of planted area</strong> — prized for chips/fries — followed by King Edward for roasting and several other established table varieties.",
        table: {
          headers: ["Variety", "Role"],
          rows: [
            ["Maris Piper", "Most popular (11.8% of area); excellent for chips/fries"],
            ["King Edward", "Traditional roasting variety"],
            ["Maris Bard", "Early variety"],
            ["Estima", "All-purpose variety"],
            ["Rooster", "Popular in retail"],
            ["Markies", "Processing variety"],
          ],
        },
        source: "Source: DEFRA / AHDB historical variety data; UK grower body reporting.",
      },
      { id: "processing", dataCard: "processing",
        h2: "How central is potato to UK food culture?",
        lead: "Fish and chips is a genuine national institution, served by an estimated <strong>10,500 fish and chip shops</strong> across the UK. Major processors include <strong>McCain Foods, Lamb Weston, and Kettle Chips</strong>, and the UK is one of Europe's largest per-capita consumers of potato products.",
        body: [
          "The industry itself is fairly concentrated at the grower level: fewer than <strong>1,700 grower businesses</strong> produce the majority of the UK crop, and the sector has continued consolidating toward fewer, larger farms — a structural trend distinct from, but related to, the pricing and weather pressures shaping recent years.",
        ],
        source: "Source: DEFRA; UK grower body industry-structure reporting.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does the UK potato industry face?",
        lead: "Five recurring pressures: <strong>post-Brexit trade barriers with the EU</strong>, <strong>water stress in eastern growing regions</strong>, <strong>potato blight management</strong>, <strong>declining per-capita fresh potato consumption</strong>, and rising <strong>competition from rice and pasta</strong> as staple carbohydrate choices.",
        body: [
          "The UK imports early-season potatoes specifically from Egypt, Israel, and Cyprus to bridge the gap before domestic early crops (from Cornwall and Jersey) become available — a reminder that even the UK's own seasonal supply chain leans on international trade well beyond the headline import-dependence statistic.",
        ],
        source: "Source: DEFRA; UK grower body reporting.",
      },
    ],
    sourceList: [
      "DEFRA (Department for Environment, Food and Rural Affairs) — Agriculture in the United Kingdom 2024, Tables 7.10a–7.10c",
      "DEFRA — Agricultural Land Use in the United Kingdom / England at 1 June 2025",
      "AHDB (historical variety and industry-structure data)",
    ],
    faqItems: [
      { q: "How much potato does the UK produce per year?", a: "The UK produced 5.137 million tonnes in 2024 (DEFRA), recovering 9.8% from a weather-hit 4.678 million tonnes in 2023." },
      { q: "Does the UK import most of its potatoes?", a: "The UK is a significant net importer — domestic production covers only 68% of total supply. In 2024 the UK imported 2.633 million tonnes against exports of 412,000 tonnes, a net gap of 2.22 million tonnes, the widest in three years." },
      { q: "Why did UK seed potato prices jump in 2024?", a: "Seed potato prices hit a record £440/tonne in 2024, up 34.9% year-on-year, driven by acute supply tightness after a weather-damaged 2023 crop and a delayed, wet 2024 planting season." },
      { q: "What is the most popular potato variety in the UK?", a: "Maris Piper, accounting for 11.8% of planted area, is the UK's most popular variety, prized especially for chips and fries." },
      { q: "How many fish and chip shops are there in the UK?", a: "Approximately 10,500 fish and chip shops operate across the UK, making it one of the world's most potato-centric national food cultures." },
    ],
    regionalContext: [
      { slug: "netherlands", note: "Major EU potato/seed trading partner" },
      { slug: "belgium", note: "Post-Brexit EU trade context" },
      { slug: "france", note: "European peer producer" },
      { slug: "egypt", note: "Early-season potato import source" },
    ],
    continueReading: [
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How post-Brexit dynamics reshaped UK-EU potato trade flows." },
      { href: "/knowledge/potato-varieties-guide", tag: "Varieties", title: "Potato Varieties Guide", desc: "Maris Piper and the UK's chip-shop variety standard." },
      { href: "/blog/complete-potato-varieties-guide", tag: "Varieties", title: "A Complete Guide to Potato Varieties", desc: "How Maris Piper became the UK's default chip variety." },
      { href: "/country/netherlands", tag: "Country", title: "Netherlands Country Profile", desc: "The world's #1 seed-potato exporter and a key UK trading partner." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── France: full Country Intelligence Dossier (Tier 1, premium template) ── */
function FranceProfilePage({ c }) {
  const data = {
    slug: "france", name: "France", flag: c.flag, region: c.region,
    h1: "France Potato Industry: Europe's #1 Raw Potato Exporter, Riding a Frozen-Fry Investment Boom",
    tagLabel: "France · Europe",
    readMin: 12,
    accentLabel: "Northern France's wheat and sugar-beet fields are turning into potato fields, fast — McCain, Clarebout, Agristo, and Ecofrost have all built or expanded plants there as Belgium and the Netherlands run out of rotation-friendly land. France is now the world's #1 raw potato exporter by value, but the same boom is starting to create an oversupply problem.",
    wikidata: "https://www.wikidata.org/wiki/Q142",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "8.6M tonnes" },
      { label: "10-year growth", value: "+6.4% (2014–24)" },
      { label: "Raw potato exports (2024)", value: "$1.41B (19.8% of global, #1)" },
      { label: "Export growth (2023–24)", value: "+28% (fastest globally)" },
      { label: "French fry export growth", value: "+33.3% (2023–24)" },
      { label: "Top region", value: "Hauts-de-France (~40% of output)" },
    ],
    definitiveAnswer: "<strong>France produced 8.606 million tonnes of potatoes in 2024</strong> on 217,680 hectares at a yield of 42.2 t/ha (FAOSTAT), up 6.4% from a decade earlier. But the headline number understates what's actually happening: harvest area hit a record 178,000 hectares in one recent year (+16%), and France has become the destination for a wave of frozen-fry processing investment — <strong>McCain (&euro;350 million expansion), Clarebout (new Bourbourg factory, 220,000-tonne capacity), Agristo (&euro;350 million, new plant planned 2027), and Ecofrost (200,000-tonne capacity)</strong> have all built or expanded in Northern France, as tight crop rotations push processors out of Belgium and the Netherlands. The result: France became the <strong>world's #1 raw potato exporter by value in 2024 at $1.41 billion (19.8% of the global total)</strong>, with exports growing 28% year-on-year &mdash; the fastest of any major exporter &mdash; and French fry exports up 33.3%. The same growth is starting to create a genuine <strong>oversupply risk</strong>, with production now outpacing demand in some seasons.",
    keyStats: [
      { value: "8.6M t", label: "2024 production" },
      { value: "$1.41B", label: "2024 raw exports, #1 globally" },
      { value: "+28%", label: "Export growth, 2023–24", accent: "#4CAF50" },
      { value: "€700M+", label: "New processing investment (McCain + Agristo)" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is France's potato industry?" },
      { id: "regions", l: "Which regions are driving France's potato boom?" },
      { id: "processing-boom", l: "Why is frozen-fry processing investment flooding into France?" },
      { id: "varieties", l: "What potato varieties are grown in France?" },
      { id: "trade", l: "Why is France the world's #1 raw potato exporter?" },
      { id: "challenges", l: "What challenges is France's potato boom creating?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is France's potato industry?",
        lead: "France produced <strong>8.606 million tonnes in 2024</strong> on 217,680 hectares (42.2 t/ha yield), up 6.4% from 2014 — but the more telling number is a recent record harvest area of <strong>178,000 hectares, a 16% jump</strong> that produced 7.6 million tonnes, 17% above the five-year average.",
        quickFacts: [
          { label: "2024 production", value: "8.606M tonnes" },
          { label: "Yield", value: "42.2 t/ha" },
          { label: "10-yr growth", value: "+6.4%" },
          { label: "Record harvest area", value: "178,000 ha (+16%)" },
        ],
        body: [
          "France describes this as an agricultural revolution in progress: northern farmland traditionally used for wheat, oilseed rape, sugar beet, and flax is actively converting to potato cultivation as a cash crop, driven by better margins than cereals or beet and stable long-term processing contracts.",
        ],
        source: "Source: FAOSTAT; Europatat; DCA Market Intelligence.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which regions are driving France's potato boom?",
        lead: "<strong>Hauts-de-France</strong> (Nord-Pas-de-Calais / Picardy) is the largest producing region at roughly <strong>40% of national production</strong> — traditionally wheat, oilseed rape, sugar beet, and flax country, now hosting multiple multinational processing plants.",
        table: {
          headers: ["Region", "Role", "Notes"],
          rows: [
            ["Hauts-de-France", "Largest (~40% of output)", "McCain, Clarebout, Agristo, Ecofrost plants located or building here"],
            ["Champagne-Ardenne", "Important, expanding", "&mdash;"],
            ["Brittany (Bretagne)", "Early potatoes from May", "Maritime climate; premium table potatoes"],
            ["Beauce", "Traditional, growing", "&mdash;"],
            ["Normandy", "Expanding", "Suitable climate for potatoes"],
          ],
        },
        body: [
          "Northern France is now viewed as one of Europe's most suitable regions for both potato production and processing — a direct consequence of proximity to major European markets, quality fertile land still available for expansion, and a political/investment climate supportive of agri-tech, sharpened by a post-COVID food-sovereignty focus.",
        ],
        source: "Source: Europatat; DCA Market Intelligence.",
      },
      { id: "processing-boom", dataCard: "processing",
        h2: "Why is frozen-fry processing investment flooding into France?",
        lead: "Global frozen fry consumption surged over 25% between 2019 and 2023, and <strong>Belgian and Dutch fields are under pressure from tight crop rotations</strong> — pushing the industry's next wave of capacity into Northern France instead.",
        table: {
          headers: ["Company", "Investment", "Notes"],
          rows: [
            ["McCain", "€350 million expansion", "Already operates multiple plants in France"],
            ["Clarebout", "New Bourbourg factory (near Dunkirk)", "220,000-tonne current capacity"],
            ["Agristo", "€350 million", "Former sugar-beet factory site; operations planned to start 2027"],
            ["Ecofrost", "Former chips factory, Péronne", "200,000-tonne capacity"],
          ],
        },
        body: [
          "Combined, these four investments represent well over €700 million in new frozen-fry processing capacity landing in Northern France — a scale of investment that mirrors, and is arguably now competing directly with, Belgium's own processing boom (see our Belgium profile). France's advantage: still-available fertile land, proximity to the same European export markets Belgium serves, and farmer economics that favor potato over declining cereal and sugar-beet margins.",
        ],
        source: "Source: DCA Market Intelligence; company investment announcements.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in France?",
        lead: "Table varieties center on <strong>Charlotte</strong> (premium salad), Agata, Amandine, Mona Lisa, and the gourmet fingerling <strong>Ratte</strong>. Processing runs on <strong>Fontane</strong> (the major fry variety) and Innovator, with the once-dominant <strong>Bintje</strong> now in decline.",
        table: {
          headers: ["Category", "Varieties"],
          rows: [
            ["Table", "Charlotte, Agata, Amandine, Mona Lisa, Ratte"],
            ["Processing", "Fontane (major fry variety), Innovator"],
            ["Traditional / declining", "Bintje"],
          ],
        },
        source: "Source: DCA Market Intelligence; Europatat variety data.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Why is France the world's #1 raw potato exporter?",
        lead: "France exported <strong>$1.41 billion in raw potatoes in 2024 — 19.8% of the global total, ranking #1 worldwide</strong>, and grew that export volume <strong>28% year-on-year, the fastest growth of any major exporter in 2023-2024</strong>. French fry exports specifically grew 33.3% over the same period.",
        body: [
          "Key trade partners are Spain, Italy, Belgium, and Germany — France sits at the center of the Northwest European potato trading belt alongside Belgium and the Netherlands, and its production boom is now translating directly into export share gains against those same established neighbors.",
        ],
        source: "Source: UN Comtrade; DCA Market Intelligence; Europatat.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges is France's potato boom creating?",
        lead: "The clearest risk is self-inflicted: <strong>oversupply</strong>. The scale of the production increase is now causing an imbalance between production and demand, with <strong>declining prices</strong> the direct consequence in some recent seasons.",
        body: [
          "Beyond oversupply, France faces the same structural pressures as its neighbors: summer water stress affecting yields, EU pesticide restrictions, direct processing competition from Belgium and the Netherlands (even as investment flows toward France), and soil fatigue emerging in the most intensively farmed new production areas.",
        ],
        source: "Source: DCA Market Intelligence; FAOSTAT; Europatat.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and yield statistics",
      "Europatat (European Potato Trade Association) — trade and industry data",
      "DCA Market Intelligence — processing investment and regional analysis",
      "USDA FAS — trade data",
    ],
    faqItems: [
      { q: "How much potato does France produce per year?", a: "France produced 8.606 million tonnes in 2024 (FAOSTAT), up 6.4% from a decade earlier, with a recent record harvest area of 178,000 hectares." },
      { q: "Why is France attracting so much frozen-fry processing investment?", a: "Belgian and Dutch fields are under pressure from tight crop rotations, pushing McCain, Clarebout, Agristo, and Ecofrost to build or expand plants in Northern France instead — over €700 million in combined new investment." },
      { q: "Is France the world's largest potato exporter?", a: "By value, yes for raw potatoes specifically — France exported $1.41 billion in raw potatoes in 2024, 19.8% of the global total and the #1 ranking, growing 28% year-on-year, the fastest of any major exporter." },
      { q: "What potato variety is used for French fries in France?", a: "Fontane is the major processing variety used for fries in France, alongside Innovator, while the historically dominant Bintje variety is now in decline." },
      { q: "Does France have an oversupply problem with potatoes?", a: "Yes — the scale of France's recent production growth has begun to outpace demand in some seasons, causing declining prices and a recognized oversupply risk within the industry." },
    ],
    regionalContext: [
      { slug: "belgium", note: "World's #1 fry exporter, direct competitor" },
      { slug: "netherlands", note: "Fellow NW European trading-belt member" },
      { slug: "germany", note: "Major export destination" },
      { slug: "united-kingdom", note: "European trading partner" },
    ],
    continueReading: [
      { href: "/blog/belgium-worlds-fry-capital", tag: "Analysis", title: "How Belgium Became the World's #1 Fry Exporter", desc: "The Belgian playbook France's Northern region is now directly competing with." },
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "McCain, Clarebout, Agristo, and Ecofrost's processing pipeline in Northern France." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How France overtook rivals to become the #1 raw potato exporter by value." },
      { href: "/country/belgium", tag: "Country", title: "Belgium Country Profile", desc: "The processing capacity France's investment boom is now rivaling." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Germany: full Country Intelligence Dossier (Tier 1, premium template) ── */
function GermanyProfilePage({ c }) {
  const data = {
    slug: "germany", name: "Germany", flag: c.flag, region: c.region,
    h1: "Germany Potato Industry: The World's #1 Potato Starch Exporter (11.6M Tonnes)",
    tagLabel: "Germany · Europe",
    readMin: 12,
    accentLabel: "Germany is Europe's industrial potato powerhouse — 70–80% of its crop goes to processing, and it exports more potato starch than any country on Earth. Lower Saxony alone grows a quarter of the national crop, much of it feeding an advanced starch-processing sector protected by anti-dumping duties on imports.",
    wikidata: "https://www.wikidata.org/wiki/Q183",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "11.607M tonnes" },
      { label: "Global rank", value: "6th largest producer" },
      { label: "Processing share", value: "70–80% of production" },
      { label: "Starch exports (2022)", value: "$232M (world's #1)" },
      { label: "Top state", value: "Lower Saxony (~25% of output)" },
      { label: "Yield", value: "43.9 t/ha" },
    ],
    definitiveAnswer: "<strong>Germany produced 11.607 million tonnes of potatoes in 2024</strong> on 282,200 hectares at a yield of 43.9 t/ha (FAOSTAT), making it the <strong>world's 6th largest producer</strong> and one of Europe's most important potato markets. What sets Germany apart is depth of industrialization: <strong>70&ndash;80% of production goes to processing</strong> &mdash; chips, French fries, starch, flakes, alcohol &mdash; and Germany manufactures advanced modified starch products with technology levels superior to most other countries. That expertise shows up directly in trade data: <strong>Germany is the world's #1 exporter of potato starch, at $232 million in 2022</strong>, while importing only $62.6 million &mdash; a clear net-exporter position built on Northern German starch-processing clusters near the Dutch border. <strong>Lower Saxony grows roughly 25% of the national crop</strong>, the largest of any German state, followed by Bavaria and North Rhine-Westphalia.",
    keyStats: [
      { value: "11.6M t", label: "2024 production" },
      { value: "70–80%", label: "Processing share" },
      { value: "$232M", label: "2022 starch exports, #1 globally" },
      { value: "#6", label: "Global production rank" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Germany's potato industry?" },
      { id: "regions", l: "Which German states produce the most potatoes?" },
      { id: "varieties", l: "What potato varieties are grown in Germany?" },
      { id: "starch", l: "Why is Germany the world's #1 potato starch exporter?" },
      { id: "processing", l: "Who are Germany's major potato processors?" },
      { id: "trade", l: "Does Germany import or export potatoes?" },
      { id: "challenges", l: "What challenges does Germany's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Germany's potato industry?",
        lead: "Germany produced <strong>11.607 million tonnes in 2024</strong> on 282,200 hectares at a yield of 43.9 t/ha (FAOSTAT) &mdash; the <strong>6th largest producer globally</strong> and a defining market for European potato processing.",
        quickFacts: [
          { label: "2024 production", value: "11.607M tonnes" },
          { label: "Area", value: "282,200 hectares" },
          { label: "Yield", value: "43.9 t/ha" },
          { label: "Global rank", value: "6th largest" },
        ],
        body: [
          "The single most defining fact about Germany's potato sector isn't its production volume — it's what happens to the crop after harvest. An estimated 70&ndash;80% goes to processing, a level of industrialization that puts Germany among the most processing-intensive major producers anywhere in the world.",
        ],
        source: "Source: FAOSTAT; German Federal Statistical Office; Eurostat.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which German states produce the most potatoes?",
        lead: "<strong>Lower Saxony (Niedersachsen)</strong> is the largest producing state at roughly <strong>25% of national production</strong>, followed by Bavaria and North Rhine-Westphalia.",
        table: {
          headers: ["State", "Role", "Notes"],
          rows: [
            ["Lower Saxony", "Largest (~25%)", "Lüneburg Heath, Weser-Ems; both table and processing; significant starch production"],
            ["Bavaria", "2nd largest", "Upper/Lower Bavaria; table potatoes and seed production"],
            ["North Rhine-Westphalia", "3rd largest", "High population density; both table and processing"],
            ["Saxony-Anhalt", "Significant", "Magdeburg Börde fertile soils; table and processing"],
            ["Brandenburg", "Growing", "Sandy soils around Berlin; important for organic production"],
            ["Mecklenburg-Vorpommern", "Growing", "Northeastern state; important for starch potatoes"],
          ],
        },
        body: [
          "Lower Saxony's role is especially concentrated around starch: its position adjacent to the Netherlands' Drenthe and Groningen provinces places it inside a broader Northwest European starch-processing corridor that spans both countries' border regions.",
        ],
        source: "Source: German Federal Statistical Office; Eurostat.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Germany?",
        lead: "Table varieties center on the iconic <strong>Linda</strong>, prized for its flavor, alongside Belana, Gala, Marabel, and Annabelle. <strong>Agria</strong> is the most popular processing variety, with Innovator for fries and Lady Claire for chipping.",
        table: {
          headers: ["Category", "Varieties"],
          rows: [
            ["Table", "Linda (iconic), Belana, Gala, Marabel, Annabelle"],
            ["Processing", "Agria (most popular), Innovator (fries), Lady Claire (chipping)"],
            ["Starch", "High-starch-content varieties for industrial use"],
          ],
        },
        source: "Source: German Federal Statistical Office; Europatat variety data.",
      },
      { id: "starch", dataCard: "starch",
        h2: "Why is Germany the world's #1 potato starch exporter?",
        lead: "Germany exported <strong>$232 million of potato starch in 2022 — the world's largest exporter</strong> — while importing only $62.6 million, a substantial net-exporter position built on decades of investment in advanced modified-starch technology.",
        callout: { number: "#1", context: "Germany's global rank as a potato starch exporter — $232 million in exports in 2022 against just $62.6 million in imports. Northern German starch clusters, concentrated in Lower Saxony near the Dutch border, host 194 starch enterprises across the broader region.", source: "Eurostat; German Federal Statistical Office" },
        body: [
          "Germany produces advanced modified starch products for both food and industrial applications, with technology levels the source material describes as superior to most other countries. Anti-dumping duties on imported starch protect this domestic industrial base, reinforcing Germany's position as the sector's clear global leader rather than just a large participant.",
        ],
        source: "Source: Eurostat; German Federal Statistical Office; Europatat.",
      },
      { id: "processing", dataCard: "processing",
        h2: "Who are Germany's major potato processors?",
        lead: "Major processing companies include <strong>Agrarfrost, Wernsing, and Aviko</strong> (Netherlands-based, with German operations) — producing chips, French fries, starch, flakes, and alcohol from Germany's roughly 70&ndash;80% processing share.",
        body: [
          "Germany's position as part of the Northwest European potato trading belt — alongside the Netherlands, Belgium, and France — means its processing sector is deeply integrated with those neighboring industries rather than operating in isolation, sharing both raw-material trade flows and, in Aviko's case, corporate ownership across the border.",
        ],
        source: "Source: German Federal Statistical Office; Europatat; company corporate data.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Does Germany import or export potatoes?",
        lead: "Both, extensively — Germany is a <strong>major importer and exporter simultaneously</strong>. It imports fresh potatoes from the Netherlands, France, and Egypt, while exporting processed products across Europe and leading the world in starch exports specifically.",
        body: [
          "This two-way trade intensity is itself a signal of how deeply integrated Germany's potato sector is into the broader European market — rather than being self-contained, it functions as both a major consumer of neighboring countries' fresh raw material and a leading exporter of finished processed and starch products back out across the continent.",
        ],
        source: "Source: Eurostat; Europatat; German Federal Statistical Office.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Germany's potato industry face?",
        lead: "Five recurring pressures: <strong>increasing drought stress</strong> from climate change, <strong>strict EU pesticide regulations</strong>, <strong>competition from Eastern European production</strong>, soil-health management in intensively farmed areas, and a <strong>declining number of low-yield farms</strong> due to high mechanization costs.",
        body: [
          "The mechanization-cost pressure is a structural consolidation story similar to what's playing out across most of Western Europe's potato sectors: smaller, lower-yield operations are progressively exiting as the capital requirements for competitive modern potato farming keep rising.",
        ],
        source: "Source: FAOSTAT; German Federal Statistical Office; Eurostat.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and yield statistics",
      "Eurostat — trade and starch export/import data",
      "German Federal Statistical Office (Destatis) — state-level production data",
      "Europatat (European Potato Trade Association) — variety and trade data",
    ],
    faqItems: [
      { q: "How much potato does Germany produce per year?", a: "Germany produced 11.607 million tonnes in 2024 (FAOSTAT), the world's 6th largest producer, on 282,200 hectares at a yield of 43.9 t/ha." },
      { q: "Is Germany the largest potato starch exporter in the world?", a: "Yes — Germany exported $232 million of potato starch in 2022, the world's largest, while importing only $62.6 million, reflecting decades of investment in advanced modified-starch processing technology." },
      { q: "Which German state produces the most potatoes?", a: "Lower Saxony (Niedersachsen), accounting for roughly 25% of national production — the largest of any German state — followed by Bavaria and North Rhine-Westphalia." },
      { q: "How much of Germany's potato crop is processed?", a: "An estimated 70–80% of German production goes to processing — chips, French fries, starch, flakes, and alcohol — making Germany one of the most processing-intensive major potato producers in the world." },
      { q: "What is Germany's most popular potato variety?", a: "Linda is the iconic table variety prized for its flavor, while Agria is the most popular processing variety, used alongside Innovator for fries and Lady Claire for chipping." },
    ],
    regionalContext: [
      { slug: "netherlands", note: "Starch-corridor neighbor, Aviko ownership link" },
      { slug: "belgium", note: "NW European processing peer" },
      { slug: "france", note: "Major fresh-potato import source" },
      { slug: "poland", note: "Eastern European competitive pressure" },
    ],
    continueReading: [
      { href: "/knowledge/potato-starch-uses", tag: "Processing", title: "What Is Potato Starch Used For?", desc: "Germany's advanced modified-starch industry and global export leadership." },
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "Agrarfrost, Wernsing, and Aviko's role in German processing." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How Germany runs simultaneous import and export flows across Europe." },
      { href: "/country/netherlands", tag: "Country", title: "Netherlands Country Profile", desc: "Germany's starch-corridor neighbor and Aviko's home market." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Ukraine: full Country Intelligence Dossier (Tier 1, premium template) ── */
function UkraineProfilePage({ c }) {
  const data = {
    slug: "ukraine", name: "Ukraine", flag: c.flag, region: c.region,
    h1: "Ukraine Potato Industry: The World's #3 Producer, Now Growing Under Wartime Conditions (21.4M Tonnes)",
    tagLabel: "Ukraine · Europe",
    readMin: 11,
    accentLabel: "Ukraine is the world's 3rd largest potato producer — behind only China and India — yet most of its crop still comes from small household plots rather than commercial farms, and since 2022 the war has directly disrupted supply chains and processing facilities in the eastern regions.",
    wikidata: "https://www.wikidata.org/wiki/Q212",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "21.359M tonnes" },
      { label: "Global rank", value: "3rd largest producer" },
      { label: "10-year change", value: "−9.9% (2014–24)" },
      { label: "Yield", value: "17.6 t/ha" },
      { label: "Per-capita consumption", value: "136 kg/yr (world's highest)" },
      { label: "Since 2022", value: "War disrupting eastern production and trade" },
    ],
    definitiveAnswer: "<strong>Ukraine produced 21.359 million tonnes of potatoes in 2024</strong> on 1.207 million hectares at a yield of 17.6 t/ha (FAOSTAT), making it the <strong>world's 3rd largest potato producer</strong>, behind only China and India. Production has actually declined 9.9% over the past decade, from 23.693 million tonnes in 2014 — and Ukraine's yield, at 17.6 t/ha, sits far below Western European levels (35+ t/ha), a gap explained by a structural fact that sets Ukraine apart from most major producers: <strong>most production still comes from small household plots</strong> rather than commercial operations, not large-scale mechanized farms. Ukraine also has the <strong>world's highest per-capita potato consumption at 136 kg/year</strong>. Since Russia's 2022 invasion, the <strong>ongoing conflict has severely disrupted supply chains and processing facilities in eastern regions</strong>, compounding the sector's pre-existing structural challenges.",
    keyStats: [
      { value: "21.4M t", label: "2024 production" },
      { value: "#3", label: "Global production rank" },
      { value: "136 kg", label: "Per-capita consumption/yr" },
      { value: "−9.9%", label: "10-yr production change", accent: "#C62828" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Ukraine's potato industry?" },
      { id: "regions", l: "Where in Ukraine are potatoes grown?" },
      { id: "varieties", l: "What potato varieties are grown in Ukraine?" },
      { id: "war-impact", l: "How has the war affected Ukraine's potato sector?" },
      { id: "challenges", l: "What structural challenges does Ukraine's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Ukraine's potato industry?",
        lead: "Ukraine produced <strong>21.359 million tonnes in 2024</strong> on 1.207 million hectares (FAOSTAT) — the <strong>world's 3rd largest producer</strong>, behind only China and India, though production has declined 9.9% from 23.693 million tonnes in 2014.",
        quickFacts: [
          { label: "2014 production", value: "23.693M tonnes" },
          { label: "2024 production", value: "21.359M tonnes" },
          { label: "10-yr change", value: "−9.9%" },
          { label: "Yield", value: "17.6 t/ha" },
        ],
        body: [
          "Ukraine's global ranking is genuinely remarkable given the yield gap: 17.6 t/ha is well below the 35+ t/ha typical of Western Europe, meaning Ukraine's massive production scale comes overwhelmingly from area under cultivation (1.2 million hectares) rather than intensive, high-yield commercial farming.",
        ],
        source: "Source: FAOSTAT; national statistics agencies.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Where in Ukraine are potatoes grown?",
        lead: "Production concentrates in the north and west: <strong>Chernihiv Oblast</strong> is the major region, alongside Zhytomyr, Rivne, Volyn, Kyiv, and Lviv Oblasts.",
        table: {
          headers: ["Oblast", "Notes"],
          rows: [
            ["Chernihiv", "Major potato region, northern Ukraine"],
            ["Zhytomyr", "Significant producer, northwest"],
            ["Rivne", "Important growing area, western Ukraine"],
            ["Volyn", "Western producer"],
            ["Kyiv", "Production around the capital"],
            ["Lviv", "Western Ukrainian producer"],
          ],
        },
        source: "Source: National statistics agencies of Ukraine.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Ukraine?",
        lead: "Ukraine's variety base combines imported and domestically bred cultivars: <strong>Riviera</strong> (early maturing table variety) and <strong>Bellarosa</strong> (red-skinned, high-yielding) alongside domestic varieties Slavyanka, Tiras, Dnipryanka, and Fantasia.",
        table: {
          headers: ["Variety", "Notes"],
          rows: [
            ["Riviera", "Early maturing, popular table variety"],
            ["Bellarosa", "Red-skinned, high yielding"],
            ["Slavyanka", "Widely grown Ukrainian variety"],
            ["Tiras", "Bred for Ukrainian conditions"],
            ["Dnipryanka", "Domestic variety, central regions"],
            ["Fantasia", "Popular commercial variety"],
          ],
        },
        source: "Source: National statistics agencies of Ukraine.",
      },
      { id: "war-impact", dataCard: "war-impact",
        h2: "How has the war affected Ukraine's potato sector?",
        lead: "The <strong>ongoing military conflict since 2022 has severely disrupted supply chains and processing facilities</strong> in eastern regions, and impacted the trade routes Ukraine traditionally relied on as a net exporter of fresh potatoes to neighboring countries.",
        body: [
          "Ukraine's already-limited processing infrastructure — small relative to Western Europe even before 2022 — has been directly affected, with most potatoes now consumed fresh or stored rather than processed, compounding structural constraints that predate the invasion.",
        ],
        source: "Source: National statistics agencies; FAOSTAT; USDA FAS.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What structural challenges does Ukraine's potato industry face?",
        lead: "Beyond the war's direct impact, Ukraine's sector faces four persistent structural constraints: <strong>low yields relative to Western Europe</strong>, an <strong>overwhelming reliance on small household plots</strong> rather than commercial farms, <strong>limited modern cold storage</strong>, and the <strong>lack of a certified seed potato system</strong>.",
        body: [
          "These four factors are interconnected: without certified seed and modern storage infrastructure, household-plot production stays fragmented and low-yield, which in turn limits the capital available to invest in the processing and storage capacity that could raise both yields and value-added output.",
        ],
        source: "Source: FAOSTAT; national statistics agencies of Ukraine.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and yield statistics",
      "National statistics agencies of Ukraine",
      "USDA FAS — trade and conflict-impact analysis",
    ],
    faqItems: [
      { q: "How much potato does Ukraine produce per year?", a: "Ukraine produced 21.359 million tonnes in 2024 (FAOSTAT), the world's 3rd largest producer, though down 9.9% from 23.693 million tonnes in 2014." },
      { q: "Is Ukraine the world's largest potato consumer?", a: "Ukraine has the world's highest per-capita potato consumption at approximately 136 kg per year — even higher than production leaders China and India on a per-person basis." },
      { q: "How has the war affected Ukraine's potato industry?", a: "Since Russia's 2022 invasion, the conflict has severely disrupted supply chains and processing facilities in eastern Ukraine, and impacted the trade routes the country traditionally used as a net exporter of fresh potatoes to neighboring countries." },
      { q: "Why does Ukraine have such low potato yields?", a: "Ukraine's yield of 17.6 t/ha is far below Western Europe's 35+ t/ha because most production still comes from small household plots rather than large-scale, mechanized commercial farms with certified seed and modern storage." },
    ],
    regionalContext: [
      { slug: "russia", note: "Neighboring #5 producer, similar structural profile" },
      { slug: "poland", note: "Western neighbor and EU trade destination" },
      { slug: "china", note: "World's #1 producer" },
      { slug: "india", note: "World's #2 producer" },
    ],
    continueReading: [
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How the 2022 conflict disrupted Ukraine's traditional export routes." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "Why Ukraine still lacks a certified seed potato system at scale." },
      { href: "/knowledge/potato-storage-cold-chain", tag: "Storage", title: "Potato Cold Storage", desc: "The modern storage gap limiting Ukraine's household-plot-dominated sector." },
      { href: "/country/russia", tag: "Country", title: "Russia Country Profile", desc: "A neighboring producer facing similar small-plot, low-yield structural challenges." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Russia: full Country Intelligence Dossier (Tier 1, premium template) ── */
function RussiaProfilePage({ c }) {
  const data = {
    slug: "russia", name: "Russia", flag: c.flag, region: c.region,
    h1: "Russia Potato Industry: World's #5 Producer, Shrinking Fast as Household Gardens Decline (19.4M Tonnes)",
    tagLabel: "Russia · Europe",
    readMin: 11,
    accentLabel: "Russia's potato production has fallen 38.5% in a decade — not because commercial farming is struggling, but because household garden production, historically the backbone of Russian potato supply, is disappearing. Russia now imports substantial volumes of frozen fries from Europe even as it remains the world's 5th largest producer.",
    wikidata: "https://www.wikidata.org/wiki/Q159",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "19.374M tonnes" },
      { label: "Global rank", value: "5th largest producer" },
      { label: "10-year change", value: "−38.5% (2014–24)" },
      { label: "Yield", value: "17.5 t/ha (vs. 35+ in Europe)" },
      { label: "Per-capita consumption", value: "111 kg/yr (2nd highest globally)" },
      { label: "Decline driver", value: "Shrinking household garden production" },
    ],
    definitiveAnswer: "<strong>Russia produced 19.374 million tonnes of potatoes in 2024</strong> on 1.048 million hectares at a yield of 17.5 t/ha (FAOSTAT), making it the <strong>world's 5th largest producer</strong>. The headline trend, though, is decline: production has fallen a steep <strong>38.5% from 31.50 million tonnes in 2014</strong> &mdash; primarily driven by <strong>reduced household garden production</strong>, historically the backbone of Russian potato supply, rather than any collapse in commercial farming specifically. Russia's yield of 17.5 t/ha remains far below the European average of 35+ t/ha, a gap tied to the same small-plot structural pattern seen across much of the former Soviet space. Russia still has the <strong>world's 2nd-highest per-capita potato consumption at 111 kg/year</strong>, and despite its production scale, the country <strong>imports significant volumes of frozen French fries from Europe</strong> — its own processing sector remains underdeveloped relative to its raw production base.",
    keyStats: [
      { value: "19.4M t", label: "2024 production" },
      { value: "#5", label: "Global production rank" },
      { value: "−38.5%", label: "10-yr production decline", accent: "#C62828" },
      { value: "111 kg", label: "Per-capita consumption/yr" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Russia's potato industry, and why is it shrinking?" },
      { id: "regions", l: "Where in Russia are potatoes grown?" },
      { id: "varieties", l: "What potato varieties are grown in Russia?" },
      { id: "processing", l: "Does Russia process its own potatoes?" },
      { id: "challenges", l: "What structural challenges does Russia's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Russia's potato industry, and why is it shrinking?",
        lead: "Russia produced <strong>19.374 million tonnes in 2024</strong> (FAOSTAT), the <strong>world's 5th largest producer</strong> — but that's a steep <strong>38.5% decline from 31.50 million tonnes in 2014</strong>, driven primarily by <strong>reduced household garden production</strong> rather than a commercial-sector collapse.",
        quickFacts: [
          { label: "2014 production", value: "31.50M tonnes" },
          { label: "2024 production", value: "19.374M tonnes" },
          { label: "10-yr decline", value: "−38.5%" },
          { label: "Yield", value: "17.5 t/ha" },
        ],
        body: [
          "This decline pattern is genuinely distinctive: Russia isn't losing production because commercial farms are failing — it's losing production because the informal household-garden sector, which historically supplied a huge share of Russian potatoes outside any commercial market, is shrinking as that traditional practice declines generationally.",
        ],
        source: "Source: FAOSTAT; national statistics agencies.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Where in Russia are potatoes grown?",
        lead: "Production spans five federal districts: <strong>Central</strong> (serving Moscow), <strong>Volga</strong>, <strong>Southern</strong>, <strong>Ural</strong>, and <strong>Siberian</strong>.",
        table: {
          headers: ["Federal District", "Key regions", "Notes"],
          rows: [
            ["Central", "Moscow, Tula, Ryazan Oblasts", "Serves Moscow and central markets"],
            ["Volga", "Tatarstan, Bashkortostan, Nizhny Novgorod", "Significant production"],
            ["Southern", "Krasnodar Krai, Rostov Oblast", "Growing region"],
            ["Ural", "Sverdlovsk, Chelyabinsk Oblasts", "Traditional producer"],
            ["Siberian", "Novosibirsk, Omsk, Kemerovo Oblasts", "Major production area"],
          ],
        },
        body: [
          "A severe winter climate limits the growing season across most of Russia's producing regions, which — combined with the household-plot structure — restricts the range of varieties that can be reliably grown and constrains yield ceiling nationally.",
        ],
        source: "Source: National statistics agencies of Russia.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Russia?",
        lead: "<strong>Nevsky</strong> is the most popular variety nationally, alongside Udacha (Luck), Red Scarlett, Gala, Zhukovsky Early, and the German-bred Rosara.",
        table: {
          headers: ["Variety", "Notes"],
          rows: [
            ["Nevsky", "Most popular variety in Russia"],
            ["Udacha (Luck)", "Widely grown, early variety"],
            ["Red Scarlett", "Popular red-skinned variety"],
            ["Gala", "Yellow-fleshed, widely grown"],
            ["Zhukovsky Early", "Popular early variety"],
            ["Rosara", "German-bred variety, popular in Russia"],
          ],
        },
        source: "Source: National statistics agencies of Russia.",
      },
      { id: "processing", dataCard: "processing",
        h2: "Does Russia process its own potatoes?",
        lead: "Russia's potato processing industry is <strong>growing but still underdeveloped</strong> relative to its production scale, and the country <strong>imports significant volumes of frozen French fries from Europe</strong> despite being the world's 5th largest producer.",
        body: [
          "Domestic chip production is a bright spot, growing with Lays (PepsiCo) and local brands supplying the retail snack market — but the frozen-fry processing gap remains a striking contrast with Russia's raw production scale, and a market opportunity that European exporters currently fill.",
        ],
        source: "Source: National statistics agencies of Russia; industry reporting.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What structural challenges does Russia's potato industry face?",
        lead: "Five recurring constraints: <strong>low yields</strong> (17.5 t/ha vs. 35+ in Europe), the <strong>declining household-plot sector</strong>, <strong>limited modern storage infrastructure</strong>, a <strong>severe winter climate</strong> restricting the growing season, and the <strong>need for greater mechanization</strong> in the commercial sector.",
        body: [
          "Russia's central challenge is really a transition problem: the informal household-garden supply base that historically underpinned national production is fading, and commercial, mechanized farming hasn't yet scaled up to fully replace that lost volume — which is the direct mechanical explanation for the decade-long production decline.",
        ],
        source: "Source: FAOSTAT; national statistics agencies of Russia.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and yield statistics",
      "National statistics agencies of Russia",
      "Industry reporting on processing and trade",
    ],
    faqItems: [
      { q: "How much potato does Russia produce per year?", a: "Russia produced 19.374 million tonnes in 2024 (FAOSTAT), the world's 5th largest producer — though down 38.5% from 31.50 million tonnes in 2014." },
      { q: "Why has Russia's potato production declined so much?", a: "Primarily due to reduced household garden production, historically the backbone of Russian potato supply, rather than a decline in commercial farming specifically. Commercial mechanized farming hasn't yet scaled up to replace the lost household-plot volume." },
      { q: "Does Russia import potato products?", a: "Yes — despite being the world's 5th largest producer, Russia imports significant volumes of frozen French fries from Europe, since its own processing sector remains comparatively underdeveloped." },
      { q: "What is the most popular potato variety in Russia?", a: "Nevsky is the most popular variety nationally, alongside Udacha (Luck), Red Scarlett, Gala, Zhukovsky Early, and the German-bred Rosara." },
    ],
    regionalContext: [
      { slug: "ukraine", note: "Neighboring #3 producer, similar structural profile" },
      { slug: "poland", note: "Regional trade and production peer" },
      { slug: "uzbekistan", note: "Legacy seed and trade connection" },
      { slug: "china", note: "World's #1 producer" },
    ],
    continueReading: [
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Why Russia imports frozen fries despite massive raw production." },
      { href: "/knowledge/potato-storage-cold-chain", tag: "Storage", title: "Potato Cold Storage", desc: "The modern storage gap behind Russia's household-plot decline." },
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "Why Russia's processing sector lags its raw production scale." },
      { href: "/country/ukraine", tag: "Country", title: "Ukraine Country Profile", desc: "A neighboring producer with a nearly identical structural profile." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Poland: full Country Intelligence Dossier (Tier 1, premium template) ── */
function PolandProfilePage({ c }) {
  const data = {
    slug: "poland", name: "Poland", flag: c.flag, region: c.region,
    h1: "Poland Potato Industry: From 2.8 Million Hectares to 189,000 — Europe's Steepest Decline (5.9M Tonnes)",
    tagLabel: "Poland · Europe",
    readMin: 11,
    accentLabel: "Poland's potato area collapsed from 2.819 million hectares in 1961 to just 188,580 hectares by 2023 — a 93% contraction that makes it one of the most dramatic structural shifts in any major agricultural sector anywhere. Yet Poland remains a significant European producer and one of the continent's largest potato starch exporters.",
    wikidata: "https://www.wikidata.org/wiki/Q36",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024)", value: "~5.9–6.0M tonnes" },
      { label: "1961 area", value: "2.819M hectares" },
      { label: "2023 area", value: "188,580 hectares" },
      { label: "Area contraction", value: "~93% since 1961" },
      { label: "Starch exports (2022)", value: "$97.4M" },
      { label: "Top region", value: "Greater Poland (Wielkopolska)" },
    ],
    definitiveAnswer: "<strong>Poland produced approximately 5.9&ndash;6.0 million tonnes of potatoes in 2024</strong> (FAOSTAT), and while that still ranks Poland among Europe's larger producers, the real story is structural: Polish potato-growing area collapsed from <strong>2.819 million hectares in 1961 to just 188,580 hectares by 2023 &mdash; a roughly 93% contraction</strong>, one of the most dramatic land-use shifts in any major agricultural sector globally. Poland was historically one of the world's largest potato producers by area, and even after this collapse remains significant: it's <strong>one of Europe's largest potato starch producers</strong>, exporting <strong>$97.4 million of potato starch in 2022</strong>, and hosts a McCain processing plant. Production concentrates in <strong>Greater Poland (Wielkopolska)</strong>, with Masuria, Podlasie, Lower Silesia, and the Lublin region contributing meaningfully. Poland now competes directly with Germany, the Netherlands, and France in European fresh and starch markets, from a far smaller land base than it once commanded.",
    keyStats: [
      { value: "~6M t", label: "2024 production" },
      { value: "~93%", label: "Area contraction since 1961", accent: "#C62828" },
      { value: "189K ha", label: "2023 cultivated area" },
      { value: "$97.4M", label: "2022 starch exports" },
    ],
    tocItems: [
      { id: "industry-size", l: "How did Poland's potato area shrink by 93%?" },
      { id: "regions", l: "Where in Poland are potatoes grown today?" },
      { id: "varieties", l: "What potato varieties are grown in Poland?" },
      { id: "starch", l: "Why is Poland still a major potato starch producer?" },
      { id: "challenges", l: "What challenges does Poland's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How did Poland's potato area shrink by 93%?",
        lead: "Poland's potato-growing area fell from <strong>2.819 million hectares in 1961 to just 188,580 hectares in 2023</strong> — a contraction of roughly 93%, even as Poland produces an estimated <strong>5.9&ndash;6.0 million tonnes</strong> today, making it one of the continent's larger remaining producers by volume.",
        quickFacts: [
          { label: "1961 area", value: "2.819M hectares" },
          { label: "2023 area", value: "188,580 hectares" },
          { label: "Area contraction", value: "~93%" },
          { label: "2024 production", value: "~5.9–6.0M tonnes" },
        ],
        body: [
          "Poland was historically one of the world's largest potato producers by cultivated area — a status rooted in the crop's traditional role in Polish rural subsistence agriculture before and during the socialist era. The post-1989 transition to market agriculture, EU accession, and rural consolidation together drove the collapse: land shifted toward other crops and non-agricultural use as subsistence potato-growing became economically unnecessary for most households.",
        ],
        source: "Source: FAOSTAT; national statistics agencies of Poland.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Where in Poland are potatoes grown today?",
        lead: "<strong>Greater Poland (Wielkopolska)</strong>, centered on the fertile agricultural land around Poznań, is the major producing region, alongside Masuria, Podlasie, Lower Silesia (Dolnośląskie), and the traditional Lublin region in the east.",
        table: {
          headers: ["Region", "Notes"],
          rows: [
            ["Greater Poland (Wielkopolska)", "Major producing region; Poznań area, fertile agricultural land"],
            ["Masuria", "Northern lake district area"],
            ["Podlasie", "Northeastern Poland"],
            ["Lower Silesia (Dolnośląskie)", "Southwestern Poland"],
            ["Lublin region", "Eastern Poland, traditional potato area"],
          ],
        },
        source: "Source: National statistics agencies of Poland.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Poland?",
        lead: "<strong>Vineta</strong> is a widely grown table variety, alongside Denar (early), Lord (processing), Tajfun (starch), Gala, and Colomba.",
        table: {
          headers: ["Variety", "Role"],
          rows: [
            ["Vineta", "Widely grown table variety"],
            ["Denar", "Popular early variety"],
            ["Lord", "Processing variety"],
            ["Tajfun", "Starch variety"],
            ["Gala", "Table variety"],
            ["Colomba", "Early variety"],
          ],
        },
        source: "Source: National statistics agencies of Poland.",
      },
      { id: "starch", dataCard: "starch",
        h2: "Why is Poland still a major potato starch producer?",
        lead: "Poland remains <strong>one of Europe's largest potato starch producers</strong>, exporting <strong>$97.4 million of potato starch in 2022</strong>, and hosts a <strong>McCain processing plant</strong> alongside domestic producers.",
        body: [
          "Even with the dramatic land-area collapse, Poland's starch and processing sector held up better than raw fresh-market production — a pattern consistent with the broader European trend of consolidation toward higher-value processed products even as total growing area contracts.",
        ],
        source: "Source: Eurostat; national statistics agencies of Poland.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Poland's potato industry face?",
        lead: "Five recurring pressures: continued <strong>decline from historical production highs</strong>, <strong>small farm sizes</strong> limiting mechanization, <strong>direct competition from Western European producers</strong> (Germany, Netherlands, France), the need for <strong>storage-facility modernization</strong>, and <strong>climate variability</strong> affecting yields.",
        body: [
          "Poland's structural challenge is really about scale economics: with cultivated area down 93% since 1961 and farms still comparatively small relative to Western European operations, competing directly against Germany, the Netherlands, and France on fresh-market and processing terms requires a level of mechanization and capital investment many Polish operations haven't yet reached.",
        ],
        source: "Source: FAOSTAT; national statistics agencies of Poland.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and yield statistics",
      "Eurostat — trade and starch export data",
      "National statistics agencies of Poland",
      "USDA FAS — trade data",
    ],
    faqItems: [
      { q: "How much potato does Poland produce per year?", a: "Poland produces an estimated 5.9–6.0 million tonnes annually, making it a significant European producer despite a dramatic historical decline in cultivated area." },
      { q: "Why did Poland's potato area shrink so much?", a: "Poland's potato-growing area fell from 2.819 million hectares in 1961 to just 188,580 hectares by 2023 — a roughly 93% contraction — driven by the post-1989 transition to market agriculture, EU accession, and the decline of subsistence household potato-growing." },
      { q: "Is Poland a major potato starch producer?", a: "Yes — despite the land-area collapse, Poland remains one of Europe's largest potato starch producers, exporting $97.4 million of potato starch in 2022, and hosts a McCain processing plant." },
      { q: "What is the most grown potato variety in Poland?", a: "Vineta is a widely grown table variety, alongside Denar (early), Lord (processing), Tajfun (starch), Gala, and Colomba." },
    ],
    regionalContext: [
      { slug: "germany", note: "Direct Western European competitor" },
      { slug: "netherlands", note: "Direct Western European competitor" },
      { slug: "ukraine", note: "Eastern European production peer" },
      { slug: "france", note: "Direct Western European competitor" },
    ],
    continueReading: [
      { href: "/knowledge/potato-starch-uses", tag: "Processing", title: "What Is Potato Starch Used For?", desc: "Poland's starch sector, which held up better than fresh-market production." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How Poland competes with Germany, the Netherlands, and France." },
      { href: "/country/germany", tag: "Country", title: "Germany Country Profile", desc: "The world's #1 potato starch exporter and a direct Polish competitor." },
      { href: "/knowledge/potato-production-map", tag: "Production", title: "Potato Production Map", desc: "Visualizing Poland's dramatic area decline in global context." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Mexico: full Country Intelligence Dossier (Tier 1, premium template) ── */
function MexicoProfilePage({ c }) {
  const data = {
    slug: "mexico", name: "Mexico", flag: c.flag, region: c.region,
    h1: "Mexico Potato Industry: Where PepsiCo/Sabritas Shapes What Farmers Grow (1.9M Tonnes)",
    tagLabel: "Mexico · Americas",
    readMin: 13,
    accentLabel: "One company — PepsiCo's Sabritas — is the single largest private buyer of potatoes in Mexico, contracting 15,000–20,000 hectares and dictating varietal choice, quality standards, and agronomic practice across the industry. Meanwhile, Mexico's Toluca Valley is part of the actual center of genetic diversity for late blight, the disease that caused the Irish Potato Famine.",
    wikidata: "https://www.wikidata.org/wiki/Q96",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2023, FAOSTAT)", value: "~1.9M tonnes" },
      { label: "Irrigated share", value: "85–90% (highly irrigation-dependent)" },
      { label: "Top state", value: "Sinaloa (~35% of national output)" },
      { label: "Sabritas chip market share", value: "70%+" },
      { label: "Sabritas contract farming", value: "15,000–20,000 ha/year" },
      { label: "Frozen fry imports", value: "150,000–200,000 tonnes/year" },
    ],
    definitiveAnswer: "<strong>Mexico produced approximately 1.9 million tonnes of potatoes in 2023</strong> on roughly 65,000 hectares at a yield of 29.2 t/ha (FAOSTAT) &mdash; a yield above the world average, reflecting Mexico's heavy reliance on irrigation: an estimated <strong>85&ndash;90% of Mexican potato production is irrigated</strong>, making it one of the most irrigation-dependent major producers anywhere. Production concentrates in <strong>Sinaloa (~35% of national output)</strong> and neighboring Sonora, both winter-cycle desert-valley operations, plus highland spring-summer production in Nuevo León, Chihuahua, and Puebla. The single defining feature of Mexico's potato economy is <strong>PepsiCo's Sabritas division</strong> &mdash; holding over 70% of the Mexican chip market and contracting <strong>15,000&ndash;20,000 hectares annually</strong>, making it the largest private-sector potato buyer in the country and a direct shaper of which varieties get planted. Mexico is also scientifically significant: the <strong>Toluca Valley is part of the actual center of genetic diversity for Phytophthora infestans</strong>, the late blight pathogen behind the Irish Potato Famine.",
    keyStats: [
      { value: "1.9M t", label: "2023 production" },
      { value: "85–90%", label: "Share irrigated" },
      { value: "70%+", label: "Sabritas chip market share" },
      { value: "35%", label: "Sinaloa's share of output" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Mexico's potato industry?" },
      { id: "regions", l: "Which Mexican states grow the most potatoes?" },
      { id: "varieties", l: "What potato varieties are grown in Mexico?" },
      { id: "sabritas", l: "How does PepsiCo/Sabritas dominate Mexico's potato sector?" },
      { id: "seed-system", l: "How does Mexico's seed potato system work?" },
      { id: "trade", l: "Does Mexico import or export potatoes?" },
      { id: "distinctive", l: "What makes Mexico's potato industry scientifically distinctive?" },
      { id: "challenges", l: "What challenges does Mexico's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Mexico's potato industry?",
        lead: "Mexico is <strong>Central America's largest potato producer</strong>, producing approximately <strong>1.9 million tonnes</strong> from about 65,000 hectares at a yield of 29.2 t/ha (FAOSTAT 2023) &mdash; a yield above the world average, driven by irrigated production.",
        quickFacts: [
          { label: "Production (2023)", value: "~1.9M tonnes" },
          { label: "Area", value: "~65,000 hectares" },
          { label: "Yield", value: "29.2 t/ha" },
          { label: "Irrigated share", value: "85–90%" },
        ],
        body: [
          "SIAP (under SADER, formerly SAGARPA) provides Mexico's detailed national statistics, tracked by state, by production cycle (otoño-invierno/fall-winter vs. primavera-verano/spring-summer), and by irrigation status — data that consistently shows Mexico as one of the most irrigation-dependent potato producers in the world.",
        ],
        source: "Source: FAOSTAT 2023; SIAP/SADER (Servicio de Información Agroalimentaria y Pesquera), SIACON 2023.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which Mexican states grow the most potatoes?",
        lead: "<strong>Sinaloa (~35% of national production)</strong> leads by a wide margin, followed by neighboring Sonora, then highland Nuevo León — spanning a growing calendar from sea-level irrigated desert valleys to plateaus above 2,000 metres.",
        table: {
          headers: ["State", "Role", "Cycle", "Notes"],
          rows: [
            ["Sinaloa", "Leading state (~35%)", "Fall-winter (Oct–Mar)", "Culiacán/Los Mochis valleys; large commercial farms (500+ ha)"],
            ["Sonora", "2nd most important", "Fall-winter", "Yaqui/Mayo valleys; CONAGUA-managed irrigation districts"],
            ["Nuevo León", "3rd most important", "Spring-summer (Mar–Aug)", "Galeana/Doctor Arroyo, 1,500–2,200m elevation"],
            ["Chihuahua, Puebla, Estado de México, Coahuila, Guanajuato", "Significant", "Mixed", "Spans sea-level to 2,400m (Puebla's San Salvador el Seco)"],
          ],
        },
        body: [
          "This geographic spread — from Sinaloa's warm coastal winter valleys to Puebla's 2,400-metre highland plateau — is what gives Mexico a year-round domestic supply calendar despite its overall production being relatively modest by global standards.",
        ],
        source: "Source: SIAP/SADER 2023; USDA FAS GAIN Report MX2023-0032; CONAGUA 2023.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Mexico?",
        lead: "<strong>Alpha</strong>, valued for white flesh and versatile cooking quality, is the dominant fresh-market variety at an estimated <strong>30&ndash;40% of planted area</strong>. Processing runs on proprietary PepsiCo-controlled varieties bred specifically for Mexican conditions.",
        table: {
          headers: ["Variety", "Segment", "Notes"],
          rows: [
            ["Alpha", "Fresh market", "Dominant, 30–40% of planted area; consumer standard for decades"],
            ["Fianna (Agrico)", "Fresh + some processing", "2nd most important variety nationally"],
            ["FL 1867 (\"Sabritas\"), Atlantic", "Chip processing", "PepsiCo-contracted, bred for high dry matter, low sugars"],
            ["Innovator, Ranger Russet, Shepody", "Frozen fry", "Growing segment; still import-reliant overall"],
            ["Gigant, Norteña, Montañosa (INIFAP)", "Domestic breeding", "Limited market penetration vs. imported varieties"],
          ],
        },
        source: "Source: INIFAP (Instituto Nacional de Investigaciones Forestales, Agrícolas y Pecuarias), 2022; SIAP/SADER 2023.",
      },
      { id: "sabritas", dataCard: "sabritas",
        h2: "How does PepsiCo/Sabritas dominate Mexico's potato sector?",
        lead: "<strong>Sabritas</strong> (Frito-Lay's Mexican operation) holds <strong>over 70% of the Mexican chip market</strong> and contracts <strong>15,000&ndash;20,000 hectares annually</strong> across multiple states — making it the single largest private-sector potato buyer in the country.",
        callout: { number: "70%+", context: "of the Mexican chip market belongs to Sabritas, which operates major processing plants in Saltillo, Veracruz, and Estado de México. Its contract-farming program provides certified seed, agronomic advice, and guaranteed purchase — in exchange for strict specifications on tuber size, dry matter (min. 20%), specific gravity, and sugar levels.", source: "PepsiCo Mexico Annual Report 2022; Euromonitor International" },
        body: [
          "This isn't just a large customer relationship — Sabritas directly shapes which varieties Mexican farmers grow, since its contracts specify proprietary or specialized cultivars bred for its own quality standards. Barcel (a Grupo Bimbo subsidiary) is the main domestic competitor, but at meaningfully smaller scale.",
        ],
        source: "Source: PepsiCo Mexico, Annual Report 2022; USDA FAS GAIN Report MX2023-0032; Schiavon and Ravara, 2021, Food Policy.",
      },
      { id: "seed-system", dataCard: "seed-system",
        h2: "How does Mexico's seed potato system work?",
        lead: "Mexico's certified seed system, run by <strong>SNICS</strong> under SADER, concentrates production in high-altitude zones (Chihuahua, Nuevo León, Puebla) where lower aphid populations reduce virus pressure. Mexico still <strong>imports significant seed volumes from the US and Canada</strong>.",
        body: [
          "Seed imports are essential for the processing sector specifically, since Sabritas and other processors require proprietary or specialized varieties not multiplied in sufficient domestic quantity. SENASICA phytosanitary inspection guards against introducing golden nematode (present in some US seed areas but absent from Mexico) via these imports.",
        ],
        source: "Source: SNICS (Servicio Nacional de Inspección y Certificación de Semillas); SENASICA phytosanitary regulations; USDA APHIS.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Does Mexico import or export potatoes?",
        lead: "Mexico is a <strong>net importer</strong>. Frozen fry imports run <strong>150,000&ndash;200,000 tonnes annually</strong>, 80&ndash;85% from the United States under USMCA's tariff-free framework, plus fresh potato imports of 50,000&ndash;80,000 tonnes from the US.",
        body: [
          "Mexican exports are modest by comparison — mainly fresh potatoes to Guatemala, El Salvador, and other Central American countries, plus small processed-snack volumes, totaling under USD 30 million annually. Mexico's frozen-fry appetite is driven by rapid QSR expansion: McDonald's alone operates over 700 Mexican locations, with domestic chains like Carl's Jr. adding further demand.",
        ],
        source: "Source: USDA FAS GATS 2023; FAOSTAT Trade 2023; SIAP/SADER 2023.",
      },
      { id: "distinctive", dataCard: "distinctive",
        h2: "What makes Mexico's potato industry scientifically distinctive?",
        lead: "Mexico's <strong>Toluca Valley is part of the actual center of genetic diversity for Phytophthora infestans</strong> &mdash; the late blight pathogen that triggered the Irish Potato Famine in the 1840s and remains the world's most economically costly potato disease.",
        body: [
          "Plant pathologists have identified the Toluca Valley as a region where sexual reproduction of P. infestans occurs, continually generating new genotypes — a scientific significance that has nothing to do with Mexico's production volume, but matters enormously to global potato disease research and resistance breeding programs worldwide.",
        ],
        source: "Source: Grünwald and Flier, 2005, Canadian Journal of Plant Pathology; Fry et al., 2015, Phytopathology.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Mexico's potato industry face?",
        lead: "<strong>Water scarcity</strong> is the paramount challenge, given 85&ndash;90% irrigation dependence in arid production zones. <strong>Late blight</strong> pressure in highland areas and <strong>fresh-market price volatility</strong> for growers outside contract farming round out the main constraints.",
        body: [
          "The 2020-2022 drought in northern Mexico severely affected reservoir levels in Sinaloa and Sonora, directly reducing potato production area in those states — a clear illustration of how exposed Mexico's irrigation-dependent model is to water availability shocks. Growers without processing contracts also face significant price swings at Mexico City's Central de Abasto, Latin America's largest wholesale market.",
        ],
        source: "Source: CONAGUA 2023; SNIIM (Sistema Nacional de Información e Integración de Mercados) price data 2023.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and yield statistics",
      "SIAP/SADER (Servicio de Información Agroalimentaria y Pesquera) — national and state-level production data",
      "INIFAP (Instituto Nacional de Investigaciones Forestales, Agrícolas y Pecuarias) — variety development and research",
      "PepsiCo Mexico / Sabritas — corporate and contract-farming data",
      "USDA FAS GAIN Reports and GATS — trade data",
      "CONAGUA (Comisión Nacional del Agua) — irrigation and water-resource data",
    ],
    faqItems: [
      { q: "How much potato does Mexico produce per year?", a: "Mexico produced approximately 1.9 million tonnes in 2023 (FAOSTAT) on roughly 65,000 hectares — Central America's largest potato producer, with 85–90% of production irrigated." },
      { q: "Which Mexican state produces the most potatoes?", a: "Sinaloa, accounting for approximately 35% of national production, concentrated in the Culiacán and Los Mochis valleys during the fall-winter growing cycle." },
      { q: "How does PepsiCo/Sabritas influence Mexico's potato industry?", a: "Sabritas holds over 70% of the Mexican chip market and contracts 15,000–20,000 hectares annually, making it the largest private potato buyer in Mexico and a direct influence on which varieties farmers plant." },
      { q: "Does Mexico import potatoes?", a: "Yes, Mexico is a net importer — importing 150,000–200,000 tonnes of frozen fries annually (80–85% from the US) plus 50,000–80,000 tonnes of fresh potatoes, while exporting under USD 30 million worth mainly to Central America." },
      { q: "Why is Mexico's Toluca Valley scientifically important for potatoes?", a: "The Toluca Valley is part of the actual center of genetic diversity for Phytophthora infestans, the late blight pathogen that caused the Irish Potato Famine — making it a key research site for global late blight resistance breeding." },
    ],
    regionalContext: [
      { slug: "united-states", note: "Dominant seed and frozen-fry trade partner" },
      { slug: "canada", note: "Secondary seed and export partner (USMCA)" },
      { slug: "peru", note: "Andean genetic-diversity counterpart" },
      { slug: "brazil", note: "Latin American peer market" },
    ],
    continueReading: [
      { href: "/knowledge/what-is-late-blight", tag: "Diseases", title: "What Is Late Blight?", desc: "Why Mexico's Toluca Valley is central to global late blight research." },
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "Sabritas' contract-farming model and Mexico's chip-processing dominance." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How USMCA shapes Mexico's frozen-fry import dependence on the US." },
      { href: "/country/united-states", tag: "Country", title: "United States Country Profile", desc: "Mexico's dominant seed and frozen-fry trading partner." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Brazil: full Country Intelligence Dossier (Tier 1, premium template) ── */
function BrazilProfilePage({ c }) {
  const data = {
    slug: "brazil", name: "Brazil", flag: c.flag, region: c.region,
    h1: "Brazil Potato Industry: One Variety Grows 70% of the Crop — a Concentration Risk Hiding in Plain Sight",
    tagLabel: "Brazil · South America",
    readMin: 13,
    accentLabel: "A single Dutch-bred variety, Agata, accounts for an estimated 70%+ of every potato grown in Brazil — a level of varietal concentration plant pathologists have repeatedly flagged as a phytosanitary risk. Meanwhile Brazil imports 200,000 tonnes of frozen fries a year even as it's South America's second-largest producer, growing potatoes across three separate cropping seasons.",
    wikidata: "https://www.wikidata.org/wiki/Q155",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2023, FAOSTAT)", value: "~3.7M tonnes" },
      { label: "Yield", value: "30.8 t/ha (above world average)" },
      { label: "Top state", value: "Minas Gerais (32–35% of output)" },
      { label: "Agata's market share", value: "70%+ of all potatoes planted" },
      { label: "Frozen fry imports (2023)", value: "~200,000 tonnes (USD 250M+)" },
      { label: "Growing seasons", value: "3 per year (safras)" },
    ],
    definitiveAnswer: "<strong>Brazil produced approximately 3.7 million tonnes of potatoes in 2023</strong> on about 120,000 hectares at a yield of 30.8 t/ha (FAOSTAT) &mdash; South America's <strong>second-largest producer after Peru</strong> by volume, but with meaningfully higher yields thanks to modern practices concentrated in the southeast and south. Brazil runs <strong>three distinct growing seasons per year</strong> (safra das águas, safra da seca, safra de inverno), a structural feature that distinguishes it from single-harvest temperate producers. The single most striking fact about Brazilian potatoes: the cultivar <strong>Agata accounts for an estimated 70% or more of everything planted nationally</strong> &mdash; a concentration level Embrapa plant pathologists have repeatedly warned increases vulnerability to late blight, bacterial wilt, and virus complex diseases. Despite solid production, Brazil is a <strong>significant net importer of frozen French fries</strong> &mdash; about 200,000 tonnes in 2023, worth over USD 250 million &mdash; led by Argentina, Belgium, and the Netherlands, since domestic frozen-fry processing hasn't kept pace with a growing QSR sector where McDonald's alone runs over 1,100 Brazilian outlets.",
    keyStats: [
      { value: "3.7M t", label: "2023 production" },
      { value: "70%+", label: "Agata's share of area", accent: "#C62828" },
      { value: "3", label: "Growing seasons per year" },
      { value: "200K t", label: "2023 frozen fry imports" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Brazil's potato industry?" },
      { id: "regions", l: "Which Brazilian states produce the most potatoes?" },
      { id: "varieties", l: "Why does one variety dominate Brazil's potato crop?" },
      { id: "processing", l: "Who processes potatoes in Brazil?" },
      { id: "trade", l: "Why does Brazil import so many frozen fries?" },
      { id: "challenges", l: "What challenges does Brazil's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Brazil's potato industry?",
        lead: "Brazil is <strong>South America's second-largest potato producer after Peru</strong>, producing approximately <strong>3.7 million tonnes</strong> from about 120,000 hectares at a yield of <strong>30.8 t/ha</strong> (FAOSTAT 2023) &mdash; well above the world average of ~22.3 t/ha.",
        quickFacts: [
          { label: "Production (2023)", value: "~3.7M tonnes" },
          { label: "Area", value: "~120,000 hectares" },
          { label: "Yield", value: "30.8 t/ha" },
          { label: "Growing seasons", value: "3 (safra das águas, seca, inverno)" },
        ],
        body: [
          "Brazil's three-crop calendar is a distinctive structural feature: the safra das águas (water crop, planted Oct–Dec) is dispersed across southern and southeastern states, while the safra de inverno (winter crop, planted May–Jul) concentrates in irrigated Minas Gerais — meaning Brazil harvests potatoes somewhere in the country nearly year-round, unlike single-harvest temperate producers.",
        ],
        source: "Source: FAOSTAT 2023; IBGE (Instituto Brasileiro de Geografia e Estatística), Levantamento Sistemático da Produção Agrícola 2023.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Which Brazilian states produce the most potatoes?",
        lead: "<strong>Minas Gerais leads at 32&ndash;35% of national production</strong>, centered on the Alto Paranaíba mesoregion, followed by São Paulo (25&ndash;28%) and Paraná (15&ndash;18%).",
        table: {
          headers: ["State", "Share", "Key areas", "Notes"],
          rows: [
            ["Minas Gerais", "32–35%", "Alto Paranaíba (Araguari, Perdizes, Santa Juliana)", "Cerrado soils, 800–1,100m altitude, reliable irrigation"],
            ["São Paulo", "25–28%", "Vargem Grande do Sul, Itapetininga, Piedade, Sorocaba", "Proximity to 22M-person Greater São Paulo market"],
            ["Paraná", "15–18%", "Campos Gerais, Guarapuava", "Cooler summer climate favorable for production"],
            ["Rio Grande do Sul, Goiás, Bahia (Chapada Diamantina)", "Smaller", "&mdash;", "Locally significant volumes"],
          ],
        },
        source: "Source: IBGE 2023; Embrapa Hortaliças 2022.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "Why does one variety dominate Brazil's potato crop?",
        lead: "<strong>Agata</strong>, originally bred by HZPC in the Netherlands, accounts for an estimated <strong>70% or more of all potatoes planted in Brazil</strong> — a yellow-fleshed, smooth-skinned cultivar favored for its waxy texture, appearance, and short growing cycle (90&ndash;100 days).",
        callout: { number: "70%+", context: "of Brazil's entire potato crop is a single variety, Agata. Embrapa and Brazilian university plant pathologists have repeatedly warned this monoculture reliance increases vulnerability to late blight, bacterial wilt (Ralstonia solanacearum), and virus complex diseases — a nationally significant phytosanitary risk hiding behind otherwise healthy production numbers.", source: "Lopes and Quezado-Duval, 2021, Tropical Plant Pathology" },
        body: [
          "For processing, <strong>Atlantic</strong> (a US-developed 1978 release with 22-24% dry matter) dominates chip production, while <strong>Asterix</strong> (red-skinned, HZPC) and <strong>Markies</strong> serve frying and general cooking. Embrapa's own breeding program has released BRS Clara and BRS F63 targeting the processing segment, but neither has meaningfully dented Agata's dominance of the fresh market.",
        ],
        source: "Source: Embrapa Hortaliças 2022; HZPC variety catalog; Pereira et al., 2019, Horticultura Brasileira.",
      },
      { id: "processing", dataCard: "processing",
        h2: "Who processes potatoes in Brazil?",
        lead: "The chip segment is well-developed — <strong>PepsiCo's Frito-Lay</strong> operates a major facility in Itu, São Paulo (Elma Chips/Lay's/Ruffles brands), contracting 200&ndash;300 growers annually. The frozen-fry segment lags well behind domestic demand.",
        table: {
          headers: ["Company", "Segment", "Notes"],
          rows: [
            ["Frito-Lay (PepsiCo)", "Chips", "Itu, São Paulo plant; Elma Chips/Lay's/Ruffles brands; 200–300 contract growers"],
            ["Bem Brasil", "Frozen fries", "Founded 2006, Araxá, Minas Gerais; largest domestic frozen-fry producer (~100,000–120,000t/yr capacity)"],
            ["McCain Foods", "Frozen fries", "Smaller scale than McCain's North American operations"],
          ],
        },
        body: [
          "Domestic frozen-fry production has been constrained by higher raw-material costs than North America or Europe, a lack of dedicated high-dry-matter processing varieties, and well-established import channels that make importing often more economical than expanding local capacity.",
        ],
        source: "Source: PepsiCo Brazil 2022 ESG Report; USDA FAS GAIN Report BR2023-0028; Bem Brasil corporate communications.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Why does Brazil import so many frozen fries?",
        lead: "Brazil imported approximately <strong>200,000 tonnes of frozen potato products in 2023</strong>, worth over <strong>USD 250 million</strong> — led by <strong>Argentina (40&ndash;45%)</strong>, benefiting from Mercosul tariff advantages and McCain's large Balcarce operations, followed by <strong>Belgium (25&ndash;30%)</strong> and the <strong>Netherlands (15&ndash;20%)</strong>.",
        body: [
          "Brazilian exports, by contrast, are minimal — mostly small volumes of seed potatoes and processed snacks to neighboring countries, since domestic prices typically exceed export parity and phytosanitary barriers limit fresh exports. The paradox is central to understanding Brazil's potato economy: a major producer that's simultaneously a major importer of processed product, driven by a growing middle class and QSR expansion outpacing domestic frozen-fry capacity.",
        ],
        source: "Source: SECEX/MDIC trade database 2023; FAOSTAT Trade 2023; Belgapom (Belgian Potato Trade Association) 2023.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Brazil's potato industry face?",
        lead: "High production costs (among the highest in Latin America per tonne, per FGV), <strong>El Niño-driven climate variability</strong>, and the structural risk of <strong>Agata's near-monoculture status</strong> are the three defining pressures.",
        body: [
          "The 2023-2024 El Niño event caused significant yield reductions in Paraná and Rio Grande do Sul from excessive rainfall and flooding, illustrating how exposed southeastern Brazil's rain-fed cropping calendar is to ENSO cycle variability — even as the irrigated Minas Gerais winter crop can better manage drought stress, albeit at higher energy cost.",
        ],
        source: "Source: FGV Agro 2023; INMET (Instituto Nacional de Meteorologia) 2023; Embrapa climate bulletins.",
      },
    ],
    sourceList: [
      "FAOSTAT — production, area, and yield statistics",
      "IBGE (Instituto Brasileiro de Geografia e Estatística) — Levantamento Sistemático da Produção Agrícola",
      "Embrapa Hortaliças — variety breeding and phytosanitary research",
      "SECEX/MDIC — Brazilian customs trade data",
      "ABBA (Associação Brasileira da Batata) — producer association data",
      "PepsiCo Brazil; Bem Brasil — corporate processing data",
    ],
    faqItems: [
      { q: "How much potato does Brazil produce per year?", a: "Brazil produced approximately 3.7 million tonnes in 2023 (FAOSTAT), South America's second-largest producer after Peru, at a yield of 30.8 t/ha — above the world average." },
      { q: "What is the most grown potato variety in Brazil?", a: "Agata, a Dutch-bred (HZPC) variety, accounts for an estimated 70% or more of all potatoes planted in Brazil — a concentration level plant pathologists have flagged as a significant disease-vulnerability risk." },
      { q: "Which Brazilian state produces the most potatoes?", a: "Minas Gerais, accounting for 32–35% of national production, centered on the Alto Paranaíba mesoregion around Araguari, Perdizes, and Santa Juliana." },
      { q: "Does Brazil import potatoes despite being a major producer?", a: "Yes — Brazil imported approximately 200,000 tonnes of frozen French fries in 2023 (worth over USD 250 million), primarily from Argentina, Belgium, and the Netherlands, since domestic frozen-fry processing hasn't kept pace with growing QSR demand." },
      { q: "How many growing seasons does Brazil have for potatoes?", a: "Three per year — the safra das águas (water crop, Oct–Dec), safra da seca (dry crop, Feb–Apr), and safra de inverno (winter crop, May–Jul) — giving Brazil near-year-round domestic harvest coverage." },
    ],
    regionalContext: [
      { slug: "peru", note: "South America's largest producer" },
      { slug: "colombia", note: "Andean regional peer" },
      { slug: "mexico", note: "Latin American peer, PepsiCo/Sabritas parallel" },
      { slug: "netherlands", note: "Agata's breeding origin (HZPC)" },
    ],
    continueReading: [
      { href: "/blog/brazil-potato-paradox-mccain-investment", tag: "Analysis", title: "Brazil's Potato Paradox", desc: "The story-format deep dive on Brazil's producer-and-importer contradiction." },
      { href: "/knowledge/potato-varieties-guide", tag: "Varieties", title: "Potato Varieties Guide", desc: "Why Agata's 70% market share is a global outlier in varietal concentration." },
      { href: "/knowledge/what-is-late-blight", tag: "Diseases", title: "What Is Late Blight?", desc: "The disease-vulnerability risk Embrapa has flagged around Agata monoculture." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How Argentina, Belgium, and the Netherlands supply Brazil's frozen-fry gap." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Denmark: full Country Intelligence Dossier (Tier 1, premium template) ── */
function DenmarkProfilePage({ c }) {
  const data = {
    slug: "denmark", name: "Denmark", flag: c.flag, region: c.region,
    h1: "Denmark Potato Industry: A Mid-Sized Producer Punching Above Its Weight in Starch and Organics",
    tagLabel: "Denmark · Europe",
    readMin: 12,
    accentLabel: "Denmark ranks only 8th–10th among EU potato producers by volume, but its KMC cooperative — founded in 1933 and owned by 1,500 farmer-members — is a top-5 EU potato starch producer, and Denmark's organic potato sector reflects the country's position as the world leader in per-capita organic food consumption.",
    wikidata: "https://www.wikidata.org/wiki/Q35",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2023, Eurostat)", value: "~1.6M tonnes" },
      { label: "EU production share", value: "~3.3%" },
      { label: "EU rank", value: "8th–10th largest" },
      { label: "KMC members", value: "~1,500 farmers" },
      { label: "Organic potato share", value: "6–7% of total area" },
      { label: "Trade position", value: "Modest net exporter" },
    ],
    definitiveAnswer: "<strong>Denmark produced approximately 1.6 million tonnes of potatoes in 2023</strong> (Eurostat) on roughly 56,000 hectares &mdash; about <strong>3.3% of EU production</strong>, ranking Denmark <strong>8th to 10th among EU potato producers</strong>, well behind the \"big five\" of Germany, France, the Netherlands, Poland, and Belgium. What Denmark lacks in scale it makes up in specialization: the <strong>KMC cooperative</strong> (Kartoffelmelcentralen), founded in 1933 in Brande and owned by roughly <strong>1,500 farmer members</strong>, processes about 1 million tonnes of starch potatoes annually and ranks among the <strong>top-5 potato starch producers in the EU</strong>, alongside AVEBE (Netherlands) and Emsland Group (Germany). Denmark is also a European leader in <strong>organic potato production</strong> (6&ndash;7% of total potato area), consistent with the country's position as the world's highest per-capita organic food consumer, and <strong>Samsø island's</strong> early \"new\" potatoes function as a protected, premium seasonal brand nationally. Denmark is a <strong>modest net exporter</strong> overall, with total potato and potato-product exports estimated at EUR 200&ndash;300 million per year.",
    keyStats: [
      { value: "1.6M t", label: "2023 production" },
      { value: "8th–10th", label: "EU production rank" },
      { value: "~1M t", label: "KMC annual starch-potato volume" },
      { value: "6–7%", label: "Share of area organic" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Denmark's potato industry?" },
      { id: "starch", l: "Why is Denmark's KMC cooperative significant?" },
      { id: "regions", l: "Where are potatoes grown in Denmark?" },
      { id: "companies", l: "Which companies define Denmark's potato sector?" },
      { id: "organic", l: "Why is Denmark a leader in organic potatoes?" },
      { id: "trade", l: "Does Denmark import or export potatoes?" },
      { id: "challenges", l: "What challenges does Denmark's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Denmark's potato industry?",
        lead: "Denmark produces approximately <strong>1.5&ndash;2.0 million tonnes annually</strong> on 55,000&ndash;60,000 hectares — about <strong>3.3% of EU production</strong>, ranking <strong>8th to 10th among EU producers</strong> (Eurostat 2023).",
        quickFacts: [
          { label: "2022 production", value: "~1.7M tonnes" },
          { label: "2023 production", value: "~1.6M tonnes" },
          { label: "EU production share", value: "~3.3%" },
          { label: "Area breakdown", value: "Ware ~25K ha, starch ~20K ha, seed ~5–6K ha" },
        ],
        body: [
          "Danish potato area has been relatively stable over the past decade, though starch-potato area has declined somewhat as the KMC cooperative has consolidated, while organic production has grown — reflecting Denmark's broader national leadership in organic agriculture.",
        ],
        source: "Source: FAOSTAT; Eurostat, \"The EU potato sector\" 2024 update; Statistics Denmark (Danmarks Statistik).",
      },
      { id: "starch", dataCard: "starch",
        h2: "Why is Denmark's KMC cooperative significant?",
        lead: "<strong>KMC (Kartoffelmelcentralen)</strong>, founded in 1933 and headquartered in Brande, is a cooperative owned by roughly <strong>1,500 Danish farmer members</strong>, processing about <strong>1 million tonnes of starch potatoes per year</strong> — ranking it among the EU's top-5 potato starch producers.",
        callout: { number: "Top-5", context: "KMC's rank among EU potato starch producers, alongside AVEBE (Netherlands) and Emsland Group (Germany). KMC generates an estimated EUR 250–300 million in revenue with 300–400 employees, and exports to more than 50 countries.", source: "KMC cooperative annual reports; Danish business registry (CVR)" },
        body: [
          "KMC's product range spans native and modified potato starches, potato protein (feed and food grade), potato fibers, and flakes/granulates — serving the food industry (sauces, soups, bakery, confectionery, noodles) plus paper, textile sizing, and adhesive applications. <strong>Kuras</strong> is the dominant starch variety, at roughly 21% starch content, alongside Seresta and Aventra. AKV Langholt operates a smaller secondary starch operation in North Jutland.",
        ],
        source: "Source: KMC cooperative annual reports; Statistics Denmark; KMC grower information.",
      },
      { id: "regions", dataCard: "regions",
        h2: "Where are potatoes grown in Denmark?",
        lead: "<strong>Western Jutland</strong> is the starch-potato heartland (sandy soils), while <strong>Zealand and the islands</strong> handle ware and early potatoes — with <strong>Samsø island's</strong> \"new\" potatoes a protected premium seasonal identity.",
        table: {
          headers: ["Region", "Role", "Notes"],
          rows: [
            ["Western Jutland", "Starch potato heartland", "Sandy soils suit starch varieties (~20,000 ha)"],
            ["Zealand & the islands", "Ware and early potatoes", "&mdash;"],
            ["Samsø island", "Premium early \"new\" potatoes", "\"Samsø kartofler\" is a protected seasonal product identity"],
            ["Lammefjorden", "Premium table potatoes", "Unique marine clay soils"],
          ],
        },
        source: "Source: Danish Agriculture & Food Council; Statistics Denmark.",
      },
      { id: "companies", dataCard: "companies",
        h2: "Which companies define Denmark's potato sector?",
        lead: "<strong>Danespo</strong> (a DLF / German-Solana joint venture) leads breeding and seed, while <strong>KiMs</strong> (Orkla Group) dominates Denmark's crisp/snack market and <strong>HZPC</strong> maintains significant variety representation.",
        table: {
          headers: ["Company", "Role", "Notes"],
          rows: [
            ["Danespo", "Breeding, seed, table potatoes", "HQ Vandel, Jutland; JV of Danish DLF + German Solana; exports to 20+ countries"],
            ["KiMs (Orkla)", "Chips/crisps", "Denmark's leading chip brand; factory in Søndersø, Funen"],
            ["HZPC Denmark", "Variety representation", "Dutch seed-potato leader's Danish operations"],
            ["Danish Agro", "Trading & distribution", "Major agricultural cooperative supplying seed and inputs"],
          ],
        },
        body: [
          "Danespo's key varieties include Folva (a Danish table-potato favorite), Hamlet, Jutlandia, Trésor, Elfe, and Campina — bred specifically for Nordic and European market conditions at an active breeding station.",
        ],
        source: "Source: Danespo corporate website; Orkla ASA annual reports; HZPC corporate records.",
      },
      { id: "organic", dataCard: "organic",
        h2: "Why is Denmark a leader in organic potatoes?",
        lead: "Denmark has the <strong>world's highest per-capita organic food consumption</strong>, and organic potato area — an estimated <strong>3,000&ndash;4,000 hectares (6&ndash;7% of total potato area)</strong> — reflects that national leadership directly.",
        body: [
          "Organic conversion has been supported by Danish government subsidies and the Ø-mærket (red Ø) organic label, with organic potatoes widely available through major retailers Coop Danmark and Salling Group (Netto/Føtex). Key organic varieties include Ditta, Allians, and Marabel.",
        ],
        source: "Source: Statistics Denmark; Danish Agriculture & Food Council; Eurostat organic farming statistics.",
      },
      { id: "trade", dataCard: "trade",
        h2: "Does Denmark import or export potatoes?",
        lead: "Denmark is a <strong>modest net exporter</strong> overall, with total potato and potato-product exports estimated at <strong>EUR 200&ndash;300 million per year</strong> — KMC's starch products alone reach over 50 countries. Denmark is also a <strong>net importer of seed potatoes</strong>, primarily from the Netherlands.",
        body: [
          "Fresh exports are modest, going mainly to Sweden and Norway, while Denmark imports frozen potato products from Belgium, the Netherlands, and Germany for foodservice, plus seasonal early/new potatoes from Spain, Egypt, and Israel before the Danish early season begins.",
        ],
        source: "Source: Statistics Denmark trade data; Eurostat intra-EU trade data.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Denmark's potato industry face?",
        lead: "Four recurring pressures: <strong>competition for arable land</strong> from highly profitable Danish grain and oilseed crops, <strong>climate variability</strong> in growing-season rainfall, persistent <strong>late blight</strong> pressure, and <strong>nematode management</strong> in intensively rotated starch-potato areas.",
        body: [
          "Denmark's land-competition challenge is distinctive: unlike countries where potato competes against subsistence or lower-value crops, in Denmark it competes directly against some of Europe's most profitable grain and oilseed operations — meaning potato area growth depends on the crop remaining genuinely more profitable per hectare, not just viable.",
        ],
        source: "Source: SEGES Innovation advisory publications; Aarhus University research reports.",
      },
    ],
    sourceList: [
      "FAOSTAT; Eurostat — production, area, and EU-context statistics",
      "Statistics Denmark (Danmarks Statistik) — national production data",
      "KMC cooperative annual reports; Danish business registry (CVR)",
      "Danespo corporate records; Orkla ASA annual reports (KiMs)",
      "SEGES Innovation; Aarhus University Department of Agroecology — research",
      "Danish Agriculture & Food Council (Landbrug & Fødevarer)",
    ],
    faqItems: [
      { q: "How much potato does Denmark produce per year?", a: "Denmark produced approximately 1.6 million tonnes in 2023 (Eurostat), about 3.3% of EU production, ranking 8th to 10th among EU potato producers." },
      { q: "What is KMC and why does it matter for Denmark's potato industry?", a: "KMC (Kartoffelmelcentralen) is a Danish farmer-owned starch cooperative founded in 1933, processing about 1 million tonnes of starch potatoes annually and ranking among the EU's top-5 potato starch producers, alongside AVEBE and Emsland Group." },
      { q: "Is Denmark a leader in organic potato production?", a: "Yes — Denmark has the world's highest per-capita organic food consumption, and organic potatoes account for an estimated 6–7% of the country's total potato area, supported by government subsidies and the Ø-mærket organic label." },
      { q: "What is the most popular potato variety in Denmark?", a: "Folva, bred by Danespo, is one of the most popular Danish table varieties, alongside Sava, Ditta, and the declining historic Dutch variety Bintje." },
      { q: "Does Denmark export potatoes?", a: "Yes, modestly — Denmark is a net exporter overall (EUR 200–300 million/year), with KMC's starch products reaching over 50 countries, though Denmark also imports significant seed-potato volumes from the Netherlands." },
    ],
    regionalContext: [
      { slug: "netherlands", note: "Dominant seed-import source" },
      { slug: "germany", note: "Fellow top-5 EU starch producer (Emsland)" },
      { slug: "belgium", note: "Frozen-product import source" },
      { slug: "poland", note: "EU production-scale comparison" },
    ],
    continueReading: [
      { href: "/knowledge/potato-starch-uses", tag: "Processing", title: "What Is Potato Starch Used For?", desc: "KMC's role among the EU's top potato starch producers." },
      { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "Denmark's reliance on Dutch seed imports and Danespo's Nordic breeding program." },
      { href: "/country/netherlands", tag: "Country", title: "Netherlands Country Profile", desc: "Denmark's dominant seed-potato trading partner." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How Denmark balances modest exports against significant seed imports." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── Japan: full Country Intelligence Dossier (Tier 1, premium template) ── */
function JapanProfilePage({ c }) {
  const data = {
    slug: "japan", name: "Japan", flag: c.flag, region: c.region,
    h1: "Japan Potato Industry: Hokkaido Grows 80%, Calbee Turns It Into Wasabi-Flavored Chips (3.0M Tonnes)",
    tagLabel: "Japan · Asia",
    readMin: 11,
    accentLabel: "Japan's potato industry is remarkably concentrated on one cool-climate island — Hokkaido grows 75–80% of the national crop — feeding a sophisticated processing industry led by Calbee, whose chips come in flavors like seaweed and wasabi rather than the plain-and-BBQ lineup common elsewhere.",
    wikidata: "https://www.wikidata.org/wiki/Q17",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024, est.)", value: "~3.0M tonnes" },
      { label: "Hokkaido's share", value: "75–80% of national production" },
      { label: "Top processor", value: "Calbee (Japan's largest snack company)" },
      { label: "Trade position", value: "Significant net importer (frozen fries)" },
      { label: "Import sources", value: "USA, Canada" },
      { label: "Cultural dish", value: "Nikujaga (meat and potato stew)" },
    ],
    definitiveAnswer: "<strong>Japan produces approximately 3.0 million tonnes of potatoes annually</strong>, with production overwhelmingly concentrated on one island: <strong>Hokkaido accounts for 75&ndash;80% of the entire national crop</strong>, thanks to a cool climate ideally suited to potato cultivation. Japan supports a genuinely sophisticated processing industry built around premium potato chips, starch, and frozen products &mdash; led by <strong>Calbee</strong>, Japan's largest snack company, alongside Koike-ya and Meiji, known for distinctly Japanese chip flavors like seaweed and wasabi rather than the standard Western lineup. Despite strong domestic production and processing, Japan remains a <strong>significant importer of frozen potato products</strong>, primarily from the United States and Canada, to meet demand its own frozen-fry sector doesn't fully cover. Potato holds real cultural weight in Japan too: <strong>nikujaga</strong> (meat and potato stew) is considered a national comfort food, and Hokkaido-grown potatoes carry a premium quality reputation nationwide.",
    keyStats: [
      { value: "3.0M t", label: "Annual production (est.)" },
      { value: "75–80%", label: "Hokkaido's share" },
      { value: "#1", label: "Calbee, Japan's largest snack co." },
      { value: "Net importer", label: "Frozen fry trade position" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is Japan's potato industry?" },
      { id: "hokkaido", l: "Why does Hokkaido grow 75–80% of Japan's potatoes?" },
      { id: "varieties", l: "What potato varieties are grown in Japan?" },
      { id: "processing", l: "What makes Japan's potato processing industry distinctive?" },
      { id: "trade", l: "Does Japan import potato products?" },
      { id: "culture", l: "How central is potato to Japanese cuisine?" },
      { id: "challenges", l: "What challenges does Japan's potato industry face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is Japan's potato industry?",
        lead: "Japan produces approximately <strong>3.0 million tonnes of potatoes annually</strong>, with cultivation concentrated almost entirely on the northern island of <strong>Hokkaido</strong>.",
        quickFacts: [
          { label: "Annual production", value: "~3.0M tonnes (est.)" },
          { label: "Top region", value: "Hokkaido (75–80%)" },
          { label: "Other regions", value: "Nagasaki, Kagoshima (early season)" },
        ],
        source: "Source: National agricultural statistics of Japan; USDA FAS.",
      },
      { id: "hokkaido", dataCard: "hokkaido",
        h2: "Why does Hokkaido grow 75–80% of Japan's potatoes?",
        lead: "Hokkaido's <strong>cool climate is ideal for potato cultivation</strong>, giving it a dominant position — 75&ndash;80% of national production — that few other single regions anywhere in the world match for a major producing country.",
        callout: { number: "75–80%", context: "of all Japanese potatoes are grown on Hokkaido alone — a level of single-region concentration that makes Hokkaido's growing conditions the effective bottleneck and benchmark for Japan's entire potato supply.", source: "National agricultural statistics of Japan" },
        body: [
          "Hokkaido's growing season runs May planting to September–October harvest. Southern Japan operates on an entirely different calendar — winter planting (December–January) with a spring harvest (April–May) — meaning Nagasaki and Kagoshima prefectures supply Japan's early-season potatoes while Hokkaido's much larger crop dominates the main season.",
        ],
        source: "Source: National agricultural statistics of Japan.",
      },
      { id: "varieties", dataCard: "varieties",
        h2: "What potato varieties are grown in Japan?",
        lead: "<strong>May Queen</strong> is the most popular table variety, alongside the traditional <strong>Danshaku</strong> (Irish Cobbler) and Hokkaido favorite <strong>Kitaakari</strong>. Processing runs on Toyoshiro (starch) and Snowden (chipping).",
        table: {
          headers: ["Variety", "Role"],
          rows: [
            ["May Queen", "Most popular table variety"],
            ["Danshaku (Irish Cobbler)", "Traditional variety, popular for decades"],
            ["Kitaakari", "Popular in Hokkaido"],
            ["Toyoshiro", "Processing variety, for starch"],
            ["Snowden", "Chipping variety"],
            ["Inca no Mezame", "Premium purple-fleshed specialty variety"],
          ],
        },
        source: "Source: National agricultural statistics of Japan.",
      },
      { id: "processing", dataCard: "processing",
        h2: "What makes Japan's potato processing industry distinctive?",
        lead: "Japan's processing sector is genuinely sophisticated, producing <strong>premium potato chips, starch, and frozen products</strong>. <strong>Calbee</strong> is Japan's largest snack company, alongside Koike-ya and Meiji, known for distinctly Japanese chip flavors like seaweed and wasabi.",
        body: [
          "This flavor-innovation focus is a genuine point of differentiation from Western chip markets, where variety comes mostly from cut style and salt level rather than fundamentally different flavor profiles — Japan's snack industry treats flavor variation as a core competitive dimension.",
        ],
        source: "Source: National agricultural statistics of Japan; company public information (Calbee, Koike-ya, Meiji).",
      },
      { id: "trade", dataCard: "trade",
        h2: "Does Japan import potato products?",
        lead: "Yes — Japan is a <strong>significant importer of frozen potato products</strong>, particularly from the <strong>United States and Canada</strong>, to meet domestic demand that its own frozen-fry processing doesn't fully cover. Japanese exports of premium processed products are limited by comparison.",
        body: [
          "This import reliance sits alongside genuinely strong domestic chip production — Japan's processing gap is specifically in frozen fries rather than potato processing broadly, a distinction that mirrors patterns seen in South Korea and several other Asian markets where domestic snack manufacturing is strong but frozen-fry capacity lags QSR-driven demand.",
        ],
        source: "Source: USDA FAS; national trade statistics.",
      },
      { id: "culture", dataCard: "culture",
        h2: "How central is potato to Japanese cuisine?",
        lead: "<strong>Nikujaga</strong> (meat and potato stew) is considered a genuine national comfort food, and <strong>Hokkaido-grown potatoes carry a nationally recognized quality reputation</strong> — a regional-provenance premium similar to how other countries treat specific wine or produce regions.",
        source: "Source: National agricultural statistics of Japan; cultural/culinary reference sources.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does Japan's potato industry face?",
        lead: "Five recurring pressures: an <strong>aging farming population</strong>, <strong>limited agricultural land</strong>, <strong>high production costs</strong>, <strong>competition from imported processed products</strong>, and <strong>typhoon and weather risk</strong>.",
        body: [
          "These pressures compound each other in a way common across developed-Asia agriculture: high production costs driven by an aging, shrinking farm labor pool make Japan's domestic potatoes structurally more expensive than imports, which in turn pushes more of the processed-product market toward US and Canadian supply.",
        ],
        source: "Source: National agricultural statistics of Japan; USDA FAS.",
      },
    ],
    sourceList: [
      "National agricultural statistics of Japan",
      "USDA FAS (Foreign Agricultural Service) — trade data",
      "Company public information — Calbee, Koike-ya, Meiji",
    ],
    faqItems: [
      { q: "How much potato does Japan produce per year?", a: "Japan produces approximately 3.0 million tonnes of potatoes annually, with Hokkaido accounting for 75–80% of national production." },
      { q: "Why does Hokkaido grow most of Japan's potatoes?", a: "Hokkaido's cool climate is ideally suited to potato cultivation, giving the island a dominant 75–80% share of national production — a concentration level rarely matched by a single region in any major producing country." },
      { q: "What is Japan's largest potato chip company?", a: "Calbee is Japan's largest snack company and a major potato chip producer, known for distinctly Japanese flavors like seaweed and wasabi, alongside competitors Koike-ya and Meiji." },
      { q: "Does Japan import frozen French fries?", a: "Yes — Japan is a significant importer of frozen potato products, primarily from the United States and Canada, since domestic frozen-fry processing doesn't fully cover national demand." },
      { q: "What is a traditional Japanese potato dish?", a: "Nikujaga, a meat and potato stew, is considered a national comfort food in Japan, and Hokkaido-grown potatoes carry a widely recognized premium quality reputation." },
    ],
    regionalContext: [
      { slug: "south-korea", note: "Asia-Pacific snack-market peer" },
      { slug: "china", note: "Asia's #1 producer" },
      { slug: "united-states", note: "Dominant frozen fry import source" },
      { slug: "canada", note: "Secondary frozen fry import source" },
    ],
    continueReading: [
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "Calbee's chip-making process and Japan's frozen-fry import dependence." },
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "Why Japan imports frozen fries despite strong domestic chip production." },
      { href: "/country/south-korea", tag: "Country", title: "South Korea Country Profile", desc: "A neighboring Asian snack-market peer with a similar import-dependency pattern." },
      { href: "/knowledge/potato-varieties-guide", tag: "Varieties", title: "Potato Varieties Guide", desc: "May Queen, Danshaku, and Japan's distinct varietal lineup." },
    ],
  };
  return <CountryProfilePremium data={data} />;
}

/* ── South Korea: full Country Intelligence Dossier (Tier 1, premium template) ── */
function SouthKoreaProfilePage({ c }) {
  const data = {
    slug: "south-korea", name: "South Korea", flag: c.flag, region: c.region,
    h1: "South Korea Potato Industry: Domestic Production Stalled a Decade, Frozen Fry Imports Up 50%",
    tagLabel: "South Korea · Asia",
    readMin: 12,
    accentLabel: "South Korea's potato production hasn't grown in a decade, but its appetite for processed potatoes has — frozen fry imports are up 50% since 2014, and Nongshim, Orion, and Haetae-Calbee now source less than 20% of their chipping potatoes domestically. A 2026 tariff cut on US chipping potatoes is about to make that gap even wider.",
    wikidata: "https://www.wikidata.org/wiki/Q884",
    articlePublishedISO: "2026-07-16", articleModifiedISO: "2026-07-16", indiaContext: false,
    quickFacts: [
      { label: "Production (2024, est.)", value: "~570,000+ tonnes (5-yr high)" },
      { label: "10-year production change", value: "~flat (no growth since 2014)" },
      { label: "Domestic chipping-potato supply", value: "&lt;20% of demand" },
      { label: "Frozen fry imports (2023)", value: "183,000 tonnes" },
      { label: "10-year import growth", value: "+50% (2014–2024)" },
      { label: "Chinese import growth", value: "+6,000% (2021–23)" },
    ],
    definitiveAnswer: "<strong>South Korea produced an estimated 570,000+ tonnes of potatoes in 2024</strong> &mdash; a five-year high, but roughly the same absolute level as 2014, meaning <strong>domestic production hasn't grown in a decade</strong> even as demand for processed potato products keeps rising. The structural gap is stark: <strong>domestic production supplies less than 20% of South Korea's chipping-potato demand</strong>, forcing the country's \"big three\" snack manufacturers &mdash; <strong>Nongshim, Orion, and Haetae-Calbee</strong> (a Calbee Japan joint venture) &mdash; to import the rest, mainly from Australia and the United States. On the frozen side, <strong>fry imports reached 183,000 tonnes in 2023, up roughly 50% since 2014</strong>, with a genuinely dramatic new entrant: <strong>Chinese frozen potato imports grew over 6,000% in two years</strong>, from $408,000 (2021) to $25 million (2023). A <strong>2026 KORUS FTA milestone</strong> will eliminate the last seasonal tariff on US chipping potatoes, adding further competitive pressure on Korea's already-shrinking domestic contract-farming base.",
    keyStats: [
      { value: "570K+ t", label: "2024 production (5-yr high)" },
      { value: "<20%", label: "Domestic chipping-potato supply share" },
      { value: "183K t", label: "2023 frozen fry imports" },
      { value: "+50%", label: "10-yr import growth", accent: "#C62828" },
    ],
    tocItems: [
      { id: "industry-size", l: "How big is South Korea's potato industry?" },
      { id: "consumption", l: "How are South Koreans' potato-eating habits changing?" },
      { id: "big-three", l: "Who are South Korea's big three chip manufacturers?" },
      { id: "frozen-imports", l: "Why are South Korea's frozen fry imports surging?" },
      { id: "trade-policy", l: "How will the 2026 KORUS tariff change reshape the market?" },
      { id: "challenges", l: "What challenges does South Korea's domestic production face?" },
    ],
    cards: [
      { id: "industry-size", dataCard: "overview",
        h2: "How big is South Korea's potato industry?",
        lead: "South Korea produced roughly <strong>563,000 tonnes in 2021</strong>, an estimated <strong>570,000+ tonnes in 2024</strong> (a five-year high), with 2025 forecast to return to an average of ~530,000 tonnes. Crucially, <strong>2024 production was roughly the same as 2014</strong> &mdash; no net growth in a decade.",
        quickFacts: [
          { label: "2021 production", value: "563,000 tonnes" },
          { label: "2024 production (est.)", value: "570,000+ tonnes" },
          { label: "2025 forecast", value: "~530,000 tonnes" },
          { label: "2021 planted area", value: "21,745 ha (−7.9% YoY)" },
        ],
        body: [
          "The long-term trend is declining field acreage, partially offset by a growing greenhouse segment (2,122 hectares in 2022, increasing yearly) that delivers higher, more weather-resilient quality than open-field cultivation. Gangwon Province is the major highland summer-production area, with highland area actually up 2.3% in 2024 even as total planted area trends down.",
        ],
        source: "Source: USDA FAS Seoul; MAFF Korea.",
      },
      { id: "consumption", dataCard: "consumption",
        h2: "How are South Koreans' potato-eating habits changing?",
        lead: "Overall consumption is expected to rise <strong>2.5% annually</strong>, but the mix is shifting sharply: <strong>away from fresh domestic potatoes (32% share, declining)</strong> and toward <strong>imported potatoes and processed products</strong>.",
        body: [
          "Per-capita consumption sits at a relatively stable ~10.7 kg/year, but the composition tells the real story. Potato chips have a distinct cultural driver in Korea: they're a popular accompaniment to \"home drinking culture,\" especially among people in their 20s and 30s — and economic downturns that push more drinking at home tend to boost chip consumption further. Convenience stores (GS25, CU, 7-Eleven) are the major retail channel for this snacking behavior.",
        ],
        source: "Source: USDA FAS Seoul.",
      },
      { id: "big-three", dataCard: "companies",
        h2: "Who are South Korea's big three chip manufacturers?",
        lead: "<strong>Nongshim</strong>, South Korea's largest processed-food manufacturer, <strong>Orion</strong>, and <strong>Haetae-Calbee</strong> (a joint venture with Japan's Calbee) dominate the domestic chip market — and together they source <strong>less than 20% of their chipping-potato needs domestically</strong>.",
        table: {
          headers: ["Company", "Role", "Notes"],
          rows: [
            ["Nongshim (농심)", "South Korea's largest processed-food manufacturer", "Instant noodles + snacks; contracts Korean farmers, also imports from US/Australia"],
            ["Orion (오리온)", "Major snack/confectionery manufacturer", "Contract farming with Korean farmers"],
            ["Haetae-Calbee (해태제과-칼비)", "JV with Japan's Calbee", "Premium chip products"],
          ],
        },
        body: [
          "The domestic chip industry uses about 30,000 tonnes of locally grown fresh potatoes annually, but only during the May–November growing season — importing chipping potatoes (mainly from Australia and the US, preferred for storability and consistent quality) for the December–April off-season. In 2025, Korean food companies purchased 21,000 tonnes of imported processing potatoes — equivalent to the production base of roughly 1,260 average Korean farms.",
        ],
        source: "Source: USDA FAS Seoul; industry data.",
      },
      { id: "frozen-imports", dataCard: "imports",
        h2: "Why are South Korea's frozen fry imports surging?",
        lead: "Frozen fries make up <strong>85% of all potato/potato product imports</strong>. Volumes reached <strong>183,000 tonnes in 2023</strong>, roughly a <strong>50% increase from 122,000 tonnes in 2014</strong> — with a striking new supplier emerging fast.",
        table: {
          headers: ["Supplier", "Trend", "Notes"],
          rows: [
            ["United States", "Leading, but declining share", "Strong foodservice preference; duty-free under KORUS FTA"],
            ["Belgium", "Growing", "European supplier"],
            ["Netherlands", "Growing", "European supplier"],
            ["China", "Rapidly emerging", "$408K (2021) → $25M (2023): +6,000% in two years"],
            ["India", "Emerging", "151 tonnes in Oct 2025 alone, +55.7% YoY"],
            ["Canada", "Consistent supplier", "&mdash;"],
          ],
        },
        body: [
          "2022 was a record year at 141,474 tonnes of frozen fry imports (total potato imports up 17% YoY to 227,000 tonnes), before 2023 pulled back 6.1% on higher prices and a modest domestic recovery. Dehydrated potato imports are a smaller but fast-growing segment too, up 68.1% from 2019 to 2023 (4,235 to 7,117 tonnes), feeding growing potato-snack and potato-soup demand.",
        ],
        source: "Source: USDA FAS Seoul; Korea Customs.",
      },
      { id: "trade-policy", dataCard: "trade-policy",
        h2: "How will the 2026 KORUS tariff change reshape the market?",
        lead: "2026 marks <strong>KORUS FTA's 15th year</strong>, and the seasonal tariff on <strong>US chipping potatoes drops to zero</strong> that year — with <strong>11 additional US states</strong> newly approved to export chipping potatoes to Korea.",
        callout: { number: "2026–2029", context: "the sequence of tariff eliminations reshaping Korea's chipping-potato imports: US seasonal tariffs hit zero in 2026, Australian processing-potato tariffs are eliminated in 2028, and New Zealand's follow in 2029 — creating a genuinely multi-supplier competitive environment.", source: "USDA FAS Seoul; KORUS FTA text" },
        body: [
          "This creates real supply redundancy and price leverage for Korean snack manufacturers, but the flip side is direct downward pressure on domestic contract-farming prices — Korean growers will be competing against an increasingly open, multi-country import market for the chipping-potato contracts that currently cover under 20% of demand.",
        ],
        source: "Source: USDA FAS Seoul; KORUS FTA text.",
      },
      { id: "challenges", dataCard: "challenges",
        h2: "What challenges does South Korea's domestic production face?",
        lead: "Five recurring pressures: <strong>labor shortages</strong> (limited seasonal foreign worker availability, worsened by the pandemic), <strong>summer heat waves</strong> reducing highland yields, a <strong>shrinking agricultural workforce</strong> from Korea's low birth rate, an <strong>aging farmer population</strong>, and farmers <strong>switching to less labor-intensive crops</strong> like wheat.",
        body: [
          "These pressures compound the trade-policy squeeze directly: as domestic contract-farming economics get harder (labor costs rising, workforce shrinking) at the same time as tariff-free imports get cheaper and more accessible, the structural incentive for Korean farmers to keep growing potatoes specifically — rather than switching to less labor-intensive alternatives — keeps weakening.",
        ],
        source: "Source: USDA FAS Seoul; MAFF Korea.",
      },
    ],
    sourceList: [
      "USDA FAS Seoul (official US government agricultural attaché reports)",
      "Korea Agro-Fisheries & Food Trade Corporation (aT)",
      "KREI (Korea Rural Economic Institute)",
      "Kangwon National University",
      "Tridge (citing Korea Customs data)",
      "KORUS FTA text",
    ],
    faqItems: [
      { q: "How much potato does South Korea produce per year?", a: "South Korea produced an estimated 570,000+ tonnes in 2024, a five-year high — though roughly the same absolute level as 2014, meaning no net production growth in a decade." },
      { q: "Does South Korea grow enough potatoes for its own chip industry?", a: "No — domestic production supplies less than 20% of South Korea's chipping-potato demand, forcing Nongshim, Orion, and Haetae-Calbee to import the majority from Australia and the United States, mainly during the December–April off-season." },
      { q: "Why are South Korea's frozen fry imports growing so fast?", a: "Frozen fry imports reached 183,000 tonnes in 2023, up about 50% from 2014, driven by processed-food consumption growth and Korea's 'home drinking culture' snacking pattern — with China emerging as a dramatic new supplier, growing frozen potato imports over 6,000% in two years." },
      { q: "What is KORUS FTA and how does it affect Korea's potato imports?", a: "KORUS is the US-Korea Free Trade Agreement. In 2026, its 15th year, the seasonal tariff on US chipping potatoes drops to zero, with further tariff eliminations for Australia (2028) and New Zealand (2029) — creating a more competitive, multi-supplier import environment that pressures domestic Korean contract-farming prices." },
      { q: "Who are South Korea's major potato chip manufacturers?", a: "Nongshim (South Korea's largest processed-food company), Orion, and Haetae-Calbee (a joint venture with Japan's Calbee) are the three dominant domestic chip manufacturers." },
    ],
    regionalContext: [
      { slug: "japan", note: "Neighboring snack-market peer (Calbee JV partner)" },
      { slug: "china", note: "Rapidly emerging frozen-fry supplier" },
      { slug: "australia", note: "Major chipping-potato import source" },
      { slug: "united-states", note: "Leading frozen-fry supplier, KORUS FTA partner" },
    ],
    continueReading: [
      { href: "/knowledge/global-potato-trade", tag: "Trade", title: "Global Potato Trade", desc: "How KORUS FTA tariff schedules are reshaping South Korea's import market." },
      { href: "/knowledge/how-potatoes-are-processed", tag: "Processing", title: "How Potatoes Are Processed", desc: "Nongshim, Orion, and Haetae-Calbee's chip-processing operations." },
      { href: "/country/japan", tag: "Country", title: "Japan Country Profile", desc: "A neighboring Asian snack market with a similar frozen-fry import dependency." },
      { href: "/country/australia", tag: "Country", title: "Australia Country Profile", desc: "A key chipping-potato supplier to South Korea's snack industry." },
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
  if (slug === "pakistan") {
    return <PakistanProfilePage c={c} />;
  }
  if (slug === "bangladesh") {
    return <BangladeshProfilePage c={c} />;
  }
  if (slug === "nepal") {
    return <NepalProfilePage c={c} />;
  }
  if (slug === "indonesia") {
    return <IndonesiaProfilePage c={c} />;
  }
  if (slug === "australia") {
    return <AustraliaProfilePage c={c} />;
  }
  if (slug === "south-africa") {
    return <SouthAfricaProfilePage c={c} />;
  }
  if (slug === "egypt") {
    return <EgyptProfilePage c={c} />;
  }
  if (slug === "peru") {
    return <PeruProfilePage c={c} />;
  }
  if (slug === "canada") {
    return <CanadaProfilePage c={c} />;
  }
  if (slug === "united-kingdom") {
    return <UnitedKingdomProfilePage c={c} />;
  }
  if (slug === "france") {
    return <FranceProfilePage c={c} />;
  }
  if (slug === "germany") {
    return <GermanyProfilePage c={c} />;
  }
  if (slug === "ukraine") {
    return <UkraineProfilePage c={c} />;
  }
  if (slug === "russia") {
    return <RussiaProfilePage c={c} />;
  }
  if (slug === "poland") {
    return <PolandProfilePage c={c} />;
  }
  if (slug === "mexico") {
    return <MexicoProfilePage c={c} />;
  }
  if (slug === "brazil") {
    return <BrazilProfilePage c={c} />;
  }
  if (slug === "denmark") {
    return <DenmarkProfilePage c={c} />;
  }
  if (slug === "japan") {
    return <JapanProfilePage c={c} />;
  }
  if (slug === "south-korea") {
    return <SouthKoreaProfilePage c={c} />;
  }

  return <StandardCountryPage c={c} slug={slug} />;
}
