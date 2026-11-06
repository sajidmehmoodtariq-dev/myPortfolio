import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { indexable, siteName, siteOrigin } from "@/lib/site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: siteName,
  metadataBase: siteOrigin,
  robots: indexable
    ? { index: true, follow: true, "max-image-preview": "large" }
    : { index: false, follow: false },
  verification: indexable && process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
