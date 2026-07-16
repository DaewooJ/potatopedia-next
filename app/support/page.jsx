import Link from "next/link";
import { ppCSS } from "../../lib/styles";
import SupportButton from "../../components/SupportButton";

export const metadata = {
  title: "Support Potatopedia",
  description: "Potatopedia is an independent, free potato intelligence platform. Your support covers hosting, AI, and the data work behind every page.",
  alternates: { canonical: "https://www.potatopedia.com/support" },
};

const goesTo = [
  { icon: "🖥️", title: "Hosting & Infrastructure", desc: "Keeps the site and AI answer engine online, all day, every day." },
  { icon: "🤖", title: "AI & Data Processing", desc: "Powers the question-answering on every page." },
  { icon: "🔍", title: "Data Verification", desc: "Sourcing and checking every figure before it goes live." },
];

export default function SupportPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A" }}>
      <style>{ppCSS}</style>

      {/* Hero */}
      <section style={{ paddingTop: 64, paddingBottom: 8, textAlign: "center" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 24px" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 18 }}>Support Potatopedia</span>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.3, lineHeight: 1.15, marginBottom: 14 }}>
            Help keep it{" "}
            <span style={{ background: "linear-gradient(135deg,#C62828,#8E0000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>completely free.</span>
          </h1>
          <p style={{ fontSize: 15.5, color: "#555", lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>
            Potatopedia is independent — built one verified data point at a time, free to use, no paywall, no ads. If a page here saved you time, a small contribution keeps it online and growing.
          </p>
        </div>
      </section>

      {/* Donation card */}
      <section style={{ padding: "32px 24px 8px" }}>
        <div style={{
          maxWidth: 520, margin: "0 auto", textAlign: "center",
          background: "linear-gradient(135deg,rgba(198,40,40,0.04),rgba(198,40,40,0.01))",
          border: "1.5px solid rgba(198,40,40,0.18)", borderRadius: 20,
          padding: "36px 32px", boxShadow: "0 20px 50px rgba(198,40,40,0.08)",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 8 }}>Back Potatopedia</h2>
          <p style={{ fontSize: 13.5, color: "#666", marginBottom: 22 }}>
            Choose an amount, or enter your own — secured by Razorpay.
          </p>
          <SupportButton />
        </div>
      </section>

      {/* Where it goes */}
      <section style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="pp-support-grid">
            {goesTo.map((g) => (
              <div key={g.title} style={{ background: "#FAFAFA", border: "1px solid #f0f0f0", borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{g.icon}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{g.title}</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", padding: "28px 24px 56px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center", fontSize: 12.5, color: "#999", lineHeight: 1.8 }}>
          Can&apos;t contribute financially? Sharing a page, citing it in your work, or sending corrections helps just as much.
          <br />
          Potatopedia is operated by INDPOTATO PRIVATE LIMITED, India. Contributions are voluntary support for an independent platform and are not tax-deductible donations; international cards are charged in USD and settled in INR. Questions? <Link href="/contact" style={{ color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Contact us</Link>.
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .pp-support-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
