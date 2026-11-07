import Link from "next/link";
import { VARIETIES } from "../lib/varieties-data";
import { COUNTRIES, KNOWLEDGE_TITLES } from "../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE } from "../lib/authors";
import ANSWERS from "../lib/answers-baked.json";
import AskHero from "../components/AskHero";
import LeadForm from "../components/LeadForm";

// Homepage v3 (7 Nov 2026). The AI answer engine is the hero: ask, get a sourced answer in place.
// Below it, "Today on Potatopedia" keeps the daily-issue idea (today's question, number, variety, machine)
// as flat, aligned cards, then Explore, newsletter and the companies band. Clean, global, one accent colour.
// Everything shown is real: published answers, lib/varieties-data.js, sourced numbers, live /stats.

export const revalidate = 3600;

export const metadata = {
  title: { absolute: "Potatopedia — Ask Anything About Potatoes: Varieties, Machines, Data" },
  description: "Ask any question about potatoes and get a sourced answer in seconds: varieties, production, trade, processing and machines. Free, neutral, global.",
  alternates: { canonical: "https://www.potatopedia.com" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com",
    title: "Potatopedia — Ask Anything About Potatoes",
    description: "Sourced answers from FAOSTAT, USDA, CIP, UN Comtrade and peer-reviewed research, in any language.",
    images: ["/og-image.png"],
  },
};

async function getStats() {
  try {
    const r = await fetch("https://potatopedia-backend.onrender.com/stats", { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const s = await r.json();
    return { points: s.total_chunks, sources: s.unique_sources };
  } catch {
    return null;
  }
}

const DAY = 86400_000;
const LAUNCH = Date.UTC(2026, 3, 7); // issue No. 1 = 7 Apr 2026, when this site went live

// Sourced figures only. Each one names its source and year in the card.
const NUMBERS = [
  { n: "24.23 Mt", what: "potatoes harvested in Uttar Pradesh, India's largest producing state", src: "UP Directorate of Horticulture, 2022-23", href: "/country/india" },
  { n: "93.5 Mt", what: "China's potato harvest, the world's largest", src: "FAOSTAT, 2023", href: "/answers/which-country-produces-most-potatoes" },
  { n: "2.05 g", what: "protein in 100 g of raw potato", src: "USDA FoodData Central", href: "/answers/potato-nutrition-facts" },
  { n: "10.85%", what: "of Uttar Pradesh's potatoes come from one district, Agra", src: "UP Directorate of Horticulture, 2022-23", href: "/country/india" },
];

const MACHINES = [
  { no: "M01", name: "Optical & AI sorter", fixes: "Defects reaching the fry line", what: "Cameras and sensors find external and internal defects and reject them in-line." },
  { no: "M02", name: "Size grader", fixes: "Uneven grading", what: "Rollers or screens split tubers by size for seed, ware and processing." },
  { no: "M03", name: "Harvester", fixes: "Harvest bruises", what: "Lifts, cleans and loads the crop; set-up and drop heights decide bruising." },
  { no: "M04", name: "Planter", fixes: "Planting gaps", what: "Places seed at even spacing and depth; gaps and doubles cost yield." },
];

const VARIETY_ROTATION = [
  "Russet Burbank", "Maris Piper", "Kennebec", "Agria", "Carisma", "King Edward", "Désirée", "Yukon Gold",
  "Innovator", "Lady Rosetta", "Atlantic", "Spunta", "Bintje", "Nicola", "Charlotte", "Markies", "Fontane",
  "Shepody", "Ranger Russet", "Diamant", "Marfona", "Hermes", "Kufri Jyoti", "Kufri Chipsona-1",
];

function clean(md) {
  return String(md || "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/\*\*|__|\*|`/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim();
}

// First paragraph, cut at a sentence end near `max` words. Sentences end at . ! ? followed by a space and a
// capital/quote/bracket, so decimals ("$12.8 billion", "2.0 g") and abbreviations never split a figure.
function excerpt(md, max = 70) {
  const para = clean(md).split(/\n\s*\n/).map((p) => p.trim()).find((p) => p.length > 60) || "";
  const sentences = para.split(/(?<=[.!?])\s+(?=[A-Z"“(])/);
  let out = "";
  for (const s of sentences) {
    if (out && (out + " " + s).split(/\s+/).length > max) break;
    out = out ? `${out} ${s}` : s;
  }
  return out.trim();
}

const pick = (list, i) => list[((i % list.length) + list.length) % list.length];

function issueFor(no, answers, varieties) {
  const lead = pick(answers.leads, no * 7);
  const more = [1, 2, 3].map((k) => pick(answers.all, no * 11 + k * 17)).filter((a) => a.slug !== lead.slug).slice(0, 2);
  return {
    no,
    lead,
    more,
    variety: pick(varieties, no),
    machine: pick(MACHINES, no),
    number: pick(NUMBERS, no),
  };
}

export default async function HomePage() {
  const now = Date.now();
  const no = Math.max(1, Math.floor((now - LAUNCH) / DAY) + 1);
  const dateLabel = new Date(now).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const stats = await getStats();

  const all = Object.values(ANSWERS);
  const answers = {
    all,
    leads: all.filter((a) => {
      const e = excerpt(a.answer);
      return a.confidence === "high" && e.length > 80 && /[.!?)"”]$/.test(e);
    }),
  };
  const varieties = VARIETY_ROTATION.map((n) => VARIETIES.find((v) => v.name === n)).filter(Boolean);
  const today = issueFor(no, answers, varieties);
  const v = today.variety;

  const trust = [
    stats && [stats.points.toLocaleString("en-US"), "data points"],
    stats && [String(stats.sources), "sources"],
    [String(VARIETIES.length), "varieties"],
    [String(COUNTRIES.length), "country profiles"],
  ].filter(Boolean);

  const explore = [
    { href: "/varieties", title: "Varieties", sub: `${VARIETIES.length} cultivars, traits and uses` },
    { href: "/countries", title: "Countries", sub: `${COUNTRIES.length} production and trade profiles` },
    { href: "/knowledge", title: "Knowledge", sub: `${Object.keys(KNOWLEDGE_TITLES).length} in-depth guides` },
    { href: "/answers", title: "Answers", sub: `${all.length} published questions` },
    { href: "#quote", title: "Machines", sub: "Get 3 quotes from makers" },
  ];

  return (
    <div className="hp">
      <style>{CSS}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE] }) }}
      />

      {/* ── Hero: the AI answer engine ── */}
      <section className="hp-hero" aria-labelledby="hp-h1">
        <div className="hp-hero-in">
          <p className="hp-eyebrow">The neutral global reference on potatoes</p>
          <h1 id="hp-h1" className="hp-h1">Ask anything about potatoes.</h1>
          <p className="hp-sub">
            Sourced answers in seconds, in any language. Built on FAOSTAT, USDA, CIP, UN Comtrade, CPRI, Europatat and peer-reviewed research.
          </p>
          <div id="ask" className="hp-ask">
            <AskHero />
          </div>
          <ul className="hp-trust" aria-label="Knowledge base">
            {trust.map(([n, l]) => (
              <li key={l}>
                <strong>{n}</strong> {l}
              </li>
            ))}
          </ul>
          <ol className="hp-how" aria-label="How answers work">
            <li><span>1</span>We search the knowledge base for your question</li>
            <li><span>2</span>We cite the sources and years we used</li>
            <li><span>3</span>We answer, and say when data is not published</li>
          </ol>
        </div>
      </section>

      {/* ── Today on Potatopedia ── */}
      <section className="hp-sec" aria-labelledby="hp-today">
        <div className="hp-in">
          <div className="hp-head">
            <h2 id="hp-today" className="hp-h2">Today on Potatopedia</h2>
            <span className="hp-meta">Issue {no} · {dateLabel}</span>
          </div>
          <div className="hp-today">
            <article className="hp-card hp-lead">
              <p className="hp-kicker">Question of the day · {today.lead.category}</p>
              <h3 className="hp-lead-q">{today.lead.question}</h3>
              <p className="hp-lead-a">{excerpt(today.lead.answer)}</p>
              <div className="hp-lead-foot">
                <Link href={`/answers/${today.lead.slug}`} className="hp-link">Read the full sourced answer →</Link>
                <span className="hp-more-q">
                  Also asked:{" "}
                  {today.more.map((a, i) => (
                    <span key={a.slug}>
                      {i > 0 && " · "}
                      <Link href={`/answers/${a.slug}`}>{a.question}</Link>
                    </span>
                  ))}
                </span>
              </div>
            </article>

            <Link href={today.number.href} className="hp-card hp-num">
              <p className="hp-kicker">Number of the day</p>
              <strong className="hp-num-n">{today.number.n}</strong>
              <span className="hp-num-w">{today.number.what}</span>
              <span className="hp-src">Source: {today.number.src}</span>
            </Link>

            {v && (
              <Link href={`/varieties/${v.slug}`} className="hp-card">
                <p className="hp-kicker">Variety of the day</p>
                <strong className="hp-card-t">{v.name}</strong>
                <dl className="hp-dl">
                  <div><dt>Origin</dt><dd>{v.origin.replace(/\s*\(.*\)/, "")}</dd></div>
                  <div><dt>Released</dt><dd>{v.year || "not published"}</dd></div>
                  <div><dt>Best for</dt><dd>{v.uses[0]?.split(" / ")[0]}</dd></div>
                </dl>
                <span className="hp-link">Variety profile →</span>
              </Link>
            )}

            <a href="#quote" className="hp-card">
              <p className="hp-kicker">Machine of the day</p>
              <strong className="hp-card-t">{today.machine.name}</strong>
              <span className="hp-small">{today.machine.what}</span>
              <span className="hp-small"><b>Fixes:</b> {today.machine.fixes}</span>
              <span className="hp-link">Get 3 quotes →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Explore ── */}
      <section className="hp-sec hp-sec-tint" aria-labelledby="hp-explore">
        <div className="hp-in">
          <h2 id="hp-explore" className="hp-h2" style={{ marginBottom: 20 }}>Explore</h2>
          <div className="hp-explore">
            {explore.map((e) => (
              <Link key={e.title} href={e.href} className="hp-tile">
                <strong>{e.title}</strong>
                <span>{e.sub}</span>
              </Link>
            ))}
          </div>
          <div className="hp-news">
            <div>
              <h2 className="hp-h3">The Potato Week</h2>
              <p className="hp-small" style={{ margin: "6px 0 0" }}>One email a week: the most useful new answers, data and stories. Free.</p>
            </div>
            <LeadForm type="newsletter" askName={false} askCompany={false} askCountry={false} askMessage={false} submitLabel="Subscribe" compact />
          </div>
        </div>
      </section>

      {/* ── For companies ── */}
      <section id="companies" className="hp-sec hp-dark" aria-labelledby="hp-co">
        <div className="hp-in hp-co">
          <div>
            <p className="hp-eyebrow" style={{ color: "#F3A7A7" }}>For companies</p>
            <h2 id="hp-co" className="hp-h2" style={{ color: "#fff" }}>Reach the potato industry, inside the answer.</h2>
            <p style={{ color: "#C9C9D1", lineHeight: 1.65, margin: "14px 0 18px" }}>
              Growers, processors, traders and researchers use Potatopedia for neutral, sourced answers. Machinery makers, breeders and
              suppliers reach them through clearly labelled placements. The sourced answer always comes first, and paid content never
              changes a fact.
            </p>
            <ul className="hp-list">
              <li>Featured maker for a machine and its quote requests</li>
              <li>Breeder set: your varieties, labelled</li>
              <li>Own a question: one labelled card under the answer</li>
              <li>Publish with us: a labelled partner article</li>
              <li>Present the daily issue and the newsletter</li>
              <li>AI visibility report: how often AI answers name you</li>
            </ul>
          </div>
          <div className="hp-forms">
            <div className="hp-form" id="quote">
              <LeadForm
                type="machine_quote"
                title="Get 3 quotes for a machine"
                intro="Tell us the machine and capacity. We pass it to up to three makers; you choose who to talk to."
                submitLabel="Get 3 quotes"
                messageLabel="Anything else (crop, variety, current set-up)?"
                compact
                extra={[
                  { name: "product", label: "Machine", options: ["Optical / AI sorter", "Size grader", "Washer / peeler", "Fry, chip or flake line", "Planter", "Harvester", "Haulm topper", "Seed cutter", "Cold storage / ventilation", "Irrigation", "Packing / weighing", "Other"] },
                  { name: "capacity_tph", label: "Capacity (tonnes per hour)", placeholder: "e.g. 10" },
                  { name: "timeline", label: "When?", options: ["Within 3 months", "3–6 months", "6–12 months", "Just researching"] },
                ]}
              />
            </div>
            <div className="hp-form">
              <LeadForm
                type="advertise_call"
                title="Book a 15-minute call"
                intro="We'll send the media kit and rates."
                submitLabel="Book the call"
                compact
                askMessage={false}
                extra={[{ name: "product_interest", label: "Interested in", options: ["Featured maker", "Breeder set", "Own a question", "Publish with us", "Present the daily issue", "AI visibility check", "Not sure yet"] }]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// White, near-black text, one accent (brand red #C62828). No green. Site font (Poppins from the layout).
const CSS = `
.hp { background: #fff; color: #111114; overflow-x: hidden; }
.hp a { color: inherit; }
.hp-eyebrow { margin: 0 0 14px; font-size: 13px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #C62828; }
.hp-hero { padding: 72px 20px 56px; background: radial-gradient(1200px 400px at 50% -120px, #FBEDED 0%, #fff 70%); border-bottom: 1px solid #EEEEF0; }
.hp-hero-in { max-width: 820px; margin: 0 auto; text-align: center; }
.hp-h1 { margin: 0; font-size: clamp(36px, 5.6vw, 60px); font-weight: 700; line-height: 1.05; letter-spacing: -.03em; }
.hp-sub { margin: 18px auto 0; max-width: 640px; font-size: 18px; line-height: 1.55; color: #4A4A52; }
.hp-ask { margin: 32px auto 0; text-align: left; }
.hp-trust { list-style: none; margin: 28px 0 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 28px; font-size: 14px; color: #5A5A63; }
.hp-trust strong { color: #111114; font-weight: 700; }
.hp-how { list-style: none; margin: 22px auto 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 24px; font-size: 13px; color: #6B6B74; }
.hp-how li { display: flex; align-items: center; gap: 8px; }
.hp-how span { width: 20px; height: 20px; border-radius: 50%; background: #F4F4F5; color: #111114; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }

.hp-sec { padding: 56px 20px; }
.hp-sec-tint { background: #FAFAFA; border-top: 1px solid #EEEEF0; border-bottom: 1px solid #EEEEF0; }
.hp-in { max-width: 1160px; margin: 0 auto; }
.hp-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.hp-h2 { margin: 0; font-size: clamp(24px, 2.8vw, 32px); font-weight: 700; letter-spacing: -.02em; line-height: 1.15; }
.hp-h3 { margin: 0; font-size: 20px; font-weight: 700; }
.hp-meta { font-size: 13px; color: #6B6B74; }
.hp-today { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; }
.hp-card { background: #fff; border: 1px solid #E4E4E7; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 10px; text-decoration: none; transition: border-color .15s ease, box-shadow .15s ease; }
a.hp-card:hover { border-color: #C9C9CF; box-shadow: 0 8px 24px rgba(15,15,20,.06); }
a.hp-card:focus-visible, .hp-tile:focus-visible { outline: 3px solid #C62828; outline-offset: 2px; }
.hp-kicker { margin: 0; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #6B6B74; }
.hp-lead { grid-row: span 1; }
.hp-lead-q { margin: 0; font-size: 24px; font-weight: 700; line-height: 1.2; letter-spacing: -.01em; }
.hp-lead-a { margin: 0; font-size: 15.5px; line-height: 1.65; color: #34343B; }
.hp-lead-foot { margin-top: auto; display: flex; flex-direction: column; gap: 10px; }
.hp-more-q { font-size: 13px; color: #6B6B74; line-height: 1.5; }
.hp-more-q a { color: #34343B; text-decoration: underline; text-decoration-color: #D4D4D8; }
.hp-link { color: #C62828 !important; font-weight: 600; font-size: 14px; text-decoration: none; margin-top: auto; }
.hp-card-t { font-size: 20px; font-weight: 700; line-height: 1.2; }
.hp-small { font-size: 14px; line-height: 1.55; color: #4A4A52; }
.hp-num-n { font-size: 44px; font-weight: 700; letter-spacing: -.03em; line-height: 1; color: #C62828; }
.hp-num-w { font-size: 14.5px; line-height: 1.5; color: #34343B; }
.hp-src { margin-top: auto; font-size: 12.5px; color: #6B6B74; }
.hp-dl { margin: 0; display: grid; gap: 6px; font-size: 13.5px; }
.hp-dl div { display: flex; justify-content: space-between; gap: 8px; border-top: 1px solid #F0F0F2; padding-top: 6px; }
.hp-dl dt { color: #6B6B74; }
.hp-dl dd { margin: 0; font-weight: 600; text-align: right; }
.hp-explore { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
.hp-tile { background: #fff; border: 1px solid #E4E4E7; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 6px; text-decoration: none; }
.hp-tile:hover { border-color: #C62828; }
.hp-tile strong { font-size: 16px; }
.hp-tile span { font-size: 13.5px; color: #6B6B74; line-height: 1.45; }
.hp-news { margin-top: 28px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px; align-items: center; background: #fff; border: 1px solid #E4E4E7; border-radius: 14px; padding: 22px 24px; }
.hp-dark { background: #111114; color: #fff; }
.hp-co { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 40px; align-items: start; }
.hp-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; color: #E4E4E7; font-size: 15px; }
.hp-list li { display: flex; gap: 10px; }
.hp-list li::before { content: ""; flex: 0 0 6px; height: 6px; margin-top: 9px; border-radius: 50%; background: #E57373; }
.hp-forms { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }
.hp-form { background: #fff; color: #111114; border-radius: 14px; padding: 20px; }

@media (max-width: 1040px) {
  .hp-today { grid-template-columns: 1fr 1fr; }
  .hp-lead { grid-column: 1 / -1; }
  .hp-explore { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .hp-co, .hp-forms { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .hp-hero { padding: 40px 16px 36px; }
  .hp-sub { font-size: 16px; }
  .hp-how { display: none; }
  .hp-sec { padding: 40px 16px; }
  .hp-today { display: flex; flex-direction: column; }
  .hp-explore { grid-template-columns: 1fr 1fr; }
  .hp-news { grid-template-columns: 1fr; padding: 18px; }
  .hp-form { padding: 16px; }
}
`;
