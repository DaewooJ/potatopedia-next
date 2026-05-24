"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const REGION_ORDER = ["All", "Africa", "Americas", "Asia & Pacific", "Europe", "Global / rotating"];
const AUDIENCE_ORDER = ["All audiences", "Industry & trade", "Research & policy", "Equipment & agronomy"];
const FREQ_ORDER = ["All cadences", "Annual", "Biennial", "Triennial"];

const REGION_COLORS = {
  "Africa": "#2E7D32",          // green
  "Americas": "#C62828",        // red (brand)
  "Asia & Pacific": "#1565C0",  // blue
  "Europe": "#EF6C00",          // orange
  "Global / rotating": "#6A1B9A", // purple
};

export default function EventsFilter({ events }) {
  const [region, setRegion] = useState("All");
  const [audience, setAudience] = useState("All audiences");
  const [freq, setFreq] = useState("All cadences");

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (region !== "All" && e.region !== region) return false;
      if (audience !== "All audiences" && e.audience !== audience) return false;
      if (freq !== "All cadences" && !e.frequency.startsWith(freq)) return false;
      return true;
    });
  }, [events, region, audience, freq]);

  const clearAll = () => { setRegion("All"); setAudience("All audiences"); setFreq("All cadences"); };
  const activeCount = (region !== "All" ? 1 : 0) + (audience !== "All audiences" ? 1 : 0) + (freq !== "All cadences" ? 1 : 0);

  const Selector = ({ label, options, value, setter }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 220px", minWidth: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5, whiteSpace: "nowrap" }}>{label}</span>
      <select
        value={value}
        onChange={(e) => setter(e.target.value)}
        style={{
          flex: 1, minWidth: 0,
          padding: "10px 12px",
          borderRadius: 10,
          border: "1.5px solid",
          borderColor: value === options[0] ? "#ececec" : "#C62828",
          background: "#fff",
          fontSize: 13, fontFamily: "inherit",
          fontWeight: value === options[0] ? 500 : 600,
          color: value === options[0] ? "#444" : "#C62828",
          cursor: "pointer",
        }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px 32px" }} className="pp-section">
        <div className="pp-events-filterbar" style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 14, padding: "16px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
          <Selector label="Region" options={REGION_ORDER} value={region} setter={setRegion} />
          <Selector label="Audience" options={AUDIENCE_ORDER} value={audience} setter={setAudience} />
          <Selector label="Cadence" options={FREQ_ORDER} value={freq} setter={setFreq} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>{filtered.length} of {events.length}</span>
            {activeCount > 0 && (
              <button onClick={clearAll} style={{ fontSize: 12, color: "#C62828", background: "transparent", border: "1px solid rgba(198,40,40,0.25)", padding: "6px 12px", borderRadius: 16, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, whiteSpace: "nowrap" }}>
                Clear ({activeCount})
              </button>
            )}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .pp-events-filterbar { flex-direction: column !important; align-items: stretch !important; }
            .pp-events-filterbar > label { flex: 1 1 auto !important; width: 100%; }
          }
        `}</style>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px 64px" }} className="pp-section">
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 24px", color: "#999" }}>
            <p style={{ fontSize: 15, marginBottom: 8 }}>No events match your filter.</p>
            <button onClick={clearAll} style={{ fontSize: 13, color: "#C62828", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Clear filters</button>
          </div>
        ) : (
          <>
          <div className="pp-events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map((e) => {
              const regionColor = REGION_COLORS[e.region] || "#C62828";
              return (
                <article key={e.slug} className="pp-event-card" style={{
                  background: "#fff",
                  border: "1px solid #e3e3e3",
                  borderTop: `3px solid ${regionColor}`,
                  borderRadius: 12,
                  padding: "20px 22px 18px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: regionColor, textTransform: "uppercase", letterSpacing: 1.5 }}>{e.region}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, background: "#FAFAFA", padding: "3px 9px", borderRadius: 10 }}>{e.frequency.split("(")[0].trim()}</span>
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.5, lineHeight: 1.22, margin: "0 0 6px" }}>{e.name}</h3>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>{e.organizer}</div>

                  <div style={{ marginBottom: 14, padding: "12px 14px", background: "#FAFAFA", borderRadius: 8, fontSize: 13 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Next edition</div>
                    <div style={{ color: "#1A1A1A", fontWeight: 700 }}>{e.nextEditionLabel}</div>
                    <div style={{ color: "#666", marginTop: 4, fontSize: 12.5, lineHeight: 1.5 }}>{e.venue}</div>
                  </div>

                  <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 12 }}>
                    <div style={{ marginBottom: 4 }}><strong style={{ color: "#1A1A1A" }}>Scale:</strong> {e.scale}</div>
                    <div><strong style={{ color: "#1A1A1A" }}>Focus:</strong> {e.focus}</div>
                  </div>

                  {e.notes && (
                    <div style={{ fontSize: 12, color: "#777", lineHeight: 1.6, marginBottom: 14, fontStyle: "italic", paddingLeft: 10, borderLeft: "2px solid #ececec" }}>{e.notes}</div>
                  )}

                  <div style={{ marginTop: "auto", display: "flex", gap: 14, flexWrap: "wrap", paddingTop: 14, borderTop: "1px solid #f0f0f0" }}>
                    {e.officialUrl && (
                      <a href={e.officialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>
                        Official site →
                      </a>
                    )}
                    {e.deepDive && (
                      <Link href={e.deepDive} style={{ fontSize: 12, color: "#666", fontWeight: 600, textDecoration: "none" }}>
                        Deep dive →
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <style>{`
            .pp-event-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.06) !important;
            }
          `}</style>
          </>
        )}
      </div>
    </>
  );
}
