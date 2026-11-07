import Link from "next/link";
import { KINDS, SEGMENTS, flag } from "../lib/directory-labels";

// One directory card (index, category and country pages). The whole card opens the profile (stretched link);
// the website link sits above it and goes through /api/out so outbound clicks are counted (nofollow, no IP stored).
export default function CompanyCard({ c }) {
  return (
    <div className="card co-card">
      <span className="card-k">{KINDS[c.kind]?.label}{c.verified ? " · Verified" : ""}</span>
      <Link href={`/companies/${c.slug}`} className="card-t co-stretch">{c.common || c.name}</Link>
      <span className="co-where"><span aria-hidden="true">{flag(c.country)}</span> {c.city ? `${c.city}, ` : ""}{c.country}</span>
      <span className="card-s">{c.summary}</span>
      {c.segments.length > 0 && (
        <span className="co-chips">
          {c.segments.slice(0, 4).map((s) => <span key={s} className="co-chip">{SEGMENTS[s]}</span>)}
        </span>
      )}
      {c.host && (
        <a className="co-site" href={`/api/out?c=${encodeURIComponent(c.slug)}`} target="_blank" rel="nofollow noopener">
          {c.host} <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}
