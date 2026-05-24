import Link from "next/link";
import { COUNTRIES, UPDATED_SHORT, INDIA_STATES } from "../../../../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, SPEAKABLE } from "../../../../lib/authors";

/* ── Route config ── */

const STATE_SLUGS = INDIA_STATES.map((s) => s.slug);

const STATE_META = {
  "uttar-pradesh": {
    title: "Uttar Pradesh Potato Production: India's #1 Potato State (20.13M Tonnes, 33% of National Output)",
    desc: "Uttar Pradesh produces 20.13M tonnes of potatoes annually — 33.46% of India's national output. Agra leads at 2.8M tonnes. District-wise data, Kufri varieties, cold storage capacity, mandi prices, processors, and government schemes.",
    h1: "Uttar Pradesh Potato Production: India's #1 Potato State",
    tag: "India · Uttar Pradesh",
  },
  "west-bengal": {
    title: "West Bengal Potato Production: Hooghly's Lead in India's #2 Potato State (12M+ Tonnes)",
    desc: "West Bengal produces 11–12M tonnes of potatoes annually — India's 2nd largest. Hooghly contributes ~40% of state output. District data, Kufri Jyoti dominance, 580+ cold storages, MSP procurement, and Kolaghat mandi.",
    h1: "West Bengal Potato Production: Hooghly's Lead in India's #2 Potato State",
    tag: "India · West Bengal",
  },
  "bihar": {
    title: "Bihar Potato Production: Nalanda's Lead in India's #3 Potato State (9.07M Tonnes)",
    desc: "Bihar produces 9.075M tonnes of potatoes — 15.09% of national output. Nalanda-Patna-Vaishali triangle. Birthplace of CPRI (1949). 12 districts have zero cold storage. Districts, varieties, schemes, and challenges.",
    h1: "Bihar Potato Production: Nalanda's Lead in India's #3 Potato State",
    tag: "India · Bihar",
  },
  "gujarat": {
    title: "Gujarat Potato Production: India's #1 Processed-Potato State (4.86M Tonnes, Banaskantha at 1.87M)",
    desc: "Gujarat produces 4.86M tonnes of potatoes — India's 4th in volume but #1 in processing (>25% processed). Banaskantha 1.87M tonnes. HyFun Foods 250K+ t/yr. PepsiCo, McCain, Balaji contracts. Deesa 'Bataka Nagari'.",
    h1: "Gujarat Potato Production: India's #1 Processed-Potato State",
    tag: "India · Gujarat",
  },
  "madhya-pradesh": {
    title: "Madhya Pradesh Potato Production: Malwa's Rising Belt in India's #5 Potato State (3.88M Tonnes)",
    desc: "Madhya Pradesh produces 3.88M tonnes of potatoes — 6.9% of India's output. Indore leads. Malwa Plateau cultivation. Kufri Chandramukhi and chip-suitable Kufri Lavkar dominant. CPRI sowing window Oct 15 – Nov 10.",
    h1: "Madhya Pradesh Potato Production: Malwa's Rising Belt in India's #5 Potato State",
    tag: "India · Madhya Pradesh",
  },
};

export function generateStaticParams() {
  return STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({ params }) {
  const { state } = await params;
  const meta = STATE_META[state];
  if (!meta) return { title: "India State Potato Profile | Potatopedia" };
  const canonical = `https://www.potatopedia.com/country/india/${state}`;
  return {
    title: meta.title,
    description: meta.desc,
    alternates: { canonical },
    openGraph: { type: "article", url: canonical, title: meta.title, description: meta.desc, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.desc },
  };
}

/* ── Shared styles ── */
const sH2 = { fontSize: 22, fontWeight: 700, paddingLeft: 16, borderLeft: "4px solid #C62828", marginTop: 0, marginBottom: 14, color: "#1A1A1A" };
const sP = { fontSize: 15, color: "#444", lineHeight: 1.8, marginBottom: 16 };
const sIntro = { fontSize: 16, color: "#1A1A1A", lineHeight: 1.8, marginBottom: 16, fontWeight: 500 };
const sTh = { padding: "10px 12px", textAlign: "left", background: "#C62828", color: "#fff", fontSize: 13, fontWeight: 700 };
const sTd = { padding: "9px 12px", fontSize: 14, borderBottom: "1px solid #eee" };
const sSource = { fontSize: 12, color: "#999", marginTop: 8, marginBottom: 0, fontStyle: "italic" };
const cardWrap = { background: "#fff", border: "1px solid #ececec", borderRadius: 14, padding: "28px 28px 24px", marginBottom: 20 };

const linkRed = { color: "#C62828", textDecoration: "none", fontWeight: 600 };
const linkPlain = { color: "#C62828", textDecoration: "none" };

/* ── Shared sub-components ── */

function HeroBanner({ children }) {
  return (
    <>
      <style>{`.pp-hero-banner{padding:56px 24px 40px}@media(max-width:768px){.pp-hero-banner{padding:40px 20px 32px!important}}`}</style>
      <div className="pp-hero-banner" style={{ background: "#FAFAFA", position: "relative", overflow: "hidden", borderBottom: "1px solid #f0f0f0", marginBottom: 32, backgroundImage: "repeating-linear-gradient(0deg, rgba(198,40,40,0.04) 0, rgba(198,40,40,0.04) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(198,40,40,0.04) 0, rgba(198,40,40,0.04) 1px, transparent 1px, transparent 60px)" }}>
        <div style={{ position: "absolute", top: 16, right: 24, width: 200, height: 2, background: "linear-gradient(135deg,#C62828,transparent)", borderRadius: 1, zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 880, margin: "0 auto" }}>{children}</div>
      </div>
    </>
  );
}

function Breadcrumb({ stateName }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, flexWrap: "wrap" }}>
      <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
      <span style={{ color: "#ccc" }}>/</span>
      <Link href="/countries" style={{ color: "#888", textDecoration: "none" }}>Countries</Link>
      <span style={{ color: "#ccc" }}>/</span>
      <Link href="/country/india" style={{ color: "#888", textDecoration: "none" }}>India</Link>
      <span style={{ color: "#ccc" }}>/</span>
      <span style={{ color: "#C62828", fontWeight: 700 }}>{stateName}</span>
    </div>
  );
}

function TagBadge({ tag }) {
  return <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, background: "rgba(198,40,40,0.06)", padding: "4px 12px", borderRadius: 10, marginBottom: 16 }}>{tag}</span>;
}

function DefinitiveAnswer({ children }) {
  return (
    <div data-summary="true" style={{ background: "rgba(198,40,40,0.03)", border: "1px solid rgba(198,40,40,0.12)", borderLeft: "4px solid #C62828", borderRadius: "0 12px 12px 0", padding: "24px 28px", marginBottom: 24, fontSize: 16, color: "#333", lineHeight: 1.8 }}>
      {children}
    </div>
  );
}

function KeyStatStrip({ stats }) {
  return (
    <>
      <style>{`.pp-state-stats{display:grid;grid-template-columns:repeat(${stats.length},1fr)}@media(max-width:768px){.pp-state-stats{grid-template-columns:repeat(2,1fr)!important;gap:20px!important;padding:24px 20px!important}}@media(max-width:400px){.pp-state-stats{grid-template-columns:1fr!important}}`}</style>
      <div className="pp-state-stats" style={{ background: "#1A1A1A", borderRadius: 12, padding: "28px 24px", marginBottom: 24, gap: 0 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center", borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none", padding: "0 12px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.accent || "#fff", letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginTop: 8, textTransform: "uppercase", letterSpacing: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function QuickFactsBox({ items }) {
  return (
    <div data-quick-facts="true" style={{ background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Quick Facts</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 18px", fontSize: 13, color: "#333" }}>
        {items.map((it, i) => (
          <li key={i} style={{ lineHeight: 1.5 }}><strong style={{ color: "#1A1A1A" }}>{it.label}:</strong> {it.value}</li>
        ))}
      </ul>
    </div>
  );
}

function StatCallout({ number, unit, context, source }) {
  return (
    <>
      <style>{`.pp-cb{display:flex;gap:20px;align-items:flex-start}.pp-cbm{display:none}@media(max-width:640px){.pp-cb{display:none!important}.pp-cbm{display:block!important}}`}</style>
      <div className="pp-cb" style={{ margin: "24px 0" }}>
        <div style={{ background: "#C62828", borderRadius: 12, padding: "20px 24px", minWidth: 120, textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{number}</div>
          {unit && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4, textTransform: "uppercase" }}>{unit}</div>}
        </div>
        <div style={{ padding: "8px 0", flex: 1 }}>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{context}</div>
          {source && <div style={{ fontSize: 11, color: "#aaa", marginTop: 6, fontStyle: "italic" }}>{source}</div>}
        </div>
      </div>
      <div className="pp-cbm" style={{ margin: "24px 0", borderLeft: "4px solid #C62828", borderRadius: "0 10px 10px 0", background: "#F7F7F7", padding: "18px 20px" }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#C62828", lineHeight: 1 }}>{number}</span>
          {unit && <span style={{ fontSize: 13, fontWeight: 600, color: "#C62828", marginLeft: 4 }}>{unit}</span>}
        </div>
        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{context}</div>
        {source && <div style={{ fontSize: 11, color: "#aaa", marginTop: 6, fontStyle: "italic" }}>{source}</div>}
      </div>
    </>
  );
}

function SourceBlock({ sources }) {
  return (
    <div style={{ padding: "16px 20px", background: "#FAFAFA", borderRadius: 10, marginTop: 32, marginBottom: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Sources</div>
      {sources.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{s}</div>)}
    </div>
  );
}

function FAQSection({ items }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>Frequently Asked Questions</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <details key={i} style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid #f0f0f0", background: "#FAFAFA" }}>
            <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}>{item.q}</span>
              <span style={{ fontSize: 16, color: "#C62828", flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginTop: 12 }}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function RelatedStates({ currentSlug }) {
  const others = INDIA_STATES.filter((s) => s.slug !== currentSlug);
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>Other top potato states in India</h2>
      <div className="pp-related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 12 }}>
        {others.map((s) => (
          <Link key={s.slug} href={`/country/india/${s.slug}`} style={{ background: "#FAFAFA", border: "1px solid #eee", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>#{s.rank} · {s.share} of India</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{s.prod} t · top district {s.topDistrict}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ContinueReading({ articles }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>Continue Reading</h2>
      <div className="pp-related-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {articles.map((a, i) => (
          <Link key={i} href={a.href} style={{ background: "#FAFAFA", border: "1px solid #eee", borderRadius: 12, padding: "16px 18px", textDecoration: "none", color: "inherit", display: "block" }}>
            <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2, background: "rgba(198,40,40,0.06)", padding: "2px 8px", borderRadius: 6, marginBottom: 8 }}>{a.tag}</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4, marginBottom: 4 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{a.desc}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FurtherReading() {
  const groups = [
    {
      title: "India context",
      items: [
        { href: "/country/india", label: "India potato profile" },
        { href: "/answers/india-potato-production", label: "How much potato does India produce?" },
        { href: "/answers/largest-potato-producer-india", label: "Largest potato-producing state in India" },
        { href: "/answers/famous-potato-city-india", label: "Famous potato city in India" },
        { href: "/answers/potatoes-in-china-history", label: "Potatoes in China history" },
        { href: "/blog/india-potato-production-by-state", label: "India potato production by state — story format" },
        { href: "/blog/bangladesh-8th-producer-nobody-knows", label: "Bangladesh: 8th-largest potato producer" },
      ],
    },
    {
      title: "Varieties (Kufri)",
      items: [
        { href: "/varieties/kufri-jyoti", label: "Kufri Jyoti" },
        { href: "/varieties/kufri-bahar", label: "Kufri Bahar" },
        { href: "/varieties/kufri-pukhraj", label: "Kufri Pukhraj" },
        { href: "/varieties/kufri-chipsona-3", label: "Kufri Chipsona-3" },
        { href: "/varieties/kufri-chandramukhi", label: "Kufri Chandramukhi" },
        { href: "/varieties/kufri-sindhuri", label: "Kufri Sindhuri" },
        { href: "/varieties/kufri-anand", label: "Kufri Anand" },
        { href: "/varieties/kufri-frysona", label: "Kufri Frysona" },
        { href: "/varieties/kufri-himalini", label: "Kufri Himalini" },
        { href: "/varieties/kufri-khyati", label: "Kufri Khyati" },
        { href: "/varieties/kufri-lavkar", label: "Kufri Lavkar" },
        { href: "/varieties/kufri-lalit", label: "Kufri Lalit" },
      ],
    },
    {
      title: "Knowledge articles",
      items: [
        { href: "/knowledge/kufri-potato-varieties-india", label: "Kufri varieties guide" },
        { href: "/knowledge/seed-potato-systems", label: "Seed potato systems" },
        { href: "/knowledge/potato-storage-cold-chain", label: "Potato cold storage" },
        { href: "/knowledge/potato-processing-industry", label: "Global potato processing industry" },
        { href: "/knowledge/potato-diseases-pests", label: "Potato diseases and pests" },
        { href: "/knowledge/climate-change-potatoes", label: "Climate change and potatoes" },
        { href: "/knowledge/complete-potato-growing-guide", label: "Complete potato growing guide" },
        { href: "/knowledge/potato-varieties-guide", label: "Potato varieties guide" },
        { href: "/knowledge/global-potato-trade", label: "Global potato trade statistics" },
        { href: "/knowledge/top-potato-producing-countries", label: "Top potato producing countries" },
      ],
    },
    {
      title: "Practical answers",
      items: [
        { href: "/answers/seed-potato-certification", label: "Seed potato certification" },
        { href: "/answers/certified-seed-potatoes", label: "Certified seed potatoes" },
        { href: "/answers/best-fertilizer-for-potatoes", label: "Best fertilizer for potatoes" },
        { href: "/answers/when-to-plant-potatoes", label: "When to plant potatoes" },
        { href: "/answers/planting-potatoes-in-october", label: "Planting potatoes in October" },
        { href: "/answers/potato-cold-storage-temperature", label: "Cold storage temperature" },
        { href: "/answers/how-long-potatoes-cold-storage", label: "How long can potatoes be stored?" },
        { href: "/answers/how-to-build-potato-cold-storage", label: "How to build potato cold storage" },
        { href: "/answers/seed-potato-yield-calculator", label: "Seed potato yield calculator" },
        { href: "/answers/potato-market-price-today", label: "Potato market price today" },
        { href: "/answers/potato-water-footprint", label: "Potato water footprint" },
        { href: "/answers/potato-climate-change", label: "Potato and climate change" },
        { href: "/answers/true-potato-seeds", label: "True potato seeds (TPS)" },
        { href: "/answers/how-to-save-seed-potatoes", label: "How to save seed potatoes" },
      ],
    },
    {
      title: "Comparison: other potato countries",
      items: [
        { href: "/country/china", label: "China — global #1 producer" },
        { href: "/country/netherlands", label: "Netherlands — seed potato leader" },
        { href: "/country/united-states", label: "United States — Pacific Northwest" },
        { href: "/country/belgium", label: "Belgium — frozen french fry capital" },
        { href: "/country/germany", label: "Germany" },
        { href: "/country/united-kingdom", label: "United Kingdom" },
        { href: "/country/france", label: "France" },
        { href: "/country/bangladesh", label: "Bangladesh" },
        { href: "/country/pakistan", label: "Pakistan" },
        { href: "/country/peru", label: "Peru — origin of potato" },
      ],
    },
  ];
  return (
    <section style={{ marginTop: 40, padding: "24px 26px", background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 14 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginTop: 0, marginBottom: 8 }}>Further reading</h2>
      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 18 }}>Explore Potatopedia&apos;s deeper references on Indian and global potato production, varieties, processing, storage, and trade.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 18 }}>
        {groups.map((g) => (
          <div key={g.title}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 8 }}>{g.title}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {g.items.map((it) => (
                <li key={it.href}><Link href={it.href} style={{ fontSize: 13, color: "#444", textDecoration: "none", lineHeight: 1.5 }}>{it.label} →</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <div style={{ marginTop: 48, padding: "28px 28px", borderRadius: 16, background: "linear-gradient(135deg, rgba(198,40,40,0.06), rgba(198,40,40,0.02))", border: "1px solid rgba(198,40,40,0.12)", textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>Have a question about Indian potato production?</div>
      <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>Ask Potatopedia AI for instant, data-backed answers drawn from FAOSTAT, ICAR-CPRI, DAFW, and other authoritative sources.</div>
      <Link href="/ask" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg,#C62828,#E53935)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Ask Potatopedia AI →</Link>
    </div>
  );
}

/* ── JSON-LD ── */

function IndiaStateJsonLd({ slug, faqItems, dataset }) {
  const meta = STATE_META[slug];
  if (!meta) return null;
  const pageUrl = `https://www.potatopedia.com/country/india/${slug}`;
  const stateName = INDIA_STATES.find((s) => s.slug === slug)?.name;
  const graph = [
    {
      "@type": "Article",
      "@id": pageUrl + "#article",
      headline: meta.title,
      description: meta.desc,
      datePublished: "2026-05-03",
      dateModified: "2026-05-03",
      author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
      publisher: { "@id": "https://www.potatopedia.com/#publisher" },
      mainEntityOfPage: pageUrl,
      image: "https://www.potatopedia.com/og-image.png",
      about: { "@type": "Place", name: `${stateName}, India` },
      isPartOf: { "@type": "WebSite", name: "Potatopedia", url: "https://www.potatopedia.com" },
      speakable: SPEAKABLE,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
        { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/countries", name: "Countries" } },
        { "@type": "ListItem", position: 3, item: { "@id": "https://www.potatopedia.com/country/india", name: "India" } },
        { "@type": "ListItem", position: 4, item: { "@id": pageUrl, name: stateName } },
      ],
    },
    {
      "@type": ["Place", "AdministrativeArea"],
      name: `${stateName}, India`,
      containedInPlace: { "@type": "Country", name: "India", sameAs: "https://www.wikidata.org/wiki/Q668" },
      url: pageUrl,
    },
  ];
  if (dataset) graph.push(dataset);
  graph.push(POTATOPEDIA_PUBLISHER);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
      {faqItems && faqItems.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }) }} />
      )}
    </>
  );
}

/* ── State 1: Uttar Pradesh ── */

function UttarPradeshState() {
  const districts = [
    ["Agra", "2.8M+", "27% state share — India's #1 district", "Kufri Bahar, Chipsona-3"],
    ["Farrukhabad", "Major", "Western UP cold-storage hub", "Kufri Bahar, Pukhraj"],
    ["Firozabad", "Major", "Western UP belt", "Kufri Bahar"],
    ["Kannauj", "Major", "Aroma-region potato; major mandi", "Kufri Bahar, Pukhraj"],
    ["Mainpuri", "Major", "Cold-storage cluster", "Kufri Bahar"],
    ["Mathura", "Major", "Western UP", "Kufri Bahar"],
    ["Etawah", "Significant", "Central-west UP", "Kufri Pukhraj"],
    ["Kanpur (Dehat / Nagar)", "Significant", "Central UP", "Kufri Bahar, Sindhuri"],
    ["Aligarh", "Significant", "Western UP", "Kufri Bahar"],
    ["Meerut", "Significant", "Tarai-fringe; spring potato", "Kufri Pukhraj, Bahar"],
  ];

  const varieties = [
    ["Kufri Bahar (3797)", "1980", "Dominant area share", "Table + processing", "110–125"],
    ["Kufri Pukhraj", "1998", "Wide adoption", "Table (early)", "70–90"],
    ["Kufri Chipsona-3", "2005", "Growing in chip belts", "Chip stock", "110–125"],
    ["Kufri Chipsona-1/4/5", "1998–2018", "Niche chip processing", "Chip stock", "110–125"],
    ["Kufri Lalima", "1982", "Limited (red-skinned)", "Table", "110–125"],
    ["Kufri Sindhuri", "1967", "Established", "Table + bharta", "110–125"],
    ["Kufri Chipbharat-1/2", "Notified 2025", "Newest releases", "Chip stock", "110–125"],
  ];

  const faqItems = [
    { q: "Which district is the largest potato producer in Uttar Pradesh?", a: "Agra district leads Uttar Pradesh with approximately 2.8 million tonnes annually, representing 27% of the state's total potato output and making it the single largest potato-producing district in India (ICAR-CPRI, UP State Government). The other major districts include Farrukhabad, Firozabad, Kannauj, Mathura, Mainpuri, Etawah, Kanpur, Aligarh, and Meerut." },
    { q: "What is the rank of UP in potato production in India?", a: "Uttar Pradesh ranks #1 in India for potato production at 20.126 million tonnes (DAFW 2023-24), accounting for 33.46% of national output. UP also has the largest cultivated area at over 600,000 hectares and operates the largest cold storage infrastructure of any Indian state." },
    { q: "How much potato does Uttar Pradesh produce per year?", a: "UP produces 20.126 million tonnes of potatoes per year (DAFW 2023-24), with an average yield of 26.2 tonnes per hectare — above the national average of 25 t/ha. About 75% of state production comes from six western UP divisions: Meerut, Aligarh, Agra, Kanpur, Moradabad and adjoining belts." },
    { q: "What are the popular potato varieties grown in Uttar Pradesh?", a: "Kufri Bahar (also coded 3797) is the dominant variety in UP per ICAR-CPRI Modipuram, followed by Kufri Pukhraj for early-season production, Kufri Chipsona-3 for chip processing, and traditional varieties like Kufri Sindhuri and Kufri Lalima. Kufri Chipbharat-1 and 2 were notified in 2025 as newer chip-stock options." },
    { q: "Why is Agra famous for potato cultivation?", a: "Agra combines four conditions essential for high-yield potato production: deep alluvial soils of the Yamuna basin, dependable tube-well irrigation, October-to-March cool growing season, and dense cold-storage infrastructure. The Agra-Kanpur potato belt has been India's most productive potato corridor for decades." },
    { q: "When are potatoes planted in UP?", a: "The main rabi potato crop is sown in Uttar Pradesh between mid-October and early November, with harvest in February–March. Spring potato planting in the Tarai region runs January–February with harvest in April–May. The Indo-Gangetic plain's cool winter window (15–20°C) is ideal for tuberization." },
    { q: "What is the cold storage capacity in Uttar Pradesh?", a: "UP operates the largest potato cold storage infrastructure in India — approximately 16 million tonnes of capacity out of the country's ~38–40 million tonnes total (NHB, ICAR-CPRI). Capacity is concentrated in the Agra–Kannauj–Farrukhabad–Mainpuri belt. The 2024-25 season saw storage stress from a record harvest." },
    { q: "Is UP self-sufficient in seed potato?", a: "Partially — only an estimated 10–15% of UP farmers use formally certified seed potatoes (ICAR-CPRI). Most production runs on table-grade saved seed or G3–G4 generation seed multiplied informally. CPRI Modipuram and the new Aeroponic Centres at Hapur and Kushinagar are scaling up clean-seed multiplication." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Uttar Pradesh Potato Production 2023-24",
    description: "District-wise and variety-wise potato production data for Uttar Pradesh",
    creator: { "@type": "Organization", name: "Department of Agriculture and Farmers Welfare, Government of India" },
    keywords: "Uttar Pradesh potato, Agra potato, Kufri Bahar, Indian potato production",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="uttar-pradesh" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Uttar Pradesh" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Uttar Pradesh" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>15 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["uttar-pradesh"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Rank in India", value: "#1 (33.46% of national output)" },
            { label: "Production", value: "20.126M tonnes (DAFW 2023-24)" },
            { label: "Top district", value: "Agra (~2.8M tonnes, 27%)" },
            { label: "Top variety", value: "Kufri Bahar" },
            { label: "Average yield", value: "26.2 t/ha (above national average)" },
            { label: "Season", value: "Rabi — sown Oct–Nov, harvested Feb–Mar" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Uttar Pradesh is India's largest potato-producing state, growing 20.126 million tonnes across more than 600,000 hectares — 33.46% of national potato output (DAFW, 2023-24).</strong> Agra district alone produces approximately 2.8 million tonnes (27% of state output), making it the single largest potato-producing district in India. Six western divisions — Meerut, Aligarh, Agra, Kanpur, Moradabad, and adjoining belts — account for roughly 75% of UP production. State-average yield of 26.2 t/ha exceeds the 25 t/ha national average.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "20.13M t", label: "Annual production" },
            { value: "33.46%", label: "Share of India" },
            { value: "2.8M t", label: "Agra district (27%)" },
            { value: "26.2 t/ha", label: "Average yield" },
          ]} />

          {/* Card 1 */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much" style={sH2}>How much potato does Uttar Pradesh produce?</h2>
            <p style={sIntro}>Uttar Pradesh produced 20.126 million tonnes of potatoes in 2023-24 — 33.46% of India's national output of 60.14 million tonnes — making it the country's largest potato-producing state by a substantial margin (DAFW; ICAR-CPRI).</p>
            <QuickFactsBox items={[
              { label: "Production (2023-24)", value: "20.126M tonnes" },
              { label: "Cultivated area", value: "600,000+ hectares" },
              { label: "Yield", value: "26.2 t/ha" },
              { label: "Share of national output", value: "33.46%" },
            ]} />
            <p style={sP}>The state's potato volume is nearly double that of <Link href="/country/india/west-bengal" style={linkRed}>West Bengal</Link>, India's #2 potato state, and exceeds the combined output of <Link href="/country/india/bihar" style={linkRed}>Bihar</Link>, <Link href="/country/india/gujarat" style={linkRed}>Gujarat</Link>, and <Link href="/country/india/madhya-pradesh" style={linkRed}>Madhya Pradesh</Link>. UP&apos;s 600,000+ hectares of potato area is the largest of any Indian state. The state&apos;s 26.2 t/ha yield, while above the 25 t/ha national average, remains well below the 40–55 t/ha typical of the <Link href="/country/netherlands" style={linkPlain}>Netherlands</Link>, <Link href="/country/united-states" style={linkPlain}>United States</Link>, or <Link href="/country/belgium" style={linkPlain}>Belgium</Link> — pointing to substantial yield-improvement headroom through certified seed and modern agronomy.</p>
            <p style={sP}>Production is concentrated in the western UP belt running from Meerut and Aligarh through Agra and Mathura down to Kanpur. Six western divisions — Meerut, Aligarh, Agra, Kanpur, Moradabad, and the adjoining belt — account for approximately 75% of state output (UP State Government data via ICAR-CPRI). UP&apos;s growth trajectory has been steady; the state has held the #1 position in Indian potato production for over four decades, driven by the Indo-Gangetic alluvium, dependable tube-well irrigation, and cold storage infrastructure that allows year-round supply to consumer markets across northern India.</p>
            <p style={sSource}>Source: Department of Agriculture &amp; Farmers Welfare (DAFW), Government of India 2023-24; ICAR-CPRI Modipuram; UP State Government potato data.</p>
          </section>

          {/* Card 2 */}
          <section id="districts" data-card="districts" style={cardWrap}>
            <h2 id="districts-h" style={sH2}>Which districts in Uttar Pradesh produce the most potato?</h2>
            <p style={sIntro}>Agra district leads Uttar Pradesh with approximately 2.8 million tonnes of annual potato production — 27% of state output and the single largest potato-producing district in India (ICAR-CPRI, UP State Government). The full top-10 districts span Western UP&apos;s alluvial belt.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["District", "Production", "Notes", "Top varieties"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {districts.map((r, i) => (
                    <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i < 3 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd} data-stat-type="production">{r[1]}</td>
                      <td style={{ ...sTd, color: "#666" }}>{r[2]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR-CPRI Modipuram; UP State Government district production data 2023-24.</p>
            <p style={sP}>The Western UP cluster — Agra, Farrukhabad, Firozabad, Kannauj, Mainpuri, Mathura — collectively produces an estimated 60% of state output. These districts share three structural advantages: deep Yamuna-Ganga alluvial soils, dependable tube-well groundwater irrigation, and the densest cold-storage network of any region in India. The Agra-Kanpur potato corridor has been the country&apos;s most productive potato belt for over four decades. <Link href="/answers/famous-potato-city-india" style={linkRed}>Agra is widely regarded as India&apos;s potato capital</Link>, supplying both the domestic table-potato market and the chip-stock procurement chains operated by ITC&apos;s Bingo! and PepsiCo Frito-Lay.</p>
            <p style={sP}><strong>[DATA NEEDED: precise district-level production tonnage and ranking for districts beyond Agra in 2024-25]</strong> — backend data confirms Agra&apos;s 2.8M tonnes / 27% share but absolute tonnage figures for the other top districts are not available in current ingested sources at uniform precision; rankings shown above reflect ICAR-CPRI&apos;s qualitative ordering and UP State Government division-level aggregations.</p>
            <StatCallout number="75%" context="of Uttar Pradesh's potato production comes from six western divisions: Meerut, Aligarh, Agra, Kanpur, Moradabad, and adjoining belts." source="ICAR-CPRI; UP State Government" />
          </section>

          {/* Card 3 */}
          <section id="why-agra" data-card="agra" style={cardWrap}>
            <h2 id="why-agra-h" style={sH2}>Why is Agra famous for potato cultivation?</h2>
            <p style={sIntro}>Agra produces 2.8 million tonnes of potatoes annually — more than the entire national output of countries like Spain or Australia — because it combines four advantages: deep alluvial soils of the Yamuna basin, dependable tube-well irrigation, the October–March cool growing window ideal for tuberization, and India&apos;s densest cold-storage cluster (ICAR-CPRI; <Link href="/answers/famous-potato-city-india" style={linkPlain}>Potatopedia famous-potato-city analysis</Link>).</p>
            <QuickFactsBox items={[
              { label: "Annual production", value: "~2.8 million tonnes (27% state share)" },
              { label: "Soil type", value: "Yamuna-basin alluvial sandy-loam" },
              { label: "Cold storage", value: "Multiple large cluster facilities" },
              { label: "Major buyers", value: "ITC Bingo!, PepsiCo, fresh-market wholesalers" },
            ]} />
            <p style={sP}>Agra&apos;s soil profile — sandy-loam with 0.5–1.0% organic matter, pH 6.5–7.5, excellent drainage — is textbook for potato. The crop&apos;s critical 6–8 week tuber-bulking window aligns with December–January when day temperatures sit at 18–22°C and nights at 8–12°C, conditions that maximize tuberization efficiency (FAO; CIP). Tube-well irrigation infrastructure built across the Yamuna basin since the 1970s removed the rainfall constraint that limits potato in many Indian regions. The ICAR-CPRI South India / South Asia Centre at Agra (PIB) anchors public-sector seed multiplication and variety trials for the entire western-UP belt.</p>
            <p style={sP}>The economic depth of Agra&apos;s potato sector matters as much as the agronomy. Cold storage operators, commission agents, transporters, processors, and exporters cluster around the Agra mandi, creating one of the most liquid agricultural markets in India. <Link href="/answers/largest-potato-producer-india" style={linkRed}>Agra alone produces more potato than most Indian states</Link>. Read more on the <Link href="/blog/india-potato-production-by-state" style={linkRed}>India state-by-state potato production analysis</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI Modipuram; PIB on CIP-CPRI Agra centre; UP State Government potato sector data.</p>
          </section>

          {/* Card 4 */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 id="varieties-h" style={sH2}>Which potato varieties are grown in Uttar Pradesh?</h2>
            <p style={sIntro}>Kufri Bahar (CPRI release 1980, also coded as variety 3797) is the dominant potato variety in Uttar Pradesh according to ICAR-CPRI Modipuram, followed by Kufri Pukhraj for early-season production and Kufri Chipsona-3 for chip processing. The state has over 94% of its area planted to CPRI-bred cultivars (<Link href="/knowledge/kufri-potato-varieties-india" style={linkPlain}>Kufri varieties guide</Link>).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Variety", "Released", "Adoption in UP", "End use", "Maturity (days)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={sTd}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR-CPRI Modipuram variety register; UP State Government adoption surveys; CPRI variety notification gazette.</p>
            <p style={sP}><Link href="/varieties/kufri-bahar" style={linkRed}>Kufri Bahar</Link> dominates because it combines high yield (35–40 t/ha potential), 110–125 day maturity matching the rabi window, dual table-and-processing utility, and acceptable storage life. <Link href="/varieties/kufri-pukhraj" style={linkRed}>Kufri Pukhraj</Link> serves the early-market segment (70–90 days from planting), allowing farmers in UP&apos;s warmer southern zones to harvest before peak heat. <Link href="/varieties/kufri-chipsona-3" style={linkRed}>Kufri Chipsona-3</Link> and the new <Link href="/varieties/kufri-chipbharat-1" style={linkRed}>Kufri Chipbharat-1 and 2</Link> (notified in 2025) target the chip-stock processing chain serving ITC Bingo! and Lay&apos;s contract programs. Older varieties — Kufri Sindhuri (1967), Kufri Chandramukhi (1968), Kufri Lalima (1982) — retain niche use for table consumption, particularly in households that prefer red-skinned varieties for traditional Indian preparations.</p>
            <p style={sP}>Certified seed adoption remains a structural constraint. Only an estimated 10–15% of UP farmers use formally certified seed potatoes (ICAR-CPRI) — a gap explored in our <Link href="/knowledge/seed-potato-systems" style={linkRed}>seed potato systems guide</Link> and <Link href="/answers/certified-seed-potatoes" style={linkRed}>certified seed potatoes answer</Link>. CPRI Modipuram, alongside the newer Aeroponic Centres at Hapur and Kushinagar, is scaling up minituber production to address the gap.</p>
            <StatCallout number="94%+" context="of Indian potato area, including Uttar Pradesh, is planted to CPRI-bred cultivars — the result of 75+ years of state-led varietal breeding from the Central Potato Research Institute." source="ICAR-CPRI" />
          </section>

          {/* Card 5 */}
          <section id="cold-storage" data-card="cold-storage" style={cardWrap}>
            <h2 id="cold-storage-h" style={sH2}>How much cold storage capacity does Uttar Pradesh have for potatoes?</h2>
            <p style={sIntro}>Uttar Pradesh operates the largest potato cold storage infrastructure in India — approximately 16 million tonnes of capacity out of the country&apos;s ~38–40 million tonne total (NHB; ICAR-CPRI). Capacity is concentrated in the Agra–Kannauj–Farrukhabad–Mainpuri belt, with Agra district alone hosting multiple large cold storage clusters (ICAR-CPRI).</p>
            <QuickFactsBox items={[
              { label: "Estimated capacity", value: "~16 million tonnes (largest in India)" },
              { label: "Concentration", value: "Agra–Kannauj–Farrukhabad–Mainpuri belt" },
              { label: "Storage period", value: "8–10 months (Feb harvest → Oct/Nov dispatch)" },
              { label: "Typical rental", value: "INR 200–400/quintal/season" },
            ]} />
            <p style={sP}>UP&apos;s cold storage network is what converts a three-month harvest into a year-round supply for northern Indian consumer markets. Storage is dominated by single-temperature, multi-storey gunny-bag-based facilities — the distinctive Indian cold storage architecture covered in our <Link href="/knowledge/potato-storage-cold-chain" style={linkRed}>cold-chain reference</Link>. Capacity utilization typically runs 70–95% across normal years, with the 2024–25 season testing the upper limits as a record harvest filled storage during peak loading. Rental rates of INR 200–400 per quintal per season effectively floor summer/autumn potato prices — farmers will not store unless realized prices recover both the rental cost and an opportunity-cost return on stored capital.</p>
            <p style={sP}>The economic foundation of UP&apos;s cold-storage build-out is the National Horticulture Board&apos;s 35% back-ended capital subsidy and the Agriculture Infrastructure Fund&apos;s 3% interest subvention scheme. Both are central-government programs available to private operators, FPOs, and cooperatives. For deeper detail on storage temperatures, design, and post-harvest losses see our <Link href="/answers/potato-cold-storage-temperature" style={linkRed}>cold-storage temperature answer</Link> and the <Link href="/answers/how-long-potatoes-cold-storage" style={linkRed}>storage duration answer</Link>.</p>
            <p style={sSource}>Source: National Horticulture Board (NHB) cold storage data; ICAR-CPRI; Ministry of Food Processing Industries (MoFPI).</p>
          </section>

          {/* Card 6 */}
          <section id="mandis" data-card="mandis" style={cardWrap}>
            <h2 id="mandis-h" style={sH2}>What are the major potato mandis and prices in Uttar Pradesh?</h2>
            <p style={sIntro}>Agra Mandi is UP&apos;s largest potato wholesale market, complemented by Hapur, Chandausi, Kannauj, and Aligarh APMC markets. Mandi prices have ranged INR 600–1,500 per quintal in normal years, with glut episodes (2017, 2018, 2024-25) driving prices to INR 200–400/quintal and tight years (2019-20, 2024 winter) reaching INR 1,800–2,500/quintal (Agmarknet; ICAR-CPRI).</p>
            <p style={sP}>Indian potato is structurally not under the formal Minimum Support Price (MSP) regime — there is no central declared minimum support price for potato. Some state governments, including Uttar Pradesh in periodic glut episodes, announce ad-hoc procurement at administered floor prices, but intervention purchases are typically minor relative to the overall crop size. For market context see our <Link href="/answers/potato-market-price-today" style={linkRed}>potato market price answer</Link>.</p>
            <p style={sP}>Cold storage rental of INR 200–400/quintal/season effectively places a floor under summer/autumn prices — farmers will not store potato unless realized post-storage selling price covers both the rental and an opportunity-cost return. This dynamic structures UP&apos;s seasonal price pattern: peak harvest (February–March) sees lowest farm-gate prices; ex-cold-storage post-October prices typically run 40–80% higher. <strong>[DATA NEEDED: live Agmarknet feed integration]</strong> — current pricing in this article reflects multi-year typical ranges; for live state-by-state mandi prices, refer to the official Agmarknet portal at agmarknet.gov.in.</p>
            <p style={sSource}>Source: Agmarknet (Government of India); ICAR-CPRI; UP Agricultural Produce Marketing Committees.</p>
          </section>

          {/* Card 7 */}
          <section id="processors" data-card="processors" style={cardWrap}>
            <h2 id="processors-h" style={sH2}>Which processors operate in Uttar Pradesh?</h2>
            <p style={sIntro}>Uttar Pradesh supplies a substantial chip-stock procurement footprint to PepsiCo Frito-Lay (Lay&apos;s and Kurkure brands), ITC Bingo!, Balaji Wafers, and Haldiram&apos;s — primarily through contract grower programs anchored on Kufri Chipsona-3 and the newer Kufri Chipbharat varieties (ICAR-CPRI; <Link href="/knowledge/potato-processing-industry" style={linkPlain}>processing industry article</Link>).</p>
            <p style={sP}>UP&apos;s processing footprint is more table-stock procurement than integrated frozen-fry manufacturing. <Link href="/country/india/gujarat" style={linkRed}>Gujarat</Link> leads India in frozen french fry processing — HyFun Foods, McCain Foods India, Iscon Balaji Foods all operate major plants there. UP&apos;s role is upstream: chip-stock contract grower bases in Agra, Kannauj, and Farrukhabad supply processors with low-reducing-sugar tubers throughout the post-harvest season. Contract structures typically guarantee a base price linked to specific gravity, sugar content, and defect grids.</p>
            <p style={sP}>The variety-supply economics shape this market. Kufri Chipsona-3 (CPRI release 2005) was specifically bred for Indian conditions to replace imported Atlantic seed that the chip industry historically depended on; it now anchors PepsiCo India&apos;s Lay&apos;s production. The 2025 notification of Kufri Chipbharat-1 and 2 expands the chip-stock variety palette. For background on McDonald&apos;s and chip-industry variety specifications, see our <Link href="/knowledge/mcdonalds-potato-varieties" style={linkRed}>McDonald&apos;s suppliers article</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI variety register; PepsiCo India operations; ITC Bingo! procurement; Potatopedia processor research.</p>
          </section>

          {/* Card 8 */}
          <section id="schemes" data-card="schemes" style={cardWrap}>
            <h2 id="schemes-h" style={sH2}>What government schemes support potato farmers in Uttar Pradesh?</h2>
            <p style={sIntro}>UP potato farmers can access a layered scheme stack: Mission for Integrated Development of Horticulture (MIDH) 35% capital subsidy on cold storage; Agriculture Infrastructure Fund (AIF) 3% interest subvention; Pradhan Mantri Fasal Bima Yojana (PMFBY) crop insurance with potato listed as a commercial crop; UP Food Processing Industry Policy state-level capital subsidy of up to 25%; and Operation Greens transport-and-storage subsidies during glut years (Department of Agriculture &amp; Farmers Welfare; UP State Government).</p>
            <QuickFactsBox items={[
              { label: "Cold storage capital subsidy", value: "35% (MIDH/NHB) + 25% UP state overlay" },
              { label: "AIF interest subvention", value: "3% on loans up to INR 2 crore, 7-year tenor" },
              { label: "PMFBY premium (farmer share)", value: "5% of sum insured (commercial crops)" },
              { label: "PLI Food Processing", value: "Operating for processed F&V including potato" },
            ]} />
            <p style={sP}>The MIDH/NHB cold-storage subsidy combined with UP&apos;s state-level food processing policy can push effective subsidy on a 5,000-tonne facility to ~50–60% of project cost. AIF&apos;s interest subvention applies to loans up to INR 2 crore for a 7-year tenor, making sub-INR 2 crore primary processing and pack-house projects highly bankable. PMFBY for potato runs on the commercial-crop premium rate of up to 5% of sum insured (farmer share), with the gross premium subsidized 50:50 by Centre and State up to specified caps. Operation Greens, originally launched to stabilize Tomato-Onion-Potato (TOP) value chains, provides up to 50% subsidy on transport and short-term storage rental during glut episodes.</p>
            <p style={sP}>The PLI (Production Linked Incentive) scheme for Food Processing extends 4–10% incremental sales incentives over six years to processors meeting investment and growth thresholds — relevant to UP-headquartered chip and frozen-fry investors. State-specific schemes including the UP Food Processing Industry Policy add a 25% capital subsidy up to INR 5 crore for new processing units. The combined stack typically takes effective project subsidy on a greenfield potato cold storage to 50–60% of capex.</p>
            <p style={sSource}>Source: Ministry of Agriculture &amp; Farmers Welfare scheme guidelines (MIDH, AIF, PMFBY); UP State Government Food Processing Industry Policy; MoFPI PLI scheme notifications.</p>
          </section>

          {/* Card 9 */}
          <section id="climate" data-card="climate" style={cardWrap}>
            <h2 id="climate-h" style={sH2}>What is the climate and soil profile for potato in Uttar Pradesh?</h2>
            <p style={sIntro}>UP&apos;s western potato belt sits on Indo-Gangetic alluvium — sandy-loam to silty-loam soils with pH 6.5–7.5 and excellent drainage — under a sub-tropical winter climate that delivers the cool 15–20°C window potato requires for tuberization (FAO; CIP). The October–March rabi season aligns with the crop&apos;s temperature optimum and falls within the irrigation-fed cycle of the Yamuna and Ganga basins.</p>
            <p style={sP}>Three agroclimatic features define UP&apos;s potato suitability. First, the cool dry winter (mean daytime 18–22°C, nights 8–12°C from December–February) sits squarely within the 15–20°C optimal range for tuber initiation and bulking. Second, the alluvial soils of the western belt provide deep, well-drained, slightly-acidic-to-neutral profiles that match potato&apos;s rooting requirements. Third, the dependable tube-well groundwater infrastructure built since the 1970s removed rainfall as a constraint — UP receives only 80–100 mm of winter precipitation, but tube-well irrigation supplies the 500–700 mm seasonal requirement covered in our <Link href="/knowledge/climate-change-potatoes" style={linkRed}>climate-change article</Link>.</p>
            <p style={sP}>Climate change pressure is real and growing. Late autumn cooling has shifted later by approximately 1–2 weeks across the past decade, while early spring warming has shifted earlier by a similar amount, compressing the planting-to-harvest window. UP shares this constraint with the rest of the Indo-Gangetic potato belt covered by our <Link href="/answers/potato-climate-change" style={linkRed}>climate-change answer</Link>. Heat-tolerant CIP and CPRI varieties — including the LBHT (Late Blight + Heat Tolerant) clones piloted in <Link href="/country/bangladesh" style={linkPlain}>Bangladesh</Link> — are part of the medium-term adaptation pipeline.</p>
            <p style={sSource}>Source: FAO; CIP; ICAR-CPRI agroclimatic zone data; UP State Agriculture Department.</p>
          </section>

          {/* Card 10 */}
          <section id="calendar" data-card="calendar" style={cardWrap}>
            <h2 id="calendar-h" style={sH2}>When are potatoes planted and harvested in Uttar Pradesh?</h2>
            <p style={sIntro}>The main rabi potato crop in Uttar Pradesh is sown between mid-October and early November and harvested in February–March. Spring potato planting in the Tarai region runs January–February with harvest in April–May. The October–November window is sized to the cool-season tuberization optimum and the 110–125-day maturity of dominant Kufri Bahar (FAO; ICAR-CPRI; CPRI Modipuram).</p>
            <QuickFactsBox items={[
              { label: "Main rabi planting", value: "October 15 – November 10" },
              { label: "Main rabi harvest", value: "February 1 – March 15" },
              { label: "Spring potato (Tarai)", value: "Plant Jan–Feb; harvest Apr–May" },
              { label: "Storage entry", value: "Mid-Feb to mid-March (peak loading)" },
            ]} />
            <p style={sP}>Sowing-window discipline is critical for full yield potential. Planting before mid-October risks heat-stress damage during the first 4–6 weeks; planting after mid-November compresses the bulking window and exposes the crop to late-season heat-spike risk during March harvest. CPRI guidance (2023 advisory) specifically recommends mid-October to early November as the planting peak for north Indian conditions. Harvest typically peaks in the third week of February through mid-March across the Agra–Kanpur belt, with cold-storage entry concentrating in the same 6-week window. For practical sowing-time guidance, see our <Link href="/answers/when-to-plant-potatoes" style={linkRed}>planting time answer</Link> and <Link href="/answers/planting-potatoes-in-october" style={linkRed}>planting in October answer</Link>.</p>
            <p style={sP}>The spring-potato cycle in the Tarai region (foothills of the Himalayas, including parts of Pilibhit and Lakhimpur) operates on a different calendar — January–February planting against the rabi&apos;s tail, harvested April–May before the monsoon. This cycle supplies fresh-market table potato during what would otherwise be a supply gap between the rabi harvest&apos;s exhaustion and the next year&apos;s rabi crop arriving.</p>
            <p style={sSource}>Source: ICAR-CPRI Modipuram sowing-time advisories; CPRI Annual Report; UP State Agriculture Department; FAO crop calendars.</p>
          </section>

          {/* Card 11 — Challenges */}
          <section id="challenges" data-card="challenges" style={cardWrap}>
            <h2 id="challenges-h" style={sH2}>What are the biggest challenges facing UP potato farmers?</h2>
            <p style={sIntro}>UP potato farmers face six interlocking constraints: depleting groundwater in the western belt, late blight pressure during cool-wet periods, harvest-glut price volatility, only 10–15% certified seed adoption, climate-driven calendar compression, and structural dependence on cold storage rental economics (ICAR-CPRI; CPRI Modipuram; Department of Agriculture &amp; Farmers Welfare).</p>
            <p style={sP}>The groundwater issue is the most serious medium-term threat. UP&apos;s western potato belt depends on tube-well irrigation drawing from a Gangetic aquifer that has been depleting at 0.5–1.5 metres per year across multiple districts. Drip irrigation adoption — covered in our <Link href="/answers/potato-water-footprint" style={linkRed}>potato water footprint answer</Link> — could cut application water by 30–50% but capital cost and small parcel size limit smallholder uptake. Late blight (<em>Phytophthora infestans</em>) remains a recurring hazard; CPRI Modipuram&apos;s decision support system (DSS) deployment helps growers time fungicide sprays, but the 12–18 spray seasons typical of NW Europe are uneconomic at Indian price points. Harvest-glut volatility has produced multiple INR 200–400/quintal price collapses in the past decade, against a typical INR 600–1,500 normal-year range.</p>
            <p style={sP}>The bright signals are real. CPRI Modipuram and the new ICAR-CPRI Aeroponic Centres at Hapur and Kushinagar are scaling up minituber production from disease-tested in vitro stock — moving UP toward a higher certified-seed adoption rate over the next decade. The 2025 notification of Kufri Chipbharat-1 and 2 expands the chip-stock variety pipeline. State-level expansion of Operation Greens transport subsidies during glut episodes provides a partial floor under farmer income. Progressive farmer programs run by CPRI and FPO networks in Aligarh and Agra districts are demonstrating yields above 40 t/ha — twice the state average — through certified seed combined with precision agronomy. <Link href="/knowledge/potato-diseases-pests" style={linkRed}>Read more on potato diseases and pests</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI Modipuram; CPRI Annual Reports; UP Agriculture Department; Department of Agriculture &amp; Farmers Welfare.</p>
          </section>

          <SourceBlock sources={[
            "Department of Agriculture & Farmers Welfare (DAFW), Government of India — All-India crop production data 2023-24",
            "ICAR-CPRI (Central Potato Research Institute, Shimla) — variety register, agronomic advisories, district adoption",
            "ICAR-CPRI Modipuram — Western UP potato research station; variety multiplication and farmer-level surveys",
            "Press Information Bureau (PIB), Government of India — CIP-CPRI Agra Centre announcements",
            "National Horticulture Board (NHB) — cold storage capacity statistics",
            "Uttar Pradesh State Government — district-level potato production, Food Processing Industry Policy",
            "Ministry of Food Processing Industries (MoFPI) — PMKSY, PLI Food Processing, Operation Greens",
            "Agmarknet — wholesale price reporting, Government of India",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="uttar-pradesh" />

          <ContinueReading articles={[
            { href: "/knowledge/kufri-potato-varieties-india", tag: "Varieties", title: "Kufri Potato Varieties: India's Complete Guide", desc: "75+ Kufri varieties from CPRI Shimla — Kufri Bahar, Pukhraj, Chipsona, Chipbharat. Adoption, end-use, and notification dates." },
            { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems: Certification, Multiplication, Trade", desc: "Why only 10–15% of Indian farmers use certified seed — and the CPRI/CIP path to closing the gap." },
            { href: "/knowledge/potato-storage-cold-chain", tag: "Storage", title: "Potato Cold Storage: Temperatures, Design, Post-Harvest Losses", desc: "India operates the world's largest potato cold storage system (~38–40M tonnes). UP holds ~16M of it." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State — A Story-Format Deep Dive", desc: "Why UP is #1, what makes Agra special, and how Bihar's CPRI legacy still shapes the country's potato breeding." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 2: West Bengal ── */

function WestBengalState() {
  const districts = [
    ["Hooghly", "~40% of state", "India's #2 potato district; Kolaghat market hub", "Kufri Jyoti, Pukhraj"],
    ["Burdwan (Bardhaman)", "Major", "Damodar belt; rice-potato rotation", "Kufri Jyoti, Chandramukhi"],
    ["Paschim Medinipur", "Major", "Western belt; cold-storage cluster", "Kufri Jyoti"],
    ["Bankura", "Significant", "Lateritic-soil belt; expanding area", "Kufri Jyoti, Pukhraj"],
    ["Jalpaiguri", "Significant", "North Bengal Tarai; spring potato", "Kufri Pukhraj"],
    ["Hooghly-adjacent (Howrah)", "Significant", "Kolkata-region demand", "Kufri Jyoti"],
    ["Purba Medinipur", "Significant", "Coastal belt", "Kufri Jyoti"],
    ["Birbhum", "Emerging", "Western lateritic belt", "Kufri Jyoti, Sindhuri"],
  ];

  const varieties = [
    ["Kufri Jyoti", "1968 (CPRI) / 1971 WB release", ">50% area share", "Table + processing", "110–125"],
    ["Kufri Pukhraj", "1998", "~15% (rising)", "Table (early)", "70–90"],
    ["Kufri Chandramukhi", "1968", "~10% (declining)", "Table", "110–125"],
    ["Kufri Himalini", "2010", "Emerging", "Table + chip", "110–125"],
    ["Kufri Khyati", "2010", "Emerging", "Chip-suitable", "90–100"],
    ["Kufri Sindhuri", "1967", "Niche", "Table + bharta", "110–125"],
  ];

  const faqItems = [
    { q: "Which district produces the most potato in West Bengal?", a: "Hooghly district produces approximately 40% of West Bengal's potatoes — making it India's #2 potato-producing district after Agra (UP). Hooghly anchors the Gangetic alluvial potato belt of South Bengal, with the Kolaghat wholesale market serving as the state's primary potato distribution hub. Other major districts include Burdwan (Bardhaman), Paschim Medinipur, Bankura, and Jalpaiguri." },
    { q: "What is the rank of West Bengal in potato production?", a: "West Bengal is India's second-largest potato-producing state at 11–12 million tonnes annually (ICAR-CPRI), approximately 21–24% of national output (DAFW 2023-24). The 2024-25 season delivered a preliminary record of 14–15 million tonnes, creating significant storage stress across the state's 580+ cold storage units." },
    { q: "Which variety of potato is grown in West Bengal?", a: "Kufri Jyoti, released by ICAR-CPRI in 1968 and widely adopted in West Bengal from 1971 onwards, dominates state cultivation with over 50% of area share. Kufri Pukhraj is the second-most-grown variety, especially for early-season production. Kufri Chandramukhi remains in cultivation but is declining as farmers shift toward newer Kufri Himalini and Kufri Khyati releases." },
    { q: "What is the potato season in West Bengal?", a: "The main potato crop in West Bengal is planted in November–December and harvested in February–March — a rabi-season cycle aligned with the cool 15–20°C window potato requires for tuberization. The Hooghly Gangetic belt&apos;s soils, irrigation, and December–February cool window make the state India&apos;s second-largest potato producer." },
    { q: "How many cold storages are there in West Bengal?", a: "West Bengal operates 580+ cold storage units, the second-largest cold storage network among Indian states after Uttar Pradesh (West Bengal Agriculture Department). Hooghly district alone hosts 76+ units — the highest concentration of any Bengal district — reflecting the district's dominant production share. The state's storage capacity has been tested by record harvests in 2024-25." },
    { q: "What is the MSP of potato in West Bengal?", a: "Potato is not under India&apos;s formal Minimum Support Price regime — there is no central declared MSP. The West Bengal state government has periodically intervened with administered procurement floor prices (₹900/quintal historical reference for Kufri Jyoti) during glut episodes, but intervention purchases remain minor relative to the overall state crop. Farm-gate price volatility — particularly in glut years — is a structural concern." },
    { q: "Why is Hooghly the largest potato producer in West Bengal?", a: "Hooghly combines four factors: deep Gangetic alluvial soils ideal for tuberization, dependable canal and tube-well irrigation, the cool November–February window matching the rabi-season cycle, and India&apos;s densest district-level cold-storage cluster (76+ units). The district&apos;s historical depth in potato cultivation traces back to a 1953 farmers&apos; recognition for innovative potato cropping." },
    { q: "Is potato farming profitable in West Bengal?", a: "Profitability varies sharply by season. In normal years (mandi prices INR 600–1,500/quintal) commercial farmers earn modest margins. Glut episodes (2017, 2018, 2024-25 partial) have produced steep losses with prices falling to INR 200–400/quintal — below cost of production for many. Cold storage rental of INR 200–400/quintal/season acts as an opportunity-cost floor; farmers store only when expected ex-storage price covers the rental plus opportunity return." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "West Bengal Potato Production 2023-24",
    description: "District-wise production, variety adoption, and cold storage data for West Bengal",
    creator: { "@type": "Organization", name: "Department of Agriculture and Farmers Welfare, Government of India" },
    keywords: "West Bengal potato, Hooghly potato, Kufri Jyoti, Indian potato production",
  };

  return (
    <>
      <IndiaStateJsonLd slug="west-bengal" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="West Bengal" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · West Bengal" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>14 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["west-bengal"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Rank in India", value: "#2 (21–24% of national output)" },
            { label: "Production", value: "11–12M tonnes (record 14–15M in 2024-25)" },
            { label: "Top district", value: "Hooghly (~40% of state)" },
            { label: "Top variety", value: "Kufri Jyoti (>50% area)" },
            { label: "Cold storage units", value: "580+ statewide; 76+ in Hooghly alone" },
            { label: "Season", value: "Rabi — sown Nov–Dec, harvested Feb–Mar" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>West Bengal is India&apos;s second-largest potato-producing state at 11–12 million tonnes annually from approximately 400,000 hectares — about 22–24% of national output (ICAR-CPRI; DAFW 2023-24).</strong> The 2024-25 season delivered a preliminary record of 14–15 million tonnes. Hooghly district alone contributes ~40% of state production, anchoring the Gangetic alluvial potato belt. Kufri Jyoti has dominated cultivation since its 1971 widespread release. The state operates 580+ cold storage units, with 76+ in Hooghly district alone — the densest district-level cold-storage concentration in India.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "11–12M t", label: "Annual production" },
            { value: "~40%", label: "Hooghly state share" },
            { value: "1971", label: "Kufri Jyoti WB release" },
            { value: "580+", label: "Cold storage units" },
          ]} />

          {/* Card 1 */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-wb" style={sH2}>How much potato does West Bengal produce?</h2>
            <p style={sIntro}>West Bengal produces 11–12 million tonnes of potatoes annually from approximately 400,000 hectares — making it India&apos;s second-largest potato-producing state, accounting for roughly 21–24% of national output (ICAR-CPRI; DAFW 2023-24). The 2024-25 season delivered a preliminary record of 14–15 million tonnes [DATA NEEDED: final DAFW 2024-25 data confirmation].</p>
            <QuickFactsBox items={[
              { label: "Production (typical year)", value: "11–12M tonnes" },
              { label: "Production (2024-25 preliminary)", value: "14–15M tonnes" },
              { label: "Cultivated area", value: "~400,000 hectares" },
              { label: "Average yield", value: "~29 t/ha" },
            ]} />
            <p style={sP}>West Bengal&apos;s potato sector is structurally different from <Link href="/country/india/uttar-pradesh" style={linkRed}>Uttar Pradesh&apos;s</Link>. While UP spreads production across western divisions covering ~75% of state output, West Bengal concentrates more sharply: Hooghly alone delivers ~40% of state production, with the four-district cluster of Hooghly–Burdwan–Paschim Medinipur–Bankura accounting for the bulk. State-average yield of approximately 29 t/ha exceeds the UP average (26.2 t/ha) and the national average (25 t/ha), reflecting the productivity advantages of the Gangetic alluvial soils and dense cold-chain infrastructure.</p>
            <p style={sP}>The 2024-25 record harvest produced storage stress across the state&apos;s 580+ cold storage units. Hooghly&apos;s 76+ units — the densest district-level cold-storage concentration anywhere in India — were tested by simultaneous loading. The combination of a record harvest and existing cold-storage capacity also pushed mandi prices below cost of production for several weeks, prompting state-level intervention discussions. For the full Indian context see our <Link href="/country/india" style={linkRed}>India profile</Link> and <Link href="/answers/largest-potato-producer-india" style={linkRed}>largest potato producer India answer</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; Department of Agriculture &amp; Farmers Welfare 2023-24; West Bengal Agriculture Department; BCKV (Bidhan Chandra Krishi Viswavidyalaya).</p>
          </section>

          {/* Card 2 */}
          <section id="districts" data-card="districts" style={cardWrap}>
            <h2 id="districts-h-wb" style={sH2}>Which districts produce the most potato in West Bengal?</h2>
            <p style={sIntro}>Hooghly district leads West Bengal with approximately 40% of state potato production — the highest single-district share in any Indian potato state. The Hooghly–Burdwan–Paschim Medinipur–Bankura cluster delivers the bulk of state output, anchored by the Kolaghat wholesale market (West Bengal Agriculture Department; BCKV).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["District", "State share", "Notes", "Top varieties"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {districts.map((r, i) => (
                    <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i < 3 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd} data-stat-type="district-share">{r[1]}</td>
                      <td style={{ ...sTd, color: "#666" }}>{r[2]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: West Bengal Agriculture Department; BCKV district production data 2023-24.</p>
            <p style={sP}>The geographical concentration in Hooghly reflects three converging advantages: deep Gangetic alluvial soils ideal for potato, dependable irrigation infrastructure, and the densest cold-storage cluster of any Indian district. Burdwan (now formally Bardhaman) supplies the Damodar Valley belt — a rice-potato rotation system that has anchored agricultural intensity in the region for over a century. Paschim Medinipur and Bankura form the western lateritic-soil belt, while Jalpaiguri represents the spring-potato cycle in North Bengal&apos;s Tarai region. The Kolkata-adjacent districts (Howrah, Hooghly itself) are advantaged by proximity to the largest urban consumer market in eastern India.</p>
            <StatCallout number="76+" unit="units" context="cold storage facilities in Hooghly district alone — the densest district-level cold-storage concentration in India, mirroring its 40% state-output share." source="West Bengal Agriculture Department" />
          </section>

          {/* Card 3 */}
          <section id="why-hooghly" data-card="why-hooghly" style={cardWrap}>
            <h2 id="why-hooghly-h" style={sH2}>Why is Hooghly the largest potato producer in West Bengal?</h2>
            <p style={sIntro}>Hooghly delivers ~40% of West Bengal&apos;s potato production — and is India&apos;s second-largest potato district after Agra — because it combines deep Gangetic alluvial soils, dependable canal-and-tube-well irrigation, the cool November–February rabi-season window, India&apos;s densest cold-storage network (76+ units), and proximity to the Kolaghat wholesale market that aggregates eastern India&apos;s potato distribution (BCKV; <Link href="/answers/famous-potato-city-india" style={linkPlain}>famous potato city analysis</Link>).</p>
            <p style={sP}>The historical depth runs over 70 years. Hooghly&apos;s farmers received recognition in the 1953 colonial-to-post-Independence transition for innovative potato cultivation methods, and the district has held leadership in West Bengal potato production continuously since. The Gangetic alluvial belt of South Bengal — sandy-loam to silty-loam soils with 0.5–1.0% organic matter, pH 6.5–7.0, and excellent drainage — provides textbook potato-growing conditions. Combined with the November–February cool window (mean daytime 18–24°C, nights 10–14°C), the agroclimate sits squarely in the 15–20°C optimal range for tuberization (FAO; CIP).</p>
            <p style={sP}>The Kolaghat market role amplifies Hooghly&apos;s structural advantage. Kolaghat aggregates potato from Hooghly, Howrah, Burdwan, and Paschim Medinipur, distributing to Kolkata urban demand and to consumer markets in Odisha, Jharkhand, Bihar (despite that state&apos;s own production), and the North-East region. The market&apos;s liquidity attracts commission agents, transporters, and processors, deepening the local economic ecosystem around potato. <Link href="/blog/india-potato-production-by-state" style={linkRed}>Read more in the India state-by-state potato production analysis</Link>.</p>
            <p style={sSource}>Source: BCKV; West Bengal Agriculture Department; ICAR-CPRI; Kolaghat market authority data.</p>
          </section>

          {/* Card 4 */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 id="varieties-h-wb" style={sH2}>Which potato varieties are grown in West Bengal?</h2>
            <p style={sIntro}>Kufri Jyoti, released by ICAR-CPRI in 1968 and widely adopted in West Bengal from 1971, dominates state cultivation with over 50% of area share — the longest-running varietal dominance in Indian potato production. Kufri Pukhraj has emerged as the second-most-grown variety; Kufri Chandramukhi continues in legacy areas; and newer Kufri Himalini and Kufri Khyati releases are gradually entering progressive farmer programs (ICAR-CPRI variety register).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Variety", "Released", "Adoption in WB", "End use", "Maturity (days)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={sTd}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR-CPRI variety register; BCKV adoption surveys; West Bengal Agriculture Department.</p>
            <p style={sP}><Link href="/varieties/kufri-jyoti" style={linkRed}>Kufri Jyoti</Link> dominates because it combines high yield potential (35–40 t/ha), 110–125 day maturity matching the rabi cycle, dual table-and-processing utility, acceptable storage life, and strong farmer familiarity built over five decades. The variety&apos;s persistence is also a structural concern — it represents a near-monoculture risk that CPRI has been working to diversify through Kufri Himalini and Kufri Khyati releases. <Link href="/varieties/kufri-pukhraj" style={linkRed}>Kufri Pukhraj</Link> serves the early-market segment with its 70–90 day maturity, allowing harvesters to capture tighter prices before the peak February–March flood. <Link href="/knowledge/kufri-potato-varieties-india" style={linkRed}>Read the complete Kufri varieties guide</Link>.</p>
            <p style={sP}>Certified seed adoption in West Bengal — like the rest of India — runs at 10–15% of farmer base (ICAR-CPRI). The remainder use farm-saved or table-grade seed that accumulates virus loads (PVY, PLRV) over generations, suppressing yields. CPRI&apos;s decentralized seed-multiplication programs partner with FPO networks in Hooghly and Burdwan to extend certified-seed reach. For background on certification see our <Link href="/answers/seed-potato-certification" style={linkRed}>seed potato certification answer</Link> and <Link href="/knowledge/seed-potato-systems" style={linkRed}>seed potato systems article</Link>.</p>
          </section>

          {/* Card 5 */}
          <section id="cold-storage" data-card="cold-storage" style={cardWrap}>
            <h2 id="cold-storage-h-wb" style={sH2}>How many cold storages are there in West Bengal?</h2>
            <p style={sIntro}>West Bengal operates 580+ cold storage units — the second-largest network among Indian states after <Link href="/country/india/uttar-pradesh" style={linkPlain}>Uttar Pradesh</Link>. Hooghly district alone hosts 76+ units, the densest district-level concentration in India and a direct mirror of its ~40% state-output share (West Bengal Agriculture Department).</p>
            <QuickFactsBox items={[
              { label: "Total state units", value: "580+" },
              { label: "Hooghly district", value: "76+ units (densest in India)" },
              { label: "Storage period", value: "8–10 months (Feb harvest → Oct/Nov)" },
              { label: "Typical rental", value: "INR 200–400/quintal/season" },
            ]} />
            <p style={sP}>The dense Hooghly cluster supports both the district&apos;s own production and aggregation from neighboring Howrah, Burdwan, and parts of Bankura. Storage architecture follows the standard Indian pattern of multi-storey ventilated cold rooms with gunny-bag stacking, single-temperature operation around 2–4°C, and ammonia or HCFC refrigeration. The 2024-25 record harvest stressed capacity utilization across the entire state network — sufficient evidence that the structural cold-storage advantage of West Bengal is now bumping against the upper limit of available capacity.</p>
            <p style={sP}>Storage rental rates of INR 200–400 per quintal per season effectively floor summer/autumn potato prices. The economic logic is the same as in UP: farmers store only when expected post-storage selling price covers both the rental and an opportunity-cost return on stored capital. Public schemes — Mission for Integrated Development of Horticulture (MIDH) 35% capital subsidy on new cold storage, Agriculture Infrastructure Fund (AIF) 3% interest subvention — are the central financing tools driving capacity expansion. State-level support from the West Bengal State Agriculture Marketing Board provides additional overlay subsidy for facilities in potato-growing belts. For broader context see our <Link href="/knowledge/potato-storage-cold-chain" style={linkRed}>cold-chain reference</Link> and <Link href="/answers/how-to-build-potato-cold-storage" style={linkRed}>cold storage building answer</Link>.</p>
            <p style={sSource}>Source: West Bengal Agriculture Department; State Agriculture Marketing Board; National Horticulture Board (NHB); ICAR-CPRI.</p>
          </section>

          {/* Card 6 */}
          <section id="msp-procurement" data-card="msp-procurement" style={cardWrap}>
            <h2 id="msp-h" style={sH2}>What is the MSP and procurement scheme for potatoes in West Bengal?</h2>
            <p style={sIntro}>Indian potato is structurally not under the formal Minimum Support Price (MSP) regime — there is no central declared MSP for potato. The West Bengal state government has periodically intervened with administered procurement floor prices (₹900/quintal historical reference for Kufri Jyoti) during glut episodes, but intervention purchases remain minor relative to the overall state crop.</p>
            <p style={sP}>The Kolaghat wholesale market sets effective price discovery for the state, with farm-gate prices typically tracking 65–80% of Kolaghat wholesale after deducting transport and commission. Normal-year mandi prices have ranged INR 600–1,500 per quintal, with glut episodes (notably 2017, 2018, partial 2024-25) pushing prices to INR 200–400 — well below the cost of production for most farmers. Tight-supply years (2019-20, 2024 winter) have seen prices reach INR 1,800–2,500 per quintal. <strong>[DATA NEEDED: live Agmarknet feed integration]</strong> — current pricing reflects multi-year typical ranges; for live state-by-state mandi prices, refer to agmarknet.gov.in.</p>
            <p style={sP}>State procurement during glut years has historically focused on Kufri Jyoti at administered floor prices, with limited operational scale relative to total production volume. The procurement structure in West Bengal differs from rice-and-wheat MSP because cold storage rental of INR 200–400/quintal/season and the perishable nature of potato make large-scale state purchase economically challenging. For the broader market context see our <Link href="/answers/potato-market-price-today" style={linkRed}>potato market price answer</Link>.</p>
            <p style={sSource}>Source: West Bengal Agriculture Department; Agmarknet (Government of India); WBXPress West Bengal Potato Procurement Scheme historical record; State Agriculture Marketing Board.</p>
          </section>

          {/* Card 7 */}
          <section id="processors" data-card="processors" style={cardWrap}>
            <h2 id="processors-h-wb" style={sH2}>Which processors operate in West Bengal?</h2>
            <p style={sIntro}>West Bengal&apos;s processing footprint is more table-stock procurement than integrated frozen-fry manufacturing. Major chip-stock procurement runs through PepsiCo Frito-Lay (Lay&apos;s), ITC Bingo!, and regional snack manufacturers, drawing primarily from Burdwan, Paschim Medinipur, and the broader chip-grade variety supply (<Link href="/knowledge/potato-processing-industry" style={linkPlain}>processing industry article</Link>).</p>
            <p style={sP}>Frozen french fry processing in India is concentrated in <Link href="/country/india/gujarat" style={linkRed}>Gujarat</Link> — HyFun Foods (Mehsana, India&apos;s largest frozen-fry processor at 250K+ t/yr), McCain Foods India (Mehsana), and Iscon Balaji Foods. West Bengal&apos;s role in this chain is currently as a raw-potato supplier rather than as a processing hub. The structural opportunity for West Bengal processing scale-up lies in its productivity advantage (29 t/ha state average vs UP&apos;s 26.2 t/ha) and existing cold-chain infrastructure — but variety supply is dominated by Kufri Jyoti, which is more suited to table use than to chip or frozen processing. Diversification toward chip-suitable varieties like Kufri Khyati and Kufri Chipsona-3 is part of the long-run pathway.</p>
            <p style={sP}>Smaller regional snack manufacturers — including Calcutta Sweets and other Bengal brand chip operations — source chip-stock locally for boutique markets. The PepsiCo Frito-Lay procurement program operates contract grower relationships with farmers in selected blocks of Burdwan and Hooghly under tight specific-gravity and reducing-sugar specifications. Read the broader <Link href="/knowledge/how-potatoes-are-processed" style={linkRed}>how potatoes are processed</Link> reference for the full manufacturing flow.</p>
            <p style={sSource}>Source: ICAR-CPRI; West Bengal Agriculture Department; PepsiCo India operations; ITC Bingo! procurement; Potatopedia processor research.</p>
          </section>

          {/* Card 8 */}
          <section id="schemes" data-card="schemes" style={cardWrap}>
            <h2 id="schemes-h-wb" style={sH2}>What government schemes support West Bengal potato farmers?</h2>
            <p style={sIntro}>West Bengal potato farmers access a layered scheme stack: Mission for Integrated Development of Horticulture (MIDH) 35% capital subsidy on cold storage; Agriculture Infrastructure Fund (AIF) 3% interest subvention; Pradhan Mantri Fasal Bima Yojana (PMFBY) crop insurance with potato as a notified commercial crop; Operation Greens transport-and-storage subsidies during glut years; and West Bengal State Agriculture Marketing Board cold-storage support overlay (Department of Agriculture &amp; Farmers Welfare; West Bengal State Government).</p>
            <QuickFactsBox items={[
              { label: "Cold storage subsidy (central)", value: "35% MIDH/NHB + state overlay" },
              { label: "AIF interest subvention", value: "3% on loans up to INR 2 crore" },
              { label: "PMFBY (potato)", value: "Notified commercial-crop premium 5% farmer share" },
              { label: "Operation Greens (TOP-Plus)", value: "Up to 50% transport + storage subsidy in glut" },
            ]} />
            <p style={sP}>The MIDH 35% subsidy combined with state-level overlay can push effective subsidy on a 5,000-tonne facility to 45–55% of project cost. AIF&apos;s 3% interest subvention applies to loans up to INR 2 crore for a 7-year tenor with CGTMSE credit guarantee — the most efficient financing route for FPO-scale and primary processing units. Operation Greens (originally launched to stabilize Tomato-Onion-Potato value chains and now expanded as TOP-Plus to 22 perishables) provides up to 50% subsidy on transport and short-term storage rental during glut episodes. PMFBY for potato — notified as a commercial crop in WB — runs on the 5% farmer-share premium with the gross premium subsidized 50:50 between Centre and State up to specified caps.</p>
            <p style={sP}>State-level support adds another layer through the West Bengal State Agriculture Marketing Board, which provides additional cold-storage overlay subsidies in potato-growing belts including Hooghly, Burdwan, and Paschim Medinipur (Millennium Post 2025 reporting). The combined central + state stack typically takes effective project subsidy on greenfield potato cold storage to 50–60% of capex. PLI (Production Linked Incentive) Food Processing extends 4–10% incremental sales incentives over six years to qualifying processors — relevant to West Bengal for any chip or frozen-fry investor entering the state.</p>
            <p style={sSource}>Source: Ministry of Agriculture &amp; Farmers Welfare scheme guidelines; West Bengal State Agriculture Marketing Board; MoFPI PMKSY/PLI; Millennium Post (2025).</p>
          </section>

          {/* Card 9 */}
          <section id="climate" data-card="climate" style={cardWrap}>
            <h2 id="climate-h-wb" style={sH2}>What is the climate and soil profile for potato in West Bengal?</h2>
            <p style={sIntro}>West Bengal&apos;s potato belt sits on Gangetic alluvial soils — sandy-loam to silty-loam profiles with pH 6.5–7.0 and excellent drainage — under a sub-tropical winter climate that delivers the cool 15–20°C tuberization window potato requires (FAO; CIP; BCKV).</p>
            <p style={sP}>The South Bengal potato belt&apos;s agroclimate is similar to UP&apos;s western belt but with higher humidity and slightly milder winter temperatures. Mean daytime temperatures from December to February sit at 18–24°C, with nighttime lows of 10–14°C — squarely in the optimal range for tuber initiation. The combination of soil quality, irrigation infrastructure, and climatic match is what produces the state&apos;s above-average yield of approximately 29 t/ha. The North Bengal districts (Jalpaiguri, Cooch Behar, Darjeeling foothills) offer different agroecological conditions suited to spring-cycle potato production at higher altitudes and on lateritic soils.</p>
            <p style={sP}>Climate change pressure is real but structurally less acute than in <Link href="/country/india/bihar" style={linkRed}>Bihar</Link> or <Link href="/country/india/uttar-pradesh" style={linkRed}>UP</Link> because the South Bengal belt&apos;s humidity buffers some heat-stress impact and the Gangetic alluvial soils maintain moisture longer than continental black-cotton soils. Cyclone-window risk during early-season planting (October–November intersection with post-monsoon Bay of Bengal cyclones) is a recurring volatility factor. CIP&apos;s heat-tolerant LBHT clones piloted in <Link href="/country/bangladesh" style={linkPlain}>Bangladesh</Link> are part of the medium-term adaptation pipeline. <Link href="/knowledge/climate-change-potatoes" style={linkRed}>Read the full climate-change-potatoes article</Link>.</p>
            <p style={sSource}>Source: BCKV; ICAR-CPRI; West Bengal Agriculture Department; FAO; CIP.</p>
          </section>

          {/* Card 10 */}
          <section id="calendar" data-card="calendar" style={cardWrap}>
            <h2 id="calendar-h-wb" style={sH2}>When are potatoes planted and harvested in West Bengal?</h2>
            <p style={sIntro}>The main rabi potato crop in West Bengal is sown in November–December and harvested in February–March. The November planting window is approximately 2–3 weeks later than in <Link href="/country/india/uttar-pradesh" style={linkPlain}>Uttar Pradesh</Link>, reflecting Bengal&apos;s slightly later cool-season onset. North Bengal&apos;s spring potato cycle in Jalpaiguri runs January–February planting against the rabi&apos;s tail (BCKV; ICAR-CPRI).</p>
            <QuickFactsBox items={[
              { label: "Main rabi planting", value: "November 15 – December 20" },
              { label: "Main rabi harvest", value: "February 1 – March 25" },
              { label: "Spring (North Bengal)", value: "Plant Jan–Feb; harvest Apr–May" },
              { label: "Storage entry", value: "Mid-Feb to mid-March (peak loading)" },
            ]} />
            <p style={sP}>The South Bengal potato cycle is a textbook rabi-season operation: November planting catches the post-monsoon soil moisture and cool transition, December–January provides peak tuberization conditions, and February–March harvest captures full yield potential before pre-monsoon humidity rises. Spring potato planting in North Bengal&apos;s Tarai belt operates on a shorter cycle (Kufri Pukhraj 70–90 days dominant) supplying fresh-market table potato during the supply gap between rabi crop exhaustion and the next year&apos;s rabi crop arriving. Cyclone-window risk during October–November planting (Bay of Bengal cyclones can disrupt early establishment) is a recurring volatility factor that occasional years amplify dramatically.</p>
            <p style={sP}>Cold-storage entry concentrates in late February through mid-March, with the 580+ unit network testing capacity utilization during peak loading. Strategic farmers with storage capacity hold through to October or November to capture price recovery; farmers without storage access sell into the harvest-window glut at depressed mandi prices. For practical sowing-time guidance see our <Link href="/answers/when-to-plant-potatoes" style={linkRed}>when to plant potatoes answer</Link>.</p>
            <p style={sSource}>Source: BCKV; ICAR-CPRI; West Bengal Agriculture Department; FAO crop calendars.</p>
          </section>

          {/* Card 11 — Challenges */}
          <section id="challenges" data-card="challenges" style={cardWrap}>
            <h2 id="challenges-h-wb" style={sH2}>What are the biggest challenges facing West Bengal potato farmers?</h2>
            <p style={sIntro}>West Bengal potato farmers face five interlocking constraints: severe price volatility in glut years, near-monoculture exposure to Kufri Jyoti (&gt;50% of state area), limited certified-seed adoption (10–15%), late-blight pressure during cool-wet windows, and storage rental cost burden (INR 200–400/quintal/season) that structures the entire post-harvest economic cycle (BCKV; ICAR-CPRI; West Bengal Agriculture Department).</p>
            <p style={sP}>Price volatility has been the single most acute issue across the past decade. Glut years (2017, 2018, partial 2024-25) have produced INR 200–400/quintal price collapses against typical INR 600–1,500 normal-year ranges — well below the cost of production for most farmers. The structural cause is the absence of a formal MSP regime combined with a state-level procurement scheme that operates only sporadically. The Kolaghat market&apos;s aggregation efficiency cuts both ways: it provides liquid price discovery in normal years but transmits glut signals downward without any administered floor. State-level intervention discussions during the 2024-25 record harvest illustrated the recurring tension between farmer income stability and storage-rental-cost economics.</p>
            <p style={sP}>The structural Kufri Jyoti monoculture is a slower-moving but real risk. With over 50% of state area on a single 1968-released variety, a novel pathogen capable of breaking Jyoti&apos;s resistance package would have catastrophic regional consequences. CPRI&apos;s push to diversify toward Kufri Himalini, Kufri Khyati, and chip-suitable Kufri Chipsona-3 is part of the long-run pathway, but adoption remains concentrated among progressive farmer cohorts. CIP&apos;s decentralized seed-multiplication programs partner with FPO networks in Hooghly and Burdwan to extend certified-seed reach. <Link href="/knowledge/potato-diseases-pests" style={linkRed}>Read about potato diseases and pests</Link> for context on the monoculture risk profile.</p>
            <p style={sSource}>Source: BCKV; ICAR-CPRI; West Bengal Agriculture Department; CIP East Asia and South Asia programs.</p>
          </section>

          <SourceBlock sources={[
            "Department of Agriculture & Farmers Welfare (DAFW), Government of India — All-India crop production data 2023-24",
            "ICAR-CPRI (Central Potato Research Institute, Shimla) — variety register, agronomic advisories",
            "BCKV (Bidhan Chandra Krishi Viswavidyalaya) — AICRP on Potato; West Bengal varietal adoption surveys",
            "West Bengal Agriculture Department — district-level potato production data; cold storage statistics",
            "State Agriculture Marketing Board, West Bengal — cold storage support, marketing infrastructure",
            "Ministry of Agriculture & Farmers Welfare — MIDH/NHB, AIF, PMFBY, Operation Greens scheme guidelines",
            "Agmarknet — Kolaghat and other West Bengal mandi price reporting",
            "Millennium Post (2025) — West Bengal cold storage support reporting",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="west-bengal" />

          <ContinueReading articles={[
            { href: "/knowledge/kufri-potato-varieties-india", tag: "Varieties", title: "Kufri Potato Varieties: India's Complete Guide", desc: "Kufri Jyoti's 50+ year run, plus newer Kufri Himalini, Khyati, Chipsona, and Chipbharat releases." },
            { href: "/knowledge/potato-storage-cold-chain", tag: "Storage", title: "Potato Cold Storage: Temperatures, Design, Post-Harvest Losses", desc: "India's ~38–40M tonne cold storage system; West Bengal holds 580+ units (76+ in Hooghly alone)." },
            { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems: Certification, Multiplication, Trade", desc: "Why only 10–15% of Indian farmers use certified seed — and what CPRI/CIP partnerships in Bengal are doing about it." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State — A Story-Format Deep Dive", desc: "Why Hooghly is special, what makes Bengal's cold-storage cluster work, and where the structural pressure is building." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 3: Bihar ── */

function BiharState() {
  const districts = [
    ["Nalanda", "#1 district", "Hilsa market hub; CPRI legacy district", "Kufri Anand, Sindhuri"],
    ["Patna", "#2", "Capital-region demand; nearby cold-storage cluster", "Kufri Pukhraj, Anand"],
    ["Vaishali", "#3", "Triangle district; alluvial belt", "Kufri Anand"],
    ["Begusarai", "Major", "Diara-belt potato; Ganga floodplain", "Kufri Sindhuri"],
    ["Samastipur", "Major", "Tirhut belt; Pusa research linkage", "Kufri Anand, Pukhraj"],
    ["Saran (Chhapra)", "Significant", "West-of-Patna belt", "Kufri Pukhraj"],
    ["Muzaffarpur", "Significant", "North Bihar potato", "Kufri Anand"],
    ["Bhojpur (Arrah)", "Significant", "Western potato belt", "Kufri Sindhuri"],
  ];

  const varieties = [
    ["Kufri Anand", "1999", "Wide adoption", "Table + processing", "100–110"],
    ["Kufri Sindhuri", "1967", "Established", "Table + bharta", "110–125"],
    ["Kufri Pukhraj", "1998", "Wide (early)", "Table (early)", "70–90"],
    ["Kufri Khyati", "2010", "Emerging", "Chip-suitable", "90–100"],
    ["Kufri Chandramukhi", "1968", "Declining", "Table", "110–125"],
    ["Kufri Lalit", "2005", "Niche", "Table (red-skinned)", "90–100"],
  ];

  const faqItems = [
    { q: "Which district is the largest potato producer in Bihar?", a: "Nalanda district is the largest potato producer in Bihar, anchoring the Nalanda-Patna-Vaishali triangle that produces the bulk of state output (Department of Agriculture & Farmers Welfare; ICAR-CPRI). Nalanda is also home to the Hilsa wholesale market — Bihar's largest potato distribution hub. Other major districts include Patna, Vaishali, Begusarai, Samastipur, Saran (Chhapra), Muzaffarpur, and Bhojpur." },
    { q: "What is the rank of Bihar in potato production in India?", a: "Bihar ranks #3 in Indian potato production at 9.075 million tonnes — 15.09% of national output (DAFW 2023-24). The state cultivates potato across all 38 districts during the rabi season, with state-average yield of 26.71 tonnes per hectare exceeding the national average of 25 t/ha. Bihar is also historically significant as the original home of the Central Potato Research Institute (CPRI), founded at Patna in 1949 before relocating to Shimla in 1956." },
    { q: "Which variety of potato is grown in Bihar?", a: "Kufri Anand (released by ICAR-CPRI in 1999) and Kufri Sindhuri (released 1967) are the most widely grown varieties in Bihar. Kufri Pukhraj is dominant for early-season production. Newer varieties Kufri Khyati and Kufri Lalit are emerging in progressive farmer programs. Bihar's farmers traditionally favor red-skinned varieties for cultural and culinary preferences." },
    { q: "What is the potato sowing time in Bihar?", a: "Bihar's main rabi potato crop is sown October–November and harvested in February–March, following the standard Indo-Gangetic plain calendar. Spring potato is planted January–February with harvest in April–May. The 80–110 day short rabi window in Bihar reflects the state's transition climate between the cooler western Indo-Gangetic plain and the warmer eastern Bengal." },
    { q: "How many cold storages are there in Bihar?", a: "Bihar has approximately 12.3 lakh tonnes (1.23 million tonnes) of cold storage capacity against potato production exceeding 82 lakh tonnes (8.2 million tonnes) — meaning less than 15% of state production can be stored in cold storage facilities (ICAR-CPRI; NHB). Critically, 12 districts in Bihar have zero cold storage facilities, the most acute storage-gap profile among major Indian potato states." },
    { q: "Why is CPRI history important to Bihar?", a: "The Central Potato Research Institute was originally established at Patna in 1949 as the Indian potato breeding and research hub. CPRI relocated to Shimla in 1956 to access the cool-climate conditions ideal for breeding work, but the original Patna establishment is foundational to Indian potato research. Today, the ICAR-CPRI Patna Aeroponic Centre is restoring research presence in Bihar through advanced minituber multiplication for clean-seed production." },
    { q: "Is potato farming profitable in Bihar?", a: "Profitability is structurally constrained by Bihar's severe cold-storage gap. With <15% of production storable, most Bihar farmers must sell at harvest-window prices — INR 600–1,400/quintal in normal years, but with frequent dips below INR 500 during glut episodes. Farmers in the 12 zero-storage districts face the worst exposure. Progressive farmers using certified seed and intercropping with mustard or wheat report substantially higher net returns." },
    { q: "What are the biggest challenges facing Bihar potato farmers?", a: "The most acute challenge is cold storage capacity — Bihar's 12.3 lakh tonne capacity covers less than 15% of production, with 12 districts having zero facilities (ICAR-CPRI; NHB). Other challenges include certified seed access (10–15% adoption), flood-prone districts, late blight pressure, and harvest-glut price volatility. Post-harvest losses run 20–40% in zero-storage districts." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Bihar Potato Production 2023-24",
    description: "District-wise production, variety adoption, and cold storage gap data for Bihar",
    creator: { "@type": "Organization", name: "Department of Agriculture and Farmers Welfare, Government of India" },
    keywords: "Bihar potato, Nalanda potato, Kufri Anand, CPRI Patna, Indian potato production",
  };

  return (
    <>
      <IndiaStateJsonLd slug="bihar" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Bihar" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Bihar" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>14 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["bihar"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Rank in India", value: "#3 (15.09% of national output)" },
            { label: "Production", value: "9.075M tonnes (DAFW 2023-24)" },
            { label: "Top district", value: "Nalanda (Hilsa market hub)" },
            { label: "Top varieties", value: "Kufri Anand, Sindhuri, Pukhraj" },
            { label: "Yield", value: "26.71 t/ha (above national average)" },
            { label: "Cold storage gap", value: "12 districts have zero facilities" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Bihar produces 9.075 million tonnes of potatoes from 329,000 hectares — 15.09% of India&apos;s national output, making it the third-largest potato-producing state (DAFW, 2023-24).</strong> The Nalanda-Patna-Vaishali triangle anchors production with state-average yield of 26.71 t/ha, above the national average. The state holds historical significance as the birthplace of CPRI (the Central Potato Research Institute), originally established at Patna in 1949 before relocating to Shimla in 1956. Bihar faces India&apos;s most severe cold storage gap — 12 districts have zero cold storage capacity, and overall capacity covers only ~15% of production.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "9.075M t", label: "Annual production" },
            { value: "15.09%", label: "Share of India" },
            { value: "26.71 t/ha", label: "Yield (above natl avg)" },
            { value: "12 districts", label: "Zero cold storage", accent: "#FFB300" },
          ]} />

          {/* Card 1 */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-bh" style={sH2}>How much potato does Bihar produce?</h2>
            <p style={sIntro}>Bihar produced 9.075 million tonnes of potatoes in 2023-24 from 329,000 hectares — 15.09% of India&apos;s national output (DAFW 2023-24; ICAR-CPRI). State-average yield of 26.71 tonnes per hectare exceeds the 25 t/ha national average. Production occurs across all 38 districts during the rabi season, concentrated in the Nalanda-Patna-Vaishali triangle of central Bihar.</p>
            <QuickFactsBox items={[
              { label: "Production (2023-24)", value: "9.075M tonnes" },
              { label: "Cultivated area", value: "329,000 hectares" },
              { label: "Yield", value: "26.71 t/ha" },
              { label: "Share of national output", value: "15.09%" },
            ]} />
            <p style={sP}>Bihar&apos;s 9.075 million tonnes makes it India&apos;s third-largest potato state after <Link href="/country/india/uttar-pradesh" style={linkRed}>Uttar Pradesh</Link> and <Link href="/country/india/west-bengal" style={linkRed}>West Bengal</Link>. The state cultivates potato during a short 80–110 day rabi window — shorter than UP&apos;s 110–125 day cycle because of Bihar&apos;s slightly later cool-season onset and earlier spring warming. Despite the compressed window, state yield of 26.71 t/ha exceeds both the national average and UP&apos;s 26.2 t/ha, reflecting the productivity of Gangetic alluvial soils combined with the rice-potato rotation system established across Bihar&apos;s densely-cropped agricultural belts.</p>
            <p style={sP}>Bihar&apos;s structural challenge is post-harvest, not production. With cold storage capacity covering less than 15% of production and 12 districts having zero facilities (ICAR-CPRI; NHB; Indiastat), the state faces India&apos;s most acute storage gap. Most Bihar farmers must sell into the harvest-window glut at depressed mandi prices, transferring economic value out of the state. The contrast with West Bengal (580+ cold storage units) and UP (16M tonne capacity) is stark — and explains why Bihar&apos;s farmer income remains structurally below what its production volume should support. <Link href="/answers/largest-potato-producer-india" style={linkRed}>Read on India&apos;s top potato producers</Link>.</p>
            <p style={sSource}>Source: Department of Agriculture &amp; Farmers Welfare 2023-24; ICAR-CPRI; Bihar Agriculture Department.</p>
          </section>

          {/* Card 2 */}
          <section id="districts" data-card="districts" style={cardWrap}>
            <h2 id="districts-h-bh" style={sH2}>Which districts produce the most potato in Bihar?</h2>
            <p style={sIntro}>Nalanda district leads Bihar&apos;s potato production, anchoring the Nalanda-Patna-Vaishali triangle of central Bihar (DAFW; ICAR-CPRI). Nalanda&apos;s Hilsa wholesale market serves as the state&apos;s primary potato distribution hub. The full top-district cluster spans the densely-cropped agricultural districts on both banks of the Ganga.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["District", "Rank", "Notes", "Top varieties"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {districts.map((r, i) => (
                    <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i < 3 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={{ ...sTd, color: "#666" }}>{r[2]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR-CPRI; Bihar Agriculture Department; DAFW 2023-24.</p>
            <p style={sP}><strong>[DATA NEEDED: precise district-level production tonnage in 2023-24]</strong> — backend sources confirm the Nalanda-Patna-Vaishali triangle structure and the listed top-8 districts but do not provide uniform absolute tonnage figures by district at the precision available for some other Indian states. Rankings shown reflect ICAR-CPRI&apos;s qualitative ordering and Bihar Agriculture Department aggregations. The triangle district cluster (Nalanda-Patna-Vaishali) plus Begusarai, Samastipur, Saran, Muzaffarpur, and Bhojpur collectively deliver an estimated 65–75% of state output. The Diara belt (river floodplain districts including Begusarai and Samastipur) is particularly productive for table-stock potato grown in rice-potato rotation.</p>
            <StatCallout number="Nalanda" context="leads Bihar's potato production and hosts the Hilsa wholesale market — the state's largest potato distribution hub. The Nalanda-Patna-Vaishali triangle delivers the core of state output." source="ICAR-CPRI; Bihar Agriculture Department" />
          </section>

          {/* Card 3 */}
          <section id="why-nalanda" data-card="why-nalanda" style={cardWrap}>
            <h2 id="why-nalanda-h" style={sH2}>Why is Nalanda the largest potato producer in Bihar?</h2>
            <p style={sIntro}>Nalanda combines four advantages: deep Gangetic alluvial soils with rice-potato rotation depth, dependable irrigation infrastructure, the cool October–February rabi window matching the state&apos;s 80–110 day potato cycle, and the central role of the Hilsa wholesale market that aggregates and distributes potato across eastern Bihar. The district&apos;s historical depth in potato cultivation is anchored in the broader Magadh region&apos;s long agricultural tradition (ICAR-CPRI; Bihar Agriculture Department).</p>
            <p style={sP}>Nalanda&apos;s soil profile — sandy-loam to silty-loam Gangetic alluvium with pH 6.5–7.5 and excellent drainage — is textbook for potato. The district&apos;s position in the central Bihar plain provides reliable canal irrigation and tube-well groundwater access. The intensive multi-cropping system that defines Nalanda agriculture (rice in kharif, potato + wheat in rabi, often with vegetable intercrops) generates the productivity-per-hectare that has anchored district leadership in state potato output for decades. The Hilsa wholesale market — geographically central to Bihar&apos;s potato belt — provides liquid price discovery and aggregation efficiency for both Nalanda and the surrounding triangle districts.</p>
            <p style={sP}>Despite Nalanda&apos;s production leadership, the district shares Bihar&apos;s broader cold-storage constraint. Storage capacity even in the leading districts is significantly thinner than in <Link href="/country/india/uttar-pradesh" style={linkPlain}>Uttar Pradesh&apos;s</Link> Agra-Kannauj cluster or <Link href="/country/india/west-bengal" style={linkPlain}>West Bengal&apos;s</Link> Hooghly cluster. The economic implication is that even Nalanda&apos;s top-tier farmers face glut-window selling pressure during February–March harvest, with limited storage-driven price recovery later in the year.</p>
            <p style={sSource}>Source: ICAR-CPRI; Bihar Agriculture Department; Hilsa market authority.</p>
          </section>

          {/* Card 4 */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 id="varieties-h-bh" style={sH2}>Which potato varieties are grown in Bihar?</h2>
            <p style={sIntro}>Kufri Anand (CPRI release 1999) and Kufri Sindhuri (CPRI release 1967) are the most widely grown potato varieties in Bihar, with Kufri Pukhraj dominant for early-season production. Bihar farmers traditionally favor red-skinned varieties for cultural and culinary preferences, with newer Kufri Lalit (2005) and Kufri Khyati (2010) entering progressive farmer programs (ICAR-CPRI; ICAR Potato Journal).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Variety", "Released", "Adoption in Bihar", "End use", "Maturity (days)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={sTd}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR-CPRI variety register; ICAR Potato Journal South Bihar varietal adoption study; Bihar Agriculture Department.</p>
            <p style={sP}><Link href="/varieties/kufri-anand" style={linkRed}>Kufri Anand</Link> is well-suited to Bihar&apos;s short 100–110 day rabi window, while the older <Link href="/varieties/kufri-sindhuri" style={linkRed}>Kufri Sindhuri</Link> persists through cultural preference for red-skinned table potato (used in traditional Bihari preparations including aloo bharta and various subzi). <Link href="/varieties/kufri-pukhraj" style={linkRed}>Kufri Pukhraj</Link> at 70–90 days enables the early-market window — particularly valuable in Bihar where farmers face cold-storage scarcity and benefit from earlier cash-flow capture. Kufri Lalit (2005) provides another red-skinned option with shorter maturity. Newer chip-suitable Kufri Khyati (2010) is establishing in progressive farmer programs around Patna and Nalanda.</p>
            <p style={sP}>The structural problem with variety adoption in Bihar is the same as elsewhere in India: only 10–15% of farmers use formally certified seed (ICAR-CPRI). Most production runs on farm-saved or table-grade seed that accumulates virus loads (PVY, PLRV) over generations, suppressing yields. The ICAR-CPRI Patna Aeroponic Centre — restoring research presence in CPRI&apos;s original 1949 home — is scaling up minituber multiplication to address the seed gap. <Link href="/knowledge/seed-potato-systems" style={linkRed}>Read more on seed potato systems</Link> and <Link href="/answers/certified-seed-potatoes" style={linkRed}>certified seed potatoes</Link>.</p>
          </section>

          {/* Card 5 */}
          <section id="cold-storage" data-card="cold-storage" style={cardWrap}>
            <h2 id="cold-storage-h-bh" style={sH2}>How much cold storage capacity does Bihar have?</h2>
            <p style={sIntro}>Bihar has approximately 12.3 lakh tonnes (1.23 million tonnes) of cold storage capacity against potato production exceeding 82 lakh tonnes (8.2 million tonnes) — meaning less than 15% of state production can be stored. Critically, 12 districts in Bihar have zero cold storage facilities, the most acute storage gap among major Indian potato states (ICAR-CPRI; NHB; Indiastat).</p>
            <QuickFactsBox items={[
              { label: "Total state capacity", value: "~12.3 lakh tonnes" },
              { label: "vs annual production", value: "82+ lakh tonnes" },
              { label: "Storable share", value: "<15% of production" },
              { label: "Zero-storage districts", value: "12 of 38" },
            ]} />
            <p style={sP}>Bihar&apos;s cold-storage gap is the single most significant structural constraint on state-level farmer income from potato. With less than 15% of production storable, the bulk of Bihar&apos;s 8.2 million tonne annual harvest must move into the market during the February–March harvest window — pushing prices below cost of production for many farmers. Farmers in the 12 zero-storage districts face the worst exposure: they must transport potato out of district to access storage (incurring transport cost) or sell immediately at glut-window prices.</p>
            <p style={sP}>The contrast with <Link href="/country/india/uttar-pradesh" style={linkPlain}>Uttar Pradesh&apos;s</Link> ~16 million tonne capacity and <Link href="/country/india/west-bengal" style={linkPlain}>West Bengal&apos;s</Link> 580+ unit network is stark. UP and WB have built cold-storage networks that allow ware potato to flow into off-season consumer markets at higher post-storage prices; Bihar has not. The structural fix runs through the same financing tools — Mission for Integrated Development of Horticulture (MIDH) 35% capital subsidy, Agriculture Infrastructure Fund (AIF) 3% interest subvention, and the recent Bihar Agriculture Investment Promotion Policy state-level overlay. The bankability constraint for new operators is post-clearance demand: the same cold-storage gap that hurts farmers also discourages investors who fear seasonal underutilization in zero-density districts.</p>
            <p style={sP}>Public investment in cold-storage capacity expansion is a stated state-level priority. The State Cold Storage Mission combined with central-government schemes is intended to expand capacity over the medium term. For broader context see our <Link href="/knowledge/potato-storage-cold-chain" style={linkRed}>cold-chain reference</Link> and <Link href="/answers/how-to-build-potato-cold-storage" style={linkRed}>cold storage building answer</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; National Horticulture Board (NHB); Indiastat aggregated district data; Bihar Agriculture Department.</p>
          </section>

          {/* Card 6 */}
          <section id="mandis" data-card="mandis" style={cardWrap}>
            <h2 id="mandis-h-bh" style={sH2}>What are the major potato mandis in Bihar?</h2>
            <p style={sIntro}>The Hilsa wholesale market in Nalanda district is Bihar&apos;s largest potato distribution hub, complemented by Patna, Muzaffarpur, and Hajipur APMC markets. Mandi prices have ranged INR 600–1,400/quintal in normal years, with frequent dips below INR 500/quintal during glut episodes — directly tied to the state&apos;s severe cold-storage gap (Agmarknet; ICAR-CPRI).</p>
            <p style={sP}>Bihar&apos;s mandi price pattern is structurally more volatile than UP&apos;s or WB&apos;s because the cold-storage gap forces concentrated harvest-window selling. February–March produces price collapses in years when production is high and distribution downstream is limited. Tight-supply years (poor crop, early heat) have seen prices reach INR 1,800–2,200/quintal but these are not reliably recurring. <strong>[DATA NEEDED: live Agmarknet feed integration for Bihar mandis]</strong> — current pricing reflects multi-year typical ranges; the Agmarknet portal at agmarknet.gov.in provides live mandi-by-mandi data for Bihar including Hilsa, Patna, Muzaffarpur, and other markets.</p>
            <p style={sP}>The Hilsa market&apos;s aggregation role is structural to Bihar potato trade. Volumes from Nalanda, Patna, Vaishali, Begusarai, and Samastipur converge on Hilsa for distribution toward Patna urban demand and onward to Jharkhand, Odisha, and parts of UP. Commission agents, transporters, and buyers cluster around Hilsa, providing the core of state-level price discovery.</p>
            <p style={sSource}>Source: Agmarknet; ICAR-CPRI; Bihar Agriculture Marketing Board; Hilsa wholesale market authority.</p>
          </section>

          {/* Card 7 */}
          <section id="processors" data-card="processors" style={cardWrap}>
            <h2 id="processors-h-bh" style={sH2}>Which processors operate in Bihar?</h2>
            <p style={sIntro}>Bihar&apos;s potato processing footprint is limited compared to <Link href="/country/india/gujarat" style={linkPlain}>Gujarat</Link> or even <Link href="/country/india/uttar-pradesh" style={linkPlain}>Uttar Pradesh</Link>. Most chip-stock procurement runs through PepsiCo Frito-Lay, ITC Bingo!, and regional snack manufacturers, sourcing primarily from contract grower programs in Patna and Nalanda districts. Frozen french fry processing has not yet established meaningful presence in Bihar.</p>
            <p style={sP}>The structural barriers to processing scale-up in Bihar are interlocking. First, cold-storage gaps make raw-potato supply chain reliability a challenge for processors. Second, the dominant Kufri Anand and Kufri Sindhuri varieties are less suited to chip processing than chip-stock specialists like Kufri Chipsona-3 or Kufri Khyati. Third, the processed potato value chain&apos;s gravitational center has settled in Gujarat (HyFun Foods, McCain India, Iscon Balaji Foods) and the chip industry&apos;s major plants are in <Link href="/country/india/gujarat" style={linkPlain}>Gujarat</Link>, Rajasthan, and the South Indian belt. Bihar&apos;s role in processing is currently limited to upstream chip-stock supply.</p>
            <p style={sP}>The opportunity for Bihar processing is real but undeveloped. Yield potential is competitive with major processing-state benchmarks; CPRI Patna&apos;s Aeroponic Centre is restoring seed-supply infrastructure; and central-government schemes (PLI Food Processing, Operation Greens transport subsidies) explicitly target value-chain development for staple crops. Realizing this potential depends on parallel cold-storage and contract-farming buildout. <Link href="/knowledge/potato-processing-industry" style={linkRed}>Read more on the global potato processing industry</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; Bihar Agriculture Department; PepsiCo India operations; Potatopedia processor research.</p>
          </section>

          {/* Card 8 */}
          <section id="schemes" data-card="schemes" style={cardWrap}>
            <h2 id="schemes-h-bh" style={sH2}>What government schemes support Bihar potato farmers?</h2>
            <p style={sIntro}>Bihar potato farmers can access a layered scheme stack: Bihar Agriculture Investment Promotion Policy (state-level capital subsidy); Mission for Integrated Development of Horticulture (MIDH) 35% capital subsidy on cold storage; Agriculture Infrastructure Fund (AIF) 3% interest subvention; Pradhan Mantri Fasal Bima Yojana (PMFBY) crop insurance; Operation Greens transport-and-storage subsidies during glut years (Department of Agriculture &amp; Farmers Welfare; Bihar State Government).</p>
            <QuickFactsBox items={[
              { label: "Cold storage subsidy", value: "35% MIDH/NHB + Bihar state overlay" },
              { label: "AIF interest subvention", value: "3% on loans up to INR 2 crore" },
              { label: "PMFBY (potato)", value: "Notified commercial-crop premium" },
              { label: "State Cold Storage Mission", value: "Bihar Agriculture Investment Policy" },
            ]} />
            <p style={sP}>The Bihar Agriculture Investment Promotion Policy provides additional state-level capital subsidy on top of central schemes — typically 10–15% beyond the MIDH/NHB 35% — pushing effective subsidy on a 5,000-tonne cold storage facility to 45–50% of project cost. AIF&apos;s 3% interest subvention applies to loans up to INR 2 crore for a 7-year tenor with CGTMSE credit guarantee. PMFBY for potato as a commercial crop runs on the 5% farmer-share premium with the gross premium 50:50 subsidized between Centre and State.</p>
            <p style={sP}>Operation Greens (TOP-Plus) provides up to 50% subsidy on transport and short-term storage rental during glut episodes — particularly relevant for Bihar given the structural cold-storage gap. The State Cold Storage Mission, embedded in the broader Bihar Agriculture Investment Promotion Policy, is intended to address the 12 zero-storage-district problem through targeted public-private partnership investment. The combined central + state scheme stack provides the financing tools for capacity expansion; the binding constraint has been operator demand and bankability rather than subsidy availability.</p>
            <p style={sSource}>Source: Ministry of Agriculture &amp; Farmers Welfare; Bihar State Government Agriculture Department; MoFPI scheme guidelines.</p>
          </section>

          {/* Card 9 */}
          <section id="climate" data-card="climate" style={cardWrap}>
            <h2 id="climate-h-bh" style={sH2}>What is the climate and soil profile for potato in Bihar?</h2>
            <p style={sIntro}>Bihar&apos;s potato belt sits on Indo-Gangetic alluvial soils — sandy-loam to silty-loam profiles with pH 6.5–7.5 and excellent drainage — under a sub-tropical winter climate that delivers a cool but compressed 80–110 day rabi-season window for tuberization (FAO; CIP; ICAR-CPRI).</p>
            <p style={sP}>Bihar&apos;s agroclimate is a transition between the cooler western Indo-Gangetic plain (UP, Punjab) and the warmer eastern Bengal. The November–January cool window (mean daytime 17–23°C, nights 8–13°C) sits squarely in the 15–20°C optimal range for tuberization but is shorter than UP&apos;s 110–125 day window. This compression is one reason Bihar farmers favor 100–110 day varieties (Kufri Anand) and 70–90 day early varieties (Kufri Pukhraj) over the longer-cycle Kufri Bahar that dominates UP. The shorter window also creates earlier harvest-window glut pressure.</p>
            <p style={sP}>Climate change pressure on Bihar potato is among the most acute in India. Late autumn cooling has shifted later by approximately 1–2 weeks across the past decade, while early spring warming has shifted earlier — squeezing the planting-to-harvest window from both ends. The Diara belt (Ganga floodplain districts) faces additional flood risk that intersects with the rabi-season cycle. Heat-tolerant CIP and CPRI varieties are part of the medium-term adaptation pipeline. <Link href="/knowledge/climate-change-potatoes" style={linkRed}>Read the full climate-change-potatoes article</Link>.</p>
            <p style={sSource}>Source: FAO; CIP; ICAR-CPRI; Bihar Agriculture Department.</p>
          </section>

          {/* Card 10 */}
          <section id="calendar" data-card="calendar" style={cardWrap}>
            <h2 id="calendar-h-bh" style={sH2}>When are potatoes planted and harvested in Bihar?</h2>
            <p style={sIntro}>Bihar&apos;s main rabi potato crop is sown October–November and harvested in February–March, following the standard Indo-Gangetic plain calendar. Spring potato is planted January–February with harvest in April–May. The compressed 80–110 day rabi window favors shorter-maturity varieties like Kufri Anand and Kufri Pukhraj (FAO; ICAR-CPRI; CPRI Patna).</p>
            <QuickFactsBox items={[
              { label: "Main rabi planting", value: "October 15 – November 25" },
              { label: "Main rabi harvest", value: "February 1 – March 20" },
              { label: "Spring potato (selected districts)", value: "Plant Jan–Feb; harvest Apr–May" },
              { label: "Storage entry", value: "Mid-Feb to mid-March (limited capacity)" },
            ]} />
            <p style={sP}>Bihar&apos;s rabi-season cycle is similar to UP&apos;s but slightly shorter on both ends. Sowing-window discipline is critical because the compressed cool-season window leaves less margin for delayed planting. CPRI advisories recommend sowing by mid-November latest for optimal yield. The spring-potato cycle in select districts allows farmers to capture earlier-market prices but operates on a tighter agronomic envelope. Intercropping with mustard or wheat is common, particularly in the rice-potato rotation system that defines central Bihar agriculture.</p>
            <p style={sP}>Cold-storage entry concentrates in late February through mid-March, but Bihar&apos;s 12.3 lakh tonne capacity is exhausted quickly relative to the 82 lakh tonne harvest. Farmers without cold-storage access — particularly in the 12 zero-storage districts — face glut-window selling pressure with no off-season recovery option. Progressive farmers using rice-potato-mustard rotation or potato-onion-vegetable intercrop can partially offset price-volatility risk through diversification. For practical sowing-time guidance see our <Link href="/answers/when-to-plant-potatoes" style={linkRed}>when to plant potatoes answer</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; CPRI Patna Aeroponic Centre; Bihar Agriculture Department; FAO crop calendars.</p>
          </section>

          {/* Card 11 — Challenges */}
          <section id="challenges" data-card="challenges" style={cardWrap}>
            <h2 id="challenges-h-bh" style={sH2}>What are the biggest challenges facing Bihar potato farmers?</h2>
            <p style={sIntro}>Bihar potato farmers face six interlocking constraints, with the cold-storage gap (12 zero-storage districts; &lt;15% of production storable) standing out as the most acute. Other constraints include certified seed access (10–15% adoption), flood-prone Diara districts, late blight pressure, harvest-glut price volatility, and limited downstream processing infrastructure (ICAR-CPRI; Bihar Agriculture Department).</p>
            <p style={sP}>The cold-storage gap is the single largest determinant of farmer income outcomes in Bihar. With most farmers forced into harvest-window selling, the state systematically transfers economic value out of the value chain to traders, processors, and urban consumers in other states. Post-harvest losses run 20–40% in zero-storage districts according to broader Indian post-harvest loss benchmarks (FAO; covered in our <Link href="/knowledge/potato-storage-cold-chain" style={linkRed}>cold-chain article</Link>). Closing this gap is the single highest-leverage policy intervention available in Bihar potato.</p>
            <p style={sP}>The bright signals are real. CPRI Patna&apos;s Aeroponic Centre is restoring research presence in CPRI&apos;s original 1949 home, scaling up minituber production from disease-tested in vitro stock. The Bihar Agriculture Investment Promotion Policy combined with central schemes is producing gradual cold-storage capacity additions. Progressive farmer programs in Nalanda and Patna districts demonstrate yields well above the 26.71 t/ha state average through certified seed and modern agronomy. CIP&apos;s decentralized seed-multiplication programs partner with FPO networks to extend certified-seed reach. <Link href="/knowledge/potato-diseases-pests" style={linkRed}>Read on potato diseases and pests</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; CPRI Patna; Bihar Agriculture Department; FAO; CIP East Asia and South Asia programs.</p>
          </section>

          <SourceBlock sources={[
            "Department of Agriculture & Farmers Welfare (DAFW), Government of India — All-India crop production data 2023-24",
            "ICAR-CPRI (Central Potato Research Institute, Shimla) — Indian variety register",
            "ICAR-CPRI Patna Aeroponic Centre — Bihar minituber multiplication program",
            "Bihar Agriculture Department — district-level potato production data; State Cold Storage Mission",
            "Bihar Agriculture Investment Promotion Policy — state capital subsidy framework",
            "National Horticulture Board (NHB) — cold storage capacity statistics",
            "ICAR Potato Journal — South Bihar varietal adoption surveys",
            "Indiastat — district-level zero cold-storage data aggregation",
            "Agmarknet — Hilsa, Patna, and Muzaffarpur mandi price reporting",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="bihar" />

          <ContinueReading articles={[
            { href: "/knowledge/kufri-potato-varieties-india", tag: "Varieties", title: "Kufri Potato Varieties: India's Complete Guide", desc: "From Kufri Sindhuri (1967) and Kufri Anand (1999) to newer Kufri Lalit and Kufri Khyati releases — Bihar's variety pipeline." },
            { href: "/knowledge/potato-storage-cold-chain", tag: "Storage", title: "Potato Cold Storage: Temperatures, Design, Post-Harvest Losses", desc: "Why cold-chain capacity is the single most acute structural constraint in Bihar potato production." },
            { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems: Certification, Multiplication, Trade", desc: "How CPRI Patna's Aeroponic Centre is restoring research presence in CPRI's original 1949 home." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State — A Story-Format Deep Dive", desc: "Why Bihar's CPRI legacy still shapes Indian potato breeding — and why the state's structural gaps persist." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 4: Gujarat ── */

function GujaratState() {
  const districts = [
    ["Banaskantha", "1.87M tonnes", "29.5 t/ha; #1 producer + 'Bataka Nagari' Deesa", "Kufri Chipsona-3, Lady Rosetta"],
    ["Sabarkantha", "1.297M tonnes", "34.13 t/ha — INDIA'S HIGHEST DISTRICT YIELD", "Kufri Chipsona-3, Atlantic"],
    ["Aravalli", "Major", "Sandwiched between Banaskantha & Sabarkantha", "Kufri Chipsona-3"],
    ["Mehsana", "Significant", "HyFun Foods + McCain India HQ region", "Kufri Chipsona-3, Frysona"],
    ["Patan", "Significant", "Northern Gujarat belt", "Kufri Chipsona-3"],
    ["Anand", "Significant", "Central Gujarat; emerging acreage", "Kufri Pukhraj, Chipsona"],
    ["Kheda", "Significant", "Central Gujarat; emerging", "Kufri Pukhraj"],
    ["Vadodara (rural)", "Niche", "Limited acreage", "Kufri Pukhraj"],
  ];

  const varieties = [
    ["Kufri Chipsona-3", "2005", "Dominant chip stock", "Chip processing", "110–125"],
    ["Kufri Frysona", "2018", "Frozen-fry suitable", "Frozen french fries", "110–125"],
    ["Lady Rosetta", "Imported (PepsiCo contract)", "PepsiCo Lay's contracts", "Chip processing", "100–110"],
    ["Atlantic", "Imported", "Chip processing legacy", "Chip processing", "100–110"],
    ["Santana", "Imported", "Frozen-fry processing", "Frozen french fries", "110–125"],
    ["Innovator", "Imported", "Frozen-fry processing", "Frozen french fries", "110–125"],
    ["Kufri Pukhraj", "1998", "Table + early chip", "Table (early)", "70–90"],
    ["Kufri Bahar", "1980", "Niche table", "Table", "110–125"],
  ];

  const processors = [
    ["HyFun Foods", "Mehsana", "250,000+ t/yr finished", "McDonald's, Burger King, KFC, 45+ export countries"],
    ["McCain Foods India", "Mehsana", "Major plant; significant capacity", "QSR + retail (multinational)"],
    ["Balaji Wafers", "North Gujarat", "Large chip processor", "Indian retail (Balaji brand)"],
    ["PepsiCo Frito-Lay", "Contract growers", "Lay's procurement", "Lay's brand (India)"],
    ["Iscon Balaji Foods", "Gujarat", "Frozen processor", "Domestic + export"],
  ];

  const faqItems = [
    { q: "Which district is the largest potato producer in Gujarat?", a: "Banaskantha district leads Gujarat's potato production with 1.87 million tonnes from 53,548 hectares at a productivity of 29.5 tonnes per hectare (Gujarat Agriculture Department; ICAR-CPRI 2024-25). Banaskantha also hosts Deesa, often called 'Bataka Nagari' (Potato City), and anchors India's largest potato processing belt. Other major districts include Sabarkantha (highest district yield in India at 34.13 t/ha), Aravalli, Mehsana, and Patan." },
    { q: "Why is Deesa famous for potato?", a: "Deesa is widely known as 'Bataka Nagari' — Gujarati for 'Potato City' — because of its central role in Banaskantha district's potato cultivation and processing belt. Deesa's prominence emerged from a combination of sandy-loam soils ideal for potato, drip irrigation infrastructure adopted at scale across North Gujarat, contract-farming density tied to HyFun Foods and PepsiCo, and the wholesale market that aggregates the Banaskantha-Sabarkantha-Aravalli production cluster." },
    { q: "Which is the highest producer of processed potatoes in India?", a: "Gujarat is India's #1 processed-potato state, with over 25% of state potato production going to chips and frozen french fry processing — the highest processed share of any Indian state (Gujarat Agriculture Department; ICAR-CPRI 2024-25). HyFun Foods (Mehsana) is India's largest frozen french fry processor at 250,000+ tonnes per year of finished output, supplying McDonald's, Burger King, and KFC across 45+ export countries." },
    { q: "What variety of potato is grown in Gujarat?", a: "Kufri Chipsona-3 (CPRI release 2005) is the dominant chip-stock variety in Gujarat. Other major varieties include Kufri Frysona (2018, frozen-fry suitable), and contracted-imported varieties Lady Rosetta (PepsiCo), Atlantic, Santana, and Innovator (frozen processing). Kufri Pukhraj serves the table-and-early-chip segment. Variety selection is heavily driven by processor procurement specifications." },
    { q: "What is the productivity of potato in Gujarat?", a: "Gujarat's state-average potato productivity is 29–34 tonnes per hectare — the highest among major Indian potato states (Gujarat Agriculture Department; ICAR-CPRI). Sabarkantha district at 34.13 t/ha is India's highest district-level potato yield. Banaskantha sits at 29.5 t/ha. The productivity advantage reflects sandy-loam soils, drip irrigation adoption (highest among Indian states), processor-aligned variety selection, and tight contract-farming protocols." },
    { q: "Who is HyFun Foods?", a: "HyFun Foods is India's largest frozen french fry processor, headquartered in Mehsana, Gujarat with processing capacity exceeding 250,000 tonnes per year. The company has grown 5x in capacity over five years since starting production in 2015, announced USD 101.82 million investment for three new Gujarat plants in March 2024, and exports to 45+ countries supplying global QSR chains including McDonald's, Burger King, and KFC. HyFun supports 15,000 contract farmers, with 1,200 in Mehsana alone." },
    { q: "How many cold storages does Gujarat have for potatoes?", a: "Gujarat operates over 1,500 cold storage facilities, the most comprehensive cold storage network in India for potato (Gujarat Agriculture Department). Concentration is in the Banaskantha-Mehsana belt — Mehsana alone has 30 WDRA-registered warehouses, the most of any state district. The Banaskantha-Mehsana cluster supports both fresh-market distribution and processor procurement chains." },
    { q: "What is the potato season in Gujarat?", a: "Gujarat's main potato crop is sown October–November and harvested in February–March, following the standard rabi calendar. The North Gujarat belt's sandy-loam soils combined with drip irrigation produce India's highest district-level yields. The October–March cool window aligns with the 110–125 day Kufri Chipsona-3 maturity that dominates state acreage." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Gujarat Potato Production 2024-25",
    description: "District-wise production, variety adoption, processor footprint, and cold storage data for Gujarat",
    creator: { "@type": "Organization", name: "Gujarat Agriculture Department" },
    keywords: "Gujarat potato, Banaskantha potato, HyFun Foods, Indian potato processing, Bataka Nagari Deesa",
  };

  return (
    <>
      <IndiaStateJsonLd slug="gujarat" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Gujarat" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Gujarat" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>15 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["gujarat"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Rank in India", value: "#4 in volume; #1 in processing" },
            { label: "Production", value: "4.86M tonnes (Gujarat Ag Dept 2024-25)" },
            { label: "Top district", value: "Banaskantha (1.87M tonnes, 29.5 t/ha)" },
            { label: "Highest yield", value: "Sabarkantha 34.13 t/ha (India's #1)" },
            { label: "Top processor", value: "HyFun Foods (Mehsana, 250K+ t/yr)" },
            { label: "Processed share", value: ">25% of state production" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Gujarat produces 4.859 million tonnes of potatoes annually — India&apos;s 4th largest in volume but #1 in processed-potato output, with over 25% of state production going to chips and frozen french fry processing (Gujarat Agriculture Department; ICAR-CPRI 2024-25).</strong> Banaskantha leads with 1.87 million tonnes (29.5 t/ha), followed by Sabarkantha at 1.297 million tonnes — the highest district yield in India at 34.13 t/ha. Deesa, often called &quot;Bataka Nagari,&quot; anchors the processing belt. HyFun Foods (Mehsana, 250,000+ t/yr capacity) is India&apos;s largest frozen french fry processor.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "4.86M t", label: "Annual production" },
            { value: ">25%", label: "Processed share (#1 in India)" },
            { value: "34.13 t/ha", label: "Sabarkantha — India's #1" },
            { value: "250K+ t/yr", label: "HyFun Foods (Mehsana)" },
          ]} />

          {/* Card 1 */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-gj" style={sH2}>How much potato does Gujarat produce?</h2>
            <p style={sIntro}>Gujarat produces 4.859 million tonnes of potatoes annually — India&apos;s 4th largest in volume, after <Link href="/country/india/uttar-pradesh" style={linkPlain}>Uttar Pradesh</Link>, <Link href="/country/india/west-bengal" style={linkPlain}>West Bengal</Link>, and <Link href="/country/india/bihar" style={linkPlain}>Bihar</Link>. But Gujarat is unambiguously #1 in processed potato — over 25% of state production goes to chips and frozen french fry processing, the highest processed share of any Indian state (Gujarat Agriculture Department; ICAR-CPRI 2024-25).</p>
            <QuickFactsBox items={[
              { label: "Production (2024-25)", value: "4.86 million tonnes" },
              { label: "Cultivated area", value: "~165,000 hectares" },
              { label: "State-average yield", value: "29–34 t/ha (India's highest)" },
              { label: "Processed share", value: ">25% (#1 in India)" },
            ]} />
            <p style={sP}>Gujarat&apos;s production model is structurally different from the other major potato states. While UP, WB, and Bihar grow potato primarily for fresh-market consumption, Gujarat&apos;s sector is processor-anchored. The contract-farming model that links HyFun Foods, McCain Foods India, Balaji Wafers, PepsiCo Frito-Lay, and Iscon Balaji Foods to North Gujarat&apos;s grower base produces a tightly integrated value chain where variety, agronomy, harvest timing, and quality grids are dictated by processor specifications. The result is the highest yields in India (Sabarkantha at 34.13 t/ha is the country&apos;s top-performing district) and the most reliable supply chain for frozen-fry and chip processing.</p>
            <p style={sP}>Gujarat&apos;s drip irrigation adoption is among the highest among Indian states, supported by state-level subsidy programs and processor-anchored contract structures that justify the capex investment. Combined with the sandy-loam soils of North Gujarat, dependable groundwater (despite declining tables), and the October–March cool window matching the rabi cycle, Gujarat has become India&apos;s textbook example of processor-led potato development. <Link href="/knowledge/potato-processing-industry" style={linkRed}>Read on the global potato processing industry</Link>.</p>
            <p style={sSource}>Source: Gujarat Agriculture Department; ICAR-CPRI; HyFun Foods company filings; Department of Agriculture &amp; Farmers Welfare.</p>
          </section>

          {/* Card 2 */}
          <section id="districts" data-card="districts" style={cardWrap}>
            <h2 id="districts-h-gj" style={sH2}>Which districts produce the most potato in Gujarat?</h2>
            <p style={sIntro}>Banaskantha leads Gujarat with 1.87 million tonnes from 53,548 hectares at 29.5 t/ha productivity (Gujarat Agriculture Department 2024-25). Sabarkantha follows at 1.297 million tonnes from 37,999 hectares — but with India&apos;s highest district yield at 34.13 t/ha. Aravalli is the third major producer, sandwiched between the two leading districts. The Banaskantha-Sabarkantha-Aravalli cluster delivers the bulk of state output and anchors the processing supply chain.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["District", "Production / Yield", "Notes", "Top varieties"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {districts.map((r, i) => (
                    <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i < 3 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd} data-stat-type="production-yield">{r[1]}</td>
                      <td style={{ ...sTd, color: "#666" }}>{r[2]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: Gujarat Agriculture Department 2024-25; ICAR-CPRI; HyFun Foods regional sourcing data.</p>
            <p style={sP}>Banaskantha showed 17.1% area growth and 19.7% production growth year-over-year in the most recent season, reflecting both processor-led demand and farmer adoption of higher-yielding chip-stock varieties. Sabarkantha&apos;s 34.13 t/ha productivity benchmark — India&apos;s highest district-level yield — emerges from the combination of sandy-loam soils, drip irrigation adoption, certified seed use, and the rigorous agronomic protocols enforced by processor contracts. Mehsana, where HyFun Foods and McCain Foods India headquarter their major plants, is a smaller producer by tonnage but central to the processing supply chain. Anand and Kheda represent emerging Central Gujarat acreage.</p>
            <StatCallout number="34.13 t/ha" context="Sabarkantha district's potato productivity is the highest of any Indian district — exceeding even the US Pacific Northwest's commercial benchmarks. Reflects sandy-loam soils, drip irrigation, certified seed, and processor-aligned agronomy." source="Gujarat Agriculture Department 2024-25" />
          </section>

          {/* Card 3 */}
          <section id="why-deesa" data-card="why-deesa" style={cardWrap}>
            <h2 id="why-deesa-h" style={sH2}>Why is Deesa called "Bataka Nagari"?</h2>
            <p style={sIntro}>Deesa is widely known as &quot;Bataka Nagari&quot; — Gujarati for &quot;Potato City&quot; — because of its central role in Banaskantha district&apos;s potato cultivation and processing belt. Deesa&apos;s prominence emerged from sandy-loam soils ideal for potato, drip irrigation infrastructure adopted at scale across North Gujarat, contract-farming density tied to HyFun Foods and PepsiCo, and the wholesale market that aggregates the Banaskantha-Sabarkantha-Aravalli production cluster (Gujarat Agriculture Department).</p>
            <p style={sP}>The Bataka Nagari identity is more than nicknaming. Deesa hosts the largest potato wholesale market in Gujarat by volume, aggregating production from across Banaskantha and the surrounding districts. The town has become a center for potato traders, commission agents, transporters, and processor procurement representatives — a structural depth comparable to Agra in <Link href="/country/india/uttar-pradesh" style={linkPlain}>UP</Link> or Hilsa in <Link href="/country/india/bihar" style={linkPlain}>Bihar</Link>. The combination of high-productivity farms, dense cold-storage infrastructure, and the largest wholesale market in the state makes Deesa the de facto capital of Indian processed-potato agriculture.</p>
            <p style={sP}>The structural advantages that built Deesa&apos;s position are agronomic, infrastructural, and organizational. Sandy-loam Banaskantha soils with pH 7.0–8.0 and excellent drainage are textbook for potato. North Gujarat&apos;s drip irrigation adoption — among the highest in India — removes water as a yield constraint. Processor-anchored contract farming with HyFun Foods (15,000 contract farmers including 1,200 in Mehsana alone) and PepsiCo&apos;s Lay&apos;s procurement program provides demand certainty that justifies investment in seed, fertilizer, and irrigation infrastructure. The result is the highest-productivity potato region in India, and the only Indian state where processing demand structurally drives the entire value chain. <Link href="/answers/famous-potato-city-india" style={linkRed}>Read more in the famous potato city of India answer</Link>.</p>
            <p style={sSource}>Source: Gujarat Agriculture Department; ICAR-CPRI; HyFun Foods company communications; Banaskantha district government data.</p>
          </section>

          {/* Card 4 */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 id="varieties-h-gj" style={sH2}>Which potato varieties are grown in Gujarat?</h2>
            <p style={sIntro}>Kufri Chipsona-3 (CPRI release 2005) is the dominant chip-stock variety in Gujarat, supplemented by Kufri Frysona (2018) for frozen-fry processing and contracted-imported varieties Lady Rosetta (PepsiCo), Atlantic, Santana, and Innovator. Kufri Pukhraj serves the early-market and table segment. Variety selection in Gujarat is more processor-driven than farmer-preference-driven (ICAR-CPRI; PepsiCo India procurement; HyFun Foods).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Variety", "Origin / Released", "Adoption in Gujarat", "End use", "Maturity (days)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={sTd}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR-CPRI variety register; Gujarat Agriculture Department; PepsiCo India procurement specifications; HyFun Foods variety contracts.</p>
            <p style={sP}><Link href="/varieties/kufri-chipsona-3" style={linkRed}>Kufri Chipsona-3</Link> dominates because it was specifically bred for Indian conditions to replace imported Atlantic seed that Indian chip industry historically depended on. Its high specific gravity (1.080+), low reducing sugar accumulation, and acceptable storage life make it ideal for chip processing. <Link href="/varieties/kufri-frysona" style={linkRed}>Kufri Frysona</Link> (notified 2018) extends this domestic-bred advantage to frozen french fry processing — competing directly with imported Innovator and Russet Burbank. The contracted-imported varieties (Lady Rosetta, Atlantic, Santana, Innovator) flow through processor-managed supply chains with imported breeder seed multiplied locally under license. <Link href="/knowledge/mcdonalds-potato-varieties" style={linkRed}>McDonald&apos;s variety specifications</Link> (covered in our dedicated article) align closely with what HyFun Foods sources from Gujarat for export markets.</p>
            <p style={sP}>Gujarat&apos;s certified seed adoption is significantly higher than other Indian potato states because of processor-led contract structures. Where the all-India certified seed adoption rate sits at 10–15%, Gujarat&apos;s contract-farming clusters in Banaskantha, Sabarkantha, and Mehsana operate at much higher certified-seed rates — a major reason for the state&apos;s 29–34 t/ha yields versus the 22–28 t/ha typical elsewhere in India. <Link href="/knowledge/seed-potato-systems" style={linkRed}>Read more on seed potato systems</Link>.</p>
          </section>

          {/* Card 5 */}
          <section id="processing-leadership" data-card="processing" style={cardWrap}>
            <h2 id="processing-h" style={sH2}>Why does Gujarat dominate processed potato in India?</h2>
            <p style={sIntro}>Gujarat dominates processed potato in India because of five reinforcing factors: India&apos;s highest district-level productivity (Sabarkantha 34.13 t/ha), processor-aligned variety acreage (Kufri Chipsona-3, Frysona, contracted Lady Rosetta), the highest drip irrigation adoption among Indian states, the densest processor cluster in India (HyFun, McCain, Balaji, PepsiCo, Iscon), and contract-farming infrastructure that sustains 15,000+ farmers (HyFun Foods alone) across the Banaskantha-Mehsana belt (Gujarat Agriculture Department; HyFun Foods filings).</p>
            <p style={sP}>The economic logic of Gujarat&apos;s processing dominance starts with productivity. A processor paying for raw potato by weight pays less per finished-product kilogram when the input source delivers 30+ t/ha rather than 22 t/ha. Combined with chip-stock-suitable variety acreage (Kufri Chipsona-3 acreage in Gujarat is structurally larger than in any other Indian state), the per-unit cost economics tilt sharply in Gujarat&apos;s favor. The drip irrigation adoption advantage adds water-cost efficiency and yield consistency that processor-led demand requires. The result is a processing belt where the per-tonne economics of converting field potato into chip or frozen french fry are the most favorable in India.</p>
            <p style={sP}>The processor cluster reinforces itself. With HyFun Foods (250K+ t/yr finished output, 45+ export countries), McCain Foods India (Mehsana plant), Balaji Wafers (chip processor), PepsiCo Frito-Lay (Lay&apos;s contracts), and Iscon Balaji Foods all operating within a 100-km radius, the contract-farming infrastructure, agronomic extension, seed multiplication, and post-harvest aggregation capacity is shared across the cluster. New processor entrants benefit from existing infrastructure rather than building from scratch. The MoFPI PLI Food Processing scheme, providing 4–10% incremental sales incentives over six years, has further accelerated capex in Gujarat over the last five years.</p>
            <StatCallout number="15,000" context="contract farmers in HyFun Foods' Gujarat supply network — 1,200 in Mehsana alone — making Gujarat's processor-anchored model the most integrated potato value chain in India." source="HyFun Foods company communications" />
          </section>

          {/* Card 6 */}
          <section id="cold-storage" data-card="cold-storage" style={cardWrap}>
            <h2 id="cold-storage-h-gj" style={sH2}>How much cold storage capacity does Gujarat have?</h2>
            <p style={sIntro}>Gujarat operates over 1,500 cold storage facilities — the most comprehensive cold storage network in India for potato (Gujarat Agriculture Department). Capacity is concentrated in the Banaskantha-Mehsana belt, with Mehsana alone having 30 WDRA-registered warehouses — the most of any Indian district (WDRA — Warehousing Development and Regulatory Authority).</p>
            <QuickFactsBox items={[
              { label: "Total state facilities", value: "1,500+" },
              { label: "Mehsana WDRA warehouses", value: "30 (most of any state district)" },
              { label: "North Gujarat WDRA cluster", value: "67 facilities" },
              { label: "Concentration", value: "Banaskantha-Mehsana belt" },
            ]} />
            <p style={sP}>Gujarat&apos;s cold-storage profile is structurally different from <Link href="/country/india/uttar-pradesh" style={linkPlain}>UP&apos;s</Link> or <Link href="/country/india/west-bengal" style={linkPlain}>WB&apos;s</Link>. Where UP&apos;s 16M-tonne and WB&apos;s 580+ unit networks primarily serve fresh-market table-potato distribution, Gujarat&apos;s cold-storage capacity is heavily processor-linked. Many Banaskantha-Mehsana facilities operate as integrated extensions of HyFun Foods, McCain India, and Balaji procurement chains, with storage protocols tightly synchronized to processor production schedules. WDRA registration of 30 Mehsana warehouses reflects the formalization of this processor-anchored storage infrastructure under the central warehousing regulatory framework.</p>
            <p style={sP}><strong>[DATA NEEDED: precise cold storage tonnage capacity for Gujarat at state level and district level]</strong> — backend confirms 1,500+ facility count and Mehsana WDRA detail; absolute tonnage capacity at state level is not available in current ingested sources at the same precision as for UP or WB. The qualitative picture is clear: Gujarat&apos;s cold-storage network is the most processor-integrated and highest-quality (in terms of WDRA-registration share) of any Indian state, even if the absolute tonnage may not exceed UP&apos;s 16M tonnes.</p>
            <p style={sSource}>Source: Gujarat Agriculture Department; WDRA (Warehousing Development and Regulatory Authority); HyFun Foods filings; ICAR-CPRI.</p>
          </section>

          {/* Card 7 */}
          <section id="processors" data-card="processors" style={cardWrap}>
            <h2 id="processors-h-gj" style={sH2}>Which processors operate in Gujarat?</h2>
            <p style={sIntro}>Gujarat hosts India&apos;s densest potato-processor cluster, headquartered around Mehsana and Banaskantha. HyFun Foods (Mehsana, 250K+ t/yr finished output) is India&apos;s largest frozen french fry processor. McCain Foods India operates a major Mehsana plant. Balaji Wafers is a major chip processor. PepsiCo Frito-Lay operates Lay&apos;s contract grower programs. Iscon Balaji Foods operates frozen processing capacity (HyFun Foods filings; ICAR-CPRI).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Processor", "Plant location", "Capacity / scope", "End markets"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {processors.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={{ ...sTd, color: "#666" }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: HyFun Foods company filings; McCain Foods India operations; Balaji Wafers; PepsiCo India procurement; Iscon Balaji Foods.</p>
            <p style={sP}>HyFun Foods is the centerpiece of Gujarat&apos;s processing dominance. The company has grown 5x in capacity over five years since starting production in 2015, announced USD 101.82 million investment for three new Gujarat plants in March 2024, and supplies global QSR chains including McDonald&apos;s, Burger King, and KFC across 45+ export countries. HyFun&apos;s 15,000-farmer contract network — 1,200 in Mehsana alone — represents the most integrated processor-anchored potato supply chain in India. McCain Foods India&apos;s Mehsana plant operates parallel scale and serves both export and domestic markets. Balaji Wafers anchors the chip-stock procurement chain for Indian retail. <Link href="/knowledge/potato-processing-industry" style={linkRed}>Read on the global potato processing industry</Link> and <Link href="/knowledge/mcdonalds-potato-varieties" style={linkRed}>McDonald&apos;s potato varieties</Link>.</p>
          </section>

          {/* Card 8 */}
          <section id="mandis" data-card="mandis" style={cardWrap}>
            <h2 id="mandis-h-gj" style={sH2}>What are the major potato mandis in Gujarat?</h2>
            <p style={sIntro}>Deesa is Gujarat&apos;s largest potato wholesale market, complemented by Palanpur, Himmatnagar, and Mehsana APMC markets. Processing-grade potato (Kufri Chipsona-3, Lady Rosetta) commands a price premium of 10–25% over table-grade potato due to processor procurement specifications and quality grids (Gujarat Agriculture Department; Agmarknet).</p>
            <p style={sP}>Gujarat&apos;s mandi structure differs from fresh-market-driven states. Most processor procurement runs through direct contract relationships rather than mandi auctions, but the Deesa wholesale market remains the price-discovery anchor for non-contracted production and for processor procurement that extends beyond contracted volumes. Normal-year mandi prices have ranged INR 700–1,500 per quintal for table-grade potato; chip-stock contract prices typically run INR 100–250 above mandi reference. Glut episodes (rare in Gujarat because of processor-anchored offtake) and tight-supply years compress and expand this differential.</p>
            <p style={sP}>The economic structure of Gujarat&apos;s potato pricing is more stable than UP&apos;s or WB&apos;s because contract farming covers a higher share of state production. <strong>[DATA NEEDED: live Agmarknet feed for Gujarat mandis]</strong> — current pricing reflects multi-year typical ranges; live mandi-by-mandi data is available at agmarknet.gov.in including Deesa, Palanpur, and other Gujarat markets. <Link href="/answers/potato-market-price-today" style={linkRed}>Read the potato market price answer</Link>.</p>
            <p style={sSource}>Source: Gujarat Agriculture Department; Agmarknet; APMC Deesa market authority.</p>
          </section>

          {/* Card 9 */}
          <section id="schemes" data-card="schemes" style={cardWrap}>
            <h2 id="schemes-h-gj" style={sH2}>What government schemes support Gujarat potato farmers?</h2>
            <p style={sIntro}>Gujarat potato farmers access a layered scheme stack: Gujarat State Agriculture Investment Promotion (state-level capital subsidy); Mission for Integrated Development of Horticulture (MIDH) 35% capital subsidy; Agriculture Infrastructure Fund (AIF) 3% interest subvention; PMFBY crop insurance; MoFPI PLI Food Processing scheme (where qualifying); state-level drip irrigation subsidy (highest adoption among Indian states); Operation Greens TOP-Plus during glut years.</p>
            <QuickFactsBox items={[
              { label: "Drip irrigation subsidy", value: "Up to 50–55% (state + central)" },
              { label: "Cold storage subsidy", value: "35% MIDH/NHB + state overlay" },
              { label: "PLI Food Processing", value: "4–10% incremental sales incentive" },
              { label: "PMFBY (potato)", value: "Notified commercial-crop premium" },
            ]} />
            <p style={sP}>Drip irrigation adoption in Gujarat is the highest among Indian potato states, supported by the state&apos;s Drip Irrigation Promotion programme combined with central PMKSY (Pradhan Mantri Krishi Sinchayee Yojana) subsidy. Combined subsidy can cover 50–55% of drip system capex, making it bankable even for smallholders. This is one of the structural reasons for Gujarat&apos;s yield advantage. The MoFPI PLI Food Processing scheme has particularly accelerated processor capex in Gujarat — HyFun Foods&apos; USD 101.82 million 2024 investment for three new plants is partially supported by PLI eligibility.</p>
            <p style={sP}>The Gujarat State Agriculture Investment Promotion adds state-level capital subsidy on top of central schemes for cold storage, packhouses, and processing units. Combined effective subsidy on a 5,000-tonne cold-storage facility can reach 50–60% of project cost. PMFBY for potato as a notified commercial crop runs on the 5% farmer-share premium with central + state subsidy on the gross premium. <Link href="/answers/potato-water-footprint" style={linkRed}>Read on potato water footprint</Link> for context on Gujarat&apos;s drip irrigation advantage.</p>
            <p style={sSource}>Source: Gujarat State Agriculture Department; Ministry of Agriculture &amp; Farmers Welfare; MoFPI PLI guidelines.</p>
          </section>

          {/* Card 10 */}
          <section id="climate" data-card="climate" style={cardWrap}>
            <h2 id="climate-h-gj" style={sH2}>What is the climate and soil profile for potato in Gujarat?</h2>
            <p style={sIntro}>Gujarat&apos;s North Gujarat potato belt sits on Banaskantha sandy-loam soils with pH 7.0–8.0 and excellent drainage, under a semi-arid sub-tropical winter climate that delivers the cool 15–20°C window potato requires for tuberization (FAO; CIP; Gujarat Agriculture Department).</p>
            <p style={sP}>The North Gujarat agroclimatic zone offers four production advantages: sandy-loam soils ideal for potato (well-drained, manageable nutrient retention, low compaction risk); a December–February cool window with mean daytime 22–26°C and nights 10–14°C — slightly warmer than the Indo-Gangetic plain but still within tuberization range; dependable groundwater (despite declining tables) supplemented by surface water from the Sardar Sarovar Project; and the highest drip irrigation infrastructure adoption among Indian potato states. The climate is drier than UP&apos;s or WB&apos;s, reducing late blight pressure but increasing irrigation requirement.</p>
            <p style={sP}>Climate change pressure on Gujarat potato is real but partially offset by the state&apos;s structural advantages. The October–March cool window has compressed slightly across the past decade, but drip irrigation efficiency and processor-aligned variety selection (which prioritizes heat tolerance) provide adaptive flexibility. Groundwater depletion is the most acute medium-term threat, particularly in the Banaskantha cluster where tube-well dependence is high. <Link href="/knowledge/climate-change-potatoes" style={linkRed}>Read the full climate-change-potatoes article</Link>.</p>
            <p style={sSource}>Source: Gujarat Agriculture Department; ICAR-CPRI; FAO; CIP.</p>
          </section>

          {/* Card 11 */}
          <section id="calendar" data-card="calendar" style={cardWrap}>
            <h2 id="calendar-h-gj" style={sH2}>When are potatoes planted and harvested in Gujarat?</h2>
            <p style={sIntro}>Gujarat&apos;s main potato crop is sown October–November and harvested in February–March, following the standard rabi calendar. Processor-anchored harvest scheduling is more tightly synchronized than fresh-market production in other states — variety planting dates align with processor production schedules to ensure continuous supply across the Feb–April peak processing window (Gujarat Agriculture Department; HyFun Foods; ICAR-CPRI).</p>
            <QuickFactsBox items={[
              { label: "Main rabi planting", value: "October 15 – November 15" },
              { label: "Main rabi harvest", value: "February 1 – March 30" },
              { label: "Processing peak window", value: "February – April (post-harvest)" },
              { label: "Storage entry", value: "March (processor-aligned)" },
            ]} />
            <p style={sP}>Gujarat&apos;s sowing-window discipline is among the tightest in India because contract structures dictate planting dates. HyFun Foods, McCain India, and PepsiCo&apos;s contract farmer programs typically specify variety, planting window, irrigation schedule, and harvest date — providing yield certainty in exchange for processor procurement guarantees. The result is the highest yield consistency in India and the most reliable raw-material supply for processor production scheduling.</p>
            <p style={sP}>Cold-storage entry concentrates in March, with processors operating just-in-time procurement schedules that move raw potato from field through cold storage into processing within tight windows. The Banaskantha-Mehsana cluster&apos;s 1,500+ cold storage facilities provide the buffer that allows continuous processing across the Feb–April peak window and into the off-season period when stored raw potato moves into the chip and frozen-fry production lines.</p>
            <p style={sSource}>Source: Gujarat Agriculture Department; HyFun Foods; ICAR-CPRI; FAO crop calendars.</p>
          </section>

          <SourceBlock sources={[
            "Gujarat Agriculture Department — district-level potato production data 2024-25",
            "ICAR-CPRI (Central Potato Research Institute, Shimla) — Indian variety register, varietal advisories",
            "HyFun Foods — company filings, sustainability reports, contract-farming network data",
            "McCain Foods India — Mehsana plant operations, sustainability disclosures",
            "PepsiCo India — Frito-Lay procurement specifications and contract grower data",
            "Department of Agriculture & Farmers Welfare (DAFW), Government of India",
            "MoFPI — PLI Food Processing scheme guidelines",
            "WDRA (Warehousing Development and Regulatory Authority) — Mehsana cold storage data",
            "Banaskantha District Government — district potato production data",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="gujarat" />

          <ContinueReading articles={[
            { href: "/knowledge/potato-processing-industry", tag: "Industry", title: "Global Potato Processing Industry: $80B Market", desc: "Where Gujarat fits in the global frozen-fry and chip processing landscape — McCain, Lamb Weston, HyFun, AVEBE." },
            { href: "/knowledge/mcdonalds-potato-varieties", tag: "Processing", title: "What Potatoes Does McDonald's Use?", desc: "The Russet Burbank specifications that align with HyFun Foods' export procurement to McDonald's, Burger King, and KFC." },
            { href: "/knowledge/kufri-potato-varieties-india", tag: "Varieties", title: "Kufri Potato Varieties: India's Complete Guide", desc: "Kufri Chipsona-3 and Kufri Frysona — the CPRI-bred chip and frozen processing varieties that Gujarat scaled." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State — A Story-Format Deep Dive", desc: "Why Gujarat is India's processed-potato capital, and what the HyFun-McCain-Balaji-PepsiCo cluster means for the broader Indian sector." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 5: Madhya Pradesh ── */

function MadhyaPradeshState() {
  const districts = [
    ["Indore", "#1 district", "Largest mandi; Malwa Plateau anchor", "Kufri Chandramukhi, Lavkar"],
    ["Ujjain", "#2", "Malwa Plateau; chip-stock potential", "Kufri Chandramukhi, Lavkar"],
    ["Gwalior", "#3", "Chambal belt; emerging chip-stock", "Kufri Lavkar, Pukhraj"],
    ["Dewas", "Significant", "Indore-adjacent; rising acreage", "Kufri Chandramukhi"],
    ["Shajapur", "Significant", "Malwa Plateau emerging belt", "Kufri Lavkar"],
    ["Bhopal", "Significant", "Capital-region demand", "Kufri Chandramukhi"],
  ];

  const varieties = [
    ["Kufri Chandramukhi", "1968", "Dominant in MP", "Table", "100–110"],
    ["Kufri Lavkar", "1990s", "Chip-suitable", "Chip processing", "90–100"],
    ["Kufri Pukhraj", "1998", "Wide adoption", "Table (early)", "70–90"],
    ["Kufri Chipsona-3", "2005", "Emerging chip stock", "Chip processing", "110–125"],
    ["Kufri Sindhuri", "1967", "Niche red-skinned", "Table", "110–125"],
    ["Kufri Bahar", "1980", "Niche", "Table + processing", "110–125"],
  ];

  const faqItems = [
    { q: "Which district is the largest potato producer in Madhya Pradesh?", a: "Indore district is the largest potato producer in Madhya Pradesh, anchoring the Malwa Plateau cultivation belt. Indore also hosts the largest potato mandi in MP. Other major districts include Ujjain, Gwalior, Dewas, Shajapur, and Bhopal — together forming the core of the state's potato cultivation zone (ICAR-CPRI; MP Agriculture Department)." },
    { q: "What is the rank of MP in potato production?", a: "Madhya Pradesh ranks #5 in Indian potato production at 3.8–3.9 million tonnes annually — approximately 6.8–6.9% of national output (ICAR-CPRI; Ministry of Agriculture). The state's potato production has been on a steady growth trajectory, particularly in the Malwa Plateau districts where chip-stock processing demand is creating new acreage." },
    { q: "Which variety of potato is grown in MP?", a: "Kufri Chandramukhi (CPRI release 1968) and Kufri Lavkar are the dominant potato varieties in Madhya Pradesh. Kufri Lavkar is specifically suitable for chip processing, positioning MP as an important emerging chip-stock supplier alongside Gujarat. Kufri Pukhraj serves the early-market table segment, and Kufri Chipsona-3 is establishing in progressive chip-stock contract programs (ICAR-CPRI variety register)." },
    { q: "Is Malwa Plateau good for potato cultivation?", a: "Yes — Malwa Plateau is among India's most agroclimatically suitable regions for potato cultivation. The plateau offers black-cotton soils with sandy-loam pockets, semi-arid climate with cool winters (15–22°C December–February), elevation that moderates summer heat, and developing irrigation infrastructure. Indore, Ujjain, Dewas, and Shajapur — all on the Malwa Plateau — collectively form MP's core potato belt." },
    { q: "What is the potato sowing time in MP?", a: "ICAR-CPRI guidance places the optimal sowing window in Madhya Pradesh at October 15 to November 10 for the rabi-season crop. Harvest typically falls in February–March. The CPRI-specific window for MP reflects the state's transition climate and the 100–110 day Kufri Chandramukhi maturity that dominates state acreage." },
    { q: "What is the area under potato in Madhya Pradesh?", a: "Madhya Pradesh cultivates potato across approximately 150,000 hectares, primarily in the Malwa Plateau districts (Indore, Ujjain, Dewas, Shajapur) and the Chambal belt (Gwalior). State-average yield of approximately 26 tonnes per hectare is in line with the national average. The acreage has been expanding gradually as chip-stock processing demand creates new market signals." },
    { q: "Is Madhya Pradesh a processed-potato state?", a: "Madhya Pradesh is an emerging processed-potato state, currently operating below Gujarat's processing leadership but with growing chip-stock supply capacity. The dominance of Kufri Lavkar — specifically suitable for chip processing — and the emerging adoption of Kufri Chipsona-3 in contract programs positions MP as a complementary chip-stock supplier to the broader Indian processing chain. Indore-Ujjain hosts emerging chip processing activity." },
    { q: "Which Kufri variety is best for chip processing in MP?", a: "Kufri Lavkar is specifically suited to chip processing in Madhya Pradesh, with Kufri Chipsona-3 (CPRI release 2005) emerging as the next-generation chip stock through progressive farmer programs in Indore and Ujjain districts. Both varieties offer high specific gravity, low reducing sugar accumulation, and acceptable storage life — the technical requirements for chip processing (ICAR-CPRI variety register)." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Madhya Pradesh Potato Production",
    description: "District-wise production, variety adoption, and Malwa Plateau cultivation data for Madhya Pradesh",
    creator: { "@type": "Organization", name: "Madhya Pradesh Agriculture Department" },
    keywords: "Madhya Pradesh potato, Indore potato, Malwa Plateau, Kufri Chandramukhi, Kufri Lavkar",
  };

  return (
    <>
      <IndiaStateJsonLd slug="madhya-pradesh" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Madhya Pradesh" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Madhya Pradesh" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>14 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["madhya-pradesh"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Rank in India", value: "#5 (6.8–6.9% of national output)" },
            { label: "Production", value: "3.88M tonnes (ICAR-CPRI)" },
            { label: "Top district", value: "Indore (Malwa Plateau anchor)" },
            { label: "Top varieties", value: "Kufri Chandramukhi, Kufri Lavkar" },
            { label: "Sowing window", value: "Oct 15 – Nov 10 (CPRI guidance)" },
            { label: "Chip-stock potential", value: "Kufri Lavkar suitable for processing" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Madhya Pradesh produces 3.8–3.9 million tonnes of potatoes annually — approximately 6.8–6.9% of India&apos;s national output (ICAR-CPRI; Ministry of Agriculture).</strong> Indore leads state production, with Ujjain, Gwalior, Dewas, Shajapur, and Bhopal forming the core Malwa Plateau cultivation belt. Kufri Chandramukhi remains the dominant variety, with Kufri Lavkar specifically suited to chip processing — positioning MP as an emerging processed-potato region complementary to <Link href="/country/india/gujarat" style={linkPlain}>Gujarat</Link>. CPRI guidance places the optimal sowing window at October 15 to November 10 for the rabi-season crop.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "3.88M t", label: "Annual production" },
            { value: "6.9%", label: "Share of India" },
            { value: "Indore", label: "#1 district" },
            { value: "Oct 15–Nov 10", label: "Sowing window (CPRI)" },
          ]} />

          {/* Card 1 */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-mp" style={sH2}>How much potato does Madhya Pradesh produce?</h2>
            <p style={sIntro}>Madhya Pradesh produces 3.8–3.9 million tonnes of potatoes annually from approximately 150,000 hectares — 6.8–6.9% of India&apos;s national output, making it the country&apos;s 5th largest potato-producing state (ICAR-CPRI; Ministry of Agriculture). State-average yield of approximately 26 tonnes per hectare is in line with the national average.</p>
            <QuickFactsBox items={[
              { label: "Production", value: "3.88M tonnes" },
              { label: "Cultivated area", value: "~150,000 hectares" },
              { label: "Yield", value: "~26 t/ha (national average)" },
              { label: "Share of national output", value: "6.8–6.9%" },
            ]} />
            <p style={sP}>MP&apos;s 3.88 million tonnes places it well below the volume tier occupied by <Link href="/country/india/uttar-pradesh" style={linkRed}>UP</Link> (20.13M), <Link href="/country/india/west-bengal" style={linkRed}>West Bengal</Link> (11–12M), and <Link href="/country/india/bihar" style={linkRed}>Bihar</Link> (9.075M), but ahead of states outside the top five. The state&apos;s production growth trajectory has been steady, with chip-stock processing demand creating new acreage signals particularly in the Indore-Ujjain Malwa Plateau cluster. State-average yield is broadly aligned with the Indian national average; productivity ceilings sit well below <Link href="/country/india/gujarat" style={linkRed}>Gujarat&apos;s</Link> 29–34 t/ha because of less drip irrigation and certified seed adoption, but above the floor seen in lower-yielding states.</p>
            <p style={sP}>The structural opportunity for MP is processed-potato development. Kufri Lavkar — one of the dominant varieties in the state — is specifically suitable for chip processing. Combined with the Malwa Plateau&apos;s agroclimatic suitability and the emerging chip-stock contract demand, MP is positioned as a complementary chip-stock supplier to the broader Indian processing chain. The pace of this development is more gradual than Gujarat&apos;s, but the medium-term trajectory is real.</p>
            <p style={sSource}>Source: ICAR-CPRI; Ministry of Agriculture; MP State Agriculture Department.</p>
          </section>

          {/* Card 2 */}
          <section id="districts" data-card="districts" style={cardWrap}>
            <h2 id="districts-h-mp" style={sH2}>Which districts produce the most potato in Madhya Pradesh?</h2>
            <p style={sIntro}>Indore district leads MP&apos;s potato production, anchoring the Malwa Plateau cultivation belt. Ujjain, Gwalior, Dewas, Shajapur, and Bhopal form the core production cluster (ICAR-CPRI; MP Agriculture Department). Indore also hosts the largest potato mandi in the state.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["District", "Rank", "Notes", "Top varieties"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {districts.map((r, i) => (
                    <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i < 3 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={{ ...sTd, color: "#666" }}>{r[2]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR-CPRI; MP Agriculture Department; Indore APMC market authority.</p>
            <p style={sP}><strong>[DATA NEEDED: precise district-level production tonnage and rank within MP]</strong> — backend confirms the top-6 districts (Indore, Ujjain, Gwalior, Dewas, Shajapur, Bhopal) but absolute tonnage figures by district are not available in current ingested sources at uniform precision. The district ordering shown reflects ICAR-CPRI&apos;s qualitative ranking and MP State Government division-level aggregations. Indore-Ujjain-Dewas-Shajapur — all on the Malwa Plateau — collectively deliver the bulk of state production. Gwalior, in the Chambal belt, is increasingly oriented toward chip-stock supply as Kufri Lavkar acreage expands.</p>
            <StatCallout number="Indore" context="leads Madhya Pradesh's potato production and hosts the state's largest mandi. The Malwa Plateau cluster (Indore-Ujjain-Dewas-Shajapur) delivers the bulk of state output." source="ICAR-CPRI; MP Agriculture Department" />
          </section>

          {/* Card 3 */}
          <section id="malwa-plateau" data-card="malwa-plateau" style={cardWrap}>
            <h2 id="malwa-plateau-h" style={sH2}>Is Malwa Plateau good for potato cultivation?</h2>
            <p style={sIntro}>Yes — Malwa Plateau is among India&apos;s most agroclimatically suitable regions for potato cultivation. The plateau offers black-cotton soils with sandy-loam pockets, semi-arid climate with cool winters (15–22°C December–February), elevation that moderates summer heat, and developing irrigation infrastructure (FAO; CIP; ICAR-CPRI; MP Agriculture Department).</p>
            <p style={sP}>The Malwa Plateau&apos;s agroclimatic profile distinguishes it from the Indo-Gangetic plain. The plateau&apos;s elevation (300–600 m) provides marginally cooler summers than the deep plain, while the December–February cool window — with mean daytime 18–22°C and nights 8–14°C — sits within potato&apos;s optimal tuberization range. The black-cotton soils with sandy-loam pockets provide good drainage and nutrient retention; they require careful land preparation (deep tillage in autumn) but reward management with strong yields. Combined with developing tube-well groundwater infrastructure and emerging drip irrigation adoption, the agroclimate provides the foundation for both table-stock and chip-stock production.</p>
            <p style={sP}>Indore, Ujjain, Dewas, and Shajapur — the core Malwa Plateau districts — collectively form MP&apos;s primary potato belt. Their position as the southern edge of the cool-season Indian potato cultivation zone gives them a specific role: they extend the country&apos;s potato production geography south of the traditional Indo-Gangetic belt. As <Link href="/country/india/gujarat" style={linkPlain}>Gujarat&apos;s</Link> processing capacity continues to expand and chip-stock variety acreage diversifies, Malwa Plateau is positioned to become a complementary chip-stock supplier — particularly through the Kufri Lavkar and emerging Kufri Chipsona-3 varieties. The economic logic of expansion is real: every additional 50,000-tonne chip-processing facility in Indore-Ujjain creates contract-grower demand for several thousand hectares of chip-stock potato.</p>
            <p style={sSource}>Source: ICAR-CPRI; MP Agriculture Department; FAO; CIP.</p>
          </section>

          {/* Card 4 */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 id="varieties-h-mp" style={sH2}>Which potato varieties are grown in Madhya Pradesh?</h2>
            <p style={sIntro}>Kufri Chandramukhi (CPRI release 1968) is the dominant table-potato variety in Madhya Pradesh. Kufri Lavkar — specifically suitable for chip processing — is the second major variety. Kufri Pukhraj serves the early-market segment, and Kufri Chipsona-3 is establishing in progressive chip-stock contract programs (ICAR-CPRI variety register; MP Agriculture Department).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Variety", "Released", "Adoption in MP", "End use", "Maturity (days)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={sTd}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR-CPRI variety register; MP Agriculture Department adoption surveys.</p>
            <p style={sP}><strong>[DATA NEEDED: precise variety adoption percentages for MP]</strong> — backend confirms Kufri Chandramukhi and Kufri Lavkar as the dominant varieties but precise adoption percentages are not available in current ingested sources at the same precision as for some other Indian states. Variety dominance shown reflects ICAR-CPRI&apos;s qualitative state-level adoption surveys. <Link href="/varieties/kufri-chandramukhi" style={linkRed}>Kufri Chandramukhi</Link> remains widely cultivated despite its 1968 release because of farmer familiarity, acceptable yield (25–30 t/ha potential under MP conditions), and 100–110 day maturity matching the state&apos;s rabi window.</p>
            <p style={sP}><Link href="/varieties/kufri-lavkar" style={linkRed}>Kufri Lavkar</Link> is the variety most relevant to MP&apos;s emerging chip-stock processing role. Its specific gravity profile, low reducing sugar accumulation, and 90–100 day maturity make it suitable for chip industry procurement. Where <Link href="/country/india/gujarat" style={linkRed}>Gujarat</Link> built its processing dominance on Kufri Chipsona-3 (CPRI 2005) and contracted-imported Lady Rosetta and Atlantic, MP&apos;s processing pathway runs more through domestic-bred Kufri Lavkar, with Kufri Chipsona-3 emerging in progressive farmer programs. <Link href="/knowledge/kufri-potato-varieties-india" style={linkRed}>Read the complete Kufri varieties guide</Link>.</p>
          </section>

          {/* Card 5 */}
          <section id="processing" data-card="processing" style={cardWrap}>
            <h2 id="processing-h-mp" style={sH2}>Is Madhya Pradesh a processed-potato state?</h2>
            <p style={sIntro}>Madhya Pradesh is an emerging processed-potato state, currently operating below <Link href="/country/india/gujarat" style={linkPlain}>Gujarat&apos;s</Link> processing leadership but with growing chip-stock supply capacity. The dominance of Kufri Lavkar — specifically suitable for chip processing — and the emerging adoption of Kufri Chipsona-3 in contract programs positions MP as a complementary chip-stock supplier to the broader Indian processing chain (ICAR-CPRI; MP Agriculture Department).</p>
            <p style={sP}>The state hosts emerging chip processing activity in the Indore-Ujjain belt, with regional snack manufacturers and Pepsi/Bingo procurement programs sourcing chip-stock from local contract farmers. The processor concentration is significantly thinner than Gujarat&apos;s — there is no MP equivalent of HyFun Foods&apos; 250K+ t/yr capacity. But the structural pieces for processor scale-up are in place: chip-suitable variety acreage, Malwa Plateau agroclimate, the Indore mandi&apos;s aggregation depth, and developing cold-storage infrastructure.</p>
            <p style={sP}>The MoFPI PLI Food Processing scheme, providing 4–10% incremental sales incentives over six years to qualifying processors, is targeting MP among other states for processor capex expansion. The MP Food Processing Industries Policy adds state-level capital subsidy on top of central schemes. Realizing MP&apos;s processing potential depends on parallel chip-suitable variety expansion (Kufri Chipsona-3 acreage growth), cold-storage capacity buildout, and processor entry — a 5–10 year development arc rather than an immediate transformation. <Link href="/knowledge/potato-processing-industry" style={linkRed}>Read on the global potato processing industry</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; MP Agriculture Department; Ministry of Food Processing Industries (MoFPI).</p>
          </section>

          {/* Card 6 */}
          <section id="cold-storage" data-card="cold-storage" style={cardWrap}>
            <h2 id="cold-storage-h-mp" style={sH2}>How much cold storage capacity does Madhya Pradesh have?</h2>
            <p style={sIntro}>Madhya Pradesh&apos;s cold storage capacity for potato is concentrated in the Indore-Ujjain belt, with developing capacity in Gwalior&apos;s chip-stock supply zone. <strong>[DATA NEEDED: precise cold storage capacity figures for Madhya Pradesh at state and district level]</strong> — current ingested backend data does not include MP-specific cold storage tonnage at the precision available for UP, WB, or Bihar.</p>
            <p style={sP}>Qualitatively, MP&apos;s cold storage profile is intermediate between the abundant capacity of <Link href="/country/india/uttar-pradesh" style={linkPlain}>UP</Link> and <Link href="/country/india/west-bengal" style={linkPlain}>West Bengal</Link> on one side and the severe capacity gap of <Link href="/country/india/bihar" style={linkPlain}>Bihar</Link> on the other. The Indore-Ujjain cluster has the densest concentration. State-level capacity expansion is supported by Mission for Integrated Development of Horticulture (MIDH) 35% capital subsidy and the MP Food Processing Industries Policy state overlay. The Agriculture Infrastructure Fund (AIF) 3% interest subvention applies to projects up to INR 2 crore, particularly relevant for FPO-scale facilities.</p>
            <p style={sP}>The structural opportunity is that as chip-stock processing capacity scales up in the Indore-Ujjain belt, processor-anchored cold storage will follow — similar to the pattern observed in <Link href="/country/india/gujarat" style={linkRed}>Gujarat&apos;s</Link> Banaskantha-Mehsana cluster. Public schemes provide the financing tools; the binding constraint is processor demand depth, which is currently smaller than in Gujarat but growing. <Link href="/knowledge/potato-storage-cold-chain" style={linkRed}>Read more on potato cold storage</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; MP Agriculture Department; National Horticulture Board (NHB).</p>
          </section>

          {/* Card 7 */}
          <section id="mandis" data-card="mandis" style={cardWrap}>
            <h2 id="mandis-h-mp" style={sH2}>What are the major potato mandis in Madhya Pradesh?</h2>
            <p style={sIntro}>Indore hosts the largest potato mandi in Madhya Pradesh, complemented by Ujjain, Gwalior, and Bhopal APMC markets. Mandi prices have ranged INR 700–1,500 per quintal in normal years (Agmarknet; MP Agriculture Marketing Board).</p>
            <p style={sP}>The Indore mandi&apos;s aggregation role is central to MP&apos;s potato trade. Volumes from Indore, Ujjain, Dewas, Shajapur, and the broader Malwa Plateau converge for distribution toward the urban consumer markets in Indore, Bhopal, and the broader central India belt — including parts of Maharashtra, Gujarat, and Rajasthan. Commission agents, transporters, and chip-stock procurement representatives cluster around the Indore mandi, providing core price-discovery for the state. Gwalior&apos;s mandi serves the northern Chambal belt and connects MP&apos;s potato to the Delhi NCR consumer market.</p>
            <p style={sP}><strong>[DATA NEEDED: live Agmarknet feed for MP mandis]</strong> — current pricing reflects multi-year typical ranges; live mandi-by-mandi data is available at agmarknet.gov.in including Indore, Ujjain, Gwalior, and other MP markets. The state-level price pattern is moderately less volatile than Bihar&apos;s but more volatile than Gujarat&apos;s contract-anchored cluster, reflecting the intermediate position of MP&apos;s potato sector between fresh-market dominance and processor-anchored supply.</p>
            <p style={sSource}>Source: Agmarknet; MP Agriculture Marketing Board; Indore APMC market authority.</p>
          </section>

          {/* Card 8 */}
          <section id="schemes" data-card="schemes" style={cardWrap}>
            <h2 id="schemes-h-mp" style={sH2}>What government schemes support MP potato farmers?</h2>
            <p style={sIntro}>Madhya Pradesh potato farmers access a layered scheme stack: MP Food Processing Industries Policy (state-level capital subsidy of up to 25%); Mission for Integrated Development of Horticulture (MIDH) 35% capital subsidy on cold storage; Agriculture Infrastructure Fund (AIF) 3% interest subvention; PMFBY crop insurance; MoFPI PLI Food Processing scheme; Operation Greens TOP-Plus during glut years (Department of Agriculture &amp; Farmers Welfare; MP State Government).</p>
            <QuickFactsBox items={[
              { label: "MP state capital subsidy", value: "Up to 25% (Food Processing Policy)" },
              { label: "MIDH cold storage subsidy", value: "35% (central)" },
              { label: "AIF interest subvention", value: "3% on loans up to INR 2 crore" },
              { label: "PLI Food Processing", value: "4–10% incremental sales incentive" },
            ]} />
            <p style={sP}>The MP Food Processing Industries Policy provides up to 25% state capital subsidy on processing units (subject to caps), on top of the central MIDH/NHB 35% subsidy on cold storage. Combined effective subsidy on a 5,000-tonne cold-storage facility can reach 50–55% of project cost. AIF&apos;s 3% interest subvention applies to loans up to INR 2 crore for a 7-year tenor with CGTMSE credit guarantee. The PLI Food Processing scheme is targeting MP among other states for processor capex expansion — providing 4–10% incremental sales incentives over six years to qualifying entrants.</p>
            <p style={sP}>PMFBY for potato as a notified commercial crop runs on the 5% farmer-share premium with central + state subsidy on the gross premium. Operation Greens (TOP-Plus) provides up to 50% subsidy on transport and short-term storage rental during glut episodes. The combined scheme stack is comparable to other Indian potato states in scope; MP&apos;s competitive advantage runs through the Food Processing Policy&apos;s state-level subsidy and the targeted processor-attraction posture of the MP government over the past decade.</p>
            <p style={sSource}>Source: MP State Government Food Processing Industries Policy; Ministry of Agriculture &amp; Farmers Welfare; MoFPI scheme guidelines.</p>
          </section>

          {/* Card 9 */}
          <section id="climate" data-card="climate" style={cardWrap}>
            <h2 id="climate-h-mp" style={sH2}>What is the climate and soil profile for potato in MP?</h2>
            <p style={sIntro}>Madhya Pradesh&apos;s Malwa Plateau potato belt sits on black-cotton soils with sandy-loam pockets, pH 7.0–8.5, under a semi-arid sub-tropical climate with cool winters that deliver the 15–20°C tuberization window potato requires (FAO; CIP; ICAR-CPRI; MP Agriculture Department).</p>
            <p style={sP}>The Malwa Plateau&apos;s agroclimatic profile is distinctive within India. The plateau&apos;s elevation (300–600 m) provides marginally cooler summers than the deep Indo-Gangetic plain. The December–February cool window — with mean daytime 18–22°C and nights 8–14°C — sits squarely in potato&apos;s optimal tuberization range. Black-cotton soils dominate the plateau but require careful land preparation (deep autumn tillage, proper drainage). Sandy-loam pockets, particularly in Indore and Dewas, provide the most ideal potato soil profiles. The Chambal belt&apos;s alluvial soils in Gwalior provide an alternative agroecological context with more familiar Indo-Gangetic-style profiles.</p>
            <p style={sP}>Climate change pressure on MP potato is real. The October–March cool window has compressed slightly across the past decade, particularly at the autumn end where late cooling is shifting later. Black-cotton soils retain moisture well but can become problematic under heat-stress conditions when surface evaporation creates hard-pan layers. Drip irrigation adoption in MP is growing but remains below Gujarat&apos;s level. Heat-tolerant CIP and CPRI varieties — including the LBHT clones — are part of the medium-term adaptation pipeline. <Link href="/knowledge/climate-change-potatoes" style={linkRed}>Read the full climate-change-potatoes article</Link>.</p>
            <p style={sSource}>Source: FAO; CIP; ICAR-CPRI; MP Agriculture Department.</p>
          </section>

          {/* Card 10 */}
          <section id="calendar" data-card="calendar" style={cardWrap}>
            <h2 id="calendar-h-mp" style={sH2}>When are potatoes planted and harvested in Madhya Pradesh?</h2>
            <p style={sIntro}>ICAR-CPRI guidance places the optimal sowing window in Madhya Pradesh at October 15 to November 10 for the rabi-season crop (CPRI ICAR India Research). Harvest typically falls in February–March. The CPRI-specific window for MP reflects the state&apos;s transition climate and the 100–110 day Kufri Chandramukhi maturity that dominates state acreage.</p>
            <QuickFactsBox items={[
              { label: "Optimal sowing window", value: "October 15 – November 10 (CPRI guidance)" },
              { label: "Main rabi harvest", value: "February 1 – March 25" },
              { label: "Crop window", value: "100–110 days (Kufri Chandramukhi)" },
              { label: "Storage entry", value: "Mid-Feb to mid-March" },
            ]} />
            <p style={sP}>The MP-specific October 15 – November 10 sowing window is narrower than UP&apos;s (mid-October to early November) and matches the state&apos;s slightly later cool-season onset. Sowing-window discipline is critical because the compressed cool-season window leaves less margin for delayed planting. Planting before mid-October risks heat-stress damage during the first 4–6 weeks; planting after mid-November compresses the bulking window and exposes the crop to late-season heat-spike risk during March harvest. CPRI&apos;s state-specific advisory targets the agroclimatic optimum.</p>
            <p style={sP}>Cold-storage entry concentrates in late February through mid-March. Strategic farmers with storage capacity hold through to October or November to capture price recovery; farmers without storage access sell into the harvest-window glut at depressed mandi prices. The economic logic mirrors what we see in <Link href="/country/india/uttar-pradesh" style={linkPlain}>UP</Link> and <Link href="/country/india/west-bengal" style={linkPlain}>West Bengal</Link>. For practical sowing-time guidance, see our <Link href="/answers/when-to-plant-potatoes" style={linkRed}>when to plant potatoes answer</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; CPRI ICAR India Research; MP Agriculture Department; FAO crop calendars.</p>
          </section>

          {/* Card 11 */}
          <section id="challenges" data-card="challenges" style={cardWrap}>
            <h2 id="challenges-h-mp" style={sH2}>What are the biggest challenges and opportunities for MP potato farmers?</h2>
            <p style={sIntro}>MP potato farmers face five interlocking constraints: limited certified-seed adoption (10–15%, similar to other Indian states), cold-storage capacity below the UP/WB benchmark, processor concentration significantly thinner than Gujarat&apos;s, climate-driven calendar compression, and emerging groundwater stress in tube-well-dependent districts (ICAR-CPRI; MP Agriculture Department).</p>
            <p style={sP}>The opportunities, however, are real and growing. The Malwa Plateau&apos;s agroclimatic suitability for potato is among the best in India. Kufri Lavkar&apos;s chip-suitable profile combined with emerging Kufri Chipsona-3 adoption positions MP as a complementary chip-stock supplier to <Link href="/country/india/gujarat" style={linkRed}>Gujarat&apos;s</Link> processing belt. The MP Food Processing Industries Policy combined with central PLI scheme is targeting processor expansion. Indore&apos;s emerging chip processing activity creates contract-grower demand. And the structural cold-storage gap is a financing problem rather than an agroclimatic limit — public schemes provide the tools for capacity expansion as processor demand depth grows.</p>
            <p style={sP}>Progressive farmer programs in Indore, Ujjain, and Dewas demonstrate yields of 30–35 t/ha — substantially above state average — through certified seed combined with precision agronomy. The CPRI Modipuram and Patna Aeroponic Centres are scaling minituber production that will eventually flow into MP&apos;s certified seed pipeline. CIP&apos;s decentralized seed-multiplication programs partner with FPO networks to extend certified-seed reach. The 5–10 year trajectory for MP potato is one of gradual upgrade toward chip-stock processing leadership while maintaining the state&apos;s established table-potato base. <Link href="/knowledge/potato-diseases-pests" style={linkRed}>Read about potato diseases and pests</Link>.</p>
            <p style={sSource}>Source: ICAR-CPRI; MP Agriculture Department; CIP East Asia and South Asia programs; CPRI Modipuram and Patna Aeroponic Centres.</p>
          </section>

          <SourceBlock sources={[
            "ICAR-CPRI (Central Potato Research Institute, Shimla) — variety register, state advisory data",
            "Madhya Pradesh Agriculture Department — district-level potato production, state schemes",
            "Department of Agriculture & Farmers Welfare (DAFW), Government of India",
            "MP Food Processing Industries Policy — state capital subsidy framework",
            "Ministry of Food Processing Industries (MoFPI) — PLI Food Processing scheme",
            "National Horticulture Board (NHB) — cold storage capacity statistics",
            "Agmarknet — Indore, Ujjain, and Gwalior mandi price reporting",
            "CPRI ICAR India Research — MP-specific sowing-window guidance",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="madhya-pradesh" />

          <ContinueReading articles={[
            { href: "/knowledge/kufri-potato-varieties-india", tag: "Varieties", title: "Kufri Potato Varieties: India's Complete Guide", desc: "Kufri Chandramukhi (1968) and chip-suitable Kufri Lavkar — MP's dominant variety pipeline." },
            { href: "/knowledge/potato-processing-industry", tag: "Industry", title: "Global Potato Processing Industry: $80B Market", desc: "Where MP's emerging chip-stock processing fits in the global frozen-fry and chip industry." },
            { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems: Certification, Multiplication, Trade", desc: "CPRI Modipuram and Patna Aeroponic Centres scaling minituber production for India's certified seed pipeline." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State — A Story-Format Deep Dive", desc: "How the Malwa Plateau is positioning to complement Gujarat's processing belt over the next decade." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── Main page export ── */

export default async function IndiaStatePage({ params }) {
  const { state } = await params;
  switch (state) {
    case "uttar-pradesh": return <UttarPradeshState />;
    case "west-bengal": return <WestBengalState />;
    case "bihar": return <BiharState />;
    case "gujarat": return <GujaratState />;
    case "madhya-pradesh": return <MadhyaPradeshState />;
    default: return <UttarPradeshState />;
  }
}
