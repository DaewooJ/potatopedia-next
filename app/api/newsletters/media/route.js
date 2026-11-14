import { sql } from "@/lib/news-db";
import { secretOk } from "@/lib/news-write";
import { MEDIA_KEY, MAX_MEDIA_BYTES, isJpeg, putMedia } from "@/lib/media";

// POST /api/newsletters/media   header x-newsletter-secret (netweb bin/nl-cover.mjs)
//   JSON {key, data: <base64 JPEG>, width?, height?, credit?, licence?}  or  multipart: file + the same fields
// → {ok, key, url:'/media/<key>.jpg', bytes}. JPEG only, max 400 KB. The key should carry a content hash.
export const dynamic = "force-dynamic";

const int = (v) => (v === undefined || v === null || v === "" ? null : Number.isInteger(Number(v)) ? Number(v) : null);
const str = (v, max = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

export async function POST(req) {
  if (!secretOk(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  let f = {}, bytes = null;
  try {
    if ((req.headers.get("content-type") || "").startsWith("multipart/form-data")) {
      const fd = await req.formData();
      for (const k of ["key", "width", "height", "credit", "licence"]) f[k] = fd.get(k) ?? undefined;
      const file = fd.get("file");
      if (file && typeof file.arrayBuffer === "function") bytes = Buffer.from(await file.arrayBuffer());
    } else {
      f = await req.json();
      if (typeof f.data === "string") bytes = Buffer.from(f.data.replace(/^data:image\/jpeg;base64,/, ""), "base64");
    }
  } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
  const key = String(f.key || "").replace(/\.jpe?g$/i, "");
  if (!MEDIA_KEY.test(key)) return Response.json({ error: "Bad key (a-z, 0-9, dashes; 3-91 chars)" }, { status: 400 });
  if (!bytes || !bytes.length) return Response.json({ error: "No image" }, { status: 400 });
  if (bytes.length > MAX_MEDIA_BYTES) return Response.json({ error: `Too big: ${Math.round(bytes.length / 1024)} KB (max 400 KB)` }, { status: 413 });
  if (!isJpeg(bytes)) return Response.json({ error: "JPEG only" }, { status: 415 });
  const s = sql();
  if (!s) return Response.json({ error: "No database" }, { status: 503 });
  const r = await putMedia(s, { key, bytes, width: int(f.width), height: int(f.height), credit: str(f.credit), licence: str(f.licence, 80) });
  return Response.json({ ok: true, key: r.key, url: r.path, bytes: r.bytes });
}
