#!/usr/bin/env python3
"""Publish the next queued blog post into lib/data.js.

Flow:
  1. List scripts/blog_queue/*.json, sorted by filename (numeric prefix
     controls publish order, e.g. 01_topic.json before 02_topic.json).
  2. If empty, log "Nothing queued" and exit 0 (same no-op-is-fine pattern
     as the LinkedIn publisher).
  3. Take the first file. Stamp today's date onto it (date/dateISO) — the
     queue file itself carries no fixed future date; "today" is always
     whatever day the script actually runs.
  4. Serialize the post object to the exact JS object-literal shape used
     throughout BLOG_POSTS, and insert it into lib/data.js immediately
     before the array's closing "];".
  5. Move the consumed queue file to scripts/blog_queue/published/ (kept
     for history, not deleted).
  6. Commit both changes and push to main. Vercel's GitHub integration
     auto-deploys on push, so no separate deploy step is needed here.

This script does NOT generate content. Every post in the queue was
researched and written ahead of time (by a human/Claude session with
review), checked into scripts/blog_queue/. The daily job only staples on
a real-time publish date and mechanically inserts it — no unattended AI
writing happens in this script, by design.

Environment:
  GIT_AUTHOR_NAME / GIT_AUTHOR_EMAIL   optional, for the commit author
  (git push relies on ambient credentials — in GitHub Actions this is the
  default GITHUB_TOKEN with `contents: write` permission; locally, your
  own configured git credentials.)
"""

import datetime
import json
import os
import subprocess
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUEUE_DIR = os.path.join(REPO_ROOT, "scripts", "blog_queue")
PUBLISHED_DIR = os.path.join(QUEUE_DIR, "published")
DATA_JS_PATH = os.path.join(REPO_ROOT, "lib", "data.js")

CLOSING_MARKER = "];\n\n// Sort blog posts by date desc so newest surface first across the site."


def log(message):
    print(message, flush=True)


def next_queue_file():
    if not os.path.isdir(QUEUE_DIR):
        return None
    candidates = sorted(
        f for f in os.listdir(QUEUE_DIR)
        if f.endswith(".json") and os.path.isfile(os.path.join(QUEUE_DIR, f))
    )
    if not candidates:
        return None
    return os.path.join(QUEUE_DIR, candidates[0])


def js_string(value):
    """A Python string, rendered as a JS double-quoted string literal.

    json.dumps already produces double-quoted, correctly-escaped output
    (\\", \\\\, \\n, \\uXXXX) that is valid JS string syntax as-is, so this
    is just that — no hand-rolled escaping to get subtly wrong.
    """
    return json.dumps(value, ensure_ascii=False)


def js_content_block(block):
    t = block.get("type")
    if t in ("p", "h2", "source"):
        return f'{{type:{js_string(t)},text:{js_string(block["text"])}}}'
    if t == "links":
        items = ",".join(
            f'{{href:{js_string(it["href"])},text:{js_string(it["text"])}}}'
            for it in block.get("items", [])
        )
        return f'{{type:"links",title:{js_string(block["title"])},items:[{items}]}}'
    raise ValueError(f"Unknown content block type: {t!r}")


def js_post_literal(post, publish_date, publish_date_iso):
    takeaways = ",\n      ".join(js_string(t) for t in post["takeaways"])
    content_lines = ",\n      ".join(js_content_block(b) for b in post["content"])
    # Leading comma bridges from the previous last entry's closing "}" —
    # the array had none before "];", since JS array literals don't need
    # (or, by this codebase's convention, use) a trailing comma before the
    # closing bracket.
    return f''',
  {{
    slug: {js_string(post["slug"])},
    title: {js_string(post["title"])},
    date: {js_string(publish_date)},
    dateISO: {js_string(publish_date_iso)},
    readTime: {js_string(post["readTime"])},
    category: {js_string(post["category"])},
    excerpt: {js_string(post["excerpt"])},
    takeaways: [
      {takeaways}
    ],
    content: [
      {content_lines},
    ]
  }}
];

// Sort blog posts by date desc so newest surface first across the site.'''


def insert_post(js_source, post_literal):
    if CLOSING_MARKER not in js_source:
        raise RuntimeError(
            "Could not find the expected BLOG_POSTS closing marker in lib/data.js — "
            "refusing to guess where to insert, to avoid corrupting the file. "
            "The array's closing pattern may have changed; update CLOSING_MARKER."
        )
    return js_source.replace(CLOSING_MARKER, post_literal, 1)


def run(cmd, **kwargs):
    log(f"$ {' '.join(cmd)}")
    subprocess.run(cmd, cwd=REPO_ROOT, check=True, **kwargs)


def main():
    dry_run = "--dry-run" in sys.argv

    queue_file = next_queue_file()
    if queue_file is None:
        log("Nothing queued. Exiting.")
        return 0

    with open(queue_file, "r", encoding="utf-8") as f:
        post = json.load(f)

    slug = post.get("slug", "<missing slug>")
    log(f"Publishing queued post: {os.path.basename(queue_file)} (slug: {slug})")

    today = datetime.datetime.now(datetime.timezone.utc).date()
    publish_date = today.strftime("%B %-d, %Y") if os.name != "nt" else today.strftime("%B %#d, %Y")
    publish_date_iso = today.isoformat()

    with open(DATA_JS_PATH, "r", encoding="utf-8") as f:
        js_source = f.read()

    if f'slug: "{slug}"' in js_source or f"slug: {json.dumps(slug)}" in js_source:
        raise RuntimeError(
            f"Slug {slug!r} already exists in lib/data.js — refusing to publish a "
            "duplicate. Check the queue for a stale/already-published file."
        )

    post_literal = js_post_literal(post, publish_date, publish_date_iso)
    new_source = insert_post(js_source, post_literal)

    if dry_run:
        log(f"[dry-run] Would publish '{slug}' dated {publish_date_iso}.")
        log("[dry-run] --- inserted JS literal ---")
        log(post_literal)
        log("[dry-run] Not writing lib/data.js, not moving the queue file, not committing/pushing.")
        return 0

    with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
        f.write(new_source)

    os.makedirs(PUBLISHED_DIR, exist_ok=True)
    published_path = os.path.join(PUBLISHED_DIR, os.path.basename(queue_file))
    os.replace(queue_file, published_path)

    run(["git", "add", "lib/data.js", os.path.relpath(published_path, REPO_ROOT), os.path.relpath(queue_file, REPO_ROOT)])
    # queue_file no longer exists (moved), but `git add` on both old and new
    # paths correctly stages the rename either way.
    commit_message = f"Auto-publish blog post: {post.get('title', slug)}\n\nQueued post {os.path.basename(queue_file)} published for {publish_date_iso} by the daily blog-publish workflow. No new content was generated by this run — this post was researched and written ahead of time and only needed today's date stamped on.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
    run(["git", "commit", "-m", commit_message])
    run(["git", "push", "origin", "HEAD:main"])

    log(f"Published '{slug}' for {publish_date_iso} and pushed to main.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
