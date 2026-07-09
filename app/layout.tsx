import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MockSessionProvider } from "@/components/mock-session-provider";
import { RoleSwitcher } from "@/components/role-switcher";
import { Header } from "@/components/header";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { QueryProvider } from "@/components/query-provider";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1f5638" },
    { media: "(prefers-color-scheme: dark)", color: "#11140f" },
  ],
};

export const metadata: Metadata = {
  title: "Minara - Connect with Muslim Businesses",
  description: "Keep Muslim money within the Muslim community. Find halal services, Muslim-owned businesses, masjids, and community aid in Sacramento.",
  keywords: ["halal", "muslim business", "masjid", "islamic center", "sacramento", "halal food", "muslim owned"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Minara",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://minara.market",
    siteName: "Minara",
    title: "Minara - Connect with Muslim Businesses",
    description: "Keep Muslim money within the Muslim community. Find halal services, Muslim-owned businesses, masjids, and community aid in Sacramento.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Minara - Muslim Business Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minara - Connect with Muslim Businesses",
    description: "Find halal services, Muslim-owned businesses, and masjids in Sacramento.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts loaded via <link> (the Turbopack CSS pipeline drops a 2nd remote @import) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <LanguageProvider>
            <MockSessionProvider>
              <Header />
              <main>{children}</main>
              <RoleSwitcher />
            </MockSessionProvider>
          </LanguageProvider>
        </QueryProvider>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html:
              process.env.NODE_ENV === "production"
                ? `if ('serviceWorker' in navigator) {
                     window.addEventListener('load', function () {
                       navigator.serviceWorker.register('/sw.js').catch(function () {});
                     });
                   }`
                : `/* dev: never serve a stale build — remove any installed SW + caches */
                   if ('serviceWorker' in navigator) {
                     navigator.serviceWorker.getRegistrations().then(function (rs) {
                       rs.forEach(function (r) { r.unregister(); });
                     });
                   }
                   if (window.caches && caches.keys) {
                     caches.keys().then(function (ks) { ks.forEach(function (k) { caches.delete(k); }); });
                   }`,
          }}
        />
      </body>
    </html>
  );
}
