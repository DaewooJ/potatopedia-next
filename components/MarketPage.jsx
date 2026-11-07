import Link from "next/link";
import { MAKERS } from "../lib/makers";
import { an, sourcedAnswer } from "../lib/market";

// One template for /market/<problem> and /machines/<type>. Sourced answer first, then a neutral maker table
// (facts from the corpus, websites as plain text, no paid links), then labelled featured slots and buying questions.
// No quote buttons: supplier quotes are parked until Devendra makes them live (7 Nov 2026).

const PUB = [
  [/faostat|\bfao\b/i, "FAOSTAT"], [/usda|nass|\bers\b|\bfas\b|gain|aphis/i, "USDA"], [/\bcip\b/i, "CIP"],
  [/comtrade/i, "UN Comtrade"], [/cpri|icar/i, "ICAR-CPRI"], [/europatat/i, "Europatat"], [/ahdb/i, "AHDB"],
];
function srcLabel(s) {
  const raw = String(s.title || s.source || "").replace(/[-_]/g, " ").replace(/\.(txt|pdf)$/i, "");
  const p = PUB.find(([re]) => re.test(raw));
  const topic = raw.replace(/\b(faostat|fao|usda|cip|comtrade|cpri|icar|faq|verified|comprehensive|deep dive|txt)\b/gi, " ").replace(/\s+/g, " ").trim();
  return { name: p ? p[1] : "Potatopedia research", meta: (topic ? topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase() : "Sourced summary") + (s.data_year ? ` · ${s.data_year}` : "") };
}

function Answer({ text }) {
  const blocks = String(text || "").replace(/^#+\s.*$/gm, "").replace(/\n?FOLLOW_UP:.*$/gm, "").trim().split(/\n\s*\n/).filter(Boolean);
  const inline = (t) => t.split(/(\*\*[^*]+\*\*)/g).map((x, i) => (x.startsWith("**") ? <strong key={i}>{x.slice(2, -2)}</strong> : <span key={i}>{x}</span>));
  return blocks.map((b, i) => {
    const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
    const items = lines.filter((l) => /^[-*•]\s+/.test(l)).map((l) => l.replace(/^[-*•]\s+/, ""));
    const lead = lines.filter((l) => !/^[-*•]\s+/.test(l));
    return (
      <div key={i} style={{ marginBottom: 14 }}>
        {lead.length > 0 && <p className="mk-p">{inline(lead.join(" "))}</p>}
        {items.length > 0 && <ul className="mk-ul">{items.map((it, k) => <li key={k}>{inline(it)}</li>)}</ul>}
      </div>
    );
  });
}

export default async function MarketPage({ item, mode }) {
  const res = await sourcedAnswer(item.question);
  const makers = MAKERS.filter((m) => m.segment === item.segment);
  const cards = [];
  for (const s of res?.sources || []) {
    const c = srcLabel(s);
    if (!cards.some((x) => x.name === c.name && x.meta === c.meta)) cards.push(c);
    if (cards.length === 3) break;
  }
  const title = mode === "machine" ? `How to choose ${an(item.machine)}` : item.problem;

  return (
    <div className="mk">
      <style>{CSS}</style>
      <section className="mk-top">
        <p className="mk-crumb">
          <Link href="/market">Problem market</Link> &nbsp;/&nbsp; {item.stage} &nbsp;/&nbsp; {mode === "machine" ? "Machines" : "Problems"}
        </p>
        <p className="mk-eyebrow">{mode === "machine" ? `Machine guide · ${item.stage} stage` : `Problem · ${item.stage} stage`}</p>
        <h1 className="mk-h1">{title}</h1>
        <p className="mk-lede">
          {mode === "machine"
            ? `What ${an(item.machine)} does, what to look for, and who makes them. The answer below is written from FAOSTAT, USDA, CIP and peer-reviewed research.`
            : `How the problem is solved, which machine fixes it (${an(item.machine)}), and who makes them. The answer below is written from FAOSTAT, USDA, CIP and peer-reviewed research.`}
        </p>
      </section>

      <section className="mk-wrap mk-cols">
        <div style={{ flex: 1.6, minWidth: 0 }}>
          <article className="mk-answer">
            <p className="mk-k">The sourced answer</p>
            <h2 className="mk-q">{item.question}</h2>
            {res?.answer ? <Answer text={res.answer} /> : <p className="mk-p">The answer engine is busy. <Link href={`/ask?q=${encodeURIComponent(item.question)}`}>Ask this question live →</Link></p>}
            {cards.length > 0 && (
              <div className="mk-srcs">
                {cards.map((c, i) => (
                  <div key={i} className="mk-src">
                    <span className="mk-src-k">Source {i + 1}</span>
                    <span className="mk-src-n">{c.name}</span>
                    <span className="mk-src-m">{c.meta}</span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <h2 className="mk-h2">Who makes {item.machine}s</h2>
          {makers.length > 0 ? (
            <div className="mk-table-wrap">
              <table className="mk-table">
                <thead>
                  <tr><th>Company</th><th>Country</th><th>What our sources say</th><th>Website</th></tr>
                </thead>
                <tbody>
                  {makers.map((m) => (
                    <tr key={m.company}>
                      <td className="mk-co">{m.company}</td>
                      <td data-l="Country">{m.country || "Not stated"}</td>
                      <td data-l="What our sources say">{m.makes}</td>
                      <td className="mk-web" data-l="Website">{m.website || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mk-p">Our sources do not yet name makers for this stage. Makers can <Link href="/advertise">contact us</Link> to be listed.</p>
          )}
          <p className="mk-note">A neutral listing from the companies named in our sources. Order is alphabetical by segment, not a ranking. Listings are free; featured slots are labelled.</p>
        </div>

        <aside className="mk-side">
          <div className="mk-box">
            <p className="mk-k">Ask before you buy</p>
            {item.ask.map((q) => (
              <Link key={q} href={`/ask?q=${encodeURIComponent(q)}`} className="mk-askq">{q} <span>→</span></Link>
            ))}
          </div>
          {[1, 2, 3].map((n) => (
            <Link key={n} href="/advertise" className="mk-slot">
              <span className="mk-k" style={{ color: "var(--mute2)" }}>Featured maker {n} · available</span>
              <span className="mk-slot-t">Your {item.machine}, labelled</span>
              <span className="mk-slot-s">With your demo video and spec sheet. The neutral answer stays first.</span>
            </Link>
          ))}
        </aside>
      </section>
    </div>
  );
}

const CSS = `
.mk { color: var(--ink); }
.mk a { color: var(--gold); }
.mk-top, .mk-wrap { max-width: 1200px; margin: 0 auto; padding-left: 32px; padding-right: 32px; box-sizing: border-box; }
.mk-top { padding-top: 48px; padding-bottom: 8px; }
.mk-crumb { margin: 0 0 14px; font-size: 13px; color: var(--mute2); }
.mk-crumb a { text-decoration: none; }
.mk-eyebrow, .mk-k { margin: 0 0 12px; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); display: block; }
.mk-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(44px, 6.5vw, 84px); line-height: .98; letter-spacing: -.02em; }
.mk-lede { margin: 18px 0 0; max-width: 720px; font-size: 18px; line-height: 1.6; color: var(--mute); font-weight: 300; }
.mk-cols { display: flex; gap: 48px; padding-top: 40px; padding-bottom: 72px; align-items: flex-start; }
.mk-answer { background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 28px 30px; margin-bottom: 44px; }
.mk-q { margin: 0 0 16px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 30px; line-height: 1.15; }
.mk-p { margin: 0; font-size: 16.5px; line-height: 1.7; color: var(--ink2); }
.mk-ul { margin: 6px 0 0; padding: 0; list-style: none; display: grid; gap: 6px; font-size: 16px; line-height: 1.6; color: var(--ink2); }
.mk-ul li { position: relative; padding-left: 18px; }
.mk-ul li::before { content: ""; position: absolute; left: 3px; top: .7em; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
.mk-srcs { margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px; border-top: 1px solid var(--line); padding-top: 18px; }
.mk-src { display: flex; flex-direction: column; gap: 2px; }
.mk-src-k { font-size: 10.5px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
.mk-src-n { font-family: var(--hp-serif), Georgia, serif; font-size: 20px; }
.mk-src-m { font-size: 12.5px; color: var(--mute2); }
.mk-h2 { margin: 0 0 16px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 36px; }
.mk-table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 16px; background: var(--card); }
.mk-table { width: 100%; border-collapse: collapse; font-size: 14.5px; min-width: 640px; }
.mk-table th { text-align: left; font-weight: 500; font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--mute2); padding: 14px 16px; border-bottom: 1px solid var(--line); }
.mk-table td { padding: 14px 16px; border-bottom: 1px solid var(--line); vertical-align: top; line-height: 1.5; color: var(--ink2); }
.mk-table tr:last-child td { border-bottom: 0; }
.mk-co { font-family: var(--hp-serif), Georgia, serif; font-size: 19px; color: var(--ink) !important; white-space: nowrap; }
.mk-web { color: var(--mute2) !important; white-space: nowrap; }
.mk-note { margin: 12px 0 0; font-size: 13px; color: var(--mute2); }
.mk-side { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 14px; position: sticky; top: 90px; }
.mk-box { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 22px; }
.mk-askq { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid var(--line); text-decoration: none; color: var(--ink) !important; font-family: var(--hp-serif), Georgia, serif; font-size: 19px; line-height: 1.2; }
.mk-askq span { color: var(--gold); font-family: var(--hp-sans), sans-serif; }
.mk-slot { display: flex; flex-direction: column; gap: 6px; border: 1px dashed var(--line2); border-radius: 18px; padding: 20px; text-decoration: none; }
.mk-slot-t { font-family: var(--hp-serif), Georgia, serif; font-size: 22px; color: var(--ink); line-height: 1.15; }
.mk-slot-s { font-size: 13.5px; color: var(--mute); line-height: 1.5; }
@media (max-width: 700px) {
  .mk-table-wrap { overflow: visible; }
  .mk-table { min-width: 0; }
  .mk-table thead { display: none; }
  .mk-table tr { display: block; padding: 16px 18px; border-bottom: 1px solid var(--line); }
  .mk-table tr:last-child { border-bottom: 0; }
  .mk-table td { display: block; padding: 3px 0; border: 0; white-space: normal !important; }
  .mk-table td[data-l]::before { content: attr(data-l) " · "; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--mute2); }
  .mk-co { font-size: 22px; margin-bottom: 4px; }
}
@media (max-width: 900px) { .mk-cols { flex-direction: column; } .mk-side { position: static; width: 100%; } .mk-top, .mk-wrap { padding-left: 20px; padding-right: 20px; } .mk-answer { padding: 22px; } }
`;
