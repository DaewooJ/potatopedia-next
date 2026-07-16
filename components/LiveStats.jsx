"use client";

import { useState, useEffect } from "react";
import { API } from "../lib/api";
import { COUNTRIES, POPULAR_ANSWERS } from "../lib/data";
import { VARIETIES } from "../lib/varieties-data";

const SvgGlobe = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const SvgDatabase = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>;
const SvgBookOpen = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const SvgMessage = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>;

export default function LiveStats() {
  const [stats, setStats] = useState({ dataPoints: "5,657", sources: "277" });

  useEffect(() => {
    fetch(API + "/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.total_chunks) {
          setStats({
            dataPoints: d.total_chunks.toLocaleString(),
            sources: d.unique_sources ? String(d.unique_sources) : "277",
          });
        }
      })
      .catch(() => {});
  }, []);

  const items = [
    { v: stats.dataPoints, l: "Verified Data Points", ic: SvgDatabase },
    { v: stats.sources, l: "Authoritative Sources", ic: SvgBookOpen },
    { v: String(COUNTRIES.length), l: "Country Profiles", ic: SvgGlobe },
    { v: `${VARIETIES.length}+`, l: "Potato Varieties", ic: SvgMessage },
  ];

  return (
    <section style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", background: "#FAFAFA" }}>
      <div className="pp-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 48px" }}>
        <div className="pp-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {items.map((s, i) => (
            <div key={i} className="pp-stat pp-fade-up" style={{ textAlign: "center", transition: "all 0.3s", animationDelay: `${0.1 * i}s` }}>
              <div style={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>{s.ic}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
