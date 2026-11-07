import Link from "next/link";
import { getSiteStats } from "../../lib/site-stats";
import AI from "../../lib/ai-citations.json";
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
  { n: "01", price: "$1,500", unit: "per year, per company type", name: "Featured company listing", who: "Processors, seed companies, machinery makers", what: "A labelled place in the Featured row of the company directory for your type (processors, seed or machinery). Or $600 per year for one country page. The A to Z list and your facts never change." },
  { n: "02", price: "$300", unit: "per year", name: "Verified company profile", who: "Any listed company", what: "Your company confirms its facts and the profile shows \"Verified by the company\", with your logo, a contact button and enquiries forwarded to you." },
  { n: "03", price: "$2,000", unit: "per year, per stage", name: "Featured maker", who: "Machinery makers", what: "Your company in a labelled slot at the stage of the potato chain you serve (seed, field, harvest, storage, processing, market)." },
  { n: "04", price: "$2,500", unit: "per year", name: "Breeder variety set", who: "Seed breeders and seed houses", what: "Your varieties' dossiers carry your labelled breeder card and a seed-request button. The traits and facts on the page never change." },
  { n: "05", price: "$400", unit: "per question, per year", name: "Own a question", who: "Any potato company", what: "One labelled card under the neutral, sourced answer to a question your buyers ask, on the answer page and in the answer engine." },
  { n: "06", price: "$250", unit: "per article", name: "Publish with us", who: "Any potato company", what: "A partner article, clearly marked \"Published with us\", shared in the newsletter. Partner content is never mixed into the neutral knowledge base." },
  { n: "07", price: "$100", unit: "per day", name: "Newsletter and daily presenter", who: "Any potato company", what: "\"Presented by\" on The Potato Week and on the homepage for the days you choose." },
  { n: "08", price: "$500", unit: "per report", name: "AI visibility report", who: "Any potato company", what: "How often ChatGPT, Perplexity, Gemini and Potatopedia name your brand against rivals for the questions your buyers ask." },
  { n: "09", price: "$500", unit: "per report", name: "Country market report", who: "Traders, investors, makers", what: "A sourced report on one country or segment: production, trade partners, processors, storage and prices." },
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
    [String(VARIETIES.length), "varieties"],
    [String(COUNTRIES.length), "country profiles"],
    [String(Object.keys(ANSWERS).length), "published answers"],
    [String(BLOG_POSTS.length), "stories"],
  ].filter(Boolean);

  return (
    <div className={`sp ${serif.variable} ${sans.variable}`}>
      <style>{CSS}</style>
      <section className="sp-hero">
        <div className="sp-glow" aria-hidden="true" />
        <div className="sp-wrap">
          <p className="sp-eyebrow">Advertise with Potatopedia</p>
          <h1 className="sp-h1">Be the name inside <em>the answer.</em></h1>
          <p className="sp-lede">Growers, processors, traders and researchers come to Potatopedia for neutral, sourced answers about potatoes. Makers, breeders and suppliers reach them through placements that are always labelled.</p>
          <div className="sp-ctas">
            <a href="#book" className="sp-btn">Book a 15-minute call</a>
            <a href="/potatopedia-media-kit.pdf" className="sp-btn sp-btn-ghost">Download the media kit (PDF)</a>
          </div>
        </div>
      </section>

      <section className="sp-facts" aria-label="Potatopedia in numbers">
        <div className="sp-wrap sp-facts-in">
          {facts.map(([n, l]) => (
            <div key={l}>
              <span className="sp-fact-n">{n}</span>
              <span className="sp-fact-l">{l}</span>
            </div>
          ))}
        </div>
        <p className="sp-wrap sp-ai">
          <span className="sp-ai-n">{AI.citations_per_day_30d.toLocaleString("en-US")}</span>
          <span>citations a day in Microsoft Copilot and Bing AI answers <span className="sp-ai-s">(Bing Webmaster Tools, 30-day average to {new Date(AI.period_end + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}; {AI.citations_total.toLocaleString("en-US")} citations in {AI.days} days)</span></span>
        </p>
        <p className="sp-wrap sp-note">Audience figures (visits, countries, questions asked, newsletter size) come in the media kit with their dates.</p>
      </section>

      <section className="sp-sec">
        <div className="sp-wrap">
          <h2 className="sp-h2">Placements and rates</h2>
          <p className="sp-rate-note">Prices in US dollars. Every placement is labelled; nothing is sold that changes a fact.</p>
          <div className="sp-grid">
            {PRODUCTS.map((p) => (
              <article key={p.n} className="sp-card">
                <span className="sp-n">{p.n}</span>
                <h3 className="sp-card-t">{p.name}</h3>
                <p className="sp-who">{p.who}</p>
                <p className="sp-what">{p.what}</p>
                <p className="sp-price"><span className="sp-price-n">{p.price}</span> <span className="sp-price-u">{p.unit}</span></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec sp-rules">
        <div className="sp-wrap sp-split">
          <h2 className="sp-h2">The rules we keep</h2>
          <ul className="sp-list">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="book" className="sp-book">
        <div className="sp-wrap sp-split">
          <div>
            <h2 className="sp-h2" style={{ color: "#F4F1EC" }}>Book a 15-minute call</h2>
            <p className="sp-book-s">Tell us who you want to reach. We reply within one working day.</p>
            <p className="sp-book-s">Prefer email? <a href="mailto:hi@potatopedia.com">hi@potatopedia.com</a></p>
          </div>
          <div className="sp-form">
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

      <p className="sp-wrap sp-foot">
        Want to support Potatopedia without advertising? <Link href="/contact">Write to us</Link>.
      </p>
    </div>
  );
}

const CSS = `
.sp { --ink:#16140F; --mute:#5E584D; --gold:#9A7238; --line:#E6DCCB; font-family: var(--hp-sans), system-ui, sans-serif; background:#FBF8F2; color: var(--ink); overflow-x: hidden; }
.sp a { color: var(--gold); }
.sp-wrap { max-width: 1160px; margin: 0 auto; padding: 0 32px; box-sizing: border-box; }
.sp-hero { position: relative; overflow: hidden; background:#0A0A0D; color:#F4F1EC; padding: 96px 0 88px; }
.sp-glow { position: absolute; left: 50%; top: -260px; width: 1100px; height: 700px; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(214,168,91,.22), transparent 70%); pointer-events: none; }
.sp-hero .sp-wrap { position: relative; }
.sp-eyebrow { margin: 0 0 20px; font-size: 12.5px; letter-spacing: .22em; text-transform: uppercase; color: #E2C08D; }
.sp-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(48px, 7vw, 92px); line-height: .98; letter-spacing: -.02em; max-width: 900px; }
.sp-h1 em { color: #E2C08D; }
.sp-lede { margin: 24px 0 0; max-width: 640px; font-size: 18px; line-height: 1.65; color: #B7B2AA; font-weight: 300; }
.sp-ctas { margin-top: 32px; display: flex; flex-wrap: wrap; gap: 12px; }
.sp-btn { display: inline-block; background:#F4F1EC; color:#0A0A0D !important; text-decoration: none; font-weight: 500; padding: 14px 22px; border-radius: 999px; }
.sp-btn-ghost { background: transparent; color:#F4F1EC !important; border: 1px solid rgba(255,255,255,.25); }
.sp-facts { border-bottom: 1px solid var(--line); padding: 32px 0 20px; }
.sp-facts-in { display: flex; flex-wrap: wrap; gap: 18px 48px; }
.sp-fact-n { display: block; font-family: var(--hp-serif), Georgia, serif; font-size: 40px; }
.sp-fact-l { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--mute); }
.sp-ai { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; margin-top: 26px; padding-top: 20px; padding-bottom: 20px; border: 1px solid rgba(226,192,141,.3); border-radius: 14px; font-size: 15px; line-height: 1.5; }
.sp-ai-n { font-family: var(--hp-serif), Georgia, serif; font-size: 40px; line-height: 1; color: #E2C08D; }
.sp-ai-s { font-size: 12.5px; opacity: .7; }
.sp-note { margin: 18px auto 0; font-size: 13px; color: var(--mute); }
.sp-sec { padding: 72px 0; }
.sp-h2 { margin: 0 0 28px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(36px, 4.5vw, 54px); line-height: 1; letter-spacing: -.015em; }
.sp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
.sp-card { background:#FFFFFF; border: 1px solid var(--line); border-radius: 18px; padding: 24px; }
.sp-n { font-family: var(--hp-serif), Georgia, serif; font-size: 20px; color: #B79A6B; }
.sp-card-t { margin: 8px 0 4px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 28px; line-height: 1.1; }
.sp-who { margin: 0 0 10px; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); }
.sp-what { margin: 0; font-size: 15px; line-height: 1.6; color: var(--mute); }
.sp-price { margin: 16px 0 0; padding-top: 14px; border-top: 1px solid var(--line); }
.sp-price-n { font-family: var(--hp-serif), Georgia, serif; font-size: 30px; color: var(--ink); }
.sp-price-u { font-size: 13px; color: var(--mute); }
.sp-rate-note { margin: -14px 0 24px; font-size: 14px; color: var(--mute); }
.sp-rules { background:#F2EADC; }
.sp-split { display: flex; gap: 56px; align-items: flex-start; }
.sp-split > * { flex: 1; min-width: 0; }
.sp-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 14px; font-size: 17px; line-height: 1.5; }
.sp-list li { border-top: 1px solid #DCD0BB; padding-top: 14px; }
.sp-book { background:#0A0A0D; color:#F4F1EC; padding: 88px 0; }
.sp-book-s { margin: 0 0 12px; font-size: 16px; line-height: 1.65; color: #B7B2AA; }
.sp-book a { color: #E2C08D; }
.sp-form { border-radius: 22px; padding: 28px; background: linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03)); border: 1px solid rgba(255,255,255,.12); }
.sp-foot { padding-top: 28px; padding-bottom: 40px; font-size: 14px; color: var(--mute); }
@media (max-width: 800px) { .sp-split { flex-direction: column; gap: 24px; } .sp-hero { padding: 64px 0; } .sp-sec { padding: 52px 0; } .sp-wrap { padding: 0 20px; } }
`;
