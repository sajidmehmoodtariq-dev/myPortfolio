import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteName, siteOrigin } from "@/lib/site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: siteName,
  metadataBase: siteOrigin,
  robots: { index: Boolean(siteOrigin), follow: Boolean(siteOrigin) },
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
