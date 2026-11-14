import RelatedSections from "../../../components/RelatedSections";
import { relatedForText } from "../../../lib/related-sections";
import TopicSignup from "../../../components/TopicSignup";

const HAS_OWN_SIGNUP = new Set(["how-potatoes-are-processed"]);

// Adds a "related reference sections" block under every knowledge article (internal links to diseases, prices,
// machines, market, reports). Kept in a layout so the article template stays untouched.
export default async function KnowledgeLayout({ children, params }) {
  const { slug } = await params;
  const rel = await relatedForText(slug);
  return (
    <>
      {children}
      {!HAS_OWN_SIGNUP.has(slug) && <TopicSignup text={slug} fallback="seed-potato-field" source={`knowledge/${slug}`} />}
      <RelatedSections title={rel.title} items={rel.items} />
    </>
  );
}
