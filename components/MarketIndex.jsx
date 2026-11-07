import Link from "next/link";
import { PROBLEMS } from "../lib/market";
import { MAKERS } from "../lib/makers";

// Index for /market (by problem) and /machines (by machine type). No quote buttons (parked 7 Nov 2026).
export default function MarketIndex({ mode }) {
  const isM = mode === "machine";
  return (
    <div className="mi">
      <style>{CSS}</style>
      <section className="mi-wrap mi-top">
        <p className="mi-k">{isM ? "Machines" : "Problem market"}</p>
        <h1 className="mi-h1">{isM ? <>Potato machines, <em>explained.</em></> : <>Start from the problem, <em>not the brochure.</em></>}</h1>
        <p className="mi-lede">
          {isM
            ? "How to choose each machine on the potato chain, from a sourced answer, with a neutral list of the makers our sources name."
            : "Six problems growers and processors pay to solve. Each page gives the sourced answer, the machine that fixes it, and the makers our sources name."}
        </p>
        <p className="mi-switch">
          {isM ? <Link href="/market">Browse by problem instead →</Link> : <Link href="/machines">Browse by machine instead →</Link>}
        </p>
      </section>
      <section className="mi-wrap mi-grid">
        {PROBLEMS.map((p, i) => {
          const n = MAKERS.filter((m) => m.segment === p.segment).length;
          return (
            <Link key={p.slug} href={isM ? `/machines/${p.machineSlug}` : `/market/${p.slug}`} className="mi-card">
              <span className="mi-n">{String(i + 1).padStart(2, "0")} · {p.stage}</span>
              <span className="mi-t">{isM ? p.machine.charAt(0).toUpperCase() + p.machine.slice(1) : p.problem}</span>
              <span className="mi-s">{isM ? `Fixes: ${p.problem.toLowerCase()}` : `Fixed by: ${p.machine}`}</span>
              <span className="mi-c">{n ? `${n} makers named in our sources` : "Makers not yet named in our sources"} <b>→</b></span>
            </Link>
          );
        })}
      </section>
      <section className="mi-wrap mi-foot">
        <p>Are you a maker? Listings are free and factual. Labelled featured slots are on the <Link href="/advertise">advertise page</Link>.</p>
      </section>
    </div>
  );
}

const CSS = `
.mi { color: var(--ink); }
.mi a { color: var(--gold); }
.mi-wrap { max-width: 1200px; margin: 0 auto; padding-left: 32px; padding-right: 32px; box-sizing: border-box; }
.mi-top { padding-top: 56px; padding-bottom: 32px; }
.mi-k { margin: 0 0 14px; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
.mi-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(46px, 7vw, 92px); line-height: .98; letter-spacing: -.02em; max-width: 960px; }
.mi-h1 em { color: var(--gold); }
.mi-lede { margin: 20px 0 0; max-width: 680px; font-size: 18px; line-height: 1.6; color: var(--mute); font-weight: 300; }
.mi-switch { margin: 18px 0 0; font-size: 14.5px; }
.mi-switch a { text-decoration: none; }
.mi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; padding-bottom: 40px; }
.mi-card { display: flex; flex-direction: column; gap: 8px; background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 26px; text-decoration: none; transition: border-color .2s, transform .2s; min-width: 0; }
.mi-card:hover { border-color: var(--gold-line); transform: translateY(-2px); }
.mi-n { font-size: 11.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--mute2); }
.mi-t { font-family: var(--hp-serif), Georgia, serif; font-size: 32px; line-height: 1.05; color: var(--ink); }
.mi-s { font-size: 14.5px; color: var(--mute); }
.mi-c { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--line); font-size: 13.5px; color: var(--ink2); display: flex; justify-content: space-between; }
.mi-c b { color: var(--gold); font-weight: 400; }
.mi-foot { padding-bottom: 72px; font-size: 14.5px; color: var(--mute); }
@media (max-width: 768px) { .mi-wrap { padding-left: 20px; padding-right: 20px; } .mi-top { padding-top: 40px; } }
`;
