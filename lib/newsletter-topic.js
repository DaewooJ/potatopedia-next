// Which newsletter fits a page (14 Nov 2026): processing/industry → Potato Processing Weekly; seed/field/agronomy/
// variety/disease → Seed Potato & Field; prices/trade/markets → Potato Prices & Trade. Scored on the page's own words
// (slug, title, category, tags). Neutral and global: no country word moves the score.
import { bySlug } from "./newsletters.js";

const RULES = {
  "potato-processing-weekly":
    /process|industr|fries\b|\bfry|frozen|chip|crisp|starch|flake|dehydrat|snack|acrylamide|sorting|peel|factory|plant capacity|mcdonald|mccain|lamb weston|simplot|aviko|farm frites|machine|vodka|bioplastic|food service|packag/g,
  "seed-potato-field":
    /seed|field|agronom|variet|cultivar|kufri|russet|breed|disease|blight|pest|nematode|virus|pvy|beetle|wireworm|scab|wilt|rot\b|storage|sprout|irrigat|fertili|soil|harvest|plant(ing)?\b|grow|yield|cultivat|climate|haulm|certif|tuber|organic|genetic|crispr|gene/g,
  "potato-prices-trade":
    /price|trade|market|export|import|tariff|futures|hs code|econom|cost|demand|supply|consum|production|producer|produc|top-|statistic|value|invest|forecast|outlook/g,
};

// text → newsletter slug. `fallback` wins ties and pages with no topic words.
export function newsletterFor(text, fallback = "potato-prices-trade") {
  const t = String(text || "").toLowerCase().replace(/[-_]+/g, " ");
  let best = fallback;
  let bestN = 0;
  for (const [slug, re] of Object.entries(RULES)) {
    const n = (t.match(re) || []).length;
    if (n > bestN) { best = slug; bestN = n; }
  }
  return best;
}

// Headline for the inline box, from the title's cadence.
export function everyLine(slug) {
  const n = bySlug(slug);
  if (!n) return "Get this by email";
  return n.cadence === "weekly" ? "Get this every week" : n.cadence === "fortnightly" ? "Get this every fortnight" : "Get this every month";
}
