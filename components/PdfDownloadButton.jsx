import PdfDownloadButtonClient from "./PdfDownloadButtonClient";

// Server wrapper: reads REPORT_GATE_LIVE at build/render time (country pages are static, so
// changing the env var needs a redeploy). See docs/report-gate.md.
export default function PdfDownloadButton(props) {
  const gated = process.env.REPORT_GATE_LIVE === "true" && !!process.env.REPORT_LINK_SECRET;
  return <PdfDownloadButtonClient {...props} gated={gated} />;
}
