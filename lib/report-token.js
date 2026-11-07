import { createHmac, timingSafeEqual } from "node:crypto";

// One-time-style signed download links for gated country reports.
// Token = base64url(JSON{r: lead ref, s: country slug, e: expiry ms}) + "." + base64url(HMAC-SHA256).
// Secret: env REPORT_LINK_SECRET (never committed). Links last 7 days.
export const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const b64 = (buf) => Buffer.from(buf).toString("base64url");
const mac = (body, secret) => createHmac("sha256", secret).update(body).digest();

export function signReportToken({ ref, slug }, secret = process.env.REPORT_LINK_SECRET, now = Date.now()) {
  if (!secret) throw new Error("REPORT_LINK_SECRET not set");
  const body = b64(JSON.stringify({ r: ref, s: slug, e: now + TOKEN_TTL_MS }));
  return `${body}.${b64(mac(body, secret))}`;
}

// Returns { ref, slug } or null (bad signature, malformed, expired, no secret).
export function verifyReportToken(token, secret = process.env.REPORT_LINK_SECRET, now = Date.now()) {
  if (!secret || typeof token !== "string" || token.length > 600) return null;
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return null;
  const want = mac(body, secret);
  let got;
  try { got = Buffer.from(sig, "base64url"); } catch { return null; }
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof p.r !== "string" || typeof p.s !== "string" || typeof p.e !== "number" || p.e < now) return null;
    return { ref: p.r, slug: p.s };
  } catch { return null; }
}
