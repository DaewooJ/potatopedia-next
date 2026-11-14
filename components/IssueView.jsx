import Link from "next/link";
import { SITE, bySlug, newsHref, issueHref, issueLabel, fmtDate, masthead, dayStr } from "@/lib/newsletters";
import { itemsByIds } from "@/lib/news-db";
import { periodicalId } from "@/lib/newsletter-pages";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import NewsletterSignup from "@/components/NewsletterSignup";
import { magazineOf, magRef, magHref } from "@/lib/magazine";
import { LINK, Crumbs, crumbsLd, JsonLd, TrustLine } from "@/components/NewsUI";

// The web version of one issue (13 Nov 2026; redesigned 14 Nov 2026 as an editorial page: masthead hero with the cover,
// contents, lead feature with stat tiles + data panel, Number of the week block, story card grid, spotlight, event date
// cards, magazine teaser → /magazines/<nl>/issue-NN, sources footer). Used by /issues/<slug>/<date> (published) and
// /issues/preview/<id> (any status incl. dry runs, token-gated). Items link to their /news pages once published.
// Sponsor slots are labelled and carry rel="sponsored". Class names: none (inline styles only; never ad-/banner/sponsor).

const arr = (v) => (Array.isArray(v) ? v : []);
const httpUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const dateStr = dayStr;
const SERIF = "var(--hp-serif), Georgia, serif";
export const WIDE = { maxWidth: 1180, margin: "0 auto", padding: "0 16px", boxSizing: "border-box" };
export const KICKER = { margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" };
// .pp h1/h2 are forced serif 400 (!important) in lib/theme.js; small-caps section labels set their own font on a span.
const SANS = { fontFamily: "var(--hp-sans), system-ui, sans-serif", fontWeight: 700, letterSpacing: ".14em" };
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return "source"; } };
const SECTION_H = { ...KICKER, color: "var(--mute2)", display: "flex", alignItems: "center", gap: 12 };

const REGIONS = { "north-america": "North America", "latin-america": "Latin America", "south-america": "South America", europe: "Europe", asia: "Asia", africa: "Africa", oceania: "Oceania", "middle-east": "Middle East", global: "Global" };
export const regionLabel = (r) => (r ? REGIONS[r] || String(r).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : null);

// Cover (netweb bin/nl-cover.mjs → /media/<key>.jpg): 1200x630 og + 1200x1200 square, absolute for schema.
const absUrl = (p) => (typeof p === "string" && p ? (p.startsWith("http") ? p : SITE + p) : null);
const coverImages = (issue) => [issue.cover?.og, issue.cover?.sq].map(absUrl).filter(Boolean);

// A key number as shown: "30%" or value + unit line. Facts unchanged, only typeset.
const PCT = /^(%|percent|per cent)$/i;
export function kn(k) {
  const v = String(k?.value ?? "").trim();
  const u = String(k?.unit ?? "").trim();
  if (PCT.test(u)) return { value: `${v}%`, unit: "" };
  if (u === "USD" && /^[\d.,]+$/.test(v)) return { value: `$${v}`, unit: "" };
  return { value: v, unit: u };
}

export function issueJsonLd(issue, items) {
  const n = bySlug(issue.newsletter);
  const url = SITE + issueHref(issue);
  const mag = magazineOf(issue);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Newsletters", href: "/newsletters" }, { name: n.name, href: `/newsletters/${n.slug}` }, { name: issueLabel(issue.issue_no), href: issueHref(issue) }];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PublicationIssue",
        "@id": url + "#issue",
        name: issue.subject,
        issueNumber: String(issue.issue_no),
        datePublished: dateStr(issue.issue_date),
        url,
        description: issue.preheader || issue.intro || undefined,
        ...(coverImages(issue).length ? { image: coverImages(issue) } : {}),
        isAccessibleForFree: true,
        inLanguage: "en",
        publisher: { "@id": SITE + "/#publisher" },
        isPartOf: { "@id": periodicalId(n.slug) },
        ...(mag ? { workExample: { "@id": SITE + magHref(issue) + "#magazine" } } : {}),
        hasPart: items.filter((i) => i.status === "published" && i.pub_year).map((i) => ({ "@type": "NewsArticle", "@id": SITE + newsHref(i) + "#article", url: SITE + newsHref(i), headline: i.headline })),
      },
      { "@type": "Periodical", "@id": periodicalId(n.slug), name: n.name, alternateName: masthead(n), url: `${SITE}/newsletters/${n.slug}`, publisher: { "@id": SITE + "/#publisher" } },
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };
}

function Sponsor({ s, n }) {
  const label = s.label === "Launch partner" ? "Launch partner" : "Sponsored";
  return (
    <aside aria-label={label} style={{ margin: "26px 0", border: "1px solid var(--line2)", borderRadius: 14, padding: "16px 18px", background: "var(--paper)", borderLeft: `4px solid ${n.accent}` }}>
      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--mute2)" }}>{label}{s.sponsor ? ` · ${s.sponsor}` : ""}</p>
      {s.logo && <img src={s.logo} alt={s.sponsor ? `${s.sponsor} logo` : ""} style={{ maxHeight: 36, width: "auto", display: "block", margin: "0 0 8px" }} />}
      {s.text && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink2)" }}>{s.text}</p>}
      {httpUrl(s.url) && <p style={{ margin: "8px 0 0", fontSize: 14 }}><a href={s.url} rel="sponsored noopener" style={LINK}>{s.sponsor ? `Visit ${s.sponsor}` : "Learn more"} →</a></p>}
    </aside>
  );
}

function SectionHead({ id, children, n, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 20px", flexWrap: "wrap" }}>
      <h2 id={id} style={{ ...SECTION_H, margin: 0, fontFamily: "inherit" }}>
        <span aria-hidden="true" style={{ width: 22, height: 3, background: n.accent, borderRadius: 2, flex: "none" }} />
        <span style={SANS}>{children}</span>
      </h2>
      <span aria-hidden="true" style={{ flex: "1 1 40px", height: 1, background: "var(--line)" }} />
      {right}
    </div>
  );
}

export function RegionChip({ region, n, light = false }) {
  const r = regionLabel(region);
  if (!r) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: light ? "#fff" : "var(--ink2)", background: light ? "rgba(0,0,0,.35)" : "var(--paper)", border: light ? "none" : "1px solid var(--line)", borderRadius: 999, padding: "4px 10px" }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 99, background: light ? "#fff" : n.accent }} />
      {r}
    </span>
  );
}

function StatTile({ k, n, big = false }) {
  const { value, unit } = kn(k);
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderTop: `3px solid ${n.accent}`, borderRadius: 12, padding: big ? "16px 16px 14px" : "12px 14px", minWidth: 0 }}>
      <p style={{ margin: 0, fontFamily: SERIF, fontSize: big ? "clamp(28px, 3.4vw, 36px)" : 26, lineHeight: 1.05, color: "var(--ink)", fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>{value}</p>
      {unit && <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--mute)", lineHeight: 1.35 }}>{unit}</p>}
      {k.label && <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "var(--ink2)", lineHeight: 1.45 }}>{k.label}</p>}
    </div>
  );
}

function DataPanel({ box, n }) {
  return (
    <section aria-labelledby="box-h" style={{ background: "var(--panel)", color: "var(--panel-ink)", borderRadius: 16, padding: "20px 20px 16px", border: "1px solid var(--panel-line)" }}>
      <p style={{ ...KICKER, color: "var(--panel-gold)", margin: "0 0 6px" }}>Data box</p>
      <h3 id="box-h" style={{ margin: "0 0 12px", fontFamily: SERIF, fontWeight: 400, fontSize: 20, lineHeight: 1.3, color: "var(--panel-ink)" }}>{box.title || "Key figures"}</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {box.rows.map((r, i) => (
            <tr key={i}>
              <th scope="row" style={{ textAlign: "left", fontWeight: 400, padding: "10px 12px 10px 0", borderTop: "1px solid var(--panel-line)", fontSize: 14, color: "var(--panel-mute)", lineHeight: 1.4 }}>{r.label}</th>
              <td style={{ padding: "10px 0", borderTop: "1px solid var(--panel-line)", fontSize: 15, color: "var(--panel-ink)", fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--panel-mute)" }}>{box.date ? `${box.date} · ` : ""}{httpUrl(box.source_url) ? <a href={box.source_url} rel="noopener" style={{ color: "var(--panel-gold)" }}>Source</a> : null}</p>
    </section>
  );
}

function storyLink(it) {
  return it.status === "published" && it.pub_year ? newsHref(it) : null;
}

function Lead({ it, n, preview, box }) {
  const href = storyLink(it);
  const kns = arr(it.key_numbers).slice(0, 4);
  const head = <span style={{ color: "var(--ink)" }}>{it.headline}</span>;
  return (
    <section id={`story-${it.id}`} aria-labelledby="lead-h" style={{ scrollMarginTop: 90 }}>
      <SectionHead id="lead-h" n={n}>Lead story</SectionHead>
      {it.image?.src && (
        <figure style={{ margin: "0 0 26px", position: "relative" }}>
          <img src={it.image.src} alt={it.image.alt || ""} style={{ width: "100%", height: "clamp(220px, 32vw, 420px)", objectFit: "cover", borderRadius: 18, display: "block" }} />
          <span style={{ position: "absolute", left: 16, top: 16 }}><RegionChip region={it.region} n={n} light /></span>
          {it.image.credit && <figcaption style={{ fontSize: 12, color: "var(--mute2)", marginTop: 8 }}>{it.image.credit}</figcaption>}
        </figure>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "28px 40px", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 520px", minWidth: 0 }}>
          {!it.image?.src && <p style={{ margin: "0 0 12px" }}><RegionChip region={it.region} n={n} /></p>}
          <h3 style={{ margin: "0 0 14px", fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4.2vw, 44px)", lineHeight: 1.1, letterSpacing: "-.01em" }}>
            {href ? <Link href={href} style={{ textDecoration: "none" }}>{head}</Link> : head}
          </h3>
          {preview && !href && <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "var(--mute2)", textTransform: "uppercase", letterSpacing: ".1em" }}>{it.status} · page made on publish</p>}
          <p style={{ margin: 0, fontSize: "clamp(17px, 1.6vw, 19px)", lineHeight: 1.65, color: "var(--ink2)" }}>{it.summary}</p>
          {it.why_it_matters && (
            <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "var(--paper)", borderRadius: 12, borderLeft: `4px solid ${n.accent}` }}>
              <p style={{ ...KICKER, fontSize: 11, color: n.accent, margin: "0 0 6px" }}>Why it matters</p>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "var(--ink2)" }}>{it.why_it_matters}</p>
            </div>
          )}
          {it.quote?.text && (
            <blockquote style={{ margin: "22px 0 0", padding: 0 }}>
              <p style={{ margin: 0, fontFamily: SERIF, fontSize: 22, lineHeight: 1.4, color: "var(--ink)" }}>“{it.quote.text}”</p>
              {it.quote.who && <footer style={{ marginTop: 8, fontSize: 13.5, color: "var(--mute)" }}>{it.quote.who}{it.quote.role ? `, ${it.quote.role}` : ""}</footer>}
            </blockquote>
          )}
          {href && (
            <p style={{ margin: "22px 0 0" }}>
              <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "var(--bg)", textDecoration: "none", fontWeight: 600, fontSize: 15, padding: "12px 20px", borderRadius: 999 }}>Read the full story and sources <span aria-hidden="true">→</span></Link>
            </p>
          )}
        </div>
        <div style={{ flex: "1 1 320px", minWidth: 0, display: "grid", gap: 16 }}>
          {kns.length > 0 && (
            <div>
              <p style={{ ...KICKER, fontSize: 11, color: "var(--mute2)", margin: "0 0 10px" }}>Key numbers</p>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))" }}>
                {kns.map((k, i) => <StatTile key={i} k={k} n={n} big />)}
              </div>
            </div>
          )}
          {box && <DataPanel box={box} n={n} />}
        </div>
      </div>
    </section>
  );
}

function NumberOfWeek({ nw, n }) {
  const chart = nw.chart && arr(nw.chart.labels).length && arr(nw.chart.values).length ? nw.chart : null;
  const vals = chart ? chart.values.map(Number).filter((v) => Number.isFinite(v)) : [];
  const max = vals.length ? Math.max(...vals.map(Math.abs)) || 1 : 1;
  const { value, unit } = kn(nw);
  return (
    <section aria-labelledby="nw-h" style={{ background: n.accent, color: "#fff", margin: "64px 0", padding: "clamp(36px, 6vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", right: "-6%", top: "-30%", width: "46%", aspectRatio: "1", borderRadius: "50%", background: "rgba(255,255,255,.07)" }} />
      <div style={{ ...WIDE, position: "relative", display: "flex", flexWrap: "wrap", gap: "18px 48px", alignItems: "center" }}>
        <div style={{ flex: "0 1 auto" }}>
          <h2 id="nw-h" style={{ ...KICKER, color: "rgba(255,255,255,.85)", margin: "0 0 6px", fontFamily: "inherit" }}><span style={SANS}>Number of the week</span></h2>
          <p style={{ margin: 0, fontFamily: SERIF, fontSize: "clamp(88px, 17vw, 190px)", lineHeight: 0.92, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>
            {value}{unit ? <span style={{ fontSize: "clamp(20px, 3vw, 30px)", marginLeft: 10, letterSpacing: 0 }}>{unit}</span> : null}
          </p>
        </div>
        <div style={{ flex: "1 1 340px", minWidth: 0 }}>
          {nw.label && <p style={{ margin: 0, fontFamily: SERIF, fontSize: "clamp(21px, 2.4vw, 28px)", lineHeight: 1.35 }}>{nw.label}</p>}
          {chart && (
            <div role="img" aria-label={`Bar chart: ${chart.labels.map((l, i) => `${l} ${chart.values[i]}`).join(", ")}`} style={{ marginTop: 18, display: "grid", gap: 8 }}>
              {chart.labels.map((l, i) => {
                const v = Number(chart.values[i]);
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(70px, 30%) 1fr auto", gap: 10, alignItems: "center", fontSize: 13.5 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l}</span>
                    <span style={{ height: 12, borderRadius: 4, background: "#fff", width: `${Math.max(2, (Math.abs(v) / max) * 100)}%` }} />
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{chart.values[i]}</span>
                  </div>
                );
              })}
            </div>
          )}
          <p style={{ margin: "16px 0 0", fontSize: 13.5, color: "rgba(255,255,255,.88)" }}>
            {nw.date ? `${nw.date} · ` : ""}{httpUrl(nw.source_url) ? <a href={nw.source_url} rel="noopener" style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: 3 }}>Source</a> : "Source pending"}
          </p>
        </div>
      </div>
    </section>
  );
}

// Story cards in two tiers: "top" cards (2 per row, a 200px visual = the item photo, or a typographic stat panel when
// there is no photo, so rows line up) and compact cards (3 per row; a photo becomes a small thumbnail). Editorial order kept.
function StatPanel({ k, n }) {
  const t = kn(k);
  return (
    <div style={{ height: "clamp(150px, 16vw, 200px)", background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "22px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative", overflow: "hidden" }}>
      <span aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: n.accent }} />
      <span style={{ fontFamily: SERIF, fontSize: "clamp(46px, 6vw, 68px)", lineHeight: 0.95, color: n.accent, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>{t.value}</span>
      <span style={{ marginTop: 10, fontSize: 13, lineHeight: 1.4, color: "var(--ink2)" }}>{t.unit ? <span style={{ color: "var(--mute)" }}>{t.unit} · </span> : null}{k.label}</span>
    </div>
  );
}

function StoryCard({ it, n, idx, preview, top = false }) {
  const href = storyLink(it);
  const first = arr(it.key_numbers)[0];
  const t = first ? kn(first) : null;
  const img = it.image?.src ? it.image : null;
  const head = <span style={{ color: "var(--ink)" }}>{it.headline}</span>;
  const panel = top && !img && first;
  const stripe = !top || (!img && !first);
  return (
    <article id={`story-${it.id}`} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", scrollMarginTop: 90, minWidth: 0 }}>
      {top && img && (
        <div style={{ position: "relative", height: "clamp(150px, 16vw, 200px)" }}>
          <img src={img.src} alt={img.alt || ""} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          {img.credit && <span style={{ position: "absolute", right: 8, bottom: 6, fontSize: 10.5, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>{img.credit}</span>}
        </div>
      )}
      {panel && <StatPanel k={first} n={n} />}
      {stripe && <div aria-hidden="true" style={{ height: 4, background: n.accent, flex: "none" }} />}
      <div style={{ padding: top ? "20px 24px 22px" : "18px 20px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <RegionChip region={it.region} n={n} />
          <span style={{ fontFamily: SERIF, fontSize: 15, color: "var(--mute3)" }}>{String(idx).padStart(2, "0")}</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: top ? "clamp(22px, 2.2vw, 26px)" : 21, lineHeight: 1.22, flex: 1, minWidth: 0 }}>
            {href ? <Link href={href} style={{ textDecoration: "none" }}>{head}</Link> : head}
          </h3>
          {!top && img && <img src={img.src} alt={img.alt || ""} title={img.credit || undefined} loading="lazy" width={76} height={76} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 10, flex: "none" }} />}
        </div>
        {preview && !href && <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "var(--mute2)", textTransform: "uppercase", letterSpacing: ".1em" }}>{it.status} · page made on publish</p>}
        {it.summary && <p style={{ margin: 0, fontSize: top ? 15.5 : 14.5, lineHeight: 1.6, color: "var(--mute)", display: "-webkit-box", WebkitLineClamp: top ? 4 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{it.summary}</p>}
        {t && !panel && (
          <div style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "12px 0 0", borderTop: "1px solid var(--line)", marginTop: "auto" }}>
            <span style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1, color: n.accent, fontVariantNumeric: "tabular-nums", flex: "none", maxWidth: "55%", overflowWrap: "anywhere" }}>{t.value}</span>
            <span style={{ fontSize: 12.5, lineHeight: 1.4, color: "var(--ink2)", minWidth: 0 }}>{t.unit ? <span style={{ color: "var(--mute)" }}>{t.unit} · </span> : null}{first.label}</span>
          </div>
        )}
        {it.why_it_matters && (
          <details style={{ fontSize: 14, color: "var(--ink2)", marginTop: t && !panel ? 0 : "auto", borderTop: t && !panel ? "none" : "1px solid var(--line)", paddingTop: t && !panel ? 0 : 12 }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--ink2)", fontSize: 13.5 }}>Why it matters</summary>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6, color: "var(--mute)" }}>{it.why_it_matters}</p>
          </details>
        )}
        {href && <p style={{ margin: 0, fontSize: 14 }}><Link href={href} style={LINK}>Read the story and sources →</Link></p>}
      </div>
    </article>
  );
}

// How many stories go in the top tier (2 per row) so the 3-per-row tier below has no orphan when possible.
function topCount(len) {
  if (len <= 3) return 0;
  for (const k of [2, 4]) if ((len - k) % 3 === 0) return k;
  return 2;
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function EventCard({ e, n }) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(e.start || ""));
  const place = [e.city, e.country].filter(Boolean).join(", ");
  const name = httpUrl(e.url) ? <a href={e.url} rel="noopener" style={{ color: "var(--ink)", textDecoration: "none" }}>{e.name}</a> : e.name;
  return (
    <li style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 14, minWidth: 0 }}>
      {m && (
        <span aria-hidden="true" style={{ flex: "none", width: 58, textAlign: "center", borderRadius: 10, overflow: "hidden", border: "1px solid var(--line)" }}>
          <span style={{ display: "block", background: n.accent, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 0" }}>{MON[Number(m[2]) - 1]}</span>
          <span style={{ display: "block", fontFamily: SERIF, fontSize: 26, lineHeight: 1.3, color: "var(--ink)", background: "var(--paper)" }}>{Number(m[3])}</span>
        </span>
      )}
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{name}</span>
        <span style={{ display: "block", fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{[e.dates, place].filter(Boolean).join(" · ")}</span>
      </span>
    </li>
  );
}

const btn = (bg, fg, border) => ({ display: "inline-flex", alignItems: "center", gap: 8, background: bg, color: fg, border: border || "none", textDecoration: "none", fontWeight: 600, fontSize: 15, padding: "12px 20px", borderRadius: 999 });

export default async function IssueView({ issue, preview = false }) {
  const n = bySlug(issue.newsletter);
  const ids = [issue.lead_item_id, ...arr(issue.item_ids)].filter((x) => x !== null && x !== undefined);
  const items = await itemsByIds(ids);
  const lead = issue.lead_item_id ? items.find((i) => String(i.id) === String(issue.lead_item_id)) : null;
  const rest = items.filter((i) => !lead || i.id !== lead.id);
  const slots = arr(issue.sponsor_slots);
  const presenting = slots.filter((s) => s.slot === "presenting");
  const classified = slots.filter((s) => s.slot !== "presenting");
  const topN = topCount(rest.length);
  const box = issue.data_box && arr(issue.data_box.rows).length ? issue.data_box : null;
  const boxInLead = box && lead && (box.item_id == null || String(box.item_id) === String(lead.id));
  const spot = issue.spotlight;
  const events = arr(issue.events);
  const mag = magazineOf(issue);
  const magLink = mag && !preview ? magHref(issue) : null;
  const cover = issue.cover?.sq || issue.cover?.og || null;
  const coverAlt = `${masthead(n)}, ${issue.dry_run ? "dry run" : issueLabel(issue.issue_no)} cover${lead ? `: ${lead.headline}` : ""}`;
  const regionsCovered = [...new Set(items.map((i) => regionLabel(i.region)).filter(Boolean))];
  const credits = [issue.cover?.credit, ...items.map((i) => i.image?.credit)].filter(Boolean);
  const sourceList = items.map((it) => ({ it, src: arr(it.sources).filter((s) => httpUrl(s.url)) })).filter((x) => x.src.length);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Newsletters", href: "/newsletters" }, { name: n.name, href: `/newsletters/${n.slug}` }, { name: issueLabel(issue.issue_no), href: preview ? `/issues/preview/${issue.id}` : issueHref(issue) }];

  return (
    <article style={{ paddingBottom: 72 }}>
      {!preview && <JsonLd data={issueJsonLd(issue, items)} />}
      {preview && (
        <div role="note" style={{ background: issue.dry_run ? "#7A1F1F" : "#16140F", color: "#fff", padding: "10px 16px", textAlign: "center", fontSize: 14, fontWeight: 600, letterSpacing: ".04em" }}>
          {issue.dry_run ? "DRY RUN · " : ""}PREVIEW · status: {issue.status} · not public, not indexed{issue.dry_run ? " · never published or sent" : ""}
        </div>
      )}

      {/* Masthead hero */}
      <header style={{ background: "var(--paper)", borderBottom: `5px solid ${n.accent}`, padding: "28px 0 44px", position: "relative", overflow: "hidden" }}>
        <div style={WIDE}>
          <Crumbs items={crumbs} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "30px 56px", alignItems: "center", marginTop: 8 }}>
            <div style={{ flex: "1 1 500px", minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: ".04em", color: "var(--ink)", lineHeight: 1.4 }}>
                <span aria-hidden="true" style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: n.accent, marginRight: 10, verticalAlign: "-1px" }} />
                {masthead(n)}
              </p>
              <p style={{ margin: "16px 0 18px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <span style={{ background: n.accent, color: "#fff", fontSize: 12.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 999 }}>{issueLabel(issue.issue_no)}</span>
                <time dateTime={dateStr(issue.issue_date)} style={{ fontSize: 14, color: "var(--ink2)", fontWeight: 500 }}>{fmtDate(dateStr(issue.issue_date))}</time>
                <span style={{ fontSize: 14, color: "var(--mute)" }}>{items.length} {items.length === 1 ? "story" : "stories"}{regionsCovered.length ? ` from ${regionsCovered.length} ${regionsCovered.length === 1 ? "region" : "regions"}` : ""}</span>
              </p>
              <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", lineHeight: 1.05, letterSpacing: "-.02em", fontWeight: 400, fontFamily: SERIF, color: "var(--ink)", margin: "0 0 18px" }}>{issue.subject}</h1>
              {issue.intro && <p data-summary="true" style={{ margin: 0, fontSize: "clamp(17px, 1.7vw, 20px)", lineHeight: 1.6, color: "var(--ink2)", maxWidth: 640 }}>{issue.intro}</p>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                <a href="#subscribe" style={btn("#C62828", "#fff")}>Subscribe free</a>
                {magLink && <Link href={magLink} style={btn("transparent", "var(--ink)", "1.5px solid var(--ink)")}>Read the magazine edition <span aria-hidden="true">→</span></Link>}
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--mute)" }}>{n.cadenceLabel} · free · {n.reader}</p>
            </div>
            {cover && (
              <figure style={{ flex: "0 1 420px", margin: "0 auto", minWidth: 0, maxWidth: "min(100%, 420px)" }}>
                <img src={cover} alt={coverAlt} width={1200} height={issue.cover?.sq ? 1200 : 630} style={{ width: "100%", height: "auto", display: "block", borderRadius: 14, boxShadow: "0 30px 60px -28px rgba(22,20,15,.55), 0 0 0 1px rgba(0,0,0,.05)", transform: "rotate(-1.2deg)" }} />
                {issue.cover?.credit && <figcaption style={{ fontSize: 12, color: "var(--mute2)", marginTop: 10 }}>{issue.cover.credit}</figcaption>}
              </figure>
            )}
          </div>
        </div>
      </header>

      {/* Contents */}
      {items.length > 1 && (
        <nav aria-labelledby="toc-h" style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
          <div style={{ ...WIDE, padding: "26px 16px 28px" }}>
            <h2 id="toc-h" style={{ ...SECTION_H, margin: "0 0 14px", fontFamily: "inherit" }}><span style={SANS}>In this issue</span></h2>
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "4px 32px", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))" }}>
              {[lead, ...rest].filter(Boolean).map((it, i) => (
                <li key={it.id} style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "8px 0", borderTop: "1px solid var(--line)" }}>
                  <span style={{ fontFamily: SERIF, fontSize: 15, color: n.accent, flex: "none", width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
                  <a href={`#story-${it.id}`} style={{ fontSize: 14.5, lineHeight: 1.4, color: "var(--ink2)", textDecoration: "none" }}>{it.headline}</a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      <div style={{ ...WIDE, paddingTop: 48 }}>
        {presenting.map((s, i) => <Sponsor key={`p${i}`} s={s} n={n} />)}
        {lead && <Lead it={lead} n={n} preview={preview} box={boxInLead ? box : null} />}
      </div>

      {issue.number_of_week && <NumberOfWeek nw={issue.number_of_week} n={n} />}

      <div style={{ ...WIDE, paddingTop: issue.number_of_week ? 0 : 56 }}>
        {rest.length > 0 && (
          <section aria-labelledby="news-h">
            <SectionHead id="news-h" n={n} right={<span style={{ fontSize: 13, color: "var(--mute)" }}>{rest.length} more {rest.length === 1 ? "story" : "stories"}</span>}>More in this issue</SectionHead>
            {topN > 0 && (
              <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))", marginBottom: 20 }}>
                {rest.slice(0, topN).map((it, i) => <StoryCard key={it.id} it={it} n={n} idx={i + 2} preview={preview} top />)}
              </div>
            )}
            {classified.map((s, i) => <Sponsor key={`c${i}`} s={s} n={n} />)}
            {rest.length > topN && (
              <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))" }}>
                {rest.slice(topN).map((it, i) => <StoryCard key={it.id} it={it} n={n} idx={topN + i + 2} preview={preview} />)}
              </div>
            )}
          </section>
        )}
        {!rest.length && classified.map((s, i) => <Sponsor key={`c${i}`} s={s} n={n} />)}

        {box && !boxInLead && <div style={{ marginTop: 40, maxWidth: 640 }}><DataPanel box={box} n={n} /></div>}

        {((spot && spot.name) || events.length > 0) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px 40px", marginTop: 64, alignItems: "flex-start" }}>
            {spot && spot.name && (
              <section aria-labelledby="spot-h" style={{ flex: "1 1 360px", minWidth: 0 }}>
                <SectionHead id="spot-h" n={n}>Spotlight</SectionHead>
                <div style={{ background: "var(--paper)", borderRadius: 18, padding: "24px 24px 22px", border: "1px solid var(--line)" }}>
                  <p style={{ ...KICKER, fontSize: 11, color: n.accent, margin: "0 0 10px" }}>{spot.kind === "company" ? "Company spotlight" : "Expert spotlight"} · chosen by the editors, not paid</p>
                  <p style={{ margin: "0 0 4px", fontFamily: SERIF, fontSize: 28, lineHeight: 1.15, color: "var(--ink)" }}>{spot.name}</p>
                  {(spot.role || (spot.org && spot.org !== spot.name)) && <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--mute)" }}>{[spot.role, spot.org !== spot.name ? spot.org : null].filter(Boolean).join(", ")}</p>}
                  {spot.text && <p style={{ margin: "10px 0 0", fontSize: 16, lineHeight: 1.65, color: "var(--ink2)" }}>{spot.text}</p>}
                  {spot.href && (/^\//.test(spot.href) ? <p style={{ margin: "14px 0 0", fontSize: 14 }}><Link href={spot.href} style={LINK}>More →</Link></p> : httpUrl(spot.href) ? <p style={{ margin: "14px 0 0", fontSize: 14 }}><a href={spot.href} rel="noopener" style={LINK}>More →</a></p> : null)}
                </div>
              </section>
            )}
            {events.length > 0 && (
              <section aria-labelledby="ev-h" style={{ flex: "1.3 1 420px", minWidth: 0 }}>
                <SectionHead id="ev-h" n={n} right={<Link href="/events" style={{ ...LINK, fontSize: 13.5 }}>All potato events →</Link>}>Coming up</SectionHead>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 250px), 1fr))" }}>
                  {events.map((e, i) => <EventCard key={i} e={e} n={n} />)}
                </ul>
              </section>
            )}
          </div>
        )}

        {issue.journal?.href && /^\//.test(issue.journal.href) && (
          <section aria-labelledby="jr-h" style={{ margin: "40px 0 0" }}>
            <h2 id="jr-h" style={{ ...SECTION_H, margin: "0 0 8px", fontFamily: "inherit" }}><span style={SANS}>From the Journal</span></h2>
            <Link href={issue.journal.href} style={{ ...LINK, fontSize: 18 }}>{issue.journal.title} →</Link>
          </section>
        )}
      </div>

      {/* Magazine teaser: the flipbook and PDF live on the magazine page. id="magazine" keeps old #magazine links landing here. */}
      {mag && (
        <section id="magazine" aria-labelledby="mag-h" style={{ background: "var(--panel)", color: "var(--panel-ink)", margin: "72px 0 0", padding: "clamp(36px, 6vw, 60px) 0", scrollMarginTop: 80 }}>
          <div style={{ ...WIDE, display: "flex", flexWrap: "wrap", gap: "28px 56px", alignItems: "center" }}>
            <div style={{ flex: "0 1 300px", minWidth: 0, display: "flex", justifyContent: "center" }}>
              {magLink ? (
                <Link href={magLink} aria-label={`Open the ${issueLabel(issue.issue_no)} magazine edition`} style={{ display: "block", width: "min(100%, 280px)" }}>
                  <img src={mag.pages[0].src} alt={`${n.name} magazine, ${issueLabel(issue.issue_no)}, front cover`} width={mag.pages[0].w} height={mag.pages[0].h} loading="lazy" style={{ width: "100%", height: "auto", display: "block", borderRadius: 4, boxShadow: "0 30px 60px -20px rgba(0,0,0,.7)", transform: "rotate(2deg)" }} />
                </Link>
              ) : (
                <img src={mag.pages[0].src} alt={`${n.name} magazine, ${issueLabel(issue.issue_no)}, front cover`} width={mag.pages[0].w} height={mag.pages[0].h} loading="lazy" style={{ width: "min(100%, 280px)", height: "auto", display: "block", borderRadius: 4 }} />
              )}
            </div>
            <div style={{ flex: "1 1 420px", minWidth: 0 }}>
              <p style={{ ...KICKER, color: "var(--panel-gold)", margin: "0 0 10px" }}>Magazine edition</p>
              <h2 id="mag-h" style={{ margin: "0 0 12px", fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1, color: "var(--panel-ink)" }}>Flip through the {mag.pages.length}-page magazine edition</h2>
              <p style={{ margin: "0 0 22px", fontSize: 16.5, lineHeight: 1.6, color: "var(--panel-mute)", maxWidth: 560 }}>This issue, laid out as a magazine: turn the pages on screen, or get the PDF by email to read offline and share with your team.</p>
              {magLink && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <Link href={magLink} style={btn("#C62828", "#fff")}>Open the magazine <span aria-hidden="true">→</span></Link>
                  {mag.pdf?.file && <Link href={`${magLink}#pdf`} style={btn("transparent", "var(--panel-ink)", "1.5px solid var(--panel-line)")}>Get the PDF</Link>}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <div style={WIDE}>
        <section id="subscribe" aria-label="Subscribe" style={{ margin: "56px auto 0", maxWidth: 760, scrollMarginTop: 90 }}>
          <NewsletterSignup compact defaults={[n.slug]} title={`Get ${n.name} by email`} intro="Free. One email to confirm; one-click unsubscribe in every issue." source={preview ? "" : magRef(issue)} />
        </section>

        <footer style={{ marginTop: 56, borderTop: "1px solid var(--line)", paddingTop: 22, display: "grid", gap: 14 }}>
          {sourceList.length > 0 && (
            <details>
              <summary style={{ cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "var(--ink2)" }}>Sources in this issue ({sourceList.reduce((a, x) => a + x.src.length, 0)} links)</summary>
              <ol style={{ margin: "14px 0 0", paddingLeft: 20, display: "grid", gap: 10, columns: "auto" }}>
                {sourceList.map(({ it, src }) => (
                  <li key={it.id} style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--ink2)" }}>
                    <span style={{ fontWeight: 600 }}>{it.headline}</span>
                    <span style={{ display: "block", color: "var(--mute)" }}>
                      {src.map((s, i) => (
                        <span key={i}>{i > 0 ? " · " : ""}<a href={s.url} rel="noopener" style={{ color: "var(--gold)" }}>{s.title || host(s.url)}</a></span>
                      ))}
                    </span>
                  </li>
                ))}
              </ol>
            </details>
          )}
          {credits.length > 0 && <p style={{ margin: 0, fontSize: 12.5, color: "var(--mute2)" }}>Image credits: {[...new Set(credits)].join(" · ")}</p>}
          <TrustLine />
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--mute)" }}>
            <Link href={`/newsletters/${n.slug}`} style={{ color: "var(--gold)" }}>All {n.name} issues</Link>
            {mag && <> · <Link href={`/magazines/${n.slug}`} style={{ color: "var(--gold)" }}>{n.name} magazine editions</Link></>}
            {" · "}<Link href="/advertise#newsletters" style={{ color: "var(--gold)" }}>Sponsor this newsletter</Link> · <Link href="/contribute" style={{ color: "var(--gold)" }}>Write for us</Link>
          </p>
        </footer>
      </div>
    </article>
  );
}
