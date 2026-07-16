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

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "64px 24px 48px" }}>
        <span style={{
          display: "inline-block", fontSize: 11, fontWeight: 700,
          color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5,
          background: "rgba(198,40,40,0.06)", padding: "6px 16px",
          borderRadius: 20, marginBottom: 20,
        }}>Popular Questions</span>
        <h1 style={{
          fontSize: 36, fontWeight: 800, color: "#1A1A1A",
          letterSpacing: -1.2, marginBottom: 16,
        }}>
          Top Potato Questions,{" "}
          <span style={{
            background: "linear-gradient(135deg,#C62828,#E53935)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Answered by AI</span>
        </h1>
        <p style={{
          fontSize: 16, color: "#666", maxWidth: 520,
          margin: "0 auto", lineHeight: 1.6,
        }}>
          In-depth, sourced answers to the most-searched potato questions &mdash; powered by 176+ verified data sources.
        </p>
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
