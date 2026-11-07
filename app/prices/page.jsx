import RefPage, { Cards, refJsonLd, refMetadata } from "../../components/RefPage";
import { PRICE_PAGES, PRICES_UPDATED, PRICES_NOTICE } from "../../lib/reference/prices";

const TITLE = "Potato Prices: India, Europe, USA and Futures";
const DESC = "Reference pages on potato prices: India mandi prices, Europe free-buy and contract, USDA prices received and futures. Historical references, not live quotes.";
const PATH = "/prices";
export const metadata = refMetadata({ title: TITLE, description: DESC, path: PATH });

const crumbs = [{ name: "Home", href: "/" }, { name: "Prices", href: PATH }];

const sections = [
  {
    id: "how",
    h2: "How to read potato prices",
    p: [
      "A potato price is only meaningful with its level, unit, date and market. The level matters: farmgate is what the grower receives, wholesale is what a market or trader pays, and retail is what a shopper pays. The three move together slowly and apart quickly.",
      "Units differ by country. India quotes rupees per quintal (100 kg). The United States quotes dollars per hundredweight (45.36 kg). Europe quotes euros per 100 kg or per tonne.",
      "Contract and spot differ too. In Europe and the United States most processing potatoes are bought on contracts agreed before planting, so the headline spot price describes only the uncontracted remainder.",
    ],
  },
];

export default function Page() {
  const jsonLd = refJsonLd({
    path: PATH,
    headline: "Potato prices: India, Europe, USA and futures",
    description: DESC,
    datePublished: "2026-11-07",
    dateModified: PRICES_UPDATED.iso,
    crumbs,
  });
  return (
    <RefPage
      path={PATH}
      kicker="Reference"
      h1="Potato prices"
      lede="Four reference pages on how potato prices are set, published and read: India, Europe, the United States and the futures market. Each names the official source for live prices."
      updatedLabel={PRICES_UPDATED.label}
      updatedISO={PRICES_UPDATED.iso}
      crumbs={crumbs}
      notice={PRICES_NOTICE}
      sections={sections}
      jsonLd={jsonLd}
      sources={[
        { label: "FAOSTAT producer prices", url: "https://www.fao.org/faostat/en/#data/PP" },
        { label: "Agmarknet, Government of India", url: "https://agmarknet.gov.in/" },
        { label: "USDA NASS and ERS", url: "https://www.nass.usda.gov/" },
        { label: "Eurostat, EU potato sector", url: "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=The_EU_potato_sector_-_statistics_on_production%2C_prices_and_trade" },
      ]}
      related={[
        { href: "/answers/potato-market-price-today", title: "Potato market price today", desc: "Short answer." },
        { href: "/countries", title: "Countries", desc: "Production and trade by country." },
        { href: "/market", title: "Market", desc: "Problems growers pay to solve." },
      ]}
    >
      <Cards title="Price pages" items={PRICE_PAGES.map((p) => ({ href: `/prices/${p.slug}`, title: p.title, desc: p.short }))} />
    </RefPage>
  );
}
