"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Subtle "Spot an error?" line at the end of reference pages. Rendered by SiteChrome so every
// page below gets it without touching each file. Links to the For-companies correction form with the page prefilled.
const DETAIL = ["/companies/", "/answers/", "/knowledge/", "/blog/"];
const ANY = ["/country/", "/prices", "/diseases", "/events"];

export function wantsCorrectionLine(pathname) {
  if (!pathname) return false;
  return DETAIL.some((p) => pathname.startsWith(p) && pathname.length > p.length) || ANY.some((p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : p + "/"));
}

export default function SuggestCorrection({ path }) {
  const pathname = usePathname() || "";
  const p = path || pathname;
  if (!wantsCorrectionLine(p)) return null;
  return (
    <p style={{ maxWidth: 1160, margin: "0 auto", padding: "8px 32px 40px", boxSizing: "border-box", fontSize: 13.5, color: "var(--mute)" }}>
      Spot an error?{" "}
      <Link href={`/for-companies?page=${encodeURIComponent(p)}#correct`} style={{ color: "var(--gold)", fontWeight: 500 }}>
        Suggest a correction →
      </Link>
    </p>
  );
}
