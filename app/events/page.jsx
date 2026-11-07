import Link from "next/link";
import RefPage, { refJsonLd, refMetadata } from "../../components/RefPage";
import { EVENTS, EVENTS_UPDATED, CHECKED_NOT_LISTED, NOT_SOURCED, eventStatus, fmtRange } from "../../lib/reference/events";

const DESC = "Calendar of major potato industry events with dates, city, organiser and official link: World Potato Congress, INTERPOM, Potato Expo, PotatoEurope and more.";
const PATH = "/events";
export const metadata = refMetadata({ title: "Potato Industry Events Calendar 2026 to 2027", description: DESC, path: PATH });

const crumbs = [{ name: "Home", href: "/" }, { name: "Events", href: PATH }];
const SITE = "https://www.potatopedia.com";

const badge = (st) => ({
  display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 9px", borderRadius: 999,
  background: st === "past" ? "var(--paper)" : "var(--accent-bg)", color: st === "past" ? "var(--mute)" : "#fff", border: "1px solid var(--line)",
});

function EventCard({ e, st }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px", marginBottom: 12, opacity: st === "past" ? 0.85 : 1 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 6 }}>
        <span style={badge(st)}>{st === "past" ? "Past" : st === "now" ? "Happening now" : "Upcoming"}</span>
        <span style={{ fontSize: 13, color: "var(--mute)" }}>{fmtRange(e)}</span>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", margin: "0 0 8px" }}>{e.name}</h3>
      <dl style={{ margin: 0, fontSize: 14, color: "var(--ink2)", lineHeight: 1.6 }}>
        <div><dt style={{ display: "inline", fontWeight: 600 }}>City: </dt><dd style={{ display: "inline", margin: 0 }}>{e.city}</dd></div>
        <div><dt style={{ display: "inline", fontWeight: 600 }}>Venue: </dt><dd style={{ display: "inline", margin: 0 }}>{e.venue || "not stated on the official site"}</dd></div>
        <div><dt style={{ display: "inline", fontWeight: 600 }}>Organiser: </dt><dd style={{ display: "inline", margin: 0 }}>{e.organiser || "not stated on the official site"}</dd></div>
      </dl>
      {e.note && <p style={{ fontSize: 13.5, color: "var(--mute)", lineHeight: 1.6, margin: "8px 0 0" }}>{e.note}</p>}
      <p style={{ margin: "8px 0 0", fontSize: 13.5 }}><a href={e.url} rel="noopener" style={{ color: "var(--gold)", fontWeight: 600, wordBreak: "break-word" }}>Official website</a></p>
    </div>
  );
}

export default function Page() {
  const today = new Date();
  const withStatus = EVENTS.map((e) => ({ e, st: eventStatus(e, today) }));
  const upcoming = withStatus.filter((x) => x.st !== "past");
  const past = withStatus.filter((x) => x.st === "past");

  const eventLd = upcoming.map(({ e }) => ({
    "@type": "Event",
    "@id": `${SITE}${PATH}#${e.id}`,
    name: e.name,
    startDate: e.start,
    endDate: e.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: e.venue || e.city, address: { "@type": "PostalAddress", addressLocality: e.city } },
    url: e.url,
    ...(e.organiser ? { organizer: { "@type": "Organization", name: e.organiser.split(",")[0].split(" (")[0].split(";")[0] } } : {}),
    isAccessibleForFree: false,
  }));

  const jsonLd = refJsonLd({
    path: PATH,
    headline: "Potato industry events calendar, 2026 to 2027",
    description: DESC,
    datePublished: "2026-11-07",
    dateModified: EVENTS_UPDATED.iso,
    crumbs,
    extra: eventLd,
  });

  return (
    <RefPage
      path={PATH}
      kicker="Calendar"
      h1="Potato industry events"
      lede="Major potato congresses, trade fairs and summits, with dates, city, organiser and a link to the official site. Every date comes from the organiser's own website, and anything the site did not state is marked as such."
      updatedLabel={EVENTS_UPDATED.label}
      updatedISO={EVENTS_UPDATED.iso}
      crumbs={crumbs}
      sections={[]}
      jsonLd={jsonLd}
      sources={[...EVENTS.map((e) => ({ label: e.name, url: e.url })), ...CHECKED_NOT_LISTED.map((c) => ({ label: c.name, url: c.url }))]}
      related={[
        { href: "/answers/world-potato-congress-2026-location", title: "World Potato Congress 2026", desc: "Short answer." },
        { href: "/country/kenya", title: "Kenya", desc: "Host of the 13th Congress." },
        { href: "/blog/kenya-potato-boom-wpc-2026", title: "Kenya's potato boom", desc: "Background to the Congress." },
        { href: "/country/belgium", title: "Belgium", desc: "Home of INTERPOM and PotatoEurope 2027." },
      ]}
    >
      <section>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "32px 0 12px", paddingLeft: 14, borderLeft: "4px solid var(--gold)" }}>Upcoming</h2>
        {upcoming.map(({ e, st }) => <EventCard key={e.id} e={e} st={st} />)}
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "32px 0 12px", paddingLeft: 14, borderLeft: "4px solid var(--gold)" }}>Past</h2>
        {past.map(({ e, st }) => <EventCard key={e.id} e={e} st={st} />)}
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "32px 0 12px", paddingLeft: 14, borderLeft: "4px solid var(--gold)" }}>Checked, not listed</h2>
        <ul style={{ margin: "0 0 12px", paddingLeft: 22 }}>
          {CHECKED_NOT_LISTED.map((c) => <li key={c.name} style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.65, marginBottom: 6 }}><strong>{c.name}.</strong> {c.detail}</li>)}
          {NOT_SOURCED.map((t) => <li key={t} style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.65, marginBottom: 6 }}>{t}</li>)}
        </ul>
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderLeft: "4px solid var(--gold)", borderRadius: 10, padding: "14px 16px", margin: "24px 0 0" }}>
          <p style={{ margin: 0, fontSize: 14.5, color: "var(--ink2)", lineHeight: 1.65 }}>
            Organisers: list your event. Send the dates, city, organiser and official link through the <Link href="/contact" style={{ color: "var(--gold)", fontWeight: 600 }}>contact page</Link>. We list events only from the organiser's own website.
          </p>
        </div>
      </section>
    </RefPage>
  );
}
