#!/usr/bin/env python3
"""
Crawlability audit for Potatopedia.
Reads sitemap.xml, visits every URL with headless Chromium,
checks for SEO essentials, and reports issues.
"""

import asyncio
import json
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import urlparse

import httpx
from playwright.async_api import async_playwright

SITEMAP_URL = "https://potatopedia.com/sitemap.xml"
WAIT_MS = 3000  # wait for JS to render
TIMEOUT_MS = 30000  # max per page
CONCURRENCY = 5  # parallel tabs

# ── Fetch & parse sitemap ──────────────────────────────────────────────

async def fetch_sitemap(url):
    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        r = await client.get(url)
        r.raise_for_status()
    root = ET.fromstring(r.text)
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [loc.text for loc in root.findall(".//s:loc", ns)]
    return urls


# ── Audit a single page ───────────────────────────────────────────────

async def audit_page(page, url, idx, total):
    result = {
        "url": url,
        "status": None,
        "title": None,
        "meta_description": None,
        "h1": None,
        "word_count": 0,
        "canonical": None,
        "issues": [],
        "error": None,
    }

    try:
        resp = await page.goto(url, wait_until="domcontentloaded", timeout=TIMEOUT_MS)
        result["status"] = resp.status if resp else None

        # Wait for JS rendering
        await page.wait_for_timeout(WAIT_MS)

        # Title
        result["title"] = await page.title()

        # Meta description
        desc = await page.evaluate("""
            () => {
                const el = document.querySelector('meta[name="description"]');
                return el ? el.getAttribute('content') : null;
            }
        """)
        result["meta_description"] = desc

        # H1
        h1 = await page.evaluate("""
            () => {
                const el = document.querySelector('h1');
                return el ? el.innerText.trim() : null;
            }
        """)
        result["h1"] = h1

        # Canonical
        canonical = await page.evaluate("""
            () => {
                const el = document.querySelector('link[rel="canonical"]');
                return el ? el.getAttribute('href') : null;
            }
        """)
        result["canonical"] = canonical

        # Visible text word count
        word_count = await page.evaluate("""
            () => {
                const text = document.body.innerText || '';
                return text.split(/\\s+/).filter(w => w.length > 0).length;
            }
        """)
        result["word_count"] = word_count

        # Flag issues
        if not result["title"] or len(result["title"].strip()) == 0:
            result["issues"].append("MISSING_TITLE")
        if not result["meta_description"]:
            result["issues"].append("MISSING_META_DESC")
        if not result["h1"]:
            result["issues"].append("MISSING_H1")
        if word_count < 50:
            result["issues"].append(f"LOW_WORD_COUNT ({word_count})")

    except Exception as e:
        result["error"] = str(e)
        result["issues"].append("ERROR")

    # Progress
    path = urlparse(url).path or "/"
    status = "OK" if not result["issues"] else ", ".join(result["issues"])
    icon = "\u2705" if not result["issues"] else "\u26A0\uFE0F "
    print(f"  [{idx+1:3d}/{total}] {icon} {path:<55s}  words={result['word_count']:>5d}  {status}")

    return result


# ── Main ───────────────────────────────────────────────────────────────

async def main():
    print(f"\n{'='*80}")
    print(f"  POTATOPEDIA CRAWLABILITY AUDIT")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}\n")

    # 1. Fetch sitemap
    print(f"Fetching sitemap: {SITEMAP_URL}")
    try:
        urls = await fetch_sitemap(SITEMAP_URL)
    except Exception as e:
        print(f"ERROR: Could not fetch sitemap: {e}")
        sys.exit(1)
    print(f"Found {len(urls)} URLs in sitemap\n")

    # 2. Crawl all pages
    print("Crawling pages...\n")
    results = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="PotatopediaAuditBot/1.0 (+https://potatopedia.com)",
            viewport={"width": 1280, "height": 800},
        )

        # Process in batches for concurrency
        sem = asyncio.Semaphore(CONCURRENCY)

        async def bounded_audit(url, idx):
            async with sem:
                page = await context.new_page()
                try:
                    return await audit_page(page, url, idx, len(urls))
                finally:
                    await page.close()

        tasks = [bounded_audit(url, i) for i, url in enumerate(urls)]
        results = await asyncio.gather(*tasks)

        await context.close()
        await browser.close()

    # 3. Summary report
    total = len(results)
    ok = sum(1 for r in results if not r["issues"])
    issues = total - ok
    errors = sum(1 for r in results if r["error"])

    print(f"\n{'='*80}")
    print(f"  SUMMARY")
    print(f"{'='*80}")
    print(f"  Total pages:    {total}")
    print(f"  Passed:         {ok} \u2705")
    print(f"  With issues:    {issues} \u26A0\uFE0F")
    print(f"  Errors:         {errors} \u274C")
    print()

    # Issue breakdown
    issue_counts = {}
    for r in results:
        for iss in r["issues"]:
            key = iss.split(" (")[0]  # normalize LOW_WORD_COUNT
            issue_counts[key] = issue_counts.get(key, 0) + 1

    if issue_counts:
        print("  Issue breakdown:")
        for iss, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
            print(f"    {iss:<25s}  {count:>3d} pages")
        print()

    # Pages with issues
    flagged = [r for r in results if r["issues"]]
    if flagged:
        print(f"  Flagged pages:")
        for r in flagged:
            path = urlparse(r["url"]).path or "/"
            print(f"    {path:<55s}  {', '.join(r['issues'])}")
        print()

    # Word count stats
    wc = [r["word_count"] for r in results if not r["error"]]
    if wc:
        print(f"  Word count stats:")
        print(f"    Min:     {min(wc):>6d}")
        print(f"    Max:     {max(wc):>6d}")
        print(f"    Avg:     {sum(wc)//len(wc):>6d}")
        print(f"    Median:  {sorted(wc)[len(wc)//2]:>6d}")
    print(f"\n{'='*80}\n")

    # 4. Save JSON report
    report_path = "scripts/crawl_report.json"
    report = {
        "timestamp": datetime.now().isoformat(),
        "sitemap_url": SITEMAP_URL,
        "total_pages": total,
        "passed": ok,
        "flagged": issues,
        "errors": errors,
        "issue_breakdown": issue_counts,
        "pages": results,
    }
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"Detailed report saved to {report_path}")


if __name__ == "__main__":
    asyncio.run(main())
