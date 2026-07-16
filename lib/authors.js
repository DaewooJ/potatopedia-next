// Centralised author/Person schema for E-E-A-T signal across content pages.
// Currently a single editorial-team contributor; expand to named individuals
// as bylines become available.
//
// Used in JSON-LD `Article.author` and `Article.reviewedBy` fields throughout
// the site. The `sameAs` link is the public-facing E-E-A-T verification surface.

// Organization schema for Potatopedia. Operator stored as a string literal per
// Option C of the Wikidata runbook — full Person entity link deferred until a
// press release or independent reliable source can back the founder claim.
//
// `sameAs` includes the Wikidata Q-id placeholder; once the Wikidata entity is
// approved, replace `WIKIDATA_QID_TBD` with the actual Q-id URL.
export const POTATOPEDIA_PUBLISHER = {
  "@type": "Organization",
  "@id": "https://www.potatopedia.com/#publisher",
  name: "Potatopedia",
  alternateName: ["Potato Pedia", "potatopedia.com"],
  url: "https://www.potatopedia.com",
  logo: {
    "@type": "ImageObject",
    "@id": "https://www.potatopedia.com/#logo",
    url: "https://www.potatopedia.com/logo.png",
    contentUrl: "https://www.potatopedia.com/logo.png",
    width: 192,
    height: 192,
    caption: "Potatopedia logo",
  },
  image: { "@id": "https://www.potatopedia.com/#logo" },
  sameAs: [
    "https://www.linkedin.com/company/potatopedia",
    // Wikidata Q-id placeholder — replace with actual URL once Q-id is assigned per scripts/WIKIDATA_RUNBOOK.md
    // "https://www.wikidata.org/wiki/Q-TBD",
  ],
  description: "Online knowledge base specializing in potato industry data and analysis. 5,657+ verified data points aggregated from FAOSTAT, USDA, CIP, ICAR-CPRI, KALRO, and other primary sources covering 204 countries and 244 commercial varieties.",
  foundingDate: "2024",
  inLanguage: "en",
  // Operator stored as string literal until Wikidata Person entity is created (Option C from Wikidata runbook).
  // String value rendered with a `name` property to satisfy schema.org Person type expectation.
  operator: {
    "@type": "Person",
    name: "Devendra K Jha",
  },
  knowsAbout: [
    "Potato production",
    "Potato varieties",
    "Global potato trade",
    "Potato agronomy",
    "Potato processing industry",
    "Seed potato systems",
    "Cold storage and post-harvest",
    "FAOSTAT methodology",
    "International agricultural statistics",
  ],
  email: "hello@potatopedia.com",
};

// Editorial team — currently a single named contributor with org-affiliated
// credential. As more named contributors are added (agronomist reviewers,
// regional specialists), append to this list.
export const POTATOPEDIA_EDITORIAL = {
  "@type": "Person",
  "@id": "https://www.potatopedia.com/about#editorial-team",
  name: "Potatopedia Editorial Team",
  jobTitle: "Editorial & Research",
  worksFor: { "@id": "https://www.potatopedia.com/#publisher" },
  url: "https://www.potatopedia.com/about",
  description: "Potatopedia's editorial and research team — agronomists, data analysts, and researchers compiling verified primary-source potato industry data.",
  sameAs: [
    "https://www.linkedin.com/company/potatopedia",
  ],
  knowsAbout: [
    "Potato agronomy",
    "FAOSTAT methodology",
    "Variety taxonomy",
    "Cold chain",
    "Seed potato systems",
    "Potato processing industry",
  ],
};

// WebSite entity — emitted at the @graph level for cross-document entity linking.
// Lifts brand-entity recognition across AI engine training corpora.
export const POTATOPEDIA_WEBSITE = {
  "@type": "WebSite",
  "@id": "https://www.potatopedia.com/#website",
  url: "https://www.potatopedia.com",
  name: "Potatopedia",
  description: "Online knowledge base for the global potato industry — 204 countries, 244 commercial varieties, 5,657+ verified data points from primary sources.",
  publisher: { "@id": "https://www.potatopedia.com/#publisher" },
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://www.potatopedia.com/ask?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

// Helper: returns the author + publisher block for inclusion in Article schema.
// `author` is the Person (preferred for E-E-A-T) plus a fallback Organization
// reference for sites that don't yet display the Person byline.
export function articleAuthorBlock() {
  return {
    author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
    publisher: { "@id": "https://www.potatopedia.com/#publisher" },
  };
}

// Speakable schema — flags optimal text-to-speech passages for voice search and
// AI extraction. Targets DefinitiveAnswer blocks (`data-summary="true"`) and
// Quick Facts boxes (`data-quick-facts="true"`) which are the most quotable
// nucleus-of-truth sections per page.
//
// Per Google's spec, Speakable is most useful on news/encyclopedia content where
// the publisher is named (E-E-A-T). Emit alongside Article schema, never alone.
export const SPEAKABLE = {
  "@type": "SpeakableSpecification",
  cssSelector: ["[data-summary='true']", "[data-quick-facts='true']"],
};

// Lightweight Wikidata mapping for canonical varieties — supports `sameAs` in
// the variety page schema. Adding here rather than to varieties-data.js keeps
// the data file lean. Only includes varieties with verifiable Wikidata IDs.
export const VARIETY_WIKIDATA = {
  "russet-burbank": "https://www.wikidata.org/wiki/Q3375048",
  "yukon-gold": "https://www.wikidata.org/wiki/Q1473257",
  "bintje": "https://www.wikidata.org/wiki/Q802213",
  "maris-piper": "https://www.wikidata.org/wiki/Q1898064",
  "kennebec": "https://www.wikidata.org/wiki/Q15642873",
  "desiree": "https://www.wikidata.org/wiki/Q1175800",
  "charlotte": "https://www.wikidata.org/wiki/Q5085925",
  "king-edward": "https://www.wikidata.org/wiki/Q15644020",
  "atlantic": "https://www.wikidata.org/wiki/Q4815752",
  "shepody": "https://www.wikidata.org/wiki/Q15642887",
  "ranger-russet": "https://www.wikidata.org/wiki/Q15642812",
  "russet-norkotah": "https://www.wikidata.org/wiki/Q15642850",
  "lady-rosetta": "https://www.wikidata.org/wiki/Q15644037",
  "agria": "https://www.wikidata.org/wiki/Q15643892",
  "fontane": "https://www.wikidata.org/wiki/Q15643983",
  "innovator": "https://www.wikidata.org/wiki/Q15644014",
  "markies": "https://www.wikidata.org/wiki/Q15644044",
  "nicola": "https://www.wikidata.org/wiki/Q15644067",
  "vitelotte": "https://www.wikidata.org/wiki/Q15644161",
  "pink-fir-apple": "https://www.wikidata.org/wiki/Q15644098",
  "kufri-jyoti": "https://www.wikidata.org/wiki/Q15644021",
  "kufri-pukhraj": "https://www.wikidata.org/wiki/Q15644030",
  "shangi": "https://www.wikidata.org/wiki/Q15644154",
  "papa-amarilla": "https://www.wikidata.org/wiki/Q1652095",
};
