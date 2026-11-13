import Link from "next/link";
import RefPage, { refJsonLd, refMetadata } from "@/components/RefPage";
import NewsletterSignup from "@/components/NewsletterSignup";
import { LatestNews } from "@/components/NewsUI";

// /processing/potato-chip-production — owns "potato chip production", "potato chips processing", "blanching chips"
// (keywords.csv, 13 Nov 2026). Hub of Potato Processing Weekly. Facts only from the site's processing guide
// (/knowledge/how-potatoes-are-processed) and the backend corpus files named in Sources, each with its primary source.
export const revalidate = 3600;

const PATH = "/processing/potato-chip-production";
const TITLE = "Potato Chip Production: How Chips Are Made, Step by Step";
const DESC = "Potato chip production step by step: chipping potatoes, slicing, washing and blanching, frying, colour sorting and the EU acrylamide rules, with primary sources.";
export const metadata = refMetadata({ title: TITLE, description: DESC, path: PATH });

const UPDATED = { iso: "2026-11-13", label: "13 November 2026" };
const crumbs = [
  { name: "Home", href: "/" },
  { name: "Potato processing", href: "/knowledge/how-potatoes-are-processed" },
  { name: "Potato chip production", href: PATH },
];
const L = { color: "var(--gold)", fontWeight: 600, textDecoration: "none" };

const sections = [
  {
    id: "what",
    h2: "What is potato chip production?",
    p: [
      "Potato chips are thin slices of potato fried until crisp. The product is called potato chips in North America and India and crisps in the UK and Ireland (FoodDrinkEurope acrylamide toolbox for potato crisps). The same factories also make chips from potato dough, which the EU acrylamide law treats as a separate product group from chips sliced from fresh potatoes (Commission Regulation (EU) 2017/2158).",
      <>Chips are one branch of the wider potato processing industry, next to frozen fries, flakes and starch; the <Link href="/knowledge/how-potatoes-are-processed" style={L}>potato processing guide</Link> covers all of them.</>,
    ],
  },
  {
    id: "raw-material",
    h2: "Which potatoes make good chips?",
    p: [
      "Chip makers want potatoes that are high in dry matter and low in reducing sugars. High dry matter means more chips per tonne of potatoes and less oil uptake; low sugars keep the colour light, because sugars brown in the fryer.",
      "A Guatemalan chipping-variety study by ICTA (with the IICA CRIA programme, USDA-funded) lists the targets used by industry and researchers: specific gravity above 1.085, reducing sugars below 0.2 mg per gram of fresh weight, and total solids above 20 percent (citing Martínez and Ligarreto 2006 and INCA 1989). ICTA's trials included Atlantic, Lamoka and Hodag.",
      <>The European industry toolbox adds: choose varieties with the lowest reducing sugars and asparagine for your region, set a maximum reducing-sugar content and a maximum share of bruised or damaged tubers for incoming loads, and test sugars during storage (FoodDrinkEurope). Chipping varieties profiled on Potatopedia include <Link href="/varieties/atlantic" style={L}>Atlantic</Link>, <Link href="/varieties/lady-rosetta" style={L}>Lady Rosetta</Link> and <Link href="/varieties/lamoka" style={L}>Lamoka</Link>.</>,
    ],
  },
  {
    id: "steps",
    h2: "How are potato chips made, step by step?",
    list: [
      "Intake and grading: loads are checked against the sugar and defect specification before they are accepted.",
      "Washing and peeling: soil and stones are removed and the potatoes are peeled.",
      "Slicing: high-speed rotary slicers cut slices about 1.2 to 1.7 mm thick (Potatopedia processing guide). Thicker cuts can raise acrylamide because they need more heat (FoodDrinkEurope).",
      "Slice washing or blanching: slices are washed to take off surface starch, and washed in warm or hot water to remove excess sugars (FoodDrinkEurope). See the next section.",
      "Frying: continuous fryers at about 160 to 180 °C for 2 to 3 minutes (Potatopedia processing guide). EU law asks makers to keep the oil temperature at the fryer exit as low as feasible; above 168 °C they must show acrylamide stays below the benchmark, and moisture after frying must not fall below 1.0 percent (Regulation (EU) 2017/2158).",
      "Colour sorting: in the EU, in-line colour sorting of chips after frying, manual or optical-electronic, is compulsory (Regulation (EU) 2017/2158).",
      "Seasoning and packing: flavour is added on a tumble drum and chips are packed in nitrogen-flushed bags to slow oxidation (Potatopedia processing guide).",
    ],
    p2: [
      "Kettle-cooked chips use a batch process at lower temperatures, which gives a thicker, harder bite (Potatopedia processing guide).",
    ],
  },
  {
    id: "blanching",
    h2: "Blanching chips: why slices are washed in hot water",
    p: [
      "Sugars on the surface of a slice brown first in the fryer and feed acrylamide formation. Washing slices in warm or hot water removes part of those sugars; the industry toolbox lists it as a process step for chip makers but gives no fixed temperature or time, because lines and potatoes differ (FoodDrinkEurope acrylamide toolbox for potato crisps).",
      "For French fries the EU law goes further: strips must be blanched to remove some reducing sugars from their outside, with the blanching regime adapted to the incoming potatoes (Regulation (EU) 2017/2158). Chip lines use the same idea at slice level.",
    ],
  },
  {
    id: "storage",
    h2: "Storage and cold sweetening",
    p: [
      "Potatoes stored cold turn starch into sugar, which darkens chips. The industry toolbox advises storing chipping potatoes above 6 °C with controlled humidity, suppressing sprouting in long-term storage and testing sugars during storage (FoodDrinkEurope).",
      "Breeding is attacking the same problem. In 2025 Argentina's INTA reported Piru INTA, a gene-edited Atlantic line with the vacuolar invertase gene knocked out; INTA says it can be stored at 4 °C for up to 120 days without the cold-induced sweetening that darkens chips (INTA, 13 Nov 2025).",
    ],
  },
  {
    id: "acrylamide",
    h2: "What are the acrylamide rules for chip makers?",
    p: [
      "Acrylamide forms above 120 °C when asparagine reacts with reducing sugars, both natural in potatoes; the amount depends on frying temperature, time and the potato's sugar and asparagine content (FoodDrinkEurope).",
      "In the EU, Regulation (EU) 2017/2158 (applying from 11 April 2018) sets a benchmark level of 750 µg/kg for potato crisps made from fresh potatoes or from potato dough. A benchmark is a performance indicator, not a legal maximum: when a maker's results are above it, the maker must review its mitigation measures.",
    ],
    table: {
      headers: ["Step", "What the EU rule or industry toolbox asks"],
      rows: [
        ["Raw material", "Low-sugar, low-asparagine varieties; sugar and defect limits on intake; sugar tests in storage"],
        ["Storage", "Above 6 °C with controlled humidity; sprout suppression for long storage"],
        ["Slices", "Warm or hot water wash to remove excess sugars; thinner cuts need less heat"],
        ["Fryer", "Exit oil temperature as low as feasible (data needed above 168 °C); moisture not below 1.0%"],
        ["After frying", "In-line colour sorting (compulsory in the EU)"],
        ["Check", "Monitor acrylamide against the 750 µg/kg benchmark and adjust"],
      ],
      note: "Sources: Commission Regulation (EU) 2017/2158, Annex I and IV; FoodDrinkEurope / ESA acrylamide toolbox for potato crisps.",
    },
  },
  {
    id: "trade",
    h2: "How much are potato chips worth in trade?",
    p: [
      "Chips travel less than frozen fries, but at a higher value per kilogram. In 2024 the United States exported US$362.7 million of HS 200520 non-frozen prepared potatoes, mainly chips, weighing about 104,974 tonnes; Canada took close to half the volume (World Bank WITS / UN Comtrade, 2024).",
      <>Worked out from the same table, that is about US$3.46 per kg, against about US$1.68 per kg for US frozen fry exports (HS 200410) in the same year. Fry export values by country are on <Link href="/prices/frozen-fries" style={L}>frozen french fry prices</Link>.</>,
    ],
  },
];

export default function Page() {
  const jsonLd = refJsonLd({
    path: PATH,
    headline: "Potato chip production: how potato chips are made",
    description: DESC,
    datePublished: UPDATED.iso,
    dateModified: UPDATED.iso,
    crumbs,
  });
  return (
    <RefPage
      path={PATH}
      kicker="Processing"
      h1="Potato chip production: how potato chips are made"
      lede="Potato chip production turns raw potatoes into thin, fried slices on a continuous line: the potatoes are graded, washed, peeled, sliced, washed again, fried, colour-sorted, seasoned and packed. Three things decide the quality of the chip: the potato, the slice wash and the fryer. Together they set the colour, the oil content and the acrylamide level. This page walks through each step with its primary source."
      updatedLabel={UPDATED.label}
      updatedISO={UPDATED.iso}
      crumbs={crumbs}
      sections={sections}
      jsonLd={jsonLd}
      sources={[
        { label: "Commission Regulation (EU) 2017/2158 (acrylamide benchmark levels and mitigation), EUR-Lex", url: "https://eur-lex.europa.eu/eli/reg/2017/2158/oj" },
        { label: "FoodDrinkEurope / ESA, acrylamide toolbox for fried potato crisps (hosted by the European Commission)", url: "https://food.ec.europa.eu/document/download/25b7f944-6a26-43a2-a5dd-4c5ab4bfeef4_en?filename=cs_contaminants_catalogue_acrylamide_crisps-final_en.pdf" },
        { label: "ICTA / CRIA, chipping potato variety trials, Guatemala (final report)", note: "specific gravity, sugar and solids targets; Atlantic, Lamoka, Hodag" },
        { label: "INTA, \"El INTA desarrolla una nueva papa ideal para chips\" (13 Nov 2025)", url: "https://www.argentina.gob.ar/node/484896" },
        { label: "World Bank WITS / UN Comtrade, US exports of HS 200520 by partner, 2024", url: "https://wits.worldbank.org/trade/comtrade/en/country/USA/year/2024/tradeflow/Exports/partner/ALL/product/200520" },
        { label: "Potatopedia, How potatoes are processed (slice thickness, frying time, packing)", url: "https://www.potatopedia.com/knowledge/how-potatoes-are-processed" },
      ]}
      related={[
        { href: "/knowledge/how-potatoes-are-processed", title: "Potato processing", desc: "Fries, chips, starch and flakes." },
        { href: "/knowledge/unhealthiest-potato-chips", title: "Chip nutrition", desc: "How chips compare." },
        { href: "/varieties/atlantic", title: "Atlantic", desc: "The classic chipping variety." },
        { href: "/prices/frozen-fries", title: "Frozen fry export prices", desc: "Value per kg by exporter." },
      ]}
    >
      <LatestNews newsletter="potato-processing-weekly" />
      <NewsletterSignup compact id="signup-chips" title="Get Potato Processing Weekly" intro="Plants, capacity and technology in fries, chips, flakes and starch. Free, every Tuesday." />
    </RefPage>
  );
}
