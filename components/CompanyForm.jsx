"use client";

import { useEffect, useState } from "react";
import { REPLY_PROMISE } from "@/lib/leads";

// Small form for the /for-companies hub. fields: [{ name, label, type?: text|email|url|select|textarea|checkbox,
// options?, required?, prefillParam? }]. Posts to /api/lead with `type`. `prefillParam` fills from ?<param>= (client-side).
export default function CompanyForm({ type, fields, submitLabel = "Send" }) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [ref, setRef] = useState("");
  const [pre, setPre] = useState({});

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const o = {};
    for (const f of fields) if (f.prefillParam && q.get(f.prefillParam)) o[f.name] = q.get(f.prefillParam).slice(0, 500);
    setPre(o);
  }, [fields]);

  async function onSubmit(e) {
    e.preventDefault();
    setState("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    for (const f of fields) if (f.type === "checkbox") data[f.name] = fd.get(f.name) === "on";
    data.type = type;
    if (!data.page_url) data.page_url = window.location.href;
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
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
      <div role="status" className="fc-done">
        <strong>Thank you, we have it.</strong>
        <span>{REPLY_PROMISE} Your reference: {ref}</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="fc-form" noValidate>
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>Website <input name="website_url" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="fc-grid">
        {fields.map((f) => {
          const id = `${type}-${f.name}`;
          if (f.type === "hidden") return pre[f.name] ? <input key={f.name} type="hidden" name={f.name} value={pre[f.name]} /> : null;
          if (f.type === "checkbox") {
            return (
              <label key={f.name} className="fc-check fc-wide" htmlFor={id}>
                <input id={id} name={f.name} type="checkbox" required={f.required} /> <span>{f.label}</span>
              </label>
            );
          }
          return (
            <div key={f.name} className={f.type === "textarea" || f.wide ? "fc-wide" : undefined}>
              <label className="fc-l" htmlFor={id}>{f.label}{f.required ? "" : " (optional)"}</label>
              {f.type === "select" ? (
                <select id={id} name={f.name} required={f.required} defaultValue="" className="fc-i">
                  <option value="" disabled>Choose…</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea id={id} name={f.name} rows={3} required={f.required} className="fc-i" defaultValue={pre[f.name] || ""} key={pre[f.name] || "t"} />
              ) : (
                <input id={id} name={f.name} type={f.type || "text"} required={f.required} autoComplete={f.autoComplete} placeholder={f.placeholder} className="fc-i" defaultValue={pre[f.name] || ""} key={pre[f.name] || "i"} />
              )}
            </div>
          );
        })}
      </div>
      {error && <p role="alert" className="fc-err">{error}</p>}
      <div className="fc-foot">
        <button type="submit" disabled={state === "sending"} className="fc-btn">{state === "sending" ? "Sending…" : submitLabel}</button>
        <span>{REPLY_PROMISE}</span>
      </div>
    </form>
  );
}
