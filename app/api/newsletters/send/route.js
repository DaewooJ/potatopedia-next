import { sql } from "@/lib/news-db";
import { sendIssue, secretOk } from "@/lib/news-write";
import { sesSend } from "../_lib/ses";
import { issueRenderer } from "../_lib/render";

// POST /api/newsletters/send {issue_id, limit?:400, test_to?}   header x-newsletter-secret (netweb, at send time)
// → one batch to confirmed subscribers of the title not yet in email_sends → {sent, failed, remaining}.
//   Call again while remaining > 0. Idempotent (email_sends unique issue+subscription, claimed before sending).
//   ≤12 mails/s, SES configuration set potatopedia-newsletters, EmailTags issue_id + newsletter,
//   List-Unsubscribe + List-Unsubscribe-Post (one-click). Refuses dry runs and non-approved issues;
//   {test_to} sends one "[TEST]" copy (allowed for dry runs) and records nothing.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  if (!secretOk(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
  const s = sql();
  if (!s) return Response.json({ error: "No database" }, { status: 503 });
  if (!process.env.SES_ACCESS_KEY_ID) return Response.json({ error: "SES env not set" }, { status: 503 });

  let render = null;
  const r = await sendIssue(s, body?.issue_id, {
    limit: Math.min(Number(body?.limit) || 400, 400),
    testTo: typeof body?.test_to === "string" ? body.test_to.trim() : null,
    render: async (issue, sub) => {
      render ||= await issueRenderer(issue);
      return render(issue, sub);
    },
    sendEmail: async ({ to, subject, html, text, unsubUrl, issue }) => {
      const mid = await sesSend({ to, subject, html, text, unsubUrl, tags: { issue_id: issue.id, newsletter: issue.newsletter } });
      if (!mid) throw new Error("SES returned no MessageId");
      return mid;
    },
  });
  if (r.error) return Response.json({ error: r.error }, { status: r.status });
  return Response.json(r);
}
