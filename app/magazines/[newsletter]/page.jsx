import Link from "next/link";
import { notFound } from "next/navigation";
import { NEWSLETTERS, SITE, bySlug, issueLabel, fmtDate, dayStr, issueHref } from "@/lib/newsletters";
import { magazineIssues, magHref, magTitleHref, magazineOf, magRef, magazineTitle } from "@/lib/magazine";
import { periodicalId } from "@/lib/newsletter-pages";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import NewsletterSignup from "@/components/NewsletterSignup";
import MagazineGate from "@/components/MagazineGate";
import { Crumbs, crumbsLd, JsonLd, TrustLine, LINK } from "@/components/NewsUI";
import { SERIF, MWRAP, MKICK, mbtn, SectionLabel, MagCard, TitleCover, magPeriodicalId, magIssueLd, magName } from "@/components/MagazineUI";

// /magazines/<newsletter> — one page per magazine title (14 Nov 2026): what it covers, how often, latest edition big
// (cover, flipbook link, gated PDF), archive of back issues newest first, subscribe box, advertise link.
// Titles with no edition yet show "First magazine edition coming soon" + subscribe, never an empty grid.
export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return NEWSLETTERS.map((n) => ({ newsletter: n.slug }));
}

export async function generateMetadata({ params }) {
  const n = bySlug((await params).newsletter);
  if (!n) return {};
  const [latest] = await magazineIssues(n.slug);
  const m = latest ? magazineOf(latest) : null;
  const url = SITE + magTitleHref(n.slug);
  const title = `${magName(n)}: Free Digital Edition`;
  const description = `${magName(n)} by Potatopedia: ${n.covers.slice(0, 3).join(", ")}. Flip through each edition online or get the PDF. Free.`.slice(0, 158);
  const img = m ? { url: SITE + m.pages[0].src, width: m.pages[0].w, height: m.pages[0].h, alt: `${magName(n)}, ${issueLabel(latest.issue_no)}, front cover` } : { url: SITE + "/og-image.png" };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "website", url, images: [img] },
    twitter: { card: "summary_large_image", title, description, images: [img.url] },
  };
}

export default async function MagazineTitlePage({ params }) {
  const n = bySlug((await params).newsletter);
  if (!n) notFound();
  const issues = await magazineIssues(n.slug);
  const latest = issues[0] || null;
  const lm = latest ? magazineOf(latest) : null;
  const back = issues.slice(1);
  const url = SITE + magTitleHref(n.slug);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Magazines", href: "/magazines" }, { name: n.name, href: magTitleHref(n.slug) }];
  const others = NEWSLETTERS.filter((x) => x.slug !== n.slug);
  const live = process.env.REPORT_GATE_LIVE === "true" && !!process.env.REPORT_LINK_SECRET;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Periodical",
        "@id": magPeriodicalId(n.slug),
        name: magName(n),
        alternateName: `${n.name} · magazine edition`,
        description: `${n.reader} Covers: ${n.covers.join("; ")}.`,
        url,
        inLanguage: "en",
        isAccessibleForFree: true,
        publisher: { "@id": SITE + "/#publisher" },
        isBasedOn: { "@id": periodicalId(n.slug) },
        ...(issues.length ? { hasPart: issues.slice(0, 50).map((i) => ({ "@id": `${SITE}${magHref(i)}#magazine` })) } : {}),
      },
      ...issues.slice(0, 50).map(magIssueLd),
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };

  return (
    <div style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: `5px solid ${n.accent}`, padding: "28px 0 48px" }}>
        <div style={MWRAP}>
          <Crumbs items={crumbs} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "30px 56px", alignItems: "center", marginTop: 8 }}>
            <div style={{ flex: "1 1 500px", minWidth: 0 }}>
              <p style={{ ...MKICK, color: n.accent, margin: "0 0 14px" }}>Magazine · by Potatopedia</p>
              <h1 style={{ fontSize: "clamp(36px, 5.6vw, 62px)", lineHeight: 1.03, letterSpacing: "-.02em", fontFamily: SERIF, fontWeight: 400, color: "var(--ink)", margin: "0 0 16px" }}>{n.name}</h1>
              <p style={{ margin: 0, fontSize: "clamp(17px, 1.7vw, 19px)", lineHeight: 1.6, color: "var(--ink2)", maxWidth: 620 }}>For {n.reader.charAt(0).toLowerCase() + n.reader.slice(1)}</p>
              <dl style={{ margin: "22px 0 0", display: "grid", gap: "10px 24px", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", maxWidth: 640 }}>
                <div><dt style={{ ...MKICK, fontSize: 11, color: "var(--mute2)" }}>How often</dt><dd style={{ margin: "4px 0 0", fontSize: 15, color: "var(--ink)" }}>{n.cadenceLabel}, with each newsletter issue</dd></div>
                <div><dt style={{ ...MKICK, fontSize: 11, color: "var(--mute2)" }}>Editions so far</dt><dd style={{ margin: "4px 0 0", fontSize: 15, color: "var(--ink)" }}>{issues.length ? issues.length : "First edition coming soon"}</dd></div>
              </dl>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
                {latest ? (
                  <>
                    <Link href={magHref(latest)} style={mbtn("#C62828", "#fff")}>Read the latest edition <span aria-hidden="true">→</span></Link>
                    <a href="#subscribe" style={mbtn("transparent", "var(--ink)", "1.5px solid var(--ink)")}>Subscribe free</a>
                  </>
                ) : <a href="#subscribe" style={mbtn("#C62828", "#fff")}>Subscribe free to get the first edition</a>}
              </div>
            </div>
            <div style={{ flex: "0 1 320px", minWidth: 0 }}>
              {latest ? (
                <Link href={magHref(latest)} aria-label={`Open ${magName(n)}, ${issueLabel(latest.issue_no)}`} style={{ display: "block", width: "min(100%, 320px)", margin: "0 auto" }}>
                  <img src={lm.pages[0].src} alt={`${magName(n)}, ${issueLabel(latest.issue_no)}, front cover`} width={lm.pages[0].w} height={lm.pages[0].h} style={{ width: "100%", height: "auto", display: "block", borderRadius: 4, boxShadow: "0 34px 60px -26px rgba(22,20,15,.65)", transform: "rotate(1.5deg)" }} />
                </Link>
              ) : (
                <div style={{ width: "min(100%, 280px)", margin: "0 auto", transform: "rotate(1.5deg)" }}><TitleCover n={n} /></div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div style={{ ...MWRAP, paddingTop: 52 }}>
        {latest ? (
          <section aria-labelledby="latest-h">
            <SectionLabel id="latest-h" accent={n.accent}>Latest edition</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "26px 44px", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 440px", minWidth: 0 }}>
                <p style={{ margin: "0 0 8px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ background: n.accent, color: "#fff", fontSize: 12.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 999 }}>{issueLabel(latest.issue_no)}</span>
                  <span style={{ fontSize: 14, color: "var(--ink2)" }}>{fmtDate(dayStr(latest.issue_date))} · {lm.pages.length} pages</span>
                </p>
                <h3 style={{ margin: "6px 0 12px", fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px, 3.4vw, 36px)", lineHeight: 1.15 }}>
                  <Link href={magHref(latest)} style={{ color: "var(--ink)", textDecoration: "none" }}>{latest.subject}</Link>
                </h3>
                {latest.intro && <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, color: "var(--ink2)" }}>{latest.intro}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                  <Link href={magHref(latest)} style={mbtn("var(--ink)", "var(--bg)")}>Flip through the magazine <span aria-hidden="true">→</span></Link>
                  <Link href={issueHref(latest)} style={mbtn("transparent", "var(--ink)", "1.5px solid var(--line2)")}>Read it as news</Link>
                </div>
              </div>
              {lm.pdf?.file && (
                <div id="pdf" style={{ flex: "1 1 380px", minWidth: 0, scrollMarginTop: 90 }}>
                  <MagazineGate magRef={magRef(latest)} title={magazineTitle(latest)} pages={lm.pdf.pages || lm.pages.length} mb={lm.pdf.bytes ? (lm.pdf.bytes / 1048576).toFixed(1) : null} newsletter={n.slug} newsletterName={n.name} live={live} />
                </div>
              )}
            </div>
          </section>
        ) : (
          <section aria-labelledby="soon-h" style={{ background: "var(--paper)", border: "1px dashed var(--dash)", borderRadius: 18, padding: "28px 24px" }}>
            <p style={{ ...MKICK, color: n.accent, margin: "0 0 8px" }}>Coming soon</p>
            <h2 id="soon-h" style={{ margin: "0 0 10px", fontSize: "clamp(24px, 3.2vw, 32px)", lineHeight: 1.2, color: "var(--ink)" }}>First magazine edition coming soon</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--ink2)", maxWidth: 680 }}>
              {n.name} comes out {n.cadenceLabel.charAt(0).toLowerCase() + n.cadenceLabel.slice(1)}. Its magazine edition will appear here, with a flipbook and a PDF. Subscribe and the first one reaches your inbox.
            </p>
          </section>
        )}

        <section aria-labelledby="covers-h" style={{ marginTop: 64 }}>
          <SectionLabel id="covers-h" accent={n.accent}>What it covers</SectionLabel>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))" }}>
            {n.covers.map((c, i) => (
              <li key={c} style={{ display: "flex", gap: 12, alignItems: "baseline", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
                <span style={{ fontFamily: SERIF, fontSize: 18, color: n.accent, flex: "none" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 15, lineHeight: 1.45, color: "var(--ink2)" }}>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {back.length > 0 && (
          <section aria-labelledby="arch-h" style={{ marginTop: 64 }}>
            <SectionLabel id="arch-h" accent={n.accent} right={<span style={{ fontSize: 13, color: "var(--mute)" }}>Newest first</span>}>Back issues</SectionLabel>
            <ul style={{ margin: 0, padding: 0, display: "grid", gap: "32px 22px", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))" }}>
              {back.map((i) => <MagCard key={i.id} issue={i} />)}
            </ul>
          </section>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, marginTop: 64, alignItems: "stretch" }}>
          <section id="subscribe" aria-label={`Subscribe to ${n.name}`} style={{ flex: "1.6 1 420px", minWidth: 0, scrollMarginTop: 90 }}>
            <NewsletterSignup single defaults={[n.slug]} title={`Get ${n.name} and its magazine by email`} intro="Free. One email to confirm; one-click unsubscribe in every issue." source={`magazines/${n.slug}`} />
          </section>
          <aside aria-label="Advertise" style={{ flex: "1 1 280px", minWidth: 0, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "20px 20px" }}>
            <p style={{ ...MKICK, fontSize: 11, color: "var(--mute2)", margin: "0 0 8px" }}>Advertise in this title</p>
            <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.55, color: "var(--ink2)" }}>Reach {n.reader.charAt(0).toLowerCase() + n.reader.slice(1).replace(/\.$/, "")}. Clearly labelled; never paid rankings or paid facts.</p>
            <Link href="/advertise" style={LINK}>Rates and formats →</Link>
          </aside>
        </div>

        <footer style={{ marginTop: 40, borderTop: "1px solid var(--line)", paddingTop: 18, display: "grid", gap: 8 }}>
          <TrustLine />
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--mute)" }}>
            <Link href="/magazines" style={{ color: "var(--gold)" }}>All magazines</Link>
            {others.map((o) => <span key={o.slug}> · <Link href={magTitleHref(o.slug)} style={{ color: "var(--gold)" }}>{o.name}</Link></span>)}
            {" · "}<Link href={`/newsletters/${n.slug}`} style={{ color: "var(--gold)" }}>About the {n.name} newsletter</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
