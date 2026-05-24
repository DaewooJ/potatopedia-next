#!/usr/bin/env python3
"""Submit Potatopedia sitemap URLs to the IndexNow API.

Pulls all <loc> entries from the live sitemap (recursing into sitemap-index
documents if present) and POSTs them to the IndexNow endpoint. Stdlib only.

Exits 0 when every batch returns 200 or 202, 1 otherwise.
"""

import json
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

INDEXNOW_KEY = "ddfadf3f59ea492aa8e581295b2c747a"
HOST = "www.potatopedia.com"
KEY_LOCATION = f"https://{HOST}/{INDEXNOW_KEY}.txt"
SITEMAP_URL = f"https://{HOST}/sitemap.xml"
ENDPOINT = "https://api.indexnow.org/IndexNow"

USER_AGENT = "Potatopedia-IndexNow/1.0"
BATCH_SIZE = 10000
REQUEST_TIMEOUT = 30
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"

STATUS_MESSAGES = {
    200: "OK — URLs received and validated",
    202: "Accepted — URLs received, validation pending",
    400: "Bad request — check JSON format",
    403: "Forbidden — key file not found at keyLocation",
    422: "Unprocessable — URLs don't match host or key invalid",
    429: "Too many requests — back off and retry later",
}


def _http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        return resp.read()


def fetch_sitemap_urls(sitemap_url):
    """Return all <loc> URLs from a sitemap. Recurses into sitemap-index documents."""
    try:
        raw = _http_get(sitemap_url)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
        raise RuntimeError(f"could not fetch sitemap {sitemap_url}: {e}")

    try:
        root = ET.fromstring(raw)
    except ET.ParseError as e:
        raise RuntimeError(f"could not parse sitemap XML at {sitemap_url}: {e}")

    # sitemap-index: <sitemapindex><sitemap><loc>.../loc></sitemap>...</sitemapindex>
    index_entries = root.findall(f"{SITEMAP_NS}sitemap")
    if index_entries:
        urls = []
        for entry in index_entries:
            loc = entry.find(f"{SITEMAP_NS}loc")
            if loc is not None and loc.text:
                urls.extend(fetch_sitemap_urls(loc.text.strip()))
        return urls

    # regular urlset: <urlset><url><loc>...</loc></url>...</urlset>
    urls = []
    for url_el in root.findall(f"{SITEMAP_NS}url"):
        loc = url_el.find(f"{SITEMAP_NS}loc")
        if loc is not None and loc.text:
            urls.append(loc.text.strip())
    return urls


def submit_urls(urls):
    """POST URLs to IndexNow in batches. Returns a list of (status_code, body) tuples."""
    results = []
    for i in range(0, len(urls), BATCH_SIZE):
        batch = urls[i : i + BATCH_SIZE]
        payload = {
            "host": HOST,
            "key": INDEXNOW_KEY,
            "keyLocation": KEY_LOCATION,
            "urlList": batch,
        }
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            ENDPOINT,
            data=body,
            method="POST",
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": USER_AGENT,
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                results.append((resp.getcode(), resp.read().decode("utf-8", errors="replace")))
        except urllib.error.HTTPError as e:
            try:
                err_body = e.read().decode("utf-8", errors="replace")
            except Exception:
                err_body = ""
            results.append((e.code, err_body))
        except (urllib.error.URLError, TimeoutError) as e:
            results.append((0, f"network error: {e}"))
    return results


def interpret(code):
    return STATUS_MESSAGES.get(code, f"Unexpected response: {code}")


def main():
    print(f"[{datetime.now().isoformat(timespec='seconds')}] IndexNow submission starting")
    print(f"Host:       {HOST}")
    print(f"Sitemap:    {SITEMAP_URL}")
    print(f"Key file:   {KEY_LOCATION}")

    try:
        urls = fetch_sitemap_urls(SITEMAP_URL)
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    if not urls:
        print("ERROR: no URLs found in sitemap — nothing to submit", file=sys.stderr)
        return 1

    print(f"Found {len(urls)} URL(s) in sitemap")

    results = submit_urls(urls)
    total_batches = len(results)
    all_ok = True
    for idx, (code, body) in enumerate(results, 1):
        print(f"Batch {idx}/{total_batches}: {code} — {interpret(code)}")
        if code not in (200, 202):
            all_ok = False
            if body:
                snippet = body.strip().replace("\n", " ")[:500]
                if snippet:
                    print(f"  response: {snippet}")

    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
