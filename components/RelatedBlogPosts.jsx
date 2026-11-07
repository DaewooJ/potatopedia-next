import Link from "next/link";
import { BLOG_POSTS } from "../lib/blog-posts";

// Related blog stories as premium cards (used by country and knowledge pages).
export default function RelatedBlogPosts({ slugs, title = "Related analysis", subtitle = "Story-format coverage of this topic from our blog." }) {
  if (!slugs || slugs.length === 0) return null;
  const posts = slugs
    .map((s) => BLOG_POSTS.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section style={{ margin: "32px 0" }}>
      <p className="k" style={{ marginBottom: 6 }}>{title}</p>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--mute)" }}>{subtitle}</p>
      <div className="grid-cards">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
            <span className="card-k">{p.category}</span>
            <span className="card-t">{p.title}</span>
            <span className="card-s">{p.excerpt.length > 110 ? p.excerpt.slice(0, 110) + "…" : p.excerpt}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
