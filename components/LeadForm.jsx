"use client";

import { useState } from "react";
import { REPLY_PROMISE } from "@/lib/leads";

// One reusable lead form. `type` is a key of LEAD_TYPES; `extra` adds type-specific fields:
// [{ name: "capacity_tph", label: "Capacity (t/h)", options?: [...] }]. Posts to /api/lead.
const RED = "#C62828";

const field = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "inherit",
  border: "1px solid #D9D9D9",
  borderRadius: 10,
  background: "#fff",
  color: "#1a1a1a",
};
const label = { display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 };

export default function LeadForm({
  type,
  title,
  intro,
  extra = [],
  submitLabel = "Send",
  askName = true,
  askCompany = true,
  askCountry = true,
  askMessage = true,
  messageLabel = "What do you need?",
  compact = false,
}) {
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");
  const [ref, setRef] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setState("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const params = new URLSearchParams(window.location.search);
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      if (params.get(k)) data[k] = params.get(k);
    }
    data.type = type;
    data.page_url = window.location.href;
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Something went wrong.");
      setRef(out.ref);
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" style={{ padding: compact ? 16 : 24, border: "1px solid #EEE", borderRadius: 14, background: "#FAFAFA" }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
          {type === "newsletter" ? "Check your inbox to confirm your signup." : "Thank you, we have your request."}
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#555" }}>
          {type === "newsletter" ? "One click in that mail and you're in." : `${REPLY_PROMISE} Your reference: ${ref}`}
        </p>
      </div>
    );
  }

  const grid = { display: "grid", gap: 14, gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))" };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }} noValidate>
      {title && <h3 style={{ margin: 0, fontSize: compact ? 18 : 22, fontWeight: 700, color: "#1a1a1a" }}>{title}</h3>}
      {intro && <p style={{ margin: 0, fontSize: 15, color: "#555", lineHeight: 1.5 }}>{intro}</p>}

      {/* honeypot */}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div style={grid}>
        {askName && (
          <div>
            <label style={label} htmlFor={`${type}-name`}>Name</label>
            <input id={`${type}-name`} name="name" required autoComplete="name" style={field} />
          </div>
        )}
        {askCompany && (
          <div>
            <label style={label} htmlFor={`${type}-company`}>Company</label>
            <input id={`${type}-company`} name="company" autoComplete="organization" style={field} />
          </div>
        )}
        <div>
          <label style={label} htmlFor={`${type}-email`}>{type === "newsletter" ? "Email" : "Work email"}</label>
          <input id={`${type}-email`} name="email" type="email" required autoComplete="email" style={field} />
        </div>
        {askCountry && (
          <div>
            <label style={label} htmlFor={`${type}-country`}>Country</label>
            <input id={`${type}-country`} name="country" autoComplete="country-name" style={field} />
          </div>
        )}
        {extra.map((f) => (
          <div key={f.name}>
            <label style={label} htmlFor={`${type}-${f.name}`}>{f.label}</label>
            {f.options ? (
              <select id={`${type}-${f.name}`} name={f.name} defaultValue={f.defaultValue || ""} style={field}>
                <option value="">Choose…</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input id={`${type}-${f.name}`} name={f.name} defaultValue={f.defaultValue} placeholder={f.placeholder} style={field} />
            )}
          </div>
        ))}
      </div>

      {askMessage && (
        <div>
          <label style={label} htmlFor={`${type}-message`}>{messageLabel}</label>
          <textarea id={`${type}-message`} name="message" rows={compact ? 3 : 4} style={{ ...field, resize: "vertical" }} />
        </div>
      )}

      {error && (
        <p role="alert" style={{ margin: 0, fontSize: 14, color: RED }}>{error}</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <button
          type="submit"
          disabled={state === "sending"}
          style={{
            padding: "13px 22px",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "inherit",
            color: "#fff",
            background: RED,
            border: "none",
            borderRadius: 10,
            cursor: state === "sending" ? "wait" : "pointer",
            opacity: state === "sending" ? 0.7 : 1,
          }}
        >
          {state === "sending" ? "Sending…" : submitLabel}
        </button>
        {type !== "newsletter" && <span style={{ fontSize: 13, color: "#666" }}>{REPLY_PROMISE}</span>}
      </div>
    </form>
  );
}
