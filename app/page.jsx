import Link from "next/link";
import { QUICK_FACTS, HOME_AUDIENCES, HOME_SOURCE_FAMILIES, BLOG_POSTS, UPDATED_LONG } from "../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE } from "../lib/authors";
import { ppCSS } from "../lib/styles";
import HeroSearch from "../components/HeroSearch";
import LiveStats from "../components/LiveStats";
import HomeCountries from "../components/HomeCountries";
import HomeTrending from "../components/HomeTrending";

export const metadata = {
  title: "Potatopedia — The First AI Knowledge Base for the Global Potato Industry",
  description: "Ask anything about the global potato industry. Cited answers from 5,024+ verified data points across 204 countries, 237 varieties, 224+ sources.",
  alternates: { canonical: "https://www.potatopedia.com" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com",
    title: "Potatopedia — The First AI Knowledge Base for the Potato Industry",
    description: "Ask anything in plain English. Cited answers from 5,024 verified data points · 204 countries · 230+ varieties · 224 sources · 5 premium country dossiers with PDFs.",
    images: ["/og-image.png"],
  },
};

const FLAGSHIP_DOSSIERS = [
  { slug: "india", flag: "🇮🇳", name: "India", lede: "59 M tonnes · 75+ Kufri varieties · ICAR-CPRI breeding pipeline · downloadable PDF dossier" },
  { slug: "united-states", flag: "🇺🇸", name: "United States", lede: "19.96 M tonnes · $5.0B value · Idaho 30%, Washington 23% · Lamb Weston / Simplot supply chain" },
  { slug: "netherlands", flag: "🇳🇱", name: "Netherlands", lede: "World's #1 seed-potato exporter · highest yields per hectare on Earth · HZPC, Agrico, NAK system" },
];

const SNAPSHOT = [
  { kpi: "374 M t", label: "Global production (FAOSTAT 2023)", sub: "204 countries · 18.7 M ha harvested" },
  { kpi: "$22.8 B", label: "Annual potato trade (UN Comtrade)", sub: "Belgium #1 fry exporter · NL #1 seed exporter" },
  { kpi: "$80 B+", label: "Processing industry size", sub: "Lamb Weston · McCain · Simplot · Cavendish" },
];

const FEATURED_KNOWLEDGE = [
  { slug: "russet-burbank-history", title: "Russet Burbank: The $4.6B Variety Behind McDonald's Fries", tag: "Varieties" },
  { slug: "global-potato-trade", title: "Global Potato Trade Statistics: $22.8B in Flows", tag: "Trade" },
  { slug: "potatoes-and-heart-health", title: "Are Potatoes Good for Your Heart? Peer-Reviewed Evidence", tag: "Nutrition" },
];

export default function HomePage() {
  const latestPosts = BLOG_POSTS.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1a1a1a", overflowX: "hidden" }}>
      <style>{ppCSS}{`
        .pp-home-source-strip { display: flex; justify-content: center; align-items: center; gap: 18px; flex-wrap: wrap; }
        .pp-home-source-strip span { font-size: 12px; font-weight: 600; color: #555; letter-spacing: 0.3px; }
        .pp-home-source-strip .pp-sep { color: #ddd; font-weight: 300; }
        .pp-home-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .pp-home-grid-6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .pp-home-grid-2 { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 28px; }
        @media (max-width: 768px) {
          .pp-home-grid-3 { grid-template-columns: 1fr !important; gap: 14px !important; }
          .pp-home-grid-6 { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .pp-home-grid-2 { grid-template-columns: 1fr !important; gap: 24px !important; }
          .pp-home-source-strip { gap: 10px !important; }
          .pp-home-source-strip .pp-sep { display: none !important; }
          .pp-home-source-strip span { font-size: 11px !important; }
        }
        @media (max-width: 480px) {
          .pp-home-grid-6 { grid-template-columns: 1fr !important; }
        }
        .pp-home-card { transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; }
        .pp-home-card:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.05); border-color: rgba(198,40,40,0.25); }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: QUICK_FACTS.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }) }} />

      {/* ─── Hero ─── */}
      <section style={{ paddingTop: 80, paddingBottom: 56, textAlign: "center" }}>
        <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ marginBottom: 18, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C62828", display: "inline-block" }}></span>
              First AI Knowledge Base · Potato Industry
            </span>
          </div>
          <h1 className="pp-hero-title" style={{ fontSize: 48, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1, letterSpacing: -1.6, marginBottom: 18, maxWidth: 920, marginLeft: "auto", marginRight: "auto" }}>
            Ask anything about the<br />
            <span style={{ background: "linear-gradient(135deg,#C62828,#8E0000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>global potato industry.</span>
          </h1>
          <p className="pp-hero-sub" style={{ fontSize: 17, color: "#555", fontWeight: 400, maxWidth: 720, margin: "0 auto 14px", lineHeight: 1.6 }}>
            The first AI knowledge base built specifically for the potato industry. Ask in plain English — get cited answers in seconds, drawn from <strong>5,024 verified data points</strong> across <strong>204 countries</strong>, <strong>230+ varieties</strong>, and <strong>224 authoritative sources</strong>.
          </p>
          <p style={{ fontSize: 13, color: "#888", maxWidth: 680, margin: "0 auto 28px", lineHeight: 1.5 }}>
            Every answer cites its source. The only AI built on verified primary data anywhere in the global potato industry.
          </p>
          <HeroSearch />
          <div style={{ marginTop: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Data partners</div>
            <div className="pp-home-source-strip">
              {HOME_SOURCE_FAMILIES.map((s, i) => (
                <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
                  {s}
                  {i < HOME_SOURCE_FAMILIES.length - 1 && <span className="pp-sep">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live Stats ─── */}
      <LiveStats />

      {/* ─── Premium Country Dossiers ─── */}
      <section className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Premium Intelligence Dossiers</span>
            <h2 className="pp-section-title" style={{ fontSize: 30, fontWeight: 700, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2 }}>
              Country reports, with downloadable PDFs.
            </h2>
            <p style={{ fontSize: 14, color: "#666", marginTop: 8, maxWidth: 520, lineHeight: 1.6 }}>
              Five flagship dossiers with full intelligence dashboards, sourced statistics, and PDF exports for internal teams and research workflows.
            </p>
          </div>
          <Link href="/countries" style={{ fontSize: 13, color: "#C62828", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
            All 30 country profiles →
          </Link>
        </div>
        <div className="pp-home-grid-3">
          {FLAGSHIP_DOSSIERS.map((d) => (
            <Link key={d.slug} href={"/country/" + d.slug} className="pp-home-card" style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 14, padding: "24px 22px", textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 28 }}>{d.flag}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, background: "rgba(198,40,40,0.06)", padding: "4px 10px", borderRadius: 12 }}>PDF · DOSSIER</span>
              </div>
              <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", marginBottom: 8, letterSpacing: -0.4 }}>{d.name}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{d.lede}</div>
              <div style={{ fontSize: 13, color: "#C62828", fontWeight: 600, marginTop: 16 }}>Open dossier →</div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 14, textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "#999" }}>Plus premium dossiers for China and Belgium · 25 standard country profiles · </span>
          <Link href="/varieties" style={{ fontSize: 12, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>230+ varieties database →</Link>
        </div>
      </section>

      {/* ─── Industry Snapshot ─── */}
      <section className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 48px 64px" }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Snapshot</span>
          <h2 className="pp-section-title" style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.8 }}>
            The global potato industry, at a glance.
          </h2>
        </div>
        <div className="pp-home-grid-3">
          {SNAPSHOT.map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 14, padding: "22px 22px 20px", borderLeft: "3px solid #C62828" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.05, marginBottom: 6 }}>{s.kpi}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Built For ─── */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Built for</span>
            <h2 className="pp-section-title" style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.8 }}>
              Six audiences. One verified knowledge base.
            </h2>
          </div>
          <div className="pp-home-grid-6">
            {HOME_AUDIENCES.map((a) => (
              <div key={a.label} style={{ background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "18px 18px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>{a.label}</div>
                <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.55 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trending Questions (client island) ─── */}
      <HomeTrending />

      {/* ─── Country Profiles (client island) ─── */}
      <HomeCountries />

      {/* ─── Latest Insights ─── */}
      <section className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 48px" }}>
        <div className="pp-home-grid-2">
          {/* Latest blog posts */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <div>
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 8 }}>Latest analysis</span>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.6 }}>From the blog</h2>
              </div>
              <Link href="/blog" style={{ fontSize: 13, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>All posts →</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {latestPosts.map((p) => (
                <Link key={p.slug} href={"/blog/" + p.slug} className="pp-home-card" style={{ display: "block", background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, fontSize: 11 }}>
                    <span style={{ fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2 }}>{p.category}</span>
                    <span style={{ color: "#bbb" }}>·</span>
                    <span style={{ color: "#999" }}>{p.date}</span>
                    <span style={{ color: "#bbb" }}>·</span>
                    <span style={{ color: "#999" }}>{p.readTime}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.35, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>{p.excerpt}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured knowledge */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <div>
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 8 }}>Reference</span>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.6 }}>Knowledge Hub</h2>
              </div>
              <Link href="/knowledge" style={{ fontSize: 13, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>27 articles →</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FEATURED_KNOWLEDGE.map((k) => (
                <Link key={k.slug} href={"/knowledge/" + k.slug} className="pp-home-card" style={{ display: "block", background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>{k.tag}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.35, marginBottom: 4 }}>{k.title}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>Reference article · with citations</div>
                </Link>
              ))}
              <Link href="/ask" style={{ display: "block", background: "linear-gradient(135deg,#C62828,#8E0000)", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "#fff" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>AI Q&A</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 4 }}>Ask anything across 5,024 data points →</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Cited answers in seconds</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Answers / FAQ ─── */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div className="pp-section" style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Quick answers</span>
            <h2 className="pp-section-title" style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.8 }}>Frequently asked potato questions</h2>
            <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>Verified answers from FAOSTAT, USDA, CIP, and peer-reviewed research.</p>
          </div>
          <div className="pp-faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 880, margin: "0 auto" }}>
            {QUICK_FACTS.map((f, i) => (
              <details key={i} className="pp-faq-toggle" style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid #ececec", background: "#fff" }}>
                <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, cursor: "pointer", listStyle: "none" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4, margin: 0 }}>{f.q}</h3>
                  <span style={{ fontSize: 18, color: "#C62828", flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, marginTop: 12 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Methodology / Closing trust ─── */}
      <section className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 48px 88px", textAlign: "center" }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 10 }}>Methodology</span>
        <h2 className="pp-section-title" style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.8, marginBottom: 14 }}>
          Every data point traces to a verifiable source.
        </h2>
        <p style={{ fontSize: 14.5, color: "#555", lineHeight: 1.7, maxWidth: 660, margin: "0 auto 24px" }}>
          We aggregate from primary statistical agencies, peer-reviewed journals, and authoritative breeding-program archives — and exclude crowd-sourced encyclopaedias, news aggregators, and sources without inspectable methodology. The AI Q&amp;A returns citations on every answer.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/about" style={{ display: "inline-block", padding: "11px 24px", borderRadius: 10, border: "1px solid #C62828", color: "#C62828", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Sources &amp; methodology
          </Link>
          <Link href="/ask" style={{ display: "inline-block", padding: "11px 24px", borderRadius: 10, background: "#C62828", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Ask the AI →
          </Link>
        </div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 22 }}>Last updated {UPDATED_LONG}</div>
      </section>
    </div>
  );
}
