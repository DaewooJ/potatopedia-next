// Writers who publish on Potatopedia (news, newsletters, contributed articles). One entry = one /authors/<slug> page.
// Rules (Devendra, 13 Nov 2026): real people only, their own photo (never AI images), credentials they can show.
// Until named staff or contributors are confirmed, the only author is the Potatopedia Editorial desk.
// news_items.author_slug points here (default 'potatopedia-editorial').
import { SITE } from "./newsletters";

export const AUTHORS = [
  {
    slug: "potatopedia-editorial",
    kind: "staff", // staff | contributor
    name: "Potatopedia Editorial desk",
    role: "News and research desk",
    institution: "Potatopedia",
    location: "Pune, India (covering markets worldwide)",
    photo: null, // { src, alt, credit } real photo only
    bio: [
      "The Potatopedia Editorial desk writes the news pages and the three newsletters: Potato Processing Weekly, Seed Potato & Field and Potato Prices & Trade.",
      "Every story starts from a primary source: a national potato board, a statistics office, a plant-health or seed-certification authority, a peer-reviewed paper or a company's own announcement. The desk links that source on the page and leaves out any figure it cannot trace to one.",
    ],
    credentials: [
      "Works from the same sourced corpus that powers Potatopedia's answer engine (FAOSTAT, USDA, CIP, UN Comtrade, Eurostat, national boards and peer-reviewed journals).",
      "Follows the published editorial standards: primary sources only, no aggregator copy, corrections shown at the foot of each page.",
    ],
    topics: ["Processing", "Seed and field", "Prices and trade"],
    links: [
      { label: "Editorial standards", href: "/editorial-standards" },
      { label: "About Potatopedia", href: "/about" },
      { label: "Potatopedia on LinkedIn", href: "https://www.linkedin.com/company/potatopedia" },
    ],
    sameAs: ["https://www.linkedin.com/company/potatopedia"],
  },
];

export const authorBySlug = (slug) => AUTHORS.find((a) => a.slug === slug) || null;
export const authorHref = (a) => `/authors/${a.slug}`;
export const authorId = (a) => `${SITE}/authors/${a.slug}#person`;

// Person schema for an author (used on /authors/<slug> and as NewsArticle.author).
export function authorPerson(a) {
  return {
    "@type": "Person",
    "@id": authorId(a),
    name: a.name,
    jobTitle: a.role,
    url: SITE + authorHref(a),
    worksFor: { "@id": `${SITE}/#publisher` },
    description: a.bio[0],
    knowsAbout: a.topics,
    ...(a.photo?.src ? { image: a.photo.src.startsWith("http") ? a.photo.src : SITE + a.photo.src } : {}),
    ...(a.sameAs?.length ? { sameAs: a.sameAs } : {}),
  };
}
