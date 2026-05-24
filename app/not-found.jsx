import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist. Explore Potatopedia's knowledge base, countries, and answers.",
};

export default function NotFound() {
  return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", fontFamily: "'Poppins',sans-serif", textAlign: "center" }}>
      <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2, background: "linear-gradient(135deg,#C62828,#E53935)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>404</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>Page Not Found</h1>
      <p style={{ fontSize: 15, color: "#666", maxWidth: 480, lineHeight: 1.6, marginBottom: 32 }}>
        We couldn&apos;t find that page. It may have moved, or the link might be broken. Try one of the paths below to keep exploring.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        <Link href="/" style={{ padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg,#C62828,#E53935)", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Home</Link>
        <Link href="/knowledge" style={{ padding: "12px 24px", borderRadius: 12, background: "white", color: "#C62828", border: "1px solid rgba(198,40,40,0.2)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Knowledge Hub</Link>
        <Link href="/answers" style={{ padding: "12px 24px", borderRadius: 12, background: "white", color: "#C62828", border: "1px solid rgba(198,40,40,0.2)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Answers</Link>
        <Link href="/countries" style={{ padding: "12px 24px", borderRadius: 12, background: "white", color: "#C62828", border: "1px solid rgba(198,40,40,0.2)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Countries</Link>
      </div>
    </div>
  );
}
