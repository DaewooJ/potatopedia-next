"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AI_KNOWLEDGE_PAGES, UPDATED_SHORT } from "@/lib/data";
import EngagingLoader from "./EngagingLoader";

function parseContent(text) {
  const lines = text.split("\n");
  const elements = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} style={{ paddingLeft: 24, marginBottom: 16 }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ fontSize: 15, color: "#444", lineHeight: 1.8, marginBottom: 6 }}>{renderBold(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const renderBold = (str) => {
    const parts = str.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushList();
      continue;
    }

    // h2: lines that start and end with **
    if (/^\*\*.+\*\*$/.test(line)) {
      flushList();
      const heading = line.replace(/^\*\*/, "").replace(/\*\*$/, "");
      elements.push(
        <h2 key={`h2-${i}`} style={{ fontSize: 22, fontWeight: 700, paddingLeft: 16, borderLeft: "4px solid #C62828", marginTop: 44, marginBottom: 14, color: "#1A1A1A" }}>
          {heading}
        </h2>
      );
      continue;
    }

    // list items
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    // regular paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} style={{ fontSize: 15, color: "#444", lineHeight: 1.8, marginBottom: 16 }}>
        {renderBold(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

export default function KnowledgeAI({ slug, title, tag }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheKey = `pp_knowledge-${slug}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setContent(cached);
      setLoading(false);
      return;
    }

    const pageConfig = AI_KNOWLEDGE_PAGES?.[slug];
    if (!pageConfig) {
      setError("No configuration found for this page.");
      setLoading(false);
      return;
    }

    fetch("https://potatopedia-backend.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: pageConfig.prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        const text = data.answer || data.response || "";
        localStorage.setItem(cacheKey, text);
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load content. Please try again.");
        setLoading(false);
      });
  }, [slug]);

  return (
    <article style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13 }}>
        <Link href="/knowledge" style={{ color: "#888", textDecoration: "none" }}>Knowledge Hub</Link>
        <span style={{ color: "#ccc" }}>/</span>
        <span style={{ color: "#C62828", fontWeight: 700 }}>{tag || "Knowledge"}</span>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {tag && (
          <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, background: "rgba(198,40,40,0.06)", padding: "4px 12px", borderRadius: 10 }}>
            {tag}
          </span>
        )}
        <span style={{ fontSize: 10, fontWeight: 600, color: "#888", background: "#f5f5f5", padding: "4px 10px", borderRadius: 10 }}>
          Updated {UPDATED_SHORT}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#2E7D32", background: "rgba(46,125,50,0.06)", padding: "4px 10px", borderRadius: 10 }}>
          AI-Generated from Verified Sources
        </span>
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, marginBottom: 24 }}>
        {title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </h1>

      {loading && <EngagingLoader title={title} />}
      {error && <p style={{ color: "#C62828", fontSize: 15 }}>{error}</p>}
      {content && parseContent(content)}

      {content && (
        <div style={{ marginTop: 56, padding: "32px 28px", borderRadius: 16, background: "linear-gradient(135deg, rgba(198,40,40,0.06), rgba(198,40,40,0.02))", border: "1px solid rgba(198,40,40,0.12)", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>Have more questions?</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>Ask Potatopedia AI for instant, data-backed answers.</div>
          <Link href="/ask" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg,#C62828,#E53935)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Ask Potatopedia AI &rarr;
          </Link>
        </div>
      )}
    </article>
  );
}
