import Link from "next/link";

// Was the donation block; since 7 Nov 2026 it is the quiet "reach the potato industry" panel (no donation framing).
// Kept under the old name so existing pages keep importing it.
export default function SupportBlock() {
  return (
    <aside
      style={{
        border: "1px solid var(--line)",
        borderTop: "2px solid var(--gold)",
        borderRadius: 14,
        padding: "22px 26px",
        margin: "40px 0",
        background: "var(--card, #FFFFFF)",
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)" }}>For companies</div>
      <p style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontSize: 26, lineHeight: 1.15, margin: "8px 0 8px", color: "var(--ink)" }}>
        Reach the potato industry, inside the answer.
      </p>
      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--mute)", margin: "0 0 14px", maxWidth: 560 }}>
        Makers, breeders and suppliers reach growers, processors and traders through clearly labelled placements. The sourced answer always comes first.
      </p>
      <Link href="/advertise" style={{ fontSize: 14, fontWeight: 500, color: "var(--gold)", textDecoration: "none" }}>
        See the placements →
      </Link>
    </aside>
  );
}
