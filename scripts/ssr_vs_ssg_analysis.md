# SSR vs SSG for Country Pages — Technical Evaluation

**Date:** 2026-04-27
**TL;DR:** **The question is moot. Both knowledge articles AND country pages are already fully static (SSG)** in our setup. There is no SSR-vs-SSG decision to make. The real decision is *what content to hardcode in the JSX* — not how Next.js renders it.

---

## 1 · What we're actually running

### Code-level evidence

```
$ grep -nE "force-dynamic|force-static|revalidate|fetch\(|cookies\(|headers\(|searchParams" \
    app/knowledge/[slug]/page.jsx app/country/[slug]/page.jsx
(empty — no dynamic directives in either file)
```

Neither page uses any runtime API:
- No `cookies()`, `headers()`, `searchParams`
- No `fetch()` at render time
- No `export const dynamic = "force-dynamic"`
- No `revalidate` directive
- Both export `generateStaticParams()`

`next.config.mjs` contains only redirects — no SSR / output / experimental flags.

### Build output

```
├ ● /country/[slug]
│ ├ /country/china
│ ├ /country/india
│ ├ /country/ukraine

├ ● /knowledge/[slug]
│ ├ /knowledge/top-potato-producing-countries
│ ├ /knowledge/potato-nutrition-facts
```

`●` = "SSG — prerendered as static HTML (uses generateStaticParams)" per Next.js's own build legend. Both routes are pre-rendered at build time.

### Vercel runtime evidence

```
$ curl -sI https://www.potatopedia.com/knowledge/mcdonalds-potato-varieties
x-vercel-cache: HIT
age: 922
x-matched-path: /knowledge/mcdonalds-potato-varieties

$ curl -sI https://www.potatopedia.com/country/india
x-vercel-cache: HIT
age: 498
x-matched-path: /country/india
```

`x-vercel-cache: HIT` + `age` headers = **Vercel is serving pre-built HTML from the CDN edge cache**. No serverless function executes on these requests. Zero compute per request. Zero cold-start risk.

### TTFB timing

Both pages: **~55–60 ms TTFB** from Mumbai edge. Identical performance because both are the same kind of asset (prebuilt static HTML on Vercel's CDN).

---

## 2 · Why this is the case

Next.js App Router rule: a dynamic route (`[slug]`) with `generateStaticParams()` and **no runtime data fetching** is automatically pre-rendered at build time. You don't opt into SSG — you opt *out* of it by introducing dynamic primitives. We've done neither.

For our setup specifically:
- **Vercel** detects the `●` SSG output and uploads the HTML to its edge CDN. Subsequent requests are served from edge with no Lambda invocation.
- **`x-vercel-cache: HIT`** confirms this on every request to either route.
- **`generateMetadata()`** is a build-time call too when its inputs are static.

---

## 3 · Answers to the listed questions

| Q | Answer |
|---|---|
| Q1: For hardcoded content, does SSR vs SSG matter? | **No.** Identical output, identical Vercel behavior. |
| Q2: What does Vercel do with each? | Static gets edge-cached forever; SSR runs a serverless function. We have static — pure CDN. |
| Q3: Does Google care which? | **No.** Google indexes the HTML it receives. TTFB matters for crawl-budget allocation; we're at ~60 ms — already optimal. |
| Q4: Do AI crawlers care? | **No.** They request HTML; they get HTML. Same regardless of generation strategy. |
| Q5: Workflow difference? | None. Both require `npm run build` + `vercel --prod` to update. |
| Q6: Are knowledge articles already SSG? | **Yes.** Build output shows `●` ; Vercel returns `x-vercel-cache: HIT`. |

---

## 4 · The real bottleneck on country pages (recap)

The "SSR vs SSG" framing misdiagnoses the actual problem. The country pages already render statically — but the *static HTML they render* is mostly empty: ~470 words of nav + stats + a `<CountryAI>` client component that streams content post-mount. Knowledge articles render statically with **2,500+ hardcoded words of content** in the same kind of static HTML.

The fix is not a rendering-mode change. The fix is: **delete the `<CountryAI>` overview/topic/Q&A streaming, replace with hardcoded JSX matching the knowledge-article shape, keep the AI Q&A widget as a tail-end enhancement.** Per the prior `country_page_analysis.md` recommendation.

---

## 5 · What to change in the current setup

**Nothing in `next.config.mjs` or page directives.** The infrastructure side is correct.

The only action is the content rebuild on country pages — already laid out in `country_page_analysis.md` as Wave 1 (USA, India, China, Belgium, Netherlands).

---

## Recommendation

1. **Knowledge articles are SSG.** No change needed.
2. **Country pages are also SSG already.** No change needed at the rendering layer.
3. **For the country-page rebuild:** match the knowledge-article *content pattern* (hardcoded JSX, 2,000–2,500 words, FAQ schema, `data-summary` block, `<CountryAI>` retained at the bottom). Next.js will continue to pre-render them at build time. Vercel will continue to serve from edge CDN. Performance, SEO crawlability, and AI-crawler visibility all improve solely because the *HTML payload* now contains real content.
4. **Don't add `force-static`, `revalidate`, or other directives.** They're unnecessary — implicit static generation is already happening.
