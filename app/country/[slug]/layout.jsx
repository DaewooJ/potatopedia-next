import RelatedSections from "../../../components/RelatedSections";
import { relatedForCountry } from "../../../lib/related-sections";
import { COUNTRIES } from "../../../lib/data";

// Report, price, directory and reference links under each country dossier.
export default async function CountryLayout({ children, params }) {
  const { slug } = await params;
  const c = COUNTRIES.find((x) => x.slug === slug);
  if (!c) return children;
  const rel = await relatedForCountry(slug, c.name);
  return (
    <>
      {children}
      <RelatedSections title={rel.title} items={rel.items} />
    </>
  );
}
