import Link from "next/link";

// Compact "related sections" block (server component). Items come from lib/related-sections.js.
export default function RelatedSections({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="band" aria-label={title} style={{ padding: "36px 32px" }}>
      <div className="band-in">
        <p className="k" style={{ marginBottom: 14 }}>{title}</p>
        <div className="grid-cards">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="card">
              {it.k && <span className="card-k">{it.k}</span>}
              <span className="card-t" style={{ fontSize: 17 }}>{it.t}</span>
              {it.s && <span className="card-s">{it.s}</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
