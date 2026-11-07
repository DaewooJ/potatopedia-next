import Link from "next/link";
import { notFound } from "next/navigation";
import LeadForm from "../../../components/LeadForm";
import { getCompany, listCompanies, isFeatured, websiteHost, fmtDate, flag, DIRECTORY_PUBLIC, KINDS, SEGMENTS, SITE } from "../../../lib/directory";
import { CO_CSS } from "../../../lib/directory-css";

// /companies/[slug] — one company profile, compiled from the company's own website only (profile jsonb in pp_companies).
// Fields that the company does not publish are left out, never guessed. "Featured" only adds a badge.

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    return (await listCompanies()).map((c) => ({ slug: c.slug }));
  } catch {
    return []; // profiles then render on first request
  }
}

function describe(c) {
  const p = c.profile || {};
  const where = [p.hq?.city, p.hq?.country || c.country].filter(Boolean).join(", ");
  return `${c.name}${where ? ` (${where})` : ""}: ${KINDS[c.kind]?.label.toLowerCase() || "company"} profile with products, plants, markets and contact details, compiled from the official website with sources.`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getCompany(slug);
  if (!c) return { title: "Company not found", robots: { index: false, follow: false } };
  const title = `${c.name}: ${KINDS[c.kind]?.label || "Company"} profile${c.country ? `, ${c.country}` : ""}`;
  return {
    title,
    description: describe(c).slice(0, 300),
    alternates: { canonical: `${SITE}/companies/${c.slug}` },
    robots: DIRECTORY_PUBLIC ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { type: "profile", url: `${SITE}/companies/${c.slug}`, title, description: describe(c).slice(0, 300) },
  };
}

function Sec({ id, title, children }) {
  return (
    <section className="dz-sec" id={id} aria-labelledby={`${id}-h`}>
      <h2 className="dz-h2" id={`${id}-h`}>{title}</h2>
      {children}
    </section>
  );
}

const List = ({ items }) => (
  <ul className="cp-list">
    {items.map((t, i) => <li key={i}>{t}</li>)}
  </ul>
);

const has = (a) => Array.isArray(a) && a.length > 0;

export default async function CompanyPage({ params }) {
  const { slug } = await params;
  const c = await getCompany(slug);
  if (!c) notFound();
  const p = c.profile || {};
  const kind = KINDS[c.kind] || { label: "Company", plural: "Companies" };
  const featured = isFeatured(c);
  const site = p.contact?.website || c.home_url;
  const segments = (c.segments || []).filter((s) => SEGMENTS[s] && s !== "other");
  const checked = p.last_checked || c.reviewed_at;

  const glance = [
    ["Type", kind.label],
    ["Headquarters", [p.hq?.city, p.hq?.country].filter(Boolean).join(", ")],
    ["Founded", p.founded],
    ["Ownership", p.ownership],
    ["Website", site && <a href={site} target="_blank" rel="nofollow noopener noreferrer">{websiteHost(site)}</a>],
  ].filter(([, v]) => v);

  const makes = [
    has(p.products) && { id: "products", title: c.kind === "seed" ? "What they supply" : "What they make", items: p.products },
    has(p.machines) && { id: "machines", title: "Machines", items: p.machines },
    has(p.varieties) && { id: "varieties", title: "Varieties named on their website", chips: p.varieties },
    has(p.brands) && { id: "brands", title: "Brands", chips: p.brands },
  ].filter(Boolean);

  const sameAs = site ? [site] : [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/companies/${c.slug}#org`,
        name: c.name,
        url: site,
        ...(p.hq?.city || p.hq?.country || p.contact?.address
          ? { address: { "@type": "PostalAddress", ...(p.contact?.address ? { streetAddress: p.contact.address } : {}), ...(p.hq?.city ? { addressLocality: p.hq.city } : {}), addressCountry: p.hq?.country || c.country } }
          : {}),
        ...(p.contact?.phone ? { telephone: p.contact.phone } : {}),
        ...(p.contact?.public_email ? { email: p.contact.public_email } : {}),
        ...(/^\d{4}/.test(p.founded || "") ? { foundingDate: p.founded.slice(0, 4) } : {}),
        ...(p.summary ? { description: p.summary } : {}),
        sameAs,
        subjectOf: { "@id": `${SITE}/companies/${c.slug}#page` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE}/companies/${c.slug}#page`,
        url: `${SITE}/companies/${c.slug}`,
        name: `${c.name} profile`,
        ...(checked ? { dateModified: new Date(checked).toISOString().slice(0, 10) } : {}),
        isPartOf: { "@id": `${SITE}/#website` },
        publisher: { "@id": `${SITE}/#publisher` },
        about: { "@id": `${SITE}/companies/${c.slug}#org` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Companies", item: `${SITE}/companies` },
          { "@type": "ListItem", position: 3, name: c.name, item: `${SITE}/companies/${c.slug}` },
        ],
      },
    ],
  };

  return (
    <div>
      <style>{CO_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="dz-top">
        <p className="crumb">
          <Link href="/companies">Companies</Link><span aria-hidden="true">/</span>{kind.plural}<span aria-hidden="true">/</span>{c.country}
        </p>
        <p className="eyebrow rise" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <span>{kind.label} · <span aria-hidden="true">{flag(c.country)}</span> {c.country}</span>
          {featured && <span className="co-badge">Featured listing</span>}
        </p>
        <h1 className="dz-h1 cp-h1 rise">{c.name}</h1>
        {p.summary && <p className="dz-lede">{p.summary}</p>}
        <div className="cp-meta">
          {site && (
            <a href={site} target="_blank" rel="nofollow noopener noreferrer">
              {websiteHost(site)} <span aria-hidden="true">↗</span>
            </a>
          )}
          {checked && <span>Last checked {fmtDate(checked)}</span>}
          {has(p.sources) && <span>{p.sources.length} official {p.sources.length === 1 ? "page" : "pages"} cited</span>}
        </div>
        {segments.length > 0 && (
          <div className="cp-chips" style={{ marginTop: 22 }}>
            {segments.map((s) => <span key={s}>{SEGMENTS[s]}</span>)}
          </div>
        )}
      </section>

      <section className="dz-body">
        <div className="dz-cols">
          <div className="dz-main">
            <section aria-labelledby="glance-h">
              <h2 className="dz-h2" id="glance-h">At a glance</h2>
              <table className="dz-table">
                <tbody>
                  {glance.map(([k, v]) => (
                    <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>

            {makes.map((m) => (
              <Sec key={m.id} id={m.id} title={m.title}>
                {m.items ? <List items={m.items} /> : <div className="cp-chips">{m.chips.map((t) => <span key={t}>{t}</span>)}</div>}
              </Sec>
            ))}

            {has(p.plants) && (
              <Sec id="plants" title={c.kind === "processing" ? "Plants and capacity" : "Sites"}>
                <table className="dz-table cp-plants">
                  <thead><tr><th scope="col">Site</th><th scope="col">Country</th>{p.plants.some((x) => x.capacity_as_stated) && <th scope="col">As stated</th>}</tr></thead>
                  <tbody>
                    {p.plants.map((x, i) => (
                      <tr key={i}>
                        <td style={{ paddingRight: 16 }}>{x.town}</td>
                        <td style={{ paddingRight: 16, color: "var(--mute)" }}>{x.country}</td>
                        {p.plants.some((y) => y.capacity_as_stated) && <td style={{ color: "var(--mute)" }}>{x.capacity_as_stated || ""}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Sec>
            )}

            {has(p.markets) && <Sec id="markets" title="Markets"><List items={p.markets} /></Sec>}
            {has(p.facts) && <Sec id="facts" title="Key facts"><List items={p.facts} /></Sec>}
            {has(p.certifications) && (
              <Sec id="certifications" title="Certifications">
                <div className="cp-chips">{p.certifications.map((t) => <span key={t}>{t}</span>)}</div>
              </Sec>
            )}

            {has(p.limitations) && (
              <div className="cp-gaps">
                <p className="k" style={{ marginBottom: 6 }}>Not published</p>
                {p.limitations.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            )}

            {has(p.sources) && (
              <Sec id="sources" title="Sources">
                <ol className="cp-src">
                  {p.sources.map((s, i) => (
                    <li key={i}>
                      <span>
                        <a href={s.url} target="_blank" rel="nofollow noopener noreferrer">{s.title || websiteHost(s.url)}</a>
                        <small>{s.url.replace(/^https?:\/\//, "")}{s.accessed ? ` · accessed ${fmtDate(s.accessed)}` : ""}</small>
                      </span>
                    </li>
                  ))}
                </ol>
                {checked && <p style={{ margin: "14px 0 0", fontSize: 13, color: "var(--mute2)" }}>Last checked {fmtDate(checked)}.</p>}
              </Sec>
            )}
          </div>

          <aside className="dz-aside">
            {p.contact && (
              <div className="card" style={{ padding: 22 }}>
                <p className="k" style={{ marginBottom: 12 }}>Contact, as published</p>
                <dl className="cp-contact">
                  {p.contact.address && (<div><dt>Address</dt><dd>{p.contact.address}</dd></div>)}
                  {p.contact.phone && (<div><dt>Phone</dt><dd><a href={`tel:${p.contact.phone.replace(/[^\d+]/g, "")}`}>{p.contact.phone}</a></dd></div>)}
                  {p.contact.public_email && (<div><dt>Email</dt><dd><a href={`mailto:${p.contact.public_email}`}>{p.contact.public_email}</a></dd></div>)}
                  {site && (<div><dt>Website</dt><dd><a href={site} target="_blank" rel="nofollow noopener noreferrer">{websiteHost(site)}</a></dd></div>)}
                </dl>
              </div>
            )}

            <div className="card" style={{ padding: 22 }} id="correct">
              <p className="k" style={{ marginBottom: 8 }}>Is this your company?</p>
              <p className="cp-note">Profile compiled from the company&apos;s official website. Companies can request corrections.</p>
              <LeadForm
                compact
                type="company_claim"
                hidden={{ company_slug: c.slug }}
                askCountry={false}
                extra={[{ name: "request", label: "Request", options: ["Correct a fact", "Add published information", "Claim this listing", "Remove this listing"] }]}
                messageLabel="What should change? A link to your official page helps."
                submitLabel="Send request"
              />
            </div>

            <Link href="/advertise" className="slot">
              <p className="k k-mute" style={{ marginBottom: 6 }}>{featured ? "Featured listing" : "Featured listing · available"}</p>
              <p className="slot-t">Get featured</p>
              <p className="slot-s">A labelled place in the Featured row for {kind.plural.toLowerCase()}. It never changes the facts on this page. <span className="arr">→</span></p>
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
