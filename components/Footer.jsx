import Link from "next/link";

const linkStyle = { color: "#666", textDecoration: "none", fontSize: 13 };
const headStyle = { fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 };

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #f0f0f0", padding: "48px 48px 28px", background: "white" }}>
      <style>{`
        .pp-footer-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        @media (max-width: 900px) { .pp-footer-grid { grid-template-columns: 1fr 1fr; row-gap: 32px; } }
        @media (max-width: 520px) { .pp-footer-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="pp-footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <img src="/logo.png" alt="Potatopedia Logo" width={32} height={32} style={{ borderRadius: 8 }} />
              <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.5 }}>
                <span style={{ color: "#1A1A1A" }}>Potato</span><span style={{ color: "#C62828" }}>pedia</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#999", maxWidth: 260, lineHeight: 1.6 }}>
              The world&apos;s AI-powered potato knowledge base — free, no paywall, no ads.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <div style={headStyle}>Platform</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <Link href="/" style={linkStyle}>Home</Link>
              <Link href="/knowledge" style={linkStyle}>Knowledge Hub</Link>
              <Link href="/countries" style={linkStyle}>Countries</Link>
              <Link href="/varieties" style={linkStyle}>Varieties</Link>
              <Link href="/blog" style={linkStyle}>Blog</Link>
              <Link href="/answers" style={linkStyle}>Answers</Link>
              <Link href="/about" style={linkStyle}>About Us</Link>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <div style={headStyle}>Legal</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
              <Link href="/terms" style={linkStyle}>Terms &amp; Conditions</Link>
              <Link href="/refund-policy" style={linkStyle}>Refund Policy</Link>
              <Link href="/shipping-policy" style={linkStyle}>Shipping Policy</Link>
              <Link href="/disclaimer" style={linkStyle}>Disclaimer</Link>
              <Link href="/contact" style={linkStyle}>Contact Us</Link>
            </div>
          </div>

          {/* Connect + Support */}
          <div>
            <div style={headStyle}>Connect</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
              <a
                href="https://www.linkedin.com/company/potatopedia"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 8, background: "#0A66C2", color: "white", textDecoration: "none", fontSize: 13, fontWeight: 600 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Follow Us
              </a>
              <a href="mailto:hello@potatopedia.com" style={linkStyle}>hello@potatopedia.com</a>
              <Link href="/support" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "1px solid #C62828", color: "#C62828", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                ♥ Support Us
              </Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#bbb" }}>
            &copy; 2024&ndash;2026 Potatopedia. Data from FAOSTAT, USDA, CIP, CPRI, and peer-reviewed research.
          </p>
        </div>
      </div>
    </footer>
  );
}
