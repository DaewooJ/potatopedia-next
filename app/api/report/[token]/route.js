import { neon } from "@neondatabase/serverless";
import { verifyReportToken } from "@/lib/report-token";
import { COUNTRIES } from "@/lib/data";

// Mailed link lands here: verify the signed token, stamp leads.confirmed_at (address proven by delivery),
// then send the reader to the country page with ?print=1, which opens the save-as-PDF dialog.
export const runtime = "nodejs";

function page(msg, status) {
  return new Response(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Potatopedia</title>
<body style="font-family:system-ui,sans-serif;background:#fff;color:#1a1a1a;display:grid;place-items:center;min-height:90vh;margin:0;padding:16px">
<div style="max-width:420px;text-align:center"><p style="font-size:18px">${msg}</p><p><a href="https://www.potatopedia.com/countries" style="color:#C62828">Back to Potatopedia</a></p></div></body>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } },
  );
}

export async function GET(req, { params }) {
  const { token } = await params;
  const t = process.env.REPORT_GATE_LIVE === "true" ? verifyReportToken(token) : null;
  if (!t || !COUNTRIES.some((c) => c.slug === t.slug)) {
    return page("This link is not valid or has expired. Please request the report again from the country page.", 400);
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`update leads set confirmed_at = coalesce(confirmed_at, now())
      where ref = ${t.ref} and type = 'report_download' returning id`;
    if (!rows.length) return page("This link is not valid or has expired.", 400);
  } catch (e) {
    console.error("report_confirm_failed", e?.message);
    return page("Something went wrong. Please try the link again in a minute.", 500);
  }
  return Response.redirect(new URL(`/country/${t.slug}?print=1`, req.url), 302);
}
