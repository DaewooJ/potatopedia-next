"""
Bake all /answers/[slug] content at build time by calling the production backend
once per slug and saving the answer + sources to lib/answers-baked.json.

This unblocks the C1 critical issue from the SEO audit: the AnswerAI component is
client-only, so server-rendered HTML for /answers/* pages currently shows only
"Answer could not be loaded" placeholder text. This script pre-fetches the
canonical answer at build time so the page can server-render real content.

Usage: python3 scripts/bake_answers.py

Re-run after adding new slugs to POPULAR_ANSWERS in lib/data.js or when ground-
truth content changes (e.g., backend re-ingestion). Output is checked into git.
"""

import json
import re
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIB_DATA = ROOT / "lib" / "data.js"
OUT_PATH = ROOT / "lib" / "answers-baked.json"
BACKEND = "https://potatopedia-backend.onrender.com"

# Extract POPULAR_ANSWERS array from lib/data.js by regex.
src = LIB_DATA.read_text()
m = re.search(r"POPULAR_ANSWERS\s*=\s*\[([\s\S]*?)\];", src)
if not m:
    raise SystemExit("Could not find POPULAR_ANSWERS in lib/data.js")
block = m.group(1)
# Each entry: { slug: "...", question: "...", category: "..." }
entries = re.findall(
    r'\{\s*slug:\s*"([^"]+)",\s*question:\s*"([^"]+)",\s*category:\s*"([^"]+)"\s*\}',
    block,
)
print(f"Found {len(entries)} POPULAR_ANSWERS entries to bake.")


def fetch_one(slug, question, category):
    """Call backend /ask once. Return (slug, payload) or (slug, None) on failure."""
    payload = json.dumps({"question": question, "top_k": 8, "source": "answer_bake"}).encode()
    cmd = [
        "curl", "-s", "-X", "POST", BACKEND + "/ask",
        "-H", "Content-Type: application/json",
        "--data-binary", "@-",
        "--max-time", "120",
    ]
    try:
        r = subprocess.run(cmd, input=payload, capture_output=True, timeout=130)
        if r.returncode != 0:
            return slug, None, f"curl rc={r.returncode}"
        data = json.loads(r.stdout)
        if not data.get("answer"):
            return slug, None, "empty answer"
        # Trim source list to keep file size reasonable; keep top-5 by relevance.
        srcs = data.get("sources") or []
        srcs = sorted(srcs, key=lambda s: -(s.get("relevance_score") or 0))[:5]
        # Drop large excerpts; keep title + source + year + short excerpt.
        for s in srcs:
            ex = s.get("relevant_excerpt") or ""
            s["relevant_excerpt"] = ex[:280]
        out = {
            "slug": slug,
            "question": question,
            "category": category,
            "answer": data["answer"],
            "sources": srcs,
            "confidence": data.get("confidence"),
            "data_freshness": data.get("data_freshness"),
            "related_questions": (data.get("related_questions") or [])[:5],
            "baked_at": int(time.time()),
        }
        return slug, out, None
    except Exception as e:
        return slug, None, str(e)


# Warm up backend with a single call first so cold-start doesn't hit one of the parallel jobs.
print("Warming up backend...")
fetch_one("warmup", "What is potato?", "Misc")

print(f"Baking {len(entries)} answers in parallel (4 workers)...")
results = {}
errors = []
start = time.time()
with ThreadPoolExecutor(max_workers=4) as ex:
    futs = {ex.submit(fetch_one, s, q, c): (s, q) for s, q, c in entries}
    done = 0
    for f in as_completed(futs):
        slug, data, err = f.result()
        done += 1
        if data:
            results[slug] = data
            print(f"  [{done}/{len(entries)}] OK  {slug} ({len(data['answer'])} chars, {len(data['sources'])} sources)")
        else:
            errors.append((slug, err))
            print(f"  [{done}/{len(entries)}] FAIL {slug}: {err}")
elapsed = time.time() - start
print(f"\nDone in {elapsed:.0f}s. Successes: {len(results)}. Failures: {len(errors)}.")
if errors:
    print("Failures (will retry serially):")
    for slug, err in errors:
        print(f"  - {slug}: {err}")
    # Retry failures serially with a longer pause between calls
    for slug, err in errors:
        ent = next((e for e in entries if e[0] == slug), None)
        if not ent:
            continue
        time.sleep(2)
        s, data, err2 = fetch_one(*ent)
        if data:
            results[slug] = data
            print(f"  RETRY OK  {slug}")
        else:
            print(f"  RETRY FAIL {slug}: {err2}")

# Preserve insertion order matching lib/data.js for deterministic builds
ordered = {slug: results[slug] for slug, _, _ in entries if slug in results}
OUT_PATH.write_text(json.dumps(ordered, indent=2, ensure_ascii=False))
print(f"\nWrote {len(ordered)} baked answers to {OUT_PATH.relative_to(ROOT)}")
print(f"File size: {OUT_PATH.stat().st_size / 1024:.1f} KB")
