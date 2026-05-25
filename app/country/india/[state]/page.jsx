import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES, UPDATED_SHORT, INDIA_STATES } from "../../../../lib/data";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, SPEAKABLE } from "../../../../lib/authors";

/* ── Route config ── */

// Force Next.js to 404 any slug that isn't in generateStaticParams (rather than
// dynamically rendering at request time and falling through to a default case).
export const dynamicParams = false;

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
    title: "Madhya Pradesh Potato Production: India's #5 Potato State (3.949M Tonnes, Indore Leads)",
    desc: "Madhya Pradesh produced 3.949 million tonnes of potatoes in 2023-24 from 155,560 hectares at 25.39 t/ha — 6.92% of India's national output, ranked 5th nationally (DA&FW Horticultural Statistics at a Glance 2024). Indore is the dominant district at 46,500 ha and 1.185 Mt. Hosts the ICAR-CPRI Regional Research Station at Gwalior and a licensed aeroponic virus-free seed facility (May 2022).",
    h1: "Madhya Pradesh Potato Production: India's #5 Potato State",
    tag: "India · Madhya Pradesh",
  },
  "jharkhand": {
    title: "Jharkhand Potato Production: Chotanagpur Plateau (766.82K Tonnes, 10 Major Districts)",
    desc: "Jharkhand produced 766.82 thousand tonnes of potatoes in 2023-24 from 51,280 hectares at 14.95 t/ha — 1.34% of India's national output, ranked 8th nationally (DA&FW Horticultural Statistics at a Glance 2024). Ranchi leads at 13,679 ha and 200,323 tonnes; Bokaro tops the state on productivity at 27.70 t/ha. Birsa Agricultural University (Ranchi) administers state potato research and 16 KVKs.",
    h1: "Jharkhand Potato Production: Chotanagpur Plateau Belt",
    tag: "India · Jharkhand",
  },
  "maharashtra": {
    title: "Maharashtra Potato Production: Consolidation Story (−37% area, +35% yield to 26.77 t/ha)",
    desc: "Maharashtra produced 386.69 thousand tonnes of potatoes in 2023-24 from 14,450 hectares at a productivity of 26.77 t/ha — 0.68% of India's national output (DA&FW Horticultural Statistics at a Glance 2024). The state has lost 37.2% of its potato area over 5 years while productivity rose 35.3%, leaving production down only 15.0% — a consolidation onto higher-productivity acreage. Maharashtra is the only audit-9 state explicitly named in an ICAR-CPRI variety zone recommendation (Kufri Tejas).",
    h1: "Maharashtra Potato Production: A Consolidation Story",
    tag: "India · Maharashtra",
  },
  "andhra-pradesh": {
    title: "Andhra Pradesh Potato Production: A State Retreating from the Crop (−79% area, −64% production)",
    desc: "Andhra Pradesh produced 17.76 thousand tonnes of potatoes in 2023-24 from 590 hectares at a productivity of 30.00 t/ha — 0.03% of India's national output (DA&FW Horticultural Statistics at a Glance 2024). Over the 5-year window 2019-20 to 2023-24 the state lost 78.7% of its potato area and 64.4% of its production. The surviving footprint is productivity-positive (22% above national average) on a very small base. Primary sources document the scale of the decline but do not establish its cause.",
    h1: "Andhra Pradesh Potato Production: A State Retreating from the Crop",
    tag: "India · Andhra Pradesh",
  },
  "assam": {
    title: "Assam Potato Production: The Largest Northeast Producer at a Structural Yield Deficit",
    desc: "Assam produced 911.33 thousand tonnes of potatoes in 2023-24 from 106,470 hectares at a productivity of 8.56 t/ha — 1.60% of India's national output, ranked 7th nationally (DA&FW Horticultural Statistics at a Glance 2024). Assam is the largest northeast potato producer, with roughly 70% of NE region production share. Productivity of 8.56 t/ha is 35% of the national average — the lowest among meaningful Indian potato states, reflecting documented constraints around seed quality, post-harvest infrastructure, and market access.",
    h1: "Assam Potato Production: Brahmaputra Valley Belt",
    tag: "India · Assam",
  },
  "tripura": {
    title: "Tripura Potato Production: Highest Productivity Among Northeast States (19.16 t/ha)",
    desc: "Tripura produced 146.05 thousand tonnes of potatoes in 2023-24 from 7,620 hectares at a productivity of 19.16 t/ha — 0.26% of India's national output (DA&FW Horticultural Statistics at a Glance 2024). Tripura is the third-largest northeast potato producer after Assam and Meghalaya, and stands out for productivity that is more than double Assam's 8.56 t/ha and 90% higher than Meghalaya's 10.04 t/ha — the highest of any northeast state by a meaningful margin. Served by the ICAR-RCNEH Tripura Centre at Lembucherra.",
    h1: "Tripura Potato Production: Eastern Northeast Belt",
    tag: "India · Tripura",
  },
  "meghalaya": {
    title: "Meghalaya Potato Production: Hosts the ICAR-RCNEH Northeast Research Headquarters",
    desc: "Meghalaya produced 196.25 thousand tonnes of potatoes in 2023-24 from 19,540 hectares at a productivity of 10.04 t/ha — 0.34% of India's national output (DA&FW Horticultural Statistics at a Glance 2024). Meghalaya is the second-largest northeast potato producer after Assam, and hosts the headquarters of ICAR's Research Complex for the North-Eastern Hill Region (ICAR-RCNEH) at Umiam (Barapani) — the principal institutional centre for potato research across India's seven sister states.",
    h1: "Meghalaya Potato Production: Northeast Highland Belt",
    tag: "India · Meghalaya",
  },
  "nagaland": {
    title: "Nagaland Potato Production: Small, Stable Highland Cultivation (55.12K Tonnes)",
    desc: "Nagaland produced 55.12 thousand tonnes of potatoes in 2023-24 from 4,440 hectares at a productivity of 12.41 t/ha — 0.10% of India's national output (DA&FW Horticultural Statistics at a Glance 2024). The state's potato sector is small but among the most stable in India — the DA&FW 5-year series shows essentially flat area, production, and productivity. Served by the ICAR-RCNEH Nagaland Centre at Jharnapani.",
    h1: "Nagaland Potato Production: Naga Hills Belt",
    tag: "India · Nagaland",
  },
  "manipur": {
    title: "Manipur Potato Production: Small Producer with a Series Discontinuity to Flag",
    desc: "Manipur produced 14.63 thousand tonnes of potatoes in 2023-24 from 1,160 hectares at a productivity of 12.61 t/ha — 0.03% of India's national output (DA&FW Horticultural Statistics at a Glance 2024). Among the smallest measurable potato-producing states in India. The 5-year DA&FW series shows an apparent 22-fold area expansion between 2019-20 and 2021-22 — almost certainly a reporting-baseline revision rather than real growth in the field, which this page flags honestly.",
    h1: "Manipur Potato Production: Imphal Valley Cultivation",
    tag: "India · Manipur",
  },
  "arunachal-pradesh": {
    title: "Arunachal Pradesh Potato Production: India's Smallest Measurable Producer with a Series Discontinuity",
    desc: "Arunachal Pradesh produced 6.07 thousand tonnes of potatoes in 2023-24 from 450 hectares at a productivity of 13.36 t/ha — 0.01% of India's national output (DA&FW Horticultural Statistics at a Glance 2024). India's smallest measurable potato-producing state with published primary data. The DA&FW series shows four consecutive years of identical figures (2019-20 through 2022-23) before a 22-fold step change in 2023-24 — almost certainly a survey-methodology revision rather than real agronomic growth, which this page flags honestly.",
    h1: "Arunachal Pradesh Potato Production: Eastern Himalayan Belt",
    tag: "India · Arunachal Pradesh",
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
            <p style={sP}>District-level tonnage detail is published with high precision for Agra (2.8M tonnes / 27% share) but absolute tonnage figures for the other top districts are not available in current primary sources at uniform precision; rankings shown above reflect ICAR-CPRI&apos;s qualitative ordering and UP State Government division-level aggregations.</p>
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
            <p style={sP}>Cold storage rental of INR 200–400/quintal/season effectively places a floor under summer/autumn prices — farmers will not store potato unless realized post-storage selling price covers both the rental and an opportunity-cost return. This dynamic structures UP&apos;s seasonal price pattern: peak harvest (February–March) sees lowest farm-gate prices; ex-cold-storage post-October prices typically run 40–80% higher. The pricing in this article reflects multi-year typical ranges; for live state-by-state mandi prices, refer to the official Agmarknet portal at agmarknet.gov.in.</p>
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
            <p style={sIntro}>West Bengal produces 11–12 million tonnes of potatoes annually from approximately 400,000 hectares — making it India&apos;s second-largest potato-producing state, accounting for roughly 21–24% of national output (ICAR-CPRI; DAFW 2023-24). The 2024-25 season delivered a preliminary record of 14–15 million tonnes (final DAFW 2024-25 confirmation pending).</p>
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
            <p style={sP}>The Kolaghat wholesale market sets effective price discovery for the state, with farm-gate prices typically tracking 65–80% of Kolaghat wholesale after deducting transport and commission. Normal-year mandi prices have ranged INR 600–1,500 per quintal, with glut episodes (notably 2017, 2018, partial 2024-25) pushing prices to INR 200–400 — well below the cost of production for most farmers. Tight-supply years (2019-20, 2024 winter) have seen prices reach INR 1,800–2,500 per quintal. The pricing reflects multi-year typical ranges; for live state-by-state mandi prices, refer to agmarknet.gov.in.</p>
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
            <p style={sP}>Primary sources confirm the Nalanda-Patna-Vaishali triangle structure and the listed top-8 districts; uniform absolute tonnage figures by district are not currently published at the precision available for some other Indian states. Rankings shown reflect ICAR-CPRI&apos;s qualitative ordering and Bihar Agriculture Department aggregations. The triangle district cluster (Nalanda-Patna-Vaishali) plus Begusarai, Samastipur, Saran, Muzaffarpur, and Bhojpur collectively deliver an estimated 65–75% of state output. The Diara belt (river floodplain districts including Begusarai and Samastipur) is particularly productive for table-stock potato grown in rice-potato rotation.</p>
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
            <p style={sP}>Bihar&apos;s mandi price pattern is structurally more volatile than UP&apos;s or WB&apos;s because the cold-storage gap forces concentrated harvest-window selling. February–March produces price collapses in years when production is high and distribution downstream is limited. Tight-supply years (poor crop, early heat) have seen prices reach INR 1,800–2,200/quintal but these are not reliably recurring. The pricing reflects multi-year typical ranges; the Agmarknet portal at agmarknet.gov.in provides live mandi-by-mandi data for Bihar including Hilsa, Patna, Muzaffarpur, and other markets.</p>
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
            <p style={sP}>Primary sources confirm Gujarat&apos;s 1,500+ facility count and the Mehsana WDRA detail; absolute tonnage capacity at state level is not currently published at the same precision as for UP or WB. The qualitative picture is clear: Gujarat&apos;s cold-storage network is the most processor-integrated and highest-quality (in terms of WDRA-registration share) of any Indian state, even if the absolute tonnage may not exceed UP&apos;s 16M tonnes.</p>
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
            <p style={sP}>The economic structure of Gujarat&apos;s potato pricing is more stable than UP&apos;s or WB&apos;s because contract farming covers a higher share of state production. The pricing reflects multi-year typical ranges; live mandi-by-mandi data is available at agmarknet.gov.in including Deesa, Palanpur, and other Gujarat markets. <Link href="/answers/potato-market-price-today" style={linkRed}>Read the potato market price answer</Link>.</p>
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
  // District table — DA&FW Horticultural Statistics at a Glance 2024, Table 7.4.3 (2023-24).
  // Area in hectares; production in tonnes; productivity calculated.
  const districts = [
    ["Indore", "46,500", "1,185,750", "25.50", "Single largest producer — 30% of state area and production"],
    ["Ujjain", "14,700", "296,058", "20.14", "2nd by area; productivity below state average"],
    ["Sagar", "10,489", "305,505", "29.13", "Highest productivity in state; +69% area growth 2020-21 to 2023-24"],
    ["Singrauli", "10,164", "289,674", "28.50", "Vindhyan plateau; +65% production growth over 4 years"],
    ["Dewas", "10,345", "209,072", "20.21", "Indore-adjacent; moderate productivity"],
    ["Chhindwara", "10,120", "256,075", "25.30", "Southern district; aligned with state average"],
    ["Shajapur", "8,950", "196,900", "22.00", "Malwa plateau; +68% area growth 2020-21 to 2023-24"],
    ["Satna", "6,587", "136,820", "20.77", "Eastern Vindhyan belt"],
    ["Sidhi", "5,685", "113,700", "20.00", "Northeastern district"],
    ["Gwalior", "4,625", "115,625", "25.00", "Hosts the ICAR-CPRI Regional Research Station"],
    ["Morena", "4,055", "100,402", "24.76", "Chambal belt"],
  ];

  // Recently notified ICAR-CPRI varieties with Madhya Pradesh in the recommended cultivation zone.
  // Source: Ministry of Agriculture / ICAR press release on the notification of four new ICAR-CPRI
  // potato varieties. These are CPRI RECOMMENDATIONS for the agro-climatic zone, not adoption
  // claims — state-level variety acreage data is not part of the DA&FW horticulture statistics surface.
  const varieties = [
    ["Kufri Tejas", "Table", "37–40", "90", "Explicit MP zone designation; heat-tolerant with good ambient storage"],
    ["Kufri Ratan", "Table", "37–39", "90", "North Indian plains + plateau (MP plateau by inference)"],
    ["Kufri Chipbharat-1", "Chip processing", "35–38", "100", "Indian plains; high dry matter (21%), low reducing sugars"],
    ["Kufri Chipbharat-2", "Chip processing", "35–37", "90", "Early-maturing; same zone as Chipbharat-1"],
  ];

  const faqItems = [
    { q: "How much potato does Madhya Pradesh produce?", a: "Madhya Pradesh produced 3.949 million tonnes of potatoes in 2023-24 from 155,560 hectares at a productivity of 25.39 t/ha, contributing 6.92% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). This makes MP India's 5th largest potato-producing state by production volume." },
    { q: "Which district is the largest potato producer in Madhya Pradesh?", a: "Indore is by far the dominant potato district in Madhya Pradesh — 46,500 hectares producing 1,185,750 tonnes in 2023-24, the only MP district above one million tonnes (DA&FW Horticultural Statistics at a Glance 2024, Table 7.4.3). Indore alone accounts for approximately 30% of state area and 30% of state production. Ujjain is second by area (14,700 ha); Sagar and Singrauli lead on productivity." },
    { q: "What are the top potato districts in Madhya Pradesh?", a: "The DA&FW Horticultural Statistics at a Glance 2024 lists 11 major potato-producing districts in Madhya Pradesh: Indore, Ujjain, Sagar, Singrauli, Dewas, Chhindwara, Shajapur, Satna, Sidhi, Gwalior, and Morena. These 11 districts cover 85% of state area and 81% of state production. Bhopal does not appear in DA&FW's major-districts table across the 2020-21 to 2023-24 period." },
    { q: "What is the rank of Madhya Pradesh in Indian potato production?", a: "Madhya Pradesh ranks 5th nationally by potato production at 3.949 million tonnes in 2023-24 (DA&FW Horticultural Statistics at a Glance 2024), behind Uttar Pradesh (19.173 Mt), West Bengal (13.000 Mt), Bihar (8.200 Mt), and Gujarat (4.000 Mt). MP's productivity of 25.39 t/ha is slightly above the national average of 24.57 t/ha." },
    { q: "Which ICAR potato varieties are recommended for Madhya Pradesh?", a: "The Ministry of Agriculture, on the recommendation of ICAR-CPRI, has notified four new potato varieties whose recommended cultivation zones include Madhya Pradesh: Kufri Tejas (table; 37-40 t/ha potential; explicit MP zone designation), Kufri Ratan (table; 37-39 t/ha; North Indian plains and plateau), Kufri Chipbharat-1 (chip processing; 35-38 t/ha; Indian plains), and Kufri Chipbharat-2 (chip processing; 35-37 t/ha). These are CPRI recommendations for the agro-climatic zone — state-level variety adoption acreage is not part of the published DA&FW horticulture statistics." },
    { q: "Where is the ICAR-CPRI Regional Research Station in Madhya Pradesh?", a: "ICAR-CPRI maintains a Regional Research Station at Gwalior in Madhya Pradesh, one of the regional centres of ICAR-Central Potato Research Institute (headquartered Shimla). The Gwalior station's mandate covers cropping systems, agro-techniques, climate-change adaptation studies, insect vector research, potato crop protection, seed potato technology, and hi-tech planting material for the central Indian plateau." },
    { q: "Does Madhya Pradesh have an aeroponic potato seed facility?", a: "Yes — on 4 May 2022, AgrInnovate India Ltd. (the commercial wing of ICAR) granted a license to the Department of Horticulture & Food Processing, Government of Madhya Pradesh, for the Aeroponic System for Virus-free Quality Potato Seed Production. The technology was developed by ICAR-CPRI Shimla. The facility has a capacity of approximately 1 million mini tubers annually and reduces breeder seed development time by approximately 2 years versus conventional field multiplication." },
    { q: "When are potatoes planted in Madhya Pradesh?", a: "Madhya Pradesh follows the national rabi (winter) cropping pattern for potato — planting in October-November and harvest in February-March. This aligns with the national pattern in which approximately 85% of India's potato production is rabi-grown (ICAR-CPRI, AICRP on Potato). Winter day temperatures across the Malwa and Vindhyan plateau districts sit in the 15-25°C range, within or near the optimal 15-22°C tuber-bulking band." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Madhya Pradesh Potato Production Time Series",
    description: "State-level and district-level potato area, production, and productivity for Madhya Pradesh 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Tables 7.3.31 and 7.4.3).",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Madhya Pradesh potato, Indore potato, Sagar potato, Singrauli potato, DA&FW Horticultural Statistics at a Glance 2024, ICAR-CPRI Gwalior",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
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
            { label: "Rank in India", value: "#5 (6.92% of national output)" },
            { label: "Production 2023-24", value: "3.949 Mt (DA&FW)" },
            { label: "Area 2023-24", value: "155,560 ha" },
            { label: "Productivity 2023-24", value: "25.39 t/ha" },
            { label: "Top district", value: "Indore (1.186 Mt; 30% of state)" },
            { label: "Seed infrastructure", value: "ICAR-CPRI Gwalior + Aeroponic Facility (2022)" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Madhya Pradesh produced 3.949 million tonnes of potatoes in 2023-24 from 155,560 hectares at 25.39 t/ha — 6.92% of India&apos;s national output, ranked 5th nationally (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> Indore is the dominant district at 46,500 ha and 1.186 Mt — alone accounting for ~30% of state area and production. The state hosts the ICAR-CPRI Regional Research Station at Gwalior and, since May 2022, a licensed aeroponic virus-free seed production facility transferred from ICAR-CPRI Shimla via AgrInnovate India Ltd.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "3.949 Mt", label: "Production 2023-24" },
            { value: "6.92%", label: "Share of India" },
            { value: "25.39 t/ha", label: "Productivity" },
            { value: "Indore", label: "#1 district (30%)" },
          ]} />

          {/* Card 1: Production overview (DA&FW 5-year series) */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-mp" style={sH2}>How much potato does Madhya Pradesh produce?</h2>
            <p style={sIntro}>Madhya Pradesh produced 3.949 million tonnes of potatoes in 2023-24 from 155,560 hectares at a productivity of 25.39 t/ha, contributing 6.92% of India&apos;s national output — ranked 5th nationally (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "151.00", "3,457.30", "22.90"],
                    ["2020-21", "156.39", "3,566.94", "22.81"],
                    ["2021-22", "158.43", "3,587.90", "22.65"],
                    ["2022-23", "172.21", "3,954.91", "22.97"],
                    ["2023-24", "155.56", "3,949.00", "25.39"],
                  ].map((r, i) => (
                    <tr key={r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i === 4 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}>By production volume, MP ranks 5th nationally — behind <Link href="/country/india/uttar-pradesh" style={linkRed}>Uttar Pradesh</Link> (19.173 Mt), <Link href="/country/india/west-bengal" style={linkRed}>West Bengal</Link> (13.000 Mt), <Link href="/country/india/bihar" style={linkRed}>Bihar</Link> (8.200 Mt), and <Link href="/country/india/gujarat" style={linkRed}>Gujarat</Link> (4.000 Mt). MP&apos;s 2023-24 productivity of 25.39 t/ha is modestly above the national average of 24.57 t/ha — the first year in the 5-year series where MP sits above the national mean.</p>
            <p style={sP}>The 2023-24 productivity gain is notable: a ~10% increase year-on-year (22.97 → 25.39 t/ha) on acreage that contracted 9.7% from the prior year (172.21 → 155.56 thousand hectares). This pattern is consistent with cropping concentrating onto better-managed acreage rather than uniform retreat — the production aggregate barely changed (3.955 → 3.949 Mt) despite the area contraction. The long-run series across 2019-20 to 2023-24 shows a state that has been operating in a 136-172 thousand hectare envelope with production hovering in the 3.14-3.95 million tonne band.</p>
          </section>

          {/* Card 2: District-level (DA&FW Table 7.4.3 — primary) */}
          <section id="districts" data-card="districts" style={cardWrap}>
            <h2 id="districts-h-mp" style={sH2}>Which districts produce the most potato in Madhya Pradesh?</h2>
            <p style={sIntro}>Indore is by far the dominant potato district in Madhya Pradesh — 46,500 hectares producing 1,185,750 tonnes in 2023-24, the only MP district above one million tonnes (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.4.3). Indore alone accounts for approximately 30% of state area and 30% of state production.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>{["District", "Area (ha)", "Production (tonnes)", "Productivity (t/ha)", "Notes"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {districts.map((r, i) => (
                    <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i < 3 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.4.3 (&quot;Area and Production of Potato for Major Producing Districts&quot;).</p>
            <p style={sP}>Together these 11 districts cover 132,220 hectares (85.0% of state area) and 3,205,581 tonnes (81.2% of state production). The remaining ~17% of state production (~743,000 tonnes from ~23,340 hectares) is distributed across districts not enumerated individually in the DA&amp;FW major-districts table. <strong>Bhopal does not appear in DA&amp;FW&apos;s major-producing-districts table for potato across the 2020-21 to 2023-24 period</strong> — it is a frequent claim in secondary aggregator sources but not corroborated by the primary government source.</p>
            <p style={sP}>The fastest-growing districts by area in the 4-year DA&amp;FW series (2020-21 to 2023-24) are <strong>Sagar</strong> (+69%, 6,212 → 10,489 ha), <strong>Shajapur</strong> (+68%, 5,325 → 8,950 ha), and <strong>Singrauli</strong> (production +65%, 175,881 → 289,674 tonnes). These growth rates substantially exceed the state-level area trend (~3% net across the same period), indicating concentrated investment in specific districts.</p>
            <StatCallout number="46,500" unit="hectares in Indore alone" context="The single largest potato district in Madhya Pradesh by both area and production — 30% of state area and 30% of state production come from Indore." source="DA&FW Horticultural Statistics at a Glance 2024, Table 7.4.3" />
          </section>

          {/* Card 3: ICAR-CPRI variety recommendations */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 id="varieties-h-mp" style={sH2}>Which ICAR-CPRI potato varieties are recommended for Madhya Pradesh?</h2>
            <p style={sIntro}>The Ministry of Agriculture, on the recommendation of ICAR-CPRI, has notified four new potato varieties whose recommended cultivation zones include Madhya Pradesh. These are CPRI <strong>recommendations</strong> for the agro-climatic zone — state-level variety adoption acreage is not part of the published DA&amp;FW horticulture statistics, and this page does not assert variety-grown acreage in MP.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>{["Variety", "End use", "Yield potential (t/ha)", "Maturity (days)", "Recommendation notes"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR press release on the notification of four new ICAR-CPRI potato varieties (Ministry of Agriculture &amp; Farmers Welfare).</p>
            <p style={sP}>Kufri Tejas is the only one of the four with an explicit MP zone designation in the ICAR notification — the other three (Kufri Ratan, Kufri Chipbharat-1, Kufri Chipbharat-2) cover &quot;North Indian plains and plateau&quot; or &quot;Indian plains&quot;, agro-climatic zones that include MP by inference. The heat-tolerance trait of Kufri Tejas is agronomically relevant for the state&apos;s rabi cycle, which runs into rising late-winter temperatures across the central plateau.</p>
          </section>

          {/* Card 4: Seed Production Infrastructure */}
          <section id="seed-infrastructure" data-card="seed" style={cardWrap}>
            <h2 id="seed-h-mp" style={sH2}>What seed-potato infrastructure does Madhya Pradesh have?</h2>
            <p style={sIntro}>Madhya Pradesh hosts two complementary ICAR-aligned seed-potato facilities: the ICAR-CPRI Regional Research Station at Gwalior (a long-standing regional centre of ICAR-Central Potato Research Institute) and, since 4 May 2022, a licensed aeroponic virus-free seed production facility transferred from ICAR-CPRI Shimla via AgrInnovate India Ltd.</p>
            <p style={sP}><strong>ICAR-CPRI Regional Research Station, Gwalior</strong> — One of the regional centres of ICAR-Central Potato Research Institute (headquartered Shimla). Mandate areas, per ICAR institutional documentation, cover cropping systems, agro-techniques, climate-change adaptation studies, insect vector research, potato crop protection, seed potato technology, and hi-tech planting material for the central Indian plateau.</p>
            <p style={sP}><strong>Aeroponic virus-free seed production facility (licensed to MP Govt)</strong> — On 4 May 2022, AgrInnovate India Ltd. (the commercial wing of ICAR) granted the Department of Horticulture &amp; Food Processing, Government of Madhya Pradesh, a license for the Aeroponic System for Virus-free Quality Potato Seed Production. The technology was developed by ICAR-CPRI Shimla.</p>
            <QuickFactsBox items={[
              { label: "License date", value: "4 May 2022" },
              { label: "Technology developer", value: "ICAR-CPRI Shimla" },
              { label: "License grantor", value: "AgrInnovate India Ltd. (ICAR commercial wing)" },
              { label: "Licensee", value: "MP Dept of Horticulture & Food Processing" },
              { label: "Production capacity", value: "~1 million mini tubers / year" },
              { label: "Per-plant yield", value: "35–60 mini tubers (3–10 g each)" },
              { label: "Cycle acceleration", value: "~2 years shorter than conventional field multiplication" },
            ]} />
            <p style={sP}>The aeroponic system produces virus-free potato seeds without soil, eliminating soil-borne disease vectors. Nutrient solution is misted onto plant roots while the upper portion remains exposed to air and light. The 2-year acceleration of breeder-seed development materially compresses time-to-market for new ICAR variety releases such as the Kufri Tejas / Kufri Chipbharat series notified for the MP-inclusive zones.</p>
            <p style={sSource}>Source: ICAR press release &quot;License granted to Government of Madhya Pradesh for &apos;Aeroponic System for Virus-free Quality Potato Seed Production&apos; through AgrInnovate India Ltd.&quot; (icar.org.in/en/node/14273); ICAR institutional documentation.</p>
          </section>

          {/* Card 5: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-mp" style={sH2}>What is the agro-climatic profile for potato cultivation in Madhya Pradesh?</h2>
            <p style={sIntro}>Madhya Pradesh falls within ICAR&apos;s central plateau / sub-tropical plains potato zone. Cultivation is dominated by the rabi (winter) cropping cycle, aligned with the national pattern in which approximately 85% of India&apos;s potato production is rabi-grown (ICAR-CPRI; AICRP on Potato).</p>
            <p style={sP}>Planting falls in October-November and harvest in February-March. Winter day temperatures across the producing districts typically sit in the 15-25°C range — within or near the optimal 15-22°C tuber-bulking band. Winter nights run in the 5-12°C band, favourable for tuber formation. Producing geography concentrates on the Malwa plateau (Indore, Dewas, Ujjain, Shajapur, Chhindwara) and the Vindhyan plateau (Sagar, Singrauli, Satna, Sidhi), with the Chambal belt (Gwalior, Morena) contributing the northern-edge cultivation. Rainfall during the rabi window is minimal; cultivation is irrigation-dependent, primarily from groundwater.</p>
            <p style={sP}>The plateau elevations of 300-700 metres provide marginally cooler late-winter temperatures than the deep Indo-Gangetic plain, but the rabi cycle still encounters rising March temperatures that can compress the bulking window. ICAR&apos;s heat-tolerant variety pipeline (Kufri Tejas in particular) is the institutional response to this constraint.</p>
            <p style={sSource}>Source: ICAR-CPRI; AICRP on Potato classifications; DA&amp;FW district-level data.</p>
          </section>

          {/* Card 6: Trajectory and Forward-Looking */}
          <section id="trajectory" data-card="trajectory" style={cardWrap}>
            <h2 id="trajectory-h-mp" style={sH2}>What is Madhya Pradesh&apos;s potato trajectory and outlook?</h2>
            <p style={sIntro}>Across the 2019-20 to 2023-24 DA&amp;FW series, Madhya Pradesh has operated in a 136-172 thousand hectare envelope with production hovering in the 3.14-3.95 million tonne band. The state shows neither the collapse seen in Andhra Pradesh nor the dramatic consolidation seen in Maharashtra — it is on a slow, broadly stable trajectory.</p>
            <p style={sP}><strong>Productivity inflection in 2023-24.</strong> The 22.97 → 25.39 t/ha productivity step in the most recent year is the most consequential signal in the 5-year series. If sustained, it would lift state productivity above the national average for the first time in the published series. The simultaneous area contraction (-9.7% YoY) suggests cropping is concentrating onto better-managed acreage rather than retreating uniformly.</p>
            <p style={sP}><strong>Concentration on Indore.</strong> Indore alone accounts for approximately 30% of state area and 30% of state production. Climate, water, or pest events centred on the Indore district have disproportionate impact on state-level output.</p>
            <p style={sP}><strong>Statistical lag in processing-driven districts.</strong> The fastest-growing districts by area (Sagar +69%, Shajapur +68% over 4 years) substantially outpace state-level area trend, indicating concentrated investment that the major-districts statistical table is only partially capturing. Some districts where processing-driven contract farming is reshaping cropping patterns fall in the &quot;minor districts&quot; residual not individually enumerated.</p>
            <p style={sP}><strong>Forward signals.</strong> The 2022 aeroponic license positions MP as a potential source of virus-free pre-basic seed (not only a consumer of breeder seed). The four newly notified CPRI varieties — all with MP-inclusive recommended zones — are the principal vehicle for state-level yield gains if adoption follows. Sagar&apos;s 69% area expansion is the clearest visible signal of contract farming taking root in central MP.</p>
            <p style={sSource}>Source: DA&amp;FW Horticultural Statistics at a Glance 2024 (Tables 7.3.31 and 7.4.3); ICAR institutional documentation.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\" — Tables 7.3.31 (state-level) and 7.4.3 (district-level) for area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR press release: \"Ministry of Agriculture Notifies Four New Potato Varieties of ICAR-CPRI for Nationwide Cultivation and Processing\" — variety yields, maturity periods, recommended zones",
            "ICAR press release: \"License granted to Government of Madhya Pradesh for 'Aeroponic System for Virus-free Quality Potato Seed Production' through AgrInnovate India Ltd.\" (icar.org.in/en/node/14273) — 4 May 2022 agreement; 1 million mini tubers / year capacity",
            "ICAR-Central Potato Research Institute (ICAR-CPRI) — Regional Research Station, Gwalior; AICRP on Potato",
            "IASRI agridata Table 4.11 citing Horticultural Statistics at a Glance 2018, Horticulture Statistics Division, DA&FW — older time series 2015-16 through 2017-18",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="madhya-pradesh" />

          <ContinueReading articles={[
            { href: "/knowledge/kufri-potato-varieties-india", tag: "Varieties", title: "Kufri Potato Varieties: India's Complete Guide", desc: "ICAR-CPRI variety register including the recently notified Kufri Tejas, Ratan, and Chipbharat 1/2 series." },
            { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems: Certification, Multiplication, Trade", desc: "Aeroponic seed production and its role in compressing breeder-seed development cycles by ~2 years." },
            { href: "/knowledge/potato-processing-industry", tag: "Industry", title: "Global Potato Processing Industry: $80B Market", desc: "The wider processing context — Gujarat's lead, MP's position as a complementary chip-stock candidate." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State — A Story-Format Deep Dive", desc: "Where MP sits in India's 5-state potato map, by the DA&FW primary statistics." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── Main page export ── */

/* ── State 6: Jharkhand ── */

function JharkhandState() {
  // District table — DA&FW Horticultural Statistics at a Glance 2024, Table 7.4.3 (2023-24).
  // Area in hectares; production in tonnes; productivity calculated.
  const districts = [
    ["Ranchi", "13,679", "200,323", "14.64", "Largest single producer — 27% of state area, 26% of state production"],
    ["Dumka", "6,010", "59,465", "9.89", "2nd by area; lowest productivity among listed districts"],
    ["Ramgarh", "4,730", "104,054", "22.00", "Eastern Chotanagpur productivity leader"],
    ["Garhwa", "4,196", "46,156", "11.00", "Western Jharkhand"],
    ["Hazaribagh", "3,185", "70,070", "22.00", "Hosts BAU's 1,000 ha Gauria Karma Farm"],
    ["Latehar", "2,415", "38,681", "16.02", "Western district"],
    ["Gumla", "2,600", "31,849", "12.25", "Southwestern district"],
    ["Lohardaga", "2,175", "27,771", "12.77", "Adjacent to Ranchi"],
    ["Ramgarh (Bokaro)", "1,757", "48,668", "27.70", "Highest productivity in state — approaches national avg"],
    ["Chatra", "1,607", "24,108", "15.00", "Northern district"],
  ];

  // Recently notified ICAR-CPRI varieties with Jharkhand in the recommended cultivation zone
  // by inference from agro-climatic zone designations. Source: Ministry of Agriculture / ICAR
  // press release on the notification of four new ICAR-CPRI potato varieties. These are CPRI
  // RECOMMENDATIONS for the agro-climatic zone, not adoption claims — state-level variety
  // acreage data is not part of the published DA&FW horticulture statistics surface.
  const varieties = [
    ["Kufri Ratan", "Table", "37–39", "90", "North Indian plains + plateau (Chotanagpur plateau by inference)"],
    ["Kufri Chipbharat-1", "Chip processing", "35–38", "100", "Indian plains; high dry matter (21%), low reducing sugars"],
    ["Kufri Chipbharat-2", "Chip processing", "35–37", "90", "Early-maturing; same zone as Chipbharat-1"],
    ["Kufri Tejas", "Table", "37–40", "90", "Heat-tolerant; recommended for plains zones"],
  ];

  const faqItems = [
    { q: "How much potato does Jharkhand produce?", a: "Jharkhand produced 766.82 thousand tonnes of potatoes in 2023-24 from 51.28 thousand hectares at a productivity of 14.95 t/ha, contributing 1.34% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). This makes Jharkhand India's 8th largest potato-producing state." },
    { q: "Which district is the largest potato producer in Jharkhand?", a: "Ranchi is the largest district by both area and production — 13,679 hectares producing 200,323 tonnes in 2023-24 (DA&FW Horticultural Statistics at a Glance 2024, Table 7.4.3). Ranchi alone accounts for approximately 27% of state area and 26% of state production. Dumka is second by area (6,010 ha) but has the lowest productivity (9.89 t/ha) among the major districts. Bokaro leads on productivity at 27.70 t/ha — the only district approaching India's national average." },
    { q: "What are the top potato districts in Jharkhand?", a: "DA&FW Horticultural Statistics at a Glance 2024 lists 10 major potato-producing districts in Jharkhand: Ranchi, Dumka, Ramgarh, Garhwa, Hazaribagh, Latehar, Gumla, Lohardaga, Bokaro, and Chatra. These 10 districts cover 82.6% of state area and 84.9% of state production. The remaining ~17% of state production is distributed across districts not enumerated individually in the major-districts table." },
    { q: "What is the rank of Jharkhand in Indian potato production?", a: "Jharkhand ranks 8th nationally by potato production at 766.82 thousand tonnes in 2023-24 (DA&FW Horticultural Statistics at a Glance 2024). The state's productivity of 14.95 t/ha is approximately 60% of the national average (24.57 t/ha) — a meaningful yield gap relative to leading northern states, though above the Northeast band (Assam 8.56, Meghalaya 10.04 t/ha)." },
    { q: "Which ICAR potato varieties are recommended for Jharkhand?", a: "The Ministry of Agriculture, on the recommendation of ICAR-CPRI, has notified four new potato varieties whose recommended cultivation zones include the Indian plains and plateau regions — agronomically applicable to Jharkhand's Chotanagpur plateau by inference: Kufri Ratan (table; 37-39 t/ha; North Indian plains and plateau), Kufri Chipbharat-1 (chip processing; 35-38 t/ha; Indian plains), Kufri Chipbharat-2 (chip processing; 35-37 t/ha), and Kufri Tejas (table; 37-40 t/ha; heat-tolerant). These are CPRI recommendations for the agro-climatic zone — state-level variety adoption acreage is not part of the published DA&FW horticulture statistics." },
    { q: "What is Birsa Agricultural University's role in Jharkhand potato research?", a: "Birsa Agricultural University (BAU) at Ranchi, established 26 June 1981, is the principal agricultural research institution in Jharkhand. BAU has total land holdings of 1,250 hectares including 1,000 hectares at Gauria Karma Farm in Hazaribagh district. BAU administers 16 of the 22 Krishi Vigyan Kendras (KVKs) operating in Jharkhand districts. Potato-specific BAU research includes a published protocol for rapid micropropagation and microtuber production of Kufri Chipsona-3 and MP-644/97 — addressing the quality-seed bottleneck that constrains plateau potato cultivation." },
    { q: "When are potatoes planted in Jharkhand?", a: "Jharkhand follows the national rabi (winter) cropping pattern for potato — planting in October-November and harvest in February-March. This aligns with the national pattern in which approximately 85% of India's potato production is rabi-grown (ICAR-CPRI; AICRP on Potato). Winter day temperatures across the Chotanagpur plateau typically sit in the 15-25°C range, within or near the optimal 15-22°C tuber-bulking band; winter nights run 5-12°C, favourable for tuber formation." },
    { q: "Why is Jharkhand's potato productivity below the national average?", a: "Jharkhand's 14.95 t/ha state-average productivity is approximately 60% of India's 24.57 t/ha national average. The 22+ t/ha productivity already achieved in Bokaro, Ramgarh, and Hazaribagh districts shows the gap is closeable on better-managed plateau acreage. The drag is concentrated in lower-productivity districts such as Dumka (9.89 t/ha), Garhwa (11.00), and Gumla (12.25). Within Jharkhand, district-level productivity ranges from 9.89 to 27.70 t/ha — a 2.8x range across the listed districts — pointing to extension reach and seed quality as binding constraints rather than agro-climatic fundamentals (DA&FW Horticultural Statistics at a Glance 2024, Table 7.4.3)." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Jharkhand Potato Production Time Series",
    description: "State-level and district-level potato area, production, and productivity for Jharkhand 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Tables 7.3.31 and 7.4.3). Includes 10 major producing districts with 4-year history.",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Jharkhand potato, Ranchi potato, Bokaro potato, Hazaribagh potato, DA&FW Horticultural Statistics at a Glance 2024, Birsa Agricultural University, Chotanagpur plateau",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="jharkhand" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Jharkhand" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Jharkhand" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>12 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["jharkhand"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Rank in India", value: "#8 (1.34% of national output)" },
            { label: "Production 2023-24", value: "766.82 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "51,280 ha" },
            { label: "Productivity 2023-24", value: "14.95 t/ha (~60% of national avg)" },
            { label: "Top district", value: "Ranchi (200,323 t; 27% of state)" },
            { label: "Top productivity district", value: "Bokaro (27.70 t/ha)" },
            { label: "Research hub", value: "Birsa Agricultural University, Ranchi" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Jharkhand produced 766.82 thousand tonnes of potatoes in 2023-24 from 51,280 hectares at 14.95 t/ha — 1.34% of India&apos;s national output, ranked 8th nationally (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> Ranchi is the largest district by area and production (13,679 ha; 200,323 tonnes). Bokaro leads productivity at 27.70 t/ha — the only district approaching the national average. Birsa Agricultural University at Ranchi, with its 1,000-hectare Gauria Karma Farm in Hazaribagh, anchors state potato research and administers 16 of Jharkhand&apos;s 22 Krishi Vigyan Kendras. Among mid-volume Indian potato states, Jharkhand is unusual in having full district-level data published in the DA&amp;FW major-districts table.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "766.82K t", label: "Production 2023-24" },
            { value: "1.34%", label: "Share of India" },
            { value: "14.95 t/ha", label: "State productivity" },
            { value: "Ranchi", label: "#1 district (27%)" },
          ]} />

          {/* Card 1: Production overview (DA&FW 5-year series) */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-jh" style={sH2}>How much potato does Jharkhand produce?</h2>
            <p style={sIntro}>Jharkhand produced 766.82 thousand tonnes of potatoes in 2023-24 from 51.28 thousand hectares at a productivity of 14.95 t/ha, contributing 1.34% of India&apos;s national output — ranked 8th nationally (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "48.88", "705.63", "14.44"],
                    ["2020-21", "49.13", "767.19", "15.62"],
                    ["2021-22", "48.81", "689.76", "14.13"],
                    ["2022-23", "50.73", "757.31", "14.93"],
                    ["2023-24", "51.28", "766.82", "14.95"],
                  ].map((r, i) => (
                    <tr key={r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i === 4 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}>Jharkhand&apos;s 5-year trajectory is one of slow, low-volatility growth: area expanded 4.9% (48.88 → 51.28 thousand ha), production rose 8.7% (705.63 → 766.82 thousand tonnes), and productivity edged up 3.5% (14.44 → 14.95 t/ha). Unlike <Link href="/country/india/madhya-pradesh" style={linkPlain}>Madhya Pradesh</Link>&apos;s sharp 2023-24 productivity inflection or Maharashtra&apos;s consolidation pattern, Jharkhand&apos;s sector is on a stable, steady expansion path.</p>
            <p style={sP}>By share-of-area vs share-of-production, Jharkhand uses 2.21% of national potato area to produce 1.34% of national output — a gap that reflects the structural yield deficit relative to the leading northern states.</p>
          </section>

          {/* Card 2: District-level (DA&FW Table 7.4.3 — primary) */}
          <section id="districts" data-card="districts" style={cardWrap}>
            <h2 id="districts-h-jh" style={sH2}>Which districts produce the most potato in Jharkhand?</h2>
            <p style={sIntro}>Ranchi is the largest potato district in Jharkhand by both area and production — 13,679 hectares producing 200,323 tonnes in 2023-24 (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.4.3). Ranchi alone accounts for approximately 27% of state area and 26% of state production. Bokaro tops state productivity at 27.70 t/ha — the only district approaching India&apos;s national average.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>{["District", "Area (ha)", "Production (tonnes)", "Productivity (t/ha)", "Notes"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {districts.map((r, i) => (
                    <tr key={r[0]} style={{ background: i < 3 ? "rgba(198,40,40,0.03)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i < 3 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.4.3 (&quot;Area and Production of Potato for Major Producing Districts&quot;).</p>
            <p style={sP}>Together these 10 districts cover 42,354 hectares (82.6% of state area) and 651,145 tonnes (84.9% of state production). The remaining ~17% of state production (~115,671 tonnes from ~8,928 hectares) is distributed across districts not enumerated individually in the DA&amp;FW table.</p>
            <p style={sP}>The productivity dispersion is the most actionable signal in the district data: within Jharkhand, district-level productivity ranges from 9.89 t/ha (Dumka) to 27.70 t/ha (Bokaro) — a 2.8x range. Combined with Birsa Agricultural University&apos;s KVK presence in 16 of 22 districts, this points to extension reach, seed quality, and on-farm management as binding constraints rather than agro-climatic fundamentals.</p>
            <StatCallout number="27.70 t/ha" context="Bokaro district leads Jharkhand on productivity — the only state district approaching India's national average (24.57 t/ha). Ramgarh and Hazaribagh follow at 22.00 t/ha each, forming a high-productivity cluster on the eastern Chotanagpur plateau." source="DA&FW Horticultural Statistics at a Glance 2024, Table 7.4.3" />
          </section>

          {/* Card 3: ICAR-CPRI variety recommendations */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 id="varieties-h-jh" style={sH2}>Which ICAR-CPRI potato varieties are recommended for Jharkhand?</h2>
            <p style={sIntro}>The Ministry of Agriculture, on the recommendation of ICAR-CPRI, has notified four new potato varieties whose recommended cultivation zones cover the Indian plains and plateau regions — agronomically applicable to Jharkhand&apos;s Chotanagpur plateau by inference. These are CPRI <strong>recommendations</strong> for the agro-climatic zone; state-level variety acreage data is not part of the published DA&amp;FW horticulture statistics, and this page does not assert variety-grown acreage in Jharkhand.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>{["Variety", "End use", "Yield potential (t/ha)", "Maturity (days)", "Recommendation notes"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR press release on the notification of four new ICAR-CPRI potato varieties (Ministry of Agriculture &amp; Farmers Welfare).</p>
            <p style={sP}>Kufri Ratan and the Kufri Chipbharat series cover &quot;North Indian plains and plateau&quot; and &quot;Indian plains&quot; designations, agro-climatic zones that include Jharkhand by inference. If adoption follows, these varieties are the principal vehicle for closing the productivity gap visible across the state&apos;s lower-yield districts. Birsa Agricultural University&apos;s published micropropagation protocols for Kufri Chipsona-3 and MP-644/97 are an upstream contribution to the certified-seed availability that this adoption would require.</p>
          </section>

          {/* Card 4: Research Infrastructure */}
          <section id="research" data-card="research" style={cardWrap}>
            <h2 id="research-h-jh" style={sH2}>What potato research infrastructure does Jharkhand have?</h2>
            <p style={sIntro}>Birsa Agricultural University (BAU) at Ranchi is the principal agricultural research institution in Jharkhand. Established 26 June 1981, BAU operates total land holdings of 1,250 hectares — including 1,000 hectares at the Gauria Karma Farm in Hazaribagh district. BAU administers 16 of the 22 Krishi Vigyan Kendras (KVKs) operating across Jharkhand&apos;s districts.</p>
            <QuickFactsBox items={[
              { label: "Principal research institution", value: "Birsa Agricultural University, Ranchi" },
              { label: "Established", value: "26 June 1981" },
              { label: "Total land holdings", value: "1,250 hectares" },
              { label: "Gauria Karma Farm (Hazaribagh)", value: "1,000 hectares" },
              { label: "KVK administration", value: "16 of 22 Jharkhand KVKs" },
              { label: "Documented potato research", value: "Micropropagation protocols for Kufri Chipsona-3, MP-644/97" },
            ]} />
            <p style={sP}>BAU&apos;s potato-specific research includes a published protocol for rapid micropropagation and microtuber production of two potato varieties — Kufri Chipsona-3 (chip-stock) and MP-644/97. These protocols directly target the certified-seed availability bottleneck that is a documented constraint for plateau potato cultivation across India.</p>
            <p style={sP}>The geographic alignment between research and high-productivity districts is notable: BAU&apos;s headquarters at Ranchi serves the state&apos;s largest-producing district (200,323 tonnes), and the Gauria Karma Farm sits in Hazaribagh — one of Jharkhand&apos;s top-productivity districts at 22.00 t/ha. Jharkhand is also among the states served by ICAR-CPRI&apos;s broader breeder-seed pipeline through the Gwalior Regional Research Station (referenced in the <Link href="/country/india/madhya-pradesh" style={linkPlain}>Madhya Pradesh deep-dive</Link>).</p>
            <p style={sSource}>Source: Birsa Agricultural University (BAU) Ranchi institutional records; ICAR.</p>
          </section>

          {/* Card 5: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-jh" style={sH2}>What is the agro-climatic profile for potato cultivation in Jharkhand?</h2>
            <p style={sIntro}>Jharkhand falls within ICAR&apos;s central plateau (Chotanagpur) potato-growing zone. The state cultivates potato primarily on the rabi (winter) cycle, aligned with the national pattern in which approximately 85% of India&apos;s potato production is rabi-grown.</p>
            <p style={sP}>Planting falls in October-November and harvest in February-March. Winter day temperatures across the plateau region typically sit in the 15-25°C range — within the optimal 15-22°C tuber-bulking band. Winter nights run 5-12°C, favourable for tuber formation. Most producing districts lie at 300-700 metres on the Chotanagpur plateau (Ranchi ~650 m, Hazaribagh ~600 m) — avoiding both the heat stress of the Gangetic plains and the elevation challenges of true highland zones. Soils are dominated by red lateritic and forest-derived types; cultivation generally on the better-drained, more productive sub-zones. Rainfall during the rabi window is minimal; cultivation is irrigation-dependent.</p>
            <p style={sP}>The state-level productivity of 14.95 t/ha (60% of national average) reflects this plateau profile — better than the deep northeast (<Link href="/country/india/assam" style={linkPlain}>Assam</Link> 8.56 t/ha, <Link href="/country/india/nagaland" style={linkPlain}>Nagaland</Link> 12.41 t/ha) but well below the Gangetic plains states (<Link href="/country/india/uttar-pradesh" style={linkPlain}>UP</Link> 27.55 t/ha) where deep alluvial soils and seed-supply infrastructure favour higher yields.</p>
            <p style={sSource}>Source: ICAR plateau-zone classifications; DA&amp;FW district-level data.</p>
          </section>

          {/* Card 6: Trajectory and Forward-Looking */}
          <section id="trajectory" data-card="trajectory" style={cardWrap}>
            <h2 id="trajectory-h-jh" style={sH2}>What are the challenges and forward-looking signals for Jharkhand potato?</h2>
            <p style={sIntro}>Three challenges are visible in the primary data: a 40% state-level productivity gap relative to the national average, sharp intra-state productivity variation (2.8x across listed districts), and the certified-seed availability constraint that BAU&apos;s micropropagation work is targeting.</p>
            <p style={sP}><strong>Productivity gap.</strong> Jharkhand&apos;s 14.95 t/ha versus national 24.57 t/ha is a 40% gap. The 22+ t/ha already achieved in Bokaro, Ramgarh, and Hazaribagh shows the gap is closeable on better-managed plateau acreage. The drag is concentrated in lower-productivity districts (Dumka 9.89, Garhwa 11.00, Gumla 12.25 t/ha).</p>
            <p style={sP}><strong>Intra-state variation.</strong> District-level productivity ranges from 9.89 t/ha (Dumka) to 27.70 t/ha (Bokaro) — a 2.8x range. Combined with BAU&apos;s KVK presence in 16 of 22 districts, the variation suggests extension reach and seed quality are the principal binding constraints rather than agro-climatic fundamentals.</p>
            <p style={sP}><strong>Seed supply.</strong> The BAU micropropagation work on Kufri Chipsona-3 and MP-644/97 directly targets the quality-seed bottleneck. Jharkhand is one of the states served by ICAR-CPRI&apos;s broader breeder-seed pipeline.</p>
            <p style={sP}><strong>Forward signals.</strong> The state-level area expansion across 5 years (48.88 → 51.28 thousand ha) without production volatility indicates the sector is durable, not retreating. ICAR&apos;s newly notified Kufri Ratan and Kufri Chipbharat varieties (notified for plateau/plains zones) are the likely vehicles for state-level yield gains if adoption follows.</p>
            <p style={sSource}>Source: DA&amp;FW Horticultural Statistics at a Glance 2024 (Tables 7.3.31 and 7.4.3); Birsa Agricultural University institutional records; ICAR institutional documentation.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\" — Tables 7.3.31 (state-level) and 7.4.3 (district-level) for area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR press release: \"Ministry of Agriculture Notifies Four New Potato Varieties of ICAR-CPRI for Nationwide Cultivation and Processing\" — variety yields, maturity periods, recommended zones",
            "Birsa Agricultural University (BAU), Ranchi — institutional records on potato micropropagation research (Kufri Chipsona-3, MP-644/97) and Krishi Vigyan Kendra administration",
            "ICAR-Central Potato Research Institute (ICAR-CPRI) — Regional Research Station, Gwalior; AICRP on Potato",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="jharkhand" />

          <ContinueReading articles={[
            { href: "/knowledge/kufri-potato-varieties-india", tag: "Varieties", title: "Kufri Potato Varieties: India's Complete Guide", desc: "ICAR-CPRI variety register including the recently notified Kufri Ratan and Chipbharat series." },
            { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems: Certification, Multiplication, Trade", desc: "How BAU's micropropagation protocols fit into India's certified-seed pipeline." },
            { href: "/country/india/madhya-pradesh", tag: "Comparison", title: "Madhya Pradesh Potato — India's #5 Producer", desc: "Adjacent central-Indian plateau context; shares the ICAR-CPRI Gwalior breeder-seed pipeline." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State — A Story-Format Deep Dive", desc: "Where Jharkhand sits in India's potato map, by the DA&FW primary statistics." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 7: Maharashtra ── */

function MaharashtraState() {
  // Recently notified ICAR-CPRI varieties. Maharashtra is one of six states named EXPLICITLY in
  // the Kufri Tejas zone recommendation — the only one of the 9 wave-3 states with an explicit
  // ICAR varietal designation. Other three varieties cover "Indian plains" agro-climatic zone.
  const varieties = [
    ["Kufri Tejas", "Table", "37–40", "90", "EXPLICIT Maharashtra zone designation; heat-tolerant"],
    ["Kufri Chipbharat-1", "Chip processing", "35–38", "100", "Indian plains; high dry matter (21%)"],
    ["Kufri Chipbharat-2", "Chip processing", "35–37", "90", "Early-maturing; same zone as Chipbharat-1"],
    ["Kufri Ratan", "Table", "37–39", "90", "North Indian plains and plateau"],
  ];

  const faqItems = [
    { q: "How much potato does Maharashtra produce?", a: "Maharashtra produced 386.69 thousand tonnes of potatoes in 2023-24 from 14,450 hectares at a productivity of 26.77 t/ha, contributing 0.68% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Productivity is 8.9% above the national average of 24.57 t/ha." },
    { q: "Is Maharashtra's potato sector growing or shrinking?", a: "Across the 5-year DA&FW series, Maharashtra has lost 37.2% of its potato area (23.00 → 14.45 thousand ha) while productivity has risen 35.3% (19.78 → 26.77 t/ha). Net production declined only 15.0% (455 → 387 thousand tonnes). This is a consolidation onto higher-productivity acreage rather than a uniform retreat — marginal land has exited the crop while the remaining acreage benefits from concentrated inputs (DA&FW Horticultural Statistics at a Glance 2024)." },
    { q: "Why is Maharashtra's potato area declining?", a: "The DA&FW state-level series documents the area contraction but does not attribute a cause. The pattern (area down, productivity up, production roughly flat) is consistent with marginal acreage exiting the crop while better-managed fields concentrate inputs and achieve higher yields. State-level variety adoption, irrigation infrastructure, and crop-shift data that would identify drivers are not part of the published DA&FW horticulture statistics surface." },
    { q: "Which ICAR potato varieties are recommended for Maharashtra?", a: "Maharashtra is one of six states named EXPLICITLY in the recommended cultivation zone for Kufri Tejas — a recently notified ICAR-CPRI table variety with 37-40 t/ha yield potential, 90-day maturity, and heat-tolerance (recommended zones: Haryana, Punjab, UP, Madhya Pradesh, Gujarat, Maharashtra). Two other recently notified varieties (Kufri Chipbharat-1 and Chipbharat-2, both chip processing) have recommended zones described as 'Indian plains' — broadly inclusive of Maharashtra's potato districts. These are recommendations for the agro-climatic zone, not adoption claims." },
    { q: "Does Maharashtra have district-level potato data?", a: "No — DA&FW Horticultural Statistics at a Glance 2024 Table 7.4.3 (major producing districts) does NOT enumerate district-level potato production for Maharashtra. The major-districts table in the 2024 publication covers Bihar, Gujarat, Haryana, Jharkhand, Madhya Pradesh, Punjab, Uttar Pradesh, and West Bengal — eight states. Maharashtra's potato footprint falls below the threshold for individual district enumeration in the national table." },
    { q: "Which Indian states rank above and below Maharashtra in potato production?", a: "Maharashtra's 0.68% national share in 2023-24 places it well below the top-5 (UP, West Bengal, Bihar, Gujarat, Madhya Pradesh — which together produce >80% of national output) and below Punjab, Assam, and Jharkhand. It ranks above the marginal northeast and southern states. The state is more notable as a productivity case study than as a volume contributor." },
    { q: "When are potatoes planted in Maharashtra?", a: "Maharashtra follows the rabi (winter) cropping pattern as the predominant season — planting October-November, harvest February-March. Limited kharif cultivation occurs in the Western Ghats. The rabi window matches the cool 18-28°C daytime temperature band in the western plateau producing region (ICAR-CPRI)." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Maharashtra Potato Production Time Series",
    description: "State-level potato area, production, and productivity for Maharashtra 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Table 7.3.31). Captures the area-consolidation / productivity-gain pattern across the 5-year window.",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Maharashtra potato, Deccan plateau, Kufri Tejas, DA&FW Horticultural Statistics at a Glance 2024",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="maharashtra" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Maharashtra" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Maharashtra" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>10 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["maharashtra"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Share of India", value: "0.68% (small but productivity-positive)" },
            { label: "Production 2023-24", value: "386.69 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "14,450 ha" },
            { label: "Productivity 2023-24", value: "26.77 t/ha (+8.9% vs national)" },
            { label: "5-year area change", value: "−37.2% (23.00 → 14.45 K ha)" },
            { label: "5-year yield change", value: "+35.3% (19.78 → 26.77 t/ha)" },
            { label: "ICAR variety designation", value: "Kufri Tejas (explicit Maharashtra zone)" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Maharashtra produced 386.69 thousand tonnes of potatoes in 2023-24 from 14,450 hectares at a productivity of 26.77 t/ha — 0.68% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> The headline number understates the trajectory: across the 5-year DA&amp;FW series, Maharashtra has lost 37.2% of its potato area while productivity has risen 35.3%, leaving production down only 15.0%. The state is consolidating onto more productive acreage rather than uniformly retreating from the crop. Maharashtra is the only audit-9 wave-3 state to be named explicitly in a recent ICAR-CPRI variety zone recommendation (Kufri Tejas).</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "386.69K t", label: "Production 2023-24" },
            { value: "0.68%", label: "Share of India" },
            { value: "26.77 t/ha", label: "Productivity (+8.9% vs nat'l)" },
            { value: "−37%", label: "5-yr area change" },
          ]} />

          {/* Card 1: Production overview (DA&FW 5-year series) */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-mh" style={sH2}>How much potato does Maharashtra produce?</h2>
            <p style={sIntro}>Maharashtra produced 386.69 thousand tonnes of potatoes in 2023-24 from 14,450 hectares at a productivity of 26.77 t/ha (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31). The 2023-24 productivity reading is the highest in the 5-year series and approaches the productivity of leading processing states such as <Link href="/country/india/gujarat" style={linkPlain}>Gujarat</Link>.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "23.00", "455.00", "19.78"],
                    ["2020-21", "22.03", "491.94", "22.33"],
                    ["2021-22", "19.42", "407.46", "20.98"],
                    ["2022-23", "15.45", "278.91", "18.06"],
                    ["2023-24", "14.45", "386.69", "26.77"],
                  ].map((r, i) => (
                    <tr key={r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i === 4 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}>DA&amp;FW Table 7.4.3 (major producing districts) does NOT enumerate Maharashtra districts — only Bihar, Gujarat, Haryana, Jharkhand, Madhya Pradesh, Punjab, Uttar Pradesh, and West Bengal are covered. Maharashtra&apos;s potato footprint falls below the threshold for individual district enumeration. District-level data is therefore not asserted on this page.</p>
          </section>

          {/* Card 2: Consolidation pattern interpretation */}
          <section id="consolidation" data-card="consolidation" style={cardWrap}>
            <h2 id="consolidation-h-mh" style={sH2}>Why is the consolidation pattern significant?</h2>
            <p style={sIntro}>The Maharashtra trajectory (area −37%, yield +35%, production −15% across 5 years) is the cleanest &quot;consolidation&quot; signal in the DA&amp;FW state-level series. Three contrasts make this clear:</p>
            <p style={sP}><strong>UNLIKE <Link href="/country/india/andhra-pradesh" style={linkPlain}>Andhra Pradesh</Link></strong> (the only other audit state with a sharply contracting potato area), Maharashtra&apos;s production decline (−15%) is much less than its area decline (−37%) — productivity is compensating. Andhra Pradesh shows roughly proportional collapse in both area and production, consistent with genuine retreat from the crop.</p>
            <p style={sP}><strong>UNLIKE <Link href="/country/india/madhya-pradesh" style={linkPlain}>Madhya Pradesh</Link></strong> (which had a single-year area contraction in 2023-24 with a +10% productivity gain), Maharashtra&apos;s contraction is multi-year and the productivity gain is much larger (+35%). MP&apos;s pattern reads as an opportunistic high-yield year; Maharashtra&apos;s reads as structural consolidation.</p>
            <p style={sP}><strong>UNLIKE <Link href="/country/india/jharkhand" style={linkPlain}>Jharkhand</Link></strong> (steady area growth with flat productivity), Maharashtra is moving in the opposite direction on both axes — fewer hectares, higher yields per hectare.</p>
            <p style={sP}>The 2023-24 productivity peak (26.77 t/ha) coming AFTER 4 years of area contraction suggests the consolidation is yielding measurable returns and is unlikely to reverse to the higher-acreage / lower-productivity baseline. Whether this reaches a new equilibrium at a smaller-but-more-productive footprint, or continues toward further area decline, is the question the next 2-3 years of DA&amp;FW data will resolve.</p>
            <StatCallout number="+48.2%" unit="single-year productivity jump (2022-23 → 2023-24)" context="Productivity moved from 18.06 to 26.77 t/ha in a single year — the largest single-year productivity gain in Maharashtra's 5-year series. Combined with area at the smallest base in the series, this is the clearest 'consolidation onto better-managed acreage' signal." source="DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31" />
          </section>

          {/* Card 3: ICAR-CPRI variety recommendations */}
          <section id="varieties" data-card="varieties" style={cardWrap}>
            <h2 id="varieties-h-mh" style={sH2}>Which ICAR-CPRI potato varieties are recommended for Maharashtra?</h2>
            <p style={sIntro}>Maharashtra is one of six states named explicitly in the recommended cultivation zone for Kufri Tejas, a recently notified ICAR-CPRI table variety. These are CPRI <strong>recommendations</strong> for the agro-climatic zone — state-level variety adoption acreage is not part of the published DA&amp;FW horticulture statistics surface.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>{["Variety", "End use", "Yield potential (t/ha)", "Maturity (days)", "Recommendation notes"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {varieties.map((r, i) => (
                    <tr key={r[0]} style={{ background: i === 0 ? "rgba(198,40,40,0.05)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i === 0 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                      <td style={{ ...sTd, color: "#555" }}>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: ICAR press release on the notification of four new ICAR-CPRI potato varieties (Ministry of Agriculture &amp; Farmers Welfare).</p>
            <p style={sP}>Kufri Tejas is the only one of the four newly notified varieties with an explicit Maharashtra zone designation. Its heat-tolerance trait is agronomically relevant for the state&apos;s rabi cycle, which runs into rising late-winter temperatures across the western plateau. The other three varieties (Kufri Ratan, Kufri Chipbharat-1/2) cover &quot;North Indian plains and plateau&quot; or &quot;Indian plains&quot; — agro-climatic zones that include Maharashtra by inference but do not name it individually.</p>
          </section>

          {/* Card 4: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-mh" style={sH2}>What is the agro-climatic profile for potato cultivation in Maharashtra?</h2>
            <p style={sIntro}>Maharashtra&apos;s potato cultivation occurs primarily in the western and central plateau regions. Producing geography concentrates in the 500-900 metre elevation range on the Deccan plateau and the Western Ghats foothills. Soils are dominated by black cotton (regur) types; cropping is irrigation-dependent (ICAR plateau/plains zone classification).</p>
            <p style={sP}>The agro-climatic envelope is rabi-dominant — planting October-November, harvest February-March. Winter day temperatures in the western plateau typically sit at 18-28°C, with the lower end of the range falling within the optimal 15-22°C tuber-bulking band. Late-season heat stress (rising March temperatures) is a known constraint, which is why heat-tolerant variety notifications such as Kufri Tejas have explicit relevance for Maharashtra. Limited kharif potato cultivation occurs in the Western Ghats but does not contribute meaningfully to state aggregate volumes.</p>
            <p style={sP}>Maharashtra&apos;s productivity of 26.77 t/ha in 2023-24 — modestly above the national average — is consistent with an Indian plateau cropping pattern that benefits from disciplined irrigation and progressive farming practices, in contrast to the lower yields of the rain-fed northeast or the area-driven yields of the Gangetic plains.</p>
            <p style={sSource}>Source: ICAR plateau/plains zone classification; DA&amp;FW state-level data.</p>
          </section>

          {/* Card 5: Challenges + Forward-Looking */}
          <section id="trajectory" data-card="trajectory" style={cardWrap}>
            <h2 id="trajectory-h-mh" style={sH2}>What is Maharashtra&apos;s potato outlook?</h2>
            <p style={sIntro}>Three structural features define Maharashtra&apos;s potato outlook: a small absolute footprint (386.69 thousand t — the smallest of the four wave-3 Tier 1 states), opacity at district level (no DA&amp;FW major-districts data), and a heat-stress window that ICAR&apos;s Kufri Tejas notification is targeting.</p>
            <p style={sP}><strong>Small absolute footprint.</strong> At 386.69 thousand t / 14,450 ha, Maharashtra&apos;s potato sector is the smallest of the four Tier 1 wave-3 audit states. National-level price or supply shocks have limited leverage on Maharashtra&apos;s potato economy specifically — the state matters more as a productivity case study than as a volume contributor.</p>
            <p style={sP}><strong>District-level data opacity.</strong> The absence of Maharashtra districts in DA&amp;FW Table 7.4.3 means the principal national source publishes only aggregate data for the state. District-scale productivity differentials — the actionable signal for extension or input policy — are not visible at the national source level for Maharashtra.</p>
            <p style={sP}><strong>Forward signals.</strong> The 2023-24 productivity jump (26.77 t/ha) on a smaller acreage base suggests Maharashtra has found a productivity floor at or above the national average. ICAR&apos;s explicit naming of Maharashtra in the Kufri Tejas zone is a forward indicator that variety-driven yield gains are the priority lever. A re-expansion of acreage is unlikely unless processing-driven contract farming (the Gujarat model) extends to Maharashtra at scale — there is no published DA&amp;FW signal of this occurring yet.</p>
            <p style={sSource}>Source: DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31; ICAR variety notification.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\", Table 7.3.31 — state-level area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR press release on the notification of four new ICAR-CPRI potato varieties (Ministry of Agriculture & Farmers Welfare) — Kufri Tejas explicit zone recommendation including Maharashtra",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="maharashtra" />

          <ContinueReading articles={[
            { href: "/knowledge/kufri-potato-varieties-india", tag: "Varieties", title: "Kufri Potato Varieties: India's Complete Guide", desc: "ICAR-CPRI variety register including the recently notified Kufri Tejas (with explicit Maharashtra zone designation)." },
            { href: "/country/india/madhya-pradesh", tag: "Comparison", title: "Madhya Pradesh Potato — India's #5 Producer", desc: "Adjacent central-Indian plateau peer; shares the Kufri Tejas zone designation with Maharashtra." },
            { href: "/country/india/gujarat", tag: "Comparison", title: "Gujarat Potato — India's Processing Capital", desc: "Processor-led model that has not yet extended to Maharashtra at scale." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State", desc: "Where Maharashtra fits in India's state-by-state potato map, by the DA&FW primary statistics." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 8: Andhra Pradesh ── */

function AndhraPradeshState() {
  const faqItems = [
    { q: "How much potato does Andhra Pradesh produce?", a: "Andhra Pradesh produced 17.76 thousand tonnes of potatoes in 2023-24 from 590 hectares at a productivity of 30.00 t/ha, contributing 0.03% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Productivity is 22% above the national average of 24.57 t/ha — a productivity-positive position on a very small footprint." },
    { q: "Is Andhra Pradesh a major potato producer in India?", a: "No — Andhra Pradesh is no longer a meaningful potato-producing state at the national level. Its 2023-24 production (17.76 thousand t) is approximately 0.5% of Madhya Pradesh's output (3,949 thousand t) and 0.09% of Uttar Pradesh's (19,173 thousand t). Production is below that of even smaller northeastern states such as Tripura, Nagaland, and Meghalaya." },
    { q: "Why has Andhra Pradesh's potato production declined?", a: "Across the 5-year DA&FW series, Andhra Pradesh has lost 78.7% of its potato area and 64.4% of its production — the most severe contraction documented in DA&FW state-level data. The decline is concentrated in a single year (2020-21 → 2021-22) when area collapsed from 2.29 to 0.44 thousand hectares (−81%) and production fell from 41.27 to 17.52 thousand tonnes (−58%). Primary sources document the scale of the decline but do not establish its cause. State-level variety acreage and crop-shift data that would identify drivers are not part of the published DA&FW horticulture statistics surface." },
    { q: "What happened to Andhra Pradesh potato production in 2021-22?", a: "The 2020-21 → 2021-22 transition was a step change rather than gradual contraction: area collapsed from 2.29 to 0.44 thousand hectares (−81%) in a single year, production fell 58% (41.27 → 17.52 thousand tonnes), and productivity simultaneously more than doubled (18.00 → 40.00 t/ha) — consistent with abandonment of marginal acreage rather than uniform contraction. Subsequent years (2022-23, 2023-24) show stabilisation at the lower base. The primary DA&FW data does not document the specific driver." },
    { q: "Where is potato grown in Andhra Pradesh today?", a: "The state's potato cultivation has historically concentrated in the Rayalaseema districts (the arid south-central interior) and parts of the coastal Andhra region. The residual sector (590 hectares in 2023-24) appears to occupy agronomically favourable micro-environments where water-table constraints, heat-stress risk, and competition from horticultural alternatives are least binding. State-level published data does not enumerate which specific districts remain in cultivation." },
    { q: "Is Andhra Pradesh's potato decline likely to reverse?", a: "The primary DA&FW data does not support a reversal projection. The 2021-22 step change followed by 3 years of stabilisation at the lower base (0.44 → 0.44 → 0.59 thousand ha) suggests the residual sector has reached a new equilibrium on its remaining productivity-favourable acreage. Reversal would require investments in irrigation, variety adoption, or contract farming that the published statistics do not currently indicate." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Andhra Pradesh Potato Production Time Series",
    description: "State-level potato area, production, and productivity for Andhra Pradesh 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Table 7.3.31). Documents a 78.7% area contraction and 64.4% production decline across the 5-year window.",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Andhra Pradesh potato, Rayalaseema, DA&FW Horticultural Statistics at a Glance 2024, state retreat",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="andhra-pradesh" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Andhra Pradesh" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Andhra Pradesh" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>8 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["andhra-pradesh"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Share of India", value: "0.03% (effectively retreated)" },
            { label: "Production 2023-24", value: "17.76 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "590 ha" },
            { label: "Productivity 2023-24", value: "30.00 t/ha (+22% vs national)" },
            { label: "5-year area change", value: "−78.7% (2.77 → 0.59 K ha)" },
            { label: "5-year production change", value: "−64.4% (49.86 → 17.76 K t)" },
            { label: "District-level data", value: "Not enumerated in DA&FW Table 7.4.3" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Andhra Pradesh produced 17.76 thousand tonnes of potatoes in 2023-24 from 590 hectares at a productivity of 30.00 t/ha — 0.03% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> Andhra Pradesh is the clearest example in the DA&amp;FW state-level series of a state effectively withdrawing from potato cultivation: across the 5-year window 2019-20 to 2023-24, the state has lost 78.7% of its potato area and 64.4% of its production. This page exists to document a real, measurable retreat — not to manufacture a production narrative that the primary data does not support. <strong>Primary sources document the scale of the decline but do not establish its cause.</strong></p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "17.76K t", label: "Production 2023-24" },
            { value: "0.03%", label: "Share of India" },
            { value: "−78.7%", label: "5-yr area change" },
            { value: "−64.4%", label: "5-yr production change" },
          ]} />

          {/* Card 1: Production overview (DA&FW 5-year series) */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-ap" style={sH2}>How much potato does Andhra Pradesh produce?</h2>
            <p style={sIntro}>Andhra Pradesh produced 17.76 thousand tonnes of potatoes in 2023-24 from 590 hectares at a productivity of 30.00 t/ha — 0.03% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Productivity is 22% above the national average on a very small footprint.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "2.77", "49.86", "18.00"],
                    ["2020-21", "2.29", "41.27", "18.00"],
                    ["2021-22", "0.44", "17.52", "40.00"],
                    ["2022-23", "0.44", "13.14", "30.00"],
                    ["2023-24", "0.59", "17.76", "30.00"],
                  ].map((r, i) => (
                    <tr key={r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i === 2 ? "rgba(198,40,40,0.08)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: (i === 4 || i === 2) ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}>DA&amp;FW Table 7.4.3 (major producing districts) does NOT enumerate Andhra Pradesh districts. The state&apos;s footprint is below the threshold for individual district enumeration in the national table. District-level data is therefore not asserted on this page.</p>
          </section>

          {/* Card 2: Decline interpretation */}
          <section id="decline" data-card="decline" style={cardWrap}>
            <h2 id="decline-h-ap" style={sH2}>How significant is the decline?</h2>
            <p style={sIntro}>The Andhra Pradesh decline is unique among Indian states in several respects.</p>
            <p style={sP}><strong>1. Scale of contraction.</strong> −78.7% area and −64.4% production over 5 years exceeds any other state in the DA&amp;FW series. <Link href="/country/india/maharashtra" style={linkPlain}>Maharashtra</Link> is the next-largest contractor at −37% area; the rest of Indian potato states show either growth or near-stability.</p>
            <p style={sP}><strong>2. Step-change pattern.</strong> The contraction is not gradual — it is concentrated in the 2020-21 → 2021-22 transition. Most of the area loss happened in a single year (2.29 → 0.44 thousand ha, −81%). Subsequent years show stabilisation at the new lower base, not continued decline. This pattern is consistent with a single decisive policy or market signal rather than gradual marginal exit.</p>
            <p style={sP}><strong>3. Productivity-positive outcome.</strong> The surviving footprint is more productive (30+ t/ha) than the pre-break baseline (18 t/ha). The cultivation that remains is on better-managed acreage — whatever survived the area cull was the higher-productivity sub-segment.</p>
            <p style={sP}><strong>The primary DA&amp;FW data does not document the cause of the 2020-21 / 2021-22 transition. Primary sources document the scale of the decline but do not establish its cause.</strong> This page does not assert a cause — it documents the measurable pattern.</p>
          </section>

          {/* Card 3: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-ap" style={sH2}>What is the agro-climatic context for potato in Andhra Pradesh?</h2>
            <p style={sIntro}>Andhra Pradesh&apos;s potato cultivation has historically concentrated in the Rayalaseema districts (the arid south-central interior) and parts of the coastal Andhra region. The region falls within the &quot;southern plateau and hills&quot; agro-climatic zone — generally less favourable for potato than the central plateau (Madhya Pradesh, Maharashtra) or the alluvial plains (Uttar Pradesh, Punjab).</p>
            <p style={sP}>Winter day temperatures are warmer than the optimal 15-22°C tuber-bulking range across much of the state. The rabi cropping window is narrower than for more northern states. Cultivation is irrigation-dependent, and the principal traditional potato districts (in the Rayalaseema region) are also areas of acute groundwater stress.</p>
            <p style={sP}>The remaining cultivation appears to occupy the agronomically favourable micro-environments where these constraints are least binding. The post-2021 productivity uplift (to 30+ t/ha) is consistent with the residual sector occupying these favourable niches. This is a viable productivity floor but the small absolute footprint limits state-level contribution.</p>
            <p style={sSource}>Source: ICAR agro-climatic zone classifications; general agronomic literature on the southern peninsular potato cultivation zone.</p>
          </section>

          {/* Card 4: National Framing */}
          <section id="national" data-card="national" style={cardWrap}>
            <h2 id="national-h-ap" style={sH2}>How does Andhra Pradesh compare to other Indian states today?</h2>
            <p style={sIntro}>Andhra Pradesh is no longer a meaningful potato-producing state at the national level. By 2023-24 production (17.76 thousand t), the state ranks among the bottom of the DA&amp;FW table — production is below that of <Link href="/country/india/tripura" style={linkPlain}>Tripura</Link> (146.05 K t), Nagaland (55.12 K t), and Meghalaya (196.25 K t).</p>
            <p style={sP}>For scale comparison: the state&apos;s 2023-24 production is approximately 0.5% of <Link href="/country/india/madhya-pradesh" style={linkPlain}>Madhya Pradesh&apos;s</Link> production (3,949 thousand t) and 0.09% of <Link href="/country/india/uttar-pradesh" style={linkPlain}>Uttar Pradesh&apos;s</Link> (19,173 thousand t). The structural retreat documented in this page is the headline fact for Andhra Pradesh&apos;s potato sector at the present time.</p>
          </section>

          {/* Card 5: Honest Data Scope Note */}
          <section id="data-scope" data-card="data-scope" style={cardWrap}>
            <h2 id="scope-h-ap" style={sH2}>What data is NOT available for Andhra Pradesh?</h2>
            <p style={sIntro}>This page is built on the DA&amp;FW state-level series only. The following information surfaces are NOT available from primary sources surveyed for this document:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>District-level area, production, or productivity data for Andhra Pradesh (the state is not in DA&amp;FW Table 7.4.3)</li>
              <li>Variety-specific acreage data for Andhra Pradesh</li>
              <li>Direct primary-source attribution of the 2020-21 / 2021-22 area collapse to specific climate, market, or policy drivers</li>
              <li>State-specific processing capacity, contract farming, or cold storage data</li>
            </ul>
            <p style={sP}>Where these data become available from approved primary sources (state horticulture commissioner reports, ICAR-CRIDA studies, peer-reviewed agronomic literature), this page is structured to absorb them as additional sections without requiring a rewrite.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\", Table 7.3.31 — state-level area, production and productivity of potato 2019-20 through 2023-24",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="andhra-pradesh" />

          <ContinueReading articles={[
            { href: "/country/india/maharashtra", tag: "Comparison", title: "Maharashtra Potato — A Consolidation Story", desc: "Maharashtra also has a multi-year area contraction — but unlike AP, productivity is rising sharply." },
            { href: "/country/india/madhya-pradesh", tag: "Comparison", title: "Madhya Pradesh Potato — India's #5 Producer", desc: "Adjacent central-Indian plateau peer where the cropping sector is on a stable expansion path." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State", desc: "Where AP fits in India's state map — and which states have moved past it in production volume." },
            { href: "/country/india", tag: "Country", title: "India Potato Country Profile", desc: "National-level potato production context and state breakdown." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 9: Assam ── */

function AssamState() {
  const faqItems = [
    { q: "How much potato does Assam produce?", a: "Assam produced 911.33 thousand tonnes of potatoes in 2023-24 from 106,470 hectares at a productivity of 8.56 t/ha, contributing 1.60% of India's national output — ranked 7th nationally (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Assam is the largest potato-producing state in India's northeast region, with roughly 70% of NE region production share." },
    { q: "Why is Assam's potato productivity so low?", a: "Assam's 8.56 t/ha is 35% of the national average (24.57 t/ha) — the lowest among meaningful Indian potato-producing states. The yield gap is not driven by any single constraint but by a cluster of interacting agronomic, infrastructure, and market factors documented in peer-reviewed studies of potato in the northeastern region: limited certified seed availability and farmer reliance on saved seed with viral degeneration, heavy tuber loss in storage with no local cold-chain infrastructure, limited input access (fertilisers, plant protection chemicals) at village level, and limited marketing facilities with year-round price volatility." },
    { q: "Is Assam's potato production growing?", a: "Yes, modestly. Across the 5-year DA&FW series (2019-20 to 2023-24), Assam's area expanded 1.6%, production rose 20.5% (756 → 911 thousand tonnes), and productivity gained 18.6% (7.22 → 8.56 t/ha). The productivity gain is almost entirely concentrated in the most recent year (7.46 → 8.56 t/ha, +15% single-year jump). Whether this 2023-24 jump represents structural improvement or a one-time gain will become clearer in coming seasons." },
    { q: "What research infrastructure supports Assam potato?", a: "Assam's potato research and extension is served by the ICAR Research Complex for NEH Region (ICAR-RCNEH), headquartered at Umiam (Barapani), Meghalaya, established 9 January 1975. ICAR-RCNEH operates regional centres across the seven sister states, with the Tripura Centre at Lembucherra, Manipur Centre at Imphal, and others. Assam Agricultural University (AAU) at Jorhat is the state agricultural university; research-extension to farmers operates through Krishi Vigyan Kendras (KVKs) administered jointly by AAU and ICAR." },
    { q: "Does Assam have district-level potato data?", a: "No — DA&FW Horticultural Statistics at a Glance 2024 Table 7.4.3 (major producing districts) does NOT enumerate Assam districts for potato. The major-districts table covers eight states: Bihar, Gujarat, Haryana, Jharkhand, Madhya Pradesh, Punjab, Uttar Pradesh, and West Bengal. Assam's potato districts are not in this table, so district-level data is not asserted on this page." },
    { q: "When is potato grown in Assam?", a: "Assam cultivates potato in both rabi (winter, primary) and a small kharif window in the upper Brahmaputra valley. Rabi planting runs October-November; harvest February-March. Winter day temperatures in the Brahmaputra valley typically sit at 15-25°C — within or near the optimal tuber-bulking range. Late-monsoon residual humidity through October complicates land preparation; March pre-monsoon showers can complicate harvest." },
    { q: "How much could Assam potato production grow?", a: "If Assam could close even half its yield gap (8.56 → 16.5 t/ha) on existing acreage, production would exceed 1.75 million tonnes — comparable to mid-tier producing states. The state has the climate to produce 18-22 t/ha on the rabi cycle (matching or exceeding national average) but the input-and-infrastructure stack to produce only 8-9 t/ha. Closing the gap requires seed-supply improvements, cold-chain investment, and extension reach — the binding constraints identified in peer-reviewed studies." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Assam Potato Production Time Series",
    description: "State-level potato area, production, and productivity for Assam 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Table 7.3.31). Documents the structural yield deficit and the 2023-24 productivity inflection.",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Assam potato, Brahmaputra valley, ICAR-RCNEH, Assam Agricultural University, DA&FW Horticultural Statistics at a Glance 2024, northeast India potato",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="assam" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Assam" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Assam" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>11 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["assam"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Rank in India", value: "#7 (1.60% of national output)" },
            { label: "Production 2023-24", value: "911.33 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "106,470 ha (4.59% of national)" },
            { label: "Productivity 2023-24", value: "8.56 t/ha (35% of national avg)" },
            { label: "5-year productivity gain", value: "+18.6% (almost all in 2023-24)" },
            { label: "Northeast region share", value: "~70% of NE production" },
            { label: "Research hub", value: "ICAR-RCNEH (Umiam, Meghalaya) + AAU (Jorhat)" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Assam produced 911.33 thousand tonnes of potatoes in 2023-24 from 106,470 hectares at a productivity of 8.56 t/ha — 1.60% of India&apos;s national output, ranked 7th nationally (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> Assam is the largest northeast potato producer, with roughly 70% of NE region production share. The defining feature of Assam&apos;s potato sector is the structural yield deficit: 8.56 t/ha is 35% of the national average — the lowest of any meaningful Indian potato-producing state. The 2023-24 productivity jump (+15% YoY) is the most encouraging signal in 5 years; whether it sustains will become clearer in coming seasons.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "911.33K t", label: "Production 2023-24" },
            { value: "1.60%", label: "Share of India (#7)" },
            { value: "8.56 t/ha", label: "Productivity (35% of nat'l)" },
            { value: "+18.6%", label: "5-yr productivity gain" },
          ]} />

          {/* Card 1: Production overview (DA&FW 5-year series) */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-as" style={sH2}>How much potato does Assam produce?</h2>
            <p style={sIntro}>Assam produced 911.33 thousand tonnes of potatoes in 2023-24 from 106.47 thousand hectares at a productivity of 8.56 t/ha — 1.60% of India&apos;s national output, ranked 7th nationally (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Assam uses ~4.6% of national potato area for ~1.6% of national production — the visible measure of the structural yield gap.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "104.75", "756.22", "7.22"],
                    ["2020-21", "103.04", "757.63", "7.35"],
                    ["2021-22", "103.44", "761.84", "7.37"],
                    ["2022-23", "103.64", "773.37", "7.46"],
                    ["2023-24", "106.47", "911.33", "8.56"],
                  ].map((r, i) => (
                    <tr key={r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i === 4 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}>The 2023-24 productivity gain is the single most important signal in Assam&apos;s recent series — a +15% single-year jump (7.46 → 8.56 t/ha) on stable acreage. Production rose 17.8% year-over-year (773 → 911 thousand tonnes). If sustained, this would push the state above 9 t/ha on existing acreage and materially close (though not eliminate) the gap to the national average.</p>
            <p style={sP}>DA&amp;FW Table 7.4.3 (major producing districts) does NOT enumerate Assam districts for potato. District-level data is therefore not asserted on this page.</p>
          </section>

          {/* Card 2: Yield-gap structure */}
          <section id="yield-gap" data-card="yield-gap" style={cardWrap}>
            <h2 id="yield-h-as" style={sH2}>Why is Assam&apos;s potato productivity below the national average?</h2>
            <p style={sIntro}>Assam&apos;s 8.56 t/ha productivity (vs national 24.57 t/ha) is not driven by any single constraint but by a cluster of interacting agronomic, infrastructure, and market factors documented in peer-reviewed studies of potato in the northeastern region.</p>
            <p style={sP}><strong>Quality seed availability.</strong> Non-availability of certified/breeder-grade seed potato at affordable prices, and farmer reliance on saved seed of variable health. Seed-tuber degeneration (viral load buildup over multiple multiplications without replacement from certified sources) is a documented constraint.</p>
            <p style={sP}><strong>Post-harvest losses.</strong> Heavy tuber loss in storage; absence of local cold storage infrastructure at the production site. Where cold chain exists in other states (UP, Punjab, West Bengal), it forms a backbone of the potato economy; its absence in Assam compresses the sellable share of harvest and depresses farm-gate prices, which in turn limits investment in inputs.</p>
            <p style={sP}><strong>Input access.</strong> Limited reach of fertilisers, plant protection chemicals, and improved varieties at the village level in many production zones.</p>
            <p style={sP}><strong>Marketing infrastructure.</strong> Limited efficient marketing facilities at village level; price volatility through the year; no reliable minimum support mechanism.</p>
            <p style={sP}>These constraints are documented in peer-reviewed literature on potato cultivation in Assam and the broader North-Eastern Hill region. The 2023-24 productivity gain (+15% year-on-year) suggests some loosening of these constraints — whether driven by better seed supply, improved infrastructure reach, or favourable weather is not separately identifiable in the DA&amp;FW series alone.</p>
          </section>

          {/* Card 3: Research Infrastructure */}
          <section id="research" data-card="research" style={cardWrap}>
            <h2 id="research-h-as" style={sH2}>What research infrastructure supports Assam potato?</h2>
            <p style={sIntro}>Assam&apos;s potato research and extension is served by two principal institutions: the ICAR Research Complex for NEH Region (headquartered at Umiam, Meghalaya) and Assam Agricultural University at Jorhat.</p>
            <QuickFactsBox items={[
              { label: "Regional ICAR hub", value: "ICAR-RCNEH (Umiam / Barapani, Meghalaya)" },
              { label: "Established", value: "9 January 1975" },
              { label: "ICAR-RCNEH coverage", value: "Seven sister states + Sikkim" },
              { label: "State agricultural university", value: "Assam Agricultural University, Jorhat" },
              { label: "Extension network", value: "Krishi Vigyan Kendras (KVKs) jointly AAU + ICAR" },
              { label: "ICAR-CPRI breeder seed", value: "Northeast served by CPRI regional supply pipeline" },
            ]} />
            <p style={sP}>The <strong>ICAR Research Complex for NEH Region (ICAR-RCNEH)</strong> at Umiam, Meghalaya was established 9 January 1975 — the first of its kind multidisciplinary ICAR institution for the North-Eastern Hill Region, encompassing all of agriculture, horticulture, animal sciences, agricultural engineering, agroforestry, fishery, and social sciences. Improving and popularising potato cultivation in the northeast is among its mandated objectives. ICAR-RCNEH operates regional centres at <Link href="/country/india/tripura" style={linkPlain}>Lembucherra (Tripura)</Link>, Imphal (Manipur), Kolasib (Mizoram), Jharnapani (Nagaland), Basar (Arunachal Pradesh), and Gangtok (Sikkim) — propagating research outputs across the seven sister states.</p>
            <p style={sP}><strong>Assam Agricultural University (AAU)</strong> at Jorhat is the state agricultural university; the research-extension chain to farmers operates through KVKs administered jointly by AAU and ICAR. The volume of certified/breeder seed reaching Assam farmers (versus farmer-saved seed) is the practical lever on the seed-quality constraint identified in the yield-gap analysis.</p>
            <p style={sSource}>Source: ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation; ICAR; Assam Agricultural University.</p>
          </section>

          {/* Card 4: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-as" style={sH2}>What is the agro-climatic profile for potato cultivation in Assam?</h2>
            <p style={sIntro}>Assam falls within ICAR&apos;s North-Eastern Hill / Brahmaputra valley agro-climatic zone. Cropping seasons cover both rabi (winter, primary) and a small kharif window in the upper Brahmaputra valley.</p>
            <p style={sP}>Rabi planting falls in October-November; harvest February-March. Winter day temperatures in the Brahmaputra valley typically sit at 15-25°C — within or near the optimal 15-22°C tuber-bulking range. Winter nights run 8-15°C, favourable for tuber formation. Most of the producing area is in the Brahmaputra valley (low-elevation alluvial); highland districts of Karbi Anglong and Dima Hasao add a small late-cycle contribution. Late-monsoon residual humidity through October complicates land preparation for rabi planting; March pre-monsoon showers can complicate harvest.</p>
            <p style={sP}>Soils are alluvial in the valley, lateritic in the highland districts. Valley soils are agronomically favourable but waterlogging during late monsoon is a chronic risk. The combination of agro-climatic favourability (good temperature window, adequate winter rainfall) with structural constraints (seed quality, post-harvest infrastructure) is the underlying explanation for the yield gap: Assam has the climate to produce 18-22 t/ha on the rabi cycle (matching or exceeding national average) but the input-and-infrastructure stack to produce only 8-9 t/ha.</p>
            <p style={sSource}>Source: ICAR-RCNEH agro-climatic classifications; peer-reviewed agronomic literature on potato in the NEH region.</p>
          </section>

          {/* Card 5: National Framing + Forward-Looking */}
          <section id="trajectory" data-card="trajectory" style={cardWrap}>
            <h2 id="trajectory-h-as" style={sH2}>What is Assam&apos;s potato outlook?</h2>
            <p style={sIntro}>Assam in the national context: 7th-largest Indian potato producer by volume (911 thousand t in 2023-24); largest NE producer, with roughly 70% of NE region production share when summed across Assam, <Link href="/country/india/meghalaya" style={linkPlain}>Meghalaya</Link>, <Link href="/country/india/tripura" style={linkPlain}>Tripura</Link>, Nagaland, <Link href="/country/india/manipur" style={linkPlain}>Manipur</Link>, and <Link href="/country/india/arunachal-pradesh" style={linkPlain}>Arunachal Pradesh</Link>.</p>
            <p style={sP}>Among Indian states, Assam is one of the most acreage-efficient to improve: each percentage point of productivity gain on 106 thousand hectares equals ~1 thousand t of additional production. Closing even half the yield gap (8.56 → 16.5 t/ha) on existing acreage would push state production above 1.75 million tonnes — comparable to Bihar&apos;s mid-tier ranking — without any acreage expansion.</p>
            <p style={sP}><strong>Forward signals from the data:</strong> The 2023-24 productivity jump (7.46 → 8.56 t/ha, +15%) is the most encouraging signal in 5 years; the next 2-3 data points will indicate whether this is structural or single-year. ICAR&apos;s new Kufri Tejas, Kufri Ratan, and Kufri Chipbharat varieties (notified for Indian plains zones) are agronomically applicable to the Brahmaputra valley if seed reaches farmers.</p>
            <p style={sSource}>Source: DA&amp;FW comparative state series, Horticultural Statistics at a Glance 2024; ICAR variety notifications.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\", Table 7.3.31 — state-level area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR Research Complex for NEH Region (ICAR-RCNEH) — headquarters at Umiam (Barapani), Meghalaya; established 9 January 1975; regional centres across the seven NE states",
            "Peer-reviewed agronomic literature on potato cultivation in Assam and the NEH region (Indian Journal of Agricultural Sciences; growth-performance analyses)",
            "Assam Agricultural University (AAU), Jorhat — state agricultural research institution",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="assam" />

          <ContinueReading articles={[
            { href: "/country/india/tripura", tag: "Comparison", title: "Tripura Potato — Highest Productivity in the NE", desc: "Tripura's 19.16 t/ha shows what's possible in the NE region with more agronomically forgiving lower-elevation cultivation." },
            { href: "/country/india/meghalaya", tag: "Comparison", title: "Meghalaya Potato — Hosts the ICAR-RCNEH HQ", desc: "Adjacent NE state with the regional ICAR institution that serves Assam." },
            { href: "/knowledge/seed-potato-systems", tag: "Agronomy", title: "Seed Potato Systems", desc: "Why certified-seed availability matters for closing yield gaps like Assam's." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State", desc: "Assam's place in India's state map and how the NE region compares." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 10: Tripura (thin-tier pattern-setter) ── */

function TripuraState() {
  const faqItems = [
    { q: "How much potato does Tripura produce?", a: "Tripura produced 146.05 thousand tonnes of potatoes in 2023-24 from 7,620 hectares at a productivity of 19.16 t/ha, contributing 0.26% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Tripura is the third-largest northeast potato producer after Assam and Meghalaya." },
    { q: "Why is Tripura's productivity high for the northeast?", a: "At 19.16 t/ha, Tripura's productivity is more than double Assam's 8.56 t/ha and approximately 90% higher than neighbouring Meghalaya's 10.04 t/ha — the highest of any northeast state by a meaningful margin. While Tripura's productivity remains 78% of the national average (24.57 t/ha), it represents the strongest yield performance among northeast states. The higher productivity likely reflects more agronomically forgiving lower-elevation cultivation (plains and lower hills rather than challenging highland terrain) combined with somewhat better access to plains-state input chains via the Agartala corridor." },
    { q: "Is Tripura's potato production growing?", a: "Tripura's 5-year DA&FW series shows remarkable stability — area in the 7.33-8.13 thousand hectare band with only a 5.3% net decline, production consistently 132.76-147.31 thousand tonnes. The encouraging signal is gradual productivity improvement from 18.12 to 19.16 t/ha (+5.7% cumulative). This is a low-volatility, modestly improving series — consistent with a mature small-scale cropping pattern rather than expansion or contraction." },
    { q: "Where is potato grown in Tripura?", a: "Tripura's potato cultivation occurs primarily during the rabi (winter) season, with planting October-November and harvesting February-March. According to ICAR-RCNEH classifications, the state benefits from lower-elevation cultivation compared to other northeastern states, with most potato areas situated in plains and lower hills rather than challenging highland terrain. The warm sub-tropical climate provides a cooler winter window for potato growing; heavy monsoons from June-September naturally limit cultivation to the post-monsoon period. DA&FW Table 7.4.3 does not enumerate Tripura districts individually." },
    { q: "What research infrastructure supports Tripura potato?", a: "Tripura is served by the ICAR-RCNEH Tripura Centre at Lembucherra — one of the regional centres of the ICAR Research Complex for NEH Region (ICAR-RCNEH), HQ at Umiam (Barapani), Meghalaya. The Tripura centre operates within the ICAR-RCNEH mandate of agricultural research for the NEH region, including potato among its working areas. Additional state-level research and extension is conducted via Krishi Vigyan Kendras (KVKs) in Tripura's districts under the ICAR-State extension framework." },
    { q: "Does Tripura have district-level potato data?", a: "No — DA&FW Horticultural Statistics at a Glance 2024 Table 7.4.3 (major producing districts) does NOT enumerate Tripura districts for potato. District-level data is therefore not asserted on this page." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Tripura Potato Production Time Series",
    description: "State-level potato area, production, and productivity for Tripura 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Table 7.3.31).",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Tripura potato, ICAR-RCNEH Lembucherra, northeast India potato, DA&FW Horticultural Statistics at a Glance 2024",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="tripura" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Tripura" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Tripura" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>6 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["tripura"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Share of India", value: "0.26%" },
            { label: "Production 2023-24", value: "146.05 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "7,620 ha" },
            { label: "Productivity 2023-24", value: "19.16 t/ha (highest in NE)" },
            { label: "NE region rank", value: "#3 after Assam and Meghalaya" },
            { label: "Research centre", value: "ICAR-RCNEH Tripura Centre, Lembucherra" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Tripura produced 146.05 thousand tonnes of potatoes in 2023-24 from 7,620 hectares at a productivity of 19.16 t/ha — 0.26% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> Among the northeast states, Tripura stands out for productivity that is more than double <Link href="/country/india/assam" style={linkPlain}>Assam&apos;s</Link> 8.56 t/ha and ~90% higher than neighbouring <Link href="/country/india/meghalaya" style={linkPlain}>Meghalaya&apos;s</Link> 10.04 t/ha — the highest of any northeast state by a meaningful margin. The state is served by the ICAR-RCNEH Tripura Centre at Lembucherra.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "146.05K t", label: "Production 2023-24" },
            { value: "0.26%", label: "Share of India" },
            { value: "19.16 t/ha", label: "Productivity (highest in NE)" },
            { value: "#3", label: "NE region rank" },
          ]} />

          {/* Card 1: Production overview (DA&FW 5-year series) */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-tr" style={sH2}>How much potato does Tripura produce?</h2>
            <p style={sIntro}>Tripura produced 146.05 thousand tonnes of potatoes in 2023-24 from 7,620 hectares at a productivity of 19.16 t/ha — 0.26% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Productivity is 78% of the national average — the highest among northeast states.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "8.05", "145.87", "18.12"],
                    ["2020-21", "8.13", "147.31", "18.11"],
                    ["2021-22", "7.33", "132.76", "18.11"],
                    ["2022-23", "7.58", "141.30", "18.63"],
                    ["2023-24", "7.62", "146.05", "19.16"],
                  ].map((r, i) => (
                    <tr key={r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i === 4 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}>The 5-year trend shows remarkable stability — area in the 7.33-8.13 thousand hectare band with only a 5.3% net decline, production in the 132.76-147.31 thousand tonne band. Productivity has gained 5.7% cumulatively (18.12 → 19.16 t/ha). This is a low-volatility, modestly improving series — consistent with a mature small-scale cropping pattern rather than expansion or contraction.</p>
            <p style={sP}>DA&amp;FW Table 7.4.3 (major producing districts) does NOT enumerate Tripura districts for potato. District-level data is therefore not asserted on this page.</p>
          </section>

          {/* Card 2: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-tr" style={sH2}>What is the agro-climatic context for Tripura potato cultivation?</h2>
            <p style={sIntro}>Tripura falls within the eastern part of the North-Eastern Hill agro-climatic zone, with a different elevation and rainfall pattern from highland Meghalaya.</p>
            <p style={sP}>Lower-elevation cultivation compared to <Link href="/country/india/meghalaya" style={linkPlain}>Meghalaya&apos;s</Link> highland average — most of Tripura&apos;s potato area sits in plains and lower hills. Warm sub-tropical climate with cooler winter season suitable for rabi potato cultivation. Heavy monsoon (June-September) limits cropping to the post-monsoon rabi window. Cropping season: rabi (winter) is the dominant pattern; planting October-November, harvest February-March. Soils are alluvial in the plains, lateritic in hill districts.</p>
            <p style={sP}>The relatively higher productivity (19.16 t/ha vs Meghalaya&apos;s 10.04) likely reflects the more agronomically forgiving lower-elevation cultivation pattern combined with somewhat better access to plains-state input chains via the Agartala corridor.</p>
            <p style={sSource}>Source: ICAR-RCNEH agro-climatic classifications.</p>
          </section>

          {/* Card 3: Research Infrastructure */}
          <section id="research" data-card="research" style={cardWrap}>
            <h2 id="research-h-tr" style={sH2}>What research infrastructure supports Tripura potato?</h2>
            <p style={sIntro}>Tripura is served by the ICAR-RCNEH Tripura Centre at Lembucherra:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>Lembucherra Centre is one of the regional centres of the ICAR Research Complex for NEH Region (ICAR-RCNEH), whose HQ is at Umiam (Barapani), <Link href="/country/india/meghalaya" style={linkPlain}>Meghalaya</Link>.</li>
              <li>The Tripura centre operates within the ICAR-RCNEH mandate of agricultural research for the NEH region, including potato among its working areas.</li>
              <li>Additional state-level research and extension is conducted via Krishi Vigyan Kendras (KVKs) in Tripura&apos;s districts under the ICAR-State extension framework.</li>
            </ul>
            <p style={sSource}>Source: ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation.</p>
          </section>

          {/* Card 4: Honest Data Scope Note */}
          <section id="data-scope" data-card="data-scope" style={cardWrap}>
            <h2 id="scope-h-tr" style={sH2}>What data is NOT available for Tripura?</h2>
            <p style={sIntro}>This page is built on DA&amp;FW state-level series and ICAR-RCNEH institutional documentation for Tripura. The following information surfaces are NOT currently published from primary sources surveyed:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>District-level area, production, or productivity data for Tripura (the state is not in DA&amp;FW Table 7.4.3)</li>
              <li>State-specific variety adoption acreage data</li>
              <li>Detailed border-trade (Bangladesh) potato flow data published as state-level statistics</li>
              <li>State-level cold storage / processing infrastructure inventory</li>
            </ul>
            <p style={sP}>Where these data become available from approved primary sources (Tripura state horticulture department, ICAR-RCNEH Tripura Centre technical publications, APEDA border-trade releases, peer-reviewed studies), this page is structured to absorb them as additional sections without requiring a rewrite.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\", Table 7.3.31 — state-level area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation — Tripura Centre at Lembucherra; regional mandate includes potato cultivation improvement in the northeast",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="tripura" />

          <ContinueReading articles={[
            { href: "/country/india/assam", tag: "Comparison", title: "Assam Potato — Largest NE Producer", desc: "Adjacent NE state — Tripura's 19.16 t/ha vs Assam's 8.56 illustrates the productivity range possible in the NE region." },
            { href: "/country/india/meghalaya", tag: "Comparison", title: "Meghalaya Potato — Hosts ICAR-RCNEH HQ", desc: "Highland NE state for productivity comparison; Tripura's lower elevation yields more favourable cultivation conditions." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State", desc: "Where Tripura fits in India's state map and the NE region comparison." },
            { href: "/country/india", tag: "Country", title: "India Potato Country Profile", desc: "National-level potato production context and state breakdown." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 11: Meghalaya (thin-tier; hosts ICAR-RCNEH HQ) ── */

function MeghalayaState() {
  const faqItems = [
    { q: "How much potato does Meghalaya produce?", a: "Meghalaya produced 196.25 thousand tonnes of potatoes in 2023-24 from 19,540 hectares at a productivity of 10.04 t/ha, contributing 0.34% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Meghalaya is the second-largest northeast potato producer after Assam." },
    { q: "What is special about Meghalaya for potato research?", a: "Meghalaya hosts the headquarters of the ICAR Research Complex for the North-Eastern Hill Region (ICAR-RCNEH) at Umiam (also known as Barapani), located approximately 15 km from Shillong. Established 9 January 1975, it is the first of its kind ICAR multidisciplinary regional complex, covering agriculture, horticulture, animal sciences, agricultural engineering, agroforestry, fishery, and social sciences across all seven sister states plus Sikkim. Improving and popularising potato cultivation in the northeast is among its mandated objectives." },
    { q: "Why is Meghalaya's potato productivity lower than other states?", a: "At 10.04 t/ha, Meghalaya's potato productivity is approximately 41% of the national average of 24.57 t/ha, ranking second-lowest among Indian potato-producing states (after Assam at 8.56 t/ha). The low productivity reflects the highland growing environment — while elevations above 1,000 metres in the Khasi, Jaintia, and Garo Hills provide favourable cool temperatures year-round, the region's extremely heavy monsoon rainfall (Cherrapunji and surrounds have among the highest annual rainfall globally) creates chronic problems with waterlogging, soil nutrient leaching, and disease pressure (late blight, bacterial wilt)." },
    { q: "Is Meghalaya's potato production growing?", a: "Meghalaya's 5-year DA&FW series is among the most stable in the national table: area moved less than 3% across 5 years (18.93 → 19.54 thousand ha), production barely changed (187.22 → 196.25 thousand tonnes), and the productivity baseline (10.04 t/ha) has remained essentially flat. This is a mature, low-volatility cropping pattern rather than an expansion or contraction story." },
    { q: "Does Meghalaya have district-level potato data?", a: "No — DA&FW Horticultural Statistics at a Glance 2024 Table 7.4.3 (major producing districts) does NOT enumerate Meghalaya districts for potato. The major-districts table covers eight states: Bihar, Gujarat, Haryana, Jharkhand, Madhya Pradesh, Punjab, Uttar Pradesh, and West Bengal. District-level data is therefore not asserted on this page." },
    { q: "Where is potato grown in Meghalaya?", a: "Meghalaya's potato cultivation occurs predominantly at elevations above 1,000 metres across the Khasi, Jaintia, and Garo Hills. Highland cultivation is possible in extended seasons relative to the plains because the temperature envelope rarely exceeds the upper limits of potato tuber development. Soils are predominantly red lateritic and forest-derived, with patches of more productive alluvial soils in valley pockets." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Meghalaya Potato Production Time Series",
    description: "State-level potato area, production, and productivity for Meghalaya 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Table 7.3.31).",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Meghalaya potato, ICAR-RCNEH Umiam Barapani, northeast India potato, DA&FW Horticultural Statistics at a Glance 2024",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="meghalaya" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Meghalaya" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Meghalaya" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>7 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["meghalaya"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Share of India", value: "0.34%" },
            { label: "Production 2023-24", value: "196.25 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "19,540 ha" },
            { label: "Productivity 2023-24", value: "10.04 t/ha (41% of national avg)" },
            { label: "NE region rank", value: "#2 (after Assam)" },
            { label: "ICAR-RCNEH HQ", value: "Umiam (Barapani), 15 km from Shillong" },
            { label: "ICAR-RCNEH established", value: "9 January 1975" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Meghalaya produced 196.25 thousand tonnes of potatoes in 2023-24 from 19,540 hectares at a productivity of 10.04 t/ha — 0.34% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> Meghalaya is the second-largest northeast potato producer after <Link href="/country/india/assam" style={linkPlain}>Assam</Link>, and structurally important beyond its production volume: the state hosts the headquarters of ICAR&apos;s Research Complex for the North-Eastern Hill Region (ICAR-RCNEH) at Umiam (Barapani) — the principal institutional centre for potato research across India&apos;s seven sister states.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "196.25K t", label: "Production 2023-24" },
            { value: "0.34%", label: "Share of India" },
            { value: "10.04 t/ha", label: "Productivity (41% of nat'l)" },
            { value: "ICAR-RCNEH HQ", label: "Umiam (Barapani)" },
          ]} />

          {/* Card 1: Production overview (DA&FW 5-year series) */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-me" style={sH2}>How much potato does Meghalaya produce?</h2>
            <p style={sIntro}>Meghalaya produced 196.25 thousand tonnes of potatoes in 2023-24 from 19,540 hectares at a productivity of 10.04 t/ha — 0.34% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31). The state ranks 11th nationally by production volume and 9th by area — Meghalaya uses proportionally more area for its production share, consistent with the highland productivity profile.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "18.94", "187.35", "9.89"],
                    ["2020-21", "18.94", "187.30", "9.89"],
                    ["2021-22", "18.93", "187.22", "9.89"],
                    ["2022-23", "19.54", "196.23", "10.04"],
                    ["2023-24", "19.54", "196.25", "10.04"],
                  ].map((r, i) => (
                    <tr key={i+r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i === 4 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}>The series is among the most stable in the DA&amp;FW table: area moved less than 3% across 5 years, production barely changed, and productivity has remained essentially flat in a tight 9.89–10.04 t/ha band. This stability is the headline fact for Meghalaya&apos;s potato sector — a mature, low-volatility cropping pattern rather than expansion or contraction. DA&amp;FW Table 7.4.3 does NOT enumerate Meghalaya districts for potato; district-level data is therefore not asserted on this page.</p>
          </section>

          {/* Card 2: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-me" style={sH2}>What is the agro-climatic context for potato in Meghalaya?</h2>
            <p style={sIntro}>Meghalaya falls within the North-Eastern Hill agro-climatic zone, predominantly at elevations above 1,000 metres. Highland cultivation is the dominant pattern across the Khasi, Jaintia, and Garo Hills.</p>
            <p style={sP}>The highland setting offers favourable cool temperatures year-round — the temperature envelope rarely exceeds the upper limits of potato tuber development, which extends the agronomic window relative to plains states. Soils are predominantly red lateritic and forest-derived, with patches of more productive alluvial soils in valley pockets.</p>
            <p style={sP}>Heavy monsoon rainfall is more a constraint than an asset for potato. Cherrapunji and surrounds have among the highest annual rainfall globally. Waterlogging, leaching of soil nutrients, and disease pressure (late blight, bacterial wilt) are chronic challenges of the highland NE potato cropping pattern. The 10.04 t/ha state productivity reflects this environment: highland favourability for temperature is offset by disease pressure, soil constraints, and limited access to certified seed in remote hill districts.</p>
            <p style={sSource}>Source: ICAR-RCNEH agro-climatic classifications.</p>
          </section>

          {/* Card 3: Research Infrastructure — ICAR-RCNEH HQ */}
          <section id="research" data-card="research" style={cardWrap}>
            <h2 id="research-h-me" style={sH2}>What is the ICAR Research Complex for NEH Region?</h2>
            <p style={sIntro}>Meghalaya hosts the ICAR Research Complex for NEH Region (ICAR-RCNEH) at Umiam (also known as Barapani), located approximately 15 km from Shillong. It is the regional institutional centre for agricultural research across India&apos;s seven sister states plus Sikkim.</p>
            <QuickFactsBox items={[
              { label: "Established", value: "9 January 1975" },
              { label: "Headquarters", value: "Umiam (Barapani), ~15 km from Shillong" },
              { label: "Status", value: "First of its kind ICAR multidisciplinary regional complex" },
              { label: "Coverage", value: "Assam, Meghalaya, Tripura, Manipur, Mizoram, Nagaland, Arunachal Pradesh, Sikkim" },
              { label: "Disciplines", value: "Agriculture, horticulture, animal sciences, agricultural engineering, agroforestry, fishery, social sciences" },
              { label: "Regional centres", value: "Basar (AP), Imphal (Manipur), Kolasib (Mizoram), Jharnapani (Nagaland), Lembucherra (Tripura), Gangtok (Sikkim)" },
              { label: "Potato mandate", value: "Improving and popularising potato cultivation in the northeast" },
            ]} />
            <p style={sP}>The presence of the regional ICAR HQ in Meghalaya gives the state structural research-extension advantages relative to other NE states, even though the state&apos;s own potato production volumes are modest. Research outputs from ICAR-RCNEH propagate across all seven sister states through the regional centres at <Link href="/country/india/arunachal-pradesh" style={linkPlain}>Basar (Arunachal Pradesh)</Link>, <Link href="/country/india/manipur" style={linkPlain}>Imphal (Manipur)</Link>, <Link href="/country/india/nagaland" style={linkPlain}>Jharnapani (Nagaland)</Link>, and <Link href="/country/india/tripura" style={linkPlain}>Lembucherra (Tripura)</Link>.</p>
            <p style={sSource}>Source: ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation; ICAR.</p>
          </section>

          {/* Card 4: Honest Data Scope Note */}
          <section id="data-scope" data-card="data-scope" style={cardWrap}>
            <h2 id="scope-h-me" style={sH2}>What data is NOT available for Meghalaya?</h2>
            <p style={sIntro}>This page is built on DA&amp;FW state-level series and ICAR-RCNEH institutional documentation for Meghalaya. The following information surfaces are NOT currently published from primary sources surveyed:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>District-level area, production, or productivity data for Meghalaya (the state is not in DA&amp;FW Table 7.4.3)</li>
              <li>State-specific variety adoption acreage data</li>
              <li>Direct primary-source attribution for the year-on-year productivity stability around 10 t/ha</li>
              <li>Detailed cold-storage or post-harvest infrastructure data at the state level</li>
            </ul>
            <p style={sP}>Where these data become available from approved primary sources (state horticulture commissioner reports, ICAR-RCNEH technical publications, peer-reviewed studies), this page is structured to absorb them as additional sections without requiring a rewrite.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\", Table 7.3.31 — state-level area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation — headquarters at Umiam (Barapani), Meghalaya; established 9 January 1975",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="meghalaya" />

          <ContinueReading articles={[
            { href: "/country/india/assam", tag: "Comparison", title: "Assam Potato — Largest NE Producer", desc: "Adjacent NE state and the largest northeast producer; served by ICAR-RCNEH Umiam." },
            { href: "/country/india/tripura", tag: "Comparison", title: "Tripura Potato — Highest NE Productivity", desc: "Lower-elevation NE state with the highest productivity in the region (19.16 t/ha)." },
            { href: "/country/india/nagaland", tag: "Comparison", title: "Nagaland Potato — Small, Stable", desc: "Adjacent NE state served by the ICAR-RCNEH Jharnapani Centre." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State", desc: "Where Meghalaya fits in India's state map and the NE region comparison." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 12: Nagaland (thin-tier; stable flat series) ── */

function NagalandState() {
  const faqItems = [
    { q: "How much potato does Nagaland produce?", a: "Nagaland produced 55.12 thousand tonnes of potatoes in 2023-24 from 4,440 hectares at a productivity of 12.41 t/ha, contributing 0.10% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). The state's potato sector is small but among the most stable in India." },
    { q: "Is Nagaland's potato production growing?", a: "Nagaland's 5-year DA&FW series is among the flattest in the national table: total area movement under 2% across 5 years (4.35-4.44 thousand ha), total production movement under 1% (55.12-55.91 thousand t), productivity in a tight 12.41-12.79 t/ha band. There is no growth narrative and no decline narrative to report. This is a mature subsistence-and-local-market cropping pattern rather than commercial expansion or contraction." },
    { q: "Where is potato grown in Nagaland?", a: "Nagaland falls within the eastern North-Eastern Hill agro-climatic zone, characterized by highland to mid-elevation cultivation across the Naga hills. Cool year-round temperatures in highland districts extend the growing window. Traditional jhum (shifting) cultivation has largely given way to settled cultivation, with potatoes grown both in kitchen gardens and as small commercial crops for state-internal markets. Soils are predominantly red lateritic and forest-derived on hilly terrain; cultivation generally on terraced and contoured fields." },
    { q: "Does Nagaland have district-level potato data?", a: "No — DA&FW Horticultural Statistics at a Glance 2024 Table 7.4.3 (major producing districts) does NOT enumerate Nagaland districts for potato. District-level data is therefore not asserted on this page." },
    { q: "What research infrastructure supports Nagaland potato?", a: "Nagaland is served by the ICAR-RCNEH Nagaland Centre at Jharnapani — one of the regional centres of the ICAR Research Complex for NEH Region (ICAR-RCNEH), HQ at Umiam (Barapani), Meghalaya. The Nagaland centre operates within the ICAR-RCNEH mandate for agricultural research in the NEH region, including potato among its working areas. Additional state-level research and extension via Krishi Vigyan Kendras (KVKs) in Nagaland's districts under the ICAR-State extension framework." },
    { q: "How does Nagaland's potato productivity compare to other NE states?", a: "At 12.41 t/ha, Nagaland's productivity sits in the middle range among northeast states — better than Assam (8.56 t/ha) and Meghalaya (10.04 t/ha), but lower than Tripura (19.16 t/ha). However, it remains well below the national average of 24.57 t/ha. The constraint pattern mirrors other highland northeastern states: disease pressure, seed quality, and limited extension reach in remote terrain." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Nagaland Potato Production Time Series",
    description: "State-level potato area, production, and productivity for Nagaland 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Table 7.3.31).",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Nagaland potato, ICAR-RCNEH Jharnapani, northeast India potato, DA&FW Horticultural Statistics at a Glance 2024",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="nagaland" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Nagaland" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Nagaland" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>5 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["nagaland"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Share of India", value: "0.10%" },
            { label: "Production 2023-24", value: "55.12 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "4,440 ha" },
            { label: "Productivity 2023-24", value: "12.41 t/ha (50% of national avg)" },
            { label: "5-year trend", value: "Essentially flat across all metrics" },
            { label: "Research centre", value: "ICAR-RCNEH Nagaland Centre, Jharnapani" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Nagaland produced 55.12 thousand tonnes of potatoes in 2023-24 from 4,440 hectares at a productivity of 12.41 t/ha — 0.10% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> The state&apos;s potato sector is small but among the most stable in the country — the DA&amp;FW 5-year series shows essentially flat area, production, and productivity. <strong>There is no growth narrative and no decline narrative to report</strong> — this is a mature subsistence-and-local-market cropping pattern, not a commercial expansion or contraction story.</p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "55.12K t", label: "Production 2023-24" },
            { value: "0.10%", label: "Share of India" },
            { value: "12.41 t/ha", label: "Productivity (50% of nat'l)" },
            { value: "Flat", label: "5-yr trend (no growth or decline)" },
          ]} />

          {/* Card 1: Production overview (DA&FW 5-year series) */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-ng" style={sH2}>How much potato does Nagaland produce?</h2>
            <p style={sIntro}>Nagaland produced 55.12 thousand tonnes of potatoes in 2023-24 from 4,440 hectares at a productivity of 12.41 t/ha — 0.10% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Productivity is 50% of the national average.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "4.35", "55.64", "12.78"],
                    ["2020-21", "4.35", "55.59", "12.79"],
                    ["2021-22", "4.36", "55.65", "12.78"],
                    ["2022-23", "4.44", "55.91", "12.60"],
                    ["2023-24", "4.44", "55.12", "12.41"],
                  ].map((r, i) => (
                    <tr key={i+r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: i === 4 ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}>The series is among the flattest in the DA&amp;FW table: area moved less than 2% across 5 years, production movement under 1%, productivity stayed in a tight 12.41-12.79 t/ha band. This stability is the headline fact for Nagaland&apos;s potato sector — there is no growth narrative and no decline narrative to report. DA&amp;FW Table 7.4.3 does NOT enumerate Nagaland districts for potato; district-level data is therefore not asserted on this page.</p>
          </section>

          {/* Card 2: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-ng" style={sH2}>What is the agro-climatic context for Nagaland potato?</h2>
            <p style={sIntro}>Nagaland falls within the eastern North-Eastern Hill agro-climatic zone, characterized by highland to mid-elevation cultivation across the Naga hills.</p>
            <p style={sP}>Cool year-round temperatures in highland districts extend the growing window for potatoes, while heavy monsoon rainfall (the state lies within the influence of both the southwest monsoon and the residual northeast monsoon) provides adequate water. The predominantly red lateritic and forest-derived soils on hilly terrain require cultivation on terraced and contoured fields. Traditional jhum (shifting) cultivation has largely given way to settled cultivation, with potatoes grown both in subsistence kitchen-garden patterns and as a small commercial crop for state-internal markets.</p>
            <p style={sP}>At 12.41 t/ha, Nagaland&apos;s productivity sits in the middle range among northeast states — better than <Link href="/country/india/assam" style={linkPlain}>Assam</Link> (8.56 t/ha) and <Link href="/country/india/meghalaya" style={linkPlain}>Meghalaya</Link> (10.04 t/ha), lower than <Link href="/country/india/tripura" style={linkPlain}>Tripura</Link> (19.16 t/ha). The constraint pattern mirrors other highland NE states: disease pressure, seed quality, and limited extension reach in remote terrain.</p>
            <p style={sSource}>Source: ICAR-RCNEH agro-climatic classifications.</p>
          </section>

          {/* Card 3: Research Infrastructure */}
          <section id="research" data-card="research" style={cardWrap}>
            <h2 id="research-h-ng" style={sH2}>What research infrastructure supports Nagaland potato?</h2>
            <p style={sIntro}>Nagaland is served by the ICAR-RCNEH Nagaland Centre at Jharnapani:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>Jharnapani Centre is one of the regional centres of the ICAR Research Complex for NEH Region (ICAR-RCNEH), whose HQ is at Umiam (Barapani), <Link href="/country/india/meghalaya" style={linkPlain}>Meghalaya</Link>.</li>
              <li>The Nagaland centre operates within the ICAR-RCNEH mandate for agricultural research in the NEH region, including potato among its working areas.</li>
              <li>Additional state-level research and extension via Krishi Vigyan Kendras (KVKs) in Nagaland&apos;s districts under the ICAR-State extension framework.</li>
            </ul>
            <p style={sSource}>Source: ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation.</p>
          </section>

          {/* Card 4: Honest Data Scope Note */}
          <section id="data-scope" data-card="data-scope" style={cardWrap}>
            <h2 id="scope-h-ng" style={sH2}>What data is NOT available for Nagaland?</h2>
            <p style={sIntro}>This page is built on DA&amp;FW state-level series and ICAR-RCNEH institutional documentation for Nagaland. The following information surfaces are NOT currently published from primary sources surveyed:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>District-level area, production, or productivity data for Nagaland (the state is not in DA&amp;FW Table 7.4.3)</li>
              <li>State-specific variety adoption acreage data</li>
              <li>Detailed cold-storage, processing, or post-harvest infrastructure data at the state level</li>
            </ul>
            <p style={sP}>Where these data become available from approved primary sources (Nagaland state horticulture department, ICAR-RCNEH Nagaland Centre technical publications, peer-reviewed studies), this page is structured to absorb them as additional sections without requiring a rewrite.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\", Table 7.3.31 — state-level area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation — Nagaland Centre at Jharnapani; regional mandate includes potato cultivation improvement in the northeast",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="nagaland" />

          <ContinueReading articles={[
            { href: "/country/india/meghalaya", tag: "Comparison", title: "Meghalaya Potato — Hosts ICAR-RCNEH HQ", desc: "Adjacent NE state with the regional ICAR institution headquartered at Umiam." },
            { href: "/country/india/assam", tag: "Comparison", title: "Assam Potato — Largest NE Producer", desc: "Adjacent NE state for productivity and scale comparison." },
            { href: "/country/india/manipur", tag: "Comparison", title: "Manipur Potato — Small, with Data Discontinuity", desc: "Adjacent NE state served by the ICAR-RCNEH Imphal Centre." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State", desc: "Where Nagaland fits in the NE region map." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 13: Manipur (thin-tier; 22× methodology revision flag) ── */

function ManipurState() {
  const faqItems = [
    { q: "How much potato does Manipur produce?", a: "Manipur produced 14.63 thousand tonnes of potatoes in 2023-24 from 1,160 hectares at a productivity of 12.61 t/ha, contributing 0.03% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Manipur is among the smallest measurable potato-producing states in the country." },
    { q: "Why is Manipur's potato area shown as having grown 22-fold?", a: "It hasn't grown 22-fold in real agronomic terms. The DA&FW state-level series shows area moving from 0.05 thousand hectares (2019-20) to 1.59 (2021-22) — an apparent 22× increase — but this is almost certainly a reporting-baseline revision rather than real growth in the field. The identical 1.59 figures across consecutive years (2021-22 and 2022-23) further support that one or more years are carrying a static administrative baseline. The honest read: pre-2020 figures and post-2020 figures may not be directly comparable as a time series. Year-to-year changes within either segment may reflect measurement noise as much as cropping reality." },
    { q: "What is Manipur's current potato production figure?", a: "The 2023-24 reading (1.16 thousand ha, 14.63 thousand t, 12.61 t/ha) is the most recent published figure from DA&FW Horticultural Statistics at a Glance 2024 and is the appropriate snapshot reference for Manipur. Productivity is 51% of the national average of 24.57 t/ha. Production is 0.03% of India's total." },
    { q: "Does Manipur have district-level potato data?", a: "No — DA&FW Horticultural Statistics at a Glance 2024 Table 7.4.3 (major producing districts) does NOT enumerate Manipur districts for potato. District-level data is therefore not asserted on this page." },
    { q: "Where is potato grown in Manipur?", a: "The Imphal valley (low-elevation alluvial) is the principal agricultural zone; surrounding hill districts contribute smaller volumes. The sub-tropical climate with cool winter season is suitable for rabi potato cultivation in the valley. Heavy monsoon limits the cropping window to the post-monsoon rabi cycle. Valley soils are alluvial and agronomically favourable; hill cultivation is on terraced or contoured fields. The relatively narrow agricultural geography of the Imphal valley constrains the absolute potato footprint regardless of agronomic favourability." },
    { q: "What research infrastructure supports Manipur potato?", a: "Manipur is served by the ICAR-RCNEH Manipur Centre at Imphal — one of the regional centres of the ICAR Research Complex for NEH Region (ICAR-RCNEH), HQ at Umiam (Barapani), Meghalaya. The Manipur centre operates within the ICAR-RCNEH mandate for agricultural research in the NEH region, including potato among its working areas. Additional state-level research and extension via Krishi Vigyan Kendras (KVKs) in Manipur's districts." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Manipur Potato Production Time Series",
    description: "State-level potato area, production, and productivity for Manipur 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Table 7.3.31). Note: the 2019-20 to 2020-21 transition shows an apparent 22-fold area expansion that is almost certainly a reporting-baseline revision rather than real growth.",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Manipur potato, ICAR-RCNEH Imphal, northeast India potato, DA&FW Horticultural Statistics at a Glance 2024",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="manipur" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Manipur" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Manipur" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>6 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["manipur"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Share of India", value: "0.03%" },
            { label: "Production 2023-24", value: "14.63 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "1,160 ha" },
            { label: "Productivity 2023-24", value: "12.61 t/ha (51% of national avg)" },
            { label: "Series caveat", value: "Apparent 22× area jump 2019-20 → 2021-22 is a reporting-baseline revision, not real growth" },
            { label: "Research centre", value: "ICAR-RCNEH Manipur Centre, Imphal" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Manipur produced 14.63 thousand tonnes of potatoes in 2023-24 from 1,160 hectares at a productivity of 12.61 t/ha — 0.03% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> Manipur is among the smallest measurable potato-producing states in India. <strong>The most important fact about the 5-year DA&amp;FW series for Manipur is a methodological discontinuity between 2019-20 and 2020-21 that produces an apparent 22-fold area expansion — almost certainly a reporting-baseline revision rather than real growth in the field. This page documents the data as published while flagging that discontinuity honestly.</strong></p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "14.63K t", label: "Production 2023-24" },
            { value: "0.03%", label: "Share of India" },
            { value: "12.61 t/ha", label: "Productivity (51% of nat'l)" },
            { value: "22× revision", label: "5-yr series discontinuity" },
          ]} />

          {/* Card 1: Production overview with the methodology-revision flag */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-mn" style={sH2}>How much potato does Manipur produce, and what about the series discontinuity?</h2>
            <p style={sIntro}>Manipur produced 14.63 thousand tonnes of potatoes in 2023-24 from 1,160 hectares at a productivity of 12.61 t/ha — 0.03% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Before reading the table below, an important caveat about the 5-year series.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "0.05", "0.95", "18.61"],
                    ["2020-21", "0.89", "13.78", "15.48"],
                    ["2021-22", "1.59", "11.25", "7.06"],
                    ["2022-23", "1.59", "11.25", "7.06"],
                    ["2023-24", "1.16", "14.63", "12.61"],
                  ].map((r, i) => (
                    <tr key={i+r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : (i === 1 || i === 2) ? "rgba(198,40,40,0.08)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: (i === 4 || i === 1 || i === 2) ? 700 : 600 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31.</p>
            <p style={sP}><strong>THE SERIES DISCONTINUITY (important to flag honestly):</strong></p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>Area moves from 0.05 thousand ha (2019-20) to 0.89 (2020-21) — an apparent 18× increase in a single year</li>
              <li>Then 0.89 → 1.59 (2020-21 → 2021-22) — another ~80% jump</li>
              <li>Then 1.59 → 1.59 (identical to one decimal across 2021-22 and 2022-23) — suggesting reported-baseline carry-forward</li>
              <li>Then 1.59 → 1.16 (a 27% decrease in 2023-24)</li>
            </ul>
            <p style={sP}>It is implausible that Manipur&apos;s potato sector underwent a 22-fold area expansion across the 2019-20 → 2021-22 window in real agronomic terms. The pattern is more consistent with a measurement / reporting methodology change — for example, a transition from a previously narrow survey coverage to a broader one that captures cultivation previously not enumerated in the state statistical return. The identical 1.59 figures across consecutive years further support that one or more years are carrying a static administrative baseline.</p>
            <p style={sP}><strong>The honest read of the Manipur series:</strong> pre-2020 figures and post-2020 figures may not be directly comparable as a time series. Year-to-year changes within either segment may reflect measurement noise as much as cropping reality. The 2023-24 reading (1.16 thousand ha, 14.63 thousand t, 12.61 t/ha) is the most recent published figure and is the appropriate snapshot reference. DA&amp;FW Table 7.4.3 does NOT enumerate Manipur districts.</p>
          </section>

          {/* Card 2: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-mn" style={sH2}>What is the agro-climatic context for Manipur potato?</h2>
            <p style={sIntro}>Manipur falls within the eastern North-Eastern Hill agro-climatic zone. The Imphal valley (low-elevation alluvial) is the principal agricultural zone; surrounding hill districts contribute smaller volumes.</p>
            <p style={sP}>Sub-tropical climate with cool winter season is suitable for rabi potato cultivation in the valley. Heavy monsoon limits the cropping window to the post-monsoon rabi cycle. Valley soils are alluvial and agronomically favourable; hill cultivation is on terraced or contoured fields. The relatively narrow agricultural geography of the Imphal valley constrains the absolute potato footprint regardless of agronomic favourability.</p>
            <p style={sSource}>Source: ICAR-RCNEH agro-climatic classifications.</p>
          </section>

          {/* Card 3: Research Infrastructure */}
          <section id="research" data-card="research" style={cardWrap}>
            <h2 id="research-h-mn" style={sH2}>What research infrastructure supports Manipur potato?</h2>
            <p style={sIntro}>Manipur is served by the ICAR-RCNEH Manipur Centre at Imphal:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>Imphal Centre is one of the regional centres of the ICAR Research Complex for NEH Region (ICAR-RCNEH), whose HQ is at Umiam (Barapani), <Link href="/country/india/meghalaya" style={linkPlain}>Meghalaya</Link>.</li>
              <li>The Manipur centre operates within the ICAR-RCNEH mandate for agricultural research in the NEH region, including potato among its working areas.</li>
              <li>Additional state-level research and extension via Krishi Vigyan Kendras (KVKs) in Manipur&apos;s districts.</li>
            </ul>
            <p style={sSource}>Source: ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation.</p>
          </section>

          {/* Card 4: Honest Data Scope Note */}
          <section id="data-scope" data-card="data-scope" style={cardWrap}>
            <h2 id="scope-h-mn" style={sH2}>What data is NOT available for Manipur?</h2>
            <p style={sIntro}>This page is built on DA&amp;FW state-level series and ICAR-RCNEH institutional documentation for Manipur. The following information surfaces are NOT currently published from primary sources surveyed:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>District-level area, production, or productivity data for Manipur</li>
              <li>State-specific variety adoption acreage data</li>
              <li>Cold-storage, processing, or post-harvest infrastructure data at the state level</li>
              <li>Documented attribution for the apparent series discontinuity between 2019-20 and 2020-21</li>
            </ul>
            <p style={sP}>Where these data become available from approved primary sources (Manipur state horticulture department, ICAR-RCNEH Manipur Centre technical publications, peer-reviewed studies), this page is structured to absorb them as additional sections without requiring a rewrite.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\", Table 7.3.31 — state-level area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation — Manipur Centre at Imphal; regional mandate includes potato cultivation improvement in the northeast",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="manipur" />

          <ContinueReading articles={[
            { href: "/country/india/arunachal-pradesh", tag: "Comparison", title: "Arunachal Pradesh Potato — Same Data-Discontinuity Pattern", desc: "Adjacent NE state with a parallel series discontinuity flagged honestly." },
            { href: "/country/india/nagaland", tag: "Comparison", title: "Nagaland Potato — Stable Flat Series", desc: "Adjacent NE state with the stablest series in the DA&FW table." },
            { href: "/country/india/meghalaya", tag: "Comparison", title: "Meghalaya Potato — Hosts ICAR-RCNEH HQ", desc: "Adjacent NE state with the regional ICAR institution that serves Manipur." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State", desc: "Where Manipur fits in India's NE region map." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

/* ── State 14: Arunachal Pradesh (thin-tier; 4-year baseline carry-forward flag) ── */

function ArunachalPradeshState() {
  const faqItems = [
    { q: "How much potato does Arunachal Pradesh produce?", a: "Arunachal Pradesh produced 6.07 thousand tonnes of potatoes in 2023-24 from 450 hectares at a productivity of 13.36 t/ha, contributing 0.01% of India's national output (DA&FW Horticultural Statistics at a Glance 2024, Table 7.3.31). Arunachal Pradesh is the smallest measurable potato-producing state in India with published primary data." },
    { q: "Why does Arunachal Pradesh's potato area appear to have grown 22-fold in one year?", a: "It almost certainly hasn't. The DA&FW series shows four consecutive years of identical figures (2019-20 through 2022-23: area 0.02 thousand ha, production 0.44 thousand t, productivity 21.75 t/ha) before a step change in 2023-24 to 0.45 thousand ha and 6.07 thousand t — area jumps 22× and production 14× in a single year. The much more likely interpretation: pre-2023-24 figures are a placeholder or narrow-survey baseline carried forward in the statistical return; the 2023-24 figures reflect a broader survey methodology capturing cultivation previously not enumerated. The productivity drop (21.75 → 13.36 t/ha) is consistent with broader survey including lower-productivity acreage." },
    { q: "What is Arunachal Pradesh's current potato production figure?", a: "The 2023-24 reading (0.45 thousand ha, 6.07 thousand t, 13.36 t/ha) is the most recent published figure from DA&FW Horticultural Statistics at a Glance 2024 and is the appropriate current snapshot for Arunachal Pradesh. Productivity is 54% of the national average of 24.57 t/ha. Production is 0.01% of India's total — the smallest share among Indian states with published primary data." },
    { q: "Where is potato grown in Arunachal Pradesh?", a: "The state spans a large elevation range, from foothills (below 500m) to high-altitude zones (above 3,000m). Potato cultivation occurs across multiple elevation bands, with highland areas taking advantage of cool year-round temperatures. Cultivation generally occurs on terraced and contoured fields carved from the state's predominantly red lateritic and forest-derived soils. The extremely rugged terrain severely limits agriculturally accessible land — most of the state's area cannot be cultivated. Subsistence and local-market cultivation patterns dominate over commercial production." },
    { q: "Does Arunachal Pradesh have district-level potato data?", a: "No — DA&FW Horticultural Statistics at a Glance 2024 Table 7.4.3 (major producing districts) does NOT enumerate Arunachal Pradesh districts for potato. District-level data is therefore not asserted on this page." },
    { q: "What research infrastructure supports Arunachal Pradesh potato?", a: "Arunachal Pradesh is served by the ICAR-RCNEH Arunachal Pradesh Centre at Basar — one of the regional centres of the ICAR Research Complex for NEH Region (ICAR-RCNEH), HQ at Umiam (Barapani), Meghalaya. The Arunachal Pradesh centre operates within the ICAR-RCNEH mandate for agricultural research in the NEH region, including potato among its working areas. Additional state-level research and extension via Krishi Vigyan Kendras (KVKs) in Arunachal Pradesh's districts." },
  ];

  const datasetLd = {
    "@type": "Dataset",
    name: "Arunachal Pradesh Potato Production Time Series",
    description: "State-level potato area, production, and productivity for Arunachal Pradesh 2019-20 through 2023-24 from DA&FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024 (Table 7.3.31). Note: four consecutive years of identical figures (2019-20 through 2022-23) followed by a 22× step change in 2023-24 — almost certainly a survey-methodology revision rather than real agronomic growth.",
    creator: { "@type": "Organization", name: "Department of Agriculture & Farmers Welfare, Government of India" },
    keywords: "Arunachal Pradesh potato, ICAR-RCNEH Basar, eastern Himalayan potato, DA&FW Horticultural Statistics at a Glance 2024",
    temporalCoverage: "2019/2024",
    license: "https://www.indiabudget.gov.in/",
  };

  return (
    <>
      <IndiaStateJsonLd slug="arunachal-pradesh" faqItems={faqItems} dataset={datasetLd} />
      <article>
        <HeroBanner>
          <Breadcrumb stateName="Arunachal Pradesh" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <TagBadge tag="India · Arunachal Pradesh" />
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
            <span style={{ fontSize: 12, color: "#999" }}>·</span>
            <span style={{ fontSize: 12, color: "#999" }}>6 min read</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1.2, marginBottom: 0 }}>{STATE_META["arunachal-pradesh"].h1}</h1>
        </HeroBanner>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>

          <QuickFactsBox items={[
            { label: "Share of India", value: "0.01% (smallest measurable)" },
            { label: "Production 2023-24", value: "6.07 thousand tonnes (DA&FW)" },
            { label: "Area 2023-24", value: "450 ha" },
            { label: "Productivity 2023-24", value: "13.36 t/ha (54% of national avg)" },
            { label: "Series caveat", value: "4 years identical figures (2019-20 → 2022-23) = baseline carry-forward" },
            { label: "Research centre", value: "ICAR-RCNEH Arunachal Centre, Basar" },
          ]} />

          <DefinitiveAnswer>
            <p style={{ margin: 0, lineHeight: 1.8 }}><strong>Arunachal Pradesh produced 6.07 thousand tonnes of potatoes in 2023-24 from 450 hectares at a productivity of 13.36 t/ha — 0.01% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31).</strong> Arunachal Pradesh is the smallest measurable potato-producing state in India with published primary data. <strong>As with neighbouring <Link href="/country/india/manipur" style={linkPlain}>Manipur</Link>, the 5-year DA&amp;FW series shows a methodological discontinuity that produces an apparent 22-fold area expansion between 2019-20 and 2023-24 — almost certainly a reporting-baseline revision rather than real agronomic growth. This page documents the data as published while flagging that discontinuity honestly.</strong></p>
          </DefinitiveAnswer>

          <KeyStatStrip stats={[
            { value: "6.07K t", label: "Production 2023-24" },
            { value: "0.01%", label: "Share of India (smallest)" },
            { value: "13.36 t/ha", label: "Productivity (54% of nat'l)" },
            { value: "22× revision", label: "5-yr series discontinuity" },
          ]} />

          {/* Card 1: Production overview with baseline-carry-forward flag */}
          <section id="production-overview" data-card="overview" style={cardWrap}>
            <h2 id="how-much-ar" style={sH2}>How much potato does Arunachal Pradesh produce, and what about the baseline carry-forward?</h2>
            <p style={sIntro}>Arunachal Pradesh produced 6.07 thousand tonnes of potatoes in 2023-24 from 450 hectares at a productivity of 13.36 t/ha — 0.01% of India&apos;s national output (DA&amp;FW Horticultural Statistics at a Glance 2024, Table 7.3.31). The 5-year series requires an important caveat about the data discontinuity.</p>
            <div style={{ overflowX: "auto", marginBottom: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Year", "Area ('000 ha)", "Production ('000 t)", "Productivity (t/ha)"].map((h) => <th key={h} style={sTh}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2019-20", "0.02", "0.44", "21.75"],
                    ["2020-21", "0.02", "0.44", "21.75"],
                    ["2021-22", "0.02", "0.44", "21.75"],
                    ["2022-23", "0.02", "0.44", "21.75"],
                    ["2023-24", "0.45", "6.07", "13.36"],
                  ].map((r, i) => (
                    <tr key={i+r[0]} style={{ background: i === 4 ? "rgba(198,40,40,0.05)" : i < 4 ? "rgba(198,40,40,0.08)" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ ...sTd, fontWeight: 700 }}>{r[0]}</td>
                      <td style={sTd}>{r[1]}</td>
                      <td style={sTd}>{r[2]}</td>
                      <td style={sTd}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={sSource}>Source: DA&amp;FW Horticulture Statistics Unit, Horticultural Statistics at a Glance 2024, Table 7.3.31. (State name reported in the DA&amp;FW table as &quot;ARUNCHAL PRADESH&quot;.)</p>
            <p style={sP}><strong>THE SERIES DISCONTINUITY (important to flag honestly):</strong></p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>Four consecutive years of identical figures (2019-20 through 2022-23: 0.02 / 0.44 / 21.75) — this is administrative baseline carry-forward, not annual measurement</li>
              <li>Then a step change in 2023-24 to 0.45 thousand ha and 6.07 thousand t — the area jumps 22× and production jumps 14× in a single year</li>
              <li>Productivity drops from 21.75 to 13.36 t/ha in the same step</li>
            </ul>
            <p style={sP}>It is implausible that Arunachal Pradesh underwent a real 22-fold area expansion in a single year. The much more likely interpretation:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>The pre-2023-24 figures (0.02 / 0.44) are a placeholder or narrow-survey baseline that was being carried forward in the statistical return</li>
              <li>The 2023-24 figures reflect a broader survey methodology that captured cultivation previously not enumerated</li>
              <li>The productivity drop in 2023-24 (21.75 → 13.36) is consistent with the broader survey including lower-productivity acreage that the narrower previous survey did not cover</li>
            </ul>
            <p style={sP}><strong>The honest read of the Arunachal Pradesh series:</strong> pre-2023-24 and 2023-24 figures should not be treated as a comparable time series. The 2023-24 reading is the most recent published figure and is the appropriate current snapshot. The &quot;growth&quot; in the series is a measurement-methodology artefact, not a cultivation expansion narrative. DA&amp;FW Table 7.4.3 does NOT enumerate Arunachal Pradesh districts.</p>
          </section>

          {/* Card 2: Agro-Climatic Context */}
          <section id="agro-climatic" data-card="climate" style={cardWrap}>
            <h2 id="agro-h-ar" style={sH2}>What is the agro-climatic context for Arunachal Pradesh potato?</h2>
            <p style={sIntro}>Arunachal Pradesh falls within the eastern Himalayan / North-Eastern Hill agro-climatic zone. The state spans a large elevation range, from foothills (below 500m) to high-altitude zones (above 3,000m).</p>
            <p style={sP}>Potato cultivation occurs across multiple elevation bands, with highland cultivation taking advantage of cool year-round temperatures. Predominantly red lateritic and forest-derived soils on hilly terrain; cultivation generally on terraced and contoured fields. Heavy monsoon rainfall limits the cropping window for most of the state. The agriculturally accessible area is constrained by extremely rugged terrain — most of the state&apos;s land area is not cultivable. Subsistence and local-market cultivation patterns dominate; commercial potato production is limited.</p>
            <p style={sP}>The 13.36 t/ha productivity in 2023-24 reflects the agronomic envelope and infrastructure constraints typical of the eastern Himalayan potato zone.</p>
            <p style={sSource}>Source: ICAR-RCNEH agro-climatic classifications.</p>
          </section>

          {/* Card 3: Research Infrastructure */}
          <section id="research" data-card="research" style={cardWrap}>
            <h2 id="research-h-ar" style={sH2}>What research infrastructure supports Arunachal Pradesh potato?</h2>
            <p style={sIntro}>Arunachal Pradesh is served by the ICAR-RCNEH Arunachal Pradesh Centre at Basar:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>Basar Centre is one of the regional centres of the ICAR Research Complex for NEH Region (ICAR-RCNEH), whose HQ is at Umiam (Barapani), <Link href="/country/india/meghalaya" style={linkPlain}>Meghalaya</Link>.</li>
              <li>The Arunachal Pradesh centre operates within the ICAR-RCNEH mandate for agricultural research in the NEH region, including potato among its working areas.</li>
              <li>Additional state-level research and extension via Krishi Vigyan Kendras (KVKs) in Arunachal Pradesh&apos;s districts under the ICAR-State extension framework.</li>
            </ul>
            <p style={sSource}>Source: ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation.</p>
          </section>

          {/* Card 4: Honest Data Scope Note */}
          <section id="data-scope" data-card="data-scope" style={cardWrap}>
            <h2 id="scope-h-ar" style={sH2}>What data is NOT available for Arunachal Pradesh?</h2>
            <p style={sIntro}>This page is built on DA&amp;FW state-level series and ICAR-RCNEH institutional documentation for Arunachal Pradesh. The following information surfaces are NOT currently published from primary sources surveyed:</p>
            <ul style={{ ...sP, marginLeft: 20, listStyle: "disc" }}>
              <li>District-level area, production, or productivity data for Arunachal Pradesh</li>
              <li>State-specific variety adoption acreage data</li>
              <li>Cold-storage, processing, or post-harvest infrastructure data at the state level</li>
              <li>Documented attribution for the apparent series discontinuity between 2022-23 and 2023-24</li>
            </ul>
            <p style={sP}>Where these data become available from approved primary sources (Arunachal Pradesh state horticulture department, ICAR-RCNEH Arunachal Pradesh Centre technical publications, peer-reviewed studies), this page is structured to absorb them as additional sections without requiring a rewrite.</p>
          </section>

          <SourceBlock sources={[
            "DA&FW Horticulture Statistics Unit, \"Horticultural Statistics at a Glance 2024\", Table 7.3.31 — state-level area, production and productivity of potato 2019-20 through 2023-24",
            "ICAR Research Complex for NEH Region (ICAR-RCNEH) institutional documentation — Arunachal Pradesh Centre at Basar; regional mandate includes potato cultivation improvement in the northeast",
          ]} />

          <FAQSection items={faqItems} />

          <RelatedStates currentSlug="arunachal-pradesh" />

          <ContinueReading articles={[
            { href: "/country/india/manipur", tag: "Comparison", title: "Manipur Potato — Same Data-Discontinuity Pattern", desc: "Adjacent NE state with a parallel series discontinuity flagged honestly." },
            { href: "/country/india/nagaland", tag: "Comparison", title: "Nagaland Potato — Stable Flat Series", desc: "Adjacent NE state with the stablest series in the DA&FW table — useful contrast." },
            { href: "/country/india/meghalaya", tag: "Comparison", title: "Meghalaya Potato — Hosts ICAR-RCNEH HQ", desc: "Regional ICAR institution that serves Arunachal Pradesh from Umiam." },
            { href: "/blog/india-potato-production-by-state", tag: "Analysis", title: "India Potato Production by State", desc: "Where Arunachal fits in the eastern Himalayan / NE region context." },
          ]} />

          <FurtherReading />

          <BottomCTA />

        </div>
      </article>
    </>
  );
}

export default async function IndiaStatePage({ params }) {
  const { state } = await params;
  switch (state) {
    case "uttar-pradesh": return <UttarPradeshState />;
    case "west-bengal": return <WestBengalState />;
    case "bihar": return <BiharState />;
    case "gujarat": return <GujaratState />;
    case "madhya-pradesh": return <MadhyaPradeshState />;
    case "jharkhand": return <JharkhandState />;
    case "maharashtra": return <MaharashtraState />;
    case "andhra-pradesh": return <AndhraPradeshState />;
    case "assam": return <AssamState />;
    case "tripura": return <TripuraState />;
    case "meghalaya": return <MeghalayaState />;
    case "nagaland": return <NagalandState />;
    case "manipur": return <ManipurState />;
    case "arunachal-pradesh": return <ArunachalPradeshState />;
    default: notFound();
  }
}
