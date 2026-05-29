"use client";

import { useState, useEffect, useRef } from "react";
import { fetchStream } from "../lib/api";
import AnswerBlock from "./AnswerBlock";
import EngagingLoader from "./EngagingLoader";

// localStorage cache helpers (24h TTL)
const CACHE_TTL = 24 * 60 * 60 * 1000;
function getCached(key) {
  try {
    const raw = localStorage.getItem("pp_" + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem("pp_" + key); return null; }
    return data;
  } catch { return null; }
}
function setCache(key, data) {
  try { localStorage.setItem("pp_" + key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

export default function AnswerAI({ slug, question, prebakedAnswer, skipInitialFetch }) {
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [askInput, setAskInput] = useState("");
  const [followUp, setFollowUp] = useState(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const followUpRef = useRef(null);
  const followUpResultRef = useRef(null);

  // Auto-load answer on mount UNLESS skipInitialFetch is set (meaning the page
  // already server-rendered the baked answer above — we just provide follow-up).
  useEffect(() => {
    if (skipInitialFetch) return;

    setAnswer(null);
    setFollowUp(null);
    setAskInput("");

    const cacheKey = "answer-" + slug;
    const cached = getCached(cacheKey);
    if (cached) { setAnswer(cached); return; }

    setLoading(true);
    const partial = { answer: "" };
    fetchStream(
      { question },
      (token) => {
        partial.answer += token;
        setAnswer({ ...partial });
        setLoading(false);
      },
      (event) => {
        const full = { answer: partial.answer || event.answer, ...event };
        setAnswer(full);
        setCache(cacheKey, full);
        setLoading(false);
      },
      () => { setLoading(false); }
    );
  }, [slug, question, skipInitialFetch]);

  const doFollowUp = (text) => {
    const q = text || askInput;
    if (!q.trim() || followUpLoading) return;
    if (text) setAskInput(text);
    setFollowUpLoading(true);
    setFollowUp(null);
    // Build history from the initial answer so follow-ups stay scoped to this topic.
    // If a prior follow-up exists, include it too (that's the most recent exchange).
    const history = [];
    const initialContent = (answer && answer.answer) || prebakedAnswer;
    if (initialContent) {
      history.push({ role: "user", content: question });
      history.push({ role: "assistant", content: String(initialContent).slice(0, 500) });
    }
    if (followUp && followUp.answer && askInput) {
      history.push({ role: "user", content: askInput });
      history.push({ role: "assistant", content: String(followUp.answer).slice(0, 500) });
    }
    // Keep only the last 3 exchanges (6 items)
    const trimmed = history.slice(-6);
    const partial = { answer: "" };
    fetchStream(
      { question: q, conversation_history: trimmed.length > 0 ? trimmed : undefined },
      (token) => {
        partial.answer += token;
        setFollowUp({ ...partial });
        setFollowUpLoading(false);
      },
      (event) => {
        setFollowUp({ answer: partial.answer || event.answer, ...event });
        setFollowUpLoading(false);
      },
      () => { setFollowUpLoading(false); }
    );
  };

  return (
    <div>
      {/* Main answer (hidden in follow-up-only mode where the page already SSR'd the baked answer) */}
      {!skipInitialFetch && (
      <div style={{
        padding: "28px", borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.05)", background: "#FAFAFA",
        marginBottom: 32,
      }}>
        {loading && <EngagingLoader title={question} />}
        {answer && (
          <>
            <AnswerBlock data={answer} />

            {/* Related question pills */}
            {answer.related_questions && answer.related_questions.length > 0 && (
              <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {answer.related_questions.map((rq, ri) => (
                  <button
                    key={ri}
                    onClick={() => {
                      doFollowUp(rq);
                      setTimeout(() => followUpResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
                    }}
                    style={{
                      padding: "8px 14px", borderRadius: 20,
                      border: "1px solid #e0e0e0", background: "white",
                      fontSize: 12, color: "#555", cursor: "pointer",
                      fontFamily: "Poppins, sans-serif", lineHeight: 1.3,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.target.style.background = "#C62828"; e.target.style.color = "white"; e.target.style.borderColor = "#C62828"; }}
                    onMouseLeave={(e) => { e.target.style.background = "white"; e.target.style.color = "#555"; e.target.style.borderColor = "#e0e0e0"; }}
                  >{rq}</button>
                ))}
              </div>
            )}
          </>
        )}
        {!loading && !answer && (
          <div style={{ color: "#888", fontSize: 14, padding: "12px 0" }}>
            Answer could not be loaded. The backend may be starting up &mdash; try refreshing in a moment.
          </div>
        )}
      </div>
      )}

      {/* Follow-up ask section */}
      <div ref={followUpRef} style={{ marginBottom: 32 }}>
        {!skipInitialFetch && (
        <h2 style={{
          fontSize: 18, fontWeight: 700, color: "#1A1A1A",
          marginBottom: 14, fontFamily: "Poppins, sans-serif",
        }}>Ask a Follow-up</h2>
        )}
        <div className="pp-search-wrap pp-search-bar" style={{
          display: "flex", background: "#fff", borderRadius: 16,
          border: "2px solid #eee", padding: 6,
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          transition: "all 0.3s",
        }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doFollowUp()}
              placeholder="Ask a follow-up question..."
              disabled={followUpLoading}
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 14, fontFamily: "Poppins, sans-serif",
                padding: "12px 0", background: "transparent", color: "#333",
              }}
            />
          </div>
          <button
            className="pp-search-btn"
            onClick={() => doFollowUp()}
            disabled={!askInput.trim() || followUpLoading}
            style={{
              padding: "12px 28px", borderRadius: "0 10px 10px 0",
              border: "none", background: "linear-gradient(135deg,#C62828,#E53935)",
              color: "white", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "Poppins, sans-serif",
              whiteSpace: "nowrap",
              opacity: (!askInput.trim() || followUpLoading) ? 0.3 : 1,
            }}
          >Ask AI</button>
        </div>

        <div ref={followUpResultRef} />
        {followUpLoading && (
          <div style={{ marginTop: 16 }}>
            <EngagingLoader title="follow-up" />
          </div>
        )}
        {followUp && (
          <div style={{
            marginTop: 20, padding: "24px", borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.05)", background: "#FAFAFA",
            animation: "ppFadeUp 0.4s ease-out both",
          }}>
            <AnswerBlock data={followUp} />
            {followUp.related_questions && followUp.related_questions.length > 0 && (
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {followUp.related_questions.map((rq, ri) => (
                  <button
                    key={ri}
                    onClick={() => {
                      setFollowUp(null);
                      doFollowUp(rq);
                      setTimeout(() => followUpResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
                    }}
                    style={{
                      padding: "7px 12px", borderRadius: 20,
                      border: "1px solid #e0e0e0", background: "white",
                      fontSize: 11, color: "#555", cursor: "pointer",
                      fontFamily: "Poppins, sans-serif", transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.target.style.background = "#C62828"; e.target.style.color = "white"; }}
                    onMouseLeave={(e) => { e.target.style.background = "white"; e.target.style.color = "#555"; }}
                  >{rq}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
