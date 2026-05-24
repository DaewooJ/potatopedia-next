/**
 * Strips inline (Source: ...) references from answer text.
 * Returns { cleaned, sources } where sources is an array of unique source strings.
 */
export function formatAnswer(text) {
  const sources = [];
  const cleaned = text.replace(/\(Source:[^)]+\)/g, (match) => {
    const src = match.replace("(Source: ", "").replace(")", "").trim();
    if (sources.indexOf(src) === -1) sources.push(src);
    return "";
  });
  return { cleaned: cleaned.replace(/\n\n+/g, "\n\n").trim(), sources };
}
