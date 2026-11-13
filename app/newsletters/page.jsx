import Link from "next/link";
import { NEWSLETTERS, MAGAZINE, SITE, masthead } from "@/lib/newsletters";
import { FIRST_ISSUE_PLANNED, periodicalId } from "@/lib/newsletter-pages";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import NewsletterSignup from "@/components/NewsletterSignup";
import ConfirmedNotice from "@/components/ConfirmedNotice";
import { WRAP, H1, H2, P, KICK, CARD, LINK, Crumbs, crumbsLd, JsonLd, Masthead, TrustLine } from "@/components/NewsUI";

// /newsletters — the three Potatopedia titles + the magazine, one signup box (13 Nov 2026).
const PATH = "/newsletters";
const TITLE = "Potato Industry Newsletters: Processing, Seed and Prices";
const DESC = "Three free potato industry newsletters from Potatopedia: Potato Processing Weekly, Seed Potato & Field and Potato Prices & Trade. Primary sources, global coverage.";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: SITE + PATH },
  openGraph: { title: `${TITLE} — Potatopedia`, description: DESC, type: "website", url: SITE + PATH, images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${TITLE} — Potatopedia`, description: DESC },
};

const crumbs = [{ name: "Home", href: "/" }, { name: "Newsletters", href: PATH }];

export default function NewslettersPage() {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": SITE + PATH + "#page",
        url: SITE + PATH,
        name: "Potato industry newsletters: processing, seed and prices, by Potatopedia",
        description: DESC,
        isPartOf: { "@id": SITE + "/#website" },
        publisher: { "@id": SITE + "/#publisher" },
        mainEntity: { "@id": SITE + PATH + "#titles" },
      },
      {
        "@type": "ItemList",
        "@id": SITE + PATH + "#titles",
        itemListElement: NEWSLETTERS.map((n, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": periodicalId(n.slug) } })),
      },
      ...NEWSLETTERS.map((n) => ({
        "@type": "Periodical",
        "@id": periodicalId(n.slug),
        name: n.name,
        alternateName: masthead(n),
        url: `${SITE}/newsletters/${n.slug}`,
        description: n.reader,
        publisher: { "@id": SITE + "/#publisher" },
        inLanguage: "en",
        isAccessibleForFree: true,
      })),
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };

  return (
    <article style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "36px 0 30px" }}>
        <div style={WRAP}>
          <Crumbs items={crumbs} />
          <ConfirmedNotice />
          <p style={KICK}>Newsletters</p>
          <h1 style={H1}>Potato industry newsletters: processing, seed and prices, by Potatopedia</h1>
          <p data-summary="true" style={{ ...P, fontSize: 18 }}>
            Three free newsletters for the people who run the potato business worldwide. Potato Processing Weekly covers plants, capacity and technology in fries, chips, flakes and starch. Seed Potato &amp; Field covers varieties, certification, disease and storage. Potato Prices &amp; Trade covers prices, export flows and crop estimates. Every story links its primary source.
          </p>
          <TrustLine />
        </div>
      </header>

      <div style={WRAP}>
        <section aria-labelledby="titles-h">
          <h2 id="titles-h" style={H2}>The three titles</h2>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))" }}>
            {NEWSLETTERS.map((n) => (
              <div key={n.slug} style={{ ...CARD, borderTop: `5px solid ${n.accent}`, display: "flex", flexDirection: "column", gap: 8 }}>
                <Masthead n={n} />
                <h3 style={{ margin: "4px 0 0", fontSize: 22, lineHeight: 1.2, fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, color: "var(--ink)" }}>{n.name}</h3>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--ink2)" }}>{n.cadenceLabel} · first issue planned {FIRST_ISSUE_PLANNED[n.slug].label}</p>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--mute)" }}>For {n.reader.charAt(0).toLowerCase() + n.reader.slice(1)}</p>
                <ul style={{ margin: "2px 0 0", paddingLeft: 18, fontSize: 14, lineHeight: 1.6, color: "var(--ink2)" }}>
                  {n.covers.slice(0, 4).map((c) => <li key={c}>{c}</li>)}
                </ul>
                <p style={{ margin: "auto 0 0", paddingTop: 8, fontSize: 14.5 }}>
                  <Link href={`/newsletters/${n.slug}`} style={LINK}>About {n.short} →</Link>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="mag-h" style={{ ...CARD, marginTop: 18, borderTop: `5px solid ${MAGAZINE.accent}` }}>
          <h2 id="mag-h" style={{ margin: "0 0 6px", fontSize: 22, lineHeight: 1.2, fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, color: "var(--ink)" }}>{MAGAZINE.name}</h2>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "var(--ink2)" }}>{MAGAZINE.cadenceLabel}</p>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--mute)" }}>
            The best of the three titles each month, with one long feature and one expert interview, as a digital flipbook. Issue 01 is in preparation; it will be announced in the newsletters.
          </p>
        </section>

        <section aria-label="Subscribe" style={{ marginTop: 36 }}>
          <NewsletterSignup readQuery title="Subscribe" intro="Tick the titles you want. Free; one email to confirm, one-click unsubscribe in every issue." />
        </section>

        <section aria-labelledby="how-h">
          <h2 id="how-h" style={H2}>How the newsletters are made</h2>
          <p style={P}>Each item starts from a primary source: a national potato board or statistics office, a plant-health or seed-certification authority, a peer-reviewed paper, or a company&apos;s own announcement. We write the summary in our own words, say why it matters, give the key numbers with their source link, and publish each story as its own page under <Link href="/news" style={LINK}>Potato news</Link>. News aggregators are never used as a source.</p>
          <p style={P}>Coverage is global: Europe, the Americas, Africa, Asia and Oceania. Every issue is also published on the web, so you can read and share it without an inbox.</p>
          <p style={P}>Sponsors appear only in labelled places and never touch the news. Read the <Link href="/editorial-standards" style={LINK}>editorial standards</Link>, or see <Link href="/advertise#newsletters" style={LINK}>how sponsorship works</Link>. Experts can <Link href="/contribute" style={LINK}>write for us</Link>.</p>
        </section>
      </div>
    </article>
  );
}
