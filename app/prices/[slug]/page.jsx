import { notFound } from "next/navigation";
import RefPage, { refJsonLd, refMetadata } from "../../../components/RefPage";
import { PRICES, PRICE_PAGES, PRICES_UPDATED, PRICES_NOTICE } from "../../../lib/reference/prices";

export const dynamicParams = false;
export function generateStaticParams() {
  return PRICE_PAGES.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const p = PRICES[(await params).slug];
  if (!p) return {};
  return refMetadata({ title: p.metaTitle, description: p.metaDescription, path: p.path });
}
export default async function Page({ params }) {
  const p = PRICES[(await params).slug];
  if (!p) notFound();
  const crumbs = [{ name: "Home", href: "/" }, { name: "Prices", href: "/prices" }, { name: p.kicker.replace("Prices · ", ""), href: p.path }];
  const jsonLd = refJsonLd({
    path: p.path,
    headline: p.h1,
    description: p.metaDescription,
    datePublished: "2026-11-07",
    dateModified: PRICES_UPDATED.iso,
    crumbs,
    dataset: p.dataset,
  });
  return (
    <RefPage
      path={p.path}
      kicker={p.kicker}
      h1={p.h1}
      lede={p.lede}
      updatedLabel={PRICES_UPDATED.label}
      updatedISO={PRICES_UPDATED.iso}
      crumbs={crumbs}
      notice={PRICES_NOTICE}
      sections={p.sections}
      sources={p.sources}
      related={p.related}
      jsonLd={jsonLd}
    />
  );
}
