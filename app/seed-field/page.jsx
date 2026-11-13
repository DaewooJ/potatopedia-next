import Link from "next/link";
import RefPage, { Cards, refJsonLd, refMetadata } from "@/components/RefPage";
import NewsletterSignup from "@/components/NewsletterSignup";
import { LatestNews } from "@/components/NewsUI";

// /seed-field — owns "seed potatoes" and "seed potatoes for planting" (keywords.csv, 13 Nov 2026). Hub of
// Seed Potato & Field. Facts only from the site's growing guides and the backend corpus files named in Sources.
// /seed-field/certified-seed-potatoes owns "certified seed potatoes" / "buy seed potatoes"; /answers/seed-potato-certification
// keeps the process question; /knowledge/seed-potato-systems stays the long reference. Link, do not duplicate.
export const revalidate = 3600;

const PATH = "/seed-field";
const TITLE = "Seed Potatoes: Classes, Certification and Planting";
const DESC = "Seed potatoes explained: how seed potatoes for planting are multiplied, graded and certified, the EU seed classes, the biggest seed exporters and how to plant them.";
export const metadata = refMetadata({ title: TITLE, description: DESC, path: PATH });

const UPDATED = { iso: "2026-11-13", label: "13 November 2026" };
const crumbs = [{ name: "Home", href: "/" }, { name: "Seed potatoes", href: PATH }];
const L = { color: "var(--gold)", fontWeight: 600, textDecoration: "none" };

const sections = [
  {
    id: "what",
    h2: "What are seed potatoes?",
    p: [
      "Potatoes are grown from tubers, not from true seed, so every crop starts from potatoes saved from an earlier crop. Diseases that live in the tuber, above all viruses and blackleg, travel with it into the next field. Seed potatoes are tubers grown for planting under rules meant to stop that: clean starting material, a limited number of field generations, and official inspection of the growing crop and of the harvested lot.",
      <>The full system, country by country, is in the <Link href="/knowledge/seed-potato-systems" style={L}>seed potato systems guide</Link>. How certification works as a process is answered in <Link href="/answers/seed-potato-certification" style={L}>seed potato certification</Link>.</>,
    ],
  },
  {
    id: "ladder",
    h2: "How seed potatoes for planting are multiplied",
    p: [
      "Seed multiplication starts in the laboratory and glasshouse. In Western Australia's certified scheme, generation zero (G0) is minitubers, microtubers or plantlets from accredited labs and glasshouses; seed may then be multiplied for at most five field generations, and any generation may be sold as certified seed if it meets the standard (DPIRD Western Australia, Certified Seed Potato Scheme rules, Aug 2023).",
      "Uganda's 2022 protocol follows the same pattern, from tissue-culture plantlets, mother plants, rooted cuttings and screen-house minitubers to field-certified seed tubers (Ministry of Agriculture, Animal Industry and Fisheries, Seed Potato Inspection and Certification Protocol, May 2022).",
      "In the European Union the field generations carry legal grade names. Basic seed is graded S, SE or E, and certified seed is graded A or B; each grade has a ceiling on off-types, blackleg and virus symptoms (Commission Implementing Directive 2014/20/EU).",
    ],
    table: {
      headers: ["EU grade", "Type", "Blackleg in crop", "Virus in direct progeny", "Max. field generations"],
      rows: [
        ["S", "Basic", "0.1%", "1.0%", "5"],
        ["SE", "Basic", "0.5%", "2.0%", "6"],
        ["E", "Basic", "1.0%", "4.0%", "7"],
        ["A", "Certified", "2.0%", "8.0%", "Not set"],
        ["B", "Certified", "4.0%", "10.0%", "Not set"],
      ],
      note: "Maximum shares allowed. Source: Commission Implementing Directive 2014/20/EU, Annexes I and II (EUR-Lex). Pre-basic classes are not defined in this act.",
    },
  },
  {
    id: "trade",
    h2: "Where seed potatoes come from: the biggest exporters",
    p: [
      "Seed potatoes are traded under HS code 0701.10. The Netherlands is far ahead of every other exporter: 922,273 tonnes worth US$802.4 million in 2025, more by value than the next six countries together (World Bank WITS / UN Comtrade, 2025).",
    ],
    table: {
      headers: ["Exporter, 2025", "Value (US$ million)", "Quantity (tonnes)"],
      rows: [
        ["Netherlands", "802.4", "922,273"],
        ["France", "173.4", "275,531"],
        ["Germany", "95.7", "120,842"],
        ["United Kingdom", "88.5", "Not published"],
        ["Belgium", "61.1", "85,103"],
        ["Denmark", "56.0", "69,638"],
        ["Canada", "33.8", "69,526"],
        ["Egypt", "26.3", "29,573"],
        ["United States", "19.5", "22,372"],
      ],
      note: "Exports of HS 070110 to the world, as reported by each country. Source: World Bank WITS / UN Comtrade, 2025.",
    },
  },
  {
    id: "planting",
    h2: "Planting seed potatoes: what growers check",
    list: [
      "Buy certified seed and order it by variety, class or generation, and size (Potatopedia growing guide).",
      "Do not plant shop potatoes: they can carry viruses such as PVY and PLRV without visible symptoms (Potatopedia growing guide).",
      "Pre-sprout (chit) seed for 2 to 4 weeks at 8 to 12 °C in diffuse light before planting (Potatopedia growing guide).",
      "Plant when the soil is above 10 °C at 10 cm; seed pieces rot below 7 to 8 °C and emerge unevenly (Potatopedia growing guide).",
      "Typical spacing: 25 to 30 cm in the row, 8 to 12 cm deep, rows 75 to 90 cm apart (Potatopedia growing guide).",
    ],
    p2: [
      <>More in <Link href="/knowledge/complete-potato-growing-guide" style={L}>the complete growing guide</Link> and <Link href="/knowledge/common-potato-growing-mistakes" style={L}>common growing mistakes</Link>.</>,
    ],
  },
];

export default function Page() {
  const jsonLd = refJsonLd({
    path: PATH,
    headline: "Seed potatoes: how seed potatoes for planting are produced, certified and traded",
    description: DESC,
    datePublished: UPDATED.iso,
    dateModified: UPDATED.iso,
    crumbs,
  });
  return (
    <RefPage
      path={PATH}
      kicker="Seed and field"
      h1="Seed potatoes: how seed potatoes for planting are produced, certified and traded"
      lede="Seed potatoes are tubers grown to be planted, not eaten. Because a potato crop is grown from tubers, seed potatoes for planting carry the health of the next crop with them, so they are multiplied from disease-tested starting material over a limited number of field generations and inspected at each step. Certified seed is the class sold to growers. This page explains the classes, the main exporters and what to check before planting."
      updatedLabel={UPDATED.label}
      updatedISO={UPDATED.iso}
      crumbs={crumbs}
      sections={sections}
      jsonLd={jsonLd}
      sources={[
        { label: "Commission Implementing Directive 2014/20/EU (Union grades of basic and certified seed potatoes), EUR-Lex", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0020" },
        { label: "World Bank WITS / UN Comtrade, seed potato (HS 070110) exports by country, 2025", url: "https://wits.worldbank.org/trade/comtrade/en/country/ALL/year/2025/tradeflow/Exports/partner/WLD/product/070110" },
        { label: "DPIRD Western Australia, Certified Seed Potato Scheme production rules (SPP-1 Issue 8, Aug 2023)", url: "https://web-prd.dpird.wa.gov.au/siteassets/documents/forms/biosecurity/ddls/seed-testing-and-certification/certified-seed-potato-rules-spp-1-issue-8.pdf" },
        { label: "MAAIF Uganda, Seed Potato Inspection and Certification Protocol (May 2022)", url: "https://www.agriculture.go.ug/wp-content/uploads/2023/01/Potato-inspection-protocol.pdf" },
        { label: "Potatopedia, common potato growing mistakes (planting checks)", url: "https://www.potatopedia.com/knowledge/common-potato-growing-mistakes" },
      ]}
      related={[
        { href: "/seed-field/certified-seed-potatoes", title: "Certified seed potatoes", desc: "Where to buy, what the label means." },
        { href: "/answers/seed-potato-certification", title: "Seed potato certification", desc: "The process, step by step." },
        { href: "/knowledge/seed-potato-systems", title: "Seed potato systems", desc: "Country systems and trade." },
        { href: "/diseases/pvy-viruses", title: "PVY and viruses", desc: "Why seed health matters." },
      ]}
    >
      <Cards title="Seed and field pages" items={[
        { href: "/seed-field/certified-seed-potatoes", title: "Certified seed potatoes", desc: "What certified means, EU classes A and B, and how to find a seed supplier." },
        { href: "/diseases", title: "Potato diseases", desc: "Late blight, blackleg, PVY, nematodes and scab." },
        { href: "/varieties", title: "Varieties", desc: "Traits, origin and uses of 244 varieties." },
      ]} />
      <LatestNews newsletter="seed-potato-field" />
      <NewsletterSignup compact id="signup-seed" defaults={["seed-potato-field"]} title="Get Seed Potato & Field" intro="New varieties, certification rules, disease, storage and field machinery. Free, every other Thursday." />
    </RefPage>
  );
}
