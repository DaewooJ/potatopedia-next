// components/LegalPage.jsx
// Shared layout + building blocks for all legal / policy pages.
// Server component (no client JS needed). Matches Potatopedia design system.
//
// ─────────────────────────────────────────────────────────────────────────
//  All company details live in the COMPANY constant below. Edit them here once
//  and every policy page updates automatically. These details must match your
//  incorporation records — Razorpay verifies them during merchant activation.
// ─────────────────────────────────────────────────────────────────────────

export const COMPANY = {
  legalName: "Indpotato Private Limited",
  cin: "U82990PN2024PTC234228",
  brand: "Potatopedia",
  website: "https://www.potatopedia.com",
  domain: "www.potatopedia.com",
  address: "11, Kedar H Society, Tapowan Road, Pimpri, Pune, Maharashtra, India 411017",
  email: "support@potatopedia.com",
  phone: "+91 94996 68498",
  hours: "Monday to Friday, 10:00 AM – 6:00 PM IST (excluding public holidays)",
  grievanceOfficer: "Devendra K Jha",
};

// Single source of truth for the "last updated" stamp shown on every page.
export const LAST_UPDATED = "May 29, 2026";

const RED = "#C62828";
const FONT =
  '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const S = {
  page: {
    fontFamily: FONT,
    background: "#FFFFFF",
    color: "#333",
    minHeight: "100vh",
  },
  container: {
    maxWidth: 820,
    margin: "0 auto",
    padding: "48px 24px 96px",
  },
  eyebrow: {
    color: RED,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  h1: {
    fontSize: 34,
    fontWeight: 800,
    letterSpacing: -1,
    lineHeight: 1.15,
    color: "#1A1A1A",
    margin: "0 0 10px",
  },
  meta: { fontSize: 13, color: "#888", margin: "0 0 8px" },
  intro: { fontSize: 15, color: "#555", lineHeight: 1.7, margin: "16px 0 0" },
  rule: { border: 0, borderTop: "1px solid #eee", margin: "32px 0" },
  h2: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1A1A1A",
    margin: "36px 0 12px",
  },
  p: { fontSize: 15, lineHeight: 1.75, color: "#444", margin: "0 0 14px" },
  ul: { margin: "0 0 16px", paddingLeft: 22 },
  li: { fontSize: 15, lineHeight: 1.7, color: "#444", marginBottom: 8 },
  a: { color: RED, textDecoration: "none", fontWeight: 600 },
  callout: {
    background: "#FAFAFA",
    border: "1px solid #eee",
    borderLeft: `4px solid ${RED}`,
    borderRadius: "0 10px 10px 0",
    padding: "16px 20px",
    margin: "0 0 18px",
    fontSize: 14.5,
    lineHeight: 1.7,
    color: "#555",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: "22px 24px",
    margin: "8px 0",
  },
  cardRow: { fontSize: 14.5, lineHeight: 1.9, color: "#444" },
  cardLabel: { color: "#888", fontWeight: 600, marginRight: 6 },
  backLink: {
    display: "inline-block",
    marginTop: 40,
    fontSize: 14,
    color: RED,
    textDecoration: "none",
    fontWeight: 600,
  },
};

export function H2({ id, children }) {
  return (
    <h2 id={id} style={S.h2}>
      {children}
    </h2>
  );
}

export function P({ children }) {
  return <p style={S.p}>{children}</p>;
}

export function UL({ children }) {
  return <ul style={S.ul}>{children}</ul>;
}

export function LI({ children }) {
  return <li style={S.li}>{children}</li>;
}

export function A({ href, children }) {
  return (
    <a href={href} style={S.a}>
      {children}
    </a>
  );
}

export function Callout({ children }) {
  return <div style={S.callout}>{children}</div>;
}

// Reusable company-identity block. Pass `withGrievance` to append the
// grievance-officer / contact lines (used on Privacy, Terms, Contact).
export function CompanyDetails({ withGrievance = false }) {
  return (
    <div style={S.card}>
      <div style={S.cardRow}>
        <span style={S.cardLabel}>Legal entity:</span>
        {COMPANY.legalName}
      </div>
      <div style={S.cardRow}>
        <span style={S.cardLabel}>CIN:</span>
        {COMPANY.cin}
      </div>
      <div style={S.cardRow}>
        <span style={S.cardLabel}>Brand / website:</span>
        {COMPANY.brand} ({COMPANY.domain})
      </div>
      <div style={S.cardRow}>
        <span style={S.cardLabel}>Registered office:</span>
        {COMPANY.address}
      </div>
      <div style={S.cardRow}>
        <span style={S.cardLabel}>Email:</span>
        <a href={`mailto:${COMPANY.email}`} style={S.a}>
          {COMPANY.email}
        </a>
      </div>
      <div style={S.cardRow}>
        <span style={S.cardLabel}>Phone:</span>
        {COMPANY.phone}
      </div>
      <div style={S.cardRow}>
        <span style={S.cardLabel}>Support hours:</span>
        {COMPANY.hours}
      </div>
      {withGrievance && (
        <div style={S.cardRow}>
          <span style={S.cardLabel}>Grievance Officer:</span>
          {COMPANY.grievanceOfficer}
        </div>
      )}
    </div>
  );
}

export default function LegalPage({ eyebrow, title, intro, children }) {
  return (
    <main style={S.page}>
      <div style={S.container}>
        <div style={S.eyebrow}>{eyebrow || "Legal"}</div>
        <h1 style={S.h1}>{title}</h1>
        <p style={S.meta}>Last updated: {LAST_UPDATED}</p>
        {intro ? <p style={S.intro}>{intro}</p> : null}
        <hr style={S.rule} />
        {children}
        <a href="/" style={S.backLink}>
          ← Back to {COMPANY.brand}
        </a>
      </div>
    </main>
  );
}
