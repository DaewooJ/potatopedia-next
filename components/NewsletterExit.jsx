import { NEWSLETTERS } from "@/lib/newsletters";

// The exit line under every AI answer (13 Nov 2026): "Get Potato Processing Weekly →", or the title that matches the
// answer's topic (seed and field, or prices and trade). Plain component, no hooks: works inside client and server trees.
const TOPIC = {
  "potato-processing-weekly": /\b(process\w*|fries|fry|frying|chips?|crisps?|starch|flakes?|dehydrat\w*|acrylamide|factory|factories|plant capacity|peel\w*|sort\w*|blanch\w*|snack\w*)\b/gi,
  "seed-potato-field": /\b(seed\w*|variet\w*|cultivar\w*|blight|pvy|virus\w*|wireworm|zebra chip|nematode|disease\w*|pests?|storage|sprout\w*|certif\w*|plant(ing)?|agronom\w*|breed\w*|yield\w*|harvest\w*|soil|fertili[sz]\w*|irrigat\w*|grow\w*)\b/gi,
  "potato-prices-trade": /\b(prices?|pricing|trade|traders?|exports?|imports?|exporters?|importers?|markets?|comtrade|hs ?\d{4}|tariff\w*|futures|contract\w*|freight|usd|cost\w*)\b/gi,
};

export function pickNewsletter(text) {
  const t = String(text || "");
  let best = NEWSLETTERS[0];
  let bestN = 0;
  for (const n of NEWSLETTERS) {
    const hits = (t.match(TOPIC[n.slug]) || []).length;
    if (hits > bestN) { best = n; bestN = hits; }
  }
  return best;
}

export default function NewsletterExit({ text = "", dark = false }) {
  const n = pickNewsletter(text);
  return (
    <p style={{ margin: "18px 0 0", fontSize: 14.5, lineHeight: 1.5 }}>
      <a
        href={`/newsletters?title=${n.slug}#signup`}
        style={{ color: dark ? "#E2C08D" : "var(--gold)", fontWeight: 600, textDecoration: "none", borderBottom: `2px solid ${n.accent}`, paddingBottom: 1 }}
      >
        Get {n.name} →
      </a>
      <span style={{ color: dark ? "#B7B2AA" : "var(--mute2)", fontSize: 13 }}> · free, {n.cadence}</span>
    </p>
  );
}
