import MarketIndex from "../../components/MarketIndex";

export const metadata = {
  title: "Potato Problem Market — sourced fixes and the machines behind them | Potatopedia",
  description: "Six problems potato growers and processors pay to solve: defects, grading, harvest bruising, planting gaps, storage sprouting, line output. Sourced answers and neutral maker lists.",
  alternates: { canonical: "https://www.potatopedia.com/market" },
};
export default function Page() {
  return <MarketIndex mode="problem" />;
}
