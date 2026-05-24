import { ppCSS } from "../../lib/styles";
import AboutStats from "../../components/AboutStats";
import { UPDATED_SHORT } from "../../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, POTATOPEDIA_WEBSITE } from "../../lib/authors";

export const metadata = {
  title: "About Potatopedia",
  description: "The world's AI-powered potato knowledge base. 5,024+ verified data points from FAOSTAT, USDA, CIP, ICAR-CPRI, and 224 authoritative sources covering 204 countries, 237 varieties, and the entire potato value chain.",
  alternates: { canonical: "https://www.potatopedia.com/about" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/about",
    title: "About Potatopedia — The World's AI-Powered Potato Knowledge Base",
    description: "5,024 verified data points across 204 countries, sourced from FAOSTAT, USDA, CIP, ICAR-CPRI, peer-reviewed journals, and 224 authoritative sources.",
  },
};

// Full @graph: Organization + WebSite + Person (operator + editorial team) + AboutPage
// Replaces the previous single-block Organization schema that referenced indianpotato.com
// (banned source) in sameAs. All entities cross-link via @id for AI engine entity-graph
// recognition.
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
  ],
};

const sources = [
  { name: "FAOSTAT", org: "UN Food & Agriculture Organization", desc: "Global production, trade, and food balance data for 204 countries and 60+ years.", tag: "Primary" },
  { name: "USDA NASS & ERS", org: "U.S. Department of Agriculture", desc: "U.S. acreage, yield, pricing, storage, and Census of Agriculture data.", tag: "Primary" },
  { name: "CIP", org: "International Potato Center, Lima", desc: "Variety breeding, developing-world potato science, and post-harvest research.", tag: "Primary" },
  { name: "ICAR-CPRI", org: "Central Potato Research Institute, Shimla", desc: "Indian Kufri varieties, sub-tropical agronomy, and CPRI Frysona / Chipsona breeding.", tag: "Primary" },
  { name: "CAAS", org: "Chinese Academy of Agricultural Sciences", desc: "China potato research, yield improvement, and Asia-Pacific variety data.", tag: "Primary" },
  { name: "UN Comtrade", org: "United Nations Statistics Division", desc: "International trade flows, import/export volumes, and HS-code level statistics.", tag: "Trade" },
  { name: "Eurostat", org: "European Statistical Office", desc: "EU-27 production, prices, trade, and per-capita consumption.", tag: "Regional" },
  { name: "AHDB Potatoes", org: "UK Agriculture & Horticulture Development Board", desc: "UK variety register, market intelligence, and seed-potato statistics.", tag: "Regional" },
  { name: "PMC / PubMed", org: "NIH National Library of Medicine", desc: "Peer-reviewed research on disease, nutrition, glycemic response, and breeding.", tag: "Research" },
  { name: "Springer / Nature", org: "Academic publishers", desc: "Plant Pathology, Potato Research, Crop Science, AJCN, BMJ, and other journals.", tag: "Research" },
  { name: "World Bank WITS", org: "World Bank", desc: "Trade indicators, tariff data, and developing-economy market access.", tag: "Trade" },
  { name: "Government Agencies", org: "Various national ministries", desc: "Statistics Canada, Defra, NL CBS, BMEL Germany, and dozens more.", tag: "Official" },
];

const domains = [
  { icon: "\u{1F30D}", title: "Production Data", desc: "Acreage, yield, and harvest volumes for 204 countries from FAOSTAT, USDA, Eurostat — 60+ years of historical data." },
  { icon: "\u{1F4B9}", title: "Trade & Markets", desc: "Import / export volumes, price flows, and tariff data from UN Comtrade and World Bank WITS — the $50B+ global potato trade." },
  { icon: "\u{1F954}", title: "Variety Knowledge", desc: "146+ varieties documented — Russet Burbank, Yukon Gold, Kufri lines, Andean landraces, Dutch breeding-program output." },
  { icon: "\u{1F331}", title: "Cultivation & Agronomy", desc: "Soil prep, planting, hilling, irrigation, harvest timing, post-harvest curing — the complete grower lifecycle." },
  { icon: "\u{1F52C}", title: "Diseases & IPM", desc: "Late blight, early blight, viruses, nematodes, scab, Rhizoctonia — with integrated pest management strategies." },
  { icon: "\u{1F3ED}", title: "Processing Industry", desc: "Lamb Weston, McCain, Simplot, and the $80B processing industry — fries, chips, starch, dehydrates." },
  { icon: "\u{1F37D}️", title: "Nutrition & Health", desc: "Macro/micro profile, glycemic response, resistant starch, kidney/heart-disease context — USDA FoodData Central + peer-reviewed studies." },
  { icon: "❄️", title: "Storage & Cold Chain", desc: "Cold-store technology, sprout suppression, cold-induced sweetening, the global seed-potato system." },
  { icon: "\u{1F30D}", title: "Country Profiles", desc: "30 country profiles, with 5 premium intelligence dossiers (India, China, Belgium, Netherlands, USA) including downloadable PDFs." },
];

const faqs = [
  { q: "What is Potatopedia?", a: "Potatopedia is the world's first AI-powered potato knowledge base. We aggregate, verify, and organise data from 224 authoritative sources — FAOSTAT, USDA, CIP, ICAR-CPRI, peer-reviewed journals, and government agencies — into 5,024 searchable data points covering 204 countries, 146 varieties, and the complete potato value chain." },
  { q: "Who built Potatopedia?", a: "Potatopedia was built by a small team of agricultural data professionals and potato-industry specialists with experience across Germany, the Netherlands, France, Canada, India, China, and South Africa. The platform sits alongside our sister site indianpotato.com, which focuses on Indian-market intelligence." },
  { q: "Where does the data come from?", a: "Primary sources: FAOSTAT (UN FAO), USDA NASS / ERS, CIP (International Potato Center, Lima), ICAR-CPRI (India), CAAS (China), UN Comtrade, Eurostat, AHDB Potatoes (UK), PMC / PubMed, Springer / Nature peer-reviewed journals, World Bank WITS, and dozens of national agriculture ministries. We exclude crowd-sourced encyclopaedias, news aggregators, scraped commercial databases, third-party data resellers, and content farms — any source where original methodology can't be inspected." },
  { q: "How accurate is the data?", a: "Every data point traces to a primary or peer-reviewed source. The backend tracks source provenance for each fact, and the AI Q&A interface returns citations with every answer. We reject sources that don't meet a verification standard — including major aggregators that cannot be traced to original methodology." },
  { q: "Can I ask questions in natural language?", a: "Yes. The /ask page (and search across the site) routes to our AI Q&A engine, which retrieves from the verified knowledge base and returns cited answers in seconds. The engine handles questions in plain English about production, varieties, trade, cultivation, nutrition, processing — with source attribution." },
  { q: "How many country profiles are there?", a: "30 country profile pages, with 5 premium intelligence dossiers (India, China, Belgium, Netherlands, United States) that include detailed dashboards, sourced statistics, and downloadable PDF reports. The underlying data covers 204 countries via FAOSTAT, USDA, and Eurostat." },
  { q: "Is Potatopedia free to use?", a: "Yes — Potatopedia is completely free with no paywalls or subscriptions. The mission is to make potato intelligence accessible to researchers, growers, traders, policymakers, and students worldwide." },
  { q: "Can I contribute data?", a: "Yes. We welcome contributions from researchers, breeders, agricultural extension specialists, and industry professionals. Email hello@potatopedia.com with the data, source, and methodology, and we'll work with you to verify and integrate it." },
  { q: "What audiences is Potatopedia built for?", a: "Five primary audiences: (1) growers and farm operators looking up agronomy and variety data, (2) traders and commodity buyers tracking import/export flows, (3) researchers and breeders accessing peer-reviewed data, (4) policymakers and trade associations needing verified statistics, and (5) students, journalists, and curious citizens wanting authoritative answers." },
  { q: "What about the PDF country reports?", a: "The 5 premium country dossiers (India, China, Belgium, Netherlands, USA) each include a downloadable PDF with the full intelligence dashboard, sourced statistics, variety lists, trade tables, and methodology notes. The PDFs are formatted for sharing with internal teams or filing in research workflows." },
];

const missionCards = [
  { icon: "\u{1F3AF}", title: "Verified Only", desc: "Every data point traces to a primary or peer-reviewed source. Crowd-sourced and methodologically opaque sources excluded." },
  { icon: "⚡", title: "Instant AI Answers", desc: "Natural-language search delivers cited answers in seconds, drawing from 5,024 verified data points." },
  { icon: "\u{1F30D}", title: "Global Coverage", desc: "204 countries with FAOSTAT-grade data; 30 country profiles; 5 premium downloadable PDF dossiers." },
  { icon: "\u{1F513}", title: "Free & Open", desc: "No paywalls, no subscriptions, no advertising. Potato intelligence as a public good." },
];

const audienceCards = [
  { icon: "\u{1F33E}", title: "Growers & Operators", desc: "Variety selection, agronomy, yield benchmarks, harvest and storage protocols, disease management." },
  { icon: "\u{1F4C8}", title: "Traders & Buyers", desc: "Import/export flows, country production profiles, processing industry intelligence, trade-policy context." },
  { icon: "\u{1F52C}", title: "Researchers & Breeders", desc: "Peer-reviewed citations, variety descriptors, trial data, breeding-program output across 30+ countries." },
  { icon: "\u{1F3DB}️", title: "Policymakers & Associations", desc: "FAOSTAT-grade statistics, country dossiers, trade flows for policy briefs and regulatory submissions." },
  { icon: "\u{1F393}", title: "Students & Journalists", desc: "Authoritative answers with citations — for theses, articles, classroom material, and primary research." },
  { icon: "\u{1F468}‍\u{1F373}", title: "Consumers & Cooks", desc: "Nutrition facts, glycemic response, variety differences, kidney/heart-health context — with peer-reviewed evidence." },
];

function tagColor(tag) {
  if (tag === "Primary") return { bg: "rgba(198,40,40,0.08)", color: "#C62828" };
  if (tag === "Trade") return { bg: "rgba(21,101,192,0.08)", color: "#1565C0" };
  if (tag === "Research") return { bg: "rgba(46,125,50,0.08)", color: "#2E7D32" };
  if (tag === "Regional") return { bg: "rgba(239,108,0,0.08)", color: "#EF6C00" };
  return { bg: "rgba(69,90,100,0.08)", color: "#455A64" };
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <style>{ppCSS}{`
        .pp-about-grid { grid-template-columns: 1fr 1fr; }
        .pp-about-faq-grid { grid-template-columns: 1fr 1fr; }
        .pp-about-stats { grid-template-columns: repeat(4,1fr); }
        .pp-about-3col { grid-template-columns: repeat(3,1fr); }
        .pp-about-2col-mission { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .pp-about-grid { grid-template-columns: 1fr !important; }
          .pp-about-stats { grid-template-columns: repeat(2,1fr) !important; }
          .pp-about-faq-grid { grid-template-columns: 1fr !important; }
          .pp-about-3col { grid-template-columns: 1fr !important; }
          .pp-about-2col-mission { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ paddingTop: 72, paddingBottom: 40, textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 20 }}>About Potatopedia</span>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            The World&apos;s AI-Powered<br />
            <span style={{ background: "linear-gradient(135deg,#C62828,#E53935)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Potato Knowledge Base</span>
          </h1>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 12px" }}>
            <strong>5,024 verified data points. 224 authoritative sources. 204 countries. 146 varieties.</strong>
          </p>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 12px" }}>
            Powered by AI with human-curated data from FAOSTAT, USDA, CIP, ICAR-CPRI, CAAS, Eurostat, peer-reviewed journals, and official government agencies. The verified, citable, single source of truth for the global potato industry.
          </p>
          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Last reviewed {UPDATED_SHORT} · Reviewed by Potatopedia editorial team</p>
        </div>
      </section>

      {/* Stats (client island) */}
      <AboutStats />

      {/* Mission */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px" }}>
        <div className="pp-about-2col-mission" style={{ display: "grid", gap: 48 }}>
          <div>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>Our Mission</span>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 20 }}>
              Potato Intelligence,<br />Verified and Citable
            </h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 16 }}>
              Potato data is scattered across UN agencies, national research institutes, breeder datasheets, peer-reviewed journals, and trade associations. Finding reliable answers means hours of searching PDFs, statistical portals, and academic databases &mdash; with no guarantee the result will be citable.
            </p>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7 }}>
              Potatopedia changes that. We aggregate, verify, and organise data from 224 authoritative sources, then make it instantly searchable with AI &mdash; with citations on every answer. Built for growers, traders, researchers, policymakers, and anyone who needs answers they can stand behind.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {missionCards.map((c, i) => (
              <div key={i} style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>224 Authoritative Sources</span>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, marginBottom: 14 }}>Where Our Data Comes From</h2>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 36px" }}>
            Primary sources only. Twelve representative source families below; the full back-end indexes 224 unique upstream sources.
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

      {/* Knowledge Coverage */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>What Potatopedia Knows</span>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, marginBottom: 14 }}>Coverage Across the Value Chain</h2>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 36px" }}>
          Nine core domains, organised for fast retrieval through the AI Q&amp;A interface or direct browsing of country profiles, knowledge articles, and answers pages.
        </p>
        <div className="pp-about-3col" style={{ display: "grid", gap: 16 }}>
          {domains.map((d, i) => (
            <div key={i} style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff", textAlign: "left" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{d.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{d.title}</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Audiences */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>Built For</span>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, marginBottom: 36 }}>Six Audiences, One Knowledge Base</h2>
          <div className="pp-about-3col" style={{ display: "grid", gap: 16 }}>
            {audienceCards.map((a, i) => (
              <div key={i} style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff", textAlign: "left" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Content */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>Start Here</span>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, marginBottom: 36 }}>Flagship Content</h2>
        <div className="pp-about-3col" style={{ display: "grid", gap: 16, textAlign: "left" }}>
          <a href="/country/india" style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff", textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Premium Dossier</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>India Country Intelligence Dossier</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>59 M tonnes production, 75+ Kufri varieties, ICAR-CPRI breeding history, downloadable PDF report.</div>
          </a>
          <a href="/country/united-states" style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff", textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Premium Dossier</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>USA Country Intelligence Dossier</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>19.96 M t · $5.0B value · Idaho 30% / Washington 23% · McDonald&apos;s &amp; Lamb Weston supply chain · PDF report.</div>
          </a>
          <a href="/country/netherlands" style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff", textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Premium Dossier</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Netherlands Dossier</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>The world&apos;s #1 seed-potato exporter and highest yields per hectare on Earth. PDF available.</div>
          </a>
          <a href="/knowledge/potato-varieties-guide" style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff", textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Knowledge Article</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Complete Potato Varieties Guide</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>Russet Burbank, Yukon Gold, Kufri, Andean landraces &mdash; 50+ varieties profiled in depth.</div>
          </a>
          <a href="/knowledge/global-potato-trade" style={{ padding: 20, borderRadius: 12, border: "1px solid #f0f0f0", background: "#fff", textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Knowledge Article</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Global Potato Trade Statistics</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>Who exports? Who imports? $50B+ trade flows from UN Comtrade and World Bank WITS data.</div>
          </a>
          <a href="/ask" style={{ padding: 20, borderRadius: 12, border: "1px solid #C62828", background: "linear-gradient(135deg,#C62828,#E53935)", textDecoration: "none", color: "#fff", display: "block" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>AI Q&amp;A Interface</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Ask Anything &rarr;</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>Natural-language search across 5,024 verified data points. Cited answers in seconds.</div>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
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
        </div>
      </section>

      {/* Contact / Contribute CTA */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.8, marginBottom: 12 }}>Get in Touch</h2>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 28px" }}>
          Researchers, breeders, agricultural extension specialists, and industry professionals: we welcome data contributions, partnership inquiries, and corrections. Email us with the source and methodology, and we&apos;ll work with you to verify and integrate.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          <a href="mailto:hello@potatopedia.com" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "#C62828", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            hello@potatopedia.com
          </a>
          <a href="https://www.linkedin.com/company/potatopedia" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "#fff", color: "#1A1A1A", fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid #ddd" }}>
            LinkedIn &rarr;
          </a>
        </div>
        <div style={{ fontSize: 13, color: "#999", lineHeight: 1.7 }}>
          Sister site for Indian-market potato intelligence: <a href="https://www.indianpotato.com" target="_blank" rel="noopener noreferrer" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>indianpotato.com</a>
        </div>
      </section>

      {/* Vision CTA */}
      <section style={{ background: "linear-gradient(135deg,#C62828,#E53935)", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 12 }}>The Verified Source for Potato Intelligence</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 28px" }}>
          5,024 data points. 224 sources. 204 countries. 146 varieties. Cited answers in seconds.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/ask" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "#fff", color: "#C62828", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Ask the AI &rarr;
          </a>
          <a href="/countries" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "transparent", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.5)" }}>
            Explore Country Profiles
          </a>
        </div>
      </section>
    </>
  );
}
