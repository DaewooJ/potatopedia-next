import { ppCSS } from "../../lib/styles";
import { POPULAR_ANSWERS } from "../../lib/data";
import AnswersFilter from "../../components/AnswersFilter";
import ContentRequestCTA from "../../components/ContentRequestCTA";

export const metadata = {
  title: "Popular Potato Questions \u2014 Answered by AI",
  description: "Direct cited answers to 80+ most-asked questions about potatoes. Production, nutrition, varieties, trade, processing, cultivation \u2014 drawn from 5,657 verified data points across 277 authoritative sources.",
  alternates: { canonical: "https://www.potatopedia.com/answers" },
  openGraph: {
    type: "website",
    url: "https://www.potatopedia.com/answers",
    title: "80+ Cited Potato Q&A \u2014 Potatopedia",
    description: "Direct, sourced answers to the most-asked potato questions. Powered by AI on 5,657 verified data points.",
    images: ["/og-image.png"],
  },
};

export default function AnswersIndexPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.potatopedia.com/answers#collection",
    name: "Potatopedia Quick Answers",
    description: `${POPULAR_ANSWERS.length}+ cited answers to common potato questions, drawn from 5,657 verified data points and 277 authoritative sources.`,
    url: "https://www.potatopedia.com/answers",
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "Potatopedia", url: "https://www.potatopedia.com", logo: "https://www.potatopedia.com/logo.png" },
    hasPart: POPULAR_ANSWERS.map((a) => ({
      "@type": "Question",
      name: a.question,
      url: `https://www.potatopedia.com/answers/${a.slug}`,
    })),
  };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ppCSS }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      {/* Hero (premium system, 7 Nov 2026) */}
      <section className="ix-hero">
        <p className="eyebrow rise">Popular questions</p>
        <div className="ix-row">
          <h1 className="ix-h1 rise">Top potato questions, <em>answered.</em></h1>
          <div className="ix-dek"><p style={{ margin: 0 }}>In-depth, sourced answers to the most-searched potato questions &mdash; powered by 277 verified data sources.</p></div>
        </div>
      </section>

      {/* Filter + Grid (client island) */}
      <AnswersFilter answers={POPULAR_ANSWERS} />

      {/* Content Request CTA */}
      <section style={{ padding: "60px 24px 80px", background: "transparent" }}>
        <ContentRequestCTA pageContext="Answers index" />
      </section>
    </>
  );
}
