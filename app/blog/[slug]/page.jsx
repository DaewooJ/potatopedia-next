import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "../../../lib/blog-posts";
import ReadingProgressBar from "../../../components/ReadingProgressBar";
import BlogTOC from "../../../components/BlogTOC";
import BlogShare from "../../../components/BlogShare";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, SPEAKABLE } from "../../../lib/authors";
import { applyOgOverride } from "../../../lib/og-overrides";
import { applySeoOverride } from "../../../lib/seo-overrides";
import { AccentTitle, SourceRoots, AskFollowUp, KeepReading } from "../../../components/Editorial";

function slugifyHeading(s) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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
  return applyOgOverride(applySeoOverride({
    title,
    description: desc,
    alternates: { canonical: "https://www.potatopedia.com/blog/" + slug },
    openGraph: {
      title,
      description: desc,
      type: "article",
      url: "https://www.potatopedia.com/blog/" + slug,
      images: post.image
        ? [{ url: "https://www.potatopedia.com" + post.image, alt: post.imageAlt || t }]
        : ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      ...(post.image ? { images: ["https://www.potatopedia.com" + post.image] } : {}),
    },
  }, "/blog/" + slug), "/blog/" + slug);
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
        image: post.image ? "https://www.potatopedia.com" + post.image : "https://www.potatopedia.com/og-image.png",
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

  // Sources: every "source" block of the post, split into individual citations.
  const sourceItems = post.content.filter((b) => b.type === "source").flatMap((b) => splitSources(b.text)).map((s) => s.trim()).filter(Boolean);
  const tocWithSources = sourceItems.length ? [...tocItems, { id: "sources", label: "Sources" }] : tocItems;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {blogFaqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogFaqLd) }} />}
      <ReadingProgressBar />

      <article className="ed">
        <header className="ed-head">
          <p className="eyebrow rise">
            <Link href="/blog">Blog</Link> · {post.category}
          </p>
          <h1 className="ed-h1 rise"><AccentTitle title={post.title} /></h1>
          <p className="ed-dek">{post.excerpt}</p>
          <p className="ed-by">
            Potatopedia Editorial<span className="dot">·</span>
            <time dateTime={isoDate}>{post.date}</time>
            {updatedDisplay && updatedDate !== isoDate && (
              <>
                <span className="dot">·</span>Updated {updatedDisplay}
              </>
            )}
            <span className="dot">·</span>{post.readTime}
            <span className="dot">·</span>{wordCount.toLocaleString()} words
          </p>
        </header>

        {/* Photo slot: rendered only when the post carries a real, credited image. */}
        {post.image && (
          <figure className="ed-fig">
            <img src={post.image} alt={post.imageAlt || ""} loading="eager" />
            {post.imageCredit && (
              <figcaption>
                {post.imageCredit}
                {post.imageSource && (
                  <>
                    {" · "}
                    <a href={post.imageSource} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>Source file</a>
                  </>
                )}
              </figcaption>
            )}
          </figure>
        )}

        <div className="ed-cols">
          <BlogTOC items={tocWithSources}>
            <BlogShare url={pageUrl} title={post.title} />
          </BlogTOC>

          <div className="ed-main">
            <BlogTOC items={tocWithSources} variant="inline" />

            {keyTakeaways && keyTakeaways.length > 0 && (
              <aside className="ed-take" aria-label="Key takeaways">
                <p className="k">Key takeaways</p>
                <ul>
                  {keyTakeaways.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </aside>
            )}

            {(() => {
              let firstP = true;
              let sourcesShown = false;
              return post.content.map((block, i) => {
                if (block.type === "h2") {
                  const hid = headingIdFor(block.text);
                  return <h2 key={i} id={hid} className="ed-h2">{block.text}</h2>;
                }
                if (block.type === "source") {
                  if (sourcesShown) return null;
                  sourcesShown = true;
                  return <SourceRoots key={i} items={sourceItems} />;
                }
                if (block.type === "links") {
                  return (
                    <nav key={i} className="ed-links" aria-label={block.title || "Related on Potatopedia"}>
                      <p className="k">{block.title || "Related on Potatopedia"}</p>
                      {(block.items || []).map((it, j) => (
                        <Link key={j} href={it.href}>{it.text} <span className="arr">→</span></Link>
                      ))}
                    </nav>
                  );
                }
                const isFirstP = block.type === "p" && firstP;
                if (block.type === "p") firstP = false;
                return (
                  <p key={i} className={"ed-p" + (isFirstP ? " ed-drop" : "")}>{block.text}</p>
                );
              });
            })()}

            <AskFollowUp placeholder={`Ask about ${post.category.toLowerCase()}…`} />

            <section className="ed-author" aria-label="About the author">
              <span className="ed-mono" aria-hidden="true">P</span>
              <div>
                <p className="ed-author-n">Potatopedia Editorial</p>
                <p className="ed-author-s">
                  The verified knowledge base for the global potato industry. 5,657 data points, 277 authoritative sources, 204 countries, 244 varieties &mdash; with cited AI Q&amp;A. <Link href="/about" className="gl">About our methodology <span className="arr">→</span></Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </article>

      <KeepReading
        items={relatedPosts.map((p) => ({ href: "/blog/" + p.slug, kicker: p.category, title: p.title, sub: `${p.date} · ${p.readTime}` }))}
        more={{ href: "/blog", label: `Browse all ${BLOG_POSTS.length} stories` }}
      />
    </>
  );
}
