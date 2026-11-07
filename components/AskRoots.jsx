"use client";

import { useEffect, useRef, useState } from "react";
import { fetchStream, buildHistory } from "../lib/api";

// Homepage hero: the answer engine. Today's answer is server-rendered (real text for SEO and LCP); a new question
// streams in place and grows fresh "roots" into its source cards. Other sections can ask through
// window.dispatchEvent(new CustomEvent("pp-ask", { detail: "question" })).

function clean(md) {
  return String(md || "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n?FOLLOW_UP:.*$/gm, "")
    .trim();
}

// **bold** → <strong>, paragraphs kept. Text only, no HTML injection.
function Rich({ text }) {
  const paras = clean(text).split(/\n\s*\n/).filter(Boolean);
  return paras.map((p, i) => (
    <p key={i} className="ar-p">
      {p.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : <span key={j}>{part.replace(/\*\*/g, "")}</span>,
      )}
    </p>
  ));
}

function sourceCards(sources) {
  return (sources || []).slice(0, 2).map((s) => ({
    name: s.name || s.title || "Potatopedia knowledge base",
    meta: s.meta || (s.data_year ? `Data year ${s.data_year}` : "Potatopedia knowledge base"),
  }));
}

export default function AskRoots({ initial }) {
  const [thread, setThread] = useState([]); // [{q, text, streaming, sources, related}]
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const topRef = useRef(null);

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
