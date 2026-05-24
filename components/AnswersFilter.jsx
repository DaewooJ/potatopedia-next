"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function AnswersFilter({ answers }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const cats = [...new Set(answers.map((a) => a.category))].sort();
    return ["All", ...cats];
  }, [answers]);

  const filtered = useMemo(() => {
    return answers.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!a.question.toLowerCase().includes(q) && !a.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [answers, category, search]);

  return (
    <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
      {/* Filter bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: "white", borderRadius: 12, border: "1.5px solid #eee", padding: "0 14px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", padding: "10px 0", background: "transparent", color: "#333" }}
            />
          </div>
          <span style={{ fontSize: 13, color: "#999", fontWeight: 500, whiteSpace: "nowrap" }}>
            Showing {filtered.length} of {answers.length} questions
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

      {/* Answer cards grid */}
      <div className="pp-categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {answers.map((pa) => {
          const visible = filtered.includes(pa);
          return (
            <Link
              key={pa.slug}
              href={"/answers/" + pa.slug}
              className="pp-country-card"
              style={{
                display: visible ? "block" : "none",
                padding: "20px 24px", borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.06)", background: "#fff",
                textDecoration: "none", position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <span style={{
                    display: "inline-block", fontSize: 10, fontWeight: 700,
                    color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5,
                    background: "rgba(198,40,40,0.06)", padding: "3px 10px",
                    borderRadius: 6, marginBottom: 10,
                  }}>{pa.category}</span>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.5, margin: 0 }}>{pa.question}</h2>
                </div>
                <span style={{ fontSize: 18, color: "#ccc", flexShrink: 0, marginTop: 4 }}>&rarr;</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No questions match your filter.</p>
          <button onClick={() => { setCategory("All"); setSearch(""); }} style={{ fontSize: 14, color: "#C62828", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Clear filters</button>
        </div>
      )}
    </section>
  );
}
