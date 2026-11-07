/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // One canonical host (7 Nov 2026): potatopedia.com served a full duplicate of the site and Google indexed both.
      // Every bare-domain URL now 308-redirects to the same path on www.
      { source: "/:path*", has: [{ type: "host", value: "potatopedia.com" }], destination: "https://www.potatopedia.com/:path*", permanent: true },
      // GSC coverage fixes (7 Nov 2026): old/broken URLs → best live page (permanent)
      { source: "/answers/potatoes-and-diabetes", destination: "/blog/potatoes-and-diabetes", permanent: true },
      { source: "/varieties/norkotah", destination: "/varieties/russet-norkotah", permanent: true },
      { source: "/varieties/kufri-lalit", destination: "/knowledge/kufri-potato-varieties-india", permanent: true },
      { source: "/varieties/kufri-chipbharat-1", destination: "/knowledge/kufri-potato-varieties-india", permanent: true },
      { source: "/country/european-union", destination: "/countries", permanent: true },
      { source: "/knowledge/potato-nutrition", destination: "/knowledge/potato-nutrition-facts", permanent: true },
      { source: "/knowledge/potato-starch-industry", destination: "/knowledge/potato-processing-industry", permanent: true },
      { source: "/knowledge/potato-dry-matter", destination: "/knowledge/how-potatoes-are-processed", permanent: true },
      { source: "/knowledge/digital-trading-platforms-potato", destination: "/knowledge/global-potato-trade", permanent: true },
      { source: "/knowledge/potato-history-origin", destination: "/knowledge", permanent: true },
      { source: "/&", destination: "/", permanent: true },
      { source: "/$", destination: "/", permanent: true },
      // /support (donation page) became /advertise on 7 Nov 2026
      { source: "/support", destination: "/advertise", permanent: true },
      { source: "/answers/largest-potato-exporters", destination: "/answers/top-potato-exporting-countries", permanent: true },
      { source: "/answers/fertilizer-for-potato-size", destination: "/answers/best-fertilizer-for-potatoes", permanent: true },
      { source: "/answers/best-potatoes-in-the-world", destination: "/answers/best-quality-potatoes-by-country", permanent: true },
      { source: "/knowledge/potato-disease-identification", destination: "/knowledge/potato-diseases-pests", permanent: true },
    ];
  },
};

export default nextConfig;
