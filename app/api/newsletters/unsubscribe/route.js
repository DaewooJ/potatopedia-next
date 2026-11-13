import { sql } from "@/lib/news-db";
import { unsubLookup, unsubscribe, esc } from "@/lib/news-write";
import { bySlug } from "@/lib/newsletters";

// GET  /api/newsletters/unsubscribe?u=<unsub_token>[&i=<issue_id>][&manage=1]
//      → a confirm/manage page. Changes nothing, so mail link scanners that open links are harmless.
// POST /api/newsletters/unsubscribe?u=<unsub_token>
//      → RFC 8058 one-click (body "List-Unsubscribe=One-Click", sent by Gmail/Yahoo/Apple from the List-Unsubscribe
//        header) or the page's own buttons (all=1 = every title of that address). Logs email_events 'unsubscribe'.
export const dynamic = "force-dynamic";

const HEAD = { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" };
const RED = "#C62828";

const mask = (e) => {
  const [u, d] = String(e).split("@");
  return `${u.slice(0, 1)}${"*".repeat(Math.max(1, Math.min(6, u.length - 1)))}@${d}`;
};
const name = (slug) => bySlug(slug)?.name || (slug === "magazine" ? "Potatopedia Magazine" : slug);

function page(inner, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="color-scheme" content="light dark"><title>Potatopedia newsletters</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;background:#fff;color:#1a1a1a;margin:0;padding:32px 16px}
main{max-width:480px;margin:0 auto}h1{font-size:22px;margin:0 0 12px}p{line-height:1.55}a{color:${RED}}
button{font:inherit;font-weight:600;min-height:44px;padding:10px 18px;border-radius:9px;cursor:pointer;border:1px solid ${RED};background:${RED};color:#fff}
button.pp-quiet{background:#fff;color:#333;border-color:#ccc}form{margin:0 0 10px}ul{padding:0;list-style:none}li{border-top:1px solid #eee;padding:12px 0;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}
@media (prefers-color-scheme:dark){body{background:#121212;color:#ededed}button.pp-quiet{background:#1c1c1c;color:#ededed;border-color:#444}li{border-color:#333}a{color:#ef8a8a}}</style></head>
<body><main>${inner}<p style="margin-top:28px;font-size:14px"><a href="https://www.potatopedia.com/newsletters">All Potatopedia newsletters</a></p></main></body></html>`,
    { status, headers: HEAD },
  );
}

const invalid = () => page(`<h1>This link is not valid</h1><p>It may be old or mistyped. To stop a newsletter, use the link in the latest issue, or reply to any issue and we will remove you.</p>`, 404);

export async function GET(req) {
  const url = new URL(req.url);
  const u = url.searchParams.get("u") || "";
  const i = url.searchParams.get("i") || "";
  const s = sql();
  const found = s ? await unsubLookup(s, u).catch(() => null) : null;
  if (!found) return invalid();
  const { sub, all } = found;
  const active = all.filter((r) => ["pending", "confirmed"].includes(r.status));
  const act = (tok) => `/api/newsletters/unsubscribe?u=${encodeURIComponent(tok)}${/^\d+$/.test(i) ? `&i=${i}` : ""}`;
  const thisActive = ["pending", "confirmed"].includes(sub.status);
  const list = all.length
    ? `<ul>${all.map((r) => `<li><span><b>${esc(name(r.newsletter))}</b><br><small>${r.status === "confirmed" ? "Subscribed" : r.status === "pending" ? "Waiting for your confirmation" : "Not subscribed"}</small></span>${
        ["pending", "confirmed"].includes(r.status)
          ? `<form method="post" action="${act(r.unsub_token)}"><button class="pp-quiet" type="submit">Unsubscribe</button></form>`
          : ""
      }</li>`).join("")}</ul>`
    : "";
  return page(`<h1>${thisActive ? `Unsubscribe from ${esc(name(sub.newsletter))}?` : "Your Potatopedia newsletters"}</h1>
<p>Address: ${esc(mask(sub.email))}</p>
${thisActive ? `<form method="post" action="${act(u)}"><button type="submit">Yes, unsubscribe me from ${esc(name(sub.newsletter))}</button></form>` : `<p>You are not subscribed to ${esc(name(sub.newsletter))}.</p>`}
${active.length > 1 || (active.length && !thisActive) ? `<form method="post" action="${act(u)}"><input type="hidden" name="all" value="1"><button class="pp-quiet" type="submit">Unsubscribe from all Potatopedia newsletters</button></form>` : ""}
<h2 style="font-size:16px;margin:28px 0 4px">Manage</h2>${list}`);
}

export async function POST(req) {
  const url = new URL(req.url);
  const u = url.searchParams.get("u") || "";
  const i = url.searchParams.get("i") || null;
  let form = {};
  try {
    const text = await req.text();
    form = Object.fromEntries(new URLSearchParams(text));
  } catch {}
  const oneClick = form["List-Unsubscribe"] === "One-Click";
  const s = sql();
  let changed = null;
  try {
    changed = s ? await unsubscribe(s, u, { all: !oneClick && form.all === "1", issueId: i }) : null;
  } catch (e) {
    console.error("newsletter_unsub_failed", e?.message);
    return new Response("Error", { status: 500 });
  }
  if (oneClick) return new Response(changed ? "Unsubscribed" : "Not found", { status: changed ? 200 : 404, headers: { "cache-control": "no-store" } });
  if (!changed) return invalid();
  const back = `/api/newsletters/unsubscribe?u=${encodeURIComponent(u)}&manage=1`;
  return page(`<h1>Done</h1><p>${changed.length ? `You are unsubscribed from ${changed.map((c) => `<b>${esc(name(c))}</b>`).join(", ")}. No more issues will be sent${changed.length > 1 ? "" : " for that title"}.` : "You were already unsubscribed."}</p>
<p><a href="${back}">Manage your other newsletters</a></p>`);
}
