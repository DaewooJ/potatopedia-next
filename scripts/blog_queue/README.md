# Blog publish queue

Each `NN_slug.json` file here is one fully-written, ready-to-publish blog post, matching the `BLOG_POSTS` schema in `lib/data.js` minus `date`/`dateISO` (stamped at publish time with the actual run date).

`scripts/publish_next_blog_post.py`, run daily by `.github/workflows/blog-publish.yml`, publishes the lowest-numbered file each day: inserts it into `lib/data.js`, moves the file to `published/`, commits, and pushes (which triggers Vercel's auto-deploy).

**Numeric prefix = publish order.** To reorder, rename files. To skip a day / pause, just don't let the workflow run (disable it or delete pending files) — an empty queue is a safe no-op, not an error.

JSON shape:
```json
{
  "slug": "kebab-case-slug",
  "title": "...",
  "readTime": "N min read",
  "category": "...",
  "excerpt": "...",
  "takeaways": ["...", "...", "...", "..."],
  "content": [
    {"type": "p", "text": "..."},
    {"type": "h2", "text": "..."},
    {"type": "links", "title": "Cross-reference", "items": [{"href": "...", "text": "..."}]},
    {"type": "source", "text": "..."}
  ]
}
```
