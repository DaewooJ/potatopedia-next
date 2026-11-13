import Link from "next/link";

// Tiny, safe markdown renderer for news_items.body_md (13 Nov 2026). The repo has no markdown library; this one
// builds React elements only (never dangerouslySetInnerHTML), so raw HTML in the text is shown as text.
// Supports: ## / ### headings, paragraphs, "- " and "1. " lists, > quotes, **bold**, *italic*, `code`,
// [text](url) links (http/https/mailto or site-relative "/..." only; anything else is shown as plain text).

const h2 = { fontSize: 24, lineHeight: 1.25, fontWeight: 700, color: "var(--ink)", margin: "32px 0 12px" };
const h3 = { fontSize: 19, lineHeight: 1.3, fontWeight: 700, color: "var(--ink)", margin: "24px 0 10px" };
const p = { fontSize: 17, lineHeight: 1.75, color: "var(--ink2)", margin: "0 0 16px" };
const li = { fontSize: 16.5, lineHeight: 1.7, color: "var(--ink2)", marginBottom: 6 };
const a = { color: "var(--gold)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, wordBreak: "break-word" };

function safeHref(u) {
  const s = String(u || "").trim();
  if (/^https?:\/\//i.test(s) || /^mailto:/i.test(s)) return s;
  if (/^\/(?!\/)/.test(s)) return s;
  return null;
}

// Inline: links first, then bold / italic / code inside the remaining text.
function inline(text, keyBase = "i") {
  const out = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\s][^*]*)\*/g;
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${k++}`;
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      if (!href) out.push(m[1]);
      else if (href.startsWith("/")) out.push(<Link key={key} href={href} style={a}>{m[1]}</Link>);
      else out.push(<a key={key} href={href} rel="noopener" style={a}>{m[1]}</a>);
    } else if (m[3] !== undefined) out.push(<strong key={key} style={{ color: "var(--ink)" }}>{m[3]}</strong>);
    else if (m[4] !== undefined) out.push(<code key={key} style={{ fontSize: "0.92em", background: "var(--paper)", padding: "1px 5px", borderRadius: 4 }}>{m[4]}</code>);
    else if (m[5] !== undefined) out.push(<em key={key}>{m[5]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const slugId = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export function mdHeadings(md) {
  return String(md || "")
    .split("\n")
    .filter((l) => /^##\s+/.test(l))
    .map((l) => l.replace(/^##\s+/, "").trim());
}

export default function SafeMarkdown({ md }) {
  const lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = /^(#{2,4})\s+(.*)$/.exec(line))) {
      const level = m[1].length;
      const t = m[2].trim();
      blocks.push(level === 2
        ? <h2 key={i} id={slugId(t)} style={h2}>{inline(t, `h${i}`)}</h2>
        : <h3 key={i} id={slugId(t)} style={h3}>{inline(t, `h${i}`)}</h3>);
      i++;
      continue;
    }
    if (/^#\s+/.test(line)) { // a stray H1 in body text is shown as an H2 (the page owns the only H1)
      const t = line.replace(/^#\s+/, "").trim();
      blocks.push(<h2 key={i} id={slugId(t)} style={h2}>{inline(t, `h${i}`)}</h2>);
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      blocks.push(<ul key={`u${i}`} style={{ margin: "0 0 16px", paddingLeft: 22 }}>{items.map((t, j) => <li key={j} style={li}>{inline(t, `u${i}-${j}`)}</li>)}</ul>);
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, "")); i++; }
      blocks.push(<ol key={`o${i}`} style={{ margin: "0 0 16px", paddingLeft: 24 }}>{items.map((t, j) => <li key={j} style={li}>{inline(t, `o${i}-${j}`)}</li>)}</ol>);
      continue;
    }
    if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
      blocks.push(<blockquote key={`q${i}`} style={{ margin: "0 0 16px", padding: "4px 0 4px 16px", borderLeft: "3px solid var(--gold)", color: "var(--ink2)", fontStyle: "italic" }}>{inline(q.join(" "), `q${i}`)}</blockquote>);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\s*[-*]\s+|\s*\d+[.)]\s+|>)/.test(lines[i])) { para.push(lines[i].trim()); i++; }
    blocks.push(<p key={`p${i}`} style={p}>{inline(para.join(" "), `p${i}`)}</p>);
  }
  return <>{blocks}</>;
}
