import RelatedSections from "../../../components/RelatedSections";
import { relatedForText } from "../../../lib/related-sections";
import { POPULAR_ANSWERS } from "../../../lib/data";
import TopicSignup from "../../../components/TopicSignup";

// "Related reference sections" under each answer, chosen from the question's topic words.
export default async function AnswerLayout({ children, params }) {
  const { slug } = await params;
  const pa = POPULAR_ANSWERS.find((p) => p.slug === slug);
  if (!pa) return children;
  const rel = await relatedForText(`${slug} ${pa.question} ${pa.category || ""}`);
  return (
    <>
      {children}
      <TopicSignup text={`${slug} ${pa.question} ${pa.category || ""}`} fallback="seed-potato-field" source={`answers/${slug}`} />
      <RelatedSections title={rel.title} items={rel.items} />
    </>
  );
}
