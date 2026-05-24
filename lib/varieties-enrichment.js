// Variety page enrichment content (D1 from comprehensive SEO audit).
// Two paths:
//   1) HAND_CRAFTED — 12 marquee varieties with rich agronomy/breeding/use sections.
//   2) TEMPLATED_TIER — next 50 commercially-significant varieties; getTemplatedSections()
//      generates 4 H2 sections from variety attributes.
// Remaining 176 long-tail varieties: keep at the Tier-2 schema-only baseline.
//
// Each entry returns an array of { id, heading, paragraphs[] } objects to be
// rendered as additional H2 sections on the variety page below the existing
// "About this variety" block.

// Top-12 marquee varieties. Cited content from CIP, USDA, AHDB, ICAR-CPRI, KALRO, NPCK.
export const HAND_CRAFTED = {
  "russet-burbank": [
    {
      id: "russet-burbank-history",
      heading: "Origin and breeding history of Russet Burbank",
      paragraphs: [
        "Russet Burbank originated in 1872 when American horticulturalist Luther Burbank selected a seedling from an Early Rose variety in Lunenburg, Massachusetts (USDA-ARS; American Journal of Potato Research). The russet-skinned mutation that later became known as Russet Burbank emerged as a sport selection from Burbank's original line, with commercial release in the early 1900s. Burbank himself sold the rights to the original variety for $150 and moved to California to become one of the most prolific plant breeders in American history.",
        "Despite being over 150 years old, Russet Burbank remains the dominant US processing potato — occupying 60–70% of Idaho's commercial acreage and supplying the bulk of McDonald's, Lamb Weston, and J.R. Simplot frozen-fry production (Idaho Potato Commission; USDA NASS). The variety's persistence reflects a difficult-to-replicate combination of high specific gravity (~1.080–1.090), long oblong tuber shape, low reducing sugars, and excellent storage life that supports year-round supply for global QSR chains.",
      ],
    },
    {
      id: "russet-burbank-uses",
      heading: "Why Russet Burbank dominates frozen french fry production",
      paragraphs: [
        "Russet Burbank's high dry-matter content (~22%) and low reducing-sugar levels make it ideal for the Maillard browning that produces the iconic golden, crispy McDonald's fry. Specific gravity above 1.080 — the industry threshold for processing-grade — is consistently achievable with proper irrigation and nutrient management. The variety's long oblong shape allows efficient cutting into the standard 6mm × 6mm × 75mm french fry geometry with minimal trim loss (Lamb Weston grower specifications; American Society of Agronomy).",
        "Beyond fries, Russet Burbank is the workhorse of the US fresh-baking market — sold under the 'Idaho potato' marketing brand certified by the Idaho Potato Commission. The variety's storage life of 8–10 months under controlled conditions enables year-round retail availability. Read more about how processors use it in our <a href=\"/knowledge/mcdonalds-potato-varieties\" style=\"color:#C62828;text-decoration:none\">McDonald's varieties article</a>.",
      ],
    },
    {
      id: "russet-burbank-agronomy",
      heading: "Agronomic profile and growing requirements",
      paragraphs: [
        "Russet Burbank is a late-maturing variety requiring 130–150 days from planting to harvest under typical Pacific Northwest conditions, making it unsuitable for short-season climates. The variety is highly sensitive to water, temperature, and nitrogen stress: irregular irrigation causes hollow heart and brown center; heat spikes during tuber bulking produce sugar ends; excess nitrogen delays maturity (University of Idaho Extension; USDA-ARS).",
        "Commercial Idaho and Pacific Northwest growers manage these risks through center-pivot irrigation scheduling, split-application nitrogen, and tight harvest-window timing. Susceptibility to Verticillium wilt and PVY remains a challenge. For comprehensive growing guidance see our <a href=\"/knowledge/complete-potato-growing-guide\" style=\"color:#C62828;text-decoration:none\">complete potato growing guide</a>. Yields of 50–70 t/ha are achievable under intensive irrigated commercial management; smallholder yields in less-controlled settings are 30–40% lower.",
      ],
    },
  ],
  "yukon-gold": [
    {
      id: "yukon-gold-history",
      heading: "Origin and breeding history of Yukon Gold",
      paragraphs: [
        "Yukon Gold was developed by Garnet (Gary) Johnston at the University of Guelph, Canada, with the cross initiated in 1966 between Norgleam (a US white-fleshed variety) and W5279-4 (a wild yellow-flesh selection). Commercial release came in 1980 (University of Guelph; Agriculture and Agri-Food Canada). The name combines 'Yukon' (a nod to the Klondike Gold Rush) with 'gold' for the distinctive yellow flesh — at the time an unusual visual marker in the predominantly white-flesh North American market.",
        "Yukon Gold rapidly displaced traditional white-flesh all-purpose varieties across Canada and the northern United States and is now the most-recognised North American specialty variety for retail bakeware-aisle distribution. Its commercial success catalysed broader consumer acceptance of yellow-flesh potatoes globally, paving the way for varieties like Innovator and Markies to enter mainstream channels.",
      ],
    },
    {
      id: "yukon-gold-uses",
      heading: "End uses and culinary applications of Yukon Gold",
      paragraphs: [
        "Yukon Gold is classified as an all-purpose variety with mid-range specific gravity (1.070–1.080), placing it between fully waxy boiling potatoes and high-starch baking russets. The buttery yellow flesh is favoured for mashing, roasting, boiling, and salads — the variety holds shape adequately when boiled and mashes to a creamy texture without excess water. It is not a processing-grade fry variety; specific gravity is too low and reducing sugars too high for commercial frozen-fry production.",
        "Retail demand has been strong enough to support consistent acreage in Canada (Manitoba, Prince Edward Island, Ontario), the US Pacific Northwest, and parts of the Great Lakes region. The variety maintains a price premium over white-flesh equivalents in retail markets due to consumer recognition.",
      ],
    },
    {
      id: "yukon-gold-agronomy",
      heading: "Agronomic profile of Yukon Gold",
      paragraphs: [
        "Yukon Gold matures in 90–100 days — substantially earlier than Russet Burbank's 130–150 day window, making it suitable for shorter-season climates including the upper Midwest and Atlantic Canada. The variety has good resistance to common scab and dry rot but is moderately susceptible to late blight and Verticillium wilt (Cornell Cooperative Extension; AAFC).",
        "Yields of 35–45 t/ha are typical under irrigated commercial conditions. Tuber size profile favours the retail bake-and-table market (medium to large tubers); processing-grade size grading is not a primary focus. Storage life is moderate at 5–7 months under controlled conditions — shorter than Russet Burbank, reflecting the variety's mid-season maturity and waxier flesh profile.",
      ],
    },
  ],
  "maris-piper": [
    {
      id: "maris-piper-history",
      heading: "Origin of Maris Piper",
      paragraphs: [
        "Maris Piper was bred by the Plant Breeding Institute (PBI) at Cambridge, England, with commercial release in 1966 (AHDB Potato Variety Database; PBI). The cross combined Arran Cairn with a PBI breeding line targeting golden-cyst nematode resistance — a major breakthrough that made the variety commercially viable across PCN-affected UK soils. The 'Maris' prefix is the PBI breeding-station naming convention; 'Piper' was selected as the public-facing varietal name.",
        "Today Maris Piper is the UK's most widely-grown potato variety by both area and volume, dominating both the fresh-pack retail and chip-shop frying markets. Approximately 16% of UK potato area is planted to Maris Piper according to AHDB. The variety remains popular despite being nearly six decades old because of its consistent eating quality and widespread consumer recognition.",
      ],
    },
    {
      id: "maris-piper-uses",
      heading: "Maris Piper's culinary versatility",
      paragraphs: [
        "Maris Piper is classified as a floury (high-starch) variety with specific gravity around 1.080, making it ideal for chip-shop frying, roasting, mashing, and baking. The variety's distinctive cream-coloured flesh and creamy-when-cooked texture have made it the default UK fish-and-chip variety for over 40 years, with most British chip shops sourcing exclusively Maris Piper or close substitutes.",
        "The retail market favours Maris Piper for the same all-purpose adaptability — pre-pack washed Maris Piper is a standard SKU in every major UK supermarket. Retail labelling often highlights the 'Maris Piper' name as a quality cue rather than just a variety descriptor, similar to how 'Idaho potato' functions as a brand in the US.",
      ],
    },
    {
      id: "maris-piper-agronomy",
      heading: "Agronomic profile of Maris Piper",
      paragraphs: [
        "Maris Piper matures in 110–125 days, suitable for the UK main-crop window (April–May planting, September–October harvest). The variety's PCN resistance was a key feature at release but newer PCN populations (G. pallida pathotype Pa2/3) have eroded that advantage. Late blight susceptibility is moderate to high, requiring 12–20 fungicide sprays per season under typical UK weather (AHDB).",
        "Yields of 40–50 t/ha are typical under UK commercial conditions; storage life of 8–10 months supports the year-round retail and chip-shop supply chain. The variety performs well in the UK's cool-maritime climate but is less successful in Mediterranean or sub-tropical conditions where heat stress reduces yield.",
      ],
    },
  ],
  "bintje": [
    {
      id: "bintje-history",
      heading: "Origin of Bintje",
      paragraphs: [
        "Bintje was developed by Dutch teacher and amateur potato breeder Kornelis Lieuwes de Vries in 1910, with commercial release shortly thereafter (NAK Netherlands; Wageningen University). The variety was named after Bintje Jansma, one of de Vries's students. The cross combined Munstersen with Fransen — both period Dutch varieties.",
        "Bintje rapidly became the dominant Belgian and Dutch fry variety and remained so for nearly a century. Belgian frites — widely considered the canonical European fry — were made almost exclusively from Bintje from the 1920s through the 1990s. Even today Bintje retains significant acreage in Belgium and the Netherlands despite gradual displacement by newer high-yielding processing varieties.",
      ],
    },
    {
      id: "bintje-uses",
      heading: "Why Bintje defined Belgian frites",
      paragraphs: [
        "Bintje's specific gravity of 1.075–1.085 sits in the floury-to-medium range — suitable for double-fried Belgian frites, where the first fry at 130°C cooks the interior and the second fry at 175°C produces the crispy exterior. The variety's yellow flesh delivers a distinctive flavour profile that many fry connoisseurs argue cannot be replicated by newer processing varieties.",
        "Bintje is also extensively used in Dutch and German cooking for boiling, mashing, and gratin preparations. Storage life is excellent at 8–10 months. The variety's centenary commercial success is a structural anomaly in agriculture — most cultivars cycle out within 30–50 years.",
      ],
    },
    {
      id: "bintje-agronomy",
      heading: "Agronomic profile and modern alternatives",
      paragraphs: [
        "Bintje matures in 110–130 days under typical Northwest European conditions and yields 35–45 t/ha — competitive but not class-leading. Susceptibility to late blight, common scab, and PVY is moderate. Newer processing varieties (Innovator, Markies, Fontane, Lady Rosetta) deliver higher yields and more consistent specific gravity but at the cost of the distinctive Bintje flavour profile.",
        "Belgian and Dutch processors increasingly blend Bintje with higher-yielding varieties for cost optimisation. Pure-Bintje labelling now functions as a premium retail signal in much the same way 'Maris Piper' does in the UK.",
      ],
    },
  ],
  "atlantic": [
    {
      id: "atlantic-history",
      heading: "Atlantic — the chip-stock standard",
      paragraphs: [
        "Atlantic was developed by USDA-ARS Beltsville with commercial release in 1976 (USDA-ARS; American Journal of Potato Research). The cross combined Wauseon with USDA breeding line B5141-6, targeting high specific gravity, low reducing sugars, and uniform round-to-oval tuber shape — the agronomic profile required for industrial potato chip production.",
        "Atlantic became the dominant US chip-processing variety from the 1980s onward, supplying Frito-Lay (Lay's), Utz, Wise, and other major North American chip processors. The variety's specific gravity of 1.085–1.095 is among the highest of any commercial cultivar and produces the dense, crispy chip texture that defines US salty-snack distribution.",
      ],
    },
    {
      id: "atlantic-uses",
      heading: "Atlantic's processing dominance and decline",
      paragraphs: [
        "Atlantic dominated US chip processing for three decades but has been gradually displaced by newer chip-stock varieties (Lamoka, Hodag, Snowden) that offer comparable specific gravity with better cold-storage tolerance and lower acrylamide. Atlantic's reducing-sugar accumulation under cold storage (below 10°C) is a significant constraint — chips produced from cold-stored Atlantic show dark colour and bitter flavour from Maillard browning.",
        "The variety remains in commercial use as a benchmark for chip processing quality and is still widely planted across Florida, New York, Wisconsin, and other major chip-stock production states. Atlantic was the dominant variety used in early Indian chip processing before Kufri Chipsona-3 (2005) replaced it for domestic production.",
      ],
    },
    {
      id: "atlantic-agronomy",
      heading: "Agronomic profile of Atlantic",
      paragraphs: [
        "Atlantic matures in 100–110 days, favouring early-to-mid-season harvest windows in chip-processing states. Yields of 40–55 t/ha are typical under intensive commercial conditions; tuber size profile favours the medium round shape required for chip slicing. The variety is moderately susceptible to common scab, internal heat necrosis, and late blight.",
        "For broader chip-processing context see our <a href=\"/knowledge/potato-processing-industry\" style=\"color:#C62828;text-decoration:none\">global processing industry article</a> covering Frito-Lay's $25B chip segment.",
      ],
    },
  ],
  "desiree": [
    {
      id: "desiree-history",
      heading: "Désirée — the global red-skinned classic",
      paragraphs: [
        "Désirée was developed by Dutch breeder ZPC (Zaadhandel Pootgoed Combinatie) with commercial release in 1962 (NAK Netherlands; CIP). The cross combined Urgenta with Depesche, both Dutch breeding lines from the 1950s. Désirée was bred for high yield + red-skin appearance + all-purpose culinary use, hitting all three targets.",
        "The variety is now planted in over 100 countries and is among the top 5 most globally-distributed potato varieties — competing with Russet Burbank, Bintje, Maris Piper, and Yukon Gold for that position. Adaptation to a wide range of climates — from Mediterranean to sub-tropical — has driven the global distribution.",
      ],
    },
    {
      id: "desiree-uses",
      heading: "Désirée's all-purpose versatility",
      paragraphs: [
        "Désirée's specific gravity of 1.075–1.083 places it in the medium range, suitable for boiling, mashing, roasting, and baking. The red skin + yellow flesh combination delivers strong retail visual appeal. The variety is not used for industrial fry processing — specific gravity is borderline and reducing sugars are too high — but is excellent for fresh-market and casual home use.",
        "Designed for retail and home-cooking markets, Désirée has been widely adopted in the UK (where it competes with Maris Piper), Australia, parts of Africa, and Latin America. Its yield consistency across diverse soil and climate conditions has made it a default red-skin variety in many emerging markets.",
      ],
    },
    {
      id: "desiree-agronomy",
      heading: "Agronomic profile of Désirée",
      paragraphs: [
        "Désirée matures in 100–120 days and yields 40–50 t/ha under irrigated commercial conditions. The variety has good resistance to common scab and Globodera rostochiensis (golden potato cyst nematode) but is susceptible to late blight and PLRV. Storage life is 6–8 months — adequate for retail supply but shorter than Russet Burbank or Maris Piper.",
        "The variety performs well across temperate and sub-tropical regions, with successful production documented in countries from the Netherlands to Egypt to Kenya. This adaptability is the structural reason for its global commercial success.",
      ],
    },
  ],
  "charlotte": [
    {
      id: "charlotte-history",
      heading: "Charlotte — French waxy salad classic",
      paragraphs: [
        "Charlotte was developed by French breeder Grocep (now part of HZPC) with commercial release in 1981 (HZPC variety register; Europatat). The cross combined Hansa with Danava — both Northern European breeding lines targeting waxy salad-grade quality with elongated tuber shape and yellow flesh.",
        "Charlotte rapidly became the European standard waxy salad potato, particularly in France, Belgium, and the Netherlands. The variety's distinctive elongated 'finger' shape and waxy yellow flesh made it the preferred choice for boil-and-serve presentations in restaurant and retail markets across Western Europe.",
      ],
    },
    {
      id: "charlotte-uses",
      heading: "Charlotte's culinary positioning",
      paragraphs: [
        "Charlotte is a classic waxy variety with low specific gravity (1.060–1.075), making it suitable for boiling and salads where intact tuber shape is required. The variety is unsuitable for frying, mashing, or baking — its low starch content and high moisture content produce poor results in those applications.",
        "Retail positioning emphasises the 'salad potato' use case, often packaged in 500g–1kg net bags with cooking guidance specifically discouraging mashing/baking. Charlotte commands a 30–60% premium over generic all-purpose varieties at European supermarkets.",
      ],
    },
    {
      id: "charlotte-agronomy",
      heading: "Agronomic profile of Charlotte",
      paragraphs: [
        "Charlotte matures in 90–110 days and yields 30–45 t/ha — moderate but consistent. The variety has good resistance to common scab and Y-virus but is moderately susceptible to late blight. Storage life is good at 6–8 months. Tubers maintain firm texture even after long storage, supporting the waxy salad-grade positioning.",
        "Production is concentrated in France, Belgium, Netherlands, and the UK; the variety's premium retail price supports continued planting despite lower yields than processing varieties. For broader variety context see our <a href=\"/knowledge/potato-varieties-guide\" style=\"color:#C62828;text-decoration:none\">complete potato varieties guide</a>.",
      ],
    },
  ],
  "innovator": [
    {
      id: "innovator-history",
      heading: "Innovator — the modern frozen-fry workhorse",
      paragraphs: [
        "Innovator was developed by Dutch breeder HZPC with commercial release in 1999 (HZPC variety register; NAK). The variety was specifically bred for industrial frozen french fry processing as a higher-yielding alternative to Russet Burbank, with comparable specific gravity and chip-quality characteristics but significantly better disease resistance and yield potential.",
        "Innovator has been adopted across European frozen-fry processing — particularly in Belgium and the Netherlands where Aviko, Farm Frites, and Mydibel use it as a primary processing variety. The variety has also entered Argentine and US production for processors looking to diversify away from Russet Burbank's historical agronomic constraints.",
      ],
    },
    {
      id: "innovator-uses",
      heading: "Innovator's frozen french fry positioning",
      paragraphs: [
        "Innovator's specific gravity of 1.082–1.095 is at the high end of processing-grade requirements, supporting the dense, crispy French fry texture demanded by global QSR contracts. Long oblong tuber shape allows efficient cutting into 6mm × 6mm × 75mm fry geometry similar to Russet Burbank. Reducing-sugar accumulation under storage is lower than Russet Burbank, supporting longer cold-storage windows.",
        "The variety is used by major European processors and increasingly in Argentine and US production. For context on the global frozen-fry industry where Innovator operates see our <a href=\"/knowledge/potato-processing-industry\" style=\"color:#C62828;text-decoration:none\">global processing industry article</a>.",
      ],
    },
    {
      id: "innovator-agronomy",
      heading: "Agronomic profile of Innovator",
      paragraphs: [
        "Innovator matures in 110–130 days and yields 50–65 t/ha under irrigated commercial conditions — substantially higher than Russet Burbank's 50–70 t/ha typical range. The variety has improved resistance to PCN (Globodera rostochiensis), common scab, and PVY compared to legacy processing varieties.",
        "Drought tolerance is moderate; the variety prefers well-irrigated conditions for full yield potential. Storage life of 8–10 months supports year-round processing supply chains. The variety has become a default modern alternative to Russet Burbank for processors looking for similar quality with better agronomic robustness.",
      ],
    },
  ],
  "kufri-jyoti": [
    {
      id: "kufri-jyoti-history",
      heading: "Kufri Jyoti — India's longest-running potato variety",
      paragraphs: [
        "Kufri Jyoti was developed by ICAR-CPRI (Central Potato Research Institute) at Shimla, with commercial release in 1968 (ICAR-CPRI; Indian Journal of Agricultural Sciences). The cross combined 3069-d-4 with 2814-a-1 — both CPRI breeding lines targeting Indian sub-tropical conditions. The variety was named after Kufri, the Himalayan hill town near Shimla where CPRI's main research station is located.",
        "Kufri Jyoti rapidly became the dominant Indian variety after release and remains widely planted today — particularly in West Bengal where it accounts for over 50% of state potato area more than 55 years after release. The variety's structural dominance is one of the longest-running varietal monocultures in modern Indian agriculture.",
      ],
    },
    {
      id: "kufri-jyoti-uses",
      heading: "Kufri Jyoti's role in Indian potato consumption",
      paragraphs: [
        "Kufri Jyoti is positioned as a table + processing dual-purpose variety. Specific gravity of 1.072–1.080 supports both fresh-market boiling/curry use and processing chains for branded chip industries. The variety's white-cream flesh with minimal cooking discoloration is preferred across Indian regional cuisines for aloo bharta, aloo subzi, and similar fresh-market applications.",
        "For deeper context on Indian variety landscape see our <a href=\"/knowledge/kufri-potato-varieties-india\" style=\"color:#C62828;text-decoration:none\">complete Kufri varieties guide</a> and the <a href=\"/country/india\" style=\"color:#C62828;text-decoration:none\">India country profile</a>. Kufri Jyoti's dominance means a novel pathogen breaking its resistance package would have catastrophic regional consequences — driving CPRI's recent push to diversify toward Kufri Himalini, Kufri Khyati, and Kufri Chipsona-3.",
      ],
    },
    {
      id: "kufri-jyoti-agronomy",
      heading: "Agronomic profile of Kufri Jyoti",
      paragraphs: [
        "Kufri Jyoti matures in 110–125 days, matching the Indian rabi (winter) season cycle from October–November planting to February–March harvest. Yields of 35–40 t/ha are achievable under irrigated commercial management; smallholder yields of 22–28 t/ha are typical due to certified-seed availability constraints (only 10–15% of Indian farmers use formally certified seed; ICAR-CPRI).",
        "The variety has moderate resistance to late blight and good resistance to PVX. Storage life of 6–8 months under standard Indian cold storage (2–4°C) supports year-round consumer-market supply through the off-season. CPRI Modipuram's aeroponic minituber programme is scaling certified-seed production as part of the broader Indian seed-quality reform.",
      ],
    },
  ],
  "kufri-pukhraj": [
    {
      id: "kufri-pukhraj-history",
      heading: "Kufri Pukhraj — India's leading early-maturity variety",
      paragraphs: [
        "Kufri Pukhraj was developed by ICAR-CPRI Modipuram with commercial release in 1998 (ICAR-CPRI variety register; Indian Journal of Agricultural Sciences). The variety was specifically bred for India's increasingly compressed rabi-season cool window, targeting earlier maturity than Kufri Jyoti to enable harvest before late-season heat stress.",
        "Kufri Pukhraj has become the dominant early-maturity variety across the Indo-Gangetic plain — particularly in Uttar Pradesh, West Bengal, and Bihar where it competes with and increasingly displaces older varieties. Adoption has accelerated as climate-change pressure has shortened the effective cool-season window in north Indian potato belts.",
      ],
    },
    {
      id: "kufri-pukhraj-uses",
      heading: "Kufri Pukhraj's market positioning",
      paragraphs: [
        "Kufri Pukhraj's 70–90 day maturity is among the shortest of any commercially significant variety globally, enabling Indian smallholders to capture early-market prices before peak February–March harvest flood. Specific gravity of 1.068–1.078 supports table-market use and acceptable processing-grade quality for chip stock.",
        "The variety has been adopted across Uttar Pradesh's Bundelkhand region for double-cropping (early Pukhraj harvest in late January, then a second short-cycle crop), in Bihar's spring-potato system, and in West Bengal's North Bengal Tarai belt. Its short dormancy enables back-to-back planting that smallholders use to spread cash-flow risk across the season.",
      ],
    },
    {
      id: "kufri-pukhraj-agronomy",
      heading: "Agronomic profile of Kufri Pukhraj",
      paragraphs: [
        "Kufri Pukhraj matures in 70–90 days from planting under typical Indian rabi conditions. Yields of 35–40 t/ha are achievable under intensive irrigated management; smallholder yields of 25–30 t/ha are typical. The variety has good resistance to late blight and acceptable PVY tolerance — agronomic improvements that contributed to its rapid adoption.",
        "For Indian state-level variety adoption context see our deep dives at <a href=\"/country/india/uttar-pradesh\" style=\"color:#C62828;text-decoration:none\">Uttar Pradesh</a>, <a href=\"/country/india/west-bengal\" style=\"color:#C62828;text-decoration:none\">West Bengal</a>, <a href=\"/country/india/bihar\" style=\"color:#C62828;text-decoration:none\">Bihar</a>, and the <a href=\"/knowledge/kufri-potato-varieties-india\" style=\"color:#C62828;text-decoration:none\">Kufri varieties guide</a>.",
      ],
    },
  ],
  "shangi": [
    {
      id: "shangi-history",
      heading: "Shangi — Kenya's dominant variety",
      paragraphs: [
        "Shangi originated as an informal CIP-related introduction to Kenya in the early 2000s and spread through farmer-to-farmer seed exchange before being retroactively recognised by KEPHIS (Kenya Plant Health Inspectorate Service) rather than going through standard formal release (NPCK 2023; CIP East Africa). The variety's parental lineage is traceable to CIP breeding lines in Lima but the Kenyan distribution path was informal-network-driven, not formal seed-system-driven.",
        "Shangi accounts for 50–70% of all Kenyan potato area cultivated — among the highest single-variety dominance ratios in any major potato economy globally (NPCK; KALRO). The variety's structural dominance is now a significant biotic risk: a novel pathogen breaking Shangi's resistance package would have catastrophic consequences for Kenya's food security and smallholder income.",
      ],
    },
    {
      id: "shangi-uses",
      heading: "Why Shangi dominates Kenyan markets",
      paragraphs: [
        "Shangi's appeal to Kenyan smallholders combines three factors: (1) 90–110 day maturity matches both bimodal-rainfall growing seasons (long rains and short rains), enabling year-round planting; (2) short dormancy lets farmers replant immediately rather than waiting for sprouting; (3) strong urban-market acceptance — Nairobi and Mombasa chip-fryers prefer Shangi for cooking characteristics.",
        "For deeper context see the <a href=\"/country/kenya\" style=\"color:#C62828;text-decoration:none\">Kenya country profile</a> and our <a href=\"/blog/kenya-potato-boom-wpc-2026\" style=\"color:#C62828;text-decoration:none\">Kenya potato boom narrative</a> covering WPC 2026.",
      ],
    },
    {
      id: "shangi-agronomy",
      heading: "Agronomic profile and yield gap",
      paragraphs: [
        "Shangi yields 30–40 t/ha under optimal management but typically delivers 8–15 t/ha under smallholder conditions (NPCK; KALRO). The dramatic yield gap between potential and actual output reflects Kenya's severe seed-quality crisis: 95–98% of seed planted is informal (farmer-saved or market-obtained), propagating bacterial wilt, PVY, and PLRV across smallholder networks and progressively reducing yields generation-over-generation.",
        "KALRO Tigoni Research Centre and CIP East Africa partnership programmes are scaling aeroponic minituber multiplication to address the certified-seed gap, but adoption remains the binding constraint on national yield improvement. The Shangi yield gap is the single highest-leverage food-security opportunity in East African potato production.",
      ],
    },
  ],
  "spunta": [
    {
      id: "spunta-history",
      heading: "Spunta — North Africa's processing standard",
      paragraphs: [
        "Spunta was developed by Dutch breeder ZPC (now part of HZPC) with commercial release in 1968 (NAK Netherlands; Europatat). The cross combined Bea with USDA selection USDA-22 — targeting high yield + Mediterranean adaptability + dual table/processing use. The variety was specifically positioned for export to Mediterranean and North African markets where Northern European varieties underperformed.",
        "Spunta has become the dominant variety across North Africa — particularly in Egypt, Algeria, and Morocco — and competes strongly across Spain, Italy, and parts of southern Europe. The variety's adaptability to warmer growing conditions and longer storage life under hot conditions has been the structural reason for its Mediterranean dominance.",
      ],
    },
    {
      id: "spunta-uses",
      heading: "Spunta in Mediterranean and Middle Eastern markets",
      paragraphs: [
        "Spunta is a long-oval white-flesh variety with specific gravity around 1.070–1.080. It serves both fresh-market table use (boiling, frying, mashing) and chip-processing in regional snack industries. The variety's distinctive elongated tuber shape allows efficient cutting for both home-style and industrial fries.",
        "Egypt — Africa's #1 potato producer at 6.9M tonnes — relies heavily on Spunta for both domestic consumption and export. Algerian and Moroccan production is similarly Spunta-dominated. For broader African context see our <a href=\"/country/egypt\" style=\"color:#C62828;text-decoration:none\">Egypt</a>, <a href=\"/country/algeria\" style=\"color:#C62828;text-decoration:none\">Algeria</a>, and <a href=\"/country/kenya\" style=\"color:#C62828;text-decoration:none\">Kenya</a> country profiles.",
      ],
    },
    {
      id: "spunta-agronomy",
      heading: "Agronomic profile of Spunta",
      paragraphs: [
        "Spunta matures in 90–110 days and yields 35–50 t/ha under irrigated commercial conditions in Mediterranean climates. The variety has moderate resistance to common scab and PVY but is susceptible to late blight (a recurring constraint in humid coastal North African production zones).",
        "Storage life under hot-climate conditions is among the best of any commercial variety — a critical factor for Egyptian, Algerian, and Moroccan producers who must maintain potato availability through summer when imports from Europe are seasonally limited. This Mediterranean adaptability is the structural foundation of Spunta's regional dominance.",
      ],
    },
  ],
};

// Templated content for the next 50 commercially-significant varieties.
// Generates 4 H2 sections from variety attributes when no hand-crafted entry exists.
const TEMPLATED_TIER = new Set([
  "shepody", "markies", "lady-rosetta", "agria", "fontane", "kennebec",
  "russet-norkotah", "ranger-russet", "umatilla-russet", "king-edward",
  "nicola", "pink-fir-apple", "vitelotte", "red-norland", "red-pontiac",
  "snowden", "lamoka", "kufri-bahar", "kufri-chipsona-3", "kufri-chandramukhi",
  "kufri-sindhuri", "kufri-anand", "kufri-lalit", "kufri-frysona",
  "kufri-chipsona-1", "kufri-khyati", "kufri-lavkar", "kufri-himalini",
  "tigoni", "kenya-mpya", "asante", "diacol-capiro", "yungay", "unica",
  "cooperation-88", "qingshu-9", "bari-alu", "cara", "carolus", "hermes",
  "lady-claire", "saturna", "sante", "felsina", "belana", "nadine",
  "estima", "rooster", "caribou-russet", "saint-yves",
]);

export function getTemplatedSections(v, relatedVarieties) {
  if (!TEMPLATED_TIER.has(v.slug)) return null;
  const yearMatch = v.year ? String(v.year).match(/\d{4}/) : null;
  const releaseYear = yearMatch ? yearMatch[0] : null;
  const breeder = v.origin ? v.origin.replace(/\s*\(\d{4}\)\s*$/, "").trim() : "various breeders";
  const useStr = v.uses && v.uses.length > 0 ? v.uses.map(u => u.toLowerCase()).join(", ") : "general use";
  const topUse = v.uses && v.uses[0] ? v.uses[0].toLowerCase() : "general use";

  return [
    {
      id: `${v.slug}-where-grown`,
      heading: `Where is ${v.name} grown?`,
      paragraphs: [
        `${v.name} is most commonly grown in ${v.region}${breeder !== "various breeders" ? `, with original release from ${breeder}` : ""}. The variety is ${v.tier === "Workhorse" ? "a workhorse variety with broad commercial adoption across its core regions" : v.tier === "Specialty" ? "a specialty variety with niche commercial positioning" : v.tier === "Heritage" ? "a heritage variety preserved for distinctive characteristics" : "commercially established within its regional context"}. Cultivation footprint reflects the variety's adaptation to local agroclimatic conditions and the breeding programme's regional focus.`,
        `Production data for the specific countries where ${v.name} dominates is documented through CIP, USDA, AHDB, ICAR-CPRI, NAK Netherlands, and national agricultural agencies depending on origin. Cross-reference our country profiles for production context — see the <a href=\"/countries\" style=\"color:#C62828;text-decoration:none\">global country index</a> or specific producers in ${v.region}.`,
      ],
    },
    {
      id: `${v.slug}-best-uses`,
      heading: `What is ${v.name} best used for?`,
      paragraphs: [
        `${v.name} is best suited to ${useStr}. ${v.trait}`,
        `End-use suitability is determined by specific gravity, flesh colour, dry-matter content, and reducing-sugar levels. ${topUse.includes("fry") || topUse.includes("chip") || topUse.includes("processing") ? "Processing-grade varieties typically require specific gravity ≥1.080 and low reducing sugars to support Maillard browning without producing dark or bitter products." : topUse.includes("boil") || topUse.includes("salad") ? "Waxy varieties with low specific gravity (≤1.075) hold shape during boiling and are preferred for salad-grade applications where visual presentation matters." : topUse.includes("bak") || topUse.includes("mash") ? "All-purpose and floury varieties with mid-to-high specific gravity work well for mashing and baking; the cooked texture depends on starch:water ratio." : "Variety selection should match end-use specifications documented through breeder guidance and trial data."} See the <a href=\"/knowledge/potato-varieties-guide\" style=\"color:#C62828;text-decoration:none\">complete varieties guide</a> for cross-variety comparison.`,
      ],
    },
    {
      id: `${v.slug}-release-history`,
      heading: `When was ${v.name} released and by whom?`,
      paragraphs: [
        `${v.name} was ${releaseYear ? `released in ${releaseYear}` : "released as a commercial variety"}${breeder !== "various breeders" ? ` by ${breeder}` : ""}. The variety belongs to the ${v.region} family of cultivars and reflects the breeding objectives of its origin programme — typically a combination of yield improvement, disease resistance, and end-use specification matching the dominant commercial demand of the period.`,
        `${releaseYear && parseInt(releaseYear) < 1990 ? `Variety persistence over multiple decades is unusual in modern agriculture; ${v.name}'s continued commercial cultivation reflects either distinctive culinary characteristics or specific niche-market demand that newer varieties haven't displaced.` : releaseYear ? `As a more recent release, ${v.name} reflects modern breeding priorities — likely combining yield improvement with updated disease-resistance packages and end-use specification matching contemporary processor or retail demand.` : `Variety release history reflects the standard commercial seed-system cycle of cross development, multi-year field trials, regulatory registration, and farmer adoption.`}`,
      ],
    },
    {
      id: `${v.slug}-comparison`,
      heading: `How does ${v.name} compare to similar varieties?`,
      paragraphs: [
        `Within the ${v.region} family of cultivars, ${v.name}${v.tier ? ` is classified as a ${v.tier.toLowerCase()} variety` : ""}. ${relatedVarieties && relatedVarieties.length > 0 ? `Comparable varieties include ${relatedVarieties.slice(0, 3).map(rv => rv.name).join(", ")} — each with distinct breeding histories and end-use profiles. Cross-comparison data is available through our variety database.` : "Variety comparison should reference breeder guidance, trial data, and regional adoption surveys for accurate side-by-side assessment."}`,
        `For systematic comparison see the <a href=\"/varieties/compare\" style=\"color:#C62828;text-decoration:none\">variety compare tool</a> or <a href=\"/varieties\" style=\"color:#C62828;text-decoration:none\">browse all 237 varieties</a> in our database. Each variety has its own dedicated profile with origin, traits, and uses documented from primary breeder sources.`,
      ],
    },
  ];
}

// Public lookup: returns hand-crafted sections, then templated sections, or null.
export function getEnrichmentSections(v, relatedVarieties) {
  if (HAND_CRAFTED[v.slug]) return HAND_CRAFTED[v.slug];
  return getTemplatedSections(v, relatedVarieties);
}
