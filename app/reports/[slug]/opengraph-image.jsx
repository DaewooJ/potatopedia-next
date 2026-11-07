import { ImageResponse } from "next/og";
import { getReport, listReportSlugs } from "../../../lib/report-pages";

export const alt = "Potato market report by Potatopedia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return listReportSlugs().map((slug) => ({ slug }));
}

// Dark cover style of the PDF: ink ground, gold accents, serif-style country name, headline figure.
export default async function Image({ params }) {
  const { slug } = await params;
  const r = getReport(slug);
  const name = r?.name || "Potato";
  const big = r ? r.head.v.toFixed(r.head.v >= 10 ? 1 : 2) : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#16140F", color: "#F6F1E8", padding: "64px 72px", fontFamily: "Georgia, serif", backgroundImage: "radial-gradient(circle at 88% 6%, rgba(226,192,141,0.22), rgba(22,20,15,0) 55%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 40, display: "flex" }}>Potatopedia</div>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#E2C08D", textTransform: "uppercase", fontFamily: "Helvetica, Arial, sans-serif", display: "flex" }}>Country Market Report</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 5, color: "#E2C08D", textTransform: "uppercase", fontFamily: "Helvetica, Arial, sans-serif", marginBottom: 18, display: "flex" }}>Production, trade and industry</div>
          <div style={{ fontSize: name.length > 10 ? 120 : 148, lineHeight: 1, letterSpacing: -3, display: "flex" }}>{name}</div>
          <div style={{ fontSize: 52, fontStyle: "italic", color: "#E2C08D", marginTop: 8, display: "flex" }}>Potato Market Report 2026</div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderTop: "2px solid rgba(255,255,255,0.18)", paddingTop: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ fontSize: 84, display: "flex" }}>{big}</div>
            <div style={{ fontSize: 28, color: "#E2C08D", marginLeft: 14, fontFamily: "Helvetica, Arial, sans-serif", display: "flex" }}>{r ? `million tonnes, ${r.head.year}` : ""}</div>
          </div>
          <div style={{ fontSize: 24, color: "#B7B2AA", fontFamily: "Helvetica, Arial, sans-serif", display: "flex" }}>10 pages · November 2026</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
