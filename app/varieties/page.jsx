import Link from "next/link";
import VarietyAtlas from "../../components/VarietyAtlas";
import { getAtlasData } from "../../lib/varieties-atlas";
import { listCompanies, SITE } from "../../lib/directory";

// Atlas (A) with the Finder (B) as a tool on the same page (#finder). Approved design, 7 Nov 2026.
// Performance: only slim card data reaches the client; the first 24 cards are server-rendered.
export const revalidate = 3600;

export const metadata = {
  title: "Potato Varieties Database — 244 Cultivars Across 9 Regions",
  description: "Searchable database of 244 commercially significant potato varieties. Russet Burbank, Bintje, Spunta, Maris Piper, Désirée, Kufri Pukhraj, Shangi, Yukon Gold, Belete, Tigoni, Yungay, Diacol Capiro, BRS Ana, Nevskij, Zhongshu — origin, traits, and best uses for each.",
  alternates: { canonical: "https://www.potatopedia.com/varieties" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/varieties",
    title: "Potato Varieties Database — 244 Cultivars",
    description: "Origin, traits, and best uses for the world's commercially significant potato varieties — from Andean landraces to North America's Russet Burbank, Bangladeshi BARI, Kenyan Shangi, Brazilian BRS Ana, and Chinese Zhongshu.",
    images: ["/og-image.png"],
  },
};

async function seedCompanies() {
  // The directory lives in Neon. If it cannot be reached, the atlas still renders (the sidebar says so).
  try {
    const rows = await listCompanies();
    return rows.filter((c) => c.kind === "seed").map((c) => ({ slug: c.slug, name: c.name, country: c.country, segments: c.segments }));
  } catch (e) {
    console.error("varieties_seed_companies_failed", e?.message);
    return [];
  }
}

export default async function VarietiesPage() {
  const seed = await seedCompanies();
  const data = getAtlasData(seed);
  const first = data.cards.slice(0, 24);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/varieties#page`,
        url: `${SITE}/varieties`,
        name: "Potato varieties atlas",
        isPartOf: { "@id": `${SITE}/#website` },
        publisher: { "@id": `${SITE}/#publisher` },
        mainEntity: {
          "@type": "ItemList",
          name: "Potatopedia varieties atlas",
          numberOfItems: data.stats.total,
          itemListElement: first.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/varieties/${c.s}`, name: c.n })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Varieties", item: `${SITE}/varieties` },
        ],
      },
    ],
  };

  return (
    <div style={{ color: "var(--ink)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <VarietyAtlas
        cards={data.cards}
        finder={data.finder}
        useCounts={data.useCounts}
        facets={data.facets}
        regionList={data.regionList}
        stats={data.stats}
        seedCompanies={seed.map(({ slug, name, country }) => ({ slug, name, country }))}
      />

      <section style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 20px 64px" }}>
          <p className="eyebrow" style={{ textAlign: "center" }}>Go deeper</p>
          <h2 style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, fontSize: 32, color: "var(--ink)", textAlign: "center", margin: "0 0 24px" }}>Variety guides</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
            {[
              ["/knowledge/russet-burbank-history", "North America", "Russet Burbank", "The 1872 variety behind North America's frozen-fry industry."],
              ["/knowledge/kufri-potato-varieties-india", "South Asia", "Kufri varieties (India)", "Kufri cultivars from ICAR-CPRI Shimla: Pukhraj, Jyoti, Chipsona, Frysona."],
              ["/knowledge/potato-varieties-guide", "Reference", "Complete varieties guide", "Floury vs waxy, breeding programmes, and how to pick a variety for the job."],
              ["/varieties/compare", "Tool", "Compare side by side", "Put two to four varieties in one table: origin, uses and datasheet traits."],
            ].map(([href, k, t, s]) => (
              <Link key={href} href={href} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 20px", textDecoration: "none", color: "inherit", display: "block" }}>
                <span style={{ display: "block", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>{k}</span>
                <span style={{ display: "block", fontFamily: "var(--hp-serif), Georgia, serif", fontSize: 22, color: "var(--ink)", marginBottom: 4 }}>{t}</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--mute)", lineHeight: 1.5 }}>{s}</span>
              </Link>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--mute3)", marginTop: 28, textAlign: "center" }}>Datasheet sources: HZPC, Agrico, Germicopa, C. Meijer, STET Holland, Sarpo, ICAR-CPRI, CIP, USDA-ARS and US land-grant extension programmes. Each variety page lists its sources.</p>
        </div>
      </section>
    </div>
  );
}
