import Link from "next/link";
import { getSiteStats } from "../../lib/site-stats";
import { serif, sans } from "../../lib/fonts";
import { VARIETIES } from "../../lib/varieties-data";
import { COUNTRIES, BLOG_POSTS } from "../../lib/data";
import ANSWERS from "../../lib/answers-baked.json";
import LeadForm from "../../components/LeadForm";

// /advertise — the brand door (replaces /support, 7 Nov 2026). Real audience facts only. Rate card in US$ only
// (Devendra approved the USD card 7 Nov 2026; never show INR here). Every placement is labelled; paid content never changes a fact.

export const revalidate = 3600;


export const metadata = {
  title: "Advertise with Potatopedia — Reach the Global Potato Industry",
  description: "Labelled placements inside the neutral, sourced potato reference: featured makers, breeder variety sets, own a question, partner articles, newsletter, AI visibility reports.",
  alternates: { canonical: "https://www.potatopedia.com/advertise" },
};

async function getStats() {
  const st = await getSiteStats();
  return { points: st.dataPoints, sources: st.sources };
}

const PRODUCTS = [
  { n: "01", price: "$2,000", unit: "per year, per stage", name: "Featured maker", who: "Machinery makers", what: "Your company in a labelled slot at the stage of the potato chain you serve (seed, field, harvest, storage, processing, market)." },
  { n: "02", price: "$2,500", unit: "per year", name: "Breeder variety set", who: "Seed breeders and seed houses", what: "Your varieties' dossiers carry your labelled breeder card and a seed-request button. The traits and facts on the page never change." },
  { n: "03", price: "$400", unit: "per question, per year", name: "Own a question", who: "Any potato company", what: "One labelled card under the neutral, sourced answer to a question your buyers ask, on the answer page and in the answer engine." },
  { n: "04", price: "$250", unit: "per article", name: "Publish with us", who: "Any potato company", what: "A partner article, clearly marked \"Published with us\", shared in the newsletter. Partner content is never mixed into the neutral knowledge base." },
  { n: "05", price: "$100", unit: "per day", name: "Newsletter and daily presenter", who: "Any potato company", what: "\"Presented by\" on The Potato Week and on the homepage for the days you choose." },
  { n: "06", price: "$500", unit: "per report", name: "AI visibility report", who: "Any potato company", what: "How often ChatGPT, Perplexity, Gemini and Potatopedia name your brand against rivals for the questions your buyers ask." },
  { n: "07", price: "$500", unit: "per report", name: "Country market report", who: "Traders, investors, makers", what: "A sourced report on one country or segment: production, trade partners, processors, storage and prices." },
];

const RULES = [
  "The neutral, sourced answer always comes first.",
  "Every paid item is labelled Sponsored or Published with us.",
  "Paid content never changes a fact, and sponsors never edit the neutral pages.",
  "Sources: FAOSTAT, USDA, CIP, UN Comtrade, CPRI, Europatat and peer-reviewed research only.",
];

export default async function AdvertisePage() {
  const stats = await getStats();
  const facts = [
    stats && [stats.points.toLocaleString("en-US"), "data points in the answer engine"],
    stats && [String(stats.sources), "sources"],
    [String(VARIETIES.length), "variety dossiers"],
    [String(COUNTRIES.length), "country profiles"],
    [String(Object.keys(ANSWERS).length), "published answers"],
    [String(BLOG_POSTS.length), "stories"],
  ].filter(Boolean);

  return (
    <div className={`ad ${serif.variable} ${sans.variable}`}>
      <style>{CSS}</style>
      <section className="ad-hero">
        <div className="ad-glow" aria-hidden="true" />
        <div className="ad-wrap">
          <p className="ad-eyebrow">Advertise with Potatopedia</p>
          <h1 className="ad-h1">Be the name inside <em>the answer.</em></h1>
          <p className="ad-lede">Growers, processors, traders and researchers come to Potatopedia for neutral, sourced answers about potatoes. Makers, breeders and suppliers reach them through placements that are always labelled.</p>
          <div className="ad-ctas">
            <a href="#book" className="ad-btn">Book a 15-minute call</a>
            <a href="/potatopedia-media-kit.pdf" className="ad-btn ad-btn-ghost">Download the media kit (PDF)</a>
          </div>
        </div>
      </section>

      <section className="ad-facts" aria-label="Potatopedia in numbers">
        <div className="ad-wrap ad-facts-in">
          {facts.map(([n, l]) => (
            <div key={l}>
              <span className="ad-fact-n">{n}</span>
              <span className="ad-fact-l">{l}</span>
            </div>
          ))}
        </div>
        <p className="ad-wrap ad-note">Audience figures (visits, countries, questions asked, newsletter size) come in the media kit with their dates.</p>
      </section>

      <section className="ad-sec">
        <div className="ad-wrap">
          <h2 className="ad-h2">Placements and rates</h2>
          <p className="ad-rate-note">Prices in US dollars. Every placement is labelled; nothing is sold that changes a fact.</p>
          <div className="ad-grid">
            {PRODUCTS.map((p) => (
              <article key={p.n} className="ad-card">
                <span className="ad-n">{p.n}</span>
                <h3 className="ad-card-t">{p.name}</h3>
                <p className="ad-who">{p.who}</p>
                <p className="ad-what">{p.what}</p>
                <p className="ad-price"><span className="ad-price-n">{p.price}</span> <span className="ad-price-u">{p.unit}</span></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ad-sec ad-rules">
        <div className="ad-wrap ad-split">
          <h2 className="ad-h2">The rules we keep</h2>
          <ul className="ad-list">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="book" className="ad-book">
        <div className="ad-wrap ad-split">
          <div>
            <h2 className="ad-h2" style={{ color: "#F4F1EC" }}>Book a 15-minute call</h2>
            <p className="ad-book-s">Tell us who you want to reach. We reply within one working day.</p>
            <p className="ad-book-s">Prefer email? <a href="mailto:hi@potatopedia.com">hi@potatopedia.com</a></p>
          </div>
          <div className="ad-form">
            <LeadForm
              dark
              type="advertise_call"
              submitLabel="Book the call"
              messageLabel="Who do you want to reach, and where?"
              extra={[{ name: "product_interest", label: "Interested in", options: PRODUCTS.map((p) => p.name).concat("Not sure yet") }]}
            />
          </div>
        </div>
      </section>

      <p className="ad-wrap ad-foot">
        Want to support Potatopedia without advertising? <Link href="/contact">Write to us</Link>.
      </p>
    </div>
  );
}

const CSS = `
.ad { --ink:#16140F; --mute:#5E584D; --gold:#9A7238; --line:#E6DCCB; font-family: var(--hp-sans), system-ui, sans-serif; background:#FBF8F2; color: var(--ink); overflow-x: hidden; }
.ad a { color: var(--gold); }
.ad-wrap { max-width: 1160px; margin: 0 auto; padding: 0 32px; box-sizing: border-box; }
.ad-hero { position: relative; overflow: hidden; background:#0A0A0D; color:#F4F1EC; padding: 96px 0 88px; }
.ad-glow { position: absolute; left: 50%; top: -260px; width: 1100px; height: 700px; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(214,168,91,.22), transparent 70%); pointer-events: none; }
.ad-hero .ad-wrap { position: relative; }
.ad-eyebrow { margin: 0 0 20px; font-size: 12.5px; letter-spacing: .22em; text-transform: uppercase; color: #E2C08D; }
.ad-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(48px, 7vw, 92px); line-height: .98; letter-spacing: -.02em; max-width: 900px; }
.ad-h1 em { color: #E2C08D; }
.ad-lede { margin: 24px 0 0; max-width: 640px; font-size: 18px; line-height: 1.65; color: #B7B2AA; font-weight: 300; }
.ad-ctas { margin-top: 32px; display: flex; flex-wrap: wrap; gap: 12px; }
.ad-btn { display: inline-block; background:#F4F1EC; color:#0A0A0D !important; text-decoration: none; font-weight: 500; padding: 14px 22px; border-radius: 999px; }
.ad-btn-ghost { background: transparent; color:#F4F1EC !important; border: 1px solid rgba(255,255,255,.25); }
.ad-facts { border-bottom: 1px solid var(--line); padding: 32px 0 20px; }
.ad-facts-in { display: flex; flex-wrap: wrap; gap: 18px 48px; }
.ad-fact-n { display: block; font-family: var(--hp-serif), Georgia, serif; font-size: 40px; }
.ad-fact-l { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--mute); }
.ad-note { margin: 18px auto 0; font-size: 13px; color: var(--mute); }
.ad-sec { padding: 72px 0; }
.ad-h2 { margin: 0 0 28px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(36px, 4.5vw, 54px); line-height: 1; letter-spacing: -.015em; }
.ad-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
.ad-card { background:#FFFFFF; border: 1px solid var(--line); border-radius: 18px; padding: 24px; }
.ad-n { font-family: var(--hp-serif), Georgia, serif; font-size: 20px; color: #B79A6B; }
.ad-card-t { margin: 8px 0 4px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 28px; line-height: 1.1; }
.ad-who { margin: 0 0 10px; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); }
.ad-what { margin: 0; font-size: 15px; line-height: 1.6; color: var(--mute); }
.ad-price { margin: 16px 0 0; padding-top: 14px; border-top: 1px solid var(--line); }
.ad-price-n { font-family: var(--hp-serif), Georgia, serif; font-size: 30px; color: var(--ink); }
.ad-price-u { font-size: 13px; color: var(--mute); }
.ad-rate-note { margin: -14px 0 24px; font-size: 14px; color: var(--mute); }
.ad-rules { background:#F2EADC; }
.ad-split { display: flex; gap: 56px; align-items: flex-start; }
.ad-split > * { flex: 1; min-width: 0; }
.ad-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 14px; font-size: 17px; line-height: 1.5; }
.ad-list li { border-top: 1px solid #DCD0BB; padding-top: 14px; }
.ad-book { background:#0A0A0D; color:#F4F1EC; padding: 88px 0; }
.ad-book-s { margin: 0 0 12px; font-size: 16px; line-height: 1.65; color: #B7B2AA; }
.ad-book a { color: #E2C08D; }
.ad-form { border-radius: 22px; padding: 28px; background: linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03)); border: 1px solid rgba(255,255,255,.12); }
.ad-foot { padding-top: 28px; padding-bottom: 40px; font-size: 14px; color: var(--mute); }
@media (max-width: 800px) { .ad-split { flex-direction: column; gap: 24px; } .ad-hero { padding: 64px 0; } .ad-sec { padding: 52px 0; } .ad-wrap { padding: 0 20px; } }
`;
