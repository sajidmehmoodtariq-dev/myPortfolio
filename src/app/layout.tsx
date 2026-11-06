import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { portfolioIdentity } from "@/content/portfolio";
import "./globals.css";

export const metadata: Metadata = {
  title: `${portfolioIdentity.name} | The Engineering Exhibit`,
  description: `${portfolioIdentity.role} based in ${portfolioIdentity.location}.`,
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
