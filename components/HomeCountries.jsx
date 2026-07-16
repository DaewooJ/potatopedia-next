"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNTRIES, REGION_LIST, UPDATED_SHORT } from "../lib/data";

export default function HomeCountries() {
  const [region, setRegion] = useState("Global");
  const [showAll, setShowAll] = useState(false);

  const filteredCountries = region === "All" || region === "Global"
    ? COUNTRIES
    : COUNTRIES.filter((c) => c.region === region);
  const displayedCountries = showAll ? filteredCountries : filteredCountries.slice(0, 8);

  return (
    <section className="pp-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 48px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>Intelligence</span>
        <h2 className="pp-section-title" style={{ fontSize: 32, fontWeight: 700, color: "#1A1A1A", letterSpacing: -1 }}>Country Profiles</h2>
        <p style={{ fontSize: 14, color: "#888", marginTop: 8 }}>Production data, trade flows, and industry insights for every major potato nation</p>
      </div>

      {/* Region filter pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
        {REGION_LIST.map((r) => {
          const active = (r === "All" && (region === "Global" || region === "All")) || r === region;
          return (
            <button
              key={r}
              className="pp-pill"
              onClick={() => { setRegion(r === "All" ? "Global" : r); setShowAll(false); }}
              style={{ padding: "7px 18px", borderRadius: 20, border: "1px solid", borderColor: active ? "#C62828" : "#e0e0e0", background: active ? "#C62828" : "white", color: active ? "white" : "#666", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >{r}</button>
          );
        })}
      </div>

      {/* Country cards grid */}
      <div className="pp-countries-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {displayedCountries.map((c) => (
          <Link
            key={c.slug}
            href={"/country/" + c.slug}
            className="pp-country-card"
            style={{ background: "white", borderRadius: 16, padding: "26px 20px", textAlign: "center", border: "1px solid #eee", textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontSize: 38, marginBottom: 8 }}>{c.flag}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 5 }}>{c.name}</div>
            <div style={{ fontSize: 26, color: "#C62828", fontWeight: 800, lineHeight: 1 }}>{c.prod}</div>
            <div style={{ fontSize: 11, color: "#aaa", fontWeight: 400, marginBottom: 7 }}>tonnes produced</div>
            <div style={{ display: "inline-block", fontSize: 11, color: "#C62828", fontWeight: 600, background: "rgba(198,40,40,0.06)", borderRadius: 20, padding: "4px 12px" }}>#{c.rank} Global</div>
            <div style={{ fontSize: 10, color: "#bbb", marginTop: 6 }}>Updated {UPDATED_SHORT}</div>
          </Link>
        ))}
      </div>

      {/* View all button */}
      {filteredCountries.length > 8 && !showAll && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link
            href="/countries"
            style={{ display: "inline-block", padding: "11px 30px", borderRadius: 12, border: "2px solid #C62828", background: "transparent", color: "#C62828", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "inherit", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.target.style.background = "#C62828"; e.target.style.color = "white"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#C62828"; }}
          >View All 31 Countries &rarr;</Link>
        </div>
      )}
    </section>
  );
}
