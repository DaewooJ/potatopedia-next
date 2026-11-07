export async function GET() {
  const body = `# Potatopedia robots.txt — reviewed 2026-11-07 (CEO bot policy)
# Allowed: search engines, AI answer engines that cite and link us, link previews, and the big labs' model training
# (so models know Potatopedia as the potato reference). Blocked: bulk dataset collectors and SEO scrapers that take
# without giving traffic or credit. Scrapers that ignore robots.txt are handled by the Vercel firewall.

# Search engines, AI answer engines, previews and major-lab training
User-agent: Googlebot
User-agent: Googlebot-Image
User-agent: Bingbot
User-agent: Applebot
User-agent: DuckDuckBot
User-agent: YandexBot
User-agent: Baiduspider
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: LinkedInBot
User-agent: facebookexternalhit
User-agent: Twitterbot
User-agent: Slackbot
User-agent: WhatsApp
Allow: /
Disallow: /api/
Disallow: /admin

# Bulk dataset collectors and SEO scrapers: no access
User-agent: CCBot
User-agent: Diffbot
User-agent: Bytespider
User-agent: cohere-ai
User-agent: cohere-training-data-crawler
User-agent: Timpibot
User-agent: omgili
User-agent: omgilibot
User-agent: ImagesiftBot
User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: MJ12bot
User-agent: DotBot
User-agent: DataForSeoBot
User-agent: BLEXBot
User-agent: PetalBot
User-agent: Barkrowler
User-agent: Meta-ExternalAgent
Disallow: /

# Everyone else: read the site, not the API or admin
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: https://www.potatopedia.com/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
