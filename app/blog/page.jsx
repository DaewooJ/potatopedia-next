import Link from "next/link";
import { POPULAR_ANSWERS } from "../../lib/data";
import { BLOG_POSTS } from "../../lib/blog-posts";
import LeadForm from "../../components/LeadForm";

import ContentRequestCTA from "../../components/ContentRequestCTA";

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

const REGIONS = [
  { label: "Asia & South Asia", countries: ["China", "India", "Pakistan", "Bangladesh"], slugs: ["pakistan-potato-explosion", "india-potato-production-by-state", "how-potatoes-came-to-china"] },
  { label: "Europe", countries: ["Belgium", "Netherlands", "Germany", "UK"], slugs: ["belgium-worlds-fry-capital", "european-potato-trade-guide"] },
  { label: "Africa & Middle East", countries: ["Egypt", "Kenya", "Saudi Arabia"], slugs: ["egypt-365-day-potatoes"] },
  { label: "Americas", countries: ["United States", "Peru", "Argentina"], slugs: ["us-potato-production-by-state"] },
  { label: "Global trends", countries: ["FAOSTAT", "UN Comtrade"], slugs: ["world-potato-production-trends", "global-potato-market-2024"] },
];

export default function BlogListPage() {
  const featured = BLOG_POSTS.slice(0, 3);
  const totalPosts = BLOG_POSTS.length;
  const totalCategories = [...new Set(BLOG_POSTS.map((p) => p.category))].length;
  const latestDate = BLOG_POSTS.reduce((latest, p) => {
    const d = new Date(p.date);
    return !isNaN(d.getTime()) && d > latest ? d : latest;
  }, new Date(0));
  const latestDateStr = latestDate.getTime() > 0
    ? latestDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://www.potatopedia.com/blog",
    name: "Potatopedia Blog",
    description: "Story-driven analysis of the global potato industry — country case studies, market trends, processing intelligence, and trade flows backed by verified data.",
    url: "https://www.potatopedia.com/blog",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Potatopedia",
      url: "https://www.potatopedia.com",
      logo: { "@type": "ImageObject", url: "https://www.potatopedia.com/logo.png" },
    },
    blogPost: BLOG_POSTS.map((p) => {
      const isoDate = (() => {
        const d = new Date(p.date);
        return isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
      })();
      const post = {
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        url: `https://www.potatopedia.com/blog/${p.slug}`,
        articleSection: p.category,
        author: { "@type": "Organization", name: "Potatopedia" },
      };
      if (isoDate) post.datePublished = isoDate;
      if (p.image) post.image = "https://www.potatopedia.com" + p.image;
      return post;
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
      { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/blog", name: "Blog" } },
    ],
  };

  // Magazine layout (premium system, 7 Nov 2026): lead story + latest, then every story by desk.
  const DESKS = [
    { id: "agronomy", label: "Agronomy", cats: ["Agronomy", "Cultivation", "Seed Systems", "Storage"] },
    { id: "industry-trade", label: "Industry & Trade", cats: ["Industry & Trade", "Trade & Industry", "Processing", "Production", "Global Trends", "Consumption"] },
    { id: "nutrition", label: "Nutrition", cats: ["Nutrition"] },
    { id: "around-the-world", label: "Around the World", cats: ["Around the World", "Country Profile"] },
    { id: "history-culture", label: "History & Culture", cats: ["History & Culture"] },
    { id: "varieties", label: "Varieties", cats: ["Varieties"] },
  ];
  const lead = BLOG_POSTS[0];
  const latest = BLOG_POSTS.slice(1, 5);
  const shownTop = new Set([lead, ...latest].map((p) => p.slug));
  const deskPosts = DESKS.map((d) => ({ ...d, posts: BLOG_POSTS.filter((p) => d.cats.includes(p.category) && !shownTop.has(p.slug)) }));
  const otherPosts = BLOG_POSTS.filter((p) => !shownTop.has(p.slug) && !DESKS.some((d) => d.cats.includes(p.category)));
  const minutes = (p) => String(p.readTime || "").replace(/\s*read$/i, "").toUpperCase();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="mg-mast">
        <div className="mg-mast-row">
          <h1 className="mg-h1 rise">The Potato <em>Review</em></h1>
          <p className="mg-dek">
            Stories and analysis from the global potato industry, every figure sourced. {totalPosts} stories{latestDateStr ? `, latest ${latestDateStr}` : ""}. For evergreen reference data, see the <Link href="/knowledge" className="gl">Knowledge Hub</Link>.
          </p>
        </div>
        <nav className="mg-cats" aria-label="Desks">
          <a href="#latest" className="is-on">All</a>
          {DESKS.map((d) => <a key={d.id} href={`#${d.id}`}>{d.label}</a>)}
        </nav>
      </section>

      <section className="mg-sec" id="latest">
        <div className="mg-lead-row">
          <Link href={`/blog/${lead.slug}`} className="mg-lead">
            {lead.image && <img src={lead.image} alt={lead.imageAlt || ""} title={lead.imageCredit || undefined} className="mg-lead-img" loading="eager" />}
            <p className="mg-lead-k">{lead.category} · {minutes(lead)}</p>
            <h2 className="mg-lead-t">{lead.title}</h2>
            <p className="mg-lead-s">{lead.excerpt}</p>
            {lead.takeaways?.length > 0 && (
              <ul className="mg-lead-take">
                {lead.takeaways.slice(0, 2).map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            )}
          </Link>
          <div className="mg-latest">
            <p className="k k-mute" style={{ marginBottom: 6 }}>Latest</p>
            {latest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="mg-row">
                <span className="mg-row-k">{p.category}</span>
                <span className="mg-row-t">{p.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mg-news" aria-labelledby="mg-news-h">
        <div className="mg-news-in">
          <div style={{ flex: 1 }}>
            <p id="mg-news-h" className="mg-news-t">The Potato Week</p>
            <p className="mg-news-s">The best new stories and data, once a week. Free.</p>
          </div>
          <div style={{ flex: 1, width: "100%" }}>
            <LeadForm dark type="newsletter" askName={false} askCompany={false} askCountry={false} askMessage={false} submitLabel="Subscribe" compact />
          </div>
        </div>
      </section>

      {deskPosts.filter((d) => d.posts.length > 0).map((d, di) => (
        <section key={d.id} id={d.id} className="mg-sec" style={{ scrollMarginTop: 90 }}>
          <div className="mg-sec-h">
            <h2>{d.label}</h2>
            <span style={{ fontSize: 13, color: "var(--mute2)" }}>{d.posts.length} {d.posts.length === 1 ? "story" : "stories"}</span>
          </div>
          <div className="mg-grid">
            {d.posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="mg-story">
                {p.image && <img src={p.image} alt={p.imageAlt || ""} title={p.imageCredit || undefined} className="mg-story-img" loading="lazy" />}
                <p className="mg-story-k">{p.category}</p>
                <span className="mg-story-t">{p.title}</span>
                <p className="mg-story-s">{p.excerpt.length > 140 ? p.excerpt.slice(0, 140).trimEnd() + "…" : p.excerpt}</p>
                <p className="mg-story-m">{p.date} · {p.readTime}</p>
              </Link>
            ))}
            {di === 0 && (
              <Link href="/#companies" className="mg-slot">
                <p className="mg-story-k" style={{ color: "var(--mute3)" }}>Published with us · partner content</p>
                <span className="mg-story-t">Your story, clearly labelled</span>
                <p className="mg-story-s">Makers, breeders and traders can publish here. Partner stories are always marked and never change a fact.</p>
              </Link>
            )}
          </div>
        </section>
      ))}

      {otherPosts.length > 0 && (
        <section className="mg-sec">
          <div className="mg-sec-h"><h2>More stories</h2></div>
          <div className="mg-grid">
            {otherPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="mg-story">
                {p.image && <img src={p.image} alt={p.imageAlt || ""} title={p.imageCredit || undefined} className="mg-story-img" loading="lazy" />}
                <p className="mg-story-k">{p.category}</p>
                <span className="mg-story-t">{p.title}</span>
                <p className="mg-story-m">{p.date} · {p.readTime}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="band" aria-labelledby="mg-region-h">
        <div className="band-in" style={{ maxWidth: 1136 }}>
          <h2 id="mg-region-h" className="band-h">By region</h2>
          <div className="grid-cards">
            {REGIONS.map((r) => {
              const posts = r.slugs.map((s) => BLOG_POSTS.find((p) => p.slug === s)).filter(Boolean);
              return (
                <div key={r.label} className="card">
                  <span className="card-k">{r.label}</span>
                  <span className="card-s" style={{ marginTop: 6 }}>{r.countries.join(" · ")}</span>
                  {posts.map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="gl" style={{ display: "block", marginTop: 10, fontSize: 14, lineHeight: 1.45 }}>{p.title}</Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 24px 80px" }}>
        <ContentRequestCTA pageContext="Blog index" />
      </section>
    </>
  );
}
