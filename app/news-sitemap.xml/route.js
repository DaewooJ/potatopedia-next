import { SITE, newsHref } from "../../lib/newsletters";
import { newsSince } from "../../lib/news-db";

// Google News sitemap (13 Nov 2026): only stories published in the last 2 days, as Google asks.
// Revalidated on publish (/api/newsletters/publish) and at most hourly otherwise.
export const revalidate = 3600;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

export async function GET() {
  const items = (await newsSince(48)).filter((it) => it.pub_year && it.pub_month);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items
  .map(
    (it) => `  <url>
    <loc>${esc(SITE + newsHref(it))}</loc>
    <news:news>
      <news:publication>
        <news:name>Potatopedia</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(it.published_at).toISOString()}</news:publication_date>
      <news:title>${esc(it.headline)}</news:title>
    </news:news>
  </url>`,
  )
  .join("\n")}
</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=900, s-maxage=900" },
  });
}
