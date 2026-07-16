"use client";

import { useState, useEffect } from "react";
import { USE_COLORS } from "../lib/varieties-data";

const REGION_ORDER = ["All", "Andean / Native", "North America", "Latin America", "Western Europe", "Eastern Europe", "South Asia", "Africa", "East Asia & Pacific", "Specialty / Heritage"];
const USE_ORDER = ["All uses", "All-purpose", "Frying / Fries", "Chips", "Boiling / Salad", "Baking / Roasting", "Mashing", "Fresh market", "Processing / Industrial", "Specialty"];
const TIER_ORDER = ["All tiers", "Iconic", "Heritage", "Recent"];
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "az", label: "Name A → Z" },
  { value: "za", label: "Name Z → A" },
  { value: "newest", label: "Year (newest)" },
  { value: "oldest", label: "Year (oldest)" },
  { value: "region", label: "By region" },
];

function useKey(u) {
  return u.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export default function VarietiesFilter({ totalCount, regionCounts = {} }) {
  // Initial state from URL on mount only — no useSearchParams (avoids Suspense requirement)
  const [region, setRegion] = useState("All");
  const [use, setUse] = useState("All uses");
  const [tier, setTier] = useState("All tiers");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [matchCount, setMatchCount] = useState(totalCount || 0);
  const [mounted, setMounted] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("region")) setRegion(sp.get("region"));
    if (sp.get("use")) setUse(sp.get("use"));
    if (sp.get("tier")) setTier(sp.get("tier"));
    if (sp.get("sort")) setSort(sp.get("sort"));
    setMounted(true);
  }, []);

  // Apply filter to DOM cards via direct manipulation
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cards = document.querySelectorAll(".pp-variety-card");
    let visible = 0;
    const q = search.trim().toLowerCase();
    cards.forEach((card) => {
      let show = true;
      if (region !== "All" && card.dataset.region !== region) show = false;
      if (use !== "All uses") {
        const k = useKey(use);
        if (card.getAttribute(`data-use-${k}`) !== "1") show = false;
      }
      if (tier !== "All tiers") {
        if ((card.dataset.tier || "") !== tier) show = false;
      }
      if (q && !(card.dataset.search || "").includes(q)) show = false;
      if (show) {
        card.removeAttribute("data-hidden");
        visible++;
      } else {
        card.setAttribute("data-hidden", "1");
      }
    });
    setMatchCount(visible);

    // Apply sort via CSS order on visible cards
    if (sort !== "default") {
      const sortable = Array.from(cards).filter((c) => !c.hasAttribute("data-hidden"));
      sortable.sort((a, b) => {
        if (sort === "az") return a.dataset.name.localeCompare(b.dataset.name);
        if (sort === "za") return b.dataset.name.localeCompare(a.dataset.name);
        if (sort === "newest") return (parseInt(b.dataset.year || "0") - parseInt(a.dataset.year || "0"));
        if (sort === "oldest") return (parseInt(a.dataset.year || "9999") - parseInt(b.dataset.year || "9999"));
        if (sort === "region") return a.dataset.region.localeCompare(b.dataset.region) || a.dataset.name.localeCompare(b.dataset.name);
        return 0;
      });
      sortable.forEach((card, i) => { card.style.order = i; });
      // Reset others
      cards.forEach((c) => { if (c.hasAttribute("data-hidden")) c.style.order = ""; });
    } else {
      // Restore default insertion order
      cards.forEach((c) => { c.style.order = c.dataset.defaultOrder || ""; });
    }

    // Update URL (without full nav)
    if (mounted && typeof window !== "undefined") {
      const params = new URLSearchParams();
      if (region !== "All") params.set("region", region);
      if (use !== "All uses") params.set("use", use);
      if (tier !== "All tiers") params.set("tier", tier);
      if (sort !== "default") params.set("sort", sort);
      const qs = params.toString();
      const newUrl = qs ? `?${qs}` : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [region, use, tier, sort, search, mounted]);

  const clearAll = () => { setRegion("All"); setUse("All uses"); setTier("All tiers"); setSort("default"); setSearch(""); };
  const activeCount = (region !== "All" ? 1 : 0) + (use !== "All uses" ? 1 : 0) + (tier !== "All tiers" ? 1 : 0) + (sort !== "default" ? 1 : 0) + (search ? 1 : 0);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px 24px" }} className="pp-section">
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 10, background: "white", borderRadius: 10, border: "1.5px solid #ececec", padding: "0 14px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search varieties (e.g. Russet Burbank, Kufri, Shangi, Bintje)"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", padding: "10px 0", background: "transparent", color: "#333" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "transparent", fontSize: 16, color: "#999", cursor: "pointer" }} aria-label="Clear search">×</button>}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid #ececec", background: "white", fontSize: 13, fontFamily: "inherit", cursor: "pointer", color: "#444" }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "#999", whiteSpace: "nowrap" }}>
          {matchCount} of {totalCount}
        </span>
        {activeCount > 0 && (
          <button onClick={clearAll} style={{ fontSize: 12, color: "#C62828", background: "transparent", border: "1px solid rgba(198,40,40,0.25)", padding: "6px 12px", borderRadius: 16, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5 }}>Region</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {REGION_ORDER.map((r) => (
          <button key={r} className="pp-pill" onClick={() => setRegion(r)} style={{
            padding: "6px 14px", borderRadius: 18, border: "1px solid",
            borderColor: region === r ? "#C62828" : "#e0e0e0",
            background: region === r ? "#C62828" : "white",
            color: region === r ? "white" : "#666",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{r}{r !== "All" && regionCounts[r] ? ` (${regionCounts[r]})` : ""}</button>
        ))}
      </div>

      <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5 }}>Use</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {USE_ORDER.map((u) => {
          const c = USE_COLORS[u];
          return (
            <button key={u} className="pp-pill" onClick={() => setUse(u)} style={{
              padding: "6px 14px", borderRadius: 18, border: "1px solid",
              borderColor: use === u ? (c?.fg || "#C62828") : "#e0e0e0",
              background: use === u ? (c?.fg || "#C62828") : "white",
              color: use === u ? "white" : "#666",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{u}</button>
          );
        })}
      </div>

      <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5 }}>Tier</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {TIER_ORDER.map((t) => (
          <button key={t} className="pp-pill" onClick={() => setTier(t)} style={{
            padding: "6px 14px", borderRadius: 18, border: "1px solid",
            borderColor: tier === t ? "#C62828" : "#e0e0e0",
            background: tier === t ? "#C62828" : "white",
            color: tier === t ? "white" : "#666",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{t}</button>
        ))}
      </div>
    </div>
  );
}
