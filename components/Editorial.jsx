import Link from "next/link";

// Shared pieces of the premium editorial and dossier templates (7 Nov 2026).
// Server components only; every label and figure comes from the page's own data.

// Splits a headline so its natural closing phrase can be set in gold italic:
// the part after a colon or dash when there is one, otherwise the last two or three words.
export function accentTitle(title) {
  const t = String(title || "").trim();
  const m = t.match(/^(.{12,}?)([:—–-]\s+|\?\s+)(.{3,})$/);
  if (m && m[3].split(/\s+/).length <= 9) return [m[1] + m[2], m[3]];
  const words = t.split(/\s+/);
  if (words.length < 4) return [t, ""];
  const n = words.length >= 9 ? 3 : 2;
  return [words.slice(0, -n).join(" ") + " ", words.slice(-n).join(" ")];
}

export function AccentTitle({ title }) {
  const [head, tail] = accentTitle(title);
  return (
    <>
      {head}
      {tail && <em>{tail}</em>}
    </>
  );
}

// A source citation → short card name + meta line ("USDA NASS, Crop Production 2024" → "USDA NASS" / "Crop Production 2024").
function splitCitation(s) {
  const t = String(s || "").replace(/\s+/g, " ").trim().replace(/\.$/, "");
  const m = t.match(/^(.{2,48}?)(?:\s*[,(:;]\s*|\s+[—–-]\s+)(.+)$/);
  let name = m ? m[1] : t;
  let meta = m ? m[2].replace(/\)$/, "") : "";
  if (name.length > 48) {
    name = name.slice(0, 46).trimEnd() + "…";
  }
  if (meta.length > 80) meta = meta.slice(0, 78).trimEnd() + "…";
  return { name, meta };
}

const ROOTS = {
  1: ["M340 0 L340 68"],
  2: ["M340 0 C340 30 170 36 165 68", "M340 0 C340 30 510 36 515 68"],
  3: ["M340 0 C340 30 120 36 110 68", "M340 0 L340 68", "M340 0 C340 30 560 36 570 68"],
};

// "Sources" section: animated gold roots growing down into up to three source cards, then the full list.
export function SourceRoots({ items = [], title = "Sources", id = "sources" }) {
  const list = items.map((s) => String(s || "").trim()).filter(Boolean);
  if (!list.length) return null;
  const cards = list.slice(0, 3).map(splitCitation);
  const rest = list.length > 3;
  return (
    <section className="src" id={id} aria-labelledby={`${id}-h`}>
      <p className="k" id={`${id}-h`}>{title}</p>
      <svg className="src-roots" viewBox="0 0 680 70" preserveAspectRatio="none" aria-hidden="true">
        {ROOTS[cards.length].map((d) => (
          <path key={d} className="src-root" d={d} />
        ))}
      </svg>
      <div className="src-grid" style={cards.length < 3 ? { gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` } : undefined}>
        {cards.map((c, i) => (
          <div key={i} className="src-card">
            <p className="src-n">{c.name}</p>
            {c.meta && <p className="src-m">{c.meta}</p>}
          </div>
        ))}
      </div>
      {rest ? (
        <details>
          <summary>All {list.length} sources and methodology</summary>
          <ol className="src-list">
            {list.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </details>
      ) : (
        cards.some((c, i) => list[i].length > c.name.length + c.meta.length + 4) && (
          <ol className="src-list">
            {list.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        )
      )}
    </section>
  );
}

// "Ask a follow-up": a plain GET form to /ask?q= (works without JavaScript).
export function AskFollowUp({ placeholder = "Ask a follow-up question…", title = "Ask a follow-up", sub = "Answers grow from FAOSTAT, USDA, CIP and peer-reviewed research." }) {
  return (
    <section className="ask" aria-label={title}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <p className="ask-t">{title}</p>
        <p className="ask-s">{sub}</p>
      </div>
      <form className="ask-f" action="/ask" method="get" role="search">
        <label className="pp-sr" htmlFor={`ask-${title.length}`}>Your question</label>
        <input id={`ask-${title.length}`} name="q" type="text" placeholder={placeholder} autoComplete="off" required />
        <button type="submit" className="btn-red">Ask</button>
      </form>
    </section>
  );
}

// "Keep reading" band of three cards.
export function KeepReading({ items = [], title = "Keep reading", more }) {
  if (!items.length) return null;
  return (
    <section className="band" aria-labelledby="keep-h">
      <div className="band-in">
        <h2 id="keep-h" className="band-h">{title}</h2>
        <div className="grid-cards">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="card">
              {it.kicker && <span className="card-k">{it.kicker}</span>}
              <span className="card-t">{it.title}</span>
              {it.sub && <span className="card-s">{it.sub}</span>}
            </Link>
          ))}
        </div>
        {more && (
          <p style={{ margin: "22px 0 0" }}>
            <Link href={more.href} className="gl">{more.label} <span className="arr">→</span></Link>
          </p>
        )}
      </div>
    </section>
  );
}

// Labelled, clearly-marked paid placement slot (links to the homepage's companies section).
export function FeaturedSlot({ kicker, title, sub }) {
  return (
    <Link href="/#companies" className="slot">
      <p className="k k-mute" style={{ marginBottom: 6 }}>{kicker}</p>
      <p className="slot-t">{title}</p>
      {sub && <p className="slot-s">{sub}</p>}
    </Link>
  );
}

// Figures band: [{ n, l }]
export function Figures({ items, label = "Key figures" }) {
  if (!items?.length) return null;
  return (
    <ul className="figs rise" aria-label={label} style={items.length < 4 ? { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` } : undefined}>
      {items.map((f) => (
        <li key={f.l}>
          <span className="fig-n">{f.n}</span>
          <span className="fig-l">{f.l}</span>
        </li>
      ))}
    </ul>
  );
}
