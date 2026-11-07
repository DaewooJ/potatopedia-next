"use client";

// /ask — the research desk (7 Nov 2026). Shared premium Navigation on top (SiteChrome), a centred reading column,
// role-based suggested questions, answers rendered like the homepage answer engine (gold source roots), honest trust
// line, actions (copy, email me this answer via the newsletter double opt-in, share link, suggest a correction),
// one labelled sponsor slot per answer, a sticky composer, and a desktop-only sidebar of this session's questions.
// Keeps: /ask?q=<question> deep links (auto-ask, ?src= channel tag), follow-ups with buildHistory, streaming, country filter.
// Language: the backend answers Hindi / Hinglish questions itself (it searches in English and replies in the
// question's language), so the desk passes questions through unchanged.

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchStream, buildHistory } from "../../lib/api";
import { trustLine } from "../../lib/trust";
import { sourceLabel } from "../../lib/sources";
import { Rich, clean } from "../../components/AskRoots";
import { COUNTRIES } from "../../lib/data";

const ROLES = [
  {
    id: "grower",
    label: "Grower",
    qs: [
      "What seed rate and spacing give the best potato yields in India?",
      "How do I control late blight in potatoes?",
      "What are average potato yields per hectare by country?",
      "Which potato varieties suit hot, short-day conditions?",
    ],
  },
  {
    id: "trader",
    label: "Trader",
    qs: [
      "Which countries are the largest potato exporters?",
      "How much potato does India export, and to which countries?",
      "Who are the biggest importers of frozen french fries?",
      "How do cold storage stocks affect potato prices in India?",
    ],
  },
  {
    id: "processor",
    label: "Processor",
    qs: [
      "Which potato varieties are best for french fries?",
      "What dry matter content do potato chips need?",
      "How large is India's potato processing industry?",
      "How did Belgium become the world's largest french fry exporter?",
    ],
  },
  {
    id: "seed",
    label: "Seed company",
    qs: [
      "How does seed potato certification work in India?",
      "Which countries are the largest seed potato exporters?",
      "How do minitubers and aeroponics speed up seed multiplication?",
      "How big is the global seed potato trade?",
    ],
  },
  {
    id: "research",
    label: "Researcher",
    qs: [
      "How is climate change affecting global potato yields?",
      "What is the nutritional composition of potatoes?",
      "What are the main potato diseases and pests worldwide?",
      "How much potato does the world produce, and where?",
    ],
  },
];

const RECENT_KEY = "pp-ask-recent";
const SITE = "https://www.potatopedia.com";

function readRecent() {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 12) : [];
  } catch {
    return [];
  }
}
function writeRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 12)));
  } catch {}
}

const askUrl = (q) => `${SITE}/ask?q=${encodeURIComponent(q)}`;

// Unique publisher cards (publisher + topic + year), in the order the backend ranked them.
function cardsFor(sources) {
  const out = [];
  for (const s of sources || []) {
    const c = sourceLabel(s);
    if (!out.some((o) => o.name === c.name && o.meta === c.meta)) out.push(c);
  }
  return out;
}

/* ── Icons (inline SVG, no emoji) ── */
const I = {
  copy: <path d="M9 9h10v10H9zM5 15V5h10" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  mail: <><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  flag: <><path d="M6 21V4" /><path d="M6 4h11l-2 4 2 4H6" /></>,
  send: <><path d="M12 19V5" /><path d="M6 11l6-6 6 6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
};
function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {I[name]}
    </svg>
  );
}

function Sprout() {
  return (
    <svg width="18" height="24" viewBox="0 0 22 28" aria-hidden="true">
      <path d="M11 28 V11" style={{ stroke: "var(--gold)" }} strokeWidth="1.5" fill="none" />
      <path d="M11 15 C5 14 2 9 3 3 C8 4 11 8 11 15 Z" fill="none" style={{ stroke: "var(--gold)" }} strokeWidth="1.2" />
      <path d="M11 12 C16 10 19 6 19 1 C14 2 11 6 11 12 Z" fill="none" style={{ stroke: "var(--gold)" }} strokeWidth="1.2" />
    </svg>
  );
}

/* ── Email me this answer: the existing newsletter double opt-in with saved_question ── */
function EmailAnswer({ q, id, onClose }) {
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [err, setErr] = useState("");
  const fid = `rd-em-${id}`;

  async function submit(e) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "");
    setState("sending");
    setErr("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email, saved_question: q.slice(0, 300), page_url: askUrl(q).slice(0, 500) }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || "Something went wrong. Please try again.");
      setState("done");
    } catch (x) {
      setErr(x.message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rd-mail" role="status">
        <p className="rd-mail-t">Check your inbox to confirm.</p>
        <p className="rd-mail-s">We sent you a link to this answer. One click in that mail confirms The Potato Week, our weekly digest; ignore it and nothing more is sent.</p>
      </div>
    );
  }
  return (
    <form className="rd-mail" onSubmit={submit} noValidate>
      <p className="rd-mail-t">Email me this answer</p>
      <p className="rd-mail-s">We mail you a link to this answer and ask once if you want The Potato Week, one useful digest a week. Free; unsubscribe any time.</p>
      <div className="rd-mail-row">
        <label htmlFor={fid} className="pp-sr">Your email</label>
        <input id={fid} name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="rd-mail-in" />
        <button type="submit" className="rd-mail-btn" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send"}</button>
      </div>
      {err && <p className="rd-mail-err" role="alert">{err}</p>}
      <button type="button" className="rd-mail-x" onClick={onClose}>Close</button>
    </form>
  );
}

function Actions({ turn }) {
  const [flash, setFlash] = useState("");
  const [mail, setMail] = useState(false);
  const hit = (k) => {
    setFlash(k);
    setTimeout(() => setFlash((f) => (f === k ? "" : f)), 2000);
  };
  const copy = async (text, k) => {
    try {
      await navigator.clipboard.writeText(text);
      hit(k);
    } catch {}
  };
  const plain = `${turn.q}\n\n${clean(turn.text).replace(/\*\*/g, "")}\n\nSource: Potatopedia, ${askUrl(turn.q)}`;
  const correction = `/for-companies?page=${encodeURIComponent(`/ask?q=${turn.q}`)}#correct`;
  return (
    <>
      <div className="rd-acts" role="group" aria-label="Answer actions">
        <button type="button" className="rd-act" onClick={() => copy(plain, "copy")}>
          <Icon name={flash === "copy" ? "check" : "copy"} />
          <span>{flash === "copy" ? "Copied" : "Copy"}</span>
        </button>
        <button type="button" className={`rd-act${mail ? " is-on" : ""}`} aria-expanded={mail} onClick={() => setMail((v) => !v)}>
          <Icon name="mail" />
          <span>Email me this</span>
        </button>
        <button type="button" className="rd-act" onClick={() => copy(askUrl(turn.q), "share")}>
          <Icon name={flash === "share" ? "check" : "link"} />
          <span>{flash === "share" ? "Link copied" : "Share link"}</span>
        </button>
        <a className="rd-act" href={correction}>
          <Icon name="flag" />
          <span>Suggest a correction</span>
        </a>
        <span className="pp-sr" aria-live="polite">{flash === "copy" ? "Answer copied" : flash === "share" ? "Link copied" : ""}</span>
      </div>
      {mail && <EmailAnswer q={turn.q} id={turn.id} onClose={() => setMail(false)} />}
    </>
  );
}

function Turn({ turn, onAsk, last }) {
  const cards = cardsFor(turn.sources);
  const shown = cards.slice(0, 2);
  const t = !turn.streaming && !turn.error ? trustLine({ confidence: turn.confidence, sources: turn.sources, data_freshness: turn.data_freshness }) : null;
  const related = (turn.related || []).filter((r) => r && r.length <= 90).slice(0, 4);
  const done = !turn.streaming && !turn.error && turn.text;
  return (
    <article className="rd-turn" id={`t-${turn.id}`} aria-labelledby={`tq-${turn.id}`}>
      <div className="rd-kick">
        <Sprout />
        <span>{turn.streaming ? "Searching the sources…" : turn.error ? "Not answered" : `Answer${cards.length ? ` · ${cards.length} source${cards.length === 1 ? "" : "s"}` : ""}`}</span>
      </div>
      <h2 className="rd-q" id={`tq-${turn.id}`}>{turn.q}</h2>
      {turn.rewritten && turn.rewritten !== turn.q && <p className="rd-rw">Searched as: {turn.rewritten}</p>}

      <div className="rd-a" aria-live={last ? "polite" : "off"} aria-busy={turn.streaming ? "true" : "false"}>
        {turn.streaming && !turn.text ? (
          <div className="rd-wait">
            <p>Reading the sources…</p>
            <span className="rd-shim" style={{ width: "92%" }} />
            <span className="rd-shim" style={{ width: "78%" }} />
            <span className="rd-shim" style={{ width: "84%" }} />
          </div>
        ) : (
          <Rich text={turn.text} />
        )}
      </div>

      {t && (
        <p className={`rd-trust tone-${t.tone}`}>
          <span className="rd-trust-l">{t.label}</span>
          {t.detail && <span> · {t.detail}</span>}
          {t.note && <span className="rd-trust-n">Note: {t.note}.</span>}
        </p>
      )}

      {done && shown.length > 0 && (
        <div className="rd-src-wrap">
          <svg className="rd-roots" viewBox="0 0 916 120" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={`adg${turn.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: "var(--gold)", stopOpacity: 0.9 }} />
                <stop offset="1" style={{ stopColor: "var(--gold)", stopOpacity: 0.25 }} />
              </linearGradient>
            </defs>
            <path className="rd-root" d="M458 0 C458 44 190 52 152 118" stroke={`url(#adg${turn.id})`} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            <path className="rd-root" d="M458 0 L458 118" stroke={`url(#adg${turn.id})`} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            <path className="rd-root" d="M458 0 C458 44 726 52 764 118" stroke={`url(#adg${turn.id})`} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="rd-srcs">
            {shown.map((c, i) => (
              <div key={i} className="rd-src">
                <p className="rd-src-k">Source {i + 1}</p>
                <p className="rd-src-n">{c.name}</p>
                <p className="rd-src-m">{c.meta}</p>
              </div>
            ))}
            <a href="/advertise" className="rd-src rd-spon">
              <p className="rd-src-k rd-spon-k">Own this question · available</p>
              <p className="rd-src-n">Your company here</p>
              <p className="rd-src-m">One labelled card under answers like this one. See the rate card →</p>
            </a>
          </div>
          {cards.length > 2 && (
            <details className="rd-all">
              <summary>All {cards.length} sources</summary>
              <ol>
                {cards.map((c, i) => (
                  <li key={i}><strong>{c.name}</strong> · {c.meta}</li>
                ))}
              </ol>
            </details>
          )}
        </div>
      )}

      {done && <Actions turn={turn} />}

      {done && related.length > 0 && (
        <div className="rd-rel">
          <p className="rd-rel-k">Ask next</p>
          <div className="rd-chips">
            {related.map((r) => (
              <button key={r} type="button" className="rd-chip" onClick={() => onAsk(r, "related_question")}>{r}</button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);
  const flip = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pp-read-theme", next);
    } catch {}
    setDark(!dark);
  };
  return (
    <button type="button" className="rd-ibtn" onClick={flip} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}

function Desk() {
  const params = useSearchParams();
  const initialQ = params.get("q") || "";
  const initialSrc = params.get("src") || "user_typed";

  const [turns, setTurns] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("grower");
  const [recent, setRecent] = useState([]);
  const turnsRef = useRef([]);
  const busyRef = useRef(false);
  const sentInitial = useRef(false);
  const taRef = useRef(null);
  const nextId = useRef(1);

  turnsRef.current = turns;

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  // Grow the composer with its text (up to ~6 lines).
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 168) + "px";
  }, [input]);

  const ask = (text, src) => {
    const q = String(text ?? input).trim();
    if (!q || busyRef.current) return;
    const prior = turnsRef.current.filter((t) => !t.error && t.text);
    const history = buildHistory(prior.flatMap((t) => [{ role: "user", text: t.q }, { role: "ai", text: t.text }]));
    const id = nextId.current++;
    busyRef.current = true;
    setBusy(true);
    setInput("");
    setTurns((p) => [...p, { id, q, text: "", streaming: true, sources: [], related: [] }]);
    setRecent((r) => {
      const next = [q, ...r.filter((x) => x !== q)].slice(0, 12);
      writeRecent(next);
      return next;
    });
    requestAnimationFrame(() => {
      document.getElementById(`t-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const patch = (fn) => setTurns((p) => p.map((t) => (t.id === id ? fn(t) : t)));
    const finish = () => {
      busyRef.current = false;
      setBusy(false);
    };
    fetchStream(
      { question: q, country: country || undefined, conversation_history: history, source: src || "user_typed" },
      (tok) => patch((t) => ({ ...t, text: t.text + tok })),
      (ev) => {
        finish();
        patch((t) => ({
          ...t,
          text: ev.answer || t.text,
          streaming: false,
          confidence: ev.confidence,
          sources: ev.sources || [],
          related: ev.related_questions || [],
          data_freshness: ev.data_freshness || null,
          rewritten: ev.rewritten_question || t.rewritten || null,
        }));
      },
      (err) => {
        finish();
        const msg = err && err.backendError ? "Something went wrong on our side. Please try again in a moment." : "Connection issue. Please check your network and try again.";
        patch((t) => ({ ...t, text: t.text || msg, streaming: false, error: !t.text }));
      },
      (rw) => patch((t) => ({ ...t, rewritten: rw })),
    );
  };

  // Deep link: /ask?q=... asks on load.
  useEffect(() => {
    if (initialQ && !sentInitial.current) {
      sentInitial.current = true;
      ask(initialQ, initialSrc);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    if (busyRef.current) return;
    setTurns([]);
    setInput("");
    try {
      if (window.location.search) window.history.replaceState(null, "", "/ask");
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
    taRef.current?.focus();
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      ask();
    }
  };

  const active = ROLES.find((r) => r.id === role) || ROLES[0];
  const empty = turns.length === 0;
  const earlier = recent.filter((q) => !turns.some((t) => t.q === q)).slice(0, 8);

  return (
    <div className="rd">
      <style>{CSS}</style>

      <aside className="rd-side" aria-label="Your questions">
        <button type="button" className="rd-new" onClick={reset} disabled={busy}>
          <Icon name="plus" size={16} />
          <span>New conversation</span>
        </button>
        {turns.length > 0 && (
          <div className="rd-side-g">
            <p className="rd-side-k">This conversation</p>
            <ol className="rd-side-l">
              {turns.map((t) => (
                <li key={t.id}>
                  <a href={`#t-${t.id}`}>{t.q}</a>
                </li>
              ))}
            </ol>
          </div>
        )}
        {earlier.length > 0 && (
          <div className="rd-side-g">
            <p className="rd-side-k">Earlier on this device</p>
            <ul className="rd-side-l">
              {earlier.map((q) => (
                <li key={q}>
                  <button type="button" onClick={() => ask(q, "recent_question")} disabled={busy}>{q}</button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="rd-side-clear"
              onClick={() => {
                setRecent([]);
                writeRecent([]);
              }}
            >
              Clear list
            </button>
          </div>
        )}
        <p className="rd-side-foot">Your questions are kept in this browser only.</p>
      </aside>

      <div className="rd-main">
        <div className="rd-bar">
          <p className="rd-bar-k">Research desk</p>
          <div className="rd-bar-r">
            <label htmlFor="rd-country" className="pp-sr">Focus on a country</label>
            <select id="rd-country" className="rd-sel" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">All countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
            {!empty && (
              <button type="button" className="rd-ibtn rd-new-m" onClick={reset} disabled={busy} aria-label="New conversation" title="New conversation">
                <Icon name="plus" />
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        <div className="rd-feed">
          {empty ? (
            <section className="rd-empty" aria-labelledby="rd-h">
              <p className="rd-eyebrow">Potatopedia · Ask</p>
              <h1 id="rd-h" className="rd-h1">Ask the potato <em>reference</em></h1>
              <p className="rd-dek">
                Production, trade, prices, varieties, seed and processing, worldwide. Every answer is drawn from official and
                peer-reviewed sources (FAOSTAT, USDA, CIP, UN Comtrade, ICAR-CPRI, Europatat) and shows them.
              </p>
              <div className="rd-roles">
                <p className="rd-roles-k" id="rd-roles-k">Start with a question for your work</p>
                <div className="rd-tabs" role="tablist" aria-labelledby="rd-roles-k">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      role="tab"
                      id={`tab-${r.id}`}
                      aria-selected={role === r.id}
                      aria-controls="rd-tabpanel"
                      tabIndex={role === r.id ? 0 : -1}
                      className={`rd-tab${role === r.id ? " is-on" : ""}`}
                      onClick={() => setRole(r.id)}
                      onKeyDown={(e) => {
                        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                        const i = ROLES.findIndex((x) => x.id === role);
                        const n = ROLES[(i + (e.key === "ArrowRight" ? 1 : ROLES.length - 1)) % ROLES.length];
                        setRole(n.id);
                        document.getElementById(`tab-${n.id}`)?.focus();
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <div className="rd-sugg" role="tabpanel" id="rd-tabpanel" aria-labelledby={`tab-${active.id}`}>
                  {active.qs.map((q) => (
                    <button key={q} type="button" className="rd-sq" onClick={() => ask(q, "suggested_prompt")}>
                      <span>{q}</span>
                      <span className="rd-sq-a" aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            turns.map((t, i) => <Turn key={t.id} turn={t} last={i === turns.length - 1} onAsk={ask} />)
          )}
        </div>

        <form
          className="rd-comp"
          onSubmit={(e) => {
            e.preventDefault();
            ask();
          }}
        >
          <div className="rd-box">
            <label htmlFor="rd-ta" className="pp-sr">{empty ? "Ask a question about potatoes" : "Ask a follow-up question"}</label>
            <textarea
              id="rd-ta"
              ref={taRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={empty ? "Ask a question about potatoes…" : "Ask a follow-up…"}
              className="rd-ta"
              autoComplete="off"
              enterKeyHint="send"
            />
            <button type="submit" className="rd-send" disabled={!input.trim() || busy} aria-label={busy ? "Answering…" : "Ask"}>
              <Icon name="send" size={20} />
            </button>
          </div>
          <p className="rd-note">Answers come from official sources; check before acting.<span className="rd-note-k"> Enter to send, Shift+Enter for a new line.</span></p>
        </form>
      </div>
    </div>
  );
}

export default function AskClient() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh" }} />}>
      <Desk />
    </Suspense>
  );
}

const CSS = `
.rd { max-width: 1240px; margin: 0 auto; padding: 0 16px; display: grid; grid-template-columns: minmax(0, 1fr); }
.rd-main { width: 100%; max-width: 760px; margin: 0 auto; min-height: calc(100vh - 73px); min-height: calc(100dvh - 73px); display: flex; flex-direction: column; }
.rd-side { display: none; }
@media (min-width: 1100px) {
  .rd { grid-template-columns: 240px minmax(0, 1fr); gap: 56px; padding: 0 32px; }
  .rd-side { display: block; position: sticky; top: 73px; align-self: start; max-height: calc(100vh - 73px); overflow-y: auto; padding: 28px 4px 28px 0; }
  .rd-new-m { display: none !important; }
}
.rd-new { width: 100%; display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line2); background: var(--card); color: var(--ink); font: inherit; font-size: 14px; cursor: pointer; transition: border-color .2s; }
.rd-new:hover:not(:disabled) { border-color: var(--gold); }
.rd-new:disabled { opacity: .5; cursor: default; }
.rd-side-g { margin-top: 28px; }
.rd-side-k { margin: 0 0 10px; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--mute3); }
.rd-side-l { margin: 0; padding: 0; list-style: none; display: grid; gap: 2px; }
.rd-side-l a, .rd-side-l button { display: block; width: 100%; text-align: left; padding: 9px 12px; border: 0; border-left: 2px solid var(--line); border-radius: 0 10px 10px 0; background: none; font: inherit; font-size: 13.5px; line-height: 1.4; color: var(--mute); text-decoration: none; cursor: pointer; }
.rd-side-l a:hover, .rd-side-l button:hover:not(:disabled) { color: var(--ink); border-left-color: var(--gold); background: var(--gold-soft); }
.rd-side-clear { margin-top: 8px; font: inherit; font-size: 12.5px; color: var(--mute3); background: none; border: 0; padding: 6px 0; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.rd-side-foot { margin: 28px 0 0; font-size: 12px; color: var(--mute3); line-height: 1.5; }

.rd-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 0 0; }
.rd-bar-k { margin: 0; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--mute3); white-space: nowrap; }
.rd-bar-r { display: flex; align-items: center; gap: 8px; }
.rd-sel { height: 44px; max-width: 170px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--line2); background: var(--card); color: var(--ink2); font: inherit; font-size: 13.5px; cursor: pointer; }
.rd-ibtn { width: 44px; height: 44px; flex: none; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; border: 1px solid var(--line2); background: var(--card); color: var(--ink2); cursor: pointer; transition: border-color .2s; }
.rd-ibtn:hover:not(:disabled) { border-color: var(--gold); }
.rd-ibtn:disabled { opacity: .5; }

.rd-feed { flex: 1; padding: 8px 0 24px; }
.rd-empty { padding: 56px 0 24px; text-align: center; animation: ppRise .8s ease-out both; }
.rd-eyebrow { margin: 0 0 18px; font-size: 12px; letter-spacing: .22em; text-transform: uppercase; color: var(--gold); }
.rd-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif !important; font-weight: 400 !important; font-size: clamp(40px, 6vw, 64px); line-height: 1.04; letter-spacing: -.015em; color: var(--ink); }
.rd-h1 em { font-style: italic; color: var(--gold); }
.rd-dek { margin: 20px auto 0; max-width: 580px; font-size: 17px; line-height: 1.65; color: var(--mute); font-weight: 300; }
.rd-roles { margin: 48px auto 0; text-align: left; }
.rd-roles-k { margin: 0 0 14px; text-align: center; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--mute3); }
.rd-tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.rd-tab { min-height: 44px; padding: 0 18px; border-radius: 999px; border: 1px solid var(--line2); background: transparent; color: var(--mute); font: inherit; font-size: 14px; cursor: pointer; transition: all .2s; }
.rd-tab:hover { color: var(--ink); border-color: var(--gold); }
.rd-tab.is-on { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.rd-tab:focus-visible, .rd-sq:focus-visible, .rd-act:focus-visible, .rd-chip:focus-visible, .rd-send:focus-visible, .rd-ibtn:focus-visible, .rd-new:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
.rd-sugg { margin-top: 20px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.rd-sq { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; text-align: left; min-height: 72px; padding: 16px 18px; border-radius: 16px; border: 1px solid var(--line); background: var(--card); color: var(--ink2); font: inherit; font-size: 15px; line-height: 1.45; cursor: pointer; transition: border-color .2s, transform .2s; animation: ppFade .5s ease-out both; }
.rd-sq:hover { border-color: var(--gold); transform: translateY(-1px); }
.rd-sq-a { color: var(--gold); transition: transform .2s; }
.rd-sq:hover .rd-sq-a { transform: translateX(3px); }

.rd-turn { padding: 40px 0 36px; border-bottom: 1px solid var(--line); scroll-margin-top: 88px; animation: ppRise .6s ease-out both; }
.rd-turn:last-child { border-bottom: 0; }
.rd-kick { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 11.5px; letter-spacing: .18em; text-transform: uppercase; color: var(--mute2); }
.rd-q { margin: 0; font-family: var(--hp-serif), Georgia, serif !important; font-weight: 400 !important; font-size: clamp(28px, 3.6vw, 38px); line-height: 1.12; color: var(--ink); overflow-wrap: anywhere; }
.rd-rw { margin: 10px 0 0; font-size: 13px; color: var(--mute3); font-style: italic; }
.rd-a { margin-top: 20px; font-size: 17.5px; line-height: 1.72; color: var(--ink2); font-weight: 300; overflow-wrap: anywhere; }
.rd-a strong { color: var(--ink); font-weight: 500; }
.rd-a .ar-p { margin: 0 0 12px; } .rd-a .ar-p:last-child { margin-bottom: 0; }
.rd-a .ar-block + .ar-block { margin-top: 14px; }
.rd-a .ar-ul { margin: 6px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
.rd-a .ar-ul li { position: relative; padding-left: 22px; }
.rd-a .ar-ul li::before { content: ""; position: absolute; left: 5px; top: .72em; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
.rd-wait p { margin: 0 0 14px; color: var(--mute2); }
.rd-shim { display: block; height: 13px; margin-bottom: 11px; border-radius: 7px; background: linear-gradient(90deg, var(--line) 25%, var(--paper) 50%, var(--line) 75%); background-size: 800px 100%; animation: ppShimmer 1.5s ease-in-out infinite; }
.rd-trust { margin: 22px 0 0; font-size: 13.5px; line-height: 1.6; color: var(--mute2); }
.rd-trust-l { display: inline-block; padding: 2px 10px; border-radius: 999px; font-weight: 500; font-size: 12.5px; background: var(--gold-soft); color: var(--gold); border: 1px solid var(--gold-line); }
.rd-trust.tone-mid .rd-trust-l { color: var(--mute); background: transparent; border-color: var(--line2); }
.rd-trust.tone-low .rd-trust-l { color: var(--mute3); background: transparent; border-color: var(--dash); border-style: dashed; }
.rd-trust-n { display: block; margin-top: 4px; font-size: 12.5px; color: var(--mute3); }

.rd-src-wrap { margin-top: 8px; }
.rd-roots { display: block; width: 100%; height: 84px; }
.rd-root { stroke-dasharray: 520; animation: adGrow 2s cubic-bezier(.3,.6,.2,1) .2s both; }
@keyframes adGrow { from { stroke-dashoffset: 520 } to { stroke-dashoffset: 0 } }
.rd-srcs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.rd-src { display: block; border-radius: 16px; padding: 16px 18px; background: var(--card); border: 1px solid var(--line); text-decoration: none; color: var(--ink); animation: ppFade 1.2s ease-out .6s both; }
.rd-src p { margin: 0; }
.rd-src-k { font-size: 10.5px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px !important; }
.rd-src-n { font-family: var(--hp-serif), Georgia, serif; font-size: 22px; line-height: 1.15; color: var(--ink); }
.rd-src-m { font-size: 12.5px; line-height: 1.45; color: var(--mute2); margin-top: 4px !important; }
.rd-spon { background: transparent; border-style: dashed; border-color: var(--dash); transition: border-color .2s; }
.rd-spon:hover { border-color: var(--gold); }
.rd-spon-k { color: var(--mute3) !important; }
.rd-spon .rd-src-n { color: var(--ink2); }
.rd-all { margin-top: 14px; font-size: 13px; color: var(--mute2); }
.rd-all summary { cursor: pointer; color: var(--gold); min-height: 32px; display: inline-flex; align-items: center; }
.rd-all ol { margin: 8px 0 0; padding-left: 20px; line-height: 1.7; }
.rd-all strong { color: var(--ink2); font-weight: 500; }

.rd-acts { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 8px; }
.rd-act { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line2); background: transparent; color: var(--mute); font: inherit; font-size: 13.5px; text-decoration: none; cursor: pointer; transition: color .2s, border-color .2s; }
.rd-act:hover, .rd-act.is-on { color: var(--ink); border-color: var(--gold); }
.rd-mail { margin-top: 14px; padding: 18px 20px; border-radius: 16px; border: 1px solid var(--line); background: var(--paper); animation: ppRise .4s ease-out both; }
.rd-mail-t { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-size: 22px; color: var(--ink); }
.rd-mail-s { margin: 6px 0 0; font-size: 13.5px; line-height: 1.55; color: var(--mute); max-width: 560px; }
.rd-mail-row { margin-top: 14px; display: flex; gap: 8px; }
.rd-mail-in { flex: 1; min-width: 0; height: 48px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--line2); background: var(--card); color: var(--ink); font: inherit; font-size: 16px; }
.rd-mail-in:focus { outline: none; border-color: var(--gold); }
.rd-mail-btn { height: 48px; padding: 0 22px; border: 0; border-radius: 12px; background: #C62828; color: #fff; font: inherit; font-weight: 500; font-size: 15px; cursor: pointer; }
.rd-mail-btn:hover:not(:disabled) { background: #A61F1F; }
.rd-mail-btn:disabled { opacity: .6; }
.rd-mail-err { margin: 10px 0 0; font-size: 13.5px; color: #C62828; }
.rd-mail-x { margin-top: 8px; font: inherit; font-size: 13px; color: var(--mute2); background: none; border: 0; padding: 6px 0; min-height: 32px; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }

.rd-rel { margin-top: 26px; }
.rd-rel-k { margin: 0 0 10px; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--mute3); }
.rd-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.rd-chip { min-height: 44px; padding: 8px 16px; border-radius: 999px; border: 1px solid var(--line2); background: var(--card); color: var(--ink2); font: inherit; font-size: 14px; line-height: 1.35; text-align: left; cursor: pointer; transition: border-color .2s; }
.rd-chip:hover { border-color: var(--gold); }

.rd-comp { position: sticky; bottom: 0; z-index: 20; padding: 18px 0 calc(12px + env(safe-area-inset-bottom)); background: linear-gradient(to bottom, transparent 0, var(--bg) 22px); }
.rd-box { display: flex; align-items: flex-end; gap: 8px; padding: 8px 8px 8px 18px; border-radius: 20px; border: 1px solid var(--line2); background: var(--card); box-shadow: var(--shadow); transition: border-color .2s; }
.rd-box:focus-within { border-color: var(--gold); }
.rd-ta { flex: 1; min-width: 0; resize: none; border: 0; outline: 0; background: transparent; color: var(--ink); font: inherit; font-size: 16px; line-height: 1.5; padding: 11px 0; max-height: 168px; }
.rd-ta::placeholder { color: var(--mute3); }
.rd-send { width: 48px; height: 48px; flex: none; border: 0; border-radius: 14px; background: #C62828; color: #fff; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background .2s, opacity .2s; }
.rd-send:hover:not(:disabled) { background: #A61F1F; }
.rd-send:disabled { opacity: .35; cursor: default; }
.rd-note { margin: 8px 4px 0; font-size: 12px; line-height: 1.45; color: var(--mute3); text-align: center; }

@media (max-width: 768px) {
  .rd-empty { padding: 32px 0 12px; }
  .rd-dek { font-size: 16px; }
  .rd-roles { margin-top: 32px; }
  .rd-tabs { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 -16px; padding: 0 16px 4px; }
  .rd-tabs::-webkit-scrollbar { display: none; }
  .rd-tab { flex: none; }
  .rd-roles-k { text-align: left; }
  .rd-sugg { grid-template-columns: 1fr; gap: 10px; }
  .rd-sq { min-height: 60px; padding: 14px 16px; }
  .rd-turn { padding: 28px 0; }
  .rd-a { font-size: 16.5px; }
  .rd-roots { height: 56px; }
  .rd-srcs { grid-template-columns: 1fr 1fr; gap: 10px; }
  .rd-spon { grid-column: 1 / -1; }
  .rd-src { padding: 14px; } .rd-src-n { font-size: 19px; }
  .rd-act { padding: 0 14px; }
  .rd-note { font-size: 11.5px; }
  .rd-note-k { display: none; }
  .rd-sel { max-width: 140px; }
}
@media (max-width: 440px) {
  .rd-bar-k { overflow: hidden; text-overflow: ellipsis; min-width: 0; font-size: 10px; letter-spacing: .14em; }
  .rd-bar-r { gap: 6px; }
  .rd-sel { max-width: 124px; padding: 0 8px; }
  .rd-mail-row { flex-direction: column; }
  .rd-mail-btn { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .rd-empty, .rd-turn, .rd-sq, .rd-src, .rd-root, .rd-mail, .rd-shim { animation: none !important; }
}
`;
