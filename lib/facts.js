// Single source of truth for headline facts used across the site.
// Rule: the latest, most advanced government estimate wins (Final > 3rd Advance > 2nd > 1st) and is named.
export const INDIA_POTATO = {
  value: 58.1,
  unit: "million tonnes",
  year: "2024-25",
  label: "3rd Advance Estimate",
  publisher: "Ministry of Agriculture & Farmers Welfare",
};

export const INDIA_POTATO_SHORT = `${INDIA_POTATO.value} million tonnes (${INDIA_POTATO.year}, ${INDIA_POTATO.label}, ${INDIA_POTATO.publisher})`;
