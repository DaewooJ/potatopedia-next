import { revalidatePath } from "next/cache";
import { secretOk } from "@/lib/news-write";

// POST /api/revalidate {paths:["/news", ...]}   header x-newsletter-secret → revalidatePath for each (max 200).
export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!secretOk(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
  const paths = Array.isArray(body?.paths) ? body.paths : [];
  const ok = paths.filter((p) => typeof p === "string" && /^\/[A-Za-z0-9\-._~/%#?=&]*$/.test(p) && p.length <= 300).slice(0, 200);
  if (!ok.length) return Response.json({ error: "paths required" }, { status: 400 });
  const done = [];
  for (const p of ok) {
    try { revalidatePath(p); done.push(p); } catch (e) { console.error("revalidate_failed", p, e?.message); }
  }
  return Response.json({ ok: true, revalidated: done });
}
