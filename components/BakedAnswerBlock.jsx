// SERVER COMPONENT — renders pre-baked answer content at build time so
// crawlers and AI engines see real, cited answer text in SSR HTML (instead
// of the "Answer could not be loaded" placeholder that AnswerAI client-side
// fetching produced).
//
// Premium editorial styling (7 Nov 2026): reading-size paragraphs, drop cap, and the
// sources section with gold roots growing into the source cards.

import { formatAnswer } from "../lib/format";

const ROOTS = {
  1: ["M340 0 L340 68"],
  2: ["M340 0 C340 30 170 36 165 68", "M340 0 C340 30 510 36 515 68"],
  3: ["M340 0 C340 30 120 36 110 68", "M340 0 L340 68", "M340 0 C340 30 560 36 570 68"],
};

export default function BakedAnswerBlock({ data }) {
  if (!data || !data.answer) return null;

  const { cleaned, sources: inlineSources } = formatAnswer(data.answer);
  const srcYears = (data.sources || []).map((s) => s.data_year).filter(Boolean);
  const yearRange = srcYears.length > 0
    ? Math.min(...srcYears) + "–" + Math.max(...srcYears)
    : "";
  const sources = data.sources || [];
  const top = sources.slice(0, 3);
  const lines = cleaned.split("\n").filter((l) => l.trim());

  return (
    <div className="pp-answer-block" data-baked="true">
      <div data-summary="true">
        {lines.map((line, j) => (
          <p key={j} className={"ed-p" + (j === 0 ? " ed-drop" : "")}>
            {line.split(/(\*\*.*?\*\*)/).map((part, k) => {
              if (part.startsWith("**") && part.endsWith("**"))
                return <strong key={k} style={{ fontWeight: 500, color: "var(--ink)" }}>{part.slice(2, -2)}</strong>;
              return part;
            })}
          </p>
        ))}
      </div>

      {(data.data_freshness?.earliest_year && data.data_freshness?.latest_year) || data.confidence ? (
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--mute2)" }}>
          {data.data_freshness?.earliest_year && data.data_freshness?.latest_year && (
            <>Based on data from {data.data_freshness.earliest_year}&ndash;{data.data_freshness.latest_year}</>
          )}
          {data.confidence && (
            <span style={{ marginLeft: data.data_freshness?.earliest_year ? 14 : 0, color: "var(--gold)", border: "1px solid var(--gold-line)", borderRadius: 999, padding: "3px 10px", fontSize: 11.5, letterSpacing: ".06em" }}>
              {data.confidence} confidence
            </span>
          )}
        </p>
      ) : null}

      {top.length > 0 && (
        <section className="src" id="sources" aria-labelledby="sources-h">
          <p className="k" id="sources-h">
            Sources · {sources.length}{yearRange ? ` (${yearRange})` : ""}
          </p>
          <svg className="src-roots" viewBox="0 0 680 70" preserveAspectRatio="none" aria-hidden="true">
            {ROOTS[top.length].map((d) => <path key={d} className="src-root" d={d} />)}
          </svg>
          <div className="src-grid" style={top.length < 3 ? { gridTemplateColumns: `repeat(${top.length}, minmax(0, 1fr))` } : undefined}>
            {top.map((s, si) => (
              <div key={si} className="src-card">
                <p className="src-n">{s.title || s.source}</p>
                <p className="src-m">{[s.data_year, s.title && s.source && s.source !== s.title ? s.source : null].filter(Boolean).join(" · ")}</p>
              </div>
            ))}
          </div>
          <details open>
            <summary>What each source says</summary>
            <ol className="src-list">
              {sources.map((s, si) => (
                <li key={si}>
                  <span style={{ color: "var(--ink2)" }}>{s.title || s.source}</span>
                  {s.data_year ? ` (${s.data_year})` : ""}
                  {s.relevant_excerpt && <span style={{ display: "block" }}>{s.relevant_excerpt}</span>}
                </li>
              ))}
            </ol>
          </details>
        </section>
      )}

      {/* Fallback inline sources (rare; only when structured sources missing) */}
      {sources.length === 0 && inlineSources.length > 0 && (
        <section className="src">
          <p className="k">Sources</p>
          <ol className="src-list">
            {inlineSources.map((s, si) => <li key={si}>{s}</li>)}
          </ol>
        </section>
      )}
    </div>
  );
}
