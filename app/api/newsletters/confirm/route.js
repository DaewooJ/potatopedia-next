import { sql } from "@/lib/news-db";
import { confirmSubscription } from "@/lib/news-write";

// GET /api/newsletters/confirm?t=<confirm_token> → confirms every pending title sharing the token,
// then redirects to /newsletters?confirmed=1 (or =0 for an unknown/expired link).
export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = new URL(req.url);
  const t = url.searchParams.get("t") || "";
  let ok = false;
  const s = sql();
  if (s) {
    try {
      ok = (await confirmSubscription(s, t)).length > 0;
    } catch (e) {
      console.error("newsletter_confirm_failed", e?.message);
    }
  }
  return Response.redirect(new URL(`/newsletters?confirmed=${ok ? 1 : 0}`, url), 303);
}
