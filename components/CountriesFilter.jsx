"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNTRIES, UPDATED_SHORT } from "../lib/data";

const REGIONS = ["All", "Asia", "Europe", "Americas", "Africa & ME"];

export default function CountriesFilter() {
  const [region, setRegion] = useState("All");

  const filtered = region === "All" ? COUNTRIES : COUNTRIES.filter((c) => c.region === region);

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 80px" }}>
      {/* Region pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
        {REGIONS.map((r) => (
          <button
            key={r}
            className="pp-pill"
            onClick={() => setRegion(r)}
            style={{
              padding: "8px 20px", borderRadius: 20, border: "1px solid",
              borderColor: region === r ? "var(--gold)" : "#e0e0e0",
              background: region === r ? "var(--gold)" : "white",
              color: region === r ? "white" : "#666",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}
          >{r}</button>
        ))}
      </div>

      {/* Country cards */}
      <div className="pp-countries-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={"/country/" + c.slug}
            className="pp-country-card"
            style={{
              background: "var(--card)", borderRadius: 16, padding: "26px 20px",
              textAlign: "center", border: "1px solid var(--line)",
              textDecoration: "none", color: "inherit",
            }}
          >
            <div style={{ fontSize: 38, marginBottom: 8 }}>{c.flag}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 5 }}>{c.name}</div>
            <div style={{ fontSize: 26, color: "var(--gold)", fontWeight: 800, lineHeight: 1 }}>{c.prod}</div>
            <div style={{ fontSize: 11, color: "var(--mute3)", fontWeight: 400, marginBottom: 7 }}>tonnes produced</div>
            <div style={{ display: "inline-block", fontSize: 11, color: "var(--gold)", fontWeight: 600, background: "rgba(154,114,56,0.06)", borderRadius: 20, padding: "4px 12px" }}>#{c.rank} Global</div>
            <div style={{ fontSize: 10, color: "var(--mute3)", marginTop: 6 }}>Updated {UPDATED_SHORT}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
