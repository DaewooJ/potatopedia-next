import { Poppins } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import SiteChrome from "../components/SiteChrome";
import { serif, sans } from "../lib/fonts";
import { PP_CSS, THEME_INIT } from "../lib/theme";

// Poppins stays only for /ask (its own full-screen layout) and the legal pages' literal font stacks;
// it is not preloaded, so reading pages load just Instrument Serif + Inter (premium system, 7 Nov 2026).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

export const metadata = {
  title: {
    default: "Potatopedia — The Potato Reference, Sourced",
    template: "%s — Potatopedia",
  },
  description:
    "Ask anything about potatoes and get the sourced answer: production, prices, trade, varieties, diseases and the companies behind the industry, from FAOSTAT, USDA, CIP and ICAR-CPRI.",
  metadataBase: new URL("https://www.potatopedia.com"),
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon-192.png", type: "image/png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Potatopedia",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "5j5riz0z-q9ABFVTMqv6BAT7eCnIJrAmGRpw4ngDJpY",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF8F2" },
    { media: "(prefers-color-scheme: dark)", color: "#16140F" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0CXVFJDBF7"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0CXVFJDBF7');
          `}
        </Script>
        {/* Global styles — inline approach matching existing app */}
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { -webkit-font-smoothing: antialiased; }
          @keyframes ppFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes ppFadeIn { from { opacity: 0; } to { opacity: 1; } }
          .pp-fade-up { animation: ppFadeUp 0.7s ease-out both; }
          @keyframes ppShimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
          .pp-shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%); background-size: 800px 100%; animation: ppShimmer 1.5s ease-in-out infinite; border-radius: 8px; }
          @media (max-width: 768px) {
            .pp-desktop-links { display: none !important; }
            .pp-hamburger { display: flex !important; }
          }
        `}</style>
        <style>{PP_CSS}</style>
      </head>
      <body className={poppins.className}>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
