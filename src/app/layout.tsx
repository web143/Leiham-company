import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: 'Leiham Company — Royal Prestige®',
  description: 'Catálogo de productos y calculadora de financiamiento Royal Prestige®',
  openGraph: {
    title: 'Leiham Company — Royal Prestige®',
    description: 'Catálogo de productos y calculadora de financiamiento Royal Prestige®',
    url: 'https://leiham-company.vercel.app',
    siteName: 'Leiham Company',
    images: [
      {
        url: 'https://leiham-company.vercel.app/catalogo_pages/webp/page-01.webp',
        width: 1400,
        height: 1000,
        alt: 'Leiham Company — Royal Prestige®',
      },
    ],
    locale: 'es_DO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leiham Company — Royal Prestige®',
    description: 'Catálogo de productos y calculadora de financiamiento Royal Prestige®',
    images: ['https://leiham-company.vercel.app/catalogo_pages/webp/page-01.webp'],
  },
};

// Viewport export: blocks pinch-to-zoom on Android/Chromium/Brave via meta viewport tag.
// iOS Safari ignores user-scalable=no by policy — handled separately in page.tsx via touchmove listener.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import ErrorBoundary from "@/components/ErrorBoundary";
import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0066B3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Leiham" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
                
                let refreshing = false;
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                  if (refreshing) return;
                  refreshing = true;
                  window.location.reload();
                });
              });
            }
          `
        }} />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </SmoothScroll>
      </body>
    </html>
  );
}
