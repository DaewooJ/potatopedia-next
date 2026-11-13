import Link from "next/link";
import { SITE } from "@/lib/newsletters";
import { AUTHORS, authorHref, authorId, authorPerson } from "@/lib/authors-registry";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import { WRAP, H1, H2, P, KICK, CARD, LINK, Crumbs, crumbsLd, JsonLd } from "@/components/NewsUI";

// /authors — everyone who writes on Potatopedia. Staff first, then contributors (none published yet).
const PATH = "/authors";
const DESC = "Who writes Potatopedia's potato news and newsletters: the Editorial desk and, as they publish, named expert contributors.";

export const metadata = {
  title: "Authors and Contributors",
  description: DESC,
  alternates: { canonical: SITE + PATH },
  openGraph: { title: "Authors and Contributors — Potatopedia", description: DESC, type: "website", url: SITE + PATH, images: ["/og-image.png"] },
};

const crumbs = [{ name: "Home", href: "/" }, { name: "Authors", href: PATH }];

export default function AuthorsPage() {
  const staff = AUTHORS.filter((a) => a.kind === "staff");
  const contributors = AUTHORS.filter((a) => a.kind === "contributor");
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": SITE + PATH + "#page",
        url: SITE + PATH,
        name: "Potatopedia authors and contributors",
        publisher: { "@id": SITE + "/#publisher" },
        mainEntity: { "@type": "ItemList", itemListElement: AUTHORS.map((a, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": authorId(a) } })) },
      },
      ...AUTHORS.map(authorPerson),
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };
  const Card = ({ a }) => (
    <Link href={authorHref(a)} style={{ ...CARD, display: "block", textDecoration: "none" }}>
      <span style={{ display: "block", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>{a.name}</span>
      <span style={{ display: "block", fontSize: 13.5, color: "var(--mute)", margin: "4px 0 8px" }}>{a.role} · {a.institution}</span>
      <span style={{ display: "block", fontSize: 14.5, lineHeight: 1.55, color: "var(--ink2)" }}>{a.bio[0]}</span>
    </Link>
  );
  return (
    <article style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "36px 0 28px" }}>
        <div style={WRAP}>
          <Crumbs items={crumbs} />
          <p style={KICK}>Authors</p>
          <h1 style={H1}>Authors and contributors</h1>
          <p data-summary="true" style={{ ...P, fontSize: 18 }}>Every story on Potatopedia carries a byline that links here. Staff write the news and the newsletters; named experts write bylined contributions under the same editorial standards.</p>
        </div>
      </header>
      <div style={WRAP}>
        <h2 style={H2}>Staff</h2>
        <div style={{ display: "grid", gap: 12 }}>{staff.map((a) => <Card key={a.slug} a={a} />)}</div>
        <h2 style={H2}>Expert contributors</h2>
        {contributors.length ? (
          <div style={{ display: "grid", gap: 12 }}>{contributors.map((a) => <Card key={a.slug} a={a} />)}</div>
        ) : (
          <p style={P}>No contributions published yet. Breeders, scientists, extension specialists and consultants can <Link href="/contribute" style={LINK}>pitch an article</Link>; each published contributor gets a page here with their role, institution and articles.</p>
        )}
      </div>
    </article>
  );
}
