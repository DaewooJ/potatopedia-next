import { ppCSS } from "../../lib/styles";
import AboutStats from "../../components/AboutStats";
import { getSiteStats, fmt } from "../../lib/site-stats";
import { UPDATED_SHORT } from "../../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, POTATOPEDIA_WEBSITE } from "../../lib/authors";

export async function generateMetadata() {
  const st = await getSiteStats();
  return {
  title: "About Potatopedia",
  description: `The sourced potato reference: ${fmt(st.dataPoints)}+ data points from FAOSTAT, USDA, CIP, Europatat and ${st.sources} sources, covering 99 producing countries, ${st.varieties} varieties, and the entire potato value chain.`,
  alternates: { canonical: "https://www.potatopedia.com/about" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/about",
    title: "About Potatopedia — The World's AI-Powered Potato Knowledge Base",
    description: `${fmt(st.dataPoints)} data points covering 99 producing countries, sourced from FAOSTAT, USDA, CIP, Europatat, peer-reviewed journals, and ${st.sources} authoritative sources.`,
  },
  };
}

const buildFaqs = (st) => [
  { q: "What is Potatopedia?", a: `Potatopedia is the sourced potato reference. We gather, check and organise data from ${st.sources} authoritative sources — FAOSTAT, USDA, CIP, ICAR-CPRI, peer-reviewed journals, and government agencies — into ${fmt(st.dataPoints)} searchable data points covering 99 producing countries, ${st.varieties} varieties, and the complete potato value chain.` },
  { q: "Where does the data come from?", a: "Primary sources only: FAOSTAT (UN FAO), USDA NASS/ERS, CIP (International Potato Center, Lima), ICAR-CPRI (India), CAAS (China), UN Comtrade, Eurostat, AHDB Potatoes (UK), PMC/PubMed, and dozens of national agriculture ministries. We exclude crowd-sourced encyclopaedias, news aggregators, and sources whose methodology can't be inspected." },
  { q: "How accurate is the data?", a: "Every data point traces to a primary or peer-reviewed source. The backend tracks source provenance for each fact, and the AI Q&A interface returns citations with every answer." },
  { q: "Is Potatopedia free to use?", a: "Yes — free, with no paywall or subscription. Any sponsored placement is clearly labelled and never mixed into the sourced data. The mission is to make potato intelligence accessible to researchers, growers, traders, policymakers, and students worldwide." },
  { q: "Can I contribute data?", a: "Yes. We welcome contributions from researchers, breeders, agricultural extension specialists, and industry professionals. Email hello@potatopedia.com with the data, source, and methodology, and we'll work with you to verify and integrate it." },
  { q: "Who built Potatopedia?", a: "A small team of agricultural data professionals and potato-industry specialists with experience across Germany, the Netherlands, France, Canada, India, China, and South Africa." },
];

const sources = [
  { name: "FAOSTAT", org: "UN Food & Agriculture Organization", desc: "Global production, trade and food balance data.", tag: "Primary" },
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
  if (tag === "Primary") return { bg: "rgba(154,114,56,0.08)", color: "var(--gold)" };
  if (tag === "Trade") return { bg: "rgba(21,101,192,0.08)", color: "#1565C0" };
  if (tag === "Research") return { bg: "rgba(154,114,56,0.08)", color: "var(--gold)" };
  if (tag === "Regional") return { bg: "rgba(239,108,0,0.08)", color: "#EF6C00" };
  return { bg: "rgba(69,90,100,0.08)", color: "#455A64" };
}

// Full @graph: Organization + WebSite + Person (operator + editorial team) + AboutPage + FAQPage
const buildJsonLd = (faqs) => ({
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
});

export default async function AboutPage() {
  const st = await getSiteStats();
  const faqs = buildFaqs(st);
  const aboutJsonLd = buildJsonLd(faqs);
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
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(154,114,56,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 20 }}>About Potatopedia</span>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "var(--ink)", letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            The World&apos;s AI-Powered<br />
            <span style={{ background: "var(--accent-bg)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Potato Knowledge Base</span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--mute)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 12px" }}>
            Powered by AI with human-curated data from FAOSTAT, USDA, CIP, ICAR-CPRI, and official government agencies — the verified, citable source of truth for the global potato industry. Free, with no paywalls.
          </p>
          <p style={{ fontSize: 12, color: "var(--mute2)", margin: 0 }}>Last reviewed {UPDATED_SHORT} · Reviewed by Potatopedia editorial team</p>
        </div>
      </section>

      {/* Stats (client island) */}
      <AboutStats dataPoints={fmt(st.dataPoints)} sources={String(st.sources)} />

      {/* Mission */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>Our Mission</span>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, lineHeight: 1.2, marginBottom: 20 }}>
          Potato Intelligence, Verified and Citable
        </h2>
        <p style={{ fontSize: 15, color: "var(--mute)", lineHeight: 1.7, maxWidth: 640, margin: "0 auto" }}>
          Potato data is scattered across UN agencies, national research institutes, breeder datasheets, and trade associations — finding a reliable answer usually means hours of searching PDFs and statistical portals, with no guarantee it's citable. Potatopedia changes that: we aggregate, verify, and organise data from {st.sources} authoritative sources, then make it instantly searchable with AI, with citations on every answer. Built for growers, traders, researchers, policymakers, and anyone who needs an answer they can stand behind — free, no paywall; any sponsored placement is clearly labelled.
        </p>
      </section>

      {/* Data Sources */}
      <section style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>{st.sources} Authoritative Sources</span>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, marginBottom: 14 }}>Where Our Data Comes From</h2>
          <p style={{ fontSize: 14, color: "var(--mute)", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 36px" }}>
            Primary sources only. Nine representative source families below; the full back-end indexes {st.sources} unique upstream sources.
          </p>
          <div className="pp-about-3col" style={{ display: "grid", gap: 16 }}>
            {sources.map((s, i) => {
              const tc = tagColor(s.tag);
              return (
                <div key={i} style={{ padding: 20, borderRadius: 12, border: "1px solid var(--line)", background: "var(--card)", textAlign: "left" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "var(--mute2)", marginBottom: 8 }}>{s.org}</div>
                  <div style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.5, marginBottom: 12 }}>{s.desc}</div>
                  <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 10, background: tc.bg, color: tc.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.tag}</span>
                </div>
              );
            })}
          </div>

          {/* Verification standard */}
          <div style={{ marginTop: 36, padding: "20px 24px", borderRadius: 12, border: "1px solid rgba(154,114,56,0.15)", background: "rgba(154,114,56,0.03)", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Our verification standard</div>
            <p style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.7, margin: 0 }}>
              Every data point must trace back to original methodology, primary research, or an official statistical agency. We exclude crowd-sourced encyclopaedias, news aggregators, scraped commercial databases, third-party data resellers, and content farms &mdash; any source where the underlying methodology can&apos;t be inspected. If we can&apos;t cite where a number came from and how it was measured, it doesn&apos;t enter our knowledge base.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>FAQ</span>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, marginBottom: 40 }}>Frequently Asked Questions</h2>
        <div className="pp-about-faq-grid" style={{ display: "grid", gap: 16, textAlign: "left" }}>
          {faqs.map((f, i) => (
            <details key={i} style={{ padding: 20, borderRadius: 12, border: "1px solid var(--line)", background: "var(--card)" }}>
              <summary style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", cursor: "pointer", listStyle: "none" }}>
                {f.q}
              </summary>
              <p style={{ fontSize: 14, color: "var(--mute)", lineHeight: 1.7, marginTop: 12 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact / Contribute CTA */}
      <section style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.8, marginBottom: 12 }}>Get in Touch</h2>
        <p style={{ fontSize: 15, color: "var(--mute)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 28px" }}>
          Researchers, breeders, agricultural extension specialists, and industry professionals: we welcome data contributions, partnership inquiries, and corrections.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          <a href="mailto:hello@potatopedia.com" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "var(--accent-bg)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            hello@potatopedia.com
          </a>
          <a href="/ask" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "var(--card)", color: "var(--ink)", fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid var(--line)" }}>
            Ask the AI &rarr;
          </a>
          <a href="https://www.linkedin.com/company/potatopedia" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "var(--card)", color: "var(--ink)", fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid var(--line)" }}>
            LinkedIn &rarr;
          </a>
        </div>
      </section>
    </>
  );
}
