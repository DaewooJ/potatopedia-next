import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, newsHref, fmtDate } from "@/lib/newsletters";
import { AUTHORS, authorBySlug, authorHref, authorId, authorPerson } from "@/lib/authors-registry";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import { newsByAuthor } from "@/lib/news-db";
import { WRAP, H1, H2, P, KICK, CARD, LINK, Crumbs, crumbsLd, JsonLd, TitleTag } from "@/components/NewsUI";

// /authors/<slug> — one page per writer: name, role, institution, credentials, real photo (if any), articles.
export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const a = authorBySlug((await params).slug);
  if (!a) return {};
  const url = SITE + authorHref(a);
  return {
    title: `${a.name}, ${a.role}`,
    description: a.bio[0].slice(0, 158),
    alternates: { canonical: url },
    openGraph: { type: "profile", url, title: `${a.name} — Potatopedia`, description: a.bio[0].slice(0, 158), images: [a.photo?.src || "/og-image.png"] },
  };
}

export default async function AuthorPage({ params }) {
  const a = authorBySlug((await params).slug);
  if (!a) notFound();
  const items = await newsByAuthor(a.slug);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Authors", href: "/authors" }, { name: a.name, href: authorHref(a) }];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", "@id": SITE + authorHref(a) + "#page", url: SITE + authorHref(a), mainEntity: { "@id": authorId(a) }, publisher: { "@id": SITE + "/#publisher" } },
      authorPerson(a),
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };
  return (
    <article style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "36px 0 28px" }}>
        <div style={WRAP}>
          <Crumbs items={crumbs} />
          <p style={KICK}>{a.kind === "staff" ? "Staff" : "Expert contributor"}</p>
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            {a.photo?.src && <img src={a.photo.src} alt={a.photo.alt || a.name} width={96} height={96} style={{ borderRadius: 999, objectFit: "cover" }} />}
            <div style={{ minWidth: 0 }}>
              <h1 style={{ ...H1, margin: "0 0 6px" }}>{a.name}</h1>
              <p style={{ margin: 0, fontSize: 15, color: "var(--ink2)" }}>{a.role} · {a.institution}{a.location ? ` · ${a.location}` : ""}</p>
            </div>
          </div>
        </div>
      </header>
      <div style={WRAP}>
        <section aria-labelledby="bio-h">
          <h2 id="bio-h" style={H2}>About</h2>
          {a.bio.map((b, i) => <p key={i} style={P} {...(i === 0 ? { "data-summary": "true" } : {})}>{b}</p>)}
          {a.credentials?.length > 0 && (
            <>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", margin: "18px 0 8px" }}>Credentials and method</h3>
              <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>{a.credentials.map((c) => <li key={c} style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink2)" }}>{c}</li>)}</ul>
            </>
          )}
          {a.links?.length > 0 && (
            <p style={{ ...P, fontSize: 15 }}>
              {a.links.map((l, i) => (
                <span key={l.href}>{i > 0 && " · "}{l.href.startsWith("/") ? <Link href={l.href} style={LINK}>{l.label}</Link> : <a href={l.href} rel="noopener" style={LINK}>{l.label}</a>}</span>
              ))}
            </p>
          )}
        </section>
        <section aria-labelledby="art-h">
          <h2 id="art-h" style={H2}>Articles</h2>
          {items.length ? (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map((it) => (
                <li key={it.id} style={{ borderTop: "1px solid var(--line)", padding: "12px 0" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                    <time dateTime={new Date(it.published_at).toISOString()} style={{ fontSize: 12.5, color: "var(--mute2)" }}>{fmtDate(it.published_at)}</time>
                    <TitleTag slug={it.newsletter} />
                  </div>
                  <Link href={newsHref(it)} style={{ fontSize: 16.5, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>{it.headline}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <div style={CARD}><p style={{ margin: 0, fontSize: 15, color: "var(--mute)" }}>No stories published yet. They are listed here as they appear on <Link href="/news" style={LINK}>Potato news</Link>.</p></div>
          )}
        </section>
      </div>
    </article>
  );
}
