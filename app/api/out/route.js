import { neon } from "@neondatabase/serverless";
import { outboundUrl } from "../../../lib/directory";

// GET /api/out?c=<slug> — outbound click to a listed company's own website (8 Nov 2026).
// Logs slug, time, referrer and the visitor's country (from Vercel's geo header) to pp_company_clicks; no IP is stored.
// Redirects only to that company's own home_url / contact website on its own domain; never to a URL from the request.

export const dynamic = "force-dynamic";

const SLUG = /^[a-z0-9-]{2,120}$/;
const noindex = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

export async function GET(req) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("c") || "";
  const home = new URL("/companies", url);
  if (!SLUG.test(slug) || !process.env.DATABASE_URL) return Response.redirect(home, 302);
  const sql = neon(process.env.DATABASE_URL);
  let row;
  try {
    [row] = await sql`select slug, domain, home_url, profile->'contact'->>'website' as website from pp_companies where published = true and slug = ${slug} limit 1`;
  } catch {
    return Response.redirect(home, 302);
  }
  const target = row && outboundUrl(row);
  if (!target) return new Response("Unknown company", { status: 404, headers: noindex });
  const ref = (req.headers.get("referer") || "").slice(0, 300) || null;
  const country = (req.headers.get("x-vercel-ip-country") || "").slice(0, 2).toUpperCase() || null;
  const bot = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i.test(req.headers.get("user-agent") || "");
  if (!bot) {
    try {
      await sql`insert into pp_company_clicks (slug, referrer, country) values (${slug}, ${ref}, ${country})`;
    } catch {
      // never block the visitor on a logging failure
    }
  }
  return new Response(null, { status: 302, headers: { Location: target, ...noindex } });
}
