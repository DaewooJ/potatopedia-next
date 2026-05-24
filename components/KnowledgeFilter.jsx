"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function KnowledgeFilter({ cards }) {
  const [tag, setTag] = useState("All");
  const [search, setSearch] = useState("");

  const tags = useMemo(() => {
    const t = [...new Set(cards.map((c) => c.tag))].sort();
    return ["All", ...t];
  }, [cards]);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      if (tag !== "All" && c.tag !== tag) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q) && !c.tag.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [cards, tag, search]);

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>
      {/* Filter bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: "white", borderRadius: 12, border: "1.5px solid #eee", padding: "0 14px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search knowledge articles..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", padding: "10px 0", background: "transparent", color: "#333" }}
            />
          </div>
          <span style={{ fontSize: 13, color: "#999", fontWeight: 500, whiteSpace: "nowrap" }}>
            Showing {filtered.length} of {cards.length} articles
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tags.map((t) => (
            <button
              key={t}
              className="pp-pill"
              onClick={() => setTag(t)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "1px solid",
                borderColor: tag === t ? "#C62828" : "#e0e0e0",
                background: tag === t ? "#C62828" : "white",
                color: tag === t ? "white" : "#666",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {cards.map((c) => {
          const visible = filtered.includes(c);
          return (
            <Link key={c.slug} href={"/knowledge/" + c.slug} style={{ textDecoration: "none", color: "inherit", display: visible ? "block" : "none" }}>
              <div
                className="pp-cat-card"
                style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: "28px 24px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 28 }}>{c.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, background: "rgba(198,40,40,0.06)", padding: "3px 10px", borderRadius: 10 }}>{c.tag}</span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.35 }}>{c.title}</div>
                <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No articles match your filter.</p>
          <button onClick={() => { setTag("All"); setSearch(""); }} style={{ fontSize: 14, color: "#C62828", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
