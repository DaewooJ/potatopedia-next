import { sql } from "@/lib/news-db";
import { parseSubscribe, rateLimited, subscribe, ipHash } from "@/lib/news-write";
import { sesSend } from "../_lib/ses";

// POST /api/newsletters/subscribe {email, name?, company?, role?, country?, titles:[slug], page_url?, utm_*?}
// → one leads row (type newsletter, details {titles, role}) + one pending subscription per title + ONE double opt-in
// mail listing the titles. Answers {ok:true} once stored (never reveals whether an address was already subscribed).
// Rate limit: more than 6 leads from one ip_hash in 10 minutes → 429 (counted in Neon, so it holds across instances).
export const dynamic = "force-dynamic";

async function readBody(req) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) return req.json();
  const fd = await req.formData();
  const out = {};
  for (const [k, v] of fd.entries()) {
    if (k === "titles") (out.titles ||= []).push(String(v));
    else out[k] = String(v);
  }
  return out;
}

export async function POST(req) {
  let body;
  try {
    body = await readBody(req);
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  if (body?.website_url) return Response.json({ ok: true }); // honeypot
  const { error, input } = parseSubscribe(body);
  if (error) return Response.json({ error }, { status: 400 });
  const s = sql();
  if (!s) return Response.json({ error: "Signups are not open yet." }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const hash = await ipHash(ip);
  try {
    if (await rateLimited(s, hash)) {
      return Response.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
    }
    await subscribe(s, input, {
      ipHash: hash,
      // No configuration set on the opt-in mail: it must work even before scripts/newsletters/ses-setup.sh has run.
      sendMail: (m) => sesSend({ to: m.to, subject: m.subject, html: m.html, text: m.text, configSet: false }),
    });
  } catch (e) {
    console.error("newsletter_subscribe_failed", e?.message);
    return Response.json({ error: "Could not save your signup. Please try again." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
