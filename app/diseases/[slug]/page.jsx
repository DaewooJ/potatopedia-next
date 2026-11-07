import { notFound } from "next/navigation";
import RefPage, { refJsonLd, refMetadata } from "../../../components/RefPage";
import { DISEASES, DISEASE_BY_SLUG, DISEASES_UPDATED, SEED_TOLERANCES_NOTE } from "../../../lib/reference/diseases";

export const dynamicParams = false;
export function generateStaticParams() {
  return DISEASES.map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({ params }) {
  const d = DISEASE_BY_SLUG[(await params).slug];
  if (!d) return {};
  return refMetadata({ title: d.metaTitle, description: d.metaDescription, path: `/diseases/${d.slug}` });
}

function buildSections(d) {
  return [
    { id: "facts", table: { headers: ["At a glance", ""], rows: d.facts } },
    { id: "cause", h2: "Cause", p: d.cause },
    { id: "symptoms", h2: "Symptoms", list: d.symptoms },
    { id: "spread", h2: "How it spreads", p: d.spread },
    { id: "regions", h2: "Where the risk is highest", p: d.regions },
    { id: "management", h2: "Management: cultural", list: d.cultural },
    { id: "resistance", h2: "Management: resistant varieties", p: d.resistance },
    { id: "chemical", h2: "Management: chemical and regulatory notes", p: d.chemical },
    { id: "seed", h2: "Seed certification", p: [...d.seed, SEED_TOLERANCES_NOTE] },
  ];
}

export default async function Page({ params }) {
  const d = DISEASE_BY_SLUG[(await params).slug];
  if (!d) notFound();
  const path = `/diseases/${d.slug}`;
  const crumbs = [{ name: "Home", href: "/" }, { name: "Diseases", href: "/diseases" }, { name: d.name, href: path }];
  const jsonLd = refJsonLd({
    path,
    headline: d.h1,
    description: d.metaDescription,
    datePublished: "2026-11-07",
    dateModified: DISEASES_UPDATED.iso,
    crumbs,
  });
  const others = DISEASES.filter((x) => x.slug !== d.slug).slice(0, 2).map((x) => ({ href: `/diseases/${x.slug}`, title: x.name, desc: x.latin }));
  return (
    <RefPage
      path={path}
      kicker="Diseases"
      h1={d.h1}
      lede={d.lede}
      updatedLabel={DISEASES_UPDATED.label}
      updatedISO={DISEASES_UPDATED.iso}
      crumbs={crumbs}
      sections={buildSections(d)}
      sources={d.sources}
      related={[...d.related, ...others]}
      jsonLd={jsonLd}
    />
  );
}
