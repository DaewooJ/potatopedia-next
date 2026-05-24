"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function BlogFilter({ posts }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category))].sort();
    return ["All", ...cats];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.excerpt.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [posts, category, search]);

  return (
    <>
      {/* Filter bar */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: "white", borderRadius: 12, border: "1.5px solid #eee", padding: "0 14px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", padding: "10px 0", background: "transparent", color: "#333" }}
            />
          </div>
          <span style={{ fontSize: 13, color: "#999", fontWeight: 500, whiteSpace: "nowrap" }}>
            Showing {filtered.length} of {posts.length} posts
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button
              key={c}
              className="pp-pill"
              onClick={() => setCategory(c)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "1px solid",
                borderColor: category === c ? "#C62828" : "#e0e0e0",
                background: category === c ? "#C62828" : "white",
                color: category === c ? "white" : "#666",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Blog grid — typographic, no gradient cards */}
      <div className="pp-blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, maxWidth: 1080, margin: "0 auto", padding: "0 48px 80px" }}>
        {posts.map((post) => {
          const visible = filtered.includes(post);
          return (
            <Link
              key={post.slug}
              href={"/blog/" + post.slug}
              className="pp-blog-card"
              style={{
                textDecoration: "none", color: "inherit", background: "#fff",
                borderRadius: 12, padding: "20px 22px",
                border: "1px solid #ececec",
                display: visible ? "flex" : "none",
                flexDirection: "column",
                transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5 }}>{post.category}</span>
                <span style={{ color: "#ddd", fontSize: 11 }}>·</span>
                <span style={{ fontSize: 11, color: "#999" }}>{post.readTime}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, margin: "0 0 10px", letterSpacing: -0.3 }}>{post.title}</h3>
              <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, margin: 0, flex: 1 }}>{post.excerpt}</p>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0f0f0", fontSize: 11, color: "#999" }}>{post.date}</div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .pp-blog-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.05);
          border-color: rgba(198,40,40,0.25) !important;
        }
        .pp-blog-card:hover h3 { color: #C62828 !important; }
      `}</style>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 24px 80px", color: "#999" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No articles match your filter.</p>
          <button onClick={() => { setCategory("All"); setSearch(""); }} style={{ fontSize: 14, color: "#C62828", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Clear filters</button>
        </div>
      )}
    </>
  );
}
