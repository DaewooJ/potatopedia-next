// Server-rendered grid of all 244 variety cards.
// Each card has data-* attributes that the VarietiesFilter (client) uses
// to drive CSS-based show/hide and order. SSR-first: full HTML graph
// available to crawlers and AI engines without JS.

import Link from "next/link";
import { USE_COLORS, TIER_COLORS } from "../lib/varieties-data";

function searchBlob(v) {
  return [v.name, v.origin, v.region, v.trait, ...(v.uses || [])].join(" ").toLowerCase();
}

function useFlags(v) {
  const flags = {};
  (v.uses || []).forEach((u) => {
    const key = u.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    flags[`data-use-${key}`] = "1";
  });
  return flags;
}

export default function VarietyGrid({ varieties }) {
  return (
    <div
      id="pp-vg"
      className="pp-vg"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, maxWidth: 1080, margin: "0 auto", padding: "0 48px 80px" }}
    >
      {varieties.map((v, i) => {
        const tc = v.tier ? TIER_COLORS[v.tier] : null;
        const yearMatch = v.year ? String(v.year).match(/\d{4}/) : null;
        const releaseYear = yearMatch ? yearMatch[0] : "";
        return (
          <Link
            key={v.slug}
            href={`/varieties/${v.slug}`}
            className="pp-variety-card"
            data-slug={v.slug}
            data-name={v.name.toLowerCase()}
            data-region={v.region}
            data-tier={v.tier || ""}
            data-year={releaseYear}
            data-search={searchBlob(v)}
            data-default-order={i}
            {...useFlags(v)}
            style={{
              display: "block", textDecoration: "none", color: "inherit",
              background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "16px 18px",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.2 }}>{v.name}</div>
              {v.year && <div style={{ fontSize: 11, color: "#999", flexShrink: 0 }}>{v.year}</div>}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{v.origin} · {v.region}</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.55, marginBottom: 10 }}>{v.trait}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
              {tc && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10,
                  background: tc.bg, color: tc.fg, textTransform: "uppercase", letterSpacing: 0.5,
                }}>{v.tier}</span>
              )}
              {(v.uses || []).map((u) => {
                const c = USE_COLORS[u] || { bg: "rgba(120,120,120,0.08)", fg: "#666" };
                return (
                  <span key={u} style={{ fontSize: 10, fontWeight: 600, color: c.fg, background: c.bg, padding: "3px 8px", borderRadius: 10 }}>{u}</span>
                );
              })}
            </div>
          </Link>
        );
      })}
      <style>{`
        .pp-variety-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.05);
          border-color: rgba(198,40,40,0.25) !important;
        }
        .pp-variety-card[data-hidden="1"] { display: none !important; }
        @media (max-width: 768px) {
          .pp-vg { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 420px) {
          .pp-vg { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
