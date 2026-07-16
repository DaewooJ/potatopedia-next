import { Poppins } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import SiteChrome from "../components/SiteChrome";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Potatopedia — AI-Powered Potato Knowledge Base",
    template: "%s — Potatopedia",
  },
  description:
    "The world's most comprehensive potato knowledge base. Production data, trade flows, varieties, and research across 204 countries. Powered by verified data from FAOSTAT, USDA, and CIP.",
  metadataBase: new URL("https://www.potatopedia.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
          body { -webkit-font-smoothing: antialiased; background: #fff; }
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
      </head>
      <body className={poppins.className}>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
