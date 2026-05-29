import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid #f0f0f0", padding: "44px 48px 28px", background: "white",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          flexWrap: "wrap", gap: 32, marginBottom: 28,
        }}>
          {/* Logo */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "linear-gradient(135deg,#C62828,#E53935)",
                color: "white", fontSize: 16, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>P</div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.5 }}>Potatopedia</span>
            </div>
            <p style={{ fontSize: 13, color: "#999", maxWidth: 300, lineHeight: 1.5 }}>
              The world&apos;s AI-powered potato knowledge base.
            </p>
          </div>

          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {/* Platform Links */}
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#C62828",
                textTransform: "uppercase", letterSpacing: 2, marginBottom: 12,
              }}>Platform</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href="/" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Home</Link>
                <Link href="/knowledge" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Knowledge Hub</Link>
                <Link href="/countries" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Countries</Link>
                <Link href="/blog" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Blog</Link>
                <Link href="/answers" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Answers</Link>
                <Link href="/about" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>About Us</Link>
                <Link href="/support" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Support</Link>
              </div>
            </div>

            {/* Connect */}
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#C62828",
                textTransform: "uppercase", letterSpacing: 2, marginBottom: 12,
              }}>Connect</div>
              <a
                href="https://www.linkedin.com/company/potatopedia"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 18px", borderRadius: 8, background: "#0A66C2",
                  color: "white", textDecoration: "none", fontSize: 13, fontWeight: 600,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Follow Us
              </a>
              <div style={{ marginTop: 10 }}>
                <a href="mailto:hello@potatopedia.com" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>
                  hello@potatopedia.com
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#C62828",
                textTransform: "uppercase", letterSpacing: 2, marginBottom: 12,
              }}>Legal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href="/privacy" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Privacy Policy</Link>
                <Link href="/terms" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Terms &amp; Conditions</Link>
                <Link href="/refund-policy" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Refund Policy</Link>
                <Link href="/shipping-policy" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Shipping Policy</Link>
                <Link href="/disclaimer" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Disclaimer</Link>
                <Link href="/contact" style={{ color: "#666", textDecoration: "none", fontSize: 13 }}>Contact Us</Link>
              </div>
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
