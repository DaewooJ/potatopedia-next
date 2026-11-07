import { notFound } from "next/navigation";
import Link from "next/link";
import CompanyLanding, { landingMeta, plural, loadDirectory } from "../../../../components/CompanyLanding";
import { SEGMENTS, SEGMENT_H1, SEGMENT_GUIDE, MACHINE_SEGMENTS, landingPages, inCountry } from "../../../../lib/directory";
import { byMachine, an } from "../../../../lib/market";

// /companies/machinery/<segment> — machinery makers by machine type (only types with 2 or more makers).
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    return landingPages(await loadDirectory()).segments.map((segment) => ({ segment }));
  } catch {
    return [];
  }
}

async function load(segment) {
  if (!MACHINE_SEGMENTS.includes(segment)) return null;
  const all = await loadDirectory();
  const items = all.filter((c) => c.kind === "machinery" && c.segments.includes(segment));
  return items.length >= 2 ? { all, items } : null;
}

export async function generateMetadata({ params }) {
  const { segment } = await params;
  const d = await load(segment);
  if (!d) return { title: "Not found", robots: { index: false } };
  const h = SEGMENT_H1[segment];
  return landingMeta({
    title: `${h.replace(/\b(\w)/g, (m) => m.toUpperCase()).replace(/\bAnd\b/g, "and")} (${d.items.length} Listed) | Potatopedia`,
    description: `${d.items.length} makers of ${SEGMENTS[segment].toLowerCase()} machines for potatoes, A to Z, each profile compiled from the company's own website with machines, sites, contact details and sources.`,
    path: `/companies/machinery/${segment}`,
  });
}

export default async function Page({ params }) {
  const { segment } = await params;
  const d = await load(segment);
  if (!d) notFound();
  const countries = [...new Set(d.items.map((c) => c.country))];
  const pages = d.items.reduce((a, c) => a + c.sources, 0);
  const guides = (SEGMENT_GUIDE[segment] || []).map(byMachine).filter(Boolean);
  const intro = `${plural(d.items.length, "maker", "makers")} of ${SEGMENTS[segment].toLowerCase()} machines for potatoes, in ${countries.length === 1 ? inCountry(countries[0]) : plural(countries.length, "country", "countries")}. Each profile is compiled from the company's own website and cites its pages (${pages} in all). Listed A to Z, with no ranking or paid order.`;
  return (
    <>
      <CompanyLanding
        path={`/companies/machinery/${segment}`}
        eyebrow="Machinery makers"
        h1={SEGMENT_H1[segment]}
        intro={intro}
        groups={[{ key: segment, items: d.items }]}
        crumbs={[{ name: "Machinery makers", url: "/companies/machinery" }, { name: SEGMENTS[segment], url: `/companies/machinery/${segment}` }]}
        all={d.all}
      />
      {guides.length > 0 && (
        <section className="co-links" style={{ marginTop: -16 }} aria-label="Buying guides">
          <div className="cp-links">
            {guides.map((g) => <Link key={g.machineSlug} href={`/machines/${g.machineSlug}`}>Buying guide: how to choose {an(g.machine)} →</Link>)}
          </div>
        </section>
      )}
    </>
  );
}
