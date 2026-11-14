import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, bySlug, issueLabel, fmtDate, dayStr, issueHref, newsHref } from "@/lib/newsletters";
import { magazineIssue, magazineIssues, magHref, magTitleHref, magazineOf, magRef, magazineTitle } from "@/lib/magazine";
import { itemsByIds } from "@/lib/news-db";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import NewsletterSignup from "@/components/NewsletterSignup";
import MagazineFlipbook from "@/components/MagazineFlipbook";
import MagazineGate from "@/components/MagazineGate";
import { Crumbs, crumbsLd, JsonLd, TrustLine, LINK } from "@/components/NewsUI";
import { SERIF, MWRAP, MKICK, mbtn, SectionLabel, MagCard, magPeriodicalId, magIssueLd, magName } from "@/components/MagazineUI";
import { regionLabel } from "@/components/IssueView";

// /magazines/<newsletter>/issue-NN — the magazine edition's own home (14 Nov 2026): flipbook first, then title, contents,
// gated PDF, subscribe box and a link to the news issue (/issues/<nl>/<date>, which stays the news page; canonical each).
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

async function load(params) {
  const { newsletter, issue } = await params;
  return magazineIssue(newsletter, issue);
}

export async function generateMetadata({ params }) {
  const issue = await load(params);
  if (!issue) return { title: "Magazine not found", robots: { index: false } };
  const n = bySlug(issue.newsletter);
  const m = magazineOf(issue);
  const url = SITE + magHref(issue);
  const title = `${magName(n)} ${issueLabel(issue.issue_no)}: ${issue.subject}`;
  const description = `${magName(n)}, ${issueLabel(issue.issue_no)} (${fmtDate(dayStr(issue.issue_date))}): ${m.pages.length}-page digital edition. ${issue.preheader || ""}`.trim().slice(0, 158);
  const img = { url: SITE + m.pages[0].src, width: m.pages[0].w, height: m.pages[0].h, alt: `${magName(n)}, ${issueLabel(issue.issue_no)}, front cover` };
  return {
    title: title.length > 64 ? title.slice(0, 61).trimEnd() + "…" : title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, images: [img] },
    twitter: { card: "summary_large_image", title, description, images: [img.url] },
  };
}

export default async function MagazineIssuePage({ params }) {
  const issue = await load(params);
  if (!issue) notFound();
  const n = bySlug(issue.newsletter);
  const m = magazineOf(issue);
  const ids = [issue.lead_item_id, ...(Array.isArray(issue.item_ids) ? issue.item_ids : [])].filter((x) => x !== null && x !== undefined);
  const [items, all] = await Promise.all([itemsByIds(ids), magazineIssues(n.slug)]);
  const more = all.filter((i) => String(i.id) !== String(issue.id)).slice(0, 4);
  const url = SITE + magHref(issue);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Magazines", href: "/magazines" }, { name: n.name, href: magTitleHref(n.slug) }, { name: issueLabel(issue.issue_no), href: magHref(issue) }];
  const live = process.env.REPORT_GATE_LIVE === "true" && !!process.env.REPORT_LINK_SECRET;
  const title = magazineTitle(issue);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...magIssueLd(issue),
        description: issue.intro || issue.preheader || undefined,
        inLanguage: "en",
        isAccessibleForFree: true,
        exampleOfWork: { "@id": SITE + issueHref(issue) + "#issue" },
        hasPart: items.filter((i) => i.status === "published" && i.pub_year).map((i) => ({ "@type": "NewsArticle", "@id": SITE + newsHref(i) + "#article", url: SITE + newsHref(i), headline: i.headline })),
      },
      { "@type": "Periodical", "@id": magPeriodicalId(n.slug), name: magName(n), url: SITE + magTitleHref(n.slug), publisher: { "@id": SITE + "/#publisher" } },
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };

  return (
    <div style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <section aria-labelledby="mag-h" style={{ background: "var(--paper)", borderBottom: `5px solid ${n.accent}`, padding: "24px 0 30px" }}>
        <div style={MWRAP}>
          <Crumbs items={crumbs} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 14px" }}>
            <h1 id="mag-h" style={{ margin: 0, fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, fontFamily: SERIF, fontWeight: 400, color: "var(--ink)" }}>
              {magName(n)} <span style={{ color: "var(--mute)" }}>· {issueLabel(issue.issue_no)}</span>
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "var(--mute)" }}>{fmtDate(dayStr(issue.issue_date))} · {m.pages.length} pages · tap, swipe or use the arrow keys</p>
          </div>
        </div>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 8px" }}>
          <MagazineFlipbook pages={m.pages} title={title} />
        </div>
      </section>

      <div style={{ ...MWRAP, paddingTop: 48 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "36px 48px", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <p style={{ ...MKICK, color: n.accent, margin: "0 0 10px" }}>In this edition</p>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.6vw, 40px)", lineHeight: 1.12, color: "var(--ink)" }}>{issue.subject}</h2>
            {issue.intro && <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: "var(--ink2)" }}>{issue.intro}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
              <Link href={issueHref(issue)} style={mbtn("var(--ink)", "var(--bg)")}>Read this issue as news, with sources <span aria-hidden="true">→</span></Link>
            </div>

            {items.length > 0 && (
              <section aria-labelledby="toc-h" style={{ marginTop: 40 }}>
                <SectionLabel id="toc-h" accent={n.accent}>Contents</SectionLabel>
                <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {items.map((it, i) => {
                    const href = it.status === "published" && it.pub_year ? newsHref(it) : null;
                    return (
                      <li key={it.id} style={{ display: "flex", gap: 14, alignItems: "baseline", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                        <span style={{ fontFamily: SERIF, fontSize: 17, color: n.accent, flex: "none", width: 26 }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ minWidth: 0 }}>
                          {href ? <Link href={href} style={{ fontSize: 16, lineHeight: 1.4, color: "var(--ink)", textDecoration: "none", fontWeight: i === 0 ? 600 : 500 }}>{it.headline}</Link> : <span style={{ fontSize: 16, color: "var(--ink)" }}>{it.headline}</span>}
                          <span style={{ display: "block", marginTop: 3, fontSize: 12.5, color: "var(--mute2)" }}>{[i === 0 ? "Lead story" : null, regionLabel(it.region)].filter(Boolean).join(" · ")}</span>
                        </span>
                      </li>
                    );
                  })}
                  {issue.number_of_week?.value && (
                    <li style={{ display: "flex", gap: 14, alignItems: "baseline", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                      <span style={{ fontFamily: SERIF, fontSize: 17, color: n.accent, flex: "none", width: 26 }}>#</span>
                      <span style={{ fontSize: 16, color: "var(--ink2)" }}>Number of the week, data box, spotlight and events</span>
                    </li>
                  )}
                </ol>
              </section>
            )}
          </div>

          <div style={{ flex: "1 1 360px", minWidth: 0, display: "grid", gap: 20 }}>
            {m.pdf?.file && (
              <div id="pdf" style={{ scrollMarginTop: 90 }}>
                <MagazineGate magRef={magRef(issue)} title={title} pages={m.pdf.pages || m.pages.length} mb={m.pdf.bytes ? (m.pdf.bytes / 1048576).toFixed(1) : null} newsletter={n.slug} newsletterName={n.name} live={live} />
              </div>
            )}
            <div id="subscribe" style={{ scrollMarginTop: 90 }}>
              <NewsletterSignup single defaults={[n.slug]} title={`Get ${n.name} by email`} intro="Each new issue and its magazine edition. Free." source={`magazines/${n.slug}/issue-${String(issue.issue_no).padStart(2, "0")}`} />
            </div>
          </div>
        </div>

        {more.length > 0 && (
          <section aria-labelledby="more-h" style={{ marginTop: 64 }}>
            <SectionLabel id="more-h" accent={n.accent} right={<Link href={magTitleHref(n.slug)} style={{ ...LINK, fontSize: 13.5 }}>All {n.name} editions →</Link>}>More editions</SectionLabel>
            <ul style={{ margin: 0, padding: 0, display: "grid", gap: "32px 22px", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))" }}>
              {more.map((i) => <MagCard key={i.id} issue={i} />)}
            </ul>
          </section>
        )}

        <footer style={{ marginTop: 48, borderTop: "1px solid var(--line)", paddingTop: 18, display: "grid", gap: 8 }}>
          <TrustLine />
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--mute)" }}>
            <Link href={magTitleHref(n.slug)} style={{ color: "var(--gold)" }}>{magName(n)}</Link> · <Link href="/magazines" style={{ color: "var(--gold)" }}>All magazines</Link> · <Link href={issueHref(issue)} style={{ color: "var(--gold)" }}>News version of this issue</Link> · <Link href="/advertise" style={{ color: "var(--gold)" }}>Advertise</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
