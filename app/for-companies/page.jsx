import Link from "next/link";
import { serif, sans } from "../../lib/fonts";
import CompanyForm from "../../components/CompanyForm";

// /for-companies — one door for companies, breeders and data owners (7 Nov 2026): free listing claim,
// data corrections, breeder datasheets, and the paid /advertise route. Trust rule is stated on the page.

const SITE = "https://www.potatopedia.com";

export const metadata = {
  title: "For Companies, Breeders and Data Owners | Potatopedia",
  description: "Add or claim your company listing for free, correct a fact on Potatopedia, submit variety datasheets and photos, or advertise. Every listing is verified against your official website.",
  alternates: { canonical: `${SITE}/for-companies` },
};

const CLAIM = [
  { name: "company", label: "Company", required: true, autoComplete: "organization" },
  { name: "website", label: "Official website", type: "url", required: true, placeholder: "https://" },
  { name: "kind", label: "Type", type: "select", required: true, options: ["Processor", "Seed company", "Machinery maker", "Other"] },
  { name: "country", label: "Country", autoComplete: "country-name", required: true },
  { name: "name", label: "Your name", required: true, autoComplete: "name" },
  { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
  { name: "role", label: "Your role", required: true },
  { name: "message", label: "Message", type: "textarea" },
];
const CORRECT = [
  { name: "page_url", label: "Page URL", type: "text", required: true, prefillParam: "page", wide: true, placeholder: "https://www.potatopedia.com/…" },
  { name: "wrong", label: "What is wrong", type: "textarea", required: true },
  { name: "correct_fact", label: "The correct fact", type: "textarea", required: true },
  { name: "source_url", label: "Official source link", type: "url", required: true, placeholder: "https://", wide: true },
  { name: "name", label: "Your name", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
];
const DATASHEET = [
  { name: "company", label: "Breeder / company", required: true, autoComplete: "organization" },
  { name: "varieties", label: "Varieties", required: true, placeholder: "e.g. Innovator, Fontane" },
  { name: "link", label: "Link to datasheets or press photos", type: "url", required: true, placeholder: "https://", wide: true },
  { name: "name", label: "Your name", required: true, autoComplete: "name" },
  { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
  { name: "rights_confirmed", label: "Photos are credited. I confirm we hold the rights to the photos and datasheets we submit.", type: "checkbox", required: true },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE}/for-companies#webpage`,
  url: `${SITE}/for-companies`,
  name: "For companies, breeders and data owners",
  description: "How companies and breeders add or claim a listing, correct data, submit variety datasheets, or advertise on Potatopedia.",
  isPartOf: { "@id": `${SITE}/#website` },
  publisher: { "@id": `${SITE}/#publisher` },
};

export default function ForCompaniesPage() {
  return (
    <div className={`fc ${serif.variable} ${sans.variable}`}>
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="fc-hero">
        <div className="fc-glow" aria-hidden="true" />
        <div className="fc-wrap">
          <p className="fc-eyebrow">For companies</p>
          <h1 className="fc-h1">For companies, breeders and <em>data owners</em></h1>
          <p className="fc-lede">Potatopedia is a neutral, sourced reference. Get your company listed, fix a fact, share your variety data, or reach the industry through labelled placements.</p>
          <p className="fc-trust">We never change a fact because someone paid or asked — corrections are checked against official sources; sponsored placements are always labelled.</p>
        </div>
      </section>

      <section className="fc-sec">
        <div className="fc-wrap fc-cards">
          <article className="fc-card" id="claim">
            <span className="fc-n">01</span>
            <h2 className="fc-h2">Add or claim your company listing — free</h2>
            <p className="fc-s">Processors, seed companies and machinery makers. We verify every listing against your official website before publishing.</p>
            <CompanyForm type="company_claim" fields={CLAIM} submitLabel="Send listing request" />
            <p className="fc-s fc-small">See the <Link href="/companies">company directory</Link>.</p>
          </article>

          <article className="fc-card" id="correct">
            <span className="fc-n">02</span>
            <h2 className="fc-h2">Correct our data</h2>
            <p className="fc-s">Found something wrong on any page? Tell us what and send the official source. We check it and fix it if the source confirms it.</p>
            <CompanyForm type="data_correction" fields={CORRECT} submitLabel="Send correction" />
          </article>

          <article className="fc-card" id="datasheets">
            <span className="fc-n">03</span>
            <h2 className="fc-h2">Submit variety datasheets &amp; photos (breeders)</h2>
            <p className="fc-s">Share official datasheets and press photos for your varieties. Photos are credited to you.</p>
            <CompanyForm type="datasheet_submission" fields={DATASHEET} submitLabel="Send for review" />
          </article>

          <article className="fc-card" id="advertise">
            <span className="fc-n">04</span>
            <h2 className="fc-h2">Advertise</h2>
            <p className="fc-s">Featured makers, breeder variety sets, owned questions, partner articles and newsletter slots. Prices in US dollars; every placement is labelled and never changes a fact.</p>
            <div className="fc-links">
              <Link href="/advertise" className="fc-btn fc-btn-a">See placements and rates</Link>
              <a href="/potatopedia-media-kit.pdf" className="fc-btn fc-btn-ghost">Media kit (PDF)</a>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

const CSS = `
.fc { --ink:#16140F; --mute:#5E584D; --gold:#9A7238; --line:#E6DCCB; font-family: var(--hp-sans), system-ui, sans-serif; background:#FBF8F2; color: var(--ink); overflow-x: hidden; }
.fc a { color: var(--gold); }
.fc-wrap { max-width: 1160px; margin: 0 auto; padding: 0 32px; box-sizing: border-box; }
.fc-hero { position: relative; overflow: hidden; background:#0A0A0D; color:#F4F1EC; padding: 88px 0 72px; }
.fc-glow { position: absolute; left: 50%; top: -260px; width: 1100px; height: 700px; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(214,168,91,.22), transparent 70%); pointer-events: none; }
.fc-hero .fc-wrap { position: relative; }
.fc-eyebrow { margin: 0 0 20px; font-size: 12.5px; letter-spacing: .22em; text-transform: uppercase; color: #E2C08D; }
.fc-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(40px, 6vw, 78px); line-height: 1; letter-spacing: -.02em; max-width: 900px; }
.fc-h1 em { color: #E2C08D; }
.fc-lede { margin: 24px 0 0; max-width: 640px; font-size: 18px; line-height: 1.65; color: #B7B2AA; font-weight: 300; }
.fc-trust { margin: 24px 0 0; max-width: 680px; padding-left: 16px; border-left: 2px solid #E2C08D; font-size: 15px; line-height: 1.6; color: #E8E2D8; }
.fc-sec { padding: 56px 0 72px; }
.fc-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); gap: 20px; }
.fc-card { background:#FFFFFF; border: 1px solid var(--line); border-radius: 18px; padding: 28px; scroll-margin-top: 90px; min-width: 0; }
.fc-n { font-family: var(--hp-serif), Georgia, serif; font-size: 20px; color: #B79A6B; }
.fc-h2 { margin: 8px 0 8px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 30px; line-height: 1.1; }
.fc-s { margin: 0 0 18px; font-size: 15px; line-height: 1.6; color: var(--mute); }
.fc-small { margin: 14px 0 0; font-size: 13.5px; }
.fc-form { display: grid; gap: 14px; position: relative; }
.fc-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.fc-wide { grid-column: 1 / -1; }
.fc-l { display: block; margin-bottom: 6px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.fc-i { width: 100%; box-sizing: border-box; padding: 12px 14px; font: inherit; font-size: 15px; border: 1px solid var(--line); border-radius: 10px; background:#FBF8F2; color: var(--ink); resize: vertical; }
.fc-check { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: var(--ink); }
.fc-check input { margin-top: 3px; }
.fc-err { margin: 0; font-size: 14px; color: #C62828; }
.fc-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 13px; color: var(--mute); }
.fc-btn { display: inline-block; border: 0; cursor: pointer; background: var(--ink); color:#FBF8F2 !important; text-decoration: none; font: inherit; font-weight: 500; padding: 13px 22px; border-radius: 999px; }
.fc-btn:disabled { opacity: .7; cursor: wait; }
.fc-btn-ghost { background: transparent; color: var(--ink) !important; border: 1px solid var(--ink); }
.fc-links { display: flex; flex-wrap: wrap; gap: 12px; }
.fc-done { display: grid; gap: 6px; padding: 18px; border: 1px solid var(--line); border-radius: 14px; background:#FBF8F2; font-size: 14.5px; color: var(--mute); }
.fc-done strong { color: var(--ink); font-size: 16px; }
@media (max-width: 560px) { .fc-cards { grid-template-columns: minmax(0, 1fr); } .fc-grid { grid-template-columns: minmax(0, 1fr); } .fc-wrap { padding: 0 16px; } .fc-hero { padding: 56px 0 48px; } .fc-card { padding: 20px; } }
`;
