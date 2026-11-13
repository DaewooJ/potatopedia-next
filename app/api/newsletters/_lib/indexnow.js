// IndexNow ping (Bing, Yandex, Seznam…). Key file: public/ddfadf3f59ea492aa8e581295b2c747a.txt (public by design).
const KEY = "ddfadf3f59ea492aa8e581295b2c747a";
const HOST = "www.potatopedia.com";

export async function indexNow(urls) {
  const list = [...new Set(urls)].filter((u) => u.startsWith(`https://${HOST}/`)).slice(0, 10000);
  if (!list.length) return { skipped: true };
  try {
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: list }),
      signal: AbortSignal.timeout(8000),
    });
    return { status: r.status, count: list.length };
  } catch (e) {
    return { error: e?.message || "indexnow failed" };
  }
}
