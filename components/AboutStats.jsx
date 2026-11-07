import { VARIETIES } from "../lib/varieties-data";

// Numbers come from lib/site-stats.js (server) so every page shows the same figures.
export default function AboutStats({ dataPoints, sources }) {
  const items = [
    { v: dataPoints, l: "Verified Data Points", ic: "\u{1F4CA}" },
    { v: sources, l: "Authoritative Sources", ic: "\u{1F4DA}" },
    { v: "204", l: "Countries with Data", ic: "\u{1F30D}" },
    { v: `${VARIETIES.length}+`, l: "Potato Varieties", ic: "\u{1F954}" },
  ];

  return (
    <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 48px" }}>
        <div className="pp-about-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {items.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{s.ic}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "var(--mute2)", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
