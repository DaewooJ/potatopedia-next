import Link from "next/link";
import { ppCSS } from "../../lib/styles";
import VarietiesFilter from "../../components/VarietiesFilter";
import VarietyGrid from "../../components/VarietyGrid";
import VarietyQuickAnswers from "../../components/VarietyQuickAnswers";
import VarietyIconicShowcase from "../../components/VarietyIconicShowcase";
import { VARIETIES, getIconicVarieties, getQuickAnswers } from "../../lib/varieties-data";

export const metadata = {
  title: "Potato Varieties Database — 244 Cultivars Across 9 Regions",
  description: "Searchable database of 244 commercially significant potato varieties. Russet Burbank, Bintje, Spunta, Maris Piper, Désirée, Kufri Pukhraj, Shangi, Yukon Gold, Belete, Tigoni, Yungay, Diacol Capiro, BRS Ana, Nevskij, Zhongshu — origin, traits, and best uses for each.",
  alternates: { canonical: "https://www.potatopedia.com/varieties" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/varieties",
    title: "Potato Varieties Database — 244 Cultivars",
    description: "Origin, traits, and best uses for the world's commercially significant potato varieties — from Andean landraces to McDonald's Russet Burbank, Bangladeshi BARI, Kenyan Shangi, Brazilian BRS Ana, and Chinese Zhongshu.",
    images: ["/og-image.png"],
  },
};

export default function VarietiesPage() {
  const total = VARIETIES.length;
  const regionCounts = VARIETIES.reduce((acc, v) => { acc[v.region] = (acc[v.region] || 0) + 1; return acc; }, {});
  const iconicVarieties = getIconicVarieties();
  const quickAnswers = getQuickAnswers();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Potatopedia Varieties Database",
    description: `${total} commercially significant potato varieties from 9 regions worldwide.`,
    numberOfItems: total,
    itemListElement: VARIETIES.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Thing",
        name: v.name,
        description: v.trait,
        additionalProperty: [
          { "@type": "PropertyValue", name: "Origin", value: v.origin },
          { "@type": "PropertyValue", name: "Region", value: v.region },
          ...(v.year ? [{ "@type": "PropertyValue", name: "Released", value: v.year }] : []),
          ...(v.uses ? [{ "@type": "PropertyValue", name: "Uses", value: v.uses.join(", ") }] : []),
        ],
      },
    })),
  };

  // Complements the ItemList above with clean, quotable declarative sentences —
  // AI answer engines and "People also ask"-style features quote sentences far
  // more readily than they infer answers from tag pills on 244 cards.
  const quickAnswersJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: quickAnswers.map(({ use, variety }) => ({
      "@type": "Question",
      name: `What is the best potato variety for ${use.split(" / ")[0].toLowerCase()}?`,
      acceptedAnswer: { "@type": "Answer", text: `${variety.name} is widely regarded as the best variety for ${use.toLowerCase()}. ${variety.trait}` },
    })),
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A", overflowX: "hidden" }}>
      <style>{ppCSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quickAnswersJsonLd) }} />

      {/* Hero */}
      <section style={{ paddingTop: 64, paddingBottom: 32, textAlign: "center" }}>
        <div className="pp-section" style={{ maxWidth: 880, margin: "0 auto", padding: "0 48px" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 18 }}>Varieties database</span>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.15, letterSpacing: -1.4, marginBottom: 14 }}>
            Potato Varieties,<br />
            <span style={{ background: "linear-gradient(135deg,#C62828,#8E0000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>From the Andes to McDonald&apos;s.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.65, maxWidth: 700, margin: "0 auto" }}>
            {total} commercially significant cultivars across 9 regions — origin, traits, and best uses for each, verified against CIP, FAOSTAT, ICAR-CPRI, and breeder release archives.
          </p>
          <p style={{ fontSize: 13, color: "#888", marginTop: 14, maxWidth: 600, margin: "14px auto 0" }}>
            The total estimated number of cultivated varieties worldwide is ~4,000 (CIP, FAO). This database tracks the commercially significant subset most relevant to international trade, breeding, and culinary use.
          </p>
          <div style={{ marginTop: 22 }}>
            <Link href="/varieties/compare" style={{ display: "inline-block", padding: "10px 22px", borderRadius: 10, background: "#fff", color: "#C62828", fontSize: 13, fontWeight: 700, textDecoration: "none", border: "1.5px solid #C62828" }}>
              Compare 2–4 varieties side by side →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick answers */}
      <VarietyQuickAnswers answers={quickAnswers} />

      {/* Iconic showcase */}
      <VarietyIconicShowcase varieties={iconicVarieties} />

      {/* Compare banner */}
      <section style={{ paddingTop: 44, paddingBottom: 8 }}>
        <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px" }}>
          <Link
            href="/varieties/compare"
            className="pp-compare-banner"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", background: "linear-gradient(120deg,#8E0000,#C62828)", borderRadius: 20, padding: "28px 32px", textDecoration: "none" }}
          >
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: "#fff", marginBottom: 5 }}>Compare 2–4 varieties side by side</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 420 }}>Origin, year, region, best uses, and traits — laid out in a table so you can decide in seconds.</p>
            </div>
            <div className="pp-compare-demo" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span className="pp-compare-demo-chip" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, color: "#fff" }}>Russet Burbank</span>
              <span className="pp-compare-demo-chip" style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>vs</span>
              <span className="pp-compare-demo-chip" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, color: "#fff" }}>Maris Piper</span>
              <span style={{ background: "#fff", color: "#C62828", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 10, whiteSpace: "nowrap" }}>Compare →</span>
            </div>
          </Link>
        </div>
      </section>
      <style>{`
        @media (max-width: 640px) {
          .pp-compare-demo-chip { display: none !important; }
        }
      `}</style>

      {/* Full archive */}
      <section id="archive" style={{ paddingTop: 44, paddingBottom: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>The complete archive</span>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.7, marginBottom: 8 }}>{total} commercial varieties</h2>
          <p style={{ fontSize: 13.5, color: "#8A8F98", maxWidth: 560, margin: "0 auto" }}>Every commercially significant variety we track, filterable by region, use, and era.</p>
        </div>
        <VarietiesFilter totalCount={VARIETIES.length} regionCounts={regionCounts} />
        <VarietyGrid varieties={VARIETIES} />
      </section>

      {/* Footer cross-links */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0" }}>
        <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 48px 64px", textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Go deeper</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.6, marginBottom: 24 }}>Featured variety deep-dives</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, textAlign: "left" }}>
            <Link href="/knowledge/russet-burbank-history" style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "18px 20px", textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>North America</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Russet Burbank</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>The 1872 variety behind McDonald&apos;s fries, J.R. Simplot, and the $4.6B US frozen-fry industry.</div>
            </Link>
            <Link href="/knowledge/kufri-potato-varieties-india" style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "18px 20px", textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>South Asia</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Kufri varieties (India)</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>75+ Kufri cultivars from ICAR-CPRI Shimla — Pukhraj, Jyoti, Chipsona, Frysona, Tejas.</div>
            </Link>
            <Link href="/knowledge/potato-varieties-guide" style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "18px 20px", textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>Reference</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Complete varieties guide</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>Floury vs waxy, GI ranges, breeding programmes, and how to pick the right variety for the job.</div>
            </Link>
            <Link href="/blog/andean-potato-origin-story" style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "18px 20px", textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>History</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>The 8,000-year Andean journey</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>Where every potato variety descends from — and why CIP&apos;s Lima genebank holds the world&apos;s genetic insurance policy.</div>
            </Link>
          </div>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 28 }}>Sources: CIP, FAO, ICAR-CPRI, AHDB Potatoes, USDA, NL NAK, breeder release archives</div>
        </div>
      </section>
    </div>
  );
}
