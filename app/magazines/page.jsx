import Link from "next/link";
import { NEWSLETTERS, SITE, bySlug, issueLabel, fmtDate, dayStr } from "@/lib/newsletters";
import { magazineIssues, magHref, magTitleHref, magazineOf } from "@/lib/magazine";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Crumbs, crumbsLd, JsonLd, TrustLine, LINK } from "@/components/NewsUI";
import { SERIF, MWRAP, MKICK, mbtn, SectionLabel, MagCard, TitleCover, magPeriodicalId, magIssueLd, magName } from "@/components/MagazineUI";

// /magazines — every magazine title and every edition, newest first (14 Nov 2026). Data: issues with a magazine.
export const revalidate = 3600;

const TITLE = "Potato Industry Magazines";
const DESC = "Free digital magazines from Potatopedia: Potato Processing Weekly, Seed Potato & Field and Potato Prices & Trade. Flip through each edition or get the PDF.";

export const metadata = {
  title: `${TITLE}: Free Digital Editions`,
  description: DESC.slice(0, 158),
  alternates: { canonical: `${SITE}/magazines` },
  openGraph: { title: `${TITLE} · Potatopedia`, description: DESC, type: "website", url: `${SITE}/magazines`, images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${TITLE} · Potatopedia`, description: DESC },
};

export default async function MagazinesHub() {
  const all = await magazineIssues();
  const latest = all[0] || null;
  const lm = latest ? magazineOf(latest) : null;
  const ln = latest ? bySlug(latest.newsletter) : null;
  const crumbs = [{ name: "Home", href: "/" }, { name: "Magazines", href: "/magazines" }];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/magazines#page`,
        url: `${SITE}/magazines`,
        name: TITLE,
        description: DESC,
        publisher: { "@id": SITE + "/#publisher" },
        hasPart: NEWSLETTERS.map((n) => ({ "@id": magPeriodicalId(n.slug) })),
      },
      ...NEWSLETTERS.map((n) => ({ "@type": "Periodical", "@id": magPeriodicalId(n.slug), name: magName(n), url: SITE + magTitleHref(n.slug), publisher: { "@id": SITE + "/#publisher" } })),
      ...all.slice(0, 30).map(magIssueLd),
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };

  return (
    <div style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "28px 0 48px" }}>
        <div style={MWRAP}>
          <Crumbs items={crumbs} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "30px 56px", alignItems: "center", marginTop: 8 }}>
            <div style={{ flex: "1 1 480px", minWidth: 0 }}>
              <p style={{ ...MKICK, color: "var(--gold)", margin: "0 0 14px" }}>Potatopedia magazines</p>
              <h1 style={{ fontSize: "clamp(34px, 5.4vw, 60px)", lineHeight: 1.04, letterSpacing: "-.02em", fontFamily: SERIF, fontWeight: 400, color: "var(--ink)", margin: "0 0 18px" }}>The potato industry, laid out as a magazine</h1>
              <p style={{ margin: 0, fontSize: "clamp(17px, 1.7vw, 19px)", lineHeight: 1.6, color: "var(--ink2)", maxWidth: 620 }}>
                Each newsletter issue also comes as a designed magazine edition. Turn the pages on screen, or get the PDF by email to read offline and pass to your team. Free, with every figure traced to its primary source.
              </p>
              {latest && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                  <Link href={magHref(latest)} style={mbtn("#C62828", "#fff")}>Read the latest edition <span aria-hidden="true">→</span></Link>
                  <a href="#titles" style={mbtn("transparent", "var(--ink)", "1.5px solid var(--ink)")}>Browse the titles</a>
                </div>
              )}
            </div>
            {latest && (
              <Link href={magHref(latest)} aria-label={`Latest: ${magName(ln)}, ${issueLabel(latest.issue_no)}`} style={{ flex: "0 1 330px", minWidth: 0, display: "block", textDecoration: "none" }}>
                <img src={lm.pages[0].src} alt={`${magName(ln)}, ${issueLabel(latest.issue_no)}, front cover`} width={lm.pages[0].w} height={lm.pages[0].h} style={{ width: "min(100%, 330px)", height: "auto", display: "block", margin: "0 auto", borderRadius: 4, boxShadow: "0 34px 60px -26px rgba(22,20,15,.65)", transform: "rotate(1.5deg)" }} />
                <span style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 13.5, color: "var(--mute)" }}>Latest · {ln.name} · {issueLabel(latest.issue_no)} · {fmtDate(dayStr(latest.issue_date))}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div style={{ ...MWRAP, paddingTop: 52 }}>
        <section id="titles" aria-labelledby="titles-h" style={{ scrollMarginTop: 90 }}>
          <SectionLabel id="titles-h">The titles</SectionLabel>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))" }}>
            {NEWSLETTERS.map((n) => {
              const mine = all.filter((i) => i.newsletter === n.slug);
              const top = mine[0];
              const tm = top ? magazineOf(top) : null;
              return (
                <li key={n.slug} style={{ background: "var(--card)", border: "1px solid var(--line)", borderTop: `4px solid ${n.accent}`, borderRadius: 16, padding: 20, display: "flex", gap: 18, minWidth: 0 }}>
                  <Link href={magTitleHref(n.slug)} tabIndex={-1} aria-hidden="true" style={{ flex: "0 0 104px", display: "block", textDecoration: "none" }}>
                    {tm ? <img src={tm.pages[0].src} alt="" width={tm.pages[0].w} height={tm.pages[0].h} loading="lazy" style={{ width: "100%", height: "auto", display: "block", borderRadius: 3, boxShadow: "0 14px 26px -16px rgba(22,20,15,.6)" }} /> : <TitleCover n={n} compact />}
                  </Link>
                  <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 22, lineHeight: 1.2 }}><Link href={magTitleHref(n.slug)} style={{ color: "var(--ink)", textDecoration: "none" }}>{n.name}</Link></h3>
                    <p style={{ margin: 0, fontSize: 13, color: n.accent, fontWeight: 600 }}>{n.cadenceLabel}</p>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--mute)" }}>{n.covers.slice(0, 3).join(" · ")}</p>
                    <p style={{ margin: "auto 0 0", paddingTop: 6, fontSize: 13.5 }}>
                      <Link href={magTitleHref(n.slug)} style={LINK}>{mine.length ? `${mine.length} ${mine.length === 1 ? "edition" : "editions"} →` : "First edition coming soon →"}</Link>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="all-h" style={{ marginTop: 64 }}>
          <SectionLabel id="all-h" right={<span style={{ fontSize: 13, color: "var(--mute)" }}>Newest first</span>}>All editions</SectionLabel>
          {all.length ? (
            <ul style={{ margin: 0, padding: 0, display: "grid", gap: "32px 22px", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 230px), 1fr))" }}>
              {all.map((i) => <MagCard key={i.id} issue={i} showTitle />)}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: 15.5, color: "var(--mute)" }}>The first magazine edition is being laid out. Subscribe below and it reaches you first.</p>
          )}
        </section>

        <section id="subscribe" aria-label="Subscribe" style={{ margin: "64px auto 0", maxWidth: 760, scrollMarginTop: 90 }}>
          <NewsletterSignup compact defaults={[NEWSLETTERS[0].slug]} title="Get every new edition by email" intro="Free. Tick the titles you want; one email to confirm, one-click unsubscribe." source="magazines" />
        </section>
        <footer style={{ marginTop: 40, borderTop: "1px solid var(--line)", paddingTop: 18, display: "grid", gap: 8 }}>
          <TrustLine />
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--mute)" }}>
            <Link href="/newsletters" style={{ color: "var(--gold)" }}>The newsletters</Link> · <Link href="/news" style={{ color: "var(--gold)" }}>Potato news</Link> · <Link href="/advertise" style={{ color: "var(--gold)" }}>Advertise in a magazine</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
