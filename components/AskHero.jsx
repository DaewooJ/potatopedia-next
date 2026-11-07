"use client";

import { useState, useRef } from "react";
import { fetchStream, buildHistory } from "../lib/api";
import AnswerBlock from "./AnswerBlock";

// The homepage hero: Potatopedia's AI answer engine. Streams the sourced answer in place (POST /ask/stream).
const EXAMPLES = [
  "Which potato variety is best for French fries?",
  "Which country produces the most potatoes?",
  "How much protein is in a potato?",
  "What is seed potato certification?",
];

export default function AskHero() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const send = (text, src) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    const history = buildHistory(messages);
    setInput("");
    setLoading(true);
    setMessages((p) => [...p, { role: "user", text: q }, { role: "ai", text: "", streaming: true }]);
    let first = true;
    const patch = (fn) =>
      setMessages((p) => {
        const c = [...p];
        c[c.length - 1] = fn(c[c.length - 1]);
        return c;
      });
    fetchStream(
      { question: q, conversation_history: history, source: src || "homepage_hero" },
      (token) => {
        if (first) { setLoading(false); first = false; }
        patch((m) => ({ ...m, text: m.text + token }));
      },
      (ev) => {
        setLoading(false);
        patch((m) => ({
          ...m,
          text: ev.answer || m.text,
          streaming: false,
          confidence: ev.confidence,
          sources: ev.sources || [],
          data_freshness: ev.data_freshness || null,
          related_questions: ev.related_questions || [],
        }));
      },
      () => {
        setLoading(false);
        patch((m) => ({ ...m, text: m.text || "Connection issue. Please try again.", streaming: false }));
      },
    );
  };

  return (
    <div className="ah">
      <form
        className="ah-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="ah-q" className="ah-sr">Ask a question about potatoes</label>
        <input
          id="ah-q"
          ref={inputRef}
          className="ah-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={messages.length ? "Ask a follow-up…" : "Ask a question, in any language"}
          disabled={loading}
          autoComplete="off"
        />
        <button type="submit" className="ah-btn" disabled={!input.trim() || loading}>
          {loading ? "Searching…" : "Ask"}
        </button>
      </form>

      {messages.length === 0 && (
        <div className="ah-examples" aria-label="Example questions">
          <span className="ah-try">Try</span>
          {EXAMPLES.map((q) => (
            <button key={q} type="button" className="ah-chip" onClick={() => send(q, "suggested_prompt")}>
              {q}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div className="ah-thread" aria-live="polite">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <p key={i} className="ah-q">{m.text}</p>
            ) : (
              <div key={i} className="ah-a">
                {m.streaming && !m.text ? (
                  <p className="ah-wait">Searching 300+ sources…</p>
                ) : m.streaming ? (
                  <div className="ah-stream">{m.text}</div>
                ) : (
                  <AnswerBlock data={{ answer: m.text, confidence: m.confidence, sources: m.sources, data_freshness: m.data_freshness }} />
                )}
                {!m.streaming && m.related_questions?.length > 0 && (
                  <div className="ah-examples" style={{ marginTop: 14 }}>
                    <span className="ah-try">Next</span>
                    {m.related_questions.slice(0, 3).map((rq) => (
                      <button key={rq} type="button" className="ah-chip" onClick={() => send(rq, "related_question")}>
                        {rq}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      )}

      <style>{`
        .ah { width: 100%; }
        .ah-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        .ah-form { display: flex; gap: 8px; background: #fff; border: 1.5px solid #D4D4D8; border-radius: 14px; padding: 7px; box-shadow: 0 12px 40px rgba(15, 15, 20, 0.08); }
        .ah-form:focus-within { border-color: #C62828; box-shadow: 0 0 0 4px rgba(198, 40, 40, 0.10), 0 12px 40px rgba(15, 15, 20, 0.08); }
        .ah-input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 18px; padding: 14px 14px; color: #111114; }
        .ah-input::placeholder { color: #8B8B94; }
        .ah-btn { border: 0; border-radius: 10px; background: #C62828; color: #fff; font: inherit; font-weight: 600; font-size: 16px; padding: 0 28px; cursor: pointer; min-height: 52px; }
        .ah-btn:disabled { opacity: .45; cursor: default; }
        .ah-btn:not(:disabled):hover { background: #A61F1F; }
        .ah-examples { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 16px; }
        .ah-try { font-size: 13px; color: #6B6B74; margin-right: 2px; }
        .ah-chip { font: inherit; font-size: 13.5px; color: #2A2A30; background: #fff; border: 1px solid #E4E4E7; border-radius: 999px; padding: 7px 14px; cursor: pointer; }
        .ah-chip:hover { border-color: #C62828; color: #C62828; }
        .ah-thread { margin-top: 22px; display: flex; flex-direction: column; gap: 14px; text-align: left; }
        .ah-q { margin: 0; font-weight: 600; font-size: 17px; color: #111114; }
        .ah-a { background: #fff; border: 1px solid #E4E4E7; border-radius: 14px; padding: 18px 20px; }
        .ah-stream { font-size: 15px; line-height: 1.7; color: #27272A; white-space: pre-wrap; }
        .ah-wait { margin: 0; color: #6B6B74; font-size: 14px; }
        @media (max-width: 600px) {
          .ah-form { flex-direction: column; padding: 8px; }
          .ah-input { font-size: 16px; padding: 12px 10px; }
          .ah-btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}
