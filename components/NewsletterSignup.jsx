"use client";

import { useEffect, useId, useState } from "react";
import { NEWSLETTERS, JOB_ROLES } from "@/lib/newsletters";

// One signup box for the three Potatopedia newsletters (13 Nov 2026). Posts to POST /api/newsletters/subscribe with
// {email, name, company, role, country, titles, page_url, utm_*}; that route sends ONE double opt-in mail.
// Processing is ticked by default; a page can pass `defaults` (e.g. the seed hub ticks Seed Potato & Field), and
// /newsletters?title=<slug> pre-ticks that title. `compact` shows email + titles, with the profile fields folded.
const RED = "#C62828";

const field = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "inherit",
  border: "1px solid var(--line2)",
  borderRadius: 10,
  background: "var(--card)",
  color: "var(--ink)",
  minWidth: 0,
};
const label = { display: "block", fontSize: 13, fontWeight: 500, color: "var(--ink2)", marginBottom: 6 };

export default function NewsletterSignup({
  defaults = ["potato-processing-weekly"],
  compact = false,
  title = "Get the newsletters",
  intro = "Free. One email to confirm, then only the titles you tick. Unsubscribe in one click.",
  id = "signup",
  readQuery = false,
  source = "", // where the box sits, e.g. "answers/<slug>" (stored as leads.details.source; GA4 signup_source)
  single = false, // inline box: one matched title + email on one row; the other titles fold away
}) {
  const uid = useId().replace(/:/g, "");
  const [titles, setTitles] = useState(defaults);
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  useEffect(() => {
    if (!readQuery) return;
    try {
      const t = new URLSearchParams(window.location.search).get("title");
      if (t && NEWSLETTERS.some((n) => n.slug === t)) setTitles((cur) => (cur.includes(t) ? cur : [...cur, t]));
    } catch {}
  }, [readQuery]);

  const toggle = (slug) => setTitles((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));

  async function onSubmit(e) {
    e.preventDefault();
    if (!titles.length) {
      setError("Tick at least one newsletter.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    const body = {
      email: String(fd.email || "").trim(),
      name: String(fd.name || "").trim() || undefined,
      company: String(fd.company || "").trim() || undefined,
      role: String(fd.role || "").trim() || undefined,
      country: String(fd.country || "").trim() || undefined,
      titles,
      page_url: window.location.href.slice(0, 500),
      source: source || undefined,
      website_url: fd.website_url || undefined, // honeypot
    };
    try {
      const params = new URLSearchParams(window.location.search);
      for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) if (params.get(k)) body[k] = params.get(k);
    } catch {}
    try {
      const res = await fetch("/api/newsletters/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.ok === false) throw new Error(out.error || "Something went wrong. Please try again.");
      setState("done");
      try {
        window.gtag?.("event", "newsletter_signup", { newsletters: titles.join(","), signup_source: source || window.location.pathname, page_type: (source || "").split("/")[0] || "other" });
      } catch {}
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  }

  const box = {
    border: "1px solid var(--line)",
    borderRadius: 16,
    background: "var(--card)",
    padding: compact ? "18px 16px" : "24px 20px",
    boxShadow: "var(--shadow)",
  };

  if (state === "done") {
    const names = NEWSLETTERS.filter((n) => titles.includes(n.slug)).map((n) => n.name);
    return (
      <div id={id} role="status" style={{ ...box, scrollMarginTop: 96 }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>Check your inbox to confirm.</p>
        <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--mute)" }}>
          We sent one email. One click in it confirms {names.join(", ").replace(/, ([^,]*)$/, " and $1")}. Nothing is sent until you confirm.
        </p>
      </div>
    );
  }

  const profile = (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))" }}>
      <div>
        <label style={label} htmlFor={`${uid}-name`}>Name</label>
        <input id={`${uid}-name`} name="name" autoComplete="name" style={field} />
      </div>
      <div>
        <label style={label} htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" autoComplete="organization" style={field} />
      </div>
      <div>
        <label style={label} htmlFor={`${uid}-role`}>Job role</label>
        <select id={`${uid}-role`} name="role" defaultValue="" style={field}>
          <option value="">Choose…</option>
          {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label style={label} htmlFor={`${uid}-country`}>Country</label>
        <input id={`${uid}-country`} name="country" autoComplete="country-name" style={field} />
      </div>
    </div>
  );

  if (single) {
    const main = NEWSLETTERS.find((n) => n.slug === defaults[0]) || NEWSLETTERS[0];
    const others = NEWSLETTERS.filter((n) => n.slug !== main.slug);
    return (
      <form id={id} onSubmit={onSubmit} noValidate style={{ ...box, borderLeft: `4px solid ${main.accent}`, display: "grid", gap: 10, scrollMarginTop: 96, position: "relative", padding: "18px 18px 16px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: main.accent }}>{main.name} · {main.cadenceLabel}</p>
        {title && <p style={{ margin: 0, fontSize: 20, lineHeight: 1.25, fontFamily: "var(--hp-serif), Georgia, serif", color: "var(--ink)" }}>{title}</p>}
        {intro && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--mute)" }}>{intro}</p>}
        <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
          <label>Website <input name="website_url" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <label htmlFor={`${uid}-email`} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Email</label>
          <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" placeholder="you@company.com" style={{ ...field, flex: "1 1 220px", width: "auto" }} />
          <button type="submit" disabled={state === "sending"} style={{ flex: "0 0 auto", padding: "12px 20px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", background: RED, color: "#fff", border: "none", borderRadius: 10, cursor: state === "sending" ? "wait" : "pointer", opacity: state === "sending" ? 0.7 : 1 }}>
            {state === "sending" ? "Sending…" : "Subscribe free"}
          </button>
        </div>
        <details>
          <summary style={{ cursor: "pointer", fontSize: 13, color: "var(--mute)" }}>Also get our other newsletters</summary>
          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
            {others.map((n) => (
              <label key={n.slug} htmlFor={`${uid}-${n.slug}`} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--ink2)", cursor: "pointer" }}>
                <input id={`${uid}-${n.slug}`} type="checkbox" checked={titles.includes(n.slug)} onChange={() => toggle(n.slug)} style={{ width: 17, height: 17, accentColor: n.accent, flex: "none" }} />
                <span><b style={{ fontWeight: 600 }}>{n.name}</b> · {n.cadenceLabel}</span>
              </label>
            ))}
          </div>
        </details>
        {error && <p role="alert" style={{ margin: 0, fontSize: 14, color: RED }}>{error}</p>}
        <p style={{ margin: 0, fontSize: 12, color: "var(--mute2)", lineHeight: 1.45 }}>
          Free. One email to confirm; one-click unsubscribe. <a href="/privacy" style={{ color: "var(--gold)" }}>Privacy policy</a>.
        </p>
      </form>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} noValidate style={{ ...box, display: "grid", gap: 14, scrollMarginTop: 96, position: "relative" }}>
      {title && <h2 style={{ margin: 0, fontSize: compact ? 21 : 26, lineHeight: 1.2, fontFamily: "var(--hp-serif), Georgia, serif", fontWeight: 400, color: "var(--ink)" }}>{title}</h2>}
      {intro && <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--mute)" }}>{intro}</p>}

      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>Website <input name="website_url" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset style={{ border: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
        <legend style={{ ...label, marginBottom: 8 }}>Newsletters</legend>
        {NEWSLETTERS.map((n) => {
          const on = titles.includes(n.slug);
          return (
            <label key={n.slug} htmlFor={`${uid}-${n.slug}`} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 12px", border: `1px solid ${on ? n.accent : "var(--line)"}`, borderLeft: `4px solid ${n.accent}`, borderRadius: 10, cursor: "pointer", background: on ? "var(--gold-soft)" : "transparent" }}>
              <input id={`${uid}-${n.slug}`} type="checkbox" checked={on} onChange={() => toggle(n.slug)} style={{ marginTop: 3, width: 18, height: 18, accentColor: n.accent, flex: "none" }} />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{n.name}</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--mute)", lineHeight: 1.45 }}>{n.cadenceLabel}{compact ? "" : ` · ${n.reader}`}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <div>
        <label style={label} htmlFor={`${uid}-email`}>Email</label>
        <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" placeholder="you@company.com" style={field} />
      </div>

      {compact ? (
        <details>
          <summary style={{ cursor: "pointer", fontSize: 13.5, color: "var(--mute)", marginBottom: 10 }}>Add your name, company, role and country (optional)</summary>
          {profile}
        </details>
      ) : profile}

      {error && <p role="alert" style={{ margin: 0, fontSize: 14, color: RED }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <button type="submit" disabled={state === "sending"} style={{ padding: "13px 22px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", background: RED, color: "#fff", border: "none", borderRadius: 10, cursor: state === "sending" ? "wait" : "pointer", opacity: state === "sending" ? 0.7 : 1 }}>
          {state === "sending" ? "Sending…" : "Subscribe"}
        </button>
        <span style={{ fontSize: 12.5, color: "var(--mute2)", lineHeight: 1.45 }}>
          See our <a href="/privacy" style={{ color: "var(--gold)" }}>privacy policy</a>.
        </span>
      </div>
    </form>
  );
}
