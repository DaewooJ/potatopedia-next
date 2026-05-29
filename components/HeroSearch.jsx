"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_QUESTIONS } from "../lib/data";

const DEFAULT_PILLS = ["Why is the Netherlands the world's #1 seed potato exporter?", "Which potato variety has the lowest glycemic index?", "How much potassium is in a baked potato vs a banana?", "What did Kenya's potato production look like over the last decade?"];

export default function HeroSearch() {
  const [heroQ, setHeroQ] = useState("");
  const [role, setRole] = useState(null);
  const router = useRouter();

  const go = (q, src) => {
    const query = q || heroQ;
    if (!query.trim()) return;
    router.push("/ask?q=" + encodeURIComponent(query.trim()) + "&src=" + (src || "user_typed"));
  };

  const pills = role ? ROLE_QUESTIONS[role] : DEFAULT_PILLS;

  return (
    <>
      {/* Search bar */}
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div className="pp-search-wrap pp-search-bar" style={{ display: "flex", background: "#fff", borderRadius: 16, border: "2px solid #eee", padding: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", transition: "all 0.3s" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              value={heroQ}
              onChange={(e) => setHeroQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && heroQ.trim()) go(); }}
              placeholder="Ask anything — production, varieties, trade, processing, nutrition..."
              className="pp-hero-input"
              style={{ border: "none", outline: "none", fontSize: 15, fontFamily: "inherit", width: "100%", padding: "14px 0", background: "transparent", color: "#333" }}
            />
          </div>
          <button
            className="pp-search-btn"
            onClick={() => go()}
            style={{ padding: "14px 32px", borderRadius: "0 10px 10px 0", border: "none", background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3, whiteSpace: "nowrap" }}
          >Ask AI</button>
        </div>

        {/* Quick question pills */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {pills.map((q) => (
            <button key={q} onClick={() => go(q, "suggested_prompt")} className="pp-pill" style={{ padding: "5px 13px", borderRadius: 20, border: "1px solid #eee", background: "white", fontSize: 12, color: "#888", cursor: "pointer", fontFamily: "inherit" }}>{q}</button>
          ))}
        </div>

        {/* Role selector */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#bbb", fontWeight: 500 }}>I&rsquo;m a:</span>
          {Object.keys(ROLE_QUESTIONS).map((r) => (
            <button
              key={r}
              onClick={() => setRole(role === r ? null : r)}
              className="pp-pill"
              style={{ padding: "5px 14px", borderRadius: 20, border: "1px solid", borderColor: role === r ? "#C62828" : "#e0e0e0", background: role === r ? "#C62828" : "white", color: role === r ? "white" : "#888", fontSize: 12, fontWeight: role === r ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
            >{r}</button>
          ))}
        </div>
      </div>
    </>
  );
}
