#!/usr/bin/env python3
"""
SEO rank tracker for Potatopedia.
Queries Google via SerpAPI for target keywords, checks our ranking,
and extracts PAA / related searches for content ideas.
"""

import json
import os
import sys
import time
from datetime import datetime

from serpapi import GoogleSearch

KEYWORDS_FILE = "scripts/target_keywords.txt"
REPORT_FILE = "scripts/seo_report.json"
OUR_DOMAIN = "potatopedia.com"
NUM_RESULTS = 100  # check top 100
DELAY_SECONDS = 2


def load_keywords(path):
    with open(path) as f:
        return [line.strip() for line in f if line.strip() and not line.lstrip().startswith("#")]


def search_keyword(keyword, api_key):
    """Query Google for a keyword and return parsed results."""
    params = {
        "q": keyword,
        "num": NUM_RESULTS,
        "engine": "google",
        "api_key": api_key,
    }

    search = GoogleSearch(params)
    data = search.get_dict()

    # Check for API errors
    if "error" in data:
        return {"error": data["error"]}

    # Find our position in organic results
    our_position = None
    our_url = None
    organic = data.get("organic_results", [])

    for r in organic:
        link = r.get("link", "")
        if OUR_DOMAIN in link:
            our_position = r.get("position")
            our_url = link
            break

    # Top 3 competitors (excluding us)
    competitors = []
    for r in organic[:10]:
        link = r.get("link", "")
        if OUR_DOMAIN not in link and len(competitors) < 3:
            competitors.append({
                "position": r.get("position"),
                "title": r.get("title", ""),
                "domain": r.get("displayed_link", ""),
                "url": link,
            })

    # People Also Ask
    paa = []
    for item in data.get("related_questions", []):
        paa.append(item.get("question", ""))

    # Related Searches
    related = []
    for item in data.get("related_searches", []):
        related.append(item.get("query", ""))

    return {
        "our_position": our_position,
        "our_url": our_url,
        "total_results": len(organic),
        "competitors": competitors,
        "people_also_ask": paa,
        "related_searches": related,
    }


def main():
    api_key = os.environ.get("SERPAPI_KEY")
    if not api_key:
        print("ERROR: Set the SERPAPI_KEY environment variable.")
        print("  export SERPAPI_KEY=your_key_here")
        print("  Get a free key at https://serpapi.com/")
        sys.exit(1)

    keywords = load_keywords(KEYWORDS_FILE)
    if not keywords:
        print(f"ERROR: No keywords found in {KEYWORDS_FILE}")
        sys.exit(1)

    print(f"\n{'='*90}")
    print(f"  POTATOPEDIA SEO RANK TRACKER")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  Tracking {len(keywords)} keywords for {OUR_DOMAIN}")
    print(f"{'='*90}\n")

    results = []
    all_paa = []
    all_related = []
    hit_limit = False

    for i, kw in enumerate(keywords):
        print(f"  [{i+1:2d}/{len(keywords)}] Searching: {kw}", end="", flush=True)

        data = search_keyword(kw, api_key)

        if "error" in data:
            err = data["error"]
            print(f"  \u274C {err}")
            results.append({
                "keyword": kw,
                "position": None,
                "url": None,
                "competitors": [],
                "people_also_ask": [],
                "related_searches": [],
                "error": err,
            })
            if "limit" in err.lower() or "quota" in err.lower() or "rate" in err.lower():
                hit_limit = True
                print("\n  Hit API rate/quota limit. Stopping early.")
                break
            continue

        pos = data["our_position"]
        if pos:
            icon = "\U0001F7E2" if pos <= 10 else "\U0001F7E1" if pos <= 30 else "\U0001F7E0"
            print(f"  {icon} #{pos} — {data['our_url']}")
        else:
            print(f"  \u26AA not in top {data['total_results']}")

        results.append({
            "keyword": kw,
            "position": pos,
            "url": data["our_url"],
            "competitors": data["competitors"],
            "people_also_ask": data["people_also_ask"],
            "related_searches": data["related_searches"],
            "error": None,
        })

        all_paa.extend(data["people_also_ask"])
        all_related.extend(data["related_searches"])

        if i < len(keywords) - 1:
            time.sleep(DELAY_SECONDS)

    # ── Summary table ──────────────────────────────────────────────────

    print(f"\n{'='*90}")
    print(f"  RANKING SUMMARY")
    print(f"{'='*90}")
    print(f"  {'Keyword':<45s}  {'Position':>10s}  {'URL':<30s}")
    print(f"  {'-'*45}  {'-'*10}  {'-'*30}")

    ranked = 0
    top10 = 0
    top30 = 0

    for r in results:
        kw = r["keyword"][:44]
        if r["error"]:
            pos_str = "ERROR"
            url_str = ""
        elif r["position"]:
            pos_str = f"#{r['position']}"
            url_str = r["url"].replace("https://", "").replace("http://", "")[:29] if r["url"] else ""
            ranked += 1
            if r["position"] <= 10:
                top10 += 1
            if r["position"] <= 30:
                top30 += 1
        else:
            pos_str = "Not found"
            url_str = ""
        print(f"  {kw:<45s}  {pos_str:>10s}  {url_str:<30s}")

    total_valid = len([r for r in results if not r.get("error")])
    print(f"\n  Ranked in top 100:  {ranked}/{total_valid}")
    print(f"  Ranked in top 10:   {top10}/{total_valid}")
    print(f"  Ranked in top 30:   {top30}/{total_valid}")

    # ── Competitor analysis ────────────────────────────────────────────

    domain_counts = {}
    for r in results:
        for c in r.get("competitors", []):
            d = c.get("domain", "")
            domain_counts[d] = domain_counts.get(d, 0) + 1

    if domain_counts:
        print(f"\n  Top competing domains:")
        for d, count in sorted(domain_counts.items(), key=lambda x: -x[1])[:10]:
            print(f"    {d:<40s}  appears {count}x")

    # ── Content ideas (PAA) ────────────────────────────────────────────

    unique_paa = list(dict.fromkeys(all_paa))  # dedupe, preserve order
    if unique_paa:
        print(f"\n  People Also Ask ({len(unique_paa)} unique questions):")
        for q in unique_paa[:15]:
            print(f"    \u2022 {q}")
        if len(unique_paa) > 15:
            print(f"    ... and {len(unique_paa) - 15} more (see JSON report)")

    # ── Related searches ───────────────────────────────────────────────

    unique_related = list(dict.fromkeys(all_related))
    if unique_related:
        print(f"\n  Related Searches ({len(unique_related)} unique):")
        for q in unique_related[:15]:
            print(f"    \u2022 {q}")
        if len(unique_related) > 15:
            print(f"    ... and {len(unique_related) - 15} more (see JSON report)")

    print(f"\n{'='*90}\n")

    # ── Save JSON report ───────────────────────────────────────────────

    report = {
        "timestamp": datetime.now().isoformat(),
        "domain": OUR_DOMAIN,
        "keywords_tracked": len(keywords),
        "keywords_searched": len(results),
        "hit_api_limit": hit_limit,
        "summary": {
            "ranked_top_100": ranked,
            "ranked_top_30": top30,
            "ranked_top_10": top10,
            "total_valid": total_valid,
        },
        "results": results,
        "people_also_ask": unique_paa,
        "related_searches": unique_related,
        "competing_domains": dict(sorted(domain_counts.items(), key=lambda x: -x[1])[:20]),
    }

    with open(REPORT_FILE, "w") as f:
        json.dump(report, f, indent=2)
    print(f"Full report saved to {REPORT_FILE}")


if __name__ == "__main__":
    main()
