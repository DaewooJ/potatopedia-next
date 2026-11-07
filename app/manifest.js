// Web app manifest (7 Nov 2026 premium brand: gold serif "P" on ink).
export default function manifest() {
  return {
    name: "Potatopedia",
    short_name: "Potatopedia",
    description: "The potato reference: sourced answers on production, prices, trade, varieties and companies.",
    start_url: "/",
    display: "standalone",
    background_color: "#16140F",
    theme_color: "#16140F",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
