"use client";

import { useEffect, useRef, useState } from "react";
import { fetchStream, buildHistory } from "../lib/api";
import LeadForm from "./LeadForm";

// Homepage hero: the answer engine. Today's answer is server-rendered (real text for SEO and LCP); a new question
// streams in place and grows fresh "roots" into its source cards. Other sections can ask through
// window.dispatchEvent(new CustomEvent("pp-ask", { detail: "question" })).

function clean(md) {
  return String(md || "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/\n?FOLLOW_UP:.*$/gm, "")
    .trim();
}

// **bold** → <strong>. Paragraphs kept; lines starting "- ", "* " or "• " (or inline " • " runs) become a list.
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : <span key={j}>{part.replace(/\*\*/g, "")}</span>,
  );
}

function Rich({ text }) {
  const blocks = clean(text).split(/\n\s*\n/).filter(Boolean);
  return blocks.map((b, i) => {
    const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
    const bullet = /^(?:[-*•]|\d+[.)])\s+/;
    let lead = [];
    let items = [];
    for (const l of lines) {
      if (bullet.test(l)) items.push(l.replace(bullet, ""));
      else if (items.length) items[items.length - 1] += " " + l;
      else lead.push(l);
    }
    // Inline "• a • b • c" inside one line (older answers)
    if (!items.length && lead.join(" ").includes(" • ")) {
      const parts = lead.join(" ").split(/\s•\s/);
      lead = [parts.shift().replace(/•\s*$/, "")];
      items = parts;
    }
    return (
      <div key={i} className="ar-block">
        {lead.length > 0 && <p className="ar-p">{inline(lead.join(" "))}</p>}
        {items.length > 0 && (
          <ul className="ar-ul">
            {items.map((it, k) => (
              <li key={k}>{inline(it)}</li>
            ))}
          </ul>
        )}
      </div>
    );
  });
}

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

function label(s) {
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

function sourceCards(sources) {
  const out = [];
  for (const s of sources || []) {
    const c = s.name ? { name: s.name, meta: s.meta } : label(s);
    if (!out.some((o) => o.name === c.name && o.meta === c.meta)) out.push(c);
    if (out.length === 2) break;
  }
  return out;
}

export default function AskRoots({ initial }) {
  const [thread, setThread] = useState([]); // [{q, text, streaming, sources, related}]
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const topRef = useRef(null);
  const [saveDismissed, setSaveDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("pp-save-dismissed") === "1") setSaveDismissed(true);
    } catch {}
  }, []);
  const dismissSave = () => {
    setSaveDismissed(true);
    try {
      localStorage.setItem("pp-save-dismissed", "1");
    } catch {}
  };

  const ask = (text, src) => {
    const q = String(text || input).trim();
    if (!q || busy) return;
    const history = buildHistory(thread.flatMap((t) => [{ role: "user", text: t.q }, { role: "ai", text: t.text }]));
    setInput("");
    setBusy(true);
    setThread((p) => [...p, { q, text: "", streaming: true, sources: [], related: [] }]);
    const patch = (fn) => setThread((p) => p.map((t, i) => (i === p.length - 1 ? fn(t) : t)));
    fetchStream(
      { question: q, conversation_history: history, source: src || "homepage_roots" },
      (tok) => patch((t) => ({ ...t, text: t.text + tok })),
      (ev) => {
        setBusy(false);
        patch((t) => ({ ...t, text: ev.answer || t.text, streaming: false, sources: ev.sources || [], related: ev.related_questions || [] }));
      },
      () => {
        setBusy(false);
        patch((t) => ({ ...t, text: t.text || "Connection issue. Please try again.", streaming: false }));
      },
    );
  };

  useEffect(() => {
    const onAsk = (e) => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      ask(e.detail, "chain_stage");
    };
    window.addEventListener("pp-ask", onAsk);
    return () => window.removeEventListener("pp-ask", onAsk);
  });

  const latest = thread[thread.length - 1];
  const card = latest
    ? { kicker: latest.streaming ? "Searching the sources…" : "Your answer", q: latest.q, text: latest.text, streaming: latest.streaming, cards: sourceCards(latest.sources), related: latest.related.filter((r) => r.length <= 70).slice(0, 3), href: null }
    : { kicker: `Today's question · answered from ${initial.cards.length} source${initial.cards.length > 1 ? "s" : ""}`, q: initial.question, text: initial.text, streaming: false, cards: initial.cards, related: initial.related, href: initial.href };
  const showRoots = !card.streaming && card.cards.length > 0;
  const answered = thread.filter((t) => !t.streaming && t.text).length;
  const showSave = answered >= 2 && !saveDismissed && !busy;

  return (
    <div ref={topRef} className="ar">
      <form
        className="ar-form hp-rise hp-d3"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
      >
        <label htmlFor="ar-q" className="hp-sr">Ask a question about potatoes</label>
        <input id="ar-q" className="ar-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={thread.length ? "Ask a follow-up…" : "Ask a question about potatoes…"} autoComplete="off" disabled={busy} />
        <button type="submit" className="ar-btn" disabled={!input.trim() || busy}>{busy ? "Asking…" : "Ask"}</button>
      </form>

      <div className="ar-card" key={`c${thread.length}`} aria-live="polite">
        <div className="ar-kick">
          <svg width="22" height="28" viewBox="0 0 22 28" aria-hidden="true"><path d="M11 28 V11" style={{ stroke: "var(--gold)" }} strokeWidth="1.5" fill="none" /><path d="M11 15 C5 14 2 9 3 3 C8 4 11 8 11 15 Z" fill="none" style={{ stroke: "var(--gold)" }} strokeWidth="1.2" /><path d="M11 12 C16 10 19 6 19 1 C14 2 11 6 11 12 Z" fill="none" style={{ stroke: "var(--gold)" }} strokeWidth="1.2" /></svg>
          <span>{card.kicker}</span>
        </div>
        <h2 className="ar-q">{card.q}</h2>
        <div className="ar-a">{card.streaming && !card.text ? <p className="ar-p ar-wait">Reading 300+ sources…</p> : <Rich text={card.text} />}</div>
        {showSave && (
          <div className="ar-save" role="region" aria-label="Save this answer">
            <div className="ar-save-txt">
              <p className="ar-save-t">Save this answer and get The Potato Week</p>
              <p className="ar-save-s">We email you a link to this answer, then one useful digest a week. Optional and free; unsubscribe any time.</p>
            </div>
            <div className="ar-save-form">
              <LeadForm dark type="newsletter" askName={false} askCompany={false} askCountry={false} askMessage={false} submitLabel="Save & subscribe" compact hidden={{ saved_question: latest?.q }} />
            </div>
            <button type="button" className="ar-save-x" onClick={dismissSave}>No thanks</button>
          </div>
        )}
        {!card.streaming && (
          <div className="ar-next">
            {card.href && <a href={card.href} className="ar-link">Read the full sourced answer <span className="hp-arrow">→</span></a>}
            {card.related.map((r) => (
              <button key={r} type="button" className="ar-chip" onClick={() => ask(r, "related_question")}>{r}</button>
            ))}
          </div>
        )}
      </div>

      {showRoots && (
        <div key={`r${thread.length}`}>
          <svg className="ar-roots" viewBox="0 0 916 140" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="arGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: "var(--gold)", stopOpacity: 0.9 }} /><stop offset="1" style={{ stopColor: "var(--gold)", stopOpacity: 0.25 }} /></linearGradient></defs>
            <path className="ar-root" d="M458 0 C458 50 190 60 152 138" stroke="url(#arGold)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            <path className="ar-root" d="M458 0 L458 138" stroke="url(#arGold)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            <path className="ar-root" d="M458 0 C458 50 726 60 764 138" stroke="url(#arGold)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            <path className="ar-root" d="M300 66 C290 82 296 98 284 112" style={{ stroke: "var(--gold-faint)" }} strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
            <path className="ar-root" d="M620 66 C632 82 626 98 640 112" style={{ stroke: "var(--gold-faint)" }} strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="ar-sources">
            {card.cards.map((c, i) => (
              <div key={i} className="ar-src ar-pop">
                <p className="ar-src-k">SOURCE {i + 1}</p>
                <p className="ar-src-n">{c.name}</p>
                <p className="ar-src-m">{c.meta}</p>
              </div>
            ))}
            <a href="#companies" className="ar-src ar-spon ar-pop">
              <p className="ar-src-k" style={{ color: "var(--mute2)" }}>SPONSOR SLOT · AVAILABLE</p>
              <p className="ar-src-n" style={{ color: "var(--ink2)" }}>Your offer here</p>
              <p className="ar-src-m">One labelled card under the answer</p>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
