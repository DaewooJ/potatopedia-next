import Link from "next/link";
import { ppCSS } from "../../lib/styles";
import { EVENTS, EVENTS_BY_DATE } from "../../lib/events-data";
import EventsFilter from "../../components/EventsFilter";

export const metadata = {
  title: "Global Potato Industry Events 2026–2027",
  description: "Verified calendar of major potato industry events worldwide — Potato Expo, World Potato Congress, Interpom, Potato Europe, Global Potato Summit, EAPR, APPC, British Potato Event. Dates, venues, scale, focus, and official links.",
  alternates: { canonical: "https://www.potatopedia.com/events" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/events",
    title: "Global Potato Industry Events 2026–2027",
    description: "The verified calendar of every major potato industry event worldwide.",
    images: ["/og-image.png"],
  },
};

export default function EventsPage() {
  // Build JSON-LD: ItemList of Events
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.potatopedia.com/events#collection",
    name: "Global Potato Industry Events",
    description: "Verified calendar of major potato industry events worldwide.",
    url: "https://www.potatopedia.com/events",
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "Potatopedia", url: "https://www.potatopedia.com", logo: "https://www.potatopedia.com/logo.png" },
    hasPart: EVENTS_BY_DATE.map((e) => {
      const node = {
        "@type": "Event",
        name: e.name,
        description: e.scale + ". " + e.focus + (e.notes ? ". " + e.notes : ""),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: e.venue || e.country,
          address: e.country,
        },
        organizer: { "@type": "Organization", name: e.organizer },
      };
      if (e.nextDateISO) node.startDate = e.nextDateISO;
      if (e.officialUrl) node.url = e.officialUrl;
      return node;
    }),
  };

  // Build a quick-glance timeline showing only events with confirmed next-edition dates
  const dated = EVENTS_BY_DATE.filter((e) => e.nextDateISO);
  const undated = EVENTS_BY_DATE.filter((e) => !e.nextDateISO);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A", overflowX: "hidden" }}>
      <style>{ppCSS}{`
        .pp-events-timeline { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        @media (max-width: 768px) {
          .pp-events-timeline { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .pp-events-timeline { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* Hero */}
      <section style={{ paddingTop: 64, paddingBottom: 32, textAlign: "center" }}>
        <div className="pp-section" style={{ maxWidth: 880, margin: "0 auto", padding: "0 48px" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 18 }}>Industry events</span>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.12, letterSpacing: -1.6, marginBottom: 14 }}>
            Global Potato Industry<br />
            <span style={{ background: "linear-gradient(135deg,#C62828,#8E0000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Events Calendar 2026–2027</span>
          </h1>
          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.65, maxWidth: 700, margin: "0 auto" }}>
            Every major potato industry event worldwide — Potato Expo, World Potato Congress, Interpom, Potato Europe, Global Potato Summit, EAPR, APPC, British Potato Event. Dates, venues, scale, and official links — verified directly from organisers.
          </p>
        </div>
      </section>

      {/* Stat strip */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div className="pp-section pp-stats-grid" style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 48px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>{EVENTS.length}</div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Major events tracked</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>{dated.length}</div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>2026 dates confirmed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>5</div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Continents covered</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1, lineHeight: 1 }}>4</div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Cadence types</div>
          </div>
        </div>
      </section>

      {/* Timeline preview — confirmed 2026 dates */}
      <section className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 48px 16px" }}>
        <div style={{ marginBottom: 22 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Coming up</span>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.7, margin: 0 }}>Confirmed 2026–2027 dates</h2>
        </div>
        <div className="pp-events-timeline">
          {dated.map((e) => {
            const d = new Date(e.nextDateISO);
            const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
            const day = d.getDate();
            const year = d.getFullYear();
            return (
              <a key={e.slug} href={e.officialUrl || "#"} target={e.officialUrl ? "_blank" : "_self"} rel={e.officialUrl ? "noopener noreferrer" : ""} style={{ display: "block", textDecoration: "none", color: "inherit", padding: "16px 18px", background: "#fff", border: "1px solid #ececec", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5 }}>{month} {day}</span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>{year}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, marginBottom: 4 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{e.country}</div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Filter + Grid */}
      <section style={{ paddingTop: 32 }}>
        <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px 8px" }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Browse all events</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.6, margin: 0 }}>Filter by region, audience, and cadence</h2>
          </div>
        </div>
        <EventsFilter events={EVENTS_BY_DATE} />
      </section>

      {/* Closing methodology */}
      <section className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 48px 80px" }}>
        <div style={{ padding: "20px 24px", background: "#FAFAFA", border: "1px solid #ececec", borderRadius: 12, fontSize: 13, color: "#666", lineHeight: 1.7 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Methodology &amp; sources</div>
          Every event entry is verified against the organiser&apos;s official website. Dates and venues are taken directly from the event organiser. The {EVENTS.length} events listed represent the major recurring international gatherings; specialist regional events (state-level commissions, breeder workshops, supply-chain conferences) are not included. For deeper context on individual events see our <Link href="/knowledge/potato-expo-2026" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Potato Expo 2026 article</Link> and the <Link href="/blog/kenya-potato-boom-wpc-2026" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Kenya WPC 2026 analysis</Link>.
        </div>
      </section>
    </div>
  );
}
