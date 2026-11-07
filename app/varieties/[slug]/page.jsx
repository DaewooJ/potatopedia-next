import Link from "next/link";
import { notFound } from "next/navigation";
import LeadForm from "../../../components/LeadForm";
import { Figures, FeaturedSlot } from "../../../components/Editorial";
import { latestProduction, worldRank, fmtMt, LATEST_YEAR } from "../../../lib/production";
import {
  VARIETIES,

  getVarietyBySlug,
  getCountrySlugFromOrigin,
  getRelatedLinks,
  getRelatedVarieties,
} from "../../../lib/varieties-data";
import { COUNTRIES, UPDATED_SHORT } from "../../../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, articleAuthorBlock, VARIETY_WIKIDATA, SPEAKABLE } from "../../../lib/authors";
import { getEnrichmentSections } from "../../../lib/varieties-enrichment";
import { applyOgOverride } from "../../../lib/og-overrides";

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
  return applyOgOverride({
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
  }, "/varieties/" + slug);
}

export default async function VarietyDetailPage({ params }) {
  const { slug } = await params;
  const v = getVarietyBySlug(slug);
  if (!v) notFound();

  const countrySlug = getCountrySlugFromOrigin(v.origin);
  const country = countrySlug ? COUNTRIES.find((c) => c.slug === countrySlug) : null;
  const relatedLinks = getRelatedLinks(v);
  const relatedVarieties = getRelatedVarieties(v, 4);
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

  // ── Dossier figures and traits: only what our register holds; anything else says so. ──
  const NA = "Not published in our sources";
  const originPlace = (v.origin || "").replace(/\s*\(.*?\)\s*/g, " ").trim();
  const shortUse = (u) => (u === "Frying / Fries" ? "Fries" : String(u).split("/")[0].trim());
  const countryProd = country ? latestProduction(country.slug) : null;
  const countryRank = country ? worldRank(country.slug) : null;
  const figures = [
    releaseYear ? { n: releaseYear, l: `Released${originPlace ? " · " + originPlace : ""}` } : { n: originPlace || "—", l: "Origin" },
    v.uses?.length ? { n: shortUse(v.uses[0]), l: "Main use" } : null,
    countryProd != null ? { n: fmtMt(countryProd), l: `${country.name} harvest · FAOSTAT ${LATEST_YEAR}` } : null,
    v.tier ? { n: v.tier, l: "Classification · Potatopedia" } : { n: v.region, l: "Region" },
  ].filter(Boolean);
  const traitRows = [
    ["Origin", v.origin],
    ["Region", v.region],
    ["Released", releaseYear],
    ["Best uses", (v.uses || []).join(" · ")],
    ["Skin / flesh", null],
    ["Tuber shape", null],
    ["Maturity", null],
    ["Dry matter", null],
    ["Disease resistance", null],
    ["Breeder", null],
  ];
  const rivals = getRelatedVarieties(v, 3);
  const nameWords = v.name.split(/\s+/);
  const enrichment = getEnrichmentSections(v, relatedVarieties);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="dz-top">
        <p className="crumb">
          <Link href="/varieties">Varieties</Link><span aria-hidden="true">/</span>{v.region}<span aria-hidden="true">/</span>{v.name}
        </p>
        <div className="dz-hero">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="eyebrow rise">Variety dossier · {v.region}</p>
            <h1 className="dz-h1 rise">
              {nameWords.length > 1 ? (
                <>{nameWords.slice(0, -1).join(" ")} <em>{nameWords[nameWords.length - 1]}</em></>
              ) : v.name}
            </h1>
            <p className="dz-lede">{v.trait}</p>
          </div>
        </div>
        <Figures items={figures} label={`${v.name} at a glance`} />
      </section>

      <section className="dz-body">
        <div className="dz-cols">
          <div className="dz-main">
            <h2 className="dz-h2">Traits</h2>
            <table className="dz-table">
              <tbody>
                {traitRows.map(([k, val]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td className={val ? undefined : "dz-na"}>{val || NA}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="dz-sec dz-prose">
              <h2 className="dz-h2">About this variety</h2>
              <p>{v.trait}</p>
              <p style={{ fontSize: 15, color: "var(--mute)" }}>
                <strong style={{ fontWeight: 500, color: "var(--ink)" }}>{v.name}</strong> is classified as a {v.region.toLowerCase()} variety
                {releaseYear ? ` released in ${releaseYear}` : ""}
                {v.uses && v.uses.length ? `, primarily used for ${v.uses.slice(0, 3).map(u => u.toLowerCase()).join(", ")}` : ""}.
                For agronomic specs, breeder details, and trial data not yet captured here, refer to the source registries listed at the bottom of this page.
              </p>
            </div>

            {rivals.length > 0 && (
              <div className="dz-sec">
                <h2 className="dz-h2">Nearest rivals</h2>
                <div className="dz-rivals">
                  {rivals.map((rv) => (
                    <Link key={rv.slug} href={`/varieties/${rv.slug}`} className="card" style={{ padding: 18 }}>
                      <span className="dz-rival-n">{rv.name}</span>
                      <span className="dz-rival-m">
                        {[(rv.origin || "").replace(/\s*\(.*?\)\s*/g, " ").trim(), rv.year, rv.uses?.[0] ? shortUse(rv.uses[0]).toLowerCase() : null].filter(Boolean).join(" · ")}
                      </span>
                    </Link>
                  ))}
                </div>
                <p style={{ margin: "18px 0 0" }}>
                  <Link href={`/varieties/compare?ids=${v.slug}`} className="gl">Compare {v.name} with another variety <span className="arr">→</span></Link>
                </p>
              </div>
            )}

            {relatedLinks.length > 0 && (
              <nav className="ed-links" aria-label="Read deeper">
                <p className="k">Read deeper</p>
                {relatedLinks.map((l, i) => (
                  <Link key={i} href={l.href}>{l.text} <span className="arr">→</span></Link>
                ))}
              </nav>
            )}

            {/* Enrichment sections (D1) — hand-crafted for top 12 marquee varieties; templated for next 50 */}
            {enrichment && enrichment.map((sec) => (
              <div key={sec.id} id={sec.id} className="dz-sec dz-prose">
                <h2 className="dz-h2">{sec.heading}</h2>
                {sec.paragraphs.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
            ))}

            {/* FAQ section — server-rendered to match the FAQPage JSON-LD schema */}
            <div className="dz-sec dz-faq">
              <h2 className="dz-h2">Questions about {v.name}</h2>
              {faqItems.map((it, i) => (
                <details key={i}>
                  <summary><span>{it.q}</span><span aria-hidden="true">+</span></summary>
                  <p>{it.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="dz-aside">
            <div className="panel">
              <p className="k" style={{ marginBottom: 8 }}>Find certified seed</p>
              <p className="panel-t">Source certified {v.name} seed</p>
              <p className="panel-s">Tell us the quantity and destination. We reply within one working day.</p>
              <LeadForm
                dark
                compact
                type="trade"
                hidden={{ product: v.name }}
                askCountry={false}
                askMessage={false}
                extra={[
                  { name: "volume", label: "Quantity", placeholder: "e.g. 25 tonnes" },
                  { name: "destination", label: "Destination", placeholder: "Country or region" },
                ]}
                submitLabel="Send seed enquiry"
              />
            </div>
            <FeaturedSlot kicker="Featured breeder · available" title="Your variety set, labelled" sub="Breeders can sponsor their varieties' dossiers. Facts on this page never change." />
            <div className="card" style={{ padding: 22 }}>
              <p className="k" style={{ marginBottom: 10 }}>Ask about this variety</p>
              <form action="/ask" method="get" role="search" style={{ display: "flex", gap: 8 }}>
                <label className="pp-sr" htmlFor="v-ask">Your question about {v.name}</label>
                <input id="v-ask" name="q" required placeholder={`Is ${v.name} good for hot climates?`} style={{ flex: 1, minWidth: 0, border: "1px solid var(--line2)", borderRadius: 12, padding: "12px", font: "inherit", fontSize: 14, background: "var(--card)", color: "var(--ink)" }} />
                <button type="submit" className="btn-red" style={{ minHeight: 44, padding: "0 16px" }}>Ask</button>
              </form>
            </div>
            {country && (
              <Link href={`/country/${country.slug}`} className="card" style={{ padding: 22 }}>
                <span className="card-k">Origin country</span>
                <span className="card-t">{country.name}</span>
                <span className="card-s">
                  {countryProd != null ? `${fmtMt(countryProd)} in ${LATEST_YEAR}${countryRank ? ` · #${countryRank} world producer` : ""} (FAOSTAT)` : country.highlight}
                </span>
                <span className="gl" style={{ display: "inline-block", marginTop: 10, fontSize: 14 }}>Explore {country.name} <span className="arr">→</span></span>
              </Link>
            )}
          </aside>
        </div>
      </section>

      <section className="dz-srcband" aria-label="Sources and methodology">
        <div className="dz-srcband-in">
          <p className="k">Sources &amp; methodology</p>
          <span>
            Variety profiles aggregate data from CIP Lima genebank, ICAR-CPRI variety catalogue, EU Common Catalogue, USDA PVPO, AHDB Potato Variety Database, NIAB, NAK Netherlands, the Potato Pedigree Database, national breeding programmes (CAAS, EARO, BARI, INTA, EMBRAPA, INIFAP, IHAR-PIB, VNIIKKH), and peer-reviewed literature in Potato Research and the American Journal of Potato Research.
          </span>
          {countryProd != null && <span>{country.name} production {fmtMt(countryProd)}: FAOSTAT QCL {LATEST_YEAR}.</span>}
          <span>Traits marked &ldquo;{NA}&rdquo; are not yet in our register; we do not estimate them.</span>
          <span>Updated {UPDATED_SHORT} · Reviewed by Potatopedia editorial team{wikidata ? " · Linked to Wikidata for cross-reference" : ""}.</span>
          <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <Link href="/varieties" className="gl">Browse all {VARIETIES.length} varieties</Link>
            <Link href="/about" className="gl">About our methodology</Link>
            {wikidata && <a href={wikidata} rel="nofollow noopener" target="_blank" className="gl">View on Wikidata ↗</a>}
          </span>
        </div>
      </section>
    </>
  );
}
