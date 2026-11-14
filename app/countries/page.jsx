import { ppCSS } from "../../lib/styles";
import { COUNTRIES } from "../../lib/data";
import CountriesFilter from "../../components/CountriesFilter";
import ContentRequestCTA from "../../components/ContentRequestCTA";

export const metadata = {
  title: "Potato Countries \u2014 Production Data for 37 Nations",
  description: "Explore potato production data, yields, and industry highlights for 37 major potato-producing countries. Data from FAOSTAT 2024. Includes premium country dossiers with downloadable PDFs.",
  alternates: { canonical: "https://www.potatopedia.com/countries" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/countries",
    title: "Potato Countries \u2014 37 Production Profiles",
    description: "Production data, yields, and industry intelligence for 37 major potato-producing nations, including 5 premium PDF dossiers.",
    images: ["/og-image.png"],
  },
};

export default function CountriesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.potatopedia.com/countries#collection",
    name: "Potatopedia Country Profiles",
    description: "37 country profiles for major potato-producing nations including 5 premium intelligence dossiers with PDF exports.",
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
    <div>
      <style>{ppCSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* Hero (premium system, 7 Nov 2026) */}
      <section className="ix-hero">
        <p className="eyebrow rise">Country profiles</p>
        <div className="ix-row">
          <h1 className="ix-h1 rise">Potato production <em>around the world.</em></h1>
          <div className="ix-dek"><p style={{ margin: 0 }}>Production data, yields, and industry highlights for {COUNTRIES.length} major potato nations. All data from FAOSTAT 2024.</p></div>
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
