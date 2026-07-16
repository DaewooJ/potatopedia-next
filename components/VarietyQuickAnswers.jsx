export default function VarietyQuickAnswers({ answers }) {
  return (
    <section style={{ background: "#FAFAFA", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
      <div className="pp-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Quick answers</span>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.5, marginBottom: 6 }}>Best variety, by use</h2>
          <p style={{ fontSize: 13, color: "#8A8F98" }}>Click any answer to jump to that filter in the full archive below.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${answers.length}, 1fr)`, gap: 12 }} className="pp-qa-grid">
          {answers.map(({ use, variety }) => (
            <a
              key={use}
              href={`/varieties?use=${encodeURIComponent(use)}#archive`}
              className="pp-qa-card"
              style={{ display: "block", background: "#fff", border: "1px solid #ececec", borderRadius: 12, padding: "16px 14px", textAlign: "center", textDecoration: "none", color: "inherit", transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease" }}
            >
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8A8F98", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Best for {use.split(" / ")[0].toLowerCase()}</div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1A1A1A" }}>{variety.name}</div>
            </a>
          ))}
        </div>
      </div>
      <style>{`
        .pp-qa-card:hover { border-color: #C62828 !important; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,0,0,0.05); }
        @media (max-width: 900px) { .pp-qa-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 560px) { .pp-qa-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
