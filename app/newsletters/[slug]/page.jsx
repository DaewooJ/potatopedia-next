import Link from "next/link";
import { notFound } from "next/navigation";
import { NEWSLETTERS, SITE, bySlug, masthead, issueHref, issueLabel, fmtDate, dayStr } from "@/lib/newsletters";
import { FIRST_ISSUE_PLANNED, ISSUE_PARTS, TITLE_HUBS, periodicalId } from "@/lib/newsletter-pages";
import { issuesFor, latestNews } from "@/lib/news-db";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import NewsletterSignup from "@/components/NewsletterSignup";
import { WRAP, H1, H2, P, KICK, CARD, LINK, Crumbs, crumbsLd, JsonLd, Masthead, TrustLine, NewsList } from "@/components/NewsUI";

// /newsletters/<slug> — one page per title: about, who it is for, sample issue, archive, signup, sponsor link.
export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return NEWSLETTERS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }) {
  const n = bySlug((await params).slug);
  if (!n) return {};
  const title = `${n.name}: Free Potato Newsletter`;
  const description = `${n.name} by Potatopedia (${n.cadenceLabel}): ${n.covers.slice(0, 3).join(", ")}. Free, global, primary sources linked.`.slice(0, 158);
  const url = `${SITE}/newsletters/${n.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${masthead(n)}`, description, type: "website", url, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: masthead(n), description },
  };
}

export default async function TitlePage({ params }) {
  const n = bySlug((await params).slug);
  if (!n) notFound();
  const [issues, recent] = await Promise.all([issuesFor(n.slug, 50), latestNews({ newsletter: n.slug, limit: 5 })]);
  const latest = issues[0] || null;
  const planned = FIRST_ISSUE_PLANNED[n.slug];
  const url = `${SITE}/newsletters/${n.slug}`;
  const crumbs = [{ name: "Home", href: "/" }, { name: "Newsletters", href: "/newsletters" }, { name: n.name, href: `/newsletters/${n.slug}` }];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Periodical",
        "@id": periodicalId(n.slug),
        name: n.name,
        alternateName: masthead(n),
        url,
        description: `${n.cadenceLabel}. For ${n.reader}`,
        about: n.covers,
        publisher: { "@id": SITE + "/#publisher" },
        inLanguage: "en",
        isAccessibleForFree: true,
        ...(issues.length
          ? { hasPart: issues.slice(0, 20).map((i) => ({ "@type": "PublicationIssue", "@id": SITE + issueHref(i) + "#issue", issueNumber: String(i.issue_no), datePublished: dayStr(i.issue_date), url: SITE + issueHref(i) })) }
          : {}),
      },
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };

  return (
    <article style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: `4px solid ${n.accent}`, padding: "36px 0 30px" }}>
        <div style={WRAP}>
          <Crumbs items={crumbs} />
          <div style={{ marginBottom: 14 }}><Masthead n={n} size="lg" /></div>
          <h1 style={H1}>{n.name}</h1>
          <p data-summary="true" style={{ ...P, fontSize: 18 }}>
            A free {n.cadence} potato industry newsletter from Potatopedia, sent {n.cadenceLabel.charAt(0).toLowerCase() + n.cadenceLabel.slice(1)}. It covers {n.covers.map((c) => c.charAt(0).toLowerCase() + c.slice(1)).join("; ")}, worldwide, with the primary source linked for every story.
          </p>
          <p style={{ margin: "0 0 14px" }}>
            <a href="#signup" style={{ display: "inline-block", background: "#C62828", color: "#fff", textDecoration: "none", fontWeight: 600, padding: "12px 20px", borderRadius: 10, fontSize: 15 }}>Subscribe free</a>
          </p>
          <TrustLine />
        </div>
      </header>

      <div style={WRAP}>
        <section aria-labelledby="who-h">
          <h2 id="who-h" style={H2}>Who it is for</h2>
          <p style={P}>{n.reader}</p>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", margin: "18px 0 8px" }}>What it covers</h3>
          <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>
            {n.covers.map((c) => <li key={c} style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink2)" }}>{c}</li>)}
          </ul>
          <p style={P}>Coverage is global, with regular space for Asia, Africa and Latin America as well as Europe and North America. Read alongside the evergreen pages it feeds: {TITLE_HUBS[n.slug].map((h, i) => (
            <span key={h.href}>{i > 0 && (i === TITLE_HUBS[n.slug].length - 1 ? " and " : ", ")}<Link href={h.href} style={LINK}>{h.label}</Link></span>
          ))}.</p>
        </section>

        <section aria-labelledby="sample-h">
          <h2 id="sample-h" style={H2}>{latest ? "Latest issue" : "Sample issue"}</h2>
          {latest ? (
            <div style={{ ...CARD, borderLeft: `4px solid ${n.accent}` }}>
              <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "var(--mute2)" }}>{issueLabel(latest.issue_no)} · {fmtDate(dayStr(latest.issue_date))}</p>
              <Link href={issueHref(latest)} style={{ fontSize: 19, fontWeight: 600, color: "var(--ink)", textDecoration: "none", lineHeight: 1.35 }}>{latest.subject}</Link>
              {latest.intro && <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--mute)" }}>{latest.intro}</p>}
              <p style={{ margin: "10px 0 0", fontSize: 14.5 }}><Link href={issueHref(latest)} style={LINK}>Read the web version →</Link></p>
            </div>
          ) : (
            <div style={{ ...CARD, borderLeft: `4px solid ${n.accent}` }}>
              <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>First issue planned for {planned.label}.</p>
              <p style={{ margin: "0 0 10px", fontSize: 14.5, lineHeight: 1.6, color: "var(--mute)" }}>We will not show a made-up sample. When Issue 01 is published, its full web version appears here. Each issue carries:</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {ISSUE_PARTS.map((x) => <li key={x} style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--ink2)" }}>{x}</li>)}
              </ul>
            </div>
          )}
          {recent.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>Recent stories</h3>
              <NewsList items={recent} showTag={false} />
            </div>
          )}
        </section>

        <section aria-labelledby="archive-h">
          <h2 id="archive-h" style={H2}>Archive</h2>
          {issues.length ? (
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {issues.map((i) => (
                <li key={i.id} style={{ borderTop: "1px solid var(--line)", padding: "12px 0", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12.5, color: "var(--mute2)", minWidth: 120 }}>{issueLabel(i.issue_no)} · {fmtDate(dayStr(i.issue_date))}</span>
                  <Link href={issueHref(i)} style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)", textDecoration: "none", flex: "1 1 220px" }}>{i.subject}</Link>
                </li>
              ))}
            </ol>
          ) : (
            <p style={P}>No issues yet. Every issue will be listed here with its date and a link to the web version.</p>
          )}
        </section>

        <section aria-label="Subscribe" style={{ marginTop: 36 }}>
          <NewsletterSignup defaults={[n.slug]} title={`Subscribe to ${n.name}`} intro="Free. Tick any other titles you want too. One email to confirm; one-click unsubscribe in every issue." />
        </section>

        <section aria-labelledby="spons-h" style={{ ...CARD, marginTop: 28, background: "var(--paper)" }}>
          <h2 id="spons-h" style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 700, color: "var(--ink)" }}>Sponsor this newsletter</h2>
          <p style={{ margin: "0 0 8px", fontSize: 14.5, lineHeight: 1.6, color: "var(--mute)" }}>One labelled presenting message and one labelled classified per issue, for {n.sponsors.charAt(0).toLowerCase() + n.sponsors.slice(1)}. Sponsors never touch the news.</p>
          <Link href="/advertise#newsletters" style={LINK}>Sponsorship and booking →</Link>
        </section>
      </div>
    </article>
  );
}
