"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Content Request CTA
 *
 * A subtle, premium prompt asking users what content they couldn't find.
 * Submission opens the user's email client with a pre-filled message
 * (mailto: approach — zero infrastructure, fully functional, swappable
 * to Web3Forms / Formspree later by replacing the handleSubmit body).
 *
 * Spam protection: honeypot field + minimum-time-on-page check + button rate-limit.
 */
export default function ContentRequestCTA({
  variant = "default", // "default" | "compact"
  pageContext = "",    // free-text label of where the CTA sits ("Knowledge Hub index" etc)
}) {
  const [topic, setTopic] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const honeypotRef = useRef(null);
  const mountedAt = useRef(Date.now());

  // Track current page URL on the client (so the email tells us *which* page generated the request)
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setPageUrl(window.location.href);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (busy || submitted) return;

    // Spam check 1: honeypot — bots fill hidden fields, humans don't
    if (honeypotRef.current && honeypotRef.current.value) return;

    // Spam check 2: time on page — humans take >2s to type
    if (Date.now() - mountedAt.current < 2000) {
      setError("Please take a moment to write your request.");
      return;
    }

    // Validation
    if (!topic.trim() || topic.trim().length < 8) {
      setError("Please describe the topic in at least a sentence.");
      return;
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("That email doesn't look right.");
      return;
    }

    setBusy(true);
    setError("");

    // Build the email
    const recipient = "hello@potatopedia.com";
    const truncatedTopic = topic.trim().slice(0, 50).replace(/\s+/g, " ");
    const subject = `[Potatopedia] Content Request: ${truncatedTopic}`;
    const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "unknown";
    const ts = new Date().toISOString();

    const body = [
      "Topic / question requested:",
      topic.trim(),
      "",
      "—",
      `Submitted from: ${pageUrl || "(unknown)"}`,
      pageContext ? `Context: ${pageContext}` : null,
      `User email: ${email.trim() || "(not provided)"}`,
      `Timestamp: ${ts}`,
      `User-Agent: ${ua}`,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // Open the user's mail client. We do this via location to avoid popup-blockers.
    try {
      window.location.href = mailto;
    } catch (err) {
      // ignore — we still show the thank-you state
    }

    // Always show success — we have to trust the user's mail client
    setBusy(false);
    setSubmitted(true);
  }

  const isCompact = variant === "compact";

  // Submitted (thank-you) state
  if (submitted) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(198,40,40,0.18)",
          borderRadius: 14,
          padding: isCompact ? "20px 22px" : "28px 32px",
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(76,175,80,0.08)",
            color: "#2E7D32",
            border: "1px solid rgba(76,175,80,0.2)",
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            marginBottom: 14,
          }}
        >
          <span aria-hidden="true">✓</span>
          <span>Request received</span>
        </div>
        <h3 style={{ fontSize: isCompact ? 18 : 22, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" }}>
          Thanks — we&apos;ve logged your request.
        </h3>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: 0, maxWidth: 480, marginInline: "auto" }}>
          We prioritize new content based on user demand. If you provided your email, we&apos;ll let you know when this topic is published.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "linear-gradient(180deg,#FFFFFF 0%,#FFF8F8 100%)",
        border: "1px solid rgba(198,40,40,0.14)",
        borderRadius: 16,
        padding: isCompact ? "24px 22px" : "36px 36px",
        maxWidth: 720,
        margin: "0 auto",
        boxShadow: "0 1px 3px rgba(198,40,40,0.04), 0 8px 24px rgba(0,0,0,0.03)",
      }}
      autoComplete="off"
      noValidate
    >
      <div style={{ textAlign: "center", marginBottom: isCompact ? 16 : 22 }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 10,
            fontWeight: 700,
            color: "#C62828",
            textTransform: "uppercase",
            letterSpacing: 2,
            background: "rgba(198,40,40,0.06)",
            padding: "4px 12px",
            borderRadius: 20,
            marginBottom: 14,
          }}
        >
          Help us build
        </div>
        <h3
          style={{
            fontSize: isCompact ? 20 : 26,
            fontWeight: 800,
            color: "#1A1A1A",
            letterSpacing: -0.6,
            lineHeight: 1.2,
            margin: "0 0 8px",
          }}
        >
          Can&apos;t find what you&apos;re looking for?
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "#666",
            lineHeight: 1.6,
            margin: "0 auto",
            maxWidth: 460,
          }}
        >
          Tell us what you&apos;d like to see &mdash; we prioritize new content based on user demand.
        </p>
      </div>

      {/* Honeypot — hidden from real users */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "-9999px", height: 0, width: 0, overflow: "hidden" }}
      >
        <label htmlFor="website_url">Website (do not fill)</label>
        <input
          ref={honeypotRef}
          type="text"
          name="website_url"
          id="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Topic textarea */}
      <label htmlFor="content-request-topic" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 6 }}>
        What would you like us to cover?
      </label>
      <textarea
        id="content-request-topic"
        name="topic"
        rows={isCompact ? 2 : 3}
        value={topic}
        onChange={(e) => { setTopic(e.target.value); setError(""); }}
        placeholder="e.g. Potato production by Indian state, or seed certification process in Kenya"
        required
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 14,
          fontFamily: "inherit",
          border: "1px solid #E5E5E5",
          borderRadius: 10,
          outline: "none",
          background: "#fff",
          color: "#1A1A1A",
          lineHeight: 1.5,
          resize: "vertical",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#C62828"; e.target.style.boxShadow = "0 0 0 3px rgba(198,40,40,0.08)"; }}
        onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; e.target.style.boxShadow = "none"; }}
      />

      {/* Email (optional) */}
      <label htmlFor="content-request-email" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginTop: 14, marginBottom: 6 }}>
        Email <span style={{ fontWeight: 400, color: "#999" }}>(optional &mdash; we&apos;ll notify you when published)</span>
      </label>
      <input
        id="content-request-email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        placeholder="you@example.com"
        autoComplete="email"
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 14,
          fontFamily: "inherit",
          border: "1px solid #E5E5E5",
          borderRadius: 10,
          outline: "none",
          background: "#fff",
          color: "#1A1A1A",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#C62828"; e.target.style.boxShadow = "0 0 0 3px rgba(198,40,40,0.08)"; }}
        onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; e.target.style.boxShadow = "none"; }}
      />

      {error && (
        <div role="alert" style={{ marginTop: 12, fontSize: 13, color: "#C62828", fontWeight: 500 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <button
          type="submit"
          disabled={busy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            background: "linear-gradient(135deg,#C62828,#E53935)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: busy ? "wait" : "pointer",
            boxShadow: "0 1px 2px rgba(198,40,40,0.18), 0 4px 12px rgba(198,40,40,0.10)",
            transition: "transform 0.12s ease, box-shadow 0.12s ease, opacity 0.15s",
            opacity: busy ? 0.8 : 1,
          }}
        >
          {busy ? "Sending…" : "Send Request →"}
        </button>
      </div>

      <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 14, marginBottom: 0, lineHeight: 1.5 }}>
        Submission opens your email app with the message pre-filled. We read every request.
      </p>
    </form>
  );
}
