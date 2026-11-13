import { neon } from "@neondatabase/serverless";

// Newsletter double opt-in: the mailed link lands here and stamps confirmed_at.
export async function GET(req) {
  const token = new URL(req.url).searchParams.get("token") || "";
  let ok = false;
  if (/^[A-Z2-9]{24}$/.test(token)) {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`update leads set confirmed_at = coalesce(confirmed_at, now())
      where type = 'newsletter' and confirm_token = ${token} returning id`;
    ok = rows.length > 0;
  }
  const msg = ok
    ? 'Your email is confirmed. Thank you. To get Potato Processing Weekly, Seed Potato &amp; Field or Potato Prices &amp; Trade, <a href="https://www.potatopedia.com/newsletters" style="color:#C62828">choose your newsletters</a>.'
    : "This link is not valid or has expired.";
  return new Response(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Potatopedia</title>
<body style="font-family:system-ui,sans-serif;background:#fff;color:#1a1a1a;display:grid;place-items:center;min-height:90vh;margin:0;padding:16px">
<div style="max-width:420px;text-align:center"><p style="font-size:18px">${msg}</p><p><a href="https://www.potatopedia.com" style="color:#C62828">Back to Potatopedia</a></p></div></body>`,
    { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
