// SERVER COMPONENT — renders pre-baked answer content at build time so
// crawlers and AI engines see real, cited answer text in SSR HTML (instead
// of the "Answer could not be loaded" placeholder that AnswerAI client-side
// fetching produced).
//
// Mirrors the visual structure of AnswerBlock.jsx (client component used for
// follow-up Q&A) but with no React state — purely server-rendered.

import { formatAnswer } from "../lib/format";

export default function BakedAnswerBlock({ data }) {
  if (!data || !data.answer) return null;

  const { cleaned, sources: inlineSources } = formatAnswer(data.answer);
  const srcYears = (data.sources || []).map((s) => s.data_year).filter(Boolean);
  const yearRange = srcYears.length > 0
    ? Math.min(...srcYears) + "–" + Math.max(...srcYears)
    : "";

  return (
    <div className="pp-answer-block" data-baked="true" style={{ overflowX: "hidden" }}>
      {/* Formatted answer text — split into paragraphs, render markdown bold */}
      <div data-summary="true" style={{ fontSize: 15, lineHeight: 1.8, color: "#333" }}>
        {cleaned.split("\n").map((line, j) => (
          <p key={j} style={{ margin: j > 0 ? "10px 0 0" : 0 }}>
            {line.split(/(\*\*.*?\*\*)/).map((part, k) => {
              if (part.startsWith("**") && part.endsWith("**"))
                return <strong key={k} style={{ fontWeight: 600, color: "#1A1A1A" }}>{part.slice(2, -2)}</strong>;
              return part;
            })}
          </p>
        ))}
      </div>

      {/* Data freshness microcopy */}
      {data.data_freshness && data.data_freshness.earliest_year && data.data_freshness.latest_year && (
        <p style={{ margin: "14px 0 0", fontSize: 12, color: "#999", fontStyle: "italic" }}>
          Based on data from {data.data_freshness.earliest_year}&ndash;{data.data_freshness.latest_year}
        </p>
      )}

      {/* Confidence badge */}
      {data.confidence && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: data.confidence === "high" ? "#2D6A30" : data.confidence === "medium" ? "#B8860B" : "#C62828",
            background: data.confidence === "high" ? "rgba(45,106,48,0.08)" : data.confidence === "medium" ? "rgba(184,134,11,0.08)" : "rgba(198,40,40,0.08)",
            padding: "3px 10px", borderRadius: 8,
          }}>{data.confidence} confidence</span>
        </div>
      )}

      {/* Sources — server-rendered as an open <details> for instant crawler readability */}
      {data.sources && data.sources.length > 0 && (
        <details open style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <summary style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "4px 0", listStyle: "none" }}>
            <span style={{ fontSize: 12, color: "#999" }}>{"📚"}</span>
            <span style={{ fontSize: 11, color: "#999", fontWeight: 500 }}>
              {data.sources.length} source{data.sources.length !== 1 ? "s" : ""}{yearRange ? ` (${yearRange})` : ""}
            </span>
          </summary>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 }}>
            {data.sources.map((s, si) => (
              <div key={si} style={{ padding: "8px 12px", borderRadius: 8, background: "#FAFAFA", border: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#444", lineHeight: 1.3 }}>{s.title || s.source}</span>
                  {s.data_year && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#C62828", background: "rgba(198,40,40,0.06)", padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap", flexShrink: 0 }}>{s.data_year}</span>
                  )}
                </div>
                {s.relevant_excerpt && (
                  <p style={{ fontSize: 11, color: "#888", lineHeight: 1.5, margin: "4px 0 0" }}>{s.relevant_excerpt}</p>
                )}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Fallback inline sources (rare; only when structured sources missing) */}
      {(!data.sources || data.sources.length === 0) && inlineSources.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#C62828", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Sources</div>
          {inlineSources.map((s, si) => (
            <div key={si} style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}
