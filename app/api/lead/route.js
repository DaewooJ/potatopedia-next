import { neon } from "@neondatabase/serverless";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { LEAD_TYPES, LEAD_DETAILS, REPORT_ROLES, emailType } from "@/lib/leads";
import { signReportToken } from "@/lib/report-token";
import REPORTS from "@/lib/reports-manifest.json";
import { COUNTRIES } from "@/lib/data";

// Every Potatopedia lead: (1) saved to Neon `leads` first so nothing is lost if mail fails,
// (2) mailed by Amazon SES to LEAD_TO (hi@potatopedia.com), (3) answered with a ref PP-<ddmmyy>-<4>.
// Newsletter signups get a double opt-in mail; confirmed at /api/lead/confirm.
// Env: DATABASE_URL, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, SES_REGION (ap-southeast-2), LEAD_FROM, LEAD_TO.
// Mail is skipped (not an error) while the SES env is unset; the row is still stored.

const CORE = { name: 200, company: 200, email: 200, country: 100, message: 3000, page_url: 500 };
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const hits = new Map();
let ses = null;

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

function rand(n) {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => a[b % 32]).join("");
}

function makeRef() {
  const d = new Date();
  const dmy = [d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear() % 100].map((x) => String(x).padStart(2, "0")).join("");
  return `PP-${dmy}-${rand(4)}`;
}

async function ipHash(ip) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`pp:${ip}`));
  return Array.from(new Uint8Array(buf).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function sesClient() {
  if (!process.env.SES_ACCESS_KEY_ID || !process.env.LEAD_FROM) return null;
  if (!ses) {
    ses = new SESv2Client({
      region: process.env.SES_REGION || "ap-southeast-2",
      credentials: { accessKeyId: process.env.SES_ACCESS_KEY_ID, secretAccessKey: process.env.SES_SECRET_ACCESS_KEY },
    });
  }
  return ses;
}

async function send(to, subject, html, replyTo) {
  const client = sesClient();
  if (!client) return null;
  const out = await client.send(
    new SendEmailCommand({
      FromEmailAddress: process.env.LEAD_FROM,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
      Content: { Simple: { Subject: { Data: subject }, Body: { Html: { Data: html } } } },
    }),
  );
  return out.MessageId || null;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  if (body.website_url) return Response.json({ ref: makeRef() }); // honeypot
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return Response.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });

  const type = String(body.type || "");
  if (!LEAD_TYPES[type]) return Response.json({ error: "Bad request" }, { status: 400 });

  const row = {};
  for (const [k, max] of Object.entries(CORE)) {
    const v = body[k];
    if (typeof v === "string" && v.trim()) row[k] = v.trim().slice(0, max);
  }
  if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(row.email)) {
    return Response.json({ error: "Please give a valid work email." }, { status: 400 });
  }
  if (type !== "newsletter" && !row.name) return Response.json({ error: "Please give your name." }, { status: 400 });

  const details = {};
  for (const k of LEAD_DETAILS[type]) {
    const v = body[k];
    if (typeof v === "string" && v.trim()) details[k] = v.trim().slice(0, 300);
  }
  let reportSlug = null;
  if (type === "report_download") {
    if (process.env.REPORT_GATE_LIVE !== "true" || !process.env.REPORT_LINK_SECRET) {
      return Response.json({ error: "Report downloads are not open yet." }, { status: 503 });
    }
    reportSlug = COUNTRIES.find((c) => c.slug === details.report)?.slug;
    if (!reportSlug) return Response.json({ error: "Unknown report." }, { status: 400 });
    if (!row.company) return Response.json({ error: "Please give your company." }, { status: 400 });
    if (!row.country) return Response.json({ error: "Please give your country." }, { status: 400 });
    if (!REPORT_ROLES.includes(details.role)) return Response.json({ error: "Please choose your role." }, { status: 400 });
    if (body.privacy_ok !== true && body.privacy_ok !== "on") {
      return Response.json({ error: "Please agree to the privacy policy." }, { status: 400 });
    }
    details.company = row.company;
    details.consent_partners = body.consent_partners === true || body.consent_partners === "on";
    details.email_type = emailType(row.email);
  }
  const utm = Object.fromEntries(UTM.map((k) => [k, typeof body[k] === "string" ? body[k].slice(0, 200) : null]));
  const ref = makeRef();
  const token = type === "newsletter" ? rand(24) : null;

  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql`insert into leads (ref, type, page_url, name, company, email, country, message, details,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content, ip_hash, confirm_token)
      values (${ref}, ${type}, ${row.page_url || null}, ${row.name || null}, ${row.company || null}, ${row.email},
      ${row.country || null}, ${row.message || null}, ${JSON.stringify(details)}::jsonb,
      ${utm.utm_source}, ${utm.utm_medium}, ${utm.utm_campaign}, ${utm.utm_term}, ${utm.utm_content},
      ${await ipHash(ip)}, ${token})`;
  } catch (e) {
    console.error("lead_insert_failed", e?.message);
    return Response.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }

  let mailOk = true;
  // Mail after the row is safe. A mail failure is logged, never shown as a failed submit.
  try {
    let messageId = null;
    if (type === "newsletter") {
      const link = `https://www.potatopedia.com/api/lead/confirm?token=${token}`;
      const saved = details.saved_question
        ? `<p>The answer you saved: <a href="https://www.potatopedia.com/ask?q=${encodeURIComponent(details.saved_question)}">${esc(details.saved_question)}</a></p>`
        : "";
      messageId = await send(
        row.email,
        details.saved_question ? "Your saved Potatopedia answer" : "Confirm your Potatopedia newsletter signup",
        `${saved}<p>Please confirm you want The Potato Week from Potatopedia, one useful digest a week.</p><p><a href="${link}">Yes, subscribe me</a></p><p>If you did not ask for this, ignore this mail.</p>`,
      );
    } else {
      if (type === "report_download") {
        const link = `https://www.potatopedia.com/api/report/${signReportToken({ ref, slug: reportSlug })}`;
        const mid = await send(
          row.email,
          "Your Potatopedia country report",
          REPORTS[reportSlug]
            ? `<p>Hello ${esc(row.name)},</p><p>Thank you for your interest. Download your report here (valid for 7 days):</p><p><a href="${link}">${esc(REPORTS[reportSlug].name)} Potato Market Report (PDF, ${REPORTS[reportSlug].pages} pages)</a></p><p>If you did not ask for this, ignore this mail.</p><p>Potatopedia</p>`
            : `<p>Hello ${esc(row.name)},</p><p>Thank you for your interest. Open your report here (valid for 7 days):</p><p><a href="${link}">Get the ${esc(reportSlug)} country report</a></p><p>The link opens the country page ready to save as PDF. If you did not ask for this, ignore this mail.</p><p>Potatopedia</p>`,
        );
        await sql`update leads set mail_message_id = ${mid} where ref = ${ref}`;
      }
      const lines = { Type: LEAD_TYPES[type], ...row, ...details };
      const html = `<h2>${esc(LEAD_TYPES[type])} · ${esc(row.country || "country not given")}</h2><table>${Object.entries(lines)
        .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`)
        .join("")}</table><p>Ref ${ref}</p>`;
      messageId = await send(
        process.env.LEAD_TO || "hi@potatopedia.com",
        `Potatopedia lead · ${type} · ${row.country || "–"}`,
        html,
        row.email,
      );
    }
    if (messageId) await sql`update leads set mail_message_id = ${messageId} where ref = ${ref}`;
  } catch (e) {
    mailOk = false;
    console.error("lead_mail_failed", ref, e?.message);
  }

  return Response.json(type === "report_download" ? { ref, sent: mailOk } : { ref });
}
