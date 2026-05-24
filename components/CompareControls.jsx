"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CompareControls({ varieties, selectedSlugs, maxSlots = 4 }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return varieties
      .filter((v) => !selectedSlugs.includes(v.slug))
      .filter((v) => {
        return v.name.toLowerCase().includes(q) ||
          (v.origin || "").toLowerCase().includes(q) ||
          (v.region || "").toLowerCase().includes(q);
      })
      .slice(0, 10);
  }, [query, varieties, selectedSlugs]);

  const setIds = (newIds) => {
    if (newIds.length === 0) router.push("/varieties/compare");
    else router.push(`/varieties/compare?ids=${newIds.join(",")}`);
  };

  const addVariety = (slug) => {
    if (selectedSlugs.length >= maxSlots) return;
    setIds([...selectedSlugs, slug]);
    setQuery("");
    setOpen(false);
  };

  const canAdd = selectedSlugs.length < maxSlots;

  return (
    <div ref={containerRef} style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, border: "1.5px solid #ececec", padding: "0 14px", opacity: canAdd ? 1 : 0.5 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          disabled={!canAdd}
          placeholder={canAdd ? `Add a variety to compare (${selectedSlugs.length}/${maxSlots} selected)` : `${maxSlots} variety limit reached`}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", padding: "12px 0", background: "transparent", color: "#333" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} style={{ border: "none", background: "transparent", fontSize: 16, color: "#999", cursor: "pointer" }} aria-label="Clear">×</button>
        )}
      </div>

      {open && matches.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ececec", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", marginTop: 6, zIndex: 50, maxHeight: 320, overflowY: "auto" }}>
          {matches.map((v) => (
            <button
              key={v.slug}
              onClick={() => addVariety(v.slug)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", border: "none", borderBottom: "1px solid #f5f5f5", background: "#fff", cursor: "pointer", fontFamily: "inherit", color: "inherit" }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{v.name}</div>
              <div style={{ fontSize: 11, color: "#999" }}>{v.origin} · {v.region}{v.year ? ` · ${v.year}` : ""}</div>
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && matches.length === 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ececec", borderRadius: 12, marginTop: 6, padding: "12px 16px", color: "#999", fontSize: 13 }}>
          No varieties match &ldquo;{query}&rdquo;. Try Russet Burbank, Bintje, Kufri, Shangi.
        </div>
      )}
    </div>
  );
}

export function RemoveButton({ slug, currentIds }) {
  const router = useRouter();
  const remove = () => {
    const newIds = currentIds.filter((s) => s !== slug);
    if (newIds.length === 0) router.push("/varieties/compare");
    else router.push(`/varieties/compare?ids=${newIds.join(",")}`);
  };
  return (
    <button onClick={remove} aria-label={`Remove ${slug}`} style={{ border: "1px solid #ececec", background: "#fff", color: "#888", borderRadius: 16, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
      Remove
    </button>
  );
}
