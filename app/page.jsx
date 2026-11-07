import Link from "next/link";
import { getSiteStats } from "../lib/site-stats";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE } from "../lib/authors";
import { VARIETIES } from "../lib/varieties-data";
import { COUNTRIES } from "../lib/data";
import ANSWERS from "../lib/answers-baked.json";
import AskRoots from "../components/AskRoots";
import ChainSection from "../components/ChainSection";
import LeadForm from "../components/LeadForm";
import ThemeFab from "../components/ThemeFab";
import { serif, sans } from "../lib/fonts";

// Homepage (Devendra, 7 Nov 2026): Option 1 "Answer Engine, sources as roots" + Option 4's potato chain,
// premium look (ink + champagne gold + ivory, Instrument Serif + Inter), dark by default with a light theme
// behind the floating switch. Everything shown is real: today's answer is a published, high-confidence answer
// whose opening names an approved source; sources, counts and questions come from the site's own data.

export const revalidate = 3600;


export const metadata = {
  title: { absolute: "Potatopedia — Ask Anything About Potatoes: Varieties, Machines, Data" },
  description: "Ask any question about potatoes and get an answer grown from its sources: FAOSTAT, USDA, CIP, UN Comtrade and peer-reviewed research. Free and neutral.",
  alternates: { canonical: "https://www.potatopedia.com" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com",
    title: "Potatopedia — Ask Anything About Potatoes",
    description: "Every answer grows from its sources: FAOSTAT, USDA, CIP, UN Comtrade and peer-reviewed research.",
    images: ["/og-image.png"],
  },
};

const DAY = 86400_000;
const SOURCE_NAMES = "FAOSTAT|USDA FoodData Central|USDA NASS|USDA ERS|USDA FAS|USDA|FAO|CIP|UN Comtrade|ICAR-CPRI|CPRI|Europatat";
const hasSource = (t) => new RegExp(`\\b(${SOURCE_NAMES})\\b`).test(t);

function clean(md) {
  return String(md || "").replace(/^#+\s.*$/gm, "").replace(/\*\*|__|`/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1").trim();
}

// First paragraph, cut at a sentence end near `max` words; never splits a decimal.
function excerpt(md, max = 70) {
  const para = clean(md).split(/\n\s*\n/).map((p) => p.trim()).find((p) => p.length > 60) || "";
  let out = "";
  for (const s of para.split(/(?<=[.!?])\s+(?=[A-Z"“(])/)) {
    if (out && (out + " " + s).split(/\s+/).length > max) break;
    out = out ? `${out} ${s}` : s;
  }
  return out.trim();
}

// Source cards from the sources the answer itself names, with the nearest year after each mention.
function namedSources(text, fallbackYear) {
  const seen = new Map();
  for (const m of text.matchAll(new RegExp(`\\b(${SOURCE_NAMES})\\b`, "g"))) {
    const name = m[1] === "FAO" ? "FAOSTAT" : m[1];
    const after = text.slice(m.index, m.index + 60).match(/\b(19|20)\d{2}\b/);
    const year = after ? after[0] : fallbackYear;
    const key = `${name}${year || ""}`;
    if (!seen.has(key)) seen.set(key, { name, meta: year ? `Cited for ${year}` : "Cited in this answer" });
  }
  return [...seen.values()].slice(0, 2);
}

function pickPopular(all) {
  const want = [/best .*frying|french fries/i, /nutrition|protein/i, /largest .*import|import the most/i, /how long .*cold storage/i];
  return want.map((re) => all.find((a) => re.test(a.question) || re.test(a.slug))).filter(Boolean);
}

async function getStats() {
  const st = await getSiteStats();
  return { points: st.dataPoints, sources: st.sources };
}

export default async function HomePage() {
  const stats = await getStats();
  const all = Object.values(ANSWERS);
  const leads = all
    .map((a) => ({ a, e: excerpt(a.answer) }))
    .filter(({ a, e }) => a.confidence === "high" && e.length > 80 && /[.!?)"”]$/.test(e) && hasSource(e));
  const day = Math.floor(Date.now() / DAY);
  const { a: lead, e: leadText } = leads[day % leads.length];
  const initial = {
    question: lead.question,
    text: leadText,
    href: `/answers/${lead.slug}`,
    cards: namedSources(leadText, lead.data_freshness?.primary_year),
    related: (Array.isArray(lead.related_questions) ? lead.related_questions : []).filter((q) => q.length <= 70).slice(0, 2),
  };
  if (!initial.cards.length) initial.cards = [{ name: "Potatopedia knowledge base", meta: "Sourced answer" }];
  const popular = pickPopular(all);

  const figures = [
    stats && [stats.points.toLocaleString("en-US"), "data points"],
    stats && [String(stats.sources), "sources"],
    [String(VARIETIES.length), "varieties"],
    [String(COUNTRIES.length), "country profiles"],
  ].filter(Boolean);

  return (
    <div className={`hp ${serif.variable} ${sans.variable}`} data-theme="dark">
      <script dangerouslySetInnerHTML={{ __html: `try{var q=new URLSearchParams(location.search).get("theme");var t=q||localStorage.getItem("pp-theme");if(t==="light"||t==="dark")document.currentScript.parentElement.setAttribute("data-theme",t)}catch(e){}` }} />
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE] }) }} />

      {/* ── Hero ── */}
      <div className="hp-navwrap">
          <header className="hp-nav">
            <Link href="/" className="hp-logo">Potatopedia</Link>
            <nav className="hp-links" aria-label="Main">
              <Link href="/varieties">Varieties</Link>
              <Link href="/countries">Countries</Link>
              <Link href="/knowledge">Knowledge</Link>
              <Link href="/answers">Answers</Link>
              <Link href="/market">Market</Link>
              <Link href="/machines">Machines</Link>
              <Link href="/companies">Companies</Link>
              <Link href="/blog">Blog</Link>
            </nav>
            <a href="/for-companies" className="hp-adv">For companies</a>
            <details className="hp-menu">
              <summary aria-label="Menu">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 6h12M3 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </summary>
              <div className="hp-menu-box">
                <Link href="/varieties">Varieties</Link>
                <Link href="/countries">Countries</Link>
                <Link href="/knowledge">Knowledge</Link>
                <Link href="/answers">Answers</Link>
                <Link href="/market">Market</Link>
                <Link href="/machines">Machines</Link>
                <Link href="/companies">Companies</Link>
                <Link href="/blog">Blog</Link>
                <a href="/for-companies">For companies</a>
              </div>
            </details>
          </header>
      </div>
      <section className="hp-hero">
        <div className="hp-glow" aria-hidden="true" />
        <div className="hp-lines" aria-hidden="true" />

        <div className="hp-hero-in">
          <p className="hp-eyebrow hp-rise">The neutral reference on potatoes</p>
          <h1 className="hp-h1 hp-rise hp-d1">Ask anything about <em>potatoes.</em></h1>
          <p className="hp-lede hp-rise hp-d2">
            Every answer grows from its sources: FAOSTAT, USDA, CIP, UN Comtrade, CPRI, Europatat and peer-reviewed research. In any language.
          </p>
        </div>
        <div className="hp-engine">
          <AskRoots initial={initial} />
        </div>

        <ul className="hp-figs" aria-label="Knowledge base">
          {figures.map(([n, l]) => (
            <li key={l}>
              <span className="hp-fig-n">{n}</span>
              <span className="hp-fig-l">{l}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── The chain ── */}
      <section className="hp-chain" aria-labelledby="hp-chain-h">
        <div className="hp-wrap">
          <div className="hp-split">
            <div>
              <p className="hp-eyebrow hp-eyebrow-dk">02 · The potato chain</p>
              <h2 id="hp-chain-h" className="hp-h2">Where in the chain <em>are you?</em></h2>
            </div>
            <p className="hp-aside">Pick a stage. Ask about it, find the companies that serve it, or learn how to choose the right machine.</p>
          </div>
          <ChainSection />
        </div>
      </section>

      {/* ── Most asked ── */}
      <section className="hp-asked" aria-labelledby="hp-asked-h">
        <div className="hp-wrap hp-asked-in">
          <div className="hp-asked-head">
            <h2 id="hp-asked-h" className="hp-h3">Most asked</h2>
            <Link href="/answers" className="hp-gold-link">All {all.length} answers <span className="hp-arrow">→</span></Link>
          </div>
          <ol className="hp-list">
            {popular.map((a, i) => (
              <li key={a.slug}>
                <Link href={`/answers/${a.slug}`} className="hp-row">
                  <span className="hp-list-n">0{i + 1}</span>
                  <span className="hp-list-q">{a.question}</span>
                  <span className="hp-arrow">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── For companies ── */}
      <section id="companies" className="hp-co" aria-labelledby="hp-co-h">
        <div className="hp-co-glow" aria-hidden="true" />
        <div className="hp-wrap hp-co-in">
          <div style={{ flex: 1.1 }}>
            <p className="hp-eyebrow">03 · For companies</p>
            <h2 id="hp-co-h" className="hp-h2">Be the name inside <em>the answer.</em></h2>
            <p className="hp-co-lede">Growers, processors and traders come here for neutral, sourced answers. Makers, breeders and suppliers reach them through placements that are always labelled. Paid content never changes a fact.</p>
            <ul className="hp-offers">
              <li>Featured maker at a stage</li>
              <li>Own a question</li>
              <li>Breeder variety set</li>
              <li>Publish with us</li>
              <li>Newsletter sponsor</li>
              <li>AI visibility report</li>
            </ul>
          </div>
          <div className="hp-glass hp-co-form">
            <LeadForm
              dark
              type="advertise_call"
              title="Book a 15-minute call"
              intro="We'll send the media kit and rates."
              submitLabel="Book the call"
              askMessage={false}
              compact
              extra={[{ name: "product_interest", label: "Interested in", options: ["Featured maker", "Own a question", "Breeder set", "Publish with us", "Newsletter sponsor", "AI visibility report", "Not sure yet"] }]}
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="hp-foot">
        <div className="hp-wrap hp-foot-top">
          <div style={{ flex: 1 }}>
            <p className="hp-foot-t">The Potato Week</p>
            <p className="hp-foot-s">One considered email a week: the most useful new answers and data. Free.</p>
          </div>
          <div style={{ flex: 1 }}>
            <LeadForm dark type="newsletter" askName={false} askCompany={false} askCountry={false} askMessage={false} submitLabel="Subscribe" compact />
          </div>
        </div>
        <div className="hp-wrap hp-foot-bot">
          <span className="hp-foot-logo">Potatopedia</span>
          <span>Sources: FAOSTAT · USDA · CIP · UN Comtrade · CPRI · Europatat · peer-reviewed journals</span>
          <nav aria-label="Footer" className="hp-foot-links">
            <a href="/for-companies">For companies</a>
            <a href="/for-companies#correct">Submit or correct data</a>
            <a href="/advertise">Advertise</a>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/refund-policy">Refunds</Link>
            <Link href="/shipping-policy">Shipping</Link>
          </nav>
        </div>
      </footer>

      <ThemeFab />
      <nav className="hp-bar" aria-label="Quick actions">
        <a href="#ar-q">Ask</a>
        <a href="/for-companies" className="hp-bar-alt">For companies</a>
      </nav>
    </div>
  );
}

const CSS = `
.hp { --bg:#0A0A0D; --ink:#F4F1EC; --ink2:#DCD7CF; --mute:#B7B2AA; --mute2:#8E8A83; --gold:#E2C08D; --gold-faint:rgba(226,192,141,.25);
  --glass:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03)); --glass-line:rgba(255,255,255,.12); --chip-line:rgba(255,255,255,.16);
  --card:rgba(255,255,255,.04); --line:rgba(255,255,255,.08); --shadow:0 40px 100px rgba(0,0,0,.5); --glow:rgba(214,168,91,.22); --input:rgba(255,255,255,.06);
  --ivory:#F6F1E8; --ivory-card:#FFFDF9; --ivory-ink:#16140F; --ivory-mute:#5E584D; --ivory-line:#E6DCCB; --ivory-gold:#9A7238;
  font-family: var(--hp-sans), system-ui, sans-serif; background: var(--bg); color: var(--ink); overflow-x: clip; transition: background .6s ease, color .6s ease; }
.hp[data-theme="light"] { --bg:#FBF8F2; --ink:#16140F; --ink2:#2E2A23; --mute:#5E584D; --mute2:#6E675B; --gold:#9A7238; --gold-faint:rgba(154,114,56,.28);
  --glass:linear-gradient(180deg,#FFFFFF,#FFFDF8); --glass-line:#E6DCCB; --chip-line:#DCD0BB; --card:#FFFFFF; --line:#E6DCCB;
  --shadow:0 30px 80px rgba(60,40,10,.10); --glow:rgba(214,168,91,.28); --input:#FFFFFF; --ivory:#F2EADC; --ivory-card:#FFFFFF; }
.hp a { color: inherit; }
.hp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.hp em { font-style: italic; color: var(--gold); }
@keyframes hpRise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes hpGlow { 0%,100% { opacity: .6 } 50% { opacity: 1 } }
@keyframes arGrow { from { stroke-dashoffset: 520 } to { stroke-dashoffset: 0 } }
@keyframes arPop { 0%,40% { opacity: 0; transform: translateY(12px) } 100% { opacity: 1; transform: none } }
@keyframes chBelt { from { left: -4% } to { left: 101% } }
.hp-rise { animation: hpRise 1.1s cubic-bezier(.2,.7,.2,1) both }
.hp-d1 { animation-delay: .12s } .hp-d2 { animation-delay: .24s } .hp-d3 { animation-delay: .36s }
.hp-arrow { display: inline-block; transition: transform .2s ease }
.hp-row:hover .hp-arrow, .ar-link:hover .hp-arrow, .hp-gold-link:hover .hp-arrow, .ch-link:hover .hp-arrow { transform: translateX(4px) }

.hp-hero { position: relative; overflow: hidden; padding-bottom: 8px; }
.hp-glow { position: absolute; left: 50%; top: -280px; width: 1200px; height: 780px; transform: translateX(-50%); background: radial-gradient(closest-side, var(--glow), transparent 70%); animation: hpGlow 7s ease-in-out infinite; pointer-events: none; }
.hp-lines { position: absolute; inset: 0; background-image: linear-gradient(var(--line) 1px, transparent 1px); background-size: 100% 96px; opacity: .45; pointer-events: none; }
.hp-navwrap { position: sticky; top: 0; z-index: 60; background: color-mix(in srgb, var(--bg) 84%, transparent); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
.hp-nav { position: relative; z-index: 3; max-width: 1200px; margin: 0 auto; padding: 22px 32px; display: flex; align-items: center; gap: 28px; }
.hp-logo { font-family: var(--hp-serif), Georgia, serif; font-size: 27px; text-decoration: none; letter-spacing: -.01em; }
.hp-links { display: flex; gap: 26px; font-size: 14px; margin-left: 16px; }
.hp-links a { color: var(--mute); text-decoration: none; transition: color .2s; } .hp-links a:hover { color: var(--ink); }
.hp-adv { margin-left: auto; background: var(--ink); color: var(--bg) !important; text-decoration: none; font-weight: 500; font-size: 14px; padding: 10px 18px; border-radius: 999px; }
.hp-menu { display: none; position: relative; }
.hp-menu summary { list-style: none; width: 44px; height: 44px; border-radius: 999px; border: 1px solid var(--chip-line); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.hp-menu summary::-webkit-details-marker { display: none; }
.hp-menu-box { position: absolute; right: 0; top: 52px; min-width: 200px; background: var(--bg); border: 1px solid var(--glass-line); border-radius: 16px; padding: 10px; display: grid; box-shadow: var(--shadow); }
.hp-menu-box a { padding: 12px 14px; border-radius: 10px; text-decoration: none; }
.hp-hero-in { position: relative; max-width: 980px; margin: 0 auto; padding: 72px 32px 0; text-align: center; }
.hp-eyebrow { margin: 0 0 22px; font-size: 12.5px; letter-spacing: .22em; text-transform: uppercase; color: var(--gold); }
.hp-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(52px, 8vw, 100px); line-height: .98; letter-spacing: -.02em; }
.hp-lede { margin: 24px auto 0; max-width: 620px; font-size: 18px; line-height: 1.6; color: var(--mute); font-weight: 300; }
.hp-engine { position: relative; max-width: 980px; margin: 40px auto 0; padding: 0 32px; }

.ar-form { max-width: 760px; margin: 0 auto; display: flex; gap: 8px; padding: 8px; border-radius: 18px; background: var(--input); border: 1px solid var(--chip-line); box-shadow: var(--shadow); }
.ar-form:focus-within { border-color: var(--gold); }
.ar-input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 18px; padding: 14px 16px; color: var(--ink); }
.ar-input::placeholder { color: var(--mute2); }
.ar-btn { border: 0; border-radius: 12px; background: #C62828; color: #fff; font: inherit; font-weight: 500; font-size: 16px; padding: 0 28px; min-height: 54px; cursor: pointer; box-shadow: 0 8px 24px rgba(198,40,40,.32); }
.ar-btn:disabled { opacity: .5; cursor: default; }
.ar-btn:not(:disabled):hover { background: #A61F1F; }
.ar-card { margin-top: 56px; border-radius: 22px; padding: 32px 36px; background: var(--glass); border: 1px solid var(--glass-line); box-shadow: var(--shadow); animation: arPop 1.4s cubic-bezier(.2,.7,.2,1) both; }
.ar-kick { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: var(--mute2); }
.ar-q { margin: 0 0 14px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 36px; line-height: 1.12; }
.ar-a { font-size: 18.5px; line-height: 1.7; color: var(--ink2); font-weight: 300; }
.ar-a strong { color: var(--ink); font-weight: 500; }
.ar-p { margin: 0 0 12px; } .ar-p:last-child { margin-bottom: 0; }
.ar-wait { color: var(--mute2); }
.ar-block + .ar-block { margin-top: 12px; }
.ar-ul { margin: 6px 0 0; padding: 0; list-style: none; display: grid; gap: 6px; }
.ar-ul li { position: relative; padding-left: 20px; }
.ar-ul li::before { content: ""; position: absolute; left: 4px; top: .72em; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
.ar-save { margin-top: 24px; padding: 20px; border-radius: 16px; border: 1px solid var(--glass-line); background: var(--card); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px 24px; align-items: center; animation: arPop 1s ease-out both; }
.ar-save-t { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-size: 22px; color: var(--ink); }
.ar-save-s { margin: 6px 0 0; font-size: 13.5px; line-height: 1.55; color: var(--mute); }
.ar-save-x { grid-column: 1 / -1; justify-self: start; font: inherit; font-size: 13px; color: var(--mute2); background: none; border: 0; padding: 6px 0; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.ar-save-x:hover { color: var(--ink); }
.ar-next { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.ar-link { color: var(--gold) !important; font-size: 14px; font-weight: 500; text-decoration: none; margin-right: 6px; }
.ar-chip { font: inherit; font-size: 13px; color: var(--ink2); background: transparent; border: 1px solid var(--chip-line); border-radius: 999px; padding: 8px 14px; min-height: 38px; cursor: pointer; transition: border-color .2s, background .2s; text-align: left; }
.ar-chip:hover { border-color: var(--gold); }
.ar-roots { display: block; width: 100%; height: 130px; }
.ar-root { stroke-dasharray: 520; animation: arGrow 2.2s cubic-bezier(.3,.6,.2,1) .35s both; }
.ar-sources { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.ar-src { border-radius: 16px; padding: 18px 20px; background: var(--card); border: 1px solid var(--glass-line); text-decoration: none; display: block; }
.ar-spon { background: transparent; border-style: dashed; border-color: var(--chip-line); }
.ar-pop { animation: arPop 2.6s cubic-bezier(.2,.7,.2,1) both; }
.ar-src p { margin: 0; }
.ar-src-k { font-size: 11px; letter-spacing: .2em; color: var(--gold); margin-bottom: 8px !important; }
.ar-src-n { font-family: var(--hp-serif), Georgia, serif; font-size: 24px; }
.ar-src-m { font-size: 13px; color: var(--mute2); margin-top: 4px !important; }

.hp-figs { position: relative; max-width: 1200px; margin: 72px auto 0; padding: 26px 32px 34px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; justify-content: center; gap: 14px 56px; list-style: none; }
.hp-figs li { text-align: center; }
.hp-fig-n { display: block; font-family: var(--hp-serif), Georgia, serif; font-size: 36px; }
.hp-fig-l { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--mute2); }

.hp-wrap { max-width: 1200px; margin: 0 auto; }
.hp-chain { background: var(--ivory); color: var(--ivory-ink); padding: 112px 32px; transition: background .6s ease; }
.hp-split { display: flex; gap: 48px; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; }
.hp-eyebrow-dk { color: var(--ivory-gold); }
.hp-h2 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(40px, 5vw, 64px); line-height: 1; letter-spacing: -.015em; }
.hp-chain .hp-h2 em { color: var(--ivory-ink); }
.hp-aside { margin: 0; max-width: 360px; font-size: 16px; line-height: 1.65; color: var(--ivory-mute); font-weight: 300; }
.ch-stages { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; }
.ch-stage { font: inherit; font-size: 17px; text-align: left; border-radius: 14px; padding: 14px 16px; min-height: 64px; cursor: pointer; background: transparent; color: var(--ivory-ink); border: 1px solid #DCD0BB; transition: all .25s ease; }
.ch-stage:hover { border-color: var(--ivory-gold); }
.ch-stage.is-on { background: var(--ivory-ink); color: var(--ivory); border-color: var(--ivory-ink); box-shadow: 0 14px 30px rgba(22,20,15,.18); }
.ch-num { display: block; font-size: 11px; letter-spacing: .18em; opacity: .6; margin-bottom: 4px; }
.ch-belt { position: relative; height: 34px; margin-top: 18px; overflow: hidden; }
.ch-line { position: absolute; left: 0; right: 0; top: 22px; height: 1px; background: #CDBFA6; }
.ch-tuber { position: absolute; top: 0; animation: chBelt 16s linear infinite; filter: drop-shadow(0 4px 4px rgba(90,60,20,.18)); }
.ch-panel { margin-top: 22px; border-radius: 22px; background: var(--ivory-card); border: 1px solid var(--ivory-line); box-shadow: 0 30px 80px rgba(60,40,10,.08); overflow: hidden; }
.ch-tabs { display: flex; flex-wrap: wrap; border-bottom: 1px solid #EEE6D8; padding: 0 12px; }
.ch-tab { font: inherit; border: 0; background: transparent; padding: 20px 18px; min-height: 60px; cursor: pointer; font-size: 15px; color: #6E675B; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.ch-tab.is-on { color: var(--ivory-ink); font-weight: 500; border-bottom-color: var(--ivory-gold); }
.ch-body { padding: 36px; }
.ch-cols { display: flex; gap: 40px; }
.ch-q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: none; border: 0; border-bottom: 1px solid #EEE6D8; padding: 18px 0; text-align: left; cursor: pointer; font-family: var(--hp-serif), Georgia, serif; font-size: 26px; line-height: 1.2; color: var(--ivory-ink); }
.ch-arr { font-family: var(--hp-sans), sans-serif; font-size: 18px; color: var(--ivory-gold); }
.ch-feat { flex: 1; align-self: flex-start; border-radius: 16px; border: 1px dashed #CDBFA6; padding: 24px; text-decoration: none; display: flex; flex-direction: column; gap: 8px; color: var(--ivory-ink) !important; }
.ch-k { font-size: 11px; letter-spacing: .2em; color: #6E675B; }
.ch-feat-t { font-family: var(--hp-serif), Georgia, serif; font-size: 26px; line-height: 1.15; }
.ch-small { font-size: 14px; line-height: 1.6; color: var(--ivory-mute); }
.ch-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.ch-sup { border-radius: 16px; border: 1px solid #EEE6D8; padding: 22px; display: flex; flex-direction: column; gap: 6px; }
.ch-sup-t { font-family: var(--hp-serif), Georgia, serif; font-size: 26px; }
.ch-link { display: inline-block; margin-top: 20px; font-size: 14px; font-weight: 500; color: var(--ivory-gold) !important; text-decoration: none; }

.hp-asked { background: var(--ivory); color: var(--ivory-ink); padding: 0 32px 112px; transition: background .6s ease; }
.hp-asked-in { border-top: 1px solid #DCD0BB; padding-top: 56px; }
.hp-asked-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.hp-h3 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 44px; }
.hp-gold-link { font-size: 14px; font-weight: 500; color: var(--ivory-gold) !important; text-decoration: none; }
.hp-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 48px; }
.hp-list .hp-row { display: flex; gap: 22px; align-items: baseline; padding: 20px 0; border-bottom: 1px solid var(--ivory-line); text-decoration: none; }
.hp-list-n { font-family: var(--hp-serif), Georgia, serif; font-size: 22px; color: #9A7238; }
.hp-list-q { flex: 1; font-family: var(--hp-serif), Georgia, serif; font-size: 25px; line-height: 1.2; }
.hp-list .hp-arrow { color: var(--ivory-gold); }

.hp-co { position: relative; overflow: hidden; background: #0A0A0D; color: #F4F1EC; padding: 120px 32px; }
.hp-co .hp-eyebrow, .hp-co em { color: #E2C08D; }
.hp-co-glow { position: absolute; right: -200px; top: -200px; width: 700px; height: 700px; background: radial-gradient(closest-side, rgba(214,168,91,.14), transparent); pointer-events: none; }
.hp-co-in { position: relative; display: flex; gap: 72px; align-items: center; }
.hp-co-lede { margin: 22px 0 28px; font-size: 17px; line-height: 1.7; color: #B7B2AA; font-weight: 300; max-width: 520px; }
.hp-offers { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 28px; font-size: 15px; color: #DCD7CF; }
.hp-offers li { padding: 12px 0; border-top: 1px solid rgba(255,255,255,.1); }
.hp-glass { border-radius: 22px; padding: 32px; background: linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03)); border: 1px solid rgba(255,255,255,.12); box-shadow: 0 40px 100px rgba(0,0,0,.5); }
.hp-co-form { flex: 1; }

.hp-foot { background: #0A0A0D; color: #F4F1EC; border-top: 1px solid rgba(255,255,255,.08); padding: 56px 32px 40px; }
.hp-foot-top { display: flex; gap: 40px; align-items: center; }
.hp-foot-t { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-size: 30px; }
.hp-foot-s { margin: 6px 0 0; font-size: 15px; color: #A9A49C; font-weight: 300; }
.hp-foot-bot { margin-top: 48px; display: flex; flex-wrap: wrap; gap: 12px 28px; align-items: center; font-size: 13px; color: #A9A49C; }
.hp-foot-logo { font-family: var(--hp-serif), Georgia, serif; font-size: 20px; color: #DCD7CF; }
.hp-foot-links { margin-left: auto; display: flex; flex-wrap: wrap; gap: 8px 18px; }
.hp-foot-links a { color: #A9A49C; text-decoration: none; } .hp-foot-links a:hover { color: #F4F1EC; }

.tf { position: fixed; right: 24px; bottom: 24px; z-index: 70; width: 64px; height: 64px; border-radius: 50%; border: 0; padding: 0; cursor: pointer; background: #C62828; color: #fff; box-shadow: 0 14px 36px rgba(198,40,40,.42); display: flex; align-items: center; justify-content: center; transition: transform .25s ease, box-shadow .25s ease; }
.tf:hover { transform: scale(1.06); box-shadow: 0 18px 44px rgba(198,40,40,.5); }
.tf:active { transform: scale(.96); }
.tf-label { position: relative; font: 500 11px var(--hp-sans), sans-serif; letter-spacing: .12em; text-transform: uppercase; }
.tf-ring { position: absolute; inset: -6px; border-radius: 50%; border: 1px solid rgba(198,40,40,.45); animation: tfPulse 2.8s ease-out infinite; }
@keyframes tfPulse { 0% { transform: scale(.9); opacity: .9 } 100% { transform: scale(1.35); opacity: 0 } }
.tf:focus-visible { outline: 3px solid #E2C08D; outline-offset: 4px; }
::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
.hp-bar { display: none; }

@media (prefers-reduced-motion: reduce) { .hp-rise, .hp-glow, .ar-card, .ar-root, .ar-pop, .ch-tuber, .tf-ring { animation: none !important } .hp * { transition: none !important } }
@media (max-width: 900px) {
  .hp-links, .hp-adv { display: none; }
  .hp-menu { display: block; margin-left: auto; }
  .hp-split, .hp-co-in, .hp-foot-top, .ch-cols { flex-direction: column; align-items: stretch; }
  .hp-list { grid-template-columns: 1fr; }
  .ch-stages { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .hp-nav { padding: 16px 20px; }
  .hp-hero-in { padding: 36px 20px 0; }
  .hp-lede { font-size: 16px; }
  .hp-engine { padding: 0 20px; margin-top: 28px; }
  .ar-form { flex-direction: column; }
  .ar-input { font-size: 16px; padding: 12px; }
  .ar-btn { min-height: 50px; }
  .ar-card { margin-top: 32px; padding: 22px; }
  .ar-q { font-size: 28px; }
  .ar-a { font-size: 16.5px; }
  .ar-roots { height: 80px; }
  .ar-sources { grid-template-columns: 1fr 1fr; gap: 10px; }
  .ar-spon { grid-column: 1 / -1; }
  .ar-src { padding: 14px; } .ar-src-n { font-size: 20px; }
  .ar-save { grid-template-columns: 1fr; padding: 16px; }
  .hp-figs { gap: 18px 40px; margin-top: 40px; }
  .hp-fig-n { font-size: 30px; }
  .hp-chain, .hp-co { padding: 64px 20px; }
  .hp-asked { padding: 0 20px 64px; }
  .ch-body { padding: 20px; }
  .ch-q, .ch-sup-t, .ch-feat-t { font-size: 21px; }
  .ch-grid { grid-template-columns: 1fr; }
  .ch-stage { font-size: 15px; padding: 10px 12px; min-height: 56px; }
  .hp-h3 { font-size: 34px; }
  .hp-list-q { font-size: 21px; }
  .hp-glass { padding: 20px; }
  .hp-foot { padding: 40px 20px 120px; }
  .tf { bottom: 92px; right: 16px; width: 56px; height: 56px; }
  .hp-bar { display: flex; position: fixed; left: 12px; right: 12px; bottom: 16px; z-index: 60; gap: 8px; padding: 6px; border-radius: 999px; background: rgba(22,20,15,.88); border: 1px solid rgba(255,255,255,.12); box-shadow: 0 20px 50px rgba(0,0,0,.45); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
  .hp-bar a { flex: 1; text-align: center; border-radius: 999px; padding: 13px; font-weight: 500; font-size: 15px; text-decoration: none; background: #F4F1EC; color: #0A0A0D !important; }
  .hp-bar a.hp-bar-alt { background: #C62828; color: #fff !important; }
}
`;
