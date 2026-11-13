import Link from "next/link";
import { SITE, TRUST_LINE } from "@/lib/newsletters";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import { WRAP, H1, H2, P, KICK, CARD, LINK, Crumbs, crumbsLd, JsonLd } from "@/components/NewsUI";

// /editorial-standards — how news is chosen and checked, sources, the banned-aggregator rule, corrections,
// Sponsored labelling and the trust line (13 Nov 2026). Linked from every news page, issue and newsletter page.
const PATH = "/editorial-standards";
const DESC = "How Potatopedia chooses and checks potato news: primary sources only, no aggregators, every figure linked, corrections on the page, sponsors labelled and kept apart.";
const UPDATED = { iso: "2026-11-13", label: "13 Nov 2026" };

export const metadata = {
  title: "Editorial Standards: How We Choose and Check News",
  description: DESC,
  alternates: { canonical: SITE + PATH },
  openGraph: { title: "Editorial standards — Potatopedia", description: DESC, type: "article", url: SITE + PATH, images: ["/og-image.png"] },
};

const crumbs = [{ name: "Home", href: "/" }, { name: "Editorial standards", href: PATH }];

const li = { fontSize: 16, lineHeight: 1.7, color: "var(--ink2)", marginBottom: 4 };

export default function EditorialStandards() {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": SITE + PATH + "#page",
        url: SITE + PATH,
        name: "Potatopedia editorial standards",
        description: DESC,
        dateModified: UPDATED.iso,
        publisher: { "@id": SITE + "/#publisher" },
        isPartOf: { "@id": SITE + "/#website" },
      },
      crumbsLd(crumbs),
      // Google reads these Organization properties for news publishers.
      { ...POTATOPEDIA_PUBLISHER, publishingPrinciples: SITE + PATH, correctionsPolicy: SITE + PATH + "#corrections", ethicsPolicy: SITE + PATH, masthead: SITE + "/authors" },
    ],
  };
  return (
    <article style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "36px 0 28px" }}>
        <div style={WRAP}>
          <Crumbs items={crumbs} />
          <p style={KICK}>Editorial standards</p>
          <h1 style={H1}>How we choose and check the news</h1>
          <p data-summary="true" style={{ ...P, fontSize: 18 }}>
            Potatopedia reports potato news from primary sources only, links the source for every figure, corrects mistakes on the page with a date, and keeps sponsors in labelled places away from the news. This page sets out how.
          </p>
          <p style={{ ...CARD, margin: "0 0 12px", fontSize: 17, fontWeight: 600, color: "var(--ink)", borderLeft: "4px solid var(--gold)" }}>{TRUST_LINE}</p>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--mute2)" }}>Last updated: <time dateTime={UPDATED.iso}>{UPDATED.label}</time></p>
        </div>
      </header>

      <div style={WRAP}>
        <section aria-labelledby="choose-h">
          <h2 id="choose-h" style={H2}>How we choose stories</h2>
          <p style={P}>The desk reads official and company sources every day and scores each candidate story for the readers of each newsletter: is it relevant to their work, is it important, is it new, and does it widen our coverage beyond the usual markets. Each issue aims to cover at least four regions, with regular space for Asia, Africa and Latin America.</p>
          <p style={P}>A sponsor&apos;s news gets no extra coverage because it is a sponsor, and a company that is not a sponsor gets no less.</p>
        </section>

        <section aria-labelledby="sources-h">
          <h2 id="sources-h" style={H2}>Sources we use</h2>
          <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>
            <li style={li}>National potato boards and councils, and the European and international bodies that represent the sector.</li>
            <li style={li}>Statistics offices and international data: FAOSTAT, USDA NASS and ERS, Statistics Canada, Eurostat, UN Comtrade.</li>
            <li style={li}>Seed-certification and plant-health authorities, and official notices.</li>
            <li style={li}>Research: CIP, universities and extension services, and peer-reviewed journals.</li>
            <li style={li}>Company newsrooms and press releases, labelled as company announcements.</li>
          </ul>
          <p style={P}>Trade press may tell us that something happened; we then find and cite the original. If we cannot find a primary source, we drop the story.</p>
        </section>

        <section aria-labelledby="banned-h">
          <h2 id="banned-h" style={H2}>Sources we never use</h2>
          <p style={P}>We never copy, cite or link news aggregators, including PotatoPro, Potato News Today, FreshPlaza, TimesCA and Potatoes.News. They are not primary sources. The same rule applies to our answer engine and reference pages.</p>
        </section>

        <section aria-labelledby="check-h">
          <h2 id="check-h" style={H2}>How we check</h2>
          <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>
            <li style={li}>Every number must come from the source we cite. If we are not sure, we leave it out.</li>
            <li style={li}>We write in our own words. At most one short quote per story, in quotation marks, credited and linked.</li>
            <li style={li}>Each story opens with a 40 to 60 word summary, then &ldquo;Why it matters&rdquo; (our analysis, marked as such), then the facts with numbers and dates.</li>
            <li style={li}>Units: tonnes and US dollars, plus the local currency when the source uses it. Dates are written as 13 Nov 2026.</li>
            <li style={li}>Photos are real: our own, or press images used with credit and permission. We never use AI-generated images.</li>
            <li style={li}>Nothing is published or sent until the editor approves the issue.</li>
          </ul>
        </section>

        <section id="corrections" aria-labelledby="corr-h" style={{ scrollMarginTop: 96 }}>
          <h2 id="corr-h" style={H2}>Corrections</h2>
          <p style={P}>When we get something wrong, we fix it on the page and add a dated note in the Corrections box at the foot of the story, saying what changed. We do not quietly rewrite facts. To report an error, <Link href="/contact" style={LINK}>write to us</Link> with the page and, if you can, the primary source.</p>
        </section>

        <section aria-labelledby="spons-h">
          <h2 id="spons-h" style={H2}>Sponsors and labels</h2>
          <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>
            <li style={li}>Every paid item says &ldquo;Sponsored&rdquo; or &ldquo;Published with us&rdquo;. Free early placements say &ldquo;Launch partner&rdquo;.</li>
            <li style={li}>Links in paid items carry rel=&quot;sponsored&quot;.</li>
            <li style={li}>Sponsors never write, edit, review or see news items before they are published, and never appear inside a news item.</li>
            <li style={li}>Paid content never enters the neutral knowledge corpus behind our answers, and never changes a fact, a ranking or a list on a reference page.</li>
          </ul>
          <p style={P}>How placements work: <Link href="/advertise#newsletters" style={LINK}>advertise</Link>.</p>
        </section>

        <section aria-labelledby="who-h">
          <h2 id="who-h" style={H2}>Who writes</h2>
          <p style={P}>News and newsletters are written by the <Link href="/authors/potatopedia-editorial" style={LINK}>Potatopedia Editorial desk</Link>. Named experts write bylined contributions under these same rules; see <Link href="/authors" style={LINK}>authors</Link> and <Link href="/contribute" style={LINK}>write for us</Link>.</p>
        </section>
      </div>
    </article>
  );
}
