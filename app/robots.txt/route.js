export async function GET() {
  const body = `# Potatopedia robots.txt — last reviewed 2026-05-08
# Default: allow everything. We are a public, citation-friendly knowledge platform.
User-agent: *
Allow: /

# Major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Applebot
Allow: /

# AI crawlers — explicitly allowed for AI Overview and citation visibility.
# Naming each crawler explicitly is the 2026 best practice: transparent + auditable.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Twitterbot
Allow: /

# Utility / API endpoints — no value to crawlers
User-agent: *
Disallow: /api/
Disallow: /_next/

Sitemap: https://www.potatopedia.com/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
