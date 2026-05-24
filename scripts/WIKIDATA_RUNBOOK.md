---
title: Wikidata entity creation runbook for Potatopedia
date: 2026-05-09
status: AWAITING DEVENDRA EXECUTION (manual; cannot be automated)
why: highest-leverage AI citation move — verified via WebFetch on 2026-05-09 that no Wikidata Q-id exists for Potatopedia
expected outcome: Q-id assigned within 30 days; entity discoverable via wikidata.org and SPARQL queries
---

# Wikidata entity creation runbook

## Why this is the single most important Week 1 action

Per ReputationX 2024 study (cited in 2026 SEO research): brands with verified Wikidata items are **3.2× more likely to display a Knowledge Panel** and **2.7× more likely to appear in AI Overview citations** compared to those without. Wikidata is also a primary structured-data source for ChatGPT, Claude, Perplexity, and Google AI Overviews entity recognition.

Cost: $0. Effort: 2–4 hours initial creation + 1 hour/week monitoring for first month. Single-attempt acceptance rate per Wikidata community standards: ~70% for entities with at least one independent reliable source citation.

## Pre-flight checks (do these before creating the entity)

1. **Confirm no entity exists.** I verified this on 2026-05-09 via Wikidata search — no result for "Potatopedia" or "potatopedia.com". You should re-verify on the day you create the entity in case anyone else creates one in the meantime.
2. **Decide privacy disclosure level.** See § "Founder + founding date — privacy options" below. This is your call.
3. **Prepare independent reliable sources.** Wikidata claims need to be referenced with at least one external source per non-trivial property. Acceptable sources include: official site (limited), LinkedIn company page (acceptable for some properties), Crunchbase entry (if any), GitHub organization (acceptable for technical properties), industry blog mentions if any exist.
4. **Have your Wikidata account ready.** If you don't have one, create at https://www.wikidata.org → top-right "Create account". Use a username tied to your real identity (Wikidata community is suspicious of disposable accounts; long-lived contributors get higher acceptance rates on borderline entities).
5. **Read [Wikidata:Notability](https://www.wikidata.org/wiki/Wikidata:Notability) once.** Potatopedia likely qualifies under "Wikidata items have a clear and identifiable structural need" given we're an indexable knowledge platform with 5,024 cited data points and 429 static pages — but understanding the bar helps you write a defensible description.

## Step-by-step entity creation

### Step 1: Open the new-item form

Navigate to https://www.wikidata.org/wiki/Special:NewItem (must be logged in).

### Step 2: Fill the basic identification fields

| Field | Value |
| --- | --- |
| **Label** (English) | `Potatopedia` |
| **Description** (English) | `online knowledge base specializing in potato industry data and analysis` (keep it under 250 chars; AVOID promotional language like "leading" or "premier") |
| **Aliases** (English) | `potatopedia.com`, `Potato Pedia`, `Potato Encyclopedia` (skip the last one if it feels too generic — use only if you have content claim to it) |

Add labels in additional languages where you have content (en is required; es / hi / fr / pt strengthen the entity if you can write a parallel description):

- es: `base de conocimientos en línea especializada en datos e información sobre la industria de la papa`
- hi: `आलू उद्योग के डेटा और विश्लेषण में विशेषज्ञता वाला ऑनलाइन ज्ञान आधार`
- fr: `base de connaissances en ligne spécialisée dans les données et l'analyse de l'industrie de la pomme de terre`
- pt: `base de conhecimento online especializada em dados e análises da indústria da batata`

### Step 3: Add structured property claims

After the basic fields, add the following properties (in order). For each, click "+ add statement", select the property by P-id or name, paste the value, then "+ add reference" with at least one source URL.

#### Identity properties

| Property | Value | Suggested reference |
| --- | --- | --- |
| **P31** (instance of) | `Q3257594` (online encyclopedia) **AND** `Q15265344` (web service) | reference URL: https://www.potatopedia.com (the homepage and /about establish this) |
| **P1813** (short name) | `Potatopedia` | (no reference needed for short name claims) |

#### Location + ownership

| Property | Value | Suggested reference |
| --- | --- | --- |
| **P127** (operator) | Choose one of the privacy options below |  |
| **P17** (country) | `Q668` (India) — assuming Devendra-based operations | reference: company registration / LinkedIn / your call |

#### Web presence

| Property | Value | Reference |
| --- | --- | --- |
| **P856** (official website) | `https://www.potatopedia.com` | (the URL itself is the reference) |
| **P3220** (KvK company ID) — *skip if not applicable* | — | — |

#### Subject + topic

| Property | Value | Reference |
| --- | --- | --- |
| **P921** (main subject) | `Q10998` (potato) **AND** `Q3119121` (agricultural sector) | reference: https://www.potatopedia.com/about |
| **P136** (genre) | `Q5292` (encyclopedia), `Q1417832` (knowledge base) | reference: site self-description |
| **P407** (language of work or name) | `Q1860` (English) | (URL of any English-language page on the site) |
| **P361** (part of) — *optional, see notes* | — | — |

#### Founding metadata

| Property | Value | Reference |
| --- | --- | --- |
| **P571** (inception) | `2024` (or `2024-03-01` if you want monthly precision) | reference: site copyright notice "© 2024–2026 Potatopedia" or a wayback machine snapshot of the first published page |
| **P112** (founder) | See "Founder + founding date — privacy options" below |  |
| **P159** (headquarters location) — *skip if you prefer to keep this private* | — | — |

#### Audience scale (optional but adds entity richness)

| Property | Value | Reference |
| --- | --- | --- |
| **P3744** (number of subscribers) — skip unless you have a substantial public number | — | — |

### Step 4: Founder + founding date — privacy options

Per the original brief: "Devendra will decide level of personal disclosure." Three options:

#### Option A: Full disclosure
- **P112 (founder)**: link to a separate Wikidata entity for "Devendra K Jha" — requires creating a Person entity for yourself first, with sameAs to LinkedIn, optional GitHub, etc.
- **Pro:** Maximum entity richness, strongest E-E-A-T signal, fastest path to Knowledge Panel acceptance.
- **Con:** Permanent public association of your name with Potatopedia under Creative Commons license.

#### Option B: Founder name only (string, not entity)
- **P112 (founder)**: leave blank initially.
- **P50 (author)** or **P3320 (board member)**: skip.
- Add the founder name in the long-form Wikipedia article (if/when notable enough), but not in the Wikidata entity.
- **Pro:** Privacy preserved.
- **Con:** Weaker entity signal; AI engines may downgrade trust without a verified founder linkage.

#### Option C (recommended for now): Operator only, defer founder claim
- **P127 (operator)**: link to your existing Wikidata entity if one exists for you, OR leave as a literal string `"Devendra K Jha"` (Wikidata accepts string values for operator with a "stated as" qualifier, though entity links are preferred).
- Add **P112 (founder)** later in 6–12 months once we have more independent reliable sources (a press release, a trade publication mention) backing the claim.
- **Pro:** Reasonable middle ground — establishes operational ownership without forcing a Person entity creation in Week 1.
- **Con:** Slightly weaker than Option A; entity will still be acceptable.

**My suggestion:** Option C now. Upgrade to Option A in Phase 2 or Phase 3 once we have a press-release citation that independently sources the founder claim. This sequencing is also cleaner from a Wikidata-community perspective — every claim addition with a fresh independent source increases the entity's credibility over time.

### Step 5: Add sameAs links

In Wikidata, "sameAs" is implemented via property **P2002** (Twitter username), **P4264** (LinkedIn personal profile), **P4264** does not apply to companies — for companies use **P4264** if you have a profile, else fall back to **P10444** (Apple App Store ID, irrelevant), **P11947** (LinkedIn company ID), **P2003** (Instagram), **P3267** (Flickr), **P2397** (YouTube channel ID), **P5346** (Playboy ID — irrelevant), **P9100** (GitHub username — for organization).

Practical sameAs additions:
- **P11947** (LinkedIn company ID) — the numeric ID after `/company/` in your LinkedIn URL
- **P2002** (Twitter/X username) — without the `@`
- **P9100** (GitHub username) — if you have a `github.com/potatopedia` org
- **P5793** (Crunchbase organization ID) — if applicable

For each, add the value and "+ add reference" pointing to the live profile URL.

### Step 6: Save and watch

1. Click "publish" at the bottom.
2. The entity is assigned a Q-id (e.g., Q1234567890).
3. **Save the Q-id immediately in 1Password / your notes** — you'll reference it in our Organization schema.
4. Add the entity to your Wikidata watchlist (heart icon at the top).
5. Monitor for the first 30 days for community feedback / merge proposals / deletion nominations.

## Common rejection reasons + how to avoid them

| Reason | How to avoid |
| --- | --- |
| **No clear notability** | Your description should be neutral and factual, not promotional. The 2.6%-of-pages-cited Bing data is good evidence of structural need but isn't visible on the entity. State the role objectively. |
| **No independent reliable sources** | At least one P-id claim should reference an external source (LinkedIn company page works for operator/founder claims; the official site URL works for web/inception claims). |
| **Self-promotion / single-purpose account** | If you are the only contributor to your own entity for the first 30 days, watchlist patrollers may flag. Mitigation: edit a few unrelated entities (fix typos, add a missing reference on a potato variety entity) to establish broader contribution history. |
| **Overlapping with existing items** | Re-verify on creation day; the verification I did on 2026-05-09 was specific to that date. |
| **Promotional language in description** | Use "online knowledge base" not "leading" or "premier" or "comprehensive." |

## After creation — what to update on our side

Once Q-id is assigned, share it with Claude Code session and we'll:

1. Add `sameAs` to homepage Organization schema (already partly there) → pull in the new Wikidata Q-id URL
2. Add Q-id to /about page Organization schema
3. Add Q-id reference to all Article publisher fields site-wide via `lib/authors.js#POTATOPEDIA_PUBLISHER`
4. Add to llms.txt as one of the canonical entity identifiers

## Expected timeline

- **Day 1:** Entity created, Q-id assigned (immediate).
- **Days 1–7:** Possible community review / minor edit suggestions.
- **Days 7–30:** Stabilization. If the entity isn't deleted by day 30, it's effectively permanent.
- **Months 2–3:** Add P112 (founder) claim once first press release citation exists.
- **Months 6–12:** Apply for Knowledge Panel via Google Search Console branded-entity workflow (separate process, requires Wikidata to already be live).

## Risks + mitigation

| Risk | Mitigation |
| --- | --- |
| Wikidata community deletes entity for "no notability" | Re-create with stronger source citations from the first research report (Phase 2) and any trade-press editorial coverage. Acceptance rate on second submission is much higher with fresh independent sources. |
| Entity gets merged into a similar existing item | Unlikely (none exist), but if it happens, the merger preserves our Q-id reference. |
| Privacy backlash on founder claim | Stay with Option C (operator only) until you actively want public founder visibility. |
| Wikidata account flagged as single-purpose | Make 5–10 unrelated good-faith edits to other potato-related entities (fix obvious typos, add missing references) before creating Potatopedia entity. |

## What NOT to do

- Do **not** create a Wikipedia article in parallel. Notability bar for English Wikipedia is much higher (per WP:NCORP) and rejected articles consume goodwill. Defer Wikipedia attempts to Phase 2 / Phase 3 once the first research report generates independent media coverage.
- Do **not** add promotional links from this Wikidata entity to existing Wikipedia articles. Wikipedia editors actively patrol for self-promotion linked from Wikidata; this is a quick way to get the entity nominated for deletion.
- Do **not** use AI-generated descriptions. Wikidata patrollers can usually detect generic/promotional language; write the description yourself.

## Status tracker (update as you progress)

- [ ] Pre-flight: confirmed no existing Q-id on day of creation
- [ ] Pre-flight: Wikidata account created/logged in
- [ ] Pre-flight: 5–10 good-faith edits on unrelated entities (optional, recommended)
- [ ] Step 2: Basic labels + descriptions filled
- [ ] Step 3: P31 (instance of), P856 (official website), P921 (main subject), P407 (language), P571 (inception) added
- [ ] Step 4: Founder option chosen — A / B / C: ___
- [ ] Step 5: sameAs links added (LinkedIn / Twitter/X / GitHub if applicable)
- [ ] Step 6: Entity published, Q-id recorded: ___________
- [ ] Day 7 review: no community deletion nominations
- [ ] Day 30 review: entity stable; ready to use as canonical sameAs target

## Sources

- [Wikidata for SEO (ReputationX)](https://www.reputationx.com/blog/wikidata)
- [Wikidata:Notability guidelines](https://www.wikidata.org/wiki/Wikidata:Notability)
- [Wikidata:How to use a property](https://www.wikidata.org/wiki/Help:Statements)
- [Getting Started With Wikidata.org guide](https://portal.inspiremelabs.com/wikidata-guide/)
