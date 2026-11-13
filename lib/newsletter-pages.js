// Page-only copy for the newsletter pages (F1, 13 Nov 2026). Titles, slugs and accents stay in lib/newsletters.js.
import { SITE } from "./newsletters";

// Issue 01 dates proposed in docs/newsletters/CONTRACT.md (send only after Devendra approves the dry runs).
// Shown as "planned" until the first issue is published; the archive takes over from then on.
export const FIRST_ISSUE_PLANNED = {
  "potato-processing-weekly": { iso: "2026-11-24", label: "Tue 24 Nov 2026" },
  "seed-potato-field": { iso: "2026-11-26", label: "Thu 26 Nov 2026" },
  "potato-prices-trade": { iso: "2026-12-07", label: "Mon 7 Dec 2026" },
};

// What one issue carries (the issue builder's structure in the contract), in reader terms.
export const ISSUE_PARTS = [
  "A lead story and 6 to 10 short news items, each with its own page and its primary source linked",
  "Number of the week: one figure, with a small chart and its source",
  "A data box: one table you can use, dated and sourced",
  "An expert or company spotlight (never paid)",
  "Events: potato shows and conferences coming up",
  "At most one labelled sponsor message at the top and one labelled classified",
];

// Hub each title feeds (the evergreen page that owns the search words).
export const TITLE_HUBS = {
  "potato-processing-weekly": [
    { href: "/knowledge/how-potatoes-are-processed", label: "How potatoes are processed" },
    { href: "/processing/potato-chip-production", label: "Potato chip production" },
    { href: "/market", label: "Problems processors pay to solve" },
  ],
  "seed-potato-field": [
    { href: "/seed-field", label: "Seed potatoes" },
    { href: "/seed-field/certified-seed-potatoes", label: "Certified seed potatoes" },
    { href: "/diseases", label: "Potato diseases" },
  ],
  "potato-prices-trade": [
    { href: "/prices", label: "Potato prices" },
    { href: "/prices/frozen-fries", label: "Frozen french fry export prices" },
    { href: "/knowledge/global-potato-trade", label: "Global potato trade" },
  ],
};

export const periodicalId = (slug) => `${SITE}/newsletters/${slug}#periodical`;
