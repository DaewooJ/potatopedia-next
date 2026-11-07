// Pure labels and helpers for the company directory, safe for client components (no database import).

export const KINDS = {
  processing: { label: "Processor", plural: "Processors", sub: "Fries, chips, flakes, starch and other potato products" },
  seed: { label: "Seed company", plural: "Seed companies", sub: "Breeders, seed potato growers and exporters" },
  machinery: { label: "Machinery maker", plural: "Machinery makers", sub: "From planting and harvest to sorting and processing lines" },
};
export const KIND_ORDER = ["processing", "seed", "machinery"];

export const SEGMENTS = {
  // machinery
  "optical-sorting": "Optical sorting",
  "grading-sizing": "Grading and sizing",
  "washing-peeling": "Washing and peeling",
  cutting: "Cutting",
  frying: "Frying",
  "drying-dehydration": "Drying and dehydration",
  freezing: "Freezing",
  starch: "Starch",
  packing: "Packing",
  "storage-ventilation": "Storage and ventilation",
  handling: "Handling",
  "turnkey-lines": "Turnkey lines",
  "planting-harvesting": "Planting and harvesting",
  // processing
  fries: "Fries",
  "chips-snacks": "Chips and snacks",
  dehydrated: "Flakes and dehydrated",
  "fresh-cut-peeled": "Fresh-cut and peeled",
  "ready-meals": "Potato specialties",
  protein: "Protein",
  spirits: "Spirits",
  // seed
  breeding: "Breeding",
  "seed-multiplication": "Seed multiplication",
  "seed-export": "Seed export",
  other: "Other",
};
export const MACHINE_SEGMENTS = [
  "optical-sorting", "grading-sizing", "washing-peeling", "cutting", "frying", "drying-dehydration", "freezing",
  "starch", "packing", "storage-ventilation", "handling", "turnkey-lines", "planting-harvesting",
];

const ISO = {
  Argentina: "AR", Australia: "AU", Austria: "AT", Bangladesh: "BD", Belgium: "BE", Brazil: "BR", Canada: "CA", Chile: "CL",
  China: "CN", Cyprus: "CY", "Czech Republic": "CZ", Czechia: "CZ", Denmark: "DK", Egypt: "EG", Finland: "FI", France: "FR",
  Germany: "DE", Greece: "GR", Hungary: "HU", India: "IN", Ireland: "IE", Italy: "IT", Japan: "JP", Kenya: "KE", Malta: "MT",
  Mexico: "MX", Netherlands: "NL", "New Zealand": "NZ", Norway: "NO", Pakistan: "PK", Peru: "PE", Poland: "PL", Portugal: "PT",
  Romania: "RO", Russia: "RU", "South Africa": "ZA", Spain: "ES", Sweden: "SE", Switzerland: "CH", Turkey: "TR", Türkiye: "TR",
  Ukraine: "UA", "United Kingdom": "GB", "United States": "US", USA: "US",
};
export function flag(country) {
  const c = ISO[country];
  return c ? String.fromCodePoint(...[...c].map((ch) => 0x1f1a5 + ch.charCodeAt(0))) : "";
}

