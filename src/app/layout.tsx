import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsProvider";
import { GoogleTagManager, GoogleTagManagerNoscript } from "@/components/analytics/GoogleTagManager";
import { GlobalStructuredData } from "@/components/seo/GlobalStructuredData";
import { absoluteUrl } from "@/config/site";
import { getGoogleSiteVerification, getRootMetadataBase } from "@/lib/metadata";
import { SEO_KEYWORDS } from "@/lib/seo-keywords";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getRootMetadataBase(),
  title: {
    default: "MailMyCertificate | Free Bulk Certificate Generator & Gmail Sender",
    template: "%s | MailMyCertificate"
  },
  description: "Generate and email hundreds of personalized certificates in minutes. Upload a template + CSV, create PDFs locally in your browser, send via Gmail. Free, private, open source.",
  keywords: [...SEO_KEYWORDS.home],
  verification: getGoogleSiteVerification(),
  authors: [{ name: "Akshat Thakur", url: "https://github.com/akshatthakur22" }],
  creator: "Akshat Thakur",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl('/'),
    title: "MailMyCertificate | Free Bulk Certificate Automation",
    description: "Generate and send professional certificates in bulk. Local-first, private, and lightning fast.",
    siteName: "MailMyCertificate",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "MailMyCertificate - Bulk Certificate Generator"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MailMyCertificate | Bulk Certificate Generator",
    description: "Generate personalized certificates in bulk directly in your browser. Privacy-first, open-source.",
    images: ["/og-image.png"],
    creator: "@akshatt66612958",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/favicon-48.png",
  },
  alternates: {
    canonical: "/",
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1F4ED8" />
        <link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/icon-192.png" sizes="192x192" />
      </head>


      <body className={`${inter.variable} antialiased`}>
        <GoogleTagManagerNoscript />
        <GlobalStructuredData />
        <GoogleTagManager />
        <AnalyticsTracker />
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>

  );
}
