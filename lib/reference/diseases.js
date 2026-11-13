// Disease reference pages. Facts come from the vetted backend corpus (EuroBlight/James Hutton Institute, ICAR-CPRI,
// USDA APHIS, CIP/Frontiers/MDPI peer-reviewed papers, EU seed-certification summaries) and are attributed in the text.
// Regulatory notes name the instrument. Where a figure has no official source on file it is not given.

export const DISEASES_UPDATED = { iso: "2026-11-07", label: "7 November 2026" };

export const SEED_TOLERANCES_NOTE =
  "Seed certification schemes set maximum tolerances for disease by class, from Pre-Basic to Certified, and regulated bacteria such as ring rot and brown rot are held at zero in every class (EU Directive 2002/56/EC framework; Scottish SPCS and Dutch NAK schemes as summarised in the Potatopedia corpus).";

export const DISEASES = [
  {
    slug: "late-blight",
    name: "Late blight",
    latin: "Phytophthora infestans",
    metaTitle: "Late Blight of Potato: Control and Resistance",
    metaDescription: "Late blight (Phytophthora infestans): symptoms, spread, risk regions, EuroBlight genotypes, resistant varieties, fungicide classes and EU regulatory notes.",
    h1: "Late blight of potato (Phytophthora infestans)",
    lede: "Late blight is the most economically damaging potato disease worldwide. It is caused by an oomycete, not a true fungus, and it moves fast in cool, wet weather. Management combines clean seed, field hygiene, forecasting, resistant varieties and a fungicide programme that is shrinking under resistance and regulation.",
    facts: [
      ["Cause", "Phytophthora infestans, an oomycete (water mould)"],
      ["Worst weather", "Cool, humid or wet, with leaf wetness"],
      ["Global cost", "Over $10 billion a year (peer-reviewed reviews)"],
      ["Europe cost", "About EUR 900 million a year in control and losses"],
      ["Quarantine pest", "No"],
    ],
    cause: [
      "P. infestans caused the Irish famine of 1845 to 1852, which killed about a million people and drove another million to emigrate. Until about 1980 a single clonal lineage of one mating type dominated worldwide. New strains reached Europe in the 1970s and brought the second mating type, so the pathogen can now reproduce sexually and form oospores that survive in soil (PMC reviews; EuroBlight).",
      "Annual losses worldwide exceed $10 billion in published reviews, and in Europe about EUR 900 million a year in control costs and crop losses. In India, ICAR-CPRI cites losses of 15 to 25 percent of the crop in affected years, valued at INR 5,000 to 8,000 crore (CPRI Annual Report 2020-21; Indian Phytopathological Society estimates).",
    ],
    symptoms: [
      "Leaves: pale green to dark, water-soaked lesions that turn brown, with a white sporulating fringe on the underside in humid conditions.",
      "Stems: brown to black lesions that can girdle the stem.",
      "Tubers: firm, copper-brown to reddish dry rot under the skin, often followed by soft rot from secondary bacteria in store.",
    ],
    spread: [
      "Spores (sporangia) travel on wind and rain from infected seed tubers, volunteer plants, cull piles and, now, oospores in soil. Infected seed is the main way the disease starts in a new crop.",
      "Warmer winters are raising oospore survival and extending the growing season, while 2024 showed that a warm, dry spring can lower pressure early and still leave a damaging late season (EuroBlight, PMC reviews).",
    ],
    regions: [
      "Worldwide wherever potatoes meet cool wet weather: north-west Europe, the Andes, the East African highlands (Kenya, Ethiopia, Rwanda, Uganda), the Indian hills and plains in foggy winter spells, and eastern China.",
      "EuroBlight's first 2025 season results, from more than 1,200 genotyped samples, put the aggressive EU_36 genotype at 34 percent of European samples (52 percent in 2024), EU_43 at 12 percent, EU_46 at 7 percent and EU_41 at about 5 percent, with about a third of samples in an 'other' group, higher in the north and east, consistent with soil oospore inoculum (EuroBlight, James Hutton Institute).",
    ],
    cultural: [
      "Plant certified seed and destroy cull piles and volunteers, which carry the disease between seasons.",
      "Use a decision support system. About 40 percent of Dutch growers use one, against about 8 percent of UK area. Tools include BlightScout, NEGFRY, SimCast, PhytoPRE and DACOM. Combined with resistant varieties, they can cut fungicide use by up to 30 percent.",
      "In India, ICAR-CPRI's JHULSACAST model, built on NEGFRY and SIMCAST ideas, adds daily weather values into a Disease Severity Value and recommends the first spray when the cumulative value passes about 18 to 20 units. CPRI reports 75 to 85 percent accuracy for first appearance (CPRI Annual Report 2022-23).",
    ],
    resistance: [
      "Foliage and tuber resistance are separate traits and are rated separately, usually on a 1 to 9 scale. A variety with good tuber resistance can still lose its haulm early.",
      "Resistant European varieties such as Sarpo Mira and Sarpo Axona are used in organic and low-input systems. Kufri Jyoti, released in India in 1968, carries blight resistance derived from Solanum demissum material.",
      "Resistance-gene stacking uses genes from wild relatives, for example Rpi-amr3 and Rpi-amr1 from Solanum americanum, which showed field resistance (GM Crops & Food, March 2025). Using resistant varieties raises average net income by about EUR 900 per hectare through fewer sprays (PMC reviews).",
    ],
    chemical: [
      "Spray programmes in north-west Europe run to 5 to 15 applications a season at EUR 200 to 400 per hectare. Classes in use: contact products (mancozeb, chlorothalonil, fluazinam), systemics (metalaxyl-M, cymoxanil), CAA fungicides (mandipropamid, dimethomorph), OSBPI fungicides (oxathiapiprolin), phosphonates and QoI products such as azoxystrobin.",
      "Resistance is rising. Metalaxyl resistance is widespread, and new resistance mechanisms to CAA and OSBPI fungicides have been found in the EU_43 and EU_46 genotypes (PMC, Springer Potato Research).",
      "Regulatory notes, EU: chlorothalonil was not renewed (Commission Implementing Regulation (EU) 2019/677) and mancozeb was not renewed (Regulation (EU) 2020/2087), so neither is available to EU growers. Check current national authorisations before relying on any product.",
      "Biological options, still at research stage: Trichoderma strains cut severity by more than 90 percent in some trials, and chitosan, Bacillus strains and potassium phosphite are also being studied (Springer Potato Research, Põldmets et al. 2025).",
    ],
    seed: [
      "Late blight is not a quarantine disease, but infected seed tubers are the main route by which it re-enters crops, so field inspections and tuber grading for blight are part of seed production.",
      "Pre-basic seed is grown under strict isolation, and tissue-culture starting material removes carry-over. True potato seed is free of tuber-borne disease, including late blight tuber rot (CIP).",
    ],
    sources: [
      { label: "EuroBlight, James Hutton Institute: genotype monitoring", url: "https://euroblight.net/" },
      { label: "EPPO Global Database: Phytophthora infestans", url: "https://gd.eppo.int/taxon/PHYTIN" },
      { label: "Springer, Potato Research (Põldmets et al., 2025) and PMC reviews on late blight management" },
      { label: "ICAR-CPRI Annual Reports 2020-21 and 2022-23", url: "https://cpri.icar.gov.in/" },
      { label: "CIP, International Potato Center", url: "https://cipotato.org/" },
    ],
    related: [
      { href: "/answers/what-is-late-blight", title: "What is late blight?", desc: "Short answer." },
      { href: "/varieties/sarpo-mira", title: "Sarpo Mira", desc: "Strong blight resistance." },
      { href: "/country/kenya", title: "Kenya", desc: "Highland blight pressure." },
      { href: "/knowledge/potato-diseases-pests", title: "Potato diseases and pests", desc: "Overview." },
    ],
  },

  {
    slug: "blackleg-soft-rot",
    name: "Blackleg and soft rot",
    latin: "Pectobacterium and Dickeya species",
    metaTitle: "Blackleg and Soft Rot of Potato: Control",
    metaDescription: "Blackleg and tuber soft rot (Pectobacterium, Dickeya): symptoms, seed-borne spread, risk regions, storage and seed-tolerance management.",
    h1: "Blackleg and soft rot (Pectobacterium and Dickeya)",
    lede: "Blackleg turns the stem base black and slimy, and the same bacteria rot tubers in the field and in store. They are carried in seed, there is no chemical cure, and seed certification is the main control, which is why blackleg tolerances appear in every certified class.",
    facts: [
      ["Cause", "Pectobacterium atrosepticum, P. carotovorum and relatives; Dickeya species"],
      ["Main source", "Latently infected seed tubers"],
      ["Chemical cure", "None effective"],
      ["Quarantine pest", "No (but certified for in seed)"],
    ],
    cause: [
      "The soft rot Pectobacteriaceae are a group of bacteria that produce enzymes which break down plant cell walls. Pectobacterium atrosepticum is the classic blackleg organism of cool climates. Dickeya species, including D. solani, emerged as a serious seed-borne problem in Europe from the 2000s and are more at home in warmer conditions.",
    ],
    symptoms: [
      "Blackleg: an inky black, slimy stem base, with stunted, upright, yellowing plants that may wilt. Plants can look fine and then collapse after rain or heat.",
      "Soft rot: wet, cream to tan, foul-smelling decay of the tuber that spreads in store when tubers are wet or short of oxygen. The decayed tissue is separated cleanly from healthy tissue and the skin often stays intact.",
    ],
    spread: [
      "Seed is the main source. Tubers can carry the bacteria without symptoms, and the infection passes to the stem and to daughter tubers.",
      "Machinery, wash water, wet harvest conditions and wounds spread it between lots. A wet tuber in a poorly ventilated store is where it multiplies fastest.",
    ],
    regions: [
      "Seed and ware production in Europe, North America and warmer irrigated regions. Dickeya and P. brasiliense are more prominent where seasons are warm. The Dutch NAK inspection protocol, for example, lists blackleg (Pectobacterium and Dickeya) among the diseases inspectors check in every seed field.",
    ],
    cultural: [
      "Start with certified seed from a low-blackleg class, and keep the seed generation count short.",
      "Avoid wounding and bruising at planting, harvest and grading. Do not harvest or store tubers wet. Let the skin set before harvest.",
      "Dry and cure tubers, ventilate the store and keep it cool, so condensation cannot form on the tuber surface.",
      "Clean and disinfect machinery between seed lots, and rotate to non-host crops.",
    ],
    resistance: [
      "No commercial variety is immune. Varieties differ in susceptibility and this is rated in national variety lists, but good seed health and storage conditions matter more than the rating.",
    ],
    chemical: [
      "There is no effective chemical cure for blackleg or soft rot. Management is preventive: clean seed, good handling and good storage.",
    ],
    seed: [
      "Blackleg is counted in field inspections, and every certified class has a maximum percentage. In Scotland's SPCS, for example, the maxima run from 0 percent in Pre-Basic 1 and 1.0 percent in Super Elite to 2.0 percent in Elite and 4.0 percent in Certified 1 (SASA technical notes, as summarised in the Potatopedia corpus).",
      "Dutch NAK inspectors make at least three inspections of each certified seed lot, and laboratories test for Pectobacterium and Dickeya.",
    ],
    sources: [
      { label: "NAK (Netherlands Inspection Service for Horticulture) seed potato inspection protocols", url: "https://www.nak.nl/" },
      { label: "SASA, Science and Advice for Scottish Agriculture: seed potato classification", url: "https://www.sasa.gov.uk/" },
      { label: "EPPO Global Database", url: "https://gd.eppo.int/" },
      { label: "University extension and peer-reviewed literature on soft rot Pectobacteriaceae" },
    ],
    related: [
      { href: "/answers/seed-potato-certification", title: "Seed potato certification", desc: "How classes and tolerances work." },
      { href: "/answers/netherlands-seed-potato-exports", title: "Netherlands seed exports", desc: "The global seed hub." },
      { href: "/knowledge/seed-potato-systems", title: "Seed potato systems", desc: "Pre-basic to certified." },
      { href: "/diseases/bacterial-wilt-brown-rot", title: "Bacterial wilt", desc: "The regulated bacterial disease." },
    ],
  },

  {
    slug: "bacterial-wilt-brown-rot",
    name: "Bacterial wilt and brown rot",
    latin: "Ralstonia solanacearum species complex",
    metaTitle: "Bacterial Wilt of Potato (Ralstonia): Control",
    metaDescription: "Bacterial wilt and brown rot (Ralstonia solanacearum): symptoms, seed spread, risk regions in Africa and Asia, clean seed, rotation and quarantine rules.",
    h1: "Bacterial wilt and brown rot (Ralstonia solanacearum)",
    lede: "Bacterial wilt is the main bacterial constraint on potato in warm highlands from East Africa to South-East Asia, and the same organism is regulated as brown rot in Europe and North America. It spreads in seed, soil and water, and no chemical controls it.",
    facts: [
      ["Cause", "Ralstonia solanacearum species complex (EPPO: RALSSO)"],
      ["Key strain on potato", "Race 3 biovar 2 (phylotype II)"],
      ["Chemical control", "None effective"],
      ["Seed tolerance", "Zero in all certified classes"],
    ],
    cause: [
      "The Ralstonia solanacearum species complex comprises R. solanacearum in the strict sense, R. pseudosolanacearum and R. syzygii (EPPO Global Database). On potato in the tropical highlands, race 3 biovar 2 is the main strain, for example in Indonesia, and strains of phylotype II sequevar 1 spread through latently infected seed in Uganda.",
    ],
    symptoms: [
      "Leaves wilt in warm weather while the plant stays green, often starting with one stem.",
      "Cut stems and tubers show browning of the vascular ring and a grey-white bacterial ooze, which may also appear at the eyes and the stolon end, sticking soil to the tuber surface.",
    ],
    spread: [
      "Latently infected seed tubers are the main route, which is why the disease crosses district and national boundaries in seed.",
      "The bacteria also persist in soil and plant debris and move in contaminated irrigation water, on machinery and on tools.",
    ],
    regions: [
      "Warm and tropical highlands: Indonesia, where it is endemic and causes losses of 15 to 25 percent; the Philippines; the East African highlands, where surveys in Uganda had 47.5 percent of respondents in Kabale and 36 percent in Kisoro naming it a major constraint; Ethiopia; Kenya; and Brazil. In Europe and North America it is regulated, with occasional outbreaks.",
      "In Ethiopia, bacterial wilt has been found at high frequency in the seed potato system, and the authors of a 2025 study of seed quality assurance warn that exports to countries where it has not been reported are at risk (Tessema et al., Agriculture, 2025).",
    ],
    cultural: [
      "Plant clean, tested seed. This is the single most effective step.",
      "Rotate with non-host crops for several seasons and control volunteer potatoes and solanaceous weeds.",
      "Do not irrigate from surface water that may be contaminated, and clean tools and machinery between fields.",
    ],
    resistance: [
      "Varieties with partial tolerance exist. Igorota, a CIP-derived variety released in the Philippines in the late 1990s, was bred for tolerance to bacterial wilt and late blight, with an estimated 10 to 15 percent of planted area (BPI Philippines variety registry, as summarised in the corpus).",
    ],
    chemical: [
      "No effective chemical control is available. Regulatory notes: in the EU the organism is regulated as a quarantine pest under plant-health law, and seed lots are tested by PCR, with a 0 percent tolerance in every certified class (EU Directive 2002/56/EC framework).",
    ],
    seed: [
      "Zero tolerance for brown rot applies in every certified class, and laboratories test seed lots by PCR. Pre-basic material comes from tissue culture, which cleans the line.",
      "In Ethiopia, about 98.3 percent of potato planting stock may come from the informal system, and under the quality declared seed approach 90 percent of field quality control is internal and 10 percent external, based on visual observation. The 2025 study calls this 'a recipe for the transfer of seed-borne disease, particularly bacterial wilt' (Tessema et al., 2025).",
    ],
    sources: [
      { label: "EPPO Global Database: Ralstonia solanacearum species complex", url: "https://gd.eppo.int/taxon/RALSSO" },
      { label: "Tessema, Kakuhenzire and McEwan, Seed Potato Quality Assurance in Ethiopia, Agriculture 2025, 15(5), 517", url: "https://doi.org/10.3390/agriculture15050517" },
      { label: "CIP and NARO, studies of Uganda potato production constraints" },
      { label: "BALITSA research reports (Indonesia) and BPI Philippines variety registry, as summarised in the corpus" },
    ],
    related: [
      { href: "/country/uganda", title: "Uganda", desc: "Bacterial wilt in Kabale and Kisoro." },
      { href: "/country/ethiopia", title: "Ethiopia", desc: "Informal seed and quality declared seed." },
      { href: "/country/indonesia", title: "Indonesia", desc: "Endemic race 3 biovar 2." },
      { href: "/answers/seed-potato-certification", title: "Seed potato certification", desc: "Zero tolerance for regulated bacteria." },
    ],
  },

  {
    slug: "potato-cyst-nematode",
    name: "Potato cyst nematode",
    latin: "Globodera rostochiensis and G. pallida",
    metaTitle: "Potato Cyst Nematode: Control and Regulation",
    metaDescription: "Potato cyst nematode (Globodera rostochiensis, G. pallida): biology, spread, Kenya, Idaho and New Zealand cases, resistant varieties, rotation and EU rules.",
    h1: "Potato cyst nematode (Globodera rostochiensis and G. pallida)",
    lede: "Potato cyst nematodes live in the soil, survive for years as cysts and are spread on soil that clings to machinery and seed. They are regulated in more than 100 countries. Control rests on land testing, long rotations and resistant varieties.",
    facts: [
      ["Species", "Golden (G. rostochiensis) and pale (G. pallida) cyst nematodes"],
      ["Cyst survival", "Up to 20 years in soil; survive -15 C"],
      ["Eggs per cyst", "About 300 to 500"],
      ["EU rule", "Directive 2007/33/EC"],
    ],
    cause: [
      "A cyst is about 0.5 mm across and holds roughly 300 to 500 eggs. Cysts can remain viable in soil for up to 20 years and survive temperatures of -15 C. With no host crop, cyst numbers in temperate regions fall by only about 0 to 20 percent a year (Mburu et al., Frontiers in Plant Science, 2020).",
      "The European yield-loss rule used in that paper is 2.75 tonnes per hectare lost for every 20 viable eggs per gram of soil.",
    ],
    symptoms: [
      "Patches of stunted, yellowing plants that wilt in dry spells and form small tubers. Symptoms can be mistaken for drought or nutrient stress. Confirmation needs a soil test for cysts.",
    ],
    spread: [
      "Mainly in contaminated soil carried on machinery, equipment and seed tubers, and on boots and containers. The pest does not move far unaided.",
    ],
    regions: [
      "Europe, the Andes (the origin), East Africa, North America, New Zealand and elsewhere.",
      "Kenya: a 2016 to 2018 survey of 20 counties found cysts in 968 of 1,348 soil samples (71.8 percent), in every county, and 18 of 22 certified seed farms (82 percent) were infested. PCN testing then became mandatory for seed certification in Kenya (Mburu et al., 2020).",
      "United States: pale cyst nematode was first found in Idaho in 2006 and has not been detected elsewhere. The regulated area fell from 6,495 acres at the start of FY2024 to 6,265.64 acres in FY2025, across 31 fields, and fumigation has cut populations by 99 percent. Golden nematode is confined to parts of eight New York counties, where 45 resistant varieties have been developed (USDA APHIS PPQ, 2025 annual report).",
      "New Zealand: potato cyst nematode has been present since 1972 to 1976 and is one of the industry's two defining biosecurity threats (Potatoes New Zealand).",
    ],
    cultural: [
      "Test the land before planting seed. Soil sampling for cysts is mandatory under EU rules.",
      "Rotate with non-host crops for as long as the cyst count requires, which in practice means several years.",
      "Clean machinery and containers. USDA's quarantine in Idaho requires sanitation or steam treatment of farm equipment leaving the regulated area.",
    ],
    resistance: [
      "Resistant varieties are the main tool. Many carry resistance to the golden nematode (the Ro1 pathotype), which is well characterised, while resistance to pale cyst nematode is less common. Variety lists give a rating for each. Resistant varieties are in development in the United States for the pale cyst nematode (USDA ARS and University of Idaho).",
    ],
    chemical: [
      "Soil fumigation and nematicides are tightly controlled, expensive and often limited to quarantine use. In Idaho, fumigation is part of the eradication programme. Regulatory notes: in the EU, potato cyst nematodes are controlled under Council Directive 2007/33/EC, which requires land used for seed potatoes to be sampled and found free of them.",
    ],
    seed: [
      "Seed potatoes may be grown only on land found free of cyst nematodes. Pre-Elite and Elite lines are produced in sterile or tested conditions.",
      "Kenya's survey showed that certified seed farms can still be infested, which is why PCN testing was added to its certification.",
    ],
    sources: [
      { label: "Mburu et al., Potato Cyst Nematodes: A New Threat to Potato Production in East Africa, Frontiers in Plant Science 11:670 (2020)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7261874" },
      { label: "USDA APHIS PPQ, 2025 Annual Report: Specialty Crop Pests", url: "https://www.aphis.usda.gov/sites/default/files/2025-annual-report-specialty-crop-pests.pdf" },
      { label: "EPPO Global Database: Globodera rostochiensis; Globodera pallida", url: "https://gd.eppo.int/taxon/HETDRO" },
      { label: "Potatoes New Zealand, PCN fact sheet", url: "https://www.potatoesnz.co.nz/" },
    ],
    related: [
      { href: "/country/kenya", title: "Kenya", desc: "PCN survey findings." },
      { href: "/country/united-states", title: "United States", desc: "Idaho and New York." },
      { href: "/answers/seed-potato-certification", title: "Seed potato certification", desc: "Land testing for seed." },
      { href: "/knowledge/potato-diseases-pests", title: "Potato diseases and pests", desc: "Overview." },
    ],
  },

  {
    slug: "common-scab",
    name: "Common scab",
    latin: "Streptomyces scabiei and related species",
    metaTitle: "Common Scab of Potato: Causes and Control",
    metaDescription: "Common scab (Streptomyces): corky tuber lesions, soil and moisture conditions, resistant varieties, irrigation timing and what seed certification covers.",
    h1: "Common scab (Streptomyces scabiei)",
    lede: "Common scab roughens the tuber skin with corky lesions. It rarely reduces yield, but it downgrades fresh-market and seed crops. The bacteria live in the soil, so control comes from variety choice, soil moisture at tuber initiation and rotation, not from a spray.",
    facts: [
      ["Cause", "Streptomyces scabiei and related soil bacteria"],
      ["Main damage", "Cosmetic: downgrades fresh-market and seed lots"],
      ["Key control", "Variety and moisture at tuber initiation"],
      ["Chemical control", "No reliable product"],
    ],
    cause: [
      "Streptomyces are filamentous soil bacteria. Several species cause scab, and some tolerate acid soils, so a low soil pH does not guarantee a clean crop.",
    ],
    symptoms: [
      "Corky, rough lesions on the tuber surface in three common forms: shallow russet-like netting, raised cork-like lesions and pitted lesions. They do not affect eating quality once the skin is peeled.",
    ],
    spread: [
      "The bacteria survive in soil and on infected seed tubers. Infection happens in the weeks after tuber initiation, when the young tuber skin is vulnerable, and is favoured by dry soil during that period.",
    ],
    regions: [
      "Worldwide. It is a standard rating in European and North American variety lists, and an important quality defect in fresh-market production in all producing regions.",
    ],
    cultural: [
      "Keep soil moist, without waterlogging, through tuber initiation, which in most crops means the first few weeks of tuber set.",
      "Avoid liming immediately before potatoes where scab is a problem, and use a rotation that does not return potatoes or other scab hosts to the same field too often.",
      "Plant seed with clean skin, because infected seed carries the bacteria into the new field.",
    ],
    resistance: [
      "Variety is the most effective tool. Variety datasheets give a 1 to 9 rating for common scab, and some listed varieties show strong resistance. A Germicopa variety, for instance, is described as having exceptional resistance to netted common scab and fairly high resistance to pitted common scab, and Fontane has limited susceptibility, with ratings in the 5.5 to 7 range (breeder datasheets).",
    ],
    chemical: [
      "No chemical gives reliable control of common scab. Seed treatments may reduce seed-borne carryover but do not clean up infested soil. Always check current national approvals before using any product.",
    ],
    seed: [
      "Seed standards limit the amount of scab visible on the tuber surface, and a lot with heavy scab will be downgraded or rejected even though scab is not a regulated disease. Common scab is therefore a practical grading issue more than a quarantine one.",
    ],
    sources: [
      { label: "AHDB Potato Variety Database and European Cultivated Potato Database: resistance ratings", url: "https://potatoes.ahdb.org.uk/" },
      { label: "Germicopa and Fontane variety datasheets, as summarised in the Potatopedia corpus" },
      { label: "University extension and peer-reviewed literature on Streptomyces scab management" },
    ],
    related: [
      { href: "/varieties/fontane", title: "Fontane", desc: "Fry variety with scab ratings." },
      { href: "/varieties", title: "All varieties", desc: "Compare resistance traits." },
      { href: "/seed-field/certified-seed-potatoes", title: "Certified seed potatoes", desc: "What the label guarantees." },
      { href: "/knowledge/potato-diseases-pests", title: "Potato diseases and pests", desc: "Overview." },
    ],
  },

  {
    slug: "pvy-viruses",
    name: "PVY and potato viruses",
    latin: "Potato virus Y and related viruses",
    metaTitle: "PVY and Potato Viruses: Spread and Control",
    metaDescription: "Potato virus Y (PVY), leafroll and mild viruses: symptoms, aphid and seed spread, virus-free seed classes, resistant varieties and certification tolerances.",
    h1: "PVY and potato viruses",
    lede: "Viruses build up in seed from one generation to the next, and aphids carry them between plants. PVY is the most widespread and most damaging, and the main defence is virus-free seed, short seed generation counts and seed grown where aphids are scarce.",
    facts: [
      ["Main viruses", "PVY, PLRV (severe); PVX, PVS, PVM (mild)"],
      ["PVY strains", "PVYO, PVYN and PVYNTN (tuber necrotic ringspot)"],
      ["Spread", "Seed tubers and aphids"],
      ["Chemical cure", "None; aphid control only"],
    ],
    cause: [
      "Potato virus Y is a potyvirus. Scottish certification rules divide viruses into severe (PLRV and PVY, which cause large yield loss) and mild (PVX, PVS and PVM). Strains of PVY differ: PVYNTN causes tuber necrotic ringspot disease, which damages tubers, and breeders rate varieties for resistance to it separately.",
    ],
    symptoms: [
      "PVY: mottling, crinkling and necrosis of leaves, and in some strains necrotic rings on tubers. Symptoms vary with variety, strain and temperature, and some varieties carry the virus with few signs.",
      "PLRV (leafroll): upward rolling and a leathery feel in leaves, and net necrosis in tubers in some varieties.",
      "Mild viruses: slight mosaic and little yield loss, but they are tested for in seed.",
    ],
    spread: [
      "Infected seed tubers carry the virus into the next crop. PVY is then carried plant to plant by aphids, including species that only visit the crop briefly, so field control is difficult.",
      "Because the virus passes through the tuber, it accumulates over generations, which is why certification limits the number of field generations from tissue culture.",
    ],
    regions: [
      "Everywhere potatoes are grown from tubers. Seed is produced in cooler, windier or higher areas where aphid pressure is lower: for example Segovia and Avila in Spain, northern Scotland and the Dutch seed areas. True potato seed is free of all major potato viruses, which is one attraction of TPS (CIP).",
    ],
    cultural: [
      "Use certified virus-tested seed and replace it regularly.",
      "Rogue infected plants early in seed crops, kill haulm early to limit the window for aphid transmission, and use mineral-oil sprays and border crops where they are recommended.",
      "Monitor aphid flights and keep seed crops away from older potato crops.",
    ],
    resistance: [
      "Variety ratings for PVY range widely on the 1 to 9 scale. Payette Russet and Castle Russet have complete immunity to PVY, but are largely ignored by the industry because of dormancy and defect problems, and are of interest as breeding parents (research reviews summarised in the corpus). Gene-based resistance (Ry genes) is the target of modern breeding.",
    ],
    chemical: [
      "No chemical cures an infected plant. Insecticides against aphids give limited protection against PVY, because the virus is transmitted within seconds of probing. Regulatory notes are product-specific, so check national approvals.",
    ],
    seed: [
      "Laboratories test seed by ELISA for PVY, PLRV, PVX, PVS and PVM. Scotland's SPCS caps severe virus at 0 percent in Pre-Basic 1, 0.5 percent in Super Elite, 1.0 percent in Elite and 2.0 percent in Certified 1, with higher mild-virus caps (SASA technical notes, as summarised in the corpus).",
      "In the Dutch NAK system, maximum virus tolerances run from 0.1 percent in the highest field class to 10 percent in the lowest certified class.",
    ],
    sources: [
      { label: "SASA, Scottish Potato Classification Scheme technical notes", url: "https://www.sasa.gov.uk/" },
      { label: "NAK (Netherlands) seed potato inspection protocols", url: "https://www.nak.nl/" },
      { label: "EPPO Global Database: Potato virus Y", url: "https://gd.eppo.int/taxon/PVY000" },
      { label: "CIP, True potato seed and virus-free seed", url: "https://cipotato.org/" },
    ],
    related: [
      { href: "/answers/true-potato-seeds", title: "True potato seeds", desc: "Free of tuber-borne virus." },
      { href: "/answers/seed-potato-certification", title: "Seed potato certification", desc: "Classes and tolerances." },
      { href: "/seed-field/certified-seed-potatoes", title: "Certified seed potatoes", desc: "What certification guarantees." },
      { href: "/country/spain", title: "Spain", desc: "Seed grown in Segovia and Avila." },
    ],
  },
];

export const DISEASE_BY_SLUG = Object.fromEntries(DISEASES.map((d) => [d.slug, d]));

export const SHORT_DISEASES = [
  {
    id: "zebra-chip",
    h2: "Zebra chip",
    p: "Zebra chip is caused by the bacterium Candidatus Liberibacter solanacearum, carried by the tomato potato psyllid (Bactericera cockerelli). It stains the tuber's internal carbohydrate structure in dark stripes that show up when the tuber is fried. The psyllid was first recorded in New Zealand in March 2006, and the bacterium was identified in New Zealand potato crops in 2008 (Potatoes New Zealand and journal literature, as summarised in the Potatopedia corpus). Control is based on psyllid monitoring and insecticide timing.",
  },
  {
    id: "ring-rot",
    h2: "Bacterial ring rot",
    p: "Ring rot, caused by Clavibacter sepedonicus, is a regulated bacterial disease that rots the vascular ring of the tuber. It has zero tolerance in seed in every certified class, and Germany requires testing of all seed lots under the Plant Protection Act. It spreads through infected seed and on equipment and crates, which can carry the bacterium for long periods. The standard defence is certified seed and cleaning and disinfecting everything that touches seed (EPPO Global Database; Bundessortenamt).",
  },
  {
    id: "wart",
    h2: "Potato wart",
    p: "Potato wart disease, caused by Synchytrium endobioticum, produces cauliflower-like outgrowths on tubers and is a quarantine pest in most potato-producing countries. Its resting spores persist in soil for many years, so affected fields are placed under movement restrictions. Detections in Prince Edward Island have at times interrupted exports to the United States, and Canada's CFIA enforces quarantine zones and movement controls. Resistant varieties are the practical defence, and variety lists show resistance to the pathotypes present (CFIA; EPPO Global Database).",
  },
];
