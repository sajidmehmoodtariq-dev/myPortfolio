import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { portfolioIdentity } from "../content/identity";
import { SiteMotion } from "../components/site-motion";
import "./styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(portfolioIdentity.siteUrl),
  title: {
    default: `${portfolioIdentity.siteName} — ${portfolioIdentity.name}`,
    template: `%s — ${portfolioIdentity.siteName}`,
  },
  description: "An interactive study in how things are made, by Sajid Mehmood Tariq.",
  authors: [{ name: portfolioIdentity.name }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}<SiteMotion /></body>
    </html>
  );
}
