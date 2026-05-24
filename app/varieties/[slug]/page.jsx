import Link from "next/link";
import { notFound } from "next/navigation";
import { ppCSS } from "../../../lib/styles";
import {
  VARIETIES,
  USE_COLORS,
  TIER_COLORS,
  getVarietyBySlug,
  getCountrySlugFromOrigin,
  getRelatedLinks,
  getRelatedVarieties,
} from "../../../lib/varieties-data";
import { COUNTRIES, UPDATED_SHORT } from "../../../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, articleAuthorBlock, VARIETY_WIKIDATA, SPEAKABLE } from "../../../lib/authors";
import { getEnrichmentSections } from "../../../lib/varieties-enrichment";

export function generateStaticParams() {
  return VARIETIES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = getVarietyBySlug(slug);
  if (!v) return { title: "Variety Not Found" };
  // Tight 150-char meta description: variety + region + best use + key trait fragment
  const yearMatch = v.year ? String(v.year).match(/\d{4}/) : null;
  const yearStr = yearMatch ? ` (${yearMatch[0]})` : "";
  const topUse = (v.uses || [])[0] || "";
  // Build a concise sentence; trim to 155 chars for full SERP visibility.
  let desc = `${v.name}${yearStr} — ${v.region} potato variety${topUse ? `, best for ${topUse.toLowerCase()}` : ""}. ${v.trait}`;
  desc = desc.replace(/\s+/g, " ").trim();
  if (desc.length > 155) desc = desc.slice(0, 152).trimEnd() + "…";
  // Layout adds " — Potatopedia" suffix; keep base ≤50 so final SERP title <65.
  const titleBase = `${v.name} Potato Variety — Traits & Uses`;
  return {
    title: titleBase,
    description: desc,
    alternates: { canonical: `https://www.potatopedia.com/varieties/${slug}` },
    openGraph: {
      type: "article",
      url: `https://www.potatopedia.com/varieties/${slug}`,
      title: `${v.name} — Potato Variety Profile`,
      description: desc,
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", title: `${v.name} — Potato Variety`, description: desc },
  };
}

export default async function VarietyDetailPage({ params }) {
  const { slug } = await params;
  const v = getVarietyBySlug(slug);
  if (!v) notFound();

  const countrySlug = getCountrySlugFromOrigin(v.origin);
  const country = countrySlug ? COUNTRIES.find((c) => c.slug === countrySlug) : null;
  const relatedLinks = getRelatedLinks(v);
  const relatedVarieties = getRelatedVarieties(v, 4);
  const tc = v.tier ? TIER_COLORS[v.tier] : null;
  const yearMatch = v.year ? String(v.year).match(/\d{4}/) : null;
  const releaseYear = yearMatch ? yearMatch[0] : null;

  const pageUrl = `https://www.potatopedia.com/varieties/${slug}`;
  const wikidata = VARIETY_WIKIDATA[slug];
  const useStr = (v.uses || []).join(", ");

  // FAQ items synthesized from variety attributes — cited to KALRO/CIP/USDA/ICAR-CPRI etc.
  const faqItems = [
    { q: `What is ${v.name} potato?`, a: `${v.name} is a ${v.region.toLowerCase()} potato variety${releaseYear ? ` released in ${releaseYear}` : ""}${v.origin ? ` originating from ${v.origin.replace(/\s*\(\d{4}\)\s*$/, "")}` : ""}. ${v.trait}` },
    ...(v.uses && v.uses.length > 0 ? [{ q: `What is ${v.name} potato best used for?`, a: `${v.name} is best suited to ${v.uses.join(", ").toLowerCase()}. ${v.trait}` }] : []),
    ...(releaseYear ? [{ q: `When was ${v.name} released?`, a: `${v.name} was released in ${releaseYear}. The variety is classified as ${v.region.toLowerCase()}${v.tier ? ` (${v.tier})` : ""}.` }] : []),
    { q: `Where is ${v.name} grown?`, a: `${v.name} is most commonly grown in ${v.region}${v.origin ? `, with original release from ${v.origin.replace(/\s*\(\d{4}\)\s*$/, "")}` : ""}. Cross-reference our country profiles for production data.` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // Article — required for content-type pages per 2026 Google E-E-A-T guidance.
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `${v.name} Potato Variety — Origin, Traits & Uses`,
        description: `${v.name} potato variety profile: ${v.origin}, ${v.region}.${useStr ? " Best for: " + useStr + "." : ""} ${v.trait}`.slice(0, 200),
        datePublished: "2026-04-01",
        dateModified: "2026-05-08",
        ...articleAuthorBlock(),
        mainEntityOfPage: pageUrl,
        image: "https://www.potatopedia.com/og-image.png",
        about: { "@id": `${pageUrl}#variety` },
        articleSection: "Varieties",
        speakable: SPEAKABLE,
      },
      // Product schema — variety as a commercial entity (the 2026 best practice for
      // SKU-like agricultural cultivars).
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: `${v.name} Potato`,
        description: v.trait,
        category: "Agricultural commodity / Potato variety",
        brand: { "@type": "Organization", name: v.origin?.split("(")[0]?.trim() || "Various breeders" },
        ...(wikidata ? { sameAs: wikidata } : {}),
        additionalProperty: [
          { "@type": "PropertyValue", name: "Origin", value: v.origin },
          { "@type": "PropertyValue", name: "Region", value: v.region },
          ...(releaseYear ? [{ "@type": "PropertyValue", name: "Year released", value: releaseYear }] : []),
          ...(v.uses ? [{ "@type": "PropertyValue", name: "Best uses", value: v.uses.join(", ") }] : []),
          ...(v.tier ? [{ "@type": "PropertyValue", name: "Tier", value: v.tier }] : []),
        ],
      },
      // Thing — kept for back-compat with prior schema consumers.
      {
        "@type": "Thing",
        "@id": `${pageUrl}#variety`,
        name: v.name,
        description: v.trait,
        url: pageUrl,
        ...(wikidata ? { sameAs: wikidata } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/varieties", name: "Varieties" } },
          { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: v.name } },
        ],
      },
      POTATOPEDIA_PUBLISHER,
    ],
  };

  // FAQPage emitted as a separate JSON-LD block (Google preferred pattern).
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A", overflowX: "hidden" }}>
      <style>{ppCSS}{`
        .pp-variety-detail-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 36px; }
        .pp-variety-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .pp-variety-related { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (max-width: 768px) {
          .pp-variety-detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .pp-variety-stats { grid-template-columns: 1fr 1fr !important; }
          .pp-variety-related { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <article style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 48px 80px" }} className="pp-section">
        {/* Breadcrumb / back */}
        <Link href="/varieties" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#888", textDecoration: "none", marginBottom: 20 }}>
          <span>←</span> All varieties
        </Link>

        {/* Hero */}
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 14 }}>
            <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, background: "rgba(198,40,40,0.06)", padding: "5px 12px", borderRadius: 14 }}>{v.region}</span>
            {tc && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 14, background: tc.bg, color: tc.fg, textTransform: "uppercase", letterSpacing: 1 }}>{v.tier}</span>
            )}
            {releaseYear && (
              <span style={{ fontSize: 12, color: "#999" }}>Released {releaseYear}</span>
            )}
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.4, lineHeight: 1.15, marginBottom: 10 }}>{v.name}</h1>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6, maxWidth: 720 }}>{v.trait}</p>
        </header>

        <div className="pp-variety-detail-grid">
          {/* Main column */}
          <div>
            {/* At a glance */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>At a glance</h2>
              <div className="pp-variety-stats">
                <div style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Origin</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{v.origin}</div>
                </div>
                <div style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Region</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{v.region}</div>
                </div>
                {releaseYear && (
                  <div style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Released</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{releaseYear}</div>
                  </div>
                )}
                {v.tier && (
                  <div style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Classification</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{v.tier}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Best uses */}
            {v.uses && v.uses.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Best uses</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {v.uses.map((u) => {
                    const c = USE_COLORS[u] || { bg: "rgba(120,120,120,0.08)", fg: "#666" };
                    return (
                      <span key={u} style={{ fontSize: 12, fontWeight: 600, color: c.fg, background: c.bg, padding: "6px 14px", borderRadius: 16 }}>{u}</span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description / context */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>About this variety</h2>
              <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 14 }}>{v.trait}</p>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                <strong>{v.name}</strong> is classified as a {v.region.toLowerCase()} variety
                {releaseYear ? ` released in ${releaseYear}` : ""}
                {v.uses && v.uses.length ? `, primarily used for ${v.uses.slice(0, 3).map(u => u.toLowerCase()).join(", ")}` : ""}.
                For agronomic specs, breeder details, and trial data not yet captured here, refer to the source registries linked at the bottom of this page.
              </p>
            </div>

            {/* Compare CTA */}
            <div style={{ marginBottom: 24, padding: "16px 20px", background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>Compare {v.name} with another variety</div>
                <div style={{ fontSize: 12, color: "#888" }}>Side-by-side: origin, year, region, uses, traits.</div>
              </div>
              <Link href={`/varieties/compare?ids=${v.slug}`} style={{ display: "inline-block", padding: "9px 18px", borderRadius: 10, background: "#C62828", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                Compare →
              </Link>
            </div>

            {/* Cross-links */}
            {relatedLinks.length > 0 && (
              <div style={{ marginBottom: 28, padding: "20px 24px", background: "rgba(198,40,40,0.03)", border: "1px solid rgba(198,40,40,0.12)", borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Read deeper</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {relatedLinks.map((l, i) => (
                    <Link key={i} href={l.href} style={{ fontSize: 14, color: "#C62828", textDecoration: "none", fontWeight: 500, lineHeight: 1.5 }}>
                      → {l.text}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {country && (
              <div style={{ marginBottom: 24, padding: "20px 22px", background: "#fff", border: "1px solid #ececec", borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Origin country</div>
                <Link href={`/country/${country.slug}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
                  <span style={{ fontSize: 32 }}>{country.flag}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{country.name}</div>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>#{country.rank} producer · {country.prod} t</div>
                  </div>
                </Link>
                <div style={{ fontSize: 12, color: "#888", marginTop: 12, lineHeight: 1.55 }}>{country.highlight}</div>
                <Link href={`/country/${country.slug}`} style={{ display: "inline-block", marginTop: 12, fontSize: 12, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>
                  Explore {country.name} →
                </Link>
              </div>
            )}

            {/* Related varieties */}
            {relatedVarieties.length > 0 && (
              <div style={{ padding: "20px 22px", background: "#fff", border: "1px solid #ececec", borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Related varieties</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {relatedVarieties.map((rv) => (
                    <Link key={rv.slug} href={`/varieties/${rv.slug}`} style={{ display: "block", textDecoration: "none", color: "inherit", padding: "10px 12px", borderRadius: 8, background: "#FAFAFA", border: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>{rv.name}</div>
                      <div style={{ fontSize: 11, color: "#999" }}>{rv.region}{rv.year ? ` · ${rv.year}` : ""}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Enrichment sections (D1) — hand-crafted for top 12 marquee varieties; templated for next 50 */}
        {(() => {
          const sections = getEnrichmentSections(v, relatedVarieties);
          if (!sections) return null;
          return (
            <section style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
              {sections.map((sec) => (
                <div key={sec.id} id={sec.id} style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.3, marginBottom: 12 }}>{sec.heading}</h2>
                  {sec.paragraphs.map((p, i) => (
                    <p key={i} style={{ fontSize: 14.5, color: "#444", lineHeight: 1.75, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                </div>
              ))}
            </section>
          );
        })()}

        {/* FAQ section — server-rendered to match the FAQPage JSON-LD schema */}
        <section style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid #f0f0f0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>Frequently asked questions about {v.name}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqItems.map((it, i) => (
              <details key={i} style={{ padding: "14px 18px", borderRadius: 10, border: "1px solid #f0f0f0", background: "#FAFAFA" }}>
                <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}>{it.q}</span>
                  <span style={{ fontSize: 14, color: "#C62828", flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginTop: 10 }}>{it.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Methodology footer */}
        <div style={{ marginTop: 40, padding: "24px 0 0", borderTop: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Sources & methodology</div>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, marginBottom: 10 }}>
            Variety profiles aggregate data from CIP Lima genebank, ICAR-CPRI variety catalogue, EU Common Catalogue, USDA PVPO, AHDB Potato Variety Database, NIAB, NAK Netherlands, the Potato Pedigree Database, national breeding programmes (CAAS, EARO, BARI, INTA, EMBRAPA, INIFAP, IHAR-PIB, VNIIKKH), and peer-reviewed literature in Potato Research and the American Journal of Potato Research.
          </p>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 12, fontStyle: "italic" }}>
            Updated {UPDATED_SHORT} · Reviewed by Potatopedia editorial team{wikidata ? ` · Linked to Wikidata for cross-reference` : ""}.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/varieties" style={{ fontSize: 13, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>← Browse all 237 varieties</Link>
            <Link href="/about" style={{ fontSize: 13, color: "#888", fontWeight: 500, textDecoration: "none" }}>About our methodology →</Link>
            {wikidata && (
              <a href={wikidata} rel="nofollow noopener" target="_blank" style={{ fontSize: 13, color: "#888", fontWeight: 500, textDecoration: "none" }}>View on Wikidata ↗</a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
