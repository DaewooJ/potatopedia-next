// Potato industry events. Rule: dates, city and organiser come only from the organisers' own websites (or, for the
// World Potato Congress, its own site as summarised in the corpus). Anything an official site did not confirm is marked
// "not stated" or left out. Status is computed from today's date at build, so past and upcoming move on rebuild.

export const EVENTS_UPDATED = { iso: "2026-11-07", label: "7 November 2026" };

// start/end are ISO dates (end inclusive). venue/organiser null = the official site did not state it.
export const EVENTS = [
  {
    id: "wpc-2026",
    name: "13th World Potato Congress",
    start: "2026-10-26",
    end: "2026-10-30",
    city: "Naivasha, Kenya",
    venue: "Sawela Lodges, Lake Naivasha",
    organiser: "World Potato Congress Inc., with the Kenyan host committee",
    url: "https://www.potatocongress.org",
    note: "The first Congress in Sub-Saharan Africa, held every two years since the move from a three-year cycle. Theme: Global Potato Partnership for Enhanced Food Systems, Nutrition Security and Trade. The Congress site does not name a 2028 host.",
  },
  {
    id: "interpom-2026",
    name: "INTERPOM",
    start: "2026-11-29",
    end: "2026-12-01",
    city: "Kortrijk, Belgium",
    venue: "Kortrijk Xpo, Doorniksesteenweg 216, 8500 Kortrijk",
    organiser: "Belgapom, the Belgian potato trade association; Kortrijk Xpo handles the practical organisation",
    url: "https://www.interpom.be/en/",
    note: "Open daily 09:30 to 18:00.",
  },
  {
    id: "gps-2026",
    name: "Global Potato Summit 2026",
    start: "2026-12-16",
    end: "2026-12-17",
    city: "Gandhinagar, Gujarat, India",
    venue: "Mahatma Mandir Convention Centre",
    organiser: null,
    url: "https://globalpotatosummit.com/",
    note: "The event site does not name the 2026 organiser. It names a convenor for the 2025 edition only. This is the Indian potato summit; no event called Global Potato Conclave was found on an official site.",
  },
  {
    id: "potato-expo-2027",
    name: "Potato Expo 2027",
    start: "2027-01-05",
    end: "2027-01-07",
    city: "Denver, Colorado, USA",
    venue: "Gaylord Rockies Resort & Convention Center",
    organiser: "National Potato Council",
    url: "https://www.nationalpotatocouncil.org/potato-expo/",
    note: "North America's annual potato industry conference and trade show.",
  },
  {
    id: "potatoeurope-2027",
    name: "PotatoEurope 2027",
    start: "2027-09-08",
    end: "2027-09-09",
    city: "Tournai, Belgium",
    venue: null,
    organiser: "DLG Markets GmbH (credited on the event site)",
    url: "https://www.potatoeurope.de/en",
    note: "The event rotates between the main producing countries. The official site names the city but no venue yet.",
  },
];

// Checked on official sites; no potato-specific hall or area stated, so not listed as potato events.
export const CHECKED_NOT_LISTED = [
  { name: "Fruit Logistica", detail: "3 to 5 February 2027, Berlin. The official site lists Fresh Produce, Machinery & Technology and Logistics segments and does not mention a potato hall.", url: "https://www.fruitlogistica.com/en/" },
  { name: "Agritechnica", detail: "14 to 20 November 2027, Hanover, organised by DLG. The official site does not describe a potato technology area; its Digital Farm Center covers crop-production technology generally.", url: "https://www.agritechnica.com/en/" },
];

export const NOT_SOURCED = [
  "Asia Potato Conference: no current edition found on an official site (the Asian Potato Association's triennial conferences appear only as historical proceedings).",
  "Potato Industry Conference (Australia): no official site or date found for 2026 or 2027. Check Potatoes Australia directly.",
  "PotatoEurope 2026 and World Potato Congress 2028: the PotatoEurope site now points to the 2027 edition, and the Congress site does not name a 2028 host.",
];

export function eventStatus(e, today = new Date()) {
  const t = today.toISOString().slice(0, 10);
  if (e.end < t) return "past";
  if (e.start <= t) return "now";
  return "upcoming";
}

export function fmtRange(e) {
  const f = (iso, o) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { timeZone: "UTC", ...o });
  const s = new Date(e.start + "T12:00:00Z"), en = new Date(e.end + "T12:00:00Z");
  if (e.start === e.end) return f(e.start, { day: "numeric", month: "long", year: "numeric" });
  if (s.getUTCMonth() === en.getUTCMonth() && s.getUTCFullYear() === en.getUTCFullYear()) {
    return `${s.getUTCDate()} to ${f(e.end, { day: "numeric", month: "long", year: "numeric" })}`;
  }
  return `${f(e.start, { day: "numeric", month: "long" })} to ${f(e.end, { day: "numeric", month: "long", year: "numeric" })}`;
}
