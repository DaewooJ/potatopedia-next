import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, NEWSLETTERS, bySlug, newsHref, fmtDate } from "@/lib/newsletters";
import { newsItem, allPublishedNews } from "@/lib/news-db";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import { authorBySlug, authorPerson, authorHref, authorId, AUTHORS } from "@/lib/authors-registry";
import { TITLE_HUBS } from "@/lib/newsletter-pages";
import { COUNTRIES } from "@/lib/data";
import { VARIETIES } from "@/lib/varieties-data";
import SafeMarkdown from "@/components/SafeMarkdown";
import NewsletterSignup from "@/components/NewsletterSignup";
import { WRAP, H2, P, CARD, LINK, Crumbs, crumbsLd, JsonLd, TitleTag, TrustLine } from "@/components/NewsUI";

// /news/<yyyy>/<mm>/<slug> — one page per published news item (its own canonical). Built on demand with ISR and
// revalidated on publish by /api/newsletters/publish; builds fine with an empty table.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const rows = await allPublishedNews();
  return rows
    .filter((r) => r.pub_year && r.pub_month)
    .map((r) => ({ year: String(r.pub_year), month: String(r.pub_month).padStart(2, "0"), slug: r.slug }));
}

const iso = (d) => (d ? new Date(d).toISOString() : undefined);
const arr = (v) => (Array.isArray(v) ? v : []);
const internal = (href) => typeof href === "string" && /^\/(?!\/)/.test(href);
const httpUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);

async function load(params) {
  const { year, month, slug } = await params;
  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month)) return null;
  return newsItem(year, month, slug);
}

export async function generateMetadata({ params }) {
  const it = await load(params);
  if (!it) return { title: "Story not found", robots: { index: false } };
  const url = SITE + newsHref(it);
  const description = String(it.summary || "").replace(/\s+/g, " ").slice(0, 158);
  const img = it.image?.src
    ? { url: it.image.src.startsWith("http") ? it.image.src : SITE + it.image.src, width: 1200, height: 675, alt: it.image.alt || it.headline }
    : SITE + "/og-image.png";
  return {
    title: it.headline.length > 62 ? it.headline.slice(0, 59).trimEnd() + "…" : it.headline,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: it.headline, description, images: [img], publishedTime: iso(it.published_at), modifiedTime: iso(it.updated_at) },
    twitter: { card: "summary_large_image", title: it.headline, description, images: [typeof img === "string" ? img : img.url] },
  };
}

export default async function NewsItemPage({ params }) {
  const it = await load(params);
  if (!it) notFound();
  const n = bySlug(it.newsletter) || NEWSLETTERS[0];
  const author = authorBySlug(it.author_slug) || AUTHORS[0];
  const url = SITE + newsHref(it);
  const hub = NEWSLETTERS.find((x) => x.hub === it.hub) || n;
  const keyNumbers = arr(it.key_numbers);
  const sources = arr(it.sources).filter((s) => httpUrl(s?.url));
  const related = arr(it.related).filter((r) => internal(r?.href));
  const evergreen = related.length ? related : TITLE_HUBS[n.slug].map((h) => ({ href: h.href, label: h.label }));
  const countries = arr(it.countries).map((s) => COUNTRIES.find((c) => c.slug === s)).filter(Boolean);
  const varieties = arr(it.varieties).map((s) => VARIETIES.find((v) => v.slug === s)).filter(Boolean);
  const corrections = arr(it.corrections);
  const quote = it.quote && it.quote.text ? it.quote : null;
  const updated = it.updated_at && it.published_at && new Date(it.updated_at) - new Date(it.published_at) > 3600_000 ? it.updated_at : null;
  const crumbs = [{ name: "Home", href: "/" }, { name: "News", href: "/news" }, { name: it.headline.length > 48 ? it.headline.slice(0, 46) + "…" : it.headline, href: newsHref(it) }];
  const img = it.image?.src ? (it.image.src.startsWith("http") ? it.image.src : SITE + it.image.src) : SITE + "/og-image.png";

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": url + "#article",
        headline: it.headline.slice(0, 110),
        description: it.summary,
        datePublished: iso(it.published_at),
        dateModified: iso(it.updated_at || it.published_at),
        author: { "@id": authorId(author) },
        publisher: { "@id": SITE + "/#publisher" },
        mainEntityOfPage: url,
        url,
        image: [img],
        isAccessibleForFree: true,
        inLanguage: "en",
        articleSection: n.name,
        isPartOf: { "@id": `${SITE}/newsletters/${n.slug}#periodical` },
        ...(arr(it.tags).length ? { keywords: arr(it.tags).join(", ") } : {}),
        ...(sources.length ? { citation: sources.map((s) => s.url) } : {}),
        ...(countries.length ? { contentLocation: countries.map((c) => ({ "@type": "Country", name: c.name })) } : {}),
      },
      authorPerson(author),
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };

  return (
    <article style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: `4px solid ${n.accent}`, padding: "32px 0 26px" }}>
        <div style={WRAP}>
          <Crumbs items={crumbs} />
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
            <TitleTag slug={n.slug} />
            {it.region && <span style={{ fontSize: 12.5, color: "var(--mute2)", textTransform: "capitalize" }}>{String(it.region).replace(/-/g, " ")}</span>}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 42px)", lineHeight: 1.15, letterSpacing: -0.5, fontWeight: 400, fontFamily: "var(--hp-serif), Georgia, serif", color: "var(--ink)", margin: "0 0 14px" }}>{it.headline}</h1>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--mute)", lineHeight: 1.6 }}>
            By <Link href={authorHref(author)} style={{ color: "var(--ink2)", fontWeight: 600 }}>{author.name}</Link>
            {" · "}<time dateTime={iso(it.published_at)}>{fmtDate(it.published_at)}</time>
            {updated && <> · Updated <time dateTime={iso(updated)}>{fmtDate(updated)}</time></>}
          </p>
        </div>
      </header>

      <div style={WRAP}>
        <p data-summary="true" style={{ fontSize: 19, lineHeight: 1.65, color: "var(--ink)", margin: "26px 0 18px", fontWeight: 400 }}>{it.summary}</p>

        {it.image?.src && (
          <figure style={{ margin: "0 0 22px" }}>
            <img src={it.image.src} alt={it.image.alt || ""} width={1200} height={675} style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }} />
            {/* House rule: Adobe Stock licence / own photo = no credit line (credit stored empty); CC and public-domain credits print. */}
            {it.image.credit && <figcaption style={{ fontSize: 12, color: "var(--mute2)", marginTop: 6 }}>{it.image.credit}</figcaption>}
          </figure>
        )}

        {it.why_it_matters && (
          <section aria-labelledby="why-h" style={{ ...CARD, borderLeft: `4px solid ${n.accent}`, margin: "0 0 10px" }}>
            <h2 id="why-h" style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Why it matters</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: "var(--ink2)" }}>{it.why_it_matters}</p>
          </section>
        )}

        <div style={{ marginTop: 18 }}><SafeMarkdown md={it.body_md} /></div>

        {quote && (
          <figure style={{ margin: "8px 0 22px", padding: "4px 0 4px 16px", borderLeft: `3px solid ${n.accent}` }}>
            <blockquote style={{ margin: 0, fontSize: 17.5, lineHeight: 1.6, fontStyle: "italic", color: "var(--ink)" }}>&ldquo;{quote.text}&rdquo;</blockquote>
            <figcaption style={{ marginTop: 6, fontSize: 13.5, color: "var(--mute)" }}>
              {[quote.who, quote.role].filter(Boolean).join(", ")}
              {httpUrl(quote.source_url) && <> · <a href={quote.source_url} rel="noopener" style={{ color: "var(--gold)" }}>source</a></>}
            </figcaption>
          </figure>
        )}

        {keyNumbers.length > 0 && (
          <section aria-labelledby="nums-h">
            <h2 id="nums-h" style={H2}>Key numbers</h2>
            <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 10, background: "var(--card)" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 320 }}>
                <thead>
                  <tr>{["Figure", "Value", "Date", "Source"].map((h) => <th key={h} scope="col" style={{ textAlign: "left", padding: "9px 12px", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--mute2)", borderBottom: "1px solid var(--line2)", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {keyNumbers.map((k, i) => (
                    <tr key={i}>
                      <td style={{ padding: "9px 12px", fontSize: 14.5, borderBottom: "1px solid var(--line)", color: "var(--ink)", fontWeight: 600 }}>{k.label}</td>
                      <td style={{ padding: "9px 12px", fontSize: 14.5, borderBottom: "1px solid var(--line)", color: "var(--ink2)", whiteSpace: "nowrap" }}>{[k.value, k.unit].filter((x) => x !== undefined && x !== null && x !== "").join(" ")}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13.5, borderBottom: "1px solid var(--line)", color: "var(--mute)", whiteSpace: "nowrap" }}>{k.date || "–"}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13.5, borderBottom: "1px solid var(--line)" }}>{httpUrl(k.source_url) ? <a href={k.source_url} rel="noopener" style={{ color: "var(--gold)", fontWeight: 600 }}>Source</a> : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {sources.length > 0 && (
          <section aria-labelledby="src-h">
            <h2 id="src-h" style={H2}>Sources</h2>
            <ul style={{ margin: 0, paddingLeft: 22 }}>
              {sources.map((s, i) => (
                <li key={i} style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink2)", marginBottom: 6 }}>
                  <a href={s.url} rel="noopener" style={{ color: "var(--gold)", fontWeight: 600, wordBreak: "break-word" }}>{s.title || s.url}</a>
                  {s.publisher && <span style={{ color: "var(--mute)" }}> · {s.publisher}</span>}
                  {s.type && <span style={{ color: "var(--mute2)", fontSize: 13 }}> ({s.type === "company" ? "company announcement" : "primary source"})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="rel-h">
          <h2 id="rel-h" style={H2}>Background on Potatopedia</h2>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))" }}>
            {[{ href: hub.hubHref, label: `Hub: ${hub.hub === "processing" ? "potato processing" : hub.hub === "seed-field" ? "seed potatoes" : "potato prices"}` }, ...evergreen.filter((e) => e.href !== hub.hubHref)]
              .concat(countries.map((c) => ({ href: `/country/${c.slug}`, label: `${c.name}: country profile` })))
              .concat(varieties.map((v) => ({ href: `/varieties/${v.slug}`, label: `${v.name}: variety profile` })))
              .slice(0, 8)
              .map((r) => (
                <Link key={r.href} href={r.href} style={{ ...CARD, padding: "12px 14px", fontSize: 14.5, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>{r.label} →</Link>
              ))}
          </div>
        </section>

        <section aria-label="Subscribe" style={{ marginTop: 32 }}>
          <NewsletterSignup compact defaults={[n.slug]} title={`Get ${n.name}`} intro={`This story ran in ${n.name}. Free, ${n.cadence}; one email to confirm.`} />
        </section>

        <footer style={{ marginTop: 28, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Corrections</h2>
          {corrections.length ? (
            <ul style={{ margin: "0 0 10px", paddingLeft: 20 }}>
              {corrections.map((c, i) => <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink2)" }}><strong>{c.date ? fmtDate(c.date) : ""}</strong>{c.date ? ": " : ""}{c.text}</li>)}
            </ul>
          ) : (
            <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--mute)" }}>No corrections to this story.</p>
          )}
          <p style={{ margin: "0 0 10px", fontSize: 13.5, color: "var(--mute)" }}>Seen an error? <Link href="/contact" style={{ color: "var(--gold)" }}>Tell us</Link>; corrections are noted here with their date.</p>
          <TrustLine />
        </footer>
      </div>
    </article>
  );
}
