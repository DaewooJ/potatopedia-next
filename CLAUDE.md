# Potatopedia Next.js — Project Rules

## Cross-project sync
- This repo has a sibling backend repo at `~/Projects/potatopedia-backend` (separate git repo, separate Claude session/memory — nothing links them automatically).
- **Read `~/Projects/POTATOPEDIA_SYNC.md` at the start of a session** for current cross-project status (what each side just changed, open items either side should know about). **Update it** when you finish something the backend session would want to know about. It's local-machine-only (not committed to git) and intentionally terse — a status board, not documentation.

## Deployment & Build
- ALWAYS run `npm run build` before deploying to catch errors
- Deploy with `vercel --prod`
- ALWAYS backup before making significant changes

## Backend API
- Base URL: https://potatopedia-backend.onrender.com
- Endpoints: `/ask` (POST), `/ask/stream` (POST SSE), `/stats` (GET)
- API helper in `lib/api.js`

## Design System
- White background (#FFFFFF)
- Red accents: primary #C62828, secondary #E53935, legacy #E74C3C
- Font: Poppins (loaded via next/font/google in layout.jsx)
- All styling as inline React styles — no CSS modules, no Tailwind
- Mobile breakpoint: 768px

## Data Sources — BANNED
- NEVER use PotatoPro as a data source
- NEVER use PotatoNewsToday as a data source
- NEVER use indianpotato.com as a data source
- Approved sources: FAOSTAT, USDA, CIP, UN Comtrade, CPRI, Europatat, peer-reviewed journals

## Terminology
- Use "data points" not "chunks" in all user-facing text
- Backend may return `total_chunks` — always display as "data points"

## Migration Strategy
- Incremental migration from ~/potatopedia-frontend — one route at a time
- Do NOT touch ~/potatopedia-frontend
- Each migrated route should match or improve upon the original
- Test each route independently before moving to the next

## Project Structure
- Next.js App Router (no pages/ directory)
- JavaScript only — no TypeScript
- Server components by default; "use client" only when needed (state, effects, browser APIs)
- Shared layout with Navigation + Footer
- Dynamic routes: blog/[slug], knowledge/[slug], country/[slug], answers/[slug]

## Analytics + measurement
- **Plausible.io** is the runtime analytics provider (privacy-first, GDPR-compliant, cookie-free)
- **`PLAUSIBLE_API_KEY`** required in `.env.local` for analytics fetcher scripts (see `scripts/PLAUSIBLE_SETUP.md`)
- **`PLAUSIBLE_SITE_ID=potatopedia.com`** required alongside the API key
- Bing Webmaster Tools + GSC CSV exports go in `scripts/data/{bing,gsc}/` (gitignored)
- Run weekly unified analytics report via `python3 scripts/unified_analytics_report.py`
- Otterly.AI / AthenaHQ / Profound NOT subscribed — Bing + Plausible + manual quarterly cross-engine spot-checks suffice for first 90 days

## Schema + entity-graph rules
- Always import `POTATOPEDIA_PUBLISHER`, `POTATOPEDIA_WEBSITE`, `POTATOPEDIA_EDITORIAL` from `lib/authors.js` for Organization / WebSite / Person schema — never inline-duplicate
- Article schema must reference publisher via `@id` (= `https://www.potatopedia.com/#publisher`), never inline the Organization
- For new content pages, prefer `@graph` arrays over single-block JSON-LD when emitting more than one entity
- Wikidata `sameAs` references encouraged on Country/Place/Variety/Subject schemas where verified Q-id exists (see `VARIETY_WIKIDATA` in `lib/authors.js`, `COUNTRY_WIKIDATA` in country/[slug]/page.jsx)
- /about Organization schema is the canonical declaration — cross-link via `@id` reference, do not duplicate the full block elsewhere
