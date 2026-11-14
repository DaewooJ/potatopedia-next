// Newsletter issue email (13 Nov 2026). renderIssueEmail(issue, items, newsletter, {unsubUrl, manageUrl, webUrl})
// → {subject, html, text}. Table layout, inline CSS, 600 px. Outlook: MSO conditionals (fixed 600 px ghost table,
// Arial fallback, 96 dpi), no flex/grid, bars are table cells with fixed widths. Gmail/Apple Mail: inline styles carry
// the light look; a <style> block with prefers-color-scheme (+ Outlook.com [data-ogsc]) carries dark mode.
// Class names never contain ad-/banner/sponsor (ad blockers hide them). Accents come from lib/newsletters.js (never green).
// Relative imports only: plain node loads this in scripts/newsletters/selftest.mjs.
import { SITE, TRUST_LINE, POSTAL_LINE, masthead, issueLabel, newsHref, issueHref, fmtDate } from "./newsletters.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const FONT = "'Poppins', Arial, Helvetica, sans-serif";
const INK = "#1a1a1a";
const MUTED = "#555555";
const LINE = "#E6E6E6";
const PAPER = "#F4F4F2";

// Lighter accent for links and bars on a dark background (mix with white).
function lighten(hex, f = 0.45) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (255 - c) * f));
  return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

const isoDate = (d) => (typeof d === "string" ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10));

// UTM tags only on Potatopedia links (never on sponsor or source links, never on unsubscribe/manage).
export function withUtm(href, campaign) {
  if (!href) return href;
  const abs = href.startsWith("/") ? SITE + href : href;
  let u;
  try { u = new URL(abs); } catch { return href; }
  if (!/(^|\.)potatopedia\.com$/.test(u.hostname)) return abs;
  u.searchParams.set("utm_source", "newsletter");
  u.searchParams.set("utm_medium", "email");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

const safeUrl = (u) => {
  try { const x = new URL(u, SITE); return x.protocol === "https:" || x.protocol === "http:" ? x.toString() : null; } catch { return null; }
};

// Images (14 Nov 2026): covers + lead photos live at /media/<key>.jpg on potatopedia.com (absolute in mail).
// Each <img> has width/alt/display:block and styled alt text, so the mail still reads with images off.
const imgSrc = (p) => (typeof p === "string" && p ? safeUrl(p.startsWith("/") ? SITE + p : p) : null);
const imgTag = (src, alt, w) =>
  `<img src="${esc(src)}" width="${w}" alt="${esc(alt)}" style="display:block;width:100%;max-width:${w}px;height:auto;border:0;outline:none;text-decoration:none;font-family:${FONT};font-size:14px;line-height:1.4;color:${MUTED}">`;

export function renderIssueEmail(issue, items, newsletter, { unsubUrl, manageUrl, webUrl } = {}) {
  const n = newsletter;
  const accent = n.accent;
  const accentDark = lighten(accent);
  const date = isoDate(issue.issue_date);
  const campaign = `${n.slug}-${date}`;
  const site = (h) => esc(withUtm(h, campaign));
  const web = webUrl || SITE + issueHref(issue);
  const itemHref = (it) => (it.pub_year && it.pub_month ? newsHref(it) : web);
  const lead = items.find((i) => String(i.id) === String(issue.lead_item_id)) || null;
  const rest = items.filter((i) => i !== lead).slice(0, 10);
  const slots = Array.isArray(issue.sponsor_slots) ? issue.sponsor_slots : [];
  const presenting = slots.find((s) => s.slot === "presenting" && s.sponsor);
  const classified = slots.find((s) => s.slot === "classified" && s.sponsor);
  const subject = issue.subject || `${n.name} · ${issueLabel(issue.issue_no)}`;
  const pre = issue.preheader || issue.intro || "";

  const h2 = (t) => `<tr><td class="pp-pad" style="padding:28px 32px 8px;font-family:${FONT}"><h2 class="pp-text" style="margin:0;font-size:13px;line-height:1.4;letter-spacing:1px;text-transform:uppercase;color:${accent};font-weight:700"><span class="pp-acc">${esc(t)}</span></h2></td></tr>`;
  const label = (t) => `<span class="pp-muted" style="font-size:11px;letter-spacing:0.8px;text-transform:uppercase;color:${MUTED};font-weight:700">${esc(t)}</span>`;

  const slotBlock = (s) => {
    const url = safeUrl(s.url);
    const a = (inner) => (url ? `<a href="${esc(url)}" rel="sponsored noopener" target="_blank" class="pp-link" style="color:${accent};text-decoration:underline">${inner}</a>` : inner);
    const logo = s.logo && safeUrl(s.logo) ? `<img src="${esc(safeUrl(s.logo))}" alt="${esc(s.sponsor)}" width="120" style="display:block;border:0;max-width:120px;height:auto;margin:0 0 8px">` : "";
    return `<tr><td class="pp-pad" style="padding:16px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="pp-card" style="background:${PAPER};border:1px solid ${LINE};border-radius:8px"><tr><td style="padding:16px 18px;font-family:${FONT};font-size:14px;line-height:1.55;color:${INK}" class="pp-text">
${label(s.label === "Launch partner" ? "Launch partner" : "Sponsored")}<div style="height:8px;line-height:8px">&nbsp;</div>${logo}<b>${esc(s.sponsor)}</b>${s.text ? ` · ${esc(s.text)}` : ""}${url ? `<br>${a("Learn more")}` : ""}
</td></tr></table></td></tr>`;
  };
  const emptySlot = `<tr><td class="pp-pad" style="padding:12px 32px 0;font-family:${FONT};font-size:12px;color:${MUTED}"><a href="${site("/advertise#newsletters")}" class="pp-muted" style="color:${MUTED};text-decoration:underline">This space: sponsor this newsletter</a></td></tr>`;

  const coverSrc = imgSrc(issue.cover?.og);
  const coverAlt = `${masthead(n)}, ${issue.dry_run ? "dry run" : issueLabel(issue.issue_no)}, ${fmtDate(date)}${lead ? `: ${lead.headline}` : ""}`;
  const coverBlock = coverSrc
    ? `<tr><td style="padding:0;font-size:0;line-height:0"><a href="${esc(web)}" style="text-decoration:none">${imgTag(coverSrc, coverAlt, 600)}</a></td></tr>`
    : "";
  const leadImg = lead && imgSrc(lead.image?.src);
  const leadPhoto = leadImg
    ? `<tr><td class="pp-pad" style="padding:8px 32px 12px;font-family:${FONT}">${imgTag(leadImg, lead.image.alt || "", 536)}${lead.image.credit ? `<p class="pp-muted" style="margin:6px 0 0;font-size:11px;line-height:1.4;color:${MUTED}">${esc(lead.image.credit)}</p>` : ""}</td></tr>`
    : "";

  const leadBlock = lead
    ? `${h2("Lead story")}${leadPhoto}<tr><td class="pp-pad" style="padding:4px 32px 0;font-family:${FONT}">
<h1 style="margin:0 0 10px;font-size:24px;line-height:1.3;font-weight:700"><a href="${site(itemHref(lead))}" class="pp-text" style="color:${INK};text-decoration:none">${esc(lead.headline)}</a></h1>
<p class="pp-text" style="margin:0 0 10px;font-size:16px;line-height:1.6;color:${INK}">${esc(lead.summary)}</p>
${lead.why_it_matters ? `<p class="pp-muted" style="margin:0 0 10px;font-size:15px;line-height:1.6;color:${MUTED}"><b>Why it matters:</b> ${esc(lead.why_it_matters)}</p>` : ""}
<p style="margin:0;font-size:15px"><a href="${site(itemHref(lead))}" class="pp-link" style="color:${accent};font-weight:700;text-decoration:underline">Read the story</a></p></td></tr>`
    : "";

  const itemRows = rest.length
    ? `${h2("This week")}${rest.map((it, i) => `<tr><td class="pp-pad" style="padding:${i ? 14 : 4}px 32px 0;font-family:${FONT}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="pp-line" style="border-top:${i ? `1px solid ${LINE}` : "0"};padding-top:${i ? 14 : 0}px">
<h3 style="margin:0 0 6px;font-size:17px;line-height:1.35;font-weight:700"><a href="${site(itemHref(it))}" class="pp-text" style="color:${INK};text-decoration:none">${esc(it.headline)}</a></h3>
<p class="pp-text" style="margin:0 0 6px;font-size:15px;line-height:1.55;color:${INK}">${esc(it.summary)}</p>
<a href="${site(itemHref(it))}" class="pp-link" style="color:${accent};font-size:14px;text-decoration:underline">Read more</a></td></tr></table></td></tr>`).join("")}`
    : "";

  // Number of the week: big figure + horizontal bar table (fixed pixel widths, Outlook-safe).
  let numberBlock = "";
  const nw = issue.number_of_week;
  if (nw && nw.value != null) {
    const ch = nw.chart && Array.isArray(nw.chart.labels) && Array.isArray(nw.chart.values) ? nw.chart : null;
    const max = ch ? Math.max(...ch.values.map(Number).filter((v) => Number.isFinite(v)), 0) : 0;
    const BAR = 300;
    const bars = ch && max > 0
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px">${ch.labels.map((l, i) => {
          const v = Number(ch.values[i]);
          const w = Number.isFinite(v) ? Math.max(2, Math.round((v / max) * BAR)) : 2;
          return `<tr><td class="pp-text" width="140" style="width:140px;padding:4px 8px 4px 0;font-family:${FONT};font-size:13px;color:${INK};vertical-align:middle">${esc(l)}</td>
<td style="padding:4px 0;vertical-align:middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td class="pp-bar" width="${w}" height="14" style="width:${w}px;height:14px;background:${accent};font-size:1px;line-height:1px">&nbsp;</td>
<td class="pp-text" style="padding-left:8px;font-family:${FONT};font-size:13px;color:${INK};white-space:nowrap">${esc(ch.values[i])}</td></tr></table></td></tr>`;
        }).join("")}</table>`
      : "";
    const src = safeUrl(nw.source_url);
    numberBlock = `${h2("Number of the week")}<tr><td class="pp-pad" style="padding:4px 32px 0;font-family:${FONT}">
<p style="margin:0;font-size:40px;line-height:1.1;font-weight:700;color:${accent}"><span class="pp-acc">${esc(nw.value)}</span>${nw.unit ? `<span class="pp-text" style="font-size:18px;color:${INK}"> ${esc(nw.unit)}</span>` : ""}</p>
<p class="pp-text" style="margin:6px 0 0;font-size:15px;line-height:1.5;color:${INK}">${esc(nw.label)}${nw.date ? ` (${esc(nw.date)})` : ""}</p>${bars}
${src ? `<p class="pp-muted" style="margin:8px 0 0;font-size:12px;color:${MUTED}">Source: <a href="${esc(src)}" class="pp-muted" style="color:${MUTED};text-decoration:underline">${esc(new URL(src).hostname)}</a></p>` : ""}</td></tr>`;
  }

  let dataBlock = "";
  const db = issue.data_box;
  if (db && Array.isArray(db.rows) && db.rows.length) {
    const src = safeUrl(db.source_url);
    dataBlock = `${h2(db.title || "Data box")}<tr><td class="pp-pad" style="padding:4px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="pp-card" style="border:1px solid ${LINE};border-radius:8px;background:${PAPER}">
${db.rows.map((r, i) => `<tr><td class="pp-text pp-line" style="padding:10px 14px;font-family:${FONT};font-size:14px;color:${INK};border-top:${i ? `1px solid ${LINE}` : "0"}">${esc(r.label)}</td><td class="pp-text pp-line" align="right" style="padding:10px 14px;font-family:${FONT};font-size:14px;font-weight:700;color:${INK};border-top:${i ? `1px solid ${LINE}` : "0"}">${esc(r.value)}</td></tr>`).join("")}
</table>${src || db.date ? `<p class="pp-muted" style="margin:8px 0 0;font-family:${FONT};font-size:12px;color:${MUTED}">${src ? `Source: <a href="${esc(src)}" class="pp-muted" style="color:${MUTED};text-decoration:underline">${esc(new URL(src).hostname)}</a>` : ""}${db.date ? ` · ${esc(db.date)}` : ""}</p>` : ""}</td></tr>`;
  }

  let spotBlock = "";
  const sp = issue.spotlight;
  if (sp && sp.name) {
    const href = sp.href ? (sp.href.startsWith("/") ? site(sp.href) : esc(safeUrl(sp.href) || "")) : "";
    spotBlock = `${h2(sp.kind === "company" ? "Company spotlight" : "Expert spotlight")}<tr><td class="pp-pad" style="padding:4px 32px 0;font-family:${FONT}">
<p class="pp-text" style="margin:0 0 4px;font-size:16px;font-weight:700;color:${INK}">${esc(sp.name)}</p>
${sp.role || sp.org ? `<p class="pp-muted" style="margin:0 0 8px;font-size:13px;color:${MUTED}">${esc([sp.role, sp.org].filter(Boolean).join(", "))}</p>` : ""}
<p class="pp-text" style="margin:0 0 6px;font-size:15px;line-height:1.6;color:${INK}">${esc(sp.text)}</p>
${href ? `<a href="${href}" class="pp-link" style="color:${accent};font-size:14px;text-decoration:underline">More</a>` : ""}</td></tr>`;
  }

  const events = Array.isArray(issue.events) ? issue.events.filter((e) => e && e.name) : [];
  const eventsBlock = events.length
    ? `${h2("Events")}<tr><td class="pp-pad" style="padding:4px 32px 0;font-family:${FONT}">${events.map((e) => {
        const url = safeUrl(e.url);
        const name = url ? `<a href="${esc(url)}" class="pp-text" style="color:${INK};font-weight:700;text-decoration:underline">${esc(e.name)}</a>` : `<b>${esc(e.name)}</b>`;
        return `<p class="pp-text" style="margin:0 0 8px;font-size:14px;line-height:1.5;color:${INK}">${name}<br><span class="pp-muted" style="color:${MUTED}">${esc([e.dates, e.city, e.country].filter(Boolean).join(" · "))}</span></p>`;
      }).join("")}<a href="${site("/events")}" class="pp-link" style="color:${accent};font-size:14px;text-decoration:underline">All potato events</a></td></tr>`
    : "";

  const jr = issue.journal;
  const journalBlock = jr && jr.title && jr.href
    ? `${h2("From the Journal")}<tr><td class="pp-pad" style="padding:4px 32px 0;font-family:${FONT}"><p style="margin:0;font-size:16px;line-height:1.45"><a href="${site(jr.href)}" class="pp-text" style="color:${INK};font-weight:700;text-decoration:underline">${esc(jr.title)}</a></p></td></tr>`
    : "";

  const intro = issue.intro
    ? `<tr><td class="pp-pad" style="padding:24px 32px 0;font-family:${FONT}"><p class="pp-text" style="margin:0;font-size:16px;line-height:1.6;color:${INK}">${esc(issue.intro)}</p></td></tr>`
    : "";

  const footer = `<tr><td class="pp-pad" style="padding:32px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="pp-line" style="border-top:1px solid ${LINE};font-size:1px;line-height:1px">&nbsp;</td></tr></table></td></tr>
<tr><td class="pp-pad" style="padding:16px 32px 32px;font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED}">
<p class="pp-muted" style="margin:0 0 8px;color:${MUTED}"><b>${esc(TRUST_LINE)}</b></p>
<p class="pp-muted" style="margin:0 0 8px;color:${MUTED}">You get this because you subscribed to ${esc(n.name)} (${esc(n.cadenceLabel)}) on potatopedia.com and confirmed by email.</p>
<p class="pp-muted" style="margin:0 0 8px;color:${MUTED}">${unsubUrl ? `<a href="${esc(unsubUrl)}" class="pp-muted" style="color:${MUTED};text-decoration:underline">Unsubscribe</a> · ` : ""}${manageUrl ? `<a href="${esc(manageUrl)}" class="pp-muted" style="color:${MUTED};text-decoration:underline">Manage your newsletters</a> · ` : ""}<a href="${esc(web)}" class="pp-muted" style="color:${MUTED};text-decoration:underline">Read on the web</a></p>
<p class="pp-muted" style="margin:0;color:${MUTED}">${esc(POSTAL_LINE)} · Reply to this mail to reach the editors.</p></td></tr>`;

  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting"><meta name="format-detection" content="telephone=no,address=no,email=no,date=no">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${esc(subject)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style>table,td,h1,h2,h3,p,a,span{font-family:Arial,Helvetica,sans-serif !important}</style><![endif]-->
<style>
:root{color-scheme:light dark;supported-color-schemes:light dark}
body{margin:0;padding:0;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important}
@media screen and (max-width:620px){.pp-pad{padding-left:18px !important;padding-right:18px !important}h1{font-size:21px !important}}
@media (prefers-color-scheme:dark){
.pp-body,.pp-wrap{background:#121212 !important}
.pp-main{background:#1c1c1c !important}
.pp-card{background:#262626 !important;border-color:#3a3a3a !important}
.pp-text{color:#EDEDED !important}
.pp-muted{color:#B5B5B5 !important}
.pp-link,.pp-acc{color:${accentDark} !important}
.pp-line{border-color:#3a3a3a !important}
.pp-bar{background:${accentDark} !important}
}
[data-ogsc] .pp-main{background:#1c1c1c !important}
[data-ogsc] .pp-card{background:#262626 !important}
[data-ogsc] .pp-text{color:#EDEDED !important}
[data-ogsc] .pp-muted{color:#B5B5B5 !important}
[data-ogsc] .pp-link,[data-ogsc] .pp-acc{color:${accentDark} !important}
</style>
</head>
<body class="pp-body" style="margin:0;padding:0;background:${PAPER};word-spacing:normal">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${PAPER};opacity:0">${esc(pre)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="pp-wrap" style="background:${PAPER}"><tr><td align="center" style="padding:16px 8px">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="pp-main" style="max-width:600px;width:100%;background:#ffffff;border-radius:10px">
<tr><td class="pp-pad" style="padding:12px 32px 0;font-family:${FONT};font-size:12px;color:${MUTED}" align="right"><a href="${esc(web)}" class="pp-muted" style="color:${MUTED};text-decoration:underline">View in browser</a></td></tr>
<tr><td style="padding:12px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${accent}" class="pp-pad" style="background:${accent};padding:22px 32px;font-family:${FONT}">
<p style="margin:0;font-size:22px;line-height:1.25;font-weight:700;color:#ffffff">${esc(masthead(n))}</p>
<p style="margin:6px 0 0;font-size:13px;line-height:1.4;color:#ffffff">${esc(issueLabel(issue.issue_no))} · ${esc(fmtDate(date))} · ${esc(n.cadenceLabel)}</p>
</td></tr></table></td></tr>
${coverBlock}
${presenting ? slotBlock(presenting) : emptySlot}
${intro}
${leadBlock}
${itemRows}
${classified ? slotBlock(classified) : emptySlot}
${numberBlock}
${dataBlock}
${spotBlock}
${eventsBlock}
${journalBlock}
<tr><td class="pp-pad" style="padding:28px 32px 0;font-family:${FONT}"><a href="${site(n.hubHref)}" class="pp-link" style="color:${accent};font-size:14px;font-weight:700;text-decoration:underline">More on potatopedia.com</a></td></tr>
${footer}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`;

  // Plain-text alternative.
  const T = [];
  const line = (s = "") => T.push(s);
  const abs = (h) => withUtm(h, campaign);
  line(masthead(n));
  line(`${issueLabel(issue.issue_no)} · ${fmtDate(date)} · ${n.cadenceLabel}`);
  line(`Read on the web: ${web}`);
  line();
  if (presenting) line(`[${presenting.label === "Launch partner" ? "Launch partner" : "Sponsored"}] ${presenting.sponsor}${presenting.text ? ` · ${presenting.text}` : ""}${safeUrl(presenting.url) ? ` ${safeUrl(presenting.url)}` : ""}\n`);
  if (issue.intro) line(`${issue.intro}\n`);
  if (lead) {
    line("LEAD STORY");
    line(lead.headline);
    line(lead.summary);
    if (lead.why_it_matters) line(`Why it matters: ${lead.why_it_matters}`);
    line(abs(itemHref(lead)));
    line();
  }
  if (rest.length) {
    line("THIS WEEK");
    for (const it of rest) { line(`- ${it.headline}`); line(`  ${it.summary}`); line(`  ${abs(itemHref(it))}`); }
    line();
  }
  if (classified) line(`[${classified.label === "Launch partner" ? "Launch partner" : "Sponsored"}] ${classified.sponsor}${classified.text ? ` · ${classified.text}` : ""}${safeUrl(classified.url) ? ` ${safeUrl(classified.url)}` : ""}\n`);
  if (nw && nw.value != null) {
    line("NUMBER OF THE WEEK");
    line(`${nw.value}${nw.unit ? ` ${nw.unit}` : ""}: ${nw.label || ""}${nw.date ? ` (${nw.date})` : ""}`);
    if (nw.chart?.labels) nw.chart.labels.forEach((l, i) => line(`  ${l}: ${nw.chart.values?.[i] ?? ""}`));
    if (safeUrl(nw.source_url)) line(`Source: ${safeUrl(nw.source_url)}`);
    line();
  }
  if (db && Array.isArray(db.rows) && db.rows.length) {
    line((db.title || "Data box").toUpperCase());
    db.rows.forEach((r) => line(`  ${r.label}: ${r.value}`));
    if (safeUrl(db.source_url)) line(`Source: ${safeUrl(db.source_url)}${db.date ? ` · ${db.date}` : ""}`);
    line();
  }
  if (sp && sp.name) { line(sp.kind === "company" ? "COMPANY SPOTLIGHT" : "EXPERT SPOTLIGHT"); line(`${sp.name}${sp.role || sp.org ? `, ${[sp.role, sp.org].filter(Boolean).join(", ")}` : ""}`); line(sp.text || ""); line(); }
  if (events.length) { line("EVENTS"); events.forEach((e) => line(`- ${e.name} · ${[e.dates, e.city, e.country].filter(Boolean).join(" · ")}${safeUrl(e.url) ? ` ${safeUrl(e.url)}` : ""}`)); line(); }
  if (jr && jr.title && jr.href) { line("FROM THE JOURNAL"); line(`${jr.title} ${abs(jr.href)}`); line(); }
  if (!presenting || !classified) line(`This space: sponsor this newsletter ${abs("/advertise#newsletters")}\n`);
  line("--");
  line(TRUST_LINE);
  line(`You get this because you subscribed to ${n.name} (${n.cadenceLabel}) on potatopedia.com and confirmed by email.`);
  if (unsubUrl) line(`Unsubscribe: ${unsubUrl}`);
  if (manageUrl) line(`Manage your newsletters: ${manageUrl}`);
  line(POSTAL_LINE);

  return { subject, html, text: T.join("\n") };
}
