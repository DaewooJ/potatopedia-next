import { revalidatePath } from "next/cache";
import { sql } from "@/lib/news-db";
import { publishIssue, secretOk } from "@/lib/news-write";
import { indexNow } from "../_lib/indexnow";

// POST /api/newsletters/publish {issue_id}   header x-newsletter-secret (netweb, after YES NL)
// → issue items published (pub_year/month from the issue date), issue approved + published_at, pages revalidated,
//   IndexNow ping. Refuses dry runs and held/dropped/draft issues. Safe to repeat.
export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!secretOk(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
  const s = sql();
  if (!s) return Response.json({ error: "No database" }, { status: 503 });
  const r = await publishIssue(s, body?.issue_id);
  if (r.error) return Response.json({ error: r.error }, { status: r.status });
  for (const p of r.paths) {
    try { revalidatePath(p); } catch (e) { console.error("revalidate_failed", p, e?.message); }
  }
  const indexnow = await indexNow(r.urls);
  return Response.json({ ok: true, issue_id: r.issue.id, status: r.issue.status, items: r.items.length, revalidated: r.paths, indexnow });
}
