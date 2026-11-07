import MarketIndex from "../../components/MarketIndex";

export const metadata = {
  title: "Potato Machines — how to choose them and who makes them | Potatopedia",
  description: "Buying guides for optical sorters, graders, harvesters, planters, storage ventilation and processing lines, from sourced answers, with neutral maker lists.",
  alternates: { canonical: "https://www.potatopedia.com/machines" },
};
export default function Page() {
  return <MarketIndex mode="machine" />;
}
