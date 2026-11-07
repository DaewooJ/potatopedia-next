import { Instrument_Serif, Inter } from "next/font/google";

// The two premium-system fonts (7 Nov 2026), loaded once and shared by the root layout and the homepage.
// Exposed as CSS variables: --hp-serif (headings, wordmark) and --hp-sans (body).
export const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--hp-serif" });
export const sans = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap", variable: "--hp-sans" });
