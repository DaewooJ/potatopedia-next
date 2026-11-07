// Shared premium country profile renderer.
// Each country provides a `data` object; this component handles the layout,
// schema, and shared inline helpers.
//
// Used by Turkey, Iran, Algeria, Uzbekistan, Colombia. Kenya retains its own
// inline implementation (slightly different — has the WPC 2026 hero callout).

import Link from "next/link";
import { COUNTRIES, UPDATED_SHORT } from "../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, SPEAKABLE } from "../lib/authors";
import { PRODUCTION_TIMESERIES, FAOSTAT_YEARS, trendLabel } from "../lib/faostat-timeseries";

// Shared style constants
const sH2 = { fontSize: 22, fontWeight: 700, paddingLeft: 16, borderLeft: "4px solid var(--gold)", marginTop: 0, marginBottom: 14, color: "var(--ink)" };
const sP = { fontSize: 14.5, color: "var(--ink2)", lineHeight: 1.75, margin: "0 0 14px" };
const sIntro = { fontSize: 16, color: "var(--ink)", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 500 };
const sTh = { padding: "10px 12px", textAlign: "left", background: "var(--accent-bg)", color: "#fff", fontSize: 13, fontWeight: 700 };
const sTd = { padding: "9px 12px", fontSize: 14, borderBottom: "1px solid var(--line)" };
const sSource = { fontSize: 12, color: "var(--mute2)", marginTop: 8, marginBottom: 0, fontStyle: "italic" };
const cardWrap = { background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "26px 28px 22px", marginBottom: 18 };
const linkRed = { color: "var(--gold)", textDecoration: "none", fontWeight: 600 };
const qfBox = { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 18px", marginBottom: 16 };
const qfTitle = { fontSize: 10, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 };

function QuickFacts({ items }) {
  return (
    <div data-quick-facts="true" style={qfBox}>
      <div style={qfTitle}>Quick Facts</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 18px", fontSize: 13, color: "var(--ink2)" }}>
        {items.map((it, i) => <li key={i} style={{ lineHeight: 1.5 }}><strong style={{ color: "var(--ink)" }}>{it.label}:</strong> {it.value}</li>)}
      </ul>
    </div>
  );
}

function StatCallout({ number, unit, context, source }) {
  return (
    <>
      <style>{`.pp-cp-cb{display:flex;gap:18px;align-items:flex-start;margin:22px 0}.pp-cp-cbm{display:none}@media(max-width:640px){.pp-cp-cb{display:none!important}.pp-cp-cbm{display:block!important;margin:22px 0;border-left: 4px solid var(--gold);border-radius:0 10px 10px 0;background: var(--paper);padding:16px 18px}}`}</style>
      <div className="pp-cp-cb">
        <div style={{ background: "var(--accent-bg)", borderRadius: 12, padding: "18px 22px", minWidth: 110, textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{number}</div>
          {unit && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4, textTransform: "uppercase" }}>{unit}</div>}
        </div>
        <div style={{ padding: "6px 0", flex: 1 }}>
          <div style={{ fontSize: 14, color: "var(--mute)", lineHeight: 1.65 }}>{context}</div>
          {source && <div style={{ fontSize: 11, color: "var(--mute3)", marginTop: 6, fontStyle: "italic" }}>{source}</div>}
        </div>
      </div>
      <div className="pp-cp-cbm">
        <div style={{ marginBottom: 6 }}><span style={{ fontSize: 22, fontWeight: 800, color: "var(--gold)" }}>{number}</span>{unit && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", marginLeft: 4 }}>{unit}</span>}</div>
        <div style={{ fontSize: 14, color: "var(--mute)", lineHeight: 1.65 }}>{context}</div>
        {source && <div style={{ fontSize: 11, color: "var(--mute3)", marginTop: 6, fontStyle: "italic" }}>{source}</div>}
      </div>
    </>
  );
}

// 5-year (or 7-year) FAOSTAT trajectory table, rendered inside Card 1 of each premium profile.
// Exported so the 6 tier-1 inline profile renderers (India, China, Belgium, Netherlands, US, Kenya) can use it too.
export function TrajectoryTable({ slug, footnote }) {
  const series = PRODUCTION_TIMESERIES[slug];
  if (!series) return null;
  const trend = trendLabel(slug);
  const trendColor = trend?.dir === "rising" ? "var(--gold)" : trend?.dir === "declining" ? "var(--gold)" : "#888";
  const fmt = (v) => v == null ? "—" : v.toFixed(2);
  const yoy = (year) => {
    const cur = series[year], prev = series[year - 1];
    if (cur == null || prev == null) return null;
    return ((cur - prev) / prev) * 100;
  };
  const yoyFmt = (p) => p == null ? "—" : `${p >= 0 ? "+" : ""}${p.toFixed(1)}%`;
  const yoyColor = (p) => p == null ? "#aaa" : p >= 0 ? "var(--gold)" : "var(--gold)";
  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 18px 10px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={qfTitle}>FAOSTAT 2018–2024 trajectory</div>
        {trend && <div style={{ fontSize: 11, fontWeight: 700, color: trendColor }}>{trend.sym} 7-yr {trend.pct >= 0 ? "+" : ""}{trend.pct.toFixed(0)}% ({trend.dir})</div>}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr>
            <th style={{ padding: "6px 8px", textAlign: "left", fontSize: 11, color: "var(--mute2)", fontWeight: 700, borderBottom: "1px solid var(--line)" }}>Year</th>
            {FAOSTAT_YEARS.map((y) => (
              <th key={y} style={{ padding: "6px 8px", textAlign: "right", fontSize: 11, color: y === 2024 ? "var(--gold)" : "#888", fontWeight: 700, borderBottom: "1px solid var(--line)" }}>{y}</th>
            ))}
          </tr></thead>
          <tbody>
            <tr>
              <td style={{ padding: "6px 8px", fontSize: 11, color: "var(--ink2)", fontWeight: 600 }}>Mt</td>
              {FAOSTAT_YEARS.map((y) => (
                <td key={y} style={{ padding: "6px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: y === 2024 ? 700 : 500, color: y === 2024 ? "var(--gold)" : "#222" }}>{fmt(series[y])}</td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: "6px 8px", fontSize: 11, color: "var(--ink2)", fontWeight: 600 }}>YoY</td>
              {FAOSTAT_YEARS.map((y, i) => {
                const p = i === 0 ? null : yoy(y);
                return <td key={y} style={{ padding: "6px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 11, color: yoyColor(p) }}>{yoyFmt(p)}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 10.5, color: "var(--mute2)", marginTop: 6, fontStyle: "italic", lineHeight: 1.5 }}>{footnote || "Source: FAOSTAT 2024 (UN FAO Crops & Livestock Products dataset)."}</div>
    </div>
  );
}

// Card — generic content card with lead-with-answer + Quick Facts + paragraphs + optional table/callout/source
function Card({ id, dataCard, h2, lead, quickFacts, trajectorySlug, trajectoryFootnote, body, table, callout, source }) {
  return (
    <section id={id} data-card={dataCard} style={cardWrap}>
      <h2 style={sH2}>{h2}</h2>
      {lead && <p style={sIntro} dangerouslySetInnerHTML={{ __html: lead }} />}
      {quickFacts && <QuickFacts items={quickFacts} />}
      {trajectorySlug && <TrajectoryTable slug={trajectorySlug} footnote={trajectoryFootnote} />}
      {body && body.map((p, i) => <p key={i} style={sP} dangerouslySetInnerHTML={{ __html: p }} />)}
      {table && (
        <div style={{ overflowX: "auto", marginBottom: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr>{table.headers.map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i} style={{ background: i < 3 ? "rgba(154,114,56,0.03)" : i % 2 === 0 ? "var(--card)" : "var(--paper)" }}>
                  {r.map((cell, j) => (
                    <td key={j} style={{ ...sTd, fontWeight: j === 0 ? (i < 3 ? 700 : 600) : 400, color: j > 1 ? "#666" : "#333" }} dangerouslySetInnerHTML={{ __html: cell }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {callout && <StatCallout {...callout} />}
      {source && <p style={sSource}>{source}</p>}
    </section>
  );
}

function FurtherReading({ regionalCountries, indiaContext = false }) {
  // Common further-reading link block — generic enough for all premium country pages
  const groups = [
    { title: "Regional context", items: regionalCountries.map((s) => ({ href: `/country/${s.slug}`, label: `${s.name} — ${s.note}` })) },
    {
      title: "Knowledge",
      items: [
        { href: "/knowledge/seed-potato-systems", label: "Seed potato systems" },
        { href: "/knowledge/potato-storage-cold-chain", label: "Potato cold storage" },
        { href: "/knowledge/potato-diseases-pests", label: "Potato diseases and pests" },
        { href: "/knowledge/climate-change-potatoes", label: "Climate change and potatoes" },
        { href: "/knowledge/potato-processing-industry", label: "Global potato processing industry" },
        { href: "/knowledge/top-potato-producing-countries", label: "Top potato producing countries" },
        { href: "/knowledge/global-potato-trade", label: "Global potato trade" },
        { href: "/knowledge/potato-varieties-guide", label: "Potato varieties guide" },
      ],
    },
    {
      title: "Practical answers",
      items: [
        { href: "/answers/seed-potato-certification", label: "Seed potato certification" },
        { href: "/answers/certified-seed-potatoes", label: "Certified seed potatoes" },
        { href: "/answers/best-fertilizer-for-potatoes", label: "Best fertilizer for potatoes" },
        { href: "/answers/when-to-plant-potatoes", label: "When to plant potatoes" },
        { href: "/answers/potato-cold-storage-temperature", label: "Cold storage temperature" },
        { href: "/answers/how-long-potatoes-cold-storage", label: "How long can potatoes be stored?" },
        { href: "/answers/potato-water-footprint", label: "Potato water footprint" },
        { href: "/answers/potato-climate-change", label: "Potato and climate change" },
        { href: "/answers/potato-market-price-today", label: "Potato market price" },
        { href: "/answers/potato-history-origin", label: "Where did the potato originate?" },
      ],
    },
  ];
  if (indiaContext) {
    groups.push({
      title: "India deep dives (smallholder parallels)",
      items: [
        { href: "/country/india/uttar-pradesh", label: "Uttar Pradesh" },
        { href: "/country/india/bihar", label: "Bihar" },
        { href: "/country/india/west-bengal", label: "West Bengal" },
        { href: "/country/india/madhya-pradesh", label: "Madhya Pradesh" },
        { href: "/country/india/gujarat", label: "Gujarat" },
      ],
    });
  }
  return (
    <section style={{ marginTop: 40, padding: "22px 24px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>Further reading</h2>
      <p style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.6, marginBottom: 16 }}>Deeper Potatopedia references on seed systems, processing, varieties, and global potato production.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16 }}>
        {groups.map((g) => (
          <div key={g.title}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 8 }}>{g.title}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {g.items.map((it) => (
                <li key={it.href}><Link href={it.href} style={{ fontSize: 13, color: "var(--ink2)", textDecoration: "none", lineHeight: 1.5 }}>{it.label} →</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CountryProfilePremium({ data }) {
  const {
    slug, name, flag, region, h1, tagLabel, readMin, definitiveAnswer, keyStats,
    quickFacts, tocItems, cards, sourceList, faqItems, regionalContext,
    continueReading, wikidata, indiaContext, accentLabel, articlePublishedISO, articleModifiedISO,
  } = data;

  const pageUrl = `https://www.potatopedia.com/country/${slug}`;

  // JSON-LD: Article + BreadcrumbList + Place/Country (with Wikidata sameAs) + Publisher + FAQPage
  const jsonLdGraph = [
    {
      "@type": "Article",
      "@id": pageUrl + "#article",
      headline: h1,
      description: definitiveAnswer.replace(/<[^>]+>/g, "").slice(0, 200),
      datePublished: articlePublishedISO || "2026-05-08",
      dateModified: articleModifiedISO || "2026-05-08",
      author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
      publisher: { "@id": "https://www.potatopedia.com/#publisher" },
      mainEntityOfPage: pageUrl,
      image: "https://www.potatopedia.com/og-image.png",
      about: { "@id": pageUrl + "#country" },
      articleSection: "Country profile",
      speakable: SPEAKABLE,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
        { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
        { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: name } },
      ],
    },
    {
      "@type": ["Country", "Place"],
      "@id": pageUrl + "#country",
      name: name,
      url: pageUrl,
      ...(wikidata ? { sameAs: wikidata } : {}),
      description: definitiveAnswer.replace(/<[^>]+>/g, "").slice(0, 250),
    },
    POTATOPEDIA_PUBLISHER,
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--card)", color: "var(--ink)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLdGraph }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />

      {/* Hero */}
      <style>{`.pp-cp-hero{padding:56px 24px 40px;background: var(--paper);position:relative;overflow:hidden;border-bottom: 1px solid var(--line);background-image:repeating-linear-gradient(0deg,rgba(154,114,56,0.04) 0,rgba(154,114,56,0.04) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,rgba(154,114,56,0.04) 0,rgba(154,114,56,0.04) 1px,transparent 1px,transparent 60px)}@media(max-width:768px){.pp-cp-hero{padding:40px 20px 32px}}`}</style>
      <section className="pp-cp-hero">
        <div style={{ position: "absolute", top: 16, right: 24, width: 200, height: 2, background: "var(--accent-bg)", borderRadius: 1, zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "var(--mute2)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "var(--mute3)" }}>/</span>
            <Link href="/countries" style={{ color: "var(--mute2)", textDecoration: "none" }}>Countries</Link>
            <span style={{ color: "var(--mute3)" }}>/</span>
            <span style={{ color: "var(--gold)", fontWeight: 700 }}>{name} {flag}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.5, background: "rgba(154,114,56,0.06)", padding: "4px 12px", borderRadius: 10 }}>{tagLabel}</span>
            <span style={{ fontSize: 12, color: "var(--mute2)" }}>·</span>
            <span style={{ fontSize: 12, color: "var(--mute2)" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "var(--mute2)" }}>·</span>
            <span style={{ fontSize: 12, color: "var(--mute2)" }}>{readMin} min read</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, lineHeight: 1.18, margin: "0 0 12px", maxWidth: 920 }} dangerouslySetInnerHTML={{ __html: h1 }} />
          {accentLabel && <p style={{ fontSize: 14, color: "var(--mute)", margin: 0, maxWidth: 760, lineHeight: 1.6 }}>{accentLabel}</p>}
        </div>
      </section>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 0 80px" }}>

          {/* Quick Facts top of page */}
          <QuickFacts items={quickFacts} />

          {/* Definitive Answer */}
          <div data-summary="true" style={{ background: "rgba(154,114,56,0.03)", border: "1px solid rgba(154,114,56,0.12)", borderLeft: "4px solid var(--gold)", borderRadius: "0 12px 12px 0", padding: "22px 28px", marginBottom: 22, fontSize: 16, color: "var(--ink2)", lineHeight: 1.75 }}>
            <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: definitiveAnswer }} />
          </div>

          {/* Key Stat Strip */}
          <style>{`.pp-cp-stats{display:grid;grid-template-columns:repeat(${keyStats.length},1fr);gap:0;background: var(--panel);border-radius:12px;padding:26px 22px;margin-bottom:24px}@media(max-width:768px){.pp-cp-stats{grid-template-columns:repeat(2,1fr)!important;gap:18px!important;padding:22px 18px!important}}@media(max-width:400px){.pp-cp-stats{grid-template-columns:1fr!important}}`}</style>
          <div className="pp-cp-stats">
            {keyStats.map((s, i, arr) => (
              <div key={i} style={{ textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none", padding: "0 10px" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.accent || "#fff", letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginTop: 8, textTransform: "uppercase", letterSpacing: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* TOC */}
          <details style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 18px", marginBottom: 28 }}>
            <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, fontWeight: 600, color: "var(--mute)" }}>
              <span>In this article ({tocItems.length} sections)</span><span style={{ fontSize: 10, color: "var(--mute3)" }}>▾</span>
            </summary>
            <nav style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              {tocItems.map((it, i) => <a key={i} href={"#" + it.id} style={{ fontSize: 13, color: "var(--mute)", textDecoration: "none", padding: "5px 0", borderBottom: "1px solid var(--line)" }}>{it.l}</a>)}
            </nav>
          </details>

          {/* Cards */}
          {cards.map((c, i) => <Card key={c.id || i} {...c} trajectorySlug={i === 0 ? slug : undefined} trajectoryFootnote={i === 0 ? data.trajectoryFootnote : undefined} />)}

          {/* Sources */}
          <div style={{ padding: "16px 20px", background: "var(--paper)", borderRadius: 10, marginTop: 28, marginBottom: 8 }}>
            <div style={qfTitle}>Sources</div>
            {sourceList.map((s, i) => <div key={i} style={{ fontSize: 12, color: "var(--mute)", lineHeight: 1.6 }}>{s}</div>)}
          </div>

          {/* FAQ */}
          <section style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>Frequently Asked Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {faqItems.map((item, i) => (
                <details key={i} style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)" }}>
                  <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 }}>{item.q}</span>
                    <span style={{ fontSize: 16, color: "var(--gold)", flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.7, marginTop: 12 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related regional countries */}
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>Regional context</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 12 }}>
              {regionalContext.map((rc) => {
                const co = COUNTRIES.find((x) => x.slug === rc.slug);
                if (!co) return null;
                return (
                  <Link key={co.slug} href={`/country/${co.slug}`} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{co.flag}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{co.name}</div>
                    <div style={{ fontSize: 12, color: "var(--mute)" }}>{co.prod} tonnes · {rc.note || co.region}</div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Continue Reading */}
          <section style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>Continue Reading</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {continueReading.map((a, i) => (
                <Link key={i} href={a.href} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "inherit", display: "block" }}>
                  <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.2, background: "rgba(154,114,56,0.06)", padding: "2px 8px", borderRadius: 6, marginBottom: 8 }}>{a.tag}</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--mute2)", lineHeight: 1.4 }}>{a.desc}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Further Reading block */}
          <FurtherReading regionalCountries={regionalContext.map((rc) => {
            const co = COUNTRIES.find((x) => x.slug === rc.slug);
            return co ? { slug: co.slug, name: co.name, note: rc.note || co.region } : null;
          }).filter(Boolean)} indiaContext={indiaContext} />

          {/* Bottom CTA */}
          <div style={{ marginTop: 44, padding: "28px 28px", borderRadius: 16, background: "linear-gradient(135deg, rgba(154,114,56,0.06), rgba(154,114,56,0.02))", border: "1px solid rgba(154,114,56,0.12)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Have a question about {name} potato production?</div>
            <div style={{ fontSize: 14, color: "var(--mute)", marginBottom: 16 }}>Ask Potatopedia AI for instant, data-backed answers drawn from FAOSTAT, government statistical agencies, peer-reviewed research, and other authoritative sources.</div>
            <Link href="/ask" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "var(--accent-bg)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Ask Potatopedia AI →</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
