// /ask: the research desk. Canonical is always /ask; /ask?q=... variants are noindexed in page.jsx (user queries).
export const metadata = {
  title: { absolute: "Ask the potato reference · Potatopedia" },
  description:
    "Ask any question about potatoes: production, trade, prices, varieties, seed, processing and research. Answers come from FAOSTAT, USDA, CIP, UN Comtrade, ICAR-CPRI and peer-reviewed research, with every source shown.",
  alternates: { canonical: "https://www.potatopedia.com/ask" },
  openGraph: {
    title: "Ask the potato reference · Potatopedia",
    description: "Sourced answers on potatoes worldwide, from FAOSTAT, USDA, CIP and peer-reviewed research.",
    url: "https://www.potatopedia.com/ask",
  },
};

export default function AskLayout({ children }) {
  return children;
}
