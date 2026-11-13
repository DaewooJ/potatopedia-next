# LinkedIn newsletters, Instagram and YouTube signup lines (13 Nov 2026)

Page: Potatopedia, LinkedIn company page id **112734286** (71 followers on 8 Nov 2026). Nothing below has been created or posted. Steps are from LinkedIn Help pages read on 13 Nov 2026 (links at the end); the Help pages are dated "2 years ago", "1 year ago" and "3 years ago", so the screens may differ slightly.

## 1. Can editions be published through the API? Finding: no documented way
- LinkedIn's Help describes creating a newsletter and publishing editions only through the Page admin view (Newsletters, then Write article). It mentions no API.
- The Community Management **Posts API** (Microsoft Learn, `POST https://api.linkedin.com/rest/posts`, author = organization URN, scope `w_organization_social`) creates feed posts. Its content types are article (a link card: source URL, title, description, thumbnail), image, video, document, poll, carousel, multi-image. None creates a newsletter edition or publishes a LinkedIn article. A post that links to our /issues page is possible (that is what the existing page autoposter does), but it is a post, not an edition, and does not notify newsletter subscribers.
- I found no newsletter or Pulse-article endpoint in the Marketing/Community Management docs. LinkedIn's old Share/UGC article APIs are also link-only. If LinkedIn adds one, the Developer Support Portal is where to confirm.
- **Conclusion: each edition is pasted by hand.** The pipeline (CONTRACT.md step 3) prepares the package and hands it to Devendra; the one LinkedIn page post per send day (link in the body) continues to go through the autoposter.

Edition hand-off package (per issue): title; 1920 x 1080 cover (real photo, credit and caption); body text; the link to the /issues page; SEO title and description; suggested schedule time; the one-line post text with link in the body.

## 2. Access first
- You must be a **super admin or content admin** of the Page.
- LinkedIn says that a Page that does not meet its **newsletter access criteria** will not show the "Create a newsletter" option; you can take simple actions to meet the criteria. I could not load the criteria page, so the exact threshold is unconfirmed (one third-party guide says 150 followers; not verified on LinkedIn's own pages). With 71 followers on 8 Nov the Page may not qualify yet: check in the admin view before planning around it.
- A Page or member can create **up to five** newsletters, with unlimited editions each, so three fits.

## 3. Create each newsletter (current Help steps)
1. Open the Page in the super or content admin view.
2. Click **Create** in the left menu.
3. Click **Create a newsletter**.
4. Enter the title, choose how often you publish, and add a description.
5. Upload the newsletter image (logo).
6. Click **Done**.
7. Publish the first edition: **Newsletters** in the left menu, **Write article**, pick the Page (upper-left name) and **newsletter**, upload cover, title, body, optional SEO settings and scheduling (clock icon), **Publish**.
- Publishing the first edition creates the newsletter page. Page followers are then invited by notification to subscribe; subscribers get a notification and an email for each new edition.
- After publishing, **Share** can generate a shareable subscribe link and a subscribe button for the website. Put each link in `lib/newsletters.js` (`linkedinNewsletter`) and on the matching /newsletters page.
- Create the three as the Page, not the personal profile, so they show under the Page. (If created on a Showcase page they are not linked to the parent page.)

## 4. Exact titles, descriptions, cadence
Title (use exactly; the "by Potatopedia" shows because the Page is the publisher):

| LinkedIn title | Cadence to select | Our schedule |
|---|---|---|
| Potato Processing Weekly | Weekly | Every Tuesday |
| Seed Potato & Field | Closest option to every two weeks (if only Weekly/Monthly are offered, choose Bi-weekly or the nearest, and say "every other Thursday" in the description) | Every other Thursday from 26 Nov 2026 |
| Potato Prices & Trade | Monthly | First Monday of the month |

Descriptions (plain English, American spelling, no claims we cannot show):
- **Potato Processing Weekly**: "Plant openings, capacity, technology and company news for fries, chips, flakes and starch. Every Tuesday, from Potatopedia, the neutral global potato reference. Clearly labelled sponsors. Never paid rankings. Never paid facts."
- **Seed Potato & Field**: "New varieties, seed certification, disease and pests, storage and field machinery for seed and ware growers. Every other Thursday, from Potatopedia, the neutral global potato reference. Clearly labelled sponsors. Never paid rankings. Never paid facts."
- **Potato Prices & Trade**: "Potato prices by market, export values and volumes by HS code, crop estimates, freight and currencies. The first Monday of each month, from Potatopedia, the neutral global potato reference. Clearly labelled sponsors. Never paid rankings. Never paid facts."

## 5. Image sizes
| Item | Size | Source |
|---|---|---|
| Newsletter logo (set at creation) | 300 x 300 px recommended; use the title accent (blue `#1E5A8A`, brown `#8B5A2B`, amber `#A86200`; never green) with the Potatopedia mark | LinkedIn Help "LinkedIn Newsletters best practices" |
| Cover for each edition | **1920 x 1080 px** recommended; each edition has its own cover | LinkedIn Help "Publish articles or newsletter editions as your LinkedIn Page" and best practices |
| Our own cover set (site/email) | 1200 x 630 and 1200 x 1200 | prompt section 7 |
Real photos only; LinkedIn advises against clip art or generic stock images; add credit and caption under the cover.

## 6. Posting rule on send days
On a send day the LinkedIn page carries ONE post, the issue post (link in the body). That day's pp-daily blog post still publishes on the site, skips its own LinkedIn post and appears in the issue as "From the Journal" (CONTRACT.md).

## 7. Instagram (@potatopedia_com) and YouTube (Potatopedia): signup lines (text only)
Current Instagram bio (set 8 Nov 2026, 143 characters, limit 150): "The world's potato knowledge base. Sourced data stories on production, trade, varieties, seed & processing · 204 countries · hi@potatopedia.com"

**Instagram bio, replacement (118 characters):**
```
Potato data stories, sourced. Free newsletters: Processing, Seed & Field, Prices & Trade → potatopedia.com/newsletters
```
Instagram website field: `https://www.potatopedia.com/newsletters?utm_source=instagram&utm_medium=bio` (UTM tags are read in GA4; the bio text itself is not clickable, so the website field matters most; the open item from 8 Nov is that the website link must be set via the phone app).

**YouTube channel description, add this paragraph near the top (150 characters):**
```
Free newsletters for the potato industry: Potato Processing Weekly, Seed Potato & Field, Potato Prices & Trade. Sign up at potatopedia.com/newsletters
```
YouTube channel links: add "Newsletters" → `https://www.potatopedia.com/newsletters?utm_source=youtube&utm_medium=channel` (clickable links need the pending phone verification noted in memory). Video descriptions: one line "Free newsletters: potatopedia.com/newsletters".

## Sources read (LinkedIn Help, 13 Nov 2026)
- Create a LinkedIn Page newsletter: https://www.linkedin.com/help/linkedin/answer/a596833
- Publish articles or newsletter editions as your LinkedIn Page: https://www.linkedin.com/help/linkedin/answer/a569569
- LinkedIn Newsletters best practices: https://www.linkedin.com/help/linkedin/answer/a517940
- LinkedIn Newsletters (overview): https://www.linkedin.com/help/linkedin/answer/a522525
- Posts API (Community Management): https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
