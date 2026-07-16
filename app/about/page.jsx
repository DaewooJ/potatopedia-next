import { ppCSS } from "../../lib/styles";
import AboutStats from "../../components/AboutStats";
import { UPDATED_SHORT } from "../../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, POTATOPEDIA_WEBSITE } from "../../lib/authors";

export const metadata = {
  title: "About Potatopedia",
  description: "The world's AI-powered potato knowledge base. 5,657+ verified data points from FAOSTAT, USDA, CIP, ICAR-CPRI, and 277 authoritative sources covering 204 countries, 244 varieties, and the entire potato value chain.",
  alternates: { canonical: "https://www.potatopedia.com/about" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/about",
    title: "About Potatopedia — The World's AI-Powered Potato Knowledge Base",
    description: "5,657 verified data points across 204 countries, sourced from FAOSTAT, USDA, CIP, ICAR-CPRI, peer-reviewed journals, and 277 authoritative sources.",
  },
};

const faqs = [
  { q: "What is Potatopedia?", a: "Potatopedia is the world's first AI-powered potato knowledge base. We aggregate, verify, and organise data from 277 authoritative sources — FAOSTAT, USDA, CIP, ICAR-CPRI, peer-reviewed journals, and government agencies — into 5,657 searchable data points covering 204 countries, 244 varieties, and the complete potato value chain." },
  { q: "Where does the data come from?", a: "Primary sources only: FAOSTAT (UN FAO), USDA NASS/ERS, CIP (International Potato Center, Lima), ICAR-CPRI (India), CAAS (China), UN Comtrade, Eurostat, AHDB Potatoes (UK), PMC/PubMed, and dozens of national agriculture ministries. We exclude crowd-sourced encyclopaedias, news aggregators, and sources whose methodology can't be inspected." },
  { q: "How accurate is the data?", a: "Every data point traces to a primary or peer-reviewed source. The backend tracks source provenance for each fact, and the AI Q&A interface returns citations with every answer." },
  { q: "Is Potatopedia free to use?", a: "Yes — completely free, with no paywalls or subscriptions. The mission is to make potato intelligence accessible to researchers, growers, traders, policymakers, and students worldwide." },
  { q: "Can I contribute data?", a: "Yes. We welcome contributions from researchers, breeders, agricultural extension specialists, and industry professionals. Email hello@potatopedia.com with the data, source, and methodology, and we'll work with you to verify and integrate it." },
  { q: "Who built Potatopedia?", a: "A small team of agricultural data professionals and potato-industry specialists with experience across Germany, the Netherlands, France, Canada, India, China, and South Africa." },
];

const sources = [
  { name: "FAOSTAT", org: "UN Food & Agriculture Organization", desc: "Global production, trade, and food balance data for 204 countries.", tag: "Primary" },
  { name: "USDA NASS & ERS", org: "U.S. Department of Agriculture", desc: "U.S. acreage, yield, pricing, and Census of Agriculture data.", tag: "Primary" },
  { name: "CIP", org: "International Potato Center, Lima", desc: "Variety breeding and developing-world potato science.", tag: "Primary" },
  { name: "ICAR-CPRI", org: "Central Potato Research Institute, Shimla", desc: "Indian Kufri varieties and sub-tropical agronomy.", tag: "Primary" },
  { name: "UN Comtrade", org: "United Nations Statistics Division", desc: "International trade flows and HS-code level statistics.", tag: "Trade" },
  { name: "Eurostat", org: "European Statistical Office", desc: "EU-27 production, prices, and per-capita consumption.", tag: "Regional" },
  { name: "AHDB Potatoes", org: "UK Agriculture & Horticulture Board", desc: "UK variety register and seed-potato statistics.", tag: "Regional" },
  { name: "PMC / PubMed", org: "NIH National Library of Medicine", desc: "Peer-reviewed research on disease, nutrition, and breeding.", tag: "Research" },
  { name: "Government Agencies", org: "Various national ministries", desc: "Statistics Canada, Defra, NL CBS, BMEL Germany, and more.", tag: "Official" },
];

function tagColor(tag) {
  if (tag === "Primary") return { bg: "rgba(198,40,40,0.08)", color: "#C62828" };
  if (tag === "Trade") return { bg: "rgba(21,101,192,0.08)", color: "#1565C0" };
  if (tag === "Research") return { bg: "rgba(46,125,50,0.08)", color: "#2E7D32" };
  if (tag === "Regional") return { bg: "rgba(239,108,0,0.08)", color: "#EF6C00" };
  return { bg: "rgba(69,90,100,0.08)", color: "#455A64" };
}

// Full @graph: Organization + WebSite + Person (operator + editorial team) + AboutPage + FAQPage
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    POTATOPEDIA_PUBLISHER,
    POTATOPEDIA_WEBSITE,
    POTATOPEDIA_EDITORIAL,
    {
      "@type": "AboutPage",
      "@id": "https://www.potatopedia.com/about#aboutpage",
      url: "https://www.potatopedia.com/about",
      name: "About Potatopedia",
      isPartOf: { "@id": "https://www.potatopedia.com/#website" },
      about: { "@id": "https://www.potatopedia.com/#publisher" },
      inLanguage: "en",
      description: "Mission, methodology, and source list for Potatopedia — the AI-powered global potato knowledge platform.",
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.potatopedia.com/about#faq",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <style>{ppCSS}{`
        .pp-about-faq-grid { grid-template-columns: 1fr 1fr; }
        .pp-about-stats { grid-template-columns: repeat(4,1fr); }
        .pp-about-3col { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 768px) {
          .pp-about-stats { grid-template-columns: repeat(2,1fr) !important; }
          .pp-about-faq-grid { grid-template-columns: 1fr !important; }
          .pp-about-3col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ paddingTop: 72, paddingBottom: 40, textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 20 }}>About Potatopedia</span>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            The World&apos;s AI-Powered<br />
            <span style={{ background: "linear-gradient(135deg,#C62828,#E53935)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Potato Knowledge Base</span>
          </h1>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 12px" }}>
            Powered by AI with human-curated data from FAOSTAT, USDA, CIP, ICAR-CPRI, and official government agencies — the verified, citable source of truth for the global potato industry. Free, with no paywalls.
          </p>
          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Last reviewed {UPDATED_SHORT} · Reviewed by Potatopedia editorial team</p>
        </div>
      </section>

      {/* Stats (client island) */}
      <AboutStats />

      {/* Mission */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>Our Mission</span>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 20 }}>
          Potato Intelligence, Verified and Citable
        </h2>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, maxWidth: 640, margin: "0 auto" }}>
          Potato data is scattered across UN agencies, national research institutes, breeder datasheets, and trade associations — finding a reliable answer usually means hours of searching PDFs and statistical portals, with no guarantee it's citable. Potatopedia changes that: we aggregate, verify, and organise data from 277 authoritative sources, then make it instantly searchable with AI, with citations on every answer. Built for growers, traders, researchers, policymakers, and anyone who needs an answer they can stand behind — completely free, no paywalls, no ads.
        </p>
      </section>

      {/* Data Sources */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>277 Authoritative Sources</span>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, marginBottom: 14 }}>Where Our Data Comes From</h2>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 36px" }}>
            Primary sources only. Nine representative source families below; the full back-end indexes 277 unique upstream sources.
          </p>
          <div className="pp-about-3col" style={{ display: "grid", gap: 16 }}>
            {sources.map((s, i) => {
              const tc = tagColor(s.tag);
              return (
                <div key={i} style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff", textAlign: "left" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>{s.org}</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 12 }}>{s.desc}</div>
                  <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 10, background: tc.bg, color: tc.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.tag}</span>
                </div>
              );
            })}
          </div>

          {/* Verification standard */}
          <div style={{ marginTop: 36, padding: "20px 24px", borderRadius: 12, border: "1px solid rgba(198,40,40,0.15)", background: "rgba(198,40,40,0.03)", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Our verification standard</div>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>
              Every data point must trace back to original methodology, primary research, or an official statistical agency. We exclude crowd-sourced encyclopaedias, news aggregators, scraped commercial databases, third-party data resellers, and content farms &mdash; any source where the underlying methodology can&apos;t be inspected. If we can&apos;t cite where a number came from and how it was measured, it doesn&apos;t enter our knowledge base.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>FAQ</span>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, marginBottom: 40 }}>Frequently Asked Questions</h2>
        <div className="pp-about-faq-grid" style={{ display: "grid", gap: 16, textAlign: "left" }}>
          {faqs.map((f, i) => (
            <details key={i} style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff" }}>
              <summary style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", cursor: "pointer", listStyle: "none" }}>
                {f.q}
              </summary>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginTop: 12 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact / Contribute CTA */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.8, marginBottom: 12 }}>Get in Touch</h2>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 28px" }}>
          Researchers, breeders, agricultural extension specialists, and industry professionals: we welcome data contributions, partnership inquiries, and corrections.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          <a href="mailto:hello@potatopedia.com" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "#C62828", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            hello@potatopedia.com
          </a>
          <a href="/ask" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "#fff", color: "#1A1A1A", fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid #ddd" }}>
            Ask the AI &rarr;
          </a>
          <a href="https://www.linkedin.com/company/potatopedia" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "#fff", color: "#1A1A1A", fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid #ddd" }}>
            LinkedIn &rarr;
          </a>
        </div>
        <div style={{ fontSize: 13, color: "#999", lineHeight: 1.7 }}>
          Sister site for Indian-market potato intelligence: <a href="https://www.indianpotato.com" target="_blank" rel="noopener noreferrer" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>indianpotato.com</a>
        </div>
      </section>
    </>
  );
}
