import { sql } from "@/lib/news-db";
import { MEDIA_KEY, getMedia } from "@/lib/media";

// GET /media/<key>.jpg → image bytes from Neon table media. Keys are content-hashed, so the response never changes:
// cached for a year at the browser and the Vercel CDN. Misses are not cached (an upload can follow a miss).
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { key: raw } = await params;
  const key = String(raw || "").replace(/\.jpe?g$/i, "");
  const miss = (status) => new Response("Not found", { status, headers: { "cache-control": "no-store", "content-type": "text/plain" } });
  if (!MEDIA_KEY.test(key) || !/\.jpe?g$/i.test(String(raw))) return miss(404);
  const s = sql();
  if (!s) return miss(503);
  let m = null;
  try { m = await getMedia(s, key); } catch (e) { console.error("media_read_failed", key, e?.message); return miss(503); }
  if (!m) return miss(404);
  const cache = "public, max-age=31536000, s-maxage=31536000, immutable";
  return new Response(m.bytes, {
    headers: {
      "content-type": m.contentType || "image/jpeg",
      "content-length": String(m.bytes.length),
      "cache-control": cache,
      "cdn-cache-control": cache,
      "x-content-type-options": "nosniff",
    },
  });
}
