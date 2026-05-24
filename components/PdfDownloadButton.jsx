"use client";

import { useState } from "react";

export default function PdfDownloadButton({ size = "md", placement = "banner" }) {
  const [busy, setBusy] = useState(false);

  function handleClick() {
    if (busy) return;
    setBusy(true);
    // Small delay so the busy state is visible; then native print dialog
    setTimeout(() => {
      try { window.print(); } finally { setBusy(false); }
    }, 80);
  }

  const isLarge = size === "lg";
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    borderRadius: 10,
    cursor: busy ? "wait" : "pointer",
    fontWeight: 600,
    fontFamily: "inherit",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
    whiteSpace: "nowrap",
  };

  const banner = {
    ...base,
    padding: isLarge ? "12px 22px" : "9px 16px",
    fontSize: isLarge ? 14 : 13,
    background: "linear-gradient(135deg,#C62828,#E53935)",
    color: "#FFFFFF",
    boxShadow: "0 1px 2px rgba(198,40,40,0.18), 0 4px 12px rgba(198,40,40,0.10)",
  };

  const footer = {
    ...base,
    padding: "16px 28px",
    fontSize: 15,
    background: "#FFFFFF",
    color: "#C62828",
    border: "1.5px solid rgba(198,40,40,0.25)",
  };

  const style = placement === "footer" ? footer : banner;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label="Download country report as PDF"
      className="pp-pdf-button pp-no-print"
      style={style}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 1.5v8.5M8 10l3-3M8 10l-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.5 11.5v1A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
      <span>{busy ? "Preparing PDF…" : "Download PDF Report"}</span>
    </button>
  );
}
