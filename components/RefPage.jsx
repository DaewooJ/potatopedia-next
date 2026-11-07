import Link from "next/link";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, SPEAKABLE } from "../lib/authors";

// One template for the reference pages (/prices, /diseases, /events). Content lives in lib/reference/*.js as plain
// data: sections of paragraphs, lists and tables, a dated source list and related internal links. Styling is inline
// (site rule) and uses the shared CSS variables; tables scroll inside their own box so nothing overflows at 390px.

const SITE = "https://www.potatopedia.com";

const wrap = { maxWidth: 820, margin: "0 auto", padding: "0 16px" };
const h2s = { fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "36px 0 12px", paddingLeft: 14, borderLeft: "4px solid var(--gold)", lineHeight: 1.25 };
const ps = { fontSize: 15.5, color: "var(--ink2)", lineHeight: 1.75, margin: "0 0 14px" };
const lis = { fontSize: 15.5, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 6 };
const th = { padding: "9px 12px", textAlign: "left", background: "var(--accent-bg)", color: "#fff", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" };
const td = { padding: "9px 12px", fontSize: 14, borderBottom: "1px solid var(--line)", color: "var(--ink2)", verticalAlign: "top" };

export function refJsonLd({ path, headline, description, datePublished, dateModified, crumbs, dataset, extra = [] }) {
  const url = SITE + path;
  const graph = [
    {
      "@type": "Article",
      "@id": url + "#article",
      headline,
      description,
      datePublished,
      dateModified,
      author: [POTATOPEDIA_EDITORIAL, { "@id": SITE + "/#publisher" }],
      publisher: { "@id": SITE + "/#publisher" },
      mainEntityOfPage: url,
      image: SITE + "/og-image.png",
      inLanguage: "en",
      speakable: SPEAKABLE,
      ...(dataset ? { about: { "@id": url + "#dataset" } } : {}),
    },
    ...(dataset
      ? [{
          "@type": "Dataset",
          "@id": url + "#dataset",
          name: dataset.name,
          description: dataset.description,
          url,
          creator: { "@id": SITE + "/#publisher" },
          publisher: { "@id": SITE + "/#publisher" },
          dateModified,
          temporalCoverage: dataset.temporalCoverage,
          spatialCoverage: dataset.spatialCoverage,
          isBasedOn: dataset.isBasedOn,
          keywords: dataset.keywords,
        }]
      : []),
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": SITE + c.href, name: c.name } })),
    },
    ...extra,
    POTATOPEDIA_PUBLISHER,
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}

export function refMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: SITE + path },
    openGraph: { title: `${title} — Potatopedia`, description, type: "article", url: SITE + path, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: `${title} — Potatopedia`, description },
  };
}

function Table({ t }) {
  return (
    <div style={{ margin: "0 0 16px" }}>
      <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 10, background: "var(--card)" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 420 }}>
          <thead><tr>{t.headers.map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, k) => <td key={k} style={{ ...td, fontWeight: k === 0 ? 600 : 400, color: k === 0 ? "var(--ink)" : "var(--ink2)" }}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {t.note && <p style={{ fontSize: 12.5, color: "var(--mute2)", margin: "6px 2px 0", fontStyle: "italic" }}>{t.note}</p>}
    </div>
  );
}

export function Section({ s }) {
  return (
    <section id={s.id} style={{ scrollMarginTop: 80 }}>
      {s.h2 && <h2 style={h2s}>{s.h2}</h2>}
      {(s.p || []).map((p, i) => <p key={i} style={ps}>{p}</p>)}
      {s.list && <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>{s.list.map((x, i) => <li key={i} style={lis}>{x}</li>)}</ul>}
      {s.table && <Table t={s.table} />}
      {s.callout && (
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderLeft: "4px solid var(--gold)", borderRadius: 10, padding: "14px 16px", margin: "0 0 16px" }}>
          <p style={{ ...ps, margin: 0, fontSize: 14.5 }}>{s.callout}</p>
        </div>
      )}
      {(s.p2 || []).map((p, i) => <p key={"b" + i} style={ps}>{p}</p>)}
    </section>
  );
}

export function Related({ items, title = "Related on Potatopedia" }) {
  if (!items?.length) return null;
  return (
    <section style={{ margin: "40px 0 0" }}>
      <h2 style={h2s}>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
        {items.map((r) => (
          <Link key={r.href} href={r.href} style={{ display: "block", textDecoration: "none", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{r.title}</div>
            {r.desc && <div style={{ fontSize: 12.5, color: "var(--mute)", lineHeight: 1.5 }}>{r.desc}</div>}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Sources({ items }) {
  if (!items?.length) return null;
  return (
    <section style={{ margin: "36px 0 0" }}>
      <h2 style={h2s}>Sources</h2>
      <ul style={{ margin: 0, paddingLeft: 22 }}>
        {items.map((x, i) => (
          <li key={i} style={{ ...lis, fontSize: 14 }}>
            {x.url ? <a href={x.url} rel="noopener" style={{ color: "var(--gold)", fontWeight: 600, wordBreak: "break-word" }}>{x.label}</a> : x.label}
            {x.note ? <span style={{ color: "var(--mute)" }}> — {x.note}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function RefPage({ path, kicker, h1, lede, updatedLabel, updatedISO, crumbs, notice, sections, sources, related, jsonLd, children }) {
  return (
    <article style={{ background: "transparent", color: "var(--ink)", paddingBottom: 64 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "36px 0 28px" }}>
        <div style={wrap}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: "var(--mute)", marginBottom: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {crumbs.map((c, i) => (
              <span key={c.href}>
                {i < crumbs.length - 1 ? <Link href={c.href} style={{ color: "var(--mute)", textDecoration: "none" }}>{c.name}</Link> : <span style={{ color: "var(--ink2)" }}>{c.name}</span>}
                {i < crumbs.length - 1 && <span aria-hidden="true" style={{ marginLeft: 6 }}>/</span>}
              </span>
            ))}
          </nav>
          {kicker && <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>{kicker}</div>}
          <h1 style={{ fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 800, color: "var(--ink)", letterSpacing: -0.8, lineHeight: 1.12, margin: "0 0 14px" }}>{h1}</h1>
          <p data-summary="true" style={{ fontSize: 17, color: "var(--ink2)", lineHeight: 1.65, margin: "0 0 12px" }}>{lede}</p>
          {updatedLabel && <p style={{ fontSize: 12.5, color: "var(--mute2)", margin: 0 }}>Last updated: <time dateTime={updatedISO}>{updatedLabel}</time></p>}
        </div>
      </header>
      <div style={wrap}>
        {notice && (
          <div role="note" style={{ background: "var(--card)", border: "1px solid var(--line)", borderLeft: "4px solid var(--gold)", borderRadius: 10, padding: "12px 16px", margin: "22px 0 0" }}>
            <p style={{ ...ps, margin: 0, fontSize: 14 }}>{notice}</p>
          </div>
        )}
        {sections.map((s, i) => <Section key={i} s={s} />)}
        {children}
        <Sources items={sources} />
        <Related items={related} />
      </div>
    </article>
  );
}

export function Cards({ items, title }) {
  return (
    <section>
      {title && <h2 style={h2s}>{title}</h2>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, margin: "0 0 8px" }}>
        {items.map((c) => (
          <Link key={c.href} href={c.href} style={{ display: "block", textDecoration: "none", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{c.title}</div>
            {c.sub && <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--mute2)", marginBottom: 6 }}>{c.sub}</div>}
            <div style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.55 }}>{c.desc}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
