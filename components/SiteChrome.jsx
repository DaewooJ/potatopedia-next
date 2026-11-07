"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ThemeFab from "./ThemeFab";
import SuggestCorrection from "./SuggestCorrection";

// "/" (homepage) has its own header, footer and theme switch in the premium design (7 Nov 2026).
const NO_CHROME_ROUTES = ["/"];
// /ask is the full-screen research desk (7 Nov 2026): shared Navigation on top, but no footer and no floating
// theme button, because its composer is sticky at the bottom of the reading column (the desk has its own theme toggle).
const DESK_ROUTES = ["/ask"];

// Every other page: premium chrome (serif wordmark nav, dark footer) on the ivory reading theme,
// with the ripple theme switch (light by default, its own remembered choice).
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (NO_CHROME_ROUTES.includes(pathname)) return <>{children}</>;
  if (DESK_ROUTES.includes(pathname)) {
    return (
      <div className="pp">
        <Navigation />
        <main>{children}</main>
      </div>
    );
  }

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
