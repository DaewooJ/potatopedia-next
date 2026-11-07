// Helpers over the FAOSTAT QCL production series (lib/faostat-timeseries.js, million tonnes, 2018–2024).
// Ranks are computed from the same series, so every rank shown next to a FAOSTAT 2024 label is reproducible.
import { PRODUCTION_TIMESERIES, FAOSTAT_YEARS } from "./faostat-timeseries";

export const LATEST_YEAR = FAOSTAT_YEARS[FAOSTAT_YEARS.length - 1];

const ranked = Object.entries(PRODUCTION_TIMESERIES)
  .filter(([, s]) => typeof s[LATEST_YEAR] === "number")
  .sort((a, b) => b[1][LATEST_YEAR] - a[1][LATEST_YEAR])
  .map(([slug]) => slug);

export function productionSeries(slug) {
  const s = PRODUCTION_TIMESERIES[slug];
  if (!s) return null;
  const points = FAOSTAT_YEARS.map((y) => ({ year: y, value: s[y] })).filter((p) => typeof p.value === "number");
  return points.length >= 2 ? points : null;
}

export function latestProduction(slug) {
  const v = PRODUCTION_TIMESERIES[slug]?.[LATEST_YEAR];
  return typeof v === "number" ? v : null;
}

export function worldRank(slug) {
  const i = ranked.indexOf(slug);
  return i === -1 ? null : i + 1;
}

export function fmtMt(v) {
  if (v == null) return "—";
  return v >= 10 ? `${v.toFixed(2)} Mt` : v >= 1 ? `${v.toFixed(2)} Mt` : `${(v * 1000).toFixed(0)} kt`;
}
