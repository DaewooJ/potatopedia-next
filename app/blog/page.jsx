import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "../../lib/blog-posts";
import "./blog-index.css";
import LeadForm from "../../components/LeadForm";

export const metadata = {
  title: "Potatopedia Blog — Global Industry Stories, Analysis & Trends",
  description:
    "Story-driven analysis of the global potato industry — from Belgium's $4.6B fry empire to Pakistan's 186% production surge to Egypt's 4-season desert farming. Backed by FAOSTAT, UN Comtrade, USDA, and 277 verified sources.",
  alternates: { canonical: "https://www.potatopedia.com/blog" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/blog",
    title: "Potatopedia Blog — Global Industry Stories, Analysis & Trends",
    description: "Story-driven analysis of the global potato industry, with verified data from 277 authoritative sources covering 204 countries.",
    images: ["/og-image.png"],
  },
};

const SITE = "https://www.potatopedia.com";

// The magazine's desks (7 Nov 2026). Every category in lib/data.js maps to exactly one desk.
const DESKS = [
  { id: "markets", label: "Markets & Trade", dek: "Prices, flows and the people who move the crop", cats: ["Industry & Trade", "Trade & Industry", "Global Trends", "Production", "Consumption"] },
  { id: "countries", label: "Countries", dek: "Dispatches from the world's potato regions", cats: ["Country Profile", "Around the World"] },
  { id: "varieties", label: "Varieties & Seed", dek: "Breeders, seed systems and the names on the sack", cats: ["Varieties", "Seed Systems"] },
  { id: "farming", label: "Farming & Science", dek: "The field, the lab and the store", cats: ["Agronomy", "Cultivation"] },
  { id: "processing", label: "Processing & Industry", dek: "Fries, flakes, sorting lines and cold rooms", cats: ["Processing", "Storage"] },
  { id: "health", label: "Food & Health", dek: "Sugar, starch and what the studies say", cats: ["Nutrition"] },
  { id: "history", label: "History & Culture", dek: "Eight thousand years of the tuber", cats: ["History & Culture"] },
];

// Most read: a curated proxy until per-post analytics are wired in — the blog pages that rank best on Google.
const MOST_READ = [
  "how-much-sugar-in-a-potato",
  "us-potato-production-by-state",
  "carisma-low-gi-potato-where-to-buy",
  "how-potatoes-came-to-china",
  "worlds-biggest-potato-eaters-ranked",
  "india-potato-production-by-state",
];

const ts = (p) => {
  const t = new Date(p.dateISO || p.date).getTime();
  return isNaN(t) ? 0 : t;
};
const fmtDate = (p, opts = { day: "numeric", month: "short", year: "numeric" }) => {
  const t = ts(p);
  return t ? new Date(t).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" }) : p.date;
};
const mins = (p) => String(p.readTime || "").replace(/\s*read$/i, "");
const clip = (s, n) => (s && s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
const shortCredit = (c) => String(c || "").replace(/,?\s*via Wikimedia Commons$/i, "");

function Meta({ p }) {
  return (
    <span className="bj-m">
      <span><time dateTime={p.dateISO || undefined}>{fmtDate(p)}</time></span>
      {p.readTime && <span>{mins(p)} read</span>}
    </span>
  );
}

function Photo({ p, ratio = "r32", sizes, priority = false, credit = true }) {
  return (
    <figure style={{ margin: 0 }}>
      <Link href={`/blog/${p.slug}`} className={`bj-img ${ratio}`} tabIndex={-1} aria-hidden="true">
        <Image src={p.image} alt={p.imageAlt || ""} fill sizes={sizes} priority={priority} />
      </Link>
      {credit && p.imageCredit && (
        <figcaption className="bj-cr">
          {p.imageSource ? <a href={p.imageSource} rel="noopener nofollow" target="_blank">{shortCredit(p.imageCredit)}</a> : shortCredit(p.imageCredit)}
        </figcaption>
      )}
    </figure>
  );
}

// A story without a photo is set in type on paper inside a fine gold frame, so it reads as a designed cover, not a gap.
// The card carries the headline itself (no second headline under it).
function Story({ p, sizes, big = false }) {
  if (!p.image) {
    return (
      <article className={`bj-s bj-tc r32${big ? " bj-big" : " sm"}`}>
        <span className="tc-k">{p.category}</span>
        <h3 className="tc-t bj-t"><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
        <span className="tc-r" aria-hidden="true" />
        <p className="tc-q">{clip(p.excerpt, big ? 200 : 120)}</p>
        <p className="tc-m"><Meta p={p} /></p>
        <span className="tc-o" aria-hidden="true">P</span>
      </article>
    );
  }
  return (
    <article className={`bj-s${big ? " bj-big" : ""}`}>
      <Photo p={p} sizes={sizes} />
      <span className="bj-k" style={{ marginTop: 14 }}>{p.category}</span>
      <h3 className="bj-t"><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
      <p className="bj-x">{clip(p.excerpt, big ? 220 : 150)}</p>
      <Meta p={p} />
    </article>
  );
}

function ListItem({ p }) {
  return (
    <article className="bj-li">
      <div>
        <h3 className="bj-t"><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
        <Meta p={p} />
      </div>
      {p.image ? (
        <Link href={`/blog/${p.slug}`} className="bj-img r43" tabIndex={-1} aria-hidden="true">
          <Image src={p.image} alt="" width={96} height={72} style={{ width: "100%", height: "100%" }} />
        </Link>
      ) : (
        <Link href={`/blog/${p.slug}`} className="bj-tc thumb r43" tabIndex={-1} aria-hidden="true"><span className="tc-g">{p.category.charAt(0)}</span></Link>
      )}
    </article>
  );
}

function Month({ m }) {
  return (
    <div className="bj-mo">
      <h3 className="bj-mo-h">{m.key}<small>{m.posts.length} {m.posts.length === 1 ? "story" : "stories"}</small></h3>
      <ul>
        {m.posts.map((p) => (
          <li key={p.slug}>
            <span className="d">{fmtDate(p, { day: "2-digit", timeZone: "UTC" })}</span>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BlogListPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => ts(b) - ts(a));
  const withPhoto = posts.filter((p) => p.image);
  const lead = withPhoto[0];
  const second = withPhoto.slice(1, 4);
  const used = new Set([lead, ...second].filter(Boolean).map((p) => p.slug));
  const mostRead = MOST_READ.map((s) => BLOG_POSTS.find((p) => p.slug === s)).filter(Boolean);

  const desks = DESKS.map((d) => {
    const all = posts.filter((p) => d.cats.includes(p.category));
    const free = all.filter((p) => !used.has(p.slug));
    const big = free.find((p) => p.image) || free[0];
    // A story without a photo gets the typographic card under the list; the list itself takes the next three.
    const card = free.find((p) => p !== big && !p.image);
    const rest = free.filter((p) => p !== big && p !== card).slice(0, card ? 3 : 4);
    [big, card, ...rest].forEach((p) => p && used.add(p.slug));
    return { ...d, total: all.length, big, card, rest };
  }).filter((d) => d.big);

  // Archive by month, newest first: the two latest months open, older months behind one <details> (links stay in the HTML).
  const months = [];
  for (const p of posts) {
    const key = fmtDate(p, { month: "long", year: "numeric" });
    const last = months[months.length - 1];
    if (last && last.key === key) last.posts.push(p);
    else months.push({ key, posts: [p] });
  }
  const openMonths = months.slice(0, 2);
  const olderMonths = months.slice(2);
  const olderCount = olderMonths.reduce((n, m) => n + m.posts.length, 0);
  const latestLong = posts[0] ? fmtDate(posts[0], { day: "numeric", month: "long", year: "numeric" }) : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE}/blog#blog`,
        name: "The Potatopedia Journal",
        alternateName: "Potatopedia Blog",
        description: "Reporting on the world's potato industry: country case studies, markets, varieties, processing and science, every figure sourced and dated.",
        url: `${SITE}/blog`,
        inLanguage: "en",
        publisher: { "@id": `${SITE}/#publisher` },
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: { "@id": `${SITE}/blog#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/blog#list`,
        name: "Stories in The Potatopedia Journal",
        numberOfItems: posts.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/blog/${p.slug}` })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": `${SITE}/`, name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": `${SITE}/blog`, name: "Blog" } },
        ],
      },
    ],
  };

  return (
    <div className="bj">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="bj-wrap bj-mast">
        <div className="bj-dl">
          <span>{posts.length} stories</span>
          <span className="hide-s">Sourced · Dated · Neutral</span>
          <span>Latest {latestLong}</span>
        </div>
        <h1 className="bj-h1 rise">The Potatopedia <em>Journal</em></h1>
        <p className="bj-sf">Reporting on the world&rsquo;s potato industry — sourced, dated, neutral.</p>
        <div className="bj-rule" aria-hidden="true" />
        <nav className="bj-nav" aria-label="Sections">
          {desks.map((d) => <a key={d.id} href={`#${d.id}`}>{d.label}</a>)}
          <a href="#archive">Archive</a>
        </nav>
      </header>

      {lead && (
        <section className="bj-wrap bj-lead" aria-label="Lead story">
          <Photo p={lead} ratio="r219" sizes="(max-width: 640px) 100vw, (max-width: 1264px) calc(100vw - 64px), 1136px" priority />
          <div className="bj-lead-g">
            <div>
              <span className="bj-k">{lead.category}</span>
              <h2 className="bj-lead-t bj-t"><Link href={`/blog/${lead.slug}`}>{lead.title}</Link></h2>
            </div>
            <div>
              <p className="bj-lead-s">{lead.excerpt}</p>
              <Meta p={lead} />
              <br />
              <Link href={`/blog/${lead.slug}`} className="bj-more">Read the story <span className="arr" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      )}

      <section className="bj-wrap" aria-label="Featured stories">
        <div className="bj-row2">
          <div className="bj-three">
            {second.map((p) => <Story key={p.slug} p={p} sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 280px" />)}
          </div>
          <aside className="bj-mr" aria-labelledby="bj-mr-h">
            <h2 id="bj-mr-h" className="bj-mr-h">Most read</h2>
            <ol>
              {mostRead.map((p, i) => (
                <li key={p.slug}>
                  <span className="n" aria-hidden="true">{i + 1}</span>
                  <div>
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                    <span className="bj-k">{p.category}</span>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="bj-news" aria-labelledby="bj-news-h">
        <div className="bj-wrap bj-news-in">
          <div>
            <span className="bj-k">The newsletter</span>
            <h2 id="bj-news-h" className="bj-news-t">The Potato <em>Week</em></h2>
            <p className="bj-news-s">The week&rsquo;s best stories and data from the world&rsquo;s potato industry, every figure sourced. Once a week, free.</p>
          </div>
          <div style={{ width: "100%" }}>
            <LeadForm dark type="newsletter" askName={false} askCompany={false} askCountry={false} askMessage={false} submitLabel="Subscribe" compact />
          </div>
        </div>
      </section>

      <div className="bj-wrap">
        {desks.map((d, i) => (
          <section key={d.id} id={d.id} className={`bj-desk${i % 2 ? " flip" : ""}`} aria-labelledby={`h-${d.id}`}>
            <div className="bj-desk-h">
              <h2 id={`h-${d.id}`} className="bj-desk-t">{d.label}</h2>
              <span className="bj-desk-d">{d.dek} · {d.total} {d.total === 1 ? "story" : "stories"}</span>
            </div>
            <div className="bj-desk-g">
              <Story p={d.big} big sizes="(max-width: 900px) 100vw, 660px" />
              {(d.rest.length > 0 || d.card) && (
                <div className="bj-list">
                  {d.rest.map((p) => <ListItem key={p.slug} p={p} />)}
                  {d.card && <Story p={d.card} />}
                </div>
              )}
            </div>
          </section>
        ))}

        <div className="bj-rep">
          <p>Country reports <span>— China, India, the United States and the Netherlands, designed and sourced.</span></p>
          <Link href="/reports">Get the country reports <span className="arr" aria-hidden="true">→</span></Link>
        </div>

        <section id="archive" className="bj-arc" aria-labelledby="bj-arc-h">
          <div className="bj-desk-h">
            <h2 id="bj-arc-h" className="bj-desk-t">Archive</h2>
            <span className="bj-desk-d">Every story, newest first</span>
          </div>
          {openMonths.map((m) => <Month key={m.key} m={m} />)}
          {olderMonths.length > 0 && (
            <details className="bj-earlier">
              <summary>Earlier: {olderMonths.map((m) => m.key).join(", ")} ({olderCount} stories) ↓</summary>
              {olderMonths.map((m) => <Month key={m.key} m={m} />)}
            </details>
          )}
        </section>
      </div>
    </div>
  );
}
