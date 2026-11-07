import Link from "next/link";
import CompanyCard from "./CompanyCard";
import { CO_CSS } from "../lib/directory-css";
import {
  SITE, DIRECTORY_PUBLIC, KINDS, KIND_ORDER, SEGMENTS, CATEGORY, KIND_PATH, SEGMENT_H1, countrySlug, inCountry, landingPages, listCompanies,
} from "../lib/directory";

// Shared layout for the directory landing pages: /companies/processors|seed|machinery, /companies/machinery/<segment>,
// /companies/country/<country>. Counts come from the live data; the cards are the same neutral A–Z cards as /companies.

export async function loadDirectory() {
  return listCompanies();
}

export function landingMeta({ title, description, path }) {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE}${path}` },
    robots: DIRECTORY_PUBLIC ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { type: "website", url: `${SITE}${path}`, title, description },
  };
}

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export function Browse({ all, current }) {
  const { segments, countries } = landingPages(all);
  const cell = (href, label, n) =>
    href === current ? (
      <span key={href} aria-current="page" style={{ borderColor: "var(--ink)", color: "var(--ink)" }}>{label} <small>{n}</small></span>
    ) : (
      <Link key={href} href={href}>{label} <small style={{ color: "var(--mute3)" }}>{n}</small></Link>
    );
  return (
    <section className="co-links" aria-labelledby="co-browse-h">
      <h2 id="co-browse-h">Browse the directory</h2>
      <div className="co-links-g">
        <div>
          <p>By type</p>
          <div className="cp-links">
            {KIND_ORDER.map((k) => cell(`/companies/${KIND_PATH[k]}`, KINDS[k].plural, all.filter((c) => c.kind === k).length))}
          </div>
        </div>
        {segments.length > 0 && (
          <div>
            <p>Machinery by type</p>
            <div className="cp-links">
              {segments.map((s) => cell(`/companies/machinery/${s}`, SEGMENTS[s], all.filter((c) => c.kind === "machinery" && c.segments.includes(s)).length))}
            </div>
          </div>
        )}
        {countries.length > 0 && (
          <div>
            <p>By country</p>
            <div className="cp-links">
              {countries.map((c) => cell(`/companies/country/${countrySlug(c)}`, c, all.filter((x) => x.country === c).length))}
            </div>
          </div>
        )}
      </div>
      <p className="cp-note" style={{ marginTop: 18 }}>
        <Link href="/companies" style={{ color: "var(--gold)", textDecoration: "none" }}>All companies, A to Z →</Link>
      </p>
    </section>
  );
}

export default function CompanyLanding({ path, eyebrow, h1, intro, groups, crumbs, all, listName }) {
  const items = groups.flatMap((g) => g.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}${path}#collection`,
        name: h1,
        url: `${SITE}${path}`,
        isPartOf: { "@id": `${SITE}/#website` },
        publisher: { "@id": `${SITE}/#publisher` },
        mainEntity: { "@id": `${SITE}${path}#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}${path}#list`,
        name: listName || h1,
        numberOfItems: items.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/companies/${c.slug}`, name: c.common || c.name })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Home", url: "/" }, { name: "Companies", url: "/companies" }, ...crumbs].map((b, i) => ({
          "@type": "ListItem", position: i + 1, name: b.name, item: `${SITE}${b.url === "/" ? "/" : b.url}`,
        })),
      },
    ],
  };
  return (
    <div>
      <style>{CO_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="dz-top">
        <p className="crumb">
          <Link href="/companies">Companies</Link>
          {crumbs.slice(0, -1).map((b) => (
            <span key={b.url}><span aria-hidden="true">/</span><Link href={b.url}>{b.name}</Link></span>
          ))}
          <span aria-hidden="true">/</span>{crumbs[crumbs.length - 1].name}
        </p>
        <p className="eyebrow rise">{eyebrow}</p>
        <h1 className="dz-h1 rise">{h1}</h1>
        <p className="co-intro">{intro}</p>
      </section>
      {groups.map((g, i) => (
        <section key={g.key || i} className="ix-sec" aria-labelledby={g.h2 ? `g-${g.key}` : undefined} style={{ paddingTop: i ? 8 : 16 }}>
          {g.h2 && (
            <div className="co-feat-h" style={{ marginBottom: 14 }}>
              <h2 id={`g-${g.key}`} style={{ margin: 0, fontSize: 28, color: "var(--ink)" }}>{g.h2}</h2>
              {g.more && <Link href={g.more.href} style={{ color: "var(--gold)", textDecoration: "none", fontSize: 14 }}>{g.more.label} →</Link>}
            </div>
          )}
          <ul className="co-grid">
            {g.items.map((c) => <li key={c.slug}><CompanyCard c={c} /></li>)}
          </ul>
        </section>
      ))}
      <Browse all={all} current={path} />
    </div>
  );
}

export { CATEGORY, SEGMENT_H1, KINDS, SEGMENTS, inCountry, countrySlug, landingPages };
