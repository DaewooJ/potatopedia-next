// The six machinery problems (Problem Market) and the matching machine types. Used by /market and /machines.
// The answer on each page comes live from the answer engine (sourced, refreshed weekly); makers come from lib/makers.js.
export const PROBLEMS = [
  {
    slug: "optical-sorting-defects",
    problem: "Defects reaching the fry line",
    machine: "optical potato sorter",
    machineSlug: "optical-potato-sorter",
    stage: "Processing",
    segment: "machinery-sorting",
    question: "How do optical sorters detect and remove defective potatoes, and what should a processor look for when choosing one?",
    ask: ["Which defects can optical sorters detect inside a potato?", "What capacity optical sorter does a fry line need?", "How accurate are AI potato sorters?"],
  },
  {
    slug: "potato-grading",
    problem: "Uneven grading",
    machine: "potato size grader",
    machineSlug: "potato-size-grader",
    stage: "Storage",
    segment: "machinery-sorting",
    question: "How are potatoes graded by size and quality, and which grading equipment suits seed, ware and processing potatoes?",
    ask: ["What size grades are used for seed potatoes?", "Roller grader or screen grader: which is better for potatoes?", "How does grading affect potato prices?"],
  },
  {
    slug: "potato-harvesters",
    problem: "Harvest bruises and losses",
    machine: "potato harvester",
    machineSlug: "potato-harvester",
    stage: "Harvest",
    segment: "machinery-harvest-plant",
    question: "How can potato harvesting damage and bruising be reduced, and what should a grower look for in a potato harvester?",
    ask: ["What drop height causes potato bruising?", "Does harvester speed affect tuber damage?", "When should haulms be killed before harvest?"],
  },
  {
    slug: "potato-planters",
    problem: "Planting gaps",
    machine: "potato planter",
    machineSlug: "potato-planter",
    stage: "Field",
    segment: "machinery-harvest-plant",
    question: "How do missing hills and planting gaps affect potato yield, and what makes a potato planter accurate?",
    ask: ["How much yield do missing hills cost?", "What seed piece weight gives the best return?", "What planting density suits potatoes?"],
  },
  {
    slug: "potato-storage-sprouting",
    problem: "Sprouting and losses in store",
    machine: "potato cold store and ventilation system",
    machineSlug: "potato-cold-storage-ventilation",
    stage: "Storage",
    segment: "storage-ventilation",
    question: "How do you stop potatoes sprouting in storage, and what storage temperature and ventilation do processing potatoes need?",
    ask: ["What temperature suits processing potatoes in storage?", "What replaced CIPC for sprout control?", "How long can potatoes stay in cold storage?"],
  },
  {
    slug: "potato-processing-lines",
    problem: "Low line output",
    machine: "potato processing line",
    machineSlug: "potato-processing-line",
    stage: "Processing",
    segment: "machinery-processing-line",
    question: "What equipment makes up a French fry or potato chip processing line, and what limits its output and quality?",
    ask: ["What causes sugar ends in French fries?", "How can acrylamide in fries be reduced?", "What dry matter do potato chips need?"],
  },
];

export const byProblem = (slug) => PROBLEMS.find((p) => p.slug === slug);
export const byMachine = (slug) => PROBLEMS.find((p) => p.machineSlug === slug);
export const an = (w) => (/^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`);

const API = "https://api.potatopedia.com";

// Weekly-cached sourced answer for a page. Returns null if the engine is unreachable (the page then links to /ask).
export async function sourcedAnswer(question) {
  try {
    const r = await fetch(`${API}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, source: "market_page" }),
      next: { revalidate: 604800 },
      signal: AbortSignal.timeout(90000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return { answer: d.answer || "", sources: d.sources || [], confidence: d.confidence };
  } catch {
    return null;
  }
}
