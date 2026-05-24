import Link from "next/link";
import { BLOG_POSTS } from "../lib/data";

export default function RelatedBlogPosts({ slugs, title = "Related analysis", subtitle = "Story-format coverage of this topic from our blog." }) {
  if (!slugs || slugs.length === 0) return null;
  const posts = slugs
    .map((s) => BLOG_POSTS.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section style={{ margin: "32px 0", padding: "24px 26px", background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 14 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.8, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#777" }}>{subtitle}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: posts.length === 1 ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: "block", textDecoration: "none", color: "inherit", padding: "14px 16px", background: "#fff", border: "1px solid #ececec", borderRadius: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>{p.category}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.35, marginBottom: 6 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{p.excerpt.length > 110 ? p.excerpt.slice(0, 110) + "…" : p.excerpt}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
