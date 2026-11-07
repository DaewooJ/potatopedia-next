// Shared source naming (7 Nov 2026): internal file titles → publisher + topic, and clean reader-facing excerpts.
// Internal file titles ("Faostat Percapita Consumption Rankings") → publisher + topic ("FAOSTAT", "Per-capita consumption rankings").
const PUBLISHERS = [
  [/faostat|\bfao\b/i, "FAOSTAT"],
  [/usda|nass|\bers\b|\bfas\b|gain/i, "USDA"],
  [/\bcip\b|international potato center/i, "CIP"],
  [/comtrade/i, "UN Comtrade"],
  [/cpri|icar/i, "ICAR-CPRI"],
  [/europatat/i, "Europatat"],
  [/eurostat/i, "Eurostat"],
  [/statcan|statistics canada/i, "Statistics Canada"],
  [/\bahdb\b/i, "AHDB"],
  [/\bpib\b|government of india|directorate/i, "Government of India"],
];
const FILLER = /\b(faostat|fao|usda|cip|comtrade|cpri|icar|europatat|eurostat|statcan|faq|verified|comprehensive|deep dive|datasheets?|txt|pdf)\b/gi;

export function sourceLabel(s) {
  const raw = String(s.title || s.source || "").replace(/[-_]/g, " ").replace(/\.(txt|pdf|docx)$/i, "");
  const pub = PUBLISHERS.find(([re]) => re.test(raw) || re.test(s.source || ""));
  let topic = raw.replace(FILLER, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/percapita/g, "per-capita");
  if (!topic || topic === "potato" || topic === "potatoes") topic = /faq|verified/i.test(raw) ? "verified reference facts" : "";
  topic = topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "";
  const year = s.data_year ? ` · ${s.data_year}` : "";
  return pub
    ? { name: pub[1], meta: `${topic || "Statistics"}${year}` }
    : { name: "Potatopedia research", meta: `${topic || "Sourced summary"}${year}` };
}


// Excerpts come from the middle of source files: tidy them so a reader never sees a list dash, a cut-off lowercase
// start or a raw heading. Returns "" when the fragment is too thin to be worth showing.
export function cleanExcerpt(t) {
  let x = String(t || "").replace(/\s+/g, " ").trim().replace(/^[-–•*#>\s]+/, "");
  if (x.length < 40 || !/[a-z]/.test(x) || !/\s/.test(x)) return "";
  if (/^[a-z]/.test(x)) x = "…" + x;
  if (!/[.!?…)"”]$/.test(x)) x = x + "…";
  return x;
}
