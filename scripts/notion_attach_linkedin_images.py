#!/usr/bin/env python3
"""One-time script: attach the 15 mapped PNGs to their Notion pages' Image
property and set Alt text, per content/linkedin_images/CLAUDE_CODE_HANDOFF.md
and linkedin_image_mapping.json.

Does NOT touch Status, Post text, Source links, or Scheduled for. Does NOT
touch the "IMAGE TEST" row — that row isn't in the mapping file at all, so
it's structurally excluded, not filtered at runtime.

Flow per row (verified against Notion's official API docs, Notion-Version
2026-03-11):
  1. POST /v1/file_uploads               -> {id, upload_url}
  2. POST /v1/file_uploads/{id}/send      -> multipart/form-data, field "file"
  3. PATCH /v1/pages/{page_id}            -> attach file_upload id to the
                                              Image property + set Alt text

Files must be attached within 1 hour of upload (Notion's limit) — this
script does create->send->attach per row immediately, never batching
uploads ahead of attachment, so this is a non-issue in practice.

Requires NOTION_TOKEN in the environment. Never printed.

Usage:
  export NOTION_TOKEN="$(pbpaste)"   # after copying your token
  python3 scripts/notion_attach_linkedin_images.py           # dry-run report only
  python3 scripts/notion_attach_linkedin_images.py --apply    # actually upload + attach
  pbcopy < /dev/null
"""

import argparse
import json
import os
import sys
from pathlib import Path

import requests

NOTION_VERSION = "2026-03-11"
NOTION_API_BASE = "https://api.notion.com/v1"

SCRIPT_DIR = Path(__file__).resolve().parent
IMAGES_DIR = SCRIPT_DIR.parent / "content" / "linkedin_images"
MAPPING_PATH = IMAGES_DIR / "linkedin_image_mapping.json"


def require_token():
    token = os.environ.get("NOTION_TOKEN", "").strip()
    if not token:
        print("ERROR: NOTION_TOKEN is not set in the environment.", file=sys.stderr)
        sys.exit(1)
    return token


def headers(token, content_type="application/json"):
    h = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
    }
    if content_type:
        h["Content-Type"] = content_type
    return h


def get_page(token, page_id):
    resp = requests.get(f"{NOTION_API_BASE}/pages/{page_id}", headers=headers(token), timeout=30)
    resp.raise_for_status()
    return resp.json()


def summarize_page(page):
    props = page.get("properties", {})
    status = (props.get("Status", {}).get("select") or {}).get("name")
    image_files = props.get("Image", {}).get("files") or []
    alt_text_rt = props.get("Alt text", {}).get("rich_text") or []
    alt_text = "".join(t.get("plain_text", "") for t in alt_text_rt)
    return {
        "status": status,
        "image_count": len(image_files),
        "image_names": [f.get("name") for f in image_files],
        "alt_text": alt_text,
    }


def create_file_upload(token, filename, content_type):
    body = {"mode": "single_part", "filename": filename, "content_type": content_type}
    resp = requests.post(f"{NOTION_API_BASE}/file_uploads", headers=headers(token), json=body, timeout=30)
    resp.raise_for_status()
    return resp.json()["id"]


def send_file_upload(token, file_upload_id, filepath):
    url = f"{NOTION_API_BASE}/file_uploads/{file_upload_id}/send"
    with open(filepath, "rb") as f:
        resp = requests.post(
            url,
            headers=headers(token, content_type=None),  # let requests set the multipart boundary
            files={"file": (filepath.name, f, "image/png")},
            timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def attach_image_and_alt_text(token, page_id, file_upload_id, filename, alt_text):
    body = {
        "properties": {
            "Image": {
                "type": "files",
                "files": [
                    {"type": "file_upload", "file_upload": {"id": file_upload_id}, "name": filename}
                ],
            },
            "Alt text": {
                "type": "rich_text",
                "rich_text": [{"type": "text", "text": {"content": alt_text[:2000]}}],
            },
        }
    }
    resp = requests.patch(f"{NOTION_API_BASE}/pages/{page_id}", headers=headers(token), json=body, timeout=30)
    resp.raise_for_status()
    return resp.json()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true",
                         help="Actually upload and attach. Without this flag, only prints the pre-check report.")
    args = parser.parse_args()

    token = require_token()

    if not MAPPING_PATH.exists():
        print(f"ERROR: mapping file not found at {MAPPING_PATH}", file=sys.stderr)
        sys.exit(1)
    with open(MAPPING_PATH) as f:
        mapping = json.load(f)

    posts = mapping["posts"]
    print(f"Loaded {len(posts)} rows from {MAPPING_PATH.name}\n")

    # Pre-check pass: fetch current state for every row before touching anything.
    print("=== PRE-CHECK (current state) ===")
    pre_state = {}
    problems = []
    for p in posts:
        page = get_page(token, p["notion_page_id"])
        state = summarize_page(page)
        pre_state[p["notion_page_id"]] = state
        img_path = IMAGES_DIR / p["image_file"]
        img_ok = img_path.exists()
        if not img_ok:
            problems.append(f"  MISSING FILE: {p['image_file']} for post {p['post']}")
        flag = "" if state["status"] == "Draft" else f"  <-- unexpected Status={state['status']!r}"
        print(f"[{p['post']:2d}] {p['row_name']!r}: Status={state['status']!r}, "
              f"Image files={state['image_count']}, existing alt_text={state['alt_text'][:40]!r}{flag}")
        if img_ok:
            pass
        else:
            print(f"       WARNING: local file {p['image_file']} not found at {img_path}")

    if problems:
        print("\nPROBLEMS FOUND — stopping before any writes:")
        for pr in problems:
            print(pr)
        sys.exit(1)

    non_draft = [p for p in posts if pre_state[p["notion_page_id"]]["status"] != "Draft"]
    if non_draft:
        print("\nSTOPPING: the following rows are not Status=Draft — refusing to touch them "
              "without explicit confirmation:")
        for p in non_draft:
            print(f"  - {p['row_name']!r}: Status={pre_state[p['notion_page_id']]['status']!r}")
        sys.exit(1)

    print("\nAll 15 rows are Status=Draft and all 15 local image files exist. Pre-check passed.")

    if not args.apply:
        print("\nDry run only (no --apply flag). Nothing was uploaded or attached. "
              "Re-run with --apply to actually do it.")
        return

    print("\n=== APPLYING (upload + attach) ===")
    results = []
    for p in posts:
        page_id = p["notion_page_id"]
        filename = p["image_file"]
        filepath = IMAGES_DIR / filename
        print(f"[{p['post']:2d}] {p['row_name']!r} -> {filename} ... ", end="", flush=True)
        try:
            file_upload_id = create_file_upload(token, filename, "image/png")
            send_file_upload(token, file_upload_id, filepath)
            attach_image_and_alt_text(token, page_id, file_upload_id, filename, p["alt_text"])
            print("OK")
            results.append((p, True, None))
        except requests.HTTPError as e:
            error_body = e.response.text if e.response is not None else str(e)
            print(f"FAILED: {error_body}")
            results.append((p, False, error_body))

    failed = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(failed)}/{len(results)} rows succeeded.")
    if failed:
        print("FAILURES:")
        for p, _, err in failed:
            print(f"  - [{p['post']}] {p['row_name']!r}: {err}")

    # Post-verification pass.
    print("\n=== POST-VERIFICATION ===")
    all_good = True
    for p in posts:
        page = get_page(token, p["notion_page_id"])
        state = summarize_page(page)
        status_ok = state["status"] == "Draft"
        image_ok = state["image_count"] == 1 and state["image_names"] == [p["image_file"]]
        alt_ok = state["alt_text"] == p["alt_text"]
        row_ok = status_ok and image_ok and alt_ok
        all_good = all_good and row_ok
        mark = "OK" if row_ok else "MISMATCH"
        print(f"[{p['post']:2d}] {p['row_name']!r}: {mark} "
              f"(Status={state['status']!r} image_count={state['image_count']} "
              f"names={state['image_names']} alt_matches={alt_ok})")

    print("\nALL ROWS VERIFIED CORRECT" if all_good else "\nSOME ROWS DID NOT VERIFY — see above")


if __name__ == "__main__":
    main()
