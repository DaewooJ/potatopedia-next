import RelatedSections from "../../../components/RelatedSections";
import { relatedForText } from "../../../lib/related-sections";

// Adds a "related reference sections" block under every knowledge article (internal links to diseases, prices,
// machines, market, reports). Kept in a layout so the article template stays untouched.
export default async function KnowledgeLayout({ children, params }) {
  const { slug } = await params;
  const rel = await relatedForText(slug);
  return (
    <>
      {children}
      <RelatedSections title={rel.title} items={rel.items} />
    </>
  );
}
