import Link from "next/link";
import { notFound } from "next/navigation";
import PdfDownloadButton from "../../../components/PdfDownloadButton";
import ReportChart from "../../../components/ReportChart";
import ReportCover from "../../../components/ReportCover";
import { getReport, listReportSlugs, SITE, REPORT_DATE, FAO, FAO_TM } from "../../../lib/report-pages";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL } from "../../../lib/authors";

export const dynamicParams = false;
export function generateStaticParams() {
  return listReportSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = getReport(slug);
  if (!r) return {};
  const url = `${SITE}/reports/${slug}`;
  const ogTitle = `${r.name} Potato Market Report 2026`;
  return {
    title: { absolute: r.title },
    description: r.description,
    alternates: { canonical: url },
    openGraph: { title: `${ogTitle} — Potatopedia`, description: r.description, type: "article", url, siteName: "Potatopedia" },
    twitter: { card: "summary_large_image", title: ogTitle, description: r.description },
  };
}

const wrap = { maxWidth: 900, margin: "0 auto", padding: "0 16px" };
const h2s = { fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, fontSize: "clamp(26px, 5vw, 34px)", lineHeight: 1.15, color: "var(--ink)", margin: "0 0 14px" };
const gl = { color: "var(--gold)", fontWeight: 600, textDecoration: "none" };

// The download button (gated form) sits in a block that lets its long label wrap at 390px.
const CTA_CSS = `.rp-cta .pp-pdf-button{white-space:normal !important;text-align:left;max-width:100%;padding:13px 20px !important;font-size:15px !important;line-height:1.3}
.rp-fig{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.rp-top{display:grid;grid-template-columns:1fr 220px;gap:32px;align-items:center}
@media (max-width:720px){.rp-fig{grid-template-columns:1fr}.rp-top{grid-template-columns:1fr}.rp-cover{order:-1;max-width:150px}}`;

function Cta({ id, name, pages }) {
  return (
    <div className="rp-cta" id={id} style={{ background: "var(--card)", border: "1px solid var(--gold-line)", borderRadius: 14, padding: "18px 18px 16px" }}>
      <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.55, color: "var(--ink2)" }}>
        <strong>Get the full {pages}-page {name} report.</strong> Free. Register your email and we send a secure download link (valid 7 days).
      </p>
      <PdfDownloadButton size="md" placement="banner" />
    </div>
  );
}

export default async function ReportPage({ params }) {
  const { slug } = await params;
  const r = getReport(slug);
  if (!r) notFound();
  const url = `${SITE}/reports/${slug}`;
  const countryUrl = `${SITE}/country/${slug}`;
  const pricesLink = { india: ["/prices/india", "India potato prices"], netherlands: ["/prices/europe", "European potato prices"], "united-states": ["/prices/usa", "US potato prices"] }[slug] || ["/prices", "Potato prices"];
  const ogImage = `${url}/opengraph-image`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Report",
        "@id": `${url}#report`,
        name: `${r.name} Potato Market Report 2026`,
        headline: `${r.name} Potato Market Report 2026`,
        description: r.description,
        url,
        mainEntityOfPage: url,
        datePublished: REPORT_DATE,
        dateModified: REPORT_DATE,
        inLanguage: "en",
        numberOfPages: r.pages,
        encodingFormat: "application/pdf",
        image: ogImage,
        about: { "@id": `${url}#country` },
        isAccessibleForFree: true,
        conditionsOfAccess: "Free. The summary on this page is public; the full PDF requires registering an email address, and a secure download link is emailed.",
        author: [POTATOPEDIA_EDITORIAL, { "@id": `${SITE}/#publisher` }],
        publisher: { "@id": `${SITE}/#publisher` },
        isBasedOn: { "@id": `${url}#dataset` },
        citation: ["FAOSTAT, Food and Agriculture Organization of the United Nations, Crops and livestock products (QCL) and Trade Matrix (TM)"],
      },
      {
        "@type": ["Country", "Place"],
        "@id": `${url}#country`,
        name: r.name,
        url: countryUrl,
        ...(r.wikidata ? { sameAs: r.wikidata } : {}),
      },
      {
        "@type": "Dataset",
        "@id": `${url}#dataset`,
        name: `${r.name} potato production, area, yield and consumption: key figures`,
        description: `Key figures from the ${r.name} Potato Market Report 2026: production ${r.FY}–${r.LY} (FAOSTAT), national estimate, world rank, area, yield and per-capita consumption, each with its publisher and year.`,
        url,
        inLanguage: "en",
        temporalCoverage: `${r.FY}/${r.LY}`,
        spatialCoverage: { "@id": `${url}#country` },
        isAccessibleForFree: true,
        keywords: [`${r.name} potato production`, `${r.name} potato market report`, "potato production statistics", "FAOSTAT"],
        creator: { "@type": "Organization", name: "Potatopedia editorial desk", url: SITE, "@id": `${SITE}/#publisher` },
        publisher: { "@id": `${SITE}/#publisher` },
        isBasedOn: "https://www.fao.org/faostat/en/#data/QCL",
        citation: "FAOSTAT, Crops and livestock products (QCL), item 116 Potatoes; Trade Matrix (TM), fresh potatoes",
        variableMeasured: [
          { "@type": "PropertyValue", name: "Potato production", value: r.head.v, unitText: "million tonnes", description: `${r.head.year}, ${r.head.src}` },
          { "@type": "PropertyValue", name: "World rank by production", value: r.rank, description: `Of ${r.nRanked} producing countries, ${FAO}, ${r.LY}` },
          { "@type": "PropertyValue", name: "Harvested area", value: `${r.kf.area.v} ${r.kf.area.unit}`, description: `${r.kf.area.src}${r.kf.area.year ? `, ${r.kf.area.year}` : ""}` },
          { "@type": "PropertyValue", name: "Average yield", value: `${r.kf.yield.v} ${r.kf.yield.unit}`, description: r.kf.yield.src },
          { "@type": "PropertyValue", name: "Per-capita consumption", value: `${r.kf.consumption.v} ${r.kf.consumption.unit}`, description: r.kf.consumption.src },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: r.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": `${SITE}/`, name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": `${SITE}/reports`, name: "Market reports" } },
          { "@type": "ListItem", position: 3, item: { "@id": url, name: `${r.name} Potato Market Report 2026` } },
        ],
      },
      POTATOPEDIA_PUBLISHER,
    ],
  };

  return (
    <article style={{ paddingBottom: 72 }}>
      <style dangerouslySetInnerHTML={{ __html: CTA_CSS }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "36px 0 30px" }}>
        <div style={wrap}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: "var(--mute)", marginBottom: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Link href="/" style={{ color: "var(--mute)", textDecoration: "none" }}>Home</Link><span aria-hidden="true">/</span>
            <Link href="/reports" style={{ color: "var(--mute)", textDecoration: "none" }}>Market reports</Link><span aria-hidden="true">/</span>
            <span style={{ color: "var(--ink2)" }}>{r.name}</span>
          </nav>
          <div className="rp-top">
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>{r.edition.month} edition · {r.pages} pages · PDF</div>
              <h1 style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, fontSize: "clamp(34px, 8vw, 56px)", lineHeight: 1.05, letterSpacing: "-.015em", color: "var(--ink)", margin: "0 0 14px" }}>{r.name} Potato Market Report 2026</h1>
              <p data-summary="true" style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink2)", margin: "0 0 18px" }}>{r.sentences[0].t}</p>
              <Cta id="get-report" name={r.name} pages={r.pages} />
            </div>
            <div className="rp-cover" style={{ width: "100%" }}>
              <ReportCover name={r.name} headlineValue={r.head.v.toFixed(r.head.v >= 10 ? 1 : 2)} headlineLabel={r.head.year} edition={r.edition.month} maxWidth={220} />
            </div>
          </div>
        </div>
      </header>

      <div style={wrap}>
        <section style={{ marginTop: 36 }} aria-labelledby="exec">
          <h2 id="exec" style={h2s}>Executive summary</h2>
          <p style={{ fontSize: 12.5, color: "var(--mute2)", margin: "0 0 14px" }}>Data as of {r.edition.asOf}. Every figure names its publisher and year.</p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
            {r.sentences.map((s, i) => (
              <li key={i} style={{ paddingLeft: 16, borderLeft: "2px solid var(--gold-line)" }}>
                <span style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink2)" }}>{s.t}</span>
                <span style={{ display: "block", fontSize: 12, color: "var(--mute2)", marginTop: 2 }}>Source: {s.s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: 40 }} aria-labelledby="figs">
          <h2 id="figs" style={h2s}>Key figures</h2>
          <div className="rp-fig">
            {r.keyFigures.map((k) => (
              <div key={k.l} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px", minWidth: 0 }}>
                <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>{k.l}</div>
                <div style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontSize: 44, lineHeight: 1.05, color: "var(--ink)", margin: "6px 0 2px", overflowWrap: "anywhere" }}>{k.v}</div>
                <div style={{ fontSize: 13.5, color: "var(--gold-h)" }}>{k.u}</div>
                <div style={{ fontSize: 11.5, color: "var(--mute2)", marginTop: 8 }}>Source: {k.s}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "var(--mute)", margin: "14px 0 0" }}>Area, yield, trade partners, regional breakdown, processors and outlook are in the full report.</p>
        </section>

        <section style={{ marginTop: 40 }} aria-labelledby="chart">
          <h2 id="chart" style={h2s}>{r.name} potato production, {r.FY}–{r.LY}</h2>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 14px 12px" }}>
            <ReportChart name={r.name} series={r.series} source={`${FAO}, ${r.FY}–${r.LY}`} />
          </div>
          {r.national && <p style={{ fontSize: 13, color: "var(--mute)", margin: "10px 0 0" }}>Indian crop years run July–June and are not plotted on this calendar-year series. The headline {r.head.v} million tonnes ({r.head.short}) is the latest national estimate.</p>}
        </section>

        <section style={{ marginTop: 40 }} aria-labelledby="inside">
          <h2 id="inside" style={h2s}>What&apos;s inside the {r.name} report</h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12 }}>
            {r.toc.map(([t, sub, p], i) => (
              <li key={t} style={{ display: "flex", gap: 14, alignItems: "baseline", padding: "13px 16px", borderTop: i ? "1px solid var(--line)" : "none" }}>
                <span style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontSize: 22, color: "var(--gold)", flex: "0 0 30px" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>{t}</span>
                  <span style={{ display: "block", fontSize: 13.5, color: "var(--mute)" }}>{sub}</span>
                </span>
                <span style={{ fontSize: 13, color: "var(--mute2)", whiteSpace: "nowrap" }}>p. {p}</span>
              </li>
            ))}
          </ol>
          <p style={{ fontSize: 13.5, color: "var(--mute)", margin: "10px 0 0" }}>Plus cover, contents and executive summary (pages 1–2) and a back cover (page 10): {r.pages} pages in all. Sources: {FAO}; {FAO_TM}; national statistical offices and institutes as named in the report.</p>
        </section>

        <section style={{ marginTop: 40 }} aria-labelledby="faq">
          <h2 id="faq" style={h2s}>Frequently asked questions</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {r.faq.map((f) => (
              <div key={f.q} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35 }}>{f.q}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--ink2)" }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 40 }} aria-label="Download the report">
          <Cta id="get-report-end" name={r.name} pages={r.pages} />
        </section>

        <nav style={{ marginTop: 40 }} aria-labelledby="more">
          <h2 id="more" style={{ ...h2s, fontSize: 24 }}>More on {r.name}</h2>
          <ul style={{ margin: 0, paddingLeft: 22, fontSize: 15.5, lineHeight: 1.9, color: "var(--ink2)" }}>
            <li><Link href={`/country/${slug}`} style={gl}>{r.name} potato industry: the free country profile</Link></li>
            <li><Link href={pricesLink[0]} style={gl}>{pricesLink[1]}</Link></li>
            <li><Link href="/varieties" style={gl}>Potato varieties database</Link></li>
            <li><Link href="/companies" style={gl}>Potato company directory</Link></li>
            <li><Link href="/reports" style={gl}>All country market reports</Link></li>
          </ul>
        </nav>
      </div>
    </article>
  );
}
