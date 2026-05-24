import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "../../../lib/data";
import ReadingProgressBar from "../../../components/ReadingProgressBar";
import BlogTOC from "../../../components/BlogTOC";
import BlogShare from "../../../components/BlogShare";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, SPEAKABLE } from "../../../lib/authors";

function slugifyHeading(s) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toRoman(n) {
  const map = [["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]];
  let r = "";
  let x = n;
  for (const [sym, val] of map) {
    while (x >= val) { r += sym; x -= val; }
  }
  return r;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  // Tight title (<70 chars) — trim if blog title is long; keep H1 long internally.
  // Layout adds " — Potatopedia" (15 chars) suffix, so target per-page <55 to keep SERP title <70.
  const t = String(post.title || "").trim();
  const title = t.length > 55 ? t.slice(0, 52).trimEnd() + "…" : t;
  // Tight meta description (<160 chars) — first sentence of excerpt.
  const ex = String(post.excerpt || "").replace(/\s+/g, " ").trim();
  const firstSentence = ex.split(/(?<=[.!?])\s+/)[0] || ex;
  const desc = firstSentence.length > 155 ? firstSentence.slice(0, 152).trimEnd() + "…" : firstSentence;
  return {
    title,
    description: desc,
    alternates: { canonical: "https://www.potatopedia.com/blog/" + slug },
    openGraph: {
      title,
      description: desc,
      type: "article",
      url: "https://www.potatopedia.com/blog/" + slug,
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

function splitSources(text) {
  // Source blocks typically start with "Sources:" — strip prefix and split on common separators
  const cleaned = text.replace(/^\s*Sources?:\s*/i, "");
  // Split on "; " (preferred) or ", " when neither contains digits adjacent
  if (cleaned.includes(";")) return cleaned.split(/\s*;\s*/).filter(Boolean);
  return cleaned.split(/,\s+(?=[A-Z])/).filter(Boolean);
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const pageUrl = "https://www.potatopedia.com/blog/" + slug;
  const wordCount = post.content
    .filter((b) => b.type === "p")
    .map((b) => b.text)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  const isoDate = post.dateISO || (() => {
    const d = new Date(post.date);
    return isNaN(d.getTime()) ? "2026-04-01" : d.toISOString().split("T")[0];
  })();

  // Generate 6 PAA-aligned FAQ items from the blog's H2 sections + topic.
  // Drives AI Overview citation pickup (60% lift per 2026 Phase 1 research).
  const blogFaqItems = (() => {
    const h2s = post.content.filter((b) => b.type === "h2").slice(0, 6);
    if (h2s.length >= 4) {
      return h2s.map((h, i) => {
        // Find the next 1-2 paragraphs after this H2 to use as the answer.
        const idx = post.content.findIndex((b) => b === h);
        const nextParas = post.content
          .slice(idx + 1, idx + 4)
          .filter((b) => b.type === "p" || b.type === "intro")
          .slice(0, 2)
          .map((b) => b.text)
          .join(" ");
        // Strip markdown bold + clip to ~600 chars
        const a = nextParas.replace(/\*\*/g, "").replace(/\s+/g, " ").trim().slice(0, 600);
        // Convert H2 statement-style to question-style
        const q = h.text.endsWith("?") ? h.text : (h.text.match(/^(How|Why|What|Where|When|Who|Which|Is|Are|Does|Do|Can)\b/i) ? h.text + "?" : `${h.text}: how does this work?`);
        return { q, a };
      }).filter((it) => it.a.length > 50);
    }
    // Fallback for posts with thin H2 structure: derive from title + excerpt.
    return [
      { q: post.title.endsWith("?") ? post.title : `${post.title}?`, a: post.excerpt.replace(/\s+/g, " ").trim().slice(0, 600) },
    ];
  })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": pageUrl + "#article",
        headline: post.title,
        description: post.excerpt,
        datePublished: isoDate,
        dateModified: isoDate,
        wordCount,
        author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
        publisher: { "@id": "https://www.potatopedia.com/#publisher" },
        mainEntityOfPage: pageUrl,
        image: "https://www.potatopedia.com/og-image.png",
        articleSection: post.category,
        speakable: SPEAKABLE,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/blog", name: "Blog" } },
          { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: post.title } },
        ],
      },
      POTATOPEDIA_PUBLISHER,
    ],
  };
  // FAQPage schema as separate script (Google preferred pattern). Only emit if we have ≥4 FAQ items.
  const blogFaqLd = blogFaqItems.length >= 4 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: blogFaqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : null;

  // Related posts: same category first, then by recency. Top 3.
  const sameCat = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category);
  const otherCat = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category);
  const relatedPosts = [...sameCat, ...otherCat].slice(0, 3);

  // Build TOC + auto-key-takeaways from the H2 sections.
  // Track used heading slugs to avoid id collisions when a slug appears more than once.
  const _seen = {};
  const tocItems = post.content
    .filter((b) => b.type === "h2")
    .map((b) => {
      let slug = slugifyHeading(b.text);
      _seen[slug] = (_seen[slug] || 0) + 1;
      if (_seen[slug] > 1) slug = `${slug}-${_seen[slug]}`;
      return { id: slug, label: b.text };
    });
  // Map H2 text → slug for render time
  const _seenRender = {};
  const headingIdFor = (text) => {
    let slug = slugifyHeading(text);
    _seenRender[slug] = (_seenRender[slug] || 0) + 1;
    if (_seenRender[slug] > 1) slug = `${slug}-${_seenRender[slug]}`;
    return slug;
  };

  // Key takeaways: only show when manually-authored on the post.
  // Auto-extracting from H2s produces section titles, not real insights — better to omit.
  const keyTakeaways = post.takeaways && post.takeaways.length > 0 ? post.takeaways : null;

  const updatedDate = post.updatedISO || post.dateISO || isoDate;
  const updatedDisplay = post.updatedISO
    ? new Date(post.updatedISO).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        color: "#1A1A1A",
        width: "100%",
        overflowX: "hidden",
        fontFamily: "'Poppins',sans-serif",
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {blogFaqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogFaqLd) }} />}
      <ReadingProgressBar />
      <style>{`
        .pp-blog-article { padding: 96px 24px 56px; max-width: 720px; margin: 0 auto; }
        .pp-blog-h2-wrap { margin-top: 56px; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #ececec; }
        .pp-blog-h2-num { display: block; font-size: 11px; font-weight: 700; color: #C62828; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 6px; font-feature-settings: "smcp"; }
        .pp-blog-h2 { font-size: 24px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.4px; line-height: 1.25; margin: 0; }
        .pp-blog-p { font-size: 17px; line-height: 1.72; color: #2c2c2c; margin-bottom: 22px; font-weight: 400; }
        .pp-blog-p--drop::first-letter { font-size: 64px; font-weight: 800; float: left; line-height: 0.86; margin-right: 10px; margin-top: 5px; color: #1A1A1A; letter-spacing: -1px; }
        .pp-blog-sources { margin-top: 48px; padding-top: 20px; border-top: 1px solid #ececec; }
        .pp-blog-sources summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 0; }
        .pp-blog-sources summary::-webkit-details-marker { display: none; }
        .pp-blog-sources summary:hover { color: #555; }
        .pp-blog-sources-chevron { font-size: 13px; color: #bbb; transition: transform 0.18s ease; }
        .pp-blog-sources[open] .pp-blog-sources-chevron { transform: rotate(180deg); }
        .pp-blog-sources ul { list-style: none; padding: 0; margin: 14px 0 0; }
        .pp-blog-sources li { font-size: 12.5px; color: #777; line-height: 1.6; padding: 6px 0; border-bottom: 1px solid #f5f5f5; }
        .pp-blog-sources li:last-child { border-bottom: none; }
        .pp-blog-related { margin-top: 64px; padding-top: 40px; border-top: 1px solid #ececec; }
        .pp-blog-related-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) {
          .pp-blog-article { padding: 80px 18px 40px !important; }
          .pp-blog-h2 { font-size: 21px !important; margin-top: 40px !important; }
          .pp-blog-p { font-size: 16.5px !important; line-height: 1.7 !important; }
          .pp-blog-related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <article className="pp-blog-article">
        {/* Breadcrumb / back */}
        <div style={{ marginBottom: 28, fontSize: 13, color: "#888" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "#ddd", margin: "0 8px" }}>/</span>
          <Link href="/blog" style={{ color: "#888", textDecoration: "none" }}>Blog</Link>
          <span style={{ color: "#ddd", margin: "0 8px" }}>/</span>
          <span style={{ color: "#C62828", fontWeight: 600 }}>{post.category}</span>
        </div>

        {/* Hero — typographic, no gradient card */}
        <header style={{ marginBottom: 40 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>
            {post.category}
          </span>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.6, lineHeight: 1.12, margin: "0 0 18px" }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 19, color: "#444", lineHeight: 1.55, fontWeight: 400, margin: "0 0 26px", maxWidth: 660 }}>
            {post.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", borderTop: "1px solid #ececec", borderBottom: "1px solid #ececec", padding: "16px 0", fontSize: 13, color: "#888" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#C62828,#8E0000)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, letterSpacing: -0.5 }}>P</div>
              <span style={{ color: "#444", fontWeight: 600 }}>Potatopedia Editorial</span>
            </div>
            <span style={{ color: "#ddd" }}>·</span>
            <time dateTime={isoDate}>{post.date}</time>
            {updatedDisplay && updatedDate !== isoDate && (
              <>
                <span style={{ color: "#ddd" }}>·</span>
                <span style={{ color: "#666" }}>Updated {updatedDisplay}</span>
              </>
            )}
            <span style={{ color: "#ddd" }}>·</span>
            <span>{post.readTime}</span>
            <span style={{ color: "#ddd" }}>·</span>
            <span>{wordCount.toLocaleString()} words</span>
          </div>
          <BlogShare url={pageUrl} title={post.title} />
        </header>

        {/* Key takeaways */}
        {keyTakeaways && keyTakeaways.length > 0 && (
          <aside style={{ marginBottom: 32, padding: "20px 24px", background: "rgba(198,40,40,0.03)", border: "1px solid rgba(198,40,40,0.12)", borderRadius: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.8, marginBottom: 12 }}>Key takeaways</div>
            <ul style={{ margin: 0, paddingLeft: 22, color: "#333", fontSize: 14.5, lineHeight: 1.65 }}>
              {keyTakeaways.map((t, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{t}</li>
              ))}
            </ul>
          </aside>
        )}

        {/* Table of contents (auto-collapses on short posts via component) */}
        <BlogTOC items={tocItems} />

        {/* Content blocks */}
        {(() => {
          let h2n = 0;
          let firstP = true;
          const longForm = true; // drop-cap applies to every blog post
          return post.content.map((block, i) => {
          if (block.type === "h2") {
            h2n += 1;
            const hid = headingIdFor(block.text);
            return (
              <div key={i} className="pp-blog-h2-wrap">
                <span className="pp-blog-h2-num">{toRoman(h2n)} · Section</span>
                <h2 id={hid} className="pp-blog-h2">{block.text}</h2>
              </div>
            );
          }
          if (block.type === "source") {
            const items = splitSources(block.text);
            return (
              <details key={i} className="pp-blog-sources">
                <summary>
                  <span>Sources &amp; methodology ({items.length})</span>
                  <span className="pp-blog-sources-chevron" aria-hidden="true">▾</span>
                </summary>
                <ul>
                  {items.map((s, j) => (
                    <li key={j}>{s.trim()}</li>
                  ))}
                </ul>
              </details>
            );
          }
          if (block.type === "links") {
            return (
              <div key={i} style={{ margin: "32px 0", padding: "20px 24px", background: "rgba(198,40,40,0.03)", border: "1px solid rgba(198,40,40,0.12)", borderRadius: 12 }}>
                {block.title && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
                    {block.title}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(block.items || []).map((it, j) => (
                    <Link key={j} href={it.href} style={{ fontSize: 14, color: "#C62828", textDecoration: "none", fontWeight: 500, lineHeight: 1.5 }}>
                      → {it.text}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }
          const isFirstP = block.type === "p" && firstP;
          if (block.type === "p") firstP = false;
          const cls = "pp-blog-p" + (isFirstP && longForm ? " pp-blog-p--drop" : "");
          return (
            <p key={i} className={cls}>{block.text}</p>
          );
        });
        })()}

        {/* Quiet attribution close */}
        <section style={{ marginTop: 56, padding: "28px 0 8px", borderTop: "1px solid #ececec" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#C62828,#8E0000)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, letterSpacing: -0.5, flexShrink: 0 }}>P</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>Potatopedia Editorial</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                The verified knowledge base for the global potato industry. 5,024 data points, 224 authoritative sources, 204 countries, 237 varieties &mdash; with cited AI Q&amp;A. <Link href="/about" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>About our methodology →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="pp-blog-related">
            <div style={{ marginBottom: 18 }}>
              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Continue reading</span>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.6, margin: 0 }}>More from Potatopedia</h2>
            </div>
            <div className="pp-blog-related-grid">
              {relatedPosts.map((p) => (
                <Link key={p.slug} href={"/blog/" + p.slug} style={{ display: "block", textDecoration: "none", color: "inherit", padding: "18px 20px", border: "1px solid #ececec", borderRadius: 12, background: "#fff" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>{p.category}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.35, marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 10 }}>{p.excerpt.length > 100 ? p.excerpt.slice(0, 100) + "…" : p.excerpt}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{p.date} · {p.readTime}</div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 18, textAlign: "center" }}>
              <Link href="/blog" style={{ display: "inline-block", padding: "10px 22px", borderRadius: 10, border: "1px solid #C62828", color: "#C62828", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Browse all 20 articles →
              </Link>
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
