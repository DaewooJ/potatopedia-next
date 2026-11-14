import RelatedSections from "../../../components/RelatedSections";
import { relatedForVariety } from "../../../lib/related-sections";
import { getVarietyBySlug } from "../../../lib/varieties-data";
import TRAITS from "../../../lib/variety-traits.json";
import TopicSignup from "../../../components/TopicSignup";

// Disease guides matching the variety's published resistances, plus reference hubs, under each variety page.
// (The breeder's company profile link is already on the page itself.)
export default async function VarietyLayout({ children, params }) {
  const { slug } = await params;
  const v = getVarietyBySlug(slug);
  if (!v) return children;
  const rel = await relatedForVariety(v, TRAITS[slug]);
  return (
    <>
      {children}
      <TopicSignup newsletter="seed-potato-field" source={`varieties/${slug}`} />
      <RelatedSections title={rel.title} items={rel.items} />
    </>
  );
}
