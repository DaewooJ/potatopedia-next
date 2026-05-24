import Link from "next/link";
import { ppCSS } from "../../../lib/styles";
import {
  VARIETIES,
  USE_COLORS,
  TIER_COLORS,
  getVarietyBySlug,
  getCountrySlugFromOrigin,
} from "../../../lib/varieties-data";
import { COUNTRIES } from "../../../lib/data";
import CompareControls, { RemoveButton } from "../../../components/CompareControls";

const MAX_SLOTS = 4;

const FEATURED_COMPARISONS = [
  {
    label: "World's 3 most iconic fry varieties",
    ids: ["russet-burbank", "bintje", "maris-piper"],
    blurb: "Idaho's McDonald's variety vs Belgium's fry king vs the UK chip-shop standard.",
  },
  {
    label: "Yellow-flesh waxy salad classics",
    ids: ["yukon-gold", "charlotte", "nicola"],
    blurb: "North America's recognisable yellow-flesh vs France's premium waxy vs Germany's salad standard.",
  },
  {
    label: "South Asian + African staples",
    ids: ["kufri-pukhraj", "diamant", "shangi"],
    blurb: "India's dominant table variety vs Bangladesh's Dutch-bred standard vs Kenya's CIP-derived ruler.",
  },
  {
    label: "Heritage classics over a century old",
    ids: ["belle-de-fontenay", "bintje", "king-edward"],
    blurb: "France's 1885 Île-de-France · Belgium's 1910 fry king · UK's 1902 baking standard.",
  },
  {
    label: "CIP-bred climate-tolerant releases",
    ids: ["unica", "kufri-tejas", "belete"],
    blurb: "Peru's tropical-lowland UNICA · India's heat-tolerant Kufri Tejas · Ethiopia's CIP-derived Belete.",
  },
];

export async function generateMetadata({ searchParams }) {
  const sp = (await searchParams) || {};
  const ids = (sp.ids || "").split(",").filter(Boolean).slice(0, MAX_SLOTS);
  const vs = ids.map((id) => getVarietyBySlug(id)).filter(Boolean);
  if (vs.length >= 2) {
    const names = vs.map((v) => v.name).join(" vs ");
    return {
      title: `${names} — Potato Variety Comparison`,
      description: `Side-by-side comparison: ${names}. Origin, year released, region, best uses, and traits — sourced from CIP, USDA, ICAR-CPRI, AHDB, and primary breeder catalogues.`,
      alternates: { canonical: `https://www.potatopedia.com/varieties/compare?ids=${ids.join(",")}` },
      openGraph: {
        type: "website",
        url: `https://www.potatopedia.com/varieties/compare?ids=${ids.join(",")}`,
        title: `${names} — Variety Comparison`,
        description: `Side-by-side: ${names}.`,
        images: ["/og-image.png"],
      },
    };
  }
  return {
    title: "Compare Potato Varieties — Side-by-Side Tool",
    description: "Compare 2–4 potato varieties side by side: origin, year released, region, best uses, and traits. From 237 commercially significant cultivars across 9 regions.",
    alternates: { canonical: "https://www.potatopedia.com/varieties/compare" },
    openGraph: {
      type: "website",
      url: "https://www.potatopedia.com/varieties/compare",
      title: "Compare Potato Varieties — Side-by-Side Tool",
      description: "Compare 2–4 potato varieties side by side. 237 cultivars across 9 regions.",
      images: ["/og-image.png"],
    },
  };
}

export default async function VarietyComparePage({ searchParams }) {
  const sp = (await searchParams) || {};
  const rawIds = (sp.ids || "").split(",").filter(Boolean);
  const ids = rawIds.slice(0, MAX_SLOTS);
  const varieties = ids.map((id) => getVarietyBySlug(id)).filter(Boolean);
  const validIds = varieties.map((v) => v.slug);

  const hasComparison = varieties.length >= 2;

  // Compute shared attributes for the highlight banner
  const sharedHighlights = (() => {
    if (varieties.length < 2) return [];
    const out = [];
    const tiers = varieties.map((v) => v.tier).filter(Boolean);
    if (tiers.length === varieties.length && new Set(tiers).size === 1) {
      out.push(`All ${varieties.length} are ${tiers[0]} varieties`);
    }
    const regions = new Set(varieties.map((v) => v.region));
    if (regions.size === 1) out.push(`All ${varieties.length} from ${[...regions][0]}`);
    // Shared use
    const allUses = varieties.map((v) => new Set(v.uses || []));
    const intersection = [...allUses[0]].filter((u) => allUses.every((s) => s.has(u)));
    if (intersection.length > 0) out.push(`All ${varieties.length} used for ${intersection.slice(0, 2).map((u) => u.toLowerCase()).join(" and ")}`);
    return out;
  })();

  // JSON-LD: ItemList of compared varieties
  const jsonLd = hasComparison ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Comparison: ${varieties.map((v) => v.name).join(" vs ")}`,
    description: "Side-by-side potato variety comparison.",
    numberOfItems: varieties.length,
    itemListElement: varieties.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Thing",
        name: v.name,
        description: v.trait,
        url: `https://www.potatopedia.com/varieties/${v.slug}`,
      },
    })),
  } : null;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A", overflowX: "hidden" }}>
      <style>{ppCSS}{`
        .pp-compare-table { display: block; border: 1px solid #ececec; border-radius: 14px; overflow: hidden; background: #fff; }
        .pp-compare-row { display: grid; border-bottom: 1px solid #f0f0f0; }
        .pp-compare-row:last-child { border-bottom: none; }
        .pp-compare-row > div { padding: 14px 16px; border-right: 1px solid #f5f5f5; min-width: 0; }
        .pp-compare-row > div:last-child { border-right: none; }
        .pp-compare-row.head > div { background: #FAFAFA; }
        .pp-compare-label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1.5px; background: #FAFAFA; }
        @media (max-width: 768px) {
          .pp-compare-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .pp-compare-table { min-width: 600px; }
        }
      `}</style>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Breadcrumb */}
        <Link href="/varieties" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#888", textDecoration: "none", marginBottom: 18 }}>
          <span>←</span> All varieties
        </Link>

        {/* Hero */}
        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, background: "rgba(198,40,40,0.06)", padding: "5px 14px", borderRadius: 14, marginBottom: 14 }}>Compare tool</span>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.2, lineHeight: 1.15, marginBottom: 12 }}>
            {hasComparison
              ? <>Compare <span style={{ background: "linear-gradient(135deg,#C62828,#8E0000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{varieties.map((v) => v.name).join(" vs ")}</span></>
              : <>Compare <span style={{ background: "linear-gradient(135deg,#C62828,#8E0000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>potato varieties</span> side by side</>}
          </h1>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6, maxWidth: 620, margin: "0 auto" }}>
            {hasComparison
              ? "Side-by-side: origin, year, region, uses, and trait descriptions — sourced from CIP, USDA, ICAR-CPRI, AHDB, and primary breeder catalogues."
              : "Add 2–4 varieties from our 237-cultivar database to compare origin, year, region, uses, and traits side by side. Shareable URL preserves your selection."}
          </p>
        </header>

        {/* Picker */}
        <section style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 14, padding: "20px 22px", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, textAlign: "center" }}>
            Selected ({varieties.length}/{MAX_SLOTS})
          </div>
          {varieties.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {varieties.map((v) => (
                <div key={v.slug} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #ececec", borderRadius: 16, padding: "5px 12px" }}>
                  <Link href={`/varieties/${v.slug}`} style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", textDecoration: "none" }}>{v.name}</Link>
                  <RemoveButton slug={v.slug} currentIds={validIds} />
                </div>
              ))}
            </div>
          )}
          <CompareControls varieties={VARIETIES} selectedSlugs={validIds} maxSlots={MAX_SLOTS} />
        </section>

        {/* Comparison table */}
        {hasComparison && (
          <>
            {sharedHighlights.length > 0 && (
              <div style={{ marginBottom: 18, padding: "12px 16px", background: "rgba(198,40,40,0.04)", border: "1px solid rgba(198,40,40,0.12)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Shared attributes</div>
                <div style={{ fontSize: 13, color: "#555" }}>{sharedHighlights.join(" · ")}</div>
              </div>
            )}

            <div className="pp-compare-scroll">
              <div className="pp-compare-table">
                {/* Header row — variety names */}
                <div className="pp-compare-row head" style={{ gridTemplateColumns: `180px repeat(${varieties.length}, minmax(180px, 1fr))` }}>
                  <div className="pp-compare-label">Variety</div>
                  {varieties.map((v) => (
                    <div key={v.slug}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", marginBottom: 4 }}>{v.name}</div>
                      <Link href={`/varieties/${v.slug}`} style={{ fontSize: 11, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>Detail page →</Link>
                    </div>
                  ))}
                </div>

                {/* Tier */}
                <div className="pp-compare-row" style={{ gridTemplateColumns: `180px repeat(${varieties.length}, minmax(180px, 1fr))` }}>
                  <div className="pp-compare-label">Classification</div>
                  {varieties.map((v) => {
                    const tc = v.tier ? TIER_COLORS[v.tier] : null;
                    return (
                      <div key={v.slug}>
                        {tc ? (
                          <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, background: tc.bg, color: tc.fg, padding: "3px 9px", borderRadius: 10, textTransform: "uppercase", letterSpacing: 1 }}>{v.tier}</span>
                        ) : (
                          <span style={{ fontSize: 13, color: "#aaa" }}>—</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Origin */}
                <div className="pp-compare-row" style={{ gridTemplateColumns: `180px repeat(${varieties.length}, minmax(180px, 1fr))` }}>
                  <div className="pp-compare-label">Origin</div>
                  {varieties.map((v) => (<div key={v.slug} style={{ fontSize: 13, color: "#444" }}>{v.origin}</div>))}
                </div>

                {/* Year */}
                <div className="pp-compare-row" style={{ gridTemplateColumns: `180px repeat(${varieties.length}, minmax(180px, 1fr))` }}>
                  <div className="pp-compare-label">Year released</div>
                  {varieties.map((v) => {
                    const ym = v.year ? String(v.year).match(/\d{4}/) : null;
                    return (<div key={v.slug} style={{ fontSize: 13, color: "#444" }}>{ym ? ym[0] : <span style={{ color: "#aaa" }}>Not documented</span>}</div>);
                  })}
                </div>

                {/* Region */}
                <div className="pp-compare-row" style={{ gridTemplateColumns: `180px repeat(${varieties.length}, minmax(180px, 1fr))` }}>
                  <div className="pp-compare-label">Region</div>
                  {varieties.map((v) => (<div key={v.slug} style={{ fontSize: 13, color: "#444" }}>{v.region}</div>))}
                </div>

                {/* Country */}
                <div className="pp-compare-row" style={{ gridTemplateColumns: `180px repeat(${varieties.length}, minmax(180px, 1fr))` }}>
                  <div className="pp-compare-label">Origin country</div>
                  {varieties.map((v) => {
                    const cs = getCountrySlugFromOrigin(v.origin);
                    const c = cs ? COUNTRIES.find((x) => x.slug === cs) : null;
                    return (
                      <div key={v.slug}>
                        {c ? (
                          <Link href={`/country/${c.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#1A1A1A", textDecoration: "none" }}>
                            <span style={{ fontSize: 18 }}>{c.flag}</span>
                            <span style={{ color: "#C62828", fontWeight: 600 }}>{c.name}</span>
                          </Link>
                        ) : (
                          <span style={{ fontSize: 13, color: "#aaa" }}>—</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Best uses */}
                <div className="pp-compare-row" style={{ gridTemplateColumns: `180px repeat(${varieties.length}, minmax(180px, 1fr))` }}>
                  <div className="pp-compare-label">Best uses</div>
                  {varieties.map((v) => (
                    <div key={v.slug}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(v.uses || []).map((u) => {
                          const c = USE_COLORS[u] || { bg: "rgba(120,120,120,0.08)", fg: "#666" };
                          return <span key={u} style={{ fontSize: 10, fontWeight: 600, color: c.fg, background: c.bg, padding: "3px 8px", borderRadius: 10 }}>{u}</span>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="pp-compare-row" style={{ gridTemplateColumns: `180px repeat(${varieties.length}, minmax(180px, 1fr))` }}>
                  <div className="pp-compare-label">Description</div>
                  {varieties.map((v) => (<div key={v.slug} style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{v.trait}</div>))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: "16px 20px", background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, fontSize: 12, color: "#888", lineHeight: 1.6 }}>
              <strong style={{ color: "#666" }}>Methodology:</strong> Variety attributes aggregated from CIP Lima genebank, ICAR-CPRI catalogue, EU Common Catalogue, USDA PVPO, AHDB, NIAB, NAK Netherlands, Potato Pedigree Database, and primary breeder releases (CAAS, EARO, BARI, INTA, EMBRAPA, IHAR-PIB, VNIIKKH). Year fields populated only where the release date is well-documented across sources.
            </div>
          </>
        )}

        {/* Empty / single state — featured comparisons */}
        {!hasComparison && (
          <section style={{ marginTop: 8 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Start with a featured comparison</span>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.6 }}>Or pick from these curated comparisons</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {FEATURED_COMPARISONS.map((fc, i) => (
                <Link key={i} href={`/varieties/compare?ids=${fc.ids.join(",")}`} style={{ display: "block", padding: "18px 20px", background: "#fff", border: "1px solid #ececec", borderRadius: 12, textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>{fc.ids.length} varieties</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>{fc.label}</div>
                  <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.55, marginBottom: 10 }}>{fc.blurb}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {fc.ids.map((id) => {
                      const v = getVarietyBySlug(id);
                      return v ? <span key={id} style={{ fontSize: 11, fontWeight: 600, color: "#444", background: "#FAFAFA", padding: "3px 8px", borderRadius: 10 }}>{v.name}</span> : null;
                    })}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, padding: "24px 0", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
          <Link href="/varieties" style={{ fontSize: 13, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>← Browse all 237 varieties</Link>
          <span style={{ fontSize: 12, color: "#bbb", margin: "0 12px" }}>|</span>
          <Link href="/about" style={{ fontSize: 13, color: "#888", fontWeight: 500, textDecoration: "none" }}>About our methodology →</Link>
        </div>
      </div>
    </div>
  );
}
