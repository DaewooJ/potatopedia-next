import Link from "next/link";
import CompaniesFilter from "../../components/CompaniesFilter";
import { Browse } from "../../components/CompanyLanding";
import { Figures } from "../../components/Editorial";
import { listCompanies, DIRECTORY_PUBLIC, KINDS, KIND_ORDER, SITE, flag } from "../../lib/directory";
import { CO_CSS } from "../../lib/directory-css";

// /companies — the neutral company directory (8 Nov 2026). Only published rows; every profile is compiled from the
// company's own website. The Featured row is a labelled paid placement; empty slots say "available" and link to /advertise
// (never a made-up company). The A–Z list below is never re-ordered by payment.

export const revalidate = 3600;

export const metadata = {
  title: "Potato Companies of the World: Processors, Seed Companies and Machinery Makers",
  description: "A neutral directory of potato processors, seed companies and machinery makers, each profile compiled from the company's own website with sources and a last-checked date.",
  alternates: { canonical: `${SITE}/companies` },
  robots: DIRECTORY_PUBLIC ? { index: true, follow: true } : { index: false, follow: false },
};

const SLOT_SUB = {
  processing: "For fry, chip, flake and starch makers.",
  seed: "For breeders and seed potato houses.",
  machinery: "For makers of field, store and factory machines.",
};

export default async function CompaniesPage() {
  const companies = await listCompanies();
  const countries = new Set(companies.map((c) => c.country).filter(Boolean)).size;
  const by = (k) => companies.filter((c) => c.kind === k);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/companies#collection`,
        name: "Potato companies of the world",
        url: `${SITE}/companies`,
        isPartOf: { "@id": `${SITE}/#website` },
        publisher: { "@id": `${SITE}/#publisher` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: companies.length,
          itemListElement: companies.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/companies/${c.slug}`, name: c.common || c.name })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Companies", item: `${SITE}/companies` },
        ],
      },
    ],
  };

  return (
    <div>
      <style>{CO_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="ix-hero" style={{ paddingBottom: 36 }}>
        <p className="eyebrow rise">Company directory</p>
        <div className="ix-row">
          <h1 className="ix-h1 rise">Potato companies <em>of the world.</em></h1>
          <div className="ix-dek">
            <p style={{ margin: 0 }}>
              Processors, seed companies and machinery makers. Each profile is compiled from the company&apos;s own website, with every source listed and the date we last checked it.
            </p>
          </div>
        </div>
        <div className="co-hero-figs">
          <Figures
            label="The directory in numbers"
            items={[
              { n: String(companies.length), l: "Companies listed" },
              { n: String(countries), l: countries === 1 ? "Country" : "Countries" },
              { n: String(KIND_ORDER.length), l: "Company types" },
              { n: String(companies.reduce((a, c) => a + c.sources, 0)), l: "Official pages cited" },
            ]}
          />
        </div>
      </section>

      <section className="co-feat" aria-labelledby="co-feat-h">
        <div className="co-feat-h">
          <h2 id="co-feat-h">Featured</h2>
          <p>Paid, labelled listings. They never change a fact or the order of the list below.</p>
        </div>
        <div className="co-feat-grid">
          {KIND_ORDER.map((k) => {
            const paid = by(k).filter((c) => c.featured);
            return (
              <div key={k} className="co-feat-col">
                <p className="co-feat-k">{KINDS[k].plural}</p>
                {paid.map((c) => (
                  <Link key={c.slug} href={`/companies/${c.slug}`} className="co-slot" style={{ borderStyle: "solid", borderColor: "var(--gold-line)" }}>
                    <span className="co-badge">Featured</span>
                    <span className="co-slot-t">{c.name}</span>
                    <span className="co-slot-s"><span aria-hidden="true">{flag(c.country)}</span> {c.country} · {c.summary}</span>
                  </Link>
                ))}
                {paid.length < 2 && (
                  <Link href="/advertise" className="co-slot">
                    <span className="co-slot-k">Featured listing · available</span>
                    <span className="co-slot-t">Your company here, labelled</span>
                    <span className="co-slot-s">{SLOT_SUB[k]} See rates <span className="arr">→</span></span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <CompaniesFilter companies={companies} />

      <Browse all={companies} current="/companies" />

      <section className="co-how" aria-label="How this directory works">
        <div className="co-how-in">
          <div>
            <h3>Official sources only</h3>
            <p>Every fact comes from the company&apos;s own website and links to the page it came from. Where a company does not publish something, we say so instead of guessing.</p>
          </div>
          <div>
            <h3>Neutral by rule</h3>
            <p>Listings are mixed across countries, with a cap per country and type, and written in plain terms, without ranking or praise. Paid listings are labelled Featured and never change a fact.</p>
          </div>
          <div>
            <h3>For companies</h3>
            <p>Each profile has a form to correct a fact or claim the listing. To be featured, see the <Link href="/advertise">rate card</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
