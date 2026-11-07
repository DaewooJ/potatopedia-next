"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { KINDS, KIND_ORDER, SEGMENTS, MACHINE_SEGMENTS, flag } from "../lib/directory-labels";

// Client island for /companies: the full A–Z list is server-rendered (crawlable); filters only hide cards.
// Order is always alphabetical; featured status never changes position here.
export default function CompaniesFilter({ companies }) {
  const [kind, setKind] = useState("all");
  const [country, setCountry] = useState("");
  const [machine, setMachine] = useState("");
  const [q, setQ] = useState("");

  // Deep link: /companies?type=seed (used by "Who sells the seed" on /varieties) opens that tab.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type");
    if (t && KINDS[t]) setKind(t);
  }, []);

  const countries = useMemo(() => [...new Set(companies.map((c) => c.country).filter(Boolean))].sort(), [companies]);
  const machineSegs = useMemo(() => {
    const used = new Set(companies.filter((c) => c.kind === "machinery").flatMap((c) => c.segments));
    return MACHINE_SEGMENTS.filter((s) => used.has(s));
  }, [companies]);
  const counts = useMemo(() => Object.fromEntries(KIND_ORDER.map((k) => [k, companies.filter((c) => c.kind === k).length])), [companies]);

  const needle = q.trim().toLowerCase();
  const shown = companies.filter(
    (c) =>
      (kind === "all" || c.kind === kind) &&
      (!country || c.country === country) &&
      (!machine || (c.kind === "machinery" && c.segments.includes(machine))) &&
      (!needle || `${c.name} ${c.country} ${c.city} ${c.summary} ${c.segments.map((s) => SEGMENTS[s]).join(" ")}`.toLowerCase().includes(needle)),
  );
  const showMachine = kind === "all" || kind === "machinery";
  const reset = () => { setKind("all"); setCountry(""); setMachine(""); setQ(""); };

  return (
    <section className="ix-sec" aria-labelledby="co-list-h" style={{ paddingTop: 8 }}>
      <h2 id="co-list-h" className="pp-sr">All companies, A to Z</h2>
      <div className="co-bar">
        <div className="co-tabs" role="group" aria-label="Company type">
          <button type="button" aria-pressed={kind === "all"} onClick={() => setKind("all")}>All <span>{companies.length}</span></button>
          {KIND_ORDER.map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => { setKind(k); if (k !== "machinery") setMachine(""); }}>
              {KINDS[k].plural} <span>{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="co-tools">
          <label className="pp-sr" htmlFor="co-q">Search companies</label>
          <input id="co-q" className="co-in co-q" type="search" placeholder="Search by name, product or country" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
          <label className="pp-sr" htmlFor="co-country">Country</label>
          <select id="co-country" className="co-in" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {showMachine && (
            <>
              <label className="pp-sr" htmlFor="co-machine">Machine type</label>
              <select id="co-machine" className="co-in" value={machine} onChange={(e) => { setMachine(e.target.value); if (e.target.value) setKind("machinery"); }}>
                <option value="">All machine types</option>
                {machineSegs.map((s) => <option key={s} value={s}>{SEGMENTS[s]}</option>)}
              </select>
            </>
          )}
        </div>
      </div>

      <p className="co-count" aria-live="polite">
        {shown.length === companies.length ? `${companies.length} companies, A to Z` : `${shown.length} of ${companies.length} companies`}
      </p>

      {shown.length ? (
        <ul className="co-grid">
          {shown.map((c) => (
            <li key={c.slug}>
              <Link href={`/companies/${c.slug}`} className="card co-card">
                <span className="card-k">{KINDS[c.kind]?.label}</span>
                <span className="card-t">{c.name}</span>
                <span className="co-where"><span aria-hidden="true">{flag(c.country)}</span> {c.city ? `${c.city}, ` : ""}{c.country}</span>
                <span className="card-s">{c.summary}</span>
                {c.segments.length > 0 && (
                  <span className="co-chips">
                    {c.segments.slice(0, 4).map((s) => <span key={s} className="co-chip">{SEGMENTS[s]}</span>)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="co-empty">
          <p>No company matches these filters yet.</p>
          <button type="button" className="btn-line" onClick={reset}>Clear filters</button>
        </div>
      )}
    </section>
  );
}
