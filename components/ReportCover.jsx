// Cover-style thumbnail of a country report, drawn in HTML/CSS in the report's brand (ink ground, gold, Instrument Serif).
// Sizes scale with its own width (container query units), so the same component works at 150px and 320px.
export default function ReportCover({ name, headlineValue, headlineLabel, edition, maxWidth = 260 }) {
  const long = name.length > 10;
  return (
    <div role="img" aria-label={`Cover of the ${name} Potato Market Report, ${edition}`} style={{ containerType: "inline-size", width: "100%", maxWidth, aspectRatio: "3 / 4", background: "#16140F", color: "#EDE6D8", borderRadius: 6, boxShadow: "0 18px 40px rgba(60,40,10,.22), 0 2px 6px rgba(0,0,0,.18)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 70% at 85% 8%, rgba(226,192,141,.20), transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 0, padding: "9cqw", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "4.2cqw", letterSpacing: ".14em", textTransform: "uppercase", color: "#E2C08D" }}>
          <span style={{ fontFamily: "var(--hp-serif), Georgia, serif", letterSpacing: 0, textTransform: "none", fontSize: "7cqw", color: "#F6F1E8", lineHeight: 1 }}>Potatopedia</span>
          <span style={{ alignSelf: "center" }}>Market Report</span>
        </div>
        <div>
          <div style={{ fontSize: "3.8cqw", letterSpacing: ".18em", textTransform: "uppercase", color: "#E2C08D", marginBottom: "3cqw" }}>Production, trade &amp; industry</div>
          <div style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontSize: long ? "17cqw" : "23cqw", lineHeight: 0.95, color: "#F6F1E8", letterSpacing: "-.02em" }}>{name}</div>
          <div style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontStyle: "italic", fontSize: "8cqw", color: "#E2C08D", marginTop: "2cqw" }}>Potato Market Report</div>
          <div style={{ fontSize: "4cqw", color: "#B7B2AA", marginTop: "3cqw" }}>{edition} edition</div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.16)", paddingTop: "4cqw", display: "flex", alignItems: "baseline", gap: "2cqw" }}>
          <span style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontSize: "15cqw", lineHeight: 1, color: "#F6F1E8" }}>{headlineValue}</span>
          <span style={{ fontSize: "4cqw", color: "#E2C08D" }}>M t · {headlineLabel}</span>
        </div>
      </div>
    </div>
  );
}
