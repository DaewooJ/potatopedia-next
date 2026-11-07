import { INDIA_POTATO } from "../facts";

// Price reference pages. Every figure is attributed in its sentence, with its year. These are historical references,
// not live quotes: the pages say so and point to the live official tools. Figures come from the vetted backend corpus
// (USDA NASS/ERS, FAOSTAT, Eurostat, ICAR-CPRI and state agriculture records) plus the EEX and NEPG pages named in Sources.

export const PRICES_UPDATED = { iso: "2026-11-07", label: "7 November 2026" };

export const PRICES_NOTICE =
  "Historical references only. Nothing on these pages is a live quote or trading advice. Each page names the official source where current prices are published.";

export const PRICE_PAGES = [
  { slug: "india", title: "India potato prices", short: "Agmarknet mandi prices: how to read them, the seasonal pattern and reference points by year." },
  { slug: "europe", title: "Europe potato prices", short: "NEPG free-buy and contract pricing explained, with Eurostat and FAOSTAT price history." },
  { slug: "usa", title: "USA potato prices", short: "USDA NASS prices received, fresh against processing, 2015 to 2024 and the 2025/26 outlook." },
  { slug: "futures", title: "Potato futures", short: "The EEX processing potato future, its delisting in June 2026 and the 1976 Maine default." },
];

const CWT_NOTE = "1 US hundredweight (cwt) is 100 lb, or 45.36 kg. To convert dollars per cwt to dollars per tonne, multiply by 22.05.";

export const PRICES = {
  india: {
    path: "/prices/india",
    metaTitle: "India Potato Prices: Agmarknet Guide, History",
    metaDescription: "How to read Agmarknet mandi potato prices in rupees per quintal, the harvest-to-storage seasonal pattern, and reference points by year. Historical, not live.",
    h1: "India potato prices: how to read Agmarknet, and what the record shows",
    kicker: "Prices · India",
    lede: `India grew ${INDIA_POTATO.value} million tonnes of potatoes in ${INDIA_POTATO.year} (${INDIA_POTATO.label}, ${INDIA_POTATO.publisher}). Its mandi prices are reported daily on the government's Agmarknet portal. This page explains the price rows and the yearly rhythm, and lists dated reference points. For today's price, use Agmarknet itself.`,
    dataset: {
      name: "India potato price reference points, 2010 to 2024-25",
      description: "FAOSTAT producer price index for India and dated state-level reference points, compiled from FAOSTAT, state agriculture records and ICAR-CPRI.",
      temporalCoverage: "2010/2025",
      spatialCoverage: "India",
      isBasedOn: ["https://www.fao.org/faostat/en/#data/PP", "https://agmarknet.gov.in/"],
      keywords: ["potato prices India", "Agmarknet", "mandi price", "producer price index"],
    },
    sections: [
      {
        id: "agmarknet",
        h2: "What Agmarknet shows",
        p: [
          "Agmarknet (agmarknet.gov.in) is the Government of India's agricultural marketing information portal, run under the Ministry of Agriculture & Farmers Welfare. Mandi (wholesale market) officials report the day's trade for each commodity, and the portal publishes it by state, district, market and variety.",
          "A potato row normally carries a minimum price, a maximum price and a modal price, all in rupees per quintal, together with the day's arrivals. One quintal is 100 kg, so Rs 1,000 per quintal is Rs 10 per kg.",
        ],
        list: [
          "Modal price: the price at which most of the day's trade took place. It is the figure most people quote, and it is more stable than the maximum.",
          "Minimum to maximum spread: a wide spread on one day usually means mixed grades or varieties are being traded together.",
          "Arrivals: a price on very small arrivals says little. Read price and arrivals together.",
          "Variety and grade: a Kufri Pukhraj row and a cold-store Kufri Jyoti row are different goods. Compare like with like.",
          "What the price is not: a mandi price is a wholesale price. It is not the farmgate price (after commission, loading and transport) and not the retail price.",
        ],
      },
      {
        id: "season",
        h2: "The seasonal pattern",
        p: [
          "Most of India's potato crop is the rabi crop of the Indo-Gangetic plains, planted in October and November and dug in February and March. Arrivals peak at harvest and prices are at their weakest then, so growers and traders put the bulk of the crop into cold storage and sell through the following months.",
          "The Uttar Pradesh state profile (ICAR-CPRI, UP agricultural extension and field reports) records the scale of this. Only 15 to 20 percent of the crop is normally sold at harvest in February and March, and in a normal year 80 to 85 percent of the crop goes into cold stores.",
        ],
        callout:
          "2024-25 shows the risk of storing for a price rise. UP growers reported putting about 99 percent of the crop into cold stores against the usual 80 to 85 percent. Cold-store rent was Rs 110 per bag, and sales at Rs 125 to 225 per bag went entirely to pay cold-store owners (Potatoes in Uttar Pradesh profile; ICAR-CPRI and field reports, 2024-25 season).",
        p2: [
          "West Bengal, which processes under 5 percent of its potatoes and sells mainly fresh, shows the same pressure from the other side: a record crop of about 150 lakh tonnes in 2024-25 outran storage and demand, and state governments have at times banned potato movement to hold down local prices (West Bengal Agriculture Department market data, as compiled in Potatopedia's state profile).",
        ],
      },
      {
        id: "reference",
        h2: "Reference points by year",
        p: [
          "Potatopedia does not republish the Agmarknet daily series, which changes every day and by market. The table gives two kinds of dated reference: the FAOSTAT producer price index for India (an annual, national measure) and individual state-level price records from the profiles.",
        ],
        table: {
          headers: ["Year", "Reference point", "Source"],
          rows: [
            ["2010", "Producer price index 77.1 (2014-16 = 100)", "FAOSTAT producer prices"],
            ["2015", "Producer price index 100.4", "FAOSTAT producer prices"],
            ["2020", "Producer price index 118.7", "FAOSTAT producer prices"],
            ["2022", "Producer price index 138.4", "FAOSTAT producer prices"],
            ["2024", "Producer price index 154.2, about double the 2010 level", "FAOSTAT producer prices"],
            ["2024-25", "West Bengal, Kufri Pukhraj at about Rs 540 per quintal (Rs 5.4 per kg) against input costs above Rs 3,000 per bigha", "West Bengal Agriculture Department market data"],
            ["2024-25", "Uttar Pradesh, farmgate as low as Rs 4 per kg against a break-even near Rs 5 per kg", "UP profile; ICAR-CPRI and field reports"],
          ],
          note: "FAOSTAT's index is an annual national average and moves differently from daily mandi prices. State records are single-market observations, not national averages.",
        },
        p2: [
          "On contract prices, a published agricultural-economics comparison found that growers under contract farming received Rs 390 per quintal against Rs 177 for non-contract growers in the study it covered, with net return over operational cost more than five times higher on the contract farms (Rs 62,982 against Rs 11,882 per hectare). The study is specific to its place and period, so read it as direction, not as a rule.",
        ],
      },
      {
        id: "use",
        h2: "Checking today's price",
        list: [
          "Open agmarknet.gov.in and choose the commodity group Vegetables, then Potato.",
          "Select the state, district and market, then the date range.",
          "Read the modal price with the arrivals column, and note the variety.",
          "For several markets at once, use the open-data version of the mandi series published on data.gov.in.",
        ],
        p2: ["The portal's layout changes from time to time. If a step above no longer matches, the commodity, state and market selectors remain the way in."],
      },
    ],
    sources: [
      { label: "Agmarknet, Government of India", url: "https://agmarknet.gov.in/", note: "live mandi prices" },
      { label: "FAOSTAT, producer prices (potatoes), India, 2010 to 2024", url: "https://www.fao.org/faostat/en/#data/PP" },
      { label: "Ministry of Agriculture & Farmers Welfare, 3rd Advance Estimates 2024-25", note: "58.1 million tonnes" },
      { label: "ICAR-CPRI, UP state agricultural extension and field reports", note: "2024-25 season, Uttar Pradesh" },
      { label: "West Bengal Agriculture Department, market data", note: "2024-25" },
    ],
    related: [
      { href: "/country/india", title: "India potato industry", desc: "Production, states, varieties and cold storage." },
      { href: "/answers/potato-market-price-today", title: "Potato market price today", desc: "Where to find current prices." },
      { href: "/prices/europe", title: "Europe potato prices", desc: "Free-buy and contract pricing." },
      { href: "/varieties/kufri-jyoti", title: "Kufri Jyoti", desc: "A long-running Indian commercial variety." },
    ],
  },

  europe: {
    path: "/prices/europe",
    metaTitle: "Europe Potato Prices: Free-Buy vs Contract",
    metaDescription: "How free-buy and contract potato prices work in north-west Europe, who publishes them, and Eurostat and FAOSTAT price history. Historical, not live.",
    h1: "Europe potato prices: free-buy, contract and who publishes what",
    kicker: "Prices · Europe",
    lede: "Processing potatoes in north-west Europe are bought on two tracks. Most volume is contracted before planting at a fixed price, and a smaller uncontracted volume, the free-buy market, sets the headline quotations. This page explains both and gives dated Eurostat and FAOSTAT reference points.",
    dataset: {
      name: "European potato price reference points, 2015 to 2024",
      description: "Eurostat producer and consumer price indices and FAOSTAT producer prices for Germany, compiled from Eurostat and FAOSTAT.",
      temporalCoverage: "2015/2024",
      spatialCoverage: "European Union",
      isBasedOn: ["https://ec.europa.eu/eurostat/statistics-explained/index.php?title=The_EU_potato_sector_-_statistics_on_production%2C_prices_and_trade", "https://www.fao.org/faostat/en/#data/PP"],
      keywords: ["potato prices Europe", "free buy", "contract price", "NEPG", "Eurostat"],
    },
    sections: [
      {
        id: "two-tracks",
        h2: "Free-buy and contract: two markets",
        p: [
          "A contract potato is sold under an agreement made before planting: variety, quality specification, volume and price per tonne are fixed, often with a quality adjustment at delivery. Processors prefer this because they need narrow specifications (dry matter above 20 percent and reducing sugars below 0.1 percent are common), and growers accept it because it protects them from price swings (Potatopedia contract-pricing mechanics, drawing on USDA ERS and academic literature).",
          "A free-buy potato is one that is not under contract. It is sold on the spot market, usually for processing or export, and the price is quoted in euros per 100 kg. Because contracted volumes are large and free-buy volumes are small, the free-buy quotation reflects a thin market. A move of a few euros can come from a few lots, and growers with contracts are not paid it.",
          "The practical reading: a high free-buy quotation shows that processors are short of potatoes beyond their contracts. It does not mean contract growers are earning that price.",
        ],
      },
      {
        id: "nepg",
        h2: "Who publishes the signals",
        p: [
          "The North-West European Potato Growers group (NEPG) is a permanent forum for the main consumption-potato producing countries. Its members are REKA (Germany), UNPT (France), VTA (Netherlands) and Fiwap, FWA, ABS and PCA (Belgium). It meets about five to six times a year to exchange information on planted area, yields, quality, market developments, cultivation contracts including prices and conditions, stocks and production costs, and it issues a press release after most meetings (Fiwap, NEPG page).",
          "NEPG's releases are the best single place to read the growers' view of the season. The quotations themselves are published by regional trade bodies and exchanges, so check the date and the market named on any quotation you see quoted.",
        ],
      },
      {
        id: "eurostat",
        h2: "Reference points: Eurostat and FAOSTAT",
        p: [
          "Eurostat's potato sector statistics (August 2025) show how far prices moved in the years after 2020. The EU producer price index for potatoes (2015 = 100) reached about 210 by 2023, more than double its 2015 level, and the consumer price index reached about 165. Both rose strongly from 2020. Eurostat attributes the year-to-year swings to weather-driven production, and notes that producer prices do not pass straight through to consumers: in 2023 Belgium and Austria both had producer prices below 2022 while consumer prices were higher.",
          "The EU harvested 48.3 million tonnes in 2023, 36.7 percent below the 76.6 million tonnes of 2000, and the crop was valued at EUR 19.4 billion (Eurostat, 2023 data). Germany, the largest producer, harvested 11.6 million tonnes.",
        ],
        table: {
          headers: ["Year", "Germany, producer price (USD per tonne)", "Producer price index (2014-16 = 100)"],
          rows: [
            ["2015", "142", "79.7"],
            ["2019", "317", "176.3"],
            ["2021", "158.7", "83.5"],
            ["2022", "245.1", "144.9"],
            ["2023", "350.2", "201.6"],
            ["2024", "341.8", "196.7"],
          ],
          note: "Source: FAOSTAT producer prices, Germany. FAOSTAT annual prices cover all potato utilisation and are not the same measure as a weekly free-buy or contract quotation. Dollar values also move with the exchange rate.",
        },
      },
      {
        id: "recent",
        h2: "Recent seasons in brief",
        p: [
          "Two points from the record. First, the 2022 to 2024 price level was well above the 2015 to 2020 level in both the Eurostat and FAOSTAT series, which Eurostat ties to weather-driven falls in production. Second, producer and consumer prices can move apart: in 2023 Belgium and Austria had lower producer prices than in 2022 while consumer prices were higher (Eurostat, 2023 data).",
          "Potatopedia does not reproduce weekly quotation tables, because they date within days. For the current season, read the latest NEPG statement through its member organisations listed above.",
        ],
      },
    ],
    sources: [
      { label: "Eurostat, The EU potato sector: statistics on production, prices and trade (August 2025)", url: "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=The_EU_potato_sector_-_statistics_on_production%2C_prices_and_trade" },
      { label: "FAOSTAT, producer prices (potatoes), Germany, 2010 to 2024", url: "https://www.fao.org/faostat/en/#data/PP" },
      { label: "Fiwap, NEPG (North-West European Potato Growers) page", url: "https://fiwap.be/nepg/" },
      { label: "USDA ERS, Vegetables and Pulses Outlook (contract versus fresh price behaviour)", url: "https://ers.usda.gov/publications/pub-details?pubid=113611" },
    ],
    related: [
      { href: "/answers/europe-potato-trade", title: "Europe potato trade", desc: "Who exports what within Europe." },
      { href: "/country/netherlands", title: "Netherlands", desc: "Seed and processing hub." },
      { href: "/country/belgium", title: "Belgium", desc: "World's largest frozen-fry exporter." },
      { href: "/prices/futures", title: "Potato futures", desc: "The EEX contract, delisted in June 2026." },
    ],
  },

  usa: {
    path: "/prices/usa",
    metaTitle: "USA Potato Prices: Fresh vs Processing",
    metaDescription: "USDA NASS prices received for US potatoes 2015 to 2024 in dollars per cwt, the fresh versus processing split and the 2025/26 outlook. Historical, not live.",
    h1: "USA potato prices: what growers received, fresh and processing",
    kicker: "Prices · United States",
    lede: "USDA's National Agricultural Statistics Service publishes the price US growers received for potatoes, in dollars per hundredweight. The all-potato average was $11.70 per cwt for the 2024 crop. Fresh and processing potatoes behave very differently, and this page shows how.",
    dataset: {
      name: "US potato prices received by growers, 2015 to 2024",
      description: "USDA NASS season-average price received for all US potatoes in dollars per cwt, with USDA ERS fresh and processing price commentary.",
      temporalCoverage: "2015/2025",
      spatialCoverage: "United States",
      isBasedOn: ["https://www.nass.usda.gov/Publications/Todays_Reports/", "https://ers.usda.gov/publications/pub-details?pubid=113611"],
      keywords: ["potato prices USA", "NASS prices received", "cwt", "fresh potato price", "processing potato price"],
    },
    sections: [
      {
        id: "what",
        h2: "What NASS 'prices received' measures",
        p: [
          "NASS surveys what growers received at the first point of sale, so the figure is a farm-level price, not a retail or shipping-point price. The annual Potatoes Summary reports a season-average price for all potatoes, and USDA's Economic Research Service (ERS) separates fresh from processing in its Vegetables and Pulses Outlook.",
          CWT_NOTE,
        ],
      },
      {
        id: "series",
        h2: "All-potato price, 2015 to 2024",
        table: {
          headers: ["Crop year", "Price ($ per cwt)", "About $ per tonne", "Production (million cwt)"],
          rows: [
            ["2015", "8.28", "183", "409.3"],
            ["2016", "8.46", "187", "412.7"],
            ["2017", "8.28", "183", "406.8"],
            ["2018", "8.48", "187", "414.5"],
            ["2019", "9.93", "219", "423.2"],
            ["2020", "9.30", "205", "419.8"],
            ["2021", "10.20", "225", "412.6"],
            ["2022", "12.90", "284", "402.1"],
            ["2023", "12.30", "271", "440.1"],
            ["2024", "11.70", "258", "417.8 (421 in the NASS summary)"],
          ],
          note: "Source: USDA NASS, Statistics Canada, SIAP North American Potatoes joint report (December 2024) for 2015 to 2023; USDA NASS Potatoes 2024 Summary (September 2025) for the 2024 price. Tonne conversion by Potatopedia. The 2024 production figure was revised between the two publications.",
        },
        p2: [
          `The 2024 crop was worth $4.60 billion, down 8 percent on 2023 (USDA NASS, Potatoes 2024 Summary). Processing took 269 million cwt of the 390 million cwt sold, about 69 percent.`,
        ],
      },
      {
        id: "fresh-vs-processing",
        h2: "Fresh against processing",
        p: [
          "USDA ERS (Vegetables and Pulses Outlook, December 2025) reports that the 2024/25 US season-average potato price was $11.70 per cwt. Within it, the fresh price fell 12 percent from 2023/24 and 37 percent from 2022/23, while the processing price was $11.00 per cwt, 2 percent below 2023/24 and 9 percent above 2022/23.",
          "ERS explains the gap directly: the fresh price is sensitive to changes in production, while the processing price is less volatile because of grower-processor contracts signed before spring planting.",
        ],
        callout:
          "Monthly NASS fresh grower prices stayed below $13 per cwt for 26 consecutive months from September 2023 to October 2025, against a monthly range of $18.50 to $25.90 per cwt in 2022/23 (USDA ERS, December 2025).",
        p2: [
          "For 2025/26, ERS reported month-on-month declines in September and October, early-season fresh prices below the year before, and industry reports of reduced processor contract acreage alongside lower contract prices. ERS expected ample Idaho Russet supplies to keep pressure on fresh grower and retail prices into 2026. These are outlook statements dated December 2025, not a forecast from Potatopedia.",
        ],
      },
      {
        id: "where",
        h2: "Where to read the current figures",
        list: [
          "NASS Agricultural Prices (monthly) for prices received by growers.",
          "NASS Potatoes Summary (annual, September) for the season-average price and value.",
          "USDA AMS Market News for shipping-point and terminal-market fresh potato prices.",
          "USDA ERS Vegetables and Pulses Outlook for interpretation.",
        ],
      },
    ],
    sources: [
      { label: "USDA NASS, Potatoes 2024 Summary (September 2025)", url: "https://www.nass.usda.gov/Publications/Todays_Reports/" },
      { label: "USDA NASS, Statistics Canada, SIAP, North American Potatoes (December 2024)" },
      { label: "USDA ERS, Vegetables and Pulses Outlook VGS-377 (18 December 2025)", url: "https://ers.usda.gov/publications/pub-details?pubid=113611" },
      { label: "USDA AMS Market News", url: "https://www.ams.usda.gov/market-news" },
    ],
    related: [
      { href: "/country/united-states", title: "United States", desc: "Idaho, Washington and the processing base." },
      { href: "/answers/us-potato-exports", title: "US potato exports", desc: "Fresh and frozen export flows." },
      { href: "/varieties/russet-burbank", title: "Russet Burbank", desc: "The standard US processing variety." },
      { href: "/prices/futures", title: "Potato futures", desc: "Why US potato futures faded after 1976." },
    ],
  },

  futures: {
    path: "/prices/futures",
    metaTitle: "Potato Futures: EEX Contract, 1976 Default",
    metaDescription: "How the EEX European processing potato future worked, why it was delisted on 5 June 2026, and the 1976 Maine default that ended US potato futures.",
    h1: "Potato futures: how the EEX contract worked, and why it closed",
    kicker: "Prices · Futures",
    lede: "Potato futures have never become a deep market. EEX's European Processing Potato Future was the last liquid contract, and EEX delisted it on 5 June 2026. This page explains how it worked and traces the history, from the 1976 Maine default to India's 2014 discontinuation.",
    dataset: null,
    sections: [
      {
        id: "eex",
        h2: "The EEX European Processing Potato Future",
        p: [
          "The contract (product code FAPP) was cash-settled against the EEX European Processing Potato Index. EEX's specification gives a contract size of 25 metric tonnes, a quotation in euros per 100 kg, a minimum price change of EUR 0.10 per 100 kg, and delivery months in an April, June and November cycle. Nothing was delivered. At expiry the holder received or paid the difference between the final settlement price and the previous day's settlement price (EEX contract specification, page last updated July 2023).",
          "In practice it let a processor or trader hedge, or take a view on, the price of uncontracted processing potatoes in north-west Europe, the market described on the Europe prices page.",
        ],
      },
      {
        id: "delisting",
        h2: "Delisting, 2026",
        p: [
          "EEX's customer notice of 13 March 2026 states that the European Processing Potato Future (FAPP) was delisted on 5 June 2026. The last tradeable contract was June 2026, with its last trading day on 4 June 2026. Trading in contracts beyond June 2026 stopped from 16 March, and the EEX European Processing Potato Index was published for the last time on 4 June 2026.",
          "The notice does not give a reason. The Potatopedia corpus records that the decision followed a sustained fall in trading activity. A successor contract has not been announced in the sources reviewed.",
        ],
      },
      {
        id: "us",
        h2: "United States: from the 1936 Act to the 1976 default",
        p: [
          "Irish (white) potatoes were covered by the US Commodity Exchange Act when it was enacted in 1936, giving them a legal basis for regulated futures trading. Onions were not so lucky: after a 1955 manipulation scheme in Chicago, in which traders Sam Siegel and Vincent Kosuga accumulated an estimated 99.3 percent of the available supply and then drove the price from $2.75 a bag to 10 cents by March 1956, Congress banned onion futures outright in 1958, and the ban still stands. A 1964 Senate bill sponsored by Edmund Muskie of Maine proposed the same for potatoes. It did not become law.",
          "The New York Mercantile Exchange built its potato contract around Maine potatoes, but by the 1970s Idaho, with processors such as J.R. Simplot supplying fast-food French fries, had taken the lead in the national crop. In what became known as the Maine Potato War of 1976, contracts for an unprecedented 50 million pounds of Maine potatoes defaulted on 7 May 1976, the largest potato-futures default in NYMEX history to that point. NYMEX set an arbitrary settlement price of $10.60 to resolve the contracts. Confidence in the Maine contract collapsed and NYMEX delisted it (account from NPR Planet Money, TIME and CFTC history as compiled in the Potatopedia corpus).",
        ],
      },
      {
        id: "india",
        h2: "India: MCX, 2014",
        p: [
          "India's MCX exchange discontinued its potato futures in 2014. The reasons recorded are insufficient liquidity and broad participation, inadequate physically stored stock behind the contracts, and investor activity in potato-linked instruments rather than in the physical commodity.",
        ],
      },
      {
        id: "why",
        h2: "Why potatoes are hard to trade",
        p: [
          "Potatoes are bulky, semi-perishable and graded by variety and quality, which makes a standard, deliverable contract hard to define. Most processing volume is also contracted before planting, so processors have little need to hedge. The same pattern recurs across markets: the 1964 Senate bill, the 1976 default, India's 2014 closure and the 2026 EEX delisting each ended or weakened a contract for different immediate reasons, with the same structural backdrop.",
          "A more useful price signal for many readers is the contract price and the free-buy quotation, covered on the Europe page, or the USDA fresh and processing prices on the USA page.",
        ],
      },
    ],
    sources: [
      { label: "EEX, Customer information: Delisting of EEX European Processing Potato Future (13 March 2026)", url: "https://www.eex.com/fileadmin/Global/News/EEX/EEX_Customer_Information/2026/20260313_EEX_Customer_Information_Delisting_Potato_Future.pdf" },
      { label: "EEX, European Processing Potato Future contract specification", url: "https://www.zmp.de/en/futures/potatoes/eex-processing-potatoes-frankfurt-de-future", note: "specification mirrored from EEX; last updated July 2023" },
      { label: "NPR Planet Money, The Maine Potato War of 1976" },
      { label: "CFTC, official history; TIME archive, Commodities: The Great Potato Bust" },
    ],
    related: [
      { href: "/prices/europe", title: "Europe potato prices", desc: "Free-buy and contract prices." },
      { href: "/prices/usa", title: "USA potato prices", desc: "NASS prices received." },
      { href: "/country/united-states", title: "United States", desc: "Idaho versus Maine." },
      { href: "/answers/potato-market-price-today", title: "Potato market price today", desc: "Where current prices are published." },
    ],
  },
};
