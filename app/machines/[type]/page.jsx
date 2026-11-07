import { notFound } from "next/navigation";
import MarketPage from "../../../components/MarketPage";
import { PROBLEMS, byMachine, an } from "../../../lib/market";

export const revalidate = 604800;
export const dynamicParams = false;
export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ type: p.machineSlug }));
}
export async function generateMetadata({ params }) {
  const item = byMachine((await params).type);
  if (!item) return {};
  return {
    title: `How to choose ${an(item.machine)} — makers and buying guide | Potatopedia`,
    description: `What to look for in ${an(item.machine)}, a sourced answer from FAOSTAT, USDA, CIP and research, and a neutral list of makers.`,
    alternates: { canonical: `https://www.potatopedia.com/machines/${item.machineSlug}` },
  };
}
export default async function Page({ params }) {
  const item = byMachine((await params).type);
  if (!item) notFound();
  return <MarketPage item={item} mode="machine" />;
}
