import Link from "next/link";
import REPORTS from "../lib/reports-manifest.json";

// "Get the 10-page <Country> report" banner for the country pages; renders only when a report exists.
export default function ReportBanner({ slug }) {
  const r = REPORTS[slug];
  if (!r) return null;
  return (
    <div style={{ margin: "22px 0 0" }} className="pp-no-print">
      <Link href={`/reports/${slug}`} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 18px", justifyContent: "space-between", textDecoration: "none", background: "var(--panel)", color: "var(--panel-ink)", borderRadius: 14, padding: "16px 20px", border: "1px solid var(--panel-line)" }}>
        <span style={{ display: "block", minWidth: 0, flex: "1 1 240px" }}>
          <span style={{ display: "block", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--panel-gold)", marginBottom: 4 }}>Market report · November 2026</span>
          <span style={{ display: "block", fontFamily: "var(--hp-serif), Georgia, serif", fontSize: 24, lineHeight: 1.15 }}>Get the {r.pages}-page {r.name} report</span>
          <span style={{ display: "block", fontSize: 13.5, color: "var(--panel-mute)", marginTop: 4 }}>Production, trade, regions, industry and outlook, every figure sourced.</span>
        </span>
        <span style={{ background: "var(--panel-gold)", color: "#16140F", fontWeight: 600, fontSize: 14, padding: "10px 18px", borderRadius: 999, whiteSpace: "nowrap" }}>See what&apos;s inside →</span>
      </Link>
    </div>
  );
}
