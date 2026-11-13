// The three Potatopedia newsletters + the magazine (Devendra, 13 Nov 2026). Single source of truth for
// names, slugs, cadence, accents and copy. Used by pages, email template, schema and the backend/netweb jobs
// (they mirror the slugs; keep in sync with db/newsletters.sql CHECK lists).
// Accents: never green or teal (house rule). Text on accent must pass 4.5:1 with white.
export const SITE = "https://www.potatopedia.com";
export const TRUST_LINE = "Clearly labelled sponsors. Never paid rankings. Never paid facts.";
export const SEND_HOUR_UTC = 6; // 06:00 UTC = 07:00 CET, 11:30 IST, 01:00 US Eastern
export const FROM = '"Potatopedia" <newsletters@potatopedia.com>'; // potatopedia.com is a verified SES domain; reply-to hi@
export const REPLY_TO = "hi@potatopedia.com";
export const POSTAL_LINE = "Potatopedia · Pune, Maharashtra, India"; // physical address line in every mail (confirm full address with Devendra)

export const NEWSLETTERS = [
  {
    slug: "potato-processing-weekly",
    name: "Potato Processing Weekly",
    short: "Processing Weekly",
    cadence: "weekly",
    cadenceLabel: "Every Tuesday",
    sendRule: { kind: "weekly", weekday: 2 }, // 0 Sun … 6 Sat
    accent: "#1E5A8A",
    hub: "processing",
    hubHref: "/knowledge/how-potatoes-are-processed",
    reader: "Plant and technical managers, buyers and R&D teams in fries, chips, flakes, starch and dehydrated potato.",
    covers: ["Plant openings and expansions", "Capacity", "Technology: sorting, peeling, frying, acrylamide, energy", "Raw-material supply", "Company results", "People moves"],
    sponsors: "Processing-line makers, optical sorters, fryers, peelers, packaging, oil, flavours, engineering firms",
    linkedinNewsletter: null, // URL once Devendra creates it on page 112734286
  },
  {
    slug: "seed-potato-field",
    name: "Seed Potato & Field",
    short: "Seed & Field",
    cadence: "fortnightly",
    cadenceLabel: "Every other Thursday",
    sendRule: { kind: "fortnightly", weekday: 4, anchor: "2026-11-26" },
    accent: "#8B5A2B",
    hub: "seed-field",
    hubHref: "/seed-field",
    reader: "Seed growers, ware growers, agronomists, breeders and storage managers.",
    covers: ["New varieties and registrations", "Seed certification and trade rules", "Disease and pests: PVY, late blight, wireworm, zebra chip", "Storage and sprout control", "Field machinery", "Research results"],
    sponsors: "Breeders and seed houses, planters, harvesters, haulm toppers, storage and ventilation, crop protection, irrigation, labs",
    linkedinNewsletter: null,
  },
  {
    slug: "potato-prices-trade",
    name: "Potato Prices & Trade",
    short: "Prices & Trade",
    cadence: "monthly",
    cadenceLabel: "First Monday of the month",
    sendRule: { kind: "monthly-first", weekday: 1 },
    accent: "#A86200",
    hub: "prices",
    hubHref: "/prices",
    reader: "Traders, importers and exporters, processors' buyers, analysts and investors.",
    covers: ["Free-buy and contract prices by market", "Frozen-fry and flake export prices and volumes", "Trade flows by HS code: 0701, 0710.10, 2004.10, 2005.20, 1105, 1108.13", "Crop estimates", "Freight", "Currency effects"],
    sponsors: "Traders, shipping and logistics, cold chain, banks and insurers, market-data buyers",
    linkedinNewsletter: null,
  },
];

export const MAGAZINE = {
  slug: "magazine",
  name: "Potatopedia Magazine",
  cadenceLabel: "Monthly digital flipbook",
  accent: "#C62828",
};

export const NEWSLETTER_SLUGS = NEWSLETTERS.map((n) => n.slug);
export const bySlug = (slug) => NEWSLETTERS.find((n) => n.slug === slug) || null;
export const masthead = (n) => `${n.name} · by Potatopedia`;
export const issueLabel = (no) => `Issue ${String(no).padStart(2, "0")}`;
export const newsHref = (item) =>
  `/news/${item.pub_year}/${String(item.pub_month).padStart(2, "0")}/${item.slug}`;
// A Postgres DATE comes back from the driver as a Date at LOCAL midnight (2026-11-24 in IST = 2026-11-23T18:30Z), so
// read it with local getters; toISOString() would shift it a day on any machine east of UTC (F1 fix, 13 Nov 2026).
export const dayStr = (d) => {
  if (typeof d === "string") return d.slice(0, 10);
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
export const issueHref = (issue) => `/issues/${issue.newsletter}/${dayStr(issue.issue_date)}`;
// "13 Nov 2026"
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

// Signup form job roles (also the media-kit "job roles" breakdown).
export const JOB_ROLES = [
  "Processing plant / technical",
  "Buyer / procurement",
  "R&D / quality",
  "Seed grower",
  "Ware grower / farm manager",
  "Agronomist / adviser",
  "Breeder / seed company",
  "Storage manager",
  "Trader / importer / exporter",
  "Analyst / investor / bank",
  "Machinery / supplier",
  "Researcher / academic",
  "Government / association",
  "Journalist",
  "Other",
];
