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
  data_correction: "Data correction",
  datasheet_submission: "Variety datasheets and photos",
  contribute: "Expert contribution pitch",
  seed: "Certified seed enquiry",
  advertise_newsletter: "Newsletter sponsorship booking",
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
  newsletter: ["saved_question", "segment"], // segment = variety alerts sign-up on /varieties
  company_claim: ["company_slug", "request", "website", "kind", "role"],
  report_download: ["report", "role"],
  data_correction: ["wrong", "correct_fact", "source_url"],
  datasheet_submission: ["varieties", "link", "rights_confirmed"],
  contribute: ["topic", "institution", "role", "profile_url"], // pitch goes in message (/contribute)
  seed: ["variety", "quantity", "planting_month", "seed_class", "role"], // /seed-field/certified-seed-potatoes
  advertise_newsletter: ["product_interest", "newsletter", "timing"], // /advertise#newsletters
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

// Extra validation for the For-companies lead types. Returns an error string or null.
// row = trimmed core fields (name, company, email, message, page_url); details = trimmed detail fields.
export function validateExtra(type, row, details) {
  const url = (v) => {
    try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; }
  };
  // New listings from /for-companies need company + website; claims on an existing profile carry company_slug instead.
  if (type === "company_claim" && !details.company_slug) {
    if (!row.company) return "Please give your company.";
    if (!details.website || !url(details.website)) return "Please give your official website (https://...).";
  }
  if (type === "data_correction") {
    if (!details.wrong) return "Please say what is wrong.";
    if (!details.correct_fact) return "Please give the correct fact.";
    if (!details.source_url || !url(details.source_url)) return "Please give an official source link (https://...).";
  }
  if (type === "datasheet_submission") {
    if (!row.company) return "Please give your breeder or company.";
    if (!details.varieties) return "Please list the varieties.";
    if (!details.link || !url(details.link)) return "Please give a link to the datasheets or photos (https://...).";
    if (details.rights_confirmed !== "yes") return "Please confirm you hold the rights to the photos.";
  }
  if (type === "contribute") {
    if (!details.topic) return "Please give the topic you want to write about.";
    if (!details.institution) return "Please give your institution or company.";
    if (!row.message || row.message.length < 40) return "Please give a short pitch (two or three sentences).";
    if (details.profile_url && !url(details.profile_url)) return "Please give a public profile link starting with https://";
  }
  if (type === "seed") {
    if (!row.country) return "Please give the country where you will plant.";
    if (!details.quantity) return "Please give the quantity you need.";
  }
  if (type === "advertise_newsletter") {
    if (!row.company) return "Please give your company.";
  }
  return null;
}

export const REPLY_PROMISE = "We reply within one working day.";
