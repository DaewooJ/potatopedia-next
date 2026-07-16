"use client";

import { useState, useRef } from "react";
import { fetchStream, buildHistory } from "../lib/api";
import AnswerBlock from "./AnswerBlock";

const CHIPS = [
  "Best variety for French fries?",
  "Why did potato prices spike in 2024?",
  "Are potatoes bad for diabetics?",
];

export default function HomeAsk() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const doSend = (text, src) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    const history = buildHistory(messages);
    setInput("");
    setLoading(true);
    setMessages((p) => [...p, { role: "user", text: q }, { role: "ai", text: "", streaming: true }]);

    let firstToken = true;
    fetchStream(
      { question: q, conversation_history: history, source: src || "homepage_widget" },
      (token) => {
        if (firstToken) { setLoading(false); firstToken = false; }
        setMessages((p) => {
          const c = [...p];
          c[c.length - 1] = { ...c[c.length - 1], text: c[c.length - 1].text + token };
          return c;
        });
      },
      (event) => {
        setLoading(false);
        setMessages((p) => {
          const c = [...p];
          c[c.length - 1] = {
            ...c[c.length - 1],
            text: event.answer || c[c.length - 1].text,
            streaming: false,
            confidence: event.confidence,
            sources: event.sources || [],
            data_freshness: event.data_freshness || null,
            related_questions: event.related_questions || [],
          };
          return c;
        });
      },
      () => {
        setLoading(false);
        setMessages((p) => {
          const c = [...p];
          c[c.length - 1] = { ...c[c.length - 1], text: c[c.length - 1].text || "Connection issue — please try again.", streaming: false };
          return c;
        });
      }
    );
  };

  const hasMessages = messages.length > 0;

  return (
    <section style={{ maxWidth: 640, margin: "56px auto 0", padding: "0 24px 88px" }}>
      <div style={{ position: "relative", background: "#fff", border: "1px solid rgba(198,40,40,0.1)", borderRadius: 24, padding: "34px 30px 30px", boxShadow: "0 24px 60px rgba(198,40,40,0.12)", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 260, height: 260, background: "radial-gradient(circle,rgba(198,40,40,0.1),transparent 70%)", top: -120, right: -80, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: "#C62828", marginBottom: 14 }}>Ask anything</div>
        <form
          onSubmit={(e) => { e.preventDefault(); doSend(); }}
          style={{ position: "relative", display: "flex", gap: 8, background: "#FAFAFA", border: "2px solid #ECECEC", borderRadius: 14, padding: 6 }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Which country produces the most potatoes?"
            disabled={loading}
            style={{ flex: 1, border: "none", outline: "none", padding: "13px 14px", fontSize: 15.5, fontFamily: "inherit", background: "transparent", color: "#1A1A1A" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{ background: "linear-gradient(135deg,#C62828,#E53935)", color: "#fff", border: "none", fontWeight: 700, padding: "0 24px", borderRadius: 9, cursor: "pointer", fontSize: 14, whiteSpace: "nowrap", opacity: (!input.trim() || loading) ? 0.4 : 1 }}
          >Ask →</button>
        </form>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, margin: "16px 4px 0" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#8A8F98", whiteSpace: "nowrap" }}>🌐 Ask in your language:</span>
          <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
            {["中文", "Español", "Français", "العربية"].map((l) => (
              <span key={l} style={{ fontSize: 11, fontWeight: 600, color: "#4B5563", border: "1px solid #ECECEC", padding: "3px 10px", borderRadius: 14 }}>{l}</span>
            ))}
            <span style={{ fontSize: 11, fontWeight: 600, color: "#C62828", border: "1px dashed rgba(198,40,40,0.1)", background: "rgba(198,40,40,0.06)", padding: "3px 10px", borderRadius: 14 }}>+ any language</span>
          </span>
        </div>
      </div>

      {!hasMessages && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 22 }}>
          {CHIPS.map((q) => (
            <button
              key={q}
              onClick={() => doSend(q, "suggested_prompt")}
              style={{ fontSize: 12.5, color: "#4B5563", background: "#fff", border: "1px solid #ECECEC", padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C62828"; e.currentTarget.style.color = "#C62828"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ECECEC"; e.currentTarget.style.color = "#4B5563"; }}
            >{q}</button>
          ))}
        </div>
      )}

      {hasMessages && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "user" ? (
                <div style={{ maxWidth: "86%", borderRadius: "16px 16px 4px 16px", padding: "13px 16px", fontSize: 14.5, background: "linear-gradient(135deg,#C62828,#8E0000)", color: "#fff" }}>{m.text}</div>
              ) : m.streaming && !m.text ? (
                <div style={{ maxWidth: "86%", borderRadius: "16px 16px 16px 4px", padding: "14px 16px", background: "#fff", border: "1px solid #ECECEC", boxShadow: "0 10px 28px rgba(20,20,20,0.05)", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="pp-typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#8A8F98", animationDelay: `${d * 0.2}s` }} />
                  ))}
                </div>
              ) : (
                <div style={{ maxWidth: "100%", width: "100%" }}>
                  <div style={{ borderRadius: "16px 16px 16px 4px", padding: "14px 18px", background: "#fff", border: "1px solid #ECECEC", boxShadow: "0 10px 28px rgba(20,20,20,0.05)" }}>
                    {m.streaming ? (
                      <div style={{ fontSize: 14.5, lineHeight: 1.7, color: "#333", whiteSpace: "pre-wrap" }}>{m.text}</div>
                    ) : (
                      <AnswerBlock data={{ answer: m.text, confidence: m.confidence, sources: m.sources, data_freshness: m.data_freshness }} />
                    )}
                  </div>
                  {!m.streaming && m.related_questions && m.related_questions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                      {m.related_questions.map((rq, ri) => (
                        <button
                          key={ri}
                          onClick={() => doSend(rq, "related_question")}
                          style={{ fontSize: 12, color: "#4B5563", background: "#fff", border: "1px solid #ECECEC", padding: "7px 13px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C62828"; e.currentTarget.style.color = "#C62828"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ECECEC"; e.currentTarget.style.color = "#4B5563"; }}
                        >{rq}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes ppTypingBlink { 0%, 80%, 100% { opacity: 0.25 } 40% { opacity: 1 } }
        .pp-typing-dot { animation: ppTypingBlink 1.2s infinite; display: inline-block; }
        @media (prefers-reduced-motion: reduce) { .pp-typing-dot { animation: none; opacity: 0.6; } }
      `}</style>
    </section>
  );
}
