import Link from "next/link";
import LeadForm from "./LeadForm";
import { Figures, FeaturedSlot } from "./Editorial";
import { productionSeries, latestProduction, worldRank, fmtMt, LATEST_YEAR } from "../lib/production";

// Country dossier header (premium system, 7 Nov 2026): serif name, FAOSTAT figures band, an animated
// 2018–2024 production chart, the market-report request and a labelled featured slot. Every figure here is
// read from lib/faostat-timeseries.js (FAOSTAT QCL); the existing profile follows unchanged below.

function ProductionChart({ name, points }) {
  const W = 680, H = 250, x0 = 20, x1 = 640, yTop = 24, yBot = 210;
  const vals = points.map((p) => p.value);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.18 || hi * 0.1 || 1;
  lo = Math.max(0, lo - pad);
  hi = hi + pad;
  const x = (i) => x0 + (i * (x1 - x0)) / (points.length - 1);
  const y = (v) => yBot - ((v - lo) / (hi - lo)) * (yBot - yTop);
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const area = `${d} L${x(points.length - 1).toFixed(1)} ${yBot + 10} L${x0} ${yBot + 10} Z`;
  const peakI = vals.indexOf(Math.max(...vals));
  const ticks = [0, 1, 2, 3].map((k) => lo + ((hi - lo) * (3 - k)) / 3);
  const dec = hi - lo < 3 ? 2 : hi < 20 ? 1 : 0;
  const label = `${name} potato production ${points[0].year} to ${points[points.length - 1].year}: ${points.map((p) => `${p.year} ${p.value.toFixed(2)}`).join(", ")} million tonnes (FAOSTAT)`;
  const px = x(peakI), py = y(vals[peakI]);
  const anchor = px > W - 140 ? "end" : px < 120 ? "start" : "middle";
  return (
    <svg className="dz-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <g className="dz-grid">
        {ticks.map((t, k) => {
          const ty = yTop + (k * (yBot - yTop)) / 3;
          return <line key={k} x1={x0} y1={ty} x2={x1 + 10} y2={ty} />;
        })}
      </g>
      {ticks.map((t, k) => (
        <text key={k} className="dz-axis" x={x1 + 16} y={yTop + (k * (yBot - yTop)) / 3 + 4}>{t.toFixed(dec)}</text>
      ))}
      <path className="dz-area" d={area} />
      <path className="dz-line" d={d} />
      {points.map((p, i) => (
        <circle key={p.year} className={"dz-dot" + (i === peakI ? " peak" : "")} cx={x(i)} cy={y(p.value)} r={i === peakI ? 5 : 4} />
      ))}
      {points.map((p, i) => (
        <text key={p.year} className="dz-yr" x={x(i)} y={H - 8} textAnchor="middle">{p.year}</text>
      ))}
      <text className="dz-peak" x={px} y={Math.max(14, py - 14)} textAnchor={anchor}>{vals[peakI].toFixed(2)} · peak</text>
    </svg>
  );
}

export default function CountryDossier({ c, slug, children, extraFigures = [] }) {
  const points = productionSeries(slug);
  const latest = latestProduction(slug);
  const rank = worldRank(slug);
  const first = points?.[0];
  const peak = points ? points.reduce((a, b) => (b.value > a.value ? b : a)) : null;
  const change = first && latest != null ? ((latest - first.value) / first.value) * 100 : null;

  const figures = points
    ? [
        { n: fmtMt(latest), l: `Production · FAOSTAT ${LATEST_YEAR}` },
        rank ? { n: `#${rank}`, l: `World rank · FAOSTAT ${LATEST_YEAR}` } : null,
        { n: fmtMt(peak.value), l: `Peak ${first.year}–${String(LATEST_YEAR).slice(2)} · ${peak.year}` },
        change != null ? { n: `${change >= 0 ? "+" : "−"}${Math.abs(change).toFixed(1)}%`, l: `Change since ${first.year} · FAOSTAT` } : null,
      ].filter(Boolean)
    : [
        { n: `${c.prod} t`, l: "Production · FAOSTAT" },
        c.yield ? { n: c.yield, l: "Average yield" } : null,
        c.area ? { n: c.area, l: "Harvested area" } : null,
      ].filter(Boolean);

  return (
    <>
      <section className="dz-top">
        <p className="crumb">
          <Link href="/countries">Countries</Link><span aria-hidden="true">/</span>{c.region}<span aria-hidden="true">/</span>{c.name}
        </p>
        <p className="eyebrow rise">Country dossier{rank ? ` · #${rank} world producer` : ""}</p>
        <h1 className="dz-h1 rise" style={{ fontSize: "clamp(60px, 9.5vw, 110px)", lineHeight: 0.92 }}>{c.name}</h1>
        <p className="dz-lede">{c.highlight}</p>
        <Figures items={figures} label={`${c.name} potato production at a glance`} />
        {extraFigures.length > 0 && <Figures items={extraFigures} label={`${c.name} area, yield and consumption`} />}
      </section>

      <section className="dz-body" id="production">
        <div className="dz-cols">
          <div className="dz-main">
            {points ? (
              <>
                <div className="dz-h2-row">
                  <h2 className="dz-h2" style={{ margin: 0 }}>Production, {first.year}–{points[points.length - 1].year}</h2>
                  <span className="dz-h2-note">Million tonnes · FAOSTAT QCL</span>
                </div>
                <ProductionChart name={c.name} points={points} />
                <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--mute2)" }}>
                  Source: FAOSTAT QCL, item 116 (potatoes). World rank computed from the same {LATEST_YEAR} series.
                </p>
              </>
            ) : (
              <p style={{ fontSize: 15, color: "var(--mute)" }}>A FAOSTAT 2018–2024 series for {c.name} is not in our data yet.</p>
            )}
          </div>
          <aside className="dz-aside">
            <div className="panel">
              <p className="k" style={{ marginBottom: 8 }}>Market report</p>
              <p className="panel-t">The full {c.name} potato market report</p>
              <p className="panel-s">Production, trade partners, processors, cold storage and prices, every figure sourced.</p>
              <LeadForm
                dark
                compact
                type="report"
                hidden={{ report_country: c.name }}
                askCountry={false}
                askMessage={false}
                extra={[{ name: "segment", label: "Most interested in", options: ["Production & trade", "Processing", "Seed", "Cold storage", "Prices", "Everything"] }]}
                submitLabel="Request the report"
              />
            </div>
            <FeaturedSlot kicker={`Featured in ${c.name} · available`} title="Your company, labelled" sub={`Processors, cold stores and machine makers serving ${c.name}.`} />
            <nav className="card" style={{ padding: 22 }} aria-label="On this page">
              <p className="k" style={{ marginBottom: 6 }}>On this page</p>
              <ul className="dz-list">
                <li><a href="#production">Production trend <span className="arr">→</span></a></li>
                <li><a href="#profile">Full {c.name} profile <span className="arr">→</span></a></li>
                <li><Link href={`/ask?q=${encodeURIComponent(`Potato industry in ${c.name}`)}`}>Ask about {c.name} <span className="arr">→</span></Link></li>
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      <div id="profile" className="pp-legacy dz-legacy">{children}</div>
    </>
  );
}
