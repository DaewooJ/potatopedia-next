"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { VA_CSS } from "../lib/varieties-atlas-css";

// /varieties: "A · Atlas" (search, use chips, facet rail, card grid, compare tray) with "B · Finder" as a tool on the
// same page (#finder). Receives only slim card data from lib/varieties-atlas.js; the first 24 cards are server-rendered.
// Every fact shown comes from lib/variety-traits.json with its publisher named; nothing here invents a figure.

const PAGE = 24;
const MAX_COMPARE = 4;
const NEUTRAL_SKIN = "#D9CDB7";
const NEUTRAL_FLESH = "#EFE6D3";

const USE_LABEL = { all: "all", fries: "fries", chips: "chips", table: "table", starch: "starch", native: "native", export: "seed export" };
const RZ_LABEL = { lb: "late blight", ro: "PCN Ro", pa: "PCN Pa2/3", pvy: "PVY" };
const SORTS = [
  ["default", "Datasheet facts first"],
  ["newest", "Newest"],
  ["dm", "Dry matter"],
  ["az", "A–Z"],
];

const FINDER_USES = [
  { k: "fries", l: "Fries", hint: "Fry-processing varieties and their published frying quality" },
  { k: "chips", l: "Chips", hint: "Chipping varieties, crisping quality and solids where published" },
  { k: "table", l: "Table", hint: "Fresh market and kitchen use, with the cooking type" },
  { k: "starch", l: "Starch", hint: "Industrial starch varieties in the register" },
  { k: "export", l: "Seed export", hint: "Varieties from seed houses listed as seed exporters in our directory" },
];
const RISKS = [
  { k: "lb", l: "Late blight" },
  { k: "pcn", l: "Potato cyst nematode" },
  { k: "pvy", l: "PVY" },
  { k: "heat", l: "Heat / short season" },
];

const fold = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function Tuber({ c, size = "lg" }) {
  return (
    <span className={`va-ph va-ph-${size}`} aria-hidden="true">
      <span className="va-tuber" style={{ background: c.sk || NEUTRAL_SKIN }} />
      <span className="va-slice" style={{ background: c.fl || NEUTRAL_FLESH }} />
    </span>
  );
}

function Card({ c, picked, onPick }) {
  const by = [c.b, c.c].filter(Boolean).join(" · ");
  return (
    <article className="va-card">
      <div className="va-photo">
        <Tuber c={c} />
        <span className="va-cap">Photo coming from the breeder</span>
      </div>
      <div className="va-cb">
        <div className="va-nr">
          <h3 className="va-name"><Link href={`/varieties/${c.s}`}>{c.n}</Link></h3>
          {c.y && <span className="va-year">{c.y}</span>}
        </div>
        {by && <p className="va-by">{by}</p>}
        <div className="va-tags">
          {(c.u || []).slice(0, 2).map((u) => <span key={u}>{u}</span>)}
          {c.m && <span>{c.m}</span>}
        </div>
        <p className={c.f ? "va-fact" : "va-fact va-fact-none"}>{c.f || `${c.r} · datasheet facts not yet in our register`}</p>
        <div className="va-foot">
          <label className="va-cmp">
            <input type="checkbox" checked={picked} onChange={() => onPick(c.s)} /> Compare
          </label>
          <Link href={`/varieties/${c.s}`} className="va-more">Datasheet &amp; seed <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}

function FeaturedSlot() {
  return (
    <Link href="/advertise" className="va-feat">
      <span className="va-feat-k">Featured breeder · available</span>
      <span className="va-feat-t">Show your variety set to growers and processors, clearly labelled.</span>
      <span className="va-feat-s">A labelled slot in your segment. The facts on every variety page stay as the datasheet publishes them.</span>
      <span className="va-feat-a">See placements <span aria-hidden="true">→</span></span>
    </Link>
  );
}

function AlertsBox({ id, segment }) {
  const [email, setEmail] = useState("");
  const [seg, setSeg] = useState("");
  const [state, setState] = useState({ s: "idle", msg: "" });
  const submit = async (e) => {
    e.preventDefault();
    setState({ s: "sending", msg: "" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          email,
          segment: seg || segment || "all",
          page_url: typeof window !== "undefined" ? window.location.href : "/varieties",
          website_url: e.target.website_url?.value || "",
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Could not save. Please try again.");
      setState({ s: "ok", msg: "Almost done: please confirm from the email we just sent." });
    } catch (err) {
      setState({ s: "err", msg: err.message });
    }
  };
  return (
    <form className="va-alerts" onSubmit={submit}>
      <p className="va-alerts-t">New variety alerts</p>
      <p className="va-alerts-s">One email when we add a newly registered variety in your segment. No other mail.</p>
      {state.s === "ok" ? (
        <p className="va-alerts-ok" role="status">{state.msg}</p>
      ) : (
        <>
          <label htmlFor={`${id}-seg`}>Segment</label>
          <select id={`${id}-seg`} value={seg || segment || "all"} onChange={(e) => setSeg(e.target.value)}>
            <option value="all">All segments</option>
            <option value="fries">Fries</option>
            <option value="chips">Chips</option>
            <option value="table">Table</option>
            <option value="starch">Starch</option>
            <option value="native">Native</option>
            <option value="seed">Seed</option>
          </select>
          <label htmlFor={`${id}-mail`}>Work email</label>
          <input id={`${id}-mail`} type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="pp-sr" aria-hidden="true" />
          <button type="submit" disabled={state.s === "sending"}>{state.s === "sending" ? "Saving…" : "Get alerts"}</button>
          {state.s === "err" && <p className="va-alerts-err" role="alert">{state.msg}</p>}
        </>
      )}
    </form>
  );
}

// ── Finder ranking: only published ratings; unknown stays unknown ──
function rankFinder(cards, finder, use, region, risks) {
  const pool = cards.filter((c) => (c.g || []).includes(use));
  const out = pool.map((c) => {
    const fd = finder[c.s];
    const why = [];
    let score = 0;
    const regionOk = !region || c.r === region;
    if (region && regionOk) { score += 2; why.push(`Region of origin: ${c.r}`); }
    if (!fd) {
      why.push(`Listed for ${USE_LABEL[use]} in the Potatopedia register`);
      if (!region) why.push(`Region of origin: ${c.r}`);
      return { c, score: score - 5, fit: "Not yet rated", why, tone: "mute" };
    }
    score += 1;
    // use-quality bullets, as published
    const want = use === "fries" ? ["fries", "dm"] : use === "chips" ? ["chips", "dm"] : use === "table" ? ["table"] : use === "starch" ? ["starch", "dm"] : ["dm"];
    for (const k of want) { const q = (fd.q || []).find((x) => x.k === k); if (q) why.push(q.text); }
    if (use === "fries" && fd.fq >= 7) score += 1;
    if (use === "chips" && fd.cq >= 7) score += 1;
    if (use === "export" && fd.ex) why.unshift(`Seed house ${fd.ex} is listed as a seed exporter in our company directory`);
    const bad = [], unknown = [];
    let allTop = true;
    for (const r of risks) {
      const rt = fd[r];
      const label = RISKS.find((x) => x.k === r).l;
      if (!rt || rt[0] == null) { unknown.push(label); allTop = false; if (rt) why.push(rt[1]); continue; }
      score += rt[0] * 1.5;
      if (rt[0] === 0) bad.push(label);
      if (rt[0] < 2) allTop = false;
      why.unshift(rt[1]);
    }
    let fit, tone;
    if (bad.length) { fit = `Check ${bad[0].toLowerCase()}`; tone = "warn"; score -= 1; }
    else if (unknown.length) { fit = `Not rated for ${unknown[0].toLowerCase()}`; tone = "mute"; }
    else if (!regionOk) { fit = "Other region"; tone = "mute"; }
    else if (risks.length && allTop) { fit = "Strong fit"; tone = "ok"; }
    else { fit = "Good fit"; tone = "ok"; }
    return { c, score, fit, why: [...new Set(why)].slice(0, 4), tone };
  });
  out.sort((a, b) => b.score - a.score || a.c.n.localeCompare(b.c.n));
  return out;
}

export default function VarietyAtlas({ cards, finder, useCounts, facets, regionList, stats, seedCompanies }) {
  const [q, setQ] = useState("");
  const [use, setUse] = useState("all");
  const [sel, setSel] = useState({});
  const [sort, setSort] = useState("default");
  const [lim, setLim] = useState({ k: "", n: PAGE });
  const [sheet, setSheet] = useState(false);
  const [cmp, setCmp] = useState([]);
  const [cmpMsg, setCmpMsg] = useState("");

  const [fUse, setFUse] = useState("fries");
  const [fRegion, setFRegion] = useState("");
  const [fRisks, setFRisks] = useState([]);
  const [fShow, setFShow] = useState(6);

  const byslug = useMemo(() => Object.fromEntries(cards.map((c) => [c.s, c])), [cards]);
  const hay = useMemo(
    () => Object.fromEntries(cards.map((c) => [c.s, fold([c.n, c.b, c.c, c.r, c.m, c.ks, c.kf, ...(c.u || []), ...(c.g || []), ...(c.rz || []).map((r) => RZ_LABEL[r])].join(" "))])),
    [cards],
  );

  const toggle = (k, v) =>
    setSel((s) => {
      const cur = new Set(s[k] || []);
      cur.has(v) ? cur.delete(v) : cur.add(v);
      return { ...s, [k]: [...cur] };
    });
  const nSel = Object.values(sel).reduce((a, v) => a + v.length, 0);
  const clearAll = () => { setSel({}); setQ(""); setUse("all"); };

  const needle = fold(q.trim());
  const shown = useMemo(() => {
    const list = cards.filter((c) => {
      if (use !== "all" && !(c.g || []).includes(use)) return false;
      for (const [k, vals] of Object.entries(sel)) {
        if (!vals.length) continue;
        if (k === "rz") { if (!vals.every((v) => (c.rz || []).includes(v))) return false; }
        else if (!vals.includes(c[k])) return false;
      }
      if (needle && !needle.split(/\s+/).every((w) => hay[c.s].includes(w))) return false;
      return true;
    });
    if (sort === "newest") list.sort((a, b) => (b.y || "0").localeCompare(a.y || "0") || a.n.localeCompare(b.n));
    else if (sort === "dm") list.sort((a, b) => (b.dm ?? -1) - (a.dm ?? -1) || a.n.localeCompare(b.n));
    else if (sort === "az") list.sort((a, b) => a.n.localeCompare(b.n));
    return list;
  }, [cards, use, sel, needle, sort, hay]);

  const key = `${use}|${needle}|${sort}|${JSON.stringify(sel)}`;
  const limit = lim.k === key ? lim.n : PAGE;
  const page = shown.slice(0, limit);

  const pick = (slug) => {
    setCmp((c) => {
      if (c.includes(slug)) { setCmpMsg(""); return c.filter((x) => x !== slug); }
      if (c.length >= MAX_COMPARE) { setCmpMsg(`Up to ${MAX_COMPARE} at a time. Remove one first.`); return c; }
      setCmpMsg("");
      return [...c, slug];
    });
  };

  const shownLabel =
    `${shown.length} ${use === "all" ? "" : USE_LABEL[use] + " "}${shown.length === 1 ? "variety" : "varieties"}` +
    ` · ${shown.filter((c) => c.t).length} with datasheet facts`;

  const results = useMemo(() => rankFinder(cards, finder, fUse, fRegion, fRisks), [cards, finder, fUse, fRegion, fRisks]);
  const fUseLabel = FINDER_USES.find((u) => u.k === fUse).l;
  const askQ = `Which potato variety is best for ${fUseLabel.toLowerCase()}${fRegion ? ` in ${fRegion}` : ""}${
    fRisks.length ? ` with resistance to ${fRisks.map((r) => RISKS.find((x) => x.k === r).l.toLowerCase()).join(" and ")}` : ""
  }?`;

  return (
    <div className="va">
      <style>{VA_CSS}</style>
      <section className="va-hero">
        <nav aria-label="Breadcrumb" className="va-crumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> <span aria-current="page">Varieties</span></nav>
        <div className="va-hero-row">
          <div className="va-hero-l">
            <p className="va-eyebrow">Variety atlas · {stats.total} varieties · {stats.regions} regions · {stats.withTraits} with datasheet facts</p>
            <h1 className="va-h1">Every potato variety that matters, <em>with the facts its breeder publishes.</em></h1>
            <p className="va-dek">Skin, flesh, maturity, dry matter and disease ratings from official datasheets, with the publisher named under every figure. Compare up to four, then find who sells the seed.</p>
          </div>
          <form className="va-search" role="search" onSubmit={(e) => { e.preventDefault(); document.getElementById("va-grid")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
            <label htmlFor="va-q">Search a variety, breeder or use</label>
            <div className="va-search-row">
              <input id="va-q" type="search" placeholder="e.g. Innovator, Kufri, chips, late blight" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
              <button type="submit">Search</button>
            </div>
            <a href="#finder" className="va-findbtn">Find the right variety <span aria-hidden="true">→</span></a>
          </form>
        </div>
      </section>

      <div className="va-chips" role="group" aria-label="Browse by use">
        {[["all", "All varieties"], ["fries", "Fries"], ["chips", "Chips"], ["table", "Table"], ["starch", "Starch"], ["native", "Native"]].map(([k, l]) => (
          <button key={k} type="button" aria-pressed={use === k} onClick={() => setUse(k)}>
            {l} <span>{useCounts[k]}</span>
          </button>
        ))}
      </div>

      <div className="va-body">
        {sheet && <button type="button" className="va-scrim" aria-label="Close filters" onClick={() => setSheet(false)} />}
        <aside className={sheet ? "va-rail open" : "va-rail"} aria-label="Filters" id="va-filters">
          <div className="va-sheet-h">
            <span>Filters{nSel ? ` · ${nSel}` : ""}</span>
            <button type="button" onClick={() => setSheet(false)}>Show {shown.length}</button>
          </div>
          {facets.map((f) => (
            <fieldset key={f.k} className="va-fs">
              <legend>{f.title}</legend>
              {f.note && <p className="va-fs-note">{f.note}</p>}
              {f.options.map((o) => (
                <label key={o.v}>
                  <input type="checkbox" checked={(sel[f.k] || []).includes(o.v)} onChange={() => toggle(f.k, o.v)} />
                  <span>{o.l || o.v}</span>
                  <span className="va-n">{o.n}</span>
                </label>
              ))}
            </fieldset>
          ))}
          {(nSel > 0 || q || use !== "all") && <button type="button" className="va-clear" onClick={clearAll}>Clear all filters</button>}
          <p className="va-fs-note">Maturity, skin, flesh and resistance cover the {stats.withTraits} varieties with datasheet facts.</p>
          <div className="va-alerts-d"><AlertsBox id="va-al1" segment={use === "all" ? "" : use} /></div>
        </aside>

        <div className="va-main" id="va-grid">
          <h2 className="pp-sr">All varieties</h2>
          <div className="va-bar">
            <span aria-live="polite">{shownLabel}</span>
            <div className="va-bar-r">
              <button type="button" className="va-fbtn" onClick={() => setSheet(true)} aria-controls="va-filters" aria-expanded={sheet}>Filters{nSel ? ` · ${nSel}` : ""}</button>
              <label className="va-sort">
                <span>Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </label>
            </div>
          </div>
          {shown.length === 0 ? (
            <div className="va-empty">
              <p>No variety matches these filters.</p>
              <button type="button" className="btn-line" onClick={clearAll}>Clear all filters</button>
            </div>
          ) : (
            <div className="va-grid">
              {page.map((c, i) => (
                <FragmentWithSlot key={c.s} i={i} total={page.length}>
                  <Card c={c} picked={cmp.includes(c.s)} onPick={pick} />
                </FragmentWithSlot>
              ))}
              {page.length < 5 && <FeaturedSlot />}
            </div>
          )}
          {shown.length > limit && (
            <div className="va-loadmore">
              <button type="button" onClick={() => setLim({ k: key, n: limit + PAGE })}>Show {Math.min(PAGE, shown.length - limit)} more</button>
              <span>{limit} of {shown.length} shown</span>
            </div>
          )}
          <p className="va-seedline">Looking for seed? <Link href="/companies?type=seed">Who sells the seed: seed companies in the directory <span aria-hidden="true">→</span></Link></p>
        </div>
      </div>
      <div className="va-alerts-m"><AlertsBox id="va-al2" segment={use === "all" ? "" : use} /></div>

      {/* ── B · Finder ── */}
      <section id="finder" className="vf" aria-labelledby="vf-h">
        <div className="vf-in">
          <p className="va-eyebrow vf-eyebrow">Variety finder</p>
          <h2 id="vf-h" className="vf-h">Which variety should you grow?</h2>
          <p className="vf-dek">Three questions. We match them against published datasheet ratings and show why each variety fits, with the publisher named for every rating.</p>
          <p className="vf-step">1 · What is the crop for?</p>
          <div className="vf-uses" role="group" aria-label="What is the crop for">
            {FINDER_USES.map((u) => (
              <button key={u.k} type="button" aria-pressed={fUse === u.k} onClick={() => { setFUse(u.k); setFShow(6); }}>
                <span className="vf-use-l">{u.l} <span className="vf-use-n">{useCounts[u.k]}</span></span>
                <span className="vf-use-h">{u.hint}</span>
              </button>
            ))}
          </div>
          <div className="vf-row">
            <div className="vf-col">
              <label htmlFor="vf-region" className="vf-step">2 · Where will you grow it?</label>
              <select id="vf-region" value={fRegion} onChange={(e) => { setFRegion(e.target.value); setFShow(6); }}>
                <option value="">Any region</option>
                {regionList.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <span className="vf-note">Matched to the region each variety was bred or registered in.</span>
            </div>
            <fieldset className="vf-col vf-risks">
              <legend className="vf-step">3 · What must it resist?</legend>
              <div>
                {RISKS.map((r) => (
                  <label key={r.k}>
                    <input
                      type="checkbox"
                      checked={fRisks.includes(r.k)}
                      onChange={() => { setFRisks((x) => (x.includes(r.k) ? x.filter((y) => y !== r.k) : [...x, r.k])); setFShow(6); }}
                    />
                    {r.l}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </section>

      <div className="vf-body">
        <div className="vf-main">
          <div className="vf-rh">
            <h3>{results.length} {results.length === 1 ? "variety" : "varieties"} for {fUseLabel.toLowerCase()}</h3>
            <span>Ranked by fit · ratings as each publisher states them</span>
          </div>
          {results.length === 0 && <p className="va-empty">No variety in the register is tagged for this use yet.</p>}
          {results.slice(0, fShow).map(({ c, fit, why, tone }) => (
            <article key={c.s} className="vf-res">
              <span className="vf-res-ph"><Tuber c={c} size="md" /></span>
              <div className="vf-res-b">
                <div className="vf-res-h">
                  <h4><Link href={`/varieties/${c.s}`}>{c.n}</Link></h4>
                  <span className={`vf-fit vf-fit-${tone}`}>{fit}</span>
                </div>
                <p className="va-by">{[c.b, c.c, c.y].filter(Boolean).join(" · ")}</p>
                <ul>{why.map((w) => <li key={w}>{w}</li>)}</ul>
                <div className="vf-links">
                  <Link href={`/varieties/${c.s}`} className="va-more">Full datasheet <span aria-hidden="true">→</span></Link>
                  <Link href={c.co ? `/companies/${c.co}` : "/companies?type=seed"}>Who sells the seed</Link>
                  <button type="button" onClick={() => pick(c.s)} aria-pressed={cmp.includes(c.s)}>{cmp.includes(c.s) ? "Added to compare ✓" : "Add to compare"}</button>
                </div>
              </div>
            </article>
          ))}
          {results.length > fShow && (
            <div className="va-loadmore"><button type="button" onClick={() => setFShow((n) => n + 6)}>Show {Math.min(6, results.length - fShow)} more</button></div>
          )}
          <p className="vf-disc">Fit is a guide from published traits, not agronomic advice for your field. Check local trial results and seed certification before planting.</p>
        </div>
        <aside className="vf-side" aria-label="Seed and help">
          <Link href="/advertise" className="va-feat va-feat-side">
            <span className="va-feat-k">Featured seed supplier · available</span>
            <span className="va-feat-t">Be the seed company growers see when they pick a variety.</span>
            <span className="va-feat-a">See placements <span aria-hidden="true">→</span></span>
          </Link>
          <div className="vf-box">
            <p className="vf-box-k">Seed companies in the directory</p>
            {seedCompanies.length === 0 && <p className="vf-box-s">The list is loading from the directory.</p>}
            {seedCompanies.slice(0, 6).map((s) => (
              <Link key={s.slug} href={`/companies/${s.slug}`} className="vf-co"><span>{s.name}</span><span>{s.country}</span></Link>
            ))}
            <Link href="/companies?type=seed" className="vf-co-all">All seed companies <span aria-hidden="true">→</span></Link>
          </div>
          <div className="vf-ask">
            <p className="vf-ask-t">Ask about your field</p>
            <p className="vf-ask-s">“{askQ}”</p>
            <Link href={`/ask?q=${encodeURIComponent(askQ)}`} className="vf-ask-b">Ask Potatopedia</Link>
          </div>
        </aside>
      </div>

      {cmp.length > 0 && (
        <div className="va-tray" role="region" aria-label="Compare tray">
          <div className="va-tray-in">
            <span className="va-tray-l">
              <strong>Compare</strong> · <span className="va-tray-names">{cmp.map((s) => byslug[s]?.n).join(", ")}</span> <span className="va-tray-n">({cmp.length} of {MAX_COMPARE})</span>
              {cmpMsg && <span className="va-tray-msg" role="status"> {cmpMsg}</span>}
            </span>
            <span className="va-tray-r">
              <button type="button" onClick={() => { setCmp([]); setCmpMsg(""); }}>Clear</button>
              {cmp.length >= 2 ? (
                <Link href={`/varieties/compare?ids=${cmp.join(",")}`} className="va-tray-go">Compare<span className="va-tray-long"> side by side</span></Link>
              ) : (
                <span className="va-tray-go va-tray-wait">Pick one more</span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Inserts the labelled featured slot after the 5th card.
function FragmentWithSlot({ i, children }) {
  return (
    <>
      {children}
      {i === 4 && <FeaturedSlot />}
    </>
  );
}
