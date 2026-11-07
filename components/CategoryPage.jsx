import { notFound } from "next/navigation";
import CompanyLanding, { landingMeta, plural, loadDirectory } from "./CompanyLanding";
import { CATEGORY, KINDS, countrySlug, inCountry, landingPages } from "../lib/directory";

// /companies/processors · /companies/seed · /companies/machinery
const TITLES = {
  processors: "Potato Processors: Fries, Chips, Flakes & Starch Makers | Potatopedia",
  seed: "Seed Potato Companies: Breeders, Growers & Exporters | Potatopedia",
  machinery: "Potato Machinery Makers: Sorting, Storage & Lines | Potatopedia",
};
const DESC = {
  processors: "A neutral A–Z list of potato processors (fries, chips, flakes, starch, fresh-cut), each profile compiled from the company's own website with sources.",
  seed: "A neutral A–Z list of seed potato companies (breeders, seed growers and exporters), each profile compiled from the company's own website, with varieties and sources.",
  machinery: "A neutral A–Z list of potato machinery makers (optical sorters, graders, storage and ventilation, processing lines), each profile compiled from the official website.",
};

export function categoryMetadata(key) {
  return landingMeta({ title: TITLES[key], description: DESC[key], path: `/companies/${key}` });
}

export default async function CategoryPage({ cat }) {
  const def = CATEGORY[cat];
  if (!def) notFound();
  const all = await loadDirectory();
  const items = all.filter((c) => c.kind === def.kind);
  if (!items.length) notFound();
  const countries = [...new Set(items.map((c) => c.country).filter(Boolean))];
  const pages = items.reduce((a, c) => a + c.sources, 0);
  const { countries: landing } = landingPages(all);
  const top = countries.map((c) => [c, items.filter((x) => x.country === c).length]).sort((a, b) => b[1] - a[1]);
  // Section order is alphabetical by country (neutral), never by how many companies a country has.
  const alpha = [...top].sort((a, b) => a[0].localeCompare(b[0]));
  const intro = `${plural(items.length, KINDS[def.kind].label.toLowerCase(), KINDS[def.kind].plural.toLowerCase())} listed in ${plural(countries.length, "country", "countries")}`
    + ` (${top.slice(0, 3).map(([c, n]) => `${n} in ${inCountry(c)}`).join(", ")}): ${def.lede}. Each profile is compiled from the company's own website; together they cite ${pages} official pages. Countries in alphabetical order, companies A to Z, with no ranking.`;
  const groups = top.length > 1
    ? alpha.map(([c]) => ({
        key: countrySlug(c),
        h2: `${KINDS[def.kind].plural} in ${inCountry(c)}`,
        items: items.filter((x) => x.country === c),
        more: landing.includes(c) ? { href: `/companies/country/${countrySlug(c)}`, label: `All potato companies in ${inCountry(c)}` } : null,
      }))
    : [{ key: "all", items }];
  return (
    <CompanyLanding
      path={`/companies/${cat}`}
      eyebrow="Company directory"
      h1={def.h1}
      intro={intro}
      groups={groups}
      crumbs={[{ name: KINDS[def.kind].plural, url: `/companies/${cat}` }]}
      all={all}
    />
  );
}
