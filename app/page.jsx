import Link from "next/link";
import { QUICK_FACTS, COUNTRIES, BLOG_POSTS, POPULAR_ANSWERS, KNOWLEDGE_TITLES, UPDATED_LONG } from "../lib/data";
import { VARIETIES } from "../lib/varieties-data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_WEBSITE } from "../lib/authors";
import { ppCSS } from "../lib/styles";
import HomeAsk from "../components/HomeAsk";

export const metadata = {
  title: "Potatopedia — The First AI Knowledge Base for the Global Potato Industry",
  description: "Ask anything about the global potato industry. Cited answers from 5,657+ verified data points across 204 countries, 244 varieties, 277+ sources.",
  alternates: { canonical: "https://www.potatopedia.com" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com",
    title: "Potatopedia — The First AI Knowledge Base for the Potato Industry",
    description: "Ask anything in plain English, in any language. Cited answers from 5,657 verified data points · 204 countries · 244 varieties · 277 sources.",
    images: ["/og-image.png"],
  },
};

const LINKS = [
  { href: "/countries", ic: "🌍", label: "Countries", sub: `${COUNTRIES.length} profiles` },
  { href: "/varieties", ic: "🌱", label: "Varieties", sub: `${VARIETIES.length} cultivars` },
  { href: "/knowledge", ic: "📚", label: "Knowledge", sub: `${Object.keys(KNOWLEDGE_TITLES).length} articles` },
  { href: "/blog", ic: "📰", label: "Blog", sub: `${BLOG_POSTS.length} stories` },
  { href: "/answers", ic: "💬", label: "Answers", sub: `${POPULAR_ANSWERS.length} Q&A` },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1a1a1a", overflowX: "hidden" }}>
      <style>{ppCSS}{`
        .pp-home-links-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
        @media (max-width: 700px) {
          .pp-home-links-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 460px) {
          .pp-home-links-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .pp-home-link-tile { transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
        .pp-home-link-tile:hover { border-color: #C62828; transform: translateY(-2px); box-shadow: 0 10px 26px rgba(20,20,20,0.05); }
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

      {/* ─── Hero declaration ─── */}
      <section style={{ textAlign: "center", padding: "76px 0 16px" }}>
        <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C62828", display: "inline-block" }}></span>
            First AI Knowledge Base · Potato Industry
          </span>
          <h1 className="pp-hero-title" style={{ fontSize: 40, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.16, letterSpacing: -1.2, marginBottom: 22, maxWidth: 700, marginLeft: "auto", marginRight: "auto", textWrap: "balance" }}>
            Ask anything about the{" "}
            <span style={{ background: "linear-gradient(135deg,#C62828,#8E0000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>global potato industry</span>
            {" "}— in any language.
          </h1>
          <p style={{ fontSize: 16, color: "#555", fontWeight: 400, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Production, varieties, trade, processing, nutrition — cited answers in seconds, then keep asking.
          </p>
          <p style={{ fontSize: 12.5, color: "#8A8F98", maxWidth: 520, margin: "16px auto 0" }}>
            5,657 verified data points · 277 sources · every answer cites where it came from.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", margin: "26px auto 0" }}>
            {[
              "👨‍🌾 Growers & farm operators",
              "📈 Traders & buyers",
              "🔬 Researchers",
              `Used across ${COUNTRIES.length} countries`,
            ].map((t) => (
              <span key={t} style={{ fontSize: 11.5, fontWeight: 600, color: "#4B5563", background: "rgba(198,40,40,0.06)", border: "1px solid rgba(198,40,40,0.1)", padding: "5px 12px", borderRadius: 20 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ask (client island) ─── */}
      <HomeAsk />

      {/* ─── Slim link strip ─── */}
      <section style={{ padding: "44px 0 88px", borderTop: "1px solid #ECECEC" }}>
        <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#8A8F98", textAlign: "center", display: "block", marginBottom: 22 }}>Or browse directly</span>
          <div className="pp-home-links-grid">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="pp-home-link-tile" style={{ background: "#fff", border: "1px solid #ECECEC", borderRadius: 12, padding: "20px 12px", textAlign: "center", textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{l.ic}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{l.label}</div>
                <div style={{ fontSize: 11, color: "#8A8F98" }}>{l.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Support ─── */}
      <section style={{ borderTop: "1px solid #ECECEC", padding: "44px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#C62828" }}>Free &amp; independent</span>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "8px 0 8px", letterSpacing: -0.4 }}>Help keep Potatopedia free</h2>
          <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6, margin: "0 0 20px" }}>
            No paywall, no ads — just verified data. If a page here saved you time, a small contribution helps cover hosting and keeps it growing.
          </p>
          <Link href="/support" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 26px", borderRadius: 10, background: "linear-gradient(135deg,#C62828,#E53935)", color: "#fff", textDecoration: "none", fontSize: 13.5, fontWeight: 700 }}>
            ♥ Support Us
          </Link>
        </div>
      </section>

      <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", paddingBottom: 32 }}>Last updated {UPDATED_LONG}</div>
    </div>
  );
}
