import NewsletterSignup from "./NewsletterSignup";
import { bySlug } from "../lib/newsletters";
import { newsletterFor, everyLine } from "../lib/newsletter-topic";

// Inline "Get this every week" box for pages people land on from Google and AI answers (14 Nov 2026).
// The newsletter is matched to the page's topic (lib/newsletter-topic.js); `source` = "<page type>/<slug>" is stored
// with the signup (leads.details.source) and sent to GA4. Not a popup. Neutral class names only (ad blockers).
const INTRO = {
  "potato-processing-weekly": "Plant openings, capacity, technology and raw-material supply in fries, chips, flakes and starch, sourced and in one email.",
  "seed-potato-field": "New varieties, seed rules, disease and pest alerts, storage and field research, sourced and in one email.",
  "potato-prices-trade": "Prices by market, frozen-fry and flake trade, HS-code flows and crop estimates, sourced and in one email.",
};

export default function TopicSignup({ text, fallback, source, newsletter, wrap = true }) {
  const slug = newsletter && bySlug(newsletter) ? newsletter : newsletterFor(text, fallback);
  const src = String(source || "").toLowerCase().slice(0, 160);
  const box = (
    <NewsletterSignup
      single
      compact
      defaults={[slug]}
      id={`nl-${src.split("/")[0] || "page"}`}
      title={everyLine(slug)}
      intro={INTRO[slug]}
      source={src}
    />
  );
  if (!wrap) return <div style={{ margin: "28px 0" }}>{box}</div>;
  return (
    <section aria-label="Newsletter" style={{ padding: "8px 16px 28px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>{box}</div>
    </section>
  );
}
