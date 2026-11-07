"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { REPORT_ROLES } from "@/lib/leads";

// Country report button. Ungated: opens the browser print dialog (save as PDF), as before.
// Gated (REPORT_GATE_LIVE): opens a form; the report link is emailed to verify the address.
// ?print=1 (arrives from the mailed link) opens the print dialog once.
const RED = "#C62828";
const fld = { width: "100%", boxSizing: "border-box", padding: "11px 12px", fontSize: 15, fontFamily: "inherit", border: "1px solid var(--line2)", borderRadius: 10, background: "var(--card)", color: "var(--ink)" };
const lbl = { display: "block", fontSize: 13, fontWeight: 500, color: "var(--ink2)", marginBottom: 5 };

export default function PdfDownloadButtonClient({ size = "md", placement = "banner", gated = false }) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [sentOk, setSentOk] = useState(true);
  const pathname = usePathname();
  const uid = useId();
  const dialogRef = useRef(null);

  const slug = (pathname || "").split("/").filter(Boolean)[1] || "";

  function print() {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      try { window.print(); } finally { setBusy(false); }
    }, 80);
  }

  useEffect(() => {
    if (placement !== "banner" || size !== "md") return;
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.get("print") === "1") {
        u.searchParams.delete("print");
        window.history.replaceState({}, "", u.pathname + u.search);
        setTimeout(() => window.print(), 600);
      }
    } catch {}
  }, [placement, size]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector("input")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const d = Object.fromEntries(new FormData(f).entries());
    for (const k of ["name", "email", "company", "role", "country"]) {
      if (!String(d[k] || "").trim()) { setError("Please fill every required field."); return; }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) { setError("Please give a valid email."); return; }
    if (!f.elements.privacy_ok.checked) { setError("Please agree to the privacy policy to continue."); return; }
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "report_download", name: d.name, email: d.email, company: d.company, country: d.country, role: d.role,
          report: slug, privacy_ok: true, consent_partners: f.elements.consent_partners.checked,
          website_url: d.website_url || "", page_url: window.location.href,
        }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Something went wrong.");
      setSentTo(d.email.trim());
      setSentOk(out.sent !== false);
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("idle");
    }
  }

  const isLarge = size === "lg";
  const base = { display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 10, cursor: busy ? "wait" : "pointer", fontWeight: 600, fontFamily: "inherit", transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease", whiteSpace: "nowrap" };
  const banner = { ...base, padding: isLarge ? "12px 22px" : "9px 16px", fontSize: isLarge ? 14 : 13, background: "var(--accent-bg)", color: "#FFFFFF", boxShadow: "0 1px 2px rgba(154,114,56,0.18), 0 4px 12px rgba(154,114,56,0.10)" };
  const footer = { ...base, padding: "16px 28px", fontSize: 15, background: "var(--card)", color: "var(--gold)", border: "1.5px solid rgba(154,114,56,0.25)" };

  return (
    <>
      <button
        type="button"
        onClick={gated ? () => { setState("idle"); setError(""); setOpen(true); } : print}
        disabled={busy}
        aria-label="Download country report as PDF"
        aria-haspopup={gated ? "dialog" : undefined}
        className="pp-pdf-button pp-no-print"
        style={placement === "footer" ? footer : banner}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.5v8.5M8 10l3-3M8 10l-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 11.5v1A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>{busy ? "Preparing PDF…" : "Download PDF Report"}</span>
      </button>

      {gated && open && (
        <div className="pp-no-print" onClick={(e) => e.target === e.currentTarget && setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, display: "grid", placeItems: "center", padding: 16, overflowY: "auto" }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${uid}-t`} style={{ background: "var(--card, #fff)", color: "var(--ink)", borderRadius: 14, padding: 22, width: "100%", maxWidth: 460, maxHeight: "92vh", overflowY: "auto", textAlign: "left", whiteSpace: "normal" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <h2 id={`${uid}-t`} style={{ margin: 0, fontSize: 21, fontWeight: 700 }}>Get the country report (PDF)</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" style={{ background: "none", border: "none", fontSize: 24, lineHeight: 1, cursor: "pointer", color: "var(--mute)" }}>×</button>
            </div>
            {state === "done" ? (
              <div role="status" style={{ marginTop: 14 }}>
                <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                  {sentOk ? `Check your inbox. The report link is on its way to ${sentTo}.` : "We saved your request but could not send the email just now. Please try again in a few minutes."}
                </p>
                <p style={{ fontSize: 13, color: "var(--mute)", margin: "8px 0 0" }}>The link works for 7 days. Check spam if you do not see it.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate style={{ display: "grid", gap: 12, marginTop: 14 }}>
                <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                  <label>Website <input name="website_url" tabIndex={-1} autoComplete="off" /></label>
                </div>
                <div><label style={lbl} htmlFor={`${uid}-n`}>Name *</label><input id={`${uid}-n`} name="name" required autoComplete="name" style={fld} /></div>
                <div><label style={lbl} htmlFor={`${uid}-e`}>Email *</label><input id={`${uid}-e`} name="email" type="email" required autoComplete="email" style={fld} /></div>
                <div><label style={lbl} htmlFor={`${uid}-c`}>Company *</label><input id={`${uid}-c`} name="company" required autoComplete="organization" style={fld} /></div>
                <div>
                  <label style={lbl} htmlFor={`${uid}-r`}>Your role *</label>
                  <select id={`${uid}-r`} name="role" required defaultValue="" style={fld}>
                    <option value="">Choose…</option>
                    {REPORT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div><label style={lbl} htmlFor={`${uid}-co`}>Country *</label><input id={`${uid}-co`} name="country" required autoComplete="country-name" style={fld} /></div>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.4 }}>
                  <input type="checkbox" name="consent_partners" style={{ marginTop: 3, width: 18, height: 18, flex: "none" }} />
                  <span>Potatopedia partners may contact me about relevant products (optional)</span>
                </label>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.4 }}>
                  <input type="checkbox" name="privacy_ok" required style={{ marginTop: 3, width: 18, height: 18, flex: "none" }} />
                  <span>I agree to the <a href="/privacy" target="_blank" rel="noopener" style={{ color: RED }}>privacy policy</a> *</span>
                </label>
                {error && <p role="alert" style={{ margin: 0, fontSize: 14, color: RED }}>{error}</p>}
                <button type="submit" disabled={state === "sending"} style={{ padding: "13px 22px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", background: RED, color: "#fff", border: "none", borderRadius: 10, cursor: state === "sending" ? "wait" : "pointer", opacity: state === "sending" ? 0.7 : 1 }}>
                  {state === "sending" ? "Sending…" : "Email me the report link"}
                </button>
                <p style={{ margin: 0, fontSize: 12.5, color: "var(--mute)" }}>We email the link to verify your address. We never sell your details.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
