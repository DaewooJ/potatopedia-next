"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";

// Routes that manage their own full-screen header/layout and shouldn't be
// wrapped in the global nav + footer (e.g. /ask has its own fixed header
// and fixed bottom input bar, calibrated assuming no ancestor chrome —
// the global Footer used to bleed into its layout and sit underneath the
// fixed input bar).
const NO_CHROME_ROUTES = ["/ask"];

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (NO_CHROME_ROUTES.includes(pathname)) return <>{children}</>;

  return (
    <>
      <Navigation />
      <main style={{ paddingTop: 68 }}>{children}</main>
      <Footer />
    </>
  );
}
