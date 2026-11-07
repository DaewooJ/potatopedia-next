/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // One canonical host (7 Nov 2026): potatopedia.com served a full duplicate of the site and Google indexed both.
      // Every bare-domain URL now 308-redirects to the same path on www.
      { source: "/:path*", has: [{ type: "host", value: "potatopedia.com" }], destination: "https://www.potatopedia.com/:path*", permanent: true },
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
