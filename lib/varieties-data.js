// lib/varieties-data.js
// Single source of truth for the varieties database.
// Used by /varieties (index) and /varieties/[slug] (detail).

function slugify(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const RAW_VARIETIES = [
  // North America
  { name: "Russet Burbank", origin: "USA (1872)", region: "North America", year: "1872", uses: ["Frying / Fries", "Baking / Roasting", "Processing / Industrial"], trait: "The variety behind McDonald's fries. Long, oblong, high dry matter (~22%). Idaho's flagship cultivar." },
  { name: "Russet Norkotah", origin: "USA (1987)", region: "North America", year: "1987", uses: ["Baking / Roasting", "Fresh market"], trait: "Russet for fresh market. Smoother skin than Burbank, earlier maturity, ideal baked-potato variety." },
  { name: "Ranger Russet", origin: "USA (1991)", region: "North America", year: "1991", uses: ["Frying / Fries", "Processing / Industrial"], trait: "High-yielding processing Russet. Used by Lamb Weston and Simplot for premium frozen-fry lines." },
  { name: "Umatilla Russet", origin: "USA (1998)", region: "North America", year: "1998", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Pacific Northwest processing variety. Late-maturing, excellent fry colour." },
  { name: "Yukon Gold", origin: "Canada (1980)", region: "North America", year: "1980", uses: ["All-purpose", "Boiling / Salad", "Mashing"], trait: "Distinctive yellow flesh, buttery flavour. The most-recognised North American specialty variety." },
  { name: "Atlantic", origin: "USA (1976)", region: "North America", year: "1976", uses: ["Chips", "Processing / Industrial"], trait: "Dominant US chip-processing variety. High specific gravity (~1.090), low reducing sugars." },
  { name: "Lamoka", origin: "USA (2010)", region: "North America", year: "2010", uses: ["Chips", "Processing / Industrial"], trait: "Newer chip variety from Cornell. Better cold-storage tolerance than Atlantic, lower acrylamide." },
  { name: "Snowden", origin: "USA (1990)", region: "North America", year: "1990", uses: ["Chips", "Processing / Industrial"], trait: "Late-maturing chip variety. Very white flesh, excellent storage." },
  { name: "Red Norland", origin: "USA (1957)", region: "North America", year: "1957", uses: ["Boiling / Salad", "Fresh market"], trait: "Early red-skinned waxy variety. Holds shape when boiled. Common at US farmers' markets." },
  { name: "Red Pontiac", origin: "USA (1949)", region: "North America", year: "1949", uses: ["All-purpose", "Boiling / Salad"], trait: "Versatile red-skinned mid-season variety. Smooth round tubers, good home-garden choice." },
  { name: "Kennebec", origin: "USA (1948)", region: "North America", year: "1948", uses: ["All-purpose", "Frying / Fries"], trait: "Mid-season white-flesh classic. Long-favoured by chip shops; still grown across northern USA." },
  { name: "Shepody", origin: "Canada (1980)", region: "North America", year: "1980", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Early-maturing fry variety. Used by McDonald's alongside Russet Burbank for early-season fries." },

  // Western Europe
  { name: "Bintje", origin: "Netherlands (1910)", region: "Western Europe", year: "1910", uses: ["Frying / Fries", "All-purpose"], trait: "Belgium's fry king for over a century. Yellow-flesh, perfect for double-fried Belgian frites." },
  { name: "Maris Piper", origin: "United Kingdom (1966)", region: "Western Europe", year: "1966", uses: ["Frying / Fries", "Mashing", "All-purpose"], trait: "UK's most popular variety. Cream flesh, fluffy texture, the British chip-shop standard." },
  { name: "King Edward", origin: "United Kingdom (1902)", region: "Western Europe", year: "1902", uses: ["Baking / Roasting", "Mashing"], trait: "120+ year-old British classic. Pink-eyed cream flesh, exceptional roasties and bakers." },
  { name: "Désirée", origin: "Netherlands (1962)", region: "Western Europe", year: "1962", uses: ["All-purpose", "Boiling / Salad", "Mashing"], trait: "Red-skinned yellow-flesh. Drought-tolerant, widely grown across Europe and South Asia." },
  { name: "Charlotte", origin: "France / Germicopa (1981)", region: "Western Europe", year: "1981", uses: ["Boiling / Salad"], trait: "Premium French waxy variety bred by Germicopa — the first firm-flesh variety released on the French market. Holds shape, prized for salads and Niçoise-style dishes." },
  { name: "Estima", origin: "Netherlands (1973)", region: "Western Europe", year: "1973", uses: ["All-purpose", "Boiling / Salad"], trait: "Early second-cropping variety. Yellow flesh, common in Northern European supermarkets." },
  { name: "Maris Bard", origin: "United Kingdom (1972)", region: "Western Europe", year: "1972", uses: ["Boiling / Salad", "Fresh market"], trait: "First-early variety. Smooth white skin, ready in 70-90 days from planting." },
  { name: "Cara", origin: "Ireland (1976)", region: "Western Europe", year: "1976", uses: ["Baking / Roasting", "All-purpose"], trait: "Irish-bred maincrop. Pink-eyed cream skin, scab-resistant." },
  { name: "Rooster", origin: "Ireland (1991)", region: "Western Europe", year: "1991", uses: ["All-purpose", "Mashing"], trait: "Ireland's #1 variety. Red-skinned, golden flesh — the contemporary Irish kitchen standard." },
  { name: "Innovator", origin: "Netherlands (1999)", region: "Western Europe", year: "1999", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Premium European fry variety. Long oval shape, low sugars, used by Lamb Weston Europe." },
  { name: "Lady Rosetta", origin: "Netherlands (1991)", region: "Western Europe", year: "1991", uses: ["Chips", "Processing / Industrial"], trait: "Red-skinned chip variety, dominant in PepsiCo's European chip supply chain." },
  { name: "Lady Claire", origin: "Netherlands (1996)", region: "Western Europe", year: "1996", uses: ["Chips", "Processing / Industrial"], trait: "Long-storage chip variety. Light fry colour, good acrylamide profile." },
  { name: "Hermes", origin: "Netherlands (1973)", region: "Western Europe", year: "1973", uses: ["Chips", "Processing / Industrial"], trait: "Long-established chip variety, especially in UK and South Africa." },
  { name: "Asterix", origin: "Netherlands (1991)", region: "Western Europe", year: "1991", uses: ["All-purpose", "Frying / Fries"], trait: "Red-skinned all-purpose. Widely grown in Bangladesh, Egypt, and Brazil for fresh + processing." },
  { name: "Spunta", origin: "Netherlands (1968)", region: "Western Europe", year: "1968", uses: ["All-purpose", "Fresh market"], trait: "Heat-tolerant. The dominant variety in Egypt, Algeria, and much of MENA." },
  { name: "Diamant", origin: "Netherlands (1982)", region: "Western Europe", year: "1982", uses: ["All-purpose", "Fresh market"], trait: "The most-grown variety in Bangladesh and a major variety across South Asia." },
  { name: "Cardinal", origin: "Netherlands (1969)", region: "Western Europe", year: "1969", uses: ["Fresh market", "All-purpose"], trait: "Red-skinned. Common in South Asian markets — good shelf appearance and storage." },
  { name: "Granola", origin: "Germany (1975)", region: "Western Europe", year: "1975", uses: ["All-purpose", "Fresh market"], trait: "Yellow-flesh. Dominant table variety in Indonesia and parts of Southeast Asia." },
  { name: "Agria", origin: "Germany (1990)", region: "Western Europe", year: "1990", uses: ["All-purpose", "Frying / Fries"], trait: "Yellow-flesh dual-purpose variety. Strong export presence to Mediterranean and MENA." },
  { name: "Carolus", origin: "Netherlands (2010)", region: "Western Europe", year: "2010", uses: ["All-purpose", "Boiling / Salad"], trait: "Late-blight resistant variety from Agrico. Used in organic systems across NW Europe." },
  { name: "Carisma", origin: "Netherlands", region: "Western Europe", uses: ["All-purpose", "Boiling / Salad"], trait: "Low-GI variety, certified by Sydney Glycemic Index Foundation at GI 53. Diabetic-friendly." },

  // South Asia (Indian Kufri + neighbours)
  { name: "Kufri Pukhraj", origin: "India / ICAR-CPRI (1998)", region: "South Asia", year: "1998", uses: ["All-purpose", "Fresh market"], trait: "Dominant Indian variety. Short-duration (75-90 days), planted across Uttar Pradesh and Bihar." },
  { name: "Kufri Jyoti", origin: "India / ICAR-CPRI (1968)", region: "South Asia", year: "1968", uses: ["All-purpose", "Boiling / Salad"], trait: "Long-running Indian commercial variety. White skin, white flesh, mid-season." },
  { name: "Kufri Chipsona-1", origin: "India / ICAR-CPRI (1998)", region: "South Asia", year: "1998", uses: ["Chips", "Processing / Industrial"], trait: "First Indian chip-processing variety. Low reducing sugars suited for chip industry." },
  { name: "Kufri Chipsona-3", origin: "India / ICAR-CPRI (2010)", region: "South Asia", year: "2010", uses: ["Chips", "Processing / Industrial"], trait: "Improved chip variety. Higher dry matter, better acrylamide profile than Chipsona-1." },
  { name: "Kufri Frysona", origin: "India / ICAR-CPRI (2012)", region: "South Asia", year: "2012", uses: ["Frying / Fries", "Processing / Industrial"], trait: "India's first French-fry-specific variety. Long oblong shape, suited for HoReCa." },
  { name: "Kufri Tejas", origin: "India / ICAR-CPRI (2018)", region: "South Asia", year: "2018", uses: ["All-purpose", "Fresh market"], trait: "Heat-tolerant variety bred for late-season 30-35°C tolerance in the Indo-Gangetic Plain." },
  { name: "Kufri Bahar", origin: "India / ICAR-CPRI (1980)", region: "South Asia", year: "1980", uses: ["All-purpose"], trait: "Mid-season variety. Widely grown across Punjab and Haryana." },
  { name: "Kufri Sindhuri", origin: "India / ICAR-CPRI (1967)", region: "South Asia", year: "1967", uses: ["All-purpose", "Fresh market"], trait: "Red-skinned long-running variety. Heat-tolerant, popular in Maharashtra." },
  { name: "Kufri Anand", origin: "India / ICAR-CPRI (1999)", region: "South Asia", year: "1999", uses: ["All-purpose", "Fresh market"], trait: "Mid-season white-skin variety with good storage characteristics." },

  // Africa
  { name: "Shangi", origin: "Kenya / CIP-derived", region: "Africa", uses: ["All-purpose", "Fresh market", "Frying / Fries"], trait: "Dominant Kenyan variety (50-80% market share). Short dormancy enables continuous cropping." },
  { name: "Sherekea", origin: "Kenya", region: "Africa", uses: ["All-purpose", "Fresh market"], trait: "Mid-altitude Kenyan variety. KALRO-promoted as part of Shangi diversification effort." },
  { name: "Asante", origin: "Kenya", region: "Africa", uses: ["All-purpose", "Boiling / Salad"], trait: "Yellow-fleshed variety adapted to Kenyan highlands." },
  { name: "Wanjiku", origin: "Kenya", region: "Africa", uses: ["All-purpose"], trait: "CIP-developed variety widely grown in Meru and Nyandarua counties." },

  // Andean / Native
  { name: "Papa Amarilla", origin: "Peru (native, ancient)", region: "Andean / Native", uses: ["Boiling / Salad", "Specialty"], trait: "Yellow-fleshed Andean landrace. Diploid, fast-cooking — prized in Peruvian cuisine for causa." },
  { name: "Papa Negra", origin: "Peru / Bolivia (native)", region: "Andean / Native", uses: ["Specialty", "Boiling / Salad"], trait: "Black-purple skinned Andean landrace. Anthocyanin-rich. Traditional Andean cuisine." },
  { name: "Tunta / Chuño", origin: "Bolivia / Peru (4,000+ years)", region: "Andean / Native", uses: ["Specialty", "Processing / Industrial"], trait: "Bitter Solanum juzepczukii / curtilobum, freeze-dried into chuño — the world's first preserved food." },
  { name: "Phureja", origin: "Andes (S. tuberosum group Phureja)", region: "Andean / Native", uses: ["Boiling / Salad", "Specialty"], trait: "Diploid Andean group, no dormancy, fast-cooking. The genetic backbone for many CIP releases." },
  { name: "Criolla", origin: "Colombia (native)", region: "Andean / Native", uses: ["Boiling / Salad", "Specialty"], trait: "Small yellow-fleshed Colombian highland variety. National cuisine staple." },
  { name: "UNICA", origin: "Peru / CIP (2002)", region: "Andean / Native", year: "2002", uses: ["All-purpose", "Frying / Fries"], trait: "Heat- and drought-tolerant. Released in Peru, now grown commercially in 13+ Chinese provinces as Qingshu 9." },

  // Specialty / Heritage
  { name: "Purple Majesty", origin: "USA / Colorado State (2006)", region: "Specialty / Heritage", year: "2006", uses: ["Specialty", "Boiling / Salad"], trait: "Anthocyanin-rich purple-fleshed variety. High antioxidant content." },
  { name: "Adirondack Blue", origin: "USA / Cornell (2003)", region: "Specialty / Heritage", year: "2003", uses: ["Specialty", "Boiling / Salad"], trait: "Blue-fleshed variety. Higher anthocyanin density than Purple Majesty." },
  { name: "Russian Banana", origin: "Baltic / Russia (heritage)", region: "Specialty / Heritage", uses: ["Boiling / Salad", "Specialty"], trait: "Yellow fingerling heritage variety. Buttery, holds shape — favourite for roasted-fingerling dishes." },
  { name: "French Fingerling", origin: "France (heritage)", region: "Specialty / Heritage", uses: ["Boiling / Salad", "Specialty"], trait: "Pink-skinned, yellow-flesh fingerling. Exceptional flavour, premium farmers'-market variety." },
  { name: "Pink Fir Apple", origin: "United Kingdom (heritage, 1850s)", region: "Specialty / Heritage", uses: ["Boiling / Salad", "Specialty"], trait: "Knobby pink-skinned salad variety. Distinct nutty flavour. UK heritage favourite." },
  { name: "Vitelotte", origin: "France (heritage)", region: "Specialty / Heritage", uses: ["Specialty", "Boiling / Salad"], trait: "Deep purple flesh, also called 'Truffe de Chine'. Used in haute cuisine purple purées." },
  { name: "La Ratte", origin: "France (1870s)", region: "Specialty / Heritage", uses: ["Boiling / Salad", "Specialty"], trait: "Premium French fingerling. Buttery flavour — Joël Robuchon's signature for purée." },

  // East Asia & Pacific
  { name: "Sayaka", origin: "Japan", region: "East Asia & Pacific", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Japanese fry variety. Used by McDonald's Japan during domestic-supply windows." },
  { name: "Hokkai 51", origin: "Japan", region: "East Asia & Pacific", uses: ["Chips", "Processing / Industrial"], trait: "Hokkaido-bred chip variety. Backbone of Japanese chip supply (Calbee, Koikeya)." },
  { name: "Toyoshiro", origin: "Japan", region: "East Asia & Pacific", uses: ["Chips", "Processing / Industrial"], trait: "Long-running Japanese chip variety from Hokkaido. White flesh, low sugars." },
  { name: "Cooperation 88", origin: "China / CIP-derived", region: "East Asia & Pacific", uses: ["All-purpose", "Fresh market"], trait: "Widely grown in Yunnan and southwestern China. CIP-Yunnan collaboration variety." },
  { name: "Favorita", origin: "China / CIP", region: "East Asia & Pacific", uses: ["All-purpose", "Fresh market"], trait: "Short-duration CIP-derived variety. Major variety across multiple Chinese provinces." },
  { name: "Zihuabai", origin: "China", region: "East Asia & Pacific", uses: ["All-purpose", "Specialty"], trait: "White-fleshed traditional Chinese variety. Common in Inner Mongolia and northern provinces." },
  { name: "Qingshu 168", origin: "China", region: "East Asia & Pacific", uses: ["Processing / Industrial", "Chips"], trait: "Chinese-bred processing variety with high specific gravity, used in domestic chip supply." },
  { name: "Atlantis", origin: "Australia", region: "East Asia & Pacific", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Australian fry-processing variety adapted to Tasmanian and Victorian growing conditions." },

  // Additional Indian Kufri (extending the existing 9 to ~30)
  { name: "Kufri Sutlej", origin: "India / ICAR-CPRI (1996)", region: "South Asia", year: "1996", uses: ["All-purpose", "Fresh market"], trait: "High-yielding short-duration variety. Widely planted across Punjab plains." },
  { name: "Kufri Lalima", origin: "India / ICAR-CPRI (1982)", region: "South Asia", year: "1982", uses: ["All-purpose", "Fresh market"], trait: "Red-skinned table variety. Popular in central and northern Indian markets." },
  { name: "Kufri Khyati", origin: "India / ICAR-CPRI (2004)", region: "South Asia", year: "2004", uses: ["All-purpose", "Processing / Industrial"], trait: "High-yielding variety with good processing characteristics. Adapted to Indo-Gangetic plain." },
  { name: "Kufri Mohan", origin: "India / ICAR-CPRI (2014)", region: "South Asia", year: "2014", uses: ["All-purpose", "Fresh market"], trait: "Heat-tolerant variety bred for late-season warmth in north Indian plains." },
  { name: "Kufri Garima", origin: "India / ICAR-CPRI (2015)", region: "South Asia", year: "2015", uses: ["All-purpose", "Fresh market"], trait: "Heat-tolerant variety with good yield stability under warm conditions." },
  { name: "Kufri Chandramukhi", origin: "India / ICAR-CPRI (1968)", region: "South Asia", year: "1968", uses: ["All-purpose", "Fresh market"], trait: "Long-running early-maturing white-skinned variety. Reliable across multiple agro-zones." },
  { name: "Kufri Surya", origin: "India / ICAR-CPRI (2006)", region: "South Asia", year: "2006", uses: ["All-purpose", "Fresh market"], trait: "Heat-tolerant variety for tropical and sub-tropical Indian regions." },
  { name: "Kufri Himalini", origin: "India / ICAR-CPRI (2013)", region: "South Asia", year: "2013", uses: ["All-purpose"], trait: "Late-blight resistant variety adapted to hill conditions in northern India." },
  { name: "Kufri Ashoka", origin: "India / ICAR-CPRI (1997)", region: "South Asia", year: "1997", uses: ["Fresh market", "All-purpose"], trait: "Early-maturing variety widely grown across plains and hills." },
  { name: "Kufri Pushkar", origin: "India / ICAR-CPRI (2004)", region: "South Asia", year: "2004", uses: ["All-purpose", "Fresh market"], trait: "High-yielding mid-season variety suitable for processing and fresh market." },
  { name: "Kufri Khasi Garo", origin: "India / ICAR-CPRI (2002)", region: "South Asia", year: "2002", uses: ["All-purpose"], trait: "Variety adapted to North-East India hill regions (Meghalaya, Assam)." },
  { name: "Kufri Megha", origin: "India / ICAR-CPRI (2003)", region: "South Asia", year: "2003", uses: ["All-purpose"], trait: "Hill region variety with late-blight tolerance." },
  { name: "Kufri Giriraj", origin: "India / ICAR-CPRI (1998)", region: "South Asia", year: "1998", uses: ["All-purpose"], trait: "Hill-region variety. Late maturity, good keeping quality." },
  { name: "Kufri Neelkanth", origin: "India / ICAR-CPRI (2012)", region: "South Asia", year: "2012", uses: ["Specialty", "All-purpose"], trait: "Anthocyanin-rich purple-skinned variety. Antioxidant-marketed in urban India." },
  { name: "Kufri Sangam", origin: "India / ICAR-CPRI (2013)", region: "South Asia", year: "2013", uses: ["All-purpose", "Fresh market"], trait: "Tropical lowland variety bred for west and central India." },
  { name: "Kufri Lauvkar", origin: "India / ICAR-CPRI (1972)", region: "South Asia", year: "1972", uses: ["All-purpose"], trait: "Maharashtra-adapted variety. Long-running commercial cultivar in west India." },

  // Additional Western European
  { name: "Picasso", origin: "Netherlands (1992)", region: "Western Europe", year: "1992", uses: ["All-purpose", "Boiling / Salad"], trait: "Red-eyed cream-skinned all-rounder. Drought-tolerant. Popular in UK and South Asia." },
  { name: "Romano", origin: "Netherlands (1981)", region: "Western Europe", year: "1981", uses: ["All-purpose", "Boiling / Salad"], trait: "Red-skinned mid-season variety. Common in Mediterranean and East European markets." },
  { name: "Nicola", origin: "Germany (1973)", region: "Western Europe", year: "1973", uses: ["Boiling / Salad"], trait: "Yellow-fleshed waxy salad variety. Widely grown across Germany, Netherlands, and Israel." },
  { name: "Marfona", origin: "Netherlands (1977)", region: "Western Europe", year: "1977", uses: ["All-purpose", "Boiling / Salad"], trait: "Second-early variety. Yellow flesh, smooth oval. Common in UK supermarkets." },
  { name: "Wilja", origin: "Netherlands (1967)", region: "Western Europe", year: "1967", uses: ["All-purpose", "Frying / Fries"], trait: "Early second-cropping variety. Yellow flesh, used for fresh market and chip processing." },
  { name: "Markies", origin: "Netherlands (1989)", region: "Western Europe", year: "1989", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Long oblong fry variety. Used in UK and northern European processing supply." },
  { name: "Sarpo Mira", origin: "Hungary (2002)", region: "Western Europe", year: "2002", uses: ["All-purpose", "Boiling / Salad"], trait: "Strong late-blight resistance. Widely used in organic systems across Europe." },
  { name: "Sarpo Axona", origin: "Hungary", region: "Western Europe", uses: ["All-purpose", "Mashing"], trait: "Late-blight resistant red-skinned variety. Reliable in low-input systems." },
  { name: "Mayan Gold", origin: "United Kingdom / SCRI (2008)", region: "Western Europe", year: "2008", uses: ["Specialty", "Boiling / Salad"], trait: "Phureja-derived dual-purpose. Distinctive yellow flesh, fast-cooking. UK premium market." },
  { name: "Vivaldi", origin: "Netherlands", region: "Western Europe", uses: ["All-purpose", "Boiling / Salad"], trait: "Yellow-flesh second-early. Lower-carb marketing positioning. Common in UK retail." },
  { name: "Anya", origin: "United Kingdom (heritage)", region: "Western Europe", uses: ["Boiling / Salad", "Specialty"], trait: "Pink-skinned salad variety. Cross of Pink Fir Apple and Désirée. Premium UK market." },
  { name: "Pentland Javelin", origin: "United Kingdom / SCRI (1968)", region: "Western Europe", year: "1968", uses: ["Boiling / Salad"], trait: "First-early UK variety. Smooth white skin, holds shape when boiled." },
  { name: "Pentland Crown", origin: "United Kingdom / SCRI (1958)", region: "Western Europe", year: "1958", uses: ["All-purpose", "Mashing"], trait: "Late maincrop with high yield. Once dominant in UK; declining as Maris Piper rose." },
  { name: "Pentland Squire", origin: "United Kingdom / SCRI (1970)", region: "Western Europe", year: "1970", uses: ["Baking / Roasting", "Mashing"], trait: "White flesh, floury, excellent for baking. UK home-cooking favourite." },
  { name: "Sava", origin: "Netherlands", region: "Western Europe", uses: ["Chips", "Processing / Industrial"], trait: "Chip-processing variety. Light fry colour, good cold-storage tolerance." },
  { name: "Annabelle", origin: "Netherlands", region: "Western Europe", uses: ["Boiling / Salad"], trait: "Premium yellow-fleshed waxy salad variety. Used in fine-dining and gourmet retail." },
  { name: "Ditta", origin: "Austria (1973)", region: "Western Europe", year: "1973", uses: ["Boiling / Salad", "All-purpose"], trait: "Long oval yellow-flesh variety. Popular in central Europe for boiling and salads." },
  { name: "Carola", origin: "Germany (1990)", region: "Western Europe", year: "1990", uses: ["Boiling / Salad", "All-purpose"], trait: "Yellow-fleshed waxy variety. Common in Germany and US specialty markets." },
  { name: "Robijn", origin: "Netherlands", region: "Western Europe", uses: ["Fresh market", "All-purpose"], trait: "Red-skinned variety. Major presence in Egyptian and MENA fresh-market exports." },
  { name: "Lady Sara", origin: "United Kingdom", region: "Western Europe", uses: ["Frying / Fries", "Chips"], trait: "Processing variety used in UK and African supply chains." },

  // Additional North American
  { name: "Reveille Russet", origin: "USA / Texas A&M (2014)", region: "North America", year: "2014", uses: ["Fresh market", "Baking / Roasting"], trait: "Texas-bred fresh-market Russet. Heat-tolerant for southern US production." },
  { name: "Centennial Russet", origin: "USA", region: "North America", uses: ["Fresh market", "Baking / Roasting"], trait: "Fresh-market Russet with smooth skin. Released for the bake-and-bag market." },
  { name: "GoldRush", origin: "USA / North Dakota State (1995)", region: "North America", year: "1995", uses: ["Fresh market", "Baking / Roasting"], trait: "Russet for fresh market. Smooth oblong tubers, good shape consistency." },
  { name: "All Blue", origin: "USA (heritage)", region: "North America", uses: ["Specialty", "Boiling / Salad"], trait: "Anthocyanin-rich blue-fleshed heritage variety. Antioxidant marketing." },
  { name: "Mountain Rose", origin: "USA / Colorado", region: "North America", uses: ["Specialty", "Boiling / Salad"], trait: "Red-fleshed specialty variety. Dramatic colour for retail differentiation." },
  { name: "German Butterball", origin: "Germany via USA (heritage)", region: "North America", uses: ["Boiling / Salad", "Specialty"], trait: "Yellow-flesh heritage variety. Buttery texture, prized for roasting and salads." },
  { name: "Banana Fingerling", origin: "Heritage", region: "North America", uses: ["Boiling / Salad", "Specialty"], trait: "Yellow fingerling heritage. Distinctive crescent shape, holds form well." },
  { name: "Yukon Gem", origin: "USA (2011)", region: "North America", year: "2011", uses: ["All-purpose", "Boiling / Salad"], trait: "Improved Yukon Gold descendant with better disease resistance." },
  { name: "Adirondack Red", origin: "USA / Cornell", region: "North America", uses: ["Specialty", "Boiling / Salad"], trait: "Red-fleshed Cornell-bred variety. Pairs with Adirondack Blue for visual contrast." },

  // Additional Andean
  { name: "Yana Imilla", origin: "Bolivia (native)", region: "Andean / Native", uses: ["Specialty", "Boiling / Salad"], trait: "Black-skinned Bolivian landrace. Quechua name; widely grown on the altiplano." },
  { name: "Imilla Negra", origin: "Bolivia / Peru (native)", region: "Andean / Native", uses: ["Specialty", "Boiling / Salad"], trait: "Black-purple Andean landrace. Ceremonial and culinary use in highland communities." },
  { name: "Wila Imilla", origin: "Bolivia (native)", region: "Andean / Native", uses: ["Specialty", "Boiling / Salad"], trait: "Red-fleshed Bolivian landrace from above 3,500m. Aymara cultivation." },
  { name: "Sani Imilla", origin: "Bolivia (native)", region: "Andean / Native", uses: ["Specialty"], trait: "Purple-fleshed Andean landrace. Anthocyanin-rich, traditional altiplano cultivar." },
  { name: "Pitiquiña", origin: "Peru (native)", region: "Andean / Native", uses: ["Specialty", "Boiling / Salad"], trait: "Highland Peruvian landrace. Diploid, fast-cooking, regional specialty." },
  { name: "Compis", origin: "Peru (native)", region: "Andean / Native", uses: ["Specialty"], trait: "Frost-tolerant native variety from the highest cultivation altitudes." },
  { name: "Huayro", origin: "Peru (native)", region: "Andean / Native", uses: ["Specialty", "Boiling / Salad"], trait: "Elongated Andean landrace. Mealy texture, traditional Peruvian cuisine." },

  // Additional African
  { name: "Tigoni", origin: "Kenya / KARI (1996)", region: "Africa", year: "1996", uses: ["All-purpose", "Frying / Fries"], trait: "KARI-released Kenyan variety. Mid-altitude adaptation, suitable for fresh and processing." },
  { name: "Roslin Tana", origin: "Kenya", region: "Africa", uses: ["All-purpose"], trait: "Kenyan variety suited to mid-altitude growing conditions." },
  { name: "Roslin Eburu", origin: "Kenya", region: "Africa", uses: ["All-purpose"], trait: "Kenyan variety. Highland adaptation, late-blight tolerant." },
  { name: "Kenya Mpya", origin: "Kenya", region: "Africa", uses: ["All-purpose", "Fresh market"], trait: "Released for KALRO promoted variety diversification away from Shangi monoculture." },
  { name: "Kenya Karibu", origin: "Kenya", region: "Africa", uses: ["All-purpose"], trait: "Newer Kenyan release. Part of variety diversification initiative." },
  { name: "Belete", origin: "Ethiopia / CIP (2009)", region: "Africa", year: "2009", uses: ["All-purpose", "Frying / Fries"], trait: "CIP-Ethiopia variety. Major commercial variety across Ethiopian highlands." },
  { name: "Gudane", origin: "Ethiopia", region: "Africa", uses: ["All-purpose"], trait: "Ethiopian highland variety. Late-blight tolerant, smallholder favourite." },
  { name: "Jalenie", origin: "Ethiopia", region: "Africa", uses: ["All-purpose"], trait: "Ethiopian variety with late-blight resistance, widely grown in Amhara region." },
  { name: "Cangi", origin: "Ethiopia", region: "Africa", uses: ["All-purpose"], trait: "Ethiopian commercial variety adapted to highland production zones." },
  { name: "Mondial", origin: "Netherlands (in Africa)", region: "Africa", uses: ["All-purpose", "Frying / Fries"], trait: "Dutch-bred Mondial is widely grown in South Africa as a commercial fry-and-fresh variety." },
  { name: "BP1", origin: "South Africa", region: "Africa", uses: ["All-purpose"], trait: "South African commercial variety. Long-running cultivar across SA production." },
  { name: "Sifra", origin: "Netherlands (in Africa)", region: "Africa", uses: ["All-purpose", "Fresh market"], trait: "Dutch variety widely planted in Algeria, Morocco, Tunisia, and South Africa." },

  // Additional specialty / heritage
  { name: "Jersey Royal", origin: "Jersey, UK (heritage)", region: "Specialty / Heritage", uses: ["Boiling / Salad", "Specialty"], trait: "EU Protected Designation of Origin variety. Premium UK new-potato grown only on Jersey." },
  { name: "Salad Blue", origin: "United Kingdom (heritage)", region: "Specialty / Heritage", uses: ["Specialty", "Boiling / Salad"], trait: "Blue-fleshed heritage UK variety. Striking colour for premium retail." },
  { name: "Highland Burgundy Red", origin: "United Kingdom (heritage)", region: "Specialty / Heritage", uses: ["Specialty"], trait: "Red-fleshed UK heritage. Holds colour when cooked." },
  { name: "Shetland Black", origin: "Shetland Islands, UK (heritage)", region: "Specialty / Heritage", uses: ["Specialty"], trait: "Black-skinned Scottish heritage variety from the Shetland Islands." },
  { name: "Apache", origin: "United Kingdom (2010)", region: "Specialty / Heritage", year: "2010", uses: ["Specialty", "All-purpose"], trait: "Red-and-cream marbled skin. Distinctive appearance for premium retail." },
  { name: "Mr Little's Yetholm Gypsy", origin: "Scotland (heritage)", region: "Specialty / Heritage", uses: ["Specialty"], trait: "Tri-coloured red, white and blue skin. Heritage Scottish variety." },

  // Additional Western Europe (+10)
  { name: "Fontane", origin: "Netherlands / HZPC", region: "Western Europe", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Long oblong fry variety. A major Bintje successor for Belgian and French frozen-fry processing." },
  { name: "Belle de Fontenay", origin: "France (heritage, 1885)", region: "Western Europe", year: "1885", uses: ["Boiling / Salad", "Specialty"], trait: "Classic French salad variety from Île-de-France. Yellow flesh, holds shape, premium retail." },
  { name: "BF15", origin: "France / INRA (1947)", region: "Western Europe", year: "1947", uses: ["Boiling / Salad"], trait: "Historic French INRA breeder selection. Yellow-fleshed waxy variety, French gastronomic standard." },
  { name: "Mona Lisa", origin: "Netherlands (1982)", region: "Western Europe", year: "1982", uses: ["All-purpose", "Boiling / Salad"], trait: "Yellow-flesh oval variety. Widely grown across France, Spain, and the Netherlands for retail." },
  { name: "Sieglinde", origin: "Germany (1935)", region: "Western Europe", year: "1935", uses: ["Boiling / Salad", "Specialty"], trait: "German heritage waxy salad variety. Long oblong yellow-flesh; iconic for Kartoffelsalat." },
  { name: "Linda", origin: "Germany (1974)", region: "Western Europe", year: "1974", uses: ["Boiling / Salad", "All-purpose"], trait: "Long-running German yellow-flesh variety. Faced de-listing controversy; preserved by farmer campaign." },
  { name: "Marabel", origin: "Germany", region: "Western Europe", uses: ["All-purpose", "Boiling / Salad"], trait: "Early-maturing German yellow-flesh waxy variety. Common in central European retail." },
  { name: "Belana", origin: "Germany", region: "Western Europe", uses: ["Boiling / Salad", "All-purpose"], trait: "Yellow-flesh waxy variety popular in Austrian and Swiss markets." },
  { name: "Tristan", origin: "Belgium", region: "Western Europe", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Belgian-bred fry variety. Adapted to Northern French and Belgian processing supply chains." },
  { name: "Mozart", origin: "Netherlands", region: "Western Europe", uses: ["All-purpose", "Boiling / Salad"], trait: "Red-skinned all-purpose variety. Smooth oval shape, common in UK and continental retail." },
  { name: "Cherie", origin: "France / Germicopa", region: "Western Europe", uses: ["Boiling / Salad", "Fresh market"], trait: "French red-skinned firm-flesh variety bred by Germicopa. Very early maturity with exceptional storage quality; a premium fresh-market salad potato." },
  { name: "Samba", origin: "France / Germicopa (1989)", region: "Western Europe", year: "1989", uses: ["Baking / Roasting", "All-purpose"], trait: "French melting-flesh variety (cooking type A-B) bred by Germicopa. Large tubers with tender flesh; favored as a baking/jacket potato." },
  { name: "Germi 300", origin: "France / Germicopa", region: "Western Europe", uses: ["Frying / Fries", "Processing / Industrial"], trait: "French industrial fry variety from Germicopa. Red-skinned, yellow flesh, fairly high dry matter (21-23%); very long dormancy suited to extended QSR fry programs." },
  { name: "Amyla", origin: "France / Germicopa", region: "Western Europe", uses: ["Processing / Industrial"], trait: "French starch variety bred by Germicopa. Exceptional dry matter (>26%); bred for industrial starch and flake processing under water-stress conditions." },
  { name: "Daifla", origin: "France / Germicopa", region: "Western Europe", uses: ["Fresh market", "All-purpose"], trait: "French multi-purpose variety from Germicopa, bred for South Mediterranean markets. Cream skin and flesh, very high yield; suited to early and second-season Mediterranean plantings." },
  { name: "Topaze", origin: "France / Germicopa (2020)", region: "Western Europe", year: "2020", uses: ["Fresh market", "Boiling / Salad"], trait: "Recent French red-skinned table variety from Germicopa, released 2020 after a 10-year breeding program. Pale yellow flesh; very high yield across diverse climates." },
  { name: "Daisy (Germicopa)", origin: "France / Germicopa", region: "Western Europe", uses: ["Frying / Fries", "Processing / Industrial"], trait: "French industrial fry variety from Germicopa, high dry matter (22-24%) and exceptional frying color. Distinct from the unrelated Argentine table variety also named Daisy." },

  // Additional North America (+8)
  { name: "Caribou Russet", origin: "USA / University of Maine (2014)", region: "North America", year: "2014", uses: ["Fresh market", "Baking / Roasting", "Frying / Fries"], trait: "Maine-bred Russet for both fresh-market and processing. Released by University of Maine Extension." },
  { name: "Norchip", origin: "USA / North Dakota State (1967)", region: "North America", year: "1967", uses: ["Chips", "Processing / Industrial"], trait: "Long-running Midwest chip variety. Round white tubers; baseline for early-season chipping." },
  { name: "FL 1879", origin: "USA / Frito-Lay", region: "North America", uses: ["Chips", "Processing / Industrial"], trait: "Frito-Lay proprietary chip variety. Newer release in their controlled-supply line." },
  { name: "Keuka Gold", origin: "USA / Cornell (2002)", region: "North America", year: "2002", uses: ["All-purpose", "Boiling / Salad"], trait: "Cornell-bred yellow-flesh variety. Smooth oblong; used for fresh market in NY and PA." },
  { name: "Lehigh", origin: "USA / Cornell (2003)", region: "North America", year: "2003", uses: ["Chips", "Processing / Industrial"], trait: "Cornell-bred chip variety with common-scab resistance and good cold-storage tolerance." },
  { name: "Reba", origin: "USA / Cornell (1995)", region: "North America", year: "1995", uses: ["Fresh market", "All-purpose"], trait: "Cornell-bred white-skinned fresh-market variety. Smooth round shape." },
  { name: "Pike", origin: "USA / Cornell (1996)", region: "North America", year: "1996", uses: ["Chips", "Processing / Industrial"], trait: "Cornell chip variety with golden nematode resistance. Long-storage chipping." },
  { name: "Dakota Pearl", origin: "USA / North Dakota State (2000)", region: "North America", year: "2000", uses: ["Chips", "Processing / Industrial"], trait: "Round white chip variety from North Dakota State. Strong cold-storage performance." },

  // Additional Andean / Native (+12)
  { name: "Yungay", origin: "Peru / CIP (1971)", region: "Andean / Native", year: "1971", uses: ["All-purpose", "Fresh market"], trait: "Major Peruvian commercial variety. Pink eyes, white flesh; CIP-released, widely grown in central highlands." },
  { name: "Canchan-INIAA", origin: "Peru / CIP (1990)", region: "Andean / Native", year: "1990", uses: ["All-purpose", "Frying / Fries"], trait: "CIP-Peru release. Pink-skinned, cream-fleshed; popular for huancaína and frying." },
  { name: "Tomasa Condemayta", origin: "Peru (native)", region: "Andean / Native", uses: ["Specialty", "Boiling / Salad"], trait: "Peruvian native variety named for the indigenous freedom-fighter. Yellow-flesh highland landrace." },
  { name: "Rumi Sonqo", origin: "Peru (native)", region: "Andean / Native", uses: ["Specialty"], trait: "Andean native variety. Quechua name meaning 'heart of stone' — for its dense waxy texture." },
  { name: "Perricholi", origin: "Peru / CIP (1980s)", region: "Andean / Native", uses: ["All-purpose", "Boiling / Salad"], trait: "Peruvian CIP release. Pink-skinned, late-maturing; adapted to coastal and intermediate zones." },
  { name: "Revolución", origin: "Peru / CIP", region: "Andean / Native", uses: ["All-purpose", "Frying / Fries"], trait: "CIP-Peru heat-tolerant variety. Bred for warmer Andean valleys and tropical lowland conditions." },
  { name: "Costanera", origin: "Peru / CIP", region: "Andean / Native", uses: ["All-purpose", "Frying / Fries"], trait: "CIP coastal-adapted variety. Suited to Peruvian Pacific coast irrigation systems." },
  { name: "Diacol Capiro", origin: "Colombia (1965)", region: "Andean / Native", year: "1965", uses: ["All-purpose", "Frying / Fries"], trait: "Colombia's most widely grown variety. Red-skinned, white-fleshed; backbone of Colombian fresh and processing." },
  { name: "ICA Única", origin: "Colombia / ICA", region: "Andean / Native", uses: ["All-purpose", "Fresh market"], trait: "Colombian commercial variety from ICA breeding programme. Highland adaptation." },
  { name: "Pastusa Suprema", origin: "Colombia", region: "Andean / Native", uses: ["All-purpose", "Boiling / Salad"], trait: "Major Colombian commercial variety. Yellow-flesh, popular in Bogotá metro fresh market." },
  { name: "INIAP-Fripapa", origin: "Ecuador / CIP (1981)", region: "Andean / Native", year: "1981", uses: ["Frying / Fries", "Processing / Industrial"], trait: "Ecuadorian CIP-collaboration variety. Bred specifically for processing into chips and fries." },
  { name: "Saq'ampaya", origin: "Bolivia (native)", region: "Andean / Native", uses: ["Specialty"], trait: "Bolivian altiplano landrace. Bitter-class species used in chuño and tunta processing." },

  // Additional South Asia (+10)
  { name: "BARI Alu 7", origin: "Bangladesh / BARI", region: "South Asia", uses: ["All-purpose", "Fresh market"], trait: "BARI-released Bangladesh table variety derived from Cardinal lineage." },
  { name: "BARI Alu 25", origin: "Bangladesh / BARI", region: "South Asia", uses: ["All-purpose", "Frying / Fries"], trait: "BARI-released variety based on Asterix; suited for both fresh and processing markets." },
  { name: "BARI Alu 28", origin: "Bangladesh / BARI", region: "South Asia", uses: ["All-purpose", "Fresh market"], trait: "Heat-tolerant Bangladeshi BARI release for late-season Indo-Gangetic plains." },
  { name: "BARI Alu 41 (Lal Pakri)", origin: "Bangladesh / BARI", region: "South Asia", uses: ["Fresh market", "All-purpose"], trait: "Red-skinned Bangladeshi table variety for traditional fresh market." },
  { name: "BARI Alu 53", origin: "Bangladesh / BARI", region: "South Asia", uses: ["All-purpose", "Fresh market"], trait: "Newer high-yield BARI variety for Bangladeshi commercial production." },
  { name: "BARI Alu 78", origin: "Bangladesh / BARI", region: "South Asia", uses: ["All-purpose"], trait: "Recent BARI release expanding the Bangladeshi commercial variety portfolio." },
  { name: "Sadaf", origin: "Pakistan / PARC", region: "South Asia", uses: ["All-purpose", "Fresh market"], trait: "Pakistani national release. Adapted to Punjab plains and double-cropping system." },
  { name: "Khyber", origin: "Pakistan / PARC", region: "South Asia", uses: ["All-purpose"], trait: "Pakistani PARC variety. Cool-season release suited to KPK and northern Punjab." },
  { name: "Khumal Bikas", origin: "Nepal", region: "South Asia", uses: ["All-purpose", "Fresh market"], trait: "Nepalese commercial variety. Adapted to mid-hill agro-ecological zones." },
  { name: "Janak Dev", origin: "Nepal", region: "South Asia", uses: ["All-purpose"], trait: "Nepalese variety with good keeping quality. Common in Terai and inner-Terai production." },

  // Additional Africa (+10)
  { name: "Kenya Faulu", origin: "Kenya / KALRO", region: "Africa", uses: ["All-purpose", "Fresh market"], trait: "KALRO-released Kenyan variety. Part of the post-Shangi diversification programme." },
  { name: "Awash", origin: "Ethiopia / EARO", region: "Africa", uses: ["All-purpose", "Fresh market"], trait: "Ethiopian highland commercial variety released for the Awash river valley region." },
  { name: "Bubu", origin: "Ethiopia / EARO", region: "Africa", uses: ["All-purpose"], trait: "Ethiopian highland variety. Late-blight tolerant, yields well at 2,000m+ elevations." },
  { name: "Menagesha", origin: "Ethiopia", region: "Africa", uses: ["All-purpose"], trait: "Ethiopian commercial variety for the Shewa highlands and central highland zones." },
  { name: "Hundee", origin: "Ethiopia", region: "Africa", uses: ["All-purpose"], trait: "Ethiopian highland variety with strong smallholder adoption in Oromia region." },
  { name: "Kinigi", origin: "Rwanda", region: "Africa", uses: ["All-purpose", "Fresh market"], trait: "Major Rwandan commercial variety from the volcanic-soil northern highlands. Named for the volcano region." },
  { name: "Bufumbira", origin: "Uganda / Rwanda border", region: "Africa", uses: ["All-purpose"], trait: "Cross-border highland variety grown in southwestern Uganda and northern Rwanda." },
  { name: "Victoria", origin: "Uganda", region: "Africa", uses: ["All-purpose", "Fresh market"], trait: "Major Ugandan variety. Named for Lake Victoria region; widely grown by smallholders." },
  { name: "Kachpot 1", origin: "Uganda / NaCRRI", region: "Africa", uses: ["All-purpose"], trait: "Ugandan NaCRRI release. Late-blight resistant, adapted to East African highlands." },
  { name: "Mnandi", origin: "South Africa", region: "Africa", uses: ["All-purpose", "Fresh market"], trait: "South African commercial variety. Long oval, smooth white skin." },

  // Additional East Asia & Pacific (+18)
  { name: "Zhongshu 5", origin: "China / CAAS", region: "East Asia & Pacific", uses: ["All-purpose", "Fresh market"], trait: "Major CAAS-released Chinese variety. Widely grown across northern China provinces." },
  { name: "Zhongshu 18", origin: "China / CAAS", region: "East Asia & Pacific", uses: ["All-purpose", "Processing / Industrial"], trait: "Newer CAAS release improving on the Zhongshu series. High yield and good processing quality." },
  { name: "Zhongshu 19", origin: "China / CAAS", region: "East Asia & Pacific", uses: ["All-purpose"], trait: "CAAS variety for northern Chinese plains. Late-maturity high-yield release." },
  { name: "Heinongshu 1", origin: "China / Heilongjiang Academy", region: "East Asia & Pacific", uses: ["All-purpose"], trait: "Heilongjiang Academy variety for cold-tolerant northeast Chinese production." },
  { name: "Jizhangshu 8", origin: "China / Hebei", region: "East Asia & Pacific", uses: ["All-purpose", "Fresh market"], trait: "Hebei provincial Academy release. Major commercial variety in north-central China." },
  { name: "Longshu 3", origin: "China / Gansu", region: "East Asia & Pacific", uses: ["All-purpose", "Processing / Industrial"], trait: "Gansu Academy variety bred for the dry-zone northwest Chinese production." },
  { name: "Longshu 7", origin: "China / Gansu", region: "East Asia & Pacific", uses: ["All-purpose", "Processing / Industrial"], trait: "Improved Longshu line from Gansu. Higher yield potential than Longshu 3." },
  { name: "Mira", origin: "Russia / China cultivation", region: "East Asia & Pacific", uses: ["All-purpose"], trait: "Long-running commercial variety, originally Russian-derived; dominant in northern China for decades." },
  { name: "Lujian 2", origin: "China / Shandong", region: "East Asia & Pacific", uses: ["All-purpose", "Fresh market"], trait: "Shandong provincial variety for east China production zones." },
  { name: "Yushu 3", origin: "China / Yunnan", region: "East Asia & Pacific", uses: ["All-purpose"], trait: "Yunnan provincial variety. Adapted to southwest Chinese subtropical highland conditions." },
  { name: "Eshu 3", origin: "China / Hubei", region: "East Asia & Pacific", uses: ["All-purpose"], trait: "Hubei provincial variety for central Chinese production." },
  { name: "Chuanyu 117", origin: "China / Sichuan", region: "East Asia & Pacific", uses: ["All-purpose"], trait: "Sichuan Agricultural Academy variety for southwest China; suited to two-cropping systems." },
  { name: "Kitaakari", origin: "Japan", region: "East Asia & Pacific", uses: ["Boiling / Salad", "Mashing"], trait: "Japanese yellow-fleshed home-cooking variety. Distinctive sweet flavour, popular for Japanese curry." },
  { name: "Konafubuki", origin: "Japan", region: "East Asia & Pacific", uses: ["Chips", "Processing / Industrial"], trait: "Japanese chip-processing variety. White flesh, used by Calbee and other Japanese snack producers." },
  { name: "Sebago", origin: "USA origin / Australian commercial (1938)", region: "East Asia & Pacific", year: "1938", uses: ["All-purpose", "Boiling / Salad"], trait: "Originally USA-bred (1938); the dominant fresh-market variety across Australia for decades." },
  { name: "Kestrel", origin: "United Kingdom (1992)", region: "East Asia & Pacific", year: "1992", uses: ["All-purpose", "Frying / Fries"], trait: "UK-origin variety, popular in Australian and New Zealand commercial production." },
  { name: "Crystal", origin: "Australia", region: "East Asia & Pacific", uses: ["Fresh market", "Boiling / Salad"], trait: "Australian commercial variety. White-skinned, smooth oval, fresh-market focus." },
  { name: "Nadine", origin: "United Kingdom", region: "East Asia & Pacific", uses: ["Boiling / Salad", "Fresh market"], trait: "UK-origin; widely grown commercially in New Zealand for premium fresh market." },

  // Eastern Europe (+15) NEW REGION
  { name: "Bryza", origin: "Poland / IHAR-PIB", region: "Eastern Europe", uses: ["All-purpose"], trait: "Polish national programme variety. Bred at IHAR-PIB Radzików; widely grown across Polish plains." },
  { name: "Lord", origin: "Poland / IHAR-PIB", region: "Eastern Europe", uses: ["All-purpose", "Fresh market"], trait: "Polish IHAR variety. Yellow-flesh, mid-early; common in Polish retail." },
  { name: "Tajfun", origin: "Poland / IHAR-PIB", region: "Eastern Europe", uses: ["All-purpose"], trait: "Polish national variety from IHAR-PIB. Bred for Polish climatic conditions and disease pressure." },
  { name: "Vineta", origin: "Germany (Norika), grown across Poland", region: "Eastern Europe", uses: ["All-purpose", "Boiling / Salad"], trait: "Norika-bred German variety. Yellow flesh; one of the most widely grown varieties across Poland." },
  { name: "Jelly", origin: "Germany (Norika), grown across Poland", region: "Eastern Europe", uses: ["All-purpose", "Boiling / Salad"], trait: "Norika German variety. Late-maincrop with strong storage; common across Polish markets." },
  { name: "Nevskij", origin: "Russia / Lorch Institute (1976)", region: "Eastern Europe", year: "1976", uses: ["All-purpose"], trait: "Major Russian commercial variety. Mid-season, drought-tolerant; dominant in central Russian production." },
  { name: "Sineglazka", origin: "Russia (heritage)", region: "Eastern Europe", uses: ["Boiling / Salad", "Specialty"], trait: "Russian heritage variety prized by home gardeners. Blue-eyed white skin, distinctive flavour." },
  { name: "Lugovskoy", origin: "Ukraine / Russia", region: "Eastern Europe", uses: ["All-purpose"], trait: "Ukrainian-origin variety widely planted across former Soviet potato production." },
  { name: "Lasunok", origin: "Belarus / Russia", region: "Eastern Europe", uses: ["All-purpose", "Mashing"], trait: "Long-running Belarusian/Russian commercial variety. Floury texture, good for mash and boiling." },
  { name: "Krepysh", origin: "Russia / Lorch Institute", region: "Eastern Europe", uses: ["All-purpose"], trait: "Russian commercial variety. Early-maturing, suited to short Russian growing seasons." },
  { name: "Vladar", origin: "Czech Republic", region: "Eastern Europe", uses: ["All-purpose"], trait: "Czech national variety. Yellow-flesh maincrop; popular in central European retail." },
  { name: "Karelia", origin: "Czech Republic", region: "Eastern Europe", uses: ["All-purpose", "Boiling / Salad"], trait: "Czech commercial variety. Mid-early yellow-flesh; suited to Czech and Slovak conditions." },
  { name: "Bellaprima", origin: "Belarus", region: "Eastern Europe", uses: ["All-purpose"], trait: "Belarusian national variety released for Belarusian commercial production." },
  { name: "Sviteź", origin: "Belarus", region: "Eastern Europe", uses: ["All-purpose"], trait: "Belarusian variety from the Polessky Institute breeding programme." },
  { name: "Magda", origin: "Hungary", region: "Eastern Europe", uses: ["All-purpose"], trait: "Hungarian national variety. Suited to Hungarian and central European production conditions." },

  // Latin America (non-Andean) (+12) NEW REGION
  { name: "BRS Ana", origin: "Brazil / EMBRAPA (2002)", region: "Latin America", year: "2002", uses: ["Frying / Fries", "All-purpose"], trait: "EMBRAPA Brazilian variety bred for both fresh and frying markets. Widely planted in southern Brazil." },
  { name: "BRS Catucha", origin: "Brazil / EMBRAPA", region: "Latin America", uses: ["All-purpose", "Fresh market"], trait: "Brazilian EMBRAPA release. Smooth oval shape, fresh-market suited." },
  { name: "BRS Clara", origin: "Brazil / EMBRAPA", region: "Latin America", uses: ["All-purpose", "Frying / Fries"], trait: "Brazilian EMBRAPA dual-purpose variety. Yellow flesh; suited to Brazilian processing market." },
  { name: "BRS Cota", origin: "Brazil / EMBRAPA", region: "Latin America", uses: ["Fresh market", "All-purpose"], trait: "EMBRAPA fresh-market variety for Brazilian retail. White-skinned." },
  { name: "BRS Eliza", origin: "Brazil / EMBRAPA", region: "Latin America", uses: ["All-purpose"], trait: "Brazilian EMBRAPA release. Mid-season variety adapted to subtropical conditions." },
  { name: "Pampeana INTA", origin: "Argentina / INTA", region: "Latin America", uses: ["All-purpose", "Frying / Fries"], trait: "Argentine INTA release. Bred for Pampas production zones; dual-purpose fresh and processing." },
  { name: "Newen INTA", origin: "Argentina / INTA", region: "Latin America", uses: ["All-purpose"], trait: "Argentine INTA variety. Adapted to Buenos Aires province production zones." },
  { name: "Frital INTA", origin: "Argentina / INTA", region: "Latin America", uses: ["Frying / Fries", "Processing / Industrial"], trait: "INTA Argentina-bred fry processing variety. Used in domestic and Mercosur fry supply." },
  { name: "Daisy", origin: "Argentina / Mendoza", region: "Latin America", uses: ["All-purpose"], trait: "Argentine commercial variety. Common in Mendoza and central Argentine production." },
  { name: "Alfa", origin: "Mexico (Dutch import widely used)", region: "Latin America", uses: ["All-purpose", "Fresh market"], trait: "Dominant variety in Mexican commercial production. Original Dutch genetics, naturalised in Mexican market." },
  { name: "Lupita", origin: "Mexico / INIFAP", region: "Latin America", uses: ["All-purpose", "Fresh market"], trait: "INIFAP Mexican variety. Bred for Mexican highland production zones (Sinaloa, México state)." },
  { name: "Yagana", origin: "Chile / INIA", region: "Latin America", uses: ["All-purpose", "Boiling / Salad"], trait: "INIA Chilean commercial variety. Widely grown across Chilean potato regions south of Santiago." },

  // Additional Specialty / Heritage (+5)
  { name: "Bonnotte", origin: "France / Noirmoutier (heritage)", region: "Specialty / Heritage", uses: ["Boiling / Salad", "Specialty"], trait: "Premium French island variety from Noirmoutier. Limited annual harvest; among the world's most expensive potatoes." },
  { name: "Roseval", origin: "France (1950)", region: "Specialty / Heritage", year: "1950", uses: ["Boiling / Salad", "Specialty"], trait: "French heritage red-skinned salad variety. Yellow flesh; classic for warm potato salads." },
  { name: "Amandine", origin: "France / Germicopa (1994)", region: "Specialty / Heritage", year: "1994", uses: ["Boiling / Salad", "Specialty"], trait: "French gourmet salad variety bred by Germicopa, marketed as Princesse Amandine®. Long oblong, melt-in-the-mouth texture; reference variety in premium French retail." },
  { name: "Linzer Delikatesse", origin: "Austria (heritage)", region: "Specialty / Heritage", uses: ["Boiling / Salad", "Specialty"], trait: "Austrian premium fingerling variety. Yellow-flesh; traditional Austrian gastronomy." },
  { name: "Stemster", origin: "France / Germicopa", region: "Specialty / Heritage", uses: ["All-purpose"], trait: "French red-skinned multi-purpose variety bred by Germicopa, marketed as 'Prospère' in garden markets. Long storage (6-8 months) and good drought tolerance." },
];

// Curated list of globally iconic varieties (market-defining, culturally significant).
export const ICONIC_VARIETIES = new Set([
  "russet-burbank", "bintje", "spunta", "maris-piper", "desiree",
  "yukon-gold", "king-edward", "diamant", "shangi",
  "kufri-pukhraj", "kufri-jyoti", "yungay", "diacol-capiro",
  "atlantic", "charlotte", "sebago", "nevskij", "zhongshu-5",
  "brs-ana", "tigoni", "papa-amarilla", "belle-de-fontenay",
  "kufri-chipsona-1", "unica"
]);

export function getTier(v) {
  const slug = slugify(v.name);
  if (ICONIC_VARIETIES.has(slug)) return "Iconic";
  const yearMatch = v.year ? String(v.year).match(/\d{4}/) : null;
  const year = yearMatch ? parseInt(yearMatch[0]) : null;
  if (year && year < 1970) return "Heritage";
  if (year && year >= 2010) return "Recent";
  return null;
}

export const USE_COLORS = {
  "Frying / Fries":          { bg: "rgba(198,40,40,0.08)",  fg: "#C62828" },
  "Chips":                   { bg: "rgba(21,101,192,0.08)", fg: "#1565C0" },
  "Boiling / Salad":         { bg: "rgba(46,125,50,0.08)",  fg: "#2E7D32" },
  "Baking / Roasting":       { bg: "rgba(239,108,0,0.08)",  fg: "#EF6C00" },
  "Mashing":                 { bg: "rgba(106,27,154,0.08)", fg: "#6A1B9A" },
  "Fresh market":            { bg: "rgba(0,121,107,0.08)",  fg: "#00796B" },
  "Processing / Industrial": { bg: "rgba(69,90,100,0.08)",  fg: "#455A64" },
  "All-purpose":             { bg: "rgba(120,120,120,0.08)", fg: "#666666" },
  "Specialty":               { bg: "rgba(216,27,96,0.08)",  fg: "#D81B60" },
};

export const TIER_COLORS = {
  "Iconic":   { bg: "linear-gradient(135deg,#C62828,#8E0000)", fg: "#fff" },
  "Heritage": { bg: "rgba(141,110,99,0.15)", fg: "#5D4037" },
  "Recent":   { bg: "rgba(46,125,50,0.10)",  fg: "#2E7D32" },
};

// Map origin string keywords to existing /country/* slugs.
const COUNTRY_KEYWORDS = [
  ["united-states",   ["USA", "United States", "American", "Cornell", "Maine", "Idaho", "Texas A&M", "North Dakota State", "Frito-Lay"]],
  ["netherlands",     ["Netherlands", "Dutch", "HZPC", "Agrico"]],
  ["germany",         ["Germany", "German", "Norika"]],
  ["france",          ["France", "French", "INRA", "Noirmoutier"]],
  ["india",           ["India", "ICAR-CPRI", "Kufri"]],
  ["china",           ["China", "CAAS", "Heilongjiang", "Hebei", "Gansu", "Sichuan", "Yunnan", "Hubei", "Shandong"]],
  ["japan",           ["Japan", "Hokkaido"]],
  ["peru",            ["Peru", "CIP", "INIAA"]],
  ["colombia",        ["Colombia"]],
  ["kenya",           ["Kenya", "KALRO", "KARI"]],
  ["bangladesh",      ["Bangladesh", "BARI"]],
  ["pakistan",        ["Pakistan", "PARC"]],
  ["belgium",         ["Belgium", "Belgian"]],
  ["united-kingdom",  ["United Kingdom", "UK", "British", "Scotland", "Scottish", "Ireland", "SCRI"]],
  ["canada",          ["Canada", "Canadian"]],
  ["australia",       ["Australia", "Australian"]],
  ["brazil",          ["Brazil", "Brazilian", "EMBRAPA"]],
  ["denmark",         ["Denmark", "Danish"]],
  ["nepal",           ["Nepal", "Nepalese"]],
];

export function getCountrySlugFromOrigin(origin) {
  if (!origin) return null;
  for (const [slug, keywords] of COUNTRY_KEYWORDS) {
    for (const kw of keywords) {
      if (origin.includes(kw)) return slug;
    }
  }
  return null;
}

// Knowledge / blog cross-link recommender per variety
export function getRelatedLinks(v) {
  const links = [];
  const lname = (v.name || "").toLowerCase();
  const lorigin = (v.origin || "").toLowerCase();
  const lregion = (v.region || "").toLowerCase();

  if (lname.includes("kufri")) links.push({ href: "/knowledge/kufri-potato-varieties-india", text: "Kufri varieties guide — India's CPRI breeding pipeline" });
  if (lname.includes("russet burbank")) links.push({ href: "/knowledge/russet-burbank-history", text: "Russet Burbank history — McDonald's variety story" });
  if (lname.includes("russet")) links.push({ href: "/knowledge/mcdonalds-potato-varieties", text: "What potatoes does McDonald's use?" });
  if (v.uses && v.uses.includes("Chips")) links.push({ href: "/knowledge/unhealthiest-potato-chips", text: "What is the unhealthiest potato chip?" });
  if (v.uses && v.uses.includes("Frying / Fries")) links.push({ href: "/knowledge/diabetics-and-french-fries", text: "Can diabetics eat French fries?" });
  if (lregion.includes("andean")) links.push({ href: "/blog/andean-potato-origin-story", text: "Where every potato began — the Andean origin story" });
  if (lorigin.includes("bari") || lorigin.includes("bangladesh")) links.push({ href: "/blog/bangladesh-8th-producer-nobody-knows", text: "Bangladesh: the hidden top-10 producer" });
  if (lorigin.includes("kenya") || lorigin.includes("kalro") || lorigin.includes("kari")) links.push({ href: "/blog/kenya-potato-boom-wpc-2026", text: "Kenya's potato boom — WPC 2026 in Naivasha" });
  if (lorigin.includes("belgium") || lname === "bintje") links.push({ href: "/blog/belgium-worlds-fry-capital", text: "How tiny Belgium became the #1 fry exporter" });
  // climate cross-link for heat-tolerant varieties
  if ((v.trait || "").toLowerCase().includes("heat-tolerant") || (v.trait || "").toLowerCase().includes("late-blight")) {
    links.push({ href: "/blog/climate-change-rewriting-potato-map", text: "How climate change is rewriting the potato map" });
  }
  // generic
  links.push({ href: "/knowledge/potato-varieties-guide", text: "Complete potato varieties guide" });

  // dedupe + cap
  const seen = new Set();
  return links.filter(l => { if (seen.has(l.href)) return false; seen.add(l.href); return true; }).slice(0, 4);
}

// Final exported, slug-augmented array.
const _slugCounts = {};
export const VARIETIES = RAW_VARIETIES.map((v) => {
  let slug = slugify(v.name);
  // collision handling
  _slugCounts[slug] = (_slugCounts[slug] || 0) + 1;
  if (_slugCounts[slug] > 1) slug = `${slug}-${_slugCounts[slug]}`;
  return { ...v, slug, tier: getTier(v) };
});

export function getVarietyBySlug(slug) {
  return VARIETIES.find((v) => v.slug === slug);
}

export function getRelatedVarieties(v, limit = 4) {
  // Prefer same region; fall back to shared use
  const sameRegion = VARIETIES.filter((o) => o.slug !== v.slug && o.region === v.region);
  const sharedUse = VARIETIES.filter((o) =>
    o.slug !== v.slug &&
    o.region !== v.region &&
    (o.uses || []).some((u) => (v.uses || []).includes(u))
  );
  return [...sameRegion, ...sharedUse].slice(0, limit);
}

export function getIconicVarieties() {
  return VARIETIES.filter((v) => v.tier === "Iconic");
}

// Hand-curated "best variety for X" picks — an editorial judgment call, not
// something safely derived from tags alone (many varieties share a use tag).
// Mirrors the same curation approach as ICONIC_VARIETIES above.
const QUICK_ANSWERS = [
  { use: "Frying / Fries", slug: "russet-burbank" },
  { use: "Chips", slug: "atlantic" },
  { use: "Mashing", slug: "yukon-gold" },
  { use: "Baking / Roasting", slug: "king-edward" },
  { use: "Boiling / Salad", slug: "charlotte" },
];

export function getQuickAnswers() {
  return QUICK_ANSWERS.map((qa) => ({ ...qa, variety: getVarietyBySlug(qa.slug) })).filter((qa) => qa.variety);
}

export function getVarietiesByCountrySlug(countrySlug, limit = null) {
  const matches = VARIETIES.filter((v) => getCountrySlugFromOrigin(v.origin) === countrySlug);
  // Sort: Iconic first, then by year desc, then by name
  const sorted = [...matches].sort((a, b) => {
    if (a.tier === "Iconic" && b.tier !== "Iconic") return -1;
    if (b.tier === "Iconic" && a.tier !== "Iconic") return 1;
    const ay = parseInt((a.year || "").match(/\d{4}/)?.[0] || "0");
    const by = parseInt((b.year || "").match(/\d{4}/)?.[0] || "0");
    if (by !== ay) return by - ay;
    return a.name.localeCompare(b.name);
  });
  return limit ? sorted.slice(0, limit) : sorted;
}
