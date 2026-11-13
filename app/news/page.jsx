import Link from "next/link";
import { NEWSLETTERS, SITE, newsHref } from "@/lib/newsletters";
import { latestNews } from "@/lib/news-db";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import NewsletterSignup from "@/components/NewsletterSignup";
import { WRAP, H1, H2, P, KICK, CARD, LINK, Crumbs, crumbsLd, JsonLd, NewsList, TrustLine } from "@/components/NewsUI";

// /news — owns "potato news". Every published story from the three newsletters, newest first (ISR + revalidated on publish).
export const revalidate = 3600;

const PATH = "/news";
const TITLE = "Potato News: Processing, Seed, Prices and Trade";
const DESC = "Potato industry news from primary sources worldwide: processing plants and technology, seed and field, prices and trade. Each story links its source.";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: SITE + PATH },
  openGraph: { title: `${TITLE} — Potatopedia`, description: DESC, type: "website", url: SITE + PATH, images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${TITLE} — Potatopedia`, description: DESC },
};

const crumbs = [{ name: "Home", href: "/" }, { name: "News", href: PATH }];

export default async function NewsIndex() {
  const items = await latestNews({ limit: 60 });
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": SITE + PATH + "#page",
        url: SITE + PATH,
        name: "Potato news",
        description: DESC,
        isPartOf: { "@id": SITE + "/#website" },
        publisher: { "@id": SITE + "/#publisher" },
        ...(items.length
          ? { mainEntity: { "@type": "ItemList", itemListElement: items.slice(0, 30).map((it, i) => ({ "@type": "ListItem", position: i + 1, url: SITE + newsHref(it), name: it.headline })) } }
          : {}),
      },
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
          <p style={KICK}>News</p>
          <h1 style={H1}>Potato news</h1>
          <p data-summary="true" style={{ ...P, fontSize: 18 }}>
            Potato news from primary sources worldwide: processing plants and technology, seed and field, prices and trade. Each story is written by the Potatopedia Editorial desk from the original announcement, statistic or paper, and links it.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {NEWSLETTERS.map((n) => (
              <Link key={n.slug} href={`/newsletters/${n.slug}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--ink2)", textDecoration: "none", border: `1px solid ${n.accent}`, borderLeft: `4px solid ${n.accent}`, borderRadius: 8, padding: "6px 10px" }}>{n.name}</Link>
            ))}
          </div>
          <TrustLine />
        </div>
      </header>

      <div style={WRAP}>
        <section aria-labelledby="latest-h">
          <h2 id="latest-h" style={H2}>Latest stories</h2>
          {items.length ? (
            <NewsList items={items} />
          ) : (
            <div style={CARD}>
              <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>The first stories are published with Issue 01 of each newsletter.</p>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--mute)" }}>
                Until then, the reference pages are the place to start: <Link href="/knowledge/how-potatoes-are-processed" style={LINK}>potato processing</Link>, <Link href="/seed-field" style={LINK}>seed potatoes</Link> and <Link href="/prices" style={LINK}>potato prices</Link>.
              </p>
            </div>
          )}
        </section>

        <section aria-label="Subscribe" style={{ marginTop: 36 }}>
          <NewsletterSignup compact title="Get the stories by email" intro="Pick your newsletters. Free; one email to confirm." />
        </section>

        <p style={{ ...P, marginTop: 28, fontSize: 14.5 }}>
          How stories are chosen and checked: <Link href="/editorial-standards" style={LINK}>editorial standards</Link>. Spotted an error? <Link href="/contact" style={LINK}>Tell us</Link> and we correct it on the page.
        </p>
      </div>
    </article>
  );
}
