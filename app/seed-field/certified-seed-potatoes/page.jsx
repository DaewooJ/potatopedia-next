import Link from "next/link";
import RefPage, { refJsonLd, refMetadata } from "@/components/RefPage";
import LeadForm from "@/components/LeadForm";
import NewsletterSignup from "@/components/NewsletterSignup";
import { LatestNews, OpenSlot } from "@/components/NewsUI";

// /seed-field/certified-seed-potatoes — owns "certified seed potatoes", "buy seed potatoes", "seed potatoes for sale"
// (keywords.csv, 13 Nov 2026). Folds in /answers/certified-seed-potatoes (308 to here in next.config.mjs).
// "Find certified seed" enquiry → leads type 'seed'. One labelled Sponsored slot (unsold) → /advertise.
// Facts only from the corpus files named in Sources (EUR-Lex, WITS/UN Comtrade, DPIRD, MAAIF) and the site's guides.
export const revalidate = 3600;

const PATH = "/seed-field/certified-seed-potatoes";
const TITLE = "Certified Seed Potatoes: What They Are and How to Buy";
const DESC = "Certified seed potatoes explained: what the label guarantees, EU grades A and B, who exports them, and how to buy seed potatoes from certified sources.";
export const metadata = refMetadata({ title: TITLE, description: DESC, path: PATH });

const UPDATED = { iso: "2026-11-13", label: "13 November 2026" };
const crumbs = [
  { name: "Home", href: "/" },
  { name: "Seed potatoes", href: "/seed-field" },
  { name: "Certified seed potatoes", href: PATH },
];
const L = { color: "var(--gold)", fontWeight: 600, textDecoration: "none" };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Not sure yet"];

const sections = [
  {
    id: "what",
    h2: "What are certified seed potatoes?",
    p: [
      "Certified seed potatoes are seed tubers that an official certification authority has inspected in the field and as a harvested lot, and found within the limits set for their grade. The limits cover off-type plants (wrong variety), blackleg, virus symptoms and tuber defects such as rots and scab. The label names the grade, so a buyer knows what the lot was tested against.",
      "Certified seed is the last step of the seed ladder, the class sold to growers to plant ware, processing or further seed crops. Higher classes (pre-basic and basic) are kept for multiplication.",
      <>How seed is multiplied is on the <Link href="/seed-field" style={L}>seed potatoes</Link> hub; the inspection process is answered in <Link href="/answers/seed-potato-certification" style={L}>seed potato certification</Link>.</>,
    ],
  },
  {
    id: "eu-grades",
    h2: "What do EU grades A and B allow?",
    p: [
      "In the European Union, certified seed potatoes are marketed as Union grade A or Union grade B (Commission Implementing Directive 2014/20/EU). Both are checked twice over: the growing crop and its direct progeny must meet the plant limits below, and the marketed lot must meet the tuber limits.",
    ],
    table: {
      headers: ["Limit (maximum share)", "Grade A", "Grade B"],
      rows: [
        ["Off-type plants and other varieties", "0.2%", "0.5%"],
        ["Blackleg in the growing crop", "2.0%", "4.0%"],
        ["Plants with virus symptoms in the direct progeny", "8.0%", "10.0%"],
        ["Mosaic or leaf-roll symptoms in the growing crop", "2.0%", "6.0%"],
        ["Rots in the lot (other than ring rot and brown rot), by mass", "0.5%", "0.5%"],
        ["Black scurf over more than 10% of the surface, by mass", "5.0%", "5.0%"],
      ],
      note: "Source: Commission Implementing Directive 2014/20/EU, Annex II (EUR-Lex). Ring rot and brown rot are governed by EU plant-health law, not by these tolerances.",
    },
    p2: [
      "Outside the EU the names differ but the logic is the same. Western Australia caps seed at five field generations from laboratory or glasshouse generation zero, and any generation that meets the standard may be sold as certified (DPIRD, Aug 2023).",
    ],
  },
  {
    id: "buy",
    h2: "How to buy seed potatoes from a certified source",
    list: [
      "Ask for the certificate or official label for each lot: it names the variety, the grade or generation and the lot number. In the EU the grade reads \"Union grade A\" or \"Union grade B\" (Directive 2014/20/EU).",
      "Check the supplier and the lot with your national seed certification authority.",
      "Order by variety, class or generation, and tuber size (Potatopedia growing guide).",
      "For imports, check your country's plant-health import rules for seed potatoes before you order.",
      "Avoid shop potatoes as seed: they can carry viruses such as PVY and PLRV without symptoms (Potatopedia growing guide).",
    ],
    callout: <>Looking for seed potatoes for sale? Use the <a href="#find-seed" style={L}>Find certified seed</a> form below: tell us the variety, quantity and planting month.</>,
  },
  {
    id: "who-exports",
    h2: "Who sells the most seed potatoes abroad?",
    p: [
      "The Netherlands exported 922,273 tonnes of seed potatoes worth US$802.4 million in 2025, followed by France (275,531 tonnes, US$173.4 million) and Germany (120,842 tonnes, US$95.7 million). The United Kingdom, Belgium, Denmark, Canada, Egypt and the United States complete the top nine by value (World Bank WITS / UN Comtrade, 2025, HS 070110).",
      <>The full table is on the <Link href="/seed-field#trade" style={L}>seed potatoes</Link> hub; country detail is in the <Link href="/country/netherlands" style={L}>Netherlands profile</Link>.</>,
    ],
  },
];

export default function Page() {
  const jsonLd = refJsonLd({
    path: PATH,
    headline: "Certified seed potatoes: what they are and how to buy them",
    description: DESC,
    datePublished: UPDATED.iso,
    dateModified: UPDATED.iso,
    crumbs,
  });
  return (
    <RefPage
      path={PATH}
      kicker="Seed and field"
      h1="Certified seed potatoes: what they are and how to buy them"
      lede="Certified seed potatoes are seed tubers that an official authority has inspected in the field and in the store and found within the disease and purity limits of their grade. Buying certified seed is the main protection a grower has against viruses and blackleg arriving with the seed. This page explains what the label guarantees, the EU grades A and B, who exports certified seed, and how to buy seed potatoes from a certified source."
      updatedLabel={UPDATED.label}
      updatedISO={UPDATED.iso}
      crumbs={crumbs}
      sections={sections}
      jsonLd={jsonLd}
      sources={[
        { label: "Commission Implementing Directive 2014/20/EU (Union grades of basic and certified seed potatoes), EUR-Lex", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0020" },
        { label: "World Bank WITS / UN Comtrade, seed potato (HS 070110) exports by country, 2025", url: "https://wits.worldbank.org/trade/comtrade/en/country/ALL/year/2025/tradeflow/Exports/partner/WLD/product/070110" },
        { label: "DPIRD Western Australia, Certified Seed Potato Scheme production rules (SPP-1 Issue 8, Aug 2023)", url: "https://web-prd.dpird.wa.gov.au/siteassets/documents/forms/biosecurity/ddls/seed-testing-and-certification/certified-seed-potato-rules-spp-1-issue-8.pdf" },
        { label: "Potatopedia, common potato growing mistakes (seed checks)", url: "https://www.potatopedia.com/knowledge/common-potato-growing-mistakes" },
      ]}
      related={[
        { href: "/seed-field", title: "Seed potatoes", desc: "Classes, exporters, planting." },
        { href: "/answers/seed-potato-certification", title: "Seed potato certification", desc: "The process, step by step." },
        { href: "/knowledge/seed-potato-systems", title: "Seed potato systems", desc: "Country systems and trade." },
        { href: "/diseases/blackleg-soft-rot", title: "Blackleg and soft rot", desc: "A seed-borne disease." },
      ]}
    >
      <OpenSlot label="Sponsored" title="Featured seed house" text="One clearly labelled place on this page for a seed house or breeder. The neutral facts above never change and are never paid for." href="/advertise" />
      <section id="find-seed" aria-labelledby="find-seed-h" style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "20px 18px", margin: "28px 0", scrollMarginTop: 96 }}>
        <h2 id="find-seed-h" style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>Find certified seed</h2>
        <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.6, color: "var(--mute)" }}>Tell us what you want to plant, how much and when. We reply with certified sources for your country.</p>
        <LeadForm
          type="seed"
          submitLabel="Send my seed enquiry"
          messageLabel="Anything else? (delivery place, varieties you are considering)"
          extra={[
            { name: "variety", label: "Variety (or use: fries, chips, table)", placeholder: "e.g. Innovator" },
            { name: "quantity", label: "Quantity", placeholder: "e.g. 20 tonnes" },
            { name: "planting_month", label: "Planting month", options: MONTHS },
            { name: "seed_class", label: "Seed class", options: ["Certified (e.g. EU A or B)", "Basic (e.g. EU S, SE or E)", "Pre-basic or minitubers", "Not sure"] },
            { name: "role", label: "You are", options: ["Seed grower", "Ware grower", "Processor", "Importer / trader", "Research / NGO", "Home gardener", "Other"] },
          ]}
        />
      </section>
      <LatestNews newsletter="seed-potato-field" />
      <NewsletterSignup compact id="signup-cert" defaults={["seed-potato-field"]} title="Get Seed Potato & Field" intro="New varieties, certification and trade rules, disease and storage. Free, every other Thursday." />
    </RefPage>
  );
}
