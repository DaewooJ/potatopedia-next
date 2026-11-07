// Shared lead rules for app/api/lead (server) and components/LeadForm (client labels).
export const LEAD_TYPES = {
  sponsor: "Sponsorship",
  machine_quote: "Machine quote",
  trade: "Trade enquiry",
  report: "Market report",
  listing: "Directory listing",
  publish: "Publish with us",
  ai_visibility: "AI visibility check",
  advertise_call: "Advertise call",
  newsletter: "Newsletter",
  company_claim: "Company correction or claim",
  report_download: "Country report download",
};

// Extra fields allowed per type, stored in leads.details (jsonb).
export const LEAD_DETAILS = {
  machine_quote: ["problem", "product", "capacity_tph", "timeline"],
  trade: ["product", "volume", "destination"],
  report: ["report_country", "segment"],
  listing: ["category", "website"],
  publish: ["topic"],
  ai_visibility: ["brand", "category"],
  sponsor: ["product_interest"],
  advertise_call: ["product_interest"],
  newsletter: ["saved_question"],
  company_claim: ["company_slug", "request"],
  report_download: ["report", "role"],
};

// Gated country report (REPORT_GATE_LIVE). Extra rules live in app/api/lead/route.js.
export const REPORT_ROLES = [
  "Grower",
  "Trader / exporter",
  "Processor",
  "Seed company",
  "Machinery / supplier",
  "Researcher / student",
  "Government / NGO",
  "Other",
];

const FREE_MAIL = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk", "ymail.com", "outlook.com",
  "hotmail.com", "hotmail.co.uk", "live.com", "msn.com", "aol.com", "icloud.com", "me.com", "proton.me",
  "protonmail.com", "gmx.com", "gmx.de", "mail.com", "zoho.com", "rediffmail.com", "yandex.com", "yandex.ru",
  "mail.ru", "qq.com", "163.com", "126.com",
]);

export function emailType(email) {
  const d = String(email).split("@").pop().toLowerCase();
  return FREE_MAIL.has(d) ? "free" : "work";
}

export const REPLY_PROMISE = "We reply within one working day.";
