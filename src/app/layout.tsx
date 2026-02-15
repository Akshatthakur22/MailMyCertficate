import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mailmycertificate.com'),
  title: {
    default: "MailMyCertificate | Bulk Certificate Generator & Automator",
    template: "%s | MailMyCertificate"
  },
  description: "Free, privacy-first bulk certificate generator. Generate 1000+ localized PDFs in minutes entirely in your browser. No data leaves your device. Open source.",
  keywords: ["bulk certificate generator", "certificate automation", "free certificate maker", "privacy-first", "browser-based PDF generation", "Next.js certificate tool"],
  authors: [{ name: "Akshat Thakur", url: "https://github.com/akshatthakur22" }],
  creator: "Akshat Thakur",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mailmycertificate.com",
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
    icon: "/icon-192.png",
    apple: "/icon-192.png",
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>


      <body className={`${inter.variable} antialiased`}>
        {children}
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
