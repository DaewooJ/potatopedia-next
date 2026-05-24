/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/answers/largest-potato-exporters", destination: "/answers/top-potato-exporting-countries", permanent: true },
      { source: "/answers/fertilizer-for-potato-size", destination: "/answers/best-fertilizer-for-potatoes", permanent: true },
      { source: "/answers/best-potatoes-in-the-world", destination: "/answers/best-quality-potatoes-by-country", permanent: true },
      { source: "/knowledge/potato-disease-identification", destination: "/knowledge/potato-diseases-pests", permanent: true },
    ];
  },
};

export default nextConfig;
