"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ThemeFab from "./ThemeFab";
import SuggestCorrection from "./SuggestCorrection";

// Routes that manage their own full-screen header/layout and shouldn't be
// wrapped in the global nav + footer (e.g. /ask has its own fixed header
// and fixed bottom input bar, calibrated assuming no ancestor chrome —
// the global Footer used to bleed into its layout and sit underneath the
// fixed input bar).
// "/" (homepage) has its own header, footer and theme switch in the premium design (7 Nov 2026).
const NO_CHROME_ROUTES = ["/ask", "/"];

// Every other page: premium chrome (serif wordmark nav, dark footer) on the ivory reading theme,
// with the ripple theme switch (light by default, its own remembered choice).
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (NO_CHROME_ROUTES.includes(pathname)) return <>{children}</>;

  return (
    <div className="pp">
      <Navigation />
      <main>{children}</main>
      <SuggestCorrection />
      <Footer />
      <ThemeFab target="html" defaultTheme="light" storageKey="pp-read-theme" />
    </div>
  );
}
