"use client";

import { useEffect, useState } from "react";

export default function BlogTOC({ items }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !items || items.length === 0) return;
    const headings = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length < 4) return null;

  return (
    <details
      open
      style={{
        marginBottom: 40,
        padding: "16px 20px",
        background: "#FAFAFA",
        border: "1px solid #ececec",
        borderRadius: 12,
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          fontWeight: 700,
          color: "#999",
          textTransform: "uppercase",
          letterSpacing: 1.5,
        }}
      >
        <span>In this article ({items.length} sections)</span>
        <span style={{ fontSize: 13, color: "#bbb", fontWeight: 400 }}>▾</span>
      </summary>
      <nav style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((it, i) => {
          const isActive = activeId === it.id;
          return (
            <a
              key={i}
              href={`#${it.id}`}
              style={{
                fontSize: 13.5,
                color: isActive ? "#C62828" : "#555",
                fontWeight: isActive ? 600 : 400,
                textDecoration: "none",
                padding: "7px 0 7px 12px",
                borderLeft: isActive ? "2px solid #C62828" : "2px solid transparent",
                lineHeight: 1.45,
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {it.label}
            </a>
          );
        })}
      </nav>
    </details>
  );
}
