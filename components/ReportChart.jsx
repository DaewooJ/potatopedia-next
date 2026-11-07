// Public production chart for a report landing page: inline SVG line chart of the FAOSTAT series, theme-aware via CSS vars.
export default function ReportChart({ name, series, source }) {
  const W = 680, H = 260, L = 12, R = 668, T = 34, B = 224;
  const vals = series.map((p) => p.v);
  const hi = Math.max(...vals), lo = Math.min(...vals);
  const pad = (hi - lo) * 0.25 || hi * 0.1;
  const yLo = Math.max(0, lo - pad), yHi = hi + pad;
  const x = (i) => L + 24 + (i * (R - L - 48)) / (series.length - 1);
  const y = (v) => B - ((v - yLo) / (yHi - yLo)) * (B - T);
  const line = series.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1).toFixed(1)},${B} L${x(0).toFixed(1)},${B} Z`;
  const d = hi < 10 ? 2 : 1;
  const peakI = vals.indexOf(hi);
  const summary = `${name} potato production ${series[0].y} to ${series[series.length - 1].y}, million tonnes: ${series.map((p) => `${p.y} ${p.v.toFixed(d)}`).join(", ")}. Source: ${source}.`;
  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} style={{ width: "100%", height: "auto", display: "block" }}>
        <path d={area} fill="var(--gold)" opacity="0.10" />
        <line x1={L} x2={R} y1={B} y2={B} stroke="var(--line2)" />
        <path d={line} fill="none" stroke="var(--gold)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        {series.map((p, i) => {
          const hot = i === series.length - 1 || i === peakI;
          return (
            <g key={p.y}>
              <circle cx={x(i)} cy={y(p.v)} r={hot ? 5 : 3.5} fill={hot ? "var(--gold)" : "var(--card)"} stroke="var(--gold)" strokeWidth="2" />
              <text x={x(i)} y={y(p.v) - 12} textAnchor="middle" fontSize={hot ? 15 : 13} fontWeight={hot ? 600 : 400} fill={hot ? "var(--ink)" : "var(--mute)"}>{p.v.toFixed(d)}</text>
              <text x={x(i)} y={B + 24} textAnchor="middle" fontSize="13" fill="var(--mute)">{p.y}</text>
            </g>
          );
        })}
      </svg>
      <figcaption style={{ fontSize: 12.5, color: "var(--mute2)", marginTop: 8 }}>
        {name} potato production, million tonnes per calendar year. Source: {source}.
      </figcaption>
    </figure>
  );
}
