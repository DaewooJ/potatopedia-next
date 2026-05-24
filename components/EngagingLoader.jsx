"use client";

import { useState, useEffect } from "react";

export default function EngagingLoader({ title }) {
  const [phase, setPhase] = useState(0);
  const phases = [
    "Searching knowledge base...",
    "Found relevant data points...",
    "Generating comprehensive answer...",
  ];

  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => (p + 1) % phases.length), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,#C62828,#E53935)",
          color: "white", fontSize: 16, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>P</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#C62828" }}>{phases[phase]}</div>
          <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>From 165+ verified sources</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="pp-shimmer" style={{ height: 22, width: "55%", borderRadius: 6 }} />
        <div className="pp-shimmer" style={{ height: 16, width: "100%", borderRadius: 6 }} />
        <div className="pp-shimmer" style={{ height: 16, width: "92%", borderRadius: 6 }} />
        <div className="pp-shimmer" style={{ height: 16, width: "88%", borderRadius: 6 }} />
        <div style={{ height: 8 }} />
        <div className="pp-shimmer" style={{ height: 16, width: "96%", borderRadius: 6 }} />
        <div className="pp-shimmer" style={{ height: 16, width: "78%", borderRadius: 6 }} />
        <div className="pp-shimmer" style={{ height: 16, width: "84%", borderRadius: 6 }} />
        <div className="pp-shimmer" style={{ height: 16, width: "65%", borderRadius: 6 }} />
      </div>
    </div>
  );
}
