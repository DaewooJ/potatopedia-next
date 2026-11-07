import Link from "next/link";
import { USE_COLORS } from "../lib/varieties-data";

export default function VarietyIconicShowcase({ varieties }) {
  return (
    <section style={{ paddingTop: 8, paddingBottom: 8 }}>
      <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Start here</span>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.7, marginBottom: 8 }}>{varieties.length} iconic varieties</h2>
          <p style={{ fontSize: 13.5, color: "var(--mute2)", maxWidth: 560, margin: "0 auto" }}>
            The market-defining, culturally significant cultivars — before you dive into the full archive below.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }} className="pp-iconic-grid">
          {varieties.map((v) => (
            <Link
              key={v.slug}
              href={`/varieties/${v.slug}`}
              className="pp-iconic-card"
              style={{ display: "block", background: "var(--card)", border: "1px solid rgba(154,114,56,0.12)", borderRadius: 14, padding: "18px 20px", textDecoration: "none", color: "inherit", transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease" }}
            >
              <span style={{ display: "inline-block", fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#fff", background: "var(--accent-bg)", padding: "3px 9px", borderRadius: 8, marginBottom: 10 }}>Iconic</span>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: "var(--ink)", marginBottom: 3 }}>{v.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--mute2)", marginBottom: 8 }}>{v.origin} · {v.region}</div>
              <div style={{ fontSize: 12.5, color: "var(--mute)", lineHeight: 1.5, marginBottom: 10 }}>{v.trait}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {(v.uses || []).map((u) => {
                  const c = USE_COLORS[u] || { bg: "rgba(120,120,120,0.08)", fg: "#666" };
                  return <span key={u} style={{ fontSize: 9.5, fontWeight: 600, color: c.fg, background: c.bg, padding: "3px 7px", borderRadius: 8 }}>{u}</span>;
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .pp-iconic-card:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(154,114,56,0.1); border-color: var(--gold) !important; }
      `}</style>
    </section>
  );
}
