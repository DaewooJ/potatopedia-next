// One honest trust line for every answer (Devendra, 7 Nov 2026: "high confidence / medium confidence" read badly,
// e.g. "Based on data from 2003–2020 · high confidence"). Instead of a vague confidence word we say what the answer
// rests on: how well sourced it is, how many publishers, and how recent the figures are.
const LEVEL = {
  high: { label: "Well sourced", tone: "good" },
  medium: { label: "Partly sourced", tone: "mid" },
  low: { label: "Thin evidence", tone: "low" },
};

export function trustLine({ confidence, sources, data_freshness } = {}) {
  const level = LEVEL[String(confidence || "").toLowerCase()] || null;
  const pubs = new Set((sources || []).map((s) => s.source || s.title).filter(Boolean));
  const parts = [];
  if (pubs.size) parts.push(`${pubs.size} source${pubs.size === 1 ? "" : "s"}`);
  const a = data_freshness?.earliest_year;
  const b = data_freshness?.latest_year;
  if (a && b) parts.push(a === b ? `figures from ${b}` : `figures ${a}–${b}`);
  else if (b) parts.push(`figures up to ${b}`);
  const thisYear = new Date().getFullYear();
  const stale = b && Number(b) <= thisYear - 4;
  if (!level && !parts.length) return null;
  return {
    label: level?.label || "Sourced",
    tone: stale && level?.tone === "good" ? "mid" : level?.tone || "mid",
    detail: parts.join(" · "),
    note: stale ? `latest figure is from ${b}; newer data is not in our sources yet` : "",
  };
}

export const TONE = {
  good: { color: "#2D6A30", bg: "rgba(45,106,48,0.08)" },
  mid: { color: "#9A7238", bg: "rgba(154,114,56,0.10)" },
  low: { color: "#8a8a8a", bg: "rgba(0,0,0,0.05)" },
};
