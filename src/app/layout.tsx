import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generate Certificates Online | Fast & Free Certificate Automation Tool",
  description: "Generate and send professional certificates in minutes. The open-source, engineering-driven certificate automation tool.",
  openGraph: {
    title: "Generate Certificates Online | Fast & Free Certificate Automation Tool",
    description: "Generate and send professional certificates in minutes. The open-source, engineering-driven certificate automation tool.",
    type: "website",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1F4ED8" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; worker-src 'self' blob:; connect-src 'self' https://*.sentry.io https://api.brevo.com;"
        />
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
