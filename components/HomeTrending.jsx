"use client";

import { useState } from "react";
import Link from "next/link";
import { TRENDING } from "../lib/data";

export default function HomeTrending() {
  const [region, setRegion] = useState("Global");

  return (
    <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
      <div className="pp-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>Explore</span>
          <h2 className="pp-section-title" style={{ fontSize: 32, fontWeight: 700, color: "#1A1A1A", letterSpacing: -1 }}>Trending Questions</h2>
          <p style={{ fontSize: 14, color: "#888", marginTop: 8 }}>Discover what the world is asking about potatoes</p>
        </div>

        {/* Region tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
          {Object.keys(TRENDING).map((r) => (
            <button
              key={r}
              className="pp-pill"
              onClick={() => setRegion(r)}
              style={{ padding: "8px 20px", borderRadius: 20, border: "1px solid", borderColor: region === r ? "#C62828" : "#e0e0e0", background: region === r ? "#C62828" : "white", color: region === r ? "white" : "#666", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >{r}</button>
          ))}
        </div>

        {/* Question buttons */}
        <div className="pp-trending-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 900, margin: "0 auto" }}>
          {(TRENDING[region] || []).map((q, i) => (
            <Link
              key={i}
              href={"/ask?q=" + encodeURIComponent(q) + "&src=trending_widget"}
              className="pp-trending-btn"
              style={{ padding: "15px 20px", borderRadius: 12, border: "1px solid #e8e8e8", background: "white", fontSize: 14, color: "#444", cursor: "pointer", fontFamily: "inherit", textAlign: "left", fontWeight: 400, lineHeight: 1.5, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
            >
              <span className="pp-arr" style={{ color: "#C62828", fontSize: 16, flexShrink: 0 }}>&rarr;</span>{q}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
