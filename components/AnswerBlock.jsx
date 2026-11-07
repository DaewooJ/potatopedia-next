"use client";

import { useState } from "react";
import { trustLine, TONE } from "../lib/trust";
import { formatAnswer } from "../lib/format";

export default function AnswerBlock({ data }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data || !data.answer) return null;

  const { cleaned, sources: inlineSources } = formatAnswer(data.answer);
  const trust = trustLine(data);
  const srcYears = (data.sources || []).map((s) => s.data_year).filter(Boolean);
  const yearRange = srcYears.length > 0 ? Math.min(...srcYears) + "\u2013" + Math.max(...srcYears) : "";

  const doCopy = () => {
    navigator.clipboard.writeText(cleaned);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pp-answer-block" style={{ overflowX: "hidden" }}>
      {/* Formatted answer text */}
      <div style={{ fontSize: 15, lineHeight: 1.8, color: "var(--ink2)" }}>
        {cleaned.split("\n").map((line, j) => (
          <p key={j} style={{ margin: j > 0 ? "10px 0 0" : 0 }}>
            {line.split(/(\*\*.*?\*\*)/).map((part, k) => {
              if (part.startsWith("**") && part.endsWith("**"))
                return <strong key={k} style={{ fontWeight: 600, color: "var(--ink)" }}>{part.slice(2, -2)}</strong>;
              return part;
            })}
          </p>
        ))}
      </div>

      {/* Confidence badge + copy */}
      {trust && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {trust && <span style={{ fontSize: 11, fontWeight: 600, color: TONE[trust.tone].color, background: TONE[trust.tone].bg, padding: "3px 10px", borderRadius: 8 }}>{trust.label}</span>}
          {trust?.detail && <span style={{ fontSize: 12, color: "var(--mute2)" }}>{trust.detail}{trust.note ? ` (${trust.note})` : ""}</span>}
          <button
            onClick={doCopy}
            style={{
              fontSize: 11, fontWeight: 500,
              color: copied ? "var(--gold)" : "#888",
              background: "none",
              border: "1px solid",
              borderColor: copied ? "var(--gold)" : "#e8e8e8",
              borderRadius: 8, padding: "3px 10px",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >{copied ? "\u2705 Copied!" : "\uD83D\uDCCB Copy"}</button>
        </div>
      )}

      {/* Structured sources accordion */}
      {data.sources && data.sources.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
          <button
            onClick={() => setSourcesOpen(!sourcesOpen)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 0", fontFamily: "inherit", width: "100%",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--mute2)" }}>{"\uD83D\uDCDA"}</span>
            <span style={{ fontSize: 11, color: "var(--mute2)", fontWeight: 500 }}>
              View {data.sources.length} source{data.sources.length !== 1 ? "s" : ""}{yearRange ? ` (${yearRange})` : ""}
            </span>
            <span style={{
              fontSize: 10, color: "var(--mute3)", transition: "transform 0.25s",
              transform: sourcesOpen ? "rotate(180deg)" : "rotate(0deg)", marginLeft: 2,
            }}>{"\u25BE"}</span>
          </button>
          <div style={{
            maxHeight: sourcesOpen ? 500 : 0, overflow: "hidden",
            transition: "max-height 0.3s ease", opacity: sourcesOpen ? 1 : 0,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 }}>
              {data.sources.map((s, si) => (
                <div key={si} style={{ padding: "7px 10px", borderRadius: 8, background: "var(--paper)", border: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink2)", lineHeight: 1.3 }}>{s.title || s.source}</span>
                    {s.data_year && (
                      <span style={{ fontSize: 9, fontWeight: 600, color: "var(--gold)", background: "rgba(154,114,56,0.06)", padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap", flexShrink: 0 }}>{s.data_year}</span>
                    )}
                  </div>
                  {s.relevant_excerpt && (
                    <p style={{ fontSize: 11, color: "var(--mute2)", lineHeight: 1.4, margin: "3px 0 0" }}>{s.relevant_excerpt}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fallback inline sources */}
      {(!data.sources || data.sources.length === 0) && inlineSources.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Sources</div>
          {inlineSources.map((s, si) => (
            <div key={si} style={{ fontSize: 12, color: "var(--mute2)", lineHeight: 1.5 }}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}
