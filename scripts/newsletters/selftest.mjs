// Newsletter email-side selftest (13 Nov 2026). Runs the real write logic (lib/news-write.js) against the real Neon DB
// with mail stubbed out (nothing is sent, SES is never called), renders a sample issue email, then DELETES every row it
// created. Usage: node --env-file=.env.local scripts/newsletters/selftest.mjs
// Output: scripts/newsletters/out/sample.html + sample.txt (gitignored).
import { mkdirSync, writeFileSync } from "node:fs";
import { generateKeyPairSync, createSign } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import {
  parseSubscribe, subscribe, confirmSubscription, unsubLookup, unsubscribe, publishIssue, sendIssue, recordSesEvent,
  snsStringToSign, verifySnsSignature, snsCertUrlOk, snsHostOk, optInMail, rand, unsubUrl, manageUrl,
} from "../../lib/news-write.js";
import { renderIssueEmail } from "../../lib/newsletter-email.js";
import { NEWSLETTERS, bySlug } from "../../lib/newsletters.js";

if (!process.env.DATABASE_URL) { console.error("DATABASE_URL missing (run with --env-file=.env.local)"); process.exit(2); }
const sql = neon(process.env.DATABASE_URL);
const tag = rand(8).toLowerCase();
const email = `selftest+${tag}@example.com`;
const [T1, T2, T3] = NEWSLETTERS.map((n) => n.slug);
const issueIds = [];
const fakeMids = [];
let pass = 0;
let fail = 0;
const ok = (cond, label) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); } else { fail++; console.log(`  FAIL ${label}`); }
};

async function cleanup() {
  const subs = await sql.query(`select id from subscriptions where lower(email)=lower($1)`, [email]);
  const subIds = subs.map((s) => Number(s.id));
  const r = {};
  r.events = (await sql.query(
    `delete from email_events where message_id = any($1::text[]) or message_id = any($2::text[]) or issue_id = any($3::bigint[]) returning id`,
    [fakeMids, subIds.map((i) => `unsub:${i}`), issueIds])).length;
  r.sends = (await sql.query(`delete from email_sends where issue_id = any($1::bigint[]) or subscription_id = any($2::bigint[]) returning id`, [issueIds, subIds])).length;
  r.issues = (await sql.query(`delete from issues where id = any($1::bigint[]) returning id`, [issueIds])).length;
  r.subscriptions = (await sql.query(`delete from subscriptions where id = any($1::bigint[]) returning id`, [subIds])).length;
  r.leads = (await sql.query(`delete from leads where lower(email)=lower($1) returning id`, [email])).length;
  const left = await sql.query(
    `select (select count(*) from subscriptions where lower(email)=lower($1))::int s, (select count(*) from leads where lower(email)=lower($1))::int l,
            (select count(*) from issues where id = any($2::bigint[]))::int i`, [email, issueIds]);
  return { deleted: r, left: left[0] };
}

try {
  console.log(`Selftest ${email}`);

  console.log("parse");
  ok(parseSubscribe({ email: "nope", titles: [T1] }).error, "rejects a bad email");
  ok(parseSubscribe({ email, titles: ["the-potato-week"] }).error, "rejects unknown titles");
  const { input } = parseSubscribe({ email, name: "Self Test", company: "Example", role: "Other", country: "India", titles: [T1, T2, "bogus"], page_url: "/newsletters", utm_source: "selftest" });
  ok(input && input.titles.length === 2, "keeps only known titles");

  console.log("subscribe");
  const mails = [];
  const stubMail = async (m) => { mails.push(m); return null; };
  const s1 = await subscribe(sql, input, { ipHash: "selftest", sendMail: stubMail });
  ok(s1.ok && s1.pending.length === 2, "two pending titles");
  ok(mails.length === 1 && mails[0].text.includes(bySlug(T1).name) && mails[0].text.includes(bySlug(T2).name), "ONE opt-in mail listing both titles");
  ok(mails[0].html.includes(`/api/newsletters/confirm?t=${s1.token}`), "opt-in mail carries the confirm link");
  const [lead] = await sql.query(`select type, details from leads where id=$1`, [s1.leadId]);
  ok(lead.type === "newsletter" && lead.details.titles.length === 2 && lead.details.role === "Other", "leads row type newsletter with details {titles, role}");
  const rows = await sql.query(`select newsletter, status from subscriptions where lower(email)=lower($1)`, [email]);
  ok(rows.length === 2 && rows.every((r) => r.status === "pending"), "two subscriptions rows, pending");

  console.log("confirm");
  ok((await confirmSubscription(sql, "BADTOKEN")).length === 0, "bad token confirms nothing");
  ok((await confirmSubscription(sql, s1.token)).length === 2, "token confirms both titles");
  ok((await confirmSubscription(sql, s1.token)).length === 2, "second click is still a success (idempotent)");

  console.log("add a title later");
  const s2 = await subscribe(sql, parseSubscribe({ email, titles: [T1, T3] }).input, { sendMail: stubMail });
  ok(s2.pending.length === 1 && s2.pending[0] === T3 && s2.already[0] === T1, "confirmed title untouched, new title pending");
  ok(mails.length === 2 && mails[1].text.includes(bySlug(T3).name) && !mails[1].text.includes(bySlug(T1).name), "second opt-in mail lists only the new title");
  await confirmSubscription(sql, s2.token);

  console.log("unsubscribe");
  const [sub1] = await sql.query(`select * from subscriptions where lower(email)=lower($1) and newsletter=$2`, [email, T1]);
  const look = await unsubLookup(sql, sub1.unsub_token);
  ok(look && look.sub.newsletter === T1 && look.all.length === 3, "lookup finds the title and all 3 rows (manage page)");
  ok((await unsubLookup(sql, "X".repeat(32))) === null, "unknown token → null");
  ok((await unsubscribe(sql, sub1.unsub_token, { issueId: null }))?.length === 1, "one-click unsubscribes one title");
  ok((await unsubscribe(sql, sub1.unsub_token))?.length === 0, "repeat POST is a no-op");
  ok((await unsubscribe(sql, sub1.unsub_token, { all: true }))?.length === 2, "unsubscribe from all stops the other 2");
  const ev = await sql.query(`select count(*)::int n from email_events where event='unsubscribe' and message_id like 'unsub:%' and (raw->>'subscription_id')::bigint in (select id from subscriptions where lower(email)=lower($1))`, [email]);
  ok(ev[0].n === 3, "3 unsubscribe events logged");

  console.log("resubscribe for the send test");
  const s3 = await subscribe(sql, parseSubscribe({ email, titles: [T1] }).input, { sendMail: stubMail });
  ok(s3.pending[0] === T1, "unsubscribed title goes back to pending");
  await confirmSubscription(sql, s3.token);

  console.log("publish + send (stubbed SES)");
  const n0 = 90000 + Math.floor(Math.random() * 9000);
  const [dry] = await sql.query(
    `insert into issues (newsletter, issue_no, issue_date, dry_run, subject, status, preview_token) values ($1,$2,$3,true,'Selftest dry run','preview',$4) returning id`,
    [T1, n0, `2099-01-${String(1 + Math.floor(Math.random() * 27)).padStart(2, "0")}`, rand(24)]);
  issueIds.push(Number(dry.id));
  const [real] = await sql.query(
    `insert into issues (newsletter, issue_no, issue_date, dry_run, subject, status, preview_token) values ($1,$2,$3,false,'Selftest issue','preview',$4) returning id`,
    [T1, n0 + 1, `2099-02-${String(1 + Math.floor(Math.random() * 27)).padStart(2, "0")}`, rand(24)]);
  issueIds.push(Number(real.id));
  ok((await publishIssue(sql, dry.id)).status === 409, "publish refuses a dry run");
  const sent = [];
  const stubSend = async (m) => { const mid = `selftest-${tag}-${sent.length}`; sent.push(m); fakeMids.push(mid); return mid; };
  const render = async (iss, sub) => ({ subject: iss.subject, html: "<p>x</p>", text: "x", unsubUrl: sub ? unsubUrl(sub.unsub_token, iss.id) : null });
  const opts = { render, sendEmail: stubSend, emailLike: email };
  ok((await sendIssue(sql, real.id, opts)).status === 409, "send refuses an unapproved issue");
  ok((await sendIssue(sql, dry.id, opts)).status === 409, "send refuses a dry run");
  const t = await sendIssue(sql, dry.id, { ...opts, testTo: "hi@example.com" });
  ok(t.ok && t.test && sent.at(-1).to === "hi@example.com" && sent.at(-1).subject.startsWith("[TEST]"), "dry run + test_to → one [TEST] copy");
  const p = await publishIssue(sql, real.id);
  ok(p.ok && p.issue.status === "approved" && p.paths.includes("/news") && p.urls.every((u) => u.startsWith("https://www.potatopedia.com/")), "publish approves + lists paths/IndexNow URLs");
  const r1 = await sendIssue(sql, real.id, opts);
  ok(r1.ok && r1.sent === 1 && r1.failed === 0 && r1.remaining === 0, `send batch: ${JSON.stringify(r1)}`);
  ok(sent.at(-1).to === email && sent.at(-1).unsubUrl.includes(sub1.unsub_token), "mail went to the test address with its own unsub link");
  const r2 = await sendIssue(sql, real.id, opts);
  ok(r2.ok && r2.sent === 0 && r2.remaining === 0, "second call sends nothing (idempotent)");
  const [iss] = await sql.query(`select status, send_stats from issues where id=$1`, [real.id]);
  ok(iss.status === "sent" && iss.send_stats.sent === 1, "issue marked sent with send_stats");

  console.log("SES events");
  const mid = fakeMids[fakeMids.length - 1];
  const mail = { messageId: mid, tags: { issue_id: [String(real.id)], newsletter: [T1] } };
  await recordSesEvent(sql, { eventType: "Delivery", mail, delivery: {} });
  await recordSesEvent(sql, { eventType: "Open", mail, open: { userAgent: "test" } });
  await recordSesEvent(sql, { eventType: "Click", mail, click: { link: "https://www.potatopedia.com/news/2099/02/x?utm_source=newsletter" } });
  const b = await recordSesEvent(sql, { eventType: "Bounce", mail, bounce: { bounceType: "Permanent", bouncedRecipients: [{ emailAddress: email }] } });
  ok(b.stopped === 1, "permanent bounce stops the subscription");
  const evs = await sql.query(`select event, issue_id from email_events where message_id=$1 order by id`, [mid]);
  ok(evs.map((e) => e.event).join(",") === "delivery,open,click,bounce" && evs.every((e) => Number(e.issue_id) === Number(real.id)), "events stored with issue_id from tags");
  const [st] = await sql.query(`select status from subscriptions where lower(email)=lower($1) and newsletter=$2`, [email, T1]);
  ok(st.status === "bounced", "subscription status bounced");

  console.log("SNS signature");
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const msg = { Type: "Notification", MessageId: "m1", TopicArn: "arn:aws:sns:ap-southeast-2:123:potatopedia-newsletter-events", Message: "{}", Timestamp: "2026-11-13T00:00:00Z", SignatureVersion: "2" };
  msg.Signature = createSign("RSA-SHA256").update(snsStringToSign(msg)).sign(privateKey, "base64");
  const pem = publicKey.export({ type: "spki", format: "pem" });
  ok(verifySnsSignature(msg, pem), "valid signature verifies");
  ok(!verifySnsSignature({ ...msg, Message: '{"x":1}' }, pem), "tampered message fails");
  ok(snsCertUrlOk("https://sns.ap-southeast-2.amazonaws.com/SimpleNotificationService-abc.pem", "ap-southeast-2"), "AWS cert URL accepted");
  ok(!snsCertUrlOk("https://sns.ap-southeast-2.amazonaws.com.evil.com/x.pem", "ap-southeast-2") && !snsCertUrlOk("http://sns.ap-southeast-2.amazonaws.com/x.pem", "ap-southeast-2"), "foreign/http cert URLs rejected");
  ok(!snsHostOk("https://evil.example/?sns.ap-southeast-2.amazonaws.com", "ap-southeast-2"), "foreign SubscribeURL rejected");

  console.log("render sample email");
  const n = bySlug(T1);
  const items = [
    { id: 1, slug: "sample-lead", pub_year: 2026, pub_month: 11, headline: "Sample lead story: a new fries line (test data)", summary: "This is test copy for the template only. It shows how a 40 to 60 word summary of a lead story looks in the email, with enough words to wrap over a few lines on a phone screen.", why_it_matters: "Test copy: the why-it-matters line sits under the summary.", image: { src: "/media/news-1-test0000.jpg", alt: "Test photo alt text", credit: "Photo: Test Credit, CC BY 4.0", licence: "CC BY 4.0" } },
    ...Array.from({ length: 7 }, (_, i) => ({ id: i + 2, slug: `sample-${i + 2}`, pub_year: 2026, pub_month: 11, headline: `Sample story ${i + 2} (test data)`, summary: "Test copy for the template. One or two lines of summary per story." })),
  ];
  const fakeIssue = {
    id: 0, newsletter: n.slug, issue_no: 1, issue_date: "2026-11-24", subject: "Sample: Potato Processing Weekly, Issue 01", preheader: "Test preheader text for the inbox preview.",
    intro: "Editor's note (test copy). This sample shows every block of the template with made-up placeholder text.",
    lead_item_id: 1, item_ids: items.slice(1).map((i) => i.id),
    number_of_week: { value: "123", unit: "units", label: "Placeholder figure (test data)", date: "Nov 2026", source_url: "https://www.fao.org/faostat/", chart: { type: "bar", labels: ["A", "B", "C", "D"], values: [123, 98, 75, 40] } },
    data_box: { title: "Data box (test data)", rows: [{ label: "Row one", value: "1.0" }, { label: "Row two", value: "2.0" }], source_url: "https://www.fao.org/faostat/", date: "Nov 2026" },
    spotlight: { kind: "expert", name: "Sample Expert", role: "Role", org: "Organisation", text: "Test copy for the spotlight block.", href: "/authors" },
    sponsor_slots: [{ slot: "presenting", label: "Launch partner", sponsor: "Example Co (test)", text: "Test copy for a launch-partner slot.", url: "https://example.com" }],
    events: [{ name: "Sample event (test)", dates: "1–3 Dec 2026", city: "City", country: "Country", url: "https://example.com" }],
    journal: { title: "From the Journal: sample post title", href: "/blog" },
    cover: { og: "/media/issue-0-og-test0000.jpg", sq: "/media/issue-0-sq-test0000.jpg", credit: "" },
  };
  const out = renderIssueEmail(fakeIssue, items, n, { unsubUrl: unsubUrl("X".repeat(32), 0), manageUrl: manageUrl("X".repeat(32)), webUrl: "https://www.potatopedia.com/issues/potato-processing-weekly/2026-11-24" });
  mkdirSync(new URL("./out/", import.meta.url), { recursive: true });
  writeFileSync(new URL("./out/sample.html", import.meta.url), out.html);
  writeFileSync(new URL("./out/sample.txt", import.meta.url), out.text);
  const classes = [...out.html.matchAll(/class="([^"]+)"/g)].map((m) => m[1]).join(" ");
  ok(!/ad-|banner|sponsor/i.test(classes), "no ad-/banner/sponsor class names");
  ok(out.html.includes("utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=potato-processing-weekly-2026-11-24"), "UTM tags on site links");
  ok(out.html.includes('rel="sponsored noopener"') && out.html.includes("Launch partner"), "launch partner labelled, rel=sponsored");
  ok(out.html.includes("This space: sponsor this newsletter"), "empty classified slot → sponsor link");
  ok(out.html.includes("prefers-color-scheme:dark") && out.html.includes('name="color-scheme"') && out.html.includes("<!--[if mso]>"), "dark mode + MSO conditionals present");
  ok(!/display:\s*(flex|grid)/i.test(out.html), "no flex/grid");
  ok(!/#(0[0-9a-f]8|2e7d32|388e3c|43a047|4caf50|00897b|009688|26a69a)/i.test(out.html), "no green/teal colors");
  ok(out.text.includes("Unsubscribe:") && out.text.includes("Potatopedia · Pune"), "plain text has unsubscribe + postal line");
  ok(out.html.includes('src="https://www.potatopedia.com/media/issue-0-og-test0000.jpg" width="600" alt="Potato Processing Weekly · by Potatopedia, Issue 01'), "cover image: absolute URL, width 600, alt text");
  ok(out.html.indexOf("issue-0-og-test0000") > out.html.indexOf("· by Potatopedia</p>") && out.html.indexOf("issue-0-og-test0000") < out.html.indexOf("Lead story"), "cover sits under the masthead, above the lead story");
  ok(out.html.includes('src="https://www.potatopedia.com/media/news-1-test0000.jpg" width="536" alt="Test photo alt text"') && out.html.includes("Photo: Test Credit, CC BY 4.0"), "lead photo with alt + credit line");
  ok(out.html.indexOf("news-1-test0000") < out.html.indexOf("<h1"), "lead photo above the lead headline");
  ok([...out.html.matchAll(/<img [^>]*>/g)].every((m) => /display:block/.test(m[0]) && / alt="/.test(m[0])), "every img has display:block + alt");
  const noImg = renderIssueEmail({ ...fakeIssue, cover: null }, items.map((i) => ({ ...i, image: null })), n, {});
  ok(!/<img /.test(noImg.html), "no cover / no image → no img tags (issue goes without images)");
  ok(optInMail([T1, T2, T3], "A".repeat(24)).names.length === 3, "opt-in mail renders for all three titles");
} catch (e) {
  fail++;
  console.error("ERROR", e);
} finally {
  const c = await cleanup();
  console.log("cleanup", JSON.stringify(c));
  if (c.left.s || c.left.l || c.left.i) { fail++; console.log("  FAIL rows left behind"); }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
