// Read helpers for news items + issues (Neon potatopedia-db). Server-only. Write helpers live in lib/news-write.js.
import { neon } from "@neondatabase/serverless";

let _sql = null;
export function sql() {
  if (!process.env.DATABASE_URL) return null;
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}
const safe = async (fn, fallback) => {
  const s = sql();
  if (!s) return fallback;
  try { return await fn(s); } catch (e) { console.error("news-db", e.message); return fallback; }
};

export const latestNews = ({ limit = 20, hub = null, newsletter = null } = {}) =>
  safe((s) => s.query(
    `select * from news_items where status='published'
       and ($1::text is null or hub=$1) and ($2::text is null or newsletter=$2)
     order by published_at desc limit $3`, [hub, newsletter, limit]), []);

export const newsItem = (year, month, slug) =>
  safe(async (s) => (await s.query(
    `select * from news_items where status='published' and pub_year=$1 and pub_month=$2 and slug=$3`,
    [Number(year), Number(month), slug]))[0] || null, null);

export const newsSince = (hours = 48) =>
  safe((s) => s.query(`select * from news_items where status='published' and published_at > now() - make_interval(hours => $1) order by published_at desc`, [hours]), []);

export const allPublishedNews = () =>
  safe((s) => s.query(`select newsletter, slug, pub_year, pub_month, headline, published_at, updated_at from news_items where status='published' order by published_at desc`), []);

export const issuesFor = (newsletter, limit = 50) =>
  safe((s) => s.query(`select * from issues where newsletter=$1 and not dry_run and published_at is not null order by issue_date desc limit $2`, [newsletter, limit]), []);

export const issueByDate = (newsletter, date) =>
  safe(async (s) => (await s.query(`select * from issues where newsletter=$1 and issue_date=$2 and not dry_run and published_at is not null`, [newsletter, date]))[0] || null, null);

// Preview (any status, incl. dry runs) — only with the matching token.
export const issuePreview = (id, token) =>
  safe(async (s) => {
    if (!token) return null;
    const r = (await s.query(`select * from issues where id=$1 and preview_token=$2`, [Number(id), token]))[0];
    return r || null;
  }, null);

export const itemsByIds = (ids) =>
  safe(async (s) => {
    if (!ids?.length) return [];
    const rows = await s.query(`select * from news_items where id = any($1::bigint[])`, [ids]);
    const by = new Map(rows.map((r) => [String(r.id), r]));
    return ids.map((i) => by.get(String(i))).filter(Boolean);
  }, []);
