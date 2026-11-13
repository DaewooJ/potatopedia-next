# Newsletters + news desk — build contract (13 Nov 2026)

Prompt: ~/Projects/Pers/commands/prompts/2026-11-13-potatopedia-newsletters/prompt.md (read it in full).
Data: Neon potatopedia-db, tables in `db/newsletters.sql` (APPLIED 13 Nov). Titles/copy: `lib/newsletters.js`.

## Flow
```
backend newsdesk/collect.py (Netcup, every 6 h)      → news_candidates (status new)
backend newsdesk/draft (Netcup, daily 05:00 IST)     → news_items (status draft), candidates drafted|dropped
backend newsdesk/build_issue.py (day before send,     → issues (status preview, preview_token)
  09:00 IST)                                            → netweb enqueue: node ~/Projects/Pers/netweb/bin/nl-enqueue.mjs --issue <id>
netweb (Pers) WhatsApp preview to 98290 28498          link: https://www.potatopedia.com/issues/preview/<id>?t=<preview_token>
  replies YES NL / EDIT NL <changes> / NO NL           (EDIT → backend newsdesk/edit_issue re-drafts, new preview)
on YES NL (netweb, code only):                          1. POST /api/newsletters/publish {issue_id}   (items → published, issue approved+published, revalidate, IndexNow)
                                                        2. at send time POST /api/newsletters/send {issue_id} (loop while {remaining>0})
                                                        3. LinkedIn page post (pplinkedin, link in body) + LinkedIn newsletter edition hand-off to Devendra
no answer by send time → hold, remind once, never auto-send.
```
All internal API calls carry header `x-newsletter-secret: $NEWSLETTER_API_SECRET` (Vercel env + Netcup ~/.config/potatopedia/newsletter.env).

## Frontend API contract (agent F2 owns `app/api/newsletters/**`, `lib/newsletter-email.js`, `lib/news-db.js` write helpers, `app/admin/newsletters`)
- `POST /api/newsletters/subscribe` body `{email, name?, company?, role?, country?, titles: [slug...], page_url?, utm_*?}` → creates one `leads` row (type newsletter, details.titles, details.role) + one `subscriptions` row per title (pending), sends ONE double opt-in mail listing the titles; → `{ok:true}`. Rate-limit by ip_hash like /api/lead. Existing confirmed subscriber + new title → still needs confirm for the new title.
- `GET /api/newsletters/confirm?t=<confirm_token>` → confirms all pending rows sharing that token; redirects `/newsletters?confirmed=1`.
- `GET|POST /api/newsletters/unsubscribe?u=<unsub_token>` → GET shows a confirm page (link scanners safe), POST unsubscribes (RFC 8058 one-click: `List-Unsubscribe-Post: List-Unsubscribe=One-Click`). Logs email_events 'unsubscribe'.
- `POST /api/newsletters/publish` (secret) `{issue_id}` → items in issue → status published, pub_year/month/published_at set; issue status approved→published_at; `revalidatePath` for /news, /news/..., /issues/..., hubs, sitemaps; IndexNow ping (key file public/ddfadf3f59ea492aa8e581295b2c747a.txt). Refuses dry_run issues.
- `POST /api/newsletters/send` (secret) `{issue_id, limit?:400}` → sends to confirmed subscriptions of that title not yet in email_sends; SES configuration set `potatopedia-newsletters`; headers List-Unsubscribe + List-Unsubscribe-Post; tags issue_id; → `{sent, failed, remaining}`. Sets issue status sending→sent. Refuses dry_run and non-approved issues. `{test_to:"x@y"}` sends a single test copy (allowed for dry runs).
- `POST /api/newsletters/ses-events` → SNS (subscription confirm + notifications) → email_events; bounces/complaints set subscription status.
- `GET /api/newsletters/email/<issue_id>?t=<preview_token>` → the rendered email HTML (for previews / Litmus-style checks).
- `POST /api/revalidate` (secret) `{paths:[...]}`.
- `/admin/newsletters` (basic auth via proxy.js): subscribers per title per week, opens, clicks, unsubscribes, top stories, sponsor slots sold vs open, leads by type.

## Frontend pages (agent F1 owns everything else)
/newsletters, /newsletters/<slug> ×3, /news, /news/<yyyy>/<mm>/<slug>, /issues/<slug>/<yyyy-mm-dd>, /issues/preview/<id>?t= (noindex),
/contribute, /authors, /authors/<slug>, /editorial-standards, /advertise#newsletters, hubs, /news-sitemap.xml, sitemap + llms.txt entries,
homepage block (replaces "The Potato Week"), AI answer exit line, `components/NewsletterSignup.jsx` (posts to /api/newsletters/subscribe).
Read helpers in `lib/news-db.js` (F1 may add read queries; F2 adds write helpers in a separate file `lib/news-write.js`).

## Hubs (decided 13 Nov from GSC, no cannibalising)
- Processing: EXTEND `/knowledge/how-potatoes-are-processed` (ranks ~pos 10 for "potato processing"); `/processing` 308 → it. NEW `/processing/potato-chip-production`.
- Seed: NEW `/seed-field` (owns "seed potatoes", "seed potatoes for planting") + NEW `/seed-field/certified-seed-potatoes` (owns "certified seed potatoes", "buy seed potatoes", "seed potatoes for sale"); fold `/answers/certified-seed-potatoes` into it and 308 the old URL. Keep `/answers/seed-potato-certification` (process question) and link both ways.
- Prices: EXTEND `/prices` (dated "Latest from Potato Prices & Trade" box). NEW `/prices/frozen-fries` (export unit values from UN Comtrade/Eurostat only; no retail shelf prices).
- Existing `/prices/india` predates the "no Indian mandi pages" rule — left as is, flagged to Devendra. Create no new Indian price page.

## Rules every agent follows
- Nothing is published, posted or emailed without Devendra's YES NL. Dry runs never publish or send (except `test_to`).
- No invented numbers, quotes, people or photos. Every figure → a primary source URL. Banned, never cited or linked: PotatoPro, PotatoNewsToday, FreshPlaza, TimesCA, indianpotato.com, Potatoes.News and other aggregators (find the primary source or drop).
- American spelling site-wide (the site already uses it), tonnes, USD (+ local currency when the source uses it), dates "13 Nov 2026", months not seasons.
- No green/teal anywhere. Mobile first (390 + 360 px). Inline React styles, Poppins / lib/fonts.js, JS only, server components by default.
- Schema via `lib/authors.js` (`POTATOPEDIA_PUBLISHER` @id refs, never inline the Organization). "data points" never "chunks".
- No links to/from IndianPotato or its sister sites. No CSS class names containing ad-/banner/sponsor (ad blockers hide them).
- Sponsored items say "Sponsored" (or "Published with us"), rel="sponsored", never in news items, never in the RAG corpus. Prices on the rate card stay hidden until Devendra confirms (`SHOW_NEWSLETTER_PRICES = false`).
- Posting rule (newsletter day vs pp-daily): on a send day the LinkedIn page carries ONE post, the issue post; that day's pp-daily blog post still publishes on the site, skips its own LinkedIn post and appears in the issue as "From the Journal".
- `npm run build` must pass. Do not deploy to production; do not merge to main.

## Send calendar
PPW every Tuesday; SPF every other Thursday from 26 Nov 2026; PPT first Monday of each month. Sends 06:00 UTC. Issue 01 dates proposed: PPW Tue 24 Nov 2026, SPF Thu 26 Nov 2026, PPT Mon 7 Dec 2026 (after dry runs are approved).
