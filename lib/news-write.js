// Write helpers for the newsletters (13 Nov 2026): subscribe, confirm, unsubscribe, publish, send, SES events.
// Server-only. Every function takes `sql` (a Neon query function with .query(text, params)) as its first argument and
// never sends mail itself: mail goes through the injected `sendMail` / `sendEmail` callbacks, so
// scripts/newsletters/selftest.mjs can run the real logic against Neon with mail stubbed out.
// Relative imports only (this file is also loaded by plain node in the selftest).
import { createVerify } from "node:crypto";
import { NEWSLETTERS, NEWSLETTER_SLUGS, SITE, bySlug, newsHref, issueHref } from "./newsletters.js";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const CONFIRM_RE = /^[A-Z2-9]{24}$/;
export const UNSUB_RE = /^[A-Z2-9]{32}$/;
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function rand(n) {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => a[b % 32]).join("");
}

export function makeRef() {
  const d = new Date();
  const dmy = [d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear() % 100].map((x) => String(x).padStart(2, "0")).join("");
  return `PP-${dmy}-${rand(4)}`;
}

// Same hash as /api/lead, so one ip_hash means one visitor across both forms.
export async function ipHash(ip) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`pp:${ip}`));
  return Array.from(new Uint8Array(buf).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const confirmUrl = (token) => `${SITE}/api/newsletters/confirm?t=${token}`;
export const unsubUrl = (token, issueId) => `${SITE}/api/newsletters/unsubscribe?u=${token}${issueId ? `&i=${issueId}` : ""}`;
export const manageUrl = (token) => `${SITE}/api/newsletters/unsubscribe?u=${token}&manage=1`;

/* ---------------------------------------------------------------- subscribe */

// Validates the signup body. Returns {error} or {input}.
export function parseSubscribe(body) {
  if (!body || typeof body !== "object") return { error: "Bad request" };
  const s = (k, max) => (typeof body[k] === "string" && body[k].trim() ? body[k].trim().slice(0, max) : null);
  const email = s("email", 200);
  if (!email || !EMAIL_RE.test(email)) return { error: "Please give a valid work email." };
  const raw = Array.isArray(body.titles) ? body.titles : typeof body.titles === "string" ? [body.titles] : [];
  const titles = [...new Set(raw.map(String))].filter((t) => NEWSLETTER_SLUGS.includes(t));
  if (!titles.length) return { error: "Please choose at least one newsletter." };
  const utm = Object.fromEntries(UTM.map((k) => [k, s(k, 200)]));
  return {
    input: {
      email,
      name: s("name", 200),
      company: s("company", 200),
      role: s("role", 120),
      country: s("country", 100),
      page_url: s("page_url", 500),
      // Where the signup box sat ("answers/<slug>", "issue/<title>/<date>"…), kept in leads.details.source.
      source: /^[a-z0-9][a-z0-9/_.-]{0,159}$/.test(s("source", 160) || "") ? s("source", 160) : null,
      titles,
      utm,
    },
  };
}

// More than 6 signups/leads from one ip_hash in 10 minutes → limited (same rule as /api/lead).
export async function rateLimited(sql, hash) {
  const [r] = await sql.query(
    `select count(*)::int n from leads where ip_hash=$1 and created_at > now() - interval '10 minutes'`, [hash]);
  return (r?.n || 0) >= 6;
}

// One leads row (type newsletter) + one subscriptions row per title. Titles already confirmed for this email are left
// alone; pending/unsubscribed/bounced ones go back to pending with the new confirm token. Complaints are never
// re-subscribed. Sends ONE opt-in mail listing the titles that need confirming.
// sendMail({to, subject, html, text}) → messageId|null. Returns {ok, ref, token, pending:[slugs], already:[slugs]}.
export async function subscribe(sql, input, { ipHash: hash = null, sendMail } = {}) {
  const ref = makeRef();
  const token = rand(24);
  const email = input.email;
  const [lead] = await sql.query(
    `insert into leads (ref, type, page_url, name, company, email, country, details,
       utm_source, utm_medium, utm_campaign, utm_term, utm_content, ip_hash, confirm_token)
     values ($1,'newsletter',$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,$13,$14) returning id`,
    [ref, input.page_url, input.name, input.company, email, input.country,
      JSON.stringify({ titles: input.titles, role: input.role, ...(input.source ? { source: input.source } : {}) }),
      input.utm?.utm_source ?? null, input.utm?.utm_medium ?? null, input.utm?.utm_campaign ?? null,
      input.utm?.utm_term ?? null, input.utm?.utm_content ?? null, hash, token]);

  const existing = await sql.query(
    `select id, newsletter, status from subscriptions where lower(email)=lower($1) and newsletter = any($2::text[])`,
    [email, input.titles]);
  const by = new Map(existing.map((r) => [r.newsletter, r]));
  const pending = [];
  const already = [];
  for (const t of input.titles) {
    const row = by.get(t);
    if (row?.status === "confirmed") { already.push(t); continue; }
    if (row?.status === "complained") continue; // marked our mail as spam: never mail again from a web form
    if (row) {
      await sql.query(
        `update subscriptions set status='pending', confirm_token=$2, lead_id=$3, source_page=coalesce($4, source_page) where id=$1`,
        [row.id, token, lead.id, input.page_url]);
    } else {
      await sql.query(
        `insert into subscriptions (email, newsletter, lead_id, status, confirm_token, unsub_token, source_page)
         values ($1,$2,$3,'pending',$4,$5,$6) on conflict (lower(email), newsletter)
         do update set status='pending', confirm_token=excluded.confirm_token, lead_id=excluded.lead_id
         where subscriptions.status not in ('confirmed','complained')`,
        [email, t, lead.id, token, rand(32), input.page_url]);
    }
    pending.push(t);
  }

  if (pending.length && sendMail) {
    try {
      const mail = optInMail(pending, token);
      const mid = await sendMail({ to: email, ...mail });
      if (mid) await sql.query(`update leads set mail_message_id=$2 where id=$1`, [lead.id, mid]);
    } catch (e) {
      console.error("newsletter_optin_mail_failed", ref, e?.message); // row is saved; never shown as a failed signup
    }
  }
  return { ok: true, ref, leadId: lead.id, token, pending, already };
}

export function optInMail(slugs, token) {
  const ns = slugs.map(bySlug).filter(Boolean);
  const link = confirmUrl(token);
  const names = ns.map((n) => n.name);
  const subject = ns.length === 1 ? `Confirm: ${ns[0].name}` : "Confirm your Potatopedia newsletters";
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"></head>
<body style="margin:0;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#1a1a1a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px"><tr><td>
<p style="margin:0 0 12px">Please confirm you want ${ns.length === 1 ? "this newsletter" : "these newsletters"} from Potatopedia:</p>
<ul style="margin:0 0 16px;padding-left:20px">${ns.map((n) => `<li style="margin:0 0 6px"><b>${esc(n.name)}</b> (${esc(n.cadenceLabel)})</li>`).join("")}</ul>
<p style="margin:0 0 20px"><a href="${link}" style="display:inline-block;background:#C62828;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:6px">Yes, subscribe me</a></p>
<p style="margin:0 0 8px;font-size:14px;color:#555555">Or open this link: <a href="${link}" style="color:#C62828">${link}</a></p>
<p style="margin:0 0 8px;font-size:14px;color:#555555">If you did not ask for this, ignore this mail and nothing will be sent.</p>
<p style="margin:16px 0 0;font-size:13px;color:#777777">Potatopedia · Questions? Reply to this mail.</p>
</td></tr></table></body></html>`;
  const text = `Please confirm you want ${ns.length === 1 ? "this newsletter" : "these newsletters"} from Potatopedia:\n\n${ns
    .map((n) => `- ${n.name} (${n.cadenceLabel})`).join("\n")}\n\nYes, subscribe me: ${link}\n\nIf you did not ask for this, ignore this mail and nothing will be sent.\n\nPotatopedia`;
  return { subject, html, text, names };
}

/* ------------------------------------------------------------------ confirm */

// Confirms every pending subscription sharing the token (and stamps the leads row). Returns the confirmed slugs.
export async function confirmSubscription(sql, token) {
  if (!CONFIRM_RE.test(token || "")) return [];
  const rows = await sql.query(
    `update subscriptions set status='confirmed', confirmed_at=now()
     where confirm_token=$1 and status='pending' returning newsletter`, [token]);
  if (rows.length) {
    await sql.query(`update leads set confirmed_at=coalesce(confirmed_at, now()) where type='newsletter' and confirm_token=$1`, [token]);
    return rows.map((r) => r.newsletter);
  }
  // Second click on the same link: still a success page, nothing changes.
  const again = await sql.query(`select newsletter from subscriptions where confirm_token=$1 and status='confirmed'`, [token]);
  return again.map((r) => r.newsletter);
}

/* -------------------------------------------------------------- unsubscribe */

// The subscription behind an unsub token plus every subscription of the same email (for the manage page).
export async function unsubLookup(sql, token) {
  if (!UNSUB_RE.test(token || "")) return null;
  const [sub] = await sql.query(`select id, email, newsletter, status from subscriptions where unsub_token=$1`, [token]);
  if (!sub) return null;
  const all = await sql.query(
    `select id, newsletter, status, unsub_token from subscriptions where lower(email)=lower($1) order by newsletter`, [sub.email]);
  return { sub, all };
}

// Unsubscribes one title (or every title of that email with all=true). Logs one email_events 'unsubscribe' per row.
// Returns the slugs that changed (already-unsubscribed rows are a no-op, so repeated POSTs are safe).
export async function unsubscribe(sql, token, { all = false, issueId = null } = {}) {
  if (!UNSUB_RE.test(token || "")) return null;
  const [sub] = await sql.query(`select id, email from subscriptions where unsub_token=$1`, [token]);
  if (!sub) return null;
  const rows = all
    ? await sql.query(
        `update subscriptions set status='unsubscribed', unsubscribed_at=now(), confirm_token=null
         where lower(email)=lower($1) and status in ('pending','confirmed') returning id, newsletter`, [sub.email])
    : await sql.query(
        `update subscriptions set status='unsubscribed', unsubscribed_at=now(), confirm_token=null
         where id=$1 and status in ('pending','confirmed') returning id, newsletter`, [sub.id]);
  const iid = Number.isSafeInteger(Number(issueId)) && Number(issueId) > 0 ? Number(issueId) : null;
  for (const r of rows) {
    await sql.query(
      `insert into email_events (message_id, issue_id, event, raw) values ($1,$2,'unsubscribe',$3::jsonb)`,
      [`unsub:${r.id}`, iid, JSON.stringify({ subscription_id: r.id, newsletter: r.newsletter, all })]);
  }
  return rows.map((r) => r.newsletter);
}

/* ------------------------------------------------------------------ publish */

const dateStr = (d) => (typeof d === "string" ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10));

// YES NL → publish: issue items become published news pages, the issue is approved + published.
// Returns {error, status} or {ok, issue, paths, urls}. The route revalidates `paths` and pings IndexNow with `urls`.
export async function publishIssue(sql, issueId) {
  const id = Number(issueId);
  if (!Number.isSafeInteger(id) || id <= 0) return { error: "issue_id required", status: 400 };
  const [issue] = await sql.query(`select * from issues where id=$1`, [id]);
  if (!issue) return { error: "Issue not found", status: 404 };
  if (issue.dry_run) return { error: "Dry-run issues are never published", status: 409 };
  if (!["preview", "approved", "sending", "sent"].includes(issue.status)) {
    return { error: `Issue status is ${issue.status}; only preview/approved issues can be published`, status: 409 };
  }
  const ids = [issue.lead_item_id, ...(issue.item_ids || [])].filter(Boolean).map(Number);
  // pub_year/pub_month come from the issue date so URLs are stable; set once, never changed.
  const d = dateStr(issue.issue_date);
  const items = ids.length
    ? await sql.query(
        `update news_items set status='published',
           pub_year=coalesce(pub_year, $2::int), pub_month=coalesce(pub_month, $3::int),
           published_at=coalesce(published_at, now()), updated_at=now()
         where id = any($1::bigint[]) and status in ('draft','approved','published')
         returning id, newsletter, slug, pub_year, pub_month, hub`,
        [ids, Number(d.slice(0, 4)), Number(d.slice(5, 7))])
    : [];
  const [upd] = await sql.query(
    `update issues set status=case when status='preview' then 'approved' else status end,
       approved_at=coalesce(approved_at, now()), published_at=coalesce(published_at, now())
     where id=$1 returning *`, [id]);
  const n = bySlug(upd.newsletter);
  const hubs = new Set(items.map((i) => NEWSLETTERS.find((x) => x.hub === i.hub)?.hubHref).filter(Boolean));
  if (n?.hubHref) hubs.add(n.hubHref);
  const pagePaths = [...items.map(newsHref), issueHref(upd), `/newsletters/${upd.newsletter}`];
  const paths = [...new Set(["/", "/news", "/newsletters", ...pagePaths, ...hubs, "/news-sitemap.xml", "/sitemap.xml", "/llms.txt"])];
  return { ok: true, issue: upd, items, paths, urls: [...new Set([...pagePaths, "/news", ...hubs])].map((p) => SITE + p) };
}

/* --------------------------------------------------------------------- send */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Sends one batch of an approved issue. Idempotent: each recipient is claimed in email_sends (unique issue+subscription)
// BEFORE the mail goes out, so a retried or parallel call never mails anyone twice.
// render(sub) → {subject, html, text, unsubUrl}; sendEmail({to, subject, html, text, unsubUrl, issue}) → messageId.
// opts: limit (≤1000), perSecond (≤12), emailLike (selftest only: restrict recipients), testTo (single test copy).
export async function sendIssue(sql, issueId, { limit = 400, perSecond = 12, testTo = null, emailLike = null, render, sendEmail } = {}) {
  const id = Number(issueId);
  if (!Number.isSafeInteger(id) || id <= 0) return { error: "issue_id required", status: 400 };
  const [issue] = await sql.query(`select * from issues where id=$1`, [id]);
  if (!issue) return { error: "Issue not found", status: 404 };

  if (testTo) {
    if (!EMAIL_RE.test(testTo)) return { error: "test_to is not a valid email", status: 400 };
    const m = await render(issue, null);
    const mid = await sendEmail({ to: testTo, ...m, subject: `[TEST] ${m.subject}`, issue });
    return { ok: true, test: true, sent: 1, failed: 0, remaining: null, message_id: mid || null };
  }
  if (issue.dry_run) return { error: "Dry-run issues are never sent (use test_to for a test copy)", status: 409 };
  if (issue.status === "sent") return { ok: true, sent: 0, failed: 0, remaining: 0, note: "already sent" };
  if (!["approved", "sending"].includes(issue.status)) {
    return { error: `Issue status is ${issue.status}; only approved issues are sent (YES NL first)`, status: 409 };
  }
  if (!issue.published_at) return { error: "Publish the issue first (POST /api/newsletters/publish)", status: 409 };

  await sql.query(`update issues set status='sending' where id=$1 and status='approved'`, [id]);
  const cap = Math.max(1, Math.min(1000, Number(limit) || 400));
  const rate = Math.max(1, Math.min(12, Number(perSecond) || 12));
  const recipients = await sql.query(
    `select s.id, s.email, s.unsub_token from subscriptions s
     where s.newsletter=$1 and s.status='confirmed'
       and ($3::text is null or s.email like $3)
       and not exists (select 1 from email_sends e where e.issue_id=$2 and e.subscription_id=s.id)
     order by s.id limit $4`, [issue.newsletter, id, emailLike, cap]);

  let sent = 0;
  let failed = 0;
  for (let i = 0; i < recipients.length; i += rate) {
    const started = Date.now();
    await Promise.all(recipients.slice(i, i + rate).map(async (sub) => {
      const claim = await sql.query(
        `insert into email_sends (issue_id, subscription_id, status) values ($1,$2,'sent')
         on conflict (issue_id, subscription_id) do nothing returning id`, [id, sub.id]);
      if (!claim.length) return; // another run already has this recipient
      try {
        const m = await render(issue, sub);
        const mid = await sendEmail({ to: sub.email, ...m, issue });
        await sql.query(`update email_sends set message_id=$2, sent_at=now() where id=$1`, [claim[0].id, mid || null]);
        sent++;
      } catch (e) {
        await sql.query(`update email_sends set status='failed', error=$2 where id=$1`, [claim[0].id, String(e?.message || e).slice(0, 500)]);
        failed++;
      }
    }));
    const wait = 1000 - (Date.now() - started);
    if (i + rate < recipients.length && wait > 0) await sleep(wait);
  }

  const [{ remaining }] = await sql.query(
    `select count(*)::int remaining from subscriptions s where s.newsletter=$1 and s.status='confirmed'
       and ($3::text is null or s.email like $3)
       and not exists (select 1 from email_sends e where e.issue_id=$2 and e.subscription_id=s.id)`,
    [issue.newsletter, id, emailLike]);
  const [stats] = await sql.query(
    `select count(*)::int recipients, count(*) filter (where status='sent')::int sent, count(*) filter (where status='failed')::int failed
     from email_sends where issue_id=$1`, [id]);
  await sql.query(
    remaining === 0
      ? `update issues set send_stats=$2::jsonb, status='sent', sent_at=coalesce(sent_at, now()) where id=$1`
      : `update issues set send_stats=$2::jsonb where id=$1`,
    [id, JSON.stringify(stats)]);
  return { ok: true, sent, failed, remaining };
}

/* --------------------------------------------------------------- SES events */

const EVENT = { Delivery: "delivery", Open: "open", Click: "click", Bounce: "bounce", Complaint: "complaint", Send: "send", Reject: "reject", DeliveryDelay: "delivery_delay", RenderingFailure: "rendering_failure" };

// One SES event (the parsed SNS Message) → email_events; permanent bounces and complaints stop that subscription.
export async function recordSesEvent(sql, ev) {
  const type = ev?.eventType || ev?.notificationType;
  const event = EVENT[type];
  const mail = ev?.mail || {};
  if (!event || !mail.messageId) return { skipped: true };
  if (event === "send") return { skipped: true }; // every mail has one; not worth a row
  const tagId = Number(mail.tags?.issue_id?.[0]);
  let issueId = Number.isSafeInteger(tagId) && tagId > 0 ? tagId : null;
  const [send] = await sql.query(`select issue_id, subscription_id from email_sends where message_id=$1`, [mail.messageId]);
  if (!issueId && send) issueId = Number(send.issue_id);
  const url = event === "click" ? String(ev.click?.link || "").slice(0, 1000) || null : null;
  const raw = { eventType: type, tags: mail.tags || null, timestamp: mail.timestamp || null };
  if (ev.bounce) raw.bounce = { bounceType: ev.bounce.bounceType, bounceSubType: ev.bounce.bounceSubType };
  if (ev.complaint) raw.complaint = { complaintFeedbackType: ev.complaint.complaintFeedbackType || null };
  if (ev.open) raw.open = { userAgent: String(ev.open.userAgent || "").slice(0, 200) };
  if (ev.click) raw.click = { userAgent: String(ev.click.userAgent || "").slice(0, 200) };
  const at = ev.delivery?.timestamp || ev.open?.timestamp || ev.click?.timestamp || ev.bounce?.timestamp || ev.complaint?.timestamp || null;
  await sql.query(
    `insert into email_events (at, message_id, issue_id, event, url, raw) values (coalesce($1::timestamptz, now()),$2,$3,$4,$5,$6::jsonb)`,
    [at, mail.messageId, issueId, event, url, JSON.stringify(raw)]);

  let stopped = 0;
  const stop = event === "complaint" ? "complained" : event === "bounce" && ev.bounce?.bounceType === "Permanent" ? "bounced" : null;
  if (stop) {
    if (send) {
      const r = await sql.query(`update subscriptions set status=$2 where id=$1 and status in ('pending','confirmed') returning id`, [send.subscription_id, stop]);
      stopped = r.length;
    } else {
      // Not a newsletter send we know (e.g. the opt-in mail): match by address + newsletter tag when present.
      const who = (ev.bounce?.bouncedRecipients || ev.complaint?.complainedRecipients || []).map((x) => x.emailAddress).filter(Boolean);
      const title = mail.tags?.newsletter?.[0] || null;
      for (const e of who) {
        const r = await sql.query(
          `update subscriptions set status=$2 where lower(email)=lower($1) and ($3::text is null or newsletter=$3)
           and status in ('pending','confirmed') returning id`, [e, stop, title]);
        stopped += r.length;
      }
    }
  }
  return { event, issueId, stopped };
}

/* ---------------------------------------------------- SNS message signatures */

// https://docs.aws.amazon.com/sns/latest/dg/sns-verify-signature-of-message.html
const SIGN_KEYS = {
  Notification: ["Message", "MessageId", "Subject", "Timestamp", "TopicArn", "Type"],
  SubscriptionConfirmation: ["Message", "MessageId", "SubscribeURL", "Timestamp", "Token", "TopicArn", "Type"],
  UnsubscribeConfirmation: ["Message", "MessageId", "SubscribeURL", "Timestamp", "Token", "TopicArn", "Type"],
};
export function snsStringToSign(msg) {
  const keys = SIGN_KEYS[msg?.Type];
  if (!keys) return null;
  return keys.filter((k) => msg[k] !== undefined && msg[k] !== null).map((k) => `${k}\n${msg[k]}\n`).join("");
}
export const snsHostOk = (url, region) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === `sns.${region}.amazonaws.com`;
  } catch { return false; }
};
export const snsCertUrlOk = (url, region) => snsHostOk(url, region) && /^\/[A-Za-z0-9._\-/]+\.pem$/.test(new URL(url).pathname);

export function verifySnsSignature(msg, certPem) {
  const str = snsStringToSign(msg);
  if (!str || !msg.Signature) return false;
  const algo = String(msg.SignatureVersion) === "2" ? "RSA-SHA256" : String(msg.SignatureVersion) === "1" ? "RSA-SHA1" : null;
  if (!algo) return false;
  try {
    const v = createVerify(algo);
    v.update(str, "utf8");
    return v.verify(certPem, msg.Signature, "base64");
  } catch { return false; }
}

/* ---------------------------------------------------------------- secrets */

// Internal routes: header x-newsletter-secret must equal NEWSLETTER_API_SECRET (closed while the env is unset).
export function secretOk(req) {
  const want = process.env.NEWSLETTER_API_SECRET;
  const got = req.headers.get("x-newsletter-secret") || "";
  if (!want || want.length < 16 || got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i++) diff |= want.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}
