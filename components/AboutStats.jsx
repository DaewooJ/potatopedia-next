"use client";
import { useState, useEffect } from "react";
import { API } from "../lib/api";

export default function AboutStats() {
  const [stats, setStats] = useState({ dataPoints: "5,024", sources: "224" });
  useEffect(() => {
    fetch(API + "/stats").then(r => r.json()).then(d => {
      if (d.total_chunks) setStats({
        dataPoints: d.total_chunks.toLocaleString(),
        sources: d.unique_sources ? String(d.unique_sources) : "224",
      });
    }).catch(() => {});
  }, []);

  const items = [
    { v: stats.dataPoints, l: "Verified Data Points", ic: "\u{1F4CA}" },
    { v: stats.sources, l: "Authoritative Sources", ic: "\u{1F4DA}" },
    { v: "204", l: "Countries with Data", ic: "\u{1F30D}" },
    { v: "146+", l: "Potato Varieties", ic: "\u{1F954}" },
  ];

  return (
    <section style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 48px" }}>
        <div className="pp-about-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {items.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{s.ic}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
