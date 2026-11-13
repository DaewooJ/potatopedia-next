# Research check: 13 Nov keyword table still stands? (13 Nov 2026)

No Mangools credits were spent. Checked by reading `keywords.csv`, `research.md`, `brief.md` and prompt section 4 in `~/Projects/Pers/commands/prompts/2026-11-13-potatopedia-newsletters/`.

## Result
- **The prompt's section 4 table matches `keywords.csv` exactly.** A script compared all 15 rows (volume, KD, CPC): 0 mismatches. `research.md` repeats the same volumes (seed potatoes 27,500; kennebec 21,300; certified seed 19,900; seed potatoes for planting 14,300; burbank russet 11,700; potato prices 10,200; buy seed / seed for sale 6,200; potato price today 3,300; current potato price 1,000; frozen fries price 880; potato news 840; production of potato 830; mccain fries price 600; potato processing 500; sorting potatoes 290; potato chip production 460).
- **The data is the same day's pull.** All figures date from 13 Nov 2026 (Mangools, location Anywhere), i.e. today, so nothing has aged. Mangools serves repeated identical calls from cache for 24 hours, so re-running today would cost nothing but would also return the same numbers: a re-pull is only useful from about 14 Nov, and monthly volumes move slowly. Suggested re-check date: mid-December 2026, one batch call, to see the first effect of the new pages.
- **Conclusions in `research.md` still follow from the table:** nobody searches for the newsletter names ("potato news" 840/mo; "potato news today" 210 is a rival's brand, not targeted); Seed carries volume, Prices second, Processing the highest CPC (sorting potatoes 2.42, potato processing 1.47). Titles keep "Potato" in every name, as decided.

## Things to note (not errors)
1. **Rows in the CSV that the prompt table leaves out** (kept as secondary targets): potato news today (210), potato chips processing (180, KD 18, CPC 0.71), potato sorting (60, KD 17), blanching chips (240), potato starch processing (40). The prompt already assigns them to the same owner pages.
2. **KD is missing for most rows** (blank in the CSV, "–" in the prompt). Only seed potatoes 38, buy seed potatoes 19, seed potatoes for sale 35, potato chip production 15, kennebec 23 and a few small ones have KD. Rankability of the high-volume rows (certified seed potatoes, potato prices) is therefore unproven; the KD should be pulled for them in the December batch.
3. **Indian intent inside "potato price today":** `research.md` says much of the 3,300 is Indian retail ("potato rs today" 2,900, "aloo price" 850). The site rule says no Indian mandi pages, so realistic volume for a global /prices page is below the headline. Treat 3,300 as a ceiling.
4. **The 13 Nov variety figures belong to the variety pages** (kennebec 21,300; burbank russet 11,700), not the newsletter hubs.
5. **Baseline mismatch between documents:** prompt section 10 says 1,241 clicks (13 Oct to 10 Nov, position 9.0); the performance baseline noted on 13 Nov in the project memory says 1,189 clicks per 28 days (+106%). Different windows or sources; state the window when quoting either.
6. **Prompt says Plausible; the site uses GA4 + Vercel Analytics only** (CLAUDE.md, 8 Nov). The media-kit draft uses GA4/GSC.
7. **Name check** (`research.md`) was a web search on 13 Nov; the three titles were not found as existing publications. Not re-run (no new information expected within a day); repeat before the launch post.
