import Link from "next/link";
import { BLOG_POSTS } from "../../lib/data";
import { ppCSS } from "../../lib/styles";
import BlogFilter from "../../components/BlogFilter";
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

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A", overflowX: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <style>{`
        @media(max-width:768px){
          .pp-blog-grid{grid-template-columns:1fr !important;gap:16px !important}
          .pp-blog-section{padding-left:20px !important;padding-right:20px !important}
          .pp-blog-featured-grid{grid-template-columns:1fr !important}
          .pp-blog-stats{grid-template-columns:repeat(2,1fr) !important;gap:16px !important}
          .pp-blog-region-grid{grid-template-columns:1fr 1fr !important}
        }
        .pp-blog-card{transition:all 0.3s ease}
        .pp-blog-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(0,0,0,0.1) !important}
        .pp-blog-featured-card{transition:transform 0.2s ease, box-shadow 0.2s ease}
        .pp-blog-featured-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.08)}
        ${ppCSS}
      `}</style>

      {/* Hero */}
      <section style={{ paddingTop: 72, paddingBottom: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle,rgba(198,40,40,0.04) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 20 }}>Potatopedia Blog</span>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 14 }}>
            Stories &amp; Analysis from<br />
            <span style={{ background: "linear-gradient(135deg,#C62828,#E53935)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Global Potato Industry</span>
          </h1>
          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 8px" }}>
            Country case studies, market trends, processing intelligence, and trade flows &mdash; the stories behind the numbers.
          </p>
          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
            Looking for evergreen reference data? Visit the <Link href="/knowledge" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Knowledge Hub</Link>.
          </p>
        </div>
      </section>

      {/* Stats banner */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div className="pp-blog-stats" style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 48px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>{totalPosts}</div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Articles published</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>9+</div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Countries covered</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>{totalCategories}</div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Topic categories</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>{latestDateStr || "—"}</div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Latest publication</div>
          </div>
        </div>
      </section>

      {/* Featured posts — magazine-style 1 hero + 2 secondary */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 48px 24px" }} className="pp-blog-section">
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Featured stories</span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.7, margin: 0 }}>Latest from Potatopedia</h2>
          </div>
          <Link href="#all-articles" style={{ fontSize: 13, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>Browse all {totalPosts} →</Link>
        </div>

        {featured.length > 0 && (
          <div className="pp-blog-featured-magazine" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 28, marginBottom: 28 }}>
            {/* Hero feature — first post, large treatment */}
            <Link href={`/blog/${featured[0].slug}`} className="pp-blog-featured-hero" style={{ display: "block", textDecoration: "none", color: "inherit", padding: "32px 36px", background: "#fff", border: "1px solid #ececec", borderRadius: 16, transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.8 }}>{featured[0].category}</span>
                <span style={{ color: "#ddd" }}>·</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Featured</span>
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.8, lineHeight: 1.18, margin: "0 0 14px" }}>{featured[0].title}</h3>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.65, margin: "0 0 18px" }}>{featured[0].excerpt}</p>
              <div style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 8 }}>
                <span>{featured[0].date}</span>
                <span style={{ color: "#ddd" }}>·</span>
                <span>{featured[0].readTime}</span>
                <span style={{ color: "#ddd" }}>·</span>
                <span style={{ color: "#C62828", fontWeight: 600 }}>Read story →</span>
              </div>
            </Link>

            {/* Secondary features — posts 2-3, stacked */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {featured.slice(1, 3).map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="pp-blog-featured-side" style={{ display: "block", textDecoration: "none", color: "inherit", padding: "20px 22px", background: "#fff", border: "1px solid #ececec", borderRadius: 12, flex: 1, transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5 }}>{p.category}</span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, margin: "0 0 8px", letterSpacing: -0.3 }}>{p.title}</h4>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, margin: "0 0 10px" }}>{p.excerpt.length > 110 ? p.excerpt.slice(0, 108) + "…" : p.excerpt}</p>
                  <div style={{ fontSize: 11, color: "#999" }}>{p.date} · {p.readTime}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <style>{`
          .pp-blog-featured-hero:hover, .pp-blog-featured-side:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.05); border-color: rgba(198,40,40,0.25); }
          .pp-blog-featured-hero:hover h3, .pp-blog-featured-side:hover h4 { color: #C62828 !important; }
          @media (max-width: 768px) {
            .pp-blog-featured-magazine { grid-template-columns: 1fr !important; gap: 14px !important; }
            .pp-blog-featured-hero { padding: 24px 22px !important; }
            .pp-blog-featured-hero h3 { font-size: 22px !important; }
          }
        `}</style>
      </section>

      {/* Blog vs Knowledge differentiator */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 48px 16px" }} className="pp-blog-section">
        <div style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#FFF8F8 100%)", border: "1px solid rgba(198,40,40,0.12)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Blog vs Knowledge Hub</div>
            <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, margin: 0 }}>
              <strong>Blog</strong> is for stories, country case studies, and market trends &mdash; the <em>narrative</em> behind the data. <strong>Knowledge Hub</strong> is for evergreen reference articles &mdash; FAQ-driven, citation-heavy, structured tables.
            </p>
          </div>
          <Link href="/knowledge" style={{ display: "inline-block", padding: "10px 20px", borderRadius: 10, border: "1px solid #C62828", color: "#C62828", textDecoration: "none", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
            Knowledge Hub &rarr;
          </Link>
        </div>
      </section>

      {/* Filter + Grid (client island) */}
      <section id="all-articles" style={{ paddingTop: 24, scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px 8px" }} className="pp-blog-section">
          <div style={{ textAlign: "left" }}>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 6 }}>All articles</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.7, margin: "0 0 8px" }}>Browse the full archive</h2>
            <p style={{ fontSize: 13, color: "#777", margin: "0 0 16px" }}>Filter by category or search by keyword.</p>
          </div>
        </div>
        <BlogFilter posts={BLOG_POSTS} />
      </section>

      {/* Regional coverage */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 48px" }} className="pp-blog-section">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Coverage by region</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.7, margin: 0 }}>Stories from every continent</h2>
          </div>
          <div className="pp-blog-region-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
            {REGIONS.map((r) => (
              <div key={r.label} style={{ padding: 16, background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 10 }}>{r.slugs.length} {r.slugs.length === 1 ? "article" : "articles"}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {r.slugs.map((s) => {
                    const post = BLOG_POSTS.find((p) => p.slug === s);
                    if (!post) return null;
                    return (
                      <Link key={s} href={`/blog/${s}`} style={{ fontSize: 11.5, color: "#C62828", textDecoration: "none", lineHeight: 1.4 }}>
                        {post.title.length > 50 ? post.title.slice(0, 48) + "…" : post.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link to other site sections */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 48px 24px", textAlign: "center" }} className="pp-blog-section">
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Beyond the blog</span>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.7, marginBottom: 24 }}>Explore the full Potatopedia platform</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, textAlign: "left" }}>
          <Link href="/knowledge" style={{ padding: 18, background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12, textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>📚</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Knowledge Hub</div>
            <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>29 evergreen reference articles with citations and structured data.</div>
          </Link>
          <Link href="/countries" style={{ padding: 18, background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12, textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>🌍</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Country Profiles</div>
            <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>31 country pages including 5 premium dossiers (India, China, Belgium, Netherlands, USA) with PDF reports.</div>
          </Link>
          <Link href="/ask" style={{ padding: 18, background: "linear-gradient(135deg,#C62828,#E53935)", border: "1px solid #C62828", borderRadius: 12, textDecoration: "none", color: "#fff" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>⚡</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Ask the AI</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>Natural-language search across 5,657 verified data points. Cited answers in seconds.</div>
          </Link>
          <Link href="/answers" style={{ padding: 18, background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12, textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>💡</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Quick Answers</div>
            <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>70+ direct answers to common potato questions, each with cited sources.</div>
          </Link>
        </div>
      </section>

      {/* Content Request CTA */}
      <section style={{ padding: "20px 24px 80px", background: "transparent" }}>
        <ContentRequestCTA pageContext="Blog index" />
      </section>
    </div>
  );
}
