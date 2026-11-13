import { neon } from "@neondatabase/serverless";
import { NEWSLETTERS, fmtDate, issueLabel } from "@/lib/newsletters";

// Newsletter dashboard (basic auth via proxy.js). True numbers only: these feed the media kit.
export const dynamic = "force-dynamic";
export const metadata = { title: "Newsletters", robots: { index: false, follow: false } };

const RED = "#C62828";
const name = (slug) => NEWSLETTERS.find((n) => n.slug === slug)?.short || slug;
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : "–");
const SLOTS_PER_ISSUE = 2; // presenting + classified

async function load() {
  const sql = neon(process.env.DATABASE_URL);
  const [totals, weeks, issues, stories, slots, leads] = await Promise.all([
    sql`select newsletter, status, count(*)::int n from subscriptions group by 1, 2`,
    sql`with w as (select generate_series(date_trunc('week', now()) - interval '11 weeks', date_trunc('week', now()), interval '1 week') wk)
        select w.wk, s.newsletter,
          count(*) filter (where date_trunc('week', s.created_at) = w.wk)::int signups,
          count(*) filter (where date_trunc('week', s.confirmed_at) = w.wk)::int confirmed,
          count(*) filter (where date_trunc('week', s.unsubscribed_at) = w.wk)::int unsubscribed,
          count(*) filter (where s.status = 'pending' and date_trunc('week', s.created_at) = w.wk)::int still_pending
        from w cross join subscriptions s group by 1, 2 order by 1 desc, 2`,
    sql`select i.id, i.newsletter, i.issue_no, i.issue_date, i.status, i.dry_run, i.subject,
          (select count(*) from email_sends e where e.issue_id = i.id and e.status = 'sent')::int sent,
          (select count(*) from email_sends e where e.issue_id = i.id and e.status = 'failed')::int failed,
          (select count(distinct message_id) from email_events v where v.issue_id = i.id and v.event = 'delivery')::int delivered,
          (select count(distinct message_id) from email_events v where v.issue_id = i.id and v.event = 'open')::int opens,
          (select count(*) from email_events v where v.issue_id = i.id and v.event = 'click')::int clicks,
          (select count(distinct message_id) from email_events v where v.issue_id = i.id and v.event = 'click')::int clickers,
          (select count(*) from email_events v where v.issue_id = i.id and v.event = 'unsubscribe')::int unsubs,
          (select count(*) from email_events v where v.issue_id = i.id and v.event in ('bounce', 'complaint'))::int bounces
        from issues i order by i.issue_date desc, i.id desc limit 60`,
    sql`select split_part(url, '?', 1) url, count(*)::int clicks, count(distinct message_id)::int people
        from email_events where event = 'click' and url like '%potatopedia.com/news/%'
        group by 1 order by 2 desc limit 20`,
    sql`select newsletter, count(*)::int issues,
          coalesce(sum((select count(*) from jsonb_array_elements(sponsor_slots) x where x->>'sponsor' is not null and x->>'label' = 'Sponsored')), 0)::int sold,
          coalesce(sum((select count(*) from jsonb_array_elements(sponsor_slots) x where x->>'sponsor' is not null and x->>'label' = 'Launch partner')), 0)::int partner
        from issues where not dry_run and status in ('approved', 'sending', 'sent') group by 1`,
    sql`select type, count(*)::int total, count(*) filter (where created_at > now() - interval '30 days')::int last30,
          count(*) filter (where confirmed_at is not null)::int confirmed
        from leads group by 1 order by 2 desc`,
  ]);
  return { totals, weeks, issues, stories, slots, leads };
}

export default async function NewslettersAdmin() {
  let data;
  try {
    data = await load();
  } catch (e) {
    return <main style={wrap}><h1 style={h1}>Newsletters</h1><p style={{ color: RED }}>Could not read the database: {e.message}</p></main>;
  }
  const { totals, weeks, issues, stories, slots, leads } = data;
  const tot = (slug, st) => totals.find((r) => r.newsletter === slug && r.status === st)?.n || 0;
  const slugs = [...NEWSLETTERS.map((n) => n.slug), "magazine"];
  const weekList = [...new Set(weeks.map((w) => new Date(w.wk).toISOString().slice(0, 10)))];

  return (
    <main style={wrap}>
      <h1 style={h1}>Newsletters</h1>
      <p style={{ margin: "0 0 24px", color: "#555", fontSize: 14 }}>Live from Neon. Open rate = unique opens ÷ mails sent (Apple Mail privacy inflates opens; clicks are the firmer number).</p>

      <h2 style={h2}>Subscribers now</h2>
      <Table head={["Title", "Confirmed", "Pending", "Unsubscribed", "Bounced", "Complained"]}
        rows={slugs.map((s) => [name(s), tot(s, "confirmed"), tot(s, "pending"), tot(s, "unsubscribed"), tot(s, "bounced"), tot(s, "complained")])} />

      <h2 style={h2}>Per week (last 12 weeks, week starting Monday)</h2>
      {NEWSLETTERS.map((n) => (
        <div key={n.slug} style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: 15, margin: "0 0 6px", color: n.accent }}>{n.name}</h3>
          <Table head={["Week", "Signups", "Confirmed", "Still pending", "Unsubscribed"]}
            rows={weekList.map((wk) => {
              const r = weeks.find((w) => new Date(w.wk).toISOString().slice(0, 10) === wk && w.newsletter === n.slug) || {};
              return [fmtDate(wk), r.signups || 0, r.confirmed || 0, r.still_pending || 0, r.unsubscribed || 0];
            })} />
        </div>
      ))}

      <h2 style={h2}>Issues</h2>
      <Table head={["Issue", "Date", "Status", "Sent", "Failed", "Delivered", "Unique opens", "Open rate", "Clicks", "Unique clickers", "Unsubs", "Bounce/compl."]}
        rows={issues.map((i) => [
          `${name(i.newsletter)} · ${issueLabel(i.issue_no)}${i.dry_run ? " (dry run)" : ""}`,
          fmtDate(i.issue_date), i.status, i.sent, i.failed, i.delivered, i.opens, pct(i.opens, i.sent), i.clicks, i.clickers, i.unsubs, i.bounces,
        ])} empty="No issues yet." />

      <h2 style={h2}>Top stories by clicks</h2>
      <Table head={["Story", "Clicks", "People"]}
        rows={stories.map((s) => [<a key={s.url} href={s.url} style={{ color: RED, wordBreak: "break-all" }}>{s.url.replace(/^https:\/\/www\.potatopedia\.com/, "")}</a>, s.clicks, s.people])}
        empty="No clicks yet." />

      <h2 style={h2}>Sponsor slots (sent or approved issues, {SLOTS_PER_ISSUE} per issue)</h2>
      <Table head={["Title", "Issues", "Sold (Sponsored)", "Launch partner (free)", "Open"]}
        rows={NEWSLETTERS.map((n) => {
          const r = slots.find((x) => x.newsletter === n.slug) || { issues: 0, sold: 0, partner: 0 };
          return [n.name, r.issues, r.sold, r.partner, Math.max(0, r.issues * SLOTS_PER_ISSUE - r.sold - r.partner)];
        })} />

      <h2 style={h2}>Leads by type</h2>
      <Table head={["Type", "All time", "Last 30 days", "Confirmed (opt-in)"]} rows={leads.map((l) => [l.type, l.total, l.last30, l.confirmed])} empty="No leads yet." />
    </main>
  );
}

function Table({ head, rows, empty = "Nothing yet." }) {
  if (!rows.length) return <p style={{ color: "#555", fontSize: 14 }}>{empty}</p>;
  return (
    <div style={{ overflowX: "auto", marginBottom: 8 }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
        <thead>
          <tr>{head.map((h, i) => <th key={h} style={{ ...cell, textAlign: i ? "right" : "left", fontWeight: 700, background: "#F7F7F7", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, j) => (
            <tr key={j}>{r.map((c, i) => <td key={i} style={{ ...cell, textAlign: i ? "right" : "left" }}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const wrap = { maxWidth: 1100, margin: "0 auto", padding: "32px 16px 80px", fontFamily: "inherit", color: "#1a1a1a" };
const h1 = { fontSize: 28, margin: "0 0 6px" };
const h2 = { fontSize: 18, margin: "28px 0 10px", borderBottom: "1px solid #EEE", paddingBottom: 6 };
const cell = { border: "1px solid #E6E6E6", padding: "8px 10px", verticalAlign: "top" };
