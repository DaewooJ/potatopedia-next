// Central registry of page-specific OG images sourced from LinkedIn (or other custom
// social graphics), keyed by the page's site-relative path (e.g. "/blog/some-slug").
//
// Why this exists: WhatsApp, iMessage, Slack, etc. all read the target page's own
// og:image meta tag when a link is shared — they do NOT see whatever image was
// attached to the LinkedIn post itself. Without an entry here, a page falls back to
// the generic /og-image.png. Add an entry whenever a LinkedIn post uses a custom
// graphic for a page, so sharing that same URL elsewhere shows the same image.
//
// To add one: save the LinkedIn post's image into public/ (og-<slug>.jpg), then add
// an entry below with the page's full site-relative path as the key.
export const OG_IMAGE_OVERRIDES = {
  "/knowledge/potato-consumption-per-capita": {
    url: "https://www.potatopedia.com/og-potato-consumption-per-capita.jpg",
    alt: "The world's biggest potato eaters — Belarus 181 kg, Ukraine 136 kg, Russia 111 kg, China 41 kg per capita",
    type: "image/jpeg",
    width: 1200,
    height: 1200,
  },
  "/knowledge/potatoes-and-heart-health": {
    url: "https://www.potatopedia.com/og-potatoes-heart-health.jpg",
    alt: "Are Potatoes Good for Your Heart? What Science Actually Says",
    type: "image/jpeg",
    width: 1280,
    height: 720,
  },
};

// Wraps a fully-built Next.js metadata object and swaps in the registered OG image
// for `path`, if one exists. Leaves `meta` untouched when there's no override.
export function applyOgOverride(meta, path) {
  const o = OG_IMAGE_OVERRIDES[path];
  if (!o) return meta;
  const image = { url: o.url, width: o.width || 1200, height: o.height || 630, alt: o.alt, type: o.type || "image/jpeg" };
  return {
    ...meta,
    openGraph: { ...meta.openGraph, images: [image] },
    twitter: { ...meta.twitter, images: [o.url] },
  };
}
