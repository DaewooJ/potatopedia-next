"use client";

import { useState, useEffect, useRef } from "react";
import { fetchStream } from "../lib/api";
import { COUNTRY_TOPICS } from "../lib/data";
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

export default function CountryAI({ countryName, countrySlug }) {
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [topics, setTopics] = useState({});
  const [topicLoading, setTopicLoading] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [askInput, setAskInput] = useState("");
  const [askResult, setAskResult] = useState(null);
  const [askLoading, setAskLoading] = useState(false);
  const askResultRef = useRef(null);

  // Auto-load overview on mount
  useEffect(() => {
    setOverview(null);
    setTopics({});
    setActiveTopic(null);
    setAskResult(null);

    const cacheKey = "country-overview-" + countrySlug;
    const cached = getCached(cacheKey);
    if (cached) { setOverview(cached); return; }

    setOverviewLoading(true);
    const partial = { answer: "" };
    fetchStream(
      { question: "Give me a comprehensive overview of the " + countryName + " potato industry including production, key players, trade, and what makes it distinctive", country: countryName },
      (token) => { partial.answer += token; setOverview({ ...partial }); setOverviewLoading(false); },
      (event) => { const full = { answer: partial.answer || event.answer, ...event }; setOverview(full); setCache(cacheKey, full); setOverviewLoading(false); },
      () => { setOverviewLoading(false); }
    );
  }, [countrySlug, countryName]);

  const loadTopic = (topic) => {
    if (activeTopic === topic.id) { setActiveTopic(null); return; }
    setActiveTopic(topic.id);
    if (topics[topic.id]) return;

    const cacheKey = "country-" + countrySlug + "-" + topic.id;
    const cached = getCached(cacheKey);
    if (cached) { setTopics((p) => ({ ...p, [topic.id]: cached })); return; }

    setTopicLoading(topic.id);
    const partial = { answer: "" };
    fetchStream(
      { question: "Tell me about " + countryName + " " + topic.q, country: countryName },
      (token) => { partial.answer += token; setTopics((p) => ({ ...p, [topic.id]: { ...partial } })); setTopicLoading(null); },
      (event) => { const full = { answer: partial.answer || event.answer, ...event }; setTopics((p) => ({ ...p, [topic.id]: full })); setCache(cacheKey, full); setTopicLoading(null); },
      () => { setTopicLoading(null); }
    );
  };

  const doAsk = (text) => {
    const q = text || askInput;
    if (!q.trim() || askLoading) return;
    if (text) setAskInput(text);
    setAskLoading(true);
    setAskResult(null);
    // Build history from the user's reading context on this page: the overview,
    // any actively-expanded topic, and the most recent inline ask (if any).
    // This keeps follow-ups like "what about processing?" scoped to this country.
    const history = [];
    if (overview && overview.answer) {
      history.push({ role: "user", content: countryName + " potato industry overview" });
      history.push({ role: "assistant", content: String(overview.answer).slice(0, 500) });
    }
    if (activeTopic && topics[activeTopic] && topics[activeTopic].answer) {
      history.push({ role: "user", content: countryName + " " + activeTopic });
      history.push({ role: "assistant", content: String(topics[activeTopic].answer).slice(0, 500) });
    }
    if (askResult && askResult.answer && askInput) {
      history.push({ role: "user", content: askInput });
      history.push({ role: "assistant", content: String(askResult.answer).slice(0, 500) });
    }
    const trimmed = history.slice(-6); // max 3 exchanges
    const partial = { answer: "" };
    fetchStream(
      { question: q, country: countryName, conversation_history: trimmed.length > 0 ? trimmed : undefined },
      (token) => { partial.answer += token; setAskResult({ ...partial }); setAskLoading(false); },
      (event) => { setAskResult({ answer: partial.answer || event.answer, ...event }); setAskLoading(false); },
      () => { setAskLoading(false); }
    );
  };

  return (
    <>
      {/* ─── Industry Overview ─── */}
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "56px 48px 40px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 4, height: 28, borderRadius: 2, background: "linear-gradient(180deg,#C62828,#E53935)", display: "inline-block" }} />
          Industry Overview
        </h2>
        {overviewLoading && <EngagingLoader title={countryName + " potato industry"} />}
        {overview && (
          <div style={{ padding: "24px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.05)", background: "#FAFAFA" }}>
            <AnswerBlock data={overview} />
            {overview.related_questions && overview.related_questions.length > 0 && (
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {overview.related_questions.map((rq, ri) => (
                  <button
                    key={ri}
                    onClick={() => { doAsk(rq); setTimeout(() => askResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150); }}
                    style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: "white", fontSize: 12, color: "#555", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.3, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.target.style.background = "#C62828"; e.target.style.color = "white"; e.target.style.borderColor = "#C62828"; }}
                    onMouseLeave={(e) => { e.target.style.background = "white"; e.target.style.color = "#555"; e.target.style.borderColor = "#e0e0e0"; }}
                  >{rq}</button>
                ))}
              </div>
            )}
          </div>
        )}
        {!overviewLoading && !overview && (
          <div style={{ padding: "24px", borderRadius: 16, border: "1px solid #eee", background: "#FAFAFA", color: "#888", fontSize: 14 }}>
            Overview could not be loaded. The backend may be starting up &mdash; try refreshing in a moment.
          </div>
        )}
      </section>

      {/* ─── Explore Topics ─── */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>Explore Topics</h2>
            <p style={{ fontSize: 14, color: "#888" }}>Click a topic to load AI-powered analysis for {countryName}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28 }}>
            {COUNTRY_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => loadTopic(t)}
                className="pp-pill"
                style={{
                  padding: "9px 18px", borderRadius: 20, border: "1px solid",
                  borderColor: activeTopic === t.id ? "#C62828" : "#e0e0e0",
                  background: activeTopic === t.id ? "#C62828" : "white",
                  color: activeTopic === t.id ? "white" : "#555",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
              >{t.label}</button>
            ))}
          </div>
          {COUNTRY_TOPICS.map((t) => (
            activeTopic === t.id && (
              <div key={t.id} style={{ padding: "24px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.05)", background: "white", marginBottom: 16, animation: "ppFadeUp 0.4s ease-out both" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>{t.label} &mdash; {countryName}</h3>
                {topicLoading === t.id && <EngagingLoader title={countryName + " " + t.label} />}
                {topics[t.id] && (
                  <>
                    <AnswerBlock data={topics[t.id]} />
                    {topics[t.id].related_questions && topics[t.id].related_questions.length > 0 && (
                      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {topics[t.id].related_questions.map((rq, ri) => (
                          <button
                            key={ri}
                            onClick={() => { setActiveTopic(null); doAsk(rq); setTimeout(() => askResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150); }}
                            style={{ padding: "7px 12px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#FAFAFA", fontSize: 11, color: "#555", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.3, transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.target.style.background = "#C62828"; e.target.style.color = "white"; e.target.style.borderColor = "#C62828"; }}
                            onMouseLeave={(e) => { e.target.style.background = "#FAFAFA"; e.target.style.color = "#555"; e.target.style.borderColor = "#e0e0e0"; }}
                          >{rq}</button>
                        ))}
                      </div>
                    )}
                  </>
                )}
                {!topicLoading && !topics[t.id] && (
                  <div style={{ color: "#888", fontSize: 14 }}>Could not load this topic. Try again.</div>
                )}
              </div>
            )
          ))}
        </div>
      </section>

      {/* ─── Inline Ask ─── */}
      <section id="pp-country-ask" style={{ maxWidth: 820, margin: "0 auto", padding: "56px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>Ask Anything About {countryName}</h2>
          <p style={{ fontSize: 14, color: "#888" }}>AI-powered answers from our knowledge base, pre-filtered for {countryName}</p>
        </div>
        <div className="pp-search-wrap pp-search-bar" style={{ display: "flex", background: "#fff", borderRadius: 16, border: "2px solid #eee", padding: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", transition: "all 0.3s", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doAsk()}
              placeholder={"e.g. What potato varieties are grown in " + countryName + "?"}
              disabled={askLoading}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", padding: "12px 0", background: "transparent", color: "#333" }}
            />
          </div>
          <button
            className="pp-search-btn"
            onClick={doAsk}
            disabled={!askInput.trim() || askLoading}
            style={{
              padding: "12px 28px", borderRadius: "0 10px 10px 0", border: "none",
              background: "linear-gradient(135deg,#C62828,#E53935)", color: "white",
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              whiteSpace: "nowrap", opacity: (!askInput.trim() || askLoading) ? 0.3 : 1,
            }}
          >Ask AI</button>
        </div>
        <div ref={askResultRef} />
        {askLoading && <div style={{ maxWidth: 640, margin: "16px auto 0" }}><EngagingLoader title={countryName} /></div>}
        {askResult && (
          <div style={{ maxWidth: 640, margin: "20px auto 0", padding: "24px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.05)", background: "#FAFAFA", animation: "ppFadeUp 0.4s ease-out both" }}>
            <AnswerBlock data={askResult} />
            {askResult.related_questions && askResult.related_questions.length > 0 && (
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {askResult.related_questions.map((rq, ri) => (
                  <button
                    key={ri}
                    onClick={() => { setAskResult(null); doAsk(rq); }}
                    style={{ padding: "7px 12px", borderRadius: 20, border: "1px solid #e0e0e0", background: "white", fontSize: 11, color: "#555", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.target.style.background = "#C62828"; e.target.style.color = "white"; }}
                    onMouseLeave={(e) => { e.target.style.background = "white"; e.target.style.color = "#555"; }}
                  >{rq}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
