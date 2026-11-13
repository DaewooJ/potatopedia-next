import Link from "next/link";
import { NEWSLETTERS, bySlug, masthead, newsHref, fmtDate, TRUST_LINE } from "@/lib/newsletters";
import { latestNews } from "@/lib/news-db";

// Shared pieces for the newsletter, news and hub pages (13 Nov 2026). Server components; inline styles only.

export const WRAP = { maxWidth: 860, margin: "0 auto", padding: "0 16px", boxSizing: "border-box" };
export const H1 = { fontSize: "clamp(30px, 6.4vw, 46px)", lineHeight: 1.1, letterSpacing: -0.6, fontWeight: 400, fontFamily: "var(--hp-serif), Georgia, serif", color: "var(--ink)", margin: "0 0 14px" };
export const H2 = { fontSize: "clamp(22px, 4.6vw, 28px)", lineHeight: 1.2, fontWeight: 400, fontFamily: "var(--hp-serif), Georgia, serif", color: "var(--ink)", margin: "40px 0 12px" };
export const P = { fontSize: 16.5, lineHeight: 1.7, color: "var(--ink2)", margin: "0 0 14px" };
export const KICK = { fontSize: 11.5, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 10px" };
export const CARD = { background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 18px" };
export const LINK = { color: "var(--gold)", fontWeight: 600, textDecoration: "none" };

export function Crumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: "var(--mute)", marginBottom: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((c, i) => (
        <span key={c.href}>
          {i < items.length - 1 ? <Link href={c.href} style={{ color: "var(--mute)", textDecoration: "none" }}>{c.name}</Link> : <span style={{ color: "var(--ink2)" }}>{c.name}</span>}
          {i < items.length - 1 && <span aria-hidden="true" style={{ marginLeft: 6 }}>/</span>}
        </span>
      ))}
    </nav>
  );
}

export const crumbsLd = (items, site = "https://www.potatopedia.com") => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": site + c.href, name: c.name } })),
});

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

// "<Title> · by Potatopedia" with the title's accent.
export function Masthead({ n, size = "md", as = "p" }) {
  const Tag = as;
  const big = size === "lg";
  return (
    <Tag style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span aria-hidden="true" style={{ width: big ? 14 : 10, height: big ? 14 : 10, borderRadius: 3, background: n.accent, flex: "none" }} />
      <span style={{ fontSize: big ? 15 : 12.5, fontWeight: 700, letterSpacing: ".04em", color: "var(--ink)" }}>{masthead(n)}</span>
    </Tag>
  );
}

export function TitleTag({ slug }) {
  const n = bySlug(slug);
  if (!n) return null;
  return (
    <Link href={`/newsletters/${n.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink2)", textDecoration: "none", border: `1px solid ${n.accent}`, borderRadius: 999, padding: "3px 10px" }}>
      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: 99, background: n.accent }} />
      {n.short}
    </Link>
  );
}

export function TrustLine({ style }) {
  return (
    <p style={{ margin: "0", fontSize: 13.5, color: "var(--mute)", lineHeight: 1.5, ...style }}>
      <strong style={{ color: "var(--ink2)" }}>{TRUST_LINE}</strong>{" "}
      <Link href="/editorial-standards" style={{ color: "var(--gold)" }}>Our editorial standards</Link>
    </p>
  );
}

export function NewsList({ items, showTag = true }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}>
      {items.map((it) => (
        <li key={it.id} style={{ borderTop: "1px solid var(--line)", padding: "14px 0" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
            <time dateTime={new Date(it.published_at).toISOString()} style={{ fontSize: 12.5, color: "var(--mute2)" }}>{fmtDate(it.published_at)}</time>
            {showTag && <TitleTag slug={it.newsletter} />}
          </div>
          <Link href={newsHref(it)} style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35, color: "var(--ink)", textDecoration: "none" }}>{it.headline}</Link>
          {it.summary && <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--mute)" }}>{it.summary}</p>}
        </li>
      ))}
    </ul>
  );
}

// "Latest" box on hubs: the last 5 related /news items. Fresh content on the ranking page.
export async function LatestNews({ hub = null, newsletter = null, title, limit = 5, dated = false }) {
  const items = await latestNews({ hub, newsletter, limit });
  const n = newsletter ? bySlug(newsletter) : NEWSLETTERS.find((x) => x.hub === hub);
  const head = title || (n ? `Latest from ${n.name}` : "Latest potato news");
  const asOf = items[0]?.published_at ? fmtDate(items[0].published_at) : null;
  return (
    <section aria-label={head} style={{ ...CARD, margin: "28px 0", borderLeft: `4px solid ${n ? n.accent : "var(--gold)"}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
        <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.25, fontWeight: 700, color: "var(--ink)" }}>{head}</h2>
        {dated && <span style={{ fontSize: 12.5, color: "var(--mute2)" }}>{asOf ? `Updated ${asOf}` : `As of ${fmtDate(new Date())}`}</span>}
      </div>
      {items.length ? (
        <NewsList items={items} showTag={!newsletter} />
      ) : (
        <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--mute)" }}>
          {n ? `${n.name} publishes its first stories here soon. ` : "The first stories are published here soon. "}
          Each story gets its own page with the primary source linked.
        </p>
      )}
      <p style={{ margin: "12px 0 0", fontSize: 14 }}>
        <Link href="/news" style={LINK}>All potato news →</Link>
        {n && <> · <Link href={`/newsletters/${n.slug}`} style={LINK}>About {n.name}</Link></>}
      </p>
    </section>
  );
}

// A labelled, unsold sponsor place (house rule: never a class name with ad-/banner/sponsor; always says Sponsored).
export function OpenSlot({ label = "Sponsored", title, text, href = "/advertise#newsletters" }) {
  return (
    <aside aria-label={`${label}: ${title}`} style={{ margin: "24px 0", border: "1px dashed var(--dash)", borderRadius: 14, padding: "16px 18px", background: "var(--paper)" }}>
      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--mute2)" }}>{label} · available</p>
      <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{title}</p>
      <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.55, color: "var(--mute)" }}>{text}</p>
      <Link href={href} style={{ ...LINK, fontSize: 14 }}>How this place works →</Link>
    </aside>
  );
}
