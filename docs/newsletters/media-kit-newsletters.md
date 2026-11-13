# Media kit: newsletters and magazine section (draft, 13 Nov 2026)

Draft for the PDF media kit (`~/.claude/scripts/pdf.sh`) and for /advertise#newsletters. **All prices are "TBC": Devendra has not confirmed them**, and `SHOW_NEWSLETTER_PRICES` stays false until he does. HTML draft in the existing style: `media-kit-newsletters.section.html` (same classes as `docs/media-kit.template.html`; paste its two `<section>` pages before the "rules" page and replace the "Daily presenter and newsletter / The Potato Week" card, which this section supersedes).

## 1. Products

| # | Product | Where it appears | Who buys it | Unit | Price |
|---|---|---|---|---|---|
| 1 | Presenting sponsor, Potato Processing Weekly | Top of the issue: logo and 60-word message, labelled Sponsored | Processing-line makers, optical sorters, fryers, peelers, packaging, oil, flavors, engineering firms | per issue | TBC |
| 2 | Presenting sponsor, Seed Potato & Field | Same format | Breeders and seed houses, planters, harvesters, haulm toppers, storage and ventilation, crop protection, irrigation, labs | per issue | TBC |
| 3 | Presenting sponsor, Potato Prices & Trade | Same format | Traders, shipping and logistics, cold chain, banks and insurers, market-data buyers | per issue | TBC |
| 4 | Mid-issue classified (40 words + link) | Inside any one issue, labelled | Any potato company | per issue | TBC |
| 5 | Sponsored article ("Published with us") | On the site, in one issue, and one LinkedIn post | Any potato company | per article | TBC |
| 6 | Magazine full page / half page | Potatopedia Magazine, labelled Advertisement | Any potato company | per issue | TBC / TBC |
| 7 | Magazine back cover | Back cover, labelled Advertisement | Any potato company | per issue | TBC |
| 8 | World Potato Yearbook title sponsor | Yearbook 2027 (proposal in `yearbook-2027-plan.md`) | Any potato company | per year | TBC |

Cadence for context: Potato Processing Weekly every Tuesday; Seed Potato & Field every other Thursday from 26 Nov 2026; Potato Prices & Trade the first Monday of the month; Potatopedia Magazine monthly. Send time 06:00 UTC.

## 2. Audience section: only true numbers, filled by script

Rule: a number appears only if the script can read it from its source on the day the kit is built. If a source is empty the line shows "available on request" with the date, never a guess. 0 newsletter subscribers existed at the baseline (11 Nov 2026), so until the lists grow most lines will say so.

| Line in the kit | Placeholder | Source |
|---|---|---|
| Confirmed subscribers, Potato Processing Weekly | `{{subs_processing}}` | Neon `subscriptions` (status confirmed, per title) |
| Confirmed subscribers, Seed Potato & Field | `{{subs_seed}}` | same |
| Confirmed subscribers, Potato Prices & Trade | `{{subs_prices}}` | same |
| Unique open rate, per title (last 3 sent issues) | `{{open_processing}}` `{{open_seed}}` `{{open_prices}}` | SES events in `email_events` |
| Click rate, per title | `{{click_processing}}` `{{click_seed}}` `{{click_prices}}` | same |
| Subscriber countries | `{{countries}}` | signup form country field |
| Subscriber job roles | `{{roles}}` (share per role) | signup form job role list |
| LinkedIn newsletter subscribers | `{{li_subs_processing}}` etc. | read by hand from the LinkedIn page analytics, with the date |
| Site visits and clicks | `{{gsc_clicks}}` `{{gsc_impressions}}` | Google Search Console, stated period |
| Site users and sessions | `{{ga4_users}}` `{{ga4_sessions}}` | **Google Analytics 4 (G-0CXVFJDBF7) and Vercel Analytics.** The site does **not** use Plausible (the prompt's mention of Plausible is outdated; CLAUDE.md, 8 Nov 2026) |
| AI citations | `{{ai_citations}}` | Bing Webmaster AI export (`lib/ai-citations.json`) |
| Figures as of | `{{as_of}}` | date the script ran |

Every figure in the kit carries its period and source in small type.

## 3. Launch-partner rule
Do not sell until a title has **1,000 confirmed subscribers or 3 issues with a 35%+ unique open rate**. Before that, run **3-5 free "launch partner" slots** for well-known companies per title (social proof). **Devendra picks who.** Launch-partner slots follow all labelling rules; "free" never means unlabelled. The kit does not show a "founding rate" or any price until he confirms.

## 4. Labelling rules (put on the kit's last page and /advertise)
- The line **"Clearly labelled sponsors. Never paid rankings. Never paid facts."** appears on /editorial-standards, /advertise, each newsletter page and the kit.
- Every paid item says **"Sponsored"** or **"Published with us"** (magazine: "Advertisement"). Outbound links carry rel="sponsored".
- Sponsors never edit news items or neutral pages; a sponsor's news gets no extra coverage.
- Sponsored items never go in the neutral RAG corpus and never appear as /news items.
- No CSS class names with ad-, banner or sponsor (ad blockers hide them).
- Sources for neutral content: primary only (FAOSTAT, USDA, CIP, UN Comtrade, Eurostat, national boards, peer-reviewed journals); aggregators banned.
- Booking: "Book a sponsorship" form on /advertise#newsletters (lead type advertise_newsletter) mails Devendra and mirrors to Pers.

## 5. Open items
1. Devendra's prices (everything above is TBC).
2. Which entity invoices global clients (open since the prompt).
3. Whether the media kit PDF is regenerated now (with "0 subscribers" lines) or after the first issues.
