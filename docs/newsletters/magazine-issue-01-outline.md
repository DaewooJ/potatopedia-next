# Potatopedia Magazine, Issue 01: outline and build plan (13 Nov 2026)

Status: **plan and empty template only.** No article is written, no photo chosen, no person booked. Nothing is published or deployed.
Template (placeholders marked TEMPLATE): `~/Projects/magz/potatopedia/index.html` (+ `flatplan.csv`, `credits.csv`).

## What the magazine is
A monthly digital flipbook: the best of the three titles (Potato Processing Weekly, Seed Potato & Field, Potato Prices & Trade), one long feature, one expert interview, ad pages. Accent red `#C62828` on ink/ivory. The three title accents (blue `#1E5A8A`, brown `#8B5A2B`, amber `#A86200`, from `lib/newsletters.js`) mark each title's section. No green anywhere.

## House rules carried over from DigiMagz (`~/Projects/digimagz/CLAUDE.md`, `~/Projects/magz/CLAUDE.md`)
- Real photographs only: supplied, commissioned, or licensed stock with credit. **No AI-generated photographs.** AI may only retouch (for example extend a background), and that is logged. Every photo goes into `credits.csv` (source, licence or permission).
- Issue label is **"Issue 01"**, never a future date or month on the cover or pages.
- Page count is always a multiple of 4, cover included. This issue: **24 pages**.
- Never invent a quote, person, figure or photo. Never put quotation marks around words the source did not say. A stock person never poses as a named company's staff; no face repeated between cover and inside.
- Full editorial furniture: editor's letter (signed), masthead/team box, contributors, advertiser index, "On the cover", captions with credits, sentence captions.
- Paid pages are visibly different from editorial and say "Advertisement" or "Sponsored" / "Published with us". Sponsors never edit news. Sponsored copy never enters the neutral RAG corpus.
- Fonts: open-licence only until a family is bought. Template uses Source Serif 4 (text) and Poppins (furniture, the site font), both Google Fonts, SIL OFL.
- Facts follow site rules: American spelling, tonnes, USD, dates "13 Nov 2026", latest government estimate named.
- Nothing is published, sent or bought without Devendra's say-so.

## Page-by-page plan (24 pages)
Spreads on screen: 2-3, 4-5 ... 22-23. Cover and back cover stand alone. "Best of" pages reuse **stories already published on the website** (each has a primary source), rewritten for print. Nothing new is invented for the magazine.

| Page | Spread | Content | Notes |
|---|---|---|---|
| 1 | cover | Cover | Real photograph, 3 cover lines from the issue, masthead, "Issue 01". See cover concept below. |
| 2 | inside front cover | **Ad, full page** | Labelled "Advertisement". Premium position. |
| 3 | 2-3 | Contents + editor's letter | Letter signed by the editor. Name TBD. |
| 4 | 4-5 | Masthead, contributors, how we label sponsors | Carries "Clearly labelled sponsors. Never paid rankings. Never paid facts." |
| 5 | 4-5 | Number of the month | One figure, primary source and date, print-style chart beside text. From the Prices & Trade data. |
| 6-7 | 6-7 | Best of Potato Prices & Trade | Amber band. 2 pages: lead story, data box. |
| 8 | 8-9 | **Ad, full page** | |
| 9-10 | 8-9, 10-11 | Best of Potato Processing Weekly | Blue band. 2 pages. |
| 11 | 10-11 | Events + **half-page ad** | Events from the Exhibitions record (potato shows only). |
| 12-13 | 12-13 | Best of Seed Potato & Field | Brown band. 2 pages. |
| 14 | 14-15 | Spotlight | A company or expert spotlight. If paid: "Sponsored" or "Published with us", different type treatment. |
| 15 | 14-15 | **Ad, full page** | |
| 16-19 | 16-17, 18-19 | **Long feature** (4 pages) | One topic, sourced end to end, sources block on p19. Topic TBD by Devendra; pick from the issue's strongest web stories. |
| 20-21 | 20-21 | **Expert interview** | **Person TBD. No one is named here.** Candidates are on the contributors list (`contributors.md`), approach only when Devendra asks. Questions and answers approved by the interviewee; their own photo, with permission. |
| 22 | 22-23 | **Ad: two half pages** | |
| 23 | 22-23 | Next issue, subscribe, contribute, advertiser index | Signup and /contribute links. |
| 24 | back cover | **Ad, back cover** | Highest-priced position. |

Ad inventory in this plan: 1 inside front cover (full), 2 more full pages (8, 15), 1 half page (11), 2 half pages (22), 1 back cover (24). Proposal prices are in `media-kit-newsletters.md` and stay "TBC" until Devendra confirms. Until a title reaches the sales threshold, empty ad pages are filled by launch-partner slots (free, Devendra picks) or house pages, never by fake advertisers.

## Cover concept (real photos only)
- Ground: ink `#14110F`, ivory text, a thin red band under the masthead. Masthead "Potatopedia." with the red full stop; line "Magazine · Issue 01".
- One large real photograph full-bleed: a field, a harvest, a storage shed or a processing line. It must be our own, supplied by a company or institution with written permission, or licensed stock (Pexels/Unsplash with credit, as DigiMagz does, logged in `credits.csv`). No stock person posing as a named company's staff.
- Three cover lines, each pointing to a page and taken from stories that exist on the site. No invented headlines.
- Short "On the cover" credit on page 3 naming the photographer and source.
- Social card (1080x1350) made from the cover whole, never cropped, as DigiMagz does for `public/social/ig/`.

## Build method (how DigiMagz makes a flipbook)
Found in `~/Projects/digimagz` (engine; `docs/plan.md`, `CLAUDE.md`, `issues/rasoi-sample/`) and `~/Projects/magz` (the site, which shows issues):
1. **Print issue** is laid out in InDesign by a script per issue (`issues/<title>/build.jsx`, run through the engine), exported as PDF/X-4 (CMYK, 3 mm bleed). Preflight and `qa/lint.py` + `qa/craft_lint.py` must pass before a version is called done.
2. **Digital flipbook** has two routes in the DigiMagz plan: (a) Heyzine hosted flipbook (Devendra already has a subscription; plan.md section "Outputs") and (b) the site's own `Flipbook` component (`~/Projects/magz/components/work/Flipbook.tsx`): page JPGs in `public/work/<slug>/pNN.jpg`, an `IssuePage[]` list (src, alt, label) in `lib/work.ts`, two-page spreads on desktop, one page on phones, drag, tap, arrow keys. Rasoi is "Issue 01" built this way (12 pages).
3. **Web edition** (optional, reflowing phone-first page, `/read/<slug>`) is a separate product; see `~/Projects/magz/docs/web-edition.md`.
4. For Potatopedia the recommended route is (a) Heyzine or a PDF embedded on a `/magazine` page, because the site must keep its own palette (ink/ivory/red) and the magz site is the studio's portfolio, not Potatopedia's host. Decision for Devendra: Heyzine vs own component.

## How to view the template
- Double-click `~/Projects/magz/potatopedia/index.html`, or run `cd ~/Projects/magz/potatopedia && python3 -m http.server 8090` and open http://localhost:8090.
- Arrow keys or buttons turn pages; page numbers below jump. Desktop shows spreads, phones show one page. Every page says TEMPLATE.
- Fonts load from Google Fonts when online and fall back to Georgia/system otherwise.

## Open questions for Devendra
1. Editor name for the letter (staff byline) and who signs.
2. Long-feature topic for Issue 01.
3. Expert interview: which contributor, and approach only on his go-ahead.
4. Heyzine vs own flipbook component for hosting.
5. Cover photograph source: own, partner-supplied, or licensed stock (which licence).
6. Launch-partner companies for ad pages (his picks).
7. When Issue 01 goes out relative to the first newsletter issues (calendar in `CONTRACT.md`).
