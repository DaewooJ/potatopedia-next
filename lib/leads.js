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
  newsletter: [],
};

export const REPLY_PROMISE = "We reply within one working day.";
