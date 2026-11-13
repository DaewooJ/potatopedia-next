import { issuePreview } from "@/lib/news-db";
import { issueRenderer } from "../../_lib/render";

// GET /api/newsletters/email/<issue_id>?t=<preview_token>[&format=text] → the rendered email (any status, dry runs too).
// Token-gated by issues.preview_token; unsubscribe links point at /newsletters in previews.
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { id } = await params;
  const t = new URL(req.url).searchParams.get("t") || "";
  const format = new URL(req.url).searchParams.get("format");
  const issue = /^\d+$/.test(id) && t ? await issuePreview(id, t) : null;
  const headers = { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" };
  if (!issue) return new Response("Not found", { status: 404, headers });
  const m = (await issueRenderer(issue))(issue, null);
  return format === "text"
    ? new Response(m.text, { headers: { ...headers, "content-type": "text/plain; charset=utf-8" } })
    : new Response(m.html, { headers: { ...headers, "content-type": "text/html; charset=utf-8" } });
}
