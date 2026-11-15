import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { portfolioIdentity } from "../content/identity";
import { SiteMotion } from "../components/site-motion";
import "./styles.css";
import { homepageTitle, homepageDescription, socialImage } from "../content/seo";

export const metadata: Metadata = {
  metadataBase: new URL(portfolioIdentity.siteUrl),
  title: {
    default: homepageTitle,
    template: `%s — ${portfolioIdentity.siteName}`,
  },
  description: homepageDescription,
  authors: [{ name: portfolioIdentity.name }],
  openGraph: { type: "website", siteName: portfolioIdentity.siteName, images: [socialImage()] },
  twitter: { card: "summary_large_image", images: [socialImage()] },
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person", "@id": `${portfolioIdentity.siteUrl}/#person`,
      name: portfolioIdentity.name, url: `${portfolioIdentity.siteUrl}/`,
      jobTitle: portfolioIdentity.role, sameAs: [portfolioIdentity.github, portfolioIdentity.linkedin],
    },
    {
      "@type": "WebSite", "@id": `${portfolioIdentity.siteUrl}/#website`,
      name: portfolioIdentity.siteName, url: `${portfolioIdentity.siteUrl}/`,
      publisher: { "@id": `${portfolioIdentity.siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        {children}<SiteMotion />
      </body>
    </html>
  );
}
