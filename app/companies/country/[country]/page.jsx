import { notFound } from "next/navigation";
import CompanyLanding, { landingMeta, plural, loadDirectory } from "../../../../components/CompanyLanding";
import { KINDS, KIND_ORDER, KIND_PATH, countrySlug, inCountry, landingPages } from "../../../../lib/directory";

// /companies/country/<country> — every published company in one country (only countries with 2 or more).
export const revalidate = 3600;

const H2 = { processing: "Potato processors in", seed: "Seed potato companies in", machinery: "Potato machinery makers in" };

export async function generateStaticParams() {
  try {
    return landingPages(await loadDirectory()).countries.map((c) => ({ country: countrySlug(c) }));
  } catch {
    return [];
  }
}

async function load(slug) {
  const all = await loadDirectory();
  const name = landingPages(all).countries.find((c) => countrySlug(c) === slug);
  if (!name) return null;
  return { all, name, items: all.filter((c) => c.country === name) };
}

export async function generateMetadata({ params }) {
  const { country } = await params;
  const d = await load(country);
  if (!d) return { title: "Not found", robots: { index: false } };
  const kinds = KIND_ORDER.filter((k) => d.items.some((c) => c.kind === k));
  return landingMeta({
    title: `Potato Companies in ${inCountry(d.name)}: ${kinds.map((k) => ({ processing: "Processors", seed: "Seed", machinery: "Machinery" })[k]).join(", ")} | Potatopedia`,
    description: `${d.items.length} potato companies in ${inCountry(d.name)}: ${kinds.map((k) => `${d.items.filter((c) => c.kind === k).length} ${KINDS[k].plural.toLowerCase()}`).join(", ")}. Each profile is compiled from the company's own website with sources.`,
    path: `/companies/country/${country}`,
  });
}

export default async function Page({ params }) {
  const { country } = await params;
  const d = await load(country);
  if (!d) notFound();
  const kinds = KIND_ORDER.filter((k) => d.items.some((c) => c.kind === k));
  const pages = d.items.reduce((a, c) => a + c.sources, 0);
  const intro = `${plural(d.items.length, "potato company", "potato companies")} in ${inCountry(d.name)}: ${kinds.map((k) => `${d.items.filter((c) => c.kind === k).length} ${KINDS[k].plural.toLowerCase()}`).join(", ")}. Each profile is compiled from the company's own website; together they cite ${pages} official pages. Listed A to Z within each type.`;
  return (
    <CompanyLanding
      path={`/companies/country/${country}`}
      eyebrow={`Company directory · ${d.name}`}
      h1={`Potato companies in ${inCountry(d.name)}`}
      intro={intro}
      groups={kinds.map((k) => ({
        key: k,
        h2: `${H2[k]} ${inCountry(d.name)}`,
        items: d.items.filter((c) => c.kind === k),
        more: { href: `/companies/${KIND_PATH[k]}`, label: `All ${KINDS[k].plural.toLowerCase()}` },
      }))}
      crumbs={[{ name: d.name, url: `/companies/country/${country}` }]}
      all={d.all}
    />
  );
}
