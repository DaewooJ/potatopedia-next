import { notFound } from "next/navigation";
import MarketPage from "../../../components/MarketPage";
import { PROBLEMS, byProblem } from "../../../lib/market";

export const revalidate = 604800;
export const dynamicParams = false;
export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ problem: p.slug }));
}
export async function generateMetadata({ params }) {
  const item = byProblem((await params).problem);
  if (!item) return {};
  return {
    title: `${item.problem}: how to fix it and who makes ${item.machine}s | Potatopedia`,
    description: `A sourced answer on ${item.problem.toLowerCase()} in potatoes, what to look for in ${item.machine}s, and a neutral list of makers.`,
    alternates: { canonical: `https://www.potatopedia.com/market/${item.slug}` },
  };
}
export default async function Page({ params }) {
  const item = byProblem((await params).problem);
  if (!item) notFound();
  return <MarketPage item={item} mode="problem" />;
}
