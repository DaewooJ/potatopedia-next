"use client";

import { useId, useState } from "react";
import { REPORT_ROLES } from "@/lib/leads";

// Email-gated PDF of an issue's magazine edition (14 Nov 2026). Reuses the country-report gate: POST /api/lead type
// report_download with report "issue/<title>/<date>" → lead saved in Neon (→ Pers via estate-sync) → a signed 7-day link
// is emailed (SES) → /api/report/<token> streams the PDF from the private Blob store. The newsletter is a separate,
// unticked choice that goes through the normal double opt-in (POST /api/newsletters/subscribe).
const RED = "#C62828";
const fld = { width: "100%", boxSizing: "border-box", padding: "11px 12px", fontSize: 15, fontFamily: "inherit", border: "1px solid var(--line2)", borderRadius: 10, background: "var(--card)", color: "var(--ink)", minWidth: 0 };
const lbl = { display: "block", fontSize: 13, fontWeight: 500, color: "var(--ink2)", marginBottom: 5 };

export default function MagazineGate({ magRef, title, pages, mb, newsletter, newsletterName, live }) {
  const uid = useId().replace(/:/g, "");
  const [state, setState] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const [sent, setSent] = useState({ to: "", ok: true, sub: false });

  async function submit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const d = Object.fromEntries(new FormData(f).entries());
    if (!String(d.name || "").trim()) { setError("Please give your name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(d.email || "").trim())) { setError("Please give a valid email."); return; }
    if (!f.elements.privacy_ok.checked) { setError("Please agree to the privacy policy to continue."); return; }
    const sub = f.elements.subscribe.checked;
    setError("");
    setState("sending");
    const common = { name: d.name.trim(), email: d.email.trim(), company: d.company || undefined, role: d.role || undefined, country: d.country || undefined, page_url: window.location.href.slice(0, 500), website_url: d.website_url || "" };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "report_download", report: magRef, privacy_ok: true, consent_partners: false, ...common }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ref) throw new Error(out.error || "Something went wrong. Please try again.");
      if (sub) {
        await fetch("/api/newsletters/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...common, titles: [newsletter], source: `${magRef}/pdf` }),
        }).catch(() => {});
      }
      try { window.gtag?.("event", "magazine_pdf_request", { magazine: title, newsletter_optin: sub ? "yes" : "no" }); } catch {}
      if (sub) try { window.gtag?.("event", "newsletter_signup", { newsletters: newsletter, signup_source: `${magRef}/pdf`, page_type: "issue" }); } catch {}
      setSent({ to: common.email, ok: out.sent !== false, sub });
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("idle");
    }
  }

  const box = { border: "1px solid var(--line)", borderRadius: 16, background: "var(--card)", padding: "20px 18px", boxShadow: "var(--shadow)" };

  if (!live) {
    return (
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15, color: "var(--mute)" }}>The PDF edition ({pages} pages) opens for download soon. Turn its pages above in the meantime.</p>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div role="status" style={box}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{sent.ok ? "Check your inbox." : "Saved, but the email did not go out."}</p>
        <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--mute)" }}>
          {sent.ok
            ? <>We sent the download link for the PDF to <b>{sent.to}</b>. It works for 7 days.{sent.sub ? ` A second email asks you to confirm ${newsletterName}; nothing is sent until you do.` : ""}</>
            : <>Please write to <a href="mailto:hi@potatopedia.com" style={{ color: "var(--gold)" }}>hi@potatopedia.com</a> and we will send the PDF.</>}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ ...box, display: "grid", gap: 12, position: "relative" }}>
      <p style={{ margin: 0, fontSize: 19, fontFamily: "var(--hp-serif), Georgia, serif", color: "var(--ink)" }}>Download the PDF ({pages} pages{mb ? `, ${mb} MB` : ""})</p>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--mute)" }}>Free. We email you the download link, so please use an address you can open now.</p>
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>Website <input name="website_url" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))" }}>
        <div><label style={lbl} htmlFor={`${uid}-n`}>Name</label><input id={`${uid}-n`} name="name" autoComplete="name" required style={fld} /></div>
        <div><label style={lbl} htmlFor={`${uid}-e`}>Email</label><input id={`${uid}-e`} name="email" type="email" autoComplete="email" required placeholder="you@company.com" style={fld} /></div>
        <div><label style={lbl} htmlFor={`${uid}-c`}>Company <span style={{ color: "var(--mute2)" }}>(optional)</span></label><input id={`${uid}-c`} name="company" autoComplete="organization" style={fld} /></div>
        <div>
          <label style={lbl} htmlFor={`${uid}-r`}>Role <span style={{ color: "var(--mute2)" }}>(optional)</span></label>
          <select id={`${uid}-r`} name="role" defaultValue="" style={fld}>
            <option value="">Choose…</option>
            {REPORT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink2)", lineHeight: 1.45, cursor: "pointer" }}>
        <input type="checkbox" name="subscribe" style={{ marginTop: 2, width: 17, height: 17, accentColor: RED, flex: "none" }} />
        <span>Also send me {newsletterName} by email (free; one email to confirm, one-click unsubscribe).</span>
      </label>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink2)", lineHeight: 1.45, cursor: "pointer" }}>
        <input type="checkbox" name="privacy_ok" required style={{ marginTop: 2, width: 17, height: 17, accentColor: RED, flex: "none" }} />
        <span>I agree to the <a href="/privacy" style={{ color: "var(--gold)" }}>privacy policy</a>.</span>
      </label>
      {error && <p role="alert" style={{ margin: 0, fontSize: 14, color: RED }}>{error}</p>}
      <div>
        <button type="submit" disabled={state === "sending"} style={{ padding: "12px 22px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", background: RED, color: "#fff", border: "none", borderRadius: 10, cursor: state === "sending" ? "wait" : "pointer", opacity: state === "sending" ? 0.7 : 1 }}>
          {state === "sending" ? "Sending…" : "Email me the PDF"}
        </button>
      </div>
    </form>
  );
}
