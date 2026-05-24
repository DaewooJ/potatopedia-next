import Link from "next/link";
import { notFound } from "next/navigation";
import { ppCSS } from "../../../lib/styles";
import { POPULAR_ANSWERS, UPDATED_SHORT } from "../../../lib/data";
import baked from "../../../lib/answers-baked.json";
import BakedAnswerBlock from "../../../components/BakedAnswerBlock";
import AnswerAI from "../../../components/AnswerAI";
import { formatAnswer } from "../../../lib/format";
import { POTATOPEDIA_PUBLISHER, POTATOPEDIA_EDITORIAL, SPEAKABLE } from "../../../lib/authors";

// Procedural slugs eligible for HowTo schema (M7). The baked answer for each
// of these slugs is structured as a step-by-step procedure.
const HOWTO_ELIGIBLE = new Set([
  "how-to-grow-potatoes-for-beginners",
  "how-to-grow-potatoes-in-containers",
  "how-to-build-potato-cold-storage",
  "how-to-save-seed-potatoes",
  "how-to-store-potatoes-at-home",
  "how-to-identify-potato-type",
  "seed-potatoes-per-grow-bag",
  "potatoes-per-planting-hole",
  "potatoes-per-5-gallon-bucket",
  "when-to-plant-potatoes",
  "planting-potatoes-in-october",
  "trick-to-growing-big-potatoes",
  "covering-potatoes-at-night",
  "leaving-potatoes-in-ground-too-long",
  "storing-potatoes-in-cold-garage",
  "storing-potatoes-at-40-degrees",
  "potatoes-at-room-temperature",
]);

// Extract step-by-step instructions from a baked answer, when the answer is
// formatted as a numbered list or bullet list. Returns up to 8 steps.
function extractHowToSteps(text) {
  if (!text) return [];
  const cleaned = text.replace(/\(Source:[^)]+\)/g, "").trim();
  // Try numbered "1. ..." or "Step 1: ..." patterns first
  const numbered = cleaned.match(/(?:^|\n)\s*(?:Step\s*)?(\d+)[\.\):]\s+([^\n]+)/gim);
  if (numbered && numbered.length >= 2) {
    return numbered.slice(0, 8).map((line, i) => {
      const txt = line.replace(/^\s*(?:Step\s*)?\d+[\.\):]\s+/i, "").replace(/\*\*/g, "").trim();
      return { name: `Step ${i + 1}`, text: txt.slice(0, 220) };
    }).filter(s => s.text.length > 20);
  }
  // Try bullet "* " or "- " patterns
  const bullets = cleaned.match(/(?:^|\n)\s*[\-\*•]\s+([^\n]+)/gim);
  if (bullets && bullets.length >= 2) {
    return bullets.slice(0, 8).map((line, i) => {
      const txt = line.replace(/^\s*[\-\*•]\s+/, "").replace(/\*\*/g, "").trim();
      return { name: `Step ${i + 1}`, text: txt.slice(0, 220) };
    }).filter(s => s.text.length > 20);
  }
  // Fallback: split on " ** " (markdown bold headers in the answer often demarcate steps)
  const parts = cleaned.split(/\n\s*\*\*[^*]+\*\*\s*\n/).slice(1);
  if (parts.length >= 2) {
    return parts.slice(0, 8).map((p, i) => ({
      name: `Step ${i + 1}`,
      text: p.replace(/\*\*/g, "").replace(/\s+/g, " ").trim().slice(0, 220),
    })).filter(s => s.text.length > 20);
  }
  return [];
}

export function generateStaticParams() {
  return POPULAR_ANSWERS.map((pa) => ({ slug: pa.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pa = POPULAR_ANSWERS.find((p) => p.slug === slug);
  if (!pa) return { title: "Answer Not Found" };
  // Build a short, citation-friendly description from the baked answer's first
  // sentence (≤155 chars). Falls back to a templated description when no baked
  // content is available (new slug not yet baked).
  const b = baked[slug];
  let desc = `Cited expert answer to "${pa.question}". Drawn from FAOSTAT, USDA, CIP, ICAR-CPRI and peer-reviewed sources.`;
  if (b && b.answer) {
    const firstSentence = b.answer.split(/(?<=[.!?])\s+/)[0].replace(/\*\*/g, "").replace(/\(Source:[^)]+\)/g, "").trim();
    if (firstSentence && firstSentence.length > 60) {
      desc = firstSentence.length > 155 ? firstSentence.slice(0, 152) + "..." : firstSentence;
    }
  }
  return {
    title: pa.question,
    description: desc,
    alternates: { canonical: "https://www.potatopedia.com/answers/" + slug },
    openGraph: {
      type: "article",
      url: "https://www.potatopedia.com/answers/" + slug,
      title: pa.question,
      description: desc,
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", title: pa.question, description: desc },
  };
}

export default async function AnswerPage({ params }) {
  const { slug } = await params;
  const currentIndex = POPULAR_ANSWERS.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) notFound();

  const pa = POPULAR_ANSWERS[currentIndex];
  const b = baked[slug];

  // Deterministic selection of 4 related answers (not the current one)
  const others = POPULAR_ANSWERS.filter((_, i) => i !== currentIndex);
  const shifted = [...others.slice(currentIndex % others.length), ...others.slice(0, currentIndex % others.length)];
  const related = shifted.slice(0, 4);

  const pageUrl = "https://www.potatopedia.com/answers/" + slug;

  // Extract clean answer text + first 160-char snippet for schema
  const cleanedAnswer = b ? formatAnswer(b.answer).cleaned : null;
  const answerSnippet = cleanedAnswer
    ? cleanedAnswer.replace(/\*\*/g, "").slice(0, 1500)
    : null;

  // JSON-LD: Article + BreadcrumbList + FAQPage + HowTo (where eligible)
  const jsonLdGraph = [
    {
      "@type": "Article",
      "@id": pageUrl + "#article",
      headline: pa.question,
      description: answerSnippet ? answerSnippet.slice(0, 200) : pa.question,
      datePublished: "2026-04-01",
      dateModified: b ? new Date(b.baked_at * 1000).toISOString().slice(0, 10) : "2026-05-08",
      author: [POTATOPEDIA_EDITORIAL, { "@id": "https://www.potatopedia.com/#publisher" }],
      publisher: { "@id": "https://www.potatopedia.com/#publisher" },
      mainEntityOfPage: pageUrl,
      image: "https://www.potatopedia.com/og-image.png",
      about: { "@type": "Thing", name: pa.question },
      articleSection: pa.category,
      speakable: SPEAKABLE,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, item: { "@id": "https://www.potatopedia.com/", name: "Home" } },
        { "@type": "ListItem", position: 2, item: { "@id": "https://www.potatopedia.com/answers", name: "Popular Questions" } },
        { "@type": "ListItem", position: 3, item: { "@id": pageUrl, name: pa.question } },
      ],
    },
    POTATOPEDIA_PUBLISHER,
  ];

  // M7: HowTo schema for procedural answer slugs — only emit when we can extract ≥3 steps.
  let howToLd = null;
  if (b && HOWTO_ELIGIBLE.has(slug)) {
    const steps = extractHowToSteps(b.answer);
    if (steps.length >= 3) {
      howToLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: pa.question,
        description: answerSnippet ? answerSnippet.slice(0, 200) : pa.question,
        step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
        image: "https://www.potatopedia.com/og-image.png",
      };
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLdGraph }) }} />
      {/* FAQPage schema with the answer itself + 4 related answers — drives AI Overview pickup */}
      {answerSnippet && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: pa.question, acceptedAnswer: { "@type": "Answer", text: answerSnippet } },
            ...related.slice(0, 3).filter(r => baked[r.slug]).map(r => ({
              "@type": "Question",
              name: r.question,
              acceptedAnswer: { "@type": "Answer", text: formatAnswer(baked[r.slug].answer).cleaned.replace(/\*\*/g, "").slice(0, 800) },
            })),
          ],
        }) }} />
      )}
      {/* HowTo schema for procedural answers (M7) */}
      {howToLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />}
      <style dangerouslySetInnerHTML={{ __html: ppCSS }} />

      <section style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 0" }}>
        {/* Back link */}
        <Link
          href="/answers"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, color: "#C62828",
            textDecoration: "none", marginBottom: 28,
          }}
        >
          <span>&larr;</span> All Questions
        </Link>

        {/* Category badge + updated date */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{
            display: "inline-block", fontSize: 10, fontWeight: 700,
            color: "#C62828", textTransform: "uppercase", letterSpacing: 1.5,
            background: "rgba(198,40,40,0.06)", padding: "4px 12px",
            borderRadius: 6,
          }}>{pa.category}</span>
          <span style={{ fontSize: 12, color: "#999" }}>Updated {UPDATED_SHORT}</span>
        </div>

        {/* Question heading */}
        <h1 style={{
          fontSize: 28, fontWeight: 800, color: "#1A1A1A",
          letterSpacing: -0.8, lineHeight: 1.3, marginBottom: 28,
          maxWidth: 720,
        }}>{pa.question}</h1>

        {/* SERVER-RENDERED baked answer (visible to crawlers and AI engines) */}
        {b ? (
          <BakedAnswerBlock data={b} />
        ) : (
          // Fallback when slug isn't baked yet (e.g., new entry added but bake not re-run)
          <AnswerAI slug={slug} question={pa.question} />
        )}

        {/* Follow-up Q&A widget — client-side, doesn't block primary content */}
        {b && (
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid #ececec" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 14px" }}>Ask a follow-up question</h2>
            <AnswerAI slug={slug} question={pa.question} prebakedAnswer={b.answer} skipInitialFetch={true} />
          </div>
        )}
      </section>

      {/* More Popular Questions */}
      <section style={{
        maxWidth: 820, margin: "0 auto", padding: "56px 24px 80px",
      }}>
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: "#1A1A1A",
          marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{
            width: 4, height: 24, borderRadius: 2,
            background: "linear-gradient(180deg,#C62828,#E53935)",
            display: "inline-block",
          }} />
          More Popular Questions
        </h2>
        <div className="pp-categories-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14,
        }}>
          {related.map((rpa) => (
            <Link
              key={rpa.slug}
              href={"/answers/" + rpa.slug}
              className="pp-country-card"
              style={{
                display: "block", padding: "18px 20px", borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.06)", background: "#fff",
                textDecoration: "none",
              }}
            >
              <span style={{
                display: "inline-block", fontSize: 9, fontWeight: 700,
                color: "#C62828", textTransform: "uppercase", letterSpacing: 1.2,
                background: "rgba(198,40,40,0.06)", padding: "2px 8px",
                borderRadius: 5, marginBottom: 8,
              }}>{rpa.category}</span>
              <h3 style={{
                fontSize: 13, fontWeight: 600, color: "#1A1A1A",
                lineHeight: 1.5, margin: 0,
              }}>{rpa.question}</h3>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
