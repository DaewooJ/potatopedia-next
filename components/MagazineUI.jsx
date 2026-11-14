import Link from "next/link";
import { SITE, bySlug, issueLabel, fmtDate, dayStr } from "@/lib/newsletters";
import { magHref, magTitleHref, magazineOf } from "@/lib/magazine";

// Shared pieces for /magazines, /magazines/<newsletter> and /magazines/<newsletter>/issue-NN (14 Nov 2026).
// Server components, inline styles only (no ad-/banner/sponsor/promo names).

export const SERIF = "var(--hp-serif), Georgia, serif";
export const SANS = { fontFamily: "var(--hp-sans), system-ui, sans-serif", fontWeight: 700, letterSpacing: ".14em" };
export const MWRAP = { maxWidth: 1180, margin: "0 auto", padding: "0 16px", boxSizing: "border-box" };
export const MKICK = { margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" };
export const mbtn = (bg, fg, border) => ({ display: "inline-flex", alignItems: "center", gap: 8, background: bg, color: fg, border: border || "none", textDecoration: "none", fontWeight: 600, fontSize: 15, padding: "12px 20px", borderRadius: 999 });

export const magPeriodicalId = (slug) => `${SITE}/magazines/${slug}#periodical`;
export const magIssueId = (issue) => `${SITE}${magHref(issue)}#magazine`;
export const magName = (n) => `${n.name} Magazine`;

export function magIssueLd(issue) {
  const n = bySlug(issue.newsletter);
  const m = magazineOf(issue);
  return {
    "@type": "PublicationIssue",
    "@id": magIssueId(issue),
    name: `${magName(n)}, ${issueLabel(issue.issue_no)}`,
    issueNumber: String(issue.issue_no),
    datePublished: dayStr(issue.issue_date),
    url: SITE + magHref(issue),
    ...(m?.pages?.[0]?.src ? { image: SITE + m.pages[0].src } : {}),
    ...(m?.pages?.length ? { numberOfPages: m.pages.length, pagination: `1-${m.pages.length}` } : {}),
    isPartOf: { "@id": magPeriodicalId(n.slug) },
    publisher: { "@id": SITE + "/#publisher" },
  };
}

export function SectionLabel({ id, children, accent = "var(--gold)", right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 20px", flexWrap: "wrap" }}>
      <h2 id={id} style={{ ...MKICK, color: "var(--mute2)", display: "flex", alignItems: "center", gap: 12, margin: 0 }}>
        <span aria-hidden="true" style={{ width: 22, height: 3, background: accent, borderRadius: 2, flex: "none" }} />
        <span style={SANS}>{children}</span>
      </h2>
      <span aria-hidden="true" style={{ flex: "1 1 40px", height: 1, background: "var(--line)" }} />
      {right}
    </div>
  );
}

// One magazine edition as a cover card (archive grids, hub).
export function MagCard({ issue, showTitle = false, size = "md" }) {
  const n = bySlug(issue.newsletter);
  const m = magazineOf(issue);
  const p = m.pages[0];
  const href = magHref(issue);
  return (
    <li style={{ listStyle: "none", minWidth: 0 }}>
      <Link href={href} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
        <span style={{ display: "block", background: "var(--paper)", borderRadius: 14, padding: size === "lg" ? "26px 26px 22px" : "18px 18px 14px", border: "1px solid var(--line)" }}>
          <img src={p.src} alt={`${magName(n)}, ${issueLabel(issue.issue_no)}, front cover`} width={p.w} height={p.h} loading="lazy" style={{ width: "100%", height: "auto", display: "block", borderRadius: 3, boxShadow: "0 22px 40px -22px rgba(22,20,15,.6), 0 0 0 1px rgba(0,0,0,.06)" }} />
        </span>
        <span style={{ display: "block", padding: "12px 2px 0" }}>
          {showTitle && <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink2)", marginBottom: 6 }}><span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 2, background: n.accent }} />{n.name}</span>}
          <span style={{ display: "block", fontFamily: SERIF, fontSize: size === "lg" ? 22 : 18, lineHeight: 1.25, color: "var(--ink)" }}>{issueLabel(issue.issue_no)} · {fmtDate(dayStr(issue.issue_date))}</span>
          {issue.subject && <span style={{ display: "block", marginTop: 4, fontSize: 14, lineHeight: 1.45, color: "var(--mute)" }}>{issue.subject}</span>}
          <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: "var(--mute2)" }}>{m.pages.length} pages{m.pdf?.file ? " · PDF by email" : ""}</span>
        </span>
      </Link>
    </li>
  );
}

export function TitleCover({ n, compact = false }) {
  // Placeholder face for a title with no magazine edition yet: typographic, no stock image.
  return (
    <div aria-hidden="true" style={{ aspectRatio: "1132 / 1600", width: "100%", borderRadius: 3, background: n.accent, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: compact ? "10px 9px" : "10% 9%", boxSizing: "border-box", boxShadow: "0 22px 40px -22px rgba(22,20,15,.6)", overflow: "hidden", textDecoration: "none" }}>
      <span style={{ fontSize: compact ? 7 : 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", opacity: 0.85 }}>Potatopedia</span>
      <span style={{ fontFamily: SERIF, fontSize: compact ? 16 : "clamp(24px, 3vw, 34px)", lineHeight: 1.05 }}>{n.name}</span>
      <span style={{ fontSize: compact ? 7 : 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.9, lineHeight: 1.3 }}>{compact ? "Coming soon" : "Magazine edition · coming soon"}</span>
    </div>
  );
}

export const titleHref = magTitleHref;
