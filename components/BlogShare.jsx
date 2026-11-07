"use client";

import { useState, useEffect } from "react";

// Quiet share chips for the editorial template: LinkedIn, X, email, copy link.
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
    } catch {
      // ignore
    }
  };

  return (
    <div className="ed-share" aria-label="Share this story">
      <a href={liUrl} target="_blank" rel="noopener noreferrer" className="ed-chip" aria-label="Share on LinkedIn">LinkedIn</a>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" className="ed-chip" aria-label="Share on X">X</a>
      <a href={mailUrl} className="ed-chip" aria-label="Share via email">Email</a>
      <button type="button" onClick={copy} className="ed-chip" aria-label="Copy link">{copied ? "Copied" : "Copy link"}</button>
    </div>
  );
}
