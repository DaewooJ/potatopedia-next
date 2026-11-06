import Link from "next/link";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import { BLOG_POSTS } from "../lib/data";
import { VARIETIES } from "../lib/varieties-data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE } from "../lib/authors";
import ANSWERS from "../lib/answers-baked.json";
import HomeAsk from "../components/HomeAsk";
import LeadForm from "../components/LeadForm";

// Homepage = boards D (Daily Cover) + A (Question Wall) + F (Card Deck), chosen by Devendra 6 Nov 2026.
// Everything shown is real: cover lines are published blog posts, wall tiles are published answers,
// cards come from lib/varieties-data.js. Sponsor slots are shown as available until a sponsor is booked.
// Rotates once a day (ISR). LCP is text: no hero image.

export const revalidate = 3600;

const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "800"], style: ["normal", "italic"], display: "swap", variable: "--pp-display" });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--pp-text" });

export const metadata = {
  title: { absolute: "Potatopedia — Ask Anything About Potatoes: Varieties, Machines, Data" },
  description: "The neutral global reference on potatoes: sourced answers, 240+ varieties, country data, machines and trade. Ask anything, free.",
  alternates: { canonical: "https://www.potatopedia.com" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com",
    title: "Potatopedia — Ask Anything About Potatoes",
    description: "Sourced answers on potato varieties, machines, trade and data from FAOSTAT, USDA, CIP and peer-reviewed research.",
    images: ["/og-image.png"],
  },
};

// Palette (no green). Cover: magenta → burnt orange. Wall: ink + violet. Cards: paper + red.
const C = {
  ink: "#120712",
  night: "#0B0B0F",
  tile: "#17171F",
  paper: "#FFFDF8",
  mag: "#C2006A",
  tan: "#E85200",
  red: "#E63946",
  violet: "#8B6CFF",
  violetSoft: "#C9BBFF",
  coral: "#FF5A36",
  mute: "#A6A3B8",
};

const DAY = 86400_000;
const LAUNCH = Date.UTC(2026, 3, 7); // potatopedia-next went live 7 Apr 2026: issue No. 1

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

function rotate(list, start, n) {
  return Array.from({ length: Math.min(n, list.length) }, (_, i) => list[(start + i) % list.length]);
}

const MACHINES = [
  { key: "sorter", no: "M01", name: "Optical & AI sorter", fixes: "Defects reaching the fry line", what: "Cameras and sensors find external and internal defects and reject them in-line.", tone: "#D8CCFF" },
  { key: "grader", no: "M02", name: "Size grader", fixes: "Uneven grading", what: "Rollers or screens split tubers by size for seed, ware and processing.", tone: "#FFD9C7" },
  { key: "harvester", no: "M03", name: "Harvester", fixes: "Harvest bruises", what: "Lifts, cleans and loads the crop; set-up and drop heights decide bruising.", tone: "#FFE0B5" },
  { key: "planter", no: "M04", name: "Planter", fixes: "Planting gaps", what: "Places seed at even spacing and depth; gaps and doubles cost yield.", tone: "#F7D0DC" },
];
const CARD_VARIETIES = ["Russet Burbank", "Maris Piper", "Kennebec", "Agria", "Carisma", "King Edward", "Désirée", "Yukon Gold"];
const CARD_TONES = ["#E8B77A", "#F3C98B", "#EBC59A", "#F5D27F", "#F1DCA6", "#E9C08D", "#E9A9A0", "#F6D77C"];

export default async function HomePage() {
  const now = Date.now();
  const day = Math.floor(now / DAY);
  const issue = Math.max(1, Math.floor((now - LAUNCH) / DAY) + 1);
  const dateLabel = new Date(now).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();
  const stats = await getStats();

  const posts = [...BLOG_POSTS].sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
  const [story, ...lines] = rotate(posts, day % posts.length, 5);

  const answers = Object.values(ANSWERS);
  const wall = rotate(answers, (day * 9) % answers.length, 9);

  const varieties = CARD_VARIETIES.map((n) => VARIETIES.find((v) => v.name === n)).filter(Boolean);

  return (
    <div className={`${bodoni.variable} ${inter.variable}`} style={{ fontFamily: "var(--pp-text), system-ui, sans-serif", background: C.paper, color: C.ink, overflowX: "hidden" }}>
      <style>{CSS}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE] }) }}
      />

      {/* ───────── D · The Daily Cover ───────── */}
      <section aria-label="Today's cover" style={{ background: C.ink, padding: "20px 16px 28px" }}>
        <div className="pp-cover" style={{ background: `linear-gradient(160deg, ${C.mag} 0%, ${C.tan} 100%)` }}>
          <div className="pp-cover-top">
            <span>NO. {String(issue).padStart(4, "0")} · {dateLabel}</span>
            <span className="pp-hide-sm">
              <Link href="/blog">ALL ISSUES</Link> · <a href="#advertise">ADVERTISE</a>
            </span>
          </div>

          <div className="pp-cover-grid">
            <div>
              <p className="pp-masthead" aria-hidden="true">
                Potato
                <br />
                pedia
              </p>
              <h1 className="pp-cover-h1">
                The neutral world reference on potatoes. <em>Ask anything.</em>
              </h1>
              <p className="pp-cover-sub">
                Sourced from FAOSTAT, USDA, CIP, UN Comtrade, CPRI, Europatat and peer-reviewed research
                {stats ? ` · ${stats.points.toLocaleString("en-US")} data points from ${stats.sources} sources` : ""}.
              </p>
            </div>

            <nav aria-label="Cover lines" className="pp-cover-lines">
              {lines.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="pp-cover-line">
                  <span className="pp-kicker">{(p.category || "Story").toUpperCase()}</span>
                  <span className="pp-cover-line-t">{p.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          {story && (
            <Link href={`/blog/${story.slug}`} className="pp-cover-story">
              <span className="pp-kicker">TODAY&apos;S COVER STORY · {story.readTime?.toUpperCase()}</span>
              <span className="pp-cover-story-t">{story.title}</span>
            </Link>
          )}

          <div className="pp-cover-bar">
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>THE POTATO WEEK · FREE NEWSLETTER</p>
              <p style={{ margin: 0, fontSize: 14, color: "#4A3A48" }}>One email a week: the best new answers, data and stories.</p>
            </div>
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <LeadForm type="newsletter" askName={false} askCompany={false} askCountry={false} askMessage={false} submitLabel="Subscribe" compact />
            </div>
            <a href="#advertise" className="pp-present">
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", display: "block" }}>PRESENTED BY</span>
              <span style={{ fontWeight: 700 }}>Available: present an issue →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ───────── A · The Question Wall ───────── */}
      <section id="wall" aria-labelledby="wall-h" style={{ background: C.night, color: "#fff", padding: "56px 16px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: C.violet, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>● The question wall</p>
          <h2 id="wall-h" className="pp-wall-h">
            Real questions. Sourced answers.
            <br />
            <span style={{ color: C.coral }}>Ask one. Or sponsor one.</span>
          </h2>

          <div className="pp-wall" role="list">
            {wall.slice(0, 2).map((a) => (
              <QuestionTile key={a.slug} a={a} />
            ))}
            <a href="#advertise" role="listitem" className="pp-tile pp-tile-sponsor" style={{ background: C.violet, color: C.night }}>
              <span className="pp-tile-k" style={{ color: C.night }}>Sponsor slot · available</span>
              <strong className="pp-tile-big">Own a question your buyers ask.</strong>
              <span style={{ background: C.night, color: "#fff", borderRadius: 12, padding: 14, fontSize: 13, lineHeight: 1.45 }}>
                The neutral, sourced answer always comes first. Below it, one card labelled <b>Sponsored</b> with your offer.
              </span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Ask about this slot →</span>
            </a>
            {wall.slice(2, 5).map((a) => (
              <QuestionTile key={a.slug} a={a} />
            ))}
            <a href="#advertise" role="listitem" className="pp-tile" style={{ background: C.coral, color: C.night }}>
              <span className="pp-tile-k" style={{ color: C.night }}>For companies</span>
              <strong style={{ fontSize: 21, lineHeight: 1.15 }}>Does an AI answer about your category name you, or your rival?</strong>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Free AI visibility check →</span>
            </a>
            {wall.slice(5, 9).map((a) => (
              <QuestionTile key={a.slug} a={a} />
            ))}
          </div>

          <div id="ask" className="pp-ask-wrap">
            <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", color: C.violetSoft }}>ASK THE WALL</p>
            <div style={{ background: "#fff", color: C.ink, borderRadius: 18, overflow: "hidden" }}>
              <HomeAsk />
            </div>
            <p style={{ margin: "14px 0 0", fontSize: 13 }}>
              <Link href="/answers" style={{ color: C.violetSoft }}>All {answers.length} published answers →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ───────── F · The Card Deck ───────── */}
      <section aria-labelledby="deck-h" style={{ background: C.red, padding: "56px 16px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h2 id="deck-h" className="pp-deck-h">Every potato. Every machine. One card each.</h2>
              <p style={{ margin: "10px 0 0", color: "#FFE7E9", fontSize: 16, maxWidth: 520, lineHeight: 1.5 }}>
                Each card opens the full sourced page. Breeders and makers can sponsor their own set, always labelled.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/varieties" className="pp-pill" style={{ background: "#fff", color: C.ink }}>All {VARIETIES.length} varieties</Link>
              <Link href="/varieties/compare" className="pp-pill" style={{ border: "2px solid #fff", color: "#fff" }}>Compare two</Link>
            </div>
          </div>

          <p className="pp-deck-label">VARIETIES</p>
          <div className="pp-deck" role="list">
            {varieties.map((v, i) => (
              <Link key={v.slug} href={`/varieties/${v.slug}`} role="listitem" className="pp-card" style={{ transform: `rotate(${[-2, 1.5, -1, 2, -1.5, 1, -2, 1.5][i]}deg)` }}>
                <span className="pp-card-top">
                  <span>VARIETY</span>
                  <span>No. {String(i + 1).padStart(3, "0")}</span>
                </span>
                <span className="pp-card-art" style={{ background: CARD_TONES[i] }} aria-hidden="true">
                  {v.name.charAt(0)}
                </span>
                <strong className="pp-card-name">{v.name}</strong>
                <span style={{ fontSize: 12 }}>{v.uses.slice(0, 2).map((u) => u.split(" / ")[0]).join(" · ")}</span>
                <span className="pp-card-rows">
                  <span className="pp-card-row"><span>Origin</span><span>{v.origin.replace(/\s*\(.*\)/, "")}</span></span>
                  <span className="pp-card-row"><span>Released</span><span>{v.year || "not published"}</span></span>
                  <span className="pp-card-row"><span>Best for</span><span>{v.uses[0].split(" / ")[0]}</span></span>
                </span>
                <span className="pp-card-spon">SPONSOR SET · AVAILABLE</span>
              </Link>
            ))}
          </div>

          <p className="pp-deck-label" style={{ marginTop: 36 }}>MACHINES · GET 3 QUOTES</p>
          <div className="pp-deck" role="list">
            {MACHINES.map((m, i) => (
              <a key={m.key} href={`#quote`} role="listitem" className="pp-card" style={{ transform: `rotate(${[1.5, -1.5, 1, -1][i]}deg)` }}>
                <span className="pp-card-top">
                  <span>MACHINE</span>
                  <span>No. {m.no}</span>
                </span>
                <span className="pp-card-art pp-card-art-m" style={{ background: m.tone }} aria-hidden="true">
                  {m.name.split(" ")[0]}
                </span>
                <strong className="pp-card-name">{m.name}</strong>
                <span style={{ fontSize: 12, lineHeight: 1.4 }}>{m.what}</span>
                <span className="pp-card-rows">
                  <span className="pp-card-row"><span>Fixes</span><span>{m.fixes}</span></span>
                </span>
                <span className="pp-card-spon" style={{ color: "#3D1A8F" }}>FEATURED MAKER · AVAILABLE</span>
              </a>
            ))}
          </div>

          <div id="quote" className="pp-panel" style={{ marginTop: 40 }}>
            <LeadForm
              type="machine_quote"
              title="Get 3 quotes for a potato machine"
              intro="Tell us the machine and capacity. We pass your request to up to three makers; you choose who to talk to."
              submitLabel="Get 3 quotes"
              messageLabel="Anything else (crop, variety, current set-up)?"
              extra={[
                { name: "product", label: "Machine", options: ["Optical / AI sorter", "Size grader", "Washer / peeler", "Fry, chip or flake line", "Planter", "Harvester", "Haulm topper", "Seed cutter", "Cold storage / ventilation", "Irrigation", "Packing / weighing", "Other"] },
                { name: "capacity_tph", label: "Capacity (tonnes per hour)", placeholder: "e.g. 10" },
                { name: "timeline", label: "When do you need it?", options: ["Within 3 months", "3–6 months", "6–12 months", "Just researching"] },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ───────── Reach the potato industry ───────── */}
      <section id="advertise" aria-labelledby="adv-h" style={{ background: C.ink, color: "#fff", padding: "56px 16px 72px" }}>
        <div className="pp-adv">
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", color: C.violetSoft }}>FOR COMPANIES</p>
            <h2 className="pp-adv-h">Put your brand inside the answer.</h2>
            <p style={{ color: "#D9D3DE", fontSize: 16, lineHeight: 1.6, margin: "14px 0 20px" }}>
              Growers, processors, traders and researchers come here for neutral, sourced answers. Machinery makers, breeders and
              suppliers can reach them with clearly labelled placements. Paid content never changes a fact.
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10, fontSize: 15 }}>
              {[
                "Featured maker on a machine problem page",
                "Sponsored variety set for breeders",
                "Own a question: one labelled card under the answer",
                "Publish with us: a labelled partner article",
                "Present the daily cover and the newsletter",
                "AI visibility report: how often AI answers name you",
              ].map((t) => (
                <li key={t} style={{ display: "flex", gap: 10 }}>
                  <span aria-hidden="true" style={{ color: C.coral }}>■</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="pp-panel" style={{ color: C.ink }}>
            <LeadForm
              type="advertise_call"
              title="Book a 15-minute call"
              intro="Tell us what you'd like to reach. We'll send the media kit and rates."
              submitLabel="Book the call"
              extra={[
                { name: "product_interest", label: "Interested in", options: ["Featured maker", "Sponsored variety set", "Own a question", "Publish with us", "Daily cover / newsletter", "AI visibility check", "Not sure yet"] },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Phone: fixed bottom bar */}
      <nav aria-label="Quick actions" className="pp-bottom-bar">
        <a href="#ask" style={{ background: "#fff", color: C.night }}>Ask</a>
        <a href="#advertise" style={{ background: C.coral, color: C.night }}>Advertise</a>
      </nav>
    </div>
  );
}

function QuestionTile({ a }) {
  return (
    <Link href={`/answers/${a.slug}`} role="listitem" className="pp-tile" style={{ background: C.tile, color: "#fff" }}>
      <span className="pp-tile-k" style={{ color: "#8C899E" }}>{a.category || "Answer"}</span>
      <strong style={{ fontSize: 21, lineHeight: 1.18 }}>{a.question}</strong>
      <span style={{ fontSize: 13, color: C.violet, fontWeight: 600 }}>Read the sourced answer →</span>
    </Link>
  );
}

const CSS = `
.pp-cover { max-width: 1200px; margin: 0 auto; border-radius: 6px; color: #fff; position: relative; overflow: hidden; }
.pp-cover a { color: #fff; text-decoration: none; }
.pp-cover-top { display: flex; justify-content: space-between; gap: 12px; padding: 18px 24px 0; font-size: 11px; font-weight: 700; letter-spacing: .16em; }
.pp-cover-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 32px; padding: 8px 24px 0; }
.pp-masthead { margin: 0; font-family: var(--pp-display), Georgia, serif; font-weight: 800; font-size: clamp(84px, 13vw, 176px); line-height: .84; letter-spacing: -.04em; }
.pp-cover-h1 { margin: 40px 0 0; font-family: var(--pp-display), Georgia, serif; font-weight: 400; font-size: clamp(26px, 3.2vw, 40px); line-height: 1.05; max-width: 620px; }
.pp-cover-sub { margin: 14px 0 0; font-size: 14px; line-height: 1.5; max-width: 560px; color: #FFEDE4; }
.pp-cover-lines { display: flex; flex-direction: column; gap: 18px; padding-top: 28px; }
.pp-cover-line { border-top: 2px solid #fff; padding-top: 8px; display: block; }
.pp-cover-line:hover .pp-cover-line-t { text-decoration: underline; }
.pp-kicker { display: block; font-size: 11px; font-weight: 700; letter-spacing: .16em; }
.pp-cover-line-t { display: block; margin-top: 4px; font-family: var(--pp-display), Georgia, serif; font-size: 21px; line-height: 1.12; }
.pp-cover-story { display: block; padding: 34px 24px 30px; max-width: 760px; }
.pp-cover-story-t { display: block; margin-top: 8px; font-family: var(--pp-display), Georgia, serif; font-style: italic; font-size: clamp(32px, 4.6vw, 60px); line-height: 1; }
.pp-cover-story:hover .pp-cover-story-t { text-decoration: underline; text-decoration-thickness: 2px; }
.pp-cover-bar { background: #fff; color: #120712; display: flex; flex-wrap: wrap; align-items: center; gap: 18px 24px; padding: 18px 24px; }
.pp-cover-bar a { color: #120712; }
.pp-present { flex: 0 1 auto; border: 1px dashed #B9A9B6; border-radius: 10px; padding: 10px 14px; font-size: 13px; text-decoration: none; }
.pp-wall-h { margin: 0 0 28px; font-family: var(--pp-display), Georgia, serif; font-weight: 800; font-size: clamp(34px, 5.4vw, 64px); line-height: .98; letter-spacing: -.02em; }
.pp-wall { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.pp-tile { border-radius: 16px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; min-height: 190px; text-decoration: none; transition: transform .15s ease; }
.pp-tile:hover { transform: translateY(-3px); }
.pp-tile:focus-visible, .pp-card:focus-visible, .pp-cover a:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
.pp-tile-k { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.pp-tile-sponsor { grid-row: span 2; }
.pp-tile-big { font-family: var(--pp-display), Georgia, serif; font-weight: 800; font-size: 30px; line-height: 1.02; }
.pp-ask-wrap { margin-top: 36px; max-width: 860px; }
.pp-deck-h { margin: 0; font-family: var(--pp-display), Georgia, serif; font-weight: 800; color: #fff; font-size: clamp(34px, 5vw, 60px); line-height: .95; letter-spacing: -.02em; max-width: 720px; }
.pp-pill { padding: 13px 20px; border-radius: 999px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; }
.pp-deck-label { margin: 0 0 14px; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: .16em; }
.pp-deck { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; }
.pp-card { background: #FFFDF8; color: #14102B; border-radius: 20px; border: 3px solid #14102B; box-shadow: 7px 9px 0 #14102B; padding: 16px; display: flex; flex-direction: column; gap: 10px; text-decoration: none; min-height: 330px; transition: transform .15s ease; }
.pp-card:hover { transform: rotate(0deg) translateY(-4px) !important; }
.pp-card-top { display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; letter-spacing: .12em; }
.pp-card-art { height: 108px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--pp-display), Georgia, serif; font-weight: 800; font-size: 64px; color: rgba(20,16,43,.55); }
.pp-card-art-m { font-size: 26px; font-family: var(--pp-text), sans-serif; letter-spacing: -.01em; }
.pp-card-name { font-size: 25px; line-height: 1; letter-spacing: -.02em; }
.pp-card-rows { margin-top: auto; display: flex; flex-direction: column; gap: 5px; font-size: 12px; font-weight: 700; }
.pp-card-row { display: flex; justify-content: space-between; gap: 8px; border-top: 1px solid #14102B; padding-top: 5px; }
.pp-card-row span:last-child { text-align: right; font-weight: 600; }
.pp-card-spon { font-size: 10px; font-weight: 800; letter-spacing: .12em; color: #B3263A; }
.pp-panel { background: #fff; border-radius: 18px; padding: 24px; }
.pp-adv { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 40px; align-items: start; }
.pp-adv-h { margin: 0; font-family: var(--pp-display), Georgia, serif; font-weight: 800; font-size: clamp(34px, 4.6vw, 56px); line-height: .98; letter-spacing: -.02em; }
.pp-bottom-bar { display: none; }

@media (max-width: 1000px) {
  .pp-wall { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pp-deck { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pp-adv { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .pp-hide-sm { display: none; }
  .pp-cover-top { padding: 16px 16px 0; font-size: 10px; }
  .pp-cover-grid { grid-template-columns: 1fr; gap: 8px; padding: 6px 16px 0; }
  .pp-cover-lines { gap: 12px; padding-top: 18px; }
  .pp-cover-line-t { font-size: 18px; }
  .pp-cover-story { padding: 26px 16px 24px; }
  .pp-cover-bar { padding: 16px; }
  .pp-present { width: 100%; box-sizing: border-box; }
  /* Question wall → full-width swipe cards (stories pattern) */
  .pp-wall { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 12px; margin: 0 -16px; padding: 0 16px 8px; scrollbar-width: none; }
  .pp-wall::-webkit-scrollbar { display: none; }
  .pp-tile { flex: 0 0 86%; scroll-snap-align: center; min-height: 360px; }
  .pp-tile strong { font-size: 28px !important; }
  .pp-tile-big { font-size: 32px; }
  /* Card deck → swipeable row */
  .pp-deck { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 18px; margin: 0 -16px; padding: 6px 16px 18px; scrollbar-width: none; }
  .pp-deck::-webkit-scrollbar { display: none; }
  .pp-card { flex: 0 0 74%; scroll-snap-align: center; }
  .pp-panel { padding: 18px; }
  .pp-bottom-bar { display: flex; position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; gap: 8px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom)); background: #0B0B0F; }
  .pp-bottom-bar a { flex: 1; text-align: center; border-radius: 999px; padding: 14px; font-weight: 700; font-size: 15px; text-decoration: none; }
  #advertise { padding-bottom: 110px !important; }
}
`;
