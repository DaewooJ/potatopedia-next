"use client";

import { useState, useEffect } from "react";

function ShareIcon({ icon }) {
  const icons = {
    x: (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
    linkedin: (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>),
    email: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
    copy: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>),
  };
  return icons[icon] || null;
}

export default function BlogShare({ url, title }) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState(url || "");

  useEffect(() => {
    if (typeof window !== "undefined" && !url) setPageUrl(window.location.href);
  }, [url]);

  const enc = (s) => encodeURIComponent(s);
  const xUrl = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(pageUrl)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(pageUrl)}`;
  const mailUrl = `mailto:?subject=${enc(title)}&body=${enc(pageUrl)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // ignore
    }
  };

  const btn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    borderRadius: 8,
    border: "1px solid #ececec",
    background: "#fff",
    color: "#666",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1.5 }}>Share</span>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" style={btn} aria-label="Share on X">
        <ShareIcon icon="x" /> X
      </a>
      <a href={liUrl} target="_blank" rel="noopener noreferrer" style={btn} aria-label="Share on LinkedIn">
        <ShareIcon icon="linkedin" /> LinkedIn
      </a>
      <a href={mailUrl} style={btn} aria-label="Share via email">
        <ShareIcon icon="email" /> Email
      </a>
      <button onClick={copy} style={btn} aria-label="Copy link">
        <ShareIcon icon="copy" /> {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
