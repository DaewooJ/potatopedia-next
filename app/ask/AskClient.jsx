"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchStream, buildHistory } from "../../lib/api";
import { COUNTRIES } from "../../lib/data";
import { formatAnswer } from "../../lib/format";

const SUGGESTED = [
  "Which country produces the most potatoes in the world in 2024?",
  "What are the nutrition facts and health benefits of potatoes?",
  "How did Belgium become the world's #1 french fry exporter?",
  "What are the top potato varieties for cooking, frying, and baking?",
  "What are the top 10 potato producing countries in 2024?",
  "How is climate change affecting global potato production and yields?",
];

function AskChat() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  // Channel tag for the entry question only (e.g. trending_widget, suggested_prompt).
  // Defaults to user_typed; later in-chat messages are tagged per-message, not from this.
  const initialSrc = searchParams.get("src") || "user_typed";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [expandedSources, setExpandedSources] = useState({});
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const sentInitial = useRef(false);
  const userScrolledUpRef = useRef(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Smart auto-scroll: only scroll when AI content is streaming and user hasn't scrolled up
  useEffect(() => {
    // Skip if input is focused (user typing, mobile keyboard open)
    if (document.activeElement === inputRef.current) return;
    if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

    // Skip if user has manually scrolled up
    if (userScrolledUpRef.current) return;

    // Only scroll if the last message is an AI message with actual content (streaming)
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "user") return;
    if (lastMsg?.role === "ai" && !lastMsg.text) return;

    // Scroll the chat container to bottom, not the whole page
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // Track user scroll position to detect "scrolled up" vs "near bottom"
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const dist = container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollBtn(dist > 200);
      // If user is within 150px of bottom, they're "following" — allow auto-scroll
      // If they've scrolled up further, respect their position
      userScrolledUpRef.current = dist > 150;
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (initialQ && !sentInitial.current) {
      sentInitial.current = true;
      doSend(initialQ, initialSrc);
    }
    inputRef.current?.focus();
  }, []);

  const doSend = async (text, src) => {
    const q = text || input;
    if (!q.trim() || loading) return;
    userScrolledUpRef.current = false; // resume auto-scroll for new answer
    // Snapshot history from prior turns BEFORE appending the new user message
    const history = buildHistory(messages);
    setInput("");
    setMessages((p) => [...p, { role: "user", text: q }]);
    setLoading(true);
    setMessages((p) => [...p, { role: "ai", text: "", streaming: true }]);
    let firstToken = true;
    await fetchStream(
      { question: q, country: country || undefined, conversation_history: history, source: src || "user_typed" },
      (token) => {
        if (firstToken) { setLoading(false); firstToken = false; }
        setMessages((p) => { const c = [...p]; c[c.length - 1] = { ...c[c.length - 1], text: c[c.length - 1].text + token }; return c; });
      },
      (event) => {
        setLoading(false);
        setMessages((p) => {
          const c = [...p];
          const msg = c[c.length - 1];
          c[c.length - 1] = { ...msg, text: event.answer || msg.text, streaming: false, confidence: event.confidence, related_questions: event.related_questions || [], data_freshness: event.data_freshness || null, sources: event.sources || [], rewritten_question: event.rewritten_question || msg.rewritten_question || null };
          return c;
        });
      },
      (err) => {
        setLoading(false);
        // Distinguish a backend-reported failure (the stream sent an error event)
        // from a network/timeout failure. The real cause is logged to the console
        // by fetchStream; users only see a friendly message.
        const fallback = err && err.backendError
          ? "Something went wrong on our end. We've been notified. Please try again shortly."
          : "Connection issue. Please try again.";
        setMessages((p) => { const c = [...p]; c[c.length - 1] = { ...c[c.length - 1], text: c[c.length - 1].text || fallback, streaming: false }; return c; });
      },
      (rewritten) => {
        setMessages((p) => { const c = [...p]; c[c.length - 1] = { ...c[c.length - 1], rewritten_question: rewritten }; return c; });
      }
    );
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Poppins',sans-serif", background: "#FAFAFA", display: "flex", flexDirection: "column", overflowX: "hidden", maxWidth: "100vw" }}>
      <style>{`
        @keyframes ppDot { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        .pp-chat-msg * { max-width: 100% !important; overflow-wrap: break-word !important; word-break: break-word !important; }
        .pp-chat-msg table { display: block; overflow-x: auto; }
        .pp-chat-msg pre, .pp-chat-msg code { white-space: pre-wrap !important; word-break: break-all !important; }
        @keyframes ppShimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .pp-shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%); background-size: 800px 100%; animation: ppShimmer 1.5s ease-in-out infinite; border-radius: 8px; }
        @media (max-width: 768px) {
          .pp-chat-scroll { padding-left: 16px !important; padding-right: 16px !important; }
          .pp-chat-bubble { padding: 14px 16px !important; }
          .pp-follow-pills { flex-direction: column !important; flex-wrap: nowrap !important; }
          .pp-follow-pills button { width: 100% !important; text-align: left !important; white-space: normal !important; }
          .pp-chat-input-bar { padding: 12px 16px 12px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #eee", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#888", textDecoration: "none" }}>&larr;</Link>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>P</div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.5 }}>Potatopedia</span>
            </Link>
          </div>
          <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #eee", fontSize: 12, fontFamily: "inherit", background: "white", color: "#555", outline: "none", maxWidth: 180 }}>
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Chat area */}
      <div ref={chatContainerRef} style={{ flex: 1, paddingTop: 76, paddingBottom: 140, overflowY: "auto", overflowX: "hidden" }}>
        <div className="pp-chat-scroll" style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", overflowX: "hidden" }}>
          {/* Empty state */}
          {messages.length === 0 && !loading && (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>P</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>Ask Potatopedia</h2>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>AI-powered answers from 3,600+ verified data points</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 560, margin: "0 auto" }}>
                {SUGGESTED.map((q, i) => (
                  <button key={i} onClick={() => doSend(q, "suggested_prompt")} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid #e8e8e8", background: "white", fontSize: 13, color: "#555", cursor: "pointer", fontFamily: "inherit", textAlign: "left", lineHeight: 1.4, transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((m, i) => (
            <div key={i} className="pp-chat-msg" style={{ marginBottom: 24, overflowX: "hidden" }}>
              {m.role === "user" ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ maxWidth: "80%", padding: "14px 18px", borderRadius: "18px 18px 4px 18px", background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", fontSize: 15, lineHeight: 1.6 }}>{m.text}</div>
                </div>
              ) : m.streaming && !m.text ? null : (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", maxWidth: "100%" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>P</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="pp-chat-bubble" style={{ padding: "16px 20px", borderRadius: "4px 18px 18px 18px", background: "white", border: "1px solid rgba(0,0,0,0.05)", fontSize: 15, lineHeight: 1.75, color: "#333", boxShadow: "0 1px 4px rgba(0,0,0,0.03)", overflowWrap: "break-word", wordBreak: "break-word", overflow: "hidden" }}>
                      {m.rewritten_question && (
                        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#999", fontStyle: "italic", paddingBottom: 8, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>Searching: {m.rewritten_question}</p>
                      )}
                      {(() => {
                        const { cleaned, sources: inlineSources } = formatAnswer(m.text);
                        return <>
                          {cleaned.split("\n").map((line, j) => (
                            <p key={j} style={{ margin: j > 0 ? "10px 0 0" : 0 }}>
                              {line.split(/(\*\*.*?\*\*)/).map((part, k) => {
                                if (part.startsWith("**") && part.endsWith("**")) return <strong key={k} style={{ fontWeight: 600, color: "#1A1A1A" }}>{part.slice(2, -2)}</strong>;
                                return part;
                              })}
                            </p>
                          ))}
                          {!m.streaming && m.data_freshness && (
                            <p style={{ margin: "14px 0 0", fontSize: 12, color: "#999", fontStyle: "italic" }}>Based on data from {m.data_freshness.earliest_year}&ndash;{m.data_freshness.latest_year}</p>
                          )}
                          {!m.streaming && m.sources && m.sources.length > 0 && (() => {
                            const srcYears = m.sources.map((s) => s.data_year).filter(Boolean);
                            const yearRange = srcYears.length > 0 ? `${Math.min(...srcYears)}\u2013${Math.max(...srcYears)}` : "";
                            const isOpen = expandedSources[i] || false;
                            return (
                              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                                <button onClick={() => setExpandedSources((p) => ({ ...p, [i]: !p[i] }))} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "inherit", width: "100%" }}>
                                  <span style={{ fontSize: 12, color: "#999" }}>{"\uD83D\uDCDA"}</span>
                                  <span style={{ fontSize: 11, color: "#999", fontWeight: 500 }}>View {m.sources.length} source{m.sources.length !== 1 ? "s" : ""}{yearRange ? ` (${yearRange})` : ""}</span>
                                  <span style={{ fontSize: 10, color: "#bbb", transition: "transform 0.25s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", marginLeft: 2 }}>{"\u25BE"}</span>
                                </button>
                                <div style={{ maxHeight: isOpen ? 500 : 0, overflow: "hidden", transition: "max-height 0.3s ease", opacity: isOpen ? 1 : 0 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 }}>
                                    {m.sources.map((s, si) => (
                                      <div key={si} style={{ padding: "7px 10px", borderRadius: 8, background: "#FAFAFA", border: "1px solid rgba(0,0,0,0.04)" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                                          <span style={{ fontSize: 11, fontWeight: 600, color: "#444", lineHeight: 1.3 }}>{s.title || s.source}</span>
                                          {s.data_year && <span style={{ fontSize: 9, fontWeight: 600, color: "#C62828", background: "rgba(198,40,40,0.06)", padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap", flexShrink: 0 }}>{s.data_year}</span>}
                                        </div>
                                        {s.relevant_excerpt && <p style={{ fontSize: 11, color: "#999", lineHeight: 1.4, margin: "3px 0 0" }}>{s.relevant_excerpt}</p>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                          {!m.streaming && (!m.sources || m.sources.length === 0) && inlineSources.length > 0 && (
                            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: "#C62828", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Sources</div>
                              {inlineSources.map((s, si) => <div key={si} style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{s}</div>)}
                            </div>
                          )}
                        </>;
                      })()}
                    </div>
                    {/* Confidence + copy + save */}
                    {!m.streaming && (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", maxWidth: "100%" }}>
                        {m.confidence && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: m.confidence === "high" ? "#2D6A30" : m.confidence === "medium" ? "#B8860B" : "#C62828", background: m.confidence === "high" ? "rgba(45,106,48,0.08)" : m.confidence === "medium" ? "rgba(184,134,11,0.08)" : "rgba(198,40,40,0.08)", padding: "3px 10px", borderRadius: 8 }}>{m.confidence} confidence</span>
                        )}
                        <button onClick={() => { navigator.clipboard.writeText(m.text); const btn = document.getElementById("cp-" + i); if (btn) { btn.textContent = "\u2705 Copied!"; setTimeout(() => { btn.textContent = "\uD83D\uDCCB Copy"; }, 2000); } }} id={"cp-" + i} style={{ fontSize: 11, fontWeight: 500, color: "#888", background: "none", border: "1px solid #e8e8e8", borderRadius: 8, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>{"\uD83D\uDCCB"} Copy</button>
                        <button onClick={() => { const q = messages[i - 1]?.text || ""; const bm = { id: Date.now(), question: q, answer: m.text, savedAt: new Date().toISOString() }; const existing = JSON.parse(localStorage.getItem("pp_bookmarks") || "[]"); localStorage.setItem("pp_bookmarks", JSON.stringify([bm, ...existing])); const btn = document.getElementById("bm-" + i); if (btn) { btn.textContent = "\u2705 Saved!"; setTimeout(() => { btn.textContent = "\uD83D\uDD16 Save"; }, 2000); } }} id={"bm-" + i} style={{ fontSize: 11, fontWeight: 500, color: "#888", background: "none", border: "1px solid #e8e8e8", borderRadius: 8, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>{"\uD83D\uDD16"} Save</button>
                      </div>
                    )}
                    {/* Follow-up pills */}
                    {m.related_questions && m.related_questions.length > 0 && (
                      <div className="pp-follow-pills" style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8, maxWidth: "100%" }}>
                        {m.related_questions.map((rq, ri) => (
                          <button key={ri} onClick={() => doSend(rq, "related_question")} style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: "white", fontSize: 12, color: "#555", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.3, transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
                            onMouseEnter={(e) => { e.target.style.background = "#C62828"; e.target.style.color = "white"; e.target.style.borderColor = "#C62828"; }}
                            onMouseLeave={(e) => { e.target.style.background = "white"; e.target.style.color = "#555"; e.target.style.borderColor = "#e0e0e0"; }}
                          >{rq}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>P</div>
              <div style={{ flex: 1, padding: "16px 20px", borderRadius: "4px 18px 18px 18px", background: "white", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C62828", animation: "ppDot 1.2s ease-in-out infinite" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C62828", animation: "ppDot 1.2s ease-in-out 0.2s infinite" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C62828", animation: "ppDot 1.2s ease-in-out 0.4s infinite" }} />
                  <span style={{ fontSize: 13, color: "#999", marginLeft: 8 }}>Searching knowledge base...</span>
                </div>
                <div className="pp-shimmer" style={{ height: 14, width: "90%", marginBottom: 10 }} />
                <div className="pp-shimmer" style={{ height: 14, width: "75%", marginBottom: 10 }} />
                <div className="pp-shimmer" style={{ height: 14, width: "82%", marginBottom: 10 }} />
                <div className="pp-shimmer" style={{ height: 14, width: "60%" }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Scroll to bottom */}
      {showScrollBtn && (
        <button onClick={() => { userScrolledUpRef.current = false; const container = chatContainerRef.current; if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" }); }} style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", width: 40, height: 40, borderRadius: 20, background: "white", border: "1px solid #e0e0e0", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#888", zIndex: 99 }}>&darr;</button>
      )}

      {/* Input bar */}
      <div className="pp-chat-input-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(250,250,250,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "16px 24px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 10 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: "white", borderRadius: 14, border: "1.5px solid #e8e8e8", padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSend()} placeholder="Ask a follow-up question..." disabled={loading} style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontFamily: "inherit", padding: "14px 0", background: "transparent", color: "#333" }} />
          </div>
          <button onClick={() => doSend()} disabled={!input.trim() || loading} style={{ width: 48, height: 48, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!input.trim() || loading) ? 0.3 : 1, transition: "opacity 0.2s", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AskClient() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>P</div>
      </div>
    }>
      <AskChat />
    </Suspense>
  );
}
