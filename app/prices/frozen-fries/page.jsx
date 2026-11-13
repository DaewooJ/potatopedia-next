import Link from "next/link";
import RefPage, { refJsonLd, refMetadata } from "@/components/RefPage";
import NewsletterSignup from "@/components/NewsletterSignup";
import { LatestNews } from "@/components/NewsUI";

// /prices/frozen-fries — owns "price of frozen french fries" and "mccain fries price" (keywords.csv, 13 Nov 2026).
// Export trade data only (World Bank WITS / UN Comtrade, HS 200410), no retail shelf prices. Unit values (US$ per kg)
// are shown ONLY where a backend corpus file states them (belgium/netherlands/usa/poland/egypt exports, japan/brazil
// imports, 2024); every other row shows value and quantity only. Never compute or invent a figure here.
export const revalidate = 3600;

const PATH = "/prices/frozen-fries";
const TITLE = "Price of Frozen French Fries: Export Values by Country";
const DESC = "The price of frozen french fries in world trade: export values, volumes and US$ per kg by country from UN Comtrade (HS 200410), 2024 and 2025. No retail prices.";
export const metadata = refMetadata({ title: TITLE, description: DESC, path: PATH });

const UPDATED = { iso: "2026-11-13", label: "13 November 2026" };
const crumbs = [
  { name: "Home", href: "/" },
  { name: "Prices", href: "/prices" },
  { name: "Frozen french fries", href: PATH },
];
const L = { color: "var(--gold)", fontWeight: 600, textDecoration: "none" };

const sections = [
  {
    id: "what",
    h2: "What is the price of frozen french fries in trade?",
    p: [
      "The closest published measure of a wholesale fry price is the export unit value: the value a country declares for its frozen potato exports divided by their weight. In 2024 it was about US$1.35 per kg for Belgium, the largest exporter, US$1.51 for the Netherlands and US$1.68 for the United States (calculated in our source files from World Bank WITS / UN Comtrade data, HS 200410).",
      "HS 200410 covers frozen prepared potatoes. In trade it is mostly French fries, plus wedges, hash browns and specialty products, so a unit value is an average over a country's product mix and buyers, not a list price (World Bank WITS / UN Comtrade).",
    ],
  },
  {
    id: "exporters",
    h2: "Export values by country, 2024",
    table: {
      headers: ["Exporter", "Value (US$ million)", "Quantity (tonnes)", "US$ per kg"],
      rows: [
        ["Belgium", "3,708.5", "2,752,580", "about 1.35"],
        ["Netherlands", "2,706.7", "1,798,230", "about 1.51"],
        ["Canada", "2,065.9", "1,446,130", "–"],
        ["United States", "1,542.4", "916,316", "about 1.68"],
        ["France", "880.6", "635,167", "–"],
        ["Germany", "469.2", "316,712", "–"],
        ["Poland", "310.3", "221,452", "about 1.40"],
        ["Argentina", "294.5", "186,692", "–"],
        ["China", "260.1", "206,138", "–"],
        ["Egypt", "210.3", "150,364", "about 1.40 *"],
        ["India", "203.0", "172,414", "–"],
      ],
      note: "Source: World Bank WITS / UN Comtrade, HS 200410 exports to the world, 2024. US$ per kg as calculated in our country source files from the same tables; \"–\" where no source file gives one. * Egypt reports almost the same value per kg for every market, which suggests its quantities are estimated from values; treat the Egyptian kilogram figures as approximate.",
    },
  },
  {
    id: "2025",
    h2: "What changed in 2025?",
    p: [
      "Belgium stayed first but exported less: US$3.32 billion and 2.54 million tonnes in 2025, against US$3.71 billion and 2.75 million tonnes in 2024. The Netherlands held its volume (1.80 million tonnes) with value slightly lower at US$2.69 billion. Canada (US$1.90 billion) and the United States (US$1.45 billion) both exported less by value (World Bank WITS / UN Comtrade, 2024 and 2025).",
      "The fastest growth came from France, China, India and Egypt. France rose above US$1 billion (US$1.06 billion, 776,924 tonnes), China more than doubled its export value between 2023 and 2025 to US$414.7 million (387,841 tonnes), and India (US$279.0 million) and Egypt (US$250.4 million) rose in each of the three years (World Bank WITS / UN Comtrade, 2023 to 2025).",
    ],
  },
  {
    id: "destinations",
    h2: "Why the same fries sell at different prices by market",
    p: [
      "Unit values differ by destination. Belgian product sent to the Netherlands left at about US$1.08 per kg and to France at about US$1.28, while product sent to the United States (about US$1.53), the United Kingdom (about US$1.58) and Japan (about US$1.60) left at more. US exports to Canada averaged about US$1.36 per kg, against about US$1.66 to Japan and US$1.80 to Malaysia (calculated from World Bank WITS / UN Comtrade, 2024). The source gives no product detail, so the gap can reflect product mix (coated or specialty cuts, retail or foodservice packs) as much as price.",
      "Importers see the same spread. Japan paid on average about US$1.79 per kg in 2024: about US$1.34 for Indian product, US$1.52 for Chinese, US$1.72 for Belgian, US$1.86 for US and US$1.90 for Canadian. Brazil paid about US$1.44 on average: about US$1.05 for Chinese product, US$1.23 for Belgian and US$1.67 for Argentine (calculated from World Bank WITS / UN Comtrade, 2024).",
    ],
  },
  {
    id: "retail",
    h2: "What about the McCain fries price in shops?",
    p: [
      "Shelf prices for branded fries, McCain or any other brand, depend on the country, the retailer, the pack and the week's promotion, and there is no official international series for them. Potatopedia therefore does not list retail fry prices. For buyers and sellers in the trade, the export and import unit values above are the published reference; contract prices between processors and their customers are private.",
      <>Who makes the fries: McCain, Lamb Weston, Simplot, Aviko, Clarebout and others are covered in <Link href="/knowledge/how-potatoes-are-processed" style={L}>how potatoes are processed</Link>.</>,
    ],
  },
  {
    id: "method",
    h2: "How Potato Prices & Trade will track fry prices",
    list: [
      "Export and import values and volumes for HS 200410 by country, as UN Comtrade and Eurostat publish new months and years.",
      "Unit values (US$ per kg) by exporter and by destination, always with the source table and its date.",
      "Free-buy and contract potato prices in the main processing regions, from official and market sources.",
      "Crop estimates, freight and currency moves that change what processors pay for raw potatoes.",
    ],
    p2: ["No retail shelf prices, and no figure without its source link."],
  },
];

export default function Page() {
  const jsonLd = refJsonLd({
    path: PATH,
    headline: "Price of frozen french fries: export values by country",
    description: DESC,
    datePublished: UPDATED.iso,
    dateModified: UPDATED.iso,
    crumbs,
    dataset: {
      name: "Frozen french fry (HS 200410) exports by country, 2024 and 2025",
      description: "Export value (US$), quantity (tonnes) and, where our source files give one, US$ per kg, for the largest exporters of frozen prepared potatoes, from World Bank WITS / UN Comtrade.",
      temporalCoverage: "2023/2025",
      spatialCoverage: "World",
      isBasedOn: ["https://wits.worldbank.org/trade/comtrade/en/country/ALL/year/2024/tradeflow/Exports/partner/WLD/product/200410", "https://wits.worldbank.org/trade/comtrade/en/country/ALL/year/2025/tradeflow/Exports/partner/WLD/product/200410"],
      keywords: ["price of frozen french fries", "frozen fries export price", "HS 200410", "UN Comtrade"],
    },
  });
  return (
    <RefPage
      path={PATH}
      kicker="Prices · Frozen fries"
      h1="Price of frozen french fries: what exporters get per kilogram"
      lede="The price of frozen french fries in world trade is best read from export unit values: what a country's frozen fry exports were worth per kilogram. In 2024 Belgium, the largest exporter, averaged about US$1.35 per kg, the Netherlands about US$1.51 and the United States about US$1.68 (World Bank WITS / UN Comtrade). These are trade averages, not shop prices: a McCain fries price on the shelf is set by each retailer and is not listed here."
      updatedLabel={UPDATED.label}
      updatedISO={UPDATED.iso}
      crumbs={crumbs}
      notice="Historical trade data, not live quotes or trading advice. Unit values are averages over each country's product mix."
      sections={sections}
      jsonLd={jsonLd}
      sources={[
        { label: "World Bank WITS / UN Comtrade, HS 200410 exports by country, 2024", url: "https://wits.worldbank.org/trade/comtrade/en/country/ALL/year/2024/tradeflow/Exports/partner/WLD/product/200410" },
        { label: "World Bank WITS / UN Comtrade, HS 200410 exports by country, 2025", url: "https://wits.worldbank.org/trade/comtrade/en/country/ALL/year/2025/tradeflow/Exports/partner/WLD/product/200410" },
        { label: "World Bank WITS / UN Comtrade, Belgium HS 200410 exports by partner, 2024", url: "https://wits.worldbank.org/trade/comtrade/en/country/BEL/year/2024/tradeflow/Exports/partner/ALL/product/200410" },
        { label: "World Bank WITS / UN Comtrade, United States HS 200410 exports by partner, 2024", url: "https://wits.worldbank.org/trade/comtrade/en/country/USA/year/2024/tradeflow/Exports/partner/ALL/product/200410" },
        { label: "World Bank WITS / UN Comtrade, Japan HS 200410 imports by partner, 2024", url: "https://wits.worldbank.org/trade/comtrade/en/country/JPN/year/2024/tradeflow/Imports/partner/ALL/product/200410" },
        { label: "World Bank WITS / UN Comtrade, Brazil HS 200410 imports by partner, 2024", url: "https://wits.worldbank.org/trade/comtrade/en/country/BRA/year/2024/tradeflow/Imports/partner/ALL/product/200410" },
      ]}
      related={[
        { href: "/prices", title: "Potato prices", desc: "Europe, USA, futures and how to read them." },
        { href: "/prices/europe", title: "Europe potato prices", desc: "Free-buy and contract." },
        { href: "/country/belgium", title: "Belgium", desc: "The largest fry exporter." },
        { href: "/processing/potato-chip-production", title: "Potato chip production", desc: "How chips are made." },
      ]}
    >
      <LatestNews newsletter="potato-prices-trade" dated />
      <NewsletterSignup compact id="signup-fries" defaults={["potato-prices-trade"]} title="Get Potato Prices & Trade" intro="Prices by market, fry and flake export flows, crop estimates. Free, first Monday of the month." />
    </RefPage>
  );
}
