import { ppCSS } from "../../lib/styles";
import { COUNTRIES } from "../../lib/data";
import CountriesFilter from "../../components/CountriesFilter";
import ContentRequestCTA from "../../components/ContentRequestCTA";

export const metadata = {
  title: "Potato Countries \u2014 Production Data for 31 Nations",
  description: "Explore potato production data, yields, and industry highlights for 31 major potato-producing countries. Data from FAOSTAT 2024. Includes 5 premium intelligence dossiers (India, China, Belgium, Netherlands, USA) with downloadable PDFs.",
  alternates: { canonical: "https://www.potatopedia.com/countries" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/countries",
    title: "Potato Countries \u2014 31 Production Profiles",
    description: "Production data, yields, and industry intelligence for 31 major potato-producing nations, including 5 premium PDF dossiers.",
    images: ["/og-image.png"],
  },
};

export default function CountriesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.potatopedia.com/countries#collection",
    name: "Potatopedia Country Profiles",
    description: "31 country profiles for major potato-producing nations including 5 premium intelligence dossiers with PDF exports.",
    url: "https://www.potatopedia.com/countries",
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "Potatopedia", url: "https://www.potatopedia.com", logo: "https://www.potatopedia.com/logo.png" },
    hasPart: COUNTRIES.map((c) => ({
      "@type": "Article",
      headline: `${c.name} Potato Production Profile`,
      description: c.highlight,
      url: `https://www.potatopedia.com/country/${c.slug}`,
    })),
  };
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <style>{ppCSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* Hero */}
      <section style={{ paddingTop: 52, paddingBottom: 40, textAlign: "center", background: "linear-gradient(180deg,rgba(198,40,40,0.03) 0%,#fff 100%)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 16 }}>Country Profiles</span>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.15 }}>
            Potato Production<br />
            <span style={{ background: "linear-gradient(135deg,#C62828,#E53935)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Around the World</span>
          </h1>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6 }}>Production data, yields, and industry highlights for 30 major potato nations. All data from FAOSTAT 2023.</p>
        </div>
      </section>

      {/* Filter + Grid (client island) */}
      <CountriesFilter />

      {/* Content Request CTA */}
      <section style={{ padding: "60px 24px 80px", background: "transparent" }}>
        <ContentRequestCTA pageContext="Countries index" />
      </section>
    </div>
  );
}
