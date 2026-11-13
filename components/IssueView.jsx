import Link from "next/link";
import { SITE, bySlug, newsHref, issueHref, issueLabel, fmtDate, masthead, dayStr } from "@/lib/newsletters";
import { itemsByIds } from "@/lib/news-db";
import { periodicalId } from "@/lib/newsletter-pages";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import NewsletterSignup from "@/components/NewsletterSignup";
import { WRAP, H2, CARD, LINK, Crumbs, crumbsLd, JsonLd, Masthead, TrustLine } from "@/components/NewsUI";

// The web version of one issue (13 Nov 2026). Used by /issues/<slug>/<date> (published) and /issues/preview/<id>
// (any status incl. dry runs, token-gated). Items link to their /news pages once published; in a preview, items that
// are not published yet show without a link. Sponsor slots are labelled and carry rel="sponsored".

const arr = (v) => (Array.isArray(v) ? v : []);
const httpUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const dateStr = dayStr;

export function issueJsonLd(issue, items) {
  const n = bySlug(issue.newsletter);
  const url = SITE + issueHref(issue);
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
        isAccessibleForFree: true,
        inLanguage: "en",
        publisher: { "@id": SITE + "/#publisher" },
        isPartOf: { "@id": periodicalId(n.slug) },
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
  const body = (
    <>
      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--mute2)" }}>{label}{s.sponsor ? ` · ${s.sponsor}` : ""}</p>
      {s.logo && <img src={s.logo} alt={s.sponsor ? `${s.sponsor} logo` : ""} style={{ maxHeight: 36, width: "auto", display: "block", margin: "0 0 8px" }} />}
      {s.text && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink2)" }}>{s.text}</p>}
    </>
  );
  return (
    <aside aria-label={label} style={{ margin: "18px 0", border: "1px solid var(--line2)", borderRadius: 12, padding: "14px 16px", background: "var(--paper)", borderLeft: `4px solid ${n.accent}` }}>
      {body}
      {httpUrl(s.url) && <p style={{ margin: "8px 0 0", fontSize: 14 }}><a href={s.url} rel="sponsored noopener" style={LINK}>{s.sponsor ? `Visit ${s.sponsor}` : "Learn more"} →</a></p>}
    </aside>
  );
}

function Item({ it, lead = false, preview }) {
  const linked = it.status === "published" && it.pub_year;
  const head = (
    <span style={{ fontSize: lead ? 24 : 18, lineHeight: 1.3, fontWeight: lead ? 400 : 600, fontFamily: lead ? "var(--hp-serif), Georgia, serif" : "inherit", color: "var(--ink)" }}>{it.headline}</span>
  );
  return (
    <div style={{ borderTop: "1px solid var(--line)", padding: lead ? "18px 0" : "14px 0" }}>
      {linked ? <Link href={newsHref(it)} style={{ textDecoration: "none" }}>{head}</Link> : head}
      {preview && !linked && <span style={{ display: "inline-block", marginLeft: 8, fontSize: 11, fontWeight: 700, color: "var(--mute2)", textTransform: "uppercase", letterSpacing: ".1em" }}>{it.status} · page made on publish</span>}
      <p style={{ margin: "6px 0 0", fontSize: lead ? 16.5 : 15, lineHeight: 1.6, color: "var(--ink2)" }}>{it.summary}</p>
      {it.why_it_matters && <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--mute)" }}><strong style={{ color: "var(--ink2)" }}>Why it matters:</strong> {it.why_it_matters}</p>}
      {linked && <p style={{ margin: "6px 0 0", fontSize: 14 }}><Link href={newsHref(it)} style={LINK}>Read the story and sources →</Link></p>}
    </div>
  );
}

function NumberOfWeek({ nw, n }) {
  const chart = nw.chart && arr(nw.chart.labels).length && arr(nw.chart.values).length ? nw.chart : null;
  const vals = chart ? chart.values.map(Number).filter((v) => Number.isFinite(v)) : [];
  const max = vals.length ? Math.max(...vals.map(Math.abs)) || 1 : 1;
  return (
    <section aria-labelledby="nw-h" style={{ ...CARD, margin: "22px 0", borderTop: `4px solid ${n.accent}` }}>
      <h2 id="nw-h" style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--mute2)" }}>Number of the week</h2>
      <p style={{ margin: "0 0 4px", fontFamily: "var(--hp-serif), Georgia, serif", fontSize: 44, lineHeight: 1, color: "var(--ink)" }}>{nw.value}{nw.unit ? <span style={{ fontSize: 18, marginLeft: 6, color: "var(--mute)" }}>{nw.unit}</span> : null}</p>
      {nw.label && <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.55, color: "var(--ink2)" }}>{nw.label}</p>}
      {chart && (
        <div role="img" aria-label={`Bar chart: ${chart.labels.map((l, i) => `${l} ${chart.values[i]}`).join(", ")}`} style={{ marginTop: 14, display: "grid", gap: 6 }}>
          {chart.labels.map((l, i) => {
            const v = Number(chart.values[i]);
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(70px, 30%) 1fr auto", gap: 8, alignItems: "center", fontSize: 13 }}>
                <span style={{ color: "var(--ink2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l}</span>
                <span style={{ height: 12, borderRadius: 4, background: n.accent, width: `${Math.max(2, (Math.abs(v) / max) * 100)}%` }} />
                <span style={{ color: "var(--mute)", fontVariantNumeric: "tabular-nums" }}>{chart.values[i]}</span>
              </div>
            );
          })}
        </div>
      )}
      <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--mute2)" }}>
        {nw.date ? `${nw.date} · ` : ""}{httpUrl(nw.source_url) ? <a href={nw.source_url} rel="noopener" style={{ color: "var(--gold)" }}>Source</a> : "Source pending"}
      </p>
    </section>
  );
}

export default async function IssueView({ issue, preview = false }) {
  const n = bySlug(issue.newsletter);
  const ids = [issue.lead_item_id, ...arr(issue.item_ids)].filter((x) => x !== null && x !== undefined);
  const items = await itemsByIds(ids);
  const lead = issue.lead_item_id ? items.find((i) => String(i.id) === String(issue.lead_item_id)) : null;
  const rest = items.filter((i) => !lead || i.id !== lead.id);
  const slots = arr(issue.sponsor_slots);
  const presenting = slots.filter((s) => s.slot === "presenting");
  const classified = slots.filter((s) => s.slot !== "presenting");
  const mid = Math.ceil(rest.length / 2);
  const box = issue.data_box;
  const spot = issue.spotlight;
  const events = arr(issue.events);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Newsletters", href: "/newsletters" }, { name: n.name, href: `/newsletters/${n.slug}` }, { name: issueLabel(issue.issue_no), href: preview ? `/issues/preview/${issue.id}` : issueHref(issue) }];

  return (
    <article style={{ paddingBottom: 72 }}>
      {!preview && <JsonLd data={issueJsonLd(issue, items)} />}
      {preview && (
        <div role="note" style={{ background: issue.dry_run ? "#7A1F1F" : "#16140F", color: "#fff", padding: "10px 16px", textAlign: "center", fontSize: 14, fontWeight: 600, letterSpacing: ".04em" }}>
          {issue.dry_run ? "DRY RUN · " : ""}PREVIEW · status: {issue.status} · not public, not indexed{issue.dry_run ? " · never published or sent" : ""}
        </div>
      )}
      <header style={{ background: "var(--paper)", borderBottom: `4px solid ${n.accent}`, padding: "30px 0 24px" }}>
        <div style={WRAP}>
          <Crumbs items={crumbs} />
          <Masthead n={n} size="lg" />
          <p style={{ margin: "10px 0 8px", fontSize: 13, color: "var(--mute)" }}>{issueLabel(issue.issue_no)} · <time dateTime={dateStr(issue.issue_date)}>{fmtDate(dateStr(issue.issue_date))}</time></p>
          <h1 style={{ fontSize: "clamp(26px, 5.6vw, 40px)", lineHeight: 1.15, fontWeight: 400, fontFamily: "var(--hp-serif), Georgia, serif", color: "var(--ink)", margin: "0 0 10px" }}>{issue.subject}</h1>
          {issue.intro && <p data-summary="true" style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: "var(--ink2)" }}>{issue.intro}</p>}
        </div>
      </header>

      <div style={WRAP}>
        {issue.cover?.og && (
          <figure style={{ margin: "22px 0 0" }}>
            <img src={issue.cover.og} alt={`${n.name} ${issueLabel(issue.issue_no)} cover`} style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }} />
            {issue.cover.credit && <figcaption style={{ fontSize: 12, color: "var(--mute2)", marginTop: 6 }}>{issue.cover.credit}</figcaption>}
          </figure>
        )}

        {presenting.map((s, i) => <Sponsor key={`p${i}`} s={s} n={n} />)}

        {lead && (
          <section aria-labelledby="lead-h">
            <h2 id="lead-h" style={{ ...H2, fontSize: 14, fontFamily: "inherit", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--mute2)", margin: "28px 0 0" }}>Lead story</h2>
            <Item it={lead} lead preview={preview} />
          </section>
        )}

        {issue.number_of_week && <NumberOfWeek nw={issue.number_of_week} n={n} />}

        {rest.length > 0 && (
          <section aria-labelledby="news-h">
            <h2 id="news-h" style={{ ...H2, fontSize: 14, fontFamily: "inherit", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--mute2)", margin: "28px 0 0" }}>In this issue</h2>
            {rest.slice(0, mid).map((it) => <Item key={it.id} it={it} preview={preview} />)}
            {classified.map((s, i) => <Sponsor key={`c${i}`} s={s} n={n} />)}
            {rest.slice(mid).map((it) => <Item key={it.id} it={it} preview={preview} />)}
          </section>
        )}
        {!rest.length && classified.map((s, i) => <Sponsor key={`c${i}`} s={s} n={n} />)}

        {box && arr(box.rows).length > 0 && (
          <section aria-labelledby="box-h" style={{ ...CARD, margin: "22px 0" }}>
            <h2 id="box-h" style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>{box.title || "Data box"}</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  {box.rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: "8px 10px 8px 0", borderBottom: "1px solid var(--line)", fontSize: 14.5, color: "var(--ink2)" }}>{r.label}</td>
                      <td style={{ padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 14.5, color: "var(--ink)", fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "var(--mute2)" }}>{box.date ? `${box.date} · ` : ""}{httpUrl(box.source_url) ? <a href={box.source_url} rel="noopener" style={{ color: "var(--gold)" }}>Source</a> : null}</p>
          </section>
        )}

        {spot && spot.name && (
          <section aria-labelledby="spot-h" style={{ ...CARD, margin: "22px 0" }}>
            <h2 id="spot-h" style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--mute2)" }}>{spot.kind === "company" ? "Company spotlight" : "Expert spotlight"} · not paid</h2>
            <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{spot.name}</p>
            {(spot.role || spot.org) && <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "var(--mute)" }}>{[spot.role, spot.org].filter(Boolean).join(", ")}</p>}
            {spot.text && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink2)" }}>{spot.text}</p>}
            {spot.href && (/^\//.test(spot.href) ? <p style={{ margin: "8px 0 0", fontSize: 14 }}><Link href={spot.href} style={LINK}>More →</Link></p> : httpUrl(spot.href) ? <p style={{ margin: "8px 0 0", fontSize: 14 }}><a href={spot.href} rel="noopener" style={LINK}>More →</a></p> : null)}
          </section>
        )}

        {events.length > 0 && (
          <section aria-labelledby="ev-h">
            <h2 id="ev-h" style={{ ...H2, fontSize: 22 }}>Events</h2>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {events.map((e, i) => (
                <li key={i} style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink2)", marginBottom: 4 }}>
                  {httpUrl(e.url) ? <a href={e.url} rel="noopener" style={{ color: "var(--gold)", fontWeight: 600 }}>{e.name}</a> : <strong>{e.name}</strong>}
                  {[e.dates, [e.city, e.country].filter(Boolean).join(", ")].filter(Boolean).length ? ` · ${[e.dates, [e.city, e.country].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}` : ""}
                </li>
              ))}
            </ul>
            <p style={{ margin: "8px 0 0", fontSize: 14 }}><Link href="/events" style={LINK}>All potato events →</Link></p>
          </section>
        )}

        {issue.journal?.href && (
          <section aria-labelledby="jr-h" style={{ margin: "22px 0" }}>
            <h2 id="jr-h" style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--mute2)" }}>From the Journal</h2>
            {/^\//.test(issue.journal.href) ? <Link href={issue.journal.href} style={{ ...LINK, fontSize: 17 }}>{issue.journal.title} →</Link> : null}
          </section>
        )}

        <section aria-label="Subscribe" style={{ marginTop: 30 }}>
          <NewsletterSignup compact defaults={[n.slug]} title={`Get ${n.name} by email`} intro="Free. One email to confirm; one-click unsubscribe in every issue." />
        </section>

        <footer style={{ marginTop: 26, borderTop: "1px solid var(--line)", paddingTop: 14, display: "grid", gap: 8 }}>
          <TrustLine />
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--mute)" }}>
            <Link href={`/newsletters/${n.slug}`} style={{ color: "var(--gold)" }}>All {n.name} issues</Link> · <Link href="/advertise#newsletters" style={{ color: "var(--gold)" }}>Sponsor this newsletter</Link> · <Link href="/contribute" style={{ color: "var(--gold)" }}>Write for us</Link>
          </p>
        </footer>
      </div>
    </article>
  );
}
