# Schema Validation Audit Report
Date: 2026-04-24

## Executive Summary

- **Pages tested:** 5 (plus sanity-check fetch of `/about`)
- **JSON-LD blocks found:** 7 across 5 primary pages
- **Schema types detected:** Organization, WebSite, FAQPage (x3), Article (x3), BreadcrumbList (x1 — embedded in country, x1 standalone in knowledge)
- **Critical issues:** 2
- **High severity:** 5
- **Medium:** 6
- **Low:** 3

### Top 3 issues to fix first

1. **`/answers/*` FAQPage contains a placeholder answer that links back to its own URL.** The single `acceptedAnswer.text` reads "See the full AI-generated, data-backed answer at https://www.potatopedia.com/answers/which-country-eats-most-potatoes". This is a circular reference with no substantive content — Google's FAQ Rich Results policy explicitly disallows "promotional or advertising-style content" and generic/non-answering text, and can trigger a manual action or silent de-indexing of FAQ snippets site-wide. Compounded by the visible body rendering "Answer could not be loaded. The backend may be starting up — try refreshing in a moment" (see §Per-URL Findings #5), meaning neither the schema *nor* the DOM currently exposes a real answer.
2. **Homepage Dataset schema is missing entirely.** The brief states "confirmed in past audits to exist with FAOSTAT/USDA keywords" — a grep for `"@type":"Dataset"` or `"@type": "Dataset"` on the live homepage HTML returns **0 matches**. Only Organization + WebSite (in one `@graph`) and FAQPage are present. This is a regression — the site is explicitly stats-heavy (FAOSTAT/USDA/UN Comtrade) and Dataset Search is a natural discovery surface for AI citations.
3. **Country-page Article schema is missing two Google-required fields: `datePublished` and `author`.** `/country/india` ships an Article with only `headline`, `description`, `about`, `dateModified`, `publisher`, and an inline `breadcrumb`. Missing `datePublished` and `author` makes the Article ineligible for Rich Results; the page is also the only one that embeds `BreadcrumbList` *inside* the Article rather than emitting it as a sibling in an `@graph`, diverging from the knowledge-article pattern.

---

## Per-URL Findings

### 1. Homepage (https://www.potatopedia.com)

**Schemas detected:** `Organization`, `WebSite` (in one `@graph`), `FAQPage` (separate block). **No Dataset schema.**
**Status:** PASS WITH WARNINGS (but with one CRITICAL regression flagged below)

**Issues:**
- **[CRITICAL] No Dataset schema present.** Past audits / prior session memory indicate a Dataset schema existed with FAOSTAT/USDA keywords. Live HTML has zero `Dataset` blocks. Kills Google Dataset Search eligibility.
- **[HIGH] No `<link rel="canonical">` on the homepage.** Every other audited page has one; the homepage does not. For a root domain this usually defaults fine, but omission is inconsistent and may allow tracking-param duplicates to compete.
- **[LOW] `og:image:width` and `og:image:height` meta tags are not emitted.** og-image.png resolves fine, but declaring 1200x630 explicitly helps LinkedIn/Twitter card validators.

**What's working well:**
- `@graph` structure correctly cross-references `Organization` via `@id` from `WebSite.publisher` — textbook.
- `SearchAction` present with proper `target` template + `query-input` → sitelinks searchbox eligible.
- `Organization.sameAs` includes `https://www.linkedin.com/company/potatopedia` — good.
- `Organization` has `logo`, `description`, `name`, `url` — all recommended fields covered.
- FAQPage: 6 questions in schema, **all 6 appear verbatim in visible body text** — no mismatch (verified programmatically).
- Headline-equivalent H1 ("Every Potato Question, …") present on page.

---

### 2. Country Page (https://www.potatopedia.com/country/india)

**Schemas detected:** `Article` with an inline embedded `BreadcrumbList` under `breadcrumb`.
**Status:** FAIL (Article schema does not meet Google's required fields for Article rich results)

**Issues:**
- **[HIGH] `datePublished` missing** — Google lists this as required for Article. Only `dateModified` is present.
- **[HIGH] `author` missing entirely** — Google lists `author` (with `@type` Person/Organization and `name`) as required. No `author` field at all.
- **[MEDIUM] `mainEntityOfPage` missing** — recommended; helps Google map the schema to this URL unambiguously.
- **[MEDIUM] `image` missing** — recommended by Google; without a valid image reference, the Article is ineligible for most Rich Results carousels.
- **[MEDIUM] Inconsistent structure.** Uses a top-level Article with inline `breadcrumb`, whereas `/knowledge/…` uses a clean `@graph` with sibling `Article` + `BreadcrumbList`. Not a spec violation (both are valid), but the inconsistency makes template drift likely.
- **[LOW] Article has no `author` attribution object at all** — per project rule, should be `{ "@type": "Organization", "name": "Potatopedia" }`. (Same root cause as the HIGH flag above; noted separately because the project convention is explicit.)
- **[NOTE]** `about: { @type: "Country", name: "India" }` — valid.

**What's working well:**
- Headline "Potato Industry in India" (24 chars) well within 110-char limit.
- H1 text "India" + visible "Potato Industry in India" title match the schema headline.
- BreadcrumbList has correct `position` sequence 1→2→3 with `@id` + `name` on each.
- `publisher` is properly typed Organization with logo.
- **Note:** visible body currently shows "Overview could not be loaded. The backend may be starting up — try refreshing in a moment." This is a runtime/hydration issue, not a schema issue, but worth flagging since it degrades the experience a Bing/Claude crawler would see.

---

### 3. Knowledge Article (https://www.potatopedia.com/knowledge/top-potato-producing-countries)

**Schemas detected:** `Article` + `BreadcrumbList` (in one `@graph`), plus separate `FAQPage`. This is the "triple JSON-LD" pattern the premium template spec called for — **confirmed present**.
**Status:** PASS WITH WARNINGS

**Issues:**
- **[MEDIUM] Article `image` missing** — recommended; likely why any Google rich-card treatment is muted.
- **[LOW] Article `about` uses a weak `{ @type: "Thing", name: "Top Potato Producing Countries 2025" }`.** Could strengthen to a more specific type (e.g., reference Crop/AgriculturalProduct or an entity) to help LLMs connect the article to a real thing.
- **[LOW] No duplicate Article/Organization — canonical is clear.** (Positive finding, noted here for completeness.)

**What's working well:**
- All three schemas present: `Article` ✅, `BreadcrumbList` ✅, `FAQPage` ✅.
- Article `headline` = 35 chars, `datePublished` = 2026-03-31, `dateModified` = 2026-04-17, `author` = Organization/Potatopedia, `publisher` = Organization/Potatopedia with logo, `mainEntityOfPage` = canonical URL, `wordCount` = 2500 — **every Google-required + recommended Article field is populated except `image`**.
- BreadcrumbList: Home → Knowledge Hub → Production Data, positions 1/2/3, `@id`+`name` on each item.
- FAQPage: 6 questions, **all 6 visible in body** (verified by text search on stripped HTML) — no mismatch.
- H1 "Top Potato Producing Countries 2025" matches Article `headline` exactly.
- This page is cited correctly in the brief as the one with 22 views + 0% bounce; the underlying schema stack supporting that is clean.

---

### 4. Blog Post (https://www.potatopedia.com/blog/us-potato-production-by-state)

**Schemas detected:** `Article` only.
**Status:** PASS WITH WARNINGS

**Issues:**
- **[HIGH] No `BreadcrumbList` schema on the blog post.** The page *has* visible "← Back to Blog" navigation, but no structured breadcrumb is exposed. Blog/Knowledge parity is broken — knowledge articles ship BreadcrumbList, blog posts do not.
- **[MEDIUM] Article `image` missing.**
- **[MEDIUM] Article `wordCount` missing** (present on knowledge article; missing here).

**What's working well:**
- Headline "US Potato Production by State: Idaho, Washington, and the $4.6B Industry" = 72 chars (well under 110).
- `datePublished` (2026-03-06) + `dateModified` (2026-04-07) both present.
- `author` = Organization/Potatopedia ✅ (per project convention).
- `publisher` = Organization/Potatopedia with logo ✅.
- `mainEntityOfPage` set to canonical URL ✅.
- H1 matches headline exactly.

---

### 5. Answer Page (https://www.potatopedia.com/answers/which-country-eats-most-potatoes)

**Schemas detected:** `FAQPage` only (a *single* Question/Answer pair).
**Status:** FAIL — policy/UX risk

**Issues:**
- **[CRITICAL] Placeholder answer text pointing back at the same URL.** The one `acceptedAnswer.text` is: *"See the full AI-generated, data-backed answer at https://www.potatopedia.com/answers/which-country-eats-most-potatoes"*. This is circular, contains no actual answer content, and violates Google's FAQ guidelines ("provide the complete answer... not a link to read more"). At best it produces no rich result; at worst it flags the site's FAQ markup as manipulative and suppresses FAQ snippets broadly. Compounded by the DOM currently rendering "Answer could not be loaded. The backend may be starting up — try refreshing in a moment" (backend cold start — see below), so no real answer is available to either humans or crawlers at audit time.
- **[HIGH] Wrong schema type: should be `QAPage` not `FAQPage`.** `FAQPage` is defined as a page containing a *list* of FAQs. A single-question answer page is canonically `QAPage` with a top-level `mainEntity: Question` whose `acceptedAnswer` is the real AI-generated answer. `QAPage` also natively supports `answerCount` and `upvoteCount` — the two fields the brief explicitly asked about.
- **[HIGH] No `answerCount` / `upvoteCount`** (even as 0 placeholders) — valuable AI-citation quality signals, impossible to add cleanly until the schema becomes `QAPage`.
- **[HIGH] No `Article` or `BreadcrumbList` schema** — the page has "← All Questions" visible navigation but nothing structured.
- **[MEDIUM] `author` and `dateModified` not asserted anywhere on the page** — for AI-generated answers these matter for trust signals.

**What's working well:**
- H1 matches the Question `name` exactly ("Which country consumes the most potatoes per capita?").
- `<link rel="canonical">` present and matches URL.
- og:title and og:description correctly set, mentioning FAOSTAT/USDA/CIP data sources.

---

## Cross-Cutting Findings

### Image Reference Health

Verified via HEAD requests (24 Apr 2026):

| Image | Status | Content-Type | Content-Length | Notes |
|---|---|---|---|---|
| `og-image.png` | 200 OK | image/png | 25,730 bytes (~25KB) | Matches brief's "~25KB, shipped Apr 17" expectation. `x-vercel-cache: HIT` |
| `logo.png` | 200 OK | image/png | (not checked) | Referenced by Organization.logo on homepage + publisher.logo on all 3 Articles |
| `favicon.ico` | 200 OK | — | — | — |
| `apple-touch-icon.png` | 200 OK | — | — | — |

All 5 pages reference `https://www.potatopedia.com/og-image.png` for both `og:image` and `twitter:image`. No 404s, no redirects to non-images. **`og:image:width` / `og:image:height` meta tags are not emitted on any of the 5 pages** — minor nit.

**No Article schema on any page carries an `image` field** — this is the one systematic image gap and applies to country, knowledge, and blog Articles.

### Schema Duplications

- **No duplicates detected.** Each page has at most one Article, one BreadcrumbList, one Organization, one WebSite, one FAQPage. Canonical source for each type is unambiguous.

### Visible Content vs Schema Mismatches

| Page | Schema assertion | Visible in DOM? | Verdict |
|---|---|---|---|
| Home | FAQPage: 6 Qs | All 6 found in stripped body text | ✅ match |
| Country | Article headline "Potato Industry in India" | H1/title both present | ✅ match |
| Country | Breadcrumb Home→Countries→India | Nav shows "Home / Knowledge / Countries / Blog / About" but no visible breadcrumb trail | ⚠️ schema asserts breadcrumb, DOM has only top nav |
| Knowledge | Article headline "Top Potato Producing Countries 2025" | H1 matches exactly | ✅ match |
| Knowledge | FAQPage: 6 Qs | All 6 found in visible body | ✅ match |
| Blog | Article headline | H1 matches exactly | ✅ match |
| Answers | FAQPage: 1 Q with placeholder answer | H1 shows question; body shows "Answer could not be loaded" | ❌ schema asserts an answer (placeholder), DOM has no answer |

The **answers page** is the only true content↔schema mismatch. The **country page** has a minor mismatch where the schema asserts a breadcrumb that has no visible DOM counterpart.

### Dataset Search Eligibility

**Status: INELIGIBLE — Dataset schema is not present on the homepage (or any other audited page).**

If/when restoring Dataset schema on the homepage, to qualify for Google Dataset Search the following fields are required/strongly-recommended:

| Field | Status | Google requirement |
|---|---|---|
| `name` | n/a (missing) | Required |
| `description` | n/a (missing) | Required |
| `creator` (Organization) | n/a (missing) | Strongly recommended |
| `distribution` (with `contentUrl` + `encodingFormat`) | n/a (missing) | **Required for Dataset Search eligibility** |
| `license` | n/a (missing) | Strongly recommended |
| `spatialCoverage` | n/a (missing) | Strongly recommended |
| `temporalCoverage` | n/a (missing) | Strongly recommended |
| `variableMeasured` | n/a (missing) | Recommended |
| `keywords` | n/a (missing) | Recommended |

Without `distribution` in particular, a Dataset block will validate but will not be indexed by Dataset Search.

### AI-Citation Readiness

| Check | Finding |
|---|---|
| `AboutPage` schema on `/about` | **Missing entirely.** `/about` returned 0 JSON-LD blocks. Helpful for LLMs disambiguating "what is Potatopedia." |
| `Question`/`answerCount`/`upvoteCount` on `/answers/*` | Missing. Page uses FAQPage not QAPage, so these fields are not applicable in the current schema — switching to QAPage would allow them. |
| `Speakable` schema | Not present anywhere. Not critical, but a cheap win for voice assistants summarizing short answers (notably the /answers/* routes). |
| `sameAs` with LinkedIn | **Present on homepage Organization** → `https://www.linkedin.com/company/potatopedia`. |
| Author attribution rule (Organization, not Person) | **Compliant** on knowledge + blog (both use Organization/Potatopedia). **Country page has no author at all** — technically compliant with "no individual names" rule but fails Google's required field. |

---

## Prioritized Recommendations

### Critical (fix immediately)

1. **Replace the placeholder FAQPage on `/answers/*`** with a real `QAPage` whose `Question.acceptedAnswer.text` contains the actual AI-generated answer rendered by the backend (or omit the JSON-LD entirely when the backend fails to return content — do NOT ship schema that asserts answer content the DOM does not have). Add `answerCount` and `upvoteCount` (even as 0). This also fixes the circular self-link that currently appears in the schema.
2. **Decide: restore or retire homepage Dataset schema.** If retiring, remove any build-step or copy that still references it. If restoring, ship with `distribution` (contentUrl + encodingFormat), `creator`, `license`, `spatialCoverage: "Global"`, `temporalCoverage` (e.g., "2010-01-01/2023-12-31"), and relevant `keywords` — otherwise Dataset Search won't index it.

### High (fix this week)

1. **Country page Article schema:** add `datePublished`, add `author: { @type: "Organization", name: "Potatopedia", url: "https://www.potatopedia.com" }`, add `mainEntityOfPage`, and consider refactoring to match the knowledge-article `@graph` pattern with sibling Article + BreadcrumbList.
2. **Add `BreadcrumbList` schema to blog posts** to match knowledge-page parity (Home → Blog → Post Title).
3. **Add `AboutPage` schema at `/about`** referencing the `Organization` `@id` — trivial addition, meaningful signal for LLM entity resolution.
4. **Add `<link rel="canonical">` to the homepage** for consistency with the rest of the site.
5. **Convert `/answers/*` schema type from `FAQPage` to `QAPage`** (covered in Critical #1 above, but noted here because the type change is itself an orthogonal fix).

### Medium (fix this month)

1. Add `image` field to every Article schema (country, knowledge, blog) — can reuse `/og-image.png` as a baseline.
2. Add `wordCount` to blog Article (knowledge article has it).
3. Emit `og:image:width` (1200) and `og:image:height` (630) meta tags for social-card validator cleanliness.
4. Strengthen knowledge-article `about` from generic `Thing` to a more specific schema.org type or reference a real entity.
5. Root-cause the backend cold-start "Answer could not be loaded" / "Overview could not be loaded" render on `/answers/*` and `/country/*`. Not a schema issue, but when a Bing/Claude crawler hits a cold dyno they see an error string where the content should be — this directly undermines the AI citation use case the brief is built around.
6. Ensure the visible `/country/india` page actually renders a breadcrumb trail (Home / Countries / India) if the schema asserts one.

### Low / Nice-to-have

1. Consider `Speakable` schema on `/answers/*` for voice-assistant pickup of concise one-paragraph answers.
2. Add explicit `Organization.contactPoint` (currently only `description`, `logo`, `sameAs`, `url`).
3. Expand `Organization.sameAs` beyond LinkedIn (X/Twitter, GitHub if applicable) as those profiles come online.

---

## Schema Stats Table

| Page | Schemas | Pass | Warn | Fail |
|------|---------|------|------|------|
| Homepage | 3 (Org, WebSite, FAQPage) | 2 | 1 (missing Dataset regression) | 0 |
| Country (India) | 2 (Article, embedded BreadcrumbList) | 1 (BreadcrumbList) | 0 | 1 (Article — missing required datePublished + author) |
| Knowledge (top-producers) | 3 (Article, BreadcrumbList, FAQPage) | 3 | 0 (Article image missing — minor) | 0 |
| Blog (us-by-state) | 1 (Article) | 0 | 1 (no BreadcrumbList, no image) | 0 |
| Answers (eats-most) | 1 (FAQPage) | 0 | 0 | 1 (placeholder circular answer — policy risk) |
| **Totals** | **10** | **6** | **2** | **2** |

---

## Methodology Notes

- All HTML fetched 2026-04-24 with User-Agent `Mozilla/5.0 SchemaAudit/1.0` via `curl -sL`.
- JSON-LD extracted via regex on `<script type="application/ld+json">…</script>` blocks; each block parsed with Python `json.loads` (all parsed cleanly — no syntax errors, trailing commas, or unescaped quotes detected anywhere).
- Image HEAD checks via `curl -sI` against canonical URLs on www.potatopedia.com.
- Visible-body cross-reference performed by stripping `<script>`/`<style>`/HTML tags and lowercasing, then substring-matching schema-asserted Q&A names.
- `/about` fetched solely to verify absence of AboutPage schema (zero JSON-LD blocks confirmed).
- No source files modified. No builds, deploys, or index submissions performed.
