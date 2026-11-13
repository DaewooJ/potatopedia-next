import { sql } from "@/lib/news-db";
import { recordSesEvent, verifySnsSignature, snsHostOk, snsCertUrlOk } from "@/lib/news-write";

// POST /api/newsletters/ses-events — SNS topic potatopedia-newsletter-events (SES configuration set
// potatopedia-newsletters: delivery, open, click, bounce, complaint, reject, rendering failure).
// Every message's signature is verified against the AWS signing cert (https://sns.<region>.amazonaws.com/....pem)
// before anything is trusted. SubscriptionConfirmation → GET the SubscribeURL (host must be sns.<region>.amazonaws.com).
// Notification → email_events (issue_id from the mail tags); permanent bounces / complaints stop that subscription.
export const dynamic = "force-dynamic";

const REGION = process.env.SES_REGION || "ap-southeast-2";
const TOPIC = "potatopedia-newsletter-events";
const certs = new Map();

async function cert(url) {
  if (certs.has(url)) return certs.get(url);
  const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!r.ok) throw new Error(`cert ${r.status}`);
  const pem = await r.text();
  if (!pem.includes("BEGIN CERTIFICATE")) throw new Error("not a certificate");
  certs.set(url, pem);
  return pem;
}

export async function POST(req) {
  let msg;
  try { msg = JSON.parse(await req.text()); } catch { return new Response("Bad request", { status: 400 }); }
  const arnOk = typeof msg?.TopicArn === "string" && msg.TopicArn.startsWith(`arn:aws:sns:${REGION}:`) && msg.TopicArn.endsWith(`:${TOPIC}`);
  if (!arnOk || !snsCertUrlOk(msg.SigningCertURL, REGION)) return new Response("Forbidden", { status: 403 });
  let ok = false;
  try { ok = verifySnsSignature(msg, await cert(msg.SigningCertURL)); } catch (e) { console.error("sns_cert_failed", e?.message); }
  if (!ok) return new Response("Bad signature", { status: 403 });

  if (msg.Type === "SubscriptionConfirmation") {
    if (!snsHostOk(msg.SubscribeURL, REGION)) return new Response("Forbidden", { status: 403 });
    const r = await fetch(msg.SubscribeURL, { signal: AbortSignal.timeout(8000) }).catch(() => null);
    return new Response(r?.ok ? "Subscribed" : "Subscribe failed", { status: r?.ok ? 200 : 502 });
  }
  if (msg.Type !== "Notification") return new Response("Ignored");

  let ev;
  try { ev = JSON.parse(msg.Message); } catch { return new Response("Ignored"); }
  const s = sql();
  if (!s) return new Response("No database", { status: 503 }); // SNS retries
  try {
    await recordSesEvent(s, ev);
  } catch (e) {
    console.error("ses_event_failed", e?.message);
    return new Response("Error", { status: 500 });
  }
  return new Response("OK");
}
