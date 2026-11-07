import Link from "next/link";
import ReportCover from "../../components/ReportCover";
import { getAllReports, COMING_SOON, SITE, REPORT_EDITION, REPORT_DATE } from "../../lib/report-pages";
import { POTATOPEDIA_PUBLISHER } from "../../lib/authors";
import { COUNTRIES } from "../../lib/data";

const TITLE = "Potato Market Reports by Country | Potatopedia";
const DESC = "Potato market reports by country: China, India, the United States and the Netherlands. Production, trade, regions and industry, every figure sourced.";
export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${SITE}/reports` },
  openGraph: { title: TITLE, description: DESC, type: "website", url: `${SITE}/reports`, images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const wrap = { maxWidth: 1080, margin: "0 auto", padding: "0 16px" };
const h2s = { fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, fontSize: "clamp(26px, 5vw, 34px)", lineHeight: 1.15, color: "var(--ink)", margin: "0 0 14px" };

export default function ReportsHub() {
  const reports = getAllReports();
  const have = new Set(reports.map((r) => r.slug));
  const soon = COMING_SOON.filter(([s]) => !have.has(s));
  const known = new Set(COUNTRIES.map((c) => c.slug));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage", "@id": `${SITE}/reports#page`, url: `${SITE}/reports`, name: "Potato market reports by country", description: DESC, inLanguage: "en",
        isPartOf: { "@id": `${SITE}/#website` }, publisher: { "@id": `${SITE}/#publisher` },
        mainEntity: { "@type": "ItemList", itemListElement: reports.map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/reports/${r.slug}`, name: `${r.name} Potato Market Report 2026` })) },
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, item: { "@id": `${SITE}/`, name: "Home" } }, { "@type": "ListItem", position: 2, item: { "@id": `${SITE}/reports`, name: "Market reports" } }] },
      POTATOPEDIA_PUBLISHER,
    ],
  };
  return (
    <article style={{ paddingBottom: 72 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "40px 0 32px" }}>
        <div style={wrap}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: "var(--mute)", marginBottom: 14 }}>
            <Link href="/" style={{ color: "var(--mute)", textDecoration: "none" }}>Home</Link> <span aria-hidden="true">/</span> <span style={{ color: "var(--ink2)" }}>Market reports</span>
          </nav>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Market reports · {REPORT_EDITION.month}</div>
          <h1 style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, fontSize: "clamp(34px, 8vw, 58px)", lineHeight: 1.05, letterSpacing: "-.015em", color: "var(--ink)", margin: "0 0 14px" }}>Potato market reports by country</h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--ink2)", maxWidth: 680, margin: 0 }}>
            Ten-page country reports on production, trade, regions, industry and outlook. Every figure carries its publisher and year. Read the free summary of each report here; the full PDF is emailed after a short registration.
          </p>
        </div>
      </header>

      <section style={{ ...wrap, marginTop: 36 }} aria-label="Available reports">
        <h2 style={h2s}>Available now</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 18 }}>
          {reports.map((r) => (
            <Link key={r.slug} href={`/reports/${r.slug}`} style={{ display: "flex", gap: 16, textDecoration: "none", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 16, alignItems: "flex-start" }}>
              <div style={{ flex: "0 0 112px", width: 112 }}>
                <ReportCover name={r.name} headlineValue={r.head.v.toFixed(r.head.v >= 10 ? 1 : 2)} headlineLabel={r.head.year} edition={r.edition.month} maxWidth={112} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, fontSize: 22, lineHeight: 1.15, color: "var(--ink)", margin: "0 0 6px" }}>{r.name} Potato Market Report 2026</h3>
                <p style={{ fontSize: 12.5, color: "var(--mute)", margin: "0 0 8px" }}>{r.edition.month} · {r.pages} pages · PDF</p>
                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.5, margin: "0 0 8px" }}><strong>{r.head.v.toFixed(r.head.v >= 10 ? 1 : 2)} million tonnes</strong>, {r.head.year}; world rank #{r.rank}.</p>
                <p style={{ fontSize: 11.5, color: "var(--mute2)", margin: "0 0 10px" }}>Source: {r.head.src}</p>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gold)" }}>Read the summary →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ ...wrap, marginTop: 44 }}>
        <h2 style={h2s}>What is inside every report</h2>
        <ul style={{ margin: 0, paddingLeft: 22, fontSize: 15.5, lineHeight: 1.75, color: "var(--ink2)" }}>
          <li>Key figures: production, area, yield, world rank, consumption and the fresh-trade balance.</li>
          <li>Production, area and yield over the 2018–2024 FAOSTAT series, compared with peer countries.</li>
          <li>Trade: fresh-potato flows and processed-product exports.</li>
          <li>Regions and varieties: where the crop is grown and what is planted.</li>
          <li>Industry: processors, seed houses and machinery makers.</li>
          <li>Outlook, key issues and a full source list.</li>
        </ul>
      </section>

      <section style={{ ...wrap, marginTop: 40 }}>
        <h2 style={h2s}>How we source</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--ink2)", margin: "0 0 12px" }}>
          International production, rank and trade figures come from one comparable series, FAOSTAT (production: QCL, item 116; trade: TM, fresh potatoes), so that countries can be compared fairly. National figures such as area, yield, consumption and state or province output come from the statistical offices and institutes named under each figure. When a government publishes several estimates for one year, we use the most advanced one and name it.
        </p>
        <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--ink2)", margin: 0 }}>
          Reports are prepared by the Potatopedia editorial desk. See the <Link href="/about" style={{ color: "var(--gold)", fontWeight: 600 }}>methodology</Link>, or browse the free <Link href="/countries" style={{ color: "var(--gold)", fontWeight: 600 }}>country profiles</Link>, <Link href="/prices" style={{ color: "var(--gold)", fontWeight: 600 }}>prices</Link> and <Link href="/varieties" style={{ color: "var(--gold)", fontWeight: 600 }}>varieties</Link>.
        </p>
      </section>

      {soon.length > 0 && (
        <section style={{ ...wrap, marginTop: 40 }}>
          <h2 style={h2s}>Coming soon</h2>
          <p style={{ fontSize: 15, color: "var(--mute)", margin: "0 0 12px" }}>The next countries in line. Until their report is ready, the free profile has the headline data.</p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {soon.map(([s, n]) => (
              <li key={s}>
                {known.has(s) ? (
                  <Link href={`/country/${s}`} style={{ display: "inline-block", border: "1px solid var(--line2)", borderRadius: 999, padding: "8px 16px", fontSize: 14, color: "var(--ink2)", textDecoration: "none" }}>{n}</Link>
                ) : (
                  <span style={{ display: "inline-block", border: "1px solid var(--line2)", borderRadius: 999, padding: "8px 16px", fontSize: 14, color: "var(--ink2)" }}>{n}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
